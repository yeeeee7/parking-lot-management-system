<template>
    <div class="parkingSpace">
        <nav-bar></nav-bar>
        <el-container>
        <el-main>
        <div class="table-filter">
            {{parkName}}
        </div>
        <div class="table-filter">
            <el-button type="primary" @click="add()">添加停车位</el-button>
        </div>
        <div class="parkPot">
            <el-row :gutter="20">
                <el-col :span="3" v-for="(item,index) in tableData" :index="index">
                    <div class="grid-content">
                        <el-tooltip class="item" effect="dark" :content="item.pNum+'号'" placement="top">
                            <div :class="seat[item.status-1]" @click="del(item.pId)"></div>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-row>
        </div>  
        </el-main>
        <el-aside width="200px" class="aside-right">
        <div style="margin:30px 0;">
        车位状态表示
        </div>
            <div>
              <div :class="seat[0]"></div>空车位
               </div>
              <div>
              <div :class="seat[1]"></div>已预约
               </div>
                <div>
              <div :class="seat[2]"></div>已停车
               </div>
           
        </el-aside>
        </el-container>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" >
            <el-form  class="park-pot"  >
                <el-form-item>
                    <el-input style="width:200px"v-model="pNum"placeholder="车位号"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAdd()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
            <span>确认删除？删除后数据不可恢复</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDel()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import navBar from '../../../common/navBar'
    export default {
        name: "parkingSpace",
        components: {
            navBar
        },
        data() {
            return {
                dialogTitle:"添加停车场",
                dialogVisible: false,
                delDialogVisible: false,
                status:"",
                pNum:null,
                tableData:[],
                seat:[
                    'seat',
                    'seat-order',
                    'seat-checked'
                ],
                pId:'',
                parkName:localStorage.getItem("parkName")

            }
        },
        mounted(){
            this.postQuery();
        },
        methods:{
            rowStyle:function(){
                return {
                    "text-align":"center!important",
                    "color":"black"
                }
            },
            resoleQuery:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/queryPlace',{
                        "parkId":localStorage.getItem("parkId"),
                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postQuery(){
                let response=await this.resoleQuery();
                this.tableData=response.data.data;
            },
            resoleAdd:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/addPlace',{
                        "parkId":$this.$store.state.parkId,
                        "pNum":$this.pNum
                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postAdd(){
                let response=await this.resoleAdd();
                if(response.data.success){
                    this.postQuery();
                }else{
                var  h = this.$createElement;
                 this.$notify({
                        title: '',
                        message: h('i', { style: 'color: teal'}, response.data.errorMsg),
                        type: 'warning',
                        position: 'right-bottom',
                        duration:1000
                    });
                }
                this.pNum=null;
            },
            resoleDel:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/deletePlace',{
                        "pId":$this.pId
                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postDel(){
                let response=await this.resoleDel();
                if(response.data.success){
                    this.postQuery();
                }else{
                var  h = this.$createElement;
                 this.$notify({
                        title: '',
                        message: h('i', { style: 'color: teal'}, response.data.errorMsg),
                        type: 'warning',
                        position: 'right-bottom',
                        duration:1000
                    });
                }

            },
            add:function(){
                this.dialogVisible =true;
                this.dialogTitle="添加停车位";

            },
            confirmAdd:function(){
                this.dialogVisible = false;
                this.postAdd();
            },
            confirmDel:function(){
                this.delDialogVisible = false;
                this.postDel();
            },
            del:function(pId){
                this.delDialogVisible=true;
                this.pId=pId;
            },
            change:function(){
                this.dialogVisible =true;
                this.dialogTitle="更改停车位";

            },
            detail:function(){
                this.$router.push('/parkSpace');
            },
        }
    }
</script>

<style scoped>
    .parkPot{
        padding:30px;
    }
    .table-filter{
        width:100%;
        height:50;
        text-align:left;
        line-height:50px;
        margin-left:20px;
    }
    footer{
        position:fixed;
        bottom:20px;
        width:100%;
    }
    .seat {
        display:inline-block;
        width: 50px;
        height: 50px;
        background-size: cover;
        background-image: url("../../../../images/park_seat.png");
        vertical-align: middle;
    }
    .seat-order {
        display:inline-block;
        width: 50px;
        height: 50px;
        background-size: cover;
        background-image: url("../../../../images/park-order.png");
        vertical-align: middle;
    }
    .seat-checked {
        display:inline-block;
        width: 50px;
        height: 50px;
        background-size: cover;
        background-image: url("../../../../images/parck-checked.png");
        vertical-align: middle;
    }
    .aside-right{
        text-align:left;
    }
</style>
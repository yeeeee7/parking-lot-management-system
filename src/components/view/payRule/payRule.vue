<template>
    <div class="parkPot">
        <nav-bar active-index="payRule"></nav-bar>
        <div class="table-filter">
            <div style='float: left; margin-right: 20px;'>
                <el-input style="width:200px" v-model="content" placeholder="停车场名字"></el-input>
                <el-button type="primary" @click="postSearch()">查找</el-button>
            </div>
            <el-button type="primary" @click="add()">添加收费策略</el-button>
            <el-button type="primary"@click="exportDate()">报表导出</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="rowStyle" border>
            <el-table-column prop="parkName" label="停车场名称" ></el-table-column>
            <el-table-column prop="oneHour" label="1小时" ></el-table-column>
            <el-table-column prop="threeHour" label="3小时"></el-table-column>
            <el-table-column prop="fiveHour" label="5小时"></el-table-column>
            <el-table-column prop="capping" label="封顶"></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="small" type="warning"@click="change(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <footer>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 15, 25, 50]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </footer>
        <el-dialog title="添加收费策略" :visible.sync="dialogVisible" >
            <el-form  class="park-pot"  >
                <el-form-item >
                    <el-input style="width:200px" v-model='parkName'placeholder="停车场名称"></el-input>
                    <el-button type="primary" @click="postContent">查找停车场</el-button>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="select" placeholder="请选择" v-show="isSelectShow">
                        <el-option
                                v-for="(item,index) in options"
                                :key="index"
                                :label="item.parkName"
                                :value="item.parkId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input style="width:200px" v-model="info.oneHour" placeholder="1小时费用"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input style="width:200px" v-model="info.threeHour" placeholder="3小时费用"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input style="width:200px" v-model="info.fiveHour" placeholder="5小时费用"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input style="width:200px" v-model="info.capping" placeholder="封顶"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="postAdd()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改收费策略" :visible.sync="changeDialogVisible" >
            <el-form  class="park-pot"  >
                <el-form-item>
                  1小时费用:
                    <el-input style="width:200px" v-model="info.oneHour" placeholder="1小时费用"></el-input>
                </el-form-item>
                <el-form-item>
                 3小时费用:
                    <el-input style="width:200px" v-model="info.threeHour" placeholder="3小时费用"></el-input>
                </el-form-item>
                <el-form-item>
                5小时费用:
                    <el-input style="width:200px" v-model="info.fiveHour" placeholder="5小时费用"></el-input>
                </el-form-item>
                <el-form-item>
                封顶费用:
                    <el-input style="width:200px" v-model="info.capping" placeholder="封顶"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
            <span>确认删除？删除后数据不可恢复</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="delDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import navBar from '../../common/navBar'
    const ExportJsonExcel = require('js-export-excel')
    export default {
        name: "parkPot",
        components: {
            navBar
        },
        data() {
            return {
                dialogTitle:"添加收费策略",
                dialogVisible: false,
                changeDialogVisible: false,
                delDialogVisible: false,
                tableData: [],
                status:"",
                isSelectShow:false,
                parkName:'',
                info:{
                    "strategyId":"",
                    "oneHour":"",
                    "threeHour":"",
                    "fiveHour":"",
                    "capping":""

                },
                select:"",
                options:[],
                currentPage: 1,
                total:0,
                pageSize:5,
                content:"",
            }
        },
        mounted(){
            this.postQuery();
        },
        methods:{
            resoleSearch:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/chargeStrategyByContent',{
                        "pageNum": $this.currentPage,
                        "pageSize":"5",
                        "parkName":$this.content
                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postSearch(){
                let response=await this.resoleSearch();
                let res=response.data.data.allChargeStrategyDtos;
                console.log(response)
                this.tableData=res;
                this.total=response.data.data.sum;
            },
            rowStyle:function(){
                return {
                    "text-align":"center!important",
                    "color":"black"
                }
            },
            handleSizeChange(val) {
                this.pageSize=val;
                this.postQuery();
            },
            handleCurrentChange(val) {
                this.currentPage=val;
                if(this.content){
                    this.postSearch();
                }else {
                    this.postQuery();
                }
            },
            resoleQuery:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/allChargeStrategy',{
                        "pageNum":$this.currentPage,
                        "pageSize":$this.pageSize
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
                this.tableData=response.data.data.allChargeStrategyDtos;
                this.total=response.data.data.sum;
            },
            resoleAdd:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/addChargeStrategy',{
                        "parkId":$this.select,
                        "oneHour":$this.info.oneHour,
                        "threeHour":$this.info.threeHour,
                        "fiveHour":$this.info.fiveHour,
                        "capping":$this.info.capping
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
                if(response.data.success) {
                    this.pageSize=5;
                    this.currentPage=1;
                    this.postQuery();
                    this.info = {};
                    this.dialogVisible = false

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
            resoleEdit:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/editChargeStrategy',{
                        "strategyId":$this.info.strategyId,
                        "oneHour":$this.info.oneHour,
                        "threeHour":$this.info.threeHour,
                        "fiveHour":$this.info.fiveHour,
                        "capping":$this.info.capping
                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postEdit(){
                let response=await this.resoleEdit();
                if(response.data.success){
                    this.pageSize=5;
                    this.currentPage=1;
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
            resoleContent: function () {
                let $this = this;
                return new Promise(function (resolve, reject) {
                    var res = $this.$axios.post('/queryParkByContent', {
                        "content":$this.parkName
                    });
                    if (res) {
                        resolve(res);
                    } else {
                        reject(new Error())
                    }
                });
            },
            async postContent() {
                let response = await this.resoleContent();
                if(response.data.data.length>0){
                    this.isSelectShow=true;
                    this.options=response.data.data;
                }
                else{
                    var  h = this.$createElement;
                    this.$notify({
                        title: '',
                        message: h('i', { style: 'color: teal'}, '暂无此停车场'),
                        type: 'warning',
                        position: 'right-bottom',
                        offset: 300,
                        duration:1000
                    });
                    return 0;
                }
            },
            confirmEdit:function(){
                this.changeDialogVisible = false;
                this.postEdit();
            },
            add:function(){
                this.dialogVisible =true;

            },
            del:function(){
                this.delDialogVisible=true;
            },
            change:function(info){
                this.info=info;
                this.changeDialogVisible =true;

            },
            exportDate:function(){
                var option={};
                option.fileName = '停车场收费策略'
                option.datas=[
                    {
                        sheetData:this.tableData,
                        sheetName:'sheet',
                        sheetFilter:['parkName','oneHour','threeHour','fiveHour','capping'],
                        sheetHeader: ['停车场名称','1小时','3小时','5小时','封顶']
                    }
                ];
                let  toExcel=new ExportJsonExcel(option);
                toExcel.saveExcel();

            }
        }
    }
</script>

<style scoped>
    .table-filter{
        width:100%;
        height:100px;
        text-align:left;
        line-height:100px;
        margin-left:20px;
    }
    footer{
        position:fixed;
        bottom:20px;
        width:100%;
    }

</style>
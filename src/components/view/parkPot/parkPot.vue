<template>
    <div class="parkPot">
        <nav-bar active-index="parkPot"></nav-bar>
        <div class="table-filter">
            <div style='float: left; margin-right: 20px;'>
                <el-input style="width:200px" v-model="content" placeholder="停车场名字"></el-input>
                <el-button type="primary" @click="postSearch()">查找</el-button>
            </div>
            <el-button type="primary" @click="add()">添加停车场</el-button>
            <el-button type="primary"@click="exportDate()">报表导出</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" max-height="400" :header-cell-style="rowStyle" border>
            <el-table-column prop="parkName" label="停车场名称" ></el-table-column>
            <el-table-column prop="parkAddress" label="地址" ></el-table-column>
            <el-table-column prop="parkDetail" label="停车场介绍"></el-table-column>
            <el-table-column prop="openTime" label="开放时间"></el-table-column>
            <el-table-column prop="closeTime" label="歇业时间"></el-table-column>
            <el-table-column prop="longitude" label="经度"></el-table-column>
            <el-table-column prop="latitude" label="纬度"></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="detail(scope.row.parkName,scope.row.parkId)">车位管理</el-button>
                    <el-button size="small" type="warning"@click="change(scope.row)">修改</el-button>
                    <el-button size="small" type="danger"@click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <footer>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 25, 50]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </footer>
        <el-dialog title="修改停车场信息" :visible.sync="changeDialogVisible" >
            <el-form  class="park-pot"  >
                <el-form-item>
                停车场介绍：
                    <el-input style="width:200px" v-model="info.parkDetail" placeholder="停车场介绍"></el-input>
                </el-form-item>
                <el-form-item>
                开放时间：
                    <el-time-picker v-model="info.openTime" placeholder="开放时间" value-format="HH:mm:ss"></el-time-picker>
                </el-form-item>
                <el-form-item>
                歇业时间：
                    <el-time-picker v-model="info.closeTime" placeholder="歇业时间" value-format="HH:mm:ss"></el-time-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmChange">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
            <span>确认删除？删除后数据不可恢复</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDel">确 定</el-button>
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
                map:"",
                dialogVisible: false,
                changeDialogVisible: false,
                delDialogVisible: false,
                tableData: [],
                parkDetail:"",
                start:"",
                end:"",
                currentPage: 1,
                info:{
                    "parkId":"",
                    "parkDetail":"",
                    "openTime":"",
                    "closeTime":""
                  
                },
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
                    var res = $this.$axios.post('/queryParkByParkName',{
                        "pageNum":$this.currentPage,
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
                let res=response.data.data.parkDtos;
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
                    var res = $this.$axios.post('/allPark',{
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
                this.tableData=response.data.data.parkDtos;
                this.total=response.data.data.sum;

            },
            resoleEdit:function(info){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/editPark',{
                        "parkId":info.parkId,
                        "parkName":info.parkName,
                        "parkAddress":info.parkAddress,
                        "parkDetail":$this.info.parkDetail,
                        "openTime":$this.info.openTime,
                        "closeTime":$this.info.closeTime,
                        "longitude":info.longitude,
                        "latitude":info.latitude

                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postEdit(info){
                let response=await this.resoleEdit(info);
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
            resoleDel:function(info){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/deletePark',{
                        "parkId":info.parkId
                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postDel(info){
                let response=await this.resoleDel(info);
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
                this.$router.push("addParkPot")
            },
            del:function(info){
                this.info=info;
                this.delDialogVisible=true;
            },
            change:function(info){
                this.info=info;
                this.changeDialogVisible =true;
            },
            confirmChange:function(){
                this.changeDialogVisible = false;
                this.postEdit(this.info)
            },
            confirmDel:function(){
                this.delDialogVisible = false;
                this.postDel(this.info)
            },
            detail:function(parkName,id){
                localStorage.setItem("parkId",id);
                localStorage.setItem("parkName",parkName);
                this.$store.commit('postParkId',id);
                this.$router.push('/parkSpace');
            },
            exportDate:function(){
                var option={};
                option.fileName = '停车场信息'
                option.datas=[
                    {
                        sheetData:this.tableData,
                        sheetName:'sheet',
                        sheetFilter:['parkName','parkAddress','parkDetail','openTime','openTime','longitude','latitude'],
                        sheetHeader: ['停车场名称','地址','停车场介绍','开放时间','歇业时间','经度','纬度']
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

    #map{
        width:400px;
        height:400px;
    }

</style>
<template>
    <div class="user">
        <nav-bar active-index="index"></nav-bar>
        <div class="table-filter">
            <el-form  class="myself-info" >
                <el-form-item>
                    <el-input style="width:200px" v-model="content" placeholder="姓名/手机号码/用户名"></el-input>
                    <el-button type="primary" @click="postSearch()">查找</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"@click="exportDate()">报表导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table class="user-table":data="tableData" stripe style="width: 100%" max-height="400" :header-cell-style="rowStyle" border>
            <el-table-column prop="name" label="姓名" ></el-table-column>
            <el-table-column prop="phone" label="手机号码" ></el-table-column>
            <el-table-column prop="userName" label="用户名"></el-table-column>
            <el-table-column label="所拥有车辆信息" width="300">
                <template slot-scope="scope">
                    <el-button @click="detail(scope.row.userId)" type="primary"size="small">详细</el-button>
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
        <el-dialog title="车主所持车辆详细信息" :visible.sync="dialogVisible">
            <el-table class="user-table":data="userDetail" stripe style="width: 100%" :header-cell-style="rowStyle" border>
                <el-table-column prop="carNumber" label="车牌" ></el-table-column>
                <el-table-column prop="carName" label="型号" ></el-table-column>
                <el-table-column prop="carColor" label="颜色"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    const ExportJsonExcel = require('js-export-excel')
    import navBar from '../../common/navBar'
    export default {
        name: "user",
        components: {
            navBar
        },
        data() {
            return {
                dialogVisible: false,
                tableData: [],
                userId:"",
                content:"",
                userDetail:[],
                currentPage: 1,
                total:0,
                pageSize:5
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
                    var res = $this.$axios.post('/queryUser',{
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
                let res=response.data.data.userDtos;
                this.tableData=res;
                this.total=response.data.data.sum;
            },
            resoleDetail:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/queryCar',{
                        "userId":$this.userId
                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async psotDetail(){
                let response=await this.resoleDetail();
                let res=response.data.data;
               this.userDetail=res;
            },
            resoleSearch:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/queryUserByContent',{
                        "pageNum": $this.currentPage,
                        "pageSize":"5",
                        "content":$this.content
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
                let res=response.data.data.userDtos;
                this.tableData=res;
                this.total=response.data.data.sum;
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
            gotoDetail:function(){
                this.$router.push('/parkSpace');
            },
            detail:function(userId){
                this.userId=userId;
                this.psotDetail();
                this.dialogVisible=true
            },
            exportDate:function(){
                var option={};
                option.fileName = '用户信息'
                option.datas=[
                    {
                        sheetData:this.tableData,
                        sheetName:'sheet',
                        sheetFilter:['name','phone','userName'],
                        sheetHeader: ['姓名','手机号码','用户名']
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
        padding-left:20px;
        padding:20px;
    }
    footer{
        position:fixed;
        bottom:20px;
        width:100%;
    }

</style>
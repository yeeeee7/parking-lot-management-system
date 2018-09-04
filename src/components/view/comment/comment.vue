<template>
    <div class="comment">
        <nav-bar active-index="comment"></nav-bar>
        <div class="table-filter">
            <el-form  class="myself-info">
                <el-form-item>
                    <el-input style="width:200px" v-model="parkName" placeholder="停车场名称"></el-input>
                    <el-select v-model="select" placeholder="请选择" v-show="isSelectShow">
                        <el-option
                                v-for="(item,index) in options"
                                :key="index"
                                :label="item.parkName"
                                :value="item.parkId">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="postContent">查找</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-show="isSelectShow" @click="postSearch()">搜索</el-button>
                    <el-button type="primary"@click="exportDate()">报表导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="rowStyle" border>
            <el-table-column prop="commentaryTime" label="时间" ></el-table-column>
            <el-table-column prop="parkName" label="停车场名称" ></el-table-column>
            <el-table-column prop="userName" label="用户名" ></el-table-column>
            <el-table-column prop="cDetail" label="评论内容"></el-table-column>
            <el-table-column prop="score" label="打分"></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="small"  type="danger" @click="del(scope.row.cId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <footer>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 15, 25, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </footer>
    </div>
</template>

<script>
    import navBar from '../../common/navBar'
    const ExportJsonExcel = require('js-export-excel')
    export default {
        name: "comment",
        components:{
            navBar
        },
        data() {
            return {
                date:"",
                tableData: [{
                    "date": "2018-04-02 09:22:13",
                    "name": "小蛋黄",
                    "content": "每天都要写bug"
                }],
                currentPage: 1,
                select:"",
                options:[],
                isSelectShow:false,
                parkName:"",
                pageSize:5,
                total:0
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
            handleSizeChange(val) {
                this.pageSize=val;
                this.postQuery();
            },
            handleCurrentChange(val) {
                this.currentPage=val;
                 if(this.select){
                    this.postSearch();
               }else {
                    this.postQuery();
               }
            },
            resoleQuery:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/allCommentary',{
                        "userId":"f019c8674c1f489aaacaefc52fa86f4d",
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
                if(response.data.success){
                    this.tableData=response.data.data.commentaryDtos;
                    this.total=response.data.data.sum;

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
            resoleDel:function(cId){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/deleteCommentary',{
                        "cId":cId
                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postDel(cId){
                let response=await this.resoleDel(cId);
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
            resoleSearch: function () {
                let $this = this;
                return new Promise(function (resolve, reject) {
                    var res = $this.$axios.post('/queryCommentary', {
                        "pageNum": $this.currentPage,
                        "pageSize":"5",
                        "parkId":$this.select
                    });
                    if (res) {
                        resolve(res);
                    } else {
                        reject(new Error())
                    }
                });
            },
            async postSearch() {
                let response = await this.resoleSearch();
                if(response.data.success){
                    this.tableData=response.data.data.commentaryDtos;
                    this.total=response.data.data.sum;
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
            del(cId){
                this.postDel(cId);
            },
            exportDate:function(){
                var option={};
                option.fileName = '停车场评论'
                option.datas=[
                    {
                        sheetData:this.tableData,
                        sheetName:'sheet',
                        sheetFilter:['commentaryTime','parkName','userName','cDetail','score'],
                        sheetHeader: ['日期','停车场名称','用户名','评论内容','打分']
                    }
                ];
                let toExcel=new ExportJsonExcel(option);
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
        padding:20px;
    }
    footer{
        position:fixed;
        bottom:20px;
        width:100%;
    }

</style>
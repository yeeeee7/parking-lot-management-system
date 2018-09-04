<template>
    <div class="parkPot">
        <nav-bar active-index="profit"></nav-bar>
        <div class="table-filter">
            <el-form class="myself-info">
                <el-form-item>
                    <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <el-input style="width:200px"v-model="parkName" placeholder="停车场名称"></el-input>
                    <el-select v-model="select" placeholder="请选择" v-show="isSelectShow">
                        <el-option
                                v-for="(item,index) in options"
                                :key="index"
                                :label="item.parkName"
                                :value="item.parkId">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="postContent">查找停车场</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">搜索</el-button>
                    <el-button type="primary"@click="exportDate()">报表导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="rowStyle" border>
            <el-table-column prop="parkDate" label="日期"></el-table-column>
            <el-table-column prop="parkName" label="停车场名称"></el-table-column>
            <el-table-column prop="num" label="停车人数"></el-table-column>
            <el-table-column prop="money" label="总收入"></el-table-column>
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
        <div class="table-filter">
            <el-form class="myself-info">
                <el-form-item>
                    <el-date-picker v-model="month" value-format="yyyy-MM" type="month"
                                    placeholder="选择月"></el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <div id="charts"></div>

    </div>
</template>

<script>
    import echarts from 'echarts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'

    const ExportJsonExcel = require('js-export-excel')
    import navBar from '../../common/navBar'

    export default {
        name: "profit",
        components: {
            navBar
        },
        data() {
            return {
                dialogVisible: false,
                date: "",
                parkName:"",
                tableData: [],
                select:"",
                isSelectShow:false,
                options:[],
                profitDetail: [
                    {
                        time: "2018-05-24 15:17:15",
                        user: "小蛋黄",
                        spend: "2小时",
                        money: "5元"
                    }
                ],
                currentPage: 1,
                option: {
                    title: {
                        text: '月收入报表'
                       
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['月收入']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: []
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} 元'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '月收入',
                            type: 'line',
                            data: [],
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        },
                    ]
                },
                park: [],
                money: [],
                month: "",
                total:0,
                pageSize:5,

            }
        },
        mounted() {
            this.postQuery();
            this.month = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
            this.postMonth();

        },
        methods: {
            rowStyle: function () {
                return {
                    "text-align": "center!important",
                    "color": "black"
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
            resoleQuery: function () {
                let $this = this;
                let currentPage = this.currentPage
                return new Promise(function (resolve, reject) {
                    var res = $this.$axios.post('/allParkDailyIncome', {
                        "pageNum": currentPage,
                        "pageSize": "5"
                    });
                    if (res) {
                        resolve(res);
                    } else {
                        reject(new Error())
                    }
                });
            },
            async postQuery() {
                let response = await this.resoleQuery();
                if(response.data.success){
                    this.tableData=response.data.data.dailyIncomeDtos;
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
            resoleMonth: function () {
                let $this = this;
                return new Promise(function (resolve, reject) {
                    var res = $this.$axios.post('/queryParkIncome', {
                        "month": $this.month
                    });
                    if (res) {
                        resolve(res);
                    } else {
                        reject(new Error())
                    }
                });
            },
            async postMonth() {

                let response = await this.resoleMonth();
                let res= response.data.data;
                this.park = [];
                this.money = [];
               res.forEach((item,index) => {
                    this.park.push(item.parkName);
                    this.money.push(item.money);
                });
                this.option.xAxis[0].data = this.park;
                this.option.series[0].data = this.money;
                this.myChart = echarts.init(document.getElementById('charts'))
                this.myChart.setOption(this.option)
            },
            resoleFilter: function () {
                let $this = this;
                return new Promise(function (resolve, reject) {
                    var res = $this.$axios.post('/queryDailyIncome', {
                        "month": $this.month
                    });
                    if (res) {
                        resolve(res);
                    } else {
                        reject(new Error())
                    }
                });
            },
            async postFilter() {
                this.park = [];
                this.money = [];
                let response = await this.resoleFilter();

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
                        duration:1000
                    });
                    return 0;
                }
            },
            resoleSearch: function () {
                let $this = this;
                return new Promise(function (resolve, reject) {
                    var res = $this.$axios.post('/queryDailyIncome', {
                         "pageNum": $this.currentPage,
                        "pageSize":"5",
                        "parkId":$this.select,
                        "startDate":$this.date[0],
                        "endDate":$this.date[1]
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
                this.tableData=response.data.data.dailyIncomeDtos;
             
                this.total=response.data.data.sum;
            },
            detail: function () {
                this.dialogVisible = true;
            },
            search:function(){
                this.postSearch()
            },
            exportDate:function(){
                var option={};
                option.fileName = '停车场收入'
                option.datas=[
                    {
                        sheetData:this.tableData,
                        sheetName:'sheet',
                        sheetFilter:['parkDate','parkName','num','money'],
                        sheetHeader: ['日期','停车场名称','停车人数','消费金额']
                    }
                ];
                let toExcel=new ExportJsonExcel(option);
                toExcel.saveExcel();

            }
        },
        watch: {
            month(val) {
                this.postMonth();

            }
        },
    }
</script>

<style scoped>
    .table-filter {
        width: 100%;
        height: 100px;
        text-align: left;
        line-height: 100px;
        padding: 20px;
    }

    #charts {
        width: 100%;
        height: 400px;
    }

</style>
<template>
    <div class="card">
        <nav-bar active-index="card"></nav-bar>
        <el-form  class="card-info" >
            <el-form-item label="活动时间："label-width="200px">
                <el-date-picker
                        v-model="date"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="卡券有效期："label-width="200px">
                <el-date-picker
                        v-model="time"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="选择卡券："label-width="200px">
                <ul >
                    <li style="margin-top:40px" v-for="(item,index) in cards" :index="index">
                        <el-card class='mycard':body-style="{ padding: '0px' ,textAlign:'center'}">
                            <span>{{item}}</span>
                            <el-switch
                                    class="myswitch"
                                    v-model="value[index]"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                            </el-switch>
                        </el-card>
                    </li>
                </ul>
                卡券发布后不可撤回
            </el-form-item>
            <el-form-item>
                <div style="margin-left:200px;">
                    <el-button size="small"  type="danger"@click="confirm()">确认发布</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import navBar from '../../common/navBar'
    export default {
        name: "card",
        components:{
            navBar
        },
        data(){
            return {
                value:[false,false],
                date:"",
                time:"",
                cards:[
                    '五星好评送两元券',
                    '充值满100赠送5元券'
                ],
                id:""

            }
        },
        methods:{
            resoleQuery:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/deployCoupon',{
                        "activi_start_time":$this.date[0],
                        "activi_end_time":$this.date[1],
                        "effi_start_time":$this.time[0],
                        "effi_end_time":$this.time[0],
                        "couponids":$this.id

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
                    var  h = this.$createElement;
                    this.$notify({
                        title: '',
                        message: h('i', { style: 'color: teal'}, '发布成功'),
                        type: 'warning',
                        position: 'right-bottom',
                        offset: 300,
                        duration:1000
                    });
                    this.value=[false,false];
                    this.date="";
                    this.time="";
                    return 0;
                }else{
                    var  h = this.$createElement;
                    this.$notify({
                        title: '',
                        message: h('i', { style: 'color: teal'}, response.data.errorMsg),
                        type: 'warning',
                        position: 'right-bottom',
                        offset: 300,
                        duration:1000
                    });
                    this.value=[false,false];
                    this.date="";
                    this.time="";
                    return 0;
                }

            },
            confirm:function(){
                if(this.value[0]&&this.value[1]){
                    this.id="1,2"
                }else{
                    if(this.value[0]){
                        this.id="1"
                    }
                    else{
                        this.id="2"
                    }

                }
                this.postQuery();
                console.log(this.id)
                console.log(this.date);
                console.log(this.time)
            }
        }
    }
</script>

<style scoped>
.card-info{
    width:800px;
    position:relative;
    margin-left:50%;
    left:-400px;
    margin-top:100px;
}
    .mycard{
        background-color: #f6f7fb;
        height:100px;
        line-height: 100px;
        position:relative;
    }
    li{
        display: inline-block;
        width:200px;
        margin-right:20px;
    }
    .myswitch{
        position:absolute;
        left:10px;
    }
</style>
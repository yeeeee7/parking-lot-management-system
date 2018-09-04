<template>
    <div class="comment">
        <nav-bar active-index="mySelf"></nav-bar>
        <el-tabs class='tab'type="border-card">
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i>修改密码</span>
                <el-form label-width="100px" >
                    <el-form-item label="用户名">
                        <el-input v-model="userName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="输入旧密码">
                        <el-input v-model="oldPassword" type="password" ></el-input>
                    </el-form-item>
                    <el-form-item  label="输入新密码" >
                        <el-input v-model="newPassword"type="password" ></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="postChange">确 定</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="发布自定义消息">
                <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>点击发布消息，即可将消息发送给所有用户</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="postQuery()">发布消息</el-button>
                    <el-input resize="none" type="textarea" :rows="5" placeholder="请输入内容" v-model="textarea">
                    </el-input>
                </div>
                </el-card>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import navBar from '../../common/navBar'
    export default {
        name: "comment",
        components:{
            navBar
        },
        data() {
            return {
                dialogVisible:false,
                formInline: {
                    user: '',
                    region: ''
                },
                switchValue:"",
                cards:[
                    1,2,3,4
                ],
                textarea:"",
                userName:localStorage.getItem("userName"),
                oldPassword:"",
                newPassword:""
            }
        },
        methods:{
            onSubmit() {
                console.log('submit!');
            },
            change:function(){
                this.dialogVisible=true;
            },
            resoleChange:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/modifyPassword',{
                        "userName":$this.userName,
                        "password":$this.oldPassword,
                        "newPassword":$this.newPassword
                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postChange(){
                console.log(this.oldPassword);
                console.log(this.newPassword);
                let response=await this.resoleChange();
                let res=response.data;
                if(res.success){
                    this.$router.push("/login");
                }
                else{
                    let  h = this.$createElement;
                    this.$notify({
                        title: '',
                        message: h('i', { style: 'color: teal'}, response.data.errorMsg),
                        type: 'warning',
                        position: 'right-bottom',
                        offset: 300,
                        duration:1000
                    });
                }
            },
            resoleQuery:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/nf',{
                        "title":"系统消息",
                        "message":$this.textarea

                    });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postQuery(){
                if(this.textarea!=""){
                    let response=await this.resoleQuery();
                   if(response.data.success){
                       let  h = this.$createElement;
                       this.$notify({
                           title: '',
                           message: h('i', { style: 'color: teal'}, '发布成功'),
                           type: 'warning',
                           position: 'right-bottom',
                           offset: 300,
                           duration:1000
                       });
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

                }
                else{
                    let  h = this.$createElement;
                    this.$notify({
                        title: '',
                        message: h('i', { style: 'color: teal'}, '请输入内容'),
                        type: 'warning',
                        position: 'right-bottom',
                        offset: 300,
                        duration:1000
                    });
                }



            },

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
    .tab{
        width:80%;
        margin-top:100px;
        height:500px;
        margin-left:10%;
    }
    .input{
        width:200px;
    }
    footer{
        position:fixed;
        bottom:20px;
        width:100%;
    }
    color{
        background-color: blueviolet;
    }

</style>
<template>
  <div class="login">
    <el-form :model="form" ref="loginForm" label-width="50px" class="login-form">
      <el-form-item>
        <span class="form-title">停车场无人收费后台管理系统</span>
      </el-form-item>
      <el-form-item  prop="name">
        <el-input placeholder="请输入账号" v-model="form.name" type="text"></el-input>
      </el-form-item>
      <el-form-item  prop="password">
        <el-input placeholder="请输入密码" v-model="form.password"type="password"></el-input>
      </el-form-item>
        <el-button type="primary" size="medium" @click="submitForm('loginForm')">登录</el-button>
        <p class="button-registor" @click="gotoRegistor">还没有账号，去注册体验>></p>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          password: '',
          category: 0,
        },
      };
    },
    mounted: function() {
    },
    methods: {
        resoleGet:function(){
            let $this=this;
            return new Promise(function (resolve , reject) {
                var res = $this.$axios.post('login',{
                    "username":$this.form.name,
                    "userType":"1",
                    "password":$this.form.password
                });
                if (res){
                    resolve(res);
                }else {
                    reject(new Error())
                }
            });
        },
        async postGet(){
            let response=await this.resoleGet();
            if(response.data.success){
                localStorage.clear();
                this.$store.commit('postUserId', response.data.data.userId);
                this.$store.commit('postUserName', response.data.data.userName);
                localStorage.setItem("userId",response.data.data.userId);
                localStorage.setItem("userName",response.data.data.userName);
                this.$router.push('/index');
            }
            else{
                var  h = this.$createElement;
                this.$notify({
                    title: '',
                    message: h('i', { style: 'color: teal'}, response.data.errorMsg),
                    type: 'warning',
                    position: 'right-bottom',
                    offset: 300,
                    duration:1000
                });
                return 0;
            }
        },
        submitForm(formName) {
            var $this=this;
            if(!(this.form.name&&this.form.password)){
                var  h = this.$createElement;
                this.$notify({
                    title: '',
                    message: h('i', { style: 'color: teal'}, '账户或密码为空'),
                    type: 'warning',
                    position: 'right-bottom',
                    offset: 300,
                    duration:1000
                });
                return 0;
            }


            this.$refs[formName].validate((valid) => {
                this.postGet();

            });
        },
        gotoRegistor:function(){
            this.$router.push('/registor');
        }
    }
  }
</script>
<style lang="scss" scoped>
 .login {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    opacity: 80;
    -moz-opacity: 0.8;
   background: #324157;
   overflow: hidden;
   position:relative;
  }
  .login-form{
    width:400px;
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
    background: white;
    padding:30px 40px 20px 20px;
    text-align: center;
    color: #409EFF;
  }
 .form-title{
   font-size:16px;
 }

 .button-registor{
    font-size:12px;
    text-align: right;
    cursor:pointer;
    position: absolute;
    right: 40px;
    bottom: 30px;
  }
</style>

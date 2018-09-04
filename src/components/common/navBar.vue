<template>
    <nav>
        <el-menu active-text-color="#ffffff"	router  text-color="#ffffff" background-color="#409EFF" :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item  index="index" style='width: 120px;text-align: center;'>用户管理</el-menu-item>
            <el-menu-item  index="parkPot" style='width: 120px;text-align: center;'>停车场管理</el-menu-item>
            <el-menu-item  index='payRule'style='width: 120px;text-align: center;'>收费策略管理</el-menu-item>
            <el-menu-item  index='card'style='width: 120px;text-align: center;'>卡券发布</el-menu-item>
            <el-menu-item  index='profit'style='width: 120px;text-align: center;'>收入管理</el-menu-item>
            <el-menu-item  index='comment'style='width: 120px;text-align: center;'>评价管理</el-menu-item>
            <el-menu-item  index='mySelf'style='width: 120px;text-align: center;'>管理员设置</el-menu-item>
            <el-submenu index="user" class="right">
            <template slot="title"> <img src="../../images/head.png" width="40px" height="40px">{{user}}</template>
             <el-menu-item  index='login'style='width: 50px;text-align: center;'>退出登录</el-menu-item>
             </el-submenu>
        </el-menu>
    </nav>
</template>

<script>
    export default {
        name: "nav-bar",
        data(){
            return{
                user:localStorage.getItem("userName")
            }
        },
        props: ['activeIndex'],
        methods:{

        }
    }
</script>

<style scoped>
    .right{
        float:right;
        margin-right:80px;
    }
</style>

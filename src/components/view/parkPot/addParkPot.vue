<template>
    <div class="addParkPot">
    <el-card class="box-card park-pot" :style="{
        height: '100%',
        overflow: 'visible',
        transform: asideOpen? 'translateX(0%)': 'translateX(-100%)'
    }">
        <div slot="header" class="clearfix">
            <span>添加停车场</span>
        </div>
        <el-form style="position: relative;">
            <el-form-item>
                <el-input  v-model="parkName" style="width:200px" placeholder="停车场名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  v-model="parkAddress" style="width:200px" placeholder="停车场地址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  v-model="parkDetail" style="width:200px" placeholder="停车场详细介绍"></el-input>
            </el-form-item>
            <el-form-item>
                <el-time-picker v-model="openTime" value-format="HH:mm:ss"placeholder="开放时间">
                </el-time-picker>
            </el-form-item>
            <el-form-item>
                <el-time-picker v-model="closeTime"value-format="HH:mm:ss" placeholder="歇业时间">
                </el-time-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"@click="add()">确认</el-button>
            </el-form-item>
            <span style="position: absolute; right: -20px; top:50%; transform: translate(100%, -50%); background: white; padding: 20px 5px; cursor: pointer;" @click="toggleAside">{{asideOpen? '&lt;': '&gt;'}}</span>
        </el-form>
    </el-card>
        <div id="map"></div>
    </div>
</template>

<script>
    import navBar from '../../common/navBar'

    export default {
        name: "addParkPot",
        components: {
            navBar
        },
        data() {
            return {
                asideOpen: true,
                parkName:"",
                parkAddress:"",
                parkDetail:"",
                openTime:"",
                closeTime:"",
                infoWindow:"",
                lng:"",
                lat:""


            }
        },
        mounted(){
            this.search();

        },
        methods:{
            toggleAside: function () {
                let asideOpen = !this.asideOpen
                this.asideOpen = asideOpen
            },
            resoleAdd:function(){
                let $this=this;
                return new Promise(function (resolve , reject) {
                    var res = $this.$axios.post('/addPark',{
                        "parkName":$this.parkName,
                        "parkAddress":$this.parkAddress,
                        "parkDetail":$this.parkDetail,
                        "openTime":$this.openTime,
                        "closeTime":$this.closeTime,
                        "longitude":$this.lng,
                        "latitude":$this.lat
                });
                    if (res){
                        resolve(res);
                    }else {
                        reject(new Error())
                    }
                });
            },
            async postAdd(){
                if(this.lng==''){
                    var  h = this.$createElement;
                    this.$notify({
                        title: '',
                        message: h('i', { style: 'color: teal'}, '请点击要选中的停车场'),
                        type: 'warning',
                        position: 'right-bottom',
                        offset: 300,
                        duration:1000
                    });
                    return 0;
                }
                let response=await this.resoleAdd();
                if(response.data.success){
                    this.$router.push("parkPot")
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
                console.log(response);
            },
            search:function(){
                let $this=this;
                // 百度地图API功能
                var map = new BMap.Map("map");
                // 创建地址解析器实例
                var myGeo = new BMap.Geocoder();
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint("杭州电子科技大学", function(point){
                    point.lng = 120.351044
                    point.lat = 30.320964
                    if (point) {
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                    }else{
                       //alert("您选择地址没有解析到结果!");
                    }
                }, "杭州市");
                //var options = {
                //    onSearchComplete: function(results){
                //        console.log(results);
                //    }
                //};
                map.enableScrollWheelZoom(true);
                //var local = new BMap.LocalSearch("杭州市", {renderOptions: {map: map,autoViewport: true},pageCapacity: 8});
                //local.search("停车场",options);
                var geoc = new BMap.Geocoder();  
                map.addEventListener("click",function(e){
                    console.log(e)
                    $this.lng = e.point.lng ;
                    $this.lat =  e.point.lat;
                    var pt = e.point;
                     geoc.getLocation(pt, function(rs){
                        var addComp = rs.addressComponents;
                    $this.parkAddress = addComp.province + addComp.city + addComp.district  + addComp.street + addComp.streetNumber;
                    console.log(addComp)
                    });
                });
            },
            add:function(){
                this.postAdd();
            }
        }
    }
</script>

<style scoped>
.park-pot{
    position:absolute;
    z-index:2;
}
#map{
    width:100%;
    height:100%;
    position: absolute;
    z-index:1;
    top:0px;
}
</style>

//创建一个服务器
var http = require("http");
var fs = require("fs");
var template = require("art-template");

//引用定义好的render模块
var render = require("./render.js");

var server = http.createServer();

server.on("request",function(req,res){

   //将render方法注册到res对象中
   render(res);


    //如果将为用户请求的根目录，我们将首页返回到浏览器
    var url = req.url;

    //得到当的请求方式：
    var method = req.method;
    
    //判断请求
    //处理首页的请求
    if(method == "GET" && url == "/") {
        fs.readFile("./data.json",function(err,data){
            if(err) {
                return res.end("404 not find");
            }
            res.render("index",JSON.parse(data.toString()),function(err1,html){
               if(err1) {
                 return res.end("404 not find");
               }
               res.end(html);
            });
        })
    } else if(method == "GET" && url == "/add"){
        res.render("add",null,function(err1,html){
            if(err1) {
                return res.end("404 not find");
              }
              res.end(html);
        });
    } else if(method == "POST" && url == "/add"){
        //接收提交过来的参数，并且将参数保存到data.json中 name gender id
        //如果要接收浏览器传过来的参数，要使用一个事件：data事件
        var str = "";
        //由于将来可能参数会提交多次，需要将多次提交的参数结合到一起
        req.on("data",function(data){
            str += data;
        });
        //当参数提交结束时，我们需要得到最终的参数来进行处理
        //判断参数是否提交结束使用另一个事件
        req.on("end",function(){
            // console.log(str);//name=abc&gender=on
            //将数据保存到data.json中
            //得到name和gender属性
            var obj = {
                img: "0.jpg"
            };
            str = decodeURI(str);
            var dataArr = str.split("&");
            for(var i = 0 ; i < dataArr.length ; i ++) {
                var arr = dataArr[i].split("=");
                obj[arr[0]] = arr[1];
            }
            //得到id，
            //1.0将data.json中的所有文件全部读取出来
            fs.readFile("./data.json",function(err,oobj){
                if(err) {
                    return res.end("404");
                }
                var objData =  JSON.parse(oobj.toString());
                //2.0取出最后一条数据的id属性
                var id  = objData.heros[objData.heros.length - 1].id + 1;
                obj.id = id;
                //3.0将新增的数据添加到objdata的heros中
                objData.heros.push(obj);
                //将对象转为字符串才能写入到data.json中
                var resStr = JSON.stringify(objData,null,"  ");
                //4.0重新将数据写入到data.json中
                fs.writeFile("./data.json",resStr,function(err1){
                    var returnObj = {};
                    if(err1) {
                        // return res.end("新增失败");
                        returnObj.statu = 1;
                        returnObj.msg = "新增失败";
                    } else {
                        returnObj.statu = 0;
                        returnObj.msg = "新增成功";
                    }
                    res.end(JSON.stringify(returnObj));
                });
            });
        });

    } else if (method == "GET" && url.indexOf("/node_modules")!= -1 || url.indexOf("/img") != -1) {
        //单独处理静态资源
        url = "." + url;
        fs.readFile(url,function(err,data){
            if(err) {
                return res.end("404 not found");
            }
            res.end(data);
        });
    } else {
        res.end("404 not found");
    }

});
server.listen(3000,"192.168.64.69",function(){
    console.log("running");
});
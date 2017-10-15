//开启服务器
const express = require("express");
const router = require("./router.js");

const app = express();

//配置静态资源文件夹
app.use("/node_modules", express.static("node_modules"));
app.use("/img", express.static("img"));


//设置express的模板引擎
app.engine('html', require('express-art-template'));

//设置外置路由
app.use(router);

app.listen(3000, () => {
    console.log("running");
});
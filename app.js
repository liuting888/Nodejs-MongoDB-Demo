//开启服务器
const express = require("express");
const router = require("./router.js");
const session = require('express-session');
const cookie =require('cookie');

const app = express();

//配置使用session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//配置静态资源文件夹
app.use("/node_modules",express.static("node_modules"));
app.use("/img",express.static("img"));


//设置express的模板引擎
app.engine('html', require('express-art-template'));

//中间键:用来判断用户是否登录
app.use(function(req,res,next){
	//如果用户登录：直接将请求转转交到下一个中间件中
	if(req.url != "/login" && !req.session.views) {
		//说明当前用户没有登录，直接跳转到登录页面
		//如果请求的不是login，并且session中没有数据，说明用户现在没有登录过
		//但是还得验证一下用户在七天前有没有登录过
		//直接判断cookie是否存在就可以
		if(!req.headers.cookie || !cookie.parse(req.headers.cookie).uName) {
			res.writeHeader(200,{
				"content-type": "text/html;charset=utf-8"
			});
			res.end("<script>alert('您还没有登录，请登录');window.location='/login'</script>");
		}else {
			req.session.views = cookie.parse(req.headers.cookie).uName;
			next();
		}
	}
	else {
		//如果用户没有登录：直接跳转回登录页面
		next();
	}
});

//设置外置路由
app.use(router);

//设置404请求
app.use(function(req,res){
	res.send("404 您请求的页面不存在");
});

app.listen(3000,()=>{
    console.log("running");
});
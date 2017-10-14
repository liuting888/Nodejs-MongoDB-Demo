//用来封装请求静态文件，并且响应回浏览器的步骤：
//参数1：url：要得到的静态文件的名称
var fs = require("fs");
var template = require("art-template");

//参数2：data：得到静态文件所需要的参数
//参数3：callback：回调函数，将来得到文件中的内容以后在怎么操作由调用者来决定
//      回调函数有两个参数：
//          err:执行代码异常时的错误
//          html:得到的所有的html代码
module.exports = function render(res) {
    res.render = function render(url,obj,callback){//url = add
        //将url对应的文件中的内容读取出
        url = "./views/" + url + ".html" 
        fs.readFile(url,function(err,data){
            if(err) {
                return callback(err);
            }
            var html =  template.compile(data.toString())(obj || {});
            // var r = template.compile(data.toString());
            // var html = r(obj || {});
            callback(null,html);
        })
    }
}

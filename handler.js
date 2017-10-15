var fs = require("fs");
var path = require("path");
var urlM = require("url");
//引用formidable(用来帮助我们进行上传文件的第三方包)
var formidable = require("formidable");

var mmodule = require("./module.js");

//用来处理具体的请求逻辑
module.exports.getIndex = function(req,res){
    // res.send("您请求的是getIndex");
    mmodule.getAllData(function(err,obj){
        if(err) {
            return res.end("404 not find");
        }
        // res.send(JSON.stringify(obj));
        res.render("index.html",obj);
    });
}
module.exports.getAdd = function(req,res){
    res.render("add.html");
}
module.exports.postAdd = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err) {
            return res.end(returnObj(1,"fail"));
        }
        //去掉名称前面的img
        fields.img = path.basename(fields.img);
        var isTrue = mmodule.add(fields,function(err){
            if(err) {
                return res.end(returnObj(1,"fail"));
            }
            res.end(returnObj());
        });
    });

    // //创建一个formideble对象
    // var form = new formidable.IncomingForm();

    // //这个对象调用parse方法时，会自动帮助我们接收从浏览器传递过来的文件和属性（字段）
    // //parse方法：
    // //  参数一：请求对象
    // //  参数二：回调函数
    // //      err:接收参数时错误的情况
    // //      fields：得到浏览器上传过来的所有的字段（键值对）
    // //      files：得到上传过来的文件的的集合
    // form.parse(req, function(err, fields, files) {
    //     // console.log(fields);
    //     // //得到图片名称
    //     // var path = files.img.path;
    //     // var fileName = path.split("\\");
    //     // console.log(fileName[fileName.length-1]);
    //     var obj = {
    //         // img: fileName[fileName.length-1],
    //         img: path.basename(fields.img),
    //         name: fields.name,
    //         gender: fields.gender
    //     };
    //     //得到id，
    //     //1.0将data.json中的所有文件全部读取出来
    //     fs.readFile("./data.json",function(err,oobj){
    //         if(err) {
    //             return res.end("404");
    //         }
    //         var objData =  JSON.parse(oobj.toString());
    //         //2.0取出最后一条数据的id属性
    //         var id  = objData.heros[objData.heros.length - 1].id + 1;
    //         obj.id = id;
    //         //3.0将新增的数据添加到objdata的heros中
    //         objData.heros.push(obj);
    //         //将对象转为字符串才能写入到data.json中
    //         var resStr = JSON.stringify(objData,null,"  ");
    //         //4.0重新将数据写入到data.json中
    //         fs.writeFile("./data.json",resStr,function(err1){
    //             var returnObj = {};
    //             if(err1) {
    //                 // return res.end("新增失败");
    //                 returnObj.statu = 1;
    //                 returnObj.msg = "新增失败";
    //             } else {
    //                 returnObj.statu = 0;
    //                 returnObj.msg = "新增成功";
    //             }
    //             res.end(JSON.stringify(returnObj));
    //         });
    //     });
    //});


    //  //接收提交过来的参数，并且将参数保存到data.json中 name gender id
    // //如果要接收浏览器传过来的参数，要使用一个事件：data事件
    // var str = "";
    // //由于将来可能参数会提交多次，需要将多次提交的参数结合到一起
    // req.on("data",function(data){
    //     str += data;
    // });
    // //当参数提交结束时，我们需要得到最终的参数来进行处理
    // //判断参数是否提交结束使用另一个事件
    // req.on("end",function(){
    //     // console.log(str);//name=abc&gender=on
    //     //将数据保存到data.json中
    //     //得到name和gender属性
    //     var obj = {
    //         img: "0.jpg"
    //     };
    //     str = decodeURI(str);
    //     var dataArr = str.split("&");
    //     for(var i = 0 ; i < dataArr.length ; i ++) {
    //         var arr = dataArr[i].split("=");
    //         obj[arr[0]] = arr[1];
    //     }
    //     //得到id，
    //     //1.0将data.json中的所有文件全部读取出来
    //     fs.readFile("./data.json",function(err,oobj){
    //         if(err) {
    //             return res.end("404");
    //         }
    //         var objData =  JSON.parse(oobj.toString());
    //         //2.0取出最后一条数据的id属性
    //         var id  = objData.heros[objData.heros.length - 1].id + 1;
    //         obj.id = id;
    //         //3.0将新增的数据添加到objdata的heros中
    //         objData.heros.push(obj);
    //         //将对象转为字符串才能写入到data.json中
    //         var resStr = JSON.stringify(objData,null,"  ");
    //         //4.0重新将数据写入到data.json中
    //         fs.writeFile("./data.json",resStr,function(err1){
    //             var returnObj = {};
    //             if(err1) {
    //                 // return res.end("新增失败");
    //                 returnObj.statu = 1;
    //                 returnObj.msg = "新增失败";
    //             } else {
    //                 returnObj.statu = 0;
    //                 returnObj.msg = "新增成功";
    //             }
    //             res.end(JSON.stringify(returnObj));
    //         });
    //     });
    // });
}
module.exports.postUpload = function(req,res){
    //2.0接收上传过来看文件
     //创建一个formideble对象
     var form = new formidable.IncomingForm();
     
         //由于formideble会自动将文件保存在一个临时目录下，所以我们需要将保存的路径进行修改：/img
         form.uploadDir = "./img/";
         //保留文件的扩展名
         form.keepExtensions = true;
         //这个对象调用parse方法时，会自动帮助我们接收从浏览器传递过来的文件和属性（字段）
         //parse方法：
         //  参数一：请求对象
         //  参数二：回调函数
         //      err:接收参数时错误的情况
         //      fields：得到浏览器上传过来的所有的字段（键值对）
         //      files：得到上传过来的文件的的集合
         var obj = {};
         form.parse(req, function(err, fields, files) {
             //将文件的名称返回到浏览器
             if(err) {
                 return res.end(returnObj(1,"fail"));
             } 
            else {
               res.end(returnObj(0,"success",path.basename(files.img.path)));
            }
             
         });
}
module.exports.getEdit = function(req,res){
    //得到修改页面
    var url = req.url;//http://localhost:3000/edit.html?id=1  url
    var id = urlM.parse(url,true).query.id;
    
    mmodule.getDataById(id,function(err,obj){
        if(err) {
            return res.end("404");
        }
        res.render("edit.html",obj);
    });
    //根据id得到id对应的数据对象
    // fs.readFile("./data.json",function(err,objStr){
    //     if(err) {
    //         return res.end("404");
    //     }
    //     var objArr = JSON.parse(objStr.toString()).heros;
    //     var obj = {};
    //     for(var i = 0; i < objArr.length; i++) {
    //         if(objArr[i].id == id) {
    //             obj = objArr[i];
    //             break;
    //         }
    //     }
    //     console.log(obj);
    //     res.render("edit",obj,function(err,html){
    //         if(err) {
    //             res.end("404");
    //         }
    //         res.end(html);
    //     });
    // });
    

    
}
module.exports.postEdit = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err) {
            return res.end(returnObj(1,"fail"));
        }
        fields.img = path.basename(fields.img);
        mmodule.edit(fields,function(err){
            if(err) {
                return res.end(returnObj(1,"fail"));
            }
            res.end(returnObj());
        });
    });
    //接收参数
    // var form = new formidable.IncomingForm();
    // form.parse(req, function(err, fields, files) {
    //    //根据id找到原本的数据
    //    fs.readFile("./data.json",function(err,data){
    //        var arr = JSON.parse(data.toString()).heros;
    //        fields.img = path.basename(fields.img);
    //        for(var i = 0 ; i < arr.length; i++) {
    //            if(arr[i].id == fields.id) {
    //             //    for(key in fields) {//forin在遍历数组时key 对应 元素的下标，遍历对象时key对应的是对象的属性
    //             //        arr[i][key] = fields[key];//id name gender img
    //             //    }
    //             arr[i] = fields;
    //             break;
    //            }
    //        }
    //        //重新将数组转为一个对象
    //        var resObj = {
    //            heros: arr
    //        }
    //        //重新将数据提交到data.json
        
    //        var returnObj = {};

    //        fs.writeFile("./data.json",JSON.stringify(resObj,null,"  "),function(err){
    //            if(err) { 
    //             returnObj.statu = 1;
    //             returnObj.msg = "修改失败";
    //            } else {
    //             returnObj.statu = 0;
    //             returnObj.msg = "修改成功";
    //            }
    //            res.end(JSON.stringify(returnObj));
    //        });
           
    //    })
    // });
}
module.exports.getDel = function(req,res) {
    var url = req.url;
    var id = urlM.parse(url,true).query.id;
   //根据id找到数据并且删除
   fs.readFile("./data.json",function(err,data){
       var obj = JSON.parse(data.toString());
       for(var i = 0 ; i < obj.heros.length ; i ++) {
           if(obj.heros[i].id == id) {
                //删除元素
                obj.heros.splice(i,1);
                break;
           }
       }
       var returnObj = {};
       //重新将对象写入到data.json中
       fs.writeFile("./data.json",JSON.stringify(obj,null,"  "),function(err){
           if(err) {  
            returnObj.statu = 1;
            returnObj.msg = "删除失败";
           }else {
            returnObj.statu = 0;
            returnObj.msg = "删除成功";
           }
           res.end(JSON.stringify(returnObj));
       });
   });
}

module.exports.getStatic = function(req,res){
    //单独处理静态资源
    var url = "." + req.url;
    fs.readFile(url,function(err,data){
        if(err) {
            return res.end("404 not found");
        }
        res.end(data);
    });
}
module.exports.get404 = function(req,res){
    res.end("404 not found");
}
function returnObj(statu,msg,src) {
    var obj = {
        statu: statu || 0,
        msg: msg || "success",
        src: src || ""
    }
    return JSON.stringify(obj);
}
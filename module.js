var fs = require("fs");
//负责对data.json进行增删查改
var filePath = "./data.json";
var mmodule = module.exports;
//查
//1.0 查询出所有的数据
mmodule.getAllData = function(callback) {
    fs.readFile(filePath,function(err,data){
        if(err) {
            return callback(err);
        }
        callback(null,JSON.parse(data.toString()));
    });
}
//2.0 根据id得查出一条数据
mmodule.getDataById = function(id,callback){
    //得到所有的数据
    this.getAllData(function(err,obj){
        if(err) {
            return callback(err);
        }
        //查出数据中id对应的值
        for(var i = 0; i < obj.heros.length; i++) {
            if(id == obj.heros[i].id) {
               callback(null,obj.heros[i]); 
               break;
            }
        }
    });
}
//增
//如果成功，返回true,如果失败返回false
mmodule.add = function(addObj,callback) {//name gender img 
    //先将内容读取出来
    this.getAllData((err,obj)=>{
        if(err) {
            return callback(err);
        }
        //找到最后一条数据的id
        var id = obj.heros[obj.heros.length - 1]?obj.heros[obj.heros.length - 1].id + 1 : 1;
        //将id添加到要新增的对象中
        addObj.id = id;
        //将对象添加到data.json文件中
        obj.heros.push(addObj);
        //将对象重新写入到data.json中
        fs.writeFile(filePath,JSON.stringify(obj,null,"  "),function(err) {
            if(err) {
               return callback(err);
            }
            callback();
        });
    });
}
//改
mmodule.edit = function(editObj,callback){
    //得到所有的数据，
    this.getAllData(function(err,obj){
        if(err) {
           return callback(err);
        }
        //根据对应id得到要修改的对象
        for(var i = 0; i < obj.heros.length; i++) {
            if(editObj.id == obj.heros[i].id) {
                //将新对象的值设置给老对象
                obj.heros[i] = editObj;
                break;
            }
        }
        //将对象重新写入data.json中
        fs.writeFile(filePath,JSON.stringify(obj,null,"  "),function(err){
            if(err) {
             return  callback(err);
            }
            callback();
        });
    });


}
//删

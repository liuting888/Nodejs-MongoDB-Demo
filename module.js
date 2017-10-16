//操作数据库通过mongoose

//1.0引用文件
const mongoose = require("mongoose");

//2.0连接数据库
mongoose.connect('mongodb://localhost/itcast', { useMongoClient: true });
mongoose.Promise = global.Promise;


//3.0定义约束
var schame = new mongoose.Schema({
    // id: {
    //     type: Number,
    //     required: true
    // },
    name: {
        type: String, //约束name属性为一个字符串
        required: true //name属性为必须属性
    },
    gender: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
});
//3.0根据约束，创建对象模型
var hero = mongoose.model("heros", schame);

//4.0将这个对象模型暴露出去，让hanlder.js来直接使用
module.exports = hero;
//增
//创建一个hero对象
//调用一个save方法
//删
//hero.remove()
//改
//hero.update();
//查
//hero.find();
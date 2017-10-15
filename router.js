//引入express
const express = require("express");
const handler = require("./handler.js");

var router = express.Router();

//设置路由
router.get("/",handler.getIndex)
    .get("/add",handler.getAdd)
    .post("/add",handler.postAdd)
    .post("/upload",handler.postUpload)
    .get("/edit",handler.getEdit)
    .post("/edit",handler.postEdit)
    .get("/del",handler.getDel);

module.exports = router;

// else if (method == "GET" && url.indexOf("/node_modules")!= -1 || url.indexOf("/img") != -1) {
//         handler.getStatic(req,res);
//     }
// }
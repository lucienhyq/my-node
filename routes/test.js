var express = require('express');
var mongo = require("./shujukufangfafengzhuang.js");
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

router.get('/admin',function(req,res,next){
	if(req.query.action == 'start'){
		res.send({
			name:'isStart'
		})
	}
})

router.post('/chakan',function(req,res){
	// mongo('find','via',{},function(data){
	// 		res.send(data)
	// })
	let datas = {}
	if(req.body.action == 'addd'){
		mongo("find","img",{},function(data){
			datas.data = data
			res.send(datas)
		})

	}
})

module.exports = router;
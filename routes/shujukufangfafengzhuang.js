var mongo = require("mongodb")
var url= 'mongodb://127.0.0.1:27017';
var dbName = 'qq';

var MongoClient=mongo.MongoClient; 
	//添加方法
	var  add=function(client,collections,selector,fn){
			var db=client.db(dbName) //链接数据库	
		//操作数据集合（表）
		var collection=db.collection(collections) //链接数据库里面的集合--自动创建
		collection.insertOne(selector,function(err,result){
				if (err) throw err;
				console.log("插入成功");
				fn(result)
		})
	}
	//删除
	var del=function(client,collections,selector,fn){
		var db=client.db(dbName) //链接数据库	
		//操作数据集合（表）
		var collection=db.collection(collections) //链接数据库里面的集合--自动创建
		collection.deleteOne(selector,function(err,result){
				if (err) throw err;
				console.log("删除成功");
				fn(result)
		})	
	}
	//查找
	var find=function(client,collections,selector,fn){
			var db=client.db(dbName);
			var collection=db.collection(collections);
			
			collection.find(selector).toArray(function(err,result){
					if(err) throw err;
					console.log("查找成功");
					fn(result)
			})
		
	}
	//修改  selector--传数组  [修改谁 ，修改后 ]
	var updates=function(client,collections,selector,fn){
				var db=client.db(dbName);
			var collection=db.collection(collections);
			
			collection.updateOne(selector[0] ,{ $set:selector[1]},function(err,result){
					if(err) throw err;
					console.log("修改成功");
					fn(result)		
			})
	}
	//删除多个
	var delMany=function(client,collections,selector,fn){
				var db=client.db(dbName);
			var collection=db.collection(collections);
			collection.deleteMany(selector,function(err,result){
					if (err) throw err;
					console.log("删除多个成功");
					fn(result)
			})
		
	}
	//添加多个
	var addMany=function(client,collections,selector,fn){
		var db=client.db(dbName);
		var collection=db.collection(collections);
		collection.insertMany(selector,function(err,result){
				if(err) throw err;
				console.log("添加多个成功");
				fn(result)
		})
	}
	//修改多个
	var updateMany=function(client,collections,selector,fn){
		var db=client.db(dbName);
		var collection=db.collection(collections);
		collection.updateMany(selector[0],{$set:selector[1]},function(err,result){
				if(err) throw err;
				console.log("修改多个成功");
				fn(result)
		})
	}
	
	
	
	
	var  methodType={
		add:add,
		del:del,
		find:find,
		updates:updates,
		delMany:delMany,
		addMany:addMany,
		updateMany:updateMany
	}
//暴露出的函数
module.exports=function(type,collections,selector,fn){
			
		MongoClient.connect(url,function(err,client){
				
			//添加	
			
			methodType[type](client,collections,selector,fn);
			
		})
	
}

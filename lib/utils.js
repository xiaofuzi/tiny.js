var utils = {
	/*types*/
	isArray: function(arr){
		return Array.isArray(arr);
	},
	toArray: function(obj){
		return [].slice.call(obj);
	},
	extends: function(child, parent, bool){
		if(bool == undefined) {
			bool = false;
		}
		for(key in parent){
			if(parent.hasOwnProperty(key)){
				if(bool == true){
					child[key] = parent[key];
				}else{
					child[key] = child[key] || parent[key];					
				}
			}
		}
		return child;
	},
	objMap: function(obj, fn){
		if(typeof obj == 'object'){
			return Object.keys(obj).map(function(attr){
				return fn(attr, obj[attr]);
			})
		}
	},
	objEach: function(obj, fn){
		if(typeof obj == 'object'){
			Object.keys(obj).forEach(function(attr){
				fn(attr, obj[attr]);
			})
		}
	}
}

module.exports = utils;
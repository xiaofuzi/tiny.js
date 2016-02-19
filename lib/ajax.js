var utils = require('./utils');

var ajax = {
	getJSON: function(url, success, error){
		var req = new XMLHttpRequest();
		req.open('GET', url, true);

		req.onload = function(){
			if(req.status >= 200 && req.status < 400){
				var data = JSON.parse(req.responseText);
				success(data, req);
			}else{
				error(req)
			}
		};
		req.onerror = function(){
			throw Error("There was a connection error of " + url + "request.");
		}
		req.send();
	},
	post: function(url, data){
		var req = new XMLHttpRequest();
		req.open('POST', url, true);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		req.send(data);
	},
	get: function(url, success, error){
		var req = new XMLHttpRequest();
		req.open('GET', url, true);

		req.onload = function(){
			if(req.status >= 200 && req.status < 400){
				var data = req.responseText;
				success(data, req);
			}else{
				error(req);
			}
		};
		req.onerror = function(){
			throw Error("There was a connection error of " + url + "request.");
		};
		req.send();
	}
}

module.exports = ajax;

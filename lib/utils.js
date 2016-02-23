var utils = {
    /*types*/
    type: function(obj){
    	return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
    },
    isArray: function(arr) {
        return Array.isArray(arr);
    },
    toArray: function(obj) {
        return [].slice.call(obj);
    },
    isObject: function(obj){
        if(utils.type(obj) === 'object'){
            return true;
        }else{
            return false;
        }
    },
    /*
    * safe inherit
    */
    extend: function(child, parent, bool) {
        if (bool == undefined) {
            bool = false;
        }
        for (var key in parent) {
            if (parent.hasOwnProperty(key)) {
                if (bool == true) {
                    child[key] = parent[key];
                } else {
                    child[key] = child[key] || parent[key];
                }
            }
        }
        return child;
    },
    objMap: function(obj, fn) {
        if (typeof obj == 'object') {
            return Object.keys(obj).map(function(attr) {
                return fn(attr, obj[attr]);
            })
        }
    },
    objEach: function(obj, fn) {
        if (typeof obj == 'object') {
            Object.keys(obj).forEach(function(attr) {
                fn(attr, obj[attr]);
            })
        }
    },
    proxy: function(fn, context) {
        return fn.bind(context);
    },
    /*
     * params: {}, obj1, obj2
     */
    deepExtend: function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        out[key] = utils.deepExtend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }
        return out;
    },
    /*
     * params: {}, obj1, obj2
     */
    extends: function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    out[key] = arguments[i][key];
                }
            }
        }
        return out;
    },
    parseHTML: function(str) {
        var tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = str;
        return tmp.body.children;
    },
    parseJSON: function(str){
    	return JSON.parse(str);
    }
}

module.exports = utils;

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./utils":7}],2:[function(require,module,exports){
var utils = require('./utils');

var animation = {
	fadeIn: function(){
		var el = this.element;
		el.style.opacity = 0;

		var last = +new Date();
		var tick = function(){
			el.style.opacity = +el.style.opacity + (new Date() - last)/400;
			last = +new Date();
			if(+el.style.opacity < 1){
				(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
			}
		}
		tick();
	},
	fadeOut: function(){
		var el = this.element;
		el.style.opacity = 1;

		var last = +new Date();
		var tick = function(){
			el.style.opacity = +el.style.opacity - (new Date() - last)/400;
			last = +new Date();
			if(+el.style.opacity > 0){
				(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
			}
		}
		tick();
	},
	hide: function(){
		this.element.display = 'none';
	},
	show: function(){
		this.element.display = '';
	}
};

module.exports = animation;
},{"./utils":7}],3:[function(require,module,exports){
var utils = require('./utils'),
    dom = require('./dom'),
    css = require('./css'),
    event = require('./event'),
    animation = require('./animation'),
    ajax = require('./ajax');

var DOM = function(selector) {
    this.selector = selector || null;
    this.element = null;
    this.elements = null;
    this.dom = null;

    DOM.extend(dom, css, event, animation);
}


/*
 * 静态方法
 */
utils.extend(DOM, ajax);


/*
 * 提供给外部的扩展接口,扩展原型对象
 */
DOM.extend = function(obj) {
    function _include(obj) {
        if (obj === undefined) {
            return this;
        } else if (utils.isObject(obj)) {
            utils.extend(DOM.prototype, obj);
        } else {
            throw Error('Invalid parameters for extend method.');
        }
    }
    if (arguments.length != 1) {
        var args = utils.toArray(arguments);
        args.forEach(function(obj) {
            _include(obj);
        });
    } else {
        _include(arguments[0]);
    }
}



var DomProto = DOM.prototype;

/*
 * 返回所有的实例化的子元素对象
 */
DomProto.all = function() {
    var self;
    if (this.elements.length == 1) {
        self = this;
    } else {
        self = this.elements.map(function(el) {
            return (new DOM(el)).init();
        })
    }

    return self;
}

/*
 * 对所有的实例化的子元素对象进行操作
 */
DomProto.each = function(cb) {
    this.all().forEach(function(el) {
        cb(el);
    })
    return this;
}

/*
 * 对所有的实例化的子元素对象进行操作，并返回结果
 */
DomProto.map = function(cb) {
    return this.all().map(function(el) {
        return cb(el);
    })
}


/*
 * Interface
 */
var tinyJquery = function(selector) {
    var el;
    el = new DOM(selector);
    el.init();

    return el;
};

/*
 * inherit DomProto class
 */
utils.extend(tinyJquery, DOM);
module.exports = tinyJquery;

},{"./ajax":1,"./animation":2,"./css":4,"./dom":5,"./event":6,"./utils":7}],4:[function(require,module,exports){
var utils = require('./utils');

var css = {
	css: function(attr, value){
		var self = this;
		/*当参数为一个对象的时候*/
		if(arguments.length == 1 && typeof arguments[0] == 'object'){
			return utils.objMap(arguments[0], function(attr, value){
				return self.css(attr, value);
			})
		}

		if(value){
			this.element.style[attr] = value;
		}else if(attr){
			return getComputedStyle(this.element)[attr];
		}else{
			return this.element.style;
		}
	},
	height: function(){
		return this.element.offsetHeight;
	},
	/*innerHeight but no border*/
	innerHeight: function(){
		var el = this.element;
		var height = el.offsetHeight;
		var style = getComputedStyle(el);

		height -= (parseInt(style.borderTop) + parseInt(style.borderBottom));
		return height;
	},
	/*outerHeight with margin*/
	outerHeight: function(){
		var el = this.element;
		var height = el.offsetHeight;
		var style = getComputedStyle(el);

		height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		return height;
	},
	width: function(){
		return this.element.width;
	},
	/*outerHeight with margin*/
	outerWidth: function(){
		var el = this.element;
		var width = el.offsetWidth;
		var style = getComputedStyle(el);

		width += parseInt(style.marginLeft) + parseInt(style.marginRight);
		return width;
	},
	position: function(){
		var el = this.element;
		return {
			left: el.offsetLeft,
			top: el.offsetTop
		}
	},
	/*postion relative to viewport*/
	viewportPostion: function(){
		var el = this.element;
		var p = el.getBoundingClientRect();
		return {
			top: p.top,
			left: p.left
		}
	},
	scrollTop: function(){
		return this.position().top;
	},
	scrollLeft: function(){
		return this.position().left;
	}
}

module.exports = css;
},{"./utils":7}],5:[function(require,module,exports){
var utils = require('./utils');

var dom = {
    /*
     * element select
     */
    init: function() {
        var selector = this.selector;
        var selectorType = 'querySelectorAll';
        if (selector === undefined) throw Error('element selector can not be null.');

        /*window, document*/
        if(selector === window){
            this.element = window;
            this.elements = [window];
            this.dom = window;

            return this;
        }else if(selector === document){
            this.element = document;
            this.elements = [document];
            this.dom = document;

            return this;
        }

        /*nodeList elments*/
        if ((typeof selector == 'object') && (selector.nodeType === 1 || selector.nodeType === 9)) {
            this.selector = selector.nodeName;
            this.element = selector;
            this.dom = selector;
            this.elements = selector;
            return this;
        } else {
            var matches = selector.match(/<([\w-]*)>/);
            if (matches) {
                var nodeName = matches[0].replace('<', '').replace('>', '');
                this.element = document.createElement(nodeName);
                return this;
            } else if (selector.indexOf('#') === 0) {
                selectorType = 'getElementById';
                selector = selector.substr(1, Selector.length);
            }

            this.dom = document[selectorType](selector);
            this.elements = utils.toArray(document[selectorType](selector));
            this.element = this.elements[0];

            return this;
        }
    },
    /*
     * dom manipulation
     */
    val: function(newVal) {
        return (newVal !== undefined ? this.element.value = newVal : this.element.value);
    },
    clone: function(){
        var el = this.element;
        return el.cloneNode(true);
    },
    append: function(html) {
        this.element.innerHTML = this.element.innerHTML + html;
        return this;
    },
    prepend: function(html) {
        this.element.innerHTML = html + this.element.innerHTML;
        return this;
    },
    after: function(html) {
        this.element.insertAdjacentHTML('afterend', html);
        return this;
    },
    before: function(html) {
        this.element.insertAdjacentHTML('beforebegin', html);
        return this;
    },
    remove: function() {
        this.element.parentNode.removeChild(this.element);
        return this;
    },
    /*search*/
    first: function(){
        return this;
    },
    last: function(){
        var el = this.element;
        var length = this.elements.length;
        el = this.elements[length];
        return this;
    },
    prev: function(){
        return this.element.previousElementSibling;
    },
    next: function(){
        return this.element.nextElementSibling;
    },
    siblings: function(){
        var el = this.element;
        [].filter.call(el.parentNode.children, function(child){
            return child !== el;
        })
    },
    children: function(){
        var el = this.element;
        return el.children;
    },
    /*
     * class processor
     */
    addClass: function(className) {
        var el = this.element;
        el.className = ' ' + el.className + ' ';
        if (el.className.indexOf(' ' + className + ' ') !== -1) {
            return false;
        } else {
            el.className += className;
        }
        return this;
    },
    removeClass: function(className) {
        var el = this.element;
        el.className = el.className.replace(className, '');

        return this;
    },
    toggleClass: function(className){
        var el = this.element;
        el.className = ' ' + el.className + ' ';
        if (el.className.indexOf(' ' + className + ' ') !== -1) {
            this.removeClass(className);
        } else {
            el.className += className;
        }
        return this;
    },
    hasClass: function(className){
        var el = this.element;
        el.className = ' ' + el.className + ' ';
        if (el.className.indexOf(' ' + className + ' ') !== -1) {
            return true;
        } else {
            return false;
        }
    },
    /*
     * attribute
     */
    attr: function(prop, value) {
        if(value){
            this.element.setAttribute(prop, value);
        }else if(prop){
            this.element.getAttribute(prop);
        }
        return this;
    },
    removeAttr: function(prop) {
        this.element.removeAttribute(prop);
        return this;
    },
    text: function(text) {
        if (text === undefined) {
            return this.element.innerText;
        }
        this.element.innerText = text;

        return this;
    },
    html: function(html) {
        if (html === undefined) {
            return this.element.innerHTML;
        }
        this.element.innerHTML = html;

        return this;
    },
    replaceWith: function(html){
        var el = this.element;
        if(html){
            el.outerHTML = html;
        }
    }
}

module.exports = dom;

},{"./utils":7}],6:[function(require,module,exports){
var utils = require('./utils'),
    isObject = utils.isObject,
    isArray = utils.isArray,
    isString = utils.isString,
    isNumber = utils.isNumber,
    isFunc = utils.isFunc;

var event = {
    eventHandler: {
        events: {},
        bindEvent: function(event, callback, targetElement) {
            //bind event listener to DOM element
            //在冒泡阶段触发
            targetElement.addEventListener(event, callback, false);

            if (this.events[event]) {
                var counter = this.events[event].length;
                this.events[event].push({
                    eventId: counter,
                    event: callback,
                    target: targetElement
                })
            } else {
                this.events[event] = [];
                this.events[event].push({
                    eventId: 0,
                    event: callback,
                    target: targetElement
                })
            }

        },
        findEvent: function(event) {
            if (this.events[event]) {
                return this.events[event][0];
            } else {
                return false;
            }
        },
        /*
        * return all listen events
        */
        all: function(event) {
            if (this.events[event]) {
                return this.events[event];
            } else {
                return false;
            }
        },
        unbindEvent: function(event, targetElement) {
            var foundEvent = this.findEvent(event);
            if (foundEvent) {
                targetElement.removeEventListener(event, foundEvent.event, false);

                //update events array
                this.events = this.events[event].filter(function(e) {
                    return e.counter !== event.counter;
                }, event);
            }
        },
        remove: function(event, targetElement){
            var self = this;
            var events = this.all(event);
            if(events){
                events.forEach(function(e){
                    self.unbindEvent(e, targetElement)
                }) 
                self.events[event] = [];           
            }
        },
        /*
         * 检查该事件类型是否被绑定
         */
        isBinding: function(event) {
            if (this.findEvent(event)) {
                return true;
            } else {
                return false;
            }
        }
    },
    on: function(event, callback) {
        this.eventHandler.bindEvent(event, callback, this.element);
    },
    /*
     * bind once
     */
    once: function(event, callback) {
        this.eventHandler.remove(event);
        this.on(event, callback);
    },
    off: function(event) {
        this.eventHandler.unbindEvent(event, this.element);
    },
    /*
    * 触发指定事件
    */
    //事件不冒泡
    // emit: function(eventType){
    //     var event = new Event(eventType);
    //     this.element.dispatchEvent(event);
    // },
    //浏览器事件，默认冒泡
    trigger: function(type) {
        var el = this.element;
        var event = document.createEvent('HTMLEvents');
        event.initEvent(type, true, true);
        el.dispatchEvent(event);
    },
    //触发自定义事件，若为浏览器事件不冒泡
    emit: function(customType) {
        var el = this.element;
        var event = new CustomEvent(customType, { bubbles: false, cancelable: true });            
        el.dispatchEvent(event);
    },
    /*document ready*/
    ready: function(fn) {
        if (this.selector === document) {
            if (document.readyState != 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        } else {
            throw Error('the element must be document.');
        }
    },
    /*
    * browser events
    */
    click: function(fn){
        if(!fn){
            this.trigger('click');
        }else if(isFunc(fn)){
            this.on('click', fn);
        }
    },
    dblclick: function(fn){
        if(!fn){
            this.trigger('dblclick');
        }else if(isFunc(fn)){
            this.on('dblclick', fn);
        }
    },
    //会冒泡
    mouseover: function(fn){
        if(!fn){
            this.trigger('mouseover');
        }else if(isFunc(fn)){
            this.on('mouseover', fn);
        }
    },
    mouseout: function(fn){
        if(!fn){
            this.trigger('mouseout');
        }else if(isFunc(fn)){
            this.on('mouseout', fn);
        }
    },
    //不会冒泡
    mouseenter: function(fn){
        if(!fn){
            this.trigger('mouseenter');
        }else if(isFunc(fn)){
            this.on('mouseenter', fn);
        }
    },
    mouseleave: function(fn){
        if(!fn){
            this.trigger('mouseleave');
        }else if(isFunc(fn)){
            this.on('mouseleave', fn);
        }
    },
    mouseup: function(fn){
        if(!fn){
            this.trigger('mouseup');
        }else if(isFunc(fn)){
            this.on('mouseup', fn);
        }
    },
    mousedown: function(fn){
        if(!fn){
            this.trigger('mousedown');
        }else if(isFunc(fn)){
            this.on('mousedown', fn);
        }
    },
    focus: function(fn){
        if(!fn){
            this.trigger('focus');
        }else if(isFunc(fn)){
            this.on('focus', fn);
        }
    },
    blur: function(fn){
        if(!fn){
            this.trigger('blur');
        }else if(isFunc(fn)){
            this.on('blur', fn);
        }
    },
    change: function(fn){
        if(!fn){
            this.trigger('change');
        }else if(isFunc(fn)){
            this.on('change', fn);
        }
    }, 
    //to fix
    submit: function(fn){
        if(!fn){
            this.trigger('submit');
        }else if(isFunc(fn)){
            this.on('submit', fn);
        }
    },
    select: function(fn){
        if(!fn){
            this.trigger('select');
        }else if(isFunc(fn)){
            this.on('select', fn);
        }
    },  
    //键盘事件,如果按下不松开会一直触发keydown->keypress-keydown->keypress
    //按下时触发
    keydown: function(fn){
        if(!fn){
            this.trigger('keydown');
        }else if(isFunc(fn)){
            this.on('keydown', fn);
        }
    }, 
    //按下后触发
    keypress: function(fn){
        if(!fn){
            this.trigger('keypress');
        }else if(isFunc(fn)){
            this.on('keypress', fn);
        }
    },
    //按键松开触发
    keyup: function(fn){
        if(!fn){
            this.trigger('keyup');
        }else if(isFunc(fn)){
            this.on('keyup', fn);
        }
    }
}

module.exports = event;

},{"./utils":7}],7:[function(require,module,exports){
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
    isNumber: function(num){
        return utils.type(num) === 'number' ? true : false;
    },
    isNumber: function(str){
        return typeof str === 'string' ? true : false;
    },
    isFunc: function(fn){
        return utils.type(fn) === 'function' ? true : false;
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

},{}],8:[function(require,module,exports){
(function (global){
var dom = require('./lib/api');
global.dom = dom;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/api":3}]},{},[8]);

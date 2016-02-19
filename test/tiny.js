(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./utils":6}],2:[function(require,module,exports){
var utils = require('./utils'),
    dom = require('./dom'),
    css = require('./css'),
    event = require('./event'),
    animation = require('./animation');

var DOM = function(selector) {
    this.selector = selector || null;
    this.element = null;
    this.elements = null;
    this.dom = null;
}

DOM.prototype.all = function() {
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

DOM.prototype.each = function(cb){
	this.all().forEach(function(el){
		cb(el);
	})
}


DOM.prototype.map = function(cb){
	return this.all().map(function(el){
		return cb(el);
	})
}


/*
* Interface
*/
var tinyJquery = function(selector) {
    var el;

    function _init() {
        var args = utils.toArray(arguments);
        args.forEach(function(proto) {
            utils.extends(DOM.prototype, proto);
        });
        el = new DOM(selector);
        el.init();
    }
    _init(dom, css, event, animation);
    return el;
};

module.exports = tinyJquery;

},{"./animation":1,"./css":3,"./dom":4,"./event":5,"./utils":6}],3:[function(require,module,exports){
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
},{"./utils":6}],4:[function(require,module,exports){
var utils = require('./utils');

var dom = {
    /*
     * element select
     */
    init: function() {
        var selector = this.selector;
        var selectorType = 'querySelectorAll';
        if (selector === undefined) throw Error('element selector can not be null.');

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
    },
    prepend: function(html) {
        this.element.innerHTML = html + this.element.innerHTML;
    },
    after: function(html) {
        this.element.insertAdjacentHTML('afterend', html);
    },
    before: function(html) {
        this.element.insertAdjacentHTML('beforebegin', html);
    },
    remove: function() {
        this.element.parentNode.removeChild(this.element);
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

},{"./utils":6}],5:[function(require,module,exports){
var utils = require('./utils');

var event = {
    eventHandler: {
        events: [],
        bindEvent: function(event, callback, targetElement) {
            //remove duplicate event,一个元素只添加一个点击事件
            this.unbindEvent(event, targetElement);

            //bind event listener to DOM element
            targetElement.addEventListener(event, callback, false);

            this.events.push({
                type: event,
                event: callback,
                target: targetElement
            })
        },
        findEvent: function(event) {
            return this.events.filter(function(e) {
                return (e.type === event);
            }, event)[0];
        },
        unbindEvent: function(event, targetElement) {
            var foundEvent = this.findEvent(event);
            if (foundEvent !== undefined) {
                targetElement.removeEventListener(event, foundEvent.event, false);
            }

            //update events array
            this.events = this.events.filter(function(e) {
                return e.type !== event;
            }, event);
        },
        /*
		* 重复绑定的情况
        */
        addEvent: function(event, callback, targetElement) {
            //bind event listener to DOM element
            targetElement.addEventListener(event, callback, false);

            this.events.push({
                type: event,
                event: callback,
                target: targetElement
            })
        },
        removeEvent: function(event, targetElement){
        	var foundEvent = this.findEvent(event);
            if (foundEvent !== undefined) {
                targetElement.removeEventListener(event, foundEvent.event, false);
                this.removeEvent(event, targetElement);
            }
            //update events array
            this.events = this.events.filter(function(e) {
                return e.type !== event;
            }, event);
        },
    },
    on: function(event, callback) {
    	this.eventHandler.bindEvent(event, callback, this.element);
	},
	off: function(event) {
    	this.eventHandler.unbindEvent(event, this.element);
	},
	trigger: function(type){
		var el = this.element;
		var event = document.createEvent('HTMLEvents');
		event.initEvent(type, true, false);
		el.dispatchEvent(event);
	},
	triggerCustom: function(customType){
		var el = this.element;
		var event = new CustomEvent(customType, {bubbles: true, cancelable: true});
		el.dispatchEvent(event);
	}
}

module.exports = event;


},{"./utils":6}],6:[function(require,module,exports){
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
    extends: function(child, parent, bool) {
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
    extend: function(out) {
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

},{}],7:[function(require,module,exports){
(function (global){
var dom = require('./lib/api');
global.dom = dom;
// console.log($$('.title'));
// console.log($$('.title').addClass('redColor'));

// console.log($$('.title').all().forEach(function(e){
// 	e.addClass('bule');
// }));

// $$('.title').each(function(dom){
// 	console.log(dom);
// 	dom.addClass('yang');
// })
var dom = dom('.title');
dom.css({'width': '200px', 'height': '100px', 'padding': '10px', 'border-width': '10px'});
console.log('outerHeight', dom.outerHeight());
console.log('Height', dom.height());
console.log('innerHeight', dom.innerHeight());
console.log('position', dom.position());
console.log('viewportPostion', dom.viewportPostion());
console.log('scrollTop', dom.scrollTop());
console.log('css', dom.css());
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/api":2}]},{},[7]);

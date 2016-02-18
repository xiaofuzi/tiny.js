(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('./utils'),
    dom = require('./dom'),
    css = require('./css');

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
    _init(dom, css);
    return el;
};



module.exports = tinyJquery;

},{"./css":2,"./dom":3,"./utils":4}],2:[function(require,module,exports){
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
},{"./utils":4}],3:[function(require,module,exports){
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
        if (utils.isArray(this.element)) {
            this.element.forEach(function(el) {
                return (newVal !== undefined ? el.value = newVal : el.value);
            })
        } else {
            return (newVal !== undefined ? this.element.value = newVal : this.element.value);
        }
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


function _fnMap(elements, fn) {
    if (utils.isArray(elements)) {
        return elements.map(function(el) {
            return fn(el);
        })
    } else {
        return fn(elements);
    }
}
module.exports = dom;

},{"./utils":4}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
var $$ = require('./lib/api');

// console.log($$('.title'));
// console.log($$('.title').addClass('redColor'));

// console.log($$('.title').all().forEach(function(e){
// 	e.addClass('bule');
// }));

// $$('.title').each(function(dom){
// 	console.log(dom);
// 	dom.addClass('yang');
// })
var dom = $$('.title');
dom.css({'width': '200px', 'height': '100px', 'padding': '10px', 'border-width': '10px'});
console.log('outerHeight', dom.outerHeight());
console.log('Height', dom.height());
console.log('innerHeight', dom.innerHeight());
console.log('position', dom.position());
console.log('viewportPostion', dom.viewportPostion());
console.log('scrollTop', dom.scrollTop());
console.log('css', dom.css());
},{"./lib/api":1}]},{},[5]);

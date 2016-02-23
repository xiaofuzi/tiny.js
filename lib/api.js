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

    DOM.extend(dom, css, event, animation);
}


/*
 * 静态方法
 */

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

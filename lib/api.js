var utils = require('./utils'),
    dom = require('./dom');

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
    _init(dom);
    return el;
};



module.exports = tinyJquery;

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
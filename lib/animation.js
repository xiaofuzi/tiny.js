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
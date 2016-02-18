var utils = require('./utils');

var event = {
    eventHandler = {
        events: [],
        bindEvent: function(event, callback, targetElement) {
            //remove duplicate event
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
        }
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
	}
}

module.exports = event;


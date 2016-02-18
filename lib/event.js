DOM.prototype.eventHandler = {
	events: [],
	bindEvent: function(event, callback, targetElement){
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
	findEvent: function(event){
		return this.events.filter(function(e){
			return (e.type === event);
		}, event)[0];
	},
	unbindEvent: function(event, targetElement){
		var foundEvent = this.findEvent(event);
		if(foundEvent !==  undefined){
			targetElement.removeEventListener(event, foundEvent.event, false);
		}

		//update events array
		this.events = this.events.filter(function(e){
			return e.type !== event;
		}, event);
	}
}

DOM.prototype.on = function(event, callback){
	this.eventHandler.bindEvent(event, callback, this.element);
}

DOM.prototype.off = function(event){
	this.eventHandler.unbindEvent(event, this.element);
}

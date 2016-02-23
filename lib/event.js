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

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
            } else if ((selector.indexOf('#') === 0) && (selector.indexOf(' ') === -1)) {
                selectorType = 'getElementById';
                selector = selector.substr(1, selector.length);
            }

            this.dom = document[selectorType](selector);
            this.elements = utils.toArray(this.dom);
            this.element = this.elements.length > 0 ? this.elements[0] : this.dom;

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

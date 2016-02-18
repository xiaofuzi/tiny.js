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
    /*
     * property setting
     */
    attr: function(prop, value) {
        this.element.setAttribute(prop, value);
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

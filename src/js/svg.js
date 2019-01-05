window.SVG = {
    svgns: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink',

    createElement: function(name, attrs) {
        let element = document.createElementNS(this.svgns, name);
        if (attrs) {
            this.setAttr(element, attrs);
        }
        return element;
    },

    setAttr: function(element, attrs) {
        if (attrs.href) {
            element.setAttributeNS(this.xlink, 'href', attrs.href);
            delete attrs.href;
        }
        if (attrs.src) {
            element.setAttributeNS(this.xlink, 'href', attrs.src);
            delete attrs.src;
        }
        for (let i in attrs) {
            element.setAttribute(i, attrs[i]);
        }
    },
};

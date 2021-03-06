window.$ = (function () {
    const self = {};

    self.options = {
        callbackName: '_jqjsp',
        timeout: 10000,
    };

    self.methods = {
        init: function(options) {
            self.options.callbackName = options.callbackName || self.options.callbackName;
            self.options.timeout = options.timeout || self.options.timeout;

            let id = '_' + Math.round(10000 * Math.random()),
                data = options.data || {},
                url = options.url,
                callbackSuccess = options.success || function(){},
                callbackError = options.error || function(){},
                timeoutID = self.methods.startTimer(url, callbackError);

            for (let key in data) {
                url = self.methods.appendParam(url, key, data[key]);
            }
            url = self.methods.appendParam(url, 'callback', self.options.callbackName);

            self.methods.addScript(id, url, callbackError, id);

            window[self.options.callbackName] = (data) => {
                self.methods.clear(id, timeoutID);
                callbackSuccess(data);
            };
        },

        appendParam: function(url, key, param) {
            return url + (url.indexOf('?') > 0 ? '&' : '?') + key + '=' + param;
        },

        clear: function(id, timeoutID) {
            if (null != timeoutID) {
                window.clearTimeout(timeoutID);
            }
            delete window[self.options.callbackName];
            let ele = document.getElementById(id);
            if (null != ele) {
                ele.parentNode.removeChild(ele);
            }
        },

        addScript: function(id, url, callback) {
            const svgns = 'http://www.w3.org/2000/svg';
            const xlink = 'http://www.w3.org/1999/xlink';
            const script = document.createElementNS(svgns, 'script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('async', true);
            script.setAttribute('id', id);
            script.setAttributeNS(xlink, 'xlink:href', url);
            script.addEventListener('error', callback);

            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('svg')[0]).appendChild(script);
        },

        startTimer: function(url, callback, id) {
            return window.setTimeout(() => {
                self.methods.clear(id, null);
                callback('Request timeout.', url);
            }, self.options.timeout);
        },
    };

    return {
        jsonp: function(options) {
            self.methods.init(options);
        },
    };

})();

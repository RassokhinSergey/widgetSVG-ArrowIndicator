ArrowIndicator = (function () {
    'use strict';

    const console = window.console;

    const self = {};

    self.options = {
        id: 'objIndicatorVolt',
        url: '/handlers/getIndicatorVolt.php',
        interval: 60,

        textName: 'Вх.Напряжение',
        data2: [160, 210, 240, 280],
        indicatorColors:['#0f6eb3', '#00997b', 'red'],

        cx: null,
        cy: null,

        maxAngle: 230,
        height: 200,
        indicatorBgWidth: 25,
        indicatorWidth: 4,
        indicatorRadiuses: 70,
        diagramcentercy: 60,    // смешение центра диаграмы (это высота шрифта названия контрола плюс высота шрифта значения на шкале)
    };

    self.svg = {
        doc : null,
    };

    self.methods = {
        init: function(evt) {
            let obj;
            try {
                self.svg.doc = evt.target.ownerDocument;

                obj = window.frameElement;
            }
            catch(exception) {
                console.log('Невозможно получить корень SVG или HTML документа.');
                return;
            }

            self.options.url = obj.dataset.url || self.options.url;
            self.options.id = obj.id || self.options.id;

            // выесняем размер блока который выделил пользователь
            let x = obj.offsetHeight;
            let y = obj.offsetWidth;

            let height;
            if (0 == x && 0 == y) {
                height = 200;
            } else if (0 == x) {
                height = y;
            } else if (0 == y) {
                height = x;
            } else {
                height = x;
                if (height > y)
                    height = y;
            }

            let svg = self.svg.doc.getElementsByTagName('svg')[0];
            svg.setAttribute('width', height);
            svg.setAttribute('height', height);

            self.options.cx = self.options.height / 2;
            self.options.cy = (self.options.height - self.options.diagramcentercy) / 2 + self.options.diagramcentercy;

            self.methods.createIndicator();

            self.methods.getSensor();
            setInterval(self.methods.getSensor, self.options.interval * 1000);
        },

        getSensor: function() {
            try {
                window.$.jsonp({
                    url: self.options.url,
                    data: { 'id': self.options.id },
                    callbackParameter: 'callback',
                    timeout: 90000, // 90 сек по умолчанию 10 сек
                    success: function(data) {
                        if (data.lenght == 0)
                            return;
                        self.methods.renderValue(data["v"]);
                    },
                    error: function (event, textStatus, error) {
                        console.log('ArrowIndicator getSensor(' + self.options.id +') event: ' + JSON.stringify(event) + 
                        ' textStatus: ' + textStatus + ' error: ' + error);
                    }
                });
            }
            catch(exception) {
                console.log('незагружен модуль jsonp ' + exception);
                return;
            }

        },

        renderValue: function(value) {
            // изменить цыфровой показатель
            self.svg.doc.getElementById('value').innerHTML = value + ' V';

            // изменить графический показатель
            const path = self.svg.doc.getElementById('path-value');
            const leng = self.options.data2[self.options.data2.length-1] - self.options.data2[0];
            let val = 0;
            let indicatorColors = self.options.indicatorColors[0];

            // Изменять цвет в зависимости от значенния 
            for (let  i=0; i < self.options.data2.length -1; i++) {
                if (value > self.options.data2[i]) {
                    val = value - self.options.data2[0];
                    indicatorColors = self.options.indicatorColors[i];
                }
            }
            path.setAttribute('stroke', indicatorColors);

            const radius = self.options.indicatorRadiuses - self.options.indicatorBgWidth/2 - self.options.indicatorWidth/2 - 2;
            const gradEnd = (val) * 100 / leng * self.options.maxAngle / 100;

            path.setAttribute('d', self.methods.indicator(self.options.cx, self.options.cy, radius, 0, gradEnd));
        },

        createIndicator: function() {
            const scene = self.svg.doc.getElementById('scene');
            let text = self.svg.doc.getElementById('name');
            text.setAttribute('x', self.options.cx);
            text.setAttribute('y', 25);
            text.textContent = self.options.textName;

            const path = window.SVG.createElement('path', {
                id:'path-value',
                'fill-opacity': 0,
                'stroke-width' : self.options.indicatorBgWidth,
            });
            scene.appendChild(path);

            const leng = self.options.data2[self.options.data2.length-1] - self.options.data2[0];
            let gradStart = 0;
            for (let i = 0; i < self.options.data2.length -1; i++) {
                let gradEnd = (self.options.data2[i+1] - self.options.data2[0]) * 100 / leng * self.options.maxAngle / 100;

                const path = window.SVG.createElement('path', {
                    'fill-opacity' : 0,
                    'stroke': self.options.indicatorColors[i],
                    'stroke-width': self.options.indicatorWidth,
                    'd': self.methods.indicator(self.options.cx, self.options.cy, self.options.indicatorRadiuses, gradStart, gradEnd),
                });
                scene.appendChild(path);

                self.methods.textIndicator(gradStart, self.options.data2[i], scene);
                gradStart = gradEnd;
            }

            self.methods.textIndicator(gradStart, self.options.data2[self.options.data2.length -1], scene);
        },

        textIndicator:function(gradStart, textContent, scene) {
            const pStart = self.methods.polarToCartesian(self.options.cx, self.options.cy, self.options.indicatorRadiuses+10, gradStart);
            const grad = gradStart + 270 - (self.options.maxAngle - 180)/2;
            const text = window.SVG.createElement('text', {
                x: pStart.x,
                y: pStart.y,
                'text-anchor': 'middle',
                'transform': 'rotate(' + grad + ',' + pStart.x + ',' + pStart.y + ')',
            });

            text.textContent = textContent;
            scene.appendChild(text);
        },

        polarToCartesian: function(cx, cy, radius, deg) {
            var rad = (deg + 180 - (self.options.maxAngle - 180)/2) * Math.PI / 180;

            return {
                x: cx + (radius * Math.cos(rad)),
                y: cy + (radius * Math.sin(rad))
            };
        },

        indicator: function(x, y, radius, angleStart, angleEnd) {
            var start = self.methods.polarToCartesian(x, y, radius, angleStart),
                end = self.methods.polarToCartesian(x, y, radius, angleEnd),
                largeArc = (angleEnd - angleStart) <= 180 ? 0 : 1;
            return [
                'M', start.x, start.y, 
                'A', radius, radius, 0, largeArc, 1, end.x, end.y
            ].join(' ');
        }

    };

    return {
        init: function(evt) {
            self.methods.init(evt);
        },
    };
})();
 

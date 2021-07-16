/*global L */
(function () {
    'use strict';

    /**
     * Piechart Icon
     * @type {L.PiechartIcon}
     * @extends {L.CanvasIcon}
     */
    L.PiechartIcon = L.CanvasIcon.extend({
        options: {
            iconSize: [48, 48],
            iconAnchor: [24, 24],
            popupAnchor: [24, 24],
            className: 'leaflet-piechart-icon',
            valueField: 'value',
            nameField: 'name'
            /*
             data: [
                 {
                     name: 'Value',
                     value: 20, // Percentage or raw value
                     style: {
                         fillStyle: 'rgba(255,0,0,.5)',
                         strokeStyle: 'rgba(255,0,0,.5)',
                         lineWidth: 1
                     }
                 },
             ...
             ]
             */
        },

        /**
         * @param {HTMLCanvasElement} icon
         * @param {string} type
         */
        _setIconStyles: function (icon, type) {
            var data = this.options.data;
            if ((type == 'icon') && data && L.Util.isArray(data) && icon.getContext) {
                var ctx = icon.getContext('2d');
                var size = L.point(this.options.iconSize);
                var center = size.divideBy(2);
                ctx.clearRect(0, 0, size.x, size.y);

                var valueField = this.options.valueField;
                var total = this._getTotal(data, valueField);
                var x = center.x;
                var y = center.y;
                if (total) {
                    var radius = Math.min(x, y);
                    var fraction = Math.PI / total * 2;
                    var startAngle = -Math.PI / 2;
                    var stopAngle;
                    var style;
                    for (var i = 0, l = data.length; i < l; i++) {
                        ctx.beginPath();
                        style = data[i].style || this._getStyle(i, l);
                        this._applyStyle(ctx, style);
                        stopAngle = fraction * data[i][valueField] + startAngle;
                        ctx.arc(x, y, radius - Math.ceil((style.lineWidth || 0) / 2), startAngle, stopAngle);
                        ctx.stroke();
                        ctx.lineTo(x, y);
                        startAngle = stopAngle;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
            L.CanvasIcon.prototype._setIconStyles.apply(this, arguments);
        },

        /**
         * @param {Object[]} data Array of objects
         * @param {string} field Field to summarize
         * @returns {number}
         * @private
         */
        _getTotal: function (data, field) {
            var total = 0;
            for (var i = 0, l = data.length; i < l; i++) {
                total += (+data[i][field]);
            }
            return total;
        },

        /**
         * Applies context style
         * @param {CanvasRenderingContext2D} ctx
         * @param {Object} props
         * @private
         */
        _applyStyle: function (ctx, props) {
            for (var i in props) {
                ctx[i] = props[i];
            }
        },

        /**
         * Generates style for chart segment
         * @param {number} segment Segment number
         * @param {number} total Total segments
         * @returns {{fillStyle: string, strokeStyle: string, lineWidth: number}}
         * @private
         */
        _getStyle: function (segment, total) {
            /**
             * Converts an HSL color value to RGB. Conversion formula
             * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
             * Assumes h, s, and l are contained in the set [0, 1] and
             * returns r, g, and b in the set [0, 255].
             * @url http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
             *
             * @param {number} h The hue
             * @param {number} s The saturation
             * @param {number} l The lightness
             * @return {string} The RGB representation
             */
            var hslToRgb = function (h, s, l) {
                var r, g, b;
                if (s == 0) {
                    r = g = b = l; // achromatic
                } else {
                    var hue2rgb = function (p, q, t) {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                        if (t < 1 / 2) return q;
                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    };

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }

                return Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255);
            };

            var angle = 360 / (total * 2.5);
            var offset = (segment % 2) * total;
            var hue = (angle * (offset + (segment - (segment % 2)))) / 360;
            var rgb = hslToRgb(hue, 0.7, 0.5);
            return {
                fillStyle: 'rgba(' + rgb + ',.5)',
                strokeStyle: 'rgba(' + rgb + ',.7)',
                lineWidth: 1
            };
        }
    });

    /**
     * Pie char Icon factory
     * @param {Object} options
     * @returns {L.PiechartIcon}
     */
    L.piechartIcon = function (options) {
        return new L.PiechartIcon(options);
    };

    /**
     * Pie chart Marker
     * @type {L.Marker}
     */
    L.PiechartMarker = L.Marker.extend({
        options: {
            icon: null,
            radius: 20,
            riseOnHover: true
        },

        initialize: function (latlng, options) {
            var opts = {};
            L.Util.extend(opts, options);
            if (opts.radius) {
                var diameter = opts.radius * 2;
                opts.iconSize = [diameter, diameter];
                // Optionally set the icon anchor position, just in case the
                // user wants to override it specifically
                if (opts.iconAnchor == undefined) {
                  opts.iconAnchor = [opts.radius, opts.radius];
                }
            }
            opts.icon = L.piechartIcon(opts);
            L.Marker.prototype.initialize.apply(this, [latlng, opts]);
        }
    });

    /**
     * Pie chart Marker factory
     * @param {L.LatLng} latlng
     * @param {Object} options
     * @returns {L.PiechartMarker}
     */
    L.piechartMarker = function (latlng, options) {
        return new L.PiechartMarker(latlng, options);
    }

}());

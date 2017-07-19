!function() {
    "use strict";
    function t(i) {
        if (!i) throw new Error("No options passed to Waypoint constructor");
        if (!i.element) throw new Error("No element option passed to Waypoint constructor");
        if (!i.handler) throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, i), 
        this.element = this.options.element, this.adapter = new t.Adapter(this.element), 
        this.callback = i.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", 
        this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), 
        this.group.add(this), this.context.add(this), s[this.key] = this, e += 1;
    }
    var e = 0, s = {};
    t.prototype.queueTrigger = function(t) {
        this.group.queueTrigger(this, t);
    }, t.prototype.trigger = function(t) {
        this.enabled && this.callback && this.callback.apply(this, t);
    }, t.prototype.destroy = function() {
        this.context.remove(this), this.group.remove(this), delete s[this.key];
    }, t.prototype.disable = function() {
        return this.enabled = !1, this;
    }, t.prototype.enable = function() {
        return this.context.refresh(), this.enabled = !0, this;
    }, t.prototype.next = function() {
        return this.group.next(this);
    }, t.prototype.previous = function() {
        return this.group.previous(this);
    }, t.invokeAll = function(t) {
        var e = [];
        for (var i in s) e.push(s[i]);
        for (var r = 0, a = e.length; r < a; r++) e[r][t]();
    }, t.destroyAll = function() {
        t.invokeAll("destroy");
    }, t.disableAll = function() {
        t.invokeAll("disable");
    }, t.enableAll = function() {
        t.Context.refreshAll();
        for (var e in s) s[e].enabled = !0;
        return this;
    }, t.refreshAll = function() {
        t.Context.refreshAll();
    }, t.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight;
    }, t.viewportWidth = function() {
        return document.documentElement.clientWidth;
    }, t.adapters = [], t.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    }, t.offsetAliases = {
        "bottom-in-view": function() {
            return this.context.innerHeight() - this.adapter.outerHeight();
        },
        "right-in-view": function() {
            return this.context.innerWidth() - this.adapter.outerWidth();
        }
    }, window.Waypoint = t;
}(), function() {
    "use strict";
    function t(t) {
        window.setTimeout(t, 1e3 / 60);
    }
    function e(t) {
        this.element = t, this.Adapter = r.Adapter, this.adapter = new this.Adapter(t), 
        this.key = "waypoint-context-" + s, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }, this.waypoints = {
            vertical: {},
            horizontal: {}
        }, t.waypointContextKey = this.key, i[t.waypointContextKey] = this, s += 1, r.windowContext || (r.windowContext = !0, 
        r.windowContext = new e(window)), this.createThrottledScrollHandler(), this.createThrottledResizeHandler();
    }
    var s = 0, i = {}, r = window.Waypoint, a = window.onload;
    e.prototype.add = function(t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[e][t.key] = t, this.refresh();
    }, e.prototype.checkEmpty = function() {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal), e = this.Adapter.isEmptyObject(this.waypoints.vertical), s = this.element == this.element.window;
        t && e && !s && (this.adapter.off(".waypoints"), delete i[this.key]);
    }, e.prototype.createThrottledResizeHandler = function() {
        function t() {
            e.handleResize(), e.didResize = !1;
        }
        var e = this;
        this.adapter.on("resize.waypoints", function() {
            e.didResize || (e.didResize = !0, r.requestAnimationFrame(t));
        });
    }, e.prototype.createThrottledScrollHandler = function() {
        function t() {
            e.handleScroll(), e.didScroll = !1;
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function() {
            e.didScroll && !r.isTouch || (e.didScroll = !0, r.requestAnimationFrame(t));
        });
    }, e.prototype.handleResize = function() {
        r.Context.refreshAll();
    }, e.prototype.handleScroll = function() {
        var t = {}, e = {
            horizontal: {
                newScroll: this.adapter.scrollLeft(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left"
            },
            vertical: {
                newScroll: this.adapter.scrollTop(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up"
            }
        };
        for (var s in e) {
            var i = e[s], r = i.newScroll > i.oldScroll ? i.forward : i.backward;
            for (var a in this.waypoints[s]) {
                var n = this.waypoints[s][a];
                if (null !== n.triggerPoint) {
                    var h = i.oldScroll < n.triggerPoint, o = i.newScroll >= n.triggerPoint, p = h && o, l = !h && !o;
                    (p || l) && (n.queueTrigger(r), t[n.group.id] = n.group);
                }
            }
        }
        for (var f in t) t[f].flushTriggers();
        this.oldScroll = {
            x: e.horizontal.newScroll,
            y: e.vertical.newScroll
        };
    }, e.prototype.innerHeight = function() {
        return this.element == this.element.window ? r.viewportHeight() : this.adapter.innerHeight();
    }, e.prototype.remove = function(t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty();
    }, e.prototype.innerWidth = function() {
        return this.element == this.element.window ? r.viewportWidth() : this.adapter.innerWidth();
    }, e.prototype.destroy = function() {
        var t = [];
        for (var e in this.waypoints) for (var s in this.waypoints[e]) t.push(this.waypoints[e][s]);
        for (var i = 0, r = t.length; i < r; i++) t[i].destroy();
    }, e.prototype.refresh = function() {
        var t, e = this.element == this.element.window, s = e ? void 0 : this.adapter.offset(), i = {};
        this.handleScroll(), t = {
            horizontal: {
                contextOffset: e ? 0 : s.left,
                contextScroll: e ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left",
                offsetProp: "left"
            },
            vertical: {
                contextOffset: e ? 0 : s.top,
                contextScroll: e ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up",
                offsetProp: "top"
            }
        };
        for (var a in t) {
            var n = t[a];
            for (var h in this.waypoints[a]) {
                var o, p, l, f, m, d = this.waypoints[a][h], c = d.options.offset, u = d.triggerPoint, g = 0, y = null == u;
                d.element !== d.element.window && (g = d.adapter.offset()[n.offsetProp]), "function" == typeof c ? c = c.apply(d) : "string" == typeof c && (c = parseFloat(c), 
                d.options.offset.indexOf("%") > -1 && (c = Math.ceil(n.contextDimension * c / 100))), 
                o = n.contextScroll - n.contextOffset, d.triggerPoint = Math.floor(g + o - c), p = u < n.oldScroll, 
                l = d.triggerPoint >= n.oldScroll, f = p && l, m = !p && !l, !y && f ? (d.queueTrigger(n.backward), 
                i[d.group.id] = d.group) : !y && m ? (d.queueTrigger(n.forward), i[d.group.id] = d.group) : y && n.oldScroll >= d.triggerPoint && (d.queueTrigger(n.forward), 
                i[d.group.id] = d.group);
            }
        }
        return r.requestAnimationFrame(function() {
            for (var t in i) i[t].flushTriggers();
        }), this;
    }, e.findOrCreateByElement = function(t) {
        return e.findByElement(t) || new e(t);
    }, e.refreshAll = function() {
        for (var t in i) i[t].refresh();
    }, e.findByElement = function(t) {
        return i[t.waypointContextKey];
    }, window.onload = function() {
        a && a(), e.refreshAll();
    }, r.requestAnimationFrame = function(e) {
        (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t).call(window, e);
    }, r.Context = e;
}(), function() {
    "use strict";
    function t(t, e) {
        return t.triggerPoint - e.triggerPoint;
    }
    function e(t, e) {
        return e.triggerPoint - t.triggerPoint;
    }
    function s(t) {
        this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], 
        this.clearTriggerQueues(), i[this.axis][this.name] = this;
    }
    var i = {
        vertical: {},
        horizontal: {}
    }, r = window.Waypoint;
    s.prototype.add = function(t) {
        this.waypoints.push(t);
    }, s.prototype.clearTriggerQueues = function() {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        };
    }, s.prototype.flushTriggers = function() {
        for (var s in this.triggerQueues) {
            var i = this.triggerQueues[s], r = "up" === s || "left" === s;
            i.sort(r ? e : t);
            for (var a = 0, n = i.length; a < n; a += 1) {
                var h = i[a];
                (h.options.continuous || a === i.length - 1) && h.trigger([ s ]);
            }
        }
        this.clearTriggerQueues();
    }, s.prototype.next = function(e) {
        this.waypoints.sort(t);
        var s = r.Adapter.inArray(e, this.waypoints);
        return s === this.waypoints.length - 1 ? null : this.waypoints[s + 1];
    }, s.prototype.previous = function(e) {
        this.waypoints.sort(t);
        var s = r.Adapter.inArray(e, this.waypoints);
        return s ? this.waypoints[s - 1] : null;
    }, s.prototype.queueTrigger = function(t, e) {
        this.triggerQueues[e].push(t);
    }, s.prototype.remove = function(t) {
        var e = r.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1);
    }, s.prototype.first = function() {
        return this.waypoints[0];
    }, s.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1];
    }, s.findOrCreate = function(t) {
        return i[t.axis][t.name] || new s(t);
    }, r.Group = s;
}(), function() {
    "use strict";
    function t(t) {
        this.$element = e(t);
    }
    var e = window.jQuery, s = window.Waypoint;
    e.each([ "innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop" ], function(e, s) {
        t.prototype[s] = function() {
            var t = Array.prototype.slice.call(arguments);
            return this.$element[s].apply(this.$element, t);
        };
    }), e.each([ "extend", "inArray", "isEmptyObject" ], function(s, i) {
        t[i] = e[i];
    }), s.adapters.push({
        name: "jquery",
        Adapter: t
    }), s.Adapter = t;
}(), function() {
    "use strict";
    function t(t) {
        return function() {
            var s = [], i = arguments[0];
            return t.isFunction(arguments[0]) && ((i = t.extend({}, arguments[1])).handler = arguments[0]), 
            this.each(function() {
                var r = t.extend({}, i, {
                    element: this
                });
                "string" == typeof r.context && (r.context = t(this).closest(r.context)[0]), s.push(new e(r));
            }), s;
        };
    }
    var e = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto));
}(), function() {
    "use strict";
    function t(i) {
        this.options = e.extend({}, s.defaults, t.defaults, i), this.element = this.options.element, 
        this.$element = e(this.element), this.createWrapper(), this.createWaypoint();
    }
    var e = window.jQuery, s = window.Waypoint;
    t.prototype.createWaypoint = function() {
        var t = this.options.handler;
        this.waypoint = new s(e.extend({}, this.options, {
            element: this.wrapper,
            handler: e.proxy(function(e) {
                var s = this.options.direction.indexOf(e) > -1, i = s ? this.$element.outerHeight(!0) : "";
                this.$wrapper.height(i), this.$element.toggleClass(this.options.stuckClass, s), 
                t && t.call(this, e);
            }, this)
        }));
    }, t.prototype.createWrapper = function() {
        this.options.wrapper && this.$element.wrap(this.options.wrapper), this.$wrapper = this.$element.parent(), 
        this.wrapper = this.$wrapper[0];
    }, t.prototype.destroy = function() {
        this.$element.parent()[0] === this.wrapper && (this.waypoint.destroy(), this.$element.removeClass(this.options.stuckClass), 
        this.options.wrapper && this.$element.unwrap());
    }, t.defaults = {
        wrapper: '<div class="sticky-wrapper" />',
        stuckClass: "stuck",
        direction: "down right"
    }, s.Sticky = t;
}();

var window = void 0 === window ? {} : window;

!function(t, e) {
    "function" == typeof define && define.amd ? define(e) : "object" == typeof module && module.exports ? module.exports = e() : t.bodymovin = e();
}(window, function() {
    function t(t) {
        dt = t ? Math.round : function(t) {
            return t;
        };
    }
    function e(t) {
        return Math.round(1e4 * t) / 1e4;
    }
    function s(t) {
        t.style.userSelect = "none", t.style.MozUserSelect = "none", t.style.webkitUserSelect = "none", 
        t.style.oUserSelect = "none";
    }
    function i(t, e, s, i) {
        this.type = t, this.currentTime = e, this.totalTime = s, this.direction = i < 0 ? -1 : 1;
    }
    function r(t, e) {
        this.type = t, this.direction = e < 0 ? -1 : 1;
    }
    function a(t, e, s, i) {
        this.type = t, this.currentLoop = e, this.totalLoops = s, this.direction = i < 0 ? -1 : 1;
    }
    function n(t, e, s) {
        this.type = t, this.firstFrame = e, this.totalFrames = s;
    }
    function h(t, e) {
        this.type = t, this.target = e;
    }
    function o(t, e) {
        return this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e), function() {
            this.removeEventListener(t, e);
        }.bind(this);
    }
    function p(t, e) {
        if (e) {
            if (this._cbs[t]) {
                for (var s = 0, i = this._cbs[t].length; s < i; ) this._cbs[t][s] === e && (this._cbs[t].splice(s, 1), 
                s -= 1, i -= 1), s += 1;
                this._cbs[t].length || (this._cbs[t] = null);
            }
        } else this._cbs[t] = null;
    }
    function l(t, e) {
        if (this._cbs[t]) for (var s = this._cbs[t].length, i = 0; i < s; i++) this._cbs[t][i](e);
    }
    function f(t, e) {
        void 0 === e && (e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
        var s, i = "";
        for (s = t; s > 0; --s) i += e[Math.round(Math.random() * (e.length - 1))];
        return i;
    }
    function m(t, e, s) {
        var i, r, a, n, h, o, p, l;
        switch (1 === arguments.length && (e = t.s, s = t.v, t = t.h), n = Math.floor(6 * t), 
        h = 6 * t - n, o = s * (1 - e), p = s * (1 - h * e), l = s * (1 - (1 - h) * e), 
        n % 6) {
          case 0:
            i = s, r = l, a = o;
            break;

          case 1:
            i = p, r = s, a = o;
            break;

          case 2:
            i = o, r = s, a = l;
            break;

          case 3:
            i = o, r = p, a = s;
            break;

          case 4:
            i = l, r = o, a = s;
            break;

          case 5:
            i = s, r = o, a = p;
        }
        return [ i, r, a ];
    }
    function d(t, e, s) {
        1 === arguments.length && (e = t.g, s = t.b, t = t.r);
        var i, r = Math.max(t, e, s), a = Math.min(t, e, s), n = r - a, h = 0 === r ? 0 : n / r, o = r / 255;
        switch (r) {
          case a:
            i = 0;
            break;

          case t:
            i = e - s + n * (e < s ? 6 : 0), i /= 6 * n;
            break;

          case e:
            i = s - t + 2 * n, i /= 6 * n;
            break;

          case s:
            i = t - e + 4 * n, i /= 6 * n;
        }
        return [ i, h, o ];
    }
    function c(t, e) {
        var s = d(255 * t[0], 255 * t[1], 255 * t[2]);
        return s[1] += e, s[1] > 1 ? s[1] = 1 : s[1] <= 0 && (s[1] = 0), m(s[0], s[1], s[2]);
    }
    function u(t, e) {
        var s = d(255 * t[0], 255 * t[1], 255 * t[2]);
        return s[2] += e, s[2] > 1 ? s[2] = 1 : s[2] < 0 && (s[2] = 0), m(s[0], s[1], s[2]);
    }
    function g(t, e) {
        var s = d(255 * t[0], 255 * t[1], 255 * t[2]);
        return s[0] += e / 360, s[0] > 1 ? s[0] -= 1 : s[0] < 0 && (s[0] += 1), m(s[0], s[1], s[2]);
    }
    function y(t, e, s, i, r, a) {
        this.o = t, this.sw = e, this.sc = s, this.fc = i, this.m = r, this.props = a;
    }
    function v(t) {
        var e, s, i = [], r = [], a = [], n = {}, h = 0;
        t.c && (i[0] = t.o[0], r[0] = t.i[0], a[0] = t.v[0], h = 1);
        var o = (s = t.i.length) - 1;
        for (e = h; e < s; e += 1) i.push(t.o[o]), r.push(t.i[o]), a.push(t.v[o]), o -= 1;
        return n.i = i, n.o = r, n.v = a, n;
    }
    function b() {}
    function w(t, e, s) {
        if (!e) {
            var i = Object.create(t.prototype, s), r = {};
            return i && "[object Function]" === r.toString.call(i.init) && i.init(), i;
        }
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.prototype._parent = t.prototype;
    }
    function k(t, e) {
        for (var s in t.prototype) t.prototype.hasOwnProperty(s) && (e.prototype[s] = t.prototype[s]);
    }
    function A() {
        this.c = !1, this._length = 0, this._maxLength = 8, this.v = Array.apply(null, {
            length: this._maxLength
        }), this.o = Array.apply(null, {
            length: this._maxLength
        }), this.i = Array.apply(null, {
            length: this._maxLength
        });
    }
    function P() {}
    function E() {}
    function S() {}
    function M() {}
    function x() {
        this._length = 0, this._maxLength = 4, this.shapes = Array.apply(null, {
            length: this._maxLength
        });
    }
    function F() {}
    function C(t, e) {
        this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.globalData = {
            frameNum: -1
        }, this.renderConfig = {
            preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet",
            progressiveLoad: e && e.progressiveLoad || !1,
            hideOnTransparent: !e || !1 !== e.hideOnTransparent
        }, this.globalData.renderConfig = this.renderConfig, this.elements = [], this.pendingElements = [], 
        this.destroyed = !1;
    }
    function D(t, e, s) {
        this.dynamicProperties = [], this.data = t, this.element = e, this.globalData = s, 
        this.paths = [], this.storedData = [], this.masksProperties = this.data.masksProperties, 
        this.viewData = new Array(this.masksProperties.length), this.maskElement = null, 
        this.firstFrame = !0;
        var i, r, a, n, h, o, p, l, m = this.globalData.defs, d = this.masksProperties.length, c = this.masksProperties, u = 0, g = [], y = f(10), v = "clipPath", b = "clip-path";
        for (i = 0; i < d; i++) if (("a" !== c[i].mode && "n" !== c[i].mode || c[i].inv || 100 !== c[i].o.k) && (v = "mask", 
        b = "mask"), "s" != c[i].mode && "i" != c[i].mode || 0 != u ? h = null : ((h = document.createElementNS(ct, "rect")).setAttribute("fill", "#ffffff"), 
        h.setAttribute("width", this.element.comp.data.w), h.setAttribute("height", this.element.comp.data.h), 
        g.push(h)), r = document.createElementNS(ct, "path"), "n" != c[i].mode) {
            if (u += 1, "s" == c[i].mode ? r.setAttribute("fill", "#000000") : r.setAttribute("fill", "#ffffff"), 
            r.setAttribute("clip-rule", "nonzero"), 0 !== c[i].x.k) {
                v = "mask", b = "mask", l = Dt.getProp(this.element, c[i].x, 0, null, this.dynamicProperties);
                var w = "fi_" + f(10);
                (o = document.createElementNS(ct, "filter")).setAttribute("id", w), (p = document.createElementNS(ct, "feMorphology")).setAttribute("operator", "dilate"), 
                p.setAttribute("in", "SourceGraphic"), p.setAttribute("radius", "0"), o.appendChild(p), 
                m.appendChild(o), "s" == c[i].mode ? r.setAttribute("stroke", "#000000") : r.setAttribute("stroke", "#ffffff");
            } else p = null, l = null;
            if (this.storedData[i] = {
                elem: r,
                x: l,
                expan: p,
                lastPath: "",
                lastOperator: "",
                filterId: w,
                lastRadius: 0
            }, "i" == c[i].mode) {
                n = g.length;
                var k = document.createElementNS(ct, "g");
                for (a = 0; a < n; a += 1) k.appendChild(g[a]);
                var A = document.createElementNS(ct, "mask");
                A.setAttribute("mask-type", "alpha"), A.setAttribute("id", y + "_" + u), A.appendChild(r), 
                m.appendChild(A), k.setAttribute("mask", "url(#" + y + "_" + u + ")"), g.length = 0, 
                g.push(k);
            } else g.push(r);
            c[i].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[i] = {
                elem: r,
                lastPath: "",
                op: Dt.getProp(this.element, c[i].o, 0, .01, this.dynamicProperties),
                prop: _t.getShapeProp(this.element, c[i], 3, this.dynamicProperties, null)
            }, h && (this.viewData[i].invRect = h), this.viewData[i].prop.k || this.drawPath(c[i], this.viewData[i].prop.v, this.viewData[i]);
        } else this.viewData[i] = {
            op: Dt.getProp(this.element, c[i].o, 0, .01, this.dynamicProperties),
            prop: _t.getShapeProp(this.element, c[i], 3, this.dynamicProperties, null),
            elem: r
        }, m.appendChild(r);
        for (this.maskElement = document.createElementNS(ct, v), d = g.length, i = 0; i < d; i += 1) this.maskElement.appendChild(g[i]);
        this.maskElement.setAttribute("id", y), u > 0 && this.element.maskedElement.setAttribute(b, "url(#" + y + ")"), 
        m.appendChild(this.maskElement);
    }
    function _() {}
    function T(t, e, s, i, r) {
        this.globalData = s, this.comp = i, this.data = t, this.matteElement = null, this.transformedElement = null, 
        this.isTransparent = !1, this.parentContainer = e, this.layerId = r ? r.layerId : "ly_" + f(10), 
        this.placeholder = r, this.init();
    }
    function I(t, e, s, i, r) {
        this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.itemsData = [], 
        this.prevViewData = [], this.shapeModifiers = [], this.processedElements = [], this._parent.constructor.call(this, t, e, s, i, r);
    }
    function L(t, e, s, i) {}
    function N(t, e, s, i, r) {
        this.textSpans = [], this.renderType = "svg", this._parent.constructor.call(this, t, e, s, i, r);
    }
    function V(t, e) {
        this.filterManager = e;
        var s = document.createElementNS(ct, "feColorMatrix");
        if (s.setAttribute("type", "matrix"), s.setAttribute("color-interpolation-filters", "linearRGB"), 
        s.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), 
        s.setAttribute("result", "f1"), t.appendChild(s), (s = document.createElementNS(ct, "feColorMatrix")).setAttribute("type", "matrix"), 
        s.setAttribute("color-interpolation-filters", "sRGB"), s.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), 
        s.setAttribute("result", "f2"), t.appendChild(s), this.matrixFilter = s, 100 !== e.effectElements[2].p.v || e.effectElements[2].p.k) {
            var i = document.createElementNS(ct, "feMerge");
            t.appendChild(i);
            var r;
            (r = document.createElementNS(ct, "feMergeNode")).setAttribute("in", "SourceGraphic"), 
            i.appendChild(r), (r = document.createElementNS(ct, "feMergeNode")).setAttribute("in", "f2"), 
            i.appendChild(r);
        }
    }
    function z(t, e) {
        this.filterManager = e;
        var s = document.createElementNS(ct, "feColorMatrix");
        s.setAttribute("type", "matrix"), s.setAttribute("color-interpolation-filters", "sRGB"), 
        s.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), t.appendChild(s), 
        this.matrixFilter = s;
    }
    function R(t, e) {
        this.initialized = !1, this.filterManager = e, this.elem = t, this.paths = [];
    }
    function O(t, e) {
        this.filterManager = e;
        var s = document.createElementNS(ct, "feColorMatrix");
        s.setAttribute("type", "matrix"), s.setAttribute("color-interpolation-filters", "linearRGB"), 
        s.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), 
        s.setAttribute("result", "f1"), t.appendChild(s);
        var i = document.createElementNS(ct, "feComponentTransfer");
        i.setAttribute("color-interpolation-filters", "sRGB"), t.appendChild(i), this.matrixFilter = i;
        var r = document.createElementNS(ct, "feFuncR");
        r.setAttribute("type", "table"), i.appendChild(r), this.feFuncR = r;
        var a = document.createElementNS(ct, "feFuncG");
        a.setAttribute("type", "table"), i.appendChild(a), this.feFuncG = a;
        var n = document.createElementNS(ct, "feFuncB");
        n.setAttribute("type", "table"), i.appendChild(n), this.feFuncB = n;
    }
    function j(t, e) {
        this.filterManager = e;
        var s = this.filterManager.effectElements, i = document.createElementNS(ct, "feComponentTransfer");
        (s[9].p.k || 0 !== s[9].p.v || s[10].p.k || 1 !== s[10].p.v || s[11].p.k || 1 !== s[11].p.v || s[12].p.k || 0 !== s[12].p.v || s[13].p.k || 1 !== s[13].p.v) && (this.feFuncR = this.createFeFunc("feFuncR", i)), 
        (s[16].p.k || 0 !== s[16].p.v || s[17].p.k || 1 !== s[17].p.v || s[18].p.k || 1 !== s[18].p.v || s[19].p.k || 0 !== s[19].p.v || s[20].p.k || 1 !== s[20].p.v) && (this.feFuncG = this.createFeFunc("feFuncG", i)), 
        (s[23].p.k || 0 !== s[23].p.v || s[24].p.k || 1 !== s[24].p.v || s[25].p.k || 1 !== s[25].p.v || s[26].p.k || 0 !== s[26].p.v || s[27].p.k || 1 !== s[27].p.v) && (this.feFuncB = this.createFeFunc("feFuncB", i)), 
        (s[30].p.k || 0 !== s[30].p.v || s[31].p.k || 1 !== s[31].p.v || s[32].p.k || 1 !== s[32].p.v || s[33].p.k || 0 !== s[33].p.v || s[34].p.k || 1 !== s[34].p.v) && (this.feFuncA = this.createFeFunc("feFuncA", i)), 
        (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) && (i.setAttribute("color-interpolation-filters", "sRGB"), 
        t.appendChild(i), i = document.createElementNS(ct, "feComponentTransfer")), (s[2].p.k || 0 !== s[2].p.v || s[3].p.k || 1 !== s[3].p.v || s[4].p.k || 1 !== s[4].p.v || s[5].p.k || 0 !== s[5].p.v || s[6].p.k || 1 !== s[6].p.v) && (i.setAttribute("color-interpolation-filters", "sRGB"), 
        t.appendChild(i), this.feFuncRComposed = this.createFeFunc("feFuncR", i), this.feFuncGComposed = this.createFeFunc("feFuncG", i), 
        this.feFuncBComposed = this.createFeFunc("feFuncB", i));
    }
    function B(t, e) {
        t.setAttribute("x", "-100%"), t.setAttribute("y", "-100%"), t.setAttribute("width", "400%"), 
        t.setAttribute("height", "400%"), this.filterManager = e;
        var s = document.createElementNS(ct, "feGaussianBlur");
        s.setAttribute("in", "SourceAlpha"), s.setAttribute("result", "drop_shadow_1"), 
        s.setAttribute("stdDeviation", "0"), this.feGaussianBlur = s, t.appendChild(s);
        var i = document.createElementNS(ct, "feOffset");
        i.setAttribute("dx", "25"), i.setAttribute("dy", "0"), i.setAttribute("in", "drop_shadow_1"), 
        i.setAttribute("result", "drop_shadow_2"), this.feOffset = i, t.appendChild(i);
        var r = document.createElementNS(ct, "feFlood");
        r.setAttribute("flood-color", "#00ff00"), r.setAttribute("flood-opacity", "1"), 
        r.setAttribute("result", "drop_shadow_3"), this.feFlood = r, t.appendChild(r);
        var a = document.createElementNS(ct, "feComposite");
        a.setAttribute("in", "drop_shadow_3"), a.setAttribute("in2", "drop_shadow_2"), a.setAttribute("operator", "in"), 
        a.setAttribute("result", "drop_shadow_4"), t.appendChild(a);
        var n = document.createElementNS(ct, "feMerge");
        t.appendChild(n);
        var h;
        h = document.createElementNS(ct, "feMergeNode"), n.appendChild(h), (h = document.createElementNS(ct, "feMergeNode")).setAttribute("in", "SourceGraphic"), 
        this.feMergeNode = h, this.feMerge = n, this.originalNodeAdded = !1, n.appendChild(h);
    }
    function G(t) {
        var e, s = t.data.ef.length, i = f(10), r = Nt.createFilter(i), a = 0;
        this.filters = [];
        var n;
        for (e = 0; e < s; e += 1) 20 === t.data.ef[e].ty ? (a += 1, n = new V(r, t.effects.effectElements[e]), 
        this.filters.push(n)) : 21 === t.data.ef[e].ty ? (a += 1, n = new z(r, t.effects.effectElements[e]), 
        this.filters.push(n)) : 22 === t.data.ef[e].ty ? (n = new R(t, t.effects.effectElements[e]), 
        this.filters.push(n)) : 23 === t.data.ef[e].ty ? (a += 1, n = new O(r, t.effects.effectElements[e]), 
        this.filters.push(n)) : 24 === t.data.ef[e].ty ? (a += 1, n = new j(r, t.effects.effectElements[e]), 
        this.filters.push(n)) : 25 === t.data.ef[e].ty && (a += 1, n = new B(r, t.effects.effectElements[e]), 
        this.filters.push(n));
        a && (t.globalData.defs.appendChild(r), t.layerElement.setAttribute("filter", "url(#" + i + ")"));
    }
    function W(t, e, s, i, r) {
        this._parent.constructor.call(this, t, e, s, i, r), this.layers = t.layers, this.supports3d = !0, 
        this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? Array.apply(null, {
            length: this.layers.length
        }) : [], this.data.tm && (this.tm = Dt.getProp(this, this.data.tm, 0, s.frameRate, this.dynamicProperties)), 
        this.data.xt ? (this.layerElement = document.createElementNS(ct, "g"), this.buildAllItems()) : s.progressiveLoad || this.buildAllItems();
    }
    function q(t, e, s, i, r) {
        this.assetData = s.getAssetData(t.refId), this._parent.constructor.call(this, t, e, s, i, r);
    }
    function H(t, e, s, i, r) {
        this._parent.constructor.call(this, t, e, s, i, r);
    }
    function X(t) {
        jt.play(t);
    }
    function Y(t) {
        jt.pause(t);
    }
    function $(t) {
        jt.togglePause(t);
    }
    function Q(t, e) {
        jt.setSpeed(t, e);
    }
    function Z(t, e) {
        jt.setDirection(t, e);
    }
    function U(t) {
        jt.stop(t);
    }
    function J(t) {
        jt.moveFrame(t);
    }
    function K() {
        !0 === Wt ? jt.searchAnimations(qt, Wt, Ht) : jt.searchAnimations();
    }
    function tt(t) {
        return jt.registerAnimation(t);
    }
    function et() {
        jt.resize();
    }
    function st() {
        jt.start();
    }
    function it(t, e, s) {
        jt.goToAndStop(t, e, s);
    }
    function rt(t) {
        ut = t;
    }
    function at(t) {
        return !0 === Wt && (t.animationData = JSON.parse(qt)), jt.loadAnimation(t);
    }
    function nt(t) {
        return jt.destroy(t);
    }
    function ht(e) {
        if ("string" == typeof e) switch (e) {
          case "high":
            At = 200;
            break;

          case "medium":
            At = 50;
            break;

          case "low":
            At = 10;
        } else !isNaN(e) && e > 1 && (At = e);
        t(At >= 50 ? !1 : !0);
    }
    function ot() {
        return "undefined" != typeof navigator;
    }
    function pt(t, e) {
        "expressions" === t && (mt = e);
    }
    function lt(t) {
        switch (t) {
          case "propertyFactory":
            return Dt;

          case "shapePropertyFactory":
            return _t;

          case "matrix":
            return b;
        }
    }
    function ft() {
        "complete" === document.readyState && (clearInterval($t), K());
    }
    var mt, dt, ct = "http://www.w3.org/2000/svg", ut = !1, gt = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), yt = (Math.round, 
    Math.pow), vt = Math.sqrt, bt = (Math.abs, Math.floor), wt = (Math.max, Math.min), kt = {};
    !function() {
        var t, e = Object.getOwnPropertyNames(Math), s = e.length;
        for (t = 0; t < s; t += 1) kt[e[t]] = Math[e[t]];
    }(), kt.random = Math.random, kt.abs = function(t) {
        if ("object" === typeof t && t.length) {
            var e, s = Array.apply(null, {
                length: t.length
            }), i = t.length;
            for (e = 0; e < i; e += 1) s[e] = Math.abs(t[e]);
            return s;
        }
        return Math.abs(t);
    };
    var At = 150, Pt = Math.PI / 180, Et = .5519;
    t(!1);
    var St = function() {
        var t, e, s = [];
        for (t = 0; t < 256; t += 1) e = t.toString(16), s[t] = 1 == e.length ? "0" + e : e;
        return function(t, e, i) {
            return t < 0 && (t = 0), e < 0 && (e = 0), i < 0 && (i = 0), "#" + s[t] + s[e] + s[i];
        };
    }(), b = (function() {
        var t = [];
    }(), function() {
        function t() {
            return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, 
            this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, 
            this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, 
            this.props[14] = 0, this.props[15] = 1, this;
        }
        function s(t) {
            if (0 === t) return this;
            var e = Math.cos(t), s = Math.sin(t);
            return this._t(e, -s, 0, 0, s, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function i(t) {
            if (0 === t) return this;
            var e = Math.cos(t), s = Math.sin(t);
            return this._t(1, 0, 0, 0, 0, e, -s, 0, 0, s, e, 0, 0, 0, 0, 1);
        }
        function r(t) {
            if (0 === t) return this;
            var e = Math.cos(t), s = Math.sin(t);
            return this._t(e, 0, s, 0, 0, 1, 0, 0, -s, 0, e, 0, 0, 0, 0, 1);
        }
        function a(t) {
            if (0 === t) return this;
            var e = Math.cos(t), s = Math.sin(t);
            return this._t(e, -s, 0, 0, s, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function n(t, e) {
            return this._t(1, e, t, 1, 0, 0);
        }
        function h(t, e) {
            return this.shear(Math.tan(t), Math.tan(e));
        }
        function o(t, e) {
            var s = Math.cos(e), i = Math.sin(e);
            return this._t(s, i, 0, 0, -i, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, Math.tan(t), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(s, -i, 0, 0, i, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function p(t, e, s) {
            return s = isNaN(s) ? 1 : s, 1 == t && 1 == e && 1 == s ? this : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, s, 0, 0, 0, 0, 1);
        }
        function l(t, e, s, i, r, a, n, h, o, p, l, f, m, d, c, u) {
            return this.props[0] = t, this.props[1] = e, this.props[2] = s, this.props[3] = i, 
            this.props[4] = r, this.props[5] = a, this.props[6] = n, this.props[7] = h, this.props[8] = o, 
            this.props[9] = p, this.props[10] = l, this.props[11] = f, this.props[12] = m, this.props[13] = d, 
            this.props[14] = c, this.props[15] = u, this;
        }
        function f(t, e, s) {
            return s = s || 0, 0 !== t || 0 !== e || 0 !== s ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, s, 1) : this;
        }
        function m(t, e, s, i, r, a, n, h, o, p, l, f, m, d, c, u) {
            if (1 === t && 0 === e && 0 === s && 0 === i && 0 === r && 1 === a && 0 === n && 0 === h && 0 === o && 0 === p && 1 === l && 0 === f) return 0 === m && 0 === d && 0 === c || (this.props[12] = this.props[12] * t + this.props[13] * r + this.props[14] * o + this.props[15] * m, 
            this.props[13] = this.props[12] * e + this.props[13] * a + this.props[14] * p + this.props[15] * d, 
            this.props[14] = this.props[12] * s + this.props[13] * n + this.props[14] * l + this.props[15] * c, 
            this.props[15] = this.props[12] * i + this.props[13] * h + this.props[14] * f + this.props[15] * u), 
            this._identityCalculated = !1, this;
            var g = this.props[0], y = this.props[1], v = this.props[2], b = this.props[3], w = this.props[4], k = this.props[5], A = this.props[6], P = this.props[7], E = this.props[8], S = this.props[9], M = this.props[10], x = this.props[11], F = this.props[12], C = this.props[13], D = this.props[14], _ = this.props[15];
            return this.props[0] = g * t + y * r + v * o + b * m, this.props[1] = g * e + y * a + v * p + b * d, 
            this.props[2] = g * s + y * n + v * l + b * c, this.props[3] = g * i + y * h + v * f + b * u, 
            this.props[4] = w * t + k * r + A * o + P * m, this.props[5] = w * e + k * a + A * p + P * d, 
            this.props[6] = w * s + k * n + A * l + P * c, this.props[7] = w * i + k * h + A * f + P * u, 
            this.props[8] = E * t + S * r + M * o + x * m, this.props[9] = E * e + S * a + M * p + x * d, 
            this.props[10] = E * s + S * n + M * l + x * c, this.props[11] = E * i + S * h + M * f + x * u, 
            this.props[12] = F * t + C * r + D * o + _ * m, this.props[13] = F * e + C * a + D * p + _ * d, 
            this.props[14] = F * s + C * n + D * l + _ * c, this.props[15] = F * i + C * h + D * f + _ * u, 
            this._identityCalculated = !1, this;
        }
        function d() {
            return this._identityCalculated || (this._identity = !(1 !== this.props[0] || 0 !== this.props[1] || 0 !== this.props[2] || 0 !== this.props[3] || 0 !== this.props[4] || 1 !== this.props[5] || 0 !== this.props[6] || 0 !== this.props[7] || 0 !== this.props[8] || 0 !== this.props[9] || 1 !== this.props[10] || 0 !== this.props[11] || 0 !== this.props[12] || 0 !== this.props[13] || 0 !== this.props[14] || 1 !== this.props[15]), 
            this._identityCalculated = !0), this._identity;
        }
        function c(t) {
            var e;
            for (e = 0; e < 16; e += 1) t.props[e] = this.props[e];
        }
        function u(t) {
            var e;
            for (e = 0; e < 16; e += 1) this.props[e] = t[e];
        }
        function g(t, e, s) {
            return {
                x: t * this.props[0] + e * this.props[4] + s * this.props[8] + this.props[12],
                y: t * this.props[1] + e * this.props[5] + s * this.props[9] + this.props[13],
                z: t * this.props[2] + e * this.props[6] + s * this.props[10] + this.props[14]
            };
        }
        function y(t, e, s) {
            return t * this.props[0] + e * this.props[4] + s * this.props[8] + this.props[12];
        }
        function v(t, e, s) {
            return t * this.props[1] + e * this.props[5] + s * this.props[9] + this.props[13];
        }
        function b(t, e, s) {
            return t * this.props[2] + e * this.props[6] + s * this.props[10] + this.props[14];
        }
        function w(t) {
            var e = this.props[0] * this.props[5] - this.props[1] * this.props[4], s = this.props[5] / e, i = -this.props[1] / e, r = -this.props[4] / e, a = this.props[0] / e, n = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / e, h = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / e;
            return [ t[0] * s + t[1] * r + n, t[0] * i + t[1] * a + h, 0 ];
        }
        function k(t) {
            var e, s = t.length, i = [];
            for (e = 0; e < s; e += 1) i[e] = w(t[e]);
            return i;
        }
        function A(t, e, s, i) {
            if (i && 2 === i) {
                var r = zt.newPoint();
                return r[0] = t * this.props[0] + e * this.props[4] + s * this.props[8] + this.props[12], 
                r[1] = t * this.props[1] + e * this.props[5] + s * this.props[9] + this.props[13], 
                r;
            }
            return [ t * this.props[0] + e * this.props[4] + s * this.props[8] + this.props[12], t * this.props[1] + e * this.props[5] + s * this.props[9] + this.props[13], t * this.props[2] + e * this.props[6] + s * this.props[10] + this.props[14] ];
        }
        function P(t, e) {
            return this.isIdentity() ? t + "," + e : dt(t * this.props[0] + e * this.props[4] + this.props[12]) + "," + dt(t * this.props[1] + e * this.props[5] + this.props[13]);
        }
        function E() {
            return [ this.props[0], this.props[1], this.props[2], this.props[3], this.props[4], this.props[5], this.props[6], this.props[7], this.props[8], this.props[9], this.props[10], this.props[11], this.props[12], this.props[13], this.props[14], this.props[15] ];
        }
        function S() {
            return gt ? "matrix3d(" + e(this.props[0]) + "," + e(this.props[1]) + "," + e(this.props[2]) + "," + e(this.props[3]) + "," + e(this.props[4]) + "," + e(this.props[5]) + "," + e(this.props[6]) + "," + e(this.props[7]) + "," + e(this.props[8]) + "," + e(this.props[9]) + "," + e(this.props[10]) + "," + e(this.props[11]) + "," + e(this.props[12]) + "," + e(this.props[13]) + "," + e(this.props[14]) + "," + e(this.props[15]) + ")" : (this.cssParts[1] = this.props.join(","), 
            this.cssParts.join(""));
        }
        function M() {
            return "matrix(" + this.props[0] + "," + this.props[1] + "," + this.props[4] + "," + this.props[5] + "," + this.props[12] + "," + this.props[13] + ")";
        }
        function x() {
            return "" + this.toArray();
        }
        return function() {
            this.reset = t, this.rotate = s, this.rotateX = i, this.rotateY = r, this.rotateZ = a, 
            this.skew = h, this.skewFromAxis = o, this.shear = n, this.scale = p, this.setTransform = l, 
            this.translate = f, this.transform = m, this.applyToPoint = g, this.applyToX = y, 
            this.applyToY = v, this.applyToZ = b, this.applyToPointArray = A, this.applyToPointStringified = P, 
            this.toArray = E, this.toCSS = S, this.to2dCSS = M, this.toString = x, this.clone = c, 
            this.cloneFromProps = u, this.inversePoints = k, this.inversePoint = w, this._t = this.transform, 
            this.isIdentity = d, this._identity = !0, this._identityCalculated = !1, this.props = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ], 
            this.cssParts = [ "matrix3d(", "", ")" ];
        };
    }());
    !function(t, e) {
        function s(s, p, l) {
            var y = [], v = n(a((p = 1 == p ? {
                entropy: !0
            } : p || {}).entropy ? [ s, o(t) ] : null == s ? h() : s, 3), y), b = new i(y), w = function() {
                for (var t = b.g(m), e = c, s = 0; t < u; ) t = (t + s) * f, e *= f, s = b.g(1);
                for (;t >= g; ) t /= 2, e /= 2, s >>>= 1;
                return (t + s) / e;
            };
            return w.int32 = function() {
                return 0 | b.g(4);
            }, w.quick = function() {
                return b.g(4) / 4294967296;
            }, w.double = w, n(o(b.S), t), (p.pass || l || function(t, s, i, a) {
                return a && (a.S && r(a, b), t.state = function() {
                    return r(b, {});
                }), i ? (e[d] = t, s) : t;
            })(w, v, "global" in p ? p.global : this == e, p.state);
        }
        function i(t) {
            var e, s = t.length, i = this, r = 0, a = i.i = i.j = 0, n = i.S = [];
            for (s || (t = [ s++ ]); r < f; ) n[r] = r++;
            for (r = 0; r < f; r++) n[r] = n[a = y & a + t[r % s] + (e = n[r])], n[a] = e;
            (i.g = function(t) {
                for (var e, s = 0, r = i.i, a = i.j, n = i.S; t--; ) e = n[r = y & r + 1], s = s * f + n[y & (n[r] = n[a = y & a + e]) + (n[a] = e)];
                return i.i = r, i.j = a, s;
            })(f);
        }
        function r(t, e) {
            return e.i = t.i, e.j = t.j, e.S = t.S.slice(), e;
        }
        function a(t, e) {
            var s, i = [], r = typeof t;
            if (e && "object" == r) for (s in t) try {
                i.push(a(t[s], e - 1));
            } catch (t) {}
            return i.length ? i : "string" == r ? t : t + "\0";
        }
        function n(t, e) {
            for (var s, i = t + "", r = 0; r < i.length; ) e[y & r] = y & (s ^= 19 * e[y & r]) + i.charCodeAt(r++);
            return o(e);
        }
        function h() {
            try {
                if (p) return o(p.randomBytes(f));
                var e = new Uint8Array(f);
                return (l.crypto || l.msCrypto).getRandomValues(e), o(e);
            } catch (e) {
                var s = l.navigator, i = s && s.plugins;
                return [ +new Date(), l, i, l.screen, o(t) ];
            }
        }
        function o(t) {
            return String.fromCharCode.apply(0, t);
        }
        var p, l = this, f = 256, m = 6, d = "random", c = e.pow(f, m), u = e.pow(2, 52), g = 2 * u, y = f - 1;
        e["seed" + d] = s, n(e.random(), t);
    }([], kt);
    var Mt = function() {
        function t(t, e, s, i, r) {
            var a = r || ("bez_" + t + "_" + e + "_" + s + "_" + i).replace(/\./g, "p");
            if (l[a]) return l[a];
            var n = new o([ t, e, s, i ]);
            return l[a] = n, n;
        }
        function e(t, e) {
            return 1 - 3 * e + 3 * t;
        }
        function s(t, e) {
            return 3 * e - 6 * t;
        }
        function i(t) {
            return 3 * t;
        }
        function r(t, r, a) {
            return ((e(r, a) * t + s(r, a)) * t + i(r)) * t;
        }
        function a(t, r, a) {
            return 3 * e(r, a) * t * t + 2 * s(r, a) * t + i(r);
        }
        function n(t, e, s, i, a) {
            var n, h, o = 0;
            do {
                (n = r(h = e + (s - e) / 2, i, a) - t) > 0 ? s = h : e = h;
            } while (Math.abs(n) > m && ++o < d);
            return h;
        }
        function h(t, e, s, i) {
            for (var n = 0; n < f; ++n) {
                var h = a(e, s, i);
                if (0 === h) return e;
                e -= (r(e, s, i) - t) / h;
            }
            return e;
        }
        function o(t) {
            this._p = t, this._mSampleValues = g ? new Float32Array(c) : new Array(c), this._precomputed = !1, 
            this.get = this.get.bind(this);
        }
        var p = {};
        p.getBezierEasing = t;
        var l = {}, f = 4, m = 1e-7, d = 10, c = 11, u = 1 / (c - 1), g = "function" == typeof Float32Array;
        return o.prototype = {
            get: function(t) {
                var e = this._p[0], s = this._p[1], i = this._p[2], a = this._p[3];
                return this._precomputed || this._precompute(), e === s && i === a ? t : 0 === t ? 0 : 1 === t ? 1 : r(this._getTForX(t), s, a);
            },
            _precompute: function() {
                var t = this._p[0], e = this._p[1], s = this._p[2], i = this._p[3];
                this._precomputed = !0, t === e && s === i || this._calcSampleValues();
            },
            _calcSampleValues: function() {
                for (var t = this._p[0], e = this._p[2], s = 0; s < c; ++s) this._mSampleValues[s] = r(s * u, t, e);
            },
            _getTForX: function(t) {
                for (var e = this._p[0], s = this._p[2], i = this._mSampleValues, r = 0, o = 1, p = c - 1; o !== p && i[o] <= t; ++o) r += u;
                var l = r + (t - i[--o]) / (i[o + 1] - i[o]) * u, f = a(l, e, s);
                return f >= .001 ? h(t, l, e, s) : 0 === f ? l : n(t, r, r + u, e, s);
            }
        }, p;
    }();
    !function() {
        for (var t = 0, e = [ "ms", "moz", "webkit", "o" ], s = 0; s < e.length && !window.requestAnimationFrame; ++s) window.requestAnimationFrame = window[e[s] + "RequestAnimationFrame"], 
        window.cancelAnimationFrame = window[e[s] + "CancelAnimationFrame"] || window[e[s] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(e, s) {
            var i = new Date().getTime(), r = Math.max(0, 16 - (i - t)), a = window.setTimeout(function() {
                e(i + r);
            }, r);
            return t = i + r, a;
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
            clearTimeout(t);
        });
    }();
    var xt = function() {
        function t(t, e, s, i, r, a) {
            var n = t * i + e * r + s * a - r * i - a * t - s * e;
            return n > -1e-4 && n < 1e-4;
        }
        function e(e, s, i, r, a, n, h, o, p) {
            if (0 === i && 0 === n && 0 === p) return t(e, s, r, a, h, o);
            var l, f = Math.sqrt(Math.pow(r - e, 2) + Math.pow(a - s, 2) + Math.pow(n - i, 2)), m = Math.sqrt(Math.pow(h - e, 2) + Math.pow(o - s, 2) + Math.pow(p - i, 2)), d = Math.sqrt(Math.pow(h - r, 2) + Math.pow(o - a, 2) + Math.pow(p - n, 2));
            return (l = f > m ? f > d ? f - m - d : d - m - f : d > m ? d - m - f : m - f - d) > -1e-4 && l < 1e-4;
        }
        function s(t) {
            this.segmentLength = 0, this.points = new Array(t);
        }
        function i(t, e) {
            this.partialLength = t, this.point = e;
        }
        function r(t, e) {
            var s = e.segments, i = s.length, r = bt((i - 1) * t), a = t * e.addedLength, n = 0;
            if (a == s[r].l) return s[r].p;
            for (var h = s[r].l > a ? -1 : 1, o = !0; o; ) s[r].l <= a && s[r + 1].l > a ? (n = (a - s[r].l) / (s[r + 1].l - s[r].l), 
            o = !1) : r += h, (r < 0 || r >= i - 1) && (o = !1);
            return s[r].p + (s[r + 1].p - s[r].p) * n;
        }
        function a() {
            this.pt1 = new Array(2), this.pt2 = new Array(2), this.pt3 = new Array(2), this.pt4 = new Array(2);
        }
        function n(t, e, s, i, n, h, o) {
            var p, l = new a(), f = r(n = n < 0 ? 0 : n > 1 ? 1 : n, o), m = r(h = h > 1 ? 1 : h, o), d = t.length, c = 1 - f, u = 1 - m;
            for (p = 0; p < d; p += 1) l.pt1[p] = Math.round(1e3 * (c * c * c * t[p] + (f * c * c + c * f * c + c * c * f) * s[p] + (f * f * c + c * f * f + f * c * f) * i[p] + f * f * f * e[p])) / 1e3, 
            l.pt3[p] = Math.round(1e3 * (c * c * u * t[p] + (f * c * u + c * f * u + c * c * m) * s[p] + (f * f * u + c * f * m + f * c * m) * i[p] + f * f * m * e[p])) / 1e3, 
            l.pt4[p] = Math.round(1e3 * (c * u * u * t[p] + (f * u * u + c * m * u + c * u * m) * s[p] + (f * m * u + c * m * m + f * u * m) * i[p] + f * m * m * e[p])) / 1e3, 
            l.pt2[p] = Math.round(1e3 * (u * u * u * t[p] + (m * u * u + u * m * u + u * u * m) * s[p] + (m * m * u + u * m * m + m * u * m) * i[p] + m * m * m * e[p])) / 1e3;
            return l;
        }
        Math;
        return {
            getBezierLength: function() {
                function t(t, e) {
                    this.l = t, this.p = e;
                }
                return function(e, s, i, r) {
                    var a, n, h, o, p, l, f = At, m = 0, d = [], c = [], u = {
                        addedLength: 0,
                        segments: []
                    };
                    for (h = i.length, a = 0; a < f; a += 1) {
                        for (p = a / (f - 1), l = 0, n = 0; n < h; n += 1) o = yt(1 - p, 3) * e[n] + 3 * yt(1 - p, 2) * p * i[n] + 3 * (1 - p) * yt(p, 2) * r[n] + yt(p, 3) * s[n], 
                        d[n] = o, null !== c[n] && (l += yt(d[n] - c[n], 2)), c[n] = d[n];
                        l && (m += l = vt(l)), u.segments.push(new t(m, p));
                    }
                    return u.addedLength = m, u;
                };
            }(),
            getNewSegment: n,
            buildBezierData: function() {
                var e = {};
                return function(r) {
                    var a = r.s, n = r.e, h = r.to, o = r.ti, p = (a.join("_") + "_" + n.join("_") + "_" + h.join("_") + "_" + o.join("_")).replace(/\./g, "p");
                    if (e[p]) r.bezierData = e[p]; else {
                        var l, f, m, d, c, u, g, y = At, v = 0, b = null;
                        2 === a.length && (a[0] != n[0] || a[1] != n[1]) && t(a[0], a[1], n[0], n[1], a[0] + h[0], a[1] + h[1]) && t(a[0], a[1], n[0], n[1], n[0] + o[0], n[1] + o[1]) && (y = 2);
                        var w = new s(y);
                        for (m = h.length, l = 0; l < y; l += 1) {
                            for (g = new Array(m), c = l / (y - 1), u = 0, f = 0; f < m; f += 1) d = yt(1 - c, 3) * a[f] + 3 * yt(1 - c, 2) * c * (a[f] + h[f]) + 3 * (1 - c) * yt(c, 2) * (n[f] + o[f]) + yt(c, 3) * n[f], 
                            g[f] = d, null !== b && (u += yt(g[f] - b[f], 2));
                            v += u = vt(u), w.points[l] = new i(u, g), b = g;
                        }
                        w.segmentLength = v, r.bezierData = w, e[p] = w;
                    }
                };
            }(),
            pointOnLine2D: t,
            pointOnLine3D: e
        };
    }(), Ft = function() {
        function t(r, a, h) {
            var o, p, l, f, m, d, c = r.length;
            for (p = 0; p < c; p += 1) if ("ks" in (o = r[p]) && !o.completed) {
                if (o.completed = !0, o.tt && (r[p - 1].td = o.tt), [], -1, o.hasMask) {
                    var u = o.masksProperties;
                    for (f = u.length, l = 0; l < f; l += 1) if (u[l].pt.k.i) i(u[l].pt.k); else for (d = u[l].pt.k.length, 
                    m = 0; m < d; m += 1) u[l].pt.k[m].s && i(u[l].pt.k[m].s[0]), u[l].pt.k[m].e && i(u[l].pt.k[m].e[0]);
                }
                0 === o.ty ? (o.layers = e(o.refId, a), t(o.layers, a, h)) : 4 === o.ty ? s(o.shapes) : 5 == o.ty && n(o, h);
            }
        }
        function e(t, e) {
            for (var s = 0, i = e.length; s < i; ) {
                if (e[s].id === t) return e[s].layers.__used ? JSON.parse(JSON.stringify(e[s].layers)) : (e[s].layers.__used = !0, 
                e[s].layers);
                s += 1;
            }
        }
        function s(t) {
            var e, r, a;
            for (e = t.length - 1; e >= 0; e -= 1) if ("sh" == t[e].ty) {
                if (t[e].ks.k.i) i(t[e].ks.k); else for (a = t[e].ks.k.length, r = 0; r < a; r += 1) t[e].ks.k[r].s && i(t[e].ks.k[r].s[0]), 
                t[e].ks.k[r].e && i(t[e].ks.k[r].e[0]);
                !0;
            } else "gr" == t[e].ty && s(t[e].it);
        }
        function i(t) {
            var e, s = t.i.length;
            for (e = 0; e < s; e += 1) t.i[e][0] += t.v[e][0], t.i[e][1] += t.v[e][1], t.o[e][0] += t.v[e][0], 
            t.o[e][1] += t.v[e][1];
        }
        function r(t, e) {
            var s = e ? e.split(".") : [ 100, 100, 100 ];
            return t[0] > s[0] || !(s[0] > t[0]) && (t[1] > s[1] || !(s[1] > t[1]) && (t[2] > s[2] || !(s[2] > t[2]) && void 0));
        }
        function a(e, s) {
            e.__complete || (p(e), h(e), o(e), l(e), t(e.layers, e.assets, s), e.__complete = !0);
        }
        function n(t, e) {
            var s, i, r = t.t.d.k.length;
            for (i = 0; i < r; i += 1) {
                var a = t.t.d.k[i].s;
                s = [];
                var n, h, o, p, l, f, m, d = 0, c = t.t.m.g, u = 0, g = 0, y = 0, v = [], b = 0, w = 0, k = e.getFontByName(a.f), A = 0, P = k.fStyle.split(" "), E = "normal", S = "normal";
                for (h = P.length, n = 0; n < h; n += 1) "italic" === P[n].toLowerCase() ? S = "italic" : "bold" === P[n].toLowerCase() ? E = "700" : "black" === P[n].toLowerCase() ? E = "900" : "medium" === P[n].toLowerCase() ? E = "500" : "regular" === P[n].toLowerCase() || "normal" === P[n].toLowerCase() ? E = "400" : "light" !== P[n].toLowerCase() && "thin" !== P[n].toLowerCase() || (E = "200");
                if (a.fWeight = E, a.fStyle = S, h = a.t.length, a.sz) {
                    var M = a.sz[0], x = -1;
                    for (n = 0; n < h; n += 1) o = !1, " " === a.t.charAt(n) ? x = n : 13 === a.t.charCodeAt(n) && (b = 0, 
                    o = !0), e.chars ? (m = e.getCharData(a.t.charAt(n), k.fStyle, k.fFamily), A = o ? 0 : m.w * a.s / 100) : A = e.measureText(a.t.charAt(n), a.f, a.s), 
                    b + A > M ? (-1 === x ? (a.t = a.t.substr(0, n) + "\r" + a.t.substr(n), h += 1) : (n = x, 
                    a.t = a.t.substr(0, n) + "\r" + a.t.substr(n + 1)), x = -1, b = 0) : b += A;
                    h = a.t.length;
                }
                for (b = 0, A = 0, n = 0; n < h; n += 1) if (o = !1, " " === a.t.charAt(n) ? p = " " : 13 === a.t.charCodeAt(n) ? (v.push(b), 
                w = b > w ? b : w, b = 0, p = "", o = !0, y += 1) : p = a.t.charAt(n), e.chars ? (m = e.getCharData(a.t.charAt(n), k.fStyle, e.getFontByName(a.f).fFamily), 
                A = o ? 0 : m.w * a.s / 100) : A = e.measureText(p, a.f, a.s), b += A, s.push({
                    l: A,
                    an: A,
                    add: u,
                    n: o,
                    anIndexes: [],
                    val: p,
                    line: y
                }), 2 == c) {
                    if (u += A, "" == p || " " == p || n == h - 1) {
                        for ("" != p && " " != p || (u -= A); g <= n; ) s[g].an = u, s[g].ind = d, s[g].extra = A, 
                        g += 1;
                        d += 1, u = 0;
                    }
                } else if (3 == c) {
                    if (u += A, "" == p || n == h - 1) {
                        for ("" == p && (u -= A); g <= n; ) s[g].an = u, s[g].ind = d, s[g].extra = A, g += 1;
                        u = 0, d += 1;
                    }
                } else s[d].ind = d, s[d].extra = 0, d += 1;
                if (a.l = s, w = b > w ? b : w, v.push(b), a.sz) a.boxWidth = a.sz[0], a.justifyOffset = 0; else switch (a.boxWidth = w, 
                a.j) {
                  case 1:
                    a.justifyOffset = -a.boxWidth;
                    break;

                  case 2:
                    a.justifyOffset = -a.boxWidth / 2;
                    break;

                  default:
                    a.justifyOffset = 0;
                }
                a.lineWidths = v;
                var F = t.t.a;
                f = F.length;
                var C, D, _ = [];
                for (l = 0; l < f; l += 1) {
                    for (F[l].a.sc && (a.strokeColorAnim = !0), F[l].a.sw && (a.strokeWidthAnim = !0), 
                    (F[l].a.fc || F[l].a.fh || F[l].a.fs || F[l].a.fb) && (a.fillColorAnim = !0), D = 0, 
                    C = F[l].s.b, n = 0; n < h; n += 1) s[n].anIndexes[l] = D, (1 == C && "" != s[n].val || 2 == C && "" != s[n].val && " " != s[n].val || 3 == C && (s[n].n || " " == s[n].val || n == h - 1) || 4 == C && (s[n].n || n == h - 1)) && (1 === F[l].s.rn && _.push(D), 
                    D += 1);
                    t.t.a[l].s.totalChars = D;
                    var T, I = -1;
                    if (1 === F[l].s.rn) for (n = 0; n < h; n += 1) I != s[n].anIndexes[l] && (I = s[n].anIndexes[l], 
                    T = _.splice(Math.floor(Math.random() * _.length), 1)[0]), s[n].anIndexes[l] = T;
                }
                0 !== f || "m" in t.t.p || (t.singleShape = !0), a.yOffset = a.lh || 1.2 * a.s, 
                a.ls = a.ls || 0, a.ascent = k.ascent * a.s / 100;
            }
        }
        var h = function() {
            function t(t) {
                var e = t.t.d;
                t.t.d = {
                    k: [ {
                        s: e,
                        t: 0
                    } ]
                };
            }
            function e(e) {
                var s, i = e.length;
                for (s = 0; s < i; s += 1) 5 === e[s].ty && t(e[s]);
            }
            var s = [ 4, 4, 14 ];
            return function(t) {
                if (r(s, t.v) && (e(t.layers), t.assets)) {
                    var i, a = t.assets.length;
                    for (i = 0; i < a; i += 1) t.assets[i].layers && e(t.assets[i].layers);
                }
            };
        }(), o = function() {
            var t = [ 4, 7, 99 ];
            return function(e) {
                if (e.chars && !r(t, e.v)) {
                    var s, a, n, h, o = e.chars.length;
                    for (s = 0; s < o; s += 1) if (e.chars[s].data && e.chars[s].data.shapes) for (n = (h = e.chars[s].data.shapes[0].it).length, 
                    a = 0; a < n; a += 1) h[a].ks.k, i(h[a].ks.k);
                }
            };
        }(), p = function() {
            function t(e) {
                var s, i, r, a = e.length;
                for (s = 0; s < a; s += 1) if ("gr" === e[s].ty) t(e[s].it); else if ("fl" === e[s].ty || "st" === e[s].ty) if (e[s].c.k && e[s].c.k[0].i) for (r = e[s].c.k.length, 
                i = 0; i < r; i += 1) e[s].c.k[i].s && (e[s].c.k[i].s[0] /= 255, e[s].c.k[i].s[1] /= 255, 
                e[s].c.k[i].s[2] /= 255, e[s].c.k[i].s[3] /= 255), e[s].c.k[i].e && (e[s].c.k[i].e[0] /= 255, 
                e[s].c.k[i].e[1] /= 255, e[s].c.k[i].e[2] /= 255, e[s].c.k[i].e[3] /= 255); else e[s].c.k[0] /= 255, 
                e[s].c.k[1] /= 255, e[s].c.k[2] /= 255, e[s].c.k[3] /= 255;
            }
            function e(e) {
                var s, i = e.length;
                for (s = 0; s < i; s += 1) 4 === e[s].ty && t(e[s].shapes);
            }
            var s = [ 4, 1, 9 ];
            return function(t) {
                if (r(s, t.v) && (e(t.layers), t.assets)) {
                    var i, a = t.assets.length;
                    for (i = 0; i < a; i += 1) t.assets[i].layers && e(t.assets[i].layers);
                }
            };
        }(), l = function() {
            function t(e) {
                var s, i, r;
                for (s = e.length - 1; s >= 0; s -= 1) if ("sh" == e[s].ty) {
                    if (e[s].ks.k.i) e[s].ks.k.c = e[s].closed; else for (r = e[s].ks.k.length, i = 0; i < r; i += 1) e[s].ks.k[i].s && (e[s].ks.k[i].s[0].c = e[s].closed), 
                    e[s].ks.k[i].e && (e[s].ks.k[i].e[0].c = e[s].closed);
                    !0;
                } else "gr" == e[s].ty && t(e[s].it);
            }
            function e(e) {
                var s, i, r, a, n, h, o = e.length;
                for (i = 0; i < o; i += 1) {
                    if ((s = e[i]).hasMask) {
                        var p = s.masksProperties;
                        for (a = p.length, r = 0; r < a; r += 1) if (p[r].pt.k.i) p[r].pt.k.c = p[r].cl; else for (h = p[r].pt.k.length, 
                        n = 0; n < h; n += 1) p[r].pt.k[n].s && (p[r].pt.k[n].s[0].c = p[r].cl), p[r].pt.k[n].e && (p[r].pt.k[n].e[0].c = p[r].cl);
                    }
                    4 === s.ty && t(s.shapes);
                }
            }
            var s = [ 4, 4, 18 ];
            return function(t) {
                if (r(s, t.v) && (e(t.layers), t.assets)) {
                    var i, a = t.assets.length;
                    for (i = 0; i < a; i += 1) t.assets[i].layers && e(t.assets[i].layers);
                }
            };
        }(), f = {};
        return f.completeData = a, f;
    }(), Ct = function() {
        function t(t, e) {
            var s = document.createElement("span");
            s.style.fontFamily = e;
            var i = document.createElement("span");
            i.innerHTML = "giItT1WQy@!-/#", s.style.position = "absolute", s.style.left = "-10000px", 
            s.style.top = "-10000px", s.style.fontSize = "300px", s.style.fontVariant = "normal", 
            s.style.fontStyle = "normal", s.style.fontWeight = "normal", s.style.letterSpacing = "0", 
            s.appendChild(i), document.body.appendChild(s);
            var r = i.offsetWidth;
            return i.style.fontFamily = t + ", " + e, {
                node: i,
                w: r,
                parent: s
            };
        }
        function e() {
            var t, s, i, r = this.fonts.length, a = r;
            for (t = 0; t < r; t += 1) if (this.fonts[t].loaded) a -= 1; else if ("t" === this.fonts[t].fOrigin || 2 === this.fonts[t].origin) {
                if (window.Typekit && window.Typekit.load && 0 === this.typekitLoaded) {
                    this.typekitLoaded = 1;
                    try {
                        window.Typekit.load({
                            async: !0,
                            active: function() {
                                this.typekitLoaded = 2;
                            }.bind(this)
                        });
                    } catch (t) {}
                }
                2 === this.typekitLoaded && (this.fonts[t].loaded = !0);
            } else "n" === this.fonts[t].fOrigin || 0 === this.fonts[t].origin ? this.fonts[t].loaded = !0 : (s = this.fonts[t].monoCase.node, 
            i = this.fonts[t].monoCase.w, s.offsetWidth !== i ? (a -= 1, this.fonts[t].loaded = !0) : (s = this.fonts[t].sansCase.node, 
            i = this.fonts[t].sansCase.w, s.offsetWidth !== i && (a -= 1, this.fonts[t].loaded = !0)), 
            this.fonts[t].loaded && (this.fonts[t].sansCase.parent.parentNode.removeChild(this.fonts[t].sansCase.parent), 
            this.fonts[t].monoCase.parent.parentNode.removeChild(this.fonts[t].monoCase.parent)));
            0 !== a && Date.now() - this.initTime < o ? setTimeout(e.bind(this), 20) : setTimeout(function() {
                this.loaded = !0;
            }.bind(this), 0);
        }
        function s(t, e) {
            var s = document.createElementNS(ct, "text");
            s.style.fontSize = "100px", s.style.fontFamily = e.fFamily, s.textContent = "1", 
            e.fClass ? (s.style.fontFamily = "inherit", s.className = e.fClass) : s.style.fontFamily = e.fFamily, 
            t.appendChild(s);
            var i = document.createElement("canvas").getContext("2d");
            return i.font = "100px " + e.fFamily, i;
        }
        function i(i, r) {
            if (i) {
                if (this.chars) return this.loaded = !0, void (this.fonts = i.list);
                var a, n = i.list, h = n.length;
                for (a = 0; a < h; a += 1) {
                    if (n[a].loaded = !1, n[a].monoCase = t(n[a].fFamily, "monospace"), n[a].sansCase = t(n[a].fFamily, "sans-serif"), 
                    n[a].fPath) {
                        if ("p" === n[a].fOrigin || 3 === n[a].origin) {
                            var o = document.createElement("style");
                            o.type = "text/css", o.innerHTML = "@font-face {font-family: " + n[a].fFamily + "; font-style: normal; src: url('" + n[a].fPath + "');}", 
                            r.appendChild(o);
                        } else if ("g" === n[a].fOrigin || 1 === n[a].origin) {
                            var p = document.createElement("link");
                            p.type = "text/css", p.rel = "stylesheet", p.href = n[a].fPath, r.appendChild(p);
                        } else if ("t" === n[a].fOrigin || 2 === n[a].origin) {
                            var l = document.createElement("script");
                            l.setAttribute("src", n[a].fPath), r.appendChild(l);
                        }
                    } else n[a].loaded = !0;
                    n[a].helper = s(r, n[a]), this.fonts.push(n[a]);
                }
                e.bind(this)();
            } else this.loaded = !0;
        }
        function r(t) {
            if (t) {
                this.chars || (this.chars = []);
                var e, s, i, r = t.length, a = this.chars.length;
                for (e = 0; e < r; e += 1) {
                    for (s = 0, i = !1; s < a; ) this.chars[s].style === t[e].style && this.chars[s].fFamily === t[e].fFamily && this.chars[s].ch === t[e].ch && (i = !0), 
                    s += 1;
                    i || (this.chars.push(t[e]), a += 1);
                }
            }
        }
        function a(t, e, s) {
            for (var i = 0, r = this.chars.length; i < r; ) {
                if (this.chars[i].ch === t && this.chars[i].style === e && this.chars[i].fFamily === s) return this.chars[i];
                i += 1;
            }
        }
        function n(t, e, s) {
            return this.getFontByName(e).helper.measureText(t).width * s / 100;
        }
        function h(t) {
            for (var e = 0, s = this.fonts.length; e < s; ) {
                if (this.fonts[e].fName === t) return this.fonts[e];
                e += 1;
            }
            return "sans-serif";
        }
        var o = 5e3, p = function() {
            this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.loaded = !1, this.initTime = Date.now();
        };
        return p.prototype.addChars = r, p.prototype.addFonts = i, p.prototype.getCharData = a, 
        p.prototype.getFontByName = h, p.prototype.measureText = n, p;
    }(), Dt = function() {
        function t() {
            if (this.elem.globalData.frameId !== this.frameId) {
                this.mdf = !1;
                var t = this.comp.renderedFrame - this.offsetTime;
                if (!(t === this.lastFrame || this.lastFrame !== p && (this.lastFrame >= this.keyframes[this.keyframes.length - 1].t - this.offsetTime && t >= this.keyframes[this.keyframes.length - 1].t - this.offsetTime || this.lastFrame < this.keyframes[0].t - this.offsetTime && t < this.keyframes[0].t - this.offsetTime))) {
                    for (var e, s, i = this.lastFrame < t ? this._lastIndex : 0, r = this.keyframes.length - 1, a = !0; a; ) {
                        if (e = this.keyframes[i], s = this.keyframes[i + 1], i == r - 1 && t >= s.t - this.offsetTime) {
                            e.h && (e = s);
                            break;
                        }
                        if (s.t - this.offsetTime > t) break;
                        i < r - 1 ? i += 1 : a = !1;
                    }
                    this._lastIndex = i;
                    var n, h, o, l, f, m;
                    if (e.to) {
                        e.bezierData || xt.buildBezierData(e);
                        var d = e.bezierData;
                        if (t >= s.t - this.offsetTime || t < e.t - this.offsetTime) {
                            var c = t >= s.t - this.offsetTime ? d.points.length - 1 : 0;
                            for (h = d.points[c].point.length, n = 0; n < h; n += 1) this.pv[n] = d.points[c].point[n], 
                            this.v[n] = this.mult ? this.pv[n] * this.mult : this.pv[n], this.lastPValue[n] !== this.pv[n] && (this.mdf = !0, 
                            this.lastPValue[n] = this.pv[n]);
                            this._lastBezierData = null;
                        } else {
                            e.__fnct ? m = e.__fnct : (m = Mt.getBezierEasing(e.o.x, e.o.y, e.i.x, e.i.y, e.n).get, 
                            e.__fnct = m), o = m((t - (e.t - this.offsetTime)) / (s.t - this.offsetTime - (e.t - this.offsetTime)));
                            var u, g = d.segmentLength * o, y = this.lastFrame < t && this._lastBezierData === d ? this._lastAddedLength : 0;
                            for (f = this.lastFrame < t && this._lastBezierData === d ? this._lastPoint : 0, 
                            a = !0, l = d.points.length; a; ) {
                                if (y += d.points[f].partialLength, 0 === g || 0 === o || f == d.points.length - 1) {
                                    for (h = d.points[f].point.length, n = 0; n < h; n += 1) this.pv[n] = d.points[f].point[n], 
                                    this.v[n] = this.mult ? this.pv[n] * this.mult : this.pv[n], this.lastPValue[n] !== this.pv[n] && (this.mdf = !0, 
                                    this.lastPValue[n] = this.pv[n]);
                                    break;
                                }
                                if (g >= y && g < y + d.points[f + 1].partialLength) {
                                    for (u = (g - y) / d.points[f + 1].partialLength, h = d.points[f].point.length, 
                                    n = 0; n < h; n += 1) this.pv[n] = d.points[f].point[n] + (d.points[f + 1].point[n] - d.points[f].point[n]) * u, 
                                    this.v[n] = this.mult ? this.pv[n] * this.mult : this.pv[n], this.lastPValue[n] !== this.pv[n] && (this.mdf = !0, 
                                    this.lastPValue[n] = this.pv[n]);
                                    break;
                                }
                                f < l - 1 ? f += 1 : a = !1;
                            }
                            this._lastPoint = f, this._lastAddedLength = y - d.points[f].partialLength, this._lastBezierData = d;
                        }
                    } else {
                        var v, b, w, k, A;
                        for (r = e.s.length, i = 0; i < r; i += 1) {
                            if (1 !== e.h && (t >= s.t - this.offsetTime ? o = 1 : t < e.t - this.offsetTime ? o = 0 : (e.o.x instanceof Array ? (e.__fnct || (e.__fnct = []), 
                            e.__fnct[i] ? m = e.__fnct[i] : (v = e.o.x[i] || e.o.x[0], b = e.o.y[i] || e.o.y[0], 
                            w = e.i.x[i] || e.i.x[0], k = e.i.y[i] || e.i.y[0], m = Mt.getBezierEasing(v, b, w, k).get, 
                            e.__fnct[i] = m)) : e.__fnct ? m = e.__fnct : (v = e.o.x, b = e.o.y, w = e.i.x, 
                            k = e.i.y, m = Mt.getBezierEasing(v, b, w, k).get, e.__fnct = m), o = m((t - (e.t - this.offsetTime)) / (s.t - this.offsetTime - (e.t - this.offsetTime))))), 
                            this.sh && 1 !== e.h) {
                                var P = e.s[i], E = e.e[i];
                                P - E < -180 ? P += 360 : P - E > 180 && (P -= 360), A = P + (E - P) * o;
                            } else A = 1 === e.h ? e.s[i] : e.s[i] + (e.e[i] - e.s[i]) * o;
                            1 === r ? (this.v = this.mult ? A * this.mult : A, this.pv = A, this.lastPValue != this.pv && (this.mdf = !0, 
                            this.lastPValue = this.pv)) : (this.v[i] = this.mult ? A * this.mult : A, this.pv[i] = A, 
                            this.lastPValue[i] !== this.pv[i] && (this.mdf = !0, this.lastPValue[i] = this.pv[i]));
                        }
                    }
                }
                this.lastFrame = t, this.frameId = this.elem.globalData.frameId;
            }
        }
        function e() {}
        function s(t, s, i) {
            this.mult = i, this.v = i ? s.k * i : s.k, this.pv = s.k, this.mdf = !1, this.comp = t.comp, 
            this.k = !1, this.kf = !1, this.vel = 0, this.getValue = e;
        }
        function i(t, s, i) {
            this.mult = i, this.data = s, this.mdf = !1, this.comp = t.comp, this.k = !1, this.kf = !1, 
            this.frameId = -1, this.v = Array.apply(null, {
                length: s.k.length
            }), this.pv = Array.apply(null, {
                length: s.k.length
            }), this.lastValue = Array.apply(null, {
                length: s.k.length
            });
            var r = Array.apply(null, {
                length: s.k.length
            });
            this.vel = r.map(function() {
                return 0;
            });
            var a, n = s.k.length;
            for (a = 0; a < n; a += 1) this.v[a] = i ? s.k[a] * i : s.k[a], this.pv[a] = s.k[a];
            this.getValue = e;
        }
        function r(e, s, i) {
            this.keyframes = s.k, this.offsetTime = e.data.st, this.lastValue = -99999, this.lastPValue = -99999, 
            this.frameId = -1, this._lastIndex = 0, this.k = !0, this.kf = !0, this.data = s, 
            this.mult = i, this.elem = e, this.comp = e.comp, this.lastFrame = p, this.v = i ? s.k[0].s[0] * i : s.k[0].s[0], 
            this.pv = s.k[0].s[0], this.getValue = t;
        }
        function a(e, s, i) {
            var r, a, n, h, o, l = s.k.length;
            for (r = 0; r < l - 1; r += 1) s.k[r].to && s.k[r].s && s.k[r].e && (a = s.k[r].s, 
            n = s.k[r].e, h = s.k[r].to, o = s.k[r].ti, (2 === a.length && (a[0] !== n[0] || a[1] !== n[1]) && xt.pointOnLine2D(a[0], a[1], n[0], n[1], a[0] + h[0], a[1] + h[1]) && xt.pointOnLine2D(a[0], a[1], n[0], n[1], n[0] + o[0], n[1] + o[1]) || 3 === a.length && (a[0] !== n[0] || a[1] !== n[1] || a[2] !== n[2]) && xt.pointOnLine3D(a[0], a[1], a[2], n[0], n[1], n[2], a[0] + h[0], a[1] + h[1], a[2] + h[2]) && xt.pointOnLine3D(a[0], a[1], a[2], n[0], n[1], n[2], n[0] + o[0], n[1] + o[1], n[2] + o[2])) && (s.k[r].to = null, 
            s.k[r].ti = null));
            this.keyframes = s.k, this.offsetTime = e.data.st, this.k = !0, this.kf = !0, this.mult = i, 
            this.elem = e, this.comp = e.comp, this.getValue = t, this.frameId = -1, this._lastIndex = 0, 
            this.v = Array.apply(null, {
                length: s.k[0].s.length
            }), this.pv = Array.apply(null, {
                length: s.k[0].s.length
            }), this.lastValue = Array.apply(null, {
                length: s.k[0].s.length
            }), this.lastPValue = Array.apply(null, {
                length: s.k[0].s.length
            }), this.lastFrame = p;
        }
        function n(t, e, n, h, o) {
            var p;
            if (2 === n) p = new l(t, e, o); else if (0 === e.a) p = 0 === n ? new s(t, e, h) : new i(t, e, h); else if (1 === e.a) p = 0 === n ? new r(t, e, h) : new a(t, e, h); else if (e.k.length) if ("number" == typeof e.k[0]) p = new i(t, e, h); else switch (n) {
              case 0:
                p = new r(t, e, h);
                break;

              case 1:
                p = new a(t, e, h);
            } else p = new s(t, e, h);
            return p.k && o.push(p), p;
        }
        function h(t, e, s, i) {
            return new m(t, e, s, i);
        }
        function o(t, e, s) {
            return new d(t, e, s);
        }
        var p = -999999, l = function() {
            function t() {
                return this.p ? ExpressionValue(this.p) : [ this.px.v, this.py.v, this.pz ? this.pz.v : 0 ];
            }
            function e() {
                return ExpressionValue(this.px);
            }
            function s() {
                return ExpressionValue(this.py);
            }
            function i() {
                return ExpressionValue(this.a);
            }
            function r() {
                return ExpressionValue(this.or);
            }
            function a() {
                return this.r ? ExpressionValue(this.r, 1 / Pt) : ExpressionValue(this.rz, 1 / Pt);
            }
            function n() {
                return ExpressionValue(this.s, 100);
            }
            function h() {
                return ExpressionValue(this.o, 100);
            }
            function o() {
                return ExpressionValue(this.sk);
            }
            function p() {
                return ExpressionValue(this.sa);
            }
            function l(t) {
                var e, s = this.dynamicProperties.length;
                for (e = 0; e < s; e += 1) this.dynamicProperties[e].getValue(), this.dynamicProperties[e].mdf && (this.mdf = !0);
                this.a && t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]), 
                this.r ? t.rotate(-this.r.v) : t.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), 
                this.data.p.s ? this.data.p.z ? t.translate(this.px.v, this.py.v, -this.pz.v) : t.translate(this.px.v, this.py.v, 0) : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
            }
            function f() {
                if (this.elem.globalData.frameId !== this.frameId) {
                    this.mdf = !1;
                    var t, e = this.dynamicProperties.length;
                    for (t = 0; t < e; t += 1) this.dynamicProperties[t].getValue(), this.dynamicProperties[t].mdf && (this.mdf = !0);
                    if (this.mdf) {
                        if (this.v.reset(), this.a && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), 
                        this.s && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.v.skewFromAxis(-this.sk.v, this.sa.v), 
                        this.r ? this.v.rotate(-this.r.v) : this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), 
                        this.autoOriented && this.p.keyframes && this.p.getValueAtTime) {
                            var s, i;
                            this.p.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (s = this.p.getValueAtTime((this.p.keyframes[0].t + .01) / this.elem.globalData.frameRate, 0), 
                            i = this.p.getValueAtTime(this.p.keyframes[0].t / this.elem.globalData.frameRate, 0)) : this.p.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (s = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / this.elem.globalData.frameRate, 0), 
                            i = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - .01) / this.elem.globalData.frameRate, 0)) : (s = this.p.pv, 
                            i = this.p.getValueAtTime((this.p.lastFrame + this.p.offsetTime - .01) / this.elem.globalData.frameRate, this.p.offsetTime)), 
                            this.v.rotate(-Math.atan2(s[1] - i[1], s[0] - i[0]));
                        }
                        this.data.p.s ? this.data.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
                    }
                    this.frameId = this.elem.globalData.frameId;
                }
            }
            function m() {
                this.inverted = !0, this.iv = new b(), this.k || (this.data.p.s ? this.iv.translate(this.px.v, this.py.v, -this.pz.v) : this.iv.translate(this.p.v[0], this.p.v[1], -this.p.v[2]), 
                this.r ? this.iv.rotate(-this.r.v) : this.iv.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v), 
                this.s && this.iv.scale(this.s.v[0], this.s.v[1], 1), this.a && this.iv.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]));
            }
            function d() {}
            return function(c, u, g) {
                this.elem = c, this.frameId = -1, this.type = "transform", this.dynamicProperties = [], 
                this.mdf = !1, this.data = u, this.getValue = f, this.applyToMatrix = l, this.setInverted = m, 
                this.autoOrient = d, this.v = new b(), u.p.s ? (this.px = Dt.getProp(c, u.p.x, 0, 0, this.dynamicProperties), 
                this.py = Dt.getProp(c, u.p.y, 0, 0, this.dynamicProperties), u.p.z && (this.pz = Dt.getProp(c, u.p.z, 0, 0, this.dynamicProperties))) : this.p = Dt.getProp(c, u.p, 1, 0, this.dynamicProperties), 
                u.r ? this.r = Dt.getProp(c, u.r, 0, Pt, this.dynamicProperties) : u.rx && (this.rx = Dt.getProp(c, u.rx, 0, Pt, this.dynamicProperties), 
                this.ry = Dt.getProp(c, u.ry, 0, Pt, this.dynamicProperties), this.rz = Dt.getProp(c, u.rz, 0, Pt, this.dynamicProperties), 
                this.or = Dt.getProp(c, u.or, 1, Pt, this.dynamicProperties)), u.sk && (this.sk = Dt.getProp(c, u.sk, 0, Pt, this.dynamicProperties), 
                this.sa = Dt.getProp(c, u.sa, 0, Pt, this.dynamicProperties)), u.a && (this.a = Dt.getProp(c, u.a, 1, 0, this.dynamicProperties)), 
                u.s && (this.s = Dt.getProp(c, u.s, 1, .01, this.dynamicProperties)), u.o ? this.o = Dt.getProp(c, u.o, 0, .01, g) : this.o = {
                    mdf: !1,
                    v: 1
                }, this.dynamicProperties.length ? g.push(this) : (this.a && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), 
                this.s && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.v.skewFromAxis(-this.sk.v, this.sa.v), 
                this.r ? this.v.rotate(-this.r.v) : this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), 
                this.data.p.s ? u.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])), 
                Object.defineProperty(this, "position", {
                    get: t
                }), Object.defineProperty(this, "xPosition", {
                    get: e
                }), Object.defineProperty(this, "yPosition", {
                    get: s
                }), Object.defineProperty(this, "orientation", {
                    get: r
                }), Object.defineProperty(this, "anchorPoint", {
                    get: i
                }), Object.defineProperty(this, "rotation", {
                    get: a
                }), Object.defineProperty(this, "scale", {
                    get: n
                }), Object.defineProperty(this, "opacity", {
                    get: h
                }), Object.defineProperty(this, "skew", {
                    get: o
                }), Object.defineProperty(this, "skewAxis", {
                    get: p
                });
            };
        }(), f = function() {
            function t(t) {
                if (this.prop.getValue(), this.cmdf = !1, this.omdf = !1, this.prop.mdf || t) {
                    var e, s, i, r = 4 * this.data.p;
                    for (e = 0; e < r; e += 1) s = e % 4 == 0 ? 100 : 255, i = Math.round(this.prop.v[e] * s), 
                    this.c[e] !== i && (this.c[e] = i, this.cmdf = !0);
                    if (this.o.length) for (r = this.prop.v.length, e = 4 * this.data.p; e < r; e += 1) s = e % 2 == 0 ? 100 : 1, 
                    i = e % 2 == 0 ? Math.round(100 * this.prop.v[e]) : this.prop.v[e], this.o[e - 4 * this.data.p] !== i && (this.o[e - 4 * this.data.p] = i, 
                    this.omdf = !0);
                }
            }
            function e(e, s, i) {
                this.prop = n(e, s.k, 1, null, []), this.data = s, this.k = this.prop.k, this.c = Array.apply(null, {
                    length: 4 * s.p
                });
                var r = s.k.k[0].s ? s.k.k[0].s.length - 4 * s.p : s.k.k.length - 4 * s.p;
                this.o = Array.apply(null, {
                    length: r
                }), this.cmdf = !1, this.omdf = !1, this.getValue = t, this.prop.k && i.push(this), 
                this.getValue(!0);
            }
            return function(t, s, i) {
                return new e(t, s, i);
            };
        }(), m = function() {
            function t(t) {
                var e = 0, s = this.dataProps.length;
                if (this.elem.globalData.frameId !== this.frameId || t) {
                    for (this.mdf = !1, this.frameId = this.elem.globalData.frameId; e < s; ) {
                        if (this.dataProps[e].p.mdf) {
                            this.mdf = !0;
                            break;
                        }
                        e += 1;
                    }
                    if (this.mdf || t) for ("svg" === this.renderer && (this.dasharray = ""), e = 0; e < s; e += 1) "o" != this.dataProps[e].n ? "svg" === this.renderer ? this.dasharray += " " + this.dataProps[e].p.v : this.dasharray[e] = this.dataProps[e].p.v : this.dashoffset = this.dataProps[e].p.v;
                }
            }
            return function(e, s, i, r) {
                this.elem = e, this.frameId = -1, this.dataProps = new Array(s.length), this.renderer = i, 
                this.mdf = !1, this.k = !1, "svg" === this.renderer ? this.dasharray = "" : this.dasharray = new Array(s.length - 1), 
                this.dashoffset = 0;
                var a, n, h = s.length;
                for (a = 0; a < h; a += 1) n = Dt.getProp(e, s[a].v, 0, 0, r), this.k = !!n.k || this.k, 
                this.dataProps[a] = {
                    n: s[a].n,
                    p: n
                };
                this.getValue = t, this.k ? r.push(this) : this.getValue(!0);
            };
        }(), d = function() {
            function t() {
                if (this.dynamicProperties.length) {
                    var t, e = this.dynamicProperties.length;
                    for (t = 0; t < e; t += 1) this.dynamicProperties[t].getValue(), this.dynamicProperties[t].mdf && (this.mdf = !0);
                }
                var s = this.data.totalChars, i = 2 === this.data.r ? 1 : 100 / s, r = this.o.v / i, a = this.s.v / i + r, n = this.e.v / i + r;
                if (a > n) {
                    var h = a;
                    a = n, n = h;
                }
                this.finalS = a, this.finalE = n;
            }
            function e(t) {
                var e = Mt.getBezierEasing(this.ne.v / 100, 0, 1 - this.xe.v / 100, 1).get, a = 0, n = this.finalS, h = this.finalE, o = this.data.sh;
                if (2 == o) a = e(a = h === n ? t >= h ? 1 : 0 : s(0, i(.5 / (h - n) + (t - n) / (h - n), 1))); else if (3 == o) a = e(a = h === n ? t >= h ? 0 : 1 : 1 - s(0, i(.5 / (h - n) + (t - n) / (h - n), 1))); else if (4 == o) h === n ? a = 0 : (a = s(0, i(.5 / (h - n) + (t - n) / (h - n), 1))) < .5 ? a *= 2 : a = 1 - 2 * (a - .5), 
                a = e(a); else if (5 == o) {
                    if (h === n) a = 0; else {
                        var p = h - n, l = -p / 2 + (t = i(s(0, t + .5 - n), h - n)), f = p / 2;
                        a = Math.sqrt(1 - l * l / (f * f));
                    }
                    a = e(a);
                } else 6 == o ? (h === n ? a = 0 : (t = i(s(0, t + .5 - n), h - n), a = (1 + Math.cos(Math.PI + 2 * Math.PI * t / (h - n))) / 2), 
                a = e(a)) : (t >= r(n) && (a = t - n < 0 ? 1 - (n - t) : s(0, i(h - t, 1))), a = e(a));
                return a * this.a.v;
            }
            var s = Math.max, i = Math.min, r = Math.floor;
            return function(s, i, r) {
                this.mdf = !1, this.k = !1, this.data = i, this.dynamicProperties = [], this.getValue = t, 
                this.getMult = e, this.comp = s.comp, this.finalS = 0, this.finalE = 0, this.s = Dt.getProp(s, i.s || {
                    k: 0
                }, 0, 0, this.dynamicProperties), this.e = "e" in i ? Dt.getProp(s, i.e, 0, 0, this.dynamicProperties) : {
                    v: 2 === i.r ? i.totalChars : 100
                }, this.o = Dt.getProp(s, i.o || {
                    k: 0
                }, 0, 0, this.dynamicProperties), this.xe = Dt.getProp(s, i.xe || {
                    k: 0
                }, 0, 0, this.dynamicProperties), this.ne = Dt.getProp(s, i.ne || {
                    k: 0
                }, 0, 0, this.dynamicProperties), this.a = Dt.getProp(s, i.a, 0, .01, this.dynamicProperties), 
                this.dynamicProperties.length ? r.push(this) : this.getValue();
            };
        }(), c = {};
        return c.getProp = n, c.getDashProp = h, c.getTextSelectorProp = o, c.getGradientProp = f, 
        c;
    }();
    A.prototype.setPathData = function(t, e) {
        for (this.c = t; e > this._maxLength; ) this.doubleArrayLength();
        for (var s = 0; s < e; ) this.v[s] = zt.newPoint(), this.o[s] = zt.newPoint(), this.i[s] = zt.newPoint(), 
        s += 1;
        this._length = e;
    }, A.prototype.doubleArrayLength = function() {
        this.v = this.v.concat(Array.apply(null, {
            length: this._maxLength
        })), this.i = this.i.concat(Array.apply(null, {
            length: this._maxLength
        })), this.o = this.o.concat(Array.apply(null, {
            length: this._maxLength
        })), this._maxLength *= 2;
    }, A.prototype.setXYAt = function(t, e, s, i, r) {
        var a;
        switch (this._length = Math.max(this._length, i + 1), this._length >= this._maxLength && this.doubleArrayLength(), 
        s) {
          case "v":
            a = this.v;
            break;

          case "i":
            a = this.i;
            break;

          case "o":
            a = this.o;
        }
        (!a[i] || a[i] && !r) && (a[i] = zt.newPoint()), a[i][0] = t, a[i][1] = e;
    }, A.prototype.setTripleAt = function(t, e, s, i, r, a, n, h) {
        this.setXYAt(t, e, "v", n, h), this.setXYAt(s, i, "o", n, h), this.setXYAt(r, a, "i", n, h);
    };
    var _t = function() {
        function t() {
            if (this.elem.globalData.frameId !== this.frameId) {
                this.mdf = !1;
                var t = this.comp.renderedFrame - this.offsetTime;
                if (this.lastFrame === n || !(this.lastFrame < this.keyframes[0].t - this.offsetTime && t < this.keyframes[0].t - this.offsetTime || this.lastFrame > this.keyframes[this.keyframes.length - 1].t - this.offsetTime && t > this.keyframes[this.keyframes.length - 1].t - this.offsetTime)) {
                    var e, s, i;
                    if (t < this.keyframes[0].t - this.offsetTime) e = this.keyframes[0].s[0], i = !0, 
                    this._lastIndex = 0; else if (t >= this.keyframes[this.keyframes.length - 1].t - this.offsetTime) e = 1 === this.keyframes[this.keyframes.length - 2].h ? this.keyframes[this.keyframes.length - 1].s[0] : this.keyframes[this.keyframes.length - 2].e[0], 
                    i = !0; else {
                        for (var r, a, h, o, p, l, f = this.lastFrame < n ? this._lastIndex : 0, m = this.keyframes.length - 1, d = !0; d && (r = this.keyframes[f], 
                        !((a = this.keyframes[f + 1]).t - this.offsetTime > t)); ) f < m - 1 ? f += 1 : d = !1;
                        i = 1 === r.h, this._lastIndex = f;
                        var c;
                        if (!i) {
                            if (t >= a.t - this.offsetTime) c = 1; else if (t < r.t - this.offsetTime) c = 0; else {
                                var u;
                                r.__fnct ? u = r.__fnct : (u = Mt.getBezierEasing(r.o.x, r.o.y, r.i.x, r.i.y).get, 
                                r.__fnct = u), c = u((t - (r.t - this.offsetTime)) / (a.t - this.offsetTime - (r.t - this.offsetTime)));
                            }
                            s = r.e[0];
                        }
                        e = r.s[0];
                    }
                    o = this.v._length, l = e.i[0].length;
                    var g, y = !1;
                    for (h = 0; h < o; h += 1) for (p = 0; p < l; p += 1) i ? (g = e.i[h][p], this.v.i[h][p] !== g && (this.v.i[h][p] = g, 
                    this.pv.i[h][p] = g, y = !0), g = e.o[h][p], this.v.o[h][p] !== g && (this.v.o[h][p] = g, 
                    this.pv.o[h][p] = g, y = !0), g = e.v[h][p], this.v.v[h][p] !== g && (this.v.v[h][p] = g, 
                    this.pv.v[h][p] = g, y = !0)) : (g = e.i[h][p] + (s.i[h][p] - e.i[h][p]) * c, this.v.i[h][p] !== g && (this.v.i[h][p] = g, 
                    this.pv.i[h][p] = g, y = !0), g = e.o[h][p] + (s.o[h][p] - e.o[h][p]) * c, this.v.o[h][p] !== g && (this.v.o[h][p] = g, 
                    this.pv.o[h][p] = g, y = !0), g = e.v[h][p] + (s.v[h][p] - e.v[h][p]) * c, this.v.v[h][p] !== g && (this.v.v[h][p] = g, 
                    this.pv.v[h][p] = g, y = !0));
                    this.mdf = y, this.v.c = e.c, this.paths = this.localShapeCollection;
                }
                this.lastFrame = t, this.frameId = this.elem.globalData.frameId;
            }
        }
        function e() {
            return this.v;
        }
        function s() {
            this.paths = this.localShapeCollection, this.k || (this.mdf = !1);
        }
        function i(t, i, r) {
            this.comp = t.comp, this.k = !1, this.mdf = !1, this.v = Rt.newShape();
            var a = 3 === r ? i.pt.k : i.ks.k;
            this.v.v = a.v, this.v.i = a.i, this.v.o = a.o, this.v.c = a.c, this.v._length = this.v.v.length, 
            this.getValue = e, this.pv = Rt.clone(this.v), this.localShapeCollection = Ot.newShapeCollection(), 
            this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = s;
        }
        function r(e, i, r) {
            this.comp = e.comp, this.elem = e, this.offsetTime = e.data.st, this._lastIndex = 0, 
            this.getValue = t, this.keyframes = 3 === r ? i.pt.k : i.ks.k, this.k = !0, this.kf = !0;
            var a = this.keyframes[0].s[0].i.length;
            this.keyframes[0].s[0].i[0].length;
            this.v = Rt.newShape(), this.v.setPathData(this.keyframes[0].s[0].c, a), this.pv = Rt.clone(this.v), 
            this.localShapeCollection = Ot.newShapeCollection(), this.paths = this.localShapeCollection, 
            this.paths.addShape(this.v), this.lastFrame = n, this.reset = s;
        }
        function a(t, e, s, a) {
            var n;
            if (3 === s || 4 === s) {
                var l = 3 === s ? e.pt : e.ks, f = l.k;
                n = 1 === l.a || f.length ? new r(t, e, s) : new i(t, e, s);
            } else 5 === s ? n = new p(t, e) : 6 === s ? n = new h(t, e) : 7 === s && (n = new o(t, e));
            return n.k && a.push(n), n;
        }
        var n = -999999, h = function() {
            function t() {
                var t = this.p.v[0], e = this.p.v[1], s = this.s.v[0] / 2, r = this.s.v[1] / 2;
                3 !== this.d ? (this.v.v[0][0] = t, this.v.v[0][1] = e - r, this.v.v[1][0] = t + s, 
                this.v.v[1][1] = e, this.v.v[2][0] = t, this.v.v[2][1] = e + r, this.v.v[3][0] = t - s, 
                this.v.v[3][1] = e, this.v.i[0][0] = t - s * i, this.v.i[0][1] = e - r, this.v.i[1][0] = t + s, 
                this.v.i[1][1] = e - r * i, this.v.i[2][0] = t + s * i, this.v.i[2][1] = e + r, 
                this.v.i[3][0] = t - s, this.v.i[3][1] = e + r * i, this.v.o[0][0] = t + s * i, 
                this.v.o[0][1] = e - r, this.v.o[1][0] = t + s, this.v.o[1][1] = e + r * i, this.v.o[2][0] = t - s * i, 
                this.v.o[2][1] = e + r, this.v.o[3][0] = t - s, this.v.o[3][1] = e - r * i) : (this.v.v[0][0] = t, 
                this.v.v[0][1] = e - r, this.v.v[1][0] = t - s, this.v.v[1][1] = e, this.v.v[2][0] = t, 
                this.v.v[2][1] = e + r, this.v.v[3][0] = t + s, this.v.v[3][1] = e, this.v.i[0][0] = t + s * i, 
                this.v.i[0][1] = e - r, this.v.i[1][0] = t - s, this.v.i[1][1] = e - r * i, this.v.i[2][0] = t - s * i, 
                this.v.i[2][1] = e + r, this.v.i[3][0] = t + s, this.v.i[3][1] = e + r * i, this.v.o[0][0] = t - s * i, 
                this.v.o[0][1] = e - r, this.v.o[1][0] = t - s, this.v.o[1][1] = e + r * i, this.v.o[2][0] = t + s * i, 
                this.v.o[2][1] = e + r, this.v.o[3][0] = t + s, this.v.o[3][1] = e - r * i);
            }
            function e(t) {
                var e, s = this.dynamicProperties.length;
                if (this.elem.globalData.frameId !== this.frameId) {
                    for (this.mdf = !1, this.frameId = this.elem.globalData.frameId, e = 0; e < s; e += 1) this.dynamicProperties[e].getValue(t), 
                    this.dynamicProperties[e].mdf && (this.mdf = !0);
                    this.mdf && this.convertEllToPath();
                }
            }
            var i = Et;
            return function(i, r) {
                this.v = Rt.newShape(), this.v.setPathData(!0, 4), this.localShapeCollection = Ot.newShapeCollection(), 
                this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), 
                this.d = r.d, this.dynamicProperties = [], this.elem = i, this.comp = i.comp, this.frameId = -1, 
                this.mdf = !1, this.getValue = e, this.convertEllToPath = t, this.reset = s, this.p = Dt.getProp(i, r.p, 1, 0, this.dynamicProperties), 
                this.s = Dt.getProp(i, r.s, 1, 0, this.dynamicProperties), this.dynamicProperties.length ? this.k = !0 : this.convertEllToPath();
            };
        }(), o = function() {
            function t() {
                var t, e = Math.floor(this.pt.v), s = 2 * Math.PI / e, i = this.or.v, r = this.os.v, a = 2 * Math.PI * i / (4 * e), n = -Math.PI / 2, h = 3 === this.data.d ? -1 : 1;
                for (n += this.r.v, this.v._length = 0, t = 0; t < e; t += 1) {
                    var o = i * Math.cos(n), p = i * Math.sin(n), l = 0 === o && 0 === p ? 0 : p / Math.sqrt(o * o + p * p), f = 0 === o && 0 === p ? 0 : -o / Math.sqrt(o * o + p * p);
                    o += +this.p.v[0], p += +this.p.v[1], this.v.setTripleAt(o, p, o - l * a * r * h, p - f * a * r * h, o + l * a * r * h, p + f * a * r * h, t, !0), 
                    n += s * h;
                }
                this.paths.length = 0, this.paths[0] = this.v;
            }
            function e() {
                var t, e, s, i, r = 2 * Math.floor(this.pt.v), a = 2 * Math.PI / r, n = !0, h = this.or.v, o = this.ir.v, p = this.os.v, l = this.is.v, f = 2 * Math.PI * h / (2 * r), m = 2 * Math.PI * o / (2 * r), d = -Math.PI / 2;
                d += this.r.v;
                var c = 3 === this.data.d ? -1 : 1;
                for (this.v._length = 0, t = 0; t < r; t += 1) {
                    e = n ? h : o, s = n ? p : l, i = n ? f : m;
                    var u = e * Math.cos(d), g = e * Math.sin(d), y = 0 === u && 0 === g ? 0 : g / Math.sqrt(u * u + g * g), v = 0 === u && 0 === g ? 0 : -u / Math.sqrt(u * u + g * g);
                    u += +this.p.v[0], g += +this.p.v[1], this.v.setTripleAt(u, g, u - y * i * s * c, g - v * i * s * c, u + y * i * s * c, g + v * i * s * c, t, !0), 
                    n = !n, d += a * c;
                }
            }
            function i() {
                if (this.elem.globalData.frameId !== this.frameId) {
                    this.mdf = !1, this.frameId = this.elem.globalData.frameId;
                    var t, e = this.dynamicProperties.length;
                    for (t = 0; t < e; t += 1) this.dynamicProperties[t].getValue(), this.dynamicProperties[t].mdf && (this.mdf = !0);
                    this.mdf && this.convertToPath();
                }
            }
            return function(r, a) {
                this.v = Rt.newShape(), this.v.setPathData(!0, 0), this.elem = r, this.comp = r.comp, 
                this.data = a, this.frameId = -1, this.d = a.d, this.dynamicProperties = [], this.mdf = !1, 
                this.getValue = i, this.reset = s, 1 === a.sy ? (this.ir = Dt.getProp(r, a.ir, 0, 0, this.dynamicProperties), 
                this.is = Dt.getProp(r, a.is, 0, .01, this.dynamicProperties), this.convertToPath = e) : this.convertToPath = t, 
                this.pt = Dt.getProp(r, a.pt, 0, 0, this.dynamicProperties), this.p = Dt.getProp(r, a.p, 1, 0, this.dynamicProperties), 
                this.r = Dt.getProp(r, a.r, 0, Pt, this.dynamicProperties), this.or = Dt.getProp(r, a.or, 0, 0, this.dynamicProperties), 
                this.os = Dt.getProp(r, a.os, 0, .01, this.dynamicProperties), this.localShapeCollection = Ot.newShapeCollection(), 
                this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, 
                this.dynamicProperties.length ? this.k = !0 : this.convertToPath();
            };
        }(), p = function() {
            function t(t) {
                if (this.elem.globalData.frameId !== this.frameId) {
                    this.mdf = !1, this.frameId = this.elem.globalData.frameId;
                    var e, s = this.dynamicProperties.length;
                    for (e = 0; e < s; e += 1) this.dynamicProperties[e].getValue(t), this.dynamicProperties[e].mdf && (this.mdf = !0);
                    this.mdf && this.convertRectToPath();
                }
            }
            function e() {
                var t = this.p.v[0], e = this.p.v[1], s = this.s.v[0] / 2, i = this.s.v[1] / 2, r = wt(s, i, this.r.v), a = r * (1 - Et);
                this.v._length = 0, 2 === this.d || 1 === this.d ? (this.v.setTripleAt(t + s, e - i + r, t + s, e - i + r, t + s, e - i + a, 0, !0), 
                this.v.setTripleAt(t + s, e + i - r, t + s, e + i - a, t + s, e + i - r, 1, !0), 
                0 !== r ? (this.v.setTripleAt(t + s - r, e + i, t + s - r, e + i, t + s - a, e + i, 2, !0), 
                this.v.setTripleAt(t - s + r, e + i, t - s + a, e + i, t - s + r, e + i, 3, !0), 
                this.v.setTripleAt(t - s, e + i - r, t - s, e + i - r, t - s, e + i - a, 4, !0), 
                this.v.setTripleAt(t - s, e - i + r, t - s, e - i + a, t - s, e - i + r, 5, !0), 
                this.v.setTripleAt(t - s + r, e - i, t - s + r, e - i, t - s + a, e - i, 6, !0), 
                this.v.setTripleAt(t + s - r, e - i, t + s - a, e - i, t + s - r, e - i, 7, !0)) : (this.v.setTripleAt(t - s, e + i, t - s + a, e + i, t - s, e + i, 2), 
                this.v.setTripleAt(t - s, e - i, t - s, e - i + a, t - s, e - i, 3))) : (this.v.setTripleAt(t + s, e - i + r, t + s, e - i + a, t + s, e - i + r, 0, !0), 
                0 !== r ? (this.v.setTripleAt(t + s - r, e - i, t + s - r, e - i, t + s - a, e - i, 1, !0), 
                this.v.setTripleAt(t - s + r, e - i, t - s + a, e - i, t - s + r, e - i, 2, !0), 
                this.v.setTripleAt(t - s, e - i + r, t - s, e - i + r, t - s, e - i + a, 3, !0), 
                this.v.setTripleAt(t - s, e + i - r, t - s, e + i - a, t - s, e + i - r, 4, !0), 
                this.v.setTripleAt(t - s + r, e + i, t - s + r, e + i, t - s + a, e + i, 5, !0), 
                this.v.setTripleAt(t + s - r, e + i, t + s - a, e + i, t + s - r, e + i, 6, !0), 
                this.v.setTripleAt(t + s, e + i - r, t + s, e + i - r, t + s, e + i - a, 7, !0)) : (this.v.setTripleAt(t - s, e - i, t - s + a, e - i, t - s, e - i, 1, !0), 
                this.v.setTripleAt(t - s, e + i, t - s, e + i - a, t - s, e + i, 2, !0), this.v.setTripleAt(t + s, e + i, t + s - a, e + i, t + s, e + i, 3, !0)));
            }
            return function(i, r) {
                this.v = Rt.newShape(), this.v.c = !0, this.localShapeCollection = Ot.newShapeCollection(), 
                this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, 
                this.elem = i, this.comp = i.comp, this.frameId = -1, this.d = r.d, this.dynamicProperties = [], 
                this.mdf = !1, this.getValue = t, this.convertRectToPath = e, this.reset = s, this.p = Dt.getProp(i, r.p, 1, 0, this.dynamicProperties), 
                this.s = Dt.getProp(i, r.s, 1, 0, this.dynamicProperties), this.r = Dt.getProp(i, r.r, 0, 0, this.dynamicProperties), 
                this.dynamicProperties.length ? this.k = !0 : this.convertRectToPath();
            };
        }(), l = {};
        return l.getShapeProp = a, l;
    }(), Tt = function() {
        function t(t, e) {
            i[t] || (i[t] = e);
        }
        function e(t, e, s, r) {
            return new i[t](e, s, r);
        }
        var s = {}, i = {};
        return s.registerModifier = t, s.getModifier = e, s;
    }();
    P.prototype.initModifierProperties = function() {}, P.prototype.addShapeToModifier = function() {}, 
    P.prototype.addShape = function(t) {
        this.closed || (this.shapes.push({
            shape: t.sh,
            data: t,
            localShapeCollection: Ot.newShapeCollection()
        }), this.addShapeToModifier(t.sh));
    }, P.prototype.init = function(t, e, s) {
        this.elem = t, this.frameId = -1, this.shapes = [], this.dynamicProperties = [], 
        this.mdf = !1, this.closed = !1, this.k = !1, this.comp = t.comp, this.initModifierProperties(t, e), 
        this.dynamicProperties.length ? (this.k = !0, s.push(this)) : this.getValue(!0);
    }, k(P, E), E.prototype.processKeys = function(t) {
        if (this.elem.globalData.frameId !== this.frameId || t) {
            this.mdf = !!t, this.frameId = this.elem.globalData.frameId;
            var e, s = this.dynamicProperties.length;
            for (e = 0; e < s; e += 1) this.dynamicProperties[e].getValue(), this.dynamicProperties[e].mdf && (this.mdf = !0);
            if (this.mdf || t) {
                var i = this.o.v % 360 / 360;
                i < 0 && (i += 1);
                var r = this.s.v + i, a = this.e.v + i;
                if (r > a) {
                    var n = r;
                    r = a, a = n;
                }
                this.sValue = r, this.eValue = a, this.oValue = i;
            }
        }
    }, E.prototype.initModifierProperties = function(t, e) {
        this.sValue = 0, this.eValue = 0, this.oValue = 0, this.getValue = this.processKeys, 
        this.s = Dt.getProp(t, e.s, 0, .01, this.dynamicProperties), this.e = Dt.getProp(t, e.e, 0, .01, this.dynamicProperties), 
        this.o = Dt.getProp(t, e.o, 0, 0, this.dynamicProperties), this.m = e.m, this.dynamicProperties.length || this.getValue(!0);
    }, E.prototype.getSegmentsLength = function(t) {
        var e, s = t.c, i = t.v, r = t.o, a = t.i, n = t._length, h = [], o = 0;
        for (e = 0; e < n - 1; e += 1) h[e] = xt.getBezierLength(i[e], i[e + 1], r[e], a[e + 1]), 
        o += h[e].addedLength;
        return s && (h[e] = xt.getBezierLength(i[e], i[0], r[e], a[0]), o += h[e].addedLength), 
        {
            lengths: h,
            totalLength: o
        };
    }, E.prototype.calculateShapeEdges = function(t, e, s, i, r) {
        var a = [];
        e <= 1 ? a.push({
            s: t,
            e: e
        }) : t >= 1 ? a.push({
            s: t - 1,
            e: e - 1
        }) : (a.push({
            s: t,
            e: 1
        }), a.push({
            s: 0,
            e: e - 1
        }));
        var n, h, o = [], p = a.length;
        for (n = 0; n < p; n += 1) if ((h = a[n]).e * r < i || h.s * r > i + s) ; else {
            var l, f;
            l = h.s * r <= i ? 0 : (h.s * r - i) / s, f = h.e * r >= i + s ? 1 : (h.e * r - i) / s, 
            o.push([ l, f ]);
        }
        return o.length || o.push([ 0, 0 ]), o;
    }, E.prototype.processShapes = function(t) {
        var e, s, i, r, a, n = this.shapes.length, h = this.sValue, o = this.eValue, p = 0;
        if (o === h) for (s = 0; s < n; s += 1) this.shapes[s].localShapeCollection.releaseShapes(), 
        this.shapes[s].shape.mdf = !0, this.shapes[s].shape.paths = this.shapes[s].localShapeCollection; else if (1 === o && 0 === h || 0 === o && 1 === h) {
            if (this.mdf) for (s = 0; s < n; s += 1) this.shapes[s].shape.mdf = !0;
        } else {
            var l, f, m = [];
            for (s = 0; s < n; s += 1) if ((l = this.shapes[s]).shape.mdf || this.mdf || t || 2 === this.m) {
                if (e = l.shape.paths, c = e._length, a = 0, !l.shape.mdf && l.pathsData) a = l.totalShapeLength; else {
                    for (i = [], d = 0; d < c; d += 1) r = this.getSegmentsLength(e.shapes[d]), i.push(r), 
                    a += r.totalLength;
                    l.totalShapeLength = a, l.pathsData = i;
                }
                p += a, l.shape.mdf = !0;
            } else l.shape.paths = l.localShapeCollection;
            var d, c, u = h, g = o, y = 0;
            for (s = n - 1; s >= 0; s -= 1) if ((l = this.shapes[s]).shape.mdf) {
                if ((f = l.localShapeCollection).releaseShapes(), 2 === this.m && n > 1) {
                    var v = this.calculateShapeEdges(h, o, l.totalShapeLength, y, p);
                    y += l.totalShapeLength;
                } else v = [ [ u, g ] ];
                for (c = v.length, d = 0; d < c; d += 1) {
                    u = v[d][0], g = v[d][1], m.length = 0, g <= 1 ? m.push({
                        s: l.totalShapeLength * u,
                        e: l.totalShapeLength * g
                    }) : u >= 1 ? m.push({
                        s: l.totalShapeLength * (u - 1),
                        e: l.totalShapeLength * (g - 1)
                    }) : (m.push({
                        s: l.totalShapeLength * u,
                        e: l.totalShapeLength
                    }), m.push({
                        s: 0,
                        e: l.totalShapeLength * (g - 1)
                    }));
                    var b = this.addShapes(l, m[0]);
                    if (m[0].s !== m[0].e) {
                        if (m.length > 1) if (l.shape.v.c) {
                            var w = b.pop();
                            this.addPaths(b, f), b = this.addShapes(l, m[1], w);
                        } else this.addPaths(b, f), b = this.addShapes(l, m[1]);
                        this.addPaths(b, f);
                    }
                }
                l.shape.paths = f;
            }
        }
        this.dynamicProperties.length || (this.mdf = !1);
    }, E.prototype.addPaths = function(t, e) {
        var s, i = t.length;
        for (s = 0; s < i; s += 1) e.addShape(t[s]);
    }, E.prototype.addSegment = function(t, e, s, i, r, a, n) {
        r.setXYAt(e[0], e[1], "o", a), r.setXYAt(s[0], s[1], "i", a + 1), n && r.setXYAt(t[0], t[1], "v", a), 
        r.setXYAt(i[0], i[1], "v", a + 1);
    }, E.prototype.addShapes = function(t, e, s) {
        var i, r, a, n, h, o, p, l, f = t.pathsData, m = t.shape.paths.shapes, d = t.shape.paths._length, c = 0, u = [], g = !0;
        for (s ? (h = s._length, l = s._length) : (s = Rt.newShape(), h = 0, l = 0), u.push(s), 
        i = 0; i < d; i += 1) {
            for (o = f[i].lengths, s.c = m[i].c, a = m[i].c ? o.length : o.length + 1, r = 1; r < a; r += 1) if (n = o[r - 1], 
            c + n.addedLength < e.s) c += n.addedLength, s.c = !1; else {
                if (c > e.e) {
                    s.c = !1;
                    break;
                }
                e.s <= c && e.e >= c + n.addedLength ? (this.addSegment(m[i].v[r - 1], m[i].o[r - 1], m[i].i[r], m[i].v[r], s, h, g), 
                g = !1) : (p = xt.getNewSegment(m[i].v[r - 1], m[i].v[r], m[i].o[r - 1], m[i].i[r], (e.s - c) / n.addedLength, (e.e - c) / n.addedLength, o[r - 1]), 
                this.addSegment(p.pt1, p.pt3, p.pt4, p.pt2, s, h, g), g = !1, s.c = !1), c += n.addedLength, 
                h += 1;
            }
            if (m[i].c) {
                if (n = o[r - 1], c <= e.e) {
                    var y = o[r - 1].addedLength;
                    e.s <= c && e.e >= c + y ? (this.addSegment(m[i].v[r - 1], m[i].o[r - 1], m[i].i[0], m[i].v[0], s, h, g), 
                    g = !1) : (p = xt.getNewSegment(m[i].v[r - 1], m[i].v[0], m[i].o[r - 1], m[i].i[0], (e.s - c) / y, (e.e - c) / y, o[r - 1]), 
                    this.addSegment(p.pt1, p.pt3, p.pt4, p.pt2, s, h, g), g = !1, s.c = !1);
                } else s.c = !1;
                c += n.addedLength, h += 1;
            }
            if (s._length && (s.setXYAt(s.v[l][0], s.v[l][1], "i", l), s.setXYAt(s.v[s._length - 1][0], s.v[s._length - 1][1], "o", s._length - 1)), 
            c > e.e) break;
            i < d - 1 && (s = Rt.newShape(), g = !0, u.push(s), h = 0);
        }
        return u;
    }, Tt.registerModifier("tm", E), k(P, S), S.prototype.processKeys = function(t) {
        if (this.elem.globalData.frameId !== this.frameId || t) {
            this.mdf = !!t, this.frameId = this.elem.globalData.frameId;
            var e, s = this.dynamicProperties.length;
            for (e = 0; e < s; e += 1) this.dynamicProperties[e].getValue(), this.dynamicProperties[e].mdf && (this.mdf = !0);
        }
    }, S.prototype.initModifierProperties = function(t, e) {
        this.getValue = this.processKeys, this.rd = Dt.getProp(t, e.r, 0, null, this.dynamicProperties), 
        this.dynamicProperties.length || this.getValue(!0);
    }, S.prototype.processPath = function(t, e) {
        var s = Rt.newShape();
        s.c = t.c;
        var i, r, a, n, h, o, p, l, f, m, d, c, u, g = t._length, y = 0;
        for (i = 0; i < g; i += 1) r = t.v[i], n = t.o[i], a = t.i[i], r[0] === n[0] && r[1] === n[1] && r[0] === a[0] && r[1] === a[1] ? 0 !== i && i !== g - 1 || t.c ? (h = 0 === i ? t.v[g - 1] : t.v[i - 1], 
        p = (o = Math.sqrt(Math.pow(r[0] - h[0], 2) + Math.pow(r[1] - h[1], 2))) ? Math.min(o / 2, e) / o : 0, 
        l = c = r[0] + (h[0] - r[0]) * p, f = u = r[1] - (r[1] - h[1]) * p, m = l - (l - r[0]) * Et, 
        d = f - (f - r[1]) * Et, s.setTripleAt(l, f, m, d, c, u, y), y += 1, h = i === g - 1 ? t.v[0] : t.v[i + 1], 
        p = (o = Math.sqrt(Math.pow(r[0] - h[0], 2) + Math.pow(r[1] - h[1], 2))) ? Math.min(o / 2, e) / o : 0, 
        l = m = r[0] + (h[0] - r[0]) * p, f = d = r[1] + (h[1] - r[1]) * p, c = l - (l - r[0]) * Et, 
        u = f - (f - r[1]) * Et, s.setTripleAt(l, f, m, d, c, u, y), y += 1) : (s.setTripleAt(r[0], r[1], n[0], n[1], a[0], a[1], y), 
        y += 1) : (s.setTripleAt(t.v[i][0], t.v[i][1], t.o[i][0], t.o[i][1], t.i[i][0], t.i[i][1], y), 
        y += 1);
        return s;
    }, S.prototype.processShapes = function(t) {
        var e, s, i, r, a = this.shapes.length, n = this.rd.v;
        if (0 !== n) {
            var h, o;
            for (s = 0; s < a; s += 1) {
                if (h = this.shapes[s], h.shape.paths, o = h.localShapeCollection, h.shape.mdf || this.mdf || t) for (o.releaseShapes(), 
                h.shape.mdf = !0, e = h.shape.paths.shapes, r = h.shape.paths._length, i = 0; i < r; i += 1) o.addShape(this.processPath(e[i], n));
                h.shape.paths = h.localShapeCollection;
            }
        }
        this.dynamicProperties.length || (this.mdf = !1);
    }, Tt.registerModifier("rd", S), M.prototype.processKeys = function(t) {
        if (this.elem.globalData.frameId !== this.frameId || t) {
            this.mdf = !!t;
            var e, s = this.dynamicProperties.length;
            for (e = 0; e < s; e += 1) this.dynamicProperties[e].getValue(), this.dynamicProperties[e].mdf && (this.mdf = !0);
        }
    }, M.prototype.initModifierProperties = function(t, e) {
        this.getValue = this.processKeys, this.c = Dt.getProp(t, e.c, 0, null, this.dynamicProperties), 
        this.o = Dt.getProp(t, e.o, 0, null, this.dynamicProperties), this.tr = Dt.getProp(t, e.tr, 2, null, this.dynamicProperties), 
        this.data = e, this.dynamicProperties.length || this.getValue(!0), this.pMatrix = new b(), 
        this.rMatrix = new b(), this.sMatrix = new b(), this.tMatrix = new b(), this.matrix = new b();
    }, M.prototype.applyTransforms = function(t, e, s, i, r, a) {
        var n = a ? -1 : 1, h = i.s.v[0] + (1 - i.s.v[0]) * (1 - r), o = i.s.v[1] + (1 - i.s.v[1]) * (1 - r);
        t.translate(i.p.v[0] * n * r, i.p.v[1] * n * r, i.p.v[2]), e.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]), 
        e.rotate(-i.r.v * n * r), e.translate(i.a.v[0], i.a.v[1], i.a.v[2]), s.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]), 
        s.scale(a ? 1 / h : h, a ? 1 / o : o), s.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
    }, M.prototype.init = function(t, e, s, i, r) {
        this.elem = t, this.arr = e, this.pos = s, this.elemsData = i, this._currentCopies = 0, 
        this._elements = [], this._groups = [], this.dynamicProperties = [], this.frameId = -1, 
        this.initModifierProperties(t, e[s]);
        for (var a = 0; s > 0; ) s -= 1, this._elements.unshift(e[s]), a += 1;
        this.dynamicProperties.length ? (this.k = !0, r.push(this)) : this.getValue(!0);
    }, M.prototype.resetElements = function(t) {
        var e, s = t.length;
        for (e = 0; e < s; e += 1) t[e]._processed = !1, "gr" === t[e].ty && this.resetElements(t[e].it);
    }, M.prototype.cloneElements = function(t) {
        t.length;
        var e = JSON.parse(JSON.stringify(t));
        return this.resetElements(e), e;
    }, M.prototype.changeGroupRender = function(t, e) {
        var s, i = t.length;
        for (s = 0; s < i; s += 1) t[s]._render = e, "gr" === t[s].ty && this.changeGroupRender(t[s].it, e);
    }, M.prototype.processShapes = function(t) {
        if (this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, 
        this.dynamicProperties.length || t || (this.mdf = !1), this.mdf)) {
            var e = Math.ceil(this.c.v);
            if (this._groups.length < e) {
                for (;this._groups.length < e; ) {
                    var s = {
                        it: this.cloneElements(this._elements),
                        ty: "gr"
                    };
                    s.it.push({
                        a: {
                            a: 0,
                            ix: 1,
                            k: [ 0, 0 ]
                        },
                        nm: "Transform",
                        o: {
                            a: 0,
                            ix: 7,
                            k: 100
                        },
                        p: {
                            a: 0,
                            ix: 2,
                            k: [ 0, 0 ]
                        },
                        r: {
                            a: 0,
                            ix: 6,
                            k: 0
                        },
                        s: {
                            a: 0,
                            ix: 3,
                            k: [ 100, 100 ]
                        },
                        sa: {
                            a: 0,
                            ix: 5,
                            k: 0
                        },
                        sk: {
                            a: 0,
                            ix: 4,
                            k: 0
                        },
                        ty: "tr"
                    }), this.arr.splice(0, 0, s), this._groups.splice(0, 0, s), this._currentCopies += 1;
                }
                this.elem.reloadShapes();
            }
            var i, r, a = 0;
            for (i = 0; i <= this._groups.length - 1; i += 1) r = a < e, this._groups[i]._render = r, 
            this.changeGroupRender(this._groups[i].it, r), a += 1;
            this._currentCopies = e, this.elem.firstFrame = !0;
            var n = this.o.v, h = n % 1, o = n > 0 ? Math.floor(n) : Math.ceil(n), p = (this.tr.v.props, 
            this.pMatrix.props), l = this.rMatrix.props, f = this.sMatrix.props;
            this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), 
            this.matrix.reset();
            var m = 0;
            if (n > 0) {
                for (;m < o; ) this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), 
                m += 1;
                h && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, h, !1), 
                m += h);
            } else if (n < 0) {
                for (;m > o; ) this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0), 
                m -= 1;
                h && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -h, !0), 
                m -= h);
            }
            i = 1 === this.data.m ? 0 : this._currentCopies - 1;
            var d = 1 === this.data.m ? 1 : -1;
            for (a = this._currentCopies; a; ) {
                if (0 !== m) {
                    (0 !== i && 1 === d || i !== this._currentCopies - 1 && -1 === d) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), 
                    this.matrix.transform(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7], l[8], l[9], l[10], l[11], l[12], l[13], l[14], l[15]), 
                    this.matrix.transform(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8], f[9], f[10], f[11], f[12], f[13], f[14], f[15]), 
                    this.matrix.transform(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10], p[11], p[12], p[13], p[14], p[15]);
                    y = (g = (u = this.elemsData[i].it)[u.length - 1].transform.mProps.v.props).length;
                    for (c = 0; c < y; c += 1) g[c] = this.matrix.props[c];
                    this.matrix.reset();
                } else {
                    this.matrix.reset();
                    var c, u = this.elemsData[i].it, g = u[u.length - 1].transform.mProps.v.props, y = g.length;
                    for (c = 0; c < y; c += 1) g[c] = this.matrix.props[c];
                }
                m += 1, a -= 1, i += d;
            }
        }
    }, M.prototype.addShape = function() {}, Tt.registerModifier("rp", M), x.prototype.addShape = function(t) {
        this._length === this._maxLength && (this.shapes = this.shapes.concat(Array.apply(null, {
            length: this._maxLength
        })), this._maxLength *= 2), this.shapes[this._length] = t, this._length += 1;
    }, x.prototype.releaseShapes = function() {
        var t;
        for (t = 0; t < this._length; t += 1) Rt.release(this.shapes[t]);
        this._length = 0;
    };
    var It = function() {
        function t() {
            this.loadedAssets += 1, this.loadedAssets, this.totalImages;
        }
        function e(t) {
            var e = "";
            if (this.assetsPath) {
                var s = t.p;
                -1 !== s.indexOf("images/") && (s = s.split("/")[1]), e = this.assetsPath + s;
            } else e = this.path, e += t.u ? t.u : "", e += t.p;
            return e;
        }
        function s(e) {
            var s = document.createElement("img");
            s.addEventListener("load", t.bind(this), !1), s.addEventListener("error", t.bind(this), !1), 
            s.src = e;
        }
        function i(t) {
            this.totalAssets = t.length;
            var i;
            for (i = 0; i < this.totalAssets; i += 1) t[i].layers || (s.bind(this)(e.bind(this)(t[i])), 
            this.totalImages += 1);
        }
        function r(t) {
            this.path = t || "";
        }
        function a(t) {
            this.assetsPath = t || "";
        }
        return function() {
            this.loadAssets = i, this.setAssetsPath = a, this.setPath = r, this.assetsPath = "", 
            this.path = "", this.totalAssets = 0, this.totalImages = 0, this.loadedAssets = 0;
        };
    }(), Lt = function() {
        var t = {
            maskType: !0
        };
        return (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (t.maskType = !1), 
        t;
    }(), Nt = function() {
        function t(t) {
            var e = document.createElementNS(ct, "filter");
            return e.setAttribute("id", t), e.setAttribute("filterUnits", "objectBoundingBox"), 
            e.setAttribute("x", "0%"), e.setAttribute("y", "0%"), e.setAttribute("width", "100%"), 
            e.setAttribute("height", "100%"), e;
        }
        function e() {
            var t = document.createElementNS(ct, "feColorMatrix");
            return t.setAttribute("type", "matrix"), t.setAttribute("color-interpolation-filters", "sRGB"), 
            t.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 0 1"), t;
        }
        var s = {};
        return s.createFilter = t, s.createAlphaToLuminanceFilter = e, s;
    }(), Vt = function() {
        function t(t) {
            return t.concat(Array.apply(null, {
                length: t.length
            }));
        }
        return {
            double: t
        };
    }(), zt = function() {
        function t() {
            return i ? a[i -= 1] : [ .1, .1 ];
        }
        function e(t) {
            i === r && (a = Vt.double(a), r *= 2), a[i] = t, i += 1;
        }
        var s = {
            newPoint: t,
            release: e
        }, i = 0, r = 8, a = Array.apply(null, {
            length: r
        });
        return s;
    }(), Rt = function() {
        function t() {
            return a ? h[a -= 1] : new A();
        }
        function e(t) {
            a === n && (h = Vt.double(h), n *= 2);
            var e, s = t._length;
            for (e = 0; e < s; e += 1) zt.release(t.v[e]), zt.release(t.i[e]), zt.release(t.o[e]), 
            t.v[e] = null, t.i[e] = null, t.o[e] = null;
            t._length = 0, t.c = !1, h[a] = t, a += 1;
        }
        function s(t, s) {
            for (;s--; ) e(t[s]);
        }
        function i(e, s) {
            var i, r = e._length, a = t();
            a._length = e._length, a.c = e.c;
            var n;
            for (i = 0; i < r; i += 1) s ? (n = s.applyToPointArray(e.v[i][0], e.v[i][1], 0, 2), 
            a.setXYAt(n[0], n[1], "v", i), zt.release(n), n = s.applyToPointArray(e.o[i][0], e.o[i][1], 0, 2), 
            a.setXYAt(n[0], n[1], "o", i), zt.release(n), n = s.applyToPointArray(e.i[i][0], e.i[i][1], 0, 2), 
            a.setXYAt(n[0], n[1], "i", i), zt.release(n)) : a.setTripleAt(e.v[i][0], e.v[i][1], e.o[i][0], e.o[i][1], e.i[i][0], e.i[i][1], i);
            return a;
        }
        var r = {
            clone: i,
            newShape: t,
            release: e,
            releaseArray: s
        }, a = 0, n = 4, h = Array.apply(null, {
            length: n
        });
        return r;
    }(), Ot = function() {
        function t() {
            return r ? n[r -= 1] : new x();
        }
        function e(t) {
            var e, s = t._length;
            for (e = 0; e < s; e += 1) Rt.release(t.shapes[e]);
            t._length = 0, r === a && (n = Vt.double(n), a *= 2), n[r] = t, r += 1;
        }
        function s(t, s) {
            e(t), r === a && (n = Vt.double(n), a *= 2), n[r] = t, r += 1;
        }
        var i = {
            newShapeCollection: t,
            release: e,
            clone: s
        }, r = 0, a = 4, n = Array.apply(null, {
            length: a
        });
        return i;
    }();
    F.prototype.checkLayers = function(t) {
        var e, s, i = this.layers.length;
        for (this.completeLayers = !0, e = i - 1; e >= 0; e--) this.elements[e] || (s = this.layers[e]).ip - s.st <= t - this.layers[e].st && s.op - s.st > t - this.layers[e].st && this.buildItem(e), 
        this.completeLayers = !!this.elements[e] && this.completeLayers;
        this.checkPendingElements();
    }, F.prototype.createItem = function(t) {
        switch (t.ty) {
          case 2:
            return this.createImage(t);

          case 0:
            return this.createComp(t);

          case 1:
            return this.createSolid(t);

          case 4:
            return this.createShape(t);

          case 5:
            return this.createText(t);

          case 13:
            return this.createCamera(t);

          case 99:
            return null;
        }
        return this.createBase(t);
    }, F.prototype.createCamera = function() {
        throw new Error("You're using a 3d camera. Try the html renderer.");
    }, F.prototype.buildAllItems = function() {
        var t, e = this.layers.length;
        for (t = 0; t < e; t += 1) this.buildItem(t);
        this.checkPendingElements();
    }, F.prototype.includeLayers = function(t) {
        this.completeLayers = !1;
        var e, s, i = t.length, r = this.layers.length;
        for (e = 0; e < i; e += 1) for (s = 0; s < r; ) {
            if (this.layers[s].id == t[e].id) {
                this.layers[s] = t[e];
                break;
            }
            s += 1;
        }
    }, F.prototype.setProjectInterface = function(t) {
        this.globalData.projectInterface = t;
    }, F.prototype.initItems = function() {
        this.globalData.progressiveLoad || this.buildAllItems();
    }, F.prototype.buildElementParenting = function(t, e, s) {
        s = s || [];
        for (var i = this.elements, r = this.layers, a = 0, n = r.length; a < n; ) r[a].ind == e && (i[a] && !0 !== i[a] ? void 0 !== r[a].parent ? (s.push(i[a]), 
        i[a]._isParent = !0, this.buildElementParenting(t, r[a].parent, s)) : (s.push(i[a]), 
        i[a]._isParent = !0, t.setHierarchy(s)) : (this.buildItem(a), this.addPendingElement(t))), 
        a += 1;
    }, F.prototype.addPendingElement = function(t) {
        this.pendingElements.push(t);
    }, k(F, C), C.prototype.createBase = function(t) {
        return new T(t, this.layerElement, this.globalData, this);
    }, C.prototype.createShape = function(t) {
        return new I(t, this.layerElement, this.globalData, this);
    }, C.prototype.createText = function(t) {
        return new N(t, this.layerElement, this.globalData, this);
    }, C.prototype.createImage = function(t) {
        return new q(t, this.layerElement, this.globalData, this);
    }, C.prototype.createComp = function(t) {
        return new W(t, this.layerElement, this.globalData, this);
    }, C.prototype.createSolid = function(t) {
        return new H(t, this.layerElement, this.globalData, this);
    }, C.prototype.configAnimation = function(t) {
        this.layerElement = document.createElementNS(ct, "svg"), this.layerElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), 
        this.layerElement.setAttribute("width", t.w), this.layerElement.setAttribute("height", t.h), 
        this.layerElement.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.layerElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), 
        this.layerElement.style.width = "100%", this.layerElement.style.height = "100%", 
        this.animationItem.wrapper.appendChild(this.layerElement);
        var e = document.createElementNS(ct, "defs");
        this.globalData.defs = e, this.layerElement.appendChild(e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), 
        this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), 
        this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.globalData.frameId = 0, 
        this.globalData.nm = t.nm, this.globalData.compSize = {
            w: t.w,
            h: t.h
        }, this.data = t, this.globalData.frameRate = t.fr;
        var s = document.createElementNS(ct, "clipPath"), i = document.createElementNS(ct, "rect");
        i.setAttribute("width", t.w), i.setAttribute("height", t.h), i.setAttribute("x", 0), 
        i.setAttribute("y", 0);
        var r = "animationMask_" + f(10);
        s.setAttribute("id", r), s.appendChild(i);
        var a = document.createElementNS(ct, "g");
        a.setAttribute("clip-path", "url(#" + r + ")"), this.layerElement.appendChild(a), 
        e.appendChild(s), this.layerElement = a, this.layers = t.layers, this.globalData.fontManager = new Ct(), 
        this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, e), 
        this.elements = Array.apply(null, {
            length: t.layers.length
        });
    }, C.prototype.destroy = function() {
        this.animationItem.wrapper.innerHTML = "", this.layerElement = null, this.globalData.defs = null;
        var t, e = this.layers ? this.layers.length : 0;
        for (t = 0; t < e; t++) this.elements[t] && this.elements[t].destroy();
        this.elements.length = 0, this.destroyed = !0, this.animationItem = null;
    }, C.prototype.updateContainerSize = function() {}, C.prototype.buildItem = function(t) {
        var e = this.elements;
        if (!e[t] && 99 != this.layers[t].ty) {
            e[t] = !0;
            var s = this.createItem(this.layers[t]);
            e[t] = s, mt && (0 === this.layers[t].ty && this.globalData.projectInterface.registerComposition(s), 
            s.initExpressions()), this.appendElementInPos(s, t), this.layers[t].tt && (this.elements[t - 1] && !0 !== this.elements[t - 1] ? s.setMatte(e[t - 1].layerId) : (this.buildItem(t - 1), 
            this.addPendingElement(s)));
        }
    }, C.prototype.checkPendingElements = function() {
        for (;this.pendingElements.length; ) {
            var t = this.pendingElements.pop();
            if (t.checkParenting(), t.data.tt) for (var e = 0, s = this.elements.length; e < s; ) {
                if (this.elements[e] === t) {
                    t.setMatte(this.elements[e - 1].layerId);
                    break;
                }
                e += 1;
            }
        }
    }, C.prototype.renderFrame = function(t) {
        if (this.renderedFrame != t && !this.destroyed) {
            null === t ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, 
            this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = t;
            var e, s = this.layers.length;
            for (this.completeLayers || this.checkLayers(t), e = s - 1; e >= 0; e--) (this.completeLayers || this.elements[e]) && this.elements[e].prepareFrame(t - this.layers[e].st);
            for (e = s - 1; e >= 0; e--) (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame();
        }
    }, C.prototype.appendElementInPos = function(t, e) {
        var s = t.getBaseElement();
        if (s) {
            for (var i, r = 0; r < e; ) this.elements[r] && !0 !== this.elements[r] && this.elements[r].getBaseElement() && (i = this.elements[r].getBaseElement()), 
            r += 1;
            i ? this.layerElement.insertBefore(s, i) : this.layerElement.appendChild(s);
        }
    }, C.prototype.hide = function() {
        this.layerElement.style.display = "none";
    }, C.prototype.show = function() {
        this.layerElement.style.display = "block";
    }, C.prototype.searchExtraCompositions = function(t) {
        var e, s = t.length, i = document.createElementNS(ct, "g");
        for (e = 0; e < s; e += 1) if (t[e].xt) {
            var r = this.createComp(t[e], i, this.globalData.comp, null);
            r.initExpressions(), this.globalData.projectInterface.registerComposition(r);
        }
    }, D.prototype.getMaskProperty = function(t) {
        return this.viewData[t].prop;
    }, D.prototype.prepareFrame = function() {
        var t, e = this.dynamicProperties.length;
        for (t = 0; t < e; t += 1) this.dynamicProperties[t].getValue();
    }, D.prototype.renderFrame = function(t) {
        var e, s = this.masksProperties.length;
        for (e = 0; e < s; e++) if ((this.viewData[e].prop.mdf || this.firstFrame) && this.drawPath(this.masksProperties[e], this.viewData[e].prop.v, this.viewData[e]), 
        (this.viewData[e].op.mdf || this.firstFrame) && this.viewData[e].elem.setAttribute("fill-opacity", this.viewData[e].op.v), 
        "n" !== this.masksProperties[e].mode && (this.viewData[e].invRect && (this.element.finalTransform.mProp.mdf || this.firstFrame) && (this.viewData[e].invRect.setAttribute("x", -t.props[12]), 
        this.viewData[e].invRect.setAttribute("y", -t.props[13])), this.storedData[e].x && (this.storedData[e].x.mdf || this.firstFrame))) {
            var i = this.storedData[e].expan;
            this.storedData[e].x.v < 0 ? ("erode" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "erode", 
            this.storedData[e].elem.setAttribute("filter", "url(#" + this.storedData[e].filterId + ")")), 
            i.setAttribute("radius", -this.storedData[e].x.v)) : ("dilate" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "dilate", 
            this.storedData[e].elem.setAttribute("filter", null)), this.storedData[e].elem.setAttribute("stroke-width", 2 * this.storedData[e].x.v));
        }
        this.firstFrame = !1;
    }, D.prototype.getMaskelement = function() {
        return this.maskElement;
    }, D.prototype.createLayerSolidPath = function() {
        var t = "M0,0 ";
        return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, 
        t += " h-" + this.globalData.compSize.w, t += " v-" + this.globalData.compSize.h + " ";
    }, D.prototype.drawPath = function(t, e, s) {
        var i, r, a = " M" + e.v[0][0] + "," + e.v[0][1];
        for (r = e._length, i = 1; i < r; i += 1) a += " C" + dt(e.o[i - 1][0]) + "," + dt(e.o[i - 1][1]) + " " + dt(e.i[i][0]) + "," + dt(e.i[i][1]) + " " + dt(e.v[i][0]) + "," + dt(e.v[i][1]);
        e.c && r > 1 && (a += " C" + dt(e.o[i - 1][0]) + "," + dt(e.o[i - 1][1]) + " " + dt(e.i[0][0]) + "," + dt(e.i[0][1]) + " " + dt(e.v[0][0]) + "," + dt(e.v[0][1])), 
        s.lastPath !== a && (s.elem && (e.c ? t.inv ? s.elem.setAttribute("d", this.solidPath + a) : s.elem.setAttribute("d", a) : s.elem.setAttribute("d", "")), 
        s.lastPath = a);
    }, D.prototype.getMask = function(t) {
        for (var e = 0, s = this.masksProperties.length; e < s; ) {
            if (this.masksProperties[e].nm === t) return {
                maskPath: this.viewData[e].prop.pv
            };
            e += 1;
        }
    }, D.prototype.destroy = function() {
        this.element = null, this.globalData = null, this.maskElement = null, this.data = null, 
        this.paths = null, this.masksProperties = null;
    }, _.prototype.checkMasks = function() {
        if (!this.data.hasMask) return !1;
        for (var t = 0, e = this.data.masksProperties.length; t < e; ) {
            if ("n" !== this.data.masksProperties[t].mode && !1 !== this.data.masksProperties[t].cl) return !0;
            t += 1;
        }
        return !1;
    }, _.prototype.checkParenting = function() {
        void 0 !== this.data.parent && this.comp.buildElementParenting(this, this.data.parent);
    }, _.prototype.prepareFrame = function(t) {
        this.data.ip - this.data.st <= t && this.data.op - this.data.st > t ? !0 !== this.isVisible && (this.elemMdf = !0, 
        this.globalData.mdf = !0, this.isVisible = !0, this.firstFrame = !0, this.data.hasMask && (this.maskManager.firstFrame = !0)) : !1 !== this.isVisible && (this.elemMdf = !0, 
        this.globalData.mdf = !0, this.isVisible = !1);
        var e, s = this.dynamicProperties.length;
        for (e = 0; e < s; e += 1) (this.isVisible || this._isParent && "transform" === this.dynamicProperties[e].type) && (this.dynamicProperties[e].getValue(), 
        this.dynamicProperties[e].mdf && (this.elemMdf = !0, this.globalData.mdf = !0));
        return this.data.hasMask && this.isVisible && this.maskManager.prepareFrame(t * this.data.sr), 
        this.currentFrameNum = t * this.data.sr, this.isVisible;
    }, _.prototype.globalToLocal = function(t) {
        var e = [];
        e.push(this.finalTransform);
        for (var s = !0, i = this.comp; s; ) i.finalTransform ? (i.data.hasMask && e.splice(0, 0, i.finalTransform), 
        i = i.comp) : s = !1;
        var r, a, n = e.length;
        for (r = 0; r < n; r += 1) a = e[r].mat.applyToPointArray(0, 0, 0), t = [ t[0] - a[0], t[1] - a[1], 0 ];
        return t;
    }, _.prototype.initExpressions = function() {
        this.layerInterface = LayerExpressionInterface(this), this.data.hasMask && this.layerInterface.registerMaskInterface(this.maskManager);
        var t = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
        this.layerInterface.registerEffectsInterface(t), 0 === this.data.ty || this.data.xt ? this.compInterface = CompExpressionInterface(this) : 4 === this.data.ty ? this.layerInterface.shapeInterface = ShapeExpressionInterface.createShapeInterface(this.shapesData, this.itemsData, this.layerInterface) : 5 === this.data.ty && (this.layerInterface.textInterface = TextExpressionInterface(this));
    }, _.prototype.setBlendMode = function() {
        var t = "";
        switch (this.data.bm) {
          case 1:
            t = "multiply";
            break;

          case 2:
            t = "screen";
            break;

          case 3:
            t = "overlay";
            break;

          case 4:
            t = "darken";
            break;

          case 5:
            t = "lighten";
            break;

          case 6:
            t = "color-dodge";
            break;

          case 7:
            t = "color-burn";
            break;

          case 8:
            t = "hard-light";
            break;

          case 9:
            t = "soft-light";
            break;

          case 10:
            t = "difference";
            break;

          case 11:
            t = "exclusion";
            break;

          case 12:
            t = "hue";
            break;

          case 13:
            t = "saturation";
            break;

          case 14:
            t = "color";
            break;

          case 15:
            t = "luminosity";
        }
        (this.baseElement || this.layerElement).style["mix-blend-mode"] = t;
    }, _.prototype.init = function() {
        this.data.sr || (this.data.sr = 1), this.dynamicProperties = [], this.data.ef && (this.effects = new EffectsManager(this.data, this, this.dynamicProperties)), 
        this.hidden = !1, this.firstFrame = !0, this.isVisible = !1, this._isParent = !1, 
        this.currentFrameNum = -99999, this.lastNum = -99999, this.data.ks && (this.finalTransform = {
            mProp: Dt.getProp(this, this.data.ks, 2, null, this.dynamicProperties),
            matMdf: !1,
            opMdf: !1,
            mat: new b(),
            opacity: 1
        }, this.data.ao && (this.finalTransform.mProp.autoOriented = !0), this.finalTransform.op = this.finalTransform.mProp.o, 
        this.transform = this.finalTransform.mProp, 11 !== this.data.ty && this.createElements(), 
        this.data.hasMask && this.addMasks(this.data)), this.elemMdf = !1;
    }, _.prototype.getType = function() {
        return this.type;
    }, _.prototype.resetHierarchy = function() {
        this.hierarchy ? this.hierarchy.length = 0 : this.hierarchy = [];
    }, _.prototype.getHierarchy = function() {
        return this.hierarchy || (this.hierarchy = []), this.hierarchy;
    }, _.prototype.setHierarchy = function(t) {
        this.hierarchy = t;
    }, _.prototype.getLayerSize = function() {
        return 5 === this.data.ty ? {
            w: this.data.textData.width,
            h: this.data.textData.height
        } : {
            w: this.data.width,
            h: this.data.height
        };
    }, _.prototype.hide = function() {}, _.prototype.mHelper = new b(), w(_, T), T.prototype.createElements = function() {
        this.layerElement = document.createElementNS(ct, "g"), this.transformedElement = this.layerElement, 
        this.data.hasMask && (this.maskedElement = this.layerElement);
        var t = null;
        if (this.data.td) {
            if (3 == this.data.td || 1 == this.data.td) {
                var e = document.createElementNS(ct, "mask");
                if (e.setAttribute("id", this.layerId), e.setAttribute("mask-type", 3 == this.data.td ? "luminance" : "alpha"), 
                e.appendChild(this.layerElement), t = e, this.globalData.defs.appendChild(e), !Lt.maskType && 1 == this.data.td) {
                    e.setAttribute("mask-type", "luminance");
                    var s = f(10), i = Nt.createFilter(s);
                    this.globalData.defs.appendChild(i), i.appendChild(Nt.createAlphaToLuminanceFilter()), 
                    (o = document.createElementNS(ct, "g")).appendChild(this.layerElement), t = o, e.appendChild(o), 
                    o.setAttribute("filter", "url(#" + s + ")");
                }
            } else if (2 == this.data.td) {
                var r = document.createElementNS(ct, "mask");
                r.setAttribute("id", this.layerId), r.setAttribute("mask-type", "alpha");
                var a = document.createElementNS(ct, "g");
                r.appendChild(a);
                var s = f(10), i = Nt.createFilter(s), n = document.createElementNS(ct, "feColorMatrix");
                n.setAttribute("type", "matrix"), n.setAttribute("color-interpolation-filters", "sRGB"), 
                n.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 -1 1"), i.appendChild(n), 
                this.globalData.defs.appendChild(i);
                var h = document.createElementNS(ct, "rect");
                if (h.setAttribute("width", this.comp.data.w), h.setAttribute("height", this.comp.data.h), 
                h.setAttribute("x", "0"), h.setAttribute("y", "0"), h.setAttribute("fill", "#ffffff"), 
                h.setAttribute("opacity", "0"), a.setAttribute("filter", "url(#" + s + ")"), a.appendChild(h), 
                a.appendChild(this.layerElement), t = a, !Lt.maskType) {
                    r.setAttribute("mask-type", "luminance"), i.appendChild(Nt.createAlphaToLuminanceFilter());
                    var o = document.createElementNS(ct, "g");
                    a.appendChild(h), o.appendChild(this.layerElement), t = o, a.appendChild(o);
                }
                this.globalData.defs.appendChild(r);
            }
        } else (this.data.hasMask || this.data.tt) && this.data.tt ? (this.matteElement = document.createElementNS(ct, "g"), 
        this.matteElement.appendChild(this.layerElement), t = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
        if (!this.data.ln && !this.data.cl || 4 !== this.data.ty && 0 !== this.data.ty || (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), 
        this.data.cl && this.layerElement.setAttribute("class", this.data.cl)), 0 === this.data.ty) {
            var p = document.createElementNS(ct, "clipPath"), l = document.createElementNS(ct, "path");
            l.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
            var m = "cp_" + f(8);
            if (p.setAttribute("id", m), p.appendChild(l), this.globalData.defs.appendChild(p), 
            this.checkMasks()) {
                var d = document.createElementNS(ct, "g");
                d.setAttribute("clip-path", "url(#" + m + ")"), d.appendChild(this.layerElement), 
                this.transformedElement = d, t ? t.appendChild(this.transformedElement) : this.baseElement = this.transformedElement;
            } else this.layerElement.setAttribute("clip-path", "url(#" + m + ")");
        }
        0 !== this.data.bm && this.setBlendMode(), this.layerElement !== this.parentContainer && (this.placeholder = null), 
        this.data.ef && (this.effectsManager = new G(this)), this.checkParenting();
    }, T.prototype.setBlendMode = _.prototype.setBlendMode, T.prototype.renderFrame = function(t) {
        if (3 === this.data.ty || this.data.hd || !this.isVisible) return !1;
        this.lastNum = this.currentFrameNum, this.finalTransform.opMdf = this.firstFrame || this.finalTransform.op.mdf, 
        this.finalTransform.matMdf = this.firstFrame || this.finalTransform.mProp.mdf, this.finalTransform.opacity = this.finalTransform.op.v;
        var e, s = this.finalTransform.mat;
        if (this.hierarchy) {
            var i = 0, r = this.hierarchy.length;
            if (!this.finalTransform.matMdf) for (;i < r; ) {
                if (this.hierarchy[i].finalTransform.mProp.mdf) {
                    this.finalTransform.matMdf = !0;
                    break;
                }
                i += 1;
            }
            if (this.finalTransform.matMdf) for (e = this.finalTransform.mProp.v.props, s.cloneFromProps(e), 
            i = 0; i < r; i += 1) e = this.hierarchy[i].finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]);
        } else this.isVisible && (s = this.finalTransform.mProp.v);
        return this.finalTransform.matMdf && this.layerElement && this.transformedElement.setAttribute("transform", s.to2dCSS()), 
        this.finalTransform.opMdf && this.layerElement && (this.finalTransform.op.v <= 0 ? !this.isTransparent && this.globalData.renderConfig.hideOnTransparent && (this.isTransparent = !0, 
        this.hide()) : this.hidden && this.isTransparent && (this.isTransparent = !1, this.show()), 
        this.transformedElement.setAttribute("opacity", this.finalTransform.op.v)), this.data.hasMask && this.maskManager.renderFrame(s), 
        this.effectsManager && this.effectsManager.renderFrame(this.firstFrame), this.isVisible;
    }, T.prototype.destroy = function() {
        this.layerElement = null, this.parentContainer = null, this.matteElement && (this.matteElement = null), 
        this.maskManager && this.maskManager.destroy();
    }, T.prototype.getBaseElement = function() {
        return this.baseElement;
    }, T.prototype.addMasks = function(t) {
        this.maskManager = new D(t, this, this.globalData);
    }, T.prototype.setMatte = function(t) {
        this.matteElement && this.matteElement.setAttribute("mask", "url(#" + t + ")");
    }, T.prototype.setMatte = function(t) {
        this.matteElement && this.matteElement.setAttribute("mask", "url(#" + t + ")");
    }, T.prototype.hide = function() {
        this.hidden || (this.layerElement.style.display = "none", this.hidden = !0);
    }, T.prototype.show = function() {
        this.isVisible && !this.isTransparent && (this.hidden = !1, this.layerElement.style.display = "block");
    }, w(T, I), I.prototype.identityMatrix = new b(), I.prototype.lcEnum = {
        "1": "butt",
        "2": "round",
        "3": "butt"
    }, I.prototype.ljEnum = {
        "1": "miter",
        "2": "round",
        "3": "butt"
    }, I.prototype.searchProcessedElement = function(t) {
        for (var e = this.processedElements.length; e; ) if (e -= 1, this.processedElements[e].elem === t) return this.processedElements[e].pos;
        return 0;
    }, I.prototype.addProcessedElement = function(t, e) {
        for (var s = this.processedElements.length; s; ) if (s -= 1, this.processedElements[s].elem === t) {
            this.processedElements[s].pos = e;
            break;
        }
        0 === s && this.processedElements.push({
            elem: t,
            pos: e
        });
    }, I.prototype.buildExpressionInterface = function() {}, I.prototype.createElements = function() {
        this._parent.createElements.call(this), this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, this.dynamicProperties, 0, [], !0), 
        this.data.hd && !this.data.td || s(this.layerElement);
    }, I.prototype.setGradientData = function(t, e, s) {
        var i, r = "gr_" + f(10);
        (i = 1 === e.t ? document.createElementNS(ct, "linearGradient") : document.createElementNS(ct, "radialGradient")).setAttribute("id", r), 
        i.setAttribute("spreadMethod", "pad"), i.setAttribute("gradientUnits", "userSpaceOnUse");
        var a, n, h, o = [];
        for (h = 4 * e.g.p, n = 0; n < h; n += 4) a = document.createElementNS(ct, "stop"), 
        i.appendChild(a), o.push(a);
        t.setAttribute("gf" === e.ty ? "fill" : "stroke", "url(#" + r + ")"), this.globalData.defs.appendChild(i), 
        s.gf = i, s.cst = o;
    }, I.prototype.setGradientOpacity = function(t, e, s) {
        if (t.g.k.k[0].s && t.g.k.k[0].s.length > 4 * t.g.p || t.g.k.k.length > 4 * t.g.p) {
            var i, r, a, n, h = document.createElementNS(ct, "mask"), o = document.createElementNS(ct, "path");
            h.appendChild(o);
            var p = "op_" + f(10), l = "mk_" + f(10);
            h.setAttribute("id", l), (i = 1 === t.t ? document.createElementNS(ct, "linearGradient") : document.createElementNS(ct, "radialGradient")).setAttribute("id", p), 
            i.setAttribute("spreadMethod", "pad"), i.setAttribute("gradientUnits", "userSpaceOnUse"), 
            n = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length;
            var m = [];
            for (a = 4 * t.g.p; a < n; a += 2) (r = document.createElementNS(ct, "stop")).setAttribute("stop-color", "rgb(255,255,255)"), 
            i.appendChild(r), m.push(r);
            return o.setAttribute("gf" === t.ty ? "fill" : "stroke", "url(#" + p + ")"), this.globalData.defs.appendChild(i), 
            this.globalData.defs.appendChild(h), e.of = i, e.ost = m, s.msElem = o, l;
        }
    }, I.prototype.createStyleElement = function(t, e, s) {
        var i = {}, r = {
            data: t,
            type: t.ty,
            d: "",
            ld: "",
            lvl: e,
            mdf: !1,
            closed: !1
        }, a = document.createElementNS(ct, "path");
        if (i.o = Dt.getProp(this, t.o, 0, .01, s), ("st" == t.ty || "gs" == t.ty) && (a.setAttribute("stroke-linecap", this.lcEnum[t.lc] || "round"), 
        a.setAttribute("stroke-linejoin", this.ljEnum[t.lj] || "round"), a.setAttribute("fill-opacity", "0"), 
        1 == t.lj && a.setAttribute("stroke-miterlimit", t.ml), i.w = Dt.getProp(this, t.w, 0, null, s), 
        t.d)) {
            var n = Dt.getDashProp(this, t.d, "svg", s);
            n.k || (a.setAttribute("stroke-dasharray", n.dasharray), a.setAttribute("stroke-dashoffset", n.dashoffset)), 
            i.d = n;
        }
        if ("fl" == t.ty || "st" == t.ty) i.c = Dt.getProp(this, t.c, 1, 255, s); else {
            i.g = Dt.getGradientProp(this, t.g, s), 2 == t.t && (i.h = Dt.getProp(this, t.h, 1, .01, s), 
            i.a = Dt.getProp(this, t.a, 1, Pt, s)), i.s = Dt.getProp(this, t.s, 1, null, s), 
            i.e = Dt.getProp(this, t.e, 1, null, s), this.setGradientData(a, t, i, r);
            var h = this.setGradientOpacity(t, i, r);
            h && a.setAttribute("mask", "url(#" + h + ")");
        }
        return i.elem = a, 2 === t.r && a.setAttribute("fill-rule", "evenodd"), t.ln && a.setAttribute("id", t.ln), 
        t.cl && a.setAttribute("class", t.cl), r.pElem = a, this.stylesList.push(r), i.style = r, 
        i;
    }, I.prototype.createGroupElement = function(t) {
        var e = {
            it: [],
            prevViewData: []
        }, s = document.createElementNS(ct, "g");
        return e.gr = s, t.ln && e.gr.setAttribute("id", t.ln), e;
    }, I.prototype.createTransformElement = function(t, e) {
        return {
            transform: {
                op: Dt.getProp(this, t.o, 0, .01, e),
                mProps: Dt.getProp(this, t, 2, null, e)
            },
            elements: []
        };
    }, I.prototype.createShapeElement = function(t, e, s, i) {
        var r = {
            elements: [],
            caches: [],
            styles: [],
            transformers: e,
            lStr: ""
        }, a = 4;
        return "rc" == t.ty ? a = 5 : "el" == t.ty ? a = 6 : "sr" == t.ty && (a = 7), r.sh = _t.getShapeProp(this, t, a, i), 
        r.lvl = s, this.shapes.push(r.sh), this.addShapeToModifiers(r), r;
    };
    I.prototype.setElementStyles = function() {
        var t, e = this.stylesList.length, s = [];
        for (t = 0; t < e; t += 1) this.stylesList[t].closed || s.push(this.stylesList[t]);
        return s;
    }, I.prototype.reloadShapes = function() {
        this.firstFrame = !0;
        e = this.itemsData.length;
        for (t = 0; t < e; t += 1) this.prevViewData[t] = this.itemsData[t];
        this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, this.dynamicProperties, 0, [], !0);
        var t, e = this.dynamicProperties.length;
        for (t = 0; t < e; t += 1) this.dynamicProperties[t].getValue();
        this.renderModifiers();
    }, I.prototype.searchShapes = function(t, e, s, i, r, a, n, h) {
        var o, p, l, f, m, d, c = [].concat(n), u = t.length - 1, g = [], y = [];
        for (o = u; o >= 0; o -= 1) {
            if (d = this.searchProcessedElement(t[o]), d ? e[o] = s[d - 1] : t[o]._render = h, 
            "fl" == t[o].ty || "st" == t[o].ty || "gf" == t[o].ty || "gs" == t[o].ty) d ? e[o].style.closed = !1 : e[o] = this.createStyleElement(t[o], a, r), 
            t[o]._render && i.appendChild(e[o].elem), g.push(e[o].style); else if ("gr" == t[o].ty) {
                if (d) for (l = e[o].it.length, p = 0; p < l; p += 1) e[o].prevViewData[p] = e[o].it[p]; else e[o] = this.createGroupElement(t[o]);
                this.searchShapes(t[o].it, e[o].it, e[o].prevViewData, e[o].gr, r, a + 1, c, h), 
                t[o]._render && i.appendChild(e[o].gr);
            } else "tr" == t[o].ty ? (d || (e[o] = this.createTransformElement(t[o], r)), f = e[o].transform, 
            c.push(f)) : "sh" == t[o].ty || "rc" == t[o].ty || "el" == t[o].ty || "sr" == t[o].ty ? (d || (e[o] = this.createShapeElement(t[o], c, a, r)), 
            e[o].elements = this.setElementStyles()) : "tm" == t[o].ty || "rd" == t[o].ty || "ms" == t[o].ty ? (d ? (m = e[o]).closed = !1 : ((m = Tt.getModifier(t[o].ty)).init(this, t[o], r), 
            e[o] = m, this.shapeModifiers.push(m)), y.push(m)) : "rp" == t[o].ty && (d ? (m = e[o]).closed = !0 : (m = Tt.getModifier(t[o].ty), 
            e[o] = m, m.init(this, t, o, e, r), this.shapeModifiers.push(m), h = !1), y.push(m));
            this.addProcessedElement(t[o], o + 1);
        }
        for (u = g.length, o = 0; o < u; o += 1) g[o].closed = !0;
        for (u = y.length, o = 0; o < u; o += 1) y[o].closed = !0;
    }, I.prototype.addShapeToModifiers = function(t) {
        var e, s = this.shapeModifiers.length;
        for (e = 0; e < s; e += 1) this.shapeModifiers[e].addShape(t);
    }, I.prototype.renderModifiers = function() {
        if (this.shapeModifiers.length) {
            var t, e = this.shapes.length;
            for (t = 0; t < e; t += 1) this.shapes[t].reset();
            for (t = (e = this.shapeModifiers.length) - 1; t >= 0; t -= 1) this.shapeModifiers[t].processShapes(this.firstFrame);
        }
    }, I.prototype.renderFrame = function(t) {
        if (!1 !== this._parent.renderFrame.call(this, t)) {
            this.hidden && (this.layerElement.style.display = "block", this.hidden = !1), this.renderModifiers();
            var e, s = this.stylesList.length;
            for (e = 0; e < s; e += 1) this.stylesList[e].d = "", this.stylesList[e].mdf = !1;
            for (this.renderShape(this.shapesData, this.itemsData, null), e = 0; e < s; e += 1) "0" === this.stylesList[e].ld && (this.stylesList[e].ld = "1", 
            this.stylesList[e].pElem.style.display = "block"), (this.stylesList[e].mdf || this.firstFrame) && (this.stylesList[e].pElem.setAttribute("d", this.stylesList[e].d), 
            this.stylesList[e].msElem && this.stylesList[e].msElem.setAttribute("d", this.stylesList[e].d));
            this.firstFrame && (this.firstFrame = !1);
        } else this.hide();
    }, I.prototype.hide = function() {
        if (!this.hidden) {
            this.layerElement.style.display = "none";
            var t;
            for (t = this.stylesList.length - 1; t >= 0; t -= 1) "0" !== this.stylesList[t].ld && (this.stylesList[t].ld = "0", 
            this.stylesList[t].pElem.style.display = "none", this.stylesList[t].pElem.parentNode && (this.stylesList[t].parent = this.stylesList[t].pElem.parentNode));
            this.hidden = !0;
        }
    }, I.prototype.renderShape = function(t, e, s) {
        var i, r;
        for (i = t.length - 1; i >= 0; i -= 1) "tr" == (r = t[i].ty) ? ((this.firstFrame || e[i].transform.op.mdf && s) && s.setAttribute("opacity", e[i].transform.op.v), 
        (this.firstFrame || e[i].transform.mProps.mdf && s) && s.setAttribute("transform", e[i].transform.mProps.v.to2dCSS())) : "sh" == r || "el" == r || "rc" == r || "sr" == r ? this.renderPath(t[i], e[i]) : "fl" == r ? this.renderFill(t[i], e[i]) : "gf" == r ? this.renderGradient(t[i], e[i]) : "gs" == r ? (this.renderGradient(t[i], e[i]), 
        this.renderStroke(t[i], e[i])) : "st" == r ? this.renderStroke(t[i], e[i]) : "gr" == r && this.renderShape(t[i].it, e[i].it, e[i].gr);
    }, I.prototype.buildShapeString = function(t, e, s, i) {
        var r, a = "";
        for (r = 1; r < e; r += 1) 1 === r && (a += " M" + i.applyToPointStringified(t.v[0][0], t.v[0][1])), 
        a += " C" + i.applyToPointStringified(t.o[r - 1][0], t.o[r - 1][1]) + " " + i.applyToPointStringified(t.i[r][0], t.i[r][1]) + " " + i.applyToPointStringified(t.v[r][0], t.v[r][1]);
        return 1 === e && (a += " M" + i.applyToPointStringified(t.v[0][0], t.v[0][1])), 
        s && e && (a += " C" + i.applyToPointStringified(t.o[r - 1][0], t.o[r - 1][1]) + " " + i.applyToPointStringified(t.i[0][0], t.i[0][1]) + " " + i.applyToPointStringified(t.v[0][0], t.v[0][1]), 
        a += "z"), a;
    }, I.prototype.renderPath = function(t, e) {
        var s, i, r, a, n, h, o = e.elements.length, p = e.lvl;
        if (t._render) for (h = 0; h < o; h += 1) if (e.elements[h].data._render) {
            a = e.sh.mdf || this.firstFrame, r = "M0 0";
            var l = e.sh.paths;
            if (i = l._length, e.elements[h].lvl < p) {
                for (var f, m = this.mHelper.reset(), d = p - e.elements[h].lvl, c = e.transformers.length - 1; d > 0; ) a = e.transformers[c].mProps.mdf || a, 
                f = e.transformers[c].mProps.v.props, m.transform(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8], f[9], f[10], f[11], f[12], f[13], f[14], f[15]), 
                d--, c--;
                if (a) {
                    for (s = 0; s < i; s += 1) (n = l.shapes[s]) && n._length && (r += this.buildShapeString(n, n._length, n.c, m));
                    e.caches[h] = r;
                } else r = e.caches[h];
            } else if (a) {
                for (s = 0; s < i; s += 1) (n = l.shapes[s]) && n._length && (r += this.buildShapeString(n, n._length, n.c, this.identityMatrix));
                e.caches[h] = r;
            } else r = e.caches[h];
            e.elements[h].d += r, e.elements[h].mdf = a || e.elements[h].mdf;
        } else e.elements[h].mdf = !0;
    }, I.prototype.renderFill = function(t, e) {
        var s = e.style;
        (e.c.mdf || this.firstFrame) && s.pElem.setAttribute("fill", "rgb(" + bt(e.c.v[0]) + "," + bt(e.c.v[1]) + "," + bt(e.c.v[2]) + ")"), 
        (e.o.mdf || this.firstFrame) && s.pElem.setAttribute("fill-opacity", e.o.v);
    }, I.prototype.renderGradient = function(t, e) {
        var s = e.gf, i = e.of, r = e.s.v, a = e.e.v;
        if (e.o.mdf || this.firstFrame) {
            var n = "gf" === t.ty ? "fill-opacity" : "stroke-opacity";
            e.elem.setAttribute(n, e.o.v);
        }
        if (e.s.mdf || this.firstFrame) {
            var h = 1 === t.t ? "x1" : "cx", o = "x1" === h ? "y1" : "cy";
            s.setAttribute(h, r[0]), s.setAttribute(o, r[1]), i && (i.setAttribute(h, r[0]), 
            i.setAttribute(o, r[1]));
        }
        var p, l, f, m;
        if (e.g.cmdf || this.firstFrame) {
            p = e.cst;
            var d = e.g.c;
            for (f = p.length, l = 0; l < f; l += 1) (m = p[l]).setAttribute("offset", d[4 * l] + "%"), 
            m.setAttribute("stop-color", "rgb(" + d[4 * l + 1] + "," + d[4 * l + 2] + "," + d[4 * l + 3] + ")");
        }
        if (i && (e.g.omdf || this.firstFrame)) {
            p = e.ost;
            var c = e.g.o;
            for (f = p.length, l = 0; l < f; l += 1) (m = p[l]).setAttribute("offset", c[2 * l] + "%"), 
            m.setAttribute("stop-opacity", c[2 * l + 1]);
        }
        if (1 === t.t) (e.e.mdf || this.firstFrame) && (s.setAttribute("x2", a[0]), s.setAttribute("y2", a[1]), 
        i && (i.setAttribute("x2", a[0]), i.setAttribute("y2", a[1]))); else {
            var u;
            if ((e.s.mdf || e.e.mdf || this.firstFrame) && (u = Math.sqrt(Math.pow(r[0] - a[0], 2) + Math.pow(r[1] - a[1], 2)), 
            s.setAttribute("r", u), i && i.setAttribute("r", u)), e.e.mdf || e.h.mdf || e.a.mdf || this.firstFrame) {
                u || (u = Math.sqrt(Math.pow(r[0] - a[0], 2) + Math.pow(r[1] - a[1], 2)));
                var g = Math.atan2(a[1] - r[1], a[0] - r[0]), y = u * (e.h.v >= 1 ? .99 : e.h.v <= -1 ? -.99 : e.h.v), v = Math.cos(g + e.a.v) * y + r[0], b = Math.sin(g + e.a.v) * y + r[1];
                s.setAttribute("fx", v), s.setAttribute("fy", b), i && (i.setAttribute("fx", v), 
                i.setAttribute("fy", b));
            }
        }
    }, I.prototype.renderStroke = function(t, e) {
        var s = e.style, i = e.d;
        i && i.k && (i.mdf || this.firstFrame) && (s.pElem.setAttribute("stroke-dasharray", i.dasharray), 
        s.pElem.setAttribute("stroke-dashoffset", i.dashoffset)), e.c && (e.c.mdf || this.firstFrame) && s.pElem.setAttribute("stroke", "rgb(" + bt(e.c.v[0]) + "," + bt(e.c.v[1]) + "," + bt(e.c.v[2]) + ")"), 
        (e.o.mdf || this.firstFrame) && s.pElem.setAttribute("stroke-opacity", e.o.v), (e.w.mdf || this.firstFrame) && (s.pElem.setAttribute("stroke-width", e.w.v), 
        s.msElem && s.msElem.setAttribute("stroke-width", e.w.v));
    }, I.prototype.destroy = function() {
        this._parent.destroy.call(this._parent), this.shapeData = null, this.itemsData = null, 
        this.parentContainer = null, this.placeholder = null;
    }, L.prototype.init = function() {
        this._parent.init.call(this), this.lettersChangedFlag = !1, this.currentTextDocumentData = {};
        var t = this.data;
        this.viewData = {
            m: {
                a: Dt.getProp(this, t.t.m.a, 1, 0, this.dynamicProperties)
            }
        };
        var e = this.data.t;
        if (e.a.length) {
            this.viewData.a = Array.apply(null, {
                length: e.a.length
            });
            var s, i, r, a = e.a.length;
            for (s = 0; s < a; s += 1) i = {
                a: {},
                s: {}
            }, "r" in (r = e.a[s]).a && (i.a.r = Dt.getProp(this, r.a.r, 0, Pt, this.dynamicProperties)), 
            "rx" in r.a && (i.a.rx = Dt.getProp(this, r.a.rx, 0, Pt, this.dynamicProperties)), 
            "ry" in r.a && (i.a.ry = Dt.getProp(this, r.a.ry, 0, Pt, this.dynamicProperties)), 
            "sk" in r.a && (i.a.sk = Dt.getProp(this, r.a.sk, 0, Pt, this.dynamicProperties)), 
            "sa" in r.a && (i.a.sa = Dt.getProp(this, r.a.sa, 0, Pt, this.dynamicProperties)), 
            "s" in r.a && (i.a.s = Dt.getProp(this, r.a.s, 1, .01, this.dynamicProperties)), 
            "a" in r.a && (i.a.a = Dt.getProp(this, r.a.a, 1, 0, this.dynamicProperties)), "o" in r.a && (i.a.o = Dt.getProp(this, r.a.o, 0, .01, this.dynamicProperties)), 
            "p" in r.a && (i.a.p = Dt.getProp(this, r.a.p, 1, 0, this.dynamicProperties)), "sw" in r.a && (i.a.sw = Dt.getProp(this, r.a.sw, 0, 0, this.dynamicProperties)), 
            "sc" in r.a && (i.a.sc = Dt.getProp(this, r.a.sc, 1, 0, this.dynamicProperties)), 
            "fc" in r.a && (i.a.fc = Dt.getProp(this, r.a.fc, 1, 0, this.dynamicProperties)), 
            "fh" in r.a && (i.a.fh = Dt.getProp(this, r.a.fh, 0, 0, this.dynamicProperties)), 
            "fs" in r.a && (i.a.fs = Dt.getProp(this, r.a.fs, 0, .01, this.dynamicProperties)), 
            "fb" in r.a && (i.a.fb = Dt.getProp(this, r.a.fb, 0, .01, this.dynamicProperties)), 
            "t" in r.a && (i.a.t = Dt.getProp(this, r.a.t, 0, 0, this.dynamicProperties)), i.s = Dt.getTextSelectorProp(this, r.s, this.dynamicProperties), 
            i.s.t = r.s.t, this.viewData.a[s] = i;
        } else this.viewData.a = [];
        e.p && "m" in e.p ? (this.viewData.p = {
            f: Dt.getProp(this, e.p.f, 0, 0, this.dynamicProperties),
            l: Dt.getProp(this, e.p.l, 0, 0, this.dynamicProperties),
            r: e.p.r,
            m: this.maskManager.getMaskProperty(e.p.m)
        }, this.maskPath = !0) : this.maskPath = !1;
    }, L.prototype.prepareFrame = function(t) {
        var e = 0, s = this.data.t.d.k.length, i = this.data.t.d.k[e].s;
        for (e += 1; e < s && !(this.data.t.d.k[e].t > t); ) i = this.data.t.d.k[e].s, e += 1;
        this.lettersChangedFlag = !1, i !== this.currentTextDocumentData && (this.currentTextDocumentData = i, 
        this.lettersChangedFlag = !0, this.buildNewText()), this._parent.prepareFrame.call(this, t);
    }, L.prototype.createPathShape = function(t, e) {
        var s, i, r = e.length, a = "";
        for (s = 0; s < r; s += 1) i = e[s].ks.k, a += this.buildShapeString(i, i.i.length, !0, t);
        return a;
    }, L.prototype.getMeasures = function() {
        var t, e, s, i, r = this.mHelper, a = this.renderType, n = this.data, h = this.currentTextDocumentData, o = h.l;
        if (this.maskPath) {
            var p = this.viewData.p.m;
            if (!this.viewData.p.n || this.viewData.p.mdf) {
                var l = p.v;
                this.viewData.p.r && (l = v(l));
                k = {
                    tLength: 0,
                    segments: []
                };
                i = l.v.length - 1;
                var f, m = 0;
                for (s = 0; s < i; s += 1) f = {
                    s: l.v[s],
                    e: l.v[s + 1],
                    to: [ l.o[s][0] - l.v[s][0], l.o[s][1] - l.v[s][1] ],
                    ti: [ l.i[s + 1][0] - l.v[s + 1][0], l.i[s + 1][1] - l.v[s + 1][1] ]
                }, xt.buildBezierData(f), k.tLength += f.bezierData.segmentLength, k.segments.push(f), 
                m += f.bezierData.segmentLength;
                s = i, p.v.c && (f = {
                    s: l.v[s],
                    e: l.v[0],
                    to: [ l.o[s][0] - l.v[s][0], l.o[s][1] - l.v[s][1] ],
                    ti: [ l.i[0][0] - l.v[0][0], l.i[0][1] - l.v[0][1] ]
                }, xt.buildBezierData(f), k.tLength += f.bezierData.segmentLength, k.segments.push(f), 
                m += f.bezierData.segmentLength), this.viewData.p.pi = k;
            }
            var d, b, w, k = this.viewData.p.pi, A = this.viewData.p.f.v, P = 0, E = 1, S = 0, M = !0, x = k.segments;
            if (A < 0 && p.v.c) for (k.tLength < Math.abs(A) && (A = -Math.abs(A) % k.tLength), 
            E = (w = x[P = x.length - 1].bezierData.points).length - 1; A < 0; ) A += w[E].partialLength, 
            (E -= 1) < 0 && (E = (w = x[P -= 1].bezierData.points).length - 1);
            b = (w = x[P].bezierData.points)[E - 1];
            var F, C, D = (d = w[E]).partialLength;
        }
        i = o.length, t = 0, e = 0;
        var _, T, I, L, N, V = 1.2 * h.s * .714, z = !0, R = this.viewData, O = Array.apply(null, {
            length: i
        });
        L = R.a.length;
        var j, B, G, W, q, H, X, Y, $, Q, Z, U, J, K, tt, et, st = -1, it = A, rt = P, at = E, nt = -1, ht = 0;
        for (s = 0; s < i; s += 1) if (r.reset(), H = 1, o[s].n) t = 0, e += h.yOffset, 
        e += z ? 1 : 0, A = it, z = !1, ht = 0, this.maskPath && (E = at, b = (w = x[P = rt].bezierData.points)[E - 1], 
        D = (d = w[E]).partialLength, S = 0), O[s] = this.emptyProp; else {
            if (this.maskPath) {
                if (nt !== o[s].line) {
                    switch (h.j) {
                      case 1:
                        A += m - h.lineWidths[o[s].line];
                        break;

                      case 2:
                        A += (m - h.lineWidths[o[s].line]) / 2;
                    }
                    nt = o[s].line;
                }
                st !== o[s].ind && (o[st] && (A += o[st].extra), A += o[s].an / 2, st = o[s].ind), 
                A += R.m.a.v[0] * o[s].an / 200;
                var ot = 0;
                for (I = 0; I < L; I += 1) "p" in (_ = R.a[I].a) && ((B = (T = R.a[I].s).getMult(o[s].anIndexes[I], n.t.a[I].s.totalChars)).length ? ot += _.p.v[0] * B[0] : ot += _.p.v[0] * B), 
                "a" in _ && ((B = (T = R.a[I].s).getMult(o[s].anIndexes[I], n.t.a[I].s.totalChars)).length ? ot += _.a.v[0] * B[0] : ot += _.a.v[0] * B);
                for (M = !0; M; ) S + D >= A + ot || !w ? (F = (A + ot - S) / d.partialLength, W = b.point[0] + (d.point[0] - b.point[0]) * F, 
                q = b.point[1] + (d.point[1] - b.point[1]) * F, r.translate(-R.m.a.v[0] * o[s].an / 200, -R.m.a.v[1] * V / 100), 
                M = !1) : w && (S += d.partialLength, (E += 1) >= w.length && (E = 0, x[P += 1] ? w = x[P].bezierData.points : p.v.c ? (E = 0, 
                w = x[P = 0].bezierData.points) : (S -= d.partialLength, w = null)), w && (b = d, 
                D = (d = w[E]).partialLength));
                G = o[s].an / 2 - o[s].add, r.translate(-G, 0, 0);
            } else G = o[s].an / 2 - o[s].add, r.translate(-G, 0, 0), r.translate(-R.m.a.v[0] * o[s].an / 200, -R.m.a.v[1] * V / 100, 0);
            for (ht += o[s].l / 2, I = 0; I < L; I += 1) "t" in (_ = R.a[I].a) && (B = (T = R.a[I].s).getMult(o[s].anIndexes[I], n.t.a[I].s.totalChars), 
            this.maskPath ? B.length ? A += _.t * B[0] : A += _.t * B : B.length ? t += _.t.v * B[0] : t += _.t.v * B);
            for (ht += o[s].l / 2, h.strokeWidthAnim && (Y = h.sw || 0), h.strokeColorAnim && (X = h.sc ? [ h.sc[0], h.sc[1], h.sc[2] ] : [ 0, 0, 0 ]), 
            h.fillColorAnim && ($ = [ h.fc[0], h.fc[1], h.fc[2] ]), I = 0; I < L; I += 1) "a" in (_ = R.a[I].a) && ((B = (T = R.a[I].s).getMult(o[s].anIndexes[I], n.t.a[I].s.totalChars)).length ? r.translate(-_.a.v[0] * B[0], -_.a.v[1] * B[1], _.a.v[2] * B[2]) : r.translate(-_.a.v[0] * B, -_.a.v[1] * B, _.a.v[2] * B));
            for (I = 0; I < L; I += 1) "s" in (_ = R.a[I].a) && ((B = (T = R.a[I].s).getMult(o[s].anIndexes[I], n.t.a[I].s.totalChars)).length ? r.scale(1 + (_.s.v[0] - 1) * B[0], 1 + (_.s.v[1] - 1) * B[1], 1) : r.scale(1 + (_.s.v[0] - 1) * B, 1 + (_.s.v[1] - 1) * B, 1));
            for (I = 0; I < L; I += 1) {
                if (_ = R.a[I].a, T = R.a[I].s, B = T.getMult(o[s].anIndexes[I], n.t.a[I].s.totalChars), 
                "sk" in _ && (B.length ? r.skewFromAxis(-_.sk.v * B[0], _.sa.v * B[1]) : r.skewFromAxis(-_.sk.v * B, _.sa.v * B)), 
                "r" in _ && (B.length ? r.rotateZ(-_.r.v * B[2]) : r.rotateZ(-_.r.v * B)), "ry" in _ && (B.length ? r.rotateY(_.ry.v * B[1]) : r.rotateY(_.ry.v * B)), 
                "rx" in _ && (B.length ? r.rotateX(_.rx.v * B[0]) : r.rotateX(_.rx.v * B)), "o" in _ && (B.length ? H += (_.o.v * B[0] - H) * B[0] : H += (_.o.v * B - H) * B), 
                h.strokeWidthAnim && "sw" in _ && (B.length ? Y += _.sw.v * B[0] : Y += _.sw.v * B), 
                h.strokeColorAnim && "sc" in _) for (Q = 0; Q < 3; Q += 1) B.length ? X[Q] = Math.round(255 * (X[Q] + (_.sc.v[Q] - X[Q]) * B[0])) : X[Q] = Math.round(255 * (X[Q] + (_.sc.v[Q] - X[Q]) * B));
                if (h.fillColorAnim) {
                    if ("fc" in _) for (Q = 0; Q < 3; Q += 1) B.length ? $[Q] = $[Q] + (_.fc.v[Q] - $[Q]) * B[0] : $[Q] = $[Q] + (_.fc.v[Q] - $[Q]) * B;
                    "fh" in _ && ($ = B.length ? g($, _.fh.v * B[0]) : g($, _.fh.v * B)), "fs" in _ && ($ = B.length ? c($, _.fs.v * B[0]) : c($, _.fs.v * B)), 
                    "fb" in _ && ($ = B.length ? u($, _.fb.v * B[0]) : u($, _.fb.v * B));
                }
            }
            for (I = 0; I < L; I += 1) "p" in (_ = R.a[I].a) && (B = (T = R.a[I].s).getMult(o[s].anIndexes[I], n.t.a[I].s.totalChars), 
            this.maskPath ? B.length ? r.translate(0, _.p.v[1] * B[0], -_.p.v[2] * B[1]) : r.translate(0, _.p.v[1] * B, -_.p.v[2] * B) : B.length ? r.translate(_.p.v[0] * B[0], _.p.v[1] * B[1], -_.p.v[2] * B[2]) : r.translate(_.p.v[0] * B, _.p.v[1] * B, -_.p.v[2] * B));
            if (h.strokeWidthAnim && (Z = Y < 0 ? 0 : Y), h.strokeColorAnim && (U = "rgb(" + Math.round(255 * X[0]) + "," + Math.round(255 * X[1]) + "," + Math.round(255 * X[2]) + ")"), 
            h.fillColorAnim && (J = "rgb(" + Math.round(255 * $[0]) + "," + Math.round(255 * $[1]) + "," + Math.round(255 * $[2]) + ")"), 
            this.maskPath) {
                if (r.translate(0, -h.ls), r.translate(0, R.m.a.v[1] * V / 100 + e, 0), n.t.p.p) {
                    C = (d.point[1] - b.point[1]) / (d.point[0] - b.point[0]);
                    var pt = 180 * Math.atan(C) / Math.PI;
                    d.point[0] < b.point[0] && (pt += 180), r.rotate(-pt * Math.PI / 180);
                }
                r.translate(W, q, 0), A -= R.m.a.v[0] * o[s].an / 200, o[s + 1] && st !== o[s + 1].ind && (A += o[s].an / 2, 
                A += h.tr / 1e3 * h.s);
            } else {
                switch (r.translate(t, e, 0), h.ps && r.translate(h.ps[0], h.ps[1] + h.ascent, 0), 
                h.j) {
                  case 1:
                    r.translate(h.justifyOffset + (h.boxWidth - h.lineWidths[o[s].line]), 0, 0);
                    break;

                  case 2:
                    r.translate(h.justifyOffset + (h.boxWidth - h.lineWidths[o[s].line]) / 2, 0, 0);
                }
                r.translate(0, -h.ls), r.translate(G, 0, 0), r.translate(R.m.a.v[0] * o[s].an / 200, R.m.a.v[1] * V / 100, 0), 
                t += o[s].l + h.tr / 1e3 * h.s;
            }
            "html" === a ? K = r.toCSS() : "svg" === a ? K = r.to2dCSS() : tt = [ r.props[0], r.props[1], r.props[2], r.props[3], r.props[4], r.props[5], r.props[6], r.props[7], r.props[8], r.props[9], r.props[10], r.props[11], r.props[12], r.props[13], r.props[14], r.props[15] ], 
            et = H, !(j = this.renderedLetters[s]) || j.o === et && j.sw === Z && j.sc === U && j.fc === J ? "svg" !== a && "html" !== a || j && j.m === K ? "canvas" !== a || j && j.props[0] === tt[0] && j.props[1] === tt[1] && j.props[4] === tt[4] && j.props[5] === tt[5] && j.props[12] === tt[12] && j.props[13] === tt[13] ? N = j : (this.lettersChangedFlag = !0, 
            N = new y(et, Z, U, J, null, tt)) : (this.lettersChangedFlag = !0, N = new y(et, Z, U, J, K)) : (this.lettersChangedFlag = !0, 
            N = new y(et, Z, U, J, K, tt)), this.renderedLetters[s] = N;
        }
    }, L.prototype.buildShapeString = I.prototype.buildShapeString, L.prototype.emptyProp = new y(), 
    w(T, N), N.prototype.init = L.prototype.init, N.prototype.createPathShape = L.prototype.createPathShape, 
    N.prototype.getMeasures = L.prototype.getMeasures, N.prototype.prepareFrame = L.prototype.prepareFrame, 
    N.prototype.buildShapeString = L.prototype.buildShapeString, N.prototype.createElements = function() {
        this._parent.createElements.call(this), this.data.ln && this.layerElement.setAttribute("id", this.data.ln), 
        this.data.cl && this.layerElement.setAttribute("class", this.data.cl);
    }, N.prototype.buildNewText = function() {
        var t, e, s = this.currentTextDocumentData;
        this.renderedLetters = Array.apply(null, {
            length: this.currentTextDocumentData.l ? this.currentTextDocumentData.l.length : 0
        }), s.fc ? this.layerElement.setAttribute("fill", "rgb(" + Math.round(255 * s.fc[0]) + "," + Math.round(255 * s.fc[1]) + "," + Math.round(255 * s.fc[2]) + ")") : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"), 
        s.sc && (this.layerElement.setAttribute("stroke", "rgb(" + Math.round(255 * s.sc[0]) + "," + Math.round(255 * s.sc[1]) + "," + Math.round(255 * s.sc[2]) + ")"), 
        this.layerElement.setAttribute("stroke-width", s.sw)), this.layerElement.setAttribute("font-size", s.s);
        var i = this.globalData.fontManager.getFontByName(s.f);
        if (i.fClass) this.layerElement.setAttribute("class", i.fClass); else {
            this.layerElement.setAttribute("font-family", i.fFamily);
            var r = s.fWeight, a = s.fStyle;
            this.layerElement.setAttribute("font-style", a), this.layerElement.setAttribute("font-weight", r);
        }
        var n = s.l || [];
        if (e = n.length) {
            var h, o, p = this.mHelper, l = "", f = this.data.singleShape;
            if (f) var m = 0, d = 0, c = s.lineWidths, u = s.boxWidth, g = !0;
            var y = 0;
            for (t = 0; t < e; t += 1) {
                if (this.globalData.fontManager.chars ? f && 0 !== t || (h = this.textSpans[y] ? this.textSpans[y] : document.createElementNS(ct, "path")) : h = this.textSpans[y] ? this.textSpans[y] : document.createElementNS(ct, "text"), 
                h.style.display = "inherit", h.setAttribute("stroke-linecap", "butt"), h.setAttribute("stroke-linejoin", "round"), 
                h.setAttribute("stroke-miterlimit", "4"), f && n[t].n && (m = 0, d += s.yOffset, 
                d += g ? 1 : 0, g = !1), p.reset(), this.globalData.fontManager.chars && p.scale(s.s / 100, s.s / 100), 
                f) {
                    switch (s.ps && p.translate(s.ps[0], s.ps[1] + s.ascent, 0), p.translate(0, -s.ls, 0), 
                    s.j) {
                      case 1:
                        p.translate(s.justifyOffset + (u - c[n[t].line]), 0, 0);
                        break;

                      case 2:
                        p.translate(s.justifyOffset + (u - c[n[t].line]) / 2, 0, 0);
                    }
                    p.translate(m, d, 0);
                }
                if (this.globalData.fontManager.chars) {
                    var v, b = this.globalData.fontManager.getCharData(s.t.charAt(t), i.fStyle, this.globalData.fontManager.getFontByName(s.f).fFamily);
                    (v = b ? b.data : null) && v.shapes && (o = v.shapes[0].it, f || (l = ""), l += this.createPathShape(p, o), 
                    f || h.setAttribute("d", l)), f || this.layerElement.appendChild(h);
                } else h.textContent = n[t].val, h.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"), 
                this.layerElement.appendChild(h), f && h.setAttribute("transform", p.to2dCSS());
                f && (m += n[t].l || 0, m += s.tr / 1e3 * s.s), this.textSpans[y] = h, y += 1;
            }
            if (!f) for (;y < this.textSpans.length; ) this.textSpans[y].style.display = "none", 
            y += 1;
            f && this.globalData.fontManager.chars && (h.setAttribute("d", l), this.layerElement.appendChild(h));
        }
    }, N.prototype.renderFrame = function(t) {
        if (!1 !== this._parent.renderFrame.call(this, t)) {
            if (this.hidden && this.show(), !this.data.singleShape && (this.getMeasures(), this.lettersChangedFlag)) {
                var e, s, i = this.renderedLetters, r = this.currentTextDocumentData.l;
                s = r.length;
                var a;
                for (e = 0; e < s; e += 1) r[e].n || (a = i[e], this.textSpans[e].setAttribute("transform", a.m), 
                this.textSpans[e].setAttribute("opacity", a.o), a.sw && this.textSpans[e].setAttribute("stroke-width", a.sw), 
                a.sc && this.textSpans[e].setAttribute("stroke", a.sc), a.fc && this.textSpans[e].setAttribute("fill", a.fc));
                this.firstFrame && (this.firstFrame = !1);
            }
        } else this.hide();
    }, N.prototype.destroy = function() {
        this._parent.destroy.call(this._parent);
    }, V.prototype.renderFrame = function(t) {
        if (t || this.filterManager.mdf) {
            var e = this.filterManager.effectElements[0].p.v, s = this.filterManager.effectElements[1].p.v, i = this.filterManager.effectElements[2].p.v / 100;
            this.matrixFilter.setAttribute("values", s[0] - e[0] + " 0 0 0 " + e[0] + " " + (s[1] - e[1]) + " 0 0 0 " + e[1] + " " + (s[2] - e[2]) + " 0 0 0 " + e[2] + " 0 0 0 " + i + " 0");
        }
    }, z.prototype.renderFrame = function(t) {
        if (t || this.filterManager.mdf) {
            var e = this.filterManager.effectElements[2].p.v, s = this.filterManager.effectElements[6].p.v;
            this.matrixFilter.setAttribute("values", "0 0 0 0 " + e[0] + " 0 0 0 0 " + e[1] + " 0 0 0 0 " + e[2] + " 0 0 0 " + s + " 0");
        }
    }, R.prototype.initialize = function() {
        var t, e, s, i, r = this.elem.layerElement.children || this.elem.layerElement.childNodes;
        for (1 === this.filterManager.effectElements[1].p.v ? (i = this.elem.maskManager.masksProperties.length, 
        s = 0) : i = (s = this.filterManager.effectElements[0].p.v - 1) + 1, (e = document.createElementNS(ct, "g")).setAttribute("fill", "none"), 
        e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-dashoffset", 1), 
        s; s < i; s += 1) t = document.createElementNS(ct, "path"), e.appendChild(t), this.paths.push({
            p: t,
            m: s
        });
        if (3 === this.filterManager.effectElements[10].p.v) {
            var a = document.createElementNS(ct, "mask"), n = "stms_" + f(10);
            a.setAttribute("id", n), a.setAttribute("mask-type", "alpha"), a.appendChild(e), 
            this.elem.globalData.defs.appendChild(a);
            var h = document.createElementNS(ct, "g");
            h.setAttribute("mask", "url(#" + n + ")"), r[0] && h.appendChild(r[0]), this.elem.layerElement.appendChild(h), 
            this.masker = a, e.setAttribute("stroke", "#fff");
        } else if (1 === this.filterManager.effectElements[10].p.v || 2 === this.filterManager.effectElements[10].p.v) {
            if (2 === this.filterManager.effectElements[10].p.v) for (r = this.elem.layerElement.children || this.elem.layerElement.childNodes; r.length; ) this.elem.layerElement.removeChild(r[0]);
            this.elem.layerElement.appendChild(e), this.elem.layerElement.removeAttribute("mask"), 
            e.setAttribute("stroke", "#fff");
        }
        this.initialized = !0, this.pathMasker = e;
    }, R.prototype.renderFrame = function(t) {
        this.initialized || this.initialize();
        var e, s, i, r = this.paths.length;
        for (e = 0; e < r; e += 1) if (s = this.elem.maskManager.viewData[this.paths[e].m], 
        i = this.paths[e].p, (t || this.filterManager.mdf || s.prop.mdf) && i.setAttribute("d", s.lastPath), 
        t || this.filterManager.effectElements[9].p.mdf || this.filterManager.effectElements[4].p.mdf || this.filterManager.effectElements[7].p.mdf || this.filterManager.effectElements[8].p.mdf || s.prop.mdf) {
            var a;
            if (0 !== this.filterManager.effectElements[7].p.v || 100 !== this.filterManager.effectElements[8].p.v) {
                var n = Math.min(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) / 100, h = Math.max(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) / 100, o = i.getTotalLength();
                a = "0 0 0 " + o * n + " ";
                var p, l = o * (h - n), f = 1 + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100, m = Math.floor(l / f);
                for (p = 0; p < m; p += 1) a += "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100 + " ";
                a += "0 " + 10 * o + " 0 0";
            } else a = "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100;
            i.setAttribute("stroke-dasharray", a);
        }
        if ((t || this.filterManager.effectElements[4].p.mdf) && this.pathMasker.setAttribute("stroke-width", 2 * this.filterManager.effectElements[4].p.v), 
        (t || this.filterManager.effectElements[6].p.mdf) && this.pathMasker.setAttribute("opacity", this.filterManager.effectElements[6].p.v), 
        (1 === this.filterManager.effectElements[10].p.v || 2 === this.filterManager.effectElements[10].p.v) && (t || this.filterManager.effectElements[3].p.mdf)) {
            var d = this.filterManager.effectElements[3].p.v;
            this.pathMasker.setAttribute("stroke", "rgb(" + bt(255 * d[0]) + "," + bt(255 * d[1]) + "," + bt(255 * d[2]) + ")");
        }
    }, O.prototype.renderFrame = function(t) {
        if (t || this.filterManager.mdf) {
            var e = this.filterManager.effectElements[0].p.v, s = this.filterManager.effectElements[1].p.v, i = this.filterManager.effectElements[2].p.v, r = i[0] + " " + s[0] + " " + e[0], a = i[1] + " " + s[1] + " " + e[1], n = i[2] + " " + s[2] + " " + e[2];
            this.feFuncR.setAttribute("tableValues", r), this.feFuncG.setAttribute("tableValues", a), 
            this.feFuncB.setAttribute("tableValues", n);
        }
    }, j.prototype.createFeFunc = function(t, e) {
        var s = document.createElementNS(ct, t);
        return s.setAttribute("type", "table"), e.appendChild(s), s;
    }, j.prototype.getTableValue = function(t, e, s, i, r) {
        for (var a, n, h = 0, o = Math.min(t, e), p = Math.max(t, e), l = Array.call(null, {
            length: 256
        }), f = 0, m = r - i, d = e - t; h <= 256; ) n = (a = h / 256) <= o ? d < 0 ? r : i : a >= p ? d < 0 ? i : r : i + m * Math.pow((a - t) / d, 1 / s), 
        l[f++] = n, h += 256 / 255;
        return l.join(" ");
    }, j.prototype.renderFrame = function(t) {
        if (t || this.filterManager.mdf) {
            var e, s = this.filterManager.effectElements;
            this.feFuncRComposed && (t || s[2].p.mdf || s[3].p.mdf || s[4].p.mdf || s[5].p.mdf || s[6].p.mdf) && (e = this.getTableValue(s[2].p.v, s[3].p.v, s[4].p.v, s[5].p.v, s[6].p.v), 
            this.feFuncRComposed.setAttribute("tableValues", e), this.feFuncGComposed.setAttribute("tableValues", e), 
            this.feFuncBComposed.setAttribute("tableValues", e)), this.feFuncR && (t || s[9].p.mdf || s[10].p.mdf || s[11].p.mdf || s[12].p.mdf || s[13].p.mdf) && (e = this.getTableValue(s[9].p.v, s[10].p.v, s[11].p.v, s[12].p.v, s[13].p.v), 
            this.feFuncR.setAttribute("tableValues", e)), this.feFuncG && (t || s[16].p.mdf || s[17].p.mdf || s[18].p.mdf || s[19].p.mdf || s[20].p.mdf) && (e = this.getTableValue(s[16].p.v, s[17].p.v, s[18].p.v, s[19].p.v, s[20].p.v), 
            this.feFuncG.setAttribute("tableValues", e)), this.feFuncB && (t || s[23].p.mdf || s[24].p.mdf || s[25].p.mdf || s[26].p.mdf || s[27].p.mdf) && (e = this.getTableValue(s[23].p.v, s[24].p.v, s[25].p.v, s[26].p.v, s[27].p.v), 
            this.feFuncB.setAttribute("tableValues", e)), this.feFuncA && (t || s[30].p.mdf || s[31].p.mdf || s[32].p.mdf || s[33].p.mdf || s[34].p.mdf) && (e = this.getTableValue(s[30].p.v, s[31].p.v, s[32].p.v, s[33].p.v, s[34].p.v), 
            this.feFuncA.setAttribute("tableValues", e));
        }
    }, B.prototype.renderFrame = function(t) {
        if (t || this.filterManager.mdf) {
            if ((t || this.filterManager.effectElements[4].p.mdf) && this.feGaussianBlur.setAttribute("stdDeviation", this.filterManager.effectElements[4].p.v / 4), 
            t || this.filterManager.effectElements[0].p.mdf) {
                var e = this.filterManager.effectElements[0].p.v;
                this.feFlood.setAttribute("flood-color", St(Math.round(255 * e[0]), Math.round(255 * e[1]), Math.round(255 * e[2])));
            }
            if ((t || this.filterManager.effectElements[1].p.mdf) && this.feFlood.setAttribute("flood-opacity", this.filterManager.effectElements[1].p.v / 255), 
            t || this.filterManager.effectElements[2].p.mdf || this.filterManager.effectElements[3].p.mdf) {
                var s = this.filterManager.effectElements[3].p.v, i = (this.filterManager.effectElements[2].p.v - 90) * Pt, r = s * Math.cos(i), a = s * Math.sin(i);
                this.feOffset.setAttribute("dx", r), this.feOffset.setAttribute("dy", a);
            }
        }
    }, G.prototype.renderFrame = function(t) {
        var e, s = this.filters.length;
        for (e = 0; e < s; e += 1) this.filters[e].renderFrame(t);
    }, w(T, W), W.prototype.hide = function() {
        if (!this.hidden) {
            this._parent.hide.call(this);
            var t, e = this.elements.length;
            for (t = 0; t < e; t += 1) this.elements[t] && this.elements[t].hide();
        }
    }, W.prototype.prepareFrame = function(t) {
        if (this._parent.prepareFrame.call(this, t), !1 !== this.isVisible || this.data.xt) {
            if (this.tm) {
                var e = this.tm.v;
                e === this.data.op && (e = this.data.op - 1), this.renderedFrame = e;
            } else this.renderedFrame = t / this.data.sr;
            var s, i = this.elements.length;
            for (this.completeLayers || this.checkLayers(this.renderedFrame), s = 0; s < i; s += 1) (this.completeLayers || this.elements[s]) && this.elements[s].prepareFrame(this.renderedFrame - this.layers[s].st);
        }
    }, W.prototype.renderFrame = function(t) {
        var e, s = this._parent.renderFrame.call(this, t), i = this.layers.length;
        if (!1 !== s) {
            for (this.hidden && this.show(), e = 0; e < i; e += 1) (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame();
            this.firstFrame && (this.firstFrame = !1);
        } else this.hide();
    }, W.prototype.setElements = function(t) {
        this.elements = t;
    }, W.prototype.getElements = function() {
        return this.elements;
    }, W.prototype.destroy = function() {
        this._parent.destroy.call(this._parent);
        var t, e = this.layers.length;
        for (t = 0; t < e; t += 1) this.elements[t] && this.elements[t].destroy();
    }, W.prototype.checkLayers = C.prototype.checkLayers, W.prototype.buildItem = C.prototype.buildItem, 
    W.prototype.buildAllItems = C.prototype.buildAllItems, W.prototype.buildElementParenting = C.prototype.buildElementParenting, 
    W.prototype.createItem = C.prototype.createItem, W.prototype.createImage = C.prototype.createImage, 
    W.prototype.createComp = C.prototype.createComp, W.prototype.createSolid = C.prototype.createSolid, 
    W.prototype.createShape = C.prototype.createShape, W.prototype.createText = C.prototype.createText, 
    W.prototype.createBase = C.prototype.createBase, W.prototype.appendElementInPos = C.prototype.appendElementInPos, 
    W.prototype.checkPendingElements = C.prototype.checkPendingElements, W.prototype.addPendingElement = C.prototype.addPendingElement, 
    w(T, q), q.prototype.createElements = function() {
        var t = this.globalData.getAssetsPath(this.assetData);
        this._parent.createElements.call(this), this.innerElem = document.createElementNS(ct, "image"), 
        this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), 
        this.innerElem.setAttribute("preserveAspectRatio", "xMidYMid slice"), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), 
        this.maskedElement = this.innerElem, this.layerElement.appendChild(this.innerElem), 
        this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl);
    }, q.prototype.renderFrame = function(t) {
        !1 !== this._parent.renderFrame.call(this, t) ? (this.hidden && this.show(), this.firstFrame && (this.firstFrame = !1)) : this.hide();
    }, q.prototype.destroy = function() {
        this._parent.destroy.call(this._parent), this.innerElem = null;
    }, w(T, H), H.prototype.createElements = function() {
        this._parent.createElements.call(this);
        var t = document.createElementNS(ct, "rect");
        t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), 
        this.layerElement.appendChild(t), this.innerElem = t, this.data.ln && this.layerElement.setAttribute("id", this.data.ln), 
        this.data.cl && this.layerElement.setAttribute("class", this.data.cl);
    }, H.prototype.renderFrame = q.prototype.renderFrame, H.prototype.destroy = q.prototype.destroy;
    var jt = function() {
        function t(t) {
            for (var e = 0, s = t.target; e < E; ) A[e].animation === s && (A.splice(e, 1), 
            e -= 1, E -= 1, s.isPaused || i()), e += 1;
        }
        function e(t, e) {
            if (!t) return null;
            for (var s = 0; s < E; ) {
                if (A[s].elem == t && null !== A[s].elem) return A[s].animation;
                s += 1;
            }
            var i = new Bt();
            return r(i, t), i.setData(t, e), i;
        }
        function s() {
            M += 1, w();
        }
        function i() {
            0 === (M -= 1) && (S = !0);
        }
        function r(e, r) {
            e.addEventListener("destroy", t), e.addEventListener("_active", s), e.addEventListener("_idle", i), 
            A.push({
                elem: r,
                animation: e
            }), E += 1;
        }
        function a(t) {
            var e = new Bt();
            return r(e, null), e.setParams(t), e;
        }
        function n(t, e) {
            var s;
            for (s = 0; s < E; s += 1) A[s].animation.setSpeed(t, e);
        }
        function h(t, e) {
            var s;
            for (s = 0; s < E; s += 1) A[s].animation.setDirection(t, e);
        }
        function o(t) {
            var e;
            for (e = 0; e < E; e += 1) A[e].animation.play(t);
        }
        function p(t, e) {
            P = Date.now();
            var s;
            for (s = 0; s < E; s += 1) A[s].animation.moveFrame(t, e);
        }
        function l(t) {
            var e, s = t - P;
            for (e = 0; e < E; e += 1) A[e].animation.advanceTime(s);
            P = t, S || requestAnimationFrame(l);
        }
        function f(t) {
            P = t, requestAnimationFrame(l);
        }
        function m(t) {
            var e;
            for (e = 0; e < E; e += 1) A[e].animation.pause(t);
        }
        function d(t, e, s) {
            var i;
            for (i = 0; i < E; i += 1) A[i].animation.goToAndStop(t, e, s);
        }
        function c(t) {
            var e;
            for (e = 0; e < E; e += 1) A[e].animation.stop(t);
        }
        function u(t) {
            var e;
            for (e = 0; e < E; e += 1) A[e].animation.togglePause(t);
        }
        function g(t) {
            var e;
            for (e = E - 1; e >= 0; e -= 1) A[e].animation.destroy(t);
        }
        function y(t, s, i) {
            var r, a = document.getElementsByClassName("bodymovin"), n = a.length;
            for (r = 0; r < n; r += 1) i && a[r].setAttribute("data-bm-type", i), e(a[r], t);
            if (s && 0 === n) {
                i || (i = "svg");
                var h = document.getElementsByTagName("body")[0];
                h.innerHTML = "";
                var o = document.createElement("div");
                o.style.width = "100%", o.style.height = "100%", o.setAttribute("data-bm-type", i), 
                h.appendChild(o), e(o, t);
            }
        }
        function v() {
            var t;
            for (t = 0; t < E; t += 1) A[t].animation.resize();
        }
        function b() {
            requestAnimationFrame(f);
        }
        function w() {
            S && (S = !1, requestAnimationFrame(f));
        }
        var k = {}, A = [], P = 0, E = 0, S = !0, M = 0;
        return setTimeout(b, 0), k.registerAnimation = e, k.loadAnimation = a, k.setSpeed = n, 
        k.setDirection = h, k.play = o, k.moveFrame = p, k.pause = m, k.stop = c, k.togglePause = u, 
        k.searchAnimations = y, k.resize = v, k.start = b, k.goToAndStop = d, k.destroy = g, 
        k;
    }(), Bt = function() {
        this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, 
        this.currentRawFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, 
        this.playSpeed = 1, this.playDirection = 1, this.pendingElements = 0, this.playCount = 0, 
        this.prerenderFramesFlag = !0, this.animationData = {}, this.layers = [], this.assets = [], 
        this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = f(10), 
        this.scaleMode = "fit", this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, 
        this.subframeEnabled = ut, this.segments = [], this.pendingSegment = !1, this._idle = !0, 
        this.projectInterface = {};
    };
    Bt.prototype.setParams = function(t) {
        var e = this;
        t.context && (this.context = t.context), (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
        var s = t.animType ? t.animType : t.renderer ? t.renderer : "svg";
        switch (s) {
          case "canvas":
            this.renderer = new CanvasRenderer(this, t.rendererSettings);
            break;

          case "svg":
            this.renderer = new C(this, t.rendererSettings);
            break;

          case "hybrid":
          case "html":
          default:
            this.renderer = new HybridRenderer(this, t.rendererSettings);
        }
        if (this.renderer.setProjectInterface(this.projectInterface), this.animType = s, 
        "" === t.loop || null === t.loop || (!1 === t.loop ? this.loop = !1 : !0 === t.loop ? this.loop = !0 : this.loop = parseInt(t.loop)), 
        this.autoplay = !("autoplay" in t) || t.autoplay, this.name = t.name ? t.name : "", 
        this.prerenderFramesFlag = !("prerender" in t) || t.prerender, this.autoloadSegments = !t.hasOwnProperty("autoloadSegments") || t.autoloadSegments, 
        t.animationData) e.configAnimation(t.animationData); else if (t.path) {
            "json" != t.path.substr(-4) && ("/" != t.path.substr(-1, 1) && (t.path += "/"), 
            t.path += "data.json");
            var i = new XMLHttpRequest();
            -1 != t.path.lastIndexOf("\\") ? this.path = t.path.substr(0, t.path.lastIndexOf("\\") + 1) : this.path = t.path.substr(0, t.path.lastIndexOf("/") + 1), 
            this.assetsPath = t.assetsPath, this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), 
            this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), i.open("GET", t.path, !0), 
            i.send(), i.onreadystatechange = function() {
                if (4 == i.readyState) if (200 == i.status) e.configAnimation(JSON.parse(i.responseText)); else try {
                    var t = JSON.parse(i.responseText);
                    e.configAnimation(t);
                } catch (t) {}
            };
        }
    }, Bt.prototype.setData = function(t, e) {
        var s = {
            wrapper: t,
            animationData: e ? "object" == typeof e ? e : JSON.parse(e) : null
        }, i = t.attributes;
        s.path = i.getNamedItem("data-animation-path") ? i.getNamedItem("data-animation-path").value : i.getNamedItem("data-bm-path") ? i.getNamedItem("data-bm-path").value : i.getNamedItem("bm-path") ? i.getNamedItem("bm-path").value : "", 
        s.animType = i.getNamedItem("data-anim-type") ? i.getNamedItem("data-anim-type").value : i.getNamedItem("data-bm-type") ? i.getNamedItem("data-bm-type").value : i.getNamedItem("bm-type") ? i.getNamedItem("bm-type").value : i.getNamedItem("data-bm-renderer") ? i.getNamedItem("data-bm-renderer").value : i.getNamedItem("bm-renderer") ? i.getNamedItem("bm-renderer").value : "canvas";
        var r = i.getNamedItem("data-anim-loop") ? i.getNamedItem("data-anim-loop").value : i.getNamedItem("data-bm-loop") ? i.getNamedItem("data-bm-loop").value : i.getNamedItem("bm-loop") ? i.getNamedItem("bm-loop").value : "";
        "" === r || (s.loop = "false" !== r && ("true" === r || parseInt(r)));
        var a = i.getNamedItem("data-anim-autoplay") ? i.getNamedItem("data-anim-autoplay").value : i.getNamedItem("data-bm-autoplay") ? i.getNamedItem("data-bm-autoplay").value : !i.getNamedItem("bm-autoplay") || i.getNamedItem("bm-autoplay").value;
        s.autoplay = "false" !== a, s.name = i.getNamedItem("data-name") ? i.getNamedItem("data-name").value : i.getNamedItem("data-bm-name") ? i.getNamedItem("data-bm-name").value : i.getNamedItem("bm-name") ? i.getNamedItem("bm-name").value : "", 
        "false" === (i.getNamedItem("data-anim-prerender") ? i.getNamedItem("data-anim-prerender").value : i.getNamedItem("data-bm-prerender") ? i.getNamedItem("data-bm-prerender").value : i.getNamedItem("bm-prerender") ? i.getNamedItem("bm-prerender").value : "") && (s.prerender = !1), 
        console.log("animElements:", s), this.setParams(s);
    }, Bt.prototype.includeLayers = function(t) {
        t.op > this.animationData.op && (this.animationData.op = t.op, this.totalFrames = Math.floor(t.op - this.animationData.ip), 
        this.animationData.tf = this.totalFrames);
        var e, s, i = this.animationData.layers, r = i.length, a = t.layers, n = a.length;
        for (s = 0; s < n; s += 1) for (e = 0; e < r; ) {
            if (i[e].id == a[s].id) {
                i[e] = a[s];
                break;
            }
            e += 1;
        }
        if ((t.chars || t.fonts) && (this.renderer.globalData.fontManager.addChars(t.chars), 
        this.renderer.globalData.fontManager.addFonts(t.fonts, this.renderer.globalData.defs)), 
        t.assets) for (r = t.assets.length, e = 0; e < r; e += 1) this.animationData.assets.push(t.assets[e]);
        this.animationData.__complete = !1, Ft.completeData(this.animationData, this.renderer.globalData.fontManager), 
        this.renderer.includeLayers(t.layers), mt && mt.initExpressions(this), this.renderer.renderFrame(null), 
        this.loadNextSegment();
    }, Bt.prototype.loadNextSegment = function() {
        var t = this.animationData.segments;
        if (!t || 0 === t.length || !this.autoloadSegments) return this.trigger("data_ready"), 
        void (this.timeCompleted = this.animationData.tf);
        var e = t.shift();
        this.timeCompleted = e.time * this.frameRate;
        var s = new XMLHttpRequest(), i = this, r = this.path + this.fileName + "_" + this.segmentPos + ".json";
        this.segmentPos += 1, s.open("GET", r, !0), s.send(), s.onreadystatechange = function() {
            if (4 == s.readyState) if (200 == s.status) i.includeLayers(JSON.parse(s.responseText)); else try {
                var t = JSON.parse(s.responseText);
                i.includeLayers(t);
            } catch (t) {}
        };
    }, Bt.prototype.loadSegments = function() {
        this.animationData.segments || (this.timeCompleted = this.animationData.tf), this.loadNextSegment();
    }, Bt.prototype.configAnimation = function(t) {
        this.renderer && this.renderer.destroyed || (this.animationData = t, this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), 
        this.animationData.tf = this.totalFrames, this.renderer.configAnimation(t), t.assets || (t.assets = []), 
        t.comps && (t.assets = t.assets.concat(t.comps), t.comps = null), this.renderer.searchExtraCompositions(t.assets), 
        this.layers = this.animationData.layers, this.assets = this.animationData.assets, 
        this.frameRate = this.animationData.fr, this.firstFrame = Math.round(this.animationData.ip), 
        this.frameMult = this.animationData.fr / 1e3, this.trigger("config_ready"), this.imagePreloader = new It(), 
        this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), 
        this.imagePreloader.loadAssets(t.assets), this.loadSegments(), this.updaFrameModifier(), 
        this.renderer.globalData.fontManager ? this.waitForFontsLoaded() : (Ft.completeData(this.animationData, this.renderer.globalData.fontManager), 
        this.checkLoaded()));
    }, Bt.prototype.waitForFontsLoaded = function() {
        function t() {
            this.renderer.globalData.fontManager.loaded ? (Ft.completeData(this.animationData, this.renderer.globalData.fontManager), 
            this.checkLoaded()) : setTimeout(t.bind(this), 20);
        }
        return function() {
            t.bind(this)();
        };
    }(), Bt.prototype.addPendingElement = function() {
        this.pendingElements += 1;
    }, Bt.prototype.elementLoaded = function() {
        this.pendingElements--, this.checkLoaded();
    }, Bt.prototype.checkLoaded = function() {
        0 === this.pendingElements && (mt && mt.initExpressions(this), this.renderer.initItems(), 
        setTimeout(function() {
            this.trigger("DOMLoaded");
        }.bind(this), 0), this.isLoaded = !0, this.gotoFrame(), this.autoplay && this.play());
    }, Bt.prototype.resize = function() {
        this.renderer.updateContainerSize();
    }, Bt.prototype.setSubframe = function(t) {
        this.subframeEnabled = !!t;
    }, Bt.prototype.gotoFrame = function() {
        this.subframeEnabled ? this.currentFrame = this.currentRawFrame : this.currentFrame = Math.floor(this.currentRawFrame), 
        this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), 
        this.trigger("enterFrame"), this.renderFrame();
    }, Bt.prototype.renderFrame = function() {
        !1 !== this.isLoaded && this.renderer.renderFrame(this.currentFrame + this.firstFrame);
    }, Bt.prototype.play = function(t) {
        t && this.name != t || !0 === this.isPaused && (this.isPaused = !1, this._idle && (this._idle = !1, 
        this.trigger("_active")));
    }, Bt.prototype.pause = function(t) {
        t && this.name != t || !1 === this.isPaused && (this.isPaused = !0, this.pendingSegment || (this._idle = !0, 
        this.trigger("_idle")));
    }, Bt.prototype.togglePause = function(t) {
        t && this.name != t || (!0 === this.isPaused ? this.play() : this.pause());
    }, Bt.prototype.stop = function(t) {
        t && this.name != t || (this.pause(), this.currentFrame = this.currentRawFrame = 0, 
        this.playCount = 0, this.gotoFrame());
    }, Bt.prototype.goToAndStop = function(t, e, s) {
        s && this.name != s || (e ? this.setCurrentRawFrameValue(t) : this.setCurrentRawFrameValue(t * this.frameModifier), 
        this.pause());
    }, Bt.prototype.goToAndPlay = function(t, e, s) {
        this.goToAndStop(t, e, s), this.play();
    }, Bt.prototype.advanceTime = function(t) {
        if (this.pendingSegment) return this.pendingSegment = !1, this.adjustSegment(this.segments.shift()), 
        void (this.isPaused && this.play());
        !0 !== this.isPaused && !1 !== this.isLoaded && this.setCurrentRawFrameValue(this.currentRawFrame + t * this.frameModifier);
    }, Bt.prototype.updateAnimation = function(t) {
        this.setCurrentRawFrameValue(this.totalFrames * t);
    }, Bt.prototype.moveFrame = function(t, e) {
        e && this.name != e || this.setCurrentRawFrameValue(this.currentRawFrame + t);
    }, Bt.prototype.adjustSegment = function(t) {
        this.playCount = 0, t[1] < t[0] ? (this.frameModifier > 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), 
        this.totalFrames = t[0] - t[1], this.firstFrame = t[1], this.setCurrentRawFrameValue(this.totalFrames - .01)) : t[1] > t[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), 
        this.totalFrames = t[1] - t[0], this.firstFrame = t[0], this.setCurrentRawFrameValue(0)), 
        this.trigger("segmentStart");
    }, Bt.prototype.setSegment = function(t, e) {
        var s = -1;
        this.isPaused && (this.currentRawFrame + this.firstFrame < t ? s = t : this.currentRawFrame + this.firstFrame > e && (s = e - t - .01)), 
        this.firstFrame = t, this.totalFrames = e - t, -1 !== s && this.goToAndStop(s, !0);
    }, Bt.prototype.playSegments = function(t, e) {
        if ("object" == typeof t[0]) {
            var s, i = t.length;
            for (s = 0; s < i; s += 1) this.segments.push(t[s]);
        } else this.segments.push(t);
        e && this.adjustSegment(this.segments.shift()), this.isPaused && this.play();
    }, Bt.prototype.resetSegments = function(t) {
        this.segments.length = 0, this.segments.push([ this.animationData.ip * this.frameRate, Math.floor(this.animationData.op - this.animationData.ip + this.animationData.ip * this.frameRate) ]), 
        t && this.adjustSegment(this.segments.shift());
    }, Bt.prototype.checkSegments = function() {
        this.segments.length && (this.pendingSegment = !0);
    }, Bt.prototype.remove = function(t) {
        t && this.name != t || this.renderer.destroy();
    }, Bt.prototype.destroy = function(t) {
        t && this.name != t || this.renderer && this.renderer.destroyed || (this.renderer.destroy(), 
        this.trigger("destroy"), this._cbs = null, this.onEnterFrame = this.onLoopComplete = this.onComplete = this.onSegmentStart = this.onDestroy = null);
    }, Bt.prototype.setCurrentRawFrameValue = function(t) {
        if (this.currentRawFrame = t, this.currentRawFrame >= this.totalFrames) {
            if (this.checkSegments(), !1 === this.loop) return this.currentRawFrame = this.totalFrames - .01, 
            this.gotoFrame(), this.pause(), void this.trigger("complete");
            if (this.trigger("loopComplete"), this.playCount += 1, !0 !== this.loop && this.playCount == this.loop || this.pendingSegment) return this.currentRawFrame = this.totalFrames - .01, 
            this.gotoFrame(), this.pause(), void this.trigger("complete");
            this.currentRawFrame = this.currentRawFrame % this.totalFrames;
        } else if (this.currentRawFrame < 0) return this.checkSegments(), this.playCount -= 1, 
        this.playCount < 0 && (this.playCount = 0), !1 === this.loop || this.pendingSegment ? (this.currentRawFrame = 0, 
        this.gotoFrame(), this.pause(), void this.trigger("complete")) : (this.trigger("loopComplete"), 
        this.currentRawFrame = (this.totalFrames + this.currentRawFrame) % this.totalFrames, 
        void this.gotoFrame());
        this.gotoFrame();
    }, Bt.prototype.setSpeed = function(t) {
        this.playSpeed = t, this.updaFrameModifier();
    }, Bt.prototype.setDirection = function(t) {
        this.playDirection = t < 0 ? -1 : 1, this.updaFrameModifier();
    }, Bt.prototype.updaFrameModifier = function() {
        this.frameModifier = this.frameMult * this.playSpeed * this.playDirection;
    }, Bt.prototype.getPath = function() {
        return this.path;
    }, Bt.prototype.getAssetsPath = function(t) {
        var e = "";
        if (this.assetsPath) {
            var s = t.p;
            -1 !== s.indexOf("images/") && (s = s.split("/")[1]), e = this.assetsPath + s;
        } else e = this.path, e += t.u ? t.u : "", e += t.p;
        return e;
    }, Bt.prototype.getAssetData = function(t) {
        for (var e = 0, s = this.assets.length; e < s; ) {
            if (t == this.assets[e].id) return this.assets[e];
            e += 1;
        }
    }, Bt.prototype.hide = function() {
        this.renderer.hide();
    }, Bt.prototype.show = function() {
        this.renderer.show();
    }, Bt.prototype.getAssets = function() {
        return this.assets;
    }, Bt.prototype.trigger = function(t) {
        if (this._cbs && this._cbs[t]) switch (t) {
          case "enterFrame":
            this.triggerEvent(t, new i(t, this.currentFrame, this.totalFrames, this.frameMult));
            break;

          case "loopComplete":
            this.triggerEvent(t, new a(t, this.loop, this.playCount, this.frameMult));
            break;

          case "complete":
            this.triggerEvent(t, new r(t, this.frameMult));
            break;

          case "segmentStart":
            this.triggerEvent(t, new n(t, this.firstFrame, this.totalFrames));
            break;

          case "destroy":
            this.triggerEvent(t, new h(t, this));
            break;

          default:
            this.triggerEvent(t);
        }
        "enterFrame" === t && this.onEnterFrame && this.onEnterFrame.call(this, new i(t, this.currentFrame, this.totalFrames, this.frameMult)), 
        "loopComplete" === t && this.onLoopComplete && this.onLoopComplete.call(this, new a(t, this.loop, this.playCount, this.frameMult)), 
        "complete" === t && this.onComplete && this.onComplete.call(this, new r(t, this.frameMult)), 
        "segmentStart" === t && this.onSegmentStart && this.onSegmentStart.call(this, new n(t, this.firstFrame, this.totalFrames)), 
        "destroy" === t && this.onDestroy && this.onDestroy.call(this, new h(t, this));
    }, Bt.prototype.addEventListener = o, Bt.prototype.removeEventListener = p, Bt.prototype.triggerEvent = l;
    var Gt = {};
    Gt.play = X, Gt.pause = Y, Gt.togglePause = $, Gt.setSpeed = Q, Gt.setDirection = Z, 
    Gt.stop = U, Gt.moveFrame = J, Gt.searchAnimations = K, Gt.registerAnimation = tt, 
    Gt.loadAnimation = at, Gt.setSubframeRendering = rt, Gt.resize = et, Gt.start = st, 
    Gt.goToAndStop = it, Gt.destroy = nt, Gt.setQuality = ht, Gt.inBrowser = ot, Gt.installPlugin = pt, 
    Gt.__getFactory = lt, Gt.version = "4.9.0";
    var Wt = "__[STANDALONE]__", qt = "__[ANIMATIONDATA]__", Ht = "";
    if (Wt) {
        var Xt = document.getElementsByTagName("script"), Yt = (Xt[Xt.length - 1] || {
            src: ""
        }).src.replace(/^[^\?]+\??/, "");
        Ht = function(t) {
            for (var e = Yt.split("&"), s = 0; s < e.length; s++) {
                var i = e[s].split("=");
                if (decodeURIComponent(i[0]) == t) return decodeURIComponent(i[1]);
            }
        }("renderer");
    }
    var $t = setInterval(ft, 100);
    return Gt;
}), $(function() {
    if ($(".home").length) bodymovin.loadAnimation({
        container: document.getElementById("oil"),
        renderer: "svg",
        loop: !0,
        autoplay: !0,
        path: "/wp-content/themes/halenhardy/assets/js/oil-animation-data.json"
    }); else if (matchMedia("only screen and (min-width: 797px)").matches) new Waypoint.Sticky({
        element: $(".site-header-top")[0]
    });
});
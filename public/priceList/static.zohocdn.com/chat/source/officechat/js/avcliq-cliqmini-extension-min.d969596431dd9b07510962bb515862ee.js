function isJQueryAvailable() {
    return void 0 !== window.jQuery && window.$ == window.jQuery && void 0 !== jQuery.fn && "function" == typeof jQuery.fn.on
}

function injectZCJQueryOverrides() {
    void 0 === window.ZCJQuery && (window.ZCJQuery = window.jQuery), ZCJQuery.fn.initDragContainer = function(e) {
            var t, i, n, o, a, r = this,
                s = "[dragitem]";
            void 0 !== (e = ZCJQuery.extend({}, e)).draggable_area && (s = e.draggable_area), ZCJQuery(s).addClass("drag"), r.on("mousedown", s, (function(l) {
                l.preventDefault(), t = ZCJQuery(this), "[dragitem]" !== s && (t = ZCJQuery(this).closest("[dragitem]")), "function" == typeof e.ondragstart && e.ondragstart(event), n = r.offset().top, o = n + r.height(), a = t.offset().top, i = l.pageY - a, r.on("mousemove", d).one("mouseup", c).off("mouseleave").one("mouseleave", c)
            }));
            var d = function(e) {
                    var r = e.pageY - i;
                    if (r < n) t.offset({
                        top: n
                    }), t.prev().length > 0 && t.insertBefore(t.prev());
                    else if (r + t.height() > o) t.offset({
                        top: o - t.height()
                    }), t.next().length > 0 && t.insertAfter(t.next());
                    else {
                        t.offset({
                            top: r
                        }), t.css("z-index", "1");
                        var s = parseInt(t.css("margin-top")) / 2,
                            d = !1;
                        a - r > t.outerHeight() + s ? (t.insertBefore(t.prev()), d = !0) : r - a > t.outerHeight() + s && (t.insertAfter(t.next()), d = !0), d && (t.offset({
                            top: r
                        }), a = t.offset().top, r = e.pageY - i, i = e.pageY - a)
                    }
                },
                c = function(i) {
                    r.off("mousemove", d).off("mouseup", c), t.animate({
                        top: 0
                    }, 100, (function() {
                        t.css("z-index", "0")
                    })), "function" == typeof e.ondragend && e.ondragend(i)
                }
        }, ZCJQuery.getImgStaticUrl = function() {
            return "undefined" != typeof MediaUtil && void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants._IMGSTATICURL : $zcg._IMGSTATICURL
        }, ZCJQuery.fn.hasOnlyChildrenlike = function(e, t) {
            return ZCJQuery(this[0].firstChild).attr(e) === t
        },
        function() {
            var e = {
                    noprefix: "animationend",
                    Moz: "animationend",
                    Webkit: "webkitAnimationEnd",
                    O: "oAnimationEnd",
                    ms: "MSAnimationEnd"
                },
                t = {
                    noprefix: "transitionend",
                    Moz: "transitionend",
                    Webkit: "webkitTransitionEnd",
                    O: "oTransitionEnd",
                    ms: "MSTransitionEnd"
                };

            function i(e) {
                var t = ["Webkit", "Moz", "O", "ms"];
                if (void 0 !== document.body.style.animationName) return e.noprefix;
                for (var i = 0, n = t.length; i < n; i++)
                    if (void 0 !== document.body.style[t[i] + "AnimationName"]) return e[t[i]]
            }

            function n(e, t, i, n) {
                function o(e, t) {
                    "function" == typeof n ? n(e, t) : t.remove()
                }
                if (t) {
                    function a(e) {
                        o(e, ZCJQuery(this))
                    }
                    void 0 !== i.selector ? e.on(t, i.selector, a) : e.off(t).on(t, a)
                } else o()
            }
            ZCJQuery.fn.handleAnimationEnd = function(t, o) {
                var a = ZCJQuery.extend({}, o);
                this.length && n(this, i(e), a, t)
            }, ZCJQuery.fn.handleTransitionEnd = function(e, o) {
                var a = ZCJQuery.extend({}, o);
                this.length && n(this, i(t), a, e)
            }
        }(), ZCJQuery.fn.cssAnimation = function(e) {
            Array.isArray(e) && (e = e.join(" ")), this.addClass(e), this.handleAnimationEnd((function(t, i) {
                i.removeClass(e)
            }))
        }, ZCJQuery.fn.cssTransition = function(e) {
            Array.isArray(e) && (e = e.join(" ")), this.addClass(e), this.handleTransitionEnd((function(t, i) {
                i.removeClass(e)
            }))
        }, ZCJQuery.fn.setAsDraggable = function(e) {
            var t = ZCJQuery(document),
                i = this,
                n = (e = ZCJQuery.extend({}, {
                    areaToBeVisible: {
                        width: i.width(),
                        height: i.height()
                    }
                }, e), !$WC.Util.isEmpty(e.draggablearea) && e.draggablearea.length ? e.draggablearea : i);
            if (0 !== n.length) {
                n.addClass("ZCdrag");
                var o = {},
                    a = !$WC.Util.isEmpty(e.dragboundary) && e.dragboundary.length,
                    r = !!e.isPositionBasedOnElem && e.isPositionBasedOnElem,
                    s = a ? e.dragboundary : ZCJQuery(window),
                    d = {
                        left: 0,
                        top: 0
                    },
                    c = {},
                    l = 0,
                    h = 0,
                    u = 0,
                    f = 0,
                    p = function(e) {
                        var t = e.clientX,
                            i = e.clientY;
                        (Math.abs(c.left - t) > 5 || Math.abs(c.top - i) > 5) && e.stopImmediatePropagation()
                    },
                    m = function(t) {
                        t.preventDefault();
                        var n = Math.max(d.left - u + e.areaToBeVisible.width, t.clientX - o.left),
                            a = Math.max(d.top - f + e.areaToBeVisible.height, t.clientY - o.top);
                        n = Math.min(n, l + d.left - e.areaToBeVisible.width), a = Math.min(a, h + d.top - e.areaToBeVisible.height), i.length && (i[0].style.top = a + "px", i[0].style.left = n + "px"), "function" == typeof e.ondrag && e.ondrag(t), i.off("click", p).one("click", p)
                    },
                    g = function(i) {
                        i.preventDefault(), t.off("mousemove", m), "function" == typeof e.ondragend && e.ondragend(i)
                    };
                n.off("mousedown").on("mousedown", (function(n) {
                    if ((n.stopImmediatePropagation(), e.isClickoutside && "undefined" != typeof Clickoutside && Clickoutside.handleClickOnChild(n), "function" == typeof e.ondragstart) && !e.ondragstart(n)) return;
                    if (u = i.width(), f = i.height(), l = s.width(), h = s.height(), a && !r) {
                        var p = s[0].getBoundingClientRect();
                        d = {
                            left: p.left,
                            top: p.top
                        }
                    }
                    var y = i.offset();
                    if (a && r) {
                        var v = e.dragboundary.offset();
                        y.left = y.left - v.left, y.top = y.top - v.top
                    }
                    o.left = n.clientX - y.left, o.top = n.clientY - y.top, c = {
                        left: n.clientX,
                        top: n.clientY
                    }, t.on("mousemove", m), t.one("mouseup", g)
                }))
            }
        }, ZCJQuery.fn.setAsNonDraggable = function(e) {
            var t = void 0 !== e && !$WC.Util.isEmpty(e.draggablearea) && e.draggablearea.length ? e.draggablearea : this;
            0 !== t.length && (t.removeClass("ZCdrag"), t.off("mousedown"))
        }, ZCJQuery.fn.setAsResizable = function(e) {
            var t = ZCJQuery(document),
                i = ZCJQuery(window),
                n = ZCJQuery.extend({}, {
                    resizeBoundaryElem: i,
                    aspectRatio: 1,
                    widthRange: {
                        min: 245,
                        max: i.width()
                    },
                    heightRange: {
                        min: 154,
                        max: i.height()
                    },
                    avoidResizeUsingBorders: !1
                }, e),
                o = ZCJQuery(this),
                a = n.resizeBoundaryElem;
            a && (i = a);
            var r = 1 !== n.aspectRatio,
                s = n.callBack,
                d = {},
                c = {},
                l = {},
                h = 0,
                u = {},
                f = (o[0], "top_left_corner");

            function p(e, t, i) {
                return Math.min(Math.max(e, t), i)
            }

            function m(e) {
                var t = e ? 1 : -1;
                return {
                    width: p(c.width + t * d.x, n.widthRange.min, n.widthRange.max),
                    height: p(c.height + t * d.y, n.heightRange.min, n.heightRange.max),
                    aspectRatioWidth: p(c.width + d.y * (t * n.aspectRatio), n.widthRange.min, n.widthRange.max),
                    aspectRatioHeight: p(c.height + d.x / (t * n.aspectRatio), n.heightRange.min, n.heightRange.max)
                }
            }

            function g(e, t, i, n) {
                if (function(e, t) {
                        return e + t <= a.height()
                    }(n, t) && function(e, t) {
                        return e + t <= a.width()
                    }(i, e)) {
                    var r = "",
                        d = "",
                        c = "",
                        l = "";
                    n === u.top ? r = u.top : d = u.bottom, i === u.left ? c = u.left : l = u.right,
                        function(e, t, i, n, a, r) {
                            o.css({
                                width: e,
                                height: t,
                                top: i,
                                bottom: n,
                                left: a,
                                right: r
                            }), s(e, t)
                        }(e, t, r, d, c, l)
                }
            }
            var y = {
                    top_left_corner: function() {
                        var e = m(!1);
                        g(e.aspectRatioWidth, e.height, u.right, u.bottom)
                    },
                    top_border: function() {
                        var e = m(!1);
                        g(r ? e.aspectRatioWidth : c.width, e.height, u.right, u.bottom)
                    },
                    top_right_corner: function() {
                        var e = m(!0);
                        g(e.width, e.aspectRatioHeight, u.left, u.bottom)
                    },
                    right_border: function() {
                        var e = m(!0);
                        g(e.width, r ? e.aspectRatioHeight : c.height, u.left, u.bottom)
                    },
                    bottom_right_corner: function() {
                        var e = m(!0);
                        g(e.aspectRatioWidth, e.height, u.left, u.top)
                    },
                    bottom_border: function() {
                        var e = m(!0);
                        g(r ? e.aspectRatioWidth : c.width, e.height, u.left, u.top)
                    },
                    bottom_left_corner: function() {
                        var e = m(!1);
                        g(e.width, e.aspectRatioHeight, u.right, u.top)
                    },
                    left_border: function() {
                        var e = m(!1);
                        g(e.width, r ? e.aspectRatioHeight : c.height, u.right, u.top)
                    }
                },
                v = function(e) {
                    e.preventDefault(), d = {
                        x: e.pageX - l.x,
                        y: e.pageY - l.y
                    }, y[f](e)
                },
                C = function(e) {
                    t.off("mousemove", v)
                };
            if (!o.find("[enable_resize]").length) {
                var b = [{
                        className: "zc-av-top-left-corner",
                        keyName: "top_left_corner"
                    }, {
                        className: "zc-av-top-right-corner",
                        keyName: "top_right_corner"
                    }, {
                        className: "zc-av-bottom-right-corner",
                        keyName: "bottom_right_corner"
                    }, {
                        className: "zc-av-bottom-left-corner",
                        keyName: "bottom_left_corner"
                    }],
                    w = [{
                        className: "zc-av-top-border",
                        keyName: "top_border"
                    }, {
                        className: "zc-av-right-border",
                        keyName: "right_border"
                    }, {
                        className: "zc-av-bottom-border",
                        keyName: "bottom_border"
                    }, {
                        className: "zc-av-left-border",
                        keyName: "left_border"
                    }].concat(b);
                n.avoidResizeUsingBorders && (w = b);
                for (var E = "", T = 0; T < w.length; T++) E += '<div enable_resize class="zc-av-drag-handle ' + w[T].className + '" position=' + w[T].keyName + "></div>";
                o = o.append(E)
            }
            o.find("[enable_resize]").on("mousedown", (function(e) {
                e.stopImmediatePropagation(), c = {
                    width: o.width(),
                    height: o.height()
                }, l = {
                    x: e.pageX,
                    y: e.pageY
                }, h = o.position(), u = {
                    right: i.width() - h.left - c.width,
                    bottom: i.height() - h.top - c.height,
                    left: h.left,
                    top: h.top
                }, f = e.target.getAttribute("position"), t.on("mousemove", v), t.one("mouseup", C)
            }))
        }, ZCJQuery.fn.removeResizable = function() {
            ZCJQuery(this).find("[enable_resize]").remove()
        }, ZCJQuery.fn.isScrolledToView = function(e, t, i) {
            null != t && void 0 !== t || (t = 1), null != i && void 0 !== i || (i = 1);
            var n = e ? ZCJQuery(e) : ZCJQuery(window),
                o = {
                    top: n.offset().top,
                    left: n.offset().left
                };
            o.right = o.left + n.width(), o.bottom = o.top + n.height();
            var a = this.outerHeight(),
                r = this.outerWidth();
            if (!r || !a) return !1;
            var s = this.offset();
            if (s.right = s.left + r, s.bottom = s.top + a, !!(o.right < s.left || o.left > s.right || o.bottom < s.top || o.top > s.bottom)) return !1;
            var d = Math.min(1, (s.bottom - o.top) / a),
                c = Math.min(1, (o.bottom - s.top) / a);
            return Math.min(1, (s.right - o.left) / r) * Math.min(1, (o.right - s.left) / r) >= t && d * c >= i
        }, "function" != typeof ZCJQuery.escapeSelector && (ZCJQuery.escapeSelector = function(e) {
            return "string" == typeof e && e.length > 0 && (e = e.replace(/([!"#$%&'()*+,-./:;<=>?@[\]^`{|}~])/g, "\\$1")), e
        });
    var e = ZCJQuery.fn.find;
    ZCJQuery.fn.find = function(t) {
        return "#chatbody" != t && "#msgarea" != t || 1 != this.length ? e.apply(this, arguments) : e.apply(this, arguments).first()
    }
}
_defineReadOnlyProperty = function(e, t, i) {
    Object.defineProperty(e, t, {
        value: i,
        writable: !1
    })
}, _defineReadOnlyProperties = function(e, t) {
    for (var i in t) Object.defineProperty(e, i, {
        value: t[i],
        writable: !1
    })
}, isJQueryAvailable() && (void 0 === window.ZCJQuery && (window.ZCJQuery = window.jQuery), injectZCJQueryOverrides()), String.prototype.startsWith || (String.prototype.startsWith = function(e, t) {
    return t = t || 0, this.substr(t, e.length) === e
}), String.prototype.replaceBetween || (String.prototype.replaceBetween = function(e, t, i) {
    return this.substring(0, e) + i + this.substring(t)
}), Date.prototype.addDays || (Date.prototype.addDays = function(e) {
    this.setDate(this.getDate() + e)
}), Object.defineProperty(Array.prototype, "insert", {
    enumerable: !1,
    writable: !0,
    value: function(e, t) {
        this.splice(e, 0, t)
    }
}), Object.defineProperty(Array.prototype, "removeElement", {
    enumerable: !1,
    writable: !0,
    value: function(e) {
        var t = this.indexOf(e);
        t > -1 && this.splice(t, 1)
    }
}), void 0 !== HTMLElement.prototype.scrollIntoView && void 0 === HTMLElement.prototype.scrollIntoViewIfNeeded ? HTMLElement.prototype.scrollIntoViewIfNeeded = function(e) {
    this.scrollIntoView({
        block: e ? "start" : "nearest"
    })
} : void 0 === HTMLElement.prototype.scrollIntoView && void 0 !== HTMLElement.prototype.scrollIntoViewIfNeeded && (HTMLElement.prototype.scrollIntoView = function(e) {
    var t = "object" == typeof e && "start" === e.block;
    this.scrollIntoViewIfNeeded(t)
}), SessionTimers = function() {
    var e = {},
        t = void 0,
        i = {
            SECOND: 1e3,
            MINUTE: 6e4,
            HOUR: 36e5
        },
        n = {
            isUITimer: !0,
            separator: ":",
            interval: i.SECOND,
            showDays: !1,
            stickyHour: !1,
            type: "+",
            allowPauseAndResume: !1
        },
        o = function() {
            for (var t in e) {
                var i = e[t];
                i.config.isUITimer ? i.updateInUI() : i.executeCallBackOnTimeOut()
            }
        },
        a = function(e, t) {
            if (this.id = e, this.config = ZCJQuery.extend({}, n, t), this.config.startTime = this.config.startTime || $ZCUtil.getSyncedCurrentTime(), this.config.isUITimer) {
                this.isPaused = !1, this.pausedTime = 0, this.dayElem = null, this.hourElem = null, this.minuteElem = null, this.secondElem = null, this.isDayElemHidden = !0, this.isHourElemHidden = !0;
                var i = ZCJQuery("#" + ZCJQuery.escapeSelector(e));
                if (i.length) {
                    var o = this.isHourTimer() ? "hours" : this.isMinuteTimer() ? "minutes" : "seconds",
                        a = this.getCurrentDuration();
                    if (!i.find("[" + o + "]").length) {
                        var r = "{{hours}}{{minutes}}{{seconds}}";
                        this.config.showDays && (r = "{{days}}" + r);
                        var s = $WC.template.replace(r, {
                            days: this.config.showDays ? '<span days class="{{day_display_class}}">{{days_initial_value}}</span><span separator class="{{day_display_class}}">{{separator}}</span>' : "",
                            hours: '<span hours class="{{hour_display_class}}">{{hours_initial_value}}</span>',
                            minutes: this.isHourTimer() ? "" : '<span separator class="{{hour_display_class}}">{{separator}}</span><span minutes>{{minutes_initial_value}}</span>',
                            seconds: this.isSecondTimer() ? "<span separator>{{separator}}</span><span seconds>{{seconds_initial_value}}</span>" : ""
                        }, "InSecureHTML");
                        s = $WC.template.replace(s, {
                            day_display_class: this.config.showDays ? "" : "dN zc-av-dN",
                            days_initial_value: a.days,
                            hour_display_class: this.isSecondTimer() ? "dN zc-av-dN" : "",
                            separator: this.config.separator,
                            hours_initial_value: a.hours,
                            minutes_initial_value: a.minutes,
                            seconds_initial_value: a.seconds
                        }), i.append(s)
                    }
                    this.hourElem = i.find("[hours]"), this.minuteElem = i.find("[minutes]"), this.secondElem = i.find("[seconds]"), this.config.showDays && (this.dayElem = i.find("[days]"), this.isDayElemHidden = this.dayElem.hasClass("dN") || this.dayElem.hasClass("zc-av-dN")), this.isHourElemHidden = this.hourElem.hasClass("dN") || this.hourElem.hasClass("zc-av-dN"), this.updateInUI()
                }
            }
        };
    return a.prototype = {
        updateInUI: function() {
            if (!this.isPaused) {
                var e = this.getCurrentDuration();
                this.dayElem && this.dayElem.text(e.days), this.hourElem.text(e.hours), this.minuteElem.text(e.minutes), this.secondElem.text(e.seconds), this.updateDurationVisibility(e)
            }
        },
        executeCallBackOnTimeOut: function() {
            Date.now() - this.config.startTime > this.config.timeout && ("function" == typeof this.config.onTimeout && this.config.onTimeout(), SessionTimers.clearTimer(this.id))
        },
        getCurrentDuration: function() {
            var e = {
                hours: "00",
                minutes: "00",
                seconds: "00"
            };
            this.config.showDays && (e.days = "00");
            var t = "function" == typeof this.config.getSessionCurrentTime ? this.config.getSessionCurrentTime() : $ZCUtil.getSyncedCurrentTime(),
                i = "-" === this.config.type ? (this.config.startTime - t) / 1e3 : (t - this.config.startTime) / 1e3;
            if ("undefined" == typeof $ZCDate && (window.$ZCDate = window.$Date), i > 0) {
                if (this.config.showDays) {
                    e.days = $ZCDate.append0(Math.floor(i / 86400)), i %= 86400
                }
                e.hours = $ZCDate.append0(Math.floor(i / 3600)), i %= 3600, e.minutes = $ZCDate.append0(Math.floor(i / 60)), e.seconds = $ZCDate.append0(Math.floor(i % 60))
            }
            return e
        },
        isHourTimer: function() {
            return this.config.interval == SessionTimers.intervals.HOUR
        },
        isMinuteTimer: function() {
            return this.config.interval == SessionTimers.intervals.MINUTE
        },
        isSecondTimer: function() {
            return this.config.interval == SessionTimers.intervals.SECOND
        },
        updateDurationVisibility: function(e) {
            if (void 0 !== e.days) {
                var t = e.days <= 0;
                this.isDayElemHidden !== t && (this.isDayElemHidden = t, this.dayElem.add(this.dayElem.next()).toggleClass("dN zc-av-dN", t))
            }
            if (!(this.config.stickyHour || e.days > 0) && this.isSecondTimer()) {
                var i = e.hours <= 0;
                this.isHourElemHidden !== i && (this.isHourElemHidden = i, this.hourElem.add(this.hourElem.next()).toggleClass("dN zc-av-dN", i))
            }
        },
        pause: function() {
            this.config.allowPauseAndResume && !this.isPaused && (this.isPaused = !0, this.pausedTime = "function" == typeof this.config.getSessionCurrentTime ? this.config.getSessionCurrentTime() : $ZCUtil.getSyncedCurrentTime())
        },
        resume: function() {
            if (this.config.allowPauseAndResume && this.isPaused) {
                this.isPaused = !1;
                var e = "function" == typeof this.config.getSessionCurrentTime ? this.config.getSessionCurrentTime() : $ZCUtil.getSyncedCurrentTime();
                this.config.startTime = this.config.startTime + (e - this.pausedTime), this.pausedTime = 0
            }
        }
    }, {
        intervals: i,
        setTimer: function(n, r) {
            if (!e[n]) {
                var s = new a(n, r);
                if (!s.hourElem && !s.MinuteElem && !s.secondElem && s.config.isUITimer) return;
                e[n] = s, void 0 === t && (t = setInterval(o, i.SECOND))
            }
        },
        pauseTimer: function(t) {
            var i = e[t];
            i && i.pause()
        },
        resumeTimer: function(t) {
            var i = e[t];
            i && i.resume()
        },
        clearTimer: function(i) {
            e[i] && (delete e[i], 0 === Object.keys(e).length && (clearInterval(t), t = void 0))
        }
    }
}(), Clickoutside = {
    currentchain: [],
    data: {},
    bind: function(e) {
        var t;
        if (e.closeOnClickSrc = void 0 === e.closeOnClickSrc || e.closeOnClickSrc, void 0 !== e.event && (t = e.event, e.event.stopPropagation && e.event.stopPropagation(), delete e.event), this.currentchain.length)
            if (this.isDuplicateSource(e.srcid)) {
                if (e.closeOnClickSrc) return this.triggerCallback(e.destid, !0), !1
            } else this.triggerCallback(e.destid, void 0, t, e.srcid), "function" == typeof e.customShow ? e.customShow(e) : document.getElementById(e.destid).style.display = "block", this.addData(e);
        else this.addData(e), "function" == typeof e.customShow ? e.customShow(e) : document.getElementById(e.destid).style.display = "block";
        return !0
    },
    handleClick: function(e) {
        "undefined" != typeof ApplicationsUI && ApplicationsUI.hasDeletePopupShown || this.triggerCallback(e.target, void 0, e)
    },
    handleEscape: function() {
        var e = this.currentchain.length,
            t = e - 1;
        return !(!e || !0 === this.data[this.currentchain[t]].ignoreesc || "undefined" != typeof ApplicationsUI && ApplicationsUI.hasDeletePopupShown) && this.executeCallback(t, e, !0)
    },
    closeAll: function() {
        for (; this.currentchain.length;) this.handleEscape()
    },
    handleClickOnChild: function(e, t) {
        e.stopPropagation(), void 0 === t && (t = e.target), this.triggerCallback(t, !0, e)
    },
    clearCurrentElement: function(e) {
        var t = this.currentchain.indexOf(e); - 1 !== t && (delete this.data[e], this.currentchain.splice(t, 1))
    },
    clear: function(e) {
        var t = this.currentchain.indexOf(e); - 1 !== t && this.clearEntries(t, this.currentchain.length)
    },
    addData: function(e) {
        this.currentchain.push(e.destid), this.data[e.destid] = e
    },
    isDuplicateSource: function(e) {
        if (e)
            for (var t in this.data)
                if (this.data[t].srcid === e) return !0
    },
    triggerCallback: function(e, t, i, n) {
        var o = this.currentchain.length,
            a = 0,
            r = this.findLCA(e);
        void 0 !== r && (a = this.currentchain.indexOf(r), a = !0 === t ? a : a + 1), a < o && this.executeCallback(a, o, void 0, i, n, e)
    },
    findLCA: function(e) {
        for ("string" == typeof e && (e = document.getElementById(e)); e;) {
            if (-1 !== this.currentchain.indexOf(e.id)) return e.id;
            e = e.parentNode
        }
    },
    executeCallback: function(e, t, i, n, o, a) {
        for (var r = !1, s = {}, d = t - 1; d >= e; d--) {
            var c = document.getElementById(this.currentchain[d]);
            if (c) {
                var l = Clickoutside.data[this.currentchain[d]],
                    h = !1,
                    u = !1;
                if ("function" == typeof l.doNotClose && (h = l.doNotClose(l, i, n, s, o, a)), !h) {
                    u = !0, r = !0, "function" == typeof l.customHide ? l.customHide(l, n) : c.style.display = "none";
                    var f = this.data[this.currentchain[d]];
                    f && "function" == typeof f.callback && f.callback(f.srcid, f.destid), this.clear(this.currentchain[d])
                }
                l.isClosed = u, s[l.destid] = l
            } else this.clear(this.currentchain[d])
        }
        return r
    },
    clearEntries: function(e, t) {
        for (var i = t - 1; i >= e; i--) delete this.data[this.currentchain[i]];
        this.currentchain.splice(e)
    },
    clearAllChilds: function(e) {
        for (var t = this.currentchain.length, i = 0; i < t; i++) this.data[this.currentchain[i]].parent_id === e && (delete this.data[this.currentchain[i]], this.currentchain.splice(i, 1))
    }
};
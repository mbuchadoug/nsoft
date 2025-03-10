var ZCJsAjax = {};
ZCJsAjax = {
    CSRF_HEADER: "X-ZCSRF-TOKEN",
    NETWORK_PREFIX: "/network/",
    COMPANY_PREFIX: "/company/",
    AV_CUSTOM_DOMAIN_PREFIX: "/_avcliq",
    MODIFY_ZAAID_HEADER: "x-modify-zaaid",
    IS_INIT: !1,
    init: function() {
        var e = window.location.pathname;
        e.startsWith(this.NETWORK_PREFIX) ? this.SCREEN_NAME = e.split("/")[2] : e.startsWith(this.COMPANY_PREFIX) && (this.APPACCOUNT_ID = e.split("/")[2]), this.IS_INIT = !0
    },
    isIntranetRequest: function() {
        return void 0 === this.SCREEN_NAME || null === this.SCREEN_NAME || "" === this.SCREEN_NAME
    },
    getURLPrefix: function() {
        var e = $zcg._COMMON_DOMAIN_BASED_UI ? $zcg._CLIQ_CONTEXT : "";
        return this.IS_INIT || this.init(), this.isIntranetRequest() ? (this.APPACCOUNT_ID && (e = e + this.COMPANY_PREFIX + this.APPACCOUNT_ID), e) : this.NETWORK_PREFIX + this.SCREEN_NAME
    },
    removePrefix: function(e) {
        if (e.startsWith("/guest") && (e = e.substr(e.indexOf("/v2"))), e.startsWith(this.NETWORK_PREFIX)) {
            var t = e.split("/")[2],
                a = this.NETWORK_PREFIX + t;
            e = e.split(a)[1]
        }
        if (e.startsWith($zcg._CLIQ_CONTEXT) && (e = e.split($zcg._CLIQ_CONTEXT)[1]), e.startsWith(this.COMPANY_PREFIX)) {
            a = e.split("/").splice(0, 3).join("/");
            e = e.split(a)[1]
        }
        return e.startsWith(this.AV_CUSTOM_DOMAIN_PREFIX) && (e = e.split(this.AV_CUSTOM_DOMAIN_PREFIX)[1]), e
    },
    sendRequestViaBeacon: function(e) {
        if (e.type && "POST" === e.type) {
            var t = this.getURLPrefix() + e.url,
                a = new FormData;
            if (e.data)
                for (const t in e.data) a.append(t, e.data[t]);
            a.append($zcg._CFPARAMNAME, this.getCookie($zcg._CFCOOKIENAME)), a.append("nocache", (new Date).getTime()), navigator.sendBeacon(t, a)
        }
    },
    ajax: function(e) {
        var t;
        if (t = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"), e.headers = e.headers || {}, e.headers[$zcg.JSON_EXCEPTION_HEADER] = "true", e.headers[this.CSRF_HEADER] = $zcg._CFPARAMNAME + "=" + this.getCookie($zcg._CFCOOKIENAME), e.avoidAPIPrefix || (e.url = this.getURLPrefix() + e.url), void 0 === e.type && (e.type = "GET"), "GET" === e.type ? "object" == typeof e.data && (e.data.nocache = (new Date).getTime(), e.url += this.serialize(e.data)) : "application/json" === e.contenttype && (e.data = JSON.stringify(e.data), e.headers.ContentType = "application/json"), t.open(e.type, e.url, !0), e.progress && t.upload) try {
            t.upload.addEventListener("progress", (function(t) {
                e.progress(t)
            }), !1), t.addEventListener("progress", (function(t) {
                e.progress(t)
            }), !1)
        } catch (e) {}
        if (void 0 !== e.headers)
            for (var a in e.headers) t.setRequestHeader(a, e.headers[a]);
        return t.onreadystatechange = function() {
            if (4 == t.readyState) {
                e.url = ZCJsAjax.removePrefix(e.url), ZCJsAjax.handleAppaccountPrefix(t);
                var a = t.responseText;
                try {
                    if ("object" != typeof a && (a = JSON.parse(a)), a && "ip_restricted" == a.code) return void(window.location.href = $zcg._SERVERURL + "/iprestricted.do");
                    if (Array.isArray(a)) {
                        if (0 === a.length) return;
                        a = a[0]
                    }
                } catch (e) {}
                if (e.url.startsWith("/v2/")) {
                    var n = a;
                    if (" undefined" === t.status || 200 != t.status && 202 != t.status && 204 != t.status && 304 != t.status)
                        if ("true" == t.getResponseHeader("reauth_required")) {
                            var i = "width=" + window.innerWidth / 2 + ",height=" + window.innerHeight / 1.5 + ",left=" + window.innerWidth / 4 + ",top=" + window.innerHeight / 4,
                                s = t.getResponseHeader("reauth_url") + "&post=true";
                            window.open(s, "", i), e.error(n)
                        } else "function" == typeof e.error && e.error(n);
                    else e.success(n)
                } else if (void 0 !== a.status) {
                    var r = a.status;
                    if ("OK" === r || "SUCCESS" === r) {
                        var o = {}; - 1 === e.url.indexOf("/v2/") ? (o.data = a.data, o.meta = a.meta) : o = a, e.success(o)
                    } else if ("FAILED" === r) {
                        var c = a.data;
                        c.desc = a.desc, e.error(c)
                    }
                } else try {
                    n = -1 === e.url.indexOf("/v2/") ? a.objString : a, " undefined" === t.status || 200 != t.status && 202 != t.status && 204 != t.status && 304 != t.status ? (void 0 === n && a && a.code && e.url.indexOf("/v1/imports") >= 0 && (n = a), e.error(n)) : e.success(n)
                } catch (t) {
                    e.error(n)
                }
            }
        }, t.send(e.data), t
    },
    serialize: function(e) {
        var t = [];
        for (var a in e) e.hasOwnProperty(a) && t.push(encodeURIComponent(a) + "=" + encodeURIComponent(e[a]));
        return "?" + t.join("&")
    },
    getCookie: function(e) {
        var t = document.cookie.indexOf(e + "="),
            a = document.cookie.length,
            n = null;
        if (-1 !== t) {
            var i = e.length;
            beginIndex = t + i, -1 !== (n = document.cookie.substr(beginIndex + 1, a)).indexOf(";") && (n = n.substring(0, n.indexOf(";")))
        }
        return n
    },
    formData: function(e, t, a, n) {
        var i = new FormData;
        for (var s in e) i.append(s, e[s]);
        if (n && i.append($zcg._CFPARAMNAME, this.getCookie($zcg._CFCOOKIENAME)), void 0 !== a) {
            s = 0;
            for (var r = a.length; s < r; s++) {
                var o = a[s];
                void 0 !== o[1] ? i.append(t, o[0], o[1]) : i.append(t, o[0])
            }
        }
        return i
    },
    handleAppaccountPrefix: function(e) {
        var t = e.getResponseHeader(ZCJsAjax.MODIFY_ZAAID_HEADER);
        if (void 0 !== e && null != t) {
            var a = window.location.pathname,
                n = "";
            "" !== t && (n = ZCJsAjax.COMPANY_PREFIX + t), a = a.replace(/\/company\/[0-9]+/, n), this.APPACCOUNT_ID = t, window.location.pathname !== a && window.history.pushState({}, "", window.location.origin + a)
        }
    }
};
var AVCliqUtil = {},
    AVCliqConstants = {},
    AVCliqLocalStorage = {},
    AVCliqAPI = {
        ResourceTimingAPI: void 0,
        BroadcastChannelAPI: void 0,
        BroadcastStorage: void 0
    };

function registerWMS() {
    _WMSCONT = "_wms", WmsLite.setNoDomainChange(), WmsLite.setConfig(WMSSessionConfig.CROSS_PRD), $zcg._WMSCLIENTSRIVALUES && WmsLite.setClientSRIValues($zcg._WMSCLIENTSRIVALUES), void 0 !== $zcg._ANONID ? ($zcg._ZUID = $zcg._ANONID, WmsLite.registerAnnon($zcg._PRD, $zcg._ANONID, $zcg._GUEST_NAME)) : WmsLite.register($zcg._PRD, $zcg._ZUID)
}
AVCliqConstants = {
    moduleName: "avcalls",
    eType: {
        INTERNAL_API: "10",
        AJAX_API: "11",
        ON_LOAD_MSG: "100",
        BROADCAST_CHANNEL_MSG: "101"
    },
    requestStatus: {
        PENDING: 0,
        COMPLETED: 1,
        FAILED: -1
    },
    localStorage_cleanup_timeout: 3e4
}, window.onload = function(e) {
    var t = window.location != window.parent.location ? document.referrer : document.location.href;
    t && "" !== t || (t = $zcg._AV_FRAME_ORIGIN), t && (AVCliqUtil.setParentDomain(t), ZCJsAjax.init(), AVCliqAPI.BroadcastChannelAPI.initialize(), AVCliqUtil.postMessageToParent({
        module: AVCliqConstants.moduleName,
        eType: AVCliqConstants.eType.ON_LOAD_MSG
    }))
}, window.addEventListener("message", e => {
    if (!AVCliqUtil.isValidDomain(e)) throw new Error("Invalid cross domain access");
    if ("string" == typeof e.data) {
        var t = JSON.parse(e.data);
        if (t.module === AVCliqConstants.moduleName) {
            var a = t.reqId,
                n = t.eType;
            if (n === AVCliqConstants.eType.INTERNAL_API) {
                var i = AVCliqAPI[t.apiName][t.apiMethod](...t.apiParams);
                AVCliqUtil.postMessageToParent({
                    eType: n,
                    reqId: a,
                    module: AVCliqConstants.moduleName,
                    successResp: i || ""
                })
            } else if (n === AVCliqConstants.eType.AJAX_API) {
                if (t.params && t.params.sendViaBeacon) return void ZCJsAjax.sendRequestViaBeacon(t.params);
                let e = e => {
                    var t = e.getAllResponseHeaders().trim().split(/[\r\n]+/),
                        a = {};
                    return t.forEach((function(e) {
                        var t = e.split(": "),
                            n = t.shift(),
                            i = t.join(": ");
                        a[n] = i
                    })), a
                };
                var s = function(t, i, s) {
                        AVCliqUtil.postMessageToParent({
                            eType: n,
                            reqId: a,
                            module: AVCliqConstants.moduleName,
                            successResp: t,
                            headers: i ? e(i) : {},
                            banner: s
                        })
                    },
                    r = function(t, i, s) {
                        AVCliqUtil.postMessageToParent({
                            eType: n,
                            reqId: a,
                            module: AVCliqConstants.moduleName,
                            errorResp: t,
                            headers: i ? e(i) : {},
                            banner: s
                        })
                    };
                AVCliqUtil.sendHttpReq(t.params, s, r)
            }
        }
    }
}, !1), AVCliqUtil = {
    _parentDomain: void 0,
    subscribePendingRequests: function(e, t) {
        AVCliqAPI.BroadcastStorage.subscribe(e, e => {
            if ("set" === e.action) {
                var a = JSON.parse(e.value),
                    n = parseInt(AVCliqLocalStorage.getItem(e.key));
                n === AVCliqConstants.requestStatus.COMPLETED && "function" == typeof t.success ? t.success(a) : n === AVCliqConstants.requestStatus.FAILED && "function" == typeof t.error && t.error(a)
            }
        })
    },
    setParentDomain: function(e) {
        this._parentDomain = e
    },
    getParentDomain: function() {
        return this._parentDomain
    },
    isValidDomain: function(e) {
        var t = new URL(e.origin).host,
            a = window.location.host;
        return this.getBaseDomain(t) === this.getBaseDomain(a)
    },
    getBaseDomain: function(e) {
        var t = e.split(".");
        return t.slice(t.length - 2, t.length).join(".")
    },
    constructFormData: function(e, t) {
        var a = [new File([e.fileData], e.fileName, {
            type: "text/plain"
        }), e.fileName];
        return ZCJsAjax.formData(e.formDataParams, e.fileParamName, [a], t)
    },
    canSyncRequestAcrossTabs: function(e) {
        return e.syncRequestAcrossTabs
    },
    performActionBasedOnRequestState: function(e, t, a, n, i) {
        var s = e.uniqueSyncId;
        switch (parseInt(t)) {
            case AVCliqConstants.requestStatus.COMPLETED:
                if (null === (r = AVCliqAPI.BroadcastStorage.getItem(s))) {
                    AVCliqUtil.performAjaxRequest(e, a, n, i);
                    break
                }
                n(JSON.parse(r), void 0, a);
                break;
            case AVCliqConstants.requestStatus.FAILED:
                var r;
                if (null === (r = AVCliqAPI.BroadcastStorage.getItem(s))) {
                    AVCliqUtil.performAjaxRequest(e, a, n, i);
                    break
                }
                i(JSON.parse(r), void 0, a);
                break;
            case AVCliqConstants.requestStatus.PENDING:
                AVCliqUtil.subscribePendingRequests(s, {
                    success: n,
                    error: i
                })
        }
    },
    sendHttpReq: function(e, t, a) {
        if (void 0 !== e.data && (e.contenttype = "application/json"), e.fileHash) {
            if (e.sendStringAsFile) e.data = this.constructFormData(e.fileHash, e.type);
            else if (e.fileHash.fileData) {
                var n = [];
                for (var i in e.fileHash.fileData) n.push([new File([i[0]], i[1]), i[1]]);
                e.data = ZCJsAjax.formData(e.fileHash.formDataParams, e.fileHash.fileParamName, n, e.fileHash.isPost)
            } else e.data = ZCJsAjax.formData(e.fileHash.formDataParams, void 0, [], e.fileHash.isPost);
            delete e.fileHash
        }
        let s = {};
        if (void 0 !== e.status && (s = e.status), AVCliqUtil.canSyncRequestAcrossTabs(e)) {
            var r = AVCliqLocalStorage.getItem(e.uniqueSyncId);
            return null !== r ? void AVCliqUtil.performActionBasedOnRequestState(e, r, s, t, a) : void AVCliqLocalStorage.setItem(e.uniqueSyncId, AVCliqConstants.requestStatus.PENDING, (function() {
                setTimeout((function() {
                    AVCliqLocalStorage.removeItem(e.uniqueSyncId), AVCliqAPI.BroadcastStorage.removeItem(e.uniqueSyncId)
                }), AVCliqConstants.localStorage_cleanup_timeout), AVCliqUtil.performAjaxRequest(e, s, t, a)
            }), (function(n) {
                n === AVCliqLocalStorage.errorCodes.DUPLICATE_KEY_CANNOT_BE_ADDED && AVCliqUtil.performActionBasedOnRequestState(e, AVCliqLocalStorage.getItem(e.uniqueSyncId), s, t, a)
            }))
        }
        AVCliqUtil.performAjaxRequest(e, s, t, a)
    },
    performAjaxRequest: function(e, t, a, n) {
        var i = ZCJsAjax.ajax(Object.assign(e, {
            success: function(n) {
                AVCliqUtil.canSyncRequestAcrossTabs(e) && (localStorage.setItem(e.uniqueSyncId, AVCliqConstants.requestStatus.COMPLETED), AVCliqAPI.BroadcastStorage.setItem(e.uniqueSyncId, JSON.stringify(n))), a(n, i, t)
            },
            error: function(a) {
                AVCliqUtil.canSyncRequestAcrossTabs(e) && (localStorage.setItem(e.uniqueSyncId, AVCliqConstants.requestStatus.FAILED), AVCliqAPI.BroadcastStorage.setItem(e.uniqueSyncId, JSON.stringify(a))), n(a, i, t)
            }
        }))
    },
    postMessageToParent: function(e) {
        window.parent.postMessage(JSON.stringify(e), this.getParentDomain())
    }
}, AVCliqLocalStorage = function() {
    var e = localStorage,
        t = {},
        a = {},
        n = {
            DUPLICATE_KEY_CANNOT_BE_ADDED: -11
        };
    return window.addEventListener("storage", e => {
        var i = e.key;
        null === e.oldValue && t[i] && (clearTimeout(a[i]), t[i].error(n.DUPLICATE_KEY_CANNOT_BE_ADDED), delete t[i])
    }), {
        errorCodes: n,
        setItem: function(s, r, o, c) {
            if (null !== i(s)) return void c(n.DUPLICATE_KEY_CANNOT_BE_ADDED);
            t[s] = {
                success: o,
                error: c
            }, e.setItem(s, r), a[s] = setTimeout(() => {
                t[s] && (t[s].success(), delete t[s])
            }, 100)
        },
        getItem: i,
        removeItem: function(t) {
            e.removeItem(t)
        }
    };

    function i(t) {
        return e.getItem(t)
    }
}(), AVCliqAPI.ResourceTimingAPI = function() {
    var e = {},
        t = function() {
            return "undefined" != typeof performance
        };
    return {
        isSupported: t,
        startPerformanceRecording: function(a) {
            t() && ("function" == typeof performance.clearResourceTimings && 0 === Object.keys(e).length && performance.clearResourceTimings(), e[a] = {
                startTime: Date.now()
            })
        },
        stopRecordingAndGetReport: function(t) {
            if (void 0 !== e[t]) {
                var a = e[t];
                return a.id = t, a.endTime = Date.now(), a.recordingDuration = a.endTime - a.startTime, delete e[t],
                    function(e) {
                        var t, a = performance.getEntriesByType("resource");
                        if (!(void 0 === a || a.length <= 0)) {
                            t = "Calculating network resource load time for : " + JSON.stringify(e, null, 4);
                            for (var n = 0; n < a.length; n++) {
                                var i = {
                                    name: a[n].name,
                                    redirect_time: a[n].redirectEnd - a[n].redirectStart,
                                    dns_time: a[n].domainLookupEnd - a[n].domainLookupStart,
                                    tcp_handshake_time: a[n].connectEnd - a[n].connectStart,
                                    secure_conn_time: a[n].secureConnectionStart > 0 ? a[n].connectEnd - a[n].secureConnectionStart : "0",
                                    response_time: a[n].responseEnd - a[n].responseStart,
                                    fetch_till_respend: a[n].fetchStart > 0 ? a[n].responseEnd - a[n].fetchStart : "0",
                                    reqstart_till_respend: a[n].requestStart > 0 ? a[n].responseEnd - a[n].requestStart : "0",
                                    start_till_respend: a[n].startTime > 0 ? a[n].responseEnd - a[n].startTime : "0"
                                };
                                t += "\n[" + n + "] --\x3e " + JSON.stringify(i, null, 4)
                            }
                            return t
                        }
                        t = "No performance records available for :" + JSON.stringify(e, null, 4)
                    }(a)
            }
        }
    }
}(), AVCliqAPI.BroadcastChannelAPI = function() {
    let e = void 0,
        t = !1;
    const a = {
        channel_name: "avcliq_broadcast_channel",
        msgBoradcast: "msgBroadcast",
        storageSync: "storageSync"
    };

    function n(a, n) {
        if (!t) throw new Error("Broadcast channel is not initialized");
        e.postMessage(JSON.stringify({
            name: a,
            time: (new Date).getTime(),
            data: n
        }))
    }
    return {
        updateBroadcastStorage: function(e, t) {
            n(a.storageSync, {
                action: "set",
                key: e,
                value: t
            })
        },
        deleteFromBroadcastStorage: function(e) {
            n(a.storageSync, {
                action: "reset",
                key: e
            })
        },
        initialize: function() {
            t = !0, (e = new BroadcastChannel(a.channel_name)).onmessage = function(e) {
                var t = JSON.parse(e.data);
                switch (t.name) {
                    case a.msgBoradcast:
                        ! function(e) {
                            AVCliqUtil.postMessageToParent({
                                eType: AVCliqConstants.eType.BROADCAST_CHANNEL_MSG,
                                module: AVCliqConstants.moduleName,
                                message: e.data
                            })
                        }(t);
                        break;
                    case a.storageSync:
                        ! function(e) {
                            AVCliqAPI.BroadcastStorage.handleSync(e)
                        }(t)
                }
            }
        },
        close: function() {
            e.close()
        },
        sendMessage: function(e) {
            n(a.msgBoradcast, e)
        }
    }
}(), AVCliqAPI.BroadcastStorage = function() {
    let e = {},
        t = {};
    return {
        getItem: function(t) {
            return e[t] || null
        },
        setItem: function(t, a) {
            e[t] = a, AVCliqAPI.BroadcastChannelAPI.updateBroadcastStorage(t, a)
        },
        removeItem: function(t) {
            delete e[t], AVCliqAPI.BroadcastChannelAPI.deleteFromBroadcastStorage(t)
        },
        subscribe: function(e, a) {
            t[e] = a
        },
        handleSync: function(a) {
            "set" === a.data.action ? e[a.data.key] = a.data.value : "reset" === a.data.action && delete e[a.data.key], "function" == typeof t[a.data.key] && (t[a.data.key](a.data), "reset" === a.data.action && delete t[a.data.key])
        }
    }
}();
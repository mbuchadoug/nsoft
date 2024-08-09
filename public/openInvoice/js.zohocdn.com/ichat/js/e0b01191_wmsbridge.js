var wmsconnectorframe, isWSSupported, setWSSupport, authtype, rtcatoken, rtcptabid, rtcpnname, unregister, onUnregisterSuccess, pdomain = "*",
    wmslasttokenrefresh = 0,
    isConnectivityInitialized = !1,
    isWMSFrameLoaded = !1;

function triggerbind(e, n, t) {
    e = e || getZuid(), n = n || getRawSid(), t = t || getSid();
    var i = {
        uid: e
    };
    n && (i.rsid = n), t && (i.sid = t), wmsconnectorframe.contentWindow.postMessage('["bind",' + JSON.stringify(i) + "]", pdomain)
}

function triggerRTTPing() {
    wmsconnectorframe.contentWindow.postMessage('["triggerRTTPing",""]', pdomain)
}

function abortBind() {
    wmsconnectorframe.contentWindow.postMessage('["abortbind",{}]', pdomain)
}

function clearAndRegister() {
    var e = {
        config: getWmsConfig()
    };
    wmsconnectorframe.contentWindow.postMessage('["clearregister",' + JSON.stringify(e) + "]", pdomain)
}

function setIdleStatusInClient(e) {
    var n = {
        isidle: e
    };
    wmsconnectorframe.contentWindow.postMessage('["sessionidle",' + JSON.stringify(n) + "]", pdomain)
}

function updateOAuthCredInBridge() {
    wmsconnectorframe.contentWindow.postMessage('["oauthcredentials",' + JSON.stringify(getWMSOAuthCredentials()) + "]", pdomain)
}

function updatePresenceKeys(e) {
    wmsconnectorframe.contentWindow.postMessage('["presencekeys",' + JSON.stringify(formatPresenceKeys(e)) + "]", pdomain)
}

function assignBridgeVariables() {
    if (!1 === isCrossOriginAllowed()) {
        window.getWmsConfig = window.parent.getWmsConfig, window.getNickName = window.parent.getNickName, window.getZuid = window.parent.getZuid, window.getSid = window.parent.getSid, window.getRawSid = window.parent.getRawSid, window.isdisablewms = window.parent.isdisablewms, window.getWmsContacts = window.parent.getWmsContacts, window.updateWmsContacts = window.parent.updateWmsContacts, window.getAuthType = window.parent._getAuthType || function() {}, window.getAuthToken = window.parent.getAuthToken || function() {}, window.getAuthScope = window.parent.getAuthScope || function() {}, window.getZAID = window.parent.getZAID || function() {}, window.getWmsTabId = window.parent.getWmsTabId || function() {}, window.isLongPollingForced = window.parent.isLongPollingForced, window.getWMSOAuthCredentials = window.parent.getWMSOAuthCredentials || function() {}, window.getWmsXA = window.parent.getWmsXA || function() {}, window.getNewClientPortalAuthentication = window.parent.getNewClientPortalAuthentication || function() {}, window.getWMSRTCAccessToken = window.parent.getWMSRTCAccessToken || function() {}, "function" == typeof window.parent.WebMessanger ? (window.parent.WebMessanger.triggerbind = window.triggerbind, window.parent.WebMessanger.abortBind = window.abortBind, window.parent.WebMessanger.clearAndRegister = window.clearAndRegister, window.parent.WebMessanger.setIdleStatusInClient = window.setIdleStatusInClient, window.parent.WebMessanger.updateOAuthCredInBridge = window.updateOAuthCredInBridge, window.parent.WebMessanger.initializeConnectivity = window.initializeConnectivity, window.parent.WebMessanger.triggerRTTPing = window.triggerRTTPing, window.parent.WebMessanger.unregister = window.unregister, window.parent.WebMessanger.updatePresenceKeys = window.updatePresenceKeys) : "function" == typeof window.parent.WmsLite && (window.parent.WmsLite.triggerbind = window.triggerbind, window.parent.WmsLite.abortBind = window.abortBind, window.parent.WmsLite.clearAndRegister = window.clearAndRegister, window.parent.WmsLite.setIdleStatusInClient = window.setIdleStatusInClient, window.parent.WmsLite.updateOAuthCredInBridge = window.updateOAuthCredInBridge, window.parent.WmsLite.triggerRTTPing = window.triggerRTTPing, window.parent.WmsLite.unregister = window.unregister, window.parent.WmsLite.updatePresenceKeys = window.updatePresenceKeys);
        try {
            window.handlePexEvent = window.parent.PexBridge.handleEvent, window.parent.PexBridge.submitEvent = window.submitEvent
        } catch (e) {}
    } else isCrossOriginAllowed() && (window.getWMSRTCAccessToken = function() {
        return rtcatoken
    }, window.getAuthType = function() {
        return authtype
    }, window.getWmsTabId = function() {
        return rtcptabid
    }, window.getNickName = function() {
        return rtcpnname
    })
}

function initializeConnectivity(e) {
    if ("undefined" == typeof JSON) {
        var n = document.createElement("script"),
            t = window.location.protocol,
            i = "https:" === t ? staticdetails.staticversion + "_https" : staticdetails.staticversion;
        n.type = "text/javascript", n.src = t + "//" + staticdetails.jsstaticdomain + "/ichat/" + i + "/js/8b9999fd_json2.min.js", document.body.appendChild(n), attachonload.call(n, o)
    } else o();

    function o() {
        if (!1 !== isWMSFrameLoaded)
            if (!isCrossOriginAllowed() || 0 !== uname.indexOf("RT_2") || rtcatoken || authtype) {
                if (!isConnectivityInitialized) {
                    isConnectivityInitialized = !0, callParentMethod("updateDebugInfo", ["Init connection"]);
                    var n = {
                        prd: prd,
                        sdomain: _SDOMAIN,
                        sstservice: _SSTSERVICE,
                        tokensetbyiam: !0
                    };
                    if (n.config = "function" == typeof getWmsConfig && getWmsConfig() || _SESSIONCONFIG, n.uname = "function" == typeof getUserName && getUserName(), n.zuid = "function" == typeof getZuid && getZuid() || uname, n.nname = "function" == typeof getNickName && getNickName(), n.authtype = "function" == typeof getAuthType && getAuthType(), n.authtoken = "function" == typeof getAuthToken && getAuthToken(), n.authscope = "function" == typeof getAuthScope && getAuthScope(), n.zaid = "function" == typeof getZAID && getZAID(), n.tabid = "function" == typeof getWmsTabId && getWmsTabId() || "undefined" != typeof _tabid && _tabid, e && (n.dcswitch = !0, n.sid = "function" == typeof getSid && getSid(), n.xa = "function" == typeof getWmsXA && getWmsXA()), n._uselp = _uselp, "function" == typeof isLongPollingForced && "true" === isLongPollingForced() && (n._uselp = "true"), 9 == n.authtype && (n.oauthcredentials = getWMSOAuthCredentials()), 13 == n.authtype && (n.rtcatoken = getWMSRTCAccessToken()), _WMSSETTINGS && _WMSSETTINGS.adminsettings && _WMSSETTINGS.adminsettings.presence_keys) {
                        var t = _WMSSETTINGS.adminsettings.presence_keys;
                        t.length && (n.presence_keys = formatPresenceKeys(t))
                    }
                    "undefined" != typeof _USERCONFIG && _USERCONFIG.backupwmsdomains && (n.backupdomains = _USERCONFIG.backupwmsdomains), window.wmsencryption_enabled && (n.encryption_enbled = window.wmsencryption_enabled || !1, n.securityjsurl = window.securityjsurl, n.securityjssrivalue = window.securityjssrivalue), wmsconnectorframe.contentWindow.postMessage('["register",' + JSON.stringify(n) + "]", pdomain)
                }
            } else callParentMethod("getrtcauthdetails")
    }
}

function formatPresenceKeys(e) {
    for (var n = {}, t = 0; t < e.length; t++) {
        var i = e[t].topic,
            o = e[t].header ? e[t].header : "";
        n[i] = o
    }
    return n
}

function attachonload(e) {
    void 0 !== this.readyState ? this.onreadystatechange = function() {
        "loaded" != this.readyState && "complete" != this.readyState || e.call(this)
    } : this.onload = function() {
        e.call(this)
    }
}

function constructWMSIframe(e) {
    var n = "function" == typeof getZuid && getZuid() || n,
        t = "tabid=" + ("function" == typeof getWmsTabId && getWmsTabId() || "undefined" != typeof _tabid && _tabid) + "&wmsid=" + n;
    "undefined" != typeof _COI && _COI && (t += "&coi=true"), wmslasttokenrefresh = (new Date).getTime();
    var i = window.location.protocol + "//" + wmsserver + "/v2/" + _HTML + ".html?" + t + nocachefix();
    samedomain && (i = window.location.protocol + "//" + window.location.hostname + "/wmssrv/v2/" + _HTML + ".html?" + t + nocachefix()), -1 != location.href.indexOf("frameorigin=") && (i += "&frameorigin=" + encodeURIComponent(getFrameOrigin())), destroyWMSIframe(), (wmsconnectorframe = document.createElement("iframe")).name = "wms", wmsconnectorframe.src = i, attachonload.call(wmsconnectorframe, (function() {
        callParentMethod("updateDebugInfo", ["HTML loaded"]), isWMSFrameLoaded = !0, !0 === isCrossOriginAllowed() ? initializeConnectivity(e) : window.parent.WebMessanger && window.parent.WebMessanger.isResourceLoaded ? window.parent.WebMessanger.isResourceLoaded() ? initializeConnectivity(e) : callParentMethod("updateDebugInfo", ["Resource not loaded. Not initializing wms"]) : initializeConnectivity(e)
    })), document.body.appendChild(wmsconnectorframe)
}

function destroyWMSIframe() {
    wmsconnectorframe && wmsconnectorframe.parentNode && wmsconnectorframe.parentNode.removeChild(wmsconnectorframe), wmsconnectorframe = null, isWMSFrameLoaded = !1, isConnectivityInitialized = !1
}

function loadwms() {
    callParentMethod("updateDebugInfo", ["Bridge loaded"]), assignBridgeVariables();
    var e = !1 === isCrossOriginAllowed() && void 0 !== parent.WebMessanger && parent.WebMessanger.is_chat_enabled_always || !1,
        n = !1 === isCrossOriginAllowed() && (void 0 !== parent.WebMessanger && parent.WebMessanger.registerAnnonUser || void 0 !== parent.WmsLite && parent.WmsLite.registerannonuser) || !1,
        t = !1 === isCrossOriginAllowed() && void 0 !== parent.WebMessanger && parent.WebMessanger.is_exclusive_chat && _WMSSETTINGS && _WMSSETTINGS.adminsettings && _WMSSETTINGS.adminsettings.activeappaccountuser || !1;
    deactchat && !1 === isCrossOriginAllowed() && !1 === e && !1 === n && !1 === t && (parent._WMSCONFIG &= -2), constructWMSIframe();
    try {
        window.parent.WebMessanger.setUserConfig(_USERCONFIG), window.parent.WebMessanger.setCSRFParamName(_CFPARAMNAME), window.parent.WebMessanger.setCSRFTokenCookieName(_CFTOKENCOOKIENAME), window.parent.WebMessanger.setChatCSRFParamName(_CHATCSRFPARAMNAME), window.parent.WebMessanger.setChatCSRFCookieName(_CHATCSRFCOOKIENAME), window.parent.WebMessanger.setChatServer(_CHATSERVERURL), window.parent.WebMessanger.setCalendarServer(_CALENDARSERVERURL), window.parent.WebMessanger.setMailServer(_MAILSERVERURL), "null" != _MEETINGSERVERURL ? window.parent.WebMessanger.setMeetingUrl(_MEETINGSERVERURL) : window.parent.WebMessanger.disableMeeting(), window.parent.WebMessanger.setPhotoServer(_PHOTOSERVERURL), "undefined" != typeof _SALESIQSERVERURL && "function" == typeof window.parent.WebMessanger.setSalesIQServerURL && window.parent.WebMessanger.setSalesIQServerURL(_SALESIQSERVERURL), window.parent.WebMessanger.setBarSettingsValue(_WMSSETTINGS), "undefined" != typeof _APPACCOUNTID && "function" == typeof window.parent.WebMessanger.setAppAccountId && window.parent.WebMessanger.setAppAccountId(_APPACCOUNTID), "undefined" != typeof _MURPHYCONFIG && "function" == typeof window.parent.WebMessanger.setMurphyValuesAndInstall && window.parent.WebMessanger.setMurphyValuesAndInstall(_MURPHYCONFIG), window.parent.WebMessanger.documentready()
    } catch (e) {}
    try {
        void 0 !== window.parent.WmsLite && window.parent.WmsLite.setUserConfig && window.parent.WmsLite.setUserConfig(_USERCONFIG), void 0 !== window.parent.WmsLite && window.parent.WmsLite.setBarSettingsValue && window.parent.WmsLite.setBarSettingsValue(_WMSSETTINGS), void 0 !== window.parent.WmsLite && window.parent.WmsLite.setChatCSRFParamName && window.parent.WmsLite.setChatCSRFParamName(_CHATCSRFPARAMNAME), void 0 !== window.parent.WmsLite && window.parent.WmsLite.setChatCSRFCookieName && window.parent.WmsLite.setChatCSRFCookieName(_CHATCSRFCOOKIENAME)
    } catch (e) {}
}

function wmsAjax(e, n, t, i, o) {
    var s;
    if (window.XMLHttpRequest ? s = new XMLHttpRequest : window.ActiveXObject && (s = new ActiveXObject("Microsoft.XMLHTTP")), s.opts = o, s.onreadystatechange = function() {
            if (4 === this.readyState)
                if (200 === this.status || 204 === this.status) {
                    if ("" !== this.responseText) {
                        var e = this.responseText;
                        try {
                            e = JSON.parse(e)
                        } catch (e) {}
                    }
                    this.opts.onsuccess.call(this, e)
                } else this.opts.onfailure.call(this)
        }, s.open(e, n, !0), i)
        for (var a in i) s.setRequestHeader(a, i[a]);
    s.send(t)
}

function submitEvent(e) {
    if (!0 === isWSSupported()) wmsconnectorframe.contentWindow.postMessage('["submitEvent",' + JSON.stringify(e) + "]", pdomain);
    else {
        var n, t = e.o.split("@"),
            i = t[0].split(".");
        if ("req" === i[0]) {
            var o, s = i[1],
                a = t[1].split(":")[1];
            if (window.XMLHttpRequest ? o = new XMLHttpRequest : window.ActiveXObject && (o = new ActiveXObject("Microsoft.XMLHTTP")), o.evid = e.i, void 0 !== e.d)
                if ("string" == typeof e.d) n = e.d;
                else if ("PUT" === s) n = JSON.stringify(e.d);
            else {
                var r = [];
                for (var d in e.d) r.push(d + "=" + e.d[d]);
                n = r.join("&"), "GET" === s && (a += "?" + n)
            }
            for (var c in o.open(s, "/" + a, !0), e.h) "Cookie" !== c && o.setRequestHeader(c, e.h[c]);
            ("GET" !== s || e.h && void 0 === e.h["Content-Type"]) && o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8"), o.onreadystatechange = function() {
                if (4 === this.readyState) {
                    var e = {};
                    if (e.eid = this.evid, 200 === this.status) {
                        if (e.rs = "4", "" !== this.responseText) {
                            var n = this.responseText;
                            try {
                                n = JSON.parse(n)
                            } catch (e) {}
                        }
                        e.res = {
                            d: n,
                            eid: this.evid
                        }
                    } else e.rs = "-1", e.err = {
                        c: this.status,
                        rc: this.status,
                        rm: this.responseText
                    };
                    handlePexEvent(this.evid, e)
                }
            }, "GET" === s ? o.send() : o.send(n)
        }
    }
}

function getFrameOrigin() {
    var e = window.location.protocol + "//" + window.location.host;
    if (void 0 !== location.ancestorOrigins)
        for (var n = 0; n < window.location.ancestorOrigins.length; n++) - 1 === e.indexOf(window.location.ancestorOrigins[n]) && (e += "," + window.location.ancestorOrigins[n]);
    else if (window.location.search) {
        var t = new URLSearchParams(window.location.search).get("frameorigin");
        e += t ? "," + t : ""
    }
    return e
}

function handleRefreshTokenFailure(e) {
    var n = {
            onsuccess: constructWMSIframe
        },
        t = "?prd=" + prd + "&uname=" + e + "&nocache=" + Date.now();
    t += "&frameorigin=" + encodeURIComponent(getFrameOrigin()), wmsAjax("GET", "/" + _WMSCONT + "/pconnect.sas" + t, null, null, n)
}

function pushMsg(e) {
    for (var n = 0; n < e.length; n++) {
        var t = e[n];
        if ("-12" == t.mtype || "-17" == t.mtype) {
            destroyWMSIframe(), callParentMethod("push", [t]);
            var i = "-12" == t.mtype ? "Empty token" : "Invalid token";
            if ((new Date).getTime() - wmslasttokenrefresh > 3e5 && "function" == typeof getAuthType && 9 !== getAuthType()) {
                callParentMethod("updateDebugInfo", [t.mtype + " " + i + ". Refetching token"]);
                var o = "function" == typeof getZuid && getZuid() || uname,
                    s = "?prd=" + prd + "&uname=" + o + "&refreshtoken=true&nocache=" + Date.now();
                s += "&frameorigin=" + encodeURIComponent(getFrameOrigin());
                var a = {
                    onsuccess: constructWMSIframe,
                    onfailure: handleRefreshTokenFailure.bind(null, o)
                };
                wmsAjax("GET", "/" + _WMSCONT + "/pconnect.sas" + s, null, null, a)
            } else callParentMethod("updateDebugInfo", [t.mtype + " " + i + ". Refetching in 5 - 6 min"]), callParentMethod("serverdown", [300, 360])
        } else if ("-25" == t.mtype) !samedomain && t.domain && (wmsserver = t.domain, destroyWMSIframe(), constructWMSIframe(!0));
        else {
            if ("0" === t.mtype) {
                var r = t.msg;
                r.binding = !0;
                var d = '["bind",' + JSON.stringify(r) + "]";
                wmsconnectorframe.contentWindow.postMessage(d, pdomain)
            }
            callParentMethod("push", [t])
        }
    }
}

function isValidDomain(e) {
    try {
        if (e = e.replace(/:\d*$/, ""), wmssubdomain && e) {
            if (e === window.location.protocol + "//" + wmssubdomain) return !0;
            if (e.split(".").length > 2) return e.substring(e.length - (wmssubdomain.length + 1)) === "." + wmssubdomain
        }
        return !1
    } catch (e) {
        return !1
    }
}

function getDomain(e) {
    var n = "";
    return void 0 !== e.domain ? n = e.domain : void 0 !== e.origin && (n = e.origin), n
}

function isCrossOriginAllowed() {
    return !("undefined" == typeof _CROSSORIGINALLOWED || !_CROSSORIGINALLOWED || "$" !== uname.charAt(0) && 0 !== uname.indexOf("RT_2"))
}

function callParentMethod(e, n) {
    if (-1 !== ["push", "disablewms", "goOffline", "updatecontacts", "requestsuccess", "serverup", "serverdown", "updateDebugInfo", "getrtcauthdetails"].indexOf(e))
        if (isCrossOriginAllowed()) {
            var t = {
                opr: e
            };
            n && (t.params = n), window.parent.postMessage(JSON.stringify(t), "*")
        } else "function" == typeof window.parent[e] ? window.parent[e].apply(null, n) : window.parent.WmsLite ? window.parent.WmsLite[e].apply(null, n) : window.parent.WebMessanger[e].apply(null, n)
}

function nocachefix() {
    return "&nocache=" + (new Date).getTime()
}
"false" === _NODOMAINCHANGE && !1 === samedomain && (document.domain = wmssubdomain),
    function() {
        var e;
        unregister = function(n) {
            wmsconnectorframe.contentWindow.postMessage('["unregister",""]', pdomain), "function" == typeof n && (e = n)
        }, onUnregisterSuccess = function() {
            destroyWMSIframe();
            var n = parent.document.getElementById("pconnect");
            n && n.parentNode && n.parentNode.removeChild(n), "function" == typeof e && e()
        }
    }(),
    function() {
        var e;
        setWSSupport = function(n) {
            e = n
        }, isWSSupported = function() {
            return e
        }
    }(), addEvent(window, "message", (function(e) {
        if (isValidDomain(getDomain(e))) {
            try {
                var n = JSON.parse(e.data)
            } catch (e) {
                return
            }
            var t = n[0],
                i = n[1],
                o = n[2];
            if (o && null != o.wsopen && setWSSupport(o.wsopen), "push" === t) pushMsg(i);
            else if ("disablewms" === t) callParentMethod("disablewms");
            else if ("goOffline" === t) callParentMethod("goOffline");
            else if ("isdisablewms" === t) wmsconnectorframe.contentWindow.postMessage('["setdisablewms",{"value" : "' + isdisablewms() + '"}]', pdomain);
            else if ("getcontacts" === t) {
                var s = getWmsContacts(),
                    a = i;
                try {
                    wmsconnectorframe.contentWindow.postMessage('["updatecontacts",{"childsid" : "' + a + '" , "contacts" : ' + JSON.stringify(s) + "}]", pdomain)
                } catch (e) {}
            } else "updatecontacts" === t ? updateWmsContacts(i) : "serverup" === t ? callParentMethod("serverup") : "serverdown" === t ? callParentMethod("serverdown", [i.min_delay, i.max_delay]) : "pexevt" === t ? handlePexEvent(i.eid, i) : "wssupport" === t ? setWSSupport(i) : "debuginfo" === t ? callParentMethod("updateDebugInfo", [i]) : "unregistersuccess" === t && onUnregisterSuccess()
        } else if (!1 === isCrossOriginAllowed()) throw new Error("Invalid cross domain access in bridge")
    })), !0 === isCrossOriginAllowed() && addEvent(window, "message", (function(e) {
        if (e.source === parent) {
            var n = JSON.parse(e.data),
                t = n.opr,
                i = n.params;
            "triggerbind" === t ? triggerbind(i.zuid, i.rawsid, i.sid) : "abortBind" === t ? abortBind() : "clearAndRegister" === t ? clearAndRegister() : "rtcauthdetails" === t && (authtype = i.authtype, rtcatoken = i.rtcatoken, rtcptabid = i.tabid, rtcpnname = i.nname, initializeConnectivity())
        }
    }));
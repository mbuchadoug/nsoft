var $ZSIQChatWindow = $ZSIQChatWindow || function() {
    var m, l, a, S = 0,
        s = document.documentElement.scrollTop || document.body.scrollTop,
        h = {
            1: "siq_rht",
            2: "siq_rht",
            3: "siq_lft",
            4: "siq_lft",
            5: "siq_lft",
            6: "siq_lft",
            7: "siq_lft",
            8: "siq_rht",
            9: "siq_rht",
            10: "siq_rht",
            11: "siq_rht",
            12: "siq_rht"
        },
        r = function() {
            var e = $ZSIQUtil.getIframe().$Support;
            $zv.question && (window._IS_REVAMP ? IframeHandler.sendPostMessage("question") : e && e.handleVisitorQuestionJsApi())
        },
        u = function(e) {
            if (m.className = m.className.replace(/(?:^|\s)siqhide(?!\S)/, "").replace(/(?:^|\s)siqanim(?!\S)/, ""), e) {
                if (!$ZSIQUtil.getIframe()) return f(), void $ZSIQChatWindow.populateIframe(function() {
                    u(e)
                });
                $ZSIQChat.isOnboarding() ? 2 != $ZSIQWidgetUI.getWidgetState() && $ZSIQWidget.handleCallBacks({
                    "chat.open": ""
                }) : $ZSIQWidget.handleCallBacks({
                    "chat.open": ""
                }), m.className += " siqanim", $ZSIQChatWindow.setLoadContentClass(), r()
            }! function(e) {
                if (window._IS_REVAMP && $ZSIQWidgetUI.isHandHeldDevice() && document.getElementById("siqiframe").contentDocument.documentElement.setAttribute("device", "mobile-device"), $ZSIQWidgetUI.isHandHeldDevice() && $ZSIQWidgetUI.isAppleDevice()) {
                    var t = document.body,
                        i = document.documentElement;
                    if (t.className = (t.className || "").replace(/(?:^|\s)zsiq_fixedlayout(?!\S)/, ""), !e) return i.scrollTop = s, t.scrollTop = s;
                    s = i.scrollTop || t.scrollTop, t.className += " zsiq_fixedlayout"
                }
            }(e)
        },
        p = function() {
            m.style.top = "-10000px", m.style.display = "block"
        },
        n = function(e, t, i) {
            void 0 === a && (a = 0), clearTimeout(a), $ZSIQUtil.storeCookieVal(e, t, i), a = setTimeout(function() {
                n(e, t, i)
            }, 12e4)
        },
        f = function() {
            $ZSIQWidgetUI.addClass($ZSIQChatWindow.getChatWindowDiv(), "siq_showload"), $ZSIQWidgetUI.addClass($ZSIQWidgetUI.getWidgetDiv(), "zsiqfanim")
        };
    return {
        getChatWindowDiv: function() {
            return m
        },
        isTrackingOnly: function() {
            var e = $ZSIQChat.getWidgetData().widgetobj;
            return 1 == e.istracking && (0 == e.islivechat || 1 == e.hideembed)
        },
        showIframeLoading: f,
        constructIframe: function(e, t) {
            if ($ZSIQCookie.get("isiframeenabled") && !$ZSIQChatWindow.getChatWindowDiv() || !$ZSIQChatWindow.isTrackingOnly() || $ZSIQChat.isPreview()) {
                var i, a = $ZSIQWidget.getEmbedObject(),
                    s = $ZSIQWidget.getWidgetObject(),
                    n = !1,
                    o = $ZSIQChat.isPreview(),
                    r = window._IS_REVAMP,
                    l = $ZSIQUtil.getIframe().$Support,
                    d = $zohosq.nonce;
                if (m && !_WINDOW_REPOPULATE && (o ? n = !0 : (m.remove(), _WINDOW_REPOPULATE = !1)), n || (m && m.remove(), (m = document.createElement("DIV")).innerHTML = '<div id="siqcht" class="zls-prelative" ><iframe id="siqiframe" title="SalesIQ Chatwindow" seamless="seamless" height="460" width="100%" scrolling="no"></iframe></div>', m.style.visibility = "hidden"), m.className = function() {
                        $ZSIQWidget.getWidgetObject();
                        var e = "";
                        $ZSIQWidget.getWidgetObject().isshowcallbubble && (e = "theme5" === $ZSIQWidget.getWidgetObject().calltheme ? " siq-calthemesign" : "siq-caltheme");
                        var t = $ZSIQChatWindow.isBotChatPreview(),
                            i = $ZSIQWidgetUI.isCSSTransformSupported() ? "zls-sptwndw " + e + " siqembed siqtrans siqhide " : "zls-sptwndw " + e + " siqembed ";
                        i += $ZSIQChat.isPreview() ? "" : "zsiq-mobhgt ", i += $ZSIQChatWindow.isNewHeader() ? "zsiq-newtheme " : "", i += !$ZSIQChatWindow.isOnlyCall() || t || window._IS_REVAMP ? "" : "zsiqdircall ", i += $ZSIQWidgetUI.isHandHeldDevice() ? "mobile-device " : "", i += window._IS_REVAMP && t ? " bot-preview " : "";
                        var a = " zsiq_size" + $ZSIQWidget.getEmbedSize();
                        return $ZSIQChat.isSignatureChat() ? i + a : ($ZSIQChat.isSeasonalTheme() && !t && (i += " zsiqseasonal ", window._IS_REVAMP && $ZSIQChat.isPreview() && (i += " zsiqseasonal_revamp ")), i + h[$ZSIQWidgetUI.getWidgetPosition()] + a)
                    }(), m.setAttribute("embedtheme", a.theme), m.setAttribute("data-id", "zsiqembed"), (null != s.isSeasonalThemeEnabled ? s.isSeasonalThemeEnabled : $ZSIQChat.isSeasonalTheme()) && window._IS_REVAMP && !$ZSIQChatWindow.isBotChatPreview() && m.classList.add("seasonal-hat"), d && m.setAttribute("nonce", d), n) !r && l.init($ZSIQWidget.getEmbedObject());
                else if (function() {
                        var e = $ZSIQChat.getWidgetData().embedobj.einfo.embedid,
                            t = ($ZSIQLSDB.get("ZLD" + e) || {}).ongoingchats || {},
                            i = 0 !== Object.keys(t).length;
                        window._IS_REVAMP && (i = 0 < ((JSON.parse(localStorage.getItem("siq_embed")) || {})[$ZSIQUtil.getLiveLSID()] || {}).ongoingchats);
                        return $ZSIQLSDB.get("ZLDTRIGGER" + e) || $ZSIQLSDB.get("ZLD" + e + "WAITING") || i || $ZSIQChat.isPreview()
                    }() || t || 0 == $zohosq.fileloadtime && $ZSIQWidgetUI.F_WINDOW == $ZSIQWidgetUI.getWidgetState()) $ZSIQChatWindow.populateIframe(t);
                else {
                    var c = a.widget_performance_optimised ? 25e3 : $zohosq.postloadtime || 1e4,
                        I = $zohosq.values || {},
                        g = I.floatwindowvisible || I.chatwindowvisible;
                    g && "show" == g && (c = 0, r && $ZSIQChatWindow.populateIframe(t)), r || (S = setTimeout(function() {
                        $ZSIQChatWindow.populateIframe(t)
                    }, c))
                }! function(e) {
                    $ZSIQChat.getWidgetData().widgettype;
                    var t = $zohosq.values,
                        i = t.floatwindowvisible || t.chatwindowvisible;
                    i ? $ZSIQChatWindow.handleChatWindowVisible(i, e) : $ZSIQWidgetUI.getWidgetState() != $ZSIQWidgetUI.F_WINDOW ? p() : (f(), $ZSIQChatWindow.populateIframe(), u(!0))
                }(e), l && l.Util && l.Util.handleResize && l.Util.handleResize(), (i = $ZSIQUtil.getCookieValue("dragpos")) && (i = JSON.parse(i), m.setAttribute("style", "left:" + i.left + ";top:" + i.top)), this.handleESCEvent()
            }
        },
        populateIframe: function(t, i) {
            if (document.getElementById("siqiframe")) m.className = m.className.replace(/(?:^|\s)siq_showload(?!\S)/, "");
            else {
                !window._IS_DEV && function() {
                    var e = $ZSIQChat.getWidgetData();
                    if (iscdnenabled && !$ZSIQChat.isPreview()) {
                        var t = $zohosq.nonce,
                            i = {};
                        i[SIQ_FLOAT] = "/salesiq/styles/floatbuttonpostload_L7CmgcUNKtiIUH07ZYq3DoTmb-NY-dsjUnC1tUhE6lIf_Xf5zAIkdYqf94knMuis_.css", i[SIQ_BUTTON] = "/salesiq/styles/buttonthemepostload_IeszGAuXtDTxTEJK7timQ5yjglcU8S5IY7ZCdSONgPnd50wpvO3Nkexw-mOCFMo2_.css", i[SIQ_PERSONALIZE] = "/salesiq/styles/personalizethemepostload_794x1wFsAPHL4c8VnHmlvxot5Wjr1OoxApnOgEZy3BS5iga9n7ssBJWNVNy9CMtJ_.css";
                        var a = e.widgetobj,
                            s = JSON.parse(a.sticker)[1].default,
                            n = i[e.widgettype],
                            o = a.cssstaticserver,
                            r = a.csscdnstaticserver,
                            l = o + n,
                            d = n.split("WIDGTHEME"),
                            c = d.join(s);
                        l = void 0 !== cssjslist[c] ? r + (n = "/salesiq" + d[0] + s + "_" + cssjslist[c] + "_" + d[1]) : r + n;
                        var I = document.createElement("link");
                        I.rel = "stylesheet", I.href = l;
                        var g = document.getElementsByTagName("head");
                        $ZSIQChat.notifyOnCDNFailure(I, g, (o + i[e.widgettype]).replace(/WIDGTHEME/g, s), "css"), t && I.setAttribute("nonce", t), g[0].appendChild(I)
                    }
                }(), clearTimeout(S), document.body.appendChild(m), (0 == $zohosq.fileloadtime || i) && f();
                var a = document.getElementById("siqiframe"),
                    e = (a.contentWindow || a.contentDocument.document || a.contentDocument).document,
                    s = $ZSIQChatWindow.getFiles(),
                    n = function() {
                        $ZSIQWidgetUI.checkWidgetVisibility($ZSIQUtil.isChatExist());
                        var e = $ZSIQUtil.getIframe().$Support;
                        e && !_IS_REVAMP && (e.handleStatusCallback(), e.handleAudioCallback()),
                            function() {
                                if ($ZSIQChat.getWidgetData().widgettype == SIQ_PERSONALIZE) {
                                    var e = $ZSIQLSDB.get("ZLDPERSONALIZE");
                                    e && $zoho.salesiq.chat.department($ZSIQWidgetUI.getUserDeptMapping()[e])
                                }
                            }(), t && t(), m.className = m.className.replace(/(?:^|\s)siq_showload(?!\S)/, ""), i && i(), $ZSIQUtil.idetifyVisitorData(), IframeHandler.loadExternalFiles(), r()
                    };
                if (window._IS_REVAMP) {
                    this.handleRevampLoad = n;
                    var o = function() {
                        s.forEach(function(e) {
                            $zohosq.nonce && e.setAttribute("nonce", $zohosq.nonce), a.contentDocument.head.appendChild(e)
                        })
                    };
                    "complete" === e.readyState ? o() : a.onload = o
                } else a.onload = n, e.open(), e.write(s), e.close()
            }
        },
        handleIframeLoading: function(e) {
            !$ZSIQChatWindow.getChatWindowDiv() && $ZSIQChatWindow.isTrackingOnly() ? ($ZSIQCookie.set("isiframeenabled", !0, 864e5, !0), $ZSIQChatWindow.constructIframe(!1, e)) : e && e()
        },
        handleESCEvent: function(e) {
            var t = e ? e.parent : window;
            (e = e || window).document.addEventListener("keydown", function(e) {
                27 == e.keyCode && (document.querySelector(".notify-cookie") ? $ZSIQNotifyCookie.closeBanner(e) : t.$ZSIQChatWindow.closeImagePreview(e, !0))
            })
        },
        RemoveLoadingForTrigger: function() {
            $ZSIQChatWindow.getChatWindowDiv() && $ZSIQChatWindow.getChatWindowDiv().classList.remove("siq_showload"), delete $ZSIQUTSAction.widget_interaction, clearTimeout($ZSIQChatWindow.triggerloader)
        },
        isBotChatPreview: function() {
            return !!$ZSIQChat.isPreview() && window.parent.IS_BOT_PREVIEW
        },
        openChatWindow: function(e, t, i) {
            if (!e && !i) try {
                $UTSHandler.updateAction({
                    type: "1"
                })
            } catch (e) {}
            m.hasAttribute("drag") || (m.style.top = ""), $ZSIQWidgetUI.isCSSTransformSupported() ? (u(!0), $ZSIQUTSAction.widget_interaction && (f(), $ZSIQChatWindow.triggerloader = setTimeout(function() {
                $ZSIQChatWindow.RemoveLoadingForTrigger()
            }, 2e3))) : m.style.display = "block";
            var a = $ZSIQWidgetUI.getWidgetDiv();
            try {
                var s = $ZSIQWidgetUI.getMinWidgetDiv();
                $ZSIQWidgetUI.addClass(s, "zsiqfanim")
            } catch (e) {
                $ZSIQWidgetUI.addClass(a, "zsiqfanim")
            }
            if ($ZSIQWidgetUI.setWidgetState($ZSIQWidgetUI.F_WINDOW), IframeHandler.sendPostMessage("iframestate", !0), $ZSIQUtil.getIframe().$Support) {
                "true" == a.getAttribute("data-autochat") && $ZSIQUtil.getIframe().$Support.handleAPIFunctionalities("chatstart");
                var n = $ZSIQUtil.getIframe().$Support;
                n.getUnreadCount() && !n.isConversationUIFocussed() && (n.sendReadCall(), n.removeUnreadCookie(), $ZSIQWidgetUI.removeUnreadCount()), $ZSIQUtil.getIframe().$UI && !$ZSIQChat.isPreview() && setTimeout(function() {
                    $ZSIQUtil.getIframe().$UI.handleComponentFocus(), $ZSIQUtil.startChatwindowOnload()
                }, 500)
            }
        },
        forceOpenChatWindow: function() {
            $ZSIQUtil.getIframe().$Support.getParent().$ZSIQWidgetUI.removeCallClass(), $ZSIQUtil.getIframe().$Support.contentdiv = null, $ZSIQUtil.getIframe().$Support.EmbedObj.lchid = -1, $ZSIQUtil.getIframe().$Support.checkAndShowUI(-1), $ZSIQUtil.getIframe().CallImpl.isCallWithChat = !1, $ZSIQUtil.getIframe().$EmbedManger.setQuitStatus(!1)
        },
        expandChatWindow: function() {
            var e = $ZSIQChat.getWidgetData().widgettype;
            e != SIQ_FLOAT && e != SIQ_PERSONALIZE || ($ZSIQWidgetUI.getWidgetDiv().style.display = "none");
            "-10000px" == m.style.top && (m.style.top = ""), $ZSIQWidgetUI.isCSSTransformSupported() ? u(!0) : m.style.display = "block", $ZSIQWidgetUI.setWidgetState($ZSIQWidgetUI.F_WINDOW)
        },
        closeChatWindow: function(e) {
            $ZSIQUtil.stopBlinking(), e ? $ZSIQChat.isOnboarding() && $ZSIQWidget.handleCallBacks({
                "floatwindow.minimize": ""
            }) : $ZSIQWidget.handleCallBacks({
                "chat.close": ""
            }), u(), m.className = m.className.replace(/(?:^|\s)remtrans(?!\S)/, ""), IframeHandler.sendPostMessage("iframestate", !1);
            try {
                var t = $ZSIQUtil.getAPIValues(),
                    i = $ZSIQUtil.getIframe().$Support,
                    a = i.isChatExist() ? i.getRecentLiveChatid() : -1;
                if ("hide" == t.floatvisible && (t.customhtml || -1 == a)) return void $ZSIQWidgetUI.setWidgetState(-1 != a && null != a ? $ZSIQWidgetUI.F_BUTTON : $ZSIQWidgetUI.F_STICKER)
            } catch (e) {}
            var s = $ZSIQWidgetUI.getWidgetDiv();
            s.className = s.className.replace(/(?:^|\s)zsiqfanim(?!\S)/, "");
            var n = !1;
            try {
                if (a && -1 != a) {
                    var o = $ZSIQWidgetUI.getMinWidgetDiv();
                    o.className = o.className.replace(/(?:^|\s)zsiqfanim(?!\S)/, "")
                }
                n = $ZSIQWidgetUI.isStickerMinimized()
            } catch (e) {}
            $ZSIQWidgetUI.setWidgetState(-1 != a && null != a || n ? $ZSIQWidgetUI.F_BUTTON : $ZSIQWidgetUI.F_STICKER);
            var r = $ZSIQWidget.getWidgetObject();
            if ($ZSIQChat.getWidgetData().widgettype == SIQ_FLOAT && "8" == r.sticker[1].default) {
                try {
                    var l = $ZSIQUtil.getIframe().$Support.EmbedObj,
                        d = $ZSIQUtil.getIframe().$Support.getCookieValue("ZLD" + l.livelsid)["attname_" + l.visitorID]
                } catch (e) {}
                d && (document.getElementById("zsiq_maintitle").innerText = d);
                var c = document.getElementById("zsiq_chatbtn");
                c && (c.style.display = 1 == $ZSIQUtil.getCookieValue("state") ? "none" : "block")
            }
            $ZSIQWidgetUI.checkWidgetVisibility(a)
        },
        minimizeChatWindow: function() {
            if (!$ZSIQChat.isPreview()) {
                if (!$ZSIQUtil.getIframe().$Support.isChatExist()) {
                    var e = document.getElementById("zsiq_maintitle");
                    if (e) {
                        var t = $ZSIQWidget.getWidgetObject(),
                            i = t.title[1].online ? t.title[1].online : t.i18nkeys["float.online.maintitle"];
                        t.status || (i = t.title[1].offline ? t.title[1].offline : t.i18nkeys["float.offline.maintitle"]);
                        var a = $ZSIQUtil.getAPIValues().buttontexts;
                        a && (t.status && a[0] ? i = a[0][0] || i : !t.status && a[1] && (i = a[1][0] || i)), e.innerHTML = $ZSIQUtil.getEncodedText(i)
                    }
                }
                $ZSIQChat.getWidgetData().widgettype == SIQ_PERSONALIZE && $ZSIQLSDB.remove("ZLDPERSONALIZE"), $ZSIQChatWindow.closeChatWindow(!0);
                var s = $ZSIQUtil.getIframe().$Support,
                    n = IframeHandler.getTriggerCookie();
                if (s.isChatExist() || n) $ZSIQWidgetUI.minimizeSticker();
                else {
                    var o = $ZSIQWidget.getWidgetObject();
                    if ("1" == o.sticker[1].default) {
                        var r = document.getElementById("titlediv");
                        $ZSIQUtil.containsClass(r, "zsiq_min") && (r.className = r.className.replace(/(?:^|\s)zsiq_min(?!\S)/, ""))
                    } else if ("2" == o.sticker[1].default) {
                        var l = document.getElementById("zsiq_float");
                        $ZSIQUtil.containsClass(l, "zsiq_min") && (l.className = l.className.replace(/(?:^|\s)zsiq_min(?!\S)/, ""))
                    }
                }
                $ZSIQWidget.handleCallBacks({
                    "floatwindow.minimize": ""
                }), $ZSIQUtil.isCHatwindowMinimized = !0, $ZSIQUtil.getIframe().avUIhandler && $ZSIQUtil.getIframe().avUIhandler.handleMinimizeState()
            }
        },
        handleChatWindowVisible: function(e, t, i, a, s) {
            if ($ZSIQChatWindow.isBotChatPreview()) $ZSIQChatWindow.openChatWindow(!0);
            else if (!t)
                if (!0 !== $ZSIQWidget.getWidgetObject().hideembed) {
                    var n = $ZSIQUtil.getAPIValues().floatwindowvisible;
                    s = s || n, (e = e || n) && ("hide" != e || $ZSIQWidgetUI.getWidgetState() != $ZSIQWidgetUI.F_WINDOW && !$ZSIQChat.isPreview() ? "show" == e ? ($ZSIQChatWindow.openChatWindow(!1, a, s), i && !$ZSIQUtil.getIframe().$Support.isChatExist() && $ZSIQUtil.getIframe().$Support.openClassicUI()) : !isNaN(e) && 0 < e && setTimeout($ZSIQChatWindow.openChatWindow, 1e3 * e, s) : $ZSIQChatWindow.closeChatWindow(!0))
                } else m.style.display = "none"
        },
        handleDrag: function(e) {
            var t = m,
                i = e.split("#"),
                a = l || (l = {
                    chtX: m.offsetWidth,
                    chtY: m.offsetHeight
                }),
                s = a.chtX,
                n = a.chtY,
                o = window.innerWidth,
                r = window.innerHeight;
            return cx = t.offsetLeft - parseInt(i[0]), cy = t.offsetTop - parseInt(i[1]), cx = cx < 0 ? 0 : cx, cy = cy < 0 ? 0 : cy, cx = cx + s > o ? o - s : cx, cy = cy + n > r ? r - n : cy, t.style.left = cx + "px", t.style.top = cy + "px", t.style.right = "auto", t.style.bottom = "auto", !(t.style.transition = "unset")
        },
        cacheChatDivPosition: function() {
            var e = m.style;
            "" === e.left || $ZSIQWidgetUI.isHandHeldDevice() || (e.removeProperty("transition"), m.setAttribute("drag", "true"), n("dragpos", '{"left":"' + e.left + '", "top":"' + e.top + '" }', !0))
        },
        isOfflineByEngaged: function() {
            for (var e = $ZSIQWidget.getEmbedObject().einfo.embedstatus.DEPTLIST, t = 0; t < e.length; t++) {
                var i = e[t];
                if (!i.STATUS && i.ENGAGED) return !0
            }
            return !1
        },
        isNewHeader: function() {
            return -1 != [4, 8, 9, 10].indexOf(parseInt($ZSIQWidget.getEmbedObject().theme))
        },
        getStaticFileNodes: function(e, t, i) {
            for (var a = [], s = "js" === t, n = window._IS_DEV, o = 0; o < e.length; o++)
                if (s) {
                    var r = this.getScriptNode();
                    r.src = e[o], i && !n ? r.type = "module" : n || (r.type = "nomodule"), a.push(r)
                } else {
                    var l = document.createElement("link");
                    l.href = e[o], l.rel = "stylesheet", l.type = "text/css", a.push(l)
                }
            return a
        },
        getScriptNode: function() {
            var e = document.createElement("script");
            return e.type = "text/javascript", e
        },
        getRevampWindowVariables: function(e, t) {
            var i, a = e.einfo,
                s = t.commondata,
                n = t.widgetobj,
                o = {
                    AVUID: $ZSIQUtil.getAvuid(),
                    visitorInfo: $zv,
                    ISSIGNATURECHAT: window._IS_SIGNATURE_CHAT,
                    SIQSERVICENAME: window._SIQSERVICENAME,
                    IS_PREVIEW: window._IS_PREVIEW,
                    IS_LIVE_PREVIEW: window._SIQ_WIDGET_LIVE_PREVIEW,
                    IS_RTL: e.isRtlLang,
                    brandid: a.embedid,
                    lsid: a.lsid,
                    sname: e.screenname,
                    soid: e.pinfo.soid,
                    annonid: e.annonid,
                    sURL: e.embedserverurl,
                    schema: e.schema,
                    nonce: $zohosq.nonce,
                    producturl: e.producturl,
                    downloadserver: s.downloadserver,
                    uploadserver: s.uploadserver,
                    siqservicename: s.siqservicename,
                    useUDServer: t.usedownloadserver,
                    UDServerRevamp: s.UDServerRevamp,
                    siqUDServiceName: s.siqUDServiceName,
                    mediafiles: s.mediafilescdnhashes,
                    uapache: e.uapache,
                    mediaserverurl: e.mediaserverurl,
                    domain: $ZSIQChat.getDomain(),
                    wmsInfo: {
                        js_domain: e.wmsjsstaticdomain,
                        prdid: e.lsprdcode,
                        js_url: s.wmsjsstaticserver,
                        domain: e.wmspublicdomain
                    },
                    customcss: (i = JSON.parse(a.props.iscustomcss), {
                        enabled: !!i[0],
                        file_name: i[1].fname || i[1].pfname,
                        fpath: i[1].fpath
                    }),
                    widget_code: $zohosq.widgetcode,
                    language: e.language,
                    rtcurls: window._NEW_MEDIARTC_URLS,
                    zmap: {
                        css_url: n.zmapapicss,
                        api_key: n.zmapapikey,
                        api_url: n.zmapapiurl,
                        static_url: n.zmapstaticurl
                    }
                },
                r = this.getScriptNode();
            return r.textContent = "window._STATIC_URL='" + _STATIC_URL + "';window._CONFVARIABLES=" + JSON.stringify(o) + ";", r
        },
        splitJSHashgetSRIVal: function(e) {
            var t = e.split("/").pop();
            return $ZSIQChat.getSubResourceIntegrityAttr(t.substring(t.indexOf("_") + 1).replace("_.js", "").replace("_.css", "").slice(-64))
        },
        splitFileHashAndGetSRIattr: function(e) {
            if (!(($ZSIQChat.getWidgetData() || {}).embedobj || {}).subresourceintegrity_enabled) return "";
            var t = $ZSIQChatWindow.splitJSHashgetSRIVal(e);
            return t ? ' integrity="' + t + '" crossorigin="anonymous" ' : ""
        },
        getFiles: function() {
            var t = $ZSIQWidget.getEmbedObject(),
                e = $ZSIQChat.getWidgetData(),
                i = $ZSIQWidget.getWidgetObject();
            if (window._IS_REVAMP) {
                var a = [];
                return NEW_STATIC_URLS.forEach(function(e) {
                    e = e.slice(), t.isRtlLang ? e.shift() : e.pop(), a.push(e)
                }), [this.getRevampWindowVariables(t, e, i)].concat(this.getStaticFileNodes(a[0], "js")).concat(this.getStaticFileNodes(a[1], "js", !0)).concat(this.getStaticFileNodes(a[2], "css"))
            }
            var s, n = e.commondata,
                o = "";
            ($ZSIQChat.isPreview() || $ZSIQChat.isSignatureChat()) && (o = "skipdrag");
            var r = n.schema + "://" + t.embedserverurl,
                l = "",
                d = "";
            try {
                window.parent.$ZSIQWidget ? d = "window.parent.$ZSIQUtil.onCDNFailure(this)" : window.opener && opener.$ZSIQWidget && (d = "window.opener.$ZSIQUtil.onCDNFailure(this)")
            } catch (e) {
                d = ""
            }
            i.cssstaticfile = "/styles/embedtheme" + t.theme + ".css", i.jsstaticfile = "/js/siqchatwindow" + t.theme + ".js";
            var c = i.resourcefile,
                I = !1;
            try {
                parent.WixPopUp && (I = !0)
            } catch (e) {}
            if (iscdnenabled && (i.cssstaticfile = "/salesiq/styles/embedtheme" + t.theme + "_" + cssjslist[i.cssstaticfile] + "_.css", i.jsstaticfile = "/salesiq/js/siqchatwindow" + t.theme + "_" + cssjslist[i.jsstaticfile] + "_.js"), $ZSIQChatWindow.isNewHeader()) {
                var g = t.jquery_version_updated;
                i.cssstaticfile = t.isRtlLang ? "/salesiq/styles/embedrtl_Tzps9SxqTIEwNjusYgexXR7OKAqYoZX-nL6OHhZtWptHAFRjvjS1Q17pAATkAibp_.css" : "/salesiq/styles/newembedtheme_Y_v5dwYhfbfaroeLcDotURzN3ARU9SYCZgH_PBeFNG_kfuzQxGOto5O2D9JOMk38_.css", i.jsstaticfile = g ? "/salesiq/js/siqnewchatwindow1_FgNseJqm_wbjQ_qo3wBN5HvvTYUbgicbAtmGFfav1IXaBuAPj2EbBJyKHfq90TXd_.js" : "/salesiq/js/siqnewchatwindow_8I1M7HOCy3f9ZKTW6cd4LXHl0X5LgKxLqtkwTgQ51eWcG7sP9CrZWo99i-hInCZl_.js"
            }
            if ($ZSIQChat.isPreview() && !I) {
                var m = /(?:settings\/)(?:apps|brands|triggers)/.test(parent.window.location.href) || parent.window.IS_WIDGET_PREVIEW,
                    S = t.ucomp ? n.jscdnstaticserver + "/salesiq/js/chatwindowpreview_aJ-uh5guR-Kmk4E_0nJ7mehLiHvw4q4ZKixQP-HR7cM32yg2O0FuID2P0kjC0mYV_.js" : r + "/js/embed/new/chatwindow/chatwindowpreview.js",
                    h = m ? "" : t.ucomp ? i.csscdnstaticserver + "/salesiq/styles/chatwindowpreview_fdXpMy-RrJezc6lJYq5133pdB1VrYA-CVQCZKJpiJ8Ox1YNeBPnr5Rh1zebdvAS8_.css" : r + "/styles/embed/new/chatwindow/chatwindowpreview.css";
                l = m ? "" : '<link href="' + h + '" rel="stylesheet" type="text/css" />', l += '<script src="' + S + '"><\/script>'
            }
            if (t.ucomp) {
                var u = $zohosq.nonce ? 'nonce ="' + $zohosq.nonce + '"' : "",
                    p = n.jscdnstaticserver + "/salesiq/js/embedmedia-rtc_rXuzcWwFvMNIkJ7SfTM4Ts7Zqn8Z_9rfp44lcvtVX02EAGiXPZ9WspRsXlxJ40Iq_.js";
                s = '<html><head><link href="' + i.csscdnstaticserver + i.cssstaticfile + '" rel="stylesheet" ' + u + $ZSIQChatWindow.splitFileHashAndGetSRIattr(i.cssstaticfile) + ' type="text/css" onerror="' + d + '" />';
                var f = "",
                    w = e.embedobj.wmslite_js_sri_hash_value;
                w && (f = "integrity=" + w + ' crossorigin="anonymous"'), s += '<script src="' + i.wmsjsstaticserver + '" ' + u + " " + f + '><\/script><script src="' + n.jscdnstaticserver + i.jsstaticfile + '" ' + u + $ZSIQChatWindow.splitFileHashAndGetSRIattr(i.jsstaticfile) + ' ><\/script><script src="' + c + '"  onerror="' + d + '" ' + u + $ZSIQChatWindow.splitFileHashAndGetSRIattr(c) + " ><\/script>" + l + "</head><body></body></html>", t.einfo.embedstatus.staticfiles_delayloading_enabled || (s += '<script src="' + p + '" ' + u + $ZSIQChatWindow.splitFileHashAndGetSRIattr(p) + " ><\/script>")
            } else {
                t.theme, t.theme, t.theme;
                $ZSIQChatWindow.isNewHeader() && ("themeui.js", "themetemplate.js", "theme.css", "themecommon.css"), s = Filedatagetter.getIframeFileData({
                    iframecls: o,
                    preview_files: l
                })
            }
            try {
                var $ = JSON.parse(t.einfo.props.iscustomcss);
                if (1 == $[0] && $[1].fpath) {
                    var v = $[1].fpath;
                    if ("undefined" != typeof $ZSIQChat && $ZSIQChat.getWidgetData().usedownloadserver) {
                        var Q = v.split("/")[1],
                            Z = $ZSIQWidget.getEmbedObject().pinfo.soid,
                            W = $[1].fname ? $[1].fname : $[1].pfname;
                        W = W || "customcss.css";
                        var C = "";
                        if ($ZSIQChat.getWidgetData().commondata.UDServerRevamp) {
                            var y = {
                                "x-siq-soid": Z,
                                "x-siq-module": "brands",
                                "x-siq-type": "apps_custom_css",
                                "x-siq-parentid": $ZSIQChat.getWidgetData().embedobj.einfo.embedid,
                                "x-siq-resourceid": Q,
                                "x-siq-filetype": "text/css",
                                "x-siq-filename": W
                            };
                            C = UDHandler.getUDDownLoadLink(y)
                        } else {
                            var _ = {
                                "x-siq-filetype": v.split("/")[0],
                                "x-siq-lsid": Q.split("_")[1],
                                "x-siq-soid": Z,
                                "x-siq-ispreview": !1,
                                "x-siq-pfname": W
                            };
                            C = UDHandler.getDownLoadLink(Q, "default", _)
                        }
                        s += '<link href="' + C + '" rel="stylesheet" type="text/css" />'
                    } else s += '<link href="' + r + "/" + t.screenname + "/" + v + '/stylesheet.ls" rel="stylesheet" type="text/css" />'
                }
            } catch (e) {}
            return s
        },
        drawCustomHTML: function() {
            var e = $ZSIQUtil.getAPIValues().customhtml || $zv.customhtml;
            if (e) {
                var t = document.getElementById(e[0]);
                if (t) {
                    var i = $ZSIQWidget.getWidgetObject(),
                        a = i.status ? "online" : "offline",
                        s = e[1];
                    s[a + ".html"] && (t.innerHTML = s[a + ".html"]), e[2] || ($ZSIQUtil.bindClickEvent(t, function() {
                        $zoho.ld.handle.customClick(a)
                    }, !0), e[2] = !0), i.hideembed && (t.style.display = "none")
                }
            }
        },
        closeImagePreview: function(e, t) {
            if (e.target.getAttribute("zsiqclose") || t) {
                var i = document.getElementById("zsiqimagepreview") || document.getElementById("datepicker_body");
                i && i.parentNode.removeChild(i)
            }
        },
        startChat: function(e) {
            $ZSIQChatWindow.closeImagePreview(e, !0);
            var t = $ZSIQUtil.getIframe(),
                i = t.$Support;
            if (i) {
                var a = e.target,
                    s = a ? a.getAttribute("proptype") : e;
                $ZSIQChat.getWidgetData().embedobj.triggerOnChatnow && i.checkAndHandleTriggerOnRestart("", !0), i.isCallForm = !1, i.Util.showMessageAreaUI(s), t.$("#conv-tab").addClass("sel"), t.$("#faqtab").removeClass("sel")
            }
        },
        updateVote: function(e, t) {
            var i = document.getElementById("zsiqfaqpreview");
            if (i) {
                var a = i.getAttribute("articleid");
                $ZSIQUtil.storeCookieVal("Article_" + a, !0, !1)
            }
            $ZSIQUtil.getIframe().$FAQ && $ZSIQUtil.getIframe().$FAQ.updateVote(e, t)
        },
        toggleTocChildView: function(e) {
            var t = e.parentElement && e.parentElement.parentElement;
            t && t.classList && t.classList.toggle && t.classList.toggle("zsiq-arrow-open");
            for (var i = t && t.querySelectorAll('[data-id="tocchild"]'), a = i && i.length, s = 0; s < a; s++) {
                var n = i[s];
                n && n.classList && n.classList.toggle && n.classList.toggle("zsiq-hide")
            }
        },
        toggleTocContainer: function() {
            var e = document.getElementById("zsiqimagepreview");
            (e = e && e.querySelector('[data-id="toccontainer"]')) && e.classList && e.classList.toggle && e.classList.toggle("zsiq-toc-open")
        },
        articleScrollToView: function(e) {
            var t = e.getAttribute("data-id"),
                i = document.getElementById("zsiqimagepreview");
            (i = i && i.querySelector('[id="' + t + '"]')) && i.scrollIntoView && i.scrollIntoView()
        },
        isChatExist: function() {
            try {
                var e = $ZSIQUtil.getIframe().$Support;
                if (e && (e.getTriggerCookie() || e.isChatExist())) return !0
            } catch (e) {}
            return !1
        },
        clearIframeLoader: function() {
            clearTimeout(S)
        },
        getIframeLoader: function() {
            return S
        },
        setLoadContentClass: function() {
            try {
                var e = $ZSIQUtil.getIframe().$Support,
                    t = e.container[0].parentNode; - 1 != t.className.indexOf("loadframe") || !$ZSIQChat.isPreview() && -1 == m.className.indexOf("siqanim") || (t.className += " loadframe", e.handlePostLoadScript(), e.enableHeaderImage())
            } catch (e) {}
        },
        isOnlyCall: function() {
            return $ZSIQChat.getWidgetData().isonlycall
        },
        isCallPlusChat: function() {
            var e = $ZSIQChat.getWidgetData().components;
            return -1 != e.indexOf("chat") && -1 != e.indexOf("call")
        },
        getIconClass: function() {
            return (this.isOnlyCall() ? "siqico-call" : "siqico-chat") + (window._SIQ_NEW_FLOAT ? "-stroke" : "")
        },
        getButtonText: function() {
            var e = $ZSIQWidget.getWidgetObject().i18nkeys;
            return $ZSIQWidget.getEmbedObject().pinfo.only_call_enabled ? this.isCallPlusChat() ? e["sticker.connect.text"] : this.isOnlyCall() ? e["av.info.callnow"] : e["float.chat.text"] : e["float.chat.text"]
        },
        getWidgetStatus: function() {
            var e = $ZSIQWidget.getWidgetObject();
            return this.isOnlyCall() ? e.call_status : e.call_status || e.status
        },
        getEmbedStatus: function() {
            var e = $ZSIQWidget.getWidgetObject(),
                t = $ZSIQChat.getWidgetData(),
                i = -1 != t.embedobj.homepage_configs.conversation_mode.indexOf("call");
            return this.isOnlyCall() || i ? e.call_status || e.status : t.widgetobj.status
        },
        expandChatWindowDimension: function(e) {
            m.classList[e ? "add" : "remove"]("siqcw-exp-window")
        }
    }
}();

function zsiqdrag(e) {
    var o = 0,
        r = 0,
        l = this,
        d = !1;

    function c(e) {
        var t = getComputedStyle(l),
            i = parseInt(t.getPropertyValue("left")) || 0,
            a = parseInt(t.getPropertyValue("top")) || 0;
        if (i < 0 || a < 0) return i < 0 && (l.style.left = "0px"), a < 0 && (l.style.top = "0px"), d = !1, void window.removeEventListener("mousemove", c);
        var s = parseInt(t.getPropertyValue("right")) || 0,
            n = parseInt(t.getPropertyValue("bottom")) || 0;
        if (s < 0 || n < 0) return s < 0 && (l.style.left = i + s + "px"), n < 0 && (l.style.top = a + n + "px"), d = !1, void window.removeEventListener("mousemove", c);
        l.style.left = e.pageX - o + "px", l.style.top = e.pageY - r + "px"
    }
    this.addEventListener("mousedown", function(e) {
        d = !0;
        var t = getComputedStyle(l),
            i = parseInt(t.getPropertyValue("left")) || 0,
            a = parseInt(t.getPropertyValue("top")) || 0;
        o = e.pageX - i, r = e.pageY - a, window.addEventListener("mousemove", c)
    }), this.addEventListener("mouseup", function(e) {
        !0 === d && (d = !1, window.removeEventListener("mousemove", c))
    })
}
Element.prototype.zsiqdrag = zsiqdrag;
var $ZSIQTemplate = {
    getFontFamily: function() {
        return ' style="font-family:inherit"'
    },
    getGravatar: function(t) {
        return t.gravatar[0] == $ZSIQUtil.STATUS_ENABLE && t.gravatar[1] && t.gravatar[1].fpath ? $ZSIQUtil.getImageURL(t, t.gravatar[1]) : ""
    },
    lightenDarkenColor: function(t, e) {
        var r = parseInt(t.slice(1), 16),
            a = Math.round(2.55 * e),
            n = (r >> 16) + a,
            o = (r >> 8 & 255) + a,
            i = (255 & r) + a;
        return "#" + (16777216 + 65536 * (n < 255 ? n < 1 ? 0 : n : 255) + 256 * (o < 255 ? o < 1 ? 0 : o : 255) + (i < 255 ? i < 1 ? 0 : i : 255)).toString(16).slice(1)
    },
    getCustomColor: function(t) {
        var e = window._SIQ_NEW_FLOAT ? JSON.parse($ZSIQWidget.getEmbedObject().einfo.props.color)[1].code : $ZSIQWidget.getWidgetObject().color[1].code;
        return $zv.embedtheme || e || "#0066cc"
    }
};
$ZSIQTemplate.theme1 = {
    getFloatStickerHTML: function(C) {
        var i = $ZSIQTemplate.getGravatar(C),
            t = !0 === C.status ? "" : "zsiq_off",
            l = C.i18nkeys && C.i18nkeys["gravatar.alt.text"] || "",
            a = $ZSIQChat.isSeasonalTheme(),
            r = (($ZSIQWidget.getEmbedObject() || {}).pinfo || {}).hide_float_tooltip ? "mobile_view" : "";
        a && $ZSIQWidgetUI.addClass($ZSIQWidgetUI.getWidgetDiv(), "zsiq_seasonal");
        var d = "show" === $zohosq.values.closeicon ? '<em class="siqico-close siq-hide-bubble" id="hide-widget"></em>' : "",
            e = $ZSIQLSDB.getFromLocalStorage("isTooltipClosed") ? "hide_tooltip" : "";
        return '<div id="zsiq_float" class="zsiq_float ' + t + r + '"' + $ZSIQTemplate.getFontFamily() + '><div class="zsiq_flt_rel"><em id="zsiq_agtpic" class="zsiq_user ' + (i ? "" : "siqicon " + $ZSIQChatWindow.getIconClass()) + '">' + (i ? '<img src="' + i + '" alt="' + l + '" />' : "") + "</em>" + (a ? '<em class="seasonal-img"><svg xmlns="http://www.w3.org/2000/svg" width="60" height="93" viewBox="0 0 60 93" fill="none"> <g id="_ÃÃÃ_1"> <g id="Group"> <path id="Vector" d="M59.859 83.6402C56.8031 82.6608 54.6465 79.8215 52.7617 77.1212C53.9805 77.4615 55.2003 77.7983 56.4202 78.1356C56.6677 78.204 56.8077 77.8343 56.5926 77.6847C53.6828 75.6589 51.3329 72.6446 49.8676 69.2164C49.684 68.7863 49.5141 68.3491 49.3604 67.9053C49.2219 67.5061 49.1271 67.0228 48.8172 66.7372C48.4779 66.4248 47.9159 66.4735 47.5015 66.4309C46.9679 66.3766 46.4344 66.3223 45.9013 66.2681C43.7279 66.0469 41.5546 65.8263 39.3812 65.6051C35.0543 65.1654 30.7273 64.7251 26.4004 64.2854C24.2605 64.0678 22.1211 63.8457 19.9812 63.6326C18.2258 63.4582 16.3466 63.3177 14.6718 64.0501C13.1147 64.7307 11.9999 66.121 11.3684 67.8094C11.3294 67.9139 11.2929 68.0194 11.2579 68.1249C9.43041 71.511 7.11503 74.573 4.43954 77.1841C4.34469 77.2769 4.44664 77.4366 4.55771 77.4072C5.76029 77.0912 6.91975 76.6135 8.0143 75.985C5.90839 79.2808 3.17102 82.1191 0.0887547 84.2722C-0.0644204 84.3792 -0.0040633 84.6475 0.181573 84.6506C2.32704 84.6896 4.4649 84.2966 6.48813 83.5145C5.82471 85.7761 4.49178 87.7628 2.71251 89.1124C2.55883 89.2291 2.6202 89.4756 2.80533 89.4913C5.94238 89.7535 9.11087 89.0851 11.9411 87.5761C11.7605 88.059 11.477 88.4774 11.1006 88.8167C10.9515 88.9517 11.1138 89.2048 11.2802 89.1571C13.9932 88.38 16.5246 86.9421 18.6797 84.9727C17.5497 87.5406 15.9784 89.8494 14.051 91.7626C13.8801 91.932 14.0972 92.1957 14.2838 92.0958C17.3174 90.4692 20.0396 88.1782 22.2652 85.3845C22.3702 87.2637 22.855 89.0952 23.6899 90.7431C23.7771 90.9161 24.014 90.8709 24.0632 90.6893C24.297 89.8195 24.5308 88.9491 24.7647 88.0793C26.653 90.4946 29.3558 92.0258 32.2322 92.3565C32.4325 92.3793 32.4868 92.0958 32.3818 91.9584C31.4785 90.7751 30.9332 89.3158 30.7933 87.7861C32.3483 89.1931 34.192 90.1948 36.1615 90.665C36.3497 90.7096 36.476 90.5088 36.3984 90.3252C36.3486 90.2065 36.2984 90.0878 36.2487 89.9696C39.0637 91.1773 42.0897 91.6971 45.1075 91.5181C45.2957 91.5069 45.424 91.1808 45.2145 91.0824C43.0599 90.069 41.2198 88.3547 39.9503 86.1976C42.6101 88.3593 45.9216 89.5202 49.2301 89.3995C49.4101 89.3929 49.4974 89.1581 49.3751 89.013C48.7898 88.3187 48.2065 87.6223 47.6243 86.9249C50.3545 87.7876 53.2278 88.0428 56.0499 87.6649C56.2624 87.6365 56.3243 87.3215 56.1021 87.2404C54.7946 86.7631 53.522 86.1839 52.2895 85.5098C54.8874 85.6985 57.5213 85.1776 59.9072 84.0282C60.0664 83.9512 60.0066 83.6864 59.861 83.6397L59.859 83.6402Z" fill="#26431C"/> <path id="Vector_2" opacity="0.37" d="M55.2561 82.0456C53.9577 80.4956 52.6608 78.944 51.3634 77.393C51.9654 77.5761 52.8495 77.9109 53.4515 78.0935C53.4515 78.0935 52.6004 76.8929 52.4417 76.5673C53.0767 76.7692 54.7631 76.8118 55.4458 76.8118C55.4458 76.8118 52.9134 74.4512 52.1607 73.2132C51.7843 72.5939 51.5115 72.1998 51.2604 71.5201C51.0352 70.9095 50.8988 70.2115 50.4372 69.7236C49.8955 69.1515 49.0145 69.2012 48.2897 69.1413C47.3879 69.0673 46.4861 68.9932 45.5843 68.9192C43.7807 68.7711 41.9771 68.623 40.1735 68.4749C36.5495 68.1771 32.925 67.8794 29.3011 67.5817C25.7709 67.2916 22.2266 66.937 18.6803 66.9812C17.0181 67.002 15.3408 67.1348 13.7269 67.5538C13.0863 67.7202 11.7098 68.0544 11.1143 68.7188C11.0859 68.727 11.0595 68.7452 11.0398 68.7767C9.74588 70.8318 6.55558 74.8159 6.72803 74.7804C8.33485 74.4502 9.88587 73.8614 11.3091 73.0473C10.8014 75.1136 9.76414 77.0278 8.29782 78.5748C8.1624 78.7178 8.2963 78.9567 8.49056 78.906C11.0291 78.24 13.4738 77.248 15.7593 75.9597C15.3555 76.6992 14.9036 77.4113 14.405 78.0919C14.2935 78.2441 14.4776 78.4444 14.6409 78.3988C16.618 77.8465 18.5098 77.0146 20.2526 75.9323C19.4233 77.8064 18.3795 79.5821 17.151 81.2229C17.0095 81.4121 17.2738 81.6018 17.4457 81.5176C19.8164 80.3617 21.9705 78.7827 23.7878 76.8731C23.7731 78.0174 23.8654 79.1591 24.0596 80.2886C24.0926 80.4814 24.3721 80.493 24.4613 80.3414C25.0172 79.3939 25.5726 78.446 26.1285 77.4985C27.1713 78.8832 28.6194 79.9214 30.2734 80.4575C30.4387 80.5113 30.598 80.3399 30.5518 80.1791C30.2069 78.978 30.2369 77.7252 30.6112 76.5424C33.0645 78.2786 35.7091 79.7312 38.4895 80.8734C39.3102 81.2107 40.1425 81.5186 40.984 81.8001C41.2345 81.8838 41.3892 81.5541 41.2289 81.3796C40.7126 80.8176 40.3337 80.1578 40.1045 79.4381C42.9063 80.8648 45.9013 81.9081 48.9871 82.5178C49.9046 82.6989 50.8298 82.8404 51.7595 82.9479C52.0384 82.9798 52.0658 82.603 51.8878 82.4737C51.4405 82.1475 51.0291 81.7742 50.6609 81.3624C52.075 81.9289 53.554 82.3058 55.0725 82.4879C55.319 82.5173 55.3824 82.1962 55.2556 82.0456H55.2561Z" fill="#050D08"/> <path id="Vector_3" d="M58.0772 70.1061C55.0436 68.1341 51.8873 66.049 49.7915 63.1107C51.1833 63.3593 52.5746 63.6083 53.9663 63.8573C54.2367 63.9055 54.4416 63.585 54.1824 63.4176C51.6986 61.8184 49.9726 59.36 48.4251 56.9604C48.0285 56.3447 47.639 55.7249 47.2444 55.1081C46.8523 54.4954 46.4577 53.9456 45.6837 53.7828C44.8042 53.5971 43.8968 53.4957 43.0082 53.3572C42.0958 53.2147 41.1833 53.0742 40.2698 52.9373C36.6915 52.3991 33.1066 51.8985 29.507 51.5166C27.673 51.3218 25.8349 51.158 23.9942 51.0363C22.2144 50.9186 20.4169 50.7989 18.6326 50.8126C17.746 50.8197 16.9512 51.0277 16.3441 51.6759C15.7978 52.2596 15.4149 52.9971 15.1288 53.727C15.0548 53.9152 14.9888 54.1064 14.93 54.2991C12.7125 56.7316 10.2871 59.0212 7.62375 61.0003C7.54818 61.0566 7.60397 61.1773 7.69273 61.1803C9.05812 61.2285 10.4154 61.1073 11.7483 60.8349C9.63227 63.3943 7.16068 65.6949 4.43548 67.6532C3.61888 68.2401 2.77744 68.7924 1.91671 69.3179C1.79194 69.394 1.7681 69.6283 1.94917 69.6628C4.79762 70.2116 7.70744 70.3551 10.5939 70.0898C10.1958 70.4205 9.73016 70.6625 9.2113 70.7984C9.00943 70.8511 9.01653 71.1793 9.24782 71.1692C11.5738 71.0672 13.8461 70.4251 15.8465 69.2971C14.7809 71.2518 13.4525 73.0656 11.8888 74.6856C11.763 74.8154 11.863 75.065 12.0689 75.0122C15.1557 74.2195 18.1031 72.9667 20.7821 71.3026C20.5605 72.0558 20.1846 72.7506 19.6627 73.3638C19.5374 73.5114 19.757 73.7133 19.9163 73.6281C22.1166 72.4539 24.0931 70.9222 25.7501 69.1079C25.8414 70.9516 25.7821 72.7983 25.5716 74.6328C25.5503 74.817 25.8298 74.8915 25.9256 74.7409C26.9644 73.1046 27.7592 71.336 28.2851 69.4883C29.6023 71.4162 31.4232 72.9956 33.5611 74.0582C33.696 74.1251 33.9339 74.0283 33.8664 73.8528C33.556 73.0423 33.3648 72.2003 33.3029 71.3426C36.588 73.5961 40.566 74.9047 44.5912 75.1101C45.7704 75.1705 46.9492 75.1269 48.1228 75.0097C48.3059 74.9914 48.3501 74.7099 48.1908 74.6303C46.6966 73.8797 45.3956 72.812 44.4152 71.5024C46.8736 72.4879 49.5887 72.7892 52.2195 72.3525C52.4412 72.3159 52.4366 72.0547 52.2936 71.9411C52.0694 71.7636 51.8452 71.5866 51.621 71.4091C53.7802 71.3852 55.9287 71.088 58.0042 70.5179C58.1989 70.4647 58.2517 70.2197 58.0782 70.1066L58.0772 70.1061Z" fill="#294B1C"/> <path id="Vector_4" opacity="0.27" d="M49.0338 57.8891C48.659 57.3337 48.3044 56.8741 47.9727 56.2919C47.6567 55.7375 47.4021 55.1324 47.04 54.6069C46.6925 54.1028 46.2371 53.7985 45.6441 53.6473C44.932 53.4657 44.1941 53.3597 43.4713 53.2268C42.0131 52.9575 40.5518 52.7039 39.0875 52.4706C33.2486 51.5404 27.3433 50.9287 21.4247 50.9769C19.93 50.9891 18.3582 51.0393 16.9963 51.7276C16.0971 52.182 15.3023 52.9377 14.9325 53.8806C13.0539 56.7083 9.87167 59.2113 9.87167 59.2113C11.7711 59.1347 14.2519 59.0191 16.1103 58.6245C15.6239 59.0815 15.1167 59.5162 14.5876 59.9239C14.4563 60.0254 14.4679 60.314 14.6865 60.2886C15.4413 60.2009 16.1874 60.0639 16.9223 59.8753C16.4085 60.8369 15.6979 61.6829 14.8255 62.3448C14.648 62.4792 14.7494 62.744 14.9772 62.7044C17.9803 62.1785 20.8709 61.0819 23.4688 59.4893C22.7815 60.8146 21.9395 62.0542 20.9535 63.1787C20.8049 63.3486 20.9911 63.6123 21.1995 63.4972C22.6927 62.6699 24.1241 61.7372 25.4854 60.7081C25.7968 62.4929 26.3005 64.2377 26.9892 65.9145C27.075 66.123 27.3859 66.1078 27.3965 65.8592C27.4442 64.7145 27.5857 63.5712 27.7982 62.4442C29.2635 64.185 31.2122 65.4743 33.4003 66.124C33.6001 66.1833 33.735 65.9627 33.6534 65.7948C33.1365 64.7317 32.7069 63.6316 32.3631 62.5021C35.0948 64.4102 38.2588 65.6908 41.55 66.2173C42.5309 66.374 43.5205 66.4653 44.5136 66.4902C44.7266 66.4953 44.8245 66.1762 44.6252 66.0773C43.5124 65.524 42.4995 64.8053 41.6134 63.942C42.887 64.3249 44.2133 64.5177 45.5463 64.5146C45.7486 64.5146 45.8278 64.2762 45.7035 64.1347C44.962 63.2877 44.2833 62.3905 43.6686 61.4491C44.7545 61.7428 45.8597 61.9538 46.9786 62.0831C47.2251 62.1115 47.2459 61.7808 47.0917 61.6662C46.618 61.3152 46.236 60.8577 45.9713 60.3358C47.708 61.0489 49.9599 61.3446 51.8381 61.4719C51.8381 61.4719 49.7981 59.0201 49.0343 57.8891H49.0338Z" fill="#050D08"/> <path id="Vector_5" d="M53.4738 55.6928C50.5878 53.9496 47.9991 51.7118 45.8714 49.0855C45.8151 49.016 45.7598 48.946 45.704 48.876C46.3131 48.9922 46.94 49.0221 47.5451 48.9775C47.7156 48.9648 47.8124 48.765 47.6866 48.6336C44.5805 45.386 41.9943 41.6591 40.1542 37.5431C39.6318 36.374 39.1758 35.177 38.7736 33.9607C38.7213 33.8035 38.5844 33.736 38.4267 33.7624C35.4945 34.2473 32.5101 34.1809 29.5526 34.0338C28.0523 33.9592 26.553 33.8634 25.0517 33.806C23.7954 33.7579 22.3909 33.6016 21.2173 34.157C20.4047 34.5415 19.6617 35.5752 19.8565 36.4957C18.7107 39.4745 17.0719 42.2915 15.0553 44.7489C14.4304 45.5102 13.766 46.2381 13.0676 46.9319C12.9686 47.0303 13.0386 47.2281 13.1857 47.2195C13.7746 47.185 14.3508 47.081 14.9102 46.9066C12.6349 49.7936 9.76719 52.1683 6.53124 53.8938C6.35676 53.9871 6.42523 54.2194 6.58145 54.2808C9.4791 55.4195 12.5827 55.9835 15.6913 55.9429C15.1593 56.4881 14.6089 57.0146 14.0388 57.5203C13.9024 57.641 14.0145 57.8687 14.1829 57.8703C16.8072 57.8905 19.2148 56.7569 21.4967 55.5528C20.7699 56.7407 19.892 57.8246 18.8791 58.7822C18.7269 58.9257 18.8857 59.1788 19.0784 59.1271C20.8232 58.6605 22.5071 57.9676 24.0769 57.0694C24.5755 56.7838 25.0624 56.478 25.5356 56.1524C26.0545 57.8317 27.11 59.3305 28.5119 60.4164C28.6067 60.49 28.7406 60.4073 28.771 60.3104C29.192 58.9653 29.683 57.6445 30.247 56.3537C31.5459 58.7502 33.8618 60.5437 36.4739 61.2629C37.2535 61.4775 38.0589 61.5916 38.8664 61.6063C39.0525 61.6093 39.1271 61.3816 39.012 61.2528C38.1228 60.2592 37.5609 58.9683 37.4051 57.641C39.192 58.7852 41.3618 59.2569 43.4647 58.9957C43.662 58.9714 43.7573 58.7249 43.5697 58.6052C42.7399 58.0767 42.0293 57.3742 41.4902 56.5475C41.407 56.4197 41.3294 56.2893 41.2563 56.1574C43.523 57.0313 47.4087 58.1497 49.8133 58.0599C49.9975 58.0528 50.036 57.8342 49.9016 57.7328C49.6571 57.5482 48.0275 56.5708 47.8119 56.3552C49.6835 56.5373 51.5789 56.4278 53.4241 56.0707C53.6042 56.0357 53.6158 55.7786 53.4733 55.6923L53.4738 55.6928Z" fill="#305923"/> <path id="Vector_6" opacity="0.19" d="M42.2185 40.7182C42.0729 40.2034 41.8219 39.7139 41.5429 39.2554C41.2716 38.8101 40.9023 38.4591 40.4504 38.1999C39.4913 37.6496 38.3729 37.3032 37.3174 36.9928C35.0928 36.339 32.7845 35.9901 30.4869 35.7096C28.4261 35.458 26.3258 35.3135 24.2656 35.6472C23.1583 35.8262 22.0719 36.161 21.0814 36.6925C20.4402 37.0369 19.6384 37.5436 19.2985 38.2395C18.3602 40.2039 16.5328 42.7881 16.5328 42.7881C17.9621 42.3539 19.333 42.3007 20.5924 41.5008C20.2206 42.1749 17.6978 45.2298 17.1698 45.7968C17.0562 45.9185 17.1663 46.1615 17.3443 46.0966C19.3198 45.3738 21.1285 44.2473 22.6425 42.7932C22.1556 43.976 21.6053 45.1314 20.9936 46.2558C20.9099 46.4095 21.0641 46.5678 21.2437 46.5059C22.7232 45.9956 25.6315 44.2098 26.4476 42.4752C26.869 44.6754 28.2512 45.599 29.8676 47.1531C29.9929 47.2738 30.1892 47.1825 30.1988 47.0161C30.2247 46.5581 30.2506 46.0996 30.2764 45.6416C32.2398 47.2322 34.5724 48.3338 37.0547 48.8238C37.2048 48.8532 37.3904 48.6843 37.2783 48.5332C36.4268 47.3849 35.9074 46.0149 35.7649 44.5968C37.6283 46.3558 39.8275 47.7318 42.2241 48.6458C42.4133 48.7178 42.5431 48.4819 42.4665 48.3303C42.1155 47.6349 41.7646 46.939 41.4136 46.2437C41.2416 45.9033 41.0702 45.563 40.8983 45.2227C40.8328 45.0928 40.6396 44.7687 40.6786 44.5658C42.0461 45.7491 44.2798 46.4039 46.1108 46.8934C46.2873 46.9406 43.0549 43.6747 42.2195 40.7202L42.2185 40.7182Z" fill="#050D08"/> <path id="Vector_7" d="M46.1143 39.9863C43.5114 38.4044 41.2021 36.3542 39.3107 33.9668C38.8699 33.4104 38.4535 32.8348 38.0599 32.2439C38.5093 32.3433 38.9592 32.4422 39.4086 32.5416C39.5881 32.5812 39.7712 32.3423 39.6044 32.2048C37.3296 30.3277 35.4281 28.0001 34.0115 25.4149C33.6077 24.6774 33.243 23.9187 32.922 23.1416C32.8839 23.0488 32.814 22.9788 32.7074 22.9783C31.057 22.9712 29.4061 23.0016 27.7571 23.0711C27.3448 23.0884 26.9324 23.1081 26.5206 23.1305C26.1934 23.1482 25.8151 23.1305 25.5209 23.2978C25.2536 23.4505 25.1516 23.7274 25.1263 24.0201C25.1232 24.0576 25.1207 24.0952 25.1187 24.1332C23.7726 26.7524 22.1323 29.1839 20.1121 31.338C20.0644 31.3887 20.0953 31.4871 20.1719 31.4831C20.6994 31.4552 21.2122 31.3578 21.7108 31.196C20.0122 33.524 18.0442 35.669 15.8769 37.5665C15.2252 38.1371 14.5542 38.6853 13.8659 39.2103C13.7741 39.2803 13.7563 39.4669 13.9029 39.4918C15.4337 39.7535 16.9887 39.7525 18.5169 39.4938C18.3181 39.7672 18.0615 39.9868 17.7531 40.1471C17.6217 40.2151 17.6785 40.4458 17.8307 40.4337C19.9452 40.2597 21.9953 39.5897 23.7979 38.4759C23.345 39.6637 22.7181 40.7806 21.934 41.7833C21.8482 41.8929 21.9218 42.0978 22.0851 42.043C24.2057 41.334 26.1128 40.0751 27.603 38.4236C28.3029 40.422 29.7241 42.1333 31.5799 43.1807C31.6753 43.2344 31.8051 43.167 31.8021 43.0534C31.7767 42.0278 31.8695 41.0043 32.0765 40C32.7485 40.6289 33.5595 41.0869 34.4492 41.338C34.5684 41.3715 34.6947 41.2548 34.6551 41.1321C34.5207 40.7147 34.3858 40.2972 34.2514 39.8793C36.0996 41.266 38.3227 42.0846 40.6355 42.2302C40.8186 42.2418 40.8531 41.9979 40.7222 41.9091C39.755 41.2518 39.0698 40.2638 38.765 39.1444C41.0281 40.175 43.5433 40.5944 46.0205 40.3332C46.197 40.3145 46.2837 40.0888 46.1143 39.9858V39.9863Z" fill="#38662E"/> <path id="Vector_8" opacity="0.23" d="M34.2057 25.2612C33.9587 24.6232 33.6321 24.0211 33.3196 23.4135C33.0118 22.8145 32.5578 22.3788 31.8685 22.2936C31.5089 22.2495 31.1483 22.289 30.7892 22.32L29.5516 22.4275C28.7102 22.501 27.8687 22.5741 27.0273 22.6471C26.3278 22.708 25.5681 22.7009 25.1207 23.3308C24.9102 23.6275 24.8123 23.9978 24.8407 24.3564C24.049 26.7078 21.7717 29.401 21.7717 29.401C22.4041 29.0546 23.5022 28.7133 23.9765 28.1782C23.7452 29.332 23.3389 30.4398 22.7536 31.4658C22.677 31.6003 22.8256 31.72 22.9514 31.6637C24.6967 30.879 26.375 29.9569 27.9712 28.9024C27.7881 29.5841 27.605 30.2658 27.4209 30.9475C27.3732 31.1255 27.5984 31.1925 27.6973 31.0641C28.24 30.3607 28.7827 29.6572 29.3254 28.9537C30.3058 30.2628 31.6124 31.3 33.1203 31.9416C33.2299 31.9883 33.4069 31.9081 33.3516 31.7641C33.2704 31.5526 33.2009 31.338 33.1411 31.121C34.4984 31.9817 35.9677 32.6547 37.5066 33.1214C37.6816 33.1746 37.7622 32.9631 37.6689 32.8429C37.4097 32.5102 37.2317 32.1343 37.1272 31.7321C37.8454 31.9873 38.5925 31.9188 39.3528 31.9938C39.508 32.0091 35.7319 29.2078 34.2052 25.2607L34.2057 25.2612Z" fill="#050D08"/> <path id="Vector_9" d="M39.4056 27.744C37.9281 26.7468 36.6418 25.49 35.6162 24.0353C36.0743 24.1961 36.547 24.3042 37.0354 24.3579C37.2068 24.3767 37.2723 24.1439 37.1688 24.0358C35.9383 22.7516 34.9371 21.2696 34.1991 19.6541C34.5958 19.789 34.9929 19.9235 35.3895 20.0579C35.5812 20.1228 35.7075 19.8509 35.5721 19.7444C32.7221 17.4914 29.822 10.5133 29.823 10.5103C29.8341 10.4722 29.7758 10.4565 29.7636 10.4941C29.7626 10.4966 27.1023 16.6931 25.3023 19.0602C24.7418 19.7972 24.1454 20.5083 23.5185 21.1894C23.4043 21.3137 23.5469 21.478 23.6909 21.4131C24.1403 21.2112 24.5892 21.0094 25.0385 20.8075C24.2311 23.0402 22.6385 24.9199 20.5889 26.1204C20.4671 26.192 20.5092 26.4212 20.6659 26.4045C22.5274 26.2031 24.3487 25.7314 26.0717 25.0005C25.8217 26.4167 25.3779 27.7902 24.7474 29.084C24.6957 29.19 24.7829 29.3473 24.9143 29.3011C26.4557 28.762 27.8865 27.9636 29.1565 26.9391C30.3043 28.0889 31.6134 29.0673 33.0427 29.8398C33.1736 29.9103 33.343 29.7637 33.2552 29.6272C32.7034 28.766 32.3225 27.8084 32.1384 26.8042C32.744 27.2449 33.4241 27.5665 34.155 27.7516C34.3122 27.7917 34.4162 27.602 34.3097 27.4858C34.1763 27.3398 34.0536 27.1866 33.9415 27.0263C35.6254 27.8003 37.4665 28.1366 39.3239 28.0453C39.4877 28.0372 39.5389 27.8343 39.4056 27.7445V27.744Z" fill="#4B783B"/> <path id="Vector_10" d="M39.4056 27.7435C37.9281 26.7463 36.6418 25.4895 35.6162 24.0348C36.0743 24.1956 36.547 24.3036 37.0354 24.3574C37.2068 24.3762 37.2723 24.1434 37.1688 24.0353C35.9383 22.7511 34.9371 21.269 34.1991 19.6536C34.5958 19.788 34.9929 19.9229 35.3895 20.0573C35.5813 20.1223 35.7075 19.8504 35.5721 19.7439C32.7222 17.4909 29.822 10.5128 29.823 10.5098C29.8321 10.4793 29.7971 10.4641 29.7763 10.4773C29.7799 10.7345 29.7839 10.9911 29.7905 11.2483C29.8275 12.6978 29.9341 14.1515 30.2404 15.5711C30.3292 15.1781 30.3697 14.7753 30.4945 14.3909C30.4996 14.3752 30.5265 14.3721 30.5295 14.3909C30.6279 14.9493 30.7613 15.5006 30.9221 16.0439C31.5013 18.0037 32.4077 19.8433 33.2537 21.6966C33.2623 21.7154 33.2425 21.7438 33.2217 21.7286C32.9915 21.5632 32.7749 21.3806 32.5593 21.1965C32.6354 21.5582 32.7369 21.9137 32.8596 22.2621C33.3394 23.6209 34.0941 24.8763 34.9234 26.0484C34.9371 26.0677 34.9143 26.0956 34.893 26.088C34.0835 25.8156 33.3567 25.3576 32.6897 24.8316C32.7531 25.459 33.1289 26.0104 33.3288 26.5987C33.3374 26.6241 33.308 26.6393 33.2877 26.6302C32.8804 26.445 32.5035 26.1849 32.1693 25.8886C31.8939 25.6447 31.6236 25.3591 31.4638 25.0218C31.4805 25.3901 31.5297 25.7558 31.6038 26.1169C31.7656 26.9051 32.0395 27.6745 32.4199 28.3841C32.6364 28.7873 32.8916 29.1784 33.1933 29.5263C32.6755 28.6914 32.3159 27.7694 32.1394 26.8041C32.745 27.2449 33.4251 27.5665 34.156 27.7516C34.3132 27.7917 34.4172 27.602 34.3107 27.4858C34.1773 27.3398 34.0546 27.1866 33.942 27.0263C35.6259 27.8003 37.467 28.1366 39.3244 28.0458C39.4882 28.0377 39.5395 27.8348 39.4061 27.745L39.4056 27.7435Z" fill="#3E6B2E"/> <path id="Vector_11" d="M22.4442 34.1353C22.0379 34.505 21.6824 34.9326 21.2918 35.3196C20.9003 35.7076 20.494 36.0753 20.1161 36.4776C20.1014 36.4933 20.1202 36.5176 20.139 36.507C20.6411 36.2366 21.0595 35.8912 21.4678 35.4956C21.8629 35.1122 22.2667 34.6912 22.5406 34.2099C22.5756 34.148 22.4954 34.0891 22.4442 34.1353Z" fill="#4B783B"/> <path id="Vector_12" d="M25.527 32.4919C25.3941 32.8373 25.2637 33.1842 25.1278 33.5281C24.9954 33.8628 24.7692 34.1859 24.681 34.5344C24.6546 34.6389 24.7844 34.717 24.862 34.6399C25.1202 34.3847 25.2511 33.9765 25.3697 33.6402C25.5011 33.2684 25.5686 32.8921 25.5731 32.498C25.5731 32.4696 25.5361 32.468 25.527 32.4919Z" fill="#4B783B"/> <path id="Vector_13" d="M29.7728 34.2768C29.649 33.6808 29.5359 33.0818 29.4233 32.4833C29.4096 32.4093 29.2924 32.4275 29.2935 32.5011C29.3016 33.1117 29.3569 33.7118 29.4563 34.3138C29.5552 34.9118 29.6607 35.5123 29.9386 36.0561C29.9751 36.1281 30.0974 36.0956 30.0923 36.0145C30.0568 35.4236 29.892 34.855 29.7723 34.2768H29.7728Z" fill="#4B783B"/> <path id="Vector_14" d="M27.2281 35.631C27.2236 35.6 27.1718 35.5934 27.1591 35.6218C27.04 35.8962 26.9913 36.1909 26.9497 36.4856C26.9066 36.7899 26.8396 37.0937 26.8629 37.4006C26.8716 37.5122 27.0197 37.5345 27.0577 37.427C27.1591 37.1358 27.1723 36.8259 27.2094 36.5206C27.2449 36.2244 27.2738 35.9267 27.2286 35.6305L27.2281 35.631Z" fill="#4B783B"/> <path id="Vector_15" d="M33.7477 38.1878C33.6067 37.9139 33.3384 37.6938 33.1436 37.457C32.9159 37.18 32.6968 36.896 32.4863 36.6059C32.4437 36.547 32.357 36.5967 32.3884 36.6632C32.5461 36.9949 32.7318 37.3104 32.955 37.6025C33.1436 37.85 33.3501 38.1574 33.6316 38.304C33.7081 38.3441 33.7873 38.2639 33.7477 38.1878Z" fill="#4B783B"/> <path id="Vector_16" d="M35.6807 35.9561C35.5721 35.7456 35.3824 35.5807 35.2293 35.4022C35.0431 35.1856 34.8605 34.964 34.6921 34.7327C34.3832 34.3087 34.0987 33.8568 33.8486 33.3957C33.8126 33.3288 33.6975 33.3744 33.7239 33.4485C33.9085 33.9729 34.1448 34.4583 34.4568 34.9193C34.5998 35.1308 34.751 35.3388 34.9183 35.5315C35.0959 35.7359 35.2866 35.9814 35.5356 36.1006C35.631 36.1463 35.7314 36.0529 35.6807 35.9556V35.9561Z" fill="#4B783B"/> <path id="Vector_17" d="M39.0409 37.7121C38.8654 37.4615 38.6417 37.2586 38.4403 37.0299C38.2283 36.789 38.0326 36.5343 37.8185 36.2949C37.7734 36.2447 37.6729 36.2975 37.7003 36.3639C37.9306 36.9208 38.3846 37.5432 38.9283 37.8252C38.9957 37.8602 39.0921 37.7846 39.0414 37.7121H39.0409Z" fill="#4B783B"/> <path id="Vector_18" d="M37.9463 35.0923C37.8936 34.9325 37.7571 34.8103 37.644 34.6901C37.5101 34.5486 37.3732 34.4233 37.221 34.3021C37.1815 34.2706 37.1186 34.3097 37.147 34.3594C37.2368 34.5171 37.3316 34.6627 37.4432 34.8057C37.5487 34.9406 37.6562 35.1166 37.8119 35.1958C37.8789 35.2297 37.9737 35.1729 37.9468 35.0918L37.9463 35.0923Z" fill="#4B783B"/> <path id="Vector_19" d="M18.2628 37.2363C18.0214 37.3326 17.8393 37.5234 17.6471 37.6928C17.4412 37.8748 17.252 38.0661 17.0892 38.2877C17.0562 38.3323 17.1181 38.3805 17.1602 38.3587C17.394 38.237 17.605 38.0848 17.8074 37.9164C18.0062 37.7511 18.2334 37.5979 18.3663 37.3712C18.4038 37.3078 18.3399 37.2053 18.2623 37.2363H18.2628Z" fill="#4B783B"/> <path id="Vector_20" d="M24.4568 47.0264C24.2483 47.4945 24.0008 47.9545 23.7426 48.3968C23.6199 48.6073 23.4931 48.8163 23.3648 49.0227C23.2319 49.2362 23.0635 49.4381 22.996 49.6836C22.9747 49.7622 23.0711 49.853 23.1452 49.7982C23.3384 49.6552 23.45 49.4528 23.5712 49.2494C23.7122 49.0126 23.8405 48.7716 23.9567 48.5216C24.1804 48.0408 24.3493 47.5523 24.5004 47.0446C24.508 47.0198 24.4684 47.0015 24.4573 47.0264H24.4568Z" fill="#38662E"/> <path id="Vector_21" d="M21.7575 52.2784C21.4136 52.6335 21.0443 52.9697 20.6893 53.3146C20.5214 53.4779 20.3484 53.6352 20.1719 53.7894C19.9817 53.9557 19.7469 54.1211 19.5917 54.3204C19.5126 54.4218 19.6074 54.5446 19.7261 54.4944C19.9407 54.4036 20.1466 54.2174 20.3251 54.0663C20.5255 53.8969 20.7157 53.7123 20.9008 53.5261C21.2665 53.1574 21.5429 52.7618 21.8163 52.3236C21.8391 52.287 21.7869 52.247 21.7569 52.2779L21.7575 52.2784Z" fill="#38662E"/> <path id="Vector_22" d="M20.3905 49.6039C19.9254 50.137 19.3888 50.6168 18.8446 51.0677C18.5712 51.2939 18.2872 51.509 17.9965 51.7129C17.7206 51.9066 17.3529 52.0684 17.1267 52.3175C17.0369 52.4164 17.1252 52.567 17.255 52.5381C17.5796 52.4666 17.9017 52.1988 18.17 52.0101C18.4728 51.7976 18.7624 51.5683 19.0399 51.3234C19.5937 50.8339 20.0532 50.2745 20.4905 49.681C20.5331 49.6232 20.4377 49.5497 20.3905 49.6039Z" fill="#38662E"/> <path id="Vector_23" d="M14.9016 51.4125C14.5577 51.5546 14.2585 51.8153 13.9643 52.0379C13.6422 52.2819 13.3318 52.5421 12.9965 52.7683C12.9686 52.7871 12.9925 52.8276 13.0229 52.8129C13.3982 52.6283 13.7792 52.4584 14.1327 52.2337C14.439 52.0389 14.7748 51.8239 14.9873 51.5231C15.0233 51.4724 14.9625 51.3872 14.9021 51.412L14.9016 51.4125Z" fill="#38662E"/> <path id="Vector_24" d="M18.2146 48.0366C17.9347 48.2811 17.7293 48.6549 17.5 48.947C17.2718 49.2377 17.0415 49.5197 16.8315 49.824C16.7889 49.8854 16.8736 49.9691 16.9345 49.9275C17.2657 49.7002 17.5426 49.4289 17.7952 49.117C18.0244 48.8339 18.3115 48.5078 18.4155 48.1543C18.4515 48.0326 18.3009 47.9621 18.2146 48.0371V48.0366Z" fill="#38662E"/> <path id="Vector_25" d="M26.6956 51.5612C26.7088 51.1757 26.693 50.7908 26.7042 50.4058C26.7042 50.3921 26.6844 50.3901 26.6809 50.4027C26.5749 50.771 26.4754 51.1301 26.4389 51.513C26.4049 51.8686 26.3339 52.3098 26.4531 52.6532C26.4846 52.7435 26.6159 52.7511 26.6443 52.6532C26.7432 52.3134 26.6839 51.9132 26.6956 51.5612Z" fill="#38662E"/> <path id="Vector_26" d="M31.1808 52.747C31.1417 52.4904 30.9728 52.2281 30.8734 51.9887C30.7684 51.7357 30.6741 51.4775 30.5909 51.2158C30.4271 50.702 30.2546 50.1648 30.1582 49.6348C30.1506 49.5932 30.0806 49.6024 30.0842 49.645C30.1293 50.2252 30.1831 50.7684 30.3459 51.3309C30.4266 51.6083 30.5189 51.8822 30.6239 52.1516C30.7162 52.3889 30.8054 52.6765 30.984 52.8616C31.0732 52.9545 31.1975 52.8545 31.1808 52.747Z" fill="#38662E"/> <path id="Vector_27" d="M34.3361 56.3477C34.0972 56.0114 33.7903 55.7375 33.5458 55.4048C33.3049 55.0761 33.0605 54.7211 32.888 54.3523C32.8596 54.292 32.7587 54.3346 32.78 54.398C33.0427 55.1669 33.4698 56.0636 34.2326 56.4511C34.294 56.4826 34.3827 56.4141 34.3361 56.3477Z" fill="#38662E"/> <path id="Vector_28" d="M40.5528 53.4759C40.3408 53.2107 39.9833 53.022 39.721 52.8069C39.4441 52.5797 39.1814 52.3357 38.9318 52.0786C38.4206 51.5511 37.9397 50.9978 37.5431 50.3779C37.4909 50.2963 37.3671 50.3678 37.4128 50.454C37.7658 51.121 38.1781 51.7621 38.698 52.3124C38.9628 52.5924 39.2468 52.8551 39.5445 53.0996C39.8027 53.3111 40.1055 53.5931 40.4336 53.6809C40.561 53.7148 40.6254 53.5667 40.5528 53.4759Z" fill="#38662E"/> <path id="Vector_29" d="M45.7841 55.1862C45.3048 54.8174 44.6658 54.6394 44.086 54.4948C43.9907 54.471 43.9552 54.6079 44.0459 54.6404C44.6145 54.8443 45.1517 55.1446 45.7278 55.3195C45.8136 55.3459 45.845 55.2328 45.7841 55.1862Z" fill="#38662E"/> <path id="Vector_30" d="M40.9956 49.9955C40.7948 49.6095 40.3728 49.399 40.0396 49.1439C39.9909 49.1063 39.9396 49.1839 39.9767 49.2255C40.2531 49.5359 40.491 49.9351 40.8861 50.1055C40.9576 50.1365 41.0352 50.0721 40.9956 49.996V49.9955Z" fill="#38662E"/> <path id="Vector_31" d="M45.9114 51.6276C45.424 51.0728 44.7839 50.6198 44.158 50.2303C44.0977 50.1928 44.0368 50.277 44.0835 50.3267C44.5912 50.8623 45.1633 51.3984 45.8054 51.7651C45.8942 51.8158 45.9753 51.7012 45.9109 51.6282L45.9114 51.6276Z" fill="#38662E"/> <path id="Vector_32" d="M24.0845 65.1705C23.8121 65.6285 23.5073 66.0768 23.2131 66.5217C22.9195 66.9655 22.5375 67.357 22.2743 67.8186C22.2383 67.8825 22.3144 67.9718 22.3808 67.9251C22.8155 67.6177 23.1289 67.1303 23.4135 66.689C23.7239 66.2072 23.9242 65.7162 24.0891 65.1725C24.0901 65.17 24.086 65.1679 24.0845 65.1705Z" fill="#305923"/> <path id="Vector_33" d="M19.5714 68.5296C18.6995 69.4436 17.7135 70.248 16.8609 71.1798C16.8026 71.2437 16.8802 71.3603 16.9583 71.3056C18.0062 70.5701 18.8273 69.5735 19.6318 68.5895C19.6657 68.5479 19.61 68.4891 19.5719 68.5296H19.5714Z" fill="#305923"/> <path id="Vector_34" d="M19.3193 63.7635C18.9318 64.1971 18.5129 64.608 18.1056 65.0234C17.715 65.4215 17.2545 65.774 16.9228 66.2244C16.866 66.3015 16.973 66.3852 17.0455 66.3472C17.5517 66.0799 17.957 65.6112 18.3445 65.1989C18.7447 64.7728 19.0769 64.3118 19.4086 63.8325C19.4451 63.7797 19.3624 63.7158 19.3198 63.764L19.3193 63.7635Z" fill="#305923"/> <path id="Vector_35" d="M12.9022 66.5323C12.7145 66.5688 12.5786 66.7458 12.4361 66.8655C12.2601 67.0136 12.077 67.1526 11.8878 67.2829C11.5246 67.533 11.1549 67.779 10.7806 68.0113C10.7517 68.0295 10.7699 68.0772 10.8044 68.0671C11.2558 67.9377 11.6702 67.7572 12.0653 67.5015C12.2433 67.3864 12.4163 67.2631 12.5842 67.1338C12.7495 67.006 12.9768 66.8756 13.0361 66.6657C13.0599 66.5815 12.9813 66.5165 12.9027 66.5323H12.9022Z" fill="#305923"/> <path id="Vector_36" d="M13.1543 62.8292C12.9854 62.9331 12.8657 63.1 12.7338 63.2466C12.5786 63.4196 12.4188 63.5879 12.2596 63.7568C11.9492 64.0855 11.6337 64.3974 11.3532 64.753C11.3111 64.8068 11.3628 64.892 11.4303 64.8529C11.8345 64.6201 12.1698 64.3249 12.5035 64.0008C12.7982 63.7148 13.206 63.3754 13.3653 62.9915C13.415 62.8723 13.2532 62.7678 13.1538 62.8292H13.1543Z" fill="#305923"/> <path id="Vector_37" d="M30.0974 68.6686C30.0228 68.278 29.8514 67.9063 29.7307 67.5284C29.6084 67.1465 29.507 66.7585 29.3599 66.3852C29.332 66.3142 29.2219 66.3192 29.2209 66.4039C29.2159 66.8168 29.3026 67.2195 29.4182 67.6146C29.5324 68.0042 29.6586 68.4201 29.9031 68.7502C29.9741 68.8466 30.1207 68.7908 30.0969 68.6686H30.0974Z" fill="#305923"/> <path id="Vector_38" d="M37.8844 67.846C37.6887 67.6157 37.3955 67.4382 37.1551 67.2561C36.8878 67.0537 36.6164 66.858 36.3552 66.648C35.9216 66.299 35.4413 65.9085 35.2186 65.3871C35.1917 65.3237 35.0822 65.3693 35.1065 65.4342C35.3205 66.0003 35.6553 66.442 36.1103 66.8367C36.3578 67.0512 36.6134 67.2592 36.8731 67.4585C37.147 67.6685 37.4457 67.9205 37.7719 68.0392C37.89 68.0823 37.9519 67.9256 37.8844 67.846Z" fill="#305923"/> <path id="Vector_39" d="M38.2745 70.8232C38.0371 70.5346 37.6476 70.3378 37.361 70.0999C37.0608 69.8509 36.726 69.6323 36.4541 69.3523C36.3897 69.2864 36.2954 69.3843 36.3542 69.4522C36.6322 69.7758 36.866 70.1101 37.1936 70.389C37.469 70.6234 37.7952 70.9378 38.1502 71.0357C38.2816 71.0717 38.3511 70.916 38.274 70.8227L38.2745 70.8232Z" fill="#305923"/> <path id="Vector_40" d="M48.9734 69.9544C48.8466 69.8307 48.6742 69.8139 48.5063 69.7688C48.3359 69.7226 48.1644 69.682 47.994 69.6349C47.6258 69.5329 47.2631 69.4107 46.9081 69.2692C46.1899 68.9826 45.4681 68.6463 44.8118 68.2365C44.7454 68.1949 44.6617 68.2974 44.7261 68.3476C45.3535 68.837 45.9966 69.2616 46.7316 69.575C47.0841 69.7252 47.4437 69.858 47.8104 69.9706C48.0072 70.031 48.2055 70.0893 48.4074 70.1284C48.5748 70.1608 48.7584 70.2217 48.9207 70.1558C49.0008 70.1233 49.0444 70.0239 48.9739 69.9549L48.9734 69.9544Z" fill="#305923"/> <path id="Vector_41" d="M48.6554 66.5049C48.4018 66.2705 48.0488 66.13 47.7419 65.9779C47.4249 65.8206 47.0998 65.6908 46.7691 65.5665C46.6722 65.53 46.6241 65.6741 46.7017 65.7258C47.0009 65.9251 47.3022 66.1148 47.6207 66.2812C47.9103 66.4328 48.2197 66.6316 48.5428 66.6971C48.6488 66.7184 48.7457 66.5875 48.6554 66.5038V66.5049Z" fill="#305923"/> <path id="Vector_42" d="M53.9683 68.8087C53.6889 68.5662 53.2902 68.4359 52.9458 68.3141C52.573 68.1828 52.1901 68.1031 51.7975 68.061C51.7509 68.056 51.7331 68.129 51.7737 68.1488C52.1089 68.3141 52.4483 68.4668 52.7947 68.6083C53.1325 68.7463 53.4966 68.9421 53.8583 68.9973C53.9577 69.0126 54.0637 68.8908 53.9683 68.8082V68.8087Z" fill="#305923"/> <path id="Vector_43" d="M27.7982 83.4018C27.7216 83.1188 27.6547 82.8322 27.5979 82.5446C27.4848 81.9679 27.4127 81.3725 27.3402 80.7897C27.3362 80.7588 27.287 80.7441 27.2799 80.7816C27.1652 81.3791 27.1662 81.9416 27.2525 82.5441C27.3306 83.0894 27.4335 83.7868 27.7805 84.2331C27.8413 84.3112 27.9783 84.2453 27.9737 84.153C27.9605 83.8978 27.8647 83.6473 27.7982 83.4018Z" fill="#2F5222"/> <path id="Vector_44" d="M29.2219 88.24C29.1301 87.89 28.909 87.5649 28.7467 87.2444C28.5737 86.903 28.3993 86.5612 28.2314 86.2173C28.2162 86.1863 28.1746 86.2097 28.1796 86.2391C28.2471 86.6403 28.344 87.0227 28.4921 87.4016C28.6214 87.7313 28.7645 88.1046 29.0165 88.3597C29.1038 88.4474 29.2524 88.3577 29.2214 88.2405L29.2219 88.24Z" fill="#2F5222"/> <path id="Vector_45" d="M24.332 81.9376C24.3269 81.8381 24.1778 81.8366 24.1763 81.9376C24.1712 82.3068 24.1215 82.6786 24.1017 83.0478C24.0825 83.4064 24.0003 83.7995 24.0444 84.1556C24.0601 84.2844 24.2306 84.3199 24.2762 84.187C24.3903 83.8528 24.3731 83.4465 24.3837 83.0965C24.3959 82.7045 24.3523 82.3281 24.332 81.9381V81.9376Z" fill="#2F5222"/> <path id="Vector_46" d="M20.5655 84.2245C20.3292 84.6648 19.9959 85.0508 19.721 85.4677C19.4451 85.8856 19.1606 86.2919 18.9029 86.72C18.8492 86.8092 18.9739 86.9061 19.0475 86.8316C19.401 86.4735 19.6825 86.0814 19.9498 85.6538C20.2277 85.2085 20.3865 84.7221 20.6152 84.2529C20.631 84.2205 20.5838 84.1921 20.5665 84.2245H20.5655Z" fill="#2F5222"/> <path id="Vector_47" d="M16.8579 79.2194C16.4257 79.7418 16.0819 80.3408 15.7091 80.9064C15.5234 81.1884 15.3312 81.4668 15.1339 81.7402C14.9239 82.0308 14.6794 82.3326 14.5324 82.6603C14.4806 82.7754 14.6044 82.8693 14.7028 82.7917C14.9731 82.5791 15.1887 82.2728 15.3885 81.9948C15.5944 81.7083 15.7902 81.4141 15.9809 81.1179C16.3532 80.5392 16.7285 79.9219 16.9294 79.2605C16.9411 79.222 16.8863 79.1859 16.8584 79.2194H16.8579Z" fill="#2F5222"/> <path id="Vector_48" d="M11.3608 84.6368C10.7583 85.0477 10.1243 85.4129 9.4933 85.7786C9.17681 85.9622 8.86285 86.1488 8.54027 86.3223C8.24102 86.4831 7.92452 86.6347 7.66027 86.8513C7.58571 86.9121 7.66788 87.0182 7.74751 87.0009C8.08277 86.9289 8.40079 86.7559 8.69953 86.5941C9.03378 86.4131 9.36954 86.2284 9.68908 86.022C10.2998 85.6279 10.8638 85.179 11.4212 84.7144C11.4643 84.6789 11.4075 84.6049 11.3613 84.6368H11.3608Z" fill="#2F5222"/> <path id="Vector_49" d="M11.9913 80.0142C11.6748 80.4732 11.3273 80.9125 10.9784 81.3472C10.6533 81.7524 10.249 82.1044 9.96703 82.5396C9.90413 82.637 10.0284 82.7577 10.1253 82.6978C10.5802 82.4153 10.9206 81.9421 11.2437 81.5221C11.588 81.0743 11.8584 80.5874 12.1013 80.0786C12.1368 80.0046 12.0379 79.9463 11.9913 80.0142Z" fill="#2F5222"/> <path id="Vector_50" d="M18.5276 82.8835C18.17 83.3405 17.8464 83.8081 17.6405 84.3559C17.5943 84.4792 17.7683 84.5238 17.8342 84.4376C18.1857 83.9816 18.4094 83.4643 18.6062 82.9292C18.6219 82.8865 18.5565 82.8465 18.5276 82.8835Z" fill="#2F5222"/> <path id="Vector_51" d="M33.9612 85.9653C33.7122 85.5058 33.2872 85.1396 32.9808 84.7105C32.6709 84.2753 32.3889 83.8163 32.1409 83.343C32.0881 83.2421 31.9192 83.3116 31.9558 83.4211C32.1338 83.9578 32.3747 84.4599 32.6953 84.9265C32.993 85.3602 33.3435 85.8725 33.8258 86.1007C33.9136 86.1423 34.011 86.0566 33.9612 85.9653Z" fill="#2F5222"/> <path id="Vector_52" d="M37.4645 83.5296C37.3144 83.2917 37.0739 83.1239 36.866 82.9392C36.6519 82.7495 36.4531 82.5451 36.2584 82.3362C35.8521 81.899 35.4915 81.4151 35.1887 80.9008C35.1166 80.778 34.9452 80.8856 35.0015 81.0103C35.2561 81.5744 35.5731 82.0927 35.9662 82.571C36.1559 82.8018 36.3679 83.0158 36.5885 83.2172C36.8041 83.414 37.042 83.6306 37.3316 83.7031C37.428 83.7269 37.5213 83.6194 37.4645 83.5296Z" fill="#2F5222"/> <path id="Vector_53" d="M40.8567 89.3655C40.6781 89.224 40.4656 89.1428 40.2648 89.0394C40.0472 88.9268 39.8377 88.799 39.6318 88.6666C39.2098 88.3962 38.7913 88.0833 38.4434 87.7217C38.3977 87.6745 38.3354 87.743 38.3734 87.7917C38.6945 88.206 39.0297 88.5783 39.4517 88.8938C39.8179 89.1677 40.315 89.5065 40.7836 89.5425C40.8688 89.5491 40.9272 89.4208 40.8572 89.3655H40.8567Z" fill="#2F5222"/> <path id="Vector_54" d="M43.8725 85.7268C43.66 85.5254 43.3404 85.4159 43.0909 85.2627C42.8094 85.0903 42.5385 84.8975 42.2809 84.6916C41.7711 84.2838 41.3106 83.8045 40.9292 83.275C40.8648 83.1857 40.7202 83.2643 40.7785 83.3632C41.1311 83.9572 41.5601 84.4928 42.078 84.9503C42.3286 85.1714 42.5964 85.3682 42.8794 85.5452C43.1436 85.7106 43.4596 85.9297 43.7756 85.9601C43.8953 85.9718 43.9536 85.8039 43.8725 85.7268Z" fill="#2F5222"/> <path id="Vector_55" d="M49.7611 85.2009C49.5821 85.0462 49.334 84.9671 49.1225 84.8606C48.8755 84.7368 48.6341 84.6024 48.3912 84.47C47.9205 84.2144 47.4442 83.9623 46.9969 83.6671C46.9375 83.6281 46.8624 83.7219 46.9198 83.767C47.3362 84.0972 47.7485 84.4244 48.1989 84.7079C48.4196 84.8469 48.6503 84.9701 48.8811 85.0914C49.1104 85.2116 49.3711 85.3901 49.6287 85.4286C49.7484 85.4464 49.8773 85.2998 49.7616 85.1999L49.7611 85.2009Z" fill="#2F5222"/> <path id="Vector_56" d="M55.5899 84.2529C55.0385 83.871 54.3736 83.663 53.7355 83.4733C53.6463 83.4469 53.59 83.5783 53.6721 83.624C54.2529 83.9481 54.8661 84.2793 55.5244 84.4081C55.6198 84.4269 55.67 84.3087 55.5899 84.2529Z" fill="#2F5222"/> <path id="Vector_57" d="M43.0838 71.8615C42.8155 71.5044 42.462 71.2305 42.1373 70.9272C41.796 70.6082 41.4536 70.2912 41.1087 69.9757C41.0611 69.9321 40.9789 69.9884 41.0159 70.0472C41.2634 70.4403 41.5414 70.8009 41.87 71.1301C42.1957 71.4567 42.536 71.7945 42.9641 71.9802C43.0331 72.0101 43.1426 71.9396 43.0833 71.861L43.0838 71.8615Z" fill="#305923"/> <path id="Vector_58" d="M27.674 55.6883C27.6648 55.6188 27.5603 55.6128 27.5609 55.6883C27.568 56.4314 27.5106 57.1866 27.8373 57.881C27.8799 57.9718 28.0158 57.9215 28.0173 57.8323C28.0326 57.1014 27.7698 56.4045 27.674 55.6883Z" fill="#38662E"/> <path id="Vector_59" d="M39.7454 56.6921C39.615 56.5206 39.434 56.3933 39.2686 56.2564C39.0764 56.0966 38.8892 55.9302 38.7076 55.7583C38.3607 55.4291 37.9676 55.1152 37.6516 54.7576C37.6131 54.714 37.5345 54.7728 37.57 54.8205C37.7069 55.0041 37.8155 55.2044 37.9575 55.385C38.1228 55.5955 38.2983 55.7887 38.4901 55.9754C38.8111 56.2878 39.1839 56.7032 39.6069 56.8721C39.7023 56.9102 39.8088 56.7752 39.7454 56.6921Z" fill="#38662E"/> <path id="Vector_60" d="M23.3815 36.9046C23.1583 37.1278 22.9839 37.393 22.7739 37.6284C22.5614 37.8673 22.3128 38.0681 22.1115 38.3156C22.042 38.4009 22.1272 38.5261 22.2317 38.4714C22.5396 38.3101 22.7693 38.0494 22.9864 37.7821C23.1893 37.532 23.382 37.2703 23.4723 36.9574C23.4875 36.9051 23.4196 36.8666 23.3815 36.9046Z" fill="#4B783B"/> <path id="Vector_61" d="M30.2602 38.2273C30.2374 38.1467 30.1248 38.1817 30.1374 38.2613C30.2292 38.8274 30.2719 39.4137 30.4737 39.9574C30.5113 40.0588 30.6878 40.0553 30.6776 39.93C30.6289 39.3437 30.4194 38.7873 30.2602 38.2278V38.2273Z" fill="#4B783B"/> <path id="Vector_62" d="M29.0622 14.3548C29.0591 14.332 29.0206 14.3325 29.0165 14.3548C28.9425 14.7971 28.8867 15.2419 28.8131 15.6847C28.7442 16.1001 28.5981 16.5419 28.5905 16.9629C28.5884 17.0597 28.7284 17.0998 28.7751 17.0131C28.978 16.6352 29.0251 16.1417 29.0723 15.7197C29.1241 15.2571 29.1281 14.8154 29.0622 14.3548Z" fill="#5D874E"/> <path id="Vector_63" d="M30.1983 18.1396C30.1121 17.7704 29.9995 17.4062 29.9158 17.038C29.9128 17.0243 29.8935 17.0283 29.8925 17.041C29.8722 17.43 29.862 17.7775 29.9401 18.1629C30.0112 18.5149 30.0756 18.9334 30.285 19.2331C30.3327 19.3016 30.4626 19.2854 30.4565 19.187C30.4337 18.8324 30.2785 18.4845 30.1983 18.1396Z" fill="#5D874E"/> <path id="Vector_64" d="M28.384 18.8756C28.2293 19.4523 28.0539 20.0249 27.8738 20.594C27.6937 21.1625 27.4472 21.7113 27.2956 22.2885C27.2778 22.356 27.3712 22.3955 27.4077 22.3357C27.7221 21.8199 27.8971 21.2229 28.063 20.6462C28.2299 20.0665 28.3328 19.4766 28.3982 18.8776C28.3993 18.8695 28.3866 18.868 28.3846 18.8756H28.384Z" fill="#5D874E"/> <path id="Vector_65" d="M26.6793 20.0102C26.2492 20.9176 25.6822 21.7514 25.2389 22.6507C25.2054 22.7182 25.2942 22.8008 25.35 22.7364C26.0281 21.9574 26.408 21.0023 26.7397 20.0356C26.7519 20.0006 26.6956 19.9762 26.6793 20.0102Z" fill="#5D874E"/> <path id="Vector_66" d="M28.2806 24.0724C28.1492 24.4999 27.996 24.9184 27.8829 25.352C27.7769 25.7588 27.6456 26.1696 27.6405 26.5937C27.6395 26.6697 27.7541 26.7073 27.7901 26.6342C27.9758 26.2538 28.0437 25.8313 28.132 25.4205C28.2268 24.9802 28.2786 24.5359 28.3536 24.0926C28.3617 24.0455 28.2953 24.0252 28.2811 24.0724H28.2806Z" fill="#5D874E"/> <path id="Vector_67" d="M29.8767 21.8878C29.8473 21.5652 29.8144 21.2442 29.7393 20.9297C29.7256 20.8724 29.6465 20.8896 29.6419 20.9429C29.614 21.2913 29.6368 21.6388 29.6586 21.9872C29.6789 22.3067 29.6764 22.6456 29.7611 22.9555C29.789 23.0564 29.9219 23.0254 29.9325 22.9321C29.9711 22.5903 29.9077 22.2286 29.8767 21.8873V21.8878Z" fill="#5D874E"/> <path id="Vector_68" d="M31.9791 22.7617C31.8569 22.3712 31.6809 22.009 31.5363 21.6286C31.5226 21.5921 31.4688 21.6058 31.477 21.6448C31.5627 22.0415 31.6119 22.4396 31.7219 22.8322C31.8208 23.1862 31.8858 23.5996 32.0734 23.9191C32.1262 24.0089 32.2809 23.9744 32.2758 23.8644C32.2591 23.4936 32.0897 23.1132 31.9796 22.7612L31.9791 22.7617Z" fill="#5D874E"/> </g> <path id="Vector_69" d="M35.5036 19.4685C33.8659 16.8934 32.4011 14.1839 31.0854 11.4313C30.9307 11.1077 30.7978 10.7644 30.6218 10.4519C30.4692 10.1816 30.2171 9.98631 29.8955 10.001C29.2899 10.0284 28.9481 10.6928 28.7213 11.1645C28.1 12.4564 27.3864 13.7036 26.5891 14.8945C26.1478 15.5534 23.3425 19.5613 23.1614 19.8783C22.7952 20.5189 22.9235 21.5044 23.7655 21.6545C24.153 21.7235 24.5501 21.6094 24.9249 21.5206C25.2328 21.4481 25.6071 21.3416 25.879 21.5206C25.2891 22.289 24.5415 22.7602 24.1154 23.8304C24.0754 23.9308 24.0967 24.0759 24.1915 24.121C25.1922 24.5968 26.3385 24.6308 27.356 24.223C27.2986 25.0634 27.4508 26.0327 28.4429 26.1757C29.5684 26.3375 30.2232 25.3545 30.6416 24.4588C31.1387 24.7915 31.7747 25.073 32.326 24.7307C32.8413 24.4106 32.8936 23.7726 32.8134 23.2273C32.7014 22.4645 32.4082 21.7118 32.1952 20.9728C32.009 20.3282 31.8239 19.683 31.6352 19.0389C32.7896 19.6303 34.0323 20.1182 35.3459 19.857C35.5102 19.824 35.5904 19.6059 35.5036 19.4695V19.4685Z" fill="#C9E2FF"/> <path id="Vector_70" d="M42.4685 36.552C41.2041 35.387 39.9249 34.2376 38.6488 33.0853C38.0381 32.5334 37.4483 31.9223 36.7757 31.4455C36.2279 31.057 35.5483 30.8348 34.9092 31.1391C33.9653 31.5885 33.9171 32.8601 33.7021 33.7421C33.5905 34.2011 33.4398 34.6764 33.0498 34.9756C32.6958 35.2475 32.2347 35.3504 31.7955 35.3302C31.3669 35.3104 30.9211 35.1613 30.6015 34.8676C30.4408 34.72 30.3155 34.5435 30.2348 34.3401C30.1172 34.0429 30.0487 33.7208 29.8113 33.4895C29.3269 33.0173 28.6402 33.2486 28.1807 33.6265C27.7059 34.0165 27.5142 34.6642 27.0166 35.0253C26.5683 35.3509 26.1407 35.073 25.9292 34.6358C25.6852 34.1321 25.7111 33.591 25.7593 33.0508C25.8115 32.4655 25.8622 31.8305 25.6396 31.2715C25.4063 30.6857 24.8752 30.3002 24.2407 30.2774C23.5408 30.2526 22.8571 30.6314 22.2956 31.0108C21.5916 31.4861 20.9003 31.9816 20.2034 32.4675C19.5197 32.9438 18.1462 34.2868 18.1117 34.3122C17.4077 34.8219 16.7022 35.3291 15.9997 35.8414C15.5584 36.1635 14.9731 36.6996 15.3084 37.2991C15.5452 37.7226 16.128 37.959 16.5804 38.0559C17.0587 38.1588 17.5487 38.138 18.03 38.0685C19.0916 37.9154 20.0994 37.5167 21.1564 37.3417C21.6271 37.2636 22.1262 37.2332 22.5928 37.3519C23.1543 37.4949 23.5012 37.8728 23.9369 38.2253C24.4223 38.6183 24.9797 38.7213 25.5113 38.3465C25.9895 38.0092 26.342 37.575 26.9553 37.4903C27.4696 37.4188 27.992 37.5573 28.4764 37.7181C29.0221 37.8996 29.5496 38.1314 30.0908 38.3262C30.6157 38.5149 31.1605 38.6721 31.7209 38.6985C32.4143 38.7309 33.0067 38.4707 33.6285 38.1989C35.0325 37.5852 36.5251 37.8104 37.9661 38.1624C38.6975 38.3409 39.4218 38.5478 40.1582 38.7056C40.7897 38.841 41.482 39.0023 42.1287 38.8998C42.605 38.8243 43.1837 38.5869 43.345 38.0863C43.5595 37.4183 42.891 36.9436 42.468 36.5535L42.4685 36.552Z" fill="#C9E2FF"/> <path id="Vector_71" d="M36.1001 52.8925C36.0088 52.2661 35.634 51.7376 35.2582 51.2472C34.8671 50.7364 34.4517 50.2449 34.0099 49.7773C33.1036 48.8177 32.0932 47.9564 30.9997 47.2169C30.5006 46.8796 29.9351 46.4313 29.334 46.3065C28.7497 46.1853 28.2157 46.4759 27.8571 46.9253C27.463 47.4198 27.3326 48.0224 27.1247 48.6056C26.9563 49.0779 26.6976 49.4963 26.2066 49.6698C25.4134 49.9497 24.4375 49.6084 24.1545 48.7837C23.9663 48.2359 23.8831 47.6567 23.4059 47.2687C23.0021 46.94 22.4741 46.8507 21.9674 46.9106C21.446 46.9725 20.9393 47.1642 20.4945 47.4416C20.002 47.749 19.579 48.1578 19.1083 48.4956C18.7913 48.7228 18.4566 48.9262 18.0899 49.0337C18.6615 47.7439 18.9638 46.3501 18.9699 44.934C18.9709 44.7093 18.7005 44.5313 18.5017 44.6652C18.3714 44.7529 18.2441 44.8442 18.1178 44.9371C18.1446 44.8909 17.8378 45.1136 17.7358 45.2297C16.9969 45.8216 16.3339 46.5023 15.7623 47.2555C14.718 48.2131 13.5874 49.0692 12.3362 49.7788C11.7722 50.0989 11.1909 50.3895 10.596 50.6471C10.0705 50.8749 9.54808 51.0747 9.12 51.4693C8.76952 51.7919 8.51592 52.2616 8.71018 52.7363C8.93081 53.2744 9.61807 53.5554 10.1025 53.7989C11.3055 54.4035 12.6101 54.7824 13.9476 54.9305C14.6079 55.0035 15.2744 55.0167 15.9368 54.968C16.6246 54.9173 17.3052 54.8006 17.9905 54.7306C18.6945 54.6586 19.4203 54.6277 20.1121 54.8047C20.7258 54.9619 21.27 55.3631 21.9289 55.2084C23.1629 54.9188 23.6742 53.4099 24.9417 53.174C25.213 53.1233 25.5102 53.1426 25.7522 53.2851C26.02 53.4428 26.1635 53.7289 26.2787 54.0063C26.4815 54.4963 26.6423 54.9792 27.0405 55.3514C27.7409 56.0067 28.837 56.2314 29.7317 55.8739C30.6817 55.4945 31.1143 54.5156 31.8553 53.8785C32.1845 53.5955 32.5862 53.4712 32.9986 53.6518C33.4485 53.8491 33.7837 54.2381 34.2245 54.4527C34.685 54.6774 35.2034 54.6743 35.6061 54.3299C36.0124 53.983 36.1757 53.4094 36.1006 52.8925H36.1001Z" fill="#C9E2FF"/> <path id="Vector_72" d="M51.4729 53.4601C49.8463 50.4002 47.1921 47.9225 44.0495 46.4653C43.3283 46.131 42.3316 45.6532 41.6839 46.3856C41.1813 46.9537 41.2893 47.7404 41.2513 48.4363C41.2345 48.7431 41.1742 49.1058 40.9713 49.3497C40.6923 49.6855 40.2556 49.4289 39.9427 49.2833C39.4487 49.0535 38.9587 48.8131 38.4601 48.5945C38.0985 48.4358 37.6461 48.3921 37.3955 48.7639C36.8979 49.5029 37.7683 50.5128 38.2339 51.0255C38.8547 51.7092 39.6034 52.2398 40.4849 52.5066C41.2721 52.9585 42.116 53.31 42.9484 53.5595C43.9592 53.8633 45.0954 54.0906 46.1559 54.0221C46.407 54.0059 46.6464 53.9556 46.8711 53.8385C47.1095 53.7142 47.3027 53.522 47.5299 53.3805C47.8992 53.1502 48.2912 53.1908 48.6894 53.3186C49.5714 53.6021 50.4347 54.2285 51.3806 53.8146C51.5125 53.7568 51.5328 53.5722 51.4734 53.4601H51.4729Z" fill="#C9E2FF"/> <path id="Vector_73" d="M45.6518 68.1076C45.2049 67.4979 44.5369 67.0648 43.9536 66.5966C43.2735 66.0504 42.5943 65.5031 41.9111 64.9604C41.2939 64.4704 40.6908 63.9374 40.0228 63.5164C39.4715 63.169 38.8223 62.9088 38.1599 62.9783C37.5781 63.0396 37.0075 63.3069 36.6793 63.807C36.2568 64.4502 36.5409 65.1471 36.5906 65.8419C36.6083 66.0935 36.5815 66.4039 36.408 66.6022C36.1813 66.8619 35.7993 66.6854 35.5371 66.5779C33.9638 65.9312 32.5254 64.965 31.3076 63.7806C31.1179 63.5965 30.7725 63.7269 30.777 64.0003C30.7892 64.7656 30.3292 65.5046 29.6257 65.8191C28.9465 66.1229 28.1061 65.9347 27.5705 65.4331C27.0521 64.9472 26.9187 64.2006 26.5596 63.6082C26.1985 63.0127 25.5757 62.6567 24.9082 63.0351C24.6698 63.17 24.4664 63.3713 24.2605 63.5499C24.0399 63.7411 23.8197 63.9323 23.5991 64.123C23.3232 64.3624 23.0473 64.6013 22.7713 64.8407C22.8348 64.0616 22.9773 63.2932 23.1989 62.5395C23.2644 62.3174 23.0417 62.0815 22.8145 62.1551C22.2215 62.3468 21.6829 62.6902 21.271 63.1598C21.0672 63.3921 20.8846 63.6503 20.7496 63.9293C20.7197 63.9911 20.6959 64.0535 20.6761 64.1164C19.894 65.073 19.1611 66.0722 18.413 67.0541C17.9844 67.6166 17.3341 68.2506 17.2733 68.9942C17.2266 69.5638 17.6111 70.004 18.1223 70.1927C19.2848 70.6213 20.4479 69.8184 21.3877 69.2295C21.8706 68.9267 22.3696 68.6082 22.9296 68.4723C23.1852 68.4104 23.4556 68.3947 23.7137 68.4515C24.0784 68.5311 24.3903 68.7411 24.7307 68.8846C25.9059 69.3791 27.0841 68.7193 28.2025 68.385C28.7335 68.2263 29.3209 68.1203 29.8448 68.3627C30.3591 68.6001 30.7172 69.0814 31.1067 69.474C31.4988 69.8686 31.9522 70.2125 32.5233 70.2668C33.1518 70.3266 33.7249 70.0086 34.2656 69.7337C34.8108 69.4562 35.3449 69.2559 35.9611 69.3928C36.5018 69.5125 36.9933 69.7814 37.4787 70.038C38.4125 70.532 39.5121 71.1047 40.5392 70.5107C40.8567 70.3271 41.1092 70.0558 41.412 69.8519C41.693 69.6632 42.0034 69.5384 42.3336 69.4669C43.0234 69.3178 43.7523 69.4076 44.4355 69.5486C44.7789 69.6196 45.1192 69.7068 45.4575 69.7976C45.5518 69.8229 45.6629 69.7976 45.7309 69.7251C46.1863 69.2392 46.0093 68.595 45.6512 68.1066L45.6518 68.1076Z" fill="#C9E2FF"/> <path id="Vector_74" d="M18.2679 62.7729C17.9935 62.6537 17.6958 62.6882 17.4087 62.7399C17.0237 62.8094 16.6413 62.8957 16.2579 62.9738C15.564 63.1153 14.8636 63.304 14.1616 63.3958C13.7792 63.446 13.0924 63.4896 12.9494 63.0174C12.7901 62.4914 13.1132 61.827 12.537 61.4613C11.8944 61.0535 11.1098 61.7154 10.5823 62.0349C9.87117 62.4661 8.32369 63.7904 8.25116 63.8411C7.13227 64.6196 6.05802 65.4631 5.03702 66.3659C4.6693 66.6911 4.17529 67.1977 4.63582 67.6771C5.01014 68.0666 5.64921 68.0539 6.14577 68.0853C7.4437 68.167 8.74873 68.1112 10.0365 67.9317C12.6177 67.571 15.1243 66.6611 17.3377 65.2856C17.8292 64.9803 18.4388 64.6577 18.6884 64.1058C18.906 63.6255 18.7807 62.9966 18.2659 62.7729H18.2679Z" fill="#C9E2FF"/> <path id="Vector_75" d="M56.412 67.848C56.0839 67.4153 55.5625 67.1339 55.1238 66.828C54.1058 66.1179 53.0838 65.4129 52.0597 64.7114C51.1184 64.0668 50.1603 63.4419 49.0977 63.0138C48.1208 62.6197 46.9867 62.3945 45.9865 62.8353C44.9757 63.2806 44.3995 64.3245 44.7089 65.4099C45.0365 66.5607 49.1799 68.4962 50.07 68.7665C51.1574 69.0962 52.2839 69.2996 53.4175 69.3772C53.9881 69.4163 54.5613 69.4203 55.1324 69.3909C55.5559 69.3691 56.0641 69.3523 56.3897 69.0379C56.7367 68.7026 56.6864 68.2101 56.4126 67.849L56.412 67.848Z" fill="#C9E2FF"/> <path id="Vector_76" d="M30.2713 84.1702C29.9838 83.0599 29.5176 81.9948 28.8902 81.0347C28.5844 80.5665 28.241 80.1207 27.8662 79.7058C27.502 79.3026 27.0983 78.8659 26.6388 78.5697C26.1605 78.2613 25.6066 78.3658 25.3581 78.8968C25.2587 79.1088 25.211 79.3396 25.1131 79.5521C25.0061 79.7844 24.8661 80.0046 24.6987 80.1983C24.0541 80.9444 23.0275 81.3867 22.0415 81.1894C21.0768 80.9961 20.2024 80.2835 19.8742 79.3462C19.6967 78.8385 19.7038 78.2846 19.4786 77.7911C19.2823 77.361 18.9131 77.0359 18.4556 76.9101C17.5264 76.655 16.4851 77.1211 15.7065 77.5959C15.1232 77.9514 14.5501 78.3252 13.9724 78.6904C13.4576 79.016 12.9509 79.3685 12.4077 79.6465C11.937 79.8869 11.3659 80.1212 10.8252 80.0406C10.3165 79.9645 10.002 79.5668 9.91428 79.0809C9.81943 78.556 9.91529 78.0026 9.93456 77.4746C9.95434 76.9233 9.90819 76.372 9.64292 75.8785C9.56025 75.7243 9.35179 75.6817 9.2047 75.7638C8.98508 75.8871 8.76952 76.018 8.55852 76.1559C8.53722 76.1295 8.50222 76.1169 8.46773 76.1417C7.65925 76.724 6.89896 77.3646 6.1346 78.0042C5.3525 78.6584 4.543 79.2909 3.7893 79.9782C3.3247 80.4017 2.74852 81.1508 3.04777 81.8153C3.39774 82.5938 4.49837 82.4229 5.18106 82.3945C6.24162 82.3504 7.29762 82.2332 8.34398 82.0552C8.62497 82.6659 8.25116 83.4728 8.26283 84.1078C8.26942 84.4542 8.37137 84.7931 8.63815 85.0274C9.03073 85.3723 9.57496 85.3439 10.0583 85.2714C11.094 85.1161 12.0334 84.6115 12.9433 84.1195C13.3977 83.8735 13.8522 83.626 14.3249 83.4155C14.5557 83.3125 14.792 83.2212 15.0335 83.1452C15.2784 83.0676 15.5696 82.9692 15.773 83.1817C15.9246 83.3399 16.0063 83.5611 16.1361 83.7371C16.2609 83.9065 16.4166 84.0475 16.6078 84.1367C16.9877 84.3132 17.4158 84.2554 17.8074 84.1525C18.2385 84.0388 18.6544 83.8608 19.0962 83.7868C19.5785 83.7061 19.9868 83.8618 20.387 84.1241C20.8034 84.3974 21.1787 84.7347 21.6322 84.9483C22.0674 85.1532 22.534 85.2678 23.0143 85.2921C23.9491 85.3403 24.894 85.032 25.6046 84.4203C25.9708 84.1053 26.3121 83.5829 26.8477 83.5869C27.2398 83.59 27.6065 83.8248 27.9291 84.0241C28.5712 84.4203 29.3939 85.0254 30.1374 84.4979C30.245 84.4218 30.3048 84.3031 30.2708 84.1707L30.2713 84.1702Z" fill="#C9E2FF"/> <path id="Vector_77" d="M57.8581 81.1929C56.8214 79.897 55.5341 78.7888 54.1342 77.9012C53.4373 77.4594 52.7054 77.0739 51.9466 76.7493C51.231 76.4435 50.3834 76.1275 49.612 76.4293C48.1624 76.9963 48.5585 78.7391 48.5438 79.9518C48.5413 80.1527 48.5271 80.3494 48.4921 80.5437C46.0895 79.7388 43.7325 78.8025 41.4344 77.7338C41.3025 77.6724 41.1468 77.6745 41.0387 77.785C40.635 78.1989 40.7745 78.7386 40.9018 79.2387C40.953 79.44 41.0428 79.7083 40.9505 79.9117C40.8582 80.1146 40.6223 80.1334 40.4265 80.1197C40.1542 80.1009 39.8884 80.004 39.6399 79.897C39.2529 79.7307 38.8669 79.5618 38.4804 79.3939C37.7074 79.0581 36.934 78.7228 36.161 78.3871C35.9196 78.2821 35.5924 78.4571 35.6832 78.7543C35.9185 79.5247 35.2409 80.215 34.4852 80.2064C33.6042 80.1963 33.1 79.4426 32.4584 78.9587C32.1734 78.7436 31.834 78.5626 31.4663 78.5869C31.3035 78.5976 31.1184 78.6447 30.9824 78.7386C30.8171 78.8532 30.7527 79.1027 30.7009 79.2894C30.5057 79.9893 30.6117 80.739 30.918 81.3897C31.0372 81.6423 31.1945 81.8832 31.3796 82.0957C32.1936 83.9186 34.3041 85.1699 36.3192 84.8448C37.1784 84.7063 37.9813 84.1438 38.8715 84.401C39.2965 84.5237 39.6769 84.7616 40.0624 84.9716C40.46 85.1887 40.8698 85.3839 41.2939 85.5437C42.7678 86.0996 44.6039 86.1143 45.7811 84.9183C46.059 84.6358 46.2122 84.296 46.4318 83.9744C46.6636 83.6346 47.044 83.5722 47.43 83.5829C47.855 83.595 48.278 83.6747 48.7 83.7234C49.1986 83.7807 49.6982 83.8283 50.1988 83.8649C52.1845 84.0114 54.1819 83.9952 56.1645 83.8167C56.8487 83.7548 57.7181 83.7431 58.2354 83.2131C58.8826 82.5502 58.3156 81.7635 57.8576 81.1914L57.8581 81.1929Z" fill="#C9E2FF"/> <g id="Group_2"> <path id="Vector_78" d="M32.7891 23.0757C32.7145 23.3105 32.5771 23.5185 32.3458 23.662C31.9755 23.8918 31.5673 23.8405 31.1884 23.6813C30.884 23.5535 30.5366 23.6671 30.3667 23.9501C29.9493 24.6455 29.3533 25.2348 28.4627 25.107C27.6643 24.9924 27.4097 24.3417 27.3707 23.6544C27.3575 23.418 27.1064 23.1898 26.903 23.31C25.0385 24.4111 24.1159 23.8299 24.1159 23.8299C24.0505 23.9161 24.0972 24.0754 24.192 24.1205C25.1927 24.5963 26.339 24.6303 27.3565 24.2225C27.2991 25.0629 27.4513 26.0322 28.4434 26.1752C29.5689 26.337 30.2237 25.354 30.6421 24.4583C31.1392 24.791 31.7752 25.0725 32.3265 24.7302C32.8419 24.4101 32.8941 23.7721 32.814 23.2268C32.8063 23.1761 32.7982 23.1259 32.7891 23.0757Z" fill="#94C3F0"/> <path id="Vector_79" d="M25.879 21.5202C26.0114 21.3472 26.1995 21.1626 26.3872 20.9785C26.621 20.7492 26.7965 20.6179 26.2386 20.4632C25.7857 20.3374 25.1232 20.4099 24.9437 20.452C24.5689 20.5408 24.1717 20.6549 23.7842 20.5859C23.4287 20.5225 23.2009 20.31 23.0833 20.0371C22.82 20.6701 22.9905 21.5156 23.765 21.6536C24.1525 21.7225 24.5547 21.6272 24.9244 21.5197C25.4164 21.3766 25.8141 21.5344 25.8785 21.5197L25.879 21.5202Z" fill="#94C3F0"/> <path id="Vector_80" d="M35.104 18.8304C34.1195 18.9547 32.7287 18.4997 31.6626 18.0296C31.4263 17.9251 31.3872 18.1645 31.476 18.4069C31.5713 18.6676 31.5784 18.8401 31.6357 19.0384C32.6806 19.5375 34.1773 20.0888 35.3464 19.856C35.5108 19.8235 35.5909 19.6049 35.5042 19.4685C35.3697 19.257 35.2364 19.044 35.104 18.8304Z" fill="#94C3F0"/> </g> <path id="Vector_81" d="M42.1485 37.8307C41.5013 37.9331 40.8095 37.7718 40.178 37.6364C39.4416 37.4787 38.7173 37.2722 37.9859 37.0932C36.5454 36.7412 35.0522 36.516 33.6483 37.1297C33.026 37.4016 32.4335 37.6618 31.7407 37.6293C31.1803 37.6034 30.6355 37.4462 30.1106 37.257C29.5694 37.0622 29.0419 36.8305 28.4961 36.6489C28.0118 36.4881 27.4893 36.3496 26.975 36.4211C26.3618 36.5064 26.0098 36.94 25.531 37.2773C24.999 37.6521 24.4421 37.5492 23.9567 37.1561C23.521 36.8036 23.1741 36.4252 22.6126 36.2827C22.146 36.164 21.6474 36.1944 21.1762 36.2725C20.1192 36.4475 19.1114 36.8462 18.0498 36.9994C17.5685 37.0688 17.0785 37.0896 16.6002 36.9867C16.2021 36.901 15.703 36.7077 15.4276 36.3735C15.2232 36.6438 15.1207 36.9608 15.3094 37.2976C15.5463 37.7211 16.129 37.9575 16.5815 38.0543C17.0597 38.1573 17.5497 38.1365 18.031 38.067C19.0926 37.9138 20.1004 37.5152 21.1574 37.3402C21.6281 37.2621 22.1272 37.2317 22.5938 37.3503C23.1553 37.4934 23.5022 37.8712 23.9379 38.2237C24.4233 38.6168 24.9807 38.7198 25.5123 38.345C25.9906 38.0077 26.3431 37.5735 26.9563 37.4888C27.4706 37.4173 27.993 37.5558 28.4774 37.7165C29.0231 37.8981 29.5506 38.1299 30.0918 38.3247C30.6168 38.5134 31.1615 38.6706 31.7219 38.697C32.4153 38.7294 33.0077 38.4692 33.6295 38.1974C35.0335 37.5837 36.5262 37.8088 37.9671 38.1608C38.6985 38.3394 39.4228 38.5463 40.1593 38.7041C40.7907 38.8395 41.4831 39.0008 42.1297 38.8983C42.606 38.8227 43.1847 38.5854 43.346 38.0848C43.4414 37.7891 43.3627 37.5309 43.2096 37.3016C42.9615 37.611 42.5238 37.7713 42.1495 37.8307H42.1485Z" fill="#94C3F0"/> <path id="Vector_82" d="M36.0438 52.6308C35.9606 52.8728 35.8212 53.0939 35.6244 53.2623C35.2211 53.6062 34.7033 53.6097 34.2427 53.385C33.802 53.1705 33.4667 52.7815 33.0168 52.5842C32.6045 52.4031 32.2028 52.5273 31.8736 52.8109C31.1326 53.4479 30.6999 54.4268 29.7499 54.8062C28.8552 55.1638 27.7587 54.9391 27.0587 54.2838C26.6611 53.9115 26.5003 53.4286 26.2969 52.9387C26.1818 52.6613 26.0382 52.3752 25.7704 52.2174C25.5285 52.0749 25.2313 52.0557 24.9599 52.1064C23.6924 52.3427 23.1812 53.8511 21.9471 54.1408C21.2883 54.2955 20.7441 53.8943 20.1303 53.737C19.4385 53.5595 18.7127 53.5904 18.0087 53.663C17.323 53.733 16.6423 53.8496 15.9551 53.9003C15.2927 53.9495 14.6257 53.9364 13.9658 53.8628C12.6283 53.7147 11.3238 53.3358 10.1207 52.7312C9.68908 52.5142 9.09616 52.2666 8.81618 51.8335C8.65033 52.1043 8.57932 52.4193 8.70917 52.7368C8.9298 53.275 9.61706 53.556 10.1014 53.7994C11.3045 54.404 12.609 54.7829 13.9465 54.931C14.6069 55.004 15.2734 55.0172 15.9358 54.9685C16.6235 54.9178 17.3042 54.8011 17.9894 54.7311C18.6934 54.6591 19.4192 54.6282 20.1111 54.8052C20.7248 54.9624 21.269 55.3636 21.9279 55.2089C23.1619 54.9193 23.6732 53.4104 24.9407 53.1745C25.212 53.1238 25.5092 53.1431 25.7512 53.2856C26.019 53.4434 26.1625 53.7294 26.2776 54.0069C26.4805 54.4968 26.6413 54.9797 27.0395 55.352C27.7399 56.0073 28.836 56.232 29.7307 55.8744C30.6807 55.495 31.1133 54.5161 31.8543 53.879C32.1835 53.596 32.5852 53.4718 32.9976 53.6523C33.4475 53.8496 33.7827 54.2387 34.2235 54.4532C34.684 54.6779 35.2024 54.6748 35.6051 54.3305C36.0114 53.9835 36.1747 53.4099 36.0996 52.893C36.0864 52.8038 36.0672 52.7165 36.0438 52.6313V52.6308Z" fill="#94C3F0"/> <path id="Vector_83" d="M51.1235 52.8394C50.284 53.0407 49.5034 52.5061 48.7082 52.2505C48.31 52.1227 47.9179 52.0826 47.5487 52.3124C47.3215 52.4539 47.1287 52.6456 46.8898 52.7704C46.6651 52.8875 46.4263 52.9378 46.1747 52.954C45.1141 53.0219 43.978 52.7947 42.9671 52.4914C42.1348 52.2414 41.2908 51.8904 40.5037 51.4385C39.6221 51.1717 38.8735 50.6416 38.2527 49.9574C37.9915 49.6693 37.6019 49.2245 37.3991 48.7589C37.3981 48.7609 37.3965 48.762 37.395 48.764C36.8974 49.503 37.7678 50.5128 38.2334 51.0256C38.8542 51.7093 39.6029 52.2398 40.4844 52.5066C41.2716 52.9585 42.1155 53.31 42.9479 53.5596C43.9587 53.8634 45.0948 54.0906 46.1554 54.0222C46.4065 54.0059 46.6459 53.9557 46.8706 53.8385C47.1089 53.7143 47.3022 53.522 47.5294 53.3805C47.8987 53.1508 48.2907 53.1908 48.6889 53.3187C49.5709 53.6022 50.4342 54.2286 51.3801 53.8147C51.512 53.7569 51.5323 53.5723 51.4729 53.4602C51.3613 53.2502 51.2447 53.0432 51.1235 52.8394Z" fill="#94C3F0"/> <path id="Vector_84" d="M45.7507 68.658C45.6827 68.7305 45.5716 68.7559 45.4773 68.7305C45.1385 68.6392 44.7986 68.552 44.4548 68.4815C43.7716 68.3405 43.0427 68.2507 42.3529 68.3998C42.0227 68.4713 41.7123 68.5961 41.4313 68.7848C41.1285 68.9882 40.8754 69.26 40.5584 69.4436C39.5313 70.0381 38.4322 69.4649 37.498 68.9709C37.0126 68.7143 36.5211 68.4459 35.9804 68.3257C35.3642 68.1893 34.8301 68.3891 34.2848 68.6666C33.7442 68.9415 33.171 69.2595 32.5426 69.1997C31.9715 69.1454 31.5181 68.8015 31.126 68.4069C30.7365 68.0143 30.3784 67.533 29.8641 67.2956C29.3401 67.0537 28.7528 67.1592 28.2217 67.3179C27.1034 67.6522 25.9251 68.3121 24.7499 67.8175C24.4096 67.6745 24.0982 67.464 23.733 67.3844C23.4748 67.3281 23.2045 67.3433 22.9489 67.4052C22.3889 67.5411 21.8898 67.8596 21.407 68.1624C20.4671 68.7513 19.3046 69.5542 18.1416 69.1256C17.818 69.0064 17.5456 68.7858 17.4006 68.4957C17.3331 68.6564 17.2875 68.8228 17.2733 68.9947C17.2266 69.5643 17.6111 70.0046 18.1223 70.1933C19.2848 70.6219 20.4479 69.819 21.3877 69.2301C21.8706 68.9273 22.3696 68.6088 22.9296 68.4728C23.1852 68.411 23.4556 68.3952 23.7137 68.452C24.0784 68.5317 24.3903 68.7422 24.7307 68.8852C25.9059 69.3797 27.0841 68.7198 28.2025 68.3856C28.7335 68.2268 29.3209 68.1208 29.8448 68.3633C30.3591 68.6006 30.7172 69.082 31.1067 69.4746C31.4988 69.8692 31.9522 70.213 32.5233 70.2673C33.1518 70.3272 33.7249 70.0091 34.2656 69.7342C34.8108 69.4568 35.3449 69.2565 35.9611 69.3934C36.5018 69.5131 36.9933 69.7819 37.4787 70.0386C38.4125 70.5326 39.5121 71.1052 40.5392 70.5113C40.8567 70.3277 41.1092 70.0563 41.4121 69.8524C41.693 69.6637 42.0035 69.539 42.3336 69.4675C43.0234 69.3183 43.7523 69.4081 44.4355 69.5491C44.7789 69.6201 45.1192 69.7074 45.4575 69.7982C45.5518 69.8235 45.6629 69.7982 45.7309 69.7256C46.0737 69.3599 46.058 68.9045 45.8764 68.4931C45.8414 68.5494 45.7994 68.6047 45.7496 68.6575L45.7507 68.658Z" fill="#94C3F0"/> <path id="Vector_85" d="M17.3585 64.2174C15.1446 65.5929 12.638 66.5033 10.0573 66.8635C8.76952 67.043 7.46449 67.0988 6.16656 67.0171C5.69943 66.9877 5.10651 66.9969 4.72611 66.6738C4.46997 66.97 4.30412 67.3301 4.63735 67.6765C5.01166 68.066 5.65074 68.0534 6.14729 68.0848C7.44522 68.1665 8.75025 68.1107 10.038 67.9311C12.6192 67.5705 15.1258 66.6606 17.3392 65.285C17.8307 64.9797 18.4403 64.6571 18.6899 64.1053C18.8319 63.7913 18.8268 63.4145 18.663 63.1284C18.3901 63.625 17.8216 63.9288 17.358 64.2169L17.3585 64.2174Z" fill="#94C3F0"/> <path id="Vector_86" d="M56.4085 67.9687C56.0829 68.2836 55.5747 68.2999 55.1511 68.3217C54.58 68.3511 54.0069 68.347 53.4363 68.308C52.3027 68.2304 51.1762 68.027 50.0888 67.6973C49.1981 67.4275 45.0553 65.4915 44.7276 64.3406C44.7195 64.3117 44.7119 64.2828 44.7053 64.2539C44.6013 64.6145 44.5947 65.0086 44.7089 65.4088C45.0365 66.5596 49.1799 68.4951 50.07 68.7655C51.1574 69.0951 52.2839 69.2985 53.4175 69.3761C53.9881 69.4152 54.5613 69.4193 55.1324 69.3898C55.5559 69.368 56.0641 69.3513 56.3897 69.0368C56.7159 68.7213 56.691 68.2679 56.4592 67.9149C56.443 67.9331 56.4268 67.9514 56.4085 67.9692V67.9687Z" fill="#94C3F0"/> <g id="Group_3"> <path id="Vector_87" d="M30.069 83.486C29.3493 83.909 28.5656 83.3364 27.9489 82.9555C27.6263 82.7566 27.2596 82.5213 26.8675 82.5183C26.3319 82.5142 25.9906 83.0366 25.6244 83.3516C24.9138 83.9633 23.9689 84.2712 23.0341 84.2235C22.5538 84.1991 22.0866 84.084 21.652 83.8791C21.1985 83.6655 20.8232 83.3278 20.4068 83.0549C20.0071 82.7927 19.5988 82.6369 19.1159 82.7176C18.6747 82.7916 18.2588 82.9697 17.8271 83.0833C17.4351 83.1868 17.0075 83.2441 16.6276 83.0676C16.4359 82.9788 16.2802 82.8373 16.1559 82.6679C16.0261 82.4919 15.9444 82.2707 15.7927 82.1125C15.5889 81.9 15.2982 81.9984 15.0532 82.076C14.8123 82.1521 14.5755 82.2439 14.3447 82.3463C13.872 82.5568 13.418 82.8043 12.9631 83.0503C12.0531 83.5423 11.1138 84.0465 10.0781 84.2022C9.59474 84.2747 9.05051 84.3031 8.65794 83.9582C8.49665 83.8162 8.39571 83.6361 8.33941 83.4393C8.29681 83.6716 8.25927 83.8984 8.26333 84.1068C8.26993 84.4532 8.37187 84.792 8.63866 85.0264C9.03124 85.3713 9.57546 85.3429 10.0588 85.2703C11.0945 85.1151 12.0339 84.6105 12.9438 84.1185C13.3982 83.8725 13.8527 83.625 14.3254 83.4145C14.5562 83.3115 14.7925 83.2202 15.034 83.1441C15.279 83.0665 15.5701 82.9681 15.7735 83.1807C15.9251 83.3389 16.0068 83.5601 16.1366 83.7361C16.2614 83.9055 16.4171 84.0465 16.6083 84.1357C16.9882 84.3122 17.4163 84.2544 17.8079 84.1514C18.239 84.0378 18.6549 83.8598 19.0967 83.7858C19.579 83.7051 19.9873 83.8608 20.3875 84.123C20.8039 84.3964 21.1792 84.7337 21.6327 84.9473C22.0679 85.1522 22.5345 85.2668 23.0148 85.2911C23.9496 85.3388 24.8945 85.0309 25.6051 84.4193C25.9713 84.1043 26.3126 83.5819 26.8482 83.5859C27.2403 83.589 27.607 83.8243 27.9296 84.0231C28.5717 84.4192 29.3944 85.0243 30.138 84.4969C30.2455 84.4208 30.3053 84.3021 30.2713 84.1697C30.212 83.9394 30.144 83.7112 30.069 83.4855V83.486Z" fill="#94C3F0"/> <path id="Vector_88" d="M8.39317 82.1831C8.46824 81.7661 8.52758 81.3426 8.36325 80.9861C7.31689 81.1641 6.2609 81.2812 5.20034 81.3254C4.54655 81.3528 3.50983 81.51 3.11574 80.8395C2.96357 81.1534 2.90372 81.4938 3.04777 81.8143C3.39774 82.5929 4.49837 82.4219 5.18106 82.3935C6.24162 82.3494 7.29762 82.2323 8.34398 82.0542C8.36325 82.0963 8.37948 82.1394 8.39267 82.1831H8.39317Z" fill="#94C3F0"/> </g> <path id="Vector_89" d="M58.2547 82.147C57.7374 82.677 56.868 82.6887 56.1838 82.75C54.2006 82.9286 52.2033 82.9448 50.2181 82.7982C49.7175 82.7612 49.2179 82.714 48.7193 82.6567C48.2978 82.608 47.8743 82.5284 47.4493 82.5162C47.0633 82.5051 46.6829 82.568 46.4511 82.9078C46.2315 83.2299 46.0783 83.5697 45.8004 83.8517C44.6231 85.0477 42.7871 85.033 41.3131 84.4766C40.8891 84.3168 40.4793 84.121 40.0817 83.9044C39.6962 83.6939 39.3158 83.4566 38.8907 83.3338C38.0001 83.0767 37.1972 83.6392 36.3385 83.7776C34.3234 84.1028 32.2129 82.851 31.3989 81.0286C31.2137 80.8156 31.0565 80.5752 30.9373 80.3226C30.8064 80.0451 30.7126 79.7494 30.6629 79.4471C30.5229 80.1009 30.6345 80.7877 30.9185 81.3902C31.0377 81.6428 31.195 81.8837 31.3801 82.0963C32.1942 83.9191 34.3046 85.1704 36.3197 84.8453C37.1789 84.7068 37.9818 84.1443 38.872 84.4015C39.297 84.5242 39.6774 84.7621 40.0629 84.9721C40.4605 85.1892 40.8704 85.3845 41.2944 85.5442C42.7683 86.1001 44.6044 86.1148 45.7816 84.9188C46.0595 84.6363 46.2127 84.2965 46.4323 83.9749C46.6641 83.6351 47.0445 83.5727 47.4305 83.5834C47.8555 83.5956 48.2786 83.6752 48.7005 83.7239C49.1991 83.7812 49.6987 83.8289 50.1993 83.8654C52.185 84.012 54.1824 83.9957 56.165 83.8172C56.8493 83.7553 57.7186 83.7437 58.236 83.2136C58.6164 82.8236 58.5768 82.3915 58.3871 81.9847C58.3501 82.0389 58.307 82.0927 58.2552 82.146L58.2547 82.147Z" fill="#94C3F0"/> <g id="Group 6755759"> <path id="Vector_90" d="M30.1638 12.1982L25.6839 14.5119L26.6261 9.44487L23.1055 5.77707L28.0765 5.13254L30.1113 1.08911C30.2203 0.869974 30.5272 0.875534 30.6298 1.09758L32.5097 5.21361L37.4564 6.05016L33.8045 9.57911L34.5555 14.6748L30.1653 12.1875L30.1638 12.1982Z" fill="#FFE600"/> <path id="Vector_91" d="M31.0554 3.52741L32.0554 5.55306C32.146 5.70788 32.3009 5.81731 32.4764 5.85325L35.005 6.33399L31.9956 6.54879C31.68 6.56927 31.3968 6.34876 31.339 6.02941L31.0502 3.52667L31.0554 3.52741Z" fill="#FCCE08"/> <path id="Vector_92" d="M25.2833 6.65425L27.2138 8.77986C27.3712 8.94969 27.4287 9.19257 27.3716 9.41913L26.4617 13.1045L28.618 9.1821C28.8075 8.83799 28.675 8.40428 28.3333 8.22455L25.2781 6.6535L25.2833 6.65425Z" fill="#FCCE08"/> </g> <g id="Group_4"> <path id="Vector_93" d="M25.1013 36.9956C25.1321 38.1285 24.2332 39.0705 23.1003 39.0951C21.9674 39.1259 21.0254 38.227 21.0008 37.1003C20.97 35.9674 21.8689 35.0254 23.0018 35.0008C24.1347 34.97 25.0767 35.8689 25.1013 36.9956Z" fill="#E0150F"/> <path id="Vector_94" d="M24.4381 35.5364C24.5366 35.7642 24.592 36.0167 24.5982 36.2753C24.6289 37.4081 23.73 38.3501 22.6033 38.3748C22.0492 38.3871 21.5443 38.1839 21.1688 37.833C21.4889 38.5903 22.2401 39.1136 23.1082 39.089C24.2411 39.0582 25.1338 38.1223 25.1092 36.9895C25.0969 36.4107 24.8383 35.8935 24.4442 35.5303L24.4381 35.5364Z" fill="#C6150C"/> </g> <g id="Group_5"> <path id="Vector_95" d="M44.1013 52.9956C44.1321 54.1285 43.2332 55.0705 42.1003 55.0951C40.9674 55.1259 40.0254 54.227 40.0008 53.1003C39.97 51.9674 40.8689 51.0254 42.0018 51.0008C43.1347 50.97 44.0767 51.8689 44.1013 52.9956Z" fill="#E0150F"/> <path id="Vector_96" d="M43.4381 51.5364C43.5366 51.7642 43.592 52.0167 43.5982 52.2753C43.6289 53.4081 42.73 54.3501 41.6033 54.3748C41.0492 54.3871 40.5443 54.1839 40.1688 53.833C40.4889 54.5903 41.2401 55.1136 42.1082 55.089C43.2411 55.0582 44.1338 54.1223 44.1092 52.9895C44.0969 52.4107 43.8383 51.8935 43.4442 51.5303L43.4381 51.5364Z" fill="#C6150C"/> </g> <g id="Group_6"> <path id="Vector_97" d="M16.1013 66.9956C16.1321 68.1285 15.2332 69.0705 14.1003 69.0951C12.9674 69.1259 12.0254 68.227 12.0008 67.1003C11.97 65.9674 12.8689 65.0254 14.0018 65.0008C15.1347 64.97 16.0767 65.8689 16.1013 66.9956Z" fill="#E0150F"/> <path id="Vector_98" d="M15.4381 65.5364C15.5366 65.7642 15.592 66.0167 15.5982 66.2753C15.6289 67.4081 14.73 68.3501 13.6033 68.3748C13.0492 68.3871 12.5443 68.1839 12.1688 67.833C12.4889 68.5903 13.2401 69.1136 14.1082 69.089C15.2411 69.0582 16.1338 68.1223 16.1092 66.9895C16.0969 66.4107 15.8383 65.8935 15.4442 65.5303L15.4381 65.5364Z" fill="#C6150C"/> </g> <g id="Group_7"> <path id="Vector_99" d="M36.9374 31.3916C37.393 31.8965 37.393 32.6415 36.9374 33.0478C36.4694 33.448 35.7306 33.3495 35.2935 32.8262C34.8563 32.3029 34.8686 31.5702 35.3119 31.1885C35.7552 30.7944 36.4818 30.8868 36.9374 31.3978V31.3916Z" fill="#FFE600"/> <path id="Vector_100" d="M35.7353 30.9738C35.8892 31.0477 36.037 31.1585 36.1663 31.3001C36.6158 31.805 36.6219 32.5561 36.154 32.9502C36.0247 33.061 35.8769 33.1287 35.7168 33.1595C36.117 33.3627 36.6034 33.3381 36.9359 33.0487C37.3915 32.6423 37.3977 31.9035 36.9359 31.3925C36.6096 31.0231 36.1355 30.8814 35.7353 30.9738Z" fill="#FCCE08"/> </g> <g id="Group_8"> <path id="Vector_101" d="M19.9374 48.3916C20.393 48.8965 20.393 49.6415 19.9374 50.0478C19.4694 50.448 18.7306 50.3495 18.2935 49.8262C17.8563 49.3029 17.8686 48.5702 18.3119 48.1885C18.7552 47.7944 19.4818 47.8868 19.9374 48.3978V48.3916Z" fill="#FFE600"/> <path id="Vector_102" d="M18.7353 47.9738C18.8892 48.0477 19.037 48.1585 19.1663 48.3001C19.6158 48.805 19.6219 49.5561 19.154 49.9502C19.0247 50.061 18.8769 50.1287 18.7168 50.1595C19.117 50.3627 19.6034 50.3381 19.9359 50.0487C20.3915 49.6423 20.3977 48.9035 19.9359 48.3925C19.6096 48.0231 19.1355 47.8814 18.7353 47.9738Z" fill="#FCCE08"/> </g> <g id="Group_9"> <path id="Vector_103" d="M45.9374 65.3916C46.393 65.8965 46.393 66.6415 45.9374 67.0478C45.4694 67.448 44.7306 67.3495 44.2935 66.8262C43.8563 66.3029 43.8686 65.5702 44.3119 65.1885C44.7552 64.7944 45.4818 64.8868 45.9374 65.3978V65.3916Z" fill="#FFE600"/> <path id="Vector_104" d="M44.7353 64.9738C44.8892 65.0477 45.037 65.1585 45.1663 65.3001C45.6158 65.805 45.6219 66.5561 45.154 66.9502C45.0247 67.061 44.8769 67.1287 44.7168 67.1595C45.117 67.3627 45.6034 67.3381 45.9359 67.0487C46.3915 66.6423 46.3977 65.9035 45.9359 65.3925C45.6096 65.0231 45.1355 64.8814 44.7353 64.9738Z" fill="#FCCE08"/> </g> </g> </svg><em class="santacapbg"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="16" viewBox="0 0 48 16" fill="none"><g id="Group 6755761"><path id="Vector 3038" d="M9.50003 4.5C14.1667 7.5 27 14 47 9.5" stroke="#FFE600" stroke-width="0.25"/> <path id="Vector 3039" d="M3.05176e-05 14C6.1667 13.8333 18.5 13.5 31 0.5" stroke="#FFE600" stroke-width="0.25"/> <g id="Lamp"> <circle id="Glow" cx="2.00003" cy="14" r="2" fill="url(#paint0_radial_100_652)"/> <circle id="Bulb" cx="2.00003" cy="14" r="1" fill="#FFF27D"/> </g> <g id="Lamp_2"> <circle id="Glow_2" cx="6.00003" cy="14" r="2" fill="url(#paint1_radial_100_652)"/> <circle id="Bulb_2" cx="6.00003" cy="14" r="1" fill="#FFF27D"/> </g> <g id="Lamp_3"> <circle id="Glow_3" cx="10" cy="13" r="2" fill="url(#paint2_radial_100_652)"/> <circle id="Bulb_3" cx="10" cy="13" r="1" fill="#FFF27D"/> </g> <g id="Lamp_4"> <circle id="Glow_4" cx="14" cy="12" r="2" fill="url(#paint3_radial_100_652)"/> <circle id="Bulb_4" cx="14" cy="12" r="1" fill="#FFF27D"/> </g> <g id="Lamp_5"> <circle id="Glow_5" cx="17" cy="11" r="2" fill="url(#paint4_radial_100_652)"/> <circle id="Bulb_5" cx="17" cy="11" r="1" fill="#FFF27D"/> </g> <g id="Lamp_6"> <circle id="Glow_6" cx="23" cy="7" r="2" fill="url(#paint5_radial_100_652)"/> <circle id="Bulb_6" cx="23" cy="7" r="1" fill="#FFF27D"/> </g> <g id="Lamp_7"> <circle id="Glow_7" cx="26" cy="5" r="2" fill="url(#paint6_radial_100_652)"/> <circle id="Bulb_7" cx="26" cy="5" r="1" fill="#FFF27D"/> </g> <g id="Lamp_8"> <circle id="Glow_8" cx="29" cy="2" r="2" fill="url(#paint7_radial_100_652)"/> <circle id="Bulb_8" cx="29" cy="2" r="1" fill="#FFF27D"/> </g> <g id="Lamp_9"> <circle id="Glow_9" cx="12" cy="6" r="2" fill="url(#paint8_radial_100_652)"/> <circle id="Bulb_9" cx="12" cy="6" r="1" fill="#FFF27D"/> </g> <g id="Lamp_10"> <circle id="Glow_10" cx="16" cy="8" r="2" fill="url(#paint9_radial_100_652)"/> <circle id="Bulb_10" cx="16" cy="8" r="1" fill="#FFF27D"/> </g> <g id="Lamp_11"> <circle id="Glow_11" cx="20" cy="9" r="2" fill="url(#paint10_radial_100_652)"/> <circle id="Bulb_11" cx="20" cy="9" r="1" fill="#FFF27D"/> </g> <g id="Lamp_12"> <circle id="Glow_12" cx="25" cy="10" r="2" fill="url(#paint11_radial_100_652)"/> <circle id="Bulb_12" cx="25" cy="10" r="1" fill="#FFF27D"/> </g> <g id="Lamp_13"> <circle id="Glow_13" cx="30" cy="11" r="2" fill="url(#paint12_radial_100_652)"/> <circle id="Bulb_13" cx="30" cy="11" r="1" fill="#FFF27D"/> </g> <g id="Lamp_14"> <circle id="Glow_14" cx="35" cy="11" r="2" fill="url(#paint13_radial_100_652)"/> <circle id="Bulb_14" cx="35" cy="11" r="1" fill="#FFF27D"/> </g> <g id="Lamp_15"> <circle id="Glow_15" cx="40" cy="11" r="2" fill="url(#paint14_radial_100_652)"/> <circle id="Bulb_15" cx="40" cy="11" r="1" fill="#FFF27D"/> </g> <g id="Lamp_16"> <circle id="Glow_16" cx="45" cy="10" r="2" fill="url(#paint15_radial_100_652)"/> <circle id="Bulb_16" cx="45" cy="10" r="1" fill="#FFF27D"/> </g> </g> <defs> <radialGradient id="paint0_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2.00003 14) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint1_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.00003 14) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint2_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(10 13) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint3_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14 12) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint4_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17 11) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint5_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(23 7) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint6_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(26 5) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint7_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(29 2) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint8_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 6) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint9_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 8) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint10_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20 9) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint11_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(25 10) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint12_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30 11) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint13_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(35 11) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint14_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40 11) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> <radialGradient id="paint15_radial_100_652" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(45 10) rotate(90) scale(2)"> <stop stop-color="#FFE600"/> <stop offset="1" stop-color="#FFE600" stop-opacity="0"/> </radialGradient> </defs> </svg></em></em>' : "") + '<div id="titlediv" class="zsiq_cnt ' + e + '"><div id="zsiq_maintitle" class="zsiq_ellips" title="{MAINTITLE}">{MAINTITLE}</div><p id="zsiq_byline" class="zsiq_ellips" title="{BYLINETEXT}">{BYLINETEXT}</p><em class="siqico-close"></em></div><em id="zsiq_unreadcnt" class="zsiq_unrdcnt" style="display: none;"></em><em id="zsiq_avcall" class="zsiqmin_unrdcnt zsiq_unrdcnt siqico-mincall" style="display: none;"></em></div>' + d + "</div>"
    },
    getCustomCSS: function(C) {
        var i = $ZSIQTemplate.getCustomColor(C);
        return ".zsiq_flt_rel{ background-color:" + i + " !important;} .zsiq_seasonal .st2 { fill: " + i + " !important;}"
    }
};
var $ZSIQWidgetUI = $ZSIQWidgetUI || function() {
    var I, t, g, l, c, u = {
            1: "siq_bR",
            2: "siq_bM",
            3: "siq_bL",
            4: "siq_bL",
            5: "siq_lM",
            6: "siq_tL",
            7: "siq_tL",
            8: "siq_tM",
            9: "siq_tR",
            10: "siq_tR",
            11: "siq_rM",
            12: "siq_bR"
        },
        i = {
            bottomright: "1",
            bottomleft: "3",
            topleft: "6",
            topright: "9",
            left: "5",
            right: "11"
        },
        m = ["1", "2", "3", "4", "5", "6", "7", "9", "10"],
        n = function(e) {
            var t = $ZSIQUtil.getAPIValues(),
                i = $ZSIQWidget.getWidgetObject(),
                n = $ZSIQChatWindow[window._SIQ_TITLE_NEW_FLOW ? "getEmbedStatus" : "getWidgetStatus"](),
                a = !0 === n ? "online" : "offline",
                s = ("maintitle" == e ? i.title[1][a] : i.title[1][a + "_byline"]) || i.i18nkeys["float." + a + "." + e],
                l = "maintitle" == e ? 0 : 1,
                o = t.buttontexts;
            return o && (n && o[0] ? s = o[0][l] || s : !n && o[1] && (s = o[1][l] || s)), $ZSIQUtil.getEncodedText(s)
        },
        S = function(e) {
            return e = (e = e.replace(/{MAINTITLE}/g, n("maintitle"))).replace(/{BYLINETEXT}/g, n("byline"))
        },
        f = function(e) {
            return e.sticker[0] == $ZSIQUtil.STATUS_ENABLE ? "zsiq_floatmain zsiq_theme" + e.sticker[1].default+" " : "zsiq_custommain "
        },
        h = function(e) {
            var t;
            if (e.status = (t = $ZSIQWidget.getWidgetObject()).call_status || t.status, e.sticker[0] != $ZSIQUtil.STATUS_DISABLE) return g.style.height = "", g.style.width = "", I = $ZSIQTemplate["theme" + e.sticker[1].default], e.clogo_src = $ZSIQUtil.getCompanyLogo(e.clogo_src), I.getFloatStickerHTML(e);
            var i = e.status ? "online" : "offline";
            return e.sticker[1] && e.sticker[1].online ? a(e, i) : '<div id="zsiq_float" class="zsiq_float zsiq_empty"><div class="zsiq_flt_rel"></div></div>'
        },
        a = function(e, t) {
            var i = "",
                n = "",
                a = e.i18nkeys && e.i18nkeys["customsticker.alt.text"] || "";
            "offline" == t && $ZSIQUtil.isEmpty(e.sticker[1][t]) ? (i = e.sticker[1].online, n = "grayscl") : i = e.sticker[1][t];
            var s = '<div id="zsiq_float"><img onload="$ZSIQWidgetUI.onLoadCustomSticker(this)" src="' + $ZSIQUtil.getImageURL(e, i) + '" class="' + n + '" alt="' + a + '" height="400" width="400"/><em id="zsiq_unreadcnt" class="zsiq_unrdcnt" style="display: none;"></em><em id="zsiq_avcall" class="zsiqmin_unrdcnt zsiq_unrdcnt siqico-mincall" style="display: none;"></em></div>';
            return g.style.display = "none", s
        };
    return {
        F_STICKER: "0",
        F_BUTTON: "1",
        F_WINDOW: "2",
        getWidgetDiv: function() {
            return g
        },
        getWidgetState: function() {
            return l
        },
        initWidgetState: function() {
            t = $ZSIQUtil.isCSSTransformSupport();
            var e = $ZSIQUtil.getCookieValue("state");
            $ZSIQWidgetUI.F_WINDOW == e && "hide" == $zohosq.values.floatwindowvisible && ($ZSIQWidgetUI.setWidgetState($ZSIQWidgetUI.F_BUTTON), e = $ZSIQWidgetUI.F_BUTTON), l = e || $ZSIQWidgetUI.F_STICKER
        },
        isCSSTransformSupported: function() {
            return t
        },
        drawWidget: function() {
            var e = $ZSIQWidget.getWidgetObject(),
                t = $ZSIQWidget.getEmbedObject(),
                i = u[$ZSIQWidgetUI.getWidgetPosition()],
                n = !!g,
                a = $zohosq.nonce;
            if (n || (g = document.createElement("DIV")), g.className = f(e) + i, g.innerHTML = S(h(e)), g.setAttribute && (g.setAttribute("data-id", "zsalesiq"), a && g.setAttribute("nonce", a)), n || (g.style.visibility = "hidden", document.body.appendChild(g)), !$ZSIQChat.isPreview()) {
                var s = t.pinfo.pinfo,
                    l = document.getElementById("gdprbanner");
                if (null != l && l.remove(), 1 == JSON.parse(s.isgdprenabled) && 0 != JSON.parse(s.trackingprivacyconfig) && 1 == e.isgdprenabled && !$ZSIQUtil.checkGDPRBannerStatus(0, null, t)) {
                    (c = document.createElement("DIV")).innerHTML = $ZSIQUtil.getGDPRBanner(e, s), c.className = "gdbr-banner-cont";
                    var o = c.querySelector("#gdprbannerurl");
                    if (o) {
                        var d = -1 == s.cookiepolicyurl.indexOf("http") ? "http://" + s.cookiepolicyurl : s.cookiepolicyurl;
                        a && o.setAttribute("nonce", a), o.setAttribute("href", d)
                    }
                    document.body.appendChild(c), $ZSIQUtil.bindEventsCookieBanner()
                }
            }
            if (e.onlysticker) try {
                var r = $ZSIQWidgetUI.getMinWidgetDiv();
                $ZSIQWidgetUI.addClass(r, "zsiqfanim")
            } catch (e) {
                $ZSIQWidgetUI.addClass($ZSIQWidgetUI.getWidgetDiv(), "zsiqfanim")
            } else $ZSIQWidgetUI.checkWidgetVisibility(), $ZSIQWidgetUI.bindCustomCSS(e), $ZSIQUtil.bindClickEvent(g, $ZSIQWidgetUI.handleFloatEvents), n || $ZSIQUtil.bindClickEvent(document, $ZSIQUtil.stopBlinking), $ZSIQChatWindow.constructIframe(), $ZSIQWidget.handleAPIValues(), $ZSIQChatWindow.drawCustomHTML(), $ZSIQUtil.bindFocusEvent(window, $ZSIQWidgetUI.updateCountUI), $ZSIQUtil.bindResizeEvent($ZSIQWidgetUI.handleResizeEvents), t.is_widget_drag_supported && !$ZSIQChat.isPreview() && $ZSIQWidgetUI.bindDragEvent(), $ZSIQWidgetUI.updateCountUI()
        },
        minimizeSticker: function(e, t) {
            if (!$ZSIQChat.isPreview()) {
                var i = $ZSIQWidget.getWidgetObject();
                try {
                    var n = $ZSIQUtil.getIframe().$Support.EmbedObj,
                        a = $ZSIQUtil.getIframe().$Support.getCookieValue("ZLD" + n.livelsid)["attname_" + n.visitorID];
                    if ($ZSIQUtil.getIframe().$Support.getTriggerCookie()) {
                        var s = $ZSIQUtil.getIframe().$Support.getTriggerCookie();
                        s && (a = s.sendername)
                    }
                } catch (e) {}
                var l = i.sticker[1].default;
                if (i.sticker[0] != $ZSIQUtil.STATUS_DISABLE && (o = l, -1 < m.indexOf("" + o))) {
                    var o;
                    if ("1" == l) {
                        var d = document.getElementById("titlediv");
                        if (a && $ZSIQUtil.containsClass(d, "zsiq_min")) return void(document.getElementById("zsiq_maintitle").innerText = a);
                        d.className = d.className + " zsiq_min"
                    } else {
                        var r = document.getElementById("zsiq_float");
                        if (a && $ZSIQUtil.containsClass(r, "zsiq_min")) return void(document.getElementById("zsiq_maintitle").innerText = a);
                        g.innerHTML = S(I.getFloatButtonHTML($ZSIQWidget.getWidgetObject())), g.className = f(i) + u[$ZSIQWidgetUI.getWidgetPosition()], $ZSIQUtil.bindClickEvent(g, $ZSIQChatWindow.openChatWindow), e && $ZSIQWidgetUI.addClass(g, "zsiqfanim"),
                            function() {
                                var e = $ZSIQWidgetUI.getWidgetPosition();
                                if (5 == e || 11 == e) {
                                    var t = document.getElementById("zsiq_float"),
                                        i = -(t.offsetWidth - t.offsetHeight) / 2 + "px";
                                    $ZSIQWidgetUI.addClass(g, "zsiq_rotate90"), 5 != e ? g.style.right = i : g.style.left = i
                                }
                            }()
                    }
                    var c = document.getElementById("zsiq_float");
                    c && (c.parentElement.style.height = $ZSIQUtil.getElementHeight(c) + "px", c.parentElement.className += " siq_noanim"), t || $ZSIQWidgetUI.setWidgetState($ZSIQWidgetUI.F_BUTTON), $ZSIQWidgetUI.updateCountUI()
                }
            }
        },
        isStickerMinimized: function() {
            if ("1" != $ZSIQWidget.getWidgetObject().sticker[1].default) return $ZSIQUtil.containsClass(document.getElementById("zsiq_float"), "zsiq_min");
            var e = document.getElementById("titlediv");
            return $ZSIQUtil.containsClass(e, "zsiq_min")
        },
        handleWidgetVisible: function(e, t) {
            try {
                if (e)
                    if ("hide" != e || t && -1 != t) {
                        if ("show" == e) {
                            var i = $ZSIQChatWindow.getChatWindowDiv();
                            (!i || "block" !== i.style.display || i.style.top.replace("px", "") < 0 || -1 == i.className.indexOf("siqanim")) && (g.style.display = "block", g.className = g.className.replace(/(?:^|\s)zsiqfanim(?!\S)/, ""))
                        } else if (!isNaN(e) && 0 < e) {
                            if (-1 == e) return;
                            g.style.display = "none", setTimeout(function() {
                                g.style.display = "block"
                            }, 1e3 * e), $zohosq.values.floatvisible = -1
                        }
                    } else g.style.display = "none"
            } catch (e) {}
        },
        updateCallUI: function(e) {
            document.getElementById("zsiq_avcall") && (document.getElementById("zsiq_avcall").style.display = "")
        },
        removeCallUI: function(e) {
            document.getElementById("zsiq_avcall") && (document.getElementById("zsiq_avcall").style.display = "none")
        },
        updateIncomingCallUI: function() {
            document.getElementById("zsiq_avcall") && (document.getElementById("zsiq_avcall").className += " cal-anim")
        },
        handleMinimizeCall: function() {
            this.removeCallClass(), $ZSIQChatWindow.getChatWindowDiv().className += "theme5" === $ZSIQUtil.getIframe().CallImpl.getTheme() ? " siq-calthemesign" : " siq-calthememin"
        },
        handleMinCall: function() {
            this.removeCallClass(), $ZSIQChatWindow.getChatWindowDiv().className += "theme5" === $ZSIQUtil.getIframe().CallImpl.getTheme() ? " siq-calthemesign" : " siq-caltheme"
        },
        handlefbCall: function() {
            this.removeCallClass(), $ZSIQChatWindow.getChatWindowDiv().className += "theme5" === $ZSIQUtil.getIframe().CallImpl.getTheme() ? " siq-calthemesign" : " siq-calthemefb"
        },
        removeCallClass: function() {
            var e = $ZSIQChatWindow.getChatWindowDiv();
            e.className = e.className.replace(/(?:^|\s)siq-calthememin(?!\S)/, "").replace(/(?:^|\s)siq-caltheme(?!\S)/, "").replace(/(?:^|\s)siq-calthemefb(?!\S)/, "")
        },
        removeIncomingCallUI: function() {
            document.getElementById("zsiq_avcall") && document.querySelector("#zsiq_avcall").classList.remove("cal-anim")
        },
        updateCount: function(e) {
            var t = $ZSIQWidget.getWidgetObject().sticker;
            1 == t[0] && "8" == t[1].default && (document.getElementById("zsiq_chatbtn").style.display = "none"), document.getElementById("zsiq_unreadcnt") && e && (document.getElementById("zsiq_unreadcnt").style.display = "", $ZSIQUtil.setText("zsiq_unreadcnt", e))
        },
        updateCountUI: function() {
            var e, t = $ZSIQUtil.getIframe(),
                i = 0;
            if (t && t.$Support) i = (e = t.$Support).getUnreadCount(), e.setTabOwner();
            else {
                var n = $ZSIQChat.getWidgetData().embedobj.einfo.embedid,
                    a = $ZSIQLSDB.get("ZLD" + n + "unreadcount") || {};
                for (var s in a) i += a[s]
            }
            i ? l == $ZSIQWidgetUI.F_BUTTON ? $ZSIQWidgetUI.updateCount(i) : e && l == $ZSIQWidgetUI.F_WINDOW && !e.isConversationUIFocussed() && ($ZSIQWidgetUI.removeUnreadCount(), e.removeUnreadCookie && e.removeUnreadCookie()) : $ZSIQWidgetUI.removeUnreadCount()
        },
        handleFloatEvents: function(e) {
            var t = e.target;
            if ("siqico-close" == t.getAttribute("class")) return $zoho.salesiq.floatbutton.coin.hidetooltip(), void $ZSIQLSDB.storeInLocalStorage("isTooltipClosed", !0);
            if ("hide-widget" == t.getAttribute("id")) return e.stopPropagation(), void $zoho.salesiq.floatbutton.visible("hide");
            if ("minsticker" != e.target.getAttribute("data-click")) {
                var i = $ZSIQUtil.getIframe();
                if (i) {
                    if (!$ZSIQChat.isPreview() && i.$Support) {
                        var n = "block" == g.style.display && !$ZSIQUtil.containsClass(g, "zsiqfanim");
                        if (l == $ZSIQWidgetUI.F_BUTTON || l == $ZSIQWidgetUI.F_STICKER || n) {
                            var a = i.$Support.Util;
                            a.ispostloaddone || (clearTimeout(a.jsdownloadtimer), a.downloadAdditionalFiles()), $ZSIQWidget.handleCallBacks({
                                "chatbutton.click": ""
                            }), $ZSIQChatWindow.openChatWindow(), window._IS_REVAMP && ("click" == $zv.chatmode ? IframeHandler.sendPostMessage("chatmode") : $zv.question && IframeHandler.sendPostMessage("question"))
                        }
                    }
                } else $ZSIQChatWindow.populateIframe(null, function() {
                    $ZSIQWidgetUI.handleFloatEvents(e)
                })
            } else $ZSIQWidgetUI.minimizeSticker()
        },
        handleResizeEvents: function() {
            $ZSIQChat.isPreview() || handleIframeFunction(function(e) {
                e.$Support.Util.checkWindowVisibility()
            })
        },
        onLoadCustomSticker: function(e) {
            var t = {},
                i = e.naturalWidth,
                n = e.naturalHeight,
                a = [400 / i, 400 / n];
            t = 1 < (a = Math.min(a[0], a[1])) ? {
                WIDTH: i,
                HEIGHT: n
            } : {
                WIDTH: i * a,
                HEIGHT: n * a
            }, g.style.width = t.WIDTH + "px", g.style.height = t.HEIGHT + "px"
        },
        getWidgetPosition: function() {
            var e = $ZSIQUtil.getAPIValues();
            return e.floatposition ? "" + i[e.floatposition] : "" + $ZSIQWidget.getWidgetObject().position[1].no
        },
        isHandHeldDevice: function() {
            return !(!$ZSIQChat.isPreview() || "mobile" != _WIDGETPREV_MODE) || !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|IEMobile|Opera Mini/i.test(navigator.userAgent)
        },
        isAppleDevice: function() {
            return /iPhone|iPad|iPod/i.test(navigator.userAgent)
        },
        addClass: function(e, t) {
            -1 == e.className.indexOf(t) && (e.className += " " + t)
        },
        setWidgetState: function(e) {
            l = e, $ZSIQWidget.setWidgetCookie(e)
        },
        removeUnreadCount: function() {
            var e = document.getElementById("zsiq_unreadcnt");
            e && (e.style.display = "none")
        },
        checkWidgetVisibility: function(e) {
            var t = $ZSIQWidget.getWidgetObject();
            $ZSIQWidgetUI.checkAndHideCoinToolTip(t.hide_tooltip);
            var i = $zohosq.values.floatvisible;
            if (!i || $ZSIQChat.isPreview() || "hide" != i && "show" != i && isNaN(i))
                if ("1" == t.mdevice_hide[0] && $ZSIQWidgetUI.isHandHeldDevice()) g.style.display = "none";
                else {
                    if ("1" == t.hideoffline[0] && !$ZSIQChatWindow.getWidgetStatus() || 0 == t.islivechat && !$ZSIQChatWindow.isOnlyCall() || t.hideembed) {
                        if (!e && !$ZSIQChatWindow.isChatExist()) return $ZSIQWidgetUI.setWidgetState("0"), void(g.style.display = "none");
                        g.style.display = "block"
                    } else g.style.display = "block";
                    l == $ZSIQWidgetUI.F_WINDOW ? ($ZSIQWidgetUI.minimizeSticker(null, !0), $ZSIQWidgetUI.addClass(g, "zsiqfanim")) : l == $ZSIQWidgetUI.F_BUTTON && $ZSIQWidgetUI.minimizeSticker()
                }
            else $ZSIQWidgetUI.handleWidgetVisible(i)
        },
        bindCustomCSS: function(e) {
            var t = e.sticker[1].default,
                i = $ZSIQTemplate["theme" + t],
                n = document.getElementById("zsiqcustomcss"),
                a = $zohosq.nonce;
            n && n.parentElement.removeChild(n);
            var s = document.createElement("style");
            s.id = "zsiqcustomcss", s.setAttribute && s.setAttribute("data-id", "zsalesiq"), a && s.setAttribute("nonce", a), s.appendChild(document.createTextNode(i.getCustomCSS(e))), document.body.appendChild(s)
        },
        getGDPRBannerDiv: function() {
            return c
        },
        checkAndHideCoinToolTip: function(e) {
            if (1 == $ZSIQWidget.getWidgetObject().sticker[1].default) {
                var t = document.querySelector("#zsiq_float #titlediv"),
                    i = "zsiqhide_tip";
                t && ($zohosq.values.ishidetooltip || e ? $ZSIQWidgetUI.addClass(t, i) : t.classList.remove(i))
            }
        },
        bindDragEvent: function() {
            var o, d, r = g,
                e = r.querySelector("img"),
                c = !1;

            function t(e) {
                var t, i;
                e.preventDefault(), "touchmove" === e.type ? (t = e.touches[0].clientX - o, i = e.touches[0].clientY - d, c = !0) : (t = e.clientX - o, i = e.clientY - d);
                var n = window.innerWidth - r.offsetWidth,
                    a = window.innerHeight - r.offsetHeight,
                    s = Math.min(n, Math.max(0, t)),
                    l = Math.min(a, Math.max(0, i));
                r.style.left = Math.max(t, s) + "px", r.style.top = l + "px"
            }
            r.setAttribute("draggable", !0), e && e.setAttribute("draggable", !1), r.addEventListener("dragstart", function(e) {
                e.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
                var t = r.getBoundingClientRect();
                o = e.clientX - t.left, d = e.clientY - t.top
            }), document.addEventListener("dragover", t), r.addEventListener("touchmove", t), r.addEventListener("touchstart", function(e) {
                e.preventDefault(), c = !1;
                var t = r.getBoundingClientRect();
                o = e.touches[0].clientX - t.left, d = e.touches[0].clientY - t.top, setTimeout(function() {
                    !c && r.click()
                }, 200)
            }), r.addEventListener("touchend", function() {
                c = !1
            })
        }
    }
}();
var $ZSIQWidget = $ZSIQWidget || function() {
    var e, i = {},
        n = {},
        a = function(t) {
            var e = $ZSIQUtil.parseToJSON(t);
            return "object" == typeof e || "boolean" == typeof e ? e : t
        };
    return {
        init: function(t) {
            var e = $ZSIQChat.getWidgetData();
            ! function(t) {
                for (var e in t) i[e] = a(t[e]);
                $ZSIQAnalytics = i.analytics, $ZSIQAutopick = $zv.autopick || i.autopick, _ZSIQ.brandname = i.brandname
            }(e.widgetobj),
            function(t) {
                for (var e in t) n[e] = a(t[e])
            }(e.embedobj), $ZSIQChat.server_avuid = $ZSIQUtil.getAvuid(), $ZSIQWidgetUI.initWidgetState(), $ZSIQWidgetUI.drawWidget(), !$ZSIQChat.isPreview() && $zohosq.init && $zohosq.init(), t || $ZSIQUtil.storeDetails(e), $ZSIQUtil.manageCookie && $ZSIQUtil.setTrackingStatus()
        },
        getWidgetObject: function() {
            return i
        },
        getEmbedObject: function() {
            return n
        },
        setWidgetCookie: function(t) {
            clearTimeout(e), $ZSIQUtil.storeCookieVal("state", t, !0), e = setTimeout(function() {
                $ZSIQWidget.setWidgetCookie(t)
            }, 18e4)
        },
        handleAPIValues: function() {
            if ("click" == $ZSIQUtil.getAPIValues().chatmode) {
                var t = $ZSIQWidgetUI.getWidgetDiv();
                t.setAttribute("data-autochat", !0);
                $ZSIQWidgetUI.getWidgetState() == $ZSIQWidgetUI.F_STICKER && $ZSIQUtil.bindClickEvent(t, function(t) {
                    "zsiq_minimize" != t.target.id && 0 != +[t.clientX] && $ZSIQChatWindow.openChatWindow()
                })
            }
        },
        handleCallBacks: function(t) {
            try {
                if ($zoho && t)
                    for (var e in t) $zohosq._invoke(e, t[e])
            } catch (t) {}
        },
        getWidgetStatus: function() {
            return i.status
        },
        getEmbedSize: function() {
            var t = JSON.parse($ZSIQWidget.getEmbedObject().einfo.props.size)[1].val;
            return 1 == t ? 2 : t
        }
    }
}();
$ZSIQWidget.init();
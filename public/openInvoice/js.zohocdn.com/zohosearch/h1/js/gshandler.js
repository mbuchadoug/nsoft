! function(s) {
    var o = s.document,
        e = function(l) {
            (l = s.zgssearch || {}).userAgent = s.navigator.userAgent, l.isIE = -1 !== l.userAgent.indexOf("MSIE") || -1 !== l.userAgent.indexOf("Trident"), l.isLinux = -1 !== l.userAgent.indexOf("Linux") || -1 !== l.userAgent.indexOf("Linux"), l.isWindows = -1 !== l.userAgent.indexOf("Win") || -1 !== l.userAgent.indexOf("Win"), l.detectBrowser = function() {
                return -1 != (l.userAgent.indexOf("Opera") || l.userAgent.indexOf("OPR")) ? "Opera" : -1 != l.userAgent.indexOf("Edg") ? "Edge" : -1 != l.userAgent.indexOf("Chrome") ? "Chrome" : -1 != l.userAgent.indexOf("Safari") ? "Safari" : -1 != l.userAgent.indexOf("Firefox") ? "Firefox" : -1 != l.userAgent.indexOf("MSIE") || 1 == !!o.documentMode ? "IE" : "Unknown"
            }, l.detectBrowserVersion = function() {
                var e, t = l.userAgent,
                    n = t.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                return /trident/i.test(n[1]) ? {
                    name: "IE",
                    version: (e = /\brv[ :]+(\d+)/g.exec(t) || [])[1] || ""
                } : "Chrome" === n[1] && null != (e = t.match(/\b(OPR|Edge)\/(\d+)/)) ? {
                    name: e[1].replace("OPR", "Opera"),
                    version: e[2]
                } : (n = n[2] ? [n[1], n[2]] : [navigator.appName, navigator.appVersion, "-?"], null != (e = t.match(/version\/(\d+)/i)) && n.splice(1, 1, e[1]), {
                    name: n[0],
                    version: n[1]
                })
            }, l.ZSNetwork = {
                imageRenderer: {
                    renderImage: function(e, t, n) {
                        t ? l.renderPhoto("", e, t.class_name, t.errorClass, t.img_elem) : n(e)
                    }
                },
                getSearchResultsForSSE: function(e) {
                    l.eventSource = new EventSource(e), l.eventSource.addEventListener("initial_Weightage", function(e) {
                        l.handleSearchResults("IWEIGHT", e.data)
                    }), l.eventSource.addEventListener("version", function(e) {
                        l.handleSearchResults("VERSION", e.data)
                    }), l.eventSource.addEventListener("result", function(e) {
                        l.handleSearchResults("RESULT", e.data)
                    }), l.eventSource.addEventListener("nlp_tracer", function(e) {
                        l.gsnlpsearch.storeNLPTracerData(e.data)
                    }), l.eventSource.addEventListener("weightage", function(e) {
                        l.handleSearchResults("WEIGHT", e.data)
                    }), l.eventSource.onmessage = function(e) {
                        l.network.removeEventSource(), l.handleSearchResults("CLOSE", e)
                    }, l.eventSource.onerror = function(e) {
                        l.network.removeEventSource(), l.handleSearchResults("ERROR", e)
                    }
                },
                abortOngoingCalls: function() {
                    l.abortXMLHTTPReq(l.xmlhttpReq), l.network.removeEventSource()
                },
                abortOngoingCalloutCalls: function() {
                    l.abortXMLHTTPReq(l.xmlhttpCalloutReq), l.network.removeEventSource()
                },
                abortOngoingAdvSearchCalls: function() {
                    l.abortXMLHTTPReq(l.advSearchXMLHttpReq), l.network.removeEventSource()
                },
                removeEventSource: function() {
                    void 0 !== l.eventSource && (l.eventSource.close(), l.eventSource = void 0)
                },
                xmlHttpReq: function(e, t, n, r) {
                    n && l.abortXMLHTTPReq(l.xmlhttpReq), l.xmlhttpReq = l.getRequestObject(), l.xmlhttpReq.onreadystatechange = function(e) {
                        4 === l.xmlhttpReq.readyState && (200 === l.xmlhttpReq.status ? r({
                            response: l.xmlhttpReq.responseText,
                            status: "success",
                            result: l.xmlhttpReq,
                            args: l.xmlhttpReq.args
                        }) : r({
                            response: e,
                            status: "error",
                            result: l.xmlhttpReq,
                            args: l.xmlhttpReq.args
                        }))
                    }, l.xmlhttpReq.open(e, t, !0), l.xmlhttpReq.send()
                },
                uri: function(t) {
                    if ("POST" !== t.type) return s._jQueryGS.ajax(t);
                    l.network.getCookie("CSRF_TOKEN", function(e) {
                        return t.data = void 0 !== t.data ? t.data += "&" + GSConstant.csrfName + "=" + e : e, s._jQueryGS.ajax(t)
                    })
                },
                upload_file: function(n) {
                    "POST" === n.method && l.network.getCookie("CSRF_TOKEN", function(e) {
                        var t = n.data;
                        e && t.append(GSConstant.csrfName, e)
                    }), s._jQueryGS.ajax(n)
                },
                download_file: function(e) {
                    var t = o.createElement("iframe");
                    t.frameBorder = 0, t.id = "download_iframe", t.src = e, t.style = "display:none";
                    e = l.isPreviewOpenedInComponent ? "zgs20_pcSearch" : "zgs20_globalsearch";
                    o.getElementById(e).appendChild(t), setTimeout(function() {
                        t.parentElement.removeChild(t)
                    }, 5e4)
                },
                getFingerPrintFilePath: function(e, t) {
                    var n = "embeddashboards" === t ? t : l.GSConstant.BUILD_DATE,
                        n = s.location.protocol + "//" + l.GSConstant.STATIC_RESOURCE_SERVER + "/" + l.gscomponent.gsserver + "/" + n + "/";
                    return l.gscomponent.hasOwnProperty("isFingerprintEnabled") && l.gscomponent.isFingerprintEnabled && l.gscomponent.hasOwnProperty(e) ? "embeddashboards" === t ? l.gsbuildDetails[e] : n + l.gsbuildDetails[e] : n + e
                },
                setIntegrityValue: function(e, t) {
                    e.setAttribute("integrity", t), e.setAttribute("crossorigin", "anonymous")
                },
                loadSRICSSFile: function(e, t, n) {
                    var r, s;
                    e && (s = r = "", -1 < e.indexOf("wmsbar") ? (r = e, s = wms_css_url_integrity || "") : r = l.network.getFingerPrintFilePath(e, n), e = l.gsbuildDetails.hasOwnProperty("checksums") && l.gsbuildDetails.checksums.hasOwnProperty(e) ? l.gsbuildDetails.checksums[e] : s, (s = o.createElement("link")).setAttribute("rel", "stylesheet"), s.setAttribute("type", "text/css"), e && l.network.setIntegrityValue(s, e), s.setAttribute("href", r), s.onload = function() {
                        l.cssLoaded || (l.cssLoaded = !0), t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(s))
                },
                loadSRIJSFile: function(e, t, n) {
                    var r, s;
                    e && (s = r = "", -1 < e.indexOf("wmsbar") ? (r = e, s = wms_js_url_integrity || "") : r = l.network.getFingerPrintFilePath(e, n), s = -1 < e.indexOf("workdrive-components-v1") ? l.workdrive_component_integrity : s, e = l.gsbuildDetails.hasOwnProperty("checksums") && l.gsbuildDetails.checksums.hasOwnProperty(e) ? l.gsbuildDetails.checksums[e] : s, (s = o.createElement("script")).setAttribute("type", "text/javascript"), e && l.network.setIntegrityValue(s, e), s.setAttribute("src", r), s.onload = function() {
                        t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(s))
                },
                loadSRIJSFileForFingerprintedURL: function(e, t) {
                    var n, r;
                    e && (n = l.gsbuildDetails.hasOwnProperty("checksums") && l.gsbuildDetails.checksums.hasOwnProperty(e) ? l.gsbuildDetails.checksums[e] : "", (r = o.createElement("script")).setAttribute("type", "text/javascript"), n && "" != n && l.network.setIntegrityValue(r, n), e = l.gsbuildDetails.hasOwnProperty(e) && l.gsbuildDetails[e], e = s.location.protocol + "//" + l.GSConstant.STATIC_RESOURCE_SERVER + e, r.setAttribute("src", e), r.onload = function() {
                        t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(r))
                },
                loadCSSFile: function(e, t) {
                    var n;
                    e && ((n = o.createElement("link")).setAttribute("rel", "stylesheet"), n.setAttribute("type", "text/css"), n.setAttribute("href", e), n.onload = function() {
                        l.cssLoaded || (l.cssLoaded = !0), t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(n))
                },
                loadJSFile: function(e, t) {
                    var n = o.createElement("script");
                    n.setAttribute("type", "text/javascript"), n.setAttribute("src", e), n.onload = function() {
                        t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(n)
                },
                getCookie: function(e, t) {
                    for (var n = e + "=", r = o.cookie.split(";"), s = 0; s < r.length; s++) {
                        var a = r[s].trim();
                        0 === a.indexOf(n) && t(a.substring(n.length, a.length))
                    }
                }
            }, l.network = l.ZSNetwork, l.gscomponent = l.gscomponent || {}, l.GSConstant = l.GSConstant || {}, l.GSConstant.supportedZSLanguages = l.GSConstant.supportedZSLanguages || ["en", "ja", "zh", "baihui_en", "baihui_zh", "sd_IN", "fa_IR", "et_EE", "gu_IN", "ur_PK", "ko_KR", "km_KH", "ta_IN", "as_IN", "hi_IN", "el_GR", "fil-PH", "tr_TR", "sl_SI", "ja_JP", "az_Latn-AZ", "it_IT", "es_ES", "pa_IN", "lo_LA", "bg_BG", "da_DK", "ms_MY", "cs_CZ", "nb_NO", "bn_IN", "de_DE", "lt_LT", "nl_NL", "ca_ES", "mr_IN", "zh_CN", "sq_AL", "si_LK", "my_MM", "th_TH", "uk_UA", "he_IL", "sv_SE", "sr_Latn-RS", "hr_HR", "fi_FI", "pt_PT", "hu_HU", "eu_ES", "ro_RO", "lv_LV", "pt_BR", "ne_NP", "ar_EG", "mk_MK", "vi_VN", "kn_IN", "fr_FR", "jv", "te_IN", "ru_RU", "pl_PL", "ks_IN", "mai_IN", "ml_IN", "or_IN", "sat_IN", "brx_IN", "doi_IN", "kok_IN", "sd_IN", "mni_IN", "sa_IN"], l.GSConstant.rtlSupportedZSLanguages = l.GSConstant.rtlSupportedZSLanguages || ["ar_EG", "ur_PK", "fa_IR", "he_IL", "ks_IN"], l.getbd = "/zgssearch/getbd", l.isExtension = !1, l.thirdPartyCookieDisabled = !1, l.GSConstant.languageVsCountryObj = {
                ar: ["ar_EG"],
                as: ["as_IN"],
                az: ["az_Latn-AZ", "az_AZ"],
                bg: ["bg_BG"],
                bn: ["bn_IN"],
                cs: ["cs_CZ"],
                da: ["da_DK"],
                de: ["de_DE"],
                el: ["el_GR"],
                es: ["es_ES"],
                fi: ["fi_FI"],
                fr: ["fr_FR"],
                gu: ["gu_IN"],
                hi: ["hi_IN"],
                hr: ["hr_HR"],
                hu: ["hu_HU"],
                it: ["it_IT"],
                ja: ["ja_JP"],
                kn: ["kn_IN"],
                ko: ["ko_KR"],
                lt: ["lt_LT"],
                mr: ["mr_IN"],
                ms: ["ms_MY"],
                nb: ["nb_NO"],
                ne: ["ne_NP"],
                nl: ["nl_NL"],
                pa: ["pa_IN"],
                pl: ["pl_PL"],
                pt: ["pt_PT", "pt_BR"],
                ro: ["ro_RO"],
                ru: ["ru_RU"],
                sl: ["sl_SI"],
                sr: ["sr_Latn-RS", "sr_RS"],
                sv: ["sv_SE"],
                ta: ["ta_IN"],
                te: ["te_IN"],
                th: ["th_TH"],
                tr: ["tr_TR"],
                uk: ["uk_UA"],
                ur: ["ur_PK"],
                vi: ["vi_VN"],
                zh: ["zh_CN"],
                ca: ["ca_ES"],
                et: ["et_EE"],
                eu: ["eu_ES"],
                fa: ["fa_IR"],
                he: ["he_IL"],
                jv: ["jv"],
                km: ["km_KH"],
                lo: ["lo_LA"],
                lv: ["lv_LV"],
                mk: ["mk_MK"],
                ph: ["fil-PH"],
                si: ["si_LK"],
                sq: ["sq_AL"],
                my: ["my_MM"],
                in: ["id_ID"],
                ks: ["ks_IN"],
                mai: ["mai_IN"],
                ml: ["ml_IN"],
                or: ["or_IN"],
                sat: ["sat_IN"],
                brx: ["brx_IN"],
                doi: ["doi_IN"],
                kok: ["kok_IN"],
                sd: ["sd_IN"],
                mni: ["mni_IN"],
                sa: ["sa_IN"]
            }, l.console = s.console;
            var n = l.console;
            return l.throwClientError = function(e, t) {
                n.log("ZS: " + (e = t ? e + " " + t : e)), "undefined" != typeof murphy && murphy.error(t)
            }, l.logTrace = function(e) {
                n.log(e)
            }, l.includes = function(e, t) {
                return String.prototype.includes ? t.includes(e) : -1 !== t.indexOf(e)
            }, l.assignObject = function(e, t) {
                return "function" != typeof Object.assign && (Object.assign = function(e) {
                    "use strict";
                    null == e && l.throwClientError("Cannot convert undefined or null to object"), e = Object(e);
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        if (null != n)
                            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }), Object.assign(e, t)
            }, l.initLoadZSFiles = function(e) {
                l.gsbuildDetails = l.jsonParse(e), l.loadZSFiles()
            }, l.initZGSHandler = function(e) {
                var r;
                !!s.hasOwnProperty("ZSLite") && s.ZSLite ? s.ZSLite && (s.hasOwnProperty("openZiaAPIHandler") || s.hasOwnProperty("openZSHandler")) && (r = s.hasOwnProperty("openZiaAPIHandler") ? "openZiaAPIHandler" : "openZSHandler", l.serviceSearch = function(e, t, n) {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.serviceSearch", [e, t, n]) : s[r]([e, t, n])
                }, l.helpSearch = function(e, t, n) {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.helpSearch", [e, t, n]) : s[r]([e, t, n])
                }, l.open = function() {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.open") : s[r]()
                }, l.search = function(e) {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.search", [e]) : s[r]([e])
                }, l.advancedSearch = function(e) {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.advancedSearch", [e]) : s[r]([e])
                }) : ((e = e || {}) && (null != e.thirdPartyCookieDisabled && (l.thirdPartyCookieDisabled = e.thirdPartyCookieDisabled), e.network && (l.network = e.network), e.source && "extension" === e.source && (l.isExtension = !0)), (e = l.assignObject(e, l.gsbuildDetails)).gsrebrand = e.hasOwnProperty("gsrebrand") ? e.gsrebrand : "undefined" != typeof WebMessanger && WebMessanger.rebrand || "", e.gslanguage = e.hasOwnProperty("gslanguage") ? e.gslanguage : "undefined" != typeof WebMessanger && WebMessanger.language || "", e.gscountry = e.hasOwnProperty("gscountry") ? e.gscountry : "undefined" != typeof WebMessanger && WebMessanger.countrycode || "", l.gscomponent = l.assignObject(l.gscomponent, e), e.hasOwnProperty("getbdDataObtained") || e.hasOwnProperty("isFingerprintEnabled") ? l.initLoadZSFiles(e) : l.getBuildDetails())
            }, l.jsonParse = function(e) {
                try {
                    if ("string" == typeof e) return JSON.parse(e)
                } catch (e) {
                    l.throwClientError("Error while parsing json data", e)
                }
                return e
            }, l.abortXMLHTTPReq = function(e) {
                e && e.abort()
            }, l.getRequestObject = function() {
                try {
                    return new XMLHttpRequest
                } catch (e) {
                    throw l.throwClientError("Unable to create XML Http Object for Ajax Request.", e), e
                }
            }, l.getBuildDetails = function() {
                l.network.xmlHttpReq("GET", l.getbd, !0, function(e) {
                    e && e.status && "error" != e.status && (l.initLoadZSFiles(e.response), l.bdLoaded = !0)
                })
            }, l.setGSConstantObj = function(e) {
                for (var t in e) l.GSConstant[t] = e[t]
            }, l.checkAndloadFontAndJqueryFile = function() {
                var e = l.getCurrentLanguage();
                "mni_IN" === e && (l.isLinux || l.isWindows) || "sat_IN" === e && l.isLinux ? l.network.loadSRICSSFile("css/" + ("mni_IN" === e ? "manipurifont" : "santhalifont") + ".css", l.loadJQueryFile) : l.loadJQueryFile()
            }, l.loadGSFile = function() {
                l.cssLoaded ? l.checkAndloadFontAndJqueryFile() : l.network.loadSRICSSFile(l.GSConstant.resultNewCSSURL, l.checkAndloadFontAndJqueryFile)
            }, l.loadJQueryFile = function() {
                var e = !!s.hasOwnProperty("ZSJqueryCoreObj") && "3.6.0" === s.ZSJqueryCoreObj.version;
                "undefined" != typeof jQuery && "3.6.0" === jQuery().jquery || e ? (s._jQueryGS = e ? s.ZSJqueryCoreObj.scope : jQuery, s.jQuery = void 0 === s.jQuery ? jQuery : s.jQuery, l.loadI18NJSFile(!0)) : l.network.loadSRIJSFile(l.GSConstant.gsjQueryURL, l.loadI18NJSFile)
            }, l.loadI18NJSFile = function(e) {
                e || (e = jQuery, s._jQueryGS = e.noConflict(!0), s.jQuery = void 0 === s.jQuery ? e : s.jQuery, s.ZSJqueryCoreObj = {
                    scope: s._jQueryGS,
                    version: "3.6.0"
                }), l.network.loadSRIJSFile(l.GSConstant.gsi18NJSURL, l.loadResultJsFiles)
            }, l.loadResultJsFiles = function() {
                l.network.loadSRIJSFile(l.GSConstant.resultNewJSURL)
            }, l.getCurrentLanguage = function() {
                var e = l.gscomponent.gslanguage || "en",
                    t = l.gscomponent.gscountry || "",
                    n = "baihui" == (n = l.gscomponent.gsrebrand) ? n : "";
                if (-1 === l.GSConstant.supportedZSLanguages.indexOf(e))
                    if (l.GSConstant.languageVsCountryObj.hasOwnProperty(e)) {
                        var r = l.GSConstant.languageVsCountryObj[e],
                            s = r.length;
                        if (1 < s)
                            for (var a = 0; a < s; a++) {
                                var o = r[a];
                                if ("" === t) {
                                    e = r[0];
                                    break
                                }
                                var i = "" !== t ? e + "_" + t : e;
                                o.lowerCase() === i && (e = o[0])
                            } else e = r[0]
                    } else e = "en";
                return (n ? n + "_" : "") + e
            }, l.getLanguageFileName = function() {
                return "js/" + l.getCurrentLanguage() + ".js"
            }, l.loadZSFiles = function() {
                var e = l.gsbuildDetails || {};
                e.BUILD_DATE && (e.gslanguage = e.gslanguage || l.gscomponent.gslanguage, e.gscountry = e.gscountry || l.gscomponent.gscountry, e.gsserver = e.gsserver || "zohosearch", l.gscomponent = Object.assign(l.gscomponent, e), l.GSConstant.BUILD_DATE = l.gscomponent.BUILD_DATE, l.GSConstant.STATIC_RESOURCE_SERVER = l.gscomponent.STATIC_RESOURCE_SERVER, e.gsjQueryURL = "js/jquery-3.6.0.min.js", e.gsi18NJSURL = l.getLanguageFileName(), 1 === l.gscomponent.UIType ? (e.resultNewJSURL = "js/zsresult.js", e.resultNewCSSURL = "css/zsresult.css", l.loadMurphyFile()) : (e.resultNewJSURL = "js/gsresult.js", e.resultNewCSSURL = l.isExtension ? "css/extresult.css" : "css/gsresult.css"), l.setGSConstantObj(e), l.loadGSFile())
            }, l.loadWMSFiles = function() {
                l.network.loadSRICSSFile(wms_css_url, l.loadWMSJSFile)
            }, l.loadWMSJSFile = function() {
                l.network.loadSRIJSFile(wms_js_url, l.registerWMS)
            }, l.registerWMS = function() {
                var t = (new Date).getTime(),
                    n = setInterval(function() {
                        var e;
                        6e4 < (new Date).getTime() - t ? clearInterval(n) : "undefined" != typeof WebMessanger && (clearInterval(n), WebMessanger.setClientSRIValues(wms_all_sri_values), WebMessanger.setNoDomainChange(), rebrandName && null !== rebrandName && "null" !== rebrandName && (WebMessanger.setRebrand(rebrandName), WebMessanger.setIamServer(iamServer), WebMessanger.setChatServer(chat_server_url), WebMessanger.setPhotoServer(contacts_server_url), WebMessanger.setMeetingUrl(meeting_server_url)), WebMessanger.setLocale(user_info.language, user_info.country), e = WMSSessionConfig.CHAT | WMSSessionConfig.CHAT_PRESENCE | WMSSessionConfig.PRESENCE_PERSONAL | WMSSessionConfig.CROSS_PRD | WMSSessionConfig.MP, WebMessanger.setConfig(e), "rtl" === getComputedStyle(o.body).direction && WebMessanger.enableRTLMode(), WebMessanger.registerZuid("SE", user_info.zuid, user_info.primary_email, l.isWMSSilentMode))
                    }, 200)
            }, l.loadMurphyFile = function() {
                if ("undefined" == typeof murphy || !murphy.hasOwnProperty("isMurphyInstalled") || !murphy.isMurphyInstalled()) {
                    let e = l.gsbuildDetails.MURPHY_APP_KEY,
                        t = l.gsbuildDetails.MURPHY_APP_DOMAIN,
                        n = l.gsbuildDetails.MURPHY_AUTH_KEY;
                    var r;
                    e && t && n && (r = l.network.getFingerPrintFilePath("js/murphy.min.js", !0), l.network.loadJSFile(r, function() {
                        murphy.install({
                            config: {
                                appKey: e,
                                appDomain: t,
                                environment: "production",
                                authKey: n,
                                enableTracking: !1,
                                rageRequest: {
                                    timeInterval: "5000",
                                    tokenLimit: "3",
                                    apiBasePath: "",
                                    enable: !0
                                }
                            },
                            setTags: function() {
                                return {
                                    buildId: l.GSConstant.BUILD_DATE
                                }
                            }
                        })
                    }))
                }
            }, l
        }(void 0);
    s.zgssearch = e
}(window);
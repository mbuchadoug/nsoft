! function(window) {
    var document = window.document,
        zgssearch = function(zgssearch) {
            (zgssearch = window.zgssearch || {}).userAgent = window.navigator.userAgent, zgssearch.isIE = -1 !== zgssearch.userAgent.indexOf("MSIE") || -1 !== zgssearch.userAgent.indexOf("Trident"), zgssearch.isLinux = -1 !== zgssearch.userAgent.indexOf("Linux") || -1 !== zgssearch.userAgent.indexOf("Linux"), zgssearch.isWindows = -1 !== zgssearch.userAgent.indexOf("Win") || -1 !== zgssearch.userAgent.indexOf("Win"), zgssearch.detectBrowser = function() {
                return -1 != (zgssearch.userAgent.indexOf("Opera") || zgssearch.userAgent.indexOf("OPR")) ? "Opera" : -1 != zgssearch.userAgent.indexOf("Edg") ? "Edge" : -1 != zgssearch.userAgent.indexOf("Chrome") ? "Chrome" : -1 != zgssearch.userAgent.indexOf("Safari") ? "Safari" : -1 != zgssearch.userAgent.indexOf("Firefox") ? "Firefox" : -1 != zgssearch.userAgent.indexOf("MSIE") || 1 == !!document.documentMode ? "IE" : "Unknown"
            }, zgssearch.detectBrowserVersion = function() {
                var tem, ua = zgssearch.userAgent,
                    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                return /trident/i.test(M[1]) ? {
                    name: "IE",
                    version: (tem = /\brv[ :]+(\d+)/g.exec(ua) || [])[1] || ""
                } : "Chrome" === M[1] && null != (tem = ua.match(/\b(OPR|Edge)\/(\d+)/)) ? {
                    name: tem[1].replace("OPR", "Opera"),
                    version: tem[2]
                } : (M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"], null != (tem = ua.match(/version\/(\d+)/i)) && M.splice(1, 1, tem[1]), {
                    name: M[0],
                    version: M[1]
                })
            }, zgssearch.ZSNetwork = {
                imageRenderer: {
                    renderImage: function(url, imgElem, callback) {
                        imgElem ? zgssearch.renderPhoto("", url, imgElem.class_name, imgElem.errorClass, imgElem.img_elem) : callback(url)
                    }
                },
                getSearchResultsForSSE: function(searchURL) {
                    zgssearch.eventSource = new EventSource(searchURL), zgssearch.eventSource.addEventListener("initial_Weightage", function(event) {
                        zgssearch.handleSearchResults("IWEIGHT", event.data)
                    }), zgssearch.eventSource.addEventListener("version", function(event) {
                        zgssearch.handleSearchResults("VERSION", event.data)
                    }), zgssearch.eventSource.addEventListener("result", function(event) {
                        zgssearch.handleSearchResults("RESULT", event.data)
                    }), zgssearch.eventSource.addEventListener("nlp_tracer", function(event) {
                        zgssearch.gsnlpsearch.storeNLPTracerData(event.data)
                    }), zgssearch.eventSource.addEventListener("weightage", function(event) {
                        zgssearch.handleSearchResults("WEIGHT", event.data)
                    }), zgssearch.eventSource.onmessage = function(event) {
                        zgssearch.network.removeEventSource(), zgssearch.handleSearchResults("CLOSE", event)
                    }, zgssearch.eventSource.onerror = function(event) {
                        zgssearch.network.removeEventSource(), zgssearch.handleSearchResults("ERROR", event)
                    }
                },
                abortOngoingCalls: function() {
                    zgssearch.abortXMLHTTPReq(zgssearch.xmlhttpReq), zgssearch.network.removeEventSource()
                },
                abortOngoingCalloutCalls: function() {
                    zgssearch.abortXMLHTTPReq(zgssearch.xmlhttpCalloutReq), zgssearch.network.removeEventSource()
                },
                abortOngoingAdvSearchCalls: function() {
                    zgssearch.abortXMLHTTPReq(zgssearch.advSearchXMLHttpReq), zgssearch.network.removeEventSource()
                },
                removeEventSource: function() {
                    void 0 !== zgssearch.eventSource && (zgssearch.eventSource.close(), zgssearch.eventSource = void 0)
                },
                xmlHttpReq: function(method, url, abort, callback) {
                    abort && zgssearch.abortXMLHTTPReq(zgssearch.xmlhttpReq), zgssearch.xmlhttpReq = zgssearch.getRequestObject(), zgssearch.xmlhttpReq.onreadystatechange = function(event) {
                        4 === zgssearch.xmlhttpReq.readyState && (200 === zgssearch.xmlhttpReq.status ? callback({
                            response: zgssearch.xmlhttpReq.responseText,
                            status: "success",
                            result: zgssearch.xmlhttpReq,
                            args: zgssearch.xmlhttpReq.args
                        }) : callback({
                            response: event,
                            status: "error",
                            result: zgssearch.xmlhttpReq,
                            args: zgssearch.xmlhttpReq.args
                        }))
                    }, zgssearch.xmlhttpReq.open(method, url, !0), zgssearch.xmlhttpReq.send()
                },
                uri: function(url_obj) {
                    if ("POST" !== url_obj.type) return window._jQueryGS.ajax(url_obj);
                    zgssearch.network.getCookie("CSRF_TOKEN", function(csrfParam) {
                        return url_obj.data = void 0 !== url_obj.data ? url_obj.data += "&" + GSConstant.csrfName + "=" + csrfParam : csrfParam, window._jQueryGS.ajax(url_obj)
                    })
                },
                download_file: function(parent) {
                    var iframe = document.createElement("iframe");
                    iframe.frameBorder = 0, iframe.id = "download_iframe", iframe.src = parent, iframe.style = "display:none";
                    parent = zgssearch.isPreviewOpenedInComponent ? "zgs20_pcSearch" : "zgs20_globalsearch";
                    document.getElementById(parent).appendChild(iframe), setTimeout(function() {
                        iframe.parentElement.removeChild(iframe)
                    }, 5e4)
                },
                getFingerPrintFilePath: function(filepath, folderPath) {
                    var filePrefix = "embeddashboards" === folderPath ? folderPath : zgssearch.GSConstant.BUILD_DATE,
                        filePrefix = window.location.protocol + "//" + zgssearch.GSConstant.STATIC_RESOURCE_SERVER + "/" + zgssearch.gscomponent.gsserver + "/" + filePrefix + "/";
                    return zgssearch.gscomponent.hasOwnProperty("isFingerprintEnabled") && zgssearch.gscomponent.isFingerprintEnabled && zgssearch.gscomponent.hasOwnProperty(filepath) ? "embeddashboards" === folderPath ? zgssearch.gsbuildDetails[filepath] : filePrefix + zgssearch.gsbuildDetails[filepath] : filePrefix + filepath
                },
                setIntegrityValue: function(domEle, checksumValue) {
                    domEle.setAttribute("integrity", checksumValue), domEle.setAttribute("crossorigin", "anonymous")
                },
                loadSRICSSFile: function(checksumValue, callback, folderPath) {
                    var fileURL, domCSS;
                    checksumValue && (domCSS = fileURL = "", -1 < checksumValue.indexOf("wmsbar") ? (fileURL = checksumValue, domCSS = wms_css_url_integrity || "") : fileURL = zgssearch.network.getFingerPrintFilePath(checksumValue, folderPath), checksumValue = zgssearch.gsbuildDetails.hasOwnProperty("checksums") && zgssearch.gsbuildDetails.checksums.hasOwnProperty(checksumValue) ? zgssearch.gsbuildDetails.checksums[checksumValue] : domCSS, (domCSS = document.createElement("link")).setAttribute("rel", "stylesheet"), domCSS.setAttribute("type", "text/css"), checksumValue && zgssearch.network.setIntegrityValue(domCSS, checksumValue), domCSS.setAttribute("href", fileURL), domCSS.onload = function() {
                        zgssearch.cssLoaded || (zgssearch.cssLoaded = !0), callback && callback()
                    }, document.getElementsByTagName("head").item(0).appendChild(domCSS))
                },
                loadSRIJSFile: function(checksumValue, callback, folderPath) {
                    var fileURL, scriptEle;
                    checksumValue && (scriptEle = fileURL = "", -1 < checksumValue.indexOf("wmsbar") ? (fileURL = checksumValue, scriptEle = wms_js_url_integrity || "") : fileURL = zgssearch.network.getFingerPrintFilePath(checksumValue, folderPath), scriptEle = -1 < checksumValue.indexOf("workdrive-components-v1") ? zgssearch.workdrive_component_integrity : scriptEle, checksumValue = zgssearch.gsbuildDetails.hasOwnProperty("checksums") && zgssearch.gsbuildDetails.checksums.hasOwnProperty(checksumValue) ? zgssearch.gsbuildDetails.checksums[checksumValue] : scriptEle, (scriptEle = document.createElement("script")).setAttribute("type", "text/javascript"), checksumValue && zgssearch.network.setIntegrityValue(scriptEle, checksumValue), scriptEle.setAttribute("src", fileURL), scriptEle.onload = function() {
                        callback && callback()
                    }, document.getElementsByTagName("head").item(0).appendChild(scriptEle))
                },
                loadSRIJSFileForFingerprintedURL: function(fileURL, callback) {
                    var checksumValue, scriptEle;
                    fileURL && (checksumValue = zgssearch.gsbuildDetails.hasOwnProperty("checksums") && zgssearch.gsbuildDetails.checksums.hasOwnProperty(fileURL) ? zgssearch.gsbuildDetails.checksums[fileURL] : "", (scriptEle = document.createElement("script")).setAttribute("type", "text/javascript"), checksumValue && "" != checksumValue && zgssearch.network.setIntegrityValue(scriptEle, checksumValue), fileURL = zgssearch.gsbuildDetails.hasOwnProperty(fileURL) && zgssearch.gsbuildDetails[fileURL], fileURL = window.location.protocol + "//" + zgssearch.GSConstant.STATIC_RESOURCE_SERVER + fileURL, scriptEle.setAttribute("src", fileURL), scriptEle.onload = function() {
                        callback && callback()
                    }, document.getElementsByTagName("head").item(0).appendChild(scriptEle))
                },
                loadCSSFile: function(fileURL, callback) {
                    var domCSS;
                    fileURL && ((domCSS = document.createElement("link")).setAttribute("rel", "stylesheet"), domCSS.setAttribute("type", "text/css"), domCSS.setAttribute("href", fileURL), domCSS.onload = function() {
                        zgssearch.cssLoaded || (zgssearch.cssLoaded = !0), callback && callback()
                    }, document.getElementsByTagName("head").item(0).appendChild(domCSS))
                },
                loadJSFile: function(fileURL, callback) {
                    var scriptEle = document.createElement("script");
                    scriptEle.setAttribute("type", "text/javascript"), scriptEle.setAttribute("src", fileURL), scriptEle.onload = function() {
                        callback && callback()
                    }, document.getElementsByTagName("head").item(0).appendChild(scriptEle)
                },
                getCookie: function(cname, callback) {
                    for (var name = cname + "=", ca = document.cookie.split(";"), i = 0; i < ca.length; i++) {
                        var c = ca[i].trim();
                        0 === c.indexOf(name) && callback(c.substring(name.length, c.length))
                    }
                }
            }, zgssearch.network = zgssearch.ZSNetwork, zgssearch.gscomponent = zgssearch.gscomponent || {}, zgssearch.GSConstant = zgssearch.GSConstant || {}, zgssearch.GSConstant.supportedZSLanguages = zgssearch.GSConstant.supportedZSLanguages || ["en", "ja", "zh", "baihui_en", "baihui_zh", "sd_IN", "fa_IR", "et_EE", "gu_IN", "ur_PK", "ko_KR", "km_KH", "ta_IN", "as_IN", "hi_IN", "el_GR", "fil-PH", "tr_TR", "sl_SI", "ja_JP", "az_Latn-AZ", "it_IT", "es_ES", "pa_IN", "lo_LA", "bg_BG", "da_DK", "ms_MY", "cs_CZ", "nb_NO", "bn_IN", "de_DE", "lt_LT", "nl_NL", "ca_ES", "mr_IN", "zh_CN", "sq_AL", "si_LK", "my_MM", "th_TH", "uk_UA", "he_IL", "sv_SE", "sr_Latn-RS", "hr_HR", "fi_FI", "pt_PT", "hu_HU", "eu_ES", "ro_RO", "lv_LV", "pt_BR", "ne_NP", "ar_EG", "mk_MK", "vi_VN", "kn_IN", "fr_FR", "jv", "te_IN", "ru_RU", "pl_PL", "ks_IN", "mai_IN", "ml_IN", "or_IN", "sat_IN", "brx_IN", "doi_IN", "kok_IN", "sd_IN", "mni_IN", "sa_IN"], zgssearch.GSConstant.rtlSupportedZSLanguages = zgssearch.GSConstant.rtlSupportedZSLanguages || ["ar_EG", "ur_PK", "fa_IR", "he_IL", "ks_IN"], zgssearch.getbd = "/zgssearch/getbd", zgssearch.isExtension = !1, zgssearch.thirdPartyCookieDisabled = !1, zgssearch.GSConstant.languageVsCountryObj = {
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
            }, zgssearch.console = window.console;
            var zsConsole = zgssearch.console;
            return zgssearch.throwClientError = function(errMsg, exception) {
                zsConsole.log("ZS: " + (errMsg = exception ? errMsg + " " + exception : errMsg))
            }, zgssearch.logTrace = function(ex) {
                zsConsole.log(ex)
            }, zgssearch.includes = function(target, array) {
                return String.prototype.includes ? array.includes(target) : -1 !== array.indexOf(target)
            }, zgssearch.assignObject = function(target, initObj) {
                return "function" != typeof Object.assign && (Object.assign = function(target) {
                    "use strict";
                    null == target && zgssearch.throwClientError("Cannot convert undefined or null to object"), target = Object(target);
                    for (var index = 1; index < arguments.length; index++) {
                        var source = arguments[index];
                        if (null != source)
                            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key])
                    }
                    return target
                }), Object.assign(target, initObj)
            }, zgssearch.initLoadZSFiles = function(initObj) {
                zgssearch.gsbuildDetails = zgssearch.jsonParse(initObj), zgssearch.loadZSFiles()
            }, zgssearch.initZGSHandler = function(initObj) {
                var suiteScopeName;
                !!window.hasOwnProperty("ZSLite") && window.ZSLite ? window.ZSLite && (window.hasOwnProperty("openZiaAPIHandler") || window.hasOwnProperty("openZSHandler")) && (suiteScopeName = window.hasOwnProperty("openZiaAPIHandler") ? "openZiaAPIHandler" : "openZSHandler", zgssearch.serviceSearch = function(service, query, filterObj) {
                    window.hasOwnProperty("openZiaAPIHandler") ? window[suiteScopeName]("zgssearch.serviceSearch", [service, query, filterObj]) : window[suiteScopeName]([service, query, filterObj])
                }, zgssearch.helpSearch = function(query, appToSearch, categType) {
                    window.hasOwnProperty("openZiaAPIHandler") ? window[suiteScopeName]("zgssearch.helpSearch", [query, appToSearch, categType]) : window[suiteScopeName]([query, appToSearch, categType])
                }, zgssearch.open = function() {
                    window.hasOwnProperty("openZiaAPIHandler") ? window[suiteScopeName]("zgssearch.open") : window[suiteScopeName]()
                }, zgssearch.search = function(query) {
                    window.hasOwnProperty("openZiaAPIHandler") ? window[suiteScopeName]("zgssearch.search", [query]) : window[suiteScopeName]([query])
                }, zgssearch.advancedSearch = function(paramObj) {
                    window.hasOwnProperty("openZiaAPIHandler") ? window[suiteScopeName]("zgssearch.advancedSearch", [paramObj]) : window[suiteScopeName]([paramObj])
                }) : ((initObj = initObj || {}) && (null != initObj.thirdPartyCookieDisabled && (zgssearch.thirdPartyCookieDisabled = initObj.thirdPartyCookieDisabled), initObj.network && (zgssearch.network = initObj.network), initObj.source && "extension" === initObj.source && (zgssearch.isExtension = !0)), (initObj = zgssearch.assignObject(initObj, zgssearch.gsbuildDetails)).gsrebrand = initObj.hasOwnProperty("gsrebrand") ? initObj.gsrebrand : "undefined" != typeof WebMessanger && WebMessanger.rebrand || "", initObj.gslanguage = initObj.hasOwnProperty("gslanguage") ? initObj.gslanguage : "undefined" != typeof WebMessanger && WebMessanger.language || "", initObj.gscountry = initObj.hasOwnProperty("gscountry") ? initObj.gscountry : "undefined" != typeof WebMessanger && WebMessanger.countrycode || "", zgssearch.gscomponent = zgssearch.assignObject(zgssearch.gscomponent, initObj), initObj.hasOwnProperty("getbdDataObtained") || initObj.hasOwnProperty("isFingerprintEnabled") ? zgssearch.initLoadZSFiles(initObj) : zgssearch.getBuildDetails())
            }, zgssearch.jsonParse = function(data) {
                try {
                    if ("string" == typeof data) return JSON.parse(data)
                } catch (ex) {
                    zgssearch.throwClientError("Error while parsing json data", ex)
                }
                return data
            }, zgssearch.abortXMLHTTPReq = function(httpReq) {
                httpReq && httpReq.abort()
            }, zgssearch.getRequestObject = function() {
                try {
                    return new XMLHttpRequest
                } catch (ex) {
                    throw zgssearch.throwClientError("Unable to create XML Http Object for Ajax Request.", ex), ex
                }
            }, zgssearch.getBuildDetails = function() {
                zgssearch.network.xmlHttpReq("GET", zgssearch.getbd, !0, function(result) {
                    result && result.status && "error" != result.status && zgssearch.initLoadZSFiles(result.response)
                })
            }, zgssearch.setGSConstantObj = function(jsonObj) {
                for (var propt in jsonObj) zgssearch.GSConstant[propt] = jsonObj[propt]
            }, zgssearch.checkAndloadFontAndJqueryFile = function() {
                var userLanguage = zgssearch.getCurrentLanguage();
                "mni_IN" === userLanguage && (zgssearch.isLinux || zgssearch.isWindows) || "sat_IN" === userLanguage && zgssearch.isLinux ? zgssearch.network.loadSRICSSFile("css/" + ("mni_IN" === userLanguage ? "manipurifont" : "santhalifont") + ".css", zgssearch.loadJQueryFile) : zgssearch.loadJQueryFile()
            }, zgssearch.loadGSFile = function() {
                zgssearch.cssLoaded ? zgssearch.checkAndloadFontAndJqueryFile() : zgssearch.network.loadSRICSSFile(zgssearch.GSConstant.resultNewCSSURL, zgssearch.checkAndloadFontAndJqueryFile)
            }, zgssearch.loadJQueryFile = function() {
                var ZSJqueryCoreExists = !!window.hasOwnProperty("ZSJqueryCoreObj") && "3.6.0" === window.ZSJqueryCoreObj.version;
                "undefined" != typeof jQuery && "3.6.0" === jQuery().jquery || ZSJqueryCoreExists ? (window._jQueryGS = ZSJqueryCoreExists ? window.ZSJqueryCoreObj.scope : jQuery, window.jQuery = void 0 === window.jQuery ? jQuery : window.jQuery, zgssearch.loadI18NJSFile(!0)) : zgssearch.network.loadSRIJSFile(zgssearch.GSConstant.gsjQueryURL, zgssearch.loadI18NJSFile)
            }, zgssearch.loadI18NJSFile = function(zsJquery) {
                zsJquery || (zsJquery = jQuery, window._jQueryGS = zsJquery.noConflict(!0), window.jQuery = void 0 === window.jQuery ? zsJquery : window.jQuery, window.ZSJqueryCoreObj = {
                    scope: window._jQueryGS,
                    version: "3.6.0"
                }), zgssearch.network.loadSRIJSFile(zgssearch.GSConstant.gsi18NJSURL, zgssearch.loadResultJsFiles)
            }, zgssearch.loadResultJsFiles = function() {
                zgssearch.network.loadSRIJSFile(zgssearch.GSConstant.resultNewJSURL)
            }, zgssearch.getCurrentLanguage = function() {
                var ulanguage = zgssearch.gscomponent.gslanguage || "en",
                    ucountry = zgssearch.gscomponent.gscountry || "",
                    urebrand = "baihui" == (urebrand = zgssearch.gscomponent.gsrebrand) ? urebrand : "";
                if (-1 === zgssearch.GSConstant.supportedZSLanguages.indexOf(ulanguage))
                    if (zgssearch.GSConstant.languageVsCountryObj.hasOwnProperty(ulanguage)) {
                        var supportedRegions = zgssearch.GSConstant.languageVsCountryObj[ulanguage],
                            supportedRegionSize = supportedRegions.length;
                        if (1 < supportedRegionSize)
                            for (var i = 0; i < supportedRegionSize; i++) {
                                var eachLangcountry = supportedRegions[i];
                                if ("" === ucountry) {
                                    ulanguage = supportedRegions[0];
                                    break
                                }
                                var langCountry = "" !== ucountry ? ulanguage + "_" + ucountry : ulanguage;
                                eachLangcountry.lowerCase() === langCountry && (ulanguage = eachLangcountry[0])
                            } else ulanguage = supportedRegions[0]
                    } else ulanguage = "en";
                return (urebrand ? urebrand + "_" : "") + ulanguage
            }, zgssearch.getLanguageFileName = function() {
                return "js/" + zgssearch.getCurrentLanguage() + ".js"
            }, zgssearch.loadZSFiles = function() {
                var gsbuildObj = zgssearch.gsbuildDetails || {};
                gsbuildObj.BUILD_DATE && (gsbuildObj.gslanguage = gsbuildObj.gslanguage || zgssearch.gscomponent.gslanguage, gsbuildObj.gscountry = gsbuildObj.gscountry || zgssearch.gscomponent.gscountry, gsbuildObj.gsserver = gsbuildObj.gsserver || "zohosearch", zgssearch.gscomponent = Object.assign(zgssearch.gscomponent, gsbuildObj), zgssearch.GSConstant.BUILD_DATE = zgssearch.gscomponent.BUILD_DATE, zgssearch.GSConstant.STATIC_RESOURCE_SERVER = zgssearch.gscomponent.STATIC_RESOURCE_SERVER, gsbuildObj.gsjQueryURL = "js/jquery-3.6.0.min.js", gsbuildObj.gsi18NJSURL = zgssearch.getLanguageFileName(), gsbuildObj.resultNewJSURL = 1 === zgssearch.gscomponent.UIType ? "js/zsresult.js" : "js/gsresult.js", gsbuildObj.resultNewCSSURL = 1 === zgssearch.gscomponent.UIType ? "css/zsresult.css" : zgssearch.isExtension ? "css/extresult.css" : "css/gsresult.css", zgssearch.setGSConstantObj(gsbuildObj), zgssearch.loadGSFile())
            }, zgssearch.loadWMSFiles = function() {
                zgssearch.network.loadSRICSSFile(wms_css_url, zgssearch.loadWMSJSFile)
            }, zgssearch.loadWMSJSFile = function() {
                zgssearch.network.loadSRIJSFile(wms_js_url, zgssearch.registerWMS)
            }, zgssearch.registerWMS = function() {
                var intervalStartTime = (new Date).getTime(),
                    wmsInit = setInterval(function() {
                        var settings;
                        6e4 < (new Date).getTime() - intervalStartTime ? clearInterval(wmsInit) : "undefined" != typeof WebMessanger && (clearInterval(wmsInit), WebMessanger.setClientSRIValues(wms_all_sri_values), WebMessanger.setNoDomainChange(), rebrandName && null !== rebrandName && "null" !== rebrandName && (WebMessanger.setRebrand(rebrandName), WebMessanger.setIamServer(iamServer), WebMessanger.setChatServer(chat_server_url), WebMessanger.setPhotoServer(contacts_server_url), WebMessanger.setMeetingUrl(meeting_server_url)), WebMessanger.setLocale(user_info.language, user_info.country), settings = WMSSessionConfig.CHAT | WMSSessionConfig.CHAT_PRESENCE | WMSSessionConfig.PRESENCE_PERSONAL | WMSSessionConfig.CROSS_PRD | WMSSessionConfig.MP, WebMessanger.setConfig(settings), "rtl" === getComputedStyle(document.body).direction && WebMessanger.enableRTLMode(), WebMessanger.registerZuid("SE", user_info.zuid, user_info.primary_email, zgssearch.isWMSSilentMode))
                    }, 200)
            }, zgssearch
        }(void 0);
    window.zgssearch = zgssearch
}(window);
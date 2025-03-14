var WebRTCUserMedia = {};
WebRTCUserMedia = function() {
    var e = void 0 !== navigator.mediaDevices && void 0 !== navigator.mediaDevices.getUserMedia,
        t = e && void 0 !== navigator.mediaDevices.getDisplayMedia,
        i = e && void 0 !== navigator.permissions && "function" == typeof navigator.permissions.query,
        n = e && void 0 !== window.MediaRecorder && "function" == typeof window.MediaRecorder;
    if (!e) return {
        isSupported: function() {
            return e
        },
        isScreenShareSupportedInNative: function() {
            return t && !_isZCDesktopApp()
        },
        isDisplayMediaSupported: function() {
            return t
        }
    };
    var a = {};
    navigator.mediaDevices.getSupportedConstraints && (a = navigator.mediaDevices.getSupportedConstraints());
    var s = {},
        o = {
            1: null,
            2: null,
            3: null,
            4: null
        },
        r = {
            AUDIO_ONLY: 1,
            VIDEO_ONLY: 2,
            AUDIO_VIDEO: 3,
            SCREEN: 4
        },
        d = {
            1: "audio",
            2: "video",
            3: "audiovideo",
            4: "video"
        },
        c = {
            audio: 1,
            video: 2,
            audiovideo: 3
        },
        l = {
            NotAllowedError: "NotAllowedError",
            NotFoundError: "NotFoundError",
            NotReadableError: "NotReadableError",
            AbortError: "AbortError",
            BadAudioTrackError: "BadAudioTrackError",
            OverconstrainedError: "OverconstrainedError"
        },
        u = function(e, t) {
            return s[e] ? s[e][t] : void 0
        },
        p = function(e, t) {
            var i = t._getType();
            void 0 === s[e] && (s[e] = {}), s[e][i] = t
        },
        f = function(e, t) {
            var i = {};
            return t !== r.AUDIO_ONLY && t !== r.AUDIO_VIDEO || !e._isPrimaryAudioTrackMuted() || (i.name = l.BadAudioTrackError), i
        },
        m = function(e, t, i, n, a, s, d, c, l) {
            var m = d ? u(c, e) : o[e];
            if (m) t(m);
            else {
                var C = S(e, n);
                (a ? navigator.mediaDevices.getDisplayMedia : navigator.mediaDevices.getUserMedia).call(navigator.mediaDevices, C).then((function(n) {
                    function a(e, t) {
                        t._isModuleInstance() ? h(t._getModuleInstanceId(), t._getType()) : I(t._getType()), "function" == typeof i && i(e, t._getType())
                    }
                    var u = d && c;
                    u && n._setAsModuleInstance(c), n._setType(e), v(n, l, (function(i) {
                        if (i._setType(e), u ? (i._setAsModuleInstance(c), p(c, i)) : o[e] = i, r.SCREEN === e) {
                            if ("function" == typeof s) {
                                var n = i._getPrimaryVideoTrack();
                                n && (n.onended = s)
                            }
                        } else if (void 0 !== MediaHandler) {
                            var d = i._hasSourceAudioStream() ? i._getSourceAudioStream()._getPrimaryAudioTrack() : i._getPrimaryAudioTrack();
                            d && (d.onended = function(e) {
                                MediaHandler.streamEvents.onEnded(e, this)
                            });
                            var l = i._hasSourceVideoStream() ? i._getSourceVideoStream()._getPrimaryVideoTrack() : i._getPrimaryVideoTrack();
                            l && (l.onended = function(e) {
                                MediaHandler.streamEvents.onEnded(e, this)
                            })
                        }
                        var m = f(i, e);
                        $WC.Util.isEmptyObject(m) ? t(i) : a(m, i)
                    }), a)
                })).catch((function(t) {
                    "function" == typeof i && i(t, e)
                }))
            }
        },
        v = function(e, t = {}, i, n) {
            var a = function(e) {
                t.audio && e._hasAudioTrack() && !e._hasSourceAudioStream() && MediaUtil.isNoiseCancellationSupported() ? ZCAudioProcessor.processAudioStream(e, t.audio, i, i) : i(e)
            };
            t.video && MLBackgroundProcessor.isInitialized() ? MLBackgroundProcessor.processStream(e, t.video, a, n) : a(e)
        },
        C = function(e, t) {
            navigator.mediaDevices.enumerateDevices().then((function(t) {
                ! function(e) {
                    for (var t = 0; t < e.length; t++) {
                        var i = e[t];
                        ZCMediaDevices.isDefaultDeviceId(i.deviceId) && !i.label.toLowerCase().includes("default") && Object.defineProperty(i, "label", {
                            value: "Default - " + i.label,
                            writable: !1
                        })
                    }
                }(t), "function" == typeof e && e(t)
            })).catch((function(e) {
                "function" == typeof t && t(e)
            }))
        },
        _ = function(e, t) {
            C((function(t) {
                void 0 !== ZCMediaDevices && ZCMediaDevices.update(t), "function" == typeof e && e(t)
            }), (function(e) {
                void 0 !== ZCMediaDevices && ZCMediaDevices.update([]), "function" == typeof t && t(e)
            }))
        },
        g = function(e, t, i) {
            navigator.permissions.query({
                name: e
            }).then((function(e) {
                "function" == typeof t && t(e.state)
            })).catch((function(e) {
                "function" == typeof i && i(e)
            }))
        },
        h = function(e, t) {
            var i = u(e, t);
            i && (i._close(), delete s[e][t])
        },
        I = function(e) {
            var t = o[e];
            t ? (t._close(), o[e] = null) : o[e] = null
        },
        S = function(e, t) {
            var i = {},
                n = !0,
                s = !0;
            if (e !== r.SCREEN && a["deviceId"] && void 0 !== ZCMediaDevices) {
                var o = ZCMediaDevices.getPreferredDevices(),
                    d = o[ZCMediaDevices.kinds.AUDIO_INPUT],
                    c = o[ZCMediaDevices.kinds.VIDEO_INPUT];
                d && (n = {
                    deviceId: {
                        exact: d.deviceId
                    }
                }), c && (s = {
                    deviceId: {
                        exact: c.deviceId
                    }
                })
            }
            switch (i = ZCJQuery.extend(!0, {}, {
                audio: n,
                video: s
            }, t), e) {
                case r.AUDIO_ONLY:
                    i.video = !1;
                    break;
                case r.VIDEO_ONLY:
                    i.audio = !1;
                    break;
                case r.SCREEN:
                    void 0 !== t && void 0 !== t.audio || (i.audio = !1)
            }
            return i
        };
    return navigator.mediaDevices.enumerateDevices ? (_(), {
        streamTypes: r,
        errors: l,
        streamInstanceIds: {
            livefeed_video: "LIVEFEED_VIDEO",
            video_effects_preview: "VIDEO_EFFECTS_PREVIEW",
            settings_video_effects_preview: "SETTINGS_VIDEO_EFFECTS_PREVIEW",
            settings_mic_tester_preview: "SETTINGS_MIC_TESTER_PREVIEW"
        },
        createStreamFromCanvas: function(e, t) {
            var i = WebRTCUserMedia.streamTypes.SCREEN,
                n = e.captureStream(t);
            return n._setType(i), null !== o[i] && o[i]._close(), o[i] = n, n
        },
        isSupported: function() {
            return e
        },
        isScreenShareSupportedInNative: function() {
            return t && !_isZCDesktopApp()
        },
        isSetSinkIdSupported: function() {
            return "undefined" != typeof $ZCUtil && !$ZCUtil.Browser.isFirefox() && !$ZCUtil.Browser.isSafari()
        },
        isDisplayMediaSupported: function() {
            return t
        },
        isPermissionQuerySupported: function() {
            return i && ($ZCUtil.Browser.isChrome() || $ZCUtil.Browser.isOpera() || $ZCUtil.Browser.isEdge())
        },
        isMediaRecorderSupported: function() {
            return n
        },
        isSetBitRateSupported: function() {
            return void 0 !== window.RTCRtpSender && "function" == typeof window.RTCRtpSender.prototype.getParameters
        },
        isIcePrebindingSupported: function() {
            return "undefined" != typeof $ZCUtil && !$ZCUtil.Browser.isFirefox()
        },
        isAudioStreamType: function(e) {
            return this.streamTypes.AUDIO_ONLY === e
        },
        isVideoStreamType: function(e) {
            return this.streamTypes.VIDEO_ONLY === e
        },
        isAudioVideoStreamType: function(e) {
            return this.streamTypes.AUDIO_VIDEO === e
        },
        isScreenStreamType: function(e) {
            return this.streamTypes.SCREEN === e
        },
        getStreamTypeInString: function(e) {
            return function(e) {
                return d[e]
            }(e)
        },
        getStreamTypesInInt: function(e) {
            return function(e) {
                return c[e]
            }(e)
        },
        getStream: function(e) {
            return o[e]
        },
        getMediaDevices: function(e, t) {
            _(e, t)
        },
        getRawMediaDevices: function(e, t) {
            C(e, t)
        },
        getAudioPermission: function(e, t) {
            g(ZCMediaConstants.mediaDevices.MICROPHONE, e, t)
        },
        getVideoPermission: function(e, t) {
            g(ZCMediaConstants.mediaDevices.CAMERA, e, t)
        },
        requestAudioStream: function(e, t, i, n) {
            m(this.streamTypes.AUDIO_ONLY, e, t, i, !1, void 0, !1, void 0, n)
        },
        requestVideoStream: function(e, t, i, n) {
            m(this.streamTypes.VIDEO_ONLY, e, t, i, !1, void 0, !1, void 0, n)
        },
        requestAudioVideoStream: function(e, t, i, n) {
            m(this.streamTypes.AUDIO_VIDEO, e, t, i, !1, void 0, !1, void 0, n)
        },
        requestAudioVideoOrAudioStream: function(e, t, i) {
            var n = function(n, a) {
                n.name !== this.errors.NotAllowedError ? m(this.streamTypes.AUDIO_ONLY, e, t, i, !1, void 0, !1, void 0) : "function" == typeof t && t(n, a)
            }.bind(this);
            m(this.streamTypes.AUDIO_VIDEO, e, n, i, !1, void 0, !1, void 0)
        },
        requestScreenStream: function(e, t, i, n, a, s, o) {
            var r = $ZCUtil.Browser.isChrome();
            if (r || $ZCUtil.Browser.isSafari() || $ZCUtil.Browser.isOpera())
                if (this.isScreenShareSupportedInNative()) {
                    var d = {
                        video: !0
                    };
                    o && r ? (d.audio = !0, n && n.audio && (d.audio = n.audio)) : n && (n.audio = !1), m(this.streamTypes.SCREEN, e, t, ZCJQuery.extend(!0, {}, n, d), !0, i, a, s)
                } else _isZCDesktopApp() && !MediacallScreenRequestHandler.isInitialized() && MediacallScreenRequestHandler.init(), ScreenShare.Extension.getSourceId(function(r) {
                    var d = {
                        audio: !1,
                        video: {
                            mandatory: {
                                chromeMediaSource: "desktop",
                                chromeMediaSourceId: r
                            }
                        }
                    };
                    _isZCDesktopApp() && $ZCUtil.isWindowsOs() && r.startsWith("screen") && o && MediacallScreenRequestHandler.isSystemAudioAllowedInSS() && (d = {
                        video: {
                            mandatory: {
                                chromeMediaSource: "desktop"
                            }
                        }
                    }), m(this.streamTypes.SCREEN, e, t, ZCJQuery.extend(!0, {}, n, d), !1, i, a, s)
                }.bind(this), o);
            else {
                m(this.streamTypes.SCREEN, e, t, ZCJQuery.extend(!0, {}, n, {
                    audio: !1,
                    video: {
                        mediaSource: "screen"
                    }
                }), !1, i, a, s)
            }
        },
        requestAndAddTrackInStream: function(e, t, i, n, a) {
            var s = e._getType();
            if (!this.isScreenStreamType(s))
                if (this.isAudioStreamType(t)) {
                    var r = e._hasVideoTrack() ? this.streamTypes.AUDIO_VIDEO : this.streamTypes.AUDIO_ONLY;
                    if (!e._hasAudioTrack() && null === o[r]) {
                        var d = null === o[this.streamTypes.AUDIO_ONLY],
                            c = function(t) {
                                e._addPrimaryAudioTrack(t._getPrimaryAudioTrack(), r), t._hasSourceAudioStream() && e._setSourceAudioStream(t._getSourceAudioStream()), o[r] = e, o[s] = null, d && (o[this.streamTypes.AUDIO_ONLY] = null), "function" == typeof i && i(e)
                            }.bind(this);
                        this.requestAudioStream(c, n, void 0, a)
                    }
                } else if (this.isVideoStreamType(t)) {
                r = e._hasAudioTrack() ? this.streamTypes.AUDIO_VIDEO : this.streamTypes.VIDEO_ONLY;
                if (!e._hasVideoTrack() && null === o[r]) {
                    d = null === o[this.streamTypes.VIDEO_ONLY], c = function(t) {
                        e._addPrimaryVideoTrack(t._getPrimaryVideoTrack(), r), t._hasBackgroundProcessor() && (e._setBackgroundProcessor(t._backgroundProcessor), e._setSourceVideoStream(t._getSourceVideoStream())), o[r] = e, o[s] = null, d && (o[this.streamTypes.VIDEO_ONLY] = null), "function" == typeof i && i(e)
                    }.bind(this);
                    this.requestVideoStream(c, n, void 0, a)
                }
            }
        },
        requestAndReplaceTracksInStream: function(e, t, i, n, a, s) {
            var r = function(t) {
                t._setConnectionRestrictionStatus(e), "function" == typeof i && i(t)
            };
            if (this.isAudioVideoStreamType(t)) e._hasAudioTrack() && e._hasVideoTrack() && (this.closeStream(e._getType(), !0), this.requestAudioVideoStream(r, n, a, s));
            else if (this.isAudioStreamType(t)) {
                if (e._hasAudioTrack())
                    if (e._hasVideoTrack()) {
                        var d = null === o[this.streamTypes.AUDIO_ONLY],
                            c = function(t) {
                                e._replacePrimaryAudioTrack(t._getPrimaryAudioTrack()), t._hasSourceAudioStream() && e._setSourceAudioStream(t._getSourceAudioStream()), d && (o[this.streamTypes.AUDIO_ONLY] = null), "function" == typeof i && i(e)
                            }.bind(this);
                        this.requestAudioStream(c, n, a, s)
                    } else this.closeStream(e._getType(), !0), this.requestAudioStream(r, n, a, s)
            } else if (this.isVideoStreamType(t) && e._hasVideoTrack())
                if (e._hasAudioTrack()) {
                    d = null === o[this.streamTypes.VIDEO_ONLY], c = function(t) {
                        e._replacePrimaryVideoTrack(t._getPrimaryVideoTrack()), t._hasBackgroundProcessor() && (e._setBackgroundProcessor(t._backgroundProcessor), e._setSourceVideoStream(t._getSourceVideoStream())), d && (o[this.streamTypes.VIDEO_ONLY] = null), "function" == typeof i && i(e)
                    }.bind(this);
                    this.requestVideoStream(c, n, a, s)
                } else this.closeStream(e._getType(), !0), this.requestVideoStream(r, n, a, s)
        },
        removeTracksInStream: function(e, t, i, n) {
            var a = e._getType();
            this.isAudioVideoStreamType(a) ? (this.isAudioStreamType(t) ? (e._removePrimaryAudioTrack(), e._setType(this.streamTypes.VIDEO_ONLY), o[this.streamTypes.VIDEO_ONLY] = e, o[a] = null) : this.isVideoStreamType(t) && (e._removePrimaryVideoTrack(), e._setType(this.streamTypes.AUDIO_ONLY), o[this.streamTypes.AUDIO_ONLY] = e, o[a] = null), "function" == typeof i && i(e)) : "function" == typeof n && n()
        },
        splitTracksInStream: function(e) {
            if (e && e._hasAudioTrack() && e._hasVideoTrack()) {
                var t = e._getType(),
                    i = void 0,
                    n = void 0;
                return i = new MediaStream([e._getPrimaryAudioTrack()]), e._hasSourceAudioStream() && i._setSourceAudioStream(e._getSourceAudioStream()), i._setType(this.streamTypes.AUDIO_ONLY), i._setConnectionRestrictionStatus(e), o[this.streamTypes.AUDIO_ONLY] = i, n = new MediaStream([e._getPrimaryVideoTrack()]), e._hasBackgroundProcessor() && (n._setBackgroundProcessor(e._backgroundProcessor), n._setSourceVideoStream(e._getSourceVideoStream())), n._setType(this.streamTypes.VIDEO_ONLY), n._setConnectionRestrictionStatus(e), o[this.streamTypes.VIDEO_ONLY] = n, o[t] = null, {
                    audioStream: i,
                    videoStream: n
                }
            }
        },
        requestNewStreamInstance: function(e, t, i, n, a, s) {
            m(t, i, n, a, !1, void 0, !0, e, s)
        },
        updateAndGetProcessedStream: function(e, t) {
            return function(e, t) {
                var i = t.getStream().getTracks(),
                    n = e._getType();
                t.audio && (i = i.concat(t.audio));
                var a = new MediaStream(i);
                if (a._setBackgroundProcessor(t), a._setSourceVideoStream(e), a._setType(n), e._hasSourceAudioStream() && a._setSourceAudioStream(e._getSourceAudioStream()), a._setConnectionRestrictionStatus(e), e._isModuleInstance()) {
                    var s = e._getModuleInstanceId();
                    a._setAsModuleInstance(s), p(s, a)
                } else o[n] = a;
                return a
            }(e, t)
        },
        updateAndGetProcessedAudioStream: function(e, t) {
            var i = t.getAudioTracks(),
                n = e._getType();
            e._hasVideoTrack() && (i = i.concat(e.getVideoTracks()));
            var a = new MediaStream(i);
            if (a._setSourceAudioStream(e), a._setType(n), e._hasSourceVideoStream() && a._setSourceVideoStream(e._getSourceVideoStream()), a._setConnectionRestrictionStatus(e), e._hasBackgroundProcessor() && a._setBackgroundProcessor(e._getBackgroundProcessor()), e._isModuleInstance()) {
                var s = e._getModuleInstanceId();
                a._setAsModuleInstance(s), p(s, a)
            } else o[n] = a;
            return a
        },
        closeStreamInstance: function(e, t) {
            h(e, t)
        },
        closeStream: function(e) {
            I(e)
        },
        closeAllStreams: function() {
            for (var e in o) I(e)
        }
    }) : Promise.reject(new Error("enumerateDevices is not implemented in this browser"))
}(), "undefined" != typeof MediaStream && (MediaStream.prototype._getSrcUrl = function() {
    return (window.URL || window.webkitURL).createObjectURL(this)
}, MediaStream.prototype._setType = function(e) {
    this._type = e
}, MediaStream.prototype._getType = function() {
    return this._type
}, MediaStream.prototype._setConnectionRestrictionForAudio = function() {
    this._audioRestrictedForConnection = !0, this._detectSpeech()
}, MediaStream.prototype._resetConnectionRestrictionForAudio = function() {
    this._audioRestrictedForConnection = !1
}, MediaStream.prototype._isAudioRestrictedForConnection = function() {
    return this._audioRestrictedForConnection
}, MediaStream.prototype._setConnectionRestrictionStatus = function(e) {
    e && (this._audioRestrictedForConnection = e._audioRestrictedForConnection)
}, MediaStream.prototype._getPrimaryAudioTrack = function() {
    return this.getAudioTracks()[0]
}, MediaStream.prototype._getPrimaryVideoTrack = function() {
    return this.getVideoTracks()[0]
}, MediaStream.prototype._getSourceAudioTrackId = function() {
    var e = this._hasSourceAudioStream() ? this._getSourceAudioStream() : this;
    return e._hasAudioTrack() ? e._getPrimaryAudioTrack().id : void 0
}, MediaStream.prototype._addPrimaryAudioTrack = function(e, t) {
    this._hasAudioTrack() || "audio" !== e.kind || (this.addTrack(e), this._setType(t))
}, MediaStream.prototype._addPrimaryVideoTrack = function(e, t) {
    this._hasVideoTrack() || "video" !== e.kind || (this.addTrack(e), this._setType(t))
}, MediaStream.prototype._isPrimaryAudioTrackMuted = function() {
    var e = this._getPrimaryAudioTrack();
    return !e || e.muted
}, MediaStream.prototype._isPrimaryVideoTrackMuted = function() {
    var e = this._getPrimaryVideoTrack();
    return !e || e.muted
}, MediaStream.prototype._replacePrimaryAudioTrack = function(e) {
    if (this._hasAudioTrack() && "audio" === e.kind) {
        var t = this._getPrimaryAudioTrack();
        t.id !== e.id && (t.stop(), this.removeTrack(t), this.addTrack(e))
    }
}, MediaStream.prototype._replacePrimaryVideoTrack = function(e) {
    if (this._hasVideoTrack() && "video" === e.kind) {
        var t = this._getPrimaryVideoTrack();
        t.id !== e.id && (t.stop(), this.removeTrack(t), this.addTrack(e))
    }
}, MediaStream.prototype._removePrimaryAudioTrack = function() {
    if (this._hasAudioTrack()) {
        var e = this._getPrimaryAudioTrack();
        e.stop(), this.removeTrack(e)
    }
    this._hasSourceAudioStream() && this._getSourceAudioStream()._removePrimaryAudioTrack()
}, MediaStream.prototype._removePrimaryVideoTrack = function() {
    if (this._hasVideoTrack()) {
        var e = this._getPrimaryVideoTrack();
        e.stop(), this.removeTrack(e)
    }
    this._hasBackgroundProcessor() && this._hasSourceVideoStream() && (this._stopBackgroundProcessor(), this._getSourceVideoStream()._removePrimaryVideoTrack())
}, MediaStream.prototype._hasAudioTrack = function() {
    return this._getPrimaryAudioTrack() instanceof MediaStreamTrack
}, MediaStream.prototype._hasVideoTrack = function() {
    return this._getPrimaryVideoTrack() instanceof MediaStreamTrack
}, MediaStream.prototype._getAudioDeviceId = function() {
    var e = this._hasSourceAudioStream() ? this._getSourceAudioStream()._getPrimaryAudioTrack() : this._getPrimaryAudioTrack();
    if (e) return e.getSettings().deviceId
}, MediaStream.prototype._getVideoDeviceId = function() {
    var e = this._hasSourceVideoStream() ? this._getSourceVideoStream()._getPrimaryVideoTrack() : this._getPrimaryVideoTrack();
    if (e) return e.getSettings().deviceId
}, MediaStream.prototype._getAudioDeviceLabel = function() {
    var e = this._hasSourceAudioStream() ? this._getSourceAudioStream()._getPrimaryAudioTrack() : this._getPrimaryAudioTrack();
    if (e) return e.label
}, MediaStream.prototype._getVideoDeviceLabel = function() {
    var e = this._hasSourceVideoStream() ? this._getSourceVideoStream()._getPrimaryVideoTrack() : this._getPrimaryVideoTrack();
    if (e) return e.label
}, MediaStream.prototype._getVideoSize = function() {
    var e = this._hasSourceVideoStream() ? this._getSourceVideoStream()._getPrimaryVideoTrack() : this._getPrimaryVideoTrack(),
        t = {
            width: 0,
            height: 0
        };
    if (e) {
        var i = e.getSettings();
        i.width && (t.width = i.width), i.height && (t.height = i.height)
    }
    return t
}, MediaStream.prototype.getAspectRatio = function() {
    var e = 0,
        t = this._getVideoSize();
    return t.width && t.height && (e = t.width / t.height), e
}, MediaStream.prototype._disableAudioTrack = function() {
    var e = this._getPrimaryAudioTrack();
    return !!e && (e.enabled = !1, !0)
}, MediaStream.prototype._enableAudioTrack = function() {
    var e = this._getPrimaryAudioTrack();
    return !!e && (e.enabled = !0, !0)
}, MediaStream.prototype._disableVideoTrack = function() {
    var e = this._getPrimaryVideoTrack();
    return !!e && (e.enabled = !1, !0)
}, MediaStream.prototype._enableVideoTrack = function() {
    var e = this._getPrimaryVideoTrack();
    return !!e && (e.enabled = !0, !0)
}, MediaStream.prototype._setTrackStatus = function(e, t) {
    "audio" === e ? this._setAudioTrackStatus(t) : this._setVideoTrackStatus(t)
}, MediaStream.prototype._setAudioTrackStatus = function(e) {
    e ? this._disableAudioTrack() : this._enableAudioTrack()
}, MediaStream.prototype._setVideoTrackStatus = function(e) {
    e ? this._disableVideoTrack() : this._enableVideoTrack()
}, MediaStream.prototype._isAudioTrackEnabled = function() {
    var e = this._getPrimaryAudioTrack();
    return !!e && e.enabled
}, MediaStream.prototype._isVideoTrackEnabled = function() {
    var e = this._getPrimaryVideoTrack();
    return !!e && e.enabled
}, MediaStream.prototype._getScoreForSpeech = function() {
    var e = 0,
        t = this._audioFrequencyData;
    if (t.length > 0) {
        var i = t.reduce((function(e, t) {
            return e + t
        })) / t.length;
        t.forEach((function(t) {
            t > 127 && t > i && e++
        }))
    }
    return e
}, MediaStream.prototype._detectSpeech = function() {
    this._isDetectingSpeech || (this._isDetectingSpeech = !0, this._audioFrequencyData = [], this._startAudioFrequencyAnalyser(function(e, t) {
        this._audioFrequencyData.push(e), this._audioFrequencyData.length > 180 && this._audioFrequencyData.shift();
        var i = this._isAudioRestrictedForConnection();
        return i || (this._isDetectingSpeech = !1, clearInterval(this._speechDetectionInterval)), i
    }.bind(this)), this._speechDetectionInterval = setInterval(function() {
        var e = this._getScoreForSpeech();
        e && e > 60 && void 0 !== MediaHandler && MediaHandler.streamEvents.onSpeechDetected(this)
    }.bind(this), 3e3))
}, MediaStream.prototype._stopDetectingSpeech = function() {
    this._audioFrequencyData = [], clearInterval(this._speechDetectionInterval)
}, MediaStream.prototype._startAudioFrequencyAnalyser = function(e) {
    if (this._audioFrequencyAnalyserCallBacks = this._audioFrequencyAnalyserCallBacks || [], this._audioFrequencyAnalyserCallBacks.push(e), !this._audioContext) {
        var t = window.AudioContext || window.webkitAudioContext;
        this._audioContext = new t
    }
    if (!this._audioAnalyser) {
        this._audioAnalyser = this._audioContext.createAnalyser(), this._audioAnalyser.minDecibels = -90, this._audioAnalyser.maxDecibels = -10, this._audioAnalyser.fftSize = 512;
        var i = this._audioAnalyser.context.sampleRate / this._audioAnalyser.fftSize,
            n = [Math.ceil(50 / i), Math.ceil(3e3 / i)]
    }
    this._audioSourceNode || (this._audioSourceNode = this._audioContext.createMediaStreamSource(this), this._audioSourceNode.connect(this._audioAnalyser));
    var a = new Uint8Array(this._audioAnalyser.frequencyBinCount);
    void 0 !== !$ZCUtil && $ZCUtil.queueAnimation(function() {
        if (this._audioAnalyser) {
            this._audioAnalyser.getByteFrequencyData(a);
            var e = Array.from(Array.prototype.slice.apply(a, n)),
                t = Math.max.apply(null, e);
            this._audioFrequencyAnalyserCallBacks = this._audioFrequencyAnalyserCallBacks.filter((function(i) {
                return i(t, e)
            }));
            var i = this._audioFrequencyAnalyserCallBacks.length > 0 && this.active;
            return i || this._stopAudioFrequencyAnalyser(), i
        }
    }.bind(this))
}, MediaStream.prototype._stopAudioFrequencyAnalyser = function() {
    this._audioSourceNode && (this._audioSourceNode.disconnect(this._audioAnalyser), delete this._audioSourceNode), this._audioAnalyser && delete this._audioAnalyser, this._audioContext && (this._audioContext.close(), delete this._audioContext), delete this._audioFrequencyAnalyserCallBacks
}, MediaStream.prototype._close = function() {
    this.getTracks().forEach((function(e) {
        e.stop()
    })), this._stopAudioFrequencyAnalyser(), this._stopBackgroundProcessor(), this._clearAudioProcessingResources(), this._closeSourceStreams(), this._stopDetectingSpeech();
    let e = this.id.replace(/[^A-Za-z0-9-]/g, "");
    var t = ZCJQuery.escapeSelector("ml-default-background" + e),
        i = ZCJQuery("#" + t);
    i.length && i.remove()
}, MediaStream.prototype._setBackgroundProcessor = function(e) {
    this._backgroundProcessor = e
}, MediaStream.prototype._getBackgroundProcessor = function() {
    return this._backgroundProcessor
}, MediaStream.prototype._hasBackgroundProcessor = function() {
    return void 0 !== this._backgroundProcessor
}, MediaStream.prototype._stopBackgroundProcessor = function() {
    void 0 !== this._backgroundProcessor && (this._backgroundProcessor.stop(), this._backgroundProcessor = void 0)
}, MediaStream.prototype._enableVirtualBackground = function(e, t, i, n) {
    var a = function(e, t, i, n, a) {
        e.setBackground("#" + t, i).then(() => {
            e.setEffect("vb"), "function" == typeof n && n()
        }).catch(() => {
            "function" == typeof a && a()
        })
    };
    if (void 0 !== this._backgroundProcessor) {
        let d = this.id.replace(/[^A-Za-z0-9-]/g, "");
        var s = ZCJQuery.escapeSelector("ml-default-background" + d),
            o = ZCJQuery("#" + s);
        if (o.length) o[0].onload = () => a(this._backgroundProcessor, s, t, i, n), o[0].onerror = () => "function" == typeof n && n(), o[0].src = e;
        else {
            var r = ZCJQuery('<img id="' + s + '" src="' + e + '" class="zc-av-dN" crossorigin="anonymous">');
            r[0].onload = () => a(this._backgroundProcessor, s, t, i, n), r[0].onerror = () => "function" == typeof n && n(), ZCJQuery("body").append(r)
        }
    }
}, MediaStream.prototype._enableBackgroundBlur = function() {
    void 0 !== this._backgroundProcessor && this._backgroundProcessor.setEffect("blur")
}, MediaStream.prototype._disableBackgroundEffects = function() {
    void 0 !== this._backgroundProcessor && this._backgroundProcessor.setEffect("none")
}, MediaStream.prototype._setBlurIntensity = function(e) {
    void 0 !== this._backgroundProcessor && this._backgroundProcessor.setBlurIntensity(e)
}, MediaStream.prototype._applyVideoFilter = function(e) {
    void 0 !== this._backgroundProcessor && (this._backgroundProcessor.resourceHandler.inputCanvasCtx.filter = e)
}, MediaStream.prototype._disableVideoFilter = function() {
    void 0 !== this._backgroundProcessor && (this._backgroundProcessor.resourceHandler.inputCanvasCtx.filter = "none")
}, MediaStream.prototype._setAsModuleInstance = function(e) {
    this._instanceId = e
}, MediaStream.prototype._isModuleInstance = function() {
    return void 0 !== this._instanceId
}, MediaStream.prototype._getModuleInstanceId = function() {
    return this._instanceId
}, MediaStream.prototype._setSourceAudioStream = function(e) {
    this._sourceAudioStream = e
}, MediaStream.prototype._getSourceAudioStream = function() {
    return this._sourceAudioStream
}, MediaStream.prototype._hasSourceAudioStream = function() {
    return void 0 !== this._sourceAudioStream
}, MediaStream.prototype._setSourceVideoStream = function(e) {
    this._sourceVideoStream = e
}, MediaStream.prototype._getSourceVideoStream = function() {
    return this._sourceVideoStream
}, MediaStream.prototype._hasSourceVideoStream = function() {
    return void 0 !== this._sourceVideoStream
}, MediaStream.prototype._closeSourceStreams = function() {
    void 0 !== this._sourceVideoStream && this._sourceVideoStream._close(), void 0 !== this._sourceAudioStream && this._sourceAudioStream._close()
}, MediaStream.prototype._applyVideoConstraints = function(e) {
    var t = this._hasBackgroundProcessor() ? this._sourceVideoStream._getPrimaryVideoTrack() : this._getPrimaryVideoTrack();
    void 0 !== t && t.applyConstraints(e).then(() => {
        this._hasBackgroundProcessor() && this._getBackgroundProcessor().setDisplayRatio(0, 0, e.width.min, e.height.min)
    }).catch()
}, MediaStream.prototype._getAudioProcessingContext = function() {
    if (!this._audioProcessingContext) {
        var e = window.AudioContext || window.webkitAudioContext;
        this._audioProcessingContext = new e
    }
    return this._audioProcessingContext
}, MediaStream.prototype._setNoiseCancellationNode = function(e) {
    this._noiseCancellationNode = e
}, MediaStream.prototype._hasNoiseCancellationNode = function() {
    return void 0 !== this._noiseCancellationNode
}, MediaStream.prototype._startNoiseCancellation = function(e, t) {
    if (this._noiseCancellationNode && this._audioProcessingContext) {
        var i = !this._audioProcessingSourceNode && !this._audioProcessingDestinationNode;
        this._audioProcessingSourceNode ? this._audioProcessingSourceNode.disconnect() : this._audioProcessingSourceNode = this._audioProcessingContext.createMediaStreamSource(this), this._audioProcessingDestinationNode ? this._audioProcessingDestinationNode.disconnect() : this._audioProcessingDestinationNode = this._audioProcessingContext.createMediaStreamDestination(), this._audioProcessingSourceNode.connect(this._noiseCancellationNode), this._noiseCancellationNode.connect(this._audioProcessingDestinationNode), e(i ? WebRTCUserMedia.updateAndGetProcessedAudioStream(this, this._audioProcessingDestinationNode.stream) : void 0)
    } else t(this)
}, MediaStream.prototype._stopNoiseCancellation = function() {
    this._audioProcessingSourceNode && this._audioProcessingSourceNode.disconnect(), this._audioProcessingDestinationNode && this._audioProcessingDestinationNode.disconnect(), this._noiseCancellationNode && this._noiseCancellationNode.disconnect(), this._audioProcessingSourceNode && this._audioProcessingDestinationNode && this._audioProcessingSourceNode.connect(this._audioProcessingDestinationNode)
}, MediaStream.prototype._clearAudioProcessingResources = function() {
    this._audioProcessingSourceNode && (this._audioProcessingSourceNode.disconnect(), delete this._audioProcessingSourceNode), this._audioProcessingDestinationNode && (this._audioProcessingDestinationNode.disconnect(), delete this._audioProcessingDestinationNode), this._noiseCancellationNode && (this._noiseCancellationNode.disconnect(), delete this._noiseCancellationNode), this._audioProcessingContext && (this._audioProcessingContext.close(), delete this._audioProcessingContext)
}), HTMLVideoElement.prototype.getStream = HTMLAudioElement.prototype.getStream = function() {
    var e = null;
    return "object" == typeof this.srcObject && (e = this.srcObject), e
}, HTMLVideoElement.prototype.setStream = HTMLAudioElement.prototype.setStream = function(e) {
    "object" == typeof this.srcObject && (this.srcObject = e)
}, HTMLVideoElement.prototype.hasStream = HTMLAudioElement.prototype.hasStream = function() {
    return null !== this.srcObject
}, HTMLVideoElement.prototype._removeStream = function() {
    this.srcObject = null
}, HTMLVideoElement.prototype.playStream = HTMLAudioElement.prototype.playStream = function(e, t) {
    this.getStream() && this.play().then((function() {
        "function" == typeof e && e()
    })).catch((function(e) {
        "function" == typeof t && t(e)
    }))
}, HTMLVideoElement.prototype.setOrientation = function(e) {
    var t = e ? -1 : 1;
    ZCJQuery(this).css("transform", "scaleX(" + t + ")")
}, HTMLVideoElement.prototype.fit = function(e, t) {
    var i = this.getStream();
    if (null != i) {
        var n = i._getVideoSize(),
            a = n.width,
            s = n.height;
        if (a && s) {
            var o = a,
                r = s;
            if (e && t) {
                var d = a / s;
                (o = t * d) > e && (o = e), r = o / d
            }
            ZCJQuery(this).css({
                width: o,
                height: r
            })
        }
    }
}, HTMLVideoElement.prototype.getAspectRatio = function() {
    var e = this.videoWidth,
        t = this.videoHeight,
        i = 0;
    return e && t && (i = e / t), i
}, HTMLVideoElement.prototype.isInPIP = function() {
    return this._isInPIP
}, HTMLVideoElement.prototype.setPIP = function() {
    this._isInPIP = !0
}, HTMLVideoElement.prototype.resetPIP = function() {
    this._isInPIP = !1
}, HTMLCanvasElement.prototype.getVideoElement = function(e) {
    return this._videoElem || (this._videoElem = document.createElement("video"), this._videoElem.srcObject = this.captureStream(e)), this._videoElem
}, HTMLCanvasElement.prototype.isInPIP = function() {
    return this._videoElem && this._videoElem.isInPIP()
};
var ZCMediaDevices = {},
    MediaDeviceWidget = {};
ZCMediaDevices = function() {
    var e = {},
        t = !1,
        i = {
            AUDIO_INPUT: "audioinput",
            AUDIO_OUTPUT: "audiooutput",
            VIDEO_INPUT: "videoinput"
        },
        n = {},
        a = {};
    n[i.AUDIO_INPUT] = {}, n[i.AUDIO_OUTPUT] = {}, n[i.VIDEO_INPUT] = {}, void 0 !== WebRTCUserMedia && WebRTCUserMedia.isSupported() && WebRTCUserMedia.getMediaDevices();
    var s = function(e) {
            n[i.AUDIO_INPUT] = {}, n[i.AUDIO_OUTPUT] = {}, n[i.VIDEO_INPUT] = {}, e.forEach((function(e) {
                n[e.kind][e.deviceId] = e
            }))
        },
        o = function(e) {
            var t = e.label;
            return t && t.toLowerCase().includes("virtual")
        };
    return void 0 !== navigator.mediaDevices && (navigator.mediaDevices.ondevicechange = async function() {
        WebRTCUserMedia.getRawMediaDevices((function(e) {
            for (var t = n, i = [], r = [], d = 0; d < e.length; d++) {
                void 0 !== t[(p = e[d]).kind] && void 0 !== t[p.kind][p.deviceId] || o(p) || i.push(p)
            }
            for (var c in t) {
                var l = t[c];
                for (var u in l) {
                    var p = l[u],
                        f = !1;
                    for (d = 0; d < e.length; d++) {
                        var m = e[d];
                        if (m.kind === c && m.deviceId === u) {
                            f = !0;
                            break
                        }
                    }
                    f || o(p) || r.push(p)
                }
            }
            if (s(e), i.length > 0 || r.length > 0)
                for (var v in a) a[v](i, r)
        }))
    }), {
        kinds: i,
        get: function(e, t) {
            return n[e][t]
        },
        getAudioInputDevices: function() {
            return n[i.AUDIO_INPUT]
        },
        getVideoInputDevices: function() {
            return n[i.VIDEO_INPUT]
        },
        getAudioOutputDevices: function() {
            return n[i.AUDIO_OUTPUT]
        },
        isAudioInputDevice: function(e) {
            return e.kind === this.kinds.AUDIO_INPUT
        },
        isAudioOutputDevice: function(e) {
            return e.kind === this.kinds.AUDIO_OUTPUT
        },
        isVideoInputDevice: function(e) {
            return e.kind === this.kinds.VIDEO_INPUT
        },
        isAudioInputDeviceKind: function(e) {
            return e === this.kinds.AUDIO_INPUT
        },
        isAudioOutputDeviceKind: function(e) {
            return e === this.kinds.AUDIO_OUTPUT
        },
        isVideoInputDeviceKind: function(e) {
            return e === this.kinds.VIDEO_INPUT
        },
        hasNoVideoInputDevices: function() {
            var e = this.getVideoInputDevices();
            for (var t in e) {
                var i = e[t];
                if ("" !== t && "" !== i.label) return !1
            }
            return !0
        },
        update: function(e) {
            s(e)
        },
        hasPreferredAudioInput: function() {
            return void 0 !== e[this.kinds.AUDIO_INPUT]
        },
        hasPreferredAudioOutput: function() {
            return void 0 !== e[this.kinds.AUDIO_OUTPUT]
        },
        hasPreferredVideoInput: function() {
            return void 0 !== e[this.kinds.VIDEO_INPUT]
        },
        updatePreferredDevicesFromLocalDB: function() {
            e = $DB.get("preferredmediadevices") || {}
        },
        setPreferredDevice: function(t, i) {
            if (t && (e[t.kind] = t.deviceId, i && void 0 !== MediaAPI && "function" == typeof MediaAPI.updatePreferredDevice)) {
                var n = {};
                n[t.kind] = t, MediaAPI.updatePreferredDevice(n)
            }
            "undefined" != typeof $DB && $DB.update("preferredmediadevices", e)
        },
        setPreferredDevices: function(e, t) {
            for (var i in e) this.setPreferredDevice(e[i], !1);
            t && void 0 !== MediaAPI && "function" == typeof MediaAPI.updatePreferredDevice && MediaAPI.updatePreferredDevice(e)
        },
        getPreferredDevices: function() {
            var t = {},
                n = this.get(this.kinds.AUDIO_INPUT, e[this.kinds.AUDIO_INPUT]),
                a = this.get(this.kinds.AUDIO_OUTPUT, e[this.kinds.AUDIO_OUTPUT]),
                s = this.get(this.kinds.VIDEO_INPUT, e[this.kinds.VIDEO_INPUT]);
            return n && (t[i.AUDIO_INPUT] = n), a && (t[i.AUDIO_OUTPUT] = a), s && (t[i.VIDEO_INPUT] = s), t
        },
        syncPreferredDevices: function(e) {
            this.isPreferredDevicesSynced() || void 0 === MediaUtil.BRIDGE || MediaUtil.BRIDGE.Constants.IS_GUEST_USER ? "function" == typeof e && e() : MediaAPI.getPreferredDevices((function(t) {
                ZCMediaDevices.setPreferredDevicesObject(t), "function" == typeof e && e()
            }), e)
        },
        setPreferredDevicesObject: function(e) {
            t = !0;
            var i = {};
            if (void 0 !== e.devices) {
                var n = e.devices;
                for (var a in n) {
                    var s = {};
                    s.kind = a, s.deviceId = n[a], i[a] = s
                }
                this.setPreferredDevices(i)
            }
        },
        isPreferredDevicesSynced: function() {
            return t
        },
        clearPreferredAudioInputDevice: function() {
            e[this.kinds.AUDIO_INPUT] = void 0
        },
        isValidDevice: function(e, t) {
            return void 0 !== this.get(e, t)
        },
        isDefaultDeviceId: function(e) {
            return "default" === e
        },
        addListenerForDeviceChange: function(e, t) {
            e && "function" == typeof t && (a[e] = t)
        },
        removeListenerForDeviceChange: function(e) {
            delete a[e]
        }
    }
}(), MediaDeviceWidget = function() {
    var e = null,
        t = null,
        i = null,
        n = {
            showSelectedCategory: function(e) {
                var t = e.attr("category");
                e.siblings().removeClass("zc-av-medsel"), e.addClass("zc-av-medsel");
                var i = ZCJQuery("#media_device_widget");
                i.find("[mediadevicecnt]").hide(), i.find("[mediadevicecnt][category='" + t + "']").show()
            },
            selectDevice: function(t, i) {
                Clickoutside.handleClickOnChild(i);
                var n = t.parents("[dropdowncnt]"),
                    a = n.attr("selecteddeviceid"),
                    s = t.attr("deviceid"),
                    o = n.attr("devicekind");
                if (s !== a) {
                    var r = ZCMediaDevices.get(o, s),
                        d = {};
                    d[o] = r, e(d), n.find("[dropdowninput]").text(r.label), n.attr("selecteddeviceid", s)
                }
            },
            setSelectedDevices: function() {
                var t = ZCJQuery("#media_device_widget"),
                    n = {};

                function a(e, t) {
                    var i = t.val();
                    "false" == t.children('[value="' + i + '"]').attr("isdefault") && (n[e] = ZCMediaDevices.get(e, i))
                }
                i[ZCMediaDevices.kinds.AUDIO_INPUT] && a(ZCMediaDevices.kinds.AUDIO_INPUT, t.find("#selectedaudioinput")), i[ZCMediaDevices.kinds.AUDIO_OUTPUT] && a(ZCMediaDevices.kinds.AUDIO_OUTPUT, t.find("#selectedaudiooutput")), i[ZCMediaDevices.kinds.VIDEO_INPUT] && a(ZCMediaDevices.kinds.VIDEO_INPUT, t.find("#selectedvideoinput")), "function" == typeof e && e(n), $WC.$Win.destroy("media_device_widget")
            },
            setSpecificSelectedDevice: function(t, n) {
                Clickoutside.handleClickOnChild(n);
                var a = {},
                    s = t.attr("deviceType"),
                    o = t.attr("deviceId"),
                    r = t.attr("selected");
                i[ZCMediaDevices.kinds.AUDIO_INPUT] && ZCMediaDevices.isAudioInputDeviceKind(s) && !r && (a[ZCMediaDevices.kinds.AUDIO_INPUT] = ZCMediaDevices.get(ZCMediaDevices.kinds.AUDIO_INPUT, o)), i[ZCMediaDevices.kinds.VIDEO_INPUT] && ZCMediaDevices.isVideoInputDeviceKind(s) && !r && (a[ZCMediaDevices.kinds.VIDEO_INPUT] = ZCMediaDevices.get(ZCMediaDevices.kinds.VIDEO_INPUT, o)), "function" == typeof e && e(a)
            },
            selectDeviceFromLocalUser: function(t, i) {
                var n = t.parents("[media_list]").attr("selecteddeviceid");
                if ((a = t.attr("deviceid")) !== n) {
                    var a = t.attr("deviceid"),
                        s = t.attr("devicetype"),
                        o = ZCMediaDevices.get(s, a),
                        r = {};
                    r[s] = o, e(r, s, t)
                }
            }
        },
        a = function(e, t, i, n) {
            let a = null,
                s = ZCMediaDevices.getPreferredDevices(),
                o = {
                    audioInputDeviceId: null,
                    audioOutputDeviceId: null,
                    videoInputDeviceId: null
                };
            return o[ZCMediaDevices.kinds.AUDIO_INPUT] = !0, o[ZCMediaDevices.kinds.AUDIO_OUTPUT] = WebRTCUserMedia.isSupported() && WebRTCUserMedia.isSetSinkIdSupported(), o[ZCMediaDevices.kinds.VIDEO_INPUT] = !0, (a = ZCJQuery.extend({}, o, e)).audioInputDeviceId = t ? t._getAudioDeviceId() : ZCMediaDevices.hasPreferredAudioInput() && s.audioinput ? s.audioinput.deviceId : null, a.videoInputDeviceId = i ? i._getVideoDeviceId() : ZCMediaDevices.hasPreferredVideoInput() && s.videoinput ? s.videoinput.deviceId : null, a.audioOutputDeviceId = n ? n.sinkId : ZCMediaDevices.hasPreferredAudioOutput() && s.audiooutput ? s.audiooutput.deviceId : null, a
        },
        s = function(e, t, n, s, o) {
            return i = a(t, n, s, o), $WC.template.replace('<div class="mcontent">{{lhs_cnt}}{{rhs_cnt}}{{footer}}</div>', {
                lhs_cnt: (r = "", d = "zc-av-medsel", c = '<li class="{{icon_class}} {{sel_class}}" category="{{category}}" mediadevicewidgetbutton purpose="showSelectedCategory">{{category_name}}</li>', i[ZCMediaDevices.kinds.AUDIO_INPUT] && (r += $WC.template.replace(c, {
                    $category_name: "emoji.microphone",
                    sel_class: d,
                    icon_class: "zcf-mic",
                    category: ZCMediaDevices.kinds.AUDIO_INPUT
                }), d = ""), i[ZCMediaDevices.kinds.AUDIO_OUTPUT] && (r += $WC.template.replace(c, {
                    $category_name: "videochat.settings.soundoutput",
                    sel_class: d,
                    icon_class: "msi-ldspeaker",
                    category: ZCMediaDevices.kinds.AUDIO_OUTPUT
                }), d = ""), i[ZCMediaDevices.kinds.VIDEO_INPUT] && (r += $WC.template.replace(c, {
                    $category_name: "emoji.camera",
                    sel_class: d,
                    icon_class: "zcf-video",
                    category: ZCMediaDevices.kinds.VIDEO_INPUT
                })), $WC.template.replace('<div class="zc-av-mediaui_lhs" mediadevicecategorycnt><ul>{{category_list}}</ul></div>', {
                    category_list: r
                }, "InSecureHTML")),
                rhs_cnt: function() {
                    var t = [],
                        n = [],
                        a = [];
                    e.forEach((function(e) {
                        ZCMediaDevices.isAudioInputDevice(e) ? t.push(e) : ZCMediaDevices.isVideoInputDevice(e) ? n.push(e) : a.push(e)
                    }));
                    var s = "",
                        o = "",
                        r = $WC.template.replace("<option>{{no_device}}</option>", {
                            $no_device: "videochat.settings.nodevice"
                        }),
                        d = '<div class="zc-av-mediaui_rhs {{display_class}}" mediadevicecnt category="{{category}}"><div><select id="{{id}}" class="zc-av-slt_view msi-expand">{{options_list_html}}</select></div></div>';

                    function c(e) {
                        var t = "";
                        return e.length ? e.forEach((function(e) {
                            var n = !1;
                            n = ZCMediaDevices.isAudioInputDevice(e) ? i[ZCMediaDevices.kinds.AUDIO_INPUT] && i.audioInputDeviceId == e.deviceId : ZCMediaDevices.isAudioOutputDevice(e) ? i[ZCMediaDevices.kinds.AUDIO_OUTPUT] && i.audioOutputDeviceId == e.deviceId : i[ZCMediaDevices.kinds.VIDEO_INPUT] && i.videoInputDeviceId == e.deviceId, t += $WC.template.replace('<option class="clr0" isdefault="{{is_default}}" {{selected}} value="{{device_id}}">{{label}}</option>', {
                                device_id: e.deviceId,
                                label: e.label,
                                is_default: n,
                                selected: n ? "selected" : ""
                            })
                        })) : t = r, t
                    }
                    return i[ZCMediaDevices.kinds.AUDIO_INPUT] && (s += $WC.template.replace(d, {
                        options_list_html: c(t),
                        category: ZCMediaDevices.kinds.AUDIO_INPUT,
                        display_class: o,
                        id: "selectedaudioinput"
                    }, "InSecureHTML"), o = "dN zc-av-dN"), i[ZCMediaDevices.kinds.AUDIO_OUTPUT] && (s += $WC.template.replace(d, {
                        options_list_html: c(a),
                        category: ZCMediaDevices.kinds.AUDIO_OUTPUT,
                        display_class: o,
                        id: "selectedaudiooutput"
                    }, "InSecureHTML"), o = "dN zc-av-dN"), i[ZCMediaDevices.kinds.VIDEO_INPUT] && (s += $WC.template.replace(d, {
                        options_list_html: c(n),
                        category: ZCMediaDevices.kinds.VIDEO_INPUT,
                        display_class: o,
                        id: "selectedvideoinput"
                    }, "InSecureHTML")), s
                }(),
                footer: $WC.template.replace('<div class="zc-av-footer "><div class="zc-av-windwbtn" mediadevicewidgetbutton purpose="setSelectedDevices">{{save}}</div></div>', {
                    $save: "common.save"
                })
            }, "InSecureHTML");
            var r, d, c
        };
    return {
        getCurrentConfig: a,
        handleCustomUIClose: function() {
            e = null, i = null
        },
        show: function(o, r, d, c, l, u) {
            if (!ZCJQuery("#media_device_widget").length && WebRTCUserMedia.isSupported()) {
                e = o, t = u;
                var p = function() {
                        e = null, i = null, "function" == typeof t && (t(), t = null)
                    },
                    f = function(e) {
                        "function" == typeof r.handleCustomUI ? (r.handleCustomUI(e, r, d, c, l), i = a(r, d, c, l)) : MediaUtil.createPopup({
                            id: "media_device_widget",
                            header: MediaUtil.getResource("videochat.settings.msg1"),
                            class: "zc-av-mediaui zcalgncntr zcbg_mask",
                            closefn: p,
                            html: s(e, r, d, c, l)
                        }, !0), ZCJQuery("#media_device_widget").on("click", "[mediadevicewidgetbutton]", (function(e) {
                            e.stopPropagation();
                            var t = ZCJQuery(this),
                                i = t.attr("purpose");
                            n[i](t, e)
                        }))
                    }.bind(this);
                WebRTCUserMedia.getMediaDevices(f)
            }
        }
    }
}();
var ScreenShare = {};
ScreenShare.Extension = function() {
    var e = !1,
        t = [],
        i = "https://chrome.google.com/webstore/detail/amdlbhchbncikhefhcbmcdcgadlggdlb",
        n = null;
    return {
        getLink: function() {
            if ($ZCUtil.Browser.isChrome()) return i
        },
        isInstalled: function() {
            return e || !$ZCUtil.Browser.isChrome() || _isZCDesktopApp()
        },
        setStatusAsInstalled: function() {
            e = !0
        },
        checkInstalledStatus: function() {
            if (window.postMessage({
                    requestId: "zoho_cliq_extn_check",
                    message: "ZOHOCLIQ-EXTN-CHECK"
                }, "*"), t.length) {
                var e = [];
                t.forEach((function(t) {
                    t.closed || e.push(t)
                })), t = e
            }
        },
        openStore: function() {
            t.push(window.open(this.getLink()))
        },
        isStoreOpened: function() {
            return t.length > 0
        },
        getSourceId: function(e, t) {
            n = e, window.postMessage({
                requestId: "zoho_cliq_get_screen_sourceId",
                message: "ZOHOCLIQ-GET-SCREEN-SOURCEID",
                isComputerAudioNeeded: t
            }, "*")
        },
        handleMessageEvent: function(t) {
            var i = t.originalEvent.data;
            "ZOHOCLIQ-EXTENSION" === i.source && ("zoho_cliq_extn_check" === i.requestId ? e = !0 : "zoho_cliq_get_screen_sourceId" === i.requestId && ("function" == typeof n && n(i.message.data), n = null))
        }
    }
}();
var ZCMediaConstants = {},
    MediaTemplates = {},
    MediaUtil = {},
    MediaAPI = {},
    MediaManager = {},
    MediaHandler = {},
    MLBackgroundProcessor = {},
    ZCMediaPreferences = {},
    AVCliqIframeHandler = {},
    AVCliqAPINamespace = {},
    ZCMediaModuleLoader = {},
    AVCliqClientProperties = {};
ZCMediaConstants = {
    ASPECT_RATIO: 4 / 3,
    MAX_TITLE_LENGTH: 30,
    FREQUENCY_BIN_RANGE: 255,
    scopeTypes: {
        CHAT: "chat",
        ORG: "organization",
        TEAM: "team",
        OPEN: "open",
        PERSONAL: "personal",
        EVENT: "events"
    },
    clientTypes: {
        WEB: "Web",
        DESKTOP: "Desktop",
        MOBILE: "Mobile"
    },
    videoQuality: {
        HD: "hd"
    },
    defaultImageNames: {
        PT_ICON: "pt-icon.svg",
        HUDDLE_EXIT: "huddle-exit.svg",
        BOT_DEFAULT_IMG: "bot-default.png",
        TIMER: "timer.svg"
    },
    triggerSource: {
        QUICK_ACTION: "quick action",
        CHAT_HEADER: "chat header",
        CALL_INCOMING_UI: "call incoming ui",
        INFO_MESSAGE_BUTTON: "info message button",
        LIVE_FEED: "live feed",
        REMOTE_WORK: "remote tools",
        LHS_ONGOING_LIST: "lhs_ongoing_list",
        CONVERTED_CALL: "converted_call",
        GUEST_CONNECTED: "guest_connected_callback",
        CALL_HISTORY: "call history",
        PERMALINK: "permalink",
        CONTACT_HOVER: "contact_hover",
        BUTTON_SYSTEM_API: "button_system_api",
        CALL_END_UI: "call_end_ui",
        PERSONAL_USER_CONFERENCE: "personal_user_conference"
    },
    sessionTypes: {
        CALLS: "calls",
        PRIMETIME: "primetime",
        CONFERENCE: "conference"
    },
    requestTypes: {
        DEVICES: "devices",
        START: "start",
        GET: "get",
        JOIN: "join"
    },
    endCases: {
        sessionEnd: 0,
        fullRoom: 1,
        leave: 2,
        removedFromChat: 3,
        sessionExpired: 4,
        unsupportedBrowser: 5,
        unsupportedBrowserVersion: 6,
        kickedOut: 7,
        assignHostAndLeave: 8,
        externalUserAccessDisabled: 9
    },
    muteCases: {
        button: "button",
        shortcut: "shortcut",
        pip: "pip",
        pushToTalk: "push_to_talk",
        permissionDenied: "permission_denied",
        settingsToggle: "settings_toggle",
        trackEnd: "trackEnd"
    },
    screenShareEndReasons: {
        RESTRICTED_BY_SPOTLIGHT: "restricted_by_spotlight",
        USER_NOT_IN_SPOTLIGHT: "user_not_in_spotlight",
        USER_REMOVED_FROM_SPOTLIGHT: "user_removed_from_spotlight"
    },
    mediaModules: {
        DIRECT_CALL: "directCall",
        VOICE_ALERT: "voiceAlert",
        CONFERENCE: "conference",
        PRIMETIME: "primeTime",
        MEDIA_RECORDER: "media_recorder",
        LIVE_EVENT: "live_event"
    },
    sharedContentType: {
        SCREEN_SHARE: "screen_share",
        PRESENTATION: "presentation",
        WHITEBOARD: "whiteboard"
    },
    mediaDevices: {
        CAMERA: "camera",
        MICROPHONE: "microphone"
    },
    requests: {
        applySettingsPreviewVideoBackgroundEffect: 100,
        setSettingsVideoFilterEffect: 101,
        setSettingsVideoBackgroundEffect: 102,
        applyPreviewVideoBackgroundEffect: 103,
        startTrigger: 104,
        quickConferenceStart: 105,
        prefetchMetaDetails: 106
    },
    devicePermissionStates: {
        PROMPT: "prompt",
        GRANTED: "granted",
        DENIED: "denied"
    },
    minimizedWindowRange: {
        width: {
            min: 250,
            max: 800
        },
        height: {
            min: 188,
            max: 600
        },
        toggleWidth: 322,
        visibleArea: {
            width: 70,
            height: 70
        },
        aspectRatio: 1.6
    },
    pip: {
        paintInterval: 1e3 / 15,
        videoFps: 15,
        audioWinDimension: {
            width: 500,
            height: 450
        },
        videoWinDimension: {
            width: 1280,
            height: 720
        }
    },
    audioFormats: ["mp3", "mpeg", "wav", "aac", "amr", "flac", "gsm", "tta", "wv", "x-wav", "x-m4a", "mp4", "ogg"],
    videoFormats: ["webm", "mkv", "flv", "ogg", "avi", "mov", "qt", "wmv", "asf", "mp4", "3gp", "quicktime"],
    defaultLogFileName: "media_logs",
    healthMeterStateText: {
        4: "excellent",
        3: "good",
        2: "low",
        1: "poor",
        0: "deadzone"
    },
    callRecordingConfigType: {
        general: 0,
        advanced: 1
    },
    callRecordingAdvancedConfigType: {
        org_channels: 1,
        team_channels: 2,
        private_channels: 3,
        external_channels: 4,
        adhoc_chats: 5
    },
    callRecordingConfig: {
        user_choice: 0,
        enabled: 1,
        disabled: -1
    },
    callRecordingTypes: {
        AUDIO_CONFERENCE: "audio_conference",
        VIDEO_CONFERENCE: "video_conference",
        ASSEMBLY: "assembly",
        LIVE_EVENT: "live_event"
    },
    settingKey: {
        MEDIA_IPVERSIONING_NOTIFIED_TIME: "media_ipversioning_notified_time",
        CALL_FEEDBACK: "calls_feedback_shown_time",
        MEETING_FEEDBACK: "meetings_feedback_shown_time"
    },
    localStorageKeys: {
        MEETING_USER_PREFERENCES: "meeting_user_preferences",
        SPEECH_DETECTION_ALLOWED: "av_speech_detection",
        AUDIO_MUTED: "audio_muted",
        VIDEO_MUTED: "video_muted"
    },
    connectionStats: {
        metrics: {
            packetLoss: "packetLoss",
            rtt: "rtt",
            jitter: "jitter"
        },
        overallScore: {
            updateInterval: 2e3,
            instancesTaken: 3
        }
    },
    defaultGuestImageUrl: "/guestimg/1/photo.do"
}, MediaTemplates = {
    userImageContainer: '<div class="usr-img-cnt zc-usr-img-cnt vhcenter zc-vhcenter bdrR100 zc-bdrR100 {{user_image_display_class}}" userimagecnt><div audiowaves class="touranim"></div><img class="bdrR100 zc-bdrR100 wh100 zc-wh100" {{user_image_onload}} {{user_img_error_event}} user_image src="{{user_img}}"/></div>',
    bufferLoader: '<div class="bffr-ldr zc-bffr-ldr vhcenter zc-vhcenter {{class_name}}" bufferloadercnt></div>',
    permissionOverlay: '<div class="mcontent"><div class="zc-av-flexC">{{permission_overlay_icon}}</div><div class="zc-av-hdrline zc-av-font22 zc-av-mT20">{{header}}</div><div class="zc-av-font16 zc-av-mT20 zc-av-line26">{{permission}}</div><div class="zcl-btn zcl-btn--primary mT20 AV-call-btn AV-call-btn--primary zc-av-mT20" mediamodulebuttons="" purpose="closeMediaPermissionOverlay">{{ok}}</div><div class="zc-av-permsn-arrow {{class_name}}"></div></div>',
    permissionOverlayIcon: '<div class="zc-av-permsn-icon {{class_name}}"><span class="zcf-closeB zc-av-permsn-close"></span></div>',
    v2dropDownHtml: '<div id="{{device_kind}}dropdowncnt" class="flexC bcast-form" selecteddeviceid="{{selected_device_id}}" dropdowncnt devicekind="{{device_kind}}"><div class="bcast-form-label fshrink ellips">{{header}}</div><div class="bcast-form-control flexG"><div class="zcl-dropdown-wrp"><div class="zcl-dropdown-input" {{open_callback}}><span class="zcl-dropdown-label ellips" dropdowninput>{{label}}</span><span class="zcf-downArrow fon12 fshrink zcl-dropdown-icon"></span></div><div id="{{device_kind}}dropdown" class="zcl-menu-wrap no-pointer device-dropdown" dropdown align="top" style="display: none;">{{drop_down_list}}</div></div></div></div>',
    v2DropDownListItemHtml: '<div class="zc-av-zcl-menu-item" deviceid="{{device_id}}" devicelabel="{{label}}" {{select_callback}}><div class="zc-av-flexG zc-av-ellips">{{label}}</div></div>',
    deviceDropdownCntHtml: '<div id="{{device_kind}}dropdowncnt" class="zc-av-flexC zc-av-device-drpdwn {{disable_drop_down}}" selecteddeviceid="{{selected_device_id}}" dropdowncnt devicekind="{{device_kind}}" {{disabled_attribute}}>{{header_cnt}}<div class="zc-av-zcl-dropdown-wrp zc-av-flexG zc-av-textL zc-av-w100 zc-av-mT10"><div class="zc-av-zcl-dropdown-input" {{open_callback}}><span class="zc-av-font18 zc-av-fshrink zc-av-zcl-dropdown-icon {{device_icon}}">{{disable_device_icon}}</span><span class="zc-av-zcl-dropdown-label zc-av-ellips" dropdowninput>{{label}}</span><span class="zcf-downArrow zc-av-fon12 zc-av-fshrink zc-av-zcl-dropdown-icon"></span></div><div id="{{device_kind}}dropdown" class="zc-av-zcl-menu-wrap no-pointer" dropdown align="{{drop_down_alignment}}" style="display: none;">{{drop_down_list}}</div></div></div>',
    headerComponentHtml: '<div class="media-hdr flexC {{custom_class}}" component_header {{custom_attribute}}>{{back_opt}}<div class="media-hdr-cont flexC ellips" mediaheader><span class="{{component_icon_class}} font16 mR8 mT2" title_holder></span><div class="media-hdr-label ellips {{tooltip_position}}" title_header {{tooltip_cnt}}>{{title}}</div><span class="zcf-failed AV-call-warning zc-av-dN" before_join_network_strength title="{{network_strength_tooltip}}"></span><div class="media-timer h100"><span id="{{timer_id}}" class="media-onair flexC"></span></div><div id="avcliq_alert_indication" avcliq_alert_indication class="zc-av-dN"></div>{{network_health_indicator}}</div>{{participants_count_cnt}}{{viewers_count_cnt}}{{recording_html}}<div id="media_udpblock_alert"></div></div>',
    pipHeaderComponentHtml: '<div class="flexC ellips bcast-minview-header fshrink" component_header {{custom_attribute}}><div class="ellips flexC flexG" mediaheader><span class="{{component_icon_class}} font16 mR8 mT2" title_holder></span><div class="font14 fontB mL6 ellips tooltip-up" title_header tooltip-title="{{header}}">{{title}}</div></div><div class="fshrink flexC gap10">{{recording_html}}<div class="media-timer h100"><span id="{{timer_id}}" class="media-onair flexC"></span></div>{{participants_count_cnt}}</div></div>',
    recordingIndicationHTML: '<div id="recording_indicator" class="media-user-count pLR10 flexC {{tooltip_position}}" recording_indicator {{tooltip_cnt}} style="{{display_style}}">\n\t\t\t<span class="AV-call-record-text zc-av-flexC">\n\t\t\t\t<span class="AV-call-record-icon AV-call-record-icon-circle flexM animation mT1"></span>\n\t\t\t\t<span class="font11 mL3">REC</span>\n\t\t\t</span>\n\t\t</div>',
    participantsCountCntHtml: '<div  participantscount class="hudl-hdr-openrhs media-user-count pLR10 flexC tooltip-up" tooltip-title="{{title}}"><em class="zcf-users mR4 font15 mT2"></em><span class="mL5 font14" participants_count>{{participants_count}}</span></div>',
    viewersCountCntHtml: '<div class="media-viewers-count pLR10 flexC"><em class="zcf-visible mR4 font15 mT2"></em><span class="mL5 font14" viewers_count>{{viewers_count}}</span></div>',
    muteBanner: '<div class="zc-av-mute-banner zc-av-flexM zc-av-ellips" mutedInfoCnt><em class="zcf-mic-mute zc-av-mR10 zc-av-fshrink"></em><span class="zc-av-ellips">{{content}}</span><span class="zc-av-mute-banner-infotext zc-av-ellips" muteInfoText>{{shortcut}}</span></div>',
    networkHealthIndicatorHtml: '<span class="AV-call-health-meter AV-health-meter-excellent {{custom_class}}" network_health_indicator {{custom_attribute}} title={{health_tooltip}}><span class="AV-call-health-meter-item health-meter-status" health="4"></span><span class="AV-call-health-meter-item" health="3"></span><span class="AV-call-health-meter-item" health="2"></span><span class="AV-call-health-meter-item" health="1"></span></span>',
    topBandHtml: '<div id="{{id}}" class="zc-av-topband zc-av-flexM zc-av-ellips {{custom_class}}" {{custom_attribute}}><span>{{icons}}</span><span topbandtitle class="zc-av-tb-content zc-av-ellips zc-av-mR8">{{content}}</span>{{short_content}}{{short_cut}}{{action_buttons}}{{close_opt}}</div>',
    topBandIcon: '<em class="zc-av-tb-icon {{class_name}}"></em>',
    topBandShortContent: '<span class="zc-av-tb-short-content zc-av-ellips zc-av-mR8">{{content}}</span>',
    topBandShortCut: '<span class="zc-av-tb-short-cut zc-av-ellips zc-av-mR8">{{content}}</span>',
    topBandAction: '<span class="zc-av-tb-link zc-av-mR8" {{custom_attribute}} purpose="{{purpose}}">{{content}}</span>',
    topBandCloseOpt: '<span class="zc-av-tb-close-opt zc-av-flexM tooltip-left" {{custom_attribute}} tooltip-title="{{title}}" purpose="{{purpose}}"><em class="zcf-closeB"></em></span>',
    warningPopup: '<div id="{{id}}" class="zc-av-popup zc-av-warning-popup">{{content}}</div>',
    warningIndicator: '<div class="zc-av-warning-icon zc-av-header-box zc-av-flexC zc-av-text-nosel"><span id="av-alert-icon" parentdomid="{{parent_dom_id}}" class="zcf-failed AV-call-warning flexM" mediamodulebuttons purpose="{{purpose}}" additionalkey="{{additionalkey}}"></span></div>',
    v2HeaderComponentHtml: '<div id="{{id}}" class="zc-av-header zc-av-flexC fshrink {{custom_class}}" {{custom_attribute}}><div class="zc-av-header-title-cnt zc-av-flexC flx1">{{back_opt}}<div class="zc-av-header-title zc-av-flexC zc-av-ellips" title_cnt><span class="{{title_icon}} clrW-lite zc-av-mR2 zc-av-mT2"></span><div class="posrel zc-av-mR10"><div id="{{title_id}}" class="{{title_class}} zc-av-font16 zc-av-fontB zc-av-ellips zc-av-mL4" title_header {{title_edit_params}}>{{title_content}}</div>{{title_edit_input}}</div>{{session_timer}}<div id="avcliq_alert_indication" avcliq_alert_indication class="zc-av-dN"></div>{{viewers_count}}{{recording_timer}}<div id="media_udpblock_alert">{{alert_indicator}}</div></div></div>{{screen_share_indicator}}<div id="mutebandindicator"></div>{{header_options}}</div>',
    checkboxHtml: '<label class="zc-av-flexIC zc-av-curP zc-av-w100" checkboxContainer><div class="zc-av-zcl-checkbox"><input id="{{id}}" type="checkbox" {{input_attr}} purpose="{{purpose}}" {{checked}}><span class="zcf-tick zc-av-flexM"></span></div>{{loader}}<div class="zc-av-font14 zc-av-line20 ellips">{{label}}</div></label>',
    toggleButtonHtml: '<label class="zc-av-zcl-switch zc-av-zcl-switch-sm no-icon zc-av-mL15 {{custom_class}}" checkboxcontainer><input type="checkbox" {{input_attr}} purpose="{{purpose}}" {{checked}}><span class="slider"><em class="switch"></em><div class="zc-av-zcl-dot--loader"><span></span><span></span><span></span></div></span></label>',
    mediaControlHtml: '<div class="zc-av-posrel zc-av-device-segment {{option_class}} {{custom_class}}" {{custom_attribute}}><div class="zc-av-flexC"><span class="zc-av-font14 zc-av-fontB zc-av-clr-lp1">{{header}}</span>{{toggle_button}}</div>{{device_drop_down}}</div>',
    outputAudioControlHtml: '<div class="zc-av-posrel zc-av-device-segment {{custom_class}}" {{custom_attribute}}><div class="zc-av-flexC"><span class="zc-av-font14 zc-av-fontB zc-av-clr-lp1">{{header}}</span><div class="zc-av-zcl-btn-xxs zc-av-zcl-btn--primary zc-av-mL6 tooltip-up {{disable_play_btn}}" {{audio_output_attribute}} purpose="{{audio_output_purpose}}">{{play_btn}}</div></div>{{device_drop_down}}</div>',
    systemRequirementLink: '<div class="zc-av-systemview-link zc-av-flexIC zc-av-mT10" mediamodulebuttons purpose="openSystemRequirementDoc">\n\t\t    <span class="zcf-computer zc-av-mR6"></span>\n\t\t    {{sys_req_content}}\n\t\t</div>',
    cameraDisabledInfoHtml: '<div class="zc-av-nocamerapreview flexM wh100" video_disabled_info><div>{{browser_blocked}}</div><div class="mT10">{{settings_blocked}}</div></div>',
    audioCardHtml: '<div class="zc-av-preview-audio-card vhcenter zc-av-flexM zc-av-fdirC zc-av-dN">\n\t\t\t<div class="zc-av-preview-audio-card-img">\n\t\t\t\t<div class="zc-av-wh100 bdrR100">\n\t\t\t\t\t<img class="bdrR100 zc-av-wh100" src="{{img_src}}">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<span class="zc-av-mT10 zc-av-dN">\n\t\t\t\t<span class="zc-av-ellips zc-av-fontB zc-av-font14">{{user_name}}</span>\n\t\t\t</span>\n\t\t</div>',
    groupCallPersonalSettingsHtml: '<div id="groupcall_personal_config_cnt" class="zcl-card" purpose="card" type="personal_config"><div class="zcl-card-head {{header_class}}">{{settings_title}}</div><div class="zcl-card-body"><div class="clr-S">{{settings_desc}}</div><div>{{options}}</div></div></div>',
    groupCallRecordingSettingsHtml: '<div id="groupcall_recording_config_cnt" class="zcl-card" purpose="card" type="recording"><div class="zcl-card-head {{header_class}}">{{settings_main_header}}</div><div class="zcl-card-body no-padding"><div class="flexC font14 pLR36"><span class="pR30">{{settings_sub_header}}</span><div mediamoduleradiobuttons purpose="toggleRecordingConfig">{{options}}</div></div><div class="zcl-tip-box mT30 ftr-tip"><span class="zcf-hint zcl-tip-icon flexM"></span><span class="zcl-tip-text flexC"><span><b>{{note_header}}:</b> {{note_content}}</span></span></div></div></div>',
    deviceSettingsAndVideoEffectsHtml: '<div id="preferred_devices_and_bgfilters" class="zcl-card devices-and-bgfilters" purpose="card" type="devices_and_bgfilters"><div class="zcl-card-head">{{settings_main_header}}</div><div class="zcl-card-body no-padding"><div class="device-settings-cnt pLR36">{{description}}<div class="flex mT24 flexW gap30"><div id="video_effects_config_preview" class="flex-col video-effects-preview-wrap {{bg_class}}"><div id="video_effect_preview_dom" class="video-effects-preview-video-cnt flexG flexM"><video class="video-effects-preview-video wh100 dN"></video><img class="video-effects-preview-img wh100 dN" src="{{img_src}}"/><div class="zcl-rloader posabs sm hide" loader></div><div class="video-effects-preview-info flexM fdirC" request_video_box><div class="mT6 textC font12 line18">{{request_video}}</div><div class="clr-theme curP fontB mT4" mediamodulebuttons purpose="enableVideoForEffectsPreview">{{enable_video}}</div></div><div class="video-effects-preview-info flexM fdirC dN" blocked_video_box><span class="zcf-video posrel"><span class="zcf-closeB flexM video-effects-preview-info-blocked"></span></span><div class="mT6 textC font12 line18">{{blocked}}</div></div></div>{{video_mirror_option}}</div><div class="device-preferences-cnt flexG"><div id="device_list_loader" class="device-list-loader zcl-rloader sm"></div><div id="media_device_widget" class="preferred-device-list"></div></div></div></div><div class="settings-video-effects-cnt zcl-hor-divider mT30">{{effects_palet}}</div><div class="zcl-tip-box ftr-tip"><span class="zcf-hint zcl-tip-icon flexM"></span><span class="zcl-tip-text flexC"><span><b>{{note_header}}:</b> {{note_content}}</span></span></div></div></div>',
    groupcallThemeSettingsHtml: '<div id="groupcall_theme_config_cnt" class="zcl-card smartconf-themes-settings" purpose="card" type="conference_themes">\n\t\t\t<div class="zcl-card-head">{{theme_hdr}}</div>\n\t\t\t<div id="smartconf_theme_mandate_info" class="orgLockedDetail flexC curD dN">\n\t\t\t\t<div class="flexM orgLockIconCnt fshrink h100">\n\t\t\t\t\t<span class="clr-warning font17 zcf-lock"></span>\n\t\t\t\t</div>\n\t\t\t\t<div class="clr-S ellips font14 pLR10 w100">{{locked_info}}</div>\n\t\t\t</div>\n\t\t\t<div class="zcl-card-body flexC gap15">\n\t\t\t\t<div class="font14 fontB">{{sel_theme}}:</div>\n\t\t\t\t<div id="smartconf_themes_settings_drpdwn_cnt" class="smartconf-themes-settings-drpdwn">\n\t\t\t\t\t<span class="skelton-loader form-skelton flex"></span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="zcl-tip-box ftr-tip">\n\t\t\t\t<span class="zcf-hint zcl-tip-icon flexM"></span>\n\t\t\t\t<span class="zcl-tip-text flexC">\n\t\t\t\t\t<span>\n\t\t\t\t\t\t<b>{{note_hdr}}:</b>\n\t\t\t\t\t\t<span> {{note}}</span>\n\t\t\t\t\t\t<span id="addl_note"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</span>\n\t\t\t</div>\n\t\t</div>',
    v2HeaderChatOptionHtml: '<span class="{{display_class}} zc-av-header-action flexM mL10" {{custom_attribute}} purpose="{{purpose}}" title="{{title}}"><em class="{{icon_class}} font15 mT4"></em><span class="msgnotify" {{unread_count_attribute}}></span></span>',
    linearAudioLevel: '<span class="audlvl-wrap low">\n\t\t\t<div class="audlvl-parent">' + '<div class="audlvl-bar"></div>'.repeat(10) + '</div>\n\t\t   \t<div audiolevel class="audiolevel-total"></div>\n\t\t</span>',
    videoEffectsLoader: '<div class="zc-av-flexM zc-av-alignM zcl-rloader-mask zc-av-dN" loader><div class="zc-av-zcl-rloader xs borderW"></div></div>',
    videoEffectsPalet: '<div id="{{id}}" class="{{custom_class}} zc-av-video-effects-cnt">{{seasonal_backgrounds}}<div class="zc-av-video-effects-title">{{bg_title}}</div><div class="zc-av-video-effects-list" background_list>{{bg_list}}</div><div class="zc-av-video-effects-title">{{filters_title}}</div><div class="zc-av-video-effects-list" filters_list>{{filters_list}}</div></div>',
    videoEffectsDefaultListItem: '<div class="zc-av-video-effects-list-item zc-av-video-effects-list-item-default {{active_class}} {{type_class}}" list_item {{custom_attribute}} purpose="{{purpose}}" type="{{type}}" value="{{type}}"><span class="zc-av-flexM {{icon_class}}"></span>{{loader}}</div>',
    videoEffectsBgListItem: '<div class="zc-av-video-effects-list-item {{active_class}} {{type_class}}" list_item {{custom_attribute}} purpose="{{purpose}}" type="{{type}}" value="{{value}}"><img class="zc-av-video-effects-list-item-img" src="{{src}}"/>{{loader}}{{new_indicator}}</div>',
    videoEffectsFilterListItem: '<div class="zc-av-video-effects-list-item {{active_class}} {{type_class}}" list_item {{custom_attribute}} purpose="{{purpose}}" type="{{type}}" value="{{value}}"><img class="zc-av-video-effects-list-item-img" src="{{src}}"/><div class="zc-av-video-effects-list-item-mask"></div>{{loader}}</div>',
    videoEffectsSettings: '<div class="{{parent_class}} zc-av-flexG zc-av-flex-col zc-av-ovrflwH">\n\t\t\t<div class="zc-av-settings-header zc-av-fshrink" zc_running_title>{{header}}</div>\n\t\t\t<div class="avcliq-video-effects-preview zc-av-flexM zc-av-fshrink zc-av-fdirC">\n\t\t\t\t<div id="video_effect_preview_dom" class="avcliq-video-effects-videocnt zc-av-posrel zc-av-flexM">\n\t\t\t\t\t<video class="zc-av-wh100 zc-av-bdrI"></video><div class="zcl-rloader posabs sm" loader></div>\n\t\t\t\t\t<div class="smartconf-userimg zc-av-dN" user_image>\n\t\t\t\t\t\t<img class= "video-effects-img" src="{{img_src}}">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t{{mirror_video_checkbox}}\n\t\t\t</div>\n\t\t\t{{palet}}\n\t\t\t<div class="avcliq-video-effects-ftr zc-av-justifyE zc-av-fshrink zc-av-flexC zc-av-pLR36 zc-av-mTB20 zc-av-dN">\n\t\t\t\t<div class="zc-av-flexG">\n\t\t\t\t\t<div remember_video_effects_choice class="zc-av-flexC">{{check_box}}</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="zc-av-fshrink">\n\t\t\t\t\t<div class="zc-av-zcl-btn-sm zc-av-zcl-btn--secondary zc-av-mR20" {{custom_attribute}} purpose="closeVideoEffectsPanel">{{cancel_btn}}</div>\n\t\t\t\t\t<div class="zc-av-zcl-btn-sm zc-av-zcl-btn--primary" {{custom_attribute}} purpose="setVideoEffects">{{apply_btn}}</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>',
    userSuggestionWinHtml: '<div id="{{user_suggest_id}}" class="mcontent"><div class="zcl-win-modal1-hdr fshrink"><div class="w100 justifySB flexC pTB10"><div class="font17 fontB ">{{header_title}}</div><span purpose="{{close_purpose}}" {{custom_attribute}} class="zchat-close zcl-icon-lg zcl-icon--filled2"></span></div></div><div class="zcl-win-modal1-srch fshrink"><div class="zcl-search2"><span class="zcf-search2 zcl-seach-icon"></span><div class="zcl-search-input"><input type="text" id="{{user_suggest_id}}-search-field" placeholder="{{search_placeholder}}"></div></div></div>{{add_users_btn}}<div id="{{user_suggest_id}}-results" class="zcrchtlt flexG" max_selections="{{max_limit}}"><div id="{{user_suggest_id}}-list" class="posl w100 h100"></div></div><div class="zcl-win-modal1-footr fshrink mT5 {{footer_hide_class}}" user_suggest_footer><div class="zcl-error-band pLR16 dN" error_band></div>{{input_cnt}}<div class="w100 justifySB flexC footr-padding"><div id="usernodecnt" class="zcrchicnt flexG"><div id="{{user_suggest_id}}-select-field" {{selected_list_attr}} class="zc-av-flexC" contenteditable="false"></div></div><div id="{{user_suggest_id}}-confirm-button" purpose="{{endaction_purpose}}" {{custom_attribute}} disabled class="fshrink mL15 zcl-btn-sm zcl-btn--primary">{{endaction_cnt}}</div></div></div></div>',
    addParticipantsBtnHtml: '<div id="add_users_btn" class="add-parti-item flexC curP {{hide_btn_class}}" {{onclick_attr}} purpose="{{add_users_purpose}}">\n\t\t\t<div class="mR12 add-parti-btn flexM zcf-plusB"></div>\n\t\t\t<div class="font15 fontB clr-theme">{{add_users_label}}</div>\n\t\t</div>',
    addParticipantInputHtml: '<div id="calltitleheader" class="footr-dividr flexC footr-padding"><div class="w100 flexC"><div class="fshrink font14 fontB clr-M pR25">{{input_title}}</div><input {{input_attribute}} inputname="{{input_name}}" type="text" class="zcl-input zcl-input-sm"  placeholder="{{input_placeholder}}"></div></div>',
    contactsCustomSearchHtml: '<div uid="{USERID}" elemtype="contact" data-val="{DNAMEVAL}" class="zcl-win-modal1-item" purpose="search">\n\t\t\t<div class="fshrink posrel contct-img bdrR100">\n\t\t\t\t<img uid="{USERID}" elemtype="user" hover="true" class="w100 h100 bdrR100" src="{IMGURL}">\n\t\t\t\t{{remove_user_cnt}}\n\t\t\t\t<div id="userstatus" class="{STATUSCLASS}"></div>\n\t\t\t</div>\n\t\t\t<div class="mL12 flexG ellips">\n\t\t\t\t<div class="flexC">\n\t\t\t\t\t<div elemtype="user" hover="true" uid="{USERID}" class="font15 clr-M curP dIB ellips">{DNAMEVAL}</div>\n\t\t\t\t\t{USERTAG}\n\t\t\t\t</div>\n\t\t\t\t<div class="ellips clr-lp1 font13 mT3">\n\t\t\t\t\t<a href="javascript:void(0)">{EMAILID}</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>',
    selectedParticipantHtmlInAddWin: '<div uid="{{user_id}}" elemtype="{{elem_type}}" title="{{user_name}}" nodetype="@" class="dIB zcricnt posl"><img class="w100 h100" src="{{user_img}}"/>{{remove_user_btn}}</div>',
    selectedChatHtmlInSuggWin: '<div class="zcricnt posl dIB" chid="{{chat_id}}" uid="{{u_id}}" elemtype="{{elem_type}}" nodetype="@" title="{{node_tooltip}}">\n\t\t\t<div class="node-select-img flexM">{{img_url}}</div>\n\t\t\t<div class="zcf-close dN" purpose="{{remove_purpose}}"></div>\n\t\t</div>',
    deviceListCustomUI: '<div id="bottom_band_device_settings" class="smartconf-bottom-band-device-settings" >\n\t\t\t<div id="{{dom_id}}" class="zcl-popup zcsetting-popup h100">\n\t\t\t   <div class="flex-col wh100">\n\t\t\t      <div class="font14 fontB fshrink zcsetting-popup-header clrW flexC justifySB">\n\t\t\t      \t<span>{{device_settings_header}}</span>\n\t\t\t      \t<span class="clr-theme fontB curP" {{custom_attr}} purpose="openSettingsWindow">{{settings_header}}</span>\n\t\t\t      </div>\n\t\t\t      <div class="flexG ovrflwA">\n\t\t\t      \t{{camera_list_html}}\n\t\t\t      \t{{mic_list_html}}\n\t\t\t      \t{{speaker_list_html}}\n\t\t\t      </div>\n\t\t\t   </div>\n\t\t\t</div>\n\t\t</div>',
    mediaListUI: ' <div id="{{device_list_id}}"  class="{{show_media_list}}" selecteddeviceid="{{selected_device_id}}" media_list>\n\t            <div class="flexC pLR10 mT5"><span class="clr-S fontB font13">{{device_header}}</span>\n\t               <span class="zcl-hor-divider flexG mL8"></span>\n\t            </div>\n\t            <div class="mLR8 mT6">\n\t               {{list_of_media}}\n\t            </div>\n         </div>',
    deviceUI: '<div class="zcl-list-item zc-av-mB4 {{is_active}}" deviceId="{{device_id}}" deviceType="{{device_type}}" {{button_type}} purpose="{{btn_purpose}}">\n    \t \t<span class="flexG ellips">{{device_name}}</span>\n    \t \t<span class="sel-icon zcf-tick font12 clr-theme fontB"></span>\n\t \t  </div>',
    viewSharingIndicator: '<div class="zc-av-scrnsharebox zc-av-fshrink zc-av-flexC zc-av-font14 {{custom_class}} {{display_class}}" {{indicator_attr}}><em class="{{share_type_icon}} zc-av-mR6 zc-av-font12"></em><span>{{content}}</span><span class="zc-av-scrnshare-stopcnt zc-av-flexM zc-av-mL10 zc-av-posrel av-tooltip-up zc-av-curP" {{custom_attr}} purpose="{{purpose}}" av-tooltip-title="{{title}}"><span class="zc-av-stop-icon"></span><span class="zc-av-mL4 zc-av-clrW zc-av-line1">{{stop_content}}</span></span><span class="zcf-closeB zc-av-close zc-av-flexM zc-av-curP" {{custom_attr}} purpose="{{close_option_purpose}}"></span></div>',
    miniPlayerScreenShareIndicator: '<div class="zc-av-scrnsharebox zc-av-miniplayer-scrnsharebox zc-av-w100 zc-av-fshrink zc-av-flexC zc-av-justifyE zc-av-font14 {{display_class}}" screen_share_indicator_v2><span class="zc-av-screenshare-content zc-av-clrW zc-av-font16 zc-av-pLR8">{{screen_share_content}}</span><span class="zc-av-fshrink zc-av-flexC zc-av-mR4"><span class="zc-av-scrnshare-stopcnt zc-av-flexM zc-av-mL10 zc-av-posrel av-tooltip-up zc-av-curP zc-av-zindex1" {{custom_attr}} purpose="{{purpose}}" av-tooltip-title="{{title}}"><span class="zc-av-stop-icon"></span><span class="zc-av-mL4 zc-av-clrW zc-av-line1">{{stop_content}}</span></span><span class="zcf-closeB zc-av-close zc-av-flexM zc-av-curP" {{custom_attr}} purpose="closeScreenShareIndicator"></span></span></div>',
    transferPanelHeader: '<div class="mT14 flexM"><span class="{{icon_class}} mR4 font16 mT2"></span><span class="font18 fontB">{{title}}</span><div class="media-timer mL5"><span id="transfercall_panel_timer" class="media-onair zc-av-flexC"></span></div></div>',
    transferCallButton: '<div class="smartconf-transfercall-modal-opt zcl-box flexC" {{button_module}} purpose="handOffCall" session_id="{{session_id}}"><div class="smartconf-monitor flexM fdirC mR20"><span class="smartconf-monitor-screen"><span class="usrstatus zcstatus-1"></span></span><span class="smartconf-monitor-stand mT8"></span></div><div class="flexG"><div class="fontB font16">{{btn_title}}</div><div class="font14 line20 mT8">{{btn_desc}}</div></div><div class="flexM"><span class="zcf-rarrow fontB clr-theme font18 smartconf-transfercall-modal-rArrow"></span></div></div>',
    addScreenButton: '<div class="smartconf-transfercall-modal-opt zcl-box flexC mT14" {{button_module}} purpose="addScreen" session_id="{{session_id}}"><div class="smartconf-monitor flexM fdirC mR20"><span class="smartconf-monitor-screen flexM"><span class="zcf-sharemedia fontB font13 clr-icon2"></span></span><span class="smartconf-monitor-stand mT8"></span></div><div class="flexG"><div class="fontB font16">{{btn_title}}</div><div class="font14 line20 mT8">{{btn_desc}}</div></div><div class="flexM mL10"><span class="zcf-rarrow fontB clr-theme font18 smartconf-transfercall-modal-rArrow"></span></div></div>',
    loaderHtml: '<div id="{{loader_id}}" class="wh100 flexM flexG fdirC">\n\t\t\t<div class="zcl-rloader-sm"></div>\n\t\t\t<div class="mT20 clr-S" loading-txt>{{loading_txt}}</div>\n\t\t</div>',
    networkStatsTabHtml: '<div class="zc-av-settings-header zc-av-fshrink">{{network_stats_hdr}}</div>\n\t\t<div class="zc-av-pT20 zc-av-mLR40 zc-av-ovrflwH">\n\t\t\t<table id="media_network_stats_tbl" class="zc-av-network-stats-tbl {{has_video_cls}} {{has_ss_cls}}">\n\t\t\t\t<thead>\n\t\t\t\t\t<tr class="zc-av-network-stats-tbl-tr">\n\t\t\t\t\t\t<th rowspan="2" width="160px" class="zc-av-network-stats-tbl-th zc-av-network-stats-metrics-hdr zc-av-bdrRTL6">{{stats_params}}</th>\n\t\t\t\t\t\t<th colspan="2" class="zc-av-network-stats-tbl-th zc-av-network-stats-audio zc-av-network-stats-audio-hdr zc-av-bdrRTR6">{{stats_audio}}</th>\n\t\t\t\t\t\t<th colspan="2" class="zc-av-network-stats-tbl-th zc-av-network-stats-video zc-av-network-stats-video-hdr zc-av-bdrRTR6">{{stats_video}}</th>\n\t\t\t\t\t\t<th colspan="2" class="zc-av-network-stats-tbl-th zc-av-network-stats-ss zc-av-network-stats-ss-hdr zc-av-bdrRTR6">{{stats_screen}}</th>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr class="zc-av-network-stats-tbl-tr">\n\t\t\t\t\t\t<th class="zc-av-network-stats-tbl-th zc-av-network-stats-audio zc-av-network-stats-subcatg">{{send_text}}</th>\n\t\t\t\t\t\t<th class="zc-av-network-stats-tbl-th zc-av-network-stats-audio zc-av-network-stats-subcatg">{{receive_text}}</th>\n\t\t\t\t\t\t<th class="zc-av-network-stats-tbl-th zc-av-network-stats-video zc-av-network-stats-subcatg">{{send_text}}</th>\n\t\t\t\t\t\t<th class="zc-av-network-stats-tbl-th zc-av-network-stats-video zc-av-network-stats-subcatg">{{receive_text}}</th>\n\t\t\t\t\t\t<th class="zc-av-network-stats-tbl-th zc-av-network-stats-ss zc-av-network-stats-subcatg">{{send_text}}</th>\n\t\t\t\t\t\t<th class="zc-av-network-stats-tbl-th zc-av-network-stats-ss zc-av-network-stats-subcatg">{{receive_text}}</th>\n\t\t\t\t\t</tr>\n\t\t\t\t</thead>\n\t\t\t\t<tbody>\n\t\t\t\t\t{{metric_rows_html}}\n\t\t\t\t\t<tr class="zc-av-network-stats-tbl-tr">\n\t\t\t\t\t\t<td height="45px" class="zc-av-network-stats-tbl-td zc-av-bdrRBL6">{{param_score}}</td>\n\t\t\t\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-audio" id="scr_audio_up">-</td>\n\t\t\t\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-audio zc-av-bdrRBR6" id="scr_audio_dn">-</td>\n\t\t\t\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-video" id="scr_video_up">-</td>\n\t\t\t\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-video zc-av-bdrRBR6" id="scr_video_dn">-</td>\n\t\t\t\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-ss" id="scr_screen_up">-</td>\n\t\t\t\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-ss zc-av-bdrRBR6" id="scr_screen_dn">-</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>',
    networkStatsTableMetricRowHtml: '<tr class="zc-av-network-stats-tbl-tr">\n\t\t\t<td class="zc-av-network-stats-tbl-td">{{param_{{row_key}}}}</td>\n\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-audio" id="{{row_key}}_audio_up">-</td>\n\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-audio" id="{{row_key}}_audio_dn">-</td>\n\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-video" id="{{row_key}}_video_up">-</td>\n\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-video" id="{{row_key}}_video_dn">-</td>\n\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-ss" id="{{row_key}}_screen_up">-</td>\n\t\t\t<td class="zc-av-network-stats-tbl-td zc-av-network-stats-ss" id="{{row_key}}_screen_dn">-</td>\n\t\t</tr>',
    getConnectionStatsTabHtml: function(e, t) {
        let i = "";
        ["ptl", "rtt", "jtt"].forEach(e => {
            i += $WC.template.replace(this.networkStatsTableMetricRowHtml, {
                row_key: e
            })
        });
        let n = $WC.template.replace(this.networkStatsTabHtml, {
            metric_rows_html: i
        }, "InSecureHTML");
        return $WC.template.replace(n, {
            has_video_cls: e ? "zc-av-network-stats-with-video" : "",
            has_ss_cls: t ? "zc-av-network-stats-with-ss" : "",
            $network_stats_hdr: "avcliq.networkstats.title",
            $stats_params: "avcliq.media.params",
            $stats_audio: "avcliq.media.audio",
            $stats_video: "avcliq.media.video",
            $stats_screen: "avcliq.media.screenshare",
            $send_text: "avcliq.media.send",
            $receive_text: "avcliq.media.receive",
            $param_ptl: "avcliq.networkstats.packetloss",
            $param_rtt: "avcliq.networkstats.rtt",
            $param_jtt: "avcliq.networkstats.jitter",
            $param_score: "avcliq.networkstats.score"
        })
    },
    getLoaderHtml: function(e, t) {
        return $WC.template.replace(this.loaderHtml, {
            loader_id: e,
            $loading_txt: t
        })
    },
    getSelectedParticipantHtmlInAddWin: function(e, t, i, n, a) {
        $WC.Matcher.check("emailid", e) && (t = e, i = $Util.getImgStaticUrl() + "/cnt-avtr.png");
        var s = $WC.template.replace(MediaTemplates.selectedParticipantHtmlInAddWin, {
            remove_user_btn: a ? '<div class="zcf-close dN" purpose="deleteSelectedNode"></div>' : "",
            user_id: e,
            elem_type: n,
            user_img: i || MediaCall.BRIDGE.Users.getImgUrlById(e)
        }, "InSecureHTML");
        return $WC.template.replace(s, {
            user_name: MediaCall.BRIDGE.Users.getName(e, t)
        })
    },
    getAddParticipantsBtnHtml: function(e, t, i, n) {
        return $WC.template.replace(MediaTemplates.addParticipantsBtnHtml, {
            hide_btn_class: n ? "dN" : "",
            onclick_attr: e,
            add_users_purpose: t,
            $add_users_label: i
        })
    },
    getAddParticipantInputHtml: function(e, t, i, n) {
        return $WC.template.replace(MediaTemplates.addParticipantInputHtml, {
            input_attribute: e,
            input_name: t,
            $input_title: i,
            $input_placeholder: n
        })
    },
    getUsersSuggestionWinHtml: function(e) {
        let t = $WC.template.replace(MediaTemplates.userSuggestionWinHtml, {
            add_users_btn: e.isAddUsersBtnNeeded ? MediaTemplates.getAddParticipantsBtnHtml(e.customAttribute, e.addUsersPurpose, e.addUsersLabelKey, e.hideAddUsersBtn) : "",
            input_cnt: e.inputNeeded ? MediaTemplates.getAddParticipantInputHtml(e.inputAttribute, e.inputName, e.inputTitle, e.inputPlaceholder) : ""
        }, "InSecureHTML");
        return $WC.template.replace(t, {
            custom_attribute: e.customAttribute,
            close_purpose: e.closePurpose,
            endaction_purpose: e.endActionPurpose,
            user_suggest_id: e.userSuggestId,
            max_limit: e.maxLimit,
            footer_hide_class: e.hideFooter ? "dN" : "",
            selected_list_attr: e.selectedListAttr || "",
            $header_title: e.headerTitle,
            $search_placeholder: e.searchPlaceHolder,
            $endaction_cnt: e.endActionContent
        })
    },
    getContactsCustomSearchHtml: function(e) {
        let t = "";
        return e && (t = $WC.template.replace('<span uid="{USERID}" id="{{id}}" class="flexM remove-usr-icn" title="{{tooltip}}"></span>', {
            id: e.removeOptionId,
            $tooltip: e.tooltipKey
        })), $WC.template.replace(this.contactsCustomSearchHtml, {
            remove_user_cnt: t
        }, "InSecureHTML")
    },
    getTransferPanelHeaderHtml: function(e, t) {
        return $WC.template.replace(this.transferPanelHeader, {
            icon_class: e ? "zcf-video" : "zcf-call",
            title: t
        })
    },
    getTransferPanelBodyHtml: function(e, t, i, n) {
        var a = {
                button_module: e,
                session_id: t
            },
            s = $WC.template.replace(this.transferCallButton, Object.assign({}, a, {
                $btn_title: "conference.transfercall.device.opt",
                btn_desc: MediaUtil.getResource("conference.transfercall.desc", [i])
            }));
        return n && (s += $WC.template.replace(this.transferCallButton, Object.assign({}, a, {
            $btn_title: "conference.add.screen.opt",
            $btn_desc: "conference.add.screen.desc"
        }))), s
    },
    getSeasonalVideoBgEffectsPalet: function(e) {
        var t = $WC.template.replace(this.videoEffectsBgListItem, {
            custom_attribute: e.background.customAttribute,
            purpose: e.background.purpose,
            type_class: "zc-av-video-effects-bg-image"
        });
        t = $WC.template.replace(t, {
            loader: this.videoEffectsLoader,
            new_indicator: '<span class="zc-av-video-effects-list-item-new-ind ellips">{{new_text}}</span>'
        }, "InSecureHTML");
        var i = MLBackgroundProcessor.backgroundTypes.NONE;
        void 0 !== e.background.selectedType && (i = e.background.selectedType);
        var n = "",
            a = setActiveClass = !1,
            s = MLBackgroundProcessor.backgroundTypes.getSeasonalImages();
        for (var o of s) a || (setActiveClass = i === o), n += $WC.template.replace(t, {
            type: MLBackgroundProcessor.backgroundTypes.IMAGE,
            value: o,
            src: MLBackgroundProcessor.backgroundTypes.getThumbNailUrl(o),
            original_src: MLBackgroundProcessor.backgroundTypes.getSrcUrl(o),
            active_class: !a && setActiveClass ? "zc-av-video-effects-list-item-active" : "",
            $new_text: "common.new"
        }, "InSecureHTML"), a = setActiveClass;
        return n
    },
    getVideoBgEffectsPalet: function(e) {
        var t = $WC.template.replace(this.videoEffectsDefaultListItem, {
            custom_attribute: e.background.customAttribute,
            purpose: e.background.purpose
        });
        t = $WC.template.replace(t, {
            loader: this.videoEffectsLoader
        }, "InSecureHTML");
        var i = $WC.template.replace(this.videoEffectsBgListItem, {
            custom_attribute: e.background.customAttribute,
            purpose: e.background.purpose,
            seasonal_play_icon: "",
            original_img: "",
            type_class: "zc-av-video-effects-bg-image",
            new_indicator: ""
        });
        i = $WC.template.replace(i, {
            loader: this.videoEffectsLoader
        }, "InSecureHTML");
        var n = MLBackgroundProcessor.backgroundTypes.NONE;
        void 0 !== e.background.selectedType && (n = e.background.selectedType);
        var a = MLBackgroundProcessor.backgroundTypes.hasNoBackground(n),
            s = a,
            o = $WC.template.replace(t, {
                type: MLBackgroundProcessor.backgroundTypes.NONE,
                type_class: "zc-av-video-effects-bg-none",
                icon_class: "zcf-blocked",
                active_class: a ? "zc-av-video-effects-list-item-active" : ""
            });
        s || (a = MLBackgroundProcessor.backgroundTypes.isBlur(n)), o += $WC.template.replace(t, {
            type: MLBackgroundProcessor.backgroundTypes.BLUR,
            type_class: "zc-av-video-effects-bg-blur",
            icon_class: "zcf-video-blur",
            active_class: !s && a ? "zc-av-video-effects-list-item-active" : ""
        }), s = a;
        var r = MLBackgroundProcessor.backgroundTypes.images;
        for (var d of r) s || (a = n === d), o += $WC.template.replace(i, {
            type: MLBackgroundProcessor.backgroundTypes.IMAGE,
            value: d,
            src: MLBackgroundProcessor.backgroundTypes.getThumbNailUrl(d),
            active_class: !s && a ? "zc-av-video-effects-list-item-active" : ""
        }, "InSecureHTML"), s = a;
        return o
    },
    getVideoFilterEffectsPalet: function(e) {
        var t = MLBackgroundProcessor.backgroundTypes.NONE;
        "undefined" !== e.background.selectedType && (t = e.background.selectedType), (MLBackgroundProcessor.backgroundTypes.hasNoBackground(t) || MLBackgroundProcessor.backgroundTypes.isBlur(t)) && (t = MLBackgroundProcessor.backgroundTypes.images[0]);
        var i = $WC.template.replace(this.videoEffectsDefaultListItem, {
            custom_attribute: e.filter.customAttribute,
            purpose: e.filter.purpose
        });
        i = $WC.template.replace(i, {
            loader: this.videoEffectsLoader
        }, "InSecureHTML");
        var n = $WC.template.replace(this.videoEffectsFilterListItem, {
            custom_attribute: e.filter.customAttribute,
            purpose: e.filter.purpose,
            src: MLBackgroundProcessor.backgroundTypes.getThumbNailUrl(t)
        });
        n = $WC.template.replace(n, {
            loader: this.videoEffectsLoader
        }, "InSecureHTML");
        var a = MLBackgroundProcessor.filterTypes.NONE;
        void 0 !== e.filter.selectedType && (a = e.filter.selectedType);
        var s = MLBackgroundProcessor.filterTypes.hasNoFilter(a),
            o = s,
            r = $WC.template.replace(i, {
                type: MLBackgroundProcessor.filterTypes.NONE,
                type_class: "zc-av-video-effects-filter-none",
                icon_class: "zcf-blocked",
                active_class: s ? "zc-av-video-effects-list-item-active" : ""
            }),
            d = MLBackgroundProcessor.filterTypes.variants;
        for (var c of d) o || (s = a === c), r += $WC.template.replace(n, {
            type: MLBackgroundProcessor.filterTypes.VARIANT,
            type_class: "zc-av-filter-" + c,
            value: c,
            active_class: !o && s ? "zc-av-video-effects-list-item-active" : ""
        }, "InSecureHTML"), o = s;
        return r
    },
    getVideoEffectsPalet: function(e) {
        var t = "";
        MLBackgroundProcessor.isSeasonalVideoEffectsEnabled() && (t = $WC.template.replace('<div class="zc-av-video-effects-title">{{seasonal_bg_title}}<span class="zc-av-video-effects-seasonal-ind zcf-newfeature zc-av-mL5"></span></div>\n\t\t\t\t\t\t\t\t\t<div class="zc-av-video-effects-list" background_list>{{seasonal_bg_list}}</div>', {
            seasonal_bg_list: this.getSeasonalVideoBgEffectsPalet(e)
        }, "InSecureHTML"), t = $WC.template.replace(t, {
            $seasonal_bg_title: "avcliq.media.seasonal.effects.background.title"
        }));
        var i = $WC.template.replace(this.videoEffectsPalet, {
            bg_list: this.getVideoBgEffectsPalet(e),
            filters_list: this.getVideoFilterEffectsPalet(e),
            seasonal_backgrounds: t
        }, "InSecureHTML");
        return $WC.template.replace(i, {
            id: e.id,
            custom_class: e.customClass || "",
            $filters_title: "avcliq.media.effects.filters.title",
            $bg_title: "avcliq.media.effects.background.title"
        })
    },
    getConferenceThemesSettingHtml: function() {
        return $WC.template.replace(this.groupcallThemeSettingsHtml, {
            $theme_hdr: "avcliq.conf.themes",
            $locked_info: "admin.TabsOrgLocked.Info",
            $sel_theme: "avcliq.conf.themes.sel",
            $note_hdr: "common.note",
            $note: "cc.host.setting1"
        })
    },
    getCallSettingsHtml: function(e) {
        var t = this.getGroupCallPersonalSettingsHtml(e);
        return ZCAVCP.isEnabledForMeeting(ZCAVCP.properties.meeting.SHOW_RECORDING_SETTINGS) && (t += this.getGroupCallRecordingSettingsHtml(e)), Conference.isVideoEffectsSettingsEnabled() && e && (this.showPreferredDeviceSettings(), t += this.getVideoEffectsSettingHtml(e)), Conference.isThemesEnabled() && e && (t += this.getConferenceThemesSettingHtml(), "undefined" != typeof ZCSmartConferenceUI && ZCSmartConferenceUI.updateThemesSettingDropDown()), t
    },
    getGroupCallPersonalSettingsHtml: function(e) {
        var t = '<div id={{id}} class="flexC mT30 zcsetting-switch-item"><div class="font15 line20">{{settings_title}}</div>{{toggle_html}}</div>',
            i = $WC.template.replace(t, {
                id: "conf_chat_notify_toggle",
                $settings_title: "avcliq.cc.ps.chat.notification",
                toggle_html: MediaTemplates.getToggleButtonHtml({
                    checkboxAttribute: "mediamodulecheckbox",
                    checkboxPurpose: "toggleChatNotificationConfig",
                    isSelected: Conference.isChatNotificationEnabledByUser()
                })
            }, "InSecureHTML");
        Conference.isPersonalConfigEnabled() && (i += $WC.template.replace(t, {
            id: "conf_join_video_toggle",
            $settings_title: "avcliq.cc.ps.join.video.status",
            toggle_html: MediaTemplates.getToggleButtonHtml({
                checkboxAttribute: "mediamodulecheckbox",
                checkboxPurpose: "toggleJoinVideoStatusConfig",
                isSelected: Conference.isVideoDisabledInJoinByUser()
            })
        }, "InSecureHTML")), i += $WC.template.replace(t, {
            id: "conf_sticky_info_toggle",
            $settings_title: "avcliq.cc.ps.sticky.info",
            toggle_html: MediaTemplates.getToggleButtonHtml({
                checkboxAttribute: "mediamodulecheckbox",
                checkboxPurpose: "toggleStickyInfoConfig",
                isSelected: Conference.isStickyInfoAllowedByUser()
            })
        }, "InSecureHTML"), i += $WC.template.replace(t, {
            id: "conf_speech_detection_toggle",
            $settings_title: "avcliq.cc.ps.speech.detection",
            toggle_html: MediaTemplates.getToggleButtonHtml({
                checkboxAttribute: "mediamodulecheckbox",
                checkboxPurpose: "toggleSpeechDetectionConfig",
                isSelected: ZCMediaPreferences.isSpeechDetectionAllowedByUser()
            })
        }, "InSecureHTML"), Conference.isHDVideoEnabled() && (i += $WC.template.replace(t, {
            id: "conf_hd_video_toggle",
            $settings_title: "avcliq.cc.ps.hd.video",
            toggle_html: MediaTemplates.getToggleButtonHtml({
                checkboxAttribute: "mediamodulecheckbox",
                checkboxPurpose: "toggleHDVideoConfig",
                isSelected: ZCMediaPreferences.isHDVideoAllowedByUser()
            })
        }, "InSecureHTML")), MediaUtil.isNoiseCancellationSupported() && (i += $WC.template.replace('<div id={{id}} class="flexC mT30 zcsetting-switch-item"><div class="flexC"><div class="font15 line20" data-qa="{{personal_config_title_qa}}">{{settings_title}}</div><div class="zcf-infoS font20 pL5 line30 zcsettings-personal-conf-info" title="{{info_text}}" data-qa="{{personal_config_info_qa}}"></div></div>{{toggle_html}}</div>', {
            id: "av_audio_processing_toggle",
            $settings_title: "avcliq.cc.ps.audio.processing",
            $info_text: "avcliq.cc.ps.audio.processing.info",
            personal_config_title_qa: "audioprocessing_personal_config_title",
            personal_config_info_qa: "audioprocessing_personal_config_info",
            toggle_html: MediaTemplates.getToggleButtonHtml({
                checkboxAttribute: 'mediamodulecheckbox data-qa="audioprocessing_personal_config_toggle"',
                checkboxPurpose: "toggleAudioProcessingConfig",
                isSelected: ZCMediaPreferences.isAudioProcessingAllowedByUser()
            })
        }, "InSecureHTML"));
        var n = $WC.template.replace(this.groupCallPersonalSettingsHtml, {
            options: i
        }, "InSecureHTML");
        return $WC.template.replace(n, {
            $settings_title: "cc.personal.settings",
            $settings_desc: "cc.personal.settings.desc",
            header_class: e ? "" : "zcl-win-subcategory conf-config pT10 pB10"
        })
    },
    getGroupCallRecordingSettingsHtml: function(e) {
        var t = SecurityManager.getModuleConfig("group_call_recording", "allowed_group_call_recording"),
            i = parseInt(Conference.getRecordingUserConfig()),
            n = MediaUtil.getResource("cc.host.setting1") + " " + MediaUtil.getResource("cc.host.setting2");
        $WC.Util.isEmpty(t) || ("general" === t.selected_configuration ? n = "media.recording.settings.note." + t.general_configuration : "advanced" === t.selected_configuration && (n = "media.recording.settings.note.advanced"));
        var a = RADIO_BUTTON.getHTML({
                name: "conference_recording",
                align: "HR",
                options: [{
                    id: "enabled",
                    value: ZCMediaConstants.callRecordingConfig.enabled,
                    checked: i === ZCMediaConstants.callRecordingConfig.enabled,
                    label: "media.recording.enabled"
                }, {
                    id: "disabled",
                    value: ZCMediaConstants.callRecordingConfig.disabled,
                    checked: i === ZCMediaConstants.callRecordingConfig.disabled,
                    label: "media.recording.disabled"
                }, {
                    id: "user_choice",
                    value: ZCMediaConstants.callRecordingConfig.user_choice,
                    checked: i === ZCMediaConstants.callRecordingConfig.user_choice,
                    label: "media.recording.user_choice"
                }]
            }),
            s = $WC.template.replace(this.groupCallRecordingSettingsHtml, {
                options: a
            }, "InSecureHTML");
        return $WC.template.replace(s, {
            $note_header: "common.note",
            $settings_sub_header: "conference.recording.title",
            $settings_main_header: "media.recordings",
            $note_content: n
        })
    },
    showPreferredDeviceSettings: function() {
        var e = {
            handleCustomUI: function(e, t) {
                ZCMediaDevices.syncPreferredDevices((function() {
                    if (WebRTCUserMedia.isPermissionQuerySupported()) {
                        WebRTCUserMedia.getVideoPermission((function(i) {
                            if (i === ZCMediaConstants.devicePermissionStates.DENIED) {
                                var n = $("#preferred_devices_and_bgfilters").find("#video_effects_config_preview");
                                n.find("[request_video_box]").addClass("dN"), n.find("[blocked_video_box]").removeClass("dN")
                            }
                            WebRTCUserMedia.getAudioPermission((function(n) {
                                MediaTemplates.addPreferredDeviceSettingsHtml(e, t, i, n)
                            }))
                        }))
                    } else MediaTemplates.addPreferredDeviceSettingsHtml(e, t, void 0, void 0)
                }))
            }
        };
        MediaDeviceWidget.show((function(e) {
            ZCMediaDevices.setPreferredDevices(e, !0)
        }), e)
    },
    addPreferredDeviceSettingsHtml: function(e, t, i, n) {
        var a = MediaTemplates.getPreferredDeviceSettingsHtml(e, t, i, n),
            s = $("#preferred_devices_and_bgfilters");
        s.find("#device_list_loader").remove(), s.find("#media_device_widget").append(a)
    },
    getVideoEffectsSettingHtml: function(e) {
        var t = ZCMediaPreferences.getPreferredVideoBackground(),
            i = MediaTemplates.getVideoEffectsPalet({
                id: "settings_video_effects_panel",
                background: {
                    selectedType: t,
                    customAttribute: "mediamodulebuttons",
                    purpose: "setVideoBackground"
                },
                filter: {
                    selectedType: ZCMediaPreferences.getPreferredVideoFilter(),
                    customAttribute: "mediamodulebuttons",
                    purpose: "setVideoFilter"
                }
            }),
            n = "video-effects-has-bg-image",
            a = t;
        void 0 === a && (a = MLBackgroundProcessor.backgroundTypes.NONE), (MLBackgroundProcessor.backgroundTypes.hasNoBackground(a) || MLBackgroundProcessor.backgroundTypes.isBlur(a)) && (a = MLBackgroundProcessor.backgroundTypes.images[0], n = "video-effects-has-default-bg-image");
        var s = "",
            o = "";
        e && (s = $WC.template.replace('<div class="clr-S">{{desc}}</div>', {
            $desc: "media.effects.settings.hint"
        }), o = $WC.template.replace('<div class="mT12 line1 zcdisabled" video_mirror>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t{{video_mirror_checkbox}}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>', {
            video_mirror_checkbox: MediaTemplates.getCheckboxHtml("conf_video_mirror_toggle", "cc.video.mirror", ZCMediaPreferences.isRotateVideoEnabledByUser(), "mediamodulecheckbox", "toggleVideoRotateConfig", !0)
        }, "InSecureHTML"));
        var r = $WC.template.replace(this.deviceSettingsAndVideoEffectsHtml, {
            effects_palet: i,
            description: s,
            video_mirror_option: o
        }, "InSecureHTML");
        return $WC.template.replace(r, {
            $settings_main_header: "avcliq.settings.devices.and.bgfilters",
            $blocked: "media.camera.denied.info",
            $enable_video: "avcliq.settings.enable.camera",
            $request_video: "media.video.enable.hint",
            $note_header: "common.note",
            $note_content: "avcliq.settings.devices.and.bgfilters.note",
            bg_class: n,
            img_src: MLBackgroundProcessor.backgroundTypes.getSrcUrl(a)
        })
    },
    getPreferredDeviceSettingsHtml: function(e, t, i, n) {
        var a = MediaTemplates.getVideoInputDevicePickerHtml(i),
            s = MediaTemplates.getAudioInputDevicePickerHtml(n),
            o = MediaTemplates.getAudioOutputDevicePickerHtml(n),
            r = "";
        return "" !== a && (r += MediaTemplates.getMediaControlOption({
            headerKey: "media.setdevices.videoinput",
            needsSeparator: !1,
            checkboxAttribute: "mediamodulecheckbox",
            checkboxPurpose: "toggleVideoInProfileSettings",
            isSelected: !1,
            customClass: "settings-cam-toggle",
            customAttribute: "settings_videoinput",
            deviceDropDown: a
        })), "" !== s && (r += MediaTemplates.getMediaControlOption({
            headerKey: "media.setdevices.audioinput",
            needsSeparator: !1,
            checkboxAttribute: "mediamodulecheckbox",
            checkboxPurpose: "toggleAudioInProfileSettings",
            isSelected: !1,
            customClass: "settings-mic-toggle",
            customAttribute: "settings_audioinput",
            deviceDropDown: s
        })), "" !== o && (r += MediaTemplates.getOutputAudioControlOption({
            headerKey: "media.setdevices.audiooutput",
            customClass: "",
            customAttribute: "settings_audiooutput",
            needsSeparator: !1,
            audioOutputAttribute: "mediamodulebuttons",
            audioOutputPurpose: "playDummySoundInSettingsPage",
            deviceDropDown: o
        })), r
    },
    getVideoInputDevicePickerHtml: function(e) {
        var t = ZCMediaDevices.getVideoInputDevices(),
            i = ZCMediaDevices.kinds.VIDEO_INPUT,
            n = MediaUtil.getInputDeviceDropDownHtml(t, i, {
                dropDownContainerHtml: MediaTemplates.getDeviceDropdownCntHtml(void 0)
            }, e);
        return MediaTemplates.getCallBackAttrs(n)
    },
    getAudioInputDevicePickerHtml: function(e) {
        var t = ZCMediaDevices.getAudioInputDevices(),
            i = ZCMediaDevices.kinds.AUDIO_INPUT,
            n = MediaUtil.getInputDeviceDropDownHtml(t, i, {
                dropDownContainerHtml: MediaTemplates.getDeviceDropdownCntHtml(void 0)
            }, e);
        return MediaTemplates.getCallBackAttrs(n)
    },
    getAudioOutputDevicePickerHtml: function(e) {
        var t = MediaUtil.getAudioOutputDropDownHtml({
            dropDownContainerHtml: MediaTemplates.getDeviceDropdownCntHtml(void 0)
        }, e);
        return MediaTemplates.getCallBackAttrs(t)
    },
    getCallBackAttrs: function(e) {
        return $WC.template.replace(e, {
            open_callback: 'mediamodulebuttons purpose="openDevicesDropDown"',
            select_callback: 'mediadevicewidgetbutton purpose="selectDevice"'
        }, "InSecureHTML")
    },
    getCheckboxHtml: function(e, t, i, n, a, s) {
        void 0 === a && (n = "", a = "");
        var o = $WC.template.replace(this.checkboxHtml, {
            id: e,
            checked: i ? "checked" : "",
            $label: t,
            input_attr: n,
            purpose: a
        });
        return $WC.template.replace(o, {
            loader: s ? '<span class="zc-av-zcl-rloader configuration-loader zc-av-mR7 zc-av-dN"></span>' : ""
        }, "InSecureHTML")
    },
    getToggleButtonHtml: function(e) {
        return $WC.template.replace(this.toggleButtonHtml, {
            input_attr: e.checkboxAttribute,
            purpose: e.checkboxPurpose,
            checked: e.isSelected ? "checked" : "",
            custom_class: e.checkboxCustomClass || ""
        })
    },
    getMediaControlOption: function(e) {
        var t = {
                checkboxAttribute: e.checkboxAttribute,
                checkboxPurpose: e.checkboxPurpose,
                isSelected: e.isSelected
            },
            i = $WC.template.replace(this.mediaControlHtml, {
                toggle_button: MediaTemplates.getToggleButtonHtml(t),
                device_drop_down: e.deviceDropDown
            }, "InSecureHTML");
        return $WC.template.replace(i, {
            $header: e.headerKey,
            icon_class: e.iconClass,
            custom_class: e.customClass,
            custom_attribute: e.customAttribute,
            option_class: e.needsSeparator ? "zcl-dropdown-divider" : ""
        })
    },
    getOutputAudioControlOption: function(e) {
        var t = MediaUtil.isAVLibraryLoadedInChatbar() ? "avcliq." : "",
            i = $WC.template.replace(this.outputAudioControlHtml, {
                device_drop_down: e.deviceDropDown
            }, "InSecureHTML");
        return $WC.template.replace(i, {
            $header: e.headerKey,
            $play_btn: t + "common.play",
            custom_attribute: e.customAttribute,
            custom_class: e.customClass,
            audio_output_attribute: e.audioOutputAttribute,
            audio_output_purpose: e.audioOutputPurpose,
            disable_play_btn: e.disablePlayBtn
        })
    },
    getSystemRequirementLinkHtml: function() {
        var e = MediaUtil.isAVLibraryLoadedInChatbar() ? "avcliq." : "";
        return $WC.template.replace(this.systemRequirementLink, {
            $sys_req_content: e + "media.open.system.requirements"
        })
    },
    getCameraDisabledInfo: function() {
        return $WC.template.replace(this.cameraDisabledInfoHtml, {
            $browser_blocked: "media.camera.browser.blocked",
            $settings_blocked: "media.camera.browser.settings.blocked"
        })
    },
    getAudioCardHtml: function(e) {
        var t = "",
            i = ZCMediaConstants.defaultGuestImageUrl;
        return void 0 !== e && (t = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Users.getName(e) : Users.getName(e), i = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Users.getImgUrlById(e) : Users.getImgUrlById(e)), $WC.template.replace(this.audioCardHtml, {
            img_src: i,
            user_name: t
        })
    },
    getV2HeaderComponentHtml: function(e) {
        var t = "",
            i = "",
            n = "",
            a = "",
            s = "",
            o = "",
            r = "",
            d = "",
            c = e.showUdpBlockedAlert ? ZCSmartConferenceTemplates.getUdpBlockedAlertHtml() : "";
        if (e.backButtonParams && (t = $WC.template.replace('<span class="{{icon_class}} zc-av-back-btn font12 cur zc-av-mR15 posrel tooltip-left0" {{custom_attribute}} purpose="{{purpose}}" tooltip-title="{{title}}"></span>', {
                icon_class: e.backButtonParams.iconClass,
                $title: e.backButtonParams.titleResourceParams,
                custom_attribute: e.backButtonParams.customAttribute,
                purpose: e.backButtonParams.purpose
            })), e.titleParams.allowEdit && (i = $WC.template.replace('<input id="{{id}}" type="text" class="zc-av-title-input dN" title_input value="{{value}}" {{attribute}} keyup-purpose={{purpose}}><span id="{{id}}count" class="limit-txt" category="charcount" limit="{{input_limit}}"></span>', {
                id: e.titleParams.inputId,
                attribute: e.titleParams.inputAttribute,
                purpose: e.titleParams.inputPurpose,
                value: e.titleParams.content,
                input_limit: e.titleParams.inputLimit
            }), n = e.titleParams.titleAttribute + " purpose=" + e.titleParams.titlePurpose), e.timerParams) {
            var l = '<div class="media-timer mR8">\n\t\t\t\t\t\t\t\t\t<span id="{{id}}" class="media-onair zc-av-flexC"></span>\n\t\t\t\t\t\t\t\t</div>',
                u = "";
            e.lockParams && (u = $WC.template.replace('<span class="{{display_class}} zc-av-header-lock mL6"><div class="dIB zcf-lock" title="{{title}}"></div><span class="zcl-separator mL6"></span></span>', {
                display_class: e.lockParams.displayClass,
                title: e.lockParams.content
            }), l = $WC.template.replace('<div class="media-timer mR8">\n\t\t\t\t\t\t\t\t\t<span class="media-onair media-onair-lock zc-av-flexC posrel">\n\t\t\t\t\t\t\t\t\t\t{{lock_indicator}}\n\t\t\t\t\t\t\t\t\t\t<span id="{{id}}" class="media-timer-block pLR6"></span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</div>', {
                lock_indicator: u
            }, "InSecureHTML")), a = $WC.template.replace(l, {
                id: e.timerParams.id
            })
        }
        e.viewerCountParams && (s = $WC.template.replace('<div class="zc-av-header-box zc-av-viewers-count zc-av-flexC mR5 tooltip-left"><span class="zcf-visible mT1"></span><span class="mL3" viewers_count>{{viewers_count}}</span></div>', {
            viewers_count: e.viewerCountParams.count
        }));
        var p = "";
        if (e.networkHealthParams && (p = this.getNetworkHealthIndicatorHtml(e.networkHealthParams)), e.recorderParams && (o = $WC.template.replace('<div id="recording_indicator" class="zc-av-header-box zc-av-flexC mR5" recording_indicator style="{{display_style}}"><span class="AV-call-record-icon AV-call-record-icon-circle flexM animation"></span><span class="mL3 fontB">REC</span></div>', {
                display_style: void 0 !== e.recorderParams.recordingIndex ? "" : "display:none"
            })), e.screenShareIndicatorParams) {
            var f = e.screenShareIndicatorParams;
            r = $WC.template.replace('<div class="{{display_class}} fshrink flexC font13" screen_share_indicator><em class="zcf-sharescrn mR6"></em><span>{{content}}</span><span class="zc-av-scrnshare-stopcnt flexM mL10 posrel curP" {{custom_attribute}} purpose="{{purpose}}" tooltip-title="{{title}}"><span class="zc-av-stop-icon"></span></span></div>', {
                $content: "avcliq.media.screen.sharing.you",
                $title: "avcliq.media.sharing.stop",
                display_class: f.displayClass,
                custom_attribute: f.customAttribute,
                purpose: f.purpose
            })
        }
        if (e.options) {
            var m = "",
                v = "",
                C = "",
                _ = "";
            if (e.options.participantsParams) {
                var g = e.options.participantsParams;
                m = $WC.template.replace('<span id="rhsparticipantsoption" class="zc-av-header-action flexM zc-av-flexC mL10" participantscount {{custom_attribute}} purpose="{{purpose}}" title="{{title}}"><em class="{{icon_class}} font15 mT3"></em><span class="font13 mL3 mT4" participants_count>{{content}}</span></span>', {
                    $title: "common.participants",
                    custom_attribute: g.customAttribute,
                    purpose: g.purpose,
                    icon_class: g.iconClass,
                    content: g.content
                })
            }
            if (e.options.chatParams) {
                var h = e.options.chatParams;
                v = $WC.template.replace(MediaTemplates.v2HeaderChatOptionHtml, {
                    display_class: h.displayClass,
                    $title: "common.chat",
                    custom_attribute: h.customAttribute,
                    purpose: h.purpose,
                    icon_class: h.iconClass,
                    unread_count_attribute: h.unreadCountAttribute
                })
            }
            if (e.options.townHallParams) {
                var I = e.options.townHallParams;
                C = $WC.template.replace('<span  class="zc-av-header-action flexM zc-av-flexC mL10" {{custom_attribute}} purpose="{{purpose}}" title="{{title}}"><em class="{{icon_class}} font15"></em></span>', {
                    $title: "conference.associatedresource.townhall.title",
                    custom_attribute: I.customAttribute,
                    purpose: I.purpose,
                    icon_class: I.iconClass
                })
            }
            if (e.options.notesParams) {
                var S = e.options.notesParams;
                _ = $WC.template.replace('<span id="rhsnotesoption" class="zc-av-header-action flexM zc-av-flexC mL10" {{custom_attribute}} purpose="{{purpose}}" title="{{title}}"><em class="{{icon_class}} font15 mT4"></em></span>', {
                    $title: "common.notes",
                    custom_attribute: S.customAttribute,
                    purpose: S.purpose,
                    icon_class: S.iconClass
                })
            }
            d = $WC.template.replace('<div id="v2_header_opts" class="zc-av-flexC zc-av-flexG justifyE flx1">{{custom_opt}}{{chat_opt}}{{participants_opt}}{{townhall_opt}}{{notes_opt}}</div>', {
                custom_opt: e.options.customOptions ? e.options.customOptions[0].html : "",
                participants_opt: m,
                chat_opt: v,
                townhall_opt: C,
                notes_opt: _
            }, "InSecureHTML")
        }
        var M = $WC.template.replace(this.v2HeaderComponentHtml, {
            back_opt: t,
            title_edit_input: i,
            title_edit_params: n,
            session_timer: a,
            viewers_count: s,
            network_health_indicator: p,
            recording_timer: o,
            recording_indication: "",
            alert_indicator: c,
            screen_share_indicator: r,
            header_options: d
        }, "InSecureHTML");
        return $WC.template.replace(M, {
            id: e.id,
            custom_class: e.customClass || "",
            custom_attribute: e.customAttribute || "",
            title_id: e.titleParams.id,
            title_icon: e.titleParams.iconClass,
            title_content: e.titleParams.content,
            title_class: e.titleParams.allowEdit ? "zc-av-header-title-editable" : ""
        })
    },
    alertPopupHeaderImg: '<div class="zc-av-flexM"><div class="AV-user-img-withborder"><div class="AV-user-img-wb-container"><img class="AV-user-img" src="{{curr_user_img}}"><div class="AV-user-img-ovrly posl"><span class="icon-item zcf-call zc-av-clr-R zc-call-end"></span></div></div></div><div class="AV-user-img-separator zc-av-fshrink clr-lp1">-</div><div class="AV-user-img-withborder zc-av-flex"><div class="AV-user-img-wb-container"><img class="AV-user-img" src="{{new_user_img}}"><div class="AV-user-img-ovrly posl"><span class="clr-green zc-av-fontB">{{new_user_text}}</span></div></div></div></div>',
    recordingIndicatorHtml: '<div class="zc-av-flexC AV-recording-indicator {{custom_class}} {{tooltip_position}}" recording_indicator style="display:none" av-tooltip-title="{{recording_tooltip}}"><span class="AV-call-record-text zc-av-flexC"><span class="AV-call-record-icon animation zc-av-mT2"></span><span class="zc-av-mL3">REC</span></span></div>',
    getRecordingIndicatorHtml: function(e, t) {
        return $WC.template.replace(this.recordingIndicatorHtml, {
            custom_class: t || "",
            tooltip_position: e,
            $recording_tooltip: "avcliq.media.recording"
        })
    },
    getTopBandHtml: function(e) {
        var t = "",
            i = "",
            n = "",
            a = "",
            s = "";
        if (e.icons)
            for (var o of e.icons) t += $WC.template.replace(this.topBandIcon, {
                class_name: o.className
            });
        if (e.shortContentResourceParams && (i = $WC.template.replace(this.topBandShortContent, {
                $content: e.shortContentResourceParams
            })), e.shortCutResourceParams && (n = $WC.template.replace(this.topBandShortCut, {
                $content: e.shortCutResourceParams
            })), e.actionButtons)
            for (var r of e.actionButtons) a += $WC.template.replace(this.topBandAction, {
                $content: r.contentResourceParams,
                custom_attribute: r.customAttribute,
                purpose: r.purpose
            });
        e.closeOption && (s = $WC.template.replace(this.topBandCloseOpt, {
            custom_attribute: e.closeOption.customAttribute,
            purpose: e.closeOption.purpose,
            $title: e.closeOption.titleResourceParams
        }));
        var d = $WC.template.replace(this.topBandHtml, {
            id: e.id || "",
            custom_class: e.customClass || "",
            custom_attribute: e.customAttribute || "",
            $content: e.contentResourceParams || ""
        });
        return d = $WC.template.replace(d, {
            icons: t,
            short_content: i,
            short_cut: n,
            action_buttons: a,
            close_opt: s
        }, "InSecureHTML")
    },
    getAudioMuteInfo: function(e) {
        var t = MediaUtil.getMuteShortCutFnKey();
        return $WC.template.replace('<div class="zc-av-fshrink zc-av-flexC zc-av-font14 zc-av-mutebox" mute_band_indicator><em class="zcf-mic-mute zc-av-font16 zc-av-mR6 zc-av-clr-R zc-av-mT2"></em><span>{{muted}} </span></div>', {
            $muted: e || ["media.mic.mute", t]
        })
    },
    getPresentationIndicator: function(e, t, i) {
        return $WC.template.replace(this.viewSharingIndicator, {
            $content: "media.presentation.sharing.you",
            $title: "media.presentation.stop",
            $stop_content: "avcliq.media.stop",
            purpose: "stopPresentation",
            custom_class: i,
            display_class: t ? "" : "zc-av-hide",
            share_type_icon: "zcf-presentation",
            close_option_purpose: "closePresentationIndicator",
            custom_attr: e,
            indicator_attr: "presentation_indicator_v2"
        })
    },
    getScreenShareIndicator: function(e, t, i) {
        return $WC.template.replace(this.viewSharingIndicator, {
            $content: "avcliq.media.screen.sharing.you",
            $title: "avcliq.media.sharing.stop",
            $stop_content: "avcliq.media.stop",
            purpose: "stopScreenShareFromBottomBand",
            custom_class: i || "",
            display_class: t ? "" : "zc-av-hide",
            share_type_icon: "zcf-sharescrn",
            close_option_purpose: "closeScreenShareIndicator",
            custom_attr: e,
            indicator_attr: "screen_share_indicator_v2"
        })
    },
    getScreenShareIndicatorForMiniPlayer: function(e, t) {
        return $WC.template.replace(this.miniPlayerScreenShareIndicator, {
            $screen_share_content: "avcliq.media.screen.sharing.you",
            $stop_share_content: "avcliq.media.screenshare.stop",
            $stop_content: "avcliq.media.stop",
            $title: "avcliq.media.sharing.stop",
            purpose: "stopScreenShareFromBottomBand",
            custom_attr: e,
            display_class: t ? "zc-av-hide" : ""
        })
    },
    getHeaderComponentHtml: function(e) {
        var t = e.ignoreBackOption ? "" : '<span class="{{back_btn_class}} posrel media-back-btn tooltip-up" {{module}} purpose="{{back_btn_purpose}}" tooltip-title="{{back_btn_title}}"></span>',
            i = "";
        if (e.showParticipantsCount) {
            var n = void 0 === e.participantsCount ? "" : e.participantsCount;
            i = $WC.template.replace(this.participantsCountCntHtml, {
                participants_count: n,
                module: e.module,
                $title: "common.participants"
            })
        }
        var a = "";
        if (e.showViewersCount) {
            var s = void 0 === e.viewersCount ? "" : e.viewersCount;
            a = $WC.template.replace(this.viewersCountCntHtml, {
                viewers_count: s
            })
        }
        var o = this.getRecordingIndicationHtml(e.recordingIndex, e.isPreviewRoom),
            r = "";
        e.showNetworkHealthIndicator && (r = this.getNetworkHealthIndicatorHtml(e.networkHealthParams));
        var d = $WC.template.replace(this.headerComponentHtml, {
            back_opt: t,
            tooltip_cnt: e.isPreviewRoom ? "" : 'tooltip-title="{{header_tooltip}}"',
            participants_count_cnt: i,
            viewers_count_cnt: a,
            recording_html: o,
            $network_strength_tooltip: e.isNetworkStrengthTooltipNeeded ? "avcliq.network.strength.weak.curruser" : "",
            network_health_indicator: r
        }, "InSecureHTML");
        return $WC.template.replace(d, {
            custom_class: e.customClass,
            custom_attribute: e.customAttribute,
            module: e.module,
            back_btn_class: e.backBtnClass,
            back_btn_purpose: e.backBtnPurpose,
            component_icon_class: e.componentIconClass,
            timer_id: e.timerId,
            header_tooltip: e.header,
            tooltip_position: e.isPreviewRoom ? "" : "tooltip-up",
            title: e.title,
            $back_btn_title: e.backBtnTitle
        })
    },
    getPipHeaderComponentHtml: function(e) {
        var t = "";
        e.participantsCount && (t = $WC.template.replace(this.participantsCountCntHtml, {
            participants_count: e.participantsCount,
            $title: "common.participants"
        }));
        var i = this.getRecordingIndicationHtml(e.recordingIndex, !1),
            n = $WC.template.replace(this.pipHeaderComponentHtml, {
                participants_count_cnt: t,
                recording_html: i
            }, "InSecureHTML");
        return $WC.template.replace(n, {
            timer_id: e.timerId,
            custom_attribute: e.customAttribute,
            component_icon_class: e.componentIconClass,
            title: e.title,
            header: e.header
        })
    },
    getRecordingIndicationHtml: function(e, t) {
        return $WC.template.replace(this.recordingIndicationHTML, {
            display_style: $WC.Util.isEmpty(e) ? "display:none" : "",
            tooltip_cnt: t ? "" : `tooltip-title=${MediaUtil.getResource("avcliq.media.recording")}`,
            tooltip_position: t ? "" : "tooltip-up"
        })
    },
    getNetworkHealthIndicatorHtml: function(e) {
        return $WC.template.replace(this.networkHealthIndicatorHtml, {
            custom_class: e.customClass || "",
            custom_attribute: e.customAttribute || "",
            $health_tooltip: "avcliq.network.strength.tooltip.excellent"
        })
    },
    getDeviceInfoIndicationHtml: function(e) {
        var t = '<div class="AV-call-deviceinfo {{device_icon}} zc-av-clrW" deviceinfo title="{{device_title}}"></div>';
        return e === ZCMediaConstants.clientTypes.WEB || e === ZCMediaConstants.clientTypes.DESKTOP ? t = $WC.template.replace(t, {
            device_icon: "zcf-system",
            $device_title: "avcliq.media.deviceinfo.web"
        }) : e === ZCMediaConstants.clientTypes.MOBILE && (t = $WC.template.replace(t, {
            device_icon: "zcf-mobile",
            $device_title: "avcliq.media.deviceinfo.mobile"
        })), t
    },
    _getDeviceDropDownHtml: function(e, t, i, n, a, s) {
        if ($WC.Util.isEmptyObject(n)) return "";
        var o, r = "",
            d = this.v2dropDownHtml,
            c = this.v2DropDownListItemHtml;
        for (var l in a && (a.dropDownListItemHtml && (c = a.dropDownListItemHtml), a.dropDownContainerHtml && (d = a.dropDownContainerHtml)), n) {
            var u = n[l];
            r += $WC.template.replace(c, {
                device_id: l,
                label: u.label
            }), (l === t || $WC.Util.isEmpty(o) && u.label === i) && (o = u)
        }
        var p = "";
        if (void 0 === o && void 0 === t || "" === o.deviceId || "" === i || "" === o.label)
            for (var l in n) {
                o = u = n[l], t = l, "" !== u.label && "" !== l || (s === ZCMediaConstants.devicePermissionStates.PROMPT ? e === ZCMediaDevices.kinds.VIDEO_INPUT ? p = MediaUtil.getResource("avcliq.settings.setdevices.enable.camera") : e === ZCMediaDevices.kinds.AUDIO_INPUT && (p = MediaUtil.getResource("avcliq.settings.setdevices.enable.microphone")) : s === ZCMediaConstants.devicePermissionStates.DENIED ? p = MediaUtil.getResource("avcliq.media.permission.state.denied") : e === ZCMediaDevices.kinds.VIDEO_INPUT ? p = MediaUtil.getResource("media.camera.browser.blocked") : e === ZCMediaDevices.kinds.AUDIO_INPUT ? p = MediaUtil.getResource("media.mic.blocked") : e === ZCMediaDevices.kinds.AUDIO_OUTPUT && (p = MediaUtil.getResource("media.audio.output.blocked")));
                break
            }
        var f = "zcf-sound";
        ZCMediaDevices.isAudioInputDeviceKind(e) ? f = "zcf-mic" : ZCMediaDevices.isVideoInputDeviceKind(e) && (f = "zcf-video");
        var m = $WC.template.replace(d, {
                $header: "media.setdevices." + e,
                device_kind: e,
                device_icon: f,
                selected_device_id: t,
                disable_drop_down: void 0 === t || "" === t || "" === i ? "zc-av-drp-dwn-disabled" : "",
                label: $WC.Util.isEmpty(o) || $WC.Util.isEmptyObject(o) || "" !== p ? p : o.label
            }),
            v = "" !== p;
        return $WC.template.replace(m, {
            drop_down_list: r,
            disable_device_icon: v ? '<span class="zcf-closeB smartconf-dropdown-close-icon flexM"></span>' : "",
            disabled_attribute: v ? "list_disabled" : ""
        }, "InSecureHTML")
    },
    getDeviceDropdownCntHtml: function(e) {
        var t = !1,
            i = "bottom";
        e && (e.isHeaderNeeded && (t = !0), e.dropDownAlignment && (i = e.dropDownAlignment));
        var n = "";
        t && (n = e.headerCntHtml);
        var a = $WC.template.replace(this.deviceDropdownCntHtml, {
            header_cnt: n
        }, "InSecureHTML");
        return $WC.template.replace(a, {
            drop_down_alignment: i
        })
    },
    getBufferLoader: function(e) {
        return $WC.template.replace(this.bufferLoader, {
            class_name: void 0 !== e ? e : ""
        })
    },
    getMuteBannerContent: function(e) {
        return MediaUtil.getResource(e ? "avcliq.media.muted.shortcut" : "avcliq.media.muted.additional.shortcut", MediaUtil.getMuteShortCutFnKey())
    },
    getMutedBanner: function(e) {
        return $WC.template.replace(this.muteBanner, {
            $content: "media.muted.info",
            shortcut: this.getMuteBannerContent(e)
        })
    },
    getAlertPopupHeaderImage: function(e, t) {
        return $WC.template.replace(this.alertPopupHeaderImg, {
            $new_user_text: "common.new",
            curr_user_img: MediaUtil.BRIDGE.Users.getImgUrlById(e),
            new_user_img: MediaUtil.BRIDGE.Users.getImgUrlById(t)
        })
    },
    getDeviceSettingsHtml: function(e, t) {
        var i = MediaTemplates.deviceUI,
            n = "",
            a = "",
            s = "",
            o = t.videoInputDeviceId,
            r = t.audioInputDeviceId,
            d = t.audioOutputDeviceId;
        e.forEach((function(e) {
            var c = !1,
                l = {
                    device_name: e.label,
                    device_id: e.deviceId,
                    device_type: e.kind,
                    button_type: "mediadevicewidgetbutton",
                    btn_purpose: "selectDeviceFromLocalUser"
                };
            ZCMediaDevices.isAudioInputDevice(e) && t[ZCMediaDevices.kinds.AUDIO_INPUT] ? (r || (r = e.deviceId), c = r == e.deviceId, l.is_active = c ? "sel" : "", l.is_selected = c ? 'selected="active"' : "", a += $WC.template.replace(i, l)) : ZCMediaDevices.isVideoInputDevice(e) && t[ZCMediaDevices.kinds.VIDEO_INPUT] ? (o || (o = e.deviceId), c = o == e.deviceId, l.is_active = c ? "sel" : "", l.is_selected = c ? 'selected="active"' : "", n += $WC.template.replace(i, l)) : ZCMediaDevices.isAudioOutputDevice(e) && t[ZCMediaDevices.kinds.AUDIO_OUTPUT] && (d || (d = e.deviceId), c = d == e.deviceId, l.is_active = c ? "sel" : "", l.is_selected = c ? 'selected="active"' : "", s += $WC.template.replace(i, l))
        }));
        var c = this.getDeviceListHtml(n, "common.device.camera", "videoinputdevices", o),
            l = this.getDeviceListHtml(a, "common.device.mic", "audioinputdevices", r),
            u = this.getDeviceListHtml(s, "media.setdevices.audiooutput", "audiooutputdevices", d),
            p = $WC.template.replace(MediaTemplates.deviceListCustomUI, {
                device_settings_header: MediaUtil.getResource("videochat.settings.devicesettings"),
                settings_header: MediaUtil.getResource("common.settings"),
                custom_attr: "smartconferencebutton",
                dom_id: "media_device_widget"
            });
        return p = $WC.template.replace(p, {
            camera_list_html: c,
            mic_list_html: l,
            speaker_list_html: u
        }, "InSecureHTML")
    },
    getDeviceListHtml: function(e, t, i, n) {
        var a = $WC.template.replace(MediaTemplates.mediaListUI, {
            device_header: MediaUtil.getResource(t),
            show_media_list: e ? "" : "dN",
            device_list_id: i,
            selected_device_id: n
        });
        return a = $WC.template.replace(a, {
            list_of_media: e
        }, "InSecureHTML")
    },
    getLiveTrackingAlertInfo: function(e, t) {
        return $WC.template.replace(MediaTemplates.warningIndicator, {
            purpose: "toggleLiveTrackingInfo",
            parent_dom_id: e,
            additionalkey: t
        })
    },
    getLiveTrackingAlertPopup: function(e) {
        return $WC.template.replace(MediaTemplates.warningPopup, {
            id: "avcliq_live_tracking_info",
            content: MediaUtil.getResource(e)
        })
    },
    getUDPBlockedWarningInfo: function(e) {
        return $WC.template.replace(MediaTemplates.warningIndicator, {
            purpose: "toggleUDPBlockedInfo",
            parent_dom_id: e
        })
    },
    getUDPBlockedPopup: function() {
        var e = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.ServerConstants.AV_UDP_IP_WHITELISTING_DOC : $zcg._AV_UDP_IP_WHITELISTING_DOC;
        return $WC.template.replace(MediaTemplates.warningPopup, {
            id: "avcliq_udp_blocked_info",
            content: MediaUtil.getResource("avcliq.media.udp.blocked.info", ["zc-av-hyperlink", e])
        }, "InSecureHTML")
    },
    getVideoMirrorHtml: function(e, t) {
        var i = MediaUtil.isAVLibraryLoadedInChatbar() ? "avcliq." : "";
        return $WC.template.replace('<div class="zc-av-mT10 zc-av-line1 zc-av-pL4 avcliq-mirror-toggle" video_mirror> {{video_mirror_checkbox}}</div>', {
            video_mirror_checkbox: MediaTemplates.getCheckboxHtml("avcliq_video_mirror_toggle", i + "cc.video.mirror", ZCMediaPreferences.isRotateVideoEnabledByUser(), e, t, !0)
        }, "InSecureHTML")
    }
}, MediaHandler = {
    UIEvents: {
        closeMediaPermissionOverlay: function() {
            MediaManager.closePermissionOverlay()
        },
        closeMediaActionConsentPopup: function() {
            $WC.$Win.destroy("media_action_consent_popup")
        },
        openSystemRequirementDoc: function() {
            var e = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.ServerConstants.SYSTEMREQUIREMENTHELPLINK : $zcg._SYSTEMREQUIREMENTHELPLINK;
            window.open(e)
        },
        enableVideoForEffectsPreview: function(e, t) {
            MediaUtil.enableVideoForEffectsPreview()
        },
        setVideoBackground: function(e, t) {
            if (!MediaManager.isCustomRequestPending(ZCMediaConstants.requests.setSettingsVideoBackgroundEffect) && !MediaManager.isCustomRequestPending(ZCMediaConstants.requests.applySettingsPreviewVideoBackgroundEffect)) {
                var i = t.find("[loader]");
                i.removeClass("dN");
                var n = (s = $("#preferred_devices_and_bgfilters")).find("#video_effects_config_preview"),
                    a = t.attr("value");
                MediaManager.setCustomRequestAsPending(ZCMediaConstants.requests.setSettingsVideoBackgroundEffect);
                var s, o = MLBackgroundProcessor.backgroundTypes.isSeasonalImage(a) ? {
                    seasonal_video_background: a
                } : {
                    video_background: a,
                    seasonal_video_background: MLBackgroundProcessor.backgroundTypes.NONE
                };
                Settings.update(o, (function() {
                    MediaManager.setCustomRequestAsCompleted(ZCMediaConstants.requests.setSettingsVideoBackgroundEffect), s.find("[background_list] [list_item]").removeClass("zc-av-video-effects-list-item-active"), t.addClass("zc-av-video-effects-list-item-active"), i.addClass("dN");
                    var e = "video-effects-has-bg-image",
                        o = a;
                    (MLBackgroundProcessor.backgroundTypes.hasNoBackground(a) || MLBackgroundProcessor.backgroundTypes.isBlur(a)) && (o = MLBackgroundProcessor.backgroundTypes.images[0], e = "video-effects-has-default-bg-image");
                    var r = MLBackgroundProcessor.backgroundTypes.getThumbNailUrl(o);
                    n.find("img").attr("src", MLBackgroundProcessor.backgroundTypes.getSrcUrl(o)), n.removeClass("video-effects-has-bg-image video-effects-has-default-bg-image").addClass(e), s.find("[filters_list] [list_item]").find("img").attr("src", r);
                    var d = PersonalizeUI.getCallSettingsVideoPreviewStream();
                    if (d) {
                        var c = s.find("#video_effects_config_preview"),
                            l = c.find("[loader]");
                        l.removeClass("hide"), i.removeClass("dN"), MediaManager.setCustomRequestAsPending(ZCMediaConstants.requests.applySettingsPreviewVideoBackgroundEffect), MLBackgroundProcessor.applyVideoBackground(d, a, (function(e) {
                            l.addClass("hide"), i.addClass("dN"), MediaManager.setCustomRequestAsCompleted(ZCMediaConstants.requests.applySettingsPreviewVideoBackgroundEffect), e && (MediaUtil.setAndPlayStreamInMediaContainer(c, e, !0), PersonalizeUI.setCallSettingsVideoPreviewStream(e))
                        }))
                    }
                }), (function() {
                    MediaManager.setCustomRequestAsCompleted(ZCMediaConstants.requests.setSettingsVideoBackgroundEffect), i.addClass("dN")
                })), (s = $("#preferred_devices_and_bgfilters")).find("[settings_videoinput]").find("[mediamodulecheckbox]").is(":checked") || MediaUtil.enableVideoForEffectsPreview()
            }
        },
        setVideoFilter: function(e, t) {
            if (!MediaManager.isCustomRequestPending(ZCMediaConstants.requests.setSettingsVideoFilterEffect) && !MediaManager.isCustomRequestPending(ZCMediaConstants.requests.applySettingsPreviewVideoBackgroundEffect)) {
                var i = t.find("[loader]");
                i.removeClass("dN");
                var n = $("#preferred_devices_and_bgfilters"),
                    a = (n.find("#video_effects_config_preview"), t.attr("value"));
                MediaManager.setCustomRequestAsPending(ZCMediaConstants.requests.setSettingsVideoFilterEffect), Settings.update({
                    video_filter: a
                }, (function() {
                    MediaManager.setCustomRequestAsCompleted(ZCMediaConstants.requests.setSettingsVideoFilterEffect), n.find("[filters_list] [list_item]").removeClass("zc-av-video-effects-list-item-active"), t.addClass("zc-av-video-effects-list-item-active"), i.addClass("dN");
                    var e = PersonalizeUI.getCallSettingsVideoPreviewStream();
                    if (e) {
                        var s = n.find("#video_effects_config_preview"),
                            o = s.find("[loader]");
                        o.removeClass("hide"), i.removeClass("dN"), MediaManager.setCustomRequestAsPending(ZCMediaConstants.requests.applySettingsPreviewVideoBackgroundEffect), MLBackgroundProcessor.applyVideoFilter(e, a, (function(e) {
                            o.addClass("hide"), i.addClass("dN"), MediaManager.setCustomRequestAsCompleted(ZCMediaConstants.requests.applySettingsPreviewVideoBackgroundEffect), e && (MediaUtil.setAndPlayStreamInMediaContainer(s, e, !0), PersonalizeUI.setCallSettingsVideoPreviewStream(e))
                        }))
                    }
                }), (function() {
                    MediaManager.setCustomRequestAsCompleted(ZCMediaConstants.requests.setSettingsVideoFilterEffect), i.addClass("dN")
                }))
            }
        },
        closePresentationPreview: function(e, t) {
            PresentationHandler.closePresentationPreview(e, t)
        },
        openPresentationFromHistory: function(e, t) {
            PresentationHandler.openPresentationFromHistory(e, t)
        },
        navigateToNextSlide: function(e, t) {
            PresentationImpl.navigateToNextSlide()
        },
        togglePresentationSlidesList: function(e, t) {
            PresentationHandler.togglePresentationSlidesList(t)
        },
        jumpToPresentationSlide: function(e, t) {
            PresentationHandler.jumpToPresentationSlide(t, parseInt(t.attr("slide_no")))
        },
        navigateToPreviousSlide: function(e, t) {
            PresentationImpl.navigateToPreviousSlide()
        },
        jumpToHostView: function(e, t) {
            var i = PresentationImpl.getCurrentActiveSession().getPresentation();
            PresentationHandler.jumpToPresentationSlide(t, i.getPresenterSlideNo(), i.getPresenterAnimIndex())
        },
        openDevicesDropDown: function(e) {
            var t = ZCJQuery(e.currentTarget).parents("[dropdowncnt]");
            Clickoutside.bind({
                srcid: t.attr("id"),
                destid: t.find("[dropdown]").attr("id"),
                customHide: function(e) {
                    t.find('[mediamodulebuttons][purpose="openDevicesDropDown"]').removeClass("sel"), ZCJQuery("#" + e.destid).hide()
                },
                customShow: function(e) {
                    t.find('[mediamodulebuttons][purpose="openDevicesDropDown"]').addClass("sel"), ZCJQuery("#" + e.destid).show()
                }
            })
        },
        playDummySoundInSettingsPage: function(e, t) {
            t.attr({
                purpose: "stopDummySoundInSettingsPage"
            }), MediaUtil.playDummySound(PersonalizeUI.getCallSettingsSpeakerPreviewObj(), t)
        },
        stopDummySoundInSettingsPage: function(e, t) {
            t.attr({
                purpose: "playDummySoundInSettingsPage"
            }), MediaUtil.stopDummySound(PersonalizeUI.getCallSettingsSpeakerPreviewObj(), t)
        },
        toggleLiveTrackingInfo: function(e, t) {
            let i = t.attr("additionalkey");
            MediaUtil.showAlertInfoInHeader(e, t, "avcliq_live_tracking_info", MediaTemplates.getLiveTrackingAlertPopup(i))
        },
        toggleUDPBlockedInfo: function(e, t) {
            MediaUtil.showAlertInfoInHeader(e, t, "avcliq_udp_blocked_info", MediaTemplates.getUDPBlockedPopup())
        }
    },
    UIToggleEvents: {
        toggleChatNotificationConfig: function(e, t) {
            var i = t.is(":checked"),
                n = i ? 1 : 0,
                a = t.parents("[checkboxContainer]"),
                s = function() {
                    a.removeClass("loading_progress")
                };
            a.addClass("loading_progress");
            var o = {
                huddle_notify_msg: n
            };
            MediaUtil.isGuestConferenceUser() ? (Settings.updateInObj(o), s()) : Settings.update(o, s, (function() {
                a.removeClass("loading_progress"), t.prop("checked", !i)
            }))
        },
        toggleJoinVideoStatusConfig: function(e, t) {
            var i = t.is(":checked"),
                n = i ? 1 : 0,
                a = t.parents("[checkboxContainer]"),
                s = function() {
                    a.removeClass("loading_progress")
                };
            a.addClass("loading_progress");
            var o = {
                huddle_join_video_muted: n
            };
            MediaUtil.isGuestConferenceUser() ? (Settings.updateInObj(o), s()) : Settings.update(o, s, (function() {
                a.removeClass("loading_progress"), t.prop("checked", !i)
            }))
        },
        toggleStickyInfoConfig: function(e, t) {
            var i = t.is(":checked"),
                n = i ? 1 : 0,
                a = t.parents("[checkboxContainer]"),
                s = function() {
                    a.removeClass("loading_progress"), MediaManager.handleStickyInfoConfigUpdate(i)
                };
            a.addClass("loading_progress");
            var o = {
                huddle_sticky_info: n
            };
            MediaUtil.isGuestConferenceUser() ? (Settings.updateInObj(o), s()) : Settings.update(o, s, (function() {
                a.removeClass("loading_progress"), t.prop("checked", !i)
            }))
        },
        toggleSpeechDetectionConfig: function(e, t) {
            MediaUtil.handlePersonalConfigToggle("av_speech_detection", t, (function(e) {
                MediaManager.handleSpeechDetectionConfigUpdate(e)
            }))
        },
        toggleAudioProcessingConfig: function(e, t) {
            MediaUtil.handlePersonalConfigToggle("av_audio_processing", t, (function(e) {
                MediaManager.handleAudioProcessingConfigUpdate(e)
            }))
        },
        toggleHDVideoConfig: function(e, t) {
            MediaUtil.handlePersonalConfigToggle("av_hd_video", t, (function(e) {
                MediaManager.handleHDVideoConfigUpdate(e)
            }))
        },
        toggleRecordingConfig: function(e, t) {
            Settings.update({
                conference_recording: t.val()
            })
        },
        toggleVideoRotateConfig: function(e, t) {
            var i = t.is(":checked"),
                n = i ? 1 : 0;
            Settings.update({
                huddle_mirror_video: n
            });
            var a = ZCJQuery("#video_effects_config_preview");
            MediaUtil.changeVideoOrientation(a, i)
        },
        toggleVideoInProfileSettings: function(e, t) {
            var i = t.is(":checked");
            if (t.prop("checked", !1), i) MediaUtil.enableVideoForEffectsPreview();
            else {
                var n = $("#preferred_devices_and_bgfilters").find("#video_effects_config_preview"),
                    a = n.find("[loader]");
                PersonalizeUI.closeCallSettingsVideoPreviewStream(), ZCSmartConferenceImpl.changeVideoMirrorCheckBoxDisabledState(!0), a.addClass("hide"), n.removeClass("video-effects-has-video"), n.find("[request_video_box]").removeClass("dN")
            }
        },
        toggleAudioInProfileSettings: function(e, t) {
            var i = t.is(":checked");
            if (t.prop("checked", !1), i) {
                var n = $("#preferred_devices_and_bgfilters").find("#media_device_widget"),
                    a = n.find("[settings_audioinput]"),
                    s = n.find("[settings_audiooutput]");
                MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_ONLY), WebRTCUserMedia.requestNewStreamInstance(WebRTCUserMedia.streamInstanceIds.settings_mic_tester_preview, WebRTCUserMedia.streamTypes.AUDIO_ONLY, (function(e) {
                    if (MediaManager.resetStreamRequested(), $("#preferred_devices_and_bgfilters").length) {
                        PersonalizeUI.getCallSettingsMicPreviewStream() && PersonalizeUI.closeCallSettingsMicPreviewStream(), t.prop("checked", !0), PersonalizeUI.setCallSettingsMicPreviewStream(e);
                        var i = function(e) {
                            if (MediaUtil.updateAudioInputDeviceDropDownHtml(a, ZCMediaConstants.devicePermissionStates.GRANTED), s.length) MediaUtil.updateAudioOutputDeviceDropDownHtml(s, ZCMediaConstants.devicePermissionStates.GRANTED);
                            else {
                                var t = MediaTemplates.getAudioOutputDevicePickerHtml(ZCMediaConstants.devicePermissionStates.GRANTED);
                                if ("" !== t) {
                                    var i = MediaTemplates.getOutputAudioControlOption({
                                        headerKey: "media.setdevices.audiooutput",
                                        customClass: "",
                                        customAttribute: "settings_audiooutput",
                                        needsSeparator: !1,
                                        audioOutputAttribute: "mediamodulebuttons",
                                        audioOutputPurpose: "playDummySoundInSettingsPage",
                                        deviceDropDown: t
                                    });
                                    n.append(i)
                                }
                            }
                        };
                        WebRTCUserMedia.getMediaDevices(i, i)
                    } else WebRTCUserMedia.closeStream(e._getType())
                }), (function(e) {
                    MediaManager.resetStreamRequested();
                    var t = function(e) {
                        MediaUtil.updateAudioInputDeviceDropDownHtml(a, ZCMediaConstants.devicePermissionStates.DENIED)
                    };
                    WebRTCUserMedia.getMediaDevices(t, t)
                }), void 0, MediaUtil.getAudioProcessingOptions())
            } else PersonalizeUI.closeCallSettingsMicPreviewStream()
        }
    },
    streamEvents: {
        onEnded: function(e, t) {
            var i = void 0;
            if ("undefined" != typeof ZCSmartConferenceImpl && (ZCSmartConferenceImpl.hasCurrentActiveSession() && (ConferenceImpl.handleTrackEnd(e, t), i = ZCSmartConferenceImpl.getCurrentActiveSession().getId()), ZCSmartConferenceImpl.hasJoiningSession() && (ConferenceImpl.handleTrackEndOnJoinPage(e, t), i = ZCSmartConferenceImpl.getJoiningSession().getId() || "join_preview")), "undefined" != typeof MediaCallImpl && MediaCallImpl.hasCurrentSession() && MediaCallImpl.handleTrackEnd(e, t), "undefined" != typeof WaitingRoom && WaitingRoom.hasPreviewSession() && (WaitingRoom.handleTrackEnd(e, t), i = "waiting_page_preview"), i) {
                var n = "";
                e && e.currentTarget && e.currentTarget.label && (n = e.currentTarget.label);
                var a = {
                    msgType: "streamEnded",
                    conferenceId: i,
                    type: t.kind,
                    trackLabel: n
                };
                _printLogMsg(JSON.stringify(a), "groupcall")
            }
        },
        onSpeechDetected: function(e) {
            "undefined" != typeof MediaCallImpl && MediaCallImpl.hasCurrentSession() ? MediaCallImpl.updateSpeechDetectionInfo(MediaCallImpl.getCurrentSession()) : "undefined" != typeof ZCSmartConferenceUI && ZCSmartConferenceUI.updateSpeechDetectionInfo()
        }
    },
    deviceEvents: {
        handleDeviceChange: function(e, t) {
            var i = $("#preferred_devices_and_bgfilters");
            if (i.length) {
                for (var n = e.length > 0 ? e : t, a = [], s = [], o = [], r = 0; r < n.length; r++) {
                    var d = n[r];
                    d.kind === ZCMediaDevices.kinds.VIDEO_INPUT ? a.push(d) : d.kind === ZCMediaDevices.kinds.AUDIO_INPUT ? s.push(d) : d.kind === ZCMediaDevices.kinds.AUDIO_OUTPUT && o.push(d)
                }
                var c = i.find("#media_device_widget");
                a.length && MediaUtil.updateVideoInputDeviceDropDownHtml(c.find("[settings_videoinput]"), ZCMediaConstants.devicePermissionStates.GRANTED), s.length && MediaUtil.updateAudioInputDeviceDropDownHtml(c.find("[settings_audioinput]"), ZCMediaConstants.devicePermissionStates.GRANTED), o.length && MediaUtil.updateAudioOutputDeviceDropDownHtml(c.find("[settings_audiooutput]"), ZCMediaConstants.devicePermissionStates.GRANTED)
            }
        }
    },
    handleUnload: function() {
        this.clearRunningSessions(!0)
    },
    handleInvalidSession: function() {
        this.handleLogout(!0)
    },
    handleLogout: function(e) {
        this.clearRunningSessions(!e)
    },
    clearRunningSessions: function(e) {
        if (MediaCall.clearAllSessions(), PrimeTime.isInitialized() && PrimeTimeImpl.handleEnd(e), Conference.isInitialized())
            if (ConferenceImpl.hasCurrentSession()) ConferenceImpl.handleEnd(e);
            else if (ZCSmartConferenceImpl.hasCurrentSession()) {
            var t = ZCSmartConferenceImpl.getCurrentSession();
            ZCSmartConferenceImpl.endConference(t.getId(), e)
        }
    },
    handleChatWindowBeforeClose: function(e) {
        ZCMediaRecorder.handleChatWindowBeforeClose(e), Conference.handleChatWindowBeforeClose(e)
    },
    handleWmsConnectionStatus: function(e) {
        MediaCall.handleWmsConnectionStatus(e), PrimeTime.handleWmsConnectionStatus(e), Conference.handleWmsConnectionStatus(e)
    }
}, MediaUtil = {
    BRIDGE: void 0,
    _isAVLibraryLoadedInCliq: !1,
    _isLyraCodecSupported: "undefined" != typeof TransformStream && "undefined" != typeof RTCRtpSender && "undefined" != typeof RTCRtpReceiver && "function" == typeof RTCRtpSender.prototype.createEncodedStreams && "function" == typeof RTCRtpReceiver.prototype.createEncodedStreams,
    _isLyraInitialized: !1,
    _isAudioWorkletSupported: "undefined" != typeof AudioWorkletNode,
    liveTrackingNotificationTimeout: void 0,
    liveTrackingNotificationTimeoutDuration: 3e4,
    isAVLibraryLoadedInCliq: function() {
        return this._isAVLibraryLoadedInCliq
    },
    setAVLibraryLoadedInCliq: function() {
        this._isAVLibraryLoadedInCliq = !0
    },
    isAVLibraryLoadedInChatbar: function() {
        return !this.isAVLibraryLoadedInCliq()
    },
    isNewAVDomainRoutingEnabled: function() {
        return void 0 !== this.BRIDGE && this.BRIDGE.isNewAVDomainRoutingEnabled()
    },
    isNoiseCancellationSupported: function() {
        return MediaUtil.isGuestConferenceUser() ? $zcg._IS_NOISE_CANCELLATION_ENABLED : void 0 !== this.BRIDGE && this.BRIDGE.isNoiseCancellationSupported() && this._isAudioWorkletSupported
    },
    isNetworkAdapterEnabled: function() {
        return void 0 !== this.BRIDGE && void 0 !== this.BRIDGE.ServerConstants.networkAdapterConfig
    },
    handleBridgeInitialized: function() {
        if (MediaUtil.isNewAVDomainRoutingEnabled()) {
            MediaUtil.isGuestConferenceUser() ? $zcg._CONFERENCE_AV_DOMAIN_ROUTING && AVCliqIframeHandler.init() : AVCliqIframeHandler.init()
        }
        MediaUtil.BRIDGE.canLoadMLLibrary() && MLBackgroundProcessor.isEnabled() && MLBackgroundProcessor.initialize(), MediaManager.initModules(), this.initLyraCodec()
    },
    isPresentationIn121CallEnabled: function() {
        return void 0 !== this.BRIDGE && this.BRIDGE.isPresentationIn121CallEnabled()
    },
    isLyraEnabled: function() {
        return void 0 !== this.BRIDGE && this.BRIDGE.isLyraEnabled()
    },
    isLyraCodecInitialized: function() {
        return this._isLyraInitialized
    },
    initLyraCodec: function() {
        this.isLyraEnabled() && this._isLyraCodecSupported && !this._isLyraInitialized && $ZCUtil.loadDynamicFiles({
            type: "script",
            url: MediaUtil.BRIDGE.ServerConstants.AV_CODEC_WRAPPER_JS,
            scriptType: "module",
            callback: () => MediaUtil._isLyraInitialized = !0
        })
    },
    getRNNoiseWorklet: function() {
        return void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.ServerConstants.AV_RNNOISE_WORKLET : $zcg._VIDEOCHATPROPS.AV_RNNOISE_WORKLET
    },
    sendMessageViaBroadcastChannel: function(e) {
        var t = AVCliqAPINamespace.BroadcastChannelAPI;
        AVCliqIframeHandler.callAVCliqAPI(t.className, t.sendMessage, [e])
    },
    isCallHandOffSupported: function(e, t) {
        return e && e.handoff_support && t && t.handoff_support
    },
    isOneToOneCall: function(e) {
        return ["audio", "video", "screen_share", "screen_with_media"].includes(e)
    },
    isGroupCall: function(e) {
        return e === ZCMediaConstants.callRecordingTypes.AUDIO_CONFERENCE || e === ZCMediaConstants.callRecordingTypes.VIDEO_CONFERENCE
    },
    isLiveEvent: function(e) {
        return "live_event" === e
    },
    isGuestConferenceUser: function() {
        return "undefined" != typeof WmsImpl && "function" == typeof WmsImpl.isGuestConferenceUser && WmsImpl.isGuestConferenceUser()
    },
    setClientBridge: function(e) {
        this.BRIDGE = e, void 0 !== MediaCall && "function" == typeof MediaCall.setClientBridge && MediaCall.setClientBridge(e)
    },
    getResource: function() {
        var e = void 0 !== this.BRIDGE ? this.BRIDGE.Resource : Resource;
        return e.getRealValue.apply(null, arguments)
    },
    updateBanner: function(e, t, i) {
        var n = void 0 !== this.BRIDGE ? this.BRIDGE.UI : window.UI;
        if (n)
            if (MediaUtil.isAVLibraryLoadedInChatbar()) {
                var a = i ? "error" : "info";
                n.updateBanner(e, a, t)
            } else n.updateBanner(e, t, i)
    },
    getCssClassesConstants: function() {
        return void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants._cssClasses : $zcg._cssClasses
    },
    getSettingsObject: function() {
        return void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Settings : window.Settings
    },
    getSettingsValue: function(e, t) {
        return void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Settings.get(e, t) : window.Settings.getFromObj(e, t)
    },
    updateSettingsValue: function(e) {
        var t = this.getSettingsObject();
        "function" == typeof t.update && t.update(e)
    },
    getSyncedCurrentTime: function() {
        var e = (new Date).getTime(),
            t = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Util : window.$Util;
        return t && "function" == typeof t.getSyncedCurrentTime && (e = t.getSyncedCurrentTime()), e
    },
    convertHexToRGBColorCode: function(e) {
        let t = e.replace("#", "");
        return parseInt(t.substring(0, 2), 16) + "," + parseInt(t.substring(2, 4), 16) + "," + parseInt(t.substring(4, 6), 16)
    },
    handlePersonalConfigToggle: function(e, t, i) {
        var n = t.is(":checked"),
            a = n ? 1 : 0,
            s = t.parents("[checkboxContainer]"),
            o = function() {
                s.removeClass("loading_progress"), "function" == typeof i && i(n)
            };
        s.addClass("loading_progress");
        var r = {};
        r[e] = a, MediaUtil.isGuestConferenceUser() ? (Settings.updateInObj(r), o()) : Settings.update(r, o, (function() {
            s.removeClass("loading_progress"), t.prop("checked", !n)
        }))
    },
    getSearchParamsFromUrl: function(e) {
        var t = {};
        if (e) {
            var i = e.split("?");
            i.length > 1 && (e = i[1]).split("&").forEach(e => {
                var i = e.split("=");
                t[i[0]] = decodeURIComponent(i[1])
            })
        }
        return t
    },
    isCurrentUserOrgAdmin: function() {
        return "true" == $zcg._ISORGOWNER || "true" == $zcg._ISAPPACCOUNTOWNER
    },
    getCurrentUserId: function() {
        return void 0 !== this.BRIDGE ? this.BRIDGE.Constants.ZUID : $zcg._ZUID
    },
    getMuteShortCutFnKey: function() {
        return "mac" === $ZCUtil.getOS() ? "Option" : "Alt"
    },
    getMicOnToolTip: function() {
        return this._getMuteToolTip(!0, !1)
    },
    getMicOffToolTip: function() {
        return this._getMuteToolTip(!1, !1)
    },
    getMicOnToolTipForPreview: function() {
        return this._getMuteToolTip(!0, !0)
    },
    getMicOffToolTipForPreview: function() {
        return this._getMuteToolTip(!1, !0)
    },
    _getMuteToolTip: function(e, t) {
        var i = e ? "common.micon" : "common.micoff",
            n = this.getResource(i);
        return t || (n += this.getMuteShortCutContent()), n
    },
    getMuteShortCutContent: function() {
        return " [" + this.getResource("avcliq.media.mic.shortcut", MediaUtil.getMuteShortCutFnKey()) + "]"
    },
    isValidTitle: function(e) {
        return e = e.trim(), !$WC.Util.isEmpty(e) && !$WC.Matcher.check("invalid_textpattern_chars", e) && e.length <= ZCMediaConstants.MAX_TITLE_LENGTH
    },
    hasVideoInRecording: function(e) {
        return !e.audio && !e.video || void 0 !== e.video && e.video
    },
    getRecordingName: function(e) {
        var t = e.name.trim();
        return t += this.hasVideoInRecording(e) ? ".mp4" : ".mp3"
    },
    setContainerPosition: function(e, t, i) {
        var n = {},
            a = e.width(),
            s = e.height();
        t && (a += t), i && (s += i);
        var o = e.offset().left,
            r = e.offset().top,
            d = ZCJQuery(window),
            c = d.width(),
            l = d.height();
        if (o + a > c) {
            var u = c - a;
            n.left = u, e.css("left", u)
        }
        if (r + s > l) {
            var p = l - s;
            n.top = p, e.css("top", p)
        }
        return n
    },
    getBestFitWidth: function(e, t, i) {
        if (e / i <= t) return e;
        var n = t * i;
        return n <= e ? n : 0
    },
    fitVideoContainer: function(e, t) {
        var i = MediaUtil.getBestFitWidth(e.width(), e.height(), ZCMediaConstants.ASPECT_RATIO);
        t.css({
            width: i,
            height: i / ZCMediaConstants.ASPECT_RATIO
        })
    },
    getCriteriaForDrag: function() {
        return {
            areaToBeVisible: ZCMediaConstants.minimizedWindowRange.visibleArea
        }
    },
    getCriteriaForResize: function(e) {
        return {
            aspectRatio: ZCMediaConstants.minimizedWindowRange.aspectRatio,
            widthRange: ZCMediaConstants.minimizedWindowRange.width,
            heightRange: ZCMediaConstants.minimizedWindowRange.height,
            callBack: function(t, i) {
                "function" == typeof e && e(t, i)
            }
        }
    },
    setStreamInContainer: function(e, t, i, n) {
        var a = t.find("video");
        if (0 != a.length) {
            var s = e === MediaUtil.getCurrentUserId();
            (a = a[0]).muted = s;
            var o = s;
            s && (o = ZCMediaPreferences.isRotateVideoEnabledByUser()), a.setOrientation(o), i && (t.find("[bufferloadercnt]").empty(), $ZCUtil.animateBufferLoader(t.find("[bufferloadercnt]"), 9), a.setStream(i), a.playStream((function() {
                t.find("[bufferloadercnt]").empty(), "function" == typeof n && n()
            })))
        }
    },
    enableVideoForEffectsPreview: function() {
        var e = $("#preferred_devices_and_bgfilters"),
            t = e.find("#video_effects_config_preview"),
            i = t.find("[loader]"),
            n = e.find("#media_device_widget").find("[settings_videoinput]");
        i.removeClass("hide"), t.find("[request_video_box]").addClass("dN"), t.find("[blocked_video_box]").addClass("dN");
        MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.VIDEO_ONLY), WebRTCUserMedia.requestNewStreamInstance(WebRTCUserMedia.streamInstanceIds.settings_video_effects_preview, WebRTCUserMedia.streamTypes.VIDEO_ONLY, (function(e) {
            if (MediaManager.resetStreamRequested(), $("#preferred_devices_and_bgfilters").length) {
                PersonalizeUI.getCallSettingsVideoPreviewStream() && PersonalizeUI.closeCallSettingsVideoPreviewStream(), n.find("[mediamodulecheckbox]").prop("checked", !0), PersonalizeUI.setCallSettingsVideoPreviewStream(e), t.addClass("video-effects-has-video"), i.addClass("hide"), MediaUtil.setAndPlayStreamInMediaContainer(t, e, !0), ZCSmartConferenceImpl.changeVideoMirrorCheckBoxDisabledState(!1);
                var a = function() {
                    MediaUtil.updateVideoInputDeviceDropDownHtml(n, ZCMediaConstants.devicePermissionStates.GRANTED)
                };
                WebRTCUserMedia.getMediaDevices(a, a)
            } else WebRTCUserMedia.closeStream(e._getType())
        }), (function(e) {
            MediaManager.resetStreamRequested(), i.addClass("hide"), t.find("[blocked_video_box]").removeClass("dN");
            var a = function(e) {
                MediaUtil.updateVideoInputDeviceDropDownHtml(n, ZCMediaConstants.devicePermissionStates.DENIED)
            };
            WebRTCUserMedia.getMediaDevices(a, a)
        }), void 0, MediaUtil.getVideoProcessingOptions())
    },
    updateVideoInputDeviceDropDownHtml: function(e, t) {
        var i = MediaTemplates.getVideoInputDevicePickerHtml(t);
        e.find("#videoinputdropdowncnt").remove(), e.append(i)
    },
    updateAudioInputDeviceDropDownHtml: function(e, t) {
        var i = MediaTemplates.getAudioInputDevicePickerHtml(t);
        e.find("#audioinputdropdowncnt").remove(), e.append(i)
    },
    updateAudioOutputDeviceDropDownHtml: function(e, t) {
        var i = MediaTemplates.getAudioOutputDevicePickerHtml(t);
        e.find("#audiooutputdropdowncnt").remove(), e.append(i)
    },
    updateVideoEffectsSettings: function(e, t) {
        var i = {};
        e && (MLBackgroundProcessor.backgroundTypes.isSeasonalImage(e) ? i.seasonal_video_background = e : (i.video_background = e, i.seasonal_video_background = MLBackgroundProcessor.backgroundTypes.NONE));
        t && (i.video_filter = t), MediaCall.BRIDGE.Settings.update(i)
    },
    logAvailableDevices: function(e, t) {
        if (void 0 !== t)
            if (Array.isArray(t)) {
                var i = [];
                t.forEach(e => {
                    i.push(e.kind + ": " + e.label + " - " + e.deviceId)
                }), e.writeToLog(CallLogConstants.availableMediaDevices, i)
            } else e.writeToLog(CallLogConstants.availableMediaDevices, t)
    },
    getEmptyDataObjOfConnectionStats: function() {
        return {
            audio: {
                upStream: {
                    packetLoss: [],
                    jitter: [],
                    rtt: [],
                    previousInstanceMetaData: {
                        lostPacketsCount: 0,
                        sentReceivedPacketsCount: 0
                    }
                },
                downStream: {
                    packetLoss: [],
                    jitter: [],
                    rtt: [],
                    previousInstanceMetaData: {
                        lostPacketsCount: 0,
                        sentReceivedPacketsCount: 0
                    }
                }
            },
            video: {
                upStream: {
                    packetLoss: [],
                    jitter: [],
                    rtt: [],
                    previousInstanceMetaData: {
                        lostPacketsCount: 0,
                        sentReceivedPacketsCount: 0
                    }
                },
                downStream: {
                    packetLoss: [],
                    jitter: [],
                    rtt: [],
                    previousInstanceMetaData: {
                        lostPacketsCount: 0,
                        sentReceivedPacketsCount: 0
                    }
                }
            },
            screen: {
                upStream: {
                    packetLoss: [],
                    jitter: [],
                    rtt: [],
                    previousInstanceMetaData: {
                        lostPacketsCount: 0,
                        sentReceivedPacketsCount: 0
                    }
                },
                downStream: {
                    packetLoss: [],
                    jitter: [],
                    rtt: [],
                    previousInstanceMetaData: {
                        lostPacketsCount: 0,
                        sentReceivedPacketsCount: 0
                    }
                }
            }
        }
    },
    handleConnectionStatsCallBackData: function(e, t, i, n, a, s, o, r) {
        let d = e.getConnectionStatsDataForMediaStreamType(t, i).previousInstanceMetaData,
            c = n - d.lostPacketsCount,
            l = c / (c + (a - d.sentReceivedPacketsCount)) * 100;
        l = Number(l.toFixed(2)), l = isNaN(l) ? "-" : l;
        let u = Math.round(1e3 * o);
        u = isNaN(u) ? "-" : u;
        let p = Math.round(1e3 * s);
        p = isNaN(p) ? "-" : p, this.updateConnectionStatsDataInSessionObj(e, t, i, l, u, p, n, a), e.isConnectionStatsTabOpened() && this.updateDataInConnectionStatsTab(r, t, i, l, u, p)
    },
    updateConnectionStatsDataInSessionObj: function(e, t, i, n, a, s, o, r) {
        let d = e.getConnectionStatsDataForMediaStreamType(t, i),
            c = (e, t) => {
                let i = d[e];
                i.push(t) > ZCMediaConstants.connectionStats.overallScore.instancesTaken && i.shift()
            };
        c(ZCMediaConstants.connectionStats.metrics.packetLoss, n), c(ZCMediaConstants.connectionStats.metrics.rtt, a), c(ZCMediaConstants.connectionStats.metrics.jitter, s), d.previousInstanceMetaData.lostPacketsCount = o, d.previousInstanceMetaData.sentReceivedPacketsCount = r
    },
    updateDataInConnectionStatsTab: function(e, t, i, n, a, s) {
        let o = t + (i ? "_up" : "_dn");
        e.find("#ptl_" + o).text(n), e.find("#rtt_" + o).text(a), e.find("#jtt_" + o).text(s)
    },
    updateOverallScoresInConnectionStatsTab: function(e, t) {
        Object.keys(t).forEach(i => {
            let n = t[i],
                a = e.find("#scr_" + i); - 1 === n.indexOf("-") && (a.toggleClass("zc-av-clr-G", ZCConnectionStatsScoreCalculator.scoreConstants.GOOD === n), a.toggleClass("zc-av-clr-Y", ZCConnectionStatsScoreCalculator.scoreConstants.AVERAGE === n), a.toggleClass("zc-av-clr-R", ZCConnectionStatsScoreCalculator.scoreConstants.POOR === n), n = MediaUtil.getResource("avcliq.network.strength.tooltip." + n)), a.text(n)
        })
    },
    handleStreamStatsVisibilityInConnectionStatsTab: function(e) {
        if (e.isConnectionStatsTabOpened()) {
            let t = void 0,
                i = !1,
                n = !1;
            e instanceof MediaCallSession ? (t = e.getCachedConnectionStatsTableDom(), i = MediaCallImpl.isCurrentModeVideoCall(e), n = e.getCurrentMember().isSharingScreen() || e.getOtherMember().isSharingScreen()) : (e instanceof ConferenceSession || e instanceof ZCSmartConferenceSession) && (t = ZCSmartConferenceUI.getCachedConnectionStatsTableDom(), i = e.isVideoConference(), n = e.hasScreenShare()), t && (t.toggleClass("zc-av-network-stats-with-video", i), t.toggleClass("zc-av-network-stats-with-ss", n))
        }
    },
    getDeviceDropDownHtml: function(e, t, i) {
        var n = e == ZCMediaDevices.kinds.VIDEO_INPUT,
            a = void 0,
            s = void 0;
        null != t && (a = n ? t._getVideoDeviceId() : t._getAudioDeviceId(), s = n ? t._getVideoDeviceLabel() : t._getAudioDeviceLabel());
        var o = n ? ZCMediaDevices.getVideoInputDevices() : ZCMediaDevices.getAudioInputDevices();
        return MediaTemplates._getDeviceDropDownHtml(e, a, s, o, i)
    },
    getInputDeviceDropDownHtml: function(e, t, i, n) {
        var a = e.default;
        if (t === ZCMediaDevices.kinds.VIDEO_INPUT && ZCMediaDevices.hasPreferredVideoInput()) {
            var s = ZCMediaDevices.getPreferredDevices().videoinput;
            void 0 !== s && ZCMediaDevices.isValidDevice(t, s.deviceId) && (a = s)
        }
        if (t === ZCMediaDevices.kinds.AUDIO_INPUT && ZCMediaDevices.hasPreferredAudioInput()) {
            var o = ZCMediaDevices.getPreferredDevices().audioinput;
            void 0 !== o && ZCMediaDevices.isValidDevice(t, o.deviceId) && (a = o)
        }
        if (void 0 === a) {
            var r = Object.keys(e);
            if (!r.length) return "";
            a = e[r[0]]
        }
        return MediaTemplates._getDeviceDropDownHtml(t, a.deviceId, a.label, e, i, n)
    },
    getAudioOutputDropDownHtml: function(e, t) {
        var i = ZCMediaDevices.getAudioOutputDevices(),
            n = ZCMediaDevices.kinds.AUDIO_OUTPUT,
            a = i.default;
        if (ZCMediaDevices.hasPreferredAudioOutput()) {
            var s = ZCMediaDevices.getPreferredDevices().audiooutput;
            void 0 !== s && ZCMediaDevices.isValidDevice(n, s.deviceId) && (a = s)
        }
        if (void 0 === a) {
            var o = Object.keys(i);
            if (!o.length) return "";
            a = i[o[0]]
        }
        return "" !== a.deviceId || e.includeDeviceDropDown ? MediaTemplates._getDeviceDropDownHtml(n, a.deviceId, a.label, i, e, t) : ""
    },
    getMediaCallToneUrl: function() {
        var e = {},
            t = MediaUtil.BRIDGE.Constants.MEDIADEFAULTSTATICURL + MediaCallConstants.MEDIA_PATH;
        for (var i in MediaCallConstants.fileNames)("RECORDING_START" !== i && "RECORDING_STOP" !== i || MediaCall.isRecordingConfigEnabled()) && (e[i] = t + MediaCallConstants.fileNames[i]);
        return e
    },
    updateAVStatusInContainer: function(e, t, i, n) {
        if (e.length)
            if ("audio" !== t) {
                e.find("[videoMutedStatus]").toggleClass("dN", !i);
                var a = ZCJQuery(e.find("video")[0]),
                    s = e.find("[userimagecnt]");
                i ? (a.addClass("dN"), s.removeClass("dN")) : (a.removeClass("dN"), s.addClass("dN"))
            } else e.find("[audioMutedStatus]").toggleClass("dN", !i)
    },
    adjustAudioPulsesCnt: function(e, t) {
        if (e && e.length) {
            var i = 105 * t / ZCMediaConstants.FREQUENCY_BIN_RANGE;
            i = i > 50 ? i : 0, e.css({
                width: i + "%",
                height: i + "%"
            })
        }
    },
    adjustLinearAudioLevel: function(e, t) {
        if (e && e.length) {
            e.children().length || e.html(MediaTemplates.linearAudioLevel);
            var i = 105 * t / ZCMediaConstants.FREQUENCY_BIN_RANGE;
            i >= 60 ? e.removeClass("audlvl-medium").addClass("audlvl-high") : i >= 30 ? e.removeClass("audlvl-high").addClass("audlvl-medium") : e.removeClass("audlvl-medium audlvl-high"), e.find("[audiolevel]").css({
                width: 100 - i + "%"
            })
        }
    },
    setDarkMode: function() {
        ZCJQuery("body").addClass("nite-mode"), "undefined" != typeof UI && "function" == typeof UI.isWorkPlaceBundle && UI.isWorkPlaceBundle() && wpCommunicator.send("SWITCH_NIGHTMODE", {
            enable: !0
        })
    },
    resetDarkMode: function() {
        "undefined" != typeof UI && (UI.Theme.updateTheme(), "function" == typeof UI.isWorkPlaceBundle && UI.isWorkPlaceBundle() && wpCommunicator.send("SWITCH_NIGHTMODE", {
            enable: !1
        }))
    },
    updateNetworkHealth: function(e, t) {
        var i = ZCMediaConstants.healthMeterStateText[e];
        t.find(".health-meter-status").removeClass("health-meter-status"), e > 0 && (t.removeClass("AV-health-meter-excellent AV-health-meter-good AV-health-meter-low AV-health-meter-poor AV-health-meter-deadzone"), t.addClass("AV-health-meter-" + i), t.find('[health="' + e + '"]').addClass("health-meter-status")), t.attr("title", MediaUtil.getResource("avcliq.network.strength.tooltip." + i))
    },
    removeVideoElemsStreamInContainer: function(e) {
        0 !== e.length && e.find("video").each((function() {
            this._removeStream()
        }))
    },
    showMultipleCallAlertPopup: function(e, t, i) {
        var n = MediaUtil.BRIDGE.Users.getName(e);
        MediaUtil.createDialog({
            id: "call_alert_popup",
            version: 3,
            class: "zc-av-multicall-dialog-box",
            headerhtml: $WC.$Dlg.frameHeaderHTML({
                imagehtml: MediaTemplates.getAlertPopupHeaderImage(MediaUtil.getCurrentUserId(), e),
                header: '<div class="zc-av-fontB clr-green">' + MediaUtil.getResource("multiple.call.alert.header", [$WC.$CUtil.processXSS(n)]) + "</div>",
                subheader: [MediaUtil.getResource("multiple.call.alert.subheader", [$WC.$CUtil.processXSS(n)])]
            }),
            closefn: function() {
                void 0 !== t && t()
            },
            buttons: [$WC.$Dlg.getButtonObj(MediaUtil.getResource("common.cancel"), "zc-av-multicall-btn zc-av-multicall-btn--secondary"), $WC.$Dlg.getButtonObj(MediaUtil.getResource("mediacall.end.and.proceed"), "zc-av-multicall-btn zc-av-multicall-btn--primary zc-av-mL20", (function() {
                void 0 !== i && i()
            }))]
        }, !0)
    },
    isInMaximizedView: function() {
        var e = !1;
        return PrimeTime.isInitialized() && PrimeTimeImpl.hasCurrentSession() ? e = PrimeTimeUI.isInMaximizedView() : "undefined" != typeof ConferenceImpl && ConferenceImpl.hasCurrentSession() ? e = ConferenceUI.isInMaximizedView() : "undefined" != typeof ZCSmartConferenceImpl && ZCSmartConferenceImpl.hasCurrentSession() ? e = ZCSmartConferenceUI.isInMaximizedView() : "undefined" != typeof MediaCallImpl && MediaCallImpl.hasCurrentSession() && (e = MediaCallUI.isInFullScreenView(MediaCallUI.getMediaCallWrapper(MediaCallImpl.getCurrentSession().getId()))), e
    },
    getStreamProcessingOptions: function(e) {
        return Object.assign({}, this.getAudioProcessingOptions(e), this.getVideoProcessingOptions(e))
    },
    getAudioProcessingOptions: function(e) {
        var t = !1;
        return e ? t = e.isNoiseCancellationEnabled() : void 0 !== ZCMediaPreferences && (t = ZCMediaPreferences.isAudioProcessingAllowedByUser()), {
            audio: {
                noiseCancellation: t
            }
        }
    },
    getVideoProcessingOptions: function(e) {
        var t = void 0;
        if (void 0 !== MLBackgroundProcessor) {
            var i = MLBackgroundProcessor.backgroundTypes.NONE,
                n = MLBackgroundProcessor.filterTypes.NONE;
            e ? (i = e.getSelectedVideoBackground(), n = e.getSelectedVideoFilter()) : void 0 !== ZCMediaPreferences && (i = ZCMediaPreferences.getPreferredVideoBackground(), n = ZCMediaPreferences.getPreferredVideoFilter()), t = {
                background: {
                    type: i
                },
                filter: {
                    type: n
                }
            }
        }
        return {
            video: t
        }
    },
    setAndPlayStreamInMediaContainer: function(e, t, i) {
        if (t && e.length) {
            var n = e.find("[loader]");
            n.removeClass("hide");
            var a = e.find("video")[0],
                s = i;
            i && (s = ZCMediaPreferences.isRotateVideoEnabledByUser()), a.setOrientation(s), i && (a.muted = !0), a.setStream(t), a.playStream((function() {
                n.addClass("hide")
            }))
        }
    },
    setAndGetAudioPreviewContainer: function(e) {
        if (!e._previewAudioContainer) {
            var t = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants.MEDIADEFAULTSTATICURL : $zcg._MEDIADEFAULTSTATICURL;
            e._previewAudioContainer = new Audio(t + "/bell_chime.wav"), MediaManager.setPreferredAudioOutput([e._previewAudioContainer]), e._previewAudioContainer.loop = !0
        }
        return e._previewAudioContainer
    },
    clearAudioPreview: function(e) {
        e._previewAudioContainer && (e._previewAudioContainer.muted = !0, e._previewAudioContainer.pause(), e._previewAudioContainer.srcObject = null, e._previewAudioContainer = void 0)
    },
    playDummySoundForSession: function(e, t) {
        t.attr({
            purpose: "stopDummySoundInPreviewPage"
        }), MediaUtil.playDummySound(e, t)
    },
    stopDummySoundForSession: function(e, t) {
        t.attr({
            purpose: "playDummySoundInPreviewPage"
        }), MediaUtil.stopDummySound(e, t)
    },
    playDummySound: function(e, t) {
        t.attr({
            "tooltip-title": MediaUtil.getResource("media.sound.output.pause.check")
        }), t.addClass("zcf-pause zc-av-preview-pause"), t.text("");
        var i = MediaUtil.setAndGetAudioPreviewContainer(e);
        i.muted = !1, i.play()
    },
    stopDummySound: function(e, t) {
        var i = MediaUtil.isAVLibraryLoadedInChatbar() ? "avcliq." : "";
        t.text(MediaUtil.getResource(i + "common.play")), t.removeClass("zcf-pause zc-av-preview-pause"), t.removeAttr("tooltip-title");
        var n = MediaUtil.setAndGetAudioPreviewContainer(e);
        n.muted = !0, n.pause()
    },
    changeVideoOrientation: function(e, t) {
        e.each((function() {
            ZCJQuery(this).find("video")[0].setOrientation(t)
        }))
    },
    writeToLog: function(e, t, i) {
        e.setLogString(e.getLogString() + "\n[" + new Date(Date.now()) + "] -> " + t), void 0 !== i && e.setLogString(e.getLogString() + " " + JSON.stringify(i, null, 4))
    },
    getLogAsFile: function(e, t) {
        if (e.length > 0) return t = void 0 !== t ? t : ZCMediaConstants.defaultLogFileName, new Array([new File([e], t, {
            type: "text/plain"
        }), t])
    },
    handleShowOnTop: function(e) {
        var t = e.closefn,
            i = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.getZIndex() : "1000";
        i = isNaN(i) ? i : parseInt(i) + 1, ZCJQuery("#zcwindows").css("z-index", i);
        var n = function() {
            var e = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.getZIndex() : "";
            ZCJQuery("#zcwindows").css("z-index", e), "function" == typeof t && t()
        }.bind(this);
        return Object.assign({}, e, {
            closefn: n
        })
    },
    createPopup: function(e, t) {
        return t && (e = this.handleShowOnTop(e)), $WC.$Win.create(e)
    },
    createPopupOnTop: function(e) {
        return MediaUtil.createPopup(e, !0)
    },
    createDialog: function(e, t) {
        return t && (e = this.handleShowOnTop(e)), $WC.$Dlg.create(e)
    },
    createConfirmDialog: function(e, t) {
        return t && (e = this.handleShowOnTop(e)), $WC.$Dlg.confirm(e)
    },
    waitingRoom: {
        getVideoEffectsPanelForPreview: function(e, t) {
            var i = MediaTemplates.getVideoBgEffectsPalet({
                    background: {
                        selectedType: e.getSelectedVideoBackground(),
                        customAttribute: t.customAttribute,
                        purpose: "setVideoBackgroundInPreview"
                    }
                }),
                n = "",
                a = "",
                s = "",
                o = "";
            MLBackgroundProcessor.isSeasonalVideoEffectsEnabled() && (n = "smartconf-preview-effects-popup-seasonal", s = $WC.template.replace('<div class="mT10"><span class="smartconf-preview-effects-popup-subhdr">{{content}}</span><span class="smartconf-preview-effects-seasonal-ind mL5 zcf-newfeature"></span></div>', {
                $content: "media.seasonal.effects.background.title"
            }), a = $WC.template.replace('<div class="smartconf-preview-effects-popup-subhdr mT20">{{content}}</div>', {
                $content: "media.effects.background.title"
            }), o = MediaTemplates.getSeasonalVideoBgEffectsPalet({
                background: {
                    selectedType: e.getSelectedVideoBackground(),
                    customAttribute: t.customAttribute,
                    purpose: "setVideoBackgroundInPreview"
                }
            }), o = $WC.template.replace('<div class="zc-av-video-effects-list" background_list>{{bg_palet}}</div>', {
                bg_palet: o
            }, "InSecureHTML"));
            var r = MediaTemplates.getVideoFilterEffectsPalet({
                    background: {
                        selectedType: e.getSelectedVideoBackground()
                    },
                    filter: {
                        selectedType: e.getSelectedVideoFilter(),
                        customAttribute: t.customAttribute,
                        purpose: "setVideoFilterInPreview"
                    }
                }),
                d = "";
            Conference.isVideoEffectsSettingsEnabled() && (d = $WC.template.replace('<div class="flexG mB20 pLR20"><div remember_video_effects_choice class="flexC">{{check_box}}</div></div>', {
                check_box: MediaTemplates.getCheckboxHtml("remembervideoeffectstoggle", "linkpreview.consent.checkbox", e.canRememberVideoEffects(), t.checkboxAttribute, "toggleRememberVideoEffectsInPreview", !0)
            }, "InSecureHTML"));
            var c = `<div id="conf_preview_effects_popup" class="zcl-popup smartconf-preview-effects-popup flex-col ovrflwH dN">\n\t\t\t\t\t<div class="smartconf-preview-effects-popup-hdr flexC pLR5 fshrink">\n\t\t\t\t\t\t<div class="zcl-hor-tab fshrink w100">\n\t\t\t\t\t\t\t<div id="conf_preview_effects_bgs_hdr" class="zcl-hor-tab-item sel" {{custom_attribute}} purpose="switchToBackgroundImgEffectInPreview">\n\t\t\t\t\t\t\t\t<div class="ellips">${I18N("media.effects.background.title")}</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div id="conf_preview_effects_filters_hdr" class="zcl-hor-tab-item" {{custom_attribute}} purpose="switchToBackgroundFilterEffectInPreview">\n\t\t\t\t\t\t\t\t<div class="ellips">${I18N("media.effects.filters.title")}</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<span class="zcl-close sm zcf-close" {{custom_attribute}} purpose="closeVideoEffectsInPreview"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id="conf_preview_effects_bgs" class="pLR20 mB20 ovrflwA flexG {{seasonal_class}}">\n\t\t\t\t\t\t{{seasonal_bg_title}}\n\t\t\t\t\t\t{{seasonal_bg_palet}}\n\t\t\t\t\t\t{{bg_title}}\n\t\t\t\t\t\t<div class="zc-av-video-effects-list" background_list>{{bg_palet}}</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id="conf_preview_effects_filters" class="pLR20 mB20 ovrflwA flexG dN">\n\t\t\t\t\t\t<div class="zc-av-video-effects-list" filters_list>{{filter_palet}}</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t{{remember_choice}}\n\t\t\t\t</div>`;
            return $WC.template.replace(c, {
                bg_palet: i,
                seasonal_bg_palet: o,
                filter_palet: r,
                seasonal_class: n,
                seasonal_bg_title: s,
                bg_title: a,
                remember_choice: d,
                custom_attribute: t.customAttribute
            }, "InSecureHTML")
        },
        showVideoEffectsInPreview: function(e, t, i, n, a) {
            var s = function() {
                    if (Conference.isVideoEffectsSettingsEnabled() && i.canRememberVideoEffects()) {
                        var e = i.getSelectedVideoBackground(),
                            t = i.getSelectedVideoFilter(),
                            n = {};
                        if (e !== ZCMediaPreferences.getPreferredVideoBackground()) n = MLBackgroundProcessor.backgroundTypes.isSeasonalImage(e) ? {
                            seasonal_video_background: e
                        } : {
                            video_background: e,
                            seasonal_video_background: MLBackgroundProcessor.backgroundTypes.NONE
                        };
                        t !== ZCMediaPreferences.getPreferredVideoFilter() && (n.video_filter = t), $WC.Util.isEmptyObject(n) || Settings.update(n)
                    }
                },
                o = "conf_preview_effects_popup";
            if (0 === n.find("#" + o).length) {
                var r = MediaUtil.waitingRoom.getVideoEffectsPanelForPreview(i, {
                    customAttribute: a.customAttribute,
                    checkboxAttribute: a.checkboxAttribute
                });
                t.addClass("active"), n.append(r), Clickoutside.bind({
                    event: e,
                    srcid: t.attr("id"),
                    destid: o,
                    doNotClose: function(e, t, i) {
                        return i && "conf_preview_effects_popup_opt" === i.target.id
                    },
                    customShow: function() {
                        $("#conf_preview_effects_popup").removeClass("dN")
                    },
                    customHide: function(e) {
                        s(), t.removeClass("active"), $("#" + e.destid).remove()
                    }
                });
                var d = t.offset(),
                    c = $("#conf_preview_effects_popup");
                c.css("left", d.left - c.width() + t.width() + 385), c.css("top", d.top + t.height() - 250)
            } else s(), t.removeClass("active"), $("#" + o).remove(), Clickoutside.clear(o)
        },
        closeVideoEffectsInPreview: function(e, t) {
            Clickoutside.handleClickOnChild(e)
        },
        switchToBackgroundImgEffectInPreview: function(e, t) {
            $("#conf_preview_effects_bgs_hdr").addClass("sel"), $("#conf_preview_effects_filters_hdr").removeClass("sel"), $("#conf_preview_effects_filters").addClass("dN"), $("#conf_preview_effects_bgs").removeClass("dN")
        },
        switchToBackgroundFilterEffectInPreview: function(e, t) {
            $("#conf_preview_effects_filters_hdr").addClass("sel"), $("#conf_preview_effects_bgs_hdr").removeClass("sel"), $("#conf_preview_effects_bgs").addClass("dN"), $("#conf_preview_effects_filters").removeClass("dN")
        },
        setVideoBackgroundInPreview: function(e, t, i, n) {
            if (!i.isRequestPending(ZCMediaConstants.requests.applyPreviewVideoBackgroundEffect)) {
                $("#conf_preview_effects_popup").find("[background_list] [list_item]").removeClass("zc-av-video-effects-list-item-active"), t.addClass("zc-av-video-effects-list-item-active");
                var a = i.getSelectedVideoBackground(),
                    s = t.attr("value");
                if (i.setSelectedVideoBackground(s), i.hasVideoUpStream() && a !== s) {
                    var o = n.find("[loader]");
                    o.removeClass("hide");
                    var r = t.find("[loader]");
                    r.removeClass("dN"), i.setRequestAsPending(ZCMediaConstants.requests.applyPreviewVideoBackgroundEffect), MLBackgroundProcessor.applyVideoBackground(i.getVideoUpStream(), s, (function(e) {
                        o.addClass("hide"), r.addClass("dN"), i.setRequestAsCompleted(ZCMediaConstants.requests.applyPreviewVideoBackgroundEffect), e && (i.setVideoUpStream(e), Conference.applyVideoConstraints(e, i), MediaUtil.setAndPlayStreamInMediaContainer(n, e, !0))
                    }))
                }
            }
        },
        setVideoFilterInPreview: function(e, t, i, n) {
            if (!i.isRequestPending(ZCMediaConstants.requests.applyPreviewVideoBackgroundEffect)) {
                $("#conf_preview_effects_popup").find("[filters_list] [list_item]").removeClass("zc-av-video-effects-list-item-active"), t.addClass("zc-av-video-effects-list-item-active");
                var a = i.getSelectedVideoFilter(),
                    s = t.attr("value");
                if (i.setSelectedVideoFilter(s), i.hasVideoUpStream()) {
                    var o = i.getVideoUpStream();
                    if (a !== s) {
                        var r = n.find("[loader]");
                        r.removeClass("hide");
                        var d = t.find("[loader]");
                        d.removeClass("dN"), i.setRequestAsPending(ZCMediaConstants.requests.applyPreviewVideoBackgroundEffect), MLBackgroundProcessor.applyVideoFilter(o, s, (function(e) {
                            r.addClass("hide"), d.addClass("dN"), i.setRequestAsCompleted(ZCMediaConstants.requests.applyPreviewVideoBackgroundEffect), e && (i.setVideoUpStream(e), Conference.applyVideoConstraints(e, i), MediaUtil.setAndPlayStreamInMediaContainer(n, e, !0))
                        }))
                    }
                }
            }
        }
    },
    showUDPBlockedWarning: function(e) {
        var t = e.find("[avcliq_alert_indication]");
        0 === t.children().length && t.append(MediaTemplates.getUDPBlockedWarningInfo(e.attr("id"))), t.removeClass("zc-av-dN")
    },
    showLiveTrackingNotification: function(e, t, i) {
        let n = ZCJQuery("#avcliq_alert_indication");
        ZCJQuery("#avcliq_live_tracking_info").remove(), n.html(MediaTemplates.getLiveTrackingAlertInfo(e, t)).removeClass("zc-av-dN"), clearTimeout(MediaUtil.liveTrackingNotificationTimeout), MediaUtil.liveTrackingNotificationTimeout = setTimeout(i, MediaUtil.liveTrackingNotificationTimeoutDuration)
    },
    showAlertInfoInHeader: function(e, t, i, n) {
        Clickoutside.handleClickOnChild(e);
        let a = ZCJQuery("#" + i);
        if (a.length > 0) return void a.remove();
        let s = t.attr("parentDomId"),
            o = ZCJQuery("#" + s);
        o.append(n), Clickoutside.bind({
            event: e,
            srcid: t.attr("id"),
            destid: i,
            doNotClose: function(e, t, i) {
                return i && e.srcid && i.target.id === e.srcid
            },
            customHide: function(e) {
                ZCJQuery("#" + e.destid).remove()
            }
        }), a = ZCJQuery("#" + i);
        var r = $ZCUtil.positionTargetElementUpDown(t, a, {
                $parentElement: o
            }),
            d = a.offset().left + r.left + a.outerWidth(),
            c = ZCJQuery(document).outerWidth();
        (d < 0 || d > c) && (r.left = -r.left), a.css({
            top: r.top,
            bottom: r.bottom,
            left: r.left
        })
    },
    WebRTCStats: {
        statsKeyMapping: {
            constants: {
                network: "networkstats",
                connection: "connectionstats",
                ssrc: "ssrcstats"
            },
            networkstats: {
                network_type: "network_type",
                loc_add: "local_ip",
                rem_add: "remote_ip",
                l_c_t: "local_candidate_type",
                r_c_t: "remote_candidate_type",
                l_t_p: "local_protocol",
                r_t_p: "remote_protocol",
                codec: "codec"
            },
            connectionstats: {
                rtt: "rtt",
                t_rtt: "totalrtt",
                res_r: "responsesreceived",
                res_s: "responsessent",
                b_r: "bytesreceived",
                b_s: "bytessent",
                p_r: "packetsreceived",
                p_s: "packetssent",
                p_d_s: "packetsdiscardedonsend",
                a_o_b: "availableoutgoingbitrate",
                a_i_b: "availableincomingbitrate",
                a_l: {
                    upstream: {
                        audio: "upstreamaudiolevel"
                    }
                }
            },
            ssrcstats: {
                b_s: {
                    upstream: {
                        audio: "audiobytessent",
                        video: "videobytessent",
                        screen: "screenbytessent"
                    }
                },
                b_r: {
                    downstream: {
                        audio: "audiobytesreceived",
                        video: "videobytesreceived",
                        screen: "screenbytesreceived"
                    }
                },
                p_s: {
                    upstream: {
                        audio: "audiopacketssent",
                        video: "videopacketssent",
                        screen: "screenpacketssent"
                    }
                },
                p_r: {
                    downstream: {
                        audio: "audiopacketsreceived",
                        video: "videopacketsreceived",
                        screen: "screenpacketsreceived"
                    }
                },
                p_l: {
                    upstream: {
                        audio: "sendaudiopacketlost",
                        video: "sendvideopacketlost",
                        screen: "sendscreenpacketlost"
                    },
                    downstream: {
                        audio: "recvaudiopacketlost",
                        video: "recvvideopacketlost",
                        screen: "recvscreenpacketlost"
                    }
                },
                p_c: {
                    upstream: {
                        video: "upstreamplicount",
                        screen: "screenupstreamplicount"
                    },
                    downstream: {
                        video: "downstreamplicount",
                        screen: "screendownstreamplicount"
                    }
                },
                n_c: {
                    upstream: {
                        audio: "upstreamaudionackcount",
                        video: "upstreamvideonackcount",
                        screen: "screenupstreamnackcount"
                    },
                    downstream: {
                        audio: "downstreamaudionackcount",
                        video: "downstreamvideonackcount",
                        screen: "screendownstreamnackcount"
                    }
                },
                f_d: {
                    downstream: {
                        video: "framesdecoded",
                        screen: "screenframesdecoded"
                    }
                },
                f_w: {
                    upstream: {
                        video: "upstreamframewidth",
                        screen: "screenupstreamframewidth"
                    },
                    downstream: {
                        video: "downstreamframewidth",
                        screen: "screendownstreamframewidth"
                    }
                },
                f_h: {
                    upstream: {
                        video: "upstreamframeheight",
                        screen: "screenupstreamframeheight"
                    },
                    downstream: {
                        video: "downstreamframeheight",
                        screen: "screendownstreamframeheight"
                    }
                },
                f_r: {
                    upstream: {
                        video: "upstreamframespersecond",
                        screen: "screenupstreamframespersecond"
                    },
                    downstream: {
                        video: "downstreamframespersecond",
                        screen: "screendownstreamframespersecond"
                    }
                },
                f_s: {
                    upstream: {
                        video: "videoframessent",
                        screen: "screenframessent"
                    }
                },
                f_dr: {
                    downstream: {
                        video: "framesdropped",
                        screen: "screenframesdropped"
                    }
                },
                f_rc: {
                    downstream: {
                        video: "framesreceived",
                        screen: "screenframesreceived"
                    }
                },
                t_i_f_d: {
                    downstream: {
                        video: "totalinterframedelay",
                        screen: "screentotalinterframedelay"
                    }
                },
                t_d_t: {
                    downstream: {
                        video: "totaldecodetime",
                        screen: "screentotaldecodetime"
                    }
                },
                f_p_r: {
                    downstream: {
                        audio: "fecpacketsreceived"
                    }
                },
                f_p_d: {
                    downstream: {
                        audio: "fecpacketsdiscarded"
                    }
                },
                jitter: {
                    upstream: {
                        audio: "sendaudiojitter",
                        video: "sendvideojitter",
                        screen: "sendscreenjitter"
                    },
                    downstream: {
                        audio: "recvaudiojitter",
                        video: "recvvideojitter",
                        screen: "recvscreenjitter"
                    }
                },
                a_l: {
                    downstream: {
                        audio: "downstreamaudiolevel"
                    }
                }
            },
            getObject: function(e, t, i) {
                let n = {},
                    a = this[e];
                for (let e in a) {
                    let s = a[e];
                    "object" == typeof s ? void 0 !== (s = s[i.isUpStream ? "upstream" : "downstream"]) && void 0 !== (s = s[i.connectionType]) && (s = t[s]) : s = t[s], void 0 !== s && (n[e] = s)
                }
                return n
            }
        },
        getBasicStatsInfo: function(e) {
            return {
                media_type: e.connectionType,
                is_upstream: e.isUpStream,
                callid: e.conferenceId,
                userid: $zcg._ZUID,
                timestamp: "undefined" != typeof $ZCUtil ? $ZCUtil.getSyncedCurrentTime() : Date.now()
            }
        },
        pushNetworkStatsViaWebSocket: function(e, t) {
            let i = this.getBasicStatsInfo(t),
                n = this.statsKeyMapping.getObject(this.statsKeyMapping.constants.network, e, t);
            n.opr = "candidatestats", Object.assign(i, n), MediaAPI.pushStatsViaWebSocket(i)
        },
        pushConnectionStatsViaWebSocket: function(e, t) {
            let i = this.getBasicStatsInfo(t),
                n = {
                    opr: "clientstats",
                    stats: {}
                };
            for (let i in e) {
                let a = e[i],
                    s = {},
                    o = this.statsKeyMapping.getObject(this.statsKeyMapping.constants.connection, a, t);
                s.connectionstats = o;
                let r = {},
                    d = a.ssrclist;
                for (let e of d) {
                    let i = a[e];
                    void 0 !== i && (r[e] = this.statsKeyMapping.getObject(this.statsKeyMapping.constants.ssrc, i, t))
                }
                s.ssrcstats = r, void 0 !== a.layout && (s.layout = a.layout), void 0 !== a.streamdetails && (s.streamdetails = a.streamdetails), n.stats[i] = s
            }
            Object.assign(i, n), MediaAPI.pushStatsViaWebSocket(i)
        },
        getNetworkStatsPayload: function(e, t, i) {
            var n = {
                data: e,
                stats_api_format: t,
                stats_type: "network"
            };
            return void 0 !== i && (void 0 !== i.isUpStream && (n.is_upstream = i.isUpStream), void 0 !== i.connectionType && (n.connection_type = i.connectionType)), n
        },
        getConnectionStatsPayload: function(e, t) {
            var i = {
                data: e,
                stats_type: "connection"
            };
            return void 0 !== t && (void 0 !== t.isUpStream && (i.is_upstream = t.isUpStream), void 0 !== t.connectionType && (i.connection_type = t.connectionType)), i
        }
    },
    videoResolutions: function() {
        var e = ["720", "480"],
            t = "720",
            i = {
                720: {
                    width: {
                        min: 1280,
                        max: 1280
                    },
                    height: {
                        min: 720,
                        max: 720
                    }
                },
                480: {
                    width: {
                        min: 640,
                        max: 640
                    },
                    height: {
                        min: 480,
                        max: 480
                    }
                }
            };
        return {
            getSupportedResolutions: function() {
                return e
            },
            getPreferredVideoRes: function() {
                return t
            },
            setPreferredVideoRes: function(e) {
                e && (t = e)
            },
            getConstraintsForVideoRes: function(e) {
                return {
                    video: i[e]
                }
            }
        }
    }()
}, MediaManager = function() {
    var e = !1,
        t = !1,
        i = !1,
        n = !1,
        a = {
            isRequested: !1,
            type: void 0,
            module: void 0
        },
        s = void 0,
        o = [],
        r = null,
        d = {};

    function c() {
        return void 0 !== WebRTCUserMedia
    }

    function l(e, t, i, n) {
        clearTimeout(s), s = setTimeout((function() {
            u(e, t, i, n)
        }), 3e3)
    }

    function u(e, t, i, n) {
        if (void 0 !== t || i || n) {
            var a = MediaUtil.getResource("common.device.camera.mic"),
                s = "",
                o = "";
            i && n ? (a = MediaUtil.getResource("common.device.camera.mic"), o = $WC.template.replace(MediaTemplates.permissionOverlayIcon, {
                class_name: "zcf-mic"
            }), o += $WC.template.replace(MediaTemplates.permissionOverlayIcon, {
                class_name: "zcf-video"
            })) : n ? (a = MediaUtil.getResource("common.device.mic"), o = $WC.template.replace(MediaTemplates.permissionOverlayIcon, {
                class_name: "zcf-mic"
            })) : i && (a = MediaUtil.getResource("common.device.camera"), o += $WC.template.replace(MediaTemplates.permissionOverlayIcon, {
                class_name: "zcf-video"
            })), t === ZCMediaConstants.mediaModules.CONFERENCE && (s = MediaUtil.getResource("media.access.permission", [MediaUtil.getResource("media.conference"), a]));
            var r = $WC.template.replace(MediaTemplates.permissionOverlay, {
                permission_overlay_icon: o
            }, "InSecureHTML");
            r = $WC.template.replace(r, {
                $header: MediaUtil.getResource("common.permission.device", [a]),
                permission: s,
                $close: "common.to.close",
                $ok: "common.okgotit",
                class_name: $ZCUtil.Browser.isSafari() ? "safari" : ""
            }), MediaUtil.createPopup({
                id: "permissionInfo",
                class: "zcalgncntr zcbg_mask zc-av-permission-modal",
                html: r
            }, !0)
        }
    }

    function p() {
        return "undefined" != typeof PrimeTimeImpl && PrimeTimeImpl.hasCurrentSession()
    }

    function f() {
        return "undefined" != typeof ConferenceImpl && ConferenceImpl.hasCurrentSession()
    }

    function m() {
        return "undefined" != typeof ZCSmartConferenceImpl && ZCSmartConferenceImpl.hasCurrentSession()
    }

    function v() {
        return "undefined" != typeof MediaCallImpl && (MediaCallImpl.hasCurrentSession() || MediaCallImpl.hasOutgoingSession())
    }

    function C(e, t, i) {
        var n = MediaUtil.isAVLibraryLoadedInChatbar() ? "avcliq." : "",
            a = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants._cssClasses : $zcg._cssClasses,
            s = i ? "added" : "switched",
            o = "";
        ZCMediaDevices.isAudioInputDeviceKind(e) ? o = n + "media.setdevices.audioinput" : ZCMediaDevices.isAudioOutputDeviceKind(e) && (o = n + "media.setdevices.audiooutput");
        var r = n + "media.device." + s,
            d = r + ".header",
            c = r + ".info";
        MediaUtil.createDialog({
            id: "device_switched_info",
            version: 2,
            class: "zcdalogbx zcbg_mask alert_dialog zc-av-device-switch-popup",
            headerhtml: $WC.$Dlg.frameHeaderHTML({
                header: MediaUtil.getResource(d, MediaUtil.getResource(o))
            }),
            bodyhtml: $WC.$Dlg.frameBodyInfoHTML({
                info: [MediaUtil.getResource(c, [MediaUtil.getResource(o).toLowerCase(), $WC.$CUtil.processXSS(t)])]
            }),
            buttons: [$WC.$Dlg.getButtonObj(MediaUtil.getResource(n + "common.okay"), a.SECONDARY_BTN)]
        }, !0)
    }

    function _(e, t) {
        MediaUtil.createConfirmDialog({
            id: "handlemediasessionsdialog",
            version: 2,
            class: "zcdalogbx zcbg_mask alert_dialog",
            headerhtml: $WC.$Dlg.frameHeaderHTML({
                imagehtml: '<div class="mheader_icn msi-alrt clr-green"></div>'
            }),
            bodyhtml: $WC.$Dlg.frameBodyInfoHTML({
                info: [t]
            }),
            buttons: [{
                text: MediaUtil.getResource("common.goahead"),
                colour: $WC.$Dlg.GREEN_BUTTON,
                action: e
            }]
        }, !0)
    }

    function g() {
        $WC.$Win.destroy("permissionInfo")
    }

    function h() {
        void 0 !== MediaUtil.BRIDGE && MediaUtil.BRIDGE.isMediaFeedbackEnabled() && (i || n || (n = !0, MediaAPI.getFeedbackOptions((function(e) {
            n = !1, i = !0, ZCMediaFeedback.updateTemplateOptions(e.data.feedback)
        }), (function() {
            n = !1
        }))))
    }
    return "undefined" != typeof $ZCUtil && $ZCUtil.isJQueryAvailable() && void 0 === window.ZCJQuery && (window.ZCJQuery = window.jQuery), {
        isInitialized: c,
        bindEvents: function() {
            if (!t) {
                ZCJQuery(document).on("click", "[mediamodulebuttons]", (function(e) {
                    e.stopPropagation();
                    var t = ZCJQuery(this),
                        i = t.attr("purpose");
                    MediaHandler.UIEvents[i](e, t)
                })), ZCJQuery(document).on("change", '[mediamodulecheckbox][type="checkbox"]', (function(e) {
                    e.stopPropagation();
                    var t = ZCJQuery(this),
                        i = t.attr("purpose");
                    MediaHandler.UIToggleEvents[i](e, t)
                })), ZCJQuery(document).on("change", '[mediamoduleradiobuttons] [type="radio"]', (function(e) {
                    var t = ZCJQuery(this),
                        i = t.parents("[mediamoduleradiobuttons]").attr("purpose");
                    MediaHandler.UIToggleEvents[i](e, t)
                })), ZCJQuery(document).on("keydown", (function(e) {
                    if (32 === e.keyCode && "composer" !== ZCJQuery(e.target).attr("data-type")) {
                        var t = void 0 !== Conference && Conference.startPushToTalk();
                        void 0 === MediaCall || t || MediaCall.startPushToTalk()
                    } else e.altKey && 65 == e.keyCode && MediaManager.handleMuteShortCut() && e.preventDefault()
                })), ZCJQuery(document).on("keyup", (function(e) {
                    var t = e.keyCode;
                    if (32 === t && "composer" !== ZCJQuery(e.target).attr("data-type")) {
                        var i = void 0 !== Conference && Conference.stopPushToTalk();
                        void 0 === MediaCall || i || MediaCall.stopPushToTalk()
                    } else if (37 === t || 39 === t) {
                        i = !1;
                        void 0 !== PresentationImpl && (i = PresentationImpl.navigateSlidesByShortcut(t))
                    }
                })), window.addEventListener("resize", (function() {
                    void 0 !== MediaCall && $ZCUtil.debounce(MediaCall.handleResize(), "", 300)
                })), t = !0
            }
        },
        prefetchMetaDetails: function(e) {
            ZCMediaDevices.syncPreferredDevices(e), h()
        },
        fetchFeedbackTemplate: h,
        applyVideoConstraints: function(e, t) {
            e instanceof MediaStream && e._hasVideoTrack() && e._getPrimaryVideoTrack().applyConstraints(t).catch()
        },
        getComputerAudioConstraints: function() {
            return _isZCDesktopApp() && $ZCUtil.isWindowsOs() ? {
                audio: {
                    mandatory: {
                        chromeMediaSource: "desktop"
                    }
                }
            } : {
                audio: {
                    autoGainControl: !1,
                    echoCancellation: !1,
                    noiseSuppression: !1,
                    channelCount: 2,
                    latency: 0,
                    sampleRate: 48e3,
                    sampleSize: 16,
                    volume: 1
                }
            }
        },
        isStreamRequested: function() {
            return a.isRequested
        },
        setAsStreamRequested: function(e, t) {
            a = {
                isRequested: !0,
                type: e,
                module: t
            };
            var i = e === WebRTCUserMedia.streamTypes.AUDIO_VIDEO || e === WebRTCUserMedia.streamTypes.VIDEO_ONLY,
                n = e === WebRTCUserMedia.streamTypes.AUDIO_VIDEO || e === WebRTCUserMedia.streamTypes.AUDIO_ONLY;
            if (n || i)
                if (WebRTCUserMedia.isPermissionQuerySupported()) {
                    var s = function() {
                            l(e, t, i, n)
                        },
                        o = function(a) {
                            i = a === ZCMediaConstants.devicePermissionStates.PROMPT, MediaManager.checkAndShowPermissionWindow(e, t, i, n)
                        };
                    n ? WebRTCUserMedia.getAudioPermission((function(i) {
                        n = i === ZCMediaConstants.devicePermissionStates.PROMPT, e === WebRTCUserMedia.streamTypes.AUDIO_VIDEO ? WebRTCUserMedia.getVideoPermission(o, s) : MediaManager.checkAndShowPermissionWindow(e, t, !1, n)
                    }), s) : WebRTCUserMedia.getVideoPermission(o, s)
                } else l(e, t, i, n)
        },
        resetStreamRequested: function() {
            clearTimeout(s), a = {
                isRequested: !1,
                type: void 0,
                module: void 0
            }, g()
        },
        showPermissionWindowUI: u,
        isRequestPending: function() {
            return null != r
        },
        setRequestPending: function(e) {
            r = e
        },
        setRequestCompleted: function() {
            r = null
        },
        getPendingRequestDetails: function() {
            return r
        },
        isCustomRequestPending: function(e) {
            return d[e]
        },
        setCustomRequestAsPending: function(e) {
            d[e] = !0
        },
        setCustomRequestAsCompleted: function(e) {
            delete d[e]
        },
        initialize: function(t) {
            function i() {
                e = !1, o.forEach((function(e) {
                    "function" == typeof e && e()
                })), o = []
            }
            o.push(t), c() ? i() : e || (e = !0, $ZCUtil.loadMultipleFiles("script", $zcg._VIDEOCHATPROPS.MEDIACOMPONENTS_JS_LIST, i, $zcg._VIDEOCHATPROPS.MEDIACOMPONENTS_JS_INTEGRITY_LIST))
        },
        isOrgScope: function(e) {
            return e === ZCMediaConstants.scopeTypes.ORG
        },
        isTeamScope: function(e) {
            return e === ZCMediaConstants.scopeTypes.TEAM
        },
        isChatScope: function(e) {
            return e === ZCMediaConstants.scopeTypes.CHAT
        },
        isEventScope: function(e) {
            return e === ZCMediaConstants.scopeTypes.EVENT
        },
        isPersonalScope: function(e) {
            return e === ZCMediaConstants.scopeTypes.PERSONAL
        },
        isOpenScope: function(e) {
            return e === ZCMediaConstants.scopeTypes.OPEN
        },
        getImgUrl: function(e) {
            return (void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants.IMGDEFAULTSTATICURL : $zcg._IMGDEFAULTSTATICURL) + "/media/" + e
        },
        showExtensionInstallPreview: function(e) {
            var t = $WC.template.replace('<div class="cliqextn-mc"><div class="dflx"><div class="cliqextn-mc-img dflxjustcent fshrink"><img src="{{src}}" class="h100 w100"></div><div class="mL30"><div class="font16 lin22 mrgT5">{{hint}}</div><div class="mrgT15 dbtn cliqextn-mc-btn" {{event_attribute}} purpose="goToStore">{{btn_text}}</div></div></div></div>', {
                $hint: "extension.install.hint",
                $btn_text: "extension.install",
                event_attribute: e,
                src: (void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants.IMGDEFAULTSTATICURL : $zcg._IMGDEFAULTSTATICURL) + "/logo/v1/cliq-icon.ico"
            });
            $WC.$Win.create({
                id: "extension_install_preview",
                header: $WC.template.replace('<div class="dflxcent w100 pR25 pL25"><span class="font17 flxG clr0 bold">{{header}}</span></div>', {
                    $header: "extension.install.header"
                }),
                html: t,
                class: "cliqextn-win adchtwin"
            })
        },
        handleExistingSessions: function(e) {
            if ($WC.$Dlg.destroy("handlemediasessionsdialog"), p()) _((function() {
                PrimeTimeImpl.handleEnd(!0), e()
            }), MediaUtil.getResource("media.endprimetime.info"));
            else if (f()) {
                var t = ConferenceImpl.getCurrentSession().isAudioConference() ? "conference.audio.title" : "conference.video.title";
                _((function() {
                    ConferenceImpl.handleEnd(!0), e()
                }), MediaUtil.getResource("media.endconference.info", [MediaUtil.getResource(t)]))
            } else if (m()) {
                var i = ZCSmartConferenceImpl.getCurrentSession();
                t = i.isAudioConference() ? "conference.audio.title" : "conference.video.title";
                _((function() {
                    ZCSmartConferenceImpl.endConference(i.getId(), !0), e()
                }), MediaUtil.getResource("media.endconference.info", [MediaUtil.getResource(t)]))
            } else if (v()) {
                var n = MediaCallImpl.hasOutgoingSession() ? MediaCallImpl.getOutgoingSession() : MediaCallImpl.getCurrentSession(),
                    a = n.isAudioCall() ? "videochat.audiocall" : n.isVideoCall() ? "videochat.videocall" : "media.screenshare.session",
                    s = n.isCaller(MediaUtil.getCurrentUserId()) ? n.getCallee().getName() : n.getCaller().getName();
                _((function() {
                    MediaCallImpl.handleEnd(n.getId(), !0), e()
                }), MediaUtil.getResource("media.endcall.info", [MediaUtil.getResource(a), s]))
            } else if ("undefined" != typeof ZCSmartConferenceImpl && ZCSmartConferenceImpl.hasJoiningSession()) ZCSmartConferenceImpl.closePreviewRoom(ZCSmartConferenceConstants.previewCloseSource.clearExistingSession), e();
            else if ("undefined" != typeof ZCMediaRecorderImpl && ZCMediaRecorderImpl.hasCurrentRecordingSession()) {
                var o = ZCMediaRecorderImpl.getCurrentRecordingSession(),
                    r = "media.endrecord.info";
                o.isVideoMessage() ? r = "video.endrecord.info" : o.isScreenRecording() && (r = "screen.endrecord.info"), _((function() {
                    ZCMediaRecorderImpl.handleEnd(o.getId()), e()
                }), MediaUtil.getResource(r))
            } else e()
        },
        handleMediaError: function(e, t) {
            g();
            var i = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.ServerConstants.AVTROUBLESHOOTINGDOC : $zcg._AVTROUBLESHOOTINGDOC,
                n = "",
                a = "",
                s = "",
                o = "";
            if (WebRTCUserMedia.isAudioStreamType(t) ? (n = MediaUtil.getResource("common.device.mic"), a = MediaUtil.getResource("avcliq.media.audio")) : WebRTCUserMedia.isAudioVideoStreamType(t) ? (n = MediaUtil.getResource("common.device.camera.mic"), a = MediaUtil.getResource("avcliq.media.audio.video")) : WebRTCUserMedia.isScreenStreamType(t) ? (n = MediaUtil.getResource("avcliq.common.screen"), a = MediaUtil.getResource("avcliq.common.screen")) : (n = MediaUtil.getResource("common.device.camera"), a = MediaUtil.getResource("avcliq.media.video")), e.name === WebRTCUserMedia.errors.NotAllowedError) s = "notallowederror", i += $ZCUtil.isMacOs() ? "#Mac" : $ZCUtil.isWindowsOs() ? "#Windows" : "", o = $WC.$Dlg.frameBodyInfoHTML({
                infoheader: MediaUtil.getResource("avcliq.media.browser.troubleshoot.header"),
                info: [MediaUtil.getResource("avcliq.media.browser.notallowederror.infoone"), MediaUtil.getResource("avcliq.media.browser.notallowederror.infotwo", [n.toLowerCase(), a.toLowerCase(), window.location.hostname])]
            }), o += $WC.$Dlg.frameBodyInfoHTML({
                infoheader: MediaUtil.getResource("avcliq.media.system.troubleshoot.header"),
                info: [MediaUtil.getResource("avcliq.media.system.notallowederror.info", [n.toLowerCase(), a.toLowerCase()])]
            });
            else if (e.name === WebRTCUserMedia.errors.NotFoundError || e.name === WebRTCUserMedia.errors.NotReadableError) {
                s = "notfounderror", i += "#Not_Found_Error__Not_Readable_Error";
                var r = [MediaUtil.getResource("avcliq.media.notfounderror.infoone", [n.toLowerCase(), a.toLowerCase()]), MediaUtil.getResource("avcliq.media.notfounderror.infotwo", [n, a])];
                WebRTCUserMedia.isScreenStreamType(t) || r.push(MediaUtil.getResource("avcliq.media.notfounderror.infothree", [n.toLowerCase(), a.toLowerCase()])), o = $WC.$Dlg.frameBodyInfoHTML({
                    infoheader: MediaUtil.getResource("avcliq.media.troubleshoot.header"),
                    info: r
                })
            } else if (e.name === WebRTCUserMedia.errors.BadAudioTrackError) s = "badaudiotrackerror", i += "#_8", o = $WC.$Dlg.frameBodyInfoHTML({
                infoheader: MediaUtil.getResource("avcliq.media.troubleshoot.header"),
                info: [MediaUtil.getResource("avcliq.media.badaudiotrackerror.infoone"), MediaUtil.getResource("avcliq.media.badaudiotrackerror.infotwo")]
            });
            else {
                if (e.name !== WebRTCUserMedia.errors.AbortError || WebRTCUserMedia.isScreenStreamType(t)) return void 0 !== e.code && void 0 !== e.message ? void("undefined" != typeof UI && void 0 !== UI.updateBanner && UI.updateBanner(MediaUtil.getResource(e.message), 2e3, !0)) : void 0;
                s = "aborterror", i += "#Abort_Error", o = $WC.$Dlg.frameBodyInfoHTML({
                    infoheader: MediaUtil.getResource("avcliq.media.troubleshoot.header"),
                    info: [MediaUtil.getResource("avcliq.media.aborterror.info", [n.toLowerCase(), a.toLowerCase()])]
                })
            }
            var d = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants._cssClasses : $zcg._cssClasses;
            MediaUtil.createDialog({
                id: "mediaerrorpopup",
                version: 3,
                class: "zcdalogbx zcbg_mask alert_dialog",
                headerhtml: $WC.$Dlg.frameHeaderHTML({
                    imagehtml: '<div class="mheader_icn msi-alrt clr-red"></div>',
                    header: MediaUtil.getResource("avcliq.media.error." + s, [n, a])
                }),
                bodyhtml: o,
                buttons: [$WC.$Dlg.getButtonObj("common.close", d.SECONDARY_BTN), $WC.$Dlg.getButtonObj("common.learnmore", d.PRIMARY_BTN, (function() {
                    window.open(i, "_blank")
                }))]
            }, !0)
        },
        showTrackEndedInfo: function(e, t) {
            var i = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants._cssClasses : $zcg._cssClasses;
            MediaUtil.createDialog({
                id: "track_ended_info",
                version: 3,
                class: "zcdalogbx zcbg_mask alert_dialog",
                headerhtml: $WC.$Dlg.frameHeaderHTML({
                    imagehtml: '<div class="mheader_icn msi-alrt clr-red"></div>',
                    header: MediaUtil.getResource("media.audio.trackended.header")
                }),
                bodyhtml: $WC.$Dlg.frameBodyInfoHTML({
                    info: [MediaUtil.getResource("media.audio.trackended.info")]
                }),
                buttons: [$WC.$Dlg.getButtonObj("common.close", i.SECONDARY_BTN), $WC.$Dlg.getButtonObj("media.device.settings", i.PRIMARY_BTN, t)]
            }, !0)
        },
        checkAndShowMicSwitchedInfo: function(e, t, i) {
            e._getAudioDeviceId() === t._getAudioDeviceId() && e._getAudioDeviceLabel() === t._getAudioDeviceLabel() || ($WC.$Win.destroy("track_ended_info"), $WC.$Win.destroy("device_switched_info"), MediaManager.showMicSwitchedInfo(ZCMediaDevices.kinds.AUDIO_INPUT, e, i))
        },
        checkAndShowAddedSpeakerSwitchedInfo: function(e) {
            $WC.$Win.destroy("track_ended_info"), $WC.$Win.destroy("device_switched_info"), MediaManager.showAddedSpeakerSwitchedInfo(e)
        },
        showMicSwitchedInfo: function(e, t, i) {
            C(e, t._getAudioDeviceLabel(), i)
        },
        showAddedSpeakerSwitchedInfo: function(e) {
            C(e.kind, e.label, !0)
        },
        getCallOptionsHtmlForCwin: function(e, t) {
            var i = "",
                n = [];
            if (e.isOnetoOneChat()) {
                Participants.get(e.chid);
                var a = e.getPermission().video;
                let u = ConversationsList.isThreadChat(e.chid) || $zcg.isGuestUser ? "" : '<span class="zcl-btn-separator cht-btn-separator"></span>';
                if (!a) return i;
                if (MediaCall.isAudioCallAllowed() && n.push(MediaCallConstants.types.AUDIO), MediaCall.isVideoCallAllowed() && n.push(MediaCallConstants.types.VIDEO), MediaCall.isScreenShareWithAudioCallAllowed() && n.push(MediaCallConstants.types.SCREEN_SHARE_WITH_AUDIO), n.length) {
                    var s = '<div id="{{call_type}}_call_{{chid}}" chid="{{chid}}" class="call-options zc-conf-one-to-one-chat" data-purpose="one-to-one-call" purpose="options" type="menu-wrapper"><div><span class="{{call_icon}}" title="{{call_title}}"></span></div>' + u + "</div>",
                        o = {
                            onetoonecall: "zcf-calloption2"
                        };
                    o[MediaCallConstants.types.AUDIO] = "zcf-call2", o[MediaCallConstants.types.VIDEO] = "zcf-video3", o[MediaCallConstants.types.SCREEN_SHARE] = "zcf-sharescrn2", o[MediaCallConstants.types.SCREEN_SHARE_WITH_AUDIO] = "zcf-sharescrn2";
                    var r = {
                        onetoonecall: void 0
                    };
                    r[MediaCallConstants.types.AUDIO] = "videochat.audiocall", r[MediaCallConstants.types.VIDEO] = "videochat.videocall", r[MediaCallConstants.types.SCREEN_SHARE] = "videochat.sharescreen", r[MediaCallConstants.types.SCREEN_SHARE_WITH_AUDIO] = "common.screenshare";
                    var d = n[0],
                        c = "";
                    if (n.length > 1 && (c = t ? "" : '<div class="zcl-menu-wrap no-pointer" type="menuOption">', n.forEach((function(e) {
                            c += $WC.template.replace('<div id="{{type}}_call_{{chid}}" chid="{{chid}}" class="zcl-menu-item ellips" purpose="options"><em class="zcl-menu-item-icn {{icon}}"></em><span>{{title}}</span></div>', {
                                type: e,
                                icon: o[e],
                                $title: r[e]
                            })
                        })), c += t ? "" : "</div>", d = "onetoonecall", t)) return $WC.template.replace(c, {
                        call_type: d,
                        call_icon: o[d],
                        call_title: l,
                        chid: e.chid
                    });
                    if (1 == n.length && t) return "";
                    var l = void 0 !== r[d] ? $ZCUtil.getCustomTooltip(MediaUtil.getResource(r[d]), "text", !1, "south") : "";
                    i = $WC.template.replace(s, {
                        call_type: d,
                        call_icon: o[d],
                        call_title: l,
                        chid: e.chid
                    })
                }
            }
            return i
        },
        getGroupCallOptionsHtmlForCwin: function(e, t) {
            var i = e.chid;
            let n = ConversationsList.isThreadChat(i),
                a = '<span class="zcl-btn-separator cht-btn-separator"></span>';
            if (_isLhsRevampEnabled()) {
                var s = MediaManager.getActiveGroupCallId(),
                    o = CallHistoryData.getOngoingCallForChat(i);
                if (void 0 !== o) {
                    var r = "";
                    return r = t ? '<div title="{{type_text}} - {{title}}" chid="{{chid}}" purpose="options" data-purpose="joinCall" id="joingroupcall-{{chid}}" nrs_id="{{nrs_id}}" type="{{type}}" class="dflx zc-grp-call-join-dropdown zcl-menu-item {{clazz}}">\n\t\t\t\t\t\t<em class="zcf-video-conf zcl-menu-item-icn"></em>\n\t\t\t\t\t\t<span class="font14 zc-grp-call-txt">{{join}}</span>\n\t\t\t\t\t</div>' : '<div title="{{type_text}} - {{title}}" chid="{{chid}}" purpose="options" data-purpose="joinCall" id="joingroupcall-{{chid}}" nrs_id="{{nrs_id}}" type="{{type}}" class="dflx zc-grp-call-join {{clazz}}"><span class="zcf-video-conf"></span><span class="mL4 font12 zc-grp-call-txt">{{join}}</span>' + (n ? "" : a) + "</div>" + (n ? a : ""), $WC.template.replace(r, {
                        chid: i,
                        type: o.type,
                        nrs_id: o.nrs_id,
                        title: o.title,
                        $type_text: "audio_conference" === o.type ? "videochat.audiocall" : "video_conference" === o.type ? "videochat.videocall" : "videobroadcast.streaming",
                        clazz: s === o.nrs_id ? "inactive" : "",
                        $join: "common.join"
                    })
                }
            }
            r = "";
            var d = [];
            if (e.hasPermissionToHostMeeting() && (Conference.isAudioConferenceAllowed() || Conference.isVideoConferenceAllowed()) && (d.push("start_meeting"), SecurityManager.hasPermission(Modules.Events) && d.push("schedule_meeting")), e.hasPermissionToHostPrimeTime() && ZCLiveEvents.isEnabled() && ZCLiveEvents.isAllowed() && d.push("live_event"), d.length) {
                var c = {
                        audio_conference: "zcf-call2",
                        video_conference: "zcf-video3",
                        groupcall: "zcf-group-call",
                        meetings: "zcf-meetings2",
                        start_meeting: "zcf-meeting2",
                        schedule_meeting: "zcf-calendar2",
                        live_event: "zcf-live-event"
                    },
                    l = {
                        audio_conference: "videochat.audiocall",
                        video_conference: "videochat.videocall",
                        groupcall: "common.calls",
                        meetings: "common.meetings",
                        start_meeting: "common.start.meeting",
                        schedule_meeting: "event.schedule.meeting",
                        live_event: "liveevent.schedule"
                    },
                    u = '<div class="call-options grp-call-opts" id="{{group_call_type}}{{chid}}" chid="{{chid}}" purpose="options" data-purpose="{{data_purpose}}" type="menu-wrapper"><div><span class="{{group_call_icon}}"></span></div>' + (n ? "" : a) + "</div>" + (n ? a : "");
                t && (u = '<div class="call-options grp-call-opts zcl-menu-item" id="{{group_call_type}}{{chid}}" chid="{{chid}}" purpose="options" data-purpose="{{data_purpose}}"><div><em class="{{group_call_icon}} zcl-menu-item-icn"></em><span>' + MediaCall.BRIDGE.Resource.getRealValue("media.primetime") + "</span></div></div>");
                var p = "",
                    f = d[0],
                    m = "zcbroadcast";
                if (d.length > 1 && (p = t ? "" : '<div class="zcl-menu-wrap no-pointer" type="menuOption">', d.forEach((function(e) {
                        p += $WC.template.replace('<div id="{{type}}{{chid}}" chid="{{chid}}" class="zcl-menu-item ellips" purpose="options" data-purpose="{{data_purpose}}"><em class="zcl-menu-item-icn {{icon}}"></em>{{title}}</span></div>', {
                            type: e,
                            icon: c[e],
                            $title: l[e],
                            data_purpose: "primetime" === e ? m : ""
                        })
                    })), m = "", p += t ? "" : "</div>", f = "meetings", t)) return $WC.template.replace(p, {
                    group_call_type: f,
                    group_call_icon: c[f],
                    chid: e.chid,
                    data_purpose: m
                });
                r = $WC.template.replace(u, {
                    group_call_type: f,
                    group_call_icon: c[f],
                    chid: e.chid,
                    data_purpose: m
                })
            }
            return r
        },
        updateGroupCallOptionsInChatHeader: function(e) {
            void 0 !== e && "function" == typeof ChatUI.isExist && ChatUI.isExist(e) && ChatUI.exist[e].updateAdditionalOptionsUI()
        },
        hasOnGoingSession: function() {
            return p() || f() || m() || v() || "undefined" != typeof LiveFeedImpl && LiveFeedImpl.hasOutgoingFeedSession()
        },
        hasOnGoingNewMediaCall: v,
        getActiveMediaSessionId: async () => new Promise((e, t) => {
            if ("undefined" != typeof MediaCallImpl) {
                if (MediaCallImpl.isAVLoadedInIntegratedUI()) return void AVISCUtilBridge.getActiveCallDetails(t => {
                    var i = t ? t.id : void 0;
                    e(i)
                });
                var i = MediaCallImpl.getCurrentSession();
                if (i) return void e(i.getId())
            }
            var n;
            if ("undefined" != typeof ConferenceImpl && (n = ConferenceImpl.getCurrentSession())) return void e(n.getId());
            if ("undefined" != typeof ZCSmartConferenceImpl && (n = ZCSmartConferenceImpl.getCurrentSession())) return void e(n.getId());
            if ("undefined" != typeof PrimeTimeImpl) {
                var a = PrimeTimeImpl.getCurrentSession();
                if (a) return void e(a.getId())
            }
            e(void 0)
        }),
        getActiveGroupCallId: () => {
            var e;
            if ("undefined" != typeof ConferenceImpl && (e = ConferenceImpl.getCurrentSession())) return e.getId();
            if ("undefined" != typeof ZCSmartConferenceImpl && (e = ZCSmartConferenceImpl.getCurrentSession())) return e.getId()
        },
        isMildNotificationToneNeeded: function() {
            return p() || f() || m() || "undefined" != typeof MediaCallImpl && MediaCallImpl.hasCurrentSession()
        },
        updatePeopleInfoInUI: function(e, t) {
            var i = "",
                n = t.getDepartmentName(),
                a = t.getDesignation(),
                s = t.getEmailId();
            void 0 !== a && void 0 !== n ? i = a + " - " + n : void 0 !== s && (i = s), e.text(i)
        },
        closePermissionOverlay: g,
        checkAndShowPermissionWindow: function(e, t, i, n) {
            (i || n) && MediaManager.isStreamRequested() && u(e, t, i, n)
        },
        getClientSupport: function() {
            var e = {
                perfect_renegotiation: !0,
                multi_stream: !0
            };
            return $ZCUtil.Browser.isChrome() || $ZCUtil.Browser.isSafari() || $ZCUtil.Browser.isOpera() ? WebRTCUserMedia.isDisplayMediaSupported() || (e = {
                perfect_renegotiation: !1,
                multi_stream: !1
            }) : $ZCUtil.Browser.isFirefox() && (e.perfect_renegotiation = !1), e
        },
        handleMuteShortCut: function() {
            var e = !1;
            if ("undefined" != typeof MediaCallImpl && MediaCallImpl.hasCurrentSession()) e = MediaCallImpl.getCurrentSession().handleMuteShortcut();
            else if (f()) {
                e = ConferenceImpl.getCurrentSession().handleMuteShortcut()
            } else if (m()) {
                e = ZCSmartConferenceImpl.getCurrentSession().handleMuteShortcut()
            }
            return e
        },
        initModules: function() {
            this.bindEvents(), "undefined" != typeof AVResourceMessageObject && MediaUtil.BRIDGE.Resource.combineResourceObject(), "function" == typeof MediaUtil.BRIDGE.SoundManager.preLoadFiles && MediaUtil.BRIDGE.SoundManager.preLoadFiles(MediaUtil.getMediaCallToneUrl()), void 0 !== RTCPMediaPlayer && MediaUtil.isAVLibraryLoadedInCliq() && RTCPMediaPlayer.initialize();
            var e = MediaUtil.BRIDGE.getModulesToBeLoaded();
            for (var t in e) switch (t) {
                case ZCMediaConstants.mediaModules.DIRECT_CALL:
                    MediaCall.initialize();
                    break;
                case ZCMediaConstants.mediaModules.VOICE_ALERT:
                    ZCMediaModuleLoader.initializeVoiceAlert();
                    break;
                case ZCMediaConstants.mediaModules.CONFERENCE:
                    Conference.initialize();
                    break;
                case ZCMediaConstants.mediaModules.PRIMETIME:
                    PrimeTime.initialize();
                    break;
                case ZCMediaConstants.mediaModules.LIVE_EVENT:
                    ZCLiveEvents.initialize()
            }
            MLBackgroundProcessor.getAndSetVirtualBackgroundImageDetails()
        },
        handleStickyInfoConfigUpdate: function(e) {
            m() && ZCSmartConferenceImpl.getCurrentSession().handleStickyInfoConfigUpdate(e)
        },
        handleSpeechDetectionConfigUpdate: function(e) {
            "undefined" != typeof ZCSmartConferenceImpl && ZCSmartConferenceImpl.handleSpeechDetectionConfigUpdate(e), "undefined" != typeof MediaCallImpl && MediaCallImpl.handleSpeechDetectionConfigUpdate(e)
        },
        handleAudioProcessingConfigUpdate: function(e) {
            "undefined" != typeof ZCSmartConferenceImpl && ZCSmartConferenceImpl.handleAudioProcessingConfigUpdate(e), "undefined" != typeof MediaCallImpl && MediaCallImpl.handleAudioProcessingConfigUpdate(e)
        },
        handleHDVideoConfigUpdate: function(e) {
            "undefined" != typeof ZCSmartConferenceImpl && ZCSmartConferenceImpl.handleHDVideoConfigUpdate(e)
        },
        updateParticipantStatus: function(e) {
            if (f()) ConferenceUI.updateParticipantStatus(e);
            else if (m()) {
                ZCSmartConferenceImpl.getCurrentSession().updateParticipantStatus(e)
            }
        },
        setPreferredAudioOutput: function(e) {
            if (void 0 !== ZCMediaDevices && ZCMediaDevices.hasPreferredAudioOutput()) {
                var t = ZCMediaDevices.getPreferredDevices().audiooutput,
                    i = ZCMediaDevices.kinds.AUDIO_OUTPUT;
                if (void 0 !== t && ZCMediaDevices.isValidDevice(i, t.deviceId) && WebRTCUserMedia.isSetSinkIdSupported())
                    for (var n = 0; n < e.length; n++) e[n].setSinkId(t.deviceId).catch((function() {}))
            }
        },
        getSnippetMsgParams: function(e, t) {
            let i = ZCSmartConferenceImpl.getCurrentActiveSession();
            return void 0 === i || e !== i.getDummyThreadChatId() && e !== i.getDummyChatId() || (t.params.trigger = JSON.stringify({
                type: "conference",
                id: i.getId()
            })), t.params[DummyCwinUtils.CONSTANTS.CHAT_KEY] = e, t
        },
        filterAddedDevices: function(e, t, i, n) {
            var a = [],
                s = [],
                o = [],
                r = void 0,
                d = void 0,
                c = void 0;
            t && t._hasAudioTrack() && (r = t._getAudioDeviceId()), i && i._hasVideoTrack() && (c = i._getVideoDeviceId()), n.length && (d = n[0].sinkId);
            for (var l = 0; l < e.length; l++) {
                var u = e[l];
                ZCMediaDevices.isAudioInputDeviceKind(u.kind) ? r && !ZCMediaDevices.isDefaultDeviceId(r) && r !== u.deviceId && a.push(u) : ZCMediaDevices.isAudioOutputDeviceKind(u.kind) ? d && !ZCMediaDevices.isDefaultDeviceId(d) && d !== u.deviceId && s.push(u) : ZCMediaDevices.isVideoInputDeviceKind(u.kind) && c && !ZCMediaDevices.isDefaultDeviceId(c) && c !== u.deviceId && o.push(u)
            }
            return {
                audioInputDevices: a,
                audioOutputDevices: s,
                videoInputDevices: o
            }
        },
        getDeviceSettings: function(e, t, i, n, a, s) {
            return MediaTemplates.getDeviceSettingsHtml(e, MediaDeviceWidget.getCurrentConfig(t, i, n, a))
        }
    }
}(), MLBackgroundProcessor = function() {
    var e = !1,
        t = !1,
        i = ["work_place_1", "work_place_2", "work_place_3", "work_place_4", "conf_room_1", "conf_room_2", "conf_room", "office_animated", "office_chair_1", "office_chair_2", "work_place_home", "reading_table", "living_room_small", "living_room_smooth", "living_room_warm", "living_room_white", "city_lights", "beach_resort", "beach", "faded_white", "galaxy_view", "confetti", "faded_blue"],
        n = [],
        a = {};

    function s() {
        return e = navigator.userAgent.match(/CliqDesktopClient\/[3-4][1-9]$/), !(MediaCall.isDesktopApp() && !$WC.Util.isEmpty(e) && e.length && $ZCUtil.isAppleSilicon());
        var e
    }

    function o(e, t) {
        e.forEach(e => {
            var i = {
                occassionType: t,
                format: d.PNG,
                thumbnailSrc: "thumbnails/" + e + ".png",
                src: e + ".png"
            };
            a[e] = i
        })
    }
    var r = {
            SEASONAL: "seasonal",
            NORMAL: "normal"
        },
        d = {
            PNG: "png",
            GIF: "gif"
        },
        c = {},
        l = {},
        u = "default_processor";

    function p(e, t, i, n) {
        f(e._isModuleInstance() ? e._getModuleInstanceId() : u, (function(n) {
            e._hasVideoTrack() && (n.setVideo(new MediaStream(e.getVideoTracks())), n.setDisplayRatio(0, 0, e._getVideoSize().width, e._getVideoSize().height)), e._hasAudioTrack() && n.setAudio(e.getAudioTracks()), n.start().then((function() {
                var a = WebRTCUserMedia.updateAndGetProcessedStream(e, n);
                t && (t.background && MLBackgroundProcessor.applyVideoBackground(a, t.background.type), t.filter && MLBackgroundProcessor.applyVideoFilter(a, t.filter.type)), "function" == typeof i && i(a)
            }))
        }), (function(t, i) {
            "function" == typeof n && n(null, e)
        }))
    }

    function f(e, t, i) {
        if (void 0 === c[e])
            if (void 0 === l[e]) {
                var n = new zohoai.Background("high");
                l[e] = n;
                n.setEffect("none").setMode("lite").setPipelineType("canvas").setModelPath(void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.ServerConstants.JSSTATICURL + MediaUtil.BRIDGE.ServerConstants.ML_FOCUSED_IMG_MODEL_PATH : $zcg._JSSTATICURL + $zcg._VIDEOCHATPROPS.ML_FOCUSED_IMG_MODEL_PATH).setWasmPath(void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.ServerConstants.JSSTATICURL + MediaUtil.BRIDGE.ServerConstants.ML_FOCUSED_IMG_WASM_PATH : $zcg._JSSTATICURL + $zcg._VIDEOCHATPROPS.ML_FOCUSED_IMG_WASM_PATH).setCallback(() => !0).disableWebGL().runInferenceOnWorker().build(!0, !1).then((function(i) {
                    l[e] = void 0, c[e] = i, "function" == typeof t && t(i)
                })).catch((function(t) {
                    l[e] = void 0, "function" == typeof i && i(e, t)
                }))
            } else "function" == typeof i && i(e);
        else "function" == typeof t && t(c[e])
    }
    return {
        isEnabledForMediaCall: function() {
            return void 0 !== MediaCall && MediaCall.isDiretCallVideoEffectsEnabled()
        },
        isEnabledForLiveFeed: function() {
            return "undefined" != typeof LiveFeed && LiveFeed.isFocusedImgEnabled()
        },
        isEnabledForGroupCall: function() {
            return "undefined" != typeof ConferenceImpl || MediaUtil.isGuestConferenceUser()
        },
        isSeasonalVideoEffectsEnabled: function() {
            return 0 !== n.length
        },
        getAndSetVirtualBackgroundImageDetails: function() {
            a = {}, o(i, r.NORMAL);
            var e = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.getSeasonalBackgroundImageUrls() : $zcg._SEASONAL_BACKGROUND_IMAGE_URLS;
            o(n = e && 0 !== e.length ? e.split(",") : [], r.SEASONAL)
        },
        backgroundTypes: {
            NONE: "none",
            BLUR: "blur",
            IMAGE: "image",
            images: i,
            getSeasonalImages: function() {
                return n
            },
            hasNoBackground: function(e) {
                return this.NONE === e || void 0 === e
            },
            isBlur: function(e) {
                return this.BLUR === e
            },
            isImage: function(e) {
                return this.IMAGE === e
            },
            isSeasonalImage: function(e) {
                return void 0 !== a[e] && a[e].occassionType === r.SEASONAL
            },
            isGif: function(e) {
                return a[e].format === d.GIF
            },
            getSrcUrl: function(e) {
                return MediaManager.getImgUrl("video_backgrounds/v2/" + a[e].src)
            },
            getThumbNailUrl: function(e) {
                return MediaManager.getImgUrl("video_backgrounds/" + a[e].thumbnailSrc)
            }
        },
        filterTypes: {
            NONE: "none",
            VARIANT: "variant",
            variants: ["grayscale", "sepia"],
            variantsValues: {
                none: "none",
                grayscale: "grayscale(1)",
                sepia: "sepia(50%)"
            },
            hasNoFilter: function(e) {
                return this.NONE === e || void 0 === e
            }
        },
        isEnabled: function() {
            return this.isEnabledForMediaCall() || this.isEnabledForLiveFeed() || this.isEnabledForGroupCall()
        },
        isInitialized: function() {
            return e
        },
        initialize: function(i, n) {
            this.isInitialized() ? "function" == typeof i && i() : this.isEnabled() && s() ? MediaManager.initialize((function() {
                if (s()) {
                    if (t) return;

                    function n() {
                        e = !0, t = !1, f(u), "function" == typeof i && i()
                    }
                    "undefined" == typeof zohoai ? (t = !0, $ZCUtil.loadMultipleFiles("script", MediaUtil.BRIDGE.ServerConstants.ML_FOCUSED_IMG_JS_LIST, n, MediaUtil.BRIDGE.ServerConstants.ML_FOCUSED_IMG_JS_INTEGRITY_HASH)) : n()
                }
            })) : "function" == typeof n && n()
        },
        processStream: function(e, t, i, n) {
            var a = e._getType();
            this.isEnabled() && !e._hasBackgroundProcessor() && a !== WebRTCUserMedia.streamTypes.AUDIO_ONLY && a !== WebRTCUserMedia.streamTypes.SCREEN && void 0 !== t && (void 0 !== t.background && !MLBackgroundProcessor.backgroundTypes.hasNoBackground(t.background.type) || void 0 !== t.filter && !MLBackgroundProcessor.filterTypes.hasNoFilter(t.filter.type)) ? p(e, t, i, n) : i(e)
        },
        processStreamWithoutEffects: function(e, t, i) {
            var n = e._getType();
            this.isEnabled() && !e._hasBackgroundProcessor() && n !== WebRTCUserMedia.streamTypes.AUDIO_ONLY && n !== WebRTCUserMedia.streamTypes.SCREEN ? p(e, MediaUtil.getVideoProcessingOptions(), t, i) : t(e)
        },
        applyVideoBackground: function(e, t, i) {
            var n = MLBackgroundProcessor.backgroundTypes.hasNoBackground(t);
            if (e._hasBackgroundProcessor()) {
                if (n) e._disableBackgroundEffects();
                else {
                    if (!MLBackgroundProcessor.backgroundTypes.isBlur(t)) {
                        var a = MLBackgroundProcessor.backgroundTypes.getSrcUrl(t);
                        return void MLBackgroundProcessor.enableVirtualBackground(a, e, MLBackgroundProcessor.backgroundTypes.isGif(t), i)
                    }
                    MLBackgroundProcessor.enableBackgroundBlur(e, 1)
                }
                "function" == typeof i && i()
            } else n ? "function" == typeof i && i() : MLBackgroundProcessor.processStream(e, {
                background: {
                    type: t
                }
            }, i, i)
        },
        enableVirtualBackground: function(e, t, i, n) {
            t && t._enableVirtualBackground(e, i, n, n)
        },
        enableBackgroundBlur: function(e, t) {
            e._enableBackgroundBlur(), void 0 !== t && this.setBlurIntensity(e, t)
        },
        setBlurIntensity: function(e, t) {
            e._setBlurIntensity(t)
        },
        applyVideoFilter: function(e, t, i) {
            var n = MLBackgroundProcessor.filterTypes.hasNoFilter(t);
            if (e._hasBackgroundProcessor()) {
                var a = MLBackgroundProcessor.filterTypes.variantsValues[t];
                e._applyVideoFilter(a), "function" == typeof i && i()
            } else n ? "function" == typeof i && i() : MLBackgroundProcessor.processStream(e, {
                filter: {
                    type: t
                }
            }, i, i)
        }
    }
}(), ZCMediaPreferences = {
    getPreferredVideoBackground: function() {
        var e = void 0,
            t = void 0;
        return MLBackgroundProcessor.isSeasonalVideoEffectsEnabled() && (e = t = MediaUtil.getSettingsValue("seasonal_video_background", !0)), void 0 !== e && MLBackgroundProcessor.backgroundTypes.getSeasonalImages().includes(e) || (e = MediaUtil.getSettingsValue("video_background", !0)) === MLBackgroundProcessor.backgroundTypes.NONE && void 0 !== t && t !== MLBackgroundProcessor.backgroundTypes.NONE && (e = MLBackgroundProcessor.backgroundTypes.BLUR), void 0 !== e ? e : MLBackgroundProcessor.backgroundTypes.NONE
    },
    getPreferredVideoFilter: function() {
        var e = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Settings.get("video_filter", !0) : window.Settings.getFromObj("video_filter", !0);
        return void 0 !== e ? e : MLBackgroundProcessor.filterTypes.NONE
    },
    isRotateVideoEnabledByUser: function() {
        var e = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Settings.get("huddle_mirror_video") : window.Settings.getFromObj("huddle_mirror_video");
        return void 0 === e || 1 === e
    },
    isSpeechDetectionAllowedByUser: function() {
        var e = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Settings.get("av_speech_detection") : window.Settings.getFromObj("av_speech_detection");
        return void 0 !== e && 1 === e
    },
    isAudioProcessingAllowedByUser: function() {
        return !!MediaUtil.isNoiseCancellationSupported() && MediaUtil.getSettingsValue("av_audio_processing", !1)
    },
    isHDVideoAllowedByUser: function() {
        return !!Conference.isHDVideoEnabled() && MediaUtil.getSettingsValue("av_hd_video", !1)
    }
}, AVCliqAPINamespace = {
    ResourceTimingAPI: {
        className: "ResourceTimingAPI",
        startPerformanceRecording: "startPerformanceRecording",
        stopRecordingAndGetReport: "stopRecordingAndGetReport"
    },
    BroadcastChannelAPI: {
        className: "BroadcastChannelAPI",
        sendMessage: "sendMessage"
    },
    CustomStorage: {
        className: "CustomStorage",
        setItem: "setItem",
        getItem: "getItem",
        removeItem: "removeItem"
    }
}, AVCliqIframeHandler = {
    $iframeElem: void 0,
    iframeWindow: void 0,
    _isLoaded: !1,
    _prevSequenceId: 0,
    reloadTimeout: 8e3,
    reloadInterval: void 0,
    reloadCounter: 0,
    maxReloadLimit: 3,
    reqIdVsOptions: {},
    moduleName: "avcalls",
    eType: {
        internalAPI: "10",
        ajaxAPI: "11",
        onLoadMessage: "100",
        broadcastChannelMessage: "101"
    },
    generateUniqueId: function() {
        return "av_c" + this._prevSequenceId++
    },
    isLoaded: function() {
        return this._isLoaded
    },
    getIframeUrl: function() {
        var e = MediaUtil.BRIDGE.Constants.IS_CUSTOM_DOMAIN ? "" : MediaUtil.BRIDGE.ServerConstants.AVCLIQ_DOMAIN,
            t = MediaUtil.BRIDGE.getUrlPrefix() + (MediaUtil.BRIDGE.Constants.IS_CUSTOM_DOMAIN ? "/_avcliq" : ""),
            i = "frameorigin=" + MediaUtil.BRIDGE.getFrameOrigin();
        return void 0 !== MediaUtil.BRIDGE.Constants.CLIENT_PORTAL_ZAID && (i += "&zaid=" + MediaUtil.BRIDGE.Constants.CLIENT_PORTAL_ZAID), MediaCall.BRIDGE.Constants.IS_GUEST_USER && (t += "/guest", i = i + "&guest_id=" + MediaCall.BRIDGE.Constants.GUID), e + t + "/avcliq?" + i
    },
    init: function() {
        this._isLoaded || (ZCJQuery("body").append('<iframe id="avcliqiframe" class="zc-av-dN" src="' + this.getIframeUrl() + '"></iframe>'), this.$iframeElem = ZCJQuery("#avcliqiframe"), this.iframeWindow = this.$iframeElem[0].contentWindow, this.bindEvents())
    },
    bindEvents: function() {
        window.addEventListener("message", e => {
            if ((MediaUtil.BRIDGE.Constants.IS_CUSTOM_DOMAIN && this.iframeWindow.origin === e.origin || e.origin === MediaUtil.BRIDGE.ServerConstants.AVCLIQ_DOMAIN) && e.data && "string" == typeof e.data) try {
                var t = JSON.parse(e.data);
                if (void 0 !== t.module && t.module === AVCliqIframeHandler.moduleName && void 0 !== t.eType) {
                    switch (t.eType) {
                        case AVCliqIframeHandler.eType.ajaxAPI:
                            this.handleAjaxResponse(t);
                            break;
                        case AVCliqIframeHandler.eType.internalAPI:
                            this.handleInternalAPIResponse(t);
                            break;
                        case AVCliqIframeHandler.eType.onLoadMessage:
                            this.handleLoaded();
                            break;
                        case AVCliqIframeHandler.eType.broadcastChannelMessage:
                            this.handleBroadcastChannelmessage(t)
                    }
                    void 0 !== t.reqId && delete this.reqIdVsOptions[t.reqId]
                }
            } catch {}
        }, !1), this.reloadInterval = setInterval(this.reloadIframe.bind(this), this.reloadTimeout)
    },
    handleAjaxResponse: function(e) {
        let t = e.reqId,
            i = e.banner,
            n = this.reqIdVsOptions[t],
            a = n.callbacks,
            s = n.loaderElem;
        void 0 !== s && ZCMediaDomUtil.removeLoadIcon(s), ZCJQuery.isEmptyObject(i) || "undefined" == typeof UI || void 0 === UI.updateBanner || void 0 === MediaCall.BRIDGE || (void 0 !== e.successResp && void 0 !== i.success ? UI.updateBanner(MediaCall.BRIDGE.Resource.getRealValue(i.success), 2e3, !1) : void 0 !== e.errorResp && void 0 !== i.error && UI.updateBanner(MediaCall.BRIDGE.Resource.getRealValue(i.error), 2e3, !0));
        let o = void 0;
        a && "function" == typeof a.successCB && void 0 !== e.successResp ? ("" != e.successResp && (o = e.successResp), a.successCB(o, void 0, void 0, void 0, e.headers)) : a && "function" == typeof a.errorCB && void 0 !== e.errorResp && ("" != e.errorResp && (o = e.errorResp), a.errorCB(o, void 0, e.headers))
    },
    handleInternalAPIResponse: function(e) {
        let t = e.reqId,
            i = this.reqIdVsOptions[t].callbacks;
        i && "function" == typeof i.successCB && i.successCB(e.successResp)
    },
    handleBroadcastChannelmessage: function(e) {
        let t = e.message;
        t && "undefined" != typeof MediaCallImpl && MediaCallImpl.handleBrodcastEvent(t)
    },
    clearReloadInterval: function() {
        clearInterval(this.reloadInterval), this.reloadInterval = void 0
    },
    reloadIframe: function() {
        if (this.reloadCounter > this.maxReloadLimit) return this.handleLoaded(), MediaCallAPI.updateLog(void 0, "IFRAME_LOADING_FAILED", {
            loc_time: new Date,
            time: MediaUtil.BRIDGE.Util.getSyncedCurrentTime(),
            zuid: MediaUtil.getCurrentUserId()
        }), void(MediaUtil.isNewAVDomainRoutingEnabled = () => !1);
        this.reloadCounter += 1, this.$iframeElem[0].src = this.getIframeUrl()
    },
    postMessageToIframe: function(e, t) {
        let i;
        void 0 !== e.params && void 0 !== e.params.status && void 0 !== e.params.status.loading && (i = e.params.status.loading, delete e.params.status.loading);
        let n = {
            eType: e.eType,
            callbacks: t
        };
        void 0 !== i && (n.loaderElem = i, ZCMediaDomUtil.addLoadIcon(i)), this.reqIdVsOptions[e.reqId] = n, this.iframeWindow.postMessage(JSON.stringify(e), MediaUtil.BRIDGE.Constants.IS_CUSTOM_DOMAIN ? this.iframeWindow.origin : MediaUtil.BRIDGE.ServerConstants.AVCLIQ_DOMAIN)
    },
    dispatchAVRequest: function(e, t) {
        var i = this.generateUniqueId();
        e.url && (e.url = (MediaUtil.BRIDGE.Constants.IS_CUSTOM_DOMAIN ? "/_avcliq" : "") + e.url), this.postMessageToIframe({
            reqId: i,
            module: AVCliqIframeHandler.moduleName,
            eType: AVCliqIframeHandler.eType.ajaxAPI,
            params: e
        }, t)
    },
    callAVCliqAPI: function(e, t, i, n) {
        if (MediaUtil.isNewAVDomainRoutingEnabled() && this._isLoaded) {
            var a = this.generateUniqueId(),
                s = {
                    successCB: n
                };
            this.postMessageToIframe({
                reqId: a,
                module: AVCliqIframeHandler.moduleName,
                eType: AVCliqIframeHandler.eType.internalAPI,
                apiName: e,
                apiMethod: t,
                apiParams: i
            }, s)
        } else "function" == typeof n && n()
    },
    handleLoaded: function() {
        this._isLoaded || (this._isLoaded = !0, this.clearReloadInterval())
    }
};
var ZCAVCP = AVCliqClientProperties = {
    modules: {
        MEETING: "meeting"
    },
    properties: {
        meeting: {
            RHS_CHAT_OPTION: "rhs_chat_option",
            CHAT_MESSAGE_NOTIFICATION: "chat_message_notification",
            LOAD_DARK_MODE_FILES: "load_dark_mode_files",
            IGNORE_LHS_BACK_OPTION: "ignore_lhs_back_option",
            SHOW_FEEDBACK_AFTER_TWO_SECS: "show_feedback_after_two_secs",
            OPEN_CHAT_FROM_USER_OPTIONS: "open_chat_from_user_options",
            MINIMIZE_WINDOW_ON_PIP: "minimize_window_on_pip",
            PRESENTATION: "presentation",
            SHOW_REJOIN_BUTTON: "show_rejoin_button",
            SHOW_RECORDING_SETTINGS: "show_recording_settings"
        }
    },
    isEnabledForMeeting: e => AVCliqClientProperties.isEnabled(AVCliqClientProperties.modules.MEETING, e),
    isEnabled: (e, t) => {
        let i = $zcg._AV_CLIENT_PROPERTIES[e];
        if (void 0 !== i) {
            let e = i[t];
            if (void 0 !== e) return e
        }
        return !1
    }
};
MediaAPI = {
    getConferenceAjaxWrapper: function() {
        return $zcg._CONFERENCE_AV_DOMAIN_ROUTING ? MediaAPI.request : $ZCAjx.ajax
    },
    request: function(e) {
        if (MediaUtil.isNewAVDomainRoutingEnabled() && AVCliqIframeHandler.isLoaded()) {
            var t = {};
            if ("function" == typeof e.success && (t.successCB = e.success, delete e.success), "function" == typeof e.error && (t.errorCB = e.error, delete e.error), e.headers = e.headers || {}, MediaCall.BRIDGE.Constants.IS_GUEST_USER && "undefined" != typeof GuestChatUtils && GuestChatUtils.isValidAPI(e.url) && (e.headers["x-cliq-guid"] = MediaCall.BRIDGE.Constants.GUID), e.headers.skipEncryptedMeetingId) delete e.headers.skipEncryptedMeetingId;
            else if ("undefined" != typeof ZCSmartConferenceImpl) {
                var i = ZCSmartConferenceImpl.getCurrentActiveSession();
                void 0 !== i && (e.headers["X-Encrypted-Meeting-Resource-Id"] = i.getEncryptedPublicResorceId())
            }
            return MediaUtil.isGuestConferenceUser() && e.url && "undefined" != typeof GuestChatUtils && !GuestChatUtils.isValidAPI(e.url) && (e.url = "/guest" + e.url), void AVCliqIframeHandler.dispatchAVRequest(e, t)
        }
        return $ZCAjx.ajax(e)
    },
    pushStatsViaWebSocket: function(e) {
        let t = {
            header: {
                rtcp_rkey: e.callid
            },
            data: e,
            operation: "teg@" + $zcg._PRD + ":rtcpclientstats"
        };
        "undefined" != typeof $pex && $pex.process(t)
    },
    serialize: function(e) {
        var t = [];
        for (var i in e) e.hasOwnProperty(i) && t.push(encodeURIComponent(i) + "=" + encodeURIComponent(e[i]));
        return "?" + t.join("&")
    },
    getFormData: function(e, t, i, n) {
        var a = new FormData;
        for (var s in e) a.append(s, e[s]);
        if (void 0 !== i) {
            s = 0;
            for (var o = i.length; s < o; s++) {
                var r = i[s];
                void 0 !== r[1] ? a.append(t, r[0], r[1]) : a.append(t, r[0])
            }
        }
        return a
    },
    getLatestMediaIPsVersionData: function(e, t) {
        let i = "/_wmsrtc/v2/ipversioning";
        if ($zcg._IS_MEDIA_SERVERS_GEOFENCING_ENABLED) {
            i = i + "?dc=" + ("undefined" != typeof Config && Config.isNICDC() ? "IN" : $zcg._DC.toUpperCase())
        }
        MediaAPI.request({
            url: i,
            type: "GET",
            avoidAPIPrefix: !0,
            success: t => {
                "function" == typeof e && e(t)
            },
            error: e => {
                "function" == typeof t && t(e)
            }
        })
    },
    getCurrentVersionOfOrg: function(e, t) {
        MediaAPI.request({
            url: "/v2/mediaips/version",
            type: "GET",
            success: t => {
                "function" == typeof e && e(t)
            },
            error: e => {
                "function" == typeof t && t(e)
            }
        })
    },
    updateOrgVersion: function(e, t, i) {
        MediaAPI.request({
            url: "/adminapi/v2/mediaips/version",
            type: "PUT",
            contentType: "application/json",
            data: e,
            success: e => {
                "function" == typeof t && t(e)
            },
            error: e => {
                "function" == typeof i && i(e)
            }
        })
    },
    allocateMediaIPs: function() {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/mediaips/allocate",
            type: "PUT"
        })
    },
    shareUdpBlockReport: function(e, t) {
        let i = {};
        i.sid = WmsImpl.getSid(), e.userIds && e.userIds.length && (i.user_ids = e.userIds), e.chatIdList && e.chatIdList.length && (i.chat_ids = e.chatIdList), e.udpTestResults && (i.ipreachability_results = e.udpTestResults), MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/mediaips/share",
            type: "POST",
            contentType: "application/json",
            data: i,
            success: function(e) {
                "function" == typeof t && t(e)
            }
        })
    },
    pushConnectionNetworkDetails: function(e, t, i, n, a) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/" + t + "/" + e + "/stats",
            type: "POST",
            contentType: "application/json",
            data: MediaUtil.WebRTCStats.getNetworkStatsPayload(i, n, a)
        })
    },
    pushConnectionStats: function(e, t, i, n, a) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/" + t + "/" + e + "/stats",
            type: "PUT",
            contentType: "application/json",
            data: MediaUtil.WebRTCStats.getConnectionStatsPayload(i, a)
        })
    },
    uploadClientLog: function(e, t, i, n, a) {
        $ZCAjx.ajax({
            url: MediaCallConstants.baseUrl + "/v2/" + t + "/" + e + "/clientlog",
            type: "POST",
            data: function(e, t, i) {
                var n = new FormData;
                for (var a in e) n.append(a, e[a]);
                return void 0 !== i && n.append(t, i[0], i[1]), n
            }({
                subject: n,
                description: a
            }, "logfile", i),
            processData: !1,
            contentType: !1
        })
    },
    updatePreferredDevice: function(e, t) {
        var i = [];
        for (var n in e) {
            var a = e[n];
            i.push({
                id: a.deviceId,
                type: a.kind
            })
        }
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/users/" + MediaUtil.getCurrentUserId() + "/updatepreferredmediadevice",
            type: MediaCallConstants.request.method.POST,
            data: {
                devices: i
            },
            contentType: "application/json",
            success: function(e) {
                "function" == typeof t && t(e)
            }
        })
    },
    getPreferredDevices: function(e, t) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/users/" + MediaUtil.getCurrentUserId() + "/preferredmediadevices",
            type: MediaCallConstants.request.method.GET,
            success: function(t) {
                "function" == typeof e && e(t)
            },
            error: function() {
                "function" == typeof t && t()
            }
        })
    },
    getFeedbackOptions: function(e, t) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/mediatemplates",
            type: MediaCallConstants.request.method.GET,
            data: {
                type: "feedback"
            },
            success: function(t) {
                "function" == typeof e && e(t)
            },
            error: function() {
                "function" == typeof t && t()
            }
        })
    },
    updateFeedbackShownTime: function(e) {
        var t = {
            url: MediaCallConstants.baseUrl + "/v2/mediasessions/" + e.sessionKey + "/feedback",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: {
                creator_id: e.creatorId,
                module: e.module
            }
        };
        (!MediaUtil.isGroupCall(e.module) || $zcg._CONFERENCE_AV_DOMAIN_ROUTING) && MediaUtil.isNewAVDomainRoutingEnabled() && AVCliqIframeHandler.isLoaded() ? MediaAPI.request(t) : $ZCAjx.ajax(t)
    },
    submitFeedback: function(e, t, i, n) {
        var a = {
                url: MediaCallConstants.baseUrl + "/v2/mediasessions/" + e.sessionKey + "/feedback",
                type: MediaCallConstants.request.method.POST,
                status: {
                    loading: t
                },
                success: function(e) {
                    "function" == typeof i && i(e)
                },
                error: function() {
                    "function" == typeof n && n()
                }
            },
            s = {
                module: e.module,
                rating: e.rating
            };
        if (e.comment && (s.comment = e.comment), e.reasons && (s.reasons = JSON.stringify(e.reasons)), e.creatorId && (s.creator_id = e.creatorId), (!MediaUtil.isGroupCall(e.module) || $zcg._CONFERENCE_AV_DOMAIN_ROUTING) && MediaUtil.isNewAVDomainRoutingEnabled() && AVCliqIframeHandler.isLoaded())
            if (a.fileHash = {
                    formDataParams: s,
                    isPost: !0
                }, e.files) {
                var o = [],
                    r = 0,
                    d = e.files.length,
                    c = function() {
                        ++r < d ? l() : (a.fileHash.fileParamName = "files", a.fileHash.fileData = o, MediaAPI.request(a))
                    };

                function l() {
                    var t = e.files[r],
                        i = new FileReader;
                    i.readAsDataURL(t[0]), i.onload = function() {
                        o.push([i.result, t[1]]), c()
                    }, i.onerror = function() {
                        c()
                    }
                }
                l()
            } else MediaAPI.request(a);
        else a.data = MediaAPI.getFormData(s, "files", e.files, !0), a.processData = !1, a.contentType = !1, $ZCAjx.ajax(a)
    }
}, ZCMediaModuleLoader = {
    _isVoiceAlertInitialized: !1,
    initializeVoiceAlert: function(e = (() => {})) {
        this._isVoiceAlertInitialized ? e() : $ZCUtil.loadDynamicFiles({
            type: "script",
            url: MediaUtil.BRIDGE.ServerConstants.VOICE_ALERT_MODULE_PATH,
            scriptType: "module",
            callback: () => {
                this._isVoiceAlertInitialized = !0, e()
            }
        })
    }
};
var RTCPMediaPlayer = {},
    RTCPMediaPlayerImpl = {};
RTCPMediaPlayer = function() {
    var e = !1,
        t = !1,
        i = () => {
            "undefined" != typeof RTCMediaPlayerConstants && RTCMediaPlayerConstants.setColors({
                primary_color: "#1D9BF0",
                video_bg: "#17728f",
                seek_color: "#ffffff66",
                seek_buffer_color: "#ffffff66",
                seek_buffer_hover_color: "#ffffff66",
                bg_color: "#0C0C0C"
            })
        };
    return {
        isFilesLoaded: function() {
            return t
        },
        initialize: function(n, a) {
            if (this.isFilesLoaded()) "function" == typeof n && n();
            else {
                if (!$zcg._VIDEOCHATPROPS.RTCP_MEDIA_PLAYER_JS_LIST) return "undefined" != typeof RTCMediaPlayerObj ? void MediaManager.initialize((function() {
                    s()
                })) : void("function" == typeof a && a());
                MediaManager.initialize((function() {
                    e || t || ("undefined" == typeof RTCMediaPlayerObj ? $zcg._VIDEOCHATPROPS.RTCP_MEDIA_PLAYER_JS_LIST.length && (e = !0, $Util.loadFilesSequentially($zcg._VIDEOCHATPROPS.RTCP_MEDIA_PLAYER_JS_LIST, (function() {
                        $Util.loadMultipleFiles("link", $zcg._VIDEOCHATPROPS.RTCP_MEDIA_PLAYER_CSS_LIST, s)
                    }))) : s())
                }))
            }

            function s() {
                e = !1, t = !0, i(), "function" == typeof n && n()
            }
        }
    }
}(), RTCPMediaPlayerImpl = {
    _playerInstance: void 0,
    _recordingPlayerInstance: void 0,
    _currentRecordingPlayer: {
        nrsId: void 0,
        refIndex: void 0
    },
    _wssGuestSid: void 0,
    _wssStatelessHeaderKey: "x-stateless-auth",
    _wssStatelessHeader: void 0,
    _customParentDomId: "zcliq_rtcp_media_player",
    isSupported: function() {
        return RTCPMediaPlayer.isFilesLoaded()
    },
    getWSSSessionId: function() {
        return this._wssGuestSid
    },
    getPlayerManifestUrlForGuest: function(e) {
        var t = "sid=" + this.getWSSSessionId();
        let i = {
            user_id: $zcg._ZUID
        };
        return void 0 !== e && (i.streaming_id = e), t += "&serviceinfo=" + encodeURIComponent(JSON.stringify(i)), PrimeTimeImpl.getAnonWSSServerUrl() + "/master?" + t
    },
    getPlayerConfiguration: function(e, t, i, n, a) {
        var s = {
            cookieNeeded: a ? "disable" : "enable",
            hls: "enable",
            leaveButton: "enable",
            closeNeeded: "enable",
            pictureInPicture: "enable",
            pauseOrPlay: "enable",
            volume: "enable",
            popEnabled: "enable",
            keycontrols: "enable",
            zindex: 1
        };
        return e && (s.playbackspeed = "enable", s.seperatePlaybackSpeed = "enable", s.title = "enable", s.seekbar = "enable", s.drag = "enable", s.minimisePlayer = "enable", s.maximisePlayer = "enable", s.time = "enable", s.bottomControls = "enable", s.tooltip = "enable", s.zindex = 1e3, s.AV = t ? "video" : "audio", s.backwardSeek = "enable", s.forwardSeek = "enable", t && (s.hideControlsOnPause = "enable", s.customClassNames = {
            expand: "zcliq-rtcp-mp-maximize",
            close: "zcliq-rtcp-mp-close"
        }), n && (s.transcript = "enable")), s
    },
    playRecording: function(e, t, i, n, a, s) {
        let o = e.nrs_id ? e.nrs_id : e.nrs_conf_id,
            r = !1;
        if (void 0 !== MediaUtil) {
            let t = MediaUtil.isOneToOneCall(e.type);
            r = !t && MediaUtil.isLiveEvent(e.type), o = t ? e.nrs_conf_id : r ? e.session_id || e.session_key : e.nrs_id
        }
        if (this._currentRecordingPlayer.nrsId === o && this._currentRecordingPlayer.refIndex === t) return;
        void 0 !== this._recordingPlayerInstance && this._recordingPlayerInstance.closeMediaPlayer(), RTCPMediaPlayerImpl._currentRecordingPlayer.nrsId = o, RTCPMediaPlayerImpl._currentRecordingPlayer.refIndex = t;
        let d = $zcg._VIDEOCHATPROPS.WSS_VOD_SERVER_URL,
            c = i,
            l = a && a.hidedownloadicon || e && e.chat_id && Chat.isDownloadRestricted(e.chat_id),
            u = Conference.isAVAIToolsEnabled() && a && a.hastranscript,
            p = {
                host_id: e.host ? e.host.id : $zcg._ZUID,
                user_id: $zcg._ZUID
            };
        r && (p.type = e.type);
        let f = void 0;
        a && (a.link_id && (p.link_id = a.link_id), a.encrypted_key && (p.encrypted_key = a.encrypted_key), $("#loadingniceurl").remove(), $("body").removeClass("chnlpermalink"), a.sr_id && (f = a.sr_id));
        let m = `<div id="${this._customParentDomId}" class="zcliq-rtcp-media-player ${s?"zcliq-rtcp-mp-video":""}"></div>`;
        ZCJQuery("body").append(m);
        let v = function(i) {
            if (RTCPMediaPlayerImpl._currentRecordingPlayer.nrsId !== o && RTCPMediaPlayerImpl._currentRecordingPlayer.refIndex !== t) return;
            let a = "index=" + t + "&sid=" + WmsImpl.getSid();
            a += "&callid=" + $zcg._PRD + "_" + o + "&filename=wmsvod_hlsts_master.m3u8";
            let r = i + "/master?" + (a += "&serviceinfo=" + encodeURIComponent(JSON.stringify(p)));
            RTCPMediaPlayerImpl._recordingPlayerInstance = new RTCMediaPlayerObj(RTCPMediaPlayerImpl._customParentDomId), RTCPMediaPlayerImpl._recordingPlayerInstance.setPlayerConfig(RTCPMediaPlayerImpl.getPlayerConfiguration(!0, s, l, u)), RTCPMediaPlayerImpl._recordingPlayerInstance.setMode(RTCMediaPlayerConstants.mode.RECORDING), RTCPMediaPlayerImpl._recordingPlayerInstance.setPlayerTitle(c), RTCPMediaPlayerImpl._recordingPlayerInstance.loadUrl(r), RTCPMediaPlayerImpl._recordingPlayerInstance.onDownload = function() {
                Conference.handleDownloadRecording(t, o, Conference.getSessionKeyFromMeetingItem(e), e.host ? e.host.id : $zcg._ZUID)
            }, RTCPMediaPlayerImpl._recordingPlayerInstance.onPipMode = function() {
                ZCJQuery("#" + RTCPMediaPlayerImpl._recordingPlayerInstance.getMediaPlayerDivID()).addClass("hide")
            }, RTCPMediaPlayerImpl._recordingPlayerInstance.onPipModeExit = function() {
                ZCJQuery("#" + RTCPMediaPlayerImpl._recordingPlayerInstance.getMediaPlayerDivID()).removeClass("hide")
            }, RTCPMediaPlayerImpl._recordingPlayerInstance.mediaPlayerOnClose = function() {
                RTCPMediaPlayerImpl.destroy()
            }, u && (RTCPMediaPlayerImpl._recordingPlayerInstance.transcript = function() {
                "undefined" != typeof MediaListingUI && (0 === $("#av_transcript_" + f).length && MediaListingUI.handleViewTranscript(o, t, f), s && (RTCPMediaPlayerImpl._recordingPlayerInstance.exitFullscreen(), RTCPMediaPlayerImpl._recordingPlayerInstance.gotoMiniPlayerView()))
            }), "function" == typeof n && n()
        };
        $zcg._IS_WSS_URL_FETCH_ENABLED ? MediaRecordingAPI.getWSSVODServerUrlFromServer(o, t, (function(e) {
            v(e.wss_details.main_server_url)
        }), (function() {
            v(d)
        })) : v(d)
    },
    registerAndInitialize: function(e) {
        this.initialize(PrimeTimeImpl.getPlayerManifestUrl(e))
    },
    registerAndInitializeGuest: function(e) {
        void 0 === this._wssGuestSid ? PrimeTimeAPI.registerGuestInWSS(PrimeTimeImpl.getGuestRegisterUrl(PrimeTimeImpl.getCurrentSession().getId(), e), function(t, i) {
            this._wssGuestSid = t, this._wssStatelessHeader = i.get(this._wssStatelessHeaderKey), this.initialize(this.getPlayerManifestUrlForGuest(e))
        }.bind(this)) : this.initialize(this.getPlayerManifestUrlForGuest(e))
    },
    initialize: function(e) {
        PrimeTimeImpl.hasCurrentSession() && (this._playerInstance = new RTCMediaPlayerObj("ptvideowrapper"), this._playerInstance.setPlayerConfig(this.getPlayerConfiguration(!1, void 0, void 0, void 0, void 0 !== this._wssStatelessHeader)), this._playerInstance.setMode(RTCMediaPlayerConstants.mode.LIVESTREAMING), this._playerInstance.loadUrl(e), void 0 !== this._wssStatelessHeader && this._playerInstance.setStatelessAuthHeader(this._wssStatelessHeader), this._playerInstance.mediaPlayerOnClose = function() {
            PrimeTimeHandler.UIEvents.leave()
        }, this._playerInstance.handleViewerCountUpdate = function(e) {
            var t = PrimeTimeImpl.getCurrentSession();
            void 0 !== t && (t.updateMembersCount(e), PrimeTimeUI.updateMembersCount())
        }, this._playerInstance.handleMediaPlayerError = function(e, t) {
            var i = PrimeTimeImpl.getCurrentSession();
            if (!e && "networkError" === t && i) {
                var n = i.getHost(),
                    a = n.getLastAudioChunkId(),
                    s = n.getLastVideoChunkId();
                (a || s) && PrimeTimeImpl.handleEnd(!0, ZCMediaConstants.endCases.sessionEnd)
            }
        })
    },
    destroy: function() {
        void 0 !== this._recordingPlayerInstance && (this._recordingPlayerInstance = void 0, this._currentRecordingPlayer.nrsId = void 0, this._currentRecordingPlayer.refIndex = void 0, ZCJQuery("body").find("#" + this._customParentDomId).remove())
    },
    closeOnEsc: function() {
        return void 0 !== this._recordingPlayerInstance && (this._recordingPlayerInstance.closeMediaPlayer(), !0)
    }
};
var ZCAVCallManager, ZCAVUtil, MediacallScreenRequestHandler = function() {
    var e = void 0,
        t = {
            "ZOHOCLIQ-EXTN-CHECK": !0,
            "ZOHOCLIQ-GET-SCREEN-SOURCEID": !0,
            "ZOHOCLIQ-EXTENSION": !0
        },
        i = function(e, t, i) {
            return {
                source: "ZOHOCLIQ-EXTENSION",
                requestId: e,
                message: {
                    type: t,
                    data: i
                }
            }
        },
        n = {
            screen_share_tab: "full_screen",
            screen_share_choice: null,
            isSystemAudioAllowed: !1,
            bindScreenSelectUIEvents: function(e) {
                e.on("click", "[purpose='screen']", (function(t) {
                    var i = t.currentTarget;
                    i.id !== n.screen_share_choice && (n.screen_share_choice && e.find("#" + n.screen_share_choice).removeClass("sel"), n.screen_share_choice = i.id, $(i).addClass("sel"), e.find("#share").removeAttr("disabled"))
                })), e.on("click", "[purpose='sourcetab']", (function(t) {
                    var i = t.currentTarget;
                    i.id !== n.screen_share_tab && (n.screen_share_tab && (e.find("#" + n.screen_share_tab).removeClass("sel"), e.find("#" + n.screen_share_tab + "_holder").addClass("zc-av-hide")), n.screen_share_tab = i.id, "full_screen" === i.id ? e.find("#include_sys_audio").removeClass("zc-av-hide") : e.find("#include_sys_audio").addClass("zc-av-hide"), e.find("#" + n.screen_share_tab + "_holder").removeClass("zc-av-hide"), $(i).addClass("sel"))
                }))
            },
            showScreenShareSelection: function(e, t, i) {
                var a = !1;
                n.isSystemAudioAllowed = !1;
                var s = '<div id="{{source_id}}" class="AV-call-scrnshare-prmsn-grid AV-call-mR20" purpose="screen"><img src="{{thumbnail_src}}"><div class="AV-call-flexC AV-call-mT10 AV-call-prmsn-grid-title"><span class="AV-call-flexG AV-call-ellips">{{window_title}}</span></div></div>',
                    o = '<div class="AV-call-scrnshare-prmsn-cont"><div class="AV-call-font18 AV-call-fshrink">' + MediaUtil.getResource("tour.zcscreenshare.title") + '</div><div class="AV-call-font14 AV-call-mT15 AV-call-fshrink AV-call-clr-S">' + MediaUtil.getResource("desktop.screen.share.desc") + '</div><div class="AV-call-zcl-hor-tab AV-call-fshrink"><div id="full_screen" purpose="sourcetab" class="AV-call-zcl-hor-tab-item sel">' + MediaUtil.getResource("desktop.share.entire") + '</div><div id="app_wins" purpose="sourcetab" class="AV-call-zcl-hor-tab-item">' + MediaUtil.getResource("desktop.share.appwindow") + '</div></div><div class="AV-call-flexG AV-call-ovrflwH"><div id="full_screen_holder" class="AV-call-scrnshare-prmsn-main AV-call-scrnshare-prmsn-gridview"></div><div id="app_wins_holder" class="AV-call-scrnshare-prmsn-main AV-call-scrnshare-prmsn-gridview zc-av-hide"></div></div><div class="AV-call-scrnshare-prmsn-ftr">' + ($ZCUtil.isWindowsOs() && t ? '<div id="include_sys_audio" class="AV-call-flexC AV-call-flexG zc-av-line1">' + MediaTemplates.getToggleButtonHtml({
                        checkboxAttribute: "id=system_audio_btn",
                        checkboxPurpose: "button",
                        checkboxCustomClass: "zc-av-mL0"
                    }) + '<em id="sys_audio_icon" class="zc-av-mL10 zc-av-mT2 zcf-unmute-sound AV-call-clr-S"></em>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="mL8">' + MediaUtil.getResource("avcliq.include.system.audio") + "</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</div>" : "") + '<div id="cancel" purpose="button" class="AV-call-zcl-btn-sm AV-call-zcl-btn--secondary AV-call-mR20">' + MediaUtil.getResource("common.cancel") + '</div><div id="share" purpose="button" class="AV-call-zcl-btn-sm AV-call-zcl-btn--primary" disabled>' + MediaUtil.getResource("common.share") + "</div></div></div></div>",
                    r = "",
                    d = "";
                if (e.forEach((function(e) {
                        var t = {
                            source_id: e.id.replace(/:/g, "_"),
                            thumbnail_src: e.thumbnail.toDataURL(),
                            window_title: e.name
                        };
                        e.id.startsWith("window") ? r += $WC.template.replace(s, t) : d += $WC.template.replace(s, t)
                    })), !$WC.$Win.isExist("DC_screen_share_select")) {
                    MediaUtil.createPopup({
                        id: "DC_screen_share_select",
                        html: o,
                        class: "AV-call-scrnshare-prmsn-parent " + (MediaUtil.isAVLibraryLoadedInChatbar() ? "chat-bar" : "cliq-app"),
                        closefn: function() {
                            a || i(), a = !1, n.screen_share_choice = null, n.screen_share_tab = "full_screen"
                        }
                    }, !0);
                    var c = $WC.$Win.get("DC_screen_share_select");
                    (c = $(c)).find("#full_screen_holder").html(d);
                    var l = c.find("#app_wins_holder");
                    r ? l.html(r) : l.hide(), this.bindScreenSelectUIEvents(c), c.on("click", "[purpose='button']", (function(e) {
                        var t, s = e.target.id;
                        if (s) {
                            if ("system_audio_btn" === s) {
                                var o = e.target.checked;
                                return n.isSystemAudioAllowed = o, void c.find("#sys_audio_icon").addClass(o ? "zcf-mute-sound" : "zcf-unmute-sound").removeClass(o ? "zcf-unmute-sound" : "zcf-mute-sound")
                            }
                            "share" === s && (t = n.screen_share_choice.replace(/_/g, ":"), a = !0), i(t), $WC.$Win.destroy("DC_screen_share_select"), n.screen_share_choice = null, n.screen_share_tab = "full_screen"
                        }
                    }))
                }
            },
            handleScreenShare: function(t, i) {
                e({
                    types: ["window", "screen"]
                }).then((function(e) {
                    n.showScreenShareSelection(e, i, t)
                })).catch((function(e) {
                    throw e
                }))
            }
        };
    return {
        init: function() {
            "function" == typeof(e = MediaUtil.BRIDGE.getDesktopScreenCapturer()) && $(window).on("message", (function(e) {
                var a = e.originalEvent.data,
                    s = a.message;
                "object" != typeof s || "ZOHOCLIQ-SCEEN-SOURCE-ID" !== s.type && "ZOHOCLIQ-GET-SCREEN-DENIED" !== s.type || (s = a.source), t[s] && ("ZOHOCLIQ-EXTN-CHECK" == s ? window.postMessage(i(a.requestId, s, !0), "*") : "ZOHOCLIQ-EXTENSION" === a.source && void 0 !== ScreenShare.Extension ? ScreenShare.Extension.handleMessageEvent(e) : n.handleScreenShare((function(e) {
                    var t = "ZOHOCLIQ-GET-SCREEN-DENIED",
                        n = !1;
                    e && (t = "ZOHOCLIQ-SCEEN-SOURCE-ID", n = e), window.postMessage(i(a.requestId, t, n), "*")
                }), a.isComputerAudioNeeded))
            }))
        },
        isInitialized: function() {
            return "function" == typeof e
        },
        isSystemAudioAllowedInSS: function() {
            return n.isSystemAudioAllowed
        }
    }
}();
(ZCAVCallManager = function(e) {
    e = Object.assign({}, ZCAVUtil.defaultProps, e), this.Constants = Object.assign({}, ZCAVUtil.defaultProps.constants, e.constants), this.Constants.MODULES = e.modules, this.ClientConfig = e.config, this.Validator = e.validator, this.FeatureConfig = void 0 !== e.server_config && e.server_config.feature_config || {}, this.ServerConstants = void 0 !== e.server_config && e.server_config.server_constants || {}, this.Users = e.users_api, this.Bots = e.bots_api, this.ResourceAPI = e.resource_api, this.Resource = ZCAVUtil.defaultMethods.ResourceManager, this.Tracker = e.spotlight_api, this.Notifier = e.notification_api, this.Settings = e.settings_api, this.SoundManager = e.sound_manager, this.getSid = e.get_sid, this.getRawSid = e.get_raw_sid, this.getOneToOneChatId = e.get_dm_chat_id, this.getZIndex = e.get_z_index, this.isWmsOwner = e.is_wms_owner || !0, this.isAVCliqNotifyOwner = e.is_avcliq_notify_owner, this.getWmsDebugInfo = e.get_wms_debug_info, this.getFrameOrigin = e.get_frame_origin, this.getUrlPrefix = e.get_url_prefix, this.listener = e.listener, this.UI = e.ui_util, this.isWMSConnected = e.wms_status_api, this.getWmsRtt = e.get_wms_rtt, this.Status = Object.assign({}, ZCAVUtil.defaultProps.user_status_api, e.user_status_api), this.handleBodyMount = e.handleBodyMount || function(e) {
        if (ZCJQuery("#zcwindows").before(e), "function" == typeof this.getZIndex) {
            var t = this.getZIndex();
            e.css("z-index", t + 1)
        }
    }, this.handleChatInRhs = e.handleChatInRhs, this.handleDarkMode = e.handleDarkMode, this.handleChatOpen = e.handleChatOpen, this.desktopScreenCapturer = e.desktopScreenCapturer, this.isDesktopApp = e.isDesktopApp, this.needsClickoutsideBind = e.needsClickoutsideBind, this.notebookIntegSupported = e.notebookIntegSupported, this.incomingCalls = e.incomingCalls, this._isSupported = function() {
        return void 0 !== WebRTCUserMedia && WebRTCUserMedia.isSupported() && !this.Util.Browser.isEdge()
    }, this._isScreenShareSupported = function() {
        return this._isSupported() && (this.Util.Browser.isChrome() || this.Util.Browser.isFirefox() || WebRTCUserMedia.isScreenShareSupportedInNative())
    }, this._isEnabled = function() {
        return this._isAudioCallEnabled() || this._isVideoCallEnabled() || this._isScreenShareEnabled()
    }, this._isAudioCallEnabled = function() {
        return void 0 === this.Validator || "function" != typeof this.Validator.isAudioCallEnabled || this.Validator.isAudioCallEnabled()
    }, this._isVideoCallEnabled = function() {
        return void 0 === this.Validator || "function" != typeof this.Validator.isVideoCallEnabled || this.Validator.isVideoCallEnabled()
    }, this._isScreenShareEnabled = function() {
        return void 0 === this.Validator || "function" != typeof this.Validator.isScreenShareEnabled || this.Validator.isScreenShareEnabled()
    }, this.Util = Object.assign({}, ZCAVUtil.defaultMethods, e.utils), this.Util.getSyncedCurrentTime = e.get_synced_current_time || Date.now, window.$ZCUtil = this.Util, window.$ZCDate = {
        append0: function(e) {
            return e < 10 ? "0" + e : e
        }
    }
}).prototype = {
    initialize: function(e) {
        MediaUtil.setClientBridge(this);
        var t = [],
            i = [];
        t.push(this.ServerConstants.RESOURCE_JS_URL), t = t.concat(this.ServerConstants.MEDIACOMPONENTS_UTIL_JS_LIST), i = i.concat(this.ServerConstants.MEDIACOMPONENTS_UTIL_CSS_LIST);
        var n = { ...this.ServerConstants.MEDIACOMPONENTS_UTIL_JS_INTEGRITY_HASH,
                ...this.ServerConstants.RESOURCE_JS_INTEGRITY_HASH
            },
            a = this.ServerConstants.MEDIACOMPONENTS_UTIL_CSS_INTEGRITY_HASH;
        MediaUtil.isAVLibraryLoadedInChatbar() && (this.ServerConstants.AV_CLIQMINI_EXTENSION_JS_URL_LIST && (t = t.concat(this.ServerConstants.AV_CLIQMINI_EXTENSION_JS_URL_LIST), n = Object.assign({}, n, this.ServerConstants.AV_CLIQMINI_EXTENSION_JS_INTEGRITY_HASH)), this.ServerConstants.AV_CLIQMINI_EXTENSION_CSS_URL_LIST && (i = i.concat(this.ServerConstants.AV_CLIQMINI_EXTENSION_CSS_URL_LIST), a = Object.assign({}, a, this.ServerConstants.AV_CLIQMINI_EXTENSION_CSS_INTEGRITY_HASH))), $ZCUtil.isJQueryAvailable() || (window.resolveJQueryConflict = !0, t.push(this.getJqueryUrl()), n[this.getJqueryUrl()] = this.getJqueryIntegHash()), $ZCUtil.loadMultipleFiles("script", t, function() {
            window.ZCJQuery = window.jQuery, window.resolveJQueryConflict && jQuery.noConflict(!0), 0 == ZCJQuery("#zcwindows").length && ZCJQuery("body:first").append('<div id="zcwindows" class="zcoverlay"></div>'), this.setZIndex(ZCJQuery("#zcwindows")), MediaUtil.isAVLibraryLoadedInCliq() && 0 == ZCJQuery("#ajaxstatus").length && ZCJQuery("#zcwindows").before('<div style="display:none;" id="ajaxstatus" class="ajaxstatus"></div><div style="display:none;" id="ajaxstatus-v2" class="banner-v2 flexM success"></div>'), this.needsClickoutsideBind && document.addEventListener("click", (function(e) {
                Clickoutside.handleClick(e)
            })), window.injectZCJQueryOverrides(), MediaUtil.handleBridgeInitialized(), "function" == typeof e && e(this)
        }.bind(this), n), i.length > 0 && $ZCUtil.loadMultipleFiles("link", i, (function() {}), a)
    },
    getModulesToBeLoaded: function() {
        return this.Constants.MODULES
    },
    getJqueryUrl: function() {
        return this.Constants.tp_static_url + "/officechat/js/jquery-3.7.1.min.2c872dbe60f4ba70fb85356113d8b35e.js"
    },
    getJqueryIntegHash: function() {
        return "1H217gwSVyLSIfaLxHbE7dRb3v4mYCKbpQvzx0cegeju1MVsGrX5xXxAvs/HgeFs"
    },
    setZIndex: function(e) {
        if ("function" == typeof this.getZIndex) {
            var t = this.getZIndex();
            e.css("z-index", t)
        }
    },
    isDirectCallDTXEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isDirectCallDTXEnabled
    },
    isNewRTCConnectionEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isNewRTCConnectionEnabled
    },
    isForceTurnEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isForceTurnEnabled
    },
    isNewAVDomainRoutingEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isNewAVDomainRoutingEnabled
    },
    isAVCallHandOffEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isAVCallHandOffEnabled
    },
    isAVSDPCompressionEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isAVSDPCompressionEnabled
    },
    isAVRecordingEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isAVRecordingEnabled
    },
    isRecordingConfigEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isRecordingConfigEnabled
    },
    isAdhocCallConversionEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isAdhocCallConversionEnabled
    },
    isStaticFileIntegrityCheckEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isStaticFileIntegrityCheckEnabled
    },
    isDiretCallVideoEffectsEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isDiretCallVideoEffectsEnabled
    },
    isLyraEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isLyraEnabled
    },
    isPresentationIn121CallEnabled: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isPresentationIn121CallEnabled
    },
    isNoiseCancellationSupported: function() {
        return void 0 !== this.FeatureConfig && this.FeatureConfig.isNoiseCancellationSupported
    },
    canLoadMLLibrary: function() {
        return void 0 !== this.ClientConfig && this.ClientConfig.mlLibrary
    },
    isMediaFeedbackEnabled: function() {
        return void 0 !== this.ClientConfig && this.ClientConfig.mediaFeedback
    },
    isEnabled: function() {
        return this._isEnabled()
    },
    isSupported: function() {
        return this._isSupported()
    },
    isAudioCallAllowed: function() {
        return this._isSupported() && this._isAudioCallEnabled()
    },
    isVideoCallAllowed: function() {
        return this._isSupported() && this._isVideoCallEnabled()
    },
    isScreenShareAllowed: function() {
        return this._isScreenShareSupported() && this._isScreenShareEnabled()
    },
    isWhiteBoardAllowed: function() {
        return void 0 !== this.Validator && "function" == typeof this.Validator.isWhiteBoardEnabled && this.Validator.isWhiteBoardEnabled()
    },
    isPresentationAllowed: function() {
        return MediaUtil.isPresentationIn121CallEnabled()
    },
    isScreenShareWithAudioCallAllowed: function() {
        return this.isScreenShareAllowed()
    },
    isNotebookIntegrationSupported: function() {
        return this.notebookIntegSupported
    },
    getIncomingCalls: function() {
        return this.incomingCalls
    },
    getSeasonalBackgroundImageUrls: function() {
        return void 0 !== this.ServerConstants && this.ServerConstants.seasonalBackgroundImageUrls
    },
    handleWmsMessage: function(e, t) {
        if ("5000" === t && "undefined" != typeof MediaCallImpl) MediaCallImpl.handleWmsEvent(e);
        else if ("59" === t && MediaUtil.isAVLibraryLoadedInChatbar()) {
            if ("voice_alert" === e.module) return void ZCMediaModuleLoader.initializeVoiceAlert(() => ZCVoiceAlert.handleWmsMessage(e));
            var i = MediaCallImpl.getCurrentSession();
            if (i && "startRingingAll" === e.opr && e.adhocCallDetails.call_id === i.getId() && !i.isRedirectedToCliq()) {
                let t = () => {
                    MediaUtil.createConfirmDialog({
                        id: "handleredirectiondialog",
                        version: 2,
                        class: "zcdalogbx zcbg_mask alert_dialog",
                        headerhtml: $WC.$Dlg.frameHeaderHTML({
                            imagehtml: '<div class="mheader_icn msi-alrt clr-green"></div>'
                        }),
                        bodyhtml: $WC.$Dlg.frameBodyInfoHTML({
                            info: [MediaUtil.getResource("avcliq.mediacall.state.redirecting")]
                        }),
                        buttons: [{
                            text: MediaUtil.getResource("common.goahead"),
                            colour: $WC.$Dlg.GREEN_BUTTON,
                            action: function() {
                                i.setRedirectionState(), window.open(e.redirectionUrl)
                            }
                        }],
                        closefn: function() {
                            i.isRedirectedToCliq() || MediaCallImpl.handleEnd(i.getId(), !0, {
                                playEndTone: !1
                            })
                        }
                    }, !0)
                };
                "function" == typeof MediaCall.BRIDGE.UI.loadCliqIframeAndSwitchFocus ? MediaCall.BRIDGE.UI.loadCliqIframeAndSwitchFocus().then(t => AVISCUtilBridge.joinGroupCallInIframe({
                    conferenceId: e.conferenceId
                }, t)).then(() => MediaCallImpl.hasCurrentSession() && MediaCallImpl.handleEnd(MediaCallImpl.getCurrentSession().getId(), !1)).catch(() => t()) : t()
            }
        }
    },
    handleLogout: function() {
        MediaHandler.handleLogout()
    },
    startCall: function(e, t, i) {
        MediaCall.initiateStartCallProcess(e, t, i, ZCMediaConstants.triggerSource.CHAT_HEADER)
    },
    handlePushNotification: function(e) {
        void 0 !== this.Notifier && this.Notifier.notify(e)
    },
    handleTitleChange: function(e) {
        void 0 !== this.Notifier && this.Notifier.notifyInTitle(e)
    },
    handleTitleRevert: function() {
        void 0 !== this.Notifier && this.Notifier.revertTitle()
    },
    isAVLibraryLoadedInDesktopApp: function() {
        return "function" == typeof this.isDesktopApp ? this.isDesktopApp() : this.isDesktopApp
    },
    getDesktopScreenCapturer: function() {
        return MediaUtil.isAVLibraryLoadedInCliq() ? this.desktopScreenCapturer() : this.desktopScreenCapturer
    }
}, ZCAVUtil = {
    defaultProps: {
        constants: {
            MEDIADEFAULTSTATICURL: "/officechat/sound/default",
            IMGDEFAULTSTATICURL: "/officechat/images/default",
            _CONNECTED: !0,
            IS_APPACC_USER: !1,
            IS_GUEST_USER: !1,
            CLIENT_PORTAL_ZAID: void 0,
            GUID: void 0,
            IS_CUSTOM_DOMAIN: !1,
            SPACE_KEYCODE: 32,
            _cssClasses: {
                NEG_PRIMARY_BTN: "zcl-btn-neg--primary",
                NEG_SECONDARY_BTN: "zcl-btn-neg--secondary",
                PRIMARY_BTN: "zcl-btn--primary",
                SECONDARY_BTN: "zcl-btn--secondary"
            }
        },
        modules: {
            directCall: !0
        },
        config: {
            mlLibrary: !0,
            mediaFeedback: !0
        },
        wms_status_api: function() {
            return this.Constants._CONNECTED
        },
        user_status_api: {
            isBusy: function() {
                return !1
            },
            isDND: function() {
                return !1
            }
        },
        settings_api: {
            get: function() {
                return 0
            }
        },
        users_api: {
            getName: function(e, t) {
                return t
            },
            getImgUrlById: function(e, t) {
                return t = $WC.Matcher.check("imagesize", t) ? t : "thumb", MediaCall.BRIDGE.Constants.PHOTOSERVER + "/file?ID=" + e + "&exp=6000&t=user&fs=" + t
            }
        },
        bots_api: {
            getImgUrl: function(e) {
                return MediaCall.BRIDGE.Constants.IMGDEFAULTSTATICURL + "/" + ZCMediaConstants.defaultImageNames.BOT_DEFAULT_IMG
            }
        },
        resource_api: {
            getRealValue: function(e) {
                return e
            }
        },
        get_z_index: function() {
            return 1e3
        },
        get_frame_origin: function() {
            return window.location.origin
        },
        get_url_prefix: function() {
            return ""
        },
        listener: {
            handleCallStart: () => !0,
            handleCallAPIError: () => !0,
            handleCallEnd: () => !0,
            handleScreenShareStart: () => !0,
            handleScreenShareEnd: () => !0
        }
    },
    defaultMethods: {
        getOS: function() {
            var e = window.navigator.userAgent,
                t = window.navigator.platform,
                i = null;
            return -1 !== ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].indexOf(t) ? i = "Mac" : -1 !== ["iPhone", "iPad", "iPod"].indexOf(t) ? i = "iOS" : -1 !== ["Win32", "Win64", "Windows", "WinCE"].indexOf(t) ? i = "Windows" : /Android/.test(e) ? i = "Android" : !i && /Linux/.test(t) && (i = "Linux"), i.toLowerCase()
        },
        isMacOs: function() {
            return -1 != navigator.appVersion.indexOf("Mac")
        },
        isMacOSMojaveOrOlder: function() {
            var e = navigator.userAgent.match(/Mac\sOS\sX\s10(.|_)(7|8|9|10|11|12|13|14)/);
            return !$WC.Util.isEmpty(e) && e.length
        },
        isMacOSCatalinaOrNewer: function() {
            return this.isMacOs() && !this.isMacOSMojaveOrOlder()
        },
        isWindowsOs: function() {
            return -1 != navigator.appVersion.indexOf("Windows")
        },
        isAppleSilicon: function() {
            var e = navigator.userAgent.match(/AppleSilicon/);
            return this.isMacOs() && !$WC.Util.isEmpty(e) && e.length
        },
        getWindowsVersion: function() {
            try {
                return Math.ceil(parseFloat(navigator.userAgent.match(/Windows\sNT\s([^;]+)/)[1]))
            } catch (e) {}
            return -1
        },
        isWindows10orNewer: function() {
            return this.isWindowsOs() && this.getWindowsVersion() > 10
        },
        Browser: {
            CHROME: "chrome",
            FIREFOX: "firefox",
            OPERA: "opera",
            SAFARI: "safari",
            IE: "ie",
            EDGE: "edge",
            name: null,
            getBrowserName: function() {
                if (this.name) return this.name;
                (navigator && navigator.vendor || "").toLowerCase();
                var e = (navigator && navigator.userAgent || "").toLowerCase();
                return $WC.Matcher.check("firefox_useragent_lowercase", e) ? this.name = this.FIREFOX : $WC.Matcher.check("opera_useragent_lowercase", e) ? this.name = this.OPERA : $WC.Matcher.check("edge_useragent_lowercase", e) ? this.name = this.EDGE : $WC.Matcher.check("chrome_useragent_lowercase", e) ? this.name = this.CHROME : $WC.Matcher.check("ie_useragent_lowercase", e) ? this.name = this.IE : $WC.Matcher.check("safari_useragent_lowercase", e) ? this.name = this.SAFARI : this.name = "unknown", this.name
            },
            isFirefox: function() {
                return this.getBrowserName() == this.FIREFOX
            },
            isChrome: function() {
                return this.getBrowserName() == this.CHROME
            },
            isOpera: function() {
                return this.getBrowserName() == this.OPERA
            },
            isSafari: function() {
                return this.getBrowserName() == this.SAFARI
            },
            isEdge: function() {
                return this.getBrowserName() == this.EDGE
            }
        },
        getOS: function() {
            var e = window.navigator.userAgent,
                t = window.navigator.platform,
                i = null;
            return -1 !== ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].indexOf(t) ? i = "Mac" : -1 !== ["iPhone", "iPad", "iPod"].indexOf(t) ? i = "iOS" : -1 !== ["Win32", "Win64", "Windows", "WinCE"].indexOf(t) ? i = "Windows" : /Android/.test(e) ? i = "Android" : !i && /Linux/.test(t) && (i = "Linux"), i.toLowerCase()
        },
        animateBufferLoader: function(e, t) {
            if ("object" == typeof e) {
                for (var i = this.getCssTransformProperty() + ":rotate({{degree}}deg) translate(0px, -150%);animation-delay: {{delay_time}}s", n = 360 / (t = t ? parseInt(t) : 12), a = 1 / t, s = 0, o = 0, r = "", d = 0; d < t; d++) r += '<div class="zc-buffer-loader-bar" style="' + $WC.template.replace(i, {
                    degree: s,
                    delay_time: o
                }) + '"></div>', o += a, s += n;
                var c = '<div class="zc-buffer-loader">' + r + "</div>";
                e.append(c)
            }
        },
        getCssTransformProperty: function() {
            for (var e = ["transform", "-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform"], t = 0; t < e.length; t++)
                if (void 0 !== document.body.style[e[t]]) return e[t]
        },
        queueAnimation: function() {
            var e = [],
                t = null,
                i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
                n = window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame,
                a = function() {
                    (e = e.filter((function(e) {
                        return e()
                    }))).length && (t = i(a))
                };
            return function(s) {
                e.push(s), t && n(t), t = i(a)
            }
        }(),
        getDurationInHrMinSec: function(e) {
            var t = "",
                i = e / 1e3,
                n = Math.floor(i / 3600);
            i %= 3600;
            var a = Math.floor(i / 60),
                s = Math.floor(i % 60),
                o = n > 0,
                r = a > 0,
                d = s > 0;
            return o && (t += n), r && (t += o ? ":" + $Date.append0(a) : a), d && (t += o && !r ? ":" + $Date.append0(a) + ":" + $Date.append0(s) : r ? ":" + $Date.append0(s) : "00:" + $Date.append0(s)), t
        },
        cloneObject: function(e, t) {
            return t ? ZCJQuery.extend(!0, {}, e) : ZCJQuery.extend({}, e)
        },
        positionTargetElementUpDown: function(e, t, i) {
            i = i || {};
            var n, a, s = t.outerHeight(),
                o = "editor" == t.attr("trigger"),
                r = i.height ? i.height : s,
                d = t.outerWidth(),
                c = e.offset().left,
                l = e.offset().top,
                u = e.outerHeight(),
                p = e.outerWidth(),
                f = ZCJQuery(document).outerHeight(),
                m = l + u < f / 2,
                v = l > f / 2;
            i.setInTop && (m = !1, v = !0);
            var C = i.maxwidth ? Math.min(i.maxwidth, p) : p,
                _ = c + (p - (C = i.minwidth ? Math.max(i.minwidth, C) : C)) - (i.center ? d / 2 - p / 2 : 0);
            return _ = void 0 !== i.leftoffset ? _ - i.leftoffset : _, m ? n = l + u - (i.top_offset ? i.top_offset : 0) : v && o ? a = f - l + (i.bottom_offset ? i.bottom_offset : 0) : n = l - s - (i.bottom_offset ? i.bottom_offset : 0), i.$parentElement && (_ -= i.$parentElement.offset().left, n -= i.$parentElement.offset().top), {
                top: n,
                bottom: a,
                left: _,
                position: "fixed",
                width: C,
                height: r
            }
        },
        isJQueryAvailable: function() {
            return void 0 !== window.jQuery && void 0 !== jQuery.fn && "function" == typeof jQuery.fn.on
        },
        loadMultipleFiles: function(e, t, i, n) {
            var a = t.length,
                s = {
                    type: e,
                    callback: function() {
                        --a <= 0 && "function" == typeof i && i()
                    }
                };
            t.forEach((function(e) {
                s.url = e, n && n.hasOwnProperty(e) && MediaCall.BRIDGE.isStaticFileIntegrityCheckEnabled() && (s.integrity = "sha384-" + n[e]), $ZCUtil.loadDynamicFiles(s)
            }))
        },
        loadDynamicFiles: function(e) {
            if (document.querySelectorAll('script[src="' + e.url + '"]').length || document.querySelectorAll('link[href="' + e.url + '"]').length) "function" == typeof e.callback && e.callback();
            else {
                var t = document.createElement(e.type);
                "script" === e.type ? (t.type = e.scriptType ? e.scriptType : "text/javascript", t.src = e.url) : (t.type = "text/css", t.href = e.url, t.rel = "stylesheet"), t.onload = function() {
                    "function" == typeof e.callback && e.callback()
                }, t.onerror = function() {
                    "function" == typeof e.errorcallback && e.errorcallback(), "script" === e.type ? document.querySelector('script[src="' + e.url + '"]').remove() : document.querySelector('link[href="' + e.url + '"]').remove()
                }, e.integrity && MediaCall.BRIDGE.isStaticFileIntegrityCheckEnabled() && (t.setAttribute("integrity", e.integrity), t.setAttribute("crossorigin", "anonymous")), document.body.appendChild(t)
            }
        },
        ResourceManager: {
            isAVMessageResourceProcessed: !1,
            processAVResourceObject: function() {
                "undefined" == typeof AVResourceMessageObject || this.isAVMessageResourceProcessed || (AVResourceMessageObject = Object.fromEntries(Object.entries(AVResourceMessageObject).map(([e, t]) => [`avcliq.${e}`, t])), this.isAVMessageResourceProcessed = !0)
            },
            combineResourceObject: function() {
                "function" == typeof MediaUtil.BRIDGE.ResourceAPI.combineResourceFiles && (this.processAVResourceObject(), MediaUtil.BRIDGE.ResourceAPI.combineResourceFiles(AVResourceMessageObject))
            },
            hasResourceKey: function(e) {
                return void 0 !== AVResourceMessageObject[e]
            },
            getRealValue: function(e, t) {
                var i = MediaUtil.BRIDGE.ResourceAPI.getRealValue(e, t);
                return e && e === i && (MediaUtil.BRIDGE.Resource.combineResourceObject(), i = MediaUtil.BRIDGE.ResourceAPI.getRealValue(e, t)), i
            }
        },
        debounce: function(e, t, i) {
            var n;
            return function() {
                clearTimeout(n);
                var a = arguments;
                n = setTimeout((function(t, i) {
                    e.apply(t, i)
                }), i, t, a)
            }
        }
    }
};
var MediaCall = {},
    MediaCallConstants = {},
    CallLogConstants = {},
    MediaCallRejectMessages = {};
window._isZCDesktopApp = function() {
    return MediaCall.isDesktopApp()
}, MediaCallRejectMessages = {
    _isInitialized: !1,
    _messages: [],
    MAX_LIMIT: 5,
    init: function() {
        MediaUtil.BRIDGE.Constants.IS_GUEST_USER || (this._isInitialized = !0, MediaCallAPI.getRejectMessages(MediaCallRejectMessages.setCustomMessageList.bind(this)))
    },
    isInitialized: function() {
        return this._isInitialized
    },
    getCustomMessageList: function() {
        return this._messages
    },
    setCustomMessageList: function(e) {
        this._messages = e ? e.reverse() : []
    },
    updateMessageList: function(e) {
        this._messages.length >= this.MAX_LIMIT && this._messages.pop(), this._messages.unshift(e)
    },
    hasCustomMessage: function() {
        return this._messages.length > 0
    }
}, CallLogConstants = {
    callStart: " call has been initiated from ",
    mediaSessionObject: "[MediaSessionObject]",
    existingSessionCheck: "Checking for existing media sessions...",
    existingSessionCheckSuccess: "Existing sessions are cleared, so call process can continue...",
    callUIShown: "[UI Shown] Call UI shown for caller",
    clentSupport: "[Client Support Object]",
    callInit: "[Call Initiated] Call state changed to initiating...",
    callEnd: "[Call End] Call ended",
    getMediaDevicesSuccess: "[Media device request completed] Request for media devices completed...",
    getMediaDevicesInit: "[Media device request] Request for media devices initiated...",
    availableMediaDevices: "Available media devices : ",
    selectedMediaDevices: "Selected media devices",
    sessionId: "Session Id : ",
    rawSessionID: "Raw Session Id : ",
    responseTime: "[API Response time] - ",
    callQualityScore: "[Call Quality Score] - ",
    networkPrediction: "[Before call connection network prediction] - (1 -> Good, 0 -> Poor)",
    candidatePairInfo: "[CandidatePairInfo] Selected candidate pair : ",
    cdnPolling: "[CDN Polling rtt] ",
    isWmsUp: "Is wms up : ",
    wmsInfo: "[WMS event logs]",
    canStartConnectionTimeout: "Is connection timeout started : ",
    initialReconnection: "Initial reconnection attempted ",
    migarting: "[CALL_MIGRATING]",
    migrated: "CALL_MIGRATED]",
    trackEnd: {
        event: "[Track ended] Renegotiating with new stream :",
        device: "[Track ended] Device label : "
    },
    timers: {
        callReceivedAckTimeout: "[Call received ack timeout] - call missed state",
        callRingingTimeout: "[Call ringing timeout] - call missed state"
    },
    startCallAPI: {
        success: "[Start call API] Start call API success... ",
        failed: "[Start call API] Start call API failed...",
        init: "[Start call API] Start call API triggered..."
    },
    callState: {
        waitingForDevicePermission: "[Call State] Waiting for device permission",
        connected: "[Update Call State API triggered] Call state - Connected",
        failed: "[Update Call State API failed]",
        missedOnBusy: "[Update Call State API triggered] Call state - Missed On Busy",
        received: "[Update Call State API triggered] Call state - call received",
        collision: "[Update Call State API triggered] Call state - call collision"
    },
    streamRequest: {
        audio: "[Stream request] Audio Stream request initiated for audio call",
        video: "[Stream request] Video Stream request initiated for video call",
        success: "[Stream request completed] Stream request completed...",
        failed: "[Stream request failed] stream request failed...",
        screen: {
            initDuringCall: "[Stream request initiated] Screen stream request initiated during call",
            success: "[Stream request success] Screen stream request success",
            stopped: "[Stream request stopped] Screen stream request stopped"
        },
        screenWithAudio: {
            init: "[Stream request] ScreenShareWithAudioCall Stream request initiated for screen share with audiocall",
            audioFailedYetProceed: "[Stream request failed] Audio Stream request failed for screen share with audio call, but proceeding without audio",
            audioFailed: "[Stream request failed] Audio Stream request failed for screen share with audio call",
            audioSuccess: "[Stream request success] Audio Stream request success for screen share with audio call",
            audioInit: "[Stream request] Audio Stream request initiated for screen share with audio call",
            screenSuccess: "[Stream request success] Screen Stream request success for screen share with audio call",
            screenFailed: "[Stream request failed] Screen Stream request failed for screen share with audio call",
            screenStopped: "[Stream request stop] Screen Stream request stopped for screen share with audio call",
            screenInit: "[Stream request] Screen Stream request initiated for screen share with audio call - Caller"
        }
    },
    webrtc: {
        sendOfferFailedRetry: "[WebRTC] [Send Offer API failed] Retrying send offer...",
        sendOfferFailedCallEnded: "[WebRTC] [Send Offer API failed] Call already ended...",
        sendOffer: "[WebRTC] [Send Offer API triggered] Send Offer with sdp - ",
        sendAnswer: "[WebRTC] [Send Answer API triggered] Send Answer with sdp - ",
        answerWithSdpInit: "[WebRTC] [Answer-call API] Answer call API called with sdp - ",
        answerWithSdpFailed: "[WebRTC] [Answer-call API failed] Answer call API failed...",
        updateIce: "[WebRTC] [updateIceCandidates API triggered]",
        forceTurn: "[WebRTC] Force turn : ",
        reconnect: "[WebRTC] [Reconnect Handler trigered] ReconnectionId - ",
        reinit: "[WebRTC] [Reinit Handler triggered]",
        renegotiate: "[WebRTC] [Renegotiate Handler triggered]",
        addTrack: "[WebRTC] [Track Handler triggered] track - ",
        iceCandidateError: "[WebRTC] Ice Candidate error ",
        iceConnectionStateChange: "[WebRTC] IceConnection state change : ",
        iceGatheringStateChange: "[WebRTC] IceGathering state change : ",
        signalingStateChange: "[WebRTC] Signaling state change : ",
        connection: {
            disconnected: "[WebRTC] [RTC Connection Disconnected]",
            failed: "[WebRTC] [RTC Connection Failed]",
            success: "[WebRTC] [RTC Connection connected]",
            closed: "[WebRTC] [RTC Connection closed]",
            setBitrate: "[WebRTC] [Set Bitrate] Constant Bit rate of 1M"
        },
        requestAndAddTrackInStream: {
            success: "[WebRTC] [requestAndAddTrackInStream Success] success callback received",
            failed: "[WebRTC] [requestAndAddTrackInStream failed]",
            init: "[WebRTC] [requestAndAddTrackInStream] initiated"
        },
        requestAndReplaceTracksInStream: {
            success: "[WebRTC] [requestAndReplaceTracksInStream success]",
            init: "[WebRTC] [requestAndReplaceTracksInStream] initiated to replace track - "
        }
    },
    wms: {
        callInit: "[wmsEvent] [CALL_INITIATED]",
        callRequested: "[wmsEvent] [CALL_REQUESTED]",
        callReceived: "[wmsEvent] [CALL_RECEIVED]",
        callAnswered: "[wmsEvent] [CALL_ANSWERED]",
        callAnsweredAck: "[wmsEvent] [CALL_ANSWERED_ACK]",
        callConnected: "[wmsEvent] [CALL_CONNECTED]",
        callCanceled: "[wmsEvent] [CALL_CANCELED]",
        callDeclined: "[wmsEvent] [CALL_DECLINED]",
        callMissed: "[wmsEvent] [CALL_MISSED]",
        callBusy: "[wmsEvent] [CALL_MISSED_ON_BUSY]",
        callEnd: "[wmsEvent] [CALL_END]",
        offer: "[wmsEvent] [WebRTC] offer sdp received - ",
        answer: "[wmsEvent] [WebRTC] answer sdp received - ",
        iceCandidates: "[wmsEvent] [WebRTC] Ice-Candidates received - ",
        reinit: "[wmsEvent] [WebRTC] Reinit connection",
        renegotiate: "[wmsEvent] [WebRTC] Renegotiate connection",
        callHold: "[wmsEvent] [CALL_HOLD]",
        mediaSetting: "[wmsEvent] [MEDIA_SETTING] object - "
    },
    ui: {
        minCall: "[UI Event] Action triggered to minimize call",
        maxCall: "[UI Event] Action triggered to maximize call",
        micOn: "[UI Event] Action triggered to turn-on mic",
        micOff: "[UI Event] Action triggered to turn-off mic",
        camOn: "[UI Event] Action triggered to turn-on camera",
        camOff: "[UI Event] Action triggered to turn-off camera",
        answer: "[UI Event] Action triggered to answer incomming call",
        end: "[UI Event] Action triggered to end ongoing call",
        screen: "[UI Event] Action triggered to share screen",
        stopScreen: "[UI Event] Action triggered to stop screen-share",
        videoSwitch: "[UI Event] Action triggered to switch-to-video",
        videoSwitchDecline: "[UI Event] Action triggered to decline video-switch suggestion",
        changedDevice: "[UI Event] Device changed from settings",
        setMediaDevice: "[UI Event] Action triggered to set media devices"
    }
}, MediaCallConstants = {
    MEDIA_PATH: "/thirdparty/media/",
    defaultCallId: "outgoingmediacall",
    customDomainPrefix: "/_avcliq",
    guestAPIPrefix: "/guestapi",
    fileNames: {
        INCOMING_TONE: "ringtone.mp3",
        WAITING_TONE: "waiting.mp3",
        RINGING_TONE: "feedback.mp3",
        RECONNECTING_TONE: "reconnect.mp3",
        CALL_END_TONE: "call_end.mp3",
        RECORDING_START: "recording_start.wav",
        RECORDING_STOP: "recording_stop.wav"
    },
    recordingAction: {
        STOP_AND_START_RECORDING: "stop_start",
        STOP_RECORDING: "stop"
    },
    baseUrl: "",
    setBaseUrl: function() {
        void 0 !== MediaUtil.BRIDGE.Constants && (this.baseUrl = MediaUtil.BRIDGE.Constants.IS_GUEST_USER ? this.guestAPIPrefix : "")
    },
    requests: {
        applyPreviewVideoBackgroundEffect: 1,
        applyVideoBackgroundEffect: 2
    },
    callReceivedAckTimeLimt: 3e4,
    callRingingTimeLimit: 35e3,
    incomingCallTimeLimit: 3e4,
    activeCallUpdateInterval: 3e4,
    endCallUIRemovalInterval: 1e4,
    callAnsweredDelayThreshold: 2e3,
    LONG_POLLING_INTERVAL: 2e3,
    INFO_MSG_MODE: "CALL_INFO",
    AV_VERSION_HEADER: "x-cliq-av",
    MULTIPLE_CALLS_HANDLING_TYPE_HEADER: "X-Multiple-Calls-Handling-Type",
    versionDirectives: {
        UPGRADE: "upgrade",
        DOWNGRADE: "downgrade"
    },
    multipleCallHandlingType: {
        VERIFY: "VERIFY",
        END_ACTIVE_CALLS: "END_ACTIVE_CALLS"
    },
    types: {
        AUDIO: "audio",
        VIDEO: "video",
        SCREEN_SHARE: "screen_share",
        SCREEN_SHARE_WITH_AUDIO: "screen_with_media"
    },
    request: {
        method: {
            GET: "GET",
            PUT: "PUT",
            POST: "POST",
            DELETE: "DELETE"
        },
        status: {
            SUCCESS: "success",
            FAILED: "failed"
        }
    },
    states: {
        WAITING_FOR_PERMISSION: 0,
        INITIATING: 1,
        INCOMING: 2,
        CALLING: 3,
        RINGING: 4,
        CONNECTING: 5,
        CONNECTED: 6,
        RECONNECTING: 7,
        END: 8,
        NO_RESPONSE: 9,
        DECLINED: 10,
        RECORDING: 11,
        RECORDED: 12,
        MIGRATING: 13,
        MIGRATED: 14,
        MISSED_ON_BUSY: 15,
        RECORDING_PROCESSING: 16,
        RECORDING_STARTED: 17,
        HANDOFF_IN_PROGRESS: 18,
        RECORDING_STOPPED: 19
    },
    logEvents: {
        GEO_NO_CANDIDATE: "GEO_NO_CANDIDATE",
        MAIN_NO_CANDIDATE: "MAIN_NO_CANDIDATE",
        BACKUP_NO_CANDIDATE: "BACKUP_NO_CANDIDATE",
        GEO_NO_CONNECT: "GEO_NO_CONNECT",
        MAIN_NO_CONNECT: "MAIN_NO_CONNECT",
        BACKUP_NO_CONNECT: "BACKUP_NO_CONNECT",
        MAIN_CONNECTED: "MAIN_CONNECTED",
        BACKUP_CONNECTED: "BACKUP_CONNECTED",
        LP_CONNECTED: "LP_CONNECTED",
        INITIAL_AUDIO_LOSS: "INITIAL_AUDIO_LOSS",
        CALL_RECIEVED_REQ_TIME: "CALL_RECIEVED_REQ_TIME",
        ANSWER_CALL_REQ_TIME: "ANSWER_CALL_REQ_TIME",
        ANSWERED_ACK_DELAY: "ANSWERED_ACK_DELAY",
        WS_DISCONNECT: "WS_DISCONNECT",
        AVG_RTT: "AVG_RTT",
        AVG_WMS_RTT: "AVG_WMS_RTT",
        RTT_CALL_START: "RTT_CALL_START",
        RTT_CALL_END: "RTT_CALL_END",
        TOTAL_PACKETS_SENT: "TOTAL_PACKETS_SENT",
        TOTAL_PACKETS_RECEIVED: "TOTAL_PACKETS_RECEIVED",
        TOTAL_PACKETS_LOST: "TOTAL_PACKETS_LOST",
        TOTAL_BYTES_SENT: "TOTAL_BYTES_SENT",
        FIRST_ICE_CANDIDATE: "FIRST_ICE_CANDIDATE",
        LAST_ICE_CANDIDATE: "LAST_ICE_CANDIDATE",
        FIRST_ADD_CANDIDATE: "FIRST_ADD_CANDIDATE",
        LAST_ADD_CANDIDATE: "LAST_ADD_CANDIDATE",
        ICE_CANDIDATE_HOST: "ICE_CANDIDATE_HOST",
        ICE_CANDIDATE_SRFLX: "ICE_CANDIDATE_SRFLX",
        ICE_CANDIDATE_RELAY: "ICE_CANDIDATE_RELAY"
    },
    ringingStates: {
        ringing: 1,
        declined: -1,
        no_response: 0,
        cancel_ringing: 2
    },
    networkHealth: {
        EXCELLENT: 4,
        GOOD: 3,
        LOW: 2,
        POOR: 1,
        DEADZONE: 0,
        getScore: function(e) {
            return e >= 5 ? this.EXCELLENT : 4 == e ? this.GOOD : 3 == e ? this.LOW : 2 == e || 1 == e ? this.POOR : this.DEADZONE
        }
    },
    statusText: {
        CALL_INITIATED: "CALL_INITIATED",
        CALL_REQUESTED: "CALL_REQUESTED",
        CALL_RECEIVED: "CALL_RECEIVED",
        CALL_ANSWERED: "CALL_ANSWERED",
        CALL_ANSWERED_ACK: "CALL_ANSWERED_ACK",
        CALL_CONNECTED: "CALL_CONNECTED",
        CALL_ACTIVE: "CALL_ACTIVE",
        CALL_DECLINED: "CALL_DECLINED",
        CALL_CANCELLED: "CALL_CANCELED",
        CALL_MISSED: "CALL_MISSED",
        CALL_MISSED_ON_BUSY: "CALL_MISSED_ON_BUSY",
        CALL_MIGRATING: "CALL_MIGRATING",
        CALL_MIGRATED: "CALL_MIGRATED",
        CALL_HANDOFF_IN_PROGRESS: "CALL_HANDOFF_IN_PROGRESS",
        CALL_HANDOFF_COMPLETE: "CALL_HANDOFF_COMPLETE",
        CALL_END: "CALL_END",
        CALL_COLLISION: "CALL_COLLISION"
    },
    isCallInitiated: function(e) {
        return e === this.statusText.CALL_INITIATED
    },
    isCallReceived: function(e) {
        return e === this.statusText.CALL_RECEIVED
    },
    isCallRequested: function(e) {
        return e === this.statusText.CALL_REQUESTED
    },
    isCallAnswered: function(e) {
        return e === this.statusText.CALL_ANSWERED
    },
    isCallMissed: function(e) {
        return e === this.statusText.CALL_MISSED
    },
    isCallMissedOnBusy: function(e) {
        return e === this.statusText.CALL_MISSED_ON_BUSY
    },
    isCallDeclined: function(e) {
        return e === this.statusText.CALL_DECLINED
    },
    isCallCancelled: function(e) {
        return e === this.statusText.CALL_CANCELLED
    },
    isCallMigrating: function(e) {
        return e === this.statusText.CALL_MIGRATING
    },
    isCallMigrated: function(e) {
        return e === this.statusText.CALL_MIGRATED
    },
    isCallHandOffInProgress: function(e) {
        return e === this.statusText.CALL_HANDOFF_IN_PROGRESS
    },
    isCallEnded: function(e) {
        return e === this.statusText.CALL_END
    }
}, MediaCall = function() {
    var e = !1,
        t = !1;
    return {
        BRIDGE: void 0,
        serverUpCallBack: void 0,
        setClientBridge: function(e) {
            this.BRIDGE = e
        },
        getCurrentUserId: function() {
            return void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants.ZUID : void 0
        },
        isInitialized: function() {
            return t
        },
        isForceTurnEnabled: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isForceTurnEnabled()
        },
        isNetworkIndicatorEnabled: function() {
            return !1
        },
        isNewRTCConnectionEnabled: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isNewRTCConnectionEnabled()
        },
        isReconnectOnConnectionTimeoutEnabled: function(e) {
            return void 0 !== e && e.isInitialReconnectionSupported()
        },
        isAdhocCallConversionEnabled: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isAdhocCallConversionEnabled()
        },
        isStaticFileIntegrityCheckEnabled: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isStaticFileIntegrityCheckEnabled()
        },
        isStartRecordingAllowed: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isAVRecordingEnabled() && !this.BRIDGE.Constants.IS_GUEST_USER
        },
        isRecordingConfigEnabled: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isRecordingConfigEnabled()
        },
        isDiretCallVideoEffectsEnabled: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isDiretCallVideoEffectsEnabled()
        },
        isCallStrengthAnalysisSupported: function() {
            return !($ZCUtil.Browser.isSafari() || $ZCUtil.Browser.isFirefox())
        },
        isAudioOrVideoOrScreenAllowed: function() {
            return this.isAudioCallAllowed() || this.isVideoCallAllowed() || this.isScreenShareAllowed()
        },
        isAudioOrVideoCallAllowed: function() {
            return this.isAudioCallAllowed() || this.isVideoCallAllowed()
        },
        isAudioCallAllowed: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isAudioCallAllowed()
        },
        isVideoCallAllowed: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isVideoCallAllowed()
        },
        isScreenShareAllowed: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isScreenShareAllowed()
        },
        isScreenShareWithAudioCallAllowed: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isScreenShareWithAudioCallAllowed()
        },
        isNotebookIntegrationSupported: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isNotebookIntegrationSupported()
        },
        isDTXEnabled: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isDirectCallDTXEnabled()
        },
        isWhiteBoardAllowed: function(e) {
            return void 0 !== this.BRIDGE && this.BRIDGE.isWhiteBoardAllowed() && void 0 !== e && e.isWhiteBoardSupported()
        },
        isPresentationAllowed: function(e) {
            return void 0 !== this.BRIDGE && this.BRIDGE.isPresentationAllowed() && void 0 !== e && e.isPresentationSupported()
        },
        isAVCallHandOffEnabled: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isAVCallHandOffEnabled() && !this.BRIDGE.Constants.IS_GUEST_USER
        },
        isAVSDPCompressionEnabled: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isAVSDPCompressionEnabled()
        },
        isDesktopApp: function() {
            return void 0 !== this.BRIDGE && this.BRIDGE.isAVLibraryLoadedInDesktopApp()
        },
        isAudioCall: function(e) {
            return MediaCallConstants.types.AUDIO === e
        },
        isVideoCall: function(e) {
            return MediaCallConstants.types.VIDEO === e
        },
        isScreenShareWithAudioCall: function(e) {
            return MediaCallConstants.types.SCREEN_SHARE_WITH_AUDIO === e
        },
        isScreenShare: function(e) {
            return MediaCallConstants.types.SCREEN_SHARE === e
        },
        isDirectCall: function(e) {
            return this.isAudioCall(e) || this.isVideoCall(e) || this.isScreenShare(e) || this.isScreenShareWithAudioCall(e)
        },
        initialize: function(i, n) {
            this.isInitialized() ? "function" == typeof i && i() : this.isAudioOrVideoOrScreenAllowed() ? MediaManager.initialize((function() {
                if (MediaUtil.BRIDGE.isSupported()) {
                    if (e) return;
                    e = !0, $ZCUtil.loadMultipleFiles("script", MediaUtil.BRIDGE.ServerConstants.DIRECT_CALL_JS_LIST, (function() {
                        t = !0, e = !1, MediaCallImpl.init(), "function" == typeof i && i()
                    }), MediaUtil.BRIDGE.ServerConstants.MEDIACALL_JS_INTEGRITY_HASH)
                }
            })) : "function" == typeof n && n()
        },
        convertLiveFeedToCall: function(e, t, i, n, a) {
            var s = new MediaCallSession({
                call_id: MediaCallConstants.defaultCallId,
                type: e,
                chat_id: i,
                caller_id: $zcg._ZUID,
                callee_id: t,
                status_text: MediaCallConstants.statusText.CALL_INITIATED
            });
            void 0 !== a && (s.setAssociatedLiveFeedId(a), LiveFeedImpl.getIncomingFeedSession(a).setAssociatedCallId(s.getId()));
            MediaCall.initiateCallProcess(s, n)
        },
        initiateStartCallProcess: function(e, t, i, n) {
            MediaCall.initiateCallProcess(new MediaCallSession({
                call_id: MediaCallConstants.defaultCallId,
                type: e,
                chat_id: i,
                caller_id: MediaUtil.BRIDGE.Constants.ZUID,
                callee_id: t,
                status_text: MediaCallConstants.statusText.CALL_INITIATED
            }), n)
        },
        initiateCallProcess: function(e, t, i, n) {
            if (MediaCallImpl.isAVLoadedInIntegratedUI()) AVISCUtilBridge.initiateCall(e.getType(), e.getCalleeId(), t);
            else if (e.writeToLog(CallLogConstants.sessionId + MediaUtil.BRIDGE.getSid() + "  " + CallLogConstants.rawSessionID + MediaUtil.BRIDGE.getRawSid()), e.writeToLog(e.getType() + CallLogConstants.callStart + t), !(!this.isInitialized() || MediaManager.isStreamRequested() || MediaManager.isRequestPending() || MediaCallImpl.hasOutgoingSession() || MediaManager.isCustomRequestPending(ZCMediaConstants.requests.prefetchMetaDetails))) {
                var a = e.isCaller(MediaUtil.BRIDGE.Constants.ZUID),
                    s = a && (e.isScreenShareWithAudioCall() || e.isScreenShare());
                if (!s || !MediaUtil.BRIDGE.Util.Browser.isChrome() || WebRTCUserMedia.isScreenShareSupportedInNative() || ScreenShare.Extension.isInstalled()) {
                    var o = MediaCallImpl.getCurrentIncomingSession();
                    void 0 === o || o.getCallerId() !== e.getCalleeId() || !o.getOtherMember().getClientSupport().call_collision_handling || o.isInCallAnsweredState() ? (e.writeToLog(CallLogConstants.existingSessionCheck), MediaManager.handleExistingSessions(function() {
                        e.writeToLog(CallLogConstants.existingSessionCheckSuccess);
                        var o = a ? "START_CALL" : "ANSWER_CALL",
                            r = {
                                type: e.getType(),
                                source: t,
                                client: _isZCDesktopApp() ? "Desktop" : "Web"
                            };
                        a && (e.writeToLog(CallLogConstants.callUIShown), MediaCallImpl.setOutgoingSession(e), MediaCallUI.showCallUI(e));
                        var d = function(t) {
                            MediaManager.setRequestCompleted(), e.writeToLog(CallLogConstants.getMediaDevicesSuccess), MediaUtil.logAvailableDevices(e, t);
                            var s = function(t, n) {
                                    if (e.writeToLog(CallLogConstants.streamRequest.success), MediaManager.resetStreamRequested(), a && !MediaCallImpl.hasOutgoingSession() || !a && void 0 === MediaCallImpl.getFromIncomingSessions(e.getId())) return void 0 !== t && WebRTCUserMedia.closeStream(t._getType()), void(void 0 !== n && WebRTCUserMedia.closeStream(n._getType()));
                                    var s = e.getCurrentMember();
                                    if (s.setAVUpStream(t), s.setScreenUpStream(n), void 0 !== t) {
                                        var d = MediaCallUI.getVideoContainer(e.getId(), s.getId()),
                                            c = MediaCallUI.getMediaCallWrapper(e.getId());
                                        MediaUtil.setStreamInContainer(s.getId(), d, t, (function() {
                                            WebRTCUserMedia.isAudioVideoStreamType(t._getType()) && c.find("[videowrapper]").addClass("AV-call-preview")
                                        }))
                                    }
                                    void 0 !== n && n._getPrimaryVideoTrack().applyConstraints({
                                        frameRate: {
                                            min: 15,
                                            max: 15
                                        }
                                    }).catch(), e.setMultipleCallsHandlingType(MediaCallConstants.multipleCallHandlingType.VERIFY), a ? MediaCallImpl.startCall(e) : MediaCallImpl.answerCall(e), "function" == typeof i && i(), void 0 !== MediaUtil.BRIDGE.Tracker && MediaUtil.BRIDGE.Tracker.track(o + "_INITIATED", r)
                                },
                                d = function(t, i) {
                                    e.writeToLog(CallLogConstants.streamRequest.failed), e.isLiveFeedAssociated() && LiveFeedHandler.callEvents.handlEnd(e), MediaCallImpl.clearOutgoingSession(), a && MediaCallUI.removeCallUI(e), MediaManager.handleMediaError(t, i), MediaManager.resetStreamRequested(), "function" == typeof n && n()
                                };
                            if (e.isAudioCall() || !a && e.getCurrentMember().isVideoCallWithoutVideo()) e.writeToLog(CallLogConstants.streamRequest.audio), WebRTCUserMedia.requestAudioStream(s, d, void 0, MediaUtil.getAudioProcessingOptions(e)), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL);
                            else if (e.isVideoCall()) {
                                e.writeToLog(CallLogConstants.streamRequest.video), WebRTCUserMedia.requestAudioVideoStream(s, (function(t, i) {
                                    if (!a) return e.writeToLog(CallLogConstants.streamRequest.failed), MediaManager.resetStreamRequested(), WebRTCUserMedia.requestAudioStream(s, d, void 0, MediaUtil.getAudioProcessingOptions(e)), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL), void e.getCurrentMember().setVideoCallWithoutVideo();
                                    d(t, i)
                                }), void 0, MediaUtil.getStreamProcessingOptions(e)), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_VIDEO, ZCMediaConstants.mediaModules.DIRECT_CALL)
                            } else if (e.isScreenShareWithAudioCall()) {
                                e.writeToLog(CallLogConstants.streamRequest.screenWithAudio.init);
                                var c = function(t) {
                                    e.writeToLog(CallLogConstants.streamRequest.screenWithAudio.audioInit), WebRTCUserMedia.requestAudioStream((function(i) {
                                        e.writeToLog(CallLogConstants.streamRequest.screenWithAudio.audioSuccess), s(i, t)
                                    }), (function(i, n) {
                                        e.getCurrentMember().setScreenShareWithoutAudio(), e.writeToLog(CallLogConstants.streamRequest.screenWithAudio.audioFailedYetProceed), s(void 0, t)
                                    }), void 0, MediaUtil.getAudioProcessingOptions(e)), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL)
                                };
                                if (a) {
                                    e.writeToLog(CallLogConstants.streamRequest.screenWithAudio.screenInit), WebRTCUserMedia.requestScreenStream((function(t) {
                                        e.writeToLog(CallLogConstants.streamRequest.screenWithAudio.screenSuccess), MediaManager.resetStreamRequested();
                                        var i = function(i) {
                                            MediaCallImpl.hasOutgoingSession() ? (MediaUtil.logAvailableDevices(e, i), c(t)) : void 0 !== t && WebRTCUserMedia.closeStream(t._getType())
                                        };
                                        WebRTCUserMedia.getMediaDevices(i, i)
                                    }), (function(t, i) {
                                        e.writeToLog(CallLogConstants.streamRequest.screenWithAudio.screenFailed), d(t, i)
                                    }), (function() {
                                        var e = MediaCallImpl.hasOutgoingSession() ? MediaCallImpl.getOutgoingSession() : MediaCallImpl.getCurrentSession();
                                        e && (e.writeToLog(CallLogConstants.streamRequest.screenWithAudio.screenStopped), e.isInCallAnsweredState() ? MediaCallHandler.UIEvents.stopScreenShare() : MediaCallImpl.handleEnd(e.getId(), !0))
                                    }), MediaManager.getComputerAudioConstraints(), void 0, void 0, !0), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.SCREEN, ZCMediaConstants.mediaModules.DIRECT_CALL)
                                } else c()
                            }
                            void 0 !== MediaUtil.BRIDGE.Tracker && MediaUtil.BRIDGE.Tracker.track(o + "_TRIGGERED", r)
                        };
                        MediaCallUI.adaptUIToState(e, MediaCallConstants.states.INITIATING), MediaManager.setCustomRequestAsPending(ZCMediaConstants.requests.prefetchMetaDetails), MediaManager.prefetchMetaDetails((function() {
                            MediaManager.setCustomRequestAsCompleted(ZCMediaConstants.requests.prefetchMetaDetails), e.writeToLog(CallLogConstants.callState.waitingForDevicePermission), MediaCallUI.adaptUIToState(e, MediaCallConstants.states.WAITING_FOR_PERMISSION), e.writeToLog(CallLogConstants.getMediaDevicesInit), s ? d() : (MediaManager.setRequestPending({
                                module: ZCMediaConstants.sessionTypes.CALLS,
                                request_type: ZCMediaConstants.requestTypes.DEVICES
                            }), WebRTCUserMedia.getMediaDevices(d, d))
                        }))
                    }.bind(this))) : MediaCallUI.answerCall(o.getId(), MediaCall.isVideoCall(e.getType()) ? "audio_video" : "audio")
                } else MediaManager.showExtensionInstallPreview("mediacallbuttons")
            }
        },
        isCurrentChat: function(e) {
            return !!this.isInitialized() && MediaCallUI.isCurrentChat(e)
        },
        setUnreadMessageCount: function(e, t) {
            this.isInitialized() && MediaCallUI.setUnreadMessageCount(e, t)
        },
        handleChatWindowCreated: function(e) {
            this.isInitialized() && MediaCallUI.handleChatWindowCreated(e)
        },
        handleChatWindowClosed: function(e) {
            this.isInitialized() && MediaCallUI.handleChatWindowClosed(e)
        },
        handleGetMeFront: function(e) {
            this.isInitialized() && MediaCallUI.handleGetMeFront(e)
        },
        handleResize: function() {
            this.isInitialized() && MediaCallUI.handleResize()
        },
        clearAllSessions: function() {
            if (this.isInitialized() && (MediaCallImpl.hasCurrentSession() && MediaCallImpl.handleEnd(MediaCallImpl.getCurrentSession().getId(), !0, {
                    playEndTone: !0
                }), MediaCallImpl.hasOutgoingSession() && MediaCallImpl.handleEnd(MediaCallImpl.getOutgoingSession().getId(), !0), MediaCallImpl.hasCurrentIncomingSession())) {
                var e = MediaCallImpl.getAllIncomingSessions();
                for (var t in e) MediaCallImpl.handleEnd(e[t].getId(), !1)
            }
        },
        handleWmsConnectionStatus: function(e) {
            e && "function" == typeof serverUpCallBack && (serverUpCallBack(), serverUpCallBack = void 0)
        },
        handleIncomingCalls: function() {
            if (this.isInitialized()) {
                var e = function() {
                    var e = MediaUtil.BRIDGE.getIncomingCalls();
                    if (void 0 !== e && !$WC.Util.isEmptyObject(e))
                        for (var t in e) {
                            var i = e[t],
                                n = i.status_text,
                                a = MediaUtil.BRIDGE.Util.getSyncedCurrentTime() - new Date(parseInt(i.start_time));
                            if (("CALL_REQUESTED" === n || "CALL_RECEIVED" === n) && a < MediaCallConstants.callRingingTimeLimit) return void MediaCallHandler.wmsEvents.CALL_REQUESTED({
                                data: i
                            })
                        }
                };
                MediaUtil.BRIDGE.isWMSConnected() ? e() : serverUpCallBack = e
            }
        },
        handleEscape: function() {
            return !!this.isInitialized() && MediaCallUI.handleEscape()
        },
        startPushToTalk: function() {
            return !(!this.isInitialized() || !MediaCallImpl.hasCurrentSession()) && MediaCallImpl.startPushToTalk()
        },
        stopPushToTalk: function() {
            return !(!this.isInitialized() || !MediaCallImpl.hasCurrentSession()) && MediaCallImpl.stopPushToTalk()
        },
        handOffCall: function(e, t) {
            if (this.isInitialized()) {
                var i = MediaCallImpl.getFromIncomingSessions(e);
                void 0 !== i ? MediaCallUI.answerCall(e, MediaCall.isVideoCall(i.getType()) ? "audio_video" : "audio", t) : (MediaCallImpl.handOffCall(e), t())
            }
        }
    }
}();
var PrimeTime = {};
PrimeTime = function() {
    var e, t = !1,
        i = !1;

    function n() {
        return void 0 !== WebRTCUserMedia && WebRTCUserMedia.isSupported() && !$Util.Browser.isEdge() && (!$Util.Browser.isSafari() || WebRTCUserMedia.isDisplayMediaSupported() || $Util.isSafari14orAbove())
    }

    function a() {
        return SecurityManager.hasPermission(Modules.PrimeTime)
    }
    return {
        modes: {
            HANDSHAKE: "handshake",
            ASSEMBLY: "assembly"
        },
        isAllowed: function() {
            return n() && a()
        },
        isEnabled: function() {
            return a()
        },
        isRecordingEnabled: function() {
            return SecurityManager.hasPermission(Modules.PrimeTimeRecording)
        },
        isAssemblyModeAllowed: function() {
            return this.isAllowed() && Plan.isPrimeTimeAssemblyAllowed()
        },
        isHandShakeMode: function(e) {
            return e === this.modes.HANDSHAKE
        },
        isAssemblyMode: function(e) {
            return e === this.modes.ASSEMBLY
        },
        isInitialized: function() {
            return i
        },
        isGuestSession: function() {
            return WmsImpl.isGuestUser() && void 0 !== $zcg._mediaSessionDetails
        },
        handleGuestConnected: function() {
            if (this.isGuestSession()) {
                let e = "streaming" === $zcg._mediaSessionDetails.wss_type ? $zcg._mediaSessionDetails.conferenceId : $zcg._mediaSessionDetails.id,
                    t = function() {
                        PrimeTime.join(e), $("#ptloadingcontainer").remove()
                    };
                this.initialize(t)
            }
        },
        initialize: function(e, s) {
            this.isInitialized() ? "function" == typeof e && e() : a() ? MediaManager.initialize((function() {
                if (n()) {
                    if (t) return;

                    function a() {
                        i = !0, t = !1, PrimeTimeImpl.init(), "function" == typeof e && e()
                    }
                    "undefined" == typeof PrimeTimeImpl ? (t = !0, $Util.loadMultipleFiles("script", $zcg._VIDEOCHATPROPS.PRIMETIME_JS_LIST, a)) : a()
                }
            })) : "function" == typeof s && s()
        },
        handleWmsConnectionStatus: function(t) {
            t && "function" == typeof e && (e(), e = void 0)
        },
        handlePermaLink: function(e, t) {
            t || ($("#ptloadingcontainer").remove(), window.history.pushState({}, null, $Util.getUrlPrefix() + "/index.do"))
        },
        handleStartPermalink: function(t, i) {
            var n = t ? i.search : window.location.search,
                a = MediaUtil.getSearchParamsFromUrl(n).chat_id,
                s = function() {
                    if (t) ZCLiveEvents.triggerScheduleUI(ZCMediaConstants.scopeTypes.CHAT, a, Conference.getLiveEventDefaultTitle(a), ZCMediaConstants.triggerSource.PERMALINK);
                    else {
                        ZCLiveEvents.initialize((function() {
                            var t = function() {
                                ZCLiveEvents.triggerScheduleUI(ZCMediaConstants.scopeTypes.CHAT, a, Conference.getLiveEventDefaultTitle(a), ZCMediaConstants.triggerSource.PERMALINK)
                            };
                            $zcg._CONNECTED ? t() : e = t
                        }), (function() {
                            window.history.pushState({}, null, $Util.getUrlPrefix() + "/index.do")
                        }))
                    }
                };
            a && "" === ConversationsList.getTitle(a) ? Chat.getChatsFromServerByChatIds(a).then(() => {
                s()
            }) : s()
        },
        showErrorWindow: function(e) {
            var t = $WC.template.replace('<div id="primetimewindow" style="background-image: url({{background_image}})" class="PT-wrp flex"></div>', {
                background_image: $zcg._IMGDEFAULTSTATICURL + "/videochat-bg.jpg"
            });
            $("body").html(t), PrimeTimeUI.showSessionEndInfo(e)
        },
        join: function(e, t) {
            WmsImpl.isGuestUser() && $Util.Browser.isFirefox() ? this.showErrorWindow(ZCMediaConstants.endCases.unsupportedBrowser) : this.isInitialized() ? PrimeTimeImpl.checkAndJoin(e, t) : a() ? WmsImpl.isGuestUser() ? this.showErrorWindow(ZCMediaConstants.endCases.unsupportedBrowser) : UI.updateBanner(Resource.getRealValue("primetime.browser.version.unsupported"), 2e3, !0) : UI.updateBanner(Resource.getRealValue("primetime.module.disabled"), 2e3, !0)
        },
        isCurrentChat: function(e) {
            return !!this.isInitialized() && PrimeTimeUI.isCurrentChat(e)
        },
        setUnreadMessageCount: function(e, t) {
            this.isInitialized() && PrimeTimeUI.setUnreadMessageCount(e, t)
        },
        handleChatWindowCreated: function(e) {
            this.isInitialized() && PrimeTimeUI.handleChatWindowCreated(e)
        },
        handleChatWindowClosed: function(e) {
            this.isInitialized() && PrimeTimeUI.handleChatWindowClosed(e)
        },
        handleChatRemoved: function(e) {
            this.isInitialized() && PrimeTimeImpl.handleChatRemoved(e)
        },
        handleGetMeFront: function(e) {
            this.isInitialized() && PrimeTimeUI.handleGetMeFront(e)
        },
        handleWmsMessage: function(e) {
            this.isInitialized() && ("function" == typeof PrimeTimeHandler.wmsEvents[e.opr] && PrimeTimeHandler.wmsEvents[e.opr](e), "undefined" != typeof LiveVideoMsgHandler && LiveVideoMsgHandler.handleMessage(e))
        },
        handleEscape: function() {
            return !!(this.isInitialized() && PrimeTimeImpl.hasCurrentSession() && PrimeTimeUI.isInMaximizedView()) && (PrimeTimeUI.showMinimizedWindow(), !0)
        },
        handleFocusAfterEscape: function() {
            var e = !1;
            return this.isInitialized() && PrimeTimeImpl.hasCurrentSession() && PrimeTimeUI.isInMaximizedView() && (e = !0), e
        }
    }
}(), "undefined" != typeof SecurityManager && SecurityManager.register(Modules.PrimeTime, (function() {
    ZCLiveEvents.isEnabled() && ZCLiveEvents.initialize(() => {
        Conference.updateOptionsInUI()
    }), PrimeTime.initialize()
}));
var ConferenceLog = {},
    Conference = {};
ConferenceLog = {
    _logString: "",
    _tempEventLogString: "",
    _tempEventLogObj: {},
    lastWmsDebugInfoLoggedTime: void 0,
    statsCanBePushed: !1,
    isStatsCanBePushed: function() {
        return Conference.isStatsEnabled() && this.statsCanBePushed
    },
    networkStats: {
        data: [],
        connectionIds: new Set,
        callBack: function(e, t, i, n, a) {
            ConferenceLog.isStatsCanBePushed() && (ConferenceLog.networkStats.data.push(MediaUtil.WebRTCStats.getNetworkStatsPayload(i, n, a)), ConferenceLog.networkStats.connectionIds.delete(e), 0 === ConferenceLog.networkStats.connectionIds.size && (ConferenceAPI.pushConnectionNetworkDetails(a.conferenceId, ConferenceLog.networkStats.data), ConferenceLog.networkStats.data = [])), Conference.isPushStatsViaWebSocketEnabled() && MediaUtil.WebRTCStats.pushNetworkStatsViaWebSocket(i, a)
        }
    },
    connectionStats: {
        data: [],
        analyticsData: [],
        connectionIds: new Set,
        isEntryPresentInAnalyticsData: function(e, t) {
            for (let i of ConferenceLog.connectionStats.analyticsData)
                if (i.connection_type === e && i.is_upstream === t) return !0;
            return !1
        },
        getAnalyticsObject: function(e) {
            let t = {},
                i = 1;
            for (let n in e) {
                let a = e[n];
                t[n] = a, i += 1
            }
            return t
        },
        isAnalyticsObjectLimitReached: function() {
            for (let e of ConferenceLog.connectionStats.analyticsData)
                if (Object.keys(e.data).length >= ConferenceLog.statsObjectApiMaxSize) return !0;
            return !1
        },
        filterActiveVideoSSRCStats: function(e, t) {
            if (!t.isUpStream && "video" === t.connectionType) {
                let t = ZCSmartConferenceImpl.getCurrentActiveSession();
                if (void 0 !== t && t.isVideoConference()) {
                    let i = t.getActiveVideoSSRC();
                    for (let t in e) {
                        let n = e[t].ssrclist,
                            a = [];
                        for (let s of n) i.includes(s) ? a.push(s) : delete e[t][s];
                        e[t].ssrclist = a
                    }
                }
            }
        },
        callBack: function(e, t, i, n, a) {
            if (ConferenceLog.isStatsCanBePushed() && (ConferenceLog.connectionStats.filterActiveVideoSSRCStats(i, a), ConferenceLog.connectionStats.data.push(MediaUtil.WebRTCStats.getConnectionStatsPayload(i, a)), ConferenceLog.connectionStats.connectionIds.delete(e), 0 === ConferenceLog.connectionStats.connectionIds.size)) {
                let e = ConferenceLog.connectionStats.data;
                for (let t of e) {
                    let e = t.connection_type,
                        i = t.is_upstream,
                        n = ConferenceLog.connectionStats.getAnalyticsObject(t.data);
                    if (ConferenceLog.connectionStats.isEntryPresentInAnalyticsData(e, i))
                        for (let t of ConferenceLog.connectionStats.analyticsData) t.connection_type === e && t.is_upstream === i && Object.assign(t.data, n);
                    else {
                        let t = {
                            connection_type: e,
                            is_upstream: i,
                            stats_type: "connection",
                            data: n
                        };
                        ConferenceLog.connectionStats.analyticsData.push(t)
                    }
                }(a.lastChunk || ConferenceLog.connectionStats.isAnalyticsObjectLimitReached()) && (ConferenceAPI.pushConnectionStats(a.conferenceId, ConferenceLog.connectionStats.analyticsData), ConferenceLog.connectionStats.analyticsData = []), ConferenceLog.connectionStats.data = [], ConferenceLog.connectionStats.connectionIds = new Set(WebRTCPeerConnectionStats.getConnectionIds("conferences"))
            }
            Conference.isPushStatsViaWebSocketEnabled() && MediaUtil.WebRTCStats.pushConnectionStatsViaWebSocket(i, a)
        }
    },
    clearWebRTCStatsData: function() {
        this.networkStats.connectionIds.clear(), this.connectionStats.connectionIds.clear(), this.networkStats.data = [], this.connectionStats.data = [], this.connectionStats.analyticsData = []
    },
    updateWebRTCStatsConfiguration: function(e) {
        this.clearWebRTCStatsData(), $WC.Util.isEmpty(e.stats_can_be_pushed) || (ConferenceLog.statsCanBePushed = "true" == e.stats_can_be_pushed), $WC.Util.isEmpty(e.objects_to_push_via_websocket) || (ConferenceLog.statsObjectMaxSize = parseInt(e.objects_to_push_via_websocket)), $WC.Util.isEmpty(e.objects_to_push_via_api) || (ConferenceLog.statsObjectApiMaxSize = parseInt(e.objects_to_push_via_api))
    },
    wmsMsgTypes: {
        START: "start",
        DOWN_AUDIO_OFFER: "down_audio_offer",
        DOWN_VIDEO_OFFER: "down_video_offer",
        DOWN_SCREEN_OFFER: "down_screen_offer",
        UP_AUDIO_ANSWER: "up_audio_answer",
        UP_VIDEO_ANSWER: "up_video_answer",
        UP_SCREEN_ANSWER: "up_screen_answer",
        UP_DC_ANSWER: "up_dc_answer",
        DOWN_REMOTE_ICE: "down_remote_ice"
    },
    _totalWmsDiffEntries: 0,
    _wmsDiffs: {
        start: [],
        down_audio_offer: [],
        down_video_offer: [],
        down_screen_offer: [],
        up_audio_answer: [],
        up_video_answer: [],
        up_screen_answer: [],
        up_dc_answer: [],
        down_remote_ice: []
    },
    pushOfferWmsDiffBasedOnConn: function(e, t, i, n) {
        var a = this.wmsMsgTypes.DOWN_AUDIO_OFFER;
        if (WebRTCPeerConnectionConstants.isScreenConnection(t)) a = this.wmsMsgTypes.DOWN_SCREEN_OFFER;
        else {
            var s = ConferenceImpl.dataModeVsConnectionType[i];
            WebRTCPeerConnectionConstants.isVideoConnection(s) && (a = this.wmsMsgTypes.DOWN_VIDEO_OFFER)
        }
        this.pushWmsDiff(a, e, n)
    },
    pushAnswerWmsDiffBasedOnConn: function(e, t, i, n) {
        var a = this.wmsMsgTypes.UP_AUDIO_ANSWER;
        if (WebRTCPeerConnectionConstants.isScreenConnection(t)) a = this.wmsMsgTypes.UP_SCREEN_ANSWER;
        else if (WebRTCPeerConnectionConstants.isDataChannelConnection(t)) a = this.wmsMsgTypes.UP_DC_ANSWER;
        else {
            var s = ConferenceImpl.dataModeVsConnectionType[i];
            WebRTCPeerConnectionConstants.isVideoConnection(s) && (a = this.wmsMsgTypes.UP_VIDEO_ANSWER)
        }
        this.pushWmsDiff(a, e, n)
    },
    pushWmsDiff: function(e, t, i) {
        var n = $Util.getSyncedCurrentTime(),
            a = n - parseInt(i);
        if (!(a < 0)) {
            if (a > 500) {
                var s = function() {
                    var e = {
                        conferenceId: t,
                        debugInfo: WmsLite.getDebugInfo()
                    };
                    _printLogMsg(JSON.stringify(e), "groupcall"), ConferenceLog.lastWmsDebugInfoLoggedTime = n
                };
                ConferenceLog.lastWmsDebugInfoLoggedTime ? n - ConferenceLog.lastWmsDebugInfoLoggedTime > 1e3 && s() : s()
            }
            this._wmsDiffs[e].push(a), this._totalWmsDiffEntries++, this._totalWmsDiffEntries >= 30 && this.pushWmsDiffToServer(t)
        }
    },
    getAndFlushWmsDiff: function() {
        var e = void 0;
        return this._totalWmsDiffEntries > 0 && (e = {}, this._wmsDiffs.start.length && (e.start = this._wmsDiffs.start, this._wmsDiffs.start = []), this._wmsDiffs.down_audio_offer.length && (e.down_audio_offer = this._wmsDiffs.down_audio_offer, this._wmsDiffs.down_audio_offer = []), this._wmsDiffs.down_video_offer.length && (e.down_video_offer = this._wmsDiffs.down_video_offer, this._wmsDiffs.down_video_offer = []), this._wmsDiffs.down_screen_offer.length && (e.down_screen_offer = this._wmsDiffs.down_screen_offer, this._wmsDiffs.down_screen_offer = []), this._wmsDiffs.up_audio_answer.length && (e.up_audio_answer = this._wmsDiffs.up_audio_answer, this._wmsDiffs.up_audio_answer = []), this._wmsDiffs.up_video_answer.length && (e.up_video_answer = this._wmsDiffs.up_video_answer, this._wmsDiffs.up_video_answer = []), this._wmsDiffs.up_screen_answer.length && (e.up_screen_answer = this._wmsDiffs.up_screen_answer, this._wmsDiffs.up_screen_answer = []), this._wmsDiffs.up_dc_answer.length && (e.up_dc_answer = this._wmsDiffs.up_dc_answer, this._wmsDiffs.up_dc_answer = []), this._wmsDiffs.down_remote_ice.length && (e.down_remote_ice = this._wmsDiffs.down_remote_ice, this._wmsDiffs.down_remote_ice = []), this._totalWmsDiffEntries = 0), e
    },
    pushWmsDiffToServer: function(e) {
        if (this._totalWmsDiffEntries > 0) {
            var t = this.getAndFlushWmsDiff();
            ConferenceAPI.updateWmsLog(e, t)
        }
    },
    writeToTempEventsLog: function(e) {
        var t = (new Date).getTime();
        this._tempEventLogString = this._tempEventLogString + "[" + e + "]:[" + t + "]\n", this._tempEventLogObj[e] || (this._tempEventLogObj[e] = t)
    },
    setTempEventsLog: function(e, t) {
        this._tempEventLogString = e, this._tempEventLogObj = t
    },
    clearTempEventsLog: function() {
        this._tempEventLogString = "", this._tempEventLogObj = {}
    },
    getTempEventsLogString: function() {
        return this._tempEventLogString
    },
    getTempEventsLogObject: function() {
        return this._tempEventLogObj
    },
    getLogString: function() {
        return this._logString
    },
    setLogString: function(e) {
        this._logString = e
    },
    clearLogString: function() {
        this._logString = ""
    },
    writeToLog: function(e, t) {
        void 0 !== MediaUtil.BRIDGE && MediaUtil.writeToLog(this, e, t)
    },
    constants: {
        webRTCEvents: {
            sendOffer: "[WebRTC] Send Offer API triggered",
            sendAnswer: "[WebRTC] Send Answer API triggered",
            startSS: "[WebRTC] [Start SS API triggered]",
            updateIce: "[WebRTC] updateIceCandidates API triggered",
            connectionState: {
                failed: "[WebRTC] [Connection state] [failed]",
                connected: "[WebRTC] [Connection state] [connected]"
            },
            setBitRate: "[WebRTC] [Bit rate set]",
            trackReceived: "[WebRTC] [Track received]",
            dataReceived: "[WebRTC] [Data Received]"
        },
        invitation: {
            initiated: "[Initiate invitation API]",
            success: "[Invitation API successful]",
            failed: "[Invitation API failed]"
        },
        selectedMediaDevices: {
            MICROPHONE: "[Selected microphone device]",
            CAMERA: "[Selected camera device]"
        },
        eventsLog: {
            previewShown: "preview_shown",
            startMeetingFromPreview: "start_clicked_from_preview",
            startApiCalledForQuickMeeting: "start_api_called_quick_meeting",
            joinClickedFromPreview: "join_clicked_from_preview",
            joinClickedFromRecordingConsent: "join_clicked_from_recording_consent",
            joinClickedFromCustomPreview: "join_clicked_from_custom_preview",
            startAPICalledForCallConversion: "start_api_called_call_conversion",
            startAPICalledFromEventLandingPage: "start_api_called_event_landing_page",
            startAPICalledFromEventPreview: "start_api_called_from_event_preview",
            joinAPICalledForCallConversion: "join_api_called_call_conversion",
            receivedConferenceStart: "received_conference_start_callback",
            receivedAudioOffer: "received_audio_offer",
            receivedVideoOffer: "received_video_offer",
            receivedScreenOffer: "received_screen_offer",
            receivedDCAnswer: "received_dc_answer",
            receivedAudioAnswer: "received_audio_answer",
            receivedVideoAnswer: "received_video_answer",
            receivedAudioAnswerCallback: "received_audio_answer_callback",
            receivedVideoAnswerCallback: "received_video_answer_callback",
            receivedScreenAnswerCallback: "received_screen_answer_callback",
            sendDCOffer: "send_dc_offer",
            sendAudioOffer: "send_audio_offer",
            sendVideoOffer: "send_video_offer",
            sendAudioAnswer: "send_audio_answer",
            sendVideoAnswer: "send_video_answer",
            sendScreenAnswer: "send_screen_answer",
            sendDCIceCandidates: "send_dc_icecandidates",
            sendAudioUpStreamIceCandidates: "send_audio_upstream_icecandidates",
            sendAudioDownStreamIceCandidates: "send_audio_downstream_icecandidates",
            sendVideoUpStreamIceCandidates: "send_video_upstream_icecandidates",
            sendVideoDownStreamIceCandidates: "send_video_downstream_icecandidates",
            sendScreenUpStreamIceCandidates: "send_screen_upstream_icecandidates",
            sendScreenDownStreamIceCandidates: "send_screen_downstream_icecandidates",
            audioUpStreamConnected: "audio_upstream_connected",
            audioDownStreamConnected: "audio_downstream_connected",
            audioUpStreamFailed: "audio_upstream_failed",
            audioDownStreamFailed: "audio_downstream_failed",
            videoUpStreamConnected: "video_upstream_connected",
            videoDownStreamConnected: "video_downstream_connected",
            videoUpStreamFailed: "video_upstream_failed",
            videoDownStreamFailed: "video_downstream_failed",
            screenDownStreamConnected: "screen_downstream_connected",
            screenDownStreamFailed: "screen_downstream_failed",
            dcConnected: "dc_connected",
            dcFailed: "dc_failed"
        },
        wmsEvents: {
            conferenceStart: "[wms] Start callback received",
            conferenceEnd: "[wms] End callback received",
            SSEnd: "[wms] Screen share end callback received",
            answerSdpReceived: "[wms] Answer sdp received",
            offerSdpReceived: "[wms] Offer sdp received",
            setRemoteIceCandidatesReceived: "[wms] Remote ice candidates removed"
        },
        UIEvents: {
            startTriggered: "[UI][Code Flow] Start trigger method called",
            joinTriggered: "[UI][Code Flow] Join trigger method called",
            checkAndJoinCalled: "[UI][Code Flow] Check and join method called",
            showQuickStartUICalled: "[UI][Code Flow] Show Quick Start UI called",
            showStartUICalled: "[UI][Code Flow] Show Start UI called",
            startUIShowed: "[UI][Code Flow] Start UI showed",
            showStartPreviewButtonClicked: "[UI][User action] Show start preview button clicked",
            openStartPreviewCalledAfterStreamAccess: "[UI][Code Flow] Open start preview called after stream access",
            startPreviewPageShown: "[UI][Code Flow] Start preview page shown",
            startMeetingClicked: "[UI][User action] Start meeting button clicked",
            previewPageClose: "[UI][Code Flow] Preview page closed",
            openWaitingRoomCalled: "[UI][Code Flow] Open waiting room called",
            openTransferPanelCalled: "[UI][Code Flow] Open transfer panel called",
            openJoinSettingsCalled: "[UI][Code Flow] Open join page called",
            joinFromCustomPreviewCalled: "[UI][Code Flow] Open join from custom preview called",
            leave: "[UI] Leave button clicked"
        },
        aysncEvents: {
            existingSessionCheck: "[Async][Code Flow] Checking for existing media sessions",
            existingSessionCheckSuccess: "[Async][Code Flow] Existing sessions are cleared",
            syncPreferredDevices: "[Async][Code Flow] Sync preferred device method called",
            preferredDevicesSynced: "[Async][Code Flow] Preferred devices synced",
            updateDeviceListCalled: "[Async][Code Flow] Update device list called",
            deviceListUpdated: "[Async][Code Flow] Device list updated",
            audioStreamRequested: "[Async][Code Flow] Audio stream requested",
            audioStreamObtained: "[Async][Code Flow] Audio stream obtained",
            audioStreamError: "[Async][Code Flow] Audio stream error",
            videoStreamRequested: "[Async][Code Flow] Video stream requested",
            videoStreamObtained: "[Async][Code Flow] Video stream obtained",
            videoStreamError: "[Async][Code Flow] Video stream error"
        },
        apiEvents: {
            fetchUserConfigurations: "[API][Code Flow] Fetch user configurations api called",
            userConfigurationsFetched: "[API][Code Flow] User configurations fetched",
            startApiCalled: "[API][Code Flow] Start api called",
            startApiFailed: "[API][Code Flow] Start api failed",
            startApiSuccess: "[API][Code Flow] Start api success",
            getApiCalled: "[API][Code Flow] Get api called",
            getApiFailed: "[API][Code Flow] Get api failed",
            getApiSuccess: "[API][Code Flow] Get api success",
            joinApiCalled: "[API][Code Flow] Join api called",
            joinApiFailed: "[API][Code Flow] Join api failed",
            joinApiSucess: "[API][Code Flow] Join api success",
            sendInvitationCardApiCalled: "[API][Webrtc] Send invitation card api called",
            sendInvitationCardApiFailed: "[API][Webrtc] Send invitation card api failed",
            sendInvitationCardApiSuccess: "[API][Webrtc] Send invitation card api success"
        },
        infoEvents: {
            noAudio: "[Info][Code Flow] No audio stream at this point",
            videoDisabledInJoinForUser: "[Info][Code flow] User has disable video on join enabled"
        },
        errorEvents: {
            notInitialized: "[failure][Code Flow] Conference files not initialized",
            streamAlreadyRequested: "[failure][Code Flow] Another stream request already in progress",
            conferenceNotAllowed: "[failure][Code Flow] Conference not allowed",
            audioConferenceNotAllowed: "[failure][Code Flow] Audio conference not allowed",
            videoConferenceNotAllowed: "[failure][Code Flow] Video conference not allowed",
            invalidInputsForStartPreview: "[failure][Code Flow] Invalid start inputs given",
            joinFlowApiInProgress: "[failure][Code Flow] Join/Get api already in progress",
            alreadyEnded: "[failure][Code Flow] Meeting already ended",
            sameSessionRunningAlready: "[failure][Code Flow] User already in same session",
            sidMismatch: "[failure][Wms] Session id is different",
            anotherSessionLive: "[failure][Wms] Another session is active",
            sessionClosedBeforeStart: "[failure][Wms] session closed before start"
        }
    }
}, Conference = function() {
    var e, t = !1,
        i = !1,
        n = [],
        a = !1,
        s = !1;

    function o() {
        return void 0 !== WebRTCUserMedia && WebRTCUserMedia.isSupported() && !$Util.Browser.isEdge() && (!$Util.Browser.isSafari() || WebRTCUserMedia.isDisplayMediaSupported() || $Util.isSafari14orAbove())
    }

    function r() {
        return SecurityManager.hasPermission(Modules.GroupAudioCall)
    }

    function d() {
        return SecurityManager.hasPermission(Modules.GroupVideoCall)
    }
    return {
        MAX_PARTICIPANTS: "undefined" != typeof $zcg && $zcg._CONFERENCE_PARTICIPANT_LIMIT,
        MAX_PARTICIPANTS_AUDIO: "undefined" != typeof $zcg && 2 * $zcg._CONFERENCE_PARTICIPANT_LIMIT,
        MAX_UNIFIED_PARTICIPANTS_AUDIO: "undefined" != typeof $zcg && $zcg._UNIFIED_AUDIO_CONF_LIMIT,
        MAX_UNIFIED_PARTICIPANTS_VIDEO: "undefined" != typeof $zcg && $zcg._UNIFIED_VIDEO_CONF_LIMIT,
        MIXED_AUDIO_CONF_LIMIT: "undefined" != typeof $zcg && $zcg._MIXED_AUDIO_CONF_LIMIT,
        MIXED_VIDEO_CONF_LIMIT: "undefined" != typeof $zcg && $zcg._MIXED_VIDEO_CONF_LIMIT,
        MAX_KNOCKINGS_ALLOWED: "undefined" != typeof $zcg && $zcg._CONFERENCE_MAX_KNOCKINGS_ALLOWED,
        MAX_ACTIVE_SPEAKER: 7,
        MAIN_SPEAKER_COUNT: 1,
        SS_FRAMERATE: 15,
        SMARTMODE_MAX_PARTICIPANT_COUNT: 1e3,
        SMARTMODE_STREAMING_MAX_COUNT: 1e4,
        MAX_PANEL_MEMBERS: 100,
        MIN_RECORDING_LINK_PASSWORD_LENGTH: 6,
        MAX_MESSAGES_IN_CHAT_NOTIFICATION: 2,
        CHAT_NOTIFICATION_DISPLAY_TIMEOUT: 5e3,
        userDefaultConfiguration: void 0,
        encryptedMeetingId: void 0,
        domCache: {
            storage: {},
            get: function(e, t) {
                return (void 0 === this.storage[e] || t) && this.set(e), this.storage[e]
            },
            set: function(e) {
                this.storage[e] = $(e)
            },
            clear: function(e) {
                delete this.storage[e]
            },
            clearAll: function() {
                this.storage = {}
            }
        },
        configurations: {
            GUEST_VALIDATION: "guest_validation",
            KNOCK_PERMISSION: "knock_permission",
            PUBLIC_ACCESS: "public_access",
            PUBLIC_STREAMING: "public_streaming"
        },
        knockStates: {
            ACCEPTED: "accepted",
            PENDING: "pending",
            REJECTED: "rejected"
        },
        types: {
            AUDIO: "audio",
            VIDEO: "video"
        },
        modes: {
            SMART: "smart",
            NORMAL: "normal"
        },
        isSmartMode: function(e) {
            return e === this.modes.SMART
        },
        isInitialized: function() {
            return t
        },
        isCurrentUserGuest: function() {
            return $zcg._ISGUESTUSER || !1
        },
        isGuestUserId: function(e) {
            return e.startsWith("$")
        },
        isAudioConferenceEnabled: function() {
            return r()
        },
        isVideoConferenceEnabled: function() {
            return d()
        },
        isRecordingEnabled: function() {
            return SecurityManager.hasPermission(Modules.GroupCallRecording)
        },
        isRecordingAllowed: function() {
            return this.isRecordingEnabled() && "undefined" != typeof Plan && Plan.isCallRecordingAllowed()
        },
        isVideoConference: function(e) {
            return function(e) {
                return e === Conference.types.VIDEO
            }(e)
        },
        isAudioConference: function(e) {
            return function(e) {
                return e === Conference.types.AUDIO
            }(e)
        },
        isAudioConferenceAllowed: function() {
            return r() && o() && this.isInitialized()
        },
        isVideoConferenceAllowed: function() {
            return d() && o() && this.isInitialized()
        },
        isAssociatedResourcesEnabled: function() {
            return $zcg._IS_CONFERENCE_ASSOCIATED_RESOURCE_ENABLED
        },
        isStreamingEnabled: function() {
            return "undefined" != typeof Plan && Plan.isGroupCallStreamingAllowed()
        },
        isAutoStreamingEnabled: function() {
            return $zcg._IS_SMARTCONF_AUTO_STREAMING_ENABLED && "undefined" != typeof Plan && Plan.isGroupCallStreamingAllowed()
        },
        isNotebookIntegrationEnabled: function() {
            return $zcg._NOTEBOOK_ENABLED && this.isNotebookLHSEnabled()
        },
        isNotebookLHSEnabled: function() {
            return $zcg._NOTEBOOK_INTEGRATION_STATUS && OrgFeatures.isIntranetRequest()
        },
        isTrackCloseEnabled: function() {
            return !ZCMediaPreferences.isSpeechDetectionAllowedByUser()
        },
        isInstantConferenceAllowed: function() {
            return this.isAudioConferenceAllowed() || this.isVideoConferenceAllowed()
        },
        isScreenShareAllowed: function() {
            return (this.isAudioConferenceAllowed() || this.isVideoConferenceAllowed()) && o() && ($Util.Browser.isChrome() || $Util.Browser.isFirefox() || WebRTCUserMedia.isScreenShareSupportedInNative()) && SecurityManager.hasPermission(Modules.ScreenSharing)
        },
        isWhiteBoardAllowed: function() {
            return WhiteBoard.isEnabled()
        },
        isPresentationsAllowed: function() {
            return this.isPresentationEnabled() && !WmsImpl.isGuestConferenceUser()
        },
        isPresentationRequestsEnabled: function() {
            return !0
        },
        isStatsEnabled: function() {
            return $zcg._IS_CONFERENCE_STATS_ENABLED
        },
        isLazyLoadingEnabled: function() {
            return $zcg._IS_CONFERENCE_LAZY_LOADING_ENABLED
        },
        isAddDeviceEnabled: function() {
            return $zcg._IS_CONFERENCE_ADD_DEVICE_ENABLED
        },
        isPersonalConfigEnabled: function() {
            return !Conference.isCurrentUserGuest()
        },
        isKickoutEnabled: function() {
            return $zcg._IS_CONFERENCE_KICKOUT_ENABLED
        },
        isDefaultGridViewEnabled: function() {
            return $zcg._IS_CONFERENCE_DEFAULT_GRID_VIEW_ENABLED
        },
        isSpotLightEnabled: function() {
            return !0
        },
        isPresentationEnabled: function() {
            return $zcg._IS_CONFERENCE_PRESENTATION_ENABLED && SecurityManager.hasPermission(Modules.Presentation)
        },
        isPresentationStreamingEnabled: function() {
            return $zcg._IS_CONFERENCE_PRESENTATION_STREAMING_ENABLED
        },
        isLowerHandEnabled: function() {
            return $zcg._IS_CONFERENCE_LOWER_HAND_ENABLED
        },
        isLockEnabled: function() {
            return $zcg._IS_CONFERENCE_LOCK_ENABLED
        },
        isIcePrebindingEnabled: function() {
            return $zcg._IS_CONFERENCE_ICE_PREBINDING_ENABLED
        },
        isNetworkStrengthIndicationEnabled: function() {
            return $zcg._IS_CONFERENCE_NETWORK_STRENGTH_ENABLED
        },
        isInviteRevokeEnabled: function() {
            return $zcg._IS_CONFERENCE_INVITE_REVOKE_ENABLED
        },
        isMediaIPVersioningNotifyVersionEnabled: function() {
            return $zcg._IS_MEDIA_IPVERSIONING_NOTIFYVERSION_ENABLED
        },
        isMediaServersGeofencingEnabled: function() {
            return $zcg._IS_MEDIA_SERVERS_GEOFENCING_ENABLED
        },
        isThemesEnabled: function() {
            return $zcg._IS_CONFERENCE_THEMES_ENABLED
        },
        isHDVideoEnabled: function() {
            return $zcg._IS_AV_HD_VIDEO_ENABLED
        },
        isVideoEffectsSettingsEnabled: function() {
            return !Conference.isCurrentUserGuest()
        },
        isNomenclatureEnabled: function() {
            return !0
        },
        isPushStatsViaWebSocketEnabled: function() {
            return $zcg._PUSH_CONFERENCE_STATS_VIA_WEBSOCKET
        },
        isAVAIToolsEnabled: function() {
            return $zcg._IS_AV_AI_TOOLS_ENABLED
        },
        getPanelMembersLimit: function() {
            var e = this.MAX_PANEL_MEMBERS;
            if (Conference.isCurrentUserGuest() || $zcg.isGuestUser) return e;
            var t = Plan.getGroupCallLimit();
            return e > t && (e = t), e
        },
        isConnectionMonitorNeeded: function() {
            if ("undefined" != typeof ZCSmartConferenceImpl && ZCSmartConferenceImpl.hasCurrentActiveSession()) {
                let e = ZCSmartConferenceImpl.getCurrentActiveSession();
                return e.isCurrentUser(e.getCreatorId()) && e.isPersonalScope()
            }
            return !1
        },
        isChatNotificationEnabledByUser: function() {
            return void 0 === Settings.getFromObj("huddle_notify_msg") || 1 === Settings.getFromObj("huddle_notify_msg")
        },
        isVideoDisabledInJoinByUser: function() {
            return !!Conference.isPersonalConfigEnabled() && 1 === Settings.getFromObj("huddle_join_video_muted")
        },
        isStickyInfoAllowedByUser: function() {
            return void 0 !== Settings.getFromObj("huddle_sticky_info") && 1 === Settings.getFromObj("huddle_sticky_info")
        },
        getRecordingUserConfig: function() {
            return Settings.getFromObj("conference_recording", !0) || 0
        },
        setGuestChatRequested: function() {
            a = !0
        },
        isGuestChatRequested: function() {
            return a
        },
        initializeWithoutModuleCheck: function(e, t) {
            this._initialize(e, t, !0)
        },
        initialize: function(e, t) {
            this._initialize(e, t)
        },
        _initialize: function(e, a, s = !1) {
            this.isInitialized() ? "function" == typeof e && e() : s || r() || d() ? MediaManager.initialize((function() {
                if (o()) {
                    if (i) return void n.push(e);

                    function a() {
                        t = !0, i = !1, ConferenceImpl.init(), n.forEach((function(e) {
                            "function" == typeof e && e()
                        })), n = [], "undefined" != typeof RemoteWork && RemoteWork.isInRemoteWorkView() && Conference.updateOptionsInUI()
                    }
                    "undefined" == typeof ConferenceImpl ? (n.push(e), i = !0, $Util.loadMultipleFiles("link", $zcg._VIDEOCHATPROPS.CONFERENCE_CSS_LIST, (function() {
                        $Util.loadMultipleFiles("script", $zcg._VIDEOCHATPROPS.CONFERENCE_JS_LIST, a)
                    }))) : a()
                }
            })) : "function" == typeof a && a()
        },
        isGuestSession: function() {
            return WmsImpl.isGuestConferenceUser() && void 0 !== $zcg._HUDDLE_ID
        },
        handleGuestConnected: function() {
            if (void 0 !== MediaUtil && MediaUtil.isNewAVDomainRoutingEnabled() && $zcg._CONFERENCE_AV_DOMAIN_ROUTING && $ZCAjx.ajax({
                    url: "/v2/conferences/" + $zcg._HUDDLE_ID + "/authenticate"
                }), "undefined" != typeof ConferenceDetails && ConferenceDetails.waiting_room && "yet_to_request" === ConferenceDetails.waiting_room) {
                var e = function() {
                    ConferenceAPI.get(ConferenceDetails.conferenceId, e => {
                        if (e.is_active) {
                            let e = {},
                                t = $("form")[0];
                            e.name = void 0 !== t.name.value ? t.name.value : "", e.email = void 0 !== t.email.value ? t.email.value : "", e.bio = void 0 !== t.bio.value ? t.bio.value : "";
                            let i = $("#conference-btn");
                            i.addClass("media-requesting"), ConferenceAPI.raiseMediaSessionRequest(ConferenceDetails.conferenceId, ZCSmartConferenceConstants.KNOCK, () => {
                                i.removeClass("media-requesting"), i.addClass("disabled"), i.text(I18N("conference.waiting.button")), i.removeAttr("style");
                                var e = I18N("conference.banner.knock.pending");
                                $("#waiting-room-state").text(e), LandingPage.updateRoomTitle(e), UI.updateBannerV2({
                                    content: I18N("conference.join.request.success"),
                                    type: "success"
                                })
                            }, e, (function() {
                                i.removeClass("media-requesting")
                            }))
                        }
                    })
                };
                LandingPage.loadConferenceResources(e)
            } else {
                e = function() {
                    Conference.encryptedMeetingId = Conference.getEncryptedResourceId(), Conference.join($zcg._HUDDLE_ID, ZCMediaConstants.triggerSource.GUEST_CONNECTED, (function() {
                        "undefined" != typeof WaitingRoom && WaitingRoom.clearPreviewSession()
                    }), (function() {
                        var e = $("#huddle-landing-cnt");
                        e.length > 0 && (MediaUtil.removeVideoElemsStreamInContainer(e), e.remove(), "undefined" != typeof WaitingRoom && MediaUtil.clearAudioPreview(WaitingRoom))
                    }))
                };
                if ("undefined" != typeof LandingPage) LandingPage.loadConferenceResources(e);
                else {
                    var t = {};
                    t[ZCMediaConstants.mediaModules.CONFERENCE] = !0, MediaCallInterface.initialize({
                        modules: t,
                        config: {
                            mlLibrary: !0,
                            mediaFeedback: !0
                        }
                    }, e)
                }
            }
        },
        handleWmsMessage: function(e) {
            var t = this.isInitialized(),
                i = function() {
                    var t = e.opr;
                    "function" == typeof ConferenceHandler.wmsEvents[t] && ConferenceHandler.wmsEvents[t](e)
                };
            !t && e.adhocCallDetails ? Conference.initializeWithoutModuleCheck(() => i()) : t ? i() : "undefined" != typeof GuestStreaming && GuestStreaming.handleWmsMessage(e)
        },
        handleWmsConnectionStatus: function(t) {
            t && "function" == typeof e && (e(), e = void 0)
        },
        getSessionKeyFromMeetingItem: function(e) {
            return (e => e && e.split("_").length > 1)(e.session_id) ? e.session_key : e.session_id || e.session_key
        },
        handleDownloadRecording: function(e, t, i, n) {
            FileDownload.triggerDownload(this.getDownloadUrl("" + e, t, i, n))
        },
        getDownloadUrl: function(e, t, i, n) {
            var a;
            if (ChatUI.isUDSDownloadEnabled() && OrgFeatures.isIntranetRequest()) {
                var s = {
                    user_id: $zcg._ZUID,
                    ref_index: e
                };
                i && n ? (s.session_key = i, s.host_scope = n) : s.nrs_id = t, $WC.Util.isEmpty($zcg._APPACCOUNTID) && $zcg._APPACCOUNTID.match(/[0-9]+/) && (s.appaccount_id = $zcg._APPACCOUNTID), a = FileDownload.getResourceDownloadUdsUrl("media_recordings", "rec" + e, s)
            } else {
                let s = n ? "?type=download&host_scope=" + n : "?type=download",
                    o = i || t;
                a = $zcg._URLPREFIX + "/v2/mediasessions/" + o + "/recordings/" + e + s
            }
            return a
        },
        getRecordingLink: function(e) {
            return $zcg._SERVERURL + "/external/recordings/" + e
        },
        verifyRecordingLinkPassword(e) {
            var t = $("#recording-link-password-head"),
                i = t.attr("link_id"),
                n = CallsHistoryUI.getRecordingStorage[t.attr("uid")],
                a = $("#recording-link-password-text"),
                s = a.val();
            if (s.length < Conference.MIN_RECORDING_LINK_PASSWORD_LENGTH) UI.updateBanner(Resource.getRealValue("mr.permalink.password.limit", [Conference.MIN_RECORDING_LINK_PASSWORD_LENGTH]), 2e3, !0);
            else {
                ConferenceAPI.verifyRecordingLinkPassword(n.nrs_id, n.index, i, s, e, (function(e) {
                    $WC.$Win.destroy("recording_link_password_" + n.index), ConferenceImpl.playRecordingViaLink(n, i, !0, e)
                }), (function() {
                    $("#recording-link-password-invalid").removeClass("dN"), a.addClass("inpt-error")
                }))
            }
        },
        handleSharedRecordingLink: function(e, t) {
            let i = () => {
                    $("#loadingniceurl").remove(), $("body").removeClass("chnlpermalink")
                },
                n = () => {
                    ConferenceAPI.verifyRecordingLink(e, n => {
                        if (CallsHistoryUI.getRecordingStorage[n.id] = n, n.password) return i(), $WC.$Win.create({
                            id: "recording_link_password_" + n.index,
                            class: "modalwindow zcl-alert-dialog-2 zcalgncntr zcbg_mask zcmodal-w500",
                            header: ConferenceTemplates.getRecordingLinkPasswordHeader(n, e),
                            html: ConferenceTemplates.recordingLinkPasswordHtml
                        }), void $("#recording-link-password-text").focus();
                        ConferenceImpl.playRecordingViaLink(n, e, t)
                    }, e => {
                        $("#loadingniceurl").remove(), $("body").removeClass("chnlpermalink"), UI.updateBanner(e.message, 2e3, !0)
                    })
                };
            t || Conference.isInitialized() ? n() : this.initialize(n, () => {
                window.history.pushState({}, null, $Util.getUrlPrefix() + "/index.do"), i()
            })
        },
        handleRecordingPermalink: function(e, t, i) {
            let n = () => {
                    $("#loadingniceurl").remove(), $("body").removeClass("chnlpermalink")
                },
                a = () => {
                    n();
                    let a = {
                        hidedownloadicon: !0,
                        handle_videostate: !0,
                        is_from_sametab: i
                    };
                    MediaRecordingImpl.play(void 0, e, t, a)
                };
            i || Conference.isInitialized() ? a() : this.initialize(a, () => {
                window.history.pushState({}, null, $Util.getUrlPrefix() + "/index.do"), n()
            })
        },
        handlePermaLink: function(t, i, n) {
            function a() {
                $("#loadingniceurl").remove(), $("body").removeClass("chnlpermalink")
            }
            var s = function() {
                Conference.join(t, ZCMediaConstants.triggerSource.PERMALINK, a, n)
            };
            if (i) Conference.join(t, ZCMediaConstants.triggerSource.PERMALINK, void 0, n);
            else if (Conference.isInitialized()) void 0 !== WmsImpl.getSid() ? s() : e = s;
            else {
                this.initialize((function() {
                    void 0 !== WmsImpl.getSid() ? s() : e = s
                }), (function() {
                    window.history.pushState({}, null, $Util.getUrlPrefix() + "/index.do"), a()
                }))
            }
        },
        handleStreamingPermalink: function(t, i) {
            if (i) Conference.joinStreaming(t);
            else {
                function n() {
                    $("#loadingniceurl").remove(), $("body").removeClass("chnlpermalink")
                }
                this.initialize((function() {
                    var i = function() {
                        Conference.joinStreaming(t, n)
                    };
                    $zcg._CONNECTED ? i() : e = i
                }), (function() {
                    window.history.pushState({}, null, $Util.getUrlPrefix() + "/index.do"), n()
                }))
            }
        },
        handleAdhocCallAddUserPermalink: function(t, i) {
            var n = t ? i.search : window.location.search,
                a = MediaUtil.getSearchParamsFromUrl(n),
                s = a.type === Conference.types.VIDEO ? Conference.types.VIDEO : Conference.types.AUDIO,
                o = a.title ? a.title : Conference.getAdhocDefaultTitle(),
                r = JSON.parse(a.user_ids),
                d = JSON.parse(a.adhoc_call_details);
            let c = () => {
                $("#loadingniceurl").remove(), $("body").removeClass("chnlpermalink")
            };
            Conference.initialize((function() {
                var t = function() {
                    r.length > 0 && MediaUtil.createConfirmDialog({
                        id: "startgroupcallconsent",
                        version: 2,
                        class: "zcdalogbx zcbg_mask alert_dialog",
                        headerhtml: $WC.$Dlg.frameHeaderHTML({
                            imagehtml: '<div class="mheader_icn msi-alrt clr-green"></div>'
                        }),
                        bodyhtml: $WC.$Dlg.frameBodyInfoHTML({
                            info: [MediaUtil.getResource("avcliq.groupcall.autostart.consent", [r.length])]
                        }),
                        buttons: [{
                            text: MediaUtil.getResource("videobroadcast.dlg.proceed"),
                            colour: $WC.$Dlg.GREEN_BUTTON,
                            action: function() {
                                Conference.convertOneToOneCallToConference(o, s, r, void 0, void 0, d, void 0)
                            }
                        }]
                    }, !0), c()
                };
                $zcg._CONNECTED ? t() : e = t
            }), (function() {
                c(), window.history.pushState({}, null, $Util.getUrlPrefix() + "/index.do")
            }))
        },
        handleStartPermalink: function(t, i) {
            var n = t ? i.search : window.location.search,
                a = MediaUtil.getSearchParamsFromUrl(n);
            if (a.adhoc_call_details) this.handleAdhocCallAddUserPermalink(t, i);
            else {
                var s = a.type === Conference.types.VIDEO ? Conference.types.VIDEO : Conference.types.AUDIO,
                    o = a.chat_id,
                    r = a.quick_start || !1,
                    d = o ? ZCMediaConstants.scopeTypes.CHAT : ZCMediaConstants.scopeTypes.PERSONAL,
                    c = o && !r ? void 0 : {
                        isQuickStart: !0
                    },
                    l = function() {
                        var i = o ? Conference.getDefaultTitle(o) : Conference.getAdhocDefaultTitle();
                        let n = () => {
                            $("#loadingniceurl").remove(), $("body").removeClass("chnlpermalink")
                        };
                        if (t) Conference.trigger(s, d, void 0 !== o ? [o] : [], i, ZCMediaConstants.triggerSource.PERMALINK, c), n();
                        else {
                            Conference.initialize((function() {
                                var t = function() {
                                    Conference.trigger(s, d, void 0 !== o ? [o] : [], i, ZCMediaConstants.triggerSource.PERMALINK, c), n()
                                };
                                $zcg._CONNECTED ? t() : e = t
                            }), (function() {
                                n(), window.history.pushState({}, null, $Util.getUrlPrefix() + "/index.do")
                            }))
                        }
                    };
                o && "" === ConversationsList.getTitle(o) ? Chat.getChatsFromServerByChatIds(o).then(() => {
                    l()
                }) : l()
            }
        },
        handleConferenceInit: function(t, i) {
            Conference.initialize(() => {
                $zcg._WMS_SERVER_UP ? t() : e = t
            }, i)
        },
        trigger: function(e, t, i, n, a, s) {
            var o = {
                conferenceType: e,
                scopeType: t,
                scopeIds: i,
                title: n,
                triggerSource: a,
                additionalData: s
            };
            if (ConferenceLog.writeToLog(ConferenceLog.constants.UIEvents.startTriggered, o), this.isInitialized())
                if (MediaManager.isStreamRequested()) ConferenceLog.writeToLog(ConferenceLog.constants.errorEvents.streamAlreadyRequested);
                else if (Conference.isVideoConferenceAllowed() || Conference.isAudioConferenceAllowed()) {
                var r = {
                    source: a
                };
                if (MediaManager.isChatScope(t)) {
                    var d = new $CliqChatId(i[0]);
                    r.chatType = d.isChannel() ? "channel" : "chat"
                }
                Conference.isVideoConference(e) ? Conference.isVideoConferenceAllowed() || (e = Conference.types.AUDIO, ConferenceLog.writeToLog(ConferenceLog.constants.errorEvents.videoConferenceNotAllowed)) : Conference.isAudioConferenceAllowed() || (e = Conference.types.VIDEO, ConferenceLog.writeToLog(ConferenceLog.constants.errorEvents.audioConferenceNotAllowed)), ConferenceLog.writeToLog(ConferenceLog.constants.aysncEvents.existingSessionCheck), MediaManager.handleExistingSessions((function() {
                    if (ConferenceLog.writeToLog(ConferenceLog.constants.aysncEvents.existingSessionCheckSuccess), !MediaManager.isCustomRequestPending(ZCMediaConstants.requests.startTrigger)) {
                        ConferenceLog.writeToLog(ConferenceLog.constants.aysncEvents.syncPreferredDevices), MediaManager.setCustomRequestAsPending(ZCMediaConstants.requests.startTrigger), ZCSmartConferenceImpl.prefetchMetaDetails((function() {
                            ConferenceLog.writeToLog(ConferenceLog.constants.aysncEvents.preferredDevicesSynced), ConferenceLog.writeToLog(ConferenceLog.constants.apiEvents.fetchUserConfigurations), ConferenceAPI.getUserConfigurations((function() {
                                if (ConferenceLog.writeToLog(ConferenceLog.constants.apiEvents.userConfigurationsFetched), MediaManager.setCustomRequestAsCompleted(ZCMediaConstants.requests.startTrigger), s && s.isQuickStart) ConferenceLog.writeToLog(ConferenceLog.constants.UIEvents.showQuickStartUICalled), ConferenceUI.startQuickConference(e, t, i, n, s);
                                else {
                                    if ($WC.$Win.isExist("start_conference_win")) return;
                                    ConferenceLog.writeToLog(ConferenceLog.constants.UIEvents.showStartUICalled), ConferenceUI.showStartWin(e, t, i, n, s)
                                }
                            }))
                        }))
                    }
                }))
            } else ConferenceLog.writeToLog(ConferenceLog.constants.errorEvents.conferenceNotAllowed);
            else ConferenceLog.writeToLog(ConferenceLog.constants.errorEvents.notInitialized)
        },
        join: function(e, t, i, n, a) {
            var s = {
                conferenceId: e,
                triggerSource: t
            };
            ConferenceLog.writeToLog(ConferenceLog.constants.UIEvents.joinTriggered, s), this.isInitialized() ? (ConferenceImpl.checkAndJoin(e, i, !0, void 0, n, a), "undefined" != typeof CallHistoryData && CallHistoryData.markOngoingCallAsViewed(e)) : ConferenceLog.writeToLog(ConferenceLog.constants.errorEvents.notInitialized)
        },
        joinStreaming: function(e, t) {
            this.isInitialized() && ConferenceImpl.checkAndJoinStreaming(e, t)
        },
        isCurrentChat: function(e) {
            return !!this.isInitialized() && (ConferenceUI.isCurrentChat(e) || ZCSmartConferenceUI.isCurrentChat(e))
        },
        setUnreadMessageCount: function(e, t) {
            this.isInitialized() && (ConferenceUI.setUnreadMessageCount(e, t), ZCSmartConferenceUI.setUnreadMessageCount(e, t))
        },
        hasThreadChatIdAndSwitchedChatId: function(e) {
            return e && e.isThreadChatAllowed() && e.getThreadChatId() && e.getSwitchedChatId()
        },
        isThreadOrSwitchChatId: function(e, t) {
            return e && (t == e.getThreadChatId() || t == e.getSwitchedChatId())
        },
        getTotalUnreadMessageCount: function(e, t, i) {
            if (t == i.getThreadChatId() && t == i.getSwitchedChatId()) return e;
            if (t == i.getThreadChatId()) {
                var n = this.hasThreadChatIdAndSwitchedChatId(i) ? i.getSwitchedChatId() : ConversationsList.getParentChatId(t);
                e += ConversationsList.getUnreadCount(n)
            } else e += ConversationsList.getUnreadCount(i.getThreadChatId());
            return e
        },
        setUnreadMsgCountInChatSwitcher: function(e, t, i) {
            var n = t || 0,
                a = $("[conferenceunreadmsgcount]");
            if (!$zcg.isGuestUser && i.isThreadChatAllowed()) {
                n = this.getTotalUnreadMessageCount(n, e, i);
                var s = e == i.getThreadChatId(),
                    o = a.filter(s ? "#conferencethreadchatunreadcount" : "#conferenceparentchatunreadcount");
                t ? o.text(t).show() : o.hide().empty(), a = a.not("#conferencethreadchatunreadcount,#conferenceparentchatunreadcount")
            }
            this.setUnreadMsgCountInChatHeader(n, a)
        },
        setUnreadMsgCountInChatHeader: function(e, t) {
            e ? t.text(e).show() : t.hide().empty()
        },
        setUnreadOnHeaderUpdate: function(e) {
            if (!e.isThreadChatAllowed() && e.getActiveChatId()) {
                var t = e.getActiveChatId(),
                    i = ConversationsList.getUnreadCount(t);
                Conference.setUnreadMessageCount(t, i)
            }
            if (e.isThreadChatAllowed() && e.getThreadChatId()) {
                var n = e.getThreadChatId(),
                    a = ConversationsList.getUnreadCount(n),
                    s = e.getSwitchedChatId() || Chat.getParentChatIdFromThreadChatId(n);
                if (s) {
                    var o = ConversationsList.getUnreadCount(s);
                    Conference.setUnreadMessageCount(s, o)
                }
                Conference.setUnreadMessageCount(n, a)
            }
        },
        getAudioOrVideoStreams: function(e, t, i) {
            var n = function(e) {
                    if (MediaManager.resetStreamRequested(), t) {
                        var n = function(t) {
                            MediaManager.resetStreamRequested();
                            var n = function() {
                                i(e, t)
                            };
                            WebRTCUserMedia.getMediaDevices(n, n)
                        };
                        MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.VIDEO_ONLY, ZCMediaConstants.mediaModules.CONFERENCE), WebRTCUserMedia.requestVideoStream(n, n, void 0, MediaUtil.getVideoProcessingOptions())
                    } else {
                        var a = function() {
                            i(e)
                        };
                        WebRTCUserMedia.getMediaDevices(a, a)
                    }
                },
                a = function() {
                    e ? (MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_ONLY, ZCMediaConstants.mediaModules.CONFERENCE), WebRTCUserMedia.requestAudioStream(n, n, void 0, MediaUtil.getAudioProcessingOptions())) : n()
                };
            WebRTCUserMedia.getMediaDevices(a, a)
        },
        handleChatWindowCreated: function(e) {
            this.isInitialized() && (ConferenceUI.handleChatWindowCreated(e), ZCSmartConferenceUI.handleChatWindowCreated(e))
        },
        handleChatWindowClosed: function(e) {
            this.isInitialized() && (ConferenceUI.handleChatWindowClosed(e), ZCSmartConferenceUI.handleChatWindowClosed(e))
        },
        handleChatRemoved: function(e) {
            this.isInitialized() && (ConferenceImpl.handleChatRemoved(e), ZCSmartConferenceImpl.handleChatRemoved(e))
        },
        handleGetMeFront: function(e) {
            this.isInitialized() && (ConferenceUI.handleGetMeFront(e), ZCSmartConferenceUI.handleGetMeFront(e))
        },
        handleChatWindowBeforeClose: function(e) {
            this.isInitialized() && (ConferenceUI.handleChatWindowBeforeClose(e), ZCSmartConferenceUI.handleChatWindowBeforeClose(e))
        },
        showGuestChat: function() {
            var e;
            (e = ZCSmartConferenceImpl.getCurrentSession() ? ZCSmartConferenceUI.getConferenceWindow() : ConferenceUI.getConferenceWindow()).find('[purpose="chatview"]').show(), e.addClass("show-aside")
        },
        setGuestChat: function(e) {
            if (GuestChatUtils.proxyObjects(), void 0 !== e.chatDetails) e.chat_details = e.chatDetails.chat_details || e.chatDetails, delete e.chatDetails, e.title = e.chat_details.title, e.chid = e.chat_details.chid, e.users = [{
                anonid: $zcg._ANONID,
                name: $zcg._GUEST_NAME
            }];
            else if (void 0 === e.chat_details) {
                var t = (e = {
                    chat_details: e
                }).chat_details;
                e.title = t.title, e.chid = t.chid, e.users = [{
                    anonid: $zcg._ANONID,
                    name: $zcg._GUEST_NAME
                }]
            }
            GuestChatUtils.setChatDetails(e)
        },
        getChatViewPort: function() {
            var e = !1;
            return "undefined" != typeof ZCSmartConferenceImpl && (e = ZCSmartConferenceImpl.hasCurrentSession()), e ? $("#smartconferencechatsection") : $("#conferencechatsection")
        },
        getChatHidePort: function() {
            var e = !1;
            return "undefined" != typeof ZCSmartConferenceImpl && (e = ZCSmartConferenceImpl.hasCurrentSession()), e ? $("#smartconferencechatsectionhideport") : $("#conferencechatsectionhideport")
        },
        hideAssociatedResourceIFrame: function(e) {
            var t = $("#conference-associatedresource-iframe");
            t.attr("conference-id") === e && t.hide(), $("#associatedResourceTabOptions").hide()
        },
        removeAssociatedResourceIFrame: function() {
            $("#conference-associatedresource-iframe").remove(), $("#associatedResourceTabOptions").remove()
        },
        hideRhsNotesIFrame: function(e, t) {
            var i = $("#conference-notes-iframe");
            (i.attr("conference-id") === e && i.find('[purpose="stickRhsNotes"]').length < 1 || t) && i.hide()
        },
        setGuestChatAsLoaded: function() {
            s = !0
        },
        isGuestChatLoaded: function() {
            return s
        },
        getEncryptedResourceId: function() {
            let e = ZCPermalink.getSplittedPathName(),
                t = e[1],
                i = e[2];
            return "meetings" === t || "huddle" === t || "huddlestream" === t ? i : "guest" === t && "huddle" === i ? e[3] : $("#huddle-landing-cnt").length > 0 && void 0 !== Conference.encryptedMeetingId ? Conference.encryptedMeetingId : void 0
        },
        getMeetingLinkId: function() {
            let e = ZCPermalink.getSplittedPathName(),
                t = e[1],
                i = e[2];
            if ("meeting" === t) return i
        },
        handleResize: function() {
            this.isInitialized() && (ConferenceUI.handleResize(), "undefined" != typeof ZCSmartConferenceUI && ZCSmartConferenceUI.handleResize())
        },
        handleEscape: function() {
            var e = !1;
            return this.isInitialized() && ((e = ConferenceUI.handleEscape()) || "undefined" == typeof ZCSmartConferenceUI || (e = ZCSmartConferenceUI.handleEscape())), e
        },
        handleConferenceRename: function(e, t) {
            if (this.isInitialized()) {
                var i = ZCSmartConferenceImpl.getCurrentActiveSession();
                i && i.getId() === e && (i.setTitle(t), ZCSmartConferenceUI.updateConferenceTitle(i))
            }
        },
        getLiveEventDefaultTitle: function(e, t) {
            return this.getDefaultTitle(e, t, !0)
        },
        getDefaultTitle: function(e, t, i) {
            var n = $WC.Util.decodeHTMLEntities(ConversationsList.getTitle(e));
            t && $WC.Util.isEmpty(n) && (n = t);
            var a = $Date.getDateString() + " " + $Date.getMonthString(),
                s = a.length,
                o = n + "-" + a;
            if (o.length > ZCMediaConstants.MAX_TITLE_LENGTH) {
                var r = ZCMediaConstants.MAX_TITLE_LENGTH - s - 4;
                o = n.substring(0, r) + "...-" + a
            }
            if (!MediaUtil.isValidTitle(o)) {
                var d = i ? "module.liveevent" : "common.meeting";
                o = Resource.getRealValue(d)
            }
            return o
        },
        getAdhocDefaultTitle: function() {
            var e = "",
                t = Users.getName($zcg._ZUID, void 0, -1);
            return t && (e = Resource.getRealValue("media.user.meeting", $WC.Util.decodeHTMLEntities(t))), MediaUtil.isValidTitle(e) || (e = Resource.getRealValue("common.meeting")), e
        },
        startPushToTalk: function() {
            if (this.isInitialized()) {
                if (ConferenceImpl.hasCurrentSession()) return ConferenceImpl.startPushToTalk();
                if (ZCSmartConferenceImpl.hasCurrentSession()) return ZCSmartConferenceImpl.startPushToTalk()
            }
            return !1
        },
        stopPushToTalk: function() {
            if (this.isInitialized()) {
                if (ConferenceImpl.hasCurrentSession()) return ConferenceImpl.stopPushToTalk();
                if (ZCSmartConferenceImpl.hasCurrentSession()) return ZCSmartConferenceImpl.stopPushToTalk()
            }
            return !1
        },
        applyVideoConstraints: function(e, t) {
            var i = 640,
                n = 480,
                a = void 0;
            t && "function" == typeof t.isHDVideoNeeded && t.isHDVideoNeeded() && void 0 !== ZCMediaPreferences && ZCMediaPreferences.isHDVideoAllowedByUser() && (i = 1280, n = 720, a = function() {
                e._getPrimaryVideoTrack().applyConstraints({
                    width: {
                        min: 640,
                        max: 640
                    },
                    height: {
                        min: 480,
                        max: 480
                    }
                }).catch()
            }), e._getPrimaryVideoTrack().applyConstraints({
                width: {
                    min: i,
                    max: i
                },
                height: {
                    min: n,
                    max: n
                }
            }).catch(a), e._getPrimaryVideoTrack().applyConstraints({
                frameRate: {
                    min: 15,
                    max: 15
                }
            }).catch()
        },
        convertOneToOneCallToConference: function(e, t, i, n, a, s, o, r, d) {
            Conference.initializeWithoutModuleCheck(() => {
                var c = Conference.isVideoConference(t),
                    l = ZCMediaConstants.scopeTypes.PERSONAL,
                    u = a ? a._getType() : void 0,
                    p = WebRTCUserMedia.getStreamTypeInString(c ? WebRTCUserMedia.streamTypes.AUDIO_VIDEO : WebRTCUserMedia.streamTypes.AUDIO_ONLY);
                if (c) {
                    var f = WebRTCUserMedia.isAudioStreamType(u) ? a : void 0,
                        m = WebRTCUserMedia.isVideoStreamType(u) ? a : void 0;
                    if (WebRTCUserMedia.isAudioVideoStreamType(u)) {
                        var v = WebRTCUserMedia.splitTracksInStream(a);
                        f = v.audioStream, m = v.videoStream
                    }
                    ZCSmartConferenceImpl.handleNewSessionStart(e, t, l, i, f, m, s), ZCSmartConferenceImpl.getOutgoingSession().writeToEventsLog(ConferenceLog.constants.eventsLog.startAPICalledForCallConversion), m && m._isVideoTrackEnabled() || (p = WebRTCUserMedia.getStreamTypeInString(WebRTCUserMedia.streamTypes.AUDIO_ONLY))
                } else {
                    var C = {
                        type: l,
                        ids: i
                    };
                    ConferenceUI.openRoom(e, ConferenceImpl.getCurrentUserId(), Users.getName(ConferenceImpl.getCurrentUserId()), t, C, o, s), ConferenceLog.writeToTempEventsLog(ConferenceLog.constants.eventsLog.startAPICalledForCallConversion)
                }
                var _ = {
                    title: e,
                    conferenceType: t,
                    scopeType: l,
                    scopeIds: i,
                    cohostIds: n,
                    panelListIds: void 0,
                    allowMembersInPanelList: !1,
                    audio: {
                        muted: !(a && a._isAudioTrackEnabled() && !a._isAudioRestrictedForConnection())
                    },
                    dataMode: p
                };
                c && (_.video = {
                    muted: !(a && a._isVideoTrackEnabled())
                }), ConferenceImpl.start(_, r, (function() {
                    c ? ZCSmartConferenceImpl.hasOutgoingSession() && ZCSmartConferenceImpl.endConference(ZCSmartConferenceImpl.getOutgoingSession().getId(), !1) : ConferenceImpl.handleEnd(!1), void 0 !== d && d()
                }), void 0, o, s.call_id)
            })
        },
        notifyDownStreamConnectedForAdhocCall: function(e) {
            if (e.isSilentConference() && "undefined" != typeof MediaCallImpl && MediaCallImpl.hasCurrentSession()) {
                var t = MediaCallImpl.getCurrentSession(),
                    i = t.getId() === e.getAdhocCallId() ? t : void 0;
                if (i) {
                    var n = i.getCurrentMember();
                    if (n.setAsDownStreamConnectedForConvertedCall(), !n.isConnectionStateClosed()) {
                        var a = n.getAVDownStream();
                        a && a._disableAudioTrack(), ConferenceAPI.updateConnectionStatus(e.getId(), {
                            time: $Util.getSyncedCurrentTime(),
                            connection_state: "connected",
                            is_upstream: !1
                        })
                    }
                    var s = i.getOtherMember();
                    s && s.isDownStreamConnectedForConvertedCall() && this.closeAssociatedCallConnection(t)
                }
            }
        },
        closeAssociatedCallConnection: function(e) {
            if (e) {
                var t = e.getCurrentMember();
                t.isConnectionStateClosed() || (t.closeConnection(!1), t.removeStreamInstances())
            }
        },
        updateOptionsInUI: function() {
            "undefined" != typeof RemoteWork && RemoteWork.updateMeetingOptions()
        },
        handleFocusAfterEscape: function() {
            var e = !1;
            if (this.isInitialized()) {
                let t = ZCSmartConferenceImpl.getCurrentActiveSession();
                void 0 === t || t.isInMinimizedView() || (e = !0)
            }
            return e
        },
        handleChatNotification: function(e) {
            if (!Conference.isChatNotificationEnabledByUser() || !ZCAVCP.isEnabledForMeeting(ZCAVCP.properties.meeting.CHAT_MESSAGE_NOTIFICATION)) return;
            let t = "undefined" != typeof ZCSmartConferenceImpl ? ZCSmartConferenceImpl.getCurrentActiveSession() : void 0;
            if (void 0 !== t && (t instanceof ConferenceSession ? ConferenceImpl.isValidChatForCurrentSession(e.chid) : ZCSmartConferenceImpl.isValidChatForCurrentSession(e.chid)) && !t.isInMinimizedView() && e.sender != ConferenceImpl.getCurrentUserId()) {
                let i = t instanceof ConferenceSession ? this.domCache.get("#conferencerhscnt") : this.domCache.get("#smartconferencechattab");
                if ((i.hasClass("active") || i.hasClass("huddl-chat-view")) && "visible" === i.css("visibility")) return;
                let n = () => {
                    void 0 !== this.chatNotificationDisplayTimeout && clearTimeout(this.chatNotificationDisplayTimeout), this.domCache.get("#conference-chat-notification").show(), this.chatNotificationDisplayTimeout = setTimeout(() => {
                        ZCSmartConferenceUI.closeChatNotification()
                    }, this.CHAT_NOTIFICATION_DISPLAY_TIMEOUT)
                };
                if (0 === this.domCache.get("#conference-chat-notification").length) this.domCache.get("#conferencemainsection").prepend(ConferenceTemplates.getChatNotificationLayoutHtml(e, t)), this.domCache.set("#conference-chat-notification"), n();
                else {
                    let t = this.domCache.get("#chat-notification-message-list"),
                        i = ConferenceTemplates.getChatNotificationMessageHtml(e);
                    t.children().length >= this.MAX_MESSAGES_IN_CHAT_NOTIFICATION && t.children()[0].remove(), this.domCache.get("#conference-chat-notification").is(":visible") ? t.append(i) : t.html(i), n()
                }
            }
        },
        isMeetingLink: function() {
            return "meetings" === ZCPermalink.getSplittedPathName()[1] || void 0 !== Conference.encryptedMeetingId
        },
        isStreamingLink: function(e) {
            return "huddlestream" === ZCPermalink.getSplittedPathName()[1] || e.startsWith("stream-")
        }
    }
}(), ConferenceConfiguration = class e {
    constructor(t, i) {
        this.hostScopeId = t, this.configurations = i || e.getDefaultConfigurations()
    }
    static getUserTypes() {
        return ["cohost", "same_org", "external_user"]
    }
    static getRoleBasedConfigs() {
        return ["screen_share", "grid_view", "presentation"]
    }
    static getStateBasedConfigs() {
        return ["cohost_lock_meeting", "waiting_room", "chat_access", "edit_whiteboard", "special_reactions", "transcript_summary_action_items"]
    }
    static getTypeBasedConfigs() {
        return ["reaction_view"]
    }
    static getDefaultConfigurations() {
        let t = e.getUserTypes();
        var i = {
            screen_share: t,
            grid_view: t,
            recording_access: "invitees",
            waiting_room: "disabled",
            chat_access: "enabled",
            chat_type: "thread",
            edit_whiteboard: "disabled",
            special_reactions: "disabled",
            reaction_view: "all"
        };
        if (Conference.isLockEnabled() && (i.cohost_lock_meeting = "enabled"), Conference.isPresentationsAllowed() && (i.presentation = t), Conference.isAVAIToolsEnabled() ? i.transcript_summary_action_items = "enabled" : i.transcript_summary_action_items = "disabled", Conference.userDefaultConfiguration)
            for (var n in Conference.userDefaultConfiguration) i[n] = Conference.userDefaultConfiguration[n];
        return i
    }
    isCurrentUserAllowed(e, t) {
        let i = ConferenceImpl.getCurrentUserId();
        if (t.isHost(i)) return !0;
        if (0 === e.length) return !1; {
            let n = t.getMember(i),
                a = n && n.isCohost() && e.includes("cohost");
            if (!a) {
                let t = _getAppAccountId() == this.hostScopeId;
                (a = t && e.includes("same_org")) || t || (a = e.includes("external_user"))
            }
            return a
        }
    }
    updateConfigurations(e) {
        for (let t in e) this.configurations[t] = e[t]
    }
    isScreenShareAllowed(t) {
        let i = this.configurations.screen_share || e.getDefaultConfigurations().screen_share;
        return this.isCurrentUserAllowed(i, t || ZCSmartConferenceImpl.getCurrentActiveSession())
    }
    isPresentationAllowed(t) {
        let i = this.configurations.presentation || e.getDefaultConfigurations().presentation;
        return this.isCurrentUserAllowed(i, t || ZCSmartConferenceImpl.getCurrentActiveSession())
    }
    isGridViewAccessible(t) {
        let i = this.configurations.grid_view || e.getDefaultConfigurations().grid_view;
        return this.isCurrentUserAllowed(i, t)
    }
    isChatAccessibleToExternalUser() {
        return "disabled" !== this.configurations.chat_access && "channel" !== this.configurations.chat_type
    }
    isAllowedToEditWhiteboard() {
        let e = ConferenceImpl.getCurrentUserId(),
            t = ZCSmartConferenceImpl.getCurrentActiveSession();
        return !(!t.isHost(e) && !t.getMember(e).isCohost()) || "enabled" === this.configurations.edit_whiteboard
    }
    isCohostLockMeetingAllowed() {
        return "enabled" === this.configurations.cohost_lock_meeting
    }
    isSpecialReactionsAllowed() {
        return "enabled" === this.configurations.special_reactions
    }
    isAllReactionsAllowed() {
        return "basic" !== this.configurations.reaction_view
    }
    isSummaryActionItemsAllowed() {
        return "enabled" === this.configurations.transcript_summary_action_items
    }
}, "undefined" != typeof SecurityManager && (SecurityManager.register(Modules.GroupAudioCall, (function() {
    var e = function() {
        Conference.updateOptionsInUI()
    };
    Conference.initialize(e, e)
})), SecurityManager.register(Modules.GroupVideoCall, (function() {
    var e = function() {
        Conference.updateOptionsInUI()
    };
    Conference.initialize(e, e)
})));
var ZCLiveEvents = {},
    ZCLiveEventsMsgCardHandler = {};
ZCLiveEvents = function() {
    var e = !1,
        t = !1,
        i = [],
        n = {},
        a = {},
        s = {
            default: {
                src: "default.png"
            },
            "default-mini": {
                src: "default-mini.png"
            }
        },
        o = () => $zcg._IS_RTCP_LIVE_EVENTS_ENABLED,
        r = () => e,
        d = (n, a) => {
            e ? "function" == typeof n && n() : o() ? MediaManager.initialize(() => {
                function a() {
                    e = !0, t = !1, ZCLiveEventsImpl.init(), i.forEach((function(e) {
                        "function" == typeof e && e()
                    })), i = []
                }
                t ? i.push(n) : "undefined" == typeof ZCLiveEventsImpl ? (i.push(n), t = !0, $Util.loadMultipleFiles("link", $zcg._VIDEOCHATPROPS.LIVE_EVENTS_CSS_LIST, (function() {
                    $Util.loadMultipleFiles("script", $zcg._VIDEOCHATPROPS.LIVE_EVENTS_JS_LIST, a)
                }))) : a()
            }) : "function" == typeof a && a()
        },
        c = (e, t, i) => {
            let n = Resource.getRealValue(e ? "module.liveevent" : "liveevents.new");
            return n += t ? " - " + t : "", $WC.template.replace('<div class="flexC flexG">\n\t\t\t\t\t\t<div class="flexC flexG">\n\t\t\t\t\t\t\t<span class="zcf-live-event mT2 mR12 font23 line18 clr-icon2"></span>\n\t\t\t\t\t\t\t<span class="font17 fontB" live_event_title>{{live_event_title}}</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<span class="zcf-minusB zcl-close-icon xl {{hide_minimize_class}}" documentclick="minimizeWindow" data-id="live_event_schedule_win" title="{{minimize_tooltip}}"></span>\n\t\t\t\t\t</div>', {
                live_event_title: n,
                hide_minimize_class: i ? "" : "dN",
                $minimize_tooltip: "common.minimize"
            })
        },
        l = function(e, t, i) {
            var n, a;
            _isScheduleWinExists() || $WC.$Win.create({
                id: "live_event_schedule_win",
                class: "zc-le-modal zcl-modal",
                header: c(e, t, !1),
                html: (n = '<div class="skelton-loader zc-le-skelton-title"></div>', a = $WC.template.replace('{{title_loader}}\n\t\t\t\t\t\t\t\t\t\t\t<div class="flexC gap10 mT14">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class="skelton-loader mR12" style="width: 38px; height: 38px; border-radius: 100%;"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t{{title_loader}}\n\t\t\t\t\t\t\t\t\t\t\t</div>', {
                    title_loader: n
                }, "InSecureHTML"), $WC.template.replace('<div id="le_schedule_win_loader" class="flex flexG flex-col ovrflwH">\n\t\t\t\t\t\t<div class="flex flexG ovrflwH">\n\t\t\t\t\t\t\t<section class="zcl-default-padding flexG"><div class="zc-le-form">\n\t\t\t\t\t\t\t\t\t{{title_loader}}\n\t\t\t\t\t\t\t\t\t<div class="skelton-loader mT10" style="height: 36px;"></div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="zc-le-form mT35">\n\t\t\t\t\t\t\t\t\t{{title_loader}}\n\t\t\t\t\t\t\t\t\t<div class="skelton-loader mT10" style="height: 36px;"></div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="zc-le-form mT35">\n\t\t\t\t\t\t\t\t\t{{title_loader}}\n\t\t\t\t\t\t\t\t\t<div class="skelton-loader mT10" style="height: 110px;"></div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</section>\n\t\t\t\t\t\t\t<aside class="zc-le-aside flex-col gap20"><div>{{loader}}</div>\n\t\t\t\t\t\t\t\t<div class="mT50">{{loader}}</div>\n\t\t\t\t\t\t\t\t<div class="mT50">{{loader}}</div>\n\t\t\t\t\t\t\t</aside>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<span class="skelton-loader fshrink p25"></span>\n\t\t\t\t\t</div>', {
                    title_loader: n,
                    loader: a
                }, "InSecureHTML")),
                openfn: function() {
                    EventsMain.loadFiles((function() {
                        EventsMain.API.fetchAndGetDefaultCalendar((function() {
                            d((function() {
                                i()
                            }))
                        }), () => {
                            ZCLiveEvents.destroyScheduleWin()
                        })
                    }))
                },
                closefn: function() {
                    "undefined" != typeof ZCLiveEventsImpl && ZCLiveEventsImpl.clearCurrentSessionInView()
                }
            })
        };
    _isScheduleWinExists = () => $WC.$Win.isExist("live_event_schedule_win"), _getScheduleWin = () => $WC.$Win.get("live_event_schedule_win"), _destroyScheduleWin = () => {
        $WC.$Win.destroy("live_event_schedule_win")
    };
    return {
        isEnabled: o,
        isRTMPEnabled: () => $zcg._IS_RTMP_ENABLED,
        isAllowed: () => o() && SecurityManager.hasPermission(Modules.Events) && SecurityManager.hasPermission(Modules.PrimeTime) && Plan.isPrimeTimeAssemblyAllowed(),
        initialize: d,
        join: function(e) {
            var t = n[e];
            !t || t.closed ? n[e] = window.open($zcg._URLPREFIX + "/live-events/" + e) : t.focus()
        },
        accessControlCenter: function(e) {
            var t = a[e];
            !t || t.closed ? a[e] = window.open($zcg._URLPREFIX + "/live-events/" + e + "?view=control_center") : t.focus()
        },
        modes: {
            INTERNAL: "internal",
            EXTERNAL: "external",
            isInternal: function(e) {
                return this.INTERNAL === e
            },
            isExternal: function(e) {
                return this.EXTERNAL === e
            }
        },
        handleResize: function() {
            e && ZCLiveEventsUI.handleResize()
        },
        triggerScheduleUI: (e, t, i, n) => {
            if ("undefined" != typeof MinimizedWindows) {
                let i = [];
                MediaManager.isChatScope(e) ? (i.push("live_event_schedule_win" + t + ZCMediaConstants.triggerSource.CHAT_HEADER + "minimised"), i.push("live_event_schedule_win" + t + ZCMediaConstants.triggerSource.CALL_HISTORY + "minimised")) : i.push("live_event_schedule_winminimised");
                for (let e = 0; e < i.length; e++) {
                    let t = i[e];
                    if (MinimizedWindows.isMinimisedWindow(t)) return void MinimizedWindows.maximiseWindow(t)
                }
            }
            var a = {};
            i && (a.title = i), n && (a.triggerSource = n), void 0 !== e && (a.scopeType = e, void 0 !== t && (a.scopeId = t)), l(!1, i, (function() {
                ZCLiveEventsAPI.getUniqueId((function(e) {
                    ZCLiveEventsUI.updateDetailsScheduleUI(e.data.session_key, e.data.public_key, e.data.public_link, a)
                }), (function() {
                    ZCLiveEvents.destroyScheduleWin()
                }))
            }))
        },
        isScheduleWinExists: _isScheduleWinExists,
        getScheduleWinHeaderHtml: c,
        getScheduleWin: _getScheduleWin,
        destroyScheduleWin: _destroyScheduleWin,
        openEditWin: function(e, t, i, n) {
            l(!0, n, (function() {
                EventsUI.fetchEventDetails(e, t, (function(n) {
                    n.isLiveEventActive() ? (UI.updateBanner(Resource.getRealValue("liveevents.edit.already.inprogress"), 2e3, !0), _destroyScheduleWin(), ZCLiveEventsUI.openLandingPage(n, !1)) : n.isLiveEventEnded() ? (UI.updateBanner(Resource.getRealValue("liveevents.edit.already.ended"), 2e3, !0), _destroyScheduleWin(), EventsUI.openPreviewWin(e, t, !1, i, void 0)) : ZCLiveEventsUI.updateScheduleUIDetailsWithEventObj(n)
                }), !0, i)
            }))
        },
        openEditWinWithEventObj: function(e) {
            l(!0, e.getTitle(), (function() {
                ZCLiveEventsUI.updateScheduleUIDetailsWithEventObj(e)
            }))
        },
        handleEscape: function() {
            var t = !1;
            return e && (t = ZCLiveEventsHandler.shortCutEvents.handleEscape()), t
        },
        openLandingPageFromInfoMsg: function(e) {
            var t = function() {
                var t = EventsDB.getDefaultCalendarId();
                t && e.attr("cuid", t), EventsMain.loadFiles((function() {
                    EventsUtil.openLiveEventLandingPage(e)
                }))
            };
            EventsMain.UTIL.isCalendarsPresent(!0) ? t() : EventsMain.API.getCalendars(!1, t, t)
        },
        getLiveEventInfoMessage: function(e) {
            var t = e.msg,
                i = WmsImpl.isLocalUser(e.opruser.zuid),
                n = i ? t.calendaruid : EventsDB.getDefaultCalendarId();
            t.calendaruid = n || t.calendaruid;
            var a = $WC.template.replace('<span infobutton class="zcf-live-event zcthmfnt mrgR5 mrgL5"></span> <span infobutton purpose="{{purpose}}" entity_id="{{entity_id}}" entity_type="{{entity_type}}" organizer_zuid="{{organizer_zuid}}" event_id="{{event_id}}" caluid="{{caluid}}" {{recurrence_id}} class="hvrinfo zccnm">{{title}}</span>', {
                purpose: i ? "startLiveEvent" : "joinLiveEvent",
                $title: i ? "liveevent.start" : "liveevent.join"
            });

            function s(i) {
                return $WC.template.replace(i, {
                    caluid: t.calendaruid,
                    recurrence_id: t.recurrenceId ? "recurrence_id=" + t.recurrenceId : "",
                    event_id: t.eventuid,
                    entity_id: t.entity_id,
                    entity_type: t.entity_type,
                    organizer_zuid: e.opruser.zuid
                })
            }
            a = s(a);
            var o = $WC.template.replace('<span class="zcl-btn-theme--link mLR2 font13" event_buttons purpose="openPreview" id="{{event_id}}" entity_id="{{entity_id}}" entity_type="{{entity_type}}" organizer_zuid="{{organizer_zuid}}" event_id="{{event_id}}" cuid="{{caluid}}" {{recurrence_id}} >{{title}}</span>', {
                title: t.title
            });
            o = s(o);
            var r = Users.getName(e.opruser.zuid, e.opruser.nname, -1),
                d = "",
                c = [],
                l = t.reminder_value;
            if (-1 === l) d = i ? "liveevent.quick.desc.host" : "liveevent.quick.desc.attendee", c = i ? [r, a] : [o, a];
            else if (0 === l) d = i ? "liveevent.start.desc.host" : "liveevent.start.desc.attendee", c = i ? [r, o, a] : [o, a];
            else if (60 === l) d = "event.reminder.one.hour", c = [o, EventsMain.HTML.getDurationHtml(Resource.getRealValue("event.reminder.onehour"))];
            else {
                d = i ? "liveevent.desc.host" : "liveevent.desc.attendee";
                var u = Resource.getRealValue("event.mins").toLowerCase(),
                    p = EventsMain.HTML.getDurationHtml(EventsMain.UTIL.ENTITY_REMINDER_TIME + " " + u);
                c = i ? [r, p, o, a] : [o, p, a]
            }
            return Resource.getRealValue(d, c)
        },
        getTabNameOfScheduleWin: () => {
            let e = ZCLiveEventsImpl.getCurrentSessionInView();
            return e.isChatScope() && e.hasSelectedChatId() ? ConversationsList.get(e.getSelectedChatId()).title : ""
        },
        getMetaDataOfScheduleWin: () => ZCLiveEventsImpl.getCurrentSessionInView(),
        showScheduleWinIfMaximized: () => {
            "undefined" != typeof ZCLiveEventsUI && ZCLiveEventsUI.showScheduleWinOnMaximize()
        },
        handleScheduleWinMaximize: e => {
            ZCLiveEventsImpl.setScheduleWinSessionToBeMaximized(e);
            let t = e.getScheduleWinUniqueId(),
                i = t.replace(ZCMediaConstants.triggerSource.CHAT_HEADER, ""),
                n = e.getSelectedChatId();
            t.endsWith(ZCMediaConstants.triggerSource.CHAT_HEADER) && !ChatUI.getWin(i) && e.isChatScope() && e.hasSelectedChatId() && i === n ? MinimizedWindows.openCwinOnMaximise(n, () => {
                ZCLiveEventsUI.showScheduleWinOnMaximize()
            }) : ZCLiveEventsUI.showScheduleWinOnMaximize()
        },
        handleTransientFileStatus: e => {
            var t = !1;
            return r && (e.module !== ZCLiveEventsConstants.transientFileModules.BROLL && e.module !== ZCLiveEventsConstants.transientFileModules.BROCHURE || (t = !0, e.uploaded ? ZCLiveEventsUI.handleTransientFileUploadSuccess(e.session_id, e.details, e.module, void 0, !0) : ZCLiveEventsUI.handleTransientFileUploadError(e.session_id, e.details.name, e.module, void 0, void 0, void 0))), t
        },
        imageConstants: {
            getCoverImageSrcUrl: e => MediaManager.getImgUrl("cover_images/" + s[e].src),
            getDefaultCoverImageId: () => "default",
            getDefaultMiniCoverImageId: () => "default-mini"
        }
    }
}(), ZCLiveEventsMsgCardHandler = function() {
    var e = '<div class="zcl-msg-card zc-le-msg-card {{cursor_class}} {{custom_class}}" nativewidget="events" componentid="{{event_id}}" event_invitation_card id="{{event_id}}" cuid="{{cuid}}" purpose="openPreview" {{event_binder}} live_event="true">{{cover_image}}<div class="zc-le-msg-card-main">{{organizer_info}}{{attendees_cnt}}{{title_cnt}}{{time_info}}{{invited_info}}{{status_cnt}}</div></div>',
        t = '<div class="zcl-msg-card_hdr zcpseudo-bg"><img src="{{cover_img_src}}" class="wh100"></div>',
        i = '<div class="flexC"><div class="zcl-msg_infobox lineN ellips"><em class="zcf-live-event mR6"></em><span class="ellips">{{host_header}}</span></div></div>',
        n = '<div class="font16 fontB mT12 line22 ellips" title="{{event_title}}">{{event_title}}</div>',
        a = '<div class="flex mT15"><em class="zcf-calendar mT2" title="{{date_title}}"></em><span class="mL8 line22 wrd-brk-all text-wrp"><span class="mR10">{{event_time}}</span><span class="clr-lp1 nowrap">{{event_timezone}}</span></span></div>',
        s = '<div class="zcl-img-group flexC mT20">{{list}}</div>',
        o = '<div class="zcl-img lg zcl-img-outline" title="{{user_name}}"><img src="{{img_url}}" uid="{{user_zuid}}" elemtype="user" hover="true"></div>',
        r = '<div class="zcl-img lg flexM"><span class="zcl-img-more flexM font13 cur"><span>+<span><span>{{count}}</span></span></div>',
        d = '<div class="mT25"><div class="zcl-msg-card_ftr flexM fdirC {{state_class}}" invitation_state="{{invitation_state}}" event_status_btn_cnt>{{status_cnt}}</div></div>',
        c = function(e, t, i) {
            void 0 === i && (i = Intl.DateTimeFormat().resolvedOptions().timeZone || "");
            var n = EventsMain.UTIL.getFormattedDateTime(e, t, !0, !1, !0);
            return $WC.template.replace(a, {
                event_time: n,
                event_timezone: i,
                $date_title: "event.date"
            })
        },
        l = function(e, t) {
            var i = "";
            if (!$WC.Util.isEmpty(e)) {
                EventsLiveMsgHandler.isExpiredInvitationState(t);
                i = $WC.template.replace(d, {
                    status_cnt: e
                }, "InSecureHTML"), i = $WC.template.replace(i, {
                    invitation_state: t,
                    state_class: ""
                })
            }
            return i
        },
        u = function(a) {
            var o, r, d, u, p, f, m = $WC.template.replace(e, {
                cover_image: (f = ZCLiveEvents.imageConstants.getDefaultCoverImageId(), $WC.template.replace(t, {
                    cover_img_src: ZCLiveEvents.imageConstants.getCoverImageSrcUrl(f)
                })),
                organizer_info: (d = a.organizerZuid, u = a.organizerName, p = $WC.template.replace('<span class="clr-theme" elemtype="user" hover="true" uid="{{host_id}}">{{host_name}}</span>', {
                    host_id: d,
                    host_name: u
                }), $WC.template.replace(i, {
                    host_header: Resource.getRealValue("liveevents.card.host.header", p)
                }, "InSecureHTML")),
                attendees_cnt: (r = a.attendeesListHtml, $WC.template.replace(s, {
                    list: r
                }, "InSecureHTML")),
                title_cnt: (o = a.title, $WC.template.replace(n, {
                    event_title: o
                })),
                time_info: c(a.startTime, a.endTime, a.timeZone),
                invited_info: EventsCard.getScopeBasedAttendees(a),
                status_cnt: l(a.statusCntHtml, a.invitationState)
            }, "InSecureHTML");
            return $WC.template.replace(m, {
                event_id: a.eventId,
                cuid: a.calendarUID,
                event_binder: a.needsButtonAction ? "event_buttons" : "",
                cursor_class: a.needsButtonAction ? "cur" : "",
                custom_class: a.isPreview ? "mAuto" : ""
            })
        };
    return {
        getMessageCardHtml: u,
        getMessageCardHtmlWithEventObj: function(e, t, i) {
            var n = e.getOrganizerZuid(),
                a = Users.getName(e.getOrganizerZuidOrMailId(), e.getOrganizerMailId(), -1),
                s = WmsImpl.isLocalUser(n) ? e.getCalendarUID() : EventsDB.getDefaultCalendarId(),
                o = EventsLiveMsgHandler.isCreateInvitationState(i),
                r = e.getScopeData(),
                d = EventsCard.getInvitationStateHtml(e, i, t.status),
                c = e.getAttendees(),
                l = {
                    calendarUID: s,
                    eventId: e.getId(),
                    title: e.getTitle(),
                    startTime: e.getStarttime(),
                    endTime: e.getEndtime(),
                    organizerZuid: n,
                    organizerName: a,
                    scopeData: r,
                    attendeesCount: c ? c.length : 0,
                    attendeesListHtml: t.images,
                    statusCntHtml: d,
                    needsButtonAction: o && !$WC.Util.isEmpty(s),
                    invitationState: i,
                    isLiveEvent: e.isLiveEvent(),
                    isPreview: !1
                };
            return u(l)
        },
        getMessageCardAttendeesItem: function() {
            return o
        },
        getMessageCardViewMoreAttendees: function(e) {
            var t = "";
            return e > 0 && (t = $WC.template.replace(r, {
                count: e
            })), t
        }
    }
}();
var Presentation = {},
    PresentationImpl = {},
    PresentationAPI = {},
    PresentationUI = {},
    PresentationHandler = {},
    PresentationConstants = {};
void 0 !== MediaUtil && MediaUtil.isAVLibraryLoadedInCliq() && (window.cssPath = void 0, window.jsPath = void 0, window.skipZSWmsLiteImpl = !1, window.doNotExtendRemoveClass = !1), (Presentation = function(e) {
    e.presentation_id ? (this._id = e.presentation_id, this._presenterId = e.presenter_id, this._rsrcId = e.file_id, this._presenterSlideNo = e.slide_no, this._presenterAnimIndex = e.anim_index, this._fileName = e.file_name, this._fileSize = e.file_size, this._fileId = e.file_id) : (this._id = e[PresentationConstants.PRESENTATION_ID], this._presenterId = e[PresentationConstants.PRESENTER_ID], this._rsrcId = e[PresentationConstants.RSRC_ID], this._presenterSlideNo = e[PresentationConstants.SLIDE_NO], this._presenterAnimIndex = e[PresentationConstants.ANIM_INDEX]), this._initialized = !1
}).prototype = {
    setPresentationId: function(e) {
        this._id = e
    },
    getPresentationId: function() {
        return this._id
    },
    setPresenterId: function(e) {
        this._presenterId = e
    },
    getPresenterId: function() {
        return this._presenterId
    },
    setRsrcId: function(e) {
        this._rsrcId = e
    },
    getRsrcId: function() {
        return this._rsrcId
    },
    setPresenterSlideNo: function(e) {
        this._presenterSlideNo = e
    },
    getPresenterSlideNo: function() {
        return this._presenterSlideNo
    },
    setPresenterAnimIndex: function(e) {
        this._presenterAnimIndex = e
    },
    getPresenterAnimIndex: function() {
        return this._presenterAnimIndex
    },
    getFileSize: function() {
        return this._fileSize
    },
    getFileId: function() {
        return this._fileId
    },
    getFileName: function() {
        return this._fileName
    },
    setCanvas: function(e) {
        this._canvas = e
    },
    getCanvas: function() {
        return this._canvas
    },
    init: function() {
        this._initialized = !0
    },
    isInitialized: function() {
        return this._initialized
    },
    reset: function() {
        this._initialized = !1
    },
    resetDefault: function(e) {
        var t = PresentationImpl.isOneToOneSession(e);
        Conference.isPresentationStreamingEnabled() && e.isPresenter() && (PresentationUI.hidePresentationIndicator(e), PresentationImpl.clearCanvasInterval(), t ? (e.getCurrentMember().removeScreenFromConnection(), MediaCallUI.resetScreenShareOption()) : (ConferenceAPI.stopScreenShare(e.getId()), e.closeScreenUpStreamConnection(), WebRTCUserMedia.closeStream(WebRTCUserMedia.streamTypes.SCREEN)));
        e.resetPresentationStream(), t || e.setScreenSharerId(void 0), this.setPresenterId(void 0), this.setPresentationId(void 0), this.setRsrcId(void 0), this.setCanvas(void 0), this.setPresenterSlideNo(PresentationImpl.getDefaultSlideNo()), this.setPresenterAnimIndex(PresentationImpl.getDefaultAnimIndex()), this.reset(), PresentationImpl.exitSlideshow()
    },
    stop: function(e) {
        PresentationUI.removeDropDown(e), PresentationAPI.stopPresentation(this.getPresentationId())
    },
    open: function() {
        PresentationImpl.initConstants(), PresentationImpl.loadDependencyFiles((function() {
            var e = PresentationImpl.getCurrentActiveSession(),
                t = PresentationImpl.isOneToOneSession(e);
            if (t) {
                e.isPresenter() ? MediaCallHandler.UIEvents.maximizeWindow() : MediaCallUI.handleSwitchToVideoLayout(), MediaCallUI.addAndGetPresentationContainer(e._id, e)
            } else {
                var i = PresentationUI.getContainer();
                ZCSmartConferenceUI.addAndSetPresentationContainer(i, e), ZCSmartConferenceUI.handlePresentationStartOpenOrClose()
            }
            if (PresentationImpl.bindEvents(), ZSSlideShowIntegration.init(PresentationImpl.getConfig(e)), Conference.isPresentationStreamingEnabled()) {
                var n = ($zcg._CSSTATICURL ? $zcg._CSSTATICURL : $zcg._RAW_SERVERURL) + "/officechat/styles/media/presentation/zs_showtime_slideshow.css";
                SVGToCanvas.init({
                    stylesheetUrl: n
                })
            }
            t || ZCSmartConferenceUI.handleResize()
        }))
    },
    close: function() {
        var e = PresentationImpl.getCurrentActiveSession();
        if (e.getMember(this.getPresenterId()))
            if (this.resetDefault(e), PresentationImpl.isOneToOneSession(e)) MediaCallUI.removePresentationContainer(e);
            else if (ZCSmartConferenceImpl.isSmartConferenceSession(e)) ZCSmartConferenceUI.removePresentationContainer(e);
        else {
            var t = PresentationUI.getContainer();
            t.addClass("hide"), t.find("#presentation_container").remove(), t.find("#presenter_view").addClass("dN").empty(), ZCJQuery("#conferencevideowrapper").show(), ZCSmartConferenceUI.handlePresentationStartOpenOrClose()
        }
    },
    jumpToSlide: function(e, t) {
        zsSlideShow.set.jumpTo.call(zsSlideShow, {
            slideNo: e,
            animIndex: t
        })
    },
    getCanvasAndSetStream: function(e, t) {
        var i = this.getCanvas();
        SVGToCanvas.clearTempDataUrlMap(), SVGToCanvas.docData = ZSjQuery.docData;
        var n = zsSlideShow.get.currentSlideDetails.call(zsSlideShow).slideId,
            a = zsSlideShow.get.slideSetup.call(zsSlideShow, t).size,
            s = {
                scale: 1,
                target: "slide",
                dim: {
                    width: a.width,
                    height: a.height
                },
                slideID: n,
                canvaScale: 2,
                canvasElement: i || function() {
                    var e = document.createElement("canvas");
                    return e.width = 300, e.height = 200, e.id = "conference_ppt_canvas", e
                }(),
                outputFormat: SVGToCanvas.OUTPUTFORMATS.CANVAS
            },
            o = function() {
                var e = this.getCanvas();
                e.getContext("2d").drawImage(e, 0, 0)
            }.bind(this),
            r = function(t) {
                if (void 0 === i) {
                    i = t, this.setCanvas(i);
                    var n = WebRTCUserMedia.createStreamFromCanvas(i, PresentationImpl.getStreamFPS());
                    if (PresentationImpl.isOneToOneSession(e)) e.getCurrentMember().addScreenInConnection(n), e.setAsScreenShared();
                    else ZCSmartConferenceImpl.isSmartConferenceSession(e) ? ZCSmartConferenceImpl.addScreenInSession(n) : ConferenceImpl.addScreenInSession(n);
                    PresentationConstants._canvasTimer = setInterval(o, PresentationImpl.getCanvasTimeout())
                }
            }.bind(this),
            d = ZSjQuery("#slidecontainer").find(`[slideid=${n}]`).closest("#svgcontainer");
        SVGToCanvas.SLIDE.convertSlide(r, d, s)
    }
}, PresentationImpl = {
    isEnabled: function() {
        return SecurityManager.hasPermission(Modules.Presentation)
    },
    handleEnd: function(e) {
        this.clearCanvasInterval(), e && e.hasPresentation() && (this.exitSlideshow(), e.getPresentation().reset()), "undefined" != typeof Workdrive && Workdrive.Handlers.pickerPopupClose()
    },
    clearCanvasInterval: function() {
        clearInterval(PresentationConstants._canvasTimer), PresentationConstants._canvasTimer = void 0
    },
    handleStreaming: function(e) {
        if (Conference.isPresentationStreamingEnabled()) {
            e = e || PresentationImpl.getCurrentSlideNo();
            var t = PresentationImpl.getCurrentActiveSession();
            if (!PresentationImpl.isOneToOneSession(t) && t.isPresenter()) t.getPresentation().getCanvasAndSetStream(t, e)
        }
    },
    navigateSlidesByShortcut: function(e) {
        var t = !1;
        if (MediaUtil.isAVLibraryLoadedInChatbar() || !Conference.isPresentationsAllowed()) return t;
        var i = PresentationImpl.getCurrentActiveSession();
        if (i && i.hasPresentation()) {
            var n = PresentationImpl.getCurrentSlideNo();
            e === $zcg.LEFT_KEYCODE ? n > PresentationImpl.getDefaultSlideNo() && (PresentationImpl.navigateToPreviousSlide(), t = !0) : e === $zcg.RIGHT_KEYCODE && n < PresentationImpl.getTotalSlideCount() - 1 && (PresentationImpl.navigateToNextSlide(), t = !0)
        }
        return t
    },
    initConstants: function() {
        MediaUtil.isAVLibraryLoadedInCliq() && (window.cssPath = "https://" + $zcg._CSSTATICSERVER, window.jsPath = "https://" + $zcg._JSSTATICSERVER, window.skipZSWmsLiteImpl = !0, window.doNotExtendRemoveClass = !0)
    },
    getConfig: function(e) {
        var t = e.getPresentation();
        return {
            initParams: {
                broadcastid: t.getPresentationId(),
                servicename: $zcg._SERVICENAME
            },
            renderingParams: {
                broadcastId: t.getPresentationId(),
                audId: this.getModifiedZuidForNetworks(ConferenceImpl.getCurrentUserId()),
                servicename: $zcg._SERVICENAME
            },
            rsrcId: t.getRsrcId(),
            isAudience: !e.isPresenter(),
            _userId: this.getModifiedZuidForNetworks(ConferenceImpl.getCurrentUserId()),
            path: $zcg._SHOWPUBLICSERVER + "/showapi/"
        }
    },
    getModifiedZuidForNetworks: function(e) {
        return OrgFeatures.isIntranetRequest() ? e : new $WmsUserId(e).getIamZuid()
    },
    getLastSlideUpdatedTime: function() {
        return PresentationConstants._lastSlideUpdatedTime
    },
    setLastSlideUpdatedTime: function(e) {
        PresentationConstants._lastSlideUpdatedTime = e
    },
    isTimeEligibleToUpdateSlide: function(e) {
        return this.getLastSlideUpdatedTime() < e
    },
    getStreamFPS: function() {
        return PresentationConstants._streamingFramesPerSecond
    },
    getCanvasTimeout: function() {
        return PresentationConstants._canvasTimeout
    },
    getDefaultAnimIndex: function() {
        return PresentationConstants._defaultAnimIndex
    },
    getDefaultSlideNo: function() {
        return PresentationConstants._defaultSlideNo
    },
    getCurrentActiveSession: function() {
        var e = "undefined" != typeof ZCSmartConferenceImpl ? ZCSmartConferenceImpl.getCurrentActiveSession() : MediaCallImpl.getCurrentSession();
        return e || MediaCallImpl.getCurrentSession()
    },
    navigateToNextSlide: function() {
        zsSlideShow.set.next.call(zsSlideShow), PresentationUI.handlePresenterViewSelectedState()
    },
    navigateToPreviousSlide: function() {
        zsSlideShow.set.previous.call(zsSlideShow), PresentationUI.handlePresenterViewSelectedState()
    },
    getCurrentSlideNo: function() {
        return zsSlideShow.get.slideNo.call(zsSlideShow)
    },
    getCurrentAnimIndex: function(e) {
        return zsSlideShow.get.completedAnimIndex.call(zsSlideShow, e)
    },
    exitSlideshow: function() {
        "undefined" != typeof zsSlideShow && zsSlideShow.exitSlideshow.call(zsSlideShow)
    },
    renderSlide: function(e, t) {
        zsSlideShow.set.renderZsSlideThumb.call(zsSlideShow, {
            slideIndex: e,
            container: t
        })
    },
    renderSlides: function(e, t, i) {
        for (var n = t = t || PresentationImpl.getDefaultSlideNo(), a = PresentationImpl.getTotalSlideCount(); n < a; n++) {
            ZSjQuery(e.find("#presentation_nav_slide_item_" + n)).data("scale", i)
        }
        this.initThumbnailContainers(e, {
            attribute: "presentation_thumbnail"
        }), this.renderZSSlideThumbs(t + 1, PresentationImpl.getTotalSlideCount())
    },
    initThumbnailContainers: function(e, t) {
        zsSlideShow.set.initThumbnailContainers.call(zsSlideShow, e, t)
    },
    renderZSSlideThumbs: function(e, t) {
        zsSlideShow.set.renderZSSlideThumbs.call(zsSlideShow, [e, t])
    },
    getTotalSlideCount: function() {
        return zsSlideShow.get.totalSlidesCount.call(zsSlideShow)
    },
    getThumbnailURL: function(e) {
        return $zcg._SHOWSERVER + "/show/image?rid=" + e + "&a_t=DOC_THUMBNAIL&type=LARGE"
    },
    getURL: function(e, t, i) {
        var n = {
            entity_id: WorkDriveUtil.frameEntityId(t),
            module: "audio_conference" === i || "video_conference" === i ? "Meetings" : "Calls"
        };
        return $zcg._WORKDRIVESERVER + "/show/preview/" + e + "?authId=" + encodeURIComponent(JSON.stringify(n)) + "&notopbar=true&frameorigin=" + $Util.getFrameOrigin()
    },
    replaceImageWithPresentationIcon: function(e) {
        var t = ZCJQuery(e);
        t.parents("[presentation_thumbnail_cnt]").addClass("zcf-presentation font30"), t.remove()
    },
    updateSlide: function(e, t) {
        var i = PresentationImpl.getCurrentActiveSession();
        i && i.isPresenter() && PresentationAPI.updatePresentationSlide(i.getPresentation().getPresentationId(), e, t)
    },
    getSlideThumbnailDimentions: function() {
        return zsSlideShow.get.slideThumbDimensions.call(zsSlideShow, {
            height: 120,
            width: 170
        })
    },
    loadDependencyFiles: function(e) {
        LazyLoader.loadShowIntegrationFiles().then(e)
    },
    getResourceType: function(e) {
        return PresentationImpl.isOneToOneSession(e) ? PresentationConstants.ONE_TO_ONE_CALL : PresentationConstants.GROUP_CALL
    },
    isOneToOneSession: function(e) {
        return "undefined" != typeof MediaCallSession && e instanceof MediaCallSession
    },
    bindEvents: function() {
        if (!PresentationConstants._eventBinded) {
            var e = ZSjQuery(document);
            e.on("ZSSlideShowIntegrationInitialized", (function() {
                var e = {
                    startSlide: PresentationImpl.getCurrentActiveSession().getPresentation().getPresenterSlideNo()
                };
                ZSSlideShowIntegration.initSlideshow(e)
            })), e.on("zs_slideshowload", (function(e, t) {
                var i = t.slide;
                PresentationUI.updateSlideDetails(void 0, i), PresentationUI.removeLoader(), PresentationImpl.getCurrentActiveSession().getPresentation().init(), PresentationUI.updateThumbnailSlidesList(i), PresentationImpl.handleStreaming(i)
            })), e.on("zs_slideshownavigate", (function(e, t) {
                PresentationUI.updateSlideDetails(), PresentationImpl.handleStreaming(), PresentationImpl.updateSlide(t.slide, t.animIndex)
            })), PresentationConstants._eventBinded = !0
        }
    }
}, PresentationUI = {
    _templates: {
        presentationNavSlide: '<div id="{{presentation_nav_slide_id}}" style="width: {{slide_width}}; height: {{slide_height}};" presentation_thumbnail purpose="jumpToPresentationSlide" mediamodulebuttons slide_no="{{slide_no}}" class="zcl-img-item"></div>',
        presentationOptions: '<div id="presentation_options_cnt" class="zc-av-presentation-options flexC dN">\n\t\t\t\t\t\t\t\t\t   {{host_or_viewer_options_html}}\n\t\t\t\t\t\t\t\t\t   <div class="zc-av-presentation-option flexC font14">\n\t\t\t\t\t\t\t\t\t      <div class="zcf-leftArrow opacity-hover tooltip-left" tooltip-title="{{tooltip_back}}" purpose="navigateToPreviousSlide" mediamodulebuttons></div>\n\t\t\t\t\t\t\t\t\t      <input type="number" id="presentation_current_slide" smartconferenceinput keyup-purpose="jumpToPresentationSlide" focus-purpose="selectInput" value="1" class="zcl-number zcl-input-xs fontB clr-theme hide-spin-btn textC">\n\t\t\t\t\t\t\t\t\t      <div id="presentation_slide_count">/</div>\n\t\t\t\t\t\t\t\t\t      <div class="zcf-rightArrow opacity-hover tooltip-up" tooltip-title="{{tooltip_forward}}" purpose="navigateToNextSlide" mediamodulebuttons></div>\n\t\t\t\t\t\t\t\t\t   </div>\n\t\t\t\t\t\t\t\t\t</div>',
        presentationHostOptions: '<div class="zc-av-presentation-option flexC font14">\n\t\t\t\t\t\t\t\t\t      <div class="zcf-zoomin"></div>\n\t\t\t\t\t\t\t\t\t      <div class="zcl-separator"></div>\n\t\t\t\t\t\t\t\t\t      <div class="flexC">\n\t\t\t\t\t\t\t\t\t         <span class="zcf-cursor"></span>\n\t\t\t\t\t\t\t\t\t         <span class="zcf-pointer font6 opacity-hover mL6"></span>\n\t\t\t\t\t\t\t\t\t      </div>\n\t\t\t\t\t\t\t\t\t   </div>',
        presentationContainer: '<div id="presentation_container" class="zc-av-presentation-screen"><div class="smartconf-container-opts flexC">{{layout_opt}}<div class="smartconf-container-opt smartconf-fullscrn-btn zcf-fullscrn flexM tooltip-right0 dN" tooltip-title="{{open_full_screen}}" {{custom_attr_button}} purpose="{{full_screen_purpose}}"></div></div>{{buffer_loader}}<div id="slidecontainer_wrp" class="flex wh100"><div id="slidecontainer_leftnav_cnt" class="fshrink zc-av-presentation-leftnav zcl-img-list list-counter"></div><div id="slidecontainer_leftnav_hidebar" class="flexM cur zc-av-presentation-leftnav-hidebtn zc-av-presentation-hide-left-nav tooltip-right" value="hide" tooltip-title="{{hide_left_navigation}}" mediamodulebuttons purpose="togglePresentationSlidesList"><span  class="zcf-leftArrow"></span></div><div class="flexG posrel"><div id="slidecontainer" class="flexG"></div></div></div><div class="hudl-usr-info ellips flexC dN">{{host_identifier}}<span class="flexG ellips">{{user_name}}</span></div>{{presentation_options}}</div>',
        presentationViewerOptions: '<div purpose="jumpToHostView" mediamodulebuttons class="zc-av-presentation-option zc-av-presentation-hostview flexC font14 cur">\n\t\t\t\t\t\t\t\t\t\t\t      <div class="zcf-presenter cur font18"></div>\n\t\t\t\t\t\t\t\t\t\t\t      <div class="zc-av-presentation-hostview-cnt">{{goto_hostview}}</div>\n\t\t\t\t\t\t\t\t\t </div>'
    },
    getPresentationContainerHtml: function(e) {
        var t = !PresentationImpl.isOneToOneSession(e),
            i = e && t ? e.getCurrentScreenLayout() : void 0,
            n = e.getCurrentUserId(),
            a = $WC.template.replace(PresentationUI._templates.presentationContainer, {
                buffer_loader: ZCMediaTemplates.getLoaderHtml("presentation_loader", "media.presentation.load", "", !0),
                layout_opt: t ? ZCSmartConferenceTemplates.getScreenLayoutOptionHtml(i, !1) : "",
                presentation_options: PresentationUI.getPresentationOptionsHtml(e),
                custom_attr_button: t ? "smartconferencebutton" : 'targetElemSelector="[presentation_wrapper]"  mediacallbuttons',
                full_screen_purpose: t ? "openPresenterViewInFullScreen" : "openInFullScreen",
                host_identifier: e.isPresenter() ? '<span class="zcf-owner mR5 fshrink" hostIndicator></span>' : ""
            }, "InSecureHTML");
        return a = $WC.template.replace(a, {
            uid: n,
            $goto_hostview: "common.goto.presenter.view",
            $hide_left_navigation: "media.presentation.hide.slides",
            $tooltip_back: "common.back",
            $tooltip_forward: "common.forward",
            user_name: Users.getName(n, void 0, -1),
            $open_full_screen: "media.open.fullscreen"
        })
    },
    getPresentationOptionsHtml: function(e) {
        var t = e.isPresenter();
        return $WC.template.replace(PresentationUI._templates.presentationOptions, {
            host_or_viewer_options_html: t ? "" : PresentationUI._templates.presentationViewerOptions
        }, "InSecureHTML")
    },
    getPresentationNavSlides: function(e) {
        for (var t = PresentationImpl.getTotalSlideCount(), i = "", n = 0; n < t; n++) i += $WC.template.replace(PresentationUI._templates.presentationNavSlide, {
            presentation_nav_slide_id: "presentation_nav_slide_item_" + n,
            slide_no: n
        });
        return i = $WC.template.replace(i, {
            slide_width: e.width + "px",
            slide_height: e.height + "px"
        })
    },
    handleMinimize: function() {
        var e = PresentationImpl.getCurrentActiveSession();
        e.hasPresentation() && (PresentationImpl.isOneToOneSession(e) || ZSjQuery(this.getContainer().find("#presentation_container")).detach().appendTo("#conference_minimized_presentation_cnt"))
    },
    handleMaximize: function() {
        if ((e = PresentationImpl.getCurrentActiveSession()).hasPresentation()) {
            var e = PresentationImpl.getCurrentActiveSession();
            if (!PresentationImpl.isOneToOneSession(e)) {
                var t = this.getContainer();
                ZSjQuery(this.getMinimisedViewContainer().find("#presentation_container")).detach().appendTo(t)
            }
        }
    },
    updateSlideDetails: function(e, t) {
        e = e || this.getContainer();
        var i = void 0 !== t ? t + 1 : PresentationImpl.getCurrentSlideNo() + 1,
            n = PresentationImpl.getTotalSlideCount(),
            a = e.find("#presentation_current_slide");
        a.val(i), e.find("#presentation_slide_count").text("/ " + n + " " + Resource.getRealValue(n > 1 ? "common.slides" : "common.slide")), this.toggleNavigator(a, n, i)
    },
    removeLoader: function() {
        var e = this.getContainer();
        e.find("#presentation_options_cnt").removeClass("dN"), e.find("#presentation_loader").addClass("dN")
    },
    showPresentationIndicator: function(e) {
        (ZCSmartConferenceImpl.isSmartConferenceSession(e) ? ZCSmartConferenceUI.getConferenceWindow() : ConferenceUI.getConferenceWindow()).find("[presentation_indicator_v2]").removeClass("dN")
    },
    hidePresentationIndicator: function(e) {
        (ZCSmartConferenceImpl.isSmartConferenceSession(e) ? ZCSmartConferenceUI.getConferenceWindow() : ConferenceUI.getConferenceWindow()).find("[presentation_indicator_v2]").addClass("dN")
    },
    getMinimisedViewContainer: function() {
        var e = PresentationImpl.getCurrentActiveSession();
        return PresentationImpl.isOneToOneSession(e) ? ZCJQuery("[presentation_wrapper]") : ZCJQuery("#conference_minimized_presentation_cnt")
    },
    getContainer: function() {
        var e = PresentationImpl.getCurrentActiveSession();
        return PresentationImpl.isOneToOneSession(e) ? MediaCallUI.getPresentationContainer(e.getId()) : ZCSmartConferenceImpl.isSmartConferenceSession(e) ? ZCSmartConferenceUI.getConferenceWindow() : ZCJQuery("#conferencepresentationwrapper")
    },
    removeDropDown: function(e) {
        PresentationImpl.isOneToOneSession(e) ? MediaCallUI.removeMoreOptionsDropDown(e.getId()) : ZCSmartConferenceImpl.isSmartConferenceSession(e) ? ZCSmartConferenceUI.removeOptionsDropDown() : ConferenceUI.removeDropDown()
    },
    showDropDown: function(e, t) {
        var i = ZCSmartConferenceImpl.isSmartConferenceSession(e),
            n = i ? ZCSmartConferenceUI.getConferenceWindow() : ConferenceUI.getConferenceWindow(),
            a = Conference.isPresentationsAllowed();
        i ? a ? ZCSmartConferenceHandler.UIEvents.showShareOptions(t, n.find("[purpose=showShareOptions]")) : ZCSmartConferenceHandler.UIEvents.showMoreOptions(t, n.find("[purpose=showMoreOptions]")) : a ? ConferenceHandler.UIEvents.showShareOptions(t, n.find("[purpose=showShareOptions]")) : ConferenceHandler.UIEvents.showMoreOptions(t, n.find("[purpose=showMoreOptions]"))
    },
    updateThumbnailSlidesList: function(e) {
        var t = PresentationImpl.getCurrentActiveSession(),
            i = this.getContainer().find("#slidecontainer_leftnav_cnt");
        t.isPresenter() || (PresentationImpl.isOneToOneSession(t) ? (PresentationUI.handleMinimize(), PresentationUI.handleResize()) : PresentationHandler.togglePresentationSlidesList(i.siblings("#slidecontainer_leftnav_hidebar")));
        var n = PresentationImpl.getSlideThumbnailDimentions();
        i.html(PresentationUI.getPresentationNavSlides(n)), PresentationImpl.renderSlides(i, PresentationImpl.getDefaultSlideNo(), n.scale), this.addHostIndicator(i, e)
    },
    handleResize: function() {
        var e = PresentationImpl.getCurrentActiveSession().getPresentation();
        e && e.isInitialized() && ZSjQuery("#slidecontainer").zslideshow("resizeContainer")
    },
    toggleNavigator: function(e, t, i) {
        var n = e.siblings('[purpose="navigateToNextSlide"]');
        e.siblings('[purpose="navigateToPreviousSlide"]').toggleClass("zcdisabled", 1 == i), n.toggleClass("zcdisabled", i == t)
    },
    replaceHostIndicator: function(e, t) {
        var i = e.find("[host_indicator]");
        i.parents('[purpose="jumpToPresentationSlide"]').removeClass("active"), i.remove(), this.addHostIndicator(e, t)
    },
    addHostIndicator: function(e, t) {
        e.find("#presentation_nav_slide_item_" + t).addClass("active").append('<div class="hudl-usr-info flexM zc-av-presentation-host-slideindication" host_indicator>\n\t\t\t\t\t\t\t\t\t<span class="zcf-owner fshrink"></span>\n\t\t\t\t\t\t\t\t</div>')
    },
    openPrompt: function(e, t, i) {
        var n = [$WC.$Dlg.getButtonObj("common.cancel", $zcg._cssClasses.SECONDARY_BTN), $WC.$Dlg.getButtonObj("media.presentation.start", $zcg._cssClasses.WARNING_BTN, (function() {
                PresentationAPI.uploadAndStartPresentation(e, t)
            }))],
            a = Workdrive.isCallEntity(i) ? "media.presentation.share.121.prompt.subheader" : "media.presentation.share.prompt.subheader";
        $WC.$Dlg.create({
            id: "share_presentation_prompt",
            version: 3,
            class: "modalwindow zcl-alert-dialog-2 zcalgncntr zcbg_mask zcmodal-w600",
            headerhtml: $WC.$Dlg.frameHeaderHTML({
                imagehtml: '<div class="zcl-img lg flexM mAuto zcf-warning zcl-warning-bg"></div>',
                header: Resource.getRealValue("media.presentation.share.prompt.header"),
                subheader: Resource.getRealValue(a)
            }),
            buttons: n
        })
    },
    handlePresenterViewSelectedState: function() {
        var e = PresentationImpl.getCurrentActiveSession();
        if (!e.isPresenter()) {
            let t = e.getPresentation().getPresenterSlideNo() === PresentationImpl.getCurrentSlideNo();
            ZCJQuery('[mediamodulebuttons][purpose="jumpToHostView"]').toggleClass("zc-av-presentation-hostview", t)
        }
    }
}, PresentationHandler = {
    handleStopPresentation: function(e) {
        var t = e.getPresentation();
        t && t.close()
    },
    handleJoinPresentation: function(e, t) {
        if (t) {
            var i = new Presentation(e);
            t.setPresentation(i), t.isPresenter() || i.open()
        }
    },
    handlePresentationSlideChange: function(e, t) {
        if (!t.isPresenter()) {
            var i = t.getPresentation(),
                n = e[PresentationConstants.SLIDE_NO],
                a = e[PresentationConstants.ANIM_INDEX],
                s = e[PresentationConstants.SLIDE_UPDATED_TIME],
                o = e[PresentationConstants.PREVIOUS_SLIDE_NO],
                r = PresentationImpl.getCurrentSlideNo();
            PresentationImpl.isTimeEligibleToUpdateSlide(s) && (r == o && (zsSlideShow.set.jumpTo.call(zsSlideShow, {
                slideNo: n,
                animIndex: a
            }), PresentationImpl.setLastSlideUpdatedTime(s)), i.setPresenterSlideNo(n), i.setPresenterAnimIndex(a), PresentationUI.replaceHostIndicator(PresentationUI.getContainer().find("#slidecontainer_leftnav_cnt"), i.getPresenterSlideNo()), PresentationUI.handlePresenterViewSelectedState())
        }
    },
    dropRequest: function(e) {
        var t = PresentationImpl.getCurrentActiveSession();
        PresentationUI.removeDropDown(t), ConferenceAPI.dropPresentationRequest(t.getId(), ZCSmartConferenceConstants.presentationType.PRESENTATION, (function() {
            t.getCurrentMember().resetPresentationRequest(ZCSmartConferenceConstants.presentationType.PRESENTATION), PresentationUI.showDropDown(t, e), UI.updateBanner(Resource.getRealValue("media.present.request.cancelled"))
        }))
    },
    raiseRequest: function(e) {
        var t = PresentationImpl.getCurrentActiveSession();
        PresentationUI.removeDropDown(t), ConferenceAPI.raiseMediaSessionRequest(t.getId(), ZCSmartConferenceConstants.presentationType.PRESENTATION, (function(i) {
            t.getCurrentMember().setPresentationRequest(ZCSmartConferenceConstants.presentationType.PRESENTATION), PresentationUI.showDropDown(t, e), UI.updateBanner(Resource.getRealValue("media.present.request.raised"))
        }))
    },
    startPresentation: function(e) {
        PresentationUI.removeDropDown(e), ZCSmartConferenceImpl.startPresentation()
    },
    closePresentationPreview: function(e, t) {
        ZCJQuery(document.body).find("#presentation_history_view").remove()
    },
    openPresentationFromHistory: function(e, t) {
        var i = t.attr("data-uid"),
            n = t.attr("data-title"),
            a = (t.attr("uid"), t.attr("session-key")),
            s = t.attr("meeting_type"),
            o = $WC.template.replace(WhiteBoardImpl.html.history_view_container, {
                title: n,
                purpose: "closePresentationPreview",
                custom_attr: "mediamodulebuttons",
                id: "presentation"
            });
        o = $WC.template.replace(o, {
            buffer_loader: MediaTemplates.getBufferLoader()
        }, "InSecureHTML");
        var r = ZCJQuery(document.body);
        r.append(o);
        var d = r.find("#presentation_history_view"),
            c = d.find("iframe")[0];
        $Util.animateBufferLoader(d.find("[bufferloadercnt]"), 9), c.onload = function() {
            d.find("[bufferloadercnt]").empty(), ZCJQuery(c).removeClass("dN")
        }, c.src = PresentationImpl.getURL(i, a, s), Clickoutside.bind({
            event: e,
            srcid: t.attr("id"),
            destid: "presentation_history_view",
            customHide: function(e) {
                r.find("#" + e.destid).remove()
            }
        })
    },
    validateInput: function(e) {
        var t = PresentationImpl.getTotalSlideCount(),
            i = parseInt(e.val());
        i > t ? e.val(t) : i < 1 && e.val(1), PresentationUI.toggleNavigator(e, t, i)
    },
    togglePresentationSlidesList: function(e) {
        e.parents("#slidecontainer_wrp").toggleClass("zc-av-presentation-hide-left-nav");
        var t = "hide" === e.attr("value") ? {
            value: "show",
            "tooltip-title": I18N("media.presentation.show.slides")
        } : {
            value: "hide",
            "tooltip-title": I18N("media.presentation.hide.slides")
        };
        e.attr(t)
    },
    jumpToPresentationSlide: function(e, t, i) {
        var n = PresentationImpl.getCurrentActiveSession();
        t = void 0 !== t ? t : parseInt(e.val()) - 1, i = void 0 !== i ? i : PresentationImpl.getDefaultAnimIndex(), n.getPresentation().jumpToSlide(t, i), PresentationUI.handlePresenterViewSelectedState()
    }
}, PresentationAPI = {
    uploadAndStartPresentation: function(e, t) {
        var i = t.getHashForPresentation();
        e && (i.resource_id = e);
        var n = PresentationImpl.getCurrentActiveSession();
        i.resource_type = PresentationImpl.getResourceType(n), i.conference_id = n.getId(), MediaAPI.getConferenceAjaxWrapper()({
            url: "/v2/presentations",
            type: "POST",
            contentType: "application/json",
            data: i,
            success: function(e) {
                var t = new Presentation(e.data);
                n.setPresentation(t), t.open()
            }
        })
    },
    updatePresentationSlide: function(e, t, i) {
        var n = PresentationImpl.getCurrentActiveSession(),
            a = this._addCommonParams(n);
        a.slide_no = t, a.anim_index = i, a.slide_updated_time = $Util.getSyncedCurrentTime(), MediaAPI.getConferenceAjaxWrapper()({
            url: "/v2/presentations/" + e + "/navigate",
            type: "PUT",
            contentType: "application/json",
            data: a,
            success: function() {
                var e = n.getPresentation();
                e.setPresenterSlideNo(t), e.setPresenterAnimIndex(i), PresentationUI.replaceHostIndicator(PresentationUI.getContainer().find("#slidecontainer_leftnav_cnt"), e.getPresenterSlideNo())
            }
        })
    },
    stopPresentation: function(e, t) {
        var i = PresentationImpl.getCurrentActiveSession(),
            n = this._addCommonParams(i);
        MediaAPI.getConferenceAjaxWrapper()({
            url: "/v2/presentations/" + e + "/stop",
            type: "POST",
            contentType: "application/json",
            data: n,
            success: function(e) {
                PresentationHandler.handleStopPresentation(i), "function" == typeof t && t(e)
            }
        })
    },
    _addCommonParams: function(e) {
        var t = PresentationImpl.isOneToOneSession(e),
            i = {
                resource_id: t ? e.getId() : e.getSessionKey(),
                resource_type: PresentationImpl.getResourceType(e)
            };
        return t || (i.conference_id = e.getId()), i
    }
}, PresentationConstants = {
    _eventBinded: !1,
    _lastSlideUpdatedTime: 0,
    _defaultSlideNo: 0,
    _defaultAnimIndex: 0,
    _canvasTimeout: 300,
    _canvasTimer: void 0,
    _streamingFramesPerSecond: 15,
    GROUP_CALL: "group_call",
    ONE_TO_ONE_CALL: "direct_call",
    PRESENTATION_ID: "p_id",
    PRESENTER_ID: "p_zuid",
    PRESENTATION_STATE: "p_state",
    RSRC_ID: "r_id",
    SLIDE_NO: "s_no",
    PREVIOUS_SLIDE_NO: "ps_no",
    ANIM_INDEX: "a_in",
    CONFERENCE_ID: "c_id",
    SLIDE_UPDATED_TIME: "s_u_t",
    PPT: "ppt"
};
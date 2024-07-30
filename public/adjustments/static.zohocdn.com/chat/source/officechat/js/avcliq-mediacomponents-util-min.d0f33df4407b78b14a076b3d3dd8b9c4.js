var WebRTCPeerConnectionConstants = {},
    ZCWebRTCPeerConnectionUtil = {};
class RTCConnectionMonitor {
    constructor(e, t, i, n = {
        connectionErrorCB: () => {},
        networkAdapterActionCB: () => {},
        hasStreamCallback: () => {}
    }) {
        this._id = e, this._connection = t, this._candidates = i, this._connectionErrorCB = n.connectionErrorCB, this._networkAdapterActionCB = n.networkAdapterActionCB, this._hasStreamCallback = n.hasStreamCallback, this._selectedCandidateInfo = void 0, this._isUDPBlocked = !1, this._timeout = void 0, this._networkAdapterConfiguration = WebRTCPeerConnectionConstants.networkAdapterConfig, this._appliedOptimizationLevels = {}, this._optimizationLogs = {
            LEVEL_1_OPTIMIZATION: 0,
            LEVEL_2_OPTIMIZATION: 0,
            LEVEL_3_OPTIMIZATION: 0,
            LEVEL_4_OPTIMIZATION: 0
        }, this._audioRttArr = [], this._packetLossObj = {
            audio: [],
            video: [],
            screen: []
        }
    }
    updateCandidates(e) {
        this._candidates.concat(e)
    }
    setNetworkAdapterConfiguration(e) {
        this._networkAdapterConfiguration = e
    }
    getOptimizationLogs() {
        return this._optimizationLogs
    }
    pushStats(e) {
        let t = ZCMediaConstants.connectionStats.overallScore.instancesTaken;
        if (e.audio && this._hasStreamCallback(this._id, WebRTCUserMedia.streamTypes.AUDIO_ONLY)) {
            let i = e.audio.upStream[ZCMediaConstants.connectionStats.metrics.packetLoss][t - 1] || 0;
            this._packetLossObj.audio.push(isFinite(i) ? i : 0), this._audioRttArr.push(e.audio.upStream[ZCMediaConstants.connectionStats.metrics.rtt][t - 1] || 0)
        }
        if (e.video && this._hasStreamCallback(this._id, WebRTCUserMedia.streamTypes.VIDEO_ONLY)) {
            let i = e.video.upStream[ZCMediaConstants.connectionStats.metrics.packetLoss][t - 1] || 0;
            this._packetLossObj.video.push(isFinite(i) ? i : 0)
        }
        if (e.screen && this._hasStreamCallback(this._id, WebRTCUserMedia.streamTypes.SCREEN)) {
            let i = e.screen.upStream[ZCMediaConstants.connectionStats.metrics.packetLoss][t - 1] || 0;
            this._packetLossObj.screen.push(isFinite(i) ? i : 0)
        }
        if (this._packetLossObj.audio.length === this._networkAdapterConfiguration.total_samples_for_calculation) {
            let e = this._packetLossObj.audio.reduce((e, t) => e + t, 0) / this._packetLossObj.audio.length;
            if (e > this._networkAdapterConfiguration.packet_loss_metric.avg) {
                if (this._packetLossObj.video.length > 0) {
                    let e = this._packetLossObj.video.reduce((e, t) => e + t, 0) / this._packetLossObj.video.length;
                    if (this._appliedOptimizationLevels.level1) this._appliedOptimizationLevels.level2 || (this._appliedOptimizationLevels.level2 = WebRTCPeerConnectionConstants.optimizations.level2, this._optimizationLogs.LEVEL_2_OPTIMIZATION++, this._networkAdapterActionCB(this._id, {
                        level: 2,
                        action: WebRTCPeerConnectionConstants.optimizations.opr.SET,
                        event: WebRTCPeerConnectionConstants.optimizations.level2
                    }));
                    else {
                        var i = this._calculateOptimalBitrate(e, "video");
                        this._appliedOptimizationLevels.level1 = WebRTCPeerConnectionConstants.optimizations.level1, this._optimizationLogs.LEVEL_1_OPTIMIZATION++, this._networkAdapterActionCB(this._id, {
                            level: 1,
                            action: WebRTCPeerConnectionConstants.optimizations.opr.SET,
                            bitrate: i,
                            event: WebRTCPeerConnectionConstants.optimizations.level1
                        })
                    }
                } else if (this._packetLossObj.screen.length > 0) {
                    let e = this._packetLossObj.screen.reduce((e, t) => e + t, 0) / this._packetLossObj.screen.length;
                    if (!this._appliedOptimizationLevels.level3) {
                        i = this._calculateOptimalBitrate(e, "screen");
                        this._appliedOptimizationLevels.level3 = WebRTCPeerConnectionConstants.optimizations.level3, this._optimizationLogs.LEVEL_3_OPTIMIZATION++, this._networkAdapterActionCB(this._id, {
                            level: 3,
                            action: WebRTCPeerConnectionConstants.optimizations.opr.SET,
                            bitrate: i,
                            event: WebRTCPeerConnectionConstants.optimizations.level3
                        })
                    }
                } else if (this._packetLossObj.audio.length > 0 && !this._appliedOptimizationLevels.level4) {
                    i = this._calculateOptimalBitrate(e, "audio");
                    this._appliedOptimizationLevels.level4 = WebRTCPeerConnectionConstants.optimizations.level4, this._optimizationLogs.LEVEL_4_OPTIMIZATION++, this._networkAdapterActionCB(this._id, {
                        level: 4,
                        action: WebRTCPeerConnectionConstants.optimizations.opr.SET,
                        bitrate: i,
                        event: WebRTCPeerConnectionConstants.optimizations.level4
                    })
                }
            } else 0 === e && (this._appliedOptimizationLevels.level1 && (delete this._appliedOptimizationLevels.level1, this._networkAdapterActionCB(this._id, {
                level: 1,
                action: WebRTCPeerConnectionConstants.optimizations.opr.RESET,
                event: WebRTCPeerConnectionConstants.optimizations.level1
            })), this._appliedOptimizationLevels.level2 && (delete this._appliedOptimizationLevels.level2, this._networkAdapterActionCB(this._id, {
                level: 2,
                action: WebRTCPeerConnectionConstants.optimizations.opr.RESET,
                event: WebRTCPeerConnectionConstants.optimizations.level2
            })), this._appliedOptimizationLevels.level3 && (delete this._appliedOptimizationLevels.level3, this._networkAdapterActionCB(this._id, {
                level: 3,
                action: WebRTCPeerConnectionConstants.optimizations.opr.RESET,
                event: WebRTCPeerConnectionConstants.optimizations.level3
            })), this._appliedOptimizationLevels.level4 && (delete this._appliedOptimizationLevels.level4, this._networkAdapterActionCB(this._id, {
                level: 4,
                action: WebRTCPeerConnectionConstants.optimizations.opr.RESET,
                event: WebRTCPeerConnectionConstants.optimizations.level4
            })));
            this._packetLossObj = {
                audio: [],
                video: [],
                screen: []
            }
        }
    }
    _calculateOptimalBitrate(e, t) {
        const i = this._networkAdapterConfiguration.bitrate[t].max,
            n = this._networkAdapterConfiguration.bitrate[t].min,
            a = this._networkAdapterConfiguration.packet_loss_metric.avg,
            s = this._networkAdapterConfiguration.packet_loss_metric.bad;
        let o = i;
        return o = e >= a && e < s ? i - (e - a) / (s - a) * (i - n) : n
    }
    _setCandidatePairInfo(e) {
        this._selectedCandidateInfo = e
    }
    _isConnectedViaTCP() {
        if (this._selectedCandidateInfo) return "relay" === this._selectedCandidateInfo.local_candidate_type && this._selectedCandidateInfo.local_candidate_port <= WebRTCPeerConnectionConstants.relayUDPPort
    }
    isUDPBlocked() {
        return this._isUDPBlocked
    }
    start() {
        this._timeout = setTimeout(() => {
            var e = this._connection.iceConnectionState === WebRTCPeerConnectionConstants.iceConnectionStates.CLOSED,
                t = this._connection.iceConnectionState === WebRTCPeerConnectionConstants.iceConnectionStates.CONNECTED;
            if (this._candidates && this._connection && !e) {
                for (var i = !1, n = !1, a = 0; a < this._candidates.length; a++) {
                    var s = this._candidates[a];
                    if ("relay" === s.type && (i = !0, n = s.port > WebRTCPeerConnectionConstants.relayUDPPort)) return
                }
                if (i && !n) {
                    var o = function() {
                        t && this._selectedCandidateInfo && "relay" !== this._selectedCandidateInfo.local_candidate_type || (this._isUDPBlocked = !0, this._connectionErrorCB(this._id, {
                            code: WebRTCPeerConnectionConstants.connectionErrors.UDP_BLOCKING,
                            isConnectedViaTCP: t && this._isConnectedViaTCP()
                        }))
                    }.bind(this);
                    t ? WebRTCPeerConnectionStats.getSelectedCandidatePair(this._id, "ConnectionMonitor", this._connection, (e, t, i) => {
                        this._setCandidatePairInfo(i), o()
                    }) : o()
                }
            }
        }, 6e3)
    }
    stop() {
        clearTimeout(this._timeout)
    }
}
WebRTCPeerConnectionConstants = {
    iceConnectionStates: {
        CONNECTED: "connected",
        COMPLETED: "completed",
        DISCONNECTED: "disconnected",
        FAILED: "failed",
        CLOSED: "closed"
    },
    connectionTypes: {
        AUDIO_VIDEO: "audiovideo",
        AUDIO: "audio",
        VIDEO: "video",
        SCREEN: "screen",
        DATA_CHANNEL: "datachannel"
    },
    connectionModes: {
        UNIFIED: "unified",
        PLANB: "planB"
    },
    connectionErrors: {
        UDP_BLOCKING: "701"
    },
    relayUDPPort: 2e4,
    isUnifiedPlan: function(e) {
        return this.connectionModes.UNIFIED === e
    },
    isPlanB: function(e) {
        return this.connectionModes.PLANB === e
    },
    isAudioConnection: function(e) {
        return this.connectionTypes.AUDIO === e
    },
    isVideoConnection: function(e) {
        return this.connectionTypes.VIDEO === e
    },
    isScreenConnection: function(e) {
        return this.connectionTypes.SCREEN === e
    },
    isDataChannelConnection: function(e) {
        return this.connectionTypes.DATA_CHANNEL === e
    },
    isConnectionActive: function(e) {
        if (void 0 === e) return !1;
        var t = e.iceConnectionState;
        return t === this.iceConnectionStates.CONNECTED || t === this.iceConnectionStates.COMPLETED
    },
    isConnectionClosed: function(e) {
        return void 0 !== e && e.iceConnectionState === this.iceConnectionStates.CLOSED
    },
    processTypes: {
        INIT: "init",
        REINIT: "reinit",
        RESTART: "restart",
        RENEGOTIATE: "renegotiate"
    },
    isInit: function(e) {
        return this.processTypes.INIT === e
    },
    isRestart: function(e) {
        return this.processTypes.RESTART === e
    },
    isReInit: function(e) {
        return this.processTypes.REINIT === e
    },
    isRenegotiate: function(e) {
        return this.processTypes.RENEGOTIATE === e
    },
    networkAdapterConfig: {
        bitrate: {
            audio: {
                min: 128e3,
                max: 32e4
            },
            video: {
                min: 35e4,
                max: 1e6
            },
            screen: {
                min: 35e4,
                max: 1e6
            }
        },
        packet_loss_metric: {
            avg: 6,
            bad: 10
        },
        total_samples_for_calculation: 6
    },
    optimizations: {
        opr: {
            SET: 1,
            RESET: -1
        },
        level1: "videoBitrateReduction",
        level2: "muteUpStreamVideo",
        level3: "screenBitrateReduction",
        level4: "audioBitrateReduction"
    }
};
ZCWebRTCPeerConnectionUtil = {
    replaceStereoValuesInSdp: function(e) {
        e.sdp = e.sdp.replaceAll("useinbandfec=1", "useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=128000")
    },
    getRTPSenderOrReceiverForTrack: function(e = [], t) {
        if (t)
            for (var i = 0; i < e.length; i++) {
                var n = e[i];
                if (n.track && n.track.id === t.id) return n
            }
    },
    getConfiguration: function(e) {
        var t = {
            iceServers: e
        };
        return WebRTCUserMedia.isIcePrebindingSupported() && "undefined" != typeof Conference && Conference.isIcePrebindingEnabled() && (t.iceCandidatePoolSize = 6), t
    },
    getSyncedCurrentTime: function() {
        return "undefined" != typeof MediaUtil ? MediaUtil.getSyncedCurrentTime() : (new Date).getTime()
    }
};
var WebRTCPeerConnection = function(e, t, i, n, a, s, o, r, c, d, l, h) {
    this._id = e, this._hostId = t, this._mediaStreamContainer = a, this._handler = n, this._turnServer = s, this._userName = o, this._credential = r, this._audioRtpSenders = [], this._videoRtpSenders = [], this._screenRtpSenders = [], this._remoteSDP = l, this._localSDP = void 0, this._localSDPCreatedTime = -1, this._localIceCandidates = [], this._iceCandidatesGatheringTimer = void 0, this._remoteIceCandidates = h || [], this._isUpStream = d, this._stream = void 0, this._streamType = c, this._connectionType = i, this._processType = WebRTCPeerConnectionConstants.processTypes.INIT, this._isReconnecting = !1, this._reconnectTimer = void 0, this._reconnectInterval = void 0, this._canUpdateLocalIceCandidates = !1, this._initialize(this._processType)
};
WebRTCPeerConnection.prototype = {
    _addTracksInConnection: function() {
        void 0 !== this._stream && (WebRTCUserMedia.isScreenStreamType(this._streamType) ? this._addScreenTracksInConnection() : this._addAVTracksInConnection())
    },
    _addAVTracksInConnection: function() {
        this._addAudioTracksInConnection(), this._addVideoTracksInConnection()
    },
    _addAudioTracksInConnection: function() {
        this._stream.getTracks().forEach(function(e) {
            "audio" === e.kind && this._audioRtpSenders.push(this._connection.addTrack(e, this._stream))
        }.bind(this))
    },
    _addVideoTracksInConnection: function() {
        this._stream.getTracks().forEach(function(e) {
            "video" === e.kind && this._videoRtpSenders.push(this._connection.addTrack(e, this._stream))
        }.bind(this))
    },
    _addScreenTracksInConnection: function() {
        this._stream.getTracks().forEach(function(e) {
            this._screenRtpSenders.push(this._connection.addTrack(e, this._stream))
        }.bind(this))
    },
    _removeAVTracksInConnection: function() {
        this._removeAudioTracksInConnection(), this._removeVideoTracksInConnection()
    },
    _removeAudioTracksInConnection: function() {
        this._audioRtpSenders.forEach(function(e) {
            this._connection.removeTrack(e)
        }.bind(this)), this._audioRtpSenders = []
    },
    _removeVideoTracksInConnection: function() {
        this._videoRtpSenders.forEach(function(e) {
            this._connection.removeTrack(e)
        }.bind(this)), this._videoRtpSenders = []
    },
    _initialize: function(e) {
        this._processType = e, WebRTCPeerConnectionConstants.isReInit(e) && (this._closeConnection(), clearInterval(this._reconnectInterval), this._reconnectInterval = void 0), this._connection || (this._connection = new RTCPeerConnection(this._getConfiguration())), this._bindEventHandlers(e), this._isUpStream ? (!WebRTCPeerConnectionConstants.isReInit(e) && this._stream || (this._stream = WebRTCUserMedia.getStream(this._streamType), this._addTracksInConnection()), this._createOffer(e)) : this._createAnswer()
    },
    _bindEventHandlers: function(e) {
        var t = !1,
            i = this._connection,
            n = function(i) {
                var n = i.candidate;
                if (n)
                    if (t) {
                        if (this._localIceCandidates.push(n.candidate), !this._canUpdateLocalIceCandidates) return;
                        if (!this._iceCandidatesGatheringTimer) {
                            var a = function() {
                                this._handler.updateIceCandidates(this._id, this._connectionType, this._hostId, this._localIceCandidates, e, this._isUpStream), this._localIceCandidates = [], this._iceCandidatesGatheringTimer = void 0
                            }.bind(this);
                            this._iceCandidatesGatheringTimer = setTimeout(a, 1e3)
                        }
                    } else this._isUpStream ? WebRTCPeerConnectionConstants.isRenegotiate(e) || this._handler.sendOffer(this._id, this._connectionType, this._localSDP.sdp, n.candidate, e, this._streamType, {
                        localSDPCreatedTime: this._localSDPCreatedTime
                    }) : this._handler.sendAnswer(this._id, this._connectionType, this._localSDP.sdp, n.candidate, e, this._hostId, {
                        localSDPCreatedTime: this._localSDPCreatedTime
                    }), t = !0
            }.bind(this),
            a = function(t) {
                var n = i.iceConnectionState;
                if (WebRTCPeerConnectionConstants.iceConnectionStates.CONNECTED === n || WebRTCPeerConnectionConstants.iceConnectionStates.COMPLETED === n) this._processType = WebRTCPeerConnectionConstants.processTypes.INIT, this._isReconnecting = !1, clearInterval(this._reconnectInterval), this._reconnectInterval = void 0, clearTimeout(this._reconnectTimer), this._reconnectTimer = void 0, this._handler.handleConnected(this._id, this._connectionType, this._connection, this._hostId, this._streamType, this._isUpStream, e);
                else if (WebRTCPeerConnectionConstants.iceConnectionStates.FAILED === n) {
                    this._reconnect();
                    var a = this;
                    clearInterval(this._reconnectInterval), this._reconnectInterval = setInterval((function() {
                        a._reconnect()
                    }), 15e3)
                }
            }.bind(this),
            s = function(e) {
                void 0 === this._stream && (this._stream = e.streams[0], this._stream._setType(this._streamType), this._mediaStreamContainer && (this._mediaStreamContainer.setStream(this._stream), this._mediaStreamContainer.playStream(function() {
                    this._handler.handlePlay(this._connectionType, this._hostId, this._stream, this._streamType, this._mediaStreamContainer)
                }.bind(this), function(e) {
                    "function" == typeof this._handler.handlePlayError && this._handler.handlePlayError(e)
                }.bind(this))), "function" == typeof this._handler.handleTrack && this._handler.handleTrack(this._id, e.track, e.transceiver, e.streams[0], this._hostId))
            }.bind(this);
        i.onicecandidate = n, i.oniceconnectionstatechange = a, i.ontrack = s;
        var o = function(t) {
            var n = i.connectionState;
            WebRTCPeerConnectionConstants.iceConnectionStates.CONNECTED === n ? (this._processType = WebRTCPeerConnectionConstants.processTypes.INIT, this._isReconnecting = !1, clearInterval(this._reconnectInterval), this._reconnectInterval = void 0, clearTimeout(this._reconnectTimer), this._reconnectTimer = void 0, this._handler.handleConnected(this._id, this._connectionType, this._connection, this._hostId, this._streamType, this._isUpStream, e)) : WebRTCPeerConnectionConstants.iceConnectionStates.FAILED === n && (this._reconnect(), clearInterval(this._reconnectInterval), this._reconnectInterval = setInterval(function() {
                this._reconnect()
            }.bind(this), 15e3))
        }.bind(this);
        i.onconnectionstatechange = o
    },
    addTrack: function(e, t) {
        this._isUpStream && (this._stream = e, this._streamType = e._getType(), WebRTCUserMedia.isAudioStreamType(t) ? 0 === this._audioRtpSenders.length && this._addAudioTracksInConnection() : WebRTCUserMedia.isVideoStreamType(t) ? 0 === this._videoRtpSenders.length && this._addVideoTracksInConnection() : WebRTCUserMedia.isScreenStreamType(t) && 0 === this._screenRtpSenders.length && this._addScreenTracksInConnection(), this._renegotiate())
    },
    _renegotiate: function() {
        this._isUpStream && (this._isReconnecting = !1, clearInterval(this._reconnectInterval), clearTimeout(this._reconnectTimer), this._initialize(WebRTCPeerConnectionConstants.processTypes.RENEGOTIATE))
    },
    _reconnect: function() {
        if (!this._isReconnecting) {
            this._isReconnecting = !0;
            var e = WebRTCPeerConnectionConstants.processTypes.RESTART;
            "function" == typeof this._handler.getUpStreamReconnectProcessType && (e = this._handler.getUpStreamReconnectProcessType()), this._processType = e, clearTimeout(this._reconnectTimer);
            var t = this;
            this._reconnectTimer = setTimeout((function() {
                t._isReconnecting = !1
            }), 1e4), this._isUpStream && this._initialize(e), this._handler.reconnectStream(this._id, this._connectionType, this._hostId, this._streamType, this._isUpStream)
        }
    },
    reinit: function() {
        this._initialize(WebRTCPeerConnectionConstants.processTypes.REINIT)
    },
    replaceTracks: function(e, t) {
        this._isUpStream && (this._stream = e, this._streamType = e._getType(), WebRTCUserMedia.isAudioVideoStreamType(t) ? this._removeAVTracksInConnection() : WebRTCUserMedia.isAudioStreamType(t) ? (this._removeAudioTracksInConnection(), this._addAudioTracksInConnection()) : (this._removeVideoTracksInConnection(), this._addVideoTracksInConnection()), this.reinit())
    },
    _createOffer: function(e) {
        var t = {};
        WebRTCPeerConnectionConstants.isRestart(e) && (t.iceRestart = !0, this._localIceCandidates = []);
        var i = this._connection,
            n = this;
        i.createOffer(t).then((function(t) {
            n._localSDPCreatedTime = ZCWebRTCPeerConnectionUtil.getSyncedCurrentTime(), n._replaceOfferValues(t), n._localSDP = t, i.setLocalDescription(t), WebRTCPeerConnectionConstants.isRenegotiate(e) && n._handler.handleRenegotiate(n._id, n._connectionType, t.sdp, n._streamType)
        }))
    },
    _replaceOfferValues: function(e) {
        WebRTCPeerConnectionConstants.isScreenConnection(this._connectionType) && this._stream._hasAudioTrack() && ZCWebRTCPeerConnectionUtil.replaceStereoValuesInSdp(e)
    },
    _createAnswer: function() {
        var e = {},
            t = this._connection,
            i = this;
        t.setRemoteDescription(this._getRTCSessionDescriptionObj("offer", this._remoteSDP)).then((function() {
            t.createAnswer(e).then((function(e) {
                i._localSDPCreatedTime = ZCWebRTCPeerConnectionUtil.getSyncedCurrentTime(), i._localSDP = e, t.setLocalDescription(e)
            }))
        }))
    },
    setRemoteDescription: function(e, t, i) {
        i && i.length && (this._remoteIceCandidates = i);
        var n = this;
        this._connection.setRemoteDescription(this._getRTCSessionDescriptionObj(e, t)).then((function() {
            n.addRemoteIceCandidates()
        }))
    },
    addRemoteIceCandidates: function() {
        var e = this._connection;
        this._remoteIceCandidates.forEach((function(t) {
            e.addIceCandidate(new RTCIceCandidate(t))
        })), this._remoteIceCandidates = []
    },
    updateLocalIceCandidates: function() {
        this._canUpdateLocalIceCandidates = !0, this._handler.updateIceCandidates(this._id, this._connectionType, this._hostId, this._localIceCandidates, this._processType, this._isUpStream), this._localIceCandidates = []
    },
    _getRTCSessionDescriptionObj: function(e, t) {
        return new RTCSessionDescription({
            type: e,
            sdp: t
        })
    },
    _closeConnection: function() {
        clearTimeout(this._reconnectTimer), this._reconnectTimer = void 0, clearTimeout(this._iceCandidatesGatheringTimer), this._iceCandidatesGatheringTimer = void 0, this._connection && (this._connection.close(), this._connection = void 0), this._isReconnecting = !1, this._canUpdateLocalIceCandidates = !1, this._audioRtpSenders = [], this._videoRtpSenders = [], this._screenRtpSenders = [], this._remoteSDP = void 0, this._localSDP = void 0, this._localSDPCreatedTime = -1, this._localIceCandidates = [], this._remoteIceCandidates = []
    },
    close: function(e) {
        clearInterval(this._reconnectInterval), this._reconnectInterval = void 0, this._closeConnection(), !e && this._stream && this._isUpStream && WebRTCUserMedia.closeStream(this._stream._getType())
    },
    _getConfiguration: function() {
        var e = this._turnServer,
            t = this._userName,
            i = this._credential,
            n = [];
        return e.forEach((function(e) {
            n.push({
                urls: e,
                username: t,
                credential: i
            })
        })), ZCWebRTCPeerConnectionUtil.getConfiguration(n)
    },
    setBitRate: function(e) {
        this._videoRtpSenders.forEach((function(t) {
            var i = t.getParameters();
            i.encodings || (i.encodings = [{}]), i.encodings[0].maxBitrate = 1e3 * e, t.setParameters(i)
        }))
    }
};
var WebRTCPeerConnectionStats = {},
    ZCConnectionStatsScoreCalculator = {},
    CallStrengthAnalyser = {},
    CallStrengthStatsConstants = {};
WebRTCPeerConnectionStats = function() {
    var e = {},
        t = void 0,
        i = "standard",
        n = {
            connectedTransportKeyIncludes: "RTCTransport_",
            candidateKeyIncludes: "RTCIceCandidate",
            hostCandidateTypeValue: "host",
            candidatePairType: "candidate-pair",
            codec: "codec",
            selectedCandidatePair: "selected-candidate-pair",
            candidatePairSelectedState: "succeeded",
            localCandidateType: "local-candidate",
            remoteCandidateType: "remote-candidate",
            transportStatType: "transport",
            mediaTypeStr: "kind",
            contentTypeStr: "contentType",
            ssrcKeyName: "ssrc",
            ssrcListKeyName: "ssrclist",
            subTypeKeyName: "subTypeKey"
        },
        a = {
            "outbound-rtp": {
                subTypeKey: "kind",
                kind: {
                    audio: "RTCOutboundRTPAudioStream_",
                    video: "RTCOutboundRTPVideoStream_",
                    screen: "RTCOutboundRTPScreenStream_"
                }
            },
            "inbound-rtp": {
                subTypeKey: "kind",
                kind: {
                    audio: "RTCInboundRTPAudioStream_",
                    video: "RTCInboundRTPVideoStream_",
                    screen: "RTCInboundRTPScreenStream_"
                }
            },
            "remote-inbound-rtp": {
                subTypeKey: "kind",
                kind: {
                    audio: "RTCRemoteInboundRtpAudioStream_",
                    video: "RTCRemoteInboundRtpVideoStream_",
                    screen: "RTCRemoteInboundRtpScreenStream_"
                }
            },
            "media-source": {
                subTypeKey: "kind",
                kind: {
                    audio: "RTCMediaSourceAudioStream_"
                }
            }
        },
        s = {
            RTCLiveIceCandidatePair: {
                availableOutgoingBitrate: "availableoutgoingbitrate",
                availableIncomingBitrate: "availableincomingbitrate",
                totalRoundTripTime: "totalrtt",
                currentRoundTripTime: "rtt",
                packetsDiscardedOnSend: "packetsdiscardedonsend",
                responsesSent: "responsessent",
                responsesReceived: "responsesreceived",
                packetsSent: "packetssent",
                packetsReceived: "packetsreceived",
                bytesSent: "bytessent",
                bytesReceived: "bytesreceived"
            },
            RTCOutboundRTPAudioStream_: {
                packetsSent: "audiopacketssent",
                bytesSent: "audiobytessent",
                nackCount: "upstreamaudionackcount"
            },
            RTCRemoteInboundRtpAudioStream_: {
                jitter: "sendaudiojitter",
                packetsLost: "sendaudiopacketlost"
            },
            RTCMediaSourceAudioStream_: {
                audioLevel: "upstreamaudiolevel"
            },
            RTCInboundRTPAudioStream_: {
                bytesReceived: "audiobytesreceived",
                jitter: "recvaudiojitter",
                packetsLost: "recvaudiopacketlost",
                audioLevel: "downstreamaudiolevel",
                packetsReceived: "audiopacketsreceived",
                fecPacketsReceived: "fecpacketsreceived",
                fecPacketsDiscarded: "fecpacketsdiscarded",
                nackCount: "downstreamaudionackcount"
            },
            RTCOutboundRTPVideoStream_: {
                packetsSent: "videopacketssent",
                bytesSent: "videobytessent",
                frameWidth: "upstreamframewidth",
                frameHeight: "upstreamframeheight",
                framesPerSecond: "upstreamframespersecond",
                pliCount: "upstreamplicount",
                nackCount: "upstreamvideonackcount",
                framesSent: "videoframessent",
                qualityLimitationReason: "qualitylimitationreason",
                framesEncoded: "framesencoded",
                totalEncodeTime: "totalencodetime",
                totalPacketSendDelay: "totalpacketsenddelay"
            },
            RTCRemoteInboundRtpVideoStream_: {
                jitter: "sendvideojitter",
                packetsLost: "sendvideopacketlost"
            },
            RTCInboundRTPVideoStream_: {
                jitter: "recvvideojitter",
                packetsLost: "recvvideopacketlost",
                bytesReceived: "videobytesreceived",
                packetsReceived: "videopacketsreceived",
                framesDecoded: "framesdecoded",
                frameWidth: "downstreamframewidth",
                frameHeight: "downstreamframeheight",
                framesPerSecond: "downstreamframespersecond",
                totalDecodeTime: "totaldecodetime",
                totalInterFrameDelay: "totalinterframedelay",
                framesReceived: "framesreceived",
                framesDropped: "framesdropped",
                pliCount: "downstreamplicount",
                nackCount: "downstreamvideonackcount",
                pauseCount: "pausecount",
                totalPausesDuration: "totalpausesduration",
                freezeCount: "freezecount",
                totalFreezesDuration: "totalfreezesduration"
            },
            RTCOutboundRTPScreenStream_: {
                packetsSent: "screenpacketssent",
                bytesSent: "screenbytessent",
                frameWidth: "screenupstreamframewidth",
                frameHeight: "screenupstreamframeheight",
                framesPerSecond: "screenupstreamframespersecond",
                pliCount: "screenupstreamplicount",
                nackCount: "screenupstreamnackcount",
                framesSent: "screenframessent",
                qualityLimitationReason: "screenqualitylimitationreason",
                framesEncoded: "screenframesencoded",
                totalEncodeTime: "screentotalencodetime",
                totalPacketSendDelay: "screentotalpacketsenddelay"
            },
            RTCRemoteInboundRtpScreenStream_: {
                jitter: "sendscreenjitter",
                packetsLost: "sendscreenpacketlost"
            },
            RTCInboundRTPScreenStream_: {
                jitter: "recvscreenjitter",
                packetsLost: "recvscreenpacketlost",
                bytesReceived: "screenbytesreceived",
                packetsReceived: "screenpacketsreceived",
                framesDecoded: "screenframesdecoded",
                frameWidth: "screendownstreamframewidth",
                frameHeight: "screendownstreamframeheight",
                framesPerSecond: "screendownstreamframespersecond",
                totalDecodeTime: "screentotaldecodetime",
                totalInterFrameDelay: "screentotalinterframedelay",
                framesReceived: "screenframesreceived",
                framesDropped: "screenframesdropped",
                pliCount: "screendownstreamplicount",
                nackCount: "screendownstreamnackcount",
                pauseCount: "screenpausecount",
                totalPausesDuration: "screentotalpausesduration",
                freezeCount: "screenfreezecount",
                totalFreezesDuration: "screentotalfreezesduration"
            }
        },
        o = ["RTCOutboundRTPVideoStream_", "RTCRemoteInboundRtpAudioStream_", "RTCRemoteInboundRtpVideoStream_", "RTCRemoteInboundRtpScreenStream_", "RTCInboundRTPAudioStream_", "RTCInboundRTPVideoStream_", "RTCInboundRTPScreenStream_", "RTCOutboundRTPAudioStream_", "RTCOutboundRTPScreenStream_"],
        r = function(e, t, i, n, a) {
            this._moduleId = t, this._id = e, this._connection = i, this._connectionMetaData = n, this._timeVsStats = {}, this._networkInfo = {}, this._candidatePairInfo = {}, this._networkInfoCallBack = a.networkInfoCallBack, this._updateStatsCallBack = a.updateStatsCallBack, this._statsCallBack = a.statsCallBack, this._candidatePairInfoCallBack = a.candidatePairInfoCallBack, this._additionalDataCallBack = a.additionalDataCallBack, this._hasSentNetworkInfo = !1, this._hasSentCandidatePairInfo = !1, this._statsObjectMaxSize = 30, this._statsGatheringIntervalTime = 1e3, void 0 !== n && (void 0 !== n.statsObjectMaxSize && (this._statsObjectMaxSize = n.statsObjectMaxSize), void 0 !== n.statsGatheringIntervalTime && (this._statsGatheringIntervalTime = n.statsGatheringIntervalTime), void 0 !== n.connectionType && (this._connectionType = n.connectionType))
        };

    function c() {
        return "undefined" != typeof $ZCUtil && "undefined" != typeof RTCStatsReport
    }

    function d(e) {
        return (function(e) {
            return void 0 !== e && e.type === n.localCandidateType
        }(e) || function(e) {
            return void 0 !== e && e.type === n.remoteCandidateType
        }(e)) && e.candidateType === n.hostCandidateTypeValue
    }

    function l(e) {
        return function(e) {
            return void 0 !== e && e.type === n.candidatePairType && (void 0 === e.nominated || e.nominated)
        }(e) && e.state === n.candidatePairSelectedState
    }

    function h(e) {
        return void 0 !== e && e.type === n.transportStatType
    }

    function u(e) {
        return void 0 !== e && e.type === n.codec
    }

    function p(e) {
        let t = {};
        return t[n.selectedCandidatePair] = !0, rtcpStatsIdMapping = m(e, t), rtcpStatsIdMapping[n.selectedCandidatePair]
    }

    function m(e, t) {
        let i = {};
        var a = void 0,
            s = void 0,
            o = e.values(),
            r = void 0;
        do {
            var c = (r = o.next()).value;
            if (t[n.selectedCandidatePair] && (l(c) ? (s = c.id, i[n.selectedCandidatePair] = s) : h(c) && (s = c.selectedCandidatePairId, i[n.selectedCandidatePair] = s)), t[n.codec] && u(c) && (a = c.id, i[n.codec] = a), Object.keys(i).length >= Object.keys(t).length) break
        } while (!r.done);
        return i
    }

    function v(e, t, i, r) {
        var c = {},
            d = function(e, t, i) {
                for (var o in s)
                    if (-1 !== e.indexOf(o) || e.toUpperCase() === o.toUpperCase()) return o;
                for (var r in a)
                    if (t.type === r) {
                        var c = a[r],
                            d = c[n.subTypeKeyName];
                        if (void 0 !== d) {
                            let e = c[d];
                            return void 0 !== i ? e[i] : e[t[d]]
                        }
                        return c
                    }
            }(e, t, r);
        if (d) {
            var l = i && function(e) {
                    return -1 !== o.indexOf(e)
                }(d),
                h = s[d];
            for (var u in h)
                if (l) {
                    var p = t[n.ssrcKeyName];
                    void 0 === c[p] && (c[n.ssrcKeyName] = p, c[p] = {}), c[p][h[u]] = t[u]
                } else c[h[u]] = t[u]
        }
        return c
    }

    function C(e, t, i, n) {
        var a = t.get(i.localCandidateId),
            s = t.get(i.remoteCandidateId),
            o = a.networkType,
            r = a.ip || a.address,
            c = void 0,
            l = (s.ip || s.address, void 0);
        void 0 !== (l = d(a) ? a : function(e, t) {
            var i;
            return e.forEach((function(e, n) {
                d(e) && e.networkType === t && (i = e)
            })), i
        }(t, o)) && (c = l.ip || l.address), e.setNetworkInfo(o, c, r, a, s, n), e.sendNetworkInfo()
    }

    function f(e, t, i) {
        var n = t.get(i.localCandidateId),
            a = t.get(i.remoteCandidateId);
        e.setCandidatePairInfo(n, a), e.sendCandidatePairInfo()
    }

    function _(e) {
        var t = e.getConnection();
        WebRTCPeerConnectionConstants.isConnectionClosed(t) ? S(e.getId(), e.getModuleId()) : WebRTCPeerConnectionConstants.isConnectionActive(t) && t.getStats().then((function(t) {
            let i = {};
            i[n.selectedCandidatePair] = !0, i[n.codec] = !0;
            let s = m(t, i);
            var o = s[n.selectedCandidatePair],
                r = s[n.codec];
            if (void 0 !== o) {
                var c = void 0,
                    d = t.get(o);
                void 0 !== r && (c = t.get(r)), e.hasSentNetworkInfo() || C(e, t, d, c), e.hasSentCandidatePairInfo() || f(e, t, d);
                var l = e.isSSRCBased(),
                    h = {},
                    u = new Set,
                    p = v("RTCLiveIceCandidatePair", d, l);
                t.forEach((function(t, i) {
                    var s = void 0;
                    if (Object.keys(a).includes(t.type) && t[n.ssrcKeyName]) {
                        var o = t[n.ssrcKeyName];
                        s = h[o], o && !s && (s = t[n.mediaTypeStr], !WebRTCPeerConnectionConstants.isVideoConnection(s) || t[n.contentTypeStr] !== CallStrengthStatsConstants.statType.screen && e._connectionType !== WebRTCPeerConnectionConstants.connectionTypes.SCREEN || (s = WebRTCPeerConnectionConstants.connectionTypes.SCREEN), h[o] = s)
                    }
                    var r = v(i, t, l, s);
                    l && r[n.ssrcKeyName] && (u.add(r[n.ssrcKeyName]), delete r[n.ssrcKeyName]), ZCJQuery.extend(!0, p, r)
                })), l && (p[n.ssrcListKeyName] = [...u]);
                var _ = "undefined" != typeof $ZCUtil ? $ZCUtil.getSyncedCurrentTime() : Date.now();
                if ("function" == typeof e._additionalDataCallBack) {
                    let t = e._additionalDataCallBack();
                    void 0 !== t && Object.assign(p, t)
                }
                e.updateAndSendStats(_, p, t)
            }
        }))
    }

    function S(i, n) {
        var a = e[n];
        if (void 0 !== a) {
            var s = a[i];
            s && (s._connectionMetaData.lastChunk = !0, s._sendStats()), delete a[i], 0 === Object.keys(a).length && delete e[n]
        }
        0 === Object.keys(e).length && (clearInterval(t), t = void 0)
    }
    return r.prototype = {
        setNetworkInfo: function(e, t, i, n, a, s) {
            var o = n.ip || n.address;
            void 0 !== n.port && (o = o + ":" + n.port);
            var r = a.ip || a.address;
            void 0 !== a.port && (r = r + ":" + a.port), this._networkInfo = {
                network_type: e,
                private_ip: t,
                public_ip: i,
                local_ip: o,
                remote_ip: r,
                local_protocol: n.protocol,
                remote_protocol: a.protocol,
                local_candidate_type: n.candidateType,
                remote_candidate_type: a.candidateType
            }, void 0 !== s && (this._networkInfo.codec = s.mimeType.split("/")[1])
        },
        setCandidatePairInfo: function(e, t) {
            this._candidatePairInfo = {
                remote_ip: t.ip || t.address,
                local_ip: e.ip || e.address,
                remote_candidate_type: t.candidateType,
                local_candidate_type: e.candidateType,
                remote_candidate_port: t.port,
                local_candidate_port: e.port
            }
        },
        getId: function() {
            return this._id
        },
        getModuleId: function() {
            return this._moduleId
        },
        getConnection: function() {
            return this._connection
        },
        isSSRCBased: function() {
            return void 0 !== this._connectionMetaData && this._connectionMetaData.isSSRCBased
        },
        hasSentNetworkInfo: function() {
            return this._hasSentNetworkInfo
        },
        getStatsGatheringIntervalTime: function() {
            return this._statsGatheringIntervalTime
        },
        sendNetworkInfo: function() {
            "function" == typeof this._networkInfoCallBack && this._networkInfoCallBack(this._id, this._moduleId, this._networkInfo, i, this._connectionMetaData), this._hasSentNetworkInfo = !0
        },
        hasSentCandidatePairInfo: function() {
            return this._hasSentCandidatePairInfo
        },
        sendCandidatePairInfo: function() {
            "function" == typeof this._candidatePairInfoCallBack && this._candidatePairInfoCallBack(this._id, this._moduleId, this._candidatePairInfo), this._hasSentCandidatePairInfo = !0
        },
        updateAndSendStats: function(e, t, i) {
            this._timeVsStats[e] = t, "function" == typeof this._statsCallBack && this._statsCallBack(e, t, i, this._connectionMetaData), Object.keys(this._timeVsStats).length === this._statsObjectMaxSize && this._sendStats()
        },
        _sendStats: function() {
            "function" == typeof this._updateStatsCallBack && this._updateStatsCallBack(this._id, this._moduleId, this._timeVsStats, i, this._connectionMetaData), this._timeVsStats = {}
        }
    }, {
        isStatsSupported: c,
        initiateGathering: function(i, n, a, s, o) {
            if (void 0 !== i && void 0 !== n && void 0 !== a && (void 0 !== o.statsCallBack || void 0 !== o.networkInfoCallBack && void 0 !== o.updateStatsCallBack)) {
                if (!c()) return a.getStats().then(function(e) {
                    var t = p(e);
                    f(new r(i, n, a, s, o), e, e.get(t))
                }.bind(this)), void
                function(e, t, i) {
                    "function" == typeof i.errorCallback && i.errorCallback(e, t)
                }(i, n, o);
                var d = e[n] || {};
                d[i] = new r(i, n, a, s, o), e[n] = d, void 0 === t && (t = setInterval((function() {
                    ! function() {
                        for (var t in e) {
                            var i = e[t];
                            for (var n in i) {
                                var a = i[n];
                                try {
                                    _(a)
                                } catch (e) {}
                            }
                        }
                    }()
                }), d[i].getStatsGatheringIntervalTime()))
            }
        },
        stopGathering: S,
        getConnectionIds: function(t) {
            let i = e[t];
            return void 0 !== i ? Object.keys(i) : []
        },
        getSelectedCandidatePair: function(e, t, i, n) {
            e && t && i && "function" == typeof n && i.getStats().then(function(a) {
                var s = p(a);
                f(new r(e, t, i, void 0, {
                    candidatePairInfoCallBack: n
                }), a, a.get(s))
            }.bind(this))
        }
    }
}(), ZCConnectionStatsScoreCalculator = (() => {
    const e = ["upStream", "downStream"],
        t = {
            packetLoss: "packetLoss",
            rtt: "rtt",
            jitter: "jitter"
        },
        i = {
            GOOD: "good",
            POOR: "poor",
            AVERAGE: "average",
            values: {
                GOOD: 2,
                AVERAGE: 1,
                POOR: 0
            }
        },
        n = 5,
        a = 2,
        s = {
            good: 1,
            poor: 5
        },
        o = {
            good: 200,
            poor: 300
        },
        r = {
            good: 10,
            poor: 30
        };
    var c = e => {
        let c = 0,
            d = Object.values(t);
        return d.every(t => 0 === e[t].length) ? "-" : (d.forEach(n => {
            c += ((e, n) => {
                let a = n.filter(e => "-" !== e);
                if (!a.length) return i.values.GOOD;
                let c = a.reduce((e, t) => e + t, 0);
                switch (c /= a.length, e) {
                    case t.packetLoss:
                        return c < s[i.GOOD] ? i.values.GOOD : c >= s[i.POOR] ? i.values.POOR : i.values.AVERAGE;
                    case t.rtt:
                        return c < o[i.GOOD] ? i.values.GOOD : c > o[i.POOR] ? i.values.POOR : i.values.AVERAGE;
                    case t.jitter:
                        return c <= r[i.GOOD] ? i.values.GOOD : c > r[i.POOR] ? i.values.POOR : i.values.AVERAGE;
                    default:
                        return ""
                }
            })(n, e[n])
        }), c >= n ? i.GOOD : c <= a ? i.POOR : i.AVERAGE)
    };
    return {
        scoreConstants: i,
        getOverallScoreForEachMediaStream: t => {
            var i = {};
            return Object.keys(t).forEach(n => {
                let a = t[n];
                e.forEach((e, t) => {
                    let s = a[e],
                        o = c(s);
                    i[n + (0 === t ? "_up" : "_dn")] = o
                })
            }), i
        }
    }
})(), CallStrengthStatsConstants = {
    maxThresholdScore: 10,
    callStrengthCalcInterval: 1e4,
    statsGatheringInterval: 1e3,
    audioDownStreamScore: {
        paramsCount: 2,
        lostParamsCount: 1
    },
    audioUpStreamScore: {
        paramsCount: 2,
        lostParamsCount: 0
    },
    videoDownStreamScore: {
        paramsCount: 3,
        lostParamsCount: 1
    },
    videoUpStreamScore: {
        paramsCount: 3,
        lostParamsCount: 0
    },
    rtt: {
        maxThreshold: .8,
        minThreshold: .3
    },
    jitter: {
        audioMinThreshold: .03,
        videoMinThreshold: .2
    },
    packetSent: {
        maxThreshold: 40,
        minThreshold: 30
    },
    bytesSent: {
        maxThreshold: 2500,
        minThreshold: 1500
    },
    frames: {
        maxDecodeValue: 7,
        delayThreshold: .15
    },
    video: {
        maxEncodingDelay: .15,
        maxPacketSentDelay: .05
    },
    candidatePair: "candidate-pair",
    mediaTrackReceiver: "RTCMediaStreamTrack_receiver",
    mediaTrackSender: "sender",
    rtpType: {
        outBound: "outbound-rtp",
        inBound: "inbound-rtp"
    },
    statType: {
        audio: "audio",
        video: "video",
        screen: "screenshare"
    }
}, (CallStrengthAnalyser = function(e, t, i) {
    this._id = e, this._peerConnection = t, this._statType = void 0, this._statsGatheringTimer = void 0, this._updateScoreTimer = void 0, this._callBacks = i, this._prevAudioBytesSent = 0, this._prevAudioPacketsSent = 0, this._prevAudioPacketsReceived = 0, this._prevAudioPacketsLost = 0, this._currentAudioPacketsReceived = 0, this._currentAudioPacketsLost = 0, this._prevVideoFramesDecoded = 0, this._prevVideoInterFrameDelay = 0, this._prevVideoPacketSendDelay = 0, this._prevVideoDecodeTime = 0, this._prevVideoEncodeTime = 0, this._prevVideoPacketsSent = 0, this._prevVideoPacketsLost = 0, this._prevVideoPacketsReceived = 0, this._prevVideoFramesSent = 0, this._prevVideoFramesLost = 0, this._prevVideoFramesReceived = 0, this._prevVideoFramesEncoded = 0, this._prevVideoJitterBufferDelay = 0, this._prevVideoJitterBufferEmittedCount = 0, this._currentVideoPacketsLost = 0, this._currentVideoPacketsReceived = 0, this._currentVideoFramesLost = 0, this._currentVideoFramesReceived = 0, this._lastAudioPacketReceivedTimestamp = 0, this._lastVideoPacketReceivedTimestamp = 0, this._rttArray = [], this._audioJitterBufferArray = [], this._audioPacketsSentArray = [], this._audioBytesSentArray = [], this._framesDecodedArray = [], this._videoJitterBufferArray = [], this._interFrameDelayArray = [], this._decodeTimeArray = [], this._framesSentArray = [], this._videoFramesEncodingTimeArray = [], this._videoPacketSendDelayTimeArray = [], this._callStrengthScore = void 0, this._lastUpdatedTime = (new Date).getTime(), this._initiate()
}).prototype = {
    getId: function() {
        return this._id
    },
    getConnection: function() {
        return this._peerConnection
    },
    _setStatType: function(e) {
        this._statType = e
    },
    _getCurrentStatType: function() {
        return this._statType
    },
    _hasVideoStat: function() {
        return this._getCurrentStatType() === CallStrengthStatsConstants.statType.video
    },
    _setScore: function(e) {
        this._callStrengthScore = e
    },
    getScore: function() {
        return this._callStrengthScore
    },
    _initiate: function() {
        if (void 0 !== this._id && void 0 !== this._peerConnection && void 0 !== this._callBacks && void 0 !== this._callBacks.updateCallQuality) return "undefined" == typeof $ZCUtil || !$ZCUtil.Browser.isChrome() && !$ZCUtil.Browser.isOpera() ? "function" == typeof this._callBacks.handleFallback ? this._callBacks.handleFallback() : void 0 : void this._startAnalysis()
    },
    _startAnalysis: function() {
        clearInterval(this._statsGatheringTimer), this._statsGatheringTimer = setInterval(this._initiateStatsGathering.bind(this), CallStrengthStatsConstants.statsGatheringInterval), this._updateScoreTimer = setInterval(this._updateScore.bind(this), CallStrengthStatsConstants.callStrengthCalcInterval)
    },
    stopAnalysis: function() {
        clearInterval(this._statsGatheringTimer), clearInterval(this._updateScoreTimer)
    },
    _initiateStatsGathering: function() {
        this._peerConnection.getStats().then(function(e) {
            this._gatherStats(e)
        }.bind(this))
    },
    _gatherStats: function(e) {
        e.forEach(function(e) {
            e.type === CallStrengthStatsConstants.candidatePair && e.nominated && this._rttArray.push(e.currentRoundTripTime), e.kind === CallStrengthStatsConstants.statType.audio ? this._gatherAudioStat(e) : e.kind === CallStrengthStatsConstants.statType.video && this._gatherVideoStat(e), void 0 !== e.kind && this._setStatType(e.kind)
        }.bind(this))
    },
    _gatherAudioStat: function(e) {
        e.type === CallStrengthStatsConstants.rtpType.outBound && void 0 !== e.mediaSourceId && (this._audioPacketsSentArray.push(e.packetsSent - this._prevAudioPacketsSent), this._audioBytesSentArray.push(e.bytesSent - this._prevAudioBytesSent), this._prevAudioPacketsSent = e.packetsSent, this._prevAudioBytesSent = e.bytesSent), e.type === CallStrengthStatsConstants.rtpType.inBound && e.lastPacketReceivedTimestamp - this._lastAudioPacketReceivedTimestamp > 0 && (this._audioJitterBufferArray.push(e.jitter), this._currentAudioPacketsLost = e.packetsLost, this._currentAudioPacketsReceived = e.packetsReceived, this._lastAudioPacketReceivedTimestamp = e.lastPacketReceivedTimestamp)
    },
    _gatherVideoStat: function(e) {
        if (e.id.includes(CallStrengthStatsConstants.mediaTrackSender) && (this._framesSentArray.push(e.framesSent - this._prevVideoFramesSent), this._prevVideoFramesSent = e.framesSent), e.id.includes(CallStrengthStatsConstants.mediaTrackReceiver)) {
            this._currentVideoFramesReceived = e.framesReceived, this._currentVideoFramesLost = e.framesDropped;
            var t = e.jitterBufferDelay,
                i = e.jitterBufferEmittedCount;
            0 != this._prevVideoJitterBufferEmittedCount && (t -= this._prevVideoJitterBufferDelay, i -= this._prevVideoJitterBufferEmittedCount), this._videoJitterBufferArray.push(t / i), this._prevVideoJitterBufferDelay = e.jitterBufferDelay, this._prevVideoJitterBufferEmittedCount = e.jitterBufferEmittedCount
        }
        if (e.type === CallStrengthStatsConstants.rtpType.outBound && void 0 !== e.mediaSourceId && (this._videoFramesEncodingTimeArray.push((e.totalEncodeTime - this._prevVideoEncodeTime) / (e.framesEncoded - this._prevVideoFramesEncoded)), this._videoPacketSendDelayTimeArray.push((e.totalPacketSendDelay - this._prevVideoPacketSendDelay) / (e.packetsSent - this._prevVideoPacketsSent)), this._prevVideoFramesEncoded = e.framesEncoded, this._prevVideoEncodeTime = e.totalEncodeTime, this._prevVideoPacketSendDelay = e.totalPacketSendDelay, this._prevVideoPacketsSent = e.packetsSent), e.type === CallStrengthStatsConstants.rtpType.inBound && e.lastPacketReceivedTimestamp - this._lastVideoPacketReceivedTimestamp > 0) {
            this._currentVideoPacketsLost = e.packetsLost, this._currentVideoPacketsReceived = e.packetsReceived;
            var n = e.framesDecoded - this._prevVideoFramesDecoded;
            this._framesDecodedArray.push(n), this._interFrameDelayArray.push((e.totalInterFrameDelay - this._prevVideoInterFrameDelay) / n), this._decodeTimeArray.push((e.totalDecodeTime - this._prevVideoDecodeTime) / n), this._prevVideoFramesDecoded = e.framesDecoded, this._prevVideoDecodeTime = e.totalDecodeTime, this._prevVideoInterFrameDelay = e.totalInterFrameDelay, this._lastVideoPacketReceivedTimestamp = e.lastPacketReceivedTimestamp
        }
    },
    _resetStats: function() {
        this._rttArray = [], this._audioJitterBufferArray = [], this._audioPacketsSentArray = [], this._audioBytesSentArray = [], this._framesDecodedArray = [], this._videoJitterBufferArray = [], this._interFrameDelayArray = [], this._decodeTimeArray = [], this._framesSentArray = [], this._videoFramesEncodingTimeArray = [], this._videoPacketSendDelayTimeArray = []
    },
    getCurrentStats: function() {
        CallStrengthStatsConstants.maxThresholdScore = Math.round(((new Date).getTime() - this._lastUpdatedTime) / 1e3);
        var e = this._analyseDownStreamConnectionStrength(),
            t = this._analyseUpStreamConnectionStrength();
        return CallStrengthStatsConstants.maxThresholdScore = 10, {
            downstreamStrength: e,
            upstreamStrength: t
        }
    },
    _updateScore: function() {
        this._lastUpdatedTime = (new Date).getTime();
        var e = this._analyseDownStreamConnectionStrength(),
            t = this._analyseUpStreamConnectionStrength(),
            i = CallStrengthStatsConstants.maxThresholdScore,
            n = i / 2,
            a = i * CallStrengthStatsConstants.audioDownStreamScore.paramsCount + n * CallStrengthStatsConstants.audioDownStreamScore.lostParamsCount,
            s = i * CallStrengthStatsConstants.audioUpStreamScore.paramsCount + n * CallStrengthStatsConstants.audioUpStreamScore.lostParamsCount,
            o = Math.round((a - e.audioJitterScore - e.rttScore - e.audioPacketsLostPercentage) / (a / 5)),
            r = Math.round((s - t.audioPacketsSentScore - t.audioBytesSentScore) / (s / 5));
        (e.audioJitterScore >= .6 * i || e.rttScore >= .6 * i || e.audioPacketsLostPercentage >= .4 * n) && o > 3 && (o = 3);
        var c = {
            upStreamScore: {
                audioUpStreamPerformanceScore: r
            },
            performanceScore: {
                audioPerformanceScore: o
            }
        };
        if (this._hasVideoStat()) {
            var d = i * CallStrengthStatsConstants.videoDownStreamScore.paramsCount + n * CallStrengthStatsConstants.videoDownStreamScore.lostParamsCount,
                l = i * CallStrengthStatsConstants.videoUpStreamScore.paramsCount + n * CallStrengthStatsConstants.videoUpStreamScore.lostParamsCount,
                h = Math.round((d - e.videoJitterScore - e.frameScore - e.interFrameDelayScore - e.videoFramesLostPercentage) / (d / 5)),
                u = Math.round((l - t.frameSentScore - t.videoEncodingScore - t.videoPacketSendDelayScore) / (l / 5));
            (e.videoJitterScore >= .6 * i || e.frameScore >= .6 * i || e.interFrameDelayScore >= .6 * i || e.videoFramesLostPercentage >= .4 * n) && h > 3 && (h = 3), c.upStreamScore.videoUpStreamPerformanceScore = u, c.performanceScore.videoPerformanceScore = h
        }
        var p = {
            downstreamStrength: e,
            upstreamStrength: t
        };
        this._setScore(c), this._callBacks.updateCallQuality(this.getId(), c, p), this._resetStats()
    },
    _analyseDownStreamConnectionStrength: function() {
        var e = this._currentAudioPacketsReceived - this._prevAudioPacketsReceived,
            t = this._currentAudioPacketsLost - this._prevAudioPacketsLost,
            i = {
                audioPacketsLostPercentage: this._calculateLossPercentage(e, t),
                audioJitterScore: this._calculateJitterScore(this._audioJitterBufferArray, CallStrengthStatsConstants.jitter.audioMinThreshold),
                rttScore: this._calculateRTTScore()
            };
        if (this._prevAudioPacketsReceived = this._currentAudioPacketsReceived, this._prevAudioPacketsLost = this._currentAudioPacketsLost, this._hasVideoStat()) {
            var n = this._currentVideoPacketsReceived - this._prevVideoPacketsReceived,
                a = this._currentVideoPacketsLost - this._prevVideoPacketsLost,
                s = this._currentVideoFramesReceived - this._prevVideoFramesReceived,
                o = this._currentVideoFramesLost - this._prevVideoFramesLost;
            i.videoPacketsLostPercentage = this._calculateLossPercentage(n, a), i.videoFramesLostPercentage = this._calculateLossPercentage(s, o), i.videoJitterScore = this._calculateJitterScore(this._videoJitterBufferArray, CallStrengthStatsConstants.jitter.videoMinThreshold), i.frameScore = this._calculateFrameScore(this._framesDecodedArray), i.interFrameDelayScore = this._calculateFrameDelayScore(), this._prevVideoPacketsReceived = this._currentVideoPacketsReceived, this._prevVideoPacketsLost = this._currentVideoPacketsLost, this._prevVideoFramesReceived = this._currentVideoFramesReceived, this._prevVideoFramesLost = this._currentVideoFramesLost
        }
        return i
    },
    _analyseUpStreamConnectionStrength: function() {
        var e = {
            audioPacketsSentScore: this._calculateAudioUpStreamScore(this._audioPacketsSentArray, CallStrengthStatsConstants.packetSent.minThreshold, CallStrengthStatsConstants.packetSent.maxThreshold),
            audioBytesSentScore: this._calculateAudioUpStreamScore(this._audioBytesSentArray, CallStrengthStatsConstants.bytesSent.minThreshold, CallStrengthStatsConstants.bytesSent.maxThreshold)
        };
        if (this._hasVideoStat()) {
            var t = this._calculateFrameScore(this._framesSentArray);
            e.videoEncodingScore = this._calculateVideoUpStreamDelayScore(this._videoFramesEncodingTimeArray, CallStrengthStatsConstants.video.maxEncodingDelay), e.videoPacketSendDelayScore = this._calculateVideoUpStreamDelayScore(this._videoPacketSendDelayTimeArray, CallStrengthStatsConstants.video.maxPacketSentDelay), e.frameSentScore = t > CallStrengthStatsConstants.maxThresholdScore ? CallStrengthStatsConstants.maxThresholdScore : t
        }
        return e
    },
    _calculateRTTScore: function() {
        var e = 0,
            t = this._rttArray.length;
        for (var i of (t < CallStrengthStatsConstants.maxThresholdScore && (e = CallStrengthStatsConstants.maxThresholdScore - t), this._rttArray)) null == i || i > CallStrengthStatsConstants.rtt.maxThreshold ? e += 2 : i > CallStrengthStatsConstants.rtt.minThreshold && e++;
        return e > CallStrengthStatsConstants.maxThresholdScore ? CallStrengthStatsConstants.maxThresholdScore : e
    },
    _calculateJitterScore: function(e, t) {
        var i = 0,
            n = e.length;
        for (var a of (n < CallStrengthStatsConstants.maxThresholdScore && (i = CallStrengthStatsConstants.maxThresholdScore - n), e))(null == a || isNaN(a) || a > t) && i++;
        return i
    },
    _calculateFrameScore: function(e) {
        var t = 0,
            i = e.length;
        for (var n of (i < CallStrengthStatsConstants.maxThresholdScore && (t = CallStrengthStatsConstants.maxThresholdScore - i), e))(null == n || n < CallStrengthStatsConstants.frames.maxDecodeValue) && t++;
        return t
    },
    _calculateFrameDelayScore: function() {
        var e = 0,
            t = this._interFrameDelayArray.length;
        for (var i of (t < CallStrengthStatsConstants.maxThresholdScore && (e = CallStrengthStatsConstants.maxThresholdScore - t), this._interFrameDelayArray))(null == i || isNaN(i) || i > CallStrengthStatsConstants.frames.delayThreshold) && e++;
        return e
    },
    _calculateLossPercentage: function(e, t) {
        var i = CallStrengthStatsConstants.maxThresholdScore / 2;
        return null == t || null == e || 0 == e || isNaN(t) || isNaN(e) || (i = Math.round(t / e * CallStrengthStatsConstants.maxThresholdScore / 2)) > CallStrengthStatsConstants.maxThresholdScore / 2 && (i = CallStrengthStatsConstants.maxThresholdScore / 2), i
    },
    _calculateAudioUpStreamScore: function(e, t, i) {
        var n = 0,
            a = e.length;
        for (var s of (a < CallStrengthStatsConstants.maxThresholdScore && (n = CallStrengthStatsConstants.maxThresholdScore - a), e)) null == s || s < t ? n += 2 : s < i && n++;
        return n > CallStrengthStatsConstants.maxThresholdScore ? CallStrengthStatsConstants.maxThresholdScore : n
    },
    _calculateVideoUpStreamDelayScore: function(e, t) {
        var i = 0,
            n = e.length;
        for (var a of (n < CallStrengthStatsConstants.maxThresholdScore && (i = CallStrengthStatsConstants.maxThresholdScore - n), e))(null == a || a > t || isNaN(a)) && i++;
        return i > CallStrengthStatsConstants.maxThresholdScore ? CallStrengthStatsConstants.maxThresholdScore : i
    }
};
var AdhocCallBridge = {},
    ZCMediaDomUtil = {},
    ZCPIPManager = {},
    ZCMediaDialogs = {},
    ZCWMSEventSync = {},
    ZCMediaNetworkPredictor = {},
    ZCMediaNetworkPredictorImpl = {},
    ZCMediaTemplates = {},
    ZCMediaUtil = {},
    AVISCUtilBridge = {},
    ZCAudioProcessor = {},
    ZCTextToSpeechAPI = {},
    ZCAVStringCompressor = {};
class AVCliqDimensions {
    constructor(e = 0, t = 0, i = 0, n = 0) {
        this.xAxis = e, this.yAxis = t, this.width = i, this.height = n, this.margin = 0
    }
    clone() {
        return new AVCliqDimensions(this.xAxis, this.yAxis, this.width, this.height)
    }
    setMargin(e) {
        this.resetMargin(), this.margin = e, this._updateMargin()
    }
    resetMargin() {
        this.margin = -this.margin, this._updateMargin(), this.margin = 0
    }
    _updateMargin() {
        this.xAxis += this.margin, this.yAxis += this.margin, this.width -= 2 * this.margin, this.height -= 2 * this.margin
    }
    moveAxis(e = 0, t = 0) {
        this.xAxis += e, this.yAxis += t
    }
    resetAxis() {
        this.xAxis = 0, this.yAxis = 0
    }
    alterMeasurements(e = 0, t = 0) {
        this.width = e, this.height = t
    }
    fitWidthOnAspectRatio(e) {
        var t = this.width,
            i = this.height,
            n = t * e;
        n > t && (n = t), this.width = n, this.height = n / e, this.height > i && (this.height = i), this.xAxis += (t - n) / 2, this.yAxis += (i - this.height) / 2
    }
}
AdhocCallBridge = {
    attach: function(e) {
        var t = e.getAssociatedConferenceId(),
            i = ZCSmartConferenceImpl.getCurrentActiveSession();
        i && i.getId() === t && (i.subscribe(AdhocOneToOneCallHandler), e.subscribe(AdhocConferenceHandler))
    },
    detach: function(e) {
        var t = e.getAssociatedConferenceId(),
            i = ZCSmartConferenceImpl.getCurrentActiveSession();
        i && i.getId() === t && (i.unSubscribe(), e.unSubscribe())
    },
    publish: function(e, t, i) {
        e.hasSubscribed() && e.getSubscribedHandler()[t](e, i.associatedSessionId, i)
    }
}, ZCMediaDomUtil = {
    _isKeyBoardLockAPISupported: navigator.keyboard && null !== navigator.keyboard && "function" == typeof navigator.keyboard.lock,
    openFullScreen: function(e, t, i) {
        if (e) {
            var n = async function() {
                    if (ZCMediaDomUtil._isKeyBoardLockAPISupported) try {
                        await navigator.keyboard.lock(["Escape"])
                    } catch {}
                    "function" == typeof t && t(e);
                    ZCMediaDomUtil.bindFullScreenChangeListener(e, (function(e, t) {
                        if (!t && ZCMediaDomUtil._isKeyBoardLockAPISupported) try {
                            navigator.keyboard.unlock()
                        } catch {}
                        "function" == typeof i && i(e, t)
                    }))
                },
                a = (e.requestFullscreen || e.msRequestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullscreen).call(e);
            a ? a.then(n) : n()
        }
    },
    bindFullScreenChangeListener: function(e, t) {
        void 0 !== e.onfullscreenchange ? e.onfullscreenchange = function(i) {
            t(i, document.fullscreenElement === e)
        } : void 0 !== e.onMSFullscreenChange ? e.onMSFullscreenChange = function(i) {
            t(i, document.msFullscreenElement === e)
        } : void 0 !== e.onmozfullscreenchange ? e.onmozfullscreenchange = function(i) {
            t(i, document.mozFullScreenElement === e)
        } : void 0 !== e.onwebkitfullscreenchange && (e.onwebkitfullscreenchange = function(i) {
            t(i, document.webkitFullscreenElement === e)
        })
    },
    exitFullScreen: function(e, t) {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            var i = (document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen).call(document);
            "function" == typeof e && (i ? i.then(e) : e())
        } else "function" == typeof t && t()
    },
    getFullScreenElement: function() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
    },
    placeCursorAtEnd: function(e) {
        if (e.focus(), void 0 !== window.getSelection && void 0 !== document.createRange) {
            var t = document.createRange(),
                i = window.getSelection();
            t.selectNodeContents(e), t.collapse(!1), i.removeAllRanges(), i.addRange(t)
        } else if (void 0 !== document.body.createTextRange) {
            var n = document.body.createTextRange();
            n.moveToElementText(e), n.collapse(!1), n.select()
        }
    },
    limitInput: function(e) {
        var t = $WC.Util.isEmpty(event) ? void 0 : event.which,
            i = "TEXTAREA" === (e = ZCJQuery(e))[0].nodeName || "INPUT" === e[0].nodeName,
            n = i ? e.val() : e.text(),
            a = e.siblings("[category='charcount']"),
            s = a.attr("limit"),
            o = $WC.Util.isEmpty(t) || 27 != t ? s - n.length : s;
        a.html(o), a.toggleClass("zc-av-clr-R", o < 10), o < 0 && (i ? e.val(n.substring(0, s)) : e.text(n.substring(0, s)), this.placeCursorAtEnd(e[0]), a.html(0))
    },
    addLoadIcon: function(e) {
        if (!e.find("[av_async_loading]").length) {
            e.attr("style", "pointer-events:none; text-decoration:none; color:transparent !important;");
            var t = (MediaUtil.isAVLibraryLoadedInChatbar() ? "zc-av-" : "") + "reqprocess_anim";
            e.prepend('<span av_async_loading class="' + t + '"></span>')
        }
    },
    removeLoadIcon: function(e) {
        e.length && (e.removeAttr("style"), e.find("[av_async_loading]").remove())
    },
    removeHtmlAndAddTickMark: function(e) {
        void 0 !== e && e.html("").addClass("msi-ticktwo")
    }
}, ZCPIPManager = function() {
    const e = {
        pipOverlay: '<div class="avcliq-pip-container flexM" id="avcliq-pip-overlay">\n\t\t\t\t\t\t<div class="flexM fdirC avcliq-pip-card">\n\t\t\t\t\t\t    <div class="avcliq-pip-icon zcf-pip"></div>\n\t\t\t\t\t\t    <div class="avcliq-pip-btn-cont">\n\t\t\t\t\t\t    \t{{content}}\n\t\t\t\t\t\t        <div class="zcl-btn-xs zcl-btn-neg--primary mL10" {{custom_attribute}} purpose="exitPIP">{{btn_text}}</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>'
    };
    var t = void 0,
        i = void 0;
    return {
        isSupported: n,
        getPIPOverlay: function(t) {
            return $WC.template.replace(e.pipOverlay, {
                $content: "avcliq.media.pip.active",
                $btn_text: "common.close",
                custom_attribute: t
            })
        },
        toggleCamInPIP: function(e) {
            document.pictureInPictureElement && a() && navigator.mediaSession.setCameraActive(!e)
        },
        toggleMicInPIP: function(e) {
            document.pictureInPictureElement && a() && navigator.mediaSession.setMicrophoneActive(!e)
        },
        paintCanvasAndOpenPip: async function(e, i, a, r, c) {
            if ($canvasElem = ZCJQuery(e), !n() || !e || !$canvasElem.is("canvas")) return;
            e.width = i.width, e.height = i.height,
                function(e, i) {
                    try {
                        if (t) return;
                        var n = `var paintInCanvasTimer;\n\t\t\t\t\t\t\tonmessage = function(e) {\n\t\t\t\t\t\t\t\tif(e.data == 'start') {\n\t\t\t\t\t\t\t\t\tclearInterval(paintInCanvasTimer);\n\t\t\t\t\t\t\t\t\tpaintInCanvasTimer = setInterval(function(){ postMessage('start pip'); },${ZCMediaConstants.pip.paintInterval});\t\t//NO I18N\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\telse if(e.data == 'stop') {\n\t\t\t\t\t\t\t\t\tclearInterval(paintInCanvasTimer);\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}`,
                            a = new Blob([n]),
                            s = window.URL.createObjectURL(a);
                        (t = new Worker(s)).onmessage = function(t) {
                            e()
                        }, t.postMessage("start")
                    } catch (e) {
                        o(), "function" == typeof i && i()
                    }
                }((function() {
                    a()
                }));
            const d = e.getVideoElement(ZCMediaConstants.pip.videoFps);
            d.muted = !0, await d.play(), s(d, r, c)
        },
        openPictureInPicture: s,
        exitPictureInPicture: function(e, t) {
            if (!(e = e || i)) return;
            if (!document.pictureInPictureEnabled && !e.webkitSupportsPresentationMode) return;
            var n = function() {
                "function" == typeof t && t()
            };
            o(), "function" == typeof document.exitPictureInPicture ? document.pictureInPictureElement ? document.exitPictureInPicture().then(n) : n() : void 0 !== e && "function" == typeof e.webkitSetPresentationMode && "picture-in-picture" === e.webkitPresentationMode && (e.webkitSetPresentationMode("inline"), n())
        }
    };

    function n() {
        return document.pictureInPictureEnabled && $ZCUtil.Browser.isChrome()
    }

    function a() {
        return void 0 !== navigator.mediaSession && "function" == typeof navigator.mediaSession.setCameraActive
    }

    function s(e, t, s = {}) {
        var o = ZCJQuery(e);
        if (n() && e && o.is("video") && document.pictureInPictureElement !== e) {
            var r = function() {
                    "function" == typeof t && t(e)
                },
                c = function(e, t) {
                    a() && ("function" == typeof s.onCamToggle && (navigator.mediaSession.setCameraActive(!s.isVideoMuted()), navigator.mediaSession.setActionHandler("togglecamera", t ? function(e) {
                        var t = s.isVideoMuted();
                        s.onCamToggle(t), navigator.mediaSession.setCameraActive(t)
                    } : null)), "function" == typeof s.onMicToggle && (navigator.mediaSession.setMicrophoneActive(!s.isAudioMuted()), navigator.mediaSession.setActionHandler("togglemicrophone", t ? function() {
                        var e = s.isAudioMuted();
                        s.onMicToggle(e), navigator.mediaSession.setMicrophoneActive(e)
                    } : null)), "function" == typeof s.onHangup && navigator.mediaSession.setActionHandler("hangup", t ? function() {
                        s.onHangup(), navigator.mediaSession.setMicrophoneActive(!1), navigator.mediaSession.setCameraActive(!1)
                    } : null)), "function" == typeof s.onChange && s.onChange(e, t)
                },
                d = function(e) {
                    "function" == typeof s.onResize && s.onResize(e)
                };
            "function" == typeof e.requestPictureInPicture ? (o.one("enterpictureinpicture", (function(e) {
                e.currentTarget.setPIP(), c(e, !0), i = e.originalEvent.pictureInPictureWindow, "function" == typeof s.onResize && i.addEventListener("resize", d)
            })), o.one("leavepictureinpicture", (function(e) {
                e.currentTarget.resetPIP(), void 0 !== i && i.removeEventListener("resize", d), c(e, !1), i = void 0
            })), e.requestPictureInPicture().then(r)) : "function" == typeof e.webkitSetPresentationMode && (e.onwebkitpresentationmodechanged = function(t) {
                c(t, "picture-in-picture" === e.webkitPresentationMode)
            }, e.webkitSetPresentationMode("picture-in-picture"), r())
        }
    }

    function o() {
        t && (t.postMessage("stop"), t.terminate(), t.onmessage = void 0, t = void 0)
    }
}(), ZCPIPUtil = {
    _pipImageCache: {},
    _pipIconContent: {
        Web: {
            library: "\ue911",
            native: "\uea3f"
        },
        Mobile: {
            library: "\ue90f",
            native: "\ue983"
        }
    },
    showPIPOverlay: function(e, t) {
        e.append(ZCPIPManager.getPIPOverlay(t))
    },
    removePIPOverlay: function(e) {
        e.find("#avcliq-pip-overlay").remove()
    },
    paintBackground: function(e, t, i) {
        e.fillStyle = t, e.fillRect(i.xAxis, i.yAxis, i.width, i.height)
    },
    getIconContent: function(e, t) {
        var i = this._pipIconContent[e];
        return i ? t ? i.library : i.native : ""
    },
    paintMainBackground: function(e, t) {
        var i = e.canvas,
            n = {
                radius: 60,
                xAxis: i.width / 2 + 10,
                yAxis: i.height / 2 + 10
            },
            a = {
                radius: 300,
                xAxis: i.width / 2,
                yAxis: i.height / 2
            },
            s = e.createRadialGradient(n.xAxis, n.yAxis, n.radius, a.xAxis, a.yAxis, a.radius);
        s.addColorStop(1, "#246378"), s.addColorStop(0, "#1d2f4f"), this.paintBackground(e, s, t)
    },
    paintEachVideoInPIP: function(e, t, i, n) {
        e.canvas;
        if (n.setMargin(2), this.paintBackground(e, "rgba(0,0,0,0.4)", n), i.muted) n.moveAxis(n.width / 2, n.height / 2), ZCPIPUtil.drawUserImage(e, i.userId, i.name, n, 100);
        else {
            var a = t.find("video")[0];
            n.fitWidthOnAspectRatio(a.getAspectRatio()), i.mirror ? this.mirrorAndPaintVideo(e, a, n) : e.drawImage(a, n.xAxis, n.yAxis, n.width, n.height)
        }
    },
    applyCanvasDimension: function(e, t) {
        var i = e.canvas;
        t.width !== i.width && (i.width = t.width), t.height !== i.height && (i.height = t.height)
    },
    drawText: function(e, t, i, n = {}) {
        var a = e.measureText(t).width,
            s = n.maxWidth || e.canvas.width;
        if (a > s) {
            var o = (a - s) / e.measureText(t[t.length - 1]).width;
            t = t.slice(0, t.length - o - 4) + "..."
        }
        e.font = n.font || "bold 24px Lato", e.textAlign = n.align || "start", e.fillStyle = n.color || "#FFF", e.textBaseline = n.baseline || "alphabetic", e.fillText(t, i.xAxis, i.yAxis)
    },
    drawCircle: function(e, t, i) {
        e.beginPath(), e.arc(t.xAxis, t.yAxis, i, 0, 2 * Math.PI), e.fillStyle = "rgba(0,0,0,0.4)", e.fill(), e.lineWidth = 6, e.strokeStyle = "#f3a83b", e.stroke()
    },
    drawUserImage: function(e, t, i, n, a) {
        this.drawCircle(e, n, a);
        var s = this._pipImageCache[t];
        if (s) {
            if ("loading" === s.state || "error" === s.state) return void this.drawText(e, i, n, {
                align: "center",
                baseline: "middle",
                maxWidth: 2 * a
            });
            this.drawCircularImage(e, s.img, n, a)
        } else {
            this.drawText(e, i, n, {
                align: "center",
                baseline: "middle",
                maxWidth: 2 * a
            });
            var o = new Image;
            o.crossOrigin = "anonymous", fetch(this.getCorsImageUrl(t), {
                credentials: "include"
            }).then(e => e.blob()).then(e => {
                o.src = URL.createObjectURL(e), this._pipImageCache[t].img = o, this._pipImageCache[t].state = "loaded"
            }), o.onload = () => {
                URL.revokeObjectURL(o.src)
            }, o.onerror = () => {
                this._pipImageCache[t].state = "error"
            }, this._pipImageCache[t] = {
                img: void 0,
                state: "loading"
            }
        }
    },
    drawCircularImage: function(e, t, i, n) {
        e.save(), e.clip();
        var a, s, o = t.naturalWidth / t.naturalHeight;
        t.naturalWidth < t.naturalHeight ? s = (a = 2 * n) / o : a = (s = 2 * n) * o, e.imageSmoothingEnabled = !0, e.drawImage(t, i.xAxis - a / 2, i.yAxis - s / 2, a, s), e.restore()
    },
    getCorsImageUrl: function(e) {
        return MediaUtil.BRIDGE.Users.getImgUrlById(e, "original") + "&domain=" + window.location.host
    },
    mirrorAndPaintVideo: function(e, t, i) {
        e.save(), e.scale(-1, 1), e.drawImage(t, -1 * (i.xAxis + i.width), i.yAxis, i.width, i.height), e.restore()
    },
    drawRoundedCornerRectangle: function(e, t, i, n, a) {
        i = "number" == typeof i ? {
            tl: i,
            tr: i,
            br: i,
            bl: i
        } : {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0,
            ...i
        }, e.beginPath(), e.moveTo(t.xAxis + i.tl, t.yAxis), e.lineTo(t.xAxis + t.width - i.tr, t.yAxis), e.quadraticCurveTo(t.xAxis + t.width, t.yAxis, t.xAxis + t.width, t.yAxis + i.tr), e.lineTo(t.xAxis + t.width, t.yAxis + t.height - i.br), e.quadraticCurveTo(t.xAxis + t.width, t.yAxis + t.height, t.xAxis + t.width - i.br, t.yAxis + t.height), e.lineTo(t.xAxis + i.bl, t.yAxis + t.height), e.quadraticCurveTo(t.xAxis, t.yAxis + t.height, t.xAxis, t.yAxis + t.height - i.bl), e.lineTo(t.xAxis, t.yAxis + i.tl), e.quadraticCurveTo(t.xAxis, t.yAxis, t.xAxis + i.tl, t.yAxis), e.closePath(), n && (e.fillStyle = n, e.fill()), a && (e.strokeStyle = a, e.stroke())
    }
}, ZCMediaDialogs = {
    showMediaActionConsentPopup: function(e) {
        $WC.$Win.isExist("media_action_consent_popup") || MediaUtil.createPopup({
            id: "media_action_consent_popup",
            class: "modalwindow modalwindow2 zc-av-w30",
            header: ZCMediaTemplates.getConsentPopupHeaderHtml(e.consentCntKey),
            html: ZCMediaTemplates.getConsentPopupBodyHtml({
                contentKey: e.primaryBtnCntKey,
                purpose: e.primaryBtnPurpose,
                attribute: e.primaryBtnAttr
            }, {
                contentKey: "avcliq.common.cancel",
                purpose: "closeMediaActionConsentPopup",
                attribute: "mediamodulebuttons"
            })
        })
    },
    showUDPBlockedInfo: function() {
        if (!$WC.$Win.isExist("udp_blocked_info")) {
            var e = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.ServerConstants.AV_UDP_IP_WHITELISTING_DOC : $zcg._AV_UDP_IP_WHITELISTING_DOC,
                t = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants._cssClasses : $zcg._cssClasses;
            MediaUtil.createDialog({
                id: "udp_blocked_info",
                version: 2,
                class: "zcdalogbx zcbg_mask alert_dialog zc-av-device-switch-popup",
                headerhtml: $WC.$Dlg.frameHeaderHTML({
                    header: MediaUtil.getResource("avcliq.media.udp.blocked.header")
                }),
                bodyhtml: $WC.$Dlg.frameBodyInfoHTML({
                    info: [MediaUtil.getResource("avcliq.media.udp.blocked.info", ["zc-av-hyperlink", e])]
                }),
                buttons: [$WC.$Dlg.getButtonObj(MediaUtil.getResource("common.okgotit"), t.SECONDARY_BTN)]
            }, !0)
        }
    }
}, ZCWMSEventSync = {
    _receivedEventIds: [],
    pushEventId: function(e) {
        1e3 === this._receivedEventIds.length && this._receivedEventIds.shift(), e && this._receivedEventIds.push(e)
    },
    isDuplicateEvent: function(e) {
        return e && this._receivedEventIds.includes(e)
    }
}, (ZCMediaNetworkPredictor = function(e, t) {
    this._id = e, this._updateUserNetworkCallback = t, this._predictionCallbackInterval = void 0, this._initialize()
}).prototype = {
    _initialize: function() {
        "function" == typeof this._updateUserNetworkCallback && (clearInterval(this._predictionCallbackInterval), this._predictionCallbackInterval = setInterval(this.predictUserNetwork.bind(this), ZCMediaNetworkPredictorImpl.PREDICTION_INTERVAL), ZCMediaNetworkPredictorImpl.start(this._id))
    },
    predictUserNetwork: function() {
        var e = ZCMediaNetworkPredictorImpl.states.GOOD,
            t = ZCMediaNetworkPredictorImpl.getRecentHttpRequestRtt(),
            i = ZCMediaNetworkPredictorImpl.getCDNPollingRtt(),
            n = {
                recentHttpReqRtt: t,
                CDNPollingRtt: i,
                WmsRtt: ZCMediaNetworkPredictorImpl.getWMSRtt()
            };
        i > ZCMediaNetworkPredictorImpl.CDN_RTT_MAX_THRESHOLD && (e = ZCMediaNetworkPredictorImpl.states.POOR), this._updateUserNetworkCallback(e, n, this._id)
    },
    updateId: function(e) {
        ZCMediaNetworkPredictorImpl.updateAssociatedId(this._id, e), this._id = e
    },
    stop: function() {
        clearInterval(this._predictionCallbackInterval), this._predictionCallbackInterval = void 0, ZCMediaNetworkPredictorImpl.stop(this._id)
    }
}, ZCMediaNetworkPredictorImpl = function() {
    var e = {},
        t = [],
        i = [],
        n = [],
        a = void 0,
        s = void 0,
        o = void 0,
        r = void 0;
    return {
        NETWORK_RTT_MAX_THRESHOLD: 800,
        CDN_RTT_MAX_THRESHOLD: 500,
        WMS_RTT_MAX_THRESHOLD: 500,
        PREDICTION_INTERVAL: 5e3,
        POLLING_INTERVAL: 5e3,
        CDN_RTT_POLLING_TIMEOUT: 3e3,
        addHttpRequestInfo: function(e) {
            e.status === MediaCallConstants.request.status.SUCCESS && (3 === t.length && t.shift(), t.push({
                rtt: e.endTime - e.startTime
            }))
        },
        startCDNPolling: function(e, t) {
            var n = new Date,
                s = void 0 !== MediaUtil.BRIDGE ? MediaUtil.BRIDGE.Constants.IMGDEFAULTSTATICURL : $zcg._IMGDEFAULTSTATICURL;
            fetch(s + "/av_network_prediction.png", {
                mode: "cors",
                cache: "no-store"
            }).then((function(t) {
                200 === t.status && (a = new Date - n, i.push(a), "function" == typeof e && e(a))
            })).catch((function() {
                "function" == typeof t && t()
            }))
        },
        startWmsPingPongPolling: function() {
            if (void 0 !== MediaUtil.BRIDGE && "function" == typeof MediaUtil.BRIDGE.getWmsRtt && MediaUtil.BRIDGE.isWMSConnected()) {
                n.push(ZCMediaNetworkPredictorImpl.WMS_RTT_MAX_THRESHOLD);
                try {
                    MediaUtil.BRIDGE.getWmsRtt((function(e) {
                        s = e, n.pop(), n.push(s)
                    }))
                } catch (e) {}
            }
        },
        getRecentHttpRequestRtt: function() {
            var e = t[t.length - 1];
            return void 0 !== e && e.rtt
        },
        states: {
            GOOD: 1,
            POOR: 0
        },
        isPoorNetwork: function(e) {
            return e === this.states.POOR
        },
        start: function(t) {
            e[t] = t, void 0 === o && (o = setInterval(this.startPolling.bind(this), this.POLLING_INTERVAL), this.startPolling())
        },
        startPolling: function() {
            this.startWmsPingPongPolling(), this.startCDNPolling()
        },
        stop: function(r) {
            delete e[r], 0 === Object.keys(e).length && (clearInterval(o), o = void 0, t = [], i = [], n = [], a = void 0, s = void 0)
        },
        updateAssociatedId: function(t, i) {
            delete e[t], e[i] = i
        },
        getCDNPollingRtt: function() {
            return a
        },
        getInitialCDNRtt: function() {
            return i.length ? i[0] : 0
        },
        getCurrentCDNRtt: function(e) {
            var t = function(t) {
                clearTimeout(r), e(t)
            };
            this.startCDNPolling(t, t), r = setTimeout((function() {
                t(ZCMediaNetworkPredictorImpl.CDN_RTT_POLLING_TIMEOUT)
            }), this.CDN_RTT_POLLING_TIMEOUT)
        },
        getWMSRtt: function() {
            return s
        },
        getAvgCdnRtt: function() {
            var e = i.length;
            if (e > 0) return i.reduce((e, t) => e + t, 0) / e
        },
        getAvgWmsRtt: function() {
            var e = n.length;
            if (e > 0) return n.reduce((e, t) => e + t, 0) / e
        }
    }
}(), ZCMediaTemplates = {
    templates: {
        consentDialogHeader: '<div class="zc-av-zcl-img zc-av-xl zc-av-flexM zc-av-mAuto zc-av-bg-warning">\n\t\t\t\t<em class="zcf-warning zc-av-clrW zc-av-mT2"></em>\n\t\t\t</div>\n\t        <div class="zc-av-flexM zc-av-font18 ac-av-fontB zc-av-mT20">{{header_cnt}}</div>',
        consentDialogBody: '<div class="zc-av-p20 zc-av-flexC zc-av-justifyE">\n\t\t\t\t<div class="zc-av-zcl-btn zc-av-zcl-btn--secondary" {{secondary_btn_attr}} purpose="{{secondary_btn_purpose}}">{{secondary_btn_cnt}}</div>\n\t\t\t    <div class="zc-av-zcl-btn zc-av-zcl-btn--primary zc-av-bg-warning zc-av-mL20 zc-av-mR10" {{primary_btn_attr}} purpose="{{primary_btn_purpose}}">{{primary_btn_cnt}}</div>\n\t\t\t</div>',
        loader: '<div id="{{id}}" class="zc-vhcenter zc-av-textC {{custom_class}} {{hide_class}}"><div class="zcl-rloader-bg"><div class="zcl-rloader-sm"></div></div><div class="zc-av-mT10 {{custom_class}}-text" content>{{content}}</div></div>',
        avLoader: '<div class="AV-call-state-overlay">\n\t\t\t\t<div class="zc-av-call-conn-loader zc-av-textC">\n\t\t\t\t\t<div class="zc-av-zcl-rloader-bg">\n\t\t\t\t\t\t<div class="zc-av-zcl-rloader-sm"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="zc-av-mT10 zc-av-font16 zc-av-fontB">{{loader_content}}</div>\n\t\t\t\t</div>\n\t\t\t</div>'
    },
    getConsentPopupHeaderHtml: function(e) {
        return $WC.template.replace(this.templates.consentDialogHeader, {
            $header_cnt: e
        })
    },
    getConsentPopupBodyHtml: function(e, t) {
        return $WC.template.replace(this.templates.consentDialogBody, {
            secondary_btn_attr: t.attribute,
            secondary_btn_purpose: t.purpose,
            $secondary_btn_cnt: t.contentKey,
            primary_btn_attr: e.attribute,
            primary_btn_purpose: e.purpose,
            $primary_btn_cnt: e.contentKey
        })
    },
    getLoaderHtml: (e, t, i, n) => $WC.template.replace(ZCMediaTemplates.templates.loader, {
        id: e,
        $content: t,
        custom_class: i,
        hide_class: n ? "" : "dN"
    }),
    getConnectionLoaderHtml: e => $WC.template.replace(ZCMediaTemplates.templates.avLoader, {
        $loader_content: e
    })
}, ZCMediaUtil = {
    switchToAvailableTrackForTrackEnd: function(e, t, i, n, a = {}) {
        if (n && i && "audio" === t.kind) {
            var s = i._getSourceAudioTrackId();
            if (s && s === t.id) {
                var o = function(e) {
                        "function" == typeof a.successCB && a.successCB(e, i)
                    },
                    r = function() {
                        "function" == typeof a.failureCB && a.failureCB()
                    },
                    c = function(e) {
                        if ("function" == typeof a.hasCurrentSession && a.hasCurrentSession() && e && e.name === WebRTCUserMedia.errors.OverconstrainedError && "deviceId" === e.constraint) {
                            var t = function() {
                                ZCMediaDevices.clearPreferredAudioInputDevice(), WebRTCUserMedia.requestAndReplaceTracksInStream(i, WebRTCUserMedia.streamTypes.AUDIO_ONLY, (function(e) {
                                    o(e)
                                }), r, void 0, MediaUtil.getAudioProcessingOptions(n))
                            };
                            WebRTCUserMedia.getMediaDevices(t, t)
                        } else r()
                    },
                    d = void 0;
                e && e.currentTarget && e.currentTarget.label && (d = e.currentTarget.label);
                var l = n.getAudioTrackEndedInfo();
                d && l && l.trackLabel && l.trackLabel === d && l.time - MediaCall.BRIDGE.Util.getSyncedCurrentTime() > 12e4 ? ZCMediaDevices.isDefaultDeviceId(i._getAudioDeviceId()) ? r() : c({
                    name: WebRTCUserMedia.errors.OverconstrainedError,
                    constraint: "deviceId"
                }) : WebRTCUserMedia.requestAndReplaceTracksInStream(i, WebRTCUserMedia.streamTypes.AUDIO_ONLY, o, c, void 0, MediaUtil.getAudioProcessingOptions(n)), n.setAudioTrackEndedInfo(d)
            }
        }
    }
}, AVISCUtilBridge = {
    MODULE: "directcall",
    PREV_SEQUENTIAL_ID: 0,
    ACTION: {
        pingFrame: "ping_frame",
        startCall: "start_call",
        getActiveCallDetails: "get_active_call_details",
        handoffCall: "handoff_call",
        joinConferenceCall: "join_conf_call",
        openChat: "open_chat",
        addUserToCall: "add_user"
    },
    _isCliqFrameLoaded: !1,
    TYPE: {
        request: 1,
        response: 2
    },
    reqIdVsOptions: {},
    generateUniqueId: function() {
        return "av_isc" + this.PREV_SEQUENTIAL_ID++
    },
    _constructReqObj: function(e, t) {
        return {
            reqId: this.generateUniqueId(),
            type: this.TYPE.request,
            module: this.MODULE,
            action: e,
            params: t
        }
    },
    _constructRespObj: function(e, t) {
        return {
            reqId: e.reqId,
            type: this.TYPE.response,
            module: this.MODULE,
            resp: t
        }
    },
    _handleRequest: function(e, t) {
        if (e.action && e.reqId) {
            let i;
            switch (e.action) {
                case this.ACTION.pingFrame:
                    i = AVISCUtilBridge._handlePingFromCliqFrame(e.params);
                    break;
                case this.ACTION.startCall:
                    i = MediaCall.initiateStartCallProcess(e.params.type, e.params.calleeId, void 0, e.params.triggerSource);
                    break;
                case this.ACTION.handoffCall:
                    i = MediaCallImpl.checkAndHandoffMediaSession(e.params.callId, e.params.callType, e.params.callerId, e.params.calleeId);
                    break;
                case this.ACTION.getActiveCallDetails:
                    i = MediaCallImpl.hasCurrentSession() ? {
                        id: MediaCallImpl.getCurrentSession().getId()
                    } : void 0;
                    break;
                case this.ACTION.joinConferenceCall:
                    i = Conference.handleConferenceInit(() => Conference.join(e.params.conferenceId, ZCMediaConstants.triggerSource.PERMALINK, void 0, void 0, !0));
                    break;
                case this.ACTION.openChat:
                    i = "function" == typeof MediaCall.BRIDGE.handleChatOpen && MediaCall.BRIDGE.handleChatOpen(e.params.chatId, e.params.recipientId);
                    break;
                case this.ACTION.addUserToCall:
                    let t = e.params.title ? e.params.title : Conference.getAdhocDefaultTitle(),
                        n = e.params.type === Conference.types.VIDEO ? Conference.types.VIDEO : Conference.types.AUDIO,
                        a = JSON.parse(e.params.user_ids),
                        s = JSON.parse(e.params.adhoc_call_details);
                    i = Conference.handleConferenceInit(() => Conference.convertOneToOneCallToConference(t, n, a, void 0, void 0, s, void 0))
            }
            this._postResponseToOrigin(e.reqId, t, this._constructRespObj(e, i))
        }
    },
    _handleResponse: function(e) {
        let t = this.reqIdVsOptions[e.reqId];
        if (t) {
            let i = t.callback;
            "function" == typeof i ? i(e.resp) : t.promise && t.promise.resolve()
        }
    },
    initMessageListeners: function() {
        (MediaUtil.isAVLibraryLoadedInChatbar() || MediaCallImpl.isAVLoadedInIntegratedUI()) && (window.addEventListener("message", e => {
            if ("string" == typeof e.data) try {
                var t = JSON.parse(e.data);
                if (t.module && t.module === this.MODULE) switch (t.type) {
                    case this.TYPE.request:
                        this._handleRequest(t, e);
                        break;
                    case this.TYPE.response:
                        this._handleResponse(t)
                }
            } catch {}
        }), MediaCallImpl.isAVLoadedInIntegratedUI() && this._pingParentFrame({
            loaded: !0
        }))
    },
    initiateCall: function(e, t, i) {
        this._postMessageToParentFrame(this.ACTION.startCall, {
            type: e,
            calleeId: t,
            triggerSource: i
        })
    },
    getActiveCallDetails: function(e) {
        this._postMessageToParentFrame(this.ACTION.getActiveCallDetails, void 0, e)
    },
    handoffCall: function(e, t) {
        this._postMessageToParentFrame(this.ACTION.handoffCall, e, t)
    },
    openGroupCallInIframe: function(e, t) {
        return this._postMessageToCliqFrame(this.ACTION.addUserToCall, e, t)
    },
    joinGroupCallInIframe: function(e, t) {
        return this._postMessageToCliqFrame(this.ACTION.joinConferenceCall, e, t)
    },
    openChatInIframe: function(e, t) {
        return this._postMessageToCliqFrame(this.ACTION.openChat, e, t)
    },
    _pingParentFrame: function(e) {
        this._postMessageToParentFrame(this.ACTION.pingFrame, e)
    },
    _handlePingFromCliqFrame: function(e) {
        if (e.loaded)
            for (var t in this._isCliqFrameLoaded = !0, this.reqIdVsOptions) {
                var i = this.reqIdVsOptions[t],
                    n = this.reqIdVsOptions[t].cliqFrame;
                n.contentWindow.postMessage(JSON.stringify(i), n.src)
            }
    },
    _postMessageToCliqFrame: function(e, t, i) {
        return new Promise((n, a) => {
            "IFRAME" !== i.tagName && a();
            var s = this._constructReqObj(e, t);
            this.reqIdVsOptions[s.reqId] = Object.assign({}, s, {
                cliqFrame: i,
                promise: {
                    resolve: n,
                    reject: a
                }
            }), this._isCliqFrameLoaded && i.contentWindow.postMessage(JSON.stringify(s), i.src)
        })
    },
    _postMessageToParentFrame: function(e, t, i) {
        var n = this._constructReqObj(e, t);
        this.reqIdVsOptions[n.reqId] = Object.assign({}, n, {
            callback: i
        }), ISCUtil.postMessageToParent(n)
    },
    _postResponseToOrigin: function(e, t, i) {
        t.source && (t.source.postMessage(JSON.stringify(i), t.origin), delete this.reqIdVsOptions[e])
    }
}, ZCAudioProcessor = function() {
    var e = async function(e) {
        "suspended" === e.state && await e.resume();
        try {
            await e.audioWorklet.addModule(MediaUtil.getRNNoiseWorklet())
        } catch (e) {
            throw Error("Failed to initialize rnnoise module")
        }
        return new AudioWorkletNode(e, "RNNoiseWorklet")
    };
    return {
        processAudioStream: async function(t, i = {}, n, a) {
            if (i.noiseCancellation) {
                if (t._hasSourceAudioStream() && t._getSourceAudioStream()._hasNoiseCancellationNode()) return void t._getSourceAudioStream()._startNoiseCancellation(n, a);
                e(t._getAudioProcessingContext()).then(e => {
                    e && (t._setNoiseCancellationNode(e), t._startNoiseCancellation(n, a))
                }).catch(() => {
                    t._clearAudioProcessingResources(), a(t)
                })
            } else n(t)
        },
        stopAudioProcessing: function(e, t = {}) {
            t.noiseCancellation && e._hasSourceAudioStream() && e._getSourceAudioStream()._stopNoiseCancellation()
        }
    }
}(), ZCTextToSpeechAPI = function() {
    let e = {};
    const t = {
            unSupported: -100,
            alreadySpeaking: -101,
            cancelledByUser: -102,
            hardwareIssue: -103,
            synthesisIssue: -104,
            unknownError: -105
        },
        i = void 0 !== window.speechSynthesis && "undefined" != typeof SpeechSynthesisUtterance,
        n = window.speechSynthesis;
    return {
        ERROR_CODES: t,
        isSupported: () => i,
        playAlert: function(a, s, o = {}) {
            let r = (e, t) => {
                "function" == typeof o.errorCB && o.errorCB(e, t)
            };
            if (!i) return r(a, t.unSupported);
            if (n.speaking) return r(a, t.alreadySpeaking);
            var c = s.alert_text,
                d = s.loop_count;
            if (d && d > 0)
                for (var l = 0; l < d - 1; l++) c = c + ".   " + s.alert_text;
            let h = new SpeechSynthesisUtterance(c);
            h.onend = () => {
                delete e[a], "function" == typeof o.endCB && o.endCB(a)
            }, h.onstart = () => "function" == typeof o.successCB && o.successCB(a), h.rate = .9, h.onerror = i => {
                var n = t.unknownError;
                i && i.error && ("canceled" === i.error || "interrupted" === i.event ? n = t.cancelledByUser : "audio-busy" === i.error || "audio-hardware" === i.error || "network" === i.error ? n = t.hardwareIssue : "synthesis-unavailable" !== i.error && "synthesis-failed" !== i.error || (n = t.synthesisIssue)), delete e[a], r(a, n)
            }, n.speak(h), e[a] = h
        },
        stopAlert: function(t) {
            e[t] && (n.cancel(), delete e[t])
        }
    }
}(), ZCAVStringCompressor = function() {
    const e = "gzip";
    return {
        compress: async function(t) {
            const i = (new TextEncoder).encode(t),
                n = new CompressionStream(e),
                a = n.writable.getWriter();
            return a.write(i), a.close(),
                function(e) {
                    for (var t = "", i = new Uint8Array(e), n = i.byteLength, a = 0; a < n; a++) t += String.fromCharCode(i[a]);
                    return window.btoa(t)
                }(await new Response(n.readable).arrayBuffer())
        },
        decompress: async function(t) {
            let n = function(e) {
                for (var t = window.atob(e), n = t.length, a = new Uint8Array(n), s = 0; s < n; s++) a[i] = t.charCodeAt(s);
                return a.buffer
            }(t);
            const a = new DecompressionStream(e),
                s = a.writable.getWriter();
            s.write(n), s.close();
            let o = await new Response(a.readable).arrayBuffer();
            return (new TextDecoder).decode(o)
        }
    }
}();
var ZCMediaFeedback = {};
ZCMediaFeedback = function() {
    var e = [],
        t = {},
        i = void 0,
        n = {},
        a = void 0,
        s = 0,
        o = {
            id: void 0,
            type: void 0,
            creatorId: void 0
        },
        r = {
            1: {
                typeClass: "zc-av-feedback-item_issue",
                emojiClass: "zc-av-smiley-anim-72-upset"
            },
            2: {
                typeClass: "zc-av-feedback-item_moderate",
                emojiClass: "zc-av-smiley-anim-72-neutral"
            },
            3: {
                typeClass: "zc-av-feedback-item_great",
                emojiClass: "zc-av-smiley-anim-72-love"
            }
        },
        c = 3,
        d = 1,
        l = 2,
        h = 3,
        u = {
            1: "zcf-sound",
            2: "zcf-video",
            3: "zcf-sharescrn2"
        },
        p = [],
        m = {},
        v = [],
        C = {},
        f = {
            container: '<div id="feedbackCon" class="zc-av-zcl-popup zc-av-zcl-popup-feedback zc-av-flex-col {{view_class}}">\n\t\t\t\t\t   <span purpose="close" class="zc-av-zcl-close zc-av-sm zcf-closeB zc-av-zindex1" title="{{close}}"></span>\n\t\t\t\t\t   <span purpose="goBack" class="zc-av-dN zc-av-feedback-back zc-av-zcl-close zc-av-sm zcf-leftArrow zc-av-zindex1" title="{{back}}"></span>\n\t\t\t\t\t   <div id="feedbackMain" class="zc-av-flexG zc-av-feedback-main zc-av-zcpseudo-bg zc-av-pattern-bg zc-av-flex-col">\n\t\t\t\t\t   \t  <div class="zc-av-fshrink zc-av-mB12">\n\t\t\t\t\t\t      <div class="zc-av-font17 zc-av-fontB">{{label}} {{type}}</div>\n\t\t\t\t\t\t      <div class="zc-av-line19 zc-av-font14 zc-av-clr-Sec zc-av-mT12">{{desc}}</div>\n\t\t\t\t\t\t      {{options}}\n\t\t\t\t\t      </div>\n\t\t\t\t\t      <div id="feedbackSubCon" class="zc-av-flexG zc-av-flex-col zc-av-ovrflwH zc-av-dN">{{sub_options}}</div>\n\t\t\t\t\t   </div>\n\t\t\t\t\t   <div class="zc-av-feeback-ftr zc-av-fshrink zc-av-footr-padding2 zc-av-flexC zc-av-justifyE">\n\t\t\t\t\t      <div purpose="cancel" class="zc-av-zcl-btn-sm zc-av-zcl-btn--secondary zc-av-mR20">{{cancel}}</div>\n\t\t\t\t\t      <div purpose="submit" id="submitBtn" class="zc-av-zcl-btn-sm zc-av-zcl-btn--primary" disabled>{{submit}}</div>\n\t\t\t\t\t   </div>\n\t\t\t\t\t</div>',
            emojihtml: '<div class="zc-av-flexM zc-av-fdirC zc-av-feedback-item zc-av-zcpseudo-bg {{TYPECLASS}}" rating="{{rating}}" purpose="selectRating">\n\t\t\t            <div class="zc-av-smiley-anim-72 {{EMOJICLASS}}"></div>\n\t\t\t            <div class="zc-av-feedback-item-label zc-av-font13">{{LABEL}}</div>\n\t\t\t            <span class="zc-av-feedback-tick zcf-tick zc-av-flexM"></span>\n\t\t\t         </div>',
            optiontitle: '<div class="zc-av-flexC zc-av-font15 {{MARGINTOP}}">\n\t\t\t\t\t\t<span class="zc-av-clr-icon2 {{ICON_CLASS}} zc-av-mR6"></span>\n\t\t\t\t\t\t{{LABEL}}\n\t\t\t\t\t  </div>',
            option: '<div class="zc-av-zcl-alert zc-av-zcl-alert-info zc-av-feedback-option zc-av-curP" category={{CATEGORY}} ID={{ID}} purpose="selectReason">\n\t\t\t\t\t{{LABEL}}\n\t\t\t\t\t<span class="zcf-tick zc-av-feedback-option-tick zc-av-font8 zc-av-mL4 zc-av-mT1"></span>\n\t\t\t\t </div>',
            attachment: '<span class="zcf-attach zc-av-clr-icon zc-av-fontB zc-av-feedback-attach-icon">\n\t\t\t\t\t\t<form id="feedbackUpload" type="html5" enctype="multipart/form-data">\n\t\t\t\t\t\t\t<input type="file" multiple name="file1" class="zc-av-feedback-sendfile zc-wh100" id="feedbackFile" />\n\t\t\t\t\t\t</form>\n\t\t\t\t\t  </span>',
            composer: '<div class="zc-av-feedback-composer zc-av-feedback-subcont zc-av-mT12 zc-av-flex-col zc-av-fshrink">\n\t\t\t\t\t   <textarea feedbackinput id="feedbackTextarea" class="zc-av-flexG zc-av-feedback-textarea" placeholder="{{placeholder}}" maxlength="4000"></textarea>\n\t\t\t\t\t   <div category="charcount" class="zc-av-limit-txt zc-av-dN" limit="4000">4000</div>\n\t\t\t\t\t   <div class="zc-av-flexC zc-av-mT5">\n\t\t\t\t\t      <div id="attachmentList" class="zc-av-flexG zc-av-flexC zc-av-gap10">\n\t\t\t\t\t      </div>\n\t\t\t\t\t      <div class="zc-av-fshrink zc-av-mLA zc-av-feedback-attach zc-av-posrel zc-av-alignselfE">\n\t\t\t\t\t         {{FILEUPLOAD}}\n\t\t\t\t\t         <div class="zc-av-feedback-tooltip">\n\t\t\t\t\t            <div>{{upload_files}}</div>\n\t\t\t\t\t            <div>{{size}}: {{limit}}</div>\n\t\t\t\t\t         </div>\n\t\t\t\t\t      </div>\n\t\t\t\t\t   </div>\n\t\t\t\t   </div>',
            successInfo: '<div id="feedback_success_info" class="zc-av-feedback-success-box zc-av-flexM zc-av-fdirC zc-vhcenter">\n\t\t\t\t<span purpose="closeSuccessInfo" class="zc-av-zcl-close zc-av-sm zcf-closeB zc-av-zindex1" title="{{close}}"></span>\n\t\t\t\t<div class="zc-av-zcl-img zcf-tick zc-av-xl zc-av-flexM zc-av-bg-success"></div>\n\t\t\t\t<div class="zc-av-font22 zc-av-fontB zc-av-mT24">{{header}}</div>\n    \t\t\t<div class="zc-av-font15 zc-av-mT14 zc-av-clrW-lite">{{desc}}</div>\n\t\t\t</div>'
        },
        _ = e => {
            var t = "",
                i = "";
            return v.forEach(n => {
                if (n === d || n === l && e && e.video || n === h && e && e.screen) {
                    var a = C[n];
                    t += $WC.template.replace(f.optiontitle, {
                        MARGINTOP: i,
                        ICON_CLASS: a.iconclass,
                        LABEL: a.label
                    }), t += '<div class="zc-av-mT12 zc-av-flexC zc-av-gap10 zc-av-flexW">', a.options.forEach(e => {
                        t += $WC.template.replace(f.option, {
                            LABEL: e.label,
                            ID: e.id,
                            CATEGORY: a.id
                        })
                    }), t += "</div>", i = "zc-av-mT16"
                }
            }), `<div id="feedbackoptioncon" class="zc-av-feedback-subcont zc-av-flexG zc-av-ovrflwA">${t}</div>`
        },
        S = () => {
            var e = $WC.template.replace(f.composer, {
                FILEUPLOAD: f.attachment
            }, "InSecureHTML");
            return $WC.template.replace(e, {
                $upload_files: "avcliq.common.files.upload",
                $size: "avcliq.feedback.file.size",
                limit: "10 MB",
                $placeholder: "avcliq.feedback.placeholder"
            })
        },
        g = () => {
            var e = "";
            return p.forEach(t => {
                var i = m[t];
                e += $WC.template.replace(f.emojihtml, {
                    LABEL: i.label,
                    TYPECLASS: r[i.type].typeClass,
                    EMOJICLASS: r[i.type].emojiClass,
                    rating: i.id
                })
            }), `<div id="feedbackEmojiCon" class="zc-av-feedback-emoji-con zc-av-flexM">${e}</div>`
        },
        T = (e, t) => {
            if ($WC.Matcher.check("imagemimetype", e.type)) {
                var i = new FileReader;
                i.onload = function(i) {
                    var n = '<img class="zc-av-zcl-img-elem" src="' + i.target.result + '" /><span id="close" class="zc-av-zcl-img-remove zcf-closeB" title="' + MediaUtil.getResource("avcliq.common.remove") + '"></span></div>';
                    y(t, n, e.name, e)
                }, i.readAsDataURL(e)
            } else {
                var n = '<div class="zc-av-zcl-img_file zc-av-flexM"><span class="zc-av-zcl-img_filename zc-av-ellips">{FILETYPE}</span></div><span id="close" class="zc-av-zcl-img-remove zcf-closeB" title="' + MediaUtil.getResource("avcliq.common.remove") + '"></span>';
                y(t, n, e.name, e)
            }
        },
        y = (t, i, n, a) => {
            var o = [a, n];
            e.push(o);
            var r = n.lastIndexOf(".");
            if (-1 !== r) {
                var c = n.substring(r);
                i = i.replace(/{FILETYPE}/g, $WC.$CUtil.processXSS(c))
            } else i = i.replace(/{FILETYPE}/g, "");
            var d = $WC.template.replace('<div type="preview" name="{{file_name}}" class="zc-av-zcl-img zc-av-flexM">{{body}}</div>', {
                body: i
            }, "InSecureHTML");
            d = $WC.template.replace(d, {
                file_name: n
            }), t.prepend(d), ZCJQuery("#close").on("click", (function(t) {
                for (var i = ZCJQuery(this).parent(), n = i.attr("name"), a = e, o = a.length, r = 0; r < o; r++)
                    if (a[r][1] === n) return s -= a[r][0].size, e.splice(r, 1), void i.remove()
            }))
        },
        I = e => {
            var t = void 0;
            if (MediaUtil.isOneToOneCall(e) ? t = ZCMediaConstants.settingKey.CALL_FEEDBACK : MediaUtil.isGroupCall(e) && (t = ZCMediaConstants.settingKey.MEETING_FEEDBACK), t) {
                var i = {};
                i[t] = MediaUtil.BRIDGE.Util.getSyncedCurrentTime(), MediaUtil.isGuestConferenceUser() ? Settings.updateInObj(i) : MediaUtil.updateSettingsValue(i)
            }
        },
        b = s => {
            var r = {
                sessionKey: o.id,
                module: o.type,
                rating: a,
                creatorId: o.creatorId
            };
            if (m[a].type != c) {
                var d = i.find("#feedbackTextarea").val().trim();
                d.length > 0 && (r.comment = d), e.length && (r.files = e), r.reasons = Object.keys(t), "function" == typeof n.submitCallBack && n.submitCallBack(n)
            }
            MediaAPI.submitFeedback(r, s, (function() {
                var e = n.container;
                I(o.type), e ? (k(), 0 === e.find("#feedback_success_info").length && (e.addClass("zc-av-feedback-expanded"), e.append($WC.template.replace(f.successInfo, {
                    $header: "avcliq.feedback.success.header",
                    $desc: "avcliq.feedback.success.desc",
                    $close: "avcliq.common.close"
                })), R(e.find("#feedback_success_info")))) : (ZCMediaDomUtil.removeHtmlAndAddTickMark(s), setTimeout(() => {
                    k()
                }, 500))
            }), (function() {}))
        },
        k = () => {
            ZCJQuery("#feedbackCon").remove(), n.container && n.container.removeClass("zc-av-feedback-expanded"), i = void 0, n = {}, o = {}, e = [], t = {}, a = void 0
        },
        P = {
            selectRating: function(e) {
                (e => {
                    if (!e.hasClass("zc-av-sel")) {
                        e.addClass("zc-av-sel").siblings().removeClass("zc-av-sel"), i.addClass("zc-av-feedback-choosed"), n.container && n.container.addClass("zc-av-feedback-expanded"), i.find("#submitBtn").removeAttr("disabled");
                        var t = i.find("#feedbackSubCon");
                        a = e.attr("rating");
                        var s = t.is(":visible"),
                            o = m[a].type === c;
                        if (t.toggleClass("zc-av-dN", o), void 0 === n.container && !s && !o) void 0 === MediaUtil.setContainerPosition(i, 30, 30).top && i.css("top", i.offset().top), i.css("bottom", "unset")
                    }
                })(e)
            },
            selectReason: function(e) {
                (e => {
                    var i = e.attr("id");
                    e.hasClass("zc-av-sel") ? (e.removeClass("zc-av-sel"), delete t[i]) : (e.addClass("zc-av-sel"), t[i] = !0)
                })(e)
            },
            goBack: function(e) {
                a = void 0, i.removeClass("zc-av-feedback-choosed"), n.container && n.container.removeClass("zc-av-feedback-expanded"), i.find("#submitBtn").attr("disabled"), i.find("#feedbackSubCon").addClass("zc-av-dN"), i.find('[purpose="selectRating"]').removeClass("zc-av-sel")
            },
            submit: function(e) {
                b(e)
            },
            closeSuccessInfo: function() {
                var e = ZCJQuery("#feedback_success_info"),
                    t = e.parents(".zc-av-feedback-expanded");
                e.remove(), t.removeClass("zc-av-feedback-expanded")
            },
            close: function(e) {
                I(o.type), k()
            },
            cancel: function(i) {
                var n;
                Object.keys(t).length || e.length ? (n = MediaUtil.getCssClassesConstants(), MediaUtil.createDialog({
                    id: "closeFeedbackConfirmation",
                    version: 3,
                    class: "zcl-alert-dialog-2 zcldel-dialog-box",
                    headerhtml: $WC.$Dlg.frameHeaderHTML({
                        imagehtml: '<div class="zc-av-zcl-img zc-av-xl zc-av-flexM zc-av-mAuto zcf-delete2 zc-av-zcl-img--neg"></div>',
                        header: MediaUtil.getResource("avcliq.feedback.cancel.confirm"),
                        subheader: [MediaUtil.getResource("avcliq.feedback.cancel.confirm.info")]
                    }),
                    bodyhtml: "",
                    buttons: [$WC.$Dlg.getButtonObj("avcliq.common.go.back", n.SECONDARY_BTN), $WC.$Dlg.getButtonObj("avcliq.common.cancel", n.NEG_PRIMARY_BTN, (function() {
                        I(o.type), k()
                    }))]
                }, !0)) : (I(o.type), k())
            }
        },
        R = e => {
            e.on("click", "[purpose]", e => {
                var t = ZCJQuery(e.currentTarget),
                    i = t.attr("purpose");
                P[i](t)
            })
        },
        A = e => {
            R(i), i.on("keyup keydown focus", "[feedbackinput]", e => {
                ZCMediaDomUtil.limitInput(e.currentTarget)
            }), i.on("change", "#feedbackFile", (function() {
                (e => {
                    var t = i.find("#attachmentList"),
                        n = e.length;
                    if (t.find('[type="preview"]').length + n > 5) MediaUtil.updateBanner(MediaUtil.getResource("avcliq.feedback.error.fileslimit", [5]), 2e3, !0);
                    else {
                        for (var a = 0; a < n; a++) {
                            var o = e[a];
                            if (s + o.size > 10485760) return void MediaUtil.updateBanner(MediaUtil.getResource("avcliq.feedback.error.sizelimit"), 2e3, !0);
                            s += o.size, T(o, t)
                        }
                        i.find("#feedbackUpload")[0].reset()
                    }
                })(this.files)
            })), e.drag && i.setAsDraggable({
                ondrag: function(e) {
                    i.css("bottom", "unset")
                }
            })
        },
        z = (e, t, a, s) => {
            if (void 0 !== typeof MediaUtil.BRIDGE && 0 !== p.length) {
                k(), n = s;
                var r = ((e, t) => {
                    var i = MediaUtil.getResource("avcliq.module." + (MediaUtil.isOneToOneCall(e) ? "call" : "meeting")).toLowerCase(),
                        n = $WC.template.replace(f.container, {
                            options: g(),
                            sub_options: _(t) + S()
                        }, "InSecureHTML");
                    return $WC.template.replace(n, {
                        view_class: t.miniView ? "zc-av-feedback-minview zc-av-nite-mode" : "",
                        $label: "avcliq.feedback.label",
                        $desc: "avcliq.feedback.desc",
                        $cancel: "avcliq.common.cancel",
                        $submit: "avcliq.common.submit",
                        $close: "avcliq.common.close",
                        $back: "common.go.back",
                        type: i
                    })
                })(t, s);
                s.container ? ZCJQuery(s.container).append(r) : void 0 !== MediaCall.BRIDGE && "function" == typeof MediaCall.BRIDGE.handleBodyMount ? MediaCall.BRIDGE.handleBodyMount(ZCJQuery(r)) : ZCJQuery("body").append(r), o = {
                    type: t,
                    id: e,
                    creatorId: a
                }, i = ZCJQuery("#feedbackCon"), A(s);
                var c = {
                    sessionKey: e,
                    module: t,
                    creatorId: a
                };
                MediaAPI.updateFeedbackShownTime(c)
            }
        };
    return {
        checkAndshow: (e, t, i, n) => {
            var a = -1;
            if (MediaUtil.isOneToOneCall(t)) a = MediaUtil.getSettingsValue(ZCMediaConstants.settingKey.CALL_FEEDBACK, !0);
            else {
                if (!MediaUtil.isGroupCall(t)) return;
                a = MediaUtil.getSettingsValue(ZCMediaConstants.settingKey.MEETING_FEEDBACK, !0)
            }
            MediaUtil.BRIDGE.Util.getSyncedCurrentTime() - parseInt(a) < 1728e6 || z(e, t, i, n)
        },
        show: z,
        updateTemplateOptions: e => {
            for (var t of e.reason_types) v.push(t.id), C[t.id] = {
                id: t.id,
                label: t.label,
                iconclass: u[t.id],
                options: []
            };
            for (var i of e.reasons) {
                var n = {
                    id: i.id,
                    label: i.label
                };
                C[i.type].options.push(n)
            }
            for (var a of e.ratings) p.push(a.id), m[a.id] = {
                id: a.id,
                label: a.label,
                type: a.type
            }
        }
    }
}();
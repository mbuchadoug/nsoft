var MediaCallUI = {},
    MediaCallImpl = {},
    MediaCallAPI = {},
    LongPollingController = {};
MediaCallUI = {
    DETACHED_CONTAINER_ADJUST_WIDTH: 20,
    windowActiveTimeout: void 0,
    windowActiveTimoutDuration: 4e3,
    _endCallTimers: {},
    bindEvents: function() {
        var e = ZCJQuery(document);
        ZCMediaDevices.addListenerForDeviceChange("mediacall", (function(e, t) {
            MediaCallHandler.deviceEvents.handleDeviceChange(e, t)
        })), e.on("click", "[mediacallbuttons]", (function(e) {
            Clickoutside.handleClick(e), e.stopPropagation();
            var t = ZCJQuery(this),
                a = t.attr("purpose");
            MediaCallHandler.UIEvents[a](e, t)
        })), e.on("keydown", "[mediacallinput]", (function(e) {
            var t = ZCJQuery(this),
                a = t.attr("inputname");
            13 == e.keyCode && ("rejectTextBox" === a ? MediaCallHandler.UIEvents.sendCustomRejectMessage(e, t) : "adhoccalltitle" === a && MediaCallHandler.UIEvents.ringAllParticipants())
        })), e.on("input", "[mediacallinput]", (function(e) {
            var t = ZCJQuery(this),
                a = t.attr("inputname");
            "rejectTextBox" === a ? MediaCallHandler.UIEvents.handleRejectMessageInput(e, t) : "adhoccalltitle" === a && MediaCallHandler.UIEvents.handleAdhocCallInputs()
        })), e.on("mousemove", "[audiovideowrapper]", (function(e) {
            clearTimeout(MediaCallUI.windowActiveTimeout);
            var t = ZCJQuery(this).addClass("AV-call-window-active");
            MediaCallUI.windowActiveTimeout = setTimeout((function() {
                t.removeClass("AV-call-window-active")
            }), MediaCallUI.windowActiveTimoutDuration)
        })), e.on("change", '[mediacallcheckbox][type="checkbox"]', (function(e) {
            e.stopPropagation();
            var t = ZCJQuery(this),
                a = t.attr("purpose");
            MediaCallHandler.UIToggleEvents[a](e, t)
        }))
    },
    isCurrentChat: function(e) {
        return ZCJQuery("#mediacallchatsection").find("#" + e).length > 0
    },
    isInFullScreenView: function(e) {
        return e.hasClass("AV-call-fullscrn")
    },
    isInMinimizedView: function() {
        var e = MediaCallImpl.getCurrentSession();
        return e && !e.isMigratedCall() && !MediaCallUI.isInFullScreenView(MediaCallUI.getMediaCallWrapper(e.getId()))
    },
    isInDetachedView: function(e) {
        return void 0 !== e.parents("#mediacall_container").attr("detached")
    },
    isInAudioLayout: function(e) {
        return e.hasClass("AV-call-audio-only")
    },
    isInInitialLayout: function(e) {
        return e.hasClass("AV-call-initial")
    },
    isRHSOpened: function(e) {
        return e.hasClass("show-aside")
    },
    getMediaCallWrapper: function(e) {
        return ZCJQuery('[mediacallwrapper][callId="' + e + '"]')
    },
    getVideoContainer: function(e, t) {
        return this.getMediaCallWrapper(e).find('[videocontainer][userId="' + t + '"]')
    },
    deleteMediaContainers: function(e) {
        this.getMediaCallWrapper(e).find("[screencontainer], [videocontainer]").each((function() {
            var e = ZCJQuery(this);
            MediaUtil.removeVideoElemsStreamInContainer(e), e.remove()
        }))
    },
    getScreenContainer: function(e, t) {
        return this.getMediaCallWrapper(e).find('[screencontainer][userId="' + t + '"]')
    },
    addAndGetScreenContainer: function(e, t) {
        var a = this.getScreenContainer(e, t);
        if (!a.length) {
            var i = MediaCallTemplates.getScreenVideoContainerHtml(t, MediaCall.BRIDGE.Users.getName(t)),
                n = this.getMediaCallWrapper(e);
            this.switchMainViewCntToSubView(n, e), this.handleSwitchToVideoLayout();
            var s = n.find("[screenvideowrapper]");
            s.addClass("AV-call-subview-2").append(i), a = this.getScreenContainer(e, t), MediaCallHandler.UIEvents.switchView(void 0, s), this.adjustCallContainerHeight(n)
        }
        return a
    },
    getWhiteBoardContainer: function(e) {
        return this.getMediaCallWrapper(e).find("[whiteboardcontainer]")
    },
    switchMainViewCntToSubView: function(e, t) {
        MediaCallUI.isInFullScreenView(e) && (MediaCallUI.adjustMainVideoSectionSize(e, !1), e.find(".AV-call-mainview-2").removeClass("AV-call-mainview-2").addClass("AV-call-subview"), MediaCallUI.makeFullScreenVideosDraggable(t))
    },
    switchSubViewCntToMainView: function(e, t) {
        MediaCallUI.isInFullScreenView(e) && (MediaCallUI.resetFullScreenVideosDraggable(t), e.find(".AV-call-subview").removeClass("AV-call-subview").addClass("AV-call-mainview-2"), MediaCallUI.adjustMainVideoSectionSize(e, !0))
    },
    addAndGetWhiteBoardContainer: function(e, t) {
        var a = this.getWhiteBoardContainer(e);
        if (!a.length) {
            var i = MediaCallTemplates.getWhiteBoardContainerHtml("WhiteBoard", t),
                n = this.getMediaCallWrapper(e);
            this.switchMainViewCntToSubView(n, e), this.handleSwitchToVideoLayout();
            var s = n.find("[wbwrapper]");
            s.addClass("AV-call-subview-2").append(i), a.addClass("w100 h90"), MediaCallHandler.UIEvents.switchView(void 0, s), a = this.getWhiteBoardContainer(e), $Util.animateBufferLoader(a.find("[bufferloadercnt]"), 9)
        }
        var l = t && t.hasWhiteBoard() ? t.getCurrentWhiteBoardId() : "",
            r = t && t.hasWhiteBoard() ? WhiteBoard.getBoardURL(l, t.getId()) : "";
        if (r) {
            var o = a.find("iframe")[0];
            o.setAttribute("data-uid", l), o.onload = function() {
                a.find("[bufferloadercnt]").empty(), ZCJQuery(o).removeClass("vsbH"), WhiteBoard.setUpWhiteBoardBridge(o)
            }, o.src = r
        }
        return a
    },
    removeWhiteBoardContainer: function(e) {
        var t = e.getId(),
            a = this.getWhiteBoardContainer(t);
        if (a.length) {
            var i = this.getMediaCallWrapper(t).find("[wbwrapper]");
            MediaCallUI._removeSharedContentContainer(ZCMediaConstants.sharedContentType.WHITEBOARD, e, a, i)
        }
    },
    getPresentationContainer: function(e) {
        return this.getMediaCallWrapper(e).find("#presentation_container")
    },
    addAndGetPresentationContainer: function(e, t) {
        var a = this.getPresentationContainer(e);
        if (!a.length) {
            var i = PresentationUI.getPresentationContainerHtml(t),
                n = this.getMediaCallWrapper(e);
            this.switchMainViewCntToSubView(n, e), this.handleSwitchToVideoLayout(), n.addClass("AV-call-presentation");
            var s = n.find("[presentation_wrapper]");
            s.addClass("AV-call-subview-2").append(i), a.addClass("w100 h90"), MediaCallHandler.UIEvents.switchView(void 0, s), a = this.getPresentationContainer(e), $Util.animateBufferLoader(a.find("[bufferloadercnt]"), 9)
        }
        return a
    },
    removePresentationContainer: function(e) {
        var t = e.getId(),
            a = this.getPresentationContainer(t);
        if (a.length) {
            var i = this.getMediaCallWrapper(t).find("[presentation_wrapper]");
            MediaCallUI._removeSharedContentContainer(ZCMediaConstants.sharedContentType.PRESENTATION, e, a, i)
        }
    },
    removeScreenContainer: function(e, t) {
        var a = e.getId(),
            i = this.getScreenContainer(a, t);
        if (i.length) {
            var n = this.getMediaCallWrapper(a).find("[screenvideowrapper]");
            MediaCallUI._removeSharedContentContainer(ZCMediaConstants.sharedContentType.SCREEN_SHARE, e, i, n)
        }
    },
    _removeSharedContentContainer: function(e, t, a, i) {
        var n = t.getId(),
            s = this.getMediaCallWrapper(n);
        (i.hasClass("AV-call-mainview") ? (MediaCallHandler.UIEvents.switchView(void 0, s.find(".AV-call-subview-2")), i.removeClass("AV-call-subview-2")) : i.hasClass("AV-call-subview") ? (s.find(".AV-call-subview-2").removeClass("AV-call-subview-2").addClass("AV-call-subview"), i.removeClass("AV-call-subview")) : i.hasClass("AV-call-subview-2") && i.removeClass("AV-call-subview-2"), ZCMediaConstants.sharedContentType.SCREEN_SHARE === e ? MediaUtil.removeVideoElemsStreamInContainer(a) : ZCMediaConstants.sharedContentType.WHITEBOARD === e ? (i.removeClass("wh100"), i.find("[videocontainer]").remove()) : ZCMediaConstants.sharedContentType.PRESENTATION === e && (i.find("[videocontainer]").remove(), s.removeClass("AV-call-presentation")), a.remove(), !t.isAudioLayoutRequired() && !t.isScreenShareWithAudioCall() || t.getCurrentMember().hasSwitchedToVideo() || t.getOtherMember().hasSwitchedToVideo()) ? this.switchSubViewCntToMainView(s, n): (MediaCallUI.isInFullScreenView(s) && MediaCallHandler.UIEvents.minimizeWindow(), s.removeClass("AV-call-audiovideo").addClass("AV-call-audio-only").removeAttr("audiovideowrapper"), (a = ZCJQuery("#mediacall_container")).removeResizable(), a.addClass("AV-call-audio-only-wrapper").css("width", ""), a.removeClass("AV-call-audiovideo-wrapper"), this.setContainerPosition(a, this.DETACHED_CONTAINER_ADJUST_WIDTH));
        this.adjustCallContainerHeight(s)
    },
    showCallUI: function(e) {
        var t = ZCJQuery(MediaCallTemplates.getMainUIHtml(e));
        e.isVideoCall() && t.find(".AV-call-video-muted").removeClass("AV-call-video-muted"), this.setCallUIInBody(t), MediaCall.BRIDGE && MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleCallStart && MediaCall.BRIDGE.listener.handleCallStart(e.getDetails())
    },
    updateAudioDevicesInSessionPreview: function(e) {
        ZCDirectCallDialogs.isSettingsWinExist() && this.updateAudioDevicesInPreview(ZCJQuery("#media_device_widget"), e)
    },
    updateAudioDevicesInPreview: function(e, t) {
        var a = MediaCallTemplates.getAudioInputDevicePickerHtml(t),
            i = MediaCallTemplates.getAudioOutputDevicePickerHtml(t);
        e.find("#audioinputdropdowncnt").replaceWith(a), e.find("#audiooutputdropdowncnt").replaceWith(i)
    },
    showSpeechDetectedInfo: function(e) {
        var t = this.getMediaCallWrapper(e.getId());
        if (0 === t.find("#speech_detected_info").length) {
            var a = t.find('[mediacallbuttons][purpose="turnOnMicrophone"]');
            a.append($WC.template.replace('<div id="speech_detected_info" class="avcliq-helptip dN">{{help_tip}}</div>', {
                $help_tip: ["avcliq.media.speech.detected.info", MediaUtil.getMuteShortCutContent()]
            })), a.append('<span id="speech_detected_ind" class="avcliq-speech-anim"></span>'), t.addClass("zc-av-speech-ind")
        }
    },
    closeSpeechDetectedInfo: function(e) {
        var t = this.getMediaCallWrapper(e.getId());
        t.find("#speech_detected_info").remove(), t.find("#speech_detected_ind").remove(), t.removeClass("zc-av-speech-ind")
    },
    showSwitchToVideoInfo: function(e) {
        0 === e.find("[switchnotifycnt]").length && e.append(MediaCallTemplates.getSwitchNotifyCntHtml()), ZCJQuery("#mediacall_container").addClass("AV-call-main-switch-wrapper")
    },
    removeSwitchToVideoInfo: function(e) {
        this.getMediaCallWrapper(e.getId()).find("[switchnotifycnt]").remove(), ZCJQuery("#mediacall_container").removeClass("AV-call-main-switch-wrapper")
    },
    removeShareOptionsDropDown: function(e) {
        var t = e + "shrdropdowncnt";
        this.getMediaCallWrapper(e).find('[mediacallbuttons][purpose="shareOptions"]').removeClass("AV-call-active").attr("av-tooltip-title", MediaUtil.getResource("common.share")), ZCJQuery("#" + t).remove(), Clickoutside.clear(t)
    },
    removeMoreOptionsDropDown: function(e) {
        var t = e + "dropdowncnt";
        this.getMediaCallWrapper(e).find('[mediacallbuttons][purpose="showMoreOptions"]').removeClass("AV-call-active").attr("av-tooltip-title", MediaUtil.getResource("avcliq.media.more")), ZCJQuery("#" + t).remove(), Clickoutside.clear(t)
    },
    handleOpenFullScreen: function(e) {
        MediaCallImpl.getCurrentSession().setWindowInFullScreen(!0), e.removeClass("zcf-fullscrn").addClass("zcf-exit-fullscrn"), e.attr({
            purpose: "exitFromFullScreen",
            "av-tooltip-title": MediaUtil.getResource("media.exit.fullscreen")
        }), this.handleResize()
    },
    handleExitFullScreen: function(e) {
        MediaCallImpl.getCurrentSession().setWindowInFullScreen(!1), e.removeClass("zcf-exit-fullscrn").addClass("zcf-fullscrn"), e.attr({
            purpose: "openInFullScreen",
            "av-tooltip-title": MediaUtil.getResource("media.open.fullscreen")
        }), this.handleResize()
    },
    handleScreenShareStart: function() {
        var e = ZCJQuery("#mediacall_container").find("[mediacallwrapper]");
        e.addClass("AV-call-scrnshare-ind"), e.find("[screen_share_indicator_v2]").removeClass("zc-av-hide");
        var t = e.find('[mediacallbuttons][purpose="startScreenShare"]');
        t.length && (t.attr("purpose", "stopScreenShare").addClass("AV-call-selected"), t.find("[icon]").removeClass("zcf-sharescrn").addClass("zcf-scrn-shr-stop"), t.find("[content]").text(MediaUtil.getResource("avcliq.media.screenshare.stop")))
    },
    resetScreenShareOption: function() {
        var e = ZCJQuery("#mediacall_container").find("[mediacallwrapper]");
        e.removeClass("AV-call-scrnshare-ind"), e.find("[screen_share_indicator_v2]").addClass("zc-av-hide");
        var t = e.find('[mediacallbuttons][purpose="stopScreenShare"]');
        t.length && (t.attr("purpose", "startScreenShare").removeClass("AV-call-selected"), t.find("[icon]").removeClass("zcf-scrn-shr-stop").addClass("zcf-sharescrn"), t.find("[content]").text(MediaUtil.getResource("avcliq.media.screenshare.start")))
    },
    adaptEndCallUIToState: function(e, t) {
        var a = this.getMediaCallWrapper(e);
        if (t === MediaCallConstants.states.WAITING_FOR_PERMISSION) a.find("[statuscontent]").text(MediaUtil.getResource("avcliq.media.permission.state.prompt"));
        else if (t === MediaCallConstants.states.RECORDING) {
            var i = $WC.template.replace('<span statusmessage class="zc-av-mR4">{{call_state}}</span><span id="{{recording_timer}}"></span>', {
                recording_timer: ZCMediaRecorderImpl.getRecorderSessionTimerId(e),
                $call_state: "avcliq.media.recording"
            });
            a.find("[statuscontent]").html(i)
        } else t === MediaCallConstants.states.RECORDED && a.find("[statusmessage]").text(MediaUtil.getResource("mediarecorder.recorded"))
    },
    adaptUIToState: function(e, t) {
        var a = this.getMediaCallWrapper(e.getId()),
            i = a.find("[statuscontent]"),
            n = "";
        if (t === MediaCallConstants.states.WAITING_FOR_PERMISSION) n = "avcliq.media.permission.state.prompt";
        else if (t === MediaCallConstants.states.INITIATING) n = "mediacall.state.initiating";
        else if (t === MediaCallConstants.states.CALLING) n = "videochat.message.calling";
        else if (t === MediaCallConstants.states.RINGING) n = "videochat.message.ringing";
        else if (t === MediaCallConstants.states.NO_RESPONSE) n = "mediacall.state.noresponse";
        else if (t === MediaCallConstants.states.DECLINED) n = "mediacall.state.declined";
        else if (t === MediaCallConstants.states.MISSED_ON_BUSY) n = "mediacall.state.missedonbusy";
        else if (t === MediaCallConstants.states.CONNECTING) {
            n = "common.connecting";
            var s = $WC.template.replace('<div class="AV-call-box zcf-audio AV-call-box-end zc-av-mL0" title="{{title}}" mediacallbuttons purpose="endCall"></div>', {
                $title: "videochat.endcall"
            });
            a.find("[incomingcalloptions]").html(s)
        } else if (t === MediaCallConstants.states.RECONNECTING) i = a.find("[topstatuscnt]"), a.addClass("AV-call-topstatus AV-call-reconnect"), n = "videochat.message.reconnect";
        else if (t === MediaCallConstants.states.HANDOFF_IN_PROGRESS) i = a.find("[topstatuscnt]"), a.addClass("AV-call-topstatus"), n = "avcliq.mediacall.state.parking";
        else if (t === MediaCallConstants.states.MIGRATING) a.addClass("AV-call-migrating"), i = a.find("[adhoccallstatus] [statustext]"), n = "avcliq.mediacall.state.migrating";
        else if (t === MediaCallConstants.states.RECORDING_PROCESSING) a.addClass("AV-call-migrating"), i = a.find("[adhoccallstatus] [statustext]"), n = "mediacall.state.recording.initiate";
        else if (t === MediaCallConstants.states.CONNECTED) {
            a.removeClass("AV-call-topstatus AV-call-reconnect"), MediaCallUI.removeRejectMessageDialog(e.getId()), MediaCall.isNetworkIndicatorEnabled() && ZCJQuery("#mediacall_container").addClass("AV-health-meter");
            var l = a.find("[initialcontainer]");
            if (l.length) a.find("[impulsecontainer]").remove(), l.remove(), a.removeClass("AV-call-initial"), e.isVideoLayoutRequired() ? this.handleSwitchToVideoLayout() : (ZCJQuery("#mediacall_container").addClass("AV-call-audio-only-wrapper"), a.addClass("AV-call-audio-only")), e.getCurrentMember().isSharingScreen() && MediaCallUI.handleScreenShareStart(), a.find("[maincontainer]").append(MediaCallTemplates.getOptionsHtml(e)), e.getType() === MediaCallConstants.types.SCREEN_SHARE_WITH_AUDIO && e.isCallee(MediaCall.BRIDGE.Constants.ZUID) && MediaCallHandler.UIEvents.maximizeWindow(), this.isInDetachedView(a) && this.setContainerPosition(a.parent(), this.DETACHED_CONTAINER_ADJUST_WIDTH), this.adjustCallContainerHeight(a)
        }
        var r = a.find("[other-username]");
        $WC.Util.isEmpty(r.text()) && r.text(e.getOtherMember().getName()), $WC.Util.isEmpty(n) || i.text(MediaUtil.getResource(n)), e.isLiveFeedAssociated() && LiveFeedHandler.callEvents.adaptUIToState(e, t)
    },
    updateRecordingState: function(e, t) {
        var a = MediaCallUI.getMediaCallWrapper(e),
            i = a.find("[recording_indicator]");
        "start" === t ? (i.fadeIn(), a.addClass("AV-call-recording")) : i.fadeOut((function() {
            a.removeClass("AV-call-recording")
        }))
    },
    setCallUIInBody: function(e) {
        var t = MediaCall.BRIDGE.Constants.IS_GUEST_USER ? "#guest_chat_main" : "body",
            a = ZCJQuery("#mediacall_container");
        a.length ? (a.addClass("AV-call-detached"), a.attr("detached", "")) : (a = e, void 0 !== MediaCall.BRIDGE && "function" == typeof MediaCall.BRIDGE.handleBodyMount ? MediaCall.BRIDGE.handleBodyMount(a) : ZCJQuery(t).append(a), e = a.find("[mediacallwrapper]")), a.setAsDraggable({
            ondragend: function(e) {
                MediaCallUI.handleDragEnd(e)
            },
            areaToBeVisible: ZCMediaConstants.minimizedWindowRange.visibleArea
        }), this.adjustCallContainerHeight(e)
    },
    unsetDraggableOnMaximize: function() {
        var e = ZCJQuery("#mediacall_container");
        e.removeClass("AV-call-detached"), e.removeAttr("detached"), e.setAsNonDraggable()
    },
    getViewContainers: function(e) {
        return MediaCallUI.getMediaCallWrapper(e).find('[purpose="switchView"]')
    },
    isInSubView: function(e) {
        return e.hasClass("AV-call-subview") || e.hasClass("AV-call-subview-2")
    },
    getVideoOrScreenContainer: function(e) {
        var t = e.find("[videocontainer]");
        return t.length > 0 ? t : e.find("[screencontainer]")
    },
    isContainerDraggable: function(e) {
        return e.hasClass("ZCdrag")
    },
    getDragCriteriaForSubView: function() {
        return {
            dragboundary: ZCJQuery("#mediacall_container").find("[videowrapper]"),
            isPositionBasedOnElem: !0,
            areaToBeVisible: {
                width: 10,
                height: 10
            }
        }
    },
    makeFullScreenVideosDraggable: function(e) {
        for (var t = this.getViewContainers(e), a = 0; a < t.length; a++) {
            var i = ZCJQuery(t[a]);
            if (this.isInSubView(i)) {
                var n = i.find("[tempvideocontainer]");
                this.isContainerDraggable(n) || n.setAsDraggable(this.getDragCriteriaForSubView()), n.append(this.getVideoOrScreenContainer(i))
            }
        }
    },
    resetFullScreenVideosDraggable: function(e) {
        for (var t = this.getViewContainers(e), a = 0; a < t.length; a++) {
            var i = ZCJQuery(t[a]);
            this.isInSubView(i) && i.append(this.getVideoOrScreenContainer(i.find("[tempvideocontainer]")))
        }
    },
    handleViewSwitch: function(e, t, a) {
        var i = e.find(".AV-call-mainview"),
            n = i.find("[tempvideocontainer]");
        if (n.css(t.find("[tempvideocontainer]").position()), i.removeClass("AV-call-mainview").addClass(a), t.removeClass(a).addClass("AV-call-mainview"), MediaCallUI.isInFullScreenView(e)) {
            t.append(this.getVideoOrScreenContainer(t.find("[tempvideocontainer]"))), MediaCallUI.adjustMainVideoSectionSize(e, !0), this.isContainerDraggable(n) || n.setAsDraggable(this.getDragCriteriaForSubView());
            var s = this.getVideoOrScreenContainer(i);
            s.css({
                height: "",
                width: ""
            }), n.append(s)
        }
    },
    setContainerPosition: function(e, t) {
        var a = e.width(),
            i = e.height();
        t && (a += t);
        var n = e.offset().left,
            s = e.offset().top,
            l = ZCJQuery(window),
            r = l.width(),
            o = l.height();
        n + a > r && e.css("left", r - a), s + i > o && e.css("top", o - i)
    },
    setContainerPositionClass: function(e) {
        var t = e.offset();
        t.left + e.width() > ZCJQuery(window).width() && e.addClass("ZC-left"), t.top < 0 && e.removeClass("ZC-top").addClass("ZC-bottom"), t.top + e.height() > ZCJQuery(window).height() && e.removeClass("ZC-bottom").addClass("ZC-top")
    },
    openChatInRHS: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = this.getMediaCallWrapper(MediaCallImpl.getCurrentSession().getId());
            this.isInFullScreenView(t) && (MediaCallImpl.attachChat(e), ZCJQuery('[mediacallbuttons][purpose="openChatInRHS"]').attr({
                purpose: "closeChatInRHS",
                "av-tooltip-title": MediaUtil.getResource("common.hide")
            }).addClass("AV-call-active"), t.addClass("show-aside"), MediaCallUI.adjustMainVideoSectionSize(t, !0))
        }
    },
    closeChatInRHS: function() {
        if (MediaCallImpl.hasCurrentSession()) {
            var e = this.getMediaCallWrapper(MediaCallImpl.getCurrentSession().getId());
            this.isInFullScreenView(e) && (ZCJQuery('[mediacallbuttons][purpose="closeChatInRHS"]').attr({
                purpose: "openChatInRHS",
                "av-tooltip-title": MediaUtil.getResource("common.chat")
            }).removeClass("AV-call-active"), e.removeClass("show-aside"), MediaCallUI.adjustMainVideoSectionSize(e, !0))
        }
    },
    setUnreadMessageCount: function(e, t) {
        if (MediaCallImpl.hasCurrentSession() && (MediaCallImpl.setChatIdForMediaCallSession(e), MediaCallImpl.isValidChatForCurrentSession(e))) {
            var a = ZCJQuery("[mediacallunreadmsgcount]");
            t ? a.text(t).show() : a.hide().empty()
        }
    },
    handleGetMeFront: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = MediaCallImpl.getCurrentSession(),
                a = this.getMediaCallWrapper(t.getId());
            if (0 !== a.length) {
                this.adjustCallContainerHeight(a), t.hasChatId() && e !== t.getChatId() && (MainUI.isChatinViewport(t.getChatId()) || this.isInFullScreenView(a) || this.isInDetachedView(a) || this.setCallUIInBody(a));
                var i = ChatUI.exist[e];
                i && this.handleChatWindowCreated(i)
            }
        }
    },
    handleChatWindowCreated: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = e.chid;
            if (MediaCallImpl.setChatIdForMediaCallSession(t), MediaCallImpl.isValidChatForCurrentSession(t)) {
                var a = this.getMediaCallWrapper(MediaCallImpl.getCurrentSession().getId());
                if (this.isInFullScreenView(a)) {
                    if (ZCJQuery('[mediacallbuttons][purpose="openChatInRHS"]').attr({
                            purpose: "closeChatInRHS",
                            "av-tooltip-title": MediaUtil.getResource("common.hide")
                        }), a.addClass("show-aside"), MediaCallUI.adjustMainVideoSectionSize(a, !0), ZCJQuery("#mediacallchatsection").find("#" + t).length) return void e.focus();
                    MainUI.handleIframes(t);
                    var i = e.win();
                    ZCJQuery("#mediacallchatsection").html(i), this.toggleChatHeaderOptions(t, !0), i.show(), CodeSnippet.handleThemeForAVChat(!0), ZCScroll.customScroll(i.find("#chatbody"), !0), e.getScrollDown(), e.focus()
                }
            }
        }
    },
    toggleChatHeaderOptions: function(e, t) {
        var a = ZCJQuery("#mediacallchatsection").find("#" + e);
        a.length > 0 && ($(a).find("#chataddoptions").toggleClass("denied", t), $(a).find("#chatHeaderDropdown").toggleClass("denied", t))
    },
    handleChatWindowClosed: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = this.getMediaCallWrapper(MediaCallImpl.getCurrentSession().getId());
            this.adjustCallContainerHeight(t), MediaCallImpl.setChatIdForMediaCallSession(e), MediaCallImpl.isValidChatForCurrentSession(e) && this.isInFullScreenView(t) && (ZCJQuery("#mediacallchatsection").empty(), this.closeChatInRHS())
        }
    },
    handleDragEnd: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = MediaCallImpl.getCurrentSession().getId(),
                a = this.getMediaCallWrapper(t).find("#" + t + "dropdowncnt");
            a.length && this.setContainerPositionClass(a)
        }
    },
    handleResize: function() {
        var e = MediaCallImpl.getCurrentSession();
        if (void 0 !== e) {
            var t = this.getMediaCallWrapper(e.getId());
            this.adjustCallContainerHeight(t), MediaCallUI.isInFullScreenView(t) && this.adjustMainVideoSectionSize(t, !0), e.hasPresentation() && PresentationUI.handleResize()
        }
    },
    adjustMainVideoSectionSize: function(e, t) {
        var a = e.find(".AV-call-mainview, .AV-call-mainview-2").find("[videocontainer]"),
            i = {
                width: "",
                height: ""
            };
        if (t) {
            var n = e.find(".AV-call-mainview"),
                s = n.width(),
                l = n.height(),
                r = ZCMediaConstants.ASPECT_RATIO,
                o = s,
                d = o / r;
            d > l && (o = (d = l) * r), i.width = o, i.height = d, a.css(i)
        } else a.css(i)
    },
    setResizableForMiniPlayer: function(e) {
        var t = MediaUtil.getCriteriaForResize((function(e, t) {
                clearTimeout(MediaCallUI.resizeTimeout), MediaCallUI.resizeTimeout = setTimeout((function() {
                    MediaCallUI.handleResize()
                }), 100)
            })),
            a = e.find(".AV-call-mainview").find("video");
        if (a.length) {
            var i = a[0].getStream();
            i instanceof MediaStream && (t.aspectRatio = i.getAspectRatio() || a[0].getAspectRatio() || ZCMediaConstants.ASPECT_RATIO)
        }
        t.widthRange.min = 360, t.heightRange.min = 270, e.setAsResizable(t)
    },
    resetResizableForMiniPlayer: function(e) {
        e.removeResizable()
    },
    handleEscape: function() {
        if (MediaCallImpl.hasCurrentSession()) {
            var e = MediaCallImpl.getCurrentSession().getId(),
                t = this.getMediaCallWrapper(e),
                a = t.find("[switchnotifycnt]");
            if (a.length) return a.remove(), ZCJQuery("#mediacall_container").removeClass("AV-call-main-switch-wrapper"), !0;
            if (this.isInFullScreenView(t)) return MediaCallHandler.UIEvents.minimizeWindow(), !0
        }
        return !1
    },
    handleSwitchToVideoLayout: function() {
        var e = ZCJQuery("#mediacall_container");
        e.removeClass("AV-call-audio-only-wrapper").addClass("AV-call-audiovideo-wrapper"), e.find("[mediacallwrapper]").removeClass("AV-call-audio-only").addClass("AV-call-audiovideo").attr("audiovideowrapper", ""), MediaCallUI.setResizableForMiniPlayer(e)
    },
    adjustCallContainerHeight: function(e) {
        0 != e.length && (this.isInInitialLayout(e) || this.isInAudioLayout(e) ? e.parent().height("") : this.isInDetachedView(e) && this.setContainerPosition(e.parent()))
    },
    removeRejectMessageDialog: function(e) {
        this.getMediaCallWrapper(e).find("#rejectmessagedialog").remove()
    },
    removeCallUI: function(e) {
        var t = e.getId();
        e.hasChatId() && (MediaCallUI.toggleChatHeaderOptions(e.getChatId(), !1), MediaCallImpl.removeChat(e.getChatId())), e.isInPIP() && MediaCallImpl.exitFromPIPMode(e);
        var a = this.getMediaCallWrapper(t);
        a.length > 0 && (this.deleteMediaContainers(t), a.remove(), ZCJQuery("#mediacall_container").remove()), $WC.$Win.destroy("transfer_direct_call")
    },
    addEndCallTimer: function(e) {
        clearTimeout(this._endCallTimers[e]), this._endCallTimers[e] = setTimeout(function() {
            MediaCallUI.removeEndCallUI(e)
        }.bind(this), MediaCallConstants.endCallUIRemovalInterval)
    },
    removeEndCallTimer: function(e) {
        clearTimeout(this._endCallTimers[e]), delete this._endCallTimers[e]
    },
    removeEndCallUI: function(e) {
        this.removeEndCallTimer(e), this.deleteMediaContainers(e), this.getMediaCallWrapper(e).remove(), ZCJQuery("#mediacallendwrapper").remove()
    },
    showBeforeCallNetworkInfo: function(e, t) {
        var a = this.getMediaCallWrapper(e);
        if (a.length > 0) {
            var i = a.find("[networkindicator]");
            ZCMediaNetworkPredictorImpl.isPoorNetwork(t) ? (i.removeClass("zc-av-dN"), MediaCallImpl.trackPoorNetworkShown(e)) : i.addClass("zc-av-dN")
        }
    },
    hideBeforeCallNetworkInfo: function(e) {
        var t = this.getMediaCallWrapper(e).find("[networkindicator]");
        t.length > 0 && t.addClass("zc-av-dN")
    },
    updateNetworkHealthMeter: function(e, t, a, i, n) {
        var s = 0;
        if (t instanceof MediaStream) {
            if (t._hasVideoTrack() && !a.isVideoMuted() && MediaCallImpl.isValidNetworkScore(n)) s = n;
            else {
                if (!t._hasAudioTrack() || a.isAudioMuted() || !MediaCallImpl.isValidNetworkScore(i)) return;
                s = i
            }
            var l = MediaCallConstants.networkHealth.getScore(s),
                r = this.getMediaCallWrapper(e).find('[network_health_indicator][userId="' + a.getId() + '"]');
            MediaUtil.updateNetworkHealth(l, r)
        }
    },
    handleEnd: function(e, t) {
        var a = e.getId(),
            i = this.getMediaCallWrapper(a);
        if (MediaCall.BRIDGE && MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleCallEnd && MediaCall.BRIDGE.listener.handleCallEnd(e.getDetails()), t && "undefined" != typeof ZCMediaRecorder && ZCMediaRecorder.isVoiceNoteOnCallEndEnabled()) return e.isVideoCall() && MediaCallUI.getVideoContainer(a, e.getCurrentMemberId()).find("video").addClass("dN zc-av-dN"), i.parents("#mediacall_container").attr("id", "mediacallendwrapper"), i.find("[impulsecontainer]").remove(), i.find("[calloptions]").replaceWith(MediaCallTemplates.getEndOptionsHtml(e, !0)), void MediaCallUI.addEndCallTimer(a);
        e.isCallAnswered() && (MediaCallImpl.hasActiveAdhocCall(e) || ZCMediaFeedback.checkAndshow(a, e.getType(), void 0, {
            audio: !0,
            drag: !0,
            video: MediaCallImpl.isCurrentModeVideoCall(e),
            screen: e.isScreenShareWithAudioCall() || e.hadScreenShare()
        })), this.removeCallUI(e), "undefined" != typeof WhiteBoard && WhiteBoard.handleWhiteBoardEnd(), "undefined" != typeof PresentationImpl && PresentationImpl.handleEnd(e)
    },
    muteAudio: function(e) {
        var t = MediaCallUI.getMediaCallWrapper(e.getId());
        t.find('[mediacallbuttons][purpose="turnOffMicrophone"]').addClass("zcf-mic-mute").removeClass("zcf-mic").attr({
            purpose: "turnOnMicrophone",
            "av-tooltip-title": MediaUtil.getMicOnToolTip()
        }), t.addClass("AV-call-mute-banner"), ZCJQuery("#mediacall_container").addClass("AV-call-top-banner"), t.prepend(MediaTemplates.getMutedBanner(!0));
        var a = t.find("#mute_banner_container"),
            i = MediaTemplates.getAudioMuteInfo(MediaTemplates.getMuteBannerContent(!1));
        0 === a.length ? a.append(i) : a.html(i)
    },
    unmuteAudio: function(e) {
        var t = MediaCallUI.getMediaCallWrapper(e.getId());
        t.find('[mediacallbuttons][purpose="turnOnMicrophone"]').addClass("zcf-mic").removeClass("zcf-mic-mute").attr({
            purpose: "turnOffMicrophone",
            "av-tooltip-title": MediaUtil.getMicOffToolTip()
        }), t.removeClass("AV-call-mute-banner"), ZCJQuery("#mediacall_container").removeClass("AV-call-top-banner"), t.find("[mutedinfocnt]").remove(), t.find("#mute_banner_container").empty()
    },
    muteVideo: function(e) {
        MediaCallUI.getMediaCallWrapper(e.getId()).find('[mediacallbuttons][purpose="turnOffCamera"]').addClass("zcf-video-mute").removeClass("zcf-video").attr({
            purpose: "turnOnCamera",
            "av-tooltip-title": MediaCall.BRIDGE.Resource.getRealValue("videochat.cameraon")
        })
    },
    unmuteVideo: function(e) {
        MediaCallUI.getMediaCallWrapper(e.getId()).find('[mediacallbuttons][purpose="turnOnCamera"]').addClass("zcf-video").removeClass("zcf-video-mute").attr({
            purpose: "turnOffCamera",
            "av-tooltip-title": MediaCall.BRIDGE.Resource.getRealValue("videochat.cameraoff")
        })
    },
    handleAVStateForHandoff: function(e, t, a, i) {
        var n = e.getCurrentMember();
        t && (n.setAsSwitchedToVideo(), e.getOtherMember().setAsSwitchedToVideo()), a && (MediaCallUI.getVideoContainer(e.getId(), n.getId()).find("[audioMutedStatus]").removeClass("dN zc-av-dN"), n.updateAVStatus("audio", !0, MediaCall.BRIDGE.Util.getSyncedCurrentTime())), i && (MediaCallUI.getVideoContainer(e.getId(), n.getId()).find("video").addClass("dN zc-av-dN"), n.updateAVStatus("video", !0, MediaCall.BRIDGE.Util.getSyncedCurrentTime()))
    },
    answerCall: function(e, t, a) {
        MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.INCOMING), MediaCall.BRIDGE.handleTitleRevert();
        var i = MediaCallImpl.getFromIncomingSessions(e);
        MediaCallUI.removeRejectMessageDialog(e), void 0 !== i && (i.writeToLog(CallLogConstants.ui.answer), i.addLongPollingController(), i.isVideoCall() && "audio" === t && i.getCurrentMember().setVideoCallWithoutVideo(), MediaCall.initiateCallProcess(i, ZCMediaConstants.triggerSource.CALL_INCOMING_UI, a, a)), "undefined" != typeof CallHistoryData && CallHistoryData.markOngoingCallAsViewed(e)
    },
    removeCallSettings: function() {
        var e = MediaCallImpl.getCurrentSession();
        $WC.$Win.destroy("av_settings_win");
        var t = void 0 !== MediaCall.BRIDGE ? MediaCall.BRIDGE.getZIndex() : "";
        ZCJQuery("#zcwindows").css("z-index", t), e && MediaUtil.clearAudioPreview(e)
    },
    setDeviceInfoIndicationInCallUI: function(e, t, a) {
        t.getClientType() !== a && (a === ZCMediaConstants.clientTypes.WEB || a === ZCMediaConstants.clientTypes.DESKTOP ? e.find("[deviceinfo]").addClass("zcf-system").removeClass("zcf-mobile").attr({
            title: MediaUtil.getResource("avcliq.media.deviceinfo.web")
        }) : a === ZCMediaConstants.clientTypes.MOBILE && e.find("[deviceinfo]").addClass("zcf-mobile").removeClass("zcf-system").attr({
            title: MediaUtil.getResource("avcliq.media.deviceinfo.mobile")
        })), t.setClientType(a)
    },
    clearActionsOnSettingsTabSwitch: function(e) {
        e && (e.clearVideoEffectsPreview(), e.handleConnectionStatsTabClose(), MediaUtil.clearAudioPreview(e))
    },
    pipUtil: {
        paintVideosForPIP: function(e) {
            var t = e.getCanvasForPIP(),
                a = t.getContext("2d"),
                i = e.getId(),
                n = MediaCallUI.getMediaCallWrapper(i),
                s = MediaCallUI.isInAudioLayout(n),
                l = e.getCurrentMember(),
                r = e.getOtherMember(),
                o = MediaCallUI.getVideoContainer(i, l.getId()),
                d = MediaCallUI.getVideoContainer(i, r.getId()),
                c = void 0,
                C = e.isVideoCall() || e.getCurrentMember().hasSwitchedToVideo() && e.getOtherMember().hasSwitchedToVideo() || e.getOtherMember().isSharingScreen();
            ZCPIPUtil.applyCanvasDimension(a, C ? ZCMediaConstants.pip.videoWinDimension : ZCMediaConstants.pip.audioWinDimension);
            var u = new AVCliqDimensions(0, 0, t.width, t.height);
            if (ZCPIPUtil.paintMainBackground(a, u), r.isSharingScreen()) {
                var p = t.width / 3,
                    m = r.hasSwitchedToVideo() && !s,
                    h = m ? t.width - p : t.width;
                if (c = MediaCallUI.getScreenContainer(i, r.getId()), u.alterMeasurements(h, t.height), ZCPIPUtil.paintEachVideoInPIP(a, c, {
                        muted: !1,
                        mirror: !1
                    }, u.clone()), m) {
                    u.alterMeasurements(p, t.height), u.moveAxis(h, 0);
                    var g = MediaCall.BRIDGE.Users.getName(d.attr("userid")),
                        I = {
                            muted: r.isVideoMuted(),
                            mirror: !1,
                            name: g,
                            userId: d.attr("userid")
                        };
                    ZCPIPUtil.paintEachVideoInPIP(a, d, I, u.clone())
                }
            } else {
                if (e.isVideoCall() || l.hasSwitchedToVideo() && r.hasSwitchedToVideo()) {
                    var v = MediaCall.BRIDGE.Users.getName(o.attr("userid")),
                        M = {
                            muted: l.isVideoMuted(),
                            mirror: ZCMediaPreferences.isRotateVideoEnabledByUser(),
                            name: v,
                            userId: o.attr("userid")
                        };
                    u.alterMeasurements(t.width / 2, t.height), ZCPIPUtil.paintEachVideoInPIP(a, o, M, u.clone());
                    var _ = MediaCall.BRIDGE.Users.getName(d.attr("userid")),
                        f = {
                            muted: r.isVideoMuted(),
                            mirror: !1,
                            name: _,
                            userId: d.attr("userid")
                        };
                    u.moveAxis(t.width / 2, 0), ZCPIPUtil.paintEachVideoInPIP(a, d, f, u.clone())
                } else {
                    if (s) return void this.paintAudioLayoutforPIP(a, t, e);
                    var S = r,
                        T = !1;
                    l.hasSwitchedToVideo() && (S = l, T = !0);
                    var A = MediaCallUI.getVideoContainer(i, S.getId()),
                        R = A.attr("userid");
                    I = {
                        muted: S.isVideoMuted(),
                        mirror: T,
                        name: MediaCall.BRIDGE.Users.getName(R),
                        userId: R
                    };
                    u.alterMeasurements(t.width, t.height), ZCPIPUtil.paintEachVideoInPIP(a, A, I, u.clone())
                }
            }
        },
        paintAudioLayoutforPIP: function(e, t, a) {
            var i = a.getOtherMember(),
                n = MediaCall.BRIDGE.Users.getName(i.getId(), i.getName()),
                s = ZCJQuery("#mediacallsessiontimer"),
                l = s.find("[hours]").text(),
                r = s.find("[minutes]").text(),
                o = s.find("[seconds]").text(),
                d = parseInt(l) > 0,
                c = (d ? l + ":" : "") + r + ":" + o,
                C = new AVCliqDimensions(0, 0, t.width, t.height),
                u = MediaUtil.isAVLibraryLoadedInChatbar();
            C.alterMeasurements(t.width, 70), ZCPIPUtil.paintBackground(e, "rgba(0,0,0,0.4)", C), C.moveAxis(25, 50), ZCPIPUtil.drawText(e, ZCPIPUtil.getIconContent(i.getClientType(), u), C, {
                font: `33px ${u?"ZoFo-AVcall":"ZoFo-ChatBar-v2"}`
            }), C.moveAxis(50, -5), ZCPIPUtil.drawText(e, n, C, {
                maxWidth: t.width / 2,
                font: "27px Lato, sans-serif"
            });
            var p = d ? 120 : 80;
            C.moveAxis(t.width - (p + 130), 0), ZCPIPUtil.drawText(e, c, C, {
                font: "30px Lato, sans-serif"
            }), C.resetAxis(), C.moveAxis(t.width / 2, t.height / 2), ZCPIPUtil.drawUserImage(e, i.getId(), n, C, 100)
        }
    }
}, (MediaCallImpl = {
    _runningSession: void 0,
    previousSessionId: void 0,
    _outgoingSession: void 0,
    _handingOffSession: void 0,
    _incomingSessions: {},
    _handoffCallDetails: void 0,
    statsObjectApiMaxSize: void 0,
    renegotiateForUnmute: function(e, t, a, i) {
        var n = MediaCallImpl.getCurrentSession();
        if (n || n.getId() === e) {
            var s = n.getCurrentMember().getAVUpStream(),
                l = function(e, t) {
                    MediaManager.resetStreamRequested(), void 0 !== e && MediaManager.handleMediaError(e, t), void 0 !== i && i(e, t)
                },
                r = function(e) {
                    MediaManager.resetStreamRequested(), MediaCallImpl.hasCurrentSession() ? a(e) : WebRTCUserMedia.closeStream(e._getType())
                };
            void 0 === s ? t === WebRTCUserMedia.streamTypes.AUDIO_ONLY ? WebRTCUserMedia.requestAudioStream(r, l, void 0, MediaUtil.getAudioProcessingOptions(n)) : t === WebRTCUserMedia.streamTypes.VIDEO_ONLY && WebRTCUserMedia.requestVideoStream(r, l, void 0, MediaUtil.getVideoProcessingOptions(n)) : WebRTCUserMedia.requestAndAddTrackInStream(s, t, r, l, MediaUtil.getStreamProcessingOptions(n)), MediaManager.setAsStreamRequested(t, ZCMediaConstants.mediaModules.DIRECT_CALL)
        }
    },
    init: function() {
        MediaUtil.isAVLibraryLoadedInChatbar() && MediaCallImpl.bindOnBeforeUnloadEvent(), MediaCallConstants.setBaseUrl(), MediaCallUI.bindEvents(), MediaCall.handleIncomingCalls(), AVISCUtilBridge.initMessageListeners()
    },
    bindOnBeforeUnloadEvent: function() {
        ZCJQuery(window).on("beforeunload", (function(e) {
            if (MediaManager.hasOnGoingNewMediaCall()) return !0
        }))
    },
    requestScreenStream: function(e, t, a) {
        WebRTCUserMedia.requestScreenStream(e, t, a, MediaManager.getComputerAudioConstraints(), void 0, void 0, !0), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.SCREEN, ZCMediaConstants.mediaModules.DIRECT_CALL)
    },
    requestAVStream: function(e, t, a) {
        "audio" === e ? (WebRTCUserMedia.requestAudioStream(t, a, void 0, MediaUtil.getAudioProcessingOptions()), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL)) : "video" === e ? (WebRTCUserMedia.requestVideoStream(t, a, void 0, MediaUtil.getVideoProcessingOptions()), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.VIDEO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL)) : "audio_video" === e && (WebRTCUserMedia.requestAudioVideoStream(t, (function(e, i) {
            MediaManager.resetStreamRequested(), WebRTCUserMedia.requestAudioStream(t, a, void 0, MediaUtil.getAudioProcessingOptions()), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL)
        }), void 0, MediaUtil.getStreamProcessingOptions()), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_VIDEO, ZCMediaConstants.mediaModules.DIRECT_CALL))
    },
    requestStreamForMediaCall: function(e, t, a, i, n) {
        var s = function(e, t) {
                MediaManager.resetStreamRequested(), a(e, t)
            },
            l = function(e, t) {
                MediaManager.resetStreamRequested(), i(e, t)
            };
        t ? this.requestScreenStream((function(t) {
            MediaManager.resetStreamRequested(), e ? MediaCallImpl.requestAVStream(e, (function(e) {
                s(e, t)
            }), (function() {
                s(void 0, t)
            })) : s(void 0, t)
        }), l, n) : MediaCallImpl.requestAVStream(e, s, l)
    },
    openDeviceSettings: function(e, t, a, i, n) {
        var s = void 0 !== MediaCall.BRIDGE ? MediaCall.BRIDGE.getZIndex() : "1000";
        s = isNaN(s) ? s : parseInt(s) + 1, ZCJQuery("#zcwindows").css("z-index", s);
        var l = ZCDirectCallDialogs.getSettingsWin();
        l.removeClass("zc-av-dN"), l.find("[settingstab]").removeClass("active"), l.find("#av-devicesetting-lhs").addClass("active");
        var r = MediaCallImpl.getCurrentSession();
        MediaCallUI.clearActionsOnSettingsTabSwitch(r);
        var o = MediaDeviceWidget.getCurrentConfig(t, a, i, n);
        l.find("#av_settings_body").html(MediaCallTemplates.getDeviceSettingsHtml(r, e, o));
        var d = r.getCurrentMember().getAVUpStream();
        d && d._hasVideoTrack() && MediaUtil.setAndPlayStreamInMediaContainer(ZCJQuery("#av_settings_preview"), d, !0)
    },
    generateTitleForRecording: function(e) {
        var t = e.getCallerName() + "-" + e.getCalleeName() + "-" + $Date.getDateFieldString(new Date);
        if (t.length > ZCMediaConstants.MAX_TITLE_LENGTH) {
            var a = ZCMediaConstants.MAX_TITLE_LENGTH - 4;
            t = t.substring(0, a) + "..."
        }
        return MediaUtil.isValidTitle(t) ? t : MediaCall.BRIDGE.Resource.getRealValue("avcliq.media.recording") + "-" + $Date.getDateFieldString(new Date)
    },
    showMediaDeviceSettings: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = MediaCallImpl.getCurrentSession();
            if (t.writeToLog(CallLogConstants.ui.setMediaDevice), t.getId() === e) {
                Clickoutside.handleClickOnChild(event), MediaCallUI.clearActionsOnSettingsTabSwitch(t);
                var a = t.getCurrentMember(),
                    i = a.getAVUpStream();
                if (t.isMigratedForRecording()) {
                    var n = ZCSmartConferenceImpl.getCurrentActiveSession();
                    i = n.hasVideoUpStream() ? n.getVideoUpStream() : n.hasAudioUpStream() ? n.getAudioUpStream() : void 0
                }
                var s = {},
                    l = void 0,
                    r = MediaCallUI.getVideoContainer(e, t.getOtherMemberId()).find("video"),
                    o = 0 !== r.length;
                o && (l = r[0]), s.handleCustomUI = function(e, t, a, i, n) {
                    MediaCallImpl.openDeviceSettings(e, t, a, i, n)
                }, WebRTCUserMedia.isSetSinkIdSupported() && (s[ZCMediaDevices.kinds.AUDIO_OUTPUT] = o), t.isAudioCall() && !a.hasSwitchedToVideo() && (s[ZCMediaDevices.kinds.VIDEO_INPUT] = !1);
                MediaDeviceWidget.show((function(e) {
                    if (MediaCallImpl.hasCurrentSession() && (t.writeToLog(CallLogConstants.ui.changedDevice, e), !$WC.Util.isEmptyObject(e)))
                        if (ZCMediaDevices.setPreferredDevices(e, !0), t.isMigratedForRecording()) AdhocCallBridge.publish(t, "setMediaDevices", {
                            associatedSessionId: t.getAssociatedConferenceId(),
                            changedDevices: e
                        });
                        else if (e[ZCMediaDevices.kinds.AUDIO_OUTPUT] && MediaManager.setPreferredAudioOutput([l]), (e[ZCMediaDevices.kinds.AUDIO_INPUT] || e[ZCMediaDevices.kinds.VIDEO_INPUT]) && i) {
                        var n = WebRTCUserMedia.streamTypes.AUDIO_ONLY;
                        e[ZCMediaDevices.kinds.AUDIO_INPUT] && e[ZCMediaDevices.kinds.VIDEO_INPUT] ? n = WebRTCUserMedia.streamTypes.AUDIO_VIDEO : e[ZCMediaDevices.kinds.VIDEO_INPUT] && (n = WebRTCUserMedia.streamTypes.VIDEO_ONLY);
                        var s = i && i._hasAudioTrack() && i._isAudioRestrictedForConnection();
                        t.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.init + n), WebRTCUserMedia.requestAndReplaceTracksInStream(i, n, (function(e) {
                            MediaCallImpl.hasCurrentSession() ? (s && e._setConnectionRestrictionForAudio(), t.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.success), a.replaceTracksInStream(e, n), a.setUpdatedAVStatus()) : WebRTCUserMedia.closeStream(e._getType())
                        }), void 0, void 0, MediaUtil.getStreamProcessingOptions(t))
                    }
                }), s, i, i, l, (function() {
                    MediaUtil.clearAudioPreview(t)
                }))
            }
        }
    },
    reApplyAudioOutputPreference: function(e) {
        var t = MediaCallUI.getVideoContainer(e.getId(), e.getOtherMemberId());
        MediaManager.setPreferredAudioOutput([t.find("video")[0]])
    },
    handleTrackEnd: function(e, t) {
        var a = MediaCallImpl.getCurrentSession();
        a && ZCMediaUtil.switchToAvailableTrackForTrackEnd(e, t, a.getCurrentMember().getAVUpStream(), a, {
            successCB: (t, a) => {
                var i = MediaCallImpl.getCurrentSession();
                i ? (MediaManager.checkAndShowMicSwitchedInfo(t, a, !1), i.writeToLog(CallLogConstants.trackEnd.event), i.getCurrentMember().replaceTracksInStream(t, WebRTCUserMedia.streamTypes.AUDIO_ONLY), i.getCurrentMember().setUpdatedAVStatus(), e && e.currentTarget && e.currentTarget.label && i.writeToLog(CallLogConstants.trackEnd.device, e.currentTarget.label), MediaCallImpl.reApplyAudioOutputPreference(i)) : WebRTCUserMedia.closeStream(t._getType())
            },
            failureCB: () => {
                var e = MediaCallImpl.getCurrentSession();
                if (e) {
                    var t = ZCMediaPreferences.isSpeechDetectionAllowedByUser(),
                        a = e.getAVUpStream();
                    t && a && WebRTCUserMedia.closeStream(a._getType()), MediaCallImpl.handleMute(e.getId(), ZCMediaConstants.muteCases.trackEnd), MediaCallTemplates.showTrackEndedInfo(), MediaCallImpl.reApplyAudioOutputPreference(e)
                }
            },
            hasCurrentSession: () => MediaCallImpl.hasCurrentSession()
        })
    },
    handleRecordingAction: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = MediaCallImpl.getCurrentSession(),
                a = t.getCallConversionDetails();
            AdhocCallBridge.publish(t, "addUsers", {
                title: a.title,
                selectedList: a.userIds,
                recordingIndex: t.getCurrentMember().getRecordingReferenceIndex(),
                associatedSessionId: t.getAssociatedConferenceId(),
                recordingAction: e
            }), t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), MediaCallUI.adaptUIToState(t, MediaCallConstants.states.MIGRATING), t.resetDetailsForCallConversion()
        }
    },
    analyseAudioLoss: function(e, t) {
        var a = e.getCurrentMember().isAudioMuted() || e.getOtherMember().isAudioMuted();
        if (t) {
            var i = t.downstreamStrength,
                n = t.upstreamStrength;
            !a && i.rttScore > 7 && (n.audioPacketsSentScore > 7 || n.audioBytesSentScore > 7) && e.setAsInitialAudioLoss()
        }
        e.setAsAudioLossAnalysed()
    },
    addInIncomingSessions: function(e) {
        this._incomingSessions[e.getId()] = e
    },
    getAllIncomingSessions: function() {
        return this._incomingSessions
    },
    getFromIncomingSessions: function(e) {
        return this._incomingSessions[e]
    },
    hasCurrentIncomingSession: function() {
        return void 0 !== this.getCurrentIncomingSession()
    },
    getCurrentIncomingSession: function() {
        var e = this.getAllIncomingSessions();
        for (var t in e) {
            var a = e[t];
            if (a.isInCallRequestedState()) return a
        }
    },
    removeFromIncomingSessions: function(e) {
        delete this._incomingSessions[e]
    },
    setOutgoingSession: function(e) {
        this._outgoingSession = e
    },
    setHandingOffSession: function(e) {
        this._handingOffSession = e
    },
    getHandingOffSession: function() {
        return this._handingOffSession
    },
    hasHandingOffSession: function() {
        return void 0 !== this._handingOffSession
    },
    clearHandingOffSession: function() {
        this._handingOffSession = void 0
    },
    getOutgoingSession: function() {
        return this._outgoingSession
    },
    hasOutgoingSession: function() {
        return void 0 !== this._outgoingSession
    },
    clearOutgoingSession: function() {
        this._outgoingSession = void 0
    },
    hasCurrentSession: function() {
        return void 0 !== this._runningSession
    },
    getCurrentSession: function() {
        return this._runningSession
    },
    clearRunningSession: function(e) {
        this._runningSession.getId() === e && this.clearCurrentRunningSession()
    },
    clearCurrentRunningSession: function() {
        this.previousSessionId = this._runningSession.getId(), this._runningSession = void 0
    },
    setCurrentSession: function(e) {
        this.hasCurrentSession() && this.getCurrentSession().terminate();
        this._runningSession = e
    },
    isCurrentModeVideoCall: function(e) {
        return e.isVideoCall() || e.getCurrentMember().hasSwitchedToVideo() || e.getOtherMember().hasSwitchedToVideo()
    },
    getClientSupport: function() {
        var e = MediaUtil.isAVLibraryLoadedInChatbar(),
            t = void 0;
        t = e ? MediaCall.BRIDGE.Constants.IS_APPACC_USER && !MediaCall.BRIDGE.Constants.IS_GUEST_USER : MediaCall.BRIDGE.Constants.IS_APPACC_USER && !MediaCall.BRIDGE.Constants.IS_GUEST_USER && Conference && Conference.isInstantConferenceAllowed();
        var a = {
            perfect_renegotiation: !0,
            multi_stream: !0,
            initial_reconnection: !0,
            recording_support: !e && !MediaCall.BRIDGE.Constants.IS_GUEST_USER,
            handoff_support: !0,
            reconnection_policy: !0,
            close_track_on_mute: !0,
            call_collision_handling: !0,
            adhoc_call_support: t,
            lyra_support: MediaUtil.isLyraCodecInitialized(),
            whiteboard_support: !e,
            presentation_support: !e
        };
        return MediaCall.BRIDGE.Util.Browser.isChrome() || MediaCall.BRIDGE.Util.Browser.isSafari() || MediaCall.BRIDGE.Util.Browser.isOpera() ? WebRTCUserMedia.isDisplayMediaSupported() || (a = {
            perfect_renegotiation: !1,
            multi_stream: !1,
            initial_reconnection: !0,
            recording_support: !e && !MediaCall.BRIDGE.Constants.IS_GUEST_USER,
            handoff_support: !0,
            reconnection_policy: !0,
            close_track_on_mute: !0,
            call_collision_handling: !0,
            adhoc_call_support: t,
            lyra_support: MediaUtil.isLyraCodecInitialized(),
            whiteboard_support: !e,
            presentation_support: !e
        }) : MediaCall.BRIDGE.Util.Browser.isFirefox() && (a.perfect_renegotiation = !1), MediaCall.isNewRTCConnectionEnabled() && (a.new_rtc_connection_support = !0), a
    },
    updateSpeechDetectionInfo: function(e) {
        e.getCurrentMember().isAudioMuted() ? (MediaCallUI.showSpeechDetectedInfo(e), clearTimeout(MediaCallUI.speechIndicatorTimeout), MediaCallUI.speechIndicatorTimeout = setTimeout((function() {
            MediaCallUI.closeSpeechDetectedInfo(e)
        }), 5e3)) : MediaCallUI.closeSpeechDetectedInfo(e)
    },
    handleAudioProcessingConfigUpdate: function(e) {
        MediaCallImpl.hasCurrentSession() && (e ? MediaCallImpl.enableNoiseCancellation(MediaCallImpl.getCurrentSession()) : MediaCallImpl.disableNoiseCancellation(MediaCallImpl.getCurrentSession()))
    },
    handleSpeechDetectionConfigUpdate: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = MediaCallImpl.getCurrentSession(),
                a = t.getCurrentMember(),
                i = a.isAudioMuted();
            if (e || MediaCallUI.closeSpeechDetectedInfo(t), i)
                if (e) {
                    if (a.getAVUpStream()) return;
                    if (!MediaManager.isCustomRequestPending(ZCSmartConferenceConstants.requests.requestAudioStreamForSpeechDetection)) {
                        MediaManager.setCustomRequestAsPending(ZCSmartConferenceConstants.requests.requestAudioStreamForSpeechDetection), WebRTCUserMedia.requestAudioStream((function(e) {
                            MediaManager.setCustomRequestAsCompleted(ZCSmartConferenceConstants.requests.requestAudioStreamForSpeechDetection), MediaCallImpl.getCurrentSession() ? (a.setAVUpStream(e), MediaCallImpl.handleAVStatusChange("audio", !0)) : WebRTCUserMedia.closeStream(e._getType())
                        }), (function(e, t) {
                            MediaManager.setCustomRequestAsCompleted(ZCSmartConferenceConstants.requests.requestAudioStreamForSpeechDetection)
                        }), void 0, MediaUtil.getAudioProcessingOptions(t))
                    }
                } else MediaCallImpl.handleAVStatusChange("audio", !0)
        }
    },
    handleReconnection: function(e, t) {
        ZCMediaNetworkPredictorImpl.startCDNPolling(function(t) {
            e.writeToLog(CallLogConstants.cdnPolling + t)
        }.bind(this)), e.addLongPollingController(), e.writeToLog(CallLogConstants.webrtc.reconnect + t), MediaCallUI.adaptUIToState(e, MediaCallConstants.states.RECONNECTING), MediaCallImpl.playTone(e, MediaCallConstants.states.RECONNECTING)
    },
    isValidChatForCurrentSession: function(e) {
        return !!this.hasCurrentSession() && e === this.getCurrentSession().getChatId()
    },
    attachChat: function(e) {
        if (this.isValidChatForCurrentSession(e)) {
            var t = ChatUI.exist[e];
            t ? MediaCallUI.handleChatWindowCreated(t) : ConversationsList.attachContinueActiveChat(e)
        }
    },
    removeChat: function(e) {
        ZCJQuery("#mediacallchatsection").find("#" + e).length && MainUI.revertToViewPort(e)
    },
    setChatIdForMediaCallSession: function(e) {
        if (this.hasCurrentSession()) {
            var t = this.getCurrentSession();
            if (!t.hasChatId()) {
                var a = ChatUI.exist[e];
                if (a && a.isOnetoOneChat()) {
                    var i = Participants.get(a.chid);
                    if (!i || $WC.Util.isEmpty(i.getRecipientFor121Chat())) {
                        var n = ConversationsList.get(a.chid);
                        if (void 0 !== n) {
                            var s = ConversationsList.getRecipantFor121FromRecipants(n);
                            s && s.zuid === t.getOtherMemberId() && t.setChatId(a.chid)
                        }
                    } else i.getRecipientFor121Chat() === t.getOtherMemberId() && t.setChatId(a.chid)
                }
            }
        }
    },
    getRecipiantChatIdIfOpen: function(e) {
        return "function" == typeof MediaCall.BRIDGE.getOneToOneChatId ? MediaCall.BRIDGE.getOneToOneChatId(e) : void 0
    },
    filterRelayCandidates: function(e) {
        for (var t = [], a = 0; a < e.length; a++) "relay" === new RTCIceCandidate(e[a]).type && t.push(e[a]);
        return t
    },
    hasTurnCandidates: function(e) {
        for (var t = 0; t < e.length; t++) {
            var a = new RTCIceCandidate(e[t]);
            if ("relay" === a.type || "srflx" === a.type || "prflx" === a.type) return !0
        }
        return !1
    },
    startCall: function(e) {
        e.addNetworkPredictor(), e.writeToLog(CallLogConstants.callInit), MediaCallUI.adaptUIToState(e, MediaCallConstants.states.INITIATING), e.getCurrentMember().setClientSupport(MediaCallImpl.getClientSupport());
        var t = function(t) {
                if (this.hasOutgoingSession()) {
                    e.writeToLog(CallLogConstants.startCallAPI.success, t);
                    var a = new MediaCallSession(t);
                    e.getNetworkPredictor().updateId(a.getId()), a.setNetworkPredictor(e.getNetworkPredictor());
                    var i = MediaCallUI.getMediaCallWrapper(e.getId());
                    i.attr("callId", t.call_id);
                    var n = i.find("[other-username]");
                    if ($WC.Util.isEmpty(n.text()) && n.text(t.callee_name), e.isLiveFeedAssociated()) {
                        var s = e.getAssociatedLiveFeedId();
                        a.setAssociatedLiveFeedId(s);
                        var l = LiveFeedImpl.getIncomingFeedSession(s);
                        l && l.setAssociatedCallId(a.getId())
                    }
                    var r = e.getCurrentMember(),
                        o = a.getCurrentMember();
                    o.setAVUpStream(r.getAVUpStream()), o.setScreenUpStream(r.getScreenUpStream()), o.setClientSupport(MediaCallImpl.getClientSupport()), r.isScreenShareWithoutAudio() && o.setScreenShareWithoutAudio(), MediaCallUI.adaptUIToState(a, MediaCallConstants.states.CALLING), MediaCallImpl.playTone(a, MediaCallConstants.states.RINGING), this.setCurrentSession(a), a.setLogString(e.getLogString()), this.clearOutgoingSession(), a.startCall()
                } else MediaCallAPI.cancelCall(t.call_id)
            }.bind(this),
            a = function(t) {
                t && MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleCallAPIError && MediaCall.BRIDGE.listener.handleCallAPIError(t), this.hasOutgoingSession() && void 0 !== t && t.code === MediaCallAPI.errorCodes.ALREADY_ON_A_CALL ? MediaUtil.showMultipleCallAlertPopup(e.getOtherMemberId(), (function() {
                    var e = MediaCallImpl.getOutgoingSession();
                    e && e.getMultipleCallsHandlingType() !== MediaCallConstants.multipleCallHandlingType.END_ACTIVE_CALLS && (e.writeToLog(CallLogConstants.startCallAPI.failed), e.terminate(), MediaCallImpl.clearOutgoingSession(), MediaCallUI.removeCallUI(e))
                }), (function() {
                    if (MediaCallImpl.hasOutgoingSession()) {
                        var e = MediaCallImpl.getOutgoingSession();
                        e.setMultipleCallsHandlingType(MediaCallConstants.multipleCallHandlingType.END_ACTIVE_CALLS), MediaCallImpl.startCall(e)
                    }
                })) : (e.writeToLog(CallLogConstants.startCallAPI.failed), e.terminate(), this.clearOutgoingSession(), MediaCallUI.removeCallUI(e), t && void 0 !== t.message && MediaUtil.updateBanner(t.message, 3e3, !0))
            }.bind(this),
            i = {
                perfect_renegotiation: e.getCurrentMember().isPerfectRenegotiationSupported(),
                multi_stream: e.getCurrentMember().isMultiStreamSupported(),
                adhoc_call_support: e.getCurrentMember().isAdhocCallingSupported(),
                lyra_support: e.getCurrentMember().isLyraCodecSupported(),
                call_collision_handling: e.getCurrentMember().isCallCollisionSupported(),
                initial_reconnection: e.getCurrentMember().isInitialReconnectionSupported(),
                recording_support: e.getCurrentMember().isRecordingSupported(),
                handoff_support: e.getCurrentMember().isHandoffSupported(),
                reconnection_policy: !0,
                close_track_on_mute: !0,
                whiteboard_support: MediaCall.BRIDGE.isWhiteBoardAllowed(),
                presentation_support: MediaCall.BRIDGE.isPresentationAllowed()
            };
        MediaCall.isNewRTCConnectionEnabled() && (i.new_rtc_connection_support = e.getCurrentMember().isNewRTCConnectionSupported());
        var n = {
            type: e.getType(),
            client_support: JSON.stringify(i)
        };
        e.getCurrentMember().isScreenShareWithoutAudio() && (n.audio = JSON.stringify({
            muted: !0,
            time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
        })), e.writeToLog(CallLogConstants.clentSupport, i), e.writeToLog(CallLogConstants.startCallAPI.init), MediaCallAPI.startCall(e.getCalleeId(), e.getMultipleCallsHandlingType(), n, t, a)
    },
    answerCall: function(e) {
        e.setEventTime("CALL_UI_ANSWERED", MediaCall.BRIDGE.Util.getSyncedCurrentTime()), MediaCallUI.adaptUIToState(e, MediaCallConstants.states.CONNECTING), this.setCurrentSession(e), this.removeFromIncomingSessions(e.getId()), e.answerCall()
    },
    startCallHandOff: function(e) {
        this.setCurrentSession(e), this.clearHandingOffSession(), e.startCallHandOff()
    },
    connectCallHandOff: function(e, t) {
        var a = MediaCallImpl.getCurrentSession();
        a && a.getId() === e.data.call_id && (MediaCallUI.adaptUIToState(a, MediaCallConstants.states.HANDOFF_IN_PROGRESS), a.connectCallHandOff(t))
    },
    handleUnmute: function(e, t) {
        var a = MediaCallImpl.getCurrentSession();
        if (a && a.getId() === e) {
            if (a.isMigratedForRecording()) return AdhocCallBridge.publish(a, "audioUnMute", {
                associatedSessionId: a.getAssociatedConferenceId()
            }), !0;
            a.writeToLog(CallLogConstants.ui.micOn, {
                muteCase: t
            });
            var i = function(e) {
                MediaCallUI.unmuteAudio(a), MediaCallImpl.handleAVStatusChange("audio", !1), e && a.getCurrentMember().replaceAVUpStreamTrack(e, WebRTCUserMedia.streamTypes.AUDIO_ONLY)
            };
            return ZCMediaPreferences.isSpeechDetectionAllowedByUser() ? (MediaCallUI.closeSpeechDetectedInfo(a), i(a.getCurrentMember().getAVUpStream())) : MediaCallImpl.renegotiateForUnmute(e, WebRTCUserMedia.streamTypes.AUDIO_ONLY, i), !0
        }
    },
    handleMute: function(e, t) {
        var a = MediaCallImpl.getCurrentSession();
        if (a && a.getId() === e) return a.isMigratedForRecording() ? (AdhocCallBridge.publish(a, "audioMute", {
            associatedSessionId: a.getAssociatedConferenceId()
        }), !0) : (a.writeToLog(CallLogConstants.ui.micOff, {
            muteCase: t
        }), MediaCallUI.muteAudio(a), MediaCallImpl.handleAVStatusChange("audio", !0), !0)
    },
    handleVideoUnMute: function(e, t) {
        var a = MediaCallImpl.getCurrentSession();
        if (a && a.getId() === e) {
            if (a.isMigratedForRecording()) return void AdhocCallBridge.publish(a, "videoUnMute", {
                associatedSessionId: a.getAssociatedConferenceId()
            });
            a.writeToLog(CallLogConstants.ui.camOn, {
                muteCase: t
            });
            MediaCallImpl.renegotiateForUnmute(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY, (function(e) {
                if (MediaCallUI.unmuteVideo(a), MediaCallImpl.handleAVStatusChange("video", !1), a.getCurrentMember().replaceAVUpStreamTrack(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY), ZCDirectCallDialogs.isSettingsWinExist()) {
                    var t = ZCDirectCallDialogs.getSettingsWin();
                    t.find("video")[0].hasStream() || (a.clearVideoEffectsPreview(), MediaUtil.setAndPlayStreamInMediaContainer(t, e, !0))
                }
            }))
        }
    },
    handleVideoMute: function(e, t) {
        var a = MediaCallImpl.getCurrentSession();
        if (a && a.getId() === e) {
            if (a.isMigratedForRecording()) return void AdhocCallBridge.publish(a, "videoMute", {
                associatedSessionId: a.getAssociatedConferenceId()
            });
            a.writeToLog(CallLogConstants.ui.camOff, {
                muteCase: t
            }), MediaCallUI.muteVideo(a), MediaCallImpl.handleAVStatusChange("video", !0)
        }
    },
    getHandoffCallDetails: function() {
        return this._handoffCallDetails
    },
    storeHandoffCallDetails: function(e) {
        this._handoffCallDetails = e
    },
    clearHandoffCallDetails: function() {
        this._handoffCallDetails = void 0
    },
    handOffCall: function(e) {
        MediaCallAPI.getCallDetail(e, (function(t) {
            if ("CALL_END" !== t.status_text || "undefined" == typeof CallHistoryData) {
                var a = MediaCall.isVideoCall(t.type),
                    i = WmsImpl.isLocalUser(t.caller_id) ? t.callee_name : t.caller_name;
                MediaCallImpl.storeHandoffCallDetails(t), $WC.$Dlg.create({
                    id: "transfer_direct_call",
                    version: 3,
                    class: "zcl-alert-dialog-2 smartconf-transfercall-modal",
                    headerhtml: MediaTemplates.getTransferPanelHeaderHtml(a, i),
                    bodyhtml: MediaTemplates.getTransferPanelBodyHtml("mediacallbuttons", e, MediaUtil.getResource("avcliq.module.call").toLowerCase(), !1),
                    closefn: function() {
                        SessionTimers.clearTimer("transfercall_panel_timer")
                    }
                }), SessionTimers.setTimer("transfercall_panel_timer", {
                    startTime: t.start_time
                })
            } else CallHistoryData.syncOngoingCalls()
        }))
    },
    checkAndHandoffMediaSession: function(e, t, a, i) {
        MediaManager.handleExistingSessions((function() {
            MediaCallAPI.handOffCall(e, "complete_handoff", (function(e) {
                MediaCallImpl.hasHandingOffSession() && MediaCallImpl.getHandingOffSession().updateCallDetails(e)
            }), (function() {
                MediaCallImpl.handleEnd(e, !1)
            }));
            var n = new MediaCallSession({
                call_id: e,
                type: t,
                caller_id: a,
                callee_id: i,
                status_text: MediaCallConstants.statusText.CALL_HANDOFF_IN_PROGRESS
            });
            MediaCallImpl.setHandingOffSession(n), MediaCallUI.showCallUI(n), $WC.$Win.destroy("transfer_direct_call"), MediaCallImpl.clearHandoffCallDetails()
        }))
    },
    checkAndHandoffMigratedMediaSession: function(e, t, a) {
        MediaManager.handleExistingSessions((function() {
            var i = new MediaCallSession({
                call_id: e,
                type: a.type,
                caller_id: a.caller_id,
                callee_id: a.callee_id,
                status_text: MediaCallConstants.statusText.CALL_HANDOFF_IN_PROGRESS
            });
            i.updateCallDetails(a), i.setAssociatedConferenceId(t), i.setStartTime(a.start_time), i.resetInitialConnection(), i.setAsMigratedForRecording(), a.recording_index && i.getCurrentMember().setRecordingReferenceIndex(a.recording_index), MediaCallImpl.setHandingOffSession(i), MediaCallUI.showCallUI(i), $WC.$Win.destroy("transfer_direct_call"), MediaCallImpl.clearHandoffCallDetails(), MediaCallImpl.canPerformSilentJoin(a) && Conference.join(t, ZCMediaConstants.triggerSource.CONVERTED_CALL, () => {
                MediaCallImpl.setCurrentSession(MediaCallImpl.getHandingOffSession()), MediaCallImpl.clearHandingOffSession()
            }, void 0, !0)
        }))
    },
    checkAndHandleAdhocCallConnected: function(e, t) {
        var a = MediaCallImpl.getCurrentSession();
        a && a.isHandOffInProgress() && a.getAssociatedConferenceId() === t && (AdhocCallBridge.attach(a), MediaCallHandler.peerConnectionEvents.handleConnected(e), a.setStatusText(MediaCallConstants.statusText.CALL_MIGRATED), a.getCurrentMember().isRecording() && MediaCallUI.updateRecordingState(e, "start"))
    },
    switchToPIPMode: function(e) {
        if (!e.isInPIP()) {
            var t = e.getId(),
                a = e.isVideoCall() || e.getCurrentMember().hasSwitchedToVideo() && e.getOtherMember().hasSwitchedToVideo() || e.getOtherMember().isSharingScreen();
            ZCPIPManager.paintCanvasAndOpenPip(e.getCanvasForPIP(), a ? ZCMediaConstants.pip.videoWinDimension : ZCMediaConstants.pip.audioWinDimension, (function() {
                var e = MediaCallImpl.getCurrentSession();
                e && e.getId() === t && MediaCallUI.pipUtil.paintVideosForPIP(e)
            }), (function() {
                var e = MediaCallImpl.getCurrentSession();
                if (e && e.getId() === t) {
                    var a = MediaCallUI.getMediaCallWrapper(t),
                        i = ZCJQuery("#mediacall_container"),
                        n = a.find('[mediacallbuttons][purpose="openInPIP"]');
                    n.addClass("active"), n.attr({
                        purpose: "exitPIP",
                        "av-tooltip-title": MediaUtil.getResource("avcliq.media.exit.pip")
                    }), ZCPIPUtil.showPIPOverlay(a.find("[maincontainer]"), "mediacallbuttons"), i.addClass("avcall-pip-mode"), MediaCallHandler.UIEvents.minimizeWindow(), MediaCallUI.resetResizableForMiniPlayer(i)
                } else ZCPIPManager.exitPictureInPicture()
            }), MediaCallHandler.PIPEvents)
        }
    },
    exitFromPIPMode: function(e) {
        ZCPIPManager.exitPictureInPicture(void 0, () => {
            if (MediaCallImpl.hasCurrentSession()) {
                var t = MediaCallUI.getMediaCallWrapper(e.getId()),
                    a = ZCJQuery("#mediacall_container"),
                    i = t.find('[mediacallbuttons][purpose="exitPIP"]');
                i.removeClass("active"), i.attr({
                    purpose: "openInPIP",
                    "av-tooltip-title": MediaUtil.getResource("avcliq.media.open.pip")
                }), ZCPIPUtil.removePIPOverlay(t), ZCJQuery("#mediacall_container").removeClass("avcall-pip-mode"), MediaCallUI.setResizableForMiniPlayer(a), MediaCallUI.handleResize()
            }
        })
    },
    enableNoiseCancellation: function(e) {
        if (e && !e.isNoiseCancellationEnabled()) {
            var t = e.getCurrentMember().getAVUpStream();
            t && t._hasAudioTrack() ? t._hasAudioTrack() && MediaUtil.isNoiseCancellationSupported() && ZCAudioProcessor.processAudioStream(t, {
                noiseCancellation: !0
            }, e => {
                var t = MediaCallImpl.getCurrentSession();
                t && (e && (t.getCurrentMember().replaceAVUpStreamTrack(e, WebRTCUserMedia.streamTypes.AUDIO_ONLY), t.getCurrentMember().setUpdatedAVStatus()), t.setNoiseCancellationAsEnabled())
            }, () => {}) : e.setNoiseCancellationAsEnabled()
        }
    },
    disableNoiseCancellation: function(e) {
        if (e && e.isNoiseCancellationEnabled()) {
            var t = e.getCurrentMember().getAVUpStream();
            t && t._hasAudioTrack() ? (ZCAudioProcessor.stopAudioProcessing(t, {
                noiseCancellation: !0
            }), e.setNoiseCancellationAsDisabled()) : e.setNoiseCancellationAsDisabled()
        }
    },
    closeSessionWithoutNotifyingServer: function(e) {
        SessionTimers.clearTimer("mediacallsessiontimer"), SessionTimers.clearTimer("mediacallsessionsubtimer"), e.terminate(), MediaCallImpl.stopTone(MediaCallConstants.states.RECONNECTING), MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.RINGING), MediaCallImpl.stopTone(MediaCallConstants.states.RECORDING_STARTED), MediaCallImpl.stopTone(MediaCallConstants.states.RECORDING_STOPPED), MediaCallImpl.clearCurrentRunningSession(), "function" == typeof MediaCall.BRIDGE.handleDarkMode && MediaCall.BRIDGE.handleDarkMode(!1), $WC.$Win.destroy("media_device_widget"), MediaCallUI.removeCallSettings(), Clickoutside.clear(e.getId() + "dropdowncnt"), MediaCallHandler.UIEvents.closeAddParticipantWin(), MediaCallUI.handleEnd(e, !1)
    },
    setAVStateForHandOff: function(e, t) {
        var a = t.has_switched_to_video,
            i = t.is_sharing_screen,
            n = t.audio.muted,
            s = t.video.muted,
            l = function(t) {
                MediaManager.setRequestCompleted(), e.writeToLog(CallLogConstants.getMediaDevicesSuccess), MediaUtil.logAvailableDevices(e, t);
                var l = function(t, a) {
                        if (e.writeToLog(CallLogConstants.streamRequest.success), MediaManager.resetStreamRequested(), MediaCallImpl.hasHandingOffSession()) {
                            var i = e.getCurrentMember();
                            if (i.setAVUpStream(t), i.setScreenUpStream(a), void 0 !== t) {
                                var n = MediaCallUI.getVideoContainer(e.getId(), i.getId()),
                                    s = MediaCallUI.getMediaCallWrapper(e.getId());
                                MediaUtil.setStreamInContainer(i.getId(), n, t, (function() {
                                    WebRTCUserMedia.isAudioVideoStreamType(t._getType()) && s.find("[videowrapper]").addClass("AV-call-preview")
                                }))
                            }
                            void 0 !== a && (a._getPrimaryVideoTrack().applyConstraints({
                                frameRate: {
                                    min: 15,
                                    max: 15
                                }
                            }).catch(), i.setAsSharingScreen(), e.setAsScreenShared()), MediaCallImpl.startCallHandOff(e)
                        } else void 0 !== t && WebRTCUserMedia.closeStream(t._getType())
                    },
                    r = function(t, a) {
                        e.writeToLog(CallLogConstants.streamRequest.failed), MediaCallImpl.clearHandingOffSession(), MediaCallUI.removeCallUI(e), MediaManager.handleMediaError(t, a), MediaManager.resetStreamRequested()
                    },
                    o = function() {
                        e.writeToLog(CallLogConstants.streamRequest.screen.stopped), MediaCallHandler.UIEvents.stopScreenShare()
                    };
                s ? n ? i ? MediaCallImpl.requestStreamForMediaCall(void 0, i, l, r, o) : (e.getCurrentMember().setAudioMuted(), MediaCallImpl.requestStreamForMediaCall("audio", !1, l, r), n = !1) : MediaCallImpl.requestStreamForMediaCall("audio", i, l, r, o) : MediaCallImpl.requestStreamForMediaCall(n && !ZCMediaPreferences.isSpeechDetectionAllowedByUser() ? "video" : "audio_video", i, l, r, o), MediaCallUI.handleAVStateForHandoff(e, a, n, s)
            };
        MediaManager.setRequestPending({
            module: ZCMediaConstants.sessionTypes.CALLS,
            request_type: ZCMediaConstants.requestTypes.DEVICES
        }), WebRTCUserMedia.getMediaDevices(l, l)
    },
    setAudioOutputDevice: function(e, t) {
        0 !== e.length && ZCMediaDevices.hasPreferredAudioOutput() && ZCMediaDevices.isValidDevice(ZCMediaDevices.kinds.AUDIO_OUTPUT, t) && e[0].setSinkId(t).catch((function() {}))
    },
    triggerSessionTimer: function(e) {
        if (this.getCurrentSession()) {
            var t = {
                startTime: e
            };
            SessionTimers.setTimer("mediacallsessiontimer", t), SessionTimers.setTimer("mediacallsessionsubtimer", t)
        }
    },
    playIncomingTone: function(e) {
        var t = void 0 !== MediaCall.BRIDGE.Settings && 1 === MediaCall.BRIDGE.Settings.get("globalsoundnotify");
        if (t && (t = e ? 1 === MediaCall.BRIDGE.Settings.get("av_call_sound_notify") : 1 === MediaCall.BRIDGE.Settings.get("screen_call_sound_notify"))) {
            var a = MediaManager.hasOnGoingSession() ? "WAITING_TONE" : "INCOMING_TONE";
            this.stopToneById(a), void 0 !== MediaCall.BRIDGE.SoundManager && MediaCall.BRIDGE.SoundManager.play(a, MediaCall.BRIDGE.Constants.MEDIADEFAULTSTATICURL + MediaCallConstants.MEDIA_PATH + MediaCallConstants.fileNames.INCOMING_TONE, {
                loop: !0
            })
        }
    },
    startPushToTalk: function() {
        var e = this.getCurrentSession();
        if (e.getCurrentMember().isAudioMuted()) {
            var t = e.getId(),
                a = MediaCallUI.getMediaCallWrapper(t);
            if (MediaCallUI.isInFullScreenView(a)) return MediaCallImpl.handleUnmute(t, ZCMediaConstants.muteCases.pushToTalk), e.setPushToTalkState(!0), !0
        }
        return !1
    },
    stopPushToTalk: function() {
        var e = this.getCurrentSession();
        if (e.isPushToTalkEnabled() && !e.getCurrentMember().isAudioMuted()) {
            var t = e.getId(),
                a = MediaCallUI.getMediaCallWrapper(t);
            if (MediaCallUI.isInFullScreenView(a)) return MediaCallImpl.handleMute(t, ZCMediaConstants.muteCases.pushToTalk), e.setPushToTalkState(!1), !0
        }
        return !1
    },
    trackPoorNetworkShown: function(e) {
        var t = MediaCallImpl.getCurrentSession();
        void 0 === t && MediaCallImpl.hasCurrentIncomingSession(e) && (t = MediaCallImpl.getFromIncomingSessions(e)), t && !t.isPoorNetworkTracked() && (void 0 !== MediaCall.BRIDGE.Tracker && MediaCall.BRIDGE.Tracker.track("AV_POOR_NETWOTK_SHOWN"), t.setPoorNetworkTracked())
    },
    handleCallRingingTimeout: function(e) {
        var t = function(t) {
            var a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === e) {
                if (!a.isInCallAnsweredState() && void 0 !== t && void 0 !== t.answer_description) {
                    if (MediaCallImpl.handleCallAnswered(a, t), t.data.callee_client_type) {
                        var i = MediaCallUI.getVideoContainer(t.data.call_id, a.getOtherMemberId());
                        MediaCallUI.setDeviceInfoIndicationInCallUI(i, a.getOtherMember(), t.data.callee_client_type)
                    }
                    return
                }
                a.handleCallMissed()
            }
        };
        MediaCallAPI.updateCallStatus(e, MediaCallConstants.statusText.CALL_MISSED, t.bind(this), t.bind(this))
    },
    handleCallAnswered: function(e, t) {
        e.writeToLog(CallLogConstants.wms.callAnswered, t), MediaCallAPI.updateCallStatus(e.getId(), MediaCallConstants.statusText.CALL_ANSWERED_ACK, void 0, void 0);
        var a = e.getOtherMember();
        void 0 !== t.client_support && a.setClientSupport(t.client_support), t.callee_audio_status && t.callee_audio_status.muted && a.setAudioMuted(), t.callee_video_status && t.callee_video_status.muted && a.setVideoMuted();
        var i = t.answered_client_time;
        if (i && i > 0) {
            var n = MediaCall.BRIDGE.Util.getSyncedCurrentTime() - i;
            !isNaN(n) && n > MediaCallConstants.callAnsweredDelayThreshold && MediaCallAPI.pushCallEventLog(e.getId(), MediaCallConstants.logEvents.ANSWERED_ACK_DELAY, void 0, n)
        }
        var s = t.answer_description;
        void 0 !== s && (s = JSON.parse(s)), e.handleCallAnswered(s, t.tracks_media_id), t.caller_id === MediaCall.BRIDGE.Constants.ZUID && (MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.RINGING)), MediaCallUI.adaptUIToState(e, MediaCallConstants.states.CONNECTING), e.isLyraCodecSupported() && !e.isUsingLyra() && (e.getCurrentMember().reconnectCall(), MediaCallImpl.stopTone(MediaCallConstants.states.RECONNECTING))
    },
    playTone: function(e, t) {
        var a = void 0,
            i = void 0,
            n = void 0 !== MediaCall.BRIDGE.isAVCliqNotifyOwner ? MediaCall.BRIDGE.isAVCliqNotifyOwner() : MediaCall.BRIDGE.isWmsOwner();
        n = n ? !MediaCall.BRIDGE.Status.isDND() : n;
        var s = {
            loop: !0,
            mildTone: !1
        };
        t === MediaCallConstants.states.INCOMING && n ? this.playIncomingTone(e.isAudioCall() || e.isVideoCall()) : t === MediaCallConstants.states.CALLING ? (a = MediaCallConstants.fileNames.WAITING_TONE, i = "WAITING_TONE") : t === MediaCallConstants.states.RINGING ? (a = MediaCallConstants.fileNames.RINGING_TONE, i = "RINGING_TONE") : t === MediaCallConstants.states.RECONNECTING ? (a = MediaCallConstants.fileNames.RECONNECTING_TONE, i = "RECONNECTING_TONE") : t === MediaCallConstants.states.END ? (a = MediaCallConstants.fileNames.CALL_END_TONE, s.loop = !1, s.mildTone = !0, i = "CALL_END_TONE") : t === MediaCallConstants.states.RECORDING_STARTED ? (a = MediaCallConstants.fileNames.RECORDING_START, s.loop = !1, i = "RECORDING_START") : t === MediaCallConstants.states.RECORDING_STOPPED && (a = MediaCallConstants.fileNames.RECORDING_STOP, s.loop = !1, i = "RECORDING_STOP"), void 0 !== i && (this.stopToneById(i), void 0 !== MediaCall.BRIDGE.SoundManager && MediaCall.BRIDGE.SoundManager.play(i, MediaCall.BRIDGE.Constants.MEDIADEFAULTSTATICURL + MediaCallConstants.MEDIA_PATH + a, s))
    },
    stopToneById: function(e) {
        void 0 !== MediaCall.BRIDGE.SoundManager && MediaCall.BRIDGE.SoundManager.stop(e)
    },
    stopTone: function(e) {
        var t = void 0;
        e === MediaCallConstants.states.INCOMING ? t = "INCOMING_TONE" : e === MediaCallConstants.states.CALLING ? t = "WAITING_TONE" : e === MediaCallConstants.states.RINGING ? t = "RINGING_TONE" : e === MediaCallConstants.states.RECONNECTING ? t = "RECONNECTING_TONE" : e === MediaCallConstants.states.END && (t = "CALL_END_TONE"), void 0 !== t && void 0 !== MediaCall.BRIDGE.SoundManager && MediaCall.BRIDGE.SoundManager.stop(t)
    },
    handleAVStatusChange: function(e, t) {
        if (this.hasCurrentSession()) {
            var a = MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                i = this.getCurrentSession(),
                n = i.getCurrentMember();
            n.handleAVStreamStatus(e, t, a);
            var s = t ? "off" : "on";
            MediaCallAPI.updateStreamSourceState(i.getId(), e, s, a), ZCJQuery("#av_settings_preview").toggleClass("avcliq-video-muted", n.isVideoMuted())
        }
    },
    handleRejectMessage: function(e, t, a) {
        if (!$WC.Util.isEmpty(t)) {
            var i = MediaCallImpl.getFromIncomingSessions(e);
            if (void 0 !== i) {
                if (t.length > ZCMediaConstants.REJECT_MESSAGE_MAX_LENGTH) return void UI.updateBanner(MediaUtil.getResource("videochat.incommingreply.errormsg"), 2e3, !0);
                i.getChatId();
                var n = {};
                this.chid && (n.chat_id = this.chid), n.callee = i.getOtherMemberId(), n.message = t, n.custom = a, MediaCallImpl.handleEnd(e, !0, {
                    messageData: n
                })
            }
        }
    },
    handleAudioDeviceAdded: function(e, t) {
        var a = e.getCurrentMember().getAVUpStream(),
            i = void 0 !== t[ZCMediaDevices.kinds.AUDIO_OUTPUT];
        if (i && MediaCallImpl.reApplyAudioOutputPreference(e), t[ZCMediaDevices.kinds.AUDIO_INPUT]) {
            t[ZCMediaDevices.kinds.AUDIO_INPUT] && void 0 !== a && (e.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.init + "audio"), WebRTCUserMedia.requestAndReplaceTracksInStream(a, WebRTCUserMedia.streamTypes.AUDIO_ONLY, (function(e) {
                if (MediaCallImpl.hasCurrentSession()) {
                    var t = MediaCallImpl.getCurrentSession(),
                        i = t.getCurrentMember();
                    t.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.success), i.replaceTracksInStream(e, WebRTCUserMedia.streamTypes.AUDIO_ONLY), i.setUpdatedAVStatus(), MediaManager.checkAndShowMicSwitchedInfo(e, a, !0), MediaCallUI.updateAudioDevicesInSessionPreview(t)
                } else WebRTCUserMedia.closeStream(e._getType())
            }), void 0, void 0, MediaUtil.getAudioProcessingOptions(e)))
        } else i && (MediaManager.checkAndShowAddedSpeakerSwitchedInfo(t[ZCMediaDevices.kinds.AUDIO_OUTPUT]), MediaCallUI.updateAudioDevicesInSessionPreview(e))
    },
    updateAPIResponseTimeInLog: function(e, t, a, i, n) {
        var s = MediaCallImpl.getCurrentSession(),
            l = {
                url: t,
                type: a,
                status: i,
                startTime: n,
                endTime: new Date,
                interval: Math.abs(new Date - n) + " ms"
            };
        if (ZCMediaNetworkPredictorImpl.addHttpRequestInfo(l), s && s.getId() === e) s.writeToLog(CallLogConstants.responseTime, l);
        else {
            var r = MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== r && r.writeToLog(CallLogConstants.responseTime, l)
        }
    },
    showAsUnreadForSender: function(e) {
        return e.mode === MediaCallConstants.INFO_MSG_MODE && void 0 !== e.info && void 0 !== e.info.msg && MediaCallConstants.isCallMissedOnBusy(e.info.msg.status)
    },
    isLocalCallId: function(e) {
        return e === MediaCallConstants.defaultCallId
    },
    isValidNetworkScore: function(e) {
        return !(void 0 === e || isNaN(e) || null == e || e < 0 || e > 5)
    },
    updateNetworkHealthMeter: function(e) {
        var t = e.getId(),
            a = e.getCallStrengthAnalyser().getScore(),
            i = e.getCurrentMember(),
            n = a.upStreamScore,
            s = a.performanceScore;
        MediaCallUI.updateNetworkHealthMeter(t, i.getAVUpStream(), i, n.audioUpStreamPerformanceScore, n.videoUpStreamPerformanceScore), MediaCallUI.updateNetworkHealthMeter(t, i.getAVDownStream(), e.getOtherMember(), s.audioPerformanceScore, s.videoPerformanceScore)
    },
    isAVLoadedInIntegratedUI: function() {
        return !MediaCall.BRIDGE.Constants.IS_GUEST_USER && !MediaUtil.isAVLibraryLoadedInChatbar() && ("function" == typeof _isWorkplace && _isWorkplace() || "function" == typeof _isZohoOne && _isZohoOne() || "undefined" != typeof ISCUtil && ISCUtil.isUIIntegrated() || "undefined" != typeof UI && UI.isKalviBundle())
    },
    getLoggableSessionObject: function(e) {
        var t = $ZCUtil.cloneObject(e);
        return delete t._logString, t
    },
    hasActiveAdhocCall: function(e) {
        if (e.isMigratedCall() && !e.isMigratedForRecording() && "undefined" != typeof ZCSmartConferenceImpl) {
            var t = ZCSmartConferenceImpl.getCurrentActiveSession();
            return t && t.getId() === e.getAssociatedConferenceId()
        }
        return !1
    },
    getWebrtcStatsForCallEnd: function(e, t) {
        var a = e.getCurrentMember()._connection;
        a && a._connection ? a._connection.getStats().then((function(e) {
            var a = {
                totalPacketsSent: 0,
                totalPacketsReceived: 0,
                totalPacketsLost: 0,
                totalBytesSent: 0
            };
            e.forEach((function(e) {
                "inbound-rtp" === e.type && (a.totalPacketsLost = a.totalPacketsLost + e.packetsLost, a.totalPacketsReceived = a.totalPacketsReceived + e.packetsReceived), "outbound-rtp" === e.type && (a.totalPacketsSent = a.totalPacketsSent + e.packetsSent, a.totalBytesSent = a.totalBytesSent + e.bytesSent)
            })), t(a)
        })).catch((function(e) {
            t()
        })) : t()
    },
    pushEventLogsOnCallEnd: function(e, t) {
        var a = e.getId(),
            i = ZCMediaNetworkPredictorImpl.getAvgCdnRtt(),
            n = ZCMediaNetworkPredictorImpl.getAvgWmsRtt(),
            s = ZCMediaNetworkPredictorImpl.getInitialCDNRtt() || 0,
            l = e.hasInitialAudioLoss(),
            r = 0,
            o = void 0,
            d = void 0,
            c = void 0,
            C = void 0,
            u = void 0,
            p = void 0,
            m = void 0,
            h = void 0,
            g = void 0,
            I = e.getIceGatheringStates();
        I && Object.keys(I).length > 0 && (o = I.gathering, d = I.complete);
        var v = e.getIceConnectionStates();
        v && Object.keys(v).length > 0 && (c = v.checking, C = v.connected || v.complete);
        var M = e.getCandidateGenerationTime();
        M && Object.keys(M).length > 0 && (u = M.host, p = M.relay, m = M.srflx || M.prflx);
        var _ = e.getEventTimeObj();
        _ && Object.keys(_).length > 0 && (h = _.ANSWER_API_RESPONSE - _.CALL_UI_ANSWERED, g = _.CALL_RECEIVED_API_RESPONSE - _.CALL_RECEIVED_EVENT), MediaCallImpl.getWebrtcStatsForCallEnd(e, function(I) {
            var v = [],
                M = MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                _ = e.getCurrentMember().getlogsFromConnectionMonitor();
            if (_ && Object.keys(_).length > 0)
                for (var f of Object.keys(_)) _[f] > 0 && v.push({
                    name: f,
                    value: _[f],
                    client_time: M
                });
            I && (I.totalPacketsSent && v.push({
                name: MediaCallConstants.logEvents.TOTAL_PACKETS_SENT,
                value: I.totalPacketsSent,
                client_time: M
            }), I.totalPacketsLost && v.push({
                name: MediaCallConstants.logEvents.TOTAL_PACKETS_LOST,
                value: I.totalPacketsLost,
                client_time: M
            }), I.totalPacketsReceived && v.push({
                name: MediaCallConstants.logEvents.TOTAL_PACKETS_RECEIVED,
                value: I.totalPacketsReceived,
                client_time: M
            }), I.totalBytesSent && v.push({
                name: MediaCallConstants.logEvents.TOTAL_BYTES_SENT,
                value: I.totalBytesSent,
                client_time: M
            })), l && v.push({
                name: MediaCallConstants.logEvents.INITIAL_AUDIO_LOSS,
                client_time: M
            }), ZCMediaNetworkPredictorImpl.getCurrentCDNRtt((function(l) {
                l && (r = l), i && (v.push({
                    name: MediaCallConstants.logEvents.AVG_RTT,
                    value: i,
                    client_time: M
                }), i > ZCMediaNetworkPredictorImpl.NETWORK_RTT_MAX_THRESHOLD && v.push({
                    name: "NETWORK_POOR",
                    value: i,
                    client_time: M
                })), n && (v.push({
                    name: MediaCallConstants.logEvents.AVG_WMS_RTT,
                    value: n,
                    client_time: M
                }), i > ZCMediaNetworkPredictorImpl.WMS_RTT_MAX_THRESHOLD && v.push({
                    name: "WMS_RTT_POOR",
                    value: n,
                    client_time: M
                })), s && v.push({
                    name: MediaCallConstants.logEvents.RTT_CALL_START,
                    value: s,
                    client_time: e.getStartTime()
                }), r && v.push({
                    name: MediaCallConstants.logEvents.RTT_CALL_END,
                    value: r,
                    client_time: M
                }), o && v.push({
                    name: MediaCallConstants.logEvents.FIRST_ICE_CANDIDATE,
                    client_time: o
                }), d && v.push({
                    name: MediaCallConstants.logEvents.LAST_ICE_CANDIDATE,
                    client_time: d
                }), c && v.push({
                    name: MediaCallConstants.logEvents.FIRST_ADD_CANDIDATE,
                    client_time: c
                }), C && v.push({
                    name: MediaCallConstants.logEvents.LAST_ADD_CANDIDATE,
                    client_time: C
                }), u && v.push({
                    name: MediaCallConstants.logEvents.ICE_CANDIDATE_HOST,
                    client_time: u
                }), p && v.push({
                    name: MediaCallConstants.logEvents.ICE_CANDIDATE_RELAY,
                    client_time: p
                }), m && v.push({
                    name: MediaCallConstants.logEvents.ICE_CANDIDATE_SRFLX,
                    client_time: m
                }), h && v.push({
                    name: MediaCallConstants.logEvents.ANSWER_CALL_REQ_TIME,
                    value: h,
                    client_time: M
                }), g && v.push({
                    name: MediaCallConstants.logEvents.CALL_RECIEVED_REQ_TIME,
                    value: g,
                    client_time: M
                }), v.length > 0 && MediaCallAPI.pushEventsLogArray(a, v, t)
            }))
        }.bind(this))
    },
    punchLogsOnCallEnd: function(e) {
        var t = e.getId();
        if (MediaCallImpl.pushEventLogsOnCallEnd(e, e.isCaller(MediaCall.getCurrentUserId())), MediaUtil.isNewAVDomainRoutingEnabled() && AVCliqIframeHandler.isLoaded()) {
            var a = e.getLogString(),
                i = e.getType(),
                n = e.getStatusText();
            MediaCallAPI.sendClientLogData(t, a, "[" + i + " Call] [" + n + "]", i)
        } else MediaAPI.uploadClientLog(t, "calls", e.getLogAsFile(t), "[" + e.getType() + " Call] [" + e.getStatusText() + "]", e.getType())
    },
    handleEnd: function(e, t, a) {
        var i = this.getCurrentSession(),
            n = void 0 !== i && i.getId() === e,
            s = void 0 !== a && a.showCallEndUI,
            l = !0;
        if (n ? (SessionTimers.clearTimer("mediacallsessiontimer"), SessionTimers.clearTimer("mediacallsessionsubtimer")) : (i = this.getFromIncomingSessions(e), l = !!t || void 0 !== a && a.uploadClientLog), void 0 !== i) {
            if (t = !i.isMigratedForRecording() && t, i.writeToLog(CallLogConstants.callEnd, {
                    notifyServer: t,
                    additionalData: a
                }), l && (MediaCallImpl.punchLogsOnCallEnd(i), "undefined" != typeof CallHistoryData && CallHistoryData.removeOngoingDirectCall(e)), t)
                if (i.isInInitialState())
                    if (i.isCaller(MediaCall.BRIDGE.Constants.ZUID)) MediaCallAPI.cancelCall(e);
                    else if (void 0 !== a && void 0 !== a.messageData) {
                MediaCallAPI.declineCall(e, a.messageData, function(e) {
                    a.messageData.custom && MediaCallRejectMessages.updateMessageList({
                        msg: a.messageData.message
                    })
                }.bind(this), (function() {
                    UI.updateBanner(MediaUtil.getResource("chat.message.send.error"), 2e3, !0)
                }))
            } else MediaCallAPI.declineCall(e);
            else MediaCallAPI.endCall(e);
            var r = this.hasActiveAdhocCall(i);
            i.terminate(r), n ? (MediaCallImpl.stopTone(MediaCallConstants.states.RECONNECTING), MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.RINGING), MediaCallImpl.stopTone(MediaCallConstants.states.RECORDING_STARTED), MediaCallImpl.stopTone(MediaCallConstants.states.RECORDING_STOPPED), this.clearCurrentRunningSession(), r || "function" == typeof MediaCall.BRIDGE.handleDarkMode && MediaCall.BRIDGE.handleDarkMode(!1), $WC.$Win.destroy("media_device_widget"), MediaCallUI.removeCallSettings(), Clickoutside.clear(i.getId() + "dropdowncnt"), MediaCallHandler.UIEvents.closeAddParticipantWin()) : (this.removeFromIncomingSessions(e), MediaCall.BRIDGE.handleTitleRevert(), MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.INCOMING)), MediaCallUI.handleEnd(i, s);
            var o = MediaUtil.isAVLibraryLoadedInChatbar();
            i.isWindowInFullScreen() && !o && (i.setWindowInFullScreen(!1), ZCMediaDomUtil.exitFullScreen()), i.isLiveFeedAssociated() && LiveFeedHandler.callEvents.handlEnd(i), (i.isInMigratingState() || i.isMigratedForRecording()) && "undefined" != typeof ConferenceImpl && ConferenceImpl.handleEndForAdhocCall(i.getId())
        }
        if (this.hasOutgoingSession()) {
            var d = this.getOutgoingSession();
            d.getId() === e && (MediaCallImpl.isLocalCallId(e) || MediaCallImpl.punchLogsOnCallEnd(d), d.terminate(), this.clearOutgoingSession(), MediaCallUI.handleEnd(d, s), MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.RINGING), d.isLiveFeedAssociated() && LiveFeedHandler.callEvents.handlEnd(d))
        }
        if (this.hasHandingOffSession()) {
            var c = this.getHandingOffSession();
            c.getId() === e && (c.terminate(), this.clearHandingOffSession(), MediaCallUI.handleEnd(c, !1))
        }
        void 0 !== a && a.playEndTone && !r && MediaCallImpl.playTone(null, MediaCallConstants.states.END)
    },
    getDetailsForAdhocCallConversion: function(e) {
        return {
            call_id: e.getId(),
            caller_id: e.getCallerId(),
            callee_id: e.getCalleeId(),
            recording_migration: e.getCurrentMember().isRecording()
        }
    },
    addUsersToCall: function(e, t, a, i, n) {
        var s = this.getCurrentSession();
        if (void 0 !== s && !$WC.Util.isEmpty(a) && a.length > 0) {
            if (s.isMigratedForRecording()) return a = a.filter(e => e !== s.getOtherMemberId()), void(s.getCurrentMember().isRecording() ? (s.setDetailsForCallConversion({
                userIds: a,
                title: e
            }), i(), MediaCallImpl.handleRecordingAction(MediaCall.isStartRecordingAllowed() ? MediaCallConstants.recordingAction.STOP_AND_START_RECORDING : MediaCallConstants.recordingAction.STOP_RECORDING)) : (s.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), MediaCallUI.adaptUIToState(s, MediaCallConstants.states.MIGRATING), AdhocCallBridge.publish(s, "addUsers", {
                associatedSessionId: s.getAssociatedConferenceId(),
                selectedList: a,
                title: e
            }), i()));
            var l = s.getCurrentMember().getAVUpStream();
            Conference.convertOneToOneCallToConference(e, t, a, void 0, l, MediaCallImpl.getDetailsForAdhocCallConversion(s), void 0, i, n)
        }
    },
    stopCallRecording: function(e) {
        var t = MediaCallImpl.getCurrentSession(),
            a = t.getCurrentMember();
        if (t && t.getId() === e && a.isRecording()) {
            var i = t.getAssociatedConferenceId();
            ConferenceAPI.stopRecording(i, a.getRecordingReferenceIndex(), void 0, (function(t) {
                t.code === ZCSmartConferenceConstants.errorCode.NO_RECORDING_IN_PROGRESS && AdhocOneToOneCallHandler.handleRecordingState(e, {
                    associatedSessionId: i,
                    state: "stop",
                    action_user: !0,
                    isRepairMessage: !0
                })
            }))
        }
    },
    startCallRecording: function(e) {
        var t = MediaCallImpl.getCurrentSession(),
            a = t.getCurrentMember(),
            i = t.getOtherMember();
        if (t && t.getId() === e && !a.isRecording() && t.isRecordingSupported()) {
            if (t.isMigratedCall()) {
                var n = t.getAssociatedConferenceId();
                return void ConferenceAPI.startRecording(n, void 0, (function(t) {
                    t.code === ZCSmartConferenceConstants.errorCode.RECORDING_ALREADY_STARTED && AdhocOneToOneCallHandler.handleRecordingState(e, {
                        associatedSessionId: n,
                        state: "start",
                        action_user: !0,
                        isRepairMessage: !0
                    })
                }))
            }
            if (!t.isInMigratingState()) {
                var s = t.getCallTypeForAdhocCall(),
                    l = a.getAVUpStream(),
                    r = [i.getId()],
                    o = (new Date).getTime();
                t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), a.setRecordingReferenceIndex(o), Conference.convertOneToOneCallToConference(MediaCallImpl.generateTitleForRecording(t), s, r, r, l, MediaCallImpl.getDetailsForAdhocCallConversion(t), o, void 0, (function() {
                    a.resetRecordingReferenceIndex(), t.setStatusText(MediaCallConstants.statusText.CALL_CONNECTED), UI.updateBanner(Resource.getRealValue("apierror.message"), 2e3, !0)
                }))
            }
        }
    },
    createAddParticipantWin: function(e) {
        if (MediaUtil.isAVLibraryLoadedInChatbar() && MediaCall.BRIDGE) MediaCall.BRIDGE.UI.openAddParticipantWin(e.getMemberIds(), MediaCallImpl.userSuggestion.createCallTitle(e, MediaCall.BRIDGE.Users.getName), (e, t) => {
            if (MediaCallImpl.hasCurrentSession()) {
                var a = MediaCallImpl.getCurrentSession(),
                    i = {
                        type: a.getCallTypeForAdhocCall(),
                        title: t,
                        user_ids: JSON.stringify(e),
                        adhoc_call_details: JSON.stringify(MediaCallImpl.getDetailsForAdhocCallConversion(a))
                    };
                a.setRedirectionState(), "function" == typeof MediaCall.BRIDGE.UI.loadCliqIframeAndSwitchFocus ? MediaCall.BRIDGE.UI.loadCliqIframeAndSwitchFocus().then(e => AVISCUtilBridge.openGroupCallInIframe(i, e)).then(() => MediaCallImpl.hasCurrentSession() && MediaCallUI.removeCallUI(MediaCallImpl.getCurrentSession())).catch(() => window.open(MediaUtil.BRIDGE.ServerConstants.CLIQ_SERVER_URL + "/groupcall" + MediaAPI.serialize(i))) : window.open(MediaUtil.BRIDGE.ServerConstants.CLIQ_SERVER_URL + "/groupcall" + MediaAPI.serialize(i))
            } else MediaCallHandler.UIEvents.closeAddParticipantWin()
        });
        else if (!$WC.$Win.isExist("addparticipantstocallwin")) {
            MediaUtil.createPopup({
                id: "addparticipantstocallwin",
                class: "zcl-win-modal1 ",
                closeoutside: !0,
                html: MediaCallTemplates.getAddParticipantsWinHtml(e)
            }, !0);
            SearchField.init("addcallparticipants-usersuggest");
            var t = e.getMembers();
            for (var a in t) SearchField.insertSelection("addcallparticipants-usersuggest", "contact", a, MediaCall.BRIDGE.Users.getName(a));
            MediaCallImpl.userSuggestion.getSearchFieldInput().select().focus(), MediaCallImpl.userSuggestion.populateDefaultResult(), MediaCallImpl.userSuggestion.setDefaultCallTitle(e), MediaCallHandler.UIEvents.handleAdhocCallInputs()
        }
    },
    isCurrentUserParticipantOfAdhocCall: function(e) {
        return e.caller_id === MediaCall.BRIDGE.Constants.ZUID || e.callee_id === MediaCall.BRIDGE.Constants.ZUID
    },
    canPerformSilentJoin: function(e) {
        var t = MediaCallImpl.hasCurrentSession() ? MediaCallImpl.getCurrentSession() : MediaCallImpl.getHandingOffSession();
        return !(void 0 === e || !t || t.getId() !== e.call_id) && this.isCurrentUserParticipantOfAdhocCall(e)
    },
    handlePollingEvent: function(e) {
        this._handleCallEvent(e, !1, !1)
    },
    handleWmsEvent: function(e) {
        this._handleCallEvent(e, !0, !1)
    },
    handleBrodcastEvent: function(e) {
        this._handleCallEvent(e, !1, !0)
    },
    _handleCallEvent: function(e, t, a) {
        var i = e.msguid,
            n = e.data.call_id,
            s = MediaCallImpl.hasCurrentSession() ? MediaCallImpl.getCurrentSession() : MediaCallImpl.getFromIncomingSessions(n);
        if (void 0 === s && (s = MediaCallImpl.getOutgoingSession()), !ZCWMSEventSync.isDuplicateEvent(i)) {
            if (s) {
                ["CALL_ANSWERED", "ANSWER_SDP", "ICE_CANDIDATE"].includes(e.action) && !t && s.pushPollingEvent(e.action)
            }
            ZCWMSEventSync.pushEventId(i), MediaCallHandler.wmsEvents[e.action](e)
        }
        a || MediaUtil.sendMessageViaBroadcastChannel(e)
    },
    switchDevice: function(e, t, a) {
        if (ZCMediaDevices.isValidDevice(t, e)) {
            var i = this.getCurrentSession(),
                n = i.getCurrentMember(),
                s = n.getAVUpStream();
            if (t === ZCMediaDevices.kinds.AUDIO_OUTPUT) {
                var l = MediaCallUI.getVideoContainer(i.getId(), i.getOtherMemberId()).find("video");
                return void MediaCallImpl.setAudioOutputDevice(l, e)
            }
            var r = {
                    audio: {
                        deviceId: {
                            exact: e
                        }
                    }
                },
                o = WebRTCUserMedia.streamTypes.AUDIO_ONLY;
            t === ZCMediaDevices.kinds.VIDEO_INPUT && (r = {
                video: {
                    deviceId: {
                        exact: e
                    }
                }
            }, o = WebRTCUserMedia.streamTypes.VIDEO_ONLY);
            i.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.init + o), WebRTCUserMedia.requestAndReplaceTracksInStream(s, o, (function(t) {
                if (MediaCallImpl.hasCurrentSession()) {
                    if (i.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.success), n.replaceTracksInStream(t, o), n.setUpdatedAVStatus(), a) {
                        var s = MediaCallUI.getVideoContainer(i.getId(), i.getOtherMemberId()).find("video");
                        MediaCallImpl.setAudioOutputDevice(s, e)
                    }
                } else WebRTCUserMedia.closeStream(t._getType())
            }), void 0, r, MediaUtil.getStreamProcessingOptions(i))
        }
    },
    adaptUIForCallCollision: function(e, t) {
        var a = e.find('[videocontainer][userId="' + t.caller_id + '"]'),
            i = e.find('[videocontainer][userId="' + t.callee_id + '"]');
        e.attr({
            callid: t.call_id,
            calltype: t.type,
            caller: t.callee_id,
            callee: t.caller_id
        }), a.attr("userId", t.callee_id), i.attr("userId", t.caller_id)
    },
    handleCallCollision: function(e, t) {
        var a = e.getId(),
            i = t.data.call_id,
            n = e.getType();
        MediaCallImpl.stopTone(MediaCallConstants.states.RINGING), this.adaptUIForCallCollision(MediaCallUI.getMediaCallWrapper(a), t.data), e.writeToLog(CallLogConstants.callState.collision), e.terminate(), MediaCallImpl.isLocalCallId(a) ? (MediaManager.resetStreamRequested(), MediaCallImpl.clearOutgoingSession()) : (MediaCallAPI.updateCallStatus(a, MediaCallConstants.statusText.CALL_COLLISION), MediaCallImpl.clearRunningSession(a));
        var s = MediaCallImpl.getFromIncomingSessions(i);
        void 0 === s && ((s = new MediaCallSession(t.data)).getCurrentMember().setClientSupport(MediaCallImpl.getClientSupport()), s.writeToLog(CallLogConstants.wms.callRequested), ZCWMSEventSync.pushEventId(t.msguid), MediaCallImpl.addInIncomingSessions(s)), t.data.caller_client_type && s.getOtherMember().setClientType(t.data.caller_client_type), s.getCurrentMember().storeRemoteTracksMediaId(t.data.tracks_media_id), s.getCurrentMember().storeRemoteSdp(JSON.parse(t.data.offer_description)), s.writeToLog(CallLogConstants.wms.offer, t.data), void 0 !== t.data.client_support && s.getOtherMember().setClientSupport(t.data.client_support), s.addLongPollingController(), s.isVideoCall() && !MediaCall.isVideoCall(n) && s.getCurrentMember().setVideoCallWithoutVideo(), MediaCall.initiateCallProcess(s, ZCMediaConstants.triggerSource.CALL_INCOMING_UI)
    },
    handleConnectionStatsCallBack: function(e) {
        var t = MediaCallImpl.getCurrentSession();
        if (t) {
            var a = (a, i, n, s, l) => {
                let r = t.getCachedConnectionStatsTableDom();
                MediaUtil.handleConnectionStatsCallBackData(t, a, i, n, s, l, e.rtt, r)
            };
            e.hasOwnProperty("sendaudiopacketlost") && e.hasOwnProperty("audiopacketssent") && e.hasOwnProperty("sendaudiojitter") && a(WebRTCPeerConnectionConstants.connectionTypes.AUDIO, !0, e.sendaudiopacketlost, e.audiopacketssent, e.sendaudiojitter), e.hasOwnProperty("recvaudiopacketlost") && e.hasOwnProperty("audiopacketsreceived") && e.hasOwnProperty("recvaudiojitter") && a(WebRTCPeerConnectionConstants.connectionTypes.AUDIO, !1, e.recvaudiopacketlost, e.audiopacketsreceived, e.recvaudiojitter), e.hasOwnProperty("sendvideopacketlost") && e.hasOwnProperty("videopacketssent") && e.hasOwnProperty("sendvideojitter") && a(WebRTCPeerConnectionConstants.connectionTypes.VIDEO, !0, e.sendvideopacketlost, e.videopacketssent, e.sendvideojitter), e.hasOwnProperty("recvvideopacketlost") && e.hasOwnProperty("videopacketsreceived") && e.hasOwnProperty("recvvideojitter") && a(WebRTCPeerConnectionConstants.connectionTypes.VIDEO, !1, e.recvvideopacketlost, e.videopacketsreceived, e.recvvideojitter), e.hasOwnProperty("sendscreenpacketlost") && e.hasOwnProperty("screenpacketssent") && e.hasOwnProperty("sendscreenjitter") && a(WebRTCPeerConnectionConstants.connectionTypes.SCREEN, !0, e.sendscreenpacketlost, e.screenpacketssent, e.sendscreenjitter), e.hasOwnProperty("recvscreenpacketlost") && e.hasOwnProperty("screenpacketsreceived") && e.hasOwnProperty("recvscreenjitter") && a(WebRTCPeerConnectionConstants.connectionTypes.SCREEN, !1, e.recvscreenpacketlost, e.screenpacketsreceived, e.recvscreenjitter)
        }
    },
    switchToVideo: function(e, t) {
        var a = MediaCallImpl.getCurrentSession();
        if (a.getId() === e) {
            a.writeToLog(CallLogConstants.ui.videoSwitch), MediaCallUI.removeSwitchToVideoInfo(a), t && Clickoutside.handleClickOnChild(t);
            var i = a.getCurrentMember();
            if (!i.hasSwitchedToVideo()) {
                var n = MediaCallUI.getMediaCallWrapper(e);
                if (i.setAsSwitchedToVideo(), a.isMigratedForRecording()) AdhocCallBridge.publish(a, "videoUnMute", {
                    associatedSessionId: a.getAssociatedConferenceId()
                });
                else {
                    a.writeToLog(CallLogConstants.webrtc.requestAndAddTrackInStream.init), MediaCallImpl.renegotiateForUnmute(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY, (function(e) {
                        MediaCallImpl.hasCurrentSession() ? (n.removeClass("AV-call-no-subview"), MediaCallUI.unmuteVideo(a), MediaCallImpl.handleAVStatusChange("video", !1), a.writeToLog(CallLogConstants.webrtc.requestAndAddTrackInStream.success), i.isMultiStreamSupported() && a.getOtherMember().isMultiStreamSupported() ? (MediaCallUI.handleSwitchToVideoLayout(), n.find('[mediacallbuttons][purpose="turnOffCamera"]').removeClass("dN zc-av-dN"), MediaCallUI.adjustCallContainerHeight(n), i.addVideoTrackInStream(e)) : (i.replaceScreenWithVideoInNewConnection(e), a.setAsScreenShared()), MediaCallUI.getVideoContainer(a.getId(), i.getId()).removeClass("AV-call-video-muted"), MediaCallAPI.updateLog(a.getId(), "CALL_SWITCH", {
                            loc_time: new Date,
                            time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                            user_type: a.isCaller(MediaCall.BRIDGE.Constants.ZUID) ? "caller" : "callee",
                            zuid: MediaCall.BRIDGE.Constants.ZUID,
                            call_mode: a.getType()
                        })) : WebRTCUserMedia.closeStream(e._getType())
                    }), (function(e, t) {
                        a.writeToLog(CallLogConstants.webrtc.requestAndAddTrackInStream.failed), i.resetSwitchedToVideo()
                    }))
                }
            }
        }
    }
}).userSuggestion = {
    id: "addcallparticipants-usersuggest",
    minLimitForAdhocCall: 3,
    maxLimitForAdhocCall: 18,
    getResultsListID: function() {
        return this.id + "-list"
    },
    getResultsListContainer: function() {
        return ZCJQuery("#" + this.getResultsListID())
    },
    getResultsContainerID: function() {
        return this.id + "-results"
    },
    getResultsContainer: function() {
        return ZCJQuery("#" + this.getResultsContainerID())
    },
    getSearchFieldInputID: function() {
        return this.id + "-search-field"
    },
    getSearchFieldInput: function() {
        return ZCJQuery("#" + this.getSearchFieldInputID())
    },
    getUserSelectFieldId: function() {
        return this.id + "-select-field"
    },
    getUserSelectField: function() {
        return ZCJQuery("#" + this.getUserSelectFieldId())
    },
    getSearchFieldContainer: function() {
        return ZCJQuery("#" + this.id)
    },
    getSelectedListValues: function() {
        return SearchField.getSelectedList(this.getUserSelectFieldId())
    },
    search: function(e) {
        var t = this.getSelectedListValues();
        if (this.getResultsListContainer().empty(), MediaCallHandler.UIEvents.handleAdhocCallInputs(), !(t.length >= this.maxLimitForAdhocCall)) {
            var a = {
                    searchin: SearchAgent.CONTACTS + SearchAgent.ORGCONTACTS,
                    ignorelist: t,
                    listid: this.getResultsListID(),
                    val: e,
                    contactshtml: QuickAction.quickchatcontacthtml,
                    orgcontactshtml: QuickAction.quickchatcontacthtml,
                    allstatuscontacts: !1,
                    successcallback: function() {
                        this.populateResults(e)
                    }.bind(this),
                    clearcallback: function() {
                        this.populateEmptyResult()
                    }.bind(this)
                },
                i = SearchAgent.search(a);
            return i ? this.populateResults() : (this.populateEmptyResult(), ZCScroll.scrollTop(this.getResultsListContainer(), 0)), i
        }
        UI.updateBanner(MediaUtil.getResource("conference.invite.limit.audio", [this.maxLimitForAdhocCall]), 2e3, !0)
    },
    handleKeyUp: function(e, t) {
        var a = e.keyCode;
        if (e.stopPropagation(), 27 === a) {
            if ($WC.Util.isEmpty(t) && $WC.Util.isEmpty(this.getSearchFieldInput().val())) return void $WC.$Win.destroy("addparticipantstocallwin");
            this.getSearchFieldInput().val(""), $WC.Util.isEmpty(this.getSearchFieldInput().val()) && this.populateDefaultResult()
        }
        SearchField.hasNodes(this.getResultsListID()) || this.populateEmptyResult()
    },
    handleAction: function(e, t) {
        var a = t.attr("uid");
        $WC.Util.isEmpty(a) || (SearchField.clearSearchField(this.id), this.getSearchFieldInput().val("").select().focus())
    },
    getSelectionHTML: function(e, t, a) {
        var i = MediaCallImpl.getCurrentSession();
        return MediaTemplates.getSelectedParticipantHtmlInAddWin(t, e, a, "contact", !i.isMember(t))
    },
    handleDeleteNode: function(e) {
        e.remove(), this.getSearchFieldInput().select().focus(), this.populateDefaultResult()
    },
    setDefaultCallTitle: function(e) {
        SearchField.hasNodes(this.getUserSelectFieldId()) && ZCJQuery("#addparticipantstocallwin").find('[inputname="adhoccalltitle"]').val(this.createCallTitle(e, Composer.getDnameForChatTitle))
    },
    createCallTitle: function(e, t) {
        var a = t(e.getCallerId(), e.getCallerName()) + ", " + t(e.getCalleeId(), e.getCalleeName()) + " & " + MediaUtil.getResource("common.more");
        return a.length > ZCMediaConstants.MAX_TITLE_LENGTH ? a.substring(0, ZCMediaConstants.MAX_TITLE_LENGTH - 2) : a
    },
    populateEmptyResult: function() {
        var e = $WC.Util.isEmpty(this.getSearchFieldInput().val()) ? "quickchat.no.contact" : "quickchat.no.result";
        this.getResultsListContainer().html($Util.emptyStateHtml({
            imageclass: "no_such_user",
            title: MediaUtil.getResource(e)
        }))
    },
    populateResults: function() {
        var e = this.getResultsContainer();
        if (this.getSearchFieldInput().val().trim().length > 0) e.find(".sel").removeClass("sel");
        else {
            var t = e.find("[purpose='search']");
            t.length && 0 === e.find(".sel").length && t.first().addClass("sel")
        }
    },
    populateDefaultResult: function() {
        $WC.$Win.isExist("addparticipantstocallwin") && $WC.Util.isEmpty(this.getSearchFieldInput().val()) && this.search("*")
    }
}, MediaCallAPI = {
    errorCodes: {
        NO_OFFER_RECIEVED_ON_RECONNECTION: "nooffer_received_on_reconnection",
        CALL_ALREADY_ENDED: "call_already_ended",
        CALL_ALREADY_ANSWERED: "call_already_answered",
        CALL_ALREADY_DECLINED: "call_already_declined",
        CALL_ALREADY_CANCELED: "call_already_canceled",
        ALREADY_ON_A_CALL: "already_on_a_call",
        FEATURE_UNSUPORTED_IN_CLIENT: "feature_unsupported_in_client",
        isCallEndError: function(e) {
            return e === this.CALL_ALREADY_ENDED || e === this.CALL_ALREADY_DECLINED || e === this.CALL_ALREADY_CANCELED
        },
        isCallAlreadyAnsweredError: function(e) {
            return e === this.CALL_ALREADY_ANSWERED
        },
        isUnsupportedClientError: function(e) {
            return e === this.FEATURE_UNSUPORTED_IN_CLIENT
        }
    },
    startCall: function(e, t, a, i, n) {
        var s = new Date,
            l = {},
            r = {
                client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                ...a
            };
        l[MediaCallConstants.MULTIPLE_CALLS_HANDLING_TYPE_HEADER] = t;
        var o = {
            url: MediaCallConstants.baseUrl + "/v2/users/" + e + "/call",
            type: MediaCallConstants.request.method.POST,
            data: r,
            headers: l,
            success: function(e, t, a, n, l) {
                var r, o;
                r = e.call_id, o = MediaCallConstants.request.status.SUCCESS, MediaCallImpl.updateAPIResponseTimeInLog(r, "/call", MediaCallConstants.request.method.POST, o, s), i(e), $WC.Util.isEmpty(l.objects_to_push_via_api) || (MediaCallImpl.statsObjectApiMaxSize = parseInt(l.objects_to_push_via_api))
            },
            error: function(e) {
                n(e)
            }
        };
        MediaUtil.isNewAVDomainRoutingEnabled() && AVCliqIframeHandler.isLoaded() && (o.url = o.url + MediaAPI.serialize(r), delete o.data), MediaAPI.request(o)
    },
    answerCall: async function(e, t, a, i, n) {
        var s = new Date,
            l = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/answer", MediaCallConstants.request.method.PUT, t, s)
            },
            r = {},
            o = !1;
        if (MediaCall.isAVSDPCompressionEnabled() && a.description) try {
            a.description = await ZCAVStringCompressor.compress(JSON.stringify(a.description)), o = !0
        } catch (e) {
            o = !1
        }
        var d = {
            is_compressed: o,
            client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
            ...a
        };
        r[MediaCallConstants.MULTIPLE_CALLS_HANDLING_TYPE_HEADER] = t, MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/answer",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: d,
            headers: r,
            success: function(e, t, a, n, s) {
                l(MediaCallConstants.request.status.SUCCESS), "function" == typeof i && i(e), $WC.Util.isEmpty(s.objects_to_push_via_api) || (MediaCallImpl.statsObjectApiMaxSize = parseInt(s.objects_to_push_via_api))
            },
            error: function(e) {
                l(MediaCallConstants.request.status.FAILED), "function" == typeof n && n(e)
            }
        })
    },
    cancelCall: function(e) {
        var t = new Date,
            a = function(a) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/cancel", MediaCallConstants.request.method.PUT, a, t)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/cancel",
            type: MediaCallConstants.request.method.PUT,
            success: function(e) {
                a(MediaCallConstants.request.status.SUCCESS)
            },
            error: function(e) {
                a(MediaCallConstants.request.status.FAILED)
            }
        })
    },
    declineCall: function(e, t, a, i) {
        var n = new Date,
            s = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/decline", MediaCallConstants.request.method.PUT, t, n)
            },
            l = {
                client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
            };
        void 0 !== t && (l = Object.assign({}, l, t)), MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/decline",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: l,
            success: function(e) {
                s(MediaCallConstants.request.status.SUCCESS), "function" == typeof a && a(e)
            },
            error: function(e) {
                s(MediaCallConstants.request.status.FAILED), "function" == typeof i && i(e)
            }
        })
    },
    endCall: function(e) {
        var t = new Date,
            a = function(a) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/end", MediaCallConstants.request.method.PUT, a, t)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/end",
            type: MediaCallConstants.request.method.PUT,
            success: function(e) {
                a(MediaCallConstants.request.status.SUCCESS)
            },
            error: function(e) {
                a(MediaCallConstants.request.status.FAILED)
            }
        })
    },
    updateStreamSourceState: function(e, t, a, i) {
        var n = "audio" === t ? "mic" : "screen" === t ? "screen" : "camera",
            s = new Date,
            l = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/" + n, MediaCallConstants.request.method.PUT, t, s)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/" + n,
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: {
                state: a,
                action_time: i
            },
            success: function(e) {
                l(MediaCallConstants.request.status.SUCCESS)
            },
            error: function(e) {
                l(MediaCallConstants.request.status.FAILED)
            }
        })
    },
    handOffCall: function(e, t, a, i) {
        var n = new Date,
            s = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/handoff", MediaCallConstants.request.method.PUT, t, n)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/handoff",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: {
                handoff_type: t,
                client_support: MediaCallImpl.getClientSupport()
            },
            success: function(e) {
                s(MediaCallConstants.request.status.SUCCESS), "function" == typeof a && a(e)
            },
            error: function(e) {
                s(MediaCallConstants.request.status.FAILED), "function" == typeof i && i(e)
            }
        })
    },
    updateAVState: function(e, t) {
        var a = {
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/avstate",
            type: MediaCallConstants.request.method.POST,
            data: t
        };
        MediaUtil.isNewAVDomainRoutingEnabled() && AVCliqIframeHandler.isLoaded() && (a.url = a.url + MediaAPI.serialize(data), delete a.data), MediaAPI.request(a)
    },
    getCallDetail: function(e, t, a) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e,
            type: MediaCallConstants.request.method.GET,
            success: function(e) {
                "function" == typeof t && t(e)
            },
            error: function(e) {
                "function" == typeof a && a(e)
            }
        })
    },
    updateCallStatus: function(e, t, a, i, n, s) {
        var l = new Date,
            r = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/status", MediaCallConstants.request.method.PUT, t, l)
            },
            o = {
                value: t,
                client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
            };
        void 0 !== n && (o.client_support = n), MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/status",
            type: MediaCallConstants.request.method.PUT,
            syncRequestAcrossTabs: s,
            uniqueSyncId: "/v2/calls/" + e + "/status-" + t,
            contentType: "application/json",
            data: o,
            success: function(e) {
                r(MediaCallConstants.request.status.SUCCESS), "function" == typeof a && a(e)
            },
            error: function(e) {
                r(MediaCallConstants.request.status.FAILED), "function" == typeof i && i(e)
            }
        })
    },
    sendOfferSdp: async function(e, t, a, i, n, s, l, r, o, d, c) {
        var C = new Date,
            u = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/sendoffersdp", MediaCallConstants.request.method.PUT, t, C)
            },
            p = !1;
        if (MediaCall.isAVSDPCompressionEnabled()) try {
            t = await ZCAVStringCompressor.compress(JSON.stringify(t)), p = !0
        } catch (e) {
            p = !1
        }
        var m = {
            description: t,
            is_compressed: p,
            connection_state: a,
            tracks_media_id: n,
            has_switched_to_video: r,
            is_sharing_screen: o,
            client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
            turn_type: l
        };
        void 0 !== s && (m.client_support = s), void 0 !== i && i > 0 && (m.reconnection_id = i), MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/sendoffersdp",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: m,
            success: function(e) {
                u(MediaCallConstants.request.status.SUCCESS), "function" == typeof d && d(e)
            },
            error: function(e) {
                u(MediaCallConstants.request.status.FAILED), "function" == typeof c && c(e)
            }
        })
    },
    sendAnswerSdp: async function(e, t, a, i, n, s, l) {
        var r = new Date,
            o = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/sendanswersdp", MediaCallConstants.request.method.PUT, t, r)
            },
            d = !1;
        if (MediaCall.isAVSDPCompressionEnabled()) try {
            t = await ZCAVStringCompressor.compress(JSON.stringify(t)), d = !0
        } catch (e) {
            d = !1
        }
        var c = {
            description: t,
            is_compressed: d,
            connection_state: a,
            tracks_media_id: n,
            client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
        };
        void 0 !== i && i > 0 && (c.reconnection_id = i), MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/sendanswersdp",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: c,
            success: function(e) {
                o(MediaCallConstants.request.status.SUCCESS), "function" == typeof s && s(e)
            },
            error: function(e) {
                o(MediaCallConstants.request.status.FAILED), "function" == typeof l && l(e)
            }
        })
    },
    pollEvents: function(e, t, a, i) {
        var n = new Date,
            s = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/events", MediaCallConstants.request.method.GET, t, n)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/events",
            type: MediaCallConstants.request.method.GET,
            data: {
                sequence: t
            },
            success: function(e) {
                s(MediaCallConstants.request.status.SUCCESS), a(e)
            },
            error: function(e) {
                s(MediaCallConstants.request.status.FAILED), "function" == typeof i && i(e)
            }
        })
    },
    reinit: function(e, t, a) {
        var i = new Date,
            n = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/reinit", MediaCallConstants.request.method.PUT, t, i)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/reinit",
            type: MediaCallConstants.request.method.PUT,
            success: function(e) {
                n(MediaCallConstants.request.status.SUCCESS), "function" == typeof t && t(e)
            },
            error: function(e) {
                n(MediaCallConstants.request.status.FAILED), "function" == typeof a && a(e)
            }
        })
    },
    renegotiate: function(e, t, a) {
        var i = new Date,
            n = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/renegotiate", MediaCallConstants.request.method.PUT, t, i)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/renegotiate",
            type: MediaCallConstants.request.method.PUT,
            success: function(e) {
                n(MediaCallConstants.request.status.SUCCESS), "function" == typeof t && t(e)
            },
            error: function(e) {
                n(MediaCallConstants.request.status.FAILED), "function" == typeof a && a(e)
            }
        })
    },
    updateIceCandidates: function(e, t, a, i) {
        var n = new Date,
            s = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/icecandidate", MediaCallConstants.request.method.PUT, t, n)
            };
        if (t.length) {
            var l = {
                ice_candidates: t,
                connection_state: a,
                client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
            };
            void 0 !== i && i > 0 && (l.reconnection_id = i), MediaAPI.request({
                url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/icecandidate",
                type: MediaCallConstants.request.method.PUT,
                contentType: "application/json",
                data: l,
                success: function(e) {
                    s(MediaCallConstants.request.status.SUCCESS)
                },
                error: function(e) {
                    s(MediaCallConstants.request.status.FAILED)
                }
            })
        }
    },
    updateLog: function(e, t, a) {
        void 0 !== e && (a.call_id = e);
        var i = {
                purpose: "AV_CALL_LOG",
                action: t,
                data: JSON.stringify(a)
            },
            n = {
                url: MediaCallConstants.baseUrl + "/v1/log",
                type: MediaCallConstants.request.method.POST,
                data: i,
                sendViaBeacon: !0
            };
        MediaAPI.request(n)
    },
    getRejectMessages: function(e) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/users/" + MediaCall.BRIDGE.Constants.ZUID + "/customrejectmessages",
            type: MediaCallConstants.request.method.GET,
            success: function(t) {
                "function" == typeof e && e(t.messages)
            }
        })
    },
    pushCallEventLog: function(e, t, a, i, n) {
        var s = new Date,
            l = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/log", MediaCallConstants.request.method.PUT, t, s)
            },
            r = {};
        void 0 !== i && i > 0 && (r.round_trip_time = Math.round(i)), void 0 !== a && (r.value = a), void 0 !== n && (r.is_caller = n);
        var o = {
            event: t,
            client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
            data: r
        };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/log",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: o,
            success: function(e) {
                l(MediaCallConstants.request.status.SUCCESS)
            },
            error: function(e) {
                l(MediaCallConstants.request.status.FAILED)
            }
        })
    },
    pushEventsLogArray: function(e, t, a) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/logs",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: {
                events: t,
                is_caller: a
            }
        })
    },
    sendClientLogData: function(e, t, a, i) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/clientlog",
            type: "POST",
            sendStringAsFile: !0,
            fileHash: {
                fileData: t,
                fileName: e,
                fileParamName: "logfile",
                formDataParams: {
                    subject: a,
                    description: i
                }
            }
        })
    }
}, (LongPollingController = function(e, t, a) {
    this._sessionId = e, this._latestSequenceNumber = 0, this._pollingTimer = void 0, this._pollingInterval = a || MediaCallConstants.LONG_POLLING_INTERVAL, this._hasPendingRequest = !1, this._callback = t, this._initialize()
}).prototype = {
    _initialize: function() {
        "function" == typeof this._callback && (clearInterval(this._pollingTimer), this._pollingTimer = setInterval(this.requestEvents.bind(this), this._pollingInterval))
    },
    _setPendingRequest: function() {
        this._hasPendingRequest = !0
    },
    _resetPendingRequest: function() {
        this._hasPendingRequest = !1
    },
    setLatestSequence: function(e) {
        this._latestSequenceNumber = e
    },
    requestEvents: function() {
        this._hasPendingRequest || (this._setPendingRequest(), MediaCallAPI.pollEvents(this._sessionId, this._latestSequenceNumber, function(e) {
            this.setLatestSequence(e.next_sequence), this._resetPendingRequest(), this._callback(e.messages)
        }.bind(this), function() {
            this._resetPendingRequest()
        }.bind(this)))
    },
    stop: function() {
        this._resetPendingRequest(), clearInterval(this._pollingTimer), this._pollingTimer = void 0
    }
}, ZCDirectCallDialogs = {
    ids: {
        settings_win: "av_settings_win"
    },
    isSettingsWinExist: function() {
        return $WC.$Win.isExist(ZCDirectCallDialogs.ids.settings_win)
    },
    getSettingsWin: function() {
        return ZCJQuery($WC.$Win.get(ZCDirectCallDialogs.ids.settings_win))
    },
    createSettingsWin: function(e) {
        if (!this.isSettingsWinExist()) {
            var t = e.getId();
            $WC.$Win.create({
                id: ZCDirectCallDialogs.ids.settings_win,
                class: "modalwindow zcalgncntr zcbg_mask avcliq-setting nite-mode zc-av-dN",
                html: MediaCallTemplates.getSettingsLayoutHtml(e),
                closefn: function() {
                    MediaCallUI.removeCallSettings(), MediaCallUI.clearActionsOnSettingsTabSwitch(MediaCallImpl.getCurrentSession())
                },
                openfn: function() {
                    ZCDirectCallDialogs.getSettingsWin().attr("callId", t), MediaCallImpl.showMediaDeviceSettings(t)
                }.bind(this)
            })
        }
    }
};
var MediaCallTemplates = {};
MediaCallTemplates = function() {
    var e = {
            mainUI: '<div class="AV-call-wrapper AV-call-initial {{live_feed_class}} {{scrn_share_ind_class}}" callId="{{call_id}}" calltype="{{call_type}}" calleeid="{{callee_id}}" callerid="{{caller_id}}" mediacallwrapper><div class="zc-av-impulse zc-av-halignC" impulsecontainer></div><div class="AV-call-main" maincontainer><div class="AV-call-section" callsection><div class="AV-call-new-header zc-av-posrel"><div class="zc-av-header-cnt zc-av-flexC zc-av-flx1"><div class="AV-call-newbox AV-call-hover zcf-leftArrow av-tooltip-left0" mediacallbuttons purpose="minimizeWindow" av-tooltip-title="{{minimize_back_title}}"></div><div id="mediacallsessiontimer" class="AV-call-newbox AV-call-timer zc-av-font16 zc-av-pLR10 zc-av-mL12"></div>{{fullscrn_recording_indicator}}</div><div id="mute_banner_container"></div><div class="zc-av-opts-cnt zc-av-flexC zc-av-justifyE zc-av-flx1">{{toggle_chat_opt}}</div></div><div class="AV-call-videowrapper zc-av-flexC zc-av-ovrflwH" videowrapper><div class="{{caller_class}}" mediacallbuttons purpose="switchView">{{caller_video_container}}<div class="AV-call-videodrag" tempvideocontainer></div></div><div class="{{callee_class}}" mediacallbuttons purpose="switchView">{{callee_video_container}}<div class="AV-call-videodrag" tempvideocontainer></div></div><div class="{{screen_class}}" screenvideowrapper mediacallbuttons purpose="switchView">{{screen_container}}<div class="AV-call-videodrag" tempvideocontainer></div></div><div class="{{wb_class}}" wbwrapper mediacallbuttons purpose="switchView">{{wb_container}}<div class="AV-call-videodrag" tempvideocontainer></div></div><div presentation_wrapper mediacallbuttons purpose="switchView" class="zindex0 AV-call-presentation-wrapper"><div class="AV-call-videodrag" tempvideocontainer></div></div>{{connection_state_loader}}</div><div class="AV-call-new-footer">{{screenshare_indicator}}<div class="AV-call-mini-btn">{{pip_mode_switch}}<div class="AV-call-box AV-call-hover zcf-mini-player2 av-tooltip-up" av-tooltip-title="{{minimize_title}}" mediacallbuttons purpose="showMiniPlayer"></div><div class="AV-call-box AV-call-hover zcf-fullscrn zc-av-mL6 av-tooltip-up" av-tooltip-title="{{fullscreen_title}}" mediacallbuttons targetElemSelector="{{target_elem_selector}}" purpose="openInFullScreen"></div></div></div></div>{{initial_cnt}}<div class="AV-call-miniplayer-header-cnt zc-av-flexC"><div class="AV-call-box AV-call-hover zcf-maximize av-tooltip-up" mediacallbuttons purpose="maximizeWindow" av-tooltip-title="{{maximize_title}}"></div><div id="mediacallsessionsubtimer" class="AV-call-subtimer zc-av-font13 zc-av-pLR10"></div>{{recording_indicator}}</div></div>{{adhoc_call_state_container}}{{miniplayer_screenshare_indicator}}<div class="hudl-aside nite-mode"><div id="mediacallchatsection" class="zcmcembd chtwndws zcsmallchat zcmsgbothside"></div></div></div>',
            replyUI: '<div id="rejectmessagedialog" class="zc-av-rejecbox-cont"><div class="zc-av-rejecbox-hdr"><div class="zc-av-usr-img"><img class="bdrR100 zc-bdrR100 wh100 zc-wh100" src="{{user_img}}" {{user_img_error_event}}></div><div class="zc-av-ellips zc-av-flexG"><div class="zc-av-ellips zc-av-fontB zc-av-font15">{{caller_name}}</div><div class="zc-av-clr-S zc-av-font13 zc-av-mT5" callstatus>{{call_status}}</div></div><div class="zc-av-flexC zc-av-mL15" rejectboxbuttongroup>{{incoming_call_btns}}</div></div><div class="zc-av-rejecbox-main"><div class="zc-av-pLR16"><div class="zc-av-call-hdrline zc-av-clr-S">{{message_header}}</div><div class="zc-av-mT15 zc-av-posrel"><input class="zc-av-rejectbox-input" mediacallinput inputname="rejectTextBox" type="text" name="" placeholder="{{custom_placeholder}}"><span class="zc-av-send zcf-send cur" mediacallbuttons disabled purpose="sendCustomRejectMessage"></span></div></div>{{reject_messages}}</div></div>',
            replyMessageListUI: '<div class="zc-av-mT15 zc-av-fontB" >{{video_reply_msg}}<div class="zc-av-mB10 cur zc-av-line18 zc-av-list" mediacallbuttons purpose="sendDefaultRejectMessage">{{reply_msg1}}</div><div class="zc-av-mB10 cur zc-av-line18 zc-av-list" mediacallbuttons purpose="sendDefaultRejectMessage">{{reply_msg2}}</div><div class="zc-av-mB10 cur zc-av-line18 zc-av-list" mediacallbuttons purpose="sendDefaultRejectMessage">{{reply_msg3}}</div></div><div id="customrejectmessages" class="zc-av-fontB">{{custom_reject_msg}}</div>',
            rejectMessage: '<div class="zc-av-mB10 cur zc-av-line18 {{margin_class}} zc-av-list" mediacallbuttons purpose="sendDefaultRejectMessage">{{preset_msg}}</div>',
            videoContainer: '<div class="AV-call-videocontainer AV-call-video-muted" videocontainer userId="{{user_id}}">{{buffer_loader}}{{user_image_cnt}}<video class="AV-call-video zc-wh100 zc-av-posrel"></video><div class="AV-call-info zc-av-flexC" useractioninfo>{{health_meter_cnt}}{{device_info_cnt}}{{name_cnt}}{{av_alert_indication}}<span class="zcf-mic-mute AV-call-mute zc-av-clrLB zc-av-dN" audioMutedStatus></span></div><div class="AV-call-swap zcf-swap zc-av-alignM zc-av-flexM"></div></div>',
            screenContainer: '<div id="screenshare_container" class="AV-call-videocontainer" screencontainer userId="{{user_id}}">{{buffer_loader}}{{user_image_cnt}}<video class="AV-call-video zc-wh100 zc-av-posrel"></video><div class="AV-call-swap zcf-swap zc-av-alignM zc-av-flexM"></div><div class="AV-call-info zc-av-zindex1">{{name_cnt}}</div><div class="AV-call-ssfullscrn-optn zc-av-flexM zcf-fullscrn av-tooltip-right0" av-tooltip-title="{{fullscreen_title}}" mediacallbuttons targetElemSelector="#screenshare_container" purpose="openInFullScreen"></div></div>',
            whiteBoardContainer: '<div class="AV-call-videocontainer wb-cont-min dN" videocontainer><div class="zc-av-alignM zc-av-flexM zcf-whiteboard font30"></div><div class="AV-call-swap zcf-swap zc-av-alignM zc-av-flexM"></div></div><div id="whiteBoardContainer" class="AV-call-wbcontainer flexM flex-col" whiteboardcontainer><div class="AV-call-wb wh100 flex-col"><div class="AV-call-wb-topbar fshrink"><span id="wb_title" class="wb-tpbr-itm p5 flexG pL15 font14">{{title}}</span><span id="wb_participants" class="flexC wb-tpbr-itm"></span><span class="wb-tpbr-sep"></span><span class="zcf-more wb-tpbr-itm curP" whiteboardbutton data-uid="{{data_uid}}" associate-id="{{associate_id}}" associate-type="{{associate_type}}" purpose="showOptions"></span><span class="wb-tpbr-sep"></span><span class="zcf-fullscrn wb-tpbr-itm curP" whiteboardbutton targetElemId="whiteBoardContainer" purpose="openInFullScreen" av-tooltip-title="{{open_full_screen}}"></span></div><div class="wb-if-box wb-if-br wb-iframe flexG posrel">{{buffer_loader}}<iframe class="wb-if-br wh100 posA vsbH" {{src_url}} data-uid="{{data_uid}}" enablejsapi="1" frameBorder="0"></iframe></div></div></div>',
            share_options: '<div id="{{id}}shrdropdownopt" class="AV-call-box AV-call-hover zcf-sharemedia av-tooltip-up" av-tooltip-title="{{share_title}}" mediacallbuttons purpose="shareOptions"></div>',
            pipOption: '<div class="AV-call-box AV-call-hover zcf-pip zc-av-mR6 av-tooltip-up" av-tooltip-title="{{title}}" mediacallbuttons purpose="openInPIP"></div>',
            initialStateCnt: '<div class="AV-call-status {{call_state_class}}" initialcontainer>{{user_image_cnt}}{{info_cnt}}{{options_cnt}}</div>',
            incomingCallBtns: '<div class="AV-call-box {{answer_audio_btn_class}} AV-call-box-ans zc-av-mR15 av-tooltip-up av-tooltip-left0" av-tooltip-title="{{answer_audio_title}}" mediacallbuttons purpose="answerCall" answertype="audio"></div><div class="AV-call-box {{answer_video_btn_class}} AV-call-box-ans zc-av-mR15 av-tooltip-up" av-tooltip-title="{{answer_audio_video_title}}" mediacallbuttons purpose="answerCall" answertype="audio_video"></div><div class="AV-call-box {{decline_icon_class}} AV-call-box-end av-tooltip-up" av-tooltip-title="{{decline_title}}" mediacallbuttons purpose="endCall"></div>',
            incomingOptCnt: '<div class="zc-av-flexC zc-av-mT15" incomingcalloptions>{{incoming_call_btns}}</div><div class="AV-call-decline-box av-tooltip-up" av-tooltip-title="{{decline_msg_btn_title}}" mediacallbuttons purpose="showDeclineReasons"><span class="zcf-chat zc-av-font16"></span></div>',
            endButtonGroup: '<div class="AV-call-box AV-call-box-initial {{primaryBtn_class}}" title="{{primaryBtn_title}}" mediacallbuttons purpose="{{primaryBtn_purpose}}"></div><div class="AV-call-box-initial AV-call-box zc-av-mL12 AV-call-box-wide-btn {{secondaryBtn_class}}" title="{{secondaryBtn_title}}" mediacallbuttons purpose="{{secondaryBtn_purpose}}">{{secondaryBtn_icon}}<span class="{{secondaryBtn_title_class}}">{{secondaryBtn_title}}</span></div>',
            endCallOptCnt: '<div class="zc-av-flexC zc-av-mT15" endedcalloptions><div buttonGroup class="zc-av-flexC zc-av-fontB">{{button_group_html}}</div><div class="AV-call-box AV-call-box-initial zcf-closeB zc-av-mL20 AV-call-box-close" title="{{close_title}}" mediacallbuttons purpose="closeEndCall"></div></div>',
            stopRecordingBtn: '<div class="AV-call-box AV-call-box-record-stop" title="{{stop_recording_title}}" mediacallbuttons purpose="stopMediaRecording"><svg width="44" height="44" style="z-index: 1;"><circle class="zc-av-circle" r="19.5" cx="22" cy="22" fill="transparent"></circle><circle class="zc-av-circle zc-av-circle-bar" id="recording-progress" r="19.5" cx="22" cy="22" fill="transparent" stroke-dasharray="122"></circle></svg><span class="zc-av-stop-record {{btn_class}}"></span></div>',
            initialStateOptCnt: '<div class="zc-av-flexC zc-av-mT20" calloptions><div class="AV-call-box zcf-call AV-call-box-end zc-av-mL0 zc-call-end av-tooltip-up" av-tooltip-title="{{title}}" mediacallbuttons purpose="endCall"></div></div>',
            shareOptionsDropDownItem: '<div class="AV-call-menu-item {{custom_class}}" mediacallbuttons purpose="{{purpose}}"><span icon class="AV-call-menu-icon {{icon}} zc-av-mR10"></span><span content>{{content}}</span></div>',
            optionsDropDownItem: '<div class="AV-call-menu-item {{custom_class}}" {{disabled_attr}} mediacallbuttons purpose="{{purpose}}"><span icon class="AV-call-menu-icon {{icon}} zc-av-mR10"></span><span content>{{content}}</span>{{disabled_info}}</div>',
            callOptionsTop: '<div class="AV-call-top"><div class="zc-av-flexG">{{status_cnt}}</div><div class="AV-call-health-status zc-av-flexC">{{health_meter_cnt}}<div class="zc-av-mL6">{{health_label}}</div></div></div>',
            callOptionsCnt: '<div class="AV-call-right">{{call_options_top}}<div class="AV-call-bottom"><div class="zc-av-flexG zc-av-ellips zc-av-mR10"><div class="zc-av-flexC AV-call-statuscnt">{{device_info_cnt}}{{name_cnt}}<div id="avcliq_alert_indication" avcliq_alert_indication class="zc-av-dN"></div></div></div>{{recording_indicator}}<div class="zc-av-flexC zc-av-fshrink AV-call-options" calloptions><div class="AV-call-box AV-call-hover zcf-mic av-tooltip-up" av-tooltip-title="{{audio_mute_title}}" mediacallbuttons purpose="turnOffMicrophone"></div><div class="AV-call-box AV-call-hover zcf-video av-tooltip-up {{video_mute_display}}" av-tooltip-title="{{video_mute_title}}" mediacallbuttons purpose="turnOffCamera"></div><div class="AV-call-box zcf-audio AV-call-box-end av-tooltip-up" av-tooltip-title="{{end_title}}" mediacallbuttons purpose="endCall"></div>{{share_options}}<div id="{{id}}dropdownopt" class="AV-call-box AV-call-hover zcf-moreS av-tooltip-up" av-tooltip-title="{{more_optns_tooltip}}" mediacallbuttons purpose="showMoreOptions"></div></div></div></div>',
            switchNotifyCnt: '<div class="AV-call-switch-con" switchnotifycnt><div class="zc-av-font14 zc-av-fontB zc-av-line22 zc-av-ellips-L3">{{content}}</div><div class="zc-av-flexM zc-av-mT15"><div class="AV-call-btn AV-call-btn--secondary zc-av-mR15 zcl-btn_dark zc-av-ellips" mediacallbuttons purpose="declineSwitchToVideo">{{ignore}}</div><div class="AV-call-btn AV-call-btn--primary" mediacallbuttons purpose="switchToVideo"><span class="zcf-video zc-av-mR10"></span><span class="zc-av-ellips">{{accept}}</span></div></div></div>',
            curentUserNetworkHealthCnt: '<div class="AV-call-health-box">{{health_meter}}<span>{{health_label}}</span></div>',
            bottomStatusContainer: '<div adhoccallstatus class="AV-call-footer zc-av-flexC"><div class="zcf-users"></div><div statustext class="zc-av-mL12"></div></div>',
            settingsLayoutHtml: '<div class="zc-av-flexC avcliq-setting-main zc-av-wh100">\n\t\t      <div class="zc-av-fshrink avcliq-setting-lhs zc-av-h100">\n\t\t         <div class="zc-av-font18 zc-av-fontB zc-av-hdrline">{{settings_header}}</div>\n\t\t         <div id="av-settings-lhs" class="zc-av-mT20">\n\t\t\t\t\t{{settings_lhs_html}}\n\t\t         </div>\n\t\t      </div>\n\t\t      <div class="zc-av-flexG zc-av-ovrflwH zc-av-h100">\n\t\t      \t<div id="av_settings_body" class="zc-av-flexG zc-av-flex-col zc-av-ovrflwH zc-av-h100">\n\t\t      \t\t{{settings_body_html}}\n\t\t      \t</div>\n\t\t      </div>\n\t    \t</div>',
            deviceDropdownListItem: '<div class="zc-av-zcl-menu-item" deviceid="{{device_id}}" devicelabel="{{device_name}}" mediadevicewidgetbutton purpose="selectDevice">\n\t\t        <div class="flexG ellips">{{device_name}}</div>\n\t\t  </div>',
            eachDeviceCategoryHtml: '<div id="{{category}}dropdowncnt" class="zc-av-flexC zc-av-device-drpdwn" selecteddeviceid="{{selected_device_id}}" dropdowncnt devicekind="{{category}}">\n\t\t      <div class="zc-av-flexG">{{label}}</div>\n\t\t      <div class="zc-av-mLR40 zc-av-textL zc-av-w50 zc-av-zcl-dropdown-wrp">\n\t\t         <div class="zc-av-zcl-dropdown-input" mediamodulebuttons purpose="openDevicesDropDown">\n\t\t\t\t \t<span class="zc-av-font14 zc-av-fshrink zc-av-zcl-dropdown-icon {{icon}}"></span>\n\t\t\t\t\t<span class="zc-av-zcl-dropdown-label zc-av-ellips" dropdowninput>{{selected_device_name}}</span>\n\t\t\t\t\t<span class="zcf-downArrow zc-av-fon12 zc-av-fshrink zc-av-zcl-dropdown-icon"></span>\n\t\t\t\t</div>\n\t\t         <div id="{{category}}dropdown" class="zc-av-zcl-menu-wrap no-pointer" dropdown style="display: none;">\n\t\t            {{devices_dropdown_list_html}}\n\t\t         </div>\n\t\t      </div>\n\t\t </div>',
            proceedRecordingConsentHeader: '<div class="zcl-img xl flexM mAuto bg-success"><em class="zcf-mic clrW mT10"></em></div>\n\t\t<div class="flexM font16 textC line24 mT12">{{header_text}}</div>',
            proceedRecordingConsentHtml: '<div class="modalwindow2-footer flexC justifyE">\n\t\t\t<div class="zcl-btn zcl-btn--secondary" mediacallbuttons purpose="handleStopRecordingForAdhocCall">{{stop_btn}}</div>\n\t\t\t<div class="zcl-btn bg-success mL20" {{start_stop_btn_disabled}} mediacallbuttons purpose="handleStopAndStartRecordingForAdhocCall">{{stop_start_btn}}</div>\n\t\t</div>',
            deviceSettingsHtml: '<div class="zc-av-settings-header zc-av-fshrink">\n\t\t   <div class="zc-av-flexC zc-av-curD">{{settings_title}}</div>\n\t\t</div>\n\t\t<div class="avcliq-preview-main-settings zc-av-flex-col">\n\t\t\t<div class="zc-av-flex zc-av-flexG zc-av-pLR24">\n\t\t\t\t<div id="av_settings_preview" class="zc-av-posrel zc-av-flex-col avcliq-preview-video-container {{video_mute_class}}">\n\t\t\t\t\t<div class="avcliq-preview-video zc-av-flexM zc-av-alignselfS">\n\t\t\t\t\t\t{{audio_card}}\n\t\t\t\t\t\t<div class="zc-av-flexM avcliq-userimg zc-av-posabs {{img_class}}">\n\t\t\t\t\t\t\t<img userImage src="{{img_src}}" {{user_img_error_event}}>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<video class="zc-av-wh100 zc-av-zindex1"></video> {{disable_video}}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t \n\t\t\t\t\t</div>\n\t\t\t\t\t{{video_mirror_option}}\n\t\t\t\t</div>\t\n\t\t\t\t<div id="media_device_widget" class="zc-av-w100 zc-av-h100 zc-av-flexG zc-av-mL10">\n\t\t\t\t\t<div class="zc-av-device-segment-cnt">\n\t\t\t\t\t\t{{category_list_html}}\n\t\t\t\t\t</div>\n\t\t\t\t\t{{system_requirement_link}}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>'
        },
        t = function(t, i) {
            return a(e.screenContainer, t, i)
        },
        a = function(e, t, a, i, n) {
            var s = MediaCall.isNetworkIndicatorEnabled() ? $WC.template.replace('{{health_meter}} <span class="AV-call-health-meter-text zc-av-dN"></span><span class="zc-av-separator"></span>', {
                    health_meter: MediaTemplates.getNetworkHealthIndicatorHtml({
                        customAttribute: "userId=" + t
                    })
                }, "InSecureHTML") : "",
                l = $WC.template.replace('<div class="AV-call-username zc-av-font15 zc-av-fontB zc-av-ellips" {{name_attr}}>{{user_name}}</div>', {
                    name_attr: i ? "current-username" : "other-username"
                }, "InSecureHTML"),
                r = $WC.template.replace(e, {
                    buffer_loader: MediaTemplates.getBufferLoader("zc-av-dN"),
                    user_image_cnt: MediaTemplates.userImageContainer,
                    health_meter_cnt: s,
                    av_alert_indication: i ? "" : '<div id="avcliq_alert_indication" avcliq_alert_indication class="zc-av-dN"></div>',
                    device_info_cnt: i ? "" : void 0 === n ? '<div class="AV-call-deviceinfo zc-av-clrW" deviceinfo></div>' : MediaTemplates.getDeviceInfoIndicationHtml(n),
                    name_cnt: l,
                    $fullscreen_title: "media.open.fullscreen"
                }, "InSecureHTML");
            return $WC.template.replace(r, {
                user_id: t,
                user_name: MediaCall.BRIDGE.Constants.ZUID === t ? MediaUtil.getResource("avcliq.common.you") : void 0 !== MediaCall.BRIDGE.Users.getName(t, a) ? MediaCall.BRIDGE.Users.getName(t, a) : "",
                user_img: MediaCall.BRIDGE.Users.getImgUrlById(t),
                user_img_error_event: " onerror=MediaCallHandler.ImageLoadEvents.onError(this," + t + ")",
                user_image_display_class: "",
                user_image_onload: ""
            })
        },
        i = function(t) {
            var a = {};
            a[MediaCallConstants.types.AUDIO] = {
                answerIcon: "zcf-call",
                declineIcon: "zcf-call zc-call-end"
            }, a[MediaCallConstants.types.VIDEO] = {
                answerIcon: "zcf-video",
                declineIcon: "zcf-call zc-call-end"
            }, a[MediaCallConstants.types.SCREEN_SHARE_WITH_AUDIO] = a[MediaCallConstants.types.SCREEN_SHARE] = {
                answerIcon: "zcf-sharescrn",
                declineIcon: "zcf-scrn-shr-stop"
            };
            var i = t.getType(),
                n = i === MediaCallConstants.types.VIDEO;
            return $WC.template.replace(e.incomingCallBtns, {
                answer_audio_btn_class: n ? "zcf-call" : a[i].answerIcon + " zc-av-mR30",
                answer_video_btn_class: n ? "zcf-video" : "zc-av-dN",
                decline_icon_class: a[i].declineIcon,
                $answer_audio_title: n ? "avcliq.call.answer.audio.only" : "common.accept",
                $answer_audio_video_title: "avcliq.call.answer.video",
                $decline_title: "common.decline"
            })
        },
        n = function(t) {
            var a = "",
                n = '<div class="zc-av-font15 zc-av-fontB zc-av-ellips zc-av-usrname" other-username>{{user_name}}</div><div class="zc-av-font13 zc-av-ellips zc-av-textC zc-av-flexC zc-av-callstatus"><span statuscontent>{{content}}</span><span class="zcf-failed AV-call-warning zc-av-dN" networkindicator title="{{network_strength_tooltip}}"></span></div>',
                s = "videochat.message.calling",
                l = t.getOtherMember(),
                r = "AV-call-incoming";
            if (t.isHandOffInProgress()) r = "AV-call-outgoing", s = "avcliq.mediacall.state.parking", a = $WC.template.replace(e.initialStateOptCnt, {
                $title: "videochat.endcall"
            });
            else if (t.isCaller(MediaCall.BRIDGE.Constants.ZUID)) r = "AV-call-outgoing", a = $WC.template.replace(e.initialStateOptCnt, {
                $title: "videochat.endcall"
            });
            else {
                var o = t.getType();
                s = MediaCall.isAudioCall(o) ? "videochat.incomming.audio" : "videochat.incomming.video", (MediaCall.isScreenShareWithAudioCall(o) || MediaCall.isScreenShare(o)) && (s = "videochat.incomming.screen", n = '<div class="zc-av-font15 zc-av-fontB zc-av-mT15 zc-av-ellips zc-av-usrname" other-username>{{user_name}}</div><div class="zc-av-mT15 zc-av-font13 zc-av-ellips zc-av-textC" statuscontent>{{content}}</div>'), a = $WC.template.replace(e.incomingOptCnt, {
                    incoming_call_btns: i(t)
                }, "InSecureHTML"), a = $WC.template.replace(a, {
                    $decline_msg_btn_title: "common.decline"
                })
            }
            var d = $WC.template.replace(e.initialStateCnt, {
                user_image_cnt: '<div class="usr-img-cnt zc-usr-img-cnt bdrR100 zc-bdrR100 zc-av-mT15" userimagecnt><img class="bdrR100 zc-bdrR100 wh100 zc-wh100" user_image src="{{user_img}}" {{user_img_error_event}}></div>',
                info_cnt: n,
                options_cnt: a
            }, "InSecureHTML");
            return $WC.template.replace(d, {
                call_state_class: r,
                user_name: void 0 !== l.getName() ? l.getName() : "",
                user_img: MediaCall.BRIDGE.Users.getImgUrlById(l.getId()),
                user_img_error_event: " onerror=MediaCallHandler.ImageLoadEvents.onError(this," + l.getId() + ")",
                $content: s,
                $network_strength_tooltip: "avcliq.network.strength.weak.curruser"
            })
        },
        s = function() {
            return $WC.template.replace(e.share_options, {
                $share_title: "common.share"
            })
        },
        l = function(t) {
            var a = t.isVideoCall() ? $WC.template.replace(e.rejectMessage, {
                    $preset_msg: "videochat.incommingreply.video.msg1",
                    margin_class: ""
                }, "InSecureHTML") : "",
                i = "";
            if (MediaCallRejectMessages.hasCustomMessage()) {
                for (var n = MediaCallRejectMessages.getCustomMessageList(), s = n.length, l = 0; l < s - 1; l++) i += $WC.template.replace(e.rejectMessage, {
                    preset_msg: n[l].msg,
                    margin_class: ""
                });
                i += $WC.template.replace(e.rejectMessage, {
                    preset_msg: n[s - 1].msg,
                    margin_class: "mB5"
                })
            }
            return $WC.template.replace(e.replyMessageListUI, {
                video_reply_msg: a,
                custom_reject_msg: i,
                $reply_msg1: "videochat.incommingreply.msg1",
                $reply_msg2: "videochat.incommingreply.msg2",
                $reply_msg3: "videochat.incommingreply.msg3"
            }, "InSecureHTML")
        },
        r = function(e, t, a, i) {
            return $WC.template.replace('<div id="{{id}}" class="zc-av-flexC zc-av-mT30 zc-av-list-item2 zc-av-mR10" settingstab mediacallbuttons purpose="{{purpose}}"><span class="{{icon_class}} zc-av-zcl-img zc-av-md zc-av-flexM zc-av-fshrink zc-av-mR10"></span>{{label}}</div>', {
                id: e,
                icon_class: a,
                purpose: i,
                $label: t
            })
        },
        o = function(e) {
            var t = e.getCurrentMember();
            if (e.isVideoCall() || t.hasSwitchedToVideo()) {
                var a = t.getAVUpStream(),
                    i = MediaUtil.getDeviceDropDownHtml(ZCMediaDevices.kinds.VIDEO_INPUT, a, {
                        dropDownContainerHtml: MediaTemplates.getDeviceDropdownCntHtml()
                    });
                return $WC.template.replace(i, {
                    open_callback: 'mediamodulebuttons purpose="openDevicesDropDown"',
                    select_callback: 'mediadevicewidgetbutton purpose="selectDevice"'
                }, "InSecureHTML")
            }
        },
        d = function(e) {
            var t = e.getCurrentMember().getAVUpStream(),
                a = MediaUtil.getDeviceDropDownHtml(ZCMediaDevices.kinds.AUDIO_INPUT, t, {
                    dropDownContainerHtml: MediaTemplates.getDeviceDropdownCntHtml()
                });
            return $WC.template.replace(a, {
                open_callback: 'mediamodulebuttons purpose="openDevicesDropDown"',
                select_callback: 'mediadevicewidgetbutton purpose="selectDevice"'
            }, "InSecureHTML")
        },
        c = function() {
            var e = MediaUtil.getAudioOutputDropDownHtml({
                dropDownContainerHtml: MediaTemplates.getDeviceDropdownCntHtml()
            });
            return $WC.template.replace(e, {
                open_callback: 'mediamodulebuttons purpose="openDevicesDropDown"',
                select_callback: 'mediadevicewidgetbutton purpose="selectDevice"'
            }, "InSecureHTML")
        };
    return {
        getMainUIHtml: function(i) {
            var s, l = i.getCaller(),
                r = i.getCallee(),
                o = "",
                d = "",
                c = i.isLiveFeedAssociated() ? "AV-call-live-feed" : "",
                C = "AV-call-mainview",
                u = l.getId() === MediaCall.BRIDGE.Constants.ZUID,
                p = i.getOtherMember().getClientType(),
                m = i.isScreenShareWithAudioCall() && u,
                h = MediaTemplates.getScreenShareIndicator("mediacallbuttons", m),
                g = MediaTemplates.getScreenShareIndicatorForMiniPlayer("mediacallbuttons", !m),
                I = m ? "AV-call-scrnshare-ind" : "";
            s = $WC.template.replace(e.pipOption, {
                $title: "avcliq.media.open.pip"
            }), r.getId() === MediaCall.BRIDGE.Constants.ZUID && (i.isScreenShareWithAudioCall() || i.isScreenShare()) && (d = "AV-call-mainview", C = "AV-call-subview-2", o = t(l.getId(), l.getName()));
            var v = '<div id="mediacall_container" class="AV-call-container AV-call-detached" detached>' + e.mainUI + "</div>",
                M = $WC.template.replace(v, {
                    fullscrn_recording_indicator: MediaTemplates.getRecordingIndicatorHtml("av-tooltip-bottom", "AV-call-newbox zc-av-mL6"),
                    toggle_chat_opt: void 0 === MediaCall.BRIDGE || void 0 !== MediaCall.BRIDGE.handleChatInRhs ? '<div class="AV-call-newbox AV-call-hover zcf-chat av-tooltip-right0" av-tooltip-title="{{chat_title}}" mediacallbuttons purpose="openChatInRHS"></div>' : "",
                    initial_cnt: n(i),
                    caller_class: l.getId() === MediaCall.BRIDGE.Constants.ZUID ? "AV-call-subview" : C,
                    callee_class: r.getId() === MediaCall.BRIDGE.Constants.ZUID ? "AV-call-subview" : C,
                    screen_class: d,
                    wb_class: "",
                    wb_container: "",
                    screen_container: o,
                    live_feed_class: c,
                    scrn_share_ind_class: I,
                    caller_video_container: a(e.videoContainer, l.getId(), l.getName(), u, p),
                    callee_video_container: a(e.videoContainer, r.getId(), r.getName(), !u, p),
                    screenshare_indicator: h,
                    pip_mode_switch: s,
                    target_elem_selector: MediaUtil.isAVLibraryLoadedInChatbar() ? "#mediacall_container" : "body",
                    recording_indicator: MediaTemplates.getRecordingIndicatorHtml("av-tooltip-up"),
                    miniplayer_screenshare_indicator: g,
                    connection_state_loader: ZCMediaTemplates.getConnectionLoaderHtml("videochat.message.reconnect"),
                    adhoc_call_state_container: e.bottomStatusContainer
                }, "InSecureHTML");
            return $WC.template.replace(M, {
                call_id: i.getId(),
                caller_id: i.getCaller().getId(),
                callee_id: i.getCallee().getId(),
                call_type: i.getType(),
                $chat_title: "common.chat",
                $minimize_back_title: "media.back.minimize.view",
                $minimize_title: "videochat.minimize",
                $maximize_title: "videochat.fullscreen",
                $fullscreen_title: "media.open.fullscreen"
            })
        },
        getOptionsHtml: function(t) {
            var a = t.getCurrentMember(),
                i = t.getOtherMember(),
                n = $WC.template.replace(e.callOptionsTop, {
                    health_meter_cnt: MediaCall.isNetworkIndicatorEnabled() ? MediaTemplates.getNetworkHealthIndicatorHtml({
                        customAttribute: "userId=" + t.getCurrentMember().getId()
                    }) : "",
                    status_cnt: t.isAudioLayoutRequired() ? '<div class="zc-av-font13 AV-call-top-status zc-av-dN" topstatuscnt></div>' : ""
                }, "InSecureHTML"),
                l = "";
            MediaCall.isWhiteBoardAllowed(t) && (l = s());
            var r = $WC.template.replace(e.callOptionsCnt, {
                device_info_cnt: MediaTemplates.getDeviceInfoIndicationHtml(i.getClientType()),
                name_cnt: '<div class="zc-av-font15 zc-av-fontB zc-av-ellips" other-username>{{user_name}}</div>',
                video_mute_display: t.isVideoCall() || a.hasSwitchedToVideo() || i.hasSwitchedToVideo() ? "" : "zc-av-dN",
                call_options_top: n,
                share_options: l,
                recording_indicator: MediaTemplates.getRecordingIndicatorHtml("av-tooltip-up")
            }, "InSecureHTML");
            return $WC.template.replace(r, {
                id: t.getId(),
                user_name: t.getOtherMember().getName(),
                $audio_mute_title: MediaUtil.getMicOffToolTip(),
                $video_mute_title: "videochat.cameraoff",
                $end_title: "videochat.endcall",
                $more_optns_tooltip: "avcliq.media.more",
                $health_label: MediaCall.isNetworkIndicatorEnabled() ? "avcliq.network.strength.title" : ""
            })
        },
        getShareButtonHtml: s,
        getMoreOptionsHtml: function(t) {
            var a = MediaCall.BRIDGE.Constants.IS_GUEST_USER,
                i = $WC.template.replace(e.optionsDropDownItem, {
                    purpose: "openSettings",
                    custom_class: "",
                    disabled_info: "",
                    disabled_attr: "",
                    icon: "zcf-setting",
                    $content: "avcliq.common.settings"
                });
            if (!MediaCall.isWhiteBoardAllowed(t) && MediaCall.BRIDGE.isScreenShareAllowed()) {
                var n = t.getCurrentMember().isSharingScreen();
                i += $WC.template.replace(e.optionsDropDownItem, {
                    purpose: n ? "stopScreenShare" : "startScreenShare",
                    disabled_info: "",
                    disabled_attr: "",
                    custom_class: n ? "AV-call-selected" : "",
                    icon: n ? "zcf-scrn-shr-stop" : "zcf-sharescrn",
                    $content: n ? "avcliq.media.screenshare.stop" : "avcliq.media.screenshare.start"
                })
            }
            var s = !t.isMigratedForRecording() || t.getOtherMember().hasSwitchedToVideo();
            t.getCurrentMember().hasSwitchedToVideo() || t.isInMigratingState() || !s || (i += $WC.template.replace(e.optionsDropDownItem, {
                purpose: "switchToVideo",
                custom_class: "",
                disabled_attr: "",
                disabled_info: "",
                icon: "zcf-video",
                $content: "mediacall.share.video"
            }));
            var l = MediaCallUI.getMediaCallWrapper(t.getId());
            if (MediaCallUI.isInFullScreenView(l) || "function" != typeof MediaCall.BRIDGE.handleChatOpen || (i += $WC.template.replace(e.optionsDropDownItem, {
                    purpose: "openChat",
                    custom_class: "",
                    disabled_info: "",
                    disabled_attr: "",
                    icon: "zcf-chat",
                    $content: "mediacall.chat.open"
                })), !a && MediaCall.isNotebookIntegrationSupported() && (i += $WC.template.replace(e.optionsDropDownItem, {
                    purpose: "takeNotes",
                    custom_class: "",
                    disabled_info: "",
                    disabled_attr: "",
                    icon: "zcf-notebook",
                    $content: "common.notes"
                })), !a && MediaCall.isAdhocCallConversionEnabled() && t.getCurrentMember().isAdhocCallingSupported()) {
                var r = !(C = t.getOtherMember()).isAdhocCallingSupported(),
                    o = t.isInMigratingState() || r,
                    d = "";
                r && (d = $WC.template.replace('<span class="zcf-failed AV-call-warning" title="{{info_text}}"></span>', {
                    $info_text: ["avcliq.mediacall.add.users.unsupported.info", MediaCall.BRIDGE.Users.getName(C.getId(), C.getName())]
                }));
                var c = $WC.template.replace(e.optionsDropDownItem, {
                    purpose: "addParticipantsToCall",
                    custom_class: o ? "AV-call-menu-disabled" : "",
                    disabled_attr: o ? "disabled" : "",
                    icon: "zcf-memberAdd",
                    $content: MediaUtil.isAVLibraryLoadedInChatbar() ? "avcliq.mediacall.users.add" : "mediacall.users.add"
                });
                i += $WC.template.replace(c, {
                    disabled_info: d
                }, "InSecureHTML")
            }
            if (!a && !t.isInMigratingState() && t.getCurrentMember().isRecordingSupported() && MediaCall.isRecordingConfigEnabled()) {
                r = !(C = t.getOtherMember()).isRecordingSupported();
                var C, u = t.getCurrentMember().isRecording();
                o = t.isInMigratingState() || r || !MediaCall.isStartRecordingAllowed() && !u, d = "";
                r && (d = $WC.template.replace('<span class="zcf-failed AV-call-warning" title="{{info_text}}"></span>', {
                    $info_text: ["avcliq.mediacall.add.users.unsupported.info", MediaCall.BRIDGE.Users.getName(C.getId(), C.getName())]
                }));
                var p = $WC.template.replace(e.optionsDropDownItem, {
                    purpose: u ? "stopCallRecording" : "startCallRecording",
                    custom_class: u ? "AV-call-selected" : o ? "AV-call-menu-disabled" : "",
                    disabled_attr: o ? "disabled" : "",
                    icon: "AV-call-record-icon AV-call-record-icon-circle flexM zcl-menu-item-icn",
                    $content: u ? "media.recording.stop" : "media.recording.start"
                });
                i += $WC.template.replace(p, {
                    disabled_info: d
                }, "InSecureHTML")
            }
            if (!MediaCallUI.isInFullScreenView(l)) {
                var m = t.isInPIP();
                i += $WC.template.replace(e.optionsDropDownItem, {
                    purpose: m ? "exitPIP" : "openInPIP",
                    custom_class: "",
                    disabled_info: "",
                    icon: "zcf-pip",
                    $content: m ? "avcliq.media.exit.pip" : "avcliq.media.open.pip"
                })
            }
            return $WC.template.replace('<div id="{{id}}dropdowncnt" class="AV-call-moreOpt">{{options}}</div>', {
                id: t.getId(),
                options: i
            }, "InSecureHTML")
        },
        getShareOptionsHtml: function(t) {
            var a, i = "";
            if (MediaCall.BRIDGE.isScreenShareAllowed()) {
                var n = t.getCurrentMember().isSharingScreen();
                i += $WC.template.replace(e.optionsDropDownItem, {
                    purpose: n ? "stopScreenShare" : "startScreenShare",
                    disabled_info: "",
                    disabled_attr: "",
                    custom_class: n ? "AV-call-selected" : "",
                    icon: n ? "zcf-scrn-shr-stop" : "zcf-sharescrn",
                    $content: n ? "avcliq.media.screenshare.stop" : "avcliq.media.screenshare.start"
                })
            }
            if (MediaCall.isWhiteBoardAllowed(t)) {
                var s = t.hasWhiteBoard();
                i += $WC.template.replace(e.shareOptionsDropDownItem, {
                    purpose: s ? "stopWhiteBoard" : "startWhiteBoard",
                    custom_class: s ? "zcl-neg-menu-item" : "",
                    icon: s ? "zcf-whiteboard-end" : "zcf-whiteboard",
                    $content: s ? "whiteboard.stop" : "whiteboard.start"
                })
            }
            MediaCall.isPresentationAllowed(t) && (t.hasPresentation() && t.isPresenter() ? a = {
                purpose: "stopPresentation",
                custom_class: "zcl-neg-menu-item",
                icon: "zcf-presentation-end",
                $content: "media.presentation.stop"
            } : t.hasPresentation() || (a = {
                purpose: "startPresentation",
                custom_class: "",
                icon: "zcf-presentation",
                $content: "media.presentation.start"
            }), void 0 !== a && (i += $WC.template.replace(e.shareOptionsDropDownItem, a)));
            return $WC.template.replace('<div id="{{id}}shrdropdowncnt" class="AV-call-moreOpt">{{options}}</div>', {
                id: t.getId(),
                options: i
            }, "InSecureHTML")
        },
        getScreenVideoContainerHtml: t,
        getWhiteBoardContainerHtml: function(t, a) {
            var i = a && a.hasWhiteBoard() ? a.getCurrentWhiteBoardId() : "",
                n = a && a.hasWhiteBoard() ? WhiteBoard.getBoardURL(i, a.getId()) : "";
            return $WC.template.replace(e.whiteBoardContainer, {
                title: t,
                buffer_loader: MediaTemplates.getBufferLoader(),
                data_uid: i,
                associate_id: a.getId(),
                $open_full_screen: "media.open.fullscreen",
                associate_type: "direct_call",
                src_url: n ? 'src="' + n + '"' : ""
            }, "InSecureHTML")
        },
        getSwitchNotifyCntHtml: function() {
            return $WC.template.replace(e.switchNotifyCnt, {
                $content: "mediacall.share.video.request",
                $ignore: "mediacall.share.video.ignore",
                $accept: "mediacall.share.video"
            })
        },
        getEndOptionsHtml: function(t, a) {
            var i = $WC.template.replace(e.endButtonGroup, {
                secondaryBtn_icon: a ? '<em class="zcf-call-again zc-av-font20"></em>' : ""
            }, "InSecureHTML");
            return i = $WC.template.replace(e.endCallOptCnt, {
                button_group_html: i
            }, "InSecureHTML"), $WC.template.replace(i, {
                secondaryBtn_class: "",
                primaryBtn_class: "zcf-mic zc-av-font20",
                secondaryBtn_title_class: "zc-av-mL6",
                primaryBtn_purpose: "startMediaRecording",
                secondaryBtn_purpose: "callAgain",
                $primaryBtn_title: "mediacall.voicenote.record",
                $secondaryBtn_title: "mediacall.callagain",
                $close_title: "common.cancel"
            })
        },
        showTrackEndedInfo: function() {
            var e, t, a = $WC.$Dlg.frameBodyInfoHTML({
                info: [MediaUtil.getResource("avcliq.media.audio.trackended.info")]
            }) + (t = {
                purpose: "showDeviceSettings",
                content: "avcliq.media.device.settings"
            }, '<div class="zc-av-textR zc-av-mT30">' + `<button mediacallbuttons purpose=${(e={purpose:"closeTrackEndedInfo",content:"common.close"}).purpose} class="zc-av-zcl-btn-large zc-av-zcl-btn--secondary">${MediaUtil.getResource(e.content)}</button>` + `<button mediacallbuttons purpose=${t.purpose} class="zc-av-zcl-btn-large zc-av-mL20 zc-av-zcl-btn--primary">${MediaUtil.getResource(t.content)}</button>` + "</div>");
            MediaUtil.createDialog({
                id: "track_ended_info",
                version: 3,
                class: "zcdalogbx zcbg_mask alert_dialog avcliq_track_ended_info",
                headerhtml: $WC.$Dlg.frameHeaderHTML({
                    imagehtml: '<div class="mheader_icn msi-alrt clr-red"></div>',
                    header: MediaUtil.getResource("avcliq.media.audio.trackended.header")
                }),
                bodyhtml: a
            }, !0)
        },
        showProceedRecordingConsent: function(t) {
            var a = $WC.template.replace(e.proceedRecordingConsentHeader, {
                $header_text: "avcliq.adhoccall.recording.consent.header"
            });
            MediaUtil.createPopup({
                id: "proceed_recording_consent",
                class: "modalwindow modalwindow2 zcalgncntr deleterecording zcbg_mask recording-modalwindow",
                header: a,
                closefn: t,
                html: $WC.template.replace(e.proceedRecordingConsentHtml, {
                    $stop_btn: "avcliq.media.recording.stop",
                    $stop_start_btn: "avcliq.adhoccall.recording.button.stop.and.start",
                    start_stop_btn_disabled: MediaCall.isRecordingConfigEnabled() && MediaCall.isStartRecordingAllowed() ? "" : "disabled"
                })
            }, !0)
        },
        getVideoInputDevicePickerHtml: o,
        getAudioInputDevicePickerHtml: d,
        getAudioOutputDevicePickerHtml: c,
        getStopRecordingBtnSet: function() {
            return $WC.template.replace(e.stopRecordingBtn, {
                $stop_recording_title: "avcliq.media.stop",
                btn_class: "zcf-stop-record"
            })
        },
        getPlayRecordingBtnSet: function() {
            return $WC.template.replace(e.endButtonGroup, {
                secondaryBtn_icon: "",
                secondaryBtn_title_class: "",
                secondaryBtn_class: "AV-call-send-record",
                primaryBtn_class: "zcf-newplay",
                primaryBtn_purpose: "playRecording",
                secondaryBtn_purpose: "sendRecording",
                $primaryBtn_title: "common.play",
                $secondaryBtn_title: "common.send"
            })
        },
        getRejectMessageDialogHtml: function(t) {
            var a = t.getCaller(),
                n = a.getId(),
                s = a.getName(),
                r = t.getType(),
                o = "videochat.incomming.screen";
            return r === MediaCallConstants.types.AUDIO ? o = "videochat.incomming.audio" : r === MediaCallConstants.types.VIDEO && (o = "videochat.incomming.video"), $WC.template.replace(e.replyUI, {
                reject_messages: l(t),
                incoming_call_btns: i(t),
                user_img: MediaCall.BRIDGE.Users.getImgUrlById(n),
                user_img_error_event: " onerror=MediaCallHandler.ImageLoadEvents.onError(this," + n + ")",
                caller_name: MediaCall.BRIDGE.Users.getName(n, s),
                $message_header: "videochat.incomming.sendmsg",
                $custom_placeholder: "videochat.incomming.custmsg",
                $call_status: o
            }, "InSecureHTML")
        },
        getRejectBoxCloseBtn: function() {
            return $WC.template.replace('<div class="AV-call-box zcf-close av-tooltip-up" av-tooltip-title="{{close_title}}" mediacallbuttons purpose="closeRejectMsgBox"></div>', {
                $close_title: "common.close"
            })
        },
        getAddParticipantsWinHtml: function(e) {
            return MediaTemplates.getUsersSuggestionWinHtml({
                headerTitle: ["mediacall.addusers.title", e.getOtherMember().getName()],
                searchPlaceHolder: "quickchat.node.placeholder",
                customAttribute: "mediacallbuttons",
                closePurpose: "closeAddParticipantWin",
                endActionPurpose: "ringAllParticipants",
                endActionContent: "mediacall.ring.users",
                userSuggestId: "addcallparticipants-usersuggest",
                inputNeeded: !0,
                inputAttribute: "mediacallinput",
                inputName: "adhoccalltitle",
                inputTitle: "common.topic",
                inputPlaceholder: "quickchat.input.placeholder",
                selectedListAttr: "data-selections",
                maxLimit: MediaCallImpl.userSuggestion.maxLimitForAdhocCall
            })
        },
        getSettingsLayoutHtml: function(t) {
            var a = r("av-devicesetting-lhs", "videochat.settings.devicesettings", "zcf-device-setting", "setMediaDevices");
            MediaCallImpl.isCurrentModeVideoCall(t) && MediaCall.isDiretCallVideoEffectsEnabled() && (a += r("av-video-effects-lhs", "avcliq.cc.video.effects", "zcf-video-blur", "switchToVideoEffects")), $ZCUtil.Browser.isFirefox() || $ZCUtil.Browser.isSafari() || (a += r("av-network-stats-lhs", "avcliq.networkstats.title", "zcf-network-perf", "switchToConnectionStatsTab"));
            var i = $WC.template.replace(e.settingsLayoutHtml, {
                settings_lhs_html: a,
                settings_body_html: ""
            }, "InSecureHTML");
            return $WC.template.replace(i, {
                $settings_header: "avcliq.common.settings"
            })
        },
        getDeviceSettingsHtml: function(t, a, i) {
            var n = t.getCurrentMember(),
                s = o(t),
                l = d(t),
                r = c(),
                C = "",
                u = n.isVideoMuted(),
                p = n.isAudioMuted(),
                m = n.getAVUpStream();
            s && "" !== s && (C += MediaTemplates.getMediaControlOption({
                headerKey: "avcliq.media.setdevices.videoinput",
                iconClass: u ? "zcf-video-mute" : "zcf-video",
                needsSeparator: !1,
                checkboxAttribute: "mediacallcheckbox",
                checkboxPurpose: "toggleVideoInPreviewPage",
                isSelected: !u,
                customAttribute: "avcliq_videoinput",
                deviceDropDown: s
            })), l && "" !== l && (C += MediaTemplates.getMediaControlOption({
                headerKey: "avcliq.media.setdevices.audioinput",
                iconClass: p ? "zcf-mic-mute" : "zcf-mic",
                needsSeparator: !1,
                checkboxAttribute: "mediacallcheckbox",
                checkboxPurpose: "toggleAudioInPreviewPage",
                isSelected: !p,
                customAttribute: "avcliq_audioinput",
                deviceDropDown: l
            })), r && "" !== r && (C += MediaTemplates.getOutputAudioControlOption({
                headerKey: "avcliq.media.setdevices.audiooutput",
                customClass: "",
                needsSeparator: !1,
                audioOutputAttribute: "mediacallbuttons",
                audioOutputPurpose: "playDummySoundInPreviewPage",
                deviceDropDown: r
            }));
            var h = $WC.template.replace(e.deviceSettingsHtml, {
                category_list_html: C,
                system_requirement_link: MediaTemplates.getSystemRequirementLinkHtml(),
                audio_card: MediaTemplates.getAudioCardHtml(n.getId()),
                img_class: u ? "dN" : "",
                disable_video: "",
                img_src: MediaCall.BRIDGE.Users.getImgUrlById(n.getId()),
                user_img_error_event: " onerror=MediaCallHandler.ImageLoadEvents.onError(this," + n.getId() + ")",
                video_mute_class: m && m._hasVideoTrack() ? "" : "avcliq-video-muted",
                video_mirror_option: MediaTemplates.getVideoMirrorHtml("mediacallcheckbox", "toggleVideoRotateConfig")
            }, "InSecureHTML");
            return $WC.template.replace(h, {
                $settings_title: "videochat.settings.devicesettings"
            })
        },
        getVideoEffectsPanel: function(e) {
            var t = MediaTemplates.getVideoEffectsPalet({
                    id: "av_video_effects_panel",
                    background: {
                        selectedType: e.getSelectedVideoBackground(),
                        customAttribute: "mediacallbuttons",
                        purpose: "selectVideoBackground"
                    },
                    filter: {
                        selectedType: e.getSelectedVideoFilter(),
                        customAttribute: "mediacallbuttons",
                        purpose: "selectVideoFilter"
                    }
                }),
                a = MediaTemplates.getCheckboxHtml("remembervideoeffectstoggle", "avcliq.linkpreview.consent.checkbox", e.canRememberVideoEffects(), "mediacallcheckbox", "toggleRememberVideoEffects", !0),
                i = $WC.template.replace(MediaTemplates.videoEffectsSettings, {
                    mirror_video_checkbox: MediaTemplates.getVideoMirrorHtml("mediacallcheckbox", "toggleVideoRotateConfig"),
                    palet: t,
                    check_box: a
                }, "InSecureHTML");
            return $WC.template.replace(i, {
                img_src: MediaCall.BRIDGE.Users.getImgUrlById(e.getCurrentMember().getId()),
                custom_attribute: "mediacallbuttons",
                $header: "avcliq.cc.video.effects",
                $cancel_btn: "common.cancel",
                $apply_btn: "avcliq.common.apply"
            })
        }
    }
}();
var MediaCallHandler = {};
MediaCallHandler = {
    peerConnectionEvents: {
        sendOffer: function(e, t, a, i, n, s) {
            var l = MediaCallImpl.getCurrentSession();
            if (l && l.getId() === e) {
                var r = {
                    perfect_renegotiation: l.getCurrentMember().isPerfectRenegotiationSupported(),
                    multi_stream: l.getCurrentMember().isMultiStreamSupported(),
                    adhoc_call_support: l.getCurrentMember().isAdhocCallingSupported(),
                    lyra_support: l.getCurrentMember().isLyraCodecSupported(),
                    call_collision_handling: l.getCurrentMember().isCallCollisionSupported(),
                    initial_reconnection: l.getCurrentMember().isInitialReconnectionSupported(),
                    recording_support: l.getCurrentMember().isRecordingSupported(),
                    handoff_support: l.getCurrentMember().isHandoffSupported(),
                    reconnection_policy: !0,
                    close_track_on_mute: !0,
                    whiteboard_support: MediaCall.BRIDGE.isWhiteBoardAllowed(),
                    presentation_support: MediaCall.BRIDGE.isPresentationAllowed()
                };
                MediaCall.isNewRTCConnectionEnabled() && (r.new_rtc_connection_support = l.getCurrentMember().isNewRTCConnectionSupported());
                var o = function() {
                        var t = MediaCallImpl.getCurrentSession();
                        t && t.getId() === e && t.isInitialConnection() && !t.isHandOffInProgress() && t.addLongPollingController()
                    },
                    d = function(a) {
                        if (void 0 === a || a.code !== MediaCallAPI.errorCodes.CALL_ALREADY_ENDED) {
                            var i = MediaCallImpl.getCurrentSession();
                            i && i.getId() === e && (i.writeToLog(CallLogConstants.webrtc.sendOfferFailedRetry, t), clearTimeout(i._sendOfferTimer), i._sendOfferTimer = setTimeout((function() {
                                c()
                            }), 2e3))
                        } else MediaCallImpl.handleEnd(e, !1)
                    },
                    c = function() {
                        var c = l.getCurrentMember();
                        l.writeToLog(CallLogConstants.webrtc.sendOffer, t), a = l.isHandOffInProgress() ? MediaCallRTCPeerConnectionConstants.processTypes.HANDOFF : a, MediaCallAPI.sendOfferSdp(e, t, a, i, n, r, s, c.hasSwitchedToVideo(), c.isSharingScreen(), o, d)
                    };
                MediaCall.BRIDGE.isWMSConnected() || MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.WS_DISCONNECT), c()
            }
        },
        sendAnswer: function(e, t, a, i, n) {
            var s = MediaCallImpl.getCurrentSession();
            if (s && s.getId() === e)
                if (s.isCaller(s.getCurrentMemberId()) || s.isAnswerCallNotified() || a === MediaCallRTCPeerConnectionConstants.processTypes.REINIT || a === MediaCallRTCPeerConnectionConstants.processTypes.RENEGOTIATE) MediaCallAPI.sendAnswerSdp(e, t, a, i, n);
                else {
                    MediaCall.BRIDGE.isWMSConnected() || MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.WS_DISCONNECT), s.setAnswerCallAsNotified();
                    var l = {
                        perfect_renegotiation: s.getCurrentMember().isPerfectRenegotiationSupported(),
                        multi_stream: s.getCurrentMember().isMultiStreamSupported(),
                        adhoc_call_support: s.getCurrentMember().isAdhocCallingSupported(),
                        lyra_support: s.getCurrentMember().isLyraCodecSupported(),
                        call_collision_handling: s.getCurrentMember().isCallCollisionSupported(),
                        initial_reconnection: s.getCurrentMember().isInitialReconnectionSupported(),
                        recording_support: s.getCurrentMember().isRecordingSupported(),
                        handoff_support: s.getCurrentMember().isHandoffSupported(),
                        reconnection_policy: !0,
                        close_track_on_mute: !0,
                        whiteboard_support: MediaCall.BRIDGE.isWhiteBoardAllowed(),
                        presentation_support: MediaCall.BRIDGE.isPresentationAllowed()
                    };
                    MediaCall.isNewRTCConnectionEnabled() && (l.new_rtc_connection_support = s.getCurrentMember().isNewRTCConnectionSupported()), s.writeToLog(CallLogConstants.webrtc.answerWithSdpInit, t);
                    var r = {
                        description: t,
                        tracks_media_id: n,
                        client_support: l
                    };
                    s.getCurrentMember().isVideoCallWithoutVideo() && (r.video = {
                        muted: !0,
                        time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
                    }), MediaCallAPI.answerCall(e, s.getMultipleCallsHandlingType(), r, (function() {
                        var t = MediaCallImpl.getCurrentSession();
                        t && t.getId() === e && t.setEventTime("ANSWER_API_RESPONSE", MediaCall.BRIDGE.Util.getSyncedCurrentTime())
                    }), (function(t) {
                        var a = MediaCallImpl.getCurrentSession();
                        if (a && a.getId() === e) {
                            if (a.writeToLog(CallLogConstants.webrtc.answerWithSdpFailed, t), a.resetAnswerCallAsNotified(), void 0 === t) return;
                            if (MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleCallAPIError && MediaCall.BRIDGE.listener.handleCallAPIError(t, a.getDetails()), MediaCallAPI.errorCodes.isCallAlreadyAnsweredError(t.code) || MediaCallAPI.errorCodes.isCallEndError(t.code)) MediaCallImpl.handleEnd(a.getId());
                            else if (t.code === MediaCallAPI.errorCodes.ALREADY_ON_A_CALL) return void MediaUtil.showMultipleCallAlertPopup(a.getOtherMemberId(), (function() {
                                var t = MediaCallImpl.getCurrentSession();
                                t && t.getId() === e && t.getMultipleCallsHandlingType() !== MediaCallConstants.multipleCallHandlingType.END_ACTIVE_CALLS && (t.terminate(), MediaCallUI.removeCallUI(t), MediaCallImpl.clearRunningSession(e), MediaCallAPI.declineCall(e))
                            }), (function() {
                                var t = MediaCallImpl.getCurrentSession();
                                t && t.getId() === e && (t.setMultipleCallsHandlingType(MediaCallConstants.multipleCallHandlingType.END_ACTIVE_CALLS), t.answerCall())
                            }))
                        }
                    }))
                }
        },
        handleOnIceCandidate: function(e, t, a) {
            var i = MediaCallImpl.getCurrentSession();
            i && i.getId() === e && !a && i.setCandidateGenerationTime(t.type, MediaCall.BRIDGE.Util.getSyncedCurrentTime())
        },
        updateIceCandidates: function(e, t, a, i) {
            var n = MediaCall.isForceTurnEnabled();
            n && (t = MediaCallImpl.filterRelayCandidates(t));
            var s = MediaCallImpl.getCurrentSession();
            s && s.getId() === e && (s.writeToLog(CallLogConstants.webrtc.forceTurn, n), s.writeToLog(CallLogConstants.webrtc.updateIce, t), MediaCallImpl.hasTurnCandidates(t) && s.getCurrentMember().setTurnCandidatesGenerated(), MediaCallAPI.updateIceCandidates(e, t, a, i))
        },
        handleIceConnectionStateChange: function(e, t) {
            var a = MediaCallImpl.getCurrentSession(),
                i = a && a.getId() === e ? a : MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== i && (i.isInitialConnection() && i.storeIceConnectionState(t), i.writeToLog(CallLogConstants.webrtc.iceConnectionStateChange, t))
        },
        handleIceGatheringStateChange: function(e, t) {
            var a = MediaCallImpl.getCurrentSession(),
                i = a && a.getId() === e ? a : MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== i && (i.isInitialConnection() && i.storeIceGatheringState(t), i.writeToLog(CallLogConstants.webrtc.iceGatheringStateChange, t))
        },
        handleSignalingStateChange: function(e, t) {
            var a = MediaCallImpl.getCurrentSession(),
                i = a && a.getId() === e ? a : MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== i && i.writeToLog(CallLogConstants.webrtc.signalingStateChange, t)
        },
        canStartConnectionTimeout: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e) {
                var a = MediaCall.isReconnectOnConnectionTimeoutEnabled(t) && t.isInitialConnection();
                return t.writeToLog(CallLogConstants.canStartConnectionTimeout, a), a
            }
        },
        handleInitialReconnection: function(e, t, a, i, n) {
            var s = MediaCallImpl.getCurrentSession();
            if (s && s.getId() === e && i.length && n.length) {
                var l = s.getCurrentMember(),
                    r = s.getOtherMember(),
                    o = void 0;
                MediaCallRTCPeerConnectionConstants.turnTypes.isGeo(t) ? o = l.isTurnCandidatesGenerated() && r.isTurnCandidatesGenerated() ? MediaCallConstants.logEvents.GEO_NO_CONNECT : MediaCallConstants.logEvents.GEO_NO_CANDIDATE : MediaCallRTCPeerConnectionConstants.turnTypes.isMain(t) ? o = l.isTurnCandidatesGenerated() && r.isTurnCandidatesGenerated() ? MediaCallConstants.logEvents.MAIN_NO_CONNECT : MediaCallConstants.logEvents.MAIN_NO_CANDIDATE : MediaCallRTCPeerConnectionConstants.turnTypes.isBackup(t) && (o = l.isTurnCandidatesGenerated() && r.isTurnCandidatesGenerated() ? MediaCallConstants.logEvents.BACKUP_NO_CONNECT : MediaCallConstants.logEvents.BACKUP_NO_CANDIDATE), o && (s.writeToLog(CallLogConstants.initialReconnection, o), MediaCallAPI.pushCallEventLog(e, o, a)), l.resetTurnCandidatesGenerated(), r.resetTurnCandidatesGenerated()
            }
        },
        handleReconnect: function(e, t, a, i, n) {
            var s = MediaCallImpl.getCurrentSession();
            if (s && s.getId() === e) {
                var l = s.getMember(a);
                MediaCallImpl.handleReconnection(s, t), l.handleReconnect(e, t, s.isCaller(MediaCall.BRIDGE.Constants.ZUID))
            }
        },
        handleReinit: function(e, t, a, i) {
            var n = MediaCallImpl.getCurrentSession();
            n && n.getId() === e && (n.writeToLog(CallLogConstants.webrtc.reinit, {
                turnType: i
            }), n.getMember(t).handleReinit(a))
        },
        handleRenegotiate: function(e, t, a, i) {
            var n = MediaCallImpl.getCurrentSession();
            n && n.getId() === e && (n.writeToLog(CallLogConstants.webrtc.renegotiate, {
                turnType: i
            }), a || n.getCurrentMember().isPerfectRenegotiationSupported() && n.getOtherMember().isPerfectRenegotiationSupported() ? n.getMember(t).renegotiateOffererConnection(!0) : MediaCallAPI.renegotiate(e))
        },
        handleTrack: function(e, t, a) {
            var i = MediaCallImpl.getCurrentSession();
            i && i.getId() === e && a.length > 0 && (i.writeToLog(CallLogConstants.webrtc.addTrack, {
                type: t.kind,
                id: t.id
            }), i.setReceivedTrack(t, a), "audio" == t.kind && MediaManager.setPreferredAudioOutput([MediaCallUI.getVideoContainer(e, i.getOtherMemberId()).find("video")[0]]))
        },
        isLyraCodecNeeded: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e) return t.isLyraCodecSupported()
        },
        isREDCodecNeeded: function() {
            return MediaCall.isREDCodecEnabled() && WebRTCUserMedia.Codecs.isSetCodecPreferenceSupported() && WebRTCUserMedia.Codecs.canEncodeRED()
        },
        isPreBindIceCandidateEnabled: function(e) {
            return !MediaCall.BRIDGE.Util.Browser.isFirefox()
        },
        handleIceCandidateError: function(e, t) {
            var a = MediaCallImpl.getCurrentSession(),
                i = a && a.getId() === e ? a : MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== i && i.writeToLog(CallLogConstants.webrtc.iceCandidateError, t)
        },
        handleDisconnected: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === e) a.writeToLog(CallLogConstants.webrtc.connection.disconnected);
            else {
                var i = MediaCallImpl.getFromIncomingSessions(e);
                void 0 !== i && i.writeToLog(CallLogConstants.webrtc.connection.disconnected)
            }
        },
        handleFailed: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === e) a.writeToLog(CallLogConstants.webrtc.connection.failed);
            else {
                var i = MediaCallImpl.getFromIncomingSessions(e);
                void 0 !== i && i.writeToLog(CallLogConstants.webrtc.connection.failed)
            }
        },
        handleConnected: function(e, t, a, i, n) {
            var s = MediaCallImpl.getCurrentSession();
            if (s && s.getId() === e) {
                var l = s.isInitialConnection(),
                    r = s.getCurrentMember(),
                    o = s.getOtherMember(),
                    d = s.isHandOffInProgress();
                r.clearLastReconnectionId(), s.removeNetworkPredictor(), s.removeLongPolingController(), s.writeToLog(CallLogConstants.webrtc.connection.success), l && (MediaCallRTCPeerConnectionConstants.turnTypes.isMain(n) ? MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.MAIN_CONNECTED) : MediaCallRTCPeerConnectionConstants.turnTypes.isBackup(n) && MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.BACKUP_CONNECTED), s.isConnectedViaPolling() && MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.LP_CONNECTED, void 0, void 0, s.isCaller(MediaCall.getCurrentUserId())), "undefined" != typeof RemoteWork && RemoteWork.isInRemoteWorkView() && RemoteWork.syncDetailsUI(), s.resetInitialConnection()), d && (s.setStatusText(MediaCallConstants.statusText.CALL_HANDOFF_COMPLETE), r.isHandOffInitiator() && MediaCallAPI.updateCallStatus(e, MediaCallConstants.statusText.CALL_HANDOFF_COMPLETE));
                var c = r.getAVUpStream();
                if (void 0 !== c) {
                    var C = [];
                    c._hasAudioTrack() && C.push(ZCMediaConstants.mediaDevices.MICROPHONE + ": " + c._getAudioDeviceLabel() + " - " + c._getAudioDeviceId()), c._hasVideoTrack() && C.push(ZCMediaConstants.mediaDevices.CAMERA + ": " + c._getVideoDeviceLabel() + " - " + c._getVideoDeviceId()), s.writeToLog(CallLogConstants.selectedMediaDevices, C)
                }
                WebRTCUserMedia.isSetBitRateSupported() && s.getMember(MediaCall.BRIDGE.Constants.ZUID).setBitRateForStream(1e6, WebRTCUserMedia.streamTypes.VIDEO_ONLY), MediaCallUI.adaptUIToState(s, MediaCallConstants.states.CONNECTED), MediaCallImpl.stopTone(MediaCallConstants.states.RECONNECTING), l && ((r.isScreenShareWithoutAudio() || r.isAudioMuted()) && MediaCallImpl.handleMute(e, ZCMediaConstants.muteCases.permissionDenied), (r.isVideoCallWithoutVideo() || r.isVideoMuted()) && MediaCallImpl.handleVideoMute(e, ZCMediaConstants.muteCases.permissionDenied), (r.hasSwitchedToVideo() || o.hasSwitchedToVideo()) && (MediaCallUI.removeSwitchToVideoInfo(s), MediaCallUI.handleSwitchToVideoLayout()), o.setUpdatedAVStatus(), s.hasPresentation() && s.getPresentation().open()), s.isConnectedStateNotified() || (MediaCallImpl.triggerSessionTimer(d ? s.getStartTime() : void 0), s.setConnectedStateAsNotified(), s.writeToLog(CallLogConstants.callState.connected), MediaCallAPI.updateCallStatus(e, MediaCallConstants.statusText.CALL_CONNECTED, void 0, (function() {
                    s.writeToLog(CallLogConstants.callState.failed), s.resetConnectedStateAsNotified()
                })));
                WebRTCPeerConnectionStats.initiateGathering(e, "calls", t, {
                    statsObjectMaxSize: MediaCallImpl.statsObjectApiMaxSize
                }, {
                    statsCallBack: function(e, t, a, i) {
                        (MediaCallImpl.handleConnectionStatsCallBack(t), MediaUtil.isNetworkAdapterEnabled()) && MediaCallImpl.getCurrentSession().getCurrentMember().pushStatsToConnectionMonitor(MediaCallImpl.getCurrentSession().getConnectionStatsData())
                    },
                    networkInfoCallBack: MediaAPI.pushConnectionNetworkDetails,
                    updateStatsCallBack: MediaAPI.pushConnectionStats,
                    candidatePairInfoCallBack: function(e, t, a) {
                        var i = MediaCallImpl.getCurrentSession();
                        i && i.getId() === e && (i.writeToLog(CallLogConstants.candidatePairInfo, a), MediaCallAPI.updateLog(e, "CALL_CANDIDATEPAIR", {
                            loc_time: new Date,
                            time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                            user_type: i.isCaller(MediaCall.BRIDGE.Constants.ZUID) ? "caller" : "callee",
                            zuid: MediaCall.BRIDGE.Constants.ZUID,
                            call_mode: i.getType(),
                            remote_ip: a.remote_ip + ":" + a.remote_candidate_port,
                            local_ip: a.local_ip + ":" + a.local_candidate_port,
                            remote_candidate_type: a.remote_candidate_type,
                            local_candidate_type: a.local_candidate_type
                        }))
                    },
                    errorCallback: function(t, a) {
                        var i = MediaCallImpl.getCurrentSession();
                        i && i.getId() === e && i.startActiveCallUpdate()
                    }
                }), i === MediaCallRTCPeerConnectionConstants.processTypes.RESTART && MediaCallAPI.updateLog(s.getId(), "CALL_RECONNECTION_SUCCESS", {
                    loc_time: new Date,
                    time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                    user_type: s.isCaller(MediaCall.BRIDGE.Constants.ZUID) ? "caller" : "callee",
                    zuid: MediaCall.BRIDGE.Constants.ZUID,
                    call_mode: s.getType()
                });
                t && s.addCallStrengthAnalyser(t, {
                    updateCallQuality: function(e, t, a) {
                        var i = MediaCallImpl.getCurrentSession();
                        i && i.getId() === e && (i.hasAnalysedAudioLoss() || MediaCallImpl.analyseAudioLoss(i, a), MediaCall.isNetworkIndicatorEnabled() && MediaCallImpl.updateNetworkHealthMeter(i))
                    }
                })
            }
        },
        handleClosed: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            a && a.getId() === e && (MediaCallAPI.updateLog(a.getId(), "CALL_RECONNECTION_FAILURE", {
                loc_time: new Date,
                time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                user_type: a.isCaller(MediaCall.BRIDGE.Constants.ZUID) ? "caller" : "callee",
                zuid: MediaCall.BRIDGE.Constants.ZUID,
                call_mode: a.getType()
            }), a.writeToLog(CallLogConstants.webrtc.connection.closed), MediaCallImpl.handleEnd(e, !0, {
                playEndTone: !0
            }))
        },
        hasRemoteVideo: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e) return t.getOtherMember().hasSwitchedToVideo() || t.isHandOffInProgress()
        },
        hasRemoteScreen: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e) return t.getOtherMember().isSharingScreen() || t.isHandOffInProgress()
        },
        handleConnectionError: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            a && a.getId() === e && (a.writeToLog(CallLogConstants.webrtc.connection.failed, t), t.code === WebRTCPeerConnectionConstants.connectionErrors.UDP_BLOCKING && MediaUtil.showUDPBlockedWarning(ZCJQuery("#mediacall_container")))
        },
        hasStreamCallback: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === e) {
                var i = a.getCurrentMember();
                if (t === WebRTCUserMedia.streamTypes.AUDIO_ONLY) return i.getAVUpStream() && i.getAVUpStream()._hasAudioTrack();
                if (t === WebRTCUserMedia.streamTypes.VIDEO_ONLY) return i.getAVUpStream() && i.getAVUpStream()._hasVideoTrack();
                if (t === WebRTCUserMedia.streamTypes.SCREEN) return i.getScreenUpStream() && i.getScreenUpStream()._hasVideoTrack()
            }
        },
        handleNetworkAdapterOptimization: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === e)
                if (t.action === WebRTCPeerConnectionConstants.optimizations.opr.SET) switch (t.level) {
                    case 1:
                        a.getCurrentMember().setBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.VIDEO_ONLY), a.writeToLog("Level 1 optimization triggered - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.info");
                        break;
                    case 2:
                        MediaCallImpl.handleVideoMute(e), a.writeToLog("Level 2 optimization triggered - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.videomuted");
                        break;
                    case 3:
                        MediaCallImpl.getCurrentSession().getCurrentMember().setBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.SCREEN), a.writeToLog("Level 3 optimization triggered - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.info");
                        break;
                    case 4:
                        MediaCallImpl.getCurrentSession().getCurrentMember().setBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.AUDIO_ONLY), a.writeToLog("Level 4 optimization triggered - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.info")
                } else if (t.action === WebRTCPeerConnectionConstants.optimizations.opr.RESET) {
                    var i = () => {
                        ZCJQuery("#avcliq_alert_indication").empty(), ZCJQuery("#avcliq_live_tracking_info").remove()
                    };
                    switch (t.level) {
                        case 1:
                            a.getCurrentMember().resetBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.VIDEO_ONLY), a.writeToLog("Level 1 optimization reset - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.recovered", i);
                            break;
                        case 2:
                            a.writeToLog("Level 2 optimization reset - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.videounmute", i);
                            break;
                        case 3:
                            MediaCallImpl.getCurrentSession().getCurrentMember().resetBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.SCREEN), a.writeToLog("Level 3 optimization reset - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.recovered", i);
                            break;
                        case 4:
                            MediaCallImpl.getCurrentSession().getCurrentMember().resetBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.AUDIO_ONLY), a.writeToLog("Level 4 optimization reset - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.recovered", i)
                    }
                }
        }
    },
    wmsEvents: {
        CALL_INITIATED: function(e) {
            var t;
            MediaCallImpl.isAVLoadedInIntegratedUI() || e.data.caller_id === MediaCall.BRIDGE.Constants.ZUID || (void 0 === (t = MediaCallImpl.getFromIncomingSessions(e.data.call_id)) ? ((t = new MediaCallSession(e.data)).writeToLog(CallLogConstants.wms.callInit), t.writeToLog(CallLogConstants.sessionId + MediaCall.BRIDGE.getSid() + "  " + CallLogConstants.rawSessionID + MediaCall.BRIDGE.getRawSid()), t.getCurrentMember().setClientSupport(MediaCallImpl.getClientSupport()), ZCWMSEventSync.pushEventId(e.msguid), void 0 !== e.data.client_support && (t.writeToLog(CallLogConstants.clentSupport, e.data.client_support), t.getOtherMember().setClientSupport(e.data.client_support)), t.addNetworkPredictor(), t.handleIncomingCallTimeout(), MediaCallImpl.addInIncomingSessions(t)) : void 0 !== e.data.client_support && t.getOtherMember().setClientSupport(e.data.client_support))
        },
        CALL_REQUESTED: function(e) {
            if (e.data.caller_id !== MediaCall.BRIDGE.Constants.ZUID && !MediaCallImpl.isAVLoadedInIntegratedUI()) {
                if (e.data.client_support && e.data.client_support.call_collision_handling) {
                    var t = MediaCallImpl.hasOutgoingSession() ? MediaCallImpl.getOutgoingSession() : MediaCallImpl.hasCurrentSession() && MediaCallImpl.getCurrentSession().isInInitialState() ? MediaCallImpl.getCurrentSession() : void 0;
                    if (t && t.getCalleeId() === e.data.caller_id) {
                        if (t.isInCallAnsweredState()) return;
                        return void(t.isInCallInitiatedState() || t.getStartTime() <= e.data.start_time ? MediaCallImpl.handleCallCollision(t, e) : (MediaCallAPI.updateCallStatus(e.data.call_id, MediaCallConstants.statusText.CALL_COLLISION), MediaCallImpl.removeFromIncomingSessions(e.data.call_id)))
                    }
                }
                var a = MediaCallImpl.getCurrentIncomingSession(),
                    i = void 0 !== a;
                if (i && MediaCall.BRIDGE.Util.getSyncedCurrentTime() - a.getStartTime() > 35e3 && (MediaCallImpl.handleEnd(a.getId(), !1), i = !1), MediaCallImpl.hasCurrentSession() || MediaCallImpl.hasOutgoingSession() || i) return MediaCallImpl.handleEnd(e.data.call_id, !1), void MediaCallAPI.updateCallStatus(e.data.call_id, MediaCallConstants.statusText.CALL_MISSED_ON_BUSY, void 0, void 0, void 0, !0);
                var n = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
                void 0 === n && ((n = new MediaCallSession(e.data)).getCurrentMember().setClientSupport(MediaCallImpl.getClientSupport()), ZCWMSEventSync.pushEventId(e.msguid), MediaCallImpl.addInIncomingSessions(n), n.addNetworkPredictor()), n.writeToLog(CallLogConstants.wms.callRequested), n.setEventTime("CALL_RECEIVED_EVENT", MediaCall.BRIDGE.Util.getSyncedCurrentTime()), e.data.caller_audio_status && e.data.caller_audio_status.muted && n.getCaller().setAudioMuted(), e.data.caller_video_status && e.data.caller_video_status.muted && n.getCaller().setVideoMuted(), e.data.caller_client_type && n.getOtherMember().setClientType(e.data.caller_client_type), ZCMediaDevices.syncPreferredDevices(), MediaCallAPI.updateCallStatus(n.getId(), MediaCallConstants.statusText.CALL_RECEIVED, (function(e) {
                    var t = MediaCallImpl.getFromIncomingSessions(e.call_id);
                    if (void 0 !== t) {
                        if (e.credentials) {
                            var a = t.getCurrentMember(),
                                i = e.credentials[a.getId()];
                            i && a.setTurnCredentials(i), n.writeToLog(CallLogConstants.callState.received, {
                                credentials: e.credentials
                            })
                        }
                        n.setEventTime("CALL_RECEIVED_API_RESPONSE", MediaCall.BRIDGE.Util.getSyncedCurrentTime())
                    }
                    e.devices && !ZCMediaDevices.isPreferredDevicesSynced() && ZCMediaDevices.setPreferredDevicesObject(e)
                }), (function(t) {
                    if (void 0 !== t && (MediaCallAPI.errorCodes.isCallAlreadyAnsweredError(t.code) || MediaCallAPI.errorCodes.isCallEndError(t.code))) {
                        var a = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
                        void 0 !== a && MediaCallImpl.handleEnd(a.getId(), !1)
                    }
                }), void 0, !0), n.setStatusText(MediaCallConstants.statusText.CALL_REQUESTED), n.handleIncomingCallTimeout(), n.getCurrentMember().storeRemoteTracksMediaId(e.data.tracks_media_id), n.getCurrentMember().storeRemoteSdp(JSON.parse(e.data.offer_description)), n.writeToLog(CallLogConstants.wms.offer, e.data), void 0 !== e.data.client_support && n.getOtherMember().setClientSupport(e.data.client_support), MediaCallRejectMessages.isInitialized() || MediaCallRejectMessages.init(), MediaCallUI.showCallUI(n), MediaCallImpl.playTone(n, MediaCallConstants.states.INCOMING);
                var s = "videochat.incoming.screen";
                n.isAudioCall() ? s = "videochat.incomming.audio" : n.isVideoCall() && (s = "videochat.incomming.video");
                var l = MediaUtil.getResource(s);
                MediaCall.BRIDGE.handleTitleChange(l), MediaCall.BRIDGE.Status.isDND() || MediaCall.BRIDGE.handlePushNotification({
                    type: "onetoonecall",
                    title: "@" + n.getCallerName(),
                    icon: MediaCall.BRIDGE.Users.getImgUrlById(n.getCallerId()),
                    body: l,
                    replyable: !1
                })
            }
        },
        CALL_RECEIVED: function(e) {
            if (e.data.caller_id === MediaCall.BRIDGE.Constants.ZUID) {
                var t = MediaCallImpl.getCurrentSession();
                t && t.getId() === e.data.call_id && (t.isInCallInitiatedState() || t.isInCallRequestedState()) && (t.writeToLog(CallLogConstants.wms.callReceived), t.handleCallReceived(), MediaCallUI.adaptUIToState(t, MediaCallConstants.states.RINGING), MediaCallAPI.updateLog(t.getId(), "CALL_RINGING", {
                    loc_time: new Date,
                    time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                    user_type: "caller",
                    zuid: MediaCall.BRIDGE.Constants.ZUID,
                    call_mode: t.getType()
                }))
            }
        },
        CALL_ANSWERED: function(e) {
            if (e.data.callee_id !== MediaCall.BRIDGE.Constants.ZUID) {
                var t = MediaCallImpl.getCurrentSession();
                if (t && t.getId() === e.data.call_id && !t.isInCallAnsweredState() && (MediaCallImpl.handleCallAnswered(t, e.data), e.data.callee_client_type)) {
                    var a = MediaCallUI.getVideoContainer(e.data.call_id, t.getOtherMemberId());
                    MediaCallUI.setDeviceInfoIndicationInCallUI(a, t.getOtherMember(), e.data.callee_client_type)
                }
            } else {
                var i = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
                void 0 !== i && MediaCallImpl.handleEnd(i.getId(), !1)
            }
        },
        CALL_ANSWERED_ACK: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            t && t.getId() === e.data.call_id && t.writeToLog(CallLogConstants.wms.callAnsweredAck)
        },
        CALL_COLLISION: function(e) {
            if (e.data.callee_id === MediaCall.BRIDGE.Constants.ZUID) {
                var t = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
                void 0 !== t && MediaCallImpl.handleEnd(t.getId(), !1)
            }
        },
        CALL_CONNECTED: function(e) {
            MediaCallImpl.hasCurrentSession() && MediaCallImpl.getCurrentSession().writeToLog(CallLogConstants.wms.callConnected)
        },
        CALL_CANCELED: function(e) {
            var t = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
            void 0 !== t && t.writeToLog(CallLogConstants.wms.callCanceled), MediaCallImpl.handleEnd(e.data.call_id, !1)
        },
        CALL_DECLINED: function(e) {
            var t = MediaCallImpl.getCurrentSession(),
                a = !1;
            t && t.getId() === e.data.call_id && (MediaCallUI.adaptUIToState(t, MediaCallConstants.states.DECLINED), t.writeToLog(CallLogConstants.wms.callDeclined)), e.data.caller_id === MediaCall.BRIDGE.Constants.ZUID && (MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.RINGING), a = !0), MediaCallImpl.handleEnd(e.data.call_id, !1, {
                showCallEndUI: a
            })
        },
        CALL_MISSED: function(e) {
            MediaCallImpl.handleEnd(e.data.call_id, !1), "undefined" != typeof CallHistoryData && e.data.callee_id === MediaCall.BRIDGE.Constants.ZUID && CallHistoryData.incrementMissedCallsCount()
        },
        CALL_MISSED_ON_BUSY: function(e) {
            var t = MediaCallImpl.getCurrentSession(),
                a = e.data.callee_id === MediaCall.BRIDGE.Constants.ZUID;
            t && t.getId() === e.data.call_id && MediaCallUI.adaptUIToState(t, MediaCallConstants.states.MISSED_ON_BUSY), MediaCallImpl.handleEnd(e.data.call_id, !1, {
                showCallEndUI: !a
            }), "undefined" != typeof CallHistoryData && a && CallHistoryData.incrementMissedCallsCount()
        },
        CALL_END: function(e) {
            var t = MediaCallImpl.getCurrentSession(),
                a = !1;
            t && t.getId() === e.data.call_id && ("undefined" != typeof RemoteWork && RemoteWork.isInRemoteWorkView() && RemoteWork.syncDetailsUI(), MediaCallImpl.getCurrentSession().writeToLog(CallLogConstants.wms.callEnd), a = !0), MediaCallImpl.handleEnd(e.data.call_id, !1, {
                playEndTone: a
            })
        },
        OFFER_SDP: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e.data.call_id) {
                t.writeToLog(CallLogConstants.wms.offer, e);
                var a = JSON.parse(e.data.offer_description),
                    i = t.getCurrentMember();
                if (i.storeRemoteTracksMediaId(e.data.tracks_media_id), i.setRemoteTurnType(e.data.turn_type), e.data.connection_state === MediaCallRTCPeerConnectionConstants.processTypes.HANDOFF) return void MediaCallImpl.connectCallHandOff(e, a);
                e.data.connection_state === MediaCallRTCPeerConnectionConstants.processTypes.REINIT ? i.reinitAnswererConnection(a) : e.data.connection_state === MediaCallRTCPeerConnectionConstants.processTypes.RENEGOTIATE ? i.renegotiateAnswererConnection(a, t.getOtherMemberId()) : i.isOfferAlreadyReceivedForReconnection(e.data.reconnection_id) || (i.setLastReconnectionId(e.data.reconnection_id), i.restartAnswererConnection(a), MediaCallImpl.handleReconnection(t, e.data.reconnection_id))
            }
        },
        ANSWER_SDP: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            t && t.getId() === e.data.call_id && (t.writeToLog(CallLogConstants.wms.answer, e.data), t.getCurrentMember().storeRemoteTracksMediaId(e.data.tracks_media_id), t.getCurrentMember().setRemoteSdp(JSON.parse(e.data.answer_description)))
        },
        ICE_CANDIDATE: function(e) {
            var t = MediaCallImpl.getCurrentSession(),
                a = JSON.parse(e.data.ice_candidates),
                i = MediaCall.isForceTurnEnabled();
            i && (a = MediaCallImpl.filterRelayCandidates(a));
            var n = MediaCallImpl.hasTurnCandidates(a);
            if (t && t.getId() === e.data.call_id) t.getCurrentMember().setRemoteIceCandidates(a), t.writeToLog(CallLogConstants.webrtc.forceTurn, i), t.writeToLog(CallLogConstants.wms.iceCandidates, e.data.ice_candidates), n && t.getOtherMember().setTurnCandidatesGenerated();
            else {
                var s = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
                void 0 !== s && (s.getCurrentMember().storeRemoteIceCandidates(a), s.writeToLog(CallLogConstants.webrtc.forceTurn, i), s.writeToLog(CallLogConstants.wms.iceCandidates, e.data.ice_candidates), n && s.getOtherMember().setTurnCandidatesGenerated())
            }
        },
        REINIT: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            t && t.getId() === e.data.call_id && (t.writeToLog(CallLogConstants.wms.reinit, e), t.getCurrentMember().reinitOffererConnection())
        },
        RENEGOTIATE: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            t && t.getId() === e.data.call_id && (t.writeToLog(CallLogConstants.wms.renegotiate, e), t.getCurrentMember().renegotiateOffererConnection(!1))
        },
        CALL_HOLD: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            t && t.getId() === e.data.call_id && (t.writeToLog(CallLogConstants.wms.callHold, e), t.getOtherMember().handleHoldStatus(e.data.hold, e.data.action_time))
        },
        MEDIA_SETTING: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e.data.call_id) {
                t.writeToLog(CallLogConstants.wms.mediaSetting + JSON.stringify(e));
                var a = t.getOtherMember();
                e.data.camera ? a.handleAVStreamStatus("video", "off" === e.data.camera, e.data.action_time) : e.data.mic ? a.handleAVStreamStatus("audio", "off" === e.data.mic, e.data.action_time) : e.data.screen && ("on" === e.data.screen ? (a.setAsSharingScreen(), t.getCurrentMember().setRemoteScreenStreamInContainer(), t.setAsScreenShared()) : (a.resetSharingScreen(), MediaCallUI.removeScreenContainer(t, a.getId())))
            }
        },
        GROUP_CALL_SWITCHED: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e.data.call_id) {
                e.data.action_user === MediaCall.BRIDGE.Constants.ZUID && (t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATED), MediaCallUI.adaptUIToState(t, MediaCallConstants.states.CALL_MIGRATED), "stop" === e.data.recording_action && AdhocCallBridge.publish(t, "stopRecording", {
                    associatedSessionId: t.getAssociatedConferenceId()
                }));
                var a = t.getAssociatedConferenceId();
                ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === a ? (ConferenceImpl.getCurrentSession().resetAdhocCallDetails(), t.resetMigratedForRecording(), MediaCallImpl.handleEnd(t.getId(), !1), ConferenceUI.getConferenceWindow().removeClass("dN")) : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === a && (ZCSmartConferenceImpl.getCurrentSession().resetAdhocCallDetails(), t.resetMigratedForRecording(), MediaCallImpl.handleEnd(t.getId(), !1), ZCSmartConferenceUI.getConferenceWindow().removeClass("dN")), AdhocCallBridge.detach(t)
            }
        },
        CALL_MIGRATING: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e.data.call_id) {
                var a = e.data.recording_migration;
                t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), MediaCallHandler.UIEvents.closeAddParticipantWin(), a ? MediaCallUI.adaptUIToState(t, MediaCallConstants.states.RECORDING_PROCESSING) : MediaCallUI.adaptUIToState(t, MediaCallConstants.states.MIGRATING)
            }
        },
        CALL_MIGRATED: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e.data.call_id) {
                if (t.writeToLog(CallLogConstants.migrated, e), t.isRedirectedToCliq()) return void MediaCallImpl.handleEnd(t.getId(), !1, {
                    playEndTone: !1
                });
                var a = t.getCurrentMember(),
                    i = t.getOtherMember(),
                    n = a.isSharingScreen();
                t.setAssociatedConferenceId(e.data.associated_conference_id), t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATED);
                var s = e.data.associated_conference_id,
                    l = e.data.recording_migration,
                    r = "undefined" != typeof ZCSmartConferenceImpl && ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === s,
                    o = "undefined" != typeof ConferenceImpl && ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === s;
                if (l)
                    if (t.setAsMigratedForRecording(), MediaCallUI.getMediaCallWrapper(t.getId()).removeClass("AV-call-migrating"), UI.updateBanner(I18N("media.recordings.starting.banner")), AdhocCallBridge.attach(t), r) {
                        var d = (u = ZCSmartConferenceImpl.getCurrentSession()).getVideoStreamWithUserId(a.getId()),
                            c = u.getVideoStreamWithUserId(i.getId());
                        d instanceof MediaStream && AdhocCallBridge.publish(u, "handleVideoStream", {
                            associatedSessionId: e.data.call_id,
                            videoStream: d,
                            userId: a.getId()
                        }), c instanceof MediaStream && AdhocCallBridge.publish(u, "handleVideoStream", {
                            associatedSessionId: e.data.call_id,
                            videoStream: c,
                            userId: i.getId()
                        })
                    } else if (o) {
                    var C = (m = ConferenceImpl.getCurrentSession()).getMember(i.getId()).getScreenStream();
                    C instanceof MediaStream && AdhocCallBridge.publish(m, "handleScreenStream", {
                        associatedSessionId: e.data.call_id,
                        screenStream: C,
                        userId: i.getId()
                    })
                }
                n = a.isSharingScreen();
                if (r) n && ZCSmartConferenceImpl.addScreenInSession(a.getScreenUpStream()), l || (MediaCallUI.removeCallUI(t), ZCSmartConferenceUI.getConferenceWindow().removeClass("dN")), ZCSmartConferenceUI.handleResize();
                else {
                    if (!(o || ZCJQuery("#conferencewindow") && ZCJQuery("#conferencewindow").attr("adhoccallid") === e.data.call_id)) return void MediaCallImpl.handleEnd(t.getId(), !0, {
                        playEndTone: !1
                    });
                    l || (MediaCallUI.removeCallUI(t), ConferenceUI.getConferenceWindow().removeClass("dN")), ConferenceUI.handleResize()
                }
                if (l || MediaUtil.setDarkMode(), e.data.ppt) {
                    var u, p = new Presentation(e.data.ppt);
                    if (r)(u = ZCSmartConferenceImpl.getCurrentSession()).setPresentation(p);
                    else if (o) {
                        var m;
                        (m = ConferenceImpl.getCurrentSession()).setPresentation(p)
                    }
                    p.open()
                }
            }
        },
        handleJoinPresentation: function(e) {
            PresentationHandler.handleJoinPresentation(e.data.ppt, MediaCallImpl.getCurrentSession())
        },
        handleEndPresentation: function(e) {
            PresentationHandler.handleStopPresentation(MediaCallImpl.getCurrentSession())
        },
        handlePresentationSlideChange: function(e) {
            PresentationHandler.handlePresentationSlideChange(e.data.ppt, MediaCallImpl.getCurrentSession())
        },
        CALL_HANDOFF_IN_PROGRESS: function(e) {
            var t = MediaCallImpl.getCurrentSession(),
                a = e.data.handoff_user_id,
                i = void 0,
                n = JSON.parse(e.data.add_info);
            if (t && t.getId() === e.data.call_id) {
                var s = t.getId();
                if (a === MediaCall.BRIDGE.Constants.ZUID) "complete_handoff" === e.data.handoff_type && MediaCallImpl.closeSessionWithoutNotifyingServer(t);
                else {
                    if (e.data.caller_client_type && e.data.callee_client_type) {
                        i = t.isCaller(t.getCurrentMemberId()) ? e.data.callee_client_type : e.data.caller_client_type;
                        var l = MediaCallUI.getMediaCallWrapper(s);
                        MediaCallUI.setDeviceInfoIndicationInCallUI(l, t.getOtherMember(), i)
                    }
                    if (e.data.client_support) {
                        t.getOtherMember().setClientSupport(e.data.client_support);
                        var r = (l = MediaCallUI.getMediaCallWrapper(s)).find('[mediacallbuttons][purpose="shareOptions"]'),
                            o = r.length > 0;
                        o && !MediaCall.isWhiteBoardAllowed(t) ? (Clickoutside.clear(s + "shrdropdowncnt"), r.remove()) : !o && MediaCall.isWhiteBoardAllowed(t) && l.find('[mediacallbuttons][purpose="endCall"]').after(MediaCallTemplates.getShareButtonHtml(t))
                    }
                }
            } else {
                var d = MediaCallImpl.getHandingOffSession();
                if (d && d.getId() === e.data.call_id && (MediaCallImpl.setAVStateForHandOff(d, n[a]), e.data.caller_client_type && e.data.callee_client_type && (i = d.isCaller(d.getCurrentMemberId()) ? e.data.callee_client_type : e.data.caller_client_type, d.getOtherMember().setClientType(i)), e.data.start_time && d.setStartTime(e.data.start_time), e.data.ppt)) {
                    var c = new Presentation(e.data.ppt);
                    d.setPresentation(c)
                }
            }
        }
    },
    deviceEvents: {
        handleDeviceChange: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            if (a) {
                var i = [],
                    n = [],
                    s = void 0,
                    l = void 0,
                    r = a.getCurrentMember().getAVUpStream(),
                    o = MediaCallUI.getVideoContainer(a.getId(), a.getOtherMemberId());
                MediaCallUI.updateAudioDevicesInSessionPreview(a), a.writeToLog(CallLogConstants.ui.changedDevice, {
                    addedDevices: e,
                    removedDevices: t
                }), r && r._hasAudioTrack() && (s = r._getAudioDeviceId()), o && (l = o.find("video")[0].sinkId);
                for (var d = 0; d < e.length; d++) {
                    var c = e[d];
                    ZCMediaDevices.isAudioInputDeviceKind(c.kind) ? s && !ZCMediaDevices.isDefaultDeviceId(s) && s !== c.deviceId && i.push(c) : ZCMediaDevices.isAudioOutputDeviceKind(c.kind) && l && !ZCMediaDevices.isDefaultDeviceId(l) && l !== c.deviceId && n.push(c)
                }
                $WC.$Win.destroy("device_switched_info");
                e = {};
                i.length && (e[ZCMediaDevices.kinds.AUDIO_INPUT] = i[0]), n.length && (e[ZCMediaDevices.kinds.AUDIO_OUTPUT] = n[0]), $WC.Util.isEmptyObject(e) || (ZCMediaDevices.setPreferredDevices(e, !1), MediaCallImpl.handleAudioDeviceAdded(a, e))
            }
        }
    },
    ImageLoadEvents: {
        onError: function(e, t) {
            var a = ZCJQuery(e),
                i = MediaCallImpl.getCurrentSession();
            if ("function" == typeof MediaCall.BRIDGE.UI.getDefaultImageForUser) {
                var n = i ? i.isCaller(t) ? i.getCaller().getName() : i.getCallee().getName() : void 0;
                a.attr("src", MediaCall.BRIDGE.UI.getDefaultImageForUser(t, n))
            }
        }
    },
    UIEvents: {
        goToStore: function() {
            $WC.$Win.destroy("extension_install_preview"), ScreenShare.Extension.openStore()
        },
        showMiniPlayer: function(e, t) {
            this.minimizeWindow()
        },
        minimizeWindow: function() {
            if (MediaCallImpl.hasCurrentSession()) {
                var e = function() {
                    MediaUtil.isAVLibraryLoadedInCliq() && ZCJQuery("#mediacall_container").css({
                        zIndex: 1001
                    });
                    var e = MediaCallImpl.getCurrentSession();
                    e.writeToLog(CallLogConstants.ui.minCall);
                    var t = MediaCallUI.getMediaCallWrapper(e.getId());
                    ZCJQuery('[mediacallbuttons][purpose="closeChatInRHS"]').attr({
                        purpose: "openChatInRHS",
                        "av-tooltip-title": MediaUtil.getResource("common.chat")
                    }).removeClass("AV-call-active"), "function" == typeof MediaCall.BRIDGE.handleDarkMode && MediaCall.BRIDGE.handleDarkMode(!1), t.removeClass("AV-call-fullscrn show-aside"), MediaCallUI.adjustCallContainerHeight(t), e.hasChatId() && (MediaCallUI.toggleChatHeaderOptions(e.getChatId(), !1), MediaCallImpl.removeChat(e.getChatId())), MediaCallUI.adjustMainVideoSectionSize(t, !1), t.find(".AV-call-mainview-2").removeClass("AV-call-mainview-2").addClass("AV-call-subview"), MediaCallUI.setCallUIInBody(t), MediaCallUI.resetFullScreenVideosDraggable(e.getId()), "undefined" != typeof PresentationUI && (PresentationUI.handleMinimize(), PresentationUI.handleResize())
                };
                ZCMediaDomUtil.exitFullScreen(e, e)
            }
        },
        maximizeWindow: function() {
            if (MediaCallImpl.hasCurrentSession()) {
                var e = function() {
                    var e = MediaCallImpl.getCurrentSession();
                    if (!e.isInPIP()) {
                        e.writeToLog(CallLogConstants.ui.maxCall);
                        var t = MediaCallUI.getMediaCallWrapper(e.getId());
                        t.addClass("AV-call-fullscrn"), MediaCall.isNetworkIndicatorEnabled() && t.addClass("AV-health-meter"), MediaCallUI.adjustCallContainerHeight(t), MediaCallUI.unsetDraggableOnMaximize(), "function" == typeof MediaCall.BRIDGE.handleDarkMode && MediaCall.BRIDGE.handleDarkMode(!0), e.getOtherMember().isSharingScreen() || e.hasWhiteBoard() || e.hasPresentation() || t.find(".AV-call-subview").removeClass("AV-call-subview").addClass("AV-call-mainview-2"), MediaCallUI.adjustMainVideoSectionSize(t, !0), MediaCallUI.makeFullScreenVideosDraggable(e.getId()), "undefined" != typeof PresentationUI && (PresentationUI.handleMaximize(), PresentationUI.handleResize())
                    }
                };
                if (MediaUtil.isAVLibraryLoadedInCliq()) {
                    let t = () => {
                            ZCJQuery("#mediacall_container").css({
                                zIndex: 1e3
                            }), e()
                        },
                        a = $WC.$Win.current;
                    if (!$WC.Util.isEmpty(a)) return void(MinimizedWindows.canWindowBeMinimised(a) ? MinimizedWindows.handleWindowMinimise(a, t) : ($WC.$Win.destroy(a), t()));
                    if ("undefined" != typeof ImgViewer && ImgViewer.isVisible()) return void MinimizedWindows.handleWindowMinimise("imgviewer", t);
                    if ("undefined" != typeof ZAnnotator && ZAnnotator.isOpen()) return void ZAnnotator.close(t);
                    t()
                } else e()
            }
        },
        switchView: function(e, t) {
            var a = "";
            if (t.hasClass("AV-call-subview")) a = "AV-call-subview";
            else {
                if (!t.hasClass("AV-call-subview-2")) return;
                a = "AV-call-subview-2"
            }
            var i = t.parents("[callId]").attr("callId"),
                n = MediaCallImpl.getCurrentSession();
            if (n && n.getId() === i) {
                var s = MediaCallUI.getMediaCallWrapper(i);
                MediaCallUI.handleViewSwitch(s, t, a), MediaCallUI.adjustCallContainerHeight(s)
            }
        },
        openChatInRHS: function(e, t) {
            this.toggleChat(e, t)
        },
        closeChatInRHS: function(e, t) {
            this.toggleChat(e, t)
        },
        openInFullScreen: function(e, t) {
            ZCMediaDomUtil.openFullScreen(ZCJQuery(t.attr("targetElemSelector"))[0], (function() {
                MediaCallUI.handleOpenFullScreen(t)
            }), (function(e, a) {
                a ? MediaCallUI.handleOpenFullScreen(t) : MediaCallUI.handleExitFullScreen(t)
            }))
        },
        exitFromFullScreen: function(e, t) {
            ZCMediaDomUtil.exitFullScreen()
        },
        openInPIP: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            a && (Clickoutside.handleClickOnChild(e), MediaCallImpl.switchToPIPMode(a))
        },
        exitPIP: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            a && (Clickoutside.handleClickOnChild(e), MediaCallImpl.exitFromPIPMode(a))
        },
        takeNotes: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            NotebookIntegration.openForMediaCall(a.getId(), (function() {
                NotebookIntegration.setDefaultNoteTitle(a.getOtherMember().getName()), NoteBookLHS.trackAction("OPEN_NOTE", "CALL")
            })), Clickoutside.handleClickOnChild(e)
        },
        stopCallRecording: function(e, t) {
            var a = t.parents("[callId]").attr("callId");
            Clickoutside.handleClickOnChild(e), MediaCallImpl.stopCallRecording(a)
        },
        startCallRecording: function(e, t) {
            if (!t.attr("disabled")) {
                var a = t.parents("[callId]").attr("callId");
                Clickoutside.handleClickOnChild(e), MediaCallImpl.startCallRecording(a)
            }
        },
        handleStopRecordingForAdhocCall: function(e, t) {
            MediaCallImpl.handleRecordingAction(MediaCallConstants.recordingAction.STOP_RECORDING)
        },
        handleStopAndStartRecordingForAdhocCall: function(e, t) {
            MediaCallImpl.handleRecordingAction(MediaCallConstants.recordingAction.STOP_AND_START_RECORDING)
        },
        addParticipantsToCall: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            a && a.getId() === t.parents("[callId]").attr("callId") && !t.attr("disabled") && (Clickoutside.handleClickOnChild(e), MediaCallImpl.createAddParticipantWin(a))
        },
        openChat: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            i.getId() === a && (Clickoutside.handleClickOnChild(e), "function" == typeof MediaCall.BRIDGE.handleChatOpen && MediaCall.BRIDGE.handleChatOpen(i.getChatId(), i.getOtherMemberId()))
        },
        toggleChat: function(e, t) {
            if (MediaCallImpl.hasCurrentSession()) {
                var a = t.parents("[callId]").attr("callId");
                MediaCallImpl.getCurrentSession().getId() === a && (Clickoutside.handleClickOnChild(e), void 0 === MediaCall.BRIDGE || void 0 !== MediaCall.BRIDGE.handleChatInRhs && MediaCall.BRIDGE.handleChatInRhs(a))
            }
        },
        turnOnMicrophone: function(e, t) {
            MediaCallImpl.handleUnmute(t.parents("[callId]").attr("callId"), ZCMediaConstants.muteCases.button)
        },
        turnOffMicrophone: function(e, t) {
            MediaCallImpl.handleMute(t.parents("[callId]").attr("callId"), ZCMediaConstants.muteCases.button)
        },
        turnOnCamera: function(e, t) {
            MediaCallImpl.handleVideoUnMute(t.parents("[callId]").attr("callId"), ZCMediaConstants.muteCases.button)
        },
        turnOffCamera: function(e, t) {
            MediaCallImpl.handleVideoMute(t.parents("[callId]").attr("callId"), ZCMediaConstants.muteCases.button)
        },
        playDummySoundInPreviewPage: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            i && i.getId() === a && MediaUtil.playDummySoundForSession(i, t)
        },
        stopDummySoundInPreviewPage: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            i && i.getId() === a && MediaUtil.stopDummySoundForSession(i, t)
        },
        answerCall: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = t.attr("answertype");
            MediaCallUI.answerCall(a, i)
        },
        handOffCall: function(e, t) {
            var a = t.attr("session_id"),
                i = MediaCallImpl.getHandoffCallDetails(),
                n = i.type,
                s = i.caller_id,
                l = i.callee_id,
                r = MediaCallImpl.getCurrentSession();
            if (!r || r.getId() !== a) {
                var o = i.associated_conference_id,
                    d = void 0 !== o;
                if (MediaCallImpl.isAVLoadedInIntegratedUI() && !d) return void AVISCUtilBridge.handoffCall({
                    callId: a,
                    callType: n,
                    callerId: s,
                    calleeId: l
                }, () => {
                    $WC.$Win.destroy("transfer_direct_call")
                });
                d ? MediaCallImpl.checkAndHandoffMigratedMediaSession(a, o, i) : MediaCallImpl.checkAndHandoffMediaSession(a, n, s, l)
            }
        },
        closeRejectMsgBox: function(e, t) {
            MediaCallUI.removeEndCallUI(t.parents("[callId]").attr("callId"))
        },
        endCall: function(e, t) {
            var a = t.parents("[callId]").attr("callId");
            MediaCallUI.removeRejectMessageDialog(a);
            var i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === a) "undefined" != typeof RemoteWork && RemoteWork.isInRemoteWorkView() && RemoteWork.syncDetailsUI(), i.writeToLog(CallLogConstants.ui.end);
            else {
                var n = MediaCallImpl.getFromIncomingSessions(a);
                void 0 !== n && n.writeToLog(CallLogConstants.ui.end)
            }
            MediaCallImpl.handleEnd(a, !0)
        },
        showDeclineReasons: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getFromIncomingSessions(a);
            if (i && i.isInInitialState()) {
                MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.INCOMING);
                var n = MediaCallUI.getMediaCallWrapper(a);
                n.find("[impulsecontainer]").addClass("zc-av-dN");
                var s = MediaCallTemplates.getRejectMessageDialogHtml(i);
                n.append(s)
            }
        },
        sendCustomRejectMessage: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallUI.getMediaCallWrapper(a),
                n = i.find('[inputname="rejectTextBox"]').val().trim();
            MediaCallImpl.handleRejectMessage(a, n, !0), i.find('[inputname="rejectTextBox"]').val("")
        },
        sendDefaultRejectMessage: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = (MediaCallUI.getMediaCallWrapper(a), t.text());
            MediaCallImpl.handleRejectMessage(a, i, !1)
        },
        handleRejectMessageInput: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallUI.getMediaCallWrapper(a),
                n = i.find('[purpose = "sendCustomRejectMessage"]');
            i.find('[inputname="rejectTextBox"]').val().trim().length > 0 ? n.removeAttr("disabled") : n.attr("disabled", "")
        },
        shareOptions: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === a) {
                if (t.children().length > 0) return void MediaCallUI.removeShareOptionsDropDown(a);
                var n = MediaCallTemplates.getShareOptionsHtml(i);
                t.addClass("AV-call-active").removeAttr("av-tooltip-title").html(n);
                var s = a + "shrdropdowncnt";
                MediaCallUI.setContainerPositionClass(ZCJQuery("#" + s)), Clickoutside.bind({
                    event: e,
                    srcid: t.attr("id"),
                    destid: s,
                    doNotClose: function(e, t, a, i, n) {
                        return a && ZCJQuery(a.currentTarget).attr("id") === e.srcid
                    },
                    customHide: function(e) {
                        MediaCallUI.removeShareOptionsDropDown(a)
                    }
                })
            }
        },
        startPresentation: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === a) {
                if (i.getCurrentMember().isSharingScreen() || i.getOtherMember().isSharingScreen()) {
                    var n = i.getCurrentMember().isSharingScreen() ? "screenshare.stop.to.share.presentation" : "whiteboard.remote.screen.share.end";
                    return void UI.updateBanner(Resource.getRealValue(n), 2e3, !0)
                }
                if (i.hasWhiteBoard()) return void UI.updateBanner(Resource.getRealValue("whiteboard.stop.to.share.presentation"), 2e3, !0);
                if (i.hasPresentation()) {
                    var s = i.getWhiteBoardCreator();
                    return void UI.updateBanner(Resource.getRealValue("whiteboard.in.conference.limit", Users.getName(s.getId(), s.getName())), 2e3, !0)
                }
                Clickoutside.handleClickOnChild(e), $ZCUtil.loadMultipleFiles("script", MediaUtil.BRIDGE.ServerConstants.WORKDRIVE_JS_LIST, (function() {
                    WorkDriveFilePicker.showCallPresentationFilePicker(a, i.getOnetoOneCallTitle(), !i.isInPIP() && !MediaCallUI.isInMinimizedView())
                }))
            }
        },
        stopPresentation: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            i && i.getId() === a && (Clickoutside.handleClickOnChild(e), i.getPresentation().stop(i))
        },
        startWhiteBoard: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === a) {
                if (i.getCurrentMember().isSharingScreen() || i.getOtherMember().isSharingScreen()) {
                    var n = i.getCurrentMember().isSharingScreen() ? "whiteboard.local.screen.share.end" : "whiteboard.remote.screen.share.end";
                    return void UI.updateBanner(Resource.getRealValue(n), 2e3, !0)
                }
                if (i.hasPresentation()) return void UI.updateBanner(Resource.getRealValue("presentation.stop.to.share.screen"), 2e3, !0);
                if (t.children().length > 0 && MediaCallUI.removeMoreOptionsDropDown(a), Clickoutside.handleClickOnChild(e), i.hasWhiteBoard()) {
                    var s = i.getWhiteBoardCreator();
                    return void UI.updateBanner(Resource.getRealValue("whiteboard.in.conference.limit", Users.getName(s.getId(), s.getName())), 2e3, !0)
                }
                MediaCallUI.addAndGetWhiteBoardContainer(i._id, i);
                var l = {
                    title: "Whiteboard",
                    associate_id: a,
                    associate_type: "direct_call"
                };
                WhiteBoard.createAndShowWhiteBoard(l)
            }
        },
        stopWhiteBoard: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === a) {
                if (t.children().length > 0 && MediaCallUI.removeMoreOptionsDropDown(a), Clickoutside.handleClickOnChild(e), !i.hasWhiteboardStopPermission()) return;
                WhiteBoard.closeWhiteBoard(a, "direct_call", i.getCurrentWhiteBoardId())
            }
        },
        showMoreOptions: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === a) {
                if (t.children().length > 0) return void MediaCallUI.removeMoreOptionsDropDown(a);
                var n = MediaCallTemplates.getMoreOptionsHtml(i);
                t.addClass("AV-call-active").removeAttr("av-tooltip-title").html(n);
                var s = a + "dropdowncnt";
                MediaCallUI.setContainerPositionClass(ZCJQuery("#" + s)), Clickoutside.bind({
                    event: e,
                    srcid: t.attr("id"),
                    destid: s,
                    doNotClose: function(e, t, a, i, n) {
                        return a && ZCJQuery(a.currentTarget).attr("id") === e.srcid
                    },
                    customHide: function(e) {
                        MediaCallUI.removeMoreOptionsDropDown(a)
                    }
                })
            }
        },
        startScreenShare: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            a.writeToLog(CallLogConstants.ui.screen);
            var i = a.isInPIP();
            if (!a.getCurrentMember().isSharingScreen())
                if (a.hasWhiteBoard()) UI.updateBanner(Resource.getRealValue("whiteboard.stop.to.share.screen"), 2e3, !0);
                else if (a.hasPresentation()) UI.updateBanner(Resource.getRealValue("presentation.stop.to.share.screen"), 2e3, !0);
            else if (Clickoutside.handleClickOnChild(e), !MediaCall.BRIDGE.Util.Browser.isChrome() || WebRTCUserMedia.isScreenShareSupportedInNative() || ScreenShare.Extension.isInstalled())
                if (a.isMigratedForRecording()) AdhocCallBridge.publish(a, "startScreenShare", {
                    associatedSessionId: a.getAssociatedConferenceId()
                });
                else {
                    a.writeToLog(CallLogConstants.streamRequest.screen.initDuringCall), MediaCallImpl.isCurrentModeVideoCall(a) && MediaCallImpl.switchToPIPMode(a), WebRTCUserMedia.requestScreenStream((function(e) {
                        var t = MediaCallImpl.getCurrentSession();
                        if (t) {
                            MediaCall.BRIDGE && MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleScreenShareStart && MediaCall.BRIDGE.listener.handleScreenShareStart(), t.writeToLog(CallLogConstants.streamRequest.screen.success), e._getPrimaryVideoTrack().applyConstraints({
                                frameRate: {
                                    min: 15,
                                    max: 15
                                }
                            }).catch();
                            var a = t.getCurrentMember();
                            a.isMultiStreamSupported() && t.getOtherMember().isMultiStreamSupported() ? (a.addScreenInConnection(e), t.setAsScreenShared()) : a.replaceVideoWithScreenInNewConnection(e), MediaCallUI.handleScreenShareStart()
                        } else WebRTCUserMedia.closeStream(e._getType())
                    }), (function(e, t) {
                        i || MediaCallImpl.exitFromPIPMode(MediaCallImpl.getCurrentSession()), void 0 !== e && MediaManager.handleMediaError(e, t)
                    }), (function() {
                        a.writeToLog(CallLogConstants.streamRequest.screen.stopped), MediaCallHandler.UIEvents.stopScreenShare()
                    }), MediaManager.getComputerAudioConstraints(), void 0, void 0, !0)
                }
            else MediaManager.showExtensionInstallPreview("mediacallbuttons")
        },
        stopScreenShare: function(e, t) {
            if (MediaCallImpl.hasCurrentSession()) {
                var a = MediaCallImpl.getCurrentSession();
                if (a.writeToLog(CallLogConstants.ui.stopScreen), e && Clickoutside.handleClickOnChild(e), a.isMigratedForRecording()) AdhocCallBridge.publish(a, "stopScreenShare", {
                    associatedSessionId: a.getAssociatedConferenceId()
                });
                else MediaCall.BRIDGE && MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleScreenShareEnd && MediaCall.BRIDGE.listener.handleScreenShareEnd(), MediaCallImpl.getCurrentSession().getCurrentMember().removeScreenFromConnection(), MediaCallUI.resetScreenShareOption()
            }
        },
        stopScreenShareFromBottomBand: function(e, t) {
            MediaCallHandler.UIEvents.stopScreenShare(e, t)
        },
        closeScreenShareIndicator: function(e, t) {
            var a = ZCJQuery("#mediacall_container").find("[mediacallwrapper]");
            a.removeClass("AV-call-scrnshare-ind"), a.find("[screen_share_indicator_v2]").addClass("zc-av-hide")
        },
        switchToVideo: function(e, t) {
            MediaCallImpl.hasCurrentSession() && MediaCallImpl.switchToVideo(t.parents("[callId]").attr("callId"), e)
        },
        closeEndCall: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = void 0;
            if (ZCMediaRecorderImpl.hasCurrentRecordingSession()) i = ZCMediaRecorderImpl.getCurrentRecordingSession();
            else {
                if (!ZCMediaRecorderImpl.hasRecordedSession(a)) return void MediaCallUI.removeEndCallUI(a);
                i = ZCMediaRecorderImpl.getRecordedSession(a)
            }
            ZCMediaRecorderHandler.mediaCallUIEvents.stopMediaRecording(a), ZCMediaRecorderImpl.showCancelRecordingDialogForMediaCall(function() {
                ZCMediaRecorderImpl.handleEnd(a)
            }.bind(this), i)
        },
        callAgain: function(e, t) {
            var a = t.parents("[callId]"),
                i = a.attr("callId"),
                n = a.attr("calltype"),
                s = a.attr("calleeid");
            MediaCallUI.removeEndCallUI(i), MediaCall.initiateStartCallProcess(n, s, void 0, ZCMediaConstants.triggerSource.NO_RESPONSE_OPTIONS)
        },
        startMediaRecording: function(e, t) {
            ZCMediaRecorderHandler.mediaCallUIEvents.startMediaRecording(t.parents("[callId]"))
        },
        stopMediaRecording: function(e, t) {
            ZCMediaRecorderHandler.mediaCallUIEvents.stopMediaRecording(t.parents("[callId]").attr("callId"))
        },
        playRecording: function(e, t) {
            ZCMediaRecorderHandler.mediaCallUIEvents.playRecording(t.parents("[callId]").attr("callId"))
        },
        pauseRecording: function(e, t) {
            ZCMediaRecorderHandler.mediaCallUIEvents.pauseRecording(t.parents("[callId]").attr("callId"))
        },
        sendRecording: function(e, t) {
            ZCMediaRecorderHandler.mediaCallUIEvents.sendRecording(t)
        },
        declineSwitchToVideo: function(e, t) {
            if (MediaCallImpl.hasCurrentSession()) {
                var a = t.parents("[callId]").attr("callId"),
                    i = MediaCallImpl.getCurrentSession();
                i.writeToLog(CallLogConstants.ui.videoSwitchDecline), i.getId() === a && MediaCallUI.removeSwitchToVideoInfo(i)
            }
        },
        setMediaDevices: function(e, t) {
            MediaCallImpl.showMediaDeviceSettings(t.parents("[callId]").attr("callId"))
        },
        openSettings: function(e, t) {
            var a = t.parents("[callId]").attr("callId"),
                i = MediaCallImpl.getCurrentSession();
            Clickoutside.handleClickOnChild(e), i.getId() === a && ZCDirectCallDialogs.createSettingsWin(i)
        },
        switchToConnectionStatsTab: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            if (!a.isConnectionStatsTabOpened()) {
                MediaCallUI.clearActionsOnSettingsTabSwitch(a);
                var i = ZCJQuery("#av-settings-lhs");
                i.find("[settingstab]").removeClass("active"), i.find("#av-network-stats-lhs").addClass("active");
                var n = MediaCallImpl.isCurrentModeVideoCall(a),
                    s = a.getCurrentMember().isSharingScreen() || a.getOtherMember().isSharingScreen();
                ZCJQuery("#av_settings_body").html(MediaTemplates.getConnectionStatsTabHtml(n, s)), a.handleConnectionStatsTabOpen()
            }
        },
        switchToVideoEffects: function(e, t) {
            var a = ZCJQuery("#av-settings-lhs");
            a.find("[settingstab]").removeClass("active"), a.find("#av-video-effects-lhs").addClass("active");
            var i = MediaCallImpl.getCurrentSession();
            MediaCallUI.clearActionsOnSettingsTabSwitch(i);
            var n = ZCJQuery("#av_settings_body");
            n.html(MediaCallTemplates.getVideoEffectsPanel(i));
            MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.VIDEO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL), WebRTCUserMedia.requestNewStreamInstance(WebRTCUserMedia.streamInstanceIds.video_effects_preview, WebRTCUserMedia.streamTypes.VIDEO_ONLY, (function(e) {
                MediaManager.resetStreamRequested();
                var t = n.find("#video_effect_preview_dom");
                t.length ? (MediaUtil.setAndPlayStreamInMediaContainer(t, e, !0), i.setVideoEffectsPreviewStream(e)) : WebRTCUserMedia.closeStreamInstance(WebRTCUserMedia.streamInstanceIds.video_effects_preview, e._getType())
            }), (function(e) {
                MediaManager.resetStreamRequested();
                var t = n.find("#video_effect_preview_dom");
                t.find("[loader]").addClass("hide"), t.find("[user_image]").removeClass("dN")
            }), void 0, MediaUtil.getVideoProcessingOptions(i))
        },
        selectVideoBackground: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            if (!a.isRequestPending(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect)) {
                var i = ZCJQuery("#av_video_effects_panel");
                i.find("[background_list] [list_item]").removeClass("zc-av-video-effects-list-item-active"), t.addClass("zc-av-video-effects-list-item-active");
                var n = a.getSelectedVideoBackground(),
                    s = a.getSelectedVideoFilter(),
                    l = t.attr("value"),
                    r = a.getVideoEffectsPreviewStream();
                if (r) {
                    var o = ZCJQuery("#av_settings_body").find("#video_effect_preview_dom"),
                        d = o.find("[loader]");
                    d.removeClass("hide");
                    var c = t.find("[loader]");
                    c.removeClass("dN"), a.setRequestAsPending(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect), MLBackgroundProcessor.applyVideoBackground(r, l, (function(e) {
                        d.addClass("hide"), c.addClass("dN"), a.setRequestAsCompleted(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect), e && (MediaUtil.setAndPlayStreamInMediaContainer(o, e, !0), a.setVideoEffectsPreviewStream(e))
                    }))
                }
                var C = l;
                (MLBackgroundProcessor.backgroundTypes.hasNoBackground(l) || MLBackgroundProcessor.backgroundTypes.isBlur(l)) && (C = MLBackgroundProcessor.backgroundTypes.images[0]);
                var u = i.find("[filters_list] [list_item]");
                u.find("img").attr("src", MLBackgroundProcessor.backgroundTypes.getThumbNailUrl(C));
                var p = u.filter(".zc-av-video-effects-list-item-active").attr("value");
                ZCJQuery("#av_settings_body").toggleClass("avcliq-effect-edited", n !== l || s !== p)
            }
        },
        selectVideoFilter: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            if (!a.isRequestPending(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect)) {
                var i = ZCJQuery("#av_video_effects_panel");
                i.find("[filters_list] [list_item]").removeClass("zc-av-video-effects-list-item-active"), t.addClass("zc-av-video-effects-list-item-active");
                var n = a.getSelectedVideoBackground(),
                    s = a.getSelectedVideoFilter(),
                    l = i.find("[background_list] [list_item].zc-av-video-effects-list-item-active").attr("value"),
                    r = t.attr("value"),
                    o = a.getVideoEffectsPreviewStream();
                if (o) {
                    var d = ZCJQuery("#av_settings_body").find("#video_effect_preview_dom"),
                        c = d.find("[loader]");
                    c.removeClass("hide");
                    var C = t.find("[loader]");
                    C.removeClass("dN"), a.setRequestAsPending(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect), MLBackgroundProcessor.applyVideoFilter(o, r, (function(e) {
                        c.addClass("hide"), C.addClass("dN"), a.setRequestAsCompleted(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect), e && (MediaUtil.setAndPlayStreamInMediaContainer(d, e, !0), a.setVideoEffectsPreviewStream(e))
                    }))
                }
                ZCJQuery("#av_settings_body").toggleClass("avcliq-effect-edited", n !== l || s !== r)
            }
        },
        setVideoEffects: function(e, t) {
            var a = ZCJQuery("#av_video_effects_panel"),
                i = a.find("[background_list] [list_item].zc-av-video-effects-list-item-active").attr("value"),
                n = a.find("[filters_list] [list_item].zc-av-video-effects-list-item-active").attr("value"),
                s = MediaCallImpl.getCurrentSession();
            s.applyVideoEffects(i, n), AdhocCallBridge.publish(s, "applyVideoEffects", {
                associatedSessionId: s.getAssociatedConferenceId(),
                bgValue: i,
                filterValue: n
            }), MediaCallUI.removeCallSettings()
        },
        closeVideoEffectsPanel: function(e, t) {
            MediaCallUI.removeCallSettings()
        },
        closeTrackEndedInfo: function() {
            $WC.$Win.destroy("track_ended_info")
        },
        showDeviceSettings: function() {
            var e = MediaCallImpl.getCurrentSession();
            MediaCallHandler.UIEvents.closeTrackEndedInfo(), ZCDirectCallDialogs.isSettingsWinExist() ? MediaCallImpl.showMediaDeviceSettings(e.getId()) : ZCDirectCallDialogs.createSettingsWin(e)
        },
        handleAdhocCallInputs: function() {
            var e = ZCJQuery("#addparticipantstocallwin"),
                t = e.find('[inputname="adhoccalltitle"]'),
                a = MediaUtil.isValidTitle(t.val()),
                i = MediaCallImpl.userSuggestion.getSelectedListValues().length >= MediaCallImpl.userSuggestion.minLimitForAdhocCall && a;
            t.toggleClass("inpt-error", !a), e.find("[mediacallbuttons][purpose=ringAllParticipants]").attr("disabled", !i)
        },
        closeAddParticipantWin: function(e, t) {
            $WC.$Win.destroy("addparticipantstocallwin"), MediaUtil.isAVLibraryLoadedInChatbar() && MediaCall.BRIDGE.UI.closeAddParticipantWin()
        },
        ringAllParticipants: function(e, t) {
            if (MediaCallImpl.hasCurrentSession()) {
                var a = ZCJQuery("#addparticipantstocallwin"),
                    i = a.find("[mediacallbuttons][purpose=ringAllParticipants]"),
                    n = a.find('[inputname="adhoccalltitle"]'),
                    s = n.val();
                if (MediaUtil.isValidTitle(s)) {
                    var l = MediaCallImpl.getCurrentSession(),
                        r = l.getCallTypeForAdhocCall(),
                        o = MediaCallImpl.userSuggestion.getSelectedListValues();
                    l.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), $Util.Button.addLoadIconForAjax(i), $WC.Util.removeElementFromArray(o, MediaCall.BRIDGE.Constants.ZUID), MediaCallImpl.addUsersToCall(s, r, o, (function() {
                        MediaCallHandler.UIEvents.closeAddParticipantWin(), $Util.Button.showCompletionAndResetContent(i, !1)
                    }), (function() {
                        $Util.Button.showCompletionAndResetContent(i, !0), UI.updateBanner(Resource.getRealValue("apierror.message"), 2e3, !0)
                    }))
                } else n.addClass("inpt-error")
            } else MediaCallHandler.UIEvents.closeAddParticipantWin()
        }
    },
    UIToggleEvents: {
        toggleRememberVideoEffects: function(e, t) {
            var a = MediaCallImpl.getCurrentSession(),
                i = t.is(":checked");
            a.setRememberVideoEffectsStatus(i)
        },
        toggleAudioInPreviewPage: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            a && (t.is(":checked") ? MediaCallImpl.handleUnmute(a.getId(), ZCMediaConstants.muteCases.settingsToggle) : MediaCallImpl.handleMute(a.getId(), ZCMediaConstants.muteCases.settingsToggle))
        },
        toggleVideoInPreviewPage: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            a && (t.is(":checked") ? MediaCallImpl.handleVideoUnMute(a.getId(), ZCMediaConstants.muteCases.settingsToggle) : MediaCallImpl.handleVideoMute(a.getId(), ZCMediaConstants.muteCases.settingsToggle))
        },
        toggleVideoRotateConfig: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            if (a) {
                var i = t.is(":checked"),
                    n = i ? 1 : 0,
                    s = MediaCallUI.getVideoContainer(a.getId(), a.getCurrentMemberId()),
                    l = ZCJQuery("#av_settings_preview, #video_effect_preview_dom");
                MediaCall.BRIDGE.Settings.update({
                    huddle_mirror_video: n
                }), MediaUtil.changeVideoOrientation(l, i), MediaUtil.changeVideoOrientation(s, i)
            }
        }
    },
    PIPEvents: {
        onChange: function(e, t) {
            var a = MediaCallImpl.getCurrentSession();
            a && !t && (Clickoutside.handleClickOnChild(e), MediaCallImpl.exitFromPIPMode(a))
        },
        onHangup: function() {
            var e = MediaCallImpl.getCurrentSession();
            e && MediaCallImpl.handleEnd(e.getId(), !0)
        },
        onCamToggle: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t) {
                var a = t.getId();
                if (e) t.isAudioCall() && !t.getCurrentMember().hasSwitchedToVideo() ? MediaCallImpl.switchToVideo(a) : MediaCallImpl.handleVideoUnMute(a, ZCMediaConstants.muteCases.pip);
                else MediaCallImpl.handleVideoMute(a, ZCMediaConstants.muteCases.pip)
            }
        },
        onMicToggle: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            t && (e ? MediaCallImpl.handleUnmute(t.getId(), ZCMediaConstants.muteCases.pip) : MediaCallImpl.handleMute(t.getId(), ZCMediaConstants.muteCases.pip))
        },
        isVideoMuted: function() {
            var e = MediaCallImpl.getCurrentSession();
            if (e) return e.getCurrentMember().isVideoMuted() || e.isAudioCall() && !e.getCurrentMember().hasSwitchedToVideo()
        },
        isAudioMuted: function() {
            var e = MediaCallImpl.getCurrentSession();
            if (e) return e.getCurrentMember().isAudioMuted()
        }
    }
};
var MediaCallSession = function(e) {
    this._id = e.call_id, this._type = e.type, this._chatId = e.chat_id, this._startTime = e.start_time, this._attendedTime = -1, this._status = e.status, this._statusText = e.status_text, this._callerId = e.caller_id, this._calleeId = e.callee_id, this._callerName = "undefined" != typeof MediaCall && void 0 !== MediaCall.BRIDGE ? MediaCall.BRIDGE.Users.getName(this._callerId, e.caller_name) : "undefined" != typeof Users && "function" == typeof Users.getName ? Users.getName(this._callerId, e.caller_name) : "", this._calleeName = "undefined" != typeof MediaCall && void 0 !== MediaCall.BRIDGE ? MediaCall.BRIDGE.Users.getName(this._calleeId, e.callee_name) : "undefined" != typeof Users && "function" == typeof Users.getName ? Users.getName(this._calleeId, e.callee_name) : "", void 0 === e.credentials && (e.credentials = {}), this._members = {}, this._members[this._callerId] = new MediaCallMember(this._callerId, this._callerName, this._id, e.credentials[this._callerId]), this._members[this._calleeId] = new MediaCallMember(this._calleeId, this._calleeName, this._id, e.credentials[this._calleeId]), this.isVideoCall() ? (this._members[this._callerId].setAsSwitchedToVideo(), this._members[this._calleeId].setAsSwitchedToVideo()) : (this.isScreenShare() || this.isScreenShareWithAudioCall()) && (this._members[this._callerId].setAsSharingScreen(), this.setAsScreenShared()), this._answerCallNotified = !1, this._connectedStateNotified = !1, this._callReceivedAckTimeOut = void 0, this._callRingingTimeOut = void 0, this._incomingCallTimeOut = void 0, this._activeCallUpdateInterval = void 0, this._reconnectionPolicy = e.reconnection_policy || {
        event: "disconnected",
        interval: "2000",
        connection_timeout: "5000"
    }, this._associatedLiveFeedId = void 0, this._logString = "", this._callStrengthAnalyser = void 0, this._networkPredictor = void 0, this._longPollingController = void 0, this._pollingEvents = [], this._previewAudioContainer = void 0, this._iceConnectionStates = {}, this._iceGatheringStates = {}, this._candidateTypeVsTime = {}, this._isPushToTalkEnabled = !1, this._isInFullScreen = !1, this._isPoorNetworkTracked = !1, this._hasAnalysedAudioLoss = !1, this._associatedConferenceId = void 0, this._multipleCallsHandlingType = void 0, this._isInitialConnection = !0, this._isMigratedCall = !1, this._isMigratedForRecording = !1, this._callConversionDetails = {}, this._isHandOffCompleted = !1, this._hasInitialAudioLoss = !1, this._isCallAnswered = !1, this._hadScreenShare = !1, this._audioTrackEndedInfo = {}, this._eventsVsTimestamp = {}, this._whiteBoard = {
        currentBoard: void 0,
        boards: {}
    }, this._presentation = void 0, this._onetooneCallTitleMaxLength = 96, this._pendingRequests = {}, this._videoEffectsPreviewStream = void 0, this._isConnectionStatsTabOpened = !1, this._canRememberVideoEffects = !1, this._callMergeEvents = void 0, this._isRedirected = !1, this._pipCanvasElem = void 0, "undefined" != typeof ZCMediaPreferences ? (this._videoEffects = {
        background: ZCMediaPreferences.getPreferredVideoBackground(),
        filter: ZCMediaPreferences.getPreferredVideoFilter()
    }, this._audioProcessingOptions = {
        noiseCancellation: ZCMediaPreferences.isAudioProcessingAllowedByUser()
    }) : (this._videoEffects = {
        background: MLBackgroundProcessor.backgroundTypes.NONE,
        filter: MLBackgroundProcessor.filterTypes.NONE
    }, this._audioProcessingOptions = {
        noiseCancellation: !1
    }), this._connectionStatsLatestData = MediaUtil.getEmptyDataObjOfConnectionStats(), this._statsScoreUpdateInterval = void 0, this._networkStatsTableDom = void 0
};
MediaCallSession.prototype = {
    getId: function() {
        return this._id
    },
    getCallerId: function() {
        return this._callerId
    },
    getCalleeId: function() {
        return this._calleeId
    },
    getCallerName: function() {
        return this._callerName
    },
    getCalleeName: function() {
        return this._calleeName
    },
    getCaller: function() {
        return this.getMembers()[this.getCallerId()]
    },
    getCallee: function() {
        return this.getMembers()[this.getCalleeId()]
    },
    getCurrentMember: function() {
        return this.getMembers()[MediaCall.getCurrentUserId()]
    },
    getCurrentMemberId: function() {
        return this.getCurrentMember().getId()
    },
    getOtherMemberId: function() {
        return this.getOtherMember().getId()
    },
    getOtherMember: function() {
        return this.isCaller(MediaCall.getCurrentUserId()) ? this.getCallee() : this.getCaller()
    },
    getOnetoOneCallTitle: function() {
        var e = this.get121TitleMaxLimit(),
            t = Math.floor(e / 2),
            a = this.getCurrentMember(),
            i = this.getOtherMember();
        return (MediaCall.BRIDGE.Users.getName(a.getId(), a.getName(), -1).substr(0, t) + " & " + MediaCall.BRIDGE.Users.getName(i.getId(), i.getName(), -1).substr(0, t)).trim()
    },
    getMember: function(e) {
        return this.getMembers()[e]
    },
    getMembers: function() {
        return this._members
    },
    getMemberIds: function() {
        return Object.keys(this._members)
    },
    isMember: function(e) {
        return void 0 !== this.getMember(e)
    },
    getType: function() {
        return this._type
    },
    getStartTime: function() {
        return this._startTime
    },
    setStartTime: function(e) {
        this._startTime = e
    },
    isCallAnswered: function() {
        return this._isCallAnswered
    },
    setAsCallAnswered: function() {
        this._isCallAnswered = !0
    },
    hadScreenShare: function() {
        return this._hadScreenShare
    },
    setAsScreenShared: function() {
        this._hadScreenShare = !0
    },
    getStatusText: function() {
        return this._statusText
    },
    getChatId: function() {
        return this._chatId
    },
    isAudioCall: function() {
        return MediaCall.isAudioCall(this._type)
    },
    isVideoCall: function() {
        return MediaCall.isVideoCall(this._type)
    },
    isScreenShareWithAudioCall: function() {
        return MediaCall.isScreenShareWithAudioCall(this._type)
    },
    isScreenShare: function() {
        return MediaCall.isScreenShare(this._type)
    },
    isCaller: function(e) {
        return this._callerId === e
    },
    isCallee: function(e) {
        return this._calleeId === e
    },
    isAnswerCallNotified: function() {
        return this._answerCallNotified
    },
    isConnectedStateNotified: function() {
        return this._connectedStateNotified
    },
    setAsMigratedForRecording: function() {
        return this._isMigratedForRecording = !0
    },
    isMigratedForRecording: function() {
        return this._isMigratedForRecording
    },
    resetMigratedForRecording: function() {
        this._isMigratedForRecording = !1
    },
    setDetailsForCallConversion: function(e) {
        this._callConversionDetails = e
    },
    resetDetailsForCallConversion: function() {
        this._callConversionDetails = {}
    },
    getCallConversionDetails: function() {
        return this._callConversionDetails
    },
    isHandOffCompleted: function() {
        return this._isHandOffCompleted
    },
    isAudioLayoutRequired: function() {
        return this.isAudioCall() || this.isCaller(MediaCall.getCurrentUserId()) && (this.isScreenShareWithAudioCall() || this.isScreenShare())
    },
    isVideoLayoutRequired: function() {
        var e = this.getOtherMember().isSharingScreen() || this.getOtherMember().hasSwitchedToVideo() || this.getCurrentMember().hasSwitchedToVideo();
        return this.isVideoCall() || this.isCallee(MediaCall.getCurrentUserId()) && (this.isScreenShareWithAudioCall() || this.isScreenShare()) || e
    },
    isInCallInitiatedState: function() {
        return MediaCallConstants.isCallInitiated(this.getStatusText())
    },
    isInCallReceivedState: function() {
        return MediaCallConstants.isCallReceived(this.getStatusText())
    },
    isInCallRequestedState: function() {
        return MediaCallConstants.isCallRequested(this.getStatusText())
    },
    isInCallAnsweredState: function() {
        return MediaCallConstants.isCallAnswered(this.getStatusText())
    },
    isInInitialState: function() {
        return this.isInCallInitiatedState() || this.isInCallReceivedState() || this.isInCallRequestedState()
    },
    isInMigratingState: function() {
        return MediaCallConstants.isCallMigrating(this.getStatusText())
    },
    isHandOffInProgress: function() {
        return MediaCallConstants.isCallHandOffInProgress(this.getStatusText())
    },
    isMigratedCall: function() {
        return this._isMigratedCall
    },
    setAssociatedConferenceId: function(e) {
        this._associatedConferenceId = e
    },
    getAssociatedConferenceId: function() {
        return this._associatedConferenceId
    },
    isLiveFeedAssociated: function() {
        return void 0 !== this._associatedLiveFeedId
    },
    isPushToTalkEnabled: function() {
        return this._isPushToTalkEnabled
    },
    setPushToTalkState: function(e) {
        this._isPushToTalkEnabled = e
    },
    getMultipleCallsHandlingType: function() {
        return this._multipleCallsHandlingType
    },
    setMultipleCallsHandlingType: function(e) {
        this._multipleCallsHandlingType = e
    },
    isNoiseCancellationEnabled: function() {
        return this._audioProcessingOptions.noiseCancellation
    },
    setNoiseCancellationAsEnabled: function() {
        this._audioProcessingOptions.noiseCancellation = !0
    },
    setNoiseCancellationAsDisabled: function() {
        this._audioProcessingOptions.noiseCancellation = !1
    },
    isInPIP: function() {
        return this._pipCanvasElem && this._pipCanvasElem.isInPIP()
    },
    getCanvasForPIP: function() {
        return this._pipCanvasElem || (this._pipCanvasElem = document.createElement("canvas")), this._pipCanvasElem
    },
    hasChatId: function() {
        return void 0 !== this._chatId
    },
    setStatusText: function(e) {
        e === MediaCallConstants.statusText.CALL_MIGRATED && (this._isMigratedCall = !0), this._statusText = e
    },
    getAssociatedLiveFeedId: function() {
        return this._associatedLiveFeedId
    },
    getAttendedTime: function() {
        return this._attendedTime
    },
    setChatId: function(e) {
        this._chatId = e
    },
    setAssociatedLiveFeedId: function(e) {
        this._associatedLiveFeedId = e
    },
    setAttendedTime: function(e) {
        this._attendedTime = e
    },
    setConnectedStateAsNotified: function() {
        this._connectedStateNotified = !0
    },
    resetConnectedStateAsNotified: function() {
        this._connectedStateNotified = !1
    },
    setEventTime: function(e, t) {
        this._eventsVsTimestamp[e] = t
    },
    getEventTimeObj: function() {
        return this._eventsVsTimestamp
    },
    isInitialConnection: function() {
        return this._isInitialConnection
    },
    resetInitialConnection: function() {
        this._isInitialConnection = !1
    },
    setAnswerCallAsNotified: function() {
        this._answerCallNotified = !0
    },
    resetAnswerCallAsNotified: function() {
        this._answerCallNotified = !1
    },
    isTrackRenegotiationSupported: function() {
        return this.getCurrentMember().isTrackRenegotiationSupported() && this.getOtherMember().isTrackRenegotiationSupported()
    },
    isPoorNetworkTracked: function() {
        return this._isPoorNetworkTracked
    },
    setPoorNetworkTracked: function() {
        this._isPoorNetworkTracked = !0
    },
    hasAnalysedAudioLoss: function() {
        return this._hasAnalysedAudioLoss
    },
    setAsAudioLossAnalysed: function() {
        this._hasAnalysedAudioLoss = !0
    },
    isUsingLyra: function() {
        return this.getCurrentMember()._connection.isUsingLyra()
    },
    isLyraCodecSupported: function() {
        return this.getCurrentMember().isLyraCodecSupported() && this.getOtherMember().isLyraCodecSupported()
    },
    isAdhocCallingSupported: function() {
        return this.getCurrentMember().isAdhocCallingSupported() && this.getOtherMember().isAdhocCallingSupported()
    },
    isInitialReconnectionSupported: function() {
        return this.getCurrentMember().isInitialReconnectionSupported() && this.getOtherMember().isInitialReconnectionSupported()
    },
    isRecordingSupported: function() {
        return this.getCurrentMember().isRecordingSupported() && this.getOtherMember().isRecordingSupported()
    },
    isWhiteBoardSupported: function() {
        return this.getCurrentMember().isWhiteBoardSupported() && this.getOtherMember().isWhiteBoardSupported()
    },
    isPresentationSupported: function() {
        return this.getCurrentMember().isPresentationSupported() && this.getOtherMember().isPresentationSupported()
    },
    getNetworkPredictor: function() {
        return this._networkPredictor
    },
    getVideoEffectsPreviewStream: function() {
        return this._videoEffectsPreviewStream
    },
    setVideoEffectsPreviewStream: function(e) {
        this._videoEffectsPreviewStream = e
    },
    clearVideoEffectsPreview: function() {
        this._videoEffectsPreviewStream && (WebRTCUserMedia.closeStreamInstance(WebRTCUserMedia.streamInstanceIds.video_effects_preview, this._videoEffectsPreviewStream._getType()), this._videoEffectsPreviewStream = void 0)
    },
    setCandidateGenerationTime: function(e, t) {
        this._candidateTypeVsTime[e] = t
    },
    getCandidateGenerationTime: function() {
        return this._candidateTypeVsTime
    },
    isWindowInFullScreen: function() {
        return this._isInFullScreen
    },
    setWindowInFullScreen: function() {
        this._isInFullScreen = !0
    },
    isRequestPending: function(e) {
        return this._pendingRequests[e]
    },
    setRequestAsPending: function(e) {
        this._pendingRequests[e] = !0
    },
    setRequestAsCompleted: function(e) {
        delete this._pendingRequests[e]
    },
    canRememberVideoEffects: function() {
        return this._canRememberVideoEffects
    },
    setRememberVideoEffectsStatus: function(e) {
        this._canRememberVideoEffects = e
    },
    subscribe: function(e) {
        this._callMergeEvents = e
    },
    unSubscribe: function() {
        this._callMergeEvents = void 0
    },
    hasSubscribed: function() {
        return void 0 !== this._callMergeEvents
    },
    getSubscribedHandler: function() {
        return this._callMergeEvents
    },
    storeIceConnectionState: function(e) {
        this._iceConnectionStates[e] = MediaCall.BRIDGE.Util.getSyncedCurrentTime()
    },
    getIceConnectionStates: function() {
        return this._iceConnectionStates
    },
    storeIceGatheringState: function(e) {
        this._iceGatheringStates[e] = MediaCall.BRIDGE.Util.getSyncedCurrentTime()
    },
    getIceGatheringStates: function() {
        return this._iceGatheringStates
    },
    getVideoEffects: function() {
        return this._videoEffects
    },
    setVideoEffects: function(e) {
        this._videoEffects = e
    },
    getSelectedVideoBackground: function() {
        return this._videoEffects.background
    },
    getSelectedVideoFilter: function() {
        return this._videoEffects.filter
    },
    setSelectedVideoBackground: function(e) {
        this._videoEffects.background = e
    },
    setSelectedVideoFilter: function(e) {
        this._videoEffects.filter = e
    },
    setAsInitialAudioLoss: function() {
        this._hasInitialAudioLoss = !0
    },
    hasInitialAudioLoss: function() {
        return this._hasInitialAudioLoss
    },
    getDetails: function() {
        return {
            type: this.getType(),
            callerId: this.getCallerId(),
            calleeId: this.getCalleeId(),
            callerName: this.getCallerName(),
            calleName: this.getCalleeName(),
            chatId: this.getChatId()
        }
    },
    applyVideoEffects: function(e, t) {
        if (!this.isRequestPending(MediaCallConstants.requests.applyVideoBackgroundEffect)) {
            var a = this.getCurrentMember(),
                i = a.getAVUpStream(),
                n = i && i._hasVideoTrack(),
                s = !1,
                l = !1,
                r = !1,
                o = !1;
            this.getSelectedVideoBackground() !== e && (s = n, this.setSelectedVideoBackground(e), r = !0), this.getSelectedVideoFilter() !== t && (l = n, this.setSelectedVideoFilter(t), o = !0);
            var d = function(e, t) {
                this.setRequestAsPending(MediaCallConstants.requests.applyVideoBackgroundEffect), MLBackgroundProcessor.applyVideoFilter(e, t, function(e) {
                    this.setRequestAsCompleted(MediaCallConstants.requests.applyVideoBackgroundEffect), e && a.replaceAVUpStreamTrack(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY)
                }.bind(this))
            }.bind(this);
            s ? (this.setRequestAsPending(MediaCallConstants.requests.applyVideoBackgroundEffect), MLBackgroundProcessor.applyVideoBackground(i, e, function(e) {
                this.setRequestAsCompleted(MediaCallConstants.requests.applyVideoBackgroundEffect), e ? (l && MLBackgroundProcessor.applyVideoFilter(e, t), a.replaceAVUpStreamTrack(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY)) : l && d(i, t)
            }.bind(this))) : l && d(i, t), this.canRememberVideoEffects() && (r || o) && MediaUtil.updateVideoEffectsSettings(r ? e : void 0, o ? t : void 0)
        }
    },
    getCallTypeForAdhocCall: function() {
        return MediaCallImpl.isCurrentModeVideoCall(this) ? MediaCallConstants.types.VIDEO : MediaCallConstants.types.AUDIO
    },
    handleConnectionStatsTabOpen: function() {
        this._networkStatsTableDom = ZCJQuery("#media_network_stats_tbl"), this._isConnectionStatsTabOpened = !0, clearInterval(this._statsScoreUpdateInterval);
        this._statsScoreUpdateInterval = setInterval(() => {
            let e = this.getCachedConnectionStatsTableDom(),
                t = ZCConnectionStatsScoreCalculator.getOverallScoreForEachMediaStream(this._connectionStatsLatestData);
            MediaUtil.updateOverallScoresInConnectionStatsTab(e, t)
        }, ZCMediaConstants.connectionStats.overallScore.updateInterval)
    },
    handleConnectionStatsTabClose: function() {
        clearInterval(this._statsScoreUpdateInterval), this._statsScoreUpdateInterval = void 0, this._isConnectionStatsTabOpened = !1, this._networkStatsTableDom = void 0
    },
    isConnectionStatsTabOpened: function() {
        return this._isConnectionStatsTabOpened
    },
    getCachedConnectionStatsTableDom: function() {
        return this._networkStatsTableDom
    },
    getConnectionStatsDataForMediaStreamType: function(e, t) {
        return this._connectionStatsLatestData[e][t ? "upStream" : "downStream"]
    },
    getConnectionStatsData: function() {
        return this._connectionStatsLatestData
    },
    addNetworkPredictor: function() {
        this._networkPredictor = new ZCMediaNetworkPredictor(this.getId(), (function(e, t, a) {
            var i = MediaCallImpl.hasOutgoingSession() ? MediaCallImpl.getOutgoingSession() : MediaCallImpl.hasCurrentIncomingSession() ? MediaCallImpl.getCurrentIncomingSession() : MediaCallImpl.getCurrentSession();
            void 0 !== i && i.getId() === a && (i.writeToLog(CallLogConstants.networkPrediction, {
                state: e,
                calculations: t
            }), MediaCallUI.showBeforeCallNetworkInfo(i.getId(), e))
        }))
    },
    setNetworkPredictor: function(e) {
        this._networkPredictor = e
    },
    getNetworkPredictor: function() {
        return this._networkPredictor
    },
    pushPollingEvent: function(e) {
        this._pollingEvents.push(e)
    },
    isConnectedViaPolling: function() {
        return this._pollingEvents.length > 0
    },
    addLongPollingController: function() {
        this.removeLongPolingController(), this._longPollingController = new LongPollingController(this.getId(), function(e) {
            for (var t = 0; t < e.length; t++) MediaCallImpl.handlePollingEvent(e[t])
        }.bind(this), this._reconnectionPolicy.long_polling_interval)
    },
    removeNetworkPredictor: function() {
        void 0 !== this._networkPredictor && (MediaCallUI.hideBeforeCallNetworkInfo(this.getId()), this._networkPredictor.stop(), this._networkPredictor = void 0)
    },
    removeLongPolingController: function() {
        void 0 !== this._longPollingController && (this._longPollingController.stop(), this._longPollingController = void 0)
    },
    getCallStrengthAnalyser: function() {
        return this._callStrengthAnalyser
    },
    addCallStrengthAnalyser: function(e, t) {
        this.removeCallStrengthAnalyser(), this._callStrengthAnalyser = new CallStrengthAnalyser(this.getId(), e, t)
    },
    removeCallStrengthAnalyser: function() {
        void 0 !== this._callStrengthAnalyser && (this._callStrengthAnalyser.stopAnalysis(), this._callStrengthAnalyser = void 0)
    },
    setAudioTrackEndedInfo: function(e) {
        this._audioTrackEndedInfo = {
            trackLabel: e,
            time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
        }
    },
    getAudioTrackEndedInfo: function(e) {
        return this._audioTrackEndedInfo
    },
    startCall: function() {
        this.isCaller(MediaCall.getCurrentUserId()) && (this.getCaller().initConnection(this._calleeId), this._setCallReceivedAckTimeOut())
    },
    answerCall: function() {
        if (!this.isCaller(MediaCall.getCurrentUserId())) {
            this.setAsCallAnswered(), this._clearIncomingCallTimeOut(), this.setStatusText(MediaCallConstants.statusText.CALL_ANSWERED);
            var e = this.getCurrentMember(),
                t = this.getOtherMember();
            e.connectConnection(this._callerId), e.isReconnectionPolicySupported() && t.isReconnectionPolicySupported() && e.setReconnectionPolicy(this._reconnectionPolicy)
        }
    },
    startCallHandOff: function() {
        var e = this.getCurrentMember();
        this.getOtherMember();
        e.initConnection(this.getOtherMemberId()), this._isHandOffCompleted = !0, e.setAsHandOffInitiator()
    },
    connectCallHandOff: function(e) {
        this.setAsCallAnswered(), this.setStatusText(MediaCallConstants.statusText.CALL_HANDOFF_IN_PROGRESS), this._isHandOffCompleted = !0;
        var t = this.getCurrentMember();
        this.getOtherMember().setAsHandOffInitiator(), t.closeConnection(!1), t.reinitAnswererConnection(e), t.isReconnectionPolicySupported() && this.getOtherMember().isReconnectionPolicySupported() && t.setReconnectionPolicy(this._reconnectionPolicy)
    },
    updateCallDetails: function(e) {
        var t = this._members[e.caller_id],
            a = this._members[e.callee_id],
            i = this.getCurrentMember();
        if (t.setClientSupport(e.caller_client_support), a.setClientSupport(e.callee_client_support), this._chatId = e.chat_id, this._callerName = MediaCall.BRIDGE.Users.getName(this._callerId, e.caller_name), this._calleeName = MediaCall.BRIDGE.Users.getName(this._calleeId, e.callee_name), this._startTime = e.start_time, t._name = this._callerName, a._name = this._calleeName, e.credentials) {
            var n = e.credentials[i.getId()];
            n && i.setTurnCredentials(n)
        }
    },
    _setCallReceivedAckTimeOut: function() {
        var e = function() {
            this.writeToLog(CallLogConstants.timers.callReceivedAckTimeout), this._callReceivedAckTimeOut = void 0, MediaCallImpl.handleCallRingingTimeout(this.getId())
        }.bind(this);
        clearTimeout(this._callReceivedAckTimeOut), this._callReceivedAckTimeOut = setTimeout(e, MediaCallConstants.callReceivedAckTimeLimt)
    },
    handleCallReceived: function() {
        var e = function() {
            this.writeToLog(CallLogConstants.timers.callRingingTimeout), this._callRingingTimeOut = void 0, MediaCallImpl.handleCallRingingTimeout(this.getId())
        }.bind(this);
        this.setStatusText(MediaCallConstants.statusText.CALL_RECEIVED), this._clearCallReceivedAckTimeOut(), clearTimeout(this._callRingingTimeOut), this._callRingingTimeOut = setTimeout(e, MediaCallConstants.callRingingTimeLimit)
    },
    handleCallMissed: function() {
        this.setStatusText(MediaCallConstants.statusText.CALL_MISSED), this.terminate(), MediaCallUI.adaptUIToState(this, MediaCallConstants.states.NO_RESPONSE), MediaCallImpl.handleEnd(this.getId(), !1, {
            playEndTone: !0,
            showCallEndUI: !0
        })
    },
    handleIncomingCallTimeout: function() {
        var e = function() {
            this.setStatusText(MediaCallConstants.statusText.CALL_MISSED), this._incomingCallTimeOut = void 0, this.terminate(), MediaCallImpl.handleEnd(this.getId(), !1)
        }.bind(this);
        clearTimeout(this._incomingCallTimeOut), this._incomingCallTimeOut = setTimeout(e, MediaCallConstants.incomingCallTimeLimit)
    },
    handleCallAnswered: function(e, t) {
        this.setAsCallAnswered(), this._clearCallReceivedAckTimeOut(), this._clearCallRingingTimeOut(), this.getCurrentMember().isReconnectionPolicySupported() && this.getOtherMember().isReconnectionPolicySupported() && this.getCurrentMember().setReconnectionPolicy(this._reconnectionPolicy), this.setStatusText(MediaCallConstants.statusText.CALL_ANSWERED), void 0 !== e && (this.getCurrentMember().storeRemoteTracksMediaId(t), this.getCurrentMember().setRemoteSdp(e))
    },
    handleMuteShortcut: function() {
        if (!this.isInInitialState()) {
            var e = this.getId();
            return this.getCurrentMember().isAudioMuted() ? MediaCallImpl.handleUnmute(e, ZCMediaConstants.muteCases.shortcut) : MediaCallImpl.handleMute(e, ZCMediaConstants.muteCases.shortcut)
        }
    },
    setReceivedTrack: function(e, t) {
        var a = this.getCurrentMember();
        $WC.Util.isEmptyObject(a.getRemoteTracksMediaId()) ? this.isAudioCall() ? a.setAVDownStream(e) : this.isVideoCall() ? a.storeAVTrack(e) : this.isScreenShareWithAudioCall() ? this.isCaller(MediaCall.getCurrentUserId()) ? a.setAVDownStream(e) : a.storeAVTrack(e) : this.isCallee(MediaCall.getCurrentUserId()) && a.setAVDownStream(e) : a.handleRemoteTrackAdded(e, t)
    },
    startActiveCallUpdate: function() {
        this._clearActiveCallUpdateInterval(), this._activeCallUpdateInterval = setInterval(function() {
            void 0 !== this._id && MediaCallAPI.updateCallStatus(this._id, MediaCallConstants.statusText.CALL_ACTIVE)
        }.bind(this), MediaCallConstants.activeCallUpdateInterval)
    },
    _clearActiveCallUpdateInterval: function() {
        clearInterval(this._activeCallUpdateInterval), this._activeCallUpdateInterval = void 0
    },
    _clearCallReceivedAckTimeOut: function() {
        clearTimeout(this._callReceivedAckTimeOut), this._callReceivedAckTimeOut = void 0
    },
    _clearCallRingingTimeOut: function() {
        clearTimeout(this._callRingingTimeOut), this._callRingingTimeOut = void 0
    },
    _clearIncomingCallTimeOut: function() {
        clearTimeout(this._incomingCallTimeOut), this._incomingCallTimeOut = void 0
    },
    terminate: function(e) {
        this._callStrengthAnalyser && !this.hasAnalysedAudioLoss() && MediaCallImpl.analyseAudioLoss(this, this._callStrengthAnalyser.getCurrentStats()), this._clearCallReceivedAckTimeOut(), this._clearCallRingingTimeOut(), this._clearIncomingCallTimeOut(), this._clearActiveCallUpdateInterval(), this.removeCallStrengthAnalyser(), this.removeNetworkPredictor(), this.removeLongPolingController(), this.clearVideoEffectsPreview(), this.unSubscribe(), MediaUtil.clearAudioPreview(this);
        var t = this.getMembers();
        for (var a in t) {
            t[a].closeConnection(!e)
        }
    },
    getLogString: function() {
        return this._logString
    },
    setLogString: function(e) {
        this._logString = e
    },
    writeToLog: function(e, t) {
        try {
            this._logString = this._logString + "\n[" + new Date(Date.now()) + "] -> " + e, void 0 !== t && (this._logString = this._logString + " " + JSON.stringify(t, null, 4))
        } catch {}
    },
    getLogAsFile: function(e) {
        if (this._logString.length > 0) return e = void 0 !== e ? e : ZCMediaConstants.defaultLogFileName, [new File([this._logString], e, {
            type: "text/plain"
        }), e]
    },
    isPresentationStream: function() {
        return this._isPresentationStreaming
    },
    setAsPresentationStream: function() {
        this._isPresentationStreaming = !0
    },
    resetPresentationStream: function() {
        this._isPresentationStreaming = !1
    },
    getPresentation: function() {
        return this._presentation
    },
    get121TitleMaxLimit: function() {
        return this._onetooneCallTitleMaxLength
    },
    setPresentation: function(e) {
        this._presentation = e, "undefined" != typeof Conference && Conference.isPresentationStreamingEnabled() && this.setAsPresentationStream()
    },
    isPresenter: function() {
        return this.getCurrentUserId() === this.getPresenterId()
    },
    getCurrentUserId: function() {
        return MediaCall.getCurrentUserId()
    },
    isUserPresenter: function(e) {
        return e === this.getPresenterId()
    },
    hasPresentation: function() {
        return void 0 !== this.getPresenterId()
    },
    hasPresentationContainer: function() {
        return this.hasPresentation() && !this.isPresenter()
    },
    getPresentationOwnerName: function() {
        var e = this.getPresentor();
        return MediaCall.BRIDGE.Users.getName(e.getId(), e.getName())
    },
    getPresentor: function() {
        return this.getMember(this.getPresenterId())
    },
    getPresenterId: function() {
        var e = this.getPresentation();
        if (e) return e.getPresenterId()
    },
    updateWhiteBoardInfo: function(e) {
        this._whiteBoard.currentBoard = e.boardId, this._whiteBoard.boards[this._whiteBoard.currentBoard] = e
    },
    hasWhiteBoard: function() {
        return void 0 !== this._whiteBoard.currentBoard
    },
    isWhiteBoardCreator: function() {
        return void 0 !== this._whiteBoard.currentBoard && this._whiteBoard.boards[this._whiteBoard.currentBoard].creator === $zcg._ZUID
    },
    hasWhiteboardStopPermission: function() {
        return void 0 !== this._whiteBoard.currentBoard && (this._callerId == $zcg._ZUID || this._calleeId == $zcg._ZUID)
    },
    getCurrentWhiteBoardId: function() {
        return this._whiteBoard.currentBoard
    },
    getWhiteBoardCreator: function() {
        return this.getMember(this._whiteBoard.boards[this._whiteBoard.currentBoard].creator)
    },
    getCurrentWhiteBoard: function() {
        if (void 0 !== this._whiteBoard.currentBoard) return this._whiteBoard.boards[this._whiteBoard.currentBoard]
    },
    resetCurrentWhiteBoard: function() {
        this._whiteBoard.currentBoard = void 0
    },
    setRedirectionState: function() {
        this._isRedirected = !0
    },
    isRedirectedToCliq: function() {
        return this._isRedirected
    }
};
var MediaCallMember = function(e, t, a, i) {
    this._id = e, this._name = t, this._callId = a, this._turnCredentials = i, this._connection = void 0, this._isSharingScreen = !1, this._recordingReferenceIndex = void 0, this._isHandOffInitiator = !1, this._avUpStream = void 0, this._screenUpStream = void 0, this._avDownStream = void 0, this._screenDownStream = void 0, this._avDownStreamTracks = [], this._videoDownStreamId = void 0, this._audioDownStreamId = void 0, this._screenDownStreamId = void 0, this._remoteSdp = void 0, this._remoteIceCandidates = [], this._remoteTracksMediaId = {}, this._remoteTurnType = void 0, this._clientType = void 0, this._clientSupport = {
        perfect_renegotiation: !0,
        multi_stream: !0,
        close_track_on_mute: !0
    }, this._sendOfferTimer = void 0, this._lastReconnectionId = void 0, this._audioStatus = {
        muted: !1,
        time: -1
    }, this._videoStatus = {
        muted: !1,
        time: -1
    }, this._holdStatus = {
        state: "off",
        time: -1
    }, this._isScreenShareWithoutAudio = !1, this._isVideoCallWithoutVideo = !1, this._hasSwitchedToVideo = !1, this._hasAddedTransceiverForVideo = !1, this._isTurnCandidatesGenerated = !1, this._isDownStreamConnectedForConvertedCall = !1
};
MediaCallMember.prototype = {
    getId: function() {
        return this._id
    },
    getName: function() {
        return this._name
    },
    getAVUpStream: function() {
        return this._avUpStream
    },
    getAVDownStream: function() {
        return this._avDownStream
    },
    getScreenUpStream: function() {
        return this._screenUpStream
    },
    getTurnCredentials: function() {
        return this._turnCredentials
    },
    setTurnCredentials: function(e) {
        this._turnCredentials = e
    },
    setTurnCandidatesGenerated: function() {
        this._isTurnCandidatesGenerated = !0
    },
    resetTurnCandidatesGenerated: function() {
        this._isTurnCandidatesGenerated = !1
    },
    isTurnCandidatesGenerated: function() {
        return this._isTurnCandidatesGenerated
    },
    setClientSupport: function(e) {
        this._clientSupport = e
    },
    getClientSupport: function() {
        return this._clientSupport
    },
    setClientType: function(e) {
        this._clientType = e
    },
    getClientType: function() {
        return this._clientType
    },
    isReconnectionPolicySupported: function() {
        return void 0 !== this._clientSupport.reconnection_policy && this._clientSupport.reconnection_policy
    },
    isTrackRenegotiationSupported: function() {
        return void 0 !== this._clientSupport.close_track_on_mute && this._clientSupport.close_track_on_mute
    },
    isLyraCodecSupported: function() {
        return void 0 !== this._clientSupport.lyra_support && this._clientSupport.lyra_support
    },
    isAdhocCallingSupported: function() {
        return void 0 !== this._clientSupport.adhoc_call_support && this._clientSupport.adhoc_call_support
    },
    isCallCollisionSupported: function() {
        return void 0 !== this._clientSupport.call_collision_handling && this._clientSupport.call_collision_handling
    },
    isInitialReconnectionSupported: function() {
        return void 0 !== this._clientSupport.initial_reconnection && this._clientSupport.initial_reconnection
    },
    isRecordingSupported: function() {
        return void 0 !== this._clientSupport.recording_support && this._clientSupport.recording_support
    },
    isHandoffSupported: function() {
        return void 0 !== this._clientSupport.handoff_support && this._clientSupport.handoff_support
    },
    isNewRTCConnectionSupported: function() {
        return void 0 !== this._clientSupport.new_rtc_connection_support && this._clientSupport.new_rtc_connection_support
    },
    isWhiteBoardSupported: function() {
        return void 0 !== this._clientSupport.whiteboard_support && this._clientSupport.whiteboard_support
    },
    isPresentationSupported: function() {
        return void 0 !== this._clientSupport.presentation_support && this._clientSupport.presentation_support
    },
    isPerfectRenegotiationSupported: function() {
        return this._clientSupport.perfect_renegotiation
    },
    isMultiStreamSupported: function() {
        return this._clientSupport.multi_stream
    },
    isSharingScreen: function() {
        return this._isSharingScreen && !MediaCallImpl.getCurrentSession().isPresentationStream()
    },
    isRecording: function() {
        return void 0 !== this._recordingReferenceIndex
    },
    isCurrentUser: function() {
        return this._id === MediaCall.getCurrentUserId()
    },
    setAsSharingScreen: function() {
        this._isSharingScreen = !0
    },
    resetSharingScreen: function() {
        this._isSharingScreen = !1
    },
    setRecordingReferenceIndex: function(e) {
        this._recordingReferenceIndex = e
    },
    resetRecordingReferenceIndex: function() {
        this._recordingReferenceIndex = void 0
    },
    getRecordingReferenceIndex: function() {
        return this._recordingReferenceIndex
    },
    setAsSwitchedToVideo: function() {
        this._hasSwitchedToVideo = !0
    },
    resetSwitchedToVideo: function() {
        this._hasSwitchedToVideo = !1
    },
    hasSwitchedToVideo: function() {
        return this._hasSwitchedToVideo
    },
    setAudioMuted: function() {
        return this._audioStatus.muted = !0
    },
    setVideoMuted: function() {
        return this._videoStatus.muted = !0
    },
    isAudioMuted: function() {
        return this._audioStatus.muted
    },
    isVideoMuted: function() {
        return this._videoStatus.muted
    },
    setScreenShareWithoutAudio: function() {
        this._isScreenShareWithoutAudio = !0
    },
    isScreenShareWithoutAudio: function() {
        return this._isScreenShareWithoutAudio
    },
    setAsHandOffInitiator: function() {
        this._isHandOffInitiator = !0
    },
    isHandOffInitiator: function() {
        return this._isHandOffInitiator
    },
    setVideoCallWithoutVideo: function() {
        this._isVideoCallWithoutVideo = !0
    },
    isVideoCallWithoutVideo: function() {
        return this._isVideoCallWithoutVideo
    },
    setAVUpStream: function(e) {
        e && (this._avUpStream = e)
    },
    setScreenUpStream: function(e) {
        this._screenUpStream = e
    },
    reconnectCall: function() {
        this._connection && this._connection._reconnect()
    },
    setBitRateForStream: function(e, t) {
        this._connection && this._connection.setBitRate(e, t)
    },
    resetBitRateForStream: function(e) {
        this._connection && this._connection.resetBitRate(e)
    },
    pushStatsToConnectionMonitor: function(e) {
        this._connection && this._connection.pushStatsToConnectionMonitor(e)
    },
    getlogsFromConnectionMonitor: function() {
        if (this._connection) return this._connection.getlogsFromConnectionMonitor()
    },
    setReconnectionPolicy: function(e) {
        this._connection.setReconnectionPolicy(e)
    },
    isIceConnectionStateConnected: function() {
        return this._connection && this._connection.isIceConnectionStateConnected()
    },
    isDownStreamConnectedForConvertedCall: function() {
        return this._isDownStreamConnectedForConvertedCall
    },
    setAsDownStreamConnectedForConvertedCall: function() {
        this._isDownStreamConnectedForConvertedCall = !0
    },
    handleRemoteTrackAdded: function(e, t) {
        var a = t[0],
            i = a.id,
            n = this.getRemoteTracksMediaId();
        if ("audio" == e.kind) {
            if (n.screen_audio === i)
                if (this._screenDownStreamId !== i) {
                    var s = this._screenDownStream._hasVideoTrack() ? WebRTCUserMedia.streamTypes.AUDIO_VIDEO : WebRTCUserMedia.streamTypes.AUDIO_ONLY;
                    this._screenDownStream._hasAudioTrack() ? this._screenDownStream._replacePrimaryAudioTrack(e) : this._screenDownStream._addPrimaryAudioTrack(e, s), this._screenDownStreamId = i
                } else this.pauseAndPlayScreen();
            else if (n.audio === i)
                if (void 0 === this._avDownStream) this._audioDownStreamId = i, this._avDownStream = a, this.setRemoteAVStreamInContainer();
                else if (this._audioDownStreamId !== i) {
                s = this._avDownStream._hasVideoTrack() ? WebRTCUserMedia.streamTypes.AUDIO_VIDEO : WebRTCUserMedia.streamTypes.AUDIO_ONLY;
                this._avDownStream._hasAudioTrack() ? this._avDownStream._replacePrimaryAudioTrack(e) : this._avDownStream._addPrimaryAudioTrack(e, s), this._audioDownStreamId = i
            } else this.pauseAndPlayAudioVideo()
        } else if ("video" == e.kind) {
            var l = MediaCallImpl.getCurrentSession(),
                r = l.getCurrentMember(),
                o = l.getOtherMember();
            if (n.screen === i) o.setAsSharingScreen(), this._screenDownStreamId = i, this._screenDownStream = a, this.setRemoteScreenStreamInContainer(), l.setAsScreenShared();
            else if (n.video === i) {
                if (!o.hasSwitchedToVideo()) {
                    o.setAsSwitchedToVideo();
                    var d = MediaCallUI.getMediaCallWrapper(l.getId());
                    MediaCallUI.handleSwitchToVideoLayout(), MediaCallUI.adjustCallContainerHeight(d), MediaCallUI.getVideoContainer(l.getId(), o.getId()).removeClass("AV-call-video-muted"), this.hasSwitchedToVideo() || MediaCallUI.showSwitchToVideoInfo(d)
                }
                if (void 0 === this._avDownStream) this._videoDownStreamId = i, this._avDownStream = a, this.setRemoteAVStreamInContainer();
                else if (this._videoDownStreamId !== i) {
                    s = this._avDownStream._hasAudioTrack() ? WebRTCUserMedia.streamTypes.AUDIO_VIDEO : WebRTCUserMedia.streamTypes.VIDEO_ONLY;
                    this._avDownStream._hasVideoTrack() ? this._avDownStream._replacePrimaryVideoTrack(e) : this._avDownStream._addPrimaryVideoTrack(e, s), this._videoDownStreamId = i
                } else this.pauseAndPlayAudioVideo()
            }
            d = MediaCallUI.getMediaCallWrapper(l.getId());
            var c = r.isSharingScreen() || o.isSharingScreen(),
                C = l.isVideoCall() || r.hasSwitchedToVideo() || o.hasSwitchedToVideo();
            d.toggleClass("AV-call-no-subview", !C && c), MediaUtil.handleStreamStatsVisibilityInConnectionStatsTab(l)
        }
    },
    openWhiteBoard: function() {
        var e = MediaCallImpl.getCurrentSession();
        MediaCallImpl.getCurrentSession().getOtherMember();
        MediaCallUI.addAndGetWhiteBoardContainer(e._id, e)
    },
    closeWhiteBoard: function() {
        var e = MediaCallImpl.getCurrentSession();
        e.resetCurrentWhiteBoard(), MediaCallUI.removeWhiteBoardContainer(e, e.getOtherMemberId())
    },
    handleRemoteTrackIfRemoved: function() {
        if (MediaCallImpl.hasCurrentSession()) {
            var e = MediaCallImpl.getCurrentSession(),
                t = this.getRemoteTracksMediaId();
            if (void 0 !== t && void 0 === t.screen) {
                var a = e.getOtherMember();
                a.resetSharingScreen(), this._screenDownStream = void 0, MediaCallUI.removeScreenContainer(e, a.getId())
            }
            MediaUtil.handleStreamStatsVisibilityInConnectionStatsTab(e)
        }
    },
    _pauseAndPlay: function(e) {
        var t = e.find("video")[0];
        t.pause(), t.play().then(function() {
            var e = MediaCallUI.getMediaCallWrapper(this._callId);
            MediaCallUI.adjustCallContainerHeight(e)
        }.bind(this))
    },
    pauseAndPlayAudioVideo: function() {
        this._pauseAndPlay(MediaCallUI.getVideoContainer(this._callId, MediaCallImpl.getCurrentSession().getOtherMember().getId()))
    },
    pauseAndPlayScreen: function() {
        this._pauseAndPlay(MediaCallUI.getScreenContainer(this._callId, MediaCallImpl.getCurrentSession().getOtherMember().getId()))
    },
    setRemoteAVStreamInContainer: function() {
        var e = MediaCallImpl.getCurrentSession().getOtherMember(),
            t = MediaCallUI.getVideoContainer(this._callId, e.getId());
        MediaUtil.setStreamInContainer(e.getId(), t, this._avDownStream, function() {
            var e = MediaCallUI.getMediaCallWrapper(this._callId);
            MediaCallUI.adjustCallContainerHeight(e)
        }.bind(this))
    },
    setLocalAVStreamInContainer: function() {
        var e = MediaCallUI.getVideoContainer(this._callId, this.getId());
        MediaUtil.setStreamInContainer(this.getId(), e, this._avUpStream, function() {
            var e = MediaCallUI.getMediaCallWrapper(this._callId);
            MediaCallUI.adjustCallContainerHeight(e)
        }.bind(this))
    },
    setRemoteScreenStreamInContainer: function() {
        var e = MediaCallImpl.getCurrentSession().getOtherMember(),
            t = MediaCallUI.addAndGetScreenContainer(this._callId, e.getId());
        MediaUtil.setStreamInContainer(e.getId(), t, this._screenDownStream, function() {
            var e = MediaCallUI.getMediaCallWrapper(this._callId);
            MediaCallUI.adjustCallContainerHeight(e)
        }.bind(this))
    },
    setAVDownStream: function(e) {
        this._avDownStream = new MediaStream([e]), this.setRemoteAVStreamInContainer()
    },
    storeAVTrack: function(e) {
        void 0 !== this._avDownStream ? "audio" == e.kind ? this._avDownStream._replacePrimaryAudioTrack(e) : this._avDownStream._replacePrimaryVideoTrack(e) : (this._avDownStreamTracks.push(e), 2 === this._avDownStreamTracks.length && (this._avDownStream = new MediaStream(this._avDownStreamTracks), this.setRemoteAVStreamInContainer(), this._avDownStreamTracks = []))
    },
    addVideoTrackInStream: function(e) {
        this.setAVUpStream(e), this._remoteSdp = void 0, this._remoteIceCandidates = [], this.setLocalAVStreamInContainer(), this._connection.attachVideoTracks(e)
    },
    replaceAVUpStreamTrack: function(e, t) {
        this.setAVUpStream(e), this.setLocalAVStreamInContainer(), this._connection.replaceTracksWithoutNegotiation(e, t)
    },
    replaceTracksInStream: function(e, t) {
        this.setAVUpStream(e), this._remoteSdp = void 0, this._remoteIceCandidates = [], this._connection.replaceTracks(e, t)
    },
    setRemoteTurnType: function(e) {
        this._remoteTurnType = e, this._connection && this._connection.setTurnType(this._remoteTurnType)
    },
    getRemoteTurnType: function() {
        return this._remoteTurnType
    },
    storeRemoteSdp: function(e) {
        this._remoteSdp = e
    },
    setRemoteSdp: function(e) {
        this.storeRemoteSdp(e), this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId), this._connection.setRemoteSdp(e), this._connection.updateLocalIceCandidates(), this._connection.addRemoteIceCandidates(this._remoteIceCandidates), this._remoteIceCandidates = []
    },
    getRemoteTracksMediaId: function() {
        return this._remoteTracksMediaId
    },
    storeRemoteTracksMediaId: function(e) {
        void 0 !== e && (this._remoteTracksMediaId = e, this.handleRemoteTrackIfRemoved())
    },
    storeRemoteIceCandidates: function(e) {
        e.forEach(function(e) {
            this._remoteIceCandidates.push(e)
        }.bind(this))
    },
    setRemoteIceCandidates: function(e) {
        this.storeRemoteIceCandidates(e), void 0 !== this._remoteSdp && (this._connection.addRemoteIceCandidates(e), this._remoteIceCandidates = [])
    },
    handleHoldStatus: function(e, t) {
        this._holdStatus.time > t || (this._holdStatus.time = t, this._holdStatus.state = e)
    },
    setUpdatedAVStatus: function() {
        this.handleAVStreamStatus("audio", this._audioStatus.muted, this._audioStatus.time), this.handleAVStreamStatus("video", this._videoStatus.muted, this._videoStatus.time)
    },
    updateAVStatus: function(e, t, a) {
        if ("video" === e) {
            if (this._videoStatus.time > a) return;
            this._videoStatus.time = a, this._videoStatus.muted = t, ZCPIPManager.toggleCamInPIP(t)
        } else {
            if (this._audioStatus.time > a) return;
            this._audioStatus.time = a, this._audioStatus.muted = t, ZCPIPManager.toggleMicInPIP(t)
        }
    },
    handleAVStreamStatus: function(e, t, a) {
        var i = this.getId() === MediaCall.getCurrentUserId(),
            n = function() {
                WebRTCUserMedia.closeStream(this._avUpStream._getType()), this._avUpStream = void 0
            };
        if ("video" === e) {
            if (this._videoStatus.time > a) return;
            this._videoStatus.time = a, this._videoStatus.muted = t;
            var s = MediaCallUI.getVideoContainer(this._callId, this.getId());
            if (i) {
                var l = this.getAVUpStream();
                t && l && l._hasVideoTrack() && (WebRTCUserMedia.removeTracksInStream(l, WebRTCUserMedia.streamTypes.VIDEO_ONLY, void 0, n.bind(this)), this._connection.detachVideoTracks()), ZCPIPManager.toggleCamInPIP(t)
            } else s.toggleClass("AV-call-video-muted", t);
            s.find("video").toggleClass("dN zc-av-dN", t)
        } else {
            if (this._audioStatus.time > a) return;
            if (this._audioStatus.time = a, this._audioStatus.muted = t, i) {
                l = this.getAVUpStream();
                if (ZCPIPManager.toggleMicInPIP(t), ZCMediaPreferences.isSpeechDetectionAllowedByUser()) return void(t ? this.detachAudioFromConnection() : this.attachAudioInConnection());
                t && l && l._hasAudioTrack() && (WebRTCUserMedia.removeTracksInStream(l, WebRTCUserMedia.streamTypes.AUDIO_ONLY, void 0, n.bind(this)), this._connection.detachAudioTracks())
            } else MediaCallUI.getVideoContainer(this._callId, this.getId()).find("[audioMutedStatus]").toggleClass("dN zc-av-dN", !t)
        }
    },
    attachAudioInConnection: function() {
        var e = this.getAVUpStream();
        e && e._isAudioRestrictedForConnection() && (e._resetConnectionRestrictionForAudio(), this._connection.attachAudioTracks(e))
    },
    detachAudioFromConnection: function() {
        var e = this.getAVUpStream();
        e && e._hasAudioTrack() && e._setConnectionRestrictionForAudio(), this._connection.detachAudioTracks()
    },
    setLastReconnectionId: function(e) {
        this._lastReconnectionId = e
    },
    clearLastReconnectionId: function(e) {
        this._lastReconnectionId = void 0
    },
    isOfferAlreadyReceivedForReconnection: function(e) {
        return this._lastReconnectionId === e
    },
    initConnection: function(e) {
        this._connection = new ZCAVDirectCallPeerConnection(this._callId, this.getId(), this.getId(), e, this.getTurnCredentials(), MediaCallHandler.peerConnectionEvents), this._connection.init(this.getAVUpStream(), this.getScreenUpStream())
    },
    connectConnection: function(e) {
        this._connection = new ZCAVDirectCallPeerConnection(this._callId, this.getId(), e, this.getId(), this.getTurnCredentials(), MediaCallHandler.peerConnectionEvents), this._connection.setTurnType(this._remoteTurnType), this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId), this._connection.connect(this._remoteSdp, this._remoteIceCandidates, this.getAVUpStream(), this.getScreenUpStream()), this._connection.setConnectionHandshakeTimeout()
    },
    replaceScreenWithVideoInNewConnection: function(e) {
        this.isSharingScreen() && (MediaCallUI.resetScreenShareOption(), this._screenUpStream && (WebRTCUserMedia.closeStream(this._screenUpStream._getType()), this._screenUpStream = void 0), this.resetSharingScreen()), this.setAVUpStream(e);
        var t = MediaCallUI.getMediaCallWrapper(this._callId);
        t.find('[mediacallbuttons][purpose="turnOffCamera"]').removeClass("dN zc-av-dN"), MediaCallUI.handleSwitchToVideoLayout(), MediaCallUI.adjustCallContainerHeight(t), this._connection.replaceScreenWithVideo(e)
    },
    replaceVideoWithScreenInNewConnection: function(e) {
        var t = this.getAVUpStream();
        if (t._hasVideoTrack()) {
            this.setScreenUpStream(e), this.setAsSharingScreen(), this.resetSwitchedToVideo();
            var a = MediaCallUI.getMediaCallWrapper(this._callId);
            if (this.isVideoMuted()) {
                var i = a.find('[mediacallbuttons][purpose="turnOnCamera"]').addClass("dN zc-av-dN");
                MediaCallHandler.UIEvents.turnOnCamera(void 0, i)
            } else a.find('[mediacallbuttons][purpose="turnOffCamera"]').addClass("dN zc-av-dN");
            var n = function(t) {
                var a = MediaCallUI.getVideoContainer(this._callId, this.getId());
                MediaUtil.setStreamInContainer(this.getId(), a, t), this._connection.replaceVideoWithScreen(t, e)
            }.bind(this);
            WebRTCUserMedia.removeTracksInStream(t, WebRTCUserMedia.streamTypes.VIDEO_ONLY, !1, n)
        } else this.addScreenInConnection(e)
    },
    addScreenInConnection: function(e) {
        this.isSharingScreen() || (this.setScreenUpStream(e), this.setAsSharingScreen(), this._connection.attachScreenTracks(e, !MediaCallImpl.getCurrentSession().getOtherMember().isNewRTCConnectionSupported()), MediaCallAPI.updateStreamSourceState(this._callId, "screen", "on", MediaCall.BRIDGE.Util.getSyncedCurrentTime()))
    },
    removeScreenFromConnection: function() {
        this.isSharingScreen() && (this._screenUpStream && (WebRTCUserMedia.closeStream(this._screenUpStream._getType()), this._screenUpStream = void 0, this._connection.detachScreenTracks(!MediaCallImpl.getCurrentSession().getOtherMember().isNewRTCConnectionSupported()), MediaCallAPI.updateStreamSourceState(this._callId, "screen", "off", MediaCall.BRIDGE.Util.getSyncedCurrentTime())), this.resetSharingScreen())
    },
    handleReconnect: function(e, t, a) {
        this._remoteSdp = void 0, this._remoteIceCandidates = [], this._avDownStream = void 0, this._screenDownStream = void 0, this._avDownStreamTracks = [], this._hasAddedTransceiverForVideo = !1, a && (this._connection.restartOffererProcess(), this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId))
    },
    handleReinit: function(e) {
        this._remoteSdp = void 0, this._remoteIceCandidates = [], this._avDownStream = void 0, this._screenDownStream = void 0, this._avDownStreamTracks = [], e ? (this._connection.reinitOfferer(), this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId)) : MediaCallAPI.reinit(this._callId)
    },
    reinitOffererConnection: function() {
        this._remoteSdp = void 0, this._remoteIceCandidates = [], this._avDownStream = void 0, this._screenDownStream = void 0, this._avDownStreamTracks = [], this._connection.reinitOfferer(), this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId)
    },
    reinitAnswererConnection: function(e) {
        this._remoteSdp = e, this._remoteIceCandidates = [], this._avDownStream = void 0, this._screenDownStream = void 0, this._avDownStreamTracks = [], this._connection.reinitAnswerer(e), this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId)
    },
    restartAnswererConnection: function(e) {
        this._remoteSdp = e, this._remoteIceCandidates = [], this._avDownStream = void 0, this._screenDownStream = void 0, this._avDownStreamTracks = [], void 0 === this.getRemoteTurnType() && this._connection.switchTurnServers(), this._connection.restartAnswererProcess(e), this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId)
    },
    renegotiateOffererConnection: function(e) {
        var t = !1;
        this._hasAddedTransceiverForVideo || !this.isPerfectRenegotiationSupported() || e || void 0 !== this._screenDownStream && void 0 !== this._avDownStream && this._avDownStream._hasVideoTrack() || (this._hasAddedTransceiverForVideo = t = !0), this._connection.renegotiateOfferer(e, t)
    },
    renegotiateAnswererConnection: function(e, t) {
        this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId), this._connection.renegotiateAnswerer(e, t)
    },
    isConnectionStateClosed: function() {
        return void 0 === this._connection || this._connection.isConnectionStateClosed()
    },
    removeStreamInstances: function() {
        this._avUpStream = void 0, this._screenUpStream = void 0
    },
    closeConnection: function(e) {
        clearTimeout(this._sendOfferTimer), this._sendOfferTimer = void 0, this._connection && this._connection.close(), e && (this._avUpStream && (WebRTCUserMedia.closeStream(this._avUpStream._getType()), this._avUpStream = void 0), this._screenUpStream && (WebRTCUserMedia.closeStream(this._screenUpStream._getType()), this._screenUpStream = void 0))
    }
};
var AdhocOneToOneCallHandler = {
        handleAVStatus: function(e, t, a) {
            var i = a.msgObj,
                n = MediaCallImpl.getCurrentSession();
            if (n && n.getId() === t) {
                var s = n.getCurrentMemberId(),
                    l = n.getOtherMemberId();
                if (n.writeToLog(CallLogConstants.wms.mediaSetting + JSON.stringify(i)), s !== i.actionUserId && i.userIds.includes(l)) {
                    var r = n.getOtherMember();
                    i.audio ? r.handleAVStreamStatus("audio", i.audio.muted, i.audio.time) : r.handleAVStreamStatus("video", i.video.muted, i.video.time)
                }
            }
        },
        handleScreenRemoved: function(e, t, a) {
            var i = MediaCallImpl.getCurrentSession(),
                n = i.getOtherMember().getId(),
                s = i.getCurrentMember().getId();
            i && i.getId() === t && (a.userId === s ? (MediaCallUI.resetScreenShareOption(), i.getCurrentMember().resetSharingScreen()) : a.userId === n && (MediaCallUI.removeScreenContainer(i, n), i.getOtherMember().resetSharingScreen()))
        },
        handleVideoStream: function(e, t, a) {
            var i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === t) {
                var n = a.videoStream,
                    s = i.getCurrentMember().getId(),
                    l = i.getOtherMember().getId();
                if (void 0 !== n && (a.userId === l || a.userId === s)) {
                    var r = MediaCallUI.getVideoContainer(t, a.userId);
                    MediaUtil.setStreamInContainer(a.userId, r, n, function() {
                        var e = MediaCallUI.getMediaCallWrapper(t);
                        MediaCallUI.adjustCallContainerHeight(e)
                    }.bind(this))
                }
            }
        },
        handleScreenStream: function(e, t, a) {
            var i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === t) {
                var n = a.screenStream,
                    s = i.getOtherMember().getId();
                if (void 0 !== n && a.userId === s && !i.isPresentationStream()) {
                    i.getOtherMember().setAsSharingScreen();
                    var l = MediaCallUI.addAndGetScreenContainer(t, s);
                    MediaUtil.setStreamInContainer(s, l, n, function() {
                        var e = MediaCallUI.getMediaCallWrapper(t);
                        MediaCallUI.adjustCallContainerHeight(e)
                    }.bind(this))
                }
            }
        },
        handleRecordingState: function(e, t, a) {
            let i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === t) {
                let e = a.state;
                "start" === e ? (i.getCurrentMember().setRecordingReferenceIndex(a.referenceIndex), a.isRepairMessage || a.action_user || MediaCallImpl.playTone(i, MediaCallConstants.states.RECORDING_STARTED)) : (i.getCurrentMember().resetRecordingReferenceIndex(), a.isRepairMessage || a.action_user || MediaCallImpl.playTone(i, MediaCallConstants.states.RECORDING_STOPPED)), MediaCallUI.updateRecordingState(t, e)
            }
        }
    },
    AdhocConferenceHandler = {
        audioMute: function(e, t, a) {
            var i = e.getId(),
                n = e.getCurrentMember();
            e.writeToLog(CallLogConstants.ui.micOff), MediaCallUI.muteAudio(e), MediaCallUI.getVideoContainer(i, n.getId()).find("[audioMutedStatus]").removeClass("dN zc-av-dN"), n.updateAVStatus("audio", !0, MediaCall.BRIDGE.Util.getSyncedCurrentTime()), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.muteAudio() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.muteAudio()
        },
        audioUnMute: function(e, t, a) {
            var i = e.getId(),
                n = e.getCurrentMember();
            MediaCallUI.unmuteAudio(e), MediaCallUI.getVideoContainer(i, n.getId()).find("[audioMutedStatus]").addClass("dN zc-av-dN"), n.updateAVStatus("audio", !1, MediaCall.BRIDGE.Util.getSyncedCurrentTime()), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.unmuteAudio() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.unmuteAudio()
        },
        videoMute: function(e, t, a) {
            var i = e.getId(),
                n = e.getCurrentMember();
            e.writeToLog(CallLogConstants.ui.camOff), MediaCallUI.muteVideo(e), MediaCallUI.getVideoContainer(i, n.getId()).find("video").addClass("dN zc-av-dN"), n.updateAVStatus("video", !0, MediaCall.BRIDGE.Util.getSyncedCurrentTime()), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.muteVideo() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.muteVideo()
        },
        videoUnMute: function(e, t, a) {
            var i = e.getId(),
                n = e.getCurrentMember();
            MediaCallUI.unmuteVideo(e);
            var s = MediaCallUI.getVideoContainer(i, n.getId());
            s.removeClass("AV-call-video-muted"), s.find("video").removeClass("dN zc-av-dN"), n.updateAVStatus("video", !1, MediaCall.BRIDGE.Util.getSyncedCurrentTime()), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.unmuteVideo() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.unmuteVideo()
        },
        startScreenShare: function(e, t, a) {
            var i = e.getId();

            function n() {
                var e = MediaCallImpl.getCurrentSession();
                e.getId() === i && (MediaCallUI.handleScreenShareStart(), e.getCurrentMember().setAsSharingScreen(), e.setAsScreenShared())
            }

            function s() {
                MediaCallHandler.UIEvents.stopScreenShare()
            }
            ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceUI.startScreenShare(n, void 0, s) : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceUI.startScreenShare(n, void 0, s)
        },
        stopScreenShare: function(e, t, a) {
            MediaCallUI.resetScreenShareOption(), e.getCurrentMember().resetSharingScreen(), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.stopScreenShare() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.stopScreenShare()
        },
        setMediaDevices: function(e, t, a) {
            var i = a.changedDevices;
            ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceImpl.handleDeviceChange(ConferenceImpl.getCurrentSession(), i, !1) : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceImpl.handleDeviceChange(ZCSmartConferenceImpl.getCurrentSession(), i, !1)
        },
        addUsers: function(e, t, a) {
            var i = a.selectedList,
                n = a.title;
            ZCSmartConferenceImpl.hasCurrentActiveSession() && ZCSmartConferenceImpl.getCurrentActiveSession().getId() === t && ConferenceAPI.invite(t, i, !1, {
                title: n,
                recording_action: a.recordingAction,
                recording_index: a.recordingIndex
            }), ZCSmartConferenceUI.closeInviteUsers(t)
        },
        applyVideoEffects: function(e, t, a) {
            ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceImpl.getCurrentSession().applyVideoEffects(a.bgValue, a.filterValue)
        }
    },
    MediaCallRTCPeerConnectionConstants = {};
MediaCallRTCPeerConnectionConstants = {
    processTypes: {
        INIT: "init",
        REINIT: "reinit",
        RESTART: "reconnection",
        RENEGOTIATE: "renegotiate",
        HANDOFF: "handoff"
    },
    isRestart: function(e) {
        return this.processTypes.RESTART === e
    },
    isHandOff: function(e) {
        return this.processTypes.HANDOFF === e
    },
    turnTypes: {
        GEO: "geo",
        MAIN: "main",
        BACKUP: "backup",
        isGeo: function(e) {
            return this.GEO === e
        },
        isMain: function(e) {
            return this.MAIN === e
        },
        isBackup: function(e) {
            return this.BACKUP === e
        }
    },
    defaultReconnectionInterval: 2e3
};
class ZCAVDirectCallPeerConnection {
    constructor(e, t, a, i, n, s) {
        this._connectionId = e, this._hostId = t, this._offererId = a, this._answererId = i, this._connection = void 0, this._turnCredentials = n, this._avUpStream = void 0, this._screenUpStream = void 0, this._localSdp = void 0, this._remoteSdp = void 0, this._localIceCandidates = [], this._generatedCandidates = [], this._remoteIceCandidates = [], this._audioRtpSenders = [], this._videoRtpSenders = [], this._screenRtpSenders = [], this._localTracksMediaId = {}, this._remoteTracksMediaId = {}, this._canUpdateLocalIceCandidates = !1, this._iceCandidatesGatheringTimer = void 0, this._connectionHandshakeTimer = void 0, this._disconnectTimer = void 0, this._reconnectionId = 0, this._reconnectTimer = void 0, this._reconnectionState = MediaCall.BRIDGE.Util.Browser.isFirefox() ? WebRTCPeerConnectionConstants.iceConnectionStates.FAILED : WebRTCPeerConnectionConstants.iceConnectionStates.DISCONNECTED, this._reconnectionInterval = MediaCall.BRIDGE.Util.Browser.isFirefox() ? 0 : MediaCallRTCPeerConnectionConstants.defaultReconnectionInterval, this._connectionTimeout = void 0, this._connectionTimeoutInterval = 5e3, this._handler = s, this._processType = MediaCallRTCPeerConnectionConstants.processTypes.INIT, this._turnType = MediaCallRTCPeerConnectionConstants.turnTypes.GEO, this._isCurrentTurnConnected = !1, this._connectionMonitor = void 0
    }
    init(e, t) {
        this._connection = new RTCPeerConnection(this._getConfiguration()), this._bindEventHandlers(), this._avUpStream = e, this._screenUpStream = t, this._addTracksInConnection(), this._addReceiveTransceivers(), this._createOffer()
    }
    connect(e, t, a, i) {
        this._connection = new RTCPeerConnection(this._getConfiguration()), this._bindEventHandlers(), this._remoteSdp = e, void 0 !== t && (this._remoteIceCandidates = t), this._avUpStream = a, this._screenUpStream = i, this._addTracksInConnection(), this._createAnswer()
    }
    _getTurnServerUrls() {
        var e = [];
        return MediaCallRTCPeerConnectionConstants.turnTypes.isGeo(this._turnType) ? $WC.Util.isEmpty(this._turnCredentials.geo_turnurls) ? (e = this._turnCredentials.main_turnurls, this._turnType = MediaCallRTCPeerConnectionConstants.turnTypes.MAIN) : e = this._turnCredentials.geo_turnurls : MediaCallRTCPeerConnectionConstants.turnTypes.isMain(this._turnType) ? e = this._turnCredentials.main_turnurls : MediaCallRTCPeerConnectionConstants.turnTypes.isBackup(this._turnType) && ($WC.Util.isEmpty(this._turnCredentials.backup_turnurls) ? (e = this._turnCredentials.main_turnurls, this._turnType = MediaCallRTCPeerConnectionConstants.turnTypes.MAIN) : e = this._turnCredentials.backup_turnurls), e
    }
    _getConfiguration() {
        if ($WC.Util.isEmpty(this._turnCredentials) || $WC.Util.isEmptyObject(this._turnCredentials)) return {};
        var e = this._getTurnServerUrls(),
            t = this._turnCredentials.username,
            a = this._turnCredentials.credential,
            i = [];
        e.forEach(e => i.push({
            urls: e,
            username: t,
            credential: a
        }));
        var n = {
            iceServers: i
        };
        return MediaCall.BRIDGE.Util.Browser.isFirefox() || (n.iceCandidatePoolSize = 6, n.rtcpMuxPolicy = "require"), n
    }
    _addTracksInConnection() {
        void 0 !== this._avUpStream && (this._addAudioTracksInConnection(), this._addVideoTracksInConnection()), void 0 !== this._screenUpStream && this._addScreenTracksInConnection()
    }
    _addAudioTracksInConnection() {
        this._avUpStream && this._avUpStream._hasAudioTrack() && !this._avUpStream._isAudioRestrictedForConnection() && (this._audioRtpSenders.push(this._connection.addTrack(this._avUpStream._getPrimaryAudioTrack(), this._avUpStream)), this._localTracksMediaId.audio = this._avUpStream.id)
    }
    _addVideoTracksInConnection() {
        this._avUpStream && this._avUpStream._hasVideoTrack() && (this._videoRtpSenders.push(this._connection.addTrack(this._avUpStream._getPrimaryVideoTrack(), this._avUpStream)), this._localTracksMediaId.video = this._avUpStream.id)
    }
    _addScreenTracksInConnection() {
        this._screenUpStream && this._screenUpStream._hasVideoTrack() && (this._screenRtpSenders.push(this._connection.addTrack(this._screenUpStream._getPrimaryVideoTrack(), this._screenUpStream)), this._localTracksMediaId.screen = this._screenUpStream.id, this._screenUpStream._hasAudioTrack() && (this._screenRtpSenders.push(this._connection.addTrack(this._screenUpStream._getPrimaryAudioTrack(), this._screenUpStream)), this._localTracksMediaId.screen_audio = this._screenUpStream.id))
    }
    _removeScreenTracksFromConnection() {
        this._screenRtpSenders && (this._screenRtpSenders.forEach(function(e) {
            delete this._localTracksMediaId.screen, this._localTracksMediaId.screen_audio && delete this._localTracksMediaId.screen_audio, this._connection.removeTrack(e)
        }.bind(this)), this._screenRtpSenders = [])
    }
    _addReceiveTransceivers() {
        this._avUpStream && WebRTCUserMedia.isAudioStreamType(this._avUpStream._getType()) && this._handler.hasRemoteVideo(this._connectionId) && this._connection.addTransceiver(WebRTCUserMedia.getStreamTypeInString(WebRTCUserMedia.streamTypes.VIDEO_ONLY)), this._handler.hasRemoteScreen(this._connectionId) && this._connection.addTransceiver(WebRTCUserMedia.getStreamTypeInString(WebRTCUserMedia.streamTypes.SCREEN))
    }
    _bindEventHandlers() {
        var e = this._connection;
        e.onicecandidate = e => {
            var t = e.candidate;
            if (t) {
                if (this._handler.handleOnIceCandidate(this._connectionId, t, this._reconnectionId > 0), this._localIceCandidates.push(t), this._generatedCandidates.push(t), this.updateCandidateToConnectionMonitor([t]), !this._canUpdateLocalIceCandidates) return;
                this._iceCandidatesGatheringTimer || (this._iceCandidatesGatheringTimer = setTimeout(() => {
                    this._handler.updateIceCandidates(this._connectionId, this._localIceCandidates, this._processType, this._reconnectionId), this._localIceCandidates = [], this._iceCandidatesGatheringTimer = void 0
                }, 100))
            }
        }, e.oniceconnectionstatechange = t => {
            var a = e.iceConnectionState;
            if ("function" == typeof this._handler.handleIceConnectionStateChange && this._handler.handleIceConnectionStateChange(this._connectionId, a), WebRTCPeerConnectionConstants.iceConnectionStates.CONNECTED === a) {
                var i = this._processType;
                this._processType = MediaCallRTCPeerConnectionConstants.processTypes.INIT, this._clearConnectionHandshakeTimeout(), this._clearDisconnectTimeout(), this.clearConnectionTimeout(), this._isCurrentTurnConnected = !0, this._handler.handleConnected(this._connectionId, this._connection, this._hostId, i, this._turnType)
            } else this._reconnectionState === a && (this.clearConnectionTimeout(), this._clearConnectionHandshakeTimeout(), this.setConnectionHandshakeTimeout(), this._clearDisconnectTimeout(), this._setDisconnectTimeout(), this._handler.handleDisconnected(this._connectionId, this._hostId))
        }, e.onicecandidateerror = e => {
            this._handler.handleIceCandidateError(this._connectionId, {
                code: e.errorCode,
                text: e.errorText,
                hostCandidate: e.hostCandidate,
                url: e.url,
                iceConnectionState: this._connection.iceConnectionState,
                iceGatheringState: this._connection.iceGatheringState
            })
        }, e.ontrack = e => this._handler.handleTrack(this._connectionId, e.track, e.streams), e.onicegatheringstatechange = () => this._handler.handleIceGatheringStateChange(this._connectionId, e.iceGatheringState), e.onsignalingstatechange = () => this._handler.handleSignalingStateChange(this._connectionId, e.signalingState)
    }
    async _createOffer(e) {
        var t = {};
        e && (t = {
            offerToReceiveAudio: !0,
            offerToReceiveVideo: !0
        }), "function" == typeof this._handler.isREDCodecNeeded && this._handler.isREDCodecNeeded() ? (this._connection.getTransceivers().forEach(e => {
            this._audioRtpSenders.length > 0 && e.sender && e.sender === this._audioRtpSenders[0] && e.setCodecPreferences(WebRTCUserMedia.Codecs.getUpdatedAudioCodecList(WebRTCUserMedia.Codecs.TYPE.REDCodec))
        }), this._localSdp = await this._connection.createOffer({
            offerToReceiveVideo: !0,
            offerToReceiveAudio: !0,
            voiceActivityDetection: !0,
            iceRestart: !1
        })) : this._localSdp = await this._connection.createOffer(t), this._localSdp = this._mungeSDP(this._localSdp), await this._connection.setLocalDescription(this._localSdp).then(() => this._handler.sendOffer(this._connectionId, this._localSdp, this._processType, this._reconnectionId, this._localTracksMediaId, this._turnType))
    }
    async _createAnswer() {
        await this._connection.setRemoteDescription(this._remoteSdp), this.addRemoteIceCandidates(), this._localSdp = await this._connection.createAnswer(), this._localSdp = this._mungeSDP(this._localSdp), await this._connection.setLocalDescription(this._localSdp), this._handler.sendAnswer(this._connectionId, this._localSdp, this._processType, this._reconnectionId, this._localTracksMediaId), this.updateLocalIceCandidates(), this.startConnectionMonitor()
    }
    _mungeSDP(e) {
        return "function" == typeof this._handler.isREDCodecNeeded && this._handler.isREDCodecNeeded() ? e = {
            type: e.type,
            sdp: e.sdp.replace("useinbandfec=1", "useinbandfec=1;usedtx=1")
        } : "function" == typeof this._handler.isLyraCodecNeeded && this._handler.isLyraCodecNeeded() && (e = AVLyraCodec.modifySDP(e)), e
    }
    _addOrReplaceAudioTrack(e) {
        this._avUpStream = e, 0 !== this._audioRtpSenders.length ? this._audioRtpSenders[0].replaceTrack(e._getPrimaryAudioTrack()).then(() => this._localTracksMediaId.audio = e.id).catch(() => this._renegotiate()) : this._addNewTransceiverAndRenegotiate(this._avUpStream, WebRTCUserMedia.streamTypes.AUDIO_ONLY)
    }
    _addOrReplaceVideoTrack(e) {
        this._avUpStream = e, 0 !== this._videoRtpSenders.length ? this._videoRtpSenders[0].replaceTrack(e._getPrimaryVideoTrack()).then(() => this._localTracksMediaId.video = e.id).catch(() => this._renegotiate()) : this._addNewTransceiverAndRenegotiate(this._avUpStream, WebRTCUserMedia.streamTypes.VIDEO_ONLY)
    }
    _addOrReplaceScreenTrack(e) {
        this._screenUpStream = e;
        let t = e._hasAudioTrack();
        0 !== this._screenRtpSenders.length ? !t || this._screenRtpSenders[1] ? this._screenRtpSenders[0].replaceTrack(e._getPrimaryVideoTrack()).then(() => {
            this._localTracksMediaId.screen = e.id, t && this._screenRtpSenders[1].replaceTrack(e._getPrimaryAudioTrack()).then(this._localTracksMediaId.screen_audio = e.id).catch(() => this._renegotiate())
        }).catch(() => this._renegotiate()) : this._screenRtpSenders[0].replaceTrack(e._getPrimaryVideoTrack()).then(() => {
            this._localTracksMediaId.screen = e.id, this._addNewTransceiverAndRenegotiate(this._screenUpStream, "screen_audio_only")
        }).catch(() => this._renegotiate()) : this._addNewTransceiverAndRenegotiate(this._screenUpStream, WebRTCUserMedia.streamTypes.SCREEN)
    }
    _removeOrReplaceAudioTrack() {
        this._audioRtpSenders.length > 0 && this._audioRtpSenders[0].replaceTrack(null)
    }
    _removeOrReplaceVideoTrack() {
        this._videoRtpSenders.length > 0 && this._videoRtpSenders[0].replaceTrack(null)
    }
    _removeOrReplaceScreenTrack() {
        this._screenRtpSenders.length > 0 && (this._screenRtpSenders[0].replaceTrack(null), this._screenRtpSenders[1] && this._screenRtpSenders[1].replaceTrack(null))
    }
    _addNewTransceiverAndRenegotiate(e, t) {
        return "screen_audio_only" === t ? (this._screenUpStream = e, this._screenRtpSenders.push(this._connection.addTrack(this._screenUpStream._getPrimaryAudioTrack(), this._screenUpStream)), this._localTracksMediaId.screen_audio = this._screenUpStream.id, void this._renegotiate()) : WebRTCUserMedia.isScreenStreamType(t) ? (this._screenUpStream = e, this._addScreenTracksInConnection(), void this._renegotiate()) : (this._avUpStream = e, WebRTCUserMedia.isAudioVideoStreamType(t) ? (this._addAudioTracksInConnection(), this._addVideoTracksInConnection()) : WebRTCUserMedia.isAudioStreamType(t) ? this._addAudioTracksInConnection() : this._addVideoTracksInConnection(), void this._renegotiate())
    }
    _reinit() {
        this._handler.handleReinit(this._connectionId, this._hostId, this._offererId === this._hostId, this._turnType)
    }
    _renegotiate() {
        this._handler.handleRenegotiate(this._connectionId, this._hostId, this._offererId === this._hostId, this._turnType)
    }
    _reconnect() {
        this._reconnectionId++, this._handler.handleReconnect(this._connectionId, this._reconnectionId, this._hostId, this._offererId === this._hostId, this._turnType)
    }
    setConnectionHandshakeTimeout() {
        this._connectionHandshakeTimer || (this._connectionHandshakeTimer = setTimeout(() => this._handler.handleClosed(this._connectionId, this._hostId), 3e4))
    }
    _clearConnectionHandshakeTimeout() {
        clearTimeout(this._connectionHandshakeTimer), this._connectionHandshakeTimer = void 0
    }
    _setDisconnectTimeout() {
        this._disconnectTimer = setTimeout(function() {
            this._reconnect()
        }.bind(this), this._reconnectionInterval)
    }
    _clearDisconnectTimeout() {
        clearTimeout(this._disconnectTimer), this._disconnectTimer = void 0
    }
    _closeConnection() {
        clearTimeout(this._iceCandidatesGatheringTimer), this._iceCandidatesGatheringTimer = void 0, this._connection && (this._connection.close(), this._connection = void 0), this._localSdp = void 0, this._remoteSdp = void 0, this._localIceCandidates = [], this._generatedCandidates = [], this._remoteIceCandidates = [], this._audioRtpSenders = [], this._videoRtpSenders = [], this._screenRtpSenders = [], this._screenAudioRtpSenders = [], this._localTracksMediaId = {}, this._remoteTracksMediaId = {}
    }
    isConnectionStateClosed() {
        return void 0 === this._connection || this._connection.iceConnectionState == WebRTCPeerConnectionConstants.iceConnectionStates.CLOSED
    }
    isIceConnectionStateConnected() {
        return this._connection.iceConnectionState == WebRTCPeerConnectionConstants.iceConnectionStates.CONNECTED
    }
    attachAudioTracks(e) {
        this._addOrReplaceAudioTrack(e)
    }
    detachAudioTracks() {
        this._removeOrReplaceAudioTrack()
    }
    attachVideoTracks(e) {
        this._addOrReplaceVideoTrack(e)
    }
    detachVideoTracks() {
        this._removeOrReplaceVideoTrack()
    }
    attachScreenTracks(e, t) {
        t ? (this._screenUpStream = e, this._addScreenTracksInConnection(), this._renegotiate()) : this._addOrReplaceScreenTrack(e)
    }
    detachScreenTracks(e) {
        e ? (this._removeScreenTracksFromConnection(), this._screenUpStream = void 0, this._renegotiate()) : (this._screenUpStream = void 0, this._removeOrReplaceScreenTrack())
    }
    replaceTracksWithoutNegotiation(e, t) {
        this.replaceTracks(e, t)
    }
    replaceTracks(e, t) {
        this._avUpStream = e, WebRTCUserMedia.isAudioVideoStreamType(t) ? (this.attachAudioTracks(this._avUpStream), this.attachVideoTracks(this._avUpStream)) : WebRTCUserMedia.isAudioStreamType(t) ? this.attachAudioTracks(this._avUpStream) : this.attachVideoTracks(this._avUpStream)
    }
    replaceScreenWithVideo(e) {
        this._avUpStream = e, this._screenUpStream = void 0, this._reinit()
    }
    replaceVideoWithScreen(e, t) {
        this._avUpStream = e, this._screenUpStream = t, this._reinit()
    }
    restartOffererProcess() {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.RESTART, this._closeConnection(), this.switchTurnServers(), this.init(this._avUpStream, this._screenUpStream)
    }
    restartAnswererProcess(e) {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.RESTART, this._closeConnection(), this.connect(e, void 0, this._avUpStream, this._screenUpStream)
    }
    reinitOfferer() {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.REINIT, this._closeConnection(), this.init(this._avUpStream, this._screenUpStream)
    }
    reinitAnswerer(e) {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.REINIT, this._closeConnection(), this.connect(e, void 0, this._avUpStream, this._screenUpStream)
    }
    renegotiateOfferer(e) {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.RENEGOTIATE, this._offererId = this._hostId, this._canUpdateLocalIceCandidates = !1, this._localIceCandidates = [], this._generatedCandidates = [], this._addReceiveTransceivers(), this._createOffer(!e)
    }
    renegotiateAnswerer(e, t) {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.RENEGOTIATE, this._remoteSdp = e, this._offererId = t, this._createAnswer()
    }
    setRemoteSdp(e) {
        this._remoteSdp = e, this._connection.setRemoteDescription(this._remoteSdp), "function" == typeof this._handler.canStartConnectionTimeout && this._handler.canStartConnectionTimeout(this._connectionId) && this.startConnectionTimeout(), this.startConnectionMonitor()
    }
    startConnectionMonitor() {
        if (this._processType === MediaCallRTCPeerConnectionConstants.processTypes.INIT) {
            let e = {
                connectionErrorCB: this._handler.handleConnectionError,
                networkAdapterActionCB: this._handler.handleNetworkAdapterOptimization,
                hasStreamCallback: this._handler.hasStreamCallback
            };
            this._connectionMonitor = new RTCConnectionMonitor(this._connectionId, this._connection, this._generatedCandidates, e), this._connectionMonitor.start(), MediaUtil.BRIDGE.ServerConstants.networkAdapterConfig && this._connectionMonitor.setNetworkAdapterConfiguration(MediaUtil.BRIDGE.ServerConstants.networkAdapterConfig)
        }
    }
    updateCandidateToConnectionMonitor(e) {
        this._connectionMonitor && this._connectionMonitor.updateCandidates([e])
    }
    pushStatsToConnectionMonitor(e) {
        this._connectionMonitor && this._connectionMonitor.pushStats(e)
    }
    getlogsFromConnectionMonitor() {
        if (this._connectionMonitor) return this._connectionMonitor.getOptimizationLogs()
    }
    stopConnectionMonitor() {
        this._connectionMonitor && this._connectionMonitor.stop()
    }
    setRemoteTracksMediaId(e) {
        this._remoteTracksMediaId = e
    }
    setTurnType(e) {
        void 0 !== e && (this._turnType = e)
    }
    switchTurnServers() {
        this._isCurrentTurnConnected ? this._isCurrentTurnConnected = !1 : MediaCallRTCPeerConnectionConstants.turnTypes.isGeo(this._turnType) ? this.setTurnType(MediaCallRTCPeerConnectionConstants.turnTypes.MAIN) : MediaCallRTCPeerConnectionConstants.turnTypes.isMain(this._turnType) ? this.setTurnType(MediaCallRTCPeerConnectionConstants.turnTypes.BACKUP) : this.setTurnType(MediaCallRTCPeerConnectionConstants.turnTypes.GEO)
    }
    updateLocalIceCandidates() {
        this._canUpdateLocalIceCandidates = !0, this._handler.updateIceCandidates(this._connectionId, this._localIceCandidates, this._processType, this._reconnectionId), this._localIceCandidates = []
    }
    addRemoteIceCandidates(e) {
        e && e.forEach(e => this._remoteIceCandidates.push(e)), this._remoteIceCandidates.forEach(e => this._connection.addIceCandidate(new RTCIceCandidate(e))), this._remoteIceCandidates = []
    }
    setBitRate(e, t) {
        var a = t === WebRTCUserMedia.streamTypes.AUDIO_ONLY ? this._audioRtpSenders : t === WebRTCUserMedia.streamTypes.VIDEO_ONLY ? this._videoRtpSenders : this._screenRtpSenders;
        a.length > 0 && a.forEach((function(t) {
            var a = t.getParameters();
            a.encodings || (a.encodings = [{}]), a.encodings[0].maxBitrate = e, t.setParameters(a)
        }))
    }
    resetBitRate(e) {
        var t = e === WebRTCUserMedia.streamTypes.AUDIO_ONLY ? this._audioRtpSenders : e === WebRTCUserMedia.streamTypes.VIDEO_ONLY ? this._videoRtpSenders : this._screenRtpSenders;
        t.length > 0 && t.forEach((function(e) {
            var t = e.getParameters();
            t.encodings && (t.encodings = [{}]), e.setParameters(t)
        }))
    }
    setReconnectionPolicy(e) {
        this._reconnectionState = MediaCall.BRIDGE.Util.Browser.isFirefox() ? WebRTCPeerConnectionConstants.iceConnectionStates.FAILED : e.event, this._reconnectionInterval = MediaCall.BRIDGE.Util.Browser.isFirefox() ? 0 : parseInt(e.interval), this._connectionTimeoutInterval = parseInt(e.connection_timeout)
    }
    startConnectionTimeout() {
        clearTimeout(this._connectionTimeout), this._connectionTimeout = setTimeout(() => {
            void 0 === this._connection || this.isIceConnectionStateConnected() || (this._handler.handleInitialReconnection(this._connectionId, this._turnType, this._getTurnServerUrls(), this._generatedCandidates, this._remoteIceCandidates), this.setConnectionHandshakeTimeout(), this._reconnect())
        }, this._connectionTimeoutInterval)
    }
    clearConnectionTimeout() {
        clearTimeout(this._connectionTimeout), this._connectionTimeout = void 0
    }
    close() {
        this._clearConnectionHandshakeTimeout(), this._clearDisconnectTimeout(), this.clearConnectionTimeout(), this.stopConnectionMonitor(), this._closeConnection()
    }
}
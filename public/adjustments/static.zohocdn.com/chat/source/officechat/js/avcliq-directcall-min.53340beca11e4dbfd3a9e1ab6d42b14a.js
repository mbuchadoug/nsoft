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
                i = t.attr("purpose");
            MediaCallHandler.UIEvents[i](e, t)
        })), e.on("keydown", "[mediacallinput]", (function(e) {
            var t = ZCJQuery(this),
                i = t.attr("inputname");
            13 == e.keyCode && ("rejectTextBox" === i ? MediaCallHandler.UIEvents.sendCustomRejectMessage(e, t) : "adhoccalltitle" === i && MediaCallHandler.UIEvents.ringAllParticipants())
        })), e.on("input", "[mediacallinput]", (function(e) {
            var t = ZCJQuery(this),
                i = t.attr("inputname");
            "rejectTextBox" === i ? MediaCallHandler.UIEvents.handleRejectMessageInput(e, t) : "adhoccalltitle" === i && MediaCallHandler.UIEvents.handleAdhocCallInputs()
        })), e.on("mousemove", "[audiovideowrapper]", (function(e) {
            clearTimeout(MediaCallUI.windowActiveTimeout);
            var t = ZCJQuery(this).addClass("AV-call-window-active");
            MediaCallUI.windowActiveTimeout = setTimeout((function() {
                t.removeClass("AV-call-window-active")
            }), MediaCallUI.windowActiveTimoutDuration)
        })), e.on("change", '[mediacallcheckbox][type="checkbox"]', (function(e) {
            e.stopPropagation();
            var t = ZCJQuery(this),
                i = t.attr("purpose");
            MediaCallHandler.UIToggleEvents[i](e, t)
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
        var i = this.getScreenContainer(e, t);
        if (!i.length) {
            var a = MediaCallTemplates.getScreenVideoContainerHtml(t, MediaCall.BRIDGE.Users.getName(t)),
                n = this.getMediaCallWrapper(e);
            this.switchMainViewCntToSubView(n, e), this.handleSwitchToVideoLayout();
            var s = n.find("[screenvideowrapper]");
            s.addClass("AV-call-subview-2").append(a), i = this.getScreenContainer(e, t), MediaCallHandler.UIEvents.switchView(void 0, s), this.adjustCallContainerHeight(n)
        }
        return i
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
        var i = this.getWhiteBoardContainer(e);
        if (!i.length) {
            var a = MediaCallTemplates.getWhiteBoardContainerHtml("WhiteBoard", t),
                n = this.getMediaCallWrapper(e);
            this.switchMainViewCntToSubView(n, e), this.handleSwitchToVideoLayout();
            var s = n.find("[wbwrapper]");
            s.addClass("AV-call-subview-2").append(a), i.addClass("w100 h90"), MediaCallHandler.UIEvents.switchView(void 0, s), i = this.getWhiteBoardContainer(e), $Util.animateBufferLoader(i.find("[bufferloadercnt]"), 9)
        }
        var r = t && t.hasWhiteBoard() ? t.getCurrentWhiteBoardId() : "",
            o = t && t.hasWhiteBoard() ? WhiteBoard.getBoardURL(r, t.getId()) : "";
        if (o) {
            var l = i.find("iframe")[0];
            l.setAttribute("data-uid", r), l.onload = function() {
                i.find("[bufferloadercnt]").empty(), ZCJQuery(l).removeClass("vsbH"), WhiteBoard.setUpWhiteBoardBridge(l)
            }, l.src = o
        }
        return i
    },
    removeWhiteBoardContainer: function(e) {
        var t = e.getId(),
            i = this.getWhiteBoardContainer(t);
        if (i.length) {
            var a = this.getMediaCallWrapper(t).find("[wbwrapper]");
            MediaCallUI._removeSharedContentContainer(ZCMediaConstants.sharedContentType.WHITEBOARD, e, i, a)
        }
    },
    getPresentationContainer: function(e) {
        return this.getMediaCallWrapper(e).find("#presentation_container")
    },
    addAndGetPresentationContainer: function(e, t) {
        var i = this.getPresentationContainer(e);
        if (!i.length) {
            var a = PresentationUI.getPresentationContainerHtml(t),
                n = this.getMediaCallWrapper(e);
            this.switchMainViewCntToSubView(n, e), this.handleSwitchToVideoLayout(), n.addClass("AV-call-presentation");
            var s = n.find("[presentation_wrapper]");
            s.addClass("AV-call-subview-2").append(a), i.addClass("w100 h90"), MediaCallHandler.UIEvents.switchView(void 0, s), i = this.getPresentationContainer(e), $Util.animateBufferLoader(i.find("[bufferloadercnt]"), 9)
        }
        return i
    },
    removePresentationContainer: function(e) {
        var t = e.getId(),
            i = this.getPresentationContainer(t);
        if (i.length) {
            var a = this.getMediaCallWrapper(t).find("[presentation_wrapper]");
            MediaCallUI._removeSharedContentContainer(ZCMediaConstants.sharedContentType.PRESENTATION, e, i, a)
        }
    },
    removeScreenContainer: function(e, t) {
        var i = e.getId(),
            a = this.getScreenContainer(i, t);
        if (a.length) {
            var n = this.getMediaCallWrapper(i).find("[screenvideowrapper]");
            MediaCallUI._removeSharedContentContainer(ZCMediaConstants.sharedContentType.SCREEN_SHARE, e, a, n)
        }
    },
    _removeSharedContentContainer: function(e, t, i, a) {
        var n = t.getId(),
            s = this.getMediaCallWrapper(n);
        (a.hasClass("AV-call-mainview") ? (MediaCallHandler.UIEvents.switchView(void 0, s.find(".AV-call-subview-2")), a.removeClass("AV-call-subview-2")) : a.hasClass("AV-call-subview") ? (s.find(".AV-call-subview-2").removeClass("AV-call-subview-2").addClass("AV-call-subview"), a.removeClass("AV-call-subview")) : a.hasClass("AV-call-subview-2") && a.removeClass("AV-call-subview-2"), ZCMediaConstants.sharedContentType.SCREEN_SHARE === e ? MediaUtil.removeVideoElemsStreamInContainer(i) : ZCMediaConstants.sharedContentType.WHITEBOARD === e ? (a.removeClass("wh100"), a.find("[videocontainer]").remove()) : ZCMediaConstants.sharedContentType.PRESENTATION === e && (a.find("[videocontainer]").remove(), s.removeClass("AV-call-presentation")), i.remove(), !t.isAudioLayoutRequired() && !t.isScreenShareWithAudioCall() || t.getCurrentMember().hasSwitchedToVideo() || t.getOtherMember().hasSwitchedToVideo()) ? this.switchSubViewCntToMainView(s, n): (MediaCallUI.isInFullScreenView(s) && MediaCallHandler.UIEvents.minimizeWindow(), s.removeClass("AV-call-audiovideo").addClass("AV-call-audio-only").removeAttr("audiovideowrapper"), (i = ZCJQuery("#mediacall_container")).removeResizable(), i.addClass("AV-call-audio-only-wrapper").css("width", ""), i.removeClass("AV-call-audiovideo-wrapper"), this.setContainerPosition(i, this.DETACHED_CONTAINER_ADJUST_WIDTH));
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
        var i = MediaCallTemplates.getAudioInputDevicePickerHtml(t),
            a = MediaCallTemplates.getAudioOutputDevicePickerHtml(t);
        e.find("#audioinputdropdowncnt").replaceWith(i), e.find("#audiooutputdropdowncnt").replaceWith(a)
    },
    showSpeechDetectedInfo: function(e) {
        var t = this.getMediaCallWrapper(e.getId());
        if (0 === t.find("#speech_detected_info").length) {
            var i = t.find('[mediacallbuttons][purpose="turnOnMicrophone"]');
            i.append($WC.template.replace('<div id="speech_detected_info" class="avcliq-helptip dN">{{help_tip}}</div>', {
                $help_tip: ["avcliq.media.speech.detected.info", MediaUtil.getMuteShortCutContent()]
            })), i.append('<span id="speech_detected_ind" class="avcliq-speech-anim"></span>'), t.addClass("zc-av-speech-ind")
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
        var i = this.getMediaCallWrapper(e);
        if (t === MediaCallConstants.states.WAITING_FOR_PERMISSION) i.find("[statuscontent]").text(MediaUtil.getResource("avcliq.media.permission.state.prompt"));
        else if (t === MediaCallConstants.states.RECORDING) {
            var a = $WC.template.replace('<span statusmessage class="zc-av-mR4">{{call_state}}</span><span id="{{recording_timer}}"></span>', {
                recording_timer: ZCMediaRecorderImpl.getRecorderSessionTimerId(e),
                $call_state: "avcliq.media.recording"
            });
            i.find("[statuscontent]").html(a)
        } else t === MediaCallConstants.states.RECORDED && i.find("[statusmessage]").text(MediaUtil.getResource("mediarecorder.recorded"))
    },
    adaptUIToState: function(e, t) {
        var i = this.getMediaCallWrapper(e.getId()),
            a = i.find("[statuscontent]"),
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
            i.find("[incomingcalloptions]").html(s)
        } else if (t === MediaCallConstants.states.RECONNECTING) a = i.find("[topstatuscnt]"), i.addClass("AV-call-topstatus AV-call-reconnect"), n = "videochat.message.reconnect";
        else if (t === MediaCallConstants.states.HANDOFF_IN_PROGRESS) a = i.find("[topstatuscnt]"), i.addClass("AV-call-topstatus"), n = "avcliq.mediacall.state.parking";
        else if (t === MediaCallConstants.states.MIGRATING) i.addClass("AV-call-migrating"), a = i.find("[adhoccallstatus] [statustext]"), n = "avcliq.mediacall.state.migrating";
        else if (t === MediaCallConstants.states.RECORDING_PROCESSING) i.addClass("AV-call-migrating"), a = i.find("[adhoccallstatus] [statustext]"), n = "mediacall.state.recording.initiate";
        else if (t === MediaCallConstants.states.CONNECTED) {
            i.removeClass("AV-call-topstatus AV-call-reconnect"), MediaCallUI.removeRejectMessageDialog(e.getId()), MediaCall.isNetworkIndicatorEnabled() && ZCJQuery("#mediacall_container").addClass("AV-health-meter");
            var r = i.find("[initialcontainer]");
            if (r.length) i.find("[impulsecontainer]").remove(), r.remove(), i.removeClass("AV-call-initial"), e.isVideoLayoutRequired() ? this.handleSwitchToVideoLayout() : (ZCJQuery("#mediacall_container").addClass("AV-call-audio-only-wrapper"), i.addClass("AV-call-audio-only")), e.getCurrentMember().isSharingScreen() && MediaCallUI.handleScreenShareStart(), i.find("[maincontainer]").append(MediaCallTemplates.getOptionsHtml(e)), e.getType() === MediaCallConstants.types.SCREEN_SHARE_WITH_AUDIO && e.isCallee(MediaCall.BRIDGE.Constants.ZUID) && MediaCallHandler.UIEvents.maximizeWindow(), this.isInDetachedView(i) && this.setContainerPosition(i.parent(), this.DETACHED_CONTAINER_ADJUST_WIDTH), this.adjustCallContainerHeight(i)
        }
        var o = i.find("[other-username]");
        $WC.Util.isEmpty(o.text()) && o.text(e.getOtherMember().getName()), $WC.Util.isEmpty(n) || a.text(MediaUtil.getResource(n)), e.isLiveFeedAssociated() && LiveFeedHandler.callEvents.adaptUIToState(e, t)
    },
    updateRecordingState: function(e, t) {
        var i = MediaCallUI.getMediaCallWrapper(e),
            a = i.find("[recording_indicator]");
        "start" === t ? (a.fadeIn(), i.addClass("AV-call-recording")) : a.fadeOut((function() {
            i.removeClass("AV-call-recording")
        }))
    },
    setCallUIInBody: function(e) {
        var t = MediaCall.BRIDGE.Constants.IS_GUEST_USER ? "#guest_chat_main" : "body",
            i = ZCJQuery("#mediacall_container");
        i.length ? (i.addClass("AV-call-detached"), i.attr("detached", "")) : (i = e, void 0 !== MediaCall.BRIDGE && "function" == typeof MediaCall.BRIDGE.handleBodyMount ? MediaCall.BRIDGE.handleBodyMount(i) : ZCJQuery(t).append(i), e = i.find("[mediacallwrapper]")), i.setAsDraggable({
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
        for (var t = this.getViewContainers(e), i = 0; i < t.length; i++) {
            var a = ZCJQuery(t[i]);
            if (this.isInSubView(a)) {
                var n = a.find("[tempvideocontainer]");
                this.isContainerDraggable(n) || n.setAsDraggable(this.getDragCriteriaForSubView()), n.append(this.getVideoOrScreenContainer(a))
            }
        }
    },
    resetFullScreenVideosDraggable: function(e) {
        for (var t = this.getViewContainers(e), i = 0; i < t.length; i++) {
            var a = ZCJQuery(t[i]);
            this.isInSubView(a) && a.append(this.getVideoOrScreenContainer(a.find("[tempvideocontainer]")))
        }
    },
    handleViewSwitch: function(e, t, i) {
        var a = e.find(".AV-call-mainview"),
            n = a.find("[tempvideocontainer]");
        if (n.css(t.find("[tempvideocontainer]").position()), a.removeClass("AV-call-mainview").addClass(i), t.removeClass(i).addClass("AV-call-mainview"), MediaCallUI.isInFullScreenView(e)) {
            t.append(this.getVideoOrScreenContainer(t.find("[tempvideocontainer]"))), MediaCallUI.adjustMainVideoSectionSize(e, !0), this.isContainerDraggable(n) || n.setAsDraggable(this.getDragCriteriaForSubView());
            var s = this.getVideoOrScreenContainer(a);
            s.css({
                height: "",
                width: ""
            }), n.append(s)
        }
    },
    setContainerPosition: function(e, t) {
        var i = e.width(),
            a = e.height();
        t && (i += t);
        var n = e.offset().left,
            s = e.offset().top,
            r = ZCJQuery(window),
            o = r.width(),
            l = r.height();
        n + i > o && e.css("left", o - i), s + a > l && e.css("top", l - a)
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
            var i = ZCJQuery("[mediacallunreadmsgcount]");
            t ? i.text(t).show() : i.hide().empty()
        }
    },
    handleGetMeFront: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = MediaCallImpl.getCurrentSession(),
                i = this.getMediaCallWrapper(t.getId());
            if (0 !== i.length) {
                this.adjustCallContainerHeight(i), t.hasChatId() && e !== t.getChatId() && (MainUI.isChatinViewport(t.getChatId()) || this.isInFullScreenView(i) || this.isInDetachedView(i) || this.setCallUIInBody(i));
                var a = ChatUI.exist[e];
                a && this.handleChatWindowCreated(a)
            }
        }
    },
    handleChatWindowCreated: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = e.chid;
            if (MediaCallImpl.setChatIdForMediaCallSession(t), MediaCallImpl.isValidChatForCurrentSession(t)) {
                var i = this.getMediaCallWrapper(MediaCallImpl.getCurrentSession().getId());
                if (this.isInFullScreenView(i)) {
                    if (ZCJQuery('[mediacallbuttons][purpose="openChatInRHS"]').attr({
                            purpose: "closeChatInRHS",
                            "av-tooltip-title": MediaUtil.getResource("common.hide")
                        }), i.addClass("show-aside"), MediaCallUI.adjustMainVideoSectionSize(i, !0), ZCJQuery("#mediacallchatsection").find("#" + t).length) return void e.focus();
                    MainUI.handleIframes(t);
                    var a = e.win();
                    ZCJQuery("#mediacallchatsection").html(a), this.toggleChatHeaderOptions(t, !0), a.show(), CodeSnippet.handleThemeForAVChat(!0), ZCScroll.customScroll(a.find("#chatbody"), !0), e.getScrollDown(), e.focus()
                }
            }
        }
    },
    toggleChatHeaderOptions: function(e, t) {
        var i = ZCJQuery("#mediacallchatsection").find("#" + e);
        i.length > 0 && ($(i).find("#chataddoptions").toggleClass("denied", t), $(i).find("#chatHeaderDropdown").toggleClass("denied", t))
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
                i = this.getMediaCallWrapper(t).find("#" + t + "dropdowncnt");
            i.length && this.setContainerPositionClass(i)
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
        var i = e.find(".AV-call-mainview, .AV-call-mainview-2").find("[videocontainer]"),
            a = {
                width: "",
                height: ""
            };
        if (t) {
            var n = e.find(".AV-call-mainview"),
                s = n.width(),
                r = n.height(),
                o = ZCMediaConstants.ASPECT_RATIO,
                l = s,
                d = l / o;
            d > r && (l = (d = r) * o), a.width = l, a.height = d, i.css(a)
        } else i.css(a)
    },
    setResizableForMiniPlayer: function(e) {
        var t = MediaUtil.getCriteriaForResize((function(e, t) {
                clearTimeout(MediaCallUI.resizeTimeout), MediaCallUI.resizeTimeout = setTimeout((function() {
                    MediaCallUI.handleResize()
                }), 100)
            })),
            i = e.find(".AV-call-mainview").find("video");
        if (i.length) {
            var a = i[0].getStream();
            a instanceof MediaStream && (t.aspectRatio = a.getAspectRatio() || i[0].getAspectRatio() || ZCMediaConstants.ASPECT_RATIO)
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
                i = t.find("[switchnotifycnt]");
            if (i.length) return i.remove(), ZCJQuery("#mediacall_container").removeClass("AV-call-main-switch-wrapper"), !0;
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
        var i = this.getMediaCallWrapper(t);
        i.length > 0 && (this.deleteMediaContainers(t), i.remove(), ZCJQuery("#mediacall_container").remove()), $WC.$Win.destroy("transfer_direct_call")
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
        var i = this.getMediaCallWrapper(e);
        if (i.length > 0) {
            var a = i.find("[networkindicator]");
            ZCMediaNetworkPredictorImpl.isPoorNetwork(t) ? (a.removeClass("zc-av-dN"), MediaCallImpl.trackPoorNetworkShown(e)) : a.addClass("zc-av-dN")
        }
    },
    hideBeforeCallNetworkInfo: function(e) {
        var t = this.getMediaCallWrapper(e).find("[networkindicator]");
        t.length > 0 && t.addClass("zc-av-dN")
    },
    updateNetworkHealthMeter: function(e, t, i, a, n) {
        var s = 0;
        if (t instanceof MediaStream) {
            if (t._hasVideoTrack() && !i.isVideoMuted() && MediaCallImpl.isValidNetworkScore(n)) s = n;
            else {
                if (!t._hasAudioTrack() || i.isAudioMuted() || !MediaCallImpl.isValidNetworkScore(a)) return;
                s = a
            }
            var r = MediaCallConstants.networkHealth.getScore(s),
                o = this.getMediaCallWrapper(e).find('[network_health_indicator][userId="' + i.getId() + '"]');
            MediaUtil.updateNetworkHealth(r, o)
        }
    },
    handleEnd: function(e, t) {
        var i = e.getId(),
            a = this.getMediaCallWrapper(i);
        if (MediaCall.BRIDGE && MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleCallEnd && MediaCall.BRIDGE.listener.handleCallEnd(e.getDetails()), t && "undefined" != typeof ZCMediaRecorder && ZCMediaRecorder.isVoiceNoteOnCallEndEnabled()) return e.isVideoCall() && MediaCallUI.getVideoContainer(i, e.getCurrentMemberId()).find("video").addClass("dN zc-av-dN"), a.parents("#mediacall_container").attr("id", "mediacallendwrapper"), a.find("[impulsecontainer]").remove(), a.find("[calloptions]").replaceWith(MediaCallTemplates.getEndOptionsHtml(e, !0)), void MediaCallUI.addEndCallTimer(i);
        e.isCallAnswered() && (MediaCallImpl.hasActiveAdhocCall(e) || ZCMediaFeedback.checkAndshow(i, e.getType(), void 0, {
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
        var i = t.find("#mute_banner_container"),
            a = MediaTemplates.getAudioMuteInfo(MediaTemplates.getMuteBannerContent(!1));
        0 === i.length ? i.append(a) : i.html(a)
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
    handleAVStateForHandoff: function(e, t, i, a) {
        var n = e.getCurrentMember();
        t && (n.setAsSwitchedToVideo(), e.getOtherMember().setAsSwitchedToVideo()), i && (MediaCallUI.getVideoContainer(e.getId(), n.getId()).find("[audioMutedStatus]").removeClass("dN zc-av-dN"), n.updateAVStatus("audio", !0, MediaCall.BRIDGE.Util.getSyncedCurrentTime())), a && (MediaCallUI.getVideoContainer(e.getId(), n.getId()).find("video").addClass("dN zc-av-dN"), n.updateAVStatus("video", !0, MediaCall.BRIDGE.Util.getSyncedCurrentTime()))
    },
    answerCall: function(e, t, i) {
        MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.INCOMING), MediaCall.BRIDGE.handleTitleRevert();
        var a = MediaCallImpl.getFromIncomingSessions(e);
        MediaCallUI.removeRejectMessageDialog(e), void 0 !== a && (a.writeToLog(CallLogConstants.ui.answer), a.addLongPollingController(), a.isVideoCall() && "audio" === t && a.getCurrentMember().setVideoCallWithoutVideo(), MediaCall.initiateCallProcess(a, ZCMediaConstants.triggerSource.CALL_INCOMING_UI, i, i)), "undefined" != typeof CallHistoryData && CallHistoryData.markOngoingCallAsViewed(e)
    },
    removeCallSettings: function() {
        var e = MediaCallImpl.getCurrentSession();
        $WC.$Win.destroy("av_settings_win");
        var t = void 0 !== MediaCall.BRIDGE ? MediaCall.BRIDGE.getZIndex() : "";
        ZCJQuery("#zcwindows").css("z-index", t), e && MediaUtil.clearAudioPreview(e)
    },
    setDeviceInfoIndicationInCallUI: function(e, t, i) {
        t.getClientType() !== i && (i === ZCMediaConstants.clientTypes.WEB || i === ZCMediaConstants.clientTypes.DESKTOP ? e.find("[deviceinfo]").addClass("zcf-system").removeClass("zcf-mobile").attr({
            title: MediaUtil.getResource("avcliq.media.deviceinfo.web")
        }) : i === ZCMediaConstants.clientTypes.MOBILE && e.find("[deviceinfo]").addClass("zcf-mobile").removeClass("zcf-system").attr({
            title: MediaUtil.getResource("avcliq.media.deviceinfo.mobile")
        })), t.setClientType(i)
    },
    clearActionsOnSettingsTabSwitch: function(e) {
        e && (e.clearVideoEffectsPreview(), e.handleConnectionStatsTabClose(), MediaUtil.clearAudioPreview(e))
    },
    pipUtil: {
        paintVideosForPIP: function(e) {
            var t = e.getCanvasForPIP(),
                i = t.getContext("2d"),
                a = e.getId(),
                n = MediaCallUI.getMediaCallWrapper(a),
                s = MediaCallUI.isInAudioLayout(n),
                r = e.getCurrentMember(),
                o = e.getOtherMember(),
                l = MediaCallUI.getVideoContainer(a, r.getId()),
                d = MediaCallUI.getVideoContainer(a, o.getId()),
                c = void 0,
                C = e.isVideoCall() || e.getCurrentMember().hasSwitchedToVideo() && e.getOtherMember().hasSwitchedToVideo() || e.getOtherMember().isSharingScreen();
            ZCPIPUtil.applyCanvasDimension(i, C ? ZCMediaConstants.pip.videoWinDimension : ZCMediaConstants.pip.audioWinDimension);
            var u = new AVCliqDimensions(0, 0, t.width, t.height);
            if (ZCPIPUtil.paintMainBackground(i, u), o.isSharingScreen()) {
                var h = t.width / 3,
                    p = o.hasSwitchedToVideo() && !s,
                    m = p ? t.width - h : t.width;
                if (c = MediaCallUI.getScreenContainer(a, o.getId()), u.alterMeasurements(m, t.height), ZCPIPUtil.paintEachVideoInPIP(i, c, {
                        muted: !1,
                        mirror: !1
                    }, u.clone()), p) {
                    u.alterMeasurements(h, t.height), u.moveAxis(m, 0);
                    var g = MediaCall.BRIDGE.Users.getName(d.attr("userid")),
                        I = {
                            muted: o.isVideoMuted(),
                            mirror: !1,
                            name: g,
                            userId: d.attr("userid")
                        };
                    ZCPIPUtil.paintEachVideoInPIP(i, d, I, u.clone())
                }
            } else {
                if (e.isVideoCall() || r.hasSwitchedToVideo() && o.hasSwitchedToVideo()) {
                    var _ = MediaCall.BRIDGE.Users.getName(l.attr("userid")),
                        v = {
                            muted: r.isVideoMuted(),
                            mirror: ZCMediaPreferences.isRotateVideoEnabledByUser(),
                            name: _,
                            userId: l.attr("userid")
                        };
                    u.alterMeasurements(t.width / 2, t.height), ZCPIPUtil.paintEachVideoInPIP(i, l, v, u.clone());
                    var f = MediaCall.BRIDGE.Users.getName(d.attr("userid")),
                        M = {
                            muted: o.isVideoMuted(),
                            mirror: !1,
                            name: f,
                            userId: d.attr("userid")
                        };
                    u.moveAxis(t.width / 2, 0), ZCPIPUtil.paintEachVideoInPIP(i, d, M, u.clone())
                } else {
                    if (s) return void this.paintAudioLayoutforPIP(i, t, e);
                    var S = o,
                        T = !1;
                    r.hasSwitchedToVideo() && (S = r, T = !0);
                    var A = MediaCallUI.getVideoContainer(a, S.getId()),
                        R = A.attr("userid");
                    I = {
                        muted: S.isVideoMuted(),
                        mirror: T,
                        name: MediaCall.BRIDGE.Users.getName(R),
                        userId: R
                    };
                    u.alterMeasurements(t.width, t.height), ZCPIPUtil.paintEachVideoInPIP(i, A, I, u.clone())
                }
            }
        },
        paintAudioLayoutforPIP: function(e, t, i) {
            var a = i.getOtherMember(),
                n = MediaCall.BRIDGE.Users.getName(a.getId(), a.getName()),
                s = ZCJQuery("#mediacallsessiontimer"),
                r = s.find("[hours]").text(),
                o = s.find("[minutes]").text(),
                l = s.find("[seconds]").text(),
                d = parseInt(r) > 0,
                c = (d ? r + ":" : "") + o + ":" + l,
                C = new AVCliqDimensions(0, 0, t.width, t.height),
                u = MediaUtil.isAVLibraryLoadedInChatbar();
            C.alterMeasurements(t.width, 70), ZCPIPUtil.paintBackground(e, "rgba(0,0,0,0.4)", C), C.moveAxis(25, 50), ZCPIPUtil.drawText(e, ZCPIPUtil.getIconContent(a.getClientType(), u), C, {
                font: `33px ${u?"ZoFo-AVcall":"ZoFo-ChatBar-v2"}`
            }), C.moveAxis(50, -5), ZCPIPUtil.drawText(e, n, C, {
                maxWidth: t.width / 2,
                font: "27px Lato, sans-serif"
            });
            var h = d ? 120 : 80;
            C.moveAxis(t.width - (h + 130), 0), ZCPIPUtil.drawText(e, c, C, {
                font: "30px Lato, sans-serif"
            }), C.resetAxis(), C.moveAxis(t.width / 2, t.height / 2), ZCPIPUtil.drawUserImage(e, a.getId(), n, C, 100)
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
    renegotiateForUnmute: function(e, t, i, a) {
        var n = MediaCallImpl.getCurrentSession();
        if (n || n.getId() === e) {
            var s = n.getCurrentMember().getAVUpStream(),
                r = function(e, t) {
                    MediaManager.resetStreamRequested(), void 0 !== e && MediaManager.handleMediaError(e, t), void 0 !== a && a(e, t)
                },
                o = function(e) {
                    MediaManager.resetStreamRequested(), MediaCallImpl.hasCurrentSession() ? i(e) : WebRTCUserMedia.closeStream(e._getType())
                };
            void 0 === s ? t === WebRTCUserMedia.streamTypes.AUDIO_ONLY ? WebRTCUserMedia.requestAudioStream(o, r, void 0, MediaUtil.getAudioProcessingOptions(n)) : t === WebRTCUserMedia.streamTypes.VIDEO_ONLY && WebRTCUserMedia.requestVideoStream(o, r, void 0, MediaUtil.getVideoProcessingOptions(n)) : WebRTCUserMedia.requestAndAddTrackInStream(s, t, o, r, MediaUtil.getStreamProcessingOptions(n)), MediaManager.setAsStreamRequested(t, ZCMediaConstants.mediaModules.DIRECT_CALL)
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
    requestScreenStream: function(e, t, i) {
        WebRTCUserMedia.requestScreenStream(e, t, i, MediaManager.getComputerAudioConstraints(), void 0, void 0, !0), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.SCREEN, ZCMediaConstants.mediaModules.DIRECT_CALL)
    },
    requestAVStream: function(e, t, i) {
        "audio" === e ? (WebRTCUserMedia.requestAudioStream(t, i, void 0, MediaUtil.getAudioProcessingOptions()), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL)) : "video" === e ? (WebRTCUserMedia.requestVideoStream(t, i, void 0, MediaUtil.getVideoProcessingOptions()), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.VIDEO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL)) : "audio_video" === e && (WebRTCUserMedia.requestAudioVideoStream(t, (function(e, a) {
            MediaManager.resetStreamRequested(), WebRTCUserMedia.requestAudioStream(t, i, void 0, MediaUtil.getAudioProcessingOptions()), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL)
        }), void 0, MediaUtil.getStreamProcessingOptions()), MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.AUDIO_VIDEO, ZCMediaConstants.mediaModules.DIRECT_CALL))
    },
    requestStreamForMediaCall: function(e, t, i, a, n) {
        var s = function(e, t) {
                MediaManager.resetStreamRequested(), i(e, t)
            },
            r = function(e, t) {
                MediaManager.resetStreamRequested(), a(e, t)
            };
        t ? this.requestScreenStream((function(t) {
            MediaManager.resetStreamRequested(), e ? MediaCallImpl.requestAVStream(e, (function(e) {
                s(e, t)
            }), (function() {
                s(void 0, t)
            })) : s(void 0, t)
        }), r, n) : MediaCallImpl.requestAVStream(e, s, r)
    },
    openDeviceSettings: function(e, t, i, a, n) {
        var s = void 0 !== MediaCall.BRIDGE ? MediaCall.BRIDGE.getZIndex() : "1000";
        s = isNaN(s) ? s : parseInt(s) + 1, ZCJQuery("#zcwindows").css("z-index", s);
        var r = ZCDirectCallDialogs.getSettingsWin();
        r.removeClass("zc-av-dN"), r.find("[settingstab]").removeClass("active"), r.find("#av-devicesetting-lhs").addClass("active");
        var o = MediaCallImpl.getCurrentSession();
        MediaCallUI.clearActionsOnSettingsTabSwitch(o);
        var l = MediaDeviceWidget.getCurrentConfig(t, i, a, n);
        r.find("#av_settings_body").html(MediaCallTemplates.getDeviceSettingsHtml(o, e, l));
        var d = o.getCurrentMember().getAVUpStream();
        d && d._hasVideoTrack() && MediaUtil.setAndPlayStreamInMediaContainer(ZCJQuery("#av_settings_preview"), d, !0)
    },
    generateTitleForRecording: function(e) {
        var t = e.getCallerName() + "-" + e.getCalleeName() + "-" + $Date.getDateFieldString(new Date);
        if (t.length > ZCMediaConstants.MAX_TITLE_LENGTH) {
            var i = ZCMediaConstants.MAX_TITLE_LENGTH - 4;
            t = t.substring(0, i) + "..."
        }
        return MediaUtil.isValidTitle(t) ? t : MediaCall.BRIDGE.Resource.getRealValue("avcliq.media.recording") + "-" + $Date.getDateFieldString(new Date)
    },
    showMediaDeviceSettings: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = MediaCallImpl.getCurrentSession();
            if (t.writeToLog(CallLogConstants.ui.setMediaDevice), t.getId() === e) {
                Clickoutside.handleClickOnChild(event), MediaCallUI.clearActionsOnSettingsTabSwitch(t);
                var i = t.getCurrentMember(),
                    a = i.getAVUpStream();
                if (t.isMigratedForRecording()) {
                    var n = ZCSmartConferenceImpl.getCurrentActiveSession();
                    a = n.hasVideoUpStream() ? n.getVideoUpStream() : n.hasAudioUpStream() ? n.getAudioUpStream() : void 0
                }
                var s = {},
                    r = void 0,
                    o = MediaCallUI.getVideoContainer(e, t.getOtherMemberId()).find("video"),
                    l = 0 !== o.length;
                l && (r = o[0]), s.handleCustomUI = function(e, t, i, a, n) {
                    MediaCallImpl.openDeviceSettings(e, t, i, a, n)
                }, WebRTCUserMedia.isSetSinkIdSupported() && (s[ZCMediaDevices.kinds.AUDIO_OUTPUT] = l), t.isAudioCall() && !i.hasSwitchedToVideo() && (s[ZCMediaDevices.kinds.VIDEO_INPUT] = !1);
                MediaDeviceWidget.show((function(e) {
                    if (MediaCallImpl.hasCurrentSession() && (t.writeToLog(CallLogConstants.ui.changedDevice, e), !$WC.Util.isEmptyObject(e)))
                        if (ZCMediaDevices.setPreferredDevices(e, !0), t.isMigratedForRecording()) AdhocCallBridge.publish(t, "setMediaDevices", {
                            associatedSessionId: t.getAssociatedConferenceId(),
                            changedDevices: e
                        });
                        else if (e[ZCMediaDevices.kinds.AUDIO_OUTPUT] && MediaManager.setPreferredAudioOutput([r]), (e[ZCMediaDevices.kinds.AUDIO_INPUT] || e[ZCMediaDevices.kinds.VIDEO_INPUT]) && a) {
                        var n = WebRTCUserMedia.streamTypes.AUDIO_ONLY;
                        e[ZCMediaDevices.kinds.AUDIO_INPUT] && e[ZCMediaDevices.kinds.VIDEO_INPUT] ? n = WebRTCUserMedia.streamTypes.AUDIO_VIDEO : e[ZCMediaDevices.kinds.VIDEO_INPUT] && (n = WebRTCUserMedia.streamTypes.VIDEO_ONLY);
                        var s = a && a._hasAudioTrack() && a._isAudioRestrictedForConnection();
                        t.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.init + n), WebRTCUserMedia.requestAndReplaceTracksInStream(a, n, (function(e) {
                            MediaCallImpl.hasCurrentSession() ? (s && e._setConnectionRestrictionForAudio(), t.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.success), i.replaceTracksInStream(e, n), i.setUpdatedAVStatus()) : WebRTCUserMedia.closeStream(e._getType())
                        }), void 0, void 0, MediaUtil.getStreamProcessingOptions(t))
                    }
                }), s, a, a, r, (function() {
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
        var i = MediaCallImpl.getCurrentSession();
        i && ZCMediaUtil.switchToAvailableTrackForTrackEnd(e, t, i.getCurrentMember().getAVUpStream(), i, {
            successCB: (t, i) => {
                var a = MediaCallImpl.getCurrentSession();
                a ? (MediaManager.checkAndShowMicSwitchedInfo(t, i, !1), a.writeToLog(CallLogConstants.trackEnd.event), a.getCurrentMember().replaceTracksInStream(t, WebRTCUserMedia.streamTypes.AUDIO_ONLY), a.getCurrentMember().setUpdatedAVStatus(), e && e.currentTarget && e.currentTarget.label && a.writeToLog(CallLogConstants.trackEnd.device, e.currentTarget.label), MediaCallImpl.reApplyAudioOutputPreference(a)) : WebRTCUserMedia.closeStream(t._getType())
            },
            failureCB: () => {
                var e = MediaCallImpl.getCurrentSession();
                if (e) {
                    var t = ZCMediaPreferences.isSpeechDetectionAllowedByUser(),
                        i = e.getAVUpStream();
                    t && i && WebRTCUserMedia.closeStream(i._getType()), MediaCallImpl.handleMute(e.getId(), ZCMediaConstants.muteCases.trackEnd), MediaCallTemplates.showTrackEndedInfo(), MediaCallImpl.reApplyAudioOutputPreference(e)
                }
            },
            hasCurrentSession: () => MediaCallImpl.hasCurrentSession()
        })
    },
    handleRecordingAction: function(e) {
        if (MediaCallImpl.hasCurrentSession()) {
            var t = MediaCallImpl.getCurrentSession(),
                i = t.getCallConversionDetails();
            AdhocCallBridge.publish(t, "addUsers", {
                title: i.title,
                selectedList: i.userIds,
                recordingIndex: t.getCurrentMember().getRecordingReferenceIndex(),
                associatedSessionId: t.getAssociatedConferenceId(),
                recordingAction: e
            }), t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), MediaCallUI.adaptUIToState(t, MediaCallConstants.states.MIGRATING), t.resetDetailsForCallConversion()
        }
    },
    analyseAudioLoss: function(e, t) {
        var i = e.getCurrentMember().isAudioMuted() || e.getOtherMember().isAudioMuted();
        if (t) {
            var a = t.downstreamStrength,
                n = t.upstreamStrength;
            !i && a.rttScore > 7 && (n.audioPacketsSentScore > 7 || n.audioBytesSentScore > 7) && e.setAsInitialAudioLoss()
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
            var i = e[t];
            if (i.isInCallRequestedState()) return i
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
        var i = {
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
        return MediaCall.BRIDGE.Util.Browser.isChrome() || MediaCall.BRIDGE.Util.Browser.isSafari() || MediaCall.BRIDGE.Util.Browser.isOpera() ? WebRTCUserMedia.isDisplayMediaSupported() || (i = {
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
        }) : MediaCall.BRIDGE.Util.Browser.isFirefox() && (i.perfect_renegotiation = !1), MediaCall.isNewRTCConnectionEnabled() && (i.new_rtc_connection_support = !0), i
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
                i = t.getCurrentMember(),
                a = i.isAudioMuted();
            if (e || MediaCallUI.closeSpeechDetectedInfo(t), a)
                if (e) {
                    if (i.getAVUpStream()) return;
                    if (!MediaManager.isCustomRequestPending(ZCSmartConferenceConstants.requests.requestAudioStreamForSpeechDetection)) {
                        MediaManager.setCustomRequestAsPending(ZCSmartConferenceConstants.requests.requestAudioStreamForSpeechDetection), WebRTCUserMedia.requestAudioStream((function(e) {
                            MediaManager.setCustomRequestAsCompleted(ZCSmartConferenceConstants.requests.requestAudioStreamForSpeechDetection), MediaCallImpl.getCurrentSession() ? (i.setAVUpStream(e), MediaCallImpl.handleAVStatusChange("audio", !0)) : WebRTCUserMedia.closeStream(e._getType())
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
                var i = ChatUI.exist[e];
                if (i && i.isOnetoOneChat()) {
                    var a = Participants.get(i.chid);
                    if (!a || $WC.Util.isEmpty(a.getRecipientFor121Chat())) {
                        var n = ConversationsList.get(i.chid);
                        if (void 0 !== n) {
                            var s = ConversationsList.getRecipantFor121FromRecipants(n);
                            s && s.zuid === t.getOtherMemberId() && t.setChatId(i.chid)
                        }
                    } else a.getRecipientFor121Chat() === t.getOtherMemberId() && t.setChatId(i.chid)
                }
            }
        }
    },
    getRecipiantChatIdIfOpen: function(e) {
        return "function" == typeof MediaCall.BRIDGE.getOneToOneChatId ? MediaCall.BRIDGE.getOneToOneChatId(e) : void 0
    },
    filterRelayCandidates: function(e) {
        for (var t = [], i = 0; i < e.length; i++) "relay" === new RTCIceCandidate(e[i]).type && t.push(e[i]);
        return t
    },
    hasTurnCandidates: function(e) {
        for (var t = 0; t < e.length; t++) {
            var i = new RTCIceCandidate(e[t]);
            if ("relay" === i.type || "srflx" === i.type || "prflx" === i.type) return !0
        }
        return !1
    },
    startCall: function(e) {
        e.addNetworkPredictor(), e.writeToLog(CallLogConstants.callInit), MediaCallUI.adaptUIToState(e, MediaCallConstants.states.INITIATING), e.getCurrentMember().setClientSupport(MediaCallImpl.getClientSupport());
        var t = function(t) {
                if (this.hasOutgoingSession()) {
                    e.writeToLog(CallLogConstants.startCallAPI.success, t);
                    var i = new MediaCallSession(t);
                    e.getNetworkPredictor().updateId(i.getId()), i.setNetworkPredictor(e.getNetworkPredictor());
                    var a = MediaCallUI.getMediaCallWrapper(e.getId());
                    a.attr("callId", t.call_id);
                    var n = a.find("[other-username]");
                    if ($WC.Util.isEmpty(n.text()) && n.text(t.callee_name), e.isLiveFeedAssociated()) {
                        var s = e.getAssociatedLiveFeedId();
                        i.setAssociatedLiveFeedId(s);
                        var r = LiveFeedImpl.getIncomingFeedSession(s);
                        r && r.setAssociatedCallId(i.getId())
                    }
                    var o = e.getCurrentMember(),
                        l = i.getCurrentMember();
                    l.setAVUpStream(o.getAVUpStream()), l.setScreenUpStream(o.getScreenUpStream()), l.setClientSupport(MediaCallImpl.getClientSupport()), o.isScreenShareWithoutAudio() && l.setScreenShareWithoutAudio(), MediaCallUI.adaptUIToState(i, MediaCallConstants.states.CALLING), MediaCallImpl.playTone(i, MediaCallConstants.states.RINGING), this.setCurrentSession(i), i.setLogString(e.getLogString()), this.clearOutgoingSession(), i.startCall()
                } else MediaCallAPI.cancelCall(t.call_id)
            }.bind(this),
            i = function(t) {
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
            a = {
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
        MediaCall.isNewRTCConnectionEnabled() && (a.new_rtc_connection_support = e.getCurrentMember().isNewRTCConnectionSupported());
        var n = {
            type: e.getType(),
            client_support: JSON.stringify(a)
        };
        e.getCurrentMember().isScreenShareWithoutAudio() && (n.audio = JSON.stringify({
            muted: !0,
            time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
        })), e.writeToLog(CallLogConstants.clentSupport, a), e.writeToLog(CallLogConstants.startCallAPI.init), MediaCallAPI.startCall(e.getCalleeId(), e.getMultipleCallsHandlingType(), n, t, i)
    },
    answerCall: function(e) {
        e.setEventTime("CALL_UI_ANSWERED", MediaCall.BRIDGE.Util.getSyncedCurrentTime()), MediaCallUI.adaptUIToState(e, MediaCallConstants.states.CONNECTING), this.setCurrentSession(e), this.removeFromIncomingSessions(e.getId()), e.answerCall()
    },
    startCallHandOff: function(e) {
        this.setCurrentSession(e), this.clearHandingOffSession(), e.startCallHandOff()
    },
    connectCallHandOff: function(e, t) {
        var i = MediaCallImpl.getCurrentSession();
        i && i.getId() === e.data.call_id && (MediaCallUI.adaptUIToState(i, MediaCallConstants.states.HANDOFF_IN_PROGRESS), i.connectCallHandOff(t))
    },
    handleUnmute: function(e, t) {
        var i = MediaCallImpl.getCurrentSession();
        if (i && i.getId() === e) {
            if (i.isMigratedForRecording()) return AdhocCallBridge.publish(i, "audioUnMute", {
                associatedSessionId: i.getAssociatedConferenceId()
            }), !0;
            i.writeToLog(CallLogConstants.ui.micOn, {
                muteCase: t
            });
            var a = function(e) {
                MediaCallUI.unmuteAudio(i), MediaCallImpl.handleAVStatusChange("audio", !1), e && i.getCurrentMember().replaceAVUpStreamTrack(e, WebRTCUserMedia.streamTypes.AUDIO_ONLY)
            };
            return ZCMediaPreferences.isSpeechDetectionAllowedByUser() ? (MediaCallUI.closeSpeechDetectedInfo(i), a(i.getCurrentMember().getAVUpStream())) : MediaCallImpl.renegotiateForUnmute(e, WebRTCUserMedia.streamTypes.AUDIO_ONLY, a), !0
        }
    },
    handleMute: function(e, t) {
        var i = MediaCallImpl.getCurrentSession();
        if (i && i.getId() === e) return i.isMigratedForRecording() ? (AdhocCallBridge.publish(i, "audioMute", {
            associatedSessionId: i.getAssociatedConferenceId()
        }), !0) : (i.writeToLog(CallLogConstants.ui.micOff, {
            muteCase: t
        }), MediaCallUI.muteAudio(i), MediaCallImpl.handleAVStatusChange("audio", !0), !0)
    },
    handleVideoUnMute: function(e, t) {
        var i = MediaCallImpl.getCurrentSession();
        if (i && i.getId() === e) {
            if (i.isMigratedForRecording()) return void AdhocCallBridge.publish(i, "videoUnMute", {
                associatedSessionId: i.getAssociatedConferenceId()
            });
            i.writeToLog(CallLogConstants.ui.camOn, {
                muteCase: t
            });
            MediaCallImpl.renegotiateForUnmute(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY, (function(e) {
                if (MediaCallUI.unmuteVideo(i), MediaCallImpl.handleAVStatusChange("video", !1), i.getCurrentMember().replaceAVUpStreamTrack(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY), ZCDirectCallDialogs.isSettingsWinExist()) {
                    var t = ZCDirectCallDialogs.getSettingsWin();
                    t.find("video")[0].hasStream() || (i.clearVideoEffectsPreview(), MediaUtil.setAndPlayStreamInMediaContainer(t, e, !0))
                }
            }))
        }
    },
    handleVideoMute: function(e, t) {
        var i = MediaCallImpl.getCurrentSession();
        if (i && i.getId() === e) {
            if (i.isMigratedForRecording()) return void AdhocCallBridge.publish(i, "videoMute", {
                associatedSessionId: i.getAssociatedConferenceId()
            });
            i.writeToLog(CallLogConstants.ui.camOff, {
                muteCase: t
            }), MediaCallUI.muteVideo(i), MediaCallImpl.handleAVStatusChange("video", !0)
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
                var i = MediaCall.isVideoCall(t.type),
                    a = WmsImpl.isLocalUser(t.caller_id) ? t.callee_name : t.caller_name;
                MediaCallImpl.storeHandoffCallDetails(t), $WC.$Dlg.create({
                    id: "transfer_direct_call",
                    version: 3,
                    class: "zcl-alert-dialog-2 smartconf-transfercall-modal",
                    headerhtml: MediaTemplates.getTransferPanelHeaderHtml(i, a),
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
    checkAndHandoffMediaSession: function(e, t, i, a) {
        MediaManager.handleExistingSessions((function() {
            MediaCallAPI.handOffCall(e, "complete_handoff", (function(e) {
                MediaCallImpl.hasHandingOffSession() && MediaCallImpl.getHandingOffSession().updateCallDetails(e)
            }), (function() {
                MediaCallImpl.handleEnd(e, !1)
            }));
            var n = new MediaCallSession({
                call_id: e,
                type: t,
                caller_id: i,
                callee_id: a,
                status_text: MediaCallConstants.statusText.CALL_HANDOFF_IN_PROGRESS
            });
            MediaCallImpl.setHandingOffSession(n), MediaCallUI.showCallUI(n), $WC.$Win.destroy("transfer_direct_call"), MediaCallImpl.clearHandoffCallDetails()
        }))
    },
    checkAndHandoffMigratedMediaSession: function(e, t, i) {
        MediaManager.handleExistingSessions((function() {
            var a = new MediaCallSession({
                call_id: e,
                type: i.type,
                caller_id: i.caller_id,
                callee_id: i.callee_id,
                status_text: MediaCallConstants.statusText.CALL_HANDOFF_IN_PROGRESS
            });
            a.updateCallDetails(i), a.setAssociatedConferenceId(t), a.setStartTime(i.start_time), a.resetInitialConnection(), a.setAsMigratedForRecording(), i.recording_index && a.getCurrentMember().setRecordingReferenceIndex(i.recording_index), MediaCallImpl.setHandingOffSession(a), MediaCallUI.showCallUI(a), $WC.$Win.destroy("transfer_direct_call"), MediaCallImpl.clearHandoffCallDetails(), MediaCallImpl.canPerformSilentJoin(i) && Conference.join(t, ZCMediaConstants.triggerSource.CONVERTED_CALL, () => {
                MediaCallImpl.setCurrentSession(MediaCallImpl.getHandingOffSession()), MediaCallImpl.clearHandingOffSession()
            }, void 0, !0)
        }))
    },
    checkAndHandleAdhocCallConnected: function(e, t) {
        var i = MediaCallImpl.getCurrentSession();
        i && i.isHandOffInProgress() && i.getAssociatedConferenceId() === t && (AdhocCallBridge.attach(i), MediaCallHandler.peerConnectionEvents.handleConnected(e), i.setStatusText(MediaCallConstants.statusText.CALL_MIGRATED), i.getCurrentMember().isRecording() && MediaCallUI.updateRecordingState(e, "start"))
    },
    switchToPIPMode: function(e) {
        if (!e.isInPIP()) {
            var t = e.getId(),
                i = e.isVideoCall() || e.getCurrentMember().hasSwitchedToVideo() && e.getOtherMember().hasSwitchedToVideo() || e.getOtherMember().isSharingScreen();
            ZCPIPManager.paintCanvasAndOpenPip(e.getCanvasForPIP(), i ? ZCMediaConstants.pip.videoWinDimension : ZCMediaConstants.pip.audioWinDimension, (function() {
                var e = MediaCallImpl.getCurrentSession();
                e && e.getId() === t && MediaCallUI.pipUtil.paintVideosForPIP(e)
            }), (function() {
                var e = MediaCallImpl.getCurrentSession();
                if (e && e.getId() === t) {
                    var i = MediaCallUI.getMediaCallWrapper(t),
                        a = ZCJQuery("#mediacall_container"),
                        n = i.find('[mediacallbuttons][purpose="openInPIP"]');
                    n.addClass("active"), n.attr({
                        purpose: "exitPIP",
                        "av-tooltip-title": MediaUtil.getResource("avcliq.media.exit.pip")
                    }), ZCPIPUtil.showPIPOverlay(i.find("[maincontainer]"), "mediacallbuttons"), a.addClass("avcall-pip-mode"), MediaCallHandler.UIEvents.minimizeWindow(), MediaCallUI.resetResizableForMiniPlayer(a)
                } else ZCPIPManager.exitPictureInPicture()
            }), MediaCallHandler.PIPEvents)
        }
    },
    exitFromPIPMode: function(e) {
        ZCPIPManager.exitPictureInPicture(void 0, () => {
            if (MediaCallImpl.hasCurrentSession()) {
                var t = MediaCallUI.getMediaCallWrapper(e.getId()),
                    i = ZCJQuery("#mediacall_container"),
                    a = t.find('[mediacallbuttons][purpose="exitPIP"]');
                a.removeClass("active"), a.attr({
                    purpose: "openInPIP",
                    "av-tooltip-title": MediaUtil.getResource("avcliq.media.open.pip")
                }), ZCPIPUtil.removePIPOverlay(t), ZCJQuery("#mediacall_container").removeClass("avcall-pip-mode"), MediaCallUI.setResizableForMiniPlayer(i), MediaCallUI.handleResize()
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
        var i = t.has_switched_to_video,
            a = t.is_sharing_screen,
            n = t.audio.muted,
            s = t.video.muted,
            r = function(t) {
                MediaManager.setRequestCompleted(), e.writeToLog(CallLogConstants.getMediaDevicesSuccess), MediaUtil.logAvailableDevices(e, t);
                var r = function(t, i) {
                        if (e.writeToLog(CallLogConstants.streamRequest.success), MediaManager.resetStreamRequested(), MediaCallImpl.hasHandingOffSession()) {
                            var a = e.getCurrentMember();
                            if (a.setAVUpStream(t), a.setScreenUpStream(i), void 0 !== t) {
                                var n = MediaCallUI.getVideoContainer(e.getId(), a.getId()),
                                    s = MediaCallUI.getMediaCallWrapper(e.getId());
                                MediaUtil.setStreamInContainer(a.getId(), n, t, (function() {
                                    WebRTCUserMedia.isAudioVideoStreamType(t._getType()) && s.find("[videowrapper]").addClass("AV-call-preview")
                                }))
                            }
                            void 0 !== i && (i._getPrimaryVideoTrack().applyConstraints({
                                frameRate: {
                                    min: 15,
                                    max: 15
                                }
                            }).catch(), a.setAsSharingScreen(), e.setAsScreenShared()), MediaCallImpl.startCallHandOff(e)
                        } else void 0 !== t && WebRTCUserMedia.closeStream(t._getType())
                    },
                    o = function(t, i) {
                        e.writeToLog(CallLogConstants.streamRequest.failed), MediaCallImpl.clearHandingOffSession(), MediaCallUI.removeCallUI(e), MediaManager.handleMediaError(t, i), MediaManager.resetStreamRequested()
                    },
                    l = function() {
                        e.writeToLog(CallLogConstants.streamRequest.screen.stopped), MediaCallHandler.UIEvents.stopScreenShare()
                    };
                s ? n ? a ? MediaCallImpl.requestStreamForMediaCall(void 0, a, r, o, l) : (e.getCurrentMember().setAudioMuted(), MediaCallImpl.requestStreamForMediaCall("audio", !1, r, o), n = !1) : MediaCallImpl.requestStreamForMediaCall("audio", a, r, o, l) : MediaCallImpl.requestStreamForMediaCall(n && !ZCMediaPreferences.isSpeechDetectionAllowedByUser() ? "video" : "audio_video", a, r, o, l), MediaCallUI.handleAVStateForHandoff(e, i, n, s)
            };
        MediaManager.setRequestPending({
            module: ZCMediaConstants.sessionTypes.CALLS,
            request_type: ZCMediaConstants.requestTypes.DEVICES
        }), WebRTCUserMedia.getMediaDevices(r, r)
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
            var i = MediaManager.hasOnGoingSession() ? "WAITING_TONE" : "INCOMING_TONE";
            this.stopToneById(i), void 0 !== MediaCall.BRIDGE.SoundManager && MediaCall.BRIDGE.SoundManager.play(i, MediaCall.BRIDGE.Constants.MEDIADEFAULTSTATICURL + MediaCallConstants.MEDIA_PATH + MediaCallConstants.fileNames.INCOMING_TONE, {
                loop: !0
            })
        }
    },
    startPushToTalk: function() {
        var e = this.getCurrentSession();
        if (e.getCurrentMember().isAudioMuted()) {
            var t = e.getId(),
                i = MediaCallUI.getMediaCallWrapper(t);
            if (MediaCallUI.isInFullScreenView(i)) return MediaCallImpl.handleUnmute(t, ZCMediaConstants.muteCases.pushToTalk), e.setPushToTalkState(!0), !0
        }
        return !1
    },
    stopPushToTalk: function() {
        var e = this.getCurrentSession();
        if (e.isPushToTalkEnabled() && !e.getCurrentMember().isAudioMuted()) {
            var t = e.getId(),
                i = MediaCallUI.getMediaCallWrapper(t);
            if (MediaCallUI.isInFullScreenView(i)) return MediaCallImpl.handleMute(t, ZCMediaConstants.muteCases.pushToTalk), e.setPushToTalkState(!1), !0
        }
        return !1
    },
    trackPoorNetworkShown: function(e) {
        var t = MediaCallImpl.getCurrentSession();
        void 0 === t && MediaCallImpl.hasCurrentIncomingSession(e) && (t = MediaCallImpl.getFromIncomingSessions(e)), t && !t.isPoorNetworkTracked() && (void 0 !== MediaCall.BRIDGE.Tracker && MediaCall.BRIDGE.Tracker.track("AV_POOR_NETWOTK_SHOWN"), t.setPoorNetworkTracked())
    },
    handleCallRingingTimeout: function(e) {
        var t = function(t) {
            var i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === e) {
                if (!i.isInCallAnsweredState() && void 0 !== t && void 0 !== t.answer_description) {
                    if (MediaCallImpl.handleCallAnswered(i, t), t.data.callee_client_type) {
                        var a = MediaCallUI.getVideoContainer(t.data.call_id, i.getOtherMemberId());
                        MediaCallUI.setDeviceInfoIndicationInCallUI(a, i.getOtherMember(), t.data.callee_client_type)
                    }
                    return
                }
                i.handleCallMissed()
            }
        };
        MediaCallAPI.updateCallStatus(e, MediaCallConstants.statusText.CALL_MISSED, t.bind(this), t.bind(this))
    },
    handleCallAnswered: function(e, t) {
        e.writeToLog(CallLogConstants.wms.callAnswered, t), MediaCallAPI.updateCallStatus(e.getId(), MediaCallConstants.statusText.CALL_ANSWERED_ACK, void 0, void 0);
        var i = e.getOtherMember();
        void 0 !== t.client_support && i.setClientSupport(t.client_support), t.callee_audio_status && t.callee_audio_status.muted && i.setAudioMuted(), t.callee_video_status && t.callee_video_status.muted && i.setVideoMuted();
        var a = t.answered_client_time;
        if (a && a > 0) {
            var n = MediaCall.BRIDGE.Util.getSyncedCurrentTime() - a;
            !isNaN(n) && n > MediaCallConstants.callAnsweredDelayThreshold && MediaCallAPI.pushCallEventLog(e.getId(), MediaCallConstants.logEvents.ANSWERED_ACK_DELAY, void 0, n)
        }
        var s = t.answer_description;
        void 0 !== s && (s = JSON.parse(s)), e.handleCallAnswered(s, t.tracks_media_id), t.caller_id === MediaCall.BRIDGE.Constants.ZUID && (MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.RINGING)), MediaCallUI.adaptUIToState(e, MediaCallConstants.states.CONNECTING), e.isLyraCodecSupported() && !e.isUsingLyra() && (e.getCurrentMember().reconnectCall(), MediaCallImpl.stopTone(MediaCallConstants.states.RECONNECTING))
    },
    playTone: function(e, t) {
        var i = void 0,
            a = void 0,
            n = void 0 !== MediaCall.BRIDGE.isAVCliqNotifyOwner ? MediaCall.BRIDGE.isAVCliqNotifyOwner() : MediaCall.BRIDGE.isWmsOwner();
        n = n ? !MediaCall.BRIDGE.Status.isDND() : n;
        var s = {
            loop: !0,
            mildTone: !1
        };
        t === MediaCallConstants.states.INCOMING && n ? this.playIncomingTone(e.isAudioCall() || e.isVideoCall()) : t === MediaCallConstants.states.CALLING ? (i = MediaCallConstants.fileNames.WAITING_TONE, a = "WAITING_TONE") : t === MediaCallConstants.states.RINGING ? (i = MediaCallConstants.fileNames.RINGING_TONE, a = "RINGING_TONE") : t === MediaCallConstants.states.RECONNECTING ? (i = MediaCallConstants.fileNames.RECONNECTING_TONE, a = "RECONNECTING_TONE") : t === MediaCallConstants.states.END ? (i = MediaCallConstants.fileNames.CALL_END_TONE, s.loop = !1, s.mildTone = !0, a = "CALL_END_TONE") : t === MediaCallConstants.states.RECORDING_STARTED ? (i = MediaCallConstants.fileNames.RECORDING_START, s.loop = !1, a = "RECORDING_START") : t === MediaCallConstants.states.RECORDING_STOPPED && (i = MediaCallConstants.fileNames.RECORDING_STOP, s.loop = !1, a = "RECORDING_STOP"), void 0 !== a && (this.stopToneById(a), void 0 !== MediaCall.BRIDGE.SoundManager && MediaCall.BRIDGE.SoundManager.play(a, MediaCall.BRIDGE.Constants.MEDIADEFAULTSTATICURL + MediaCallConstants.MEDIA_PATH + i, s))
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
            var i = MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                a = this.getCurrentSession(),
                n = a.getCurrentMember();
            n.handleAVStreamStatus(e, t, i);
            var s = t ? "off" : "on";
            MediaCallAPI.updateStreamSourceState(a.getId(), e, s, i), ZCJQuery("#av_settings_preview").toggleClass("avcliq-video-muted", n.isVideoMuted())
        }
    },
    handleRejectMessage: function(e, t, i) {
        if (!$WC.Util.isEmpty(t)) {
            var a = MediaCallImpl.getFromIncomingSessions(e);
            if (void 0 !== a) {
                if (t.length > ZCMediaConstants.REJECT_MESSAGE_MAX_LENGTH) return void UI.updateBanner(MediaUtil.getResource("videochat.incommingreply.errormsg"), 2e3, !0);
                a.getChatId();
                var n = {};
                this.chid && (n.chat_id = this.chid), n.callee = a.getOtherMemberId(), n.message = t, n.custom = i, MediaCallImpl.handleEnd(e, !0, {
                    messageData: n
                })
            }
        }
    },
    handleAudioDeviceAdded: function(e, t) {
        var i = e.getCurrentMember().getAVUpStream(),
            a = void 0 !== t[ZCMediaDevices.kinds.AUDIO_OUTPUT];
        if (a && MediaCallImpl.reApplyAudioOutputPreference(e), t[ZCMediaDevices.kinds.AUDIO_INPUT]) {
            t[ZCMediaDevices.kinds.AUDIO_INPUT] && void 0 !== i && (e.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.init + "audio"), WebRTCUserMedia.requestAndReplaceTracksInStream(i, WebRTCUserMedia.streamTypes.AUDIO_ONLY, (function(e) {
                if (MediaCallImpl.hasCurrentSession()) {
                    var t = MediaCallImpl.getCurrentSession(),
                        a = t.getCurrentMember();
                    t.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.success), a.replaceTracksInStream(e, WebRTCUserMedia.streamTypes.AUDIO_ONLY), a.setUpdatedAVStatus(), MediaManager.checkAndShowMicSwitchedInfo(e, i, !0), MediaCallUI.updateAudioDevicesInSessionPreview(t)
                } else WebRTCUserMedia.closeStream(e._getType())
            }), void 0, void 0, MediaUtil.getAudioProcessingOptions(e)))
        } else a && (MediaManager.checkAndShowAddedSpeakerSwitchedInfo(t[ZCMediaDevices.kinds.AUDIO_OUTPUT]), MediaCallUI.updateAudioDevicesInSessionPreview(e))
    },
    updateAPIResponseTimeInLog: function(e, t, i, a, n) {
        var s = MediaCallImpl.getCurrentSession(),
            r = {
                url: t,
                type: i,
                status: a,
                startTime: n,
                endTime: new Date,
                interval: Math.abs(new Date - n) + " ms"
            };
        if (ZCMediaNetworkPredictorImpl.addHttpRequestInfo(r), s && s.getId() === e) s.writeToLog(CallLogConstants.responseTime, r);
        else {
            var o = MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== o && o.writeToLog(CallLogConstants.responseTime, r)
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
            i = e.getCallStrengthAnalyser().getScore(),
            a = e.getCurrentMember(),
            n = i.upStreamScore,
            s = i.performanceScore;
        MediaCallUI.updateNetworkHealthMeter(t, a.getAVUpStream(), a, n.audioUpStreamPerformanceScore, n.videoUpStreamPerformanceScore), MediaCallUI.updateNetworkHealthMeter(t, a.getAVDownStream(), e.getOtherMember(), s.audioPerformanceScore, s.videoPerformanceScore)
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
        var i = e.getCurrentMember()._connection;
        i && i._connection ? i._connection.getStats().then((function(e) {
            var i = {
                totalPacketsSent: 0,
                totalPacketsReceived: 0,
                totalPacketsLost: 0,
                totalBytesSent: 0
            };
            e.forEach((function(e) {
                "inbound-rtp" === e.type && (i.totalPacketsLost = i.totalPacketsLost + e.packetsLost, i.totalPacketsReceived = i.totalPacketsReceived + e.packetsReceived), "outbound-rtp" === e.type && (i.totalPacketsSent = i.totalPacketsSent + e.packetsSent, i.totalBytesSent = i.totalBytesSent + e.bytesSent)
            })), t(i)
        })).catch((function(e) {
            t()
        })) : t()
    },
    pushEventLogsOnCallEnd: function(e, t) {
        var i = e.getId(),
            a = ZCMediaNetworkPredictorImpl.getAvgCdnRtt(),
            n = ZCMediaNetworkPredictorImpl.getAvgWmsRtt(),
            s = ZCMediaNetworkPredictorImpl.getInitialCDNRtt() || 0,
            r = e.hasInitialAudioLoss(),
            o = 0,
            l = void 0,
            d = void 0,
            c = void 0,
            C = void 0,
            u = void 0,
            h = void 0,
            p = void 0,
            m = void 0,
            g = void 0,
            I = e.getIceGatheringStates();
        I && Object.keys(I).length > 0 && (l = I.gathering, d = I.complete);
        var _ = e.getIceConnectionStates();
        _ && Object.keys(_).length > 0 && (c = _.checking, C = _.connected || _.complete);
        var v = e.getCandidateGenerationTime();
        v && Object.keys(v).length > 0 && (u = v.host, h = v.relay, p = v.srflx || v.prflx);
        var f = e.getEventTimeObj();
        f && Object.keys(f).length > 0 && (m = f.ANSWER_API_RESPONSE - f.CALL_UI_ANSWERED, g = f.CALL_RECEIVED_API_RESPONSE - f.CALL_RECEIVED_EVENT), MediaCallImpl.getWebrtcStatsForCallEnd(e, function(I) {
            var _ = [],
                v = MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                f = e.getCurrentMember().getlogsFromConnectionMonitor();
            if (f && Object.keys(f).length > 0)
                for (var M of Object.keys(f)) f[M] > 0 && _.push({
                    name: M,
                    value: f[M],
                    client_time: v
                });
            I && (I.totalPacketsSent && _.push({
                name: MediaCallConstants.logEvents.TOTAL_PACKETS_SENT,
                value: I.totalPacketsSent,
                client_time: v
            }), I.totalPacketsLost && _.push({
                name: MediaCallConstants.logEvents.TOTAL_PACKETS_LOST,
                value: I.totalPacketsLost,
                client_time: v
            }), I.totalPacketsReceived && _.push({
                name: MediaCallConstants.logEvents.TOTAL_PACKETS_RECEIVED,
                value: I.totalPacketsReceived,
                client_time: v
            }), I.totalBytesSent && _.push({
                name: MediaCallConstants.logEvents.TOTAL_BYTES_SENT,
                value: I.totalBytesSent,
                client_time: v
            })), r && _.push({
                name: MediaCallConstants.logEvents.INITIAL_AUDIO_LOSS,
                client_time: v
            }), ZCMediaNetworkPredictorImpl.getCurrentCDNRtt((function(r) {
                r && (o = r), a && (_.push({
                    name: MediaCallConstants.logEvents.AVG_RTT,
                    value: a,
                    client_time: v
                }), a > ZCMediaNetworkPredictorImpl.NETWORK_RTT_MAX_THRESHOLD && _.push({
                    name: "NETWORK_POOR",
                    value: a,
                    client_time: v
                })), n && (_.push({
                    name: MediaCallConstants.logEvents.AVG_WMS_RTT,
                    value: n,
                    client_time: v
                }), a > ZCMediaNetworkPredictorImpl.WMS_RTT_MAX_THRESHOLD && _.push({
                    name: "WMS_RTT_POOR",
                    value: n,
                    client_time: v
                })), s && _.push({
                    name: MediaCallConstants.logEvents.RTT_CALL_START,
                    value: s,
                    client_time: e.getStartTime()
                }), o && _.push({
                    name: MediaCallConstants.logEvents.RTT_CALL_END,
                    value: o,
                    client_time: v
                }), l && _.push({
                    name: MediaCallConstants.logEvents.FIRST_ICE_CANDIDATE,
                    client_time: l
                }), d && _.push({
                    name: MediaCallConstants.logEvents.LAST_ICE_CANDIDATE,
                    client_time: d
                }), c && _.push({
                    name: MediaCallConstants.logEvents.FIRST_ADD_CANDIDATE,
                    client_time: c
                }), C && _.push({
                    name: MediaCallConstants.logEvents.LAST_ADD_CANDIDATE,
                    client_time: C
                }), u && _.push({
                    name: MediaCallConstants.logEvents.ICE_CANDIDATE_HOST,
                    client_time: u
                }), h && _.push({
                    name: MediaCallConstants.logEvents.ICE_CANDIDATE_RELAY,
                    client_time: h
                }), p && _.push({
                    name: MediaCallConstants.logEvents.ICE_CANDIDATE_SRFLX,
                    client_time: p
                }), m && _.push({
                    name: MediaCallConstants.logEvents.ANSWER_CALL_REQ_TIME,
                    value: m,
                    client_time: v
                }), g && _.push({
                    name: MediaCallConstants.logEvents.CALL_RECIEVED_REQ_TIME,
                    value: g,
                    client_time: v
                }), _.length > 0 && MediaCallAPI.pushEventsLogArray(i, _, t)
            }))
        }.bind(this))
    },
    punchLogsOnCallEnd: function(e) {
        var t = e.getId();
        if (MediaCallImpl.pushEventLogsOnCallEnd(e, e.isCaller(MediaCall.getCurrentUserId())), MediaUtil.isNewAVDomainRoutingEnabled() && AVCliqIframeHandler.isLoaded()) {
            var i = e.getLogString(),
                a = e.getType(),
                n = e.getStatusText();
            MediaCallAPI.sendClientLogData(t, i, "[" + a + " Call] [" + n + "]", a)
        } else MediaAPI.uploadClientLog(t, "calls", e.getLogAsFile(t), "[" + e.getType() + " Call] [" + e.getStatusText() + "]", e.getType())
    },
    handleEnd: function(e, t, i) {
        var a = this.getCurrentSession(),
            n = void 0 !== a && a.getId() === e,
            s = void 0 !== i && i.showCallEndUI,
            r = !0;
        if (n ? (SessionTimers.clearTimer("mediacallsessiontimer"), SessionTimers.clearTimer("mediacallsessionsubtimer")) : (a = this.getFromIncomingSessions(e), r = !!t || void 0 !== i && i.uploadClientLog), void 0 !== a) {
            if (t = !a.isMigratedForRecording() && t, a.writeToLog(CallLogConstants.callEnd, {
                    notifyServer: t,
                    additionalData: i
                }), r && (MediaCallImpl.punchLogsOnCallEnd(a), "undefined" != typeof CallHistoryData && CallHistoryData.removeOngoingDirectCall(e)), t)
                if (a.isInInitialState())
                    if (a.isCaller(MediaCall.BRIDGE.Constants.ZUID)) MediaCallAPI.cancelCall(e);
                    else if (void 0 !== i && void 0 !== i.messageData) {
                MediaCallAPI.declineCall(e, i.messageData, function(e) {
                    i.messageData.custom && MediaCallRejectMessages.updateMessageList({
                        msg: i.messageData.message
                    })
                }.bind(this), (function() {
                    UI.updateBanner(MediaUtil.getResource("chat.message.send.error"), 2e3, !0)
                }))
            } else MediaCallAPI.declineCall(e);
            else MediaCallAPI.endCall(e);
            var o = this.hasActiveAdhocCall(a);
            a.terminate(o), n ? (MediaCallImpl.stopTone(MediaCallConstants.states.RECONNECTING), MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.RINGING), MediaCallImpl.stopTone(MediaCallConstants.states.RECORDING_STARTED), MediaCallImpl.stopTone(MediaCallConstants.states.RECORDING_STOPPED), this.clearCurrentRunningSession(), o || "function" == typeof MediaCall.BRIDGE.handleDarkMode && MediaCall.BRIDGE.handleDarkMode(!1), $WC.$Win.destroy("media_device_widget"), MediaCallUI.removeCallSettings(), Clickoutside.clear(a.getId() + "dropdowncnt"), MediaCallHandler.UIEvents.closeAddParticipantWin()) : (this.removeFromIncomingSessions(e), MediaCall.BRIDGE.handleTitleRevert(), MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.INCOMING)), MediaCallUI.handleEnd(a, s);
            var l = MediaUtil.isAVLibraryLoadedInChatbar();
            a.isWindowInFullScreen() && !l && (a.setWindowInFullScreen(!1), ZCMediaDomUtil.exitFullScreen()), a.isLiveFeedAssociated() && LiveFeedHandler.callEvents.handlEnd(a), (a.isInMigratingState() || a.isMigratedForRecording()) && "undefined" != typeof ConferenceImpl && ConferenceImpl.handleEndForAdhocCall(a.getId())
        }
        if (this.hasOutgoingSession()) {
            var d = this.getOutgoingSession();
            d.getId() === e && (MediaCallImpl.isLocalCallId(e) || MediaCallImpl.punchLogsOnCallEnd(d), d.terminate(), this.clearOutgoingSession(), MediaCallUI.handleEnd(d, s), MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.RINGING), d.isLiveFeedAssociated() && LiveFeedHandler.callEvents.handlEnd(d))
        }
        if (this.hasHandingOffSession()) {
            var c = this.getHandingOffSession();
            c.getId() === e && (c.terminate(), this.clearHandingOffSession(), MediaCallUI.handleEnd(c, !1))
        }
        void 0 !== i && i.playEndTone && !o && MediaCallImpl.playTone(null, MediaCallConstants.states.END)
    },
    getDetailsForAdhocCallConversion: function(e) {
        return {
            call_id: e.getId(),
            caller_id: e.getCallerId(),
            callee_id: e.getCalleeId(),
            recording_migration: e.getCurrentMember().isRecording()
        }
    },
    addUsersToCall: function(e, t, i, a, n) {
        var s = this.getCurrentSession();
        if (void 0 !== s && !$WC.Util.isEmpty(i) && i.length > 0) {
            if (s.isMigratedForRecording()) return i = i.filter(e => e !== s.getOtherMemberId()), void(s.getCurrentMember().isRecording() ? (s.setDetailsForCallConversion({
                userIds: i,
                title: e
            }), a(), MediaCallImpl.handleRecordingAction(MediaCall.isStartRecordingAllowed() ? MediaCallConstants.recordingAction.STOP_AND_START_RECORDING : MediaCallConstants.recordingAction.STOP_RECORDING)) : (s.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), MediaCallUI.adaptUIToState(s, MediaCallConstants.states.MIGRATING), AdhocCallBridge.publish(s, "addUsers", {
                associatedSessionId: s.getAssociatedConferenceId(),
                selectedList: i,
                title: e
            }), a()));
            var r = s.getCurrentMember().getAVUpStream();
            Conference.convertOneToOneCallToConference(e, t, i, void 0, r, MediaCallImpl.getDetailsForAdhocCallConversion(s), void 0, a, n)
        }
    },
    stopCallRecording: function(e) {
        var t = MediaCallImpl.getCurrentSession(),
            i = t.getCurrentMember();
        if (t && t.getId() === e && i.isRecording()) {
            var a = t.getAssociatedConferenceId();
            ConferenceAPI.stopRecording(a, i.getRecordingReferenceIndex(), void 0, (function(t) {
                t.code === ZCSmartConferenceConstants.errorCode.NO_RECORDING_IN_PROGRESS && AdhocOneToOneCallHandler.handleRecordingState(e, {
                    associatedSessionId: a,
                    state: "stop",
                    action_user: !0,
                    isRepairMessage: !0
                })
            }))
        }
    },
    startCallRecording: function(e) {
        var t = MediaCallImpl.getCurrentSession(),
            i = t.getCurrentMember(),
            a = t.getOtherMember();
        if (t && t.getId() === e && !i.isRecording() && t.isRecordingSupported()) {
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
                    r = i.getAVUpStream(),
                    o = [a.getId()],
                    l = (new Date).getTime();
                t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), i.setRecordingReferenceIndex(l), Conference.convertOneToOneCallToConference(MediaCallImpl.generateTitleForRecording(t), s, o, o, r, MediaCallImpl.getDetailsForAdhocCallConversion(t), l, void 0, (function() {
                    i.resetRecordingReferenceIndex(), t.setStatusText(MediaCallConstants.statusText.CALL_CONNECTED), UI.updateBanner(Resource.getRealValue("apierror.message"), 2e3, !0)
                }))
            }
        }
    },
    createAddParticipantWin: function(e) {
        if (MediaUtil.isAVLibraryLoadedInChatbar() && MediaCall.BRIDGE) MediaCall.BRIDGE.UI.openAddParticipantWin(e.getMemberIds(), MediaCallImpl.userSuggestion.createCallTitle(e, MediaCall.BRIDGE.Users.getName), (e, t) => {
            if (MediaCallImpl.hasCurrentSession()) {
                var i = MediaCallImpl.getCurrentSession(),
                    a = {
                        type: i.getCallTypeForAdhocCall(),
                        title: t,
                        user_ids: JSON.stringify(e),
                        adhoc_call_details: JSON.stringify(MediaCallImpl.getDetailsForAdhocCallConversion(i))
                    };
                i.setRedirectionState(), "function" == typeof MediaCall.BRIDGE.UI.loadCliqIframeAndSwitchFocus ? MediaCall.BRIDGE.UI.loadCliqIframeAndSwitchFocus().then(e => AVISCUtilBridge.openGroupCallInIframe(a, e)).then(() => MediaCallImpl.hasCurrentSession() && MediaCallUI.removeCallUI(MediaCallImpl.getCurrentSession())).catch(() => window.open(MediaUtil.BRIDGE.ServerConstants.CLIQ_SERVER_URL + "/groupcall" + MediaAPI.serialize(a))) : window.open(MediaUtil.BRIDGE.ServerConstants.CLIQ_SERVER_URL + "/groupcall" + MediaAPI.serialize(a))
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
            for (var i in t) SearchField.insertSelection("addcallparticipants-usersuggest", "contact", i, MediaCall.BRIDGE.Users.getName(i));
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
    _handleCallEvent: function(e, t, i) {
        var a = e.msguid,
            n = e.data.call_id,
            s = MediaCallImpl.hasCurrentSession() ? MediaCallImpl.getCurrentSession() : MediaCallImpl.getFromIncomingSessions(n);
        if (void 0 === s && (s = MediaCallImpl.getOutgoingSession()), !ZCWMSEventSync.isDuplicateEvent(a)) {
            if (s) {
                ["CALL_ANSWERED", "ANSWER_SDP", "ICE_CANDIDATE"].includes(e.action) && !t && s.pushPollingEvent(e.action)
            }
            ZCWMSEventSync.pushEventId(a), MediaCallHandler.wmsEvents[e.action](e)
        }
        i || MediaUtil.sendMessageViaBroadcastChannel(e)
    },
    switchDevice: function(e, t, i) {
        if (ZCMediaDevices.isValidDevice(t, e)) {
            var a = this.getCurrentSession(),
                n = a.getCurrentMember(),
                s = n.getAVUpStream();
            if (t === ZCMediaDevices.kinds.AUDIO_OUTPUT) {
                var r = MediaCallUI.getVideoContainer(a.getId(), a.getOtherMemberId()).find("video");
                return void MediaCallImpl.setAudioOutputDevice(r, e)
            }
            var o = {
                    audio: {
                        deviceId: {
                            exact: e
                        }
                    }
                },
                l = WebRTCUserMedia.streamTypes.AUDIO_ONLY;
            t === ZCMediaDevices.kinds.VIDEO_INPUT && (o = {
                video: {
                    deviceId: {
                        exact: e
                    }
                }
            }, l = WebRTCUserMedia.streamTypes.VIDEO_ONLY);
            a.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.init + l), WebRTCUserMedia.requestAndReplaceTracksInStream(s, l, (function(t) {
                if (MediaCallImpl.hasCurrentSession()) {
                    if (a.writeToLog(CallLogConstants.webrtc.requestAndReplaceTracksInStream.success), n.replaceTracksInStream(t, l), n.setUpdatedAVStatus(), i) {
                        var s = MediaCallUI.getVideoContainer(a.getId(), a.getOtherMemberId()).find("video");
                        MediaCallImpl.setAudioOutputDevice(s, e)
                    }
                } else WebRTCUserMedia.closeStream(t._getType())
            }), void 0, o, MediaUtil.getStreamProcessingOptions(a))
        }
    },
    adaptUIForCallCollision: function(e, t) {
        var i = e.find('[videocontainer][userId="' + t.caller_id + '"]'),
            a = e.find('[videocontainer][userId="' + t.callee_id + '"]');
        e.attr({
            callid: t.call_id,
            calltype: t.type,
            caller: t.callee_id,
            callee: t.caller_id
        }), i.attr("userId", t.callee_id), a.attr("userId", t.caller_id)
    },
    handleCallCollision: function(e, t) {
        var i = e.getId(),
            a = t.data.call_id,
            n = e.getType();
        MediaCallImpl.stopTone(MediaCallConstants.states.RINGING), this.adaptUIForCallCollision(MediaCallUI.getMediaCallWrapper(i), t.data), e.writeToLog(CallLogConstants.callState.collision), e.terminate(), MediaCallImpl.isLocalCallId(i) ? (MediaManager.resetStreamRequested(), MediaCallImpl.clearOutgoingSession()) : (MediaCallAPI.updateCallStatus(i, MediaCallConstants.statusText.CALL_COLLISION), MediaCallImpl.clearRunningSession(i));
        var s = MediaCallImpl.getFromIncomingSessions(a);
        void 0 === s && ((s = new MediaCallSession(t.data)).getCurrentMember().setClientSupport(MediaCallImpl.getClientSupport()), s.writeToLog(CallLogConstants.wms.callRequested), ZCWMSEventSync.pushEventId(t.msguid), MediaCallImpl.addInIncomingSessions(s)), t.data.caller_client_type && s.getOtherMember().setClientType(t.data.caller_client_type), s.getCurrentMember().storeRemoteTracksMediaId(t.data.tracks_media_id), s.getCurrentMember().storeRemoteSdp(JSON.parse(t.data.offer_description)), s.writeToLog(CallLogConstants.wms.offer, t.data), void 0 !== t.data.client_support && s.getOtherMember().setClientSupport(t.data.client_support), s.addLongPollingController(), s.isVideoCall() && !MediaCall.isVideoCall(n) && s.getCurrentMember().setVideoCallWithoutVideo(), MediaCall.initiateCallProcess(s, ZCMediaConstants.triggerSource.CALL_INCOMING_UI)
    },
    handleConnectionStatsCallBack: function(e) {
        var t = MediaCallImpl.getCurrentSession();
        if (t) {
            var i = (i, a, n, s, r) => {
                let o = t.getCachedConnectionStatsTableDom();
                MediaUtil.handleConnectionStatsCallBackData(t, i, a, n, s, r, e.rtt, o)
            };
            e.hasOwnProperty("sendaudiopacketlost") && e.hasOwnProperty("audiopacketssent") && e.hasOwnProperty("sendaudiojitter") && i(WebRTCPeerConnectionConstants.connectionTypes.AUDIO, !0, e.sendaudiopacketlost, e.audiopacketssent, e.sendaudiojitter), e.hasOwnProperty("recvaudiopacketlost") && e.hasOwnProperty("audiopacketsreceived") && e.hasOwnProperty("recvaudiojitter") && i(WebRTCPeerConnectionConstants.connectionTypes.AUDIO, !1, e.recvaudiopacketlost, e.audiopacketsreceived, e.recvaudiojitter), e.hasOwnProperty("sendvideopacketlost") && e.hasOwnProperty("videopacketssent") && e.hasOwnProperty("sendvideojitter") && i(WebRTCPeerConnectionConstants.connectionTypes.VIDEO, !0, e.sendvideopacketlost, e.videopacketssent, e.sendvideojitter), e.hasOwnProperty("recvvideopacketlost") && e.hasOwnProperty("videopacketsreceived") && e.hasOwnProperty("recvvideojitter") && i(WebRTCPeerConnectionConstants.connectionTypes.VIDEO, !1, e.recvvideopacketlost, e.videopacketsreceived, e.recvvideojitter), e.hasOwnProperty("sendscreenpacketlost") && e.hasOwnProperty("screenpacketssent") && e.hasOwnProperty("sendscreenjitter") && i(WebRTCPeerConnectionConstants.connectionTypes.SCREEN, !0, e.sendscreenpacketlost, e.screenpacketssent, e.sendscreenjitter), e.hasOwnProperty("recvscreenpacketlost") && e.hasOwnProperty("screenpacketsreceived") && e.hasOwnProperty("recvscreenjitter") && i(WebRTCPeerConnectionConstants.connectionTypes.SCREEN, !1, e.recvscreenpacketlost, e.screenpacketsreceived, e.recvscreenjitter)
        }
    },
    switchToVideo: function(e, t) {
        var i = MediaCallImpl.getCurrentSession();
        if (i.getId() === e) {
            i.writeToLog(CallLogConstants.ui.videoSwitch), MediaCallUI.removeSwitchToVideoInfo(i), t && Clickoutside.handleClickOnChild(t);
            var a = i.getCurrentMember();
            if (!a.hasSwitchedToVideo()) {
                var n = MediaCallUI.getMediaCallWrapper(e);
                if (a.setAsSwitchedToVideo(), i.isMigratedForRecording()) AdhocCallBridge.publish(i, "videoUnMute", {
                    associatedSessionId: i.getAssociatedConferenceId()
                });
                else {
                    i.writeToLog(CallLogConstants.webrtc.requestAndAddTrackInStream.init), MediaCallImpl.renegotiateForUnmute(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY, (function(e) {
                        MediaCallImpl.hasCurrentSession() ? (n.removeClass("AV-call-no-subview"), MediaCallUI.unmuteVideo(i), MediaCallImpl.handleAVStatusChange("video", !1), i.writeToLog(CallLogConstants.webrtc.requestAndAddTrackInStream.success), a.isMultiStreamSupported() && i.getOtherMember().isMultiStreamSupported() ? (MediaCallUI.handleSwitchToVideoLayout(), n.find('[mediacallbuttons][purpose="turnOffCamera"]').removeClass("dN zc-av-dN"), MediaCallUI.adjustCallContainerHeight(n), a.addVideoTrackInStream(e)) : (a.replaceScreenWithVideoInNewConnection(e), i.setAsScreenShared()), MediaCallUI.getVideoContainer(i.getId(), a.getId()).removeClass("AV-call-video-muted"), MediaCallAPI.updateLog(i.getId(), "CALL_SWITCH", {
                            loc_time: new Date,
                            time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                            user_type: i.isCaller(MediaCall.BRIDGE.Constants.ZUID) ? "caller" : "callee",
                            zuid: MediaCall.BRIDGE.Constants.ZUID,
                            call_mode: i.getType()
                        })) : WebRTCUserMedia.closeStream(e._getType())
                    }), (function(e, t) {
                        i.writeToLog(CallLogConstants.webrtc.requestAndAddTrackInStream.failed), a.resetSwitchedToVideo()
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
            var i = {
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
                a = SearchAgent.search(i);
            return a ? this.populateResults() : (this.populateEmptyResult(), ZCScroll.scrollTop(this.getResultsListContainer(), 0)), a
        }
        UI.updateBanner(MediaUtil.getResource("conference.invite.limit.audio", [this.maxLimitForAdhocCall]), 2e3, !0)
    },
    handleKeyUp: function(e, t) {
        var i = e.keyCode;
        if (e.stopPropagation(), 27 === i) {
            if ($WC.Util.isEmpty(t) && $WC.Util.isEmpty(this.getSearchFieldInput().val())) return void $WC.$Win.destroy("addparticipantstocallwin");
            this.getSearchFieldInput().val(""), $WC.Util.isEmpty(this.getSearchFieldInput().val()) && this.populateDefaultResult()
        }
        SearchField.hasNodes(this.getResultsListID()) || this.populateEmptyResult()
    },
    handleAction: function(e, t) {
        var i = t.attr("uid");
        $WC.Util.isEmpty(i) || (SearchField.clearSearchField(this.id), this.getSearchFieldInput().val("").select().focus())
    },
    getSelectionHTML: function(e, t, i) {
        var a = MediaCallImpl.getCurrentSession();
        return MediaTemplates.getSelectedParticipantHtmlInAddWin(t, e, i, "contact", !a.isMember(t))
    },
    handleDeleteNode: function(e) {
        e.remove(), this.getSearchFieldInput().select().focus(), this.populateDefaultResult()
    },
    setDefaultCallTitle: function(e) {
        SearchField.hasNodes(this.getUserSelectFieldId()) && ZCJQuery("#addparticipantstocallwin").find('[inputname="adhoccalltitle"]').val(this.createCallTitle(e, Composer.getDnameForChatTitle))
    },
    createCallTitle: function(e, t) {
        var i = t(e.getCallerId(), e.getCallerName()) + ", " + t(e.getCalleeId(), e.getCalleeName()) + " & " + MediaUtil.getResource("common.more");
        return i.length > ZCMediaConstants.MAX_TITLE_LENGTH ? i.substring(0, ZCMediaConstants.MAX_TITLE_LENGTH - 2) : i
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
    startCall: function(e, t, i, a, n) {
        var s = new Date,
            r = {},
            o = {
                client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                ...i
            };
        r[MediaCallConstants.MULTIPLE_CALLS_HANDLING_TYPE_HEADER] = t;
        var l = {
            url: MediaCallConstants.baseUrl + "/v2/users/" + e + "/call",
            type: MediaCallConstants.request.method.POST,
            data: o,
            headers: r,
            success: function(e, t, i, n, r) {
                var o, l;
                o = e.call_id, l = MediaCallConstants.request.status.SUCCESS, MediaCallImpl.updateAPIResponseTimeInLog(o, "/call", MediaCallConstants.request.method.POST, l, s), a(e), $WC.Util.isEmpty(r.objects_to_push_via_api) || (MediaCallImpl.statsObjectApiMaxSize = parseInt(r.objects_to_push_via_api))
            },
            error: function(e) {
                n(e)
            }
        };
        MediaUtil.isNewAVDomainRoutingEnabled() && AVCliqIframeHandler.isLoaded() && (l.url = l.url + MediaAPI.serialize(o), delete l.data), MediaAPI.request(l)
    },
    answerCall: async function(e, t, i, a, n) {
        var s = new Date,
            r = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/answer", MediaCallConstants.request.method.PUT, t, s)
            },
            o = {},
            l = !1;
        if (MediaCall.isAVSDPCompressionEnabled() && i.description) try {
            i.description = await ZCAVStringCompressor.compress(JSON.stringify(i.description)), l = !0
        } catch (e) {
            l = !1
        }
        var d = {
            is_compressed: l,
            client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
            ...i
        };
        o[MediaCallConstants.MULTIPLE_CALLS_HANDLING_TYPE_HEADER] = t, MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/answer",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: d,
            headers: o,
            success: function(e, t, i, n, s) {
                r(MediaCallConstants.request.status.SUCCESS), "function" == typeof a && a(e), $WC.Util.isEmpty(s.objects_to_push_via_api) || (MediaCallImpl.statsObjectApiMaxSize = parseInt(s.objects_to_push_via_api))
            },
            error: function(e) {
                r(MediaCallConstants.request.status.FAILED), "function" == typeof n && n(e)
            }
        })
    },
    cancelCall: function(e) {
        var t = new Date,
            i = function(i) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/cancel", MediaCallConstants.request.method.PUT, i, t)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/cancel",
            type: MediaCallConstants.request.method.PUT,
            success: function(e) {
                i(MediaCallConstants.request.status.SUCCESS)
            },
            error: function(e) {
                i(MediaCallConstants.request.status.FAILED)
            }
        })
    },
    declineCall: function(e, t, i, a) {
        var n = new Date,
            s = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/decline", MediaCallConstants.request.method.PUT, t, n)
            },
            r = {
                client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
            };
        void 0 !== t && (r = Object.assign({}, r, t)), MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/decline",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: r,
            success: function(e) {
                s(MediaCallConstants.request.status.SUCCESS), "function" == typeof i && i(e)
            },
            error: function(e) {
                s(MediaCallConstants.request.status.FAILED), "function" == typeof a && a(e)
            }
        })
    },
    endCall: function(e) {
        var t = new Date,
            i = function(i) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/end", MediaCallConstants.request.method.PUT, i, t)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/end",
            type: MediaCallConstants.request.method.PUT,
            success: function(e) {
                i(MediaCallConstants.request.status.SUCCESS)
            },
            error: function(e) {
                i(MediaCallConstants.request.status.FAILED)
            }
        })
    },
    updateStreamSourceState: function(e, t, i, a) {
        var n = "audio" === t ? "mic" : "screen" === t ? "screen" : "camera",
            s = new Date,
            r = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/" + n, MediaCallConstants.request.method.PUT, t, s)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/" + n,
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: {
                state: i,
                action_time: a
            },
            success: function(e) {
                r(MediaCallConstants.request.status.SUCCESS)
            },
            error: function(e) {
                r(MediaCallConstants.request.status.FAILED)
            }
        })
    },
    handOffCall: function(e, t, i, a) {
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
                s(MediaCallConstants.request.status.SUCCESS), "function" == typeof i && i(e)
            },
            error: function(e) {
                s(MediaCallConstants.request.status.FAILED), "function" == typeof a && a(e)
            }
        })
    },
    updateAVState: function(e, t) {
        var i = {
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/avstate",
            type: MediaCallConstants.request.method.POST,
            data: t
        };
        MediaUtil.isNewAVDomainRoutingEnabled() && AVCliqIframeHandler.isLoaded() && (i.url = i.url + MediaAPI.serialize(data), delete i.data), MediaAPI.request(i)
    },
    getCallDetail: function(e, t, i) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e,
            type: MediaCallConstants.request.method.GET,
            success: function(e) {
                "function" == typeof t && t(e)
            },
            error: function(e) {
                "function" == typeof i && i(e)
            }
        })
    },
    updateCallStatus: function(e, t, i, a, n, s) {
        var r = new Date,
            o = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/status", MediaCallConstants.request.method.PUT, t, r)
            },
            l = {
                value: t,
                client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
            };
        void 0 !== n && (l.client_support = n), MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/status",
            type: MediaCallConstants.request.method.PUT,
            syncRequestAcrossTabs: s,
            uniqueSyncId: "/v2/calls/" + e + "/status-" + t,
            contentType: "application/json",
            data: l,
            success: function(e) {
                o(MediaCallConstants.request.status.SUCCESS), "function" == typeof i && i(e)
            },
            error: function(e) {
                o(MediaCallConstants.request.status.FAILED), "function" == typeof a && a(e)
            }
        })
    },
    sendOfferSdp: async function(e, t, i, a, n, s, r, o, l, d, c) {
        var C = new Date,
            u = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/sendoffersdp", MediaCallConstants.request.method.PUT, t, C)
            },
            h = !1;
        if (MediaCall.isAVSDPCompressionEnabled()) try {
            t = await ZCAVStringCompressor.compress(JSON.stringify(t)), h = !0
        } catch (e) {
            h = !1
        }
        var p = {
            description: t,
            is_compressed: h,
            connection_state: i,
            tracks_media_id: n,
            has_switched_to_video: o,
            is_sharing_screen: l,
            client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
            turn_type: r
        };
        void 0 !== s && (p.client_support = s), void 0 !== a && a > 0 && (p.reconnection_id = a), MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/sendoffersdp",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: p,
            success: function(e) {
                u(MediaCallConstants.request.status.SUCCESS), "function" == typeof d && d(e)
            },
            error: function(e) {
                u(MediaCallConstants.request.status.FAILED), "function" == typeof c && c(e)
            }
        })
    },
    sendAnswerSdp: async function(e, t, i, a, n, s, r) {
        var o = new Date,
            l = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/sendanswersdp", MediaCallConstants.request.method.PUT, t, o)
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
            connection_state: i,
            tracks_media_id: n,
            client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
        };
        void 0 !== a && a > 0 && (c.reconnection_id = a), MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/sendanswersdp",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: c,
            success: function(e) {
                l(MediaCallConstants.request.status.SUCCESS), "function" == typeof s && s(e)
            },
            error: function(e) {
                l(MediaCallConstants.request.status.FAILED), "function" == typeof r && r(e)
            }
        })
    },
    pollEvents: function(e, t, i, a) {
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
                s(MediaCallConstants.request.status.SUCCESS), i(e)
            },
            error: function(e) {
                s(MediaCallConstants.request.status.FAILED), "function" == typeof a && a(e)
            }
        })
    },
    reinit: function(e, t, i) {
        var a = new Date,
            n = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/reinit", MediaCallConstants.request.method.PUT, t, a)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/reinit",
            type: MediaCallConstants.request.method.PUT,
            success: function(e) {
                n(MediaCallConstants.request.status.SUCCESS), "function" == typeof t && t(e)
            },
            error: function(e) {
                n(MediaCallConstants.request.status.FAILED), "function" == typeof i && i(e)
            }
        })
    },
    renegotiate: function(e, t, i) {
        var a = new Date,
            n = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/renegotiate", MediaCallConstants.request.method.PUT, t, a)
            };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/renegotiate",
            type: MediaCallConstants.request.method.PUT,
            success: function(e) {
                n(MediaCallConstants.request.status.SUCCESS), "function" == typeof t && t(e)
            },
            error: function(e) {
                n(MediaCallConstants.request.status.FAILED), "function" == typeof i && i(e)
            }
        })
    },
    updateIceCandidates: function(e, t, i, a) {
        var n = new Date,
            s = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/icecandidate", MediaCallConstants.request.method.PUT, t, n)
            };
        if (t.length) {
            var r = {
                ice_candidates: t,
                connection_state: i,
                client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
            };
            void 0 !== a && a > 0 && (r.reconnection_id = a), MediaAPI.request({
                url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/icecandidate",
                type: MediaCallConstants.request.method.PUT,
                contentType: "application/json",
                data: r,
                success: function(e) {
                    s(MediaCallConstants.request.status.SUCCESS)
                },
                error: function(e) {
                    s(MediaCallConstants.request.status.FAILED)
                }
            })
        }
    },
    updateLog: function(e, t, i) {
        void 0 !== e && (i.call_id = e);
        var a = {
                purpose: "AV_CALL_LOG",
                action: t,
                data: JSON.stringify(i)
            },
            n = {
                url: MediaCallConstants.baseUrl + "/v1/log",
                type: MediaCallConstants.request.method.POST,
                data: a,
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
    pushCallEventLog: function(e, t, i, a, n) {
        var s = new Date,
            r = function(t) {
                MediaCallImpl.updateAPIResponseTimeInLog(e, "/log", MediaCallConstants.request.method.PUT, t, s)
            },
            o = {};
        void 0 !== a && a > 0 && (o.round_trip_time = Math.round(a)), void 0 !== i && (o.value = i), void 0 !== n && (o.is_caller = n);
        var l = {
            event: t,
            client_time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
            data: o
        };
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/log",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: l,
            success: function(e) {
                r(MediaCallConstants.request.status.SUCCESS)
            },
            error: function(e) {
                r(MediaCallConstants.request.status.FAILED)
            }
        })
    },
    pushEventsLogArray: function(e, t, i) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/logs",
            type: MediaCallConstants.request.method.PUT,
            contentType: "application/json",
            data: {
                events: t,
                is_caller: i
            }
        })
    },
    sendClientLogData: function(e, t, i, a) {
        MediaAPI.request({
            url: MediaCallConstants.baseUrl + "/v2/calls/" + e + "/clientlog",
            type: "POST",
            sendStringAsFile: !0,
            fileHash: {
                fileData: t,
                fileName: e,
                fileParamName: "logfile",
                formDataParams: {
                    subject: i,
                    description: a
                }
            }
        })
    }
}, (LongPollingController = function(e, t, i) {
    this._sessionId = e, this._latestSequenceNumber = 0, this._pollingTimer = void 0, this._pollingInterval = i || MediaCallConstants.LONG_POLLING_INTERVAL, this._hasPendingRequest = !1, this._callback = t, this._initialize()
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
        t = function(t, a) {
            return i(e.screenContainer, t, a)
        },
        i = function(e, t, i, a, n) {
            var s = MediaCall.isNetworkIndicatorEnabled() ? $WC.template.replace('{{health_meter}} <span class="AV-call-health-meter-text zc-av-dN"></span><span class="zc-av-separator"></span>', {
                    health_meter: MediaTemplates.getNetworkHealthIndicatorHtml({
                        customAttribute: "userId=" + t
                    })
                }, "InSecureHTML") : "",
                r = $WC.template.replace('<div class="AV-call-username zc-av-font15 zc-av-fontB zc-av-ellips" {{name_attr}}>{{user_name}}</div>', {
                    name_attr: a ? "current-username" : "other-username"
                }, "InSecureHTML"),
                o = $WC.template.replace(e, {
                    buffer_loader: MediaTemplates.getBufferLoader("zc-av-dN"),
                    user_image_cnt: MediaTemplates.userImageContainer,
                    health_meter_cnt: s,
                    av_alert_indication: a ? "" : '<div id="avcliq_alert_indication" avcliq_alert_indication class="zc-av-dN"></div>',
                    device_info_cnt: a ? "" : void 0 === n ? '<div class="AV-call-deviceinfo zc-av-clrW" deviceinfo></div>' : MediaTemplates.getDeviceInfoIndicationHtml(n),
                    name_cnt: r,
                    $fullscreen_title: "media.open.fullscreen"
                }, "InSecureHTML");
            return $WC.template.replace(o, {
                user_id: t,
                user_name: MediaCall.BRIDGE.Constants.ZUID === t ? MediaUtil.getResource("avcliq.common.you") : void 0 !== MediaCall.BRIDGE.Users.getName(t, i) ? MediaCall.BRIDGE.Users.getName(t, i) : "",
                user_img: MediaCall.BRIDGE.Users.getImgUrlById(t),
                user_img_error_event: " onerror=MediaCallHandler.ImageLoadEvents.onError(this," + t + ")",
                user_image_display_class: "",
                user_image_onload: ""
            })
        },
        a = function(t) {
            var i = {};
            i[MediaCallConstants.types.AUDIO] = {
                answerIcon: "zcf-call",
                declineIcon: "zcf-call zc-call-end"
            }, i[MediaCallConstants.types.VIDEO] = {
                answerIcon: "zcf-video",
                declineIcon: "zcf-call zc-call-end"
            }, i[MediaCallConstants.types.SCREEN_SHARE_WITH_AUDIO] = i[MediaCallConstants.types.SCREEN_SHARE] = {
                answerIcon: "zcf-sharescrn",
                declineIcon: "zcf-scrn-shr-stop"
            };
            var a = t.getType(),
                n = a === MediaCallConstants.types.VIDEO;
            return $WC.template.replace(e.incomingCallBtns, {
                answer_audio_btn_class: n ? "zcf-call" : i[a].answerIcon + " zc-av-mR30",
                answer_video_btn_class: n ? "zcf-video" : "zc-av-dN",
                decline_icon_class: i[a].declineIcon,
                $answer_audio_title: n ? "avcliq.call.answer.audio.only" : "common.accept",
                $answer_audio_video_title: "avcliq.call.answer.video",
                $decline_title: "common.decline"
            })
        },
        n = function(t) {
            var i = "",
                n = '<div class="zc-av-font15 zc-av-fontB zc-av-ellips zc-av-usrname" other-username>{{user_name}}</div><div class="zc-av-font13 zc-av-ellips zc-av-textC zc-av-flexC zc-av-callstatus"><span statuscontent>{{content}}</span><span class="zcf-failed AV-call-warning zc-av-dN" networkindicator title="{{network_strength_tooltip}}"></span></div>',
                s = "videochat.message.calling",
                r = t.getOtherMember(),
                o = "AV-call-incoming";
            if (t.isHandOffInProgress()) o = "AV-call-outgoing", s = "avcliq.mediacall.state.parking", i = $WC.template.replace(e.initialStateOptCnt, {
                $title: "videochat.endcall"
            });
            else if (t.isCaller(MediaCall.BRIDGE.Constants.ZUID)) o = "AV-call-outgoing", i = $WC.template.replace(e.initialStateOptCnt, {
                $title: "videochat.endcall"
            });
            else {
                var l = t.getType();
                s = MediaCall.isAudioCall(l) ? "videochat.incomming.audio" : "videochat.incomming.video", (MediaCall.isScreenShareWithAudioCall(l) || MediaCall.isScreenShare(l)) && (s = "videochat.incomming.screen", n = '<div class="zc-av-font15 zc-av-fontB zc-av-mT15 zc-av-ellips zc-av-usrname" other-username>{{user_name}}</div><div class="zc-av-mT15 zc-av-font13 zc-av-ellips zc-av-textC" statuscontent>{{content}}</div>'), i = $WC.template.replace(e.incomingOptCnt, {
                    incoming_call_btns: a(t)
                }, "InSecureHTML"), i = $WC.template.replace(i, {
                    $decline_msg_btn_title: "common.decline"
                })
            }
            var d = $WC.template.replace(e.initialStateCnt, {
                user_image_cnt: '<div class="usr-img-cnt zc-usr-img-cnt bdrR100 zc-bdrR100 zc-av-mT15" userimagecnt><img class="bdrR100 zc-bdrR100 wh100 zc-wh100" user_image src="{{user_img}}" {{user_img_error_event}}></div>',
                info_cnt: n,
                options_cnt: i
            }, "InSecureHTML");
            return $WC.template.replace(d, {
                call_state_class: o,
                user_name: void 0 !== r.getName() ? r.getName() : "",
                user_img: MediaCall.BRIDGE.Users.getImgUrlById(r.getId()),
                user_img_error_event: " onerror=MediaCallHandler.ImageLoadEvents.onError(this," + r.getId() + ")",
                $content: s,
                $network_strength_tooltip: "avcliq.network.strength.weak.curruser"
            })
        },
        s = function() {
            return $WC.template.replace(e.share_options, {
                $share_title: "common.share"
            })
        },
        r = function(t) {
            var i = t.isVideoCall() ? $WC.template.replace(e.rejectMessage, {
                    $preset_msg: "videochat.incommingreply.video.msg1",
                    margin_class: ""
                }, "InSecureHTML") : "",
                a = "";
            if (MediaCallRejectMessages.hasCustomMessage()) {
                for (var n = MediaCallRejectMessages.getCustomMessageList(), s = n.length, r = 0; r < s - 1; r++) a += $WC.template.replace(e.rejectMessage, {
                    preset_msg: n[r].msg,
                    margin_class: ""
                });
                a += $WC.template.replace(e.rejectMessage, {
                    preset_msg: n[s - 1].msg,
                    margin_class: "mB5"
                })
            }
            return $WC.template.replace(e.replyMessageListUI, {
                video_reply_msg: i,
                custom_reject_msg: a,
                $reply_msg1: "videochat.incommingreply.msg1",
                $reply_msg2: "videochat.incommingreply.msg2",
                $reply_msg3: "videochat.incommingreply.msg3"
            }, "InSecureHTML")
        },
        o = function(e, t, i, a) {
            return $WC.template.replace('<div id="{{id}}" class="zc-av-flexC zc-av-mT30 zc-av-list-item2 zc-av-mR10" settingstab mediacallbuttons purpose="{{purpose}}"><span class="{{icon_class}} zc-av-zcl-img zc-av-md zc-av-flexM zc-av-fshrink zc-av-mR10"></span>{{label}}</div>', {
                id: e,
                icon_class: i,
                purpose: a,
                $label: t
            })
        },
        l = function(e) {
            var t = e.getCurrentMember();
            if (e.isVideoCall() || t.hasSwitchedToVideo()) {
                var i = t.getAVUpStream(),
                    a = MediaUtil.getDeviceDropDownHtml(ZCMediaDevices.kinds.VIDEO_INPUT, i, {
                        dropDownContainerHtml: MediaTemplates.getDeviceDropdownCntHtml()
                    });
                return $WC.template.replace(a, {
                    open_callback: 'mediamodulebuttons purpose="openDevicesDropDown"',
                    select_callback: 'mediadevicewidgetbutton purpose="selectDevice"'
                }, "InSecureHTML")
            }
        },
        d = function(e) {
            var t = e.getCurrentMember().getAVUpStream(),
                i = MediaUtil.getDeviceDropDownHtml(ZCMediaDevices.kinds.AUDIO_INPUT, t, {
                    dropDownContainerHtml: MediaTemplates.getDeviceDropdownCntHtml()
                });
            return $WC.template.replace(i, {
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
        getMainUIHtml: function(a) {
            var s, r = a.getCaller(),
                o = a.getCallee(),
                l = "",
                d = "",
                c = a.isLiveFeedAssociated() ? "AV-call-live-feed" : "",
                C = "AV-call-mainview",
                u = r.getId() === MediaCall.BRIDGE.Constants.ZUID,
                h = a.getOtherMember().getClientType(),
                p = a.isScreenShareWithAudioCall() && u,
                m = MediaTemplates.getScreenShareIndicator("mediacallbuttons", p),
                g = MediaTemplates.getScreenShareIndicatorForMiniPlayer("mediacallbuttons", !p),
                I = p ? "AV-call-scrnshare-ind" : "";
            s = $WC.template.replace(e.pipOption, {
                $title: "avcliq.media.open.pip"
            }), o.getId() === MediaCall.BRIDGE.Constants.ZUID && (a.isScreenShareWithAudioCall() || a.isScreenShare()) && (d = "AV-call-mainview", C = "AV-call-subview-2", l = t(r.getId(), r.getName()));
            var _ = '<div id="mediacall_container" class="AV-call-container AV-call-detached" detached>' + e.mainUI + "</div>",
                v = $WC.template.replace(_, {
                    fullscrn_recording_indicator: MediaTemplates.getRecordingIndicatorHtml("av-tooltip-bottom", "AV-call-newbox zc-av-mL6"),
                    toggle_chat_opt: void 0 === MediaCall.BRIDGE || void 0 !== MediaCall.BRIDGE.handleChatInRhs ? '<div class="AV-call-newbox AV-call-hover zcf-chat av-tooltip-right0" av-tooltip-title="{{chat_title}}" mediacallbuttons purpose="openChatInRHS"></div>' : "",
                    initial_cnt: n(a),
                    caller_class: r.getId() === MediaCall.BRIDGE.Constants.ZUID ? "AV-call-subview" : C,
                    callee_class: o.getId() === MediaCall.BRIDGE.Constants.ZUID ? "AV-call-subview" : C,
                    screen_class: d,
                    wb_class: "",
                    wb_container: "",
                    screen_container: l,
                    live_feed_class: c,
                    scrn_share_ind_class: I,
                    caller_video_container: i(e.videoContainer, r.getId(), r.getName(), u, h),
                    callee_video_container: i(e.videoContainer, o.getId(), o.getName(), !u, h),
                    screenshare_indicator: m,
                    pip_mode_switch: s,
                    target_elem_selector: MediaUtil.isAVLibraryLoadedInChatbar() ? "#mediacall_container" : "body",
                    recording_indicator: MediaTemplates.getRecordingIndicatorHtml("av-tooltip-up"),
                    miniplayer_screenshare_indicator: g,
                    connection_state_loader: ZCMediaTemplates.getConnectionLoaderHtml("videochat.message.reconnect"),
                    adhoc_call_state_container: e.bottomStatusContainer
                }, "InSecureHTML");
            return $WC.template.replace(v, {
                call_id: a.getId(),
                caller_id: a.getCaller().getId(),
                callee_id: a.getCallee().getId(),
                call_type: a.getType(),
                $chat_title: "common.chat",
                $minimize_back_title: "media.back.minimize.view",
                $minimize_title: "videochat.minimize",
                $maximize_title: "videochat.fullscreen",
                $fullscreen_title: "media.open.fullscreen"
            })
        },
        getOptionsHtml: function(t) {
            var i = t.getCurrentMember(),
                a = t.getOtherMember(),
                n = $WC.template.replace(e.callOptionsTop, {
                    health_meter_cnt: MediaCall.isNetworkIndicatorEnabled() ? MediaTemplates.getNetworkHealthIndicatorHtml({
                        customAttribute: "userId=" + t.getCurrentMember().getId()
                    }) : "",
                    status_cnt: t.isAudioLayoutRequired() ? '<div class="zc-av-font13 AV-call-top-status zc-av-dN" topstatuscnt></div>' : ""
                }, "InSecureHTML"),
                r = "";
            MediaCall.isWhiteBoardAllowed(t) && (r = s());
            var o = $WC.template.replace(e.callOptionsCnt, {
                device_info_cnt: MediaTemplates.getDeviceInfoIndicationHtml(a.getClientType()),
                name_cnt: '<div class="zc-av-font15 zc-av-fontB zc-av-ellips" other-username>{{user_name}}</div>',
                video_mute_display: t.isVideoCall() || i.hasSwitchedToVideo() || a.hasSwitchedToVideo() ? "" : "zc-av-dN",
                call_options_top: n,
                share_options: r,
                recording_indicator: MediaTemplates.getRecordingIndicatorHtml("av-tooltip-up")
            }, "InSecureHTML");
            return $WC.template.replace(o, {
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
            var i = MediaCall.BRIDGE.Constants.IS_GUEST_USER,
                a = $WC.template.replace(e.optionsDropDownItem, {
                    purpose: "openSettings",
                    custom_class: "",
                    disabled_info: "",
                    disabled_attr: "",
                    icon: "zcf-setting",
                    $content: "avcliq.common.settings"
                });
            if (!MediaCall.isWhiteBoardAllowed(t) && MediaCall.BRIDGE.isScreenShareAllowed()) {
                var n = t.getCurrentMember().isSharingScreen();
                a += $WC.template.replace(e.optionsDropDownItem, {
                    purpose: n ? "stopScreenShare" : "startScreenShare",
                    disabled_info: "",
                    disabled_attr: "",
                    custom_class: n ? "AV-call-selected" : "",
                    icon: n ? "zcf-scrn-shr-stop" : "zcf-sharescrn",
                    $content: n ? "avcliq.media.screenshare.stop" : "avcliq.media.screenshare.start"
                })
            }
            var s = !t.isMigratedForRecording() || t.getOtherMember().hasSwitchedToVideo();
            t.getCurrentMember().hasSwitchedToVideo() || t.isInMigratingState() || !s || (a += $WC.template.replace(e.optionsDropDownItem, {
                purpose: "switchToVideo",
                custom_class: "",
                disabled_attr: "",
                disabled_info: "",
                icon: "zcf-video",
                $content: "mediacall.share.video"
            }));
            var r = MediaCallUI.getMediaCallWrapper(t.getId());
            if (MediaCallUI.isInFullScreenView(r) || "function" != typeof MediaCall.BRIDGE.handleChatOpen || (a += $WC.template.replace(e.optionsDropDownItem, {
                    purpose: "openChat",
                    custom_class: "",
                    disabled_info: "",
                    disabled_attr: "",
                    icon: "zcf-chat",
                    $content: "mediacall.chat.open"
                })), !i && MediaCall.isNotebookIntegrationSupported() && (a += $WC.template.replace(e.optionsDropDownItem, {
                    purpose: "takeNotes",
                    custom_class: "",
                    disabled_info: "",
                    disabled_attr: "",
                    icon: "zcf-notebook",
                    $content: "common.notes"
                })), !i && MediaCall.isAdhocCallConversionEnabled() && t.getCurrentMember().isAdhocCallingSupported()) {
                var o = !(C = t.getOtherMember()).isAdhocCallingSupported(),
                    l = t.isInMigratingState() || o,
                    d = "";
                o && (d = $WC.template.replace('<span class="zcf-failed AV-call-warning" title="{{info_text}}"></span>', {
                    $info_text: ["avcliq.mediacall.add.users.unsupported.info", MediaCall.BRIDGE.Users.getName(C.getId(), C.getName())]
                }));
                var c = $WC.template.replace(e.optionsDropDownItem, {
                    purpose: "addParticipantsToCall",
                    custom_class: l ? "AV-call-menu-disabled" : "",
                    disabled_attr: l ? "disabled" : "",
                    icon: "zcf-memberAdd",
                    $content: MediaUtil.isAVLibraryLoadedInChatbar() ? "avcliq.mediacall.users.add" : "mediacall.users.add"
                });
                a += $WC.template.replace(c, {
                    disabled_info: d
                }, "InSecureHTML")
            }
            if (!i && !t.isInMigratingState() && t.getCurrentMember().isRecordingSupported() && MediaCall.isRecordingConfigEnabled()) {
                o = !(C = t.getOtherMember()).isRecordingSupported();
                var C, u = t.getCurrentMember().isRecording();
                l = t.isInMigratingState() || o || !MediaCall.isStartRecordingAllowed() && !u, d = "";
                o && (d = $WC.template.replace('<span class="zcf-failed AV-call-warning" title="{{info_text}}"></span>', {
                    $info_text: ["avcliq.mediacall.add.users.unsupported.info", MediaCall.BRIDGE.Users.getName(C.getId(), C.getName())]
                }));
                var h = $WC.template.replace(e.optionsDropDownItem, {
                    purpose: u ? "stopCallRecording" : "startCallRecording",
                    custom_class: u ? "AV-call-selected" : l ? "AV-call-menu-disabled" : "",
                    disabled_attr: l ? "disabled" : "",
                    icon: "AV-call-record-icon AV-call-record-icon-circle flexM zcl-menu-item-icn",
                    $content: u ? "media.recording.stop" : "media.recording.start"
                });
                a += $WC.template.replace(h, {
                    disabled_info: d
                }, "InSecureHTML")
            }
            if (!MediaCallUI.isInFullScreenView(r)) {
                var p = t.isInPIP();
                a += $WC.template.replace(e.optionsDropDownItem, {
                    purpose: p ? "exitPIP" : "openInPIP",
                    custom_class: "",
                    disabled_info: "",
                    icon: "zcf-pip",
                    $content: p ? "avcliq.media.exit.pip" : "avcliq.media.open.pip"
                })
            }
            return $WC.template.replace('<div id="{{id}}dropdowncnt" class="AV-call-moreOpt">{{options}}</div>', {
                id: t.getId(),
                options: a
            }, "InSecureHTML")
        },
        getShareOptionsHtml: function(t) {
            var i, a = "";
            if (MediaCall.BRIDGE.isScreenShareAllowed()) {
                var n = t.getCurrentMember().isSharingScreen();
                a += $WC.template.replace(e.optionsDropDownItem, {
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
                a += $WC.template.replace(e.shareOptionsDropDownItem, {
                    purpose: s ? "stopWhiteBoard" : "startWhiteBoard",
                    custom_class: s ? "zcl-neg-menu-item" : "",
                    icon: s ? "zcf-whiteboard-end" : "zcf-whiteboard",
                    $content: s ? "whiteboard.stop" : "whiteboard.start"
                })
            }
            MediaCall.isPresentationAllowed(t) && (t.hasPresentation() && t.isPresenter() ? i = {
                purpose: "stopPresentation",
                custom_class: "zcl-neg-menu-item",
                icon: "zcf-presentation-end",
                $content: "media.presentation.stop"
            } : t.hasPresentation() || (i = {
                purpose: "startPresentation",
                custom_class: "",
                icon: "zcf-presentation",
                $content: "media.presentation.start"
            }), void 0 !== i && (a += $WC.template.replace(e.shareOptionsDropDownItem, i)));
            return $WC.template.replace('<div id="{{id}}shrdropdowncnt" class="AV-call-moreOpt">{{options}}</div>', {
                id: t.getId(),
                options: a
            }, "InSecureHTML")
        },
        getScreenVideoContainerHtml: t,
        getWhiteBoardContainerHtml: function(t, i) {
            var a = i && i.hasWhiteBoard() ? i.getCurrentWhiteBoardId() : "",
                n = i && i.hasWhiteBoard() ? WhiteBoard.getBoardURL(a, i.getId()) : "";
            return $WC.template.replace(e.whiteBoardContainer, {
                title: t,
                buffer_loader: MediaTemplates.getBufferLoader(),
                data_uid: a,
                associate_id: i.getId(),
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
        getEndOptionsHtml: function(t, i) {
            var a = $WC.template.replace(e.endButtonGroup, {
                secondaryBtn_icon: i ? '<em class="zcf-call-again zc-av-font20"></em>' : ""
            }, "InSecureHTML");
            return a = $WC.template.replace(e.endCallOptCnt, {
                button_group_html: a
            }, "InSecureHTML"), $WC.template.replace(a, {
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
            var e, t, i = $WC.$Dlg.frameBodyInfoHTML({
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
                bodyhtml: i
            }, !0)
        },
        showProceedRecordingConsent: function(t) {
            var i = $WC.template.replace(e.proceedRecordingConsentHeader, {
                $header_text: "avcliq.adhoccall.recording.consent.header"
            });
            MediaUtil.createPopup({
                id: "proceed_recording_consent",
                class: "modalwindow modalwindow2 zcalgncntr deleterecording zcbg_mask recording-modalwindow",
                header: i,
                closefn: t,
                html: $WC.template.replace(e.proceedRecordingConsentHtml, {
                    $stop_btn: "avcliq.media.recording.stop",
                    $stop_start_btn: "avcliq.adhoccall.recording.button.stop.and.start",
                    start_stop_btn_disabled: MediaCall.isRecordingConfigEnabled() && MediaCall.isStartRecordingAllowed() ? "" : "disabled"
                })
            }, !0)
        },
        getVideoInputDevicePickerHtml: l,
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
            var i = t.getCaller(),
                n = i.getId(),
                s = i.getName(),
                o = t.getType(),
                l = "videochat.incomming.screen";
            return o === MediaCallConstants.types.AUDIO ? l = "videochat.incomming.audio" : o === MediaCallConstants.types.VIDEO && (l = "videochat.incomming.video"), $WC.template.replace(e.replyUI, {
                reject_messages: r(t),
                incoming_call_btns: a(t),
                user_img: MediaCall.BRIDGE.Users.getImgUrlById(n),
                user_img_error_event: " onerror=MediaCallHandler.ImageLoadEvents.onError(this," + n + ")",
                caller_name: MediaCall.BRIDGE.Users.getName(n, s),
                $message_header: "videochat.incomming.sendmsg",
                $custom_placeholder: "videochat.incomming.custmsg",
                $call_status: l
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
            var i = o("av-devicesetting-lhs", "videochat.settings.devicesettings", "zcf-device-setting", "setMediaDevices");
            MediaCallImpl.isCurrentModeVideoCall(t) && MediaCall.isDiretCallVideoEffectsEnabled() && (i += o("av-video-effects-lhs", "avcliq.cc.video.effects", "zcf-video-blur", "switchToVideoEffects")), $ZCUtil.Browser.isFirefox() || $ZCUtil.Browser.isSafari() || (i += o("av-network-stats-lhs", "avcliq.networkstats.title", "zcf-network-perf", "switchToConnectionStatsTab"));
            var a = $WC.template.replace(e.settingsLayoutHtml, {
                settings_lhs_html: i,
                settings_body_html: ""
            }, "InSecureHTML");
            return $WC.template.replace(a, {
                $settings_header: "avcliq.common.settings"
            })
        },
        getDeviceSettingsHtml: function(t, i, a) {
            var n = t.getCurrentMember(),
                s = l(t),
                r = d(t),
                o = c(),
                C = "",
                u = n.isVideoMuted(),
                h = n.isAudioMuted(),
                p = n.getAVUpStream();
            s && "" !== s && (C += MediaTemplates.getMediaControlOption({
                headerKey: "avcliq.media.setdevices.videoinput",
                iconClass: u ? "zcf-video-mute" : "zcf-video",
                needsSeparator: !1,
                checkboxAttribute: "mediacallcheckbox",
                checkboxPurpose: "toggleVideoInPreviewPage",
                isSelected: !u,
                customAttribute: "avcliq_videoinput",
                deviceDropDown: s
            })), r && "" !== r && (C += MediaTemplates.getMediaControlOption({
                headerKey: "avcliq.media.setdevices.audioinput",
                iconClass: h ? "zcf-mic-mute" : "zcf-mic",
                needsSeparator: !1,
                checkboxAttribute: "mediacallcheckbox",
                checkboxPurpose: "toggleAudioInPreviewPage",
                isSelected: !h,
                customAttribute: "avcliq_audioinput",
                deviceDropDown: r
            })), o && "" !== o && (C += MediaTemplates.getOutputAudioControlOption({
                headerKey: "avcliq.media.setdevices.audiooutput",
                customClass: "",
                needsSeparator: !1,
                audioOutputAttribute: "mediacallbuttons",
                audioOutputPurpose: "playDummySoundInPreviewPage",
                deviceDropDown: o
            }));
            var m = $WC.template.replace(e.deviceSettingsHtml, {
                category_list_html: C,
                system_requirement_link: MediaTemplates.getSystemRequirementLinkHtml(),
                audio_card: MediaTemplates.getAudioCardHtml(n.getId()),
                img_class: u ? "dN" : "",
                disable_video: "",
                img_src: MediaCall.BRIDGE.Users.getImgUrlById(n.getId()),
                user_img_error_event: " onerror=MediaCallHandler.ImageLoadEvents.onError(this," + n.getId() + ")",
                video_mute_class: p && p._hasVideoTrack() ? "" : "avcliq-video-muted",
                video_mirror_option: MediaTemplates.getVideoMirrorHtml("mediacallcheckbox", "toggleVideoRotateConfig")
            }, "InSecureHTML");
            return $WC.template.replace(m, {
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
                i = MediaTemplates.getCheckboxHtml("remembervideoeffectstoggle", "avcliq.linkpreview.consent.checkbox", e.canRememberVideoEffects(), "mediacallcheckbox", "toggleRememberVideoEffects", !0),
                a = $WC.template.replace(MediaTemplates.videoEffectsSettings, {
                    mirror_video_checkbox: MediaTemplates.getVideoMirrorHtml("mediacallcheckbox", "toggleVideoRotateConfig"),
                    palet: t,
                    check_box: i
                }, "InSecureHTML");
            return $WC.template.replace(a, {
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
        sendOffer: function(e, t, i, a, n, s) {
            var r = MediaCallImpl.getCurrentSession();
            if (r && r.getId() === e) {
                var o = {
                    perfect_renegotiation: r.getCurrentMember().isPerfectRenegotiationSupported(),
                    multi_stream: r.getCurrentMember().isMultiStreamSupported(),
                    adhoc_call_support: r.getCurrentMember().isAdhocCallingSupported(),
                    lyra_support: r.getCurrentMember().isLyraCodecSupported(),
                    call_collision_handling: r.getCurrentMember().isCallCollisionSupported(),
                    initial_reconnection: r.getCurrentMember().isInitialReconnectionSupported(),
                    recording_support: r.getCurrentMember().isRecordingSupported(),
                    handoff_support: r.getCurrentMember().isHandoffSupported(),
                    reconnection_policy: !0,
                    close_track_on_mute: !0,
                    whiteboard_support: MediaCall.BRIDGE.isWhiteBoardAllowed(),
                    presentation_support: MediaCall.BRIDGE.isPresentationAllowed()
                };
                MediaCall.isNewRTCConnectionEnabled() && (o.new_rtc_connection_support = r.getCurrentMember().isNewRTCConnectionSupported());
                var l = function() {
                        var t = MediaCallImpl.getCurrentSession();
                        t && t.getId() === e && t.isInitialConnection() && !t.isHandOffInProgress() && t.addLongPollingController()
                    },
                    d = function(i) {
                        if (void 0 === i || i.code !== MediaCallAPI.errorCodes.CALL_ALREADY_ENDED) {
                            var a = MediaCallImpl.getCurrentSession();
                            a && a.getId() === e && (a.writeToLog(CallLogConstants.webrtc.sendOfferFailedRetry, t), clearTimeout(a._sendOfferTimer), a._sendOfferTimer = setTimeout((function() {
                                c()
                            }), 2e3))
                        } else MediaCallImpl.handleEnd(e, !1)
                    },
                    c = function() {
                        var c = r.getCurrentMember();
                        r.writeToLog(CallLogConstants.webrtc.sendOffer, t), i = r.isHandOffInProgress() ? MediaCallRTCPeerConnectionConstants.processTypes.HANDOFF : i, MediaCallAPI.sendOfferSdp(e, t, i, a, n, o, s, c.hasSwitchedToVideo(), c.isSharingScreen(), l, d)
                    };
                MediaCall.BRIDGE.isWMSConnected() || MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.WS_DISCONNECT), c()
            }
        },
        sendAnswer: function(e, t, i, a, n) {
            var s = MediaCallImpl.getCurrentSession();
            if (s && s.getId() === e)
                if (s.isCaller(s.getCurrentMemberId()) || s.isAnswerCallNotified() || i === MediaCallRTCPeerConnectionConstants.processTypes.REINIT || i === MediaCallRTCPeerConnectionConstants.processTypes.RENEGOTIATE) MediaCallAPI.sendAnswerSdp(e, t, i, a, n);
                else {
                    MediaCall.BRIDGE.isWMSConnected() || MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.WS_DISCONNECT), s.setAnswerCallAsNotified();
                    var r = {
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
                    MediaCall.isNewRTCConnectionEnabled() && (r.new_rtc_connection_support = s.getCurrentMember().isNewRTCConnectionSupported()), s.writeToLog(CallLogConstants.webrtc.answerWithSdpInit, t);
                    var o = {
                        description: t,
                        tracks_media_id: n,
                        client_support: r
                    };
                    s.getCurrentMember().isVideoCallWithoutVideo() && (o.video = {
                        muted: !0,
                        time: MediaCall.BRIDGE.Util.getSyncedCurrentTime()
                    }), MediaCallAPI.answerCall(e, s.getMultipleCallsHandlingType(), o, (function() {
                        var t = MediaCallImpl.getCurrentSession();
                        t && t.getId() === e && t.setEventTime("ANSWER_API_RESPONSE", MediaCall.BRIDGE.Util.getSyncedCurrentTime())
                    }), (function(t) {
                        var i = MediaCallImpl.getCurrentSession();
                        if (i && i.getId() === e) {
                            if (i.writeToLog(CallLogConstants.webrtc.answerWithSdpFailed, t), i.resetAnswerCallAsNotified(), void 0 === t) return;
                            if (MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleCallAPIError && MediaCall.BRIDGE.listener.handleCallAPIError(t, i.getDetails()), MediaCallAPI.errorCodes.isCallAlreadyAnsweredError(t.code) || MediaCallAPI.errorCodes.isCallEndError(t.code)) MediaCallImpl.handleEnd(i.getId());
                            else if (t.code === MediaCallAPI.errorCodes.ALREADY_ON_A_CALL) return void MediaUtil.showMultipleCallAlertPopup(i.getOtherMemberId(), (function() {
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
        handleOnIceCandidate: function(e, t, i) {
            var a = MediaCallImpl.getCurrentSession();
            a && a.getId() === e && !i && a.setCandidateGenerationTime(t.type, MediaCall.BRIDGE.Util.getSyncedCurrentTime())
        },
        updateIceCandidates: function(e, t, i, a) {
            var n = MediaCall.isForceTurnEnabled();
            n && (t = MediaCallImpl.filterRelayCandidates(t));
            var s = MediaCallImpl.getCurrentSession();
            s && s.getId() === e && (s.writeToLog(CallLogConstants.webrtc.forceTurn, n), s.writeToLog(CallLogConstants.webrtc.updateIce, t), MediaCallImpl.hasTurnCandidates(t) && s.getCurrentMember().setTurnCandidatesGenerated(), MediaCallAPI.updateIceCandidates(e, t, i, a))
        },
        handleIceConnectionStateChange: function(e, t) {
            var i = MediaCallImpl.getCurrentSession(),
                a = i && i.getId() === e ? i : MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== a && (a.isInitialConnection() && a.storeIceConnectionState(t), a.writeToLog(CallLogConstants.webrtc.iceConnectionStateChange, t))
        },
        handleIceGatheringStateChange: function(e, t) {
            var i = MediaCallImpl.getCurrentSession(),
                a = i && i.getId() === e ? i : MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== a && (a.isInitialConnection() && a.storeIceGatheringState(t), a.writeToLog(CallLogConstants.webrtc.iceGatheringStateChange, t))
        },
        handleSignalingStateChange: function(e, t) {
            var i = MediaCallImpl.getCurrentSession(),
                a = i && i.getId() === e ? i : MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== a && a.writeToLog(CallLogConstants.webrtc.signalingStateChange, t)
        },
        canStartConnectionTimeout: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e) {
                var i = MediaCall.isReconnectOnConnectionTimeoutEnabled(t) && t.isInitialConnection();
                return t.writeToLog(CallLogConstants.canStartConnectionTimeout, i), i
            }
        },
        handleInitialReconnection: function(e, t, i, a, n) {
            var s = MediaCallImpl.getCurrentSession();
            if (s && s.getId() === e && a.length && n.length) {
                var r = s.getCurrentMember(),
                    o = s.getOtherMember(),
                    l = void 0;
                MediaCallRTCPeerConnectionConstants.turnTypes.isGeo(t) ? l = r.isTurnCandidatesGenerated() && o.isTurnCandidatesGenerated() ? MediaCallConstants.logEvents.GEO_NO_CONNECT : MediaCallConstants.logEvents.GEO_NO_CANDIDATE : MediaCallRTCPeerConnectionConstants.turnTypes.isMain(t) ? l = r.isTurnCandidatesGenerated() && o.isTurnCandidatesGenerated() ? MediaCallConstants.logEvents.MAIN_NO_CONNECT : MediaCallConstants.logEvents.MAIN_NO_CANDIDATE : MediaCallRTCPeerConnectionConstants.turnTypes.isBackup(t) && (l = r.isTurnCandidatesGenerated() && o.isTurnCandidatesGenerated() ? MediaCallConstants.logEvents.BACKUP_NO_CONNECT : MediaCallConstants.logEvents.BACKUP_NO_CANDIDATE), l && (s.writeToLog(CallLogConstants.initialReconnection, l), MediaCallAPI.pushCallEventLog(e, l, i)), r.resetTurnCandidatesGenerated(), o.resetTurnCandidatesGenerated()
            }
        },
        handleReconnect: function(e, t, i, a, n) {
            var s = MediaCallImpl.getCurrentSession();
            if (s && s.getId() === e) {
                var r = s.getMember(i);
                MediaCallImpl.handleReconnection(s, t), r.handleReconnect(e, t, s.isCaller(MediaCall.BRIDGE.Constants.ZUID))
            }
        },
        handleReinit: function(e, t, i, a) {
            var n = MediaCallImpl.getCurrentSession();
            n && n.getId() === e && (n.writeToLog(CallLogConstants.webrtc.reinit, {
                turnType: a
            }), n.getMember(t).handleReinit(i))
        },
        handleRenegotiate: function(e, t, i, a) {
            var n = MediaCallImpl.getCurrentSession();
            n && n.getId() === e && (n.writeToLog(CallLogConstants.webrtc.renegotiate, {
                turnType: a
            }), i || n.getCurrentMember().isPerfectRenegotiationSupported() && n.getOtherMember().isPerfectRenegotiationSupported() ? n.getMember(t).renegotiateOffererConnection(!0) : MediaCallAPI.renegotiate(e))
        },
        handleTrack: function(e, t, i) {
            var a = MediaCallImpl.getCurrentSession();
            a && a.getId() === e && i.length > 0 && (a.writeToLog(CallLogConstants.webrtc.addTrack, {
                type: t.kind,
                id: t.id
            }), a.setReceivedTrack(t, i), "audio" == t.kind && MediaManager.setPreferredAudioOutput([MediaCallUI.getVideoContainer(e, a.getOtherMemberId()).find("video")[0]]))
        },
        isLyraCodecNeeded: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e) return t.isLyraCodecSupported()
        },
        isDTXNeeded: function() {
            return MediaCall.isDTXEnabled()
        },
        isPreBindIceCandidateEnabled: function(e) {
            return !MediaCall.BRIDGE.Util.Browser.isFirefox()
        },
        handleIceCandidateError: function(e, t) {
            var i = MediaCallImpl.getCurrentSession(),
                a = i && i.getId() === e ? i : MediaCallImpl.getFromIncomingSessions(e);
            void 0 !== a && a.writeToLog(CallLogConstants.webrtc.iceCandidateError, t)
        },
        handleDisconnected: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === e) i.writeToLog(CallLogConstants.webrtc.connection.disconnected);
            else {
                var a = MediaCallImpl.getFromIncomingSessions(e);
                void 0 !== a && a.writeToLog(CallLogConstants.webrtc.connection.disconnected)
            }
        },
        handleFailed: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === e) i.writeToLog(CallLogConstants.webrtc.connection.failed);
            else {
                var a = MediaCallImpl.getFromIncomingSessions(e);
                void 0 !== a && a.writeToLog(CallLogConstants.webrtc.connection.failed)
            }
        },
        handleConnected: function(e, t, i, a, n) {
            var s = MediaCallImpl.getCurrentSession();
            if (s && s.getId() === e) {
                var r = s.isInitialConnection(),
                    o = s.getCurrentMember(),
                    l = s.getOtherMember(),
                    d = s.isHandOffInProgress();
                o.clearLastReconnectionId(), s.removeNetworkPredictor(), s.removeLongPolingController(), s.writeToLog(CallLogConstants.webrtc.connection.success), r && (MediaCallRTCPeerConnectionConstants.turnTypes.isMain(n) ? MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.MAIN_CONNECTED) : MediaCallRTCPeerConnectionConstants.turnTypes.isBackup(n) && MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.BACKUP_CONNECTED), s.isConnectedViaPolling() && MediaCallAPI.pushCallEventLog(e, MediaCallConstants.logEvents.LP_CONNECTED, void 0, void 0, s.isCaller(MediaCall.getCurrentUserId())), "undefined" != typeof RemoteWork && RemoteWork.isInRemoteWorkView() && RemoteWork.syncDetailsUI(), s.resetInitialConnection()), d && (s.setStatusText(MediaCallConstants.statusText.CALL_HANDOFF_COMPLETE), o.isHandOffInitiator() && MediaCallAPI.updateCallStatus(e, MediaCallConstants.statusText.CALL_HANDOFF_COMPLETE));
                var c = o.getAVUpStream();
                if (void 0 !== c) {
                    var C = [];
                    c._hasAudioTrack() && C.push(ZCMediaConstants.mediaDevices.MICROPHONE + ": " + c._getAudioDeviceLabel() + " - " + c._getAudioDeviceId()), c._hasVideoTrack() && C.push(ZCMediaConstants.mediaDevices.CAMERA + ": " + c._getVideoDeviceLabel() + " - " + c._getVideoDeviceId()), s.writeToLog(CallLogConstants.selectedMediaDevices, C)
                }
                WebRTCUserMedia.isSetBitRateSupported() && s.getMember(MediaCall.BRIDGE.Constants.ZUID).setBitRateForStream(1e6, WebRTCUserMedia.streamTypes.VIDEO_ONLY), MediaCallUI.adaptUIToState(s, MediaCallConstants.states.CONNECTED), MediaCallImpl.stopTone(MediaCallConstants.states.RECONNECTING), r && ((o.isScreenShareWithoutAudio() || o.isAudioMuted()) && MediaCallImpl.handleMute(e, ZCMediaConstants.muteCases.permissionDenied), (o.isVideoCallWithoutVideo() || o.isVideoMuted()) && MediaCallImpl.handleVideoMute(e, ZCMediaConstants.muteCases.permissionDenied), (o.hasSwitchedToVideo() || l.hasSwitchedToVideo()) && (MediaCallUI.removeSwitchToVideoInfo(s), MediaCallUI.handleSwitchToVideoLayout()), l.setUpdatedAVStatus(), s.hasPresentation() && s.getPresentation().open()), s.isConnectedStateNotified() || (MediaCallImpl.triggerSessionTimer(d ? s.getStartTime() : void 0), s.setConnectedStateAsNotified(), s.writeToLog(CallLogConstants.callState.connected), MediaCallAPI.updateCallStatus(e, MediaCallConstants.statusText.CALL_CONNECTED, void 0, (function() {
                    s.writeToLog(CallLogConstants.callState.failed), s.resetConnectedStateAsNotified()
                })));
                WebRTCPeerConnectionStats.initiateGathering(e, "calls", t, {
                    statsObjectMaxSize: MediaCallImpl.statsObjectApiMaxSize
                }, {
                    statsCallBack: function(e, t, i, a) {
                        (MediaCallImpl.handleConnectionStatsCallBack(t), MediaUtil.isNetworkAdapterEnabled()) && MediaCallImpl.getCurrentSession().getCurrentMember().pushStatsToConnectionMonitor(MediaCallImpl.getCurrentSession().getConnectionStatsData())
                    },
                    networkInfoCallBack: MediaAPI.pushConnectionNetworkDetails,
                    updateStatsCallBack: MediaAPI.pushConnectionStats,
                    candidatePairInfoCallBack: function(e, t, i) {
                        var a = MediaCallImpl.getCurrentSession();
                        a && a.getId() === e && (a.writeToLog(CallLogConstants.candidatePairInfo, i), MediaCallAPI.updateLog(e, "CALL_CANDIDATEPAIR", {
                            loc_time: new Date,
                            time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                            user_type: a.isCaller(MediaCall.BRIDGE.Constants.ZUID) ? "caller" : "callee",
                            zuid: MediaCall.BRIDGE.Constants.ZUID,
                            call_mode: a.getType(),
                            remote_ip: i.remote_ip + ":" + i.remote_candidate_port,
                            local_ip: i.local_ip + ":" + i.local_candidate_port,
                            remote_candidate_type: i.remote_candidate_type,
                            local_candidate_type: i.local_candidate_type
                        }))
                    },
                    errorCallback: function(t, i) {
                        var a = MediaCallImpl.getCurrentSession();
                        a && a.getId() === e && a.startActiveCallUpdate()
                    }
                }), a === MediaCallRTCPeerConnectionConstants.processTypes.RESTART && MediaCallAPI.updateLog(s.getId(), "CALL_RECONNECTION_SUCCESS", {
                    loc_time: new Date,
                    time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                    user_type: s.isCaller(MediaCall.BRIDGE.Constants.ZUID) ? "caller" : "callee",
                    zuid: MediaCall.BRIDGE.Constants.ZUID,
                    call_mode: s.getType()
                });
                t && s.addCallStrengthAnalyser(t, {
                    updateCallQuality: function(e, t, i) {
                        var a = MediaCallImpl.getCurrentSession();
                        a && a.getId() === e && (a.hasAnalysedAudioLoss() || MediaCallImpl.analyseAudioLoss(a, i), MediaCall.isNetworkIndicatorEnabled() && MediaCallImpl.updateNetworkHealthMeter(a))
                    }
                })
            }
        },
        handleClosed: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            i && i.getId() === e && (MediaCallAPI.updateLog(i.getId(), "CALL_RECONNECTION_FAILURE", {
                loc_time: new Date,
                time: MediaCall.BRIDGE.Util.getSyncedCurrentTime(),
                user_type: i.isCaller(MediaCall.BRIDGE.Constants.ZUID) ? "caller" : "callee",
                zuid: MediaCall.BRIDGE.Constants.ZUID,
                call_mode: i.getType()
            }), i.writeToLog(CallLogConstants.webrtc.connection.closed), MediaCallImpl.handleEnd(e, !0, {
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
            var i = MediaCallImpl.getCurrentSession();
            i && i.getId() === e && (i.writeToLog(CallLogConstants.webrtc.connection.failed, t), t.code === WebRTCPeerConnectionConstants.connectionErrors.UDP_BLOCKING && MediaUtil.showUDPBlockedWarning(ZCJQuery("#mediacall_container")))
        },
        hasStreamCallback: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === e) {
                var a = i.getCurrentMember();
                if (t === WebRTCUserMedia.streamTypes.AUDIO_ONLY) return a.getAVUpStream() && a.getAVUpStream()._hasAudioTrack();
                if (t === WebRTCUserMedia.streamTypes.VIDEO_ONLY) return a.getAVUpStream() && a.getAVUpStream()._hasVideoTrack();
                if (t === WebRTCUserMedia.streamTypes.SCREEN) return a.getScreenUpStream() && a.getScreenUpStream()._hasVideoTrack()
            }
        },
        handleNetworkAdapterOptimization: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            if (i && i.getId() === e)
                if (t.action === WebRTCPeerConnectionConstants.optimizations.opr.SET) switch (t.level) {
                    case 1:
                        i.getCurrentMember().setBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.VIDEO_ONLY), i.writeToLog("Level 1 optimization triggered - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.info");
                        break;
                    case 2:
                        MediaCallImpl.handleVideoMute(e), i.writeToLog("Level 2 optimization triggered - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.videomuted");
                        break;
                    case 3:
                        MediaCallImpl.getCurrentSession().getCurrentMember().setBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.SCREEN), i.writeToLog("Level 3 optimization triggered - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.info");
                        break;
                    case 4:
                        MediaCallImpl.getCurrentSession().getCurrentMember().setBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.AUDIO_ONLY), i.writeToLog("Level 4 optimization triggered - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.info")
                } else if (t.action === WebRTCPeerConnectionConstants.optimizations.opr.RESET) {
                    var a = () => {
                        ZCJQuery("#avcliq_alert_indication").empty(), ZCJQuery("#avcliq_live_tracking_info").remove()
                    };
                    switch (t.level) {
                        case 1:
                            i.getCurrentMember().resetBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.VIDEO_ONLY), i.writeToLog("Level 1 optimization reset - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.recovered", a);
                            break;
                        case 2:
                            i.writeToLog("Level 2 optimization reset - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.videounmute", a);
                            break;
                        case 3:
                            MediaCallImpl.getCurrentSession().getCurrentMember().resetBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.SCREEN), i.writeToLog("Level 3 optimization reset - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.recovered", a);
                            break;
                        case 4:
                            MediaCallImpl.getCurrentSession().getCurrentMember().resetBitRateForStream(t.bitrate, WebRTCUserMedia.streamTypes.AUDIO_ONLY), i.writeToLog("Level 4 optimization reset - " + t), MediaUtil.showLiveTrackingNotification("mediacall_container", "avcliq.bandwidth.poor.recovered", a)
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
                var i = MediaCallImpl.getCurrentIncomingSession(),
                    a = void 0 !== i;
                if (a && MediaCall.BRIDGE.Util.getSyncedCurrentTime() - i.getStartTime() > 35e3 && (MediaCallImpl.handleEnd(i.getId(), !1), a = !1), MediaCallImpl.hasCurrentSession() || MediaCallImpl.hasOutgoingSession() || a) return MediaCallImpl.handleEnd(e.data.call_id, !1), void MediaCallAPI.updateCallStatus(e.data.call_id, MediaCallConstants.statusText.CALL_MISSED_ON_BUSY, void 0, void 0, void 0, !0);
                var n = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
                void 0 === n && ((n = new MediaCallSession(e.data)).getCurrentMember().setClientSupport(MediaCallImpl.getClientSupport()), ZCWMSEventSync.pushEventId(e.msguid), MediaCallImpl.addInIncomingSessions(n), n.addNetworkPredictor()), n.writeToLog(CallLogConstants.wms.callRequested), n.setEventTime("CALL_RECEIVED_EVENT", MediaCall.BRIDGE.Util.getSyncedCurrentTime()), e.data.caller_audio_status && e.data.caller_audio_status.muted && n.getCaller().setAudioMuted(), e.data.caller_video_status && e.data.caller_video_status.muted && n.getCaller().setVideoMuted(), e.data.caller_client_type && n.getOtherMember().setClientType(e.data.caller_client_type), ZCMediaDevices.syncPreferredDevices(), MediaCallAPI.updateCallStatus(n.getId(), MediaCallConstants.statusText.CALL_RECEIVED, (function(e) {
                    var t = MediaCallImpl.getFromIncomingSessions(e.call_id);
                    if (void 0 !== t) {
                        if (e.credentials) {
                            var i = t.getCurrentMember(),
                                a = e.credentials[i.getId()];
                            a && i.setTurnCredentials(a), n.writeToLog(CallLogConstants.callState.received, {
                                credentials: e.credentials
                            })
                        }
                        n.setEventTime("CALL_RECEIVED_API_RESPONSE", MediaCall.BRIDGE.Util.getSyncedCurrentTime())
                    }
                    e.devices && !ZCMediaDevices.isPreferredDevicesSynced() && ZCMediaDevices.setPreferredDevicesObject(e)
                }), (function(t) {
                    if (void 0 !== t && (MediaCallAPI.errorCodes.isCallAlreadyAnsweredError(t.code) || MediaCallAPI.errorCodes.isCallEndError(t.code))) {
                        var i = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
                        void 0 !== i && MediaCallImpl.handleEnd(i.getId(), !1)
                    }
                }), void 0, !0), n.setStatusText(MediaCallConstants.statusText.CALL_REQUESTED), n.handleIncomingCallTimeout(), n.getCurrentMember().storeRemoteTracksMediaId(e.data.tracks_media_id), n.getCurrentMember().storeRemoteSdp(JSON.parse(e.data.offer_description)), n.writeToLog(CallLogConstants.wms.offer, e.data), void 0 !== e.data.client_support && n.getOtherMember().setClientSupport(e.data.client_support), MediaCallRejectMessages.isInitialized() || MediaCallRejectMessages.init(), MediaCallUI.showCallUI(n), MediaCallImpl.playTone(n, MediaCallConstants.states.INCOMING);
                var s = "videochat.incoming.screen";
                n.isAudioCall() ? s = "videochat.incomming.audio" : n.isVideoCall() && (s = "videochat.incomming.video");
                var r = MediaUtil.getResource(s);
                MediaCall.BRIDGE.handleTitleChange(r), MediaCall.BRIDGE.Status.isDND() || MediaCall.BRIDGE.handlePushNotification({
                    type: "onetoonecall",
                    title: "@" + n.getCallerName(),
                    icon: MediaCall.BRIDGE.Users.getImgUrlById(n.getCallerId()),
                    body: r,
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
                    var i = MediaCallUI.getVideoContainer(e.data.call_id, t.getOtherMemberId());
                    MediaCallUI.setDeviceInfoIndicationInCallUI(i, t.getOtherMember(), e.data.callee_client_type)
                }
            } else {
                var a = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
                void 0 !== a && MediaCallImpl.handleEnd(a.getId(), !1)
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
                i = !1;
            t && t.getId() === e.data.call_id && (MediaCallUI.adaptUIToState(t, MediaCallConstants.states.DECLINED), t.writeToLog(CallLogConstants.wms.callDeclined)), e.data.caller_id === MediaCall.BRIDGE.Constants.ZUID && (MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.RINGING), i = !0), MediaCallImpl.handleEnd(e.data.call_id, !1, {
                showCallEndUI: i
            })
        },
        CALL_MISSED: function(e) {
            MediaCallImpl.handleEnd(e.data.call_id, !1), "undefined" != typeof CallHistoryData && e.data.callee_id === MediaCall.BRIDGE.Constants.ZUID && CallHistoryData.incrementMissedCallsCount()
        },
        CALL_MISSED_ON_BUSY: function(e) {
            var t = MediaCallImpl.getCurrentSession(),
                i = e.data.callee_id === MediaCall.BRIDGE.Constants.ZUID;
            t && t.getId() === e.data.call_id && MediaCallUI.adaptUIToState(t, MediaCallConstants.states.MISSED_ON_BUSY), MediaCallImpl.handleEnd(e.data.call_id, !1, {
                showCallEndUI: !i
            }), "undefined" != typeof CallHistoryData && i && CallHistoryData.incrementMissedCallsCount()
        },
        CALL_END: function(e) {
            var t = MediaCallImpl.getCurrentSession(),
                i = !1;
            t && t.getId() === e.data.call_id && ("undefined" != typeof RemoteWork && RemoteWork.isInRemoteWorkView() && RemoteWork.syncDetailsUI(), MediaCallImpl.getCurrentSession().writeToLog(CallLogConstants.wms.callEnd), i = !0), MediaCallImpl.handleEnd(e.data.call_id, !1, {
                playEndTone: i
            })
        },
        OFFER_SDP: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e.data.call_id) {
                t.writeToLog(CallLogConstants.wms.offer, e);
                var i = JSON.parse(e.data.offer_description),
                    a = t.getCurrentMember();
                if (a.storeRemoteTracksMediaId(e.data.tracks_media_id), a.setRemoteTurnType(e.data.turn_type), e.data.connection_state === MediaCallRTCPeerConnectionConstants.processTypes.HANDOFF) return void MediaCallImpl.connectCallHandOff(e, i);
                e.data.connection_state === MediaCallRTCPeerConnectionConstants.processTypes.REINIT ? a.reinitAnswererConnection(i) : e.data.connection_state === MediaCallRTCPeerConnectionConstants.processTypes.RENEGOTIATE ? a.renegotiateAnswererConnection(i, t.getOtherMemberId()) : a.isOfferAlreadyReceivedForReconnection(e.data.reconnection_id) || (a.setLastReconnectionId(e.data.reconnection_id), a.restartAnswererConnection(i), MediaCallImpl.handleReconnection(t, e.data.reconnection_id))
            }
        },
        ANSWER_SDP: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            t && t.getId() === e.data.call_id && (t.writeToLog(CallLogConstants.wms.answer, e.data), t.getCurrentMember().storeRemoteTracksMediaId(e.data.tracks_media_id), t.getCurrentMember().setRemoteSdp(JSON.parse(e.data.answer_description)))
        },
        ICE_CANDIDATE: function(e) {
            var t = MediaCallImpl.getCurrentSession(),
                i = JSON.parse(e.data.ice_candidates),
                a = MediaCall.isForceTurnEnabled();
            a && (i = MediaCallImpl.filterRelayCandidates(i));
            var n = MediaCallImpl.hasTurnCandidates(i);
            if (t && t.getId() === e.data.call_id) t.getCurrentMember().setRemoteIceCandidates(i), t.writeToLog(CallLogConstants.webrtc.forceTurn, a), t.writeToLog(CallLogConstants.wms.iceCandidates, e.data.ice_candidates), n && t.getOtherMember().setTurnCandidatesGenerated();
            else {
                var s = MediaCallImpl.getFromIncomingSessions(e.data.call_id);
                void 0 !== s && (s.getCurrentMember().storeRemoteIceCandidates(i), s.writeToLog(CallLogConstants.webrtc.forceTurn, a), s.writeToLog(CallLogConstants.wms.iceCandidates, e.data.ice_candidates), n && s.getOtherMember().setTurnCandidatesGenerated())
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
                var i = t.getOtherMember();
                e.data.camera ? i.handleAVStreamStatus("video", "off" === e.data.camera, e.data.action_time) : e.data.mic ? i.handleAVStreamStatus("audio", "off" === e.data.mic, e.data.action_time) : e.data.screen && ("on" === e.data.screen ? (i.setAsSharingScreen(), t.getCurrentMember().setRemoteScreenStreamInContainer(), t.setAsScreenShared()) : (i.resetSharingScreen(), MediaCallUI.removeScreenContainer(t, i.getId())))
            }
        },
        GROUP_CALL_SWITCHED: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e.data.call_id) {
                e.data.action_user === MediaCall.BRIDGE.Constants.ZUID && (t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATED), MediaCallUI.adaptUIToState(t, MediaCallConstants.states.CALL_MIGRATED), "stop" === e.data.recording_action && AdhocCallBridge.publish(t, "stopRecording", {
                    associatedSessionId: t.getAssociatedConferenceId()
                }));
                var i = t.getAssociatedConferenceId();
                ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === i ? (ConferenceImpl.getCurrentSession().resetAdhocCallDetails(), t.resetMigratedForRecording(), MediaCallImpl.handleEnd(t.getId(), !1), ConferenceUI.getConferenceWindow().removeClass("dN")) : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === i && (ZCSmartConferenceImpl.getCurrentSession().resetAdhocCallDetails(), t.resetMigratedForRecording(), MediaCallImpl.handleEnd(t.getId(), !1), ZCSmartConferenceUI.getConferenceWindow().removeClass("dN")), AdhocCallBridge.detach(t)
            }
        },
        CALL_MIGRATING: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e.data.call_id) {
                var i = e.data.recording_migration;
                t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), MediaCallHandler.UIEvents.closeAddParticipantWin(), i ? MediaCallUI.adaptUIToState(t, MediaCallConstants.states.RECORDING_PROCESSING) : MediaCallUI.adaptUIToState(t, MediaCallConstants.states.MIGRATING)
            }
        },
        CALL_MIGRATED: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t && t.getId() === e.data.call_id) {
                if (t.writeToLog(CallLogConstants.migrated, e), t.isRedirectedToCliq()) return void MediaCallImpl.handleEnd(t.getId(), !1, {
                    playEndTone: !1
                });
                var i = t.getCurrentMember(),
                    a = t.getOtherMember(),
                    n = i.isSharingScreen();
                t.setAssociatedConferenceId(e.data.associated_conference_id), t.setStatusText(MediaCallConstants.statusText.CALL_MIGRATED);
                var s = e.data.associated_conference_id,
                    r = e.data.recording_migration,
                    o = "undefined" != typeof ZCSmartConferenceImpl && ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === s,
                    l = "undefined" != typeof ConferenceImpl && ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === s;
                if (r)
                    if (t.setAsMigratedForRecording(), MediaCallUI.getMediaCallWrapper(t.getId()).removeClass("AV-call-migrating"), UI.updateBanner(I18N("media.recordings.starting.banner")), AdhocCallBridge.attach(t), o) {
                        var d = (u = ZCSmartConferenceImpl.getCurrentSession()).getVideoStreamWithUserId(i.getId()),
                            c = u.getVideoStreamWithUserId(a.getId());
                        d instanceof MediaStream && AdhocCallBridge.publish(u, "handleVideoStream", {
                            associatedSessionId: e.data.call_id,
                            videoStream: d,
                            userId: i.getId()
                        }), c instanceof MediaStream && AdhocCallBridge.publish(u, "handleVideoStream", {
                            associatedSessionId: e.data.call_id,
                            videoStream: c,
                            userId: a.getId()
                        })
                    } else if (l) {
                    var C = (p = ConferenceImpl.getCurrentSession()).getMember(a.getId()).getScreenStream();
                    C instanceof MediaStream && AdhocCallBridge.publish(p, "handleScreenStream", {
                        associatedSessionId: e.data.call_id,
                        screenStream: C,
                        userId: a.getId()
                    })
                }
                n = i.isSharingScreen();
                if (o) n && ZCSmartConferenceImpl.addScreenInSession(i.getScreenUpStream()), r || (MediaCallUI.removeCallUI(t), ZCSmartConferenceUI.getConferenceWindow().removeClass("dN")), ZCSmartConferenceUI.handleResize();
                else {
                    if (!(l || ZCJQuery("#conferencewindow") && ZCJQuery("#conferencewindow").attr("adhoccallid") === e.data.call_id)) return void MediaCallImpl.handleEnd(t.getId(), !0, {
                        playEndTone: !1
                    });
                    r || (MediaCallUI.removeCallUI(t), ConferenceUI.getConferenceWindow().removeClass("dN")), ConferenceUI.handleResize()
                }
                if (r || MediaUtil.setDarkMode(), e.data.ppt) {
                    var u, h = new Presentation(e.data.ppt);
                    if (o)(u = ZCSmartConferenceImpl.getCurrentSession()).setPresentation(h);
                    else if (l) {
                        var p;
                        (p = ConferenceImpl.getCurrentSession()).setPresentation(h)
                    }
                    h.open()
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
                i = e.data.handoff_user_id,
                a = void 0,
                n = JSON.parse(e.data.add_info);
            if (t && t.getId() === e.data.call_id) {
                var s = t.getId();
                if (i === MediaCall.BRIDGE.Constants.ZUID) "complete_handoff" === e.data.handoff_type && MediaCallImpl.closeSessionWithoutNotifyingServer(t);
                else {
                    if (e.data.caller_client_type && e.data.callee_client_type) {
                        a = t.isCaller(t.getCurrentMemberId()) ? e.data.callee_client_type : e.data.caller_client_type;
                        var r = MediaCallUI.getMediaCallWrapper(s);
                        MediaCallUI.setDeviceInfoIndicationInCallUI(r, t.getOtherMember(), a)
                    }
                    if (e.data.client_support) {
                        t.getOtherMember().setClientSupport(e.data.client_support);
                        var o = (r = MediaCallUI.getMediaCallWrapper(s)).find('[mediacallbuttons][purpose="shareOptions"]'),
                            l = o.length > 0;
                        l && !MediaCall.isWhiteBoardAllowed(t) ? (Clickoutside.clear(s + "shrdropdowncnt"), o.remove()) : !l && MediaCall.isWhiteBoardAllowed(t) && r.find('[mediacallbuttons][purpose="endCall"]').after(MediaCallTemplates.getShareButtonHtml(t))
                    }
                }
            } else {
                var d = MediaCallImpl.getHandingOffSession();
                if (d && d.getId() === e.data.call_id && (MediaCallImpl.setAVStateForHandOff(d, n[i]), e.data.caller_client_type && e.data.callee_client_type && (a = d.isCaller(d.getCurrentMemberId()) ? e.data.callee_client_type : e.data.caller_client_type, d.getOtherMember().setClientType(a)), e.data.start_time && d.setStartTime(e.data.start_time), e.data.ppt)) {
                    var c = new Presentation(e.data.ppt);
                    d.setPresentation(c)
                }
            }
        }
    },
    deviceEvents: {
        handleDeviceChange: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            if (i) {
                var a = [],
                    n = [],
                    s = void 0,
                    r = void 0,
                    o = i.getCurrentMember().getAVUpStream(),
                    l = MediaCallUI.getVideoContainer(i.getId(), i.getOtherMemberId());
                MediaCallUI.updateAudioDevicesInSessionPreview(i), i.writeToLog(CallLogConstants.ui.changedDevice, {
                    addedDevices: e,
                    removedDevices: t
                }), o && o._hasAudioTrack() && (s = o._getAudioDeviceId()), l && (r = l.find("video")[0].sinkId);
                for (var d = 0; d < e.length; d++) {
                    var c = e[d];
                    ZCMediaDevices.isAudioInputDeviceKind(c.kind) ? s && !ZCMediaDevices.isDefaultDeviceId(s) && s !== c.deviceId && a.push(c) : ZCMediaDevices.isAudioOutputDeviceKind(c.kind) && r && !ZCMediaDevices.isDefaultDeviceId(r) && r !== c.deviceId && n.push(c)
                }
                $WC.$Win.destroy("device_switched_info");
                e = {};
                a.length && (e[ZCMediaDevices.kinds.AUDIO_INPUT] = a[0]), n.length && (e[ZCMediaDevices.kinds.AUDIO_OUTPUT] = n[0]), $WC.Util.isEmptyObject(e) || (ZCMediaDevices.setPreferredDevices(e, !1), MediaCallImpl.handleAudioDeviceAdded(i, e))
            }
        }
    },
    ImageLoadEvents: {
        onError: function(e, t) {
            var i = ZCJQuery(e),
                a = MediaCallImpl.getCurrentSession();
            if ("function" == typeof MediaCall.BRIDGE.UI.getDefaultImageForUser) {
                var n = a ? a.isCaller(t) ? a.getCaller().getName() : a.getCallee().getName() : void 0;
                i.attr("src", MediaCall.BRIDGE.UI.getDefaultImageForUser(t, n))
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
                        i = $WC.$Win.current;
                    if (!$WC.Util.isEmpty(i)) return void(MinimizedWindows.canWindowBeMinimised(i) ? MinimizedWindows.handleWindowMinimise(i, t) : ($WC.$Win.destroy(i), t()));
                    if ("undefined" != typeof ImgViewer && ImgViewer.isVisible()) return void MinimizedWindows.handleWindowMinimise("imgviewer", t);
                    if ("undefined" != typeof ZAnnotator && ZAnnotator.isOpen()) return void ZAnnotator.close(t);
                    t()
                } else e()
            }
        },
        switchView: function(e, t) {
            var i = "";
            if (t.hasClass("AV-call-subview")) i = "AV-call-subview";
            else {
                if (!t.hasClass("AV-call-subview-2")) return;
                i = "AV-call-subview-2"
            }
            var a = t.parents("[callId]").attr("callId"),
                n = MediaCallImpl.getCurrentSession();
            if (n && n.getId() === a) {
                var s = MediaCallUI.getMediaCallWrapper(a);
                MediaCallUI.handleViewSwitch(s, t, i), MediaCallUI.adjustCallContainerHeight(s)
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
            }), (function(e, i) {
                i ? MediaCallUI.handleOpenFullScreen(t) : MediaCallUI.handleExitFullScreen(t)
            }))
        },
        exitFromFullScreen: function(e, t) {
            ZCMediaDomUtil.exitFullScreen()
        },
        openInPIP: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            i && (Clickoutside.handleClickOnChild(e), MediaCallImpl.switchToPIPMode(i))
        },
        exitPIP: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            i && (Clickoutside.handleClickOnChild(e), MediaCallImpl.exitFromPIPMode(i))
        },
        takeNotes: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            NotebookIntegration.openForMediaCall(i.getId(), (function() {
                NotebookIntegration.setDefaultNoteTitle(i.getOtherMember().getName()), NoteBookLHS.trackAction("OPEN_NOTE", "CALL")
            })), Clickoutside.handleClickOnChild(e)
        },
        stopCallRecording: function(e, t) {
            var i = t.parents("[callId]").attr("callId");
            Clickoutside.handleClickOnChild(e), MediaCallImpl.stopCallRecording(i)
        },
        startCallRecording: function(e, t) {
            if (!t.attr("disabled")) {
                var i = t.parents("[callId]").attr("callId");
                Clickoutside.handleClickOnChild(e), MediaCallImpl.startCallRecording(i)
            }
        },
        handleStopRecordingForAdhocCall: function(e, t) {
            MediaCallImpl.handleRecordingAction(MediaCallConstants.recordingAction.STOP_RECORDING)
        },
        handleStopAndStartRecordingForAdhocCall: function(e, t) {
            MediaCallImpl.handleRecordingAction(MediaCallConstants.recordingAction.STOP_AND_START_RECORDING)
        },
        addParticipantsToCall: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            i && i.getId() === t.parents("[callId]").attr("callId") && !t.attr("disabled") && (Clickoutside.handleClickOnChild(e), MediaCallImpl.createAddParticipantWin(i))
        },
        openChat: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            a.getId() === i && (Clickoutside.handleClickOnChild(e), "function" == typeof MediaCall.BRIDGE.handleChatOpen && MediaCall.BRIDGE.handleChatOpen(a.getChatId(), a.getOtherMemberId()))
        },
        toggleChat: function(e, t) {
            if (MediaCallImpl.hasCurrentSession()) {
                var i = t.parents("[callId]").attr("callId");
                MediaCallImpl.getCurrentSession().getId() === i && (Clickoutside.handleClickOnChild(e), void 0 === MediaCall.BRIDGE || void 0 !== MediaCall.BRIDGE.handleChatInRhs && MediaCall.BRIDGE.handleChatInRhs(i))
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
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            a && a.getId() === i && MediaUtil.playDummySoundForSession(a, t)
        },
        stopDummySoundInPreviewPage: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            a && a.getId() === i && MediaUtil.stopDummySoundForSession(a, t)
        },
        answerCall: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = t.attr("answertype");
            MediaCallUI.answerCall(i, a)
        },
        handOffCall: function(e, t) {
            var i = t.attr("session_id"),
                a = MediaCallImpl.getHandoffCallDetails(),
                n = a.type,
                s = a.caller_id,
                r = a.callee_id,
                o = MediaCallImpl.getCurrentSession();
            if (!o || o.getId() !== i) {
                var l = a.associated_conference_id,
                    d = void 0 !== l;
                if (MediaCallImpl.isAVLoadedInIntegratedUI() && !d) return void AVISCUtilBridge.handoffCall({
                    callId: i,
                    callType: n,
                    callerId: s,
                    calleeId: r
                }, () => {
                    $WC.$Win.destroy("transfer_direct_call")
                });
                d ? MediaCallImpl.checkAndHandoffMigratedMediaSession(i, l, a) : MediaCallImpl.checkAndHandoffMediaSession(i, n, s, r)
            }
        },
        closeRejectMsgBox: function(e, t) {
            MediaCallUI.removeEndCallUI(t.parents("[callId]").attr("callId"))
        },
        endCall: function(e, t) {
            var i = t.parents("[callId]").attr("callId");
            MediaCallUI.removeRejectMessageDialog(i);
            var a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === i) "undefined" != typeof RemoteWork && RemoteWork.isInRemoteWorkView() && RemoteWork.syncDetailsUI(), a.writeToLog(CallLogConstants.ui.end);
            else {
                var n = MediaCallImpl.getFromIncomingSessions(i);
                void 0 !== n && n.writeToLog(CallLogConstants.ui.end)
            }
            MediaCallImpl.handleEnd(i, !0)
        },
        showDeclineReasons: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getFromIncomingSessions(i);
            if (a && a.isInInitialState()) {
                MediaCallImpl.stopTone(MediaCallConstants.states.CALLING), MediaCallImpl.stopTone(MediaCallConstants.states.INCOMING);
                var n = MediaCallUI.getMediaCallWrapper(i);
                n.find("[impulsecontainer]").addClass("zc-av-dN");
                var s = MediaCallTemplates.getRejectMessageDialogHtml(a);
                n.append(s)
            }
        },
        sendCustomRejectMessage: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallUI.getMediaCallWrapper(i),
                n = a.find('[inputname="rejectTextBox"]').val().trim();
            MediaCallImpl.handleRejectMessage(i, n, !0), a.find('[inputname="rejectTextBox"]').val("")
        },
        sendDefaultRejectMessage: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = (MediaCallUI.getMediaCallWrapper(i), t.text());
            MediaCallImpl.handleRejectMessage(i, a, !1)
        },
        handleRejectMessageInput: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallUI.getMediaCallWrapper(i),
                n = a.find('[purpose = "sendCustomRejectMessage"]');
            a.find('[inputname="rejectTextBox"]').val().trim().length > 0 ? n.removeAttr("disabled") : n.attr("disabled", "")
        },
        shareOptions: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === i) {
                if (t.children().length > 0) return void MediaCallUI.removeShareOptionsDropDown(i);
                var n = MediaCallTemplates.getShareOptionsHtml(a);
                t.addClass("AV-call-active").removeAttr("av-tooltip-title").html(n);
                var s = i + "shrdropdowncnt";
                MediaCallUI.setContainerPositionClass(ZCJQuery("#" + s)), Clickoutside.bind({
                    event: e,
                    srcid: t.attr("id"),
                    destid: s,
                    doNotClose: function(e, t, i, a, n) {
                        return i && ZCJQuery(i.currentTarget).attr("id") === e.srcid
                    },
                    customHide: function(e) {
                        MediaCallUI.removeShareOptionsDropDown(i)
                    }
                })
            }
        },
        startPresentation: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === i) {
                if (a.getCurrentMember().isSharingScreen() || a.getOtherMember().isSharingScreen()) {
                    var n = a.getCurrentMember().isSharingScreen() ? "screenshare.stop.to.share.presentation" : "whiteboard.remote.screen.share.end";
                    return void UI.updateBanner(Resource.getRealValue(n), 2e3, !0)
                }
                if (a.hasWhiteBoard()) return void UI.updateBanner(Resource.getRealValue("whiteboard.stop.to.share.presentation"), 2e3, !0);
                if (a.hasPresentation()) {
                    var s = a.getWhiteBoardCreator();
                    return void UI.updateBanner(Resource.getRealValue("whiteboard.in.conference.limit", Users.getName(s.getId(), s.getName())), 2e3, !0)
                }
                Clickoutside.handleClickOnChild(e), $ZCUtil.loadMultipleFiles("script", MediaUtil.BRIDGE.ServerConstants.WORKDRIVE_JS_LIST, (function() {
                    WorkDriveFilePicker.showCallPresentationFilePicker(i, a.getOnetoOneCallTitle(), !a.isInPIP() && !MediaCallUI.isInMinimizedView())
                }))
            }
        },
        stopPresentation: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            a && a.getId() === i && (Clickoutside.handleClickOnChild(e), a.getPresentation().stop(a))
        },
        startWhiteBoard: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === i) {
                if (a.getCurrentMember().isSharingScreen() || a.getOtherMember().isSharingScreen()) {
                    var n = a.getCurrentMember().isSharingScreen() ? "whiteboard.local.screen.share.end" : "whiteboard.remote.screen.share.end";
                    return void UI.updateBanner(Resource.getRealValue(n), 2e3, !0)
                }
                if (a.hasPresentation()) return void UI.updateBanner(Resource.getRealValue("presentation.stop.to.share.screen"), 2e3, !0);
                if (t.children().length > 0 && MediaCallUI.removeMoreOptionsDropDown(i), Clickoutside.handleClickOnChild(e), a.hasWhiteBoard()) {
                    var s = a.getWhiteBoardCreator();
                    return void UI.updateBanner(Resource.getRealValue("whiteboard.in.conference.limit", Users.getName(s.getId(), s.getName())), 2e3, !0)
                }
                MediaCallUI.addAndGetWhiteBoardContainer(a._id, a);
                var r = {
                    title: "Whiteboard",
                    associate_id: i,
                    associate_type: "direct_call"
                };
                WhiteBoard.createAndShowWhiteBoard(r)
            }
        },
        stopWhiteBoard: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === i) {
                if (t.children().length > 0 && MediaCallUI.removeMoreOptionsDropDown(i), Clickoutside.handleClickOnChild(e), !a.hasWhiteboardStopPermission()) return;
                WhiteBoard.closeWhiteBoard(i, "direct_call", a.getCurrentWhiteBoardId())
            }
        },
        showMoreOptions: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === i) {
                if (t.children().length > 0) return void MediaCallUI.removeMoreOptionsDropDown(i);
                var n = MediaCallTemplates.getMoreOptionsHtml(a);
                t.addClass("AV-call-active").removeAttr("av-tooltip-title").html(n);
                var s = i + "dropdowncnt";
                MediaCallUI.setContainerPositionClass(ZCJQuery("#" + s)), Clickoutside.bind({
                    event: e,
                    srcid: t.attr("id"),
                    destid: s,
                    doNotClose: function(e, t, i, a, n) {
                        return i && ZCJQuery(i.currentTarget).attr("id") === e.srcid
                    },
                    customHide: function(e) {
                        MediaCallUI.removeMoreOptionsDropDown(i)
                    }
                })
            }
        },
        startScreenShare: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            i.writeToLog(CallLogConstants.ui.screen);
            var a = i.isInPIP();
            if (!i.getCurrentMember().isSharingScreen())
                if (i.hasWhiteBoard()) UI.updateBanner(Resource.getRealValue("whiteboard.stop.to.share.screen"), 2e3, !0);
                else if (i.hasPresentation()) UI.updateBanner(Resource.getRealValue("presentation.stop.to.share.screen"), 2e3, !0);
            else if (Clickoutside.handleClickOnChild(e), !MediaCall.BRIDGE.Util.Browser.isChrome() || WebRTCUserMedia.isScreenShareSupportedInNative() || ScreenShare.Extension.isInstalled())
                if (i.isMigratedForRecording()) AdhocCallBridge.publish(i, "startScreenShare", {
                    associatedSessionId: i.getAssociatedConferenceId()
                });
                else {
                    i.writeToLog(CallLogConstants.streamRequest.screen.initDuringCall), MediaCallImpl.isCurrentModeVideoCall(i) && MediaCallImpl.switchToPIPMode(i), WebRTCUserMedia.requestScreenStream((function(e) {
                        var t = MediaCallImpl.getCurrentSession();
                        if (t) {
                            MediaCall.BRIDGE && MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleScreenShareStart && MediaCall.BRIDGE.listener.handleScreenShareStart(), t.writeToLog(CallLogConstants.streamRequest.screen.success), e._getPrimaryVideoTrack().applyConstraints({
                                frameRate: {
                                    min: 15,
                                    max: 15
                                }
                            }).catch();
                            var i = t.getCurrentMember();
                            i.isMultiStreamSupported() && t.getOtherMember().isMultiStreamSupported() ? (i.addScreenInConnection(e), t.setAsScreenShared()) : i.replaceVideoWithScreenInNewConnection(e), MediaCallUI.handleScreenShareStart()
                        } else WebRTCUserMedia.closeStream(e._getType())
                    }), (function(e, t) {
                        a || MediaCallImpl.exitFromPIPMode(MediaCallImpl.getCurrentSession()), void 0 !== e && MediaManager.handleMediaError(e, t)
                    }), (function() {
                        i.writeToLog(CallLogConstants.streamRequest.screen.stopped), MediaCallHandler.UIEvents.stopScreenShare()
                    }), MediaManager.getComputerAudioConstraints(), void 0, void 0, !0)
                }
            else MediaManager.showExtensionInstallPreview("mediacallbuttons")
        },
        stopScreenShare: function(e, t) {
            if (MediaCallImpl.hasCurrentSession()) {
                var i = MediaCallImpl.getCurrentSession();
                if (i.writeToLog(CallLogConstants.ui.stopScreen), e && Clickoutside.handleClickOnChild(e), i.isMigratedForRecording()) AdhocCallBridge.publish(i, "stopScreenShare", {
                    associatedSessionId: i.getAssociatedConferenceId()
                });
                else MediaCall.BRIDGE && MediaCall.BRIDGE.listener && "function" == typeof MediaCall.BRIDGE.listener.handleScreenShareEnd && MediaCall.BRIDGE.listener.handleScreenShareEnd(), MediaCallImpl.getCurrentSession().getCurrentMember().removeScreenFromConnection(), MediaCallUI.resetScreenShareOption()
            }
        },
        stopScreenShareFromBottomBand: function(e, t) {
            MediaCallHandler.UIEvents.stopScreenShare(e, t)
        },
        closeScreenShareIndicator: function(e, t) {
            var i = ZCJQuery("#mediacall_container").find("[mediacallwrapper]");
            i.removeClass("AV-call-scrnshare-ind"), i.find("[screen_share_indicator_v2]").addClass("zc-av-hide")
        },
        switchToVideo: function(e, t) {
            MediaCallImpl.hasCurrentSession() && MediaCallImpl.switchToVideo(t.parents("[callId]").attr("callId"), e)
        },
        closeEndCall: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = void 0;
            if (ZCMediaRecorderImpl.hasCurrentRecordingSession()) a = ZCMediaRecorderImpl.getCurrentRecordingSession();
            else {
                if (!ZCMediaRecorderImpl.hasRecordedSession(i)) return void MediaCallUI.removeEndCallUI(i);
                a = ZCMediaRecorderImpl.getRecordedSession(i)
            }
            ZCMediaRecorderHandler.mediaCallUIEvents.stopMediaRecording(i), ZCMediaRecorderImpl.showCancelRecordingDialogForMediaCall(function() {
                ZCMediaRecorderImpl.handleEnd(i)
            }.bind(this), a)
        },
        callAgain: function(e, t) {
            var i = t.parents("[callId]"),
                a = i.attr("callId"),
                n = i.attr("calltype"),
                s = i.attr("calleeid");
            MediaCallUI.removeEndCallUI(a), MediaCall.initiateStartCallProcess(n, s, void 0, ZCMediaConstants.triggerSource.NO_RESPONSE_OPTIONS)
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
                var i = t.parents("[callId]").attr("callId"),
                    a = MediaCallImpl.getCurrentSession();
                a.writeToLog(CallLogConstants.ui.videoSwitchDecline), a.getId() === i && MediaCallUI.removeSwitchToVideoInfo(a)
            }
        },
        setMediaDevices: function(e, t) {
            MediaCallImpl.showMediaDeviceSettings(t.parents("[callId]").attr("callId"))
        },
        openSettings: function(e, t) {
            var i = t.parents("[callId]").attr("callId"),
                a = MediaCallImpl.getCurrentSession();
            Clickoutside.handleClickOnChild(e), a.getId() === i && ZCDirectCallDialogs.createSettingsWin(a)
        },
        switchToConnectionStatsTab: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            if (!i.isConnectionStatsTabOpened()) {
                MediaCallUI.clearActionsOnSettingsTabSwitch(i);
                var a = ZCJQuery("#av-settings-lhs");
                a.find("[settingstab]").removeClass("active"), a.find("#av-network-stats-lhs").addClass("active");
                var n = MediaCallImpl.isCurrentModeVideoCall(i),
                    s = i.getCurrentMember().isSharingScreen() || i.getOtherMember().isSharingScreen();
                ZCJQuery("#av_settings_body").html(MediaTemplates.getConnectionStatsTabHtml(n, s)), i.handleConnectionStatsTabOpen()
            }
        },
        switchToVideoEffects: function(e, t) {
            var i = ZCJQuery("#av-settings-lhs");
            i.find("[settingstab]").removeClass("active"), i.find("#av-video-effects-lhs").addClass("active");
            var a = MediaCallImpl.getCurrentSession();
            MediaCallUI.clearActionsOnSettingsTabSwitch(a);
            var n = ZCJQuery("#av_settings_body");
            n.html(MediaCallTemplates.getVideoEffectsPanel(a));
            MediaManager.setAsStreamRequested(WebRTCUserMedia.streamTypes.VIDEO_ONLY, ZCMediaConstants.mediaModules.DIRECT_CALL), WebRTCUserMedia.requestNewStreamInstance(WebRTCUserMedia.streamInstanceIds.video_effects_preview, WebRTCUserMedia.streamTypes.VIDEO_ONLY, (function(e) {
                MediaManager.resetStreamRequested();
                var t = n.find("#video_effect_preview_dom");
                t.length ? (MediaUtil.setAndPlayStreamInMediaContainer(t, e, !0), a.setVideoEffectsPreviewStream(e)) : WebRTCUserMedia.closeStreamInstance(WebRTCUserMedia.streamInstanceIds.video_effects_preview, e._getType())
            }), (function(e) {
                MediaManager.resetStreamRequested();
                var t = n.find("#video_effect_preview_dom");
                t.find("[loader]").addClass("hide"), t.find("[user_image]").removeClass("dN")
            }), void 0, MediaUtil.getVideoProcessingOptions(a))
        },
        selectVideoBackground: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            if (!i.isRequestPending(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect)) {
                var a = ZCJQuery("#av_video_effects_panel");
                a.find("[background_list] [list_item]").removeClass("zc-av-video-effects-list-item-active"), t.addClass("zc-av-video-effects-list-item-active");
                var n = i.getSelectedVideoBackground(),
                    s = i.getSelectedVideoFilter(),
                    r = t.attr("value"),
                    o = i.getVideoEffectsPreviewStream();
                if (o) {
                    var l = ZCJQuery("#av_settings_body").find("#video_effect_preview_dom"),
                        d = l.find("[loader]");
                    d.removeClass("hide");
                    var c = t.find("[loader]");
                    c.removeClass("dN"), i.setRequestAsPending(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect), MLBackgroundProcessor.applyVideoBackground(o, r, (function(e) {
                        d.addClass("hide"), c.addClass("dN"), i.setRequestAsCompleted(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect), e && (MediaUtil.setAndPlayStreamInMediaContainer(l, e, !0), i.setVideoEffectsPreviewStream(e))
                    }))
                }
                var C = r;
                (MLBackgroundProcessor.backgroundTypes.hasNoBackground(r) || MLBackgroundProcessor.backgroundTypes.isBlur(r)) && (C = MLBackgroundProcessor.backgroundTypes.images[0]);
                var u = a.find("[filters_list] [list_item]");
                u.find("img").attr("src", MLBackgroundProcessor.backgroundTypes.getThumbNailUrl(C));
                var h = u.filter(".zc-av-video-effects-list-item-active").attr("value");
                ZCJQuery("#av_settings_body").toggleClass("avcliq-effect-edited", n !== r || s !== h)
            }
        },
        selectVideoFilter: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            if (!i.isRequestPending(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect)) {
                var a = ZCJQuery("#av_video_effects_panel");
                a.find("[filters_list] [list_item]").removeClass("zc-av-video-effects-list-item-active"), t.addClass("zc-av-video-effects-list-item-active");
                var n = i.getSelectedVideoBackground(),
                    s = i.getSelectedVideoFilter(),
                    r = a.find("[background_list] [list_item].zc-av-video-effects-list-item-active").attr("value"),
                    o = t.attr("value"),
                    l = i.getVideoEffectsPreviewStream();
                if (l) {
                    var d = ZCJQuery("#av_settings_body").find("#video_effect_preview_dom"),
                        c = d.find("[loader]");
                    c.removeClass("hide");
                    var C = t.find("[loader]");
                    C.removeClass("dN"), i.setRequestAsPending(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect), MLBackgroundProcessor.applyVideoFilter(l, o, (function(e) {
                        c.addClass("hide"), C.addClass("dN"), i.setRequestAsCompleted(MediaCallConstants.requests.applyPreviewVideoBackgroundEffect), e && (MediaUtil.setAndPlayStreamInMediaContainer(d, e, !0), i.setVideoEffectsPreviewStream(e))
                    }))
                }
                ZCJQuery("#av_settings_body").toggleClass("avcliq-effect-edited", n !== r || s !== o)
            }
        },
        setVideoEffects: function(e, t) {
            var i = ZCJQuery("#av_video_effects_panel"),
                a = i.find("[background_list] [list_item].zc-av-video-effects-list-item-active").attr("value"),
                n = i.find("[filters_list] [list_item].zc-av-video-effects-list-item-active").attr("value"),
                s = MediaCallImpl.getCurrentSession();
            s.applyVideoEffects(a, n), AdhocCallBridge.publish(s, "applyVideoEffects", {
                associatedSessionId: s.getAssociatedConferenceId(),
                bgValue: a,
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
                i = MediaUtil.isValidTitle(t.val()),
                a = MediaCallImpl.userSuggestion.getSelectedListValues().length >= MediaCallImpl.userSuggestion.minLimitForAdhocCall && i;
            t.toggleClass("inpt-error", !i), e.find("[mediacallbuttons][purpose=ringAllParticipants]").attr("disabled", !a)
        },
        closeAddParticipantWin: function(e, t) {
            $WC.$Win.destroy("addparticipantstocallwin"), MediaUtil.isAVLibraryLoadedInChatbar() && MediaCall.BRIDGE.UI.closeAddParticipantWin()
        },
        ringAllParticipants: function(e, t) {
            if (MediaCallImpl.hasCurrentSession()) {
                var i = ZCJQuery("#addparticipantstocallwin"),
                    a = i.find("[mediacallbuttons][purpose=ringAllParticipants]"),
                    n = i.find('[inputname="adhoccalltitle"]'),
                    s = n.val();
                if (MediaUtil.isValidTitle(s)) {
                    var r = MediaCallImpl.getCurrentSession(),
                        o = r.getCallTypeForAdhocCall(),
                        l = MediaCallImpl.userSuggestion.getSelectedListValues();
                    r.setStatusText(MediaCallConstants.statusText.CALL_MIGRATING), $Util.Button.addLoadIconForAjax(a), $WC.Util.removeElementFromArray(l, MediaCall.BRIDGE.Constants.ZUID), MediaCallImpl.addUsersToCall(s, o, l, (function() {
                        MediaCallHandler.UIEvents.closeAddParticipantWin(), $Util.Button.showCompletionAndResetContent(a, !1)
                    }), (function() {
                        $Util.Button.showCompletionAndResetContent(a, !0), UI.updateBanner(Resource.getRealValue("apierror.message"), 2e3, !0)
                    }))
                } else n.addClass("inpt-error")
            } else MediaCallHandler.UIEvents.closeAddParticipantWin()
        }
    },
    UIToggleEvents: {
        toggleRememberVideoEffects: function(e, t) {
            var i = MediaCallImpl.getCurrentSession(),
                a = t.is(":checked");
            i.setRememberVideoEffectsStatus(a)
        },
        toggleAudioInPreviewPage: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            i && (t.is(":checked") ? MediaCallImpl.handleUnmute(i.getId(), ZCMediaConstants.muteCases.settingsToggle) : MediaCallImpl.handleMute(i.getId(), ZCMediaConstants.muteCases.settingsToggle))
        },
        toggleVideoInPreviewPage: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            i && (t.is(":checked") ? MediaCallImpl.handleVideoUnMute(i.getId(), ZCMediaConstants.muteCases.settingsToggle) : MediaCallImpl.handleVideoMute(i.getId(), ZCMediaConstants.muteCases.settingsToggle))
        },
        toggleVideoRotateConfig: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            if (i) {
                var a = t.is(":checked"),
                    n = a ? 1 : 0,
                    s = MediaCallUI.getVideoContainer(i.getId(), i.getCurrentMemberId()),
                    r = ZCJQuery("#av_settings_preview, #video_effect_preview_dom");
                MediaCall.BRIDGE.Settings.update({
                    huddle_mirror_video: n
                }), MediaUtil.changeVideoOrientation(r, a), MediaUtil.changeVideoOrientation(s, a)
            }
        }
    },
    PIPEvents: {
        onChange: function(e, t) {
            var i = MediaCallImpl.getCurrentSession();
            i && !t && (Clickoutside.handleClickOnChild(e), MediaCallImpl.exitFromPIPMode(i))
        },
        onHangup: function() {
            var e = MediaCallImpl.getCurrentSession();
            e && MediaCallImpl.handleEnd(e.getId(), !0)
        },
        onCamToggle: function(e) {
            var t = MediaCallImpl.getCurrentSession();
            if (t) {
                var i = t.getId();
                if (e) t.isAudioCall() && !t.getCurrentMember().hasSwitchedToVideo() ? MediaCallImpl.switchToVideo(i) : MediaCallImpl.handleVideoUnMute(i, ZCMediaConstants.muteCases.pip);
                else MediaCallImpl.handleVideoMute(i, ZCMediaConstants.muteCases.pip)
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
            i = this.getCurrentMember(),
            a = this.getOtherMember();
        return (MediaCall.BRIDGE.Users.getName(i.getId(), i.getName(), -1).substr(0, t) + " & " + MediaCall.BRIDGE.Users.getName(a.getId(), a.getName(), -1).substr(0, t)).trim()
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
            var i = this.getCurrentMember(),
                a = i.getAVUpStream(),
                n = a && a._hasVideoTrack(),
                s = !1,
                r = !1,
                o = !1,
                l = !1;
            this.getSelectedVideoBackground() !== e && (s = n, this.setSelectedVideoBackground(e), o = !0), this.getSelectedVideoFilter() !== t && (r = n, this.setSelectedVideoFilter(t), l = !0);
            var d = function(e, t) {
                this.setRequestAsPending(MediaCallConstants.requests.applyVideoBackgroundEffect), MLBackgroundProcessor.applyVideoFilter(e, t, function(e) {
                    this.setRequestAsCompleted(MediaCallConstants.requests.applyVideoBackgroundEffect), e && i.replaceAVUpStreamTrack(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY)
                }.bind(this))
            }.bind(this);
            s ? (this.setRequestAsPending(MediaCallConstants.requests.applyVideoBackgroundEffect), MLBackgroundProcessor.applyVideoBackground(a, e, function(e) {
                this.setRequestAsCompleted(MediaCallConstants.requests.applyVideoBackgroundEffect), e ? (r && MLBackgroundProcessor.applyVideoFilter(e, t), i.replaceAVUpStreamTrack(e, WebRTCUserMedia.streamTypes.VIDEO_ONLY)) : r && d(a, t)
            }.bind(this))) : r && d(a, t), this.canRememberVideoEffects() && (o || l) && MediaUtil.updateVideoEffectsSettings(o ? e : void 0, l ? t : void 0)
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
        this._networkPredictor = new ZCMediaNetworkPredictor(this.getId(), (function(e, t, i) {
            var a = MediaCallImpl.hasOutgoingSession() ? MediaCallImpl.getOutgoingSession() : MediaCallImpl.hasCurrentIncomingSession() ? MediaCallImpl.getCurrentIncomingSession() : MediaCallImpl.getCurrentSession();
            void 0 !== a && a.getId() === i && (a.writeToLog(CallLogConstants.networkPrediction, {
                state: e,
                calculations: t
            }), MediaCallUI.showBeforeCallNetworkInfo(a.getId(), e))
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
            i = this._members[e.callee_id],
            a = this.getCurrentMember();
        if (t.setClientSupport(e.caller_client_support), i.setClientSupport(e.callee_client_support), this._chatId = e.chat_id, this._callerName = MediaCall.BRIDGE.Users.getName(this._callerId, e.caller_name), this._calleeName = MediaCall.BRIDGE.Users.getName(this._calleeId, e.callee_name), this._startTime = e.start_time, t._name = this._callerName, i._name = this._calleeName, e.credentials) {
            var n = e.credentials[a.getId()];
            n && a.setTurnCredentials(n)
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
        var i = this.getCurrentMember();
        $WC.Util.isEmptyObject(i.getRemoteTracksMediaId()) ? this.isAudioCall() ? i.setAVDownStream(e) : this.isVideoCall() ? i.storeAVTrack(e) : this.isScreenShareWithAudioCall() ? this.isCaller(MediaCall.getCurrentUserId()) ? i.setAVDownStream(e) : i.storeAVTrack(e) : this.isCallee(MediaCall.getCurrentUserId()) && i.setAVDownStream(e) : i.handleRemoteTrackAdded(e, t)
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
        for (var i in t) {
            t[i].closeConnection(!e)
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
var MediaCallMember = function(e, t, i, a) {
    this._id = e, this._name = t, this._callId = i, this._turnCredentials = a, this._connection = void 0, this._isSharingScreen = !1, this._recordingReferenceIndex = void 0, this._isHandOffInitiator = !1, this._avUpStream = void 0, this._screenUpStream = void 0, this._avDownStream = void 0, this._screenDownStream = void 0, this._avDownStreamTracks = [], this._videoDownStreamId = void 0, this._audioDownStreamId = void 0, this._screenDownStreamId = void 0, this._remoteSdp = void 0, this._remoteIceCandidates = [], this._remoteTracksMediaId = {}, this._remoteTurnType = void 0, this._clientType = void 0, this._clientSupport = {
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
        var i = t[0],
            a = i.id,
            n = this.getRemoteTracksMediaId();
        if ("audio" == e.kind) {
            if (n.screen_audio === a)
                if (this._screenDownStreamId !== a) {
                    var s = this._screenDownStream._hasVideoTrack() ? WebRTCUserMedia.streamTypes.AUDIO_VIDEO : WebRTCUserMedia.streamTypes.AUDIO_ONLY;
                    this._screenDownStream._hasAudioTrack() ? this._screenDownStream._replacePrimaryAudioTrack(e) : this._screenDownStream._addPrimaryAudioTrack(e, s), this._screenDownStreamId = a
                } else this.pauseAndPlayScreen();
            else if (n.audio === a)
                if (void 0 === this._avDownStream) this._audioDownStreamId = a, this._avDownStream = i, this.setRemoteAVStreamInContainer();
                else if (this._audioDownStreamId !== a) {
                s = this._avDownStream._hasVideoTrack() ? WebRTCUserMedia.streamTypes.AUDIO_VIDEO : WebRTCUserMedia.streamTypes.AUDIO_ONLY;
                this._avDownStream._hasAudioTrack() ? this._avDownStream._replacePrimaryAudioTrack(e) : this._avDownStream._addPrimaryAudioTrack(e, s), this._audioDownStreamId = a
            } else this.pauseAndPlayAudioVideo()
        } else if ("video" == e.kind) {
            var r = MediaCallImpl.getCurrentSession(),
                o = r.getCurrentMember(),
                l = r.getOtherMember();
            if (n.screen === a) l.setAsSharingScreen(), this._screenDownStreamId = a, this._screenDownStream = i, this.setRemoteScreenStreamInContainer(), r.setAsScreenShared();
            else if (n.video === a) {
                if (!l.hasSwitchedToVideo()) {
                    l.setAsSwitchedToVideo();
                    var d = MediaCallUI.getMediaCallWrapper(r.getId());
                    MediaCallUI.handleSwitchToVideoLayout(), MediaCallUI.adjustCallContainerHeight(d), MediaCallUI.getVideoContainer(r.getId(), l.getId()).removeClass("AV-call-video-muted"), this.hasSwitchedToVideo() || MediaCallUI.showSwitchToVideoInfo(d)
                }
                if (void 0 === this._avDownStream) this._videoDownStreamId = a, this._avDownStream = i, this.setRemoteAVStreamInContainer();
                else if (this._videoDownStreamId !== a) {
                    s = this._avDownStream._hasAudioTrack() ? WebRTCUserMedia.streamTypes.AUDIO_VIDEO : WebRTCUserMedia.streamTypes.VIDEO_ONLY;
                    this._avDownStream._hasVideoTrack() ? this._avDownStream._replacePrimaryVideoTrack(e) : this._avDownStream._addPrimaryVideoTrack(e, s), this._videoDownStreamId = a
                } else this.pauseAndPlayAudioVideo()
            }
            d = MediaCallUI.getMediaCallWrapper(r.getId());
            var c = o.isSharingScreen() || l.isSharingScreen(),
                C = r.isVideoCall() || o.hasSwitchedToVideo() || l.hasSwitchedToVideo();
            d.toggleClass("AV-call-no-subview", !C && c), MediaUtil.handleStreamStatsVisibilityInConnectionStatsTab(r)
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
                var i = e.getOtherMember();
                i.resetSharingScreen(), this._screenDownStream = void 0, MediaCallUI.removeScreenContainer(e, i.getId())
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
    updateAVStatus: function(e, t, i) {
        if ("video" === e) {
            if (this._videoStatus.time > i) return;
            this._videoStatus.time = i, this._videoStatus.muted = t, ZCPIPManager.toggleCamInPIP(t)
        } else {
            if (this._audioStatus.time > i) return;
            this._audioStatus.time = i, this._audioStatus.muted = t, ZCPIPManager.toggleMicInPIP(t)
        }
    },
    handleAVStreamStatus: function(e, t, i) {
        var a = this.getId() === MediaCall.getCurrentUserId(),
            n = function() {
                WebRTCUserMedia.closeStream(this._avUpStream._getType()), this._avUpStream = void 0
            };
        if ("video" === e) {
            if (this._videoStatus.time > i) return;
            this._videoStatus.time = i, this._videoStatus.muted = t;
            var s = MediaCallUI.getVideoContainer(this._callId, this.getId());
            if (a) {
                var r = this.getAVUpStream();
                t && r && r._hasVideoTrack() && (WebRTCUserMedia.removeTracksInStream(r, WebRTCUserMedia.streamTypes.VIDEO_ONLY, void 0, n.bind(this)), this._connection instanceof ZCAVDirectCallPeerConnection && this._connection.detachVideoTracks()), ZCPIPManager.toggleCamInPIP(t)
            } else s.toggleClass("AV-call-video-muted", t);
            s.find("video").toggleClass("dN zc-av-dN", t)
        } else {
            if (this._audioStatus.time > i) return;
            if (this._audioStatus.time = i, this._audioStatus.muted = t, a) {
                r = this.getAVUpStream();
                if (ZCPIPManager.toggleMicInPIP(t), ZCMediaPreferences.isSpeechDetectionAllowedByUser()) return void(t ? this.detachAudioFromConnection() : this.attachAudioInConnection());
                t && r && r._hasAudioTrack() && (WebRTCUserMedia.removeTracksInStream(r, WebRTCUserMedia.streamTypes.AUDIO_ONLY, void 0, n.bind(this)), this._connection instanceof ZCAVDirectCallPeerConnection && this._connection.detachAudioTracks())
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
        MediaCall.isNewRTCConnectionEnabled() ? this._connection = new ZCAVDirectCallPeerConnection(this._callId, this.getId(), this.getId(), e, this.getTurnCredentials(), MediaCallHandler.peerConnectionEvents) : this._connection = new MediaCallRTCPeerConnection(this._callId, this.getId(), this.getId(), e, this.getTurnCredentials(), MediaCallHandler.peerConnectionEvents), this._connection.init(this.getAVUpStream(), this.getScreenUpStream())
    },
    connectConnection: function(e) {
        MediaCall.isNewRTCConnectionEnabled() ? this._connection = new ZCAVDirectCallPeerConnection(this._callId, this.getId(), e, this.getId(), this.getTurnCredentials(), MediaCallHandler.peerConnectionEvents) : this._connection = new MediaCallRTCPeerConnection(this._callId, this.getId(), e, this.getId(), this.getTurnCredentials(), MediaCallHandler.peerConnectionEvents), this._connection.setTurnType(this._remoteTurnType), this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId), this._connection.connect(this._remoteSdp, this._remoteIceCandidates, this.getAVUpStream(), this.getScreenUpStream()), this._connection.setConnectionHandshakeTimeout()
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
            var i = MediaCallUI.getMediaCallWrapper(this._callId);
            if (this.isVideoMuted()) {
                var a = i.find('[mediacallbuttons][purpose="turnOnCamera"]').addClass("dN zc-av-dN");
                MediaCallHandler.UIEvents.turnOnCamera(void 0, a)
            } else i.find('[mediacallbuttons][purpose="turnOffCamera"]').addClass("dN zc-av-dN");
            var n = function(t) {
                var i = MediaCallUI.getVideoContainer(this._callId, this.getId());
                MediaUtil.setStreamInContainer(this.getId(), i, t), this._connection.replaceVideoWithScreen(t, e)
            }.bind(this);
            WebRTCUserMedia.removeTracksInStream(t, WebRTCUserMedia.streamTypes.VIDEO_ONLY, !1, n)
        } else this.addScreenInConnection(e)
    },
    addScreenInConnection: function(e) {
        this.isSharingScreen() || (this.setScreenUpStream(e), this.setAsSharingScreen(), this._connection.attachScreenTracks(e, !MediaCallImpl.getCurrentSession().getOtherMember().isNewRTCConnectionSupported()), this._connection instanceof ZCAVDirectCallPeerConnection && MediaCallAPI.updateStreamSourceState(this._callId, "screen", "on", MediaCall.BRIDGE.Util.getSyncedCurrentTime()))
    },
    removeScreenFromConnection: function() {
        this.isSharingScreen() && (this._screenUpStream && (WebRTCUserMedia.closeStream(this._screenUpStream._getType()), this._screenUpStream = void 0, this._connection.detachScreenTracks(!MediaCallImpl.getCurrentSession().getOtherMember().isNewRTCConnectionSupported()), this._connection instanceof ZCAVDirectCallPeerConnection && MediaCallAPI.updateStreamSourceState(this._callId, "screen", "off", MediaCall.BRIDGE.Util.getSyncedCurrentTime())), this.resetSharingScreen())
    },
    handleReconnect: function(e, t, i) {
        this._remoteSdp = void 0, this._remoteIceCandidates = [], this._avDownStream = void 0, this._screenDownStream = void 0, this._avDownStreamTracks = [], this._hasAddedTransceiverForVideo = !1, i && (this._connection.restartOffererProcess(), this._connection.setRemoteTracksMediaId(this._remoteTracksMediaId))
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
        handleAVStatus: function(e, t, i) {
            var a = i.msgObj,
                n = MediaCallImpl.getCurrentSession();
            if (n && n.getId() === t) {
                var s = n.getCurrentMemberId(),
                    r = n.getOtherMemberId();
                if (n.writeToLog(CallLogConstants.wms.mediaSetting + JSON.stringify(a)), s !== a.actionUserId && a.userIds.includes(r)) {
                    var o = n.getOtherMember();
                    a.audio ? o.handleAVStreamStatus("audio", a.audio.muted, a.audio.time) : o.handleAVStreamStatus("video", a.video.muted, a.video.time)
                }
            }
        },
        handleScreenRemoved: function(e, t, i) {
            var a = MediaCallImpl.getCurrentSession(),
                n = a.getOtherMember().getId(),
                s = a.getCurrentMember().getId();
            a && a.getId() === t && (i.userId === s ? (MediaCallUI.resetScreenShareOption(), a.getCurrentMember().resetSharingScreen()) : i.userId === n && (MediaCallUI.removeScreenContainer(a, n), a.getOtherMember().resetSharingScreen()))
        },
        handleVideoStream: function(e, t, i) {
            var a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === t) {
                var n = i.videoStream,
                    s = a.getCurrentMember().getId(),
                    r = a.getOtherMember().getId();
                if (void 0 !== n && (i.userId === r || i.userId === s)) {
                    var o = MediaCallUI.getVideoContainer(t, i.userId);
                    MediaUtil.setStreamInContainer(i.userId, o, n, function() {
                        var e = MediaCallUI.getMediaCallWrapper(t);
                        MediaCallUI.adjustCallContainerHeight(e)
                    }.bind(this))
                }
            }
        },
        handleScreenStream: function(e, t, i) {
            var a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === t) {
                var n = i.screenStream,
                    s = a.getOtherMember().getId();
                if (void 0 !== n && i.userId === s && !a.isPresentationStream()) {
                    a.getOtherMember().setAsSharingScreen();
                    var r = MediaCallUI.addAndGetScreenContainer(t, s);
                    MediaUtil.setStreamInContainer(s, r, n, function() {
                        var e = MediaCallUI.getMediaCallWrapper(t);
                        MediaCallUI.adjustCallContainerHeight(e)
                    }.bind(this))
                }
            }
        },
        handleRecordingState: function(e, t, i) {
            let a = MediaCallImpl.getCurrentSession();
            if (a && a.getId() === t) {
                let e = i.state;
                "start" === e ? (a.getCurrentMember().setRecordingReferenceIndex(i.referenceIndex), i.isRepairMessage || i.action_user || MediaCallImpl.playTone(a, MediaCallConstants.states.RECORDING_STARTED)) : (a.getCurrentMember().resetRecordingReferenceIndex(), i.isRepairMessage || i.action_user || MediaCallImpl.playTone(a, MediaCallConstants.states.RECORDING_STOPPED)), MediaCallUI.updateRecordingState(t, e)
            }
        }
    },
    AdhocConferenceHandler = {
        audioMute: function(e, t, i) {
            var a = e.getId(),
                n = e.getCurrentMember();
            e.writeToLog(CallLogConstants.ui.micOff), MediaCallUI.muteAudio(e), MediaCallUI.getVideoContainer(a, n.getId()).find("[audioMutedStatus]").removeClass("dN zc-av-dN"), n.updateAVStatus("audio", !0, MediaCall.BRIDGE.Util.getSyncedCurrentTime()), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.muteAudio() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.muteAudio()
        },
        audioUnMute: function(e, t, i) {
            var a = e.getId(),
                n = e.getCurrentMember();
            MediaCallUI.unmuteAudio(e), MediaCallUI.getVideoContainer(a, n.getId()).find("[audioMutedStatus]").addClass("dN zc-av-dN"), n.updateAVStatus("audio", !1, MediaCall.BRIDGE.Util.getSyncedCurrentTime()), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.unmuteAudio() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.unmuteAudio()
        },
        videoMute: function(e, t, i) {
            var a = e.getId(),
                n = e.getCurrentMember();
            e.writeToLog(CallLogConstants.ui.camOff), MediaCallUI.muteVideo(e), MediaCallUI.getVideoContainer(a, n.getId()).find("video").addClass("dN zc-av-dN"), n.updateAVStatus("video", !0, MediaCall.BRIDGE.Util.getSyncedCurrentTime()), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.muteVideo() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.muteVideo()
        },
        videoUnMute: function(e, t, i) {
            var a = e.getId(),
                n = e.getCurrentMember();
            MediaCallUI.unmuteVideo(e);
            var s = MediaCallUI.getVideoContainer(a, n.getId());
            s.removeClass("AV-call-video-muted"), s.find("video").removeClass("dN zc-av-dN"), n.updateAVStatus("video", !1, MediaCall.BRIDGE.Util.getSyncedCurrentTime()), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.unmuteVideo() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.unmuteVideo()
        },
        startScreenShare: function(e, t, i) {
            var a = e.getId();

            function n() {
                var e = MediaCallImpl.getCurrentSession();
                e.getId() === a && (MediaCallUI.handleScreenShareStart(), e.getCurrentMember().setAsSharingScreen(), e.setAsScreenShared())
            }

            function s() {
                MediaCallHandler.UIEvents.stopScreenShare()
            }
            ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceUI.startScreenShare(n, void 0, s) : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceUI.startScreenShare(n, void 0, s)
        },
        stopScreenShare: function(e, t, i) {
            MediaCallUI.resetScreenShareOption(), e.getCurrentMember().resetSharingScreen(), ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceHandler.UIEvents.stopScreenShare() : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceHandler.UIEvents.stopScreenShare()
        },
        setMediaDevices: function(e, t, i) {
            var a = i.changedDevices;
            ConferenceImpl.hasCurrentSession() && ConferenceImpl.getCurrentSession().getId() === t ? ConferenceImpl.handleDeviceChange(ConferenceImpl.getCurrentSession(), a, !1) : ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceImpl.handleDeviceChange(ZCSmartConferenceImpl.getCurrentSession(), a, !1)
        },
        addUsers: function(e, t, i) {
            var a = i.selectedList,
                n = i.title;
            ZCSmartConferenceImpl.hasCurrentActiveSession() && ZCSmartConferenceImpl.getCurrentActiveSession().getId() === t && ConferenceAPI.invite(t, a, !1, {
                title: n,
                recording_action: i.recordingAction,
                recording_index: i.recordingIndex
            }), ZCSmartConferenceUI.closeInviteUsers(t)
        },
        applyVideoEffects: function(e, t, i) {
            ZCSmartConferenceImpl.hasCurrentSession() && ZCSmartConferenceImpl.getCurrentSession().getId() === t && ZCSmartConferenceImpl.getCurrentSession().applyVideoEffects(i.bgValue, i.filterValue)
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
var MediaCallRTCPeerConnection = function(e, t, i, a, n, s) {
    this._connectionId = e, this._hostId = t, this._offererId = i, this._answererId = a, this._connection = void 0, this._turnCredentials = n, this._avUpStream = void 0, this._screenUpStream = void 0, this._localSdp = void 0, this._remoteSdp = void 0, this._localIceCandidates = [], this._generatedCandidates = [], this._remoteIceCandidates = [], this._audioRtpSenders = [], this._videoRtpSenders = [], this._screenRtpSenders = [], this._localTracksMediaId = {}, this._remoteTracksMediaId = {}, this._canUpdateLocalIceCandidates = !1, this._iceCandidatesGatheringTimer = void 0, this._disconnectTimer = void 0, this._connectionHandshakeTimer = void 0, this._reconnectionId = 0, this._reconnectionState = MediaCall.BRIDGE.Util.Browser.isFirefox() ? WebRTCPeerConnectionConstants.iceConnectionStates.FAILED : WebRTCPeerConnectionConstants.iceConnectionStates.DISCONNECTED, this._reconnectionInterval = MediaCall.BRIDGE.Util.Browser.isFirefox() ? 0 : MediaCallRTCPeerConnectionConstants.defaultReconnectionInterval, this._processType = MediaCallRTCPeerConnectionConstants.processTypes.INIT, this._handler = s, this._turnType = MediaCallRTCPeerConnectionConstants.turnTypes.GEO, this._currentTurnConnected = !1, this._connectionTimeout = void 0, this._connectionTimeoutInterval = 5e3, this._isUsingLyra = !1, this._connectionMonitor = void 0
};
MediaCallRTCPeerConnection.prototype = {
    _getTurnServerUrls: function() {
        var e = [];
        return MediaCallRTCPeerConnectionConstants.turnTypes.isGeo(this._turnType) ? $WC.Util.isEmpty(this._turnCredentials.geo_turnurls) ? (e = this._turnCredentials.main_turnurls, this._turnType = MediaCallRTCPeerConnectionConstants.turnTypes.MAIN) : e = this._turnCredentials.geo_turnurls : MediaCallRTCPeerConnectionConstants.turnTypes.isMain(this._turnType) ? e = this._turnCredentials.main_turnurls : MediaCallRTCPeerConnectionConstants.turnTypes.isBackup(this._turnType) && ($WC.Util.isEmpty(this._turnCredentials.backup_turnurls) ? (e = this._turnCredentials.main_turnurls, this._turnType = MediaCallRTCPeerConnectionConstants.turnTypes.MAIN) : e = this._turnCredentials.backup_turnurls), e
    },
    _getConfiguration: function() {
        if ($WC.Util.isEmpty(this._turnCredentials) || $WC.Util.isEmptyObject(this._turnCredentials)) return {};
        var e = this._getTurnServerUrls(),
            t = this._turnCredentials.username,
            i = this._turnCredentials.credential,
            a = [];
        e.forEach((function(e) {
            a.push({
                urls: e,
                username: t,
                credential: i
            })
        }));
        var n = {
            iceServers: a
        };
        return this._isLyraCodecSupported() && (this._isUsingLyra = !0, n.encodedInsertableStreams = !0), "function" == typeof this._handler.isPreBindIceCandidateEnabled && this._handler.isPreBindIceCandidateEnabled(this._connectionId) && (n.iceCandidatePoolSize = 6), n
    },
    _addTracksInConnection: function() {
        void 0 !== this._avUpStream && this._addAVTracksInConnection(), void 0 !== this._screenUpStream && this._addScreenTracksInConnection()
    },
    _addAVTracksInConnection: function() {
        this._addAudioTracksInConnection(), this._addVideoTracksInConnection()
    },
    _isLyraCodecSupported: function() {
        return "function" == typeof this._handler.isLyraCodecNeeded && this._handler.isLyraCodecNeeded(this._connectionId)
    },
    _isDTXSupported: function() {
        return "function" == typeof this._handler.isDTXNeeded && this._handler.isDTXNeeded(this._connectionId)
    },
    _dummyEncoderOrDecoder: function(e, t) {
        t.enqueue(e)
    },
    _encodeTrack: function(e, t) {
        if (e) {
            var i = t ? AVLyraCodec.encodeFunction : this._dummyEncoderOrDecoder,
                a = e.createEncodedStreams(),
                n = new TransformStream({
                    transform: i
                });
            a.readable.pipeThrough(n).pipeTo(a.writable)
        }
    },
    _decodeTrack: function(e, t) {
        if (e) {
            var i = t ? AVLyraCodec.decodeFunction : this._dummyEncoderOrDecoder,
                a = e.createEncodedStreams(),
                n = new TransformStream({
                    transform: i
                });
            a.readable.pipeThrough(n).pipeTo(a.writable)
        }
    },
    isUsingLyra: function() {
        return this._isUsingLyra
    },
    _addAudioTracksInConnection: function() {
        if (!this._avUpStream._isAudioRestrictedForConnection()) {
            var e = this._isLyraCodecSupported();
            this._avUpStream.getTracks().forEach(function(t) {
                "audio" === t.kind && (e && t.applyConstraints({
                    sampleRate: 16e3
                }), this._audioRtpSenders.push(this._connection.addTrack(t, this._avUpStream)), this._localTracksMediaId.audio = this._avUpStream.id)
            }.bind(this)), e && this._encodeTrack(ZCWebRTCPeerConnectionUtil.getRTPSenderOrReceiverForTrack(this._connection.getSenders(), this._avUpStream._getPrimaryAudioTrack()), !0)
        }
    },
    _addVideoTracksInConnection: function() {
        this._avUpStream.getTracks().forEach(function(e) {
            "video" === e.kind && (this._videoRtpSenders.push(this._connection.addTrack(e, this._avUpStream)), this._localTracksMediaId.video = this._avUpStream.id)
        }.bind(this)), this._isLyraCodecSupported() && this._encodeTrack(ZCWebRTCPeerConnectionUtil.getRTPSenderOrReceiverForTrack(this._connection.getSenders(), this._avUpStream._getPrimaryVideoTrack()), !1)
    },
    _addScreenTracksInConnection: function() {
        if (this._screenUpStream.getTracks().forEach(function(e) {
                this._screenRtpSenders.push(this._connection.addTrack(e, this._screenUpStream)), this._localTracksMediaId.screen = this._screenUpStream.id, "audio" === e.kind && (this._localTracksMediaId.screen_audio = this._screenUpStream.id)
            }.bind(this)), this._isLyraCodecSupported()) {
            var e = this._connection.getSenders();
            this._encodeTrack(ZCWebRTCPeerConnectionUtil.getRTPSenderOrReceiverForTrack(e, this._screenUpStream._getPrimaryAudioTrack()), !1), this._encodeTrack(ZCWebRTCPeerConnectionUtil.getRTPSenderOrReceiverForTrack(e, this._screenUpStream._getPrimaryVideoTrack()), !1)
        }
    },
    _removeAVTracksInConnection: function() {
        this._removeAudioTracksInConnection(), this._removeVideoTracksInConnection()
    },
    _removeAudioTracksInConnection: function() {
        this._audioRtpSenders.forEach(function(e) {
            delete this._localTracksMediaId.audio, this._connection.removeTrack(e)
        }.bind(this)), this._audioRtpSenders = []
    },
    _removeVideoTracksInConnection: function() {
        this._videoRtpSenders.forEach(function(e) {
            delete this._localTracksMediaId.video, this._connection.removeTrack(e)
        }.bind(this)), this._videoRtpSenders = []
    },
    _removeScreenTracksInConnection: function() {
        this._screenRtpSenders.forEach(function(e) {
            delete this._localTracksMediaId.screen, this._localTracksMediaId.screen_audio && delete this._localTracksMediaId.screen_audio, this._connection.removeTrack(e)
        }.bind(this)), this._screenRtpSenders = []
    },
    isConnectionStateClosed: function() {
        return void 0 === this._connection || this._connection.iceConnectionState == WebRTCPeerConnectionConstants.iceConnectionStates.CLOSED
    },
    isIceConnectionStateConnected: function() {
        return this._connection.iceConnectionState == WebRTCPeerConnectionConstants.iceConnectionStates.CONNECTED
    },
    init: function(e, t) {
        this._connection = new RTCPeerConnection(this._getConfiguration()), this._bindEventHandlers(), this._avUpStream = e, this._screenUpStream = t, this._addTracksInConnection();
        var i = !1;
        void 0 !== this._avUpStream && WebRTCUserMedia.isAudioStreamType(this._avUpStream._getType()) && (i = this._handler.hasRemoteVideo(this._connectionId)), this._createOffer(this._processType, this._processType === MediaCallRTCPeerConnectionConstants.processTypes.REINIT, i, this._handler.hasRemoteScreen(this._connectionId))
    },
    connect: function(e, t, i, a) {
        this._connection = new RTCPeerConnection(this._getConfiguration()), this._bindEventHandlers(), this._remoteSdp = e, void 0 !== t && (this._remoteIceCandidates = t), this._avUpStream = i, this._screenUpStream = a, this._addTracksInConnection(), this._createAnswer(this._processType)
    },
    _bindEventHandlers: function() {
        var e = this._connection,
            t = function(e) {
                var t = e.candidate;
                if (t) {
                    if (this._handler.handleOnIceCandidate(this._connectionId, t, this._reconnectionId > 0), this._localIceCandidates.push(t), this._generatedCandidates.push(t), this.updateCandidateToConnectionMonitor([t]), !this._canUpdateLocalIceCandidates) return;
                    if (!this._iceCandidatesGatheringTimer) {
                        var i = function() {
                            this._handler.updateIceCandidates(this._connectionId, this._localIceCandidates, this._processType, this._reconnectionId), this._localIceCandidates = [], this._iceCandidatesGatheringTimer = void 0
                        }.bind(this);
                        this._iceCandidatesGatheringTimer = setTimeout(i, 100)
                    }
                }
            }.bind(this),
            i = function(t) {
                var i = e.iceConnectionState;
                if ("function" == typeof this._handler.handleIceConnectionStateChange && this._handler.handleIceConnectionStateChange(this._connectionId, i), WebRTCPeerConnectionConstants.iceConnectionStates.CONNECTED === i) {
                    var a = this._processType;
                    this._processType = MediaCallRTCPeerConnectionConstants.processTypes.INIT, clearTimeout(this._connectionHandshakeTimer), this._connectionHandshakeTimer = void 0, clearTimeout(this._disconnectTimer), this._disconnectTimer = void 0, this.clearConnectionTimeout(), this.setCurrentTurnConnectedStatus(!0), this._handler.handleConnected(this._connectionId, this._connection, this._hostId, a, this._turnType)
                } else this._reconnectionState === i && (this.clearConnectionTimeout(), this.setConnectionHandshakeTimeout(), clearTimeout(this._disconnectTimer), this._disconnectTimer = setTimeout(function() {
                    this._reconnect()
                }.bind(this), this._reconnectionInterval), this._handler.handleDisconnected(this._connectionId, this._hostId))
            }.bind(this),
            a = function(e) {
                if (this._isLyraCodecSupported()) {
                    var t = e.streams[0].id;
                    this._decodeTrack(e.receiver, this._remoteTracksMediaId.audio === t && "audio" === e.track.kind)
                }
                this._handler.handleTrack(this._connectionId, e.track, e.streams)
            }.bind(this),
            n = function(e) {
                var t = {
                    code: e.errorCode,
                    text: e.errorText,
                    hostCandidate: e.hostCandidate,
                    url: e.url,
                    iceConnectionState: this._connection.iceConnectionState,
                    iceGatheringState: this._connection.iceGatheringState
                };
                this._handler.handleIceCandidateError(this._connectionId, t)
            }.bind(this),
            s = function(t) {
                this._handler.handleIceGatheringStateChange(this._connectionId, e.iceGatheringState)
            }.bind(this),
            r = function(t) {
                this._handler.handleSignalingStateChange(this._connectionId, e.signalingState)
            }.bind(this);
        e.onicecandidate = t, e.oniceconnectionstatechange = i, e.onicecandidateerror = n, e.ontrack = a, e.onicegatheringstatechange = s, e.onsignalingstatechange = r
    },
    _createOffer: function(e, t, i, a) {
        var n = {};
        t && (n = {
            offerToReceiveAudio: !0,
            offerToReceiveVideo: !0
        }), i && "function" == typeof this._connection.addTransceiver && this._connection.addTransceiver(WebRTCUserMedia.getStreamTypeInString(WebRTCUserMedia.streamTypes.VIDEO_ONLY)), a && "function" == typeof this._connection.addTransceiver && this._connection.addTransceiver(WebRTCUserMedia.getStreamTypeInString(WebRTCUserMedia.streamTypes.SCREEN)), this._connection.createOffer(n).then(function(t) {
            t = this._mungeSDP(t), this._localSdp = t, this._connection.setLocalDescription(t).then(function() {
                this._handler.sendOffer(this._connectionId, this._localSdp, e, this._reconnectionId, this._localTracksMediaId, this._turnType)
            }.bind(this))
        }.bind(this))
    },
    _createAnswer: function(e) {
        var t = {};
        this._connection.setRemoteDescription(this._remoteSdp).then(function() {
            this._connection.createAnswer(t).then(function(t) {
                t = this._mungeSDP(t), this._localSdp = t, this._connection.setLocalDescription(t).then(function() {
                    this._handler.sendAnswer(this._connectionId, this._localSdp, e, this._reconnectionId, this._localTracksMediaId), this.updateLocalIceCandidates()
                }.bind(this))
            }.bind(this)), this.addRemoteIceCandidates()
        }.bind(this)), this.startConnectionMonitor()
    },
    attachScreenTracks: function(e) {
        this._screenUpStream = e, this._addScreenTracksInConnection(), this._renegotiate()
    },
    detachScreenTracks: function() {
        this._removeScreenTracksInConnection(), this._screenUpStream = void 0, this._renegotiate()
    },
    attachVideoTracks: function(e) {
        this._avUpStream = e, this._addVideoTracksInConnection(), this._renegotiate()
    },
    replaceTracksWithoutNegotiation: function(e, t) {
        if (this._avUpStream) {
            var i = function() {
                this.replaceTracks(e, t)
            }.bind(this);
            if (this._avUpStream = e, "function" != typeof RTCRtpSender.prototype.replaceTrack) return i();
            if (WebRTCUserMedia.isAudioStreamType(t) || WebRTCUserMedia.isAudioVideoStreamType(t)) {
                if (this._avUpStream._isAudioRestrictedForConnection()) return;
                if (0 === this._audioRtpSenders.length) return i();
                this._audioRtpSenders.forEach(function(t) {
                    t.replaceTrack(e._getPrimaryAudioTrack()).then(function() {
                        this._localTracksMediaId.audio = e.id
                    }.bind(this)).catch(i)
                }.bind(this))
            }
            if (WebRTCUserMedia.isVideoStreamType(t) || WebRTCUserMedia.isAudioVideoStreamType(t)) {
                if (0 === this._videoRtpSenders.length) return i();
                this._videoRtpSenders.forEach(function(t) {
                    t.replaceTrack(e._getPrimaryVideoTrack()).then(function() {
                        this._localTracksMediaId.video = e.id
                    }.bind(this)).catch(i)
                }.bind(this))
            }
        }
    },
    _mungeSDP: function(e) {
        return MediaUtil.isLyraCodecInitialized() && (e = AVLyraCodec.modifySDP(e)), this._isDTXSupported() && (e = {
            type: e.type,
            sdp: e.sdp.replace("useinbandfec=1", "useinbandfec=1;usedtx=1")
        }), e
    },
    attachAudioTracks: function(e) {
        this.replaceTracksWithoutNegotiation(e, WebRTCUserMedia.streamTypes.AUDIO_ONLY)
    },
    detachAudioTracks: function() {
        0 !== this._audioRtpSenders.length && this._audioRtpSenders.forEach((function(e) {
            e.replaceTrack(null)
        }))
    },
    replaceTracks: function(e, t) {
        this._avUpStream = e, WebRTCUserMedia.isAudioVideoStreamType(t) ? (this._removeAVTracksInConnection(), this._addAVTracksInConnection()) : WebRTCUserMedia.isAudioStreamType(t) ? (this._removeAudioTracksInConnection(), this._addAudioTracksInConnection()) : (this._removeVideoTracksInConnection(), this._addVideoTracksInConnection()), this._renegotiate()
    },
    replaceScreenWithVideo: function(e) {
        this._avUpStream = e, this._screenUpStream = void 0, this._reinit()
    },
    replaceVideoWithScreen: function(e, t) {
        this._avUpStream = e, this._screenUpStream = t, this._reinit()
    },
    _reinit: function() {
        this._handler.handleReinit(this._connectionId, this._hostId, this._offererId === this._hostId, this._turnType)
    },
    _renegotiate: function() {
        this._handler.handleRenegotiate(this._connectionId, this._hostId, this._offererId === this._hostId, this._turnType)
    },
    _reconnect: function() {
        this._reconnectionId++, this._handler.handleReconnect(this._connectionId, this._reconnectionId, this._hostId, this._offererId === this._hostId, this._turnType)
    },
    setConnectionHandshakeTimeout: function() {
        void 0 === this._connectionHandshakeTimer && (this._connectionHandshakeTimer = setTimeout(function() {
            this._handler.handleClosed(this._connectionId, this._hostId)
        }.bind(this), 3e4))
    },
    restartOffererProcess: function() {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.RESTART, this._closeConnection(), this.switchTurnServers(), this.init(this._avUpStream, this._screenUpStream)
    },
    restartAnswererProcess: function(e) {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.RESTART, this._closeConnection(), this.connect(e, void 0, this._avUpStream, this._screenUpStream)
    },
    reinitOfferer: function() {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.REINIT, this._closeConnection(), this.init(this._avUpStream, this._screenUpStream)
    },
    reinitAnswerer: function(e) {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.REINIT, this._closeConnection(), this.connect(e, void 0, this._avUpStream, this._screenUpStream)
    },
    renegotiateOfferer: function(e, t) {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.RENEGOTIATE, this._offererId = this._hostId, this._canUpdateLocalIceCandidates = !1, this._localIceCandidates = [], this._generatedCandidates = [], void 0 !== this._avUpStream && WebRTCUserMedia.isAudioStreamType(this._avUpStream._getType()) && (t = this._handler.hasRemoteVideo(this._connectionId)), this._createOffer(this._processType, !e, t, this._handler.hasRemoteScreen(this._connectionId))
    },
    renegotiateAnswerer: function(e, t) {
        this._processType = MediaCallRTCPeerConnectionConstants.processTypes.RENEGOTIATE, this._remoteSdp = e, this._offererId = t, this._createAnswer(this._processType)
    },
    setRemoteSdp: function(e) {
        this._remoteSdp = e, this._connection.setRemoteDescription(this._remoteSdp), "function" == typeof this._handler.canStartConnectionTimeout && this._handler.canStartConnectionTimeout(this._connectionId) && this.startConnectionTimeout(), this.startConnectionMonitor()
    },
    startConnectionMonitor: function() {
        if (this._processType === MediaCallRTCPeerConnectionConstants.processTypes.INIT) {
            let e = {
                connectionErrorCB: this._handler.handleConnectionError,
                networkAdapterActionCB: this._handler.handleNetworkAdapterOptimization,
                hasStreamCallback: this._handler.hasStreamCallback
            };
            this._connectionMonitor = new RTCConnectionMonitor(this._connectionId, this._connection, this._generatedCandidates, e), this._connectionMonitor.start(), MediaUtil.BRIDGE.ServerConstants.networkAdapterConfig && this._connectionMonitor.setNetworkAdapterConfiguration(MediaUtil.BRIDGE.ServerConstants.networkAdapterConfig)
        }
    },
    updateCandidateToConnectionMonitor: function(e) {
        this._connectionMonitor && this._connectionMonitor.updateCandidates([e])
    },
    pushStatsToConnectionMonitor: function(e) {
        this._connectionMonitor && this._connectionMonitor.pushStats(e)
    },
    getlogsFromConnectionMonitor: function() {
        if (this._connectionMonitor) return this._connectionMonitor.getOptimizationLogs()
    },
    stopConnectionMonitor: function() {
        this._connectionMonitor && this._connectionMonitor.stop()
    },
    setRemoteTracksMediaId: function(e) {
        this._remoteTracksMediaId = e
    },
    setTurnType: function(e) {
        void 0 !== e && (this._turnType = e)
    },
    isCurrentTurnConnected: function() {
        return this._currentTurnConnected
    },
    setCurrentTurnConnectedStatus: function(e) {
        this._currentTurnConnected = e
    },
    switchTurnServers: function() {
        this.isCurrentTurnConnected() ? this.setCurrentTurnConnectedStatus(!1) : MediaCallRTCPeerConnectionConstants.turnTypes.isGeo(this._turnType) ? this.setTurnType(MediaCallRTCPeerConnectionConstants.turnTypes.MAIN) : MediaCallRTCPeerConnectionConstants.turnTypes.isMain(this._turnType) ? this.setTurnType(MediaCallRTCPeerConnectionConstants.turnTypes.BACKUP) : this.setTurnType(MediaCallRTCPeerConnectionConstants.turnTypes.GEO)
    },
    updateLocalIceCandidates: function() {
        this._canUpdateLocalIceCandidates = !0, this._handler.updateIceCandidates(this._connectionId, this._localIceCandidates, this._processType, this._reconnectionId), this._localIceCandidates = []
    },
    addRemoteIceCandidates: function(e) {
        e && e.forEach(function(e) {
            this._remoteIceCandidates.push(e)
        }.bind(this));
        var t = this._connection;
        this._remoteIceCandidates.forEach((function(e) {
            t.addIceCandidate(new RTCIceCandidate(e))
        })), this._remoteIceCandidates = []
    },
    setBitRate: function(e, t) {
        var i = t === WebRTCUserMedia.streamTypes.AUDIO_ONLY ? this._audioRtpSenders : t === WebRTCUserMedia.streamTypes.VIDEO_ONLY ? this._videoRtpSenders : this._screenRtpSenders;
        i.length > 0 && i.forEach((function(t) {
            var i = t.getParameters();
            i.encodings || (i.encodings = [{}]), i.encodings[0].maxBitrate = e, t.setParameters(i)
        }))
    },
    resetBitRate: function(e) {
        var t = e === WebRTCUserMedia.streamTypes.AUDIO_ONLY ? this._audioRtpSenders : e === WebRTCUserMedia.streamTypes.VIDEO_ONLY ? this._videoRtpSenders : this._screenRtpSenders;
        t.length > 0 && t.forEach((function(e) {
            var t = e.getParameters();
            t.encodings && (t.encodings = [{}]), e.setParameters(t)
        }))
    },
    setReconnectionPolicy: function(e) {
        this._reconnectionState = MediaCall.BRIDGE.Util.Browser.isFirefox() ? WebRTCPeerConnectionConstants.iceConnectionStates.FAILED : e.event, this._reconnectionInterval = MediaCall.BRIDGE.Util.Browser.isFirefox() ? 0 : parseInt(e.interval), this._connectionTimeoutInterval = parseInt(e.connection_timeout)
    },
    _closeConnection: function() {
        clearTimeout(this._iceCandidatesGatheringTimer), this._iceCandidatesGatheringTimer = void 0, this._connection && (this._connection.close(), this._connection = void 0), this._localSdp = void 0, this._remoteSdp = void 0, this._localIceCandidates = [], this._generatedCandidates = [], this._remoteIceCandidates = [], this._audioRtpSenders = [], this._videoRtpSenders = [], this._screenRtpSenders = [], this._localTracksMediaId = {}, this._remoteTracksMediaId = {}
    },
    startConnectionTimeout: function() {
        clearTimeout(this._connectionTimeout), this._connectionTimeout = setTimeout(function() {
            void 0 === this._connection || this.isIceConnectionStateConnected() || (this._handler.handleInitialReconnection(this._connectionId, this._turnType, this._getTurnServerUrls(), this._generatedCandidates, this._remoteIceCandidates), this.setConnectionHandshakeTimeout(), this._reconnect())
        }.bind(this), this._connectionTimeoutInterval)
    },
    clearConnectionTimeout: function() {
        clearTimeout(this._connectionTimeout), this._connectionTimeout = void 0
    },
    close: function() {
        clearTimeout(this._connectionHandshakeTimer), this._connectionHandshakeTimer = void 0, clearTimeout(this._disconnectTimer), this._disconnectTimer = void 0, this.clearConnectionTimeout(), this.stopConnectionMonitor(), this._closeConnection()
    }
};
class ZCAVDirectCallPeerConnection {
    constructor(e, t, i, a, n, s) {
        this._connectionId = e, this._hostId = t, this._offererId = i, this._answererId = a, this._connection = void 0, this._turnCredentials = n, this._avUpStream = void 0, this._screenUpStream = void 0, this._localSdp = void 0, this._remoteSdp = void 0, this._localIceCandidates = [], this._generatedCandidates = [], this._remoteIceCandidates = [], this._audioRtpSenders = [], this._videoRtpSenders = [], this._screenRtpSenders = [], this._localTracksMediaId = {}, this._remoteTracksMediaId = {}, this._canUpdateLocalIceCandidates = !1, this._iceCandidatesGatheringTimer = void 0, this._connectionHandshakeTimer = void 0, this._disconnectTimer = void 0, this._reconnectionId = 0, this._reconnectTimer = void 0, this._reconnectionState = MediaCall.BRIDGE.Util.Browser.isFirefox() ? WebRTCPeerConnectionConstants.iceConnectionStates.FAILED : WebRTCPeerConnectionConstants.iceConnectionStates.DISCONNECTED, this._reconnectionInterval = MediaCall.BRIDGE.Util.Browser.isFirefox() ? 0 : MediaCallRTCPeerConnectionConstants.defaultReconnectionInterval, this._connectionTimeout = void 0, this._connectionTimeoutInterval = 5e3, this._handler = s, this._processType = MediaCallRTCPeerConnectionConstants.processTypes.INIT, this._turnType = MediaCallRTCPeerConnectionConstants.turnTypes.GEO, this._isCurrentTurnConnected = !1, this._connectionMonitor = void 0
    }
    init(e, t) {
        this._connection = new RTCPeerConnection(this._getConfiguration()), this._bindEventHandlers(), this._avUpStream = e, this._screenUpStream = t, this._addTracksInConnection(), this._addReceiveTransceivers(), this._createOffer()
    }
    connect(e, t, i, a) {
        this._connection = new RTCPeerConnection(this._getConfiguration()), this._bindEventHandlers(), this._remoteSdp = e, void 0 !== t && (this._remoteIceCandidates = t), this._avUpStream = i, this._screenUpStream = a, this._addTracksInConnection(), this._createAnswer()
    }
    _getTurnServerUrls() {
        var e = [];
        return MediaCallRTCPeerConnectionConstants.turnTypes.isGeo(this._turnType) ? $WC.Util.isEmpty(this._turnCredentials.geo_turnurls) ? (e = this._turnCredentials.main_turnurls, this._turnType = MediaCallRTCPeerConnectionConstants.turnTypes.MAIN) : e = this._turnCredentials.geo_turnurls : MediaCallRTCPeerConnectionConstants.turnTypes.isMain(this._turnType) ? e = this._turnCredentials.main_turnurls : MediaCallRTCPeerConnectionConstants.turnTypes.isBackup(this._turnType) && ($WC.Util.isEmpty(this._turnCredentials.backup_turnurls) ? (e = this._turnCredentials.main_turnurls, this._turnType = MediaCallRTCPeerConnectionConstants.turnTypes.MAIN) : e = this._turnCredentials.backup_turnurls), e
    }
    _getConfiguration() {
        if ($WC.Util.isEmpty(this._turnCredentials) || $WC.Util.isEmptyObject(this._turnCredentials)) return {};
        var e = this._getTurnServerUrls(),
            t = this._turnCredentials.username,
            i = this._turnCredentials.credential,
            a = [];
        e.forEach(e => a.push({
            urls: e,
            username: t,
            credential: i
        }));
        var n = {
            iceServers: a
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
            var i = e.iceConnectionState;
            if ("function" == typeof this._handler.handleIceConnectionStateChange && this._handler.handleIceConnectionStateChange(this._connectionId, i), WebRTCPeerConnectionConstants.iceConnectionStates.CONNECTED === i) {
                var a = this._processType;
                this._processType = MediaCallRTCPeerConnectionConstants.processTypes.INIT, this._clearConnectionHandshakeTimeout(), this._clearDisconnectTimeout(), this.clearConnectionTimeout(), this._isCurrentTurnConnected = !0, this._handler.handleConnected(this._connectionId, this._connection, this._hostId, a, this._turnType)
            } else this._reconnectionState === i && (this.clearConnectionTimeout(), this._clearConnectionHandshakeTimeout(), this.setConnectionHandshakeTimeout(), this._clearDisconnectTimeout(), this._setDisconnectTimeout(), this._handler.handleDisconnected(this._connectionId, this._hostId))
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
        }), this._localSdp = await this._connection.createOffer(t), await this._connection.setLocalDescription(this._localSdp).then(() => this._handler.sendOffer(this._connectionId, this._localSdp, this._processType, this._reconnectionId, this._localTracksMediaId, this._turnType))
    }
    async _createAnswer() {
        await this._connection.setRemoteDescription(this._remoteSdp), this.addRemoteIceCandidates(), this._localSdp = await this._connection.createAnswer(), await this._connection.setLocalDescription(this._localSdp), this._handler.sendAnswer(this._connectionId, this._localSdp, this._processType, this._reconnectionId, this._localTracksMediaId), this.updateLocalIceCandidates(), this.startConnectionMonitor()
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
        var i = t === WebRTCUserMedia.streamTypes.AUDIO_ONLY ? this._audioRtpSenders : t === WebRTCUserMedia.streamTypes.VIDEO_ONLY ? this._videoRtpSenders : this._screenRtpSenders;
        i.length > 0 && i.forEach((function(t) {
            var i = t.getParameters();
            i.encodings || (i.encodings = [{}]), i.encodings[0].maxBitrate = e, t.setParameters(i)
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
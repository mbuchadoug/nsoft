define("@ember/object/events", ["exports", "@ember/-internals/metal"], function(_exports, _metal) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "addListener", {
        enumerable: true,
        get: function get() {
            return _metal.addListener;
        }
    });
    Object.defineProperty(_exports, "removeListener", {
        enumerable: true,
        get: function get() {
            return _metal.removeListener;
        }
    });
    Object.defineProperty(_exports, "sendEvent", {
        enumerable: true,
        get: function get() {
            return _metal.sendEvent;
        }
    });
});
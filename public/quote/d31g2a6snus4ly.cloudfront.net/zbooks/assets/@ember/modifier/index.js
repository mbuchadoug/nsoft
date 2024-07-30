define("@ember/modifier/index", ["exports", "@glimmer/manager", "@ember/-internals/glimmer", "@glimmer/runtime"], function(_exports, _manager, _glimmer, _runtime) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "capabilities", {
        enumerable: true,
        get: function get() {
            return _glimmer.modifierCapabilities;
        }
    });
    Object.defineProperty(_exports, "on", {
        enumerable: true,
        get: function get() {
            return _runtime.on;
        }
    });
    Object.defineProperty(_exports, "setModifierManager", {
        enumerable: true,
        get: function get() {
            return _manager.setModifierManager;
        }
    });
});
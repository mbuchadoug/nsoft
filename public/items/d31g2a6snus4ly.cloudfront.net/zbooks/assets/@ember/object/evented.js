define("@ember/object/evented", ["exports", "@ember/-internals/runtime", "@ember/-internals/metal"], function(_exports, _runtime, _metal) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "default", {
        enumerable: true,
        get: function get() {
            return _runtime.Evented;
        }
    });
    Object.defineProperty(_exports, "on", {
        enumerable: true,
        get: function get() {
            return _metal.on;
        }
    });
});
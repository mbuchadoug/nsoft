define("@ember/object/internals", ["exports", "@ember/-internals/metal", "@ember/-internals/runtime", "@ember/-internals/utils"], function(_exports, _metal, _runtime, _utils) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "cacheFor", {
        enumerable: true,
        get: function get() {
            return _metal.getCachedValueFor;
        }
    });
    Object.defineProperty(_exports, "copy", {
        enumerable: true,
        get: function get() {
            return _runtime.copy;
        }
    });
    Object.defineProperty(_exports, "guidFor", {
        enumerable: true,
        get: function get() {
            return _utils.guidFor;
        }
    });
});
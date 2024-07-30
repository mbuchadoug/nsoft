define("@ember/array/index", ["exports", "@ember/-internals/runtime", "@ember/-internals/utils"], function(_exports, _runtime, _utils) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "A", {
        enumerable: true,
        get: function get() {
            return _runtime.A;
        }
    });
    Object.defineProperty(_exports, "default", {
        enumerable: true,
        get: function get() {
            return _runtime.Array;
        }
    });
    Object.defineProperty(_exports, "isArray", {
        enumerable: true,
        get: function get() {
            return _runtime.isArray;
        }
    });
    Object.defineProperty(_exports, "makeArray", {
        enumerable: true,
        get: function get() {
            return _utils.makeArray;
        }
    });
});
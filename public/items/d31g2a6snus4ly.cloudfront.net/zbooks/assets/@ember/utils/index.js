define("@ember/utils/index", ["exports", "@ember/-internals/metal", "@ember/-internals/utils", "@ember/-internals/runtime"], function(_exports, _metal, _utils, _runtime) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "compare", {
        enumerable: true,
        get: function get() {
            return _runtime.compare;
        }
    });
    Object.defineProperty(_exports, "isBlank", {
        enumerable: true,
        get: function get() {
            return _metal.isBlank;
        }
    });
    Object.defineProperty(_exports, "isEmpty", {
        enumerable: true,
        get: function get() {
            return _metal.isEmpty;
        }
    });
    Object.defineProperty(_exports, "isEqual", {
        enumerable: true,
        get: function get() {
            return _runtime.isEqual;
        }
    });
    Object.defineProperty(_exports, "isNone", {
        enumerable: true,
        get: function get() {
            return _metal.isNone;
        }
    });
    Object.defineProperty(_exports, "isPresent", {
        enumerable: true,
        get: function get() {
            return _metal.isPresent;
        }
    });
    Object.defineProperty(_exports, "tryInvoke", {
        enumerable: true,
        get: function get() {
            return _utils.tryInvoke;
        }
    });
    Object.defineProperty(_exports, "typeOf", {
        enumerable: true,
        get: function get() {
            return _runtime.typeOf;
        }
    });
});
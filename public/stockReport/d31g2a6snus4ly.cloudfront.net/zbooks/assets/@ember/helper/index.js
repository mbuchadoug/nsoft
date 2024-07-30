define("@ember/helper/index", ["exports", "@glimmer/manager", "@glimmer/runtime"], function(_exports, _manager, _runtime) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "array", {
        enumerable: true,
        get: function get() {
            return _runtime.array;
        }
    });
    Object.defineProperty(_exports, "capabilities", {
        enumerable: true,
        get: function get() {
            return _manager.helperCapabilities;
        }
    });
    Object.defineProperty(_exports, "concat", {
        enumerable: true,
        get: function get() {
            return _runtime.concat;
        }
    });
    Object.defineProperty(_exports, "fn", {
        enumerable: true,
        get: function get() {
            return _runtime.fn;
        }
    });
    Object.defineProperty(_exports, "get", {
        enumerable: true,
        get: function get() {
            return _runtime.get;
        }
    });
    Object.defineProperty(_exports, "hash", {
        enumerable: true,
        get: function get() {
            return _runtime.hash;
        }
    });
    Object.defineProperty(_exports, "invokeHelper", {
        enumerable: true,
        get: function get() {
            return _runtime.invokeHelper;
        }
    });
    Object.defineProperty(_exports, "setHelperManager", {
        enumerable: true,
        get: function get() {
            return _manager.setHelperManager;
        }
    });
});
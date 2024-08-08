define("@ember/object/observers", ["exports", "@ember/-internals/metal"], function(_exports, _metal) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "addObserver", {
        enumerable: true,
        get: function get() {
            return _metal.addObserver;
        }
    });
    Object.defineProperty(_exports, "removeObserver", {
        enumerable: true,
        get: function get() {
            return _metal.removeObserver;
        }
    });
});
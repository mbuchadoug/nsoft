define("@glimmer/tracking/index", ["exports", "@ember/-internals/metal"], function(_exports, _metal) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "tracked", {
        enumerable: true,
        get: function get() {
            return _metal.tracked;
        }
    });
});
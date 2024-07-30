define("@ember/version/index", ["exports", "ember/version"], function(_exports, _version) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "VERSION", {
        enumerable: true,
        get: function get() {
            return _version.default;
        }
    });
});
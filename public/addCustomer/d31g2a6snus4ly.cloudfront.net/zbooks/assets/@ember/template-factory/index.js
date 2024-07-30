define("@ember/template-factory/index", ["exports", "@glimmer/opcode-compiler"], function(_exports, _opcodeCompiler) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "createTemplateFactory", {
        enumerable: true,
        get: function get() {
            return _opcodeCompiler.templateFactory;
        }
    });
});
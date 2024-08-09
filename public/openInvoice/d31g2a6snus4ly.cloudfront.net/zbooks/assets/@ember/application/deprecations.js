define("@ember/application/deprecations", ["exports", "@ember/debug"], function(_exports, _debug) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.deprecate = deprecate;
    _exports.deprecateFunc = deprecateFunc;

    function deprecate(message, condition, options) {
        (false && !(false) && (0, _debug.deprecate)("`import { deprecate } from '@ember/application/deprecations';` has been deprecated, please update to `import { deprecate } from '@ember/debug';`", false, {
            id: 'old-deprecate-method-paths',
            until: '4.0.0',
            for: 'ember-source',
            since: {
                enabled: '3.0.0'
            }
        }));
        (false && !(condition) && (0, _debug.deprecate)(message, condition, options));
    }

    function deprecateFunc(message, options, func) {
        (false && !(false) && (0, _debug.deprecate)("`import { deprecateFunc } from '@ember/application/deprecations';` has been deprecated, please update to `import { deprecateFunc } from '@ember/debug';`", false, {
            id: 'old-deprecate-method-paths',
            until: '4.0.0',
            for: 'ember-source',
            since: {
                enabled: '3.0.0'
            }
        }));
        (0, _debug.deprecateFunc)(message, options, func);
    }
});
define("@ember/component/text-field", ["exports", "@ember/debug", "@ember/-internals/glimmer"], function(_exports, _debug, _glimmer) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    Object.defineProperty(_exports, "default", {
        enumerable: true,
        get: function get() {
            return _glimmer.TextField;
        }
    });
    if (true
        /* EMBER_MODERNIZED_BUILT_IN_COMPONENTS */
    ) {
        (false && !(false) && (0, _debug.deprecate)("Using Ember.TextField or importing from 'TextField' has been deprecated, install the " + "`@ember/legacy-built-in-components` addon and use `import { TextField } from " + "'@ember/legacy-built-in-components';` instead", false, {
            id: 'ember.built-in-components.import',
            until: '4.0.0',
            for: 'ember-source',
            since: {
                enabled: '3.27.0'
            },
            url: 'https://deprecations.emberjs.com/v3.x#toc_ember-built-in-components-import'
        }));
    }
});
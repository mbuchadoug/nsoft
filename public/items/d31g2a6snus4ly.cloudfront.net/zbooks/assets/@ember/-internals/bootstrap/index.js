define("@ember/-internals/bootstrap/index", ["@ember/-internals/environment", "@ember/-internals/overrides", "@ember/debug", "require"], function(_environment, _overrides, _debug, _require) {
    "use strict";

    (function bootstrap() {
        var Ember;
        var get = function get() {
            if (!Ember) {
                // tslint:disable-next-line: no-require-imports
                Ember = (0, _require.default)("ember").default;
            }
            return Ember;
        };
        if (false /* DEBUG */ ) {
            var defaultHandler = function defaultHandler() {
                return 'Usage of the Ember Global is deprecated. You should import the Ember module or the specific API instead.';
            };
            var handler = _overrides.onEmberGlobalAccess || defaultHandler;
            var _get = get;
            get = function get() {
                var message = handler();
                if (message !== null) {
                    (false && !(false) && (0, _debug.deprecate)(message, false, {
                        id: 'ember-global',
                        until: '4.0.0',
                        url: 'https://deprecations.emberjs.com/v3.x/#toc_ember-global',
                        for: 'ember-source',
                        since: {
                            enabled: '3.27.0'
                        }
                    }));
                }
                return _get();
            };
        }

        function defineEmber(key) {
            Object.defineProperty(_environment.context.exports, key, {
                enumerable: true,
                configurable: true,
                get: get
            });
        } // Bootstrap the global

        defineEmber('Ember');
        defineEmber('Em'); // Bootstrap Node module
        // eslint-disable-next-line no-undef

        if (typeof module === 'object' && typeof module.require === 'function') {
            // tslint:disable-next-line: no-require-imports
            module.exports = Ember = (0, _require.default)("ember").default;
        }
    })();
});
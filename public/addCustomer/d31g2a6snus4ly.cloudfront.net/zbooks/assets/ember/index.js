define("ember/index", ["exports", "require", "@ember/-internals/environment", "@ember/-internals/utils", "@ember/-internals/container", "@ember/instrumentation", "@ember/-internals/meta", "@ember/-internals/metal", "@ember/canary-features", "@ember/debug", "backburner", "@ember/-internals/console", "@ember/controller", "@ember/controller/lib/controller_mixin", "@ember/string", "@ember/service", "@ember/object", "@ember/object/compat", "@ember/-internals/runtime", "@ember/-internals/glimmer", "ember/version", "@ember/-internals/views", "@ember/-internals/routing", "@ember/-internals/extension-support", "@ember/error", "@ember/runloop", "@ember/-internals/error-handling", "@ember/-internals/owner", "@ember/application", "@ember/application/globals-resolver", "@ember/application/instance", "@ember/engine", "@ember/engine/instance", "@ember/polyfills", "@ember/deprecated-features", "@glimmer/runtime", "@glimmer/manager", "@ember/destroyable", "@ember/-internals/browser-environment"], function(_exports, _require, _environment, utils, _container, instrumentation, _meta, metal, _canaryFeatures, EmberDebug, _backburner, _console, _controller, _controller_mixin, _string, _service, _object, _compat, _runtime, _glimmer, _version, views, routing, extensionSupport, _error, _runloop, _errorHandling, _owner, _application, _globalsResolver, _instance, _engine, _instance2, _polyfills, _deprecatedFeatures, _runtime2, _manager, _destroyable, _browserEnvironment) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.default = void 0;
    // eslint-disable-next-line import/no-unresolved

    // ****@ember/-internals/environment****

    var Ember = {};
    (false && !(!_browserEnvironment.isIE) && (0, EmberDebug.deprecate)('Internet Explorer 11 will no longer be supported in the next major version of Ember. For details on the new browser support policy, see the official documentation: http://emberjs.com/browser-support', !_browserEnvironment.isIE, {
        id: '3-0-browser-support-policy',
        url: 'https://deprecations.emberjs.com/v3.x#toc_3-0-browser-support-policy',
        until: '4.0.0',
        for: 'ember-source',
        since: {
            enabled: '3.26.0'
        }
    }));
    Ember.isNamespace = true;
    Ember.toString = function() {
        return 'Ember';
    };
    Object.defineProperty(Ember, 'ENV', {
        get: _environment.getENV,
        enumerable: false
    });
    Object.defineProperty(Ember, 'lookup', {
        get: _environment.getLookup,
        set: _environment.setLookup,
        enumerable: false
    });
    if (_deprecatedFeatures.EMBER_EXTEND_PROTOTYPES) {
        Object.defineProperty(Ember, 'EXTEND_PROTOTYPES', {
            enumerable: false,
            get: function get() {
                (false && !(false) && (0, EmberDebug.deprecate)('Accessing Ember.EXTEND_PROTOTYPES is deprecated, please migrate to Ember.ENV.EXTEND_PROTOTYPES', false, {
                    id: 'ember-env.old-extend-prototypes',
                    until: '4.0.0',
                    for: 'ember-source',
                    since: {
                        enabled: '3.3.0'
                    }
                }));
                return _environment.ENV.EXTEND_PROTOTYPES;
            }
        });
    } // ****@ember/application****

    Ember.getOwner = _owner.getOwner;
    Ember.setOwner = _owner.setOwner;
    Ember.Application = _application.default;
    Ember.ApplicationInstance = _instance.default;
    Object.defineProperty(Ember, 'Resolver', {
        get: function get() {
            (false && !(false) && (0, EmberDebug.deprecate)('Using the globals resolver is deprecated. Use the ember-resolver package instead. See https://deprecations.emberjs.com/v3.x#toc_ember-deprecate-globals-resolver', false, {
                id: 'ember.globals-resolver',
                until: '4.0.0',
                url: 'https://deprecations.emberjs.com/v3.x#toc_ember-deprecate-globals-resolver',
                for: 'ember-source',
                since: {
                    enabled: '3.16.0'
                }
            }));
            return _globalsResolver.default;
        }
    });
    Object.defineProperty(Ember, 'DefaultResolver', {
        get: function get() {
            return Ember.Resolver;
        }
    }); // ****@ember/engine****

    Ember.Engine = _engine.default;
    Ember.EngineInstance = _instance2.default; // ****@ember/polyfills****

    Ember.assign = _polyfills.assign;
    Ember.merge = _polyfills.merge; // ****@ember/-internals/utils****

    Ember.generateGuid = utils.generateGuid;
    Ember.GUID_KEY = utils.GUID_KEY;
    Ember.guidFor = utils.guidFor;
    Ember.inspect = utils.inspect;
    Ember.makeArray = utils.makeArray;
    Ember.canInvoke = utils.canInvoke;
    Ember.tryInvoke = utils.tryInvoke;
    Ember.wrap = utils.wrap;
    Ember.uuid = utils.uuid; // ****@ember/-internals/container****

    Ember.Container = _container.Container;
    Ember.Registry = _container.Registry; // ****@ember/debug****

    Ember.assert = EmberDebug.assert;
    Ember.warn = EmberDebug.warn;
    Ember.debug = EmberDebug.debug;
    Ember.deprecate = EmberDebug.deprecate;
    Ember.deprecateFunc = EmberDebug.deprecateFunc;
    Ember.runInDebug = EmberDebug.runInDebug; // ****@ember/error****

    Ember.Error = _error.default;
    /**
      @public
      @class Ember.Debug
    */

    Ember.Debug = {
        registerDeprecationHandler: EmberDebug.registerDeprecationHandler,
        registerWarnHandler: EmberDebug.registerWarnHandler,
        isComputed: metal.isComputed
    }; // ****@ember/instrumentation****

    Ember.instrument = instrumentation.instrument;
    Ember.subscribe = instrumentation.subscribe;
    Ember.Instrumentation = {
        instrument: instrumentation.instrument,
        subscribe: instrumentation.subscribe,
        unsubscribe: instrumentation.unsubscribe,
        reset: instrumentation.reset
    }; // ****@ember/runloop****

    Ember.run = _runloop.run; // ****@ember/-internals/metal****
    // in globals builds

    Ember.computed = _object.computed;
    Ember._descriptor = metal.nativeDescDecorator;
    Ember._tracked = metal.tracked;
    Ember.cacheFor = metal.getCachedValueFor;
    Ember.ComputedProperty = metal.ComputedProperty;
    Ember._setClassicDecorator = metal.setClassicDecorator;
    Ember.meta = _meta.meta;
    Ember.get = metal.get;
    Ember.getWithDefault = metal.getWithDefault;
    Ember._getPath = metal._getPath;
    Ember.set = metal.set;
    Ember.trySet = metal.trySet;
    Ember.FEATURES = (0, _polyfills.assign)({
        isEnabled: _canaryFeatures.isEnabled
    }, _canaryFeatures.FEATURES);
    Ember._Cache = utils.Cache;
    Ember.on = metal.on;
    Ember.addListener = metal.addListener;
    Ember.removeListener = metal.removeListener;
    Ember.sendEvent = metal.sendEvent;
    Ember.hasListeners = metal.hasListeners;
    Ember.isNone = metal.isNone;
    Ember.isEmpty = metal.isEmpty;
    Ember.isBlank = metal.isBlank;
    Ember.isPresent = metal.isPresent;
    Ember.notifyPropertyChange = metal.notifyPropertyChange;
    Ember.beginPropertyChanges = metal.beginPropertyChanges;
    Ember.endPropertyChanges = metal.endPropertyChanges;
    Ember.changeProperties = metal.changeProperties;
    Ember.platform = {
        defineProperty: true,
        hasPropertyAccessors: true
    };
    Ember.defineProperty = metal.defineProperty;
    Ember.destroy = _destroyable.destroy;
    Ember.libraries = metal.libraries;
    Ember.getProperties = metal.getProperties;
    Ember.setProperties = metal.setProperties;
    Ember.expandProperties = metal.expandProperties;
    Ember.addObserver = metal.addObserver;
    Ember.removeObserver = metal.removeObserver;
    Ember.aliasMethod = metal.aliasMethod;
    Ember.observer = metal.observer;
    Ember.mixin = metal.mixin;
    Ember.Mixin = metal.Mixin;
    Ember._createCache = metal.createCache;
    Ember._cacheGetValue = metal.getValue;
    Ember._cacheIsConst = metal.isConst;
    Ember._registerDestructor = _destroyable.registerDestructor;
    Ember._unregisterDestructor = _destroyable.unregisterDestructor;
    Ember._associateDestroyableChild = _destroyable.associateDestroyableChild;
    Ember._assertDestroyablesDestroyed = _destroyable.assertDestroyablesDestroyed;
    Ember._enableDestroyableTracking = _destroyable.enableDestroyableTracking;
    Ember._isDestroying = _destroyable.isDestroying;
    Ember._isDestroyed = _destroyable.isDestroyed;
    /**
      A function may be assigned to `Ember.onerror` to be called when Ember
      internals encounter an error. This is useful for specialized error handling
      and reporting code.
  
      ```javascript
      import $ from 'jquery';
  
      Ember.onerror = function(error) {
        $.ajax('/report-error', 'POST', {
          stack: error.stack,
          otherInformation: 'whatever app state you want to provide'
        });
      };
      ```
  
      Internally, `Ember.onerror` is used as Backburner's error handler.
  
      @event onerror
      @for Ember
      @param {Exception} error the error object
      @public
    */

    Object.defineProperty(Ember, 'onerror', {
        get: _errorHandling.getOnerror,
        set: _errorHandling.setOnerror,
        enumerable: false
    });
    Object.defineProperty(Ember, 'testing', {
        get: EmberDebug.isTesting,
        set: EmberDebug.setTesting,
        enumerable: false
    });
    Ember._Backburner = _backburner.default; // ****@ember/-internals/console****

    if (_deprecatedFeatures.LOGGER) {
        Ember.Logger = _console.default;
    } // ****@ember/-internals/runtime****

    Ember.A = _runtime.A;
    Ember.String = {
        loc: _string.loc,
        w: _string.w,
        dasherize: _string.dasherize,
        decamelize: _string.decamelize,
        camelize: _string.camelize,
        classify: _string.classify,
        underscore: _string.underscore,
        capitalize: _string.capitalize
    };
    Ember.Object = _runtime.Object;
    Ember._RegistryProxyMixin = _runtime.RegistryProxyMixin;
    Ember._ContainerProxyMixin = _runtime.ContainerProxyMixin;
    Ember.compare = _runtime.compare;
    Ember.copy = _runtime.copy;
    Ember.isEqual = _runtime.isEqual;
    /**
    @module ember
    */

    /**
      Namespace for injection helper methods.
  
      @class inject
      @namespace Ember
      @static
      @public
    */

    Ember.inject = function inject() {
        (false && !(false) && (0, EmberDebug.assert)("Injected properties must be created through helpers, see '" + Object.keys(inject).map(function(k) {
            return "'inject." + k + "'";
        }).join(' or ') + "'"));
    };
    Ember.inject.service = _service.inject;
    Ember.inject.controller = _controller.inject;
    Ember.Array = _runtime.Array;
    Ember.Comparable = _runtime.Comparable;
    Ember.Enumerable = _runtime.Enumerable;
    Ember.ArrayProxy = _runtime.ArrayProxy;
    Ember.ObjectProxy = _runtime.ObjectProxy;
    Ember.ActionHandler = _runtime.ActionHandler;
    Ember.CoreObject = _runtime.CoreObject;
    Ember.NativeArray = _runtime.NativeArray;
    Ember.Copyable = _runtime.Copyable;
    Ember.MutableEnumerable = _runtime.MutableEnumerable;
    Ember.MutableArray = _runtime.MutableArray;
    Ember.Evented = _runtime.Evented;
    Ember.PromiseProxyMixin = _runtime.PromiseProxyMixin;
    Ember.Observable = _runtime.Observable;
    Ember.typeOf = _runtime.typeOf;
    Ember.isArray = _runtime.isArray;
    Ember.Object = _runtime.Object;
    Ember.onLoad = _application.onLoad;
    Ember.runLoadHooks = _application.runLoadHooks;
    Ember.Controller = _controller.default;
    Ember.ControllerMixin = _controller_mixin.default;
    Ember.Service = _service.default;
    Ember._ProxyMixin = _runtime._ProxyMixin;
    Ember.RSVP = _runtime.RSVP;
    Ember.Namespace = _runtime.Namespace;
    Ember._action = _object.action;
    Ember._dependentKeyCompat = _compat.dependentKeyCompat;
    /**
      Defines the hash of localized strings for the current language. Used by
      the `String.loc` helper. To localize, add string values to this
      hash.
  
      @property STRINGS
      @for Ember
      @type Object
      @private
    */

    Object.defineProperty(Ember, 'STRINGS', {
        configurable: false,
        get: _string._getStrings,
        set: _string._setStrings
    });
    /**
      Whether searching on the global for new Namespace instances is enabled.
  
      This is only exported here as to not break any addons.  Given the new
      visit API, you will have issues if you treat this as a indicator of
      booted.
  
      Internally this is only exposing a flag in Namespace.
  
      @property BOOTED
      @for Ember
      @type Boolean
      @private
    */

    Object.defineProperty(Ember, 'BOOTED', {
        configurable: false,
        enumerable: false,
        get: metal.isNamespaceSearchDisabled,
        set: metal.setNamespaceSearchDisabled
    }); // ****@ember/-internals/glimmer****

    Ember.Component = _glimmer.Component;
    _glimmer.Helper.helper = _glimmer.helper;
    Ember.Helper = _glimmer.Helper;
    if (true
        /* EMBER_MODERNIZED_BUILT_IN_COMPONENTS */
    ) {
        [
            ['Checkbox', '@ember/component/checkbox', _glimmer.Checkbox, true],
            ['TextField', '@ember/component/text-field', _glimmer.TextField, true],
            ['TextArea', '@ember/component/text-area', _glimmer.TextArea, true],
            ['LinkComponent', '@ember/routing/link-component', _glimmer.LinkComponent, true],
            ['TextSupport', null, views.TextSupport, false],
            ['TargetActionSupport', null, _runtime.TargetActionSupport, false]
        ].forEach(function(_ref) {
            var name = _ref[0],
                path = _ref[1],
                value = _ref[2],
                availableInLegacyAddon = _ref[3];
            Object.defineProperty(Ember, name, {
                get: function get() {
                    var message = "Using Ember." + name;
                    if (path !== null) {
                        message += " or importing from '" + path + "'";
                    }
                    message += " is deprecated.";
                    if (availableInLegacyAddon) {
                        message += " Install the `@ember/legacy-built-in-components` addon and use " + ("`import { " + name + " } from '@ember/legacy-built-in-components';` instead.");
                    }
                    (false && !(false) && (0, EmberDebug.deprecate)(message, false, {
                        id: 'ember.built-in-components.import',
                        until: '4.0.0',
                        for: 'ember-source',
                        since: {
                            enabled: '3.27.0'
                        },
                        url: 'https://deprecations.emberjs.com/v3.x#toc_ember-built-in-components-import'
                    }));
                    return value;
                },
                configurable: true,
                enumerable: true
            }); // Expose a non-deprecated version for tests and the @ember/legacy-built-in-components addon

            Ember["_Legacy" + name] = value;
        });
    } else {
        Ember.Checkbox = _glimmer.Checkbox;
        Ember.TextField = _glimmer.TextField;
        Ember.TextArea = _glimmer.TextArea;
        Ember.LinkComponent = _glimmer.LinkComponent;
        Ember.TextSupport = views.TextSupport;
        Ember.TargetActionSupport = _runtime.TargetActionSupport;
    }
    Ember._setComponentManager = _glimmer.setComponentManager;
    Ember._componentManagerCapabilities = _glimmer.componentCapabilities;
    Ember._setModifierManager = _manager.setModifierManager;
    Ember._modifierManagerCapabilities = _glimmer.modifierCapabilities;
    Ember._getComponentTemplate = _manager.getComponentTemplate;
    Ember._setComponentTemplate = _manager.setComponentTemplate;
    Ember._templateOnlyComponent = _runtime2.templateOnlyComponent;
    Ember._Input = _glimmer.Input;
    Ember._hash = _runtime2.hash;
    Ember._array = _runtime2.array;
    Ember._concat = _runtime2.concat;
    Ember._get = _runtime2.get;
    Ember._on = _runtime2.on;
    Ember._fn = _runtime2.fn;
    if (true
        /* EMBER_GLIMMER_HELPER_MANAGER */
    ) {
        Ember._helperManagerCapabilities = _manager.helperCapabilities;
        Ember._setHelperManager = _manager.setHelperManager;
    }
    if (true
        /* EMBER_GLIMMER_INVOKE_HELPER */
    ) {
        Ember._invokeHelper = _runtime2.invokeHelper;
    }
    Ember._captureRenderTree = EmberDebug.captureRenderTree;
    if (_environment.ENV.EXTEND_PROTOTYPES.String) {
        String.prototype.htmlSafe = function() {
            (false && !(false) && (0, EmberDebug.deprecate)("String prototype extensions are deprecated. Please import htmlSafe from '@ember/template' instead.", false, {
                id: 'ember-string.prototype-extensions',
                for: 'ember-source',
                since: {
                    enabled: '3.27.6'
                },
                until: '4.0.0',
                url: 'https://deprecations.emberjs.com/v3.x/#toc_ember-string-htmlsafe-ishtmlsafe'
            }));
            return (0, _glimmer.htmlSafe)(this);
        };
    }
    var deprecateImportFromString = function deprecateImportFromString(name, message) {
        if (message === void 0) {
            message = "Importing " + name + " from '@ember/string' is deprecated. Please import " + name + " from '@ember/template' instead.";
        }
        // Disabling this deprecation due to unintended errors in 3.25
        // See https://github.com/emberjs/ember.js/issues/19393 fo more information.
        (false && !(true) && (0, EmberDebug.deprecate)(message, true, {
            id: 'ember-string.htmlsafe-ishtmlsafe',
            for: 'ember-source',
            since: {
                enabled: '3.25'
            },
            until: '4.0.0',
            url: 'https://deprecations.emberjs.com/v3.x/#toc_ember-string-htmlsafe-ishtmlsafe'
        }));
    };
    Object.defineProperty(Ember.String, 'htmlSafe', {
        enumerable: true,
        configurable: true,
        get: function get() {
            deprecateImportFromString('htmlSafe');
            return _glimmer.htmlSafe;
        }
    });
    Object.defineProperty(Ember.String, 'isHTMLSafe', {
        enumerable: true,
        configurable: true,
        get: function get() {
            deprecateImportFromString('isHTMLSafe');
            return _glimmer.isHTMLSafe;
        }
    });
    /**
      Global hash of shared templates. This will automatically be populated
      by the build tools so that you can store your Handlebars templates in
      separate files that get loaded into JavaScript at buildtime.
  
      @property TEMPLATES
      @for Ember
      @type Object
      @private
    */

    Object.defineProperty(Ember, 'TEMPLATES', {
        get: _glimmer.getTemplates,
        set: _glimmer.setTemplates,
        configurable: false,
        enumerable: false
    });
    /**
      The semantic version
  
      @property VERSION
      @type String
      @public
    */

    Ember.VERSION = _version.default; // ****@ember/-internals/views****

    if (_deprecatedFeatures.JQUERY_INTEGRATION && !views.jQueryDisabled) {
        Object.defineProperty(Ember, '$', {
            get: function get() {
                (false && !(false) && (0, EmberDebug.deprecate)("Using Ember.$() has been deprecated, use `import jQuery from 'jquery';` instead", false, {
                    id: 'ember-views.curly-components.jquery-element',
                    until: '4.0.0',
                    url: 'https://deprecations.emberjs.com/v3.x#toc_jquery-apis',
                    for: 'ember-source',
                    since: {
                        enabled: '3.9.0'
                    }
                }));
                return views.jQuery;
            },
            configurable: true,
            enumerable: true
        });
    }
    Ember.ViewUtils = {
        isSimpleClick: views.isSimpleClick,
        getElementView: views.getElementView,
        getViewElement: views.getViewElement,
        getViewBounds: views.getViewBounds,
        getViewClientRects: views.getViewClientRects,
        getViewBoundingClientRect: views.getViewBoundingClientRect,
        getRootViews: views.getRootViews,
        getChildViews: views.getChildViews,
        isSerializationFirstNode: _glimmer.isSerializationFirstNode
    };
    Ember.ComponentLookup = views.ComponentLookup;
    Ember.EventDispatcher = views.EventDispatcher; // ****@ember/-internals/routing****

    Ember.Location = routing.Location;
    Ember.AutoLocation = routing.AutoLocation;
    Ember.HashLocation = routing.HashLocation;
    Ember.HistoryLocation = routing.HistoryLocation;
    Ember.NoneLocation = routing.NoneLocation;
    Ember.controllerFor = routing.controllerFor;
    Ember.generateControllerFactory = routing.generateControllerFactory;
    Ember.generateController = routing.generateController;
    Ember.RouterDSL = routing.RouterDSL;
    Ember.Router = routing.Router;
    Ember.Route = routing.Route;
    (0, _application.runLoadHooks)('Ember.Application', _application.default);
    Ember.DataAdapter = extensionSupport.DataAdapter;
    Ember.ContainerDebugAdapter = extensionSupport.ContainerDebugAdapter;
    var EmberHandlebars = {
        template: _glimmer.template,
        Utils: {
            escapeExpression: _glimmer.escapeExpression
        }
    };
    var EmberHTMLBars = {
        template: _glimmer.template
    };

    function defineEmberTemplateCompilerLazyLoad(key) {
        Object.defineProperty(Ember, key, {
            configurable: true,
            enumerable: true,
            get: function get() {
                if ((0, _require.has)('ember-template-compiler')) {
                    var templateCompiler = (0, _require.default)("ember-template-compiler");
                    EmberHTMLBars.precompile = EmberHandlebars.precompile = templateCompiler.precompile;
                    EmberHTMLBars.compile = EmberHandlebars.compile = templateCompiler.compile;
                    EmberHTMLBars.registerPlugin = templateCompiler.registerPlugin;
                    Object.defineProperty(Ember, 'HTMLBars', {
                        configurable: true,
                        writable: true,
                        enumerable: true,
                        value: EmberHTMLBars
                    });
                    Object.defineProperty(Ember, 'Handlebars', {
                        configurable: true,
                        writable: true,
                        enumerable: true,
                        value: EmberHandlebars
                    });
                }
                return key === 'Handlebars' ? EmberHandlebars : EmberHTMLBars;
            }
        });
    }
    defineEmberTemplateCompilerLazyLoad('HTMLBars');
    defineEmberTemplateCompilerLazyLoad('Handlebars'); // do this to ensure that Ember.Test is defined properly on the global
    // if it is present.

    function defineEmberTestingLazyLoad(key) {
        Object.defineProperty(Ember, key, {
            configurable: true,
            enumerable: true,
            get: function get() {
                if ((0, _require.has)('ember-testing')) {
                    var testing = (0, _require.default)("ember-testing");
                    var Test = testing.Test,
                        Adapter = testing.Adapter,
                        QUnitAdapter = testing.QUnitAdapter,
                        setupForTesting = testing.setupForTesting;
                    Test.Adapter = Adapter;
                    Test.QUnitAdapter = QUnitAdapter;
                    Object.defineProperty(Ember, 'Test', {
                        configurable: true,
                        writable: true,
                        enumerable: true,
                        value: Test
                    });
                    Object.defineProperty(Ember, 'setupForTesting', {
                        configurable: true,
                        writable: true,
                        enumerable: true,
                        value: setupForTesting
                    });
                    return key === 'Test' ? Test : setupForTesting;
                }
                return undefined;
            }
        });
    }
    defineEmberTestingLazyLoad('Test');
    defineEmberTestingLazyLoad('setupForTesting');
    (0, _application.runLoadHooks)('Ember');
    Ember.__loader = {
        require: _require.default,
        // eslint-disable-next-line no-undef
        define: define,
        // eslint-disable-next-line no-undef
        registry: typeof requirejs !== 'undefined' ? requirejs.entries : _require.default.entries
    };
    var _default = Ember;
    /**
     @module jquery
     @public
     */
    /**
     @class jquery
     @public
     @static
     */
    /**
      Alias for jQuery
  
      @for jquery
      @method $
      @static
      @public
    */
    _exports.default = _default;
});
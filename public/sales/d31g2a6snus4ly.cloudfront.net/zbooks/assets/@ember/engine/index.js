define("@ember/engine/index", ["exports", "@ember/engine/lib/engine-parent", "@ember/-internals/utils", "@ember/controller", "@ember/-internals/runtime", "@ember/-internals/container", "dag-map", "@ember/debug", "@ember/-internals/metal", "@ember/application/globals-resolver", "@ember/engine/instance", "@ember/-internals/routing", "@ember/-internals/extension-support", "@ember/-internals/views", "@ember/-internals/glimmer"], function(_exports, _engineParent, _utils, _controller, _runtime, _container, _dagMap, _debug, _metal, _globalsResolver, _instance, _routing, _extensionSupport, _views, _glimmer) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.default = void 0;
    Object.defineProperty(_exports, "getEngineParent", {
        enumerable: true,
        get: function get() {
            return _engineParent.getEngineParent;
        }
    });
    Object.defineProperty(_exports, "setEngineParent", {
        enumerable: true,
        get: function get() {
            return _engineParent.setEngineParent;
        }
    });

    function props(obj) {
        var properties = [];
        for (var key in obj) {
            properties.push(key);
        }
        return properties;
    }
    /**
    @module @ember/engine
    */

    /**
      The `Engine` class contains core functionality for both applications and
      engines.
  
      Each engine manages a registry that's used for dependency injection and
      exposed through `RegistryProxy`.
  
      Engines also manage initializers and instance initializers.
  
      Engines can spawn `EngineInstance` instances via `buildInstance()`.
  
      @class Engine
      @extends Ember.Namespace
      @uses RegistryProxy
      @public
    */

    var Engine = _runtime.Namespace.extend(_runtime.RegistryProxyMixin, {
        init: function init() {
            this._super.apply(this, arguments);
            this.buildRegistry();
        },
        /**
          A private flag indicating whether an engine's initializers have run yet.
           @private
          @property _initializersRan
        */
        _initializersRan: false,
        /**
          Ensure that initializers are run once, and only once, per engine.
           @private
          @method ensureInitializers
        */
        ensureInitializers: function ensureInitializers() {
            if (!this._initializersRan) {
                this.runInitializers();
                this._initializersRan = true;
            }
        },
        /**
          Create an EngineInstance for this engine.
           @public
          @method buildInstance
          @return {EngineInstance} the engine instance
        */
        buildInstance: function buildInstance(options) {
            if (options === void 0) {
                options = {};
            }
            this.ensureInitializers();
            options.base = this;
            return _instance.default.create(options);
        },
        /**
          Build and configure the registry for the current engine.
           @private
          @method buildRegistry
          @return {Ember.Registry} the configured registry
        */
        buildRegistry: function buildRegistry() {
            var registry = this.__registry__ = this.constructor.buildRegistry(this);
            return registry;
        },
        /**
          @private
          @method initializer
        */
        initializer: function initializer(options) {
            this.constructor.initializer(options);
        },
        /**
          @private
          @method instanceInitializer
        */
        instanceInitializer: function instanceInitializer(options) {
            this.constructor.instanceInitializer(options);
        },
        /**
          @private
          @method runInitializers
        */
        runInitializers: function runInitializers() {
            var _this = this;
            this._runInitializer('initializers', function(name, initializer) {
                (false && !(Boolean(initializer)) && (0, _debug.assert)("No application initializer named '" + name + "'", Boolean(initializer)));
                initializer.initialize(_this);
            });
        },
        /**
          @private
          @since 1.12.0
          @method runInstanceInitializers
        */
        runInstanceInitializers: function runInstanceInitializers(instance) {
            this._runInitializer('instanceInitializers', function(name, initializer) {
                (false && !(Boolean(initializer)) && (0, _debug.assert)("No instance initializer named '" + name + "'", Boolean(initializer)));
                initializer.initialize(instance);
            });
        },
        _runInitializer: function _runInitializer(bucketName, cb) {
            var initializersByName = (0, _metal.get)(this.constructor, bucketName);
            var initializers = props(initializersByName);
            var graph = new _dagMap.default();
            var initializer;
            for (var i = 0; i < initializers.length; i++) {
                initializer = initializersByName[initializers[i]];
                graph.add(initializer.name, initializer, initializer.before, initializer.after);
            }
            graph.topsort(cb);
        }
    });
    Engine.reopenClass({
        initializers: Object.create(null),
        instanceInitializers: Object.create(null),
        /**
          The goal of initializers should be to register dependencies and injections.
          This phase runs once. Because these initializers may load code, they are
          allowed to defer application readiness and advance it. If you need to access
          the container or store you should use an InstanceInitializer that will be run
          after all initializers and therefore after all code is loaded and the app is
          ready.
           Initializer receives an object which has the following attributes:
          `name`, `before`, `after`, `initialize`. The only required attribute is
          `initialize`, all others are optional.
           * `name` allows you to specify under which name the initializer is registered.
          This must be a unique name, as trying to register two initializers with the
          same name will result in an error.
           ```app/initializer/named-initializer.js
          import { debug } from '@ember/debug';
           export function initialize() {
            debug('Running namedInitializer!');
          }
           export default {
            name: 'named-initializer',
            initialize
          };
          ```
           * `before` and `after` are used to ensure that this initializer is ran prior
          or after the one identified by the value. This value can be a single string
          or an array of strings, referencing the `name` of other initializers.
           An example of ordering initializers, we create an initializer named `first`:
           ```app/initializer/first.js
          import { debug } from '@ember/debug';
           export function initialize() {
            debug('First initializer!');
          }
           export default {
            name: 'first',
            initialize
          };
          ```
           ```bash
          // DEBUG: First initializer!
          ```
           We add another initializer named `second`, specifying that it should run
          after the initializer named `first`:
           ```app/initializer/second.js
          import { debug } from '@ember/debug';
           export function initialize() {
            debug('Second initializer!');
          }
           export default {
            name: 'second',
            after: 'first',
            initialize
          };
          ```
           ```
          // DEBUG: First initializer!
          // DEBUG: Second initializer!
          ```
           Afterwards we add a further initializer named `pre`, this time specifying
          that it should run before the initializer named `first`:
           ```app/initializer/pre.js
          import { debug } from '@ember/debug';
           export function initialize() {
            debug('Pre initializer!');
          }
           export default {
            name: 'pre',
            before: 'first',
            initialize
          };
          ```
           ```bash
          // DEBUG: Pre initializer!
          // DEBUG: First initializer!
          // DEBUG: Second initializer!
          ```
           Finally we add an initializer named `post`, specifying it should run after
          both the `first` and the `second` initializers:
           ```app/initializer/post.js
          import { debug } from '@ember/debug';
           export function initialize() {
            debug('Post initializer!');
          }
           export default {
            name: 'post',
            after: ['first', 'second'],
            initialize
          };
          ```
           ```bash
          // DEBUG: Pre initializer!
          // DEBUG: First initializer!
          // DEBUG: Second initializer!
          // DEBUG: Post initializer!
          ```
           * `initialize` is a callback function that receives one argument,
            `application`, on which you can operate.
           Example of using `application` to register an adapter:
           ```app/initializer/api-adapter.js
          import ApiAdapter from '../utils/api-adapter';
           export function initialize(application) {
            application.register('api-adapter:main', ApiAdapter);
          }
           export default {
            name: 'post',
            after: ['first', 'second'],
            initialize
          };
          ```
           @method initializer
          @param initializer {Object}
          @public
        */
        initializer: buildInitializerMethod('initializers', 'initializer'),
        /**
          Instance initializers run after all initializers have run. Because
          instance initializers run after the app is fully set up. We have access
          to the store, container, and other items. However, these initializers run
          after code has loaded and are not allowed to defer readiness.
           Instance initializer receives an object which has the following attributes:
          `name`, `before`, `after`, `initialize`. The only required attribute is
          `initialize`, all others are optional.
           * `name` allows you to specify under which name the instanceInitializer is
          registered. This must be a unique name, as trying to register two
          instanceInitializer with the same name will result in an error.
           ```app/initializer/named-instance-initializer.js
          import { debug } from '@ember/debug';
           export function initialize() {
            debug('Running named-instance-initializer!');
          }
           export default {
            name: 'named-instance-initializer',
            initialize
          };
          ```
           * `before` and `after` are used to ensure that this initializer is ran prior
          or after the one identified by the value. This value can be a single string
          or an array of strings, referencing the `name` of other initializers.
           * See Application.initializer for discussion on the usage of before
          and after.
           Example instanceInitializer to preload data into the store.
           ```app/initializer/preload-data.js
          import $ from 'jquery';
           export function initialize(application) {
              var userConfig, userConfigEncoded, store;
              // We have a HTML escaped JSON representation of the user's basic
              // configuration generated server side and stored in the DOM of the main
              // index.html file. This allows the app to have access to a set of data
              // without making any additional remote calls. Good for basic data that is
              // needed for immediate rendering of the page. Keep in mind, this data,
              // like all local models and data can be manipulated by the user, so it
              // should not be relied upon for security or authorization.
               // Grab the encoded data from the meta tag
              userConfigEncoded = $('head meta[name=app-user-config]').attr('content');
               // Unescape the text, then parse the resulting JSON into a real object
              userConfig = JSON.parse(unescape(userConfigEncoded));
               // Lookup the store
              store = application.lookup('service:store');
               // Push the encoded JSON into the store
              store.pushPayload(userConfig);
          }
           export default {
            name: 'named-instance-initializer',
            initialize
          };
          ```
           @method instanceInitializer
          @param instanceInitializer
          @public
        */
        instanceInitializer: buildInitializerMethod('instanceInitializers', 'instance initializer'),
        /**
          This creates a registry with the default Ember naming conventions.
           It also configures the registry:
           * registered views are created every time they are looked up (they are
            not singletons)
          * registered templates are not factories; the registered value is
            returned directly.
          * the router receives the application as its `namespace` property
          * all controllers receive the router as their `target` and `controllers`
            properties
          * all controllers receive the application as their `namespace` property
          * the application view receives the application controller as its
            `controller` property
          * the application view receives the application template as its
            `defaultTemplate` property
           @method buildRegistry
          @static
          @param {Application} namespace the application for which to
            build the registry
          @return {Ember.Registry} the built registry
          @private
        */
        buildRegistry: function buildRegistry(namespace) {
            var registry = new _container.Registry({
                resolver: resolverFor(namespace)
            });
            registry.set = _metal.set;
            registry.register('application:main', namespace, {
                instantiate: false
            });
            commonSetupRegistry(registry);
            (0, _glimmer.setupEngineRegistry)(registry);
            return registry;
        },
        /**
          Set this to provide an alternate class to `DefaultResolver`
           @deprecated Use 'Resolver' instead
          @property resolver
          @public
        */
        resolver: null,
        /**
          Set this to provide an alternate class to `DefaultResolver`
           @property resolver
          @public
        */
        Resolver: null
    });
    /**
      This function defines the default lookup rules for container lookups:
  
      * templates are looked up on `Ember.TEMPLATES`
      * other names are looked up on the application after classifying the name.
        For example, `controller:post` looks up `App.PostController` by default.
      * if the default lookup fails, look for registered classes on the container
  
      This allows the application to register default injections in the container
      that could be overridden by the normal naming convention.
  
      @private
      @method resolverFor
      @param {Ember.Namespace} namespace the namespace to look for classes
      @return {*} the resolved value for a given lookup
    */

    function resolverFor(namespace) {
        var ResolverClass = (0, _metal.get)(namespace, 'Resolver') || _globalsResolver.default;
        var props = {
            namespace: namespace
        };
        return ResolverClass.create(props);
    }

    function buildInitializerMethod(bucketName, humanName) {
        return function(initializer) {
            // If this is the first initializer being added to a subclass, we are going to reopen the class
            // to make sure we have a new `initializers` object, which extends from the parent class' using
            // prototypal inheritance. Without this, attempting to add initializers to the subclass would
            // pollute the parent class as well as other subclasses.
            if (this.superclass[bucketName] !== undefined && this.superclass[bucketName] === this[bucketName]) {
                var attrs = {};
                attrs[bucketName] = Object.create(this[bucketName]);
                this.reopenClass(attrs);
            }
            (false && !(!this[bucketName][initializer.name]) && (0, _debug.assert)("The " + humanName + " '" + initializer.name + "' has already been registered", !this[bucketName][initializer.name]));
            (false && !((0, _utils.canInvoke)(initializer, 'initialize')) && (0, _debug.assert)("An " + humanName + " cannot be registered without an initialize function", (0, _utils.canInvoke)(initializer, 'initialize')));
            (false && !(initializer.name !== undefined) && (0, _debug.assert)("An " + humanName + " cannot be registered without a name property", initializer.name !== undefined));
            this[bucketName][initializer.name] = initializer;
        };
    }

    function commonSetupRegistry(registry) {
        registry.optionsForType('component', {
            singleton: false
        });
        registry.optionsForType('view', {
            singleton: false
        });
        registry.register('controller:basic', _controller.default, {
            instantiate: false
        });
        registry.injection('renderer', '_viewRegistry', '-view-registry:main');
        registry.injection('view:-outlet', 'namespace', 'application:main'); // Register the routing service...

        registry.register('service:-routing', _routing.RoutingService); // DEBUGGING

        registry.register('resolver-for-debugging:main', registry.resolver, {
            instantiate: false
        });
        registry.injection('container-debug-adapter:main', 'resolver', 'resolver-for-debugging:main'); // Custom resolver authors may want to register their own ContainerDebugAdapter with this key

        registry.register('container-debug-adapter:main', _extensionSupport.ContainerDebugAdapter);
        registry.register('component-lookup:main', _views.ComponentLookup);
    }
    var _default = Engine;
    _exports.default = _default;
});
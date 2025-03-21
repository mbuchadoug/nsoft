define("@ember/application/lib/application", ["exports", "ember-babel", "@ember/-internals/utils", "@ember/-internals/environment", "@ember/-internals/browser-environment", "@ember/debug", "@ember/runloop", "@ember/-internals/metal", "@ember/application/lib/lazy_load", "@ember/-internals/runtime", "@ember/-internals/views", "@ember/-internals/routing", "@ember/application/instance", "@ember/engine", "@ember/-internals/container", "@ember/-internals/glimmer", "@ember/deprecated-features"], function(_exports, _emberBabel, _utils, _environment, _browserEnvironment, _debug, _runloop, _metal, _lazy_load, _runtime, _views, _routing, _instance, _engine, _container, _glimmer, _deprecatedFeatures) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.default = void 0;
    var _templateObject;
    var librariesRegistered = false;
    /**
      An instance of `Application` is the starting point for every Ember
      application. It instantiates, initializes and coordinates the
      objects that make up your app.
  
      Each Ember app has one and only one `Application` object. Although
      Ember CLI creates this object implicitly, the `Application` class
      is defined in the `app/app.js`. You can define a `ready` method on the
      `Application` class, which will be run by Ember when the application is
      initialized.
  
      ```app/app.js
      const App = Application.extend({
        ready() {
          // your code here
        }
      })
      ```
  
      Because `Application` ultimately inherits from `Ember.Namespace`, any classes
      you create will have useful string representations when calling `toString()`.
      See the `Ember.Namespace` documentation for more information.
  
      While you can think of your `Application` as a container that holds the
      other classes in your application, there are several other responsibilities
      going on under-the-hood that you may want to understand. It is also important
      to understand that an `Application` is different from an `ApplicationInstance`.
      Refer to the Guides to understand the difference between these.
  
      ### Event Delegation
  
      Ember uses a technique called _event delegation_. This allows the framework
      to set up a global, shared event listener instead of requiring each view to
      do it manually. For example, instead of each view registering its own
      `mousedown` listener on its associated element, Ember sets up a `mousedown`
      listener on the `body`.
  
      If a `mousedown` event occurs, Ember will look at the target of the event and
      start walking up the DOM node tree, finding corresponding views and invoking
      their `mouseDown` method as it goes.
  
      `Application` has a number of default events that it listens for, as
      well as a mapping from lowercase events to camel-cased view method names. For
      example, the `keypress` event causes the `keyPress` method on the view to be
      called, the `dblclick` event causes `doubleClick` to be called, and so on.
  
      If there is a bubbling browser event that Ember does not listen for by
      default, you can specify custom events and their corresponding view method
      names by setting the application's `customEvents` property:
  
      ```app/app.js
      import Application from '@ember/application';
  
      let App = Application.extend({
        customEvents: {
          // add support for the paste event
          paste: 'paste'
        }
      });
      ```
  
      To prevent Ember from setting up a listener for a default event,
      specify the event name with a `null` value in the `customEvents`
      property:
  
      ```app/app.js
      import Application from '@ember/application';
  
      let App = Application.extend({
        customEvents: {
          // prevent listeners for mouseenter/mouseleave events
          mouseenter: null,
          mouseleave: null
        }
      });
      ```
  
      By default, the application sets up these event listeners on the document
      body. However, in cases where you are embedding an Ember application inside
      an existing page, you may want it to set up the listeners on an element
      inside the body.
  
      For example, if only events inside a DOM element with the ID of `ember-app`
      should be delegated, set your application's `rootElement` property:
  
      ```app/app.js
      import Application from '@ember/application';
  
      let App = Application.extend({
        rootElement: '#ember-app'
      });
      ```
  
      The `rootElement` can be either a DOM element or a jQuery-compatible selector
      string. Note that *views appended to the DOM outside the root element will
      not receive events.* If you specify a custom root element, make sure you only
      append views inside it!
  
      To learn more about the events Ember components use, see
  
      [components/handling-events](https://guides.emberjs.com/release/components/handling-events/#toc_event-names).
  
      ### Initializers
  
      To add behavior to the Application's boot process, you can define initializers in
      the `app/initializers` directory, or with `ember generate initializer` using Ember CLI.
      These files should export a named `initialize` function which will receive the created `application`
      object as its first argument.
  
      ```javascript
      export function initialize(application) {
        // application.inject('route', 'foo', 'service:foo');
      }
      ```
  
      Application initializers can be used for a variety of reasons including:
  
      - setting up external libraries
      - injecting dependencies
      - setting up event listeners in embedded apps
      - deferring the boot process using the `deferReadiness` and `advanceReadiness` APIs.
  
      ### Routing
  
      In addition to creating your application's router, `Application` is
      also responsible for telling the router when to start routing. Transitions
      between routes can be logged with the `LOG_TRANSITIONS` flag, and more
      detailed intra-transition logging can be logged with
      the `LOG_TRANSITIONS_INTERNAL` flag:
  
      ```javascript
      import Application from '@ember/application';
  
      let App = Application.create({
        LOG_TRANSITIONS: true, // basic logging of successful transitions
        LOG_TRANSITIONS_INTERNAL: true // detailed logging of all routing steps
      });
      ```
  
      By default, the router will begin trying to translate the current URL into
      application state once the browser emits the `DOMContentReady` event. If you
      need to defer routing, you can call the application's `deferReadiness()`
      method. Once routing can begin, call the `advanceReadiness()` method.
  
      If there is any setup required before routing begins, you can implement a
      `ready()` method on your app that will be invoked immediately before routing
      begins.
  
      @class Application
      @extends Engine
      @uses RegistryProxyMixin
      @public
    */

    var Application = _engine.default.extend({
        /**
          The root DOM element of the Application. This can be specified as an
          element or a
          [jQuery-compatible selector string](http://api.jquery.com/category/selectors/).
           This is the element that will be passed to the Application's,
          `eventDispatcher`, which sets up the listeners for event delegation. Every
          view in your application should be a child of the element you specify here.
           @property rootElement
          @type DOMElement
          @default 'body'
          @public
        */
        rootElement: 'body',
        /**
           @property _document
          @type Document | null
          @default 'window.document'
          @private
        */
        _document: _browserEnvironment.hasDOM ? window.document : null,
        /**
          The `Ember.EventDispatcher` responsible for delegating events to this
          application's views.
           The event dispatcher is created by the application at initialization time
          and sets up event listeners on the DOM element described by the
          application's `rootElement` property.
           See the documentation for `Ember.EventDispatcher` for more information.
           @property eventDispatcher
          @type Ember.EventDispatcher
          @default null
          @public
        */
        eventDispatcher: null,
        /**
          The DOM events for which the event dispatcher should listen.
           By default, the application's `Ember.EventDispatcher` listens
          for a set of standard DOM events, such as `mousedown` and
          `keyup`, and delegates them to your application's `Ember.View`
          instances.
           If you would like additional bubbling events to be delegated to your
          views, set your `Application`'s `customEvents` property
          to a hash containing the DOM event name as the key and the
          corresponding view method name as the value. Setting an event to
          a value of `null` will prevent a default event listener from being
          added for that event.
           To add new events to be listened to:
           ```app/app.js
          import Application from '@ember/application';
           let App = Application.extend({
            customEvents: {
              // add support for the paste event
              paste: 'paste'
            }
          });
          ```
           To prevent default events from being listened to:
           ```app/app.js
          import Application from '@ember/application';
           let App = Application.extend({
            customEvents: {
              // remove support for mouseenter / mouseleave events
              mouseenter: null,
              mouseleave: null
            }
          });
          ```
          @property customEvents
          @type Object
          @default null
          @public
        */
        customEvents: null,
        /**
          Whether the application should automatically start routing and render
          templates to the `rootElement` on DOM ready. While default by true,
          other environments such as FastBoot or a testing harness can set this
          property to `false` and control the precise timing and behavior of the boot
          process.
           @property autoboot
          @type Boolean
          @default true
          @private
        */
        autoboot: true,
        /**
          Whether the application should be configured for the legacy "globals mode".
          Under this mode, the Application object serves as a global namespace for all
          classes.
           ```javascript
          import Application from '@ember/application';
          import Component from '@ember/component';
           let App = Application.create({
            ...
          });
           App.Router.reopen({
            location: 'none'
          });
           App.Router.map({
            ...
          });
           App.MyComponent = Component.extend({
            ...
          });
          ```
           This flag also exposes other internal APIs that assumes the existence of
          a special "default instance", like `App.__container__.lookup(...)`.
           This option is currently not configurable, its value is derived from
          the `autoboot` flag – disabling `autoboot` also implies opting-out of
          globals mode support, although they are ultimately orthogonal concerns.
           Some of the global modes features are already deprecated in 1.x. The
          existence of this flag is to untangle the globals mode code paths from
          the autoboot code paths, so that these legacy features can be reviewed
          for deprecation/removal separately.
           Forcing the (autoboot=true, _globalsMode=false) here and running the tests
          would reveal all the places where we are still relying on these legacy
          behavior internally (mostly just tests).
           @property _globalsMode
          @type Boolean
          @default true
          @private
        */
        _globalsMode: true,
        /**
          An array of application instances created by `buildInstance()`. Used
          internally to ensure that all instances get destroyed.
           @property _applicationInstances
          @type Array
          @default null
          @private
        */
        _applicationInstances: null,
        init: function init() {
            // eslint-disable-line no-unused-vars
            this._super.apply(this, arguments);
            if (!this.$) {
                this.$ = _views.jQuery;
            }
            registerLibraries();
            if (false /* DEBUG */ ) {
                if (_environment.ENV.LOG_VERSION) {
                    // we only need to see this once per Application#init
                    _environment.ENV.LOG_VERSION = false;
                    _metal.libraries.logVersions();
                }
            } // Start off the number of deferrals at 1. This will be decremented by
            // the Application's own `boot` method.

            this._readinessDeferrals = 1;
            this._booted = false;
            this._applicationInstances = new Set();
            this.autoboot = this._globalsMode = Boolean(this.autoboot);
            if (this._globalsMode) {
                this._prepareForGlobalsMode();
            }
            if (this.autoboot) {
                this.waitForDOMReady();
            }
        },
        /**
          Create an ApplicationInstance for this application.
           @public
          @method buildInstance
          @return {ApplicationInstance} the application instance
        */
        buildInstance: function buildInstance(options) {
            if (options === void 0) {
                options = {};
            }
            (false && !(!this.isDestroyed) && (0, _debug.assert)('You cannot build new instances of this application since it has already been destroyed', !this.isDestroyed));
            (false && !(!this.isDestroying) && (0, _debug.assert)('You cannot build new instances of this application since it is being destroyed', !this.isDestroying));
            options.base = this;
            options.application = this;
            return _instance.default.create(options);
        },
        /**
          Start tracking an ApplicationInstance for this application.
          Used when the ApplicationInstance is created.
           @private
          @method _watchInstance
        */
        _watchInstance: function _watchInstance(instance) {
            this._applicationInstances.add(instance);
        },
        /**
          Stop tracking an ApplicationInstance for this application.
          Used when the ApplicationInstance is about to be destroyed.
           @private
          @method _unwatchInstance
        */
        _unwatchInstance: function _unwatchInstance(instance) {
            return this._applicationInstances.delete(instance);
        },
        /**
          Enable the legacy globals mode by allowing this application to act
          as a global namespace. See the docs on the `_globalsMode` property
          for details.
           Most of these features are already deprecated in 1.x, so we can
          stop using them internally and try to remove them.
           @private
          @method _prepareForGlobalsMode
        */
        _prepareForGlobalsMode: function _prepareForGlobalsMode() {
            // Create subclass of Router for this Application instance.
            // This is to ensure that someone reopening `App.Router` does not
            // tamper with the default `Router`.
            this.Router = (this.Router || _routing.Router).extend();
            this._buildDeprecatedInstance();
        },
        /*
          Build the deprecated instance for legacy globals mode support.
          Called when creating and resetting the application.
           This is orthogonal to autoboot: the deprecated instance needs to
          be created at Application construction (not boot) time to expose
          App.__container__. If autoboot sees that this instance exists,
          it will continue booting it to avoid doing unncessary work (as
          opposed to building a new instance at boot time), but they are
          otherwise unrelated.
           @private
          @method _buildDeprecatedInstance
        */
        _buildDeprecatedInstance: function _buildDeprecatedInstance() {
            // Build a default instance
            var instance = this.buildInstance(); // Legacy support for App.__container__ and other global methods
            // on App that rely on a single, default instance.

            this.__deprecatedInstance__ = instance;
            this.__container__ = instance.__container__;
        },
        /**
          Automatically kick-off the boot process for the application once the
          DOM has become ready.
           The initialization itself is scheduled on the actions queue which
          ensures that code-loading finishes before booting.
           If you are asynchronously loading code, you should call `deferReadiness()`
          to defer booting, and then call `advanceReadiness()` once all of your code
          has finished loading.
           @private
          @method waitForDOMReady
        */
        waitForDOMReady: function waitForDOMReady() {
            var _this = this;
            if (this._document === null || this._document.readyState !== 'loading') {
                (0, _runloop.schedule)('actions', this, 'domReady');
            } else {
                var callback = function callback() {
                    _this._document.removeEventListener('DOMContentLoaded', callback);
                    (0, _runloop.run)(_this, 'domReady');
                };
                this._document.addEventListener('DOMContentLoaded', callback);
            }
        },
        /**
          This is the autoboot flow:
           1. Boot the app by calling `this.boot()`
          2. Create an instance (or use the `__deprecatedInstance__` in globals mode)
          3. Boot the instance by calling `instance.boot()`
          4. Invoke the `App.ready()` callback
          5. Kick-off routing on the instance
           Ideally, this is all we would need to do:
           ```javascript
          _autoBoot() {
            this.boot().then(() => {
              let instance = (this._globalsMode) ? this.__deprecatedInstance__ : this.buildInstance();
              return instance.boot();
            }).then((instance) => {
              App.ready();
              instance.startRouting();
            });
          }
          ```
           Unfortunately, we cannot actually write this because we need to participate
          in the "synchronous" boot process. While the code above would work fine on
          the initial boot (i.e. DOM ready), when `App.reset()` is called, we need to
          boot a new instance synchronously (see the documentation on `_bootSync()`
          for details).
           Because of this restriction, the actual logic of this method is located
          inside `didBecomeReady()`.
           @private
          @method domReady
        */
        domReady: function domReady() {
            if (this.isDestroying || this.isDestroyed) {
                return;
            }
            this._bootSync(); // Continues to `didBecomeReady`
        },
        /**
          Use this to defer readiness until some condition is true.
           Example:
           ```javascript
          import Application from '@ember/application';
           let App = Application.create();
           App.deferReadiness();
           // $ is a reference to the jQuery object/function
          import $ from 'jquery;
           $.getJSON('/auth-token', function(token) {
            App.token = token;
            App.advanceReadiness();
          });
          ```
           This allows you to perform asynchronous setup logic and defer
          booting your application until the setup has finished.
           However, if the setup requires a loading UI, it might be better
          to use the router for this purpose.
           @method deferReadiness
          @public
        */
        deferReadiness: function deferReadiness() {
            (false && !(this instanceof Application) && (0, _debug.assert)('You must call deferReadiness on an instance of Application', this instanceof Application));
            (false && !(!this.isDestroyed) && (0, _debug.assert)('You cannot defer readiness since application has already destroyed', !this.isDestroyed));
            (false && !(!this.isDestroying) && (0, _debug.assert)('You cannot defer readiness since the application is being destroyed', !this.isDestroying));
            (false && !(this._readinessDeferrals > 0) && (0, _debug.assert)('You cannot defer readiness since the `ready()` hook has already been called', this._readinessDeferrals > 0));
            this._readinessDeferrals++;
        },
        /**
          Call `advanceReadiness` after any asynchronous setup logic has completed.
          Each call to `deferReadiness` must be matched by a call to `advanceReadiness`
          or the application will never become ready and routing will not begin.
           @method advanceReadiness
          @see {Application#deferReadiness}
          @public
        */
        advanceReadiness: function advanceReadiness() {
            (false && !(this instanceof Application) && (0, _debug.assert)('You must call advanceReadiness on an instance of Application', this instanceof Application));
            (false && !(!this.isDestroyed) && (0, _debug.assert)('You cannot advance readiness since application has already destroyed', !this.isDestroyed));
            (false && !(!this.isDestroying) && (0, _debug.assert)('You cannot advance readiness since the application is being destroyed', !this.isDestroying));
            (false && !(this._readinessDeferrals > 0) && (0, _debug.assert)('You cannot advance readiness since the `ready()` hook has already been called', this._readinessDeferrals > 0));
            this._readinessDeferrals--;
            if (this._readinessDeferrals === 0) {
                (0, _runloop.once)(this, this.didBecomeReady);
            }
        },
        /**
          Initialize the application and return a promise that resolves with the `Application`
          object when the boot process is complete.
           Run any application initializers and run the application load hook. These hooks may
          choose to defer readiness. For example, an authentication hook might want to defer
          readiness until the auth token has been retrieved.
           By default, this method is called automatically on "DOM ready"; however, if autoboot
          is disabled, this is automatically called when the first application instance is
          created via `visit`.
           @public
          @method boot
          @return {Promise<Application,Error>}
        */
        boot: function boot() {
            (false && !(!this.isDestroyed) && (0, _debug.assert)('You cannot boot this application since it has already been destroyed', !this.isDestroyed));
            (false && !(!this.isDestroying) && (0, _debug.assert)('You cannot boot this application since it is being destroyed', !this.isDestroying));
            if (this._bootPromise) {
                return this._bootPromise;
            }
            try {
                this._bootSync();
            } catch (_) { // Ignore the error: in the asynchronous boot path, the error is already reflected
                // in the promise rejection
            }
            return this._bootPromise;
        },
        /**
          Unfortunately, a lot of existing code assumes the booting process is
          "synchronous". Specifically, a lot of tests assumes the last call to
          `app.advanceReadiness()` or `app.reset()` will result in the app being
          fully-booted when the current runloop completes.
           We would like new code (like the `visit` API) to stop making this assumption,
          so we created the asynchronous version above that returns a promise. But until
          we have migrated all the code, we would have to expose this method for use
          *internally* in places where we need to boot an app "synchronously".
           @private
        */
        _bootSync: function _bootSync() {
            if (this._booted || this.isDestroying || this.isDestroyed) {
                return;
            } // Even though this returns synchronously, we still need to make sure the
            // boot promise exists for book-keeping purposes: if anything went wrong in
            // the boot process, we need to store the error as a rejection on the boot
            // promise so that a future caller of `boot()` can tell what failed.

            var defer = this._bootResolver = _runtime.RSVP.defer();
            this._bootPromise = defer.promise;
            try {
                this.runInitializers();
                (0, _lazy_load.runLoadHooks)('application', this);
                this.advanceReadiness(); // Continues to `didBecomeReady`
            } catch (error) {
                // For the asynchronous boot path
                defer.reject(error); // For the synchronous boot path

                throw error;
            }
        },
        /**
          Reset the application. This is typically used only in tests. It cleans up
          the application in the following order:
           1. Deactivate existing routes
          2. Destroy all objects in the container
          3. Create a new application container
          4. Re-route to the existing url
           Typical Example:
           ```javascript
          import Application from '@ember/application';
          let App;
           run(function() {
            App = Application.create();
          });
           module('acceptance test', {
            setup: function() {
              App.reset();
            }
          });
           test('first test', function() {
            // App is freshly reset
          });
           test('second test', function() {
            // App is again freshly reset
          });
          ```
           Advanced Example:
           Occasionally you may want to prevent the app from initializing during
          setup. This could enable extra configuration, or enable asserting prior
          to the app becoming ready.
           ```javascript
          import Application from '@ember/application';
          let App;
           run(function() {
            App = Application.create();
          });
           module('acceptance test', {
            setup: function() {
              run(function() {
                App.reset();
                App.deferReadiness();
              });
            }
          });
           test('first test', function() {
            ok(true, 'something before app is initialized');
             run(function() {
              App.advanceReadiness();
            });
             ok(true, 'something after app is initialized');
          });
          ```
           @method reset
          @public
        */
        reset: function reset() {
            (false && !(!this.isDestroyed) && (0, _debug.assert)('You cannot reset this application since it has already been destroyed', !this.isDestroyed));
            (false && !(!this.isDestroying) && (0, _debug.assert)('You cannot reset this application since it is being destroyed', !this.isDestroying));
            (false && !(this._globalsMode && this.autoboot) && (0, _debug.assert)("Calling reset() on instances of `Application` is not\n            supported when globals mode is disabled; call `visit()` to\n            create new `ApplicationInstance`s and dispose them\n            via their `destroy()` method instead.", this._globalsMode && this.autoboot));
            var instance = this.__deprecatedInstance__;
            this._readinessDeferrals = 1;
            this._bootPromise = null;
            this._bootResolver = null;
            this._booted = false;

            function handleReset() {
                (0, _runloop.run)(instance, 'destroy');
                this._buildDeprecatedInstance();
                (0, _runloop.schedule)('actions', this, '_bootSync');
            }
            (0, _runloop.join)(this, handleReset);
        },
        /**
          @private
          @method didBecomeReady
        */
        didBecomeReady: function didBecomeReady() {
            if (this.isDestroying || this.isDestroyed) {
                return;
            }
            try {
                // TODO: Is this still needed for _globalsMode = false?
                // See documentation on `_autoboot()` for details
                if (this.autoboot) {
                    var instance;
                    if (this._globalsMode) {
                        // If we already have the __deprecatedInstance__ lying around, boot it to
                        // avoid unnecessary work
                        instance = this.__deprecatedInstance__;
                    } else {
                        // Otherwise, build an instance and boot it. This is currently unreachable,
                        // because we forced _globalsMode to === autoboot; but having this branch
                        // allows us to locally toggle that flag for weeding out legacy globals mode
                        // dependencies independently
                        instance = this.buildInstance();
                    }
                    instance._bootSync(); // TODO: App.ready() is not called when autoboot is disabled, is this correct?

                    this.ready();
                    instance.startRouting();
                } // For the asynchronous boot path

                this._bootResolver.resolve(this); // For the synchronous boot path

                this._booted = true;
            } catch (error) {
                // For the asynchronous boot path
                this._bootResolver.reject(error); // For the synchronous boot path

                throw error;
            }
        },
        /**
          Called when the Application has become ready, immediately before routing
          begins. The call will be delayed until the DOM has become ready.
           @event ready
          @public
        */
        ready: function ready() {
            return this;
        },
        // This method must be moved to the application instance object
        willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            if (_lazy_load._loaded.application === this) {
                _lazy_load._loaded.application = undefined;
            }
            if (this._applicationInstances.size) {
                this._applicationInstances.forEach(function(i) {
                    return i.destroy();
                });
                this._applicationInstances.clear();
            }
        },
        /**
          Boot a new instance of `ApplicationInstance` for the current
          application and navigate it to the given `url`. Returns a `Promise` that
          resolves with the instance when the initial routing and rendering is
          complete, or rejects with any error that occurred during the boot process.
           When `autoboot` is disabled, calling `visit` would first cause the
          application to boot, which runs the application initializers.
           This method also takes a hash of boot-time configuration options for
          customizing the instance's behavior. See the documentation on
          `ApplicationInstance.BootOptions` for details.
           `ApplicationInstance.BootOptions` is an interface class that exists
          purely to document the available options; you do not need to construct it
          manually. Simply pass a regular JavaScript object containing of the
          desired options:
           ```javascript
          MyApp.visit("/", { location: "none", rootElement: "#container" });
          ```
           ### Supported Scenarios
           While the `BootOptions` class exposes a large number of knobs, not all
          combinations of them are valid; certain incompatible combinations might
          result in unexpected behavior.
           For example, booting the instance in the full browser environment
          while specifying a foreign `document` object (e.g. `{ isBrowser: true,
          document: iframe.contentDocument }`) does not work correctly today,
          largely due to Ember's jQuery dependency.
           Currently, there are three officially supported scenarios/configurations.
          Usages outside of these scenarios are not guaranteed to work, but please
          feel free to file bug reports documenting your experience and any issues
          you encountered to help expand support.
           #### Browser Applications (Manual Boot)
           The setup is largely similar to how Ember works out-of-the-box. Normally,
          Ember will boot a default instance for your Application on "DOM ready".
          However, you can customize this behavior by disabling `autoboot`.
           For example, this allows you to render a miniture demo of your application
          into a specific area on your marketing website:
           ```javascript
          import MyApp from 'my-app';
           $(function() {
            let App = MyApp.create({ autoboot: false });
             let options = {
              // Override the router's location adapter to prevent it from updating
              // the URL in the address bar
              location: 'none',
               // Override the default `rootElement` on the app to render into a
              // specific `div` on the page
              rootElement: '#demo'
            };
             // Start the app at the special demo URL
            App.visit('/demo', options);
          });
          ```
           Or perhaps you might want to boot two instances of your app on the same
          page for a split-screen multiplayer experience:
           ```javascript
          import MyApp from 'my-app';
           $(function() {
            let App = MyApp.create({ autoboot: false });
             let sessionId = MyApp.generateSessionID();
             let player1 = App.visit(`/matches/join?name=Player+1&session=${sessionId}`, { rootElement: '#left', location: 'none' });
            let player2 = App.visit(`/matches/join?name=Player+2&session=${sessionId}`, { rootElement: '#right', location: 'none' });
             Promise.all([player1, player2]).then(() => {
              // Both apps have completed the initial render
              $('#loading').fadeOut();
            });
          });
          ```
           Do note that each app instance maintains their own registry/container, so
          they will run in complete isolation by default.
           #### Server-Side Rendering (also known as FastBoot)
           This setup allows you to run your Ember app in a server environment using
          Node.js and render its content into static HTML for SEO purposes.
           ```javascript
          const HTMLSerializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
           function renderURL(url) {
            let dom = new SimpleDOM.Document();
            let rootElement = dom.body;
            let options = { isBrowser: false, document: dom, rootElement: rootElement };
             return MyApp.visit(options).then(instance => {
              try {
                return HTMLSerializer.serialize(rootElement.firstChild);
              } finally {
                instance.destroy();
              }
            });
          }
          ```
           In this scenario, because Ember does not have access to a global `document`
          object in the Node.js environment, you must provide one explicitly. In practice,
          in the non-browser environment, the stand-in `document` object only needs to
          implement a limited subset of the full DOM API. The `SimpleDOM` library is known
          to work.
           Since there is no access to jQuery in the non-browser environment, you must also
          specify a DOM `Element` object in the same `document` for the `rootElement` option
          (as opposed to a selector string like `"body"`).
           See the documentation on the `isBrowser`, `document` and `rootElement` properties
          on `ApplicationInstance.BootOptions` for details.
           #### Server-Side Resource Discovery
           This setup allows you to run the routing layer of your Ember app in a server
          environment using Node.js and completely disable rendering. This allows you
          to simulate and discover the resources (i.e. AJAX requests) needed to fulfill
          a given request and eagerly "push" these resources to the client.
           ```app/initializers/network-service.js
          import BrowserNetworkService from 'app/services/network/browser';
          import NodeNetworkService from 'app/services/network/node';
           // Inject a (hypothetical) service for abstracting all AJAX calls and use
          // the appropriate implementation on the client/server. This also allows the
          // server to log all the AJAX calls made during a particular request and use
          // that for resource-discovery purpose.
           export function initialize(application) {
            if (window) { // browser
              application.register('service:network', BrowserNetworkService);
            } else { // node
              application.register('service:network', NodeNetworkService);
            }
             application.inject('route', 'network', 'service:network');
          };
           export default {
            name: 'network-service',
            initialize: initialize
          };
          ```
           ```app/routes/post.js
          import Route from '@ember/routing/route';
           // An example of how the (hypothetical) service is used in routes.
           export default Route.extend({
            model(params) {
              return this.network.fetch(`/api/posts/${params.post_id}.json`);
            },
             afterModel(post) {
              if (post.isExternalContent) {
                return this.network.fetch(`/api/external/?url=${post.externalURL}`);
              } else {
                return post;
              }
            }
          });
          ```
           ```javascript
          // Finally, put all the pieces together
           function discoverResourcesFor(url) {
            return MyApp.visit(url, { isBrowser: false, shouldRender: false }).then(instance => {
              let networkService = instance.lookup('service:network');
              return networkService.requests; // => { "/api/posts/123.json": "..." }
            });
          }
          ```
           @public
          @method visit
          @param url {String} The initial URL to navigate to
          @param options {ApplicationInstance.BootOptions}
          @return {Promise<ApplicationInstance, Error>}
        */
        visit: function visit(url, options) {
            var _this2 = this;
            (false && !(!this.isDestroyed) && (0, _debug.assert)('You cannot visit this application since it has already been destroyed', !this.isDestroyed));
            (false && !(!this.isDestroying) && (0, _debug.assert)('You cannot visit this application since it is being destroyed', !this.isDestroying));
            return this.boot().then(function() {
                var instance = _this2.buildInstance();
                return instance.boot(options).then(function() {
                    return instance.visit(url);
                }).catch(function(error) {
                    (0, _runloop.run)(instance, 'destroy');
                    throw error;
                });
            });
        }
    });
    Application.reopenClass({
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
        buildRegistry: function buildRegistry() {
            // eslint-disable-line no-unused-vars
            var registry = this._super.apply(this, arguments);
            commonSetupRegistry(registry);
            (0, _glimmer.setupApplicationRegistry)(registry);
            return registry;
        }
    });

    function commonSetupRegistry(registry) {
        registry.register('router:main', _routing.Router);
        registry.register('-view-registry:main', {
            create: function create() {
                return (0, _utils.dictionary)(null);
            }
        });
        registry.register('route:basic', _routing.Route);
        registry.register('event_dispatcher:main', _views.EventDispatcher);
        registry.register('location:auto', _routing.AutoLocation);
        registry.register('location:hash', _routing.HashLocation);
        registry.register('location:history', _routing.HistoryLocation);
        registry.register('location:none', _routing.NoneLocation);
        registry.register((0, _container.privatize)(_templateObject || (_templateObject = (0, _emberBabel.taggedTemplateLiteralLoose)(["-bucket-cache:main"]))), {
            create: function create() {
                return new _routing.BucketCache();
            }
        });
        registry.register('service:router', _routing.RouterService);
    }

    function registerLibraries() {
        if (!librariesRegistered) {
            librariesRegistered = true;
            if (_deprecatedFeatures.JQUERY_INTEGRATION && _browserEnvironment.hasDOM && !_views.jQueryDisabled) {
                _metal.libraries.registerCoreLibrary('jQuery', (0, _views.jQuery)().jquery);
            }
        }
    }
    var _default = Application;
    _exports.default = _default;
});
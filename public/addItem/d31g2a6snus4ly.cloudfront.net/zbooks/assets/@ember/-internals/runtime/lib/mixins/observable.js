define("@ember/-internals/runtime/lib/mixins/observable", ["exports", "@ember/-internals/meta", "@ember/-internals/metal", "@ember/debug"], function(_exports, _meta, _metal, _debug) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.default = void 0;
    /**
    @module @ember/object
    */
    /**
      ## Overview
  
      This mixin provides properties and property observing functionality, core
      features of the Ember object model.
  
      Properties and observers allow one object to observe changes to a
      property on another object. This is one of the fundamental ways that
      models, controllers and views communicate with each other in an Ember
      application.
  
      Any object that has this mixin applied can be used in observer
      operations. That includes `EmberObject` and most objects you will
      interact with as you write your Ember application.
  
      Note that you will not generally apply this mixin to classes yourself,
      but you will use the features provided by this module frequently, so it
      is important to understand how to use it.
  
      ## Using `get()` and `set()`
  
      Because of Ember's support for bindings and observers, you will always
      access properties using the get method, and set properties using the
      set method. This allows the observing objects to be notified and
      computed properties to be handled properly.
  
      More documentation about `get` and `set` are below.
  
      ## Observing Property Changes
  
      You typically observe property changes simply by using the `observer`
      function in classes that you write.
  
      For example:
  
      ```javascript
      import { observer } from '@ember/object';
      import EmberObject from '@ember/object';
  
      EmberObject.extend({
        valueObserver: observer('value', function(sender, key, value, rev) {
          // Executes whenever the "value" property changes
          // See the addObserver method for more information about the callback arguments
        })
      });
      ```
  
      Although this is the most common way to add an observer, this capability
      is actually built into the `EmberObject` class on top of two methods
      defined in this mixin: `addObserver` and `removeObserver`. You can use
      these two methods to add and remove observers yourself if you need to
      do so at runtime.
  
      To add an observer for a property, call:
  
      ```javascript
      object.addObserver('propertyKey', targetObject, targetAction)
      ```
  
      This will call the `targetAction` method on the `targetObject` whenever
      the value of the `propertyKey` changes.
  
      Note that if `propertyKey` is a computed property, the observer will be
      called when any of the property dependencies are changed, even if the
      resulting value of the computed property is unchanged. This is necessary
      because computed properties are not computed until `get` is called.
  
      @class Observable
      @public
    */
    var _default = _metal.Mixin.create({
        /**
          Retrieves the value of a property from the object.
           This method is usually similar to using `object[keyName]` or `object.keyName`,
          however it supports both computed properties and the unknownProperty
          handler.
           Because `get` unifies the syntax for accessing all these kinds
          of properties, it can make many refactorings easier, such as replacing a
          simple property with a computed property, or vice versa.
           ### Computed Properties
           Computed properties are methods defined with the `property` modifier
          declared at the end, such as:
           ```javascript
          import { computed } from '@ember/object';
           fullName: computed('firstName', 'lastName', function() {
            return this.get('firstName') + ' ' + this.get('lastName');
          })
          ```
           When you call `get` on a computed property, the function will be
          called and the return value will be returned instead of the function
          itself.
           ### Unknown Properties
           Likewise, if you try to call `get` on a property whose value is
          `undefined`, the `unknownProperty()` method will be called on the object.
          If this method returns any value other than `undefined`, it will be returned
          instead. This allows you to implement "virtual" properties that are
          not defined upfront.
           @method get
          @param {String} keyName The property to retrieve
          @return {Object} The property value or undefined.
          @public
        */
        get: function get(keyName) {
            return (0, _metal.get)(this, keyName);
        },
        /**
          To get the values of multiple properties at once, call `getProperties`
          with a list of strings or an array:
           ```javascript
          record.getProperties('firstName', 'lastName', 'zipCode');
          // { firstName: 'John', lastName: 'Doe', zipCode: '10011' }
          ```
           is equivalent to:
           ```javascript
          record.getProperties(['firstName', 'lastName', 'zipCode']);
          // { firstName: 'John', lastName: 'Doe', zipCode: '10011' }
          ```
           @method getProperties
          @param {String...|Array} list of keys to get
          @return {Object}
          @public
        */
        getProperties: function getProperties() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }
            return _metal.getProperties.apply(void 0, [this].concat(args));
        },
        /**
          Sets the provided key or path to the value.
           ```javascript
          record.set("key", value);
          ```
           This method is generally very similar to calling `object["key"] = value` or
          `object.key = value`, except that it provides support for computed
          properties, the `setUnknownProperty()` method and property observers.
           ### Computed Properties
           If you try to set a value on a key that has a computed property handler
          defined (see the `get()` method for an example), then `set()` will call
          that method, passing both the value and key instead of simply changing
          the value itself. This is useful for those times when you need to
          implement a property that is composed of one or more member
          properties.
           ### Unknown Properties
           If you try to set a value on a key that is undefined in the target
          object, then the `setUnknownProperty()` handler will be called instead. This
          gives you an opportunity to implement complex "virtual" properties that
          are not predefined on the object. If `setUnknownProperty()` returns
          undefined, then `set()` will simply set the value on the object.
           ### Property Observers
           In addition to changing the property, `set()` will also register a property
          change with the object. Unless you have placed this call inside of a
          `beginPropertyChanges()` and `endPropertyChanges(),` any "local" observers
          (i.e. observer methods declared on the same object), will be called
          immediately. Any "remote" observers (i.e. observer methods declared on
          another object) will be placed in a queue and called at a later time in a
          coalesced manner.
           @method set
          @param {String} keyName The property to set
          @param {Object} value The value to set or `null`.
          @return {Object} The passed value
          @public
        */
        set: function set(keyName, value) {
            return (0, _metal.set)(this, keyName, value);
        },
        /**
          Sets a list of properties at once. These properties are set inside
          a single `beginPropertyChanges` and `endPropertyChanges` batch, so
          observers will be buffered.
           ```javascript
          record.setProperties({ firstName: 'Charles', lastName: 'Jolley' });
          ```
           @method setProperties
          @param {Object} hash the hash of keys and values to set
          @return {Object} The passed in hash
          @public
        */
        setProperties: function setProperties(hash) {
            return (0, _metal.setProperties)(this, hash);
        },
        /**
          Begins a grouping of property changes.
           You can use this method to group property changes so that notifications
          will not be sent until the changes are finished. If you plan to make a
          large number of changes to an object at one time, you should call this
          method at the beginning of the changes to begin deferring change
          notifications. When you are done making changes, call
          `endPropertyChanges()` to deliver the deferred change notifications and end
          deferring.
           @method beginPropertyChanges
          @return {Observable}
          @private
        */
        beginPropertyChanges: function beginPropertyChanges() {
            (0, _metal.beginPropertyChanges)();
            return this;
        },
        /**
          Ends a grouping of property changes.
           You can use this method to group property changes so that notifications
          will not be sent until the changes are finished. If you plan to make a
          large number of changes to an object at one time, you should call
          `beginPropertyChanges()` at the beginning of the changes to defer change
          notifications. When you are done making changes, call this method to
          deliver the deferred change notifications and end deferring.
           @method endPropertyChanges
          @return {Observable}
          @private
        */
        endPropertyChanges: function endPropertyChanges() {
            (0, _metal.endPropertyChanges)();
            return this;
        },
        /**
          Notify the observer system that a property has just changed.
           Sometimes you need to change a value directly or indirectly without
          actually calling `get()` or `set()` on it. In this case, you can use this
          method instead. Calling this method will notify all observers that the
          property has potentially changed value.
           @method notifyPropertyChange
          @param {String} keyName The property key to be notified about.
          @return {Observable}
          @public
        */
        notifyPropertyChange: function notifyPropertyChange(keyName) {
            (0, _metal.notifyPropertyChange)(this, keyName);
            return this;
        },
        /**
          Adds an observer on a property.
           This is the core method used to register an observer for a property.
           Once you call this method, any time the key's value is set, your observer
          will be notified. Note that the observers are triggered any time the
          value is set, regardless of whether it has actually changed. Your
          observer should be prepared to handle that.
           There are two common invocation patterns for `.addObserver()`:
           - Passing two arguments:
            - the name of the property to observe (as a string)
            - the function to invoke (an actual function)
          - Passing three arguments:
            - the name of the property to observe (as a string)
            - the target object (will be used to look up and invoke a
              function on)
            - the name of the function to invoke on the target object
              (as a string).
           ```app/components/my-component.js
          import Component from '@ember/component';
           export default Component.extend({
            init() {
              this._super(...arguments);
               // the following are equivalent:
               // using three arguments
              this.addObserver('foo', this, 'fooDidChange');
               // using two arguments
              this.addObserver('foo', (...args) => {
                this.fooDidChange(...args);
              });
            },
             fooDidChange() {
              // your custom logic code
            }
          });
          ```
           ### Observer Methods
           Observer methods have the following signature:
           ```app/components/my-component.js
          import Component from '@ember/component';
           export default Component.extend({
            init() {
              this._super(...arguments);
              this.addObserver('foo', this, 'fooDidChange');
            },
             fooDidChange(sender, key, value, rev) {
              // your code
            }
          });
          ```
           The `sender` is the object that changed. The `key` is the property that
          changes. The `value` property is currently reserved and unused. The `rev`
          is the last property revision of the object when it changed, which you can
          use to detect if the key value has really changed or not.
           Usually you will not need the value or revision parameters at
          the end. In this case, it is common to write observer methods that take
          only a sender and key value as parameters or, if you aren't interested in
          any of these values, to write an observer that has no parameters at all.
           @method addObserver
          @param {String} key The key to observe
          @param {Object} target The target object to invoke
          @param {String|Function} method The method to invoke
          @param {Boolean} sync Whether the observer is sync or not
          @return {Observable}
          @public
        */
        addObserver: function addObserver(key, target, method, sync) {
            (0, _metal.addObserver)(this, key, target, method, sync);
            return this;
        },
        /**
          Remove an observer you have previously registered on this object. Pass
          the same key, target, and method you passed to `addObserver()` and your
          target will no longer receive notifications.
           @method removeObserver
          @param {String} key The key to observe
          @param {Object} target The target object to invoke
          @param {String|Function} method The method to invoke
          @param {Boolean} sync Whether the observer is async or not
          @return {Observable}
          @public
        */
        removeObserver: function removeObserver(key, target, method, sync) {
            (0, _metal.removeObserver)(this, key, target, method, sync);
            return this;
        },
        /**
          Returns `true` if the object currently has observers registered for a
          particular key. You can use this method to potentially defer performing
          an expensive action until someone begins observing a particular property
          on the object.
           @method hasObserverFor
          @param {String} key Key to check
          @return {Boolean}
          @private
        */
        hasObserverFor: function hasObserverFor(key) {
            return (0, _metal.hasListeners)(this, key + ":change");
        },
        /**
          Retrieves the value of a property, or a default value in the case that the
          property returns `undefined`.
           ```javascript
          person.getWithDefault('lastName', 'Doe');
          ```
           @method getWithDefault
          @param {String} keyName The name of the property to retrieve
          @param {Object} defaultValue The value to return if the property value is undefined
          @return {Object} The property value or the defaultValue.
          @public
          @deprecated
        */
        getWithDefault: function getWithDefault(keyName, defaultValue) {
            return (0, _metal.getWithDefault)(this, keyName, defaultValue);
        },
        /**
          Set the value of a property to the current value plus some amount.
           ```javascript
          person.incrementProperty('age');
          team.incrementProperty('score', 2);
          ```
           @method incrementProperty
          @param {String} keyName The name of the property to increment
          @param {Number} increment The amount to increment by. Defaults to 1
          @return {Number} The new property value
          @public
        */
        incrementProperty: function incrementProperty(keyName, increment) {
            if (increment === void 0) {
                increment = 1;
            }
            (false && !(!isNaN(parseFloat(increment)) && isFinite(increment)) && (0, _debug.assert)('Must pass a numeric value to incrementProperty', !isNaN(parseFloat(increment)) && isFinite(increment)));
            return (0, _metal.set)(this, keyName, (parseFloat((0, _metal.get)(this, keyName)) || 0) + increment);
        },
        /**
          Set the value of a property to the current value minus some amount.
           ```javascript
          player.decrementProperty('lives');
          orc.decrementProperty('health', 5);
          ```
           @method decrementProperty
          @param {String} keyName The name of the property to decrement
          @param {Number} decrement The amount to decrement by. Defaults to 1
          @return {Number} The new property value
          @public
        */
        decrementProperty: function decrementProperty(keyName, decrement) {
            if (decrement === void 0) {
                decrement = 1;
            }
            (false && !(!isNaN(parseFloat(decrement)) && isFinite(decrement)) && (0, _debug.assert)('Must pass a numeric value to decrementProperty', !isNaN(parseFloat(decrement)) && isFinite(decrement)));
            return (0, _metal.set)(this, keyName, ((0, _metal.get)(this, keyName) || 0) - decrement);
        },
        /**
          Set the value of a boolean property to the opposite of its
          current value.
           ```javascript
          starship.toggleProperty('warpDriveEngaged');
          ```
           @method toggleProperty
          @param {String} keyName The name of the property to toggle
          @return {Boolean} The new property value
          @public
        */
        toggleProperty: function toggleProperty(keyName) {
            return (0, _metal.set)(this, keyName, !(0, _metal.get)(this, keyName));
        },
        /**
          Returns the cached value of a computed property, if it exists.
          This allows you to inspect the value of a computed property
          without accidentally invoking it if it is intended to be
          generated lazily.
           @method cacheFor
          @param {String} keyName
          @return {Object} The cached value of the computed property, if any
          @public
        */
        cacheFor: function cacheFor(keyName) {
            var meta = (0, _meta.peekMeta)(this);
            if (meta !== null) {
                return meta.valueFor(keyName);
            }
        }
    });
    _exports.default = _default;
});
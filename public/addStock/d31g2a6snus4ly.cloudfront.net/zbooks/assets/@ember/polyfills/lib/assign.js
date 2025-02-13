define("@ember/polyfills/lib/assign", ["exports"], function(_exports) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.assign = assign;
    _exports.default = void 0;
    /**
     @module @ember/polyfills
    */

    /**
      Copy properties from a source object to a target object. Source arguments remain unchanged.
  
      ```javascript
      import { assign } from '@ember/polyfills';
  
      var a = { first: 'Yehuda' };
      var b = { last: 'Katz' };
      var c = { company: 'Other Company' };
      var d = { company: 'Tilde Inc.' };
      assign(a, b, c, d); // a === { first: 'Yehuda', last: 'Katz', company: 'Tilde Inc.' };
      ```
  
      @method assign
      @for @ember/polyfills
      @param {Object} target The object to assign into
      @param {Object} ...args The objects to copy properties from
      @return {Object}
      @public
      @static
    */
    function assign(target) {
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (!arg) {
                continue;
            }
            var updates = Object.keys(arg);
            for (var _i = 0; _i < updates.length; _i++) {
                var prop = updates[_i];
                target[prop] = arg[prop];
            }
        }
        return target;
    } // Note: We use the bracket notation so
    //       that the babel plugin does not
    //       transform it.
    // https://www.npmjs.com/package/babel-plugin-transform-object-assign

    var _assign = Object.assign;
    var _default = _assign || assign;
    _exports.default = _default;
});
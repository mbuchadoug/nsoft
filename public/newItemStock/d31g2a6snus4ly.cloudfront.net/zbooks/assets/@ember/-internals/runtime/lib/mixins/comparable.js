define("@ember/-internals/runtime/lib/mixins/comparable", ["exports", "@ember/-internals/metal"], function(_exports, _metal) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.default = void 0;
    /**
    @module ember
    */
    /**
      Implements some standard methods for comparing objects. Add this mixin to
      any class you create that can compare its instances.
  
      You should implement the `compare()` method.
  
      @class Comparable
      @namespace Ember
      @since Ember 0.9
      @private
    */
    var _default = _metal.Mixin.create({
        /**
          __Required.__ You must implement this method to apply this mixin.
           Override to return the result of the comparison of the two parameters. The
          compare method should return:
           - `-1` if `a < b`
          - `0` if `a == b`
          - `1` if `a > b`
           Default implementation raises an exception.
           @method compare
          @param a {Object} the first object to compare
          @param b {Object} the second object to compare
          @return {Number} the result of the comparison
          @private
        */
        compare: null
    });
    _exports.default = _default;
});
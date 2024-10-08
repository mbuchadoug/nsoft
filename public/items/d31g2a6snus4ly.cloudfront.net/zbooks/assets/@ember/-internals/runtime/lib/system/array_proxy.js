define("@ember/-internals/runtime/lib/system/array_proxy", ["exports", "ember-babel", "@ember/-internals/metal", "@ember/-internals/utils", "@ember/-internals/runtime/lib/system/object", "@ember/-internals/runtime/lib/mixins/array", "@ember/debug", "@glimmer/manager", "@glimmer/validator"], function(_exports, _emberBabel, _metal, _utils, _object, _array, _debug, _manager, _validator) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.default = void 0;
    /**
    @module @ember/array
    */

    var ARRAY_OBSERVER_MAPPING = {
        willChange: '_arrangedContentArrayWillChange',
        didChange: '_arrangedContentArrayDidChange'
    };

    function customTagForArrayProxy(proxy, key) {
        if (key === '[]') {
            proxy._revalidate();
            return proxy._arrTag;
        } else if (key === 'length') {
            proxy._revalidate();
            return proxy._lengthTag;
        }
        return (0, _validator.tagFor)(proxy, key);
    }
    /**
      An ArrayProxy wraps any other object that implements `Array` and/or
      `MutableArray,` forwarding all requests. This makes it very useful for
      a number of binding use cases or other cases where being able to swap
      out the underlying array is useful.
  
      A simple example of usage:
  
      ```javascript
      import { A } from '@ember/array';
      import ArrayProxy from '@ember/array/proxy';
  
      let pets = ['dog', 'cat', 'fish'];
      let ap = ArrayProxy.create({ content: A(pets) });
  
      ap.get('firstObject');                        // 'dog'
      ap.set('content', ['amoeba', 'paramecium']);
      ap.get('firstObject');                        // 'amoeba'
      ```
  
      This class can also be useful as a layer to transform the contents of
      an array, as they are accessed. This can be done by overriding
      `objectAtContent`:
  
      ```javascript
      import { A } from '@ember/array';
      import ArrayProxy from '@ember/array/proxy';
  
      let pets = ['dog', 'cat', 'fish'];
      let ap = ArrayProxy.create({
          content: A(pets),
          objectAtContent: function(idx) {
              return this.get('content').objectAt(idx).toUpperCase();
          }
      });
  
      ap.get('firstObject'); // . 'DOG'
      ```
  
      When overriding this class, it is important to place the call to
      `_super` *after* setting `content` so the internal observers have
      a chance to fire properly:
  
      ```javascript
      import { A } from '@ember/array';
      import ArrayProxy from '@ember/array/proxy';
  
      export default ArrayProxy.extend({
        init() {
          this.set('content', A(['dog', 'cat', 'fish']));
          this._super(...arguments);
        }
      });
      ```
  
      @class ArrayProxy
      @extends EmberObject
      @uses MutableArray
      @public
    */
    var ArrayProxy = /*#__PURE__*/ function(_EmberObject) {
        (0, _emberBabel.inheritsLoose)(ArrayProxy, _EmberObject);

        function ArrayProxy() {
            return _EmberObject.apply(this, arguments) || this;
        }
        var _proto = ArrayProxy.prototype;
        _proto.init = function init() {
            _EmberObject.prototype.init.apply(this, arguments);
            /*
              `this._objectsDirtyIndex` determines which indexes in the `this._objects`
              cache are dirty.
               If `this._objectsDirtyIndex === -1` then no indexes are dirty.
              Otherwise, an index `i` is dirty if `i >= this._objectsDirtyIndex`.
               Calling `objectAt` with a dirty index will cause the `this._objects`
              cache to be recomputed.
            */

            this._objectsDirtyIndex = 0;
            this._objects = null;
            this._lengthDirty = true;
            this._length = 0;
            this._arrangedContent = null;
            this._arrangedContentIsUpdating = false;
            this._arrangedContentTag = null;
            this._arrangedContentRevision = null;
            this._lengthTag = null;
            this._arrTag = null;
            (0, _manager.setCustomTagFor)(this, customTagForArrayProxy);
        };
        _proto[_metal.PROPERTY_DID_CHANGE] = function() {
            this._revalidate();
        };
        _proto.willDestroy = function willDestroy() {
            this._removeArrangedContentArrayObserver();
        }
        /**
          The content array. Must be an object that implements `Array` and/or
          `MutableArray.`
           @property content
          @type EmberArray
          @public
        */

        /**
          Should actually retrieve the object at the specified index from the
          content. You can override this method in subclasses to transform the
          content item to something new.
           This method will only be called if content is non-`null`.
           @method objectAtContent
          @param {Number} idx The index to retrieve.
          @return {Object} the value or undefined if none found
          @public
        */
        ;
        _proto.objectAtContent = function objectAtContent(idx) {
            return (0, _metal.objectAt)((0, _metal.get)(this, 'arrangedContent'), idx);
        } // See additional docs for `replace` from `MutableArray`:
        // https://api.emberjs.com/ember/release/classes/MutableArray/methods/replace?anchor=replace
        ;
        _proto.replace = function replace(idx, amt, objects) {
            (false && !((0, _metal.get)(this, 'arrangedContent') === (0, _metal.get)(this, 'content')) && (0, _debug.assert)('Mutating an arranged ArrayProxy is not allowed', (0, _metal.get)(this, 'arrangedContent') === (0, _metal.get)(this, 'content')));
            this.replaceContent(idx, amt, objects);
        }
        /**
          Should actually replace the specified objects on the content array.
          You can override this method in subclasses to transform the content item
          into something new.
           This method will only be called if content is non-`null`.
           @method replaceContent
          @param {Number} idx The starting index
          @param {Number} amt The number of items to remove from the content.
          @param {EmberArray} objects Optional array of objects to insert or null if no
            objects.
          @return {void}
          @public
        */
        ;
        _proto.replaceContent = function replaceContent(idx, amt, objects) {
            (0, _metal.get)(this, 'content').replace(idx, amt, objects);
        } // Overriding objectAt is not supported.
        ;
        _proto.objectAt = function objectAt(idx) {
            this._revalidate();
            if (this._objects === null) {
                this._objects = [];
            }
            if (this._objectsDirtyIndex !== -1 && idx >= this._objectsDirtyIndex) {
                var arrangedContent = (0, _metal.get)(this, 'arrangedContent');
                if (arrangedContent) {
                    var length = this._objects.length = (0, _metal.get)(arrangedContent, 'length');
                    for (var i = this._objectsDirtyIndex; i < length; i++) {
                        this._objects[i] = this.objectAtContent(i);
                    }
                } else {
                    this._objects.length = 0;
                }
                this._objectsDirtyIndex = -1;
            }
            return this._objects[idx];
        } // Overriding length is not supported.
        ;
        _proto._updateArrangedContentArray = function _updateArrangedContentArray(arrangedContent) {
            var oldLength = this._objects === null ? 0 : this._objects.length;
            var newLength = arrangedContent ? (0, _metal.get)(arrangedContent, 'length') : 0;
            this._removeArrangedContentArrayObserver();
            this.arrayContentWillChange(0, oldLength, newLength);
            this._invalidate();
            this.arrayContentDidChange(0, oldLength, newLength);
            this._addArrangedContentArrayObserver(arrangedContent);
        };
        _proto._addArrangedContentArrayObserver = function _addArrangedContentArrayObserver(arrangedContent) {
            if (arrangedContent && !arrangedContent.isDestroyed) {
                (false && !(arrangedContent !== this) && (0, _debug.assert)("Can't set ArrayProxy's content to itself", arrangedContent !== this));
                (false && !((0, _array.isArray)(arrangedContent) || arrangedContent.isDestroyed) && (0, _debug.assert)("ArrayProxy expects an Array or ArrayProxy, but you passed " + typeof arrangedContent, (0, _array.isArray)(arrangedContent) || arrangedContent.isDestroyed));
                (0, _metal.addArrayObserver)(arrangedContent, this, ARRAY_OBSERVER_MAPPING, true);
                this._arrangedContent = arrangedContent;
            }
        };
        _proto._removeArrangedContentArrayObserver = function _removeArrangedContentArrayObserver() {
            if (this._arrangedContent) {
                (0, _metal.removeArrayObserver)(this._arrangedContent, this, ARRAY_OBSERVER_MAPPING, true);
            }
        };
        _proto._arrangedContentArrayWillChange = function _arrangedContentArrayWillChange() {};
        _proto._arrangedContentArrayDidChange = function _arrangedContentArrayDidChange(proxy, idx, removedCnt, addedCnt) {
            this.arrayContentWillChange(idx, removedCnt, addedCnt);
            var dirtyIndex = idx;
            if (dirtyIndex < 0) {
                var length = (0, _metal.get)(this._arrangedContent, 'length');
                dirtyIndex += length + removedCnt - addedCnt;
            }
            if (this._objectsDirtyIndex === -1 || this._objectsDirtyIndex > dirtyIndex) {
                this._objectsDirtyIndex = dirtyIndex;
            }
            this._lengthDirty = true;
            this.arrayContentDidChange(idx, removedCnt, addedCnt);
        };
        _proto._invalidate = function _invalidate() {
            this._objectsDirtyIndex = 0;
            this._lengthDirty = true;
        };
        _proto._revalidate = function _revalidate() {
            if (this._arrangedContentIsUpdating === true) return;
            if (this._arrangedContentTag === null || !(0, _validator.validateTag)(this._arrangedContentTag, this._arrangedContentRevision)) {
                var arrangedContent = this.get('arrangedContent');
                if (this._arrangedContentTag === null) {
                    // This is the first time the proxy has been setup, only add the observer
                    // don't trigger any events
                    this._addArrangedContentArrayObserver(arrangedContent);
                } else {
                    this._arrangedContentIsUpdating = true;
                    this._updateArrangedContentArray(arrangedContent);
                    this._arrangedContentIsUpdating = false;
                }
                var arrangedContentTag = this._arrangedContentTag = (0, _validator.tagFor)(this, 'arrangedContent');
                this._arrangedContentRevision = (0, _validator.valueForTag)(this._arrangedContentTag);
                if ((0, _utils.isObject)(arrangedContent)) {
                    this._lengthTag = (0, _validator.combine)([arrangedContentTag, (0, _metal.tagForProperty)(arrangedContent, 'length')]);
                    this._arrTag = (0, _validator.combine)([arrangedContentTag, (0, _metal.tagForProperty)(arrangedContent, '[]')]);
                } else {
                    this._lengthTag = this._arrTag = arrangedContentTag;
                }
            }
        };
        (0, _emberBabel.createClass)(ArrayProxy, [{
            key: "length",
            get: function get() {
                this._revalidate();
                if (this._lengthDirty) {
                    var arrangedContent = (0, _metal.get)(this, 'arrangedContent');
                    this._length = arrangedContent ? (0, _metal.get)(arrangedContent, 'length') : 0;
                    this._lengthDirty = false;
                }
                (0, _validator.consumeTag)(this._lengthTag);
                return this._length;
            },
            set: function set(value) {
                var length = this.length;
                var removedCount = length - value;
                var added;
                if (removedCount === 0) {
                    return;
                } else if (removedCount < 0) {
                    added = new Array(-removedCount);
                    removedCount = 0;
                }
                var content = (0, _metal.get)(this, 'content');
                if (content) {
                    (0, _metal.replace)(content, value, removedCount, added);
                    this._invalidate();
                }
            }
        }]);
        return ArrayProxy;
    }(_object.default);
    _exports.default = ArrayProxy;
    ArrayProxy.reopen(_array.MutableArray, {
        /**
          The array that the proxy pretends to be. In the default `ArrayProxy`
          implementation, this and `content` are the same. Subclasses of `ArrayProxy`
          can override this property to provide things like sorting and filtering.
           @property arrangedContent
          @public
        */
        arrangedContent: (0, _metal.alias)('content'),
        // Array proxies don't need to notify when they change since their `[]` tag is
        // already dependent on the `[]` tag of `arrangedContent`
        arrayContentDidChange: function arrayContentDidChange(startIdx, removeAmt, addAmt) {
            return (0, _metal.arrayContentDidChange)(this, startIdx, removeAmt, addAmt, false);
        }
    });
});
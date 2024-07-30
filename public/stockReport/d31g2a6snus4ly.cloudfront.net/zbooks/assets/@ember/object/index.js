define("@ember/object/index", ["exports", "@ember/debug", "@ember/polyfills", "@ember/-internals/metal", "@ember/-internals/overrides", "@ember/-internals/runtime", "@ember/object/computed"], function(_exports, _debug, _polyfills, _metal, _overrides, _runtime, _computed) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.action = action;
    Object.defineProperty(_exports, "aliasMethod", {
        enumerable: true,
        get: function get() {
            return _metal.aliasMethod;
        }
    });
    Object.defineProperty(_exports, "computed", {
        enumerable: true,
        get: function get() {
            return _metal.computed;
        }
    });
    Object.defineProperty(_exports, "default", {
        enumerable: true,
        get: function get() {
            return _runtime.Object;
        }
    });
    Object.defineProperty(_exports, "defineProperty", {
        enumerable: true,
        get: function get() {
            return _metal.defineProperty;
        }
    });
    Object.defineProperty(_exports, "get", {
        enumerable: true,
        get: function get() {
            return _metal.get;
        }
    });
    Object.defineProperty(_exports, "getProperties", {
        enumerable: true,
        get: function get() {
            return _metal.getProperties;
        }
    });
    Object.defineProperty(_exports, "getWithDefault", {
        enumerable: true,
        get: function get() {
            return _metal.getWithDefault;
        }
    });
    Object.defineProperty(_exports, "notifyPropertyChange", {
        enumerable: true,
        get: function get() {
            return _metal.notifyPropertyChange;
        }
    });
    Object.defineProperty(_exports, "observer", {
        enumerable: true,
        get: function get() {
            return _metal.observer;
        }
    });
    Object.defineProperty(_exports, "set", {
        enumerable: true,
        get: function get() {
            return _metal.set;
        }
    });
    Object.defineProperty(_exports, "setProperties", {
        enumerable: true,
        get: function get() {
            return _metal.setProperties;
        }
    });
    Object.defineProperty(_exports, "trySet", {
        enumerable: true,
        get: function get() {
            return _metal.trySet;
        }
    });
    // eslint-disable-next-line no-undef

    if (false /* DEBUG */ ) {
        var defaultHandler = function defaultHandler(dotKey, importKey, module) {
            return "Using `" + dotKey + "` has been deprecated. Instead, import the value directly from " + module + ":\n\n  import { " + importKey + " } from '" + module + "';";
        };
        var handler = _overrides.onComputedDotAccess || defaultHandler;
        var defineDeprecatedComputedFunc = function defineDeprecatedComputedFunc(key, func) {
            Object.defineProperty(_metal.computed, key, {
                get: function get() {
                    var message = handler("computed." + key, key, '@ember/object/computed');
                    (false && !(message === null) && (0, _debug.deprecate)(message, message === null, {
                        id: 'deprecated-run-loop-and-computed-dot-access',
                        until: '4.0.0',
                        for: 'ember-source',
                        since: {
                            enabled: '3.27.0'
                        }
                    }));
                    return func;
                }
            });
        };
        defineDeprecatedComputedFunc('alias', _computed.alias);
        defineDeprecatedComputedFunc('and', _computed.and);
        defineDeprecatedComputedFunc('bool', _computed.bool);
        defineDeprecatedComputedFunc('collect', _computed.collect);
        defineDeprecatedComputedFunc('deprecatingAlias', _computed.deprecatingAlias);
        defineDeprecatedComputedFunc('empty', _computed.empty);
        defineDeprecatedComputedFunc('equal', _computed.equal);
        defineDeprecatedComputedFunc('filterBy', _computed.filterBy);
        defineDeprecatedComputedFunc('filter', _computed.filter);
        defineDeprecatedComputedFunc('gte', _computed.gte);
        defineDeprecatedComputedFunc('gt', _computed.gt);
        defineDeprecatedComputedFunc('intersect', _computed.intersect);
        defineDeprecatedComputedFunc('lte', _computed.lte);
        defineDeprecatedComputedFunc('lt', _computed.lt);
        defineDeprecatedComputedFunc('mapBy', _computed.mapBy);
        defineDeprecatedComputedFunc('map', _computed.map);
        defineDeprecatedComputedFunc('match', _computed.match);
        defineDeprecatedComputedFunc('max', _computed.max);
        defineDeprecatedComputedFunc('min', _computed.min);
        defineDeprecatedComputedFunc('none', _computed.none);
        defineDeprecatedComputedFunc('notEmpty', _computed.notEmpty);
        defineDeprecatedComputedFunc('not', _computed.not);
        defineDeprecatedComputedFunc('oneWay', _computed.oneWay);
        defineDeprecatedComputedFunc('reads', _computed.oneWay);
        defineDeprecatedComputedFunc('or', _computed.or);
        defineDeprecatedComputedFunc('readOnly', _computed.readOnly);
        defineDeprecatedComputedFunc('setDiff', _computed.setDiff);
        defineDeprecatedComputedFunc('sort', _computed.sort);
        defineDeprecatedComputedFunc('sum', _computed.sum);
        defineDeprecatedComputedFunc('union', _computed.union);
        defineDeprecatedComputedFunc('uniqBy', _computed.uniqBy);
        defineDeprecatedComputedFunc('uniq', _computed.uniq);
    } else {
        _metal.computed.alias = _computed.alias;
        _metal.computed.and = _computed.and;
        _metal.computed.bool = _computed.bool;
        _metal.computed.collect = _computed.collect;
        _metal.computed.deprecatingAlias = _computed.deprecatingAlias;
        _metal.computed.empty = _computed.empty;
        _metal.computed.equal = _computed.equal;
        _metal.computed.filterBy = _computed.filterBy;
        _metal.computed.filter = _computed.filter;
        _metal.computed.gte = _computed.gte;
        _metal.computed.gt = _computed.gt;
        _metal.computed.intersect = _computed.intersect;
        _metal.computed.lte = _computed.lte;
        _metal.computed.lt = _computed.lt;
        _metal.computed.mapBy = _computed.mapBy;
        _metal.computed.map = _computed.map;
        _metal.computed.match = _computed.match;
        _metal.computed.max = _computed.max;
        _metal.computed.min = _computed.min;
        _metal.computed.none = _computed.none;
        _metal.computed.notEmpty = _computed.notEmpty;
        _metal.computed.not = _computed.not;
        _metal.computed.oneWay = _computed.oneWay;
        _metal.computed.reads = _computed.oneWay;
        _metal.computed.or = _computed.or;
        _metal.computed.readOnly = _computed.readOnly;
        _metal.computed.setDiff = _computed.setDiff;
        _metal.computed.sort = _computed.sort;
        _metal.computed.sum = _computed.sum;
        _metal.computed.union = _computed.union;
        _metal.computed.uniqBy = _computed.uniqBy;
        _metal.computed.uniq = _computed.uniq;
    }
    /**
      Decorator that turns the target function into an Action which can be accessed
      directly by reference.
  
      ```js
      import Component from '@ember/component';
      import { action, set } from '@ember/object';
  
      export default class Tooltip extends Component {
        @action
        toggleShowing() {
          set(this, 'isShowing', !this.isShowing);
        }
      }
      ```
      ```hbs
      <!-- template.hbs -->
      <button {{action this.toggleShowing}}>Show tooltip</button>
  
      {{#if isShowing}}
        <div class="tooltip">
          I'm a tooltip!
        </div>
      {{/if}}
      ```
  
      Decorated actions also interop with the string style template actions:
  
      ```hbs
      <!-- template.hbs -->
      <button {{action "toggleShowing"}}>Show tooltip</button>
  
      {{#if isShowing}}
        <div class="tooltip">
          I'm a tooltip!
        </div>
      {{/if}}
      ```
  
      It also binds the function directly to the instance, so it can be used in any
      context and will correctly refer to the class it came from:
  
      ```hbs
      <!-- template.hbs -->
      <button
        {{did-insert this.toggleShowing}}
        {{on "click" this.toggleShowing}}
      >
        Show tooltip
      </button>
  
      {{#if isShowing}}
        <div class="tooltip">
          I'm a tooltip!
        </div>
      {{/if}}
      ```
  
      This can also be used in JavaScript code directly:
  
      ```js
      import Component from '@ember/component';
      import { action, set } from '@ember/object';
  
      export default class Tooltip extends Component {
        constructor() {
          super(...arguments);
  
          // this.toggleShowing is still bound correctly when added to
          // the event listener
          document.addEventListener('click', this.toggleShowing);
        }
  
        @action
        toggleShowing() {
          set(this, 'isShowing', !this.isShowing);
        }
      }
      ```
  
      This is considered best practice, since it means that methods will be bound
      correctly no matter where they are used. By contrast, the `{{action}}` helper
      and modifier can also be used to bind context, but it will be required for
      every usage of the method:
  
      ```hbs
      <!-- template.hbs -->
      <button
        {{did-insert (action this.toggleShowing)}}
        {{on "click" (action this.toggleShowing)}}
      >
        Show tooltip
      </button>
  
      {{#if isShowing}}
        <div class="tooltip">
          I'm a tooltip!
        </div>
      {{/if}}
      ```
  
      They also do not have equivalents in JavaScript directly, so they cannot be
      used for other situations where binding would be useful.
  
      @public
      @method action
      @for @ember/object
      @static
      @param {Function|undefined} callback The function to turn into an action,
                                           when used in classic classes
      @return {PropertyDecorator} property decorator instance
    */

    var BINDINGS_MAP = new WeakMap();

    function setupAction(target, key, actionFn) {
        if (target.constructor !== undefined && typeof target.constructor.proto === 'function') {
            target.constructor.proto();
        }
        if (!Object.prototype.hasOwnProperty.call(target, 'actions')) {
            var parentActions = target.actions; // we need to assign because of the way mixins copy actions down when inheriting

            target.actions = parentActions ? (0, _polyfills.assign)({}, parentActions) : {};
        }
        target.actions[key] = actionFn;
        return {
            get: function get() {
                var bindings = BINDINGS_MAP.get(this);
                if (bindings === undefined) {
                    bindings = new Map();
                    BINDINGS_MAP.set(this, bindings);
                }
                var fn = bindings.get(actionFn);
                if (fn === undefined) {
                    fn = actionFn.bind(this);
                    bindings.set(actionFn, fn);
                }
                return fn;
            }
        };
    }

    function action(target, key, desc) {
        var actionFn;
        if (!(0, _metal.isElementDescriptor)([target, key, desc])) {
            actionFn = target;
            var decorator = function decorator(target, key, desc, meta, isClassicDecorator) {
                (false && !(isClassicDecorator) && (0, _debug.assert)('The @action decorator may only be passed a method when used in classic classes. You should decorate methods directly in native classes', isClassicDecorator));
                (false && !(typeof actionFn === 'function') && (0, _debug.assert)('The action() decorator must be passed a method when used in classic classes', typeof actionFn === 'function'));
                return setupAction(target, key, actionFn);
            };
            (0, _metal.setClassicDecorator)(decorator);
            return decorator;
        }
        actionFn = desc.value;
        (false && !(typeof actionFn === 'function') && (0, _debug.assert)('The @action decorator must be applied to methods when used in native classes', typeof actionFn === 'function'));
        return setupAction(target, key, actionFn);
    }
    (0, _metal.setClassicDecorator)(action);
});
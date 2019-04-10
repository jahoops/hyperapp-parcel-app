// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"hyperappv2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = exports.h = exports.Lazy = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var DEFAULT_NODE = 0;
var RECYCLED_NODE = 1;
var LAZY_NODE = 2;
var TEXT_NODE = 3;
var EMPTY_OBJECT = {};
var EMPTY_ARRAY = [];
var map = EMPTY_ARRAY.map;
var isArray = Array.isArray;
var defer = typeof Promise === "function" ? function (cb) {
  Promise.resolve().then(cb);
} : setTimeout;

var merge = function merge(a, b) {
  var out = {};

  for (var i in a) {
    out[i] = a[i];
  }

  for (var i in b) {
    out[i] = b[i];
  }

  return out;
};

var flatten = function flatten(arr) {
  return arr.reduce(function (out, obj) {
    return out.concat(!obj || obj === true ? false : typeof obj[0] === "function" ? [obj] : flatten(obj));
  }, EMPTY_ARRAY);
};

var isSameAction = function isSameAction(a, b) {
  return isArray(a) && isArray(b) && a[0] === b[0] && typeof a[0] === "function";
};

var shouldRestart = function shouldRestart(a, b) {
  for (var k in merge(a, b)) {
    if (a[k] === b[k] || isSameAction(a[k], b[k])) b[k] = a[k];else return true;
  }
};

var patchSub = function patchSub(sub, newSub, dispatch) {
  for (var i = 0, a, b, out = []; i < sub.length || i < newSub.length; i++) {
    a = sub[i];
    out.push((b = newSub[i]) ? !a || b[0] !== a[0] || shouldRestart(b[1], a[1]) ? [b[0], b[1], b[0](b[1], dispatch), a && a[2]()] : a : a && a[2]());
  }

  return out;
};

var createClass = function createClass(obj) {
  var out = "";

  var tmp = _typeof(obj);

  if (tmp === "string" || tmp === "number") return obj;

  if (isArray(obj) && obj.length > 0) {
    for (var i = 0; i < obj.length; i++) {
      if ((tmp = createClass(obj[i])) !== "") out += (out && " ") + tmp;
    }
  } else {
    for (var i in obj) {
      if (obj[i]) out += (out && " ") + i;
    }
  }

  return out;
};

var updateProperty = function updateProperty(element, name, value, newValue, eventCb, isSvg) {
  if (name === "key") {} else if (name === "style") {
    for (var i in merge(value, newValue)) {
      var style = newValue == null || newValue[i] == null ? "" : newValue[i];

      if (i[0] === "-") {
        element[name].setProperty(i, style);
      } else {
        element[name][i] = style;
      }
    }
  } else if (name[0] === "o" && name[1] === "n") {
    if (!((element.events || (element.events = {}))[name = name.slice(2)] = newValue)) {
      element.removeEventListener(name, eventCb);
    } else if (!value) {
      element.addEventListener(name, eventCb);
    }
  } else if (name !== "list" && !isSvg && name in element) {
    element[name] = newValue == null ? "" : newValue;
  } else if (newValue == null || newValue === false || name === "class" && !(newValue = createClass(newValue))) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, newValue);
  }
};

var removeElement = function removeElement(parent, node) {
  parent.removeChild(node.element);
};

var createElement = function createElement(node, eventCb, isSvg) {
  var element = node.type === TEXT_NODE ? document.createTextNode(node.name) : (isSvg = isSvg || node.name === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.name) : document.createElement(node.name);
  var props = node.props;

  for (var i = 0, len = node.children.length; i < len; i++) {
    element.appendChild(createElement(node.children[i] = getNode(node.children[i]), eventCb, isSvg));
  }

  for (var k in props) {
    updateProperty(element, k, null, props[k], eventCb, isSvg);
  }

  return node.element = element;
};

var updateElement = function updateElement(element, props, newProps, eventCb, isSvg) {
  for (var k in merge(props, newProps)) {
    if ((k === "value" || k === "checked" ? element[k] : props[k]) !== newProps[k]) {
      updateProperty(element, k, props[k], newProps[k], eventCb, isSvg);
    }
  }
};

var getKey = function getKey(node) {
  return node == null ? null : node.key;
};

var patch = function patch(parent, element, node, newNode, eventCb, isSvg) {
  if (newNode === node) {} else if (node != null && node.type === TEXT_NODE && newNode.type === TEXT_NODE) {
    if (node.name !== newNode.name) element.nodeValue = newNode.name;
  } else if (node == null || node.name !== newNode.name) {
    var newElement = parent.insertBefore(createElement(newNode = getNode(newNode), eventCb, isSvg), element);
    if (node != null) removeElement(parent, node);
    element = newElement;
  } else {
    updateElement(element, node.props, newNode.props, eventCb, isSvg = isSvg || newNode.name === "svg");
    var savedNode;
    var childNode;
    var key;
    var children = node.children;
    var start = 0;
    var end = children.length - 1;
    var newKey;
    var newChildren = newNode.children;
    var newStart = 0;
    var newEnd = newChildren.length - 1;

    while (newStart <= newEnd && start <= end) {
      key = getKey(children[start]);
      newKey = getKey(newChildren[newStart]);
      if (key == null || key !== newKey) break;
      patch(element, children[start].element, children[start], newChildren[newStart] = getNode(newChildren[newStart], children[start]), eventCb, isSvg);
      start++;
      newStart++;
    }

    while (newStart <= newEnd && start <= end) {
      key = getKey(children[end]);
      newKey = getKey(newChildren[newEnd]);
      if (key == null || key !== newKey) break;
      patch(element, children[end].element, children[end], newChildren[newEnd] = getNode(newChildren[newEnd], children[end]), eventCb, isSvg);
      end--;
      newEnd--;
    }

    if (start > end) {
      while (newStart <= newEnd) {
        element.insertBefore(createElement(newChildren[newStart] = getNode(newChildren[newStart++]), eventCb, isSvg), (childNode = children[start]) && childNode.element);
      }
    } else if (newStart > newEnd) {
      while (start <= end) {
        removeElement(element, children[start++]);
      }
    } else {
      for (var i = start, keyed = {}, newKeyed = {}; i <= end; i++) {
        if ((key = children[i].key) != null) {
          keyed[key] = children[i];
        }
      }

      while (newStart <= newEnd) {
        key = getKey(childNode = children[start]);
        newKey = getKey(newChildren[newStart] = getNode(newChildren[newStart], childNode));

        if (newKeyed[key] || newKey != null && newKey === getKey(children[start + 1])) {
          if (key == null) {
            removeElement(element, childNode);
          }

          start++;
          continue;
        }

        if (newKey == null || node.type === RECYCLED_NODE) {
          if (key == null) {
            patch(element, childNode && childNode.element, childNode, newChildren[newStart], eventCb, isSvg);
            newStart++;
          }

          start++;
        } else {
          if (key === newKey) {
            patch(element, childNode.element, childNode, newChildren[newStart], eventCb, isSvg);
            newKeyed[newKey] = true;
            start++;
          } else {
            if ((savedNode = keyed[newKey]) != null) {
              patch(element, element.insertBefore(savedNode.element, childNode && childNode.element), savedNode, newChildren[newStart], eventCb, isSvg);
              newKeyed[newKey] = true;
            } else {
              patch(element, childNode && childNode.element, null, newChildren[newStart], eventCb, isSvg);
            }
          }

          newStart++;
        }
      }

      while (start <= end) {
        if (getKey(childNode = children[start++]) == null) {
          removeElement(element, childNode);
        }
      }

      for (var key in keyed) {
        if (newKeyed[key] == null) {
          removeElement(element, keyed[key]);
        }
      }
    }
  }

  return newNode.element = element;
};

var shouldUpdate = function shouldUpdate(a, b) {
  for (var k in a) {
    if (a[k] !== b[k]) return true;
  }

  for (var k in b) {
    if (a[k] !== b[k]) return true;
  }
};

var getNode = function getNode(newNode, node) {
  return newNode.type === LAZY_NODE ? !node || shouldUpdate(newNode.lazy, node.lazy) ? newNode.render() : node : newNode;
};

var createVNode = function createVNode(name, props, children, element, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    element: element,
    type: type,
    key: key
  };
};

var createTextVNode = function createTextVNode(text, element) {
  return createVNode(text, EMPTY_OBJECT, EMPTY_ARRAY, element, null, TEXT_NODE);
};

var recycleChild = function recycleChild(element) {
  return element.nodeType === TEXT_NODE ? createTextVNode(element.nodeValue, element) : recycleElement(element);
};

var recycleElement = function recycleElement(element) {
  return createVNode(element.nodeName.toLowerCase(), EMPTY_OBJECT, map.call(element.childNodes, recycleChild), element, null, RECYCLED_NODE);
};

var Lazy = function Lazy(props) {
  return {
    type: LAZY_NODE,
    key: props.key,
    lazy: props,
    render: function render() {
      var node = props.render(props);
      node.lazy = props;
      return node;
    }
  };
};

exports.Lazy = Lazy;

var h = function h(name, props) {
  for (var node, rest = [], children = [], i = arguments.length; i-- > 2;) {
    rest.push(arguments[i]);
  }

  while (rest.length > 0) {
    if (isArray(node = rest.pop())) {
      for (i = node.length; i-- > 0;) {
        rest.push(node[i]);
      }
    } else if (node === false || node === true || node == null) {} else {
      children.push(_typeof(node) === "object" ? node : createTextVNode(node));
    }
  }

  props = props || EMPTY_OBJECT;
  return typeof name === "function" ? name(props, children) : createVNode(name, props, children, null, props.key, DEFAULT_NODE);
};

exports.h = h;

var app = function app(props) {
  var container = props.container;
  var element = container && container.children[0];
  var node = element && recycleElement(element);
  var subs = props.subscriptions;
  var view = props.view;
  var lock = false;
  var state = {};
  var sub = [];

  var eventCb = function eventCb(event) {
    dispatch(event.currentTarget.events[event.type], event);
  };

  var setState = function setState(newState) {
    if (!(state === newState || lock)) {
      defer(render, lock = true);
    }

    state = newState;
  };

  var dispatch = function dispatch(obj, props) {
    if (typeof obj === "function") {
      dispatch(obj(state, props));
    } else if (isArray(obj)) {
      if (typeof obj[0] === "function") {
        dispatch(obj[0](state, obj[1], props));
      } else {
        flatten(obj.slice(1)).map(function (fx) {
          fx && fx[0](fx[1], dispatch);
        }, setState(obj[0]));
      }
    } else {
      setState(obj);
    }
  };

  var render = function render() {
    lock = false;
    if (subs) sub = patchSub(sub, flatten(subs(state)), dispatch);

    if (view) {
      element = patch(container, element, node, node = view(state), eventCb);
    }
  };

  dispatch(props.init);
};

exports.app = app;
},{}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/main.sass":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"hypersearch.js":[function(require,module,exports) {
"use strict";

var _hyperappv = require("./hyperappv2");

require("./styles/main.sass");

var getfoundListFn = function getfoundListFn(find) {
  return find ? window.jsondata.filter(function (obj) {
    return Object.keys(obj).some(function (key) {
      if (typeof obj[key] === 'string') {
        return obj[key].toLowerCase().indexOf(find.toLowerCase()) > -1;
      } else {
        return false;
      }
    });
  }) : '';
};

var UpdateSearch = function UpdateSearch(state, event) {
  return {
    search: event.target.value,
    foundList: getfoundListFn(event.target.value),
    variation: state.variation
  };
};

$('.hypersearch').each(function () {
  (0, _hyperappv.app)({
    init: {
      search: '',
      foundList: [],
      variation: $(this).attr('variation')
    },
    view: function view(_ref) {
      var search = _ref.search,
          foundList = _ref.foundList,
          variation = _ref.variation;
      return (0, _hyperappv.h)("main", null, (0, _hyperappv.h)("div", null, " Search Nobel laureates (", variation, "): "), (0, _hyperappv.h)("input", {
        type: "text",
        className: "searchInput",
        value: search,
        oninput: UpdateSearch
      }), (0, _hyperappv.h)("br", null), foundList.length ? foundList.map(function (item) {
        return (0, _hyperappv.h)("div", {
          className: "userCard"
        }, (0, _hyperappv.h)("div", {
          "class": variation
        }, item.firstname + ' ' + item.surname), (0, _hyperappv.h)("div", {
          "class": "userCard__location"
        }, item.bornCity + ', ' + item.bornCountry));
      }) : (0, _hyperappv.h)("div", {
        className: "userCard"
      }, "  \uD83D\uDC46 enter name or other info "));
    },
    container: this
  });
});
},{"./hyperappv2":"hyperappv2.js","./styles/main.sass":"styles/main.sass"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40855" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","hypersearch.js"], null)
//# sourceMappingURL=/hypersearch.js.map
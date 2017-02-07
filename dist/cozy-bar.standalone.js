(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cozy-bar"] = factory();
	else
		root["cozy-bar"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Cozy = undefined;
	
	var _i18n = __webpack_require__(1);
	
	var _i18n2 = _interopRequireDefault(_i18n);
	
	var _Bar = __webpack_require__(28);
	
	var _Bar2 = _interopRequireDefault(_Bar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var createElement = function CozyBarCreateElement() {
	  var barNode = document.createElement('div');
	  barNode.setAttribute('id', 'coz-bar');
	  barNode.setAttribute('role', 'banner');
	
	  return barNode;
	};
	
	var injectDOM = function CozyBarInjectDOM(_ref) {
	  var lang = _ref.lang,
	      appName = _ref.appName,
	      iconPath = _ref.iconPath;
	
	  if (document.getElementById('coz-bar') !== null) {
	    return;
	  }
	
	  __webpack_require__(36);
	
	  var barNode = createElement();
	  var appNode = document.querySelector('[role=application]');
	  document.body.insertBefore(barNode, appNode);
	
	  cozy.bar.__view__ = new _Bar2.default({
	    target: barNode,
	    data: { lang: lang, appName: appName, iconPath: iconPath }
	  });
	};
	
	var getDefaultLang = function GetDefaultLang() {
	  return document.documentElement.getAttribute('lang') || 'en';
	};
	
	var getDefaultIcon = function GetDefaultIcon() {
	  var linkNode = document.querySelector('link[rel="icon"][sizes^="32"]');
	  if (linkNode !== null) {
	    return linkNode.getAttribute('href');
	  } else {
	    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
	  }
	};
	
	var init = function CozyBarInit(_ref2) {
	  var _ref2$lang = _ref2.lang,
	      lang = _ref2$lang === undefined ? getDefaultLang() : _ref2$lang,
	      appName = _ref2.appName,
	      _ref2$iconPath = _ref2.iconPath,
	      iconPath = _ref2$iconPath === undefined ? getDefaultIcon() : _ref2$iconPath;
	
	  (0, _i18n2.default)(lang);
	  injectDOM({ lang: lang, appName: appName, iconPath: iconPath });
	  document.body.addEventListener('click', function () {
	    cozy.bar.__view__.fire('clickOutside');
	  });
	};
	
	var Cozy = window.Cozy || function Cozy() {
	  _classCallCheck(this, Cozy);
	};
	
	Object.assign(Cozy.prototype, {
	  bar: {
	    init: init
	  }
	});
	
	var cozy = window.cozy || new Cozy();
	
	if (typeof window !== 'undefined' && window.cozy == null) {
	  window.cozy = cozy;
	  window.Cozy = Cozy;
	}
	
	exports.default = cozy;
	exports.Cozy = Cozy;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.locale = exports.t = undefined;
	
	var _nodePolyglot = __webpack_require__(2);
	
	var _nodePolyglot2 = _interopRequireDefault(_nodePolyglot);
	
	var _en = __webpack_require__(26);
	
	var _en2 = _interopRequireDefault(_en);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var polyglot = new _nodePolyglot2.default({
	  phrases: _en2.default,
	  locale: 'en'
	});
	
	var init = function I18nInit(lang) {
	  if (lang && lang !== 'en') {
	    try {
	      var dict = __webpack_require__(27)("./" + lang);
	      polyglot.extend(dict);
	      polyglot.locale(lang);
	    } catch (e) {
	      console.warning('The dict phrases for "' + lang + '" can\'t be loaded');
	    }
	  }
	};
	
	var t = polyglot.t.bind(polyglot);
	var locale = polyglot.locale.bind(polyglot);
	
	exports.default = init;
	exports.t = t;
	exports.locale = locale;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	//     (c) 2012-2016 Airbnb, Inc.
	//
	//     polyglot.js may be freely distributed under the terms of the BSD
	//     license. For all licensing information, details, and documention:
	//     http://airbnb.github.com/polyglot.js
	//
	//
	// Polyglot.js is an I18n helper library written in JavaScript, made to
	// work both in the browser and in Node. It provides a simple solution for
	// interpolation and pluralization, based off of Airbnb's
	// experience adding I18n functionality to its Backbone.js and Node apps.
	//
	// Polylglot is agnostic to your translation backend. It doesn't perform any
	// translation; it simply gives you a way to manage translated phrases from
	// your client- or server-side JavaScript application.
	//
	
	'use strict';
	
	var forEach = __webpack_require__(3);
	var warning = __webpack_require__(5);
	var has = __webpack_require__(7);
	var trim = __webpack_require__(10);
	
	var warn = function warn(message) {
	  warning(false, message);
	};
	
	var replace = String.prototype.replace;
	var split = String.prototype.split;
	
	// #### Pluralization methods
	// The string that separates the different phrase possibilities.
	var delimeter = '||||';
	
	// Mapping from pluralization group plural logic.
	var pluralTypes = {
	  arabic: function (n) {
	    // http://www.arabeyes.org/Plural_Forms
	    if (n < 3) { return n; }
	    if (n % 100 >= 3 && n % 100 <= 10) return 3;
	    return n % 100 >= 11 ? 4 : 5;
	  },
	  chinese: function () { return 0; },
	  german: function (n) { return n !== 1 ? 1 : 0; },
	  french: function (n) { return n > 1 ? 1 : 0; },
	  russian: function (n) {
	    if (n % 10 === 1 && n % 100 !== 11) { return 0; }
	    return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
	  },
	  czech: function (n) {
	    if (n === 1) { return 0; }
	    return (n >= 2 && n <= 4) ? 1 : 2;
	  },
	  polish: function (n) {
	    if (n === 1) { return 0; }
	    return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
	  },
	  icelandic: function (n) { return (n % 10 !== 1 || n % 100 === 11) ? 1 : 0; }
	};
	
	// Mapping from pluralization group to individual locales.
	var pluralTypeToLanguages = {
	  arabic: ['ar'],
	  chinese: ['fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh'],
	  german: ['da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv'],
	  french: ['fr', 'tl', 'pt-br'],
	  russian: ['hr', 'ru', 'lt'],
	  czech: ['cs', 'sk'],
	  polish: ['pl'],
	  icelandic: ['is']
	};
	
	function langToTypeMap(mapping) {
	  var ret = {};
	  forEach(mapping, function (langs, type) {
	    forEach(langs, function (lang) {
	      ret[lang] = type;
	    });
	  });
	  return ret;
	}
	
	function pluralTypeName(locale) {
	  var langToPluralType = langToTypeMap(pluralTypeToLanguages);
	  return langToPluralType[locale]
	    || langToPluralType[split.call(locale, /-/, 1)[0]]
	    || langToPluralType.en;
	}
	
	function pluralTypeIndex(locale, count) {
	  return pluralTypes[pluralTypeName(locale)](count);
	}
	
	var dollarRegex = /\$/g;
	var dollarBillsYall = '$$';
	var tokenRegex = /%\{(.*?)\}/g;
	
	// ### transformPhrase(phrase, substitutions, locale)
	//
	// Takes a phrase string and transforms it by choosing the correct
	// plural form and interpolating it.
	//
	//     transformPhrase('Hello, %{name}!', {name: 'Spike'});
	//     // "Hello, Spike!"
	//
	// The correct plural form is selected if substitutions.smart_count
	// is set. You can pass in a number instead of an Object as `substitutions`
	// as a shortcut for `smart_count`.
	//
	//     transformPhrase('%{smart_count} new messages |||| 1 new message', {smart_count: 1}, 'en');
	//     // "1 new message"
	//
	//     transformPhrase('%{smart_count} new messages |||| 1 new message', {smart_count: 2}, 'en');
	//     // "2 new messages"
	//
	//     transformPhrase('%{smart_count} new messages |||| 1 new message', 5, 'en');
	//     // "5 new messages"
	//
	// You should pass in a third argument, the locale, to specify the correct plural type.
	// It defaults to `'en'` with 2 plural forms.
	function transformPhrase(phrase, substitutions, locale) {
	  if (typeof phrase !== 'string') {
	    throw new TypeError('Polyglot.transformPhrase expects argument #1 to be string');
	  }
	
	  if (substitutions == null) {
	    return phrase;
	  }
	
	  var result = phrase;
	
	  // allow number as a pluralization shortcut
	  var options = typeof substitutions === 'number' ? { smart_count: substitutions } : substitutions;
	
	  // Select plural form: based on a phrase text that contains `n`
	  // plural forms separated by `delimeter`, a `locale`, and a `substitutions.smart_count`,
	  // choose the correct plural form. This is only done if `count` is set.
	  if (options.smart_count != null && result) {
	    var texts = split.call(result, delimeter);
	    result = trim(texts[pluralTypeIndex(locale || 'en', options.smart_count)] || texts[0]);
	  }
	
	  // Interpolate: Creates a `RegExp` object for each interpolation placeholder.
	  result = replace.call(result, tokenRegex, function (expression, argument) {
	    if (!has(options, argument) || options[argument] == null) { return expression; }
	    // Ensure replacement value is escaped to prevent special $-prefixed regex replace tokens.
	    return replace.call(options[argument], dollarRegex, dollarBillsYall);
	  });
	
	  return result;
	}
	
	// ### Polyglot class constructor
	function Polyglot(options) {
	  var opts = options || {};
	  this.phrases = {};
	  this.extend(opts.phrases || {});
	  this.currentLocale = opts.locale || 'en';
	  var allowMissing = opts.allowMissing ? transformPhrase : null;
	  this.onMissingKey = typeof opts.onMissingKey === 'function' ? opts.onMissingKey : allowMissing;
	  this.warn = opts.warn || warn;
	}
	
	// ### polyglot.locale([locale])
	//
	// Get or set locale. Internally, Polyglot only uses locale for pluralization.
	Polyglot.prototype.locale = function (newLocale) {
	  if (newLocale) this.currentLocale = newLocale;
	  return this.currentLocale;
	};
	
	// ### polyglot.extend(phrases)
	//
	// Use `extend` to tell Polyglot how to translate a given key.
	//
	//     polyglot.extend({
	//       "hello": "Hello",
	//       "hello_name": "Hello, %{name}"
	//     });
	//
	// The key can be any string.  Feel free to call `extend` multiple times;
	// it will override any phrases with the same key, but leave existing phrases
	// untouched.
	//
	// It is also possible to pass nested phrase objects, which get flattened
	// into an object with the nested keys concatenated using dot notation.
	//
	//     polyglot.extend({
	//       "nav": {
	//         "hello": "Hello",
	//         "hello_name": "Hello, %{name}",
	//         "sidebar": {
	//           "welcome": "Welcome"
	//         }
	//       }
	//     });
	//
	//     console.log(polyglot.phrases);
	//     // {
	//     //   'nav.hello': 'Hello',
	//     //   'nav.hello_name': 'Hello, %{name}',
	//     //   'nav.sidebar.welcome': 'Welcome'
	//     // }
	//
	// `extend` accepts an optional second argument, `prefix`, which can be used
	// to prefix every key in the phrases object with some string, using dot
	// notation.
	//
	//     polyglot.extend({
	//       "hello": "Hello",
	//       "hello_name": "Hello, %{name}"
	//     }, "nav");
	//
	//     console.log(polyglot.phrases);
	//     // {
	//     //   'nav.hello': 'Hello',
	//     //   'nav.hello_name': 'Hello, %{name}'
	//     // }
	//
	// This feature is used internally to support nested phrase objects.
	Polyglot.prototype.extend = function (morePhrases, prefix) {
	  forEach(morePhrases, function (phrase, key) {
	    var prefixedKey = prefix ? prefix + '.' + key : key;
	    if (typeof phrase === 'object') {
	      this.extend(phrase, prefixedKey);
	    } else {
	      this.phrases[prefixedKey] = phrase;
	    }
	  }, this);
	};
	
	// ### polyglot.unset(phrases)
	// Use `unset` to selectively remove keys from a polyglot instance.
	//
	//     polyglot.unset("some_key");
	//     polyglot.unset({
	//       "hello": "Hello",
	//       "hello_name": "Hello, %{name}"
	//     });
	//
	// The unset method can take either a string (for the key), or an object hash with
	// the keys that you would like to unset.
	Polyglot.prototype.unset = function (morePhrases, prefix) {
	  if (typeof morePhrases === 'string') {
	    delete this.phrases[morePhrases];
	  } else {
	    forEach(morePhrases, function (phrase, key) {
	      var prefixedKey = prefix ? prefix + '.' + key : key;
	      if (typeof phrase === 'object') {
	        this.unset(phrase, prefixedKey);
	      } else {
	        delete this.phrases[prefixedKey];
	      }
	    }, this);
	  }
	};
	
	// ### polyglot.clear()
	//
	// Clears all phrases. Useful for special cases, such as freeing
	// up memory if you have lots of phrases but no longer need to
	// perform any translation. Also used internally by `replace`.
	Polyglot.prototype.clear = function () {
	  this.phrases = {};
	};
	
	// ### polyglot.replace(phrases)
	//
	// Completely replace the existing phrases with a new set of phrases.
	// Normally, just use `extend` to add more phrases, but under certain
	// circumstances, you may want to make sure no old phrases are lying around.
	Polyglot.prototype.replace = function (newPhrases) {
	  this.clear();
	  this.extend(newPhrases);
	};
	
	
	// ### polyglot.t(key, options)
	//
	// The most-used method. Provide a key, and `t` will return the
	// phrase.
	//
	//     polyglot.t("hello");
	//     => "Hello"
	//
	// The phrase value is provided first by a call to `polyglot.extend()` or
	// `polyglot.replace()`.
	//
	// Pass in an object as the second argument to perform interpolation.
	//
	//     polyglot.t("hello_name", {name: "Spike"});
	//     => "Hello, Spike"
	//
	// If you like, you can provide a default value in case the phrase is missing.
	// Use the special option key "_" to specify a default.
	//
	//     polyglot.t("i_like_to_write_in_language", {
	//       _: "I like to write in %{language}.",
	//       language: "JavaScript"
	//     });
	//     => "I like to write in JavaScript."
	//
	Polyglot.prototype.t = function (key, options) {
	  var phrase, result;
	  var opts = options == null ? {} : options;
	  if (typeof this.phrases[key] === 'string') {
	    phrase = this.phrases[key];
	  } else if (typeof opts._ === 'string') {
	    phrase = opts._;
	  } else if (this.onMissingKey) {
	    var onMissingKey = this.onMissingKey;
	    result = onMissingKey(key, opts, this.currentLocale);
	  } else {
	    this.warn('Missing translation for key: "' + key + '"');
	    result = key;
	  }
	  if (typeof phrase === 'string') {
	    result = transformPhrase(phrase, opts, this.currentLocale);
	  }
	  return result;
	};
	
	
	// ### polyglot.has(key)
	//
	// Check if polyglot has a translation for given key
	Polyglot.prototype.has = function (key) {
	  return has(this.phrases, key);
	};
	
	// export transformPhrase
	Polyglot.transformPhrase = transformPhrase;
	
	module.exports = Polyglot;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(4)
	
	module.exports = forEach
	
	var toString = Object.prototype.toString
	var hasOwnProperty = Object.prototype.hasOwnProperty
	
	function forEach(list, iterator, context) {
	    if (!isFunction(iterator)) {
	        throw new TypeError('iterator must be a function')
	    }
	
	    if (arguments.length < 3) {
	        context = this
	    }
	    
	    if (toString.call(list) === '[object Array]')
	        forEachArray(list, iterator, context)
	    else if (typeof list === 'string')
	        forEachString(list, iterator, context)
	    else
	        forEachObject(list, iterator, context)
	}
	
	function forEachArray(array, iterator, context) {
	    for (var i = 0, len = array.length; i < len; i++) {
	        if (hasOwnProperty.call(array, i)) {
	            iterator.call(context, array[i], i, array)
	        }
	    }
	}
	
	function forEachString(string, iterator, context) {
	    for (var i = 0, len = string.length; i < len; i++) {
	        // no such thing as a sparse string.
	        iterator.call(context, string.charAt(i), i, string)
	    }
	}
	
	function forEachObject(object, iterator, context) {
	    for (var k in object) {
	        if (hasOwnProperty.call(object, k)) {
	            iterator.call(context, object[k], k, object)
	        }
	    }
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = isFunction
	
	var toString = Object.prototype.toString
	
	function isFunction (fn) {
	  var string = toString.call(fn)
	  return string === '[object Function]' ||
	    (typeof fn === 'function' && string !== '[object RegExp]') ||
	    (typeof window !== 'undefined' &&
	     // IE8 and below
	     (fn === window.setTimeout ||
	      fn === window.alert ||
	      fn === window.confirm ||
	      fn === window.prompt))
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	
	'use strict';
	
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */
	
	var warning = function() {};
	
	if (process.env.NODE_ENV !== 'production') {
	  warning = function(condition, format, args) {
	    var len = arguments.length;
	    args = new Array(len > 2 ? len - 2 : 0);
	    for (var key = 2; key < len; key++) {
	      args[key - 2] = arguments[key];
	    }
	    if (format === undefined) {
	      throw new Error(
	        '`warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }
	
	    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
	      throw new Error(
	        'The warning format should be able to uniquely identify this ' +
	        'warning. Please, use a more descriptive format than: ' + format
	      );
	    }
	
	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' +
	        format.replace(/%s/g, function() {
	          return args[argIndex++];
	        });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch(x) {}
	    }
	  };
	}
	
	module.exports = warning;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var bind = __webpack_require__(8);
	
	module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var implementation = __webpack_require__(9);
	
	module.exports = Function.prototype.bind || implementation;


/***/ },
/* 9 */
/***/ function(module, exports) {

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var slice = Array.prototype.slice;
	var toStr = Object.prototype.toString;
	var funcType = '[object Function]';
	
	module.exports = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slice.call(arguments, 1);
	
	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                args.concat(slice.call(arguments))
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        } else {
	            return target.apply(
	                that,
	                args.concat(slice.call(arguments))
	            );
	        }
	    };
	
	    var boundLength = Math.max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs.push('$' + i);
	    }
	
	    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);
	
	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }
	
	    return bound;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(8);
	var define = __webpack_require__(11);
	
	var implementation = __webpack_require__(15);
	var getPolyfill = __webpack_require__(24);
	var shim = __webpack_require__(25);
	
	var boundTrim = bind.call(Function.call, getPolyfill());
	
	define(boundTrim, {
		getPolyfill: getPolyfill,
		implementation: implementation,
		shim: shim
	});
	
	module.exports = boundTrim;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var keys = __webpack_require__(12);
	var foreach = __webpack_require__(14);
	var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
	
	var toStr = Object.prototype.toString;
	
	var isFunction = function (fn) {
		return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
	};
	
	var arePropertyDescriptorsSupported = function () {
		var obj = {};
		try {
			Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
	        /* eslint-disable no-unused-vars, no-restricted-syntax */
	        for (var _ in obj) { return false; }
	        /* eslint-enable no-unused-vars, no-restricted-syntax */
			return obj.x === obj;
		} catch (e) { /* this is IE 8. */
			return false;
		}
	};
	var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();
	
	var defineProperty = function (object, name, value, predicate) {
		if (name in object && (!isFunction(predicate) || !predicate())) {
			return;
		}
		if (supportsDescriptors) {
			Object.defineProperty(object, name, {
				configurable: true,
				enumerable: false,
				value: value,
				writable: true
			});
		} else {
			object[name] = value;
		}
	};
	
	var defineProperties = function (object, map) {
		var predicates = arguments.length > 2 ? arguments[2] : {};
		var props = keys(map);
		if (hasSymbols) {
			props = props.concat(Object.getOwnPropertySymbols(map));
		}
		foreach(props, function (name) {
			defineProperty(object, name, map[name], predicates[name]);
		});
	};
	
	defineProperties.supportsDescriptors = !!supportsDescriptors;
	
	module.exports = defineProperties;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var slice = Array.prototype.slice;
	var isArgs = __webpack_require__(13);
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};
	
	var keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];
	
		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}
	
		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}
	
		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}
	
		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
	
			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
	
	keysShim.shim = function shimObjectKeys() {
		if (Object.keys) {
			var keysWorksWithArguments = (function () {
				// Safari 5.0 bug
				return (Object.keys(arguments) || '').length === 2;
			}(1, 2));
			if (!keysWorksWithArguments) {
				var originalKeys = Object.keys;
				Object.keys = function keys(object) {
					if (isArgs(object)) {
						return originalKeys(slice.call(object));
					} else {
						return originalKeys(object);
					}
				};
			}
		} else {
			Object.keys = keysShim;
		}
		return Object.keys || keysShim;
	};
	
	module.exports = keysShim;


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	var toStr = Object.prototype.toString;
	
	module.exports = function isArguments(value) {
		var str = toStr.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = str !== '[object Array]' &&
				value !== null &&
				typeof value === 'object' &&
				typeof value.length === 'number' &&
				value.length >= 0 &&
				toStr.call(value.callee) === '[object Function]';
		}
		return isArgs;
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	
	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;
	
	module.exports = function forEach (obj, fn, ctx) {
	    if (toString.call(fn) !== '[object Function]') {
	        throw new TypeError('iterator must be a function');
	    }
	    var l = obj.length;
	    if (l === +l) {
	        for (var i = 0; i < l; i++) {
	            fn.call(ctx, obj[i], i, obj);
	        }
	    } else {
	        for (var k in obj) {
	            if (hasOwn.call(obj, k)) {
	                fn.call(ctx, obj[k], k, obj);
	            }
	        }
	    }
	};
	


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(8);
	var ES = __webpack_require__(16);
	var replace = bind.call(Function.call, String.prototype.replace);
	
	var leftWhitespace = /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/;
	var rightWhitespace = /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/;
	
	module.exports = function trim() {
		var S = ES.ToString(ES.CheckObjectCoercible(this));
		return replace(replace(S, leftWhitespace, ''), rightWhitespace, '');
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $isNaN = __webpack_require__(17);
	var $isFinite = __webpack_require__(18);
	
	var sign = __webpack_require__(19);
	var mod = __webpack_require__(20);
	
	var IsCallable = __webpack_require__(21);
	var toPrimitive = __webpack_require__(22);
	
	// https://es5.github.io/#x9
	var ES5 = {
		ToPrimitive: toPrimitive,
	
		ToBoolean: function ToBoolean(value) {
			return Boolean(value);
		},
		ToNumber: function ToNumber(value) {
			return Number(value);
		},
		ToInteger: function ToInteger(value) {
			var number = this.ToNumber(value);
			if ($isNaN(number)) { return 0; }
			if (number === 0 || !$isFinite(number)) { return number; }
			return sign(number) * Math.floor(Math.abs(number));
		},
		ToInt32: function ToInt32(x) {
			return this.ToNumber(x) >> 0;
		},
		ToUint32: function ToUint32(x) {
			return this.ToNumber(x) >>> 0;
		},
		ToUint16: function ToUint16(value) {
			var number = this.ToNumber(value);
			if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
			var posInt = sign(number) * Math.floor(Math.abs(number));
			return mod(posInt, 0x10000);
		},
		ToString: function ToString(value) {
			return String(value);
		},
		ToObject: function ToObject(value) {
			this.CheckObjectCoercible(value);
			return Object(value);
		},
		CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
			/* jshint eqnull:true */
			if (value == null) {
				throw new TypeError(optMessage || 'Cannot call method on ' + value);
			}
			return value;
		},
		IsCallable: IsCallable,
		SameValue: function SameValue(x, y) {
			if (x === y) { // 0 === -0, but they are not identical.
				if (x === 0) { return 1 / x === 1 / y; }
				return true;
			}
			return $isNaN(x) && $isNaN(y);
		},
	
		// http://www.ecma-international.org/ecma-262/5.1/#sec-8
		Type: function Type(x) {
			if (x === null) {
				return 'Null';
			}
			if (typeof x === 'undefined') {
				return 'Undefined';
			}
			if (typeof x === 'function' || typeof x === 'object') {
				return 'Object';
			}
			if (typeof x === 'number') {
				return 'Number';
			}
			if (typeof x === 'boolean') {
				return 'Boolean';
			}
			if (typeof x === 'string') {
				return 'String';
			}
		}
	};
	
	module.exports = ES5;


/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = Number.isNaN || function isNaN(a) {
		return a !== a;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	var $isNaN = Number.isNaN || function (a) { return a !== a; };
	
	module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function sign(number) {
		return number >= 0 ? 1 : -1;
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function mod(number, modulo) {
		var remain = number % modulo;
		return Math.floor(remain >= 0 ? remain : remain + modulo);
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	var fnToStr = Function.prototype.toString;
	
	var constructorRegex = /^\s*class /;
	var isES6ClassFn = function isES6ClassFn(value) {
		try {
			var fnStr = fnToStr.call(value);
			var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
			var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
			var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
			return constructorRegex.test(spaceStripped);
		} catch (e) {
			return false; // not a function
		}
	};
	
	var tryFunctionObject = function tryFunctionObject(value) {
		try {
			if (isES6ClassFn(value)) { return false; }
			fnToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var fnClass = '[object Function]';
	var genClass = '[object GeneratorFunction]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	
	module.exports = function isCallable(value) {
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr.call(value);
		return strClass === fnClass || strClass === genClass;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toStr = Object.prototype.toString;
	
	var isPrimitive = __webpack_require__(23);
	
	var isCallable = __webpack_require__(21);
	
	// https://es5.github.io/#x8.12
	var ES5internalSlots = {
		'[[DefaultValue]]': function (O, hint) {
			var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);
	
			if (actualHint === String || actualHint === Number) {
				var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
				var value, i;
				for (i = 0; i < methods.length; ++i) {
					if (isCallable(O[methods[i]])) {
						value = O[methods[i]]();
						if (isPrimitive(value)) {
							return value;
						}
					}
				}
				throw new TypeError('No default value');
			}
			throw new TypeError('invalid [[DefaultValue]] hint supplied');
		}
	};
	
	// https://es5.github.io/#x9
	module.exports = function ToPrimitive(input, PreferredType) {
		if (isPrimitive(input)) {
			return input;
		}
		return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function isPrimitive(value) {
		return value === null || (typeof value !== 'function' && typeof value !== 'object');
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var implementation = __webpack_require__(15);
	
	var zeroWidthSpace = '\u200b';
	
	module.exports = function getPolyfill() {
		if (String.prototype.trim && zeroWidthSpace.trim() === zeroWidthSpace) {
			return String.prototype.trim;
		}
		return implementation;
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var define = __webpack_require__(11);
	var getPolyfill = __webpack_require__(24);
	
	module.exports = function shimStringTrim() {
		var polyfill = getPolyfill();
		define(String.prototype, { trim: polyfill }, { trim: function () { return String.prototype.trim !== polyfill; } });
		return polyfill;
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = {
		"settings": "Settings",
		"menu": "Show menu drawer",
		"help": "Help",
		"email": "Send an email to support",
		"logout": "Sign out"
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./en": 26,
		"./en.json": 26
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 27;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _i18n = __webpack_require__(1);
	
	var _Navigation = __webpack_require__(29);
	
	var _Navigation2 = _interopRequireDefault(_Navigation);
	
	var _Drawer = __webpack_require__(34);
	
	var _Drawer2 = _interopRequireDefault(_Drawer);
	
	var _menu = __webpack_require__(35);
	
	var _menu2 = _interopRequireDefault(_menu);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var template = function () {
		return {
			data: function data() {
				return {
					sections: [{
						label: 'settings',
						icon: 'icon-cog',
						items: _menu2.default.settings
					}]
				};
			},
	
	
			components: {
				Navigation: _Navigation2.default,
				Drawer: _Drawer2.default
			},
	
			helpers: { t: _i18n.t },
	
			methods: {
				toggleDrawer: function toggleDrawer() {
					this.refs.drawer.set({ folded: false });
				}
			}
		};
	}();
	
	function renderMainFragment(root, component) {
		var button = createElement('button');
		button.className = "coz-bar-burger";
	
		function clickHandler(event) {
			component.toggleDrawer();
		}
	
		addEventListener(button, 'click', clickHandler);
	
		setAttribute(button, 'data-icon', "icon-hamburger");
	
		var text = createText(template.helpers.t('menu'));
		appendNode(text, button);
		var text1 = createText("\n\n");
	
		var h1 = createElement('h1');
		h1.className = "coz-bar-title";
	
		var img = createElement('img');
		img.className = "coz-bar-hide-sm";
		img.src = root.iconPath;
		img.width = "32";
	
		appendNode(img, h1);
		appendNode(createText("\n  "), h1);
	
		var span = createElement('span');
		span.className = "coz-bar-hide-sm";
	
		appendNode(span, h1);
		appendNode(createText("cozy"), span);
	
		var strong = createElement('strong');
	
		appendNode(strong, h1);
		var text4 = createText(root.appName);
		appendNode(text4, strong);
		var text5 = createText("\n\n");
	
		var hr = createElement('hr');
		hr.className = "coz-sep-flex";
	
		var text6 = createText("\n\n");
	
		var navigation_initialData = {
			sections: root.sections
		};
		var navigation = new template.components.Navigation({
			target: null,
			_root: component._root || component,
			data: navigation_initialData
		});
	
		var text7 = createText("\n\n");
	
		var drawer_initialData = {
			groups: root.sections[0].items
		};
		var drawer = new template.components.Drawer({
			target: null,
			_root: component._root || component,
			data: drawer_initialData
		});
	
		component.refs.drawer = drawer;
	
		return {
			mount: function mount(target, anchor) {
				insertNode(button, target, anchor);
				insertNode(text1, target, anchor);
				insertNode(h1, target, anchor);
				insertNode(text5, target, anchor);
				insertNode(hr, target, anchor);
				insertNode(text6, target, anchor);
				navigation._fragment.mount(target, anchor);
				insertNode(text7, target, anchor);
				drawer._fragment.mount(target, anchor);
			},
	
			update: function update(changed, root) {
				text.data = template.helpers.t('menu');
	
				img.src = root.iconPath;
	
				text4.data = root.appName;
	
				var navigation_changes = {};

				if ('sections' in changed) navigation_changes.sections = root.sections;

				if (Object.keys(navigation_changes).length) navigation.set(navigation_changes);

				var drawer_changes = {};

				if ('sections' in changed) drawer_changes.groups = root.sections[0].items;

				if (Object.keys(drawer_changes).length) drawer.set(drawer_changes);
			},

			teardown: function teardown(detach) {
				removeEventListener(button, 'click', clickHandler);
				navigation.teardown(detach);
				if (component.refs.drawer === drawer) component.refs.drawer = null;
				drawer.teardown(detach);

				if (detach) {
					detachNode(button);
					detachNode(text1);
					detachNode(h1);
					detachNode(text5);
					detachNode(hr);
					detachNode(text6);
					detachNode(text7);
				}
			}
		};
	}

	function SvelteComponent(options) {
		options = options || {};

		this.refs = {};
		this._state = Object.assign(template.data(), options.data);

		this._observers = {
			pre: Object.create(null),
			post: Object.create(null)
		};

		this._handlers = Object.create(null);

		this._root = options._root;
		this._yield = options._yield;

		this._renderHooks = [];

		this._fragment = renderMainFragment(this._state, this);
		if (options.target) this._fragment.mount(options.target, null);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}
	}

	SvelteComponent.prototype = template.methods;

	SvelteComponent.prototype.get = function get(key) {
		return key ? this._state[key] : this._state;
	};

	SvelteComponent.prototype.fire = function fire(eventName, data) {
		var handlers = eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			handlers[i].call(this, data);
		}
	};

	SvelteComponent.prototype.observe = function observe(key, callback, options) {
		var group = options && options.defer ? this._observers.pre : this._observers.post;

		(group[key] || (group[key] = [])).push(callback);

		if (!options || options.init !== false) {
			callback.__calling = true;
			callback.call(this, this._state[key]);
			callback.__calling = false;
		}

		return {
			cancel: function cancel() {
				var index = group[key].indexOf(callback);
				if (~index) group[key].splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.on = function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function cancel() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.set = function set(newState) {
		var oldState = this._state;
		this._state = Object.assign({}, oldState, newState);

		dispatchObservers(this, this._observers.pre, newState, oldState);
		if (this._fragment) this._fragment.update(newState, this._state);
		dispatchObservers(this, this._observers.post, newState, oldState);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}
	};

	SvelteComponent.prototype.teardown = function teardown(detach) {
		this.fire('teardown');

		this._fragment.teardown(detach !== false);
		this._fragment = null;

		this._state = {};
	};

	function dispatchObservers(component, group, newState, oldState) {
		for (var key in group) {
			if (!(key in newState)) continue;

			var newValue = newState[key];
			var oldValue = oldState[key];

			if (newValue === oldValue && (typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') continue;

			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}

	function addEventListener(node, event, handler) {
		node.addEventListener(event, handler, false);
	}

	function removeEventListener(node, event, handler) {
		node.removeEventListener(event, handler, false);
	}

	function setAttribute(node, attribute, value) {
		node.setAttribute(attribute, value);
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function appendNode(node, target) {
		target.appendChild(node);
	}

	exports.default = SvelteComponent;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _NavigationSection = __webpack_require__(30);
	
	var _NavigationSection2 = _interopRequireDefault(_NavigationSection);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var template = function () {
		return {
			components: {
				NavigationSection: _NavigationSection2.default
			}
		};
	}();
	
	function renderMainFragment(root, component) {
		var nav = createElement('nav');
		nav.className = "coz-nav";
	
		var ul = createElement('ul');
	
		appendNode(ul, nav);
		var eachBlock_anchor = createComment("#each sections");
		appendNode(eachBlock_anchor, ul);
		var eachBlock_value = root.sections;
		var eachBlock_iterations = [];
	
		for (var i = 0; i < eachBlock_value.length; i += 1) {
			eachBlock_iterations[i] = renderEachBlock(root, eachBlock_value, eachBlock_value[i], i, component);
			eachBlock_iterations[i].mount(eachBlock_anchor.parentNode, eachBlock_anchor);
		}
	
		return {
			mount: function mount(target, anchor) {
				insertNode(nav, target, anchor);
			},
	
			update: function update(changed, root) {
				var eachBlock_value = root.sections;
	
				for (var i = 0; i < eachBlock_value.length; i += 1) {
					if (!eachBlock_iterations[i]) {
						eachBlock_iterations[i] = renderEachBlock(root, eachBlock_value, eachBlock_value[i], i, component);
						eachBlock_iterations[i].mount(eachBlock_anchor.parentNode, eachBlock_anchor);
					} else {
						eachBlock_iterations[i].update(changed, root, eachBlock_value, eachBlock_value[i], i);
					}
				}

				teardownEach(eachBlock_iterations, true, eachBlock_value.length);

				eachBlock_iterations.length = eachBlock_value.length;
			},

			teardown: function teardown(detach) {
				teardownEach(eachBlock_iterations, false);

				if (detach) {
					detachNode(nav);
				}
			}
		};
	}

	function renderEachBlock(root, eachBlock_value, section, section__index, component) {
		var navigationSection_initialData = {
			standalone: "false",
			label: section.label,
			icon: section.icon,
			items: section.items
		};
		var navigationSection = new template.components.NavigationSection({
			target: null,
			_root: component._root || component,
			data: navigationSection_initialData
		});

		return {
			mount: function mount(target, anchor) {
				navigationSection._fragment.mount(target, anchor);
			},

			update: function update(changed, root, eachBlock_value, section, section__index) {
				var navigationSection_changes = {};

				if ('sections' in changed) navigationSection_changes.label = section.label;
				if ('sections' in changed) navigationSection_changes.icon = section.icon;
				if ('sections' in changed) navigationSection_changes.items = section.items;

				if (Object.keys(navigationSection_changes).length) navigationSection.set(navigationSection_changes);
			},

			teardown: function teardown(detach) {
				navigationSection.teardown(detach);
			}
		};
	}

	function SvelteComponent(options) {
		options = options || {};

		this._state = options.data || {};

		this._observers = {
			pre: Object.create(null),
			post: Object.create(null)
		};

		this._handlers = Object.create(null);

		this._root = options._root;
		this._yield = options._yield;

		this._renderHooks = [];

		this._fragment = renderMainFragment(this._state, this);
		if (options.target) this._fragment.mount(options.target, null);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}
	}

	SvelteComponent.prototype.get = function get(key) {
		return key ? this._state[key] : this._state;
	};

	SvelteComponent.prototype.fire = function fire(eventName, data) {
		var handlers = eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			handlers[i].call(this, data);
		}
	};

	SvelteComponent.prototype.observe = function observe(key, callback, options) {
		var group = options && options.defer ? this._observers.pre : this._observers.post;

		(group[key] || (group[key] = [])).push(callback);

		if (!options || options.init !== false) {
			callback.__calling = true;
			callback.call(this, this._state[key]);
			callback.__calling = false;
		}

		return {
			cancel: function cancel() {
				var index = group[key].indexOf(callback);
				if (~index) group[key].splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.on = function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function cancel() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.set = function set(newState) {
		var oldState = this._state;
		this._state = Object.assign({}, oldState, newState);

		dispatchObservers(this, this._observers.pre, newState, oldState);
		if (this._fragment) this._fragment.update(newState, this._state);
		dispatchObservers(this, this._observers.post, newState, oldState);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}
	};

	SvelteComponent.prototype.teardown = function teardown(detach) {
		this.fire('teardown');

		this._fragment.teardown(detach !== false);
		this._fragment = null;

		this._state = {};
	};

	function dispatchObservers(component, group, newState, oldState) {
		for (var key in group) {
			if (!(key in newState)) continue;

			var newValue = newState[key];
			var oldValue = oldState[key];

			if (newValue === oldValue && (typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') continue;

			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function appendNode(node, target) {
		target.appendChild(node);
	}

	function createComment(data) {
		return document.createComment(data);
	}

	function teardownEach(iterations, detach, start) {
		for (var i = start || 0; i < iterations.length; i += 1) {
			iterations[i].teardown(detach);
		}
	}

	exports.default = SvelteComponent;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _jssha = __webpack_require__(31);
	
	var _jssha2 = _interopRequireDefault(_jssha);
	
	var _NavigationGroup = __webpack_require__(32);
	
	var _NavigationGroup2 = _interopRequireDefault(_NavigationGroup);
	
	var _i18n = __webpack_require__(1);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function applyComputations(state, newState, oldState) {
		if ('label' in newState && _typeof(state.label) === 'object' || state.label !== oldState.label) {
			state.hash = newState.hash = template.computed.hash(state.label);
		}
	}
	
	var template = function () {
		var SHA1 = new _jssha2.default('SHA-1', 'TEXT');
	
		var clickOutsideListener = void 0;
	
		return {
			data: function data() {
				return {
					hidden: true
				};
			},
	
			computed: {
				hash: function hash(label) {
					SHA1.update(label);
					return SHA1.getHash('HEX').slice(0, 6);
				}
			},
	
			onrender: function onrender() {
				var _this = this;
	
				clickOutsideListener = this._root.on('clickOutside', function () {
					_this.set({ hidden: true });
				});
			},
			onteardown: function onteardown() {
				clickOutsideListener.cancel();
			},
	
	
			components: {
				NavigationGroup: _NavigationGroup2.default
			},
	
			helpers: { t: _i18n.t }
		};
	}();
	
	function renderMainFragment(root, component) {
		var li = createElement('li');
		li.className = "coz-nav-section";
	
		function clickHandler(event) {
			event.stopPropagation();
		}
	
		addEventListener(li, 'click', clickHandler);
	
		var a = createElement('a');
	
		function clickHandler1(event) {
			var root = this.__svelte.root;
	
			component.set({ hidden: !root.hidden });
		}
	
		addEventListener(a, 'click', clickHandler1);
	
		setAttribute(a, 'aria-controls', 'coz-nav-pop-' + root.hash);
		setAttribute(a, 'data-icon', root.icon);
	
		a.__svelte = {
			root: root
		};
	
		appendNode(a, li);
		var text = createText(template.helpers.t(root.label));
		appendNode(text, a);
		appendNode(createText("\n  "), li);
	
		var div = createElement('div');
		div.className = "coz-nav-pop";
		div.id = 'coz-nav-pop-' + root.hash;
		setAttribute(div, 'aria-hidden', root.hidden);
	
		appendNode(div, li);
		var eachBlock_anchor = createComment("#each items");
		appendNode(eachBlock_anchor, div);
		var eachBlock_value = root.items;
		var eachBlock_iterations = [];
	
		for (var i = 0; i < eachBlock_value.length; i += 1) {
			eachBlock_iterations[i] = renderEachBlock(root, eachBlock_value, eachBlock_value[i], i, component);
			eachBlock_iterations[i].mount(eachBlock_anchor.parentNode, eachBlock_anchor);
		}
	
		return {
			mount: function mount(target, anchor) {
				insertNode(li, target, anchor);
			},
	
			update: function update(changed, root) {
				setAttribute(a, 'aria-controls', 'coz-nav-pop-' + root.hash);
				setAttribute(a, 'data-icon', root.icon);
	
				a.__svelte.root = root;
	
				text.data = template.helpers.t(root.label);
	
				div.id = 'coz-nav-pop-' + root.hash;
				setAttribute(div, 'aria-hidden', root.hidden);
	
				var eachBlock_value = root.items;
	
				for (var i = 0; i < eachBlock_value.length; i += 1) {
					if (!eachBlock_iterations[i]) {
						eachBlock_iterations[i] = renderEachBlock(root, eachBlock_value, eachBlock_value[i], i, component);
						eachBlock_iterations[i].mount(eachBlock_anchor.parentNode, eachBlock_anchor);
					} else {
						eachBlock_iterations[i].update(changed, root, eachBlock_value, eachBlock_value[i], i);
					}
				}

				teardownEach(eachBlock_iterations, true, eachBlock_value.length);

				eachBlock_iterations.length = eachBlock_value.length;
			},

			teardown: function teardown(detach) {
				removeEventListener(li, 'click', clickHandler);
				removeEventListener(a, 'click', clickHandler1);

				teardownEach(eachBlock_iterations, false);

				if (detach) {
					detachNode(li);
				}
			}
		};
	}

	function renderEachBlock(root, eachBlock_value, group, group__index, component) {
		var navigationGroup_initialData = {
			separator: "bottom",
			group: group
		};
		var navigationGroup = new template.components.NavigationGroup({
			target: null,
			_root: component._root || component,
			data: navigationGroup_initialData
		});

		return {
			mount: function mount(target, anchor) {
				navigationGroup._fragment.mount(target, anchor);
			},

			update: function update(changed, root, eachBlock_value, group, group__index) {
				var navigationGroup_changes = {};

				if ('items' in changed) navigationGroup_changes.group = group;

				if (Object.keys(navigationGroup_changes).length) navigationGroup.set(navigationGroup_changes);
			},

			teardown: function teardown(detach) {
				navigationGroup.teardown(detach);
			}
		};
	}

	function SvelteComponent(options) {
		options = options || {};

		this._state = Object.assign(template.data(), options.data);
		applyComputations(this._state, this._state, {});

		this._observers = {
			pre: Object.create(null),
			post: Object.create(null)
		};

		this._handlers = Object.create(null);

		this._root = options._root;
		this._yield = options._yield;

		this._renderHooks = [];

		this._fragment = renderMainFragment(this._state, this);
		if (options.target) this._fragment.mount(options.target, null);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}

		if (options._root) {
			options._root._renderHooks.push({ fn: template.onrender, context: this });
		} else {
			template.onrender.call(this);
		}
	}

	SvelteComponent.prototype.get = function get(key) {
		return key ? this._state[key] : this._state;
	};

	SvelteComponent.prototype.fire = function fire(eventName, data) {
		var handlers = eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			handlers[i].call(this, data);
		}
	};

	SvelteComponent.prototype.observe = function observe(key, callback, options) {
		var group = options && options.defer ? this._observers.pre : this._observers.post;

		(group[key] || (group[key] = [])).push(callback);

		if (!options || options.init !== false) {
			callback.__calling = true;
			callback.call(this, this._state[key]);
			callback.__calling = false;
		}

		return {
			cancel: function cancel() {
				var index = group[key].indexOf(callback);
				if (~index) group[key].splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.on = function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function cancel() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.set = function set(newState) {
		var oldState = this._state;
		this._state = Object.assign({}, oldState, newState);
		applyComputations(this._state, newState, oldState);

		dispatchObservers(this, this._observers.pre, newState, oldState);
		if (this._fragment) this._fragment.update(newState, this._state);
		dispatchObservers(this, this._observers.post, newState, oldState);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}
	};

	SvelteComponent.prototype.teardown = function teardown(detach) {
		this.fire('teardown');
		template.onteardown.call(this);

		this._fragment.teardown(detach !== false);
		this._fragment = null;

		this._state = {};
	};

	function dispatchObservers(component, group, newState, oldState) {
		for (var key in group) {
			if (!(key in newState)) continue;

			var newValue = newState[key];
			var oldValue = oldState[key];

			if (newValue === oldValue && (typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') continue;

			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}

	function addEventListener(node, event, handler) {
		node.addEventListener(event, handler, false);
	}

	function removeEventListener(node, event, handler) {
		node.removeEventListener(event, handler, false);
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function setAttribute(node, attribute, value) {
		node.setAttribute(attribute, value);
	}

	function appendNode(node, target) {
		target.appendChild(node);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment(data) {
		return document.createComment(data);
	}

	function teardownEach(iterations, detach, start) {
		for (var i = start || 0; i < iterations.length; i += 1) {
			iterations[i].teardown(detach);
		}
	}

	exports.default = SvelteComponent;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 A JavaScript implementation of the SHA family of hashes, as
	 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
	 HMAC implementation as defined in FIPS PUB 198a
	
	 Copyright Brian Turek 2008-2016
	 Distributed under the BSD License
	 See http://caligatio.github.com/jsSHA/ for more information
	
	 Several functions taken from Paul Johnston
	*/
	'use strict';(function(X){function C(f,b,c){var d=0,a=[],k=0,g,e,n,h,m,r,t,q,v=!1,u=[],w=[],x,y=!1,z=!1;c=c||{};g=c.encoding||"UTF8";x=c.numRounds||1;n=J(b,g);if(x!==parseInt(x,10)||1>x)throw Error("numRounds must a integer >= 1");if("SHA-1"===f)m=512,r=K,t=Y,h=160,q=function(b){return b.slice()};else if(0===f.lastIndexOf("SHA-",0))if(r=function(b,d){return L(b,d,f)},t=function(b,d,c,a){var l,k;if("SHA-224"===f||"SHA-256"===f)l=(d+65>>>9<<4)+15,k=16;else if("SHA-384"===f||"SHA-512"===f)l=(d+129>>>
	10<<5)+31,k=32;else throw Error("Unexpected error in SHA-2 implementation");for(;b.length<=l;)b.push(0);b[d>>>5]|=128<<24-d%32;d=d+c;b[l]=d&4294967295;b[l-1]=d/4294967296|0;c=b.length;for(d=0;d<c;d+=k)a=L(b.slice(d,d+k),a,f);if("SHA-224"===f)b=[a[0],a[1],a[2],a[3],a[4],a[5],a[6]];else if("SHA-256"===f)b=a;else if("SHA-384"===f)b=[a[0].a,a[0].b,a[1].a,a[1].b,a[2].a,a[2].b,a[3].a,a[3].b,a[4].a,a[4].b,a[5].a,a[5].b];else if("SHA-512"===f)b=[a[0].a,a[0].b,a[1].a,a[1].b,a[2].a,a[2].b,a[3].a,a[3].b,a[4].a,
	a[4].b,a[5].a,a[5].b,a[6].a,a[6].b,a[7].a,a[7].b];else throw Error("Unexpected error in SHA-2 implementation");return b},q=function(b){return b.slice()},"SHA-224"===f)m=512,h=224;else if("SHA-256"===f)m=512,h=256;else if("SHA-384"===f)m=1024,h=384;else if("SHA-512"===f)m=1024,h=512;else throw Error("Chosen SHA variant is not supported");else if(0===f.lastIndexOf("SHA3-",0)||0===f.lastIndexOf("SHAKE",0)){var F=6;r=D;q=function(b){var f=[],a;for(a=0;5>a;a+=1)f[a]=b[a].slice();return f};if("SHA3-224"===
	f)m=1152,h=224;else if("SHA3-256"===f)m=1088,h=256;else if("SHA3-384"===f)m=832,h=384;else if("SHA3-512"===f)m=576,h=512;else if("SHAKE128"===f)m=1344,h=-1,F=31,z=!0;else if("SHAKE256"===f)m=1088,h=-1,F=31,z=!0;else throw Error("Chosen SHA variant is not supported");t=function(b,f,a,d,c){a=m;var l=F,k,g=[],e=a>>>5,h=0,p=f>>>5;for(k=0;k<p&&f>=a;k+=e)d=D(b.slice(k,k+e),d),f-=a;b=b.slice(k);for(f%=a;b.length<e;)b.push(0);k=f>>>3;b[k>>2]^=l<<24-k%4*8;b[e-1]^=128;for(d=D(b,d);32*g.length<c;){b=d[h%5][h/
	5|0];g.push((b.b&255)<<24|(b.b&65280)<<8|(b.b&16711680)>>8|b.b>>>24);if(32*g.length>=c)break;g.push((b.a&255)<<24|(b.a&65280)<<8|(b.a&16711680)>>8|b.a>>>24);h+=1;0===64*h%a&&D(null,d)}return g}}else throw Error("Chosen SHA variant is not supported");e=B(f);this.setHMACKey=function(b,a,c){var l;if(!0===v)throw Error("HMAC key already set");if(!0===y)throw Error("Cannot set HMAC key after calling update");if(!0===z)throw Error("SHAKE is not supported for HMAC");g=(c||{}).encoding||"UTF8";a=J(a,g)(b);
	b=a.binLen;a=a.value;l=m>>>3;c=l/4-1;if(l<b/8){for(a=t(a,b,0,B(f),h);a.length<=c;)a.push(0);a[c]&=4294967040}else if(l>b/8){for(;a.length<=c;)a.push(0);a[c]&=4294967040}for(b=0;b<=c;b+=1)u[b]=a[b]^909522486,w[b]=a[b]^1549556828;e=r(u,e);d=m;v=!0};this.update=function(b){var f,c,g,h=0,q=m>>>5;f=n(b,a,k);b=f.binLen;c=f.value;f=b>>>5;for(g=0;g<f;g+=q)h+m<=b&&(e=r(c.slice(g,g+q),e),h+=m);d+=h;a=c.slice(h>>>5);k=b%m;y=!0};this.getHash=function(b,c){var g,m,n,r;if(!0===v)throw Error("Cannot call getHash after setting HMAC key");
	n=M(c);if(!0===z){if(-1===n.shakeLen)throw Error("shakeLen must be specified in options");h=n.shakeLen}switch(b){case "HEX":g=function(b){return N(b,h,n)};break;case "B64":g=function(b){return O(b,h,n)};break;case "BYTES":g=function(b){return P(b,h)};break;case "ARRAYBUFFER":try{m=new ArrayBuffer(0)}catch(sa){throw Error("ARRAYBUFFER not supported by this environment");}g=function(b){return Q(b,h)};break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");}r=t(a.slice(),k,d,q(e),
	h);for(m=1;m<x;m+=1)!0===z&&0!==h%32&&(r[r.length-1]&=4294967040<<24-h%32),r=t(r,h,0,B(f),h);return g(r)};this.getHMAC=function(b,c){var g,n,u,x;if(!1===v)throw Error("Cannot call getHMAC without first setting HMAC key");u=M(c);switch(b){case "HEX":g=function(b){return N(b,h,u)};break;case "B64":g=function(b){return O(b,h,u)};break;case "BYTES":g=function(b){return P(b,h)};break;case "ARRAYBUFFER":try{g=new ArrayBuffer(0)}catch(z){throw Error("ARRAYBUFFER not supported by this environment");}g=function(b){return Q(b,
	h)};break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");}n=t(a.slice(),k,d,q(e),h);x=r(w,B(f));x=t(n,h,m,x,h);return g(x)}}function a(f,b){this.a=f;this.b=b}function Z(f,b,a){var d=f.length,l,k,g,e,n;b=b||[0];a=a||0;n=a>>>3;if(0!==d%2)throw Error("String of HEX type must be in byte increments");for(l=0;l<d;l+=2){k=parseInt(f.substr(l,2),16);if(isNaN(k))throw Error("String of HEX type contains invalid characters");e=(l>>>1)+n;for(g=e>>>2;b.length<=g;)b.push(0);b[g]|=k<<
	8*(3-e%4)}return{value:b,binLen:4*d+a}}function aa(f,b,a){var d=[],l,k,g,e,d=b||[0];a=a||0;k=a>>>3;for(l=0;l<f.length;l+=1)b=f.charCodeAt(l),e=l+k,g=e>>>2,d.length<=g&&d.push(0),d[g]|=b<<8*(3-e%4);return{value:d,binLen:8*f.length+a}}function ba(f,b,a){var d=[],l=0,k,g,e,n,h,m,d=b||[0];a=a||0;b=a>>>3;if(-1===f.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");g=f.indexOf("=");f=f.replace(/\=/g,"");if(-1!==g&&g<f.length)throw Error("Invalid '=' found in base-64 string");
	for(g=0;g<f.length;g+=4){h=f.substr(g,4);for(e=n=0;e<h.length;e+=1)k="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h[e]),n|=k<<18-6*e;for(e=0;e<h.length-1;e+=1){m=l+b;for(k=m>>>2;d.length<=k;)d.push(0);d[k]|=(n>>>16-8*e&255)<<8*(3-m%4);l+=1}}return{value:d,binLen:8*l+a}}function ca(a,b,c){var d=[],l,k,g,d=b||[0];c=c||0;l=c>>>3;for(b=0;b<a.byteLength;b+=1)g=b+l,k=g>>>2,d.length<=k&&d.push(0),d[k]|=a[b]<<8*(3-g%4);return{value:d,binLen:8*a.byteLength+c}}function N(a,b,c){var d=
	"";b/=8;var l,k;for(l=0;l<b;l+=1)k=a[l>>>2]>>>8*(3-l%4),d+="0123456789abcdef".charAt(k>>>4&15)+"0123456789abcdef".charAt(k&15);return c.outputUpper?d.toUpperCase():d}function O(a,b,c){var d="",l=b/8,k,g,e;for(k=0;k<l;k+=3)for(g=k+1<l?a[k+1>>>2]:0,e=k+2<l?a[k+2>>>2]:0,e=(a[k>>>2]>>>8*(3-k%4)&255)<<16|(g>>>8*(3-(k+1)%4)&255)<<8|e>>>8*(3-(k+2)%4)&255,g=0;4>g;g+=1)8*k+6*g<=b?d+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e>>>6*(3-g)&63):d+=c.b64Pad;return d}function P(a,
	b){var c="",d=b/8,l,k;for(l=0;l<d;l+=1)k=a[l>>>2]>>>8*(3-l%4)&255,c+=String.fromCharCode(k);return c}function Q(a,b){var c=b/8,d,l=new ArrayBuffer(c);for(d=0;d<c;d+=1)l[d]=a[d>>>2]>>>8*(3-d%4)&255;return l}function M(a){var b={outputUpper:!1,b64Pad:"=",shakeLen:-1};a=a||{};b.outputUpper=a.outputUpper||!1;!0===a.hasOwnProperty("b64Pad")&&(b.b64Pad=a.b64Pad);if(!0===a.hasOwnProperty("shakeLen")){if(0!==a.shakeLen%8)throw Error("shakeLen must be a multiple of 8");b.shakeLen=a.shakeLen}if("boolean"!==
	typeof b.outputUpper)throw Error("Invalid outputUpper formatting option");if("string"!==typeof b.b64Pad)throw Error("Invalid b64Pad formatting option");return b}function J(a,b){var c;switch(b){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");}switch(a){case "HEX":c=Z;break;case "TEXT":c=function(a,f,c){var e=[],p=[],n=0,h,m,r,t,q,e=f||[0];f=c||0;r=f>>>3;if("UTF8"===b)for(h=0;h<a.length;h+=1)for(c=a.charCodeAt(h),p=[],128>c?p.push(c):
	2048>c?(p.push(192|c>>>6),p.push(128|c&63)):55296>c||57344<=c?p.push(224|c>>>12,128|c>>>6&63,128|c&63):(h+=1,c=65536+((c&1023)<<10|a.charCodeAt(h)&1023),p.push(240|c>>>18,128|c>>>12&63,128|c>>>6&63,128|c&63)),m=0;m<p.length;m+=1){q=n+r;for(t=q>>>2;e.length<=t;)e.push(0);e[t]|=p[m]<<8*(3-q%4);n+=1}else if("UTF16BE"===b||"UTF16LE"===b)for(h=0;h<a.length;h+=1){c=a.charCodeAt(h);"UTF16LE"===b&&(m=c&255,c=m<<8|c>>>8);q=n+r;for(t=q>>>2;e.length<=t;)e.push(0);e[t]|=c<<8*(2-q%4);n+=2}return{value:e,binLen:8*
	n+f}};break;case "B64":c=ba;break;case "BYTES":c=aa;break;case "ARRAYBUFFER":try{c=new ArrayBuffer(0)}catch(d){throw Error("ARRAYBUFFER not supported by this environment");}c=ca;break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");}return c}function y(a,b){return a<<b|a>>>32-b}function R(f,b){return 32<b?(b=b-32,new a(f.b<<b|f.a>>>32-b,f.a<<b|f.b>>>32-b)):0!==b?new a(f.a<<b|f.b>>>32-b,f.b<<b|f.a>>>32-b):f}function v(a,b){return a>>>b|a<<32-b}function w(f,b){var c=null,
	c=new a(f.a,f.b);return c=32>=b?new a(c.a>>>b|c.b<<32-b&4294967295,c.b>>>b|c.a<<32-b&4294967295):new a(c.b>>>b-32|c.a<<64-b&4294967295,c.a>>>b-32|c.b<<64-b&4294967295)}function S(f,b){var c=null;return c=32>=b?new a(f.a>>>b,f.b>>>b|f.a<<32-b&4294967295):new a(0,f.a>>>b-32)}function da(a,b,c){return a&b^~a&c}function ea(f,b,c){return new a(f.a&b.a^~f.a&c.a,f.b&b.b^~f.b&c.b)}function T(a,b,c){return a&b^a&c^b&c}function fa(f,b,c){return new a(f.a&b.a^f.a&c.a^b.a&c.a,f.b&b.b^f.b&c.b^b.b&c.b)}function ga(a){return v(a,
	2)^v(a,13)^v(a,22)}function ha(f){var b=w(f,28),c=w(f,34);f=w(f,39);return new a(b.a^c.a^f.a,b.b^c.b^f.b)}function ia(a){return v(a,6)^v(a,11)^v(a,25)}function ja(f){var b=w(f,14),c=w(f,18);f=w(f,41);return new a(b.a^c.a^f.a,b.b^c.b^f.b)}function ka(a){return v(a,7)^v(a,18)^a>>>3}function la(f){var b=w(f,1),c=w(f,8);f=S(f,7);return new a(b.a^c.a^f.a,b.b^c.b^f.b)}function ma(a){return v(a,17)^v(a,19)^a>>>10}function na(f){var b=w(f,19),c=w(f,61);f=S(f,6);return new a(b.a^c.a^f.a,b.b^c.b^f.b)}function G(a,
	b){var c=(a&65535)+(b&65535);return((a>>>16)+(b>>>16)+(c>>>16)&65535)<<16|c&65535}function oa(a,b,c,d){var l=(a&65535)+(b&65535)+(c&65535)+(d&65535);return((a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(l>>>16)&65535)<<16|l&65535}function H(a,b,c,d,l){var e=(a&65535)+(b&65535)+(c&65535)+(d&65535)+(l&65535);return((a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(l>>>16)+(e>>>16)&65535)<<16|e&65535}function pa(f,b){var c,d,l;c=(f.b&65535)+(b.b&65535);d=(f.b>>>16)+(b.b>>>16)+(c>>>16);l=(d&65535)<<16|c&65535;c=(f.a&65535)+
	(b.a&65535)+(d>>>16);d=(f.a>>>16)+(b.a>>>16)+(c>>>16);return new a((d&65535)<<16|c&65535,l)}function qa(f,b,c,d){var l,e,g;l=(f.b&65535)+(b.b&65535)+(c.b&65535)+(d.b&65535);e=(f.b>>>16)+(b.b>>>16)+(c.b>>>16)+(d.b>>>16)+(l>>>16);g=(e&65535)<<16|l&65535;l=(f.a&65535)+(b.a&65535)+(c.a&65535)+(d.a&65535)+(e>>>16);e=(f.a>>>16)+(b.a>>>16)+(c.a>>>16)+(d.a>>>16)+(l>>>16);return new a((e&65535)<<16|l&65535,g)}function ra(f,b,c,d,l){var e,g,p;e=(f.b&65535)+(b.b&65535)+(c.b&65535)+(d.b&65535)+(l.b&65535);g=
	(f.b>>>16)+(b.b>>>16)+(c.b>>>16)+(d.b>>>16)+(l.b>>>16)+(e>>>16);p=(g&65535)<<16|e&65535;e=(f.a&65535)+(b.a&65535)+(c.a&65535)+(d.a&65535)+(l.a&65535)+(g>>>16);g=(f.a>>>16)+(b.a>>>16)+(c.a>>>16)+(d.a>>>16)+(l.a>>>16)+(e>>>16);return new a((g&65535)<<16|e&65535,p)}function A(f){var b=0,c=0,d;for(d=0;d<arguments.length;d+=1)b^=arguments[d].b,c^=arguments[d].a;return new a(c,b)}function B(f){var b=[],c;if("SHA-1"===f)b=[1732584193,4023233417,2562383102,271733878,3285377520];else if(0===f.lastIndexOf("SHA-",
	0))switch(b=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],c=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],f){case "SHA-224":break;case "SHA-256":b=c;break;case "SHA-384":b=[new a(3418070365,b[0]),new a(1654270250,b[1]),new a(2438529370,b[2]),new a(355462360,b[3]),new a(1731405415,b[4]),new a(41048885895,b[5]),new a(3675008525,b[6]),new a(1203062813,b[7])];break;case "SHA-512":b=[new a(c[0],4089235720),new a(c[1],
	2227873595),new a(c[2],4271175723),new a(c[3],1595750129),new a(c[4],2917565137),new a(c[5],725511199),new a(c[6],4215389547),new a(c[7],327033209)];break;default:throw Error("Unknown SHA variant");}else if(0===f.lastIndexOf("SHA3-",0)||0===f.lastIndexOf("SHAKE",0))for(f=0;5>f;f+=1)b[f]=[new a(0,0),new a(0,0),new a(0,0),new a(0,0),new a(0,0)];else throw Error("No SHA variants supported");return b}function K(a,b){var c=[],d,e,k,g,p,n,h;d=b[0];e=b[1];k=b[2];g=b[3];p=b[4];for(h=0;80>h;h+=1)c[h]=16>h?
	a[h]:y(c[h-3]^c[h-8]^c[h-14]^c[h-16],1),n=20>h?H(y(d,5),e&k^~e&g,p,1518500249,c[h]):40>h?H(y(d,5),e^k^g,p,1859775393,c[h]):60>h?H(y(d,5),T(e,k,g),p,2400959708,c[h]):H(y(d,5),e^k^g,p,3395469782,c[h]),p=g,g=k,k=y(e,30),e=d,d=n;b[0]=G(d,b[0]);b[1]=G(e,b[1]);b[2]=G(k,b[2]);b[3]=G(g,b[3]);b[4]=G(p,b[4]);return b}function Y(a,b,c,d){var e;for(e=(b+65>>>9<<4)+15;a.length<=e;)a.push(0);a[b>>>5]|=128<<24-b%32;b+=c;a[e]=b&4294967295;a[e-1]=b/4294967296|0;b=a.length;for(e=0;e<b;e+=16)d=K(a.slice(e,e+16),d);
	return d}function L(f,b,c){var d,l,k,g,p,n,h,m,r,t,q,v,u,w,x,y,z,F,A,B,C,D,E=[],I;if("SHA-224"===c||"SHA-256"===c)t=64,v=1,D=Number,u=G,w=oa,x=H,y=ka,z=ma,F=ga,A=ia,C=T,B=da,I=e;else if("SHA-384"===c||"SHA-512"===c)t=80,v=2,D=a,u=pa,w=qa,x=ra,y=la,z=na,F=ha,A=ja,C=fa,B=ea,I=U;else throw Error("Unexpected error in SHA-2 implementation");c=b[0];d=b[1];l=b[2];k=b[3];g=b[4];p=b[5];n=b[6];h=b[7];for(q=0;q<t;q+=1)16>q?(r=q*v,m=f.length<=r?0:f[r],r=f.length<=r+1?0:f[r+1],E[q]=new D(m,r)):E[q]=w(z(E[q-2]),
	E[q-7],y(E[q-15]),E[q-16]),m=x(h,A(g),B(g,p,n),I[q],E[q]),r=u(F(c),C(c,d,l)),h=n,n=p,p=g,g=u(k,m),k=l,l=d,d=c,c=u(m,r);b[0]=u(c,b[0]);b[1]=u(d,b[1]);b[2]=u(l,b[2]);b[3]=u(k,b[3]);b[4]=u(g,b[4]);b[5]=u(p,b[5]);b[6]=u(n,b[6]);b[7]=u(h,b[7]);return b}function D(f,b){var c,d,e,k,g=[],p=[];if(null!==f)for(d=0;d<f.length;d+=2)b[(d>>>1)%5][(d>>>1)/5|0]=A(b[(d>>>1)%5][(d>>>1)/5|0],new a((f[d+1]&255)<<24|(f[d+1]&65280)<<8|(f[d+1]&16711680)>>>8|f[d+1]>>>24,(f[d]&255)<<24|(f[d]&65280)<<8|(f[d]&16711680)>>>8|
	f[d]>>>24));for(c=0;24>c;c+=1){k=B("SHA3-");for(d=0;5>d;d+=1)g[d]=A(b[d][0],b[d][1],b[d][2],b[d][3],b[d][4]);for(d=0;5>d;d+=1)p[d]=A(g[(d+4)%5],R(g[(d+1)%5],1));for(d=0;5>d;d+=1)for(e=0;5>e;e+=1)b[d][e]=A(b[d][e],p[d]);for(d=0;5>d;d+=1)for(e=0;5>e;e+=1)k[e][(2*d+3*e)%5]=R(b[d][e],V[d][e]);for(d=0;5>d;d+=1)for(e=0;5>e;e+=1)b[d][e]=A(k[d][e],new a(~k[(d+1)%5][e].a&k[(d+2)%5][e].a,~k[(d+1)%5][e].b&k[(d+2)%5][e].b));b[0][0]=A(b[0][0],W[c])}return b}var e,U,V,W;e=[1116352408,1899447441,3049323471,3921009573,
	961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
	883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];U=[new a(e[0],3609767458),new a(e[1],602891725),new a(e[2],3964484399),new a(e[3],2173295548),new a(e[4],4081628472),new a(e[5],3053834265),new a(e[6],2937671579),new a(e[7],3664609560),new a(e[8],2734883394),new a(e[9],1164996542),new a(e[10],1323610764),new a(e[11],3590304994),new a(e[12],4068182383),new a(e[13],991336113),new a(e[14],633803317),new a(e[15],
	3479774868),new a(e[16],2666613458),new a(e[17],944711139),new a(e[18],2341262773),new a(e[19],2007800933),new a(e[20],1495990901),new a(e[21],1856431235),new a(e[22],3175218132),new a(e[23],2198950837),new a(e[24],3999719339),new a(e[25],766784016),new a(e[26],2566594879),new a(e[27],3203337956),new a(e[28],1034457026),new a(e[29],2466948901),new a(e[30],3758326383),new a(e[31],168717936),new a(e[32],1188179964),new a(e[33],1546045734),new a(e[34],1522805485),new a(e[35],2643833823),new a(e[36],
	2343527390),new a(e[37],1014477480),new a(e[38],1206759142),new a(e[39],344077627),new a(e[40],1290863460),new a(e[41],3158454273),new a(e[42],3505952657),new a(e[43],106217008),new a(e[44],3606008344),new a(e[45],1432725776),new a(e[46],1467031594),new a(e[47],851169720),new a(e[48],3100823752),new a(e[49],1363258195),new a(e[50],3750685593),new a(e[51],3785050280),new a(e[52],3318307427),new a(e[53],3812723403),new a(e[54],2003034995),new a(e[55],3602036899),new a(e[56],1575990012),new a(e[57],
	1125592928),new a(e[58],2716904306),new a(e[59],442776044),new a(e[60],593698344),new a(e[61],3733110249),new a(e[62],2999351573),new a(e[63],3815920427),new a(3391569614,3928383900),new a(3515267271,566280711),new a(3940187606,3454069534),new a(4118630271,4000239992),new a(116418474,1914138554),new a(174292421,2731055270),new a(289380356,3203993006),new a(460393269,320620315),new a(685471733,587496836),new a(852142971,1086792851),new a(1017036298,365543100),new a(1126000580,2618297676),new a(1288033470,
	3409855158),new a(1501505948,4234509866),new a(1607167915,987167468),new a(1816402316,1246189591)];W=[new a(0,1),new a(0,32898),new a(2147483648,32906),new a(2147483648,2147516416),new a(0,32907),new a(0,2147483649),new a(2147483648,2147516545),new a(2147483648,32777),new a(0,138),new a(0,136),new a(0,2147516425),new a(0,2147483658),new a(0,2147516555),new a(2147483648,139),new a(2147483648,32905),new a(2147483648,32771),new a(2147483648,32770),new a(2147483648,128),new a(0,32778),new a(2147483648,
	2147483658),new a(2147483648,2147516545),new a(2147483648,32896),new a(0,2147483649),new a(2147483648,2147516424)];V=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]]; true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return C}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(module.exports=C),exports=C):X.jsSHA=C})(this);


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _NavigationItem = __webpack_require__(33);
	
	var _NavigationItem2 = _interopRequireDefault(_NavigationItem);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var template = function () {
		return {
			components: {
				NavigationItem: _NavigationItem2.default
			}
		};
	}();
	
	function renderMainFragment(root, component) {
		var ifBlock_anchor = createComment("#if separator == 'top'");
	
		function getBlock(root) {
			if (root.separator == 'top') return renderIfBlock_0;
			return null;
		}
	
		var currentBlock = getBlock(root);
		var ifBlock = currentBlock && currentBlock(root, component);
	
		var text = createText("\n");
	
		var ul = createElement('ul');
		ul.className = "coz-nav-group";
	
		var eachBlock_anchor = createComment("#each group");
		appendNode(eachBlock_anchor, ul);
		var eachBlock_value = root.group;
		var eachBlock_iterations = [];
	
		for (var i = 0; i < eachBlock_value.length; i += 1) {
			eachBlock_iterations[i] = renderEachBlock(root, eachBlock_value, eachBlock_value[i], i, component);
			eachBlock_iterations[i].mount(eachBlock_anchor.parentNode, eachBlock_anchor);
		}
	
		var text1 = createText("\n");
		var ifBlock1_anchor = createComment("#if separator == 'bottom'");
	
		function getBlock1(root) {
			if (root.separator == 'bottom') return renderIfBlock1_0;
			return null;
		}
	
		var currentBlock1 = getBlock1(root);
		var ifBlock1 = currentBlock1 && currentBlock1(root, component);
	
		return {
			mount: function mount(target, anchor) {
				insertNode(ifBlock_anchor, target, anchor);
				if (ifBlock) ifBlock.mount(ifBlock_anchor.parentNode, ifBlock_anchor);
				insertNode(text, target, anchor);
				insertNode(ul, target, anchor);
				insertNode(text1, target, anchor);
				insertNode(ifBlock1_anchor, target, anchor);
				if (ifBlock1) ifBlock1.mount(ifBlock1_anchor.parentNode, ifBlock1_anchor);
			},
	
			update: function update(changed, root) {
				var _currentBlock = currentBlock;
				currentBlock = getBlock(root);
				if (_currentBlock === currentBlock && ifBlock) {
					ifBlock.update(changed, root);
				} else {
					if (ifBlock) ifBlock.teardown(true);
					ifBlock = currentBlock && currentBlock(root, component);
					if (ifBlock) ifBlock.mount(ifBlock_anchor.parentNode, ifBlock_anchor);
				}
	
				var eachBlock_value = root.group;
	
				for (var i = 0; i < eachBlock_value.length; i += 1) {
					if (!eachBlock_iterations[i]) {
						eachBlock_iterations[i] = renderEachBlock(root, eachBlock_value, eachBlock_value[i], i, component);
						eachBlock_iterations[i].mount(eachBlock_anchor.parentNode, eachBlock_anchor);
					} else {
						eachBlock_iterations[i].update(changed, root, eachBlock_value, eachBlock_value[i], i);
					}
				}

				teardownEach(eachBlock_iterations, true, eachBlock_value.length);

				eachBlock_iterations.length = eachBlock_value.length;

				var _currentBlock1 = currentBlock1;
				currentBlock1 = getBlock1(root);
				if (_currentBlock1 === currentBlock1 && ifBlock1) {
					ifBlock1.update(changed, root);
				} else {
					if (ifBlock1) ifBlock1.teardown(true);
					ifBlock1 = currentBlock1 && currentBlock1(root, component);
					if (ifBlock1) ifBlock1.mount(ifBlock1_anchor.parentNode, ifBlock1_anchor);
				}
			},

			teardown: function teardown(detach) {
				if (ifBlock) ifBlock.teardown(detach);

				teardownEach(eachBlock_iterations, false);

				if (ifBlock1) ifBlock1.teardown(detach);

				if (detach) {
					detachNode(ifBlock_anchor);
					detachNode(text);
					detachNode(ul);
					detachNode(text1);
					detachNode(ifBlock1_anchor);
				}
			}
		};
	}

	function renderIfBlock1_0(root, component) {
		var hr = createElement('hr');

		return {
			mount: function mount(target, anchor) {
				insertNode(hr, target, anchor);
			},

			update: noop,

			teardown: function teardown(detach) {
				if (detach) {
					detachNode(hr);
				}
			}
		};
	}

	function renderEachBlock(root, eachBlock_value, item, item__index, component) {
		var navigationItem_initialData = {
			item: item
		};
		var navigationItem = new template.components.NavigationItem({
			target: null,
			_root: component._root || component,
			data: navigationItem_initialData
		});

		return {
			mount: function mount(target, anchor) {
				navigationItem._fragment.mount(target, anchor);
			},

			update: function update(changed, root, eachBlock_value, item, item__index) {
				var navigationItem_changes = {};

				if ('group' in changed) navigationItem_changes.item = item;

				if (Object.keys(navigationItem_changes).length) navigationItem.set(navigationItem_changes);
			},

			teardown: function teardown(detach) {
				navigationItem.teardown(detach);
			}
		};
	}

	function renderIfBlock_0(root, component) {
		var hr = createElement('hr');

		return {
			mount: function mount(target, anchor) {
				insertNode(hr, target, anchor);
			},

			update: noop,

			teardown: function teardown(detach) {
				if (detach) {
					detachNode(hr);
				}
			}
		};
	}

	function SvelteComponent(options) {
		options = options || {};

		this._state = options.data || {};

		this._observers = {
			pre: Object.create(null),
			post: Object.create(null)
		};

		this._handlers = Object.create(null);

		this._root = options._root;
		this._yield = options._yield;

		this._renderHooks = [];

		this._fragment = renderMainFragment(this._state, this);
		if (options.target) this._fragment.mount(options.target, null);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}
	}

	SvelteComponent.prototype.get = function get(key) {
		return key ? this._state[key] : this._state;
	};

	SvelteComponent.prototype.fire = function fire(eventName, data) {
		var handlers = eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			handlers[i].call(this, data);
		}
	};

	SvelteComponent.prototype.observe = function observe(key, callback, options) {
		var group = options && options.defer ? this._observers.pre : this._observers.post;

		(group[key] || (group[key] = [])).push(callback);

		if (!options || options.init !== false) {
			callback.__calling = true;
			callback.call(this, this._state[key]);
			callback.__calling = false;
		}

		return {
			cancel: function cancel() {
				var index = group[key].indexOf(callback);
				if (~index) group[key].splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.on = function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function cancel() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.set = function set(newState) {
		var oldState = this._state;
		this._state = Object.assign({}, oldState, newState);

		dispatchObservers(this, this._observers.pre, newState, oldState);
		if (this._fragment) this._fragment.update(newState, this._state);
		dispatchObservers(this, this._observers.post, newState, oldState);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}
	};

	SvelteComponent.prototype.teardown = function teardown(detach) {
		this.fire('teardown');

		this._fragment.teardown(detach !== false);
		this._fragment = null;

		this._state = {};
	};

	function dispatchObservers(component, group, newState, oldState) {
		for (var key in group) {
			if (!(key in newState)) continue;

			var newValue = newState[key];
			var oldValue = oldState[key];

			if (newValue === oldValue && (typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') continue;

			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function noop() {}

	function createComment(data) {
		return document.createComment(data);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function appendNode(node, target) {
		target.appendChild(node);
	}

	function teardownEach(iterations, detach, start) {
		for (var i = start || 0; i < iterations.length; i += 1) {
			iterations[i].teardown(detach);
		}
	}

	exports.default = SvelteComponent;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _i18n = __webpack_require__(1);
	
	function applyComputations(state, newState, oldState) {
		if ('item' in newState && _typeof(state.item) === 'object' || state.item !== oldState.item) {
			state.icon = newState.icon = template.computed.icon(state.item);
		}
	}
	
	var template = function () {
		return {
			computed: {
				icon: function icon(item) {
					return 'icon-' + item.label;
				}
			},
	
			helpers: { t: _i18n.t }
		};
	}();
	
	function renderMainFragment(root, component) {
		var li = createElement('li');
		li.className = "coz-nav-item";
	
		var ifBlock_anchor = createComment("#if item.external");
		appendNode(ifBlock_anchor, li);
	
		function getBlock(root) {
			if (root.item.external) return renderIfBlock_0;
			return renderIfBlock_1;
		}
	
		var currentBlock = getBlock(root);
		var ifBlock = currentBlock && currentBlock(root, component);
	
		if (ifBlock) ifBlock.mount(ifBlock_anchor.parentNode, ifBlock_anchor);
	
		return {
			mount: function mount(target, anchor) {
				insertNode(li, target, anchor);
			},
	
			update: function update(changed, root) {
				var _currentBlock = currentBlock;
				currentBlock = getBlock(root);
				if (_currentBlock === currentBlock && ifBlock) {
					ifBlock.update(changed, root);
				} else {
					if (ifBlock) ifBlock.teardown(true);
					ifBlock = currentBlock && currentBlock(root, component);
					if (ifBlock) ifBlock.mount(ifBlock_anchor.parentNode, ifBlock_anchor);
				}
			},
	
			teardown: function teardown(detach) {
				if (ifBlock) ifBlock.teardown(false);
	
				if (detach) {
					detachNode(li);
				}
			}
		};
	}
	
	function renderIfBlock_1(root, component) {
		var a = createElement('a');
		a.href = root.item.href;
		setAttribute(a, 'data-icon', root.icon);
	
		var text = createText(template.helpers.t(root.item.label));
		appendNode(text, a);
	
		return {
			mount: function mount(target, anchor) {
				insertNode(a, target, anchor);
			},
	
			update: function update(changed, root) {
				a.href = root.item.href;
				setAttribute(a, 'data-icon', root.icon);
	
				text.data = template.helpers.t(root.item.label);
			},
	
			teardown: function teardown(detach) {
				if (detach) {
					detachNode(a);
				}
			}
		};
	}
	
	function renderIfBlock_0(root, component) {
		var a = createElement('a');
		a.href = root.item.href;
		a.target = "_blank";
		setAttribute(a, 'data-icon', root.icon);
	
		var text = createText(template.helpers.t(root.item.label));
		appendNode(text, a);
	
		return {
			mount: function mount(target, anchor) {
				insertNode(a, target, anchor);
			},
	
			update: function update(changed, root) {
				a.href = root.item.href;
				setAttribute(a, 'data-icon', root.icon);
	
				text.data = template.helpers.t(root.item.label);
			},

			teardown: function teardown(detach) {
				if (detach) {
					detachNode(a);
				}
			}
		};
	}

	function SvelteComponent(options) {
		options = options || {};

		this._state = options.data || {};
		applyComputations(this._state, this._state, {});

		this._observers = {
			pre: Object.create(null),
			post: Object.create(null)
		};

		this._handlers = Object.create(null);

		this._root = options._root;
		this._yield = options._yield;

		this._fragment = renderMainFragment(this._state, this);
		if (options.target) this._fragment.mount(options.target, null);
	}

	SvelteComponent.prototype.get = function get(key) {
		return key ? this._state[key] : this._state;
	};

	SvelteComponent.prototype.fire = function fire(eventName, data) {
		var handlers = eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			handlers[i].call(this, data);
		}
	};

	SvelteComponent.prototype.observe = function observe(key, callback, options) {
		var group = options && options.defer ? this._observers.pre : this._observers.post;

		(group[key] || (group[key] = [])).push(callback);

		if (!options || options.init !== false) {
			callback.__calling = true;
			callback.call(this, this._state[key]);
			callback.__calling = false;
		}

		return {
			cancel: function cancel() {
				var index = group[key].indexOf(callback);
				if (~index) group[key].splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.on = function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function cancel() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.set = function set(newState) {
		var oldState = this._state;
		this._state = Object.assign({}, oldState, newState);
		applyComputations(this._state, newState, oldState);

		dispatchObservers(this, this._observers.pre, newState, oldState);
		if (this._fragment) this._fragment.update(newState, this._state);
		dispatchObservers(this, this._observers.post, newState, oldState);
	};

	SvelteComponent.prototype.teardown = function teardown(detach) {
		this.fire('teardown');

		this._fragment.teardown(detach !== false);
		this._fragment = null;

		this._state = {};
	};

	function dispatchObservers(component, group, newState, oldState) {
		for (var key in group) {
			if (!(key in newState)) continue;

			var newValue = newState[key];
			var oldValue = oldState[key];

			if (newValue === oldValue && (typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') continue;

			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function setAttribute(node, attribute, value) {
		node.setAttribute(attribute, value);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function appendNode(node, target) {
		target.appendChild(node);
	}

	function createComment(data) {
		return document.createComment(data);
	}

	exports.default = SvelteComponent;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _NavigationGroup = __webpack_require__(32);
	
	var _NavigationGroup2 = _interopRequireDefault(_NavigationGroup);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var template = function () {
		var toggleDrawerObserver = void 0;
	
		return {
			data: function data() {
				return {
					folded: true
				};
			},
			onrender: function onrender() {
				var _this = this;
	
				toggleDrawerObserver = this.observe('folded', function (folded) {
					if (folded) {
						_this.refs.wrapper.classList.toggle('visible', false);
						setTimeout(function () {
							_this.refs.wrapper.setAttribute('aria-hidden', true);
						}, 530);
					} else {
						_this.refs.wrapper.setAttribute('aria-hidden', 'false');
						setTimeout(function () {
							_this.refs.wrapper.classList.toggle('visible', true);
						}, 30);
					}
				});
			},
			onteardown: function onteardown() {
				toggleDrawerObserver.cancel();
			},
	
	
			components: {
				NavigationGroup: _NavigationGroup2.default
			}
		};
	}();
	
	function renderMainFragment(root, component) {
		var div = createElement('div');
		component.refs.wrapper = div;
		div.className = "coz-drawer-wrapper";
	
		function clickHandler(event) {
			component.set({ folded: true });
		}
	
		addEventListener(div, 'click', clickHandler);
	
		var aside = createElement('aside');
	
		function clickHandler1(event) {
			event.stopPropagation();
		}
	
		addEventListener(aside, 'click', clickHandler1);
	
		appendNode(aside, div);
	
		var hr = createElement('hr');
		hr.className = "coz-sep-flex";
	
		appendNode(hr, aside);
		appendNode(createText("\n    "), aside);
	
		var nav = createElement('nav');
	
		appendNode(nav, aside);
		var eachBlock_anchor = createComment("#each groups");
		appendNode(eachBlock_anchor, nav);
		var eachBlock_value = root.groups;
		var eachBlock_iterations = [];
	
		for (var i = 0; i < eachBlock_value.length; i += 1) {
			eachBlock_iterations[i] = renderEachBlock(root, eachBlock_value, eachBlock_value[i], i, component);
			eachBlock_iterations[i].mount(eachBlock_anchor.parentNode, eachBlock_anchor);
		}
	
		return {
			mount: function mount(target, anchor) {
				insertNode(div, target, anchor);
			},
	
			update: function update(changed, root) {
				var eachBlock_value = root.groups;
	
				for (var i = 0; i < eachBlock_value.length; i += 1) {
					if (!eachBlock_iterations[i]) {
						eachBlock_iterations[i] = renderEachBlock(root, eachBlock_value, eachBlock_value[i], i, component);
						eachBlock_iterations[i].mount(eachBlock_anchor.parentNode, eachBlock_anchor);
					} else {
						eachBlock_iterations[i].update(changed, root, eachBlock_value, eachBlock_value[i], i);
					}
				}

				teardownEach(eachBlock_iterations, true, eachBlock_value.length);

				eachBlock_iterations.length = eachBlock_value.length;
			},

			teardown: function teardown(detach) {
				if (component.refs.wrapper === div) component.refs.wrapper = null;
				removeEventListener(div, 'click', clickHandler);
				removeEventListener(aside, 'click', clickHandler1);

				teardownEach(eachBlock_iterations, false);

				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	function renderEachBlock(root, eachBlock_value, group, group__index, component) {
		var navigationGroup_initialData = {
			separator: "top",
			group: group
		};
		var navigationGroup = new template.components.NavigationGroup({
			target: null,
			_root: component._root || component,
			data: navigationGroup_initialData
		});

		return {
			mount: function mount(target, anchor) {
				navigationGroup._fragment.mount(target, anchor);
			},

			update: function update(changed, root, eachBlock_value, group, group__index) {
				var navigationGroup_changes = {};

				if ('groups' in changed) navigationGroup_changes.group = group;

				if (Object.keys(navigationGroup_changes).length) navigationGroup.set(navigationGroup_changes);
			},

			teardown: function teardown(detach) {
				navigationGroup.teardown(detach);
			}
		};
	}

	function SvelteComponent(options) {
		options = options || {};

		this.refs = {};
		this._state = Object.assign(template.data(), options.data);

		this._observers = {
			pre: Object.create(null),
			post: Object.create(null)
		};

		this._handlers = Object.create(null);

		this._root = options._root;
		this._yield = options._yield;

		this._renderHooks = [];

		this._fragment = renderMainFragment(this._state, this);
		if (options.target) this._fragment.mount(options.target, null);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}

		if (options._root) {
			options._root._renderHooks.push({ fn: template.onrender, context: this });
		} else {
			template.onrender.call(this);
		}
	}

	SvelteComponent.prototype.get = function get(key) {
		return key ? this._state[key] : this._state;
	};

	SvelteComponent.prototype.fire = function fire(eventName, data) {
		var handlers = eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			handlers[i].call(this, data);
		}
	};

	SvelteComponent.prototype.observe = function observe(key, callback, options) {
		var group = options && options.defer ? this._observers.pre : this._observers.post;

		(group[key] || (group[key] = [])).push(callback);

		if (!options || options.init !== false) {
			callback.__calling = true;
			callback.call(this, this._state[key]);
			callback.__calling = false;
		}

		return {
			cancel: function cancel() {
				var index = group[key].indexOf(callback);
				if (~index) group[key].splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.on = function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function cancel() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	};

	SvelteComponent.prototype.set = function set(newState) {
		var oldState = this._state;
		this._state = Object.assign({}, oldState, newState);

		dispatchObservers(this, this._observers.pre, newState, oldState);
		if (this._fragment) this._fragment.update(newState, this._state);
		dispatchObservers(this, this._observers.post, newState, oldState);

		while (this._renderHooks.length) {
			var hook = this._renderHooks.pop();
			hook.fn.call(hook.context);
		}
	};

	SvelteComponent.prototype.teardown = function teardown(detach) {
		this.fire('teardown');
		template.onteardown.call(this);

		this._fragment.teardown(detach !== false);
		this._fragment = null;

		this._state = {};
	};

	function dispatchObservers(component, group, newState, oldState) {
		for (var key in group) {
			if (!(key in newState)) continue;

			var newValue = newState[key];
			var oldValue = oldState[key];

			if (newValue === oldValue && (typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) !== 'object') continue;

			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}

	function addEventListener(node, event, handler) {
		node.addEventListener(event, handler, false);
	}

	function removeEventListener(node, event, handler) {
		node.removeEventListener(event, handler, false);
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function appendNode(node, target) {
		target.appendChild(node);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment(data) {
		return document.createComment(data);
	}

	function teardownEach(iterations, detach, start) {
		for (var i = start || 0; i < iterations.length; i += 1) {
			iterations[i].teardown(detach);
		}
	}

	exports.default = SvelteComponent;

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = {
		"settings": [
			[
				{
					"label": "help",
					"external": true,
					"href": "https://docs.cozy.io/"
				},
				{
					"label": "email",
					"href": "mailto:contact@cozycloud.cc"
				}
			],
			[
				{
					"label": "logout",
					"href": "/logout"
				}
			]
		]
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(37);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(44)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?importLoaders=1!./../../node_modules/postcss-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?importLoaders=1!./../../node_modules/postcss-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(38)();
	// imports
	
	
	// module
	exports.push([module.id, "body{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:stretch;align-items:stretch;width:100vw;height:100vh}[role=application]{height:inherit;-ms-flex:1 100vh;flex:1 100vh}[role=banner]{position:relative;z-index:99;-ms-flex-negative:0;flex-shrink:0;display:-ms-flexbox;display:flex;-ms-flex-align:stretch;align-items:stretch;padding:0 2.5em 0 1em;box-shadow:inset 0 -1px 0 0 #d6d8da;font-family:Lato,sans-serif;font-size:1rem}[role=banner] .coz-sep-flex{margin:0;border:none;-ms-flex:1 0;flex:1 0}[role=banner] [data-icon]{background-repeat:no-repeat;background-position:0 50%;padding-left:calc(16px + .5em)}[role=banner] [data-icon=icon-help]{background-image:url(" + __webpack_require__(39) + ")}[role=banner] [data-icon=icon-logout]{background-image:url(" + __webpack_require__(40) + ")}[role=banner] [data-icon=icon-email]{background-image:url(" + __webpack_require__(41) + ")}[role=banner] [data-icon=icon-cog]{background-image:url(" + __webpack_require__(42) + ")}[role=banner] [data-icon=icon-hamburger]{background-image:url(" + __webpack_require__(43) + ")}[role=banner] .coz-bar-title{display:-ms-flexbox;display:flex;margin:0;-ms-flex-align:center;align-items:center;font-size:1.5em;font-weight:400;text-transform:lowercase;color:#32363f}[role=banner] .coz-bar-title img{margin-right:.45em}[role=banner] .coz-bar-title strong{padding-left:.25em;font-weight:700}[role=banner] .coz-bar-burger{width:2.5em;height:2.5em;margin:auto .25em auto 0;padding:0;border:none;background-color:transparent;background-position:center;text-indent:-9999em}[role=banner] .coz-drawer-wrapper{position:absolute;top:0;left:0;width:100vw;height:100vh}[role=banner] .coz-drawer-wrapper[aria-hidden=true]{display:none}[role=banner] .coz-drawer-wrapper:before{content:'';display:block;position:absolute;top:0;left:0;width:100%;height:100%;background-color:#32363f;opacity:0;transition:opacity .25s ease-out}[role=banner] .coz-drawer-wrapper.visible:before{opacity:.5}[role=banner] .coz-drawer-wrapper aside{transform:translateX(-100vw);transition:transform .5s ease-out}[role=banner] .coz-drawer-wrapper.visible aside{transform:translateX(0)}[role=banner] .coz-drawer-wrapper aside{position:absolute;top:0;left:0;width:90%;height:100%;background-color:#fff}[role=banner] .coz-drawer-wrapper aside{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}[role=banner] .coz-drawer-wrapper ul{margin:0;padding:0;list-style-type:none}[role=banner] .coz-drawer-wrapper ul{margin:0;padding:.8em 0;list-style-type:none}[role=banner] .coz-drawer-wrapper hr{margin:0;border:none;border-bottom:solid 1px #d6d8da}[role=banner] .coz-drawer-wrapper .coz-nav-icon{margin-right:.5em}[role=banner] .coz-nav ul{margin:0;padding:0;list-style-type:none}[role=banner] .coz-nav-item a{display:-ms-flexbox;display:flex;padding:.5em 1.5em .5em calc(1.5em + 16px + .5em);background-position:1.5em 50%;-ms-flex-align:center;align-items:center;white-space:nowrap;color:#32363f;text-decoration:none}[role=banner] .coz-nav-section{position:relative}[role=banner] .coz-nav-section [aria-controls]{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding-top:1.285em;padding-bottom:1.285em;font-size:.875em;font-weight:700;text-transform:uppercase;color:#5d6165;cursor:pointer}[role=banner] .coz-nav-icon{margin-right:.5em}[role=banner] .coz-nav-pop[aria-hidden=true]{display:none}[role=banner] .coz-nav-pop{position:absolute;top:calc(100% - .5em);right:-1.5em;box-sizing:border-box;min-width:100%;background-color:#fff;border-radius:8px;border:solid 1px rgba(50,54,63,.12);box-shadow:0 1px 3px 0 rgba(50,54,63,.19),0 6px 18px 0 rgba(50,54,63,.19)}[role=banner] .coz-nav-pop ul{padding:.5em 0}[role=banner] .coz-nav-pop hr{border:none;border-bottom:solid 1px #d6d8da}[role=banner] .coz-nav-pop ul:last-of-type+hr{display:none}@media(max-width:30em){[role=banner]{padding:0 1em 0 0}[role=banner] .coz-bar-title{font-size:1.25em}[role=banner] .coz-bar-hide-sm{display:none}[role=banner] .coz-bar-title strong{margin:0;text-transform:capitalize}[role=banner] .coz-nav{display:none}}@media(min-width:30.0625em){[role=banner] .coz-bar-burger{display:none}[role=banner] .coz-drawer-wrapper{display:none}}", ""]);
	
	// exports


/***/ },
/* 38 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBmaWxsPSIjOTU5OTlEIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yOTYsODAgQzMwMC40MTgyNzgsODAgMzA0LDc2LjQxODI3OCAzMDQsNzIgQzMwNCw2Ny41ODE3MjIgMzAwLjQxODI3OCw2NCAyOTYsNjQgQzI5MS41ODE3MjIsNjQgMjg4LDY3LjU4MTcyMiAyODgsNzIgQzI4OCw3Ni40MTgyNzggMjkxLjU4MTcyMiw4MCAyOTYsODAgWiBNMjk3LDcyLjgwMjExMyBDMjk4LjEyMTgwOSw3Mi4zNTQ1NTY4IDI5OSw3MS4yMDg5OTQ2IDI5OSw3MCBDMjk5LDY4LjQ0NzcxNTMgMjk3LjU1MjI4NSw2NyAyOTYsNjcgQzI5NC40NDc3MTUsNjcgMjkzLDY4LjQ0NzcxNTMgMjkzLDcwIEwyOTUsNzAgQzI5NSw2OS41NTIyODQ3IDI5NS41NTIyODUsNjkgMjk2LDY5IEMyOTYuNDQ3NzE1LDY5IDI5Nyw2OS41NTIyODQ3IDI5Nyw3MCBDMjk3LDcwLjQ0NzcxNTMgMjk2LjQ0NzcxNSw3MSAyOTYsNzEgQzI5NS40NDc3MTUsNzEgMjk1LDcxLjQ0NzcxNTMgMjk1LDcyIEwyOTUsNzQgTDI5Nyw3NCBMMjk3LDcyLjgwMjExMyBaIE0yOTUsNzUgTDI5Nyw3NSBMMjk3LDc3IEwyOTUsNzcgTDI5NSw3NSBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjg4IC02NCkiLz4KPC9zdmc+Cg=="

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBmaWxsPSIjOTU5OTlEIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zMjcsOTkuNDE0MjEzNiBMMzI1LjcwNzEwNywxMDAuNzA3MTA3IEMzMjUuMzE2NTgyLDEwMS4wOTc2MzEgMzI0LjY4MzQxOCwxMDEuMDk3NjMxIDMyNC4yOTI4OTMsMTAwLjcwNzEwNyBDMzIzLjkwMjM2OSwxMDAuMzE2NTgyIDMyMy45MDIzNjksOTkuNjgzNDE3NSAzMjQuMjkyODkzLDk5LjI5Mjg5MzIgTDMyNy4yOTI4OTMsOTYuMjkyODkzMiBDMzI3LjY4MzQxOCw5NS45MDIzNjg5IDMyOC4zMTY1ODIsOTUuOTAyMzY4OSAzMjguNzA3MTA3LDk2LjI5Mjg5MzIgTDMzMS43MDcxMDcsOTkuMjkyODkzMiBDMzMyLjA5NzYzMSw5OS42ODM0MTc1IDMzMi4wOTc2MzEsMTAwLjMxNjU4MiAzMzEuNzA3MTA3LDEwMC43MDcxMDcgQzMzMS4zMTY1ODIsMTAxLjA5NzYzMSAzMzAuNjgzNDE4LDEwMS4wOTc2MzEgMzMwLjI5Mjg5MywxMDAuNzA3MTA3IEwzMjksOTkuNDE0MjEzNiBMMzI5LDEwNyBDMzI5LDEwNy41NTIyODUgMzI4LjU1MjI4NSwxMDggMzI4LDEwOCBDMzI3LjQ0NzcxNSwxMDggMzI3LDEwNy41NTIyODUgMzI3LDEwNyBMMzI3LDk5LjQxNDIxMzYgWiBNMzIxLDExMiBMMzM1LDExMiBDMzM1LjU1MjI4NSwxMTIgMzM2LDExMS41NTIyODUgMzM2LDExMSBDMzM2LDExMC40NDc3MTUgMzM1LjU1MjI4NSwxMTAgMzM1LDExMCBMMzIxLDExMCBDMzIwLjQ0NzcxNSwxMTAgMzIwLDExMC40NDc3MTUgMzIwLDExMSBDMzIwLDExMS41NTIyODUgMzIwLjQ0NzcxNSwxMTIgMzIxLDExMiBaIiB0cmFuc2Zvcm09InJvdGF0ZSg5MCAyMTYgLTEwNCkiLz4KPC9zdmc+Cg=="

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cG9seWdvbiBmaWxsPSIjOTU5OTlEIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHBvaW50cz0iMjcyIDY0IDI2NiA3OSAyNjMuNSA3Ni41IDI2MCA3OSAyNTkgNzUgMjY5IDY2LjUgMjU5IDcyLjUgMjU2IDcwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjU2IC02NCkiLz4KPC9zdmc+Cg=="

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8ZyBmaWxsPSIjOTU5OTlEIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMjQgLTMyKSI+CiAgICA8cGF0aCBkPSJNMjM4LjI0OTM1NiwzOS4wNzgyOTczIEMyMzguMzAxNDA3LDM5LjMzNzE0MzYgMjM4LjMyNzQzMiwzOS42NDU5NjAyIDIzOC4zMjc0MzIsNDAuMDAzNzQ3OCBDMjM4LjMyNzQzMiw0MC4zNjE1MzUzIDIzOC4zMDE0MDcsNDAuNjY5MzUyNiAyMzguMjQ5MzU2LDQwLjkyOTE5ODMgTDIzOS44Njk5NDYsNDIuMjYyNDA2NyBDMjQwLjAwMDA3NCw0Mi4zNDgzNTU3IDI0MC4wMzIxMDUsNDIuNDY1Mjg2MiAyMzkuOTY4MDQyLDQyLjYxNDE5NzggQzIzOS42NDI3MjMsNDMuNTY0NjMzNSAyMzkuMTA5MTk5LDQ0LjQ0MDExMzcgMjM4LjM2NjQ3LDQ1LjI0MTYzNzggQzIzOC4yNjIzNjgsNDUuMzY1NTY0MiAyMzguMTM3MjQ2LDQ1LjM5NjU0NTggMjM3Ljk5NTEwNiw0NS4zMzU1ODIgTDIzNS45NjQxMTMsNDQuNjY3OTc4NCBDMjM1LjQ0MzYwMiw0NS4wNjM3NDM0IDIzNC44ODQwNTMsNDUuMzcyNTYgMjM0LjI4NDQ2NCw0NS41OTQ0MjgzIEwyMzMuODc1MDYyLDQ3LjU5MzI0MTUgQzIzMy44NDkwMzcsNDcuNzQwMTU0MyAyMzMuNzU3OTQ4LDQ3LjgyNzEwMjcgMjMzLjYwMTc5NCw0Ny44NTIwODc4IEMyMzMuMDQxMjQ0LDQ3Ljk1MjAyODUgMjMyLjUwNzcyMSw0OCAyMzIuMDAwMjIyLDQ4IEMyMzEuNDkyNzI0LDQ4IDIzMC45NTgyLDQ3Ljk1MTAyOTEgMjMwLjM5ODY1MSw0Ny44NTIwODc4IEMyMzAuMjQyNDk3LDQ3LjgyODEwMjEgMjMwLjE1MTQwOCw0Ny43NDExNTM3IDIzMC4xMjUzODIsNDcuNTkzMjQxNSBMMjI5LjcxNTk4MSw0NS41OTQ0MjgzIEMyMjkuMDc3MzU0LDQ1LjM2MDU2NzIgMjI4LjUxNzgwNSw0NS4wNTA3NTExIDIyOC4wMzYzMzIsNDQuNjY3OTc4NCBMMjI2LjAwNTMzOSw0NS4zMzU1ODIgQzIyNS44NjExOTcsNDUuMzk3NTQ1MiAyMjUuNzM4MDc3LDQ1LjM2NTU2NDIgMjI1LjYzMzk3NCw0NS4yNDE2Mzc4IEMyMjQuODkyMjQ2LDQ0LjQ0MDExMzcgMjI0LjM1ODcyMyw0My41NjQ2MzM1IDIyNC4wMzI0MDMsNDIuNjE0MTk3OCBDMjIzLjk2NzMzOSw0Mi40NjYyODU2IDIyNC4wMDAzNzEsNDIuMzQ4MzU1NyAyMjQuMTMwNDk5LDQyLjI2MjQwNjcgTDIyNS43NTEwODksNDAuOTI5MTk4MyBDMjI1LjY5OTAzOCw0MC42NjkzNTI2IDIyNS42NzMwMTMsNDAuMzYyNTM0NyAyMjUuNjczMDEzLDQwLjAwMzc0NzggQzIyNS42NzMwMTMsMzkuNjQ1OTYwMiAyMjUuNjk5MDM4LDM5LjMzNzE0MzYgMjI1Ljc1MTA4OSwzOS4wNzgyOTczIEwyMjQuMTMwNDk5LDM3Ljc0NjA4ODMgQzIyNC4wMDAzNzEsMzcuNjYwMTM5MyAyMjMuOTY3MzM5LDM3LjU0MjIwOTMgMjI0LjAzMjQwMywzNy4zOTQyOTcxIEMyMjQuMzU3NzIyLDM2LjQ0NDg2MDkgMjI0Ljg5MTI0NSwzNS41NjgzODEzIDIyNS42MzM5NzQsMzQuNzY2ODU3MiBDMjI1LjczODA3NywzNC42NDM5MzAyIDIyNS44NjIxOTgsMzQuNjEyOTQ4NiAyMjYuMDA1MzM5LDM0LjY3MzkxMjQgTDIyOC4wMzYzMzIsMzUuMzQwNTE2NiBDMjI4LjUxNjgwNCwzNC45NTc3NDM4IDIyOS4wNzczNTQsMzQuNjQ5OTI2NiAyMjkuNzE1OTgxLDM0LjQxNTA2NjEgTDIzMC4xMjUzODIsMzIuNDE2MjUyOCBDMjMwLjE1MTQwOCwzMi4yNjgzNDA3IDIzMC4yNDI0OTcsMzIuMTgyMzkxNyAyMzAuMzk4NjUxLDMyLjE1NzQwNjUgQzIzMS40NjU2OTgsMzEuOTQ3NTMxMiAyMzIuNTMzNzQ2LDMxLjk0NzUzMTIgMjMzLjYwMDc5MywzMi4xNTc0MDY1IEMyMzMuNzU2OTQ3LDMyLjE4MTM5MjMgMjMzLjg0ODAzNiwzMi4yNjgzNDA3IDIzMy44NzQwNjEsMzIuNDE2MjUyOCBMMjM0LjI4MzQ2MywzNC40MTUwNjYxIEMyMzQuODgzMDUyLDM0LjYzNzkzMzcgMjM1LjQ0MjYwMSwzNC45NDU3NTEgMjM1Ljk2MzExMiwzNS4zNDA1MTY2IEwyMzcuOTk0MTA1LDM0LjY3MzkxMjQgQzIzOC4xMzcyNDYsMzQuNjExOTQ5MiAyMzguMjYxMzY3LDM0LjY0MzkzMDIgMjM4LjM2NTQ3LDM0Ljc2Njg1NzIgQzIzOS4xMDcxOTcsMzUuNTY5MzgwNyAyMzkuNjQwNzIxLDM2LjQ0NDg2MDkgMjM5Ljk2NzA0MSwzNy4zOTQyOTcxIEMyNDAuMDMxMTA0LDM3LjU0MjIwOTMgMjM5Ljk5OTA3MywzNy42NjAxMzkzIDIzOS44Njg5NDUsMzcuNzQ2MDg4MyBMMjM4LjI0OTM1NiwzOS4wNzgyOTczIEwyMzguMjQ5MzU2LDM5LjA3ODI5NzMgWiBNMjMyLDM2LjUgQzIzMC4wNjcxMjUsMzYuNSAyMjguNSwzOC4wNjcxMjUgMjI4LjUsNDAgQzIyOC41LDQxLjkzMjg3NSAyMzAuMDY3MTI1LDQzLjUgMjMyLDQzLjUgQzIzMy45MzI4NzUsNDMuNSAyMzUuNSw0MS45MzI4NzUgMjM1LjUsNDAgQzIzNS41LDM4LjA2NzEyNSAyMzMuOTMyODc1LDM2LjUgMjMyLDM2LjUgTDIzMiwzNi41IFoiLz4KICAgIDxwYXRoIGQ9Ik0yMzguMjQ5MzU2LDM5LjA3ODI5NzMgQzIzOC4zMDE0MDcsMzkuMzM3MTQzNiAyMzguMzI3NDMyLDM5LjY0NTk2MDIgMjM4LjMyNzQzMiw0MC4wMDM3NDc4IEMyMzguMzI3NDMyLDQwLjM2MTUzNTMgMjM4LjMwMTQwNyw0MC42NjkzNTI2IDIzOC4yNDkzNTYsNDAuOTI5MTk4MyBMMjM5Ljg2OTk0Niw0Mi4yNjI0MDY3IEMyNDAuMDAwMDc0LDQyLjM0ODM1NTcgMjQwLjAzMjEwNSw0Mi40NjUyODYyIDIzOS45NjgwNDIsNDIuNjE0MTk3OCBDMjM5LjY0MjcyMyw0My41NjQ2MzM1IDIzOS4xMDkxOTksNDQuNDQwMTEzNyAyMzguMzY2NDcsNDUuMjQxNjM3OCBDMjM4LjI2MjM2OCw0NS4zNjU1NjQyIDIzOC4xMzcyNDYsNDUuMzk2NTQ1OCAyMzcuOTk1MTA2LDQ1LjMzNTU4MiBMMjM1Ljk2NDExMyw0NC42Njc5Nzg0IEMyMzUuNDQzNjAyLDQ1LjA2Mzc0MzQgMjM0Ljg4NDA1Myw0NS4zNzI1NiAyMzQuMjg0NDY0LDQ1LjU5NDQyODMgTDIzMy44NzUwNjIsNDcuNTkzMjQxNSBDMjMzLjg0OTAzNyw0Ny43NDAxNTQzIDIzMy43NTc5NDgsNDcuODI3MTAyNyAyMzMuNjAxNzk0LDQ3Ljg1MjA4NzggQzIzMy4wNDEyNDQsNDcuOTUyMDI4NSAyMzIuNTA3NzIxLDQ4IDIzMi4wMDAyMjIsNDggQzIzMS40OTI3MjQsNDggMjMwLjk1ODIsNDcuOTUxMDI5MSAyMzAuMzk4NjUxLDQ3Ljg1MjA4NzggQzIzMC4yNDI0OTcsNDcuODI4MTAyMSAyMzAuMTUxNDA4LDQ3Ljc0MTE1MzcgMjMwLjEyNTM4Miw0Ny41OTMyNDE1IEwyMjkuNzE1OTgxLDQ1LjU5NDQyODMgQzIyOS4wNzczNTQsNDUuMzYwNTY3MiAyMjguNTE3ODA1LDQ1LjA1MDc1MTEgMjI4LjAzNjMzMiw0NC42Njc5Nzg0IEwyMjYuMDA1MzM5LDQ1LjMzNTU4MiBDMjI1Ljg2MTE5Nyw0NS4zOTc1NDUyIDIyNS43MzgwNzcsNDUuMzY1NTY0MiAyMjUuNjMzOTc0LDQ1LjI0MTYzNzggQzIyNC44OTIyNDYsNDQuNDQwMTEzNyAyMjQuMzU4NzIzLDQzLjU2NDYzMzUgMjI0LjAzMjQwMyw0Mi42MTQxOTc4IEMyMjMuOTY3MzM5LDQyLjQ2NjI4NTYgMjI0LjAwMDM3MSw0Mi4zNDgzNTU3IDIyNC4xMzA0OTksNDIuMjYyNDA2NyBMMjI1Ljc1MTA4OSw0MC45MjkxOTgzIEMyMjUuNjk5MDM4LDQwLjY2OTM1MjYgMjI1LjY3MzAxMyw0MC4zNjI1MzQ3IDIyNS42NzMwMTMsNDAuMDAzNzQ3OCBDMjI1LjY3MzAxMywzOS42NDU5NjAyIDIyNS42OTkwMzgsMzkuMzM3MTQzNiAyMjUuNzUxMDg5LDM5LjA3ODI5NzMgTDIyNC4xMzA0OTksMzcuNzQ2MDg4MyBDMjI0LjAwMDM3MSwzNy42NjAxMzkzIDIyMy45NjczMzksMzcuNTQyMjA5MyAyMjQuMDMyNDAzLDM3LjM5NDI5NzEgQzIyNC4zNTc3MjIsMzYuNDQ0ODYwOSAyMjQuODkxMjQ1LDM1LjU2ODM4MTMgMjI1LjYzMzk3NCwzNC43NjY4NTcyIEMyMjUuNzM4MDc3LDM0LjY0MzkzMDIgMjI1Ljg2MjE5OCwzNC42MTI5NDg2IDIyNi4wMDUzMzksMzQuNjczOTEyNCBMMjI4LjAzNjMzMiwzNS4zNDA1MTY2IEMyMjguNTE2ODA0LDM0Ljk1Nzc0MzggMjI5LjA3NzM1NCwzNC42NDk5MjY2IDIyOS43MTU5ODEsMzQuNDE1MDY2MSBMMjMwLjEyNTM4MiwzMi40MTYyNTI4IEMyMzAuMTUxNDA4LDMyLjI2ODM0MDcgMjMwLjI0MjQ5NywzMi4xODIzOTE3IDIzMC4zOTg2NTEsMzIuMTU3NDA2NSBDMjMxLjQ2NTY5OCwzMS45NDc1MzEyIDIzMi41MzM3NDYsMzEuOTQ3NTMxMiAyMzMuNjAwNzkzLDMyLjE1NzQwNjUgQzIzMy43NTY5NDcsMzIuMTgxMzkyMyAyMzMuODQ4MDM2LDMyLjI2ODM0MDcgMjMzLjg3NDA2MSwzMi40MTYyNTI4IEwyMzQuMjgzNDYzLDM0LjQxNTA2NjEgQzIzNC44ODMwNTIsMzQuNjM3OTMzNyAyMzUuNDQyNjAxLDM0Ljk0NTc1MSAyMzUuOTYzMTEyLDM1LjM0MDUxNjYgTDIzNy45OTQxMDUsMzQuNjczOTEyNCBDMjM4LjEzNzI0NiwzNC42MTE5NDkyIDIzOC4yNjEzNjcsMzQuNjQzOTMwMiAyMzguMzY1NDcsMzQuNzY2ODU3MiBDMjM5LjEwNzE5NywzNS41NjkzODA3IDIzOS42NDA3MjEsMzYuNDQ0ODYwOSAyMzkuOTY3MDQxLDM3LjM5NDI5NzEgQzI0MC4wMzExMDQsMzcuNTQyMjA5MyAyMzkuOTk5MDczLDM3LjY2MDEzOTMgMjM5Ljg2ODk0NSwzNy43NDYwODgzIEwyMzguMjQ5MzU2LDM5LjA3ODI5NzMgTDIzOC4yNDkzNTYsMzkuMDc4Mjk3MyBaIE0yMzIsMzYuNSBDMjMwLjA2NzEyNSwzNi41IDIyOC41LDM4LjA2NzEyNSAyMjguNSw0MCBDMjI4LjUsNDEuOTMyODc1IDIzMC4wNjcxMjUsNDMuNSAyMzIsNDMuNSBDMjMzLjkzMjg3NSw0My41IDIzNS41LDQxLjkzMjg3NSAyMzUuNSw0MCBDMjM1LjUsMzguMDY3MTI1IDIzMy45MzI4NzUsMzYuNSAyMzIsMzYuNSBMMjMyLDM2LjUgWiIvPgogIDwvZz4KPC9zdmc+Cg=="

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBmaWxsPSIjOTU5OTlEIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMjQsMTMxIEMyMjQsMTMwLjQ0NzcxNSAyMjQuNDQ0NjMxLDEzMCAyMjUuMDAwODcyLDEzMCBMMjM4Ljk5OTEyOCwxMzAgQzIzOS41NTE4OTQsMTMwIDI0MCwxMzAuNDQzODY1IDI0MCwxMzEgQzI0MCwxMzEuNTUyMjg1IDIzOS41NTUzNjksMTMyIDIzOC45OTkxMjgsMTMyIEwyMjUuMDAwODcyLDEzMiBDMjI0LjQ0ODEwNiwxMzIgMjI0LDEzMS41NTYxMzUgMjI0LDEzMSBaIE0yMjQsMTQxIEMyMjQsMTQwLjQ0NzcxNSAyMjQuNDQ0NjMxLDE0MCAyMjUuMDAwODcyLDE0MCBMMjM4Ljk5OTEyOCwxNDAgQzIzOS41NTE4OTQsMTQwIDI0MCwxNDAuNDQzODY1IDI0MCwxNDEgQzI0MCwxNDEuNTUyMjg1IDIzOS41NTUzNjksMTQyIDIzOC45OTkxMjgsMTQyIEwyMjUuMDAwODcyLDE0MiBDMjI0LjQ0ODEwNiwxNDIgMjI0LDE0MS41NTYxMzUgMjI0LDE0MSBaIE0yMjQsMTM2IEMyMjQsMTM1LjQ0NzcxNSAyMjQuNDQ0NjMxLDEzNSAyMjUuMDAwODcyLDEzNSBMMjM4Ljk5OTEyOCwxMzUgQzIzOS41NTE4OTQsMTM1IDI0MCwxMzUuNDQzODY1IDI0MCwxMzYgQzI0MCwxMzYuNTUyMjg1IDIzOS41NTUzNjksMTM3IDIzOC45OTkxMjgsMTM3IEwyMjUuMDAwODcyLDEzNyBDMjI0LjQ0ODEwNiwxMzcgMjI0LDEzNi41NTYxMzUgMjI0LDEzNiBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI0IC0xMjgpIi8+Cjwvc3ZnPgo="

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=cozy-bar.standalone.js.map
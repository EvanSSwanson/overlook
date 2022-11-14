/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "*{\n  box-sizing: border-box;\n  font-family: 'Asap Condensed';\n}\n\nbody {\n  background-color: #F9F9F7;\n  margin: 0;\n}\n\nbutton {\n  cursor: pointer;\n}\n\nheader {\n  display: flex;\n  justify-content: space-around;\n  align-items: center;\n  height: 10vw;\n  width: 100%;\n  background-color: #B8462B;\n}\n\n.overlook-header {\n  -webkit-text-stroke: .1vw black;\n  color: #F9F9F7;\n  font-family: 'Akaya Telivigala';\n  font-size: 5vw;\n}\n\n.login-return-button, .dash-return-button {\n  height: 3.5vw;\n  width: 16vw;\n  margin-left: 4vw;\n  font-size: 1.35vw;\n  background-color: #F9F9F7;\n  border-style: solid;\n  border-color: #000000;\n  border-width: .25vw;\n  border-radius: 5vw;\n}\n\n.login-return-button:hover, .dash-return-button:hover, .filter-button:hover {\n  background-color: #535353;\n  color: #F9F9F7;\n}\n\n.login-prompt-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.mini-pineapple {\n  height: 5vw;\n  width: 5vw;\n}\n\n.login-prompt, .fail-prompt {\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  text-align: center;\n  font-family: 'Akaya Telivigala';\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  font-size: 3vw;\n  margin-top: 4vw;\n  margin-left: 3vw;\n  margin-right: 3vw;\n  color: #F9F9F7;\n}\n\n.fail-prompt {\n  background: rgba(107, 16, 16, 0.664);\n}\n\n.username-title, .password-title {\n  font-size: 2vw;\n}\n\n.username-input, .password-input {\n  height: 3vw;\n  width: 18vw;\n  font-size: 1.75vw;\n  border-style: solid;\n  border-color: #000000;\n  border-width: .25vw;\n  border-radius: .5vw;\n}\n\n.greeting-container, .dropdown-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.pineapple-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  margin-left: 1vw;\n  margin-right: 1vw;\n}\n\n.login-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n\n.pineapple {\n  height: 9vw;\n  width: 9vw;\n}\n\n.central-container, .central-dropdown-container, .manipulated-central-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  background-image: url(\"https://www.stanleyhotel.com/uploads/9/8/6/9/98696462/thestanleyhotel_orig.jpg\");\n  height: 19vw;\n  width: 80%;\n  border-radius: .2vw;\n}\n\n.greeting, .chosen-message, .success-message, .choose-message, .too-early-message, .apology-message {\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  text-align: center;\n  font-family: 'Akaya Telivigala';\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  font-size: 3vw;\n  margin-top: 4vw;\n  color: #F9F9F7;\n}\n\n.apology-message {\n  margin-top: 2vw;\n}\n\n.chosen-message {\n  margin-top: 2.5vw;\n}\n\n.reminder {\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  text-align: center;\n  font-family: 'Akaya Telivigala';\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  font-size: 2.5vw;\n  margin-bottom: 4vw;\n  color: #F9F9F7;\n}\n\n.date-picker-container {\n  display: flex;\n  align-items: center;\n}\n\n.vacancy {\n  background: rgba(255, 255, 255, 0.758);\n  border-radius: 1vw;\n  text-align: center;\n  font-family: 'Akaya Telivigala';\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  font-size: 2.5vw;\n  margin-bottom: 4vw;\n  color: #000000;\n}\n\n.submit-button, .confirm-button, .backtrack-button, .book-another-button {\n  margin-left: 1vw;\n  height: 2.5vw;\n  width: 10vw;\n  font-size: 1.25vw;\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  margin-bottom: 4vw;\n  color: #F9F9F7;\n}\n\n.confirm-button, .backtrack-button, .book-another-button {\n  height: 4.25vw;\n  width: 20vw;\n  font-size: 2vw;\n  margin-bottom: 2vw;\n}\n\n.submit-button:hover, .confirm-button:hover, .backtrack-button:hover, .book-another-button:hover {\n  background: rgba(255, 255, 255, 0.758);\n  color: #000000;\n}\n\n.confirm-container, .backtrack-container {\n  display: flex;\n  align-items: center;\n}\n\n.home-container, .available-rooms-container {\n  border-top: .125vw;\n  border-top-style: solid;\n  border-top-color: #E8E8E8;\n  border-left: 5.5vw;\n  border-left-style: solid;\n  border-left-color: #E8E8E8;\n  border-right: 5.5vw;\n  border-right-style: solid;\n  border-right-color: #E8E8E8;\n}\n\n.available-rooms-top-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.upcoming-bookings, .past-bookings, .available-rooms {\n  display: flex;\n  justify-content: center;\n  align-content: flex-start;\n  flex-direction: row;\n  flex-wrap: wrap;\n  padding-left: 0;\n}\n\n.upcoming-bookings-title, .past-bookings-title, .available-rooms-title {\n  font-family: 'Akaya Telivigala';\n  font-size: 1.75;\n  margin-left: 6.85vw;\n}\n\n.button-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  width: 60%;\n  margin-right: 6.85vw;\n}\n\n.filter-button {\n  height: 2vw;\n  width: 10vw;\n  font-size: 1vw;\n  background-color: #F9F9F7;\n  border-style: solid;\n  border-color: #000000;\n  border-width: .25vw;\n  border-radius: 5vw;\n}\n\n.booking-card {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  list-style: none;\n  flex-basis: 16%;\n  height:19vw;\n  margin: .75vw;\n  color: #000000;\n  text-align: center;\n  border-style: solid;\n  border-color: #B8462B;\n  border-width: .25vw;\n  border-radius: .2vw;\n}\n\n.card-button {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  background-color: transparent;\n  border: none;\n}\n\n.card-top {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 102%;\n  padding-top: 0;\n  background-color: #B8462B;\n  color: #F9F9F7;\n  border-top-style: solid;\n  border-color: #B8462B;\n  border-top-width: .5vw;\n  border-radius: .2vw;\n}\n\n.booking-card-top {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 108%;\n  margin-top: -.15vw;\n  padding-top: 0;\n  background-color: #B8462B;\n  color: #F9F9F7;\n  border-top-style: solid;\n  border-color: #B8462B;\n  border-top-width: .5vw;\n  border-radius: .2vw;\n}\n\n.booking-room, .booking-date, .booking-type, .booking-beds, .booking-cost {\n  font-size: 1.1vw;\n}\n\n.booking-room, .booking-date {\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  text-align: center;\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  color: #F9F9F7;\n  width: 60%;\n}\n\n.booking-cost {\n  margin-bottom: 2vw;\n}\n\n.section-footer {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.book-button, .login-button {\n  margin-top: 1.5vw;\n  color: #F9F9F7;\n  height: 3.5vw;\n  width: 16vw;\n  font-size: 1.35vw;\n  background-color: #B8462B;\n  border-style: solid;\n  border-color: #000000;\n  border-width: .25vw;\n  border-radius: 5vw;\n}\n\n.book-button:hover, .login-button:hover {\n  background-color: #892D17;\n}\n\n.total-bill {\n  font-size: 2vw;\n  font-family: 'Akaya Telivigala';\n}\n\n.buffer-space {\n  height: 2vw;\n}\n\n.hidden {\n  display: none;\n}", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"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","sourcesContent":["*{\n  box-sizing: border-box;\n  font-family: 'Asap Condensed';\n}\n\nbody {\n  background-color: #F9F9F7;\n  margin: 0;\n}\n\nbutton {\n  cursor: pointer;\n}\n\nheader {\n  display: flex;\n  justify-content: space-around;\n  align-items: center;\n  height: 10vw;\n  width: 100%;\n  background-color: #B8462B;\n}\n\n.overlook-header {\n  -webkit-text-stroke: .1vw black;\n  color: #F9F9F7;\n  font-family: 'Akaya Telivigala';\n  font-size: 5vw;\n}\n\n.login-return-button, .dash-return-button {\n  height: 3.5vw;\n  width: 16vw;\n  margin-left: 4vw;\n  font-size: 1.35vw;\n  background-color: #F9F9F7;\n  border-style: solid;\n  border-color: #000000;\n  border-width: .25vw;\n  border-radius: 5vw;\n}\n\n.login-return-button:hover, .dash-return-button:hover, .filter-button:hover {\n  background-color: #535353;\n  color: #F9F9F7;\n}\n\n.login-prompt-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.mini-pineapple {\n  height: 5vw;\n  width: 5vw;\n}\n\n.login-prompt, .fail-prompt {\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  text-align: center;\n  font-family: 'Akaya Telivigala';\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  font-size: 3vw;\n  margin-top: 4vw;\n  margin-left: 3vw;\n  margin-right: 3vw;\n  color: #F9F9F7;\n}\n\n.fail-prompt {\n  background: rgba(107, 16, 16, 0.664);\n}\n\n.username-title, .password-title {\n  font-size: 2vw;\n}\n\n.username-input, .password-input {\n  height: 3vw;\n  width: 18vw;\n  font-size: 1.75vw;\n  border-style: solid;\n  border-color: #000000;\n  border-width: .25vw;\n  border-radius: .5vw;\n}\n\n.greeting-container, .dropdown-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.pineapple-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  margin-left: 1vw;\n  margin-right: 1vw;\n}\n\n.login-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n\n.pineapple {\n  height: 9vw;\n  width: 9vw;\n}\n\n.central-container, .central-dropdown-container, .manipulated-central-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  background-image: url(\"https://www.stanleyhotel.com/uploads/9/8/6/9/98696462/thestanleyhotel_orig.jpg\");\n  height: 19vw;\n  width: 80%;\n  border-radius: .2vw;\n}\n\n.greeting, .chosen-message, .success-message, .choose-message, .too-early-message, .apology-message {\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  text-align: center;\n  font-family: 'Akaya Telivigala';\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  font-size: 3vw;\n  margin-top: 4vw;\n  color: #F9F9F7;\n}\n\n.apology-message {\n  margin-top: 2vw;\n}\n\n.chosen-message {\n  margin-top: 2.5vw;\n}\n\n.reminder {\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  text-align: center;\n  font-family: 'Akaya Telivigala';\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  font-size: 2.5vw;\n  margin-bottom: 4vw;\n  color: #F9F9F7;\n}\n\n.date-picker-container {\n  display: flex;\n  align-items: center;\n}\n\n.vacancy {\n  background: rgba(255, 255, 255, 0.758);\n  border-radius: 1vw;\n  text-align: center;\n  font-family: 'Akaya Telivigala';\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  font-size: 2.5vw;\n  margin-bottom: 4vw;\n  color: #000000;\n}\n\n.submit-button, .confirm-button, .backtrack-button, .book-another-button {\n  margin-left: 1vw;\n  height: 2.5vw;\n  width: 10vw;\n  font-size: 1.25vw;\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  margin-bottom: 4vw;\n  color: #F9F9F7;\n}\n\n.confirm-button, .backtrack-button, .book-another-button {\n  height: 4.25vw;\n  width: 20vw;\n  font-size: 2vw;\n  margin-bottom: 2vw;\n}\n\n.submit-button:hover, .confirm-button:hover, .backtrack-button:hover, .book-another-button:hover {\n  background: rgba(255, 255, 255, 0.758);\n  color: #000000;\n}\n\n.confirm-container, .backtrack-container {\n  display: flex;\n  align-items: center;\n}\n\n.home-container, .available-rooms-container {\n  border-top: .125vw;\n  border-top-style: solid;\n  border-top-color: #E8E8E8;\n  border-left: 5.5vw;\n  border-left-style: solid;\n  border-left-color: #E8E8E8;\n  border-right: 5.5vw;\n  border-right-style: solid;\n  border-right-color: #E8E8E8;\n}\n\n.available-rooms-top-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.upcoming-bookings, .past-bookings, .available-rooms {\n  display: flex;\n  justify-content: center;\n  align-content: flex-start;\n  flex-direction: row;\n  flex-wrap: wrap;\n  padding-left: 0;\n}\n\n.upcoming-bookings-title, .past-bookings-title, .available-rooms-title {\n  font-family: 'Akaya Telivigala';\n  font-size: 1.75;\n  margin-left: 6.85vw;\n}\n\n.button-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  width: 60%;\n  margin-right: 6.85vw;\n}\n\n.filter-button {\n  height: 2vw;\n  width: 10vw;\n  font-size: 1vw;\n  background-color: #F9F9F7;\n  border-style: solid;\n  border-color: #000000;\n  border-width: .25vw;\n  border-radius: 5vw;\n}\n\n.booking-card {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  list-style: none;\n  flex-basis: 16%;\n  height:19vw;\n  margin: .75vw;\n  color: #000000;\n  text-align: center;\n  border-style: solid;\n  border-color: #B8462B;\n  border-width: .25vw;\n  border-radius: .2vw;\n}\n\n.card-button {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  background-color: transparent;\n  border: none;\n}\n\n.card-top {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 102%;\n  padding-top: 0;\n  background-color: #B8462B;\n  color: #F9F9F7;\n  border-top-style: solid;\n  border-color: #B8462B;\n  border-top-width: .5vw;\n  border-radius: .2vw;\n}\n\n.booking-card-top {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 108%;\n  margin-top: -.15vw;\n  padding-top: 0;\n  background-color: #B8462B;\n  color: #F9F9F7;\n  border-top-style: solid;\n  border-color: #B8462B;\n  border-top-width: .5vw;\n  border-radius: .2vw;\n}\n\n.booking-room, .booking-date, .booking-type, .booking-beds, .booking-cost {\n  font-size: 1.1vw;\n}\n\n.booking-room, .booking-date {\n  background: rgba(0, 0, 0, .6);\n  border-radius: 1vw;\n  text-align: center;\n  border-left: 1vw;\n  border-right: 1vw;\n  border-style: solid;\n  border-color: rgba(0, 0, 0, .001);\n  color: #F9F9F7;\n  width: 60%;\n}\n\n.booking-cost {\n  margin-bottom: 2vw;\n}\n\n.section-footer {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.book-button, .login-button {\n  margin-top: 1.5vw;\n  color: #F9F9F7;\n  height: 3.5vw;\n  width: 16vw;\n  font-size: 1.35vw;\n  background-color: #B8462B;\n  border-style: solid;\n  border-color: #000000;\n  border-width: .25vw;\n  border-radius: 5vw;\n}\n\n.book-button:hover, .login-button:hover {\n  background-color: #892D17;\n}\n\n.total-bill {\n  font-size: 2vw;\n  font-family: 'Akaya Telivigala';\n}\n\n.buffer-space {\n  height: 2vw;\n}\n\n.hidden {\n  display: none;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 5 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/turing-logo.png");

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/pineapple-logo.png");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Customer {
    constructor(customer) {
        this.name = customer.name;
        this.id = customer.id;
        this.bookings = [];
    };

    assignBookings(bookings) {
        bookings.forEach(booking => {
            if(booking.customerId === this.id) {
                this.bookings.push(booking);
            };
        });
    };
};





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Customer);

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Room {
    constructor(room) {
        this.number = room.number;
        this.type = room.roomType;
        this.bedSize = room.bedSize;
        this.numBeds = room.numBeds;
        this.costPerNight = room.costPerNight;
    };
};





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Room);

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Booking {
    constructor(booking) {
        this.id = booking.id;
        this.customerId = booking.userID;
        this.date = booking.date;
        this.roomNumber = booking.roomNumber;
        this.micro = new Date(this.date).getTime();
    };

    makeAmericanDate() {
        const date = new Date(this.date);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        if(month < 10 && day < 10) {
            this.americanDate = `0${month}/0${day}/${year}`
        } else if(month < 10 && day > 9) {
            this.americanDate = `0${month}/${day}/${year}`
        } else if(month > 9 && day < 10) {
            this.americanDate = `${month}/0${day}/${year}`
        } else {
            this.americanDate = `${month}/${day}/${year}`
        };
    };

    attachCustomerName(customers) {
        customers.forEach(customer => {
            if(this.customerId === customer.id) {
                this.customerName = customer.name;
            };
        });
    };

};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Booking);

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _images_turing_logo_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _images_pineapple_logo_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _classes_Customer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _classes_Room_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _classes_Booking_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);







//GLOBAL VARIABLES
let loginId;
let customersData;
let roomsData;
let bookingsData;
let allCustomers;
let allBookings;
let allRooms;
let currentCustomer;
let possibleRooms;
let pickedRoom;
let vacancyMicro;
let filteredSelection = 'all';
let tempRoom;

//API CALLS
function gatherData(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(err => console.log(err))
};

function instantiateAllData() {
    Promise.all([
        gatherData('http://localhost:3001/api/v1/bookings'),
        gatherData('http://localhost:3001/api/v1/customers'),
        gatherData('http://localhost:3001/api/v1/rooms')
    ]).then(data => {
        bookingsData = data[0].bookings;
        customersData = data[1].customers;
        roomsData = data[2].rooms;
        setData();
    });
};

function postBooking(customer, date, room) {
    const dateArray = date.value.split('-');
    console.log(customer.id, dateArray.join('/'), room.number);
    fetch('http://localhost:3001/api/v1/bookings', {
      method: 'POST',
      body: JSON.stringify({
        "userID": customer.id,
        "date": dateArray.join('/'),
        "roomNumber": room.number
    }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .catch(err => console.log(err));
};

//QUERY SELECTORS
const usernameInput = document.querySelector('.username-input');
const passwordInput = document.querySelector('.password-input');
const loginPromptContainer = document.querySelector('.login-prompt-container');
const loginView = document.querySelector('.login-view');
const dashView = document.querySelector('.home-view');
const bookingView = document.querySelector('.booking-view');
const greeting = document.querySelector('.greeting');
const loginReturnButton = document.querySelector('.login-return-button');
const dashReturnButton = document.querySelector('.dash-return-button');
const upcomingBookings = document.querySelector('.upcoming-bookings');
const pastBookings = document.querySelector('.past-bookings');
const availableRooms = document.querySelector('.available-rooms');
const totalBill = document.querySelector('.total-bill');
const centralDropdownContainer = document.querySelector('.central-dropdown-container');
const manipulatedCentralContainer = document.querySelector('.manipulated-central-container');
const vacancy = document.querySelector('.vacancy');
const loginButton = document.querySelector('.login-button');
const submitButton = document.querySelector('.submit-button');
const allButton = document.querySelector('#all');
const singleButton = document.querySelector('#single');
const juniorButton = document.querySelector('#junior');
const suiteButton = document.querySelector('#suite');
const residentialButton = document.querySelector('#residential');
const bookButton = document.querySelector('.book-button');

//GLOBAL EVENT LISTENERS
window.addEventListener('load', instantiateAllData);
loginButton.addEventListener('click', checkLogin);
loginReturnButton.addEventListener('click', showLoginView);
dashReturnButton.addEventListener('click', loadDashView);
bookButton.addEventListener('click', showBookingView);
submitButton.addEventListener('click', renderPossibleBookings);
allButton.addEventListener('click', showFilteredRooms);
singleButton.addEventListener('click', showFilteredRooms);
juniorButton.addEventListener('click', showFilteredRooms);
suiteButton.addEventListener('click', showFilteredRooms);
residentialButton.addEventListener('click', showFilteredRooms);

//FUNCTIONS
function setData() {
    getAllBookings(bookingsData);
    getAllCustomers(customersData);
    getAllRooms(roomsData);
};

function checkLogin() {
    const customerCheck = usernameInput.value.slice(0, 8);
    loginId = usernameInput.value.split('r')[1];
    if(customerCheck === 'customer' && (loginId % 1 === 0) && (1 <= loginId <= 50) && passwordInput.value === 'overlook2021') {
        loadPage();
    } else {
        loginPromptContainer.innerHTML = '';
        loginPromptContainer.innerHTML = `<img class="mini-pineapple" src="./images/pineapple-logo.png" alt="hospitality pineapple">
        <h2 class="fail-prompt">Your inputs do not match any user profiles; please try again:</h2>
        <img class="mini-pineapple" src="./images/pineapple-logo.png" alt="hospitality pineapple">`
    };
};

function getAllBookings(data) {
    allBookings = data.reduce((acc, datum) => {
        let booking = new _classes_Booking_js__WEBPACK_IMPORTED_MODULE_5__.default(datum);
        booking.attachCustomerName(customersData);
        booking.makeAmericanDate();
        acc.push(booking);
        return acc;
    }, []);
};

function getAllCustomers(data) {
    allCustomers = data.reduce((acc, datum) => {
        let customer = new _classes_Customer_js__WEBPACK_IMPORTED_MODULE_3__.default(datum);
        customer.assignBookings(allBookings);
        acc.push(customer);
        return acc;
    }, []);
};

function getAllRooms(data) {
    allRooms = data.reduce((acc, datum) => {
        acc.push(new _classes_Room_js__WEBPACK_IMPORTED_MODULE_4__.default(datum));
        return acc;
    }, []);
};

function loadPage() {
    const loginPosition = loginId - 1;
    currentCustomer = allCustomers[loginPosition];
    renderDashboard(currentCustomer);
    showDashView();
};

function renderDashboard(customer) {
    greeting.innerText = '';
    greeting.innerText = `Welcome, ${customer.name}!`;
    renderCustomerBookings();
};

function renderCustomerBookings() {
    let upcomingRooms = [];
    if(tempRoom !== undefined) {
        upcomingRooms.push(tempRoom);
    };
    let pastRooms = [];
    allRooms.forEach(room => {
        return currentCustomer.bookings.forEach(booking => {
            if(booking.roomNumber === room.number && booking.micro > new Date().getTime()) {
                let obj = {};
                obj['roomInfo'] = room;
                obj['date'] = booking.americanDate;
                obj['micro'] = booking.micro;
                upcomingRooms.push(obj);
            };
            if(booking.roomNumber === room.number && booking.micro < new Date().getTime()) {
                let obj = {};
                obj['roomInfo'] = room;
                obj['date'] = booking.americanDate;
                obj['micro'] = booking.micro;
                pastRooms.push(obj);
            };
        });
    });
    const sortedUpcomings = upcomingRooms.sort((a, b) => {
        return a['micro'] - b['micro'];
    });
    const sortedPasts = pastRooms.sort((a, b) => {
        return b['micro'] - a['micro'];
    });
    console.log('tempRoom: ', tempRoom)
    console.log('sortedUpcomings: ', sortedUpcomings);
    upcomingBookings.innerHTML = '';
    upcomingBookings.innerHTML = sortedUpcomings.map(room => {
        let bed;
        if(room.roomInfo.numBeds === 1) {
            bed = 'bed'
        } else {
            bed = 'beds'
        };
        return `<li class="booking-card">
            <div class="card-top">
                <h3 class="booking-room">Room ${room.roomInfo.number}</h3>
                <p class="booking-date">${room.date}</p>
            </div>
            <p class="booking-type">${room.roomInfo.type}</p>
            <p class="booking-beds">${room.roomInfo.numBeds} ${room.roomInfo.bedSize} ${bed}</p>
            <p class="booking-cost">per night: $${(Math.round(room.roomInfo.costPerNight * 100) / 100).toFixed(2)}</p>
        </li>`
    }).join('');
    pastBookings.innerHTML = '';
    pastBookings.innerHTML = sortedPasts.map(room => {
        let bed;
        if(room.roomInfo.numBeds === 1) {
            bed = 'bed'
        } else {
            bed = 'beds'
        };
        return `<li class="booking-card">
            <div class="card-top">
                <h3 class="booking-room">Room ${room.roomInfo.number}</h3>
                <p class="booking-date">${room.date}</p>
            </div>
            <p class="booking-type">${room.roomInfo.type}</p>
            <p class="booking-beds">${room.roomInfo.numBeds} ${room.roomInfo.bedSize} ${bed}</p>
            <p class="booking-cost">per night: $${(Math.round(room.roomInfo.costPerNight * 100) / 100).toFixed(2)}</p>
        </li>`
    }).join('');
    totalBill.innerText = '';
    totalBill.innerText = `Total Bill: $${(Math.round(pastRooms.reduce((acc, room) => {
        return acc + room.roomInfo.costPerNight
    }, 0) * 100) / 100).toFixed(2)}`;
};

function renderPossibleBookings() {
    let chosenDate = convertVacancyDate();
    if(vacancyMicro < Date.now()) {
       showInvalidMessage('future');
    } else if(chosenDate.includes('N')) {
        showInvalidMessage('valid');
    } else {
        const thatDaysBookedRooms = allBookings.reduce((acc, booking) => {
            if(booking.americanDate === chosenDate) {
                acc.push(booking.roomNumber);
            };
            return acc;
        }, []);
        if(filteredSelection === 'all') {
            possibleRooms = allRooms.reduce((acc, room) => {
                if(!thatDaysBookedRooms.includes(room.number)) {
                    acc.push(room);
                };
                return acc;
            }, []);
        } else {
            possibleRooms = allRooms.reduce((acc, room) => {
                if(!thatDaysBookedRooms.includes(room.number) && room.type.split(' ')[0] === filteredSelection) {
                    acc.push(room);
                };
                return acc;
            }, []);
        };
        if(possibleRooms.length === 0) {
            apologizeProfusely();
        } else {
            showDatePicker();
        };
        availableRooms.innerHTML = '';
        availableRooms.innerHTML = possibleRooms.map(room => {
            let bed;
            if(room.numBeds === 1) {
                bed = 'bed'
            } else {
                bed = 'beds'
            };
            return `<li class="booking-card">
                <button class="card-button" id="button-${room.number}"><div class="booking-card-top" id="top-${room.number}">
                    <h3 class="booking-room" id="room-${room.number}">Room ${room.number}</h3>
                    <p class="booking-date" id="date-${room.number}">${chosenDate}</p>
                </div>
                <p class="booking-type" id="type-${room.number}">${room.type}</p>
                <p class="booking-beds" id="beds-${room.number}">${room.numBeds} ${room.bedSize} ${bed}</p>
                <p class="booking-cost" id="cost-${room.number}">per night: $${(Math.round(room.costPerNight * 100) / 100).toFixed(2)}</p></button>
            </li>`
        }).join('');
        const cardButton = document.querySelectorAll('.card-button', '.booking-card-top', '.booking-room', '.booking-date', '.booking-type', 'booking-beds', '.bookinh-cost');
        cardButton.forEach(button => {
            button.addEventListener('click', selectRoom)
        });
    };
};

function showFilteredRooms(event) {
    filteredSelection = event.target.id;
    renderPossibleBookings();
};

function convertVacancyDate() {
    let backslashVacancyDate = vacancy.value.split('-');
        const date = new Date(backslashVacancyDate.join('/'));
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        vacancyMicro = date.getTime();
        if(month < 10 && day < 10) {
            return `0${month}/0${day}/${year}`
        } else if(month < 10 && day > 9) {
            return `0${month}/${day}/${year}`
        } else if(month > 9 && day < 10) {
            return `${month}/0${day}/${year}`
        } else {
            return `${month}/${day}/${year}`
        };
};

function selectRoom(event) {
    const targetId = event.target.id.split('-');
    pickedRoom = possibleRooms.find(room => room.number === parseInt(targetId[1]));
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="chosen-message">You have chosen Room ${pickedRoom.number} on ${convertVacancyDate()}</h2>
        <button class="confirm-button">Confirm Reservation</button>
        <button class="backtrack-button">Pick Another Date</button>`
    const confirmButton = document.querySelector('.confirm-button');
    const backtrackButton = document.querySelector('.backtrack-button');
    confirmButton.addEventListener('click', reserveRoom);
    backtrackButton.addEventListener('click', showDatePicker);
    console.log(possibleRooms);
    console.log(pickedRoom);
    centralDropdownContainer.classList.add('hidden');
    manipulatedCentralContainer.classList.remove('hidden');
};

function reserveRoom() {
    postBooking(currentCustomer, vacancy, pickedRoom);
    tempRoom = {};
    tempRoom['roomInfo'] = pickedRoom;
    tempRoom['date'] = convertVacancyDate();
    tempRoom['micro'] = vacancyMicro;
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="success-message">Success! Room ${pickedRoom.number} will be ready for you on ${convertVacancyDate()}.</h2>
        <button class="book-another-button">Book Another Room</button>`
    const bookAnotherButton = document.querySelector('.book-another-button');
    bookAnotherButton.addEventListener('click', showDatePicker);
    instantiateAllData();
};

function loadDashView() {
    loadPage();
    showDashView();
};

function showInvalidMessage(invalid) {
    availableRooms.innerHTML = '';
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="too-early-message">Please pick a *${invalid}* day</h2>
    <button class="backtrack-button">Pick Another Date</button>`;
    const backtrackButton = document.querySelector('.backtrack-button');
    backtrackButton.addEventListener('click', showDatePicker);
    centralDropdownContainer.classList.add('hidden');
    manipulatedCentralContainer.classList.remove('hidden');
};

function apologizeProfusely() {
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="apology-message">im so sorry bro you gotta forgive me bro please but theres no rooms available bro forgive me im so sorry bro please pick another room dont be mad at me bro please</h2>
    <button class="backtrack-button">Pick Another Date</button>`;
    const backtrackButton = document.querySelector('.backtrack-button');
    backtrackButton.addEventListener('click', showDatePicker);
    centralDropdownContainer.classList.add('hidden');
    manipulatedCentralContainer.classList.remove('hidden');
};

function showDatePicker() {
    manipulatedCentralContainer.innerHTML = '';
    manipulatedCentralContainer.innerHTML = `<h2 class="choose-message">Choose a Date to Find Available Rooms:</h2>
    <div class="date-picker-container">
        <input type="date" class="vacancy" id="vacancy" name="vacancy">
        <button class="submit-button">Find Rooms</button>
    </div>`
    manipulatedCentralContainer.classList.add('hidden');
    centralDropdownContainer.classList.remove('hidden');
};

//TOGGLE HIDDEN FUNCTIONS
function showLoginView() {
    usernameInput.value = '';
    passwordInput.value = '';
    dashView.classList.add('hidden');
    loginReturnButton.classList.add('hidden');
    loginView.classList.remove('hidden');
}

function showBookingView() {
    bookingView.classList.remove('hidden');
    loginReturnButton.classList.add('hidden');
    dashView.classList.add('hidden');
    dashReturnButton.classList.remove('hidden');
};

function showDashView() {
    dashView.classList.remove('hidden');
    dashReturnButton.classList.add('hidden');
    bookingView.classList.add('hidden');
    loginReturnButton.classList.remove('hidden');
    loginView.classList.add('hidden');
};
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('leaflet')) :
	typeof define === 'function' && define.amd ? define(['leaflet'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CytoscapeLeaflet = factory(global.L));
})(this, (function (L) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var L__default = /*#__PURE__*/_interopDefaultLegacy(L);

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var arrayWithHoles = createCommonjsModule(function (module) {
	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var iterableToArrayLimit = createCommonjsModule(function (module) {
	function _iterableToArrayLimit(arr, i) {
	  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

	  if (_i == null) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;

	  var _s, _e;

	  try {
	    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var arrayLikeToArray = createCommonjsModule(function (module) {
	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var unsupportedIterableToArray = createCommonjsModule(function (module) {
	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
	}

	module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var nonIterableRest = createCommonjsModule(function (module) {
	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var slicedToArray = createCommonjsModule(function (module) {
	function _slicedToArray(arr, i) {
	  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
	}

	module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var classCallCheck = createCommonjsModule(function (module) {
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var createClass = createCommonjsModule(function (module) {
	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  Object.defineProperty(Constructor, "prototype", {
	    writable: false
	  });
	  return Constructor;
	}

	module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var defineProperty = createCommonjsModule(function (module) {
	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var safeIsNaN = Number.isNaN ||
	    function ponyfill(value) {
	        return typeof value === 'number' && value !== value;
	    };
	function isEqual(first, second) {
	    if (first === second) {
	        return true;
	    }
	    if (safeIsNaN(first) && safeIsNaN(second)) {
	        return true;
	    }
	    return false;
	}
	function areInputsEqual(newInputs, lastInputs) {
	    if (newInputs.length !== lastInputs.length) {
	        return false;
	    }
	    for (var i = 0; i < newInputs.length; i++) {
	        if (!isEqual(newInputs[i], lastInputs[i])) {
	            return false;
	        }
	    }
	    return true;
	}

	function memoizeOne(resultFn, isEqual) {
	    if (isEqual === void 0) { isEqual = areInputsEqual; }
	    var cache = null;
	    function memoized() {
	        var newArgs = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            newArgs[_i] = arguments[_i];
	        }
	        if (cache && cache.lastThis === this && isEqual(newArgs, cache.lastArgs)) {
	            return cache.lastResult;
	        }
	        var lastResult = resultFn.apply(this, newArgs);
	        cache = {
	            lastResult: lastResult,
	            lastArgs: newArgs,
	            lastThis: this,
	        };
	        return lastResult;
	    }
	    memoized.clear = function clear() {
	        cache = null;
	    };
	    return memoized;
	}

	/**
	 * @see https://github.com/cytoscape/cytoscape.js/blob/master/src/extensions/renderer/base/load-listeners.js
	 */

	function isMultSelKeyDown(event) {
	  return event.shiftKey || event.metaKey || event.ctrlKey; // maybe event.altKey
	}
	/**
	 * @param {cytoscape.Position} position1
	 * @param {cytoscape.Position} position2
	 * @return {boolean}
	 */

	function arePositionsEqual(position1, position2) {
	  return position1.x === position2.x && position1.y === position2.y;
	}

	function getUpdatedPositions(currentPositions, positions) {
	  return Object.fromEntries(Object.entries(positions).filter(function (_ref) {
	    var _ref2 = slicedToArray(_ref, 2),
	        id = _ref2[0],
	        position = _ref2[1];

	    var currentPosition = currentPositions[id];
	    return !arePositionsEqual(currentPosition, position);
	  }));
	}
	var getUpdatedPositionsMemo = memoizeOne(getUpdatedPositions);

	function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
	var DEFAULT_FIT_PADDING = [50, 50];
	var DEFAULT_ANIMATION_DURATION = 1;
	var HIDDEN_CLASS = 'cytoscape-map__hidden';
	var MapHandler = /*#__PURE__*/function () {
	  // zooming: boolean = false;
	  // onZoomStartBound = this.onZoomStart.bind(this);
	  // onZoomEndBound = this.onZoomEnd.bind(this);
	  // panZoomAnimationFrameBound = this.panZoomAnimationFrame.bind(this);

	  /**
	   * @param {cytoscape.Core} cy
	   * @param {L.MapOptions} mapOptions
	   * @param {MapHandlerOptions} options
	   */
	  function MapHandler(cy, mapOptions, options) {
	    classCallCheck(this, MapHandler);

	    defineProperty(this, "cy", void 0);

	    defineProperty(this, "mapOptions", void 0);

	    defineProperty(this, "options", void 0);

	    defineProperty(this, "mapContainer", void 0);

	    defineProperty(this, "map", void 0);

	    defineProperty(this, "originalAutoungrabify", void 0);

	    defineProperty(this, "originalUserZoomingEnabled", void 0);

	    defineProperty(this, "originalUserPanningEnabled", void 0);

	    defineProperty(this, "originalPositions", void 0);

	    defineProperty(this, "originalZoom", void 0);

	    defineProperty(this, "originalPan", void 0);

	    defineProperty(this, "enabled", false);

	    defineProperty(this, "panning", false);

	    defineProperty(this, "updateLayout", true);

	    defineProperty(this, "requestAnimationId", void 0);

	    defineProperty(this, "onGraphContainerMouseDownBound", this.onGraphContainerMouseDown.bind(this));

	    defineProperty(this, "onGraphContainerMouseMoveBound", this.onGraphContainerMouseMove.bind(this));

	    defineProperty(this, "onGraphContainerWheelBound", this.onGraphContainerWheel.bind(this));

	    defineProperty(this, "onMapMoveBound", this.onMapMove.bind(this));

	    defineProperty(this, "onGraphAddBound", this.onGraphAdd.bind(this));

	    defineProperty(this, "onGraphResizeBound", this.onGraphResize.bind(this));

	    defineProperty(this, "onGraphDragFreeBound", this.onGraphDragFree.bind(this));

	    this.cy = cy;
	    this.mapOptions = mapOptions;
	    this.options = options;
	    this.updateLayout = options.updateLayout || false;

	    if (!(typeof this.options.getPosition === 'function')) {
	      throw new Error('getPosition should be a function');
	    }

	    if (this.options.setPosition && !(typeof this.options.setPosition === 'function')) {
	      throw new Error('setPosition should be a function');
	    }

	    this.enable();
	  }

	  createClass(MapHandler, [{
	    key: "enable",
	    value: function enable() {
	      if (!this.cy) return;
	      if (!this.options) return;
	      if (this.enabled) return;
	      this.enabled = true; // Cytoscape config

	      this.originalAutoungrabify = this.cy.autoungrabify();
	      this.originalUserZoomingEnabled = this.cy.userZoomingEnabled();
	      this.originalUserPanningEnabled = this.cy.userPanningEnabled();
	      this.cy.userZoomingEnabled(false);
	      this.cy.userPanningEnabled(false); // Cytoscape events

	      var graphContainer = this.cy.container();
	      graphContainer.addEventListener('mousedown', this.onGraphContainerMouseDownBound);
	      graphContainer.addEventListener('mousemove', this.onGraphContainerMouseMoveBound);
	      graphContainer.addEventListener('wheel', this.onGraphContainerWheelBound);
	      this.cy.on('add', this.onGraphAddBound);
	      this.cy.on('resize', this.onGraphResizeBound);
	      this.cy.on('dragfree', this.onGraphDragFreeBound); // Map container

	      if (!this.mapContainer) {
	        this.mapContainer = document.createElement('div');
	        this.mapContainer.style.position = 'absolute';
	        this.mapContainer.style.top = '0px';
	        this.mapContainer.style.left = '0px';
	        this.mapContainer.style.width = '100%';
	        this.mapContainer.style.height = '100%';
	        graphContainer === null || graphContainer === void 0 ? void 0 : graphContainer.prepend(this.mapContainer);
	      } // Leaflet instance


	      if (!this.map) {
	        this.map = new L__default["default"].Map(this.mapContainer, this.mapOptions);
	        this.fit();
	      } // Map events


	      this.map.on('move', this.onMapMoveBound); // this.map.on('zoomstart', this.onZoomStartBound);
	      // this.map.on('zoomend', this.onZoomEndBound);
	      // Cytoscape unit viewport

	      this.originalZoom = this.cy.zoom();
	      this.originalPan = _objectSpread({}, this.cy.pan());
	      var zoom = 1;
	      var pan = {
	        x: 0,
	        y: 0
	      };

	      if (this.options.animate) {
	        var _this$options$animati;

	        this.cy.animate({
	          zoom: zoom,
	          pan: pan
	        }, {
	          duration: (_this$options$animati = this.options.animationDuration) !== null && _this$options$animati !== void 0 ? _this$options$animati : DEFAULT_ANIMATION_DURATION,
	          easing: 'linear'
	        });
	      } else {
	        this.cy.viewport({
	          zoom: zoom,
	          pan: pan
	        });
	      } // Cytoscape positions


	      this.enableGeographicPositions();
	    }
	  }, {
	    key: "destroy",
	    value: function destroy() {
	      var _this$map, _this$mapContainer;

	      this.disable(); // Map instance

	      (_this$map = this.map) === null || _this$map === void 0 ? void 0 : _this$map.remove();
	      this.map = undefined; // Map container

	      (_this$mapContainer = this.mapContainer) === null || _this$mapContainer === void 0 ? void 0 : _this$mapContainer.remove();
	      this.mapContainer = undefined;
	      this.cy = undefined;
	      this.options = undefined;
	    }
	  }, {
	    key: "disable",
	    value: function disable() {
	      var _this$cy, _this$map2, _this$options;

	      if (!this.enabled) return;
	      this.enabled = false; // Cytoscape events

	      var graphContainer = (_this$cy = this.cy) === null || _this$cy === void 0 ? void 0 : _this$cy.container();

	      if (graphContainer) {
	        graphContainer.removeEventListener('mousedown', this.onGraphContainerMouseDownBound);
	        graphContainer.removeEventListener('mousemove', this.onGraphContainerMouseMoveBound);
	        graphContainer.removeEventListener('wheel', this.onGraphContainerWheelBound);
	      }

	      if (this.cy) {
	        this.cy.off('add', this.onGraphAddBound);
	        this.cy.off('resize', this.onGraphResizeBound);
	        this.cy.off('dragfree', this.onGraphDragFreeBound); // Cytoscape config

	        this.cy.autoungrabify(this.originalAutoungrabify);
	        this.cy.userZoomingEnabled(this.originalUserZoomingEnabled);
	        this.cy.userPanningEnabled(this.originalUserPanningEnabled);
	      }

	      this.originalAutoungrabify = undefined;
	      this.originalUserZoomingEnabled = undefined;
	      this.originalUserPanningEnabled = undefined; // Map events

	      (_this$map2 = this.map) === null || _this$map2 === void 0 ? void 0 : _this$map2.off('move', this.onMapMoveBound); // Cytoscape unit viewport

	      if ((_this$options = this.options) !== null && _this$options !== void 0 && _this$options.animate) {
	        var _this$cy2, _this$options$animati2;

	        (_this$cy2 = this.cy) === null || _this$cy2 === void 0 ? void 0 : _this$cy2.animate({
	          zoom: this.originalZoom,
	          pan: this.originalPan
	        }, {
	          duration: (_this$options$animati2 = this.options.animationDuration) !== null && _this$options$animati2 !== void 0 ? _this$options$animati2 : DEFAULT_ANIMATION_DURATION,
	          easing: 'linear'
	        });
	      } else {
	        var _this$cy3, _this$originalZoom, _this$originalPan;

	        (_this$cy3 = this.cy) === null || _this$cy3 === void 0 ? void 0 : _this$cy3.viewport({
	          zoom: (_this$originalZoom = this.originalZoom) !== null && _this$originalZoom !== void 0 ? _this$originalZoom : 5,
	          pan: (_this$originalPan = this.originalPan) !== null && _this$originalPan !== void 0 ? _this$originalPan : {
	            x: 0,
	            y: 0
	          }
	        });
	      }

	      this.originalZoom = undefined;
	      this.originalPan = undefined; // Cytoscape positions

	      this.disableGeographicPositions();
	    }
	    /**
	     * @param {cytoscape.NodeCollection} nodes
	     * @param {L.FitBoundsOptions} options
	     */

	  }, {
	    key: "fit",
	    value: function fit() {
	      var _this$cy$nodes, _this$cy4, _this$map3;

	      var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_this$cy$nodes = (_this$cy4 = this.cy) === null || _this$cy4 === void 0 ? void 0 : _this$cy4.nodes()) !== null && _this$cy$nodes !== void 0 ? _this$cy$nodes : [];
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
	        padding: DEFAULT_FIT_PADDING,
	        animate: false
	      };
	      var bounds = this.getNodeLngLatBounds(nodes);

	      if (!bounds.isValid()) {
	        return;
	      }

	      (_this$map3 = this.map) === null || _this$map3 === void 0 ? void 0 : _this$map3.fitBounds(bounds, options);
	    }
	    /**
	     * @private
	     */

	  }, {
	    key: "enableGeographicPositions",
	    value: function enableGeographicPositions() {
	      var _this$cy$nodes2,
	          _this$cy5,
	          _this = this,
	          _this$cy6,
	          _this$options2,
	          _this$options$animati3,
	          _this$options3;

	      if (!this.updateLayout) return;
	      var nodes = (_this$cy$nodes2 = (_this$cy5 = this.cy) === null || _this$cy5 === void 0 ? void 0 : _this$cy5.nodes()) !== null && _this$cy$nodes2 !== void 0 ? _this$cy$nodes2 : [];
	      this.originalPositions = Object.fromEntries(nodes.map(function (node) {
	        return [node.id(), _objectSpread({}, node.position())];
	      }));
	      var positions = Object.fromEntries(nodes.map(function (node) {
	        return [node.id(), _this.getGeographicPosition(node)];
	      }).filter(function (_ref) {
	        var _ref2 = slicedToArray(_ref, 2);
	            _ref2[0];
	            var position = _ref2[1];

	        return !!position;
	      })); // hide nodes without position

	      var nodesWithoutPosition = nodes.filter(function (node) {
	        return !positions[node.id()];
	      });
	      nodesWithoutPosition.addClass(HIDDEN_CLASS).style('display', 'none');
	      (_this$cy6 = this.cy) === null || _this$cy6 === void 0 ? void 0 : _this$cy6.layout({
	        name: 'preset',
	        positions: positions,
	        fit: false,
	        animate: (_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.animate,
	        animationDuration: (_this$options$animati3 = (_this$options3 = this.options) === null || _this$options3 === void 0 ? void 0 : _this$options3.animationDuration) !== null && _this$options$animati3 !== void 0 ? _this$options$animati3 : DEFAULT_ANIMATION_DURATION,
	        animationEasing: 'ease-out-cubic'
	      }).run();
	    }
	    /**
	     * @private
	     * @param {cytoscape.NodeCollection | undefined} nodes
	     */

	  }, {
	    key: "updateGeographicPositions",
	    value: function updateGeographicPositions() {
	      var _this$cy$nodes3,
	          _this$cy7,
	          _this2 = this;

	      var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_this$cy$nodes3 = (_this$cy7 = this.cy) === null || _this$cy7 === void 0 ? void 0 : _this$cy7.nodes()) !== null && _this$cy$nodes3 !== void 0 ? _this$cy$nodes3 : [];
	      if (!this.updateLayout) return;

	      var updatePositions = function updatePositions() {
	        var _this2$cy$nodes, _this2$cy, _this2$cy2;

	        var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_this2$cy$nodes = (_this2$cy = _this2.cy) === null || _this2$cy === void 0 ? void 0 : _this2$cy.nodes()) !== null && _this2$cy$nodes !== void 0 ? _this2$cy$nodes : [];
	        var positions = Object.fromEntries(nodes.map(function (node) {
	          return [node.id(), _this2.getGeographicPosition(node)];
	        }).filter(function (_ref3) {
	          var _ref4 = slicedToArray(_ref3, 2);
	              _ref4[0];
	              var position = _ref4[1];

	          return !!position;
	        })); // update only positions which have changed, for cytoscape-edgehandles compatibility

	        var currentPositions = Object.fromEntries(nodes.map(function (node) {
	          return [node.id(), _objectSpread({}, node.position())];
	        }));
	        var updatedPositions = getUpdatedPositionsMemo(currentPositions, positions); // hide nodes without position

	        var nodesWithoutPosition = nodes.filter(function (node) {
	          return !positions[node.id()];
	        });
	        nodesWithoutPosition.addClass(HIDDEN_CLASS).style('display', 'none'); // for (const k in updatedPositions) {
	        //   const prev = currentPositions[k];
	        //   const next = updatedPositions[k];
	        //   if (prev && next) {
	        //     this.cy?.getElementById(k)?.position(next);
	        //   }
	        // }

	        (_this2$cy2 = _this2.cy) === null || _this2$cy2 === void 0 ? void 0 : _this2$cy2.layout({
	          name: 'preset',
	          positions: updatedPositions,
	          fit: false
	        }).run();
	      };

	      updatePositions(nodes);
	    }
	    /**
	     * @private
	     */

	  }, {
	    key: "disableGeographicPositions",
	    value: function disableGeographicPositions() {
	      var _this$cy$nodes4, _this$cy8, _this$cy9, _this$options4, _this$options$animati4, _this$options5;

	      if (!this.updateLayout) return;
	      var nodes = (_this$cy$nodes4 = (_this$cy8 = this.cy) === null || _this$cy8 === void 0 ? void 0 : _this$cy8.nodes()) !== null && _this$cy$nodes4 !== void 0 ? _this$cy$nodes4 : [];
	      (_this$cy9 = this.cy) === null || _this$cy9 === void 0 ? void 0 : _this$cy9.layout({
	        name: 'preset',
	        positions: this.originalPositions,
	        fit: false,
	        animate: (_this$options4 = this.options) === null || _this$options4 === void 0 ? void 0 : _this$options4.animate,
	        animationDuration: (_this$options$animati4 = (_this$options5 = this.options) === null || _this$options5 === void 0 ? void 0 : _this$options5.animationDuration) !== null && _this$options$animati4 !== void 0 ? _this$options$animati4 : DEFAULT_ANIMATION_DURATION,
	        animationEasing: 'ease-in-cubic',
	        stop: function stop() {
	          // show nodes without position
	          var nodesWithoutPosition = nodes.filter(function (node) {
	            return node.hasClass(HIDDEN_CLASS);
	          });
	          nodesWithoutPosition.removeClass(HIDDEN_CLASS).style('display', null);
	        }
	      }).run();
	      this.originalPositions = undefined;
	    }
	    /**
	     * @private
	     * @param {MouseEvent} event
	     */

	  }, {
	    key: "onGraphContainerMouseDown",
	    value: function onGraphContainerMouseDown(event) {
	      var _this$cy10,
	          _this3 = this;

	      // @ts-ignore
	      var renderer = (_this$cy10 = this.cy) === null || _this$cy10 === void 0 ? void 0 : _this$cy10.renderer();

	      if (event.buttons === 1 && !isMultSelKeyDown(event) && !renderer.hoverData.down) {
	        // @ts-ignore,
	        if (this.cy) this.cy.renderer().hoverData.dragging = true; // cytoscape-lasso compatibility

	        this.dispatchMapEvent(event);
	        document.addEventListener('mouseup', function () {
	          if (!_this3.panning) {
	            return;
	          }

	          _this3.panning = false; // @ts-ignore, prevent unselecting in Cytoscape mouseup

	          if (_this3.cy) _this3.cy.renderer().hoverData.dragged = true;
	        }, {
	          once: true
	        });
	      }
	    }
	    /**
	     * @private
	     * @param {MouseEvent} event
	     */

	  }, {
	    key: "onGraphContainerMouseMove",
	    value: function onGraphContainerMouseMove(event) {
	      var _this$cy11;

	      // @ts-ignore
	      var renderer = (_this$cy11 = this.cy) === null || _this$cy11 === void 0 ? void 0 : _this$cy11.renderer();

	      if (event.buttons === 1 && !isMultSelKeyDown(event) && !renderer.hoverData.down) {
	        this.panning = true;
	        this.dispatchMapEvent(event);
	      }
	    }
	    /**
	     * @private
	     * @param {MouseEvent} event
	     */

	  }, {
	    key: "onGraphContainerWheel",
	    value: function onGraphContainerWheel(event) {
	      event.preventDefault();
	      this.dispatchMapEvent(event);
	    }
	    /**
	     * @private
	     */

	  }, {
	    key: "onMapMove",
	    value: function onMapMove() {
	      this.updateGeographicPositions();
	    }
	    /**
	     * @private
	     * @param {cytoscape.EventObject} event
	     */

	  }, {
	    key: "onGraphAdd",
	    value: function onGraphAdd(event) {
	      var _this$cy12;

	      if (!event.target.isNode()) {
	        return;
	      }

	      var node = event.target;
	      if (!this.originalPositions) this.originalPositions = {};
	      this.originalPositions[node.id()] = _objectSpread({}, node.position());
	      var nodes = (_this$cy12 = this.cy) === null || _this$cy12 === void 0 ? void 0 : _this$cy12.collection().merge(node);
	      this.updateGeographicPositions(nodes);
	    }
	    /**
	     * @private
	     */

	  }, {
	    key: "onGraphResize",
	    value: function onGraphResize() {
	      var _this$map4;

	      (_this$map4 = this.map) === null || _this$map4 === void 0 ? void 0 : _this$map4.invalidateSize(false);
	    }
	    /**
	     * @private
	     * @param {cytoscape.EventObject} event
	     */

	  }, {
	    key: "onGraphDragFree",
	    value: function onGraphDragFree(event) {
	      var _this$options6, _this$cy13;

	      var node = event.target;

	      if ((_this$options6 = this.options) !== null && _this$options6 !== void 0 && _this$options6.setPosition) {
	        var _this$map5;

	        var _node$position = node.position(),
	            x = _node$position.x,
	            y = _node$position.y;

	        var position = [x, y];
	        var lngLat = (_this$map5 = this.map) === null || _this$map5 === void 0 ? void 0 : _this$map5.containerPointToLatLng(position);
	        if (lngLat) this.options.setPosition(node, lngLat);
	      }

	      var nodes = (_this$cy13 = this.cy) === null || _this$cy13 === void 0 ? void 0 : _this$cy13.collection().merge(node);
	      this.updateGeographicPositions(nodes);
	    }
	    /**
	     * @private
	     */
	    // private onZoomStart() {
	    //   this.zooming = true;
	    //   this.panZoomAnimationFrame();
	    // }

	    /**
	     * @private
	     */
	    // private panZoomAnimationFrame() {
	    //   if (!this.zooming) {
	    //     return window.cancelAnimationFrame(this.requestAnimationId);
	    //   }
	    //   this.updateGeographicPositions()
	    //   this.requestAnimationId = window.requestAnimationFrame(this.panZoomAnimationFrameBound);
	    // }

	    /**
	     * @private
	     */
	    // private onZoomEnd() {
	    //   window.cancelAnimationFrame(this.requestAnimationId);
	    //   this.zooming = false;
	    // }

	    /**
	     * @private
	     * @param {MouseEvent} event
	     */

	  }, {
	    key: "dispatchMapEvent",
	    value: function dispatchMapEvent(event) {
	      var _this$mapContainer2, _this$map6;

	      if (event.target === this.mapContainer || // @ts-ignore
	      (_this$mapContainer2 = this.mapContainer) !== null && _this$mapContainer2 !== void 0 && _this$mapContainer2.contains(event.target)) {
	        return;
	      } // @ts-ignore


	      var clonedEvent = new event.constructor(event.type, event);
	      (_this$map6 = this.map) === null || _this$map6 === void 0 ? void 0 : _this$map6.getContainer().dispatchEvent(clonedEvent);
	    }
	    /**
	     * @private
	     * @param {cytoscape.NodeSingular} node
	     * @return {L.LatLng | undefined}
	     */

	  }, {
	    key: "getNodeLngLat",
	    value: function getNodeLngLat(node) {
	      var _this$options7, _this$options8;

	      if (typeof ((_this$options7 = this.options) === null || _this$options7 === void 0 ? void 0 : _this$options7.getPosition) !== 'function') return;
	      var lngLatLike = (_this$options8 = this.options) === null || _this$options8 === void 0 ? void 0 : _this$options8.getPosition(node);

	      if (!lngLatLike) {
	        return;
	      }

	      var lngLat;

	      try {
	        lngLat = L__default["default"].latLng(lngLatLike);
	      } catch (e) {
	        return;
	      }

	      return lngLat;
	    }
	    /**
	     * @private
	     * @param {cytoscape.NodeCollection} nodes
	     * @return {L.LatLngBounds}
	     */

	  }, {
	    key: "getNodeLngLatBounds",
	    value: function getNodeLngLatBounds() {
	      var _this$cy$nodes5,
	          _this$cy14,
	          _this4 = this;

	      var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (_this$cy$nodes5 = (_this$cy14 = this.cy) === null || _this$cy14 === void 0 ? void 0 : _this$cy14.nodes()) !== null && _this$cy$nodes5 !== void 0 ? _this$cy$nodes5 : [];
	      return nodes.reduce(function (bounds, node) {
	        var lngLat = _this4.getNodeLngLat(node);

	        if (!lngLat) {
	          return bounds;
	        }

	        return bounds.extend(lngLat);
	      }, L__default["default"].latLngBounds([]));
	    }
	    /**
	     * @private
	     * @param {cytoscape.NodeSingular} node
	     * @return {cytoscape.Position | undefined}
	     */

	  }, {
	    key: "getGeographicPosition",
	    value: function getGeographicPosition(node) {
	      var _this$map7;

	      var lngLat = this.getNodeLngLat(node);

	      if (!lngLat) {
	        return;
	      }

	      return (_this$map7 = this.map) === null || _this$map7 === void 0 ? void 0 : _this$map7.latLngToContainerPoint(lngLat);
	    }
	  }]);

	  return MapHandler;
	}();

	function register(cytoscape) {
	  if (!cytoscape) {
	    return;
	  }

	  cytoscape('core', 'L', function (mapConfig, config) {
	    return new MapHandler( // @ts-ignore
	    this, mapConfig, config);
	  });
	}

	if (typeof window.cytoscape !== 'undefined') {
	  register(window.cytoscape);
	}

	return register;

}));
//# sourceMappingURL=cytoscape-leaflet.js.map

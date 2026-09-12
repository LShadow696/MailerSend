import { i as __require, t as __commonJSMin } from "../_runtime.mjs";
import { t as require_src } from "./gaxios.mjs";
import { a as require_type } from "./call-bind-apply-helpers+[...].mjs";
import { n as require_get_intrinsic, r as require_es_define_property, t as require_call_bound } from "./call-bound+[...].mjs";
//#region node_modules/object-inspect/util.inspect.js
var require_util_inspect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = __require("util").inspect;
}));
//#endregion
//#region node_modules/object-inspect/index.js
var require_object_inspect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasMap = typeof Map === "function" && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === "function" && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var weakMapHas = typeof WeakMap === "function" && WeakMap.prototype ? WeakMap.prototype.has : null;
	var weakSetHas = typeof WeakSet === "function" && WeakSet.prototype ? WeakSet.prototype.has : null;
	var weakRefDeref = typeof WeakRef === "function" && WeakRef.prototype ? WeakRef.prototype.deref : null;
	var booleanValueOf = Boolean.prototype.valueOf;
	var objectToString = Object.prototype.toString;
	var functionToString = Function.prototype.toString;
	var $match = String.prototype.match;
	var $slice = String.prototype.slice;
	var $replace = String.prototype.replace;
	var $toUpperCase = String.prototype.toUpperCase;
	var $toLowerCase = String.prototype.toLowerCase;
	var $test = RegExp.prototype.test;
	var $concat = Array.prototype.concat;
	var $join = Array.prototype.join;
	var $arrSlice = Array.prototype.slice;
	var $floor = Math.floor;
	var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
	var gOPS = Object.getOwnPropertySymbols;
	var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
	var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
	var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
		return O.__proto__;
	} : null);
	function addNumericSeparator(num, str) {
		if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) return str;
		var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
		if (typeof num === "number") {
			var int = num < 0 ? -$floor(-num) : $floor(num);
			if (int !== num) {
				var intStr = String(int);
				var dec = $slice.call(str, intStr.length + 1);
				return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
			}
		}
		return $replace.call(str, sepRegex, "$&_");
	}
	var utilInspect = require_util_inspect();
	var inspectCustom = utilInspect.custom;
	var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
	var quotes = {
		__proto__: null,
		"double": "\"",
		single: "'"
	};
	var quoteREs = {
		__proto__: null,
		"double": /(["\\])/g,
		single: /(['\\])/g
	};
	module.exports = function inspect_(obj, options, depth, seen) {
		var opts = options || {};
		if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) throw new TypeError("option \"quoteStyle\" must be \"single\" or \"double\"");
		if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) throw new TypeError("option \"maxStringLength\", if provided, must be a positive integer, Infinity, or `null`");
		var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
		if (typeof customInspect !== "boolean" && customInspect !== "symbol") throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
		if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) throw new TypeError("option \"indent\" must be \"\\t\", an integer > 0, or `null`");
		if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") throw new TypeError("option \"numericSeparator\", if provided, must be `true` or `false`");
		var numericSeparator = opts.numericSeparator;
		if (typeof obj === "undefined") return "undefined";
		if (obj === null) return "null";
		if (typeof obj === "boolean") return obj ? "true" : "false";
		if (typeof obj === "string") return inspectString(obj, opts);
		if (typeof obj === "number") {
			if (obj === 0) return Infinity / obj > 0 ? "0" : "-0";
			var str = String(obj);
			return numericSeparator ? addNumericSeparator(obj, str) : str;
		}
		if (typeof obj === "bigint") {
			var bigIntStr = String(obj) + "n";
			return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
		}
		var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
		if (typeof depth === "undefined") depth = 0;
		if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") return isArray(obj) ? "[Array]" : "[Object]";
		var indent = getIndent(opts, depth);
		if (typeof seen === "undefined") seen = [];
		else if (indexOf(seen, obj) >= 0) return "[Circular]";
		function inspect(value, from, noIndent) {
			if (from) {
				seen = $arrSlice.call(seen);
				seen.push(from);
			}
			if (noIndent) {
				var newOpts = { depth: opts.depth };
				if (has(opts, "quoteStyle")) newOpts.quoteStyle = opts.quoteStyle;
				return inspect_(value, newOpts, depth + 1, seen);
			}
			return inspect_(value, opts, depth + 1, seen);
		}
		if (typeof obj === "function" && !isRegExp(obj)) {
			var name = nameOf(obj);
			var keys = arrObjKeys(obj, inspect);
			return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
		}
		if (isSymbol(obj)) {
			var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
			return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
		}
		if (isElement(obj)) {
			var s = "<" + $toLowerCase.call(String(obj.nodeName));
			var attrs = obj.attributes || [];
			for (var i = 0; i < attrs.length; i++) s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
			s += ">";
			if (obj.childNodes && obj.childNodes.length) s += "...";
			s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
			return s;
		}
		if (isArray(obj)) {
			if (obj.length === 0) return "[]";
			var xs = arrObjKeys(obj, inspect);
			if (indent && !singleLineValues(xs)) return "[" + indentedJoin(xs, indent) + "]";
			return "[ " + $join.call(xs, ", ") + " ]";
		}
		if (isError(obj)) {
			var parts = arrObjKeys(obj, inspect);
			if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
			if (parts.length === 0) return "[" + String(obj) + "]";
			return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
		}
		if (typeof obj === "object" && customInspect) {
			if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) return utilInspect(obj, { depth: maxDepth - depth });
			else if (customInspect !== "symbol" && typeof obj.inspect === "function") return obj.inspect();
		}
		if (isMap(obj)) {
			var mapParts = [];
			if (mapForEach) mapForEach.call(obj, function(value, key) {
				mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
			});
			return collectionOf("Map", mapSize.call(obj), mapParts, indent);
		}
		if (isSet(obj)) {
			var setParts = [];
			if (setForEach) setForEach.call(obj, function(value) {
				setParts.push(inspect(value, obj));
			});
			return collectionOf("Set", setSize.call(obj), setParts, indent);
		}
		if (isWeakMap(obj)) return weakCollectionOf("WeakMap");
		if (isWeakSet(obj)) return weakCollectionOf("WeakSet");
		if (isWeakRef(obj)) return weakCollectionOf("WeakRef");
		if (isNumber(obj)) return markBoxed(inspect(Number(obj)));
		if (isBigInt(obj)) return markBoxed(inspect(bigIntValueOf.call(obj)));
		if (isBoolean(obj)) return markBoxed(booleanValueOf.call(obj));
		if (isString(obj)) return markBoxed(inspect(String(obj)));
		if (typeof window !== "undefined" && obj === window) return "{ [object Window] }";
		if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) return "{ [object globalThis] }";
		if (!isDate(obj) && !isRegExp(obj)) {
			var ys = arrObjKeys(obj, inspect);
			var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
			var protoTag = obj instanceof Object ? "" : "null prototype";
			var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
			var tag = (isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "") + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
			if (ys.length === 0) return tag + "{}";
			if (indent) return tag + "{" + indentedJoin(ys, indent) + "}";
			return tag + "{ " + $join.call(ys, ", ") + " }";
		}
		return String(obj);
	};
	function wrapQuotes(s, defaultStyle, opts) {
		var quoteChar = quotes[opts.quoteStyle || defaultStyle];
		return quoteChar + s + quoteChar;
	}
	function quote(s) {
		return $replace.call(String(s), /"/g, "&quot;");
	}
	function canTrustToString(obj) {
		return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
	}
	function isArray(obj) {
		return toStr(obj) === "[object Array]" && canTrustToString(obj);
	}
	function isDate(obj) {
		return toStr(obj) === "[object Date]" && canTrustToString(obj);
	}
	function isRegExp(obj) {
		return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
	}
	function isError(obj) {
		return toStr(obj) === "[object Error]" && canTrustToString(obj);
	}
	function isString(obj) {
		return toStr(obj) === "[object String]" && canTrustToString(obj);
	}
	function isNumber(obj) {
		return toStr(obj) === "[object Number]" && canTrustToString(obj);
	}
	function isBoolean(obj) {
		return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
	}
	function isSymbol(obj) {
		if (hasShammedSymbols) return obj && typeof obj === "object" && obj instanceof Symbol;
		if (typeof obj === "symbol") return true;
		if (!obj || typeof obj !== "object" || !symToString) return false;
		try {
			symToString.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	function isBigInt(obj) {
		if (!obj || typeof obj !== "object" || !bigIntValueOf) return false;
		try {
			bigIntValueOf.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	var hasOwn = Object.prototype.hasOwnProperty || function(key) {
		return key in this;
	};
	function has(obj, key) {
		return hasOwn.call(obj, key);
	}
	function toStr(obj) {
		return objectToString.call(obj);
	}
	function nameOf(f) {
		if (f.name) return f.name;
		var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
		if (m) return m[1];
		return null;
	}
	function indexOf(xs, x) {
		if (xs.indexOf) return xs.indexOf(x);
		for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;
		return -1;
	}
	function isMap(x) {
		if (!mapSize || !x || typeof x !== "object") return false;
		try {
			mapSize.call(x);
			try {
				setSize.call(x);
			} catch (s) {
				return true;
			}
			return x instanceof Map;
		} catch (e) {}
		return false;
	}
	function isWeakMap(x) {
		if (!weakMapHas || !x || typeof x !== "object") return false;
		try {
			weakMapHas.call(x, weakMapHas);
			try {
				weakSetHas.call(x, weakSetHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakMap;
		} catch (e) {}
		return false;
	}
	function isWeakRef(x) {
		if (!weakRefDeref || !x || typeof x !== "object") return false;
		try {
			weakRefDeref.call(x);
			return true;
		} catch (e) {}
		return false;
	}
	function isSet(x) {
		if (!setSize || !x || typeof x !== "object") return false;
		try {
			setSize.call(x);
			try {
				mapSize.call(x);
			} catch (m) {
				return true;
			}
			return x instanceof Set;
		} catch (e) {}
		return false;
	}
	function isWeakSet(x) {
		if (!weakSetHas || !x || typeof x !== "object") return false;
		try {
			weakSetHas.call(x, weakSetHas);
			try {
				weakMapHas.call(x, weakMapHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakSet;
		} catch (e) {}
		return false;
	}
	function isElement(x) {
		if (!x || typeof x !== "object") return false;
		if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) return true;
		return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
	}
	function inspectString(str, opts) {
		if (str.length > opts.maxStringLength) {
			var remaining = str.length - opts.maxStringLength;
			var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
			return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
		}
		var quoteRE = quoteREs[opts.quoteStyle || "single"];
		quoteRE.lastIndex = 0;
		return wrapQuotes($replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte), "single", opts);
	}
	function lowbyte(c) {
		var n = c.charCodeAt(0);
		var x = {
			8: "b",
			9: "t",
			10: "n",
			12: "f",
			13: "r"
		}[n];
		if (x) return "\\" + x;
		return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
	}
	function markBoxed(str) {
		return "Object(" + str + ")";
	}
	function weakCollectionOf(type) {
		return type + " { ? }";
	}
	function collectionOf(type, size, entries, indent) {
		var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
		return type + " (" + size + ") {" + joinedEntries + "}";
	}
	function singleLineValues(xs) {
		for (var i = 0; i < xs.length; i++) if (indexOf(xs[i], "\n") >= 0) return false;
		return true;
	}
	function getIndent(opts, depth) {
		var baseIndent;
		if (opts.indent === "	") baseIndent = "	";
		else if (typeof opts.indent === "number" && opts.indent > 0) baseIndent = $join.call(Array(opts.indent + 1), " ");
		else return null;
		return {
			base: baseIndent,
			prev: $join.call(Array(depth + 1), baseIndent)
		};
	}
	function indentedJoin(xs, indent) {
		if (xs.length === 0) return "";
		var lineJoiner = "\n" + indent.prev + indent.base;
		return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
	}
	function arrObjKeys(obj, inspect) {
		var isArr = isArray(obj);
		var xs = [];
		if (isArr) {
			xs.length = obj.length;
			for (var i = 0; i < obj.length; i++) xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
		}
		var syms = typeof gOPS === "function" ? gOPS(obj) : [];
		var symMap;
		if (hasShammedSymbols) {
			symMap = {};
			for (var k = 0; k < syms.length; k++) symMap["$" + syms[k]] = syms[k];
		}
		for (var key in obj) {
			if (!has(obj, key)) continue;
			if (isArr && String(Number(key)) === key && key < obj.length) continue;
			if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) continue;
			else if ($test.call(/[^\w$]/, key)) xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
			else xs.push(key + ": " + inspect(obj[key], obj));
		}
		if (typeof gOPS === "function") {
			for (var j = 0; j < syms.length; j++) if (isEnumerable.call(obj, syms[j])) xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
		}
		return xs;
	}
}));
//#endregion
//#region node_modules/side-channel-list/index.js
var require_side_channel_list = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var inspect = require_object_inspect();
	var $TypeError = require_type();
	/** @type {import('./list.d.ts').listGetNode} */
	var listGetNode = function(list, key, isDelete) {
		/** @type {typeof list | NonNullable<(typeof list)['next']>} */
		var prev = list;
		/** @type {(typeof list)['next']} */
		var curr;
		for (; (curr = prev.next) != null; prev = curr) if (curr.key === key) {
			prev.next = curr.next;
			if (!isDelete) {
				curr.next = list.next;
				list.next = curr;
			}
			return curr;
		}
	};
	/** @type {import('./list.d.ts').listGet} */
	var listGet = function(objects, key) {
		if (!objects) return;
		var node = listGetNode(objects, key);
		return node && node.value;
	};
	/** @type {import('./list.d.ts').listSet} */
	var listSet = function(objects, key, value) {
		var node = listGetNode(objects, key);
		if (node) node.value = value;
		else objects.next = {
			key,
			next: objects.next,
			value
		};
	};
	/** @type {import('./list.d.ts').listHas} */
	var listHas = function(objects, key) {
		if (!objects) return false;
		return !!listGetNode(objects, key);
	};
	/** @type {import('./list.d.ts').listDelete} */
	var listDelete = function(objects, key) {
		if (objects) return listGetNode(objects, key, true);
	};
	/** @type {import('.')} */
	module.exports = function getSideChannelList() {
		/** @typedef {ReturnType<typeof getSideChannelList>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */
		/** @type {import('./list.d.ts').RootNode<V, K> | undefined} */ var $o;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				var deletedNode = listDelete($o, key);
				if (deletedNode && $o && !$o.next) $o = void 0;
				return !!deletedNode;
			},
			get: function(key) {
				return listGet($o, key);
			},
			has: function(key) {
				return listHas($o, key);
			},
			set: function(key, value) {
				if (!$o) $o = { next: void 0 };
				listSet($o, key, value);
			}
		};
		return channel;
	};
}));
//#endregion
//#region node_modules/side-channel-map/index.js
var require_side_channel_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBound = require_call_bound();
	var inspect = require_object_inspect();
	var $TypeError = require_type();
	var $Map = GetIntrinsic("%Map%", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => V} */
	var $mapGet = callBound("Map.prototype.get", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K, value: V) => void} */
	var $mapSet = callBound("Map.prototype.set", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
	var $mapHas = callBound("Map.prototype.has", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
	var $mapDelete = callBound("Map.prototype.delete", true);
	/** @type {<K, V>(thisArg: Map<K, V>) => number} */
	var $mapSize = callBound("Map.prototype.size", true);
	/** @type {import('.')} */
	module.exports = !!$Map && function getSideChannelMap() {
		/** @typedef {ReturnType<typeof getSideChannelMap>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */
		/** @type {Map<K, V> | undefined} */ var $m;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				if ($m) {
					var result = $mapDelete($m, key);
					if ($mapSize($m) === 0) $m = void 0;
					return result;
				}
				return false;
			},
			get: function(key) {
				if ($m) return $mapGet($m, key);
			},
			has: function(key) {
				if ($m) return $mapHas($m, key);
				return false;
			},
			set: function(key, value) {
				if (!$m) $m = new $Map();
				$mapSet($m, key, value);
			}
		};
		return channel;
	};
}));
//#endregion
//#region node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBound = require_call_bound();
	var inspect = require_object_inspect();
	var getSideChannelMap = require_side_channel_map();
	var $TypeError = require_type();
	var $WeakMap = GetIntrinsic("%WeakMap%", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => V} */
	var $weakMapGet = callBound("WeakMap.prototype.get", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K, value: V) => void} */
	var $weakMapSet = callBound("WeakMap.prototype.set", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
	var $weakMapHas = callBound("WeakMap.prototype.has", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
	var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
	/** @type {import('.')} */
	module.exports = $WeakMap ? function getSideChannelWeakMap() {
		/** @typedef {ReturnType<typeof getSideChannelWeakMap>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */
		/** @type {WeakMap<K & object, V> | undefined} */ var $wm;
		/** @type {Channel | undefined} */ var $m;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if ($wm) return $weakMapDelete($wm, key);
				} else if (getSideChannelMap) {
					if ($m) return $m["delete"](key);
				}
				return false;
			},
			get: function(key) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if ($wm) return $weakMapGet($wm, key);
				}
				return $m && $m.get(key);
			},
			has: function(key) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if ($wm) return $weakMapHas($wm, key);
				}
				return !!$m && $m.has(key);
			},
			set: function(key, value) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if (!$wm) $wm = new $WeakMap();
					$weakMapSet($wm, key, value);
				} else if (getSideChannelMap) {
					if (!$m) $m = getSideChannelMap();
					/** @type {NonNullable<typeof $m>} */ $m.set(key, value);
				}
			}
		};
		return channel;
	} : getSideChannelMap;
}));
//#endregion
//#region node_modules/side-channel/index.js
var require_side_channel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var inspect = require_object_inspect();
	var getSideChannelList = require_side_channel_list();
	var getSideChannelMap = require_side_channel_map();
	var makeChannel = require_side_channel_weakmap() || getSideChannelMap || getSideChannelList;
	/** @type {import('.')} */
	module.exports = function getSideChannel() {
		/** @typedef {ReturnType<typeof getSideChannel>} Channel */
		/** @type {Channel | undefined} */ var $channelData;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + (key && Object(key) === key ? "the given object key" : inspect(key)));
			},
			"delete": function(key) {
				return !!$channelData && $channelData["delete"](key);
			},
			get: function(key) {
				return $channelData && $channelData.get(key);
			},
			has: function(key) {
				return !!$channelData && $channelData.has(key);
			},
			set: function(key, value) {
				if (!$channelData) $channelData = makeChannel();
				$channelData.set(key, value);
			}
		};
		return channel;
	};
}));
//#endregion
//#region node_modules/qs/lib/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;
	var Format = {
		RFC1738: "RFC1738",
		RFC3986: "RFC3986"
	};
	module.exports = {
		"default": Format.RFC3986,
		formatters: {
			RFC1738: function(value) {
				return replace.call(value, percentTwenties, "+");
			},
			RFC3986: function(value) {
				return String(value);
			}
		},
		RFC1738: Format.RFC1738,
		RFC3986: Format.RFC3986
	};
}));
//#endregion
//#region node_modules/qs/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var formats = require_formats();
	var getSideChannel = require_side_channel();
	var defineProperty = require_es_define_property();
	var has = Object.prototype.hasOwnProperty;
	var isArray = Array.isArray;
	var overflowChannel = getSideChannel();
	var markOverflow = function markOverflow(obj, maxIndex) {
		overflowChannel.set(obj, maxIndex);
		return obj;
	};
	var isOverflow = function isOverflow(obj) {
		return overflowChannel.has(obj);
	};
	var getMaxIndex = function getMaxIndex(obj) {
		return overflowChannel.get(obj);
	};
	var setMaxIndex = function setMaxIndex(obj, maxIndex) {
		overflowChannel.set(obj, maxIndex);
	};
	var hexTable = function() {
		var array = [];
		for (var i = 0; i < 256; ++i) array[array.length] = "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase();
		return array;
	}();
	var compactQueue = function compactQueue(queue) {
		while (queue.length > 1) {
			var item = queue.pop();
			var obj = item.obj[item.prop];
			if (isArray(obj)) {
				var compacted = [];
				for (var j = 0; j < obj.length; ++j) if (typeof obj[j] !== "undefined") compacted[compacted.length] = obj[j];
				item.obj[item.prop] = compacted;
			}
		}
	};
	var arrayToObject = function arrayToObject(source, options) {
		var obj = options && options.plainObjects ? { __proto__: null } : {};
		for (var i = 0; i < source.length; ++i) if (typeof source[i] !== "undefined") obj[i] = source[i];
		return obj;
	};
	var setProperty = function setProperty(obj, key, value) {
		if (key === "__proto__" && defineProperty) defineProperty(obj, key, {
			configurable: true,
			enumerable: true,
			value,
			writable: true
		});
		else obj[key] = value;
	};
	var merge = function merge(target, source, options) {
		if (!source) return target;
		if (typeof source !== "object" && typeof source !== "function") {
			if (isArray(target)) {
				var nextIndex = target.length;
				if (options && typeof options.arrayLimit === "number" && nextIndex >= options.arrayLimit) {
					if (options.throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
					return markOverflow(arrayToObject(target.concat(source), options), nextIndex);
				}
				target[nextIndex] = source;
			} else if (target && typeof target === "object") {
				if (isOverflow(target)) {
					var newIndex = getMaxIndex(target) + 1;
					target[newIndex] = source;
					setMaxIndex(target, newIndex);
				} else if (options && options.strictMerge) return [target, source];
				else if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) target[source] = true;
			} else return [target, source];
			return target;
		}
		if (!target || typeof target !== "object") {
			if (isOverflow(source)) {
				var sourceKeys = Object.keys(source);
				var result = options && options.plainObjects ? {
					__proto__: null,
					0: target
				} : { 0: target };
				for (var m = 0; m < sourceKeys.length; m++) {
					var oldKey = parseInt(sourceKeys[m], 10);
					result[oldKey + 1] = source[sourceKeys[m]];
				}
				return markOverflow(result, getMaxIndex(source) + 1);
			}
			var combined = [target].concat(source);
			if (options && typeof options.arrayLimit === "number" && combined.length > options.arrayLimit) {
				if (options.throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				return markOverflow(arrayToObject(combined, options), combined.length - 1);
			}
			return combined;
		}
		var mergeTarget = target;
		if (isArray(target) && !isArray(source)) mergeTarget = arrayToObject(target, options);
		if (isArray(target) && isArray(source)) {
			source.forEach(function(item, i) {
				if (has.call(target, i)) {
					var targetItem = target[i];
					if (targetItem && typeof targetItem === "object" && item && typeof item === "object") target[i] = merge(targetItem, item, options);
					else target[target.length] = item;
				} else target[i] = item;
			});
			if (options && typeof options.arrayLimit === "number" && target.length > options.arrayLimit) {
				if (options.throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				return markOverflow(arrayToObject(target, options), target.length - 1);
			}
			return target;
		}
		return Object.keys(source).reduce(function(acc, key) {
			var value = source[key];
			if (has.call(acc, key)) setProperty(acc, key, merge(acc[key], value, options));
			else setProperty(acc, key, value);
			if (isOverflow(source) && !isOverflow(acc)) markOverflow(acc, getMaxIndex(source));
			if (isOverflow(acc)) {
				var keyNum = parseInt(key, 10);
				if (String(keyNum) === key && keyNum >= 0 && keyNum > getMaxIndex(acc)) setMaxIndex(acc, keyNum);
			}
			return acc;
		}, mergeTarget);
	};
	var assign = function assignSingleSource(target, source) {
		return Object.keys(source).reduce(function(acc, key) {
			setProperty(acc, key, source[key]);
			return acc;
		}, target);
	};
	var decode = function(str, defaultDecoder, charset) {
		var strWithoutPlus = str.replace(/\+/g, " ");
		if (charset === "iso-8859-1") return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
		try {
			return decodeURIComponent(strWithoutPlus);
		} catch (e) {
			return strWithoutPlus;
		}
	};
	var limit = 1024;
	module.exports = {
		arrayToObject,
		assign,
		combine: function combine(a, b, arrayLimit, plainObjects, throwOnLimitExceeded) {
			if (isOverflow(a)) {
				if (throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				var bValues = isArray(b) ? b : [b];
				var newIndex = getMaxIndex(a);
				for (var i = 0; i < bValues.length; ++i) {
					newIndex += 1;
					a[newIndex] = bValues[i];
				}
				setMaxIndex(a, newIndex);
				return a;
			}
			var result = [].concat(a, b);
			if (result.length > arrayLimit) {
				if (throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				return markOverflow(arrayToObject(result, { plainObjects }), result.length - 1);
			}
			return result;
		},
		compact: function compact(value) {
			var queue = [{
				obj: { o: value },
				prop: "o"
			}];
			var refs = getSideChannel();
			for (var i = 0; i < queue.length; ++i) {
				var item = queue[i];
				var obj = item.obj[item.prop];
				var keys = Object.keys(obj);
				for (var j = 0; j < keys.length; ++j) {
					var key = keys[j];
					var val = obj[key];
					if (typeof val === "object" && val !== null && !refs.has(val)) {
						queue[queue.length] = {
							obj,
							prop: key
						};
						refs.set(val, true);
					}
				}
			}
			compactQueue(queue);
			return value;
		},
		decode,
		encode: function encode(str, defaultEncoder, charset, kind, format) {
			if (str.length === 0) return str;
			var string = str;
			if (typeof str === "symbol") string = Symbol.prototype.toString.call(str);
			else if (typeof str !== "string") string = String(str);
			if (charset === "iso-8859-1") return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
				return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
			});
			var out = "";
			for (var j = 0; j < string.length; j += limit) {
				var segment = string.length >= limit ? string.slice(j, j + limit) : string;
				if (j + limit < string.length) {
					var last = segment.charCodeAt(segment.length - 1);
					if (last >= 55296 && last <= 56319) {
						segment = segment.slice(0, -1);
						j -= 1;
					}
				}
				var arr = [];
				for (var i = 0; i < segment.length; ++i) {
					var c = segment.charCodeAt(i);
					if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
						arr[arr.length] = segment.charAt(i);
						continue;
					}
					if (c < 128) {
						arr[arr.length] = hexTable[c];
						continue;
					}
					if (c < 2048) {
						arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
						continue;
					}
					if (c < 55296 || c >= 57344) {
						arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
						continue;
					}
					i += 1;
					c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
					arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
				}
				out += arr.join("");
			}
			return out;
		},
		isBuffer: function isBuffer(obj) {
			if (!obj || typeof obj !== "object") return false;
			return !!(obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj));
		},
		isOverflow,
		isRegExp: function isRegExp(obj) {
			return Object.prototype.toString.call(obj) === "[object RegExp]";
		},
		markOverflow,
		maybeMap: function maybeMap(val, fn) {
			if (isArray(val)) {
				var mapped = [];
				for (var i = 0; i < val.length; i += 1) mapped[mapped.length] = fn(val[i]);
				return mapped;
			}
			return fn(val);
		},
		merge
	};
}));
//#endregion
//#region node_modules/qs/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getSideChannel = require_side_channel();
	var utils = require_utils();
	var formats = require_formats();
	var has = Object.prototype.hasOwnProperty;
	var arrayPrefixGenerators = {
		brackets: function brackets(prefix) {
			return prefix + "[]";
		},
		comma: "comma",
		indices: function indices(prefix, key) {
			return prefix + "[" + key + "]";
		},
		repeat: function repeat(prefix) {
			return prefix;
		}
	};
	var isArray = Array.isArray;
	var push = Array.prototype.push;
	var pushToArray = function(arr, valueOrArray) {
		push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
	};
	var toISO = Date.prototype.toISOString;
	var defaultFormat = formats["default"];
	var defaults = {
		addQueryPrefix: false,
		allowDots: false,
		allowEmptyArrays: false,
		arrayFormat: "indices",
		charset: "utf-8",
		charsetSentinel: false,
		commaRoundTrip: false,
		delimiter: "&",
		depth: Infinity,
		encode: true,
		encodeDotInKeys: false,
		encoder: utils.encode,
		encodeValuesOnly: false,
		filter: void 0,
		format: defaultFormat,
		formatter: formats.formatters[defaultFormat],
		indices: false,
		serializeDate: function serializeDate(date) {
			return toISO.call(date);
		},
		skipNulls: false,
		strictNullHandling: false
	};
	var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
		return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
	};
	var sentinel = {};
	var stringify = function stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel, depth, currentDepth) {
		var obj = object;
		if (currentDepth > depth) throw new RangeError("Input depth exceeded depth option of " + depth);
		var tmpSc = sideChannel;
		var step = 0;
		var findFlag = false;
		while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
			var pos = tmpSc.get(object);
			step += 1;
			if (typeof pos !== "undefined") {
				if (pos === step) throw new RangeError("Cyclic object value");
				else findFlag = true;
			}
			if (typeof tmpSc.get(sentinel) === "undefined") step = 0;
		}
		obj = typeof filter === "function" ? filter(prefix, obj) : obj;
		if (obj instanceof Date) obj = serializeDate(obj);
		else if (generateArrayPrefix === "comma" && isArray(obj)) obj = utils.maybeMap(obj, function(value) {
			if (value instanceof Date) return serializeDate(value);
			return value;
		});
		if (obj === null) {
			if (strictNullHandling) return formatter(encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix);
			obj = "";
		}
		if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
			if (encoder) return [formatter(encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format)) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
			return [formatter(prefix) + "=" + formatter(String(obj))];
		}
		var values = [];
		if (typeof obj === "undefined") return values;
		var objKeys;
		if (generateArrayPrefix === "comma" && isArray(obj)) {
			if (encodeValuesOnly && encoder) obj = utils.maybeMap(obj, function(v) {
				return v == null ? v : encoder(v);
			});
			objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
		} else if (isArray(filter)) objKeys = filter;
		else {
			var keys = Object.keys(obj);
			objKeys = sort ? keys.sort(sort) : keys;
		}
		var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
		var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
		if (allowEmptyArrays && isArray(obj) && obj.length === 0 && Object.keys(obj).length === 0) return adjustedPrefix + "[]";
		for (var j = 0; j < objKeys.length; ++j) {
			var key = objKeys[j];
			var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
			if (skipNulls && value === null) continue;
			var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
			var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
			sideChannel.set(object, step);
			var valueSideChannel = getSideChannel();
			valueSideChannel.set(sentinel, sideChannel);
			pushToArray(values, stringify(value, keyPrefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel, depth, currentDepth + 1));
		}
		return values;
	};
	var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
		if (!opts) return defaults;
		if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
		if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
		if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") throw new TypeError("Encoder has to be a function.");
		var charset = opts.charset || defaults.charset;
		if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
		var format = formats["default"];
		if (typeof opts.format !== "undefined") {
			if (!has.call(formats.formatters, opts.format)) throw new TypeError("Unknown format option provided.");
			format = opts.format;
		}
		var formatter = formats.formatters[format];
		var filter = defaults.filter;
		if (typeof opts.filter === "function" || isArray(opts.filter)) filter = opts.filter;
		var arrayFormat;
		if (opts.arrayFormat in arrayPrefixGenerators) arrayFormat = opts.arrayFormat;
		else if ("indices" in opts) arrayFormat = opts.indices ? "indices" : "repeat";
		else arrayFormat = defaults.arrayFormat;
		if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
		var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
		return {
			addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
			allowDots,
			allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
			arrayFormat,
			charset,
			charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
			commaRoundTrip: !!opts.commaRoundTrip,
			delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
			depth: typeof opts.depth === "number" ? opts.depth : defaults.depth,
			encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
			encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
			encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
			encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
			filter,
			format,
			formatter,
			serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
			skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
			sort: typeof opts.sort === "function" ? opts.sort : null,
			strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
		};
	};
	module.exports = function(object, opts) {
		var obj = object;
		var options = normalizeStringifyOptions(opts);
		var objKeys;
		var filter;
		if (typeof options.filter === "function") {
			filter = options.filter;
			obj = filter("", obj);
		} else if (isArray(options.filter)) {
			filter = options.filter;
			objKeys = filter;
		}
		var keys = [];
		if (typeof obj !== "object" || obj === null) return "";
		var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
		var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
		if (!objKeys) objKeys = Object.keys(obj);
		if (options.sort) objKeys.sort(options.sort);
		var sideChannel = getSideChannel();
		for (var i = 0; i < objKeys.length; ++i) {
			var key = objKeys[i];
			if (typeof key === "undefined" || key === null) continue;
			var value = obj[key];
			if (options.skipNulls && value === null) continue;
			pushToArray(keys, stringify(value, options.encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key), generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel, options.depth, 0));
		}
		var joined = keys.join(options.delimiter);
		var prefix = options.addQueryPrefix === true ? "?" : "";
		if (options.charsetSentinel) {
			if (options.charset === "iso-8859-1") prefix += "utf8=%26%2310003%3B" + options.delimiter;
			else prefix += "utf8=%E2%9C%93" + options.delimiter;
		}
		return joined.length > 0 ? prefix + joined : "";
	};
}));
//#endregion
//#region node_modules/qs/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils();
	var has = Object.prototype.hasOwnProperty;
	var isArray = Array.isArray;
	var defaults = {
		allowDots: false,
		allowEmptyArrays: false,
		allowPrototypes: false,
		allowSparse: false,
		arrayLimit: 20,
		charset: "utf-8",
		charsetSentinel: false,
		comma: false,
		decodeDotInKeys: false,
		decoder: utils.decode,
		delimiter: "&",
		depth: 5,
		duplicates: "combine",
		ignoreQueryPrefix: false,
		interpretNumericEntities: false,
		parameterLimit: 1e3,
		parseArrays: true,
		plainObjects: false,
		strictDepth: false,
		strictMerge: true,
		strictNullHandling: false,
		throwOnLimitExceeded: false
	};
	var interpretNumericEntities = function(str) {
		return str.replace(/&#(\d+);/g, function($0, numberStr) {
			return String.fromCharCode(parseInt(numberStr, 10));
		});
	};
	var parseArrayValue = function(val, options, currentArrayLength) {
		if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
			if (options.throwOnLimitExceeded) {
				var commaCount = 0;
				var commaIndex = val.indexOf(",");
				while (commaIndex > -1) {
					commaCount += 1;
					if (commaCount >= options.arrayLimit) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
					commaIndex = val.indexOf(",", commaIndex + 1);
				}
			}
			return val.split(",");
		}
		if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
		return val;
	};
	var isoSentinel = "utf8=%26%2310003%3B";
	var charsetSentinel = "utf8=%E2%9C%93";
	var parseValues = function parseQueryStringValues(str, options) {
		var obj = { __proto__: null };
		var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
		cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
		var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
		var parts = cleanStr.split(options.delimiter, options.throwOnLimitExceeded && typeof limit !== "undefined" ? limit + 1 : limit);
		if (options.throwOnLimitExceeded && typeof limit !== "undefined" && parts.length > limit) throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
		var skipIndex = -1;
		var i;
		var charset = options.charset;
		if (options.charsetSentinel) {
			for (i = 0; i < parts.length; ++i) if (parts[i].indexOf("utf8=") === 0) {
				if (parts[i] === charsetSentinel) charset = "utf-8";
				else if (parts[i] === isoSentinel) charset = "iso-8859-1";
				skipIndex = i;
				i = parts.length;
			}
		}
		for (i = 0; i < parts.length; ++i) {
			if (i === skipIndex) continue;
			var part = parts[i];
			var bracketEqualsPos = part.indexOf("]=");
			var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
			var key;
			var val;
			if (pos === -1) {
				key = options.decoder(part, defaults.decoder, charset, "key");
				val = options.strictNullHandling ? null : "";
			} else {
				key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
				if (key !== null) val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options, isArray(obj[key]) ? obj[key].length : 0), function(encodedVal) {
					return options.decoder(encodedVal, defaults.decoder, charset, "value");
				});
			}
			if (val && options.interpretNumericEntities && charset === "iso-8859-1") val = interpretNumericEntities(String(val));
			if (part.indexOf("[]=") > -1) val = isArray(val) ? [val] : val;
			if (options.comma && isArray(val) && val.length > options.arrayLimit) val = utils.combine([], val, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
			if (key !== null) {
				var existing = has.call(obj, key);
				if (existing && (options.duplicates === "combine" || part.indexOf("[]=") > -1)) obj[key] = utils.combine(obj[key], val, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
				else if (!existing || options.duplicates === "last") obj[key] = val;
			}
		}
		return obj;
	};
	var parseObject = function(chain, val, options, valuesParsed) {
		var currentArrayLength = 0;
		if (chain.length > 0 && chain[chain.length - 1] === "[]") {
			var parentKey = chain.slice(0, -1).join("");
			currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
		}
		var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
		for (var i = chain.length - 1; i >= 0; --i) {
			var obj;
			var root = chain[i];
			if (root === "[]" && options.parseArrays) {
				if (utils.isOverflow(leaf)) obj = leaf;
				else obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine([], leaf, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
			} else {
				obj = options.plainObjects ? { __proto__: null } : {};
				var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
				var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
				var index = parseInt(decodedRoot, 10);
				var isValidArrayIndex = !isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays;
				if (!options.parseArrays && decodedRoot === "") obj = { 0: leaf };
				else if (isValidArrayIndex && index < options.arrayLimit) {
					obj = [];
					obj[index] = leaf;
				} else if (isValidArrayIndex && options.throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				else if (isValidArrayIndex) {
					obj[index] = leaf;
					utils.markOverflow(obj, index);
				} else if (decodedRoot !== "__proto__") obj[decodedRoot] = leaf;
			}
			leaf = obj;
		}
		return leaf;
	};
	var splitKeyIntoSegments = function splitKeyIntoSegments(originalKey, options) {
		var key = options.allowDots ? originalKey.replace(/\.([^.[]+)/g, "[$1]") : originalKey;
		if (options.depth <= 0) {
			if (!options.plainObjects && has.call(Object.prototype, key)) {
				if (!options.allowPrototypes) return;
			}
			return [key];
		}
		var segments = [];
		var first = key.indexOf("[");
		var parent = first >= 0 ? key.slice(0, first) : key;
		if (parent) {
			if (!options.plainObjects && has.call(Object.prototype, parent)) {
				if (!options.allowPrototypes) return;
			}
			segments[segments.length] = parent;
		}
		var n = key.length;
		var open = first;
		var collected = 0;
		while (open >= 0 && collected < options.depth) {
			var level = 1;
			var i = open + 1;
			var close = -1;
			while (i < n && close < 0) {
				var cu = key.charCodeAt(i);
				if (cu === 91) level += 1;
				else if (cu === 93) {
					level -= 1;
					if (level === 0) close = i;
				}
				i += 1;
			}
			if (close < 0) {
				segments[segments.length] = "[" + key.slice(open) + "]";
				return segments;
			}
			var seg = key.slice(open, close + 1);
			var content = seg.slice(1, -1);
			if (!options.plainObjects && has.call(Object.prototype, content) && !options.allowPrototypes) return;
			segments[segments.length] = seg;
			collected += 1;
			open = key.indexOf("[", close + 1);
		}
		if (open >= 0) {
			if (options.strictDepth === true) throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
			segments[segments.length] = "[" + key.slice(open) + "]";
		}
		return segments;
	};
	var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
		if (!givenKey) return;
		var keys = splitKeyIntoSegments(givenKey, options);
		if (!keys) return;
		return parseObject(keys, val, options, valuesParsed);
	};
	var normalizeParseOptions = function normalizeParseOptions(opts) {
		if (!opts) return defaults;
		if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
		if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
		if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") throw new TypeError("Decoder has to be a function.");
		if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
		if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
		var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
		var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
		if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") throw new TypeError("The duplicates option must be either combine, first, or last");
		return {
			allowDots: typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots,
			allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
			allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
			allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
			arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
			charset,
			charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
			comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
			decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
			decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
			delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
			depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
			duplicates,
			ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
			interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
			parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
			parseArrays: opts.parseArrays !== false,
			plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
			strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
			strictMerge: typeof opts.strictMerge === "boolean" ? !!opts.strictMerge : defaults.strictMerge,
			strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
			throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
		};
	};
	module.exports = function(str, opts) {
		var options = normalizeParseOptions(opts);
		if (str === "" || str === null || typeof str === "undefined") return options.plainObjects ? { __proto__: null } : {};
		var tempObj = typeof str === "string" ? parseValues(str, options) : str;
		var obj = options.plainObjects ? { __proto__: null } : {};
		var keys = Object.keys(tempObj);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
			obj = utils.merge(obj, newObj, options);
		}
		if (options.allowSparse === true) return obj;
		return utils.compact(obj);
	};
}));
//#endregion
//#region node_modules/qs/lib/index.js
var require_lib$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var stringify = require_stringify();
	var parse = require_parse();
	module.exports = {
		formats: require_formats(),
		parse,
		stringify
	};
}));
//#endregion
//#region node_modules/mailersend/lib/services/request.service.js
var require_request_service = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RequestService = void 0;
	var gaxios_1 = require_src();
	var qs = require_lib$1();
	var RequestService = class {
		constructor(apiKey, baseUrl) {
			this.apiKey = apiKey;
			this.baseUrl = baseUrl;
		}
		normalizeHeaders(headers) {
			if (headers instanceof Headers) return Object.fromEntries(headers.entries());
			return headers;
		}
		post(path, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return this.request("POST", path, data);
			});
		}
		get(path, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return this.request("GET", path, null, queryParams);
			});
		}
		deleteReq(path, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return this.request("DELETE", path, data);
			});
		}
		put(path, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return this.request("PUT", path, data);
			});
		}
		request(method, path, body, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				try {
					const requestParams = {
						url: path.replace(/^\//, ""),
						baseURL: this.baseUrl.endsWith("/") ? this.baseUrl : this.baseUrl + "/",
						method,
						headers: { Authorization: `Bearer ${this.apiKey}` },
						responseType: "json",
						fetchImplementation: globalThis.fetch
					};
					if (body) requestParams.data = body;
					if (queryParams) requestParams.params = new URLSearchParams(qs.stringify(queryParams));
					const { headers, data, status } = yield (0, gaxios_1.request)(requestParams);
					return {
						headers: this.normalizeHeaders(headers),
						body: data,
						statusCode: status
					};
				} catch (e) {
					if (e === null || e === void 0 ? void 0 : e.response) {
						const { headers, data, status } = e.response;
						throw {
							headers: this.normalizeHeaders(headers),
							body: data,
							statusCode: status
						};
					} else throw e;
				}
			});
		}
	};
	exports.RequestService = RequestService;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Activity.module.js
var require_Activity_module$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ActivityModule = void 0;
	var request_service_1 = require_request_service();
	var ActivityModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		domain(domainId, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/activity/${domainId}`, queryParams);
			});
		}
		single(activityId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/activities/${activityId}`);
			});
		}
	};
	exports.ActivityModule = ActivityModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Analytics.module.js
var require_Analytics_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AnalyticsModule = void 0;
	var request_service_1 = require_request_service();
	var AnalyticsModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		byDate(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/analytics/date`, queryParams);
			});
		}
		byCountry(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/analytics/country`, queryParams);
			});
		}
		byUserAgent(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/analytics/ua-name`, queryParams);
			});
		}
		byReadingEnvironment(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/analytics/ua-type`, queryParams);
			});
		}
	};
	exports.AnalyticsModule = AnalyticsModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Domain.module.js
var require_Domain_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DomainModule = void 0;
	var request_service_1 = require_request_service();
	var DomainModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		create(domain) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/domains`, domain);
			});
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/domains`, queryParams);
			});
		}
		single(domainId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/domains/${domainId}`);
			});
		}
		delete(domainId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/domains/${domainId}`);
			});
		}
		updateSettings(domainId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/domains/${domainId}/settings`, data);
			});
		}
		recipients(domainId, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/domains/${domainId}/recipients`, queryParams);
			});
		}
		dns(domainId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/domains/${domainId}/dns-records`);
			});
		}
		verify(domainId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/domains/${domainId}/verify`);
			});
		}
	};
	exports.DomainModule = DomainModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Inbound.module.js
var require_Inbound_module$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InboundModule = void 0;
	var request_service_1 = require_request_service();
	var InboundModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		create(inbound) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/inbound`, inbound);
			});
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/inbound`, queryParams);
			});
		}
		single(inboundId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/inbound/${inboundId}`);
			});
		}
		delete(inboundId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/inbound/${inboundId}`);
			});
		}
		update(inboundId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/inbound/${inboundId}`, data);
			});
		}
	};
	exports.InboundModule = InboundModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Message.module.js
var require_Message_module$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MessageModule = void 0;
	var request_service_1 = require_request_service();
	var MessageModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/messages`, queryParams);
			});
		}
		single(messageId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/messages/${messageId}`);
			});
		}
	};
	exports.MessageModule = MessageModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Schedule.module.js
var require_Schedule_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ScheduleModule = void 0;
	var request_service_1 = require_request_service();
	var ScheduleModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/message-schedules`, queryParams);
			});
		}
		single(messageId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/message-schedules/${messageId}`);
			});
		}
		delete(messageId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/message-schedules/${messageId}`);
			});
		}
	};
	exports.ScheduleModule = ScheduleModule;
}));
//#endregion
//#region node_modules/mailersend/lib/models/Token.js
var require_Token = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TokenScopeType = exports.Token = void 0;
	var Token = class {
		constructor(name, scopes, domainId) {
			this.name = name;
			this.scopes = scopes;
			this.domain_id = domainId;
		}
		setName(name) {
			this.name = name;
			return this;
		}
		setDomainId(domainId) {
			this.domain_id = domainId;
			return this;
		}
		setScopes(scopes) {
			this.scopes = scopes;
			return this;
		}
	};
	exports.Token = Token;
	var TokenScopeType;
	(function(TokenScopeType) {
		TokenScopeType["EMAIL_FULL"] = "email_full";
		TokenScopeType["DOMAINS_FULL"] = "domains_full";
		TokenScopeType["ACTIVITY_READ"] = "activity_read";
		TokenScopeType["ACTIVITY_FULL"] = "activity_full";
		TokenScopeType["ANALYTICS_READ"] = "analytics_read";
		TokenScopeType["ANALYTICS_FULL"] = "analytics_full";
		TokenScopeType["TOKENS_FULL"] = "tokens_full";
		TokenScopeType["WEBHOOKS_FULL"] = "webhooks_full";
		TokenScopeType["TEMPLATES_FULL"] = "templates_full";
		TokenScopeType["SUPPRESSIONS_READ"] = "suppressions_read";
		TokenScopeType["SUPPRESSIONS_FULL"] = "suppressions_full";
		TokenScopeType["SMS_READ"] = "sms_read";
		TokenScopeType["SMS_FULL"] = "sms_full";
		TokenScopeType["EMAIL_VERIFICATION_READ"] = "email_verification_read";
		TokenScopeType["EMAIL_VERIFICATION_FULL"] = "email_verification_full";
		TokenScopeType["INBOUNDS_FULL"] = "inbounds_full";
		TokenScopeType["RECIPIENTS_READ"] = "recipients_read";
		TokenScopeType["RECIPIENTS_FULL"] = "recipients_full";
		TokenScopeType["DOMAINS_READ"] = "domains_read";
		TokenScopeType["SENDER_IDENTITY_READ"] = "sender_identity_read";
		TokenScopeType["SENDER_IDENTITY_FULL"] = "sender_identity_full";
		TokenScopeType["USERS_READ"] = "users_read";
		TokenScopeType["USERS_FULL"] = "users_full";
		TokenScopeType["SMTP_USERS_READ"] = "smtp_users_read";
		TokenScopeType["SMTP_USERS_FULL"] = "smtp_users_full";
		TokenScopeType["DMARC_MONITORING_READ"] = "dmarc_monitoring_read";
		TokenScopeType["DMARC_MONITORING_FULL"] = "dmarc_monitoring_full";
		TokenScopeType["BLOCKLIST_MONITORING_READ"] = "blocklist_monitoring_read";
		TokenScopeType["BLOCKLIST_MONITORING_FULL"] = "blocklist_monitoring_full";
		TokenScopeType["WHATSAPP_FULL"] = "whatsapp_full";
		TokenScopeType["IFTTT"] = "ifttt";
	})(TokenScopeType || (exports.TokenScopeType = TokenScopeType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/EmailVerification.js
var require_EmailVerification = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmailVerificationResultType = exports.EmailVerification = void 0;
	var EmailVerification = class {
		constructor(name, emails) {
			this.name = name;
			this.emails = emails;
		}
		setName(name) {
			this.name = name;
			return this;
		}
		setEmails(emails) {
			this.emails = emails;
			return this;
		}
		setListId(listId) {
			this.list_id = listId;
			return this;
		}
		setVerify(verify) {
			this.verify = verify;
			return this;
		}
	};
	exports.EmailVerification = EmailVerification;
	var EmailVerificationResultType;
	(function(EmailVerificationResultType) {
		EmailVerificationResultType["VALID"] = "valid";
		EmailVerificationResultType["CATCH_ALL"] = "catch_all";
		EmailVerificationResultType["MAILBOX_FULL"] = "mailbox_full";
		EmailVerificationResultType["ROLE_BASED"] = "role_based";
		EmailVerificationResultType["UNKNOWN"] = "unknown";
		EmailVerificationResultType["SYNTAX_ERROR"] = "syntax_error";
		EmailVerificationResultType["TYPO"] = "typo";
		EmailVerificationResultType["MAILBOX_NOT_FOUND"] = "mailbox_not_found";
		EmailVerificationResultType["DISPOSABLE"] = "disposable";
		EmailVerificationResultType["MAILBOX_BLOCKED"] = "mailbox_blocked";
		EmailVerificationResultType["FAILED"] = "failed";
	})(EmailVerificationResultType || (exports.EmailVerificationResultType = EmailVerificationResultType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/Pagination.js
var require_Pagination = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/mailersend/lib/models/User.js
var require_User = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UserPermission = exports.UserRole = void 0;
	var UserRole;
	(function(UserRole) {
		UserRole["Admin"] = "Admin";
		UserRole["Manager"] = "Manager";
		UserRole["Designer"] = "Designer";
		UserRole["Accountant"] = "Accountant";
		UserRole["CustomUser"] = "Custom User";
	})(UserRole || (exports.UserRole = UserRole = {}));
	var UserPermission;
	(function(UserPermission) {
		UserPermission["ReadAllTemplates"] = "read-all-templates";
		UserPermission["ReadOwnTemplates"] = "read-own-templates";
		UserPermission["ManageTemplates"] = "manage-template";
		UserPermission["ReadFilemanager"] = "read-filemanager";
		UserPermission["ManageDomain"] = "manage-domain";
		UserPermission["ManageInbound"] = "manage-inbound";
		UserPermission["ManageWebhook"] = "manage-webhook";
		UserPermission["ControlSendings"] = "control-sendings";
		UserPermission["ControlTrackingOptions"] = "control-tracking-options";
		UserPermission["AccessSmtpCredentials"] = "access-smtp-credentials";
		UserPermission["ViewSmtpUsers"] = "view-smtp-users";
		UserPermission["ManageSmtpUsers"] = "manage-smtp-users";
		UserPermission["ReadRecipient"] = "read-recipient";
		UserPermission["ReadActivity"] = "read-activity";
		UserPermission["ReadEmail"] = "read-email";
		UserPermission["ReadAnalytics"] = "read-analytics";
		UserPermission["ReadSenderIdentities"] = "read-sender-identities";
		UserPermission["ManageSenderIdentities"] = "manage-sender-identities";
		UserPermission["ReadEmailVerification"] = "read-email-verification";
		UserPermission["ManageEmailVerification"] = "manage-email-verification";
		UserPermission["ManageSms"] = "manage-sms";
		UserPermission["ReadSms"] = "read-sms";
		UserPermission["ManageVerifiedRecipients"] = "manage-verified-recipients";
		UserPermission["ViewSmsWebhooks"] = "view-sms-webhooks";
		UserPermission["ManageSmsWebhooks"] = "manage-sms-webhooks";
		UserPermission["ViewSmsInbound"] = "view-sms-inbound";
		UserPermission["ManageSmsInbound"] = "manage-sms-inbound";
		UserPermission["UpdatePlan"] = "update-plan";
		UserPermission["ManageAccount"] = "manage-account";
		UserPermission["ReadInvoice"] = "read-invoice";
		UserPermission["ManageApiToken"] = "manage-api-token";
		UserPermission["ReadSuppressions"] = "read-suppressions";
		UserPermission["ManageSuppressions"] = "manage-suppressions";
		UserPermission["ReadIpAddresses"] = "read-ip-addresses";
		UserPermission["ManageIpAddresses"] = "manage-ip-addresses";
		UserPermission["ReadErrorLog"] = "read-error-log";
	})(UserPermission || (exports.UserPermission = UserPermission = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/BlocklistMonitor.js
var require_BlocklistMonitor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BlocklistMonitor = void 0;
	var BlocklistMonitor = class {
		constructor(address) {
			this.address = address;
		}
		setAddress(address) {
			this.address = address;
			return this;
		}
		setName(name) {
			this.name = name;
			return this;
		}
		setNotify(notify) {
			this.notify = notify;
			return this;
		}
		setNotifyEmail(notifyEmail) {
			this.notify_email = notifyEmail;
			return this;
		}
		setNotifyAddress(notifyAddress) {
			this.notify_address = notifyAddress;
			return this;
		}
	};
	exports.BlocklistMonitor = BlocklistMonitor;
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Attachment.js
var require_Attachment = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Attachment = void 0;
	var Attachment = class {
		constructor(content, fileName, disposition = "attachment", id) {
			this.content = content;
			this.filename = fileName;
			this.disposition = disposition;
			this.id = id;
		}
	};
	exports.Attachment = Attachment;
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/EmailParams.js
var require_EmailParams = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmailParams = void 0;
	var EmailParams = class {
		constructor(config) {
			this.from = config === null || config === void 0 ? void 0 : config.from;
			this.to = config === null || config === void 0 ? void 0 : config.to;
			this.cc = config === null || config === void 0 ? void 0 : config.cc;
			this.bcc = config === null || config === void 0 ? void 0 : config.bcc;
			this.rcpt_to = config === null || config === void 0 ? void 0 : config.rcptTo;
			this.reply_to = config === null || config === void 0 ? void 0 : config.replyTo;
			this.in_reply_to = config === null || config === void 0 ? void 0 : config.inReplyTo;
			this.subject = config === null || config === void 0 ? void 0 : config.subject;
			this.text = config === null || config === void 0 ? void 0 : config.text;
			this.html = config === null || config === void 0 ? void 0 : config.html;
			this.send_at = config === null || config === void 0 ? void 0 : config.sendAt;
			this.attachments = config === null || config === void 0 ? void 0 : config.attachments;
			this.template_id = config === null || config === void 0 ? void 0 : config.templateId;
			this.language = config === null || config === void 0 ? void 0 : config.language;
			this.tags = config === null || config === void 0 ? void 0 : config.tags;
			this.personalization = config === null || config === void 0 ? void 0 : config.personalization;
			this.references = config === null || config === void 0 ? void 0 : config.references;
			this.headers = config === null || config === void 0 ? void 0 : config.headers;
			this.settings = config === null || config === void 0 ? void 0 : config.settings;
			this.precedence_bulk = config === null || config === void 0 ? void 0 : config.precedenceBulk;
			this.list_unsubscribe = config === null || config === void 0 ? void 0 : config.listUnsubscribe;
		}
		setFrom(from) {
			this.from = from;
			return this;
		}
		setTo(to) {
			this.to = to;
			return this;
		}
		setCc(cc) {
			this.cc = cc;
			return this;
		}
		setBcc(bcc) {
			this.bcc = bcc;
			return this;
		}
		setRcptTo(rcptTo) {
			this.rcpt_to = rcptTo;
			return this;
		}
		setReplyTo(replyTo) {
			this.reply_to = replyTo;
			return this;
		}
		setInReplyTo(inReplyTo) {
			this.in_reply_to = inReplyTo;
			return this;
		}
		setSubject(subject) {
			this.subject = subject;
			return this;
		}
		setText(text) {
			this.text = text;
			return this;
		}
		setHtml(html) {
			this.html = html;
			return this;
		}
		setSendAt(sendAt) {
			this.send_at = sendAt;
			return this;
		}
		setAttachments(attachments) {
			this.attachments = attachments;
			return this;
		}
		setTemplateId(id) {
			this.template_id = id;
			return this;
		}
		setLanguage(language) {
			this.language = language;
			return this;
		}
		setTags(tags) {
			this.tags = tags;
			return this;
		}
		setPersonalization(personalization) {
			this.personalization = personalization;
			return this;
		}
		setPrecedenceBulk(precedenceBulk) {
			this.precedence_bulk = precedenceBulk;
			return this;
		}
		setSettings(settings) {
			this.settings = settings;
			return this;
		}
		setReferences(references) {
			this.references = references;
			return this;
		}
		setHeaders(headers) {
			this.headers = headers;
			return this;
		}
		setListUnsubscribe(listUnsubscribe) {
			this.list_unsubscribe = listUnsubscribe;
			return this;
		}
	};
	exports.EmailParams = EmailParams;
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Emails.js
var require_Emails = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmailSuppressionReason = exports.EmailInteraction = exports.EmailStatus = void 0;
	var EmailStatus;
	(function(EmailStatus) {
		EmailStatus["QUEUED"] = "queued";
		EmailStatus["SENT"] = "sent";
		EmailStatus["REJECTED"] = "rejected";
		EmailStatus["DELIVERED"] = "delivered";
	})(EmailStatus || (exports.EmailStatus = EmailStatus = {}));
	var EmailInteraction;
	(function(EmailInteraction) {
		EmailInteraction["OPENED"] = "opened";
		EmailInteraction["CLICKED"] = "clicked";
		EmailInteraction["UNSUBSCRIBED"] = "unsubscribed";
		EmailInteraction["COMPLAINED"] = "complained";
		EmailInteraction["NO_INTERACTION"] = "no_interaction";
	})(EmailInteraction || (exports.EmailInteraction = EmailInteraction = {}));
	var EmailSuppressionReason;
	(function(EmailSuppressionReason) {
		EmailSuppressionReason["ON_HOLD"] = "on_hold";
		EmailSuppressionReason["HARD_BOUNCED"] = "hard_bounced";
		EmailSuppressionReason["UNSUBSCRIBED"] = "unsubscribed";
		EmailSuppressionReason["SPAM_COMPLAINED"] = "spam_complained";
		EmailSuppressionReason["BLOCKLISTED"] = "blocklisted";
	})(EmailSuppressionReason || (exports.EmailSuppressionReason = EmailSuppressionReason = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/EmailWebhook.js
var require_EmailWebhook = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmailWebhookEventType = exports.EmailWebhook = void 0;
	var EmailWebhook = class {
		constructor(config) {
			if (config) {
				this.url = config.url;
				this.name = config.name;
				this.events = config.events;
				this.domain_id = config.domain_id;
				this.enabled = config.enabled;
				this.version = config.version;
				this.editable = config.editable;
			}
		}
		setUrl(url) {
			this.url = url;
			return this;
		}
		setName(name) {
			this.name = name;
			return this;
		}
		setEvents(events) {
			this.events = events;
			return this;
		}
		/**
		* Set domain id
		* @param domainId - Existing hashed domain ID.
		*/
		setDomainId(domainId) {
			this.domain_id = domainId;
			return this;
		}
		setEnabled(enabled) {
			this.enabled = enabled;
			return this;
		}
		setEditable(editable) {
			this.editable = editable;
			return this;
		}
		setVersion(version) {
			this.version = version;
			return this;
		}
	};
	exports.EmailWebhook = EmailWebhook;
	var EmailWebhookEventType;
	(function(EmailWebhookEventType) {
		EmailWebhookEventType["SENT"] = "activity.sent";
		EmailWebhookEventType["DELIVERED"] = "activity.delivered";
		EmailWebhookEventType["SOFT_BOUNCED"] = "activity.soft_bounced";
		EmailWebhookEventType["HARD_BOUNCED"] = "activity.hard_bounced";
		EmailWebhookEventType["OPENED"] = "activity.opened";
		EmailWebhookEventType["OPENED_UNIQUE"] = "activity.opened_unique";
		EmailWebhookEventType["CLICKED"] = "activity.clicked";
		EmailWebhookEventType["CLICKED_UNIQUE"] = "activity.clicked_unique";
		EmailWebhookEventType["UNSUBSCRIBED"] = "activity.unsubscribed";
		EmailWebhookEventType["SPAM_COMPLAINT"] = "activity.spam_complaint";
		EmailWebhookEventType["SURVEY_OPENED"] = "activity.survey_opened";
		EmailWebhookEventType["SURVEY_SUBMITTED"] = "activity.survey_submitted";
		EmailWebhookEventType["IDENTITY_VERIFIED"] = "sender_identity.verified";
		EmailWebhookEventType["MAINTENANCE_START"] = "maintenance.start";
		EmailWebhookEventType["MAINTENANCE_END"] = "maintenance.end";
		EmailWebhookEventType["DEFERRED"] = "activity.deferred";
		EmailWebhookEventType["INBOUND_FORWARD_FAILED"] = "inbound_forward.failed";
		EmailWebhookEventType["EMAIL_SINGLE_VERIFIED"] = "email_single.verified";
		EmailWebhookEventType["EMAIL_LIST_VERIFIED"] = "email_list.verified";
		EmailWebhookEventType["BULK_EMAIL_COMPLETED"] = "bulk_email.completed";
		EmailWebhookEventType["RECIPIENT_ON_HOLD_ADDED"] = "recipient.on_hold_added";
		EmailWebhookEventType["RECIPIENT_ON_HOLD_REMOVED"] = "recipient.on_hold_removed";
	})(EmailWebhookEventType || (exports.EmailWebhookEventType = EmailWebhookEventType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Sender.js
var require_Sender = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Sender = void 0;
	var Sender = class {
		constructor(email, name) {
			this.email = email;
			this.name = name;
		}
	};
	exports.Sender = Sender;
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Recipient.js
var require_Recipient$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BlockListType = exports.Recipient = void 0;
	var Sender_1 = require_Sender();
	var Recipient = class extends Sender_1.Sender {
		constructor(email, name) {
			super(email, name);
		}
	};
	exports.Recipient = Recipient;
	var BlockListType;
	(function(BlockListType) {
		BlockListType["BLOCK_LIST"] = "blocklist";
		BlockListType["HARD_BOUNCES_LIST"] = "hard-bounces";
		BlockListType["SPAM_COMPLAINTS_LIST"] = "spam-complaints";
		BlockListType["UNSUBSCRIBES_LIST"] = "unsubscribes";
		BlockListType["ON_HOLD_LIST"] = "on-hold-list";
	})(BlockListType || (exports.BlockListType = BlockListType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Activity.js
var require_Activity$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ActivityEventType = void 0;
	var ActivityEventType;
	(function(ActivityEventType) {
		ActivityEventType["QUEUED"] = "queued";
		ActivityEventType["SENT"] = "sent";
		ActivityEventType["DELIVERED"] = "delivered";
		ActivityEventType["SOFT_BOUNCED"] = "soft_bounced";
		ActivityEventType["HARD_BOUNCED"] = "hard_bounced";
		ActivityEventType["OPENED"] = "opened";
		ActivityEventType["OPENED_UNIQUE"] = "opened_unique";
		ActivityEventType["CLICKED"] = "clicked";
		ActivityEventType["CLICKED_UNIQUE"] = "clicked_unique";
		ActivityEventType["UNSUBSCRIBED"] = "unsubscribed";
		ActivityEventType["SPAM_COMPLAINTS"] = "spam_complaints";
		ActivityEventType["SURVEY_OPENED"] = "survey_opened";
		ActivityEventType["SURVEY_SUBMITTED"] = "survey_submitted";
		ActivityEventType["DEFERRED"] = "deferred";
		ActivityEventType["SUPPRESSED"] = "suppressed";
	})(ActivityEventType || (exports.ActivityEventType = ActivityEventType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Analytics.js
var require_Analytics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AnalyticsGroupByType = void 0;
	var AnalyticsGroupByType;
	(function(AnalyticsGroupByType) {
		AnalyticsGroupByType["DAYS"] = "days";
		AnalyticsGroupByType["WEEKS"] = "weeks";
		AnalyticsGroupByType["MONTHS"] = "months";
		AnalyticsGroupByType["YEARS"] = "years";
	})(AnalyticsGroupByType || (exports.AnalyticsGroupByType = AnalyticsGroupByType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Domain.js
var require_Domain = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Domain = void 0;
	var Domain = class {
		constructor(name, returnPathSubdomain, customTrackingSubdomain, inboundRoutingSubdomain) {
			this.name = name;
			this.return_path_subdomain = returnPathSubdomain;
			this.custom_tracking_subdomain = customTrackingSubdomain;
			this.inbound_routing_subdomain = inboundRoutingSubdomain;
		}
	};
	exports.Domain = Domain;
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/SmtpUser.js
var require_SmtpUser = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Inbound.js
var require_Inbound$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ComparerType = exports.InboundFilterType = exports.InboundUpdateParams = exports.Inbound = void 0;
	var Inbound = class {
		constructor(name, domainEnabled, domainId, inboundDomain, inboundPriority, forwards, matchFilter, catchFilter) {
			this.name = name;
			this.domain_enabled = domainEnabled;
			this.domain_id = domainId;
			this.inbound_domain = inboundDomain;
			this.inbound_priority = inboundPriority;
			this.forwards = forwards;
			this.match_filter = matchFilter;
			this.catch_filter = catchFilter;
		}
		setDomainId(domainId) {
			this.domain_id = domainId;
			return this;
		}
		setName(name) {
			this.name = name;
			return this;
		}
		setDomainEnabled(domainEnabled) {
			this.domain_enabled = domainEnabled;
			return this;
		}
		setInboundDomain(inboundDomain) {
			this.inbound_domain = inboundDomain;
			return this;
		}
		setInboundPriority(inboundPriority) {
			this.inbound_priority = inboundPriority;
			return this;
		}
		setForwards(forwards) {
			this.forwards = forwards;
			return this;
		}
		setMatchFilter(matchFilter) {
			this.match_filter = matchFilter;
			return this;
		}
		setCatchFilter(catchFilter) {
			this.catch_filter = catchFilter;
			return this;
		}
	};
	exports.Inbound = Inbound;
	var InboundUpdateParams = class {
		constructor(name, domainEnabled, inboundDomain, inboundPriority, forwards, matchFilter, catchFilter) {
			this.name = name;
			this.domain_enabled = domainEnabled;
			this.inbound_domain = inboundDomain;
			this.inbound_priority = inboundPriority;
			this.forwards = forwards;
			this.match_filter = matchFilter;
			this.catch_filter = catchFilter;
		}
		setName(name) {
			this.name = name;
			return this;
		}
		setDomainEnabled(domainEnabled) {
			this.domain_enabled = domainEnabled;
			return this;
		}
		setInboundDomain(inboundDomain) {
			this.inbound_domain = inboundDomain;
			return this;
		}
		setInboundPriority(inboundPriority) {
			this.inbound_priority = inboundPriority;
			return this;
		}
		setForwards(forwards) {
			this.forwards = forwards;
			return this;
		}
		setMatchFilter(matchFilter) {
			this.match_filter = matchFilter;
			return this;
		}
		setCatchFilter(catchFilter) {
			this.catch_filter = catchFilter;
			return this;
		}
	};
	exports.InboundUpdateParams = InboundUpdateParams;
	var InboundFilterType;
	(function(InboundFilterType) {
		InboundFilterType["CATCH_ALL"] = "catch_all";
		InboundFilterType["CATCH_RECIPIENT"] = "catch_recipient";
		InboundFilterType["MATCH_ALL"] = "match_all";
		InboundFilterType["MATCH_SENDER"] = "match_sender";
		InboundFilterType["MATCH_DOMAIN"] = "match_domain";
		InboundFilterType["MATCH_HEADER"] = "match_header";
	})(InboundFilterType || (exports.InboundFilterType = InboundFilterType = {}));
	var ComparerType;
	(function(ComparerType) {
		ComparerType["EQUAL"] = "equal";
		ComparerType["NOT_EQUAL"] = "not-equal";
		ComparerType["CONTAINS"] = "contains";
		ComparerType["NOT_CONTAINS"] = "not-contains";
		ComparerType["STARTS_WITH"] = "starts-with";
		ComparerType["ENDS_WITH"] = "ends-with";
		ComparerType["NOT_STARTS_WITH"] = "not-starts-with";
		ComparerType["NOT_ENDS_WITH"] = "not-ends-with";
	})(ComparerType || (exports.ComparerType = ComparerType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Message.js
var require_Message$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Schedule.js
var require_Schedule = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Template.js
var require_Template = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Identity.js
var require_Identity = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Identity = void 0;
	var Identity = class {
		constructor(domainId, email, name, personalNote, replyToName, replyToEmail, addNote) {
			this.domain_id = domainId;
			this.email = email;
			this.name = name;
			this.personal_note = personalNote;
			this.reply_to_name = replyToName;
			this.reply_to_email = replyToEmail;
			this.add_note = addNote;
		}
		setDomainId(domainId) {
			this.domain_id = domainId;
			return this;
		}
		setEmail(email) {
			this.email = email;
			return this;
		}
		setName(name) {
			this.name = name;
			return this;
		}
		setPersonalNote(personalNote) {
			this.personal_note = personalNote;
			return this;
		}
		setReplyToName(replyToName) {
			this.reply_to_name = replyToName;
			return this;
		}
		setReplyToEmail(replyToEmail) {
			this.reply_to_email = replyToEmail;
			return this;
		}
		setAddNote(addNote) {
			this.add_note = addNote;
			return this;
		}
	};
	exports.Identity = Identity;
}));
//#endregion
//#region node_modules/mailersend/lib/models/email/Dmarc.js
var require_Dmarc = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Dmarc = void 0;
	var Dmarc = class {
		constructor(domainId) {
			this.domain_id = domainId;
		}
	};
	exports.Dmarc = Dmarc;
}));
//#endregion
//#region node_modules/mailersend/lib/models/sms/Activity.js
var require_Activity = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmsActivityStatusType = void 0;
	var SmsActivityStatusType;
	(function(SmsActivityStatusType) {
		SmsActivityStatusType["QUEUED"] = "queued";
		SmsActivityStatusType["SENT"] = "sent";
		SmsActivityStatusType["DELIVERED"] = "delivered";
		SmsActivityStatusType["FAILED"] = "failed";
		SmsActivityStatusType["PROCESSED"] = "processed";
	})(SmsActivityStatusType || (exports.SmsActivityStatusType = SmsActivityStatusType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/sms/Message.js
var require_Message = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/mailersend/lib/models/sms/Number.js
var require_Number = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/mailersend/lib/models/sms/Inbound.js
var require_Inbound = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmsComparerType = exports.SmsInbound = void 0;
	var SmsInbound = class {
		constructor(name, smsNumberId, forwardUrl, enabled, filter) {
			this.name = name;
			this.enabled = enabled;
			this.sms_number_id = smsNumberId;
			this.forward_url = forwardUrl;
			this.filter = filter;
		}
		setSmsNumberId(smsNumberId) {
			this.sms_number_id = smsNumberId;
			return this;
		}
		setName(name) {
			this.name = name;
			return this;
		}
		setEnabled(enabled) {
			this.enabled = enabled;
			return this;
		}
		setForwardUrl(forward_url) {
			this.forward_url = forward_url;
			return this;
		}
		setFilter(filter) {
			this.filter = filter;
			return this;
		}
	};
	exports.SmsInbound = SmsInbound;
	var SmsComparerType;
	(function(SmsComparerType) {
		SmsComparerType["EQUAL"] = "equal";
		SmsComparerType["NOT_EQUAL"] = "not-equal";
		SmsComparerType["CONTAINS"] = "contains";
		SmsComparerType["NOT_CONTAINS"] = "not-contains";
		SmsComparerType["STARTS_WITH"] = "starts-with";
		SmsComparerType["ENDS_WITH"] = "ends-with";
		SmsComparerType["NOT_STARTS_WITH"] = "not-starts-with";
		SmsComparerType["NOT_ENDS_WITH"] = "not-ends-with";
	})(SmsComparerType || (exports.SmsComparerType = SmsComparerType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/sms/SMSParams.js
var require_SMSParams = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SMSParams = void 0;
	var SMSParams = class {
		constructor(config) {
			var _a;
			this.from = config === null || config === void 0 ? void 0 : config.from;
			this.to = config === null || config === void 0 ? void 0 : config.to;
			this.text = config === null || config === void 0 ? void 0 : config.text;
			if ((_a = config === null || config === void 0 ? void 0 : config.personalization) === null || _a === void 0 ? void 0 : _a.length) this.personalization = config === null || config === void 0 ? void 0 : config.personalization;
		}
		setFrom(from) {
			this.from = from;
			return this;
		}
		setTo(to) {
			this.to = to;
			return this;
		}
		setText(text) {
			this.text = text;
			return this;
		}
		setPersonalization(personalization) {
			this.personalization = personalization;
			return this;
		}
	};
	exports.SMSParams = SMSParams;
}));
//#endregion
//#region node_modules/mailersend/lib/models/sms/SMSPersonalization.js
var require_SMSPersonalization = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SMSPersonalization = void 0;
	var SMSPersonalization = class {
		constructor(phoneNumber, data) {
			this.phone_number = phoneNumber;
			this.data = data;
		}
	};
	exports.SMSPersonalization = SMSPersonalization;
}));
//#endregion
//#region node_modules/mailersend/lib/models/sms/Recipient.js
var require_Recipient = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/mailersend/lib/models/sms/Webhook.js
var require_Webhook = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmsWebhookEventType = exports.SmsWebhook = void 0;
	var SmsWebhook = class {
		constructor(name, url, events, smsNumberId, enabled) {
			this.url = url;
			this.name = name;
			this.events = events;
			this.sms_number_id = smsNumberId;
			this.enabled = enabled;
		}
		setUrl(url) {
			this.url = url;
			return this;
		}
		setName(name) {
			this.name = name;
			return this;
		}
		setEvents(events) {
			this.events = events;
			return this;
		}
		setSmsNumberId(smsNumberId) {
			this.sms_number_id = smsNumberId;
			return this;
		}
		setEnabled(enabled) {
			this.enabled = enabled;
			return this;
		}
	};
	exports.SmsWebhook = SmsWebhook;
	var SmsWebhookEventType;
	(function(SmsWebhookEventType) {
		SmsWebhookEventType["SENT"] = "sms.sent";
		SmsWebhookEventType["DELIVERED"] = "sms.delivered";
		SmsWebhookEventType["FAILED"] = "sms.failed";
	})(SmsWebhookEventType || (exports.SmsWebhookEventType = SmsWebhookEventType = {}));
}));
//#endregion
//#region node_modules/mailersend/lib/models/whatsapp/WhatsAppParams.js
var require_WhatsAppParams = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WhatsAppParams = void 0;
	var WhatsAppParams = class {
		constructor(config) {
			var _a;
			this.from = config === null || config === void 0 ? void 0 : config.from;
			this.to = config === null || config === void 0 ? void 0 : config.to;
			this.template_id = config === null || config === void 0 ? void 0 : config.template_id;
			if ((_a = config === null || config === void 0 ? void 0 : config.personalization) === null || _a === void 0 ? void 0 : _a.length) this.personalization = config === null || config === void 0 ? void 0 : config.personalization;
		}
		setFrom(from) {
			this.from = from;
			return this;
		}
		setTo(to) {
			this.to = to;
			return this;
		}
		setTemplateId(templateId) {
			this.template_id = templateId;
			return this;
		}
		setPersonalization(personalization) {
			this.personalization = personalization;
			return this;
		}
	};
	exports.WhatsAppParams = WhatsAppParams;
}));
//#endregion
//#region node_modules/mailersend/lib/models/whatsapp/WhatsAppPersonalization.js
var require_WhatsAppPersonalization = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WhatsAppPersonalization = void 0;
	var WhatsAppPersonalization = class {
		constructor(to) {
			this.to = to;
			this.data = {};
		}
		setHeader(header) {
			this.data.header = header;
			return this;
		}
		setBody(body) {
			this.data.body = body;
			return this;
		}
		setButtons(buttons) {
			this.data.buttons = buttons;
			return this;
		}
	};
	exports.WhatsAppPersonalization = WhatsAppPersonalization;
}));
//#endregion
//#region node_modules/mailersend/lib/models/index.js
var require_models = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_Token(), exports);
	__exportStar(require_EmailVerification(), exports);
	__exportStar(require_Pagination(), exports);
	__exportStar(require_User(), exports);
	__exportStar(require_BlocklistMonitor(), exports);
	__exportStar(require_Attachment(), exports);
	__exportStar(require_EmailParams(), exports);
	__exportStar(require_Emails(), exports);
	__exportStar(require_EmailWebhook(), exports);
	__exportStar(require_Recipient$1(), exports);
	__exportStar(require_Sender(), exports);
	__exportStar(require_Activity$1(), exports);
	__exportStar(require_Analytics(), exports);
	__exportStar(require_Domain(), exports);
	__exportStar(require_SmtpUser(), exports);
	__exportStar(require_Inbound$1(), exports);
	__exportStar(require_Message$1(), exports);
	__exportStar(require_Schedule(), exports);
	__exportStar(require_Template(), exports);
	__exportStar(require_Identity(), exports);
	__exportStar(require_Dmarc(), exports);
	__exportStar(require_Activity(), exports);
	__exportStar(require_Message(), exports);
	__exportStar(require_Number(), exports);
	__exportStar(require_Inbound(), exports);
	__exportStar(require_SMSParams(), exports);
	__exportStar(require_SMSPersonalization(), exports);
	__exportStar(require_Recipient(), exports);
	__exportStar(require_Webhook(), exports);
	__exportStar(require_WhatsAppParams(), exports);
	__exportStar(require_WhatsAppPersonalization(), exports);
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Recipient.module.js
var require_Recipient_module$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RecipientModule = void 0;
	var request_service_1 = require_request_service();
	var models_1 = require_models();
	var MIN_LIMIT = 10;
	var MAX_LIMIT = 100;
	var RecipientModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/recipients`, queryParams);
			});
		}
		single(recipientId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/recipients/${recipientId}`);
			});
		}
		delete(recipientId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/recipients/${recipientId}`);
			});
		}
		blockList(queryParams_1) {
			return __awaiter(this, arguments, void 0, function* (queryParams, type = models_1.BlockListType.BLOCK_LIST) {
				if ((queryParams === null || queryParams === void 0 ? void 0 : queryParams.limit) !== void 0) {
					if (queryParams.limit < MIN_LIMIT || queryParams.limit > MAX_LIMIT) throw new Error(`Limit must be between ${MIN_LIMIT} and ${MAX_LIMIT}.`);
				}
				return yield this.get(`/suppressions/${type}`, queryParams);
			});
		}
		blockRecipients(blockRecipients_1) {
			return __awaiter(this, arguments, void 0, function* (blockRecipients, type = models_1.BlockListType.BLOCK_LIST) {
				var _a, _b;
				if (type === models_1.BlockListType.BLOCK_LIST) {
					const params = blockRecipients;
					if (!((_a = params.recipients) === null || _a === void 0 ? void 0 : _a.length) && !((_b = params.patterns) === null || _b === void 0 ? void 0 : _b.length)) throw new Error("Either recipients or patterns must be provided.");
				} else if (!blockRecipients.recipients.length) throw new Error("Recipients must not be empty.");
				return yield this.post(`/suppressions/${type}`, blockRecipients);
			});
		}
		delBlockListRecipients(ids_1) {
			return __awaiter(this, arguments, void 0, function* (ids, type = models_1.BlockListType.BLOCK_LIST, domainId) {
				return yield this.deleteReq(`/suppressions/${type}`, Object.assign({ ids }, domainId && { domain_id: domainId }));
			});
		}
		delAllBlockListRecipients() {
			return __awaiter(this, arguments, void 0, function* (type = models_1.BlockListType.BLOCK_LIST, domainId) {
				return yield this.deleteReq(`/suppressions/${type}`, Object.assign({ all: true }, domainId && { domain_id: domainId }));
			});
		}
	};
	exports.RecipientModule = RecipientModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Template.module.js
var require_Template_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TemplateModule = void 0;
	var request_service_1 = require_request_service();
	var TemplateModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/templates`, queryParams);
			});
		}
		single(templateId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/templates/${templateId}`);
			});
		}
		delete(templateId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/templates/${templateId}`);
			});
		}
		create(params) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/templates`, params);
			});
		}
		update(templateId, params) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/templates/${templateId}`, params);
			});
		}
	};
	exports.TemplateModule = TemplateModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Webhook.module.js
var require_Webhook_module$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmailWebhookModule = void 0;
	var request_service_1 = require_request_service();
	var EmailWebhookModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		create(params) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post("/webhooks", params);
			});
		}
		list(domainId, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get("/webhooks", Object.assign({ domain_id: domainId }, queryParams));
			});
		}
		single(webhookId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/webhooks/${webhookId}`);
			});
		}
		update(webhookId, updates) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/webhooks/${webhookId}`, updates);
			});
		}
		delete(webhookId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/webhooks/${webhookId}`);
			});
		}
	};
	exports.EmailWebhookModule = EmailWebhookModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/Identity.module.js
var require_Identity_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IdentityModule = void 0;
	var request_service_1 = require_request_service();
	var IdentityModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		create(identity) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/identities`, identity);
			});
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/identities`, queryParams);
			});
		}
		single(identityId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/identities/${identityId}`);
			});
		}
		singleByEmail(email) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/identities/email/${email}`);
			});
		}
		update(identityId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/identities/${identityId}`, data);
			});
		}
		updateByEMail(email, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/identities/email/${email}`, data);
			});
		}
		delete(identityId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/identities/${identityId}`);
			});
		}
		deleteByEmail(email) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/identities/email/${email}`);
			});
		}
		resend(identityId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/identities/${identityId}/resend`, {});
			});
		}
	};
	exports.IdentityModule = IdentityModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/email/SmtpUser.module.js
var require_SmtpUser_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmtpUserModule = void 0;
	var request_service_1 = require_request_service();
	var SmtpUserModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(domainId, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/domains/${domainId}/smtp-users`, queryParams);
			});
		}
		single(domainId, smtpUserId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/domains/${domainId}/smtp-users/${smtpUserId}`);
			});
		}
		create(domainId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/domains/${domainId}/smtp-users`, data);
			});
		}
		update(domainId, smtpUserId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/domains/${domainId}/smtp-users/${smtpUserId}`, data);
			});
		}
		delete(domainId, smtpUserId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/domains/${domainId}/smtp-users/${smtpUserId}`);
			});
		}
	};
	exports.SmtpUserModule = SmtpUserModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/Email.module.js
var require_Email_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmailModule = void 0;
	var request_service_1 = require_request_service();
	var Activity_module_1 = require_Activity_module$1();
	var Analytics_module_1 = require_Analytics_module();
	var Domain_module_1 = require_Domain_module();
	var Inbound_module_1 = require_Inbound_module$1();
	var Message_module_1 = require_Message_module$1();
	var Schedule_module_1 = require_Schedule_module();
	var Recipient_module_1 = require_Recipient_module$1();
	var Template_module_1 = require_Template_module();
	var Webhook_module_1 = require_Webhook_module$1();
	var Identity_module_1 = require_Identity_module();
	var SmtpUser_module_1 = require_SmtpUser_module();
	var EmailModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
			this.activity = new Activity_module_1.ActivityModule(apiKey, baseUrl);
			this.analytics = new Analytics_module_1.AnalyticsModule(apiKey, baseUrl);
			this.domain = new Domain_module_1.DomainModule(apiKey, baseUrl);
			this.inbound = new Inbound_module_1.InboundModule(apiKey, baseUrl);
			this.message = new Message_module_1.MessageModule(apiKey, baseUrl);
			this.schedule = new Schedule_module_1.ScheduleModule(apiKey, baseUrl);
			this.recipient = new Recipient_module_1.RecipientModule(apiKey, baseUrl);
			this.template = new Template_module_1.TemplateModule(apiKey, baseUrl);
			this.webhook = new Webhook_module_1.EmailWebhookModule(apiKey, baseUrl);
			this.identity = new Identity_module_1.IdentityModule(apiKey, baseUrl);
			this.smtpUser = new SmtpUser_module_1.SmtpUserModule(apiKey, baseUrl);
		}
		send(params) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post("/email", params);
			});
		}
		sendBulk(params) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post("/bulk-email", params);
			});
		}
		getBulkStatus(bulkId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/bulk-email/${bulkId}`);
			});
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get("/emails", queryParams);
			});
		}
		single(emailId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/email/${emailId}`);
			});
		}
	};
	exports.EmailModule = EmailModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/Token.module.js
var require_Token_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TokenModule = void 0;
	var request_service_1 = require_request_service();
	var TokenModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(params) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/token`, params);
			});
		}
		single(tokenId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/token/${tokenId}`);
			});
		}
		create(token) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post("/token", token);
			});
		}
		update(tokenId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/token/${tokenId}`, data);
			});
		}
		updateSettings(tokenId, updates) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/token/${tokenId}`, updates);
			});
		}
		delete(tokenId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/token/${tokenId}`);
			});
		}
	};
	exports.TokenModule = TokenModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/EmailVerification.module.js
var require_EmailVerification_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmailVerificationModule = void 0;
	var request_service_1 = require_request_service();
	var EmailVerificationModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/email-verification`, queryParams);
			});
		}
		single(emailVerificationId, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/email-verification/${emailVerificationId}`, queryParams);
			});
		}
		create(emailVerification) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/email-verification`, emailVerification);
			});
		}
		verifyList(emailVerificationId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/email-verification/${emailVerificationId}/verify`);
			});
		}
		getListResult(emailVerificationId, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/email-verification/${emailVerificationId}/results`, queryParams);
			});
		}
		verifyEmail(email) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/email-verification/verify`, { email });
			});
		}
		verifyEmailAsync(email) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/email-verification/verify-async`, { email });
			});
		}
		getVerifyEmailAsyncStatus(id) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/email-verification/verify-async/${id}`);
			});
		}
	};
	exports.EmailVerificationModule = EmailVerificationModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/sms/Activity.module.js
var require_Activity_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmsActivityModule = void 0;
	var request_service_1 = require_request_service();
	var SmsActivityModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-activity`, queryParams);
			});
		}
	};
	exports.SmsActivityModule = SmsActivityModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/sms/Inbound.module.js
var require_Inbound_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmsInboundModule = void 0;
	var request_service_1 = require_request_service();
	var SmsInboundModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		create(smsInbound) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/sms-inbounds`, smsInbound);
			});
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-inbounds`, queryParams);
			});
		}
		single(smsInboundId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-inbounds/${smsInboundId}`);
			});
		}
		delete(smsInboundId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/sms-inbounds/${smsInboundId}`);
			});
		}
		update(smsInboundId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/sms-inbounds/${smsInboundId}`, data);
			});
		}
	};
	exports.SmsInboundModule = SmsInboundModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/sms/Message.module.js
var require_Message_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmsMessageModule = void 0;
	var request_service_1 = require_request_service();
	var SmsMessageModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-messages`, queryParams);
			});
		}
		single(smsMessageId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-messages/${smsMessageId}`);
			});
		}
	};
	exports.SmsMessageModule = SmsMessageModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/sms/Number.module.js
var require_Number_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmsNumberModule = void 0;
	var request_service_1 = require_request_service();
	var SmsNumberModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-numbers`, queryParams);
			});
		}
		single(smsNumberId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-numbers/${smsNumberId}`);
			});
		}
		update(smsNumberId, paused) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/sms-numbers/${smsNumberId}`, { paused });
			});
		}
		delete(smsNumberId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/sms-numbers/${smsNumberId}`);
			});
		}
	};
	exports.SmsNumberModule = SmsNumberModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/sms/Recipient.module.js
var require_Recipient_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmsRecipientModule = void 0;
	var request_service_1 = require_request_service();
	var SmsRecipientModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-recipients`, queryParams);
			});
		}
		single(smsRecipientId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-recipients/${smsRecipientId}`);
			});
		}
		update(smsRecipientId, status) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/sms-recipients/${smsRecipientId}`, { status });
			});
		}
	};
	exports.SmsRecipientModule = SmsRecipientModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/sms/Webhook.module.js
var require_Webhook_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SmsWebhookModule = void 0;
	var request_service_1 = require_request_service();
	var SmsWebhookModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		create(params) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post("/sms-webhooks", params);
			});
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get("/sms-webhooks", queryParams);
			});
		}
		single(smsWebhookId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/sms-webhooks/${smsWebhookId}`);
			});
		}
		update(smsWebhookId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/sms-webhooks/${smsWebhookId}`, data);
			});
		}
		delete(smsWebhookId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/sms-webhooks/${smsWebhookId}`);
			});
		}
	};
	exports.SmsWebhookModule = SmsWebhookModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/SMS.module.js
var require_SMS_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SMSModule = void 0;
	var request_service_1 = require_request_service();
	var Activity_module_1 = require_Activity_module();
	var Inbound_module_1 = require_Inbound_module();
	var Message_module_1 = require_Message_module();
	var Number_module_1 = require_Number_module();
	var Recipient_module_1 = require_Recipient_module();
	var Webhook_module_1 = require_Webhook_module();
	var SMSModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
			this.activity = new Activity_module_1.SmsActivityModule(apiKey, baseUrl);
			this.number = new Number_module_1.SmsNumberModule(apiKey, baseUrl);
			this.message = new Message_module_1.SmsMessageModule(apiKey, baseUrl);
			this.inbound = new Inbound_module_1.SmsInboundModule(apiKey, baseUrl);
			this.recipient = new Recipient_module_1.SmsRecipientModule(apiKey, baseUrl);
			this.webhook = new Webhook_module_1.SmsWebhookModule(apiKey, baseUrl);
		}
		send(params) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post("/sms", params);
			});
		}
	};
	exports.SMSModule = SMSModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/Others.module.js
var require_Others_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OthersModule = void 0;
	var request_service_1 = require_request_service();
	var OthersModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		getApiQuota() {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get("/api-quota");
			});
		}
	};
	exports.OthersModule = OthersModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/Dmarc.module.js
var require_Dmarc_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DmarcModule = void 0;
	var request_service_1 = require_request_service();
	var DmarcModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/dmarc-monitoring`, queryParams);
			});
		}
		create(data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/dmarc-monitoring`, data);
			});
		}
		update(monitorId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/dmarc-monitoring/${monitorId}`, data);
			});
		}
		delete(monitorId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/dmarc-monitoring/${monitorId}`);
			});
		}
		report(monitorId, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/dmarc-monitoring/${monitorId}/report`, queryParams);
			});
		}
		reportByIp(monitorId, ip, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/dmarc-monitoring/${monitorId}/report/${ip}`, queryParams);
			});
		}
		reportSources(monitorId, queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/dmarc-monitoring/${monitorId}/report-sources`, queryParams);
			});
		}
		addFavorite(monitorId, ip) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/dmarc-monitoring/${monitorId}/favorite/${ip}`, {});
			});
		}
		removeFavorite(monitorId, ip) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/dmarc-monitoring/${monitorId}/favorite/${ip}`);
			});
		}
	};
	exports.DmarcModule = DmarcModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/User.module.js
var require_User_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UserModule = void 0;
	var request_service_1 = require_request_service();
	var UserModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/users`, queryParams);
			});
		}
		single(userId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/users/${userId}`);
			});
		}
		create(data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/users`, data);
			});
		}
		update(userId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/users/${userId}`, data);
			});
		}
		delete(userId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/users/${userId}`);
			});
		}
		listInvites(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/invites`, queryParams);
			});
		}
		singleInvite(inviteId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/invites/${inviteId}`);
			});
		}
		resendInvite(inviteId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/invites/${inviteId}/resend`, {});
			});
		}
		deleteInvite(inviteId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/invites/${inviteId}`);
			});
		}
	};
	exports.UserModule = UserModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/BlocklistMonitor.module.js
var require_BlocklistMonitor_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BlocklistMonitorModule = void 0;
	var request_service_1 = require_request_service();
	var BlocklistMonitorModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		list(queryParams) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/blocklist-monitoring`, queryParams);
			});
		}
		single(monitorId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.get(`/blocklist-monitoring/${monitorId}`);
			});
		}
		create(data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post(`/blocklist-monitoring`, data);
			});
		}
		update(monitorId, data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.put(`/blocklist-monitoring/${monitorId}`, data);
			});
		}
		delete(monitorId) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.deleteReq(`/blocklist-monitoring/${monitorId}`);
			});
		}
	};
	exports.BlocklistMonitorModule = BlocklistMonitorModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/WhatsApp.module.js
var require_WhatsApp_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WhatsAppModule = void 0;
	var request_service_1 = require_request_service();
	var WhatsAppModule = class extends request_service_1.RequestService {
		constructor(apiKey, baseUrl) {
			super(apiKey, baseUrl);
		}
		send(params) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.post("/whatsapp/send", params);
			});
		}
	};
	exports.WhatsAppModule = WhatsAppModule;
}));
//#endregion
//#region node_modules/mailersend/lib/modules/MailerSend.module.js
var require_MailerSend_module = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MailerSend = void 0;
	var Email_module_1 = require_Email_module();
	var Token_module_1 = require_Token_module();
	var EmailVerification_module_1 = require_EmailVerification_module();
	var SMS_module_1 = require_SMS_module();
	var Others_module_1 = require_Others_module();
	var Dmarc_module_1 = require_Dmarc_module();
	var User_module_1 = require_User_module();
	var BlocklistMonitor_module_1 = require_BlocklistMonitor_module();
	var WhatsApp_module_1 = require_WhatsApp_module();
	var MailerSend = class {
		constructor(config) {
			this.baseUrl = "https://api.mailersend.com/v1";
			this.apiKey = config.apiKey;
			this.token = new Token_module_1.TokenModule(config.apiKey, this.baseUrl);
			this.email = new Email_module_1.EmailModule(config.apiKey, this.baseUrl);
			this.emailVerification = new EmailVerification_module_1.EmailVerificationModule(config.apiKey, this.baseUrl);
			this.sms = new SMS_module_1.SMSModule(config.apiKey, this.baseUrl);
			this.others = new Others_module_1.OthersModule(config.apiKey, this.baseUrl);
			this.dmarc = new Dmarc_module_1.DmarcModule(config.apiKey, this.baseUrl);
			this.user = new User_module_1.UserModule(config.apiKey, this.baseUrl);
			this.blocklistMonitor = new BlocklistMonitor_module_1.BlocklistMonitorModule(config.apiKey, this.baseUrl);
			this.whatsapp = new WhatsApp_module_1.WhatsAppModule(config.apiKey, this.baseUrl);
		}
	};
	exports.MailerSend = MailerSend;
}));
//#endregion
//#region node_modules/mailersend/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_MailerSend_module(), exports);
	__exportStar(require_models(), exports);
}));
//#endregion
export { require_lib as t };

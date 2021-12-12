(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entorno = void 0;
var Entorno = /** @class */ (function () {
    function Entorno(anterior) {
        this.tabla = {};
        this.anterior = anterior;
    }
    Entorno.prototype.agregar = function (id, simbolo) {
        id = id;
        simbolo.indentificador = simbolo.indentificador;
        this.tabla[id] = simbolo;
    };
    Entorno.prototype.eliminar = function (id) {
        id = id;
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                delete e.tabla[id];
                return true;
            }
        }
        return false;
    };
    Entorno.prototype.existe = function (id) {
        id = id;
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                return true;
            }
        }
        return false;
    };
    Entorno.prototype.existeEnActual = function (id) {
        id = id;
        if (this.tabla[id] !== undefined) {
            return true;
        }
        return false;
    };
    Entorno.prototype.getSimbolo = function (id) {
        id = id;
        for (var e = this; e != null; e = e.anterior) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
        }
        return null;
    };
    Entorno.prototype.reemplazar = function (id, nuevoValor) {
        id = id;
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                e.tabla[id] = nuevoValor;
            }
        }
    };
    return Entorno;
}());
exports.Entorno = Entorno;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
var Simbolo = /** @class */ (function () {
    function Simbolo(tipo, id, linea, columna, valor) {
        this.indentificador = id;
        this.linea = linea;
        this.columna = columna;
        this.tipo = tipo;
        this.valor = valor;
    }
    Simbolo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Simbolo.prototype.getTipo = function (ent, arbol) {
        return this.tipo;
    };
    Simbolo.prototype.getValorImplicito = function (ent, arbol) {
        return this.valor;
    };
    return Simbolo;
}());
exports.Simbolo = Simbolo;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo = void 0;
var Tipo;
(function (Tipo) {
    Tipo[Tipo["STRING"] = 0] = "STRING";
    Tipo[Tipo["INT"] = 1] = "INT";
    Tipo[Tipo["DOUBLE"] = 2] = "DOUBLE";
    Tipo[Tipo["BOOL"] = 3] = "BOOL";
    Tipo[Tipo["VOID"] = 4] = "VOID";
    Tipo[Tipo["STRUCT"] = 5] = "STRUCT";
    Tipo[Tipo["NULL"] = 6] = "NULL";
    Tipo[Tipo["ATRIBUTO"] = 7] = "ATRIBUTO";
    Tipo[Tipo["CHAR"] = 8] = "CHAR";
    Tipo[Tipo["ARRAY"] = 9] = "ARRAY";
})(Tipo = exports.Tipo || (exports.Tipo = {}));

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoAtributo = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoAtributo = /** @class */ (function () {
    function AccesoAtributo(expr1, expr2, linea, columna) {
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoAtributo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoAtributo.prototype.getTipo = function (ent, arbol) {
        return Tipo_1.Tipo.NULL;
    };
    AccesoAtributo.prototype.getValorImplicito = function (ent, arbol) {
    };
    return AccesoAtributo;
}());
exports.AccesoAtributo = AccesoAtributo;

},{"../AST/Tipo":6}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoVariable = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoVariable = /** @class */ (function () {
    function AccesoVariable(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoVariable.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoVariable.prototype.getTipo = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            return simbol.getTipo(ent, arbol);
        }
        else {
            console.log('No existe el id ' + this.id + ' no hay tipo');
        }
        return Tipo_1.Tipo.NULL;
    };
    AccesoVariable.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            return simbol.valor;
        }
        else {
            console.log('No existe el id ' + this.id);
        }
    };
    return AccesoVariable;
}());
exports.AccesoVariable = AccesoVariable;

},{"../AST/Tipo":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrbegEnd = void 0;
var Tipo_1 = require("../AST/Tipo");
var ArrbegEnd = /** @class */ (function () {
    function ArrbegEnd(id, linea, columna, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    ArrbegEnd.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    ArrbegEnd.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    ArrbegEnd.prototype.getValorImplicito = function (ent, arbol) {
        return this.id;
    };
    ArrbegEnd.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return ArrbegEnd;
}());
exports.ArrbegEnd = ArrbegEnd;

},{"../AST/Tipo":6}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atributo = void 0;
var Atributo = /** @class */ (function () {
    function Atributo(id, valor, linea, columna) {
        this.identificador = id;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    return Atributo;
}());
exports.Atributo = Atributo;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objeto = void 0;
var Entorno_1 = require("../AST/Entorno");
var Objeto = /** @class */ (function () {
    function Objeto(id, texto, linea, columna, listaAtributos, listaO) {
        this.identificador = id;
        this.texto = texto;
        this.linea = linea;
        this.columna = columna;
        this.listaAtributos = listaAtributos;
        this.listaObjetos = listaO;
        this.entorno = new Entorno_1.Entorno(null);
    }
    return Objeto;
}());
exports.Objeto = Objeto;

},{"../AST/Entorno":4}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operacion = exports.Operador = void 0;
var Tipo_1 = require("../AST/Tipo");
var Operador;
(function (Operador) {
    Operador[Operador["SUMA"] = 0] = "SUMA";
    Operador[Operador["RESTA"] = 1] = "RESTA";
    Operador[Operador["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    Operador[Operador["AMPERSON"] = 3] = "AMPERSON";
    Operador[Operador["DIVISION"] = 4] = "DIVISION";
    Operador[Operador["MODULO"] = 5] = "MODULO";
    Operador[Operador["MENOS_UNARIO"] = 6] = "MENOS_UNARIO";
    Operador[Operador["ELEVADO"] = 7] = "ELEVADO";
    Operador[Operador["MAYOR_QUE"] = 8] = "MAYOR_QUE";
    Operador[Operador["MENOR_QUE"] = 9] = "MENOR_QUE";
    Operador[Operador["IGUAL_IGUAL"] = 10] = "IGUAL_IGUAL";
    Operador[Operador["DIFERENTE_QUE"] = 11] = "DIFERENTE_QUE";
    Operador[Operador["OR"] = 12] = "OR";
    Operador[Operador["AND"] = 13] = "AND";
    Operador[Operador["NOT"] = 14] = "NOT";
    Operador[Operador["MAYOR_IGUA_QUE"] = 15] = "MAYOR_IGUA_QUE";
    Operador[Operador["MENOR_IGUA_QUE"] = 16] = "MENOR_IGUA_QUE";
    Operador[Operador["INCREMENTO"] = 17] = "INCREMENTO";
    Operador[Operador["DECREMENTO"] = 18] = "DECREMENTO";
    Operador[Operador["POW"] = 19] = "POW";
    Operador[Operador["SQRT"] = 20] = "SQRT";
    Operador[Operador["SIN"] = 21] = "SIN";
    Operador[Operador["COS"] = 22] = "COS";
    Operador[Operador["TAN"] = 23] = "TAN";
    Operador[Operador["DESCONOCIDO"] = 24] = "DESCONOCIDO";
})(Operador = exports.Operador || (exports.Operador = {}));
var Operacion = /** @class */ (function () {
    function Operacion(op_izquierda, op_derecha, operacion, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.op_izquierda = op_izquierda;
        this.op_derecha = op_derecha;
        this.operador = operacion;
    }
    Operacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Operacion.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    Operacion.prototype.getValorImplicito = function (ent, arbol) {
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT
            && this.operador != Operador.SQRT && this.operador != Operador.SIN && this.operador != Operador.COS
            && this.operador != Operador.TAN) {
            var op1 = this.op_izquierda.getValorImplicito(ent, arbol);
            var op2 = this.op_derecha.getValorImplicito(ent, arbol);
            //suma
            if (this.operador == Operador.SUMA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 + op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //resta
            else if (this.operador == Operador.RESTA) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 - op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //multiplicaci├│n
            else if (this.operador == Operador.MULTIPLICACION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    return op1 * op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //division
            else if (this.operador == Operador.DIVISION) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        console.log("Resultado indefinido, no puede ejecutarse operaci├│n sobre cero.");
                        return null;
                    }
                    return op1 / op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //modulo
            else if (this.operador == Operador.MODULO) {
                if (typeof (op1 === "number") && typeof (op2 === "number")) {
                    if (op2 === 0) {
                        console.log("Resultado indefinido, no puede ejecutarse operaci├│n sobre cero.");
                        return null;
                    }
                    return op1 % op2;
                }
                else {
                    console.log("Error de tipos de datos no permitidos realizando una suma");
                    return null;
                }
            }
            //AMPERSON
            else if (this.operador == Operador.AMPERSON) {
                if (typeof (op1 === 'string') && typeof (op2 === 'string')) {
                    return op1.concat(op2.toString());
                }
                else {
                    console.log('Error semantico, Solo se puede concatenar (&) Strings en la linea ' + this.linea + ' y columna ' + this.columna);
                    return null;
                }
            }
            //ELEVADO
            else if (this.operador == Operador.ELEVADO) {
                if (this.op_izquierda.getTipo(ent, arbol) == Tipo_1.Tipo.STRING && this.op_derecha.getTipo(ent, arbol) == Tipo_1.Tipo.INT) {
                    return op1.repeat(Number(op2));
                }
                else {
                    console.log('Error semantico, No se puede completar la accion ^ en la linea ' + this.linea + ' y columna ' + this.columna);
                    return null;
                }
            }
            try {
                //MAYOR QUE
                if (this.operador == Operador.MAYOR_QUE) {
                    return op1 > op2;
                }
                //MENOR QUE
                else if (this.operador == Operador.MENOR_QUE) {
                    return op1 < op2;
                }
                //Mayor o igual
                else if (this.operador == Operador.MAYOR_IGUA_QUE) {
                    return op1 >= op2;
                }
                //menor o igual
                else if (this.operador == Operador.MENOR_IGUA_QUE) {
                    return op1 <= op2;
                }
                //igualacion
                else if (this.operador == Operador.IGUAL_IGUAL) {
                    return op1 == op2;
                }
                //diferente que
                else if (this.operador == Operador.DIFERENTE_QUE) {
                    return op1 != op2;
                }
                //or
                else if (this.operador == Operador.OR) {
                    return op1 || op2;
                }
                //and
                else if (this.operador == Operador.AND) {
                    return op1 && op2;
                }
                //potencia
                else if (this.operador == Operador.POW) {
                    if (typeof (op1 === "number") && typeof (op2 === "number")) {
                        return Math.pow(op1, op2);
                    }
                    else {
                        console.log("Error de tipos de datos no permitidos realizando una potencia");
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            try {
                var op1 = this.op_izquierda.getValorImplicito(ent, arbol);
                if (this.operador == Operador.MENOS_UNARIO) {
                    if (typeof (op1 === "number")) {
                        return -1 * op1;
                    }
                    else {
                        console.log("Error de tipos de datos no permitidos realizando una operaci├│n unaria");
                        return null;
                    }
                }
                else if (this.operador == Operador.NOT) {
                    return !op1;
                }
                else if (this.operador == Operador.SIN) {
                    if (typeof (op1 === "number")) {
                        return Math.sin(this.gradosRadianes(op1));
                    }
                    else {
                        console.log("Error de tipos de datos no permitidos realizando una operacion seno");
                    }
                }
                else if (this.operador == Operador.COS) {
                    if (typeof (op1 === "number")) {
                        return Math.cos(this.gradosRadianes(op1));
                    }
                    else {
                        console.log("Error de tipos de datos no permitidos realizando una operacion coseno");
                    }
                }
                else if (this.operador == Operador.TAN) {
                    if (typeof (op1 === "number")) {
                        return Math.tan(this.gradosRadianes(op1));
                    }
                    else {
                        console.log("Error de tipos de datos no permitidos realizando una operacion tangente");
                    }
                }
                else if (this.operador == Operador.SQRT) {
                    if (typeof (op1 === "number")) {
                        return Math.sqrt(op1);
                    }
                    else {
                        console.log("Error de tipos de datos no permitidos realizando una raiz");
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        return null;
    };
    Operacion.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    Operacion.prototype.gradosRadianes = function (n) {
        return (n * (Math.PI / 180));
    };
    return Operacion;
}());
exports.Operacion = Operacion;

},{"../AST/Tipo":6}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
var Tipo_1 = require("../AST/Tipo");
var Primitivo = /** @class */ (function () {
    function Primitivo(valor, linea, columna) {
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
    }
    Primitivo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Primitivo.prototype.getTipo = function (ent, arbol) {
        var valor = this.getValorImplicito(ent, arbol);
        if (typeof (valor) === 'boolean') {
            return Tipo_1.Tipo.BOOL;
        }
        else if (typeof (valor) === 'string') {
            return Tipo_1.Tipo.STRING;
        }
        else if (typeof (valor) === 'number') {
            if (this.isInt(Number(valor))) {
                return Tipo_1.Tipo.INT;
            }
            return Tipo_1.Tipo.DOUBLE;
        }
        else if (valor === null) {
            return Tipo_1.Tipo.NULL;
        }
        return Tipo_1.Tipo.VOID;
    };
    Primitivo.prototype.getValorImplicito = function (ent, arbol) {
        return this.valor;
    };
    Primitivo.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Primitivo;
}());
exports.Primitivo = Primitivo;

},{"../AST/Tipo":6}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
var Tipo_1 = require("../AST/Tipo");
var Ternario = /** @class */ (function () {
    function Ternario(expr1, expr2, expr3, linea, columna, expresion) {
        this.expresion1 = expr1;
        this.expresion2 = expr2;
        this.expresion3 = expr3;
        this.linea = linea;
        this.columna = columna;
    }
    Ternario.prototype.getTipo = function (ent, arbol) {
        var valorExpr1 = this.expresion1.getValorImplicito(ent, arbol);
        if (typeof (valorExpr1) === 'boolean') {
            if (valorExpr1 == true) {
                return this.expresion2.getTipo(ent, arbol);
            }
            else {
                return this.expresion3.getTipo(ent, arbol);
            }
        }
        else {
            console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea ' + this.linea + ' y columna ' + this.columna);
            return Tipo_1.Tipo.NULL;
        }
    };
    Ternario.prototype.getValorImplicito = function (ent, arbol) {
        var tipo = this.expresion1.getTipo(ent, arbol);
        if (tipo === Tipo_1.Tipo.BOOL) {
            var valorExpr1 = this.expresion1.getValorImplicito(ent, arbol);
            if (valorExpr1 == true) {
                return this.expresion2.getValorImplicito(ent, arbol);
            }
            else {
                return this.expresion3.getValorImplicito(ent, arbol);
            }
        }
        else {
            console.log('Error semantico, el valor de la operacion ternaria no es un booleano en la linea ' + this.linea + ' y columna ' + this.columna);
            return null;
        }
    };
    Ternario.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    return Ternario;
}());
exports.Ternario = Ternario;

},{"../AST/Tipo":6}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
var Asignacion = /** @class */ (function () {
    function Asignacion(id, linea, columna, expresion) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Asignacion.prototype.ejecutar = function (ent, arbol) {
        var _this = this;
        this.id.forEach(function (id) {
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == _this.expresion.getTipo(ent, arbol)) {
                    simbol.valor = _this.expresion.getValorImplicito(ent, arbol);
                }
                else {
                    console.log('Error semantico, El tipo de la variable (' + tipo + ') no concuerda con el tipo asignado (' + _this.expresion.getTipo(ent, arbol) + ') en la linea ' + _this.linea + ' y columna ' + _this.columna);
                }
            }
            else {
                console.log('Error semantico, no existe la variable ' + id + 'en la linea ' + _this.linea + ' y columna ' + _this.columna);
            }
        });
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
// print("hola mundo");
var Break = /** @class */ (function () {
    function Break(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    Break.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Break.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
    };
    return Break;
}());
exports.Break = Break;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continue = void 0;
// print("hola mundo");
var Continue = /** @class */ (function () {
    function Continue(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    Continue.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Continue.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
    };
    return Continue;
}());
exports.Continue = Continue;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
// print("hola mundo");
var Declaracion = /** @class */ (function () {
    function Declaracion(id, tipo, linea, columna, expresion) {
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Declaracion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Declaracion.prototype.ejecutar = function (ent, arbol) {
        var _this = this;
        // console.log('ejecutado...'+ this.id);
        this.id.forEach(function (id) {
            if (ent.existe(id)) {
                console.log('Id ' + id + ' ya existe');
            }
            else {
                if (_this.expresion == null) {
                    var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, _this.getValDefault());
                    ent.agregar(id, simbol);
                }
                else {
                    var tipoExpr = _this.expresion.getTipo(ent, arbol);
                    if (tipoExpr == _this.tipo) {
                        var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, _this.expresion.getValorImplicito(ent, arbol));
                        ent.agregar(id, simbol);
                    }
                    else {
                        console.log('Error semantico, El tipo declarado (' + _this.tipo + ') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea ' + _this.linea + ' y columna ' + _this.columna);
                    }
                }
            }
        });
    };
    Declaracion.prototype.getValDefault = function () {
        if (this.tipo == Tipo_1.Tipo.STRING) {
            return "undefined";
        }
        else if (this.tipo == Tipo_1.Tipo.BOOL) {
            return true;
        }
        else if (this.tipo == Tipo_1.Tipo.INT) {
            return 1;
        }
        else if (this.tipo == Tipo_1.Tipo.CHAR) {
            return 'a';
        }
        else if (this.tipo == Tipo_1.Tipo.DOUBLE) {
            return 1.0;
        }
        else {
            return null;
        }
    };
    Declaracion.prototype.getTipo = function () {
        return "declaracion";
    };
    return Declaracion;
}());
exports.Declaracion = Declaracion;

},{"../AST/Simbolo":5,"../AST/Tipo":6}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArray = void 0;
var Tipo_1 = require("../AST/Tipo");
// print("hola mundo");
var DeclaracionArray = /** @class */ (function () {
    function DeclaracionArray(id, tipo, dimensiones, linea, columna, expresion) {
        this.id = id;
        this.tipo = tipo;
        this.dimensiones = dimensiones;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    DeclaracionArray.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    DeclaracionArray.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
        this.id.forEach(function (id) {
            // if (ent.existe(id) ){
            //     console.log('Id '+ id +' ya existe');
            // }else{
            //     if(this.expresion == null){
            //         let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.getValDefault());
            //         ent.agregar(id,simbol);
            //     }else{
            //         let tipoExpr:Tipo = this.expresion.getTipo(ent,arbol);
            //         if(tipoExpr == this.tipo){
            //             let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.expresion.getValorImplicito(ent,arbol));
            //             ent.agregar(id,simbol);
            //         }else{
            //             console.log('Error semantico, El tipo declarado (' + this.tipo +') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea '+ this.linea + ' y columna ' + this.columna);
            //         }                    
            //     }
            // }
            console.log(id + ' array');
        });
    };
    DeclaracionArray.prototype.getValDefault = function () {
        if (this.tipo == Tipo_1.Tipo.STRING) {
            return "undefined";
        }
        else if (this.tipo == Tipo_1.Tipo.BOOL) {
            return true;
        }
        else if (this.tipo == Tipo_1.Tipo.INT) {
            return 1;
        }
        else if (this.tipo == Tipo_1.Tipo.CHAR) {
            return 'a';
        }
        else if (this.tipo == Tipo_1.Tipo.DOUBLE) {
            return 1.0;
        }
        else {
            return null;
        }
    };
    return DeclaracionArray;
}());
exports.DeclaracionArray = DeclaracionArray;

},{"../AST/Tipo":6}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionStruct = void 0;
// print("hola mundo");
var DeclaracionStruct = /** @class */ (function () {
    function DeclaracionStruct(id, tipo, linea, columna, expresion) {
        this.id = id;
        this.tipo = tipo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    DeclaracionStruct.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    DeclaracionStruct.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
        // this.id.forEach((id:string)=>{
        //     if (ent.existe(id) ){
        //         console.log('Id '+ id +' ya existe');
        //     }else{
        //         if(this.expresion == null){
        //             let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.getValDefault());
        //             ent.agregar(id,simbol);
        //         }else{
        //             let tipoExpr:Tipo = this.expresion.getTipo(ent,arbol);
        //             if(tipoExpr == this.tipo){
        //                 let simbol = new Simbolo(this.tipo,id,this.linea,this.columna,this.expresion.getValorImplicito(ent,arbol));
        //                 ent.agregar(id,simbol);
        //             }else{
        //                 console.log('Error semantico, El tipo declarado (' + this.tipo +') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea '+ this.linea + ' y columna ' + this.columna);
        //             }                    
        //         }
        //     }
        // })
    };
    DeclaracionStruct.prototype.getValDefault = function () {
        // if (this.tipo == Tipo.STRING) {
        //     return "undefined";
        // }else if (this.tipo == Tipo.BOOL){
        //     return true;
        // }else if (this.tipo == Tipo.INT){
        //     return 1;
        // }else if (this.tipo == Tipo.CHAR){
        //     return 'a';
        // }else if (this.tipo == Tipo.DOUBLE) {
        //     return 1.0;
        // }else{
        //     return null;
        // }
    };
    return DeclaracionStruct;
}());
exports.DeclaracionStruct = DeclaracionStruct;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
var DoWhile = /** @class */ (function () {
    function DoWhile(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    DoWhile.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    DoWhile.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return DoWhile;
}());
exports.DoWhile = DoWhile;

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
var For = /** @class */ (function () {
    function For(linea, columna, instrucciones, declAsign, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.declAsign = declAsign;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    For.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    For.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return For;
}());
exports.For = For;

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forin = void 0;
var Forin = /** @class */ (function () {
    function Forin(linea, columna, instrucciones, expresion1, expresion2) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion1 = expresion1;
        this.expresion2 = expresion2;
    }
    Forin.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Forin.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return Forin;
}());
exports.Forin = Forin;

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
var Entorno_1 = require("../AST/Entorno");
var Funcion = /** @class */ (function () {
    function Funcion(nombrefuncion, tipoFuncion, linea, columna, instrucciones, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.tipoFuncion = tipoFuncion;
        this.parametros = parametros;
    }
    Funcion.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Funcion.prototype.ejecutar = function (ent, arbol) {
        var entornoGlobal = new Entorno_1.Entorno(ent);
        //recorro todas las raices  RECURSIVA
        this.instrucciones.forEach(function (element) {
            element.ejecutar(entornoGlobal, arbol);
        });
        // console.log(this.instrucciones);
    };
    Funcion.prototype.getTipo = function () {
        return "funcion";
    };
    return Funcion;
}());
exports.Funcion = Funcion;

},{"../AST/Entorno":4}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionReturn = void 0;
var FuncionReturn = /** @class */ (function () {
    function FuncionReturn(nombrefuncion, linea, columna, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.parametros = parametros;
    }
    FuncionReturn.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    FuncionReturn.prototype.ejecutar = function (ent, arbol) {
        var _this = this;
        var funciones = arbol.funciones;
        funciones.forEach(function (element) {
            if (_this.nombrefuncion == element.nombrefuncion) {
                element.ejecutar(ent, arbol);
                return; // Retornar el valor que retorna la funcion ejecutar
            }
        });
    };
    return FuncionReturn;
}());
exports.FuncionReturn = FuncionReturn;

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parametro = void 0;
var Parametro = /** @class */ (function () {
    function Parametro(id, tipoParametro, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.tipoParametro = tipoParametro;
    }
    Parametro.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Parametro.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...' + this.id);
    };
    return Parametro;
}());
exports.Parametro = Parametro;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
// print("hola mundo");
var Print = /** @class */ (function () {
    function Print(exp, linea, columna, haysalto) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
        this.haysalto = haysalto;
    }
    Print.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Print.prototype.ejecutar = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        if (valor !== null) {
            console.log('>', valor);
            var area = document.getElementById('consola');
            if (this.haysalto) {
                area.value = area.value + valor + "\n";
            }
            else {
                area.value = area.value + valor;
            }
        }
        else {
            console.log('>> Error, no se pueden imprimir valores nulos');
        }
    };
    return Print;
}());
exports.Print = Print;

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
// print("hola mundo");
var Struct = /** @class */ (function () {
    function Struct(id, lista_atributos, linea, columna) {
        this.id = id;
        this.lista_atributos = lista_atributos;
        this.linea = linea;
        this.columna = columna;
    }
    Struct.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Struct.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...' + this.id);
    };
    Struct.prototype.getTipo = function () {
        return "struct";
    };
    return Struct;
}());
exports.Struct = Struct;

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
// print("hola mundo");
var Switch = /** @class */ (function () {
    function Switch(expresion, lista_intstrucciones, linea, columna) {
        this.expresion = expresion;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    Switch.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Switch.prototype.ejecutar = function (ent, arbol) {
        // console.log('ejecutado...'+ this.id);
        // const ast:AST = new AST(this.lista_instrucciones);
        // const entornoGlobal:Entorno = new Entorno(null);
        // //recorro todas las raices  RECURSIVA
        // this.lista_instrucciones.forEach((element:Instruccion) => {
        //     element.ejecutar(entornoGlobal,ast);
        // })
        console.log(this.lista_instrucciones);
    };
    return Switch;
}());
exports.Switch = Switch;

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCaso = void 0;
// print("hola mundo");
var SwitchCaso = /** @class */ (function () {
    function SwitchCaso(id, lista_intstrucciones, linea, columna) {
        this.id = id;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    SwitchCaso.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    SwitchCaso.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...' + this.id);
    };
    return SwitchCaso;
}());
exports.SwitchCaso = SwitchCaso;

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
var While = /** @class */ (function () {
    function While(linea, columna, instrucciones, expresion) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.expresion = expresion;
    }
    While.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    While.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
    };
    return While;
}());
exports.While = While;

},{}],32:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var Gramatica = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,13],$V2=[1,10],$V3=[1,12],$V4=[1,14],$V5=[1,15],$V6=[1,16],$V7=[1,17],$V8=[1,18],$V9=[2,4,10,11,20,73,74,75,76,77],$Va=[1,24],$Vb=[1,25],$Vc=[2,4,10,11,14,20,36,42,46,47,48,54,55,56,61,65,66,73,74,75,76,77],$Vd=[11,67],$Ve=[1,30],$Vf=[1,31],$Vg=[15,18,79],$Vh=[2,88],$Vi=[1,34],$Vj=[1,54],$Vk=[1,55],$Vl=[1,56],$Vm=[1,57],$Vn=[1,58],$Vo=[1,59],$Vp=[1,60],$Vq=[1,61],$Vr=[1,62],$Vs=[1,48],$Vt=[1,49],$Vu=[1,50],$Vv=[1,51],$Vw=[1,52],$Vx=[1,53],$Vy=[2,20],$Vz=[11,13,15,18,23,43,69,78,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,105,106],$VA=[18,69],$VB=[1,95],$VC=[1,92],$VD=[1,77],$VE=[1,78],$VF=[1,86],$VG=[1,87],$VH=[1,88],$VI=[1,89],$VJ=[1,90],$VK=[1,91],$VL=[1,79],$VM=[1,80],$VN=[1,81],$VO=[1,82],$VP=[1,83],$VQ=[1,84],$VR=[1,85],$VS=[1,93],$VT=[1,94],$VU=[15,18,23,43,69,78,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,105,106],$VV=[1,111],$VW=[15,18,23,43,69,78,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103],$VX=[1,142],$VY=[15,18,23,43,69,78,90],$VZ=[15,18,23,43,69,78,89,90,91,92,93,94,95,96,97,98,99,100,101,103],$V_=[15,18,23,43,69,78,89,90,91,92,93,94,95,96,99,100,101],$V$=[15,18,23,43,69,78,89,90,91,92,93,94,95,96],$V01=[1,178],$V11=[1,169],$V21=[1,177],$V31=[1,171],$V41=[1,172],$V51=[1,173],$V61=[1,174],$V71=[1,175],$V81=[1,176],$V91=[14,18],$Va1=[2,4,10,11,14,20,36,42,46,47,48,54,55,56,59,60,61,65,66,73,74,75,76,77],$Vb1=[2,11,14,36,42,46,47,48,54,55,56,61,65,66,73,74,75,76,77],$Vc1=[78,79],$Vd1=[2,65],$Ve1=[1,239],$Vf1=[1,240],$Vg1=[1,248],$Vh1=[14,42,46],$Vi1=[2,48],$Vj1=[1,278],$Vk1=[1,279];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"EOF":4,"instrucciones":5,"instruccion":6,"declaracion_bloque":7,"asignacion_funcion":8,"struct_declaracion":9,"STR_STRUCT":10,"ID_VAR":11,"cuerpo_struct":12,"BRACKI":13,"BRACKD":14,"PUNTCOMA":15,"contenido_struct":16,"declaracion_struct":17,"COMA":18,"tiposVar":19,"VOID":20,"MAIN":21,"PARI":22,"PARD":23,"cuerpoFuncion":24,"parametros_funcion":25,"parametro_funcion":26,"instrucciones_funciones":27,"instruccion_funcion":28,"asignacion_bloque":29,"print_bloque":30,"if_bloque":31,"for_bloque":32,"while_bloque":33,"switch_bloque":34,"funcion_return":35,"STR_SWITCH":36,"expresion":37,"switch_cuerpo":38,"casos_switch":39,"opcional_default":40,"caso_switch":41,"STR_CASE":42,"DOSPUNT":43,"contenido_caso":44,"opcional_break":45,"STR_DEFAULT":46,"BREAK":47,"CONTINUE":48,"nombreVars":49,"asignacion":50,"declaracion_arreglo":51,"arr_decl":52,"nombreAtributos":53,"PRINT":54,"PRINTLN":55,"STR_IF":56,"sinos_bloque":57,"instruccion_devuelta":58,"STR_ELSE":59,"STR_ELSEIF":60,"STR_FOR":61,"decl_asign":62,"STR_IN":63,"arr_begin_end":64,"STR_WHILE":65,"STR_DO":66,"CORCHI":67,"parametros_arreglo":68,"CORCHD":69,"expresion_arreglo":70,"STR_BEGIN":71,"STR_END":72,"STR_STRING":73,"STR_DOUBLE":74,"STR_INTEGER":75,"STR_BOOLEAN":76,"STR_CHAR":77,"OP_CALL":78,"OP_IGUAL":79,"primitivas":80,"logicas":81,"operadores":82,"relacionales":83,"expresion_ternario":84,"incr_decr":85,"nativas":86,"expresion_atributos":87,"OP_TER":88,"OP_AND":89,"OP_OR":90,"OP_DOBIG":91,"OP_DIF":92,"OP_MAYIG":93,"OP_MENIG":94,"OP_MEN":95,"OP_MAY":96,"OP_MULT":97,"OP_DIVI":98,"OP_SUMA":99,"OP_RESTA":100,"OP_AMP":101,"OP_ELV":102,"OP_MOD":103,"OP_NEG":104,"OP_INCR":105,"OP_DECR":106,"STR_POW":107,"STR_SQRT":108,"STR_SIN":109,"STR_COS":110,"STR_TAN":111,"STR_FALSE":112,"STR_TRUE":113,"ENTERO":114,"FLOTANTE":115,"STRINGL":116,"CHARL":117,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",10:"STR_STRUCT",11:"ID_VAR",13:"BRACKI",14:"BRACKD",15:"PUNTCOMA",18:"COMA",20:"VOID",21:"MAIN",22:"PARI",23:"PARD",36:"STR_SWITCH",42:"STR_CASE",43:"DOSPUNT",46:"STR_DEFAULT",47:"BREAK",48:"CONTINUE",54:"PRINT",55:"PRINTLN",56:"STR_IF",59:"STR_ELSE",60:"STR_ELSEIF",61:"STR_FOR",63:"STR_IN",65:"STR_WHILE",66:"STR_DO",67:"CORCHI",69:"CORCHD",71:"STR_BEGIN",72:"STR_END",73:"STR_STRING",74:"STR_DOUBLE",75:"STR_INTEGER",76:"STR_BOOLEAN",77:"STR_CHAR",78:"OP_CALL",79:"OP_IGUAL",88:"OP_TER",89:"OP_AND",90:"OP_OR",91:"OP_DOBIG",92:"OP_DIF",93:"OP_MAYIG",94:"OP_MENIG",95:"OP_MEN",96:"OP_MAY",97:"OP_MULT",98:"OP_DIVI",99:"OP_SUMA",100:"OP_RESTA",101:"OP_AMP",102:"OP_ELV",103:"OP_MOD",104:"OP_NEG",105:"OP_INCR",106:"OP_DECR",107:"STR_POW",108:"STR_SQRT",109:"STR_SIN",110:"STR_COS",111:"STR_TAN",112:"STR_FALSE",113:"STR_TRUE",114:"ENTERO",115:"FLOTANTE",116:"STRINGL",117:"CHARL"},
productions_: [0,[3,1],[3,2],[5,2],[5,1],[6,1],[6,1],[6,1],[6,1],[9,3],[12,3],[12,4],[16,1],[16,3],[17,2],[17,2],[8,5],[8,6],[25,3],[25,1],[25,0],[26,2],[24,3],[24,2],[27,2],[27,1],[28,1],[28,1],[28,1],[28,1],[28,1],[28,1],[28,1],[28,1],[35,5],[34,5],[34,1],[38,2],[38,4],[39,2],[39,1],[41,4],[44,2],[44,1],[40,3],[40,0],[45,2],[45,2],[45,0],[7,3],[7,4],[7,4],[7,1],[51,4],[51,5],[29,3],[30,5],[30,5],[31,6],[31,5],[58,1],[57,2],[57,2],[57,6],[57,5],[57,0],[32,9],[32,5],[32,5],[32,5],[33,5],[33,6],[62,3],[62,2],[52,3],[52,2],[68,1],[68,3],[70,1],[64,6],[64,6],[64,6],[64,6],[19,1],[19,1],[19,1],[19,1],[19,1],[49,1],[49,3],[53,3],[53,1],[50,2],[37,1],[37,1],[37,1],[37,1],[37,1],[37,1],[37,1],[37,1],[37,1],[87,3],[84,5],[81,3],[81,3],[83,3],[83,3],[83,3],[83,3],[83,3],[83,3],[82,3],[82,3],[82,3],[82,3],[82,3],[82,3],[82,3],[82,3],[82,2],[82,2],[85,2],[85,2],[86,6],[86,4],[86,4],[86,4],[86,4],[80,1],[80,1],[80,1],[80,1],[80,1],[80,1],[80,1],[80,4]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
console.log("EOF encontrado");return [];
break;
case 2:
this.$ = $$[$0-1];return this.$;
break;
case 3: case 39:
$$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 4: case 12: case 19: case 40: case 88: case 91:
this.$ = [$$[$0]];
break;
case 5: case 6: case 7: case 26: case 27: case 28: case 29: case 30: case 31: case 32: case 33: case 52: case 78: case 92: case 93: case 94: case 95: case 96: case 97: case 98: case 99: case 100: case 101:
this.$ = $$[$0];
break;
case 9:
this.$ = new Struct($$[$0-1],$$[$0],_$[$0-2].first_line,_$[$0-2].first_column); 
break;
case 10:
this.$ = []; 
break;
case 11:
this.$ = $$[$0-2];
break;
case 13:
$$[$0].push($$[$0-2]); this.$= $$[$0]; 
break;
case 14: case 15:
this.$ = new Declaracion($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 16:
this.$ = new Funcion("main","void",_$[$0-4].first_line,_$[$0-4].first_column,$$[$0]);
break;
case 17:
this.$ = new Funcion($$[$0-4],$$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0],$$[$0-2]);
break;
case 18:
$$[$0].push($$[$0-2]);this.$ = $$[$0];
break;
case 20: case 75:
this.$ = [];
break;
case 21:
this.$ = new Parametro($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 22: case 119:
this.$ = $$[$0-1];
break;
case 23: case 45: case 48:
this.$ = null;
break;
case 24:
        
        $$[$0-1].push($$[$0]);
        this.$ = $$[$0-1];
    
break;
case 25:
                
        this.$ = [$$[$0]];
    
break;
case 34:
this.$ = new FuncionReturn($$[$0-4],_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-2]);
break;
case 35:
this.$ = new Switch($$[$0-2],$$[$0],_$[$0-4].first_line,_$[$0-4].first_column);
break;
case 37:
this.$= [];
break;
case 38:

            if ($$[$0-1] != null){
                $$[$0-2].push($$[$0-1]);
            }
            this.$ = $$[$0-2];
        
break;
case 41:
this.$ = new SwitchCaso($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 42:

            if ($$[$0] != null){
                $$[$0-1].push($$[$0]);
            }
            this.$ = $$[$0-1];
        
break;
case 43:

            if ($$[$0] == null){
                this.$ = [];
            }else{
                this.$ = [$$[$0]];
            }
        
break;
case 44:
this.$ = new SwitchCaso('DEFAULT',$$[$0],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 46:
this.$ = new Break(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 47:
this.$ = new Continue(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 49:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,null);
break;
case 50:
this.$ = new Declaracion($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 51:
this.$ =  new DeclaracionStruct($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 53:
this.$ = new DeclaracionArray($$[$0-1],$$[$0-3],$$[$0-2],_$[$0-3].first_line,_$[$0-3].first_column,null);
break;
case 54:
this.$ = new DeclaracionArray($$[$0-2],$$[$0-4],$$[$0-3],_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-1]);
break;
case 55:
this.$ = new Asignacion($$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-1]);
break;
case 56:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,false);
break;
case 57:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,true);
break;
case 60: case 76:
this.$ = [$$[$0]]
break;
case 66:
this.$ = new For(_$[$0-8].first_line,_$[$0-8].first_column,$$[$0],$$[$0-6],$$[$0-4],$$[$0-2]);
break;
case 67: case 68: case 69:
this.$ = new Forin(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-3],$$[$0-1]);
break;
case 70:
this.$ = new While(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-2]);
break;
case 71:
this.$ = new DoWhile(_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-4],$$[$0-1]);
break;
case 72:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0]);
break;
case 73:
this.$ = new Asignacion($$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column,$$[$0]);
break;
case 74:
this.$ = $$[$0-1]
break;
case 77:
$$[$0-2].push($$[$0]);this.$ = $$[$0-2];
break;
case 79:
this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],$$[$0-1]);
break;
case 80:
let beg = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg,$$[$0-1]);
break;
case 81:
let beg1 = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); let end1 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg1,end1);
break;
case 82:
let beg2 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],beg2);
break;
case 83:
this.$ = Tipo.STRING;
break;
case 84:
this.$ = Tipo.DOUBLE;
break;
case 85:
this.$ = Tipo.INT;
break;
case 86:
this.$ = Tipo.BOOL;
break;
case 87:
this.$ = Tipo.CHAR;
break;
case 89:
 $$[$0-2].push($$[$0]);this.$ = $$[$0-2];
break;
case 90:
$$[$0-2].push($$[$0]); this.$ = $$[$0-2];
break;
case 102:
this.$ = new AccesoAtributo($$[$0-2],$$[$0],_$[$0-2].first_line, _$[$0-2].first_column);
break;
case 103:
this.$ = new Ternario($$[$0-4],$$[$0-2],$$[$0],_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 104:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 105:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 106:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 107:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 108:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 109:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 110:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 111:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 112:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 113:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 114:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 115:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 116:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AMPERSON, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 117:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.ELEVADO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 118:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 120:
this.$ = new Operacion($$[$0],null,Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 121:
this.$ = new Operacion($$[$0],null,Operador.NOT, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 122:
this.$ = new Operacion($$[$0-1],null,Operador.INCREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 123:
this.$ = new Operacion($$[$0-1],null,Operador.DECREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 124:
this.$ = new Operacion($$[$0-3],$$[$0-1],Operador.POW, _$[$0-5].first_line, _$[$0-5].first_column);
break;
case 125:
this.$ = new Operacion($$[$0-1],null,Operador.SQRT, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 126:
this.$ = new Operacion($$[$0-1],null,Operador.SIN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 127:
this.$ = new Operacion($$[$0-1],null,Operador.COS, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 128:
this.$ = new Operacion($$[$0-1],null,Operador.TAN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 129:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 130:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 131: case 132:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 133: case 134:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 135:
this.$ = new AccesoVariable($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 136:
this.$ = new FuncionReturn($$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
}
},
table: [{2:$V0,3:1,4:[1,2],5:3,6:4,7:5,8:6,9:7,10:$V1,11:$V2,19:9,20:$V3,51:11,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},{1:[3]},{1:[2,1]},{2:$V0,4:[1,19],6:20,7:5,8:6,9:7,10:$V1,11:$V2,19:9,20:$V3,51:11,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},o($V9,[2,4]),o($V9,[2,5]),o($V9,[2,6]),o($V9,[2,7]),o($V9,[2,8]),{11:[1,22],49:21,52:23,67:$Va},{11:$Vb},o($Vc,[2,52]),{21:[1,26]},{11:[1,27]},o($Vd,[2,83]),o($Vd,[2,84]),o($Vd,[2,85]),o($Vd,[2,86]),o($Vd,[2,87]),{1:[2,2]},o($V9,[2,3]),{15:[1,28],18:$Ve,50:29,79:$Vf},o($Vg,$Vh,{22:[1,32]}),{11:$Vi,49:33},{11:$Vj,22:$Vk,37:38,52:46,67:$Va,68:35,69:[1,36],70:37,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{50:63,79:$Vf},{22:[1,64]},{12:65,13:[1,66]},o($Vc,[2,49]),{15:[1,67]},{11:[1,68]},{11:$Vj,22:$Vk,37:69,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{19:72,23:$Vy,25:70,26:71,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},{15:[1,73],18:$Ve,50:74,79:$Vf},o($Vg,$Vh),{18:[1,76],69:[1,75]},o($Vz,[2,75]),o($VA,[2,76]),o($VA,[2,78],{78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),o($VU,[2,93]),o($VU,[2,94]),o($VU,[2,95]),o($VU,[2,96]),o($VU,[2,97]),o($VU,[2,98]),o($VU,[2,99]),o($VU,[2,100]),o($VU,[2,101]),o($VU,[2,129]),o($VU,[2,130]),o($VU,[2,131]),o($VU,[2,132]),o($VU,[2,133]),o($VU,[2,134]),o($VU,[2,135],{22:[1,96]}),{11:$Vj,22:$Vk,37:97,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:98,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:99,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{22:[1,100]},{22:[1,101]},{22:[1,102]},{22:[1,103]},{22:[1,104]},{15:[1,105]},{23:[1,106]},o($V9,[2,9]),{11:$VV,14:[1,107],16:108,17:109,19:110,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},o($Vc,[2,50]),o($Vg,[2,89]),{15:[2,92],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{23:[1,112]},{18:[1,113],23:[2,19]},{11:[1,114]},o($Vc,[2,53]),{15:[1,115]},o($Vz,[2,74]),{11:$Vj,22:$Vk,37:38,52:46,67:$Va,68:116,70:37,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:117,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:118,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:119,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:120,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:121,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:122,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:123,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:124,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:125,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:126,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:127,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:128,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:129,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:130,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:131,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:132,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},o($VU,[2,122]),o($VU,[2,123]),{11:$Vj,22:$Vk,37:133,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{19:72,23:$Vy,25:134,26:71,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},{23:[1,135],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},o($VW,[2,120],{105:$VS,106:$VT}),o($VW,[2,121],{105:$VS,106:$VT}),{11:$Vj,22:$Vk,37:136,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:137,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:138,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:139,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:140,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},o($Vc,[2,51]),{13:$VX,24:141},{15:[1,143]},{14:[1,144]},{14:[2,12],18:[1,145]},{11:[1,146]},{11:[1,147]},{13:$VX,24:148},{19:72,23:$Vy,25:149,26:71,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},o([18,23],[2,21]),o($Vc,[2,54]),o($VA,[2,77]),o([15,18,23,43,69,78,89,90],[2,104],{88:$VC,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),o($VY,[2,105],{88:$VC,89:$VD,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),o($VZ,[2,112],{88:$VC,102:$VQ,105:$VS,106:$VT}),o($VZ,[2,113],{88:$VC,102:$VQ,105:$VS,106:$VT}),o($V_,[2,114],{88:$VC,97:$VL,98:$VM,102:$VQ,103:$VR,105:$VS,106:$VT}),o($V_,[2,115],{88:$VC,97:$VL,98:$VM,102:$VQ,103:$VR,105:$VS,106:$VT}),o($V_,[2,116],{88:$VC,97:$VL,98:$VM,102:$VQ,103:$VR,105:$VS,106:$VT}),o($VW,[2,117],{105:$VS,106:$VT}),o($VZ,[2,118],{88:$VC,102:$VQ,105:$VS,106:$VT}),o($V$,[2,106],{88:$VC,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),o($V$,[2,107],{88:$VC,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),o($V$,[2,108],{88:$VC,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),o($V$,[2,109],{88:$VC,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),o($V$,[2,110],{88:$VC,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),o($V$,[2,111],{88:$VC,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),{43:[1,150],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},o($VY,[2,102],{88:$VC,89:$VD,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT}),{23:[1,151]},o($VU,[2,119]),{18:[1,152],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{23:[1,153],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{23:[1,154],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{23:[1,155],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{23:[1,156],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},o($V9,[2,16]),{2:$V01,7:160,11:$V11,14:[1,158],19:168,27:157,28:159,29:161,30:162,31:163,32:164,33:165,34:166,35:167,36:$V21,51:11,53:170,54:$V31,55:$V41,56:$V51,61:$V61,65:$V71,66:$V81,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},o($V9,[2,10]),{15:[1,179]},{11:$VV,16:180,17:109,19:110,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},o($V91,[2,14]),o($V91,[2,15]),o($V9,[2,17]),{23:[2,18]},{11:$Vj,22:$Vk,37:181,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},o($VU,[2,136]),{11:$Vj,22:$Vk,37:182,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},o($VU,[2,125]),o($VU,[2,126]),o($VU,[2,127]),o($VU,[2,128]),{2:$V01,7:160,11:$V11,14:[1,183],19:168,28:184,29:161,30:162,31:163,32:164,33:165,34:166,35:167,36:$V21,51:11,53:170,54:$V31,55:$V41,56:$V51,61:$V61,65:$V71,66:$V81,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},o($Va1,[2,23]),o($Vb1,[2,25]),o($Vb1,[2,26]),o($Vb1,[2,27]),o($Vb1,[2,28]),o($Vb1,[2,29]),o($Vb1,[2,30]),o($Vb1,[2,31]),o($Vb1,[2,32]),o($Vb1,[2,33]),{11:$Vi,49:21,52:23,67:$Va},o($Vc1,[2,91],{11:$Vb,22:[1,185]}),{50:186,78:[1,187],79:$Vf},{22:[1,188]},{22:[1,189]},{22:[1,190]},{11:[1,192],22:[1,191]},{22:[1,193]},{13:$VX,24:194},{22:[1,195]},o($Vb1,[2,36]),o($V9,[2,11]),{14:[2,13]},o($VW,[2,103],{105:$VS,106:$VT}),{23:[1,196],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},o($Va1,[2,22]),o($Vb1,[2,24]),{19:72,23:$Vy,25:197,26:71,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},{15:[1,198]},{11:[1,199]},{11:$Vj,22:$Vk,37:200,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:201,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:202,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vi,19:204,49:205,62:203,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},{63:[1,206]},{11:$Vj,22:$Vk,37:207,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{65:[1,208]},{11:$Vj,22:$Vk,37:209,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},o($VU,[2,124]),{23:[1,210]},o($Vb1,[2,55]),o($Vc1,[2,90]),{23:[1,211],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{23:[1,212],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{23:[1,213],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{15:[1,214]},{11:$Vi,49:215},{18:$Ve,50:216,79:$Vf},{11:[1,217],52:218,64:219,67:$Va},{23:[1,220],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{22:[1,221]},{23:[1,222],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{15:[1,223]},{15:[1,224]},{15:[1,225]},{2:$V01,7:160,11:$V11,13:$VX,19:168,24:226,28:227,29:161,30:162,31:163,32:164,33:165,34:166,35:167,36:$V21,51:11,53:170,54:$V31,55:$V41,56:$V51,61:$V61,65:$V71,66:$V81,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},{11:$Vj,22:$Vk,37:228,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{18:$Ve,50:229,79:$Vf},{15:[2,73]},{13:$VX,24:230,67:[1,231]},{13:$VX,24:232},{13:$VX,24:233},{13:$VX,24:234},{11:$Vj,22:$Vk,37:235,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{13:[1,237],38:236},o($Vb1,[2,34]),o($Vb1,[2,56]),o($Vb1,[2,57]),o($Vb1,$Vd1,{57:238,59:$Ve1,60:$Vf1}),o($Vb1,[2,59]),{15:[1,241],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{15:[2,72]},o($Vb1,[2,67]),{11:$Vj,22:$Vk,37:242,52:46,67:$Va,71:[1,243],80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},o($Vb1,[2,68]),o($Vb1,[2,69]),o($Vb1,[2,70]),{23:[1,244],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},o($Vb1,[2,35]),{14:[1,245],39:246,41:247,42:$Vg1},o($Vb1,[2,58]),{2:$V01,7:160,11:$V11,13:$VX,19:168,24:249,28:251,29:161,30:162,31:163,32:164,33:165,34:166,35:167,36:$V21,51:11,53:170,54:$V31,55:$V41,56:$V51,58:250,61:$V61,65:$V71,66:$V81,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},{22:[1,252]},{11:$Vj,22:$Vk,37:253,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{43:[1,254],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{43:[1,255]},o($Vb1,[2,71]),o($Vb1,[2,37]),{14:[2,45],40:256,41:257,42:$Vg1,46:[1,258]},o($Vh1,[2,40]),{11:$Vj,22:$Vk,37:259,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},o($Vb1,[2,61]),o($Vb1,[2,62]),o($Vb1,[2,60]),{11:$Vj,22:$Vk,37:260,52:46,67:$Va,80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{23:[1,261],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{11:$Vj,22:$Vk,37:262,52:46,67:$Va,72:[1,263],80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{11:$Vj,22:$Vk,37:264,52:46,67:$Va,72:[1,265],80:39,81:40,82:41,83:42,84:43,85:44,86:45,87:47,100:$Vl,104:$Vm,107:$Vn,108:$Vo,109:$Vp,110:$Vq,111:$Vr,112:$Vs,113:$Vt,114:$Vu,115:$Vv,116:$Vw,117:$Vx},{14:[1,266]},o($Vh1,[2,39]),{43:[1,267]},{43:[1,268],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{23:[1,269],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{13:$VX,24:270},{69:[1,271],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{69:[1,272]},{69:[1,273],78:$VB,88:$VC,89:$VD,90:$VE,91:$VF,92:$VG,93:$VH,94:$VI,95:$VJ,96:$VK,97:$VL,98:$VM,99:$VN,100:$VO,101:$VP,102:$VQ,103:$VR,105:$VS,106:$VT},{69:[1,274]},o($Vb1,[2,38]),{2:$V01,7:160,11:$V11,14:$Vi1,19:168,27:276,28:159,29:161,30:162,31:163,32:164,33:165,34:166,35:167,36:$V21,44:275,45:277,47:$Vj1,48:$Vk1,51:11,53:170,54:$V31,55:$V41,56:$V51,61:$V61,65:$V71,66:$V81,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},o($Vh1,$Vi1,{51:11,28:159,7:160,29:161,30:162,31:163,32:164,33:165,34:166,35:167,19:168,53:170,27:276,45:277,44:280,2:$V01,11:$V11,36:$V21,47:$Vj1,48:$Vk1,54:$V31,55:$V41,56:$V51,61:$V61,65:$V71,66:$V81,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8}),{2:$V01,7:160,11:$V11,13:$VX,19:168,24:281,28:251,29:161,30:162,31:163,32:164,33:165,34:166,35:167,36:$V21,51:11,53:170,54:$V31,55:$V41,56:$V51,58:282,61:$V61,65:$V71,66:$V81,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8},o($Vb1,[2,66]),{13:[2,79]},{13:[2,82]},{13:[2,80]},{13:[2,81]},{14:[2,44]},o($Vh1,$Vi1,{51:11,7:160,29:161,30:162,31:163,32:164,33:165,34:166,35:167,19:168,53:170,28:184,45:283,2:$V01,11:$V11,36:$V21,47:$Vj1,48:$Vk1,54:$V31,55:$V41,56:$V51,61:$V61,65:$V71,66:$V81,73:$V4,74:$V5,75:$V6,76:$V7,77:$V8}),o($Vh1,[2,43]),{15:[1,284]},{15:[1,285]},o($Vh1,[2,41]),o($Vb1,$Vd1,{57:286,59:$Ve1,60:$Vf1}),o($Vb1,[2,64]),o($Vh1,[2,42]),o($Vh1,[2,46]),o($Vh1,[2,47]),o($Vb1,[2,63])],
defaultActions: {2:[2,1],19:[2,2],149:[2,18],180:[2,13],216:[2,73],229:[2,72],271:[2,79],272:[2,82],273:[2,80],274:[2,81],275:[2,44]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};

    //const {ErrorCom} = require(['../ts/ErrorCom']);
    /*---CLASES IMPORTADAS---*/
    const {Tipo} = require("../dist/AST/Tipo");
    const {Print} = require("../dist/Instrucciones/Print");
    const {Declaracion} = require("../dist/Instrucciones/Declaracion");
    const {DeclaracionArray} = require("../dist/Instrucciones/DeclaracionArray");
    const {Asignacion} = require("../dist/Instrucciones/Asignacion");
    const {While} = require("../dist/Instrucciones/While");
    const {DoWhile} = require("../dist/Instrucciones/DoWhile");
    const {Funcion} = require("../dist/Instrucciones/Funcion");
    const {Struct} = require("../dist/Instrucciones/Struct");
    const {Switch} = require("../dist/Instrucciones/Switch");
    const {Ternario} = require("../dist/Expresiones/Ternario");
    const {AccesoAtributo} = require("../dist/Expresiones/AccesoAtributo");
    const {DeclaracionStruct} = require("../dist/Instrucciones/DeclaracionStruct");
    const {SwitchCaso} = require("../dist/Instrucciones/SwitchCaso");
    const {Break} = require("../dist/Instrucciones/Break");
    const {Continue} = require("../dist/Instrucciones/Continue");
    const {FuncionReturn} = require("../dist/Instrucciones/FuncionReturn");
    const {Parametro} = require("../dist/Instrucciones/Parametro");
    const {For} = require("../dist/Instrucciones/For");
    const {Forin} = require("../dist/Instrucciones/Forin");
    const {Primitivo} = require("../dist/Expresiones/Primitivo");
    const {AccesoVariable} = require("../dist/Expresiones/AccesoVariable");
    const {ArrbegEnd} = require("../dist/Expresiones/ArrbegEnd");
    const {Operacion, Operador} = require("../dist/Expresiones/Operacion");
    const {Objeto} = require("../dist/Expresiones/Objeto");
    const {Atributo} = require("../dist/Expresiones/Atributo");

    /*---CODIGO INCRUSTADO---*/
    var errores = [
        "Se esperaba una instruccion como : "
    ];

    function genError(desc,linea,columna,val){
        //let errorCom = new ErrorCom("Sintactico",linea,columna,errores[desc],val);
        return errorCom;
    }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"ranges":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip comments */
break;
case 1:this.begin('comment');
break;
case 2:this.popState();
break;
case 3:/* skip comment content*/
break;
case 4:/* skip whitespace */
break;
case 5:return 13; 
break;
case 6:return 14;
break;
case 7:return 22;
break;
case 8:return 23;
break;
case 9:return 67;
break;
case 10:return 69;
break;
case 11:return 18;
break;
case 12:return 43;
break;
case 13:return 15;
break;
case 14:return "PRINTLN";
break;
case 15:return "PRINT";
break;
case 16:return 20;
break;
case 17:return 21;
break;
case 18:return 56;
break;
case 19:return 60;
break;
case 20:return 59;
break;
case 21:return 65;
break;
case 22:return 66;
break;
case 23:return 61;
break;
case 24:return 47;
break;
case 25:return 48;
break;
case 26:return 36;
break;
case 27:return 42;
break;
case 28:return 46;
break;
case 29:return 113;
break;
case 30:return 112;
break;
case 31:return 'STR_RETURN';
break;
case 32:return 76;
break;
case 33:return 75;
break;
case 34:return 74;
break;
case 35:return 77;
break;
case 36:return 73;
break;
case 37:return 10;
break;
case 38:return 71;
break;
case 39:return 72;
break;
case 40:return 'STR_FUNCTION';
break;
case 41:return 63;
break;
case 42:return 107;
break;
case 43:return 108;
break;
case 44:return 109;
break;
case 45:return 110;
break;
case 46:return 111;
break;
case 47:return 'STR_PARSE';
break;
case 48:return 'STR_TOINT';
break;
case 49:return 'STR_TODOUBLE';
break;
case 50:return 'STR_string';
break;
case 51:return 'STR_TYPEOF';
break;
case 52:return 'STR_PUSH';
break;
case 53:return 'STR_POP';
break;
case 54:return 'CHARPOS';
break;
case 55:return 'SUBSTRING';
break;
case 56:return 'LENGTH';
break;
case 57:return 'UPPERCASE';
break;
case 58:return 'LOWERCASE';
break;
case 59:return 94;
break;
case 60:return 95;
break;
case 61:return 91;
break;
case 62:return 93;
break;
case 63:return 96;
break;
case 64:return 92;
break;
case 65:return 90;
break;
case 66:return 89;
break;
case 67:return 101;
break;
case 68:return 104;
break;
case 69:return 79;
break;
case 70:return 'OP_MASIG';
break;
case 71:return 'OP_RESIG';
break;
case 72:return 'OP_PORIG';
break;
case 73:return 'OP_DIVIG';
break;
case 74:return 'OP_MODIG';
break;
case 75:return 105;
break;
case 76:return 99;
break;
case 77:return 106;
break;
case 78:return 100;
break;
case 79:return 97;
break;
case 80:return 98;
break;
case 81:return 103;
break;
case 82:return 78;
break;
case 83:return 102;
break;
case 84:return 88;
break;
case 85:return 'OP_HASH';
break;
case 86:return 'STR_NULL';
break;
case 87:return 11;
break;
case 88:return 11;
break;
case 89:return 115;
break;
case 90:return 114;
break;
case 91:yy_.yytext = yy_.yytext.slice(1,-1); return 116;
break;
case 92:yy_.yytext = yy_.yytext.slice(1,-1); return 116;
break;
case 93:return 117;
break;
case 94:return 117;
break;
case 95:return 4;
break;
case 96:return 'INVALID';
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*)/,/^(?:\*\/)/,/^(?:.)/,/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?::)/,/^(?:;)/,/^(?:println\b)/,/^(?:print\b)/,/^(?:void\b)/,/^(?:main\b)/,/^(?:if\b)/,/^(?:elseif\b)/,/^(?:else\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:return\b)/,/^(?:boolean\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:String\b)/,/^(?:struct\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:function\b)/,/^(?:in\b)/,/^(?:pow\b)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:length\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:<=)/,/^(?:<)/,/^(?:==)/,/^(?:>=)/,/^(?:>)/,/^(?:!=)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:&)/,/^(?:!)/,/^(?:=)/,/^(?:\+=)/,/^(?:-=)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:%=)/,/^(?:\+\+)/,/^(?:\+)/,/^(?:--)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:\.)/,/^(?:\^)/,/^(?:\?)/,/^(?:#)/,/^(?:null\b)/,/^(?:[A-Z][a-zA-Z0-9_]*)/,/^(?:[a-zA-Z][a-zA-Z0-9_]*)/,/^(?:(((0|([1-9])([0-9])*))\.((0|([1-9])([0-9])*))?(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|\.((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD])(?=([^\w]|$)))/,/^(?:((0|([1-9])([0-9])*)))/,/^(?:"")/,/^(?:"([^"]|(\\.))*")/,/^(?:\\'([^']|(\\.))*\\')/,/^(?:\\'\\')/,/^(?:$)/,/^(?:.)/],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = Gramatica;
exports.Parser = Gramatica.Parser;
exports.parse = function () { return Gramatica.parse.apply(Gramatica, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../dist/AST/Tipo":6,"../dist/Expresiones/AccesoAtributo":7,"../dist/Expresiones/AccesoVariable":8,"../dist/Expresiones/ArrbegEnd":9,"../dist/Expresiones/Atributo":10,"../dist/Expresiones/Objeto":11,"../dist/Expresiones/Operacion":12,"../dist/Expresiones/Primitivo":13,"../dist/Expresiones/Ternario":14,"../dist/Instrucciones/Asignacion":15,"../dist/Instrucciones/Break":16,"../dist/Instrucciones/Continue":17,"../dist/Instrucciones/Declaracion":18,"../dist/Instrucciones/DeclaracionArray":19,"../dist/Instrucciones/DeclaracionStruct":20,"../dist/Instrucciones/DoWhile":21,"../dist/Instrucciones/For":22,"../dist/Instrucciones/Forin":23,"../dist/Instrucciones/Funcion":24,"../dist/Instrucciones/FuncionReturn":25,"../dist/Instrucciones/Parametro":26,"../dist/Instrucciones/Print":27,"../dist/Instrucciones/Struct":28,"../dist/Instrucciones/Switch":29,"../dist/Instrucciones/SwitchCaso":30,"../dist/Instrucciones/While":31,"_process":3,"fs":1,"path":2}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = void 0;
var AST = /** @class */ (function () {
    function AST(instrucciones, structs, funciones) {
        this.instrucciones = instrucciones;
        this.structs = structs;
        this.funciones = funciones;
    }
    return AST;
}());
exports.AST = AST;

},{}],34:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST_1 = require("./AST/AST");
var Entorno_1 = require("./AST/Entorno");
var gramatica = require('../jison/Gramatica');
window.ejecutarCodigo = function (entrada) {
    //Reiniciar consola
    reiniciarConsola();
    //traigo todas las raices    
    var instrucciones = gramatica.parse(entrada);
    console.log(instrucciones);
    //Obtengo las funciones y strucs globales y se los asigno al ast
    var funcionesG = revisarFuncionesGlobales(instrucciones);
    var structsG = revisarStructsGlobales(instrucciones);
    var ast = new AST_1.AST(instrucciones, structsG, funcionesG);
    var entornoGlobal = generarEntornoGlobal(ast);
    console.log(entornoGlobal);
    //Buscar la funcion main    
    funcionesG.forEach(function (element) {
        if (element.nombrefuncion == "main") {
            console.log("Se ejecutara");
            element.ejecutar(entornoGlobal, ast);
        }
    });
};
function reiniciarConsola() {
    var areaConsola = document.getElementById('consola');
    areaConsola.value = "";
}
function revisarFuncionesGlobales(instrucciones) {
    var funciones = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "funcion") {
            funciones.push(element);
        }
    });
    return funciones;
}
function revisarStructsGlobales(instrucciones) {
    var structs = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "struct") {
            structs.push(element);
        }
    });
    return structs;
}
function generarEntornoGlobal(ast) {
    var entornoGlobal = new Entorno_1.Entorno(null);
    var instrucciones = ast.instrucciones;
    var declaracionesG = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "declaracion") {
            declaracionesG.push(element);
        }
    });
    declaracionesG.forEach(function (element) {
        element.ejecutar(entornoGlobal, ast);
    });
    return entornoGlobal;
}
// ejecutarCodigo(`int id12;
// int var2;`)

},{"../jison/Gramatica":32,"./AST/AST":33,"./AST/Entorno":34}]},{},[35]);

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
exports.AST = void 0;
var AST = /** @class */ (function () {
    function AST(instrucciones) {
        this.instrucciones = instrucciones;
        this.structs = [];
        this.funciones = [];
    }
    return AST;
}());
exports.AST = AST;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entorno = void 0;
var Entorno = /** @class */ (function () {
    function Entorno(anterior) {
        this.tabla = {};
        this.anterior = anterior;
    }
    Entorno.prototype.agregar = function (id, simbolo) {
        id = id.toLowerCase();
        simbolo.indentificador = simbolo.indentificador.toLowerCase();
        this.tabla[id] = simbolo;
    };
    Entorno.prototype.eliminar = function (id) {
        id = id.toLowerCase();
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
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            var value = e.tabla[id];
            if (value !== undefined) {
                return true;
            }
        }
        return false;
    };
    Entorno.prototype.existeEnActual = function (id) {
        id = id.toLowerCase();
        if (this.tabla[id] !== undefined) {
            return true;
        }
        return false;
    };
    Entorno.prototype.getSimbolo = function (id) {
        id = id.toLowerCase();
        for (var e = this; e != null; e = e.anterior) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
        }
        return null;
    };
    Entorno.prototype.reemplazar = function (id, nuevoValor) {
        id = id.toLowerCase();
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
    Tipo[Tipo["ARRAY"] = 8] = "ARRAY";
})(Tipo = exports.Tipo || (exports.Tipo = {}));

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../AST/Entorno":5}],9:[function(require,module,exports){
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
    Operador[Operador["DESCONOCIDO"] = 17] = "DESCONOCIDO";
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
        if (this.operador !== Operador.MENOS_UNARIO && this.operador !== Operador.NOT) {
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
        }
        else {
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
        }
        return null;
    };
    Operacion.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return Operacion;
}());
exports.Operacion = Operacion;

},{"../AST/Tipo":6}],10:[function(require,module,exports){
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

},{"../AST/Tipo":6}],11:[function(require,module,exports){
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
        console.log('ejecutado...' + this.id);
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
// print("hola mundo");
var Declaracion = /** @class */ (function () {
    function Declaracion(id, tipo, linea, columna, expresion) {
        if (expresion === void 0) { expresion = null; }
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
        console.log('ejecutado...' + this.id);
    };
    return Declaracion;
}());
exports.Declaracion = Declaracion;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
var AST_1 = require("../AST/AST");
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
        console.log('ejecutado funcion ...' + this.nombrefuncion);
        var ast = new AST_1.AST(this.instrucciones);
        var entornoGlobal = new Entorno_1.Entorno(null);
        //recorro todas las raices  RECURSIVA
        this.instrucciones.forEach(function (element) {
            element.ejecutar(entornoGlobal, ast);
        });
        // console.log(this.instrucciones);
    };
    return Funcion;
}());
exports.Funcion = Funcion;

},{"../AST/AST":4,"../AST/Entorno":5}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
// print("hola mundo");
var Print = /** @class */ (function () {
    function Print(exp, linea, columna) {
        this.expresion = exp;
        this.linea = linea;
        this.columna = columna;
    }
    Print.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Print.prototype.ejecutar = function (ent, arbol) {
        var valor = this.expresion.getValorImplicito(ent, arbol);
        if (valor !== null) {
            console.log('>', valor);
        }
        else {
            console.log('>> Error, no se pueden imprimir valores nulos');
        }
    };
    return Print;
}());
exports.Print = Print;

},{}],18:[function(require,module,exports){
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
    return Struct;
}());
exports.Struct = Struct;

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,9],$V1=[1,13],$V2=[1,19],$V3=[1,12],$V4=[1,14],$V5=[1,15],$V6=[1,16],$V7=[1,17],$V8=[1,18],$V9=[2,4,11,12,21,46,47,48,49,50],$Va=[1,25],$Vb=[16,51],$Vc=[2,51],$Vd=[1,28],$Ve=[1,44],$Vf=[1,45],$Vg=[1,39],$Vh=[1,40],$Vi=[1,41],$Vj=[1,42],$Vk=[1,43],$Vl=[2,4,11,12,15,21,31,37,41,42,43,46,47,48,49,50],$Vm=[2,21],$Vn=[1,69],$Vo=[1,54],$Vp=[1,55],$Vq=[1,63],$Vr=[1,64],$Vs=[1,65],$Vt=[1,66],$Vu=[1,67],$Vv=[1,68],$Vw=[1,56],$Vx=[1,57],$Vy=[1,58],$Vz=[1,59],$VA=[1,60],$VB=[1,61],$VC=[1,62],$VD=[16,24,38,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72],$VE=[1,77],$VF=[1,99],$VG=[16,24,38,58,59,60,61,62,63,64,65,66,67,68,69,70,72],$VH=[16,24,38,58,59,60,61,62,63,64,65,68,69,70],$VI=[16,24,38,58,59,60,61,62,63,64,65],$VJ=[1,115],$VK=[1,114],$VL=[15,19],$VM=[2,12,15,31,37,41,42,43,46,47,48,49,50],$VN=[1,129],$VO=[15,37,41],$VP=[2,42],$VQ=[1,140],$VR=[1,141];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"EOF":4,"instrucciones":5,"instruccion":6,"declaracion_bloque":7,"asignacion_bloque":8,"asignacion_funcion":9,"struct_declaracion":10,"STR_STRUCT":11,"ID_VAR":12,"cuerpo_struct":13,"BRACKI":14,"BRACKD":15,"PUNTCOMA":16,"contenido_struct":17,"declaracion_struct":18,"COMA":19,"tiposVar":20,"VOID":21,"MAIN":22,"PARI":23,"PARD":24,"cuerpoFuncion":25,"parametros_funcion":26,"parametro_funcion":27,"instrucciones_funciones":28,"instruccion_funcion":29,"switch_bloque":30,"STR_SWITCH":31,"expresion":32,"switch_cuerpo":33,"casos_switch":34,"opcional_default":35,"caso_switch":36,"STR_CASE":37,"DOSPUNT":38,"contenido_caso":39,"opcional_break":40,"STR_DEFAULT":41,"BREAK":42,"CONTINUE":43,"nombreVars":44,"asignacion":45,"STR_STRING":46,"STR_DOUBLE":47,"STR_INTEGER":48,"STR_BOOLEAN":49,"STR_CHAR":50,"OP_IGUAL":51,"primitivas":52,"logicas":53,"operadores":54,"relacionales":55,"expresion_ternario":56,"OP_TER":57,"OP_AND":58,"OP_OR":59,"OP_DOBIG":60,"OP_DIF":61,"OP_MAYIG":62,"OP_MENIG":63,"OP_MEN":64,"OP_MAY":65,"OP_MULT":66,"OP_DIVI":67,"OP_SUMA":68,"OP_RESTA":69,"OP_AMP":70,"OP_ELV":71,"OP_MOD":72,"STR_FALSE":73,"STR_TRUE":74,"ENTERO":75,"FLOTANTE":76,"STRINGL":77,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",11:"STR_STRUCT",12:"ID_VAR",14:"BRACKI",15:"BRACKD",16:"PUNTCOMA",19:"COMA",21:"VOID",22:"MAIN",23:"PARI",24:"PARD",31:"STR_SWITCH",37:"STR_CASE",38:"DOSPUNT",41:"STR_DEFAULT",42:"BREAK",43:"CONTINUE",46:"STR_STRING",47:"STR_DOUBLE",48:"STR_INTEGER",49:"STR_BOOLEAN",50:"STR_CHAR",51:"OP_IGUAL",57:"OP_TER",58:"OP_AND",59:"OP_OR",60:"OP_DOBIG",61:"OP_DIF",62:"OP_MAYIG",63:"OP_MENIG",64:"OP_MEN",65:"OP_MAY",66:"OP_MULT",67:"OP_DIVI",68:"OP_SUMA",69:"OP_RESTA",70:"OP_AMP",71:"OP_ELV",72:"OP_MOD",73:"STR_FALSE",74:"STR_TRUE",75:"ENTERO",76:"FLOTANTE",77:"STRINGL"},
productions_: [0,[3,1],[3,2],[5,2],[5,1],[6,1],[6,1],[6,1],[6,1],[6,1],[10,3],[13,3],[13,4],[17,1],[17,3],[18,2],[18,2],[9,5],[9,6],[26,3],[26,1],[26,0],[27,2],[25,3],[28,2],[28,1],[29,1],[29,1],[29,1],[30,5],[30,1],[33,2],[33,4],[34,2],[34,1],[36,4],[39,2],[39,1],[35,3],[35,0],[40,2],[40,2],[40,0],[7,3],[7,4],[8,3],[20,1],[20,1],[20,1],[20,1],[20,1],[44,1],[44,3],[45,2],[32,1],[32,1],[32,1],[32,1],[32,1],[56,5],[53,3],[53,3],[55,3],[55,3],[55,3],[55,3],[55,3],[55,3],[54,3],[54,3],[54,3],[54,3],[54,3],[54,3],[54,3],[54,3],[54,2],[52,1],[52,1],[52,1],[52,1],[52,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
        
        console.log("EOF encontrado");
        return this.$;
    
break;
case 2:

        this.$ = $$[$0-1];     
        return this.$;   
    
break;
case 3:

        $$[$0-1].push($$[$0]);
        this.$ = $$[$0-1];
    
break;
case 4:
        
        this.$ = [$$[$0]];
    
break;
case 5: case 6: case 7: case 8: case 26: case 27: case 28: case 53: case 54: case 55: case 56: case 57: case 58:
this.$ = $$[$0];
break;
case 10:
this.$ = new Struct($$[$0-1],$$[$0],_$[$0-2].first_line,_$[$0-2].first_column); 
break;
case 11:
this.$ = []; 
break;
case 12:
this.$ = $$[$0-2];
break;
case 13: case 20: case 34: case 51:
this.$ = [$$[$0]];
break;
case 14:
$$[$0].push($$[$0-2]); this.$= $$[$0]; 
break;
case 15: case 16:
this.$ = new Declaracion($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 17:
this.$ = new Funcion("main","void",_$[$0-4].first_line,_$[$0-4].first_column,$$[$0]);
break;
case 18:
this.$ = new Funcion($$[$0-4],$$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0],$$[$0-2]);
break;
case 19:
$$[$0].push($$[$0-2]);this.$ = $$[$0];
break;
case 21:
this.$ = [];
break;
case 22:
this.$ = new Parametro($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 23: case 75:
this.$ = $$[$0-1];
break;
case 24:
        
        $$[$0-1].push($$[$0]);
        this.$ = $$[$0-1];
    
break;
case 25:
                
        this.$ = [$$[$0]];
    
break;
case 29:
this.$ = new Switch($$[$0-2],$$[$0],_$[$0-4].first_line,_$[$0-4].first_column);
break;
case 31:
this.$= [];
break;
case 32:

            if ($$[$0-1] != null){
                $$[$0-2].push($$[$0-1]);
            }
            this.$ = $$[$0-2];
        
break;
case 33:
$$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 35:
let temp = new SwitchCaso($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].first_column); this.$ = [temp] 
break;
case 36:

            if ($$[$0] != null){
                $$[$0-1].push($$[$0]);
            }
            this.$ = $$[$0-1];
        
break;
case 37:

            if ($$[$0] == null){
                this.$ = [];
            }else{
                this.$ = [$$[$0]];
            }
        
break;
case 38:
this.$ = new SwitchCaso('DEFAULT',$$[$0],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 39: case 42:
this.$ = null;
break;
case 40:
this.$ = new Break(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 41:
this.$ = new Continue(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 43:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 44:
this.$ = new Declaracion($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 45:
this.$ = new Asignacion($$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-1]);
break;
case 46:
this.$ = "STRING";
break;
case 47:
this.$ = "DOUBLE";
break;
case 48:
this.$ = "INTEGER";
break;
case 49:
this.$ = "BOOLEAN";
break;
case 50:
this.$ = "CHAR";
break;
case 52:
 $$[$0].push($$[$0-2]);this.$ = $$[$0];
break;
case 60:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 61:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 62:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 63:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 64:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 65:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 66:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 67:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 68:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 69:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 70:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 71:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 72:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AMPERSON, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 73:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.ELEVADO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 74:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 76:
this.$ = new Operacion($$[$0-1],$$[$01],Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 77:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 78:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 79: case 80:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 81:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
}
},
table: [{2:$V0,3:1,4:[1,2],5:3,6:4,7:5,8:6,9:7,10:8,11:$V1,12:$V2,20:10,21:$V3,44:11,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8},{1:[3]},{1:[2,1]},{2:$V0,4:[1,20],6:21,7:5,8:6,9:7,10:8,11:$V1,12:$V2,20:10,21:$V3,44:11,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8},o($V9,[2,4]),o($V9,[2,5]),o($V9,[2,6]),o($V9,[2,7]),o($V9,[2,8]),o($V9,[2,9]),{12:[1,23],44:22},{45:24,51:$Va},{22:[1,26]},{12:[1,27]},{12:[2,46]},{12:[2,47]},{12:[2,48]},{12:[2,49]},{12:[2,50]},o($Vb,$Vc,{19:$Vd}),{1:[2,2]},o($V9,[2,3]),{16:[1,29],45:30,51:$Va},o($Vb,$Vc,{19:$Vd,23:[1,31]}),{16:[1,32]},{23:$Ve,32:33,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:[1,46]},{13:47,14:[1,48]},{12:$V2,44:49},o($Vl,[2,43]),{16:[1,50]},{20:53,24:$Vm,26:51,27:52,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8},o($Vl,[2,45]),{16:[2,53],57:$Vn,58:$Vo,59:$Vp,60:$Vq,61:$Vr,62:$Vs,63:$Vt,64:$Vu,65:$Vv,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC},o($VD,[2,54]),o($VD,[2,55]),o($VD,[2,56]),o($VD,[2,57]),o($VD,[2,58]),o($VD,[2,77]),o($VD,[2,78]),o($VD,[2,79]),o($VD,[2,80]),o($VD,[2,81]),{23:$Ve,32:70,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:71,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{24:[1,72]},o($V9,[2,10]),{12:$VE,15:[1,73],17:74,18:75,20:76,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8},o($Vb,[2,52]),o($Vl,[2,44]),{24:[1,78]},{19:[1,79],24:[2,20]},{12:[1,80]},{23:$Ve,32:81,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:82,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:83,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:84,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:85,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:86,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:87,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:88,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:89,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:90,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:91,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:92,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:93,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:94,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:95,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{23:$Ve,32:96,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{24:[1,97],57:$Vn,58:$Vo,59:$Vp,60:$Vq,61:$Vr,62:$Vs,63:$Vt,64:$Vu,65:$Vv,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC},o($VD,[2,76]),{14:$VF,25:98},{16:[1,100]},{15:[1,101]},{15:[2,13],19:[1,102]},{12:[1,103]},{12:[1,104]},{14:$VF,25:105},{20:53,24:$Vm,26:106,27:52,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8},o([19,24],[2,22]),o([16,24,38,58,59],[2,60],{57:$Vn,60:$Vq,61:$Vr,62:$Vs,63:$Vt,64:$Vu,65:$Vv,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC}),o([16,24,38,59],[2,61],{57:$Vn,58:$Vo,60:$Vq,61:$Vr,62:$Vs,63:$Vt,64:$Vu,65:$Vv,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC}),o($VG,[2,68],{57:$Vn,71:$VB}),o($VG,[2,69],{57:$Vn,71:$VB}),o($VH,[2,70],{57:$Vn,66:$Vw,67:$Vx,71:$VB,72:$VC}),o($VH,[2,71],{57:$Vn,66:$Vw,67:$Vx,71:$VB,72:$VC}),o($VH,[2,72],{57:$Vn,66:$Vw,67:$Vx,71:$VB,72:$VC}),o($VD,[2,73]),o($VG,[2,74],{57:$Vn,71:$VB}),o($VI,[2,62],{57:$Vn,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC}),o($VI,[2,63],{57:$Vn,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC}),o($VI,[2,64],{57:$Vn,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC}),o($VI,[2,65],{57:$Vn,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC}),o($VI,[2,66],{57:$Vn,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC}),o($VI,[2,67],{57:$Vn,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC}),{38:[1,107],57:$Vn,58:$Vo,59:$Vp,60:$Vq,61:$Vr,62:$Vs,63:$Vt,64:$Vu,65:$Vv,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC},o($VD,[2,75]),o($V9,[2,17]),{2:$VJ,7:110,8:111,12:$V2,20:113,28:108,29:109,30:112,31:$VK,44:11,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8},o($V9,[2,11]),{16:[1,116]},{12:$VE,17:117,18:75,20:76,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8},o($VL,[2,15]),o($VL,[2,16]),o($V9,[2,18]),{24:[2,19]},{23:$Ve,32:118,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{2:$VJ,7:110,8:111,12:$V2,15:[1,119],20:113,29:120,30:112,31:$VK,44:11,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8},o($VM,[2,25]),o($VM,[2,26]),o($VM,[2,27]),o($VM,[2,28]),{12:$V2,44:22},{23:[1,121]},o($VM,[2,30]),o($V9,[2,12]),{15:[2,14]},o($VD,[2,59]),o($V9,[2,23]),o($VM,[2,24]),{23:$Ve,32:122,52:34,53:35,54:36,55:37,56:38,69:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{24:[1,123],57:$Vn,58:$Vo,59:$Vp,60:$Vq,61:$Vr,62:$Vs,63:$Vt,64:$Vu,65:$Vv,66:$Vw,67:$Vx,68:$Vy,69:$Vz,70:$VA,71:$VB,72:$VC},{14:[1,125],33:124},o($VM,[2,29]),{15:[1,126],34:127,36:128,37:$VN},o($VM,[2,31]),{15:[2,39],35:130,36:131,37:$VN,41:[1,132]},o($VO,[2,34]),{12:[1,133]},{15:[1,134]},o($VO,[2,33]),{38:[1,135]},{38:[1,136]},o($VM,[2,32]),{2:$VJ,7:110,8:111,12:$V2,15:$VP,20:113,28:138,29:109,30:112,31:$VK,39:137,40:139,42:$VQ,43:$VR,44:11,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8},o($VO,$VP,{44:11,29:109,7:110,8:111,30:112,20:113,28:138,40:139,39:142,2:$VJ,12:$V2,31:$VK,42:$VQ,43:$VR,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8}),{15:[2,38]},o($VO,$VP,{44:11,7:110,8:111,30:112,20:113,29:120,40:143,2:$VJ,12:$V2,31:$VK,42:$VQ,43:$VR,46:$V4,47:$V5,48:$V6,49:$V7,50:$V8}),o($VO,[2,37]),{16:[1,144]},{16:[1,145]},o($VO,[2,35]),o($VO,[2,36]),o($VO,[2,40]),o($VO,[2,41])],
defaultActions: {2:[2,1],14:[2,46],15:[2,47],16:[2,48],17:[2,49],18:[2,50],20:[2,2],106:[2,19],117:[2,14],137:[2,38]},
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
    const {Print} = require("../dist/Instrucciones/Print");
    const {Declaracion} = require("../dist/Instrucciones/Declaracion");
    const {Asignacion} = require("../dist/Instrucciones/Asignacion");
    const {Funcion} = require("../dist/Instrucciones/Funcion");
    const {Struct} = require("../dist/Instrucciones/Struct");
    const {Switch} = require("../dist/Instrucciones/Switch");
    const {SwitchCaso} = require("../dist/Instrucciones/SwitchCaso");
    const {Break} = require("../dist/Instrucciones/Break");
    const {Continue} = require("../dist/Instrucciones/Continue");
    const {Parametro} = require("../dist/Instrucciones/Parametro");
    const {Primitivo} = require("../dist/Expresiones/Primitivo");
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
case 5:return 14; 
break;
case 6:return 15;
break;
case 7:return 23;
break;
case 8:return 24;
break;
case 9:return 'CORCHI';
break;
case 10:return 'CORCHD';
break;
case 11:return 19;
break;
case 12:return 38;
break;
case 13:return 16;
break;
case 14:return "PRINTLN";
break;
case 15:return "PRINT";
break;
case 16:return 21;
break;
case 17:return 22;
break;
case 18:return 'STR_IF';
break;
case 19:return 'STR_ELSEIF';
break;
case 20:return 'STR_ELSE';
break;
case 21:return 'STR_WHILE';
break;
case 22:return 'STR_DO';
break;
case 23:return 'STR_FOR';
break;
case 24:return 42;
break;
case 25:return 43;
break;
case 26:return 31;
break;
case 27:return 37;
break;
case 28:return 41;
break;
case 29:return 74;
break;
case 30:return 73;
break;
case 31:return 'STR_RETURN';
break;
case 32:return 49;
break;
case 33:return 48;
break;
case 34:return 47;
break;
case 35:return 50;
break;
case 36:return 46;
break;
case 37:return 11;
break;
case 38:return 'STR_BEGIN';
break;
case 39:return 'STR_END';
break;
case 40:return 'STR_FUNCTION';
break;
case 41:return 'STR_POW';
break;
case 42:return 'STR_SQRT';
break;
case 43:return 'STR_SIN';
break;
case 44:return 'STR_COS';
break;
case 45:return 'STR_TAN';
break;
case 46:return 'STR_PARSE';
break;
case 47:return 'STR_TOINT';
break;
case 48:return 'STR_TODOUBLE';
break;
case 49:return 'STR_string';
break;
case 50:return 'STR_TYPEOF';
break;
case 51:return 'STR_PUSH';
break;
case 52:return 'STR_POP';
break;
case 53:return 'CHARPOS';
break;
case 54:return 'SUBSTRING';
break;
case 55:return 'LENGTH';
break;
case 56:return 'UPPERCASE';
break;
case 57:return 'LOWERCASE';
break;
case 58:return 63;
break;
case 59:return 64;
break;
case 60:return 60;
break;
case 61:return 62;
break;
case 62:return 65;
break;
case 63:return 61;
break;
case 64:return 59;
break;
case 65:return 58;
break;
case 66:return 70;
break;
case 67:return 'OP_NEG';
break;
case 68:return 51;
break;
case 69:return 'OP_MASIG';
break;
case 70:return 'OP_RESIG';
break;
case 71:return 'OP_PORIG';
break;
case 72:return 'OP_DIVIG';
break;
case 73:return 'OP_MODIG';
break;
case 74:return 'OP_INCR';
break;
case 75:return 68;
break;
case 76:return 'OP_DECR';
break;
case 77:return 69;
break;
case 78:return 66;
break;
case 79:return 67;
break;
case 80:return 72;
break;
case 81:return 'OP_CALL';
break;
case 82:return 71;
break;
case 83:return 57;
break;
case 84:return 'OP_HASH';
break;
case 85:return 'STR_NULL';
break;
case 86:return 12;
break;
case 87:return 12;
break;
case 88:return 76;
break;
case 89:return 75;
break;
case 90:return 77;
break;
case 91:return 77;
break;
case 92:return 'CHARL';
break;
case 93:return 'CHARL';
break;
case 94:return 4;
break;
case 95:return 'INVALID';
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*)/,/^(?:\*\/)/,/^(?:.)/,/^(?:\s+)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?::)/,/^(?:;)/,/^(?:println\b)/,/^(?:print\b)/,/^(?:void\b)/,/^(?:main\b)/,/^(?:if\b)/,/^(?:elseif\b)/,/^(?:else\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:return\b)/,/^(?:boolean\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:String\b)/,/^(?:struct\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:function\b)/,/^(?:pow\b)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:length\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:<=)/,/^(?:<)/,/^(?:==)/,/^(?:>=)/,/^(?:>)/,/^(?:!=)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:&)/,/^(?:!)/,/^(?:=)/,/^(?:\+=)/,/^(?:-=)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:%=)/,/^(?:\+\+)/,/^(?:\+)/,/^(?:--)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:\.)/,/^(?:\^)/,/^(?:\?)/,/^(?:#)/,/^(?:null\b)/,/^(?:[A-Z][a-zA-Z0-9_]*)/,/^(?:[a-zA-Z][a-zA-Z0-9_]*)/,/^(?:(((0|([1-9])([0-9])*))\.((0|([1-9])([0-9])*))?(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|\.((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))[fFdD]?|((0|([1-9])([0-9])*))(([Ee][+-]?((0|([1-9])([0-9])*))))?[fFdD])(?=([^\w]|$)))/,/^(?:((0|([1-9])([0-9])*)))/,/^(?:"")/,/^(?:"([^"]|(\\.))*")/,/^(?:\\'([^']|(\\.))*\\')/,/^(?:\\'\\')/,/^(?:$)/,/^(?:.)/],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95],"inclusive":true}}
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
},{"../dist/Expresiones/Atributo":7,"../dist/Expresiones/Objeto":8,"../dist/Expresiones/Operacion":9,"../dist/Expresiones/Primitivo":10,"../dist/Instrucciones/Asignacion":11,"../dist/Instrucciones/Break":12,"../dist/Instrucciones/Continue":13,"../dist/Instrucciones/Declaracion":14,"../dist/Instrucciones/Funcion":15,"../dist/Instrucciones/Parametro":16,"../dist/Instrucciones/Print":17,"../dist/Instrucciones/Struct":18,"../dist/Instrucciones/Switch":19,"../dist/Instrucciones/SwitchCaso":20,"_process":3,"fs":1,"path":2}],22:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],23:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST_1 = require("./AST/AST");
var Entorno_1 = require("./AST/Entorno");
var gramatica = require('../jison/Gramatica');
window.ejecutarCodigo = function (entrada) {
    //traigo todas las raices
    var instrucciones = gramatica.parse(entrada);
    console.log(instrucciones);
    // /*
    var ast = new AST_1.AST(instrucciones);
    var entornoGlobal = new Entorno_1.Entorno(null);
    //recorro todas las raices  RECURSIVA
    instrucciones.forEach(function (element) {
        element.ejecutar(entornoGlobal, ast);
    });
    // */
};
// ejecutarCodigo(`int id12;
// int var2;`)

},{"../jison/Gramatica":21,"./AST/AST":22,"./AST/Entorno":23}]},{},[24]);

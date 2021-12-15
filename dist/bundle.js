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
var Tipo_1 = require("./Tipo");
var Simbolo = /** @class */ (function () {
    function Simbolo(tipo, id, linea, columna, valor) {
        this.indentificador = id;
        this.linea = linea;
        this.columna = columna;
        this.tipo = tipo;
        this.valor = valor;
        this.tipoStruct = '';
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
    Simbolo.prototype.getTipoStruct = function (ent, arbol) {
        if (this.tipo == Tipo_1.Tipo.TIPO_STRUCT) {
            return this.tipoStruct;
        }
        else {
            return null;
        }
    };
    Simbolo.prototype.setTipoStruct = function (tipo) {
        this.tipoStruct = tipo;
    };
    return Simbolo;
}());
exports.Simbolo = Simbolo;

},{"./Tipo":6}],6:[function(require,module,exports){
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
    Tipo[Tipo["TIPO_STRUCT"] = 10] = "TIPO_STRUCT";
})(Tipo = exports.Tipo || (exports.Tipo = {}));

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoArray = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoArray = /** @class */ (function () {
    function AccesoArray(contenido, linea, columna) {
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoArray.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoArray.prototype.getTipo = function (ent, arbol) {
        return Tipo_1.Tipo.ARRAY;
    };
    AccesoArray.prototype.getValorImplicito = function (ent, arbol) {
        try {
            return this.contenido;
        }
        catch (e) {
            console.error("hubo un error en AccesoArray " + e);
            return null;
        }
    };
    return AccesoArray;
}());
exports.AccesoArray = AccesoArray;

},{"../AST/Tipo":6}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoAtribArray = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoAtribArray = /** @class */ (function () {
    function AccesoAtribArray(id, posicion, linea, columna) {
        this.id = id;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
    }
    AccesoAtribArray.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoAtribArray.prototype.getTipo = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                return valor.tipo;
            }
            else {
                return Tipo_1.Tipo.NULL;
            }
        }
        else {
            return Tipo_1.Tipo.NULL;
        }
    };
    AccesoAtribArray.prototype.getValorImplicito = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var pos = this.posicion.getValorImplicito(ent, arbol);
                if (typeof (pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        return valor.contenido[pos].getValorImplicito(ent, arbol);
                    }
                    else {
                        return null;
                    }
                }
            }
            else {
            }
        }
        else {
        }
    };
    return AccesoAtribArray;
}());
exports.AccesoAtribArray = AccesoAtribArray;

},{"../AST/Tipo":6}],9:[function(require,module,exports){
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
        var _this = this;
        try {
            var valor_1 = null;
            this.expr1.isAlone = false;
            var val1 = this.expr1.getValorImplicito(ent, arbol);
            val1.forEach(function (decl) {
                var nombre = decl.id[0];
                if (nombre == _this.expr2) {
                    // console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                    valor_1 = decl.expresion.getValorImplicito(ent, arbol);
                }
            });
            this.expr1.isAlone = true;
            return valor_1;
        }
        catch (e) {
            console.error("hubo un error en AccesoAtributo " + e);
            return null;
        }
    };
    return AccesoAtributo;
}());
exports.AccesoAtributo = AccesoAtributo;

},{"../AST/Tipo":6}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoVariable = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoVariable = /** @class */ (function () {
    function AccesoVariable(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.isAlone = true;
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
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.TIPO_STRUCT && this.isAlone) {
                var sendResultado_1 = simbol.getTipoStruct(ent, arbol) + '(';
                var atributos_1 = simbol.getValorImplicito(ent, arbol);
                var i_1 = 0;
                atributos_1.forEach(function (atributo) {
                    sendResultado_1 += atributo.expresion.getValorImplicito(ent, arbol);
                    if (i_1 == atributos_1.length - 1) {
                        sendResultado_1 += ')';
                    }
                    else {
                        sendResultado_1 += ' , ';
                    }
                    i_1++;
                });
                return sendResultado_1;
            }
            else {
                return simbol.valor;
            }
        }
        else {
            console.log('No existe el id ' + this.id);
        }
    };
    AccesoVariable.prototype.getId = function () {
        return this.id;
    };
    return AccesoVariable;
}());
exports.AccesoVariable = AccesoVariable;

},{"../AST/Tipo":6}],11:[function(require,module,exports){
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

},{"../AST/Tipo":6}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"../AST/Entorno":4}],14:[function(require,module,exports){
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
            && this.operador != Operador.TAN && this.operador != Operador.INCREMENTO && this.operador != Operador.DECREMENTO) {
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
                //incremento
                else if (this.operador == Operador.INCREMENTO) {
                    return op1 + 1;
                }
                else if (this.operador == Operador.DECREMENTO) {
                    return op1 - 1;
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

},{"../AST/Tipo":6}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParametroReturn = void 0;
var ParametroReturn = /** @class */ (function () {
    function ParametroReturn(valor, linea, columna) {
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    ParametroReturn.prototype.getTipo = function (ent, arbol) {
        return this.valor.getTipo(ent, arbol);
    };
    ParametroReturn.prototype.getValorImplicito = function (ent, arbol) {
        return this.valor.getValorImplicito(ent, arbol);
    };
    ParametroReturn.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    ParametroReturn.prototype.ejecutar = function (ent, arbol) {
    };
    return ParametroReturn;
}());
exports.ParametroReturn = ParametroReturn;

},{}],16:[function(require,module,exports){
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

},{"../AST/Tipo":6}],17:[function(require,module,exports){
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

},{"../AST/Tipo":6}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
var Tipo_1 = require("../AST/Tipo");
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
        if (this.id.length == 1) {
            var id = this.id[0];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == this.expresion.getTipo(ent, arbol)) {
                    simbol.valor = this.expresion.getValorImplicito(ent, arbol);
                }
                else {
                    console.log('Error semantico, El tipo de la variable (' + tipo + ') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent, arbol) + ') en la linea ' + this.linea + ' y columna ' + this.columna);
                }
            }
            else {
                console.log('Error semantico, no existe la variable ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
        else {
            for (var i = 0; i < (this.id.length - 1); i++) {
                var id = this.id[i];
                if (ent.existe(id)) {
                    var simbol = ent.getSimbolo(id);
                    var tipo = simbol.getTipo(ent, arbol);
                    if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
                        var atributos = simbol.getValorImplicito(ent, arbol);
                        var idSig = this.id[i + 1];
                        for (var _i = 0, atributos_1 = atributos; _i < atributos_1.length; _i++) {
                            var atributo = atributos_1[_i];
                            if (atributo.id[0] === idSig) {
                                atributo.expresion = this.expresion;
                                break;
                            }
                        }
                    }
                }
                else {
                    console.log('Error semantico, no existe ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
                }
            }
        }
    };
    Asignacion.prototype.getTipo = function () {
        return "asignacion";
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;

},{"../AST/Tipo":6}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionArray = void 0;
var Tipo_1 = require("../AST/Tipo");
var AsignacionArray = /** @class */ (function () {
    function AsignacionArray(id, posicion, linea, columna, expresion) {
        this.id = id;
        this.posicion = posicion;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    AsignacionArray.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AsignacionArray.prototype.ejecutar = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                var pos = this.posicion.getValorImplicito(ent, arbol);
                if (typeof (pos) == 'number') {
                    if (pos >= 0 && pos < valor.length) {
                        if (this.expresion.getTipo(ent, arbol) == valor.tipo) {
                            valor.contenido[pos] = this.expresion;
                        }
                        else {
                        }
                    }
                    else {
                    }
                }
            }
            else {
            }
        }
        else {
        }
    };
    AsignacionArray.prototype.getTipo = function () {
        return "asignacion";
    };
    return AsignacionArray;
}());
exports.AsignacionArray = AsignacionArray;

},{"../AST/Tipo":6}],20:[function(require,module,exports){
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
        return;
    };
    return Break;
}());
exports.Break = Break;

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"../AST/Simbolo":5,"../AST/Tipo":6}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArray = void 0;
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var AccesoArray_1 = require("../Expresiones/AccesoArray");
var Arreglo_1 = require("../Objetos/Arreglo");
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
        var _this = this;
        // console.log('ejecutado...'+ this.id);
        this.id.forEach(function (id) {
            if (!ent.existe(id)) {
                if (_this.dimensiones.length == 0) {
                    if (_this.expresion == null) {
                        var valor = new Arreglo_1.Arreglo(_this.tipo, 0, 0, [], _this.linea, _this.columna);
                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valor);
                        ent.agregar(id, simbol);
                    }
                    else {
                        if (_this.expresion instanceof AccesoArray_1.AccesoArray) {
                            var valor = _this.expresion.getValorImplicito(ent, arbol);
                            if (valor == null) {
                                valor = [];
                            }
                            var valorSimbolo = new Arreglo_1.Arreglo(_this.tipo, valor.length, valor.length, valor, _this.linea, _this.columna);
                            if (valorSimbolo.comprobarTipo(ent, arbol)) {
                                var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valorSimbolo);
                                ent.agregar(id, simbol);
                            }
                        }
                        else {
                            console.log('Error semantico, la asignacion no es un arreglo de datos en la linea ' + _this.linea + ' y columna ' + _this.columna);
                        }
                    }
                }
                else if (_this.dimensiones.length == 1) {
                    if (_this.expresion == null) {
                        var valor = new Arreglo_1.Arreglo(_this.tipo, 0, 0, [], _this.linea, _this.columna);
                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valor);
                        ent.agregar(id, simbol);
                    }
                    else {
                        if (_this.expresion instanceof AccesoArray_1.AccesoArray) {
                            var valor = _this.expresion.getValorImplicito(ent, arbol);
                            if (valor == null) {
                                valor = [];
                            }
                            var dim = _this.dimensiones[0].getValorImplicito(ent, arbol);
                            if (typeof (dim) === 'number') {
                                if (dim === valor.length) {
                                    var valorSimbolo = new Arreglo_1.Arreglo(_this.tipo, valor.length, valor.length, valor, _this.linea, _this.columna);
                                    if (valorSimbolo.comprobarTipo(ent, arbol)) {
                                        var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.ARRAY, id, _this.linea, _this.columna, valorSimbolo);
                                        ent.agregar(id, simbol);
                                    }
                                }
                                else {
                                    //no tienen las mismas dimensiones
                                }
                            }
                            else {
                                //la dimension no es un numero
                            }
                        }
                        else {
                            console.log('Error semantico, la asignacion no es un arreglo de datos en la linea ' + _this.linea + ' y columna ' + _this.columna);
                        }
                    }
                }
                else {
                    console.log('error semantico, dimension de la declaracion del arreglo no conocido, en la linea ' + _this.linea + ' y columna ' + _this.columna);
                }
            }
            else {
                console.log('Error semantico, ya existe el id: ' + id + ' en la linea ' + _this.linea + ' y columna ' + _this.columna);
            }
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

},{"../AST/Simbolo":5,"../AST/Tipo":6,"../Expresiones/AccesoArray":7,"../Objetos/Arreglo":38}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionStruct = void 0;
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
var FuncionReturn_1 = require("./FuncionReturn");
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
        var _this = this;
        if (ent.existe(this.tipo)) {
            if (this.expresion instanceof FuncionReturn_1.FuncionReturn) { //evalua que se este haciendo una instancia de la estructura
                //verificar que tengan la misma cantidad de parametros
                var struct = ent.getSimbolo(this.tipo);
                if (struct.getTipo(ent, arbol) === Tipo_1.Tipo.STRUCT) {
                    var structVars = struct.getValorImplicito(ent, arbol);
                    var parametros_1 = this.expresion.parametros;
                    //verificar
                    if (!ent.existe(this.id)) {
                        if (structVars.length == parametros_1.length) {
                            var error_1 = false;
                            structVars.forEach(function (declaracion, index, array) {
                                var param = parametros_1[index];
                                // console.log("--index---------" + index);
                                // console.log(declaracion.tipo);
                                // console.log(param.getTipo(ent,arbol));
                                if (declaracion.tipo === param.getTipo(ent, arbol) || param.getTipo(ent, arbol) === Tipo_1.Tipo.NULL) {
                                    // console.log("Si son compatibles");
                                    declaracion.expresion = param;
                                }
                                else {
                                    console.log('Error semantico, El parametro ' + param.getValorImplicito(ent, arbol) + ' no coincide con el tipo del atributo de la estructura en la linea ' + _this.linea + ' y columna ' + _this.columna);
                                    error_1 = true;
                                }
                            });
                            if (!error_1) { //ingresamos la variable
                                //let entorno: Entorno = new Entorno(ent);//puede que no necesite esto
                                var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.TIPO_STRUCT, this.id, this.linea, this.columna, structVars);
                                simbol.setTipoStruct(this.tipo);
                                ent.agregar(this.id, simbol);
                            }
                            else {
                                // console.log('No se ingreso la variable');
                            }
                        }
                        else {
                            console.log('Error semantico, La cantidad de parametros no concuerdan con la estructura en la linea ' + this.linea + ' y columna ' + this.columna);
                        }
                    }
                    else {
                        console.log('Error semantico, La variable ' + this.id + ' ya existe en el entorno, en la linea ' + this.linea + ' y columna ' + this.columna);
                    }
                }
                else {
                    console.log('Error semantico, El tipo declarado no es un struct en la linea ' + this.linea + ' y columna ' + this.columna);
                }
            }
            else {
                console.log('Error semantico, no se esta inicializando la estructura en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
        else {
            console.log('Error semantico, no exite la Estructura ' + this.tipo + ' en la linea ' + this.linea + ' y columna ' + this.columna);
        }
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

},{"../AST/Simbolo":5,"../AST/Tipo":6,"./FuncionReturn":29}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
var Entorno_1 = require("../AST/Entorno");
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
        var entornolocal = new Entorno_1.Entorno(ent);
        var realizar = this.expresion.getValorImplicito(entornolocal, arbol);
        var contSalir = 0;
        do {
            this.instrucciones.forEach(function (element) {
                element.ejecutar(entornolocal, arbol);
            });
            realizar = this.expresion.getValorImplicito(entornolocal, arbol);
            if (contSalir == 5000) {
                realizar = false;
            }
            contSalir++;
        } while (realizar);
    };
    return DoWhile;
}());
exports.DoWhile = DoWhile;

},{"../AST/Entorno":4}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
var Entorno_1 = require("../AST/Entorno");
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
    };
    For.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...fornormal');
        var entornolocal = new Entorno_1.Entorno(ent);
        this.declAsign.ejecutar(entornolocal, arbol);
        //expresion 1 es la que hay que validar 
        console.log("empezando el while  en for");
        while (this.expresion1.getValorImplicito(entornolocal, arbol) == true) {
            //Realizar instrucciones
            this.instrucciones.forEach(function (element) {
                element.ejecutar(entornolocal, arbol);
            });
            //Sumar o realizar la expresion2            
            //Primero se obtiene la operacion;            
            var valAsig = this.expresion2.getValorImplicito(entornolocal, arbol);
            //Luego se obtiene el id de la operacion y se asigna el valor de la operacion; 
            var id = this.expresion2.op_izquierda.getId();
            if (entornolocal.existe(id)) {
                var simbol = entornolocal.getSimbolo(id);
                simbol.valor = valAsig;
            }
            else {
                console.log('Error semantico, no existe la variable ' + id + 'en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
    };
    return For;
}());
exports.For = For;

},{"../AST/Entorno":4}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"../AST/Entorno":4}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
var Entorno_1 = require("../AST/Entorno");
var If = /** @class */ (function () {
    function If(linea, columna, condicion, instrucciones, sinos, tipo) {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.condicion = condicion;
        this.sinos = sinos;
        this.tipo = tipo;
    }
    If.prototype.traducir = function (ent, arbol) {
        console.log('traducir...ifnormal');
    };
    If.prototype.ejecutar = function (ent, arbol) {
        console.log('ejecutado...ifnormal');
        //Revisar la condicion del if
        if (this.tipo == "if" || this.tipo == "elseif") {
            if (this.condicion.getValorImplicito(ent, arbol) == true) {
                var entornolocal_1 = new Entorno_1.Entorno(ent);
                this.instrucciones.forEach(function (element) {
                    element.ejecutar(entornolocal_1, arbol);
                });
            }
            else {
                var seEncontro = false;
                for (var i = 0; i < this.sinos.length; i++) {
                    var element = this.sinos[i];
                    if (element.tipo == "elseif") {
                        if (element.condicion.getValorImplicito(ent, arbol) == true) {
                            //Se encontro un elseif que cumple con la condicion
                            var entornolocal = new Entorno_1.Entorno(ent);
                            element.ejecutar(entornolocal, arbol);
                            seEncontro = true;
                            break;
                        }
                    }
                }
                if (seEncontro == false) {
                    for (var i = 0; i < this.sinos.length; i++) {
                        var element = this.sinos[i];
                        if (element.tipo == "else") {
                            //Se encontro un else  
                            var entornolocal = new Entorno_1.Entorno(ent);
                            element.ejecutar(entornolocal, arbol);
                            break;
                        }
                    }
                }
            }
        }
        else {
            var entornolocal_2 = new Entorno_1.Entorno(ent);
            this.instrucciones.forEach(function (element) {
                element.ejecutar(entornolocal_2, arbol);
            });
        }
    };
    return If;
}());
exports.If = If;

},{"../AST/Entorno":4}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncrDecr = void 0;
// print("hola mundo");
var IncrDecr = /** @class */ (function () {
    function IncrDecr(operacion, linea, columna, idVar) {
        this.operacion = operacion;
        this.linea = linea;
        this.columna = columna;
        this.idVar = idVar;
    }
    IncrDecr.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    IncrDecr.prototype.ejecutar = function (ent, arbol) {
        var valorIns = this.operacion.getValorImplicito(ent, arbol);
        if (valorIns !== null) {
            if (ent.existe(this.idVar)) {
                var simbol = ent.getSimbolo(this.idVar);
                simbol.valor = valorIns;
            }
            else {
                console.log('Error semantico, no existe la variable ' + this.idVar + 'en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
        else {
            console.log("Ocurrio un error al realizar la operacion " + this.operacion.op_izquierda);
        }
    };
    return IncrDecr;
}());
exports.IncrDecr = IncrDecr;

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
var Simbolo_1 = require("../AST/Simbolo");
var Tipo_1 = require("../AST/Tipo");
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
        if (!ent.existe(this.id)) {
            var simbol = new Simbolo_1.Simbolo(Tipo_1.Tipo.STRUCT, this.id, this.linea, this.columna, this.lista_atributos);
            ent.agregar(this.id, simbol);
        }
        else {
            console.log('error semantico, Ya existe el nombre de la estructura declarada en la linea ' + this.linea + ' y columna ' + this.columna);
        }
    };
    Struct.prototype.getTipo = function () {
        return "struct";
    };
    return Struct;
}());
exports.Struct = Struct;

},{"../AST/Simbolo":5,"../AST/Tipo":6}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
var Tipo_1 = require("../AST/Tipo");
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
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var caso = _a[_i];
            if (this.expresion.getValorImplicito(ent, arbol) == caso.id.getValorImplicito(ent, arbol) || caso.id.getTipo(ent, arbol) == Tipo_1.Tipo.NULL) {
                caso.ejecutar(ent, arbol);
                if (caso.getIsBreak()) {
                    break;
                }
            }
        }
    };
    return Switch;
}());
exports.Switch = Switch;

},{"../AST/Tipo":6}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCaso = void 0;
var Break_1 = require("./Break");
// print("hola mundo");
var SwitchCaso = /** @class */ (function () {
    function SwitchCaso(id, lista_intstrucciones, linea, columna) {
        this.id = id;
        this.lista_instrucciones = lista_intstrucciones;
        this.linea = linea;
        this.columna = columna;
        this.isBreak = false;
    }
    SwitchCaso.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    SwitchCaso.prototype.ejecutar = function (ent, arbol) {
        for (var _i = 0, _a = this.lista_instrucciones; _i < _a.length; _i++) {
            var ints = _a[_i];
            if (ints instanceof Break_1.Break) {
                this.isBreak = true;
                break;
            }
            else {
                ints.ejecutar(ent, arbol);
            }
        }
    };
    SwitchCaso.prototype.getIsBreak = function () {
        return this.isBreak;
    };
    return SwitchCaso;
}());
exports.SwitchCaso = SwitchCaso;

},{"./Break":20}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
var Entorno_1 = require("../AST/Entorno");
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
        var entornolocal = new Entorno_1.Entorno(ent);
        var realizar = this.expresion.getValorImplicito(entornolocal, arbol);
        var contSalir = 0;
        while (realizar) {
            this.instrucciones.forEach(function (element) {
                element.ejecutar(entornolocal, arbol);
            });
            realizar = this.expresion.getValorImplicito(entornolocal, arbol);
            if (contSalir == 5000) {
                realizar = false;
            }
            contSalir++;
        }
    };
    return While;
}());
exports.While = While;

},{"../AST/Entorno":4}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
var Arreglo = /** @class */ (function () {
    function Arreglo(tipo, dimension, length, contenido, linea, columna) {
        this.tipo = tipo;
        this.dimension = dimension;
        this.length = length;
        this.contenido = contenido;
        this.linea = linea;
        this.columna = columna;
    }
    Arreglo.prototype.push = function (nuevo) {
    };
    Arreglo.prototype.pop = function () {
    };
    Arreglo.prototype.comprobarTipo = function (ent, arbol) {
        var _this = this;
        var isFine = true;
        this.contenido.forEach(function (cont) {
            if (!(cont.getTipo(ent, arbol) == _this.tipo)) {
                isFine = false;
                console.log('Error semantico, el valor: ' + cont.getValorImplicito(ent, arbol) + ' no concuerda con el tipo del arreglo en la linea ' + _this.linea + ' y columna ' + _this.columna);
            }
        });
        return isFine;
    };
    return Arreglo;
}());
exports.Arreglo = Arreglo;

},{}],39:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,13],$V2=[1,10],$V3=[1,12],$V4=[1,14],$V5=[1,15],$V6=[1,16],$V7=[1,17],$V8=[1,18],$V9=[2,4,10,11,20,79,80,81,82,83],$Va=[1,24],$Vb=[1,25],$Vc=[2,4,10,11,14,20,42,47,51,52,53,61,62,63,69,73,74,79,80,81,82,83],$Vd=[11,59],$Ve=[1,30],$Vf=[1,31],$Vg=[15,18,85],$Vh=[2,94],$Vi=[1,34],$Vj=[1,54],$Vk=[1,56],$Vl=[1,57],$Vm=[1,58],$Vn=[1,59],$Vo=[1,60],$Vp=[1,61],$Vq=[1,62],$Vr=[1,63],$Vs=[1,48],$Vt=[1,49],$Vu=[1,50],$Vv=[1,51],$Vw=[1,52],$Vx=[1,53],$Vy=[1,55],$Vz=[18,23],$VA=[11,13,15,18,23,48,60,84,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110],$VB=[18,60],$VC=[1,95],$VD=[1,94],$VE=[1,79],$VF=[1,80],$VG=[1,88],$VH=[1,89],$VI=[1,90],$VJ=[1,91],$VK=[1,92],$VL=[1,93],$VM=[1,81],$VN=[1,82],$VO=[1,83],$VP=[1,84],$VQ=[1,85],$VR=[1,86],$VS=[1,87],$VT=[15,18,23,48,60,84,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110],$VU=[15,18,23,40,41,48,60,84,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110],$VV=[1,114],$VW=[2,24],$VX=[15,18,23,48,60,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110],$VY=[1,148],$VZ=[14,18],$V_=[15,18,23,48,60,95,97],$V$=[15,18,23,48,60,95,96,97,98,99,100,101,102,103,104,105,106,107,108,110],$V01=[15,18,23,48,60,95,96,97,98,99,100,101,102,103,106,107,108],$V11=[15,18,23,48,60,95,96,97,98,99,100,101,102,103],$V21=[1,158],$V31=[1,187],$V41=[1,178],$V51=[1,186],$V61=[1,180],$V71=[1,181],$V81=[1,182],$V91=[1,183],$Va1=[1,184],$Vb1=[1,185],$Vc1=[2,4,10,11,14,20,42,47,51,52,53,61,62,63,66,68,69,73,74,79,80,81,82,83],$Vd1=[2,11,14,42,47,51,52,53,61,62,63,69,73,74,79,80,81,82,83],$Ve1=[84,85],$Vf1=[2,97],$Vg1=[1,200],$Vh1=[2,70],$Vi1=[1,258],$Vj1=[1,260],$Vk1=[1,268],$Vl1=[14,47,51],$Vm1=[2,55],$Vn1=[1,297],$Vo1=[1,298];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"EOF":4,"instrucciones":5,"instruccion":6,"declaracion_bloque":7,"asignacion_funcion":8,"struct_declaracion":9,"STR_STRUCT":10,"ID_VAR":11,"cuerpo_struct":12,"BRACKI":13,"BRACKD":14,"PUNTCOMA":15,"contenido_struct":16,"declaracion_struct":17,"COMA":18,"tiposVar":19,"VOID":20,"MAIN":21,"PARI":22,"PARD":23,"cuerpoFuncion":24,"parametros_funcion":25,"parametro_funcion":26,"parametros_funcion_return":27,"parametro_funcion_return":28,"expresion":29,"instrucciones_funciones":30,"instruccion_funcion":31,"asignacion_bloque":32,"print_bloque":33,"if_bloque":34,"for_bloque":35,"while_bloque":36,"switch_bloque":37,"funcion_return":38,"incremento_decremento":39,"OP_INCR":40,"OP_DECR":41,"STR_SWITCH":42,"switch_cuerpo":43,"casos_switch":44,"opcional_default":45,"caso_switch":46,"STR_CASE":47,"DOSPUNT":48,"contenido_caso":49,"opcional_break":50,"STR_DEFAULT":51,"BREAK":52,"CONTINUE":53,"nombreVars":54,"asignacion":55,"declaracion_arreglo":56,"arr_decl":57,"nombreAtributos":58,"CORCHI":59,"CORCHD":60,"PRINT":61,"PRINTLN":62,"STR_IF":63,"sinos_bloque":64,"instruccion_devuelta":65,"STR_ELSE":66,"sino_si_bloque":67,"STR_ELSEIF":68,"STR_FOR":69,"decl_asign":70,"STR_IN":71,"arr_begin_end":72,"STR_WHILE":73,"STR_DO":74,"parametros_arreglo":75,"expresion_arreglo":76,"STR_BEGIN":77,"STR_END":78,"STR_STRING":79,"STR_DOUBLE":80,"STR_INTEGER":81,"STR_BOOLEAN":82,"STR_CHAR":83,"OP_CALL":84,"OP_IGUAL":85,"primitivas":86,"logicas":87,"operadores":88,"relacionales":89,"expresion_ternario":90,"incr_decr":91,"nativas":92,"expresion_arr_arreglo":93,"expresion_atributos":94,"OP_TER":95,"OP_AND":96,"OP_OR":97,"OP_DOBIG":98,"OP_DIF":99,"OP_MAYIG":100,"OP_MENIG":101,"OP_MEN":102,"OP_MAY":103,"OP_MULT":104,"OP_DIVI":105,"OP_SUMA":106,"OP_RESTA":107,"OP_AMP":108,"OP_ELV":109,"OP_MOD":110,"OP_NEG":111,"STR_POW":112,"STR_SQRT":113,"STR_SIN":114,"STR_COS":115,"STR_TAN":116,"STR_FALSE":117,"STR_TRUE":118,"ENTERO":119,"FLOTANTE":120,"STRINGL":121,"CHARL":122,"STR_NULL":123,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",10:"STR_STRUCT",11:"ID_VAR",13:"BRACKI",14:"BRACKD",15:"PUNTCOMA",18:"COMA",20:"VOID",21:"MAIN",22:"PARI",23:"PARD",40:"OP_INCR",41:"OP_DECR",42:"STR_SWITCH",47:"STR_CASE",48:"DOSPUNT",51:"STR_DEFAULT",52:"BREAK",53:"CONTINUE",59:"CORCHI",60:"CORCHD",61:"PRINT",62:"PRINTLN",63:"STR_IF",66:"STR_ELSE",68:"STR_ELSEIF",69:"STR_FOR",71:"STR_IN",73:"STR_WHILE",74:"STR_DO",77:"STR_BEGIN",78:"STR_END",79:"STR_STRING",80:"STR_DOUBLE",81:"STR_INTEGER",82:"STR_BOOLEAN",83:"STR_CHAR",84:"OP_CALL",85:"OP_IGUAL",95:"OP_TER",96:"OP_AND",97:"OP_OR",98:"OP_DOBIG",99:"OP_DIF",100:"OP_MAYIG",101:"OP_MENIG",102:"OP_MEN",103:"OP_MAY",104:"OP_MULT",105:"OP_DIVI",106:"OP_SUMA",107:"OP_RESTA",108:"OP_AMP",109:"OP_ELV",110:"OP_MOD",111:"OP_NEG",112:"STR_POW",113:"STR_SQRT",114:"STR_SIN",115:"STR_COS",116:"STR_TAN",117:"STR_FALSE",118:"STR_TRUE",119:"ENTERO",120:"FLOTANTE",121:"STRINGL",122:"CHARL",123:"STR_NULL"},
productions_: [0,[3,1],[3,2],[5,2],[5,1],[6,1],[6,1],[6,1],[6,1],[9,3],[12,3],[12,4],[16,1],[16,3],[17,2],[17,2],[8,5],[8,6],[25,3],[25,1],[25,0],[26,2],[27,3],[27,1],[27,0],[28,1],[24,3],[24,2],[30,2],[30,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[39,3],[39,3],[38,5],[37,5],[37,1],[43,2],[43,4],[44,2],[44,1],[46,4],[49,2],[49,1],[45,3],[45,0],[50,2],[50,2],[50,0],[7,3],[7,4],[7,4],[7,1],[56,4],[56,5],[32,3],[32,6],[33,5],[33,5],[34,6],[65,1],[64,2],[64,2],[64,0],[67,5],[35,9],[35,5],[35,5],[35,5],[36,5],[36,6],[70,3],[70,2],[57,3],[57,2],[75,1],[75,3],[76,1],[72,6],[72,6],[72,6],[72,6],[19,1],[19,1],[19,1],[19,1],[19,1],[54,1],[54,3],[58,3],[58,1],[55,2],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[93,1],[93,4],[94,3],[90,5],[87,3],[87,3],[89,3],[89,3],[89,3],[89,3],[89,3],[89,3],[88,3],[88,3],[88,3],[88,3],[88,3],[88,3],[88,3],[88,3],[88,2],[88,2],[91,2],[91,2],[92,6],[92,4],[92,4],[92,4],[92,4],[86,1],[86,1],[86,1],[86,1],[86,1],[86,1],[86,1],[86,4],[86,1]],
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
case 3: case 46:
$$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 4: case 12: case 19: case 23: case 47: case 94: case 97:
this.$ = [$$[$0]];
break;
case 5: case 6: case 7: case 30: case 31: case 32: case 33: case 34: case 35: case 36: case 37: case 38: case 59: case 84: case 98: case 99: case 100: case 101: case 102: case 103: case 104: case 105: case 106: case 107:
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
$$[$0-2].push($$[$0]); this.$= $$[$0-2]; 
break;
case 14: case 15:
this.$ = new Declaracion($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column,null);
break;
case 16:
this.$ = new Funcion("main","void",_$[$0-4].first_line,_$[$0-4].first_column,$$[$0]);
break;
case 17:
this.$ = new Funcion($$[$0-4],$$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0],$$[$0-2]);
break;
case 18: case 22: case 83:
$$[$0-2].push($$[$0]);this.$ = $$[$0-2];
break;
case 20: case 24: case 70: case 81:
this.$ = [];
break;
case 21:
this.$ = new Parametro($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 25:
this.$ = new ParametroReturn($$[$0],_$[$0].first_line,_$[$0].first_column);
break;
case 26: case 127:
this.$ = $$[$0-1];
break;
case 27: case 52: case 55:
this.$ = null;
break;
case 28:
        
        $$[$0-1].push($$[$0]);
        this.$ = $$[$0-1];
    
break;
case 29:
                
        this.$ = [$$[$0]];
    
break;
case 39:
   let accVar = new AccesoVariable($$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column);
            let operInDec = new Operacion(accVar,null,Operador.INCREMENTO, _$[$0-2].first_line, _$[$0-2].first_column);
            this.$ = new IncrDecr(operInDec,_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-2]);
        
break;
case 40:
   let accVar1 = new AccesoVariable($$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column);
            let operInDec1 = new Operacion(accVar1,null,Operador.DECREMENTO, _$[$0-2].first_line, _$[$0-2].first_column);
            this.$ = new IncrDecr(operInDec1,_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-2]);
        
break;
case 41:
this.$ = new FuncionReturn($$[$0-4],_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-2]);
break;
case 42:
this.$ = new Switch($$[$0-2],$$[$0],_$[$0-4].first_line,_$[$0-4].first_column);
break;
case 44:
this.$= [];
break;
case 45:

            if ($$[$0-1] != null){
                $$[$0-2].push($$[$0-1]);
            }
            this.$ = $$[$0-2];
        
break;
case 48:
this.$ = new SwitchCaso($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 49:

            if ($$[$0] != null){
                $$[$0-1].push($$[$0]);
            }
            this.$ = $$[$0-1];
        
break;
case 50:

            if ($$[$0] == null){
                this.$ = [];
            }else{
                this.$ = [$$[$0]];
            }
        
break;
case 51:
let nul = new Primitivo(null, _$[$0-2].first_line, _$[$0-2].first_column);this.$ = new SwitchCaso(nul,$$[$0],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 53:
this.$ = new Break(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 54:
this.$ = new Continue(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 56:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,null);
break;
case 57:
this.$ = new Declaracion($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 58:
this.$ =  new DeclaracionStruct($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 60:
this.$ = new DeclaracionArray($$[$0-1],$$[$0-3],$$[$0-2],_$[$0-3].first_line,_$[$0-3].first_column,null);
break;
case 61:
this.$ = new DeclaracionArray($$[$0-2],$$[$0-4],$$[$0-3],_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-1]);
break;
case 62:
this.$ = new Asignacion($$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-1]);
break;
case 63:
this.$ = new AsignacionArray($$[$0-5],$$[$0-3],_$[$0-5].first_line, _$[$0-5].first_column,$$[$0-1]);
break;
case 64:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,false);
break;
case 65:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,true);
break;
case 66:
this.$ = new If(_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],$$[$0-1],$$[$0],"if");
break;
case 67: case 82:
this.$ = [$$[$0]]
break;
case 68:
this.$ = [new If(_$[$0-1].first_line,_$[$0-1].first_column,null,$$[$0],[],"else")];
break;
case 69:
$$[$0].push($$[$0-1]); this.$ = $$[$0]
break;
case 71:
this.$ = new If(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-2],$$[$0],[],"elseif");
break;
case 72:
this.$ = new For(_$[$0-8].first_line,_$[$0-8].first_column,$$[$0],$$[$0-6],$$[$0-4],$$[$0-2]);
break;
case 73: case 74: case 75:
this.$ = new Forin(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-3],$$[$0-1]);
break;
case 76:
this.$ = new While(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-2]);
break;
case 77:
this.$ = new DoWhile(_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-4],$$[$0-1]);
break;
case 78:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0]);
break;
case 79:
this.$ = new Asignacion($$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column,$$[$0]);
break;
case 80:
this.$ = $$[$0-1]
break;
case 85:
this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],$$[$0-1]);
break;
case 86:
let beg = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg,$$[$0-1]);
break;
case 87:
let beg1 = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); let end1 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg1,end1);
break;
case 88:
let beg2 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],beg2);
break;
case 89:
this.$ = Tipo.STRING;
break;
case 90:
this.$ = Tipo.DOUBLE;
break;
case 91:
this.$ = Tipo.INT;
break;
case 92:
this.$ = Tipo.BOOL;
break;
case 93:
this.$ = Tipo.CHAR;
break;
case 95:
 $$[$0-2].push($$[$0]);this.$ = $$[$0-2];
break;
case 96:
$$[$0-2].push($$[$0]); this.$ = $$[$0-2];
break;
case 108:
this.$ = new AccesoArray($$[$0],_$[$0].first_line, _$[$0].first_column);
break;
case 109:
this.$ = new AccesoAtribArray($$[$0-3],$$[$0-1],_$[$0-3].first_line, _$[$0-3].first_column);
break;
case 110:
this.$ = new AccesoAtributo($$[$0-2],$$[$0],_$[$0-2].first_line, _$[$0-2].first_column);
break;
case 111:
this.$ = new Ternario($$[$0-4],$$[$0-2],$$[$0],_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 112:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 113:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 114:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 115:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 116:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 117:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 118:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 119:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 120:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 121:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 122:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 123:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 124:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AMPERSON, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 125:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.ELEVADO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 126:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 128:
this.$ = new Operacion($$[$0],null,Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 129:
this.$ = new Operacion($$[$0],null,Operador.NOT, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 130:
this.$ = new Operacion($$[$0-1],null,Operador.INCREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 131:
this.$ = new Operacion($$[$0-1],null,Operador.DECREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 132:
this.$ = new Operacion($$[$0-3],$$[$0-1],Operador.POW, _$[$0-5].first_line, _$[$0-5].first_column);
break;
case 133:
this.$ = new Operacion($$[$0-1],null,Operador.SQRT, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 134:
this.$ = new Operacion($$[$0-1],null,Operador.SIN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 135:
this.$ = new Operacion($$[$0-1],null,Operador.COS, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 136:
this.$ = new Operacion($$[$0-1],null,Operador.TAN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 137:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 138:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 139: case 140:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 141: case 142:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 143:
this.$ = new AccesoVariable($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 144:
this.$ = new FuncionReturn($$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 145:
this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column);
break;
}
},
table: [{2:$V0,3:1,4:[1,2],5:3,6:4,7:5,8:6,9:7,10:$V1,11:$V2,19:9,20:$V3,56:11,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8},{1:[3]},{1:[2,1]},{2:$V0,4:[1,19],6:20,7:5,8:6,9:7,10:$V1,11:$V2,19:9,20:$V3,56:11,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8},o($V9,[2,4]),o($V9,[2,5]),o($V9,[2,6]),o($V9,[2,7]),o($V9,[2,8]),{11:[1,22],54:21,57:23,59:$Va},{11:$Vb},o($Vc,[2,59]),{21:[1,26]},{11:[1,27]},o($Vd,[2,89]),o($Vd,[2,90]),o($Vd,[2,91]),o($Vd,[2,92]),o($Vd,[2,93]),{1:[2,2]},o($V9,[2,3]),{15:[1,28],18:$Ve,55:29,85:$Vf},o($Vg,$Vh,{22:[1,32]}),{11:$Vi,54:33},{11:$Vj,22:$Vk,29:38,57:64,59:$Va,60:[1,36],75:35,76:37,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{55:65,85:$Vf},{22:[1,66]},{12:67,13:[1,68]},o($Vc,[2,56]),{15:[1,69]},{11:[1,70]},{11:$Vj,22:$Vk,29:71,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},o($Vz,[2,20],{25:72,26:73,19:74,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8}),{15:[1,75],18:$Ve,55:76,85:$Vf},o($Vg,$Vh),{18:[1,78],60:[1,77]},o($VA,[2,81]),o($VB,[2,82]),o($VB,[2,84],{84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),o($VT,[2,99],{40:[1,96],41:[1,97]}),o($VT,[2,100]),o($VT,[2,101]),o($VT,[2,102]),o($VT,[2,103]),o($VT,[2,104]),o($VT,[2,105]),o($VT,[2,106]),o($VT,[2,107]),o($VU,[2,137]),o($VU,[2,138]),o($VU,[2,139]),o($VU,[2,140]),o($VU,[2,141]),o($VU,[2,142]),o($VU,[2,143],{22:[1,98],59:[1,99]}),o($VU,[2,145]),{11:$Vj,22:$Vk,29:100,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:101,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:102,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{22:[1,103]},{22:[1,104]},{22:[1,105]},{22:[1,106]},{22:[1,107]},o($VT,[2,108]),{15:[1,108]},{23:[1,109]},o($V9,[2,9]),{11:$VV,14:[1,110],16:111,17:112,19:113,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8},o($Vc,[2,57]),o($Vg,[2,95]),{15:[2,98],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{18:[1,116],23:[1,115]},o($Vz,[2,19]),{11:[1,117]},o($Vc,[2,60]),{15:[1,118]},o($VA,[2,80]),{11:$Vj,22:$Vk,29:38,57:64,59:$Va,76:119,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:120,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:121,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:122,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:123,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:124,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:125,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:126,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:127,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:128,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:129,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:130,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:131,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:132,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:133,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:134,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:135,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:[1,136]},o($VT,[2,130]),o($VT,[2,131]),o($Vz,$VW,{86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,57:64,27:137,28:138,29:139,11:$Vj,22:$Vk,59:$Va,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy}),{11:$Vj,22:$Vk,29:140,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{23:[1,141],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},o($VX,[2,128],{84:$VC}),o($VX,[2,129],{84:$VC}),{11:$Vj,22:$Vk,29:142,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:143,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:144,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:145,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:146,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},o($Vc,[2,58]),{13:$VY,24:147},{15:[1,149]},{14:[1,150],18:[1,151]},o($VZ,[2,12]),{11:[1,152]},{11:[1,153]},{13:$VY,24:154},{19:74,26:155,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8},o($Vz,[2,21]),o($Vc,[2,61]),o($VB,[2,83]),o([15,18,23,48,60,95,96,97],[2,112],{84:$VC,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),o($V_,[2,113],{84:$VC,96:$VE,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),o($V$,[2,120],{84:$VC,109:$VR}),o($V$,[2,121],{84:$VC,109:$VR}),o($V01,[2,122],{84:$VC,104:$VM,105:$VN,109:$VR,110:$VS}),o($V01,[2,123],{84:$VC,104:$VM,105:$VN,109:$VR,110:$VS}),o($V01,[2,124],{84:$VC,104:$VM,105:$VN,109:$VR,110:$VS}),o($VX,[2,125],{84:$VC}),o($V$,[2,126],{84:$VC,109:$VR}),o($V11,[2,114],{84:$VC,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),o($V11,[2,115],{84:$VC,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),o($V11,[2,116],{84:$VC,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),o($V11,[2,117],{84:$VC,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),o($V11,[2,118],{84:$VC,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),o($V11,[2,119],{84:$VC,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),{48:[1,156],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},o($VT,[2,110]),{18:$V21,23:[1,157]},o($Vz,[2,23]),o($Vz,[2,25],{84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),{60:[1,159],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},o($VT,[2,127]),{18:[1,160],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{23:[1,161],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{23:[1,162],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{23:[1,163],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{23:[1,164],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},o($V9,[2,16]),{2:$V31,7:168,11:$V41,14:[1,166],19:177,30:165,31:167,32:169,33:170,34:171,35:172,36:173,37:174,38:175,39:176,42:$V51,56:11,58:179,61:$V61,62:$V71,63:$V81,69:$V91,73:$Va1,74:$Vb1,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8},o($V9,[2,10]),{15:[1,188]},{11:$VV,17:189,19:113,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8},o($VZ,[2,14]),o($VZ,[2,15]),o($V9,[2,17]),o($Vz,[2,18]),{11:$Vj,22:$Vk,29:190,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},o($VU,[2,144]),{11:$Vj,22:$Vk,28:191,29:139,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},o($VT,[2,109]),{11:$Vj,22:$Vk,29:192,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},o($VT,[2,133]),o($VT,[2,134]),o($VT,[2,135]),o($VT,[2,136]),{2:$V31,7:168,11:$V41,14:[1,193],19:177,31:194,32:169,33:170,34:171,35:172,36:173,37:174,38:175,39:176,42:$V51,56:11,58:179,61:$V61,62:$V71,63:$V81,69:$V91,73:$Va1,74:$Vb1,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8},o($Vc1,[2,27]),o($Vd1,[2,29]),o($Vd1,[2,30]),o($Vd1,[2,31]),o($Vd1,[2,32]),o($Vd1,[2,33]),o($Vd1,[2,34]),o($Vd1,[2,35]),o($Vd1,[2,36]),o($Vd1,[2,37]),o($Vd1,[2,38]),{11:$Vi,54:21,57:23,59:$Va},o($Ve1,$Vf1,{11:$Vb,22:[1,196],40:[1,197],41:[1,198],59:[1,195]}),{55:199,84:$Vg1,85:$Vf},{22:[1,201]},{22:[1,202]},{22:[1,203]},{11:[1,205],22:[1,204]},{22:[1,206]},{13:$VY,24:207},{22:[1,208]},o($Vd1,[2,43]),o($V9,[2,11]),o($VZ,[2,13]),o($V_,[2,111],{84:$VC,96:$VE,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS}),o($Vz,[2,22]),{23:[1,209],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},o($Vc1,[2,26]),o($Vd1,[2,28]),{11:$Vj,22:$Vk,29:210,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},o($Vz,$VW,{86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,57:64,28:138,29:139,27:211,11:$Vj,22:$Vk,59:$Va,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy}),{15:[1,212]},{15:[1,213]},{15:[1,214]},{11:[1,215]},{11:$Vj,22:$Vk,29:216,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:217,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:218,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:[1,222],19:220,58:221,70:219,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8},{71:[1,223]},{11:$Vj,22:$Vk,29:224,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{73:[1,225]},{11:$Vj,22:$Vk,29:226,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},o($VT,[2,132]),{60:[1,227],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{18:$V21,23:[1,228]},o($Vd1,[2,39]),o($Vd1,[2,40]),o($Vd1,[2,62]),o($Ve1,[2,96]),{23:[1,229],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{23:[1,230],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{23:[1,231],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{15:[1,232]},{11:$Vi,54:233},{55:234,84:$Vg1,85:$Vf},o($Ve1,$Vf1),{11:[1,235],57:236,59:$Va,72:237},{23:[1,238],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{22:[1,239]},{23:[1,240],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{55:241,85:$Vf},{15:[1,242]},{15:[1,243]},{15:[1,244]},{13:$VY,24:245},{11:$Vj,22:$Vk,29:246,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{18:$Ve,55:247,85:$Vf},{15:[2,79]},{13:$VY,24:248,59:[1,249]},{13:$VY,24:250},{13:$VY,24:251},{13:$VY,24:252},{11:$Vj,22:$Vk,29:253,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{13:[1,255],43:254},{15:[1,256]},o($Vd1,[2,41]),o($Vd1,[2,64]),o($Vd1,[2,65]),o($Vd1,$Vh1,{64:257,67:259,66:$Vi1,68:$Vj1}),{15:[1,261],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{15:[2,78]},o($Vd1,[2,73]),{11:$Vj,22:$Vk,29:262,57:64,59:$Va,77:[1,263],86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},o($Vd1,[2,74]),o($Vd1,[2,75]),o($Vd1,[2,76]),{23:[1,264],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},o($Vd1,[2,42]),{14:[1,265],44:266,46:267,47:$Vk1},o($Vd1,[2,63]),o($Vd1,[2,66]),{13:$VY,24:269},o($Vd1,$Vh1,{67:259,64:270,66:$Vi1,68:$Vj1}),{22:[1,271]},{11:$Vj,22:$Vk,29:272,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{48:[1,273],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{48:[1,274]},o($Vd1,[2,77]),o($Vd1,[2,44]),{14:[2,52],45:275,46:276,47:$Vk1,51:[1,277]},o($Vl1,[2,47]),{11:$Vj,22:$Vk,29:278,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},o($Vd1,[2,68]),o($Vd1,[2,69]),{11:$Vj,22:$Vk,29:279,57:64,59:$Va,86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{23:[1,280],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{11:$Vj,22:$Vk,29:281,57:64,59:$Va,78:[1,282],86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{11:$Vj,22:$Vk,29:283,57:64,59:$Va,78:[1,284],86:39,87:40,88:41,89:42,90:43,91:44,92:45,93:46,94:47,107:$Vl,111:$Vm,112:$Vn,113:$Vo,114:$Vp,115:$Vq,116:$Vr,117:$Vs,118:$Vt,119:$Vu,120:$Vv,121:$Vw,122:$Vx,123:$Vy},{14:[1,285]},o($Vl1,[2,46]),{48:[1,286]},{48:[1,287],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{23:[1,288],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{13:$VY,24:289},{60:[1,290],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{60:[1,291]},{60:[1,292],84:$VC,95:$VD,96:$VE,97:$VF,98:$VG,99:$VH,100:$VI,101:$VJ,102:$VK,103:$VL,104:$VM,105:$VN,106:$VO,107:$VP,108:$VQ,109:$VR,110:$VS},{60:[1,293]},o($Vd1,[2,45]),{2:$V31,7:168,11:$V41,14:$Vm1,19:177,30:295,31:167,32:169,33:170,34:171,35:172,36:173,37:174,38:175,39:176,42:$V51,49:294,50:296,52:$Vn1,53:$Vo1,56:11,58:179,61:$V61,62:$V71,63:$V81,69:$V91,73:$Va1,74:$Vb1,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8},o($Vl1,$Vm1,{56:11,31:167,7:168,32:169,33:170,34:171,35:172,36:173,37:174,38:175,39:176,19:177,58:179,30:295,50:296,49:299,2:$V31,11:$V41,42:$V51,52:$Vn1,53:$Vo1,61:$V61,62:$V71,63:$V81,69:$V91,73:$Va1,74:$Vb1,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8}),{13:$VY,24:300},o($Vd1,[2,72]),{13:[2,85]},{13:[2,88]},{13:[2,86]},{13:[2,87]},{14:[2,51]},o($Vl1,$Vm1,{56:11,7:168,32:169,33:170,34:171,35:172,36:173,37:174,38:175,39:176,19:177,58:179,31:194,50:301,2:$V31,11:$V41,42:$V51,52:$Vn1,53:$Vo1,61:$V61,62:$V71,63:$V81,69:$V91,73:$Va1,74:$Vb1,79:$V4,80:$V5,81:$V6,82:$V7,83:$V8}),o($Vl1,[2,50]),{15:[1,302]},{15:[1,303]},o($Vl1,[2,48]),o([2,11,14,42,47,51,52,53,61,62,63,66,68,69,73,74,79,80,81,82,83],[2,71]),o($Vl1,[2,49]),o($Vl1,[2,53]),o($Vl1,[2,54])],
defaultActions: {2:[2,1],19:[2,2],234:[2,79],247:[2,78],290:[2,85],291:[2,88],292:[2,86],293:[2,87],294:[2,51]},
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
    const {If} = require("../dist/Instrucciones/If");
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
    const {ParametroReturn} = require("../dist/Expresiones/ParametroReturn");
    const {For} = require("../dist/Instrucciones/For");
    const {Forin} = require("../dist/Instrucciones/Forin");
    const {Primitivo} = require("../dist/Expresiones/Primitivo");
    const {AccesoVariable} = require("../dist/Expresiones/AccesoVariable");
    const {ArrbegEnd} = require("../dist/Expresiones/ArrbegEnd");
    const {Operacion, Operador} = require("../dist/Expresiones/Operacion");
    const {Objeto} = require("../dist/Expresiones/Objeto");
    const {Atributo} = require("../dist/Expresiones/Atributo");
    const {AccesoArray} = require("../dist/Expresiones/AccesoArray");
    const {AccesoAtribArray} = require("../dist/Expresiones/AccesoAtribArray");
    const {AsignacionArray} = require("../dist/Instrucciones/AsignacionArray");
    const {IncrDecr} = require("../dist/Instrucciones/IncrDecr");

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
case 9:return 59;
break;
case 10:return 60;
break;
case 11:return 18;
break;
case 12:return 48;
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
case 18:return 63;
break;
case 19:return 68;
break;
case 20:return 66;
break;
case 21:return 73;
break;
case 22:return 74;
break;
case 23:return 69;
break;
case 24:return 52;
break;
case 25:return 53;
break;
case 26:return 42;
break;
case 27:return 47;
break;
case 28:return 51;
break;
case 29:return 118;
break;
case 30:return 117;
break;
case 31:return 'STR_RETURN';
break;
case 32:return 82;
break;
case 33:return 81;
break;
case 34:return 80;
break;
case 35:return 83;
break;
case 36:return 79;
break;
case 37:return 10;
break;
case 38:return 77;
break;
case 39:return 78;
break;
case 40:return 'STR_FUNCTION';
break;
case 41:return 71;
break;
case 42:return 112;
break;
case 43:return 113;
break;
case 44:return 114;
break;
case 45:return 115;
break;
case 46:return 116;
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
case 59:return 101;
break;
case 60:return 102;
break;
case 61:return 98;
break;
case 62:return 100;
break;
case 63:return 103;
break;
case 64:return 99;
break;
case 65:return 97;
break;
case 66:return 96;
break;
case 67:return 108;
break;
case 68:return 111;
break;
case 69:return 85;
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
case 75:return 40;
break;
case 76:return 106;
break;
case 77:return 41;
break;
case 78:return 107;
break;
case 79:return 104;
break;
case 80:return 105;
break;
case 81:return 110;
break;
case 82:return 84;
break;
case 83:return 109;
break;
case 84:return 95;
break;
case 85:return 'OP_HASH';
break;
case 86:return 123;
break;
case 87:return 11;
break;
case 88:return 11;
break;
case 89:return 120;
break;
case 90:return 119;
break;
case 91:yy_.yytext = yy_.yytext.slice(1,-1); return 121;
break;
case 92:yy_.yytext = yy_.yytext.slice(1,-1); return 121;
break;
case 93:return 122;
break;
case 94:return 122;
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
},{"../dist/AST/Tipo":6,"../dist/Expresiones/AccesoArray":7,"../dist/Expresiones/AccesoAtribArray":8,"../dist/Expresiones/AccesoAtributo":9,"../dist/Expresiones/AccesoVariable":10,"../dist/Expresiones/ArrbegEnd":11,"../dist/Expresiones/Atributo":12,"../dist/Expresiones/Objeto":13,"../dist/Expresiones/Operacion":14,"../dist/Expresiones/ParametroReturn":15,"../dist/Expresiones/Primitivo":16,"../dist/Expresiones/Ternario":17,"../dist/Instrucciones/Asignacion":18,"../dist/Instrucciones/AsignacionArray":19,"../dist/Instrucciones/Break":20,"../dist/Instrucciones/Continue":21,"../dist/Instrucciones/Declaracion":22,"../dist/Instrucciones/DeclaracionArray":23,"../dist/Instrucciones/DeclaracionStruct":24,"../dist/Instrucciones/DoWhile":25,"../dist/Instrucciones/For":26,"../dist/Instrucciones/Forin":27,"../dist/Instrucciones/Funcion":28,"../dist/Instrucciones/FuncionReturn":29,"../dist/Instrucciones/If":30,"../dist/Instrucciones/IncrDecr":31,"../dist/Instrucciones/Parametro":32,"../dist/Instrucciones/Print":33,"../dist/Instrucciones/Struct":34,"../dist/Instrucciones/Switch":35,"../dist/Instrucciones/SwitchCaso":36,"../dist/Instrucciones/While":37,"_process":3,"fs":1,"path":2}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],42:[function(require,module,exports){
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
    var entornoGlobal = generarEntornoGlobal(ast, structsG);
    console.log(entornoGlobal);
    //Buscar la funcion main    
    funcionesG.forEach(function (element) {
        if (element.nombrefuncion == "main") {
            console.log("Se ejecutara");
            element.ejecutar(entornoGlobal, ast);
        }
    });
};
window.traducirCodigo = function (entrada) {
    //Reiniciar consola
    reiniciarConsola();
    //traigo todas las raices    
    var instrucciones = gramatica.parse(entrada);
    console.log(instrucciones);
    //Obtengo las funciones y strucs globales y se los asigno al ast
    var funcionesG = revisarFuncionesGlobales(instrucciones);
    var structsG = revisarStructsGlobales(instrucciones);
    var ast = new AST_1.AST(instrucciones, structsG, funcionesG);
    var entornoGlobal = generarEntornoGlobal(ast, structsG);
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
function generarEntornoGlobal(ast, structs) {
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
    structs.forEach(function (element) {
        element.ejecutar(entornoGlobal, ast);
    });
    return entornoGlobal;
}
// ejecutarCodigo(`int id12;
// int var2;`)

},{"../jison/Gramatica":39,"./AST/AST":40,"./AST/Entorno":41}]},{},[42]);

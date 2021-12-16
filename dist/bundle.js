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
var AccesoVariable_1 = require("./AccesoVariable");
var AccesoAtributo = /** @class */ (function () {
    function AccesoAtributo(expr1, expr2, linea, columna) {
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.linea = linea;
        this.columna = columna;
        this.isAlone = false;
    }
    AccesoAtributo.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    AccesoAtributo.prototype.getTipo = function (ent, arbol) {
        var _this = this;
        try {
            var valor_1 = Tipo_1.Tipo.NULL;
            this.expr1.isAlone = false;
            var val1 = this.expr1.getValorImplicito(ent, arbol);
            val1.forEach(function (decl) {
                var nombre = decl.id[0];
                if (nombre == _this.expr2) {
                    // console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                    if (decl.expresion instanceof AccesoVariable_1.AccesoVariable) {
                        decl.expresion.isAlone = false;
                        valor_1 = decl.expresion.getValorImplicito(ent, arbol);
                        decl.expresion.isAlone = true;
                    }
                    else {
                        valor_1 = decl.expresion.getTipo(ent, arbol);
                    }
                }
            });
            this.expr1.isAlone = true;
            return valor_1;
        }
        catch (e) {
            console.error("hubo un error en AccesoAtributo " + e);
            return Tipo_1.Tipo.NULL;
        }
    };
    AccesoAtributo.prototype.getValorImplicito = function (ent, arbol) {
        var _this = this;
        try {
            var valor_2 = null;
            this.expr1.isAlone = false;
            var val1 = this.expr1.getValorImplicito(ent, arbol);
            val1.forEach(function (decl) {
                var nombre = decl.id[0];
                if (nombre == _this.expr2) {
                    // console.log('valor ' + decl.expresion.getValorImplicito(ent, arbol))
                    if (decl.expresion instanceof AccesoVariable_1.AccesoVariable) {
                        decl.expresion.isAlone = false;
                        valor_2 = decl.expresion.getValorImplicito(ent, arbol);
                        decl.expresion.isAlone = true;
                    }
                    else {
                        valor_2 = decl.expresion.getValorImplicito(ent, arbol);
                    }
                }
            });
            this.expr1.isAlone = true;
            return valor_2;
        }
        catch (e) {
            console.error("hubo un error en AccesoAtributo " + e);
            return null;
        }
    };
    return AccesoAtributo;
}());
exports.AccesoAtributo = AccesoAtributo;

},{"../AST/Tipo":6,"./AccesoVariable":10}],10:[function(require,module,exports){
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
            else if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY && this.isAlone) {
                var sendResultado_2 = '[';
                var valor = simbol.getValorImplicito(ent, arbol);
                var exprs_1 = valor.contenido;
                var i_2 = 0;
                exprs_1.forEach(function (expr) {
                    sendResultado_2 += expr.getValorImplicito(ent, arbol);
                    if (i_2 == exprs_1.length - 1) {
                        sendResultado_2 += ']';
                    }
                    else {
                        sendResultado_2 += ',';
                    }
                    i_2++;
                });
                return sendResultado_2;
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
    Operacion.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        console.log("Traduciendo operacion");
        var resultado = "";
        var val1 = this.op_izquierda.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
        var val2 = this.op_derecha.traducir(ent, arbol, resultado3d, temporales, recursivo + 1);
        var valor = this.unirResultado(val1, val2);
        if (recursivo == 0) {
            return valor;
        }
        else {
            resultado3d.codigo3D += '\tt' + temporales.ultimoTemp + '=' + valor + ';\n';
            var valR = 't' + temporales.ultimoTemp;
            temporales.ultimoTemp += 1;
            return valR;
        }
    };
    Operacion.prototype.unirResultado = function (val1, val2) {
        var resultadoR = '';
        if (this.operador == Operador.SUMA) {
            resultadoR = val1 + "+" + val2;
        }
        else if (this.operador == Operador.RESTA) {
            resultadoR = val1 + "-" + val2;
        }
        else if (this.operador == Operador.MULTIPLICACION) {
            resultadoR = val1 + "*" + val2;
        }
        else if (this.operador == Operador.DIVISION) {
            resultadoR = val1 + "/" + val2;
        }
        else if (this.operador == Operador.MAYOR_QUE) {
            resultadoR = val1 + ">" + val2;
        }
        else if (this.operador == Operador.MENOR_QUE) {
            resultadoR = val1 + "<" + val2;
        }
        return resultadoR;
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
exports.OperacionCadena = exports.OperadorCadena = void 0;
var Tipo_1 = require("../AST/Tipo");
var Arreglo_1 = require("../Objetos/Arreglo");
var AccesoVariable_1 = require("./AccesoVariable");
var Primitivo_1 = require("./Primitivo");
var OperadorCadena;
(function (OperadorCadena) {
    OperadorCadena[OperadorCadena["LENGTH"] = 0] = "LENGTH";
    OperadorCadena[OperadorCadena["UPPERCASE"] = 1] = "UPPERCASE";
    OperadorCadena[OperadorCadena["LOWERCASE"] = 2] = "LOWERCASE";
    OperadorCadena[OperadorCadena["CHARPOS"] = 3] = "CHARPOS";
    OperadorCadena[OperadorCadena["SUBSTRING"] = 4] = "SUBSTRING";
    OperadorCadena[OperadorCadena["POP"] = 5] = "POP";
})(OperadorCadena = exports.OperadorCadena || (exports.OperadorCadena = {}));
var OperacionCadena = /** @class */ (function () {
    function OperacionCadena(id, expr1, expr2, operadorCadena, linea, columna) {
        this.isEjecutar = true;
        this.id = id;
        this.expr1 = expr1;
        this.expr2 = expr2;
        this.operadorCadena = operadorCadena;
        this.linea = linea;
        this.columna = columna;
    }
    OperacionCadena.prototype.getTipo = function (ent, arbol) {
        this.isEjecutar = false;
        var valor = this.getValorImplicito(ent, arbol);
        this.isEjecutar = true;
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
    OperacionCadena.prototype.getValorImplicito = function (ent, arbol) {
        var _a;
        if (this.operadorCadena == OperadorCadena.LENGTH) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
                var valor = this.id.getValorImplicito(ent, arbol);
                if (valor instanceof Arreglo_1.Arreglo) {
                    return valor.length;
                }
                else {
                    if (typeof (valor) === "string") {
                        return valor.length;
                    }
                    else {
                        //no es de tipo string
                    }
                }
            }
            else if (this.id instanceof Primitivo_1.Primitivo) {
                if (this.id.getTipo(ent, arbol) === Tipo_1.Tipo.STRING) {
                    return this.id.getValorImplicito(ent, arbol).length;
                }
                else {
                    //no es un primitivo de string
                }
            }
            else {
                //error
            }
        }
        else if (this.operadorCadena == OperadorCadena.LOWERCASE) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol);
            if (typeof (valor) === 'string') {
                return valor.toLocaleLowerCase();
            }
            else {
                //no es de tipo string
            }
        }
        else if (this.operadorCadena == OperadorCadena.UPPERCASE) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol);
            if (typeof (valor) === 'string') {
                return valor.toLocaleUpperCase();
            }
            else {
                //no es de tipo string
            }
        }
        else if (this.operadorCadena == OperadorCadena.CHARPOS) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol);
            if (typeof (valor) === 'string') {
                var posChar = this.expr1.getValorImplicito(ent, arbol);
                if (typeof (posChar) === 'number') {
                    if (this.isInt(Number(posChar))) {
                        return valor.charAt(posChar);
                    }
                    else {
                        //no es un int
                    }
                }
                else {
                    //no es un numero
                }
            }
            else {
                //no es de tipo string
            }
        }
        else if (this.operadorCadena == OperadorCadena.SUBSTRING) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
            }
            var valor = this.id.getValorImplicito(ent, arbol);
            if (typeof (valor) === 'string') {
                var inicial = this.expr1.getValorImplicito(ent, arbol);
                var final = this.expr2.getValorImplicito(ent, arbol);
                if (typeof (final) === 'number' && typeof (inicial) === 'number') {
                    if (this.isInt(Number(inicial)) && this.isInt(Number(final))) {
                        return valor.substring(inicial, final + 1);
                    }
                    else {
                        //no es un int
                    }
                }
                else {
                    //no es un numero
                }
            }
            else {
                //no es de tipo string
            }
        }
        else if (this.operadorCadena == OperadorCadena.POP) {
            if (this.id instanceof AccesoVariable_1.AccesoVariable) {
                this.id.isAlone = false;
                var valor = this.id.getValorImplicito(ent, arbol);
                if (valor instanceof Arreglo_1.Arreglo) {
                    if (this.isEjecutar) {
                        var val = (_a = valor.pop()) === null || _a === void 0 ? void 0 : _a.getValorImplicito(ent, arbol);
                        return val;
                    }
                    else {
                        return valor.getLastContenido().getValorImplicito(ent, arbol);
                    }
                }
                else {
                    //No es un arreglo
                }
            }
        }
        return null;
    };
    OperacionCadena.prototype.traducir = function (ent, arbol, resultado3d, temporales, recursivo) {
        throw new Error("Method not implemented.");
    };
    OperacionCadena.prototype.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    return OperacionCadena;
}());
exports.OperacionCadena = OperacionCadena;

},{"../AST/Tipo":6,"../Objetos/Arreglo":41,"./AccesoVariable":10,"./Primitivo":17}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
    Primitivo.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        console.log("Traduciendo Primitivo");
        //Solo si es numeros      TODO para strings y booleanos  
        return this.valor;
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

},{"../AST/Tipo":6}],18:[function(require,module,exports){
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

},{"../AST/Tipo":6}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
var Tipo_1 = require("../AST/Tipo");
var AccesoVariable_1 = require("../Expresiones/AccesoVariable");
var Asignacion = /** @class */ (function () {
    function Asignacion(id, linea, columna, expresion) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Asignacion.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        if (this.id.length == 1) {
            var id = this.id[0];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == this.expresion.getTipo(ent, arbol)) {
                    //Asignar al stack
                    var valAsign = this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                    resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] =' + valAsign + ';\n';
                }
                else {
                    console.log('Error semantico, El tipo de la variable (' + tipo + ') no concuerda con el tipo asignado (' + this.expresion.getTipo(ent, arbol) + ') en la linea ' + this.linea + ' y columna ' + this.columna);
                }
            }
            else {
                console.log('Error semantico, no existe la variable ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
        //TODO: traducir asignacion de array 
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
            var i = 0;
            var id = this.id[i];
            if (ent.existe(id)) {
                var simbol = ent.getSimbolo(id);
                var tipo = simbol.getTipo(ent, arbol);
                if (tipo == Tipo_1.Tipo.TIPO_STRUCT) {
                    var atributos = simbol.getValorImplicito(ent, arbol);
                    this.asignacionStruct(i, atributos, ent, arbol);
                }
            }
            else {
                console.log('Error semantico, no existe ' + id + ' en la linea ' + this.linea + ' y columna ' + this.columna);
            }
        }
    };
    Asignacion.prototype.getTipo = function () {
        return "asignacion";
    };
    Asignacion.prototype.asignacionStruct = function (i, atributos, ent, arbol) {
        if ((i + 1) >= this.id.length) {
            console.log("No se encontro");
            return;
        }
        var idSig = this.id[i + 1];
        var _loop_1 = function () {
            if (atributo.id[0] === idSig) {
                // console.log(atributo.tipo);
                var isStruct_1 = false;
                arbol.structs.forEach(function (struct) {
                    // console.log(struct.id);
                    if (struct.id === atributo.tipo.toString()) {
                        isStruct_1 = true;
                    }
                });
                if (isStruct_1) {
                    // console.log(atributo.expresion);
                    if (atributo.expresion instanceof AccesoVariable_1.AccesoVariable) {
                        atributo.expresion.isAlone = false;
                        // console.log(atributo.expresion.getValorImplicito(ent, arbol));
                        var val1 = atributo.expresion.getValorImplicito(ent, arbol);
                        atributo.expresion.isAlone = true;
                        this_1.asignacionStruct(i + 1, val1, ent, arbol);
                    }
                }
                else {
                    atributo.expresion = this_1.expresion;
                }
                return { value: void 0 };
            }
        };
        var this_1 = this;
        for (var _i = 0, atributos_2 = atributos; _i < atributos_2.length; _i++) {
            var atributo = atributos_2[_i];
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    return Asignacion;
}());
exports.Asignacion = Asignacion;

},{"../AST/Tipo":6,"../Expresiones/AccesoVariable":10}],20:[function(require,module,exports){
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

},{"../AST/Tipo":6}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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
    Declaracion.prototype.traducir = function (ent, arbol, resultado3d, temporales) {
        var _this = this;
        this.id.forEach(function (id) {
            if (ent.existe(id)) {
                console.log('Id ' + id + ' ya existe');
            }
            else {
                if (_this.expresion == null) {
                    //Se genera el simbolo y se le asigna un lugar en el stack
                    var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, temporales.ultstack);
                    temporales.ultstack += 1;
                    ent.agregar(id, simbol);
                    resultado3d.codigo3D += 'stack[(int)' + simbol.valor + '];\n';
                }
                else {
                    var tipoExpr = _this.expresion.getTipo(ent, arbol);
                    if (tipoExpr == _this.tipo) {
                        //Se genera el simbolo y se le asigna un lugar en el stack
                        //this.expresion.getValorImplicito(ent,arbol)                        
                        var simbol = new Simbolo_1.Simbolo(_this.tipo, id, _this.linea, _this.columna, temporales.ultstack);
                        temporales.ultstack += 1;
                        ent.agregar(id, simbol);
                        //Asignar el valor al stack
                        var valAsign = _this.expresion.traducir(ent, arbol, resultado3d, temporales, 0);
                        resultado3d.codigo3D += '\tstack[(int)' + simbol.valor + '] =' + valAsign + ';\n';
                    }
                    else {
                        console.log('Error semantico, El tipo declarado (' + _this.tipo + ') no concuerda con el tipo asignado (' + tipoExpr + ') en la linea ' + _this.linea + ' y columna ' + _this.columna);
                    }
                }
            }
        });
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

},{"../AST/Simbolo":5,"../AST/Tipo":6}],24:[function(require,module,exports){
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

},{"../AST/Simbolo":5,"../AST/Tipo":6,"../Expresiones/AccesoArray":7,"../Objetos/Arreglo":41}],25:[function(require,module,exports){
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
                                var tipoParam = param.getTipo(ent, arbol);
                                if (tipoParam == Tipo_1.Tipo.TIPO_STRUCT) {
                                    declaracion.expresion = param.valor;
                                }
                                else if (declaracion.tipo === tipoParam || tipoParam === Tipo_1.Tipo.NULL) {
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

},{"../AST/Simbolo":5,"../AST/Tipo":6,"./FuncionReturn":30}],26:[function(require,module,exports){
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

},{"../AST/Entorno":4}],27:[function(require,module,exports){
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

},{"../AST/Entorno":4}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
var Entorno_1 = require("../AST/Entorno");
var Declaracion_1 = require("./Declaracion");
var Funcion = /** @class */ (function () {
    function Funcion(nombrefuncion, tipoFuncion, linea, columna, instrucciones, parametros) {
        if (parametros === void 0) { parametros = []; }
        this.nombrefuncion = nombrefuncion;
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = instrucciones;
        this.tipoFuncion = tipoFuncion;
        this.parametros = parametros;
        this.parametrosR = [];
    }
    Funcion.prototype.traducir = function (ent, arbol, resultado3D, temporales) {
        var entornoGlobal = new Entorno_1.Entorno(ent);
        if (this.nombrefuncion == "main") {
            this.instrucciones.forEach(function (element) {
                element.traducir(entornoGlobal, arbol, resultado3D, temporales);
            });
        }
    };
    Funcion.prototype.ejecutar = function (ent, arbol) {
        var entornoGlobal = new Entorno_1.Entorno(ent);
        //Declarar todos los parametros
        this.declararParametrosReturn(entornoGlobal, arbol);
        //recorro todas las raices  RECURSIVA
        this.instrucciones.forEach(function (element) {
            element.ejecutar(entornoGlobal, arbol);
        });
        // console.log(this.instrucciones);
    };
    Funcion.prototype.getTipo = function () {
        return "funcion";
    };
    Funcion.prototype.setParametrosReturn = function (parametrosR) {
        this.parametrosR = parametrosR;
    };
    Funcion.prototype.declararParametrosReturn = function (ent, arbol) {
        try {
            for (var i = 0; i < this.parametros.length; i++) {
                var parametro = this.parametros[i];
                var parametroR = this.parametrosR[i];
                if (parametroR.getTipo(ent, arbol) == parametro.tipoParametro) {
                    //id:Array<string>,tipo:Tipo, linea:number, columna:number,expresion:Expresion                                        
                    var declPar = new Declaracion_1.Declaracion([parametro.id], parametro.tipoParametro, this.linea, this.columna, parametroR.valor);
                    declPar.ejecutar(ent, arbol);
                }
            }
        }
        catch (error) {
            console.log("Error al declarar un parametro");
        }
    };
    return Funcion;
}());
exports.Funcion = Funcion;

},{"../AST/Entorno":4,"./Declaracion":23}],30:[function(require,module,exports){
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
                element.setParametrosReturn(_this.parametros);
                element.ejecutar(ent, arbol);
                return; // Retornar el valor que retorna la funcion ejecutar
            }
        });
    };
    return FuncionReturn;
}());
exports.FuncionReturn = FuncionReturn;

},{}],31:[function(require,module,exports){
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

},{"../AST/Entorno":4}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pop = void 0;
var Tipo_1 = require("../AST/Tipo");
// print("hola mundo");
var Pop = /** @class */ (function () {
    function Pop(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }
    Pop.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Pop.prototype.ejecutar = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                valor.pop();
            }
            else {
                //no es de tipo array
            }
        }
        else {
            //no existe el id
        }
    };
    return Pop;
}());
exports.Pop = Pop;

},{"../AST/Tipo":6}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Push = void 0;
var Tipo_1 = require("../AST/Tipo");
// print("hola mundo");
var Push = /** @class */ (function () {
    function Push(id, expresion, linea, columna) {
        this.id = id;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    Push.prototype.traducir = function (ent, arbol) {
        throw new Error("Method not implemented.");
    };
    Push.prototype.ejecutar = function (ent, arbol) {
        if (ent.existe(this.id)) {
            var simbol = ent.getSimbolo(this.id);
            if (simbol.getTipo(ent, arbol) == Tipo_1.Tipo.ARRAY) {
                var valor = simbol.getValorImplicito(ent, arbol);
                valor.push(ent, arbol, this.expresion);
            }
            else {
                //no es de tipo array
            }
        }
        else {
            //no existe el id
        }
    };
    return Push;
}());
exports.Push = Push;

},{"../AST/Tipo":6}],37:[function(require,module,exports){
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

},{"../AST/Simbolo":5,"../AST/Tipo":6}],38:[function(require,module,exports){
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

},{"../AST/Tipo":6}],39:[function(require,module,exports){
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

},{"./Break":21}],40:[function(require,module,exports){
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

},{"../AST/Entorno":4}],41:[function(require,module,exports){
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
    Arreglo.prototype.push = function (ent, arbol, nuevo) {
        if (nuevo.getTipo(ent, arbol) == this.tipo) {
            this.contenido.push(nuevo);
            this.length += 1;
            this.dimension += 1;
        }
        else {
            //no es del mismo tipo
        }
    };
    Arreglo.prototype.pop = function () {
        var pop = this.contenido.pop();
        var valor = this.contenido.length;
        this.length = valor;
        this.dimension = valor;
        return pop;
    };
    Arreglo.prototype.getLastContenido = function () {
        return this.contenido[this.length - 1];
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

},{}],42:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,13],$V2=[1,10],$V3=[1,12],$V4=[1,14],$V5=[1,15],$V6=[1,16],$V7=[1,17],$V8=[1,18],$V9=[2,4,10,11,20,83,84,85,86,87],$Va=[1,24],$Vb=[1,25],$Vc=[2,4,10,11,14,20,46,51,55,56,57,65,66,67,73,77,78,83,84,85,86,87],$Vd=[11,63],$Ve=[1,30],$Vf=[1,31],$Vg=[15,18,89],$Vh=[2,97],$Vi=[1,34],$Vj=[1,54],$Vk=[1,56],$Vl=[1,57],$Vm=[1,58],$Vn=[1,59],$Vo=[1,60],$Vp=[1,61],$Vq=[1,62],$Vr=[1,63],$Vs=[1,48],$Vt=[1,49],$Vu=[1,50],$Vv=[1,51],$Vw=[1,52],$Vx=[1,53],$Vy=[1,55],$Vz=[18,23],$VA=[11,13,15,18,23,41,52,64,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],$VB=[18,64],$VC=[1,95],$VD=[1,94],$VE=[1,79],$VF=[1,80],$VG=[1,88],$VH=[1,89],$VI=[1,90],$VJ=[1,91],$VK=[1,92],$VL=[1,93],$VM=[1,81],$VN=[1,82],$VO=[1,83],$VP=[1,84],$VQ=[1,85],$VR=[1,86],$VS=[1,87],$VT=[15,18,23,41,52,64,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],$VU=[15,18,23,41,44,45,52,64,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],$VV=[1,114],$VW=[2,24],$VX=[15,18,23,52,64,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],$VY=[1,154],$VZ=[14,18],$V_=[15,18,23,52,64,104,106],$V$=[15,18,23,52,64,104,105,106,107,108,109,110,111,112,113,114,115,116,117,119],$V01=[15,18,23,52,64,104,105,106,107,108,109,110,111,112,115,116,117],$V11=[15,18,23,52,64,104,105,106,107,108,109,110,111,112],$V21=[1,170],$V31=[1,200],$V41=[1,191],$V51=[1,199],$V61=[1,193],$V71=[1,194],$V81=[1,195],$V91=[1,196],$Va1=[1,197],$Vb1=[1,198],$Vc1=[2,4,10,11,14,20,46,51,55,56,57,65,66,67,70,72,73,77,78,83,84,85,86,87],$Vd1=[2,11,14,46,51,55,56,57,65,66,67,73,77,78,83,84,85,86,87],$Ve1=[2,101],$Vf1=[1,238],$Vg1=[1,257],$Vh1=[2,73],$Vi1=[1,292],$Vj1=[1,294],$Vk1=[1,302],$Vl1=[14,51,55],$Vm1=[2,58],$Vn1=[1,332],$Vo1=[1,333];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"ini":3,"EOF":4,"instrucciones":5,"instruccion":6,"declaracion_bloque":7,"asignacion_funcion":8,"struct_declaracion":9,"STR_STRUCT":10,"ID_VAR":11,"cuerpo_struct":12,"BRACKI":13,"BRACKD":14,"PUNTCOMA":15,"contenido_struct":16,"declaracion_struct":17,"COMA":18,"tiposVar":19,"VOID":20,"MAIN":21,"PARI":22,"PARD":23,"cuerpoFuncion":24,"parametros_funcion":25,"parametro_funcion":26,"parametros_funcion_return":27,"parametro_funcion_return":28,"expresion":29,"instrucciones_funciones":30,"instruccion_funcion":31,"asignacion_bloque":32,"print_bloque":33,"if_bloque":34,"for_bloque":35,"while_bloque":36,"switch_bloque":37,"funcion_return":38,"incremento_decremento":39,"funciones_arreglo":40,"OP_CALL":41,"STR_PUSH":42,"STR_POP":43,"OP_INCR":44,"OP_DECR":45,"STR_SWITCH":46,"switch_cuerpo":47,"casos_switch":48,"opcional_default":49,"caso_switch":50,"STR_CASE":51,"DOSPUNT":52,"contenido_caso":53,"opcional_break":54,"STR_DEFAULT":55,"BREAK":56,"CONTINUE":57,"nombreVars":58,"asignacion":59,"declaracion_arreglo":60,"arr_decl":61,"nombreAtributos":62,"CORCHI":63,"CORCHD":64,"PRINT":65,"PRINTLN":66,"STR_IF":67,"sinos_bloque":68,"instruccion_devuelta":69,"STR_ELSE":70,"sino_si_bloque":71,"STR_ELSEIF":72,"STR_FOR":73,"decl_asign":74,"STR_IN":75,"arr_begin_end":76,"STR_WHILE":77,"STR_DO":78,"parametros_arreglo":79,"expresion_arreglo":80,"STR_BEGIN":81,"STR_END":82,"STR_STRING":83,"STR_DOUBLE":84,"STR_INTEGER":85,"STR_BOOLEAN":86,"STR_CHAR":87,"nombreAtributos_prima":88,"OP_IGUAL":89,"primitivas":90,"logicas":91,"operadores":92,"relacionales":93,"expresion_ternario":94,"incr_decr":95,"nativas":96,"expresion_arr_arreglo":97,"expresion_atributos":98,"LENGTH":99,"UPPERCASE":100,"LOWERCASE":101,"CHARPOS":102,"SUBSTRING":103,"OP_TER":104,"OP_AND":105,"OP_OR":106,"OP_DOBIG":107,"OP_DIF":108,"OP_MAYIG":109,"OP_MENIG":110,"OP_MEN":111,"OP_MAY":112,"OP_MULT":113,"OP_DIVI":114,"OP_SUMA":115,"OP_RESTA":116,"OP_AMP":117,"OP_ELV":118,"OP_MOD":119,"OP_NEG":120,"STR_POW":121,"STR_SQRT":122,"STR_SIN":123,"STR_COS":124,"STR_TAN":125,"STR_FALSE":126,"STR_TRUE":127,"ENTERO":128,"FLOTANTE":129,"STRINGL":130,"CHARL":131,"STR_NULL":132,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",10:"STR_STRUCT",11:"ID_VAR",13:"BRACKI",14:"BRACKD",15:"PUNTCOMA",18:"COMA",20:"VOID",21:"MAIN",22:"PARI",23:"PARD",41:"OP_CALL",42:"STR_PUSH",43:"STR_POP",44:"OP_INCR",45:"OP_DECR",46:"STR_SWITCH",51:"STR_CASE",52:"DOSPUNT",55:"STR_DEFAULT",56:"BREAK",57:"CONTINUE",63:"CORCHI",64:"CORCHD",65:"PRINT",66:"PRINTLN",67:"STR_IF",70:"STR_ELSE",72:"STR_ELSEIF",73:"STR_FOR",75:"STR_IN",77:"STR_WHILE",78:"STR_DO",81:"STR_BEGIN",82:"STR_END",83:"STR_STRING",84:"STR_DOUBLE",85:"STR_INTEGER",86:"STR_BOOLEAN",87:"STR_CHAR",89:"OP_IGUAL",99:"LENGTH",100:"UPPERCASE",101:"LOWERCASE",102:"CHARPOS",103:"SUBSTRING",104:"OP_TER",105:"OP_AND",106:"OP_OR",107:"OP_DOBIG",108:"OP_DIF",109:"OP_MAYIG",110:"OP_MENIG",111:"OP_MEN",112:"OP_MAY",113:"OP_MULT",114:"OP_DIVI",115:"OP_SUMA",116:"OP_RESTA",117:"OP_AMP",118:"OP_ELV",119:"OP_MOD",120:"OP_NEG",121:"STR_POW",122:"STR_SQRT",123:"STR_SIN",124:"STR_COS",125:"STR_TAN",126:"STR_FALSE",127:"STR_TRUE",128:"ENTERO",129:"FLOTANTE",130:"STRINGL",131:"CHARL",132:"STR_NULL"},
productions_: [0,[3,1],[3,2],[5,2],[5,1],[6,1],[6,1],[6,1],[6,1],[9,3],[12,3],[12,4],[16,1],[16,3],[17,2],[17,2],[8,5],[8,6],[25,3],[25,1],[25,0],[26,2],[27,3],[27,1],[27,0],[28,1],[24,3],[24,2],[30,2],[30,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[40,7],[40,6],[39,3],[39,3],[38,5],[37,5],[37,1],[47,2],[47,4],[48,2],[48,1],[50,4],[53,2],[53,1],[49,3],[49,0],[54,2],[54,2],[54,0],[7,3],[7,4],[7,4],[7,1],[60,4],[60,5],[32,3],[32,6],[33,5],[33,5],[34,6],[69,1],[68,2],[68,2],[68,0],[71,5],[35,9],[35,5],[35,5],[35,5],[36,5],[36,6],[74,3],[74,2],[61,3],[61,2],[79,1],[79,3],[80,1],[76,6],[76,6],[76,6],[76,6],[19,1],[19,1],[19,1],[19,1],[19,1],[58,1],[58,3],[62,2],[88,3],[88,0],[59,2],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[97,1],[97,4],[98,3],[98,5],[98,5],[98,5],[98,5],[98,6],[98,8],[94,5],[91,3],[91,3],[93,3],[93,3],[93,3],[93,3],[93,3],[93,3],[92,3],[92,3],[92,3],[92,3],[92,3],[92,3],[92,3],[92,3],[92,2],[92,2],[95,2],[95,2],[96,6],[96,4],[96,4],[96,4],[96,4],[90,1],[90,1],[90,1],[90,1],[90,1],[90,1],[90,1],[90,4],[90,1]],
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
case 3: case 49:
$$[$0-1].push($$[$0]); this.$ = $$[$0-1];
break;
case 4: case 12: case 19: case 23: case 50: case 97:
this.$ = [$$[$0]];
break;
case 5: case 6: case 7: case 30: case 31: case 32: case 33: case 34: case 35: case 36: case 37: case 38: case 39: case 62: case 87: case 102: case 103: case 104: case 105: case 106: case 107: case 108: case 109: case 110: case 111:
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
this.$ = new Funcion("main","void",_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],[]);
break;
case 17:
this.$ = new Funcion($$[$0-4],$$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0],$$[$0-2]);
break;
case 18: case 22: case 86:
$$[$0-2].push($$[$0]);this.$ = $$[$0-2];
break;
case 20: case 24: case 73: case 84: case 101:
this.$ = [];
break;
case 21:
this.$ = new Parametro($$[$0],$$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 25:
this.$ = new ParametroReturn($$[$0],_$[$0].first_line,_$[$0].first_column);
break;
case 26: case 137:
this.$ = $$[$0-1];
break;
case 27: case 55: case 58:
this.$ = null;
break;
case 28:
        
        $$[$0-1].push($$[$0]);
        this.$ = $$[$0-1];
    
break;
case 29:
                
        this.$ = [$$[$0]];
    
break;
case 40:
this.$ = new Push($$[$0-6],$$[$0-2],_$[$0-6].first_line, _$[$0-6].first_column);
break;
case 41:
this.$ = new Pop($$[$0-5],_$[$0-5].first_line, _$[$0-5].first_column);
break;
case 42:
   let accVar = new AccesoVariable($$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column);
            let operInDec = new Operacion(accVar,null,Operador.INCREMENTO, _$[$0-2].first_line, _$[$0-2].first_column);
            this.$ = new IncrDecr(operInDec,_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-2]);
        
break;
case 43:
   let accVar1 = new AccesoVariable($$[$0-2], _$[$0-2].first_line, _$[$0-2].first_column);
            let operInDec1 = new Operacion(accVar1,null,Operador.DECREMENTO, _$[$0-2].first_line, _$[$0-2].first_column);
            this.$ = new IncrDecr(operInDec1,_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-2]);
        
break;
case 44:
this.$ = new FuncionReturn($$[$0-4],_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-2]);
break;
case 45:
this.$ = new Switch($$[$0-2],$$[$0],_$[$0-4].first_line,_$[$0-4].first_column);
break;
case 47:
this.$= [];
break;
case 48:

            if ($$[$0-1] != null){
                $$[$0-2].push($$[$0-1]);
            }
            this.$ = $$[$0-2];
        
break;
case 51:
this.$ = new SwitchCaso($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].first_column);
break;
case 52:

            if ($$[$0] != null){
                $$[$0-1].push($$[$0]);
            }
            this.$ = $$[$0-1];
        
break;
case 53:

            if ($$[$0] == null){
                this.$ = [];
            }else{
                this.$ = [$$[$0]];
            }
        
break;
case 54:
let nul = new Primitivo(null, _$[$0-2].first_line, _$[$0-2].first_column);this.$ = new SwitchCaso(nul,$$[$0],_$[$0-2].first_line,_$[$0-2].first_column);
break;
case 56:
this.$ = new Break(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 57:
this.$ = new Continue(_$[$0-1].first_line,_$[$0-1].first_column);
break;
case 59:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,null);
break;
case 60:
this.$ = new Declaracion($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 61:
this.$ =  new DeclaracionStruct($$[$0-2],$$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 63:
this.$ = new DeclaracionArray($$[$0-1],$$[$0-3],$$[$0-2],_$[$0-3].first_line,_$[$0-3].first_column,null);
break;
case 64:
this.$ = new DeclaracionArray($$[$0-2],$$[$0-4],$$[$0-3],_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-1]);
break;
case 65:
this.$ = new Asignacion($$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0-1]);
break;
case 66:
this.$ = new AsignacionArray($$[$0-5],$$[$0-3],_$[$0-5].first_line, _$[$0-5].first_column,$$[$0-1]);
break;
case 67:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,false);
break;
case 68:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].first_column,true);
break;
case 69:
this.$ = new If(_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],$$[$0-1],$$[$0],"if");
break;
case 70: case 85:
this.$ = [$$[$0]]
break;
case 71:
this.$ = [new If(_$[$0-1].first_line,_$[$0-1].first_column,null,$$[$0],[],"else")];
break;
case 72:
$$[$0].push($$[$0-1]); this.$ = $$[$0]
break;
case 74:
this.$ = new If(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0-2],$$[$0],[],"elseif");
break;
case 75:
this.$ = new For(_$[$0-8].first_line,_$[$0-8].first_column,$$[$0],$$[$0-6],$$[$0-4],$$[$0-2]);
break;
case 76: case 77: case 78:
this.$ = new Forin(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-3],$$[$0-1]);
break;
case 79:
this.$ = new While(_$[$0-4].first_line,_$[$0-4].first_column,$$[$0],$$[$0-2]);
break;
case 80:
this.$ = new DoWhile(_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-4],$$[$0-1]);
break;
case 81:
this.$ = new Declaracion($$[$0-1],$$[$0-2],_$[$0-2].first_line,_$[$0-2].first_column,$$[$0]);
break;
case 82:
this.$ = new Asignacion($$[$0-1],_$[$0-1].first_line,_$[$0-1].first_column,$$[$0]);
break;
case 83:
this.$ = $$[$0-1]
break;
case 88:
this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],$$[$0-1]);
break;
case 89:
let beg = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg,$$[$0-1]);
break;
case 90:
let beg1 = new Primitivo("begin", _$[$0-5].first_line, _$[$0-5].first_column); let end1 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,beg1,end1);
break;
case 91:
let beg2 = new Primitivo("end", _$[$0-5].first_line, _$[$0-5].first_column); this.$ = new ArrbegEnd($$[$0-5],_$[$0-5].first_line,_$[$0-5].first_column,$$[$0-3],beg2);
break;
case 92:
this.$ = Tipo.STRING;
break;
case 93:
this.$ = Tipo.DOUBLE;
break;
case 94:
this.$ = Tipo.INT;
break;
case 95:
this.$ = Tipo.BOOL;
break;
case 96:
this.$ = Tipo.CHAR;
break;
case 98:
 $$[$0-2].push($$[$0]);this.$ = $$[$0-2];
break;
case 99: case 100:
$$[$0].unshift($$[$0-1]); this.$ = $$[$0];
break;
case 112:
this.$ = new AccesoArray($$[$0],_$[$0].first_line, _$[$0].first_column);
break;
case 113:
this.$ = new AccesoAtribArray($$[$0-3],$$[$0-1],_$[$0-3].first_line, _$[$0-3].first_column);
break;
case 114:
this.$ = new AccesoAtributo($$[$0-2],$$[$0],_$[$0-2].first_line, _$[$0-2].first_column);
break;
case 115:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.LENGTH,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 116:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.POP,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 117:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.UPPERCASE,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 118:
this.$ = new OperacionCadena($$[$0-4],null,null,OperadorCadena.LOWERCASE,_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 119:
this.$ = new OperacionCadena($$[$0-5],$$[$0-1],null,OperadorCadena.CHARPOS,_$[$0-5].first_line, _$[$0-5].first_column);
break;
case 120:
this.$ = new OperacionCadena($$[$0-7],$$[$0-3],$$[$0-1],OperadorCadena.SUBSTRING,_$[$0-7].first_line, _$[$0-7].first_column);
break;
case 121:
this.$ = new Ternario($$[$0-4],$$[$0-2],$$[$0],_$[$0-4].first_line, _$[$0-4].first_column);
break;
case 122:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AND, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 123:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.OR, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 124:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.IGUAL_IGUAL, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 125:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIFERENTE_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 126:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 127:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_IGUA_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 128:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MENOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 129:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MAYOR_QUE, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 130:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MULTIPLICACION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 131:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.DIVISION, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 132:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.SUMA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 133:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.RESTA, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 134:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.AMPERSON, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 135:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.ELEVADO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 136:
this.$ = new Operacion($$[$0-2],$$[$0],Operador.MODULO, _$[$0-2].first_line, _$[$0-2].first_column);
break;
case 138:
this.$ = new Operacion($$[$0],null,Operador.MENOS_UNARIO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 139:
this.$ = new Operacion($$[$0],null,Operador.NOT, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 140:
this.$ = new Operacion($$[$0-1],null,Operador.INCREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 141:
this.$ = new Operacion($$[$0-1],null,Operador.DECREMENTO, _$[$0-1].first_line, _$[$0-1].first_column);
break;
case 142:
this.$ = new Operacion($$[$0-3],$$[$0-1],Operador.POW, _$[$0-5].first_line, _$[$0-5].first_column);
break;
case 143:
this.$ = new Operacion($$[$0-1],null,Operador.SQRT, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 144:
this.$ = new Operacion($$[$0-1],null,Operador.SIN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 145:
this.$ = new Operacion($$[$0-1],null,Operador.COS, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 146:
this.$ = new Operacion($$[$0-1],null,Operador.TAN, _$[$0-3].first_line, _$[$0-3].first_column);
break;
case 147:
this.$ = new Primitivo(false, _$[$0].first_line, _$[$0].first_column);
break;
case 148:
this.$ = new Primitivo(true, _$[$0].first_line, _$[$0].first_column);
break;
case 149: case 150:
this.$ = new Primitivo(Number($$[$0]), _$[$0].first_line, _$[$0].first_column);
break;
case 151: case 152:
this.$ = new Primitivo($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 153:
this.$ = new AccesoVariable($$[$0], _$[$0].first_line, _$[$0].first_column);
break;
case 154:
this.$ = new FuncionReturn($$[$0-3],_$[$0-3].first_line,_$[$0-3].first_column,$$[$0-1]);
break;
case 155:
this.$ = new Primitivo(null, _$[$0].first_line, _$[$0].first_column);
break;
}
},
table: [{2:$V0,3:1,4:[1,2],5:3,6:4,7:5,8:6,9:7,10:$V1,11:$V2,19:9,20:$V3,60:11,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8},{1:[3]},{1:[2,1]},{2:$V0,4:[1,19],6:20,7:5,8:6,9:7,10:$V1,11:$V2,19:9,20:$V3,60:11,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8},o($V9,[2,4]),o($V9,[2,5]),o($V9,[2,6]),o($V9,[2,7]),o($V9,[2,8]),{11:[1,22],58:21,61:23,63:$Va},{11:$Vb},o($Vc,[2,62]),{21:[1,26]},{11:[1,27]},o($Vd,[2,92]),o($Vd,[2,93]),o($Vd,[2,94]),o($Vd,[2,95]),o($Vd,[2,96]),{1:[2,2]},o($V9,[2,3]),{15:[1,28],18:$Ve,59:29,89:$Vf},o($Vg,$Vh,{22:[1,32]}),{11:$Vi,58:33},{11:$Vj,22:$Vk,29:38,61:64,63:$Va,64:[1,36],79:35,80:37,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{59:65,89:$Vf},{22:[1,66]},{12:67,13:[1,68]},o($Vc,[2,59]),{15:[1,69]},{11:[1,70]},{11:$Vj,22:$Vk,29:71,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($Vz,[2,20],{25:72,26:73,19:74,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8}),{15:[1,75],18:$Ve,59:76,89:$Vf},o($Vg,$Vh),{18:[1,78],64:[1,77]},o($VA,[2,84]),o($VB,[2,85]),o($VB,[2,87],{41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),o($VT,[2,103],{44:[1,96],45:[1,97]}),o($VT,[2,104]),o($VT,[2,105]),o($VT,[2,106]),o($VT,[2,107]),o($VT,[2,108]),o($VT,[2,109]),o($VT,[2,110]),o($VT,[2,111]),o($VU,[2,147]),o($VU,[2,148]),o($VU,[2,149]),o($VU,[2,150]),o($VU,[2,151]),o($VU,[2,152]),o($VU,[2,153],{22:[1,98],63:[1,99]}),o($VU,[2,155]),{11:$Vj,22:$Vk,29:100,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:101,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:102,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{22:[1,103]},{22:[1,104]},{22:[1,105]},{22:[1,106]},{22:[1,107]},o($VT,[2,112]),{15:[1,108]},{23:[1,109]},o($V9,[2,9]),{11:$VV,14:[1,110],16:111,17:112,19:113,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8},o($Vc,[2,60]),o($Vg,[2,98]),{15:[2,102],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{18:[1,116],23:[1,115]},o($Vz,[2,19]),{11:[1,117]},o($Vc,[2,63]),{15:[1,118]},o($VA,[2,83]),{11:$Vj,22:$Vk,29:38,61:64,63:$Va,80:119,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:120,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:121,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:122,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:123,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:124,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:125,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:126,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:127,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:128,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:129,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:130,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:131,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:132,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:133,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:134,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:135,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:[1,136],43:[1,138],99:[1,137],100:[1,139],101:[1,140],102:[1,141],103:[1,142]},o($VT,[2,140]),o($VT,[2,141]),o($Vz,$VW,{90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,61:64,27:143,28:144,29:145,11:$Vj,22:$Vk,63:$Va,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy}),{11:$Vj,22:$Vk,29:146,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{23:[1,147],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},o($VX,[2,138],{41:$VC}),o($VX,[2,139],{41:$VC}),{11:$Vj,22:$Vk,29:148,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:149,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:150,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:151,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:152,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($Vc,[2,61]),{13:$VY,24:153},{15:[1,155]},{14:[1,156],18:[1,157]},o($VZ,[2,12]),{11:[1,158]},{11:[1,159]},{13:$VY,24:160},{19:74,26:161,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8},o($Vz,[2,21]),o($Vc,[2,64]),o($VB,[2,86]),o([15,18,23,52,64,104,105,106],[2,122],{41:$VC,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),o($V_,[2,123],{41:$VC,105:$VE,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),o($V$,[2,130],{41:$VC,118:$VR}),o($V$,[2,131],{41:$VC,118:$VR}),o($V01,[2,132],{41:$VC,113:$VM,114:$VN,118:$VR,119:$VS}),o($V01,[2,133],{41:$VC,113:$VM,114:$VN,118:$VR,119:$VS}),o($V01,[2,134],{41:$VC,113:$VM,114:$VN,118:$VR,119:$VS}),o($VX,[2,135],{41:$VC}),o($V$,[2,136],{41:$VC,118:$VR}),o($V11,[2,124],{41:$VC,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),o($V11,[2,125],{41:$VC,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),o($V11,[2,126],{41:$VC,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),o($V11,[2,127],{41:$VC,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),o($V11,[2,128],{41:$VC,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),o($V11,[2,129],{41:$VC,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),{41:$VC,52:[1,162],104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},o($VT,[2,114]),{22:[1,163]},{22:[1,164]},{22:[1,165]},{22:[1,166]},{22:[1,167]},{22:[1,168]},{18:$V21,23:[1,169]},o($Vz,[2,23]),o($Vz,[2,25],{41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),{41:$VC,64:[1,171],104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},o($VT,[2,137]),{18:[1,172],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{23:[1,173],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{23:[1,174],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{23:[1,175],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{23:[1,176],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},o($V9,[2,16]),{2:$V31,7:180,11:$V41,14:[1,178],19:190,30:177,31:179,32:181,33:182,34:183,35:184,36:185,37:186,38:187,39:188,40:189,46:$V51,60:11,62:192,65:$V61,66:$V71,67:$V81,73:$V91,77:$Va1,78:$Vb1,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8},o($V9,[2,10]),{15:[1,201]},{11:$VV,17:202,19:113,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8},o($VZ,[2,14]),o($VZ,[2,15]),o($V9,[2,17]),o($Vz,[2,18]),{11:$Vj,22:$Vk,29:203,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{23:[1,204]},{23:[1,205]},{23:[1,206]},{23:[1,207]},{11:$Vj,22:$Vk,29:208,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:209,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($VU,[2,154]),{11:$Vj,22:$Vk,28:210,29:145,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($VT,[2,113]),{11:$Vj,22:$Vk,29:211,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($VT,[2,143]),o($VT,[2,144]),o($VT,[2,145]),o($VT,[2,146]),{2:$V31,7:180,11:$V41,14:[1,212],19:190,31:213,32:181,33:182,34:183,35:184,36:185,37:186,38:187,39:188,40:189,46:$V51,60:11,62:192,65:$V61,66:$V71,67:$V81,73:$V91,77:$Va1,78:$Vb1,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8},o($Vc1,[2,27]),o($Vd1,[2,29]),o($Vd1,[2,30]),o($Vd1,[2,31]),o($Vd1,[2,32]),o($Vd1,[2,33]),o($Vd1,[2,34]),o($Vd1,[2,35]),o($Vd1,[2,36]),o($Vd1,[2,37]),o($Vd1,[2,38]),o($Vd1,[2,39]),{11:$Vi,58:21,61:23,63:$Va},{11:$Vb,22:[1,215],41:[1,218],44:[1,216],45:[1,217],63:[1,214],88:219,89:$Ve1},{59:220,89:$Vf},{22:[1,221]},{22:[1,222]},{22:[1,223]},{11:[1,225],22:[1,224]},{22:[1,226]},{13:$VY,24:227},{22:[1,228]},o($Vd1,[2,46]),o($V9,[2,11]),o($VZ,[2,13]),o($V_,[2,121],{41:$VC,105:$VE,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS}),o($VT,[2,115]),o($VT,[2,116]),o($VT,[2,117]),o($VT,[2,118]),{23:[1,229],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{18:[1,230],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},o($Vz,[2,22]),{23:[1,231],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},o($Vc1,[2,26]),o($Vd1,[2,28]),{11:$Vj,22:$Vk,29:232,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($Vz,$VW,{90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,61:64,28:144,29:145,27:233,11:$Vj,22:$Vk,63:$Va,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy}),{15:[1,234]},{15:[1,235]},{11:$Vf1,42:[1,236],43:[1,237]},{89:[2,99]},{15:[1,239]},{11:$Vj,22:$Vk,29:240,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:241,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:242,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:[1,246],19:244,62:245,74:243,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8},{75:[1,247]},{11:$Vj,22:$Vk,29:248,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{77:[1,249]},{11:$Vj,22:$Vk,29:250,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($VT,[2,119]),{11:$Vj,22:$Vk,29:251,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($VT,[2,142]),{41:$VC,64:[1,252],104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{18:$V21,23:[1,253]},o($Vd1,[2,42]),o($Vd1,[2,43]),{22:[1,254]},{22:[1,255]},{41:$Vg1,88:256,89:$Ve1},o($Vd1,[2,65]),{23:[1,258],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{23:[1,259],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{23:[1,260],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{15:[1,261]},{11:$Vi,58:262},{59:263,89:$Vf},{41:$Vg1,88:219,89:$Ve1},{11:[1,264],61:265,63:$Va,76:266},{23:[1,267],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{22:[1,268]},{23:[1,269],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{23:[1,270],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{59:271,89:$Vf},{15:[1,272]},{11:$Vj,22:$Vk,29:273,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{23:[1,274]},{89:[2,100]},{11:$Vf1},{15:[1,275]},{15:[1,276]},{13:$VY,24:277},{11:$Vj,22:$Vk,29:278,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{18:$Ve,59:279,89:$Vf},{15:[2,82]},{13:$VY,24:280,63:[1,281]},{13:$VY,24:282},{13:$VY,24:283},{13:$VY,24:284},{11:$Vj,22:$Vk,29:285,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{13:[1,287],47:286},o($VT,[2,120]),{15:[1,288]},o($Vd1,[2,44]),{23:[1,289],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{15:[1,290]},o($Vd1,[2,67]),o($Vd1,[2,68]),o($Vd1,$Vh1,{68:291,71:293,70:$Vi1,72:$Vj1}),{15:[1,295],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{15:[2,81]},o($Vd1,[2,76]),{11:$Vj,22:$Vk,29:296,61:64,63:$Va,81:[1,297],90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($Vd1,[2,77]),o($Vd1,[2,78]),o($Vd1,[2,79]),{23:[1,298],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},o($Vd1,[2,45]),{14:[1,299],48:300,50:301,51:$Vk1},o($Vd1,[2,66]),{15:[1,303]},o($Vd1,[2,41]),o($Vd1,[2,69]),{13:$VY,24:304},o($Vd1,$Vh1,{71:293,68:305,70:$Vi1,72:$Vj1}),{22:[1,306]},{11:$Vj,22:$Vk,29:307,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{41:$VC,52:[1,308],104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{52:[1,309]},o($Vd1,[2,80]),o($Vd1,[2,47]),{14:[2,55],49:310,50:311,51:$Vk1,55:[1,312]},o($Vl1,[2,50]),{11:$Vj,22:$Vk,29:313,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},o($Vd1,[2,40]),o($Vd1,[2,71]),o($Vd1,[2,72]),{11:$Vj,22:$Vk,29:314,61:64,63:$Va,90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{23:[1,315],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{11:$Vj,22:$Vk,29:316,61:64,63:$Va,82:[1,317],90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{11:$Vj,22:$Vk,29:318,61:64,63:$Va,82:[1,319],90:39,91:40,92:41,93:42,94:43,95:44,96:45,97:46,98:47,116:$Vl,120:$Vm,121:$Vn,122:$Vo,123:$Vp,124:$Vq,125:$Vr,126:$Vs,127:$Vt,128:$Vu,129:$Vv,130:$Vw,131:$Vx,132:$Vy},{14:[1,320]},o($Vl1,[2,49]),{52:[1,321]},{41:$VC,52:[1,322],104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{23:[1,323],41:$VC,104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{13:$VY,24:324},{41:$VC,64:[1,325],104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{64:[1,326]},{41:$VC,64:[1,327],104:$VD,105:$VE,106:$VF,107:$VG,108:$VH,109:$VI,110:$VJ,111:$VK,112:$VL,113:$VM,114:$VN,115:$VO,116:$VP,117:$VQ,118:$VR,119:$VS},{64:[1,328]},o($Vd1,[2,48]),{2:$V31,7:180,11:$V41,14:$Vm1,19:190,30:330,31:179,32:181,33:182,34:183,35:184,36:185,37:186,38:187,39:188,40:189,46:$V51,53:329,54:331,56:$Vn1,57:$Vo1,60:11,62:192,65:$V61,66:$V71,67:$V81,73:$V91,77:$Va1,78:$Vb1,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8},o($Vl1,$Vm1,{60:11,31:179,7:180,32:181,33:182,34:183,35:184,36:185,37:186,38:187,39:188,40:189,19:190,62:192,30:330,54:331,53:334,2:$V31,11:$V41,46:$V51,56:$Vn1,57:$Vo1,65:$V61,66:$V71,67:$V81,73:$V91,77:$Va1,78:$Vb1,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8}),{13:$VY,24:335},o($Vd1,[2,75]),{13:[2,88]},{13:[2,91]},{13:[2,89]},{13:[2,90]},{14:[2,54]},o($Vl1,$Vm1,{60:11,7:180,32:181,33:182,34:183,35:184,36:185,37:186,38:187,39:188,40:189,19:190,62:192,31:213,54:336,2:$V31,11:$V41,46:$V51,56:$Vn1,57:$Vo1,65:$V61,66:$V71,67:$V81,73:$V91,77:$Va1,78:$Vb1,83:$V4,84:$V5,85:$V6,86:$V7,87:$V8}),o($Vl1,[2,53]),{15:[1,337]},{15:[1,338]},o($Vl1,[2,51]),o([2,11,14,46,51,55,56,57,65,66,67,70,72,73,77,78,83,84,85,86,87],[2,74]),o($Vl1,[2,52]),o($Vl1,[2,56]),o($Vl1,[2,57])],
defaultActions: {2:[2,1],19:[2,2],219:[2,99],256:[2,100],263:[2,82],279:[2,81],325:[2,88],326:[2,91],327:[2,89],328:[2,90],329:[2,54]},
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
    const {Push} = require("../dist/Instrucciones/Push");
    const {Pop} = require("../dist/Instrucciones/Pop");
    const {OperacionCadena, OperadorCadena} = require("../dist/Expresiones/OperacionCadena");

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
case 9:return 63;
break;
case 10:return 64;
break;
case 11:return 18;
break;
case 12:return 52;
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
case 18:return 67;
break;
case 19:return 72;
break;
case 20:return 70;
break;
case 21:return 77;
break;
case 22:return 78;
break;
case 23:return 73;
break;
case 24:return 56;
break;
case 25:return 57;
break;
case 26:return 46;
break;
case 27:return 51;
break;
case 28:return 55;
break;
case 29:return 127;
break;
case 30:return 126;
break;
case 31:return 'STR_RETURN';
break;
case 32:return 86;
break;
case 33:return 85;
break;
case 34:return 84;
break;
case 35:return 87;
break;
case 36:return 83;
break;
case 37:return 10;
break;
case 38:return 81;
break;
case 39:return 82;
break;
case 40:return 'STR_FUNCTION';
break;
case 41:return 75;
break;
case 42:return 121;
break;
case 43:return 122;
break;
case 44:return 123;
break;
case 45:return 124;
break;
case 46:return 125;
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
case 52:return 42;
break;
case 53:return 43;
break;
case 54:return 102;
break;
case 55:return 103;
break;
case 56:return 99;
break;
case 57:return 100;
break;
case 58:return 101;
break;
case 59:return 110;
break;
case 60:return 111;
break;
case 61:return 107;
break;
case 62:return 109;
break;
case 63:return 112;
break;
case 64:return 108;
break;
case 65:return 106;
break;
case 66:return 105;
break;
case 67:return 117;
break;
case 68:return 120;
break;
case 69:return 89;
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
case 75:return 44;
break;
case 76:return 115;
break;
case 77:return 45;
break;
case 78:return 116;
break;
case 79:return 113;
break;
case 80:return 114;
break;
case 81:return 119;
break;
case 82:return 41;
break;
case 83:return 118;
break;
case 84:return 104;
break;
case 85:return 'OP_HASH';
break;
case 86:return 132;
break;
case 87:return 11;
break;
case 88:return 11;
break;
case 89:return 129;
break;
case 90:return 128;
break;
case 91:yy_.yytext = yy_.yytext.slice(1,-1); return 130;
break;
case 92:yy_.yytext = yy_.yytext.slice(1,-1); return 130;
break;
case 93:return 131;
break;
case 94:return 131;
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
},{"../dist/AST/Tipo":6,"../dist/Expresiones/AccesoArray":7,"../dist/Expresiones/AccesoAtribArray":8,"../dist/Expresiones/AccesoAtributo":9,"../dist/Expresiones/AccesoVariable":10,"../dist/Expresiones/ArrbegEnd":11,"../dist/Expresiones/Atributo":12,"../dist/Expresiones/Objeto":13,"../dist/Expresiones/Operacion":14,"../dist/Expresiones/OperacionCadena":15,"../dist/Expresiones/ParametroReturn":16,"../dist/Expresiones/Primitivo":17,"../dist/Expresiones/Ternario":18,"../dist/Instrucciones/Asignacion":19,"../dist/Instrucciones/AsignacionArray":20,"../dist/Instrucciones/Break":21,"../dist/Instrucciones/Continue":22,"../dist/Instrucciones/Declaracion":23,"../dist/Instrucciones/DeclaracionArray":24,"../dist/Instrucciones/DeclaracionStruct":25,"../dist/Instrucciones/DoWhile":26,"../dist/Instrucciones/For":27,"../dist/Instrucciones/Forin":28,"../dist/Instrucciones/Funcion":29,"../dist/Instrucciones/FuncionReturn":30,"../dist/Instrucciones/If":31,"../dist/Instrucciones/IncrDecr":32,"../dist/Instrucciones/Parametro":33,"../dist/Instrucciones/Pop":34,"../dist/Instrucciones/Print":35,"../dist/Instrucciones/Push":36,"../dist/Instrucciones/Struct":37,"../dist/Instrucciones/Switch":38,"../dist/Instrucciones/SwitchCaso":39,"../dist/Instrucciones/While":40,"_process":3,"fs":1,"path":2}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resultado3D = void 0;
var Resultado3D = /** @class */ (function () {
    function Resultado3D() {
        this.codigo3D = "";
    }
    Resultado3D.prototype.setTemporal = function (temporal) {
        this.temporal = temporal;
    };
    return Resultado3D;
}());
exports.Resultado3D = Resultado3D;

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Temporales = void 0;
var Temporales = /** @class */ (function () {
    function Temporales() {
        this.ultimoTemp = 0;
        this.ultstack = 0;
        this.ultheap = 0;
    }
    return Temporales;
}());
exports.Temporales = Temporales;

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AST_1 = require("./AST/AST");
var Entorno_1 = require("./AST/Entorno");
var Resultado3D_1 = require("./AST/Resultado3D");
var Temporales_1 = require("./AST/Temporales");
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
    reiniciarTraduccion();
    var resultado3d = new Resultado3D_1.Resultado3D();
    var temporales = new Temporales_1.Temporales();
    //traigo todas las raices    
    var instrucciones = gramatica.parse(entrada);
    console.log(instrucciones);
    //Obtengo las funciones y strucs globales y se los asigno al ast
    var funcionesG = revisarFuncionesGlobales(instrucciones);
    var structsG = revisarStructsGlobales(instrucciones);
    var ast = new AST_1.AST(instrucciones, structsG, funcionesG);
    var entornoGlobal = generarEntornoGlobalTraducir(ast, structsG, resultado3d, temporales);
    //Buscar la funcion main    
    funcionesG.forEach(function (element) {
        if (element.nombrefuncion == "main") {
            console.log("Se ejecutara");
            element.traducir(entornoGlobal, ast, resultado3d, temporales);
        }
    });
    traducirCompleto(resultado3d, temporales);
};
function reiniciarConsola() {
    var areaConsola = document.getElementById('consola');
    areaConsola.value = "";
}
function reiniciarTraduccion() {
    var areaTraduccion = document.getElementById('traduccion');
    areaTraduccion.value = "";
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
function generarEntornoGlobalTraducir(ast, structs, resultado3D, temporales) {
    var entornoGlobal = new Entorno_1.Entorno(null);
    var instrucciones = ast.instrucciones;
    var declaracionesG = Array();
    instrucciones.forEach(function (element) {
        if (element.getTipo() == "declaracion") {
            declaracionesG.push(element);
        }
    });
    declaracionesG.forEach(function (element) {
        element.traducir(entornoGlobal, ast, resultado3D, temporales);
    });
    structs.forEach(function (element) {
        element.traducir(entornoGlobal, ast, resultado3D, temporales);
    });
    return entornoGlobal;
}
function traducirCompleto(resultado3D, temporales) {
    //Traer el codigo en 3D    
    //Ingresar encabezado
    var encabezado = '#include <stdio.h> \n#include <math.h> \ndouble heap[30101999]; \ndouble stack[30101999]; \ndouble P; \ndouble H;';
    //Inicializar todos los temporales
    //Generar las funciones nativas
    //Generar el proceso main
    var procMain = '\nvoid main() { \n\tP = 0; \n\tH = 0;\n';
    //Agregar el resultado 3D en el main
    procMain += resultado3D.codigo3D;
    //Cerrar     
    procMain += '\n\treturn; \n }';
    //Mostrar en el text area
    var resultado = encabezado + procMain;
    var areaTraduccion = document.getElementById('traduccion');
    areaTraduccion.value = resultado;
}

},{"../jison/Gramatica":42,"./AST/AST":43,"./AST/Entorno":44,"./AST/Resultado3D":45,"./AST/Temporales":46}]},{},[47]);

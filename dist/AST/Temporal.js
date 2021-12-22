"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Temporal = /** @class */ (function () {
    function Temporal(nombre) {
        this.nombre = nombre;
        this.utilizado = false;
    }
    Temporal.prototype.utilizar = function () {
        this.utilizado = true;
    };
    return Temporal;
}());
exports.Temporal = Temporal;

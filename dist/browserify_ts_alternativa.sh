#!/bin/bash
browserify ../ts/Ejecutar.ts -p [ tsify --noImplicitAny] > bundle.js
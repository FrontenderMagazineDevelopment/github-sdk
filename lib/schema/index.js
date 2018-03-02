'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _upload = require('./upload.js');

Object.keys(_upload).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _upload[key];
    }
  });
});

var _create = require('./create.js');

Object.keys(_create).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _create[key];
    }
  });
});
//# sourceMappingURL=index.js.map
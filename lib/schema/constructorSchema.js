'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var constructorSchema = _joi2.default.string().trim().token().min(1, 'utf8').required();

exports.default = constructorSchema;
//# sourceMappingURL=constructorSchema.js.map
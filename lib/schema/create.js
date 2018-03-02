'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createSchema = _joi2.default.object().keys({
  name: _joi2.default.string().trim().min(1, 'utf8').required(),
  org: _joi2.default.string().trim().min(1, 'utf8').required(),
  description: _joi2.default.string().trim().min(1, 'utf8').default(null),
  homepage: _joi2.default.string().trim().min(1, 'utf8').uri().default(null)
});

exports.default = createSchema;
//# sourceMappingURL=create.js.map
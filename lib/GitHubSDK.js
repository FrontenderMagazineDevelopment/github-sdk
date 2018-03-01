'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _ErrorServerResponse = require('./ErrorServerResponse');

var _ErrorServerResponse2 = _interopRequireDefault(_ErrorServerResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PACKAGE = require('../package.json');

/**
 * SDK for mercury api
 *
 * @namespace GitHubSDK
 * @class
 * @param {string} token - github app token
 * @see https://developer.github.com/v3/
 */

var GitHubSDK = function () {
  /**
   * Constructor, save mercury api key
   * @param {string} token - github app token
   */
  function GitHubSDK(token) {
    _classCallCheck(this, GitHubSDK);

    if (token === undefined) throw new Error(GitHubSDK.message.key);

    this.urls = {
      api: 'https://api.github.com/',
      search_users: 'search/users',
      users: 'users/'
    };

    this.headers = {
      Authorization: 'token ' + token,
      Accept: 'application/vnd.github.v3+json',
      userAgent: 'UserCrowler/' + PACKAGE.version,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Messages of mercury SDK
   * @namespace GitHubSDK
   * @type {Object}
   */


  _createClass(GitHubSDK, [{
    key: 'create',


    /**
     * Create repository in the organization
     * @namespace GitHubSDK
     *
     * @param  {string}  name                  Repository name
     * @param  {string}  [description=null]     Repository description
     * @param  {string}  [homepage=null]       Link to some related resourse
     * @param  {string}  [org=this.config.org] Organization name
     * @return {Promise<Repository>}           Repository object
     */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var name = _ref2.name,
            org = _ref2.org,
            _ref2$description = _ref2.description,
            description = _ref2$description === undefined ? null : _ref2$description,
            _ref2$homepage = _ref2.homepage,
            homepage = _ref2$homepage === undefined ? null : _ref2$homepage;
        var options, url, response, json;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(typeof name !== 'string' || name.trim().length === 0)) {
                  _context.next = 2;
                  break;
                }

                throw new Error(GitHubSDK.message.name);

              case 2:
                if (!(typeof org !== 'string' || org.trim().length === 0)) {
                  _context.next = 4;
                  break;
                }

                throw new Error(GitHubSDK.message.org);

              case 4:
                options = {
                  method: 'POST',
                  headers: this.headers,
                  body: JSON.stringify({
                    name: name,
                    description: description,
                    homepage: homepage
                  })
                };
                url = this.urls.api + 'orgs/' + org + '/repos';
                _context.next = 8;
                return (0, _isomorphicFetch2.default)(url, options);

              case 8:
                response = _context.sent;
                _context.next = 11;
                return response.json();

              case 11:
                json = _context.sent;

                if (response.ok) {
                  _context.next = 14;
                  break;
                }

                throw new _ErrorServerResponse2.default(response.status, response.statusText, json);

              case 14:
                return _context.abrupt('return', json);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create(_x) {
        return _ref.apply(this, arguments);
      }

      return create;
    }()

    /**
     * Repository object
     *
     * @namespace GitHubSDK
     * @typedef {Repository} Repository representation
     * @see https://developer.github.com/v3/repos/#response-2
     */

    /**
     * Search for users
     * @namespace GitHubSDK
     *
     * @param {Array} keywords
     * @return {Promise}
     */

  }, {
    key: 'searchForUsers',
    value: function searchForUsers(keywordsList) {
      var _this = this;

      var keywords = !Array.isArray(keywordsList) && typeof keywordsList === 'string' ? new Array(keywordsList) : keywordsList;
      var promises = keywords.map(function (keyword) {
        return _this.searchForUser(keyword);
      });
      return Promise.all(promises);
    }

    /**
     * Search for users
     * @namespace GitHubSDK
     *
     * @param {Array} keywords
     * @return {Promise}
     */

  }, {
    key: 'searchForUsers',
    value: function searchForUsers(keywordsList) {
      var _this2 = this;

      var keywords = !Array.isArray(keywordsList) && typeof keywordsList === 'string' ? new Array(keywordsList) : keywordsList;
      var promises = keywords.map(function (keyword) {
        return _this2.searchForUser(keyword);
      });
      return Promise.all(promises);
    }

    /**
     * Search for user
     * @namespace GitHubSDK
     *
     * @param {String} keyword
     * @return {Promise}
     */

  }, {
    key: 'searchForUser',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(keyword) {
        var options, response, user;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = {
                  method: 'GET',
                  headers: this.headers
                };
                _context2.next = 3;
                return (0, _isomorphicFetch2.default)(this.urls.api + this.urls.search_users + '?q=' + encodeURIComponent(keyword), options);

              case 3:
                response = _context2.sent;

                if (!response.ok) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 7;
                return response.json();

              case 7:
                user = _context2.sent;
                return _context2.abrupt('return', user.items);

              case 9:
                throw new Error(response.status + ' ' + response.statusText);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function searchForUser(_x2) {
        return _ref3.apply(this, arguments);
      }

      return searchForUser;
    }()

    /**
     * Get user information
     * @namespace GitHubSDK
     *
     * @param {String} login
     * @return {Promise}
     */

  }, {
    key: 'getUser',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(userLogin) {
        var options, url, response, json, login, blog, name, email, avatar_url, gravatar_id, company;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = {
                  method: 'GET',
                  headers: this.headers
                };
                url = '' + this.urls.api + this.urls.users + encodeURIComponent(userLogin);
                _context3.next = 4;
                return (0, _isomorphicFetch2.default)(url, options);

              case 4:
                response = _context3.sent;

                if (response.ok) {
                  _context3.next = 7;
                  break;
                }

                throw new Error(response.status + ' ' + response.statusText);

              case 7:
                _context3.next = 9;
                return response.json();

              case 9:
                json = _context3.sent;
                login = json.login, blog = json.blog, name = json.name, email = json.email, avatar_url = json.avatar_url, gravatar_id = json.gravatar_id, company = json.company;
                return _context3.abrupt('return', { login: login, blog: blog, name: name, email: email, avatar_url: avatar_url, gravatar_id: gravatar_id, company: company });

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getUser(_x3) {
        return _ref4.apply(this, arguments);
      }

      return getUser;
    }()
  }]);

  return GitHubSDK;
}();

GitHubSDK.message = {
  key: 'You need to pass your app token',
  fail: 'Failed fetching page',
  org: 'Organization name missing in the arguments list',
  name: 'Repository name missing in the arguments list'
};
exports.default = GitHubSDK;
//# sourceMappingURL=GitHubSDK.js.map
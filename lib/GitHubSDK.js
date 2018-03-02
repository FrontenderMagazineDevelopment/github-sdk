'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _ErrorServerResponse = require('./ErrorServerResponse');

var _ErrorServerResponse2 = _interopRequireDefault(_ErrorServerResponse);

var _keywordsSchema = require('./schema/keywordsSchema');

var _keywordsSchema2 = _interopRequireDefault(_keywordsSchema);

var _constructorSchema = require('./schema/constructorSchema');

var _constructorSchema2 = _interopRequireDefault(_constructorSchema);

var _upload = require('./schema/upload');

var _upload2 = _interopRequireDefault(_upload);

var _create = require('./schema/create');

var _create2 = _interopRequireDefault(_create);

var _users = require('./schema/users');

var _users2 = _interopRequireDefault(_users);

var _user = require('./schema/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PACKAGE = require('../package.json');

/**
 * SDK for GitHub API
 *
 * @namespace GitHubSDK
 * @class
 * @param {string} token - github app token
 * @see https://developer.github.com/v3/
 */

var GitHubSDK = function () {
  /**
   * Constructor, also save GitHub api token
   * @param {string} token - github app token
   */
  function GitHubSDK(token) {
    _classCallCheck(this, GitHubSDK);

    _joi2.default.validate(token, _constructorSchema2.default, function (error) {
      if (error !== null) throw error;
    });

    this.urls = {
      api: 'https://api.github.com/'
    };

    this.headers = {
      Authorization: 'token ' + token,
      Accept: 'application/vnd.github.v3+json',
      userAgent: 'UserCrowler/' + PACKAGE.version,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Uload file to repository
   * @namespace GitHubSDK
   * @method upload
   *
   * @throws {ValidationError}                    - Error of fields validation
   * @throws {ErrorServerResponse}                - Server error
   * @param  {Object}  props                      - upload props
   * @param  {string}  props.owner                - organization or user name
   * @param  {string}  props.repo                 - repository name
   * @param  {string}  props.path                 - relative file path with file name in it
   * @param  {string}  props.message              - commit message
   * @param  {string}  props.content              - base64 encoded content
   * @param  {string}  [props.branch='master']    - name of the branch
   * @return {Promise<Content>}                   - uploaded content data
   *
   * @example <caption>Upload binary file</caption>
   * import fs from 'fs';
   * import GitHubSDK from '@frontender-magazine/github-sdk';
   * (async()=>{
   *   try {
   *     const github = new GitHubSDK('b8f921864bd9a9fb6585b10e6534baa37c4d45fe');
   *     const image = fs.readFileSync('/path/image.jpg', 'base64');
   *     const content = await github.upload({
   *       owner: 'FrontenderMagazine',
   *       repo: 'article',
   *       path: 'images/image.jpg',
   *       message: 'Uploaded image.jpg',
   *       content: image,
   *     });
   *   } catch (error) {
   *     console.log(error.message);
   *   }
   * })();
   *
   * @example <caption>Upload text file</caption>
   * import { Base64 } from 'js-base64';
   * import GitHubSDK from '@frontender-magazine/github-sdk';
   * (async()=>{
   *   try {
   *     const github = new GitHubSDK('b8f921864bd9a9fb6585b10e6534baa37c4d45fe');
   *     const readme = Base64.btoa('# Title');
   *     const content = await github.upload({
   *       owner: 'FrontenderMagazine',
   *       repo: 'article',
   *       path: 'README.md',
   *       message: 'Uploaded README.md',
   *       content: readme,
   *     });
   *   } catch (error) {
   *     console.log(error.message);
   *   }
   * })();
   */


  _createClass(GitHubSDK, [{
    key: 'upload',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props) {
        var owner, repo, path, message, content, branch, options, url, response, json;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:

                _joi2.default.validate(props, _upload2.default, function (error) {
                  if (error !== null) throw error;
                });

                owner = props.owner, repo = props.repo, path = props.path, message = props.message, content = props.content, branch = props.branch;
                options = {
                  method: 'PUT',
                  headers: this.headers,
                  body: JSON.stringify({
                    path: path,
                    message: message,
                    content: content,
                    branch: branch
                  })
                };
                url = this.urls.api + 'repos/' + owner + '/' + repo + '/contents/' + path;
                _context.next = 6;
                return (0, _isomorphicFetch2.default)(url, options);

              case 6:
                response = _context.sent;
                json = void 0;
                _context.prev = 8;
                _context.next = 11;
                return response.json();

              case 11:
                json = _context.sent;
                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context['catch'](8);
                throw new _ErrorServerResponse2.default(response.status, response.statusText);

              case 17:
                if (!response.ok) {
                  _context.next = 19;
                  break;
                }

                return _context.abrupt('return', json);

              case 19:
                throw new _ErrorServerResponse2.default(response.status, response.statusText, json);

              case 20:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[8, 14]]);
      }));

      function upload(_x) {
        return _ref.apply(this, arguments);
      }

      return upload;
    }()

    /**
     * Create repository in the organization
     * @method create
     *
     * @throws {ValidationError}                        - Error of fields validation
     * @throws {ErrorServerResponse}                    - Server error
     * @param  {Object}  props                          - Options
     * @param  {string}  props.name                     - Repository name
     * @param  {string}  [props.description=null]       - Repository description
     * @param  {string}  [props.homepage=null]          - Link to some related resourse
     * @param  {string}  [props.org]                    - Organization name
     * @return {Promise<Repository>}                    - Repository object
     */

  }, {
    key: 'create',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(props) {
        var name, org, description, homepage, options, url, response, json;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:

                _joi2.default.validate(props, _create2.default, function (error) {
                  if (error !== null) throw error;
                });

                name = props.name, org = props.org, description = props.description, homepage = props.homepage;
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
                _context2.next = 6;
                return (0, _isomorphicFetch2.default)(url, options);

              case 6:
                response = _context2.sent;
                json = void 0;
                _context2.prev = 8;
                _context2.next = 11;
                return response.json();

              case 11:
                json = _context2.sent;
                _context2.next = 17;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2['catch'](8);
                throw new _ErrorServerResponse2.default(response.status, response.statusText);

              case 17:
                if (!response.ok) {
                  _context2.next = 19;
                  break;
                }

                return _context2.abrupt('return', json);

              case 19:
                throw new _ErrorServerResponse2.default(response.status, response.statusText, json);

              case 20:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[8, 14]]);
      }));

      function create(_x2) {
        return _ref2.apply(this, arguments);
      }

      return create;
    }()

    /**
     * Search for users
     * @method searchForUsers
     *
     * @throws {ValidationError}     - Error of fields validation
     * @throws {ErrorServerResponse} - Server error
     * @param {Array<string>} keywordsList - Keywords array
     * @return {Promise<Users>} - array of users
     */

  }, {
    key: 'searchForUsers',
    value: function searchForUsers(keywordsList) {
      var _this = this;

      _joi2.default.validate(keywordsList, _keywordsSchema2.default, function (error) {
        if (error !== null) throw error;
      });

      var keywords = !Array.isArray(keywordsList) && typeof keywordsList === 'string' ? new Array(keywordsList) : keywordsList;
      var promises = keywords.map(function (keyword) {
        return _this.searchForUser(keyword);
      });
      return Promise.all(promises);
    }

    /**
     * Search for user
     * @method searchForUser
     *
     * @throws {ValidationError}     - Error of fields validation
     * @throws {ErrorServerResponse} - Server error
     * @param {String} keyword - login to search
     * @return {Promise<User>} - user
     */

  }, {
    key: 'searchForUser',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(keyword) {
        var options, url, response, json;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:

                _joi2.default.validate(keyword, _users2.default, function (error) {
                  if (error !== null) throw error;
                });

                options = {
                  method: 'GET',
                  headers: this.headers
                };
                url = this.urls.api + 'search/users?q=' + encodeURIComponent(keyword);
                _context3.next = 5;
                return (0, _isomorphicFetch2.default)(url, options);

              case 5:
                response = _context3.sent;
                json = void 0;
                _context3.prev = 7;
                _context3.next = 10;
                return response.json();

              case 10:
                json = _context3.sent;
                _context3.next = 16;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3['catch'](7);
                throw new _ErrorServerResponse2.default(response.status, response.statusText);

              case 16:
                if (!response.ok) {
                  _context3.next = 18;
                  break;
                }

                return _context3.abrupt('return', json);

              case 18:
                throw new _ErrorServerResponse2.default(response.status, response.statusText, json);

              case 19:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[7, 13]]);
      }));

      function searchForUser(_x3) {
        return _ref3.apply(this, arguments);
      }

      return searchForUser;
    }()

    /**
     * Get user details
     * @method getUser
     *
     * @throws {ValidationError}     - Error of fields validation
     * @throws {ErrorServerResponse} - Server error
     * @param {String}               - login
     * @return {Promise<User>}       — user representation
     */

  }, {
    key: 'getUser',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(login) {
        var options, url, response, json;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:

                _joi2.default.validate(login, _user2.default, function (error) {
                  if (error !== null) throw error;
                });

                options = {
                  method: 'GET',
                  headers: this.headers
                };
                url = this.urls.api + 'users/' + encodeURIComponent(login);
                _context4.next = 5;
                return (0, _isomorphicFetch2.default)(url, options);

              case 5:
                response = _context4.sent;
                json = void 0;
                _context4.prev = 7;
                _context4.next = 10;
                return response.json();

              case 10:
                json = _context4.sent;
                _context4.next = 16;
                break;

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4['catch'](7);
                throw new _ErrorServerResponse2.default(response.status, response.statusText);

              case 16:
                if (!response.ok) {
                  _context4.next = 18;
                  break;
                }

                return _context4.abrupt('return', json);

              case 18:
                throw new _ErrorServerResponse2.default(response.status, response.statusText, json);

              case 19:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[7, 13]]);
      }));

      function getUser(_x4) {
        return _ref4.apply(this, arguments);
      }

      return getUser;
    }()

    /**
     * User object
     *
     * @namespace GitHubSDK
     * @typedef {User} User representation
     * @see https://developer.github.com/v3/users/#response
     */

    /**
     * Content object
     *
     * @namespace GitHubSDK
     * @typedef {Content} Content representation
     * @see https://developer.github.com/v3/repos/contents/#response-2
     */

    /**
     * Repository object
     *
     * @namespace GitHubSDK
     * @typedef {Repository} Repository representation
     * @see https://developer.github.com/v3/repos/#response-2
     */

  }]);

  return GitHubSDK;
}();

exports.default = GitHubSDK;
//# sourceMappingURL=GitHubSDK.js.map
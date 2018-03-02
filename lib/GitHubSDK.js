'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

require('babel-polyfill');

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _jsBase = require('js-base64');

var _ErrorServerResponse = require('./ErrorServerResponse');

var _ErrorServerResponse2 = _interopRequireDefault(_ErrorServerResponse);

var _ValidationError = require('./ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _upload = require('./schema/upload.js');

var _upload2 = _interopRequireDefault(_upload);

var _create = require('./schema/create.js');

var _create2 = _interopRequireDefault(_create);

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

    if (token === undefined) throw new Error(GitHubSDK.message.token);

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
   * Messages of GitHub SDK
   * @inner
   * @type {Object}
   */


  _createClass(GitHubSDK, [{
    key: 'upload',


    /**
     * Uload file to repository
     * @namespace GitHubSDK
     * @method upload
     * @inner
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
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(props) {
        var owner, repo, path, message, content, branch, options, url, response, json;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                owner = props.owner, repo = props.repo, path = props.path, message = props.message, content = props.content, branch = props.branch;


                _joi2.default.validate({
                  owner: owner,
                  repo: repo,
                  path: path,
                  message: message,
                  content: content,
                  branch: branch
                }, _upload2.default, function (error, value) {
                  if (error !== null) throw error;
                });

                options = {
                  method: 'PUT',
                  headers: _extends({}, this.headers, {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }),
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
                _context.next = 9;
                return response.json();

              case 9:
                json = _context.sent;

                if (!response.ok) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt('return', json);

              case 12:
                throw new _ErrorServerResponse2.default(response.status, response.statusText, json);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function upload(_x) {
        return _ref.apply(this, arguments);
      }

      return upload;
    }()

    /**
     * Create repository in the organization
     * @namespace GitHubSDK
     * @method create
     * @inner
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
                name = props.name, org = props.org, description = props.description, homepage = props.homepage;


                _joi2.default.validate({
                  name: name,
                  org: org,
                  description: description,
                  homepage: homepage
                }, _create2.default, function (error, value) {
                  if (error !== null) throw error;
                });

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
                _context2.next = 9;
                return response.json();

              case 9:
                json = _context2.sent;

                if (!response.ok) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt('return', json);

              case 12:
                throw new _ErrorServerResponse2.default(response.status, response.statusText, json);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function create(_x2) {
        return _ref2.apply(this, arguments);
      }

      return create;
    }()

    /**
     * Search for users
     * @namespace GitHubSDK
     * @method searchForUsers
     * @inner
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
     * Search for user
     * @namespace GitHubSDK
     * @method searchForUser
     * @inner
     *
     * @param {String} keyword
     * @return {Promise}
     */

  }, {
    key: 'searchForUser',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(keyword) {
        var options, response, user;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = {
                  method: 'GET',
                  headers: this.headers
                };
                _context3.next = 3;
                return (0, _isomorphicFetch2.default)(this.urls.api + this.urls.search_users + '?q=' + encodeURIComponent(keyword), options);

              case 3:
                response = _context3.sent;

                if (!response.ok) {
                  _context3.next = 9;
                  break;
                }

                _context3.next = 7;
                return response.json();

              case 7:
                user = _context3.sent;
                return _context3.abrupt('return', user.items);

              case 9:
                throw new Error(response.status + ' ' + response.statusText);

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function searchForUser(_x3) {
        return _ref3.apply(this, arguments);
      }

      return searchForUser;
    }()

    /**
     * Get user information
     * @namespace GitHubSDK
     * @method getUser
     * @inner
     *
     * @param {String} login
     * @return {Promise}
     */

  }, {
    key: 'getUser',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(userLogin) {
        var options, url, response, json, login, blog, name, email, avatar_url, gravatar_id, company;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = {
                  method: 'GET',
                  headers: this.headers
                };
                url = '' + this.urls.api + this.urls.users + encodeURIComponent(userLogin);
                _context4.next = 4;
                return (0, _isomorphicFetch2.default)(url, options);

              case 4:
                response = _context4.sent;

                if (response.ok) {
                  _context4.next = 7;
                  break;
                }

                throw new Error(response.status + ' ' + response.statusText);

              case 7:
                _context4.next = 9;
                return response.json();

              case 9:
                json = _context4.sent;
                login = json.login, blog = json.blog, name = json.name, email = json.email, avatar_url = json.avatar_url, gravatar_id = json.gravatar_id, company = json.company;
                return _context4.abrupt('return', { login: login, blog: blog, name: name, email: email, avatar_url: avatar_url, gravatar_id: gravatar_id, company: company });

              case 12:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getUser(_x4) {
        return _ref4.apply(this, arguments);
      }

      return getUser;
    }()

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

GitHubSDK.message = {
  token: 'You need to pass your app token',
  fail: 'Failed fetching page'
};
exports.default = GitHubSDK;
//# sourceMappingURL=GitHubSDK.js.map
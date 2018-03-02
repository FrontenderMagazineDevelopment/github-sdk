import fs from 'fs';
import 'babel-polyfill';
import Joi from 'joi';
import fetch from 'isomorphic-fetch';
import { Base64 } from 'js-base64';
import ErrorServerResponse from './ErrorServerResponse';
import ValidationError from './ValidationError';

import uploadSchema from './schema/upload.js';
import createSchema from './schema/create.js';

const PACKAGE = require('../package.json');

/**
 * SDK for GitHub API
 *
 * @namespace GitHubSDK
 * @class
 * @param {string} token - github app token
 * @see https://developer.github.com/v3/
 */
export default class GitHubSDK {
  /**
   * Constructor, also save GitHub api token
   * @param {string} token - github app token
   */
  constructor(token) {

    if (token === undefined) throw new Error(GitHubSDK.message.token);

    this.urls = {
      api: 'https://api.github.com/',
      search_users: 'search/users',
      users: 'users/',
    };

    this.headers = {
      Authorization: `token ${ token }`,
      Accept: 'application/vnd.github.v3+json',
      userAgent: `UserCrowler/${ PACKAGE.version }`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Messages of GitHub SDK
   * @inner
   * @type {Object}
   */
  static message = {
    token: 'You need to pass your app token',
    fail: 'Failed fetching page',
  };

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
  async upload(props) {

    const {
      owner,
      repo,
      path,
      message,
      content,
      branch,
    } = props;

    Joi.validate({
      owner,
      repo,
      path,
      message,
      content,
      branch,
    }, uploadSchema, (error, value) => {
      if (error !== null) throw error;
    });

    const options = {
      method: 'PUT',
      headers: {
        ...this.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        path,
        message,
        content,
        branch,
      }),
    };

    const url = `${this.urls.api}repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) return json;
    throw new ErrorServerResponse(response.status, response.statusText, json);
  }

  /**
   * Create repository in the organization
   * @namespace GitHubSDK
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
  async create(props) {

    const {
      name,
      org,
      description,
      homepage,
    } = props;

    Joi.validate({
      name,
      org,
      description,
      homepage,
    }, createSchema, (error, value) => {
      if (error !== null) throw error;
    });

    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name,
        description,
        homepage,
      }),
    };

    const url = `${this.urls.api}orgs/${org}/repos`;
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) return json;
    throw new ErrorServerResponse(response.status, response.statusText, json);
  }

  /**
   * Search for users
   * @namespace GitHubSDK
   * @method searchForUsers
   *
   * @param {Array} keywords
   * @return {Promise}
   */
  searchForUsers(keywordsList) {
    const keywords = (!Array.isArray(keywordsList) && typeof keywordsList === 'string') ? new Array(keywordsList) : keywordsList;
    const promises = keywords.map((keyword)=>this.searchForUser(keyword));
    return Promise.all(promises);
  }

  /**
   * Search for user
   * @namespace GitHubSDK
   * @method searchForUser
   *
   * @param {String} keyword
   * @return {Promise}
   */
  async searchForUser(keyword) {
    const options = {
      method: 'GET',
      headers: this.headers,
    };
    const response = await fetch(`${this.urls.api + this.urls.search_users  }?q=${encodeURIComponent(keyword)}`, options);
    if (response.ok) {
      const user = await response.json();
      return user.items;
    }
    throw new Error(`${response.status} ${response.statusText}`);
  }

  /**
   * Get user information
   * @namespace GitHubSDK
   * @method getUser
   *
   * @param {String} login
   * @return {Promise}
   */
  async getUser(userLogin) {
    const options = {
      method: 'GET',
      headers: this.headers,
    };
    const url = `${this.urls.api}${this.urls.users}${encodeURIComponent(userLogin)}`;
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const json = await response.json();
    const { login, blog, name, email, avatar_url, gravatar_id, company } = json;
    return { login, blog, name, email, avatar_url, gravatar_id, company };
  }

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
}

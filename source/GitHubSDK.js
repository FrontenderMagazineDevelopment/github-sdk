import 'babel-polyfill';
import Joi from 'joi';
import fetch from 'isomorphic-fetch';
import ErrorServerResponse from './ErrorServerResponse';

import keywordsSchema from './schema/keywordsSchema';
import constructorSchema from './schema/constructorSchema';
import uploadSchema from './schema/upload';
import createSchema from './schema/create';
import usersSchema from './schema/users';
import userSchema from './schema/user';

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

    Joi.validate(
      token,
      constructorSchema,
      error => {
        if (error !== null) throw error;
      },
    );

    this.urls = {
      api: 'https://api.github.com/',
    };

    this.headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      userAgent: `UserCrowler/${PACKAGE.version}`,
      'Content-Type': 'application/json',
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
  async upload(props) {

    Joi.validate(
      props,
      uploadSchema,
      error => {
        if (error !== null) throw error;
      },
    );

    const { owner, repo, path, message, content, branch } = props;

    const options = {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        path,
        message,
        content,
        branch,
      }),
    };

    const url = `${this.urls.api}repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, options);
    let json;
    try {
      json = await response.json();
    } catch (error) {
      throw new ErrorServerResponse(response.status, response.statusText);
    }
    if (response.ok) return json;
    throw new ErrorServerResponse(response.status, response.statusText, json);
  }

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
   *
   * @example <caption>Create repository</caption>
   * import GitHubSDK from '@frontender-magazine/github-sdk';
   * (async()=>{
   *   try {
   *     const github = new GitHubSDK('b8f921864bd9a9fb6585b10e6534baa37c4d45fe');
   *     const results = await github.create({
   *       name: 'owning-the-role-of-the-front-end-developer',
   *       description: 'Owning the Role of the Front-End Developer',
   *       homepage: 'http://alistapart.com/article/owning-the-role-of-the-front-end-developer',
   *       org: 'FrontenderMagazine',
   *     });
   *   } catch (error) {
   *     console.log(error.message);
   *   }
   * })();
   */
  async create(props) {

    Joi.validate(
      props,
      createSchema,
      error => {
        if (error !== null) throw error;
      },
    );

    const { name, org, description, homepage } = props;

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
    let json;
    try {
      json = await response.json();
    } catch (error) {
      throw new ErrorServerResponse(response.status, response.statusText);
    }
    if (response.ok) return json;
    throw new ErrorServerResponse(response.status, response.statusText, json);
  }

  /**
   * Search for users
   * @method searchForUsers
   *
   * @throws {ValidationError}     - Error of fields validation
   * @throws {ErrorServerResponse} - Server error
   * @param {Array<string>} keywordsList - Keywords array
   * @return {Promise<Users>} - array of users
   *
   * @example <caption>Search for users</caption>
   * import GitHubSDK from '@frontender-magazine/github-sdk';
   * (async()=>{
   *   try {
   *     const github = new GitHubSDK('b8f921864bd9a9fb6585b10e6534baa37c4d45fe');
   *     const results = await github.searchForUsers(['octocat', 'silentimp']);
   *   } catch (error) {
   *     console.log(error.message);
   *   }
   * })();
   */
  searchForUsers(keywordsList) {

    Joi.validate(
      keywordsList,
      keywordsSchema,
      error => {
        if (error !== null) throw error;
      },
    );

    const keywords =
      !Array.isArray(keywordsList) && typeof keywordsList === 'string'
        ? new Array(keywordsList)
        : keywordsList;
    const promises = keywords.map(keyword => this.searchForUser(keyword));
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
   *
   * @example <caption>Search for user</caption>
   * import GitHubSDK from '@frontender-magazine/github-sdk';
   * (async()=>{
   *   try {
   *     const github = new GitHubSDK('b8f921864bd9a9fb6585b10e6534baa37c4d45fe');
   *     const details = await github.searchForUser('octocat');
   *   } catch (error) {
   *     console.log(error.message);
   *   }
   * })();
   */
  async searchForUser(keyword) {

    Joi.validate(
      keyword,
      usersSchema,
      error => {
        if (error !== null) throw error;
      },
    );

    const options = {
      method: 'GET',
      headers: this.headers,
    };

    const url = `${this.urls.api}search/users?q=${encodeURIComponent(keyword)}`;
    const response = await fetch(url, options);
    let json;
    try {
      json = await response.json();
    } catch (error) {
      throw new ErrorServerResponse(response.status, response.statusText);
    }
    if (response.ok) return json;
    throw new ErrorServerResponse(response.status, response.statusText, json);
  }

  /**
   * Get user details
   * @method getUser
   *
   * @throws {ValidationError}     - Error of fields validation
   * @throws {ErrorServerResponse} - Server error
   * @param {String} login         - login
   * @return {Promise<User>}       — user representation
   *
   * @example <caption>Get user details</caption>
   * import GitHubSDK from '@frontender-magazine/github-sdk';
   * (async()=>{
   *   try {
   *     const github = new GitHubSDK('b8f921864bd9a9fb6585b10e6534baa37c4d45fe');
   *     const details = await github.getUser('octocat');
   *   } catch (error) {
   *     console.log(error.message);
   *   }
   * })();
   */
  async getUser(login) {

    Joi.validate(
      login,
      userSchema,
      error => {
        if (error !== null) throw error;
      },
    );

    const options = {
      method: 'GET',
      headers: this.headers,
    };

    const url = `${this.urls.api}users/${encodeURIComponent(login)}`;
    const response = await fetch(url, options);
    let json;
    try {
      json = await response.json();
    } catch (error) {
      throw new ErrorServerResponse(response.status, response.statusText);
    }
    if (response.ok) return json;
    throw new ErrorServerResponse(response.status, response.statusText, json);
  }

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
}

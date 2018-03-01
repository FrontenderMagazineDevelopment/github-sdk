import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import ErrorServerResponse from './ErrorServerResponse';

const PACKAGE = require('../package.json');

/**
 * SDK for mercury api
 *
 * @namespace GitHubSDK
 * @class
 * @param {string} token - github app token
 * @see https://developer.github.com/v3/
 */
export default class GitHubSDK {
  /**
   * Constructor, save mercury api key
   * @param {string} token - github app token
   */
  constructor(token) {

    if (token === undefined) throw new Error(GitHubSDK.message.key);

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
   * Messages of mercury SDK
   * @namespace GitHubSDK
   * @type {Object}
   */
  static message = {
    key: 'You need to pass your app token',
    fail: 'Failed fetching page',
    org: 'Organization name missing in the arguments list',
    name: 'Repository name missing in the arguments list',
  };

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
  async create({
    name,
    org,
    description = null,
    homepage = null,
  }) {

    if (typeof name !== 'string' || name.trim().length === 0) throw new Error(GitHubSDK.message.name);
    if (typeof org !== 'string' || org.trim().length === 0) throw new Error(GitHubSDK.message.org);

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
    if (!response.ok) {
      throw new ErrorServerResponse(response.status, response.statusText, json);
    }
    return json;
  }

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
  searchForUsers(keywordsList) {
    const keywords = (!Array.isArray(keywordsList) && typeof keywordsList === 'string') ? new Array(keywordsList) : keywordsList;
    const promises = keywords.map((keyword)=>this.searchForUser(keyword));
    return Promise.all(promises);
  }


  /**
   * Search for users
   * @namespace GitHubSDK
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

}

# Github API SDK

JavaScript SDK for [Github API](https://developer.github.com/v3/). Contain only requests I actually need.

# Bages

[![Travis](https://img.shields.io/travis/FrontenderMagazineDevelopment/github-sdk.svg?style=for-the-badge)](https://travis-ci.org/FrontenderMagazineDevelopment/github-sdk) [![Codecov branch](https://img.shields.io/codecov/c/github/FrontenderMagazineDevelopment/github-sdk/master.svg?style=for-the-badge)](https://codecov.io/gh/FrontenderMagazineDevelopment/github-sdk)

# Documentation

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [ErrorServerResponse](#errorserverresponse)
-   [GitHubSDK](#githubsdk)
-   [upload](#upload)
-   [create](#create)
-   [searchForUsers](#searchforusers)
-   [searchForUser](#searchforuser)
-   [getUser](#getuser)
-   [null-null](#null-null)
-   [User](#user)
-   [Content](#content)
-   [Repository](#repository)

## ErrorServerResponse

Custom error message for abstract server response

**Parameters**

-   `statusCode` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** http status code
-   `statusText` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** http status code text
-   `message` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | null)** error details (optional, default `null`)

## GitHubSDK

-   **See: <https://developer.github.com/v3/>**

SDK for GitHub API

**Parameters**

-   `token` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** github app token

## upload

Uload file to repository

**Parameters**

-   `props` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** upload props
    -   `props.owner` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** organization or user name
    -   `props.repo` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** repository name
    -   `props.path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** relative file path with file name in it
    -   `props.message` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** commit message
    -   `props.content` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** base64 encoded content
    -   `props.branch` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** name of the branch (optional, default `'master'`)

**Examples**

_Upload binary file_

```javascript
import fs from 'fs';
import GitHubSDK from '@frontender-magazine/github-sdk';
(async()=>{
  try {
    const github = new GitHubSDK('b8f921864bd9a9fb6585b10e6534baa37c4d45fe');
    const image = fs.readFileSync('/path/image.jpg', 'base64');
    const content = await github.upload({
      owner: 'FrontenderMagazine',
      repo: 'article',
      path: 'images/image.jpg',
      message: 'Uploaded image.jpg',
      content: image,
    });
  } catch (error) {
    console.log(error.message);
  }
})();
```

_Upload text file_

```javascript
import { Base64 } from 'js-base64';
import GitHubSDK from '@frontender-magazine/github-sdk';
(async()=>{
  try {
    const github = new GitHubSDK('b8f921864bd9a9fb6585b10e6534baa37c4d45fe');
    const readme = Base64.btoa('# Title');
    const content = await github.upload({
      owner: 'FrontenderMagazine',
      repo: 'article',
      path: 'README.md',
      message: 'Uploaded README.md',
      content: readme,
    });
  } catch (error) {
    console.log(error.message);
  }
})();
```

-   Throws **ValidationError** Error of fields validation
-   Throws **[ErrorServerResponse](#errorserverresponse)** Server error

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Content](#content)>** uploaded content data

## create

Create repository in the organization

**Parameters**

-   `props` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options
    -   `props.name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Repository name
    -   `props.description` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Repository description (optional, default `null`)
    -   `props.homepage` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Link to some related resourse (optional, default `null`)
    -   `props.org` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Organization name


-   Throws **ValidationError** Error of fields validation
-   Throws **[ErrorServerResponse](#errorserverresponse)** Server error

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Repository](#repository)>** Repository object

## searchForUsers

Search for users

**Parameters**

-   `null-null` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** Keywords


-   Throws **ValidationError** Error of fields validation
-   Throws **[ErrorServerResponse](#errorserverresponse)** Server error

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;Users>** 

## searchForUser

Search for user

**Parameters**

-   `keyword` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 


-   Throws **ValidationError** Error of fields validation
-   Throws **[ErrorServerResponse](#errorserverresponse)** Server error

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

## getUser

Get user details

**Parameters**

-   `null-null` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** login


-   Throws **ValidationError** Error of fields validation
-   Throws **[ErrorServerResponse](#errorserverresponse)** Server error

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[User](#user)>** — user representation

## null-null

Users object

Type: Users

**Parameters**

-   `null-null` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[User](#user)>** Users list

## User

-   **See: <https://developer.github.com/v3/users/#response>**

User object

Type: [User](#user)

## Content

-   **See: <https://developer.github.com/v3/repos/contents/#response-2>**

Content object

Type: [Content](#content)

## Repository

-   **See: <https://developer.github.com/v3/repos/#response-2>**

Repository object

Type: [Repository](#repository)

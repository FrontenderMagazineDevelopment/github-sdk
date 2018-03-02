import 'isomorphic-fetch';
import nock from 'nock';
import { Base64 } from 'js-base64';
import GitHubSDK from '../GitHubSDK';
import response from '../__mocks__/response.json';
import responseFull from '../__mocks__/response_full.json';
import errorJSON from '../__mocks__/422_Unprocessable_Entity.json';
import upload201 from '../__mocks__/upload_201';
import upload422 from '../__mocks__/upload_422';
import user200 from '../__mocks__/user_200';
import user404 from '../__mocks__/user_404';
import searchUser200 from '../__mocks__/search_user_200';
import searchUser2200 from '../__mocks__/search_user_2_200';

const name = 'owning-the-role-of-the-front-end-developer';
const org = 'FrontenderMagazine';
const token = 'NeBIXVwRCXVIS3lJC74dsRAMBOaIK6H5EEkFudvs';
const description = 'Owning the Role of the Front-End Developer';
const homepage = 'http://alistapart.com/article/owning-the-role-of-the-front-end-developer';

describe('GitHubSDK Parser', () => {
  it('Should throw error if you do not pass key', () => {
    try {
      new GitHubSDK(); // eslint-disable-line
    } catch (error) {
      expect(error.name).toEqual('ValidationError');
    }
  });

  it('Should create repository', async () => {
    nock(/[.]+/)
      .post(`/orgs/${org}/repos`)
      .reply(201, response);
    const github = new GitHubSDK(token);
    const repository = await github.create({
      name,
      org,
    });
    expect(repository).toEqual(response);
  });

  it('Should create repository with description and homepage', async () => {
    nock(/[.]+/)
      .post(`/orgs/${org}/repos`)
      .reply(201, responseFull);
    const github = new GitHubSDK(token);
    const repository = await github.create({
      name,
      org,
      description,
      homepage,
    });
    expect(repository).toEqual(responseFull);
    expect(repository.homepage).toEqual(homepage);
    expect(repository.description).toEqual(description);
  });

  it('Should throw an error if repository with this name already exist', async () => {
    nock(/[.]+/)
      .post(`/orgs/${org}/repos`)
      .reply(422, errorJSON);
    const github = new GitHubSDK(token);
    try {
      await github.create({ name, org });
    } catch (error) {
      expect(error.message).toEqual(errorJSON);
    }
  });

  it('Should throw error if server failed', async () => {
    nock(/[.]+/)
      .post(`/orgs/${org}/repos`)
      .reply(500);
    try {
      const github = new GitHubSDK(token);
      await github.create({ name, org });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
    }
  });

  it('Should add README.md file to repository', async () => {
    nock(/[.]+/)
      .put(`/repos/FrontenderMagazine/article/contents/README.md`)
      .reply(201, upload201);

    const github = new GitHubSDK(token);
    const content = await github.upload({
      owner: 'FrontenderMagazine',
      repo: 'article',
      path: 'README.md',
      message: 'Uploaded README.md',
      content: Base64.btoa('# Title'),
    });
    expect(content).toEqual(upload201);
  });

  it('Should throw error if arguments missed', async () => {
    try {
      const github = new GitHubSDK(token);
      await github.upload();
    } catch (error) {
      expect(error.name).toEqual('ValidationError');
    }
  });

  it('Should throw error if not all arguments are set', async () => {
    try {
      const github = new GitHubSDK(token);
      await github.upload({
        owner: 'FrontenderMagazine',
        message: 'Uploaded README.md',
        content: Base64.btoa('# Title'),
      });
    } catch (error) {
      expect(error.name).toEqual('ValidationError');
    }
  });

  it('Should throw error if you try to upload file with path that already exists', async () => {
    nock(/[.]+/)
      .put(`/repos/FrontenderMagazine/article/contents/README.md`)
      .reply(422, upload422);
    try {
      const github = new GitHubSDK(token);
      await github.upload({
        owner: 'FrontenderMagazine',
        repo: 'article',
        path: 'README.md',
        message: 'Uploaded README.md',
        content: Base64.btoa('# Title'),
      });
    } catch (error) {
      expect(error.statusCode).toEqual(422);
      expect(error.message).toEqual(upload422);
    }
  });

  it('Should throw error if server failed', async () => {
    nock(/[.]+/)
      .put(`/repos/FrontenderMagazine/article/contents/README.md`)
      .reply(500);
    try {
      const github = new GitHubSDK(token);
      await github.upload({
        owner: 'FrontenderMagazine',
        repo: 'article',
        path: 'README.md',
        message: 'Uploaded README.md',
        content: Base64.btoa('# Title'),
      });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
    }
  });

  it('Should return user details', async () => {
    const login = 'octocat';
    nock(/[.]+/)
      .get(`/users/${login}`)
      .reply(200, user200);
    const github = new GitHubSDK(token);
    const user = await github.getUser(login);
    expect(user).toEqual(user200);
  });

  it('Should throw error if user not found', async () => {
    const login = 'notanoctocat';
    nock(/[.]+/)
      .get(`/users/${login}`)
      .reply(404, user404);
    try {
      const github = new GitHubSDK(token);
      await github.getUser(login);
    } catch (error) {
      expect(error.message).toEqual(user404);
    }
  });

  it('Should throw error if server failed', async () => {
    const login = 'notanoctocat';
    nock(/[.]+/)
      .get(`/users/${login}`)
      .reply(500);
    try {
      const github = new GitHubSDK(token);
      await github.getUser(login);
    } catch (error) {
      expect(error.statusCode).toEqual(500);
    }
  });

  it('Should throw error if user login missing', async () => {
    try {
      const github = new GitHubSDK(token);
      await github.getUser();
    } catch (error) {
      expect(error.name).toEqual('ValidationError');
    }
  });

  it('Should search for users', async () => {
    const keyword = 'silentimp';
    nock(/[.]+/)
      .get(`/search/users`)
      .query({
        q: keyword,
      })
      .reply(200, searchUser200);
    const github = new GitHubSDK(token);
    const users = await github.searchForUser(keyword);
    expect(users).toEqual(searchUser200);
  });

  it('Should throw error if server fail', async () => {
    const keyword = 'silentimp';
    nock(/[.]+/)
      .get(`/search/users`)
      .query({
        q: keyword,
      })
      .reply(500);
    try {
      const github = new GitHubSDK(token);
      await github.searchForUser(keyword);
    } catch (error) {
      expect(error.statusCode).toEqual(500);
    }
  });

  it('Should throw error if keyword missing', async () => {
    try {
      const github = new GitHubSDK(token);
      const users = await github.getUser();
    } catch (error) {
      expect(error.name).toEqual('ValidationError');
    }
  });

  it('Should search for multiple users', async () => {
    nock(/[.]+/)
      .get(`/search/users`)
      .query({
        q: 'silentimp',
      })
      .reply(200, searchUser200);
      nock(/[.]+/)
        .get(`/search/users`)
        .query({
          q: 'octocat',
        })
        .reply(200, searchUser2200);
    const github = new GitHubSDK(token);
    const users = await github.searchForUsers(['silentimp', 'octocat']);
    expect(users).toEqual([searchUser200, searchUser2200]);
  });
});

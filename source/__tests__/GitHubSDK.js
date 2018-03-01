import 'isomorphic-fetch';
import nock from 'nock';
import GitHubSDK from '../GitHubSDK';
import response from '../__mocks__/response.json';
import responseFull from '../__mocks__/response_full.json';
import errorJSON from '../__mocks__/422_Unprocessable_Entity.json';

const name = 'owning-the-role-of-the-front-end-developer';
const org = 'FrontenderMagazine'
const token = 'NeBIXVwRCXVIS3lJC74dsRAMBOaIK6H5EEkFudvs';
const description = 'Owning the Role of the Front-End Developer';
const homepage = 'http://alistapart.com/article/owning-the-role-of-the-front-end-developer';

describe('GitHubSDK Parser', () => {
  it('Should throw error if you do not pass key', () => {
    expect(() => {
      new GitHubSDK(); // eslint-disable-line
    }).toThrow();
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

});

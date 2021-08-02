const request = require('../lib/request');
jest.setTimeout(10000);
describe('request tests', () => {
  it('getAsync should works', async () => {
    const result = await request.getAsync({
      url: 'https://jsonplaceholder.typicode.com/posts',
    });

    expect(result.length).toBeGreaterThan(10);
  });

  it('postAsync should works', async () => {
    const result = await request.postAsync({
      url: 'https://jsonplaceholder.typicode.com/posts',
      data: {
        title: 'foo',
        body: 'bar',
        userId: 1,
      },
    });

    expect(result).toEqual({ id: 101 });
  });

  it('patchsSync should works', async () => {
    const result = await request.patchAsync({
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      data: {
        title: 'foo',
      },
    });

    expect(Object.keys(result)).toEqual(['userId', 'id', 'title', 'body']);
  });

  it('should raise error if response code is not 200', async () => {
    try {
      await request.postAsync({
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        data: {
          title: 'foo',
        },
      });

      expect(true).toEqual(false);
    } catch (err) {
      expect(err).not.toEqual(null);
    }
  });
});

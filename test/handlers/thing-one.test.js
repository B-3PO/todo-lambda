const mockGet = jest.fn();
jest.mock('../../app/services/thing-one', () => ({
  get: mockGet
}));

const handler = require('../../app/handlers/thing-one');

describe('handler: thing-one', () => {
  test('should', async () => {
    mockGet.mockReturnValueOnce({ id: 1 });
    const data = await handler.get({ pathParameters: { id: 1 } });
    expect(data).toBeDefined();
    expect(data.body.id).toEqual(1);
  });

  test('should convert thrown error to 5000 response', async () => {
    mockGet.mockImplementation(() => { throw Error('could not find thing-one'); });
    const data = await handler.get({ pathParameters: { id: 2 } });
    expect(data.statusCode).toEqual(500);
  });
});

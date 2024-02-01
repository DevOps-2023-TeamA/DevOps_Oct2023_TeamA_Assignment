/**
 * @jest-environment jsdom
 */

// Import the function
const GetAccount = require('../js/createentry');

test('Get non-existent account while API is down', async () => {
    const accountID = await GetAccount("TanKK");
    expect(accountID).toBe(null);
});
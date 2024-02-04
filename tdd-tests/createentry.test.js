/**
 * @jest-environment jsdom
 */

// Import the function
const { GetAccountID, CreateRecord } = require('../js/createentry');


// ===============================
// Testing for GetAccount function
// ===============================

describe('GetAccountID Function', () => {
    // Test case for valid username 
    test('GetAccountID returns account ID using valid username', async () => {
        // Create a mock function that will return preset values that will be added to any fetches 
        global.fetch = jest.fn().mockResolvedValue({
            status: 202,
            text: jest.fn().mockResolvedValue("1")
        });

        // Call the function
        const accountId = await GetAccountID("lkh2");

        // Expect that the returned Account ID is 1 for the user lkh2
        expect(accountId).toBe(1);
    });

    // Test case for invalid username
    test('GetAccountID returns -1 for invalid username', async () => {
        // Create a mock function that will return preset values that will be added to any fetches 
        global.fetch = jest.fn().mockResolvedValue({
            status: 404,
            text: jest.fn().mockResolvedValue("Account has not been approved OR Account has been deleted")
        });

        // Call the function
        const accountId = await GetAccountID("HelloIamNotAUser");

        // Expect that -1 will be returned by the function for the invalid username
        expect(accountId).toBe(-1);
    });

    // Test case for deleted user username
    test('GetAccountID returns -1 for deleted user username', async () => {
        // Create a mock function that will return preset values that will be added to any fetches 
        global.fetch = jest.fn().mockResolvedValue({
            status: 404,
            text: jest.fn().mockResolvedValue("Account has not been approved OR Account has been deleted")
        });

        // Call the function
        const accountId = await GetAccountID("DeletedUser");

        // Expect that -1 will be returned by the function for the invalid username
        expect(accountId).toBe(-1);
    });

    // Test case for connection to server
    test('GetAccountID returns null and displays alert when not able to connect to server', async () => {
        // Create a mock function that will return an error for any fetches 
        global.fetch = jest.fn().mockRejectedValue(new Error("Failed to fetch"));

        // Create a mock function for any alert() calls
        global.alert = jest.fn();

        // Call the function
        const accountId = await GetAccountID("randomUsername");

        // Expect that the Account ID will be null and that the alert() function will be called with the appropriate text
        expect(accountId).toBe(null); // Expect null for server error
        expect(global.alert).toHaveBeenCalledWith("Server Error. Try again.");
    });

    // Test case for internal servor error
    test("GetAccountID returns null and displays alert when receiving internal server error", async () => {
        // Create a mock function that will return an error for any fetches 
        global.fetch = jest.fn().mockRejectedValue(new Error("Internal Server Error"));

        // Create a mock function for any alert() calls
        global.alert = jest.fn();

        // Call the function
        const accountId = await GetAccountID("randomUsername");

        // Expect that the Account ID will be null and that the alert() function will be called with the appropriate text
        expect(accountId).toBe(null); // Expect null for server error
        expect(global.alert).toHaveBeenCalledWith("Server Error. Try again.");
    })
});



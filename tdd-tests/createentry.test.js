/**
 * @jest-environment jsdom
 */

// Import the function
const { GetAccountID, CreateRecord } = require('../js/createentry');

// Define the global path variables
global.AUTH_SERVICE = "http://localhost:8000/api/auth"
global.RECORDS_SERVICE = "http://localhost:8001/api/records"
global.ACCOUNTS_SERVICE = "http://localhost:8002/api/accounts"

// ===============================
//   Unit Testing for Functions
// ===============================

describe("Unit Tests", () => {
    describe('GetAccountID Function', () => {
        describe("Passing Test Cases", () => {
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

        })
        describe("Failing Test Cases", () => {
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
        })
    });


    describe('CreateRecord Function', () => {
        describe("Passing Test Cases", () => {
            test("CreateRecord creates new record and redirects on success", async () => {

                const record = {
                    "AccountID": 1,
                    "ContactRole": "Staff",
                    "StudentCount": 5,
                    "AcadYear": "2023/24",
                    "Title": "Quantum Engineering",
                    "CompanyName": "ABC Fruit Juice",
                    "CompanyPOC": "Ong Ye Kung",
                    "Description": "Create a particle accelerator to make fruit juice",
                    "IsDeleted": false
                }

                // Create a mock function that will return preset values that will be added to any fetches 
                global.fetch = jest.fn().mockResolvedValue({
                    status: 201
                });

                // Create a mock alert function to simulate alert()
                global.alert = jest.fn();

                // Create a mock function to simulate page redirection
                delete window.location;
                window.location = { href: "" }

                // Call the function
                await CreateRecord(record);

                // Expect that the POST has been sent with the data
                expect(global.fetch).toHaveBeenCalledWith(
                    "http://localhost:8001/api/records",
                    expect.objectContaining({
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(record)
                    })
                );

                // Expect that an alert with the correct message was called
                expect(global.alert).toHaveBeenCalledWith("Your Capstone entry has been successfully created.\nClick OK to be redirected back to the main page.");
                // Expect that the window is redirected to the correct page
                expect(window.location.href).toBe("index.html")
            });
        })

        describe("Failing Test Cases", () => {
            test("CreateRecord throws error when response status is not 201", async () => {

                const record = {
                    "AccountID": 1,
                    "ContactRole": "Staff",
                    "StudentCount": 5,
                    "AcadYear": "2023/24",
                    "Title": "Quantum Engineering",
                    "CompanyName": "ABC Fruit Juice",
                    "CompanyPOC": "Ong Ye Kung",
                    "Description": "Create a particle accelerator to make fruit juice",
                    "IsDeleted": false
                };

                // Create a mock function that will return preset values that will be added to any fetches 
                global.fetch = jest.fn().mockResolvedValue({
                    status: 400
                });

                // Create a mock alert function to simulate alert()
                global.alert = jest.fn();

                // Create a mock alert function to simulate alert()
                global.Error = jest.fn();

                // Create a mock function to simulate page redirection
                delete window.location;
                window.location = { href: "" };

                // Call the function
                await CreateRecord(record);

                // Expect that an alert with the correct message was called
                expect(global.alert).toHaveBeenCalledWith("Server Error. Try again.");
                // Expect that the window has not been redirected
                expect(window.location.href).toBe("");

            });

            test("CreateRecord alerts error when responded with internal server error", async () => {

                const record = {
                    "AccountID": 1,
                    "ContactRole": "Staff",
                    "StudentCount": 5,
                    "AcadYear": "2023/24",
                    "Title": "Quantum Engineering",
                    "CompanyName": "ABC Fruit Juice",
                    "CompanyPOC": "Ong Ye Kung",
                    "Description": "Create a particle accelerator to make fruit juice",
                    "IsDeleted": false
                };

                // Create a mock function that will return preset values that will be added to any fetches 
                global.fetch = jest.fn().mockRejectedValue(new Error("Internal server error"));

                // Create a mock alert function to simulate alert()
                global.alert = jest.fn();

                // Create a mock function to simulate page redirection
                delete window.location;
                window.location = { href: "" };

                // Call the function
                await CreateRecord(record);

                // Expect that the POST has been sent with the data
                expect(global.fetch).toHaveBeenCalledWith(
                    "http://localhost:8001/api/records",
                    expect.objectContaining({
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(record)
                    })
                );

                // Expect that an alert with the correct message was called
                expect(global.alert).toHaveBeenCalledWith("Server Error. Try again.");
                // Expect that the window has not been redirected
                expect(window.location.href).toBe("");

            });

            test("CreateRecord alerts error when unable to connect to server", async () => {

                const record = {
                    "AccountID": 1,
                    "ContactRole": "Staff",
                    "StudentCount": 5,
                    "AcadYear": "2023/24",
                    "Title": "Quantum Engineering",
                    "CompanyName": "ABC Fruit Juice",
                    "CompanyPOC": "Ong Ye Kung",
                    "Description": "Create a particle accelerator to make fruit juice",
                    "IsDeleted": false
                };

                // Create a mock function that will return preset values that will be added to any fetches 
                global.fetch = jest.fn().mockRejectedValue(new Error("Failed to fetch"));

                // Create a mock alert function to simulate alert()
                global.alert = jest.fn();

                // Create a mock function to simulate page redirection
                delete window.location;
                window.location = { href: "" };

                // Call the function
                await CreateRecord(record);

                // Expect that the POST has been sent with the data
                expect(global.fetch).toHaveBeenCalledWith(
                    "http://localhost:8001/api/records",
                    expect.objectContaining({
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(record)
                    })
                );

                // Expect that an alert with the correct message was called
                expect(global.alert).toHaveBeenCalledWith("Server Error. Try again.");
                // Expect that the window has not been redirected
                expect(window.location.href).toBe("");

            });
        })
    });
})


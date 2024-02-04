const accountAPIURL = "http://localhost:8002/api/accounts";
const recordAPIURL = "http://localhost:8001/api/records";


var cancelButton = document.getElementById("cancel");

// Handle Cancel/Return button
if (cancelButton) {
    cancelButton.addEventListener("click", function () {
        window.location.href = "queryentrylist.html";
    });
}

// Load data as soon as page renders
document.addEventListener("DOMContentLoaded", async function () {
    await LoadData();
});


// Get role from session to modify form 
const userRole = sessionStorage.getItem("Role");

// Get the entry from session storage
var entryData = JSON.parse(sessionStorage.getItem("SelectedEntry"));

console.log(entryData.ID);

// Check if user is administrator, normal user and owner of the entry, normal user and not owner of the entry
if (userRole === "User") {
    const userID = sessionStorage.getItem("ID");
    if (entryData.AccountID != userID) {
        // Disable all inputs to prevent editing
        var allInputs = document.getElementsByTagName("input");
        for (var i = 0; i < allInputs.length; i++) {
            allInputs[i].setAttribute("readonly", true);
        }
        var textArea = document.getElementsByTagName("textarea");
        textArea[0].setAttribute("readonly", true);
        var radioButtons = document.querySelectorAll('input[type="radio"]');
        for (var i = 0; i < radioButtons.length; i++) {
            radioButtons[i].disabled = true;
        }
        // Remove Modify button
        var modifyButton = document.getElementById("modify");
        var modifyButtonContainer = modifyButton.parentNode;
        modifyButton.remove();
        modifyButtonContainer.remove();
        cancelButton.innerText = "Return";
    }
    else {
        // If user is owner of entry, just autofill and disable username input
        var nameInput = document.getElementById("name");
        nameInput.setAttribute("readonly", true)
        nameInput.value = sessionStorage.getItem("Username");
    }
}


// Load the entry data into the input fields
async function LoadData() {
    // Get account username from ID
    var entryUsername = await GetAccountUsername(entryData.AccountID);

    if (entryUsername != null) {
        var entryForm = document.getElementById("entryForm");
        entryForm.querySelector('input[name="name"]').value = entryUsername;
        entryForm.querySelector('input[name="roleRadio"]').value = entryData.ContactRole;
        entryForm.querySelector('input[name="noOfStudents"]').value = entryData.StudentCount;
        entryForm.querySelector('input[name="year"]').value = entryData.AcadYear;
        entryForm.querySelector('input[name="title"]').value = entryData.Title;
        entryForm.querySelector('input[name="company"]').value = entryData.CompanyName;
        entryForm.querySelector('input[name="companyPoc"]').value = entryData.CompanyPOC;
        entryForm.querySelector('textarea[name="description"]').value = entryData.Description;
    }
    else {
        windows.location.href = "queryentrylist.html";
    }
}



// Function to get AccountID of entered username
async function GetAccountUsername(selectedID) {
    try {
        const response = await fetch(`${accountAPIURL}/${selectedID}`);
        const selectedAccount = await response.json();
        return selectedAccount.Username;
    }
    catch (error) {
        console.log("Error getting account:", error);
        alert("Server Error. Try again.");
        return null;
    }
}


// Function to get AccountID of entered username
async function GetAccountID(selectedUsername) {
    try {
        const response = await fetch(`${accountAPIURL}/retrieve/${selectedUsername}`);
        const accountID = (await response.text()).trim();

        if (accountID.includes("Account has not been approved OR Account has been deleted")) {
            return -1;
        }

        return Number(accountID);
    }
    catch (error) {
        console.log("Error getting account:", error);
        alert("Server Error. Try again.");
        return null;
    }
}


// Function to call api and create new record
async function UpdateRecord(record) {
    try {
        console.log("String: ", JSON.stringify(record))
        const response = await fetch(`${recordAPIURL}/${entryData.ID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(record),
        });

        // Check response status from API
        if (response.status == 202) {
            // Inform user and redirect back to query list page
            alert("Your Capstone entry has been successfully created.\nClick OK to be redirected back to the main page.")

            window.location.href = "queryentrylist.html";
        }
        else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    }
    catch (error) {
        console.log("Error creating record:", error);
        alert("Server Error. Try again.");
    }
}


// Function for form validation and submission
!(function () {
    "use strict";
    // Wait for the window to load before executing function
    window.addEventListener(
        "load",
        function () {
            // Get the form element
            var entryForm = document.getElementById("entryForm");

            if (entryForm) {
                entryForm.addEventListener(
                    "submit",
                    async function (event) {
                        event.preventDefault();

                        // Disable button to prevent multiple submit calls
                        document.getElementById("modify").disabled = true;

                        // Remove whitespace
                        var allInputs = entryForm.getElementsByTagName("input");
                        var descriptionBox = entryForm.getElementsByTagName("textarea")[0];
                        descriptionBox.value = descriptionBox.value.trim();

                        for (var i = 0; i < allInputs.length; i++) {
                            allInputs[i].value = allInputs[i].value.trim();
                        }

                        // Validate form
                        if (!entryForm.checkValidity()) {
                            event.stopPropagation();
                            entryForm.classList.add("was-validated");
                        }
                        else {
                            entryForm.classList.add("was-validated");

                            // Retrieve data from form
                            const formData = new FormData(entryForm);

                            // Get the AccountID of the user
                            var accountID;
                            if (userRole === "User") {
                                accountID = sessionStorage.getItem("ID");
                            }
                            else {
                                accountID = await GetAccountID(formData.get("name"));
                            }

                            // Check if the username entered matches an active account
                            if (accountID == -1) {
                                event.stopPropagation();
                                // Inform the user of error
                                alert(
                                    "The username you entered does not match an active user. Check the username and try again."
                                );
                            }
                            else if (accountID != null) {
                                // Create a variable to store the form values
                                var newRecord = {
                                    "AccountID": accountID,
                                    "ContactRole": formData.get("roleRadio"),
                                    "StudentCount": Number(formData.get("noOfStudents")),
                                    "AcadYear": formData.get("year"),
                                    "Title": formData.get("title"),
                                    "CompanyName": formData.get("company"),
                                    "CompanyPOC": formData.get("companyPoc"),
                                    "Description": formData.get("description"),
                                    "IsDeleted": false
                                }

                                console.log("DATA: ", newRecord);

                                UpdateRecord(newRecord);
                            }
                        }

                        // Re-enable button
                        document.getElementById("modify").disabled = false;
                    },
                    false
                );
            }
        },
        false
    );
})();
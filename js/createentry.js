const apiURL = "http://localhost:";

// Get role from session to modify form 
const userRole = sessionStorage.getItem("Role");

if (userRole === "User") {
  var nameInput = document.getElementById("name");
  nameInput.setAttribute("readonly", true)
  nameInput.value = sessionStorage.getItem("Username");
}


var cancelButton = document.getElementById("cancel");

// Handle cancel of creation
if (cancelButton) {
  cancelButton.addEventListener("click", function () {
    window.location.href = "index.html";
  });
}

// Function to get AccountID of entered username
async function GetAccountID(selectedUsername) {
  try {
    const response = await fetch(`${apiURL}8002/api/accounts/retrieve/${selectedUsername}`);
    const accountID = await response.text();

    if (accountID.includes("Account has not been approved OR Account has been deleted")) {
      return -1;
    }

    return accountID;
  }
  catch (error) {
    console.log("Error getting account:", error);
    alert("Server Error. Try again.");
    return null;
  }
}

// Function to call api and create new record
async function CreateRecord(record) {
  try {
    console.log("String: ", JSON.stringify(record))
    const response = await fetch(`${apiURL}8001/api/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    const data = await response.json();

    // Check response status from API
    if (response.status == 202) {
      // Inform user and redirect to main page
      alert("Your Capstone entry has been successfully created.\nClick OK to be redirected back to the main page.")
      window.location.href = "index.html";                    // NEED TO CHANGE THIS TO THE HOME PAGE HTML URL AFTER THE HOME PAGE IS DONE
    }
    else {
      throw new Error(`HTTP error! Status: ${response.status}`)
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
      var entryForm = document.getElementById("create-entry");

      if (entryForm) {
        entryForm.addEventListener(
          "submit",
          async function (event) {
            event.preventDefault();

            // Disable button to prevent multiple submit calls
            document.getElementById("save").disabled = true;

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
                  "AccountID": Number(accountID),
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

                CreateRecord(newRecord);
              }
            }

            // Re-enable button
            document.getElementById("save").disabled = false;
          },
          false
        );
      }
    },
    false
  );
})();

module.exports = { GetAccount: GetAccountID, CreateRecord };
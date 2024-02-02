const apiURL = "http://localhost:";

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
    const response = await fetch(`${apiURL}8002/api/users`);
    const data = await response.json();
    console.log("Accounts Data:", data);

    const selectedAccount = data.find(
      (account) =>
        account.Username === selectedUsername &&
        !account.IsDeleted &&
        account.IsApproved
    );
    const accountId = selectedAccount ? selectedAccount.ID : null;

    if (!accountId) {
      return -1;
    }

    return accountId;
  }
  catch (error) {
    console.log("Error getting data:", error);
    if (error == "TypeError: Failed to fetch") {
      alert("Server Error. Try again.");
    }
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
    if (response.ok) {
      // Inform user and redirect to main page
      alert("Your Capstone entry has been successfully created.\nClick OK to be redirected back to the main page.")
      window.location.href = "index.html";                    // NEED TO CHANGE THIS TO THE HOME PAGE HTML URL AFTER THE HOME PAGE IS DONE
    }
    else {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  }
  catch (error) {
    console.error("Error getting data:", error);
    if (error == "TypeError: Failed to fetch") {
      alert("Server Error. Try again.");
    }
  }
}

// Function for form validation
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
            if (!entryForm.checkValidity()) {
              event.stopPropagation();
              entryForm.classList.add("was-validated");
            }
            else {
              entryForm.classList.add("was-validated");

              // Retrieve data from form
              const formData = new FormData(entryForm);

              // Get the AccountID of the user
              const accountID = await GetAccountID(formData.get("name"))
              console.log(accountID);

              // Check if the username entered matches an active account
              if (accountID) {
                // Get current date value in yyyy-MM-dd
                const currentDate = new Date()
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const day = currentDate.getDate();

                // Format date into YYYY-MM-DD format
                const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

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
                  "CreationDate": new Date(formattedDate),
                  "IsDeleted": false,
                }

                console.log("DATA: ", newRecord);

                CreateRecord(newRecord);
              }
              else if (accountID == -1) {
                event.stopPropagation();
                // Inform the user of error
                alert(
                  "The username you entered does not match an existing user. Check the username and try again."
                );
              }
            }
          },
          false
        );
      }
    },
    false
  );
})();

module.exports = { GetAccount: GetAccountID, CreateRecord };
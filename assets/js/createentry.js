const apiURL = "http://localhost:";

// Function to get AccountID of entered username
async function GetAccount(selectedUsername) {
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
      return null;
    }

    return accountId;
  }
  catch (error) {
    console.error("Error getting data:", error);
  }
}

// Function to call api and create new record
async function CreateRecord(record) {
  try {
    console.log("String Cheese: ", JSON.stringify(record))
    const response = await fetch(`${apiURL}8001/api/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    const data = await response.json();

    // Inform user of success
    alert("Your Capstone entry has been successfully created.\nYou will be redirected back to the main page.")
    // Redirect to home page after creation
    window.location.href = "index.html";                    // NEED TO CHANGE THIS TO THE HOME PAGE NOT THE LOGIN PAGE AFTER THE HOME PAGE IS DONE
  }
  catch (error) {
    console.error("Error creating data:", error);
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
      var cancelButton = document.getElementById("cancel");

      if (entryForm) {
        entryForm.addEventListener(
          "submit",
          async function (event) {
            event.preventDefault();
            // Prevent further action if any fields are invalid
            if (!entryForm.checkValidity()) {
              // Stop further actions e.g. submitting of form
              event.stopPropagation();
            }
            // Add attribute after validation
            entryForm.classList.add("was-validated");

            // Retrieve data from form
            const formData = new FormData(entryForm);

            // Get the AccountID of the user
            const accountID = await GetAccount(formData.get("name"))


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

            // Check if the username entered matches an active account
            if (newRecord.AccountID) {
              // Call the function to create the record
              CreateRecord(newRecord);
            } else {
              // Stop further actions e.g. submitting of form
              event.stopPropagation();
              // Inform the user of error
              alert(
                "The username you entered does not match an existing user. Check the username and try again."
              );
            }
          },
          false
        );
      }

      // Handle cancel of creation
      if (cancelButton) {
        cancelButton.addEventListener("click", function () {
          window.location.href = "index.html";
        });
      }
    },
    false
  );
})();

const recordAPIURL = "http://localhost:8001/api/records";

var cancelButton = document.getElementById("cancel");

// Handle cancel of creation
if (cancelButton) {
    cancelButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });
}


// Function to get records by query
async function GetRecords(year, keyword) {
    try {
        const response = await fetch(`${recordAPIURL}?ay=${year}&title=${keyword}`);
        const records = await response.json();

        // Return null if there are no matching records
        if (String(records).startsWith("null")) {
            return -1;
        }
        else {
            return records;
        }
    }
    catch (error) {
        console.log("Error getting records:", error);
        alert("Server Error. Try again.");
        return null;
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
            var queryForm = document.getElementById("query-entry");

            if (queryForm) {
                queryForm.addEventListener(
                    "submit",
                    async function (event) {
                        event.preventDefault();

                        // Disable button to prevent multiple submit calls
                        document.getElementById("search").disabled = true;

                        // Remove whitespace
                        var year = document.getElementById("year");
                        var keyword = document.getElementById("keyword");

                        year.value = year.value.trim();
                        keyword.value = keyword.value.trim();

                        // Validate form
                        if (!queryForm.checkValidity()) {
                            event.stopPropagation();
                            queryForm.classList.add("was-validated");
                        }
                        else {
                            queryForm.classList.add("was-validated");

                            // Call GetRecords function to query for all matching records
                            var records = await GetRecords(year.value, keyword.value);

                            if (records == -1) {
                                alert("No entries found. Try a different year or keyword.");
                                queryForm.classList.remove("was-validated");
                            }
                            else if (records != null) {
                                // Store the query inputs in session storage to be called in list page
                                sessionStorage.setItem("QueryYear", year.value);
                                sessionStorage.setItem("QueryKeyword", keyword.value);

                                // Redirect to display page
                                window.location.href = "queryentrylist.html";
                            }
                        }

                        // Re-enable button
                        document.getElementById("search").disabled = false;
                    },
                    false
                );
            }
        },
        false
    );
})();
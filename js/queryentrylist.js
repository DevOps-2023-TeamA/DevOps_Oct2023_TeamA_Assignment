const accountAPIURL = "http://localhost:8002/api/accounts";
const recordAPIURL = "http://localhost:8001/api/records";

var returnButton = document.getElementById("return");

// Handle cancel of creation
if (returnButton) {
    returnButton.addEventListener("click", function () {
        window.location.href = "queryentryform.html";
    });
}


// Function to get records by query
async function GetAccountName(userID) {
    try {
        const response = await fetch(`${accountAPIURL}/${userID}`);
        const account = await response.json();

        return account.Name;
    }
    catch (error) {
        console.log("Error getting account:", error);
        alert("Server Error. Try again.");
        return null;
    }
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


// Function to load data into the table
async function LoadEntries() {
    // Retrieve the query inputs stored in session storage
    const year = sessionStorage.getItem("QueryYear");
    const keyword = sessionStorage.getItem("QueryKeyword");

    // Retrieve the queried records from database
    var entries = await GetRecords(year, keyword);

    console.log(typeof entries);

    // Sort the entries by title alphabetically
    entries.sort((a, b) => a.Title.localeCompare(b.Title));


    var tableBody = document.getElementById('entryTableBody');

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Loop through data array and create table rows
    entries.forEach(async function (item) {

        // Get account name from account ID
        const accountName = await GetAccountName(item.AccountID);

        if (accountName != null) {
            var row = document.createElement('tr');
            row.setAttribute('data-id', item.ID);
            row.style.cursor = "pointer";

            row.addEventListener("mouseenter", function () {
                this.style.backgroundColor = "lightgray";
            });

            row.addEventListener("mouseleave", function () {
                this.style.backgroundColor = "";
            });

            row.addEventListener("click", function (event) {
                if (!event.target.matches('input[type="checkbox"]')) {
                    sessionStorage.setItem("SelectedEntry", JSON.stringify(item));
                    window.location.href = "queryentrymodify.html";
                }
            });

            // Create cells for each row
            var checkboxCell = document.createElement('td');
            checkboxCell.className = 'd-flex flex-column align-items-center';
            checkboxCell.innerHTML = '<input class="form-check-input" style="min-width: 25px; max-width: 25px; min-height: 25px; max-height: 25px;" type="checkbox">';
            row.appendChild(checkboxCell);

            var titleCell = document.createElement('td');
            titleCell.setAttribute('data-field', 'title');
            titleCell.style.maxWidth = '400px';
            titleCell.style.overflow = 'hidden';
            titleCell.style.textOverflow = 'ellipsis';
            titleCell.style.whiteSpace = 'nowrap';
            titleCell.style.fontSize = "17px"
            titleCell.textContent = item.Title;
            row.appendChild(titleCell);

            var picCell = document.createElement('td');
            picCell.setAttribute('data-field', 'pic');
            picCell.style.maxWidth = '200px';
            picCell.style.overflow = 'hidden';
            picCell.style.textOverflow = 'ellipsis';
            picCell.style.whiteSpace = 'nowrap';
            picCell.style.fontSize = "17px"
            picCell.textContent = accountName;
            row.appendChild(picCell);

            // Append row to table body
            tableBody.appendChild(row);
        }
    });
}

// Load in the queried entries when the window has loaded
window.onload = async function () {
    await LoadEntries();
};

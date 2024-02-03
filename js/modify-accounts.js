window.onload = () => {
    readAccounts()
}

 // Define request options
const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
};

async function readAccounts() {
    const response = await fetch('http://localhost:8002/api/accounts', requestOptions);
    
    // Parse response data
    const resData = await response.json();
    console.log(resData);
    
    for (let index = 0; index < resData.length; index++) {
        const account = resData[index];

        approveButtonHTML = account["IsApproved"] 
        ? `<button disabled class="btn btn-soft-success waves-effect waves-light"><i class="mdi mdi-account-check-outline align-middle"></i> Approve </button>` 
        : `<button class="btn btn-success waves-effect waves-light"><i class="mdi mdi-account-check-outline align-middle"></i> Approve </button>`
        account["IsApproved"] = account["IsApproved"] ? "Yes" : "No";
        
        outputHTML = `
            <tr>
                <th> ${account["ID"]} </th>
                <td> ${account["Name"]} </td>
                <td> ${account["Username"]} </td>
                <td> ${account["Password"]} </td>
                <td> ${account["Role"]} </td>
                <td> ${account["CreationDate"]} </td>
                <td> ${account["IsApproved"]} </td>
                <td>
                    <button class="btn btn-primary waves-effect waves-light" role="button"><i class="mdi mdi-account-edit-outline font-size-16 align-middle"></i> Edit </button>
                    <button class="btn btn-danger waves-effect waves-light" role="button"><i class="mdi mdi-trash-can-outline font-size-16 align-middle"></i> Delete </button>
                    ${approveButtonHTML}
                </td>
            </tr>
        `

        document.getElementById("accountsTable").innerHTML += outputHTML
    }
}
window.onload = () => {
    readAccounts()
}


async function readAccounts() {
    // Define request options
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const response = await fetch('http://localhost:8002/api/accounts', requestOptions);
        
        // Parse response data
        const resData = await response.json();
        console.log(resData);
        
        for (let index = 0; index < resData.length; index++) {
            const account = resData[index];
    
            approveButtonHTML = account["IsApproved"] 
            ? `<button disabled class="btn btn-soft-success waves-effect waves-light"><i class="mdi mdi-account-check-outline align-middle"></i> Approve </button>` 
            : `<button id="approveID${account["ID"]}" onclick="approveButton(${account["ID"]}, '${account["Name"]}')" class="btn btn-success waves-effect waves-light"><i class="mdi mdi-account-check-outline align-middle"></i> Approve </button>`
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
                        <button onclick="modifyButton(${account["ID"]})" class="btn btn-primary waves-effect waves-light" role="button"><i class="mdi mdi-account-edit-outline font-size-16 align-middle"></i> Edit </button>
                        <button onclick="changePasswordButton(${account["ID"]})" class="btn btn-info waves-effect waves-light" role="button"><i class="mdi mdi-form-textbox-password font-size-16 align-middle"></i> Change Password </button>
                        <button onclick="deleteButton(${account["ID"]}, '${account["Name"]}')" class="btn btn-danger waves-effect waves-light" role="button"><i class="mdi mdi-trash-can-outline font-size-16 align-middle"></i> Delete </button>
                        ${approveButtonHTML}
                    </td>
                </tr>
            `
    
            document.getElementById("accountsTable").innerHTML += outputHTML
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function approveButton(id, name){
    // Define request options
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        // Send request to server
        const response = await fetch(`http://localhost:8002/api/accounts/approve/${id}`, requestOptions);
        // Handle successful login
        if (response.status === 202) {
            Swal.fire({
                title: 'Success',
                text: `${name}'s account has been approved`,
                icon: 'success',
                confirmButtonColor: '#5156be',
                cancelButtonColor: "#fd625e"
            }).then(() => window.location.reload());
        } else if (response.status === 404) {             
            Swal.fire({
                title: 'Error',
                text: `${name}'s account has been previously approved`,
                icon: 'error',
                confirmButtonColor: '#5156be',
            })
        } else {
            Swal.fire({
                title: 'Error',
                text: `An unexpected error occured, please try again later`,
                icon: 'error',
                confirmButtonColor: '#5156be',
            })
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function modifyButton(id){
    console.log(`Modify button clicked for ID ${id}`)
}

function deleteButton(id, name){
    console.log(`Delete button clicked for ID ${id}`)
}
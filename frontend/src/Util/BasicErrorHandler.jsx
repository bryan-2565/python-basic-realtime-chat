import toast from "react-hot-toast";

function sendMessage(message){
    toast.error(message)
}

export default async function BasicErrorHandler(err){
    // === Status Only Errors ===
    let errorMessage = ""
    let errJson = ""

    
    if (err.body){
        errJson = await err.json();
    }

    if (errJson.detail === "Wrong credentials") return sendMessage("Wrong credentials! Error code: 401")

    switch (err.status) {
        case 500:
            errorMessage = "Internal server error. Error code: 500";
            break;
        case 422:
            errorMessage = "Invalid fields! Error code: 422"
            break;
        case 401:
            errorMessage = "Not authorized! Error code: 401";
            break;
        default:
            errorMessage = "We had an issue contacting the server. Please try again later"
    }

    return sendMessage(errorMessage)
}
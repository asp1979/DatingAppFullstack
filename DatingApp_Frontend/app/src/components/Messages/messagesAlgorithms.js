export function createMessageThreads(arr, userID) {

    // arr is an array of message objects
    // since we are getting all of the user's messages
    // we need to figure out how many unique conversations exist

    let uselessKeys = ["content", "dateRead", "id", "isRead", "messageSent"]
    arr.forEach(obj => Object.keys(obj).forEach(key => uselessKeys.includes(key) ? delete obj[key] : null))

    for(let i = 0; i < arr.length; i++) {
        if(arr[i].senderID === userID) {
            delete arr[i].senderID;
            delete arr[i].senderUsername;
            delete arr[i].senderPhotoUrl;
        } else {
            delete arr[i].recipientID;
            delete arr[i].recipientUsername;
            delete arr[i].recipientPhotoUrl;
        }
    
        arr[i].userID = (arr[i].recipientID || arr[i].senderID)
        arr[i].username = (arr[i].recipientUsername || arr[i].senderUsername)
        arr[i].photoUrl = (arr[i].recipientPhotoUrl || arr[i].senderPhotoUrl)
    }

    uselessKeys = ["recipientID", "recipientUsername", "recipientPhotoUrl", "senderID", "senderUsername", "senderPhotoUrl"]
    arr.forEach(obj => Object.keys(obj).forEach(key => uselessKeys.includes(key) ? delete obj[key] : null))
    
    return [ ...new Set(arr.map(x => JSON.stringify(x))) ].map(x => JSON.parse(x));
}
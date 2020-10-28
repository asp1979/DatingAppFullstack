// arr is an array of message objects
// since we are getting all of the user's messages
// we need to figure out how many unique conversations exist
// the algorithm is somewhat verbose for easier reading

export function createUniqueConversations(arr, username) {
    for(let i = 0; i < arr.length; i++) {
        delete arr[i].content;
        delete arr[i].dateRead;
        delete arr[i].id;
        delete arr[i].isRead;
        delete arr[i].messageSent;
    
        if(arr[i].senderUsername === username) {
            delete arr[i].senderID;
            delete arr[i].senderUsername;
            delete arr[i].senderPhotoUrl;
        }
    
        if(arr[i].recipientUsername === username) {
            delete arr[i].recipientID;
            delete arr[i].recipientUsername;
            delete arr[i].recipientPhotoUrl;
        }
    
        arr[i].ID = (arr[i].recipientID || arr[i].senderID)
        arr[i].username = (arr[i].recipientUsername || arr[i].senderUsername)
        arr[i].photoUrl = (arr[i].recipientPhotoUrl || arr[i].senderPhotoUrl)
    
        delete arr[i].recipientID;
        delete arr[i].recipientUsername;
        delete arr[i].recipientPhotoUrl;
        delete arr[i].senderID;
        delete arr[i].senderUsername;
        delete arr[i].senderPhotoUrl;
    }
    
    return [...new Set(arr.map(x => JSON.stringify(x)))].map(x => JSON.parse(x));
}
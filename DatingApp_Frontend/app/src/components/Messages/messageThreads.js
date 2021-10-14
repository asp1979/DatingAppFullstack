// this groups messages between 2 people (conversation thread)

export function messageThreads(inbox, outbox) {

    function groupBy(arr, keyGetter) {
        let map = new Map();
        arr.forEach((item) => {
            let key = keyGetter(item);
            let pair = map.get(key);
            if(!pair) {
                map.set(key, [item]);
            } else {
                pair.push(item);
            }
        });
        return map;
    }

    let threads = [...groupBy(inbox, msg => msg.senderID)];
    threads.forEach(x => { 
        x.push(x[1][0].senderUsername)
        x.push(x[1][0].senderPhotoUrl)
        x.push(x[1].reduce((a,x) => x.isRead ? a + 0 : a + 1, 0));
    });

    // threads[0][0] is the senderID 
    // threads[0][1] is all the message objects of the user
    // threads[0][2] is the senderUsername 
    // threads[0][3] is the senderPhotoUrl
    // threads[0][4] is is the amount of unread messages 

    let noReplyThreads = outbox.filter(msg => threads.every(x => x[0] !== msg.recipientID));
    noReplyThreads = [...groupBy(noReplyThreads, msg => msg.recipientID)];
    noReplyThreads.forEach(x => {
        x.push(x[1][0].recipientUsername)
        x.push(x[1][0].recipientPhotoUrl)
    });

    // same format as threads
    
    return [threads, noReplyThreads].flat();
}
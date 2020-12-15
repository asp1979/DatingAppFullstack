export function createMessageThreads(inbox, outbox) {

    // this groups messages for each unique sender

    function groupBy(list, keyGetter) {
        let map = new Map();
        list.forEach((item) => {
            let key = keyGetter(item);
            let collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    let threads = [...groupBy(inbox, msg => msg.senderID)];
    threads.forEach(x => x.push(x[1][0].senderUsername));
    threads.forEach(x => x.push(x[1][0].senderPhotoUrl));
    threads.forEach(x => x.push(x[1].reduce((a,x) => x.isRead ? 0 : a + 1, 0)));

    // threads[0][0] is the senderID 
    // threads[0][1] is all the message objects of the user
    // threads[0][2] is the senderUsername 
    // threads[0][3] is the senderPhotoUrl
    // threads[0][4] is is the amount of unread messages 

    let noReplyThreads = outbox.filter(msg => threads.every(x => x[0] !== msg.recipientID));
    noReplyThreads = [...groupBy(noReplyThreads, msg => msg.recipientID)];
    noReplyThreads.forEach(x => x.push(x[1][0].recipientUsername));
    noReplyThreads.forEach(x => x.push(x[1][0].recipientPhotoUrl));
    
    return [threads, noReplyThreads].flat();
}
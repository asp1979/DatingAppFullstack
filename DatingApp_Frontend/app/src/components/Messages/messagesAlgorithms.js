export function createMessageThreads(messages) {

    // this groups messages for each unique sender

    function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    const grouped = [...groupBy(messages, msg => msg.senderID)];
    grouped.forEach(x => x.push(x[1][0].senderUsername));
    grouped.forEach(x => x.push(x[1][0].senderPhotoUrl));
    grouped.forEach(x => x.push(x[1].reduce((a,x) => x.isRead ? 0 : a + 1, 0)));

    // grouped[0][0] is the senderID 
    // grouped[0][1] is all the message objects of the user
    // grouped[0][2] is the senderUsername 
    // grouped[0][3] is the senderPhotoUrl
    // grouped[0][4] is is the amount of unread messages 

    return grouped;
}
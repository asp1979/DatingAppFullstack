import { IMessage } from "../../interfaces/Interfaces";

// this groups messages between 2 people (conversation thread)

export function messageThreads(inbox: IMessage[], outbox: IMessage[]): any[] {

    function groupBy(arr: IMessage[], keyGetter: (key: IMessage) => any) {
        let map = new Map();
        arr.forEach((item: IMessage) => {
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

    let threads: any[] = [...groupBy(inbox, msg => msg.senderID)];
    threads.forEach(x => { 
        x.push(x[1][0].senderUsername)
        x.push(x[1][0].senderPhotoUrl)
        x.push(x[1].reduce((a: any, x: any) => x.isRead ? a + 0 : a + 1, 0));
    });

    // threads[0][0] is the senderID 
    // threads[0][1] is all the message objects of the user
    // threads[0][2] is the senderUsername 
    // threads[0][3] is the senderPhotoUrl
    // threads[0][4] is is the amount of unread messages 

    let noReplyThreads: any[] = outbox.filter(msg => threads.every(x => x[0] !== msg.recipientID));
    noReplyThreads = [...groupBy(noReplyThreads, msg => msg.recipientID)];
    noReplyThreads.forEach(x => {
        x.push(x[1][0].recipientUsername)
        x.push(x[1][0].recipientPhotoUrl)
    });

    // same format as threads
    
    return [threads, noReplyThreads].flat();
}
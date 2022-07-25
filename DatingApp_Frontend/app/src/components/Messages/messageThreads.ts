import { IMessage } from "../../interfaces/Interfaces";

export interface IPersonYouTalkedTo {
    id: number,
    username: string,
    photoUrl: string,
    sharedMessages: IMessage[],
    unreadCount: number
}

export function messageThreads(inbox: IMessage[], outbox: IMessage[], myUserID: number): IPersonYouTalkedTo[] {
    const all = [...inbox, ...outbox].sort((a,b) => Date.parse(b.messageSent) - Date.parse(a.messageSent));

    const peopleYouTalkedTo: IPersonYouTalkedTo[] = all.map(x => {
        if(x.senderID !== myUserID) {
            return {
                id: x.senderID,
                username: x.senderUsername,
                photoUrl: x.senderPhotoUrl,
                sharedMessages: [],
                unreadCount: 0
            }
        } else if(x.recipientID !== myUserID) {
            return {
                id: x.recipientID,
                username: x.recipientUsername,
                photoUrl: x.recipientPhotoUrl,
                sharedMessages: [],
                unreadCount: 0
            }
        } else {
            return {
                id: -1,
                username: "",
                photoUrl: "",
                sharedMessages: [],
                unreadCount: 0
            }
        }
    })
    .filter((x,i,a) => (a.findIndex(x2 => x2.id === x.id) === i) || (x.id === -1))

    peopleYouTalkedTo.forEach(x => {
        x.sharedMessages = all.filter(x2 =>
            (x2.senderID === myUserID && x2.recipientID === x.id)
            || (x2.recipientID === myUserID && x2.senderID === x.id)
        ).reverse()
        x.unreadCount = x.sharedMessages.filter(x => x.senderID !== myUserID && !x.isRead).length
    })

    return peopleYouTalkedTo;
}
export interface IUserContext {
    userContext: {
        baseURL: string,
        jwt: string,
        jwtID: string,
        jwtUsername: string,
        jwtExpiry: number | null,
        loggedIn: boolean,
        unreadMatches: number,
    }
    setUserContext: React.Dispatch<React.SetStateAction<IUserContext["userContext"]>>
}

export interface IUser {
    id: number,
    username: string,
    age: number,
    introduction: string,
    photoUrl: string,
    gender: string
}

export interface IMessage {
    id: number,
    content: string,
    messageSent: string,
    senderID: number,
    senderUsername: string,
    senderPhotoUrl: string,
    recipientID: number,
    recipientUsername: string,
    recipientPhotoUrl: string,
    isRead: boolean
}

export interface IFormData {
    textarea: string,
    recipientID: number,
    senderID: number
}
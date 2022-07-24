import jwt_decode from "jwt-decode";
import { IMyJwt } from "../interfaces/Interfaces";

export const decodeJwt = (jwt: string): IMyJwt => {
    let decoded: IMyJwt;

    try {
        decoded = jwt_decode<IMyJwt>(jwt);
    } catch(err) {
        decoded = {
            nameid: "",
            unique_name: "",
            photo_url: "",
            exp: 0
        }
    }

    return decoded;
}

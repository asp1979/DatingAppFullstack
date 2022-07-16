import jwt_decode, { JwtPayload } from "jwt-decode";

interface IMyJwt extends JwtPayload {
    nameid: string,
    unique_name: string,
    photo_url: string
    exp: number,
}

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

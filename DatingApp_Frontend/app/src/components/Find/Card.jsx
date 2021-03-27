import React, { useState, useContext } from "react";
import { Frame, useMotionValue, useTransform, useAnimation } from "framer";
import { UserContext } from '../../UserContext';

export const Card = ({ user }) => {

    const [display, setDisplay] = useState(true);
    const { userContext, setUserContext } = useContext(UserContext);
    const baseURL = userContext.baseURL;
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };

    const likeUser = async (userID) => {
        const like = await fetch(baseURL + `v1/users/${userContext.jwtID}/like/${userID}`, {
            ...headers,
            method: "POST"
        });
        if(like.ok) {
            setUserContext({
                ...userContext,
                unreadMatches: userContext.unreadMatches + 1
            });
        }
    }

    const motionValue = useMotionValue(0);
    const opacityValue = useTransform(motionValue, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
    
    const animControls = useAnimation();

    const style = {
        fontSize: "2vmin",
        width: "40vmin",
        height: "62vmin",
        padding: "5vmin",
        background: "white",
        borderRadius: "2vmin",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }
    
    return (
        <Frame
        center
        style={style}
        drag="x"
        x={motionValue}
        opacity={opacityValue}
        dragConstraints={{ left: -300, right: 300 }}
        onDragEnd={(event, info) => {
            if (Math.abs(info.offset.x) <= 150) {
                animControls.set({ x: 0 });
            }
            else if(info.offset.x < 150) { // left
                if(display) setDisplay(false);
                likeUser(user.id);
            }
            else if(info.offset.x > -150) { // right
                if(display) setDisplay(false);
            }
        }}>
            <h1 style={{ textAlign: "center", marginBottom: "1.5vmin" }}>{user.username}</h1>
            <div style={{ marginBottom: "5vmin" }}>
                <a style={{ background: "purple", color: "white", padding: "0.5vmin 1vmin", borderRadius: "1vmin" }} href={"/find"}>Overview</a>
            </div>
            <img style={{ borderRadius: "50%", height: "21vmin" }} src={user.photoUrl} alt=""/>
            <div style={{ margin: "2vmin", padding: "0.5vmin", background: "purple", color: "white", borderRadius: "1vmin" }}>
                {
                    user.gender === "female" 
                    ? <i className="fa fa-female" style={{ color: "white" }} aria-hidden="true"></i>
                    : <i className="fa fa-male" style={{ color: "white" }} aria-hidden="true"></i>
                }
                &nbsp;{user.age}
            </div>
            <p>{user.introduction}</p>
        </Frame>
    )
}
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

    const handleDragEnd = (event, info) => {
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
    }

    const frameStyle = {
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
        boxShadow: "none",
    }
    
    return (
        <Frame
        center
        style={frameStyle}
        className="user-info"
        drag="x"
        x={motionValue}
        opacity={opacityValue}
        dragConstraints={{ left: -300, right: 300 }}
        onDragEnd={(event, info) => handleDragEnd(event, info)}>

            <h1>{user.username}</h1>

            <div className="user-info-nav not-flex">
                <a href={"/find"}>Overview</a>
            </div>

            <img src={user.photoUrl} alt=""/>

            <div className="age-gender-box">
                {
                    user.gender === "female" 
                    ? <i className="fa fa-female" aria-hidden="true"></i>
                    : <i className="fa fa-male" aria-hidden="true"></i>
                }
                &nbsp;{user.age}
            </div>

            <p>{user.introduction}</p>

        </Frame>
    )
}
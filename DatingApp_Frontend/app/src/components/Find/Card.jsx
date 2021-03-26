import React, { useContext } from "react";
import { Frame, useMotionValue, useTransform, useAnimation } from "framer";
import { UserContext } from '../../UserContext';

export const Card = ({ user }) => {

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

    // To move the card as the user drags the cursor
    const motionValue = useMotionValue(0);

    // To rotate the card as the card moves on drag
    const rotateValue = useTransform(motionValue, [-300, 300], [-50, 50]);
    
    const opacityValue = useTransform(
        motionValue,
        [-300, -150, 0, 150, 300],
        [0, 1, 1, 1, 0]
    );
    
    // Framer animation hook
    const animControls = useAnimation();

    const style = {
        background: "white",
        height: "50vmin",
        width: "30vmin",
        display: "flex",
        flexDirection: "column",
        padding: "4vmin",
        borderRadius: "2vmin",
    }
    
    return (
        <Frame
        center
        style={style}
        drag="x"
        x={motionValue}
        rotate={rotateValue}
        opacity={opacityValue}
        dragConstraints={{ left: -300, right: 300 }}
        onDragEnd={(event, info) => {
            if (Math.abs(info.offset.x) <= 150) {
                animControls.start({ x: 0 });
            }
            else if(info.offset.x < 150) { // left
                likeUser(user.id);
                animControls.start({ x: info.point.x < 0 ? -300 : 300 });
            }
            else if(info.offset.x < -150) { // right
                animControls.start({ x: info.point.x < 0 ? -300 : 300 });
            }
        }}>

        <h1>{user.username}</h1>

        <div>
            <a href={"/find"}>Overview</a>
        </div>

        <img src={user.photoUrl} alt=""/>

        <div>
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
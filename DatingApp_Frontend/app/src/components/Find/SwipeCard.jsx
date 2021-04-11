import React, { useContext } from "react";
import { Frame, useMotionValue, useTransform, useAnimation } from "framer";
import { UserContext } from '../../UserContext';

export const SwipeCard = ({ user, swipeCount, setSwipeCount }) => {

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
    const opacityValue = useTransform(motionValue, [-300, -150, 0, 150, 300], [0.2, 1, 1, 1, 0.2]);
    const scaleValue = useTransform(motionValue, [-300, -150, 0, 150, 300], [0.80, 0.90, 1, 0.90, 0.80]);
    const animControls = useAnimation();

    const handleDragEnd = (event, info) => {
        if (Math.abs(info.offset.x) <= 150) {
            animControls.start({ x: 0 });
        }
        else if(info.offset.x < 150) { // left
            setSwipeCount(swipeCount + 1);
            animControls.start({ x: -4000, opacity: 0, transition: { duration: 2 } });
            likeUser(user.id);
        }
        else if(info.offset.x > -150) { // right
            setSwipeCount(swipeCount + 1);
            animControls.start({ x: 4000, opacity: 0, transition: { duration: 2 } });
        }
    }
    
    return (
        <Frame
        center
        animate={animControls}
        style={{ display: "flex", boxShadow: "none" }}
        drag="x"
        x={motionValue}
        opacity={opacityValue}
        scale={scaleValue}
        dragConstraints={{ left: -300, right: 300 }}
        className="user-info"
        onDragEnd={(event, info) => handleDragEnd(event, info)}>

            <h1>{user.username}</h1>

            <div className="user-info-nav not-flex">
                <a href={"/find"}>
                    {user.country}
                    &nbsp;
                    <img className="country-icon" src="https://www.countryflags.io/ca/shiny/64.png" alt=""></img>
                </a>
            </div>

            <img className="user-img" src={user.photoUrl} style={{ pointerEvents: "none" }} alt=""/>

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
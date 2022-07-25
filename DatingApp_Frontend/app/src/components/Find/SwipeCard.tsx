import React, { useContext } from "react";
import { Frame, useMotionValue, useTransform, useAnimation, PanInfo, MotionValue } from "framer";
import { UserContext } from '../../UserContext';
import { UserCard } from '../User/UserCard';
import { useTimderApi } from '../../hooks/useTimderApi';
import { IUser, IUserContext } from "../../interfaces/Interfaces";

interface IProps {
    user: IUser,
    swipeCount: number,
    setSwipeCount: (x: number) => void
}

export const SwipeCard = ({ user, swipeCount, setSwipeCount }: IProps): JSX.Element => {

    const { timderFetch } = useTimderApi();
    const { userContext, setUserContext } = useContext<IUserContext>(UserContext);

    const likeUser = async (userID: number) => {
        await timderFetch("POST", `v1/users/${userContext.jwtID}/like/${userID}`)
        .then(res => {
            setUserContext({
                ...userContext,
                unreadMatches: userContext.unreadMatches + 1
            });
        })
        .catch(err => console.error(err))
    }

    const motionValue = useMotionValue(0);
    const opacityValue = useTransform(motionValue, [-300, -150, 0, 150, 300], [0.2, 1, 1, 1, 0.2]);
    const scaleValue = useTransform(motionValue, [-300, -150, 0, 150, 300], [0.80, 0.90, 1, 0.90, 0.80]);
    const animControls = useAnimation();

    let swipeConfirmPx = 150;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if(isMobile) {
        swipeConfirmPx = 30;
    }

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if(Math.abs(info.offset.x) <= swipeConfirmPx) {
            animControls.start({ x: 0 });
        }
        else if(info.offset.x < swipeConfirmPx) { // left
            setSwipeCount(swipeCount + 1);
            animControls.start({ x: -4000, opacity: 0, transition: { duration: 2 } });
            likeUser(user.id);
        }
        else if(info.offset.x > swipeConfirmPx * -1) { // right
            setSwipeCount(swipeCount + 1);
            animControls.start({ x: 4000, opacity: 0, transition: { duration: 2 } });
        }
    }

    return (
        <Frame
        center
        animate={animControls}
        style={{ display: "flex" }}
        drag="x"
        x={motionValue as MotionValue<string | number>}
        opacity={opacityValue}
        scale={scaleValue as MotionValue<string | number>}
        dragConstraints={{ left: -300, right: 300 }}
        className="user-info"
        onDragEnd={(event, info) => handleDragEnd(event, info)}>

            <UserCard user={user} canBeUnliked={false} unlikeUser={() => {}} canBeMessaged={false} messageUser={() => {}} isSelf={false} />

        </Frame>
    )
}
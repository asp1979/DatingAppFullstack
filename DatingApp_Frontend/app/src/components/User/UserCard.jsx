import React from 'react';
import './User.css';

export const UserCard = ({ user, canBeMessaged, messageUser, canBeUnliked, unlikeUser }) => {
    return (
        <div className="user-info">

            <img className="user-img" src={user.photoUrl} alt="" />
            <p className="user-name">{user.username} , {user.age}</p>
            <p className="user-desc">{user.introduction}</p>

        </div>
    )
}

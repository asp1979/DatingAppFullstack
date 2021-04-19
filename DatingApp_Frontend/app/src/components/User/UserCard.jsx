import React, { useState, useEffect } from 'react';
import './User.css';

export const UserCard = ({ user, isSelf, canBeMessaged, messageUser, canBeUnliked, unlikeUser }) => {

    const [imgLoading, setImgLoading] = useState(true);
    
    useEffect(() => {

        const img = new Image();
        img.onload = () => setImgLoading(false);
        img.src = user.photoUrl;

    }, [user])

    return !imgLoading && (
        <div className="user-info">

            <img className="user-img" src={user.photoUrl} alt="" />

            <div className="user-cover">

                <div className="user-actions">
                    { isSelf && <i onClick={messageUser} className="edit-icon fas fa-pen-square"></i> }
                    { canBeMessaged && <i onClick={messageUser} className="chat-icon far fa-comment"></i> }
                    { canBeUnliked && <i onClick={unlikeUser} className="unlike-icon fas fa-heart-broken"></i> }
                </div>

                <div className="user-intro">
                    <p className="user-name">{user.username} , {user.age}</p>
                    <p className="user-desc">{user.introduction}</p>
                </div>

            </div>

        </div>
    )
}

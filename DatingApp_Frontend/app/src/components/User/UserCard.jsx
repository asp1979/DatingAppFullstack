import React from 'react';
import './User.css';

export const UserCard = ({ user, canBeMessaged, messageUser, canBeUnliked, unlikeUser }) => {
    return (
        <div className="user-info">
        
            <div className="user-nav">
                { canBeUnliked && <div onClick={() => unlikeUser()}>
                    <i className="fas fa-heart-broken"></i>
                </div> }

                <h2>{user.username}</h2>

                { canBeMessaged && <div onClick={() => messageUser()}>
                    <i className="far fa-comment"></i>
                </div> }
            </div>

            <img className="user-img" src={user.photoUrl} alt="" />

            <div className="age-gender-box">
                {
                    user.gender === "female" 
                    ? <i className="fa fa-female" aria-hidden="true"></i>
                    : <i className="fa fa-male" aria-hidden="true"></i>
                }
                &nbsp;{user.age}
            </div>

            <p className="user-introduction">
                {user.introduction}
            </p>

        </div>
    )
}

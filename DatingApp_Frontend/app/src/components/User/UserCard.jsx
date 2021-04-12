import React from 'react';
import './User.css';

export const UserCard = ({ user, unlikeUser, canBeUnliked }) => {
    return (
        <div className="user-info">
        
            <h2 className="user-username">{user.username}</h2>

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

            { canBeUnliked && <div className="unlike" onClick={() => unlikeUser()}>
                <i className="fas fa-heart-broken"></i>
            </div> }
        
        </div>
    )
}

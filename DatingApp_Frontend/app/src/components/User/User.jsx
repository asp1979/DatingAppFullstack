import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { motion } from 'framer-motion';
import './User.css';

export const User = ({ match, history }) => {

    const userID = match.params.id; // user ID derived from the current URL
    const { userContext } = useContext(UserContext);

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const baseURL = userContext.baseURL;
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };
    const isSelf = (+userID) === (+userContext.jwtID) ? true : false;

    const unlikeUser = async () => {
        const unlike = await fetch(baseURL + `v1/users/${userContext.jwtID}/like/${userID}`, {
            ...headers,
            method: "DELETE"
        });
        if(unlike.ok) {
            history.push("/matches"); // redirect
        }
    }
    
    useEffect(() => {
        async function getUser() {
            const get = await fetch(baseURL + `v1/users/${userID}`, headers);
            if(get.ok) {
                const data = await get.json();
                setLoading(false);
                setUser({ ...data });
            }
        }
        getUser();
        //eslint-disable-next-line
    }, [])

    return (
        <div className="page user">

            <div className="content">
                {
                    !loading &&
                    <motion.div className="user-info" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                        
                        <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.5 }}>
                            {user.username}
                        </motion.h1>

                        <motion.div className="user-info-nav not-flex" initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.5 }}>

                            <motion.a href={"/user/" + userID} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68, duration: 0.5 }}>
                                Overview
                            </motion.a>

                            { !isSelf && <motion.a href={"/thread/" + userID} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68, duration: 0.5 }}>
                                Messages
                            </motion.a> }

                            {  isSelf && <motion.a href={""} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68, duration: 0.5 }}>
                                Edit <i className="fas fa-edit"></i>
                            </motion.a> }

                        </motion.div>

                        <img src={user.photoUrl} alt=""/>

                        <motion.div className="age-gender-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68, duration: 0.5 }}>
                            {
                                user.gender === "female" 
                                ? <i className="fa fa-female" aria-hidden="true"></i>
                                : <i className="fa fa-male" aria-hidden="true"></i>
                            }
                            &nbsp;{user.age}
                        </motion.div>

                        <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.5 }}>
                            {user.introduction}
                        </motion.p>

                        { !isSelf && <motion.div className="unlike" onClick={() => unlikeUser()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68, duration: 0.5 }}>
                            <i className="fas fa-heart-broken"></i>
                        </motion.div> }
                        
                    </motion.div>
                }
            </div>
            
        </div>
    )
}

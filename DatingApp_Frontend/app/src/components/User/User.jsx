import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './User.css';

export const User = ({ match }) => {

    const userID = match.params.id; // user ID derived from the current URL
    const { userContext } = useContext(UserContext);

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function getUser() {
            const get = await fetch("http://localhost:5000/api/v1/users/" + userID, {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const data = await get.json();
                setLoading(false);
                setUser(data);
            } else {
                console.log(get.status, "Error");
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
                    <motion.div
                    className="user-info"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0   }}
                    transition={{ delay: 0.25, duration: 0.5 }}>
                        
                        <motion.h1 initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                            {user.username}
                        </motion.h1>

                        <img src={user.photoUrl} alt=""/>

                        <div className="age-box">
                            {
                                user.gender === "female" 
                                ? <i className="fa fa-female" aria-hidden="true"></i>
                                : <i className="fa fa-male" aria-hidden="true"></i>
                            }
                            &nbsp;{user.age}
                        </div>

                        <motion.p initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                            {user.introduction}
                        </motion.p>
                        
                    </motion.div>
                }
            </div>
            
        </div>
    )
}

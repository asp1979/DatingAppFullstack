import './Find.css';
// NOTE: some css inherited from User.css
import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { motion } from 'framer-motion';

export const Find = () => {

    const { userContext } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [usersIndex, setUsersIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const baseURL = "http://localhost:5000/api/";
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt } };

    const nextUserIndex = () => {
        if((usersIndex + 1) < (users.length)) {
            setUsersIndex(usersIndex + 1)
        } else {
            
        }
    }

    useEffect(() => {
        async function getUsers() {
            const getAll = await fetch(baseURL + "v1/users", headers); 
            const getLikees = await fetch(baseURL + "v1/users?likersOrLikees=likees", headers); 
            if(getAll.ok && getLikees.ok) {
                const getAllJSON = await getAll.json();
                const getLikeesJSON = await getLikees.json();

                const getLikeesStr = getLikeesJSON.map(x => JSON.stringify(x));
                const usersNotYetLiked = getAllJSON.filter(user => getLikeesStr.includes(JSON.stringify(user)) === false);

                setUsers([...usersNotYetLiked]);
                setLoading(false);
            }
        }
        getUsers();
        // eslint-disable-next-line
    }, [])

    return (
        <div className="page find">
            <div className="content">
                {
                    !loading &&
                    <motion.div className="user-info" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
                                
                        <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                            {users[usersIndex].username}
                        </motion.h1>

                        <motion.div className="user-info-nav not-flex" initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>

                            <motion.a href={""} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.5 }}>
                                Overview
                            </motion.a>

                        </motion.div>

                        <img src={users[usersIndex].photoUrl} alt=""/>

                        <motion.div className="age-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.5 }}>
                            {
                                users[usersIndex].gender === "female" 
                                ? <i className="fa fa-female" aria-hidden="true"></i>
                                : <i className="fa fa-male" aria-hidden="true"></i>
                            }
                            &nbsp;{users[usersIndex].age}
                        </motion.div>

                        <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                            {users[usersIndex].introduction}
                        </motion.p>

                        <button className="next-button" onClick={() => nextUserIndex()}> Next </button>
                        
                    </motion.div>
                } 
            </div>
        </div>
    )
}

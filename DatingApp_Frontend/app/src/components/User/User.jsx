import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './Tabs.css';
import './User.css';

export const User = ({ match }) => {

    const getPathID = match.params.id; // user ID derived from the current URL
    const { userContext } = useContext(UserContext);

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function getUser() {
            const get = await fetch("http://localhost:5000/api/v1/users/" + getPathID, {
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
                    <div className="user-info">

                        <h1>{user.username}</h1>

                        <Tabs className="react-tabs">

                            {/* TabList has to be in same order as TabPanels */}

                            <TabList>
                                <Tab>Overview</Tab>
                                <Tab>Looking for</Tab>
                                <Tab>Photos</Tab>
                                <Tab>Location</Tab>
                            </TabList>

                            <TabPanel className="overview">
                                <img src={user.photoUrl} alt=""></img>
                                <br />
                                <br />
                                <p className="age-text">
                                    {
                                        user.gender === "female" 
                                        ? <i className="fa fa-female" aria-hidden="true"></i>
                                        : <i className="fa fa-male" aria-hidden="true"></i>
                                    }
                                    &nbsp;{user.age}
                                </p>
                                <br />
                                <p>{user.introduction}</p>
                            </TabPanel>

                            <TabPanel className="looking-for">
                                {}
                            </TabPanel>

                            <TabPanel className="photos">
                                {}
                            </TabPanel>
                            
                            <TabPanel className="location">
                                {}
                            </TabPanel>

                        </Tabs>

                    </div>
                }
            </div>
        </div>
    )
}

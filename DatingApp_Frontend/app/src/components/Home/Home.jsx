import './Home.css';
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { UserContext } from '../../UserContext';

export const Home = () => {

    const { userContext } = useContext(UserContext);

    return (
        <div className="page home">

            { userContext.loggedIn === false
                ? <div className="animation-div">

                    <motion.h1
                    className="motion-h1"
                    initial={{ opacity: 0, y: -400, scale: 0 }}
                    animate={{ opacity: 1, y: 0,    scale: 2 }}
                    transition={{ delay: 0.25, duration: 0.5 }}>

                        Welcome to <span className="color-text">Timder!</span><br/>

                        <motion.p
                        className="motion-p"
                        initial={{ opacity: 0, y: 200 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}>
                            The love of your life is just a few clicks away
                        </motion.p>

                        <div className="call-to-action">

                            <motion.a
                            className="cta-button"
                            href="/login"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.00, duration: 0.5 }}>
                                Sign in
                            </motion.a>

                        </div>

                    </motion.h1>

                </div>

                : <div className="animation-div">

                    <motion.h1
                    className="motion-h1"
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    transition={{ delay: 0.25, duration: 1 }}>
                        I hope you enjoy <span className="color-text">Timder!</span><br/>
                    </motion.h1>

                </div>
            }
        </div>
    )
}
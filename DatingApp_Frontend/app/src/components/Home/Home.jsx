import './Home.css';
import React from 'react';
import { motion } from 'framer-motion';

export const Home = () => {
    return (
        <div className="page home">

            <div className="animation-div">

                <motion.h1
                className="motion-h1"
                initial={{ opacity: 0, y: -400, scale: 0 }}
                animate={{ opacity: 1, y: 0,    scale: 2 }}
                transition={{ delay: 0.25, duration: 0.5 }}>

                    Welcome to Timder!<br/>

                    <motion.p
                    className="motion-p"
                    initial={{ opacity: 0, y: 200 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}>
                        The love of your life is just a few clicks away
                    </motion.p>

                    <div className="call-to-action">

                        <motion.a
                        href="/login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.00, duration: 0.5 }}>
                            Login
                        </motion.a>

                        <motion.a
                        href="/register"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.00, duration: 0.5 }}>
                            Register
                        </motion.a>

                    </div>

                </motion.h1>

            </div>

        </div>
    )
}

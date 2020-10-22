import './MessagesThread.css';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../UserContext';
import { useForm } from 'react-hook-form';

export const MessagesThread = ({ match }) => {

    const { userContext } = useContext(UserContext);
    const { register, handleSubmit } = useForm();

    const [messages, setMessages] = useState([]);
    const [oppositeUser, setOppositeUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sentMessages, setSentMessages] = useState(0);

    const lastMsgRef = useRef();
    const scrollToLast = () => lastMsgRef.current.scrollIntoView({ behavior: "smooth" });

    const userID = Number(userContext.jwtID);
    const oppositeUserID = Number(match.params.id); // match = current URL

    useEffect(() => {
        async function getMessages() {
            const get = await fetch(`http://localhost:5000/api/v1/users/${userID}/messages/thread/${oppositeUserID}`, {
                headers: { "Authorization": "Bearer " + userContext.jwt }
            });
            if(get.ok) {
                const res = await get.json();

                res.sort((a,b) => Date.parse(a.messageSent) - Date.parse(b.messageSent));
                setMessages([...res]);

                const oppositeUser = res.filter(msg => msg.senderID !== userID)
                setOppositeUser([...oppositeUser]);

                setLoading(false);
            }
        }
        getMessages();
        setTimeout(() => scrollToLast(), 100);
        // eslint-disable-next-line
    }, [sentMessages]);

    const onSubmit = async (formdata) => {
        formdata.recipientID = oppositeUserID;
        const post = await fetch(`http://localhost:5000/api/v1/users/${userID}/messages`, {
            headers: {
                "Authorization": "Bearer " + userContext.jwt,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(formdata)
        })
        if(post.ok) {
            setSentMessages(prev => ++prev);
            console.log(sentMessages); // this console.log calls the useEffect dependency
        }
    }

    return (
        <div className="page messages-thread">
            <div className="content with-h1-img">
                {
                    !loading
                    ? <h1> {oppositeUser[0].senderUsername} <img className="title-img" src={oppositeUser[0].senderPhotoUrl} alt=""></img> </h1>
                    : <h1>Messages</h1>
                }
                <ul>
                    {
                        !loading && messages
                        .map((msg, i) => 
                            msg.senderID === Number(userContext.jwtID)
                            ? <div key={i} className="message-container">
                                <p>{msg.content}</p>
                                <p>{msg.messageSent.substring(11,16)}</p>
                            </div>

                            : <div key={i} className="message-container recipient">
                                <p>{msg.content}</p>
                                <p>{msg.messageSent.substring(11,16)}</p>
                            </div>
                        )
                    }
                    <div ref={lastMsgRef}></div>
                </ul>

                <form onSubmit={ handleSubmit(onSubmit) } className="form-inputs send-message">
                    <p>Send a message</p>
                    <input 
                        placeholder="" 
                        name="content" 
                        minLength="1" 
                        maxLength="72" 
                        autoComplete="off" 
                        ref={register({ required: true, minLength: 1, maxLength: 72 })}
                    />
                    <button className="send-button" type="submit">Send</button>
                </form>

            </div>
        </div>
    )
}
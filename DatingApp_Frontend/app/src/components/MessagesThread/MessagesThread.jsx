import './MessagesThread.css';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../UserContext';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export const MessagesThread = ({ match }) => {

    const { userContext } = useContext(UserContext);
    const { register, handleSubmit, reset } = useForm();

    const userID = Number(userContext.jwtID);
    const oppositeUserID = Number(match.params.id); // match = current URL
    const baseURL = "http://localhost:5000/api/v1/users";
    const headers = { headers: { "Authorization": "Bearer " + userContext.jwt, "Content-Type": "application/json"} };

    const [messages, setMessages] = useState([]);
    const [oppositeUser, setOppositeUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sentMessages, setSentMessages] = useState(0);

    const lastMsgRef = useRef();
    const scrollToLast = () => lastMsgRef.current.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        async function getData() {
            const getMessages = await fetch(baseURL + `/${userID}/messages/thread/${oppositeUserID}`, headers);
            const getOppositeUser = await fetch(baseURL + `/${oppositeUserID}`, headers);

            if(getMessages.ok && getOppositeUser.ok) {
                const messagesJSON = await getMessages.json();
                messagesJSON.sort((a,b) => Date.parse(a.messageSent) - Date.parse(b.messageSent));
                setMessages([...messagesJSON]);

                const oppositeUserJSON = await getOppositeUser.json();
                setOppositeUser(oppositeUserJSON);

                setLoading(false);
            }
        }
        getData();

        setTimeout(() => scrollToLast(), 100);

        const updateMessages = setInterval(() => getData(), 5000);

        return () => clearInterval(updateMessages);
        // eslint-disable-next-line
    }, [sentMessages]);

    const onSubmit = async (formdata) => {
        formdata.recipientID = oppositeUserID;
        const post = await fetch(baseURL + `/${userID}/messages`, {
            ...headers,
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
                    ? <Link to={"/user/" + oppositeUserID}>
                        <h1> {oppositeUser.username} <img className="title-img" src={oppositeUser.photoUrl} alt=""></img> </h1>
                    </Link>
                    : <h1>Messages</h1>
                }
                <ul>
                    {
                        !loading && messages
                        .map((msg, i) => 
                            msg.senderID === Number(userContext.jwtID)
                            ? <div key={i} className="message-container logged-user">
                                <p>{msg.content}</p>
                                <p>{msg.messageSent.substring(11,16)}</p>
                            </div>

                            : <div key={i} className="message-container opposite-user">
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
                        maxLength="56"
                        autoComplete="off" 
                        ref={register({ required: true, minLength: 1, maxLength: 56 })}
                    />
                    <button onClick={() => setTimeout(() => reset(), 200)} className="send-button" type="submit">Send</button>
                </form>

            </div>
        </div>
    )
}
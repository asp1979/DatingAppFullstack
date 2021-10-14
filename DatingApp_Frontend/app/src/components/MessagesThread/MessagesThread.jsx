import './MessagesThread.css';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../UserContext';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Modal } from '../Modal/Modal';
import { useTimderApi } from '../../hooks/useTimderApi';
import { messageTimestamp } from './messageTimestamp';

export const MessagesThread = ({ match }) => {

    const { timderFetch } = useTimderApi();
    const { userContext } = useContext(UserContext);
    const { register, handleSubmit, reset } = useForm();

    const userID = Number(userContext.jwtID);
    const oppositeUserID = Number(match.params.id); // match = current URL

    const [messages, setMessages] = useState([]);
    const [oppositeUser, setOppositeUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const lastMsgRef = useRef();
    const scrollToLast = () => lastMsgRef.current.scrollIntoView({ behavior: "smooth" });

    const onSubmit = async (formdata) => {
        formdata.recipientID = oppositeUserID;
        await timderFetch("POST", `v1/users/${userID}/messages`, formdata)
        .catch(err => console.error(err));
    }

    const deleteMessage = async (messageID) => {
        await timderFetch("DELETE", `v1/users/${userID}/messages/${messageID}`)
        .catch(err => console.error(err));
    }

    const deleteAll = async () => {
        const messageIDs = messages.map(x => x.id)
        await timderFetch("DELETE", `v1/users/${userID}/messages?msgIDs=${JSON.stringify(messageIDs)}`)
        .catch(err => console.error(err));
    }

    useEffect(() => {
        async function getData() {
            const getMessages = await timderFetch("GET", `v1/users/${userID}/messages/thread/${oppositeUserID}`);
            const getOppositeUser = await timderFetch("GET", `v1/users/${oppositeUserID}`);

            if(getMessages.ok && getOppositeUser.ok) {
                const messagesJSON = await getMessages.json();
                messagesJSON.sort((a,b) => Date.parse(a.messageSent) - Date.parse(b.messageSent));
                setMessages([...messagesJSON]);

                const oppositeUserJSON = await getOppositeUser.json();
                setOppositeUser(oppositeUserJSON);

                setLoading(false);
            } else {
                console.error("failed fetching messages/oppositeUser", getMessages, getOppositeUser);
            }
        }
        getData();

        setTimeout(() => scrollToLast(), 500);

        const updateMessages = setInterval(() => getData(), 500);

        return () => clearInterval(updateMessages);

        // eslint-disable-next-line
    }, [messages.length]);

    return (
        <div className="page messages-thread">
            <div className="content with-h1-img">
                {
                    !loading
                    ? <h1>
                        <Link to={"/user/" + oppositeUserID}>
                            {oppositeUser.username}
                            <img className="title-img" src={oppositeUser.photoUrl} alt=""></img>
                        </Link>
                        <button onClick={() => setOpenModal(true)} className="delete-all">Delete all</button>
                        <Modal open={openModal} closeModal={() => setOpenModal(false)}>
                            <p>Are you sure you want to delete all messages?</p>
                            <button onClick={() => { deleteAll(); setOpenModal(false) }}>
                                Yes
                            </button>
                            <button onClick={() => setOpenModal(false)}>
                                No
                            </button>
                        </Modal>
                    </h1>
                    : <h1>User</h1>
                }

                <div className="thread-legend">
                    <div>
                        {!loading ? oppositeUser.username : "Buddy"} <i className="fas fa-circle blue-circle"></i>
                    </div>
                    <div>
                        You <i className="fas fa-circle purple-circle"></i>
                    </div>
                </div>

                <ul>
                    {
                        !loading && messages
                        .map((msg, i) => 
                            msg.senderID === Number(userContext.jwtID)
                            ? <div key={i} className="message-container logged-user">
                                <p>{msg.content}</p>
                                <p>
                                    {messageTimestamp(msg.messageSent)}
                                    <i onClick={() => deleteMessage(msg.id)} className="delete-message fas fa-times"></i>
                                </p>
                            </div>

                            : <div key={i} className="message-container opposite-user">
                                <p>{msg.content}</p>
                                <p>
                                    {messageTimestamp(msg.messageSent)}
                                    <i onClick={() => deleteMessage(msg.id)} className="delete-message fas fa-times"></i>
                                </p>
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
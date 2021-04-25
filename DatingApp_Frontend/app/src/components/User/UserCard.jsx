import React, { useState, useEffect, useContext } from 'react';
import { Modal } from '../Modal/Modal';
import { UserContext } from '../../UserContext';
import { useForm } from 'react-hook-form';
import './User.css';

export const UserCard = ({ user, isSelf, canBeMessaged, messageUser, canBeUnliked, unlikeUser }) => {

    const [imgLoading, setImgLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const { userContext } = useContext(UserContext);
    const { register, handleSubmit } = useForm();
    
    useEffect(() => {
        const img = new Image();
        img.onload = () => setImgLoading(false);
        img.src = user.photoUrl;
    }, [user])

    const onSubmit = async (formdata) => {
        const urlEncoded = formdata.textarea.replace(" ", "+");
        const query = userContext.baseURL + "v1/users/" + user.id + "/introduction?introduction=" + urlEncoded;
        const put = await fetch(query, {
            method: "PUT",
            headers: { "Authorization" : "Bearer " + userContext.jwt }
        })
        if(put.ok) {
            window.location.reload();
        }
        setOpenModal(false);
    }

    return !imgLoading && (
        <div className="user-info">

            <img className="user-img" src={user.photoUrl} alt="" />

            <div className="user-cover">

                <div className="user-actions">
                    { isSelf && <i onClick={() => setOpenModal(true)} className="edit-icon fas fa-pen-square"></i> }
                    { canBeMessaged && <i onClick={messageUser} className="chat-icon far fa-comment"></i> }
                    { canBeUnliked && <i onClick={unlikeUser} className="unlike-icon fas fa-heart-broken"></i> }
                </div>

                <div className="user-intro">
                    <p className="user-name">{user.username} , {user.age}</p>
                    <p className="user-desc">{user.introduction}</p>
                </div>

                {
                    isSelf &&
                    <Modal open={openModal} closeModal={() => setOpenModal(false)}>
                        <form onSubmit={ handleSubmit(onSubmit) } className="edit-user-modal">
                            <label>Status:</label>
                            <textarea ref={register()} name="textarea" type="text" placeholder={user.introduction}/>
                            <button type="submit">Confirm</button>
                        </form>
                    </Modal>
                }

            </div>

        </div>
    )
}

import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal/Modal';
import { useForm } from 'react-hook-form';
import { useTimderApi } from '../../hooks/useTimderApi';
import SpinnerSVG from './SpinnerSVG.svg';
import { IUser, IFormData } from '../../interfaces/Interfaces';
import './User.css';

interface IProps {
    user: IUser,
    isSelf: boolean,
    canBeMessaged: boolean,
    messageUser: () => void,
    canBeUnliked: boolean,
    unlikeUser: () => void
}

export const UserCard = ({
    user,
    isSelf,
    canBeMessaged,
    messageUser,
    canBeUnliked,
    unlikeUser
    }: IProps): JSX.Element => {

    const { timderFetch } = useTimderApi();
    const [imgLoading, setImgLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        const img = new Image();
        img.onload = () => setImgLoading(false);
        img.src = user.photoUrl;
    }, [user])

    const onSubmit = async (formdata: IFormData) => {
        const newStatus = formdata.textarea;
        if(!newStatus || newStatus.trim() === "") {
            window.location.reload();
            return;
        }
        const query = "?introduction=" + newStatus.replaceAll(" ", "+");
        await timderFetch("PUT", `v1/users/${user.id}/introduction` + query)
        .then(res => {
            window.location.reload();
        })
        .catch(err => console.error(err))
        setOpenModal(false);
    }

    return imgLoading
        ? <div className="user-spinner">
            <img src={SpinnerSVG} alt="loading-icon"></img>
        </div>
        : <div className="user-info">

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
                            <textarea ref={register()} maxLength={32} name="textarea" autoFocus={true} placeholder={user.introduction}/>
                            <button type="submit">Confirm</button>
                        </form>
                    </Modal>
                }

            </div>

        </div>
}

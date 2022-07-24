import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

interface IProps {
    children: React.ReactNode,
    closeModal: () => void,
    open: boolean
}

const renderContent = (props: IProps): React.ReactPortal => {
    const handleBackgroundClick = (e: React.MouseEvent, closeModal: () => void) => {
        if(e.target === e.currentTarget) {
            closeModal()
        }
    }

    return ReactDOM.createPortal(
        <div>
            <div className="background" onClick={(e) => handleBackgroundClick(e, props.closeModal)}>
                <div className="modal">
                    {props.children}
                </div>
            </div>
        </div>,
        document.getElementById("modal") as HTMLDivElement
    )
}

export const Modal = (props: IProps) => {
    return props.open === true ? renderContent(props) : null
}
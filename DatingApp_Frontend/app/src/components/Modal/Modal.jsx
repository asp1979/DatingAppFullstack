import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const renderContent = props => {

    const handleBackgroundClick = (e, closeModal) => {
        e.preventDefault()
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
        document.getElementById("modal")
    )
}

export const Modal = props => {
    return props.open === true ? renderContent(props) : null
}
import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const renderContent = props => {
    return ReactDOM.createPortal(
        <div>
            <div className="background" onClick={props.closeModal}>
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
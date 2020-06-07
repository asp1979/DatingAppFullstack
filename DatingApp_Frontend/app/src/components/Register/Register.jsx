import '../Login/Login.css';
// NOTE: this is using same styling as Login component
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const Register = () => {

    const { register, handleSubmit, errors } = useForm();
    const [state, setState] = useState({ regSuccess: null });

    const onSubmit = async (formdata) => {
        const post = await fetch("http://localhost:5000/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata)
        });
        post.ok ? setState({ ...state, regSuccess: true }) : setState({ ...state, regSuccess: false });
    }

    return (
        <div className="page login">

            <form onSubmit={ handleSubmit(onSubmit) } className="form-inputs">

                { errors.username && <span className="error-span">Username incorrect</span> }
                { errors.password && <span className="error-span">Password incorrect</span> }

                { state.regSuccess === true && <span className="success-span">Registration successful! Confirm your email!</span> }
                { state.regSuccess === false && <span className="error-span">Registration failed! Username taken!</span> }

                <h1>Register</h1>

                <input placeholder="Username" name="username" ref={register({ required: true, minLength: 4, maxLength: 16, pattern: /^[a-z0-9]+$/i })} />
                <input placeholder="Password" name="password" ref={register({ required: true, minLength: 4, maxLength: 32, pattern: /^[a-z0-9]+$/i })} type="password" />

                <button type="submit">Register</button>
                
            </form>

        </div>
    )
}

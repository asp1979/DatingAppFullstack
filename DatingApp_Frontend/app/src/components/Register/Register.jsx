import '../Login/Login.css';
// NOTE: this is using same styling as Login component
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const Register = () => {

    const { register, handleSubmit, errors } = useForm();
    const [regSuccess, setRegSuccess] = useState(null);

    const onSubmit = async (formdata) => {
        const post = await fetch("http://localhost:5000/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata)
        });
        if(post.ok) {
            setRegSuccess(true);
        } else {
            setRegSuccess(false);
        }
    }

    return (
        <div className="page login">

            <form onSubmit={ handleSubmit(onSubmit) } className="form-inputs">

                <h1>Register</h1>

                { errors.username && <span className="error-span">Username too short or not alphanumeric</span> }
                { errors.password && <span className="error-span">Password too short or not alphanumeric</span> }

                { regSuccess === true && <span className="success-span">Registration successful! Confirm your email!</span> }
                { regSuccess === false && <span className="error-span">Registration failed! Username taken!</span> }

                <div>
                    <span>Username</span>
                    <input name="username" maxLength={16} autoComplete="off" ref={register({ required: true, minLength: 4, maxLength: 16, pattern: /^[a-z0-9]+$/i })} />
                </div>

                <div>
                    <span>Password</span>
                    <input name="password" maxLength={32} autoComplete="off" ref={register({ required: true, minLength: 4, maxLength: 32, pattern: /^[a-z0-9]+$/i })} type="password" />
                </div>

                <button type="submit">Register</button>
                
            </form>

        </div>
    )
}
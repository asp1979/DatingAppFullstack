import './Login.css';
import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useForm } from 'react-hook-form';

export const Login = () => {

    const { userContext, setUserContext } = useContext(UserContext);
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = async (formdata) => {
        const post = await fetch("http://localhost:5000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata)
        });
        const res = await post.json();
        const JWT = res.token;
        localStorage.setItem("jwt", JWT);
        setUserContext({ ...userContext, jwt: JWT, loggedIn: true });
    }

    return (
        <div className="page login">

            <form onSubmit={ handleSubmit(onSubmit) } className="form-inputs">

                { errors.username && <span className="error-span">Username incorrect</span> }
                { errors.password && <span className="error-span">Password incorrect</span> }

                <h1>Login</h1>

                <input placeholder="Username" name="username" ref={register({ required: true, minLength: 4, maxLength: 16, pattern: /^[a-z0-9]+$/i })} />
                <input placeholder="Password" name="password" ref={register({ required: true, minLength: 4, maxLength: 32, pattern: /^[a-z0-9]+$/i })} type="password" />

                <button type="submit">Login</button>
                
            </form>

        </div>
    )
}

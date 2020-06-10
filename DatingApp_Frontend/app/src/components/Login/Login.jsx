import './Login.css';
import React, { useState, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export const Login = withRouter(({ history }) => {

    const { userContext, setUserContext } = useContext(UserContext);
    const { register, handleSubmit, errors } = useForm();
    const [fetchError, setFetchError] = useState(false);

    const onSubmit = async (formdata) => {
        const post = await fetch("http://localhost:5000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata)
        });
        const res = await post.json();
        const JWT = res.token;
        if(JWT) {
            localStorage.setItem("jwt", JWT);
            setUserContext({
                ...userContext,
                jwt: JWT,
                jwtUsername: jwtDecode(localStorage.getItem("jwt")).unique_name,
                jwtExpiry: jwtDecode(localStorage.getItem("jwt")).exp,
                loggedIn: true
            });
            setTimeout(() => history.push("/user"), 300); // redirect
        } else {
            setFetchError(true);
        }
    }

    return (
        <div className="page login">

            <form onSubmit={ handleSubmit(onSubmit) } className="form-inputs">

                <h1>Login</h1>

                { errors.username && <span className="error-span">Username incorrect</span> }
                { errors.password && <span className="error-span">Password incorrect</span> }
                { fetchError && <span className="error-span">User does not exist!</span> }

                <input placeholder="Username" name="username" autoComplete="off" ref={register({ required: true, minLength: 4, maxLength: 16, pattern: /^[a-z0-9]+$/i })} />
                <input placeholder="Password" name="password" autoComplete="off" ref={register({ required: true, minLength: 4, maxLength: 32, pattern: /^[a-z0-9]+$/i })} type="password" />

                <button type="submit">Login</button>
                
            </form>

        </div>
    )
})

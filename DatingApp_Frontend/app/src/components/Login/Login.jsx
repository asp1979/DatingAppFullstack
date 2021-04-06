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
        const post = await fetch(userContext.baseURL + "v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata)
        });
        if(post.ok) {
            const res = await post.json();
            const JWT = res.token;
            localStorage.setItem("jwt", JWT);
            setUserContext({
                ...userContext,
                jwt: JWT,
                jwtID: jwtDecode(localStorage.getItem("jwt")).nameid,
                jwtUsername: jwtDecode(localStorage.getItem("jwt")).unique_name,
                jwtExpiry: jwtDecode(localStorage.getItem("jwt")).exp,
                loggedIn: true,
                unreadMatches: 0
            });
            history.push("/find"); // redirect
        } else {
            setFetchError(true);
        }
    }

    return (
        <div className="page login">

            <form onSubmit={ handleSubmit(onSubmit) } className="form-inputs">

                <h1>Sign in</h1>

                { errors.username && <span className="error-span regex">Username too short or contains unsupported characters</span> }
                { errors.password && <span className="error-span regex">Password too short or contains unsupported characters</span> }
                { fetchError && <span className="error-span fetch">Username/password is incorrect</span> }

                <div>
                    <span className="input-name">Username</span>
                    <input name="username" maxLength={16} autoComplete="off" ref={register({ required: true, minLength: 2, maxLength: 16, pattern: /^[a-z0-9]+$/i })} />
                </div>

                <div>
                    <span className="input-name">Password</span>
                    <input name="password" maxLength={32} autoComplete="off" ref={register({ required: true, minLength: 4, maxLength: 32, pattern: /^[a-z0-9]+$/i })} type="password" />
                </div>

                <button type="submit">Sign in</button>
                
            </form>

            <div className="login-help">
                <p>
                    I know you are too lazy to create an account.
                    <br/>
                    <br/>
                    Here is a list of available demo accounts:
                    <br/>
                    <br/>
                    Username: Buck
                    <br/>
                    Password: timder321
                    <br/>
                    <br/>
                    Username: Donna
                    <br/>
                    Password: timder321
                    <br/>
                    <br/>
                    Enjoy!
                </p>
            </div>

        </div>
    )
})
import './Login.css';
import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import { useTimderApi } from '../../hooks/useTimderApi';
import { IUserContext, IFormData } from '../../interfaces/Interfaces';
const jwtDecode = require("jwt-decode");

export const Login = withRouter(({ history }): JSX.Element => {

    const { userContext, setUserContext } = useContext<IUserContext>(UserContext);
    const { timderFetch } = useTimderApi();
    const { register, handleSubmit } = useForm();

    const onSubmit = async (formdata: IFormData) => {
        await timderFetch("POST", "v1/auth/login", formdata)
        .then(res => res.json())
        .then(res => {
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
        })
        .catch(err => {
            console.error(err);
        })
    }

    return (
        <div className="page login">

            <form onSubmit={ handleSubmit(onSubmit) } className="form-inputs">

                <h1>Sign in</h1>

                <div className="input-container">
                    <span className="input-name">Username</span>
                    <input name="username" maxLength={16} autoComplete="off" ref={register({ required: true, minLength: 2, maxLength: 16, pattern: /^[a-z0-9]+$/i })} />
                </div>

                <div className="input-container">
                    <span className="input-name">Password</span>
                    <input name="password" maxLength={32} autoComplete="off" ref={register({ required: true, minLength: 4, maxLength: 32, pattern: /^[a-z0-9]+$/i })} type="password" />
                </div>

                <button type="submit">Sign in</button>

            </form>

            <div className="login-help">
                <p>
                    Hello!
                    <br/>
                    <br/>
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
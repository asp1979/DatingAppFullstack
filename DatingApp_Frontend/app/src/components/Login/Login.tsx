import './Login.css';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../UserContext';
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import { useTimderApi } from '../../hooks/useTimderApi';
import { IUserContext, IFormData } from '../../interfaces/Interfaces';
import { decodeJwt } from '../../util/decodeJwt';

export const Login = withRouter(({ history }): JSX.Element => {

    const { userContext, setUserContext } = useContext<IUserContext>(UserContext);
    const { post } = useTimderApi();
    const { register, handleSubmit } = useForm();
    const [loginError, setLoginError] = useState("");

    const onSubmit = async (formdata: IFormData) => {
        await post("v1/auth/login", formdata)
        .then(res => {
            const jwt = res.token;
            if(jwt) {
                localStorage.setItem("jwt", jwt);
                let decoded = decodeJwt(jwt);
                setUserContext({
                    ...userContext,
                    jwt: jwt,
                    jwtID: decoded.nameid,
                    jwtUsername: decoded.unique_name,
                    jwtPhotoUrl: decoded.photo_url,
                    jwtExpiry: decoded.exp,
                    loggedIn: decoded.nameid ? true : false,
                    unreadMatches: 0
                });
                history.push("/find"); // redirect
            }
        })
        .catch((err: Error) => {
            setLoginError(err.message)
            console.error(err);
        })
    }

    return (
        <div className="page login">

            <form onSubmit={ handleSubmit(onSubmit) } className="form-inputs">

                <h1>Sign in</h1>

                { loginError && <span className="error-span">{loginError}</span> }

                <div className="input-container">
                    <span className="input-name">Username</span>
                    <input name="username" maxLength={16} autoComplete="off" ref={register({ required: true })} />
                </div>

                <div className="input-container">
                    <span className="input-name">Password</span>
                    <input name="password" maxLength={32} autoComplete="off" ref={register({ required: true })} type="password" />
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
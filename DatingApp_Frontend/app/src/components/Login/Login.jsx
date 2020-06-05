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

            <form onSubmit={ handleSubmit(onSubmit) } className="nav-inputs">

                { errors.username && <span className="error-span">Username field is required</span> }
                { errors.password && <span className="error-span">Password field is required</span> }

                <input placeholder="Username" name="username" ref={register({ required: true })} />
                <input placeholder="Password" name="password" ref={register({ required: true })} type="password" />

                <button type="submit">Login</button>
                
            </form>

        </div>
    )
}

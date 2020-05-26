import './Navbar.css';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function Navbar() {

    const { register, handleSubmit, errors } = useForm();
    const onSubmit = data => console.log(data);

    return (
        <div className="navbar">

            <h1>Timder</h1>

            <ul>
                <li>{/* <a href="#">Matches</a> */}</li>
                <li>{/* <a href="#">Lists</a> */}</li>
                <li>{/* <a href="#">Messages</a> */}</li>
            </ul>

            <form onSubmit={ handleSubmit(onSubmit) } className="nav-inputs">
                {errors.LOGINuser && <span className="error-span">Username field is required</span>}
                {errors.LOGINpass && <span className="error-span">Password field is required</span>}
                <input placeholder="Username" name="LOGINuser" ref={register({ required: true })} />
                <input placeholder="Password" name="LOGINpass" ref={register({ required: true })} type="password" />
                <button type="submit">Login</button>
            </form>

        </div>
    )
}

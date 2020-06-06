import '../Login/Login.css';
// NOTE: this is using same styling as Login component
import React from 'react';
import { useForm } from 'react-hook-form';

export const Register = () => {

    const { register, handleSubmit, errors } = useForm();

    const onSubmit = async (formdata) => {
        const post = await fetch("http://localhost:5000/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata)
        });
        const res = await post.json();
    }

    return (
        <div className="page login">

            <form onSubmit={ handleSubmit(onSubmit) } className="form-inputs">

                { errors.username && <span className="error-span">Username field is required</span> }
                { errors.password && <span className="error-span">Password field is required</span> }

                <input placeholder="Username" name="username" ref={register({ required: true })} />
                <input placeholder="Password" name="password" ref={register({ required: true })} type="password" />

                <button type="submit">Register</button>
                
            </form>

        </div>
    )
}

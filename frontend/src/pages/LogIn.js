import React from "react";
import { Link, useNavigate } from "react-router-dom";

import firebase from 'firebase/compat/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const config = {
  apiKey: "AIzaSyCdLL8BZeEwz_WKJ_REUE5B83KRQQVVrlg",
  authDomain: "cs5356-petmatch.firebaseapp.com",
  projectId: "cs5356-petmatch",
  storageBucket: "cs5356-petmatch.appspot.com",
  messagingSenderId: "353854240099",
  appId: "1:353854240099:web:90125ef17b96ed9ca98f56"
};

const app = firebase.initializeApp(config);

const LogInPage = props => {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const handleSubmit = e => {
        e.preventDefault();
        console.log("form submitted");
        const email = e.target.email.value;
        const password = e.target.password.value;

        // call firebase authentication
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // if login successfull, redirect to profile
                // const user = userCredential.user;
                props.onLogIn();
                navigate("/profile");
            })
            .catch((error) => {
                // if failed, pop up error
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Cannot log in: " + errorCode);
                console.log(errorCode, errorMessage);
            });
    };

    return (
    <div className="hero is-fullheight">
        <div className="hero-body is-justify-content-center is-align-items-center">
            <div className="columns is-flex is-flex-direction-column box">
            <form onSubmit={handleSubmit}>
                <div className="column">
                    <div className="title has-text-dark">Log into your PawMatch account</div>
                </div>
                <div className="column">
                    <label htmlFor="email">Email</label>
                    <input className="input is-primary" type="text" placeholder="Email address" name="email" required />
                </div>
                <div className="column">
                    <label htmlFor="Name">Password</label>
                    <input className="input is-primary" type="password" placeholder="Password" name="password" required />
                </div>
                <div className="column">
                    <button className="button is-primary is-fullwidth" type="submit">Log In</button>
                </div>
                <div className="has-text-centered">
                    <p> Do not have an account?  <Link to='/signup' className="has-text-primary">Sign Up</Link>
                    </p>
                </div>
            </form>
            </div>
        </div>
    </div>
    );
};

export default LogInPage;
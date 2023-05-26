import React from "react";
import { Link, useNavigate } from "react-router-dom";

import firebase from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const config = {
  apiKey: "AIzaSyCdLL8BZeEwz_WKJ_REUE5B83KRQQVVrlg",
  authDomain: "cs5356-petmatch.firebaseapp.com",
  projectId: "cs5356-petmatch",
  storageBucket: "cs5356-petmatch.appspot.com",
  messagingSenderId: "353854240099",
  appId: "1:353854240099:web:90125ef17b96ed9ca98f56"
};

const app = firebase.initializeApp(config);

const SignUpPage = props => {
    const navigate = useNavigate();
    const auth = getAuth(app);

    const handleSubmit = e => {
        e.preventDefault();
        console.log("form submitted");
        const email = e.target.email.value;
        const password = e.target.password.value;

        // call firebase authentication
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                // const user = userCredential.user;
                props.onLogIn();
                navigate("/profile");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Cannot sign up: " + errorCode);
                console.log(errorCode, errorMessage);
            });
    };

    return (
    <div className="hero is-fullheight">
        <div className="hero-body is-justify-content-center is-align-items-center">
            <div className="columns is-flex is-flex-direction-column box">
            <form onSubmit={handleSubmit}>
                <div className="column">
                    <div className="title has-text-dark">Create a PawMatch profile for your pet!</div>
                </div>
                <div className="column">
                    <label htmlFor="email">New Email</label>
                    <input className="input is-primary" type="text" placeholder="Email address" name="email" required />
                </div>
                <div className="column">
                    <label htmlFor="Name">New Password</label>
                    <input className="input is-primary" type="password" placeholder="Password" name="password" required />
                </div>
                <div className="column">
                    <button className="button is-primary is-fullwidth" type="submit">Sign Up</button>
                </div>
                <div className="has-text-centered">
                    <p> Already have an account?  <Link to='/login' className="has-text-primary">Log In</Link>
                    </p>
                </div>
            </form>
            </div>
        </div>
    </div>
    );
};

export default SignUpPage;
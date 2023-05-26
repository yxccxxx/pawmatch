import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import pawmatch from "../data/pawmatch.jpeg"

const HomePage = props => {
    return (
        <>
            <section>
                <div className="columns has-background-light p-6 is-vcentered is-two-fifths">
                    <div className="column is-5 ml-5">
                        <div className="title has-text-dark">
                            We help you to find your pet's new friends!
                        </div>
                        <div className="subtitle has-text-dark">
                            Because your pet also want their furry soulmate
                        </div>
                        {props.isSignedIn && (
                            <Link to="/discover">
                                <button className="button is-dark">
                                    Discover more
                                </button>
                            </Link>
                        )}
                        {!props.isSignedIn && (
                            <Link to="/login">
                                <button className="button is-dark">
                                    Discover more
                                </button>
                            </Link>
                        )}
                    </div>
                    <div className="column">
                        <figure className="image is-256x256">
                            <img src={pawmatch}></img>
                        </figure>
                    </div>
                </div>
                <div className="columns has-background-white p-6 is-vcentered">
                    <div className="column has-text-right">
                        <div>PawMatch</div> <br></br>
                        © 2023 <br></br>
                        Privacy - Terms <br></br>
                    </div>
                </div>
            </section>
        </>
      );
};

export default HomePage;
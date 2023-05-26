import React, { useEffect, useState } from "react";
import pawmatch from "../data/pawmatch.jpeg"
import ListDiscoverProfiles from "../components/ListDiscoverProfiles";

const DiscoverPage = props => {
    const userId = props.userId;
    const [profiles, setProfiles] = useState([]);

    const fetchAllProfiles = async () => {
        async function getProfiles() {
            var response = await fetch('/api/users');
            const data = await response.json();
            setProfiles(data);
        }
        await getProfiles();
    }

    useEffect(() => {
        fetchAllProfiles();
    }, []);

    return (
        <>
            <section>
                <div className="columns has-background-light p-6 is-vcentered is-two-fifths">
                    <div className="column is-5 ml-5">
                    <div className="title has-text-dark">
                        Discover your pet's new friends
                    </div>
                    <div className="subtitle has-text-dark">
                        Browse and like the pet profiles below!
                    </div>
                    </div>
                    <div className="column">
                    <figure className="image is-256x256">
                        <img src={pawmatch}></img>
                    </figure>
                    </div>
                </div>
                <ListDiscoverProfiles userId={userId} profiles={profiles} fetchAllProfiles={fetchAllProfiles} />
                <div className="columns has-background-light p-6 is-vcentered">
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

export default DiscoverPage;
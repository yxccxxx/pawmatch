import ShowMatchedPets from "../components/ShowMatchedPets";
import ShowPetProfile from "../components/ShowPetProfile";
import ShowProfileEvents from "../components/ShowProfileEvents";
import React, { useEffect, useState } from "react";

const ProfilePage = props => {
    const userId = props.userId;
    const [profile, setProfile] = useState({});

    const loadPetProfile = async () => {
        async function getProfile() {
          var response = await fetch(`/api/user/${userId}`);
          const data = await response.json();
          setProfile(data);
        }
        await getProfile();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadPetProfile();
    }, []);

    return (
        <>
            <section>
            <div className="has-background-light p-6">
                <ShowPetProfile userId={userId} profile={profile} loadPetProfile={loadPetProfile} />
            </div>
            {Object.keys(profile).length > 0 && (
                <div>
                    <div className="has-background-white p-6">
                        <ShowMatchedPets userId={userId} profile={profile} loadPetProfile={loadPetProfile} />
                    </div>
                    <div className="has-background-light p-6">
                        <ShowProfileEvents userId={userId} />
                    </div>
                </div>
            )}
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

export default ProfilePage;
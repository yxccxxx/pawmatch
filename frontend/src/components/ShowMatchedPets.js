import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ShowMatchedPets = props => {
  const userId = props.userId;
  const [matchedPetProfiles, setMatchedPetProfiles] = useState({});
  const petProfileItems = ["Profile Picture", "Name", "Gender", "Species", "Breed", "Age", "Contact", "Location"];

  const loadMatchedPetProfiles = async () => {
    async function getMatchedPetProfiles() {
      var response = await fetch(`/api/user/${userId}/matchedPets`);
      const data = await response.json();
      setMatchedPetProfiles(data);
    }
    await getMatchedPetProfiles();
  }

  useEffect(() => {
    loadMatchedPetProfiles();
  }, []);

  const handleUnlike = async (unlikedProfileId) => {
    console.log("unliked!")
    fetch(`/api/user/${userId}/unlike/${unlikedProfileId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            console.log("unlike successful")
            loadMatchedPetProfiles();
        } else {
            console.log("unlike profile went wrong");
        }
    })
  }

  return (
    <>
      <section>
        <div className="p-3 is-centered" style={{marginLeft: "25%", marginRight: "25%"}}>
          <div className="title is-4"><i className="fas fa-paw" /> Matched Pets </div>
          {matchedPetProfiles.length === 0 ? (
            <div>
              <br></br>
              Want to match with someone? Discover other paw friends and like them!
              <br></br> <br></br>
              <Link to="/discover">
                <button className="button is-dark">
                  Discover more
                </button>
              </Link>
            </div>
          ) : 
            Object.values(matchedPetProfiles).map(profile => {
              return (
                <div key={profile.id} className="columns is-vcentered is-two-fifths" style={{border: "3px solid rgba(0, 0, 0, 0.05", marginTop: "3%", marginBottom: "3%"}}>
                  <div className="column is-5 ml-5">
                    <div className="p-3 is-justify-content-center is-align-items-center" style={{marginLeft: "10%", marginRight: "10%"}} >
                    {profile["ProfilePicture"] === undefined ? (
                        <div>No profile picture</div>
                    ) : (
                        <div><img src={profile["ProfilePicture"]} alt="pet"></img></div>
                    )}
                    <br></br>
                    </div>
                  </div>
                  <div className="column">
                    <div className="p-3 is-justify-content-center is-align-items-center" style={{marginLeft: "10%", marginRight: "10%", marginTop: "5%", marginBottom: "5%"}} >
                    {
                      petProfileItems.slice(1).map((item, _) => {
                        if (profile[item.toLowerCase()] === "" || profile[item.toLowerCase()] === undefined) {
                          return null;
                        }
                        return (
                          <div key={item} className="mb-2" style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <label htmlFor={item}>{item}: </label>
                            {profile[item.toLowerCase()]}
                          </div>
                        )
                      })
                    }
                    </div>
                    <div className="has-text-centered pb-2">
                      <button className="button is-inverted" onClick={() => handleUnlike(profile.id)}>
                          <i className="fas fa-times mr-2"></i> No longer interested
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>
    </>
  );
};

export default ShowMatchedPets;
import React, { useState } from "react";
import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const ShowPetProfile = props => {
  const userId = props.userId;
  const profile = props.profile;
  const app = getApp();
  const storage = getStorage(app);
  const petProfileItems = ["Profile Picture", "Name", "Gender", "Species", "Breed", "Age", "Contact", "Location"];
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const handleCreateProfile = e => {
    e.preventDefault();
    const {elements} = e.target;
    const profileData = {
      name: elements.Name.value,
      gender: elements.Gender.value,
      species: elements.Species.value,
      breed: elements.Breed.value,
      age: elements.Age.value,
      contact: elements.Contact.value,
      location: elements.Location.value,
    };
    
    const storageRef = ref(storage, 'profileImages/' + userId);
    uploadBytes(storageRef, elements.ProfilePicture.files[0]).then(() => {
      console.log('Uploaded profile image file!');
        
      fetch(`/api/user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData)
      }).then(response => {
        if (response.ok) {
          props.loadPetProfile();
        } else {
          console.log("create profile went wrong");
        }
      });
    });
  };

  const handleUpdateButtonClick = e => {
    e.preventDefault();
    setShowUpdateForm(true);
    props.loadPetProfile();
  }

  const handleCancelUpdate = e => {
    e.preventDefault();
    setShowUpdateForm(false);
    props.loadPetProfile();
  }

  const handleUpdate = e => {
    e.preventDefault();
    const {elements} = e.target;
    const profileData = {
      name: elements.Name.value,
      gender: elements.Gender.value,
      species: elements.Species.value,
      breed: elements.Breed.value,
      age: elements.Age.value,
      contact: elements.Contact.value,
      location: elements.Location.value,
    };

    const updateProfileData = data => {
      fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.ok) {
          console.log("updated profile");
          setShowUpdateForm(false);
          props.loadPetProfile();
        } else {
          console.log("update profile went wrong");
        }
      });
    }

    const newProfilePicture = elements.ProfilePicture.files[0];
    if (newProfilePicture === undefined) {
      updateProfileData(profileData);
    } else {
      const storageRef = ref(storage, 'profileImages/' + userId);
      uploadBytes(storageRef, elements.ProfilePicture.files[0]).then(() => {
        console.log('Uploaded profile image file!');
        updateProfileData(profileData); 
      });
    }
  };

  const handleDelete = e => {
    e.preventDefault();
    fetch(`/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => {
      if (response.ok) {
        console.log("deleted profile");
        setShowUpdateForm(false);
        props.loadPetProfile();
      } else {
        console.log("delete profile went wrong");
      }
    })
  };

  return (
      <>
        {Object.keys(profile).length === 0 ? (
          <div>
            <div className="title has-text-dark has-text-centered">New to PawMatch? Create your pet profile below!</div>
            <br></br>
            <form onSubmit={handleCreateProfile}>
              <div className="columns is-vcentered is-two-fifths" style={{border: "3px solid rgba(0, 0, 0, 0.05", marginLeft: "15%", marginRight: "15%"}}>
                <div className="column is-5 ml-5">
                  <div className="p-3 is-justify-content-center is-align-items-center" style={{marginLeft: "10%", marginRight: "10%"}} >
                    <input name="ProfilePicture" type="file" accept="image/*" /> <br></br> 
                    <label htmlFor="Profile Picture"> Upload Profile Picture </label>
                  </div>
                </div>
                <div className="column">
                  <div className="p-3 is-justify-content-center is-align-items-center" style={{marginLeft: "10%", marginRight: "10%"}} >
                    {
                      petProfileItems.slice(1).map((item, _) => {
                        return (
                          <div key={item} className="mb-4 " style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <label htmlFor={item}>{item}: </label>
                            {item === "Age" ? (
                              <input name={item} type="number" required/>
                            ) : (
                              <input name={item} type="text" required/>
                            )}
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="has-text-centered pb-2 pt-2">
                    <button className="button is-dark" type="submit">Create Pet Profile</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : showUpdateForm ? (
          <div>
            <div className="title has-text-dark has-text-centered">Update your pet profile below!</div>
            <br></br>
            <form onSubmit={handleUpdate}>
              <div className="columns is-vcentered is-two-fifths" style={{border: "3px solid rgba(0, 0, 0, 0.05", marginLeft: "15%", marginRight: "15%"}}>
                <div className="column is-5 ml-5">
                  <div className="p-3 is-justify-content-center is-align-items-center" style={{marginLeft: "10%", marginRight: "10%"}} >
                    {profile["ProfilePicture"] === undefined ? (
                      <div>No profile picture</div>
                    ) : (
                      <div><img src={profile["ProfilePicture"]} alt="pet"></img></div>
                    )}
                    <br></br>
                    <input name="ProfilePicture" type="file" accept="image/*" /> <br></br>
                    <label htmlFor="Profile Picture"> Upload Profile Picture </label>
                  </div>
                </div>
                <div className="column">
                  <div className="p-3 is-justify-content-center is-align-items-center" style={{marginLeft: "10%", marginRight: "10%"}} >
                    {
                      petProfileItems.slice(1).map((item, _) => {
                        return (
                          <div key={item} className="mb-4 " style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <label htmlFor={item}>{item}: </label>
                            {item === "Age" ? (
                              <input name={item} type="number" defaultValue={profile[item.toLowerCase()]} required />
                            ) : (
                              <input name={item} type="text" defaultValue={profile[item.toLowerCase()]} required />
                            )}
                          </div>
                        )
                      })
                    }
                  </div>
                  <div>
                    <div className="has-text-centered pb-2 pt-2">
                      <button className="button is-dark mr-2" onClick={handleCancelUpdate}>Cancel</button>
                      <button className="button is-warning ml-2 mr-2" onClick={handleDelete}>Delete</button>
                      <button className="button is-inverted ml-2" type="submit">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>        
        ) : (
          <div>
            <div className="title has-text-dark has-text-centered">Welcome to PawMatch!</div>
            <br></br>
            <div className="columns is-vcentered is-two-fifths" style={{border: "3px solid rgba(0, 0, 0, 0.05", marginLeft: "15%", marginRight: "15%"}}>
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
                <div className="p-3 is-justify-content-center is-align-items-center" style={{marginLeft: "10%", marginRight: "10%"}} >
                  {
                    petProfileItems.slice(1).map((item, _) => {
                      return (
                        <div key={item} className="mb-4 " style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                          <label htmlFor={item}>{item}: </label>
                          {profile[item.toLowerCase()]}
                        </div>
                      )
                    })
                  }
                  <div className="mb-4 " style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <label htmlFor="likes"># of users liked this profile: </label>
                    {profile.followerIds !== undefined ? profile.followerIds.length : 0}
                  </div>
                </div>
                <div className="has-text-centered pb-2 pt-2">
                  <button className="button is-inverted" onClick={handleUpdateButtonClick}>Update Pet Profile</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
  );
};

export default ShowPetProfile;
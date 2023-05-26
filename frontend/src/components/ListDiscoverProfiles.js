
const ListDiscoverProfiles = props => {
    const userId = props.userId;
    const petProfileItems = ["Profile Picture", "Name", "Gender", "Species", "Breed", "Age"];

    const handleLike = async (likedProfileId) => {
        console.log("liked!")
        fetch(`/api/user/${userId}/like/${likedProfileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                console.log("like successful")
                props.fetchAllProfiles();
            } else {
                console.log("like profile went wrong");
            }
        })
    }

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
                props.fetchAllProfiles();
            } else {
                console.log("unlike profile went wrong");
            }
        })
    }

    return (
        <>
            <section>
                <div className="p-6 is-centered">
                    {
                        props.profiles.map((profile, index) => {
                            if (profile.id === userId) {
                                return null;
                            }
                            return (
                                <div key={index} className="columns is-vcentered is-two-fifths" style={{border: "3px solid rgba(0, 0, 0, 0.05", marginLeft: "25%", marginRight: "25%", marginBottom: "3%"}}>
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
                                                    <div key={item} className="mb-3 " style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                                    <label htmlFor={item}>{item}: </label>
                                                    {profile[item.toLowerCase()]}
                                                    </div>
                                                )
                                            })
                                        }
                                        </div>
                                        <div className="has-text-centered pb-2">
                                            {profile.followerIds.includes(userId) ? (
                                                <button className="button is-inverted" onClick={() => handleUnlike(profile.id)}>
                                                    <i className="fas fa-heart mr-2"></i> Liked
                                                </button>
                                            ) : (
                                                <button className="button is-inverted" onClick={() => handleLike(profile.id)}>
                                                    <i className="far fa-heart mr-2"></i> Like
                                                </button>
                                            )}
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

export default ListDiscoverProfiles;
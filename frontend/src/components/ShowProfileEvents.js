import ListEvents from "../components/ListEvents";
import React, { useEffect, useState } from "react";
import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ShowProfileEvents = props => {
    const userId = props.userId;
    const app = getApp();
    const storage = getStorage(app);
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState("all");
    const [add, setAdd] = useState(false);
    const fetchEvents = async () => {
        const response = await fetch(`/api/profile/${userId}/events`);
        const jsonData = await response.json();
        const events = await jsonData.events;
        
        setEvents(events);
    }
    const onEventChanged = () => {
        fetchEvents();
    }
    const handleCreateEvent = e => {
      e.preventDefault();
      const storageRef = ref(storage, 'eventImages/' + e.target.name.value + e.target.location.value);

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, e.target.avatar.files[0]).then((snapshot) => {
        console.log('Uploaded event image file!');
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          const eventInfo = {
            name : e.target.name.value,
            time : Date.parse(e.target.date.value + " " + e.target.time.value),
            location : e.target.location.value,
            imageUrl : downloadURL
          }
          fetch(`api/user/${userId}/event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({eventInfo: eventInfo})
          }).then(async response => {
            if (response.ok) {
              console.log("Create event", eventInfo);
              await fetchEvents();
            }
          })
        });
      });
      setAdd(false);
    }
    const handleFilter = (filter) => {
      setFilter(filter);
      var button = document.querySelector('.is-current');
      button.classList.remove('is-current');
      button = document.getElementById(filter);
      button.classList.add('is-current');
    }

    const getFilteredEvents = () => {
      if (filter === "all"){
        return events;
      } else if (filter === "created") {
        return events.filter( event => event.creatorId === userId );
      } else {
        return events.filter( event => event.creatorId !== userId );
      }
    }
    useEffect(() => {
        console.log("Loading Profile for the first time");
        fetchEvents();
      }, []);
    return (
        <>
          <section>
            <div className="container">
            <div className="content">
                <div
                    style={{
                        paddingTop: "15px",
                        marginLeft: "25%",
                        marginRight: "25%",
                    }}
                >
                    <div className="columns">
                        <div className="column title is-4"><i className="fas fa-calendar-alt" /> Events</div>
                        <div className="column has-text-right">
                          <button className="button is-inverted" onClick={() => {setAdd(true)}}>
                            <i className="fas fa-plus mr-2" /> Create Event
                          </button>
                        </div>
                    </div>
                    {add &&
                      <div className="p-3 has-text-centered" style={{border: '3px solid rgba(0, 0, 0, 0.05',marginLeft: "25%",marginRight: "25%"}}>
                        <form onSubmit={handleCreateEvent}>
                          <div className="has-text-right"><button className="button is-inverted" onClick={() => {setAdd(false)}}><i className='fas fa-times mr-2' /> Close</button></div>
                          <label className="label" htmlFor="name">
                            Name
                          </label>
                          <input name="name" type="text" required />
                          <label className="label" htmlFor="time">
                            Time
                          </label>
                          <input name="time" type="time" className="mr-3" required />
                          <input name="date" type="date" required />
                          <label className="label" htmlFor="location">
                            Location
                          </label>
                          <input name="location" type="text" required />
                          <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" style={{display:"none"}}></input>
                          <label htmlFor="avatar" className="button mb-2 mt-2">Click me to upload an image</label>
                          <div className="has-text-centered pb-2 pt-2">
                            <input type="submit" className="button" />
                          </div>
                        </form>
                      </div>
                    }
                    <div>
                        <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                            <ul className="pagination-list">
                                <li><button id="all" onClick={() => handleFilter("all")} className="pagination-link is-current" aria-label="all" aria-current="page">All</button></li>
                                <li><button id="created" onClick={() => handleFilter("created")} className="pagination-link" aria-label="Goto events on my location">Created</button></li>
                                <li><button id="joined" onClick={() => handleFilter("joined")} className="pagination-link" aria-label="Goto events on other locations">Joined</button></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
              <ListEvents events={getFilteredEvents()} onEventChanged={onEventChanged} userId={userId} isProfile={true} />
            </div>
          </section>
        </>
      );
};

export default ShowProfileEvents;
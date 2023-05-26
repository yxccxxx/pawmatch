import React, { useEffect, useState } from "react";
import ListEvents from "../components/ListEvents";
import pawmatch from "../data/pawmatch.jpeg"

const EventPage = props => {
  const userId = props.userId;
  console.log("event page", userId );
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userLocation, setUserLocation] = useState(null);

  const fetchEvents = async () => {
    var response = await fetch('/api/events');
    const jsonData = await response.json();
    const events = await jsonData.events;
    console.log("data:", jsonData);
    
    setEvents(events);
  }
  const onEventChanged = () => {
    fetchEvents();
  }
  
  async function initMap() {
    const google = window.google;

    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { Marker } = await google.maps.importLibrary("marker");
    const { Geocoder } = await google.maps.importLibrary("geocoding");
    const { InfoWindow } = await google.maps.importLibrary("streetView");

    // The geocode of user location
    var position = null;
    const geocoder = new Geocoder();
    console.log("userLocation",userLocation);
    geocoder.geocode( { 'address': userLocation}, function(results, status) {
      if (status === 'OK') {
        position = results[0].geometry.location;
        // The map, centered at user location
        let map = new Map(document.getElementById("map"), {
          zoom: 4,
          center: position,
          mapId: "DEMO_MAP_ID",
        });

        events.forEach( event => {
          const infoWindow = new InfoWindow({
            content: `<div className="has-text-centered">${event.name}<br />${event.location}</div>`
          });
          geocoder.geocode( { 'address': event.location}, function(results, status) {
            if (status === 'OK') {
              const geocode = results[0].geometry.location;
              // map.setCenter(geocode);
              const marker = new Marker({
                  map: map,
                  position: geocode
              });

              marker.addListener("click", () => {
                infoWindow.open({
                  anchor: marker,
                  map,
                });
              });
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
        })
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  const handleFilter = (filter) => {
    setFilter(filter);
    var current = document.querySelector('.is-current');
    current.classList.remove('is-current');
    current = document.getElementById(filter);
    current.classList.add('is-current');
  }
  useEffect(() => {
    console.log("First Loading");
    fetchEvents();
    async function getUserLocation() {
      var response = await fetch(`/api/user/${userId}/location`);
      const jsonData = await response.json();
      setUserLocation( await jsonData.location );
    }
    getUserLocation();
  }, []);

  useEffect(() => {
    console.log("event filter changes!");
    if (filter ==="mapview") {
      document.getElementById("map").style.visibility = "block";
      document.getElementById("map").style.height = "400px";
      document.getElementById("map").style.width = "100%";
      initMap();
    }
  }, [filter]);

  return (
    <>
      <section>
        <div className="columns has-background-light p-6 is-vcentered is-two-fifths">
          <div className="column is-5 ml-5">
            <div className="title has-text-dark">
              Calling all pet parents!<br />Come and hang out with your paw-mates
            </div>
            <div className="subtitle has-text-dark">
              Because your pets deserve to be at their happiest
            </div>
          </div>
          <div className="column">
            <figure className="image is-256x256">
              <img src={pawmatch}></img>
            </figure>
          </div>
        </div>
        <div className="has-background-white p-6 is-vcentered">
          <div className="mb-2">
            <nav className="pagination is-centered" role="navigation" aria-label="pagination">
              <ul className="pagination-list">
                <li><button id="all" onClick={() => handleFilter("all")} className="pagination-link is-current" aria-label="all" aria-current="page">All</button></li>
                <li><button id="mapview" onClick={() => handleFilter("mapview")} className="pagination-link" aria-label="Display events on map">Map View</button></li>
              </ul>
            </nav>
          </div>
          {filter !== "mapview" && <ListEvents events={events} onEventChanged={onEventChanged} userId={userId} isProfile={false} />}
          {filter === "mapview" && <div id="map"></div>}
        </div>
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

export default EventPage;
const ListEvents = props => {
  const userId = props.userId;
  const handleLike = (eventInfo) => {
    const id = eventInfo.id;
    if (eventInfo.participantIds.includes(userId)) {
      handleDelete(id);
    } else {
      fetch(`/api/event/${id}/user/${userId}/like`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if (response.ok) {
            props.onEventChanged();
          }
        })
    }
  }
  const handleDelete = (id) => {
    fetch(`api/user/${userId}/event/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        console.log("Delete clicked", id);
        props.onEventChanged();
      }
    })
  }
  return (
    <div>
      <div
        style={{
          marginLeft: "25%",
          marginRight: "25%",
        }}
      >
        {props.events.length === 0 && <div>No Events</div>}
        {props.events.length > 0 &&
          props.events.map((eventInfo, index) => {
            return (
              <div key={index} className="content">
                <div
                    style={{
                    borderTop: "1px solid darkgrey",
                    paddingTop: "15px",
                    paddingBottom: "15px",
                    }}
                >
                  <figure>
                    <img
                      src={(eventInfo.imageUrl)? eventInfo.imageUrl: "https://bulma.io/images/placeholders/128x128.png"}
                    />
                  </figure>
                  <div>
                    <strong>Event : {eventInfo.name}</strong>
                    <br />
                    Time : {eventInfo.time}
                    <br />
                    Location : {eventInfo.location}
                    <br />
                    <div className="columns">
                        <div className="column"># of participants : {eventInfo.participantIds.length}<br />
                            <a href="https://buy.stripe.com/test_4gw6su3ZqdmDg4o148" className="is-size-7">Wanna find out if your liked ones are coming?</a></div>
                        <div className="column has-text-right">
                            {!props.isProfile && <button className="button is-inverted" onClick={() => handleLike(eventInfo)}>
                              {eventInfo.participantIds.includes(userId) ? (
                                <div><i className="fas fa-heart" ></i> Liked </div>
                              ) : (
                                <div><i className="far fa-heart" ></i> Like </div>
                              )}
                              {/* <i className={(eventInfo.participantIds.includes(userId) ? "fas fa-heart mr-2" : "far fa-heart mr-2")} /> Like */}
                            </button>}
                            {props.isProfile && <button className="button is-inverted" onClick={() => handleDelete(eventInfo.id)}>
                            <i className="fas fa-times mr-2" /> Delete
                            </button>}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ListEvents;
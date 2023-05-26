import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import 'firebase/compat/storage';

const config = {
    apiKey: "AIzaSyCdLL8BZeEwz_WKJ_REUE5B83KRQQVVrlg",
    authDomain: "cs5356-petmatch.firebaseapp.com",
    projectId: "cs5356-petmatch",
    storageBucket: "cs5356-petmatch.appspot.com",
    messagingSenderId: "353854240099",
    appId: "1:353854240099:web:90125ef17b96ed9ca98f56"
};

firebase.initializeApp(config);
const firestoreDb = firebase.firestore();
const eventStorage = getStorage();
const storage = firebase.storage();

// pet profile operations
export const createProfile = async (userId, profile) => {
  console.log("create profile...");
  const profileData = {...profile, followerIds: [], matchedPetIds: [], eventIds: []};
  await firestoreDb.collection("pets").doc(userId).set(profileData);
};

export const getProfile = async (userId) => {
  const profile = await firestoreDb
  .collection("pets").doc(userId)
  .get().then((doc) => {
    if (doc.exists) {
        console.log("user data:", doc.data());
        return { id: doc.id, ...doc.data() };
    } else {
        console.log("No such document!");
        return {};
    }
  });
  return profile;
};

export const getProfilePicture = async (userId) => {
  var storageRef = storage.ref('profileImages/' + userId);
  return await storageRef.getDownloadURL()
    .then((url) => {
      // `url` is the download URL for image
      return url;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateProfile = async (userId, profile) => {
  let userRef = firestoreDb.collection("pets").doc(userId);
  await userRef.update(profile).catch((error) => {
    console.error("Error updating profile: ", error);
  });
};

export const deleteProfile = async (userId) => {
  await firestoreDb.collection("pets").doc(userId).delete().then(() => {
    console.log("Profile successfully deleted!");
  }).catch((error) => {
    console.error("Error removing document: ", error);
  });
}

export const deleteProfilePicture = async (userId) => {
  var storageRef = storage.ref('profileImages/' + userId);
  // Delete the file
  await storageRef.delete().then(() => {
    // File deleted successfully
    console.log("profile picture deleted");
  }).catch((error) => {
    // Uh-oh, an error occurred!
    console.log(error);
  });
}

export const getAllProfiles = async () => {
  var profiles = [];
  profiles = await firestoreDb
    .collection("pets")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        var data = { id: doc.id, ...doc.data() };
        profiles.push(data);
      });
      return profiles;
    });
  return profiles;
};

export const addFollower = async (userId, followerId) => {
  // add followerId to userId followerIds list
  let profileRef = firestoreDb.collection("pets").doc(userId);
  await profileRef.update({
    followerIds: firebase.firestore.FieldValue.arrayUnion(followerId)
  });
};

export const removeFollower = async (userId, followerId) => {
  // remove followerId from userId's followerIds list
  let profileRef = firestoreDb.collection("pets").doc(userId);
  await profileRef.update({
    followerIds: firebase.firestore.FieldValue.arrayRemove(followerId)
  })
  .catch((error) => {
    console.error('Error removing value from array in Firestore: ', error);
  });
};

export const addMatchedPet = async (userId, matchedPetId) => {
  // add matchedPetId to userId matchedPetIds list
  let profileRef = firestoreDb.collection("pets").doc(userId);
  await profileRef.update({
    matchedPetIds: firebase.firestore.FieldValue.arrayUnion(matchedPetId)
  });
};

export const removeMatchedPet = async (userId, matchedPetId) => {
  // remove matchedPetId from userId's matchedPetIds list
  let profileRef = firestoreDb.collection("pets").doc(userId);
  await profileRef.update({
    matchedPetIds: firebase.firestore.FieldValue.arrayRemove(matchedPetId)
  })
  .catch((error) => {
    console.error('Error removing value from array in Firestore: ', error);
  });
};

export const getMatchedPetProfilesByIds = async (matchedPetIds) => {
  const profiles = await getAllProfiles();
  const filtered = profiles.filter(profile => matchedPetIds.includes(profile.id));
  return filtered;
};

export const createEvent = async (userId, eventInfo) => {
  console.log("create event");
  var eventData = {
    imageUrl: eventInfo.imageUrl,
    name: eventInfo.name,
    time: firebase.firestore.Timestamp.fromDate(new Date(eventInfo.time)),
    location: eventInfo.location,
    participantIds: [userId],
    creatorId: userId
  };
  const eventRef = await firestoreDb.collection("events").add(eventData);
  eventData = await eventRef.get();
  const userRef = firestoreDb.collection("pets").doc(userId);
  await userRef.update({
    eventIds: firebase.firestore.FieldValue.arrayUnion(eventData.id)
  })
}

export const deleteEvent = async (userId, eventId) => {
  let eventRef = firestoreDb.collection("events").doc(eventId);
  const eventData = await eventRef.get();
  const creatorId = await eventData.data().creatorId;
  const eventName = await eventData.data().name;
  const eventLocation = await eventData.data().location;
  const participantIds = await eventData.data().participantIds;
  console.log( "delete event", eventData );
  
  // Check if user created the event; if so, remove the event. otherwise
  // remove the user from event's participants list.
  if (creatorId == userId) {
    // delete event image from firebase storage
    // Create a reference to the file to delete
    const desertRef = ref(eventStorage, 'eventImages/' + eventName + eventLocation );
    await deleteObject(desertRef).then(() => {
      console.log("event image delete succeeded");
    }).catch((error) => {
      console.log("event image delete failed", error);
    });
    // Remove event from participants' event list
    participantIds.forEach( async participantId => {
      console.log(`Remove ${eventId} from participant ${participantId}'s event list`)
      let userRef = firestoreDb.collection("pets").doc(participantId);
      await userRef.update({
        eventIds: firebase.firestore.FieldValue.arrayRemove(eventId)
      })
    })
    // Remove the event
    eventRef.delete().then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
  } else {
    await eventRef.update({
      participantIds: firebase.firestore.FieldValue.arrayRemove(userId)
    });
    const userRef = firestoreDb.collection("pets").doc(userId);
    await userRef.update({
      eventIds: firebase.firestore.FieldValue.arrayRemove(eventId)
    })
  }
}

export const getEventByIds = async (eventIds) => {
  console.log(eventIds.length);
  const events = await getAllEvents();
  const filtered = events.filter(event => eventIds.includes(event.id));
  console.log('filtered',filtered);
  return filtered;
}

export const getAllEvents = async () => {
  // Get all the existing events
  // Each event should have an id, name, time, location and number of the total participants
  var events = [];
  events = await firestoreDb
    .collection("events")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        var data = { id: doc.id, ...doc.data() };
        data.time = doc.data().time.toDate().toString();
        events.push(data);
        console.log(data);
      });
      return events;
    });
  return events;
};

export const likeEvent = async (userId, eventId) => {
  // Favorite an event
  // Add event to the participant's schedule
  let userRef = firestoreDb.collection("pets").doc(userId);
  await userRef.update({
    eventIds: firebase.firestore.FieldValue.arrayUnion(eventId)
  });
  // Add participant to the event
  let eventRef = firestoreDb.collection("events").doc(eventId);
  await eventRef.update({
    participantIds: firebase.firestore.FieldValue.arrayUnion(userId)
  });
};

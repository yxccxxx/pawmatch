import * as db from "./database.js";
import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// add endpoints
app.get('/api/user/:userId', async (req, res) => {
  const {userId} = req.params;
  var userData = await db.getProfile(userId);
  const profilePictureUrl = await db.getProfilePicture(userId);
  userData.ProfilePicture = profilePictureUrl;
  return res.status(200).send(userData);
})

app.post('/api/user/:userId', async (req, res) => {
  const {userId} = req.params;
  const profile = req.body;
  await db.createProfile(userId, profile);
  res.status(200).send();
})

app.put('/api/user/:userId', async (req, res) => {
  const {userId} = req.params;
  const profile = req.body;
  await db.updateProfile(userId, profile);
  res.status(200).send();
})

app.delete('/api/user/:userId', async (req, res) => {
  const {userId} = req.params;
  await db.deleteProfile(userId);
  await db.deleteProfilePicture(userId);
  res.status(200).send();
})

app.get("/api/users", async (req, res) => {
  var profiles = await db.getAllProfiles();
  await Promise.all(profiles.map(async (profile) => {
    const userId = profile.id;
    const profilePictureUrl = await db.getProfilePicture(userId);
    profile.ProfilePicture = profilePictureUrl;
    return profile;
  }));
  res.status(200).send(profiles);
});

app.put("/api/user/:userId/like/:likedProfileId", async (req, res) => {
  const {userId} = req.params;
  const {likedProfileId} = req.params;
  await db.addFollower(likedProfileId, userId);

  // add to each other's matched list if likedProfileId also includes userId
  const userProfile = await db.getProfile(userId);
  if (userProfile.followerIds.includes(likedProfileId)) {
    await db.addMatchedPet(userId, likedProfileId);
    await db.addMatchedPet(likedProfileId, userId);
  }
  res.status(200).send();
})

app.put("/api/user/:userId/unlike/:unlikedProfileId", async (req, res) => {
  const {userId} = req.params;
  const {unlikedProfileId} = req.params;
  await db.removeFollower(unlikedProfileId, userId);

  // add to each other's matched list if likedProfileId also includes userId
  const userProfile = await db.getProfile(userId);
  if (userProfile.followerIds.includes(unlikedProfileId)) {
    await db.removeMatchedPet(userId, unlikedProfileId);
    await db.removeMatchedPet(unlikedProfileId, userId);
  }
  res.status(200).send();
})

app.get("/api/user/:userId/matchedPets", async (req, res) => {
  const {userId} = req.params;
  var userData = await db.getProfile(userId);
  const matchedPetProfiles = await db.getMatchedPetProfilesByIds(userData.matchedPetIds);

  await Promise.all(matchedPetProfiles.map(async (profile) => {
    const userId = profile.id;
    const profilePictureUrl = await db.getProfilePicture(userId);
    profile.ProfilePicture = profilePictureUrl;
    return profile;
  }));
  res.status(200).send(matchedPetProfiles);
})

app.get("/api/user/:userId/location", async(req, res) => {
  const {userId} = req.params;
  var userData = await db.getProfile(userId);
  res.status(200).send({'location': userData.location});
});

app.get("/api/profile/:userId/events", async(req, res) => {
  const {userId} = req.params;
  var userData = await db.getProfile(userId);
  userData.events = await db.getEventByIds(userData.eventIds);
  res.status(200).send({'events': await db.getEventByIds(userData.eventIds)});
});

app.post("/api/user/:userId/event", async(req, res) => {
  // Create event
  const {userId} = req.params;
  const {eventInfo} = req.body;
  await db.createEvent(userId, eventInfo);
  res.status(200).send();
});

app.delete("/api/user/:userId/event/:eventId", async(req, res) => {
  const {userId, eventId} = req.params;
  await db.deleteEvent(userId, eventId);
  res.status(200).send();
});

app.get("/api/events", async (req, res) => {
  res.status(200).send({ 'events': await db.getAllEvents() });
});

app.put("/api/event/:eventId/user/:userId/like", async (req, res) => {
  const {eventId, userId} = req.params;
  await db.likeEvent(userId, eventId);
  res.status(200).send();
});

export default app;

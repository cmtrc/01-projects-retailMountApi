const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Headers
const getHeaders = () => {
  const token = Buffer.from(
    `${process.env.CLIENTID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");
  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  const requestOptions = {
    headers: {
      Authorization: `Basic ${token}`,
    },
    method: "POST",
    body: urlencoded,
    redirect: "follow",
  };
  return requestOptions;
};

// AccessToken
const getAccessToken = async () => {
  return fetch("https://us.battle.net/oauth/token", getHeaders())
    .then((res) => res.json())
    .then((json) => {
      return new Promise((res, reject) => {
        return res(json);
      });
    });
};

// Retrieves mounts from the Game Data API. Set to first 100 as default. Edit the splice to the amount of mounts you want to retrieve.
// If you remove the splice, it should return all mounts
const requestsForMount = (json, access_token) => {
  return json.mounts.splice(0, 100).map((mount) => {
    const id = mount.id;
    return fetch(
      `https://us.api.blizzard.com/data/wow/mount/${id}?namespace=static-us&locale=en_US&access_token=${access_token}`
    );
  });
};

// Creature request
const getAllcreatureRequests = (mounts, access_token) => {
  return mounts.map((mount) => {
    const creatureId = mount.creature_displays[0].id;
    const url = `https://us.api.blizzard.com/data/wow/media/creature-display/${creatureId}?namespace=static-us&locale=en_US&access_token=${access_token}`;
    return fetch(url);
  });
};

// Index page
router.get("/", (req, res) => {
  res.json({ message: "Index page loaded" });
});

// Mounts
const modyfiedMounts = [];
router.get("/mounts", (req, res) => {
  let allMounts = [];
  if (modyfiedMounts && modyfiedMounts.length > 0) {
    console.log("sending cache elements");
    return res.send(modyfiedMounts);
  } else {
    getAccessToken().then((accessTokenResponse) => {
      // get accesstoken
      const access_token = accessTokenResponse.access_token;
      const url = `https://us.api.blizzard.com/data/wow/mount/index?namespace=static-us&locale=en_US&access_token=${access_token}`;
      fetch(url) // fetch all mounts
        .then((res) => res.json())
        .then((json) => {
          const requests = requestsForMount(json, access_token); // create all request for individual mounts
          Promise.all(requests)
            .then((responses) => Promise.all(responses.map((r) => r.json()))) // return all responses
            .then((mounts) => {
              allMounts = mounts;
              const reqs = getAllcreatureRequests(mounts, access_token); // create all requests for the mounts images
              // make all request for mounts images
              Promise.all(reqs).then((responses) =>
                Promise.all(responses.map((r) => r.json())).then(
                  (creaturesMedia) => {
                    creaturesMedia.forEach((creatureMedia, index) => {
                      allMounts[index].href = creatureMedia.assets[0].value;
                    });
                    allMounts.forEach((mount) => {
                      modyfiedMounts.push({
                        name: mount.name,
                        bilde: mount.href,
                      });
                    });
                    return res.send(modyfiedMounts);
                  }
                )
              );
            });
        });
    });
  }
});

// Realm and username mount-search
router.get("/profile/:realm/:user", (req, res) => {
  const username = req.params.user;
  const realm = req.params.realm;
  if (username && realm) {
    getAccessToken().then((accessTokenResponse) => {
      const access_token = accessTokenResponse.access_token;
      const url = `https://us.api.blizzard.com/profile/wow/character/${realm}/${username}/collections/mounts?namespace=profile-us&locale=en_US&access_token=${access_token}`;
      fetch(url)
        .then((res) => res.json())
        .then((json) => res.send(json));
    });
  } else {
    res.json({
      error: true,
      message: "username and realm is required",
    });
  }
});

app.use(router);
app.listen(port);
console.log("Listening on port " + port);

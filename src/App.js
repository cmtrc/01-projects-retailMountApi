import React, { useEffect } from "react";
import "./App.css";

const App = () => {
  useEffect(() => {
    var token = "";
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    var requestOptions = {
      headers: {
        Authorization: `Basic ${token}`,
      },
      method: "POST",
      body: urlencoded,
      redirect: "follow",
    };

    fetch("https://us.battle.net/oauth/token", requestOptions)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        const access_token = json.access_token;
        const url = `https://us.api.blizzard.com/data/wow/mount/index?namespace=static-us&locale=en_US&access_token=${access_token}`;
        fetch(url)
          .then((res) => res.json())
          .then((json) => {
            console.log(json);
          });
      });
  }, []);

  return (
    <div className="app">
      <h1>TEST</h1>
    </div>
  );
};

export default App;

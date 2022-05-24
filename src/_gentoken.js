import axios from "axios";

const client_secret = process.env.REACT_APP_CLIENT_SECRET;

function genToken() {
  const url = "https://api.eksisozluk.com/v2/account/anonymoustoken";
  const raw = `Platform=g&Version=2.0.0&Build=51&Api-Secret=68f779c5-4d39-411a-bd12-cbcc50dc83dd&Client-Secret=${client_secret}&ClientUniqueId=1a62383d-742e-4bcf-bf77-2fe1a1edcd39`;

  const local_token = localStorage.getItem("token");

  const token_expired = () => {
    const date = new Date(localStorage.getItem("token_expires_date"));
    if (date.getTime() > Date.now()) {
      return false;
    } else {
      return true;
    }
  };

  if (local_token && !token_expired()) {
    // console.log("local token: " + local_token);
    return Promise.resolve(local_token);
  }

  return new Promise((resolve, reject) => {
    axios
      .post(url, raw, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // "Content-Length": 184,
          // Host: "api.eksisozluk.com",
        },
      })
      .then((res) => {
        const token = res.data.Data.access_token;
        const expires_in = res.data.Data.expires_in;
        const expires_date = res.data.Data[".expires"];

        localStorage.setItem("token", token);
        localStorage.setItem("token_expires_in", expires_in);
        localStorage.setItem("token_expires_date", expires_date);

        // console.log("Your generated anonymous bearer token: " + token);
        // console.log("Expires in: " + expires_in / 3600 + "hrs");
        // console.log("Expiration date: " + expires_date);

        resolve(token);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default genToken;

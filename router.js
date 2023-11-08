const express = require("express");
const router = express.Router();
const axios = require("axios");
const { FacebookCredentials } = require("./models/facebookCredentials");
const { Customer } = require("./models/customer");
const GetUserDetails = async senderId => {
  let options = {
    method: "GET",
    url: `https://graph.facebook.com/v13.0/${senderId}?fields=id,name,email,profile_pic,gender`,
    params: {
      access_token:
        "EAARZBVNNXe5QBO0YZCkxEWUbUfzKjBLyTzZCtFyk2b6inLUg9VMSb6p0ZCLW2cCbPb7vsDCsN9T9dgTOTBaW2mPNxypMofiIrfHpGP1ZCtgW9xXBfdqxJputTeZCK0JKXdqlMNCE7vXrip3IRgOHDJwBGWTbFhQ31aB0Q4TGuk2nAPMnPE6b7S3caP3EkGMqoZD",
    },
  };
  let response = await axios.request(options);
  if (response["status"] == 200 && response["data"]["id"]) {
    return response["data"];
  } else {
    return null;
  }
};
router.get("/", async (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  if (mode && token) {
    if (mode === "subscribe" && token === "abcdefgh12345678") {
      const facebookCredentials = await FacebookCredentials.findOne({
        where: {
          id: 1,
        },
      });
      facebookCredentials.webhook_enabled = true;
      facebookCredentials.save();
      console.log("WEBHOOK_VERIFIED");
      console.log(challenge);
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

router.post("/", async (req, res) => {
  try {
    let body = req.body;
    let senderId = body.entry[0].messaging[0].sender.id;
    let query = body.entry[0].messaging[0].message.text;
    let result = await GetUserDetails(senderId);
    console.log(query);
    console.log(result);
    console.log(senderId);
    const customer = await Customer.findOne({
      where: {
        psid: senderId,
      },
    });
    if (!customer) {
      const newCustomer = await Customer.create({
        psid: senderId,
        name: result.name,
        facebookCredintialsId: 1,
      });
      res.json(newCustomer);
    }
  } catch (error) {
    console.log(error);
  }
  res.status(200).send("OK");
});

module.exports = {
  router,
};

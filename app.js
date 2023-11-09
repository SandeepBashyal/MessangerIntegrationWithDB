const express = require("express");
const session = require("express-session");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const webhookroutes = require("./router");
const database = require("./config/instance");
const { searchMessage } = require("./function");
const { FacebookCredentials } = require("./models/facebookCredentials");
const { Customer } = require("./models/customer");
const FACEBOOK_APP_ID = "851994736578860";
const FACEBOOK_APP_SECRET = "4b443e056354c68eb98a65ea55ceedd4";
const FACEBOOK_CALLBACK_URL = "http://localhost:3000/auth/facebook/callback";
const Facebook_VERIFY_TOKEN = "abcdefgh12345678";
const SESSION_SECRET = "YOUR_SESSION_SECRET"; // Replace with a strong secret key

app.use(bodyParser.json());
app.use(
  session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(`Path ${req.path} with method ${req.method}`);
  next();
});
app.use("/", webhookroutes.router);
app.use("/webhook", webhookroutes.router);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Store the access token and user profile data in your database
      // You can also handle user creation and other logic here
      const user = { accessToken, profile };
      console.log(user);
      return done(null, user);
    }
  )
);

const connectDb = async () => {
  try {
    await database.connection();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
// Facebook authentication route
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    const shortLivedAccessToken = req.user.accessToken;
    axios
      .get(
        `https://graph.facebook.com/v13.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${shortLivedAccessToken}`
      )
      .then(async response => {
        const longLivedAccessToken = response.data.access_token;
        console.log(longLivedAccessToken);
        const facebookCredentials = await FacebookCredentials.create({
          app_id: FACEBOOK_APP_ID,
          app_secret: FACEBOOK_APP_SECRET,
          verify_token: Facebook_VERIFY_TOKEN,
          user_id: req.user.profile.id,
          long_lived_access_token: longLivedAccessToken,
        });
        req.user.accessToken = longLivedAccessToken;
        // Save the long-lived access token in your database
        res.send(
          "Authentication successful. You can now send messages to your Facebook Page."
        );
        res.json(facebookCredentials);
      })
      .catch(error => {
        console.error(error);
      });
  }
);

// Route for obtaining Page Access Token
app.get("/get-page-access-token", async (req, res) => {
  const facebookCredentials = await FacebookCredentials.findOne({
    where: {
      app_id: FACEBOOK_APP_ID,
    },
  });
  if (!facebookCredentials) {
    return res.status(404).json({ error: "Facebook credentials not found" });
  }
  const userId = facebookCredentials.user_id;
  const userAccessToken = facebookCredentials.long_lived_access_token;
  axios
    .get(
      `https://graph.facebook.com/v13.0/${userId}/accounts?access_token=${userAccessToken}`
    )
    .then(response => {
      // console.log(response);
      // Parse the response to get the Page Access Token
      const pageId = response.data.data[1].id;
      const pageAccessToken = response.data.data[1].access_token;
      const pageName = response.data.data[1].name;
      facebookCredentials.page_id = pageId;
      facebookCredentials.page_name = pageName;
      facebookCredentials.page_access_token = pageAccessToken;
      facebookCredentials.save();
      res.json(facebookCredentials);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// Route for sending a message to the Page
app.post("/send-message", async (req, res) => {
  const message = req.body.message;
  const customer = await Customer.findOne({
    where: {
      id: "1",
    },
    include: {
      model: FacebookCredentials,
      as: "facebookCredentials",
    },
  });

  const facebookCredentials = customer.facebookCredentials;
  const customerPsid = customer.psid;
  const pageAccessToken = facebookCredentials.page_access_token;
  const messageData = {
    messaging_type: "RESPONSE",
    recipient: { id: customerPsid },
    message: { text: message },
  };
  axios
    .post(
      `https://graph.facebook.com/v13.0/me/messages?access_token=${pageAccessToken}`,
      messageData
    )
    .then(response => {
      res.json({ message: "Message sent successfully" });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Error sending message" });
    });
});
app.use((req, res, next) => {
  console.log(`Path ${req.path} with method ${req.method}`);
  next();
});

app.get("/get-messages", async (req, res) => {
  const customer = await Customer.findOne({
    where: {
      id: "1",
    },
    include: {
      model: FacebookCredentials,
      as: "facebookCredentials",
    },
  });
  const pageId = customer.facebookCredentials.page_id;
  const pageAccessToken = customer.facebookCredentials.page_access_token;
  const user_Psid = customer.psid;
  const messages = [];
  const conversationIds = await axios.get(
    `https://graph.facebook.com/v18.0/${pageId}/conversations?platform=messenger&user_id=${user_Psid}&access_token=${pageAccessToken}`
  );
  const conversationId = conversationIds.data.data[0].id;
  customer.conversation_id = conversationId;
  customer.save();
  const messageIds = await axios.get(
    `https://graph.facebook.com/v18.0/${conversationId}/messages?fields=messages&access_token=${pageAccessToken}`
  );

  const messageId = messageIds.data.data;

  for (let message of messageId) {
    const result = await axios.get(
      `https://graph.facebook.com/v18.0/${message.id}?fields=id,message,attachments,from,to&access_token=${pageAccessToken}`
    );
    messages.push(result.data);
  }
  const keyword = req.body.keyword;
  if (keyword) {
    const searchResult = await searchMessage(messages, keyword);
    console.log("this is search resuly");
    res.json(searchResult);
  } else {
    res.json(messages);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectDb();
  console.log(`Server is running on port ${port}`);
});

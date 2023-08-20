const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("./models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:5001/auth/google/callback",
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      try {
        console.log(accessToken);
        const profileJson = profile._json;
        await User.deleteOne({ email: profileJson.email })
        let user = await User.findOne({ email: profileJson.email });

        console.log(profileJson);
        if (!user) {
          const newUser = new User({
            userName: profile.displayName,
            userDisplayImage: profileJson.picture,
            email: profileJson.email,
            name: profileJson.given_name
          });

          user = await newUser.save();
        }
        req.user = user;
        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

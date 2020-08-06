const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new googleStrategy(
    {
      clientID: keys.googleClientid,
      clientSecret: keys.googleClientsecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      const existinguser=await  User.findOne({ googleId: profile.id })
      if (existinguser) {
          return done(null, existinguser);
        } 

          const user=await new User({ googleId: profile.id }).save()
            done(null, user);
        
      
    }
  )
);

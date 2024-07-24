import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID.toString(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET.toString(),
      callbackURL: process.env.GOOGLE_CALLBACK_URL.toString(),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // let user = await User.findOne({ googleId: profile.id });

        // if (!user) {
        //   user = new User({
        //     googleId: profile.id,
        //     username: profile.displayName,
        //     email: profile.emails[0].value,
        //     profilePicture: profile.photos[0].value,
        //   });
        //   await user.save();
        // }

        // console.log(profile);
        done(null, profile);
      } catch (err) {
        done(err, false, err.message);
      }
    }
  )
);

export default passport;

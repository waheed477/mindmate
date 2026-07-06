import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';
import { Patient } from '../models/Patient.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("No email returned from Google"));
      }

      let user = await User.findOne({ email });

      const fullName = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();
      const profilePicture = profile.photos?.[0]?.value || '';

      if (!user) {
        // Auto-create user account if first time login
        user = await User.create({
          email,
          fullName,
          profilePicture,
          role: 'patient',
          isEmailVerified: true, // Google pre-verifies emails
          googleId: profile.id
        });

        // Also create a patient profile
        await Patient.create({
          userId: user._id,
          fullName,
          age: 0,
          condition: 'General',
          contact: 'Google Account'
        });
      } else {
        // User exists, update Google specific fields if not set
        let modified = false;
        if (!user.googleId) {
          user.googleId = profile.id;
          modified = true;
        }
        if (profilePicture && !user.profilePicture) {
          user.profilePicture = profilePicture;
          modified = true;
        }
        if (modified) {
          await user.save();
        }
      }

      return done(null, user);
    } catch (err: any) {
      return done(err);
    }
  }
));

// Minimal session configuration (required by passport but session: false ignores it)
passport.serializeUser((user: any, done) => {
  done(null, user._id || user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;




const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("./helpers");

passport.use(
  "local.signin",
  new localStrategy({}, () => {
    return done(null);
  })
);

passport.use(
  "local.signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { fullname } = req.body;
      const newUser = {
        Usuario: username,
        Password: password,
        Fullname: fullname,
      };
      newUser.Password = await helpers.encryptPassword(password);
      const result = await pool.query("INSERT INTO users SET ?", [newUser]);
      newUser.Id = result.insertId;
      return done(null, newUser);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.Id);
});
passport.deserializeUser(async (Id, done) => {
  rows = await pool.query("SELECT * FROM users WHERE Id = ?", [Id]);
  done(null, rows[0]);
});

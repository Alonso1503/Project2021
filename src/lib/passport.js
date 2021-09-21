const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("./helpers");

passport.use(
  "local.signin",
  new localStrategy(
    {
      usernameField: "cedula",
      passwordField: "clave",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const rows = await pool.query("SELECT * FROM persona WHERE cedula = ?", [
        username,
      ]);

      if (rows.length > 0) {
        const user = rows[0];

        const validpassword = await helpers.matchPassword(password, user.clave);
        if (validpassword) {
          done(null, user, req.flash("success", "Welcome " + user.nombre));
        } else {
          done(null, false, req.flash("message", "Contraseña incorrecta"));
        }
      } else {
        return done(null, false, req.flash("message", "Usuario no existe"));
      }
    }
  )
);

passport.use(
  "local.signup",
  new localStrategy(
    {
      usernameField: "nombre",
      passwordField: "clave",
      passReqToCallback: true,
    },
    async (req, nombre, clave, done) => {
      const {
        cedula,
        apellido1,
        apellido2,
        fechaDeNacimiento,
        tipoDeSangre,
        telefono,
      } = req.body;
      const nuevoUsuario = {
        cedula,
        nombre,
        clave,
        apellido1,
        apellido2,
        fechaDeNacimiento,
        tipoDeSangre,
        telefono,
      };
      nuevoUsuario.clave = await helpers.encryptPassword(clave);
      const result = await pool.query("INSERT INTO persona SET ?", [
        nuevoUsuario,
      ]);
      return done(null, nuevoUsuario);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.cedula);
});
passport.deserializeUser(async (cedula, done) => {
  rows = await pool.query("SELECT * FROM persona WHERE cedula = ?", [cedula]);
  done(null, rows[0]);
});

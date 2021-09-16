const express = require("express");
const morgan = require("morgan");
const path = require("path");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const expsql = require("express-mysql-session");
const { database } = require("./keys");
const passport = require("passport");
const localStrategy = require("passport").Strategy;
//Iniciar
app = express();
require("./lib/passport");
//Configuraciones
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: "hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");
//Middleware
app.use(
  session({
    secret: "Lol",
    resave: false,
    saveUninitialized: false,
    store: new expsql(database),
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
//Vbls globales
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  next();
});
//Rutas
app.use(require("./routes/index"));
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));

//Public
app.use(express.static(path.join(__dirname, "public")));
//Server
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});

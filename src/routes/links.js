const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");
const pool = require("../database");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("links/add");
});

router.post("/add", isLoggedIn, async (req, res) => {
  const { nombre, descripcion } = req.body;
  const newLink = {
    nombre,
    descripcion,
    personaCedula: req.user.cedula,
  };
  await pool.query("INSERT INTO padecimiento set ?", [newLink]);
  req.flash("success", "Datos procesados correctamente");
  res.redirect("/links");
});

router.get("/", isLoggedIn, async (req, res) => {
  const links = await pool.query(
    "SELECT * FROM padecimiento WHERE personaCedula = ?",
    [req.user.cedula]
  );
  res.render("links/list", { links });
});
router.get("/emergenciasOpe", isLoggedIn, async (req, res) => {
  const emergen = await pool.query("SELECT * FROM emergencia");
  res.render("links/emergenciasOpe", { emergen });
});
router.get("/emergencia", isLoggedIn, async (req, res) => {
  res.render("links/emergencia");
});
router.post("/datos", isLoggedIn, async (req, res) => {
  const { cedula } = req.body;

  const infoPersonal = await pool.query(
    "SELECT * FROM persona WHERE cedula = ?",
    [cedula]
  );
  const padecimientosPersonal = await pool.query(
    "SELECT * FROM padecimiento WHERE personaCedula = ?",
    [cedula]
  );

  res.render("links/resultados", { infoPersonal, padecimientosPersonal });
});
router.get("/datos", isLoggedIn, async (req, res) => {
  res.render("links/datos");
});

router.post("/emergenciaConfirmada", isLoggedIn, async (req, res) => {
  const { x, y } = req.body;
  const Datos = {
    localizacionx: x,
    localizaciony: y,
    personaCedula: req.user.cedula,
  };
  await pool.query("INSERT INTO emergencia set ?", [Datos]);
  res.render("links/emergenciaConfirmada");
});

router.get("/delete/:padecimientoId", isLoggedIn, async (req, res) => {
  const { padecimientoId } = req.params;
  await pool.query("DELETE FROM padecimiento WHERE padecimientoId = ?", [
    padecimientoId,
  ]);
  req.flash("success", "Link eliminado correctamente");
  res.redirect("/links");
});
router.get("/edit/:padecimientoId", isLoggedIn, async (req, res) => {
  const { padecimientoId } = req.params;
  const links = await pool.query(
    "SELECT * FROM padecimiento WHERE padecimientoId = ?",
    [padecimientoId]
  );
  res.render("links/edit", { links: links[0] });
});
router.post("/edit/:padecimientoId", isLoggedIn, async (req, res) => {
  const { padecimientoId } = req.params;
  const { nombre, descripcion } = req.body;
  const updatedLink = {
    nombre,
    descripcion,
  };

  await pool.query("UPDATE padecimiento set ? WHERE padecimientoId = ?", [
    updatedLink,
    padecimientoId,
  ]);
  req.flash("success", "Link editado correctamente");
  res.redirect("/links");
});

module.exports = router;

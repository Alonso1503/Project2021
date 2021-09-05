const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/add", (req, res) => {
  res.render("links/add");
});
router.post("/add", async (req, res) => {
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
  };
  console.log(req.body);
  await pool.query("INSERT INTO links set ?", [newLink]);
  req.flash("success", "Link actualizado correctamente");
  res.redirect("/links");
});

router.get("/", async (req, res) => {
  const links = await pool.query("SELECT * FROM links");
  res.render("links/list", { links });
});
router.get("/delete/:Id", async (req, res) => {
  const { Id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [Id]);
  req.flash("success", "Link eliminado correctamente");
  res.redirect("/links");
});
router.get("/edit/:Id", async (req, res) => {
  const { Id } = req.params;
  const links = await pool.query("SELECT * FROM links WHERE ID = ?", [Id]);
  res.render("links/edit", { links: links[0] });
});
router.post("/edit/:Id", async (req, res) => {
  const { Id } = req.params;
  const { Title, Description, Url } = req.body;
  const updatedLink = {
    Title,
    Description,
    Url,
  };

  await pool.query("UPDATE links set ? WHERE ID = ?", [updatedLink, Id]);
  req.flash("success", "Link editado correctamente");
  res.redirect("/links");
});

module.exports = router;

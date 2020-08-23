var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "dette er index-siden" });
});
router.get("/mounts", (req, res) => {
  res.json({
    message: "Her kommer et objekt som inneholder retail-wow sine mounts",
  });
});
router.get("/user/:userId", (req, res) => {
  return res.send(
    `Henter ut alle mounts for gjeldene bruker: ${req.params.userId}`
  );
});
app.use("/", router);
app.listen(port);
console.log("Listening on port " + port);

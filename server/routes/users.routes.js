const express = require("express");
const router = express.Router();

const user = require("../controllers/users.controller");

router.post("/signin", user.signIn);

module.exports = router;
const express = require("express");
const router = express.Router();

const user = require("../controllers/users.controller");

router.post("/signin", user.signIn);
router.get('/signin/renew', user.renewToken);

module.exports = router;
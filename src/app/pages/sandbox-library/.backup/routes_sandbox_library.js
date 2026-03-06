const express = require("express");
const router = express.Router();
const trimRequest = require("trim-request");
require("../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const controller = require("../controller/sandbox_library");

router.post("/create", requireAuth, trimRequest.all, controller.create);
router.post("/get", requireAuth, trimRequest.all, controller.get);
router.post("/get_by_id", requireAuth, trimRequest.all, controller.get_by_id);
router.post("/update", requireAuth, trimRequest.all, controller.update);
router.post("/delete", requireAuth, trimRequest.all, controller.delete);
router.post("/get_stats", requireAuth, trimRequest.all, controller.get_stats);
router.post("/execute", requireAuth, trimRequest.all, controller.execute);

module.exports = router;

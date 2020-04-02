const router = require('express').Router();
const emailController = require("../../controllers/nodemailer");

// Matches with "/api/email/boardColab/add"
router.route("/boardColab/add")
	.post(emailController.boardCollaboratorNotification)

// Matches with "/api/email/boardColab/remove" 
router.route("/boardColab/remove")
	.post(emailController.boardColabRemovalNotification);

// Matches with "api/email/newMember"
router.route("/newMember")
	.post(emailController.newMemberMessage);

module.exports = router;
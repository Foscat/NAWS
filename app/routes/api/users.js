const router = require("express").Router();
const userController = require("../../controllers/users");

// Matches with "/api/users"
router.route("/")
  .get(userController.findAll)
  .post(userController.create);

// Matches with "/api/users/:id"
router
  .route("/:id")
  .get(userController.findById)
  .put(userController.update)
  .delete(userController.remove);


// Matches with "/api/users/:email"
router
  .route("/findByEmail/:email")
  .get(userController.findUserByEmail)

  
// Matches with "/api/users/:username"
router
  .route("/findByUsername/:username")
  .get(userController.findUserByUsername)

router
  .route("/remColab/:boardId&:userId")
  .get(userController.removeColabStatus)

router
  .route("/current")
  .post(userController.currentUser);

router
  .route("/signIn")
  .post(userController.signInUser);

module.exports = router;
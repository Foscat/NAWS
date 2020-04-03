import axios from "axios";

export default {
// Use this as working boilerplate and copy code for new table in db

  ///// User CRUD \\\\\

  // Add a user
  addUser: function(userData) {
    // console.log("Add user data: ", userData); // Comment back in for degugging
    return axios.post("/api/users", userData);
  },
  // Gets all users
  getUsers: function() {
    return axios.get("/api/users");
  },
  // Find user by email
  findUserByEmail: function(email){
    // console.log("Find user by email", email); // Comment back in for degugging
    return axios.get("/api/users/findByEmail/"+email);
  },
  // Find user by username
  findUserByUsername: function(username){
    // console.log("Find user by username", username); // Comment back in for degugging
    return axios.get("/api/users/findByUsername/"+username)
  },
  // Update info on a user
  updateUser: function(id, updateData) {
    // console.log("Update user id and data: ", id, updateData); // Comment back in for degugging
    return axios.put("/api/users/" + id, updateData)
  },
  // Delete a user
  deleteUser: function(id) {
    // console.log("Delete user with id: ", id); // Comment back in for degugging
    return axios.delete("/api/users/" + id);
  },
  // Sign in a user
  signInUser: function(signInData){
    // console.log("Sign in user data:", signInData); // Comment back in for degugging
    return axios.post("/api/users/signIn", signInData);
  },
  // Authenticate a user
  currentUser: function(token){
    return axios.post("/api/users/current", token);
  },
  // Remove a users collborator status from a board
  removeColabRights: function(userID, boardID){
    // console.log("Remove ", userID, "rights to work on board ", boardID); // Comment back in for degugging
    return axios.get("/api/users/remColab/"+boardID+"&"+userID);
  },

  ////// Board CRUD \\\\\\
  createBoard: function(boardData){
    // console.log("Create board data:", boardData); // Comment back in for degugging
    return axios.post("/api/boards", boardData);
  },
  getUserBoards: function(userId){
    // console.log("Find all boards made my a user", userId); // Comment back in for degugging
    return axios.get("/api/boards/user/"+userId);
  },
  getBoard:function(boardId){
    // console.log("Find board by id", boardId); // Comment back in for degugging
    return axios.get("/api/boards/"+boardId);
  },
  updateBoard:function(id, updateData){
    // console.log("Update board request", id, updateData); // Comment back in for degugging
    return axios.put("/api/boards/"+id,updateData);
  },
  deleteBoard:function(id){
    // console.log("Delete board request",id); // Comment back in for degugging
    return axios.delete("/api/boards/"+id);
  },

  ////// Email message routes \\\\\\
  boardColabNotification:function(boardInfo){
    // console.log("Send board colab eamil for",  boardInfo); // Comment back in for degugging
    return axios.post("/api/email/boardColab/add", boardInfo);
  },
  boardColabRemovalNotification:function(boardInfo){
    // console.log("Send board colab removal email", boardInfo); // Comment back in for degugging
    return axios.post("/api/email/boardColab/remove", boardInfo);
  },
  newMemeberMessage:function(userInfo){
    // console.log("Send eail to new user", userInfo); // Comment back in for degugging
    return axios.post("/api/email/newMember", userInfo);
  }
}
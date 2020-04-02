import axios from "axios";

export default {
// Use this as working boilerplate and copy code for new table in db

  ///// User CRUD \\\\\

  // Add a user
  addUser: function(userData) {
    console.log("Add user data: ", userData);
    return axios.post("/api/users", userData);
  },
  // Gets all users
  getUsers: function() {
    return axios.get("/api/users");
  },
  // Find user by email
  findUserByEmail: function(email){
    console.log("Find user by email", email);
    return axios.get("/api/users/findByEmail/"+email);
  },
  // Find user by username
  findUserByUsername: function(username){
    console.log("Find user by username", username);
    return axios.get("/api/users/findByUsername/"+username)
  },
  // Update info on a user
  updateUser: function(id, updateData) {
    console.log("Update user id and data: ", id, updateData);
    return axios.put("/api/users/" + id, updateData)
  },
  // Delete a user
  deleteUser: function(id) {
    console.log("Delete user with id: ", id);
    return axios.delete("/api/users/" + id);
  },
  // Sign in a user
  signInUser: function(signInData){
    console.log("Sign in user data:", signInData);
    return axios.post("/api/users/signIn", signInData);
  },
  // Authenticate a user
  currentUser: function(token){
    return axios.post("/api/users/current", token);
  },
  // Remove a users collborator status from a board
  removeColabRights: function(userID, boardID){
    console.log("Remove ", userID, "rights to work on board ", boardID);
    return axios.get("/api/users/remColab/"+boardID+"&"+userID);
  },

  ////// Board CRUD \\\\\\
  createBoard: function(boardData){
    console.log("Create board data:", boardData);
    return axios.post("/api/boards", boardData);
  },
  getUserBoards: function(userId){
    console.log("Find all boards made my a user", userId);
    return axios.get("/api/boards/user/"+userId);
  },
  getBoard:function(boardId){
    console.log("Find board by id", boardId);
    return axios.get("/api/boards/"+boardId);
  },
  updateBoard:function(id, updateData){
    console.log("Update board request", id, updateData);
    return axios.put("/api/boards/"+id,updateData);
  },
  deleteBoard:function(id){
    console.log("Delete board request",id);
    return axios.delete("/api/boards/"+id);
  },

  ////// Email message routes \\\\\\
  boardColabNotification:function(boardInfo){
    console.log("Send board colab eamil for",  boardInfo);
    return axios.post("/api/email/boardColab/add", boardInfo);
  },
  boardColabRemovalNotification:function(boardInfo){
    console.log("Send board colab removal email", boardInfo);
    return axios.post("/api/email/boardColab/remove", boardInfo);
  },
  newMemeberMessage:function(userInfo){
    console.log("Send eail to new user", userInfo);
    return axios.post("/api/email/newMember", userInfo);
  }
}
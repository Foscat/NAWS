const db = require("../models");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const hash = require("./hash");
const fs = require("fs");

// Defining methods for the boardController
module.exports = {
    // Find all boards call **Comment this out before deployment
    findAll: function(req, res) {
      console.log("Find all boards request.");
      db.Board.find(req.query)
        .then(dbBoard => res.json(dbBoard))
        .catch(err => res.status(422).json(err));
    },
    // Find a board by it's id
    findById: function(req, res) {
      console.log("Find board by id request.");
      // If a request parameter has an id search db 
      if(req.params.id){
        console.log(`Find by id ${req.params.id}`)
        db.Board.findById(req.params.id)
        .then(dbBoard => res.json(dbBoard))
        .catch(err => res.status(422).json(err));
      }
      // If no id present return custom error
      else{
        console.log("findById error");
        res.send({
          message: "There is no id present in your request.",
          info: {givenId: req.params.id}
        })
      }
    },
    create: function(req, res) {
      console.log("Create board request.");
      // Check to see request actually has a body with values
      if(Object.keys(req.body).length){
  
        // Use the backend runtime to handle created at timestamp
        Object.assign(req.body, {createdAt: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")});

        db.Board.create(req.body)
        .then(dbBoard => res.json(dbBoard))
        .catch(err => res.status(422).json(err));
      }
      // If there is not values in request body send custom error
      else{
        res.send({
          message: "There is no data in request body.",
          info: {
            givenData: req.body
          }
        });
      }
    },
    update: function(req, res) {
      console.log("Update board request.", req.body)
      // If the request does not have an id param or request body return a custom error
      if(!req.params.id || req.body === {}){
        console.log("Missing data in board update request.");
        res.send({
          message: "There is missing data in your request.",
          info: {
            givenId: req.params.id,
            givenData: req.body
          }
        })
      }
      else{
        // Use the backend runtime to handle updatedAt timestamp
        Object.assign(req.body, {updatedAt: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")});
        // Check data going into function
        console.log("Find one board and update request.", req.params.id, req.body);

        db.Board.findOneAndUpdate({ _id: req.params.id }, req.body)
        .then(dbBoard => (res.json(dbBoard)))
        .catch(err => res.status(422).json(err));
      }
    },
    remove: function(req, res) {
      console.log("Remove board request.");
      // If a id is present then run delete
      if(req.params.id){
        db.Board.findById(req.params.id)
        .then(dbBoard => dbBoard.remove())
        .catch(err =>  res.send({
          message: "The id submitted does not match with any in db.", 
          data:{givenId:req.params.id}
        }))
        .then(dbBoard => res.json(dbBoard))
        .catch(err => res.status(422).json(err));
      }
      // Otherwise return custom error
      else{
        res.send({
          message: "There is no id present in your request.",
          info: {givenId: req.params.id}
        })
      }
    },
    // Each board is tied to a user who made it, the creators user._id is saved as the _adminId
    findBoardsByAdminId: function(req,res){
      if(req.params.id){
        db.Board.find({_adminId:req.params.id})
        .then(dbBoard=>res.json(dbBoard))
        .catch(err=>res.status(422).json(err))
      }
      else{
        res.send("Could not find any boards from this user");
      }
    }
};

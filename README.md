# NAWS
Not Another Workflow Service

### **Built using node version 11.2.0**

## Overview
A ripoff of Trello, Monday, Github Project Boards and basically all the other taskflow mangement systems. Allows a user to make an account, create a board,
add collaborators, drag and drop features for tasks and a way to send an email notificaton to alert collaborators of major changes from the site.

### Dependencies 

**Back End**
- Concurrently - Allows package JSON scripts to handle multiple commands
- Nodemon - For when you are in development any save will refresh server to give live update of changes
- Axios - For communicating with front end
- Express - For helping build a server and serving assests
- Mongoose - Helps with orm for mongodb
- Prop-types - Helps react with hanldeing props
- React - To let app work in a react environment
- If-env - Has app check for env
- Dotenv - Allows .env files to be used in app. 
- Bcrypt - For encrypting data
- Jsonwebtoken - For handleing authorization

**Front End**
- Axios - For communicating with back end routes
- React - To let app work in a react environment
- React-bootstrap-sweetalert - For easy to use models
- React-dom - Needed for react to work with DOM
- React-router-dom - Needed for using a react component router
- React-scripts - Needed for react to work
- Reactstrap - Special components made just for react
- Moment - For easy formatting of dates

See a working delpoyed version here: 
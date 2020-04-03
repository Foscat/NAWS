# NAWS
Not Another Workflow Service

### **Built using node version 11.2.0**

## Overview
A simplified workflow service made for small developer teams to break Epics into boards. 
To keep teams only on relevnt info for the task at hand.

### Upcoming Features
Ability to get a excel spreadsheetdownload of board info. And the ability to generate a board using a excel spreadsheet or JSON file.

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

See a working delpoyed version here: https://aqueous-retreat-73511.herokuapp.com/

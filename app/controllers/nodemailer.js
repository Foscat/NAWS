const nodemailer = require("nodemailer");

// To keep styling the same across emails and use this text as the CSS info.
const emailStyle = `<style>
/* h1,h2,h3,h4,h5,h6{
    color:#bbe1fa;
} */
body{
    margin: 50px;
    background-color: #1b262c;
    color: #bbe1fa;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
footer{
    bottom: 0;
    position: absolute;
}
#header{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #0f4c75;
    color:#bbe1fa;
    padding: 50px;
}
#mainContent{
    display: flex;
    flex-direction: row;
    background-color: #bbe1fa;
    color: #1b262c;
    padding: 15px;

}
#userInfo{
    border: #1b262c solid 3px;
    border-radius: 10px;
    padding: 20px;
}
.mx-auto{margin: 0 auto;}
.center-text{text-align: center;}
.listNone{list-style: none;}
</style>`;

module.exports = {
    // When a user is added as a collaborator to a board they will recive an email
    boardCollaboratorNotification: async function(req,res){
        console.log("Added as board collaborator body:", req.body);
        let { boardInfo } = req.body;
        try {
            if(req.body){
                console.log("Board info exsists")
                
                let transporter = nodemailer.createTransport({
                    host:"smtp-mail.outlook.com",
                    port:587,
                    secureConnection:false,
                    auth: {
                        user:process.env.EMAIL_ADDRESS,
                        pass:process.env.EMAIL_PASSWORD
                    },
                    tls: {
                        ciphers: "SSLv3",
                        rejectUnauthorized: false
                    }
                });
                
                let message = {
                    from: `${boardInfo.admin} & NAWS <${process.env.EMAIL_ADDRESS}>`,
                    to: `${boardInfo.colabName} <${boardInfo.colabEmail}>`,
                    subject: "You have been invited to collaborate on a NAWS board",
                    // If thier email service doesn't accept html the text version will be sent to them.
					text: `Board Title: ${boardInfo.title}
                    	Board Description: ${boardInfo.description}
                        Board password: ${boardInfo.password} 
                        Admin: ${boardInfo.admin}`,
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                            <title>NAWS</title>
                            ${emailStyle}
                        </head>

                        <body>

                            <div id="header">
                                <div class="mx-auto">
                                    <h1 class="center-text">${boardInfo.admin} added you as a collaborator to a NAWS board.</h1>
                                    <h2 class="center-text">You can now access this board from your profile.</h2>
                                </div>
                            </div>

                            <div id="mainContent">
                                <div class="mx-auto" id="userInfo">
                                    <h3>${boardInfo.admin}'s NAWS board information</h3>
                                    <ul class="listNone">
                                        <li>Title: ${boardInfo.title}</li>
                                        <li>Description: ${boardInfo.description}</li>
                                    </ul>
                                </div>
                            </div>
                            
                        </body>

                        <footer>
                            <h3 class="center-text">NAWS 2020</h3>
                        </footer>
                    </html>
                    `,
                };

                transporter.sendMail(message, (err,info) => {
                    console.log("Send message");
                    if(err){
                        console.error(`Trasporter sendMail method hit an error ${err.message}`);
                        return process.exit(1);
                    }
                    console.log("Message Sent  %s", info.messageId);
                    console.log("Preview url: %s", nodemailer.getTestMessageUrl(info));
                });

                return res.send("Review notificication went through").end();
            }
            else console.log("There was an else", req.body.length);
        } catch (error) {
            console.error(error);
            if(error){
                return res.send({message:"Review notificication hit an error", info: error}).end();
            }
        }
    },
    // When a user is removed from being a collaborator on a board by the admin they recieve an email
    boardColabRemovalNotification: async function(req,res){
        console.log("Removed for board collaborator body:", req.body);
        let { boardInfo } = req.body;
        try {
            if(req.body){
                console.log("Board info exsists")
                
                let transporter = nodemailer.createTransport({
                    host:"smtp-mail.outlook.com",
                    port:587,
                    secureConnection:false,
                    auth: {
                        user:process.env.EMAIL_ADDRESS,
                        pass:process.env.EMAIL_PASSWORD
                    },
                    tls: {
                        ciphers: "SSLv3",
                        rejectUnauthorized: false
                    }
                });
                
                let message = {
                    from: `${boardInfo.admin} & NAWS <${process.env.EMAIL_ADDRESS}>`,
                    to: `${boardInfo.colabName} <${boardInfo.colabEmail}>`,
                    subject: "You have been removed from collaboration status on a NAWS board",
					text: `Admin: ${boardInfo.admin}`,
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                            <title>NAWS</title>
                            ${emailStyle}
                        </head>

                        <body>

                            <div id="header">
                                <div class="mx-auto">
                                    <h1 class="center-text">${boardInfo.admin} removed you from being a collaborator to a NAWS board.</h1>
                                    <h2 class="center-text">You can no longer access this board. Please contact the board admin if this a problem.</h2>
                                </div>
                            </div>
                            
                        </body>

                        <footer>
                            <h3 class="center-text">NAWS 2020</h3>
                        </footer>
                    </html>
                    `,
                };

                transporter.sendMail(message, (err,info) => {
                    console.log("Send message");
                    if(err){
                        console.error(`Trasporter sendMail method hit an error ${err.message}`);
                        return process.exit(1);
                    }
                    console.log("Message Sent  %s", info.messageId);
                    console.log("Preview url: %s", nodemailer.getTestMessageUrl(info));
                });

                return res.send("Review notificication went through").end();
            }
            else console.log("There was an else", req.body.length);
        } catch (error) {
            console.error(error);
            if(error){
                return res.send({message:"Review notificication hit an error", info: error}).end();
            }
        }
    },
    // When a user creates an account this email will be sent giving them backup info.
    newMemberMessage: async function(req,res){
        console.log("New member created:", req.body);
        let { userInfo } = req.body;
        try {
            if(userInfo){
                
                let transporter = nodemailer.createTransport({
                    host:"smtp-mail.outlook.com",
                    port:587,
                    secureConnection:false,
                    auth: {
                        user:process.env.EMAIL_ADDRESS,
                        pass:process.env.EMAIL_PASSWORD
                    },
                    tls: {
                        ciphers: "SSLv3",
                        rejectUnauthorized: false
                    }
                });
                
                let message = {
                    from: `NAWS <${process.env.EMAIL_ADDRESS}>`,
                    to: `${userInfo.name} <${userInfo.email}>`,
                    subject: "Welcome to NAWS!",
					text: `Username: ${userInfo.username}
                    	Password: ${userInfo.password}
                        You will need this is you ever get locked out of your account.
                        `,
                    html: `
                    <!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>NAWS</title>

                                ${emailStyle}
                            </head>

                            <body>

                                <div id="header">
                                    <div class="mx-auto">
                                        <h1 class="center-text">Welcome to NAWS</h1>
                                        <h2 class="center-text">We want to welcome you to the community and say thanks.</h2>
                                    </div>
                                </div>

                                <div id="mainContent">
                                    <div class="mx-auto" id="userInfo">
                                        <h3>Your NAWS user information</h3>
                                        <ul class="listNone">
                                            <li>Username: ${userInfo.username}</li>
                                            <li>Password: ${userInfo.password}</li>
                                        </ul>
                                    </div>
                                </div>
                                
                            </body>

                            <footer>
                                <h3 class="center-text">NAWS 2020</h3>
                            </footer>
                        </html>
                    `,
                };

                transporter.sendMail(message, (err,info) => {
                    if(err){
                        console.error(`Trasporter sendMail method hit an error ${err.message}`);
                        return process.exit(1);
                    }
                    console.log("Message Sent  %s", info.messageId);
                    console.log("Preview url: %s", nodemailer.getTestMessageUrl(info));
                });

                return res.send("Review notificication went through").end();
            }
        } catch (error) {
            console.error(error);
            if(error){
                return res.send({message:"Review notificication hit an error", info: error}).end();
            }
        }
    }
}
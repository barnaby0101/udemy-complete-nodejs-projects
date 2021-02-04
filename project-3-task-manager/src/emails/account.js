const sgMail = require("@sendgrid/mail");
const sendgridAPIKey = process.env.SENDGRID_API_KEY;
const returnAddress = "bathieme@hotmail.com";

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: returnAddress,
        subject: "Welcome to the Task Manager app!",
        text: `Welcome to Task Manager, ${name}. Please let us know what you think!`
    }).then(() => {
		console.log("Subscription email sent successfully");
	}).catch((e) => {
		console.log(e.response.body);
	})
}

const sendCancellationEmail = (email, name) => 
    sgMail.send({
        to: email,
        from: returnAddress,
        subject: "Task Manager Cancellation",
        text: `You have successfully canceled your Task Manager Membership, ${name}.`
    }).then(() => {
		console.log("Cancellation email sent successfully");
	}).catch((e) => {
		console.log(e.response.body);
	})

module.exports = {
    sendWelcomeEmail, 
    sendCancellationEmail
}
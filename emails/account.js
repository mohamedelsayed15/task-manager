const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mo.elsayed621654@gmail.com',
        subject: `Welcome ${name}`,
        text: `Welcome ${name},Thanks for choosing our application`
    })
}
const afterDeletion = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mo.elsayed621654@gmail.com',
        subject: `Task App`,
        text: `We are sorry to hear that you are leaving ${name} ,We would love to know how was your experience. Please send us a feedback ASAP!`
    })
}
module.exports = {
    afterDeletion,
    sendWelcomeEmail
}
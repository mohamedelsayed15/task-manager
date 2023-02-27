const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

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
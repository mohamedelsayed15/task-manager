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
const sendVerificationEmail = (email, name, token) => { 

    sgMail.send({
        to: email,
        from: 'mo.elsayed621654@gmail.com',
        subject: `Task app verification`,
        text: `Hi ${name}!,Please verify your email by clicking the link ${process.env.APP_LINK}verifyMe/${token}`
    })
    console.log(`${process.env.APP_LINK}verifyMe/${token}`)
}
const sendVerificationPassword = (email, name, token) => { 

    sgMail.send({
        to: email,
        from: 'mo.elsayed621654@gmail.com',
        subject: `Task app verification`,
        text: `Hi ${name}!,Please click the link to reset your password ${process.env.APP_LINK}verifyMe/${token}`
    })
    console.log(`${process.env.APP_LINK}verifyMe/${token}`)
}
const afterDeletion = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mo.elsayed621654@gmail.com',
        subject: `Task App`,
        text: `We are sorry to hear that you are leaving ${name} ,We would love to know how was your experience. Please send us a feedback ASAP!`
    })
    console.log(`${process.env.APP_LINK}verifyMe/${token}`)
}

module.exports = {
    afterDeletion,
    sendWelcomeEmail,
    sendVerificationEmail,
    sendVerificationPassword
}
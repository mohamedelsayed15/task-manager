//mail gun for sending emails
var mailgun = require('mailgun-js')({ apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN });

//welcome email
const sendWelcomeEmail = (email, name) => {

    mailgun.messages().send({

        from: 'Mohamed <mo.elsayed621654@gmail.com>',
        to: email,
        subject: `Welcome ${name}`,
        text: `Welcome ${name},Thanks for choosing our application`

    },function (error, body) {
    })
}
//mail after signup
const sendVerificationEmail = (email, name, token) => { 

    mailgun.messages().send({

        from: 'Mohamed <mo.elsayed621654@gmail.com>',
        to: email,
        subject: `Task app verification`,
        text: `Hi ${name}!,Please verify your email by clicking the link ${process.env.APP_LINK}user/verifyMe/${token}`

    },function (error, body) {
    })
    //console.log(`${process.env.APP_LINK}verifyMe/${token}`)
}
//mail after requesting reset password
const sendVerificationPassword = (email, name, token) => { 

    mailgun.messages().send({

        from: 'Mohamed <mo.elsayed621654@gmail.com>',
        to: email,
        subject: `Task app verification`,
        text: `Hi ${name}!,Please click the link to reset your password ${process.env.APP_LINK}user/verifyMe/${token}`

    },function (error, body) {
    })
    //console.log(`${process.env.APP_LINK}verifyMe/${token}`)
}
//mail after an account is deleted
const afterDeletion = (email, name) => {

    mailgun.messages().send({

        from: 'Mohamed <mo.elsayed621654@gmail.com>',
        to: email,
        subject: `Task App`,
        text: `We are sorry to hear that you are leaving ${name} ,We would love to know how was your experience. Please send us a feedback ASAP!`

    },function (error, body) {
    })
}
module.exports = {
    afterDeletion,
    sendWelcomeEmail,
    sendVerificationEmail,
    sendVerificationPassword
}

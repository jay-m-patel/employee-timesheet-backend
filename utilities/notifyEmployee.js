const nodemailer = require("nodemailer")


module.exports =  (emailsArr, title, body) => {
    
    let appEmail =  process.env.appEmail

    let appEmailPassword = process.env.appEmailPassword

    let emailsStr = ""
    emailsArr.forEach(email => {
        return emailsStr = emailsStr + `${email}, `
    })


    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,

        auth: {
        user: appEmail,
        pass: appEmailPassword
        }

    });
    
    let mailOptions = {
        from: appEmail,
        to: emailsStr,
        subject: title,
        html: body
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          console.log(appEmail, typeof(appEmail))
          console.log(appEmailPassword, typeof(appEmailPassword))
          console.log(transporter.options.auth)

        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
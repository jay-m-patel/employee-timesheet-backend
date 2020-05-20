const nodemailer = require("nodemailer")


module.exports =  (email, otp) => {
  
    let appEmail = process.env.appEmail

    let appEmailPassword = process.env.appEmailPassword

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
        to: email,
        subject: "OTP for registering to Employee's Time-sheet",
        html: `
            <h3>OTP = ${otp}</h3>
            <p>OTP will expire after 10 minutes.</p>
        `
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
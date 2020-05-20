const nodemailer = require("nodemailer")



module.exports =  (email, doc) => {
  
    let attendanceDataHTML = `
            <tr>
                <th>Employee</th>
                <th>Tasks</th>
                <th>Hours</th>
            </tr>
    `

    doc.employees.forEach(employee => {
        attendanceDataHTML = attendanceDataHTML + `
            <tr>
                <th>${employee.email}</th>
                <th>${employee.tasks}</th>
                <th>${employee.hours}</th>
            </tr>
        `
    })

    attendanceDataHTML = `<table>${attendanceDataHTML}</table>`





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
        subject: `Attendance of ${doc.month}`,
        html: attendanceDataHTML
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
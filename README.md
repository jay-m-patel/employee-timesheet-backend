# Employee’s Time-sheet
A tool of an employer to maintain work flow of employees.

[Deployed front-end](https://priceless-heyrovsky-99c31c.netlify.app/)

## Explanation of application and its requirement
- This application is specially focused for small scale companies who work on contracts in different physical places (which might be remote). General count of employees is about ten to twenty.
- An employer assigns tasks corresponding to his contracted projects daily. This application aids to announce and get reports on assigned tasks everyday. Manually it is cumbersome to keep and manage all data on daily bases.
- Employees are teamed up as per requirements by the employer. It is not necessary that only one task is assigned to an employee for a day. Number of tasks per employee might be more than one. The team leader shall manage attendances and reportings.
- The application is completely a single page application with JWT authentication. JWT is stored locally in locally in httpOnly cookie as well as in script once loaded from the cookie. Cookie is used to maintain the user ease even when app is loaded first time with a stored cookie; reloaded; a new tab is opened.

### Privacy issues
- There are a number of separate groups of users who will use the app. Each group comprises an employer who assigns tasks and several employees who work on the assigned tasks. 
- One group is never associated with any of the other groups. They never want to share their any details to other groups which might be very general within their own group, as their ways of working might be confidential for others.
- So, it is very necessary to separate each group in all possible ways.
- Data of each company must be private
Employee must be verified before joining a group
		
## Tools used for application
- Node JS, express JS
- MongoDB-mongoose; postgreSQL-seluelize
- Cors
- bcryptjs
- Jsonwebtoken
- Cookie with cookie-parser
- Nodemailer
- Multer
- Datauri
- Cloudinary
- CKeditor 5

## API Endpoints
### ‘/’
    Takes logged in user to dashboard
### ‘/login’
    Login route is the same for both types of users. Employer and employee does not have to worry while logging in about type of route, even if the database has different types of fields for both. User credentials are verified and different json is sent back in response depending upon the type of user. JWT is included in response which will be stored in script of user as well as an httpOnly cookie.
### ‘/register/employer’
    Here, an employer is registering to the application with required body-contents. As his credentials are valid, a new database is created dynamically which corresponds to him and his employees, only(in case of mongoDB). Name of the new database is confirmed as unique compared to existing databases. Also, an OTP is generated for email verification.
### ‘/register/employee’
    Here, an employee cannot register directly without approval of his employer. Also, an OTP is sent to verify the email.
### ‘/verifyEmailByOtp’
    This route is called when an otp is entered by a user to verify.
### ‘/logout’
    While logging out, it is made sure that existing jwt does not authorize any more even if it is not expired.
### ‘/employer/allowEmployee’ &  ‘/employer/rejectEmployee’
    Employer can allow or reject the application of someone to join his group. If he rejects, the applicant will be removed from the database.
### ‘/employer/assignNewTask’
    This route will contain list of team members of employees for the particular task, title and details with images. Details containing images are through CKeditor 5 and easy image uploader. Those images are stored in the cloud of CKeditor 5
### ‘/employer/selectDate’
    Employer can view task with reports from the past dates.
### ‘/employee/addInTime’, /employee/       addOutTime’ & ‘/employee/submitReportImage’
    Team leader for  the corresponding task will add in and out time of each team members, also, will add images as submission. This image will be passed through multer, datauri and stored in cloudinary.

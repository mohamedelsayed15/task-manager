Task Manager API

postman : https://documenter.getpostman.com/view/21060881/2s83ziQQ6L

This is a Task Manager API built using Mongoose, Express, and Node.js. 
The API provides features such as user authentication with JWT, login, sign up,
integration of images for users and for tasks, database relations between tasks and users, 
relationship between user and profile image, relationship between task and task image,
sending emails with Mailgun and Sendgrid, reset password, email verification,
sorting, and pagination. Passwords are hashed to ensure security.

Installation

    Clone the repository
    Run npm install to install the dependencies
    Create a dev.env file in the config directory and add the following environment variables:


    PORT=3000
    SENDGRID_API_KEY=<sendgrind key>
    JWT=
    JWT_VERIFY_ME=
    JWT_VERIFY_ME_FOR_PASSWORD=
    MONGODB_CONNECTION=mongodb://127.0.0.1:27017/task-manger-api
    APP_LINK=https://locahost:3000/
    MG_DOMAIN=<mailgun domain>
    MG_API_KEY=<mailgun key>


    Run npm run dev to start the development server
    Run npm run test to run the tests

To access protected routes, a user must be authenticated by providing a valid Bearer JWT token in the Authorization header. 
The token can be obtained by logging in or signing up.

Endpoints

postman : https://documenter.getpostman.com/view/21060881/2s83ziQQ6L

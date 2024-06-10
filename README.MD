
## Description

"NodeAuthenticator" is a versatile backend project designed to handle various aspects of user management and authentication. It incorporates features such as account creation, login functionality, and profile management. Additionally, NodeAuthenticator seamlessly integrates with cloud services like Cloudinary to enable users to upload and manage their avatar images. With NodeAuthenticator, developers can build robust authentication systems that support image uploads, account creation, and user profile customization, offering a comprehensive solution for web applications requiring user authentication and profile management functionalities

## Features

- User Registration
- User Login
- Profile Management
- Avatar Image Upload
- Password Management
- Access Token Management
- Security Measures
- Error Handling
- Middleware Integration
- Scalability
- Customization


## Technologies Used

- MongoDB
- Express.js
- Node.js
- Cloudinary (if applicable)
- Any other technologies or libraries used in your project.

## Installation

To install and set up the project locally, follow these steps:


1. Install the project dependencies using npm:

    ```bash
    npm install
    ```

2. Set up the MongoDB connection by providing the connection URL in the `.env` file:

    ```plaintext
    MONGODB_URI=<your-mongodb-connection-url>
    ```
3. Start the Node.js server to initialize the project:

    ```bash
    npm start
    ```

4. Once the server is running, you can access the project at http://localhost:8000 


## Usage

To use the project, you can follow these steps:

1. Ensure that the Node.js server is running. If not, start it by running:

    ```bash
    npm run dev
    ```

2. Open Postman or any other API testing tool.

3. Use the provided API endpoints to interact with the project. Here are some example endpoints you can test:

    - Register a new user: `POST /api/v1/users/register`
    - Login: `POST /api/v1/users/login`
    - Update user details: `PATCH /api/v1/users/profile`
    - Upload avatar image: `POST /api/v1/users/avatar`
    - Change password: `PATCH /api/v1/users/password`
    - Refresh access token: `POST /api/v1/users/refresh-token`
    - Logout: `GET /api/v1/users/logout`

4. Send requests to these endpoints with the required parameters (e.g., username, email, password) and review the responses to verify the functionality.

5. You can also explore other endpoints and functionalities provided by the project according to your requirements.

## Configuration

**Dependencies**: Ensure that you have installed the required dependencies listed in your `package.json` file. If not, you can install them using npm:

    ```bash
    npm install
    ```

    Here are the key dependencies used in this project:

    - `bcrypt`: Library for hashing passwords.
    - `cloudinary`: SDK for integrating with the Cloudinary cloud storage service.
    - `cookie-parser`: Middleware for parsing cookies in Express.js.
    - `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.js.
    - `dotenv`: Library for loading environment variables from a `.env` file.
    - `express`: Web framework for Node.js.
    - `jsonwebtoken`: Library for generating and verifying JSON Web Tokens (JWT) for user authentication.
    - `mongoose`: MongoDB object modeling tool for Node.js.
    - `multer`: Middleware for handling file uploads in Express.js.
    - `nodemon`: Utility for automatically restarting the Node.js server during development.



## Folder Structure

pranav-backend2/
│
├── node_modules/                 # Node.js modules installed via npm
│   
│
├── public/                       # Public directory for storing images and videos
│                    
│
├── src/
│   ├── controllers/
│   │   ├── UserController.js    # Controller functions for user-related operations
│   │   
│   │
│   ├── routers/
│   │   ├── userRouter.js        # Router for user-related endpoints
│   │   
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js    # Middleware for user authentication
│   │   ├── multerMiddleware.js  # Middleware for handling file uploads
│   │  
│   │
│   ├── utils/
│   │   ├── ApiResponse.js       # Utility for constructing API responses
│   │   ├── ApiError.js          # Utility for generating API error responses
│   │   ├── cloudinary.js        # Utility for uploading files to Cloudinary
│   │   
│   │
│   ├── app.js                   # Express application configuration
│   ├── index.js                 # Entry point of the application
│   
│
├── package.json                 # Project configuration and dependencies
└── .env                         # Environment configuration file


## User Schema

The `User` schema defines the structure of user documents stored in the MongoDB database. Below is a description of each field in the user schema:

- `username`: Stores the username of the user. It is required, unique, and indexed for efficient querying.
- `email`: Stores the email address of the user. It is required, unique, and indexed for efficient querying.
- `fullname`: Stores the full name of the user. It is required and indexed for efficient querying.
- `password`: Stores the hashed password of the user. It is required for user authentication.
- `refreshtoken`: Stores the refresh token for the user's session. Currently not required.
- `avtar`: Stores the URL of the user's avatar image. It is required.
- `coverimage`: Stores the URL of the user's cover image.
- `whatchhistory`: Stores an array of ObjectIds referencing the videos watched by the user. Each ObjectId refers to a Video document in the database.

The schema also includes timestamps for `createdAt` and `updatedAt` fields to track when the user document was created and last updated.


## auth - middleware

                             +------------------------------------+
                             |         Authentication Middleware  |
                             +------------------------------------+
                             |                                    |
                             | - Verifies access token validity   |
                             | - Attaches user information to     |
    Request with token --->  |   request object                   |
                             +------------------------------------+
                                        |
                                        |
                                        v
                             +------------------------------------+
                             |        Logout User Controller      |
                             +------------------------------------+
                             |                                    |
    Logout Request           | - Clears access and refresh        |
    (POST)                   |   tokens from cookies              |
                             | - Updates user's refresh token     |
                             |   to null in the database          |
                             +------------------------------------+

## multer - middleware 

                             +------------------------------------+
                             |         Multer Middleware          |
                             +------------------------------------+
                             |                                    |
     Request with            | - Handles file uploads using       |
     uploaded file           |   Multer middleware                |
     (POST)                  |                                    |
                             +------------------------------------+
                                        |
                                        |
                                        v
                             +------------------------------------+
                             |   Cloudinary Upload Code           |
                             +------------------------------------+
                             |                                    |
    Uploaded file data       | - Uploads files to Cloudinary      |
    (e.g., image data)       |   cloud storage                    |
    (POST)                   | - Receives file data from Multer   |
                             +------------------------------------+




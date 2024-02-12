**Authentication System Using JSON Web Tokens (JWT)**

This project demonstrates a simple authentication system implemented using JSON Web Tokens (JWT), along with HTML and CSS for user interface design.

### Features:

1. **User Registration**: Users can sign up for an account by providing a unique username and a strong password.

2. **User Authentication**: Registered users can log in using their username and password.

3. **Token-Based Authentication**: JWTs are utilized to authenticate users upon successful login. A token is generated and sent back to the client, which is then used to authenticate subsequent requests to protected routes.

4. **Password Hashing**: Passwords are securely hashed before storing them in the database to enhance security.

### Technologies Used:

- **Node.js**: The server-side environment for running JavaScript code.
- **Express.js**: A web application framework for Node.js, used to build the backend API.
- **JSON Web Tokens (JWT)**: A standard for securely transmitting information between parties as a JSON object.
- **bcrypt**: A library for hashing passwords.
- **HTML/CSS**: Used for the frontend user interface.

### Setup Instructions:

1. **Clone the Repository**:
   ```
   git clone url
   ```

2. **Install Dependencies**:
   ```
   cd authentication-system
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_secret_key_here
   ```

4. **Start the Server**:
   ```
   npm start
   ```

5. **Access the Application**:
   Open your web browser and navigate to `http://localhost:3000` to access the application.

### File Structure:

- **`server.js`**: Entry point for the server application.
- **`routes/auth.js`**: Contains routes for user authentication (login, register).
- **`middleware/authenticate.js`**: Middleware to authenticate JWT tokens.
- **`controllers/authController.js`**: Controller functions for authentication.
- **`models/User.js`**: User model schema for MongoDB.
- **`public/`**: Directory containing frontend HTML and CSS files.
- **`views/`**: Directory containing server-side rendered views (if applicable).

### Contributing:

Contributions are welcome! Feel free to submit bug reports, feature requests, or even pull requests.

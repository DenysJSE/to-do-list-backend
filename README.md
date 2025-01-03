# 🛠️ Backend for To-Do List App

The backend service for the To-Do List App is built to provide a robust and scalable API, enabling seamless task
management, user authentication, and data storage. This service powers the frontend by handling business logic and
database operations.

---

## 🚀 Key Features

- **User Authentication**: Secure user registration, login, and authentication with JWT.
- **Task Management**: CRUD operations for tasks, including prioritization and categorization.
- **Validation & Error Handling**: Comprehensive validation for inputs and detailed error responses.
- **Scalable Architecture**: Designed for modularity and scalability with MVC patterns.
- **Security Measures**: Implemented input sanitization, encrypted passwords, and secure endpoints.

---

## 🌐 API Endpoints

### **Authentication**

| Method | Endpoint             | Description             | Request Body              | Response        |
|--------|----------------------|-------------------------|---------------------------|-----------------|
| POST   | `/auth/register`     | Register a new user     | `{name, email, password}` | `{token, user}` |
| POST   | `/auth/login`        | Log in an existing user | `{email, password}`       | `{token, user}` |
| POST   | `/auth/logout`       | Logout a user           | `{name, email, password}` | `{token, user}` |
| POST   | `/auth/access-token` | Get new tokens          | -                         | `{token, user}` |

### **Categories**

| Method | Endpoint                 | Description                      | Request Body     | Response       |
|--------|--------------------------|----------------------------------|------------------|----------------|
| POST   | `/categories`            | Create a new category            | `{title, color}` | `{category}`   |
| GET    | `/categories/by-id/:id`  | Get category by id               | -                | `{category}`   |
| GET    | `/categories/by-user`    | Get all user categories          | -                | `[categories]` |
| GET    | `/categories/favorite`   | Get all user favorite categories | -                | `[categories]` |
| PUT    | `/categories/:id`        | Update category                  | `{title, color}` | `{category}`   |
| DELETE | `/categories/:id`        | Delete a task                    | -                | `{message}`    |
| PATCH  | `/categories/:id`        | Add category to favorites        | -                | `{message}`    |
| PATCH  | `/categories/remove/:id` | Remove category from favorites   | -                | `{message}`    |

### **Tasks**

| Method | Endpoint                      | Description                    | Request Body                                 | Response     |
|--------|-------------------------------|--------------------------------|----------------------------------------------|--------------|
| POST   | `/tasks`                      | Create a new task              | `{title, description, priority, categoryId}` | `{task}`     |
| GET    | `/tasks/by-id/:id`            | Get task by id                 | -                                            | `{task}`     |
| GET    | `/tasks/by-user`              | Get all user tasks             | -                                            | `[tasks]`    |
| GET    | `/tasks/by-category/:id`      | Get all user tasks by category | -                                            | `[tasks]`    |
| GET    | `/tasks/done-tasks/:id`       | Get done tasks                 | -                                            | `[subtasks]` |
| PATCH  | `/tasks/complete-task/:id`    | Mark task as done              | -                                            | `{message}`  |
| PATCH  | `/tasks/uncomplete-task/:id`  | Mark task as undone            | -                                            | `{message}`  |
| PUT    | `/tasks/:id`                  | Update task                    | `{title, description, priority, categoryId}` | `{task}`     |
| DELETE | `/tasks/:id`                  | Delete a task                  | -                                            | `{message}`  |
| POST   | `/tasks/create-subtask`       | Create a new subtask           | `{title, taskId}`                            | `{subtask}`  |
| GET    | `/tasks/subtask-by-task/:id`  | Get subtask by task            | -                                            | `[subtasks]` |
| PUT    | `/tasks/subtask/:id`          | Update a subtask               | `{title, taskId}`                            | `{task}`     |
| DELETE | `/tasks/subtask/:id`          | Delete a subtask               | -                                            | `{message}`  |
| PATCH  | `/tasks/complete-subtask/:id` | Mark subtask ad done           | -                                            | `{message}`  |
| PATCH  | `/tasks/incomplete-task/:id`  | Mark subtask ad undone         | -                                            | `{message}`  |

---

## ⚙️ Core Functionalities

### **Authentication**

- User passwords are hashed with `bcrypt` for security.
- JWTs are issued upon login/registration for secure session management.
- Middleware ensures protected routes are only accessible by authenticated users.

### **Task Management**

- Supports categorization, prioritization, and status updates for tasks.
- Supports subtasks creation and status updates.

### **Category Management**

- Supports saving category to favorite.

### **Validation**

- Error messages are detailed and consistent for easier debugging.

---
## 📦 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/DenysJSE/to-do-list-backend
   ```
2. Install dependencies:
   ```bash
   npm install 
   ```
3. Create a .env file with the following variables:
   ```bash
    PORT="7777"
    CLIENT_URL = 'http://localhost:3000/'
    API_DOMAIN="localhost"
    
    DATABASE_URL="postgresql://postgres:1111@localhost:5432/to-do-list?schema=public"
    
    JWT_SECRET="secret"
    
    EXPIRE_DAY_REFRESH_TOKEN="60"
    REFRESH_TOKEN_NAME = 'refreshToken'
   ```
4. Start the app:
   ```bash
   npm run start: dev
   ```

## 🛡️ Security Features

- Passwords hashed with `bcrypt` before storage.
- Routes protected with JWT authentication middleware.
- Input validation and sanitization to prevent injection attacks.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
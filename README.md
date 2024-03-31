# Employee Management System

Welcome to the Employee Management App, an Angular-based application designed for efficiently managing employee data. This application leverages GraphQL for seamless data fetching and provides a user-friendly interface for performing various employee-related operations.

## Features

- **User Authentication:** Secure login and signup functionality.
- **Employee Management:** Add, view, update, and delete employee records.
- **Session Management:** Uses local storage for session persistence.
- **Responsive Design:** Adaptable UI for different screen sizes.

## Getting Started

To run this application locally, follow these steps:

### Prerequisites

- Node.js
- MongoDB
- Angular CLI

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/alialoraebi/101386021_comp3133_assig2
```

2. **Navigate to the Project Directory**

cd 101386021_comp3133_assig2

3. **Install Dependencies**

```bash
npm install
```

### Setting Up Environment Variables

Create a `.env` file in the project root. Add the following environment variables:

```bash
PASSWORD=<Your MongoDB Password>
JWT_SECRET=<Your JWT Secret>
```
To generate a JWT secret, you can use the terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Replace `<Your MongoDB Password>` and `<Your JWT Secret>` with your actual MongoDB password and the generated JWT secret.

### Running the Application

**Start the Angular Server**

```bash
ng serve
```
or
```bash
 ng serve --open
```

### Access the Application

Open your browser and navigate to `http://localhost:4200`.

## Deployment

The application is designed to be deployable on platforms like Heroku, Vercel, or Cyclic. Please refer to the respective documentation of these platforms for deployment instructions.
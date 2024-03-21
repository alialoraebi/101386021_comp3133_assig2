require('dotenv').config();
const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const serverless = require('serverless-http');
const {buildSchema} = require('graphql');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const userModel = require('./models/user');
const Employee = require('./models/employee');

// MongoDB Connection
const DB_HOST = "cluster0.z7sm5qd.mongodb.net";
const DB_USER = "aaloreabi2000";
const DB_PASSWORD = process.env.PASSWORD;
const DB_NAME = "comp3133_assignment2";
const DB_CONNECTION_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(DB_CONNECTION_STRING).then(() => {
    console.log('Success Mongodb connection');
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });


// GraphQL schema
const schema = buildSchema(`
    type Query {
        login(username: String!, password: String!): LoginResponse
        getEmployee(id: ID!): Employee
        listEmployees: [Employee]
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): SignUpResponse
        deleteUser(id: ID!): String
        addEmployee(first_name: String!, last_name: String!, email: String!, gender: String!, salary: Float!): Employee
        updateEmployee(id: ID!, first_name: String, last_name: String, email: String, gender: String, salary: Float): Employee
        deleteEmployee(id: ID!): String
    }

    type SignUpResponse {
        message: String!
        user: User
    }

    type LoginResponse {
        message: String!
        user: User
    }
    
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
    }

    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String
        salary: Float!
    }
`);

// Root resolver
const root = {
    signup: async ({ username, email, password }) => {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ username, email, password: hashedPassword });
        await newUser.save();

        return { 
            message: 'User account created successfully',
            user: newUser
        };
    },

    login: async ({ username, password }) => {
        try {
            const user = await userModel.findOne({ username });

            if (!user) {
                throw new Error("User not found");
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new Error("Invalid password");
            }

            return { message: "Login successful" };
        } catch (error) {
            throw new Error(error.message || "An error occurred during login.");
        }
    },

    deleteUser: async ({ id }) => {
        try {
            const user = await userModel.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            await userModel.deleteOne({ _id: id });
            return 'User deleted successfully';
        } catch (err) {
            throw new Error(err.message || 'An error occurred while deleting user.');
        }
    },

    getEmployee: async ({ id }) => {
        // Logic to retrieve an employee by id
        try{
            const employee = await Employee.findById(id);
            return employee;
        }catch(err){
            throw new Error(err.message || "An error occurred while retrieving employee.");
        }
    },

    listEmployees: async () => {
        // Logic to list all employees
        try{
            const employees = await Employee.find();
            return employees;
        }catch(err){
            throw new Error(err.message || "An error occurred while retrieving employees.");
        }
    },

    addEmployee: async ({ first_name, last_name, email, gender, salary }) => {
        try{
            const employee = new Employee({ first_name, last_name, email, gender, salary });
            await employee.save();
            return employee;
        }catch(err){
            throw new Error(err.message || "An error occurred while adding employee.");
        }
    },

    updateEmployee: async ({ id, first_name, last_name, email, gender, salary }) => {
        try{
            const employee = await Employee.findById(id);
            if(!employee){
                throw new Error("Employee not found");
            }
            if(first_name) employee.first_name = first_name;
            if(last_name) employee.last_name = last_name;
            if(email) employee.email = emaill;
            if(gender) employee.gender = gender;
            if(salary) employee.salary = salary;
            await employee.save();
            return employee;
        }catch(err){
            throw new Error(err.message || "An error occurred while updating employee.");
        }
    },

    deleteEmployee: async ({ id }) => {
        try{
            await Employee.findByIdAndDelete(id);
            return "Employee deleted successfully";
        }catch(err){
            throw new Error(err.message || "An error occurred while deleting employee.");
        }
    }
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root, 
    graphiql: true 
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On http://localhost:4000/graphql'));

module.exports = serverless(app);
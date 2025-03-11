const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

const counterSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    counter: {
        type: Number,
        required: true
    }
});

const EmployeeCounter = mongoose.model('EmployeeCounter', counterSchema);


module.exports = { Employee, EmployeeCounter };

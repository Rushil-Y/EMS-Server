const { Employee, EmployeeCounter } = require('./EmployeeModel');
const moment = require('moment');

const resolvers = {
  Query: {
    allEmployees: async () => {
      try {
        const employees = await Employee.find();
        return employees;
      } catch (error) {
        console.error("Error fetching employees:", error);
        return [];
      }
    },
    employeeDetails: async (parent, args) => {
      try {
        const employee = await Employee.findOne({ id: args.id });
        if (!employee) return null;

        const retirementAge = 65;
        const currentAge = parseInt(employee.age, 10);
        const yearsUntilRetirement = retirementAge - currentAge;
        const retirementDate = moment().add(yearsUntilRetirement, 'years').endOf('year');

        const now = moment();
        const yearsLeft = retirementDate.diff(now, 'years');
        const monthsLeft = retirementDate.diff(now, 'months') % 12;
        const daysLeft = retirementDate.diff(now, 'days') % 30;

        return {
          ...employee._doc,
          retirementDate: retirementDate.format('YYYY-MM-DD'),
          yearsLeft,
          monthsLeft,
          daysLeft,
        };
      } catch (error) {
        console.error("Error fetching employee details:", error);
        return null;
      }
    },
  },
  Mutation: {
    insertEmployee: async (parent, args) => {
      try {
        const counter = await EmployeeCounter.findOneAndUpdate(
          { id: 'employeeId' },
          { $inc: { counter: 1 } },
          { new: true, upsert: true }
        );

        const employee = new Employee({
          id: counter.counter,
          ...args
        });

        return await employee.save();
      } catch (error) {
        console.error("Error inserting employee:", error);
        return null;
      }
    },
    updateEmployee: async (parent, args) => {
      try {
        const { id, ...updates } = args;
        return await Employee.findOneAndUpdate({ id }, updates, { new: true });
      } catch (error) {
        console.error("Error updating employee:", error);
        return null;
      }
    },
    deleteEmployee: async (parent, args) => {
      try {
        const employee = await Employee.findOne({ id: args.id });
        if (!employee) {
          return { error: "Employee not found.", employees: [] };
        }

        if (employee.status === 1) {
          return { error: "CAN’T DELETE EMPLOYEE – STATUS ACTIVE", employees: [] };
        }

        await Employee.findOneAndDelete({ id: args.id });
        const remainingEmployees = await Employee.find();
        return { error: null, employees: remainingEmployees };
      } catch (error) {
        console.error("Error deleting employee:", error);
        return { error: error.message, employees: [] };
      }
    },
  },
};

module.exports = resolvers;

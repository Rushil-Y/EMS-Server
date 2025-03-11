const typeDefs = `#graphql
  type Employee {
    id: Int!
    firstName: String!
    lastName: String!
    age: Int!
    date: String!
    title: String!
    department: String!
    type: String!
    status: Int!
    retirementDate: String
    yearsLeft: Int
    monthsLeft: Int
    daysLeft: Int
  }

  type DeleteEmployeeResponse {
    error: String
    employees: [Employee!]
  }

  type Query {
    allEmployees: [Employee!]!
    employeeDetails(id: Int!): Employee!
  }

  type Mutation {
    insertEmployee(
      firstName: String!
      lastName: String!
      age: Int!
      date: String!
      title: String!
      department: String!
      type: String!
      status: Int!
    ): Employee!

    updateEmployee(
      id: Int!
      firstName: String
      lastName: String
      age: Int
      date: String
      title: String
      department: String
      type: String
      status: Int
    ): Employee!

    deleteEmployee(id: Int!): DeleteEmployeeResponse!
  }
`;

module.exports = typeDefs;

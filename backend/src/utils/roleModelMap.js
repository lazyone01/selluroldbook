const User = require("../models/User");
const Bookseller = require("../models/Bookseller");
const Admin = require("../models/Admin");

const modelMap = {
  user: User,
  bookseller: Bookseller,
  admin: Admin,
};

const getModelByRole = (role) => modelMap[role];

module.exports = {
  getModelByRole,
};

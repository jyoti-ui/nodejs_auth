const User = require("./modal");
const { hashData, verifyHashedData } = require("../util/hashData");
const createToken = require("../util/createToken");

const createNewUser = async (data) => {
  try {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw Error("User already exists");
    }

    const hashedPassword = await hashData(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();
    return createdUser;
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (data) => {
  try {
    const { email, password } = data;
    const fetchUser = await User.findOne({ email });

    if (!fetchUser) {
      throw Error("Email not registered.");
    }

    const hashedPassword = fetchUser.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);

    if (!passwordMatch) {
      throw Error("Invalid password match");
    }

    const tokenData = { userId : fetchUser._id, email}
    const token = await createToken(tokenData);
    fetchUser.token = token;

    return fetchUser;
  } catch (error) {
    throw error;
  }
};

module.exports = { createNewUser, authenticateUser};

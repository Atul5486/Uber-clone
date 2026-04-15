const blacklistTokenModel = require("../model/blacklistToken.model");
const captainModel = require("../model/captain.model");
const { createCaptain } = require("../service/captain.service");
const { validationResult } = require("express-validator");
module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { fullname, email, password, vehical } = req.body;

  const isCaptainExist = await captainModel.findOne({ email });

  if (isCaptainExist) {
    return res.status(400).json({ message: "email already exist" });
  }

  const isVehicalExist = await captainModel.findOne({
    "vehical.plate": vehical.plate,
  });

  if (isVehicalExist) {
    return res.status(400).json({ message: "Vehical already exist" });
  }

  const hashPassword = await captainModel.hashPassword(password);

  const captain = await createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
    color: vehical.color,
    plate: vehical.plate,
    capacity: vehical.capacity,
    vehicalType: vehical.vehicalType,
  });
  const token = captain.generateAuthToken();
  res.status(201).json({ token, captain });
};
module.exports.loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await captain.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = captain.generateAuthToken();

    res.cookie("token", token);
    res.status(200).json({ token, captain });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getCaptainProfile = async (req, res, next) => {
  const { captain } = req;
  const { token } = req.cookies;
  res.status(200).json({ token, captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  res.clearCookie("token");

  await blacklistTokenModel.create({ token });
  res.status(200).json({ message: "logout successfuly" });
};

const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      req.body.email,
    ]);
    if (rows.length) {
      return res.status(400).json({ status: "error", msg: "duplicated email" });
    }

    const hash = await bcrypt.hash(req.body.password, 12);
    await db.query("INSERT INTO users(name, email, hash) VALUES($1, $2, $3)", [
      req.body.name,
      req.body.email,
      hash,
    ]);
    res.json({ status: "ok", msg: "user registered" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error registering user" });
  }
};

const login = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email= $1", [
      req.body.email,
    ]);
    if (!rows.length) {
      return res.status(401).json({ status: "error", msg: "not authorised" });
    }
    const verifyPw = await bcrypt.compare(req.body.password, rows[0].hash);
    if (!verifyPw) {
      console.error("email or password error");
      return res.status(401).json({ status: "error", msg: "login failed" });
    }

    const claims = {
      uuid: rows[0].uuid,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "120m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "user error logging in" });
  }
};

module.exports = { register, login };

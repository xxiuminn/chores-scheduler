const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const getUsers = async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM users");
    console.log(users);
    res.json(users.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting users" });
  }
};

const seedUsers = async (req, res) => {
  try {
    await db.query("DELETE FROM users");
    const hash1 = await bcrypt.hash("jasminepw123", 12);
    const hash2 = await bcrypt.hash("alexpw123", 12);
    const hash3 = await bcrypt.hash("marypw123", 12);
    const users = await db.query(
      "INSERT INTO users(name, email, hash) VALUES($1, $2, $3 ),($4, $5, $6), ($7, $8, $9)",
      [
        "Jasmine",
        "jasmine@gmail.com",
        hash1,
        "Alex",
        "alex@gmail.com",
        hash2,
        "Mary",
        "mary@gmail.com",
        hash3,
      ]
    );
    console.log(users);
    res.json({ status: "ok", msg: "users seeded successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error seeding users" });
  }
};

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
    console.log(rows);
    if (!rows.length) {
      return res.status(401).json({ status: "error", msg: "not authorised" });
    }
    const verifyPw = await bcrypt.compare(req.body.password, rows[0].hash);
    if (!verifyPw) {
      console.error("email or password error");
      return res.status(401).json({ status: "error", msg: "login failed" });
    }

    const claims = {
      name: rows[0].name,
      email: rows[0].email,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
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

module.exports = { getUsers, seedUsers, register, login };

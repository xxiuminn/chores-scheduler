const jwt = require("jsonwebtoken");
const db = require("../db/db");

const auth = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "token required" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      // console.log(decoded);
      req.decoded = decoded;
      // console.log(req);
      next();
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "not authorised" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "forbidden" });
  }
};

const authFree = async (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "token required" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      // get user data
      const user = await db.query(
        "SELECT group_id, membership FROM users WHERE uuid=$1",
        [decoded.uuid]
      );
      console.log(user.rows[0].group_id);
      console.log(user.rows[0].membership);
      if (user.rows[0].group_id && user.rows[0].membership === "ACTIVE") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error.message);
      return res.status(403).json({ status: "error", msg: "not authorised" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "forbidden" });
  }
};

const authPaid = async (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "token required" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      // get user data
      const user = await db.query(
        "SELECT users.group_id, users.membership, user_groups.account_type FROM users INNER JOIN user_groups ON users.group_id = user_groups.id WHERE uuid = $1",
        [decoded.uuid]
      );
      console.log(user.rows[0].group_id);
      console.log(user.rows[0].membership);
      console.log(user.rows[0].account_type);
      if (
        user.rows[0].group_id &&
        user.rows[0].membership === "ACTIVE" &&
        user.rows[0].account_type === "PAID"
      ) {
        req.decoded = decoded;
        next();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error.message);
      return res.status(403).json({ status: "error", msg: "not authorised" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "forbidden" });
  }
};

module.exports = { auth, authFree, authPaid };

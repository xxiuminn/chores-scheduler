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
      console.log(decoded);
      req.decoded = decoded;
      console.log(req);
      next();
    } catch (error) {
      console.error(error.message);
      return res.status(401).json({ status: "error", msg: "not authorised" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "forbidden" });
  }
};

const authFree = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "token required" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      console.log(decoded);
      if (decoded.group_id && decoded.membership === "ACTIVE") {
        console.log("yes");
        req.decoded = decoded;
        console.log(decoded.group_id, decoded.membership);
        console.log(token);
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
      const accountTypeArr = await db.query(
        "SELECT account_type FROM user_groups WHERE id=$1",
        [decoded.group_id]
      );
      const accountType = accountTypeArr.rows[0].account_type;
      if (
        decoded.group_id &&
        decoded.membership === "ACTIVE" &&
        accountType === "PAID"
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

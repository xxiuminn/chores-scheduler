const db = require("../db/db");

const seedAccountTypes = async (req, res) => {
  try {
    await db.query("DELETE FROM accounts");
    const accountTypes = await db.query(
      "INSERT INTO accounts(types) VALUES($1), ($2)",
      ["FREE", "PAID"]
    );
    console.log(accountTypes);
    res.json({ status: "ok", msg: "account types seeded" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error seeding account type" });
  }
};

// const seedUserGroups = async (req, res) => {
//   try {
//   } catch (error) {
//     console.error(error.message);
//     res.status(400).json({ status: "error", msg: "error seeding user groups" });
//   }
// };

const createUserGroup = async (req, res) => {
  try {
    await db.query(
      "INSERT INTO user_groups(name, account_type) VALUES($1,$2)",
      [req.body.usergroup_name, req.body.account_type]
    );
    res.json({ status: "ok", msg: "user group created" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error creating user group" });
  }
};

const updateAccountType = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM user_groups WHERE id=$1", [
      req.body.usergroup_id,
    ]);

    if (!rows.length) {
      return res
        .status(400)
        .json({ status: "error", msg: "user group id not valid" });
    }

    await db.query("UPDATE user_groups SET account_type=$1 WHERE id=$2", [
      req.body.account_type,
      req.body.usergroup_id,
    ]);
    res.json({ status: "ok", msg: "account type updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error updating user group" });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const members = await db.query("SELECT * FROM users WHERE group_id = $1", [
      req.body.usergroup_id,
    ]);
    res.json(members.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error getting group members" });
  }
};

module.exports = {
  seedAccountTypes,
  createUserGroup,
  updateAccountType,
  getGroupMembers,
};

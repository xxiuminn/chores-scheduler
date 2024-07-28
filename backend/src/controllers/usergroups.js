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
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const userGroup = await client.query(
      "INSERT INTO user_groups(name, account_type) VALUES($1,$2) RETURNING id",
      [req.body.usergroup_name, req.body.account_type]
    );

    console.log(userGroup);
    const userGroupId = userGroup.rows[0].id;

    console.log(userGroupId);

    await client.query(
      "UPDATE users SET group_id=$1, membership='ACTIVE' WHERE uuid=$2",
      [userGroupId, req.body.uuid]
    );
    await client.query("COMMIT");
    res.json({ status: "ok", msg: "user group created" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error creating user group" });
  } finally {
    client.release();
  }
};

const updateAccountType = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM user_groups WHERE id=$1",
      [req.body.usergroup_id]
    );

    if (!rows.length) {
      return res
        .status(400)
        .json({ status: "error", msg: "user group id not valid" });
    }

    await client.query("UPDATE user_groups SET account_type=$1 WHERE id=$2", [
      req.body.account_type,
      req.body.usergroup_id,
    ]);
    await client.query("COMMIT");
    res.json({ status: "ok", msg: "account type updated" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error updating user group" });
  } finally {
    client.release();
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const { usergroup_id, membership } = req.body;
    const members = await db.query(
      "SELECT * FROM users WHERE (group_id = $1 AND membership = $2)",
      [usergroup_id, membership]
    );

    if (!members.rows.length) {
      return res.status(400).json({ status: "error", msg: "not found" });
    }
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

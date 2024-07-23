const db = require("../db/db");

const seedTasks = async (req, res) => {
  try {
    await db.query("DELETE FROM tasks");
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error seeding tasks" });
  }
};

const createTaskGroup = async (req, res) => {
  try {
    const members = await db.query(
      "SELECT uuid FROM users WHERE group_id = $1",
      [req.body.group_id]
    );
    console.log(members.rows);
    const numMembers = members.rowCount;
    let memberIndex = members.rows.findIndex(
      (element) => element.uuid === req.body.assigned_user
    );
    console.log(memberIndex);
    // if task group is set to non recurring:
    if (req.body.is_recurring === 0) {
      await db.query("INSERT INTO task_groups(is_recurring) VALUES($1)", [
        Boolean(req.body.is_recurring),
      ]);

      const taskGroup = await db.query("SELECT * FROM task_groups");
      const { rows } = taskGroup;
      const taskGroupId = rows[rows.length - 1].id;

      await db.query(
        "INSERT INTO tasks(title, deadline, assigned_user, created_by, group_id) VALUES($1,$2,$3,$4,$5)",
        [
          req.body.title,
          req.body.deadline,
          req.body.assigned_user,
          req.body.created_by,
          taskGroupId,
        ]
      );
    }

    // if task group is set to recurring & no rotation
    else if (req.body.is_recurring === 1) {
      //create task group
      await db.query(
        "INSERT INTO task_groups(is_recurring, is_rotate, rule) VALUES($1,$2,$3)",
        [
          Boolean(req.body.is_recurring),
          Boolean(req.body.is_rotate),
          req.body.rule,
        ]
      );

      //identify task group id
      const taskGroup = await db.query("SELECT * FROM task_groups");
      const { rows } = taskGroup;
      const taskGroupId = rows[rows.length - 1].id;
      let r;
      if (req.body.rule === "DAILY") {
        r = 365;
      } else if (req.body.rule === "WEEKLY") {
        r = 52;
      }
      let step = Math.floor(365 / r);

      for (let n = 0; n < 365; n += step) {
        let deadline = new Date(req.body.deadline);
        deadline.setDate(deadline.getDate() + n);

        if (req.body.is_rotate === 0) {
          await db.query(
            "INSERT INTO tasks(title, deadline, assigned_user, created_by, group_id) VALUES($1, $2, $3, $4, $5)",
            [
              req.body.title,
              deadline.toLocaleDateString(),
              req.body.assigned_user,
              req.body.created_by,
              taskGroupId,
            ]
          );

          //if task group is set to recurring with rotation
        } else if (req.body.is_rotate === 1) {
          if (memberIndex === numMembers) {
            memberIndex = 0;
          }
          console.log(memberIndex);
          console.log(members.rows[memberIndex].uuid);
          await db.query(
            "INSERT INTO tasks(title, deadline, assigned_user, created_by, group_id) VALUES($1, $2, $3, $4, $5)",
            [
              req.body.title,
              deadline.toLocaleDateString(),
              members.rows[memberIndex].uuid,
              req.body.created_by,
              taskGroupId,
            ]
          );
          memberIndex += 1;
        }
      }
    }
    res.json({ status: "ok", msg: "task group created" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error creating task" });
  }
};

module.exports = { seedTasks, createTaskGroup };

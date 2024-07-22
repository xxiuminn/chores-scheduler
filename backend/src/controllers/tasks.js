const db = require("../db/db");

const seedTasks = async (req, res) => {
  try {
    await db.query("DELETE FROM tasks");
  } catch {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error seeding tasks" });
  }
};

const createTaskGroup = async (req, res) => {
  try {
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
    // else if(req.body.is_recurring === 1 && req.body.is_rotate === 0){
    //   for(let i=0; i<365; i++){

    //   }

    // }
    res.json({ status: "ok", msg: "task group created" });
  } catch {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error creating task" });
  }
};

module.exports = { seedTasks, createTaskGroup };

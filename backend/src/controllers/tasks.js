const db = require("../db/db");

const createTaskGroup = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // get user data
    const user = await client.query(
      "SELECT group_id FROM users WHERE uuid = $1",
      [req.decoded.uuid]
    );

    const usergroupId = user.rows[0].group_id;

    //for member rotation
    const members = await client.query(
      "SELECT uuid FROM users WHERE group_id = $1",
      [usergroupId]
    );

    const numMembers = members.rowCount;
    let memberIndex = members.rows.findIndex(
      (element) => element.uuid === req.body.assigned_user
    );

    //check if usergroup account is paid or free
    const accountTypeArr = await client.query(
      "SELECT account_type FROM user_groups WHERE id=$1",
      [usergroupId]
    );

    const accountType = accountTypeArr.rows[0].account_type;
    // console.log(accountType);
    // console.log(accountTypeArr);

    // if task group is set to non recurring:
    if (req.body.is_recurring === 0) {
      const taskGroup = await client.query(
        "INSERT INTO task_groups(is_recurring) VALUES($1) RETURNING id",
        [Boolean(req.body.is_recurring)]
      );

      const { rows } = taskGroup;
      const taskGroupId = rows[0].id;

      await client.query(
        "INSERT INTO tasks(title, deadline, assigned_user, created_by, group_id) VALUES($1,$2,$3,$4,$5)",
        [
          req.body.title,
          req.body.deadline,
          req.body.assigned_user,
          req.decoded.uuid,
          taskGroupId,
        ]
      );
    }

    // if task group is set to recurring & no rotation + check if paid account
    else if (req.body.is_recurring === 1 && accountType === "PAID") {
      //create task group
      const taskGroup = await client.query(
        "INSERT INTO task_groups(is_recurring, is_rotate, rule) VALUES($1,$2,$3) RETURNING id",
        [
          Boolean(req.body.is_recurring),
          Boolean(req.body.is_rotate),
          req.body.rule,
        ]
      );

      //identify task group id
      const { rows } = taskGroup;
      const taskGroupId = rows[0].id;
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
          await client.query(
            "INSERT INTO tasks(title, deadline, assigned_user, created_by, group_id) VALUES($1, $2, $3, $4, $5)",
            [
              req.body.title,
              deadline.toLocaleDateString(),
              req.body.assigned_user,
              req.decoded.uuid,
              taskGroupId,
            ]
          );

          //if task group is set to recurring with rotation
        } else if (req.body.is_rotate === 1) {
          if (memberIndex === numMembers) {
            memberIndex = 0;
          }
          await client.query(
            "INSERT INTO tasks(title, deadline, assigned_user, created_by, group_id) VALUES($1, $2, $3, $4, $5)",
            [
              req.body.title,
              deadline.toLocaleDateString(),
              members.rows[memberIndex].uuid,
              req.decoded.uuid,
              taskGroupId,
            ]
          );
          memberIndex += 1;
        } else
          return res
            .status(403)
            .json({ status: "error", msg: "not authorised" });
      }
    } else {
      return res.status(403).json({ status: "error", msg: "not authorised" });
    }
    res.json({ status: "ok", msg: "task group created" });
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error creating task" });
  } finally {
    client.release();
  }
};

const getTasksByUserGroup = async (req, res) => {
  try {
    const tasks = await db.query(
      "SELECT users.group_id, users.name, tasks.id, tasks.title, tasks.deadline, tasks.status, tasks.assigned_user, tasks.group_id FROM users INNER JOIN tasks ON tasks.assigned_user = users.uuid WHERE users.group_id = $1 ORDER BY tasks.status DESC",
      [req.body.usergroup_id]
    );
    res.json(tasks.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error getting tasks by user group" });
  }
};

const getTasksByUser = async (req, res) => {
  try {
    const tasks = await db.query(
      "SELECT * FROM tasks WHERE assigned_user = $1",
      [req.body.assigned_user]
    );

    res.json(tasks.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error getting tasks by user" });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await db.query(
      "SELECT tasks.id, tasks.title, tasks.deadline, tasks.assigned_user, tasks.created_by, tasks.status, tasks.modified_at, tasks.last_modified_by, task_groups.is_recurring, task_groups.is_rotate, task_groups.rule FROM tasks INNER JOIN task_groups ON tasks.group_id = task_groups.id WHERE tasks.id = $1",
      [req.params.task_id]
    );

    if (!task.rows.length) {
      return res.json({ status: "error", msg: "task not found" });
    }

    res.json(task.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting task by id" });
  }
};

const delTask = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const taskGroup = await client.query(
      "SELECT group_id FROM tasks WHERE id=$1",
      [req.body.task_id]
    );

    const groupTaskId = taskGroup.rows[0].group_id;

    const task = await client.query("SELECT * FROM tasks WHERE group_id=$1", [
      groupTaskId,
    ]);

    if (!task.rows.length) {
      return res
        .status(400)
        .json({ status: "error", msg: "task cannot be found" });
    }

    if (task.rows.length === 1) {
      await client.query("DELETE FROM tasks WHERE group_id = $1", [
        groupTaskId,
      ]);
      await client.query("DELETE FROM task_groups WHERE id = $1", [
        groupTaskId,
      ]);
    } else
      await client.query("DELETE FROM tasks WHERE id=$1", [req.body.task_id]);

    await client.query("COMMIT");
    res.json({ status: "ok", msg: "task deleted" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error deleting task" });
  } finally {
    client.release();
  }
};

const delAllTasks = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const task = await client.query("SELECT group_id FROM tasks WHERE id=$1", [
      req.body.task_id,
    ]);

    if (!task.rows.length) {
      return res
        .status(400)
        .json({ status: "error", msg: "task cannot be found" });
    }

    const groupTaskId = task.rows[0].group_id;

    await client.query("DELETE FROM tasks WHERE group_id = $1", [groupTaskId]);

    await client.query("DELETE FROM task_groups WHERE id = $1", [groupTaskId]);

    await client.query("COMMIT");
    res.json({ status: "ok", msg: "deleted all tasks" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error deleting all tasks in group" });
  } finally {
    client.release();
  }
};

const delFollowingTasks = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const task = await client.query(
      "SELECT group_id, deadline FROM tasks WHERE id=$1",
      [req.body.task_id]
    );

    if (!task.rows.length) {
      return res
        .status(400)
        .json({ status: "error", msg: "task cannot be found" });
    }

    await client.query(
      "DELETE FROM tasks WHERE group_id = $1 AND deadline >= $2",
      [task.rows[0].group_id, task.rows[0].deadline]
    );

    await client.query("COMMIT");
    res.json({ status: "ok", msg: "following tasks deleted" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error deleting subsequent tasks" });
  } finally {
    client.release();
  }
};

const updateTask = async (req, res) => {
  try {
    const { task_id, title, deadline, status, assigned_user } = req.body;

    const task = await db.query("SELECT * FROM tasks WHERE id=$1", [task_id]);

    if (!task.rows.length) {
      return res.status(400).json({ status: "error", msg: "task not found" });
    }

    const taskInfo = task.rows[0];

    const updated = {
      title: title === (undefined || taskInfo.title) ? taskInfo.title : title,
      deadline:
        deadline === (undefined || taskInfo.deadline)
          ? taskInfo.deadline
          : deadline,
      modified_at: new Date(),
      status:
        status === (undefined || taskInfo.status) ? taskInfo.status : status,
      last_modified_by: req.decoded.uuid,
      assigned_user:
        assigned_user === (undefined || taskInfo.assigned_user)
          ? taskInfo.assigned_user
          : assigned_user,
    };

    await db.query(
      "UPDATE tasks set title=$1, deadline=$2, modified_at=$3, status=$4,  assigned_user=$5 WHERE id=$6",
      [
        updated.title,
        updated.deadline,
        updated.modified_at,
        updated.status,
        updated.assigned_user,
        task_id,
      ]
    );
    res.json({ status: "ok", msg: "task updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error updating task" });
  }
};

const updateAllTasks = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const { task_id, title, deadline, status, assigned_user } = req.body;

    const task = await client.query(
      "SELECT tasks.id, tasks.title, tasks.deadline, tasks.modified_at, tasks.status, tasks.last_modified_by, tasks.assigned_user, tasks.group_id, task_groups.is_recurring, task_groups.is_rotate, task_groups.rule FROM tasks INNER JOIN task_groups ON tasks.group_id = task_groups.id WHERE tasks.id=$1",
      [task_id]
    );

    if (task.rows[0].is_recurring === false) {
      return res
        .status(400)
        .json({ status: "error", msg: "non-recurring task" });
    }

    const tasks = await client.query("SELECT * FROM tasks WHERE group_id=$1", [
      task.rows[0].group_id,
    ]);

    const taskArr = tasks.rows;

    const ogDeadline = task.rows[0].deadline;
    const addNum = new Date(deadline) - ogDeadline;
    const addNumInDays = Math.floor(addNum / (1000 * 60 * 60 * 24));

    for (let i = 0; i < taskArr.length; i++) {
      const newDeadline = () => {
        let newDate = taskArr[i].deadline;
        newDate.setDate(newDate.getDate() + addNumInDays);
        return newDate.toLocaleDateString();
      };

      const updated = {
        title: title === undefined ? taskArr[i].title : title,
        deadline: deadline === undefined ? taskArr[i].deadline : newDeadline(),
        modified_at: new Date(),
        status: status === undefined ? taskArr[i].status : status,
        assigned_user:
          assigned_user === undefined
            ? taskArr[i].assigned_user
            : assigned_user,
      };

      await client.query(
        "UPDATE tasks set title=$1, deadline=$2, modified_at=$3, status=$4,  assigned_user=$5 WHERE id=$6",
        [
          updated.title,
          updated.deadline,
          updated.modified_at,
          updated.status,
          updated.assigned_user,
          taskArr[i].id,
        ]
      );
    }
    await client.query("COMMIT");
    res.json({ status: "ok", msg: "all tasks updated" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error updating all tasks" });
  } finally {
    client.release();
  }
};

const updateFollowingTasks = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const { task_id, title, deadline, modified_at, status, assigned_user } =
      req.body;

    const task = await client.query(
      "SELECT tasks.id, tasks.title, tasks.deadline, tasks.modified_at, tasks.status, tasks.last_modified_by, tasks.assigned_user, tasks.group_id, task_groups.is_recurring, task_groups.is_rotate, task_groups.rule FROM tasks INNER JOIN task_groups ON tasks.group_id = task_groups.id WHERE tasks.id=$1",
      [task_id]
    );

    if (task.rows[0].is_recurring === false) {
      return res
        .status(400)
        .json({ status: "error", msg: "non-recurring task" });
    }

    const tasks = await client.query(
      "SELECT * FROM tasks WHERE group_id=$1 AND deadline >=$2",
      [task.rows[0].group_id, task.rows[0].deadline]
    );

    const taskArr = tasks.rows;

    const ogDeadline = task.rows[0].deadline;
    // console.log(ogDeadline);
    const addNum = new Date(deadline) - ogDeadline;
    const addNumInDays = Math.floor(addNum / (1000 * 60 * 60 * 24));

    for (let i = 0; i < taskArr.length; i++) {
      const newDeadline = () => {
        let newDate = taskArr[i].deadline;
        newDate.setDate(newDate.getDate() + addNumInDays);
        return newDate.toLocaleDateString();
      };

      const updated = {
        title: title === undefined ? taskArr[i].title : title,
        deadline: deadline === undefined ? taskArr[i].deadline : newDeadline(),
        modified_at:
          modified_at === undefined ? taskArr[i].modified_at : modified_at,
        status: status === undefined ? taskArr[i].status : status,
        assigned_user:
          assigned_user === undefined
            ? taskArr[i].assigned_user
            : assigned_user,
      };

      await client.query(
        "UPDATE tasks set title=$1, deadline=$2, modified_at=$3, status=$4,  assigned_user=$5 WHERE id=$6",
        [
          updated.title,
          updated.deadline,
          updated.modified_at,
          updated.status,
          updated.assigned_user,
          taskArr[i].id,
        ]
      );
    }
    await client.query("COMMIT");
    res.json({ status: "ok", msg: "all tasks updated" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error updating all tasks" });
  } finally {
    client.release();
  }
};

module.exports = {
  createTaskGroup,
  getTasksByUserGroup,
  getTasksByUser,
  getTask,
  delTask,
  delAllTasks,
  delFollowingTasks,
  updateTask,
  updateAllTasks,
  updateFollowingTasks,
};

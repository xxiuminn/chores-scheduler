const db = require("../db/db");

// const seedTasks = async (req, res) => {
//   try {
//     await db.query("DELETE FROM tasks");
//   } catch (error) {
//     console.error(error.message);
//     res.status(400).json({ status: "error", msg: "error seeding tasks" });
//   }
// };

const createTaskGroup = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const members = await client.query(
      "SELECT uuid FROM users WHERE group_id = $1",
      [req.body.usergroup_id]
    );
    console.log(members.rows);
    const numMembers = members.rowCount;
    let memberIndex = members.rows.findIndex(
      (element) => element.uuid === req.body.assigned_user
    );
    console.log(memberIndex);
    // if task group is set to non recurring:
    if (req.body.is_recurring === 0) {
      const taskGroup = await client.query(
        "INSERT INTO task_groups(is_recurring) VALUES($1) RETURNING id",
        [Boolean(req.body.is_recurring)]
      );

      // const taskGroup = await db.query("SELECT * FROM task_groups");
      const { rows } = taskGroup;
      const taskGroupId = rows[0].id;
      console.log(taskGroupId);

      await client.query(
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
          await client.query(
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
        } else return;
      }
    } else return;
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
      "SELECT users.group_id, users.name, tasks.id, tasks.title, tasks.deadline, tasks.status, tasks.assigned_user, tasks.group_id FROM users INNER JOIN tasks ON tasks.assigned_user = users.uuid WHERE users.group_id = $1",
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
      "SELECT tasks.id, tasks.title, tasks.deadline, tasks.assigned_user, tasks.created_by, tasks.status, task_groups.is_recurring, task_groups.is_rotate, task_groups.rule FROM tasks INNER JOIN task_groups ON tasks.group_id = task_groups.id WHERE tasks.id = $1",
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
    console.log(groupTaskId);

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

    console.log(task);
    const groupTaskId = task.rows[0].group_id;
    console.log(groupTaskId);

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
    const {
      title,
      deadline,
      date_modified,
      status,
      last_modified_by,
      assigned_user,
    } = req.body;

    const task = await db.query("SELECT * FROM tasks WHERE id=$1", [
      req.body.task_id,
    ]);

    if (!task.rows.length) {
      return res.status(400).json({ status: "error", msg: "task not found" });
    }

    const taskInfo = task.rows[0];
    console.log(taskInfo);

    const updated = {
      title: title === undefined ? taskInfo.title : title,
      deadline: deadline === undefined ? taskInfo.deadline : deadline,
      date_modified:
        date_modified === undefined ? taskInfo.date_modified : date_modified,
      status: status === undefined ? taskInfo.status : status,
      last_modified_by:
        last_modified_by === undefined
          ? taskInfo.last_modified_by
          : last_modified_by,
      assigned_user:
        assigned_user === undefined ? taskInfo.assigned_user : assigned_user,
    };

    await db.query(
      "UPDATE tasks set title=$1, deadline=$2, date_modified=$3, status=$4, last_modified_by=$5, assigned_user=$6",
      [
        updated.title,
        updated.deadline,
        updated.status,
        updated.last_modified_by,
        updated.assigned_user,
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
    const {
      task_id,
      title,
      deadline,
      modified_at,
      status,
      last_modified_by,
      assigned_user,
    } = req.body;

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
    // console.log(taskArr);

    const ogDeadline = task.rows[0].deadline;
    console.log(ogDeadline);
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
        last_modified_by:
          last_modified_by === undefined
            ? taskArr[i].last_modified_by
            : last_modified_by,
        assigned_user:
          assigned_user === undefined
            ? taskArr[i].assigned_user
            : assigned_user,
      };

      await client.query(
        "UPDATE tasks set title=$1, deadline=$2, modified_at=$3, status=$4, last_modified_by=$5, assigned_user=$6 WHERE id=$7",
        [
          updated.title,
          updated.deadline,
          updated.modified_at,
          updated.status,
          updated.last_modified_by,
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
    const {
      task_id,
      title,
      deadline,
      modified_at,
      status,
      last_modified_by,
      assigned_user,
    } = req.body;

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
    // console.log(taskArr);

    const ogDeadline = task.rows[0].deadline;
    console.log(ogDeadline);
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
        last_modified_by:
          last_modified_by === undefined
            ? taskArr[i].last_modified_by
            : last_modified_by,
        assigned_user:
          assigned_user === undefined
            ? taskArr[i].assigned_user
            : assigned_user,
      };

      await client.query(
        "UPDATE tasks set title=$1, deadline=$2, modified_at=$3, status=$4, last_modified_by=$5, assigned_user=$6 WHERE id=$7",
        [
          updated.title,
          updated.deadline,
          updated.modified_at,
          updated.status,
          updated.last_modified_by,
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
  // seedTasks,
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

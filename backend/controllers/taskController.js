const fs = require("fs-extra");
const path = require("path");

const filePath = path.join(__dirname, "../data/tasks.json");

const getTasks = async () => {
  if (!(await fs.pathExists(filePath))) {
    await fs.writeJson(filePath, []);
  }
  return await fs.readJson(filePath);
};

const saveTasks = async (data) => {
  await fs.writeJson(filePath, data);
};

exports.createTask = async (req, res) => {
  try {
    const { title, projectId, assignedTo, dueDate } = req.body;

    let tasks = await getTasks();

    const newTask = {
      id: Date.now().toString(),
      title,
      projectId,
      assignedTo,
      status: "Assigned",
      dueDate,
      timeline: [
        {
          stage: "Assigned",
          time: new Date()
        }
      ]
    };

    tasks.push(newTask);
    await saveTasks(tasks);

    res.status(201).json(newTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const tasks = await getTasks();
  res.json(tasks);
};

exports.updateTaskStatus = async (req, res) => {
  let tasks = await getTasks();

  const task = tasks.find(t => t.id === req.params.id);

  task.status = req.body.status;

  task.timeline.push({
    stage: req.body.status,
    time: new Date()
  });

  await saveTasks(tasks);

  res.json(task);
};
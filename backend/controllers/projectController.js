const fs = require("fs-extra");
const path = require("path");

const filePath = path.join(__dirname, "../data/projects.json");

const getProjects = async () => {
  if (!(await fs.pathExists(filePath))) {
    await fs.writeJson(filePath, []);
  }
  return await fs.readJson(filePath);
};

const saveProjects = async (data) => {
  await fs.writeJson(filePath, data);
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    let projects = await getProjects();

    const newProject = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date(),
      deadline
    };

    projects.push(newProject);
    await saveProjects(projects);

    res.status(201).json(newProject);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getProjects = async (req, res) => {
  const projects = await getProjects();
  res.json(projects);
};
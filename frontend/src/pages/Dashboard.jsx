import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const role = localStorage.getItem("role"); // 👈 important

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    deadline: ""
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    dueDate: "",
    assignedTo: "member-user"
  });

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const createProject = async () => {
    await API.post("/projects", projectForm);
    setProjectForm({ title: "", description: "", deadline: "" });
    fetchProjects();
  };

  const createTask = async () => {
    await API.post("/tasks", {
      ...taskForm,
      projectId: projects[0]?.id
    });
    setTaskForm({ title: "", dueDate: "", assignedTo: "member-user" });
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const isOverdue = (date) => new Date(date) < new Date();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl mb-6 text-center">Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div>

          {/* ADMIN ONLY */}
          {role === "Admin" && (
            <>
              {/* CREATE PROJECT */}
              <div className="bg-gray-800 p-4 rounded mb-6">
                <h2 className="mb-3">Create Project</h2>

                <input placeholder="Title"
                  value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="text-black p-2 mb-2 w-full" />

                <input placeholder="Description"
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="text-black p-2 mb-2 w-full" />

                <input type="date"
                  onChange={e => setProjectForm({ ...projectForm, deadline: e.target.value })}
                  className="text-black p-2 mb-2 w-full" />

                <button onClick={createProject} className="bg-blue-600 px-3 py-2 w-full">
                  Add Project
                </button>
              </div>

              {/* CREATE TASK */}
              <div className="bg-gray-800 p-4 rounded">
                <h2 className="mb-3">Assign Task</h2>

                <input placeholder="Task"
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="text-black p-2 mb-2 w-full" />

                <input type="date"
                  onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="text-black p-2 mb-2 w-full" />

                <select onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  className="text-black p-2 mb-2 w-full">
                  <option value="member-user">Member</option>
                  <option value="demo-user">Admin</option>
                </select>

                <button onClick={createTask} className="bg-green-600 px-3 py-2 w-full">
                  Assign Task
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div>

          {/* PROJECT LIST */}
          <div className="bg-gray-800 p-4 rounded mb-6">
            <h2 className="mb-3">Projects</h2>

            {projects.map(p => (
              <div key={p.id} className="border p-2 mb-2">
                <div>{p.title}</div>
                <div className="text-sm text-gray-400">
                  Deadline: {p.deadline}
                </div>
              </div>
            ))}
          </div>

          {/* TASK LIST */}
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="mb-3">Tasks</h2>

            {tasks
              .filter(t => role === "Admin" || t.assignedTo === "member-user")
              .map(t => (
                <div key={t.id} className="border p-3 mb-2">

                  <div>{t.title}</div>

                  <div>Status: {t.status}</div>

                  <div className={isOverdue(t.dueDate) ? "text-red-500" : "text-green-400"}>
                    {isOverdue(t.dueDate) ? "Overdue" : "On Time"}
                  </div>

                  {/* STATUS BUTTONS */}
                  <div className="mt-2">
                    <button onClick={() => updateStatus(t.id, "Accepted")} className="bg-yellow-500 px-2 mr-1">
                      Accept
                    </button>

                    <button onClick={() => updateStatus(t.id, "In Progress")} className="bg-blue-500 px-2 mr-1">
                      Progress
                    </button>

                    <button onClick={() => updateStatus(t.id, "Submitted")} className="bg-green-600 px-2">
                      Submit
                    </button>
                  </div>

                  {/* TIMELINE */}
                  <div className="text-sm mt-2">
                    {t.timeline?.map((step, i) => (
                      <div key={i}>
                        {step.stage} - {new Date(step.time).toLocaleString()}
                      </div>
                    ))}
                  </div>

                </div>
              ))}
          </div>

        </div>
      </div>
    </div>
  );
}
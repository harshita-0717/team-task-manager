import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [showProjects, setShowProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [projectSearch, setProjectSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");

  const [selectedTaskProject, setSelectedTaskProject] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    deadline: "",
    submissionType: "PDF",
    status: "Running"
  });

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchUsers();
  }, []);

  const getId = item => item._id || item.id;

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get("/auth/users");
    setUsers(res.data);
  };

  const createProject = async () => {
    if (!projectForm.title || !projectForm.deadline) {
      alert("Project title and deadline required");
      return;
    }

    await API.post("/projects", projectForm);

    setProjectForm({
      title: "",
      description: "",
      deadline: "",
      submissionType: "PDF",
      status: "Running"
    });

    fetchProjects();
    alert("Project created successfully");
  };

  const assignProjectToMember = async () => {
    if (!selectedTaskProject || !selectedMember) {
      alert("Select project and member");
      return;
    }

    await API.post("/tasks", {
      title: selectedTaskProject.title,
      projectId: getId(selectedTaskProject),
      assignedTo: getId(selectedMember),
      dueDate: selectedTaskProject.deadline,
      status: "Assigned"
    });

    setSelectedTaskProject(null);
    setSelectedMember(null);
    setProjectSearch("");
    setMemberSearch("");

    fetchTasks();
    alert("Project assigned successfully");
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchTasks();
  };

  const isOverdue = (date, status) => {
    return new Date(date) < new Date() && status !== "Submitted";
  };

  const members = users.filter(u => u.role === "Member");

  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const visibleTasks =
    role === "Admin"
      ? tasks
      : tasks.filter(task => task.assignedTo === userId);

  const memberProjects = projects.filter(project =>
    visibleTasks.some(task => task.projectId === getId(project))
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Team Task Manager</h1>
          <p style={styles.subtitle}>
            {role === "Admin" ? "Admin Workspace" : "Member Workspace"}
          </p>
        </div>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {role === "Admin" ? (
        <>
          <div style={styles.grid}>
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>Create Project</h2>

              <input
                style={styles.input}
                placeholder="Project title"
                value={projectForm.title}
                onChange={e =>
                  setProjectForm({ ...projectForm, title: e.target.value })
                }
              />

              <textarea
                style={styles.textarea}
                placeholder="Project description"
                value={projectForm.description}
                onChange={e =>
                  setProjectForm({
                    ...projectForm,
                    description: e.target.value
                  })
                }
              />

              <label style={styles.label}>Submission Deadline</label>
              <input
                style={styles.input}
                type="date"
                value={projectForm.deadline}
                onChange={e =>
                  setProjectForm({ ...projectForm, deadline: e.target.value })
                }
              />

              <label style={styles.label}>Submission Type</label>
              <select
                style={styles.input}
                value={projectForm.submissionType}
                onChange={e =>
                  setProjectForm({
                    ...projectForm,
                    submissionType: e.target.value
                  })
                }
              >
                <option value="PDF">PDF</option>
                <option value="ZIP">ZIP</option>
                <option value="GitHub Link">GitHub Link</option>
                <option value="Presentation">Presentation</option>
              </select>

              <button style={styles.primaryBtn} onClick={createProject}>
                Create Project
              </button>

              <button
                style={styles.secondaryBtn}
                onClick={() => setShowProjects(!showProjects)}
              >
                {showProjects ? "Hide Projects" : "List All Projects"}
              </button>
            </section>

            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>Assign Project to Member</h2>

              <input
                style={styles.input}
                placeholder="Search project title"
                value={projectSearch}
                onChange={e => setProjectSearch(e.target.value)}
              />

              <div style={styles.listBox}>
                {filteredProjects.map(project => (
                  <button
                    key={getId(project)}
                    style={{
                      ...styles.listItem,
                      background:
                        getId(selectedTaskProject || {}) === getId(project)
                          ? "#2563eb"
                          : "#020617"
                    }}
                    onClick={() => setSelectedTaskProject(project)}
                  >
                    {project.title}
                  </button>
                ))}
              </div>

              <input
                style={styles.input}
                placeholder="Search member"
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />

              <div style={styles.listBox}>
                {filteredMembers.map(member => (
                  <button
                    key={getId(member)}
                    style={{
                      ...styles.listItem,
                      background:
                        getId(selectedMember || {}) === getId(member)
                          ? "#16a34a"
                          : "#020617"
                    }}
                    onClick={() => setSelectedMember(member)}
                  >
                    {member.name} - {member.email}
                  </button>
                ))}
              </div>

              <div style={styles.selectedBox}>
                <p>
                  <b>Selected Project:</b>{" "}
                  {selectedTaskProject ? selectedTaskProject.title : "None"}
                </p>
                <p>
                  <b>Selected Member:</b>{" "}
                  {selectedMember ? selectedMember.name : "None"}
                </p>
              </div>

              <button style={styles.successBtn} onClick={assignProjectToMember}>
                Assign Project
              </button>
            </section>
          </div>

          {showProjects && (
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>All Projects</h2>

              {projects.length === 0 ? (
                <p style={styles.muted}>No projects created yet.</p>
              ) : (
                projects.map(project => (
                  <div key={getId(project)} style={styles.projectItem}>
                    <button
                      style={styles.projectTitleBtn}
                      onClick={() =>
                        setSelectedProject(
                          getId(selectedProject || {}) === getId(project)
                            ? null
                            : project
                        )
                      }
                    >
                      {project.title}
                      <span style={styles.statusBadge}>
                        {project.status || "Running"}
                      </span>
                    </button>

                    {getId(selectedProject || {}) === getId(project) && (
                      <div style={styles.projectDetails}>
                        <p>
                          <b>Description:</b> {project.description}
                        </p>
                        <p>
                          <b>Deadline:</b> {project.deadline}
                        </p>
                        <p>
                          <b>Submission Type:</b> {project.submissionType}
                        </p>
                        <p>
                          <b>Status:</b> {project.status || "Running"}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </section>
          )}
        </>
      ) : (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Assigned Projects</h2>

          {memberProjects.map(project => (
            <details key={getId(project)} style={styles.details}>
              <summary style={styles.summary}>
                <span>{project.title}</span>
                <span style={styles.deadline}>Deadline: {project.deadline}</span>
              </summary>

              <p>{project.description}</p>
              <p>Submission Type: {project.submissionType}</p>

              {project.submissionType === "PDF" && (
                <button style={styles.uploadBtn}>Upload PDF</button>
              )}
            </details>
          ))}
        </section>
      )}

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          {role === "Admin" ? "All Task Timelines" : "My Assigned Tasks"}
        </h2>

        {visibleTasks.map(task => {
          const project = projects.find(p => getId(p) === task.projectId);

          return (
            <div key={getId(task)} style={styles.taskCard}>
              <div style={styles.taskTop}>
                <div>
                  <h3>{task.title}</h3>
                  <p style={styles.muted}>{project?.title}</p>
                </div>

                <span
                  style={{
                    ...styles.badge,
                    background: isOverdue(task.dueDate, task.status)
                      ? "#dc2626"
                      : task.status === "Submitted"
                      ? "#16a34a"
                      : "#f59e0b"
                  }}
                >
                  {isOverdue(task.dueDate, task.status)
                    ? "Overdue"
                    : task.status}
                </span>
              </div>

              <p>Due Date: {task.dueDate}</p>

              {role === "Member" && task.status !== "Submitted" && (
                <div style={styles.actions}>
                  <button onClick={() => updateStatus(getId(task), "Accepted")}>
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(getId(task), "In Progress")}
                  >
                    In Progress
                  </button>
                  <button onClick={() => updateStatus(getId(task), "Submitted")}>
                    Submit
                  </button>
                </div>
              )}

              <div style={styles.timeline}>
                <b>Timeline</b>
                {task.timeline?.map((step, i) => (
                  <p key={i}>
                    {step.stage} — {new Date(step.time).toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #111827)",
    color: "#fff",
    padding: "30px",
    fontFamily: "Inter, Arial"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },
  title: { fontSize: "32px", margin: 0 },
  subtitle: { color: "#94a3b8" },
  logout: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "24px",
    marginBottom: "24px"
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "24px",
    borderRadius: "22px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    marginBottom: "24px"
  },
  sectionTitle: {
    marginBottom: "18px"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    marginBottom: "14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    outline: "none"
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    height: "100px",
    marginBottom: "14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    outline: "none",
    resize: "vertical"
  },
  label: {
    display: "block",
    marginBottom: "6px",
    color: "#cbd5e1"
  },
  primaryBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    marginTop: "8px"
  },
  secondaryBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    background: "#475569",
    color: "white",
    cursor: "pointer",
    marginTop: "12px"
  },
  successBtn: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    marginTop: "12px"
  },
  listBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
    maxHeight: "180px",
    overflowY: "auto"
  },
  listItem: {
    width: "100%",
    color: "#fff",
    border: "1px solid #334155",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "left",
    cursor: "pointer"
  },
  selectedBox: {
    background: "#020617",
    padding: "14px",
    borderRadius: "12px",
    marginTop: "12px",
    marginBottom: "12px"
  },
  projectItem: {
    background: "#020617",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "12px"
  },
  projectTitleBtn: {
    width: "100%",
    background: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    fontWeight: "bold"
  },
  statusBadge: {
    background: "#f59e0b",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px"
  },
  projectDetails: {
    marginTop: "14px",
    color: "#cbd5e1"
  },
  details: {
    background: "#020617",
    padding: "16px",
    borderRadius: "14px",
    marginBottom: "12px"
  },
  summary: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between"
  },
  deadline: { color: "#facc15" },
  uploadBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff"
  },
  taskCard: {
    background: "#020617",
    padding: "18px",
    borderRadius: "18px",
    marginBottom: "16px"
  },
  taskTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  muted: { color: "#94a3b8" },
  badge: {
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "13px"
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px"
  },
  timeline: {
    marginTop: "14px",
    color: "#cbd5e1",
    fontSize: "14px"
  }
};
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const filterStatus = document.getElementById("filter-status");
const searchInput = document.getElementById("search");
const themeToggle = document.getElementById("theme-toggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 10px 16px;
    border-radius: 8px;
    opacity: 0.9;
    z-index: 999;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter(task => {
    const status = filterStatus.value;
    const matchesSearch = task.text.toLowerCase().includes(searchInput.value.toLowerCase());
    const isToday = new Date(task.dueDate).toDateString() === new Date().toDateString();

    if (status === "active") return !task.completed && matchesSearch;
    if (status === "completed") return task.completed && matchesSearch;
    if (status === "due") return isToday && matchesSearch;
    return matchesSearch;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");
    li.innerHTML = `
      <div>
        <strong>${task.text}</strong> ${task.category ? `- <em>${task.category}</em>` : ""}
        <br />
        <small>Due: ${task.dueDate || "Not set"}</small>
      </div>
      <div>
        <button onclick="toggleComplete(${index})"><i class="fas fa-check"></i></button>
        <button onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `;
    taskList.appendChild(li);
  });

  totalCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter(t => t.completed).length;
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    completed: false,
    dueDate: dueDateInput.value,
    category: categoryInput.value.trim()
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
  dueDateInput.value = "";
  categoryInput.value = "";
  showToast("Task added!");
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showToast("Task deleted!");
}

addBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);

// Dark mode toggle
themeToggle.addEventListener("click", () => {
  document.documentElement.toggleAttribute("data-theme", "dark");
});

// Load on start
renderTasks();

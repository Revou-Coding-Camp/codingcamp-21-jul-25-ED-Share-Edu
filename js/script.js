// Ambil elemen-elemen DOM
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".btn-filter");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const activeTasksEl = document.getElementById("activeTasks");
const clearCompletedBtn = document.getElementById("clearCompleted");

// Data task
let tasks = [];
let currentFilter = "all";

// Fungsi untuk memperbarui tampilan jumlah tugas
function updateTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    activeTasksEl.textContent = active;
}

// Fungsi render semua task
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;
    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = `task-item ${task.completed ? "completed" : ""}`;

        taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="task-checkbox"/>
            <span class="task-desc">${task.description}</span>
            <span class="task-date">${task.dueDate}</span>
            <button class="btn btn-delete" data-index="${index}">🗑️</button>
        `;

        taskList.appendChild(taskItem);
    });

    updateTaskStats();
}

// Fungsi menambahkan task baru
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const description = taskInput.value.trim();
    const dueDate = dateInput.value;

    if (!description || !dueDate) {
        document.getElementById("taskError").style.display = !description ? "block" : "none";
        document.getElementById("dateError").style.display = !dueDate ? "block" : "none";
        return;
    }

    tasks.push({
        description,
        dueDate,
        completed: false,
    });

    taskInput.value = "";
    dateInput.value = "";

    document.getElementById("taskError").style.display = "none";
    document.getElementById("dateError").style.display = "none";

    renderTasks();
});

// Toggle selesai
taskList.addEventListener("change", (e) => {
    if (e.target.classList.contains("task-checkbox")) {
        const index = e.target.getAttribute("data-index");
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }
});

// Hapus task
taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const index = e.target.getAttribute("data-index");
        tasks.splice(index, 1);
        renderTasks();
    }
});

// Filter task
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.getAttribute("data-filter");
        renderTasks();
    });
});

// Hapus semua yang selesai
clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
});

// Inisialisasi
renderTasks();

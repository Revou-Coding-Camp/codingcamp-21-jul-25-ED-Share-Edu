// Task Management System
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.setMinDate();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.clearCompleted();
        });

        document.getElementById('taskInput').addEventListener('input', () => {
            this.clearError('taskInput', 'taskError');
        });

        document.getElementById('dateInput').addEventListener('change', () => {
            this.clearError('dateInput', 'dateError');
        });
    }

    handleFormSubmit() {
        const taskInput = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');
        const priorityInput = document.getElementById('priorityInput');

        let isValid = true;

        if (!taskInput.value.trim()) {
            this.showError('taskInput', 'taskError');
            isValid = false;
        }

        if (!dateInput.value) {
            this.showError('dateInput', 'dateError');
            isValid = false;
        }

        if (isValid) {
            this.addTask({
                id: Date.now(),
                text: taskInput.value.trim(),
                dueDate: dateInput.value,
                priority: priorityInput.value,
                completed: false
            });

            // Reset form fields
            taskInput.value = "";
            dateInput.value = "";
            priorityInput.value = "medium";
        }
    }

    addTask(task) {
        this.tasks.push(task);
        this.saveTasks();
        this.render();
        this.updateStats();
    }

    render() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = "";

        const filteredTasks = this.getFilteredTasks();

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item priority-${task.priority}`;
            if (task.completed) taskItem.classList.add('completed');

            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <div class="task-content">
                    <p class="task-text">${task.text}</p>
                    <small>Due: ${task.dueDate}</small>
                </div>
                <button class="btn btn-delete" data-id="${task.id}">🗑️</button>
            `;

            // Checkbox toggle
            taskItem.querySelector('.task-checkbox').addEventListener('change', (e) => {
                this.toggleTask(e.target.dataset.id);
            });

            // Delete button
            taskItem.querySelector('.btn-delete').addEventListener('click', (e) => {
                this.deleteTask(e.target.dataset.id);
            });

            taskList.appendChild(taskItem);
        });
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id == id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
            this.updateStats();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id != id);
        this.saveTasks();
        this.render();
        this.updateStats();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveTasks();
        this.render();
        this.updateStats();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.btn-filter[data-filter="${filter}"]`).classList.add('active');
        this.render();
    }

    getFilteredTasks() {
        if (this.currentFilter === 'completed') return this.tasks.filter(t => t.completed);
        if (this.currentFilter === 'active') return this.tasks.filter(t => !t.completed);
        return this.tasks;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const active = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('activeTasks').textContent = active;
    }

    showError(inputId, errorId) {
        document.getElementById(inputId).classList.add('error');
        document.getElementById(errorId).style.display = 'block';
    }

    clearError(inputId, errorId) {
        document.getElementById(inputId).classList.remove('error');
        document.getElementById(errorId).style.display = 'none';
    }

    setMinDate() {
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("dateInput").setAttribute("min", today);
    }

    saveTasks() {
        localStorage.setItem("todoTasks", JSON.stringify(this.tasks));
    }

    loadTasks() {
        const data = localStorage.getItem("todoTasks");
        return data ? JSON.parse(data) : [];
    }
}

// Inisialisasi aplikasi
window.addEventListener("DOMContentLoaded", () => {
    new TodoApp();
});

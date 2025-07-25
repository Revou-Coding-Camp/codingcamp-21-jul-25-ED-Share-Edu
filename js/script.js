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
        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Filter buttons
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear completed button
        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.clearCompleted();
        });

        // Input validation
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

        // Validate inputs
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
                text: taskInput.value.trim(),
                dueDate: dateInput.value,
                priority: priorityInput.value
            });

            // Reset form
            taskInput.value = '';
            dateInput.value = '';
            priorityInput.value = 'medium';
        }
    }

    showError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        
        input.classList.add('error');
        error.classList.add('show');
    }

    clearError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        
        input.classList.remove('error');
        error.classList.remove('show');
    }

    addTask(taskData) {
        const task = {
            id: Date.now(),
            text: taskData.text,
            dueDate: taskData.dueDate,
            priority: taskData.priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.render();
        this.updateStats();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
        this.updateStats();
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
            this.updateStats();
        }
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.render();
        this.updateStats();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }

    getFilteredTasks() {
        const today = new Date().toISOString().split('T')[0];
        
        return this.tasks.filter(task => {
            switch(this.currentFilter) {
                case 'pending':
                    return !task.completed;
                case 'completed':
                    return task.completed;
                case 'overdue':
                    return !task.completed && task.dueDate < today;
                case 'high':
                    return task.priority === 'high';
                default:
                    return true;
            }
        });
    }

    isOverdue(task) {
        const today = new Date().toISOString().split('T')[0];
        return !task.completed && task.dueDate < today;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    render() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '';
            taskList.appendChild(emptyState);
            return;
        }

        // Remove empty state if it exists
        if (emptyState.parentNode) {
            emptyState.remove();
        }

        taskList.innerHTML = filteredTasks.map(task => {
            const isOverdue = this.isOverdue(task);
            const priorityClass = `priority-${task.priority}`;
            
            return `
                <div class="task-item ${task.completed ? 'completed' : ''} ${task.priority === 'high' ? 'high-priority' : ''} ${isOverdue ? 'overdue' : ''}">
                    <div class="task-header">
                        <div class="task-content">
                            <div style="display: flex; align-items: center;">
                                <input 
                                    type="checkbox" 
                                    class="task-checkbox"
                                    ${task.completed ? 'checked' : ''} 
                                    onchange="todoApp.toggleTask(${task.id})"
                                >
                                <div class="task-text">${task.text}</div>
                            </div>
                            <div class="task-meta">
                                <span>📅 ${this.formatDate(task.dueDate)}</span>
                                <span class="priority-badge ${priorityClass}">
                                    ${task.priority} priority
                                </span>
                                ${task.completed ? '<span style="color: #28a745;">✅ Completed</span>' : ''}
                                ${isOverdue ? '<span style="color: #dc3545;">⚠️ Overdue</span>' : ''}
                            </div>
                        </div>
                        <div class="task-actions">
                            <button 
                                class="btn btn-delete"
                                onclick="todoApp.deleteTask(${task.id})"
                                title="Delete task"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = this.tasks.filter(task => !task.completed).length;
        const overdue = this.tasks.filter(task => this.isOverdue(task)).length;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('overdueTasks').textContent = overdue;
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateInput').min = today;
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});
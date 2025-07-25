let tasks = [];
let currentFilter = 'all';

// Form validation and submission
document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const taskError = document.getElementById('taskError');
    const dateError = document.getElementById('dateError');
    
    // Reset errors
    taskError.classList.add('hidden');
    dateError.classList.add('hidden');
    taskInput.classList.remove('border-red-500');
    dateInput.classList.remove('border-red-500');
    
    let isValid = true;
    
    // Validate task input
    if (!taskInput.value.trim()) {
        taskError.classList.remove('hidden');
        taskInput.classList.add('border-red-500');
        isValid = false;
    }
    
    // Validate date input
    if (!dateInput.value) {
        dateError.classList.remove('hidden');
        dateInput.classList.add('border-red-500');
        isValid = false;
    }
    
    if (isValid) {
        addTask(taskInput.value.trim(), dateInput.value);
        taskInput.value = '';
        dateInput.value = '';
    }
});

function addTask(description, dueDate) {
    const task = {
        id: Date.now(),
        description: description,
        dueDate: dueDate,
        completed: false,
        createdAt: new Date()
    };
    
    tasks.push(task);
    renderTasks();
    updateTaskCount();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    updateTaskCount();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateTaskCount();
    }
}

function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500');
    });
    event.target.classList.add('ring-2', 'ring-offset-2', 'ring-blue-500');
    
    renderTasks();
}

function getFilteredTasks() {
    const today = new Date().toISOString().split('T')[0];
    
    switch(currentFilter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'overdue':
            return tasks.filter(task => !task.completed && task.dueDate < today);
        default:
            return tasks;
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '';
        taskList.appendChild(emptyState);
        return;
    }
    
    emptyState.remove();
    
    taskList.innerHTML = filteredTasks.map(task => {
        const today = new Date().toISOString().split('T')[0];
        const isOverdue = !task.completed && task.dueDate < today;
        const formattedDate = new Date(task.dueDate).toLocaleDateString();
        
        return `
            <div class="task-item bg-gray-50 rounded-lg p-4 border-l-4 ${task.completed ? 'border-green-500' : isOverdue ? 'border-red-500' : 'border-blue-500'} fade-in">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3 flex-1">
                        <input 
                            type="checkbox" 
                            ${task.completed ? 'checked' : ''} 
                            onchange="toggleTask(${task.id})"
                            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        >
                        <div class="flex-1">
                            <p class="text-gray-800 font-medium ${task.completed ? 'completed' : ''}">${task.description}</p>
                            <div class="flex items-center space-x-4 mt-1">
                                <span class="text-sm text-gray-600">📅 ${formattedDate}</span>
                                ${task.completed ? '<span class="text-sm text-green-600 font-medium">✅ Completed</span>' : ''}
                                ${isOverdue ? '<span class="text-sm text-red-600 font-medium">⚠️ Overdue</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <button 
                        onclick="deleteTask(${task.id})"
                        class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete task"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateTaskCount() {
    const taskCount = document.getElementById('taskCount');
    const filteredTasks = getFilteredTasks();
    const completedCount = filteredTasks.filter(task => task.completed).length;
    
    if (filteredTasks.length === 0) {
        taskCount.textContent = '0 tasks';
    } else {
        taskCount.textContent = `${filteredTasks.length} tasks (${completedCount} completed)`;
    }
}

// Set minimum date to today
document.getElementById('dateInput').min = new Date().toISOString().split('T')[0];

// Initialize
renderTasks();
updateTaskCount();
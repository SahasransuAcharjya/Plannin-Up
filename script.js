document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDateTime = document.getElementById('task-datetime');
    const taskList = document.getElementById('task-list');
    const tabs = document.querySelectorAll('.tab');

    // Load tasks from local storage or initialize as an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Event listener for adding a task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const taskDate = taskDateTime.value;

        if (taskText === '' || taskDate === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            datetime: taskDate,
            completed: false,
        };

        tasks.push(task);
        saveTasks(); // Save to local storage
        taskInput.value = '';
        taskDateTime.value = '';
        renderTasks();
    });

    // Function to render tasks
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter((task) => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        });

        filteredTasks.forEach((task) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

            taskItem.innerHTML = `
                <span>${task.text} (${new Date(task.datetime).toLocaleString()})</span>
                <div>
                    <button class="toggle-status">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete-task">Delete</button>
                </div>
            `;

            // Toggle task completion
            taskItem.querySelector('.toggle-status').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks(); // Save to local storage
                renderTasks(filter);
            });

            // Delete task
            taskItem.querySelector('.delete-task').addEventListener('click', () => {
                tasks = tasks.filter((t) => t.id !== task.id);
                saveTasks(); // Save to local storage
                renderTasks(filter);
            });

            taskList.appendChild(taskItem);
        });
    }

    // Tab switching logic
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.tab;
            renderTasks(filter);
        });
    });

    // Initial render
    renderTasks();
});

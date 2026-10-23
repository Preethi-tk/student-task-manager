
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const dueDate = document.getElementById("dueDate");
const taskTableBody = document.getElementById("taskTableBody");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

// Store tasks in the browser for now
let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];
let nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const date = dueDate.value;

    if (!title || !date) {
        alert("Please enter a task title and due date.");
        return;
    }

    tasks.push({
        id: nextId++,
        title: title,
        dueDate: date,
        completed: false
    });

    saveAndRenderTasks();
    taskForm.reset();
});

// Save tasks in browser storage and refresh the page content
function saveAndRenderTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
    renderTasks();
}

// Display tasks in the table
function renderTasks() {
    taskTableBody.replaceChildren();

    tasks.forEach(function (task) {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = task.title;

        const dateCell = document.createElement("td");
        dateCell.textContent = task.dueDate;

        const statusCell = document.createElement("td");
        const statusLabel = document.createElement("span");
        statusLabel.className = task.completed
            ? "status completed"
            : "status pending";
        statusLabel.textContent = task.completed ? "Completed" : "Pending";
        statusCell.appendChild(statusLabel);

        const actionCell = document.createElement("td");

        if (!task.completed) {
            const completeButton = document.createElement("button");
            completeButton.textContent = "Complete";
            completeButton.className = "complete-btn";
            completeButton.addEventListener("click", function () {
                completeTask(task.id);
            });
            actionCell.appendChild(completeButton);
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });
        actionCell.appendChild(deleteButton);

        row.append(titleCell, dateCell, statusCell, actionCell);
        taskTableBody.appendChild(row);
    });

    // Update task counts
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;
    pendingTasks.textContent = tasks.filter(task => !task.completed).length;

    // Show or hide the empty message
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}

// Mark a task as completed
function completeTask(id) {
    tasks = tasks.map(function (task) {
        return task.id === id
            ? { ...task, completed: true }
            : task;
    });

    saveAndRenderTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveAndRenderTasks();
}

// Display saved tasks when the page opens
renderTasks();

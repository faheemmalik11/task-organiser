
const addTaskModal = document.getElementById("addTaskModal")
const taskFormBtn = document.getElementById("taskFormBtn")
let   UpdateTaskId = null;
const Tasks = [];

// Pop-up window 

const showAddTaskModal = () => {
    addTaskModal.style.display = "flex"
}

const closeAddTaskModal = () => {
    addTaskModal.style.display = "none"
}

// Local Storage

const saveTaskDetailToLocalStorage = (data) => {
    try {
        const existingTasks = JSON.parse(localStorage.getItem("Tasks")) || [];
        existingTasks.push(data);
        localStorage.setItem("Tasks", JSON.stringify(existingTasks));
    } catch (error) {
        throw error;
    }
}

const getTasksFromLocalStorage = (task) => {
    try {
        const parsedData = JSON.parse(localStorage.getItem("Tasks")) || [];
        Tasks.push(...parsedData);
    } catch (error) {
        throw error;
    }
}
const updateTaskInLocalStorage = (updatedTask) => {
    try {
        let parsedData = JSON.parse(localStorage.getItem("Tasks")) || [];

        const taskToBeUpdated = parsedData.findIndex(task => task.id === updatedTask.id);

        if (taskToBeUpdated !== -1) {
            parsedData[taskToBeUpdated] = updatedTask;
            localStorage.setItem("Tasks", JSON.stringify(parsedData));
        } else {
            console.warn("Task not found to update:");
        }
    } catch (error) {
        throw error;
    }
};

// Task CURD Operations

const generateUniqueTaskId = () => {
    return Date.now();
}

const getTaskDataOnSubmitForm = () => {
    try {
        const taskDescription = document.getElementById("description").value.trim();
        const taskPriority = document.getElementById("priority").value;
        const taskDueTime = document.getElementById("dueDate").value;
        const taskStatus = document.getElementById("status").value;
        if (!UpdateTaskId) {
            const taskdata = {
                id: generateUniqueTaskId(),
                description: taskDescription,
                priority: taskPriority,
                date: taskDueTime,
                status: taskStatus
            }
            saveTaskDetailToLocalStorage(taskdata)

        } else {
            let taskToBeUpdate = Tasks.find(task => task.id == UpdateTaskId)
            console.log("taskToBeUpdate:", taskToBeUpdate)
            if (taskToBeUpdate) {
                taskToBeUpdate.description = taskDescription;
                taskToBeUpdate.priority = taskPriority;
                taskToBeUpdate.date = taskDueTime;
                taskToBeUpdate.status = taskStatus;
                updateTaskInLocalStorage(taskToBeUpdate);

            }
            taskFormBtn.innerText = "Save";
        }
        closeAddTaskModal();
        displayAllTasks();
    } catch (error) {
        throw error;
    }
}

const changeBackgroundColorOnPriority = (priority) => {
    switch (priority) {
        case "High Priority":
            return "bg-red-800";
        case "Urgent":
            return "bg-red-600";
        case "Medium":
            return "bg-orange-500"
        case "Normal":
            return "bg-green-500"
        default:
            return "bg-gray-600"
    }
}

const displayAllTasks = () => {
    try {
        const statusSections = {
            Backlog: document.getElementById("backlogTasks"),
            InProgress: document.getElementById("inProgressTasks"),
            Completed: document.getElementById("completedTasks"),
            DeployedTested: document.getElementById("deployedTestedTasks"),
            Archived: document.getElementById("archivedTasks")
        };

        Object.values(statusSections).forEach(section => section.innerHTML = "");

        Tasks.forEach((task) => {
            const section = statusSections[task.status];
            if (!section) return;

            const taskCard = document.createElement("div");
            taskCard.className = "bg-black rounded-lg p-4 mb-4 text-white shadow cursor-pointer";
            taskCard.setAttribute("draggable", "true");
            taskCard.addEventListener("dragstart", dragstartHandler);

            const date = new Date(task.date);
            const formattedDate = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short"
            });

            taskCard.innerHTML = `
            <span class="text-xs ${changeBackgroundColorOnPriority(task.priority)} px-2 py-1 rounded-md font-bold">
                ${task.priority}
            </span>
            <p class="text-sm font-semibold my-2">Task ID: ${task.id} - ${task.description}</p>
            <div class="flex justify-between items-center">
                <span class="flex items-center gap-1"><i class="fa-regular fa-clock"></i> ${formattedDate}</span>
                <i class="fa-regular fa-pen-to-square cursor-pointer hover:text-blue-300" onclick="(function(){ updateTaskDetail(${task.id}); })()"></i>
            </div>
        `;

            section.appendChild(taskCard);
        });
    } catch (error) {
        throw error;
    }
};

const updateTaskDetail = (id) => {
    try {
        UpdateTaskId = id;
        const task = Tasks.find(t => t.id === id);
        if (!task) {
            console.error("Task not found for update:", task.id);
            return;
        }
        console.log("task:", task);
        taskFormBtn.innerText = "Update";

        const date = new Date(task.date);
        const originalFormat = date.toISOString().slice(0, 16);
        document.getElementById("description").value = task.description;
        document.getElementById("priority").value = task.priority;
        document.getElementById("dueDate").value = originalFormat;
        document.getElementById("status").value = task.status;

        showAddTaskModal();

    } catch (error) {
        throw error
    }
}

// Drag And Drop Task

const dragstartHandler=(e)=> {
    console.log("e in dragstartHandler :",e)
    e.dataTransfer.setData("text", e.target.id);
}
const dragoverHandler=(e) =>{
    e.preventDefault();
}
const dropEventHandler = (e)=>{
    e.preventDefault();
    const data = e.dataTransfer.getData("text")
    e.target.appendChild(document.getElementById(data));
}






window.onload = () => {
    // fetch saved tasked in local storage on page load
    getTasksFromLocalStorage();
    displayAllTasks();

}
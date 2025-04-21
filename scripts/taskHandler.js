import { saveTaskDetailToLocalStorage, updateTaskInLocalStorage, deleteTaskfromLocalStorage } from "./local-storage-handler.js"
import { dragstartHandler, dragoverHandler, dropEventHandler } from "./task-drag-drop-handler.js"
import { Tasks } from "./main.js"


const addTaskModal = document.getElementById("addTaskModal")
const taskFormBtn = document.getElementById("taskFormBtn")
let UpdateTaskId = null;

const showAddTaskModal = () => {
    addTaskModal.style.display = "flex"
}

const closeAddTaskModal = () => {
    addTaskModal.style.display = "none"
}


export const generateUniqueTaskId = () => Date.now();  //this will generate unique id from time in millisecond

export const getTaskDataOnSubmitForm = () => {
    try {
        event.preventDefault();
        const taskDescription = document.getElementById("description").value.trim();
        const taskPriority = document.getElementById("priority").value;
        const taskDueTime = document.getElementById("dueDate").value;
        const taskStatus = document.getElementById("status").value;

        if (UpdateTaskId === null) {  //if updatedtaskId is null then user is adding new tasks 
            const taskdata = {
                id: generateUniqueTaskId(),
                description: taskDescription,
                priority: taskPriority,
                date: taskDueTime,
                status: taskStatus
            }
            saveTaskDetailToLocalStorage(taskdata)
        } else {        //else user is updating new
            const taskToBeUpdate = Tasks.find(task => task.id == UpdateTaskId)
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
        window.location.reload();

    } catch (error) {
        throw error;
    }
}

export const changeBackgroundColorOnPriority = (priority) => {
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
const updateTaskDetail = (id) => {
    try {
        UpdateTaskId = id;
        const task = Tasks.find(t => t.id === id);
        if (!task) {
            console.error("Task not found for update:", task.id);
            return;
        }
        taskFormBtn.innerText = "Update";
        const date = new Date(task.date);
        const originalFormat = date.toISOString().slice(0, 16);
        document.getElementById("description").value = task.description;
        document.getElementById("priority").value = task.priority;
        document.getElementById("dueDate").value = originalFormat;
        document.getElementById("status").value = task.status;
        showAddTaskModal();

    } catch (error) {
        console.error("Error in Update tasks:", error);
    }
}
export const displayAllTasks = () => {
    try {
        const statusSections = {
            Backlog: document.getElementById("backlogTasks"),
            InProgress: document.getElementById("inProgressTasks"),
            Completed: document.getElementById("completedTasks"),
            DeployedTested: document.getElementById("deployedTestedTasks"),
            Archived: document.getElementById("archivedTasks")
        };

        Object.entries(statusSections).forEach(([status, section]) => { // this will add dragover and drop event functions to all sections 
            section.innerHTML = "";                                     // of tasks 
            section.addEventListener("dragover", dragoverHandler);
            section.addEventListener("drop", (e) => dropEventHandler(e, status));
        });

        Tasks.forEach((task) => {   //this loop will display all tasks in different columns based on their status value
            const section = statusSections[task.status];
            if (!section) return;
            const taskCard = document.createElement("div");
            taskCard.id = `task-${task.id}`;    //asssign unique id to each task
            taskCard.className = "bg-black rounded-lg p-4 mb-4 text-white shadow cursor-pointer";
            taskCard.setAttribute("draggable", "true");
            taskCard.addEventListener("dragstart", dragstartHandler);
            taskCard.innerHTML = getTaskCardInnerHTML(task); // this fucntion willl return html code
            section.appendChild(taskCard);
        });
    } catch (error) {
        console.error("Error in displaying tasks:", error);
    }
};

const getTaskCardInnerHTML = (task) => {
    const date = new Date(task.date);
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short"
    });

    return `
        <span class="text-xs ${changeBackgroundColorOnPriority(task.priority)} px-2 py-1 rounded-md font-bold">
            ${task.priority}
        </span>
        <p class="text-sm font-semibold my-2">Task ID: ${task.id} - ${task.description}</p>
        <div class="flex justify-between items-center">
            <span class="flex items-center gap-1">
                <i class="fa-regular fa-clock"></i> ${formattedDate}
            </span>
            <div>
                <i class="fa-regular fa-pen-to-square cursor-pointer hover:text-blue-300" onclick="updateTaskDetail(${task.id})"></i>
                <i class="fa-solid fa-trash cursor-pointer hover:text-blue-300 ml-2" onclick="deleteTaskfromLocalStorage(${task.id})"></i>
            </div>
        </div>
    `;
};




// Search task with task id
const searchTask = () => {
    const searchBarValue = Number(document.getElementById("searchBar").value.trim());
    const searchedTask = Tasks.find(task => task.id === searchBarValue)
    if (!searchedTask) {
        Swal.fire({
            icon: "error",
            title: "Task not found!",
            text: "Please check the task ID",
        });
        return;
    }
    const searchTaskElement = document.getElementById(`task-${searchedTask.id}`);
    if (!searchTaskElement) {
        console.error("Task DOM element not found.");
        return;
    }
    const originalBackground = searchTaskElement.style.backgroundColor;
    searchTaskElement.style.backgroundColor = "red";
    searchTaskElement.scrollIntoView({ block: "center" });
    setTimeout(() => {
        searchTaskElement.style.backgroundColor = originalBackground || "black";
    }, 3000);

}

// Expose functions to global scope (so they can be called from HTML onclick)
window.showAddTaskModal = showAddTaskModal;
window.closeAddTaskModal = closeAddTaskModal;
window.searchTask = searchTask;
window.updateTaskDetail = updateTaskDetail;
window.getTaskDataOnSubmitForm = getTaskDataOnSubmitForm;

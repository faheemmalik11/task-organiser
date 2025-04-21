
const addTaskModal = document.getElementById("addTaskModal")
const taskFormBtn = document.getElementById("taskFormBtn")
const sectionHeadings = document.querySelectorAll('[contenteditable="true"]');
let   UpdateTaskId = null;
const Tasks = [];


// Dynamic Section Headings

sectionHeadings.forEach((heading) => {
    heading.addEventListener("input", (e) => {
        const sectionId = e.target.id;
        const updatedHeading = e.target.innerText.trim();
        localStorage.setItem(sectionId, updatedHeading);
    });
});

const loadSavedHeadings = () => {
    sectionHeadings.forEach((heading) => {
        const sectionId = heading.id;
        const savedHeading = localStorage.getItem(sectionId) ;
        if (savedHeading) {
            heading.innerText = savedHeading;
        }
    });
};



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
        console.log("taskToBeUpdated in local storage:",taskToBeUpdated)
        console.log("parsedData in local storage:",parsedData)
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

const deleteTaskfromLocalStorage =(id)=>{
    try{
        const updatedTasks = Tasks.filter(task => task.id !== id);
        localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
        window.location.reload();
    }catch(error){
        console.error("Error in deleting task");
    }



}
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

        Object.entries(statusSections).forEach(([status, section]) => {
            section.innerHTML = "";
            section.addEventListener("dragover", dragoverHandler);
            section.addEventListener("drop", (e) => dropEventHandler(e, status)); 
        });

        Tasks.forEach((task) => {
            const section = statusSections[task.status];
            if (!section) return;

            const taskCard = document.createElement("div");
            taskCard.id = `task-${task.id}`;
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
                <div>
                    <i class="fa-regular fa-pen-to-square cursor-pointer hover:text-blue-300" onclick="updateTaskDetail(${task.id})"></i>
                    <i class="fa-solid fa-trash cursor-pointer hover:text-blue-300 ml-2" onclick="deleteTaskfromLocalStorage(${task.id})"></i>
                </div>
            </div>
        `;

            section.appendChild(taskCard);
        });
    } catch (error) {
        console.error("Error in displaying tasks:", error);
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
        console.error("Error in Update tasks:", error);
    }
}

// Search task with task id

const searchTask = () => {
    const searchBarValue = Number(document.getElementById("searchBar").value.trim());
    const searchedTask = Tasks.find(task => task.id === searchBarValue)
    if (searchedTask === undefined) {
        alert("Task not found!");
        return;
    }
    const searchTaskElement = document.getElementById(`task-${searchedTask.id}`);
    if (!searchTaskElement) {
        console.warn("Task DOM element not found.");
        return;
    }
    const originalBackground = searchTaskElement.style.backgroundColor;
    searchTaskElement.style.backgroundColor = "red";
    searchTaskElement.scrollIntoView({  block: "center" });
    setTimeout(() => {
        searchTaskElement.style.backgroundColor = originalBackground || "black";
    }, 3000);

}

// Drag And Drop Task

const dragstartHandler=(e)=> {
    console.log("e in dragstartHandler :",e)
    e.dataTransfer.setData("text", e.target.id);
}
const dragoverHandler=(e) =>{
    e.preventDefault();
    console.log("e in dragoverHandler :",e)

}
const dropEventHandler = (e ,newStatus)=>{
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain")
    console.log("e in dropEventHandler :",e)
    console.log("data    in dropEventHandler:",data)
    const draggedElem = document.getElementById(data);
    if (!draggedElem) return;
    e.currentTarget.appendChild(draggedElem);
    const taskId = parseInt(data.replace("task-", ""));
    const taskToUpdate = Tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
        console.log("newStatus:",newStatus)
        taskToUpdate.status = newStatus;
    }
    updateTaskInLocalStorage(taskToUpdate)
}



window.onload = () => {
    // fetch saved tasked in local storage on page load
    getTasksFromLocalStorage();
    displayAllTasks();
    loadSavedHeadings();


}
import { Tasks } from "./main.js"


export const saveTaskDetailToLocalStorage = (data) => {
    try {
        const existingTasks =
            JSON.parse(localStorage.getItem("Tasks")) || [];
        existingTasks.push(data);
        localStorage.setItem("Tasks", JSON.stringify(existingTasks));
    } catch (error) {
        console.error("error while saving tasks in local storage :", error);
    }
}

export const getTasksFromLocalStorage = (task) => {
    try {
        const parsedData = JSON.parse(localStorage.getItem("Tasks")) || [];
        Tasks.push(...parsedData); //use spread operator to push multiple taks seprately 
    } catch (error) {
        console.error("error while load tasks from local storage :", error);
    }
}

export const updateTaskInLocalStorage = (updatedTask) => {
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
        console.error("error while Updating tasks In local storage :", error);
    }
};

export const deleteTaskfromLocalStorage = (id) => {
    try {
        const updatedTasks = Tasks.filter(task => task.id !== id); //filter method will return elements that pass the condition
        localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
        window.location.reload();
    } catch (error) {
        console.error("Error while deleting task in local storage:", error);
    }
}

window.deleteTaskfromLocalStorage = deleteTaskfromLocalStorage;  // Expose functions to global scope (so they can be called from HTML onclick)


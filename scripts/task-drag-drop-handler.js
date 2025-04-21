import { Tasks } from "./main.js"
import { updateTaskInLocalStorage } from "./local-storage-handler.js"

//save id for respected task element from list
export const dragstartHandler = e => e.dataTransfer.setData("text", e.target.id);


export const dragoverHandler = e => e.preventDefault()

export const dropEventHandler = (e, newStatus) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text")    //fetch same id 
    const draggedElem = document.getElementById(data);
    if (!draggedElem) return;
    e.currentTarget.appendChild(draggedElem);
    const taskId = parseInt(data.replace("task-", ""));
    const taskToUpdate = Tasks.find(t => t.id === taskId); // find method return first object that pass the condition
    if (taskToUpdate) {
        taskToUpdate.status = newStatus;
    }
    updateTaskInLocalStorage(taskToUpdate)
}

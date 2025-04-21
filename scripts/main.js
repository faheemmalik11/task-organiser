import {getTasksFromLocalStorage} from "./local-storage-handler.js"
import {loadSavedHeadings} from "./sectionHeadingHandler.js" 
import {displayAllTasks} from "./taskHandler.js"

export const Tasks = [];


window.onload = () => {
    getTasksFromLocalStorage();
    displayAllTasks();
    loadSavedHeadings();
}
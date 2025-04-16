
const addTaskModal = document.getElementById("addTaskModal")
const Tasks = [];

const showAddTaskModal =()=>{
    addTaskModal.style.display="flex"
}

const closeAddTaskModal=()=>{
    addTaskModal.style.display="none"
}

const saveTaskDetailToLocalStorage =(data)=>{
    try{
        const existingTasks = JSON.parse(localStorage.getItem("Tasks")) || [];
        existingTasks.push(data);
        localStorage.setItem("Tasks", JSON.stringify(existingTasks));
    }catch(error){
        throw error;
    }
}

const getTasksFromLocalStorage =()=>{
    try{
        const parsedData = JSON.parse(localStorage.getItem("Tasks")) || [];
        Tasks.push(parsedData);
    }catch(error){
        throw error;
    }
}

const generateUniqueTaskId = () => {
    return Date.now(); 
}

const getTaskDataOnSubmitForm=()=>{
    try{
        const taskDescription = document.getElementById("description").value.trim();
        const taskPriority = document.getElementById("priority").value;
        const taskDueTime = document.getElementById("dueDate").value;
        const taskStatus = document.getElementById("status").value;
        const taskdata={
            id:generateUniqueTaskId(),
            description:taskDescription,
            priority:taskPriority,
            date:taskDueTime,
            status:taskStatus,
        }
        saveTaskDetailToLocalStorage(taskdata)
    }catch(error){
        throw error;
    }
}




window.onload = ()=>{
// fetch saved tasked in local storage on page load
    getTasksFromLocalStorage();

}
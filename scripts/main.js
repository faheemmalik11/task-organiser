
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
        Tasks.push(...parsedData);
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
        closeAddTaskModal();
        displayAllTasks();
    }catch(error){
        throw error;
    }
}

const changeBackgroundColorOnPriority = (priority)=>{
    switch(priority){
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


const displayAllTasks =()=>{
    const backlogTasks = document.getElementById("backlogTasks")
    backlogTasks.innerHTML="";
    console.log("tasks in display fucntiom:",Tasks)
    Tasks.forEach((task)=>{
        if(task.status == "Backlog"){
            const taskCard = document.createElement("div");
            taskCard.className = "bg-black rounded-lg p-4 mb-4 text-white shadow cursor-pointer";
            taskCard.setAttribute("draggable", "true");
            // taskCard.setAttribute("data-task-id", task.id); 
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
                <span class="flex items-center gap-1"><i class="fa-regular fa-clock"></i> ${formattedDate}</span>
            `;
            backlogTasks.appendChild(taskCard);
        }
    
    })
}




window.onload = ()=>{
// fetch saved tasked in local storage on page load
    getTasksFromLocalStorage();
    
    displayAllTasks();

}
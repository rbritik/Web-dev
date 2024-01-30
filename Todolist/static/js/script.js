document.addEventListener("DOMContentLoaded", function() {
    fetch('/get_tasks/')
        .then(response => response.json())
        .then(data => {
            // render tasks on the page
            console.log(data);
            renderTasks(data);
        })
        .catch(error => {   
            console.error('Error:', error);
        });
    
    const btntoAdd = document.getElementById('btn-to-add');
    btntoAdd.addEventListener('click', function() {
        window.location.href = '/add_task/'
    })

    function renderTasks(tasks) {
        const tasksContainer = document.getElementById('taskContainer');
        tasksContainer.innerHTML = '';

        tasks.forEach((task, index) => {
            const taskDiv = document.createElement('div')
            taskDiv.classList.add('todo');

            const taskInfoDiv = document.createElement('div');
            taskInfoDiv.classList.add('todo-info');

            const taskTitle = document.createElement('h2');
            taskTitle.textContent = (index + 1).toString() + ". " + task.task_name;

            // Check if task.done is true and apply strikethrough only to the task name part
            if (task.done) {
                const taskNameSpan = document.createElement('span');
                taskNameSpan.style.textDecoration = 'line-through';
                taskNameSpan.textContent = task.task_name;
                taskTitle.innerHTML = (index + 1).toString() + ". ";
                taskTitle.appendChild(taskNameSpan);
            }

            const taskDescription = document.createElement('p');
            taskDescription.textContent = task.description;

            const btnComplete = document.createElement('a');
            btnComplete.href = '#';
            if (task.done == false) {
                btnComplete.textContent = 'Mark Complete';
            }
            else {
                btnComplete.textContent = 'Mark InComplete';
            }
            btnComplete.classList.add('btn-to-complete');
            btnComplete.addEventListener('click', function() {
                markComplete(task.id);
            })

            const btnEdit = document.createElement('a');
            btnEdit.href = "/edit_task/" + `${task.id}`;
            // console.log(btnEdit.href);
            btnEdit.textContent = 'Edit';
            btnEdit.classList.add('btn-to-edit');

            const btnDelete = document.createElement('a');
            btnDelete.href = "#";
            btnDelete.textContent = 'Delete';
            btnDelete.classList.add('btn-to-delete');
            btnDelete.addEventListener('click', function() {
                deleteTask(task.id);
            })
            
            
            taskInfoDiv.appendChild(taskTitle);
            taskInfoDiv.appendChild(taskDescription);
            taskInfoDiv.appendChild(btnComplete);
            taskInfoDiv.appendChild(btnEdit);
            taskInfoDiv.appendChild(btnDelete);

            taskDiv.appendChild(taskInfoDiv);
            
            tasksContainer.appendChild(taskDiv);
        });
    }

    function markComplete(taskId) {
        fetch('/get_tasks/' + taskId, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task Status Changed: ', data);
            renderTasks(data);
        })
        .catch(error => {
            console.error("Error in Changing status of task: ", error);
        });
    }

    function deleteTask(taskId) {
        fetch('/delete_task/' + taskId, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task Deleted:', data);
            renderTasks(data);
        })
        .catch(error => {
            console.error("Error in deleting task:", error);
        })
    }

});
document.addEventListener("DOMContentLoaded", function() {
    var pathSegments = window.location.pathname.split('/');
    var taskId = pathSegments[pathSegments.length - 2]; 
    // console.log(taskId);
    taskId = parseInt(taskId, 10);

    fetch('/get_task/' + taskId + '/')
    .then(response => response.json())
    .then(data => {
        document.getElementById('taskName').value = data.task.task_name;
        document.getElementById('taskDescription').value = data.task.description;
    })
    .catch(error => console.error('Error fetching task details:', error));

    document.getElementById('taskForm').addEventListener('submit', function(event) {
        event.preventDefault();

        var updatedTaskName = document.getElementById('taskName').value;
        var updatedTaskDescription = document.getElementById('taskDescription').value;

        // Send a POST request to update the task
        fetch('/edit_task/' + taskId + '/', {
            method: 'POST',
            headers: {
                'content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'taskName': updatedTaskName,
                'taskDescription': updatedTaskDescription,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            window.location.href = '/';
        })
        .catch(error => console.error('Error updating task:', error));
    });
});
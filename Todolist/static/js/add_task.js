document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('taskForm');

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const taskName = document.getElementById('taskName').value;
        const taskDescription = document.getElementById('taskDescription').value;
        console.log(taskName + taskDescription);
        fetch('/add_task/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                taskName: taskName,
                taskDescription: taskDescription
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task added successfully: ', data);
            // Redirect to tasks page
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error adding task:', error);
        });
    }); 
});
from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__, template_folder='templates', static_folder='static')

tasks = [
        {"task_name": "Coding", "description": "Time: 5:00pm to 6:30pm", "done": False},
        {"task_name": "Exercise", "description": "Time: 7:00pm to 8:30pm", "done": False}
]

# current_id = 3

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_tasks/', methods=['GET'])
def get_tasks():
    return jsonify({"tasks": tasks})

@app.route('/get_task/<int:task_id>/', methods=['GET'])
def get_task(task_id):
    task = tasks[task_id]
    return jsonify({'task': task})

@app.route('/get_tasks/<int:task_id>', methods=['POST'])
def change_status(task_id):
    if tasks[task_id]['done'] == True:
        tasks[task_id]['done'] = False
    else:
        tasks[task_id]['done'] = True
    return jsonify({"tasks": tasks})

@app.route('/add_task/', methods=['GET', 'POST'])
def add_task():
    if request.method == 'POST':
        task_name = request.form.get('taskName')
        task_description = request.form.get('taskDescription')
        new_task = {'task_name': task_name, 'description': task_description, 'done': False}
        # print(new_task)
        tasks.append(new_task)
        
        return jsonify({'status': 'success', 'message': 'Task added succesfully'})
     
    return render_template('add_task.html')

@app.route('/edit_task/<int:task_id>/', methods=['GET', 'POST'])
def edit_task(task_id):
    task = tasks[task_id]
    if request.method == 'POST':
        task_name = request.form.get('taskName')
        task_description = request.form.get('taskDescription')
        
        task['task_name'] = task_name 
        task['description'] = task_description
        
        return jsonify({'status': 'success', 'message': 'Task updated succesfully'})
    return render_template('edit_task.html', task = task)

@app.route('/delete_task/<int:task_id>/', methods=['POST'])
def delete_task(task_id):
    tasks.pop(task_id)
    return jsonify({"tasks": tasks})

if __name__ == "__main__":
    app.run(debug=True)
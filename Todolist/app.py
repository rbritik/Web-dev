import json
from flask import Flask, render_template, request, jsonify
import db

app = Flask(__name__, template_folder='templates', static_folder='static')

# tasks = [
#         {"task_name": "Coding", "description": "Time: 5:00pm to 6:30pm", "done": False},
#         {"task_name": "Exercise", "description": "Time: 7:00pm to 8:30pm", "done": False}
# ]

DB = db.DatabaseDriver()

def success_response(data, code=200):
    return json.dumps(data), code


def failure_response(message, code=404):
    return json.dumps({"error": message}), code 


@app.route('/')
@app.route('/tasks/')
def index():
    return render_template('index.html')

@app.route('/get_tasks/', methods=['GET'])
def get_tasks():
    return success_response(DB.get_all_tasks())

@app.route('/get_task/<int:task_id>/', methods=['GET'])
def get_task(task_id):
    task = DB.get_task_by_id(task_id)
    return task

@app.route('/get_tasks/<int:task_id>', methods=['POST'])
def change_status(task_id):
    task = DB.get_task_by_id(task_id)
    if task is not None:
        task_name = task['task_name']
        description = task['description']
        done = False if task['done'] else True 
        DB.update_task_by_id(task_name, description, done, task_id)
        return success_response(DB.get_all_tasks()) 
    
    return failure_response("Task not found!")

@app.route('/add_task/', methods=['GET', 'POST'])
def add_task():
    """Endpoint for creating a task"""
    if request.method == 'POST':
        task_name = request.form.get('taskName')
        description = request.form.get('taskDescription')
        task_id = DB.insert_task_table(task_name, description, False)
        task = DB.get_task_by_id(task_id)
        if task is not None:
            return success_response(task, 201)
        return failure_response("Something went wrong while adding task!")
    return render_template('add_task.html')

@app.route('/edit_task/<int:task_id>/', methods=['GET', 'POST'])
def edit_task(task_id):
    task = DB.get_task_by_id(task_id)
    if task is not None:
        if request.method == 'POST':
            task_name = request.form.get('taskName')
            description = request.form.get('taskDescription')
            done = task['done']
            DB.update_task_by_id(task_name, description, done, task_id)
            task = DB.get_task_by_id(task_id)
            return success_response(task, 201)
        return render_template('edit_task.html')
    return failure_response('Task not Found!')
    

@app.route('/delete_task/<int:task_id>/', methods=['POST'])
def delete_task(task_id):
    task = DB.get_task_by_id(task_id)
    if task is not None:
        DB.delete_task_by_id(task_id)
        return success_response(DB.get_all_tasks())
    return failure_response('Task not Found!')

if __name__ == "__main__":
    app.run(debug=True)
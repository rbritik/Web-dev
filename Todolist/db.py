import os
import sqlite3 

def singleton(cls):
    instances = {}
    def getinstances():
        if cls not in instances:
            instances[cls] = cls()
        return instances[cls]
    return getinstances 

class DatabaseDriver(object):
    """ 
    Database driver for the Task app
    Handles with reading and writing data with the database.
    """
    def __init__(self):
        """ 
        Secure a connection with the database and stroes it into the instance variable conn"""
        self.conn = sqlite3.connect('todo.db', check_same_thread=False)
        self.create_task_table()
        
    def create_task_table(self):
        """ 
        Using SQL, creates a task table
        """
        self.conn.execute("""CREATE TABLE IF NOT EXISTS task(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            taskname TEXT NOT NULL,
            description TEXT NOT NULL,
            done BOOLEAN NOT NULL
        )
                          """)
        
    def delete_task_table(self):
        """ 
        Using SQL, creates a task table
        """
        self.conn.execute("""DROP TABLE IF EXISTS task""")
        
        
    def get_all_tasks(self):
        """ 
        Using SQL, returns all the tasks in a table"""
        cursor = self.conn.execute("SELECT * FROM task")
        tasks = []
        for row in cursor:
            tasks.append({"id": row[0], "task_name": row[1], "description": row[2], "done": row[3]})
        # print(tasks)
        return tasks 
    
    def get_task_by_id(self, id):
        """ 
        Using SQL, gets a task by id
        """
        cursor = self.conn.execute("SELECT * FROM task WHERE id = ?;", (id,))
        
        for row in cursor:
            return ({"id": row[0], "task_name": row[1], "description": row[2], "done": row[3]})
        return None
    
    def insert_task_table(self, task_name, description, done):
        """ 
        Using SQL, inserts a task into the task table 
        """
        cursor = self.conn.execute("INSERT INTO task(taskname, description ,done) VALUES(?,?,?);", (task_name, description, done))
        self.conn.commit()
        return cursor.lastrowid 
    
    def update_task_by_id(self, task_name, description, done, id):
        """
        Using SQL, updates a task in our table 
        """
        self.conn.execute("""UPDATE task
                          SET
                          taskname = ?,
                          description = ?,
                          done = ?
                          WHERE id = ?;
                          """, (task_name, description , done, id))
        self.conn.commit()
    
    def delete_task_by_id(self, id):
        """ 
        Using SQL, deletes a task from our table"""
        self.conn.execute("DELETE FROM task WHERE id=?;", (id,))
        self.conn.commit()
        
DatabaseDriver = singleton(DatabaseDriver)
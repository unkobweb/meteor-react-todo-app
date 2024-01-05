import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Task } from './Task.jsx';
import { TasksCollection } from '../api/TasksCollection.js';
import { TaskForm } from './TaskForm.jsx';

const toggleChecked = ({_id, isChecked}) => {
  TasksCollection.update(_id, {
    $set: {
      isChecked: !isChecked
    }
  })
}

const deleteTask = ({_id}) => TasksCollection.remove(_id)

export const App = () => {
  const tasks = useTracker(() => TasksCollection.find({}, {sort: {createdAt: -1}}).fetch())

  return (
    <div>
      <h1>Welcome to Meteor!</h1>

      <TaskForm />

      <ul>
        {tasks.map(task => <Task key={task._id} task={task} onCheckboxClick={toggleChecked} onDeleteClick={deleteTask}/>)}
      </ul>
    </div>
  )
};

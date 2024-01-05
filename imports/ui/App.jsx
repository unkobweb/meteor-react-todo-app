import React, { useState, Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Task } from './Task.jsx';
import { TasksCollection } from '../api/TasksCollection.js';
import { TaskForm } from './TaskForm.jsx';
import { LoginForm } from './LoginForm.jsx';

const toggleChecked = ({_id, isChecked}) => {
  TasksCollection.update(_id, {
    $set: {
      isChecked: !isChecked
    }
  })
}

const deleteTask = ({_id}) => TasksCollection.remove(_id)

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false)
  const user = useTracker(() => Meteor.user())

  const hideCompletedFilter = { isChecked: { $ne: true } }
  const userFilter = user ? { userId: user._id } : {}

  const filter = hideCompleted ? {...hideCompletedFilter, ...userFilter} : userFilter

  const tasks = useTracker(() => TasksCollection.find(filter, {sort: {createdAt: -1}}).fetch())

  const pendingTasksCount = useTracker(() => {
    if (!user) return 0

    return TasksCollection.find(hideCompletedFilter).count()
  });

  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : ''
  }`;

  const logout = () => Meteor.logout()

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>📝️ To Do List {pendingTasksTitle}</h1>
          </div>
        </div>
      </header>

      <div className="main">
      {user ? (
          <Fragment>
            <div className="user" onClick={logout}>
              {user.username || user.profile.name} 🚪
            </div>
            
            <TaskForm user={user} />

            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>

            <ul className="tasks">
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  )
};

import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../imports/db/TasksCollection';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/tasksMethods';

const insertTask = (taskText, user) => 
  TasksCollection.insert({ 
    text: taskText,
    userId: user._id, 
    createdAt: new Date() 
  });

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(async () => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(taskText => insertTask(taskText, user))
  }
});

ServiceConfiguration.configurations.upsert(
  {service: 'github'},
  {
    $set: {
      loginStyle: 'popup',
      clientId: '8515e30eaf62616d1356',
      secret: '6b6bd5fb09799575497fa7156fbb037b21ebcc95'
    }
  }
)
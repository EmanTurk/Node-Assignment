import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const usersFilePath = './users.json';

function readUsers() {
  if (fs.existsSync(usersFilePath)) {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  }
  return [];
}

function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

async function createUser(name, email, password) {
  const users = readUsers();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword
  };
  users.push(newUser);
  writeUsers(users);
}

function readUser(id) {
  const users = readUsers();
  return users.find(user => user.id === id);
}

// Update a user
async function updateUser(id, name, email, password) {
  const users = readUsers();
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    if (password) users[userIndex].password = await bcrypt.hash(password, 10);
    writeUsers(users);
  }
}

// Delete a user
function deleteUser(id) {
  const users = readUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  writeUsers(filteredUsers);
}

yargs(hideBin(process.argv))
  .command('create', 'Create a new user', {
    name: { describe: 'User name', demandOption: true, type: 'string' },
    email: { describe: 'User email', demandOption: true, type: 'string' },
    password: { describe: 'User password', demandOption: true, type: 'string' }
  }, async (argv) => {
    await createUser(argv.name, argv.email, argv.password);
    console.log('User created successfully');
  })
  .command('read', 'Read a user', {
    id: { describe: 'User ID', demandOption: true, type: 'string' }
  }, (argv) => {
    const user = readUser(argv.id);
    if (user) {
      console.log('User Found:', user);
    } else {
      console.log('User not found');
    }
  })
  .command('update', 'Update a user', {
    id: { describe: 'User ID', demandOption: true, type: 'string' },
    name: { describe: 'User name', type: 'string' },
    email: { describe: 'User email', type: 'string' },
    password: { describe: 'User password', type: 'string' }
  }, async (argv) => {
    await updateUser(argv.id, argv.name, argv.email, argv.password);
    console.log('User updated successfully');
  })
  .command('delete', 'Delete a user', {
    id: { describe: 'User ID', demandOption: true, type: 'string' }
  }, (argv) => {
    deleteUser(argv.id);
    console.log('User deleted successfully');
  })
  .demandCommand(1, 'You need at least one command to proceed.')
  .help()
  .alias('help', 'h')
  .argv;

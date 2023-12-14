const { db } = require('../../config/firebase');
const todoModel = require('../../models/firebase/todo');
const { v4: uuid4 } = require('uuid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../exceptions/ServerError');

class TodoRepository {
  async getTodos() {
      const todos = await db.collection('todo').get();
      const todosArray = [];

      todos.forEach(doc => {
        const todo = new todoModel(
            doc.data().uuid, 
            doc.data().todo_name, 
            doc.data().status, 
            doc.data().is_active
        );
        todosArray.push(todo);
    });

    return todosArray;
  }

  async createTodo(params) {
    const { uuid = uuid4(),todo_name, status = 1, is_active = 1 } = params
    const data = {
      uuid,
      todo_name,
      status,
      is_active
    };

    try {
      const create = await db.collection('todo').doc(uuid).set(data);

      if(create) {
        return data;
      } else {
        throw new ServerError('Error Insert Data')
      }
    } catch (err) {
      throw new ServerError('Error Insert data');
    }
  }

  async getOneTodo(uuid) {
    if(uuid === '') {
      throw new InvariantError('UUID not Provided');
    }

    const docRef = db.collection('todo').doc(uuid);
    const doc = await docRef.get();

    if(doc.exists) {
      return doc.data();
    } else {
      throw new NotFoundError('Todo not found');
    }
  }

  async updateTodo(params) {
    const { uuid, todo_name, status = 1, is_active = 1 } = params

    const data = {
      todo_name,
      status,
      is_active
    };

    try {
      const cityRef = db.collection('todo').doc(uuid);
      const update = await cityRef.update(data);

      if(update) {
        return data;
      } else {
        throw new ServerError('Error Update data');
      }
    } catch (err) {
      throw new ServerError('Error Update data');
    }
  }
}

module.exports = TodoRepository ;
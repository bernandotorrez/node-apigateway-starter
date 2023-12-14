const { db, getDocs, collection, doc, setDoc, addDoc, getDoc, updateDoc } = require('../../config/firebase');
const todoModel = require('../../models/firebase/todo');
const { v4: uuid4 } = require('uuid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../exceptions/ServerError');

class TodoRepository {
  async getTodos() {
      const todos = await getDocs(collection(db, 'todo'));
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
      await setDoc(doc(db, 'todo', uuid), data);

      return data;
    } catch (err) {
      throw new ServerError('Error insert data');
    }
  }

  async getOneTodo(uuid) {
    if(uuid === '') {
      throw new InvariantError('UUID not Provided');
    }

    const docRef = doc(db, 'todo', uuid);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()) {
      return docSnap.data();
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
      await updateDoc(doc(db, 'todo', uuid), data);

      return data;
    } catch (err) {
      throw new ServerError('Error update data');
    }
  }
}

module.exports = TodoRepository ;
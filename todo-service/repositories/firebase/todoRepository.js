const { db, getDocs, collection, doc, setDoc, addDoc } = require('../../config/firebase');
const todoModel = require('../../models/firebase/todo');
const { v4: uuid4 } = require('uuid');

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

  async createTodo({ uuid = uuid4(),todo_name, status = 1, is_active = 1}) {
    const data = {
      uuid: uuid,
      todo_name,
      status,
      is_active
    };

    await setDoc(doc(db, 'todo', uuid), data)

    return data;
  }
}

module.exports = TodoRepository ;
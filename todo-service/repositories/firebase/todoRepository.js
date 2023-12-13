const { db, getDocs, collection } = require('../../config/firebase');
const todoModel = require('../../models/firebase/todo');

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
}

module.exports = TodoRepository ;
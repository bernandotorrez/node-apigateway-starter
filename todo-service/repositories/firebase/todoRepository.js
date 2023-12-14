const { db, getDocs, collection, doc, setDoc, addDoc, getDoc } = require('../../config/firebase');
const todoModel = require('../../models/firebase/todo');
const { v4: uuid4 } = require('uuid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

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
      uuid,
      todo_name,
      status,
      is_active
    };

    const create = await setDoc(doc(db, 'todo', uuid), data)

    if(!create) {
      return create;
    } else {
      return data;
    }
  }

  async getTodoByUuid(uuid) {
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
}

module.exports = TodoRepository ;
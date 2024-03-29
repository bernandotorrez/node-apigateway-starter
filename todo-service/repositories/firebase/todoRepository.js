const { db } = require('../../config/firebase');
const todoModel = require('../../models/firebase/todo');
const { v4: uuid4 } = require('uuid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ServerError = require('../../exceptions/ServerError');
const BadRequestError = require('../../exceptions/BadRequestError');

class TodoRepository {
  constructor() {
    this._collection = 'todo';
    this._limit = 5;
  }

  async getTodosCursor(next = null) {
    const first = db.collection(this._collection)
      .where('is_active', '==', 1)
      .orderBy('created_date', 'desc')
      .limit(this._limit);

    const snapshot = await first.get();

    const last = snapshot.docs[snapshot.docs.length - 1];
    const currentCreatedDate = last ? last.data().created_date : '';

    const snapshotData = [];
    let todosArray = '';

    if(next) {
      const nextTodos = db.collection(this._collection)
        .where('is_active', '==', 1)
        .orderBy('created_date', 'desc')
        .startAfter(parseInt(next))
        .limit(this._limit);

      const nextData = await nextTodos.get();
      const last = nextData.docs[nextData.docs.length - 1];
      const currentCreatedDate = last ? last.data().created_date : '';

      nextData.forEach(doc => {
        const data = new todoModel(
          doc.data().uuid, 
          doc.data().todo_name, 
          doc.data().status, 
          doc.data().is_active,
          doc.data().created_date,
          doc.data().updated_date
        );

        snapshotData.push(data);
      });

      todosArray = {
        todos: snapshotData,
        loadMore: snapshotData.length >= this._limit ? true : false,
        next: currentCreatedDate
      }
    } else {
      snapshot.forEach(doc => {
        const data = new todoModel(
          doc.data().uuid, 
          doc.data().todo_name, 
          doc.data().status, 
          doc.data().is_active,
          doc.data().created_date,
          doc.data().updated_date
        );

        snapshotData.push(data);
      });

      todosArray = {
        todos: snapshotData,
        loadMore: snapshotData.length >= this._limit ? true : false,
        next: currentCreatedDate
      }
    } 

    return todosArray;
  }

  async getTodos() {
      const todos = await db.collection(this._collection)
      .where('is_active', '==', 1)
      .orderBy('created_date', 'desc')
      .get();
      const todosArray = [];

      todos.forEach(doc => {
        const todo = new todoModel(
            doc.data().uuid, 
            doc.data().todo_name, 
            doc.data().status, 
            doc.data().is_active,
            doc.data().created_date,
            doc.data().updated_date
        );
      todosArray.push(todo);
    });

    return todosArray;
  }

  async createTodo(params) {
    const { 
      uuid = uuid4(),
      todo_name,
      status = 1,
      is_active = 1,
      created_date = Math.floor(new Date().getTime() / 1000),
      updated_date = null,
    } = params

    const data = {
      uuid,
      todo_name,
      status,
      is_active,
      created_date,
      updated_date
    };

    try {
      const create = await db.collection(this._collection).doc(uuid).set(data);

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
    if(!uuid) {
      throw new BadRequestError('UUID is required');
    }

    const docRef = db.collection(this._collection).doc(uuid);
    const doc = await docRef.get();

    if(doc.exists && doc.data().is_active == 1) {
      const todo = new todoModel(
        doc.data().uuid, 
        doc.data().todo_name, 
        doc.data().status, 
        doc.data().is_active
      );

      return todo;
    } else {
      throw new NotFoundError('Todo not found');
    }
  }

  async updateTodo(params) {
    const { 
      uuid,
      todo_name,
      updated_date = Math.floor(new Date().getTime() / 1000),
    } = params

    if(!uuid) {
      throw new BadRequestError('UUID is required');
    }

    const check = await db.collection(this._collection).doc(uuid).get();

    if(!check.exists || check.data().is_active == 0) {
      throw new NotFoundError('Todo does not exist');
    }

    const data = {
      todo_name,
      updated_date
    };

    try {
      const cityRef = db.collection(this._collection).doc(uuid);
      const update = await cityRef.update(data);

      if(update) {
        const todo = new todoModel(
          uuid,
          todo_name
        );
  
        return todo;
      } else {
        throw new ServerError('Error Update data');
      }
    } catch (err) {
      throw new ServerError('Error Update data');
    }
  }

  async deleteTodo(uuid) {
    if(!uuid) {
      throw new BadRequestError('UUID is required');
    }

    const check = await db.collection(this._collection).doc(uuid).get();

    if(!check.exists) {
      throw new NotFoundError('Todo does not exist');
    }

    if(check.data().is_active == 0) {
      throw new InvariantError('Todo already deleted');
    }
    
    const data = { is_active: 0 };

    try {
      const cityRef = db.collection(this._collection).doc(uuid);
      const softDelete = await cityRef.update(data);

      if(softDelete) {
        return uuid;
      } else {
        throw new ServerError('Error Delete data');
      }
    } catch (err) {
      throw new ServerError('Error Delete data');
    }
  }
}

module.exports = new TodoRepository();
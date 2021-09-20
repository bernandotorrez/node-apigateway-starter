const { Task } = require('../../models');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { Op } = require('sequelize');

class TaskRepository {
    constructor() {
        this._model = Task;
    }

    async getTasks({ task = ''}) {
        if(task) {
            return await this._model.findAll({ 
                where: {
                    task: { [Op.substring]: task }
                }
             });
        } else {
            return await this._model.findAll()
        }
        
    }

    async getTask({ id = '' }) {
        if(id == '') {
            throw new InvariantError('ID not provided');
        }

        const task = await this._model.findOne({
            where: { id: id },
        })

        if(!task) {
            throw new NotFoundError('Task not found');
        }

        return task;
    }

    async addTask(params) {
        const data = {
            task: params.task
        }

        try {
            return this._model.create(data)
        } catch (error) {
            throw new InvariantError('Add Task Failed');
        }
    }

    async updateTask({ id, body }) {
        if(id === '') {
            throw new InvariantError('ID not Provided');
        }

        const task = await this._model.findOne({ where: { id: id }});
        if(!task) {
            throw new NotFoundError('Task not found');
        }

        const data = {
            task: body.task,
            status: body.status
        }
        
        try {
            return this._model.update(data, { where: { id: id } })
        } catch (error) {
            throw new InvariantError('Update Task Failed');
        }
    }

    async deleteTask({ id }) {
        if(id === '') {
            throw new InvariantError('ID not Provided');
        }

        const task = await this._model.findOne({ where: { id: id }});
        if(!task) {
            throw new NotFoundError('Task not found');
        }
        
        try {
            return this._model.destroy({ where: { id: id } })
        } catch (error) {
            throw new InvariantError('Delete Task Failed');
        }
    }
}

module.exports = TaskRepository;
const express = require('express');
require('express-async-errors');
const router = express.Router();
const httpStatus = require('http-status');

// Repositories
const TaskRepository = require('../../repositories/mysql/taskRepository');
const taskRepository = new TaskRepository();

const CacheRepository = require('../../repositories/redis/cacheRepository');
const cacheRepository = new CacheRepository();

const rabbitMq = require('../../repositories/messageBroker/rabbitmqRepository');

const taskValidator = require('../../validators/taskValidator');

// Rabbit MQ Example
// await rabbitMq.sendMessage(`export:task:${id}`, JSON.stringify(tasks));

router.get('/', async (req, res) => {
   try {
      const tasks = await cacheRepository.get('task:all');

      res.status(httpStatus.OK).json({
         code: httpStatus.OK,
         status: 'SUCCESS',
         message: httpStatus[`${httpStatus.OK}_NAME`],
         data: JSON.parse(tasks)
      });
   } catch (err) {
      const tasks = await taskRepository.getTasks();

      await cacheRepository.set(`task:all`, JSON.stringify(tasks), 60);

      res.status(httpStatus.OK).json({
         code: httpStatus.OK,
         status: 'SUCCESS',
         message: httpStatus[`${httpStatus.OK}_NAME`],
         data: tasks
      });
   }

})

router.get('/:id', async (req, res) => {
   const {
      id
   } = req.params;

   try {
      const tasks = await cacheRepository.get(`task:${id}`);

      res.status(httpStatus.OK).json({
         code: httpStatus.OK,
         status: 'SUCCESS',
         message: httpStatus[`${httpStatus.OK}_NAME`],
         data: JSON.parse(tasks)
      });
   } catch (error) {
      const tasks = await taskRepository.getTask({
         id
      });
   
      await cacheRepository.set(`task:${id}`, JSON.stringify(tasks), 60);
   
      res.status(httpStatus.OK).json({
         code: httpStatus.OK,
         status: 'SUCCESS',
         message: httpStatus[`${httpStatus.OK}_NAME`],
         data: tasks
      });
   }
})

router.post('/', async (req, res) => {
   taskValidator.AddTaskValidator(req.body);

   try {
      const task = await taskRepository.addTask(req.body);

      if(task) {
         await cacheRepository.delete(`task:all`);
      }

      res.status(httpStatus.CREATED).json({
         code: httpStatus.CREATED,
         status: 'SUCCESS',
         message: httpStatus[`${httpStatus.CREATED}_NAME`],
         data: task
      });
   } catch (error) {
      res.status(httpStatus.OK).json({
         code: httpStatus.OK,
         status: 'ERROR',
         message: error.message,
         data: []
      });
   }
})

router.put('/:id', async (req, res) => {
   const { id } = req.params;
   
   try {
      const task = await taskRepository.updateTask({ id, body: req.body })

      if(task) {
         await cacheRepository.delete(`task:${id}`);
         await cacheRepository.delete(`task:all`);
      }

      res.status(httpStatus.CREATED).json({
         code: httpStatus.CREATED,
         status: 'SUCCESS',
         message: httpStatus[`${httpStatus.CREATED}_NAME`],
         data: task
      });
   } catch (error) {
      res.status(httpStatus.OK).json({
         code: httpStatus.OK,
         status: 'ERROR',
         message: error.message,
         data: []
      });
   }
})

router.delete('/:id', async (req, res) => {
   const { id } = req.params;
   
   try {
      const task = await taskRepository.deleteTask({ id })

      if(task) {
         await cacheRepository.delete(`task:all`);
      }

      res.status(httpStatus.OK).json({
         code: httpStatus.OK,
         status: 'SUCCESS',
         message: httpStatus[`${httpStatus.OK}_NAME`],
         data: task
      });
   } catch (error) {
      res.status(httpStatus.NOT_FOUND).json({
         code: httpStatus.NOT_FOUND,
         status: 'ERROR',
         message: error.message,
         data: id
      });
   }
})

module.exports = router;
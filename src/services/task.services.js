const taskModel = require("../models/task");
const userModel = require("../models/users");
const { validateTaskSchema } = require("../utils/validator");
const {
  getAll,
  getById,
  create,
  update,
  remove,
  getByField,
} = require("../repository/genericRepository");
const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const Joi = require("joi");

async function createTask(taskData) {
  const { error, value } = validateTaskSchema(taskData);
  if (error) {
    throw new ApiError(400, error.message);
  }
  const { salesman, taskDescription, dueDate } = value;

  if (!mongoose.Types.ObjectId.isValid(salesman)) {
    throw new ApiError(400, "Invalid salesman ID format");
  }

  const existingSalesman = await userModel.findById(salesman);
  if (!existingSalesman) {
    throw new ApiError(404, "Salesman not found");
  }

  const newTask = await create(taskModel, {
    salesman,
    taskDescription,
    dueDate,
  });

  return newTask;
}

async function getAllTasks() {
  try {
    const tasks = await taskModel.find().populate("salesman", "name"); // populate salesman with only 'name'
    return tasks;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch tasks");
  }
}

async function getTasksBySalesmanId(salesmanId) {
  try {
    return await getByField(taskModel, "salesman", salesmanId);
  } catch (error) {
    throw error;
  }
}

async function updateTaskStatus(id, status, salesmanId) {
  const { error } = Joi.object({
    status: Joi.string()
      .valid("pending", "in-progress", "completed")
      .required(),
  }).validate({ status });

  if (error) throw new ApiError(400, `Invalid status: ${error.message}`);

  const task = await taskModel.findById(id);
  if (!task) throw new ApiError(404, "Task not found");

  if (task.salesman.toString() !== salesmanId) {
    throw new ApiError(403, "You are not authorized to update this task");
  }

  const updatedTask = await update(taskModel, id, { status });
  return updatedTask;
}

async function deleteTask(id) {
  const deletedTask = await remove(taskModel, id);
  return deletedTask;
}

module.exports = {
  createTask,
  getAllTasks,
  getTasksBySalesmanId,
  updateTaskStatus,
  deleteTask,
};

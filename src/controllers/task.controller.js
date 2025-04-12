const taskService = require("../services/task.services");
const notificationService = require("../services/notification.services");

async function handleCreateTask(req, res) {
  const { salesman, taskDescription, dueDate } = req.body;

  try {
    const newTask = await taskService.createTask({
      salesman,
      taskDescription,
      dueDate,
    });

    await notificationService.createNotification({
      recipient: salesman,
      recipientType: "user-stas",
      message: `You have been assigned a new task: "${taskDescription}".`,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while creating the task",
    });
  }
}

async function handleGetAllTasks(req, res) {
  try {
    const tasks = await taskService.getAllTasks();
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while fetching tasks",
    });
  }
}

async function handleGetTasksBySalesmanId(req, res) {
  const { salesmanId } = req.params;

  try {
    const tasks = await taskService.getTasksBySalesmanId(salesmanId);
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
}

async function handleUpdateTaskStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const salesmanId = req.user.id;

  try {
    const updatedTask = await taskService.updateTaskStatus(
      id,
      status,
      salesmanId
    );

    await notificationService.createNotification({
      recipient: null,
      recipientType: "testadmin",
      message: `Task "${updatedTask.taskDescription}" has been marked as "${status}" by the salesman.`,
    });

    return res.status(200).json({
      message: `Task status updated by user ${salesmanId}`,
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message:
        error.message || "An error occurred while updating the task status",
    });
  }
}

async function handleDeleteTask(req, res) {
  const { id } = req.params;

  try {
    await taskService.deleteTask(id);
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while deleting the task",
    });
  }
}

module.exports = {
  handleCreateTask,
  handleGetAllTasks,
  handleGetTasksBySalesmanId,
  handleUpdateTaskStatus,
  handleDeleteTask,
};

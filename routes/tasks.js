var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get All tasks
router.get('/', async function (req, res) {
  try {
    const tasks = await prisma.task.findMany();

    return res.status(200).json({
      code: 200,
      message: 'Task berhasil ditemukan',
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || 'Terjadi kesalahan saat mengambil data',
    });
  }
});

// Create task
router.post('/', async function (req, res) {
  try {
    const { title, desc, priority, deadline, status, user_id } =
      req.body;

    // tambah validasi jika data belum lengkap
    if (!(title && desc && priority && deadline && status && user_id)) {
      return res.status(400).json({
        code: 400,
        message:
          'Tolong lengkapi semua data (title, desc, priority, deadline, status, user_id)',
      });
    }

    const task = await prisma.task.create({
      data: {
        title: title,
        desc: desc,
        priority: priority,
        deadline: deadline,
        status: status,
        user_id: user_id,
        
      },
    });

    return res.status(201).send({
      code: 201,
      message: 'Task berhasil dibuat',
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || 'Terjadi kesalahan saat menginsert data',
    });
  }
});

// Detail task
router.get('/:taskId', async function (req, res) {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(taskId),
      },
    });

    // tambah validasi jika id task tidak valid
    if (!task) {
      return res.status(404).json({
        code: 404,
        message: 'Task tidak ditemukan',
      });
    }

    return res.status(200).json({
      code: 200,
      message: 'Task berhasil ditemukan',
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || 'Terjadi kesalahan saat mengambil data',
    });
  }
});

// Update task
router.put('/:taskId', async function (req, res) {
  try {
    const { taskId } = req.params;
    const {
      title,
      desc,
      priority,
      deadline,
      status,
    } = req.body;

    // tambah validasi jika data belum lengkap
    if (!(title && desc && priority && deadline && status)) {
      return res.status(400).json({
        code: 400,
        message:
          'Tolong lengkapi semua data (title, desc, priority, deadline, status)',
      });
    }

    // tambah validasi apakah id task sudah valid
    const taskExists = await prisma.task.findUnique({
      where: {
        id: parseInt(taskId),
      },
    });
    if (!taskExists) {
      return res.status(404).json({
        code: 404,
        message: 'Task tidak ditemukan',
      });
    }

    const task = await prisma.task.update({
      where: {
        id: parseInt(taskId),
      },
      data: {
        title: title,
        desc: desc,
        priority: priority,
        deadline: deadline,
        status: status,
        
   
      },
    });
    return res.status(200).json({
      code: 200,
      message: 'Task berhasil diupdate',
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || 'Terjadi kesalahan saat mengupdate data',
    });
  }
});

// Delete task
router.delete('/:taskId', async function (req, res) {
  try {
    const { taskId } = req.params;

    // tambah validasi apakah id task sudah valid
    const taskExists = await prisma.task.findUnique({
      where: {
        id: parseInt(taskId),
      },
    });
    if (!taskExists) {
      return res.status(404).json({
        code: 404,
        message: 'Task tidak ditemukan',
      });
    }

    const task = await prisma.task.delete({
      where: {
        id: parseInt(taskId),
      },
    });

    return res.status(200).json({
      code: 200,
      message: 'Task berhasil dihapus',
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || 'Terjadi kesalahan saat delete data',
    });
  }
});

module.exports = router;

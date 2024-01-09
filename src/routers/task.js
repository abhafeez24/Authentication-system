const express = require("express");
const Tasks = require("../models/task");

const auth = require('../middlewares/auth')
const router = new express.Router();

router.post("/task",auth ,async (req, res) => {
  //const task = new Tasks(req.body);
  const task = new Tasks({
    ...req.body,
    owner: req.user._id
  })

  //   task.save().then(() => {
  //       res.status(202).send(task);
  //     }).catch((e) => {
  //       res.status(400).send(e);
  //   });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});


//GET /task?completed=true
//GET /task?limi=10&skip=10
//GET /task?sortBy=createdAt:desc
router.get("/task", auth, async (req, res) => {
  // Task.find({}).then((tasks) => {
  //   res.send(tasks);
  // }).catch((e) => {
  //   res.status(500).send();
  // });

  const match ={}

  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    // const task = await Tasks.find({owner: req.user._id});
    await req.user.populate({
      path:  'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    })
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;

  //   Task.find({ completed }).then((task) => {
  //       if (!task) {
  //         return res.status(404).send();
  //       }
  //       res.send(task);
  //     }).catch((e) => {
  //       res.status(500).send();
  //     });
  try {
    const task = await Tasks.findOne({_id, owner: req.user._id})
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/task/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidKey = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidKey) {
    return res.status(404).send({ Error: "Invalid Updates!" });
  }
  try {
    const task = await Tasks.findOne({_id: req.params.id, owner: req.user.id})
    // const task = await Tasks.findById(req.params.id)

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      //   new: true,
      //   runValidators: true,
      // });
      
      if (!task) {
        return res.status(404).send();
      }
      updates.forEach((update)=> task[update] = req.body[update])
  
      task.save()
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/task/:id", auth, async (req, res) => {
  try {
    const task = await Tasks.findByIdAndDelete({_id:req.params.id, owner: req.user._id});

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(e);
  }
});

module.exports = router;

const express = require('express')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router();

router.post("/users", async (req, res) => {
    const user = new User(req.body);
  
    // user.save().then(()=> {
    //     res.status(202).send(user);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({user, token});
    } catch (error) {
      res.status(400).send(error);
    }
  });
  

router.post('/user/login', async(req, res)=> {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password) 
    const token = await user.generateAuthToken();
    res.send({user, token});
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/user/logout', auth , async(req,res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.user.save()
    res.send('Logged Out')
  } catch (error) {
    res.status(500).send(e);
  }
})

router.post('/user/logoutAll', auth, async(req,res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.status(200).send('Logged Out All')
  } catch (error) {
    res.status(500).send();
  }
})

  // router.get("/users", auth, async (req, res) => {
  //   // User.find({}).then((user) => {
  //   //     res.send(user);
  
  //   // }).catch((e)=> {
  //   //     res.status(500).send();
  //   // });
  
  //   try {
  //     const users = await User.find({});
  //     res.send(users);
  //   } catch (error) {
  //     res.status(500).send();
  //   }
  // });
  router.get("/users/me", auth, async (req, res) => {
    // User.find({}).then((user) => {
    //     res.send(user);
  
    // }).catch((e)=> {
    //     res.status(500).send();
    // });
    res.send(req.user)
  });
  
  // router.get("/user/:id", async (req, res) => {
  //   const _id = req.params.id;
  //   // console.log(req.params)
  
  //   // User.findById(_id).then((user)=> {
  //   //     if(!user) {
  //   //         return res.status(404).send();
  //   //     }
  //   //     res.send(user);
  //   // }).catch((e)=> {
  //   //     res.status(500).send();
  //   // });
  
  //   try {
  //     const user = await User.findById(_id);
  //     if (!user) {
  //       return res.status(404).send();
  //     }
  //     res.send(user);
  //   } catch (e) {
  //     res.status(500).send();
  //   }
  // });
  
  router.patch('/user/me', auth, async(req, res)=> {
      const updates = Object.keys(req.body)
      const allowedUpdates = ['name', 'email', 'password', 'age']
      const isValidKey = updates.every((update) => allowedUpdates.includes(update))
  
      if(!isValidKey) {
          return res.status(400).send({Error:'Invalid Updates!'})
      }
  
      try {
        // const user = await User.findById(req.params.id)
        updates.forEach((update)=> req.user[update] = req.body[update])

        await req.user.save();
        //  const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
  
          // if(!user) {
          //     return res.status(404).send();
          // }
  
          res.send(req.user)
      } catch (e) {
          res.status(400).send(e);
      }
  })
  
  router.delete('/user/me', auth, async(req, res) => {
      try {
          await req.user.deleteOne();
          await Task.deleteMany({owner:req.user._id})
          res.send(req.user);
      } catch (e) {
        console.log(e)
          res.status(500).send(e)
      }
  })


  const upload = multer ({
    limits: {
      fileSize: 1000000
    },
    fileFilter(req, file, cb) {
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        cb(new Error('Only jpg, jpeg, png allowed'))
      }
      cb(undefined, true)
    }
  })
  router.post('/user/me/avatar', auth, upload.single('avatar') , async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send();
  }, (error, req, res, next) => {
    res.status(400).send({error: error.message})
  })


router.delete('/user/me/avatar', auth, async(req,res) => {
  req.user.avatar = undefined
  await req.user.save();
  res.send()
})

router.get('/user/:id/avatar', async(req, res)=> {
  try {
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar) {
      throw new Error()
    }
    res.set('Content-Type', 'image/jpg')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send()
  }

})
module.exports = router;
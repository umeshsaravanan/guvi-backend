const express = require('express');
const mongoose = require('mongoose');
const userDetails = require('./models/userDetails');
const { ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
const PORT = process.env.PORT || 5000;
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@umesh.ai1vswb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=AtlasApp`)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Connection extablished to DB \nListening to port ${PORT} :)`);
    })
})

app.post('/add', async (req, res) => {
  try {
      const name = req.body.userName;
      const email = req.body.Email;
      const password = req.body.Password;

      const existingUser = await userDetails.findOne({ userName: name }).exec();

      if (existingUser) {
          return res.status(400).json({ error: "User Already Exists..." });
      }

      const newUser = new userDetails({
          userName: name,
          email: email,
          password: password,
          PhoneNumber: null,
          Gender: null,
          DOB: null,
          Age: null
      });

      const result = await newUser.save()
      .then((response)=>{
        res.status(201).json({success: "success"});
      })
      .catch((err)=>{
        res.json(err.message);
      })

  } catch (err) {
      res.status(500).json({ error: err });
  }
});

app.post('/update', async (req, res) => {
    const { userName, PhoneNumber, Gender, DOB, Age } = req.body;
  
    const updatedFields = {
      PhoneNumber: PhoneNumber,
      Gender: Gender,
      DOB: DOB,
      Age: Age,
    };
  
    try {
        const updatedUser = await userDetails.findOneAndUpdate(
            { userName: userName },
            { $set: updatedFields },
            { new: true, runValidators: true }
        ).exec();
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(updatedUser);
    } catch (err) {
      res.json(err);
    }
  });

app.get('/:id',async (req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        try {
            await userDetails.findById(req.params.id).exec()
            .then((result)=>{
                res.send(result);
            })
        }
        catch(err) {
            res.send(err);
        }
    }
    else
        res.status(404).json({msg: "Page Not Found"});
})

app.post('/verify', (req, res) => {
    const username = req.body.userName;
    const password = req.body.Password;
  
    userDetails.find({ userName: username, password: password })
    .exec()
    .then(users => {
      if (users.length > 0) {
        return res.json({ message: "Valid User" ,id: users[0]._id});
      } else {
        return res.json({ message: "Invalid User" });
      }
    })
    .catch(error => {
        res.json(error);
    });
});

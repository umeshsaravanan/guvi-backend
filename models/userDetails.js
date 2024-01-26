const mongoose = require('mongoose');

const users = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: {
            validator: (val) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(val);
            },
            message: "Invalid email format"
          },
        required: true
    },
    password: {
        type: String,
        validate: {
            validator: (val) => {
                const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return passRegex.test(val);
            },
            message:"Password must contain 1 UpperCase, 1 LowerCase, 1 Digit, 1 Special Character and Minimum of 8 Characters"
        },
        required: true
    },
    PhoneNumber: {
        type: String,
        validate: {
            validator: (val) => {
                if(val>0){
                    const phoneNumberRegex = /^\d{10}$/;
                    return phoneNumberRegex.test(val);
                }
                return true;
            },
            message: "Invalid phone number format"
        }
    },
    Gender: {
        type: String
    },
    DOB: {
        type: Date,
    },
    Age: {
        type: Number,
    }
},{ timestamps: true });

const fd = mongoose.model('UserDetail',users);

module.exports = fd;
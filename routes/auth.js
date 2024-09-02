const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { getUserCount, showAllUsers } = require('../controllers/userController');
const { getUsers } = require('../controllers/pendingController');
const { acceptUser } = require('../controllers/userController');
const { getUserByEmail } = require('../controllers/userController');
const { createOTP, verifyOTP, resendOTP } = require('../controllers/otpController'); // Import OTP controller

const router = express.Router();

// User authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/usercount', getUserCount);
router.get('/userpending', getUsers);
router.post('/acceptuser/:id', acceptUser);
router.get('/users', getUserByEmail);
router.get('/allusers', showAllUsers); // New route for showing all users

// OTP routes
router.post('/generate', createOTP); 
router.post('/verify', verifyOTP); 
router.post('/resend', resendOTP); 

module.exports = router;

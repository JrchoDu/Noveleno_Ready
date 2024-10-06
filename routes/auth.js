const express = require('express');
const { registerAdmin} = require('../controllers/authController');
const { registerUser, loginUser } = require('../controllers/authController');
const { getUserCount, showAllUsers, deleteUser } = require('../controllers/userController');
const { getUsers } = require('../controllers/pendingController');
const { getUserCountWithNullStatus } = require('../controllers/pendingController');
const { getUserCountLast14Days } = require('../controllers/pendingController');
const { getUserCountForGraph } = require('../controllers/pendingController');
const { acceptUser } = require('../controllers/userController');
const { getUserByEmail } = require('../controllers/userController');
const { createOTP, verifyOTP, resendOTP } = require('../controllers/otpController'); // Import OTP controller

const router = express.Router();

// User authentication routes

router.post('/adminregister', registerAdmin);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/usercount', getUserCount);
router.get('/usercountpending', getUserCountWithNullStatus);
router.get('/usercountNew', getUserCountLast14Days);
router.get('/userpending', getUsers);
router.get('/graph', getUserCountForGraph);
router.post('/acceptuser/:id', acceptUser);
router.get('/users', getUserByEmail);
router.get('/allusers', showAllUsers); // New route for showing all users
router.get('/deleteusers', deleteUser); // New route for showing all users

// OTP routes
router.post('/generate', createOTP); 
router.post('/verify', verifyOTP); 
router.post('/resend', resendOTP); 

module.exports = router;

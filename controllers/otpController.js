const axios = require('axios'); 
const nodemailer = require('nodemailer');
const User = require('../models/User');
const OTP = require('../models/Otp');
const { Op } = require('sequelize');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Function to send SMS using Semaphore API
const sendOTP = async (contactNumber, otpCode) => {
    const apiKey = '64659e5bb98d9c1a57469c9a27e079a3';
    const senderName = 'SEMAPHORE';
    
    try {
        const response = await axios.post('https://api.semaphore.co/api/v4/messages', {
            apikey: apiKey,
            number: contactNumber,
            message: `Your OTP is: ${otpCode}`,
            sendername: senderName,
        });

        const status = response.data.status || "Pending"; // Default to "Pending" if status is not found
        console.log('SMS API Response:', response.data);

        if (status === "Sent") {
            console.log('Message successfully sent!');
        } else {
            console.warn('Message is not sent yet. Status:', status);
        }

        return response.data; // return the response data if needed
    } catch (error) {
        console.error('Error sending OTP:', error.response ? error.response.data : error.message);
        throw new Error('Failed to send OTP');
    }
};

// Function to send OTP via email
const sendEmailOTP = async (email, otpCode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use any email service provider (e.g., SendGrid, SMTP)
        auth: {
            user: 'bartertechgether@gmail.com', // Your email address
            pass: 'eawh ttpm uslk fcgr', // Your email password or app-specific password
        },
    });

    const mailOptions = {
        from: 'bartertechgether@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${otpCode}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email OTP');
    }
};

// Create OTP
exports.createOTP = async (req, res) => {
    const { email } = req.body; 

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = user.id; // Get the user ID
        const contactNumber = user.contactNumber; // Get the user's contact number

        // Delete any existing unverified OTPs
        await OTP.destroy({ where: { userId, isVerified: false } });

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes 

        // Create new OTP record
        await OTP.create({
            userId,
            otpCode,
            createdAt: new Date(),
            expiresAt,
            isVerified: false 
        });

        // Send OTP to user's contact number
        await sendOTP(contactNumber, otpCode); 
        // Send OTP to user's email
        await sendEmailOTP(email, otpCode); 

        return res.status(201).json({ message: 'OTP generated and sent successfully.' });
    } catch (error) {
        console.error('Error creating OTP:', error);
        return res.status(500).json({ message: 'Error generating OTP.', error: error.message });
    }
};

// Resend OTP function
exports.resendOTP = async (req, res) => {
    const { email } = req.body; // Expecting email in the request body

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = user.id; // Get the user ID
        const contactNumber = user.contactNumber; // Get the user's contact number

        // Delete any existing unverified OTPs
        await OTP.destroy({ where: { userId, isVerified: false } });

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes 

        // Create new OTP record
        await OTP.create({
            userId,
            otpCode,
            createdAt: new Date(),
            expiresAt,
            isVerified: false 
        });

        // Send OTP to user's contact number
        await sendOTP(contactNumber, otpCode); 
        // Send OTP to user's email
        await sendEmailOTP(email, otpCode); 

        return res.status(201).json({ message: 'OTP resent and sent successfully.' });
    } catch (error) {
        console.error('Error resending OTP:', error);
        return res.status(500).json({ message: 'Error resending OTP.', error });
    }
};

// Verify OTP function remains unchanged
exports.verifyOTP = async (req, res) => {
    const { email, otpCode } = req.body; 

    try {
        // Step 1: Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = user.id;

        // Step 2: Find OTP associated with the user ID and provided otpCode
        const otp = await OTP.findOne({ 
            where: { 
                userId, 
                otpCode, 
                isVerified: false,
                expiresAt: { 
                    [Op.gt]: new Date()
                }
            } 
        });

        if (!otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Step 3: Mark OTP as verified
        otp.isVerified = true;
        otp.verifiedAt = new Date(); 
        await otp.save();

        return res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
    }
};

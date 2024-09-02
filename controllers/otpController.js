const User = require('../models/User');
const OTP = require('../models/Otp');
const  { Op }  = require('sequelize');

// Generate OTP (existing function)
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
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

     

        return res.status(201).json({ message: 'OTP generated and saved successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error generating OTP.', error: error.message });
    }
};


exports.resendOTP = async (req, res) => {
    const { email } = req.body; // Expecting email in the request body

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = user.id; // Get the user ID

        // Delete any existing unverified OTPs
        await OTP.destroy({ where: { userId, isVerified: false } });

        return createOTP({ body: { email } }, res); // Reuse the createOTP function
    } catch (error) {
        return res.status(500).json({ message: 'Error resending OTP.', error });
    }
};


// Verify OTP (existing function)
exports.verifyOTP = async (req, res) => {
    const { email, otpCode } = req.body; 

    try {
        // Step 1: Find user by email
        console.log(`Looking for user with email: ${email}`);
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.error(`User not found for email: ${email}`);
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = user.id;
        console.log(`User found: ${JSON.stringify(user)}`);

        // Step 2: Find OTP associated with the user ID and provided otpCode
        console.log(`Looking for OTP with userId: ${userId}, otpCode: ${otpCode}`);
        const otp = await OTP.findOne({ 
            where: { 
                userId, 
                otpCode, 
                is_verified: false,
                expires_at: { 
                    [Op.gt]: new Date()
                }
            } 
        });

        if (!otp) {
            console.error(`Invalid or expired OTP for userId: ${userId}, otpCode: ${otpCode}`);
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        console.log(`OTP found: ${JSON.stringify(otp)}`);

        // Step 3: Mark OTP as verified
        otp.is_verified = true;
        otp.verifiedAt = new Date(); 
        await otp.save();

        console.log(`OTP verified successfully for userId: ${userId}, otpCode: ${otpCode}`);
        return res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
    }
};
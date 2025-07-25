// // utils/SendSMS.js
// import axios from 'axios';

// // Option 1: TextBelt (Free for US/Canada, 1 SMS per day per IP)
// const sendTextBeltSMS = async (phone, message) => {
//   try {
//     const response = await axios.post('https://textbelt.com/text', {
//       phone: phone,
//       message: message,
//       key: 'textbelt' // Free tier key
//     });
    
//     console.log('TextBelt SMS response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('TextBelt SMS failed:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Option 2: Fast2SMS (Free for Indian numbers - you need to signup)
// const sendFast2SMS = async (phone, message) => {
//   const apiKey = process.env.FAST2SMS_API_KEY; // Get from fast2sms.com
  
//   if (!apiKey) {
//     throw new Error('FAST2SMS_API_KEY not configured');
//   }

//   // Remove +91 for Fast2SMS as it expects 10 digit Indian numbers
//   let cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  
//   try {
//     const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
//       variables_values: message,
//       route: 'q',
//       numbers: cleanPhone,
//     }, {
//       headers: {
//         'authorization': apiKey,
//         'Content-Type': 'application/json'
//       }
//     });
    
//     console.log('Fast2SMS response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Fast2SMS failed:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Option 3: MSG91 (Free credits on signup, good for Indian numbers)
// const sendMSG91SMS = async (phone, message) => {
//   const authKey = process.env.MSG91_AUTH_KEY; // Get from msg91.com
//   const templateId = process.env.MSG91_TEMPLATE_ID; // Template ID from MSG91
  
//   if (!authKey) {
//     throw new Error('MSG91_AUTH_KEY not configured');
//   }

//   // Remove +91 for MSG91
//   let cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
  
//   try {
//     const response = await axios.post(`https://api.msg91.com/api/v5/flow/`, {
//       template_id: templateId,
//       short_url: "0",
//       realTimeResponse: "1",
//       recipients: [
//         {
//           mobiles: cleanPhone,
//           message: message
//         }
//       ]
//     }, {
//       headers: {
//         'authkey': authKey,
//         'Content-Type': 'application/json'
//       }
//     });
    
//     console.log('MSG91 SMS response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('MSG91 SMS failed:', error.response?.data || error.message);
//     throw error;
//   }
// };

// // Option 4: Twilio (Paid but most reliable)
// const sendTwilioSMS = async (phone, message) => {
//   const accountSid = process.env.TWILIO_ACCOUNT_SID;
//   const authToken = process.env.TWILIO_AUTH_TOKEN;
//   const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
//   if (!accountSid || !authToken || !fromNumber) {
//     throw new Error('Twilio credentials not configured');
//   }

//   const client = require('twilio')(accountSid, authToken);

//   try {
//     const sms = await client.messages.create({
//       body: message,
//       from: fromNumber,
//       to: phone
//     });
    
//     console.log('Twilio SMS sent:', sms.sid);
//     return sms;
//   } catch (error) {
//     console.error('Twilio SMS failed:', error);
//     throw error;
//   }
// };

// // Main SMS function with fallback options
// export const sendSMS = async (phone, message) => {
//   console.log(`📱 Attempting to send SMS to: ${phone}`);
//   console.log(`📝 Message: ${message.substring(0, 50)}...`);

//   // Determine which service to use based on phone number and configuration
//   const isIndianNumber = phone.startsWith('+91');
  
//   // Try different services in order of preference
//   const smsServices = [];
  
//   if (isIndianNumber) {
//     // For Indian numbers, prefer Indian services
//     if (process.env.FAST2SMS_API_KEY) smsServices.push(sendFast2SMS);
//     if (process.env.MSG91_AUTH_KEY) smsServices.push(sendMSG91SMS);
//     if (process.env.TWILIO_ACCOUNT_SID) smsServices.push(sendTwilioSMS);
//     smsServices.push(sendTextBeltSMS); // Last fallback
//   } else {
//     // For international numbers
//     if (process.env.TWILIO_ACCOUNT_SID) smsServices.push(sendTwilioSMS);
//     smsServices.push(sendTextBeltSMS);
//   }

//   // Try each service until one succeeds
//   for (let i = 0; i < smsServices.length; i++) {
//     try {
//       const result = await smsServices[i](phone, message);
//       console.log(`✅ SMS sent successfully using service ${i + 1}`);
//       return result;
//     } catch (error) {
//       console.log(`❌ Service ${i + 1} failed:`, error.message);
      
//       // If this was the last service, throw the error
//       if (i === smsServices.length - 1) {
//         throw new Error(`All SMS services failed. Last error: ${error.message}`);
//       }
      
//       // Otherwise, continue to next service
//       console.log(`🔄 Trying next SMS service...`);
//     }
//   }
// };

// // Utility function to validate phone numbers
// export const validatePhoneNumber = (phone) => {
//   // Remove all non-digits for validation
//   const digitsOnly = phone.replace(/\D/g, '');
  
//   // Check if it's a valid length (10-15 digits)
//   if (digitsOnly.length < 10 || digitsOnly.length > 15) {
//     return false;
//   }
  
//   // Check if it follows basic phone number pattern
//   const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
//   return phoneRegex.test(phone);
// };

// // Format phone number consistently
// export const formatPhoneNumber = (phone) => {
//   // Remove all non-digits
//   let cleaned = phone.replace(/\D/g, '');
  
//   // Add appropriate country code
//   if (cleaned.length === 10) {
//     // Assume Indian number if 10 digits
//     cleaned = '+91' + cleaned;
//   } else if (!phone.startsWith('+')) {
//     cleaned = '+' + cleaned;
//   } else {
//     cleaned = phone;
//   }
  
//   return cleaned;
// };
import nodemailer from 'nodemailer'
export const trans= nodemailer.createTransport({      
    host: "smtp.gmail.com",
    service:"gmail",
    auth: {
      type: "login", // default
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
    }
  });
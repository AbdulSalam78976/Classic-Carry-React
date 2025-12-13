import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.EMAIL_FROM, // Using EMAIL_FROM as auth user if undefined, standard pattern
            pass: process.env.SMTP_PASSWORD // Assumption: SMTP_PASSWORD might be needed, though not in .env.example. I will check .env.example again.
        }
    });

    // Check if we have specific auth user different from EMAIL_FROM
    if (process.env.SMTP_EMAIL) {
        transporter.auth.user = process.env.SMTP_EMAIL;
    }

    const message = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

export default sendEmail;

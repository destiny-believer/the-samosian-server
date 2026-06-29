import transporter from "../config/mail.js";

const sendEmail = async ({

    to,

    subject,

    html

}) => {

    try {

        await transporter.sendMail({

            from: process.env.MAIL_FROM,

            to,

            subject,

            html

        });

        console.log(

            "✅ Email Sent Successfully"

        );

    }

    catch (error) {

        console.log(

            "❌ Email Error:",

            error.message

        );

        throw error;

    }

};

export default sendEmail;
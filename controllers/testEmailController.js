import sendEmail from "../utils/sendEmail.js";
import { testEmailTemplate } from "../utils/emailTemplates.js";

export const sendTestEmail = async (req, res) => {

    try {

        const { email } = req.body;

        await sendEmail({

            to: email,

            subject: "SMTP Test - The Samosian",

            html: testEmailTemplate("Pranay")

        });

        res.status(200).json({

            success: true,

            message: "Test Email Sent Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
export const testEmailTemplate = (name) => {

    return `

    <div style="max-width:600px;margin:auto;padding:30px;background:#0f172a;border-radius:12px;font-family:Arial,sans-serif;color:white;">

        <h1 style="color:#f59e0b;text-align:center;">

            🍽️ The Samosian

        </h1>

        <h2>

            Hello ${name},

        </h2>

        <p>

            Congratulations!

        </p>

        <p>

            Your SMTP configuration is working successfully.

        </p>

        <div style="margin:30px 0;padding:20px;background:#1e293b;border-radius:10px;">

            <strong>Status:</strong>

            <span style="color:#22c55e;">

                SMTP Connected Successfully ✅

            </span>

        </div>

        <p>

            Your backend is now ready to send:

        </p>

        <ul>

            <li>✅ Welcome Emails</li>

            <li>✅ Email Verification</li>

            <li>✅ Forgot Password</li>

            <li>✅ Order Confirmation</li>

            <li>✅ Delivery Updates</li>

        </ul>

        <hr style="margin:30px 0;border:none;border-top:1px solid #334155;">

        <p style="text-align:center;color:#94a3b8;">

            © The Samosian

        </p>

    </div>

    `;

};
# Achaia Labs | SMTP Form Backend

This is a premium SMTP-based form submission backend built with Next.js, designed for the website **achaialabs.com**.

## ✨ Features
- **SMTP Support**: Use any SMTP provider (Gmail, Resend, SendGrid, etc.).
- **Dynamic Fields**: Handles any form with any number of fields.
- **CORS Enabled**: Call it from any frontend.
- **Zod Validation**: Ensures your data is clean.
- **Beautiful Emails**: Sends professionally styled emails with Achaia Labs branding.

## 🚀 Deployment to Vercel
1.  **Clone/Upload** this code to a GitHub repository.
2.  **Connect** to Vercel.
3.  **Configure Environment Variables** in the Vercel dashboard:
    - `SMTP_HOST`: Your SMTP server (e.g., `smtp.gmail.com`).
    - `SMTP_PORT`: Usually `587`.
    - `SMTP_USER`: Your email.
    - `SMTP_PASS`: Your SMTP password or App Password.
    - `EMAIL_FROM`: The sender email (e.g., `noreply@achaialabs.com`).
    - `EMAIL_TO`: Where you want to receive the submissions.

## 🔗 API Endpoint
Once deployed, your endpoint will be:
`https://your-deployment.vercel.app/api/submit`

## 💻 Frontend Usage (React / JavaScript)

```javascript
const submitForm = async (formData) => {
  try {
    const response = await fetch('https://your-deployment.vercel.app/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (result.success) {
      alert("Form submitted! Achaia Labs will contact you.");
    } else {
      alert("Error: " + result.error);
    }
  } catch (error) {
    console.error("Submission failed:", error);
  }
};
```

### Example Form Data:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Business Query",
  "message": "I would like to discuss a project."
}
```

## 🎨 Premium Design
The confirmation page and email template have been crafted with high-end aesthetics focusing on the Achaia Labs brand identity, featuring gradients, glassy cards, and smooth micro-animations.

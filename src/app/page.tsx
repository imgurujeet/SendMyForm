import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <div className="success-card">
      <div className="icon-wrapper">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1>Success!</h1>
      <p>
        Your form has been successfully submitted. Our team at Achaia Labs will get back to you shortly. Thank you for reaching out!
      </p>
      <Link href="https://achaialabs.tech" className="btn">
        Return to Website
      </Link>
      <div className="footer">
        © 2026 Achaia Labs. All rights reserved.
      </div>
    </div>
  );
}

import { Metadata } from "next";
import FormGeneratorClient from "./FormGeneratorClient";

export const metadata: Metadata = {
  title: "Free HTML Form Generator | Build & Connect Your Form Instantly",
  description: "Create a custom contact form with our visual builder. Generate clean HTML code and connect it to a no-backend service in seconds. No coding required.",
  keywords: "html form generator, contact form builder, free form code, static site forms, create form online, html contact form code",
};

export default function page() {
  return <FormGeneratorClient />;
}

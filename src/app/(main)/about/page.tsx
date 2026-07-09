import AboutPage from "@/components/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — SendMyForm | Simple & Private Form Backend",
  description: "Learn about SendMyForm, our zero-storage privacy policy, and the team at Achaia Labs building developer tools.",
  alternates: {
    canonical: "https://sendmyform.live/about",
  },
};

export default function About() {
    return <AboutPage />;
}
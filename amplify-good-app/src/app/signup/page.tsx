import { Suspense } from "react";
import SignUpForm from "./SignUpForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <Suspense
          fallback={
            <div className="bg-sand-light rounded-2xl shadow-lg p-10 w-full max-w-2xl text-center font-body text-gray-400 border border-sand-dark">
              Loading sign-up form…
            </div>
          }
        >
          <SignUpForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

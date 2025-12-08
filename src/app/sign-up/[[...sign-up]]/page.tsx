"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";

const SignUpPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [currentStep, setCurrentStep] = useState(1);
  const [clerkError, setClerkError] = useState("");
  const router = useRouter();

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    consent: false,
  });

  // OTP verification state
  const [otpCode, setOtpCode] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Step 1: Name submission
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName) {
      setCurrentStep(2);
      setClerkError("");
    }
  };

  // Step 2: Email and Password submission
  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setClerkError("Passwords do not match");
        return;
      }
      setCurrentStep(3);
      setClerkError("");
    }
  };

  // Step 3: Consent and create account
  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      setClerkError("You must accept the terms and conditions");
      return;
    }

    if (!isLoaded) return;

    try {
      // Create the sign-up with Clerk
      await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        password: formData.password,
      });

      // Prepare email verification (sends OTP)
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Move to OTP verification step
      setCurrentStep(4);
      setClerkError("");
    } catch (err: any) {
      console.error("Sign-up error:", JSON.stringify(err, null, 2));
      setClerkError(
        err.errors?.[0]?.message || "An error occurred during sign-up"
      );
    }
  };

  // Step 4: OTP Verification
  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: otpCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        router.push("/dashboard");
      } else {
        console.log("Sign-up status:", JSON.stringify(completeSignUp, null, 2));
        setClerkError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
      setClerkError(err.errors?.[0]?.message || "Invalid verification code");
    }
  };

  // Go back to previous step
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    setClerkError("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-black/80 via-slate-900 to-black/95 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2">
            Create your account
          </h2>
          <p className="text-gray-400 text-sm">
            Step {currentStep} of 4
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2.5">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>

        {/* Error Message */}
        {clerkError && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm">{clerkError}</p>
          </div>
        )}

        {/* Step 1: Name */}
        {currentStep === 1 && (
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <form onSubmit={handleStep1} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                Next
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Email and Password */}
        {currentStep === 2 && (
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <form onSubmit={handleStep2} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    placeholder="Create a password"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-1/2 px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Consent */}
        {currentStep === 3 && (
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <form onSubmit={handleStep3} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="focus:ring-emerald-400 h-4 w-4 text-emerald-600 border-white/20 rounded bg-white/5"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="consent"
                      className="font-medium text-gray-300"
                    >
                      I agree to the Terms and Conditions{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <p className="text-gray-400 mt-1">
                      By creating an account, you agree to our Terms of Service
                      and Privacy Policy. We will send you a verification code to
                      your email address.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <h4 className="text-sm font-semibold text-emerald-300 mb-2">
                  Account Summary:
                </h4>
                <p className="text-sm text-gray-300">
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Email:</strong> {formData.email}
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-1/2 px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: OTP Verification */}
        {currentStep === 4 && (
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <form onSubmit={handleOtpVerification} className="space-y-6">
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-300">
                    We've sent a verification code to{" "}
                    <strong className="text-white">{formData.email}</strong>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    If you don't see the email in your inbox, please check your
                    spam folder.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="otpCode"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Verification Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="otpCode"
                    name="otpCode"
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-center text-lg tracking-widest"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                Verify and Complete Sign Up
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    // Resend verification code
                    if (isLoaded && signUp) {
                      signUp.prepareEmailAddressVerification({
                        strategy: "email_code",
                      });
                    }
                  }}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Resend verification code
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

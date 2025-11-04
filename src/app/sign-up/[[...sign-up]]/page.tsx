"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

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
        router.push("/");
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-amber-50">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-amber-50">
            Step {currentStep} of 4
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>

        {/* Error Message */}
        {clerkError && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {clerkError}
          </div>
        )}

        {/* Step 1: Name */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-amber-50 mb-1"
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
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-amber-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-amber-50 mb-1"
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
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-amber-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          </form>
        )}

        {/* Step 2: Email and Password */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-amber-50 mb-1"
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
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-amber-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-amber-50 mb-1"
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
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-amber-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-amber-50 mb-1"
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
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-amber-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Consent */}
        {currentStep === 3 && (
          <form onSubmit={handleStep3} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="consent"
                    className="font-medium text-amber-50"
                  >
                    I agree to the Terms and Conditions{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-300 mt-1">
                    By creating an account, you agree to our Terms of Service
                    and Privacy Policy. We will send you a verification code to
                    your email address.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Account Summary:
              </h4>
              <p className="text-sm text-blue-800">
                <strong>Name:</strong> {formData.firstName} {formData.lastName}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> {formData.email}
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* Step 4: OTP Verification */}
        {currentStep === 4 && (
          <form onSubmit={handleOtpVerification} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-amber-50">
                  We've sent a verification code to{" "}
                  <strong>{formData.email}</strong>
                </p>
              </div>
              <div>
                <label
                  htmlFor="otpCode"
                  className="block text-sm font-medium text-amber-50 mb-1"
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
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-amber-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-lg tracking-widest"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Resend verification code
              </button>
            </div>
          </form>
        )}

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-amber-50">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

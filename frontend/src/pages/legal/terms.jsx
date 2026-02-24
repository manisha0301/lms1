import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Terms & Conditions
        </h1>

        <p className="mb-4 text-gray-600">
          Welcome to Cybernetics LMS. By creating an account and using our
          platform, you agree to comply with and be bound by the following
          terms and conditions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Account Responsibility
        </h2>
        <p className="text-gray-600 mb-4">
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. Professional Conduct
        </h2>
        <p className="text-gray-600 mb-4">
          Faculty members must provide accurate information and maintain
          professional standards while interacting with students.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Intellectual Property
        </h2>
        <p className="text-gray-600 mb-4">
          All course materials, assignments, and content uploaded to the
          platform remain the intellectual property of their respective
          owners.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Termination
        </h2>
        <p className="text-gray-600">
          The administration reserves the right to suspend or terminate any
          account that violates these terms.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: February 2026
        </p>
      </div>
    </div>
  );
};

export default Terms;
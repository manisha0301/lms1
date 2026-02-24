import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Privacy Policy
        </h1>

        <p className="mb-4 text-gray-600">
          Cybernetics LMS respects your privacy and is committed to protecting
          your personal information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h2>
        <p className="text-gray-600 mb-4">
          We collect personal information such as name, email address, phone
          number, and professional details during account registration.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. How We Use Information
        </h2>
        <p className="text-gray-600 mb-4">
          Your information is used to manage your account, facilitate course
          delivery, and improve our platform services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Data Protection
        </h2>
        <p className="text-gray-600 mb-4">
          We implement appropriate technical and organizational measures to
          safeguard your personal data.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Contact Us
        </h2>
        <p className="text-gray-600">
          If you have any questions regarding this Privacy Policy, please
          contact our support team.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          Last updated: February 2026
        </p>
      </div>
    </div>
  );
};

export default Privacy;
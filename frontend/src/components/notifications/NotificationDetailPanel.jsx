import { X } from "lucide-react";

export default function NotificationDetailPanel({
  notification,
  recipient_type,
  onClose,
}) {
  if (!notification) return null;

  /* ===============================
     ROLE BASED RENDER FUNCTIONS
  =============================== */

  const renderStudent = (notification) => {
    switch (notification.type) {
      case "exam":
        return (
          <>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              📝 Exam Scheduled
            </h2>

            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {notification.message}
            </p>

            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <p className="text-gray-800">
                Prepare well and give your best performance.
              </p>
            </div>
          </>
        );

      case "assignment":
        return (
          <>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              📚 New Assignment Posted
            </h2>

            <p className="text-gray-700 text-lg mb-4">
              {notification.message}
            </p>

            <div className="bg-green-50 p-4 rounded-xl">
              Submit before the deadline to avoid penalties.
            </div>
          </>
        );

      case "class":
        return (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              🎓 Live Class Reminder
            </h2>

            <p className="text-gray-700 text-lg mb-4">
              {notification.message}
            </p>

            <div className="bg-blue-50 p-4 rounded-xl">
              Join on time to avoid missing important topics.
            </div>
          </>
        );

      default:
        return renderGeneric(notification);
    }
  };

  const renderFaculty = (notification) => {
    switch (notification.type) {
      case "exam":
        return (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              📝 Exam Created Successfully
            </h2>

            <p className="text-gray-700 text-lg mb-4">
              {notification.message}
            </p>

            <div className="bg-blue-50 p-4 rounded-xl">
              Students can now attempt this exam.
            </div>
          </>
        );

      case "assignment":
        return (
          <>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              📚 Assignment Published
            </h2>

            <p className="text-gray-700 text-lg mb-4">
              {notification.message}
            </p>

            <div className="bg-green-50 p-4 rounded-xl">
              Students have been notified about this assignment.
            </div>
          </>
        );

      case "faculty_request":
        return (
          <>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              👨‍🏫 Faculty Request Update
            </h2>

            <p className="text-gray-700 text-lg">
              {notification.message}
            </p>
          </>
        );

      default:
        return renderGeneric(notification);
    }
  };

  const renderAdmin = (notification) => {
    switch (notification.type) {
      case "faculty_request":
        return (
          <>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              📥 New Faculty Approval Request
            </h2>

            <p className="text-gray-700 text-lg mb-4">
              {notification.message}
            </p>

            <div className="bg-indigo-50 p-4 rounded-xl">
              Please review and take necessary action.
            </div>
          </>
        );

      case "course":
        return (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              📘 Course Update
            </h2>

            <p className="text-gray-700 text-lg">
              {notification.message}
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-gray-800">
                This course has been recently updated. Please review the changes
                to stay aligned with the latest content and structure.
                </p>
            </div>

          </>
        );

      default:
        return renderGeneric(notification);
    }
  };

  const renderSuperAdmin = (notification) => {
    switch (notification.type) {
      case "admin":
        return (
          <>
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              🏢 Administrative Update
            </h2>

            <p className="text-gray-700 text-lg">
              {notification.message}
            </p>
          </>
        );

      case "course":
        return (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              📊 System Course Activity
            </h2>

            <p className="text-gray-700 text-lg">
              {notification.message}
            </p>
          </>
        );

      default:
        return renderGeneric(notification);
    }
  };

  const renderGeneric = (notification) => (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔔 Notification
      </h2>
      <p className="text-gray-700 text-lg">{notification.message}</p>
    </>
  );

  /* ===============================
     MAIN SWITCH BY RECIPIENT TYPE
  =============================== */

  const renderContent = () => {
    switch (recipient_type) {
      case "student":
        return renderStudent(notification);

      case "faculty":
        return renderFaculty(notification);

      case "admin":
        return renderAdmin(notification);

      case "superadmin":
        return renderSuperAdmin(notification);

      default:
        return renderGeneric(notification);
    }
  };

  /* ===============================
     PRIORITY COLOR LOGIC
  =============================== */

  const priorityColor =
    notification.priority === "high"
      ? "text-red-600"
      : notification.priority === "medium"
      ? "text-yellow-600"
      : "text-green-600";

  /* ===============================
     MODAL UI
  =============================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-[540px] max-w-[95%] rounded-2xl shadow-2xl p-8 z-10 transition-all">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic Content */}
        {renderContent()}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-sm text-gray-500 flex justify-between">
          <span>
            Priority:{" "}
            <span className={`font-semibold ${priorityColor}`}>
              {notification.priority?.toUpperCase()}
            </span>
          </span>

          <span>
            {new Date(notification.created_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
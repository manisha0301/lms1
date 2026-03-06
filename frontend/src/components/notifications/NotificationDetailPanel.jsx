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

        case "student":
          return (
            <>
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                👨‍🎓 New Student Joined
              </h2>

              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                A new student has successfully joined your center.
              </p>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                <p className="text-gray-800 font-medium">
                  {notification.message}
                </p>
              </div>

              <p className="text-sm text-gray-500">
                You can now track this student's progress and course activity from your faculty dashboard.
              </p>
            </>
          );

          case "course":
            return (
              <>
                <h2 className="text-2xl font-bold text-blue-700 mb-4">
                  📘 Course Assignment
                </h2>

                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                  You have been assigned as the instructor for a new course.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                  <p className="text-gray-800 font-medium">
                    {notification.message}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  You can now manage course materials, schedule classes,
                  and monitor student progress from your faculty dashboard.
                </p>
              </>
            );

      default:
        return renderGeneric(notification);
    }
  };

  const renderAcademicAdmin = (notification) => {
    switch (notification.type) {

      case "faculty_request":
        return (
          <>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              📥 New Faculty Approval Request
            </h2>

            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {notification.message}
            </p>

            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
              <p className="text-gray-800">
                A faculty member has submitted a request to join your academic
                center. Please review their details and approve or reject the
                request from the faculty management section.
              </p>
            </div>
          </>
        );


      case "course":
        return (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              📘 Course Update
            </h2>

            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {notification.message}
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-gray-800">
                A new course has been added to your center. You can now assign
                faculty members, monitor enrollments, and manage course
                activities from the course dashboard.
              </p>
            </div>
          </>
        );


      case "student":
        return (
          <>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              🎓 New Student Enrollment
            </h2>

            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {notification.message}
            </p>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-gray-800">
                A new student has successfully enrolled in your center.
                You can track student progress, course participation,
                and academic performance from the student management panel.
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

            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {notification.message}
            </p>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="text-gray-800">
                A new academic administrator has been successfully added to the
                system. This user will now be able to manage academic operations,
                oversee courses, and coordinate with faculty members.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              You can monitor all administrative users and permissions from the
              Super Admin control panel.
            </p>
          </>
        );

      case "course":
        return (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              📊 System Course Activity
            </h2>

            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {notification.message}
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-gray-800">
                A new course has been added to the learning platform. This course is
                now available within the academic system and can be assigned to
                faculty members and enrolled by students.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Visit the course management section to review course details,
              instructor assignments, and enrollment activity.
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

      case "academicadmin":
        return renderAcademicAdmin(notification);

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
import { useState } from 'react';
import { ChevronDown, Video, Play, X, Lock } from 'lucide-react';

export function ChapterItem({ chapter, idx, isLocked }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const hasVideo = chapter.type === 'video' && chapter.videoUrl;

  return (
    <>
      {/* Chapter Row - Clickable */}
      <div
        onClick={() => !isLocked && setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg transition group cursor-pointer relative ${
          isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 group-hover:bg-[#1e3a8a]/10 group-hover:text-[#1e3a8a] transition">
          {idx + 1}
        </div>

        <div className="flex-1">
          <p className="font-medium text-gray-800">{chapter.title}</p>
          {chapter.duration && (
            <p className="text-xs text-gray-500 mt-0.5">{chapter.duration}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {chapter.type === 'video' && <Video className="w-4 h-4 text-[#1e3a8a]" />}
          {chapter.type === 'quiz' && <Award className="w-4 h-4 text-green-600" />}
          {chapter.type === 'assignment' && <FileText className="w-4 h-4 text-orange-600" />}

          {isLocked ? (
            <Lock className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </div>
      </div>

      {/* Dropdown Menu - only for unlocked chapters */}
      {!isLocked && isDropdownOpen && (
        <div className="ml-11 mt-1 mb-3 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden w-64">
          {hasVideo ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVideoModal(true);
                setIsDropdownOpen(false);
              }}
              className="w-full px-5 py-3.5 text-left flex items-center gap-3 hover:bg-blue-50 transition text-[#1e40af] font-medium"
            >
              <Play className="w-5 h-5" />
              <span>View Video</span>
            </button>
          ) : (
            <div className="px-5 py-3.5 text-gray-500 italic text-sm">
              No video available yet
            </div>
          )}
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && hasVideo && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-100 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {chapter.title}
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Video Player */}
            <div className="flex-1 bg-black flex items-center justify-center">
              <video
                controls
                autoPlay
                className="w-full h-full"
                src={chapter.videoUrl}
              >
                <source src={chapter.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Footer with close button */}
            <div className="p-4 bg-gray-50 text-center">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-8 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
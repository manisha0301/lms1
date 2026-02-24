// src/components/student/StudentChapterItem.jsx
import { useState, useEffect } from 'react';
import { ChevronDown, Play, X, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig.js';

export function StudentChapterItem({ chapter, idx, isLocked = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState(null);

  // Fetch video only when user clicks the chapter
  const fetchVideo = async () => {
    if (!chapter?.id) return;
    setLoadingVideo(true);
    setVideoError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${apiConfig.API_BASE_URL}/api/auth/student/chapter-video/${chapter.id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data?.success && res.data.video) {
        setVideoData(res.data.video);
      } else {
        setVideoError('No video available');
      }
    } catch (err) {
      // 404 = no video → friendly message
      if (err.response?.status === 404) {
        setVideoError('No lecture video uploaded yet');
      } else {
        console.error('Video fetch error:', err);
        setVideoError('Failed to load video');
      }
    } finally {
      setLoadingVideo(false);
    }
  };

  const handleChapterClick = () => {
    if (isLocked) return; // don't open if locked

    setIsOpen(!isOpen);
    setShowVideoModal(true); // auto-open modal
    if (!videoData && !loadingVideo) {
      fetchVideo(); // fetch only once per click
    }
  };

  const hasVideo = !!videoData;

  return (
    <>
      {/* Chapter Row - Click to open video modal */}
      <div
        onClick={handleChapterClick}
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
            <Play className="w-5 h-5 text-[#1e40af] opacity-0 group-hover:opacity-100 transition" />
          )}
        </div>
      </div>

      {/* Video Modal - Auto-opens on chapter click */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-100 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {chapter.title} {chapter.duration ? `(${chapter.duration})` : ''}
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Video / Loading / No Video */}
            <div className="flex-1 bg-black flex items-center justify-center">
              {loadingVideo ? (
                <div className="text-white flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <p>Loading lecture video...</p>
                </div>
              ) : videoError ? (
                <div className="text-center text-white p-8">
                  <p className="text-xl mb-2">No lecture video available yet</p>
                  <p className="text-gray-400">{videoError}</p>
                </div>
              ) : hasVideo ? (
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  src={`${apiConfig.API_BASE_URL}${videoData.video_path}`}
                  onError={(e) => {
                    console.error('Video playback error:', e);
                    setVideoError('Failed to play video - file may be corrupted');
                  }}
                >
                  <source src={`${apiConfig.API_BASE_URL}${videoData.video_path}`} type={videoData.mime_type || 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p className="text-white text-lg">Loading...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
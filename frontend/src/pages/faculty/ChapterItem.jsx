import { useState } from 'react';
import { ChevronDown, Video, Upload, Play, X } from 'lucide-react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig.js';

export function ChapterItem({ chapter, idx, courseId, week, moduleId, onChapterUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showViewVideoModal, setShowViewVideoModal] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const hasVideo = !!chapter?.videoUrl; // Assume backend sends videoUrl if video exists

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else if (file) {
      alert('Please select a valid video file (mp4, webm, etc.)');
      e.target.value = '';
    }
  };

  const handleUploadVideo = async () => {
    if (!videoFile) {
      alert('Please select a video file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('chapterId', chapter.id);
    formData.append('week', week);
    formData.append('moduleId', moduleId);

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        `${apiConfig.API_BASE_URL}/api/faculty/courses/${courseId}/chapters/video`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data?.success) {
        alert('Video uploaded successfully!');
        setShowAddVideoModal(false);
        setVideoFile(null);
        // Optional: refresh course data or update local chapter state
        onChapterUpdate?.();
      } else {
        alert(res.data?.error || 'Failed to upload video');
      }
    } catch (err) {
      console.error('Video upload error:', err);
      alert('Error uploading video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Chapter Row */}
      <div
        className={`flex items-center gap-3 py-2.5 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group cursor-pointer relative ${
          isOpen ? 'bg-gray-100' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 group-hover:bg-[#1e3a8a]/10 group-hover:text-[#1e3a8a] transition">
          {idx + 1}
        </div>
        <span className="flex-1 font-medium text-gray-800">
          {(chapter && (chapter.title || chapter)) || 'Untitled'}
        </span>

        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="ml-11 mt-1 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-64">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddVideoModal(true);
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition"
          >
            <Upload className="w-5 h-5 text-green-600" />
            <span>Add Video</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hasVideo) {
                setShowViewVideoModal(true);
              } else {
                alert('No video available for this chapter yet.');
              }
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition ${
              !hasVideo ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!hasVideo}
          >
            <Play className="w-5 h-5 text-[#1e40af]" />
            <span>View Video</span>
          </button>
        </div>
      )}

      {/* Add Video Modal */}
      {showAddVideoModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add Video - {chapter.title || 'Chapter'}</h3>
              <button onClick={() => setShowAddVideoModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-800" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Upload Video</label>
                <label
                  htmlFor="video-upload"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#1e40af] hover:bg-blue-50 transition block"
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
                  <p className="text-sm text-gray-500 mt-1">MP4, WebM, MOV (max 500MB recommended)</p>
                  {videoFile && (
                    <p className="mt-3 text-green-600 font-medium">
                      Selected: {videoFile.name}
                    </p>
                  )}
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowAddVideoModal(false)}
                  className="px-6 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadVideo}
                  disabled={uploading || !videoFile}
                  className={`px-6 py-2 bg-[#1e40af] text-white rounded-md flex items-center gap-2 ${
                    uploading || !videoFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1e3a8a]'
                  }`}
                >
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Video Modal */}
      {showViewVideoModal && hasVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 bg-gray-100">
              <h3 className="text-lg font-semibold">
                {chapter.title || 'Chapter Video'}
              </h3>
              <button onClick={() => setShowViewVideoModal(false)}>
                <X className="w-6 h-6 text-gray-600 hover:text-gray-900" />
              </button>
            </div>

            <div className="flex-1 bg-black flex items-center justify-center">
              <video
                controls
                autoPlay
                className="w-full h-full max-h-[80vh]"
                src={chapter.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
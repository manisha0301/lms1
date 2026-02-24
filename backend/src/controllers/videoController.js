// backend/src/controllers/videoController.js
import { addVideoToChapter, getVideoByChapter, deleteVideoByChapter } from '../models/videoModel.js';
import pool from '../config/db.js';
import fs from 'fs/promises';
import path from 'path';

export const uploadChapterVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file uploaded' });
    }

    const {
      courseId,
      weekId,
      moduleId,
      chapterId,
      videoTitle,
    } = req.body;

    const facultyId = req.user.id;

    // Get academicAdminId from JWT or fallback to DB
    let academicAdminId = req.user.academicAdminId;

    if (!academicAdminId) {
      const { rows } = await pool.query(
        'SELECT academic_admin_id FROM faculty WHERE id = $1',
        [facultyId]
      );
      if (rows.length === 0 || !rows[0].academic_admin_id) {
        // Cleanup temp file
        if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
        return res.status(400).json({
          success: false,
          message: 'Academic Admin ID missing in token and faculty record'
        });
      }
      academicAdminId = rows[0].academic_admin_id;
    }

    // Validate hierarchy IDs (moved here after multer)
    if (!courseId || !weekId || !moduleId || !chapterId) {
      // Cleanup temp file
      if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        success: false,
        message: 'Missing required hierarchy IDs (courseId, weekId, moduleId, chapterId)'
      });
    }

    // Create final nested folder
    const finalDir = path.join(
      process.cwd(),
      'uploads',
      'videos',
      `course_${courseId}`,
      `week_${weekId}`,
      `module_${moduleId}`,
      `chapter_${chapterId}`
    );

    await fs.mkdir(finalDir, { recursive: true });

    // Move file from temp to final location
    const finalPath = path.join(finalDir, req.file.filename);
    await fs.rename(req.file.path, finalPath);

    // Relative path for DB (starts with /uploads/...)
    const relativePath = finalPath
      .replace(process.cwd(), '')
      .replace(/\\/g, '/');

    const video = await addVideoToChapter({
      academicAdminId,
      facultyId,
      courseId,
      weekId,
      moduleId,
      chapterId,
      videoTitle,
      videoFilename: req.file.filename,
      videoPath: relativePath,
      mimeType: req.file.mimetype,
      fileSizeBytes: req.file.size,
      // duration: can be added later with ffprobe
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      video,
    });
  } catch (error) {
    console.error('Video upload error:', error);

    // Cleanup temp file if it still exists
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
        console.log('Cleaned up failed temp file');
      } catch (cleanupErr) {
        console.warn('Cleanup failed:', cleanupErr.message);
      }
    }

    res.status(500).json({ success: false, message: 'Failed to upload video' });
  }
};

export const getChapterVideo = async (req, res) => {
  try {
    const { chapterId } = req.params;

    // Faculty version: show ALL videos for this chapter (including unpublished)
    const video = await getVideoByChapter(chapterId);

    if (!video) {
      return res.status(404).json({ success: false, message: 'No video found for this chapter' });
    }

    // Optional: track views (useful for analytics)
    await pool.query(
      'UPDATE chapter_videos SET views_count = views_count + 1 WHERE id = $1',
      [video.id]
    );

    res.json({ success: true, video });
  } catch (error) {
    console.error('Get chapter video error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getChapterVideoForStudent = async (req, res) => {
  try {
    const { chapterId } = req.params;

    // Student version: only show published videos
    const video = await getVideoByChapter(chapterId);

    if (!video || !video.is_published) {
      return res.status(404).json({
        success: false,
        message: 'No published video for this chapter yet'
      });
    }

    // Optional: track views
    await pool.query(
      'UPDATE chapter_videos SET views_count = views_count + 1 WHERE id = $1',
      [video.id]
    );

    res.json({ success: true, video });
  } catch (err) {
    console.error('Student video fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteChapterVideo = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const facultyId = req.user.id;

    await deleteVideoByChapter(chapterId, facultyId);

    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
};
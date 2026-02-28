import express from 'express';
import { 
  getAllPublicCourses,
  getPublicCourseById,
  getPublicCourseOverview,
  getTopRatedCourses
} from '../controllers/landingController.js';

const router = express.Router();

router.get('/courses', getAllPublicCourses);
router.get('/courses/top-rated', getTopRatedCourses);
router.get('/courses/:id', getPublicCourseById);
router.get('/courses/:id/overview', getPublicCourseOverview);


export default router;
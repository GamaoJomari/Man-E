import { db } from '../config/database';

export interface Course {
  _id?: string;
  courseCode: string;
  name: string;
  description: string;
  instructorId: string;
  schedule: string;
  location: string;
}

export const createCourse = async (courseData: Omit<Course, '_id'>) => {
  try {
    const coursesCollection = db.collection('courses');

    // Check if course code already exists
    const existingCourse = await coursesCollection.findOne({ courseCode: courseData.courseCode });
    if (existingCourse) {
      throw new Error('courseCode already exists');
    }

    // Check if instructor exists
    const usersCollection = db.collection('users');
    const instructor = await usersCollection.findOne({ 
      _id: courseData.instructorId,
      role: 'instructor'
    });
    if (!instructor) {
      throw new Error('Invalid instructor ID');
    }

    const result = await coursesCollection.insertOne(courseData);
    return { ...courseData, _id: result.insertedId };
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getCourses = async () => {
  try {
    const coursesCollection = db.collection('courses');
    return await coursesCollection.find({}).toArray();
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    const coursesCollection = db.collection('courses');
    return await coursesCollection.findOne({ _id: courseId });
  } catch (error) {
    console.error('Error getting course:', error);
    throw error;
  }
};

export const updateCourse = async (courseId: string, courseData: Partial<Course>) => {
  try {
    const coursesCollection = db.collection('courses');
    await coursesCollection.updateOne(
      { _id: courseId },
      { $set: courseData }
    );
    return await getCourseById(courseId);
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const coursesCollection = db.collection('courses');
    await coursesCollection.deleteOne({ _id: courseId });
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

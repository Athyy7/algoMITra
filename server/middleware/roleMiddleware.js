// This middleware runs *after* the protect middleware
// It checks if the user's role is 'teacher'

export const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. This route is for teachers only.' 
    });
  }
};
/** @format */

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(403).json({ message: 'User is not authenticated' });
      }
      // Check if the user's role is in the list of allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: 'Access denied. Insufficient role' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Error checking user role', error });
    }
  };
};

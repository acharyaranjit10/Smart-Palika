module.exports = function adminScopeCheck(req, res, next) {
  const { role, adminLevel } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied — not an admin' });
  }

  if (!['ward', 'municipality', 'province'].includes(adminLevel)) {
    return res.status(403).json({ message: 'Invalid admin level' });
  }

  next(); // Allow access to admin dashboard routes
};
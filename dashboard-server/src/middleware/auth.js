
module.exports = (req, res, next) => {
    try {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(403).json({
            error: 'Unauthorized'
        });
    }
  
};
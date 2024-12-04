const isUserAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'You don\'t have the authorization to access this page',
    });
};

module.exports = isUserAdmin;

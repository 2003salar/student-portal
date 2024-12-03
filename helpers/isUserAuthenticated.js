const isUserAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.status(403).json({success: false, message: 'You are unauthorized to access this page'});
    }
}

module.exports = isUserAuthenticated;
module.exports = function checkAuth(shouldBeAuthenticated) {
    return function (req, res, next) {
        const isNotAuthdWhenAuthIsRequired =
            shouldBeAuthenticated && !req.user;
        if ((isNotAuthdWhenAuthIsRequired) ||
            (!shouldBeAuthenticated && req.user)) {
            res.redirect(isNotAuthdWhenAuthIsRequired ? '/login' : '/');
            return;
        }
        next();
    };
};
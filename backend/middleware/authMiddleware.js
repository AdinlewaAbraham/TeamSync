function authMiddleware (req, res, next) {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.send("Welcome to the protected area!");
  } else {
    res.status(401).send("Unauthorized");
  }
}

module.exports =  authMiddleware  ;

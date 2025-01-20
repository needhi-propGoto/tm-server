const jwt = require('jsonwebtoken');

const Authenticate = () => {
  return (req, res, next) => {
    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(' ')[1];
    // console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // console.log("Token decoded:", decoded);
      // console.log("hi")
      req.user = decoded; 
      next();
    } catch (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
    }
  };
};

module.exports = Authenticate;

const jwt = require('jsonwebtoken');

require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign(
        {id: user.id, email: user.email, role: user.role}, 
        process.env.SECRET_KEY,
        {expiresIn: '1h'}
    );
};


module.exports = {
    generateToken,
}
const jwt = require('jsonwebtoken');
const config = require('config');

const signUser = (user, res) => {
    const {id, name} = user;
    jwt.sign(
        {id, name},
        config.get('jwtSecret'),
        {expiresIn: 86400}, // повторная авторизация через 24 часа
        (err, token) => {
            if(err) throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            })
        }
    );
}

module.exports = signUser;
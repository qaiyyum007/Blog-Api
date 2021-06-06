import jwt from "jsonwebtoken"
 export const isAuth = (req, res, next) => {
    // const token = req.headers.authorization;

    const token=req.headers.token
  
    if (token) {
      // const onlyToken = token.slice(7, token.length);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).send({ message: 'Invalid Token' });
        }
        req.user = user;
        next();
        return;
      });
    } else {
      return res.status(401).send({ message: 'Token is not supplied.' });
    }
  };



  export const generateToken = (user) => {
    return jwt.sign(
      {
        _id: user._id,
                name: user.name,
                email: user.email,
                userName: user.userName,
                lastName: user.lastName,
                password:user.password,
      },
      process.env.ACCESS_TOKEN_SECRET || 'somethingsecret',
      {
        expiresIn: '30d',
      }
    );
  };
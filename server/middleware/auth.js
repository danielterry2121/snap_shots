import jwt from 'jsonwebtoken';

const auth = async (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;
        let decodedData;
        //checking if the token is from google
        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');

            req.userId = decodedData.id;
        } else {
            decodedData = jwt.decode(token);
            //sub is googles name for a specific user 
            req.userId = decodedData.sub;
        }
        next();
    } catch (error) {
       console.log(error) 
    }
}

export default auth;
const jwt = require("jsonwebtoken"); 


const authMiddleware = (req,res,next) => {
    const authHeaders= req.headers.authorization 
    if(!authHeaders ){
        return res.status(401).json({error: "Unauthorized"})
    } 

    const token = authHeaders.split(" ")[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded; 
        next();
    }
    catch(err) {
        res.status(401).json({message: "Invalid Token"})
    }

} 

module.exports = authMiddleware;
import jwt from 'jsonwebtoken'

export const AuthUser=(req,res,Next)=>{
    const {token}=req.headers
    console.log(token)
    try{
        if(!token){
            res.json({success:false,msg:"NOT AUTHORIZE LOGIN AGAIN"})
        }
        else{
            const token_decode=jwt.verify(token,process.env.JWT_SECRATE)
            console.log(token_decode)
            req.userId=token_decode
            Next()
        }

    }
    catch(e){
        console.log(e.message)
    }
}
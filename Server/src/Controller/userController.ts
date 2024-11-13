import { emit } from "process";
import { client } from "../Config/db";
import { signupValidator } from "../helper/formValidation";
import  bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";



type DecodeJWT = {

    email:string;
    iat:number;
    exp:number;
}



export default {

    signupPost: async(req:any,res:any)=>{

        try {
           // const validate = signupValidator(req.body)

           // if(!validate){

           //      res.status(400).send({success:false,message:"InvalidData"});
           // }


           const {username,email,phone,password} = req.body;


           const checkQuery = `SELECT * FROM users WHERE email = $1 OR username = $2`;
           const checkResult = await client.query(checkQuery, [email, username]);
       
           if (checkResult.rows.length > 0) {
             return res.status(403).send({
               success: false,
             });
           }
       
           

           try {

               
               const encryptedPassword = bcrypt.hashSync(password,10);

               const query = `INSERT INTO users (username,email,phone,password) VALUES ($1, $2, $3, $4)`;

             await client.query(query,[username,email,phone,encryptedPassword])
              
       const userJWT = jwt.sign({ email }, String(process.env.JWT_KEY), {
           expiresIn: "1h",
         });
 
         return res.status(200).send({ success: true, userJWT });

           } catch (error:any) {

               if(error.code === '23505'){
                   return res.status(403)
                   .send({success:false,message:"Credentials already exists"})
               }

            
           }

        } catch (error) {

           console.log(error);
           
           
        }
    },


   
    loginPost: async(req:any,res:any)=>{

         try {
            
            const {email ,password} = req.body;
   
             const query = `SELECT email, password FROM users WHERE email = $1`;
             const result = await client.query(query,[email])


             const user = result.rows[0];
             const passwordMatch = await bcrypt.compare(password,user.password)

             if(!passwordMatch){

                  return res.status(401).send({success:false,message:"Invalid email or password"});
             }

             const userJWT = jwt.sign({email},String(process.env.JWT_KEY),{
                 expiresIn:'1h'
             })

             res.status(200).send({success:true,message:"Login successfully ",userJWT});

       
         } catch (error) {
              res.status(500).send({success:false,message:"Internal server error"})
         }
    },
    

    verifyUser: async(req:any,res:any)=>{

          try {

            const {userJWT} = req.body;
            
            const verifyJWT = jwt.verify(
                userJWT,
                String(process.env.JWT_KEY)
            )as DecodeJWT;

            return res
            .status(200)
            .send({success:true,message:"User JWT verified successfully"})
            
          } catch (error:any) {

            if(error?.message === 'Invalid signature'){
                  res 
                  .status(401)
                  .send({success:false,message:"User JWT failed to verify"})
            }
            
          }
    },


    uploadImage:async(req:any,res:any)=>{

        try {
           console.log(req.file.filename);
           const {userJWT} = req.body;

           const {email} = jwt.verify(
             userJWT,
             String(process.env.JWT_KEY)
           )as DecodeJWT


           const query = `UPDATE users SET image = $1 WHERE email = $2`;
         let imagePath =  await client.query(query,[req.file.filename,email]);
       
           res.status(200).send({success:true,imagePath:imagePath})
           
        } catch (error) {

          console.log(error);
          
          
        }
    },
    
    fetchUserData: async(req:any,res:any)=>{

      try {

         const {userJWT} = req.body

         console.log("fatchUser Data is comming");
         

         const {email} = jwt.verify(
           userJWT,
           String(process.env.JWT_KEY)
         )as DecodeJWT;

         const query = `SELECT username,email,phone,image FROM users WHERE email=$1`;
         const result = await client.query(query,[email]);
         
         const userData = result.rows[0];
        
         console.log("userdat is comming",userData);
          
         res.status(200).send({success:true,userData})
        
      } catch (error) {
        console.log(error);
        
      }
  },
    
}



import jwt from 'jsonwebtoken';
import {client} from '../Config/db';
import {signupValidator} from '../helper/formValidation';
import  bcrypt from 'bcrypt'

type DecodeJWT = {

    email:string,
    iat:number,
    exp:number;
}

type Row = {
    id:string;
    username:string;
    email:string;
    phone:string;
}

export default{

    adminLoginPost:async(req:any,res:any)=>{

          try {
            const {email,password} = req.body;

            const emailMatch = email ===process.env.ADMIN_EMAIL ;
            const passwordMatch = password === process.env.ADMIN_PASSWORD;


              if(emailMatch&&passwordMatch){

                   const adminJWT = jwt.sign({email},String(process.env.JWT_KEY),{
                     expiresIn:'1h'
                   })

                   res.status(200).send({success:true,adminJWT});
              }else{
                res.status(401).send({success:false,message:"Invalid Credentials"})

              }
          } catch (error) {
              console.log(error);
              
          }
    },


   

    adminDashboardData:async(req:any,res:any)=>{

         try {
            
            const query = `SELECT id, username, email, phone FROM users`;
          const dashboardData: { rows: Row[] } = await client.query(query);

            
         
            res.status(200).send({success:true,dashboardData:dashboardData?.rows})
            
         } catch (error) {

            res.status(500).send({success:false,message:"Failed to fetch data from db"})
            
         }
    },
    verifyAdmin:async(req:any,res:any)=>{

        try {
            const {adminJWT} = req.body;
    
            const verifyJWT = jwt.verify(
                adminJWT,
                String(process.env.JWT_KEY )
            )as DecodeJWT;

            if(verifyJWT.email !== process.env.ADMIN_EMAIL){
                  
                 return res.status(401).send({success:false,message:"AdminJWT failed to verified"})
            }


                        
                res.status(200).send({success:true,message:"Admin JWT verified successfulyy"});

            
        } catch (error:any) {

           if(error?.message==="Invalid signature"){

               res.status(401).send({success:false,message:"Admin JWT failed to verify"});
           }
           
        }  
   },


   updatedUser: async(req:any,res:any)=>{

  
        try {
            const { id } = req.params;
            const { username, email, phone } = req.body;
    
            const query = `UPDATE users SET username = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *`;
            const result = await client.query(query, [username, email, phone, id]);
    
            if (result.rows.length > 0) {
                res.status(200).send({
                    success: true,
                    user: result.rows[0],
                });
            } else {
                res.status(404).send({ success: false, message: "User not found" ,imagePath: req.file.filename,});
            }


        } catch (error) {
            console.log("Error updating user:", error);
            res.status(500).send({ success: false, message: "Internal server error" });
        }
     
   },


   deleteUser:async(req :any,res:any)=>{

          try {
             const {id} = req.params;

             const query = `DELETE FROM users WHERE id=$1`;
             await client.query(query,[id])
             res.status(200).send({success:true})
          } catch (error) {
            
          }
   },
   addUser: async (req: any, res: any) => {
    try {
      const { username, email, phone, password } = req.body;
  
      const checkQuery = `SELECT * FROM users WHERE email = $1`;
      const existingUserResult = await client.query(checkQuery, [email]);
  
      if (existingUserResult.rows.length > 0) {
        return res.status(200).send({
          success: false,
          message: "User with this email already exists",
        });
      }
  
      const encryptedPassword = await bcrypt.hash(password, 10); 
  
      const insertQuery = `INSERT INTO users (username, email, phone, password) 
                           VALUES ($1, $2, $3, $4) RETURNING id, username, email, phone`;
  
      const result = await client.query(insertQuery, [username, email, phone, encryptedPassword]);
  
      if (result.rows.length > 0) {
        const newUser = result.rows[0];
  
        return res.status(200).send({ success: true, newUser });
      } else {
        throw new Error('Failed to insert new user');
      }
    } catch (error: any) {
      console.log("Error adding user:", error);
      if (error.code === "23505") {
        return res.status(200).send({ success: false, message: "Credentials already exist" });
      } else {
        return res.status(500).send({ success: false, message: error.message });
      }
    }
  }
  
}
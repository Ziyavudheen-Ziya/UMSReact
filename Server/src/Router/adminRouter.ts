import {Router} from 'express';
import adminController from '../Controller/adminController';
const adminRouter = Router();


adminRouter.post('/login',adminController.adminLoginPost)
adminRouter.post('/getDashboardData',adminController.adminDashboardData)
adminRouter.post('/verifyAdmin',adminController.verifyAdmin)
adminRouter.put('/updateUser/:id',adminController.updatedUser)
adminRouter.delete('/delete/:id',adminController.deleteUser)
adminRouter.post('/add',adminController.addUser)

export default adminRouter
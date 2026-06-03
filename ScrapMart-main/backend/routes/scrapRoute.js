import express from 'express'
import { addScrap, allBit, allSCrap, sendBit, userSCrap } from '../controller/scrapController.js'
import { AuthUser } from '../middlewere/Auth.js'
import { upload } from '../middlewere/multer.js'
const scrapRouter=express.Router()

//api 
scrapRouter.post('/add',upload.single('image'),AuthUser,addScrap)
scrapRouter.get('/allScrap',AuthUser,allSCrap)
scrapRouter.get('/userscrap',AuthUser,userSCrap)
scrapRouter.post('/sendbit',AuthUser,sendBit)
scrapRouter.get('/allbit/:scrapId',AuthUser,allBit)

export default scrapRouter
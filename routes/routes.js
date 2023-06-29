import express from 'express';
import { getAllUsers, createUser, deleteUser, editUser, getUserId } from '../controllers/UserController.js';
import passport from 'passport';
import { checkAuthenticated, checkNoAuthenticated } from '../services/LoginService.js';

const router = express.Router();

//Usuarios

router.get('/crud', checkAuthenticated, getAllUsers);
router.post('/create', checkNoAuthenticated, createUser);
router.post('/edit/user', checkAuthenticated ,editUser);
router.get('/delete/user/:id', checkAuthenticated, deleteUser);
router.get('/user/:id', getUserId);

//Login

router.get('/login', checkNoAuthenticated ,(req, res) => {

    res.render('signIn');

})

router.post('/login', checkNoAuthenticated, passport.authenticate("local", {

    successRedirect: "/inicio",
    failureRedirect: "/",
    failureFlash: true

}))

//Register

export default router;
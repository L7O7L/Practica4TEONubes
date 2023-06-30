import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import users from './routes/routes.js'
import { dirname } from 'path'; 
import { fileURLToPath } from 'url'; 
import { checkAuthenticated, initializePassport } from './services/LoginService.js';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import { readAllUsers } from './services/UserService.js';
import methodOverride from 'method-override';

readAllUsers().then(result => {

    const usuarios = [];

    var a = "";

    for ( a in result.data){

        usuarios.push(result.data[a]);

    }

    initializePassport(

        passport,
        email => usuarios.find(user => user.email === email),
        id => usuarios.find(user => user.id === id)
    
    )
    
    return usuarios;

})

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/templates'));

app.use(bodyParser.json());

app.use(flash());

app.use(session({

    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());

app.use(passport.session());

app.use(methodOverride("_method"));

//--------------------------------------------------------------------------------------

app.get('/', checkAuthenticated, (req, res) => {

    res.sendFile(__dirname + '/templates/landing_page.html')

})

app.get("/registrar", (req, res) => {

    res.render('register');

});

app.use('/', users);

//-------------------------------------------------------------------------------------

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Port listening on ${PORT}`);
}) 
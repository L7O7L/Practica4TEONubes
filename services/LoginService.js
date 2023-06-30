import bcrypt from 'bcrypt';
import passlocal from 'passport-local'

const LocalStrategy = passlocal.Strategy;

function initializePassport(passport, getUserByEmail, getUserById){

    console.log(getUserByEmail);

    //Funcion para poder autentificar usuarios

    const authenticateUsers = async (email, password, done) => {

        console.log(email, password);

        //Obtener usuario por email 

        const user = getUserByEmail(email);

        console.log(user);

        if (user == null) {

            console.log(user);
            return done(null, false, { message: "Nombre de usuario " });

        }

        try {

            if (await bcrypt.compare(password, user.password)) {

                console.log(user, password, user.password);
                return done(null, user);

            }else {

                return done(null, false, { message: "ontraseña no válidos" });

            }
            
        } catch (error) {

            console.log(error);
            return done(error);

        }        

    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUsers))
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {

        return done(null, getUserById(id));

    });

}

function checkAuthenticated(req, res, next){

    if(req.isAuthenticated()){

        return next();

    }

    res.redirect("/login");

}

function checkNoAuthenticated(req, res, next){

    if (req.isAuthenticated()){

        res.redirect("/login")

    }

    next();

}

export {

    initializePassport,
    checkAuthenticated,
    checkNoAuthenticated

}

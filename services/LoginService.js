import bcrypt from 'bcrypt';
import passlocal from 'passport-local'

const LocalStrategy = passlocal.Strategy;

function initializePassport(passport, getUserByEmail, getUserById){

    //Funcion para poder autentificar usuarios

    const authenticateUsers = async (email, password, done) => {

        //Obtener usuario por email 

        const user = await getUserByEmail(email);

        if (user != null) {

            try {

                if (await bcrypt.compare(password, user.password)) {

                    return done(null, user);

                }else {

                    return done(null, false, { message: "Contraseña incorrecta" });

                }
                
            } catch (error) {

                console.log(error);
                return done(error);

            }

        }

        return done(null, false, { message: "No se encontro al usuario" });

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

    res.redirect("/");

}

function checkNoAuthenticated(req, res, next){

    if (req.isAuthenticated()){

        res.redirect("/")

    }

    next();

}

export {

    initializePassport,
    checkAuthenticated,
    checkNoAuthenticated

}

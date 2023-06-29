import { createOrUpdate, deleteUserById, getUserById, readAllUsers } from "../services/UserService.js"
import bcrypt from 'bcrypt';

var getAllUsers = async (req, res) => {

    try {

        const { success, data } = await readAllUsers();

        if (success) {

            return res.render('crud', {data: data});

        }

        return res.status(500).json({ success: false, message: 'Error' });
        
    } catch (err) {
        
        console.log(err);

    }

}

var getUserId = async (req, res) => {

    try {

        const { id } = req.params;

        const userId = id;

        const { success, data } = await getUserById(userId);

        console.log(data);

        if (success) {

            return res.render('editar', { success: true, data: data });

        }

        return res.status(500).json({ success: false, message: "Error" });
        
    } catch (err) {

        console.log(err);
        
    }

}

var createUser = async (req, res) => {

    try {

        var d = new Date().getTime();

        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        const id = uuid;
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const email = req.body.email;
        const password = await bcrypt.hash(req.body.password, 10);

        const user = req.body;

        user.id = id; 
        user.nombre = nombre;
        user.apellido = apellido;
        user.email = email;
        user.password = password;

        const { success, data } = await createOrUpdate(user);

        console.log(data);

        if (success) {

            return res.redirect('/');

        }

        return res.status(500).json({ message: "Error" });
        
    } catch (err) {

        console.log(err);
        
    }

}

var editUser = async (req, res) => {

    try {

        const id = req.body.id;
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const email = req.body.email;
        const password = req.body.password;

        const user = req.body;

        user.id = id; 
        user.nombre = nombre;
        user.apellido = apellido;
        user.email = email;
        user.password = password;

        const { success, data } = await createOrUpdate(user);

        console.log(data);

        if (success) {

            return res.redirect('/crud');

        }

        return res.status(500).json({ message: "Error" });
        
    } catch (err) {

        console.log(err);
        
    }

}

var deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const userId = id;

        const { success, data } = await deleteUserById(userId);

        console.log(data);

        if (success) {

            return res.redirect('/crud');

        }

        return res.status(500).json({ success: false, message: 'Error' });
        
    } catch (err) {

        console.log(err);
        
    }

}

export {

    getAllUsers,
    getUserId,
    createUser,
    editUser,
    deleteUser

}
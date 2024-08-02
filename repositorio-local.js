//importamos para usar una db local
import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

import crypto from 'node:crypto'

//aqui es donde le decimos que guardara los datos en la carpeta db y creamos el schema para el usuario
const { Schema } = new DBLocal({ path: './db' })

//propiedades del usuario
const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

//exportamos la clase para poder usarla en otro archivo
export class RepositorioLocal{
    static async create ({username, password}) {
        //1. validaciones del username y password
        Validation.username(username)
        Validation.password(password)  

        //2. validamos que el usuario no exista
        const user = User.findOne({ username })
        if (user) throw new Error('El usuario ya existe')

        const id = crypto.randomUUID()

        //3. hashear el password
        const hashearPassword = await bcrypt.hash(password, 10)

        User.create({
            _id: id,
            username,
            password: hashearPassword
        }).save()

        return id
    }
    static async login ({username, password}) {
        Validation.username(username)
        Validation.password(password)

        const user = User.findOne({ username }) 
        if (!user) throw new Error('El usuario no existe')

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('El password es incorrecto')

        //aqui se retorna el usuario sin el password, quitamos el password para no enviarlo hacia el cliente
        const { password: _, ...publicUser } = user

        return publicUser
    }
}

//clase para validar el username y password
class Validation {
    static username (username) {
        if(typeof username !== 'string') throw new Error('El username debe ser un string')
        if(username.length < 3) throw new Error('El username debe tener al menos 3 caracteres')
    }

    static password (password) {
        if(typeof password !== 'string') throw new Error('El password debe ser un string')   
        if(password.length < 3) throw new Error('El password debe tener al menos 3 caracteres')    
    }
}
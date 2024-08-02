import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { RepositorioLocal } from './repositorio-local.js';
import { SECRET_JWT_KEY } from './config.js';

const app = express();

//middleware es una funcion que se ejecuta antes de que llegue a la ruta, es para que en el metodo post pueda leer el body de la peticion
app.use(express.json());
//middleware para leer y modificar las cookies
app.use(cookieParser());
//middleware para leer el token y verificar si el usuario esta logeado
app.use((req, res, next) => {
    const token = req.cookies.access_token

    req.session = { user: null }

    try{
        const data = jwt.verify(token, SECRET_JWT_KEY)
        req.session.user = data
    } catch {}

    next() //para que continue con la siguiente ruta o middleware
})
//lo que va a hacer es que va a renderizar los archivos ejs
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const { user } = req.session
    res.render('index', user)
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await RepositorioLocal.login({ username, password })
        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, { expiresIn: '1h' })
        res
            .cookie('access_token', token, {
                 httpOnly: true, //la cookie solo se puede leer desde el servidor
                 secure: process.env.NODE_ENV === 'production', //la cookie solo se puede enviar por https en produccion
                 sameSite: 'strict' //la cookie solo se puede enviar si la peticion es del mismo sitio
                 })

            .send({ user, token })
    } catch (error) {
        res.status(401).send({ error: error.message })
    }
})

app.post('/register', async (req, res) => {
    const { username, password} = req.body
    console.log(req.body)

    try{
        const id = await RepositorioLocal.create({ username, password })
        res.send({ id })
    }   catch (error) {
        //no es recomendable enviar el error tal cual, es mejor enviar un mensaje personalizado dependiendo del error
        res.status(400).send({ error: error.message })
    }
})


app.post('/logout', (req, res) => {
    res
    .clearCookie('access_token')
    .send({ message: 'Sesion cerrada' })
})

//ruta protegida
app.get('/protected', (req, res) => {
    const { user } = req.session
    if (!user) return res.status(403).send({ error: 'No tienes acceso a esta ruta' })
 
    res.render('protected', user) // user tendria { _id, username } de lo que se guardo al hacer login
})

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
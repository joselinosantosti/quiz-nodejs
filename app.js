//Modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Pergunta')
const Pergunta = mongoose.model('perguntas')
const usuarios = require('./routes/usuarios')
const passport = require('passport')
require('./config/auth')(passport)
const db = require('./config/db')

//CONFIG
//Sessao
app.use(session({
	secret: 'chavesegura',
	resave: true,
	saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Middleware
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.error = req.flash('error')
	res.locals.user = req.user || null
	next()
})

//Bodyparser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Handlebars
app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	runtimeOptions: {
	     allowProtoPropertiesByDefault: true,
	     allowProtoMethodsByDefault: true,
	 },
}))
app.set('view engine', 'handlebars')

//Mongoose
mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('MongoDB conectado...')
}).catch((err) => {
	console.log('Erro na conexao com o MongoDB'+err)
})

//Public
app.use(express.static(path.join(__dirname,'public')))

//Rotas
app.get('/', (req, res) => {
	Pergunta.find().limit(1).populate('categoria').then((perguntas) => {
		res.render('perguntas/index', {perguntas: perguntas})
	}).catch((err) => {
		req.flash('error_msg', 'Erro ao listar perguntas!')
		res.redirect('/admin')
	})
})

app.get('/404', (req, res) => {
	res.send('Erro 404!')
})

app.get('/perguntas', (req, res) => {
	Pergunta.find().then((perguntas) => {
		res.render('perguntas/index', {perguntas: perguntas})
	}).catch((err) => {
		req.flash('error_msg', 'Erro ao listar perguntas!')
		res.redirect('/admin')
	})
})

app.use('/admin', admin)
app.use('/usuarios', usuarios)

//Run server
const PORT = process.env.PORT || 8089
app.listen(PORT, () => {
	console.log('Server running on port '+PORT)
})
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Pergunta')
const Pergunta = mongoose.model('perguntas')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
const {isAdmin} = require('../helpers/isAdmin')

router.get('/', isAdmin, (req, res) => {
	res.render('admin/index')
})

//CRUD categorias
router.get('/categorias', isAdmin, (req, res) => {
	Categoria.find().sort({date:'desc'}).then((categorias) => {
		res.render('admin/categorias', {categorias: categorias})
	}).catch((err) => {
		req.flash('error_msg', 'Erro ao listar categorias!')
		res.redirect('/admin')
	})
})

router.get('/categorias/add', (req, res) => {
	res.render('admin/add_categoria')
})

router.post('/categorias/novo', isAdmin, (req, res) => {
	//Validation
	var erros = []
	if (!req.body.titulo || req.body.titulo == undefined || req.body.titulo == null) {
		erros.push({texto: 'Título inválido'})
	}

	if (req.body.titulo.length < 2) {
		erros.push({texto: 'Título muito curto'})
	}

	if(erros.length > 0) {
		res.render('admin/add_categoria', {erros: erros})
	} else {

		const novaCategoria = {
			titulo: req.body.titulo,
		}
		new Categoria(novaCategoria).save().then(() =>
		{
			req.flash('success_msg', 'Categoria salva com sucesso')
			res.redirect('/admin/categorias')
		}).catch((erro) => {
			req.flash('error_msg', 'Erro ao salvar categoria')
			res.redirect('/admin')
		})
	}
})

router.get('/categorias/edit/:id', isAdmin, (req, res) => {
	Categoria.findOne({_id:req.params.id}).then((categoria) => {
		res.render('admin/edit_categoria', {categoria:categoria})
	}).catch((erro) => {
		req.flash('error_msg', 'Categoria não existe')
		res.redirect('/admin/categorias')
	})	
})

router.post('/categorias/edit', isAdmin, (req, res) => {
	//Validacao

	//Editar
	Categoria.findOne({_id: req.body.id}).then((categoria) => {
		categoria.titulo = req.body.titulo

		categoria.save().then(() => {
			req.flash('success_msg', 'Categoria alterada com sucesso')
			res.redirect('/admin/categorias')
		}).catch((erro) => {
			req.flash('error_msg', 'Erro ao salvar a edição')
			res.redirect('/admin/categorias')
		})
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao editar a categoria')
		res.redirect('/admin/categorias')
	}) 
})

router.post('/categorias/deletar', isAdmin, (req, res) => {
	Categoria.deleteOne({_id: req.body.id}).then(() => {
		req.flash('success_msg', 'Categoria deletada com sucesso')
		res.redirect('/admin/categorias')
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao deletar Categoria')
		res.redirect('/admin/categorias')
	})
})

//CRUD perguntas
router.get('/perguntas', isAdmin, (req, res) => {
	Pergunta.find().then((perguntas) => {
		res.render('admin/perguntas', {perguntas: perguntas})
	}).catch((err) => {
		req.flash('error_msg', 'Erro ao listar perguntas!')
		res.redirect('/admin')
	})
})

router.get('/perguntas/add', (req, res) => {
		Categoria.find().then((categorias) => {
			res.render('admin/add_pergunta', {categorias: categorias})
		}).catch((erro) => {
			req.flash('error_msg', 'Erro ao carregar o formulário')
			res.redirect('/admin')
	})
})

router.post('/perguntas/novo', isAdmin, (req, res) => {
	//Validation
	var erros = []
	if (!req.body.pergunta || req.body.pergunta == undefined || req.body.pergunta == null) {
		erros.push({texto: 'Pergunta inválida!'})
	}

	if (req.body.pergunta.length < 2) {
		erros.push({texto: 'Texto muito curto!'})
	}

	if(erros.length > 0) {
		res.render('admin/add_pergunta', {erros: erros})
	} else {

		const novaPergunta = {
			pergunta: req.body.pergunta,
			alternativa1: req.body.alternativa1,
			alternativa2: req.body.alternativa2,
			alternativa3: req.body.alternativa3,
			alternativa4: req.body.alternativa4,
			categoria: req.body.categoria,
			resposta: req.body.resposta
		}
		new Pergunta(novaPergunta).save().then(() =>
		{
			req.flash('success_msg', 'Pergunta salva com sucesso!')
			res.redirect('/admin/perguntas')
		}).catch((erro) => {
			req.flash('error_msg', 'Erro ao salvar pergunta!')
			res.redirect('/admin')
		})
	}
})

router.get('/perguntas/edit/:id', isAdmin, (req, res) => {
	Pergunta.findOne({_id:req.params.id}).then((pergunta) => {
		Categoria.find().then((categorias) => {
			res.render('admin/edit_pergunta', {categorias: categorias, pergunta: pergunta})
		}).catch((erro) => {
			req.flash('error_msg', 'Erro ao listar categorias')
		})
	}).catch((erro) => {
		req.flash('error_msg', 'Pergunta não existe!')
		res.redirect('/admin/perguntas')
	})
})

router.post('/perguntas/edit', isAdmin, (req, res) => {
	//Validacao

	//Editar
	Pergunta.findOne({_id: req.body.id}).then((pergunta) => {
		pergunta.pergunta = req.body.pergunta
		pergunta.alternativa1 = req.body.alternativa1
		pergunta.alternativa2 = req.body.alternativa2
		pergunta.alternativa3 = req.body.alternativa3
		pergunta.alternativa4 = req.body.alternativa4
		pergunta.categoria = req.body.categoria
		pergunta.resposta = req.body.resposta
		

		pergunta.save().then(() => {
			req.flash('success_msg', 'Pergunta alterada com sucesso!')
			res.redirect('/admin/perguntas')
		}).catch((erro) => {
			req.flash('error_msg', 'Erro ao salvar a edição!')
			res.redirect('/admin/perguntas')
		})
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao editar o pergunta!')
		res.redirect('/admin/perguntas')
	}) 
})

router.post('/perguntas/deletar', isAdmin, (req, res) => {
	Pergunta.deleteOne({_id: req.body.id}).then(() => {
		req.flash('success_msg', 'Pergunta deletada com sucesso!')
		res.redirect('/admin/perguntas')
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao deletar Pergunta')
		res.redirect('/admin/perguntas')
	})
})

module.exports = router
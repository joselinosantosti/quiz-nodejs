const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pergunta = new Schema ({
	pergunta: {
		type: String,
		required: true
	},
	categoria: {
		type: Schema.Types.ObjectId,
		ref: "categorias",
		required: true
	},
	alternativa1: {
		type: String,
		required: true
	},
	alternativa2: {
		type: String,
		required: true
	},
	alternativa3: {
		type: String,
		required: true
	},
	alternativa4: {
		type: String,
		required: true
	},
	resposta: {
		type: String,
		required: true
	}

})

mongoose.model('perguntas', Pergunta)
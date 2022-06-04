const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Categoria = new Schema({
	titulo: {
		type: String,
		required: true
	}
})

mongoose.model('categorias', Categoria)
const express = require('express')
const app = express()
require('dotenv').config()
const sequelize = require("./db");
const Link = require('./models');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

sequelize.sync(() => console.log(`Banco de dados conectado: ${process.env.DB_NAME}`));

function generateCode() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// um método de encurtar uma URL persistindo-a no banco de dados.
app.post('/new',express.json(),  async (req, res) => {
  const url = req.body.url;

  const code = generateCode();
  const dateObject = new Date();
  const createdAt = `${dateObject.getDate().toString()}/${(dateObject.getMonth() + 1).toString()}/${dateObject.getFullYear().toString()}`;

  const resultado = await Link.create({
    url,
    code,
    createdAt
  })

  res.send(`${process.env.DOMAIN}${code}`);
})




// um método que retorna uma url encurtada conforme o encurtamento da URL.
app.get('/code/:code', async (req, res, next) => {
  const code = req.params.code;
 
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);
 
  resultado.hits++;
  await resultado.save();
 
  res.send(resultado.url);
})

// um método que retorna uma url encurtada conforme um id.
app.get('/findById/:id', async (req, res, next) => {
  const id = req.params.id;
 
  const resultado = await Link.findOne({ where: { id } });

  const all = await Link.findAll({})

  console.log(all)

  if (!resultado) return res.sendStatus(404);
 
  resultado.hits++;
  await resultado.save();
 
  res.send(resultado.url);
})


// um método que retorna todas as URLs encurtadas em uma data específica.
app.post('/date', express.json(), async (req, res, next) => {
  const createdAt = req.body.createdAt;

  const resultado = await Link.findAll({ where: { createdAt } });
  if (!resultado) return res.sendStatus(404);

  for(var each in resultado){
    each.hits++
   
  }

  res.send(resultado)
 
})

app.get('/hello', async (req, res, next) => {

  res.send('Hello World')
 
})




app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
})
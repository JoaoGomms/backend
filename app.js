const express = require('express')
const app = express()
require('dotenv').config()
const sequelize = require("./db");
const Link = require('./models');

sequelize.sync(() => console.log(`Banco de dados conectado: ${process.env.DB_NAME}`));

function generateCode() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

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





app.get('/code/:code', async (req, res, next) => {
  const code = req.params.code;
 
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);
 
  resultado.hits++;
  await resultado.save();
 
  res.send(resultado.url);
})

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



app.post('/date', express.json(), async (req, res, next) => {
  const createdAt = req.body.createdAt;

  const resultado = await Link.findAll({ where: { createdAt } });
  if (!resultado) return res.sendStatus(404);

  for(var each in resultado){
    each.hits++
   
  }

  res.send(resultado)
 
})





app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
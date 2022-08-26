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
  const code = generateCode();
  const url = req.body.url;

  const resultado = await Link.create({
    url,
    code
  })

  res.send(`${process.env.DOMAIN}${code}`);
})





app.get('/:code', async (req, res, next) => {
  const code = req.params.code;
 
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);
 
  resultado.hits++;
  await resultado.save();
 
  res.redirect(resultado.url);
})



app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
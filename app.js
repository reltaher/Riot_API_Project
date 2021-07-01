const express = require('express');
const fetch = require('node-fetch');
const engine = require('ejs-mate');
const path = require('path');
const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));

const NA1 = 'na1.api.riotgames.com';
const championData = 'http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json'

app.get('/', async(req, res) => {
    const response = await fetch(championData);
    const champions = await response.json();
    //Object.values(champions).forEach(champion => res.render('home', {champion}))
    
    res.render('home', {champions});
})

app.get('/home', (req, res) => {
    res.render('home');
})


app.listen(3000, () => {
    console.log("Serving on Port 3000");
});
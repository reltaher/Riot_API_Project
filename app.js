const express = require('express');
const fetch = require('node-fetch');
const engine = require('ejs-mate');
const path = require('path');
const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const NA1 = 'na1.api.riotgames.com';
const championsData = 'http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json'

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/champions', async(req, res) => {
    // const response = await fetch(championsData);
    // const champions = await response.json();   
    // res.render('home', {champions});

    await fetch(championsData).then(async response => {
        try {
            const champions = await response.json(); 
            res.render('champion/champions', {champions});
        } catch(error) {
            console.log(error);
        }
    })
})

app.get('/champions/:champName', async(req, res) => {
    const championData = `http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/${req.params.champName}.json`
    const response = await fetch(championData);
    const champion = await response.json(); 
    res.render('champion/championPage', {champion});
})

app.listen(3000, () => {
    console.log("Serving on Port 3000");
});
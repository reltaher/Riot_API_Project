if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const fetch = require('node-fetch');
const engine = require('ejs-mate');
const path = require('path');
const romanToNumeral = require('./public/scripts/helper');
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
    const response = await fetch(championsData);
    const champions = await response.json();   
    res.render('champion/champions', {champions});
})

app.get('/champions/:champName', async(req, res) => {
    let { champName } = req.params;
    //Wukong
    if (champName === 'Wukong') {champName = 'MonkeyKing';}
    //Nunu & Willump
    if (champName === 'Nunu & Willump') {champName = 'Nunu';}
    //Kog'Maw
    if (champName === 'Kog\'Maw') {champName = 'KogMaw';}
    //Dr. Mundo
    if (champName === 'Dr. Mundo') {champName = 'DrMundo';}
    //LeBlanc
    if (champName === 'LeBlanc') {champName = 'Leblanc';}
    //Rek'Sai
    if (champName === 'Rek\'Sai') {champName = 'RekSai';}
    //Any champ with an apostraphe in their name (Kog'Maw & Rek'Sai are exceptions since their names in the API are "KogMaw" and "RekSai" respectively).
    if (champName.includes('\'')) {champName = champName.charAt(0) + champName.substring(1).toLowerCase().replace('\'', '');}
    //Any champion with a space in their name
    if (champName.includes(' ')) {champName = champName.replace(' ', '');}
    const championData = `http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions/${champName}.json`
    const response = await fetch(championData);
    const champion = await response.json(); 
    res.render('champion/championPage', {champion});
})

app.get('/:summonerName', async(req, res) => {
    const {summonerName} = req.query;
    //console.log(summonerName);
    const apikey = process.env.RIOT_API_KEY;
    //console.log(apikey);
    if (req.query) {
    const accountInfo = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apikey}`)
    const summonerAccountInfo = await accountInfo.json();
    //console.log(summonerAccountInfo);
    const rankedInfo = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerAccountInfo.id}?api_key=${apikey}`)
    const summonerRankedInfo = await rankedInfo.json();
    //console.log(summonerRankedInfo);
    const matchHistoryID = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerAccountInfo.puuid}/ids?api_key=${apikey}`);
    const summonerMatchHistoryID = await matchHistoryID.json();
    //console.log(summonerMatchHistoryID);

    const championsResponse = await fetch(championsData);
    const champions = await championsResponse.json();

    const summonerSpellResponse = await fetch('http://ddragon.leagueoflegends.com/cdn/11.14.1/data/en_US/summoner.json');
    const summonerSpells = await summonerSpellResponse.json();

    const runesResponse = await fetch('http://ddragon.leagueoflegends.com/cdn/11.14.1/data/en_US/runesReforged.json');
    const runes = await runesResponse.json();

    const profileIconResponse = await fetch(`http://ddragon.leagueoflegends.com/cdn/11.14.1/img/profileicon/${summonerAccountInfo.profileIconId}.png`);

    let summonerMatchHistory;
    let matchHistories = [];
    for (let match of summonerMatchHistoryID) {
        const matchHistory = `https://americas.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${apikey}`;
        const matchHistoryResponse = await fetch(matchHistory);
        summonerMatchHistory = await matchHistoryResponse.json();
        matchHistories.push(summonerMatchHistory);
    }

    //res.json(matchHistories);
    res.render('summoners/summonerPage', {summonerAccountInfo, summonerRankedInfo, matchHistories, summonerSpells, champions, runes, helper: romanToNumeral});
    }
})

app.listen(3000, () => {
    console.log("Serving on Port 3000");
});
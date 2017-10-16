'use strict'
var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.use(express.static('.'));
var hpp;
var pars = ['PC711','PC705','pc713'];
var patito = ['PC705','PC463','PC494'];
var watimbo = ['pc713','pc705','pa383'];

var port = process.env.PORT || 8080;

/*
recu(['pc711'],(cb)=>{
        lo(cb);
    })
*/

app.get('/:par',(req,res)=>{
    var pars = [req.params.par];
    
    if(pars[0]=='patito') pars = patito;
    if(pars[0]=='watimbo') pars = watimbo;
    
    
    hpp = '<link rel="stylesheet" type="text/css" href="./css.css">\n';
    recu(pars,(cb)=>{
        res.set('Content-Type','text/html');
        res.send(cb);
    });
});

app.get('/', function(req, res){
    hpp = '<link rel="stylesheet" type="text/css" href="./css.css">\n';
    recu(pars,(cb)=>{
        res.set('Content-Type','text/html');
        res.send(cb);
    });
});

function lo(str){
    console.log(str);
}

function recu(pars,cb){
    //for each paradero request
    for (let i in pars){
        var call = httph(pars[i]);
        request(call, function(err, res, html){
            if(!err){
                var $ = cheerio.load(html);
                $('.cabecera1').remove();
                $('.imagenfo').remove();
                hpp = hpp+$('table')+'\n';
                //if(i==pars.length-1) return cb(hpp);
                
                var nta = (hpp.match(/Nombre/g) || []).length;
                if(nta==pars.length) return cb(hpp);
            }
            else{
                lo('\n\ncan\'t load html');
                cb(err);
            }
        });
    }
    //return cb(hpp);
}

//get paradero id and send http header for request
function httph(paradero){
    var reto = {
        url : `http://m.ibus.cl/Servlet?paradero=${paradero}&servicio=&button=Consulta+Paradero`,
        headers : { 'User-Agent' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1' }
    }
    return reto;
}

app.listen(port);
exports = module.exports = app;

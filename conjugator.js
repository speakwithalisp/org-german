var fs = require('fs');
var http = require('http');
var verbix = require('verbix');
var API = '3218c880-f5d9-11e5-be88-00089be4dcbc';
var infinitives = fs.readFileSync('infinitives.out','utf8').replace(/\u00B7/g,'.').split(/\*[ ]+([a-zA-Z\.äÄöÖëËüÜß]+)[ ]*\n/g);
infinitives = infinitives.filter(function(item,pos){
    return infinitives.indexOf(item) === pos;    
});
var metaInfy = [];
infinitives.forEach(function(elt){
    if(elt !== ''){
        if(elt.indexOf('.') !== -1)
            elt =  elt.split('.').join('')+'.';
        else
            elt += 'X';
        metaInfy.push(elt);
    } 
});
var verbs = {};
metaInfy.forEach(function(elt){
    if(elt === '')
        console.log("empty");
    else
    {
        var tle = elt.slice(0,-1);
        http.get('http://api.verbix.com/translatorv2/json/'+API+'/de/en/'+encodeURIComponent(tle), function(res){
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function(){
            verbs[tle]= {translation: JSON.parse(data).map(function(elt){return elt.translation;}).reduce(function(sum,elt){if(!elt) return ''+sum; if(elt === sum.slice(sum.length -elt.length -1, sum.length - 1)) return sum; else return (sum+';'+elt)||'';}), meaning: JSON.parse(data)[0].meaning};
            if(!verbs[tle])
                console.log(elt);
            else{
            if(elt.indexOf('.') !== -1)
                verbs[tle]['trennbare']= true;
            else
                verbs[tle]['trennbare']= false;
            verbix.conjugate('German', tle).then(function(word){
                verbs[tle].conjugated = {present: word.indicative.present,
                                 perfect: word.indicative.perfect,
                                 past: word.indicative.past
                                };
            });
            }
            });
              });
    }
});

var buffer = (function(obj,name){
    var translation = obj.translation + '--' + obj.meaning;
    var infinitive = name;
    var tablify = function(conj){
        var table = '';
        Object.keys(conj).forEach(function(elt){
            table += '|' + elt + '|' + conj[elt] + '|\n';
        });
        return table;
    };
    var format = (function(inf,trans,tenses,trenn){
        var output = "** Verb \t :drill:\n";
        output += ":PROPERTIES:\n:DRILL_CARD_TYPE: conjugate\n:VERB_INFINITIVE: \"" + inf + (trenn ? ' Trennbare':'') + "\"\n:VERB_TRANSLATION: \""+ trans + "\"\n:END:\n";
        Object.keys(tenses).forEach(function(tense){
            output += "*** \t :drill:\n";
            output += ":PROPERTIES:\n:VERB_TENSE: \"" + tense + "\"\n:END:\n";
            output += tablify(tenses[tense]);
        });
        return output;
        
    }(infinitive,translation,obj.conjugated,obj.trennbare));
    return format;
    
    
});
/*
Object.keys(verbs).forEach(function(verb){
 if(verbs[verb])
    fs.appendFileSync('german-verbs-test.org',buffer(verbs[verb],verb), 'utf-8');
});
*/
















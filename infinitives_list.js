var vocabulary = require('./vocabulary.json');
var verbix = require('verbix');
var fs = require('fs');
var infinitives = [];
var verbs = {};
vocabulary.vocab_overview.forEach(function(elt){
    if(elt.pos === 'Verb'){
        if(infinitives.indexOf(elt.infinitive) === -1)
            infinitives.push(elt.infinitive);
    }
});
infinitives.forEach(function(elt){
    fs.appendFileSync('/home/shounak/org notes/German/infinitives.out','* '+elt+'\n','utf8');
});















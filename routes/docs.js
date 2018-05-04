var express = require('express');
var router = express.Router();

function commonKeys(o1, o2){
  return Object.keys(o1)
    .filter({}.hasOwnProperty.bind(o2));
}

function dot(o1, o2, ck){
  var sum = 0;

  for(k in ck){
    var key = ck[k];
    sum += o1[key]*o2[key];
  }
  return sum;
}

function norm(o){
  var sum = 0;
  var keys = Object.keys(o).filter(k=>(k!='_id'&&k!='index'));
  for(k in keys){
    sum += Math.pow(o[keys[k]],2);
  }
  sum = Math.sqrt(sum);
  return sum;
}

function cosineSimilarity(o1, o2, o1_norm){
  var ck = commonKeys(o1, o2)
        .filter(k=>(k!='_id'&&k!='index'));
  return dot(o1, o2, ck)/(o1_norm*norm(o2));
}

router.get('/docs', function(req, res){
  var db = req.db;

  db.collection('docs').find({},function(e, docs){
    var sel = docs[5];
    var o1_norm = norm(sel);

    for(d in docs){
      docs[d].similarity = cosineSimilarity(sel, docs[d], o1_norm);
    }
    docs = docs.sort(function(a,b){
      var keyA = a['similarity'];
      var keyB = b['similarity'];
      if(keyA<keyB) return 1;
      if(keyB<keyA) return -1;
      return 0;
    })
    .slice(1,11);
  res.json(docs);
  });

});
module.exports = router;

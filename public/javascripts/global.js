var docsData = [];

$(document).ready(function() {
    loadFirstDocument();
});

function loadFirstDocument(){
    var listData = '';

    $.getJSON('/docs/docs', function(data){

    $.each(data, function(i, d){
      var keys = Object.keys(d);
      listData += '<li><strong>';
      listData += d['index'];
      listData += '</strong>: ';

      listData += d['similarity'];
      listData += '</li>';

      $('#doclist ul').html(listData);
      });
    });
};

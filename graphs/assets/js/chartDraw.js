function getData(){  
  var setHeader = function (req) {
    req.setRequestHeader('content-type', 'application/json'); 
    req.setRequestHeader('accept', 'application/json'); 
  }; 
  $.ajax({
    type: "GET",
    url: "lifetime",
    beforeSend: setHeader,
    success: function(res){
      console.log(res);
      drawChart(res);
      getData2();
    }
  });
};
function getData2(){  
  var setHeader = function (req) {
    req.setRequestHeader('content-type', 'application/json'); 
    req.setRequestHeader('accept', 'application/json'); 
  }; 
  $.ajax({
    type: "GET",
    url: "months",
    beforeSend: setHeader,
    success: function(res){
      drawChart2(res);
    }
  });
};
google.load("visualization", "1", {packages:["corechart"]});
//google.setOnLoadCallback(drawChart);

function drawChart(dataJson) {
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'Lectura');
  data.addColumn('number', 'Cantidad');


  _.each(dataJson[0].production, function(obj, key){
    data.addRow([key, obj]);
  });

  var options = {
    title: 'Watts Hora Generados por Medición',
    hAxis: {title: 'Lectura',  titleTextStyle: {color: '#333'}},
    vAxis: {minValue: 0}
  };

  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function drawChart2(dataJson) {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Fecha');
  data.addColumn('number', 'Cantidad');
  dataJson.forEach(function(obj){
    data.addRow([new Date(obj.start_date),obj.production_wh]);
  });

  var options = {
    title: 'Watts Hora Generados Mensualmente',
    hAxis: {title: 'Fecha',  titleTextStyle: {color: '#333'}},
    vAxis: {minValue: 0}
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
  chart.draw(data, options);
}
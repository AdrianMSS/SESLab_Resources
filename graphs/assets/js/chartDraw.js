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
  data.addColumn('date', 'Día');
  data.addColumn('number', 'Cantidad');


  dataJson.daily.forEach(function(obj){
    _.each(obj, function(quantity, key){
      var dateW1 = key.split('/'),
        dateW2 = new Date(dateW1[2]+'-'+dateW1[1]+'-'+dateW1[0]);
      data.addRow([dateW2, quantity]);
    });
  });

  var options = {
    title: 'Watts Hora Generados por Día',
    hAxis: {title: 'Día',  titleTextStyle: {color: '#333'}},
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
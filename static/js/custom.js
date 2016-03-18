//console.log('test');

function sortJson(element, prop, propType, asc) {
  switch (propType) {
    case "int":
      element = element.sort(function (a, b) {
        if (asc) {
          return (parseInt(a[prop]) > parseInt(b[prop])) ? 1 : ((parseInt(a[prop]) < parseInt(b[prop])) ? -1 : 0);
        } else {
          return (parseInt(b[prop]) > parseInt(a[prop])) ? 1 : ((parseInt(b[prop]) < parseInt(a[prop])) ? -1 : 0);
        }
      });
      break;
    default:
      element = element.sort(function (a, b) {
        if (asc) {
          return (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : ((a[prop].toLowerCase() < b[prop].toLowerCase()) ? -1 : 0);
        } else {
          return (b[prop].toLowerCase() > a[prop].toLowerCase()) ? 1 : ((b[prop].toLowerCase() < a[prop].toLowerCase()) ? -1 : 0);
        }
      });
  }
}

function getData(api_url) {
    var deferredData = new jQuery.Deferred();

    $.ajax({
        type: "GET",
        url: api_url,
        dataType: "json",
        success: function(data) { 
            deferredData.resolve(data);
            },
        complete: function(xhr, textStatus) {
            console.log("AJAX Request complete -> ", xhr, " -> ", textStatus);
            }
    });

    return deferredData; // contains the passed data
};


//var dataDeferred = getData("/api/get");
var orgData
$.when(  getData("/api/get")  ).done( function(data){
    orgData = data
    draw(data)}
);
var draw = function( data ) {
    //console.log("The data is: " + JSON.stringify(data));    
    //for(var key in data.rows[0]){
    //    console.log(key)
    //}
    var dataSet = data.rows
    sortJson( dataSet, "date", "string", false);   
    console.log(data.time)
    $("#updated").val("Update: " + data.time)
    $( "#tableBody" ).empty();
    for(var i = 0; i < dataSet.length; i++){
        var row = $("<tr />");
        $("#tableBody").append(row);
        row.append($("<td>" + dataSet[i].author + "</td>"));
        row.append($("<td>" + dataSet[i].catalog + "</td>"));
        row.append($("<td>" + dataSet[i].date + "</td>"));
        row.append($("<td><a href=\"http://www.hkepc.com/forum/" + dataSet[i].url + "\">" + dataSet[i].item + "</a></td>"));        
        row.append($("<td>" + dataSet[i].last + "</td>"));
    }
}
$(document).ready(function(){
    $("#updateBTN").click(function(){
        console.log("update")
        $.when(getData("/crawl")).done(function(data){
            orgData = data
            draw(data)}
        );
    });
    $("#keyword").on('input', function(){
        if($(this).val() != ""){
	    filter = {'rows':[], 'time': orgData.time}
            var kwAry = $(this).val().replace(/(,| )+$/, '').split(/[ ,]+/)
            //console.log(kwAry);
            for(var i = 0; i < orgData.rows.length; i++){
                for(var j = 0; j < kwAry.length; j++){
                    var tmp = kwAry[j].toLowerCase()
                    if(orgData.rows[i].item.toLowerCase().indexOf(tmp) > 0){
		        filter.rows.push(orgData.rows[i])
		    }
                }
            }
            //console.log(filter)
            draw(filter)
        }else {
            console.log('redraw')
            draw(orgData)
        }
    });
});

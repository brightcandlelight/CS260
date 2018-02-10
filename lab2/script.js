$(document).ready(function() {
	$("#weatherSubmit").click(function(e) {
		e.preventDefault();
		var city = $("#city").val();
		var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+",US&units=imperial&APPID=e2d7b953f3fa30206d4431e4c0cdcfc7";
		console.log(url);
		$.ajax({
			url : url,
			dataType : "json",
			success : function(json) {
				console.log(json);
				var results = "";
				results += '<hr><h2 class="center">Weather in ' + json.name + "</h2>";
				for (var i=0; i<json.weather.length; i++) {
					results += '<img class="center" src="http://openweathermap.org/img/w/' + json.weather[i].icon + '.png"/>';
				}
				results += '<p class="center">';
				for (var i=0; i<json.weather.length; i++) {
					results += json.weather[i].description
					if (i !== json.weather.length - 1)
					results += ", "
				}
				results += '<h2 class="center">' + json.main.temp + " &deg;F</h2>"
				results += '<br><a class="center">' + json.main.humidity + "% humidity</a>"
				results += '<br><a class="center">' + json.main.temp_min + " &deg;F min</a>"
				results += '<br><a class="center">' + json.main.temp_max + " &deg;F max</a>"
				results += "</p>";
				var url = "http://api.openweathermap.org/data/2.5/forecast?q="+city+",US&units=imperial&APPID=e2d7b953f3fa30206d4431e4c0cdcfc7";
				
				$("#weatherResults").html(results);
			},
			error : function(request, status, error) {
				$("#weatherResults").html("<hr><p class=\"center\">No matching city</p>");
			}
		});
    });
	
	$("#stackSearch").click(function(e) {
		e.preventDefault();
		var search_text = $("#stackQuery").val();
		var url = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow&intitle="+search_text;
		console.log(url);
		$.ajax({
			url : url,
			dataType : "json",
			success : function(json) {
				var results = JSON.stringify(json);
				console.log("JSON: "+results);
				
				var results = "";
				results += '<hr><h2 class="center">' + json.items.length + " Search Results</h2>";
				
				if (json.items.length > 0) {
					results += "<table class=\"table1\"><tr><td>Author</td><td>Subject</td></tr>";
					for (var i=0; i<json.items.length; i++) {
						results += '<tr><th id="table2"><img class="small" src="' + json.items[i].owner.profile_image + '"/>';
						
						results += '<br><a class="" href="' +json.items[i].owner.link+'">'+ json.items[i].owner.display_name + '</a></th>';
						
						results += '<th><a href="' +json.items[i].link+'">'+ json.items[i].title + '</a></th>';
						
						results += '</tr>';
					}
					results += "</table>";
					}
				
				console.log("JSON: "+results);
				
				$("#stackResults").html(results);
			},
			error : function(request, status, error) {
				$("#stackResults").html("<hr><h2 class=\"center\">0 Search Results</h2>");
			}
		});
    });
});



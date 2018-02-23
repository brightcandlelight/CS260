function run() {
    var search_text = $("#recipeText").val();
    if (search_text !== "") {
        var url = "https://www.themealdb.com/api/json/v1/1/search.php?s="+search_text;
        //console.log(url);
        $.ajax({
            url : url,
            dataType : "json",
            success : function(json) {
                var json1 = JSON.stringify(json);
                var length = json.meals ? json.meals.length : 0;
                //console.log("JSON: "+json1);
                
                var results = "";
                results += '<hr><h2 class="center">' + length + " Search Results</h2><br>";
                
                if (length > 0) {
                    results += "<table class=\"table1\"><tr><td>Picture</td><td>Title</td><td>Recipe URL</td><td>Youtube Link</td></tr>";
                    for (var i=0; i<json.meals.length; i++) {
                        results += '<tr><th id="table2"><img class="small" src="https://process.filestackapi.com/AhTgLagciQByzXpFGRI0Az/resize=width:200/http://' + json.meals[i].strMealThumb + '"/>';
                        
                        results += '<th>'+ json.meals[i].strMeal + '</th>';
                        
                        if (json.meals[i].strSource !== "" && json.meals[i].strSource !== "none") {
                            results += '<th><a href="' +json.meals[i].strSource+'">'+'url'+'</a></th>';
                        } else {
                            results += '<th></th>'
                        }
                        
                        if (json.meals[i].strYoutube !== "" && json.meals[i].strYoutube !== "none") {
                            results += '<th><a href="' +json.meals[i].strYoutube+'">'+'youtube'+'</a></th>';
                        } else {
                            results += '<th></th>'
                        }
                        
                        results += '</tr>';
                    }
                    results += "</table>";
                    }
                
                //console.log("JSON: "+results);
                
                $("#recipeResults").html(results);
            },
            error : function(request, status, error) {
                $("#recipeResults").html("<hr><h2 class=\"center\">0 Search Results</h2>");
            }
        });
    }
}

$(document).ready(function() {
	$("#recipeSubmit").click(function(e) {
		e.preventDefault();
		run();
    });
    run();
});



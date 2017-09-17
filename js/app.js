//To get ids of all Articles
function getIds() {
    $.ajax({
      url: "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty",
      // Handle as Text
      dataType: "text",
      success: function(data) {
            var json = $.parseJSON(data);
            getDetails(json);
        }
    });
}

//Get Details of all Articles
function getDetails(index) {
        var i = 0;
        for(i = 0; i < index.length ; i++) {
            $.ajax({
              url: "https://hacker-news.firebaseio.com/v0/item/" + index[i] + ".json?print=pretty",
              // Handle as Text
              dataType: "text",
              success: function(data) {
                    // Parse JSON file
                    var json = $.parseJSON(data);
                    newsTime = json.time;
                    date = new Date(newsTime * 1000);
                    newsTime = date;
                    var curr_date = newsTime.getDate();
                    var curr_month = newsTime.getMonth() + 1; //Months are zero based
                    var curr_year = newsTime.getFullYear();
                    var newsDate = curr_date + "-" + curr_month + "-" + curr_year;
                    
                    $( "#filters" ).change(function() {
                        if($( "#filters option:selected" ).text() == "All") {
                            $("#last_one_month").html("");
                            $("#last_week").html("");
                            $("#all_news").append("<li><div class='title'><a href='" + json.url + "' target='_blank'>"+json.title+"</a></div><span class='points'>"+json.score+" points by "+ json.by+ " " + newsDate + "</span><div class='clearfix'></div><div class='add-to-fav' onclick='addToFav(\"" +json.url + "\",\"" +json.url + "\");'>Add to favourites</div></li>");
                        } else if ($( "#filters option:selected" ).text() == "Top Articles (Last Week)") {
                            var Todaysdate = new Date();
                            var backDate = Todaysdate.setDate(Todaysdate.getDate() - 7);
                            var dateString = backDate / 1000;
                            $("#all_news").html("");
                            $("#last_one_month").html("");
                            if((json.time > dateString) && (json.score >= 250)) {
                                $("#last_week").append("<li><div class='title'><a href='" + json.url + "' target='_blank'>"+json.title+"</a></div><span class='points'>"+json.score+" points by "+ json.by+ " " + newsDate + "</span><div class='clearfix'></div><div class='add-to-fav' onclick='addToFav(\"" +json.url + "\",\"" +json.url + "\");'>Add to favourites</div></li>");
                            }
                        }
                        else if($( "#filters option:selected" ).text() == "Top Articles (Last Month)") {
                            var Todaysdate = new Date();
                            var backDate = Todaysdate.setDate(Todaysdate.getDate() - 30);
                            var dateString = backDate / 1000;
                            $("#all_news").html("");
                            $("#last_week").html("");
                            if((json.time > dateString) && (json.score >= 250)) {
                                $("#last_one_month").append("<li><div class='title'><a href='" + json.url + "' target='_blank'>"+json.title+"</a></div><span class='points'>"+json.score+" points by "+ json.by+ " " + newsDate + "</span><div class='clearfix'></div><div class='add-to-fav' onclick='addToFav(\"" +json.url + "\",\"" +json.url + "\");'>Add to favourites</div></li>");
                            }
                        }
                    });
                    $("#all_news").append("<li><div class='title'><a href='" + json.url + "' target='_blank'>"+json.title+"</a></div><span class='points'>"+json.score+" points by "+ json.by+ " " + newsDate + "</span><div class='clearfix'></div><div class='add-to-fav' onclick='addToFav(\"" +json.url + "\",\"" +json.url + "\");'>Add to favourites</div></li>");
                }
            });
            i++;
        }
 }
 getIds();
 
// To Bookmark your favourite link
 function addToFav(url, title) {
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    if(!isChrome) {
        if (window.sidebar) { // Mozilla Firefox Bookmark
         window.sidebar.addPanel(url, url);
        } else if(window.external) { // IE Favorite
          window.external.AddFavorite(url,title);}
        else if(window.opera && window.print) { // Opera Hotlist
          this.title=title;
          return true;
        }
    } else {
        window.location.href = url;
        alert ('Please press Ctrl+D to bookmark this link.');
    }
 }
 
 
 
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
                        $('.all-news-container').show();
                        $('.favourites-container').hide();
                        if($( "#filters option:selected" ).text() == "All") {
                            $("#last_one_month").html("");
                            $("#last_week").html("");
                            $("#all_news").append("<li><div class='title'><a href='" + json.url + "' target='_blank'>"+json.title+"</a></div><span class='points'>"+json.score+" points by "+ json.by+ " " + newsDate + "</span><div class='clearfix'></div><div class='add-to-fav fav-"+json.id+"' onclick='storeLocal(\"" +json.url + "\",\"" +json.title + "\",\"fav-" +json.id + "\");'>Add to favourites</div></li>");
                        } else if ($( "#filters option:selected" ).text() == "Top Articles (Last Week)") {
                            var Todaysdate = new Date();
                            var backDate = Todaysdate.setDate(Todaysdate.getDate() - 7);
                            var dateString = backDate / 1000;
                            $("#all_news").html("");
                            $("#last_one_month").html("");
                            if((json.time > dateString) && (json.score >= 250)) {
                                $("#last_week").append("<li><div class='title'><a href='" + json.url + "' target='_blank'>"+json.title+"</a></div><span class='points'>"+json.score+" points by "+ json.by+ " " + newsDate + "</span><div class='clearfix'></div><div class='add-to-fav fav-"+json.id+"' onclick='storeLocal(\"" +json.url + "\",\"" +json.title + "\",\"fav-" +json.id + "\");'>Add to favourites</div></li>");
                            }
                        }
                        else if($( "#filters option:selected" ).text() == "Top Articles (Last Month)") {
                            var Todaysdate = new Date();
                            var backDate = Todaysdate.setDate(Todaysdate.getDate() - 30);
                            var dateString = backDate / 1000;
                            $("#all_news").html("");
                            $("#last_week").html("");
                            if((json.time > dateString) && (json.score >= 250)) {
                                $("#last_one_month").append("<li><div class='title'><a href='" + json.url + "' target='_blank'>"+json.title+"</a></div><span class='points'>"+json.score+" points by "+ json.by+ " " + newsDate + "</span><div class='clearfix'></div><div class='add-to-fav fav-"+json.id+"' onclick='storeLocal(\"" +json.url + "\",\"" +json.title + "\",\"fav-" +json.id + "\");'>Add to favourites</div></li>");
                            }
                        }
                    });
                    $("#all_news").append("<li><div class='title'><a href='" + json.url + "' target='_blank'>"+json.title+"</a></div><span class='points'>"+json.score+" points by "+ json.by+ " " + newsDate + "</span><div class='clearfix'></div><div class='add-to-fav fav-"+json.id+"' onclick='storeLocal(\"" +json.url + "\",\"" +json.title + "\",\"fav-" +json.id + "\");'>Add to favourites</div></li>");
                    assignButtonText(json.title, "fav-" +json.id);
                }
            });
            i++;
        }
 }
 getIds();
 

 
var articlesTitle = [];
var articlesUrl = [];
var titles;
var urls;
var retrievedTitles;
var retrievedUrls;
function storeLocal(url, title, favButton) {
    $('.' + favButton).toggleClass("active");
//    $('.' + favButton).html($('.' + favButton).text() == 'Add to favourites' ? 'Remove from favourites' : 'Add to favourites');
    if (typeof(Storage) !== "undefined") {
        var existingTitlestr = localStorage.getItem("titles");
        var existingUrlstr = localStorage.getItem("urls");
        if(existingTitlestr == null && existingUrlstr == null) {
            articlesTitle.push(title);
            articlesUrl.push(url);
            localStorage.setItem("titles", JSON.stringify(articlesTitle));
            localStorage.setItem("urls", JSON.stringify(articlesUrl));
        } else {
            var existingTitle = JSON.parse(existingTitlestr);
            var existingUrl = JSON.parse(existingUrlstr);
            if(jQuery.inArray(title, existingTitle) == -1) {
                 existingTitle.push(title);
                 $('.' + favButton).html("Remove from favourites");
            }else{
                var indexTitle = jQuery.inArray(title, existingTitle);
                existingTitle.splice(indexTitle,1);  
                $('.' + favButton).html("Add to favourites");
            }
            
            if(jQuery.inArray(url, existingUrl) == -1) {
                 existingUrl.push(url);
            }else{
                var indexUrl = jQuery.inArray(url, existingUrl);
                existingUrl.splice(indexUrl,1);
            }
            
            localStorage.setItem("titles", JSON.stringify(existingTitle));
            localStorage.setItem("urls", JSON.stringify(existingUrl));
        }
        
    } else {
        $("#fav_links").html("Sorry, your browser does not support Web Storage...");
    }
    
}

$(document).ready(function() {
    $('.show-fav-button').click(function() {
        $("#fav_links").html("");
        retrievedTitles = localStorage.getItem("titles");
        var storedTitles = JSON.parse(retrievedTitles);
        var retrievedUrls = localStorage.getItem("urls");
        var storedUrls = JSON.parse(retrievedUrls);
        $('.all-news-container').hide();
        $('.favourites-container').show();
        for(var i = 0; i<storedTitles.length; i++) {
            $("#fav_links").append("<li class='article"+i+"'><a href='"+storedUrls[i]+"'>"+storedTitles[i]+"</a><div class='remove-from-fav' onclick='removeFromLocal(\"" +storedUrls[i] + "\",\"" +storedTitles[i] + "\",\"article"+i+"\");'>Remove from favourites</div></li>");
        }
    });
    
    $(".filters-dropdown").click(function() {
        $('.favourites-container').hide();
        $('.all-news-container').show();
    });
});

function removeFromLocal(url, title, article) {
    retrievedTitles = localStorage.getItem("titles");
    var storedTitles = JSON.parse(retrievedTitles);
    var retrievedUrls = localStorage.getItem("urls");
    var storedUrls = JSON.parse(retrievedUrls);
    
    var indexUrl = jQuery.inArray(url, storedUrls);
    storedUrls.splice(indexUrl,1);
    
    var indexTitle = jQuery.inArray(title, storedTitles);
    storedTitles.splice(indexTitle,1);
    
    localStorage.setItem("titles", JSON.stringify(storedTitles));
    localStorage.setItem("urls", JSON.stringify(storedUrls));
    $("." + article).hide();
}

function assignButtonText(title, favButton) {
    retrievedTitles = localStorage.getItem("titles");
    var storedTitles = JSON.parse(retrievedTitles);
    if(jQuery.inArray(title, storedTitles) == -1) {
         $('.' + favButton).html("Add to favourites");
         $('.' + favButton).removeClass("active");
    }else{
        $('.' + favButton).html("Remove from favourites");
        $('.' + favButton).addClass("active");
    }
}
 
 
 
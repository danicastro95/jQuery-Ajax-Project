// Variables

// Cursor de la última petición
var cursor;
// Semáforo de peticiones
var petition = false;
var firstCall = false;

const CLIENTID = "3z03kwc9gdw1sqc055wpgkw05b6488";

// Objetos
// Clase Stream
class Stream {
    constructor(id, userId, userName, gameId, title, viewers, startDate, language, thumbnail) {
        this._id = id;
        this._userId = userId;
        this._userName = userName;
        this._gameId = gameId;
        this._title = title;
        this._viewers = viewers;
        this._startDate = startDate;
        this._language = language;
        this._thumbnail = thumbnail;
    }
    get id() { return this._id; }
    get userId() { return this._userId; }
    get userName() { return this._userName; }
    get gameId() { return this._gameId; }
    get title() { return this._title; }
    get viewers() { return this._viewers; }
    get startDate() { return this._startDate; }
    get language() { return this._language; }
    get thumbnail() { return this._thumbnail; }
}

// Clase Game
class Game {
    constructor(id, name, imgurl) {
        this._id = id;
        this._name = name;
        this._imgurl = imgurl;
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get imgurl() { return this._imgurl; }
}

// Creación de cada vista de juego
function gameView(game) {
    let img = game.imgurl.replace("{width}x{height}", "500x500");
    let view = "<div class='game'>" +
        "<img class='gameImg' src='" + img + "'>" +
        "<h3 id='" + game.id + "'>" + game.name + "</h3>" +
        "</div> ";
    return view;
}

function gamesPetition() {
    if (!firstCall && !petition) {
        petition = true;
        let topGamesCall = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.twitch.tv/helix/games/top?first=12",
            "method": "GET",
            "headers": { "Client-ID": CLIENTID }
        };
        $.ajax(topGamesCall).done(function (response) {
            cursor = response['pagination']['cursor'];
            response['data'].forEach(game => {
                let g = new Game(game.id, game.name, game.box_art_url);
                $('#content').append(gameView(g));
                setGameClick();
            });
        });
        petition = false;
        firstCall = true;
    } else if (firstCall && !petition) {
        petition = true;
        let topGamesCall = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.twitch.tv/helix/games/top?first=4&after=" + cursor,
            "method": "GET",
            "headers": { "Client-ID": CLIENTID }
        };
        $.ajax(topGamesCall).done(function (response) {
            cursor = response['pagination']['cursor'];
            response['data'].forEach(game => {
                let g = new Game(game.id, game.name, game.box_art_url);
                $('#content').append(gameView(g));
                setGameClick();
            });
        });
        petition = false;
    }
}

// Asignación de evento onClick a cada elemento de la clase game
function setGameClick() {
    $(".game").unbind("click").click(function () {
        let gameId = $(this).children("h3").attr("id");
        let view = "<div id='detail'><div class='streamsHeader'>" + $(this).children("h3").text() + "</div><div id='streams'></div></div>";
        $("body").append(view);
        $("#detail").unbind("click").click(function (e) {
            $(this).remove();
        });
        streamsPetition(gameId);
    });
}

function streamsPetition(id) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.twitch.tv/helix/streams?first=15&game_id=" + id,
        "method": "GET",
        "headers": { "Client-ID": CLIENTID }
    }

    $.ajax(settings).done(function (response) {
        response['data'].forEach(stream => {
            let s = new Stream(stream.id, stream.user_id, stream.user_name, stream.game_id, stream.title, stream.viewer_count, stream.started_at, stream.language, stream.thumbnail_url);
            $('#streams').append(streamView(s));
            setStreamClick();
        });
    });
}

function streamView(stream) {
    let img = stream.thumbnail.replace("{width}x{height}", "640x360");
    let view = "<div class='stream' id='" + stream.userName + "'>" +
        "<img class='streamThumbnail' src='" + img + "'>" +
        "<div class='streamName'>" + stream.title + "</div>" +
        "<div class='userName'>" + stream.userName + "<span class='viewers'>" + shorten(stream.viewers) + "</span></div>" +
        "</div>";
    return view;
}

function setStreamClick() {
    $(".stream").unbind("click").click(function (e) {
        let streamId = $(this).attr("id");
        openStream(streamId);
        e.stopPropagation();
    });
}

function openStream(url) {
    var win = window.open('http://twitch.tv/' + url, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Por favor, permite las ventanas emergentes de en este sitio');
    }

}

$(window).on('scroll', function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        gamesPetition();
    }
}).scroll();

function shorten(n) {
    if (n >= 1100) {
        n = n.toString().substring(0, n.toString().length - 2);
        return n + "k espectadores";
    } else { return n + " espectadores"; }
}

$("#searchBar").keyup(function () {
    $("#searchResults").remove();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.twitch.tv/kraken/search/games?query=" + $(this).val(),
        "method": "GET",
        "headers": {
            "Client-ID": "3z03kwc9gdw1sqc055wpgkw05b6488",
            "Accept": "application/vnd.twitchtv.v5+json"
        }
    };

    $.ajax(settings).done(function (response) {
        $("#searchContainer").append("<ul id='searchResults'></ul>");
        for (let i = 0; i < 6; i++) {
            let view = "<li class='searchResult' id='" + response['games'][i]._id + "'>" + response['games'][i].name + "</li>";
            $("#searchResults").append(view);
            setSearchClick();
        }
    });
});

function setSearchClick() {
    $(".searchResult").unbind("click").click(function () {
        let view = "<div id='detail'><div class='streamsHeader'>" + $(this).text() + "</div><div id='streams'></div></div>";
        $("body").append(view);
        $("#detail").unbind("click").click(function () {
            $(this).remove();
        });
        streamsPetition($(this).attr("id"));
    })
}

$("#searchBar").focusout(function () {
    setTimeout(function () { $("#searchResults").remove(); }, 100);
});
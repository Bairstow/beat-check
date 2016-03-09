var $ = require('jquery');
var _ = require('underscore');
var request = require('request');

var checker = function(search, appResponse) {
  // format search term
  var searchFormatted = search.replace(/[^A-Za-z0-9\s]/g, '').trim().toLowerCase();
  var querySearchString = searchFormatted.split(' ').join("+");
  console.log('Checker function looking for: ', searchFormatted);

  // send response back to app when all web requests have returned
  var requestSources = [];
  var requestData = [];
  var sendRequestData = function() {
    // var responseData = {
    //   spotifyPopularity: requestData.spotifyResult.popularity
    // };
    console.log('sendRequestData function called passing back:', requestData);
    appResponse.send(requestData);
  };

  // query spotify api
  var spotifyResult = {
    name: searchFormatted,
    matched: false,
    returned: false,
    popularity: 0,
    imageURL: ''
  };
  // build query url
  var spotifyBaseUrl = 'https://api.spotify.com/v1/search?type=artist&limit=5&q=';
  var spotifyReqOptions = {
    url: spotifyBaseUrl + querySearchString,
    method: 'GET',
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 4
  };
  var spotifyCallback = function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('spotify request callback executed without error.');
      var parsedBody = JSON.parse(body);
      _.each(parsedBody.artists.items, function(artist) {
        // format returned artist name
        nameFormatted = artist.name.trim().toLowerCase();
        if (searchFormatted === nameFormatted) {
          console.log('spotify match found.');
          spotifyResult.matched = true;
          spotifyResult.popularity = artist.popularity;
          if (artist.images.length > 0) {
            spotifyResult.imageURL = artist.images[0].url;
          }
        }
      });
    }
    spotifyResult.returned = true;
    requestData.push({ spotifyResult: spotifyResult });
    if (requestData.length == requestSources.length) {
      sendRequestData();
    }
  };
  requestSources.push([spotifyReqOptions, spotifyCallback]);

  // query the musicbrainz db (chain call mb search, mb lookup, lastfm lookup)
  var musicBrainzResult = {
    name: searchFormatted,
    matched: false,
    returned: false,
    mbid: '',
    score: 0,
    votesCount: 0,
    value: 0,
    tags: []
  };
  // lookup the musicbrainz db with the searched mbid (chain call mb search, mb lookup, lastfm lookup)
  var musicBrainzLookupBaseUrl = 'http://musicbrainz.org/ws/2/artist/';
  var musicBrainzLookupReqOptions = {
    // url has to be set dynamically after the search query.
    url: '',
    method: 'GET',
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 4
  };
  var musicBrainzLookupCallback = function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('musicBrainz lookup request callback executed.');
      var parsedBody = JSON.parse(body);
      if (parsedBody.rating["votes-count"]) { musicBrainzResult.votesCount = parsedBody.rating["votes-count"]; }
      if (parsedBody.rating.value) { musicBrainzResult.value = parsedBody.rating.value; }
      if (parsedBody.tags.length > 0) {
        _.each(parsedBody.tags, function(tag) {
          musicBrainzResult.tags.push(tag.name);
        });
      }
    } else {
      console.log('musicBrainz lookup request did not execute');
    }
    // // if a match was found continue call chain else return data
    // if (musicBrainzResult.matched) {
    //   request(musicBrainzLookupReqOptions, musicBrainzLookupCallback);
    // } else {
    //   musicBrainzResult.returned = true;
    //   requestData.musicBrainzResult = musicBrainzResult;
    //   if (requestData.length == requestSources.length) {
    //     sendRequestData();
    //   }
    // }
    musicBrainzResult.returned = true;
    requestData.push({ musicBrainzResult: musicBrainzResult });
    if (requestData.length == requestSources.length) {
      sendRequestData();
    }
  };
  // build query url
  var musicBrainzQueryString = searchFormatted.split(' ').join("%20");
  var musicBrainzQueryBaseUrl = 'http://musicbrainz.org/ws/2/artist?query=artist:';
  var musicBrainzQueryReqOptions = {
    url: musicBrainzQueryBaseUrl + musicBrainzQueryString + '&limit=5&fmt=json',
    method: 'GET',
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 4
  };
  var musicBrainzQueryCallback = function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('musicBrainz search request callback executed without error.');
      var parsedBody = JSON.parse(body);
      if (parsedBody.artists.length > 0) {
        _.each(parsedBody.artists, function(artist) {
          nameFormatted = artist.name.trim().toLowerCase();
          if (searchFormatted === nameFormatted) {
            console.log('musicBrainz db match found.');
            musicBrainzResult.matched = true;
            musicBrainzResult.mbid = artist.id;
            musicBrainzResult.score = Number(artist.score);
          }
        });
      }
    }
    // if a match was found continue call chain else return data
    if (musicBrainzResult.matched) {
      console.log('musicBrainz lookup request pending...');
      musicBrainzLookupReqOptions.url = musicBrainzLookupBaseUrl + musicBrainzResult.mbid + '?inc=aliases+tags+ratings&fmt=json';
      request(musicBrainzLookupReqOptions, musicBrainzLookupCallback);
    } else {
      musicBrainzResult.returned = true;
      requestData.push({ musicBrainzResult: musicBrainzResult });
      if (requestData.length == requestSources.length) {
        sendRequestData();
      }
    }
  };
  requestSources.push([musicBrainzQueryReqOptions, musicBrainzQueryCallback]);

  // query last.fm (sign up currently down) [will chain call this from musicbrainz lookup as they use the mbid]
  var lastFMResult = {
    name: searchFormatted,
    matched: false,
    returned: false,
    listeners: 0,
    plays: 0,
    similarArtists: [],
    tags: []
  };
  // build query url (need to include API key )
  var lastFMAPIKey = '';
  var lastFMmbid = '';
  var lastFMBaseUrl = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=';
  var lastFMReqOptions = {
    url: lastFMBaseUrl + lastFMmbid + '&api_key=' + lastFMAPIKey + '&format=json',
    method: 'GET',
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 4
  };
  var lastFMCallback = function(error, response, body) {
    console.log('lastFM request callback returned.');
    var parsedBody = JSON.parse(body);
    // setting matched to be true based on previously finding artist in the musicbrainz db
    lastFMResult.matched = true;
    if (parsedBody.artist.stats.listeners) { lastFMResult.listeners = parsedBody.artist.stats.listeners; }
    if (parsedBody.artist.stats.plays) { lastFMResult.plays = parsedBody.artist.stats.plays; }
    if (parsedBody.artist.similar) {
      _.each(parsedBody.artist.similar, function(artist) {
        lastFMResult.similarArtists.push(artist.name);
      });
    }
    if (parsedBody.artist.tags) {
      _.each(parsedBody.artist.tags, function(tag) {
        lastFMResult.tags.push(tag.name);
      });
    }
    lastFMResult.returned = true;
    requestData.lastFMResult = lastFMResult;
    if (requestData.length == requestSources.length) {
      sendRequestData();
    }
  };

  // make request calls to each of the defined resources
  // all callback functions should have a definition to cater for server response if it is
  // the last resource to return (sendRequestData).
  _.each(requestSources, function(source) {
    request(source[0], source[1]);
  });
};

module.exports = checker;

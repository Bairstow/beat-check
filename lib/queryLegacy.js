// query last.fm (sign up currently down) [will chain call this from musicbrainz lookup as they use the mbid]
// var lastFMResult = {
//   name: searchFormatted,
//   matched: false,
//   returned: false,
//   listeners: 0,
//   plays: 0,
//   similarArtists: [],
//   tags: []
// };
// // build query url (need to include API key )
// var lastFMAPIKey = '';
// var lastFMmbid = '';
// var lastFMBaseUrl = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=';
// var lastFMReqOptions = {
//   url: lastFMBaseUrl + lastFMmbid + '&api_key=' + lastFMAPIKey + '&format=json',
//   method: 'GET',
//   timeout: 10000,
//   followRedirect: true,
//   maxRedirects: 4
// };
// var lastFMCallback = function(error, response, body) {
//   console.log('lastFM request callback returned.');
//   var parsedBody = JSON.parse(body);
//   // setting matched to be true based on previously finding artist in the musicbrainz db
//   lastFMResult.matched = true;
//   if (parsedBody.artist.stats.listeners) { lastFMResult.listeners = parsedBody.artist.stats.listeners; }
//   if (parsedBody.artist.stats.plays) { lastFMResult.plays = parsedBody.artist.stats.plays; }
//   if (parsedBody.artist.similar) {
//     _.each(parsedBody.artist.similar, function(artist) {
//       lastFMResult.similarArtists.push(artist.name);
//     });
//   }
//   if (parsedBody.artist.tags) {
//     _.each(parsedBody.artist.tags, function(tag) {
//       lastFMResult.tags.push(tag.name);
//     });
//   }
//   lastFMResult.returned = true;
//   requestData.lastFMResult = lastFMResult;
//   if (requestData.length == requestSources.length) {
//     sendRequestData();
//   }
// };


// mixradio client_id - 1cd69c8b48b7fc9e7445aba901599874
// query mixradio metadata api

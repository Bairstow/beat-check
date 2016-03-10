// template data structure
// [{
//   musicBrainzResult: {
//     name: 'wale',
//     matched: true,
//     returned: true,
//     mbid: 'e34e41f2-f480-45d3-8190-a3ce5ab34fab',
//     score: 100,
//     votesCount: 0,
//     value: 0,
//     tags: [Object]
//   }
// },
// {
//   spotifyResult: {
//     name: 'wale',
//     matched: true,
//     returned: true,
//     popularity: 77,
//     imageURL: 'https://i.scdn.co/image/0f403e0b5b2f8931b75690fe743359accf0912a8'
//   }
// },
// {
//   twitterResult: {
//     returned: true,
//     latest: '@wale wanna help an angry black woman from moco out? https://t.co/VilJDDtCJd',
//     latestDate: 'Thu Mar 10 06:16:30 +0000 2016',
//     count: 15
//   }
// }]
var _ = require('underscore');

var scorer = function(data) {
  // create score out of 100 for each component and then combine and return
  var score = 0;
  var mbScore = 0;
  var spotifyScore = 0;
  var twitterScore = 0;
  var finalScore = 0;
  var imageURL = '';
  var latestTweet = '';
  _.each(data, function(apiResult) {
    var service = Object.keys(apiResult)[0];
    // need to check on service keys as results are pushed into data array via async callbacks
    // so order may not be static
    console.log('Scoring for data from: ', service);
    if (service === 'musicBrainzResult') {
      // calc music brainz score
      if (apiResult[service].matched) { mbScore += 20; }
      if (apiResult[service].score >= 90) { mbScore += 20; }
      if (apiResult[service].votesCount > 0) {
        // assuming that the value can range between 0-5
        mbScore += Math.floor(60 * apiResult[service].value / 5);
      }
      console.log('music brainz score received: ' + mbScore + '/100');
    } else if (service === 'spotifyResult') {
      // calc spotify score
      if (apiResult[service].matched) { spotifyScore += 20; }
      spotifyScore += Math.floor(apiResult[service].popularity * 0.8);
      console.log('spotify score received: ' + spotifyScore + '/100');
      if (apiResult[service].imageURL) {
        imageURL = apiResult[service].imageURL;
      }
    } else if (service === 'twitterResult') {
      // calc twitter score
      // based on how recently a tweet mentioning was recorded (< 1 day is 0 points)
      if (apiResult[service].latest !== '') {
        var tweetDate = new Date(apiResult[service].latestDate);
        console.log('Date object returned from latest tweet string');
        var d = new Date();
        if ((d.getTime() - tweetDate.getTime()) < 7200000) {
          twitterScore = Math.floor((1 - (d.getTime() - tweetDate.getTime()) / 7200000) * 100);
        }
        latestTweet = apiResult[service].latest;
      }
      if (apiResult[service].count < 15) {
        twitterScore = Math.floor(twitterScore * apiResult[service].count / 15);
      }
      console.log('twitter score received: ' + twitterScore + '/100');
    }
  });
  finalScore = Math.floor((mbScore + spotifyScore + twitterScore) / 3);
  console.log('final score received: ' + finalScore + '/100');
  // result is used as server response object
  result = {
    mbScore: mbScore,
    spotifyScore: spotifyScore,
    twitterScore: twitterScore,
    score: finalScore,
    image: imageURL,
    tweet: latestTweet
  }
  return result;
};

module.exports = scorer;

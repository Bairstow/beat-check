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

var scorer = function(data) {
  // create score out of 100 for each component and then combine and return
  var score = 0;
  var mbScore = 0;
  var spotifyScore = 0;
  var twitterScore = 0;
  // result is used as server response object
  return result;
};

module.exports = scorer;




const rp = require('request-promise');
const fs = require('fs');
let subreddit = "vertcoin";


async function collectRedditAPIData(subreddit) {
    const requestOptions = {
        method: 'GET',
        uri: `https://www.reddit.com/r/${subreddit}/about.json`,
        json: true,
        gzip: true
      };
      
      rp(requestOptions).then(response => {
          if (response.error == 404) {
              return response.message
          }
          else {
            let reddit_data = saveRelevantSubredditData(response);
            console.log(reddit_data)
            return reddit_data;
          }
          
      }).catch((err) => {
        console.log('API call error:', err.message);
      });
}


function saveRelevantSubredditData(response) {
    let subreddit = response.data.url;
    let subscribers = response.data.subscribers;
    let active_users = response.data.active_user_count;
    let created_utc = response.data.created_utc;
    return {
        subreddit,
        subscribers,
        active_users,
        created_utc
    }
}


collectRedditAPIData(subreddit);
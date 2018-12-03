# Nodejs Hotel Web Crawler

To run the crawler API:

```
npm install
npm start
```

To use it, just post to localhost:3000 the checkin and checkout date as follow:

```
{
  "checkin": "15/12/2018",
  "checkout": "18/12/2018"
}
```


## Considerations

This is a basic crawler, it does take a while because it doesnt rely on a Infinite session token, so it goes to the search page, fill the dates and click the button, then crawl the rooms.

To improve the response time we could:
* Use the chrome remote interface with the dev tools protocol directly instead of with puppeteer [see link](https://developers.google.com/web/updates/2017/04/headless-chrome#cri)
* Catch the session token and only do the whole process when the token is expired and then save the token
* Figure out a fast way to get the token beforehand and then just request the result page
* Figure out if its possible to request only the response instead of the whole page

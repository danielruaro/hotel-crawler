const puppeteer = require('puppeteer');

const scrapRooms = () => {
  return Array.from(document.querySelectorAll('.roomName')).map(row => {
    let room = {};
    room.id = Array.from(row.classList).find(item => item.indexOf('roomName_') > -1).replace('roomName_', '')
    room.images = Array.from(row.querySelectorAll('.slide a')).map(anchor => anchor.href)
    let excerpt = row.querySelector('.excerpt')
    room.name = excerpt.querySelector('h5').textContent
    room.description = excerpt.querySelector('p').textContent
    return room;
  })
}

const crawl = async(hotelUrl, searchParams) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(hotelUrl, { waitUntil: 'networkidle2' });
  await page.waitForSelector('#search_where');
  await page.evaluate((searchParams) => {
    document.querySelector('#inputCheckIn').value = searchParams.checkin;
    document.querySelector('#inputCheckOut').value = searchParams.checkout;
  }, searchParams);
  await page.click('#MainSearchButton');
  await page.waitForSelector('.wrapRoomsResults');
  const rooms = await page.evaluate(scrapRooms);
  await browser.close();
  return rooms;
};

module.exports = crawl;

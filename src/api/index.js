const express = require('express');
const moment = require('moment');
const crawl = require('../services/crawler');

moment.locale('pt-br');
const router = express.Router();
const dateFormat = 'DD/MM/YYYY';
const leCantonId = 5462;

const getHotelSearchUrl = (hotelId, searchParams) => {
  return `https://myreservations.omnibees.com/default.aspx?q=${hotelId}&version=MyReservation`;
}

const validationMiddleware = (req, res, next) => {
  let params = req.body;
  if (!params.checkin) {
    return res.status(400).json({ message: 'Missing checkin parameter' });
  }
  if (!params.checkout) {
    return res.status(400).json({ message: 'Missing checkout parameter' });
  }

  const checkin = moment(params.checkin, dateFormat);
  if (!checkin.isValid()) {
    return res.status(400).json({ message: `Checkin date invalid: ${params.checkin}` })
  }
  const checkout = moment(params.checkout, dateFormat);
  if (!checkout.isValid()) {
    return res.status(400).json({ message: `Checkout date invalid ${params.checkout}` })
  }

  if (checkin.isSameOrAfter(checkout)) {
    return res.status(400).json({ message: `Checkin date after checkout date. Checkin: ${checkin} > ${checkout}.`})
  }
  req.search = { checkin: checkin.format(dateFormat), checkout: checkout.format(dateFormat) };
  next();
};

router.post('/', validationMiddleware, async (req, res) => {
  const hotelSearchUrl = getHotelSearchUrl(leCantonId);
  const vacancies = await crawl(hotelSearchUrl, req.search);
  res.status(200).json({ payload: vacancies });
});

module.exports = router;

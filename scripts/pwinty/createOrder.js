const utils = require('../utils.js');
const keys = utils.getKeys();

const merchantId = keys.pwintyMerchantId;
const apiKey = keys.pwintyApiKey;
const pwintyEnv = keys.pwintyEnv;

const pwinty = require('pwinty')(merchantId, apiKey, `https://api.pwinty.com/v2.5/`);
let orderId = null;

const address = {
  recipientName: 'Malcolm Plant',
  address1: '737 Second St',
  address2: '305',
  addressTownOrCity: 'Oakland',
  stateOrCounty: 'CA',
  postalOrZipCode: '94607',
  countryCode: 'US'
};

const photos = ['photo1.jpg']
  .map(fileName => `http://949191be.ngrok.io/${fileName}`)
  .map((url) => ({
    // make this depend on the size of the photo, and be 4x4 if square photo
    type: '4x6',

    // All photos are glossy
    attributes: {
      finish: 'glossy'
    },

    // Link to photo saved by twilio
    url,

    // Maybe make this possible to augment?
    copies: '1',

    // Ideally this would be no-crop and we would crop the photo on this server Then we woudl send the
    // cropped photo to the user to see if that is what they want.
    sizing: 'Crop',
  }));

function createOrder(address) {
  return new Promise((resolve, reject) => {
    pwinty.createOrder(
      address,
      (err, createdOrder) => err
        ? reject(err)
        : resolve(createdOrder)
    );
  });
}

function addPhotosToOrder(orderId, photos) {
  return Promise.all(photos.map((pwintyPhotoOrder) => {
    return new Promise((resolve, reject) => pwinty.addPhotoToOrder(
      orderId,
      pwintyPhotoOrder,
      (err, photo) => err
        ? reject(err)
        : resolve(photo)
    ));
  }));
}

function submitPwintyOrder(orderId) {
  return new Promise((resolve, reject) => {
    pwinty.updateOrderStatus(
      {
        id: orderId,
        status: 'Submitted',
      },
      (err, submited) => err
        ? reject(err)
        : resolve(submited)
    );
  });
}

// createOrder(address)   .then(createdOrder => orderId = createdOrder.id)   .then(() =>
// addPhotosToOrder(orderId, photos))

submitPwintyOrder('1240542').catch(e => console.error(e))

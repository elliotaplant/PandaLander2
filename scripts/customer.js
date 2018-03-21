// Used to make customer rows in google sheet
// Should be called with
//    node scripts/customer.js | pbcopy
// from the root directory

function replaceAll(string, pattern, fix) {
  return string
    .split(pattern)
    .join(fix);
}

// REPLACE WITH EMAIL OUTPUT
const customer = ``;

const wrapped = `{"${customer}"}`

const asJson = replaceAll(replaceAll(wrapped, ':', '":"'), '\n', '","');

const asObject = JSON.parse(asJson);

const row = [
  'First Name',
  'Last Name',
  'Phone',
  'Email',
  'Stripe Token',
  'Street Address 1',
  'Street Address 2',
  'City',
  'State',
  'Zip Code',
].map(key => asObject[key])
.join('\t');

console.log(row);

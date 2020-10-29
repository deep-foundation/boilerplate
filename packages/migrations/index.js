var migrate = require('migrate');

require('dotenv').config();

migrate.load({}, (err, set) => {
  if (err) throw err;
  set.up((err) => {
    if (err) throw err;
    console.log('migrations successfully ran');
  })
});

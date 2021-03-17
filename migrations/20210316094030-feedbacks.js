'use strict';

let dbm;
let type;
let seed;
let fs = require('fs')
let path = require('path')

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  const filePath = path.join(__dirname, 'sql', '20210316094030-createFeedback.sql')
  return new Promise((resolve, reject) => {

    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err)
      resolve(data);
    })
  })
  .then((data) => {
    return db.runSql(data)
  })
};

exports.down = function(db) {
  return db.dropTable("feedbacks");
};

exports._meta = {
  "version": 1
};

'use strict';
const db = require('./database');

const select = (res) => {
  // simple query
  db.connect().query(
      'SELECT * FROM Uploadable',
      (err, results, fields) => {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        if (err == null) {
          res.send(results);
        } else {
          console.log('Select error: ' + err);
        }
      },
  );
};

const selectMyImages = (data, res) => {
  // simple query
  db.connect().query(
      'SELECT * FROM Uploadable WHERE UserID = ?',
      data,
      (err, results, fields) => {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        if (err == null) {
          res.send(results);
        } else {
          console.log('Selectimage error: ' + err);
        }
      },
  );
};

const insert = (data, res) => {
  // simple query
    db.connect().execute(
        'INSERT INTO Uploadable (Description, Title, Thumbnail, Image, Original, UserID, ID) VALUES (?, ?, ?, ?, ?, ?, ?);',
        data,
        (err, results) => {
          if (err == null) {
            res.send(results);
          } else {
            console.log('Insert error: ' + err);
          }
        },
    );
};

const update = (data, res) => {
  // simple query
  db.connect().execute(
      'UPDATE Uploadable SET Description = ?, Title = ?, WHERE FileID = ? AND UserID = ?;',
      data,
      (err, results) => {
        if (err == null) {
          res.send(results);
        } else {
          console.log('Update error: ' + err);
        }
      },
  );
};

const del = (data, res) => {
  // simple query
  db.connect().execute(
      'DELETE FROM Uploadable WHERE FileID = ? AND UserID = ?;', // can delete only current user's images
      data,
      (err, results, fields) => {
         //console.log('results: '+results); // results contains rows returned by server
         //console.log('fields: '+fields); // fields contains extra meta data about results, if available
        if (err == null) {
          res.send(results);
        } else {
          console.log('Delete error: ' + err);
        }
      },
  );
};


const login = (data, callback) => {
  // simple query
  db.connect().execute(
      'SELECT * FROM Users WHERE Username = ?;',
      data,
      (err, results, fields) => {
        //console.log('results', results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log('Login error: ' + err);
        if (results.length > 0) {
          callback(results);
        } else {
          console.log('User doesnt exist');
        }
      },
  );
};

const register = (data, next) => {
  db.connect().query(
      'SELECT Username, Email FROM Users WHERE `Username` = ? AND `Email` = ?',
      data,
      (err, results, fields) => {
        if (results.length === 0) {
          db.connect().execute(
              'INSERT INTO Users (Username,Email,Password,Admin) VALUES (?,?,?,0);',
              data,
              (err, results, fields) => {
                // console.log(' Register results: ' + results); // results contains rows returned by server
                // console.log(fields); // fields contains extra meta data about results, if available
                console.log('Register errors: ' + err);

              },
          );
        } else {
          //TODO Notify User that Email / Username has been taken
          console.log('Username/Email taken');
        }
        next();
      },
  );

};



module.exports = {
  select: select,
  selectMyImages: selectMyImages,
  insert: insert,
  update: update,
  del: del,
  login: login,
  register: register,
};
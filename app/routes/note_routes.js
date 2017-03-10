// routes/note_routes.js
let ObjectID = require('mongodb').ObjectID;

// API routes go here
module.exports = function(app, db) {
  
  // Fetch-a-note route
  app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').findOne(details, (err, item) => {
      if (err) {
        res.send({ 'error':'An error occurred.' });
      } else {
          res.send(item);
      }
    });
  });

  // Create-a-note route
  app.post('/notes', (req, res) => {
    const note = { text: req.body.body, title: req.body.title };
    // if note title is empty, throw error asking to create title
    if (note.title == "") {
      res.send({ 'error': 'Title of note is empty. Please add a title.'});
    } else {
        db.collection('notes').insert(note, (err, result) => {
          if (err) {
            res.send({ 'error': 'An error occurred.' });
          } else {
              res.send(result.ops[0]);
          }
        });
      }
    //console.log(req.body)
    //res.send('Request confirmed!')
  });

  // Edit-a-note route
  app.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    // if note title is empty, throw error asking to create title
    if (note.title == "") {
      res.send({ 'error': 'Title of note is empty. Please add a title.'});
    } else {
        db.collection('notes').update(details, note, (err, result) => {
              if (err) {
                res.send({ 'error': 'An error occurred.' });
              } else {
                  res.send(note);
              }
        });
      }
  });

  // Delete-a-note route
  app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').remove(details, (err, item) => {
      if (err) {
        res.send({ 'error': 'An error occurred'});
      } else {
          res.send('Note ' + id + ' successfully deleted!');
      }
    });
  });
};

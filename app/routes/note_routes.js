// routes/note_routes.js

module.exports = function(app, db) {
  app.post('/notes', (req, res) => {
    // Create a note here
    console.log(req.body)
    res.send('Request confirmed!')
  });
};

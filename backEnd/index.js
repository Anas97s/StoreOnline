const express = require('express');
const app = express();
app.use(express.static('../frontEnd')); 
const pool = require('./base/db');
require('./tabels/createTabels').create();

require('./base/routes')(app);

app.get('/', (req, res) =>{
    res.send("Welcome To The Store!");
})

async function connectionToDB(){
    
  try {
      const result = await pool.query('SELECT NOW()');
      console.log('Connected to PgSQL. Connection test successful:', result.rows[0].now);
  } catch (err) {
      console.error('Could not connect to PgSQL or execute query:', err.message);
  }
}



connectionToDB();
const port = 5502;
app.listen(5502, () => console.log(`Server running on http://localhost:${port}`))
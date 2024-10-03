const express = require("express");
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const router = express.Router()

// import route
app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to hospital_db ***
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


db.connect((err) => {

    // Test connection
  if (err) {
    console.log("Error connecting to database", err.message);
    return;
  }
  console.log("Connected to MySQL successfully as id: ", db.threadId);

  // Set view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // solution to question 1 (Retrieve all patients)
  app.get('/patients', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).send('Error retrieving data: patients not found');
      }
      // Displaying records to the browser
      res.render('patients', { results: results });
    });
  });


// solution to question 2 (Retrieve all providers)
app.get('/providers', (req, res) => {
    db.query('SELECT * FROM providers', (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).send('Error retrieving data: providers not found');
      }
      // Displaying records to the browser
      res.render('providers', { results: results });
    });
  });

// solution to question 3 (Filter patients by First Name)
app.get('/patient', (req, res) => {

    const {firstName} = req.query; //to get the firstName query parameter from request

    if (!firstName) {
      res.statusCode(400).send('please provide a first name')
    }

    const sqlQuery = 'SELECT * FROM patients WHERE first_name = ?'

    db.query(sqlQuery,[firstName],(err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).send('Error retrieving data: patient not found');
      }
      // Displaying records to the browser
      res.render('patient', { patients: results });
   
      
     
    });
  });

  // solution to question 4 (Retrieve all providers by their specialty)
app.get('/provider', (req, res) => {

    const {specialty} = req.query; //to get the providerSpecialty query parameter from request

    if (!specialty) {
      res.statusCode(400).send('please provide a specialty')
    }

    const sqlQuery = 'SELECT * FROM providers WHERE provider_specialty = ?'

    db.query(sqlQuery, [specialty], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).send('Error retrieving data: provider not found');
      }
      // Displaying records to the browser
      res.render('provider', { providers: results });
     
    });
  });
});

// Listen to the server
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

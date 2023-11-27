require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const { Pool } = require('pg');

// const API_KEY = '4ng13yul13th';
const API_KEY=process.env.API_KEY;
const PORT= process.env.PORT;

const apikeyValidation = (req, res, next) =>{
        const userApiKey = req.get('x-api-key');
        if (userApiKey && userApiKey === API_KEY) {
            next() ;
        } else {
        res.status(401).send ('Invalid API Key');
    }
};
app.use(apikeyValidation);

const pool = new Pool({
    user: 'default',
    host: 'ep-soft-meadow-10669635-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'egN4ihjXaFQ6',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});


app.delete('/students/:id', function(req, res){
    const deleteUsersQuery = `
    DELETE FROM students WHERE id = ${req.params.id};`;

       pool.query(deleteUsersQuery)
      .then(data => {
            res.send('Datos eliminados correctamente');   
            res.send(data.rows)
    })
    .catch(err => {
        console.error(err);
        
    });
});

app.put('/students/:id', function(req, res){
    const udpatetUsersQuery = `
    UPDATE students SET name= '${req.body.name}', lastname='${req.body.lastname}', notes='${req.body.age}' WHERE id = ${req.params.id};`;

       pool.query(udpatetUsersQuery)
      .then(() => {
            res.send('Update')    
    })
    .catch(err => {
        console.error(err);
        
    });
});


app.post('/students', function(req, res){
    const insertUsersQuery = `
    INSERT INTO students (id, name, lastname, notes) VALUES 
    ('${req.body.id}','${req.body.name}','${req.body.lastname}','${req.body.notes}');`;

       pool.query(insertUsersQuery)
      .then(() => {
            res.send('Add')    
    })
    .catch(err => {
        console.error(err);
        
    });
});

app.get('/students', function(req, res){
    const listUsersQuery = `SELECT * FROM students;`;

    pool.query(listUsersQuery)
        .then(data => {
            console.log("List students: ", data.rows);
            
            res.send(data.rows)
            // pool.end();
        })
        .catch(err => {
            console.error(err);
            // pool.end();
        })

  
});

app.get('/students/:id', function(req, res){

    const userByIdQuery = `SELECT * FROM students WHERE id = ${req.params.id}`
    
    // res.send(data[index]);

    pool.query(userByIdQuery)
        .then(data => {
            // console.log("List students: ", data.rows);
            
            res.send(data.rows)
            // pool.end();
        })
        .catch(err => {
            console.error(err);
            // pool.end();
        })

  
});

app.listen(port, ()=>{
    console.log('The app is Running');
});
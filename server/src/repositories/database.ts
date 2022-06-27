import sqlite3 from 'sqlite3';

const DBSOURCE = 'db.sqlite';

const SQL_CREATE = `
  CREATE TABLE pagina (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        url TEXT,
        vetor TEXT, 
        categoria TEXT
  )`

const database = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        console.log("A tabela já existe!")
    }
    else {
        console.log('Connected to the database.');
        database.run(SQL_CREATE, (err) => {
            if (err) {
                console.error(err.message);
            }
            else {
                console.log('Table created.');
            }
        }
        );
   }
});

export default database;
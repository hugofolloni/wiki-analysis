import { Pagina } from '../models/palavra';
import database from './database';

const PageRepository = {
    create: (pagina: Pagina, callback: (id?: number) => void) => {
        const sql = 'INSERT INTO pagina (nome, url, vetor, categoria) VALUES (?, ?, ?, ?)';
        const params = [pagina.nome, pagina.url, pagina.vetor, pagina.categoria];
        database.run(sql, params, function(err) {   
            callback(this?.lastID);
            if(err){
                console.log(err);
            }
        });
        console.log(`Pagina ${pagina.nome} criada`);
    },

    readAll: (callback: (paginas: Pagina[]) => void) => {
        const sql = 'SELECT * FROM pagina';
        database.all(sql, (err, rows) => {
            callback(rows);
        }
        );
    },

    read: (id: number, callback: (pagina: Pagina) => void) => {
        const sql = 'SELECT * FROM pagina WHERE id = ?';
        const params = [id];
        database.get(sql, params, (err, row) => {
            callback(row);
        }
        );
    },

    readFiltered: (filter: string, callback: (paginas: Pagina[]) => void) => {
        const sql = 'SELECT * FROM pagina WHERE categoria LIKE ?';
        const params = [`%${filter}%`];
        database.all(sql, params, (err, rows) => {
            callback(rows);
        }
        );
    },

    readByName: (nome: string, callback: (pagina: Pagina) => void) => {
        const sql = 'SELECT * FROM pagina WHERE nome = ?';
        const params = [nome];
        database.get(sql, params, (err, row) => {
            callback(row);
        }
        );
    },

    update: (pagina: Pagina, callback: (notFound: boolean) => void) => {
        const sql = 'UPDATE pagina SET nome = ?, url = ?, palavras = ? WHERE id = ?';
        const params = [pagina.nome, pagina.url, pagina.vetor, pagina.id];
        database.run(sql, params, function(err) {
            callback(this.changes === 0);
        }
        );
    },

    delete: (id: number, callback: (notFound: boolean) => void) => {
        const sql = 'DELETE FROM pagina WHERE id = ?';
        const params = [id];
        database.run(sql, params, function(err) {
            callback(this.changes === 0);
        }
        );
    }
}

export default PageRepository;
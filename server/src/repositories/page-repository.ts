import { Pagina } from '../models/palavra';
import database from './database';

const PageRepository = {
    create: (pagina: Pagina, callback: (id?: number) => void) => {
        const sql = 'INSERT INTO PAGINA (nome, url, palavras) VALUES (?, ?, ?)';
        const params = [pagina.nome, pagina.url, pagina.palavras];
        database.run(sql, params, function(err) {   
            callback(this?.lastID);
        });
    },

    readAll: (callback: (paginas: Pagina[]) => void) => {
        const sql = 'SELECT * FROM PAGINA';
        database.all(sql, (err, rows) => {
            callback(rows);
        }
        );
    },

    read: (id: number, callback: (pagina: Pagina) => void) => {
        const sql = 'SELECT * FROM PAGINA WHERE id = ?';
        const params = [id];
        database.get(sql, params, (err, row) => {
            callback(row);
        }
        );
    },

    readFiltered: (filter: string, callback: (paginas: Pagina[]) => void) => {
        const sql = 'SELECT * FROM PAGINA WHERE categoria LIKE ?';
        const params = [`%${filter}%`];
        database.all(sql, params, (err, rows) => {
            callback(rows);
        }
        );
    },

    readByName: (nome: string, callback: (pagina: Pagina) => void) => {
        const sql = 'SELECT * FROM PAGINA WHERE nome = ?';
        const params = [nome];
        database.get(sql, params, (err, row) => {
            callback(row);
        }
        );
    },

    update: (pagina: Pagina, callback: (notFound: boolean) => void) => {
        const sql = 'UPDATE PAGINA SET nome = ?, url = ?, palavras = ? WHERE id = ?';
        const params = [pagina.nome, pagina.url, pagina.palavras, pagina.id];
        database.run(sql, params, function(err) {
            callback(this.changes === 0);
        }
        );
    },

    delete: (id: number, callback: (notFound: boolean) => void) => {
        const sql = 'DELETE FROM PAGINA WHERE id = ?';
        const params = [id];
        database.run(sql, params, function(err) {
            callback(this.changes === 0);
        }
        );
    }
}

export default PageRepository;
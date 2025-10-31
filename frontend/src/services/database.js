import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('agendamentos.db');

export async function initDB() {
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT,
      service TEXT,
      date TEXT,
      horario TEXT,
      telefone TEXT,
      price REAL,
      enviado INTEGER DEFAULT 0
    );
  `);
}

export async function salvarAgendamentoLocal(data) {
    await db.runAsync(
        `INSERT INTO agendamentos (token, service, date, horario, telefone, price, enviado)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [data.token, data.service, data.date, data.horario, data.telefone, data.price]
    );
}

export async function buscarPendentes() {
    const result = await db.getAllAsync(`SELECT * FROM agendamentos WHERE enviado = 0`);
    return result;
}

export async function marcarComoEnviado(id) {
    await db.runAsync(`UPDATE agendamentos SET enviado = 1 WHERE id = ?`, [id]);
}

export default db;

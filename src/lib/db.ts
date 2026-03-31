import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "the-pass.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");

    _db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        subtitle TEXT,
        short_code TEXT UNIQUE,
        stage TEXT NOT NULL CHECK(stage IN ('enquiry','reservation','seated','cleared','archived')),
        owner TEXT NOT NULL,
        size TEXT CHECK(size IN ('XS','S','M','L','XL')),
        last_activity TEXT NOT NULL,
        next_action TEXT,
        due_date TEXT,
        created_at TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
      )
    `);

    _db.exec(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL REFERENCES customers(id),
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        entry_type TEXT CHECK(entry_type IN ('note','update','meeting','call','email')),
        created_at TEXT NOT NULL
      )
    `);

    _db.exec(`
      CREATE TABLE IF NOT EXISTS dishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'backlog' CHECK(status IN ('backlog','todo','in_progress','review','done')),
        customer_id INTEGER NOT NULL REFERENCES customers(id),
        dish_number INTEGER NOT NULL,
        assignee TEXT,
        agent TEXT,
        priority TEXT DEFAULT 'med' CHECK(priority IN ('high','med','low')),
        size TEXT CHECK(size IN ('XS','S','M','L','XL')),
        labels TEXT DEFAULT '',
        sort_order INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    _db.exec(`
      CREATE TABLE IF NOT EXISTS dish_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dish_id INTEGER NOT NULL REFERENCES dishes(id),
        content TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_type TEXT NOT NULL CHECK(author_type IN ('human','agent')),
        created_at TEXT NOT NULL
      )
    `);

    _db.exec(`
      CREATE TABLE IF NOT EXISTS dish_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dish_id INTEGER NOT NULL REFERENCES dishes(id),
        field TEXT NOT NULL,
        old_value TEXT,
        new_value TEXT,
        changed_by TEXT NOT NULL,
        changed_by_type TEXT NOT NULL CHECK(changed_by_type IN ('human','agent')),
        created_at TEXT NOT NULL
      )
    `);

    _db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        avatar_url TEXT,
        created_at TEXT NOT NULL
      )
    `);

    _db.exec(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_hash TEXT UNIQUE NOT NULL,
        agent_name TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  }
  return _db;
}

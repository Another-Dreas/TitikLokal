/**
 * TitikLokal - Storage Layer (SAD Compliant)
 * Bertanggung jawab murni untuk I/O LocalStorage.
 * TIDAK ada logika bisnis di lapisan ini.
 */

import { initialData } from '../config/data.js';

const STORAGE_KEY = 'titiklokal_db_v11';

export const storage = {
    init: () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            const db = JSON.parse(JSON.stringify(initialData)); // deep clone
            localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
            return db;
        }
        try {
            return JSON.parse(raw);
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return storage.init();
        }
    },

    get: (table) => {
        const db = storage.init();
        return db[table] !== undefined ? db[table] : [];
    },

    set: (table, data) => {
        const db = storage.init();
        db[table] = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    },

    insert: (table, record) => {
        const rows = storage.get(table);
        rows.push(record);
        storage.set(table, rows);
        return record;
    },

    updateById: (table, id, updates) => {
        const rows = storage.get(table);
        const idx = rows.findIndex(r => r.id === id);
        if (idx === -1) return null;
        rows[idx] = { ...rows[idx], ...updates };
        storage.set(table, rows);
        return rows[idx];
    },

    deleteById: (table, id) => {
        const rows = storage.get(table);
        const filtered = rows.filter(r => r.id !== id);
        storage.set(table, filtered);
    },

    findOne: (table, predicate) => {
        const rows = storage.get(table);
        return rows.find(predicate) || null;
    },

    findMany: (table, predicate) => {
        const rows = storage.get(table);
        return rows.filter(predicate);
    },

    reset: () => {
        localStorage.removeItem(STORAGE_KEY);
        return storage.init();
    },

    getSession: () => {
        const token = localStorage.getItem('titiklokal_session');
        if (!token) return null;
        const userId = token.replace('TL_SESS_', '');
        return storage.findOne('users', u => u.id === userId) || null;
    },

    setSession: (userId) => {
        localStorage.setItem('titiklokal_session', `TL_SESS_${userId}`);
    },

    clearSession: () => {
        localStorage.removeItem('titiklokal_session');
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.storage = storage;

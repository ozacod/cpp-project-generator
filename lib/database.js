const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'projects.db');

// Initialize database
function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Create projects table
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          type TEXT NOT NULL,
          dependencies TEXT,
          cpp_standard TEXT NOT NULL,
          cmake_version TEXT NOT NULL,
          include_tests BOOLEAN NOT NULL,
          include_examples BOOLEAN NOT NULL,
          zip_data BLOB NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(db);
      });
    });
  });
}

// Save project to database
function saveProject(projectData, zipBuffer) {
  return new Promise((resolve, reject) => {
    initDatabase().then(db => {
      const stmt = db.prepare(`
        INSERT INTO projects (name, type, dependencies, cpp_standard, cmake_version, include_tests, include_examples, zip_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        projectData.name,
        projectData.type,
        JSON.stringify(projectData.dependencies || []),
        projectData.cppStandard,
        projectData.cmakeVersion,
        projectData.includeTests ? 1 : 0,
        projectData.includeExamples ? 1 : 0,
        zipBuffer
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, name: projectData.name });
      });
      
      stmt.finalize();
      db.close();
    }).catch(reject);
  });
}

// Get project by name
function getProject(name) {
  return new Promise((resolve, reject) => {
    initDatabase().then(db => {
      db.get(
        'SELECT * FROM projects WHERE name = ?',
        [name],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          if (row) {
            resolve({
              ...row,
              dependencies: JSON.parse(row.dependencies || '[]'),
              includeTests: Boolean(row.include_tests),
              includeExamples: Boolean(row.include_examples)
            });
          } else {
            resolve(null);
          }
        }
      );
      db.close();
    }).catch(reject);
  });
}

// Get all projects
function getAllProjects() {
  return new Promise((resolve, reject) => {
    initDatabase().then(db => {
      db.all('SELECT * FROM projects ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const projects = rows.map(row => ({
          id: row.id,
          name: row.name,
          type: row.type,
          dependencies: JSON.parse(row.dependencies || '[]'),
          cppStandard: row.cpp_standard,
          cmakeVersion: row.cmake_version,
          includeTests: Boolean(row.include_tests),
          includeExamples: Boolean(row.include_examples),
          createdAt: new Date(row.created_at)
        }));
        resolve(projects);
      });
      db.close();
    }).catch(reject);
  });
}

// Delete project
function deleteProject(name) {
  return new Promise((resolve, reject) => {
    initDatabase().then(db => {
      db.run('DELETE FROM projects WHERE name = ?', [name], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ deleted: this.changes > 0 });
      });
      db.close();
    }).catch(reject);
  });
}

module.exports = {
  initDatabase,
  saveProject,
  getProject,
  getAllProjects,
  deleteProject
};

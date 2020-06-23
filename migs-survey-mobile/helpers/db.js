import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('entries.db');

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY NOT NULL, entry TEXT NOT NULL, submittime TEXT NOT NULL, synced INTEGER NOT NULL);',
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}


export const insertEntry = (entry, submittime, synced) => {
  const promise = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO entries (entry, submittime, synced) VALUES (?, ?, ?);`,
          [entry, submittime, synced],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
          }
        );
      });
    });
    return promise;
};

export const fetchEntries = () => {
  const promise = new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM entries',
          [],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
          }
        );
      });
    });
    return promise;
};

export const deleteAllEntries = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM entries',
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}

export const updateSynced = (ids) => {
  const args = ids
    .filter(id => typeof(id) === 'number')
    .map(id => '"'+id+'"').toString();
  console.log(args);
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE entries SET synced=1 WHERE id IN (`+ args + `)` ,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
}
import SQLite from 'react-native-sqlite-storage';
// npm i react-native-sqlite-storage 
// npm install --save-dev @types/react-native-sqlite-storage

const createDatabase = () => {
    const db = SQLite.openDatabase({ name: 'Collected.db', location: 'default' }, () => {
        console.log('Database opened successfully');
    }, (error) => {
        console.error('Failed to open database', error);
    });
 
    db.transaction((tx) => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS messages (logID INTEGER PRIMARY KEY, header TEXT, created_at TEXT, textValue TEXT)',
            [],
            () => {
                console.log('Table created successfully');
            },
            (error) => {
                console.error('Failed to create table', error);
            }
        );
    });

    return db;
};



export default createDatabase;

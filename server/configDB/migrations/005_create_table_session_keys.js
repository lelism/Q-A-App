const initSessionKeysTable = `
        CREATE TABLE IF NOT EXISTS session_keys(
        key_id INT NOT NULL AUTO_INCREMENT,
        owner_id INT NOT NULL,
        session_key TEXT NOT NULL,
        key_expires_on DATETIME NOT NULL,
        PRIMARY KEY (key_id),
        CONSTRAINT fk_session_keys_owner_id_users_user_id 
            FOREIGN KEY (owner_id) 
            REFERENCES users(user_id)
    )`;

module.exports = initSessionKeysTable;

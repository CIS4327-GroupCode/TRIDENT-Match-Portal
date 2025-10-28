const db = require("../db");

//REGISTER ROUTE
const findUserByEmail = async (email) => {  
    const exists = await db.query("SELECT id FROM _user WHERE email = $1", [email]);
    if(exists.rows.length) return true;
    return false;
}
const createUser = async (name, email, password_hash, role, mfa_enabled) => {
   const resp = await db.query(
      `INSERT INTO _user (name, email, password_hash, role, mfa_enabled) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role, created_at`,
      [name, email, password_hash, role || "researcher", !!mfa_enabled]
    );
    return resp.rows[0];
}

//LOGIN ROUTE
const getUserByEmail = async (email) => {
     const found = await db.query(
          "SELECT id, name, email, role, created_at, password_hash FROM _user WHERE email = $1",
          [email]
        );
        if(!found.rows.length) return null;
        return found.rows[0];
}

module.exports = {
    findUserByEmail,
    createUser,
    getUserByEmail
}
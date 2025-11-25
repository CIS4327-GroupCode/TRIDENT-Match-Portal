const { User } = require("../database/models");

// REGISTER ROUTE
const findUserByEmail = async (email) => {  
    const exists = await User.findOne({ 
      where: { email },
      attributes: ['id']
    });
    return !!exists;
}

const createUser = async (name, email, password_hash, role, mfa_enabled) => {
    const user = await User.create({
      name,
      email,
      password_hash,
      role: role || 'researcher',
      mfa_enabled: !!mfa_enabled
    });

    // Return plain object matching old format
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };
}

// LOGIN ROUTE
const getUserByEmail = async (email) => {
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'name', 'email', 'role', 'created_at', 'password_hash']
    });
    
    if (!user) return null;
    
    // Return plain object matching old format
    return user.toJSON();
}

module.exports = {
    findUserByEmail,
    createUser,
    getUserByEmail
}
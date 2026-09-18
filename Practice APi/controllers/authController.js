// const bcrypt = require("bcryptjs");
// const User = require("../models/userModel");
// const jwt = require("jsonwebtoken");

// const registerUser = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // Required field validation
//         if (!name || !email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Name, email and password are required"
//             });
//         }

//         // Check duplicate email
//         const existingUser = await User.findOne({
//             email: email.toLowerCase().trim()
//         });

//         if (existingUser) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Email already exists"
//             });
//         }

//         // Password validation
//         if (password.length < 6) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Password must be at least 6 characters"
//             });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         console.log("Hashed Password:", hashedPassword);

//         // Create user
//         const user = await User.create({
//             name: name.trim(),
//             email: email.toLowerCase().trim(),
//             password: hashedPassword,
//             role: role || "STUDENT"
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Registration successful",
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });

//     } catch (error) {
//         console.error("Registration error:", error);

//         // MongoDB duplicate key protection
//         if (error.code === 11000) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Email already exists"
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// };

// module.exports = {
//     registerUser
// };



// // login APis
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email and password are required"
//             });
//         }

//            const user = await User.findOne({ email: email.toLowerCase().trim() });
//            if (!user) {
//                return res.status(404).json({
//                    success: false,
//                    message: "Invalid email or password"
//                });
//            }
           
//            const passwordMAtch = await bcrypt.compare(password, user.password);

//            if(!passwordMAtch) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//            }

//            const accessToken = jwt.sign(
//             { userId: user._id.toString(), role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//            );


          

//            return res.status(200).json({
//                success: true,
//                message: "Login successful",
//                user: {
//                    id: user._id,
//                    name: user.name,
//                    email: user.email,
//                    role: user.role
//                }
//            });
//     } catch (error) {
//         console.error("Login error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// };

// module.exports = {
//     registerUser,
//     loginUser
// };

/*
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// ================= REGISTER API =================

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Required field validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Clean email
        const cleanEmail = email.toLowerCase().trim();

        // Check duplicate email
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: role || "STUDENT"
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        // MongoDB duplicate key protection
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ================= LOGIN API =================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Required field validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Clean email
        const cleanEmail = email.toLowerCase().trim();

        // Find user
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const accessToken = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        // Success response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const accessToken = jwt.sign(
  {
    userId: user._id.toString(),
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d"
  }
);

res.status(200).json({
  success: true,
  message: "Login successful",
  accessToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});

} catch (err) {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

const refreshtoken = jwt.sign(
  {
    userId: user._id.toString(),    
role: user.role
  },
  process.env.JWT_SECRET,   
{
    expiresIn: "7d"
  }
);


// ================= EXPORT =================

module.exports = {
    registerUser,
    loginUser
};



const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// ================= REGISTER API =================

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Required field validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Clean email
        const cleanEmail = email.toLowerCase().trim();

        // Check duplicate email
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: role || "STUDENT"
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        // MongoDB duplicate key protection
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ================= LOGIN API =================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Required field validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Clean email
        const cleanEmail = email.toLowerCase().trim();

        // Find user
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ================= ACCESS TOKEN =================

        const accessToken = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        // ================= REFRESH TOKEN =================

        const refreshToken = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // ================= SUCCESS RESPONSE =================

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ================= EXPORT =================

module.exports = {
    registerUser,
    loginUser
};

*/
/*
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanEmail });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ACCESS TOKEN
        const accessToken = jwt.sign(
            { userId: user._id.toString(), role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        // REFRESH TOKEN
        const refreshToken = jwt.sign(
            { userId: user._id.toString(), role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // SUCCESS RESPONSE
        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { loginUser };
*/

const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

// ================= REGISTER API =================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" });
        }

        const cleanEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: role || "STUDENT"
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Registration error:", error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ================= LOGIN API =================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const cleanEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const logoutUser = async (req, res) => {
    try { 
        const { refreshToken } = req.body;

        // in a production implementation,
        // find the refresh token and revoke it
        res.status(200).json({
            success: true,
            message: "Logout successful"
        }); 

        
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error"
         });
    }
}
module.exports = { registerUser, loginUser, logoutUser };

// CCMMRU

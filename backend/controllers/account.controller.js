require('dotenv').config()
const postgre = require('../config/database')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const accountController = {
	getById: async (req, res) => {
		try {
			const accemail = req.user.accemail; 
			const sql = 'SELECT * FROM account WHERE accemail = $1';
	
			const { rows } = await postgre.query(sql, [accemail]);
	
			if (rows[0]) {
				return res.status(200).json({ data: rows[0] });  // Return the user data directly
			}
	
			return res.status(404).json({ msg: "Account not found" });
	
		} catch (error) {
			res.status(404).json({ msg: `getById Error: ${error.msg}` });
		}
	},
    create: async (req, res) => {
        try {
            const { username, accemail, accpass } = req.body;
            const hashedPassword = await bcrypt.hash(accpass, 10);
    
            const checkAccountExist = `SELECT EXISTS(SELECT 1 FROM account WHERE username = $1 AND accemail = $2);`;
            const insertAccountData = `INSERT INTO account(accid, username, accemail, accpass)
                                       VALUES(nextval('account_id_seq'), $1, $2, $3) RETURNING *;`;
            const insertUserProfileData = `INSERT INTO userprofile(accid) VALUES($1) RETURNING *;`;
    
            const result = await postgre.query(checkAccountExist, [username, accemail.toLowerCase()]);

            if (result.rows[0].exists === false) {
                const accountData = await postgre.query(insertAccountData, [username, accemail.toLowerCase(), hashedPassword]);
                
                if (accountData.rows[0]) {
                    const accid = accountData.rows[0].accid;
                    const userProfileData = await postgre.query(insertUserProfileData, [accid]);
    
                    if (userProfileData.rows[0]) {
                        return res.status(201).json({ msg: "Account created" });
                    } else {
                        return res.status(404).json({ msg: "Failed to create user profile" });
                    }
                } else {
                    return res.status(404).json({ msg: "Failed to create an account" });
                }
            } else {
                return res.status(409).json({ msg: "Account already exists" });
            }
        } catch (error) {
            return res.status(500).json({ msg: `Internal Server Error: ${error.message}` });
        }
    },
    
    verifyAccount: async (req, res) => {
        try {
            var { accemail, accpass } = req.body;
            var sql = `SELECT * FROM account WHERE accemail = $1`

            const { rows } = await postgre.query(sql, [accemail.toLowerCase()])

            if (rows[0]) {
                var token = "";

                hashedPassword = rows[0].accpass;
                const status = await bcrypt.compare(accpass, hashedPassword)

                if (status) {
                    token = jwt.sign({ accemail: rows[0].accemail }, process.env.JWT_SECRET, {
                        expiresIn: 86400 //expires in 24 hrs
                    });

                    return res.status(201).json({ token, result: rows[0] })
                }
                else if (!status) {
                    return res.status(401).json({ msg: "Password is incorrect" })
                } else {
                    return res.status(404).json({ msg: error.msg })
                };
            }

            return res.status(404).json({ msg: "Account is not found" })

        } catch (error) {
            res.status(404).json({ msg: error.msg })    
        }
    },
};

module.exports = accountController;
require('dotenv').config()
const postgre = require('../config/database')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const accountController = {
    getAllAccounts: async (req, res) => {
        try {
            var sql = 'SELECT * FROM account ORDER BY accid ASC'

            const { rows } = await postgre.query(sql)

            res.status(200).json({ data: rows })

        } catch (error) {
            res.status(404).json({ msg: error.msg })
        }
    },
    getById: async (req, res) => {
        try {
            var { accid } = req.query;
            var sql = 'SELECT * FROM account WHERE accid = $1'

            const { rows } = await postgre.query(sql, [accid])

            if (rows[0]) {
                return res.status(200).json({ data: rows })
            }

            return res.status(404).json({ msg: "Account is not found" })

        } catch (error) {
            res.status(404).json({ msg: error.msg })
        }
    },
    create: async (req, res) => {
        try {
            const { username, accemail, accpass } = req.body
            const hashedPassword = await bcrypt.hash(accpass, 10);

            const checkAccountExist = `SELECT EXISTS(SELECT 1 FROM account WHERE username = $1 AND accemail = $2);`
            const insertAccountData = `INSERT INTO account(accid, username, accemail, accpass)
                         VALUES(nextval('account_id_seq'), $1, $2, $3) RETURNING *;`
            const insertUserProfileData = `INSERT INTO userprofile(accid) VALUES($1) RETURNING *;`

            postgre.query(checkAccountExist, [username, accemail.toLowerCase()], async (error, result) => {
                // If there is an error
                // Else if account does not exist
                // Else account exist
                if (error) {
                    res.status(404).json({ msg: error.msg })
                } else {
                    if (result.rows[0].exists == false) {

                        // Insert data into Account Table
                        postgre.query(insertAccountData, [username, accemail.toLowerCase(), hashedPassword], async (error, accountData) => {
                            if (error) {
                                res.status(404).json({ msg: error.msg })
                            } else {
                                if (accountData.rows[0]) {
                                    const accid = accountData.rows[0].accid;

                                    // Insert data into UserProfile Table
                                    const { rows } = await postgre.query(insertUserProfileData, [accid]);

                                    if (rows[0]) {
                                        return res.status(201).json({ msg: "Account created" })
                                    }
                                } else {
                                    return res.status(404).json({ msg: "Failed to create an account" })
                                }
                            }
                        })
                    } else {
                        return res.status(409).json({ msg: "Account already exists" })
                    }
                }
            })
        } catch (error) {
            res.status(404).json({ msg: error.msg })
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
                const status = bcrypt.compare(accpass, hashedPassword)

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
    // updateEmail: async (req, res) => {
    //     try {
    //         const { accid, accemail, newemail } = req.body
    //         const sql = 'UPDATE account set accemail = $3 where accid = $1 and accemail = $2 RETURNING *'

    //         const { rows } = await postgre.query(sql, [accid, accemail, newemail])

    //         if (rows[0]) {
    //             return res.status(200).json({ msg: "Email is updated" })
    //         }

    //         return res.status(404).json({ msg: "Failed to update" })

    //     } catch (error) {
    //         res.status(404).json({ msg: error.msg })
    //     }
    // },
    // updatePassword: async (req, res) => {
    //     try {
    //         const { accid, accpass, newpass } = req.body;
    
    //         // Hash the new password before updating
    //         const hashedPassword = await bcrypt.hash(newpass, 10);
    
    //         // Check the current password in the database
    //         const checkCurrentPasswordSql = 'SELECT * FROM account WHERE accid = $1';
    //         const { rows } = await postgre.query(checkCurrentPasswordSql, [accid]);
    
    //         if (rows[0]) {
    //             const currentPassword = rows[0].accpass;
    
    //             // Verify the current password
    //             const passwordMatch = await bcrypt.compare(accpass, currentPassword);
    
    //             if (passwordMatch) {
    //                 // If the current password is correct, update the password with the new hashed password
    //                 const updatePasswordSql = 'UPDATE account SET accpass = $2 WHERE accid = $1 RETURNING *';
    //                 const { rows: updatedRows } = await postgre.query(updatePasswordSql, [accid, hashedPassword]);
    
    //                 if (updatedRows[0]) {
    //                     return res.status(200).json({ msg: "Password is updated" });
    //                 }
    //             }
    //         }
    
    //         return res.status(404).json({ msg: "Failed to update" });
    //     } catch (error) {
    //         res.status(404).json({ msg: error.msg });
    //     }
    // },
    deleteById: async (req, res) => {
        try {
            var { accid } = req.body;

            const deleteUserProfile = 'DELETE FROM userprofile where accid = $1 RETURNING *;';
            const deleteAccount = 'DELETE FROM account where accid = $1 RETURNING *;';

            postgre.query(deleteUserProfile, [accid], async (error, result) => {
                // If there is an error
                // Else if userprofile can't be deleted
                // Else account exist
                if (error) {
                    res.status(404).json({ msg: error.msg })
                } else {
                    if (result.rows[0]) {

                        const { rows } = await postgre.query(deleteAccount, [accid])

                        if (rows[0]) {
                            return res.status(200).json({ msg: "Account is deleted" })
                        }

                        return res.status(404).json({ msg: "Account is not found" })

                    } else {
                        return res.status(404).json({ msg: "User Profile can't be deleted" })
                    }
                }
            })
        } catch (error) {
            res.status(404).json({ msg: error.msg })
        }
    }
};

module.exports = accountController;
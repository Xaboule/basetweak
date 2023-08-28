require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { dbConnection: db } = require("./dbController");

const register = (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const number = req.body.number;
  const street = req.body.street;
  const postal = req.body.postal;
  const city = req.body.city;
  const country = req.body.country;
  const phone = req.body.phone;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO user (firstname, lastname,email, username, password) VALUES (?,?,?,?,?)",
      [firstname, lastname, email, username, hash],
      (err, result) => {
        console.log(err);

        // Get the ID of the inserted row
        const userId = result.insertId;
        db.query(
          "INSERT INTO user_info (id_user, number, street, postal, city, country, phone) VALUES (?, ?,?,?,?,?,?)",
          [userId, number, street, postal, city, country, phone],
          (err2, result2) => {
            if (err2) {
              console.error(err2);
              return res.sendStatus(500); // Handle the error appropriately
            }

            // Successfully inserted into both tables
            res.sendStatus(200);
          }
        );
      }
    );
  });
};

const isUserAuth = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    res.send("Token needed");
  } else {
    jwt.verify(token, process.env.JWT_AUTH_SECRET, (err, decoded) => {
      if (err) {
        res
          .status(401)
          .json({ auth: false, message: "Failed authentification" });
      } else {
        req.userId = decoded.id;
        next();
        res.json({ auth: true, message: "Successfully logged in" });
      }
    });
  }
};

const loginGet = (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
};

const loginPost = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM user WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result;

            const id = result[0].id;
            const token = jwt.sign({ id }, process.env.JWT_AUTH_SECRET, {
              expiresIn: 300,
            });
            db.query(
              "SELECT * FROM user_guitar INNER JOIN guitar ON guitar.id = user_guitar.id_guitar   WHERE user_guitar.id_user = ?;",
              id,
              (err, gtrs) => {
                if (err) {
                  res.send({ err: err });
                }
                db.query(
                  "SELECT * FROM user_info  WHERE id_user = ?;",
                  id,
                  (err, otherResult) => {
                    if (err) {
                      res.send({ err: err });
                    }

                    // Modify the response as needed with additional data
                    const modifiedResponse = {
                      auth: true,
                      token: token,
                      result: result,
                      otherData: otherResult,
                      guitars: gtrs,
                    };

                    res.json(modifiedResponse);
                  }
                );
              }
            );
          } else {
            res.json({
              auth: false,
              message: "Wrong username/password combination!",
            });
          }
        });
      } else {
        res.json({ auth: false, message: "User doesn't exist" });
        // res.send({ message: "User doesn't exist" });
      }
    }
  );
};

const userInfo = (req, res) => {
  const username = req.body.username;
  const sqlGetInfo = `SELECT * FROM user 
        WHERE username = ?`;
  db.query(sqlGetInfo, username, (err, result) => {
    res.send(result);
  });
};
const editUserInfo = (req, res) => {
  const user_id = req.body.user_id;
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const number = req.body.number;
  const street = req.body.street;
  const postal = req.body.postal;
  const city = req.body.city;
  const country = req.body.country;
  const phone = req.body.phone;

  const sqlUserUpdate = `UPDATE user
 SET username = ?, firstname = ?, lastname = ?, email = ?
 WHERE id = ?`;
  const sqlUserInfoUpdate = `UPDATE user_info
 SET number = ?, street = ?, postal = ?, city = ?, country = ?, phone = ?
 WHERE id_user = ?`;
  db.query(
    sqlUserUpdate,
    [username, firstname, lastname, email, user_id],
    (err, userResult) => {
      if (err) {
        console.error("Error:", err);
        return res.status(500).send("An error occurred.");
      }
      db.query(
        sqlUserInfoUpdate,
        [number, street, postal, city, country, phone, user_id],
        (err2, userInfoResult) => {
          if (err2) {
            console.error("Error:", err2);
            return res.status(500).send("An error occurred.");
          }
          res.send({ userResult, userInfoResult });
        }
      );
    }
  );
};

const deleteUserInfo = (req, res) => {
  const user = req.body.user;

  // Delete from user table
  db.query(
    "DELETE FROM user_guitar WHERE id_user = ?",
    [user],
    (err1, result1) => {
      if (err1) {
        console.error(err1);
        res.status(500).send("An error occurred.");
        return;
      }

      // Delete from user_guitar table
      db.query(
        "DELETE FROM user_info WHERE id_user = ?",
        [user],
        (err2, result2) => {
          if (err2) {
            console.error(err2);
            res.status(500).send("An error occurred.");
            return;
          }

          // Delete from user_info table
          db.query("DELETE FROM user WHERE id = ?", [user], (err3, result3) => {
            if (err3) {
              console.error(err3);
              res.status(500).send("An error occurred.");
              return;
            }
            // Successfully deleted from all tables
            res.sendStatus(200);
          });
        }
      );
    }
  );
};

const deleteUserGuitar = (req, res) => {
  const id_guitar = req.body.id_guitar;
  const sqlDeleteGuitar = ``;
  db.query(
    "DELETE FROM composition WHERE id_guitar = ?",
    [id_guitar],
    (err1, result1) => {
      if (err1) {
        console.error(err1);
        res.status(500).send("An error occurred.");
        return;
      }

      // Delete from user_guitar table
      db.query(
        "DELETE FROM user_guitar WHERE id_guitar = ?",
        [id_guitar],
        (err2, result2) => {
          if (err2) {
            console.error(err2);
            res.status(500).send("An error occurred.");
            return;
          }

          // Delete from user_info table
          db.query(
            "DELETE FROM guitar WHERE id = ?",
            [id_guitar],
            (err3, result3) => {
              if (err3) {
                console.error(err3);
                res.status(500).send("An error occurred.");
                return;
              }
              // Successfully deleted from all tables
              res.sendStatus(200);
            }
          );
        }
      );
    }
  );
};



const renameUserGuitar = (req,res) => {
  // console.log(req.body)
const guitar_id = req.body.data.id_guitar
const new_name = req.body.data.newname
  sqlUpdateGuitarName = `UPDATE guitar SET name = ? WHERE id = ? `;
db.query(sqlUpdateGuitarName, [new_name , guitar_id], (err, result)=>
{if (err) {
  console.error("Error:", err);
  // return res.status(500).send("An error occurred.");
}
// res.send({ userResult, userInfoResult });

console.log(result)
},
res.sendStatus(200)
)}

module.exports = {
  register,
  loginGet,
  loginPost,
  isUserAuth,
  userInfo,
  editUserInfo,
  deleteUserInfo,
  deleteUserGuitar,
  renameUserGuitar
};

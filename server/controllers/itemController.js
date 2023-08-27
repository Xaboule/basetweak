const { dbPool: db } = require("./dbController");
const path = require("path");
const fs = require("fs");

const getItemsFullGtr = (req, res) => {
  const sqlSelect = "SELECT * FROM parts where model_comp like ?";
  const model = req.query.model;
  db.query(sqlSelect, `%${model}%`, (err, result) => {
    res.send(result);
  });
};

const saveGuitarThumb = (req, res) =>{
  const thumb = req.body.thb
   const sqlUserGtr = `INSERT INTO user_guitar (id_user, id_guitar) VALUES (?)`;
}



const addGuitar = (req, res, next) => {

  const gtrname = req.body.gtrname;
  const tablefront = req.body.tablefront;
  const tableback = req.body.tableback;
  const side = req.body.side;
  const binding = req.body.binding;
  const neck = req.body.neck;
  const fretbinding = req.body.fretbinding;
  const fretboard = req.body.fretboard;
  const inlay = req.body.inlay;
  const nut = req.body.nut;
  const frets = req.body.frets;
  const pickup_cover = req.body.pickup_cover;
  const metal_pieces = req.body.metal_pieces;
  const pickup_ring = req.body.pickup_ring;
  const knobs = req.body.knobs;
  const texture_path = req.body.texture_path;
  const gloss = req.body.gloss;
  const scratch = req.body.scratch;
  const wood = req.body.wood;
  const modelId = req.body.id;
  const body = req.body.body;
  const pickguard = req.body.pickguard;
  const single_plastic = req.body.single_plastic;
  const single_metal = req.body.single_metal;
  const backplate = req.body.backplate;
  const user = req.body.user;
  const thumbnail = req.body.thumbnail


  const responseData = {}

  const sqlInsertGtr = ` INSERT INTO guitar (name, model, id_user) VALUES (?)`;
  const sqlInsertTex = `INSERT INTO texture (id_user, path, name) VALUES (?)`;
  const sqlInsertComp = `INSERT INTO composition (id_part, color, id_texture, gloss, scratch, wood, id_guitar)
    VALUES 
    ((SELECT id FROM parts WHERE name = 'body'), ?),
   ((SELECT id FROM parts WHERE name = 'tablefront'), ?),
   ((SELECT id FROM parts WHERE name = 'tableback'), ?),
   ((SELECT id FROM parts WHERE name = 'side'), ?),
   ((SELECT id FROM parts WHERE name = 'binding'), ?),
   ((SELECT id FROM parts WHERE name = 'neck'), ?),  
   ((SELECT id FROM parts WHERE name = 'fretbinding'), ? ),
   ((SELECT id FROM parts WHERE name = 'fretboard'),?),
   ((SELECT id FROM parts WHERE name = 'inlay'), ? ),
   ((SELECT id FROM parts WHERE name = 'nut'), ?),
   ((SELECT id FROM parts WHERE name = 'frets'), ? ),
   ((SELECT id FROM parts WHERE name = 'pickup_cover'), ?),
   ((SELECT id FROM parts WHERE name = 'metal_pieces'), ? ),
   ((SELECT id FROM parts WHERE name = 'pickup_ring'), ?),
   ((SELECT id FROM parts WHERE name = 'knobs'), ? ),
   ((SELECT id FROM parts WHERE name = 'pickguard'), ?),
   ((SELECT id FROM parts WHERE name = 'single_plastic'), ?),
   ((SELECT id FROM parts WHERE name = 'single_metal'), ?),
   ((SELECT id FROM parts WHERE name = 'backplate'), ?)
   `;
  const sqlUserGtr = `INSERT INTO user_guitar (id_user, id_guitar, thumbnail) VALUES (?)`;
  try {
    db.query(sqlInsertGtr, [[gtrname, modelId, user]], (err, result) => {
      if (err) {
        throw err;
      }
      const addedId = result.insertId;
      responseData.id_guitar = addedId
      responseData.model = modelId
      responseData.name = gtrname


      db.query(
        sqlInsertTex,
        [["user", texture_path, "original"]],
        (err, result) => {
          if (err) {
            throw err;
          }
          const texID = result.insertId;
          db.query(
            sqlInsertComp,
            [ 
              [body, texID, gloss, scratch, wood, addedId],
              [tablefront, texID, gloss, scratch, wood, addedId],
              [tableback, texID, gloss, scratch, wood, addedId],
              [side, texID, gloss, scratch, wood, addedId],
              [binding, texID, gloss, scratch, wood, addedId],
              [neck, texID, gloss, scratch, wood, addedId],
              [fretboard, texID, gloss, scratch, wood, addedId],
              [fretbinding, texID, gloss, scratch, wood, addedId],
              [frets, texID, gloss, scratch, wood, addedId],
              [nut, texID, gloss, scratch, wood, addedId],
              [inlay, texID, gloss, scratch, wood, addedId],
              [pickup_cover, texID, gloss, scratch, wood, addedId],
              [pickup_ring, texID, gloss, scratch, wood, addedId],
              [single_plastic, texID, gloss, scratch, wood, addedId],
              [single_metal, texID, gloss, scratch, wood, addedId],
              [pickguard, texID, gloss, scratch, wood, addedId],
              [backplate, texID, gloss, scratch, wood, addedId],
              [knobs, texID, gloss, scratch, wood, addedId],
              [metal_pieces, texID, gloss, scratch, wood, addedId],
            ],
            (err, result) => {
              if (err) {
                throw err;
              }

              db.query(sqlUserGtr, [[user, addedId, thumbnail]]);
              responseData.user = user
              responseData.thumbnail = thumbnail
              res.status(200).json(responseData);
            }
          );
        }
      );
    });
  } catch (err) {

    res.sendStatus(500);
  }
 
  // res.sendStatus(200)

};

const saveTexture = (req, res, next) => {
  const texture_path = req.body.texture_path;

for (const partName in texture_path) {

    if (texture_path[partName] === !null && texture_path.hasOwnProperty(partName)) {
      const sourceFilePath = path.join(__dirname, 'stocked', 'temporary', texture_path[partName]);
      const destinationFolderPath = path.join(__dirname, 'stocked', 'permanent');
      const destinationFilePath = path.join(destinationFolderPath, texture_path[partName]);

  fs.access(sourceFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Source file does not exist:', err);
      return res.status(404).send({ message: 'Source file does not exist.' });
    }})

    fs.copyFile(sourceFilePath, destinationFilePath, (copyErr) => {
      if (copyErr) {
        console.error('Error copying file:', copyErr);
        return res.status(500).send({ message: 'Error copying file.' });
      }

    //   // Continue to the next middleware
    
    }); 
     next();
  };
}}








const getGuitars = (req, res) => {
  const user = req.body.id_user;
  const sqlSelect = `SELECT  g.name, g.model
FROM guitar g
WHERE g.id_user = ?
ORDER BY g.name`;
  db.query(sqlSelect, user, (err, result) => {
  
    res.send(result);

  });
};

const fetchGuitar = (req, res) => {
  const user = req.query.user
  const gtr = req.query.gtr;

  const sqlSelect = `SELECT user_guitar.*, guitar.*
  FROM user_guitar
  INNER JOIN guitar ON user_guitar.id_user = guitar.id_user
  INNER JOIN composition ON guitar.id = composition.id_guitar
  INNER JOIN parts ON composition.id_part = parts.id
  WHERE user_guitar.id_user = ? AND guitar.id = ?`;

db.query(sqlSelect, [user, gtr], (err, result) => {
  if (err) {
    console.error(err);
    res.sendStatus(500); // Sending internal server error status
  } else {
    res.send(result);
  }
});
};

const fetchGuitarColors = (req, res) => {

  const gtr = req.query.gtr;

  const sqlSelect = `SELECT composition.*, parts.name from composition
  INNER JOIN parts ON composition.id_part = parts.id
  WHERE id_guitar = ?`;
  const sqlModelSelect = `SELECT model, name FROM guitar WHERE id = ?`;

  try {
    db.query(sqlSelect, [gtr], (err, compositionResult) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500); // Send error status if there's an error
      }

      db.query(sqlModelSelect, [gtr], (err, modelResult) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500); // Send error status if there's an error
        }


        // Send the response with the results
        res.status(200).json({
          composition: compositionResult,
          model: modelResult
        });
      });
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500); // Send error status if there's a general error
  }
};


const fetchTextures = (req, res) => {
  const texID = req.query.txID

  const sqlSelect = `SELECT path
  FROM texture t
  INNER JOIN composition c ON t.id = c.id_texture
  WHERE t.id = ? `;

db.query(sqlSelect, texID, (err, result) => {
  if (err) {
    console.error(err);
    res.sendStatus(500); // Sending internal server error status
  } else {
    res.send(result);
  }
});
};





const guitarToCart = (req, res) => {
  const cartGtrId = req.body.guitar_id;
  const sqlInsert = "INSERT INTO cart_guitar (guitar_id) VALUES (?)";
  db.query(sqlInsert, cartGtrId, (err, result) => {
    res.sendStatus(200);
  });

};





module.exports = {
  getItemsFullGtr,
  addGuitar,
  getGuitars,
  fetchGuitar,
  guitarToCart,
  fetchTextures,
  saveTexture,
  fetchGuitarColors
};

require("dotenv").config();
const mysql = require("mysql2");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: true,
});

const getItemsFullGtr = (req, res) => {
  const sqlSelect = "SELECT * FROM parts where model_comp like ?";
  const model = req.query.model
  db.query(sqlSelect, `%${model}%`,(err, result) => {
    res.send(result);
  });
};

const addGuitar = (req, res) => {
  const gtrname = req.body.gtrname;
  const tablefront = req.body.tablefront;
  const tableback = req.body.tableback;
  const binding = req.body.binding;
  const side = req.body.side;
  const neck = req.body.neckwood;
  const fretboard = req.body.fretboard;
  const fretbinding = req.body.fretbinding;
  const frets = req.body.frets;
  const inlay = req.body.inlay;
  const nut = req.body.nut;
  const metal_pieces = req.body.metal_pieces;
  const pickup_cover = req.body.pickup_cover;
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

 
 const sqlInsertGtr =  ` INSERT INTO guitar (name, model) VALUES (?)`;
 const sqlInsertTex = `INSERT INTO texture (id_user, path, name) VALUES (?)`
   const sqlInsertComp = 
   `INSERT INTO composition (id_part, color, id_texture, gloss, scratch, wood, id_guitar)
    VALUES 
   ((SELECT id FROM parts WHERE name = 'tablefront'), ?),
   ((SELECT id FROM parts WHERE name = 'tableback'), ?),
   ((SELECT id FROM parts WHERE name = 'binding'), ?),
   ((SELECT id FROM parts WHERE name = 'side'), ?),
   ((SELECT id FROM parts WHERE name = 'neck'), ?),
   ((SELECT id FROM parts WHERE name = 'fretboard'),?),
   ((SELECT id FROM parts WHERE name = 'fretbinding'), ? ),
   ((SELECT id FROM parts WHERE name = 'frets'), ? ),
   ((SELECT id FROM parts WHERE name = 'inlay'), ? ),
   ((SELECT id FROM parts WHERE name = 'nut'), ?),
   ((SELECT id FROM parts WHERE name = 'metal_pieces'), ? ),
   ((SELECT id FROM parts WHERE name = 'pickup_cover'), ?),
   ((SELECT id FROM parts WHERE name = 'pickup_ring'), ?),
   ((SELECT id FROM parts WHERE name = 'knobs'), ? ),
   ((SELECT id FROM parts WHERE name = 'pickguard'), ?),
   ((SELECT id FROM parts WHERE name = 'single_plastic'), ?),
   ((SELECT id FROM parts WHERE name = 'single_metal'), ?),
   ((SELECT id FROM parts WHERE name = 'backplate'), ?)
   `;

  try {
    db.query(
      sqlInsertGtr,
      [[gtrname, modelId]],
      (err, result) => {
        if (err) {
          throw err;
        }
        const addedId = result.insertId;

        db.query( sqlInsertTex, [['user', texture_path, 'original'] ],
        (err, result) => {
          if (err) {
            throw err;
          }
          const texID = result.insertId;
        db.query(
          sqlInsertComp,
          [
            [tablefront, texID, gloss, scratch, wood, addedId],
           [tableback, texID, gloss, scratch, wood, addedId],
           [binding, texID, gloss, scratch, wood, addedId],
           [side, texID, gloss, scratch, wood, addedId],
           [neck, texID, gloss, scratch, wood, addedId],
           [fretboard, texID, gloss, scratch, wood, addedId],
           [fretbinding, texID, gloss, scratch, wood, addedId],
           [frets, texID, gloss, scratch, wood, addedId],
           [inlay, texID, gloss, scratch, wood, addedId],
           [nut, texID, gloss, scratch, wood, addedId],
           [metal_pieces, texID, gloss, scratch, wood, addedId],
           [pickup_cover, texID, gloss, scratch, wood, addedId],
           [pickup_ring, texID, gloss, scratch, wood, addedId],
           [knobs, texID, gloss, scratch, wood, addedId],
           [body, texID, gloss, scratch, wood, addedId],
           [pickguard, texID, gloss, scratch, wood, addedId],
           [single_plastic, texID, gloss, scratch, wood, addedId],
           [single_metal, texID, gloss, scratch, wood, addedId],
           [backplate, texID, gloss, scratch, wood, addedId],
          ],
          (err, result) => {
            if (err) {
              throw err;
            }
            console.log(result);
            res.status(200).json({ id: addedId });
          }
        );
      }
        )
      }
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};


const getGuitars = (req, res) => {
  const sqlSelect =
    // "SELECT guitar_id FROM model_parts GROUP BY color_set;"
`SELECT  g.name, g.model
FROM guitar g

ORDER BY g.name`
  db.query(sqlSelect, (err, result) => {
    res.send(result);
    // console.log(result)
  });
};

const fetchGuitar = (req, res) => {
  const gtr = req.query.gtr
  console.log(gtr)
  const sqlSelect =
`SELECT *
FROM guitar g
INNER JOIN composition c ON g.id = c.id_guitar
INNER JOIN parts p ON c.id_part = p.id
WHERE g.name = ?`;

  db.query(sqlSelect, gtr,(err, result) => {
    
    res.send(result);
    // console.log(result)
  });
};


const guitarToCart = (req, res) => {
  const cartGtrId = req.body.guitar_id
  const sqlInsert = 'INSERT INTO cart_guitar (guitar_id) VALUES (?)'
  db.query(sqlInsert, cartGtrId, (err, result) => {
    res.sendStatus(200)
  })

}



module.exports = { getItemsFullGtr, addGuitar, getGuitars, fetchGuitar, guitarToCart };

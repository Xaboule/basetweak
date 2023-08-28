const express = require("express");
const router = express.Router();

const {
  addGuitar,
  getGuitars,
  fetchGuitar,
  getItemsFullGtr,
  guitarToCart,
  fetchTextures,
  fetchGuitarColors,
} = require("./controllers/itemController");
const {
  register,
  loginGet,
  loginPost,
  isUserAuth,
  userInfo,
  editUserInfo,
  deleteUserInfo,
  deleteUserGuitar,
  renameUserGuitar,
} = require("./controllers/userController");
const { getItems, getVariation } = require("./controllers/shopController");

//To shopController
router.get("/items", getItems);
router.get("/itemsall/getvariation", getVariation);

// To itemController
router.get("/itemsall", getItemsFullGtr);
router.post("/items/saveguitar", addGuitar);
router.get("/items/getguitars", getGuitars);
router.get("/items/fetchguitar", fetchGuitar);
router.get("/items/fetchguitarcolors", fetchGuitarColors);
router.get("/items/fetchtextures", fetchTextures);
router.post("/items/saveguitartocart", guitarToCart);

//To userController
router.post("/register", register);
router.post("/login", loginPost);
router.get("/login", loginGet);
router.get("/isUserAuth", isUserAuth);
router.get("/getUserInfo", userInfo);
router.put("/user/edit", editUserInfo);
router.delete("/user/delete", deleteUserInfo);
router.delete("/user/deleteguitar", deleteUserGuitar);
router.put("/user/renameguitar", renameUserGuitar)
module.exports = router;

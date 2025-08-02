const express = require("express");
const ImageKit = require("imagekit");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const productModel = require("../model/product.model");

const router = express.Router();


router.get("/", async (req, res) => {
  const products = await productModel.find();
  res.render("productlist.ejs", { products });
});


router.get("/detail/:id", async (req, res) => {
  const product = await productModel.findById(req.params.id);
  console.log("Image field:", product.image);

  res.render("productDetail.ejs", { product });
});
router.get("/update/:id", async (req, res) => {
  const product = await productModel.findById(req.params.id);
  res.render("productUpdate.ejs", { product });
});


router.post("/update/:id", upload.single("image"), async (req, res) => {
  const { title, description, category, price } = req.body;
  const productId = req.params.id;

  const updateData = {
    title,
    description,
    category,
    price
  };

  
  if (req.file) {
    const imagekit = new ImageKit({
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY,
      urlEndpoint: process.env.URLENDPOINT,
    });

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    });

    updateData.image = result.url;
  }

  await productModel.findByIdAndUpdate(productId, updateData);
  res.redirect(`/products/detail/${productId}`);
})

router.get("/delete/:id", async (req, res) => {
  await productModel.findByIdAndDelete(req.params.id);
  res.redirect("/");
});


router.get("/add", (req, res) => {
  res.render("productForm");
});


router.post("/add", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Image file is required.");
  }

  const { title, description, category, price } = req.body;
  console.log(req.body)
  console.log(process.env.PRIVAT_KEY);
  const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
    urlEndpoint: process.env.URLENDPOINT,
  });

  const result = await imagekit.upload({
    file: req.file.buffer,
    fileName: req.file.originalname,
  });

  const product = await productModel.create({
    title,
    description,
    category,
    price,
    image: result.url,
  });

  res.redirect("/products");
});

module.exports = router;

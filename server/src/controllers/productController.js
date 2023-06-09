const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const {
  productJoi,
  productUpdateJoi,
} = require("../middlewares/joiValidation");

const createProduct = async function (req, res) {
  let body = req.body;

  if (body.productName) body.productName = body.productName.trim();

  const { error, value } = productJoi.validate(body, { abortEarly: false });
  if (error) return res.status(400).json({ message:error.details[0].message.replaceAll('"','') });

  let user = await userModel.findOne({
    _id: req.decodedToken.userId,
    isDeleted: false,
  });
 
  if (!user)
    return res
      .status(404)
      .send({ message: "user does not exist with this id" });
      
      const product = await productModel.findOne({productName:body.productName,isDeleted:false})
      if (product)
    return res
      .status(400)
      .send({ message: "product already exist with this name" });


  req.body.userId = user._id;
  let created = await productModel.create(body);

  return res
    .status(201) 
    .send({ message: "success", data: created });
};
 
//----------------------------------

const getProducts = async function (req, res) {
  let body = req.body;

  const userData = await userModel.findOne({
    _id: req.decodedToken.userId,
    isDeleted: false,
  });
  if (!userData)
    return res
      .status(404)
      .json({ status: false, message: "user does not exist with this id" });

  if (userData.type == "ADMIN") {
    const productData = await productModel.find({ isdeleted: false });
    return res
      .status(200)
      .json({message: "success", data: productData });
  } else {
    const productData = await productModel.find({
      userId: req.decodedToken.userId,
      isDeleted: false,
    });
    return res.status(200).json({ message: "success", data: productData });
  }
};

const getProductByProductId = async function (req, res) {
  const body = req.body;
  const productId = req.params.productId;

  if (!mongoose.isValidObjectId(productId))
    return res.status(400).json({ message: "Invalid product Id" });


  const product = await productModel.findOne({
    _id: productId,
    isDeleted: false,
  });
  if (!product)
    return res
      .status(404)
      .json({ message: "product does not exist with this id" });

  const user = await userModel.findOne({
    _id: req.decodedToken.userId,
    isDeleted: false,
  });
  if (!user) return res.status(404).json({ message: "no user found" });

  if (user.type == "ADMIN") {
    const getProduct = await productModel.findOne(
      { _id: productId },
    );
    return res.status(200).json({ message: "success", data: getProduct });
  } else if (user.type == "VENDOR") {
    if (user._id.toString() != product.userId.toString())
      return res.status(400).json({ message: "you are not authorized" });

    const getProduct = await productModel.findOne(
      { _id: productId }
    );
    return res.status(200).json({ message: "success", data: getProduct });
  }
};




const updateProducts = async function (req, res) {
  const body = req.body;
  const productId = req.params.productId;

  if (!mongoose.isValidObjectId(productId))
    return res.status(400).json({ message: "Invalid product Id" });

  const { error, value } = productUpdateJoi.validate(body, {
    abortEarly: false,
  });
  if (error) return res.status(400).json({message:error.details[0].message.replaceAll('"','') });

  const product = await productModel.findOne({
    _id: productId,
    isDeleted: false,
  });
  if (!product)
    return res
      .status(404)
      .json({ message: "product does not exist with this id" });

  const user = await userModel.findOne({
    _id: req.decodedToken.userId,
    isDeleted: false,
  });
  if (!user) return res.status(404).json({ message: "no user found" });

  if (user.type == "ADMIN") {
    const update = await productModel.findOneAndUpdate(
      { _id: productId },
      { ...body },
      { new: true }
    );
    return res.status(200).json({ message: "updated", data: update });
  } else if (user.type == "VENDOR") {
    if (user._id.toString() != product.userId.toString())
      return res.status(400).json({ message: "you are not authorized" });

    const update = await productModel.findOneAndUpdate(
      { _id: productId },
      { ...body },
      { new: true }
    );
    return res.status(200).json({ message: "updated", data: update });
  }
}


  const deleteProduct = async function (req, res) {
    const body = req.body;
  const productId = req.params.productId;

  if (!mongoose.isValidObjectId(productId))
    return res.status(400).json({ message: "Invalid product Id" });

    const product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!product)
      return res
        .status(404)
        .json({ message: "product does not exist with this id" });
  

        const user = await userModel.findOne({
          _id: req.decodedToken.userId,
          isDeleted: false,
        });
        if (!user) return res.status(404).json({ message: "no user found" });

        if (user.type == "ADMIN") {
          const deleteProduct = await productModel.findOneAndUpdate(
            { _id: productId },
            { isDeleted:true },
            { new: true }
          );
          return res.status(200).json({ message: "deleted", data: deleteProduct });
        } else if (user.type == "VENDOR") {
          if (user._id.toString() != product.userId.toString())
            return res.status(400).json({ message: "you are not authorized" });
      
          const deleteProduct = await productModel.findOneAndUpdate(
            { _id: productId },
            { isDeleted:true },
            { new: true }
          );
          return res.status(200).json({ message: "deleted", data: deleteProduct });
  }
}

module.exports = { createProduct, getProducts,getProductByProductId, updateProducts, deleteProduct };

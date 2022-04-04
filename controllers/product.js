const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const isAuth = require("./isAuth");

const Store = require("./../models/store");
const Category = require("./../models/category");
const Product = require("./../models/product");

router.post('/addCategory', isAuth, async (req, res) => {
    const { categoryName, categoryImage, priority } = req.body;
    const categoryId = mongoose.Types.ObjectId();
    const storeId = Store.findOne({ associatedId: req.account._id })
        .then((store) => {
            const _category = new Category({
                _id: categoryId,
                storeId: store._id,
                categoryName: categoryName,
                categoryImage: categoryImage,
                priority: priority
            })
            _category.save()
                .then(category_created => {
                    return res.status(200).json({
                        status: true,
                        message: category_created,
                    });
                })
        })
        .catch((err) => {
            return res.status(500).json({
                status: false,
                message: err,
            });
        });

})
router.put('/updateCategory/:categoryId', isAuth, async (req, res) => {
    const { categoryName, categoryImage, priority } = req.body;
    const categoryId = req.params.categoryId;
    Category.findById(categoryId)
        .then(category => {
            if (category) {
                category.categoryName = categoryName;
                category.categoryImage = categoryImage;
                category.priority = priority;
                return category.save()
                    .then(category_updated => {
                        return res.status(200).json({
                            status: true,
                            message: category_updated
                        });
                    })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Category not found'
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err
            });
        })


})
router.get('/getCategory/:categoryId', isAuth, async (req, res) => {
    const categoryId = req.params.categoryId;
    Category.findById(categoryId)
        .then(category => {
            if (category) {
                return res.status(200).json({
                    status: true,
                    message: category
                });
            }
            else {
                return res.status(200).json({
                    status: false,
                    message: 'This category is not found'
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err
            });
        })
})
router.delete('/deleteCategory/:categoryId', isAuth, async (req, res) => {
    const categoryId = req.params.categoryId;
    Category.findByIdAndDelete(categoryId)
        .then(category_deleted => {
            return res.status(200).json({ status: true, message: category_deleted });
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err,
            });
        })

})


router.post('/addProduct/:categoryId', isAuth, async (req, res) => {
    const { productName, productImages, price, unitInStock, desclimer, isAgeLimitation } = req.body;
    const productId = mongoose.Types.ObjectId();
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    const _product = new Product({
        _id: productId,
        storeId: category.storeId,
        categoryId: category._id,
        productName: productName,
        productImages: productImages,
        price: price,
        unitInStock: unitInStock,
        desclimer: desclimer,
        isAgeLimitation: isAgeLimitation
    });
    _product.save()
        .then(product_created => {
            return res.status(200).json({ status: true, message: product_created });
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err,
            });
        })
})
router.put('/updateProduct/:productId', isAuth, async (req, res) => {
    const { productName, productImages, price, unitInStock, desclimer, isAgeLimitation } = req.body;
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (product) {
                product.productName = productName;
                product.productImages = productImages;
                product.price = price;
                product.unitInStock = unitInStock;
                product.desclimer = desclimer;
                product.isAgeLimitation = isAgeLimitation;
                product.save()
                    .then(product_updated => {
                        return res.status(200).json({
                            status: true,
                            message: product_updated
                        });
                    })
            }
            else {
                return res.status(200).json({
                    status: false,
                    message: "This Product is not found"
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err
            });
        })

})
router.delete('/deleteProduct/:productId', isAuth, async (req, res) => {
    const productId = req.params.productId;
    Product.findByIdAndDelete(productId)
        .then(product_deleted => {
            return res.status(200).json({ status: true, message: product_deleted });
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err,
            });
        })

})


router.get('/getAllCategory', isAuth, async (req, res) => {
    const accountId = req.account._id;
    const store = await Store.findOne({ associatedId: accountId })
        .then(getStore => {
            const category = Category.find({ storeId: getStore._id })
                .then(getCategories => {
                    return res.status(200).json({ status: true, message: getCategories });
                })
                .catch(err => {
                    return res.status(500).json({
                        status: false,
                        message: err,
                    });
                })
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err,
            });
        })
})
router.get('/getAllProducts', isAuth, async (req, res) => {
    const accountId = req.account._id;
    const store = await Store.findOne({ associatedId: accountId })
        .then(getStore => {
            const products = Product.find({ storeId: getStore._id })
                .then(getProducts => {
                    return res.status(200).json({ status: true, message: getProducts });
                })
                .catch(err => {
                    return res.status(500).json({
                        status: false,
                        message: err,
                    });
                })
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err,
            });
        })
})
router.get('/geProductsByCategoryId/:categoryId', isAuth, async (req, res) => {
    const categoryId = req.params.categoryId;
    const products = Product.find({ categoryId: categoryId })
        .then(getProducts => {
            return res.status(200).json({ status: true, message: getProducts });
        })
        .catch(err => {
            return res.status(500).json({
                status: false,
                message: err,
            });
        })
})


module.exports = router;
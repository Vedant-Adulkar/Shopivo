// Central export file for all models
const User = require("./User");
const Product = require("./Product");
const Category = require("./Category");
const Cart = require("./Cart");
const Order = require("./Order");
const Wishlist = require("./Wishlist");
const Review = require("./Review");
const Address = require("./Address");

module.exports = {
    User,
    Product,
    Category,
    Cart,
    Order,
    Wishlist,
    Review,
    Address,
};

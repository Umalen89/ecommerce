const bodyParser = require('body-parser');
const { check, validationResult, body } = require('express-validator');
const createError = require('http-errors');

const validateSignup = [
    body('user.username').notEmpty().isAlphanumeric(['en-GB']).isLength({min: 6, max: 40}),
    body('user.email').notEmpty().isEmail().isLength({max: 100}),
    body('password').notEmpty().matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/).isLength({ min: 6, max:30}),
    body('pinfo.first_name').notEmpty().isAlpha('en-GB', {ignore: " "}).isLength({min: 2,max: 25}),
    body('pinfo.last_name').notEmpty().isAlpha('en-GB', {ignore: " "}).isLength({min:2, max: 50}),
    body('pinfo.date_of_birth').notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/),
    body('pinfo.phone_number').notEmpty().isMobilePhone(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsarray = errors.mapped();
            return res.status(422).json({ Errors: errorsarray});
        }
        else next();
    }
];

const validateLogin = [
    body('lpassword').notEmpty().isAlphanumeric(['en-GB']).isLength({min: 6, max: 40}),
    body('email').notEmpty().isEmail().isLength({max: 100}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsarray = errors.mapped();
            return res.status(422).json({ Errors: errorsarray});
        }
        else next();
    }
];

const validateUsernameEmail = [
    body('username').notEmpty().isAlphanumeric(['en-GB']).isLength({min: 6, max: 40}),
    body('email').notEmpty().isEmail().isLength({max: 100}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsarray = errors.mapped();
            return res.status(422).json({ Errors: errorsarray});
        }
        else next();
    }
];

const validatePInfo = [
    body('first_name').notEmpty().isAlpha('en-GB', {ignore: " "}).isLength({max: 25}),
    body('last_name').notEmpty().isAlpha('en-GB', {ignore: " "}).isLength({max: 50}),
    body('date_of_birth').notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/),
    body('phone_number').notEmpty().isMobilePhone().isLength({max: 30}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsarray = errors.mapped();
            return res.status(422).json({ Errors: errorsarray});
        }
        else next();
    }
];

const validatePasswords = [
    body('oldpassword').notEmpty().isLength({ min: 6, max:30}),
    body('newpassword').notEmpty().matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/).isLength({ min: 6, max:30}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsarray = errors.mapped();
            return res.status(422).json({ Errors: errorsarray});
        }
        else next();
    }
];

const validateAddress = [
    body('postcode').notEmpty().isPostalCode(['GB']).isLength({max: 15}),
    body('street').notEmpty().isAlphanumeric('en-GB', {ignore: " ,"}).isLength({min: 5, max: 150}),
    body('city').notEmpty().isAlpha('en-GB', {ignore: " -"}).isLength({min: 3, max: 40}),
    body('county').notEmpty().isAlpha('en-GB', {ignore: " -"}).isLength({min: 3, max: 40}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsarray = errors.mapped();
            return res.status(422).json({ Errors: errorsarray});
        }
        else next();
    }
];

const validateCheckout = [
    body('total_price').notEmpty().isNumeric().isFloat({min: 0}).isDecimal().isFloat({ max: 9999.99 }),
    body('del_postcode').notEmpty().isPostalCode(['GB']).isLength({max: 15}),
    body('del_street').notEmpty().isAlphanumeric('en-GB', {ignore: " ,"}).isLength({max: 150}),
    body('del_city').notEmpty().isAlpha('en-GB', {ignore: " -"}).isLength({max: 40}),
    body('del_county').notEmpty().isAlpha('en-GB', {ignore: " -"}).isLength({max: 40}),
];

module.exports = {
    validateSignup,
    validateLogin,
    validateUsernameEmail,
    validatePInfo,
    validatePasswords,
    validateAddress,
    validateCheckout
}
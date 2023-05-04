const authRouter = require('./auth');
const userRouter = require('./user');
const catProdRouter = require('./productcategory')

module.exports = (app, passport) => {
    authRouter(app, passport);
    userRouter(app);
    catProdRouter(app);
}
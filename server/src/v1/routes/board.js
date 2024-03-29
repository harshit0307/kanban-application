const router = require('express').Router()
const { param } = require('express-validator')
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const boardController = require('../controllers/board')

router.post(
    '/',
    tokenHandler.verifyToken,
    boardController.create
)

router.get(
    '/',
    tokenHandler.verifyToken,
    boardController.getAll
)

router.put(
    '/',
    tokenHandler.verifyToken,
    boardController.updatePosition
)

router.get(
    '/favourites',
    tokenHandler.verifyToken,
    boardController.getfavourites
)

router.put(
    '/favourites',
    validation.validate,
    tokenHandler.verifyToken,
    boardController.updateFavouritePosition
)

router.get(
    '/:boardID',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid id')
        }else return Promise.resolve()
    }),
    validation.validate,
    tokenHandler.verifyToken,
    boardController.getOne
)

router.put(
    '/:boardID',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid id')
        }else return Promise.resolve()
    }),
    validation.validate,
    tokenHandler.verifyToken,
    boardController.update
)

router.delete(
    '/:boardID',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid id')
        }else return Promise.resolve()
    }),
    validation.validate,
    tokenHandler.verifyToken,
    boardController.delete
)

module.exports = router
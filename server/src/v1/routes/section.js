const router = require('express').Router({ mergeParams: true })
const { param } = require('express-validator')
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const sectionController = require('../controllers/section')

router.post(
    '/',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid Id')
        }else{
            return Promise.resolve()
        }
    }),
    validation.validate,
    tokenHandler.verifyToken,
    sectionController.create
)

router.put(
    '/:sectionID',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid board Id')
        }else{
            return Promise.resolve()
        }
    }),
    param('sectionID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid section Id')
        }else{
            return Promise.resolve()
        }
    }),
    validation.validate,
    tokenHandler.verifyToken,
    sectionController.update
)

router.delete(
    '/:sectionID',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid board Id')
        }else{
            return Promise.resolve()
        }
    }),
    param('sectionID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid section Id')
        }else{
            return Promise.resolve()
        }
    }),
    validation.validate,
    tokenHandler.verifyToken,
    sectionController.delete
)


module.exports = router
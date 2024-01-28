const router = require('express').Router({ mergeParams: true })
const { param, body } = require('express-validator')
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const taskController = require('../controllers/task')

router.post(
    '/',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid board Id')
        }else{
            return Promise.resolve()
        }
    }),
    body('sectionId').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid section Id')
        }else{
            return Promise.resolve()
        }
    }),
    validation.validate,
    tokenHandler.verifyToken,
    taskController.create
)

router.put(
    '/update-position',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid board Id')
        }else{
            return Promise.resolve()
        }
    }),
    validation.validate,
    tokenHandler.verifyToken,
    taskController.updatePosition
)

router.delete(
    '/:taskID',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid board Id')
        }else{
            return Promise.resolve()
        }
    }),
    param('taskID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid task Id')
        }else{
            return Promise.resolve()
        }
    }),
    validation.validate,
    tokenHandler.verifyToken,
    taskController.delete
)

router.put(
    '/:taskID',
    param('boardID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid board Id')
        }else{
            return Promise.resolve()
        }
    }),
    param('taskID').custom(value => {
        if(!validation.isObjectId(value)){
            return Promise.reject('invalid task Id')
        }else{
            return Promise.resolve()
        }
    }),
    validation.validate,
    tokenHandler.verifyToken,
    taskController.update
)

module.exports = router
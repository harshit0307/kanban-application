const Section = require('../models/section')
const Task = require('../models/task')

exports.create = async (req, res) => {
    const { boardID } = req.params
    try{
        const section = await Section.create({ board: boardID })
        section._doc.task = []
        res.status(201).json(section)
    }catch(err) {
        res.status(500).json(err)
    }
}

exports.update = async (req, res) => {
    const { sectionID } = req.params
    try{
        const section = await Section.findByIdAndUpdate(
            sectionID,
            { $set: req.body }
        )
        section._doc.task = []
        res.status(200).json(section)
    }catch(err) {
        res.status(500).json(err)
    }
}

exports.delete = async (req, res) => {
    const { sectionID } = req.params
    try{
        await Task.deleteMany({ section: sectionID })
        await Section.deleteOne({ _id: sectionID })
        res.status(200).json('deleted')
    }catch(err) {
        res.status(500).json(err)
    }
}
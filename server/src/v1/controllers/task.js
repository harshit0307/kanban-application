const Task = require('../models/task')
const Section = require('../models/section')

exports.create = async (req, res) => {
    const { sectionId } = req.body
    try{
        const section = await Section.findById(sectionId)
        const tasksCount = await Task.find({section: section._id }).count()
        const task = await Task.create({
            section: sectionId,
            position: tasksCount > 0 ? tasksCount : 0
        })
        task._doc.section = section
        res.status(201).json(task)
    }catch(err){
        res.status(500).json(err)
    }
}

exports.update = async (req, res) => {
    const { taskID } = req.params
    try{
        const task = await Task.findByIdAndUpdate(
            taskID,
            { $set: req.body }
        )
        res.status(200).json(task)
    }catch(err) {
        res.status(500).json(err)
    }
}

exports.delete = async (req, res) => {
    const { taskID } = req.params
    try{
        const currentTask = await Task.findById(taskID)
        await Task.deleteOne({ _id: taskID })
        const tasks = await Task.find({ section: currentTask.section }).sort('position')
        for(const key in tasks){
            await Task.findByIdAndUpdate(
                tasks[key]._id,
                { $set: {position: key }}
            )
        }
        res.status(200).json('deleted')
    } catch(err) {
        res.status(500).json(err)
    }
}

exports.updatePosition = async (req, res) => {
    const {
        resourceList,
        destinationList,
        resourceSectionID,
        destinationSectionID
    } = req.body

    const resourceListReverse = resourceList.reverse()
    const destinationListReverse = destinationList.reverse()

    try{
        if(resourceSectionID !== destinationSectionID){
            for(const key in resourceListReverse){
                await Task.findByIdAndUpdate(
                    resourceListReverse[key]._id,
                    {
                        $set: {
                            section: resourceSectionID,
                            position: key
                        }
                    }
                )
            }
        }
        for(const key in destinationListReverse){
            await Task.findByIdAndUpdate(
                destinationListReverse[key]._id,
                {
                    $set: {
                        section: destinationSectionID,
                        position: key
                    }
                }
            )
        }
        res.status(200).json('updated')
    }catch(err){
        res.status(500).json(err)
    }
}

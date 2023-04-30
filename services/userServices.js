const History = require('../models/reportModel')

exports.getExpenses = (req,where) =>{
    return req.user.getExpenses(where)
}

exports.createDownloadHistory = (req,data) =>{
    return req.user.createHistory({url: data})
}

exports.getDownloadHistory = (req,where) =>{
    return req.user.getHistories(where)
}
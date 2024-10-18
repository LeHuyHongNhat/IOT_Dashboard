const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT, TIME_ZONE } = require('../constant');
const { fromZonedTime } = require('date-fns-tz');
const actionHistoryModel = require('../models/actionHistory');
const { convertUtcToVnTime } = require('../util');

async function getActionHistory(req, res) {
    try {
        let { content, searchBy, startTime, endTime, page, pageSize } = req.query;
        let condition = {};

        page = Math.max(Number(page) || PAGE_DEFAULT, 1);
        pageSize = Math.max(Number(pageSize) || PAGE_SIZE_DEFAULT, 1);

        const pagination = {
            skip: (page - 1) * pageSize,
            take: pageSize,
        };

        searchBy ||= 'ALL';
        if (['ALL', 'FAN', 'LED', 'AIR_CONDITIONER'].includes(searchBy)) {
            if (searchBy !== 'ALL') condition.device = searchBy
        } else {
            res.status(400).json({
                message: 'searchBy must be one of the following parameters [ALL,AIR_CONDITIONER, FAN, LED]',
            });
            return;
        }

        if (startTime && endTime) {
            condition.createdAt = {
                gte: fromZonedTime(startTime, TIME_ZONE),
                lte: fromZonedTime(endTime, TIME_ZONE)
            }
        }

        let [data, totalCount] = await Promise.all([
            await actionHistoryModel.findActionHistoryByContidion(condition, pagination),
            await actionHistoryModel.countNumberActionHistoryByCondition(condition)
        ])

        if (content) {
            data = data.filter(d => {
                const time = convertUtcToVnTime(d.createdAt)
                return time.includes(content.trim())
            })
        }

        res.status(200).json({
            data,
            meta: {
                page,
                pageSize,
                totalCount
            }
        })
    } catch (error) {
        console.log("🚀 ~ getActionHistory ~ error:", error)
        res.status(500).json({
            message: 'Internal Server Error !',
            error: error.message
        })
    }
}


async function getOnLed(req, res) {
    try {
        const abc = await actionHistoryModel.countLedOnByCondition();
        console.log(abc);
        res.status(200).json({
            message: 'Data successfully!',
            totalCount: abc
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error !',
            error
        })
    }
}


async function getOffFan(req, res) {
    try {
        const xxx = await actionHistoryModel.countFanOffByCondition();
        console.log(xxx);
        res.status(200).json({
            message: 'Data successfully!',
            totalCount: xxx
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error !',
            error
        })
    }
}

module.exports = {
    getActionHistory,
    getOnLed,
    getOffFan
}
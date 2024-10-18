const { Device, Action } = require('@prisma/client');
const prisma = require('./db-client')

const createActionHistory = async (data) =>{
    return await prisma.actionHistory.create({
        data: data
    })
}

const deleteOldRecords = async () => {
    await prisma.$executeRaw `
                                DELETE FROM \`action_history\`
                                WHERE \`id\` NOT IN (
                                    SELECT \`id\` FROM (
                                        SELECT \`id\` FROM \`action_history\`
                                        ORDER BY \`createdAt\` DESC
                                        LIMIT 100
                                    ) AS subquery
                                );
                            `;
}

const findActionHistoryByContidion = async (condition, pagination)=>{
    return await prisma.actionHistory.findMany({
        where: condition,
        ...pagination,
    })
}

const countNumberActionHistoryByCondition = async (condition) =>{
    return await prisma.actionHistory.count({
        where: condition
    })
}

const countLedOnByCondition = async () =>{
    return await prisma.actionHistory.count({
        where: {
            device : Device.LED,
            action: Action.ON
        }
    })
}

const countFanOffByCondition = async () =>{
    return await prisma.actionHistory.count({
        where: {
            device : Device.FAN,
            action: Action.OFF
        }
    })
}

module.exports = {
    deleteOldRecords,
    findActionHistoryByContidion,
    countNumberActionHistoryByCondition,
    createActionHistory,
    countLedOnByCondition,
    countFanOffByCondition
}
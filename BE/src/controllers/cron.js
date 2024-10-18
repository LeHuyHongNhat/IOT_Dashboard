const cron = require('node-cron');
const dataSensorModel = require('../models/dataSensor');

const scheduleCronJobs = async () => {
    cron.schedule('*/3 * * * *', async () => {
        try {
            await dataSensorModel.deleteOldRecords();
            console.log('Chạy cron job mỗi 3 phút');
        } catch (error) {
            console.error('Lỗi khi chạy cron job:', error);
        }
    });
};


module.exports = scheduleCronJobs;
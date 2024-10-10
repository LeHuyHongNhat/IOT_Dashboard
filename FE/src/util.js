export const createQueryString = (filter, page) => {
    let queryString = '?';
    Object.keys(filter).forEach((query) => {
        if (filter[query]) queryString += `${query}=${filter[query]}&`
    })
    Object.keys(page).forEach((query) => {
        if (page[query]) queryString += `${query}=${page[query]}&`
    })
    return queryString.slice(0,-1);
}

export const mappingDataSensor = (datas) => {
    return datas.map((data) => {
        return {
            id: data.id,
            temperature: data.temperature,
            humidity: data.humidity,
            light: data.light,
            time: convertUtcToVnTime(data.createdAt)
        }
    })
}

export const mappingActionHistory = (datas) =>{
    return datas.map((data)=>{
        return {
            id: data.id,
            device: data.device,
            action: data.action,
            time: convertUtcToVnTime(data.createdAt)
        }
    })
}

export const convertUtcToVnTime = (time) => {
    const date = new Date(time);
    return new Intl.DateTimeFormat('vi-VN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        timeZone: 'Asia/Ho_Chi_Minh' 
    }).format(date);
}
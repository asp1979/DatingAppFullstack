// this function determines how the timestamp should be displayed
// if message is older than 24 hours show day/month otherwise show hour/minutes
export const messageTimestamp = (date) => {
    date = Date.parse(date);
    const dayInMs = 86400000;
    if((Date.now() - date) < dayInMs) {
        return new Date(date).toISOString().substring(11,16);
    } else {
        return new Date(date).toDateString().substring(4,10);
    }
}
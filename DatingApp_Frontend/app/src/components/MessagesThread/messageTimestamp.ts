// this function determines how the timestamp should be displayed
// if message is older than 24 hours show day/month otherwise show hour/minutes
export const messageTimestamp = (date: string) => {
    const unixDate: number = Date.parse(date);
    const dayInMs: number = 86400000;
    if((Date.now() - unixDate) < dayInMs) {
        return new Date(unixDate).toISOString().substring(11,16);
    } else {
        return new Date(unixDate).toDateString().substring(4,10);
    }
}
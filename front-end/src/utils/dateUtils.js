export const getVietnameseDate = (date, hideWeekday = false) => {
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };

    if (!hideWeekday) {
        options.weekday = "long";
    }

    let vietnameseDate = new Date(date).toLocaleDateString("vi-VN", options)
    return vietnameseDate
}
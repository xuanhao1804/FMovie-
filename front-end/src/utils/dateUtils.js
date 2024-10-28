export const getVietnameseDate = (date) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };
    let vietnameseDate = new Date(date).toLocaleDateString("vi-VN", options)
    return vietnameseDate
}
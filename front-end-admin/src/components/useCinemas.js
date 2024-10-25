import React from 'react';

const useCinemas = () => {
    const [cinemas, setCinemas] = React.useState([]);

    React.useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const response = await fetch('http://localhost:9999/cinema/get-all');
                const result = await response.json(); // Lưu ý rằng bạn cần đặt tên cho kết quả là `result`

                // Kiểm tra dữ liệu nhận được
                console.log(result); // Kiểm tra dữ liệu
                if (Array.isArray(result.data)) { // Kiểm tra xem result.data có phải là mảng không
                    setCinemas(result.data); // Set cinemas bằng data
                } else {
                    console.error("Dữ liệu không phải là mảng:", result.data);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        fetchCinemas();
    }, []);

    return cinemas;
};

export default useCinemas;

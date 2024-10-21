const db = require("../models");
const PayOS = require("@payos/node");
const payOS = new PayOS(
    "64da5e12-cf65-405d-918a-7fe87a176ca5",
    "b91ff654-c857-4367-a7ae-d5dfe083e163",
    "16dbfd121db61219934e9460d5c94e16def9d16c18b9f49b8ef76ce116fb6cec"
);
// const CreatePayment = async (req, res) => {
//     try {
//         //const { orderCode, amount, description, items, cancelUrl, returnUrl } = req.body;
//         const body = {
//             orderCode: 123456789,
//             amount: 2000,
//             description: "Thanh toan don hang",
//             items: [
//                 {
//                     name: "Mi tom hao hao",
//                     quantity: 1,
//                     price: 2000,
//                 },
//             ],
//             cancelUrl: "http://localhost:3000/cancel.html",
//             returnUrl: "http://localhost:3000/success.html",
//         };
//         const paymentLinkRes = await payOS.createPaymentLink(body);
//         return res.status(200).json({ checkoutUrl: paymentLinkRes.checkoutUrl });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Lỗi hệ thống Back-end"
//         });
//     }
// };
const CreatePayment = async (req, res) => {
    try {
        const { total_price, createdBy, showtime, room, seats } = req.body;
        // const newBooking = new db.booking({
        //     total_price,
        //     status: "pending",
        //     createdBy,
        //     showtime,
        //     room,
        //     seats
        // });


        // const savedBooking = await newBooking.save();
        // setTimeout(async () => {
        //     const bookingToUpdate = await db.booking.findById(savedBooking._id);
        //     if (bookingToUpdate && bookingToUpdate.status !== 'paid') {
        //         bookingToUpdate.status = 'cancelled';
        //         await bookingToUpdate.save();
        //         console.log(`Booking ${savedBooking._id} đã bị hủy sau 10 phút.`);
        //     }
        // }, 60000);
        // return res.status(200).json({ savedBooking })
        //600000 10p    
        const body = {
            orderCode: 12121,
            amount: 2000,
            description: "Thanh toán vé xem phim",
            cancelUrl: "http://localhost:3000/cancel.html",
            returnUrl: "http://localhost:3000/success.html",
        };
        const paymentLinkRes = await payOS.createPaymentLink(body);


        // Trả về JSON bao gồm URL của mã QR và thông tin khác
        return res.status(200).json({
            checkoutUrl: paymentLinkRes.qrCode,
            checkoutlink: paymentLinkRes.checkoutUrl,
            bankAccount: paymentLinkRes.accountNumber,
            bankName: "Ngân hàng TMCP Quân đội",
            amount: 2000,
            accountHolder: paymentLinkRes.accountName
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const Deletepayment = async (req, res) => {
    try {
        const cancelledPaymentLink = await payOS.cancelPaymentLink(1122233);
        return res.status(200).json(cancelledPaymentLink);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const receivehook = async (req, res) => {
    try {
        // const {
        //     data: {
        //         orderCode,
        //         amount,
        //         description,
        //         code, // Mã trạng thái thanh toán
        //     }
        // } = req.body;
        // if (code === "00" && db.booking.findById(orderCode).status != "cancelled") {
        //     await db.booking.findByIdAndUpdate(orderCode, { status: 'paid' });
        // }
        console.log(req.body)
        return res.json();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};



const BookingController = {
    CreatePayment,
    Deletepayment,
    receivehook
};

module.exports = BookingController;



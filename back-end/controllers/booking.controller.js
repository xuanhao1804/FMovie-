const db = require("../models");
const PayOS = require("@payos/node");
const payOS = new PayOS(
    "64da5e12-cf65-405d-918a-7fe87a176ca5",
    "b91ff654-c857-4367-a7ae-d5dfe083e163",
    "16dbfd121db61219934e9460d5c94e16def9d16c18b9f49b8ef76ce116fb6cec"
);
const CreatePayment = async (req, res) => {
    try {
        const { total_price, createdBy, showtime, room, seats } = req.body;
        const orderCode = Date.now();
        const newBooking = new db.booking({
            total_price,
            status: "pending",
            createdBy,
            showtime,
            room,
            orderCode: orderCode,
            seats
        });
        const savedBooking = await newBooking.save();

        setTimeout(async () => {
            const bookingToUpdate = await db.booking.findById(savedBooking._id);
            if (bookingToUpdate && bookingToUpdate.status !== 'paid') {
                bookingToUpdate.status = 'cancelled';
                await bookingToUpdate.save();
                console.log(`Booking ${savedBooking._id} đã bị hủy sau 10 phút.`);
            }
        }, 10000);
        // return res.status(200).json({ savedBooking })
        // //600000 10p    
        const body = {
            orderCode: orderCode,
            amount: total_price,
            description: orderCode,
            cancelUrl: "http://localhost:3000",
            returnUrl: "http://localhost:3000",
        };
        const paymentLinkRes = await payOS.createPaymentLink(body);


        // Trả về JSON bao gồm URL của mã QR và thông tin khác
        return res.status(200).json({
            checkoutUrl: paymentLinkRes.qrCode,
            checkoutlink: paymentLinkRes.checkoutUrl,
            bankAccount: paymentLinkRes.accountNumber,
            bankName: "Ngân hàng TMCP Quân đội",
            amount: total_price,
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
const getBooking = async (req, res) => {
    try {
        const id = req.body;
        const booking = await db.booking.findById(id)
        return res.status(200).json(booking);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const receivehook = async (req, res) => {
    try {
        const { data } = req.body
        const {
            data: {
                orderCode,
                code, // Mã trạng thái thanh toán
            }
        } = req.body;
        const booking = await db.booking.findOne({ orderCode });
        // Check if the booking exists and its status
        if (booking && booking.status !== "cancelled") {
            if (code === "00") {
                // Update status to 'paid'
                await db.booking.findOneAndUpdate(
                    { orderCode },
                    { status: 'paid' }
                );
            }
        }
        const updatedBooking = await db.booking.findOneAndUpdate(
            { orderCode: orderCode },
            {
                $set: {
                    transaction: {
                        accountNumber: data.accountNumber,
                        amount: data.amount,
                        description: data.description,
                        reference: data.reference,
                        transactionDateTime: data.transactionDateTime,
                        virtualAccountNumber: data.virtualAccountNumber || '',
                        counterAccountBankId: data.counterAccountBankId,
                        counterAccountBankName: data.counterAccountBankName || '',
                        counterAccountName: data.counterAccountName,
                        counterAccountNumber: data.counterAccountNumber,
                        virtualAccountName: data.virtualAccountName || '',
                        currency: data.currency,
                        paymentLinkId: data.paymentLinkId,
                        code: data.code,
                        desc: data.desc
                    }
                }
            },
            { new: true }
        );
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
    receivehook,
    getBooking
};

module.exports = BookingController;
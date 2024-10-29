const db = require("../models");
const server = require("../server");
const PayOS = require("@payos/node");
const payOS = new PayOS(
    "64da5e12-cf65-405d-918a-7fe87a176ca5",
    "b91ff654-c857-4367-a7ae-d5dfe083e163",
    "16dbfd121db61219934e9460d5c94e16def9d16c18b9f49b8ef76ce116fb6cec"
);

const CreatePayment = async (req, res) => {
    try {
        const { total_price, createdBy, room, showtime, seats, popcorns } = req.body;
        const orderCode = Date.now();

        const newBooking = new db.booking({
            total_price,
            status: "pending",
            createdBy,
            room,
            showtime,
            seats,
            popcorns,
            orderCode: orderCode,
        });
        const savedBooking = await newBooking.save();


        setTimeout(async () => {
            const bookingToUpdate = await db.booking.findById(savedBooking._id);
            if (bookingToUpdate && bookingToUpdate.status !== 'paid') {
                await payOS.cancelPaymentLink(savedBooking.orderCode);
                bookingToUpdate.status = 'cancelled';
                await bookingToUpdate.save();
                console.log(`Booking ${savedBooking._id} đã bị hủy sau 10 phút.`);
            }
        }, 600000);

        // Create payment link
        const paymentLinkBody = {
            orderCode: orderCode,
            amount: total_price,
            description: orderCode.toString(),
            cancelUrl: "http://localhost:3000",
            returnUrl: "http://localhost:3000",
        };
        const paymentLinkRes = await payOS.createPaymentLink(paymentLinkBody);

        return res.status(200).json({
            checkoutUrl: paymentLinkRes.qrCode,
            checkoutlink: paymentLinkRes.checkoutUrl,
            bankAccount: paymentLinkRes.accountNumber,
            bankName: "Ngân hàng TMCP Quân đội",
            amount: total_price,
            accountHolder: paymentLinkRes.accountName
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const DeletePayment = async (req, res) => {
    try {
        const cancelledPaymentLink = await payOS.cancelPaymentLink(1122233);
        return res.status(200).json(cancelledPaymentLink);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const getBooking = async (req, res) => {
    try {
        const id = req.body;
        const booking = await db.booking.findById(id);
        return res.status(200).json(booking);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const receiveHook = async (req, res) => {
    try {
        const { data } = req.body;
        const { orderCode, code } = data;

        const booking = await db.booking.findOne({ orderCode: orderCode });

        if (booking && booking.status !== "cancelled") {
            if (code === "00") {
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
        console.log(updatedBooking)
        server.io.emit("paymentVerify", updatedBooking);
        return res.status(200).json({});
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const getBookedSeats = async (req, res) => {
    try {
        const { room, showtime } = req.body;
        const bookings = await db.booking.find({
            room: room,
            showtime: showtime,
            status: { $in: ["paid", "pending"] }
        }).select("room showtime status seats")
        const bookedSeats = bookings.flatMap(item =>
            item.seats.map(seat => ({
                area: seat.area,
                position: seat.position
            }))
        );
        return res.status(200).json({
            status: 200,
            data: bookedSeats
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const getUserBookedHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const bookings = await db.booking.find({
            createdBy: userId
        }).select("-transaction").populate({
            path: "room",
            select: "-showtimes -areas"
        }).populate({
            path: "showtime",
            populate: {
                path: "movie",
                select: "name"
            }
        }).populate({
            path: "popcorns.popcorn",
            select: "name"
        })
        return res.status(200).json({
            status: 200,
            data: bookings
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const BookingController = {
    CreatePayment,
    DeletePayment,
    receiveHook,
    getBooking,
    getBookedSeats,
    getUserBookedHistory
};
module.exports = BookingController;
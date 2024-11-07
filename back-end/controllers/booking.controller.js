const db = require("../models");
const server = require("../server");
const PayOS = require("@payos/node");
const payOS = new PayOS(
    "64da5e12-cf65-405d-918a-7fe87a176ca5",
    "b91ff654-c857-4367-a7ae-d5dfe083e163",
    "16dbfd121db61219934e9460d5c94e16def9d16c18b9f49b8ef76ce116fb6cec"
);
const nodemailer = require("nodemailer");
const CreatePayment = async (req, res) => {
    try {
        const { total_price, createdBy, room, showtime, seats, popcorns } = req.body;
        const bookedSeats = await findBookedSeats(room, showtime);
        const checkSeats = seats.filter(bookingSeat =>
            bookedSeats.some(bookedSeat =>
                bookingSeat.area === bookedSeat.area && bookingSeat.position === bookedSeat.position
            )
        );
        if (checkSeats.length > 0) {
            return res.status(409).json({
                status: 409,
                messgae: "Ghế đã được đặt trước, vui lòng chọn ghế khác"
            });
        } else {
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
                    //await payOS.cancelPaymentLink(savedBooking.orderCode);
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

        }
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
                const booking = await db.booking.findOne({ orderCode: orderCode })
                    .populate({
                        path: 'showtime',
                        populate: {
                            path: 'movie',
                        }
                    })
                    .populate({ path: 'createdBy', select: 'fullname email' })
                    .populate({ path: 'room', select: '-showtimes -areas' })
                    .populate({ path: 'popcorns.popcorn' })
                    .exec();
                const cinema = await db.cinema.findOne({ rooms: booking.room._id })
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "minhvhhe170320@fpt.edu.vn",
                        pass: "rbwj eril yswz hxzw",
                    },
                });

                const info = await transporter.sendMail({
                    from: `"MovieBooking 🎬" <minhvhhe170320@fpt.edu.vn>`,
                    to: booking?.createdBy.email,
                    subject: `Xác nhận đặt vé thành công - ${booking?.showtime.movie.name}`,
                    text: `Xin chào ${booking?.createdBy.fullname},

        Chúng tôi xin thông báo rằng bạn đã đặt vé xem phim thành công tại MovieBooking!
        Dưới đây là thông tin chi tiết về vé của bạn:

        Phim: ${booking?.showtime.movie.name}
        Đạo diễn: ${booking?.showtime?.movie.director}
        Diễn viên: ${booking?.showtime.movie.actors.join(", ")}
        Thể loại: ${booking?.showtime.movie.genres.join(", ")}
        Thời lượng: ${booking?.showtime.movie.duration} phút
        Hạng tuổi: ${booking?.showtime.movie.limit}
        Suất chiếu: ${booking?.showtime.startAt.date.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })} lúc ${booking?.showtime?.startAt?.time}
        Rạp: ${cinema?.name}
        Phòng: ${booking?.room.name}
        Ghế: ${booking?.seats.map(seat => `Khu vực ${seat.area} - Vị trí ${seat.position} ${seat.isVip ? "(VIP)" : ""}`).join(", ")}
        Mã đặt vé: ${booking?.orderCode}
        Chúc bạn xem phim vui vẻ!
        Trân trọng,
        Đội ngũ MovieBooking

        P.S. Nếu bạn không yêu cầu đặt vé này, vui lòng bỏ qua email này.

        © 2024 MovieBooking. Bảo lưu mọi quyền.`,
                    html: `<p>Xin chào <strong>${booking?.createdBy.fullname}</strong>,</p>
                   <p>Chúng tôi xin thông báo rằng bạn đã đặt vé xem phim thành công tại <strong>MovieBooking</strong>!</p>
                   <p><strong>Thông tin chi tiết vé:</strong></p>
                   <ul>
                       <li><strong>Phim:</strong> ${booking?.showtime.movie.name}</li>
                       <li><strong>Đạo diễn:</strong> ${booking?.showtime.movie.director}</li>
                       <li><strong>Diễn viên:</strong> ${booking?.showtime.movie.actors.join(", ")}</li>
                       <li><strong>Thể loại:</strong> ${booking?.showtime.movie.genres.join(", ")}</li>
                       <li><strong>Thời lượng:</strong> ${booking?.showtime.movie.duration} phút</li>
                       <li><strong>Hạng tuổi:</strong> ${booking?.showtime.movie.limit}</li>
                   </ul>
                   <p><strong>Thông tin suất chiếu:</strong></p>
                   <ul>
                       <li><strong>Suất chiếu:</strong> ${booking?.showtime.startAt.date.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })} lúc ${booking?.showtime.startAt.time}</li>
                       <li><strong>Rạp:</strong> ${booking?.room.name}</li>
                       <li><strong>Ghế:</strong> ${booking?.seats.map(seat => `Khu vực ${seat.area} - Vị trí ${seat.position} ${seat.isVip ? "(VIP)" : ""}`).join(", ")}</li>
                   </ul>

                   <p><strong>Mã đặt vé:</strong> ${booking?.orderCode}</p>
                   <p>Chúc bạn xem phim vui vẻ!</p>
                   <p>Trân trọng,<br>Đội ngũ MovieBooking</p>
                   <p>P.S. Nếu bạn không yêu cầu đặt vé này, vui lòng bỏ qua email này.</p>
                   <p>© 2024 MovieBooking. Bảo lưu mọi quyền.</p>`,
                });

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
        const bookedSeats = await findBookedSeats(room, showtime)
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
const GetAllBookingAdmin = async (req, res) => {
    try {
        const response = await db.booking.find({})
            .populate({ path: "createdBy", select: "fullname" })
        return res.status(200).json(response)

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
        }).sort({ createdAt: -1 }).limit(10)
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

const getUserTicket = async (req, res) => {
    try {
        const { orderCode } = req.body;
        let booking = await db.booking.findOne({
            orderCode: orderCode,
        }).select("status updatedAt")
        if (booking) {
            if (booking.status === "cancelled") {
                return res.status(400).json({
                    status: 400,
                    message: "Đơn đã bị hủy"
                });
            } else {
                if (booking.status === "end") {
                    let d = new Date(booking.updatedAt);
                    return res.status(400).json({
                        status: 400,
                        message: "Vé đã được lấy vào lúc: " + [d.getMonth() + 1,
                        d.getDate(), d.getFullYear()].join('/') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':')
                    });
                } else {
                    booking.status = "end"
                    await booking.save()
                    return res.status(404).json({
                        status: 201,
                        message: "Xác nhận thành công. Đang xuất vé ..."
                    });
                }
            }
        } else {
            return res.status(404).json({
                status: 404,
                message: "Không tìm thấy đơn"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const findBookedSeats = async (room, showtime) => {
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
    return bookedSeats
}

const getTotalBookingPrice = async (req, res) => {
    try {
        total_price = 0;
        const bookings = await db.booking.find({}).populate({
            path: 'popcorns._id',
        })
        bookings.forEach(booking => {
            total_price += booking.total_price
            if (booking.popcorns && booking.popcorns.length > 0) {
                booking.popcorns.forEach(popcorn => {
                    if (popcorn._id && popcorn._id.price) {
                        total_price += popcorn._id.price * popcorn.quantity;
                    }
                });
            }
        });

        res.status(200).json({ total_price });
    }
    catch (error) {
        res.status(500).json({ message: "Error calculating total booking price", error });
    }
}
const BookingController = {
    CreatePayment,
    DeletePayment,
    receiveHook,
    getBooking,
    GetAllBookingAdmin,
    getBookedSeats,
    getUserBookedHistory,
    getUserTicket,
    getTotalBookingPrice,
};

module.exports = BookingController;
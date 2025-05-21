const Client = require('../models/Client');
const BusinessOwner = require('../models/BusinessOwner');
const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const SaleItem = require('../models/SaleItem'); 
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');

exports.getUserDistribution = asyncHandler(async (req, res, next) => {
    const clientCount = await Client.countDocuments();
    const businessOwnerCount = await BusinessOwner.countDocuments();
    const adminCount = await Admin.countDocuments();

    res.status(200).json({
        success: true,
        data: {
            clients: clientCount,
            businessOwners: businessOwnerCount,
            admins: adminCount,
        },
    });
});

exports.getBookingSummary = asyncHandler(async (req, res, next) => {
    const pending = await Booking.countDocuments({ status: 'pending' });
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const completed = await Booking.countDocuments({ status: 'completed' });
    const cancelled = await Booking.countDocuments({ status: 'cancelled' });

    res.status(200).json({
        success: true,
        data: {
            statusCounts: { pending, confirmed, completed, cancelled },
        },
    });
});

exports.getSalesOverview = asyncHandler(async (req, res, next) => {
    const salesByMonth = await SaleItem.aggregate([
        { $match: { isSold: true } }, 
        {
            $group: {
                _id: {
                    year: { $year: "$updatedAt" }, 
                    month: { $month: "$updatedAt" }
                },
                totalSales: { $sum: "$price" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 } 
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const labels = salesByMonth.map(item => `${monthNames[item._id.month - 1]} ${item._id.year}`);
    const data = salesByMonth.map(item => item.totalSales);

    res.status(200).json({
        success: true,
        data: {
            labels,
            data,
            raw: salesByMonth 
        },
    });
});
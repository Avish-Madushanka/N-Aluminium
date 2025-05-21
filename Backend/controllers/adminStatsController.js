const Client = require('../models/Client');
const BusinessOwner = require('../models/BusinessOwner');
const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const SaleItem = require('../models/SaleItem'); // Assuming SaleItem is used for sales
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user distribution (clients, business owners, admins)
// @route   GET /api/admin/stats/user-distribution
// @access  Private (Admin)
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

// @desc    Get booking summary (counts by status)
// @route   GET /api/admin/stats/booking-summary
// @access  Private (Admin)
exports.getBookingSummary = asyncHandler(async (req, res, next) => {
    const pending = await Booking.countDocuments({ status: 'pending' });
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const completed = await Booking.countDocuments({ status: 'completed' });
    const cancelled = await Booking.countDocuments({ status: 'cancelled' });

    // Optional: Add booking trends (e.g., bookings in the last 7 days)
    // const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    // const recentBookingsCount = await Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.status(200).json({
        success: true,
        data: {
            statusCounts: { pending, confirmed, completed, cancelled },
            // recentCount: recentBookingsCount, // Example if you add trends
        },
    });
});

// @desc    Get sales overview (e.g., monthly sales from SaleItems)
// @route   GET /api/admin/stats/sales-overview
// @access  Private (Admin)
exports.getSalesOverview = asyncHandler(async (req, res, next) => {
    // This aggregation assumes 'SaleItem' has a 'price' and 'updatedAt' is relevant
    // when 'isSold' becomes true.
    // You might need to adjust the date field used for grouping (e.g., a specific 'soldAt' date).
    const salesByMonth = await SaleItem.aggregate([
        { $match: { isSold: true } }, // Only consider sold items
        {
            $group: {
                _id: {
                    year: { $year: "$updatedAt" }, // Or 'createdAt' or a dedicated 'soldAt' field
                    month: { $month: "$updatedAt" }
                },
                totalSales: { $sum: "$price" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 } // Get last 12 months of sales data, for example
    ]);

    // Format data for chart.js (labels and data arrays)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const labels = salesByMonth.map(item => `${monthNames[item._id.month - 1]} ${item._id.year}`);
    const data = salesByMonth.map(item => item.totalSales);

    res.status(200).json({
        success: true,
        data: {
            labels,
            data,
            raw: salesByMonth // Optionally send raw aggregated data
        },
    });
});
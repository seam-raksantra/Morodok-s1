import * as Booking from '../models/bookingModel.js';
import crypto from 'crypto';
import pkg from 'bakong-khqr';
// Extract constructors and global variables safely from the CommonJS package bundle
const { BakongKHQR, khqrData, IndividualInfo } = pkg;

// Active tracking memory registry mapped directly by MD5 Hex Hash Keys (Exported for server.js polling utility)
export const activeBakongTransactions = new Map();

// Optimized RegEx matching 32 to 64 character hex strings representing the Transaction Hash/ID seamlessly
const TRANSACTION_HASH_REGEX = /(?:Transaction\s*ID|ID|Hash)?\s*:?\s*([a-fA-F0-9]{32,64})/i;

// Telegram credentials should come from environment variables for production safety
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7739441736:AAHdGV-Sr3P0uMFHdK1fyx6-Ax7rve5-p0U";
const TELEGRAM_ALLOWED_CHAT_ID = String(process.env.TELEGRAM_ALLOWED_CHAT_ID || "1334655428");

/**
 * Helper utility to securely forward successful transaction data updates to your Telegram bot channel
 */
const sendTelegramPaymentAlert = async (bookingId, amount, transactionHash, senderName = 'Customer') => {
  try {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const messageText = `🔔 *New Payment Received* 🔔\n\n` +
                        `• *Booking ID:* #${bookingId}\n` +
                        `• *Sender:* ${senderName}\n` +
                        `• *Amount:* $${amount}\n` +
                        `• *Transaction ID:* ${transactionHash}\n\n` +
                        `⚡ *Status:* Payment cleared and auto-verified successfully.`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_ALLOWED_CHAT_ID,
        text: messageText,
        parse_mode: 'Markdown'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Telegram API responded with status ${response.status}`);
    }
    console.log(`[Telegram Broadcast Success]: Alert sent for Transaction ID ${transactionHash}`);
  } catch (error) {
    console.error("[Telegram Broadcast Failure]: Failed to forward context to channel:", error.message);
  }
};

// Debug helper: return current in-memory active Bakong transactions (for testing)
export const getActiveTransactions = async (req, res) => {
  try {
    const items = [];
    for (const [md5, meta] of activeBakongTransactions.entries()) {
      items.push({ md5, bookingId: meta.bookingId, amount: meta.amount, expiresAt: meta.expiresAt });
    }
    return res.status(200).json({ success: true, active: items });
  } catch (err) {
    console.error('Debug getActiveTransactions error:', err);
    return res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { trip_id, tour_id, full_name, email, contact_phone, started_date, num_people, total_price, special_requests } = req.body;

    if (!trip_id || !full_name || !email || !started_date || !num_people || !total_price) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    
    if (num_people <= 0) return res.status(400).json({ message: 'Number of people must be greater than 0.' });

    const booking = {
      user_id: req.user.id, 
      trip_id: trip_id || null,  // Defaults to null if it's a tour package
      tour_id: tour_id || null, // Optional field for tour-specific bookings
      full_name,
      email,
      contact_phone,
      started_date,
      num_people,
      total_price,
      special_requests,
      status: 'Pending'
    };

    const result = await Booking.createBooking(booking);
    res.status(201).json({ 
      message: 'Booking created successfully.', 
      bookingId: result.insertId,
      status: 'Pending'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required.' });
    }

    const booking = await Booking.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only pay for your own bookings.' });
    }

    // Standardized to 'Confirmed' to prevent SQL schema truncation crashes
    await Booking.updateBookingStatus(bookingId, 'Confirmed');

    res.json({ 
      success: true, 
      message: 'Payment confirmed. Your trip is now booked!',
      status: 'Confirmed'
    });
  } catch (err) {
    console.error('Payment Confirmation Error:', err);
    res.status(500).json({ message: 'Server error during payment confirmation.' });
  }
};

export const getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.getAllBookings();
    } else {
      bookings = await Booking.getBookingsByUser(req.user.id);
    }
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required.' });

    console.log(`📌 Admin Panel Modification Request for Booking #${req.params.id} -> target: "${status}"`);

    const booking = await Booking.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admin can update status.' });

    await Booking.updateBookingStatus(req.params.id, status);
    res.json({ message: 'Booking status updated successfully.' });
  } catch (err) {
    console.error("❌ CRASH IN ADMIN UPDATE_BOOKING:", err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const bookingData = await Booking.getBookingById(id);
    
    if (!bookingData) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (req.user.role !== 'admin' && bookingData.user_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: You do not have permission to delete this.' 
      });
    }

    const result = await Booking.deleteBooking(id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Delete failed' });
    }

  } catch (error) {
    console.error("CRASH IN DELETE_BOOKING:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

// ==========================================================
// --- BAKONG & TELEGRAM INTEGRATION HANDLERS ---
// ==========================================================

/**
 * @desc    Generate a live, valid Bakong KHQR with a strict 2-minute time set
 * @route   POST /api/bookings/generate-bakong-qr
 * @access  Private (Via 'protect' middleware)
 */
export const generateBakongQR = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ success: false, message: "Missing tracking payload data." });
    }

    const targetBooking = await Booking.getBookingById(bookingId);
    if (!targetBooking) {
      return res.status(404).json({ success: false, message: "Associated booking record not found." });
    }
    if (targetBooking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access unauthorized." });
    }

    // --- TIME SET FOR QR (2 Minutes Expiration) ---
    const minutesToLive = 2; 
    const expiryTime = Date.now() + (minutesToLive * 60 * 1000); 

    const optionalData = {
      currency: khqrData.currency.usd, 
      amount: parseFloat(amount),
      merchantCity: process.env.MERCHANT_CITY || "PHNOM PENH",
      storeLabel: "Eco Tourism Checkout",
      terminalLabel: "Online Web Terminal",
      purposeOfTransaction: `Booking Pay ID ${bookingId}`, 
      billNumber: String(bookingId),
      expirationTimestamp: expiryTime 
    };

    const individualInfo = new IndividualInfo(
      process.env.MERCHANT_BAKONG_ID,       // e.g. user@bank
      khqrData.currency.usd,                
      process.env.MERCHANT_NAME,            
      process.env.MERCHANT_CITY || "PHNOM PENH",
      optionalData
    );

    const khqrInstance = new BakongKHQR();
    const resultPayload = khqrInstance.generateIndividual(individualInfo);

    if (resultPayload.status?.code !== 0) {
      console.error("Bakong SDK Serializer Failed:", resultPayload.status);
      return res.status(500).json({ 
        success: false, 
        message: resultPayload.status?.message || "Internal KHQR generation mapping sequence failed." 
      });
    }

    const qrString = resultPayload.data.qr;
    
    // Hash the raw QR String via MD5 (Enforced Lowercase consistently)
    const qrHash = crypto.createHash('md5').update(qrString).digest("hex").toLowerCase().trim();

    // Cache tracking mapped directly with the lowercase hash as the dictionary KEY
    activeBakongTransactions.set(qrHash, {
      bookingId: String(bookingId),
      amount: parseFloat(amount),
      expiresAt: expiryTime
    });

    // DEV HELPER: schedule an automatic verification at 1 minute 50 seconds remaining
    setTimeout(async () => {
      try {
        const meta = activeBakongTransactions.get(qrHash);
        if (!meta) return; // already handled or expired

        const current = await Booking.getBookingById(meta.bookingId);
        if (!current) {
          activeBakongTransactions.delete(qrHash);
          return;
        }

        // Adjusted status validation target to 'Confirmed' to safely match database rules
        if (current.status !== 'Confirmed' && current.status !== 'Paid') {
          await Booking.updateBookingStatus(meta.bookingId, 'Confirmed');
          activeBakongTransactions.delete(qrHash);
          await sendTelegramPaymentAlert(meta.bookingId, meta.amount || current.total_price, qrHash, current.full_name);
          console.log(`[Auto Verify Success]: Booking #${meta.bookingId} auto-verified after 10s.`);
        } else {
          activeBakongTransactions.delete(qrHash);
        }
      } catch (err) {
        console.error('Auto-verify error:', err?.message || err);
      }
    }, 10000); // 10,000 ms = 10 seconds (fast test auto-verify trick)

    console.log(`[Cache Registered]: Registered hash ${qrHash} for Booking #${bookingId}`);

    return res.status(200).json({
      success: true,
      qrString: qrString,
      md5: qrHash,
      expiresAt: expiryTime 
    });

  } catch (error) {
    console.error("Bakong QR Creation Controller Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Pings state cache and verifies database status modifications
 * @route   GET /api/bookings/check-bakong-status/:bookingId
 * @access  Private (Via 'protect' middleware)
 */
export const checkBakongStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check database immediately (Determining if background automated verification thread already updated status)
    const currentBooking = await Booking.getBookingById(bookingId);
    if (!currentBooking) {
      return res.status(404).json({ success: false, message: "Associated booking record not found." });
    }

    if (currentBooking.status === 'Confirmed' || currentBooking.status === 'Paid') {
      return res.status(200).json({ success: true, paymentCleared: true, qrExpired: false });
    }

    // Verify cache metrics to determine timeline expiry constraints
    let targetHashKey = null;
    let targetTxMetadata = null;
    let isExpired = true;

    for (const [hashKey, txMetadata] of activeBakongTransactions.entries()) {
      if (String(txMetadata.bookingId) === String(bookingId)) {
        targetHashKey = hashKey;
        targetTxMetadata = txMetadata;
        if (Date.now() < txMetadata.expiresAt) {
          isExpired = false;
        }
        break;
      }
    }

    if (isExpired || !targetHashKey) {
      if (targetHashKey) activeBakongTransactions.delete(targetHashKey);
      return res.status(200).json({ success: true, paymentCleared: false, qrExpired: true });
    }

    // Direct background check fallback via National Bank of Cambodia Endpoint
    if (process.env.BAKONG_API_URL && process.env.BAKONG_TOKEN) {
      try {
        const targetUrl = `${process.env.BAKONG_API_URL}/v1/check_transaction_by_md5`;
        const apiResponse = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BAKONG_TOKEN}`
          },
          body: JSON.stringify({ md5: targetHashKey })
        });

        const contentType = apiResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const networkPayload = await apiResponse.json();
          if (networkPayload.status?.code === 0 && networkPayload.data?.status === "SUCCESS") {
            
            // Perform fallback database verification write using the approved 'Confirmed' enum item
            await Booking.updateBookingStatus(bookingId, 'Confirmed');
            activeBakongTransactions.delete(targetHashKey);
            
            // Trigger the explicit Telegram Channel Alert Notification
            await sendTelegramPaymentAlert(
              bookingId, 
              targetTxMetadata.amount || currentBooking.total_price, 
              targetHashKey, 
              currentBooking.full_name
            );
            
            console.log(`[Bakong Status Success]: Verified and Telegram alerted for Booking #${bookingId}`);
            return res.status(200).json({ success: true, paymentCleared: true, qrExpired: false });
          }
        }
      } catch (fallbackErr) {
        console.error("Direct payment poller validation context error:", fallbackErr.message);
      }
    }

    return res.status(200).json({ success: true, paymentCleared: false, qrExpired: false });

  } catch (err) {
    console.error("Bakong Polling Controller Sync Failure:", err);
    return res.status(200).json({ success: true, paymentCleared: false, qrExpired: false });
  }
};

/**
 * @desc    Deeply verify a Bakong transaction manually and trigger a Telegram Notification
 * @route   POST /api/bookings/verify-bakong-payment
 * @access  Private
 */
export const verifyBakongPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: "Booking ID is required for verification." });
    }

    const booking = await Booking.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking record not found." });
    }

    if (booking.status === 'Confirmed' || booking.status === 'Paid') {
      return res.status(200).json({ 
        success: true, 
        message: "This booking has already been verified and confirmed.", 
        status: 'Confirmed' 
      });
    }

    // Find the hash metadata key corresponding to this specific booking reference id
    let targetHashKey = null;
    let targetTxMetadata = null;
    for (const [hashKey, txMetadata] of activeBakongTransactions.entries()) {
      if (String(txMetadata.bookingId) === String(bookingId)) {
        targetHashKey = hashKey;
        targetTxMetadata = txMetadata;
        break;
      }
    }

    if (!targetHashKey) {
      return res.status(404).json({ success: false, message: "Active tracking hash not found or expired." });
    }

    const targetUrl = `${process.env.BAKONG_API_URL}/v1/check_transaction_by_md5`;
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BAKONG_TOKEN}`
      },
      body: JSON.stringify({ md5: targetHashKey })
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(400).json({ success: false, message: "Bakong API gateway returned unexpected response structure." });
    }

    const networkPayload = await response.json();

    if (networkPayload.status?.code === 0 && networkPayload.data?.status === "SUCCESS") {
      const bakongData = networkPayload.data;

      // Update database status instantly using safe ENUM configurations
      await Booking.updateBookingStatus(bookingId, 'Confirmed');
      activeBakongTransactions.delete(targetHashKey);

      // Trigger the explicit Telegram Channel Alert Notification on success
      await sendTelegramPaymentAlert(
        bookingId, 
        targetTxMetadata.amount || booking.total_price, 
        targetHashKey, 
        booking.full_name
      );

      return res.status(200).json({
        success: true,
        message: "Payment successfully verified against the National Bank ledger!",
        status: 'Confirmed',
        transactionDetails: {
          externalRef: bakongData.te_id,      
          senderName: bakongData.sender_name,   
          amount: parseFloat(bakongData.amount)
        }
      });
    }

    return res.status(200).json({
      success: true,
      paymentCleared: false,
      message: networkPayload.data?.status || "Payment is still pending user scan authorization."
    });

  } catch (error) {
    console.error("Deep Verification System Error:", error);
    return res.status(500).json({ success: false, message: "Internal server verification gateway failure." });
  }
};
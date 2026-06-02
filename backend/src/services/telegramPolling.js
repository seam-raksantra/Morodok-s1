import TelegramBot from 'node-telegram-bot-api';
import * as Booking from '../../models/bookingModel.js';
// Pay close attention to the double dots (../) to find your controller correctly
import { activeBakongTransactions } from '../../controllers/bookingController.js'; 

const TRANSACTION_HASH_REGEX = /(?:Transaction\s*ID|ID|Hash)?\s*:?\s*([a-fA-F0-9]{32,64})/i;

export const initTelegramPolling = () => {
  // Use environment variables if available, otherwise fall back to your explicit test tokens
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7739441736:AAHdGV-Sr3P0uMFHdK1fyx6-Ax7rve5-p0U";
  const TELEGRAM_ALLOWED_CHAT_ID = String(process.env.TELEGRAM_ALLOWED_CHAT_ID || "1334655428");

  console.log("🔄 [Telegram Polling Subsystem]: Booting background stream engine...");
  console.log(`🔑 [Telegram Polling Config] Chat ID=${TELEGRAM_ALLOWED_CHAT_ID}`);

  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

  // =========================================================================
  // 1. REAL TELEGRAM INTERCEPTOR LOOP
  // =========================================================================
  bot.on('message', async (msg) => {
    try {
      if (!msg.chat) {
        console.debug('⚠️ [Telegram Polling Ignored]: Message has no chat payload.');
        return;
      }

      const incomingChatId = String(msg.chat.id);
      if (incomingChatId !== TELEGRAM_ALLOWED_CHAT_ID) {
        console.debug(`⚠️ [Telegram Polling Ignored]: Chat ID ${incomingChatId} is not allowed.`);
        return;
      }

      if (!msg.text) {
        console.debug(`⚠️ [Telegram Polling Ignored]: Allowed chat ${incomingChatId} sent a non-text message.`);
        return;
      }

      const logText = msg.text;
      console.log(`📥 [Telegram Polling Event]: Message heard from ${incomingChatId} -> "${logText}"`);

      const match = logText.match(TRANSACTION_HASH_REGEX);

      if (match && match[1]) {
        const extractedTransactionHash = String(match[1]).toLowerCase().trim();
        console.log(`🎯 [Telegram Polling Match]: Extracted target hash: "${extractedTransactionHash}"`);

        const trackedTransaction = activeBakongTransactions.get(extractedTransactionHash);

        if (trackedTransaction) {
          const matchingBookingId = trackedTransaction.bookingId;
          
          // Execute Database status update rewrite to Confirmed
          await Booking.updateBookingStatus(matchingBookingId, 'Confirmed'); // Use 'Confirmed' or 'Paid' based on your actual status flow
          activeBakongTransactions.delete(extractedTransactionHash);

          console.log(`✅ [Polling Verification Success]: Transaction ID ${extractedTransactionHash} cleared. Booking #${matchingBookingId} updated to Confirmed.`);
          
          await bot.sendMessage(TELEGRAM_ALLOWED_CHAT_ID, `🎉 *Booking Verification Notice*\n\n• *Booking:* #${matchingBookingId}\n• *Status:* Payment cleared and updated via background stream polling successfully!`, { parse_mode: 'Markdown' });
        } else {
          console.warn(`⚠️ [Telegram Polling Warning]: Hash matched (${extractedTransactionHash}) but was not found in active local tracking memory cache.`);
        }
      }
    } catch (error) {
      console.error("❌ Critical processing fault encountered in Polling Loop context execution:", error.message);
    }
  });

  bot.on('polling_error', (error) => {
    console.error("🚨 [Telegram Polling Engine Error Exception]:", error.message);
  });

  // =========================================================================
  // 2. AUTOMATED TESTING TRICK TRAP (10-Second Auto-Approval Loop)
  // =========================================================================
  console.log("⏱️ [Testing Trick Engine]: Initializing background 10s auto-verify watch routine...");
  
  setInterval(async () => {
    if (activeBakongTransactions.size === 0) return;

    for (const [hashKey, txMetadata] of activeBakongTransactions.entries()) {
      // Check if this specific pending QR checkout has been armed yet
      if (!txMetadata.testTriggerArmed) {
        txMetadata.testTriggerArmed = true; // Lock down entry to prevent setting duplicate timeout stacks
        const targetBookingId = txMetadata.bookingId;

        console.log(`⏳ [Testing Trick Armed]: Detected active checkout hash for Booking #${targetBookingId}!`);
        console.log(`⏱️ Mock validation timer running... Will force approve payment in exactly 10 seconds.`);

        setTimeout(async () => {
          try {
            // Verify item has not been removed by a simultaneous manual verification or telegram match
            if (activeBakongTransactions.has(hashKey)) {
              console.log(`⚡ [Testing Trick Fired!]: 10 seconds elapsed. Forcing verification update for Booking #${targetBookingId}...`);

              // 1. Force the database state change to Paid
              await Booking.updateBookingStatus(targetBookingId, 'Confirmed'); // Use 'Confirmed' or 'Paid' based on your actual status flow

              // 2. Clear item from shared tracking memory so frontend interval notices change immediately
              activeBakongTransactions.delete(hashKey);

              console.log(`✅ [Database Synchronized]: Booking #${targetBookingId} hot-fixed to 'Confirmed'.`);

              // 3. Dispatch text log update to your personal chat group via Bot Instance
              const testSuccessMessage = `🎉 *MOCK TEST PAYMENT SUCCESS* 🎉\n\n` +
                                         `• *Booking ID:* #${targetBookingId}\n` +
                                         `• *Status:* Auto-Verified (10s Testing Trick)\n` +
                                         `• *Action:* Database row changed to *Confirmed* successfully!`;

              await bot.sendMessage(TELEGRAM_ALLOWED_CHAT_ID, testSuccessMessage, { parse_mode: 'Markdown' });
              console.log(`✉️ [Telegram Alert Dispatched]: Sent mock verification text to chat ID ${TELEGRAM_ALLOWED_CHAT_ID}`);
            }
          } catch (innerErr) {
            console.error("❌ Error executing simulated testing trick runtime callback loop:", innerErr.message);
          }
        }, 10000); // 10000 ms = Exactly 10 seconds (Hits right when your frontend timer drops to 1:50)
      }
    }
  }, 2500); // Poll local memory cache maps internally every 2.5 seconds
};
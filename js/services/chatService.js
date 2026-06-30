/**
 * TitikLokal - Chat Service (Business Logic Layer)
 */

import { api } from '../core/api.js';
import { store } from '../core/store.js';

let typingTimers = {};
let pollInterval = null;

export const chatService = {
    openRoom: async (buyerId, shopId) => {
        const room = await api.openOrCreateRoom(buyerId, shopId);
        store.dispatch('chatRooms', room);
        return room;
    },

    loadMessages: async (roomId) => {
        return api.getChatMessages(roomId);
    },

    sendMessage: async (roomId, senderId, text) => {
        const msg = await api.sendMessage(roomId, senderId, text);
        return msg;
    },

    simulateTyping: (roomId, callback) => {
        if (typingTimers[roomId]) clearTimeout(typingTimers[roomId]);
        callback(true);
        typingTimers[roomId] = setTimeout(() => callback(false), 2000);
    },

    // Simulate seller auto-reply (for demo purposes)
    simulateSellerReply: async (roomId, sellerId) => {
        const replies = [
            'Halo! Ada yang bisa kami bantu?',
            'Terima kasih sudah menghubungi kami.',
            'Produk kami tersedia, silakan order langsung ya.',
            'Baik, kami akan segera proses pesanannya.',
            'Terimakasih atas kepercayaannya!'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
        return api.sendMessage(roomId, sellerId, randomReply);
    },

    destroy: () => {
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.chatService = chatService;

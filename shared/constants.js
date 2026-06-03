module.exports = {
  roles: {
    SUPER_ADMIN: 'super_admin',
    SELLER: 'seller',
    BUYER: 'buyer',
  },
  productStatus: {
    DRAFT: 'draft',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  sellerStatus: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended',
  },
  inquiryStatus: {
    OPEN: 'open',
    QUOTED: 'quoted',
    CLOSED: 'closed',
    CANCELLED: 'cancelled',
  },
  quotationStatus: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    EXPIRED: 'expired',
  },
  orderStatus: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },
  notificationTypes: {
    INQUIRY: 'inquiry',
    QUOTATION: 'quotation',
    ORDER: 'order',
    APPROVAL: 'approval',
    SYSTEM: 'system',
    CHAT: 'chat',
  },
  pagination: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },
};

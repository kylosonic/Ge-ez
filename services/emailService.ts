import { Order } from '../types';

export const sendConfirmationEmail = async (order: Order): Promise<void> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log(`
    %c=========================================
    📧 EMAIL CONFIRMATION SENT
    =========================================%c
    To: ${order.userEmail}
    Subject: Order #${order.id} Confirmed!
    
    Dear Customer,

    Thank you for shopping with Ge'ez Shirts!
    Your payment receipt has been verified and your order is being processed.

    --- ORDER DETAILS ---
    Order ID: ${order.id}
    Date: ${new Date(order.date).toLocaleString()}
    
    --- ITEMS ---
    ${order.items.map(item => `${item.quantity}x ${item.name.padEnd(30)} $${(item.price * item.quantity).toFixed(2)}`).join('\n    ')}
    
    --- SHIPPING ---
    Method: ${order.shippingMethod}
    Cost:   $${(order.shippingCost || 0).toFixed(2)}
    
    ---------------------
    TOTAL:  $${order.total.toFixed(2)}
    ---------------------
    
    We will notify you when your items have shipped.
    
    Best regards,
    The Ge'ez Shirts Team
    =========================================
  `, 'color: #10b981; font-weight: bold;', 'color: inherit;');
};
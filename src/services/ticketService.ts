import { collection, addDoc, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { createPaymentIntent as mockCreatePaymentIntent } from '../api/mockBackend';

export interface TicketPurchase {
  id?: string;
  ticketTierId: string;
  ticketTierName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  paymentIntentId: string;
  paymentStatus: 'pending' | 'succeeded' | 'failed' | 'canceled';
  purchaseDate: any;
  attendeeInfo?: {
    name: string;
    email: string;
    company?: string;
    jobTitle?: string;
  }[];
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

class TicketService {
  // Create a payment intent on your backend
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntent> {
    try {
      // Try to call real backend API first
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Stripe expects amount in cents
          currency,
        }),
      });

      if (response.ok) {
        return await response.json();
      }
      
      // If backend is not available, use mock for demo
      throw new Error('Backend not available, using mock');
    } catch (error) {
      console.warn('Using mock payment intent for demo:', error);
      
      // Use mock backend for demonstration
      const mockResponse = await mockCreatePaymentIntent({
        amount: amount * 100,
        currency,
      });
      
      return mockResponse;
    }
  }

  // Save ticket purchase to Firebase
  async saveTicketPurchase(purchaseData: Omit<TicketPurchase, 'id' | 'purchaseDate'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'ticketPurchases'), {
        ...purchaseData,
        purchaseDate: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving ticket purchase:', error);
      throw new Error('Failed to save ticket purchase');
    }
  }

  // Update payment status
  async updatePaymentStatus(purchaseId: string, status: TicketPurchase['paymentStatus']): Promise<void> {
    try {
      const purchaseRef = doc(db, 'ticketPurchases', purchaseId);
      await updateDoc(purchaseRef, {
        paymentStatus: status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  // Get ticket purchase by ID
  async getTicketPurchase(purchaseId: string): Promise<TicketPurchase | null> {
    try {
      const purchaseRef = doc(db, 'ticketPurchases', purchaseId);
      const purchaseSnap = await getDoc(purchaseRef);
      
      if (purchaseSnap.exists()) {
        return {
          id: purchaseSnap.id,
          ...purchaseSnap.data(),
        } as TicketPurchase;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting ticket purchase:', error);
      throw new Error('Failed to get ticket purchase');
    }
  }

  // Generate ticket confirmation email data
  generateTicketConfirmation(purchase: TicketPurchase): {
    subject: string;
    html: string;
  } {
    return {
      subject: `TechWave 2025 - Ticket Confirmation #${purchase.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8b5cf6;">TechWave 2025 - Ticket Confirmation</h1>
          <p>Dear ${purchase.customerName},</p>
          <p>Thank you for purchasing your ticket to TechWave 2025!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Ticket Details:</h3>
            <p><strong>Ticket Type:</strong> ${purchase.ticketTierName}</p>
            <p><strong>Quantity:</strong> ${purchase.quantity}</p>
            <p><strong>Total Amount:</strong> $${purchase.totalAmount}</p>
            <p><strong>Confirmation ID:</strong> ${purchase.id}</p>
          </div>
          
          <p>Your ticket(s) will be available for download closer to the event date.</p>
          <p>We look forward to seeing you at TechWave 2025!</p>
          
          <p>Best regards,<br>The TechWave Team</p>
        </div>
      `,
    };
  }
}

export const ticketService = new TicketService();
import { collection, addDoc, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { createPaymentIntent as mockCreatePaymentIntent } from '../api/mockBackend';
import { testFirebaseConnection } from '../utils/firebaseTest';

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
  // Test Firebase connection
  async testFirebaseConnection() {
    return await testFirebaseConnection();
  }

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
      
      // If backend returns an error, fall back to mock
      console.warn('Backend API returned error, falling back to mock payment intent');
      throw new Error('Backend API error, using mock');
    } catch (error) {
      // This catches both network errors (like 404) and other fetch errors
      console.warn('Backend not available, using mock payment intent for demo:', error instanceof Error ? error.message : 'Unknown error');
      
      // Use mock backend for demonstration
      const mockResponse = await mockCreatePaymentIntent({
        amount: amount * 100,
        currency,
      });
      
      return mockResponse;
    }
  }

  // Save ticket purchase to Firebase (with fallback to localStorage for demo)
  async saveTicketPurchase(purchaseData: Omit<TicketPurchase, 'id' | 'purchaseDate'>): Promise<string> {
    try {
      console.log('🔥 Attempting to save to Firebase...');
      const docRef = await addDoc(collection(db, 'ticketPurchases'), {
        ...purchaseData,
        purchaseDate: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });
      console.log('✅ Successfully saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.warn('⚠️ Firebase save failed, using localStorage fallback:', error);
      
      // Check if it's a specific Firebase error
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          console.error('🚫 Firebase permission denied. Check Firestore rules.');
        } else if (error.message.includes('unavailable')) {
          console.error('📡 Firebase service unavailable. Check internet connection.');
        } else if (error.message.includes('unauthenticated')) {
          console.error('🔐 Firebase authentication required.');
        }
      }
      
      // Fallback to localStorage for demo purposes
      const purchaseId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const purchaseWithId: TicketPurchase = {
        ...purchaseData,
        id: purchaseId,
        purchaseDate: new Date().toISOString(),
      };
      
      // Save to localStorage
      const existingPurchases = JSON.parse(localStorage.getItem('demo_purchases') || '[]');
      existingPurchases.push(purchaseWithId);
      localStorage.setItem('demo_purchases', JSON.stringify(existingPurchases));
      console.log('💾 Saved to localStorage with ID:', purchaseId);
      
      return purchaseId;
    }
  }

  // Update payment status (with fallback to localStorage for demo)
  async updatePaymentStatus(purchaseId: string, status: TicketPurchase['paymentStatus']): Promise<void> {
    try {
      const purchaseRef = doc(db, 'ticketPurchases', purchaseId);
      await updateDoc(purchaseRef, {
        paymentStatus: status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Firebase not available, updating local storage for demo:', error);
      
      // Fallback to localStorage for demo purposes
      if (purchaseId.startsWith('demo_')) {
        const existingPurchases = JSON.parse(localStorage.getItem('demo_purchases') || '[]');
        const updatedPurchases = existingPurchases.map((purchase: TicketPurchase) => 
          purchase.id === purchaseId 
            ? { ...purchase, paymentStatus: status, updatedAt: new Date().toISOString() }
            : purchase
        );
        localStorage.setItem('demo_purchases', JSON.stringify(updatedPurchases));
      }
    }
  }

  // Update customer information (with fallback to localStorage for demo)
  async updatePurchaseCustomerInfo(purchaseId: string, customerInfo: {
    customerEmail: string;
    customerName: string;
    customerPhone: string;
  }): Promise<void> {
    try {
      const purchaseRef = doc(db, 'ticketPurchases', purchaseId);
      await updateDoc(purchaseRef, {
        ...customerInfo,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Firebase not available, updating local storage for demo:', error);
      
      // Fallback to localStorage for demo purposes
      if (purchaseId.startsWith('demo_')) {
        const existingPurchases = JSON.parse(localStorage.getItem('demo_purchases') || '[]');
        const updatedPurchases = existingPurchases.map((purchase: TicketPurchase) => 
          purchase.id === purchaseId 
            ? { ...purchase, ...customerInfo, updatedAt: new Date().toISOString() }
            : purchase
        );
        localStorage.setItem('demo_purchases', JSON.stringify(updatedPurchases));
      }
    }
  }

  // Get ticket purchase by ID (with fallback to localStorage for demo)
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
      console.warn('Firebase not available, checking local storage for demo:', error);
      
      // Fallback to localStorage for demo purposes
      if (purchaseId.startsWith('demo_')) {
        const existingPurchases = JSON.parse(localStorage.getItem('demo_purchases') || '[]');
        const purchase = existingPurchases.find((p: TicketPurchase) => p.id === purchaseId);
        return purchase || null;
      }
      
      return null;
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
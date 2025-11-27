import { ReceiptAnalysisResult } from "../types";

// Replaced AI dependency with a simulated service
export const analyzeReceipt = async (base64Image: string): Promise<ReceiptAnalysisResult> => {
  // Simulate upload/processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return a successful status for the checkout flow
  return {
    isValid: true,
    detectedAmount: "Pending Review",
    summary: "Receipt uploaded successfully. Pending manual verification by admin."
  };
};
export interface Message {
  id: string;
  question: string;
  answer: string;
  exploreUsed?: string;
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  exploreUsed: string;
}

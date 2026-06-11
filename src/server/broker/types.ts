export type BrokerId =
  | 'zerodha'
  | 'dhan'
  | 'upstox'
  | 'angel'
  | 'fyers'
  | 'sandbox';

export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT';

export interface FundsSnapshot {
  availablecash: string;
  collateral: string;
  utiliseddebits: string;
}

export interface BrokerAdapter {
  readonly id: BrokerId;
  getFunds(authToken: string): Promise<FundsSnapshot>;
  placeOrder(input: {
    authToken: string;
    symbol: string;
    side: OrderSide;
    quantity: number;
    price?: number;
    orderType: OrderType;
  }): Promise<{ orderId: string; status: string }>;
}

export interface BrokerRegistry {
  list(): BrokerId[];
  get(id: string): BrokerAdapter | undefined;
}

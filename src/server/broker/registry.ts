import type { BrokerAdapter, BrokerId, BrokerRegistry, FundsSnapshot } from './types.js';

class SandboxBroker implements BrokerAdapter {
  readonly id: BrokerId = 'sandbox';

  async getFunds(): Promise<FundsSnapshot> {
    return {
      availablecash: '10000000.00',
      collateral: '0.00',
      utiliseddebits: '0.00',
    };
  }

  async placeOrder(): Promise<{ orderId: string; status: string }> {
    return {
      orderId: `SBX-${Date.now()}`,
      status: 'COMPLETE',
    };
  }
}

const adapters = new Map<BrokerId, BrokerAdapter>([['sandbox', new SandboxBroker()]]);

export const brokerRegistry: BrokerRegistry = {
  list: () => [...adapters.keys()],
  get: (id) => adapters.get(id as BrokerId),
};

export function registerBroker(adapter: BrokerAdapter): void {
  adapters.set(adapter.id, adapter);
}

export async function getFundsForBroker(
  brokerId: string,
  _authToken: string,
): Promise<FundsSnapshot> {
  const adapter = brokerRegistry.get(brokerId) ?? brokerRegistry.get('sandbox');
  if (!adapter) {
    throw new Error(`Broker adapter not registered: ${brokerId}`);
  }
  return adapter.getFunds(_authToken);
}

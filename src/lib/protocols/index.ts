import { ProtocolEngine } from './ProtocolEngine';
import { WireGuardModule } from './WireGuardModule';
import { VLESSModule } from './VLESSModule';

const registry: Record<string, ProtocolEngine> = {
  wireguard: new WireGuardModule(),
  vless: new VLESSModule(),
};

export const ProtocolRegistry = {
  get(id: string): ProtocolEngine {
    const module = registry[id.toLowerCase()];
    if (!module) throw new Error(`Protocol ${id} not found.`);
    return module;
  },
  
  list(): ProtocolEngine[] {
    return Object.values(registry);
  }
};

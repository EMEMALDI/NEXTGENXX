import { ProtocolEngine, ProtocolConfig } from './ProtocolEngine';

export class WireGuardModule implements ProtocolEngine {
  id = 'wireguard';
  name = 'WireGuard';

  validate(config: ProtocolConfig): boolean {
    if (!config.privateKey || !config.publicKey || !config.endpoint) {
      throw new Error('Invalid WireGuard configuration: missing required keys or endpoint.');
    }
    return true;
  }

  generate(params: any): ProtocolConfig {
    // Mock key generation
    const privateKey = params.privateKey || 'generated-private-key';
    const publicKey = params.publicKey || 'generated-public-key';
    
    return {
      privateKey,
      publicKey,
      presharedKey: params.presharedKey || '',
      endpoint: params.endpoint || '0.0.0.0:51820',
      allowedIPs: params.allowedIPs || '0.0.0.0/0, ::/0',
      persistentKeepalive: params.persistentKeepalive || 25,
      mtu: params.mtu || 1420,
      dns: params.dns || '1.1.1.1, 8.8.8.8',
      peers: params.peers || [],
    };
  }

  parse(configString: string): ProtocolConfig {
    // Minimal mock parser
    if (!configString.includes('[Interface]')) {
      throw new Error('Invalid WireGuard config format');
    }
    return {
      privateKey: 'parsed-private-key',
      publicKey: 'parsed-public-key',
      endpoint: 'parsed-endpoint:51820',
    };
  }

  import(data: any): ProtocolConfig {
    return this.generate(data);
  }

  export(config: ProtocolConfig): string {
    return `[Interface]
PrivateKey = ${config.privateKey}
Address = 10.0.0.2/32
DNS = ${config.dns}
MTU = ${config.mtu}

[Peer]
PublicKey = ${config.publicKey}
${config.presharedKey ? `PresharedKey = ${config.presharedKey}\n` : ''}Endpoint = ${config.endpoint}
AllowedIPs = ${config.allowedIPs}
PersistentKeepalive = ${config.persistentKeepalive}
`;
  }

  generateQR(config: ProtocolConfig): string {
    return `wireguard://qr-data-mock`;
  }

  generateSubscription(config: ProtocolConfig): string {
    return btoa(this.export(config));
  }

  clone(config: ProtocolConfig): ProtocolConfig {
    return { ...config, privateKey: 'new-private-key', publicKey: 'new-public-key' };
  }

  preview(config: ProtocolConfig): string {
    return this.export(config);
  }
}

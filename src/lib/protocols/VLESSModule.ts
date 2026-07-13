import { ProtocolEngine, ProtocolConfig } from './ProtocolEngine';

export class VLESSModule implements ProtocolEngine {
  id = 'vless';
  name = 'VLESS';

  validate(config: ProtocolConfig): boolean {
    if (!config.uuid || !config.address || !config.port) {
      throw new Error('Invalid VLESS configuration');
    }
    return true;
  }

  generate(params: any): ProtocolConfig {
    return {
      uuid: params.uuid || 'generated-uuid',
      address: params.address || '0.0.0.0',
      port: params.port || 443,
      flow: params.flow || 'xtls-rprx-vision',
      network: params.network || 'tcp',
      security: params.security || 'tls',
      pbk: params.pbk || '',
      sni: params.sni || '',
      fp: params.fp || 'chrome',
    };
  }

  parse(configString: string): ProtocolConfig {
    if (!configString.startsWith('vless://')) throw new Error('Invalid VLESS link');
    return { uuid: 'parsed', address: 'parsed', port: 443 };
  }

  import(data: any): ProtocolConfig {
    return this.generate(data);
  }

  export(config: ProtocolConfig): string {
    return `vless://${config.uuid}@${config.address}:${config.port}?security=${config.security}&flow=${config.flow}`;
  }

  generateQR(config: ProtocolConfig): string {
    return this.export(config);
  }

  generateSubscription(config: ProtocolConfig): string {
    return btoa(this.export(config));
  }

  clone(config: ProtocolConfig): ProtocolConfig {
    return { ...config, uuid: 'new-uuid' };
  }

  preview(config: ProtocolConfig): string {
    return this.export(config);
  }
}

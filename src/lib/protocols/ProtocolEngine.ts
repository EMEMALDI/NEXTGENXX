export interface ProtocolConfig {
  [key: string]: any;
}

export interface ProtocolEngine {
  id: string;
  name: string;
  validate(config: ProtocolConfig): boolean;
  generate(params: any): ProtocolConfig;
  parse(configString: string): ProtocolConfig;
  import(data: any): ProtocolConfig;
  export(config: ProtocolConfig): string;
  generateQR(config: ProtocolConfig): string;
  generateSubscription(config: ProtocolConfig): string;
  clone(config: ProtocolConfig): ProtocolConfig;
  preview(config: ProtocolConfig): string;
}

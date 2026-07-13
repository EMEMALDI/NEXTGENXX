import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, jsonb, doublePrecision } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').notNull().default('user'), // 'admin' | 'user'
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: text('two_factor_secret'),
  createdAt: timestamp('created_at').defaultNow(),
  status: text('status').notNull().default('active'),
});

export const nodes = pgTable('nodes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull().default('edge'), // 'relay' | 'proxy' | 'edge'
  ipAddress: text('ip_address').notNull(),
  domain: text('domain'),
  port: integer('port').notNull(),
  country: text('country').notNull(),
  region: text('region').notNull().default('Global'),
  provider: text('provider').notNull().default('Custom'), // Hetzner, AWS, Railway, etc.
  protocol: text('protocol').notNull(), // 'VLESS', 'Trojan', etc.
  transport: text('transport').default('tcp'),
  tlsSettings: jsonb('tls_settings').default({}),
  status: text('status').notNull().default('offline'),
  latency: integer('latency').default(0),
  jitter: doublePrecision('jitter').default(0),
  packetLoss: doublePrecision('packet_loss').default(0),
  uptime: doublePrecision('uptime').default(100),
  bandwidth: doublePrecision('bandwidth').default(0),
  score: integer('score').default(0), // Smart Node Score
  health: integer('health').default(100),
  priority: integer('priority').default(1),
  tags: jsonb('tags').default([]),
  settings: jsonb('settings').default({}), // Store advanced TCP/UDP settings
  createdAt: timestamp('created_at').defaultNow(),
});

export const ips = pgTable('ips', {
  id: serial('id').primaryKey(),
  nodeId: integer('node_id').references(() => nodes.id),
  address: text('address').notNull(),
  type: text('type').notNull(), // 'ipv4' | 'ipv6' | 'domain'
  active: boolean('active').default(true),
  health: integer('health').default(100),
  tags: jsonb('tags').default([]), // ['provider', 'region']
  createdAt: timestamp('created_at').defaultNow(),
});

export const protocolProfiles = pgTable('protocol_profiles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // Gaming, Streaming, Custom, etc.
  protocol: text('protocol').notNull(),
  settings: jsonb('settings').default({}), // Advanced parameters
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});


export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  lastUsedAt: timestamp('last_used_at'),
  active: boolean('active').default(true),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  planName: text('plan_name').notNull(),
  dataLimit: integer('data_limit').notNull(), // in GB
  dataUsed: integer('data_used').default(0),
  expiryDate: timestamp('expiry_date').notNull(),
  token: text('token').notNull().unique(), // Access token/link
  gamingProfile: boolean('gaming_profile').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  active: boolean('active').default(true),
});

export const systemLogs = pgTable('system_logs', {
  id: serial('id').primaryKey(),
  level: text('level').notNull(),
  message: text('message').notNull(),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  apiKeys: many(apiKeys),
  auditLogs: many(auditLogs),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));


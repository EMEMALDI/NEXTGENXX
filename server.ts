import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import http from 'http';
import { Server } from 'socket.io';
import { db } from './src/db/index.ts';
import { nodes, subscriptions, users, systemLogs } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, requireAdmin, AuthRequest } from './src/middleware/auth.ts';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }
  });
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // WebSocket Live Monitoring
  io.on('connection', (socket) => {
    console.log('Client connected for live monitoring');
    
    // Simulate live metrics
    const interval = setInterval(() => {
      socket.emit('metrics', {
        cpu: Math.random() * 100,
        ram: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 1000),
        bandwidth: Math.floor(Math.random() * 100)
      });
    }, 2000);

    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log('Client disconnected');
    });
  });

  // REST API Routes
  
  // Dashboard Metrics
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/admin/dashboard', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const usersCount = (await db.select().from(users)).length;
      const nodesCount = (await db.select().from(nodes)).length;
      const subsCount = (await db.select().from(subscriptions)).length;
      
      res.json({
        totalUsers: usersCount,
        totalNodes: nodesCount,
        activeSubscriptions: subsCount,
        networkTraffic: "1.2 TB" // placeholder for demo
      });
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Nodes Management
  app.get('/api/nodes', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { type } = req.query;
      const allNodes = await db.select().from(nodes);
      res.json(type ? allNodes.filter(n => n.type === type) : allNodes);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/nodes', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { name, type, ipAddress, port, country, region, provider, protocol, settings } = req.body;
      const newNode = await db.insert(nodes).values({
        name, type: type || 'edge', ipAddress, port, country, region, provider, protocol, settings: settings || {}
      }).returning();
      res.json(newNode[0]);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/nodes/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, type, ipAddress, port, country, region, provider, protocol, status, settings } = req.body;
      const updatedNode = await db.update(nodes).set({
        name, type, ipAddress, port, country, region, provider, protocol, status, settings
      }).where(eq(nodes.id, parseInt(id))).returning();
      res.json(updatedNode[0]);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/nodes/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      await db.delete(nodes).where(eq(nodes.id, parseInt(id)));
      res.json({ success: true });
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // IPs
  app.get('/api/ips', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { ips } = await import('./src/db/schema.ts');
      const allIps = await db.select().from(ips);
      res.json(allIps);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ips', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { address, type, nodeId } = req.body;
      const { ips } = await import('./src/db/schema.ts');
      const newIp = await db.insert(ips).values({
        address, type, nodeId: nodeId || null
      }).returning();
      res.json(newIp[0]);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/ips/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { ips } = await import('./src/db/schema.ts');
      await db.delete(ips).where(eq(ips.id, parseInt(id)));
      res.json({ success: true });
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Protocol Profiles
  app.get('/api/protocols/profiles', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { protocolProfiles } = await import('./src/db/schema.ts');
      const profiles = await db.select().from(protocolProfiles);
      res.json(profiles);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/protocols/profiles', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { name, protocol, settings, isDefault } = req.body;
      const { protocolProfiles } = await import('./src/db/schema.ts');
      const newProfile = await db.insert(protocolProfiles).values({
        name, protocol, settings, isDefault
      }).returning();
      res.json(newProfile[0]);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/protocols/profiles/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { protocolProfiles } = await import('./src/db/schema.ts');
      await db.delete(protocolProfiles).where(eq(protocolProfiles.id, parseInt(id)));
      res.json({ success: true });
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Users Management
  app.get('/api/users', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/users/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { email, role, status } = req.body;
      const updatedUser = await db.update(users).set({ email, role, status }).where(eq(users.id, parseInt(id))).returning();
      res.json(updatedUser[0]);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/users/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      await db.delete(users).where(eq(users.id, parseInt(id)));
      res.json({ success: true });
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Subscriptions
  app.get('/api/subscriptions', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      // If admin, see all. If user, see own.
      const query = req.dbUser.role === 'admin' 
        ? db.select().from(subscriptions) 
        : db.select().from(subscriptions).where(eq(subscriptions.userId, req.dbUser.id));
      const subs = await query;
      res.json(subs);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/subscriptions', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { userId, planName, dataLimit, expiryDate } = req.body;
      // Generate a random token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const sub = await db.insert(subscriptions).values({
        userId, planName, dataLimit, expiryDate: new Date(expiryDate), token
      }).returning();
      res.json(sub[0]);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // System Logs
  app.get('/api/logs', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const logs = await db.select().from(systemLogs).orderBy(desc(systemLogs.createdAt)).limit(100);
      res.json(logs);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/user/profile', requireAuth, async (req: AuthRequest, res: Response) => {
    res.json(req.dbUser);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

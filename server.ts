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
  const PORT = 3000;

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
      const allNodes = await db.select().from(nodes);
      res.json(allNodes);
    } catch(err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/nodes', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { name, ipAddress, port, country, protocol, settings } = req.body;
      const newNode = await db.insert(nodes).values({
        name, ipAddress, port, country, protocol, settings: settings || {}
      }).returning();
      res.json(newNode[0]);
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

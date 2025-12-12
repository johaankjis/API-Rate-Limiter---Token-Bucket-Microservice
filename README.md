# API Rate Limiter - Token Bucket Microservice

A high-performance API rate limiting microservice built with Next.js 16, implementing the Token Bucket algorithm. This service provides real-time rate limiting with an intuitive dashboard for monitoring and testing.

## 🌟 Features

- **Token Bucket Algorithm**: Efficient rate limiting with smooth token refill
- **Real-time Dashboard**: Monitor requests, metrics, and bucket status in real-time
- **Interactive API Tester**: Test rate limiting directly from the dashboard
- **Comprehensive Metrics**: Track total requests, allowed/blocked requests, and success rates
- **Live Logs**: View recent request logs with detailed status information
- **RESTful API**: Simple HTTP endpoints for easy integration
- **TypeScript**: Fully typed for better developer experience
- **Modern UI**: Built with Radix UI and Tailwind CSS

## 🚀 How It Works

The Token Bucket algorithm is a widely used rate limiting strategy that works as follows:

1. Each client has a "bucket" with a maximum capacity (default: 100 tokens)
2. Each request consumes tokens from the bucket
3. Tokens are automatically refilled at a constant rate (default: 100 tokens/minute ≈ 1.66 tokens/second)
4. If sufficient tokens are available, the request is allowed; otherwise, it's blocked
5. Blocked requests receive a `retry_after_seconds` value indicating when to retry

### Why Token Bucket?

- **Smooth traffic handling**: Allows burst traffic up to the bucket capacity
- **Predictable behavior**: Consistent rate limiting with clear boundaries
- **Fair allocation**: Each client gets independent rate limiting
- **Efficient**: O(1) time complexity for token checks and refills

## 📋 API Endpoints

### POST `/api/check`

Check and consume tokens for rate limiting.

**Request Body:**
```json
{
  "client_key": "user_123",
  "requested_tokens": 1
}
```

**Response (200 - Allowed):**
```json
{
  "allowed": true,
  "remaining_tokens": 99,
  "limit": 100,
  "reset_in_seconds": 36.0
}
```

**Response (429 - Blocked):**
```json
{
  "allowed": false,
  "remaining_tokens": 0,
  "limit": 100,
  "retry_after_seconds": 15.7
}
```

### GET `/api/status/[clientKey]`

Get the current bucket status for a specific client.

**Response:**
```json
{
  "client_key": "user_123",
  "tokens": 73.5,
  "capacity": 100,
  "refill_rate": 1.66,
  "last_refill_ts": 1733950000.23
}
```

### GET `/api/metrics`

Get aggregated metrics and recent logs.

**Response:**
```json
{
  "total_requests": 12034,
  "total_allowed": 11000,
  "total_blocked": 1034,
  "success_rate": 91,
  "recent_logs": [...],
  "active_buckets": [...]
}
```

### POST `/api/reset`

Reset metrics or specific client buckets (for testing/admin purposes).

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Data Fetching**: [SWR](https://swr.vercel.app/) - React Hooks for data fetching
- **Charts**: [Recharts](https://recharts.org/) - Composable charting library
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icon library

## 📦 Installation

### Prerequisites

- Node.js 18+ or higher
- pnpm (recommended) or npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/johaankjis/API-Rate-Limiter---Token-Bucket-Microservice.git
cd API-Rate-Limiter---Token-Bucket-Microservice
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## 🎯 Usage Examples

### Testing with cURL

**Check rate limit:**
```bash
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"client_key": "user_123", "requested_tokens": 1}'
```

**Get client status:**
```bash
curl http://localhost:3000/api/status/user_123
```

**Get metrics:**
```bash
curl http://localhost:3000/api/metrics
```

### Integration Example (JavaScript)

```javascript
async function makeRateLimitedRequest(clientKey) {
  const response = await fetch('http://localhost:3000/api/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_key: clientKey,
      requested_tokens: 1
    })
  });

  const data = await response.json();

  if (data.allowed) {
    console.log(`Request allowed. Remaining tokens: ${data.remaining_tokens}`);
    // Proceed with your actual API call
    return true;
  } else {
    console.log(`Rate limited. Retry after: ${data.retry_after_seconds}s`);
    return false;
  }
}
```

## 🔧 Configuration

The default rate limiting configuration can be customized:

- **Capacity**: 100 tokens (maximum burst size)
- **Refill Rate**: 100 tokens per minute (~1.66 tokens/second)

To modify the default configuration, edit `lib/rate-limiter.ts`:

```typescript
export const DEFAULT_CONFIG: RateLimitConfig = {
  capacity: 100,
  refillRate: 100 / 60, // tokens per second
}
```

You can also pass custom configuration per request:

```json
{
  "client_key": "user_123",
  "requested_tokens": 1,
  "capacity": 50,
  "refill_rate": 0.83
}
```

## 📊 Dashboard Features

The web dashboard provides:

1. **Metrics Cards**: Real-time statistics on total requests, allowed requests, blocked requests, and success rate
2. **API Tester**: Interactive form to test rate limiting with different client keys
3. **Bucket Status**: View active client buckets and their current token counts
4. **Request Logs**: Table showing recent requests with timestamps, status, and token information
5. **API Documentation**: Embedded API reference with examples

## 🏗️ Project Structure

```
├── app/
│   ├── api/              # API route handlers
│   │   ├── check/        # Rate limit check endpoint
│   │   ├── metrics/      # Metrics endpoint
│   │   ├── reset/        # Reset endpoint
│   │   └── status/       # Status endpoint
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard page
├── components/           # React components
│   ├── api-docs.tsx      # API documentation component
│   ├── api-tester.tsx    # Interactive API tester
│   ├── bucket-status.tsx # Bucket status display
│   ├── logs-table.tsx    # Request logs table
│   ├── metrics-cards.tsx # Metrics display cards
│   └── ui/               # Reusable UI components
├── lib/
│   ├── rate-limiter.ts   # Core rate limiting logic
│   └── utils.ts          # Utility functions
└── styles/
    └── globals.css       # Global styles
```

## 🚢 Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/johaankjis/API-Rate-Limiter---Token-Bucket-Microservice)

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## ⚠️ Important Notes

### Production Considerations

**Current Implementation**: This version uses in-memory storage for demonstration purposes. In production, you should:

1. **Use Redis or similar**: Replace in-memory Map with Redis for distributed rate limiting
2. **Add authentication**: Secure API endpoints with proper authentication
3. **Implement persistence**: Store bucket states to survive server restarts
4. **Add monitoring**: Integrate with monitoring tools (e.g., Datadog, New Relic)
5. **Scale horizontally**: Use a centralized data store for multi-instance deployments

### Example Redis Integration

```typescript
// Using Redis for production
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

async function getBucket(clientKey: string) {
  const data = await redis.get(`bucket:${clientKey}`);
  return data ? JSON.parse(data) : initializeBucket();
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Token Bucket algorithm inspired by classic rate limiting patterns
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with the Next.js App Router

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js and TypeScript**

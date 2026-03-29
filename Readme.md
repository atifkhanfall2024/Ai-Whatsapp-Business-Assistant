## AI WhatsApp Business Assistant Architecture

### 1. Project Overview
- **Goal:** Smart WhatsApp assistant for small businesses
- **Features:** Auto replies, order tracking, dashboard, RAG-based context

### 2. Tech Stack
- **Frontend:** Next.js + TypeScript
- **Backend:** Node.js + Express
- **Database:** MongoDB (RAG), optionally Postgres
- **AI/Embeddings:** OpenAI / HuggingFace / Groq API
- **WhatsApp Integration:** WhatsApp Cloud API

### 3. Folder Structure
```
project-root/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  │   ├─ whatsappController.ts
│  │  │   ├─ messageController.ts
│  │  │   └─ orderController.ts
│  │  ├─ models/
│  │  │   ├─ Message.ts
│  │  │   ├─ Customer.ts
│  │  │   └─ Order.ts
│  │  ├─ routes/
│  │  │   ├─ whatsapp.ts
│  │  │   ├─ messages.ts
│  │  │   └─ orders.ts
│  │  ├─ services/
│  │  │   ├─ llmService.ts
│  │  │   ├─ ragService.ts
│  │  │   └─ whatsappService.ts
│  │  └─ app.ts
├─ frontend/
│  ├─ pages/
│  │   ├─ dashboard.tsx
│  │   ├─ messages.tsx
│  │   ├─ orders.tsx
│  │   └─ customers.tsx
│  ├─ components/
│  └─ utils/
└─ .env
```

### 4. Database Schema (MongoDB)
- **Message**
```ts
{
  customer_id: String,
  message: String,
  type: 'inbound' | 'outbound',
  timestamp: Date,
  embedding: [Number]
}
```
- **Customer**
```ts
{
  name: String,
  phone: String,
  created_at: Date
}
```
- **Order**
```ts
{
  customer_id: String,
  products: [{ name: String, qty: Number }],
  status: 'pending' | 'completed',
  created_at: Date
}
```

### 5. Backend API List
| Method | Endpoint | Purpose |
|--------|---------|---------|
| POST   | /api/whatsapp-webhook | Receive WhatsApp messages |
| GET    | /api/messages | Fetch all messages |
| POST   | /api/messages | Create message (manual) |
| PUT    | /api/messages/:id | Update message |
| DELETE | /api/messages/:id | Delete message |
| GET    | /api/orders | Fetch all orders |
| POST   | /api/orders | Create order |
| PUT    | /api/orders/:id | Update order |
| DELETE | /api/orders/:id | Delete order |
| GET    | /api/customers | Fetch all customers |

### 6. WhatsApp Webhook Flow
1. Customer sends message → WhatsApp Cloud API
2. API triggers webhook → `/api/whatsapp-webhook`
3. Backend saves message + generates embedding
4. RAG service fetches context
5. LLM generates AI reply
6. Reply sent back to customer via WhatsApp API

### 7. AI + RAG Flow
```
Incoming message → RAG fetch context → LLM → Generate reply → Send back
```

### 8. Optional Features
- Auto order extraction (product + qty + address)
- Daily digest summary
- Voice-to-text message processing

### 9. Future Enhancements
- Multi-language support
- Analytics dashboard
- Customer segmentation
- Priority tagging for urgent messages


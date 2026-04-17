# Chat API & Notifications Integration Plan

## Overview

Two backend modules are fully implemented but not yet wired to the frontend:

| Module | Backend | Frontend | Gap |
|---|---|---|---|
| AI Chat (`/chat`) | ✅ Complete (7 endpoints) | ❌ Mock only | Replace fake responses with real API |
| Notifications (`/notifications`) | ✅ Complete (5 endpoints) | ❌ Not implemented | Full new feature |

---

## Part 1 — AI Chat Real API Integration

### Background

`src/services/integratedApiService.ts` exports a `chatService` that currently returns hardcoded random strings after a `setTimeout`. The backend has a full LangGraph/ReAct agent at `/chat/*` ready to use. The goal is to replace the mock layer without touching `ChatInterface.tsx`.

### Backend Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/chat/message` | Send a message; returns AI response + session_id |
| POST | `/chat/session/new` | Create a new conversation session |
| GET | `/chat/history/{session_id}` | Fetch conversation history for a session |
| DELETE | `/chat/session/{session_id}` | End and clean up a session |
| GET | `/chat/suggestions` | Get suggested prompts for the user |
| GET | `/chat/stats` | Get agent stats (which agent is active, etc.) |
| POST | `/chat/feedback` | Submit thumbs up/down on an AI response |

**Key request/response details:**
- `POST /chat/message` — body: `{ message, session_id? }` → returns `{ success, response, session_id, execution_time_ms?, error? }`
- If `session_id` is omitted, the backend auto-creates one and returns it in the response
- `GET /chat/history/{session_id}` → returns `{ success, messages: [{ role, content, timestamp }], session_id }`
- `POST /chat/feedback` — body: `{ message_id, rating: "up"|"down", comment? }`

### Implementation Tasks

**1. Create `src/services/chatApiService.ts`**
- Class-based service following the same pattern as `socialApiService.ts`
- Wraps `apiClient` for all 7 endpoints above
- Export as singleton `chatApiService`

**2. Register in `src/services/apiServiceManager.ts`**
- Add `public readonly chat = chatApiService` alongside existing services
- Add `chat` to the `getServiceStatus()` services object

**3. Replace mock in `src/services/integratedApiService.ts`**
- Remove the `aiResponses` hardcoded object and `setTimeout` delay
- `sendMessage()` — call `chatApiService.sendMessage()` with the real message; keep the `AIPreferenceExtractor` call running in parallel (local, no backend change)
- `getChatHistory()` — call `chatApiService.getHistory(sessionId)` and map the response to the `ChatMessage` shape
- Manage `sessionId` in `sessionStorage` (key: `vitalsync_chat_session`) — persists across tab refresh, cleared on logout
- Add a `clearChatSession()` export to call on logout (ends session via API + clears storage)

**4. Update `App.tsx` — chat init `useEffect`**
- `getChatHistory()` is currently called synchronously (returns `[]`). Change to async `.then()` to load real history on mount.
- Call `clearChatSession()` in the logout flow.

**5. Export from `src/services/index.ts`**
- Export `chatApiService` and all its types

---

## Part 2 — Notifications Integration

### Background

The backend stores in-app notifications in the DB and supports FCM push via Firebase Cloud Messaging. Firebase is already initialized in `firebase.ts` but `getMessaging` is not imported. The existing `useNotifications` hook is the toast/UI system — it must not be modified. This is an entirely new feature layer.

### Backend Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/notifications` | Get user's notifications (supports `unread_only`, `limit`, `offset`) |
| GET | `/notifications/unread-count` | Get count of unread notifications |
| POST | `/notifications/mark-read` | Mark specific IDs or all as read (`notification_ids?: string[]`) |
| POST | `/notifications/push-subscribe` | Register an FCM token (`fcm_token`, `device_name?`, `platform?`) |
| POST | `/notifications/push-unsubscribe` | Deregister an FCM token on logout |

**Key response details:**
- `GET /notifications` → array of `{ id, title, body, notification_type, source, action_url?, is_read, is_push_sent, created_at }`
- `GET /notifications/unread-count` → `{ unread_count: number }`
- `POST /notifications/mark-read` — omitting `notification_ids` (or passing `null`) marks all as read

### Implementation Tasks

**1. Create `src/services/notificationsApiService.ts`**
- Class-based service following the same pattern as `socialApiService.ts`
- Wraps `apiClient` for all 5 endpoints above
- Name the notification type `BackendNotification` to avoid collision with the existing `Notification` type in `types/index.ts`
- Export as singleton `notificationsApiService`

**2. Extend `src/firebase.ts` for FCM**
- Import `getMessaging`, `getToken`, `onMessage` from `firebase/messaging`
- Export a `getFCMToken()` async helper — requests browser notification permission, then retrieves the FCM token using `VITE_FIREBASE_VAPID_KEY` from env
- If the VAPID key is missing or permission is denied, return `null` gracefully (no errors thrown)
- Export `onMessage` for foreground push handling

**3. Create `src/hooks/useBackendNotifications.ts`**
- Accepts an `isAuthenticated: boolean` param — only activates after Firebase auth resolves
- On mount: fetch notifications list + unread count, then call `registerPushToken()`
- Poll `getUnreadCount()` every 60 seconds via `setInterval`; clear on unmount
- `registerPushToken()` — calls `getFCMToken()`, then `notificationsApiService.subscribePush()`. Store the token in `localStorage` (`vitalsync_fcm_token`) to skip re-registration on subsequent mounts
- `markAsRead(ids?)` — marks specific IDs or all; optimistically updates local state before API call
- On FCM foreground message (`onMessage`), append to local notifications state and increment unread count
- Returns: `{ notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllRead, registerPushToken }`

**4. Create `src/components/common/NotificationBell.tsx`**
- Bell icon (use `lucide-react` `Bell`/`BellDot`) with a red badge for unread count (cap display at `99+`)
- Click toggles a dropdown panel listing recent notifications
- Each item: title, body (truncated), time ago, unread indicator dot
- "Mark all read" button in panel header (hidden when count is 0)
- Clicking a notification marks it read and navigates to `action_url` if present
- Empty state when no notifications
- Click outside closes the dropdown

**5. Update `src/components/common/Header.tsx`**
- Add `NotificationBell` between the install button and profile avatar
- New props: `notificationCount?`, `notifications?`, `onMarkNotificationRead?` — all optional so it renders nothing in unauthenticated state

**6. Wire into `App.tsx`**
- Instantiate `useBackendNotifications(!!firebaseUser)` alongside other hooks
- Pass `unreadCount`, `notifications`, and `markAsRead` down to `Header`
- Call `notificationsApiService.unsubscribePush(token)` in the logout flow (retrieve token from `localStorage`)

**7. Register in `apiServiceManager.ts` and `index.ts`**
- Add `public readonly notifications = notificationsApiService` to the manager
- Add `notifications` to `getServiceStatus()`
- Export service and all types from `index.ts`

---

## Environment Variables

Add to `.env` and `.env.example`:

```
VITE_FIREBASE_VAPID_KEY=
```

Get the VAPID key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates.

---

## File Change Summary

| File | Action | Notes |
|---|---|---|
| `src/services/chatApiService.ts` | Create | New service for `/chat/*` |
| `src/services/notificationsApiService.ts` | Create | New service for `/notifications/*` |
| `src/services/apiServiceManager.ts` | Edit | Add `chat` and `notifications` |
| `src/services/integratedApiService.ts` | Edit | Replace mock `chatService` |
| `src/services/index.ts` | Edit | Export both new services and types |
| `src/firebase.ts` | Edit | Add FCM messaging support |
| `src/hooks/useBackendNotifications.ts` | Create | Backend notification state hook |
| `src/components/common/NotificationBell.tsx` | Create | Bell icon + dropdown UI |
| `src/components/common/Header.tsx` | Edit | Add `NotificationBell` |
| `src/App.tsx` | Edit | Wire hook, async chat init, logout cleanup |
| `.env` / `.env.example` | Edit | Add `VITE_FIREBASE_VAPID_KEY` |

---

## Key Constraints

- `ChatInterface.tsx` — no changes. The `onSendMessage` prop contract is preserved.
- `useNotifications` hook — no changes. It's the toast system; `useBackendNotifications` is separate.
- `BackendNotification` naming avoids collision with the existing `Notification` type in `types/index.ts`.
- FCM push degrades gracefully — missing VAPID key or denied permission falls back to polling only.
- Chat `sessionId` in `sessionStorage` — survives tab refresh, cleared on logout.
- FCM token in `localStorage` — avoids re-registering on every app mount.

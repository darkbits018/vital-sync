# Vital Sync API Specification

## Overview
This document provides detailed API specifications including data types, validation rules, and request/response schemas that the backend must implement to properly interact with the Vital Sync frontend.

---

## Data Types & Validation Rules

### Core Data Types

#### User
```typescript
interface User {
  id: string                    // UUID, required, unique
  name: string                  // 1-100 chars, required, trim whitespace
  email: string                 // Valid email format, required, unique, lowercase
  height: number                // 50-300 cm, required, positive integer
  weight: number                // 20-500 kg, required, positive number (1 decimal)
  age: number                   // 13-120 years, required, positive integer
  gender: 'male' | 'female' | 'other'  // Enum, required
  goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'build_muscle'  // Enum, required
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'  // Enum, required
  createdAt: Date               // ISO 8601 datetime, auto-generated
  isAchievementsPublic?: boolean // Optional, default: false
  firebaseUid?: string          // Firebase UID, optional, unique if provided
}
```

**Validation Rules:**
- `name`: Required, 1-100 characters, no leading/trailing spaces
- `email`: Required, valid email format, unique across users
- `height`: Required, integer between 50-300 (cm)
- `weight`: Required, number between 20-500 with max 1 decimal place (kg)
- `age`: Required, integer between 13-120
- `gender`: Required, must be one of the enum values
- `goal`: Required, must be one of the enum values
- `activityLevel`: Required, must be one of the enum values
- `firebaseUid`: Optional, unique if provided, alphanumeric

#### MacroTargets
```typescript
interface MacroTargets {
  calories: number    // 800-5000, required, positive integer
  protein: number     // 20-500g, required, positive integer
  carbs: number       // 50-800g, required, positive integer
  fat: number         // 20-300g, required, positive integer
  fiber?: number      // 10-100g, optional, positive integer
  sugar?: number      // 0-200g, optional, positive integer
}
```

**Validation Rules:**
- `calories`: Required, integer between 800-5000
- `protein`: Required, integer between 20-500
- `carbs`: Required, integer between 50-800
- `fat`: Required, integer between 20-300
- `fiber`: Optional, integer between 10-100
- `sugar`: Optional, integer between 0-200

#### Meal
```typescript
interface Meal {
  id: string                    // UUID, required, unique
  name: string                  // 1-200 chars, required, trim whitespace
  calories: number              // 1-5000, required, positive integer
  protein: number               // 0-200g, required, non-negative number (1 decimal)
  carbs: number                 // 0-500g, required, non-negative number (1 decimal)
  fat: number                   // 0-200g, required, non-negative number (1 decimal)
  fiber?: number                // 0-100g, optional, non-negative number (1 decimal)
  sugar?: number                // 0-200g, optional, non-negative number (1 decimal)
  date: Date                    // ISO 8601 date, required
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'  // Enum, required
  image?: string                // Valid URL or base64, optional, max 5MB
}
```

**Validation Rules:**
- `name`: Required, 1-200 characters, trim whitespace
- `calories`: Required, integer between 1-5000
- `protein`: Required, number between 0-200 with max 1 decimal
- `carbs`: Required, number between 0-500 with max 1 decimal
- `fat`: Required, number between 0-200 with max 1 decimal
- `fiber`: Optional, number between 0-100 with max 1 decimal
- `sugar`: Optional, number between 0-200 with max 1 decimal
- `date`: Required, valid ISO 8601 date
- `mealType`: Required, must be one of the enum values
- `image`: Optional, valid URL or base64 string, max 5MB

#### Workout
```typescript
interface Workout {
  id: string                    // UUID, required, unique
  name: string                  // 1-200 chars, required, trim whitespace
  exercises: Exercise[]         // Array, required, min 1 exercise, max 20
  date: Date                    // ISO 8601 date, required
  duration: number              // 1-600 minutes, required, positive integer
  calories: number              // 1-2000, required, positive integer
  notes?: string                // 0-1000 chars, optional, trim whitespace
  images?: string[]             // Array of URLs/base64, optional, max 4 images, max 5MB each
}

interface Exercise {
  id: string                    // UUID, required, unique
  name: string                  // 1-100 chars, required, trim whitespace
  sets: Set[]                   // Array, required, min 1 set, max 20
  restTime?: number             // 0-600 seconds, optional, non-negative integer
  notes?: string                // 0-500 chars, optional, trim whitespace
}

interface Set {
  reps: number                  // 1-1000, required, positive integer
  weight: number                // 0-1000 kg, required, non-negative number (1 decimal)
  completed: boolean            // Required, boolean
}
```

**Validation Rules:**
- `Workout.name`: Required, 1-200 characters
- `Workout.exercises`: Required array, 1-20 exercises
- `Workout.duration`: Required, integer between 1-600 minutes
- `Workout.calories`: Required, integer between 1-2000
- `Workout.notes`: Optional, max 1000 characters
- `Workout.images`: Optional array, max 4 images, each max 5MB
- `Exercise.name`: Required, 1-100 characters
- `Exercise.sets`: Required array, 1-20 sets
- `Exercise.restTime`: Optional, integer between 0-600 seconds
- `Set.reps`: Required, integer between 1-1000
- `Set.weight`: Required, number between 0-1000 with max 1 decimal
- `Set.completed`: Required boolean

#### Friend
```typescript
interface Friend {
  id: string                    // UUID, required, unique
  username: string              // 3-30 chars, required, alphanumeric + underscore, unique
  email: string                 // Valid email, required
  name: string                  // 1-100 chars, required
  avatar?: string               // Valid URL, optional, max 2MB
  status: 'online' | 'offline' | 'away' | 'busy'  // Enum, required
  lastSeen?: Date               // ISO 8601 datetime, optional
  friendsSince: Date            // ISO 8601 datetime, required
  mutualFriends?: number        // 0-10000, optional, non-negative integer
  isVerified?: boolean          // Optional, default: false
}
```

**Validation Rules:**
- `username`: Required, 3-30 characters, alphanumeric + underscore only, unique
- `email`: Required, valid email format
- `name`: Required, 1-100 characters
- `avatar`: Optional, valid URL, max 2MB image
- `status`: Required, must be one of the enum values
- `mutualFriends`: Optional, non-negative integer max 10000

#### Challenge
```typescript
interface Challenge {
  id: string                    // UUID, required, unique
  name: string                  // 1-100 chars, required, trim whitespace
  description: string           // 1-1000 chars, required, trim whitespace
  startDate: Date               // ISO 8601 date, required, not in past
  endDate: Date                 // ISO 8601 date, required, after startDate
  createdBy: string             // User ID, required, valid UUID
  createdAt: Date               // ISO 8601 datetime, auto-generated
  isActive: boolean             // Required, default: true
  isPublic: boolean             // Required, default: false
  rules: string                 // 1-2000 chars, required
  rewards: string               // 1-1000 chars, required
  goals: ChallengeGoal[]        // Array, required, min 1 goal, max 10
  members: ChallengeMember[]    // Array, auto-managed
  category: 'steps' | 'workouts' | 'meals' | 'weight' | 'custom'  // Enum, required
  maxMembers: number            // 2-1000, required, positive integer
  image?: string                // Valid URL, optional, max 5MB
}
```

**Validation Rules:**
- `name`: Required, 1-100 characters
- `description`: Required, 1-1000 characters
- `startDate`: Required, valid date, cannot be in the past
- `endDate`: Required, valid date, must be after startDate
- `rules`: Required, 1-2000 characters
- `rewards`: Required, 1-1000 characters
- `goals`: Required array, 1-10 goals
- `maxMembers`: Required, integer between 2-1000
- `image`: Optional, valid URL, max 5MB

#### Medicine
```typescript
interface Medicine {
  id: string                    // UUID, required, unique
  name: string                  // 1-200 chars, required, trim whitespace
  dosage: string                // 1-50 chars, required (e.g., "10", "2.5")
  unit: 'mg' | 'ml' | 'tablets' | 'capsules' | 'drops' | 'puffs' | 'units'  // Enum, required
  frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'every_other_day' | 'weekly' | 'monthly' | 'as_needed' | 'custom'  // Enum, required
  customFrequency?: {
    times: number               // 1-24, required if frequency is 'custom'
    interval: 'hours' | 'days' | 'weeks'  // Enum, required if frequency is 'custom'
  }
  timing: 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach' | 'anytime'  // Enum, required
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'any_meal'  // Enum, optional
  timingOffset?: number         // 0-120 minutes, optional, non-negative integer
  reminderTimes: string[]       // Array of time strings "HH:MM", required, 1-8 times
  startDate: Date               // ISO 8601 date, required
  endDate?: Date                // ISO 8601 date, optional, after startDate
  isActive: boolean             // Required, default: true
  notes?: string                // 0-1000 chars, optional
  sideEffects?: string[]        // Array of strings, optional, max 20 items, each max 100 chars
  foodInteractions?: string[]   // Array of strings, optional, max 20 items, each max 100 chars
  createdAt: Date               // ISO 8601 datetime, auto-generated
  lastTaken?: Date              // ISO 8601 datetime, optional
  missedDoses: number           // 0-10000, required, non-negative integer, default: 0
  totalDoses: number            // 0-10000, required, non-negative integer, default: 0
}
```

**Validation Rules:**
- `name`: Required, 1-200 characters
- `dosage`: Required, 1-50 characters, alphanumeric with decimal point
- `unit`: Required, must be one of the enum values
- `frequency`: Required, must be one of the enum values
- `customFrequency.times`: Required if frequency is 'custom', integer 1-24
- `timing`: Required, must be one of the enum values
- `timingOffset`: Optional, integer 0-120 minutes
- `reminderTimes`: Required array, 1-8 time strings in "HH:MM" format
- `startDate`: Required, valid date
- `endDate`: Optional, valid date, must be after startDate
- `sideEffects`: Optional array, max 20 items, each max 100 characters
- `foodInteractions`: Optional array, max 20 items, each max 100 characters

---

## API Endpoints Specifications

### Authentication Endpoints

#### POST /auth/register
**Request Body:**
```json
{
  "name": "string (1-100 chars, required)",
  "email": "string (valid email, required)",
  "height": "number (50-300, required)",
  "weight": "number (20-500, required)",
  "age": "number (13-120, required)",
  "gender": "enum (required)",
  "goal": "enum (required)",
  "activityLevel": "enum (required)",
  "firebaseUid": "string (optional)"
}
```

**Response (201):**
```json
{
  "user": User,
  "macroTargets": MacroTargets
}
```

**Validation Errors (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### GET /auth/profile
**Headers:** `Authorization: Bearer <firebase_token>`

**Response (200):**
```json
{
  "user": User,
  "macroTargets": MacroTargets
}
```

### Nutrition Endpoints

#### GET /meals
**Query Parameters:**
- `date`: ISO date string (optional)
- `mealType`: enum (optional)
- `limit`: integer 1-100 (optional, default: 50)
- `offset`: integer ≥0 (optional, default: 0)

**Response (200):**
```json
{
  "meals": Meal[],
  "total": number,
  "hasMore": boolean
}
```

#### POST /meals
**Request Body:**
```json
{
  "name": "string (1-200 chars, required)",
  "calories": "number (1-5000, required)",
  "protein": "number (0-200, required)",
  "carbs": "number (0-500, required)",
  "fat": "number (0-200, required)",
  "fiber": "number (0-100, optional)",
  "sugar": "number (0-200, optional)",
  "date": "ISO date (required)",
  "mealType": "enum (required)",
  "image": "string (optional, max 5MB)"
}
```

**Response (201):**
```json
{
  "meal": Meal,
  "dailyTotals": MacroTargets
}
```

#### PUT /meals/{id}
**Path Parameters:**
- `id`: UUID (required)

**Request Body:** Same as POST /meals

**Response (200):**
```json
{
  "meal": Meal,
  "dailyTotals": MacroTargets
}
```

### Workout Endpoints

#### POST /workouts
**Request Body:**
```json
{
  "name": "string (1-200 chars, required)",
  "exercises": [
    {
      "name": "string (1-100 chars, required)",
      "sets": [
        {
          "reps": "number (1-1000, required)",
          "weight": "number (0-1000, required)",
          "completed": "boolean (required)"
        }
      ],
      "restTime": "number (0-600, optional)",
      "notes": "string (0-500 chars, optional)"
    }
  ],
  "date": "ISO date (required)",
  "duration": "number (1-600, required)",
  "calories": "number (1-2000, required)",
  "notes": "string (0-1000 chars, optional)",
  "images": ["string (optional, max 4, each max 5MB)"]
}
```

**Response (201):**
```json
{
  "workout": Workout,
  "streak": {
    "current": number,
    "longest": number
  }
}
```

### Social Endpoints

#### POST /friends/request
**Request Body:**
```json
{
  "targetUserId": "string (UUID, required)",
  "message": "string (0-500 chars, optional)"
}
```

**Response (201):**
```json
{
  "friendRequest": FriendRequest
}
```

#### GET /friends/search
**Query Parameters:**
- `query`: string 1-100 chars (required)
- `limit`: integer 1-50 (optional, default: 20)

**Response (200):**
```json
{
  "users": FriendSearchResult[],
  "total": number
}
```

### Challenge Endpoints

#### POST /challenges
**Request Body:**
```json
{
  "name": "string (1-100 chars, required)",
  "description": "string (1-1000 chars, required)",
  "startDate": "ISO date (required, not in past)",
  "endDate": "ISO date (required, after startDate)",
  "isPublic": "boolean (required)",
  "rules": "string (1-2000 chars, required)",
  "rewards": "string (1-1000 chars, required)",
  "goals": [
    {
      "name": "string (1-100 chars, required)",
      "description": "string (1-500 chars, required)",
      "targetValue": "number (1-1000000, required)",
      "unit": "string (1-20 chars, required)",
      "type": "enum (required)",
      "deadline": "ISO date (optional)"
    }
  ],
  "category": "enum (required)",
  "maxMembers": "number (2-1000, required)",
  "image": "string (optional, max 5MB)"
}
```

### Medicine Endpoints

#### POST /medicines
**Request Body:**
```json
{
  "name": "string (1-200 chars, required)",
  "dosage": "string (1-50 chars, required)",
  "unit": "enum (required)",
  "frequency": "enum (required)",
  "customFrequency": {
    "times": "number (1-24, required if frequency is custom)",
    "interval": "enum (required if frequency is custom)"
  },
  "timing": "enum (required)",
  "mealType": "enum (optional)",
  "timingOffset": "number (0-120, optional)",
  "reminderTimes": ["string (HH:MM format, 1-8 items, required)"],
  "startDate": "ISO date (required)",
  "endDate": "ISO date (optional, after startDate)",
  "notes": "string (0-1000 chars, optional)",
  "sideEffects": ["string (max 20 items, each max 100 chars, optional)"],
  "foodInteractions": ["string (max 20 items, each max 100 chars, optional)"]
}
```

---

## Error Response Format

### Standard Error Response
```json
{
  "error": "string (error type)",
  "message": "string (human readable message)",
  "details": "object (optional, additional error details)",
  "timestamp": "ISO datetime",
  "path": "string (API endpoint path)"
}
```

### Validation Error Response
```json
{
  "error": "Validation failed",
  "message": "Request validation failed",
  "details": [
    {
      "field": "string (field name)",
      "message": "string (validation error message)",
      "value": "any (submitted value, optional)"
    }
  ],
  "timestamp": "ISO datetime",
  "path": "string (API endpoint path)"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `422`: Unprocessable Entity (business logic error)
- `429`: Too Many Requests (rate limiting)
- `500`: Internal Server Error

---

## Pagination Format

### Request Parameters
- `limit`: integer 1-100 (default: 20)
- `offset`: integer ≥0 (default: 0)
- `sort`: string (field name, optional)
- `order`: 'asc' | 'desc' (default: 'desc')

### Response Format
```json
{
  "data": "array (requested items)",
  "pagination": {
    "total": "number (total items)",
    "limit": "number (items per page)",
    "offset": "number (current offset)",
    "hasMore": "boolean (more items available)"
  }
}
```

---

## File Upload Specifications

### Image Upload Requirements
- **Formats**: JPEG, PNG, WebP
- **Max Size**: 5MB per image
- **Max Dimensions**: 4096x4096 pixels
- **Compression**: Auto-compress to optimize storage
- **Thumbnails**: Generate 150x150 and 300x300 thumbnails

### Upload Response
```json
{
  "url": "string (CDN URL)",
  "thumbnails": {
    "small": "string (150x150 URL)",
    "medium": "string (300x300 URL)"
  },
  "metadata": {
    "size": "number (bytes)",
    "dimensions": {
      "width": "number",
      "height": "number"
    }
  }
}
```

---

## Real-time Features

### WebSocket Events
- `friend_request_received`
- `challenge_invitation`
- `group_message`
- `medicine_reminder`
- `achievement_unlocked`

### Event Format
```json
{
  "type": "string (event type)",
  "data": "object (event data)",
  "timestamp": "ISO datetime",
  "userId": "string (target user ID)"
}
```

---

## Rate Limiting

### Limits by Endpoint Type
- **Authentication**: 5 requests/minute
- **Data Creation**: 60 requests/hour
- **Data Retrieval**: 1000 requests/hour
- **File Upload**: 20 requests/hour
- **Search**: 100 requests/hour

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```
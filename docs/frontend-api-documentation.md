# Vital Sync API Documentation for Frontend Integration

## Overview

This comprehensive API documentation is designed for frontend developers integrating with the Vital Sync backend. The API provides endpoints for fitness tracking, nutrition management, medicine tracking, analytics, and file uploads.

**Base URL:** `http://localhost:8000` (development) / `https://api.vitalsync.com` (production)

**API Version:** 1.0.0

**Authentication:** Firebase Authentication with Bearer tokens

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Nutrition Tracking](#nutrition-tracking)
4. [Workout Management](#workout-management)
5. [Medicine Tracking](#medicine-tracking)
6. [Social Features](#social-features)
7. [Challenges System](#challenges-system)
8. [Rewards & Achievements](#rewards--achievements)
9. [Analytics & Reporting](#analytics--reporting)
10. [File Upload & Media](#file-upload--media)
11. [Error Handling](#error-handling)
12. [Data Types & Schemas](#data-types--schemas)

---

## Authentication

All API endpoints (except health checks) require Firebase authentication. Include the Firebase ID token in the Authorization header.

### Headers Required
```
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

### Register New User
**POST** `/auth/register`

Creates a new user account with Firebase authentication.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "height": 175,
  "weight": 70.5,
  "age": 28,
  "gender": "male",
  "goal": "build_muscle",
  "activity_level": "moderate"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "height": 175,
    "weight": 70.5,
    "age": 28,
    "gender": "male",
    "goal": "build_muscle",
    "activity_level": "moderate",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "macro_targets": {
    "calories": 2500,
    "protein": 150,
    "carbs": 300,
    "fat": 85
  }
}
```

### Login User
**POST** `/auth/login`

Authenticates user with Firebase token.

**Request:** Firebase token in Authorization header

**Response (200):**
```json
{
  "message": "Login successful",
  "user": { /* User object */ },
  "macro_targets": { /* Macro targets */ },
  "is_new_user": false
}
```

### Get User Profile
**GET** `/auth/profile`

Retrieves current user's profile and macro targets.

**Response (200):**
```json
{
  "user": { /* User object */ },
  "macro_targets": { /* Macro targets */ },
  "stats": {
    "total_workouts": 45,
    "total_meals": 120,
    "current_streak": 7
  },
  "profile_completion": 85
}
```

### Update User Profile
**PUT** `/auth/profile`

Updates user profile information.

**Request Body:**
```json
{
  "name": "John Smith",
  "weight": 72.0,
  "goal": "lose_weight",
  "activity_level": "active"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": { /* Updated user object */ },
  "macro_targets": { /* Recalculated macro targets */ }
}
```

### Delete Account
**DELETE** `/auth/account`

Permanently deletes user account and all associated data.

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

### Logout
**POST** `/auth/logout`

Revokes Firebase refresh tokens.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Nutrition Tracking

### Get Meals
**GET** `/nutrition/meals`

Retrieves user's meals with filtering and pagination.

**Query Parameters:**
- `date_filter` (optional): Filter by specific date (YYYY-MM-DD)
- `meal_type` (optional): Filter by meal type (breakfast, lunch, dinner, snack)
- `limit` (optional): Maximum results (1-100, default: 50)
- `offset` (optional): Results offset (default: 0)

**Response (200):**
```json
{
  "meals": [
    {
      "id": "uuid",
      "name": "Grilled Chicken Salad",
      "calories": 450,
      "protein": 35.5,
      "carbs": 25.0,
      "fat": 18.5,
      "fiber": 8.0,
      "sugar": 12.0,
      "date": "2024-01-01",
      "meal_type": "lunch",
      "image_url": "https://...",
      "notes": "Extra dressing on the side",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ],
  "total": 1,
  "has_more": false,
  "daily_totals": {
    "date": "2024-01-01",
    "total_calories": 1850,
    "total_protein": 125.5,
    "total_carbs": 200.0,
    "total_fat": 65.0,
    "total_fiber": 35.0,
    "total_sugar": 45.0,
    "meal_count": 4
  }
}
```

### Create Meal
**POST** `/nutrition/meals`

Creates a new meal entry.

**Request Body:**
```json
{
  "name": "Oatmeal with Berries",
  "calories": 320,
  "protein": 12.0,
  "carbs": 58.0,
  "fat": 6.5,
  "fiber": 8.0,
  "sugar": 15.0,
  "date": "2024-01-01",
  "meal_type": "breakfast",
  "image_url": "https://...",
  "notes": "Added honey for sweetness"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Oatmeal with Berries",
  "calories": 320,
  "protein": 12.0,
  "carbs": 58.0,
  "fat": 6.5,
  "fiber": 8.0,
  "sugar": 15.0,
  "date": "2024-01-01",
  "meal_type": "breakfast",
  "image_url": "https://...",
  "notes": "Added honey for sweetness",
  "created_at": "2024-01-01T08:00:00Z",
  "updated_at": "2024-01-01T08:00:00Z"
}
```

### Update Meal
**PUT** `/nutrition/meals/{meal_id}`

Updates an existing meal.

**Request Body:** Same as Create Meal (all fields optional)

**Response (200):** Updated meal object

### Delete Meal
**DELETE** `/nutrition/meals/{meal_id}`

Deletes a meal entry.

**Response (200):**
```json
{
  "message": "Meal deleted successfully"
}
```

### Get Meals by Date
**GET** `/nutrition/meals/date/{target_date}`

Gets all meals for a specific date.

**Path Parameters:**
- `target_date`: Date in YYYY-MM-DD format

**Response (200):** Array of meal objects

### Get Daily Totals
**GET** `/nutrition/daily-totals/{target_date}`

Gets macro totals for a specific date.

**Response (200):**
```json
{
  "date": "2024-01-01",
  "total_calories": 1850,
  "total_protein": 125.5,
  "total_carbs": 200.0,
  "total_fat": 65.0,
  "total_fiber": 35.0,
  "total_sugar": 45.0,
  "meal_count": 4
}
```

### Search Foods
**GET** `/nutrition/search`

Searches external nutrition databases for food information.

**Query Parameters:**
- `query`: Food search query (2-100 characters)
- `limit`: Maximum results (1-50, default: 20)

**Response (200):**
```json
[
  {
    "name": "Chicken Breast",
    "calories_per_100g": 165,
    "protein_per_100g": 31.0,
    "carbs_per_100g": 0.0,
    "fat_per_100g": 3.6,
    "fiber_per_100g": 0.0,
    "source": "USDA",
    "barcode": null
  }
]
```

### Lookup Barcode
**GET** `/nutrition/barcode/{barcode}`

Looks up nutrition data by product barcode.

**Path Parameters:**
- `barcode`: Product barcode (8+ digits)

**Response (200):**
```json
{
  "product_name": "Organic Whole Milk",
  "brand": "Brand Name",
  "calories_per_100g": 61,
  "protein_per_100g": 3.2,
  "carbs_per_100g": 4.8,
  "fat_per_100g": 3.3,
  "barcode": "1234567890123",
  "image_url": "https://..."
}
```

### Meal Presets

#### Get Meal Presets
**GET** `/nutrition/meal-presets`

**Query Parameters:**
- `include_public`: Include public presets (default: true)
- `limit`, `offset`: Pagination

#### Create Meal Preset
**POST** `/nutrition/meal-presets`

**Request Body:**
```json
{
  "name": "My Protein Smoothie",
  "calories": 280,
  "protein": 25.0,
  "carbs": 30.0,
  "fat": 8.0,
  "meal_type": "snack",
  "is_public": false,
  "notes": "Post-workout smoothie recipe"
}
```

#### Use Meal Preset
**POST** `/nutrition/meal-presets/{preset_id}/use`

Creates a meal from a preset.

**Request Body:**
```json
{
  "date": "2024-01-01",
  "meal_type": "breakfast",
  "notes": "Modified with extra banana"
}
```

---

## Workout Management

### Get Workouts
**GET** `/workouts`

Retrieves user's workouts with filtering and pagination.

**Query Parameters:**
- `date_filter` (optional): Filter by specific date
- `limit`, `offset`: Pagination

**Response (200):**
```json
{
  "workouts": [
    {
      "id": "uuid",
      "name": "Upper Body Strength",
      "date": "2024-01-01",
      "duration": 45,
      "calories": 320,
      "notes": "Great session!",
      "images": ["https://..."],
      "exercises": [
        {
          "id": "uuid",
          "name": "Bench Press",
          "order_index": 1,
          "rest_time": 120,
          "notes": "Focus on form",
          "sets": [
            {
              "id": "uuid",
              "reps": 10,
              "weight": 80.0,
              "completed": true,
              "order_index": 1
            }
          ]
        }
      ],
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 1,
  "has_more": false
}
```

### Create Workout
**POST** `/workouts`

Creates a new workout.

**Request Body:**
```json
{
  "name": "Push Day",
  "date": "2024-01-01",
  "duration": 60,
  "calories": 400,
  "notes": "Focused on progressive overload",
  "images": ["https://..."],
  "exercises": [
    {
      "name": "Push-ups",
      "rest_time": 60,
      "notes": "Slow and controlled",
      "sets": [
        {
          "reps": 15,
          "weight": 0.0,
          "completed": true
        },
        {
          "reps": 12,
          "weight": 0.0,
          "completed": true
        }
      ]
    }
  ]
}
```

**Response (201):** Created workout object

### Update Workout
**PUT** `/workouts/{workout_id}`

Updates an existing workout.

### Delete Workout
**DELETE** `/workouts/{workout_id}`

Deletes a workout.

### Get Workout Streak
**GET** `/workouts/streak/info`

Gets workout streak information.

**Response (200):**
```json
{
  "current_streak": 7,
  "longest_streak": 15,
  "last_workout_date": "2024-01-01",
  "streak_start_date": "2023-12-25"
}
```

### Get Workout Stats
**GET** `/workouts/stats/summary`

Gets comprehensive workout statistics.

**Query Parameters:**
- `days`: Number of days to analyze (1-365, default: 30)

**Response (200):**
```json
{
  "total_workouts": 25,
  "total_duration": 1200,
  "total_calories": 8500,
  "average_duration": 48.0,
  "average_calories": 340.0,
  "current_streak": 7,
  "longest_streak": 15,
  "workouts_this_week": 4,
  "workouts_this_month": 18,
  "favorite_exercises": [
    {
      "name": "Push-ups",
      "count": 15,
      "total_sets": 45
    }
  ]
}
```

### Workout Presets

Similar to meal presets, workout presets allow saving and reusing workout templates.

#### Get Workout Presets
**GET** `/workouts/presets`

#### Create Workout Preset
**POST** `/workouts/presets`

#### Use Workout Preset
**POST** `/workouts/presets/{preset_id}/use`

---

## Medicine Tracking

### Get Medicines
**GET** `/medicines`

Retrieves user's medicines with filtering.

**Query Parameters:**
- `is_active`: Filter by active status (true/false)
- `limit`, `offset`: Pagination

**Response (200):**
```json
{
  "medicines": [
    {
      "id": "uuid",
      "name": "Vitamin D3",
      "dosage": "1000",
      "unit": "units",
      "frequency": "once_daily",
      "timing": "with_meal",
      "meal_type": "breakfast",
      "reminder_times": ["08:00"],
      "start_date": "2024-01-01",
      "end_date": null,
      "is_active": true,
      "notes": "Take with breakfast for better absorption",
      "side_effects": [],
      "food_interactions": ["Avoid with high-fiber foods"],
      "image_url": "https://...",
      "color": "#FFD700",
      "shape": "capsule",
      "last_taken": "2024-01-01T08:15:00Z",
      "missed_doses": 2,
      "total_doses": 30,
      "adherence_rate": 93.3,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "has_more": false
}
```

### Create Medicine
**POST** `/medicines`

Creates a new medicine entry.

**Request Body:**
```json
{
  "name": "Omega-3 Fish Oil",
  "dosage": "1000",
  "unit": "mg",
  "frequency": "twice_daily",
  "timing": "after_meal",
  "meal_type": "any_meal",
  "timing_offset": 30,
  "reminder_times": ["08:30", "20:30"],
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "notes": "Take with food to reduce stomach upset",
  "side_effects": ["Mild stomach upset if taken on empty stomach"],
  "food_interactions": ["Take with fatty foods for better absorption"],
  "image_url": "https://...",
  "color": "#FFA500",
  "shape": "softgel"
}
```

**Response (201):** Created medicine object

### Update Medicine
**PUT** `/medicines/{medicine_id}`

Updates medicine details and regenerates reminders if schedule changes.

### Delete Medicine
**DELETE** `/medicines/{medicine_id}`

Soft deletes medicine (sets as inactive).

### Get Upcoming Reminders
**GET** `/medicines/reminders/upcoming`

Gets upcoming medicine reminders.

**Query Parameters:**
- `hours_ahead`: Hours to look ahead (1-168, default: 24)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "medicine_id": "uuid",
    "medicine_name": "Vitamin D3",
    "scheduled_time": "2024-01-01T08:00:00Z",
    "reminder_time": "08:00",
    "status": "pending",
    "snooze_count": 0,
    "notes": null
  }
]
```

### Mark Reminder as Taken
**POST** `/medicines/reminders/{reminder_id}/taken`

Records when medicine was taken.

**Request Body:**
```json
{
  "taken_at": "2024-01-01T08:15:00Z",
  "dosage_taken": "1000",
  "side_effects_experienced": [],
  "effectiveness_rating": 5,
  "notes": "Took with breakfast as recommended"
}
```

### Mark Reminder as Missed
**POST** `/medicines/reminders/{reminder_id}/missed`

Records missed dose.

**Request Body:**
```json
{
  "notes": "Forgot to take with breakfast"
}
```

### Snooze Reminder
**POST** `/medicines/reminders/{reminder_id}/snooze`

Delays reminder by specified minutes.

**Request Body:**
```json
{
  "snooze_minutes": 15
}
```

### Get Medicine Logs
**GET** `/medicines/logs`

Gets history of medicine taking activities.

**Query Parameters:**
- `medicine_id`: Filter by specific medicine
- `start_date`, `end_date`: Date range filter
- `limit`, `offset`: Pagination

### Get Adherence Statistics
**GET** `/medicines/stats/adherence`

Gets comprehensive adherence statistics.

**Query Parameters:**
- `days`: Number of days to analyze (1-365, default: 30)

**Response (200):**
```json
{
  "total_medicines": 3,
  "active_medicines": 3,
  "total_doses_scheduled": 90,
  "doses_taken": 85,
  "doses_missed": 5,
  "overall_adherence_rate": 94.4,
  "adherence_by_medicine": [
    {
      "medicine_name": "Vitamin D3",
      "adherence_rate": 96.7,
      "doses_taken": 29,
      "doses_missed": 1
    }
  ],
  "recent_activity": [
    {
      "date": "2024-01-01",
      "medicines_taken": 3,
      "medicines_missed": 0
    }
  ]
}
```

---

## Social Features

### Get Friends List
**GET** `/social/friends`

Retrieves user's friends list with pagination.

**Query Parameters:**
- `limit`: Maximum results (1-100, default: 20)
- `offset`: Results offset (default: 0)

**Response (200):**
```json
{
  "friends": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "friend_id": "uuid",
      "friends_since": "2024-01-01T00:00:00Z",
      "friend_name": "Jane Smith",
      "friend_email": "jane@example.com",
      "friend_avatar_url": "https://...",
      "is_achievements_public": true,
      "status": "online",
      "mutual_friends_count": 5
    }
  ],
  "total": 1,
  "has_more": false
}
```

### Send Friend Request
**POST** `/social/friends/request`

Sends a friend request to another user.

**Request Body:**
```json
{
  "receiver_id": "uuid",
  "message": "Hi! Let's be fitness buddies!"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "sender_id": "uuid",
  "receiver_id": "uuid",
  "message": "Hi! Let's be fitness buddies!",
  "status": "pending",
  "created_at": "2024-01-01T12:00:00Z",
  "sender_name": "John Doe",
  "receiver_name": "Jane Smith"
}
```

### Accept Friend Request
**PUT** `/social/friends/request/{request_id}/accept`

Accepts a pending friend request.

**Response (200):**
```json
{
  "message": "Friend request accepted",
  "friendship_created": true
}
```

### Decline Friend Request
**PUT** `/social/friends/request/{request_id}/decline`

Declines a pending friend request.

### Remove Friend
**DELETE** `/social/friends/{friend_id}`

Removes a friend from the user's friends list.

### Get Friend Requests
**GET** `/social/friends/requests`

Gets user's friend requests (sent and received).

**Query Parameters:**
- `status`: Filter by status (pending, accepted, declined)
- `type`: Filter by type (sent, received)

### Search Users
**GET** `/social/friends/search`

Searches for users to add as friends.

**Query Parameters:**
- `query`: Search query (2-100 characters)
- `limit`: Maximum results (1-50, default: 20)

**Response (200):**
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "avatar_url": "https://...",
      "is_achievements_public": true,
      "mutual_friends_count": 3,
      "is_friend": false,
      "has_pending_request": false
    }
  ],
  "total": 1
}
```

### Generate QR Code for Adding
**POST** `/social/friends/qr-code`

Generates a QR code for easy friend adding.

**Response (201):**
```json
{
  "qr_code_data": "{'type': 'friend_request', 'user_id': 'uuid', ...}",
  "expires_at": "2024-01-02T12:00:00Z"
}
```

### Groups Management

#### Get User's Groups
**GET** `/social/groups`

Gets groups that the user is a member of.

**Response (200):**
```json
{
  "groups": [
    {
      "id": "uuid",
      "name": "Morning Runners",
      "description": "Early morning running group",
      "creator_id": "uuid",
      "is_public": true,
      "max_members": 50,
      "image_url": "https://...",
      "invite_code": "ABC123",
      "created_at": "2024-01-01T00:00:00Z",
      "creator_name": "John Doe",
      "member_count": 25,
      "user_role": "member"
    }
  ],
  "total": 1,
  "has_more": false
}
```

#### Create Group
**POST** `/social/groups`

Creates a new fitness group.

**Request Body:**
```json
{
  "name": "Evening Yoga",
  "description": "Relaxing evening yoga sessions",
  "is_public": false,
  "max_members": 20,
  "image_url": "https://..."
}
```

#### Join Group
**POST** `/social/groups/{group_id}/join`

Joins a group using invite code or direct join (for public groups).

**Request Body:**
```json
{
  "invite_code": "XYZ789"
}
```

#### Leave Group
**DELETE** `/social/groups/{group_id}/leave`

Leaves a group.

#### Get Group Messages
**GET** `/social/groups/{group_id}/chat`

Gets group chat messages.

**Query Parameters:**
- `limit`, `offset`: Pagination
- `since`: Get messages since timestamp

**Response (200):**
```json
{
  "messages": [
    {
      "id": "uuid",
      "group_id": "uuid",
      "sender_id": "uuid",
      "content": "Great workout today!",
      "message_type": "text",
      "metadata": null,
      "created_at": "2024-01-01T12:00:00Z",
      "sender_name": "John Doe",
      "sender_avatar_url": "https://..."
    }
  ],
  "total": 1,
  "has_more": false
}
```

#### Send Group Message
**POST** `/social/groups/{group_id}/chat`

Sends a message to the group chat.

**Request Body:**
```json
{
  "content": "Looking forward to tomorrow's session!",
  "message_type": "text",
  "metadata": null
}
```

#### Share Meal in Group
**POST** `/social/groups/{group_id}/share-meal`

Shares a meal with the group.

**Request Body:**
```json
{
  "meal_id": "uuid",
  "message": "Check out my healthy lunch!"
}
```

#### Share Workout in Group
**POST** `/social/groups/{group_id}/share-workout`

Shares a workout with the group.

**Request Body:**
```json
{
  "workout_id": "uuid",
  "message": "Crushed this workout today!"
}
```

---

## Challenges System

### Get Available Challenges
**GET** `/challenges`

Gets available challenges with filtering and pagination.

**Query Parameters:**
- `category`: Filter by category (steps, workouts, meals, weight, custom)
- `status`: Filter by status (upcoming, active, completed)
- `is_public`: Filter by public/private challenges
- `search`: Search in challenge names
- `creator_id`: Filter by creator
- `limit`, `offset`: Pagination

**Response (200):**
```json
{
  "challenges": [
    {
      "id": "uuid",
      "name": "30-Day Fitness Challenge",
      "description": "Complete 30 workouts in 30 days",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "creator_id": "uuid",
      "is_active": true,
      "is_public": true,
      "rules": "Complete at least one workout per day",
      "rewards": "Achievement badge and bragging rights!",
      "category": "workouts",
      "max_members": 100,
      "image_url": "https://...",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "creator_name": "Fitness Coach",
      "member_count": 45,
      "goals": [
        {
          "id": "uuid",
          "name": "Daily Workout",
          "description": "Complete one workout per day",
          "target_value": 30.0,
          "unit": "workouts",
          "goal_type": "total",
          "weight": 1.0,
          "is_required": true
        }
      ],
      "user_is_member": false,
      "user_rank": null,
      "user_score": 0.0
    }
  ],
  "total": 1,
  "has_more": false
}
```

### Create Challenge
**POST** `/challenges`

Creates a new fitness challenge.

**Request Body:**
```json
{
  "name": "Weekly Step Challenge",
  "description": "Walk 10,000 steps every day for a week",
  "start_date": "2024-01-15",
  "end_date": "2024-01-21",
  "is_public": true,
  "rules": "Track your daily steps and aim for 10,000+ each day",
  "rewards": "Step Master badge and 500 points",
  "category": "steps",
  "max_members": 50,
  "image_url": "https://...",
  "goals": [
    {
      "name": "Daily Steps",
      "description": "Walk 10,000 steps per day",
      "target_value": 10000.0,
      "unit": "steps",
      "goal_type": "daily_average",
      "weight": 1.0,
      "is_required": true,
      "deadline": "2024-01-21"
    }
  ]
}
```

### Join Challenge
**POST** `/challenges/{challenge_id}/join`

Joins a challenge.

**Response (200):**
```json
{
  "message": "Successfully joined the challenge",
  "member_id": "uuid",
  "joined_at": "2024-01-01T12:00:00Z"
}
```

### Leave Challenge
**DELETE** `/challenges/{challenge_id}/leave`

Leaves a challenge.

### Get Challenge Leaderboard
**GET** `/challenges/{challenge_id}/leaderboard`

Gets the challenge leaderboard.

**Query Parameters:**
- `limit`, `offset`: Pagination

**Response (200):**
```json
{
  "challenge_id": "uuid",
  "challenge_name": "30-Day Fitness Challenge",
  "total_members": 45,
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "uuid",
      "user_name": "Jane Smith",
      "user_avatar_url": "https://...",
      "current_score": 95.5,
      "completion_percentage": 95.5,
      "joined_at": "2024-01-01T00:00:00Z"
    }
  ],
  "user_entry": {
    "rank": 15,
    "user_id": "uuid",
    "user_name": "John Doe",
    "current_score": 78.2,
    "completion_percentage": 78.2
  }
}
```

### Update Challenge Progress
**PUT** `/challenges/{challenge_id}/progress`

Updates user's progress for a challenge goal.

**Request Body:**
```json
{
  "goal_id": "uuid",
  "progress_value": 8500.0,
  "progress_date": "2024-01-01",
  "notes": "Great day of walking!",
  "metadata": {
    "source": "fitness_tracker",
    "activity_type": "walking"
  }
}
```

### Get User's Challenge Progress
**GET** `/challenges/{challenge_id}/progress`

Gets user's progress for all goals in a challenge.

**Response (200):**
```json
[
  {
    "id": "uuid",
    "challenge_id": "uuid",
    "member_id": "uuid",
    "goal_id": "uuid",
    "current_value": 8500.0,
    "progress_date": "2024-01-01",
    "notes": "Great day of walking!",
    "metadata": {},
    "created_at": "2024-01-01T20:00:00Z",
    "goal_name": "Daily Steps",
    "goal_target_value": 10000.0,
    "goal_unit": "steps",
    "goal_type": "daily_average",
    "progress_percentage": 85.0
  }
]
```

### Get Challenge Templates
**GET** `/challenges/templates`

Gets predefined challenge templates for quick setup.

**Response (200):**
```json
[
  {
    "name": "30-Day Workout Challenge",
    "description": "Build a consistent workout habit",
    "category": "workouts",
    "duration_days": 30,
    "suggested_goals": [
      {
        "name": "Daily Workout",
        "target_value": 1.0,
        "unit": "workout",
        "goal_type": "daily_average"
      }
    ],
    "rules_template": "Complete at least one workout per day",
    "rewards_template": "Achievement badge and bragging rights!"
  }
]
```

---

## Rewards & Achievements

### Get Available Rewards
**GET** `/rewards`

Gets available rewards that users can claim.

**Query Parameters:**
- `reward_type`: Filter by type (badge, points, discount, coupon, achievement, special)
- `is_active`: Filter by active status
- `limit`, `offset`: Pagination

**Response (200):**
```json
{
  "rewards": [
    {
      "id": "uuid",
      "name": "Gold Badge",
      "description": "A gold achievement badge for your profile",
      "reward_type": "badge",
      "value": "gold",
      "image_url": "https://...",
      "icon_url": "https://...",
      "is_active": true,
      "start_date": null,
      "end_date": null,
      "max_claims": null,
      "current_claims": 15,
      "required_points": 1000,
      "required_achievement_ids": null,
      "required_challenge_ids": null,
      "metadata": {},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "is_claimable": false,
      "user_has_claimed": false
    }
  ],
  "total_count": 1,
  "has_more": false
}
```

### Get Specific Reward
**GET** `/rewards/{reward_id}`

Gets details of a specific reward.

### Claim Reward
**POST** `/rewards/{reward_id}/claim`

Claims a reward for the current user.

**Request Body:**
```json
{
  "notes": "Excited to get this badge!"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "reward_id": "uuid",
  "status": "claimed",
  "claimed_at": "2024-01-01T12:00:00Z",
  "expires_at": null,
  "used_at": null,
  "metadata": {},
  "notes": "Excited to get this badge!",
  "reward_name": "Gold Badge",
  "reward_description": "A gold achievement badge for your profile",
  "reward_type": "badge",
  "reward_value": "gold",
  "reward_image_url": "https://...",
  "reward_icon_url": "https://..."
}
```

### Get User's Rewards
**GET** `/rewards/user/{user_id}`

Gets rewards claimed by a specific user.

**Query Parameters:**
- `status`: Filter by status (available, claimed, expired, locked)
- `limit`, `offset`: Pagination

### Get Available Achievements
**GET** `/achievements`

Gets available achievements with user progress.

**Query Parameters:**
- `category`: Filter by category (nutrition, workout, medicine, social, challenge, general)
- `achievement_type`: Filter by type (milestone, streak, goal_completion, social, special, first_time)
- `is_active`: Filter by active status
- `include_hidden`: Include hidden achievements
- `limit`, `offset`: Pagination

**Response (200):**
```json
{
  "achievements": [
    {
      "id": "uuid",
      "name": "First Meal",
      "description": "Log your first meal and start tracking your nutrition",
      "achievement_type": "first_time",
      "category": "nutrition",
      "difficulty": "easy",
      "icon_url": "https://...",
      "badge_url": "https://...",
      "color": "#FF9800",
      "target_value": 1.0,
      "target_unit": "meal",
      "criteria": {
        "action": "meal_logged",
        "count": 1
      },
      "points_reward": 25,
      "reward_ids": null,
      "is_active": true,
      "is_hidden": false,
      "metadata": {},
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "user_progress": 1.0,
      "progress_percentage": 100.0,
      "is_unlocked": true,
      "unlocked_at": "2024-01-01T08:30:00Z"
    }
  ],
  "total_count": 1,
  "has_more": false
}
```

### Get Specific Achievement
**GET** `/achievements/{achievement_id}`

Gets details of a specific achievement with user progress.

### Unlock Achievement
**POST** `/achievements/{achievement_id}/unlock`

Manually unlocks an achievement (typically used by system processes).

### Get User's Achievements
**GET** `/achievements/user/{user_id}`

Gets achievement progress for a specific user.

**Query Parameters:**
- `is_unlocked`: Filter by unlocked status
- `category`: Filter by category
- `limit`, `offset`: Pagination

### Get Current User's Achievement Progress
**GET** `/achievements/progress`

Gets the current user's achievement progress.

**Response (200):**
```json
{
  "achievements": [
    {
      "id": "uuid",
      "achievement_id": "uuid",
      "current_progress": 15.0,
      "target_progress": 50.0,
      "progress_percentage": 30.0,
      "is_unlocked": false,
      "unlocked_at": null,
      "progress_data": {
        "meals_logged": 15,
        "last_meal_date": "2024-01-01"
      },
      "notes": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "achievement_name": "Nutrition Enthusiast",
      "achievement_description": "Log 50 meals and show your commitment to healthy eating",
      "achievement_type": "milestone",
      "category": "nutrition",
      "difficulty": "medium",
      "icon_url": "https://...",
      "badge_url": "https://...",
      "color": "#FF9800",
      "points_reward": 250
    }
  ],
  "total_count": 1,
  "has_more": false
}
```

### Get User's Points Balance
**GET** `/points`

Gets the current user's points balance.

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "total_points": 1250,
  "available_points": 850,
  "spent_points": 400,
  "lifetime_earned": 1250,
  "lifetime_spent": 400,
  "last_earned_at": "2024-01-01T12:00:00Z",
  "last_spent_at": "2024-01-01T10:00:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### Get Points Transaction History
**GET** `/points/history`

Gets the user's points transaction history.

**Query Parameters:**
- `transaction_type`: Filter by type (achievement_unlock, reward_claim, etc.)
- `limit`, `offset`: Pagination

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "amount": 25,
      "transaction_type": "achievement_unlock",
      "description": "Unlocked achievement: First Meal",
      "reference_id": "uuid",
      "reference_type": "achievement",
      "metadata": {},
      "created_at": "2024-01-01T08:30:00Z"
    },
    {
      "id": "uuid",
      "amount": -100,
      "transaction_type": "reward_claim",
      "description": "Claimed reward: Bronze Badge",
      "reference_id": "uuid",
      "reference_type": "reward",
      "metadata": {},
      "created_at": "2024-01-01T10:00:00Z"
    }
  ],
  "total_count": 2,
  "current_balance": 850
}
```

### Get Challenge Rewards
**GET** `/rewards/challenges/{challenge_id}`

Gets rewards and achievements specific to a challenge.

**Response (200):**
```json
{
  "challenge_id": "uuid",
  "challenge_name": "30-Day Fitness Challenge",
  "rewards": [
    {
      "id": "uuid",
      "name": "Challenge Completion Badge",
      "description": "Badge for completing the 30-day fitness challenge",
      "reward_type": "badge",
      "required_challenge_ids": ["uuid"],
      "is_claimable": false,
      "user_has_claimed": false
    }
  ],
  "achievements": [
    {
      "id": "uuid",
      "name": "Challenge Champion",
      "description": "Complete your first fitness challenge",
      "category": "challenge",
      "points_reward": 500,
      "is_unlocked": false,
      "progress_percentage": 75.0
    }
  ],
  "total_points_available": 500
}
```

---

## Analytics & Reporting

### Get Nutrition Analytics
**GET** `/analytics/nutrition`

Gets comprehensive nutrition analytics.

**Query Parameters:**
- `start_date`, `end_date`: Date range (optional)
- `days`: Number of days to analyze (1-365, default: 30)

**Response (200):**
```json
{
  "analytics": {
    "period_summary": {
      "total_meals": 120,
      "average_daily_calories": 2150,
      "days_tracked": 30
    },
    "daily_summaries": [
      {
        "date": "2024-01-01",
        "actual": {
          "calories": 2200,
          "protein": 140,
          "carbs": 250,
          "fat": 80
        },
        "target": {
          "calories": 2500,
          "protein": 150,
          "carbs": 300,
          "fat": 85
        },
        "adherence_percentage": 88.0,
        "meal_count": 4
      }
    ],
    "macro_trends": {
      "calories": [2200, 2150, 2300, 2100],
      "protein": [140, 135, 145, 130]
    },
    "adherence_stats": {
      "overall_adherence": 85.5,
      "calories_adherence": 88.0,
      "protein_adherence": 90.0,
      "carbs_adherence": 82.0,
      "fat_adherence": 85.0
    },
    "meal_timing_patterns": {
      "breakfast": 28,
      "lunch": 30,
      "dinner": 30,
      "snack": 32
    }
  },
  "generated_at": "2024-01-01T12:00:00Z",
  "period_analyzed": "30 days"
}
```

### Get Workout Analytics
**GET** `/analytics/workouts`

Gets comprehensive workout analytics.

**Response (200):**
```json
{
  "analytics": {
    "frequency_stats": {
      "total_workouts": 25,
      "average_per_week": 4.2,
      "most_active_day": "Monday",
      "least_active_day": "Sunday",
      "workout_days": 20,
      "rest_days": 10
    },
    "performance_trends": [
      {
        "exercise_name": "Bench Press",
        "total_sets": 45,
        "total_reps": 450,
        "total_weight": 3600.0,
        "average_weight": 80.0,
        "max_weight": 90.0,
        "progression_percentage": 12.5
      }
    ],
    "duration_analysis": {
      "total_duration": 1200,
      "average_duration": 48.0,
      "shortest_workout": 25,
      "longest_workout": 75
    }
  },
  "generated_at": "2024-01-01T12:00:00Z",
  "period_analyzed": "30 days"
}
```

### Get Progress Tracking
**GET** `/analytics/workouts/progress`

Gets progress tracking analytics including strength gains and performance improvements.

### Get Streak Analysis
**GET** `/analytics/streaks`

Gets streak analysis for workouts or nutrition.

**Query Parameters:**
- `activity_type`: Type of activity ('workout' or 'nutrition')
- `days`: Number of days to analyze (1-365, default: 365)

**Response (200):**
```json
{
  "streaks": {
    "current_streak": 7,
    "longest_streak": 15,
    "streak_history": [
      {
        "start_date": "2023-12-01",
        "end_date": "2023-12-15",
        "length": 15
      }
    ],
    "streak_breakdown_reasons": {
      "missed_day": 3,
      "illness": 1,
      "travel": 2
    },
    "consistency_score": 78.5
  },
  "generated_at": "2024-01-01T12:00:00Z",
  "period_analyzed": "365 days"
}
```

### Get Health Metrics
**GET** `/analytics/health/metrics`

Gets comprehensive health metrics.

**Response (200):**
```json
{
  "current_weight": 70.5,
  "target_weight": 68.0,
  "bmi": 23.1,
  "bmi_category": "Normal weight",
  "body_fat_estimate": 15.2,
  "water_intake_recommendation": 2.5,
  "calories_burned_estimate": 2200
}
```

### Get Current Macro Targets
**GET** `/analytics/health/macro-targets`

Gets current macro targets for the user.

### Recalculate Macro Targets
**POST** `/analytics/health/calculate-macros`

Recalculates macro targets with updated user data.

**Request Body:**
```json
{
  "weight": 72.0,
  "activity_level": "active",
  "goal": "build_muscle"
}
```

### Get BMR Calculation
**GET** `/analytics/health/bmr`

Gets BMR (Basal Metabolic Rate) calculation.

**Response (200):**
```json
{
  "bmr": 1650.5,
  "formula": "Mifflin-St Jeor equation",
  "user_data": {
    "weight": 70.5,
    "height": 175,
    "age": 28,
    "gender": "male"
  },
  "calculated_at": "2024-01-01T12:00:00Z"
}
```

### Get TDEE Calculation
**GET** `/analytics/health/tdee`

Gets TDEE (Total Daily Energy Expenditure) calculation.

**Response (200):**
```json
{
  "tdee": 2558.3,
  "bmr": 1650.5,
  "activity_level": "moderate",
  "activity_multiplier": 1.55,
  "calculated_at": "2024-01-01T12:00:00Z"
}
```

### Get Analytics Dashboard
**GET** `/analytics/dashboard`

Gets combined analytics dashboard data with key metrics from all areas.

**Query Parameters:**
- `days`: Number of days to analyze (1-90, default: 30)

**Response (200):**
```json
{
  "period_analyzed": "30 days",
  "nutrition_summary": {
    "total_meals": 120,
    "average_daily_calories": 2150,
    "adherence_rate": 85.5,
    "current_streak": 12
  },
  "workout_summary": {
    "total_workouts": 25,
    "average_per_week": 4.2,
    "total_duration": 1200,
    "current_streak": 7
  },
  "health_metrics": {
    "current_weight": 70.5,
    "bmi": 23.1,
    "bmi_category": "Normal weight",
    "daily_calorie_target": 2500
  },
  "achievements": [
    {
      "type": "nutrition_streak",
      "value": 15,
      "description": "Longest nutrition streak: 15 days"
    }
  ],
  "recommendations": [
    "Consider meal prepping to improve nutrition consistency",
    "Try to increase workout frequency to 3-4 times per week"
  ],
  "generated_at": "2024-01-01T12:00:00Z"
}
```

---

## File Upload & Media

### Upload Meal Image
**POST** `/upload/meal-image`

Uploads a meal photo with automatic thumbnail generation.

**Request:** Multipart form data
- `file`: Image file (JPEG, PNG, WebP, max 5MB)
- `description` (optional): Image description (max 500 chars)
- `tags` (optional): Comma-separated tags

**Response (201):**
```json
{
  "file_id": "uuid",
  "original_url": "https://cdn.example.com/meals/original/uuid.jpg",
  "thumbnail_urls": {
    "small": "https://cdn.example.com/meals/thumbs/150x150/uuid.jpg",
    "medium": "https://cdn.example.com/meals/thumbs/300x300/uuid.jpg",
    "large": "https://cdn.example.com/meals/thumbs/600x600/uuid.jpg"
  },
  "file_size": 1024000,
  "file_type": "image/jpeg",
  "width": 1920,
  "height": 1080,
  "uploaded_at": "2024-01-01T12:00:00Z"
}
```

### Upload Workout Images
**POST** `/upload/workout-images`

Uploads multiple workout photos (up to 4 images).

**Request:** Multipart form data
- `files`: Image files (max 4, each max 5MB)
- `descriptions` (optional): Pipe-separated descriptions
- `tags` (optional): Pipe-separated tag lists

**Response (201):**
```json
{
  "successful_uploads": [
    {
      "file_id": "uuid",
      "original_url": "https://...",
      "thumbnail_urls": { /* ... */ }
    }
  ],
  "failed_uploads": [],
  "total_files": 2,
  "success_count": 2,
  "failure_count": 0
}
```

### Upload Avatar
**POST** `/upload/avatar`

Uploads profile avatar image.

### Upload Challenge Image
**POST** `/upload/challenge-image`

Uploads challenge-related image.

### Get User Files
**GET** `/upload/files`

Gets user's uploaded files with filtering and pagination.

**Query Parameters:**
- `folder`: Filter by folder (meal, workout, avatar, challenge)
- `limit`, `offset`: Pagination

**Response (200):**
```json
{
  "files": [
    {
      "file_id": "uuid",
      "original_url": "https://...",
      "thumbnail_urls": { /* ... */ },
      "file_size": 1024000,
      "uploaded_at": "2024-01-01T12:00:00Z"
    }
  ],
  "total": 1,
  "has_more": false,
  "search_params": {
    "folder": "meal",
    "limit": 20,
    "offset": 0
  }
}
```

### Delete File
**DELETE** `/upload/files/{file_id}`

Deletes a file and its thumbnails.

**Response (200):**
```json
{
  "message": "File deleted successfully",
  "file_id": "uuid"
}
```

### Bulk Delete Files
**POST** `/upload/files/bulk-delete`

Deletes multiple files.

**Request Body:**
```json
{
  "file_ids": ["uuid1", "uuid2"],
  "force_delete": false
}
```

### Get Storage Usage
**GET** `/upload/storage/usage`

Gets storage usage statistics.

**Response (200):**
```json
{
  "user_id": "uuid",
  "total_files": 45,
  "total_size_bytes": 52428800,
  "total_size_mb": 50.0,
  "files_by_type": {
    "meal": 25,
    "workout": 15,
    "avatar": 3,
    "challenge": 2
  },
  "size_by_type": {
    "meal": 30720000,
    "workout": 20480000,
    "avatar": 1024000,
    "challenge": 204800
  },
  "last_updated": "2024-01-01T12:00:00Z"
}
```

### Get Upload Configuration
**GET** `/upload/config`

Gets upload configuration and limits.

**Response (200):**
```json
{
  "max_file_size_mb": 5,
  "allowed_file_types": {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"]
  },
  "allowed_folders": {
    "meal": "Meal photos",
    "workout": "Workout photos",
    "avatar": "Profile avatars",
    "challenge": "Challenge images"
  },
  "thumbnail_sizes": {
    "small": {"width": 150, "height": 150},
    "medium": {"width": 300, "height": 300},
    "large": {"width": 600, "height": 600}
  },
  "max_workout_images": 4
}
```

---

## Error Handling

### Standard Error Response Format

All API errors follow a consistent format:

```json
{
  "detail": "Error message description",
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2024-01-01T12:00:00Z",
  "path": "/api/endpoint"
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **422**: Unprocessable Entity (business logic error)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

### Common Error Examples

#### Validation Error (400)
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    },
    {
      "loc": ["body", "weight"],
      "msg": "ensure this value is greater than 20",
      "type": "value_error.number.not_gt"
    }
  ]
}
```

#### Authentication Error (401)
```json
{
  "detail": "Invalid authentication credentials"
}
```

#### Not Found Error (404)
```json
{
  "detail": "Meal not found"
}
```

#### Rate Limit Error (429)
```json
{
  "detail": "Rate limit exceeded. Try again in 60 seconds.",
  "retry_after": 60
}
```

---

## Data Types & Schemas

### Enums

#### Gender
- `male`
- `female`
- `other`

#### Goal
- `lose_weight`
- `gain_weight`
- `maintain`
- `build_muscle`

#### Activity Level
- `sedentary`
- `light`
- `moderate`
- `active`
- `very_active`

#### Meal Type
- `breakfast`
- `lunch`
- `dinner`
- `snack`

#### Medicine Unit
- `mg`
- `ml`
- `tablets`
- `capsules`
- `drops`
- `puffs`
- `units`

#### Medicine Frequency
- `once_daily`
- `twice_daily`
- `three_times_daily`
- `four_times_daily`
- `every_other_day`
- `weekly`
- `monthly`
- `as_needed`
- `custom`

#### Medicine Timing
- `before_meal`
- `after_meal`
- `with_meal`
- `empty_stomach`
- `anytime`

#### Reminder Status
- `pending`
- `taken`
- `missed`
- `snoozed`

#### Friend Request Status
- `pending`
- `accepted`
- `declined`

#### Group Role
- `admin`
- `member`

#### Challenge Category
- `steps`
- `workouts`
- `meals`
- `weight`
- `custom`

#### Challenge Status
- `upcoming`
- `active`
- `completed`
- `cancelled`

#### Challenge Goal Type
- `total`
- `daily_average`
- `streak`
- `target_value`

#### Reward Type
- `badge`
- `points`
- `discount`
- `coupon`
- `achievement`
- `special`

#### Reward Status
- `available`
- `claimed`
- `expired`
- `locked`

#### Achievement Type
- `milestone`
- `streak`
- `goal_completion`
- `social`
- `special`
- `first_time`

#### Achievement Category
- `nutrition`
- `workout`
- `medicine`
- `social`
- `challenge`
- `general`

#### Achievement Difficulty
- `easy`
- `medium`
- `hard`
- `legendary`

### Validation Rules

#### User Data
- **Name**: 1-100 characters, required
- **Email**: Valid email format, required, unique
- **Height**: 50-300 cm, required
- **Weight**: 20-500 kg, required, max 1 decimal
- **Age**: 13-120 years, required

#### Meal Data
- **Name**: 1-200 characters, required
- **Calories**: 1-5000, required
- **Protein**: 0-200g, max 1 decimal
- **Carbs**: 0-500g, max 1 decimal
- **Fat**: 0-200g, max 1 decimal
- **Fiber**: 0-100g, optional, max 1 decimal
- **Sugar**: 0-200g, optional, max 1 decimal

#### Workout Data
- **Name**: 1-200 characters, required
- **Duration**: 1-600 minutes, required
- **Calories**: 1-2000, required
- **Exercise Name**: 1-100 characters, required
- **Reps**: 1-1000, required
- **Weight**: 0-1000 kg, max 1 decimal
- **Rest Time**: 0-600 seconds, optional

#### Medicine Data
- **Name**: 1-200 characters, required
- **Dosage**: 1-50 characters, required
- **Reminder Times**: 1-8 times in HH:MM format
- **Timing Offset**: 0-120 minutes, optional
- **Side Effects**: Max 20 items, each max 100 characters
- **Food Interactions**: Max 20 items, each max 100 characters

#### File Upload
- **Image Formats**: JPEG, PNG, WebP
- **Max File Size**: 5MB per image
- **Max Workout Images**: 4 per workout
- **Max Dimensions**: 4096x4096 pixels

#### Social Features
- **Friend Request Message**: 0-500 characters, optional
- **Group Name**: 1-100 characters, required
- **Group Description**: 0-1000 characters, optional
- **Group Max Members**: 2-1000, required
- **Group Message Content**: 1-2000 characters, required
- **User Search Query**: 2-100 characters, required

#### Challenges
- **Challenge Name**: 1-100 characters, required
- **Challenge Description**: 1-1000 characters, required
- **Challenge Rules**: 1-2000 characters, required
- **Challenge Rewards**: 1-1000 characters, required
- **Challenge Max Members**: 2-1000, required
- **Challenge Goals**: 1-10 goals per challenge
- **Goal Name**: 1-100 characters, required
- **Goal Target Value**: 1-1000000, required

#### Rewards & Achievements
- **Reward Name**: 1-100 characters, required
- **Reward Description**: 1-1000 characters, required
- **Achievement Name**: 1-100 characters, required
- **Achievement Description**: 1-1000 characters, required
- **Points Reward**: 0-10000, required
- **Claim Notes**: 0-500 characters, optional

### Pagination

All paginated endpoints support these query parameters:
- `limit`: 1-100 (default varies by endpoint)
- `offset`: ≥0 (default: 0)

Paginated responses include:
```json
{
  "data": [],
  "total": 100,
  "has_more": true
}
```

### Date Formats

- **Dates**: ISO 8601 date format (YYYY-MM-DD)
- **Datetimes**: ISO 8601 datetime format (YYYY-MM-DDTHH:MM:SSZ)
- **Times**: 24-hour format (HH:MM)

---

## Rate Limiting

### Limits by Endpoint Type
- **Authentication**: 10 requests/minute
- **Data Creation**: 100 requests/hour
- **Data Retrieval**: 1000 requests/hour
- **File Upload**: 50 requests/hour
- **Analytics**: 200 requests/hour
- **Social Features**: 500 requests/hour
- **Challenges**: 200 requests/hour
- **Rewards & Achievements**: 300 requests/hour

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## Health Check Endpoints

### Basic Health Check
**GET** `/`

**Response (200):**
```json
{
  "message": "Vital Sync API is running",
  "status": "healthy"
}
```

### Detailed Health Check
**GET** `/health`

**Response (200):**
```json
{
  "status": "healthy",
  "service": "vital-sync-backend",
  "version": "1.0.0"
}
```

---

## Best Practices for Frontend Integration

### Authentication
1. Store Firebase ID token securely
2. Refresh tokens before expiration
3. Handle 401 responses by redirecting to login
4. Include Authorization header in all requests

### Error Handling
1. Always check HTTP status codes
2. Parse error responses for user-friendly messages
3. Implement retry logic for 5xx errors
4. Show appropriate loading states

### Data Management
1. Cache frequently accessed data (user profile, macro targets)
2. Implement optimistic updates for better UX
3. Use pagination for large data sets
4. Validate data on frontend before API calls

### File Uploads
1. Show upload progress indicators
2. Validate file size and type before upload
3. Use thumbnail URLs for better performance
4. Handle upload failures gracefully

### Performance
1. Use query parameters for filtering and pagination
2. Implement debouncing for search endpoints
3. Cache analytics data with appropriate TTL
4. Use WebSocket connections for real-time features (if implemented)

### Security
1. Never expose Firebase tokens in logs
2. Validate all user inputs
3. Use HTTPS in production
4. Implement proper CORS policies

---

This documentation provides comprehensive coverage of all available API endpoints for frontend integration. For additional support or questions, please refer to the backend development team.
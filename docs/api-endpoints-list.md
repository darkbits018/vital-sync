# API Endpoints List

## Authentication APIs
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh-token
- GET /auth/profile
- PUT /auth/profile
- DELETE /auth/account

## User Management APIs
- GET /users/{id}
- PUT /users/{id}
- GET /users/search
- POST /users/upload-avatar
- GET /users/{id}/stats

## Nutrition APIs
- GET /meals
- POST /meals
- PUT /meals/{id}
- DELETE /meals/{id}
- GET /meals/date/{date}
- GET /meal-presets
- POST /meal-presets
- PUT /meal-presets/{id}
- DELETE /meal-presets/{id}
- GET /nutrition/search
- GET /nutrition/barcode/{code}

## Workout APIs
- GET /workouts
- POST /workouts
- PUT /workouts/{id}
- DELETE /workouts/{id}
- GET /workouts/date/{date}
- GET /workout-presets
- POST /workout-presets
- PUT /workout-presets/{id}
- DELETE /workout-presets/{id}
- GET /exercises/search
- GET /workouts/streak

## Social - Friends APIs
- GET /friends
- POST /friends/request
- PUT /friends/request/{id}/accept
- PUT /friends/request/{id}/decline
- DELETE /friends/{id}
- GET /friends/requests
- GET /friends/search
- GET /friends/{id}/activity
- POST /friends/qr-code
- POST /friends/nfc-share

## Social - Groups APIs
- GET /groups
- POST /groups
- PUT /groups/{id}
- DELETE /groups/{id}
- POST /groups/{id}/join
- DELETE /groups/{id}/leave
- GET /groups/{id}/members
- POST /groups/{id}/invite
- GET /groups/{id}/chat
- POST /groups/{id}/chat
- POST /groups/{id}/share-meal
- POST /groups/{id}/share-workout

## Challenges APIs
- GET /challenges
- POST /challenges
- PUT /challenges/{id}
- DELETE /challenges/{id}
- POST /challenges/{id}/join
- DELETE /challenges/{id}/leave
- GET /challenges/{id}/leaderboard
- GET /challenges/{id}/progress
- PUT /challenges/{id}/progress
- GET /challenges/templates
- POST /challenges/{id}/invite

## Rewards APIs
- GET /rewards
- GET /rewards/user/{userId}
- POST /rewards/{id}/claim
- GET /rewards/challenges/{challengeId}

## Medicine APIs
- GET /medicines
- POST /medicines
- PUT /medicines/{id}
- DELETE /medicines/{id}
- GET /medicine-reminders
- POST /medicine-reminders
- PUT /medicine-reminders/{id}
- GET /medicine-interactions
- GET /medicine-stats
- POST /medicine-reminders/{id}/taken
- POST /medicine-reminders/{id}/missed

## Achievements APIs
- GET /achievements
- GET /achievements/user/{userId}
- POST /achievements/{id}/unlock
- GET /achievements/progress

## Chat/AI APIs
- POST /chat/message
- GET /chat/history
- POST /chat/preferences/learn
- GET /chat/suggestions

## Analytics APIs
- GET /analytics/macros
- GET /analytics/workouts
- GET /analytics/progress
- GET /analytics/streaks
- GET /analytics/adherence

## Preferences APIs
- GET /preferences
- PUT /preferences
- GET /preferences/foods
- POST /preferences/foods
- DELETE /preferences/foods/{id}

## Notifications APIs
- GET /notifications
- POST /notifications/mark-read
- PUT /notifications/settings
- POST /notifications/push-subscribe

## File Upload APIs
- POST /upload/meal-image
- POST /upload/workout-images
- POST /upload/avatar
- POST /upload/challenge-image

## Health Data APIs
- GET /health/macro-targets
- POST /health/calculate-macros
- GET /health/bmr
- GET /health/tdee
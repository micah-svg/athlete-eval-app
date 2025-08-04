
# 🏀 FuturePlay Sports - Athlete Evaluation App

A mobile-friendly web application for managing tryouts, evaluating athletes, and supporting team selection — built for high school and club sports organizations.

---

## 🚀 Features

- **Multi-organization support**: Each club or school sees only their own data.
- **Tryout registration**: Form for collecting athlete details, jersey #, position, etc.
- **Evaluator entry**: Soft skills scored by rubric, plus performance metrics.
- **Coach dashboard**: Percentiles, averages, filtering, and team insights.
- **Player detail view**: See full evaluation and coach notes.
- **Data export**: CSV download of all tryout data.
- **Onboarding video**: Welcome page for new admins.
- **Responsive UI**: Mobile-first design using Tailwind CSS.
- **Firebase-powered**: Authentication, Firestore DB, and hosting-ready.

---

## 🧱 Firestore Data Schema

### 🔹 `organizations/{orgId}`

```json
{
  "name": "West Linn High School",
  "users": ["uid1", "uid2"]
}
```

### 🔹 `users/{uid}`

```json
{
  "email": "coach@example.com",
  "orgId": "westlinn",
  "role": "admin",
  "hasSeenWelcome": true
}
```

### 🔹 `athletes/{docId}`

```json
{
  "athleteId": "482193",
  "firstName": "John",
  "lastName": "Smith",
  "jerseyNumberToday": "12",
  "grade": "10",
  "birthdate": "2009-04-18",
  "gender": "Male",
  "primaryPosition": "Guard",
  "secondaryPosition": "Forward",
  "orgId": "westlinn"
}
```

### 🔹 `evaluations/{docId}`

```json
{
  "athleteId": "482193",
  "orgId": "westlinn",
  "evaluator": "uid123",
  "Coachability": 4.5,
  "Communication": 4.2,
  "Vertical Jump (cm)": 58,
  "Vertical Jump Percentile": 85,
  "Evaluator Notes": "Very coachable"
}
```

---

## 🔁 Pages & Routes

| Path                     | Purpose                    |
|--------------------------|----------------------------|
| `/`                      | Redirect to `/register`    |
| `/register`              | Tryout registration        |
| `/evaluator`             | Submit evaluation          |
| `/coach/notes`           | Add coach notes            |
| `/coach/dashboard`       | View performance & scores  |
| `/player/:jerseyNumber`  | Player detail view         |
| `/signup-org`            | Create organization        |
| `/welcome`               | Welcome video              |

---

## 🛡 Security

- Firestore rules ensure users only access data tied to their `orgId`.
- Evaluators cannot view other orgs' athletes or evaluations.

---

## 🧠 Tech Stack

- **React** (with Vite)
- **Firebase** (Auth + Firestore)
- **Tailwind CSS**
- **React Router DOM**

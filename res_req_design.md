# StartIt Platform — REST API Design

**Stack:** Node.js · Express · JWT Auth · MongoDB (Mongoose)  
**Base URL:** `https://api.startit.io/v1`  
**Auth:** Bearer token in `Authorization` header for all protected routes.

---

## Table of Contents

1. [Auth](#1-auth)
2. [Users](#2-users)
3. [Startup Profiles](#3-startup-profiles)
4. [Investor Profiles](#4-investor-profiles)
5. [Browse & Discovery](#5-browse--discovery)
6. [Investment Deals](#6-investment-deals)
7. [Error Reference](#7-error-reference)
8. [Frontend Integration (Axios)](#8-frontend-integration-axios)

---

## 1. Auth

### POST `/auth/register`

Register a new user (investor or founder).

**Request body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@company.com",
  "password": "StrongPass123!",
  "role": "investor"
}
```
> `role` → `"investor"` | `"founder"`

**Response `201 Created`:**
```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "email": "jane@company.com",
    "role": "investor",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response `409 Conflict` — email already registered:**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_IN_USE",
    "message": "An account with this email already exists."
  }
}
```

---

### POST `/auth/login`

Authenticate an existing user.

**Request body:**
```json
{
  "email": "jane@company.com",
  "password": "StrongPass123!"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "role": "investor",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Response `401 Unauthorized`:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect."
  }
}
```

---

### POST `/auth/logout`

Invalidate the current session token.  **Protected**

**Request body:** _(none)_

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### POST `/auth/refresh-token`

Obtain a new access token using a refresh token.

**Request body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

---

### POST `/auth/forgot-password`

Send a password reset email.

**Request body:**
```json
{
  "email": "jane@company.com"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "If that email exists, a reset link has been sent."
}
```

---

### POST `/auth/reset-password`

Reset password using the token from email.

**Request body:**
```json
{
  "resetToken": "a1b2c3d4...",
  "newPassword": "NewStrongPass456!"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Password updated. You may now log in."
}
```

---

## 2. Users

### GET `/users/me`

Fetch the authenticated user's own profile. **Protected**

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "fullName": "Jane Smith",
    "email": "jane@company.com",
    "role": "investor",
    "avatar": "https://cdn.startit.io/avatars/usr_abc123.jpg",
    "createdAt": "2024-11-01T10:00:00Z",
    "profileComplete": true
  }
}
```

---

### PATCH `/users/me`

Update authenticated user's account info. **Protected**

**Request body:**
```json
{
  "fullName": "Jane M. Smith",
  "avatar": "https://cdn.startit.io/avatars/new.jpg"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "userId": "usr_abc123",
    "fullName": "Jane M. Smith",
    "avatar": "https://cdn.startit.io/avatars/new.jpg",
    "updatedAt": "2025-01-15T08:30:00Z"
  }
}
```

---

### DELETE `/users/me`

Permanently delete the authenticated user's account. **Protected**

**Request body:**
```json
{
  "confirmPassword": "StrongPass123!"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Account deleted."
}
```

---

## 3. Startup Profiles

### POST `/startups`

Create a new startup profile. **Protected** · `role: founder`

**Request body:**
```json
{
  "name": "Aether Dynamics",
  "tagline": "Ambient energy for the enterprise grid.",
  "description": "Pioneering next-generation solid-state atmospheric energy harvesting.",
  "sector": "Deep Tech",
  "stage": "Seed",
  "location": "Boston, MA",
  "website": "https://aetherdynamics.io",
  "targetRaise": 4500000,
  "amountCommitted": 1200000,
  "pitchDeckUrl": "https://cdn.startit.io/decks/aether-deck.pdf",
  "logoUrl": "https://cdn.startit.io/logos/aether.png",
  "tags": ["Energy", "Hardware", "DeepTech"],
  "team": [
    {
      "name": "Dr. Sarah Chen",
      "role": "CEO & Co-Founder",
      "linkedIn": "https://linkedin.com/in/sarachen",
      "previousCompany": "MIT Lincoln Lab"
    }
  ],
  "milestones": [
    {
      "date": "2023-Q3",
      "title": "TechCrunch Disrupt Finalist",
      "description": "Hardware & Energy Category"
    }
  ]
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "data": {
    "startupId": "stup_xyz789",
    "name": "Aether Dynamics",
    "stage": "Seed",
    "status": "active",
    "createdAt": "2025-01-15T09:00:00Z"
  }
}
```

---

### GET `/startups/:startupId`

Fetch a single startup's full public profile.

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "startupId": "stup_xyz789",
    "name": "Aether Dynamics",
    "tagline": "Ambient energy for the enterprise grid.",
    "description": "Pioneering next-generation solid-state atmospheric energy harvesting.",
    "sector": "Deep Tech",
    "stage": "Seed",
    "location": "Boston, MA",
    "website": "https://aetherdynamics.io",
    "targetRaise": 4500000,
    "amountCommitted": 1200000,
    "fundingProgress": 26,
    "logoUrl": "https://cdn.startit.io/logos/aether.png",
    "tags": ["Energy", "Hardware", "DeepTech"],
    "team": [
      {
        "name": "Dr. Sarah Chen",
        "role": "CEO & Co-Founder",
        "previousCompany": "MIT Lincoln Lab"
      }
    ],
    "milestones": [
      {
        "date": "2023-Q3",
        "title": "TechCrunch Disrupt Finalist",
        "description": "Hardware & Energy Category"
      }
    ],
    "status": "active",
    "highlight": true,
    "createdAt": "2025-01-15T09:00:00Z"
  }
}
```

**Response `404 Not Found`:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Startup not found."
  }
}
```

---

### PATCH `/startups/:startupId`

Update a startup profile. **Protected** · `role: founder` · must own this startup

**Request body (partial update):**
```json
{
  "amountCommitted": 1800000,
  "tagline": "Clean ambient power — everywhere."
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "startupId": "stup_xyz789",
    "amountCommitted": 1800000,
    "tagline": "Clean ambient power — everywhere.",
    "updatedAt": "2025-01-20T11:00:00Z"
  }
}
```

---

### DELETE `/startups/:startupId`

Remove a startup listing. **Protected** · `role: founder` · must own

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Startup profile removed."
}
```

---

### GET `/startups/me`

Fetch all startups owned by the authenticated founder. **Protected** · `role: founder`

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "startupId": "stup_xyz789",
      "name": "Aether Dynamics",
      "stage": "Seed",
      "fundingProgress": 26,
      "status": "active"
    }
  ]
}
```

---

## 4. Investor Profiles

### POST `/investors`

Create an investor profile after registering. **Protected** · `role: investor`

**Request body:**
```json
{
  "firmName": "Meridian Capital",
  "title": "Managing Director",
  "bio": "15 years investing in deep-tech and climate startups.",
  "linkedIn": "https://linkedin.com/in/eleanor-vance",
  "portfolioSize": 120000000,
  "checkSizeMin": 500000,
  "checkSizeMax": 5000000,
  "preferredStages": ["Seed", "Series A"],
  "preferredSectors": ["Deep Tech", "Climate Tech"],
  "location": "New York, NY",
  "avatarUrl": "https://cdn.startit.io/avatars/investor1.jpg"
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "data": {
    "investorId": "inv_def456",
    "firmName": "Meridian Capital",
    "createdAt": "2025-01-15T09:30:00Z"
  }
}
```

---

### GET `/investors/:investorId`

Fetch a public investor profile.

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "investorId": "inv_def456",
    "firmName": "Meridian Capital",
    "title": "Managing Director",
    "bio": "15 years investing in deep-tech and climate startups.",
    "preferredStages": ["Seed", "Series A"],
    "preferredSectors": ["Deep Tech", "Climate Tech"],
    "checkSizeMin": 500000,
    "checkSizeMax": 5000000,
    "totalDealsOnPlatform": 7,
    "avatarUrl": "https://cdn.startit.io/avatars/investor1.jpg"
  }
}
```

---

### PATCH `/investors/me`

Update the authenticated investor's profile.  **Protected** · `role: investor`

**Request body:**
```json
{
  "checkSizeMax": 8000000,
  "preferredSectors": ["Deep Tech", "Climate Tech", "Fintech"]
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "investorId": "inv_def456",
    "checkSizeMax": 8000000,
    "preferredSectors": ["Deep Tech", "Climate Tech", "Fintech"],
    "updatedAt": "2025-02-01T14:00:00Z"
  }
}
```

---

## 5. Browse & Discovery

### GET `/startups`

Browse and filter all active startups with pagination.

**Query parameters:**

| Param | Type | Example |
|---|---|---|
| `sector` | string | `Deep Tech` |
| `stage` | string | `Seed,Series A` |
| `location` | string | `Boston` |
| `minRaise` | number | `1000000` |
| `maxRaise` | number | `10000000` |
| `search` | string | `energy grid` |
| `sort` | string | `newest` \| `raise_asc` \| `progress` |
| `page` | number | `1` |
| `limit` | number | `12` |

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "total": 48,
    "page": 1,
    "limit": 12,
    "totalPages": 4,
    "results": [
      {
        "startupId": "stup_xyz789",
        "name": "Aether Dynamics",
        "tagline": "Ambient energy for the enterprise grid.",
        "sector": "Deep Tech",
        "stage": "Seed",
        "targetRaise": 4500000,
        "fundingProgress": 26,
        "location": "Boston, MA",
        "logoUrl": "https://cdn.startit.io/logos/aether.png",
        "tags": ["Energy", "Hardware"],
        "highlight": true
      }
    ]
  }
}
```

---

### GET `/startups/featured`

Fetch editorially highlighted startups for homepage cards.

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "startupId": "stup_xyz789",
      "name": "Aether Dynamics",
      "sector": "Deep Tech",
      "stage": "Seed",
      "targetRaise": 4500000,
      "fundingProgress": 26,
      "logoUrl": "https://cdn.startit.io/logos/aether.png",
      "badge": {
        "text": "Fast Track",
        "variant": "green"
      }
    }
  ]
}
```

---

### GET `/investors`

Browse investors. Useful for founders looking for matches. **Protected**

**Query parameters:** `sector`, `stage`, `minCheck`, `maxCheck`, `page`, `limit`

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "total": 22,
    "page": 1,
    "limit": 10,
    "results": [
      {
        "investorId": "inv_def456",
        "firmName": "Meridian Capital",
        "title": "Managing Director",
        "preferredStages": ["Seed", "Series A"],
        "preferredSectors": ["Deep Tech", "Climate Tech"],
        "checkSizeMin": 500000,
        "checkSizeMax": 5000000,
        "avatarUrl": "https://cdn.startit.io/avatars/investor1.jpg"
      }
    ]
  }
}
```

---

## 6. Investment Deals

### POST `/deals`

Investor sends an offer/expression of interest to a startup.  **Protected** · `role: investor`

**Request body:**
```json
{
  "startupId": "stup_xyz789",
  "type": "offer",
  "amount": 500000,
  "message": "We believe Aether aligns perfectly with our climate thesis. Open to a call this week.",
  "terms": "SAFE, 20% discount, $8M cap"
}
```
> `type` → `"offer"` | `"interest"` (non-binding)

**Response `201 Created`:**
```json
{
  "success": true,
  "data": {
    "dealId": "deal_uvw111",
    "startupId": "stup_xyz789",
    "investorId": "inv_def456",
    "type": "offer",
    "amount": 500000,
    "status": "pending",
    "createdAt": "2025-02-10T12:00:00Z"
  }
}
```

---

### GET `/deals`

Fetch all deals for the authenticated user (investor sees sent deals; founder sees received deals).  **Protected**

**Response `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "dealId": "deal_uvw111",
      "startup": {
        "startupId": "stup_xyz789",
        "name": "Aether Dynamics",
        "logoUrl": "https://cdn.startit.io/logos/aether.png"
      },
      "investor": {
        "investorId": "inv_def456",
        "firmName": "Meridian Capital"
      },
      "type": "offer",
      "amount": 500000,
      "status": "pending",
      "createdAt": "2025-02-10T12:00:00Z"
    }
  ]
}
```

---

### GET `/deals/:dealId`

Fetch a single deal's full details. **Protected** · must be a party in this deal

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "dealId": "deal_uvw111",
    "startup": {
      "startupId": "stup_xyz789",
      "name": "Aether Dynamics"
    },
    "investor": {
      "investorId": "inv_def456",
      "firmName": "Meridian Capital",
      "title": "Managing Director"
    },
    "type": "offer",
    "amount": 500000,
    "message": "We believe Aether aligns perfectly with our climate thesis.",
    "terms": "SAFE, 20% discount, $8M cap",
    "status": "pending",
    "statusHistory": [
      { "status": "pending", "at": "2025-02-10T12:00:00Z" }
    ],
    "createdAt": "2025-02-10T12:00:00Z"
  }
}
```

---

### PATCH `/deals/:dealId/status`

Founder accepts or rejects a deal. **Protected** · `role: founder` · must own the target startup

**Request body:**
```json
{
  "status": "accepted",
  "message": "We're excited to move forward. Let's schedule a data room review."
}
```
> `status` → `"accepted"` | `"rejected"` | `"under_review"`

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "dealId": "deal_uvw111",
    "status": "accepted",
    "updatedAt": "2025-02-11T09:00:00Z"
  }
}
```

---

### DELETE `/deals/:dealId`

Investor withdraws a pending deal. **Protected** · `role: investor` · must own the deal · only if `status: pending`

**Response `200 OK`:**
```json
{
  "success": true,
  "message": "Deal offer withdrawn."
}
```

---

## 7. Error Reference

All error responses follow a consistent shape:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable explanation."
  }
}
```

| HTTP Status | Code | Meaning |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Missing or invalid fields |
| `401` | `UNAUTHORIZED` | No or invalid token |
| `403` | `FORBIDDEN` | Authenticated but insufficient permission |
| `404` | `NOT_FOUND` | Resource does not exist |
| `409` | `CONFLICT` | Duplicate resource (e.g. email in use) |
| `422` | `UNPROCESSABLE` | Business logic violation |
| `429` | `RATE_LIMITED` | Too many requests |
| `500` | `SERVER_ERROR` | Unexpected internal error |

---

## 8. Frontend Integration (Axios)

Install Axios: `npm install axios`

### Setup — `api.js`

```javascript
// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.startit.io/v1",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler — redirect to login on expired tokens
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

### Auth — Register (`register.html`)

```javascript
import api from "./api.js";

async function register(formData) {
  try {
    const { data } = await api.post("/auth/register", {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role, // "investor" or "founder"
    });

    localStorage.setItem("token", data.data.token);
    localStorage.setItem("role", data.data.role);

    // Redirect to profile setup
    window.location.href =
      data.data.role === "investor"
        ? "/setup-investor.html"
        : "/setup-startup.html";

  } catch (err) {
    const code = err.response?.data?.error?.code;

    if (code === "EMAIL_IN_USE") {
      showError("This email is already registered. Try logging in.");
    } else if (code === "VALIDATION_ERROR") {
      showError("Please fill in all required fields correctly.");
    } else {
      showError("Something went wrong. Please try again.");
    }
  }
}
```

---

### Auth — Login (`login.html`)

```javascript
import api from "./api.js";

async function login(email, password) {
  try {
    const { data } = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", data.data.token);
    window.location.href = "/index.html";

  } catch (err) {
    const status = err.response?.status;

    if (status === 401) {
      showError("Incorrect email or password.");
    } else {
      showError("Login failed. Please try again.");
    }
  }
}
```

---

### Browse Startups (`startups.html`)

```javascript
import api from "./api.js";

async function loadStartups({ sector, stage, search, page = 1 } = {}) {
  renderSkeleton(4);

  try {
    const { data } = await api.get("/startups", {
      params: { sector, stage, search, page, limit: 12 },
    });

    const { results, total, totalPages } = data.data;

    renderCards(results);
    renderPagination(total, page, totalPages);

  } catch (err) {
    renderError("Failed to load startups. Please refresh.");
  }
}

// Wire up the search input
searchInput.addEventListener("input", debounce((e) => {
  loadStartups({ search: e.target.value });
}, 400));
```

---

### Fetch Single Startup Profile (`startupProfile.html`)

```javascript
import api from "./api.js";

async function loadStartupProfile(startupId) {
  try {
    const { data } = await api.get(`/startups/${startupId}`);
    const startup = data.data;

    document.querySelector(".hero__title").textContent = startup.name;
    document.querySelector(".hero__description").textContent = startup.description;
    document.querySelector(".raise-card__amount").textContent =
      `$${(startup.amountCommitted / 1e6).toFixed(1)}M`;

    document.querySelector(".progress__bar").style.width =
      `${startup.fundingProgress}%`;

  } catch (err) {
    if (err.response?.status === 404) {
      showError("This startup profile no longer exists.");
    } else {
      showError("Unable to load profile.");
    }
  }
}

// Get startupId from URL: /startupProfile.html?id=stup_xyz789
const startupId = new URLSearchParams(window.location.search).get("id");
loadStartupProfile(startupId);
```

---

### Send Investment Offer

```javascript
import api from "./api.js";

async function sendOffer(startupId, { amount, message, terms }) {
  const btn = document.querySelector(".btn-primary");
  btn.disabled = true;
  btn.textContent = "Sending…";

  try {
    const { data } = await api.post("/deals", {
      startupId,
      type: "offer",
      amount,
      message,
      terms,
    });

    showSuccess(`Offer sent! Deal ID: ${data.data.dealId}`);

  } catch (err) {
    const code = err.response?.data?.error?.code;

    if (code === "FORBIDDEN") {
      showError("Only investors can send offers.");
    } else {
      showError("Failed to send offer. Please try again.");
    }

  } finally {
    btn.disabled = false;
    btn.textContent = "Send Offer";
  }
}
```

---

### Accept / Reject a Deal (Founder View)

```javascript
import api from "./api.js";

async function respondToDeal(dealId, accepted) {
  const status = accepted ? "accepted" : "rejected";

  try {
    const { data } = await api.patch(`/deals/${dealId}/status`, {
      status,
      message: accepted
        ? "We're excited to move forward."
        : "Thank you for your interest. This round is now closed.",
    });

    renderDealStatus(data.data.status);

  } catch (err) {
    showError("Could not update deal status. Please refresh and try again.");
  }
}
```

---

### Load Investor's Deal History

```javascript
import api from "./api.js";

async function loadMyDeals() {
  try {
    const { data } = await api.get("/deals");

    data.data.forEach((deal) => {
      renderDealRow({
        startup: deal.startup.name,
        amount: deal.amount,
        status: deal.status,
        date: new Date(deal.createdAt).toLocaleDateString(),
      });
    });

  } catch (err) {
    showError("Could not load your deals.");
  }
}
```

---
# 🏗️ Backend Architecture Audit — Multi-Tenant Kanban System

> **Reviewer posture**: Senior backend architect. Treating this as a real SaaS product review (Trello/Notion scale).  
> **Audit scope**: All models, controllers, routes, and middleware under `backend/`.  
> **No source code was changed.**

---

## Table of Contents

1. [Critical Issues](#-1-critical-issues)
2. [Design Gaps — Missing Features](#-2-design-gaps--missing-features)
3. [Structural Improvements](#-3-structural-improvements)
4. [Scalability & Performance Concerns](#-4-scalability--performance-concerns)
5. [Analytics Readiness](#-5-analytics-readiness)
6. [Optional Enhancements](#-6-optional-enhancements)
7. [Detailed Improvement Roadmap](#-7-detailed-improvement-roadmap)

---

## 🔴 1. Critical Issues

These are bugs and security holes that would cause data leaks or unauthorized access in production **right now**.

---

### 1.1 Board-Level Access Control is Completely Absent

**Severity: CRITICAL**

The requirement states:
> *"Board-level members should have access to only that specific board."*

**What actually happens:**

- `GET /api/board-details/:boardId` (`getBoardDetails`) → verifies **only** that the user has a JWT token. It does **not** check whether the user is a member of that board or a member of the board's parent organization. Any authenticated user can read any board's full data including all cards and columns.
- `POST /api/board/:boardId/columns/` (`createColumn`) → same issue. Any authenticated user can add columns to any board.
- `POST /api/column/:columnId/` (`createCard`) → same issue. Any authenticated user can create cards.
- `PUT/DELETE /api/board/:boardId/column/:id` → same issue for updates/deletes.
- All card sub-routes (`/api/card/*` — checklists, labels, attachments, calendar) → **zero** board or org membership check.

**What needs to happen for every board-scoped endpoint:**
```
1. Find the board → get board.orgId
2. Check: is req.user.id in Membership (orgId) OR in board.members[]?
3. If neither → 403
```

This is the single biggest security flaw in the system.

---

### 1.2 `isAdmin` Middleware Reads `orgId` from `req.body`, Not `req.params`

**File:** `middleware/adminMiddleware.js`

```js
const { orgId } = req.body; // ❌ WRONG
```

**Problem:** The invite route that uses this middleware is `POST /api/invite` — the `orgId` comes from `req.body`, which works in that exact case. But this middleware is also mounted on analytics routes `GET /api/analytics/*` which have **no body at all**. This means `orgId` is `undefined`, the Membership query returns `null`, and every analytics request always gets a **403**, making analytics routes permanently broken.

**Fix:** The middleware must read `orgId` from `req.params`, `req.query`, or `req.body` with a fallback chain, and throw a clear error if none is found.

---

### 1.3 `User` Model Not Imported in `acceptInvite`

**File:** `controllers/inviteController.js` line 126

```js
const user = await User.findById(req.user.id); // ❌ User is never imported
```

`User` is never imported in `inviteController.js`. This crashes Node at runtime with a `ReferenceError: User is not defined` every time someone tries to accept an invite — the entire invite acceptance flow is **broken**.

---

### 1.4 `cancelInvite` Has No Authorization Check

**File:** `controllers/inviteController.js`, `Routes/invite.js`

```js
router.delete("/:inviteId", verifyToken, cancelInvite); // ❌ No admin check
```

Any authenticated user can cancel **any** organization's pending invite by guessing or brute-forcing an `inviteId`. There is no check that the user is an admin of the org the invite belongs to.

---

### 1.5 `getOrgInvites` Has No Authorization Check

**File:** `controllers/inviteController.js` line 158–171

```js
export const getOrgInvites = async (req, res) => {
  const { orgId } = req.params;
  const invites = await Invite.find({ orgId, status: "pending" });
  res.json(invites); // ❌ No membership check
};
```

Any authenticated user can see the pending invites of **any** organization, exposing email addresses of people being invited.

---

### 1.6 `getBoard` is Broken for Org Members Who Aren't Explicitly in `board.members`

**File:** `controllers/boardController.js` line 23–33

```js
const boards = await Boards.find({
  orgId: new mongoose.Types.ObjectId(orgId),
  members: new mongoose.Types.ObjectId(req.user.id), // ❌ Org members won't appear here
});
```

The requirement says:
> *"If a user is part of an organization → they can access all boards in that organization."*

Org members are stored in the `Membership` collection, **not** in `board.members`. This query will return **zero boards** for any org member who wasn't manually added to `board.members`. The entire board listing is broken for invited members.

**Fix:** The query must be:
```
find boards where orgId = X AND (user is in board.members OR user has a Membership for orgId = X)
```

---

### 1.7 `reorderCard` Accepts Arbitrary Card IDs from Client — No Ownership Validation

**File:** `controllers/cardController.js` line 81–128

The `bulkWrite` trusts the `_id` values sent by the client. Any user can send a payload with card IDs from a completely different board and reorder them. There is **no check** that the cards belong to the board the user has access to.


---

## 🟡 2. Design Gaps — Missing Features

These are requirements from the spec that are **entirely absent** from the codebase.

---

### 2.1 Board-Level Invitations Do Not Exist

**Requirement:** *"Board invites → grants access only to a specific board."*

The `Invite` model has **no `boardId` field** and **no `type` field** to distinguish org vs. board invites:

```js
// Current Invite schema — only supports org invitations
{
  email, orgId, role, invitedBy, token, status, expiresAt
}
// Missing: boardId, type: enum["org", "board"]
```

There is no route, controller, or flow for board-level invitations at all. If a user needs to be added to only a single board (not the whole org), there is **no mechanism** to do it.

**What's needed:**
- Add `type: { type: String, enum: ["org", "board"], required: true }` to the Invite model
- Add `boardId: { type: ObjectId, ref: "Board" }` to the Invite model
- New controller: `sendBoardInvite`
- New route: `POST /api/board/:boardId/invite`
- Update `acceptInvite`: if `type === "board"`, add user to `board.members[]` instead of creating an org Membership

---

### 2.2 Personal Workspace Not Auto-Created on Registration

**Requirement:** *"Each user can have a personal organization."*

The `Organisation` schema has `isPersonal: Boolean` but nothing creates a personal org when a user registers. The `registerUser` controller creates only the user. The user must manually create an org — which breaks the personal workspace promise.

**What's needed:** After `User.create(...)` in `registerUser`, automatically:
```
1. Create Organization { name: "Personal", owner: user._id, isPersonal: true }
2. Create Membership { userId: user._id, orgId: org._id, role: "admin" }
```

---

### 2.3 No Ability to Remove a Member from an Organization

There's a `getMembers` controller but no `removeMember` or `updateMemberRole` functionality. Once a user joins an organization (via invite), they can never be removed and their role can never be changed. This is a fundamental admin management gap.

**Needed routes:**
- `DELETE /api/member/:orgId/:userId` — remove member
- `PATCH /api/member/:orgId/:userId/role` — change role

---

### 2.4 No Board Archiving / Restore Endpoint

The `Board` model has `isArchived: Boolean` but there is no route or controller to archive or restore a board. The field exists but is completely inert.

---

### 2.5 No Card Archiving / Restore Endpoint

Same problem as boards. `Card` has `isArchived: Boolean` but no archive/restore endpoint.

---

### 2.6 No `getOrganization` for Member (Only Owner)

**File:** `controllers/organizationController.js` line 37

```js
const org = await Organisation.find({ owner: userId }); // ❌ Only orgs you own
```

If a user joins an organization via invite, this endpoint **does not return that org**. They have a Membership record but the org listing only shows orgs they created. Members can never see the organization they joined.

**Fix:** The correct query should be:
```js
// Get all memberships for the user, then get all orgs
const memberships = await Memberships.find({ userId }).populate("orgId");
const orgs = memberships.map(m => m.orgId);
```

---

### 2.7 `roleMiddleware.js` Is Empty

**File:** `middleware/roleMiddleware.js`

This file is completely empty (0 bytes). Board-level role enforcement (`canEditBoard`, `isBoardMember`, etc.) is supposed to live here but was never implemented. All board-level access control enforcement is **absent**.

---

### 2.8 No Label Deletion Endpoint

The `labelController.js` has `createLabel`, `getLabels`, and `editLabel` — but no `deleteLabel`. Labels can be created and edited but never removed.

---

### 2.9 No User Search / Mention System

There is no endpoint to search users by name/email for the purpose of assignment or mentioning on a card. `card.assignees` can hold references but there's no way to populate them through any route.

---

### 2.10 No Notification System

Cards have `reminder` and `dueDate` fields, but there is no background job, queue, or WebSocket system to actually send reminders. The reminder date is stored but will never trigger any action.

---

## 🟠 3. Structural Improvements

These are design decisions that work today but will cause maintainability and correctness problems at scale.

---

### 3.1 `Board.members[]` and `Membership` Are Two Separate, Conflicting Sources of Truth

**File:** `models/Board/boards.js`

The system has:
- `Membership` collection → tracks org-level membership
- `Board.members[]` → tracks board-level membership (a raw ObjectId array)

These two sources of truth are **never synchronized**. When a user joins an org, they are added to `Membership` but **not** to every board's `members[]`. When a board-only user is added to `board.members[]`, they have no Membership record.

This causes:
- `getBoard` to fail for org members (as described in §1.6)
- Inability to store board-level roles (e.g., board admin vs. board viewer)

**Recommended fix:** Replace `Board.members[]` with a `BoardMembership` collection:

```
BoardMembership {
  boardId: ObjectId (ref Board)
  userId:  ObjectId (ref User)
  orgId:   ObjectId (ref Organization)  // for cascade queries
  role:    enum ["admin", "member", "viewer"]
  source:  enum ["org", "direct"]       // was user added via org or direct board invite?
}
```

Access control logic:
- `source: "org"` → user was added because they're an org member
- `source: "direct"` → user was individually added to this board only

---

### 3.2 `Column` Schema Has No `required` Constraints and No Timestamps

**File:** `models/Board/column.js`

```js
const ColumnSchema = new mongoose.Schema({
  title: String,           // ❌ Not required
  boardId: { type: ObjectId, ref: "Board" }, // ❌ Not required
  position: Number,        // ❌ Not required
});
// ❌ No { timestamps: true }
```

A column can be created with no title, no boardId, and no position. There are also no timestamps, so you cannot track when a column was created or last modified (needed for analytics).

---

### 3.3 `Membership` Has No Unique Constraint

**File:** `models/memberships.js`

```js
const MembershipSchema = new mongoose.Schema({
  orgId: ObjectId,
  userId: ObjectId,
  role: String
});
// ❌ No unique index on { orgId, userId }
```

The requirement explicitly says: *"Ensure unique membership per user per organization."*

Without a unique compound index, a race condition (or a bug) can create duplicate memberships. The `acceptInvite` controller does check for duplicates in application code, but the database itself has no enforcement. **A database-level unique index is mandatory.**

```js
MembershipSchema.index({ orgId: 1, userId: 1 }, { unique: true });
```

---

### 3.4 `User` Schema Has No Unique Index on Email

**File:** `models/user.js`

```js
email: { type: String, required: true } // ❌ Not unique
```

Without `unique: true`, the application check `User.findOne({ email })` in `registerUser` has a race condition — two simultaneous registrations with the same email can both pass and create duplicate users. MongoDB must enforce uniqueness atomically.

---

### 3.5 `Invite` Token Stored as Hashed — Correct, But No Index

**File:** `models/inivites.js`

The token is stored hashed (SHA-256), which is correct. However, there is no index on the `token` field. Every `verifyInvite` and `acceptInvite` call does a full collection scan to find the token. At scale with thousands of pending invites, this is a performance bottleneck.

```js
InviteSchema.index({ token: 1 });
InviteSchema.index({ email: 1, orgId: 1, status: 1 }); // for duplicate check
InviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL auto-cleanup
```

---

### 3.6 Business Logic Embedded Directly in Route Handlers (Board Index Route)

**File:** `Routes/Board/index.js` lines 10–32

```js
router.put("/:cardId/labels", async (req, res) => {
  // Full business logic directly in route file ❌
  const updatedCard = await Cards.findByIdAndUpdate(...)
});
```

Database logic in route files breaks the separation of concerns (Controller/Route/Model layers). This belongs in a controller.

---

### 3.7 Inconsistent Import Casing for Auth Middleware

**File:** `Routes/cardRoute.js` line 2

```js
import { verifyToken } from "../middleware/authMiddleware.js"; // ❌ Wrong case
```

**File:** `Routes/columnRoute.js` line 2

```js
import { verifyToken } from "../middleware/authmiddleware.js"; // ✅ Correct
```

The actual file is `authmiddleware.js` (lowercase). On case-insensitive filesystems (Windows/macOS), this works; on Linux (production), it **breaks**. This will cause a `MODULE_NOT_FOUND` error in deployment.

---

### 3.8 Hardcoded `localhost` URLs in Production Code

**Files:** `controllers/authController.js` lines 68, 205

```js
const verifyUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
```

These use `localhost:5173` directly instead of `process.env.CLIENT_URL`. The server.js already sets up `CLIENT_URL` for CORS — invites correctly use it — but the auth email flows don't. Verification and password reset emails will send broken links in any non-local environment.

---

### 3.9 `console.log(user)` Left in Production Code

**File:** `controllers/authController.js` line 192

```js
console.log(user); // ❌ Logs full user object including hashed password
```

This is a debug statement left in `forgetpassword`. In production this logs a full user document (including `password` hash) to stdout on every forgot-password request.

---

### 3.10 `server.js` Contains a Live AI Test Route

**File:** `server.js` lines 82–101

```js
app.get("/test", async (req, res) => {
  const result = await model.generateContent("Explain how AI works...");
  // ...
});
```

This is an unauthenticated endpoint that makes a live call to Gemini on every request and burns your API quota. It must be removed before any deployment.

---

## 🔵 4. Scalability & Performance Concerns

---

### 4.1 No Database Indexes Declared Anywhere

**All model files**

Not a single model defines a Mongoose index. Every query that is not on `_id` will do a full collection scan as data grows. The most critical missing indexes are:

| Model | Missing Index | Impact |
|---|---|---|
| `Membership` | `{ orgId: 1, userId: 1 }` unique | Every auth check, every invite accept |
| `Board` | `{ orgId: 1 }`, `{ orgId: 1, isArchived: 1 }` | Every board listing |
| `Card` | `{ boardId: 1 }`, `{ columnId: 1, position: 1 }`, `{ assignees: 1 }` | Every board load |
| `Column` | `{ boardId: 1, position: 1 }` | Every board load |
| `Activity` | `{ boardId: 1, createdAt: -1 }`, `{ cardId: 1 }` | Activity feed |
| `Invite` | `{ token: 1 }`, `{ email: 1, status: 1 }` | Every invite verify |
| `User` | `{ email: 1 }` unique | Every login / registration |

---

### 4.2 `getBoardDetails` Loads All Cards and Columns in a Single Request

**File:** `controllers/boardController.js` line 36–74

```js
const columns = await Column.find({ boardId }).sort({ position: 1 });
const cards   = await Card.find({ boardId }).sort({ position: 1 });
```

This loads **every card** in the board in a single request, regardless of count. A board with 500 cards across 10 columns will send the full dataset on every page load.

At scale this causes:
- Large payloads (especially with `checklist` arrays embedded in cards)
- No pagination
- Slow TTFB

**Fix:** Implement lazy loading — load columns eagerly, load cards per-column on demand (or paginate them).

---

### 4.3 Column Reorder Uses N Individual `findByIdAndUpdate` Calls (N+1 Problem)

**File:** `controllers/columnController.js` lines 70–74

```js
for (let i = 0; i < filtered.length; i++) {
  await Column.findByIdAndUpdate(filtered[i]._id, { position: i }); // ❌ N queries
}
```

Reordering 10 columns = 10 round trips. This is already fixed in `reorderColumn` which uses `bulkWrite`, but `updateColumn` still has the old pattern. The `deleteColumn` function has the same N+1 problem on lines 102–106.

---

### 4.4 Rate Limiting Only on Registration, Nowhere Else

**File:** `controllers/authController.js`

Redis-based rate limiting exists only for `/register`. There is:
- No rate limit on `/login` → brute-force password attacks
- No rate limit on `/forgetpassword` → email bombing
- No rate limit on `/api/invite` → admin can spam-send invites

---

### 4.5 Redis Connection Error Is Not Handled Gracefully

**File:** `server.js` lines 58–63

```js
try {
  await redisClient.connect();
} catch (err) {
  console.error("Redis connection failed:", err);
  // ❌ Server continues running without Redis
}
```

If Redis fails to connect, the server still starts. Then every call to `redisClient.get()` or `redisClient.set()` in the auth controller will throw an unhandled error. The correct behavior is to either exit the process or disable Redis-dependent features gracefully.

---

### 4.6 `position` Fields Use Floating Point Integer Incrementing

Cards and columns use `lastPosition + 1` for ordering. After many inserts/deletes, consecutive renumbering involves bulk updates. A more scalable approach uses **fractional indexing** (e.g., Jira, Linear) where inserting between two items doesn't require rewriting all other positions.

---

## 📊 5. Analytics Readiness

---

### 5.1 `analyticsController.js` Is Completely Empty

**File:** `controllers/analyticsController.js`

All four analytics functions are empty stubs. This is a placeholder, not an implementation.

---

### 5.2 `Activity` Model Is Card-Scoped Only

**File:** `models/Board/activity.js`

The `Activity` model requires a `cardId`, making it impossible to log:
- Board-level events (board created, archived)
- Column events (column added, renamed, deleted)
- Member events (member joined, member removed)
- Organization events

For a real audit trail and dashboard analytics, activity logging must be entity-agnostic:

```js
// Recommended improved Activity schema
{
  actor:      { type: ObjectId, ref: "User", required: true },
  orgId:      { type: ObjectId, ref: "Organization" },        // for org-level queries
  boardId:    { type: ObjectId, ref: "Board" },
  entityType: { type: String, enum: ["card","column","board","org","member"] },
  entityId:   { type: ObjectId },                             // polymorphic ref
  action:     { type: String, required: true },               // "card.created", "member.removed"
  metadata:   { type: mongoose.Schema.Types.Mixed },          // { from: "Todo", to: "Done" }
  createdAt:  Date
}
```

---

### 5.3 No `boardId` on Activity Makes Dashboard Queries Impossible

Even for existing activity logging, you cannot efficiently query "all activity for this board" without the `boardId` index. The model has `boardId` but it's pointing to the card's board — there's no way to log board-scoped events (like board creation) at all.

---

### 5.4 No Aggregation-Friendly Structure for Analytics

For dashboards like "cards completed per week", "most active board", or "member contribution per org", you need:
- A dedicated `CardStats` or summary collection populated by background jobs
- Or structured `Activity` events that can be aggregated efficiently

Currently the data doesn't exist to support any analytics query.

---

## ✨ 6. Optional Enhancements

Lower priority but worth planning:

| Enhancement | Description |
|---|---|
| **Soft Delete** | Add `deletedAt` timestamps instead of hard-deleting cards/columns so data can be recovered |
| **Audit Log** | Immutable audit trail of who changed what and when (separate from activity feed) |
| **Board Templates** | Allow saving a board's column structure as a reusable template |
| **Card Watchers** | Allow members to "watch" a card and receive notifications on updates |
| **Board Cover Images** | `Board` has no cover/background image field (unlike Trello) |
| **Card Comments** | There is no comment system — only activity logs |
| **Webhook Support** | Allow orgs to register webhook URLs for events (integration with Slack, etc.) |
| **Board Visibility** | `public`, `org-private`, `board-private` visibility tiers |
| **Two-Factor Auth** | No 2FA on the auth system |
| **Pagination** | No pagination on any list endpoint (invites, members, cards, boards) |
| **AI Integration** | The Gemini client is set up but the `/test` route needs to become a real feature |

---

## 📋 7. Detailed Improvement Roadmap

This is your prioritized action plan. Do **Phase 1** before shipping anything.

---

### Phase 1 — Critical Fixes (Ship-blocking)

| # | What | File(s) |
|---|---|---|
| P1-1 | Import `User` in `inviteController.js` | `controllers/inviteController.js` |
| P1-2 | Add `"cancelled"` to Invite status enum | `models/inivites.js` |
| P1-3 | Fix `isAdmin` to read `orgId` from `req.params` or `req.query` | `middleware/adminMiddleware.js` |
| P1-4 | Fix `cancelInvite`: add admin authorization check | `controllers/inviteController.js` |
| P1-5 | Fix `getOrgInvites`: add membership authorization check | `controllers/inviteController.js` |
| P1-6 | Fix verify/reset URLs from `localhost` to `process.env.CLIENT_URL` | `controllers/authController.js` |
| P1-7 | Fix `org.orgName` → `org.name` in invite email | `controllers/inviteController.js` |
| P1-8 | Fix import casing: `authMiddleware.js` → `authmiddleware.js` | `Routes/cardRoute.js`, `Routes/Board/checklist.js` |
| P1-9 | Remove `console.log(user)` from `forgetpassword` | `controllers/authController.js` |
| P1-10 | Remove or protect the `/test` Gemini route | `server.js` |

---

### Phase 2 — Access Control (Security-critical)

| # | What | File(s) to Create/Modify |
|---|---|---|
| P2-1 | Create `boardAccessMiddleware.js`: checks org membership OR board membership | `middleware/boardAccessMiddleware.js` [NEW] |
| P2-2 | Apply `boardAccessMiddleware` to all board-detail, column, and card routes | `Routes/boardRoute.js`, `Routes/columnRoute.js`, `Routes/cardRoute.js`, `Routes/Board/index.js` |
| P2-3 | Fix `getBoard` query to include org members | `controllers/boardController.js` |
| P2-4 | Validate card IDs belong to correct board in `reorderCard` | `controllers/cardController.js` |

---

### Phase 3 — Schema Fixes (Data Integrity)

| # | What | File(s) |
|---|---|---|
| P3-1 | Add `unique: true` to `User.email` | `models/user.js` |
| P3-2 | Add compound unique index `{ orgId, userId }` to `Membership` | `models/memberships.js` |
| P3-3 | Add `required: true` to `Column.title` and `Column.boardId`; add `timestamps` | `models/Board/column.js` |
| P3-4 | Add indexes to all models (see §4.1 table) | All model files |
| P3-5 | Add TTL index on `Invite.expiresAt` for auto-cleanup | `models/inivites.js` |
| P3-6 | Add `boardId` + `type` fields to `Invite` model | `models/inivites.js` |

---

### Phase 4 — Missing Features (Core Functionality)

| # | What | File(s) to Create/Modify |
|---|---|---|
| P4-1 | Auto-create personal org on user registration | `controllers/authController.js` |
| P4-2 | Fix `getOrganization` to return all orgs user is a member of | `controllers/organizationController.js` |
| P4-3 | Add `removeMember` and `updateMemberRole` endpoints | `controllers/membersController.js`, `Routes/members.js` |
| P4-4 | Add board-level invite flow (`sendBoardInvite`, `acceptBoardInvite`) | `controllers/inviteController.js`, `Routes/invite.js` |
| P4-5 | Add archive/restore endpoints for boards and cards | `controllers/boardController.js`, `controllers/cardController.js` |
| P4-6 | Add `deleteLabel` endpoint | `controllers/Board/labelController.js`, `Routes/Board/labels.js` |
| P4-7 | Move label route business logic from route file to controller | `Routes/Board/index.js`, `controllers/Board/labelController.js` |

---

### Phase 5 — Analytics (Dashboard Readiness)

| # | What | File(s) to Create/Modify |
|---|---|---|
| P5-1 | Redesign `Activity` schema to be entity-agnostic | `models/Board/activity.js` |
| P5-2 | Implement activity logging on all write operations | All controllers |
| P5-3 | Implement `activityAnalytics`, `overView`, `topBoards`, `mostActiveOrganisation` | `controllers/analyticsController.js` |
| P5-4 | Add rate limiting to login, forgot-password, and invite routes | `middleware/` [NEW: `rateLimitMiddleware.js`] |

---

### Phase 6 — Scalability

| # | What | File(s) to Create/Modify |
|---|---|---|
| P6-1 | Replace per-column card loading with pagination | `controllers/boardController.js` |
| P6-2 | Replace N+1 column reorder in `updateColumn` and `deleteColumn` with `bulkWrite` | `controllers/columnController.js` |
| P6-3 | Consider `BoardMembership` collection to replace `board.members[]` | `models/Board/boards.js`, `models/Board/boardMembership.js` [NEW] |
| P6-4 | Add Redis graceful fallback on connection failure | `server.js` |

---

*Audit completed on 2026-04-24. No source code was modified.*

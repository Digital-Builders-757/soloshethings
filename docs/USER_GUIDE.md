# User Guide

**Purpose:** Complete user role definitions, capabilities, restrictions, and UX expectations for SoloSheThings platform.

## User Roles Overview

SoloSheThings has five distinct user roles, each with specific capabilities and access levels:

1. **Anonymous Visitor** - Not logged in, public access only
2. **Authenticated Free-Trial User** - Logged in, 7-day trial period
3. **Subscribed Member** - Active paid subscription ($3.99/month)
4. **Admin/Editor** - Platform moderation and bi-weekly posts
5. **WordPress Author/Editor** - Editorial content management (separate system)

---

## Role 1: Anonymous Visitor

**Definition:** User not logged in, accessing public content only.

### What They Can See

**Marketing Pages:**
- ✅ Landing page (`/`)
- ✅ About page (`/about`)
- ✅ Pricing page (`/pricing`)
- ✅ Contact page (`/contact`)
- ✅ Terms of service (`/terms`)
- ✅ Privacy policy (`/privacy`)

**WordPress Blog Content:**
- ✅ Blog list page (`/blog`) - All published posts
- ✅ Individual blog posts (`/blog/[slug]`) - Full content
- ✅ Blog post images and media
- ✅ Blog navigation and categories

**Public Previews:**
- ✅ Public profile previews (limited fields: username, avatar, bio)
- ✅ Public community post previews (if feature enabled)

### What They Can Do

**Account Actions:**
- ✅ Sign up for new account
- ✅ Log in to existing account
- ✅ Request password reset
- ✅ View pricing and subscription information

**Content Actions:**
- ✅ Read all WordPress blog posts (unlimited)
- ✅ Share blog posts (via URL)
- ✅ Browse public content previews

### What They Cannot Do

**Account Restrictions:**
- ❌ Cannot access user dashboard
- ❌ Cannot create or edit profile
- ❌ Cannot upload images or files
- ❌ Cannot save posts for later

**Community Restrictions:**
- ❌ Cannot view community posts (except public previews)
- ❌ Cannot create community posts
- ❌ Cannot comment or react to posts
- ❌ Cannot send messages
- ❌ Cannot access saved posts

**Subscription Restrictions:**
- ❌ Cannot subscribe (must sign up first)
- ❌ Cannot access premium features

**UX Copy Expectations:**

**When Accessing Protected Routes:**
```
"You need to sign in to access this page."
[Sign In] [Sign Up]
```

**When Attempting Actions Requiring Auth:**
```
"Please sign in to continue."
[Sign In] [Sign Up]
```

**Call-to-Action on Public Pages:**
```
"Join SoloSheThings to connect with solo female travelers"
[Get Started - Free Trial]
```

---

## Role 2: Authenticated Free-Trial User

**Definition:** User logged in with active 7-day free trial. Full access during trial, limited access after expiration.

### What They Can See

**During Trial (7 Days):**

**Dashboard & Profile:**
- ✅ Personal dashboard (`/dashboard`)
- ✅ Own profile (`/profile`)
- ✅ Profile settings (`/settings`)
- ✅ Own saved posts (`/saved`)

**Community Content:**
- ✅ All public community posts
- ✅ Own posts (public and private)
- ✅ Post detail pages (public posts)
- ✅ User profiles (public profiles only)
- ✅ Post images (public posts and own posts)

**WordPress Content:**
- ✅ All WordPress blog posts (unlimited reading)
- ✅ Blog post detail pages
- ✅ Save WordPress posts to reading list

**Subscription Information:**
- ✅ Trial countdown timer
- ✅ Days remaining in trial
- ✅ Subscription options and pricing

### What They Can Do

**During Trial (7 Days):**

**Profile Management:**
- ✅ Create and edit profile
- ✅ Upload profile avatar
- ✅ Set privacy settings (public/limited/private)
- ✅ Update username and bio

**Community Features:**
- ✅ Create community posts (unlimited)
- ✅ Upload images to posts (multiple images)
- ✅ Edit own posts
- ✅ Delete own posts
- ✅ Set post privacy (public/private)
- ✅ Save WordPress posts
- ✅ Save community posts
- ✅ Report inappropriate content

**Content Interaction:**
- ✅ Read unlimited WordPress posts
- ✅ Read unlimited community posts
- ✅ View public profiles
- ✅ View post images

**After Trial Expires (If Not Subscribed):**

**Limited Access:**
- ⚠️ Read up to 3 WordPress posts per day
- ⚠️ Read up to 3 community posts per day
- ⚠️ View own profile and saved posts
- ❌ Cannot create new posts
- ❌ Cannot send messages
- ❌ Cannot access premium features

### What They Cannot Do

**During Trial:**
- ❌ Cannot access premium features (events, workshops - future)
- ❌ Cannot view other users' private posts
- ❌ Cannot edit other users' content
- ❌ Cannot access admin features

**After Trial Expires:**
- ❌ Cannot create new community posts
- ❌ Cannot upload new images
- ❌ Cannot send messages
- ❌ Cannot read more than 3 posts per day
- ❌ Cannot access premium features

**UX Copy Expectations:**

**Trial Countdown Display:**
```
"Your free trial ends in 3 days"
[Upgrade to Continue Access]
```

**Trial Expired Message:**
```
"Your free trial has ended. Subscribe to continue accessing all features."
[Subscribe Now - $3.99/month]
```

**Read Limit Reached:**
```
"You've reached your daily reading limit (3 posts). Subscribe to read unlimited posts."
[Subscribe Now]
```

**When Attempting Restricted Action After Trial:**
```
"This feature requires an active subscription. Your trial has ended."
[Subscribe Now - $3.99/month] [Learn More]
```

**Upgrade Prompt:**
```
"Upgrade to keep your access to all community features"
[Subscribe - $3.99/month] [Remind Me Later]
```

---

## Role 3: Subscribed Member

**Definition:** User with active paid subscription ($3.99/month). Full access to all community features.

### What They Can See

**All Trial User Capabilities Plus:**
- ✅ Unlimited WordPress blog posts (no daily limit)
- ✅ Unlimited community posts (no daily limit)
- ✅ All premium features (when available)
- ✅ Events and workshops (when implemented)
- ✅ Subscription management page
- ✅ Billing history and receipts

### What They Can Do

**All Trial User Capabilities Plus:**
- ✅ Create unlimited community posts
- ✅ Upload unlimited images
- ✅ Read unlimited posts (no daily limit)
- ✅ Send messages (when implemented)
- ✅ RSVP to events (when implemented)
- ✅ Access workshops (when implemented)
- ✅ Manage subscription (cancel, update payment)
- ✅ View billing history

### What They Cannot Do

**Access Restrictions:**
- ❌ Cannot access admin features
- ❌ Cannot moderate content
- ❌ Cannot view other users' private posts
- ❌ Cannot edit other users' content
- ❌ Cannot access WordPress admin (separate system)

**Subscription Restrictions:**
- ❌ Cannot change subscription price (fixed at $3.99/month)
- ❌ Cannot access features beyond subscription tier (single tier currently)

**UX Copy Expectations:**

**Subscription Status Display:**
```
"Active Subscription - $3.99/month"
Next billing: January 15, 2025
[Manage Subscription]
```

**When Subscription Payment Fails:**
```
"Your subscription payment failed. Please update your payment method to continue access."
[Update Payment Method]
```

**When Subscription Canceled:**
```
"Your subscription will end on January 15, 2025. You'll continue to have access until then."
[Reactivate Subscription]
```

**Access Confirmation:**
```
"Welcome back! You have full access to all features."
[Explore Community] [Create Post]
```

---

## Role 4: Admin/Editor

**Definition:** Platform administrator with moderation powers and bi-weekly post creation capabilities.

### What They Can See

**All Subscribed Member Capabilities Plus:**
- ✅ Admin dashboard (`/admin`)
- ✅ Moderation queue (`/admin/moderation`)
- ✅ All user reports (`/admin/reports`)
- ✅ User management (`/admin/users`)
- ✅ Content analytics (when implemented)
- ✅ All posts (including removed/archived)
- ✅ All user profiles (including private)
- ✅ All saved posts
- ✅ All subscription data

### What They Can Do

**Content Moderation:**
- ✅ Review and resolve reports
- ✅ Remove inappropriate content
- ✅ Archive posts
- ✅ Feature posts (highlight in community)
- ✅ Ban users (when implemented)
- ✅ View all content (including private)

**Content Creation:**
- ✅ Create bi-weekly admin posts
- ✅ Publish community posts as admin
- ✅ Feature posts
- ✅ Pin posts to top of feed

**User Management:**
- ✅ View all user profiles
- ✅ View user activity
- ✅ Manage user roles (when implemented)
- ✅ View subscription statuses

**Analytics (Future):**
- ✅ View platform analytics
- ✅ Export data reports
- ✅ Monitor platform health

### What They Cannot Do

**WordPress Restrictions:**
- ❌ Cannot edit WordPress content (separate system)
- ❌ Cannot access WordPress admin
- ❌ Cannot publish WordPress posts

**User Privacy:**
- ❌ Cannot modify user passwords
- ❌ Cannot access user payment details (Stripe handles)
- ❌ Cannot view user email addresses (unless necessary for moderation)

**System Restrictions:**
- ❌ Cannot modify database schema
- ❌ Cannot change subscription pricing
- ❌ Cannot access service role keys (security)

**UX Copy Expectations:**

**Admin Dashboard:**
```
"Admin Dashboard"
[Moderation Queue (5 pending)] [Reports (3 new)] [Create Admin Post]
```

**When Removing Content:**
```
"Are you sure you want to remove this post? This action cannot be undone."
[Remove Post] [Cancel]
```

**When Resolving Report:**
```
"Report resolved. User has been notified."
[View All Reports]
```

**Bi-Weekly Post Reminder:**
```
"It's time to create your bi-weekly admin post!"
[Create Admin Post]
```

---

## Role 5: WordPress Author/Editor

**Definition:** Content creator managing WordPress editorial/blog content. Separate from SoloSheThings platform.

### What They Can See

**WordPress Admin (Separate System):**
- ✅ WordPress admin dashboard
- ✅ All WordPress posts (draft, published, archived)
- ✅ WordPress media library
- ✅ WordPress categories and tags
- ✅ WordPress comments (if enabled)

**SoloSheThings Platform:**
- ✅ Same access as Anonymous Visitor (public blog content only)
- ✅ Can view published posts on SoloSheThings site
- ❌ Cannot access SoloSheThings admin
- ❌ Cannot access SoloSheThings user accounts

### What They Can Do

**WordPress Content Management:**
- ✅ Create WordPress blog posts
- ✅ Edit WordPress posts
- ✅ Publish WordPress posts
- ✅ Upload images to WordPress media library
- ✅ Organize posts with categories and tags
- ✅ Schedule posts for future publication
- ✅ Trigger webhook revalidation (when post published)

**Editorial Workflow:**
- ✅ Draft posts
- ✅ Review and edit posts
- ✅ Publish posts (triggers ISR revalidation on SoloSheThings)
- ✅ Update existing posts (triggers cache invalidation)

### What They Cannot Do

**SoloSheThings Platform Restrictions:**
- ❌ Cannot access SoloSheThings user accounts
- ❌ Cannot create community posts on SoloSheThings
- ❌ Cannot moderate SoloSheThings content
- ❌ Cannot access SoloSheThings admin dashboard
- ❌ Cannot manage SoloSheThings subscriptions

**WordPress Restrictions:**
- ❌ Cannot modify WordPress core files
- ❌ Cannot access WordPress database directly
- ❌ Cannot change WordPress configuration (admin only)

**UX Copy Expectations:**

**WordPress Admin (Separate System):**
```
"WordPress Admin Dashboard"
[New Post] [All Posts] [Media] [Categories]
```

**When Publishing Post:**
```
"Post published successfully. SoloSheThings cache will be updated automatically."
[View Post] [Edit Post]
```

**Webhook Revalidation Notice:**
```
"Post published. SoloSheThings site cache is being updated..."
```

---

## Creator Privacy Rules

### No Face Recognition Policy

**MUST:**
- ✅ Creator posts and photos are NOT processed with face recognition technology
- ✅ No facial recognition APIs are used on user-uploaded content
- ✅ No biometric data is collected from images
- ✅ User privacy is protected in all creator content

**MUST NOT:**
- ❌ Use face recognition on uploaded images
- ❌ Extract biometric data from photos
- ❌ Use facial recognition for content moderation
- ❌ Store facial recognition data

**UX Copy Expectations:**

**Privacy Notice on Upload:**
```
"Your privacy matters. We do not use face recognition technology on your photos."
[Learn More About Privacy]
```

**Privacy Policy Section:**
```
"Creator Privacy: We do not use face recognition or biometric analysis on user-uploaded content. Your photos are yours, and we respect your privacy."
```

**Image Upload Confirmation:**
```
"Photo uploaded successfully. Your content is private and will not be analyzed with face recognition technology."
```

### Content Ownership

**User Rights:**
- ✅ Users own their content
- ✅ Users can delete their content at any time
- ✅ Users control privacy settings
- ✅ Users can download their content (when implemented)

**Platform Rights:**
- ✅ Platform can remove content that violates guidelines
- ✅ Platform can moderate reported content
- ✅ Platform can archive content for moderation purposes

**UX Copy Expectations:**

**Content Deletion:**
```
"Are you sure you want to delete this post? This action cannot be undone."
[Delete Post] [Cancel]
```

**Privacy Settings:**
```
"Who can see this post?"
○ Public - All authenticated users
○ Private - Only you
[Save Privacy Settings]
```

---

## Role Comparison Matrix

| Feature | Anonymous | Trial User | Subscribed | Admin | WP Editor |
|---------|-----------|------------|------------|-------|-----------|
| **Read WordPress Blog** | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| **Read Community Posts** | ❌ No | ✅ Unlimited (trial) / 3/day (expired) | ✅ Unlimited | ✅ Unlimited | ❌ No |
| **Create Community Posts** | ❌ No | ✅ Yes (trial) / ❌ No (expired) | ✅ Yes | ✅ Yes | ❌ No |
| **Upload Images** | ❌ No | ✅ Yes (trial) / ❌ No (expired) | ✅ Yes | ✅ Yes | ❌ No |
| **Save Posts** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Send Messages** | ❌ No | ❌ No | ✅ Yes (future) | ✅ Yes (future) | ❌ No |
| **Moderate Content** | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No |
| **Create Admin Posts** | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No |
| **Create WP Posts** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **View Private Content** | ❌ No | ❌ Own only | ❌ Own only | ✅ All | ❌ No |
| **Manage Subscriptions** | ❌ No | ✅ Own | ✅ Own | ✅ All | ❌ No |

---

## Common User Flows

### Signup → Trial → Subscribe

1. **Anonymous Visitor** signs up
2. **Trial User** (7 days) - Full access
3. **Trial Expires** - Limited to 3 posts/day
4. **Subscribes** - Full access restored

### Content Creation Flow

1. **Trial/Subscribed User** creates post
2. Uploads images (privacy: public/private)
3. Publishes post
4. Post appears in community feed
5. Other users can view (if public)

### Moderation Flow

1. **User** reports inappropriate content
2. **Admin** reviews report in moderation queue
3. **Admin** takes action (remove, archive, dismiss)
4. User notified of resolution

### WordPress Editorial Flow

1. **WordPress Editor** creates post in WordPress admin
2. Publishes post
3. Webhook triggers SoloSheThings cache revalidation
4. Post appears on SoloSheThings blog page
5. **All Users** can read post (public)

---

## Error Messages by Role

### Anonymous Visitor

**Accessing Protected Route:**
```
"You need to sign in to access this page."
[Sign In] [Sign Up]
```

**Attempting Action:**
```
"Please sign in to continue."
[Sign In] [Sign Up]
```

### Trial User (Expired)

**Read Limit Reached:**
```
"You've reached your daily reading limit (3 posts). Subscribe to read unlimited posts."
[Subscribe Now - $3.99/month]
```

**Creating Post After Trial:**
```
"Your trial has ended. Subscribe to create posts and connect with the community."
[Subscribe Now] [Learn More]
```

### Subscribed Member

**Payment Failed:**
```
"Your subscription payment failed. Please update your payment method."
[Update Payment Method]
```

**Subscription Canceled:**
```
"Your subscription will end on [date]. You'll continue to have access until then."
[Reactivate Subscription]
```

### Admin

**Unauthorized Action:**
```
"You don't have permission to perform this action."
[Back to Dashboard]
```

---

**Related Documents:**
- [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md) - Access control rules
- [BILLING_STRIPE_CONTRACT.md](./contracts/BILLING_STRIPE_CONTRACT.md) - Subscription details
- [AUTH_CONTRACT.md](./contracts/AUTH_CONTRACT.md) - Authentication flows
- [SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md) - Privacy and security rules

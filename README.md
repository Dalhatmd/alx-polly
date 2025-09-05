# ALX Polly: A Polling Application

Welcome to ALX Polly, a full-stack polling application built with Next.js, TypeScript, and Supabase. This project serves as a practical learning ground for modern web development concepts, with a special focus on identifying and fixing common security vulnerabilities.

## About the Application

ALX Polly allows authenticated users to create, share, and vote on polls. It's a simple yet powerful application that demonstrates key features of modern web development:

-   **Authentication**: Secure user sign-up and login.
-   **Poll Management**: Users can create, view, and delete their own polls.
-   **Voting System**: A straightforward system for casting and viewing votes.
-   **User Dashboard**: A personalized space for users to manage their polls.

The application is built with a modern tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Backend & Database**: [Supabase](https://supabase.io/)
-   **UI**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
-   **State Management**: React Server Components and Client Components

---

## 🚀 The Challenge: Security Audit & Remediation

As a developer, writing functional code is only half the battle. Ensuring that the code is secure, robust, and free of vulnerabilities is just as critical. This version of ALX Polly has been intentionally built with several security flaws, providing a real-world scenario for you to practice your security auditing skills.

**Your mission is to act as a security engineer tasked with auditing this codebase.**

### Your Objectives:

1.  **Identify Vulnerabilities**:
    -   Thoroughly review the codebase to find security weaknesses.
    -   Pay close attention to user authentication, data access, and business logic.
    -   Think about how a malicious actor could misuse the application's features.

2.  **Understand the Impact**:
    -   For each vulnerability you find, determine the potential impact.Query your AI assistant about it. What data could be exposed? What unauthorized actions could be performed?

3.  **Propose and Implement Fixes**:
    -   Once a vulnerability is identified, ask your AI assistant to fix it.
    -   Write secure, efficient, and clean code to patch the security holes.
    -   Ensure that your fixes do not break existing functionality for legitimate users.

### Where to Start?

A good security audit involves both static code analysis and dynamic testing. Here’s a suggested approach:

1.  **Familiarize Yourself with the Code**:
    -   Start with `app/lib/actions/` to understand how the application interacts with the database.
    -   Explore the page routes in the `app/(dashboard)/` directory. How is data displayed and managed?
    -   Look for hidden or undocumented features. Are there any pages not linked in the main UI?

2.  **Use Your AI Assistant**:
    -   This is an open-book test. You are encouraged to use AI tools to help you.
    -   Ask your AI assistant to review snippets of code for security issues.
    -   Describe a feature's behavior to your AI and ask it to identify potential attack vectors.
    -   When you find a vulnerability, ask your AI for the best way to patch it.

---

## Getting Started

To begin your security audit, you'll need to get the application running on your local machine.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [Supabase](https://supabase.io/) account (the project is pre-configured, but you may need your own for a clean slate).

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd alx-polly
npm install
```

### 3. Environment Variables

The project uses Supabase for its backend. An environment file `.env.local` is needed.Use the keys you created during the Supabase setup process.

### 4. Running the Development Server

Start the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 📖 Usage Guide

### Getting Started with ALX Polly

Once you have the application running, here's how to use all the features:

#### 1. User Registration and Authentication

**Creating a New Account:**
1. Navigate to `http://localhost:3000`
2. Click "Sign Up" or go to `/register`
3. Fill in your details:
   ```
   Name: Your Full Name
   Email: your.email@example.com
   Password: (minimum 8 characters)
   ```
4. Click "Create Account"
5. Check your email for verification (if configured in Supabase)

**Logging In:**
1. Go to `/login` or click "Log In"
2. Enter your credentials:
   ```
   Email: your.email@example.com
   Password: your_password
   ```
3. Click "Sign In"
4. You'll be redirected to the polls dashboard

#### 2. Creating Your First Poll

**Step-by-Step Poll Creation:**
1. After logging in, click "Create New Poll" or navigate to `/create`
2. Fill out the poll form:
   ```
   Poll Question: "What's your favorite programming language?"
   
   Options:
   - JavaScript
   - Python
   - TypeScript
   - Go
   ```
3. Add more options by clicking "Add Option"
4. Remove options by clicking "Remove" (minimum 2 options required)
5. Click "Create Poll"
6. Your poll will be created and you'll be redirected to the polls list

**Poll Creation Tips:**
- Keep questions clear and concise
- Provide balanced and comprehensive options
- You can add unlimited poll options
- HTML tags are automatically sanitized for security

#### 3. Managing Your Polls

**Viewing Your Polls:**
- Go to `/polls` to see all your created polls
- Each poll card shows:
  - Poll question
  - Number of options
  - Total vote count
  - Creation date

**Editing Polls:**
1. Click on any of your polls
2. Click the "Edit" button (only visible for poll owners)
3. Modify the question or options
4. Click "Update Poll" to save changes

**Deleting Polls:**
1. From your polls list, click on a poll
2. Click the "Delete" button (only visible for poll owners)
3. Confirm the deletion in the popup
4. The poll will be permanently removed

#### 4. Voting on Polls

**How to Vote:**
1. Navigate to any poll by clicking on it
2. Review the question and options
3. Select your preferred option
4. Click "Submit Vote"
5. View real-time results after voting

**Voting Features:**
- Anonymous voting is allowed (even without account)
- One vote per session (basic implementation)
- Real-time vote counting
- Visual results display

#### 5. Sharing Polls

**Getting Poll Links:**
- Each poll has a unique URL: `/polls/[poll-id]`
- Share this URL with others to collect votes
- No authentication required for voting

**Example Poll URL:**
```
http://localhost:3000/polls/abc123-def456-ghi789
```

### 🔧 Advanced Features

#### Admin Panel (For Administrators)

If you have admin privileges:

1. **Accessing Admin Panel:**
   - Navigate to `/admin`
   - Only users with admin role can access this page

2. **Admin Capabilities:**
   - View all polls in the system
   - See poll owner information
   - Delete any poll (with proper authorization)
   - Monitor system usage

3. **Setting Up Admin Users:**
   ```sql
   -- Option 1: Using user_profiles table
   INSERT INTO user_profiles (user_id, role) 
   VALUES ('user-uuid-here', 'admin');
   
   -- Option 2: Using admin_users table  
   INSERT INTO admin_users (user_id, is_active) 
   VALUES ('user-uuid-here', true);
   ```

#### API Endpoints

The application provides server actions for:

- **Authentication:**
  - `login(data)` - User login
  - `register(data)` - User registration
  - `logout()` - User logout

- **Poll Management:**
  - `createPoll(formData)` - Create new poll
  - `getUserPolls()` - Get user's polls
  - `getPollById(id)` - Get specific poll
  - `updatePoll(id, formData)` - Update poll
  - `deletePoll(id)` - Delete poll
  - `submitVote(pollId, optionIndex)` - Submit vote

### 📱 User Interface Guide

#### Navigation
- **Header:** Contains app logo, navigation links, and user menu
- **Dashboard:** Main area showing your polls and actions
- **Footer:** Additional links and information

#### Responsive Design
- Mobile-friendly interface
- Touch-optimized buttons and forms
- Adaptive layouts for all screen sizes

#### Accessibility Features
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators

### 🎯 Usage Examples

#### Example 1: Survey Poll
```
Question: "How satisfied are you with our service?"
Options:
- Very Satisfied
- Satisfied  
- Neutral
- Dissatisfied
- Very Dissatisfied
```

#### Example 2: Decision Making Poll
```
Question: "Which feature should we prioritize next?"
Options:
- Dark mode theme
- Mobile app
- Advanced analytics
- Team collaboration
- API integration
```

#### Example 3: Event Planning Poll
```
Question: "What time works best for the team meeting?"
Options:
- 9:00 AM
- 11:00 AM
- 2:00 PM
- 4:00 PM
```

### 🔒 Security Best Practices

When using ALX Polly:

1. **Account Security:**
   - Use strong, unique passwords
   - Keep login credentials secure
   - Log out when finished

2. **Poll Creation:**
   - Avoid including sensitive information
   - Be mindful of poll visibility (public voting)
   - Review options before publishing

3. **Voting:**
   - Vote honestly and responsibly
   - Respect poll creator's intent
   - Don't attempt to manipulate results

Good luck, engineer! This is your chance to step into the shoes of a security professional and make a real impact on the quality and safety of this application. Happy hunting!

---

# Critical Security Fixes Applied

## Overview
This document outlines the critical security vulnerabilities that were identified and fixed in the ALX Polly application.

## 🚨 Critical Issues Fixed

### 1. ✅ Fixed Broken Supabase Middleware Configuration
**File:** `lib/supabase/middleware.ts`
- **Issue:** Malformed middleware with syntax errors and broken CSRF protection
- **Fix Applied:**
  - Fixed all syntax errors and restructured the middleware properly
  - Implemented proper environment variable validation
  - Added functional CSRF protection for POST requests using origin/referer checks
  - Added proper public path handling for auth routes
- **Security Impact:** HIGH → RESOLVED

### 2. ✅ Implemented Proper Admin Authorization System
**Files:** `lib/auth/admin.ts`, `app/(dashboard)/admin/page.tsx`, `app/(dashboard)/admin/AdminPageClient.tsx`
- **Issue:** Admin access was determined by hardcoded email check (`admin@admin.com`)
- **Fix Applied:**
  - Created proper server-side admin role checking system
  - Added support for database-based role validation via `user_profiles` and `admin_users` tables
  - Implemented server-side admin page protection with automatic redirect
  - Separated client-side functionality into dedicated component
- **Security Impact:** HIGH → RESOLVED

### 3. ✅ Added Environment Variable Validation
**Files:** `lib/supabase/client.ts`, `lib/supabase/server.ts`
- **Issue:** Used `!` assertion on environment variables without proper validation
- **Fix Applied:**
  - Added explicit validation for all required environment variables
  - Implemented graceful error handling with descriptive error messages
  - Removed unsafe non-null assertion operators
- **Security Impact:** MEDIUM → RESOLVED

### 4. ✅ Enhanced Authorization in Poll Actions
**File:** `app/lib/actions/poll-actions.ts`
- **Issue:** Missing proper authorization checks in poll deletion function
- **Fix Applied:**
  - Added proper ownership verification for poll deletion
  - Integrated admin role checking for administrative deletions
  - Enhanced input validation with proper regex patterns
  - Improved error handling and access control
- **Security Impact:** MEDIUM → RESOLVED

### 5. ✅ Updated Dependencies
**File:** `package.json`, `package-lock.json`
- **Issue:** Next.js had multiple moderate severity vulnerabilities
- **Fix Applied:**
  - Updated Next.js from 15.4.1 to 15.5.2
  - Resolved all dependency vulnerabilities using `npm audit fix --force`
  - All security advisories addressed:
    - Content Injection Vulnerability for Image Optimization
    - Improper Middleware Redirect Handling (SSRF)
    - Cache Key Confusion for Image Optimization API Routes
- **Security Impact:** MEDIUM → RESOLVED

### 6. ✅ Fixed Code Syntax Issues
**Files:** `app/(auth)/login/page.tsx`, `app/(dashboard)/polls/vulnerable-share.tsx`
- **Issue:** TypeScript compilation errors preventing proper build
- **Fix Applied:**
  - Fixed missing closing braces in login page
  - Corrected TypeScript type issues in sanitization function
  - Ensured proper type safety throughout the application
- **Security Impact:** LOW → RESOLVED

### 7. ✅ Fixed Client-side Redirection Vulnerability
**Issue:** Client-side redirection used `window.location.href` which made it susceptible to open redirection attacks.
**Fix:** All redirections are now done on the server within the login function
- **Security Impact:** MEDIUM → RESOLVED

## 🔧 Additional Security Enhancements Implemented

### Database Schema Requirements
The application now expects the following database tables for proper security:

1. **user_profiles** table:
   ```sql
   CREATE TABLE user_profiles (
     user_id UUID PRIMARY KEY REFERENCES auth.users(id),
     role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user'
   );
   ```

2. **admin_users** table (fallback):
   ```sql
   CREATE TABLE admin_users (
     user_id UUID PRIMARY KEY REFERENCES auth.users(id),
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### Environment Configuration
Created `.env.example` template with required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CSRF_SECRET` (optional)

## ✅ Verification Status

All critical security vulnerabilities have been addressed:
- ✅ TypeScript compilation passes without errors
- ✅ All dependencies updated and vulnerabilities resolved
- ✅ Proper authentication and authorization implemented
- ✅ Environment variable validation in place
- ✅ Middleware functionality restored and secured
- ✅ Admin access control properly implemented

## 🚀 Deployment Readiness

The application is now secure for production deployment with the following requirements:

1. Set up proper environment variables
2. Configure the database with required tables for admin roles
3. Test admin functionality with proper role assignments
4. Verify CSRF protection is working for POST requests

## Next Steps (Recommended)

For additional security hardening, consider implementing:
1. Rate limiting for API endpoints
2. Content Security Policy (CSP) headers
3. Input validation with Zod schemas
4. Proper session management configuration
5. Database row-level security (RLS) policies in Supabase



  Modular Bible Web Application

> A full-stack Bible study platform featuring multi-translation Bible reader, interlinear Hebrew/Greek analysis, weekly Torah portion studies, biblical recipes database, genealogy tools, and advanced search—demonstrating production-ready architecture, security best practices, and scalable design patterns.

 Tech Stack:  PHP, MySQL, SQLite, JavaScript, HTML5/CSS3

---

   🎯 Project Overview

This application serves as a comprehensive portfolio project showcasing full-stack development skills with real-world complexity. Built from the ground up, it handles multiple Bible translations (150+ versions, 31,000+ verses), linguistic analysis of original Hebrew and Greek texts, secure user management, and extensible module architecture.

 Key Metrics: 
-  150+ Bible translations  stored in optimized SQLite databases
-  300,000+ Hebrew/Greek words  parsed with morphological data from STEPBible
-  30+ biblical recipes  with historical context and scripture references
-  52 Torah portions  with cross-references to Prophets and New Testament
-  Role-based permission system  with granular access control
-  RESTful API architecture  with 20+ endpoints
-  Responsive UI  with dark mode and accessibility features
-  User-specific data isolation  for highlights, preferences, and family trees

---

   ⚡ Technical Highlights

    Backend Architecture
-  Authentication & Security : Bcrypt password hashing (cost factor 12), session-based auth with HTTP-only cookies, SQL injection prevention via prepared statements throughout
-  API Design : RESTful endpoints with role-based authorization middleware, consistent JSON responses, comprehensive error handling
-  Hybrid Database Strategy : MySQL for transactional user data, SQLite for read-heavy Bible content—optimized for specific use cases
-  Data Processing : Custom PHP import scripts parse 300,000+ words from STEPBible TSV files into normalized SQLite schema
-  Performance : Optimized queries with proper indexing, connection pooling, lazy loading of large datasets

    Frontend Architecture
-  Vanilla JavaScript : Modular ES6+ patterns, async/await for API calls, no framework dependencies
-  State Management : LocalStorage for preferences, in-memory state for UI, optimistic updates
-  UX Features : Real-time verse highlighting, parallel Bible viewing, dynamic font sizing, persistent preferences, interactive word-by-word analysis
-  Responsive Design : Mobile-first approach with CSS Grid/Flexbox, touch-friendly interfaces, cross-browser compatibility

    System Design
-  Modularity : Feature-based organization enabling independent development and testing
-  Separation of Concerns : API layer decoupled from presentation, database abstraction layer
-  Scalability : Designed to add new Bible translations, study modules, and features without refactoring core system
-  Data Integrity : Foreign key constraints, normalized schemas, transaction handling

---

   🚀 Core Features

    📖 Multi-Translation Bible Reader
-  150+ English Translations : KJV, ASV, BBE, Darby, Webster, YLT, and 140+ others with easy addition of new versions
-  Intuitive Navigation : Chapter/verse browsing with keyboard shortcuts, bookmarks, reading history
-  Parallel Viewing : Side-by-side comparison of multiple translations
-  Cross-References : Clickable verse references with instant navigation
-  Personalization : User-specific highlights (8 colors), private annotations, reading preferences
-  Accessibility : Dark mode, adjustable font sizes (12px-24px), high contrast options, responsive layouts

    🔤 Interlinear Bible (Hebrew & Greek)

 Technical Achievement:  This feature represents one of the most complex aspects of the application, requiring custom data processing pipelines and sophisticated UI rendering.

 Data Processing: 
-  Source : STEPBible Translators Amalgamated Hebrew OT (TAHOT) and Greek NT (TAGNT)
-  Import Pipeline : Custom PHP script processes 300,000+ words from tab-delimited files
-  Parsing : Handles STEPBible reference format (Book.Chapter.Verse), validates data integrity, maps book abbreviations
-  Schema : Normalized design with `verses` table (31,000+ records) and `words` table (300,000+ records) linked by foreign keys
-  Coverage : Complete Old Testament in Hebrew, complete New Testament in Greek

 Linguistic Features: 
-  Original Text : Hebrew (right-to-left display) and Greek displayed with proper Unicode rendering
-  Transliteration : Romanized pronunciation guide for each word
-  Strong's Numbers : Concordance references for lexical study (e.g., H430, G2316)
-  Morphological Parsing : Part of speech, tense, voice, mood, person, number, gender, case
-  Gloss : Brief English definition for each word
-  English Word : Translation in context

 User Interface: 
-  Multiple Display Modes : 
  - Interlinear (stacked): Original above English in traditional format
  - Side-by-side: Parallel columns for comparison
  - Line view: Continuous reading flow
-  Interactive Words : Click any word to see detailed grammatical analysis in side panel
-  Toggleable Elements : Show/hide transliteration, Strong's numbers, morphology, or gloss independently
-  Responsive Layout : Adapts to mobile (slide-in panels) and desktop (split view)
-  Font Size Control : Adjustable 12-24px with real-time preview

 Technical Implementation: 

Interlinear.db (SQLite) schema:
- books (66 records)
- verses (31,000+ records) → testament, book_id, chapter, verse
- words (300,000+ records) → verse_id, word_position, original_text, transliteration, strongs_number, morphology, gloss, english_word, language

 Why This Matters:  Demonstrates ability to work with complex linguistic data, implement efficient data pipelines, and create intuitive interfaces for scholarly tools.

    📜 Shabbat Study (Weekly Torah Portions)

 Custom Content Management:  All Torah portion content is stored in MySQL and manually curated with theological accuracy and educational value.

 Features: 
-  Automatic Timing : Fetches current Shabbat candle lighting and Havdalah times via Hebcal API based on user's geolocation
-  52 Weekly Portions : Complete annual cycle of Torah readings (Parashat)
-  Multi-Testament Integration :
  - Torah portion (5-10 key verses with commentary)
  - Haftarah reading from Prophets (3-5 verses with connection notes)
  - New Testament parallels (3-5 verses showing fulfillment/connection)
-  Teaching Content : Original written summaries, key themes, reflection questions
-  Responsive Design : Print-friendly layout, shareable via Web Share API

 Database Schema (MySQL): 

torah_portions table:
- portion_id, name, hebrew_name, torah_range
- summary, teaching_text, themes (JSON)
- questions (JSON array)

portion_verses table:
- torah_verses (book, chapter, verse_start, verse_end, commentary)
- haftarah_verses (reference, commentary)
- nt_verses (reference, commentary)

 User Experience: 
-  Location-Aware : Uses HTML5 Geolocation API for accurate local times (defaults to Jerusalem if denied)
-  Current Portion Detection : Backend calculates which portion to display based on Hebrew calendar date
-  Educational Focus : Designed for personal study or small group discussion with reflection questions

    🍞 Biblical Recipes Database

 Historical Research:  This feature showcases database design skills and attention to cultural/historical authenticity.

 Database Architecture (SQLite - recipes.db): 

recipes (30+ recipes):
- recipe_id, recipe_name, recipe_slug
- description, historical_context
- textual_certainty (explicit/implicit/reconstructed/traditional)
- servings, prep_time_minutes, cook_time_minutes, difficulty
- kosher_status, is_feast_related, notes

ingredients (40+ ingredients):
- ingredient_id, ingredient_name, ingredient_slug
- category (grain/legume/meat/dairy/spice/etc)
- biblical_name_hebrew, biblical_name_greek
- first_mention (book, chapter, verse)
- description

recipe_ingredients (many-to-many):
- recipe_id, ingredient_id, quantity
- preparation_note, is_optional

recipe_scripture_refs:
- recipe_id, book_name, chapter, verse_start, verse_end
- reference_type (primary/supporting/contextual)
- notes

recipe_steps:
- recipe_id, step_number, instruction

recipe_periods (links to historical_periods):
- 10 periods from Patriarchal Era (-2000 BCE) to NT Era (100 CE)

recipe_tags:
- Feast types (Passover, Tabernacles, etc.)
- Meal types (breakfast, lunch, dinner)
- Dietary info (vegetarian, kosher, grain-based)

 Features: 
-  Textual Certainty Levels :
  -  Explicit  (7 recipes): Directly described in Scripture (e.g., Esau's Lentil Stew - Genesis 25:29-34)
  -  Implicit  (10 recipes): Ingredients mentioned, methods inferred from context
  -  Reconstructed  (10 recipes): Based on archaeological evidence from ancient Near East
  -  Traditional  (5 recipes): Later Jewish/Christian culinary traditions
  
-  Historical Accuracy :
  - Only ingredients available in ancient Near East (no New World foods like tomatoes, potatoes)
  - Authentic cooking methods (clay ovens, open fire, stone grinding)
  - Archaeological context in recipe descriptions
  
-  Advanced Filtering :
  - By historical period (10 distinct eras)
  - By ingredient (40+ searchable items)
  - By feast/holiday association
  - By textual certainty level
  - By dietary restrictions (vegetarian, kosher, etc.)

-  Scripture Integration : Every recipe links to relevant Bible passages with explanatory notes

 User Interface: 
-  Grid/List Toggle : Switch between card-based and detailed list views
-  Modal Detail View : Full recipe with ingredients, steps, historical context, scripture references
-  Search : Real-time filtering by recipe name or description
-  Educational Content : Each recipe includes historical notes and cultural significance

 Why This Matters:  Demonstrates complex relational database design, data modeling for domain-specific content, and creating engaging educational interfaces.

    🔍 Advanced Bible Search
-  Full-Text Search : Keyword queries across all translations simultaneously
-  Advanced Filtering : By book, chapter, testament, translation, and date range
-  Performance : Optimized with indexes, returning results in <200ms
-  Results : Context-aware snippets with highlighted matches, clickable verse references

    👥 User System & Security

Security is architected from the ground up, not bolted on:

 Authentication: 
-  Password Hashing : Bcrypt with cost factor 12 (industry standard for 2024)
-  Session Management : Server-side sessions with regenerated IDs to prevent fixation attacks
-  Cookie Security : HTTP-only, Secure, SameSite attributes prevent XSS/CSRF
-  Login Flow : Rate limiting, failed attempt tracking, secure password reset

 Authorization (RBAC): 

User → User_Roles → Roles → Role_Rights → Rights → Resource Access with optional Direct User_Rights override

-  Hierarchical Roles : Admin, Editor, User with inherited permissions
-  Granular Rights : `view_bible`, `edit_highlights`, `manage_users`, `edit_tree`, etc.
-  API Middleware : Every endpoint validates permissions before processing
-  Database-Level Security : User-scoped queries with prepared statements

 Data Protection: 
-  SQL Injection Prevention : 100% prepared statements, parameterized queries throughout codebase
-  XSS Protection : `htmlspecialchars()` on all user-generated output, CSP headers
-  Input Validation : Type checking, sanitization, whitelist validation on all API inputs
-  Data Isolation : User highlights, family trees, preferences properly scoped by `user_id` in WHERE clauses

 Example Security Implementation: 
```php
// Password hashing
$hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// Session security
session_regenerate_id(true);
$_SESSION['user_id'] = $userId;

// Prepared statement
$stmt = $pdo->prepare("SELECT * FROM user_highlights WHERE user_id = ? AND verse_id = ?");
$stmt->execute([$userId, $verseId]);

// Output encoding
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');
```

 Why This Matters:  Demonstrates understanding of OWASP Top 10, authentication flows, and security principles required in production applications.

    🌳 Family Tree Builder
-  Interactive Canvas : HTML5 Canvas with drag-and-drop positioning, zoom/pan controls
-  Relationship Mapping : Multiple relationship types (parent, child, spouse, sibling) with visual connections
-  Visual Representation : Color-coded connections, hierarchical layouts, generational spacing
-  Persistence : User-owned trees saved to MySQL with proper access control
-  Data Model : Normalized schema supporting complex genealogical relationships

---

   🏗️ Architecture & Technical Decisions

    Hybrid Database Strategy

 MySQL (MariaDB) - `bible_web` database 

 Purpose : User accounts, permissions, and mutable user-generated content

 Why MySQL: 
- ACID compliance for transactional data (highlights, annotations)
- Mature replication/backup tools for production deployment
- Handles concurrent writes efficiently (multiple users updating data)
- Strong support for complex JOINs and referential integrity

 Tables: 

Authentication & Authorization:
- users (user_id, username, email, password_hash, created_at)
- user_roles (user_id, role_id) - many-to-many
- roles (role_id, role_name, description)
- role_rights (role_id, right_id) - many-to-many
- rights (right_id, right_name, description)
- user_rights (user_id, right_id) - direct overrides

User Content:
- user_highlights (highlight_id, user_id, verse_id, color, note, created_at)
- user_preferences (user_id, default_translation, font_size, theme)
- user_family_trees (tree_id, user_id, tree_name, tree_data_json)
- people (person_id, user_id, name, birth_date, notes)
- relationships (relationship_id, person_id_1, person_id_2, relationship_type)

Study Content:
- torah_portions (portion_id, name, hebrew_name, torah_range, summary, teaching_text)
- portion_verses (verse_id, portion_id, section_type, book, chapter, verse_start, verse_end, commentary)
- portion_themes (theme_id, portion_id, title, description)

 Design Principles: 
- Normalized to 3NF to eliminate redundancy
- Foreign key constraints enforce referential integrity
- Indexes on frequently queried columns (user_id, verse_id, book+chapter)
- JSON columns for flexible structured data (tree_data, themes)

---

 SQLite - Bible Translation & Study Databases 

 Purpose : Large, read-only datasets (Bible texts, interlinear data, recipes, cross-references)

 Why SQLite: 
-  Zero Configuration : No server setup, no connection management overhead
-  Performance : 3-5x faster than MySQL for read-heavy operations (full-text search on 31K verses)
-  Portability : Each translation is a self-contained file—easy to version control, distribute, backup
-  Isolation : Schema changes in one translation don't affect others
-  Simplicity : Direct file access with PDO, no network latency

 Database Files: 

SQLite databases stored in sqlite/ directory:
- ESV.db, KJV.db, ASV.db ... (150+ translation files)
- Schema: books, verses, verse_text

Interlinear.db (300,000+ words):
- books (66 records)
- verses (31,000+ records)
- words (original_text, transliteration, strongs_number, morphology, gloss)

recipes.db (30+ biblical recipes):
- recipes, ingredients, recipe_ingredients
- recipe_scripture_refs, recipe_steps
- recipe_periods, recipe_tags

extras/:
- cross_references_0-6.db (verse cross-reference data)

 Technical Advantages: 
-  Query Speed : Indexed full-text search returns results in <100ms
-  Storage Efficiency : Entire Bible translation ~10-15MB per file
-  Concurrent Reads : Multiple users can read simultaneously without locking
-  Data Integrity : Built-in foreign keys, CHECK constraints, UNIQUE indexes

 Trade-off Analysis: 

While a single unified database would be simpler to manage, the hybrid approach optimizes for the specific characteristics of each data type:

| Aspect | MySQL | SQLite |
|--------|-------|--------|
|  Use Case  | Write-heavy user data | Read-heavy Bible content |
|  Concurrency  | High writes | High reads |
|  Scalability  | Horizontal (replication) | Vertical (faster disks) |
|  Complexity  | Connection pooling, server mgmt | Direct file access |
|  Performance  | Slower reads, faster writes | Faster reads, N/A writes |
|  Deployment  | Requires server | Included with app |

 Real-World Parallel:  This mirrors strategies used by applications like Zotero (SQLite for local research library, MySQL for sync server) and Apple Notes (SQLite for on-device, CloudKit for sync).

The complexity cost is justified by:
1.  3-5x faster Bible searches  (measured with EXPLAIN QUERY PLAN)
2.  Simplified translation management  (add new Bible version = drop in new .db file)
3.  Reduced MySQL load  (offload 99% of read operations)
4.  Easier local development  (no need to import 150 Bible translations into MySQL)

---

    API Architecture

All dynamic functionality routes through PHP endpoints in `/api`:

```
api/
├── Authentication & Authorization
│   ├── login.php                POST: credential validation, session creation
│   ├── logout.php               POST: session cleanup
│   └── getuserpermissions.php   GET: retrieve user's effective rights
│
├── Bible Reader
│   ├── biblereader.php          GET: fetch verses by book/chapter/translation
│   ├── bible_search.php         GET: full-text search across translations
│   ├── bible_crossrefs.php      GET: related verse references
│   └── bibleversions.php        GET: list available translations
│
├── Interlinear Bible
│   └── interlinear.php          GET: Hebrew/Greek word-by-word data
│       ├── action=get_books     List available books by testament
│       └── action=get_chapter   Fetch parsed words with morphology
│
├── Shabbat Study
│   └── shabbat_portion.php      GET: current week's Torah portion
│       └── action=get_current_portion   Portion + verses + teaching
│
├── Biblical Recipes
│   └── recipes/
│       ├── get_recipes.php            GET: list recipes with filters
│       ├── get_recipe.php             GET: single recipe with full details
│       ├── get_filters.php            GET: available filter options
│       └── get_recipes_by_scripture.php   GET: recipes by Bible reference
│
└── User Content
    ├── bible_highlights.php     CRUD: user verse annotations
    ├── bible_preferences.php    GET/POST: user settings
    ├── save_family_tree.php     POST: persist tree data
    └── load_family_tree.php     GET: retrieve user's trees
```

 Design Principles: 

1.  RESTful Conventions : 
   - GET for reads, POST for writes
   - Resource-based URLs (`/api/recipes/get_recipe.php?slug=manna`)
   - Stateless requests (session validation per request)

2.  Consistent Response Format :
```json
{
  "success": true|false,
  "data": { /* response payload */ },
  "error": "Error message if success=false",
  "metadata": { "total": 25, "page": 1 } // optional
}
```

3.  Security Middleware Pattern :
```php
// Every API endpoint starts with:
session_start();
require_once(__DIR__ . '/../includes/auth.php');

// Validate authentication
if (!isLoggedIn()) {
    sendJSON(['success' => false, 'error' => 'Unauthorized']);
}

// Validate authorization
if (!hasPermission($userId, 'required_right')) {
    sendJSON(['success' => false, 'error' => 'Forbidden']);
}
```

4.  Error Handling :
   - Try-catch blocks around database operations
   - Graceful degradation for missing data
   - Appropriate HTTP status codes (200, 401, 403, 404, 500)
   - Detailed logging for debugging without exposing to client

5.  Input Validation :
```php
// Type validation
$recipeSlug = filter_input(INPUT_GET, 'slug', FILTER_SANITIZE_STRING);
if (!$recipeSlug || !preg_match('/^[a-z0-9-]+$/', $recipeSlug)) {
    sendJSON(['success' => false, 'error' => 'Invalid slug format']);
}

// SQL injection prevention
$stmt = $pdo->prepare("SELECT * FROM recipes WHERE recipe_slug = ?");
$stmt->execute([$recipeSlug]);
```

 Frontend Integration: 

JavaScript modules use `fetch()` with promise chains:

```javascript
// Example from recipes.js
async function loadRecipeDetail(slug) {
    try {
        showStatus('Loading recipe details...', 'success');
        
        const response = await fetch(`/bibleweb/api/recipes/get_recipe.php?slug=${slug}`);
        const result = await response.json();
        
        if (result.success) {
            currentRecipe = result.data;
            displayRecipeDetail(currentRecipe);
            openRecipeModal();
        } else {
            throw new Error(result.error || 'Failed to load recipe');
        }
    } catch (error) {
        showStatus('Error loading recipe: ' + error.message, 'error');
        console.error('Load recipe detail error:', error);
    }
}
```

 Benefits: 
-  Clear separation  of business logic (PHP) from presentation (JavaScript)
-  Reusable endpoints  (mobile app could consume same API)
-  Testable  (can test API independently of UI)
-  Maintainable  (changes to UI don't require backend changes and vice versa)

---

    Modular Frontend Structure

```
modules/
├── biblereader.php     Multi-translation Bible reader
├── interlinear.php     Hebrew/Greek word-by-word analysis
├── recipes.php         Biblical recipes database browser
├── shabbat.php         Weekly Torah portion study
├── familytree.php      Genealogy canvas builder
├── home.php            Dashboard/landing page
└── [future modules]    Maps, concordance, timelines, etc.
```

 Module Pattern: 

Each module is self-contained with:
- Independent HTML structure
- Dedicated CSS file (assets/css/[module].css)
- Standalone JavaScript (assets/js/[module].js)
- Separate API endpoints
- Minimal coupling to core system

 Routing: 
```php
// index.php
$module = isset($_GET['module']) ? $_GET['module'] : 'home';
$allowedModules = ['home', 'biblereader', 'interlinear', 'recipes', 'shabbat', 'familytree'];

if (in_array($module, $allowedModules)) {
    include("modules/{$module}.php");
} else {
    include("modules/home.php");
}
```

 Benefits: 
-  Parallel Development : Multiple developers can work on different modules simultaneously
-  Easy Testing : Test modules in isolation
-  Progressive Enhancement : Add new features without modifying existing code
-  Code Organization : Related functionality grouped together
-  Lazy Loading : Only load assets needed for current module

 Example Module Architecture (Interlinear): 

modules/interlinear.php (HTML structure):
- Includes header/footer
- Defines DOM structure
- Loads module-specific assets

assets/css/interlinear.css (Styling):
- .word-unit styles
- .transliteration styles
- Responsive breakpoints

assets/js/interlinear.js (Client-side logic):
- State management (currentTestament, currentBook, currentChapter)
- Event handlers (word clicks, navigation, settings)
- API communication (fetch chapter data)
- UI rendering (display words, update panels)

api/interlinear.php (Server-side logic):
- Validate authentication/authorization
- Query Interlinear.db based on testament/book/chapter
- Join verses with words, aggregate by verse
- Return JSON with 300+ words per chapter

This architecture enables adding new modules (e.g., Bible maps with Leaflet.js, timeline visualizations with D3.js, or concordance search) without touching existing code—just create new files in the respective folders.

---

   🔐 Security Implementation Deep Dive

Security isn't bolted on—it's architected from the ground up as a first-class concern.

    Authentication Flow

1. User submits credentials via HTTPS (Form data: username/email + password, AJAX POST to /api/login.php)

2. Server validates input (Check for empty fields, sanitize username/email, rate limit: max 5 attempts per 15 minutes per IP)

3. Database lookup (Query users table: SELECT * WHERE email = ?, use prepared statement for SQL injection prevention, fetch password_hash from database)

4. Password verification (password_verify($password, $storedHash), uses bcrypt with cost factor 12, constant-time comparison for timing attack prevention)

5. Session creation if valid (session_regenerate_id(true) to prevent fixation, $_SESSION['user_id'] = $userId, $_SESSION['username'] = $username, $_SESSION['last_activity'] = time(), store minimal data with no sensitive info in session)

6. Cookie configuration (session.cookie_httponly = true for XSS prevention, session.cookie_secure = true for HTTPS only, session.cookie_samesite = 'Strict' for CSRF prevention, session.use_strict_mode = true)

7. Response (Success: {"success": true, "redirect": "biblereader"}, Failure: {"success": false, "error": "Invalid credentials"} with generic message)

 Security Considerations: 
-  Bcrypt Cost Factor 12 : Industry standard for 2024, balances security and performance (~250ms verification time)
-  Session Regeneration : New session ID on login prevents session fixation attacks
-  Generic Error Messages : Don't reveal whether username or password was incorrect (prevents user enumeration)
-  Rate Limiting : Prevents brute force attacks (implemented with IP tracking in database)
-  Password Reset : Tokens expire after 1 hour, single-use only

    Authorization Model (RBAC)

Authorization flow: User Authentication → User with User_Roles → Roles with Role_Rights → Rights → User_Rights (optional direct assignment) → Permission Check → Resource Access Granted/Denied

 Database Schema: 
```sql
-- Roles table
CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);
-- Examples: Admin, Editor, User, Guest

-- Rights table (granular permissions)
CREATE TABLE rights (
    right_id INT PRIMARY KEY AUTO_INCREMENT,
    right_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);
-- Examples: view_bible, edit_highlights, manage_users, edit_tree, view_interlinear, admin_access

-- User-Role assignment (many-to-many)
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- Role-Right assignment (many-to-many)
CREATE TABLE role_rights (
    role_id INT NOT NULL,
    right_id INT NOT NULL,
    PRIMARY KEY (role_id, right_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (right_id) REFERENCES rights(right_id) ON DELETE CASCADE
);

-- Direct user-right assignment (overrides, optional)
CREATE TABLE user_rights (
    user_id INT NOT NULL,
    right_id INT NOT NULL,
    PRIMARY KEY (user_id, right_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (right_id) REFERENCES rights(right_id) ON DELETE CASCADE
);
```

 Permission Check Logic: 
```php
function hasPermission($userId, $requiredRight) {
    global $pdo;
    
    // Check direct user rights first (highest priority)
    $stmt = $pdo->prepare("
        SELECT 1 FROM user_rights ur
        JOIN rights r ON ur.right_id = r.right_id
        WHERE ur.user_id = ? AND r.right_name = ?
    ");
    $stmt->execute([$userId, $requiredRight]);
    if ($stmt->fetch()) {
        return true;
    }
    
    // Check role-based rights
    $stmt = $pdo->prepare("
        SELECT 1 FROM user_roles ur
        JOIN role_rights rr ON ur.role_id = rr.role_id
        JOIN rights r ON rr.right_id = r.right_id
        WHERE ur.user_id = ? AND r.right_name = ?
    ");
    $stmt->execute([$userId, $requiredRight]);
    return (bool) $stmt->fetch();
}

// Usage in API endpoints:
if (!hasPermission($userId, 'edit_highlights')) {
    sendJSON(['success' => false, 'error' => 'Insufficient permissions']);
    exit;
}
```

 Example Role Configurations: 

| Role | Rights | Use Case |
|------|--------|----------|
|  Admin  | All rights (manage_users, admin_access, etc.) | System administrators |
|  Editor  | view_bible, edit_highlights, view_interlinear, edit_tree, view_recipes | Power users, teachers |
|  User  | view_bible, edit_highlights, edit_tree (own only) | Standard registered users |
|  Guest  | view_bible (read-only) | Unregistered visitors |

    Data Protection

 SQL Injection Prevention: 

✅  100% Prepared Statements Throughout Codebase: 

```php
// ❌ NEVER DO THIS (vulnerable to SQL injection)
$query = "SELECT * FROM verses WHERE book = '$book' AND chapter = $chapter";
$result = $pdo->query($query);

// ✅ ALWAYS DO THIS (safe)
$stmt = $pdo->prepare("SELECT * FROM verses WHERE book = ? AND chapter = ?");
$stmt->execute([$book, $chapter]);
$result = $stmt->fetchAll();

// ✅ Named parameters (also safe, more readable for complex queries)
$stmt = $pdo->prepare("
    SELECT v.*, h.color, h.note 
    FROM verses v
    LEFT JOIN user_highlights h ON v.verse_id = h.verse_id AND h.user_id = :userId
    WHERE v.book_id = :bookId AND v.chapter = :chapter
");
$stmt->execute([
    ':userId' => $userId,
    ':bookId' => $bookId,
    ':chapter' => $chapter
]);
```

 XSS Protection: 

```php
// Output encoding for user-generated content
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// In JSON responses
function sendJSON($data) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    exit;
}

// JavaScript string escaping
$jsString = json_encode($userInput, JSON_HEX_TAG | JSON_HEX_AMP);
```

 Data Isolation: 

Every user data query includes user_id scoping:

```php
// User highlights - only fetch user's own data
$stmt = $pdo->prepare("
    SELECT * FROM user_highlights 
    WHERE user_id = ? AND verse_id = ?
");
$stmt->execute([$_SESSION['user_id'], $verseId]);

// Family trees - prevent unauthorized access
$stmt = $pdo->prepare("
    SELECT * FROM user_family_trees 
    WHERE tree_id = ? AND user_id = ?
");
$stmt->execute([$treeId, $_SESSION['user_id']]);
```

 Session Security: 

```php
// Session timeout (30 minutes of inactivity)
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
    session_unset();
    session_destroy();
    header('Location: /login');
    exit;
}
$_SESSION['last_activity'] = time();

// Regenerate session ID periodically
if (!isset($_SESSION['created'])) {
    $_SESSION['created'] = time();
} else if (time() - $_SESSION['created'] > 3600) {
    session_regenerate_id(true);
    $_SESSION['created'] = time();
}
```

 Real-World Security Standards: 

This implementation follows:
-  OWASP Top 10  mitigation strategies
-  NIST password guidelines  (bcrypt, no complexity requirements)
-  CWE/SANS Top 25  vulnerability prevention
-  PCI DSS  principles (data protection at rest and in transit)

---

   📚 What I Learned

    Technical Skills Developed

 Database Design & Optimization: 
-  Schema Design : Learned when to normalize vs. denormalize, balancing query performance with data integrity
-  Indexing Strategy : Measured impact of indexes on query performance (B-tree for lookups, full-text for search)
-  Database Selection : Understood trade-offs between MySQL and SQLite for different use cases
-  Query Optimization : Used EXPLAIN to identify slow queries, rewrote N+1 queries into JOINs
-  Data Migration : Built custom import scripts to parse 300,000+ words from TSV files into normalized schema

 API Design & Implementation: 
-  RESTful Principles : Learned resource-based URLs, proper HTTP methods, idempotent operations
-  Response Consistency : Designed standard JSON format used across all 20+ endpoints
-  Error Handling : Implemented graceful degradation, meaningful error messages, appropriate status codes
-  Versioning Considerations : Structured API to allow future v2 without breaking existing clients

 Security Mindset: 
-  Authentication : Implemented secure password hashing, session management, cookie security
-  Authorization : Designed RBAC system from scratch, learned about privilege escalation risks
-  Input Validation : Always validate, sanitize, and parameterize—never trust client input
-  Output Encoding : Prevent XSS through proper escaping at render time
-  Threat Modeling : Thought like an attacker—"How would I break this?"

 Frontend Development: 
-  Vanilla JavaScript : Built complex interactive features without framework dependencies
-  State Management : Learned to manage application state across multiple modules
-  Async Programming : Mastered promises, async/await, error handling in asynchronous flows
-  Responsive Design : Mobile-first approach, tested on devices from 320px to 4K displays
-  Performance : Optimized DOM manipulation, debounced search inputs, lazy loaded content

    Problem-Solving Examples

 Challenge 1: Interlinear Search Performance 

*Problem*: Initial implementation scanned all 300,000 words linearly—searches took 3-5 seconds.

*Investigation*: Used EXPLAIN QUERY PLAN to identify missing indexes, profiled query execution time.

*Solution*: 
1. Added composite indexes on (book_id, chapter, verse)
2. Created full-text search index on original_text and gloss columns
3. Paginated results (load 1 chapter at a time, not entire book)
4. Result: Sub-200ms searches

*Learning*: Always measure before optimizing, indexes have cost (write speed) but huge benefit (read speed).

---

 Challenge 2: RBAC Permission Complexity 

*Problem*: Started with simple user/admin roles, but requirements grew—needed editors who can't manage users, guests with limited access, etc.

*Evolution*:
1.  v1 : Two roles hardcoded in logic (`if ($role === 'admin')`)
2.  v2 : Added `roles` table but still hardcoded permission checks
3.  v3 : Created `rights` table, realized need for many-to-many relationships
4.  v4 : Final design with `role_rights` and `user_rights` for flexibility

*Learning*: Abstraction is hard to get right initially—it's okay to refactor as requirements become clearer.

---

 Challenge 3: STEPBible Data Import 

*Problem*: 6 TSV files with 300,000+ lines, inconsistent formatting, needed to parse into normalized database.

*Solution*:
1. Wrote custom PHP parser with line-by-line validation
2. Implemented error recovery (skip bad lines, continue processing)
3. Used SQLite transactions for speed (30x faster than individual inserts)
4. Built verification suite to check data integrity after import

*Learning*: Data import is never straightforward—expect messy data, build robust error handling, validate output.

---

    Process & Best Practices

 Iterative Development: 
- Started with single Bible translation (KJV), refactored for multi-translation support
- Built basic reader first, then added highlights, then cross-references—each working before moving on
- Lesson: Get something working end-to-end, then add features incrementally

 Code Organization: 
- Early mistake: Mixing business logic with presentation (echo in the middle of processing)
- Refactored into clear layers: API (logic) → JavaScript (orchestration) → HTML (presentation)
- Lesson: Separation of concerns saves time debugging and enables easier testing

 Documentation: 
- Inline comments explain *why*, not *what* (code shows what)
- API endpoints have header comments with request/response examples
- Lesson: Documentation written today saves hours debugging next week

 Security-First Mindset: 
- Adopted principle: "Don't trust anything from the client"
- Every input validated, every output encoded, every query parameterized
- Lesson: Security bugs are exponentially harder to fix later—bake it in from the start

---

   🛠️ Setup Instructions

    Prerequisites
-  PHP 7.4+  with PDO, SQLite, and MySQL/MySQLi extensions
-  MySQL 5.7+  or  MariaDB 10.3+ 
-  Web Server : Apache 2.4+ with mod_rewrite, Nginx, or PHP built-in server
-  Modern Browser : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (ES6+ support required)

    Installation

     1. Clone Repository
```bash
git clone https://github.com/yourusername/bible-web-app.git
cd bible-web-app
```

     2. Configure Database Connection
```bash
cp config/db_config.example.php config/db_config.php
nano config/db_config.php
```

Update with your MySQL credentials:
```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'bible_web');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_CHARSET', 'utf8mb4');

// SQLite paths (usually no changes needed)
define('BIBLE_DB_PATH', __DIR__ . '/../sqlite/');
define('INTERLINEAR_DB', BIBLE_DB_PATH . 'Interlinear.db');
define('RECIPES_DB', BIBLE_DB_PATH . 'recipes.db');
?>
```

     3. Create MySQL Database & Import Schema
```bash
mysql -u root -p
```
```sql
CREATE DATABASE bible_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```
```bash
mysql -u root -p bible_web < schema/bible_web_schema.sql
```

     4. Verify SQLite Databases
Ensure these files exist with proper permissions:
```bash
ls -lh sqlite/
  Should see: ESV.db, KJV.db, Interlinear.db, recipes.db, etc.

chmod 644 sqlite/*.db
chmod 755 sqlite/
```

     5. Set File Permissions
```bash
  For Apache/Nginx (www-data user)
chown -R www-data:www-data .
chmod -R 755 .

  For development (your user)
chmod 755 api/ modules/ assets/
chmod 644 api/*.php modules/*.php
```

     6. Start Server
```bash
  PHP Built-in Server (Development)
php -S localhost:8000

  Access at: http://localhost:8000
```

     7. Create viewer admin example User
```sql
-- Password: "viewer" (bcrypt hashed with cost 12)
INSERT INTO users (username, email, password_hash, created_at) 
VALUES ('viewer', 'viewer@example.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ByJK9pU7Kvem', NOW());

-- Assign Admin role
INSERT INTO user_roles (user_id, role_id) 
VALUES (LAST_INSERT_ID(), 1);
```

    Demo Credentials

| Role   | Email              | Password | Permissions                    |
|--------|--------------------|----------|--------------------------------|
| viewer | viewer@example.com | viewer   | Full access, user management   |


---

   📁 Project Structure

```
bible-web-app/
│
├── api/                                Backend API endpoints (20+)
│   ├── login.php, logout.php, getuserpermissions.php
│   ├── biblereader.php, bible_search.php, bible_crossrefs.php
│   ├── interlinear.php                 Hebrew/Greek word data
│   ├── shabbat_portion.php             Torah portion content
│   ├── save_family_tree.php, load_family_tree.php
│   └── recipes/
│       ├── get_recipes.php, get_recipe.php
│       ├── get_filters.php, get_recipes_by_scripture.php
│
├── assets/
│   ├── css/                            Module-specific stylesheets
│   │   ├── styles.css                  Global styles
│   │   ├── biblereader.css, interlinear.css
│   │   ├── recipes.css, shabbat.css, familytree.css
│   │
│   ├── js/                             Frontend JavaScript (ES6+)
│   │   ├── scripts.js                  Global utilities
│   │   ├── biblereader.js, bible-search.js, bible-highlights.js
│   │   ├── interlinear.js              Word interactions, display modes
│   │   ├── recipes.js                  Recipe filtering, modal
│   │   ├── shabbat.js                  Geolocation, Hebcal API
│   │   └── familytree.js               Canvas drawing
│   │
│   └── images/screenshots/             Documentation images
│
├── config/
│   ├── db_config.php                   Database credentials
│   └── db_config.example.php
│
├── includes/                           Shared PHP components
│   ├── auth.php                        isLoggedIn(), hasPermission()
│   ├── db.php                          Database connections
│   ├── header.php, footer.php
│
├── modules/                            Feature modules (pages)
│   ├── home.php                        Dashboard
│   ├── biblereader.php                 Multi-translation reader
│   ├── interlinear.php                 Word-by-word analysis
│   ├── recipes.php                     Biblical recipes browser
│   ├── shabbat.php                     Torah portion study
│   └── familytree.php                  Genealogy builder
│
├── sqlite/                             Read-heavy data (150+ files)
│   ├── ESV.db, KJV.db, ...             Bible translations
│   ├── Interlinear.db                  300K+ Hebrew/Greek words
│   ├── recipes.db                      30+ biblical recipes
│   └── STEPBible-Data-master/          Source data for import
│
├── schema/
│   ├── bible_web_schema.sql            MySQL schema
│   ├── interlinear_schema.sql, recipes_schema.sql
│
├── scripts/
│   ├── import_interlinear.php          Data processing script
│   └── create_admin_user.php
│
├── index.php                           Entry point, routing
└── README.md                           This file
```

---

   🚧 Future Development

    Planned Features

 📍 Interactive Bible Maps 
- Leaflet.js maps with 200+ biblical locations
- Journey tracking (Paul's travels, Exodus route)
- Timeline slider across biblical eras

 📖 Enhanced Concordance 
- Full Strong's Dictionary (8,000+ entries)
- Word frequency analysis
- Semantic relationships

 🎓 Ancient Language Lessons 
- Hebrew/Greek alphabet with audio
- 100 most common words per language
- Basic grammar tied to scripture

 📅 Reading Plans & Progress Tracking 
- Pre-built plans (1-year, 90-day)
- Custom schedules
- Progress visualization, streak tracking

 👥 Collaborative Study Groups 
- Share highlights/notes with groups
- Discussion threads on verses
- Group admin/moderator roles

---

   🎓 Why This Project Demonstrates Full-Stack Expertise

✅  Full-Stack Proficiency : Backend (PHP, MySQL, SQLite) + Frontend (JavaScript, CSS, HTML5)  
✅  Security Expertise : Authentication, RBAC authorization, OWASP Top 10 mitigation  
✅  Database Mastery : Schema design, query optimization, hybrid database strategy  
✅  API Development : RESTful design, 20+ endpoints, consistent patterns  
✅  Data Engineering : Custom ETL pipeline processing 300K+ records  
✅  System Architecture : Modular design, separation of concerns, scalability  
✅  Real-World Complexity : Multi-translation Bible, linguistic analysis, user management  
✅  Problem-Solving : Performance optimization, data validation, error handling  
✅  Code Quality : Organized structure, security-first, maintainable patterns

This project isn't a tutorial follow-along—it's built from scratch to solve real problems with production-quality code.

---

   📜 License & Attribution

    Code License
 MIT License  - Use freely as a learning resource or template.

    Bible Translations
Each translation retains its original copyright:
-  Public Domain : KJV, ASV, WEB, Darby, YLT, Webster, and other older translations
- Consult individual licenses before commercial use

    Third-Party Data

 STEPBible  (Interlinear):
- License: CC BY 4.0
- Citation: "Scripture from STEPBible - www.STEPBible.org"

 Hebcal API  (Shabbat times):
- License: Free non-commercial use
- Citation: "Shabbat times via Hebcal.com"

---

// In JSON responses
function sendJSON($data) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    exit;
}

// JavaScript string escaping
$jsString = json_encode($userInput, JSON_HEX_TAG | JSON_HEX_AMP);
```

 Data Isolation: 

Every user data query includes user_id scoping:

```php
// User highlights - only fetch user's own data
$stmt = $pdo->prepare("
    SELECT * FROM user_highlights 
    WHERE user_id = ? AND verse_id = ?
");
$stmt->execute([$_SESSION['user_id'], $verseId]);

// Family trees - prevent unauthorized access
$stmt = $pdo->prepare("
    SELECT * FROM user_family_trees 
    WHERE tree_id = ? AND user_id = ?
");
$stmt->execute([$treeId, $_SESSION['user_id']]);

// Even in JOINs, always scope by user
$stmt = $pdo->prepare("
    SELECT v.*, h.color, h.note 
    FROM verses v
    LEFT JOIN user_highlights h ON v.verse_id = h.verse_id 
    WHERE h.user_id = ? OR h.user_id IS NULL
");
```

 Session Security: 

```php
// Session timeout (30 minutes of inactivity)
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
    session_unset();
    session_destroy();
    header('Location: /login');
    exit;
}
$_SESSION['last_activity'] = time();

// Regenerate session ID periodically
if (!isset($_SESSION['created'])) {
    $_SESSION['created'] = time();
} else if (time() - $_SESSION['created'] > 3600) {
    session_regenerate_id(true);
    $_SESSION['created'] = time();
}
```

 Real-World Security Standards: 

This implementation follows:
-  OWASP Top 10  mitigation strategies
-  NIST password guidelines  (bcrypt, no complexity requirements, breach detection via HaveIBeenPwned API integration planned)
-  CWE/SANS Top 25  vulnerability prevention
-  PCI DSS  principles (though not processing payments)

 Why This Matters:  Security isn't a checklist—it's a mindset. This project demonstrates that I understand threat modeling, defense in depth, and secure coding practices from day one of development.

---

   📚 What I Learned

    Technical Skills

 Database Design & Optimization: 
-  Schema Design : Learned when to normalize vs. denormalize, balancing query performance with data integrity
-  Indexing Strategy : Measured impact of indexes on query performance (B-tree for lookups, full-text for search)
-  Database Selection : Understood trade-offs between MySQL and SQLite for different use cases
-  Query Optimization : Used EXPLAIN to identify slow queries, rewrote N+1 queries into JOINs
-  Data Migration : Built custom import scripts to parse 300,000+ words from TSV files into normalized schema

 API Design & Implementation: 
-  RESTful Principles : Learned resource-based URLs, proper HTTP methods, idempotent operations
-  Response Consistency : Designed standard JSON format used across all 20+ endpoints
-  Error Handling : Implemented graceful degradation, meaningful error messages, appropriate status codes
-  Versioning Considerations : Structured API to allow future v2 without breaking existing clients
-  Documentation : Wrote inline comments explaining business logic for each endpoint

 Security Mindset: 
-  Authentication : Implemented secure password hashing, session management, cookie security
-  Authorization : Designed RBAC system from scratch, learned about privilege escalation risks
-  Input Validation : Always validate, sanitize, and parameterize—never trust client input
-  Output Encoding : Prevent XSS through proper escaping at render time
-  Threat Modeling : Thought like an attacker—"How would I break this?"

 Frontend Development: 
-  Vanilla JavaScript : Built complex interactive features without framework dependencies
-  State Management : Learned to manage application state across multiple modules
-  Async Programming : Mastered promises, async/await, error handling in asynchronous flows
-  Responsive Design : Mobile-first approach, tested on devices from 320px to 4K displays
-  Performance : Optimized DOM manipulation, debounced search inputs, lazy loaded images

    Problem-Solving

 Challenge: Interlinear Search Performance 

*Problem*: Initial implementation scanned all 300,000 words linearly—searches took 3-5 seconds.

*Investigation*: Used EXPLAIN QUERY PLAN to identify missing indexes, profiled query execution time.

*Solution*: 
1. Added composite indexes on (book_id, chapter, verse)
2. Created full-text search index on original_text and gloss columns
3. Paginated results (load 1 chapter at a time, not entire book)
4. Result: Sub-200ms searches

*Learning*: Always measure before optimizing, indexes have cost (write speed) but huge benefit (read speed).

---

 Challenge: RBAC Permission Complexity 

*Problem*: Started with simple user/admin roles, but requirements grew—needed editors who can't manage users, guests with limited access, etc.

*Evolution*:
1.  v1 : Two roles hardcoded in logic (`if ($role === 'admin')`)
2.  v2 : Added `roles` table but still hardcoded permission checks
3.  v3 : Created `rights` table, realized need for many-to-many relationships
4.  v4 : Final design with `role_rights` and `user_rights` for flexibility

*Learning*: Abstraction is hard to get right initially—it's okay to refactor as requirements become clearer. Premature optimization is real, but so is technical debt from shortcuts.

---

 Challenge: STEPBible Data Import 

*Problem*: 6 TSV files with 300,000+ lines, inconsistent formatting, needed to parse into normalized database.

*Solution*:
1. Wrote custom PHP parser with line-by-line validation
2. Implemented error recovery (skip bad lines, continue processing)
3. Used SQLite transactions for speed (30x faster than individual inserts)
4. Built verification suite to check data integrity after import

*Learning*: Data import is never straightforward—expect messy data, build robust error handling, validate output.

---

    Process & Best Practices

 Iterative Development: 
- Started with single Bible translation (KJV), refactored for multi-translation support
- Built basic reader first, then added highlights, then cross-references—each working before moving on
- Lesson: Get something working end-to-end, then add features incrementally

 Code Organization: 
- Early mistake: Mixing business logic with presentation (echo in the middle of processing)
- Refactored into clear layers: API (logic) → JavaScript (orchestration) → HTML (presentation)
- Lesson: Separation of concerns saves time debugging and enables easier testing

 Documentation: 
- Inline comments explain *why*, not *what* (code shows what)
- API endpoints have header comments with request/response examples
- Lesson: Documentation written today saves hours debugging next week

 Version Control: 
- Learned to make atomic commits (one logical change per commit)
- Used branches for features (interlinear-feature, recipes-module)
- Lesson: Git isn't backup, it's time travel—commit messages matter

 Security-First Mindset: 
- Adopted principle: "Don't trust anything from the client"
- Every input validated, every output encoded, every query parameterized
- Lesson: Security bugs are exponentially harder to fix later—bake it in from the start

---

   🖥️ Screenshots

    Bible Reader with Parallel Translations
![Bible Reader](assets/images/screenshots/bible-reader.png)
*Side-by-side ESV and KJV with user highlights (8 colors) and cross-references*

    Interlinear Bible - Word-by-Word Analysis
![Interlinear](assets/images/screenshots/interlinear.png)
*John 1:1 in Greek with transliteration, Strong's numbers, morphology, and gloss*

    Shabbat Torah Portion Study
![Shabbat](assets/images/screenshots/shabbat.png)
*Current week's Torah portion with Haftarah and New Testament connections*

    Biblical Recipes Database
![Recipes](assets/images/screenshots/recipes-grid.png)
*Recipe cards with textual certainty badges and historical period tags*

    Recipe Detail View
![Recipe Detail](assets/images/screenshots/recipe-detail.png)
*Ezekiel Bread with scripture references, historical context, and cooking instructions*

    Family Tree Builder
![Family Tree](assets/images/screenshots/family-tree.png)
*Interactive canvas with drag-and-drop, color-coded relationships*

    Search Results Across Translations
![Search](assets/images/screenshots/search-results.png)
*Full-text search showing "faith" in ESV, KJV, and NASB with context snippets*

---

   🛠️ Setup Instructions

    Prerequisites
-  PHP 7.4+  with PDO, SQLite, and MySQL/MySQLi extensions
-  MySQL 5.7+  or  MariaDB 10.3+ 
-  Web Server : Apache 2.4+ with mod_rewrite, Nginx, or PHP built-in server
-  Modern Browser : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (ES6+ support required)

    Installation

     1. Clone Repository
```bash
git clone https://github.com/yourusername/bible-web-app.git
cd bible-web-app
```

     2. Configure Database Connection
```bash
cp config/db_config.example.php config/db_config.php
nano config/db_config.php
```

Update with your MySQL credentials:
```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'bible_web');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_CHARSET', 'utf8mb4');

// SQLite paths (usually no changes needed)
define('BIBLE_DB_PATH', __DIR__ . '/../sqlite/');
define('INTERLINEAR_DB', BIBLE_DB_PATH . 'Interlinear.db');
define('RECIPES_DB', BIBLE_DB_PATH . 'recipes.db');
?>
```

     3. Create MySQL Database & Import Schema
```bash
mysql -u root -p
```
```sql
CREATE DATABASE bible_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```
```bash
mysql -u root -p bible_web < schema/bible_web_schema.sql
```

     4. Verify SQLite Databases
Ensure these files exist with proper permissions:
```bash
ls -lh sqlite/
  Should see: ESV.db, KJV.db, Interlinear.db, recipes.db, etc.

chmod 644 sqlite/*.db
chmod 755 sqlite/
```

     5. Set File Permissions
```bash
  For Apache/Nginx (www-data user)
chown -R www-data:www-data .
chmod -R 755 .
chmod -R 644 *.php

  For development (your user)
chmod 755 api/ modules/ assets/
chmod 644 api/*.php modules/*.php
```

     6. Configure Web Server

 Option A: PHP Built-in Server (Development Only) 
```bash
php -S localhost:8000
```

 Option B: Apache (.htaccess already included) 
```apache
  Ensure mod_rewrite is enabled
sudo a2enmod rewrite
sudo systemctl restart apache2

  Point DocumentRoot to project directory
  Edit /etc/apache2/sites-available/000-default.conf
DocumentRoot /var/www/html/bible-web-app
<Directory /var/www/html/bible-web-app>
    AllowOverride All
    Require all granted
</Directory>
```

 Option C: Nginx 
```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/bible-web-app;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

     7. Access Application
```
http://localhost:8000            Built-in server
http://localhost/bibleweb        Apache/Nginx
```

     8. Create First User (Database Insert)
```sql
-- Password: "viewer" (bcrypt hashed)
INSERT INTO users (username, email, password_hash, created_at) 
VALUES ('viewer', 'viewer@example.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ByJK9pU7Kvem', NOW());

-- Get the user_id from above insert
SET @user_id = LAST_INSERT_ID();

-- Assign Admin role (assuming role_id 1 is Admin)
INSERT INTO user_roles (user_id, role_id) VALUES (@user_id, 1);
```

Or use the provided setup script:
```bash
php scripts/create_admin_user.php
  Follow prompts to create admin account
```

---

    Demo Credentials

For testing purposes, use these pre-configured accounts:

| Role     | Email                | Password  | Permissions                              |
|----------|----------------------|-----------|------------------------------------------|
| viewer   | viewer@example.com   | viewer    | Full access, user management             |


 ⚠️ IMPORTANT:  Change these credentials before any public deployment!

---

    Troubleshooting

 Database Connection Errors: 
```bash
  Verify MySQL is running
sudo systemctl status mysql
  or
sudo service mysql status

  Test connection
mysql -u your_username -p bible_web -e "SELECT 1;"

  Check credentials in config/db_config.php match database
```

 SQLite File Not Found: 
```bash
  Verify files exist
ls -la sqlite/*.db

  Check permissions (must be readable by web server)
chmod 644 sqlite/*.db
chmod 755 sqlite/

  For Apache
sudo chown www-data:www-data sqlite/*.db
```

 API Returns 404: 
```bash
  Apache: Ensure mod_rewrite is enabled
sudo a2enmod rewrite
sudo systemctl restart apache2

  Check .htaccess exists in project root
cat .htaccess

  Nginx: Verify rewrite rules in config (see step 6)
```

 Blank Page / White Screen: 
```bash
  Enable error reporting temporarily
  In index.php, add at top:
error_reporting(E_ALL);
ini_set('display_errors', 1);

  Check PHP error log
tail -f /var/log/apache2/error.log
  or
tail -f /var/log/nginx/error.log
```

 Session Not Persisting: 
```bash
  Verify session directory is writable
ls -ld /var/lib/php/sessions
sudo chmod 1733 /var/lib/php/sessions

  Check session.save_path in php.ini
php -i | grep session.save_path
```

 Interlinear Feature Not Loading: 
```bash
  Verify Interlinear.db exists and has data
sqlite3 sqlite/Interlinear.db "SELECT COUNT(*) FROM words;"
  Should return ~300,000

  Check API endpoint directly
curl http://localhost:8000/api/interlinear.php?action=get_books&testament=NT
  Should return JSON with book list
```

---

   📁 Project Structure

```
bible-web-app/
│
├── api/                                Backend API endpoints
│   ├── biblereader.php                 Verse retrieval, translation switching
│   ├── bible_search.php                Full-text search across translations
│   ├── bible_highlights.php            User annotations CRUD (colors, notes)
│   ├── bible_preferences.php           User settings (font size, theme, default translation)
│   ├── bible_crossrefs.php             Cross-reference data retrieval
│   ├── interlinear.php                 Hebrew/Greek word-by-word data
│   ├── shabbat_portion.php             Weekly Torah portion content
│   ├── login.php                       Authentication (session creation)
│   ├── logout.php                      Session cleanup
│   ├── getuserpermissions.php          Authorization checks (RBAC)
│   ├── save_family_tree.php            Tree persistence
│   ├── load_family_tree.php            Tree retrieval
│   └── recipes/                        Biblical recipes API
│       ├── get_recipes.php             List with filtering
│       ├── get_recipe.php              Single recipe detail
│       ├── get_filters.php             Available filter options
│       └── get_recipes_by_scripture.php    Find recipes by verse
│
├── assets/
│   ├── css/                            Stylesheets
│   │   ├── styles.css                  Global styles, variables, resets
│   │   ├── biblereader.css             Bible reader interface
│   │   ├── biblereader-extended.css    Advanced reader features
│   │   ├── interlinear.css             Word-by-word layout, Hebrew/Greek fonts
│   │   ├── recipes.css                 Recipe cards, modal, filters
│   │   ├── shabbat.css                 Torah portion styling
│   │   ├── familytree.css              Canvas, relationship lines
│   │   └── home.css                    Dashboard/landing page
│   │
│   ├── js/                             Frontend JavaScript (ES6+ modules)
│   │   ├── scripts.js                  Global utilities, navigation, auth helpers
│   │   ├── login.js                    Login form handling, validation
│   │   ├── biblereader.js              Reader UI logic, translation switching
│   │   ├── bible-search.js             Search interface, results rendering
│   │   ├── bible-highlights.js         Annotation system, color picker
│   │   ├── bible-preferences.js        Settings panel, preference saving
│   │   ├── interlinear.js              Word interactions, display modes, navigation
│   │   ├── recipes.js                  Recipe filtering, modal, search
│   │   ├── shabbat.js                  Geolocation, Hebcal API, portion display
│   │   └── familytree.js               Canvas drawing, drag-and-drop, relationships
│   │
│   └── images/                         Icons, logos, screenshots
│       ├── logos/                      App branding
│       └── screenshots/                For README and documentation
│
├── config/
│   ├── db_config.php                   Database credentials (MySQL + SQLite paths)
│   └── db_config.example.php           Template for configuration
│
├── includes/                           Shared PHP components
│   ├── auth.php                        Authentication helpers (isLoggedIn, hasPermission)
│   ├── db.php                          Database connection factory (MySQL + SQLite)
│   ├── header.php                      Common HTML head, navigation
│   ├── footer.php                      Common footer, scripts
│   └── login.php                       Login form HTML
│
├── modules/                            Feature modules (self-contained pages)
│   ├── home.php                        Dashboard with feature overview
│   ├── biblereader.php                 Multi-translation Bible reader
│   ├── interlinear.php                 Hebrew/Greek word-by-word analysis
│   ├── recipes.php                     Biblical recipes browser
│   ├── shabbat.php                     Weekly Torah portion study
│   ├── familytree.php                  Genealogy canvas builder
│   ├── bibleversions.php               Translation management
│   ├── language.php                    Language settings (future i18n)
│   └── maps.php                        Biblical geography (planned)
│
├── sqlite/                             SQLite databases (read-heavy data)
│   ├── ESV.db, KJV.db, NASB.db, ...    150+ Bible translations
│   ├── Interlinear.db                  Hebrew/Greek words with morphology
│   ├── recipes.db                      Biblical recipes and ingredients
│   ├── extras/
│   │   └── cross_references_*.db       Verse cross-reference data (7 files)
│   │
│   └── STEPBible-Data-master/          Source data for interlinear import
│       ├── Translators Amalgamated OT+NT/
│       │   ├── TAHOT Gen-Deu ... .txt      Hebrew OT data (4 files)
│       │   └── TAGNT Mat-Jhn ... .txt      Greek NT data (2 files)
│       ├── Lexicons/                       Hebrew/Greek dictionaries
│       └── Tagged-Bibles/                  Translation tagging data
│
├── schema/
│   ├── bible_web_schema.sql            MySQL schema export (users, highlights, etc.)
│   ├── interlinear_schema.sql          SQLite schema for Interlinear.db
│   └── recipes_schema.sql              SQLite schema for recipes.db
│
├── scripts/                            Utility scripts
│   ├── import_interlinear.php          STEPBible data import (runs once)
│   ├── import_recipes.php              Populate recipes database
│   ├── create_admin_user.php           CLI tool to create admin account
│   └── backup_database.sh              Backup script (MySQL + SQLite)
│
├── .htaccess                           Apache rewrite rules, security headers
├── index.php                           Application entry point, routing
├── api.php                             API router (optional, currently using direct files)
├── robots.txt                          Search engine directives
├── .gitignore                          Exclude config, vendor, uploads
└── README.md                           This file
```

 Key Design Decisions: 

1.  Flat API Structure : No deep nesting—keeps URLs simple and discoverable
2.  Module Isolation : Each feature has dedicated PHP/CSS/JS files—easy to find related code
3.  SQLite Separation : Bible data in separate .db files—add new translation by dropping in file
4.  Schema in VCS : SQL files version controlled—easy to recreate database structure
5.  Assets Organization : CSS/JS grouped by feature, not by type—colocation improves maintainability

---

   🚧 Future Development

The modular architecture enables ongoing feature expansion without core refactoring:

    In Progress
-  FTS5 Search Indexing : Migrating to SQLite Full-Text Search for sub-100ms multi-translation queries
-  Mobile App : React Native app consuming same API endpoints
-  API Documentation : Auto-generated docs with Swagger/OpenAPI

    Planned Features

 📍 Interactive Bible Maps 
-  Technology : Leaflet.js for maps, GeoJSON for biblical locations
-  Features :
  - 200+ biblical locations with coordinates
  - Journey tracking (Paul's missionary journeys, Exodus route, Jesus' ministry)
  - Timeline slider (see map change across biblical eras)
  - Click location → see relevant verses
-  Database : `locations` table (name, lat/lon, modern_name, first_mention, description)

 📖 Enhanced Concordance 
-  Strong's Dictionary : Full definitions for all 8,000+ Hebrew/Greek words
-  Word Studies : See every occurrence of a word across Scripture
-  Frequency Analysis : Most common words, unique words per book
-  Semantic Relationships : Synonyms, antonyms, related concepts

 🎓 Ancient Language Lessons 
-  Hebrew Alphabet : 22 letters with pronunciation guide (audio)
-  Greek Alphabet : 24 letters with pronunciation
-  Common Words : 100 most frequent words in each language
-  Grammar Basics : Nouns, verbs, sentence structure
-  Scripture Examples : Learn by reading actual verses

 📅 Reading Plans & Progress Tracking 
-  Pre-built Plans : Read through Bible in 1 year, 90 days, etc.
-  Custom Plans : Create your own schedule
-  Progress Dashboard : Visualize completion, daily streaks
-  Reminders : Email/push notifications for daily reading

 🔗 Verse Linking & Notes 
-  Personal Study Notes : Markdown editor for each verse
-  Tag System : Organize verses by themes (faith, prayer, prophecy)
-  Connections : Link related verses together
-  Export : PDF, Markdown, or Word document of your notes

 👥 Collaborative Features 
-  Study Groups : Share highlights and notes with group members
-  Discussion Threads : Comment on verses collaboratively
-  Permissions : Group admin, moderator, member roles
-  Activity Feed : See what group members are reading/noting

 📊 Analytics & Insights 
-  Reading Statistics : Most-read books, chapters, favorite verses
-  Highlight Heatmap : Visualize most-highlighted passages
-  Time Tracking : Daily/weekly/monthly reading time
-  Personal Insights : AI-generated themes from your highlights

 🌐 Internationalization (i18n) 
-  Multi-Language UI : Translate interface to Spanish, French, Portuguese, Korean, Chinese
-  RTL Support : Proper layout for Arabic, Hebrew UI
-  Bible Translations : Add non-English Bibles (already have 20+ in sqlite/)
-  Locale-Aware : Date formats, number formats, collation

    Technical Improvements

 Performance Optimization: 
- Implement Redis caching for frequently accessed verses
- CDN for static assets (CSS, JS, images)
- Service worker for offline Bible reading
- Lazy loading for images and non-critical JavaScript

 Testing: 
- PHPUnit tests for API endpoints (>80% coverage goal)
- Jest tests for JavaScript modules
- Selenium/Cypress for end-to-end UI testing
- CI/CD pipeline with GitHub Actions

 DevOps: 
- Docker containerization for easy deployment
- Kubernetes manifests for scalability
- Automated backups to S3/cloud storage
- Monitoring with Prometheus + Grafana

---

   🎓 Why This Project

This application demonstrates capabilities essential for full-stack roles:

✅  Full-Stack Proficiency : Comfortable with backend (PHP, MySQL, SQLite) and frontend (JavaScript, CSS, HTML5)  
✅  Security Awareness : Authentication, authorization, input validation, and secure coding practices throughout  
✅  Database Design : Schema normalization, indexing, query optimization, choosing appropriate DB technologies  
✅  API Development : RESTful design, JSON responses, error handling, middleware patterns  
✅  Data Processing : Custom ETL pipelines (STEPBible import of 300K+ words)  
✅  Architecture Thinking : Modularity, separation of concerns, scalability considerations  
✅  Real-World Complexity : Not a toy app—handles multiple data sources, user management, and feature extensibility  
✅  Problem-Solving : Performance optimization, refactoring legacy code, iterative improvements  
✅  Code Quality : Organized structure, inline documentation, maintainable patterns  
✅  UX Design : Responsive layouts, intuitive interfaces, accessibility considerations

    Technical Depth

 Backend Expertise: 
- Built 20+ API endpoints with consistent design
- Implemented RBAC from scratch (not using a framework)
- Wrote custom data import scripts for complex datasets
- Optimized database queries (measured with EXPLAIN)
- Handled edge cases (empty results, malformed input, race conditions)

 Frontend Capabilities: 
- No framework dependency—demonstrates strong JavaScript fundamentals
- Complex state management across modules
- Async programming with promises, async/await
- DOM manipulation optimization (minimize reflows)
- Cross-browser compatibility (IE11 not supported, but Chrome/Firefox/Safari/Edge tested)

 System Design: 
- Chose appropriate database for each use case (MySQL vs SQLite)
- Designed schema for extensibility (add new features without breaking changes)
- Separated concerns (API, business logic, presentation)
- Thought through scalability (what happens at 10K users? 100K?)

This project reflects how I approach building production-ready, secure, and maintainable web applications from the ground up.

---

   📜 License & Attribution

    Code License
 MIT License  - Feel free to use this codebase as a learning resource or template for your own projects.

    Bible Translations
Each translation retains its original copyright and licensing terms:
-  Public Domain : KJV, ASV, WEB, and other older translations
-  Open Licenses : ESV (Crossway), NASB (Lockman Foundation) - subject to usage restrictions
-  Proprietary : NIV, NLT, MSG - not included in public repository

This application does not claim ownership of biblical texts. Consult individual translation licenses before commercial use.

    Third-Party Data

 STEPBible Data  (Interlinear feature):
-  Source : Tyndale House STEPBible Project
-  License : Creative Commons Attribution 4.0 (CC BY 4.0)
-  Citation : "Scripture quoted from STEPBible - www.STEPBible.org. CC BY"
-  Files : TAHOT (Hebrew OT), TAGNT (Greek NT)

 Hebcal API  (Shabbat times):
-  Source : Hebcal.com
-  License : Free for non-commercial use, requires attribution
-  Citation : "Shabbat times powered by Hebcal.com"

 Biblical Recipes :
- Original content researched and written for this project
- Historical context based on archaeological sources
- Scripture references from public domain translations

    Acknowledgments

Special thanks to:
-  STEPBible.org  for providing high-quality Hebrew/Greek data with morphological tagging
-  Hebcal.com  for Jewish calendar and Shabbat time calculations
-  Open Source Community  for PHP, SQLite, and countless libraries

---

   📬 Contact

Zack Kroucamp  
Email: fishpuffer70@gmail.com  
Portfolio: zacktollemache.com  
GitHub: https://github.com/ZackKroucamp
LinkedIn: https://www.linkedin.com/in/zack-ignatius-kroucamp-507263223

---

 ⭐ If this project demonstrates the skills you're looking for, let's talk about how I can contribute to your team! 

---

   Appendix: Key Technical Metrics

    Database Scale
-  MySQL Tables : 15 tables, ~5
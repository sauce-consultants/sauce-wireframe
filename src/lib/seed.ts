import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "the-pass.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`DROP TABLE IF EXISTS dish_history`);
db.exec(`DROP TABLE IF EXISTS dish_comments`);
db.exec(`DROP TABLE IF EXISTS dishes`);
db.exec(`DROP TABLE IF EXISTS journal_entries`);
db.exec(`DROP TABLE IF EXISTS customers`);
db.exec(`
  CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    subtitle TEXT,
    short_code TEXT UNIQUE,
    stage TEXT NOT NULL CHECK(stage IN ('enquiry','reservation','seated','cleared','archived')),
    owner TEXT NOT NULL,
    size TEXT CHECK(size IN ('XS','S','M','L','XL')),
    last_activity TEXT NOT NULL,
    next_action TEXT,
    due_date TEXT,
    created_at TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    entry_type TEXT CHECK(entry_type IN ('note','update','meeting','call','email')),
    created_at TEXT NOT NULL
  )
`);

function daysAgo(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const insert = db.prepare(`
  INSERT INTO customers (company_name, subtitle, short_code, stage, owner, size, last_activity, next_action, due_date, created_at, sort_order)
  VALUES (@company_name, @subtitle, @short_code, @stage, @owner, @size, @last_activity, @next_action, @due_date, @created_at, @sort_order)
`);

const customers = [
  // At the door (Enquiry)                                                                          // ID
  { company_name: "HireCo", subtitle: "Customer Portal", short_code: "HIR", stage: "enquiry", owner: "jim-wardlaw", size: "M", last_activity: daysAgo(3), next_action: "Schedule discovery call with product team", due_date: futureDate(4), created_at: daysAgo(10), sort_order: 0 },           // 1
  { company_name: "Cool Run", subtitle: "Delivery Market Place", short_code: "CRN", stage: "enquiry", owner: "matt-weldon", size: "M", last_activity: daysAgo(5), next_action: "Send capabilities deck and case studies", due_date: futureDate(2), created_at: daysAgo(8), sort_order: 1 },     // 2
  { company_name: "Flame Pro", subtitle: "Asset Tracking", short_code: "FPR", stage: "enquiry", owner: "luke-savory", size: "L", last_activity: daysAgo(12), next_action: "Follow up on initial interest", due_date: futureDate(-2), created_at: daysAgo(18), sort_order: 2 },                  // 3
  { company_name: "Ideal", subtitle: "AI Consultation", short_code: "IAI", stage: "enquiry", owner: "matt-weldon", size: "XS", last_activity: daysAgo(2), next_action: "Prep AI readiness assessment framework", due_date: futureDate(5), created_at: daysAgo(6), sort_order: 3 },              // 4
  { company_name: "Global View Systems", subtitle: "AI Consultation", short_code: "GVS", stage: "enquiry", owner: "matt-weldon", size: "XS", last_activity: daysAgo(8), next_action: "Arrange intro meeting with CTO", due_date: futureDate(7), created_at: daysAgo(14), sort_order: 4 },       // 5
  { company_name: "Parallel", subtitle: "AI Consultation", short_code: "PAR", stage: "enquiry", owner: "john-polling", size: "XS", last_activity: daysAgo(15), next_action: "Reconnect after their board review", due_date: futureDate(10), created_at: daysAgo(22), sort_order: 5 },           // 6
  { company_name: "TeeFree", subtitle: "Golf App", short_code: "TEE", stage: "enquiry", owner: "matt-gibson", size: "S", last_activity: daysAgo(6), next_action: "Review competitor analysis and prep proposal", due_date: futureDate(8), created_at: daysAgo(9), sort_order: 6 },              // 7
  { company_name: "PE Pro", subtitle: "Customer Platform", short_code: "PEP", stage: "enquiry", owner: "john-polling", size: "S", last_activity: daysAgo(4), next_action: "Send technical questionnaire", due_date: futureDate(3), created_at: daysAgo(7), sort_order: 7 },                     // 8
  { company_name: "Diony", subtitle: "eCommerce ChatBot", short_code: "DIO", stage: "enquiry", owner: "luke-savory", size: "S", last_activity: daysAgo(1), next_action: "Demo chatbot capabilities to their marketing team", due_date: futureDate(6), created_at: daysAgo(4), sort_order: 8 },  // 9
  { company_name: "Greggs", subtitle: "Tray Asset Tracking", short_code: "GRG", stage: "enquiry", owner: "jim-wardlaw", size: "XL", last_activity: daysAgo(7), next_action: "Site visit to assess tracking requirements", due_date: futureDate(12), created_at: daysAgo(11), sort_order: 9 },   // 10

  // Booked in (Reservation)
  { company_name: "GXO", subtitle: "Activity Tracker", short_code: "GAT", stage: "reservation", owner: "john-polling", size: "L", last_activity: daysAgo(1), next_action: "Finalise SOW and commercial terms", due_date: futureDate(5), created_at: daysAgo(30), sort_order: 0 },              // 11
  { company_name: "Ideal", subtitle: "Evo Max", short_code: "EVO", stage: "reservation", owner: "aidan-treasure", size: "XL", last_activity: daysAgo(2), next_action: "Technical architecture review session", due_date: futureDate(3), created_at: daysAgo(20), sort_order: 1 },               // 12
  { company_name: "Coyle Wellbeing", subtitle: "Unified Gym App", short_code: "CWB", stage: "reservation", owner: "jim-wardlaw", size: "M", last_activity: daysAgo(4), next_action: "Present wireframes to stakeholder group", due_date: futureDate(7), created_at: daysAgo(15), sort_order: 2 }, // 13
  { company_name: "GXO", subtitle: "Driver Debrief", short_code: "GDD", stage: "reservation", owner: "jim-wardlaw", size: "L", last_activity: daysAgo(0, 5), next_action: "Sign off sprint 1 scope with ops manager", due_date: futureDate(1), created_at: daysAgo(25), sort_order: 3 },       // 14

  // Being served (Seated)
  { company_name: "Ideal", subtitle: "IoT Platform", short_code: "IOT", stage: "seated", owner: "aidan-treasure", size: "XL", last_activity: daysAgo(0, 4), next_action: "Sprint 3 review with platform team", due_date: futureDate(2), created_at: daysAgo(80), sort_order: 0 },             // 15
  { company_name: "GigLab", subtitle: "Platform", short_code: "GIG", stage: "seated", owner: "john-polling", size: "L", last_activity: daysAgo(0, 2), next_action: "Sprint 6 demo to product owner", due_date: futureDate(2), created_at: daysAgo(90), sort_order: 1 },                        // 16
  { company_name: "Rix", subtitle: "AI Consultation", short_code: "RIX", stage: "seated", owner: "john-polling", size: "XS", last_activity: daysAgo(1), next_action: "Deliver AI strategy recommendations report", due_date: futureDate(4), created_at: daysAgo(45), sort_order: 2 },           // 17
  { company_name: "Punchy", subtitle: "Messaging ChatBot", short_code: "PUN", stage: "seated", owner: "luke-savory", size: "S", last_activity: daysAgo(0, 6), next_action: "UAT testing with customer support team", due_date: futureDate(3), created_at: daysAgo(60), sort_order: 3 },         // 18
  { company_name: "Hurst", subtitle: "Transport Management", short_code: "HUR", stage: "seated", owner: "john-polling", size: "L", last_activity: daysAgo(2), next_action: "Integrate with their existing TMS API", due_date: futureDate(8), created_at: daysAgo(75), sort_order: 4 },          // 19

  // Plates away (Cleared) — empty for now

  // Left the building (Archived) — empty for now
];

const insertMany = db.transaction((items: typeof customers) => {
  for (const item of items) {
    insert.run(item);
  }
});

insertMany(customers);
console.log(`Seeded ${customers.length} customers`);

// --- Journal entries ---

const insertEntry = db.prepare(`
  INSERT INTO journal_entries (customer_id, content, author, entry_type, created_at)
  VALUES (@customer_id, @content, @author, @entry_type, @created_at)
`);

const journalEntries = [
  // GigLab (id=15) — active platform project
  { customer_id: 15, content: "Sprint 6 kickoff. Agreed to focus on user onboarding flow and billing integration.", author: "john-polling", entry_type: "meeting", created_at: daysAgo(0, 2) },
  { customer_id: 15, content: "Deployed staging environment with new dashboard. Shared access with product owner.", author: "john-polling", entry_type: "update", created_at: daysAgo(3) },
  { customer_id: 15, content: "Sprint 5 retro:\n- Positive: API performance significantly improved\n- Action: need to add monitoring for webhook failures\n- Next: sprint 6 planning Monday", author: "john-polling", entry_type: "note", created_at: daysAgo(7) },

  // GXO Activity Tracker (id=11) — reservation stage
  { customer_id: 11, content: "Commercial proposal sent. They're reviewing internally this week.", author: "john-polling", entry_type: "email", created_at: daysAgo(1) },
  { customer_id: 11, content: "Good discovery session. They need real-time activity tracking across 3 warehouses. Existing Excel-based system is falling apart.", author: "john-polling", entry_type: "meeting", created_at: daysAgo(5) },

  // Punchy (id=17) — seated, chatbot project
  { customer_id: 17, content: "Chatbot deployed to staging. Customer support team starting UAT this week.", author: "luke-savory", entry_type: "update", created_at: daysAgo(0, 6) },
  { customer_id: 17, content: "Fine-tuned response templates based on feedback from last demo. Much better tone now.", author: "luke-savory", entry_type: "note", created_at: daysAgo(3) },

  // GXO Driver Debrief (id=14) — reservation, very active
  { customer_id: 14, content: "Scope meeting with ops manager. Sprint 1 will cover driver check-in flow and basic debrief form.", author: "jim-wardlaw", entry_type: "meeting", created_at: daysAgo(0, 5) },

  // Diony (id=9) — enquiry, just came in
  { customer_id: 9, content: "Inbound enquiry via website. They want to explore AI chatbot for their eCommerce platform. Looks like a good fit for our standard chatbot package.", author: "luke-savory", entry_type: "note", created_at: daysAgo(1) },

  // Hurst (id=18) — seated, transport management
  { customer_id: 18, content: "API integration progressing. Their TMS uses a non-standard auth flow — needed extra work on the connector.", author: "john-polling", entry_type: "update", created_at: daysAgo(2) },
  { customer_id: 18, content: "Call with their IT director about data security requirements. They need us to complete their vendor security questionnaire.", author: "john-polling", entry_type: "call", created_at: daysAgo(6) },
];

const insertEntries = db.transaction((items: typeof journalEntries) => {
  for (const item of items) {
    insertEntry.run(item);
  }
});

insertEntries(journalEntries);
console.log(`Seeded ${journalEntries.length} journal entries`);

// --- Dishes ---

db.exec(`
  CREATE TABLE dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'backlog' CHECK(status IN ('backlog','todo','in_progress','review','done')),
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    dish_number INTEGER NOT NULL,
    assignee TEXT,
    agent TEXT,
    priority TEXT DEFAULT 'med' CHECK(priority IN ('high','med','low')),
    size TEXT CHECK(size IN ('XS','S','M','L','XL')),
    labels TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

const insertDish = db.prepare(`
  INSERT INTO dishes (title, body, status, customer_id, dish_number, assignee, agent, priority, size, labels, sort_order, created_at, updated_at)
  VALUES (@title, @body, @status, @customer_id, @dish_number, @assignee, @agent, @priority, @size, @labels, @sort_order, @created_at, @updated_at)
`);

const now = new Date().toISOString();

const dishes = [
  // GigLab Platform (id=16, code=GIG)
  { title: "User onboarding flow", body: "## Requirements\n\nNew users need a guided onboarding:\n\n1. Welcome screen with product overview\n2. Workspace creation wizard\n3. Invite team members step\n4. First project creation prompt\n\n## Acceptance Criteria\n\n- [ ] User can complete onboarding in under 2 minutes\n- [ ] Skip option available at every step\n- [ ] Progress indicator shows current step", status: "in_progress", customer_id: 16, dish_number: 1, assignee: "john-polling", agent: "frontend-dev", priority: "high", size: "M", labels: "feature,onboarding", sort_order: 0, created_at: daysAgo(5), updated_at: daysAgo(0, 3) },
  { title: "Billing integration", body: "Integrate Stripe for subscription billing. Need to support monthly and annual plans.", status: "todo", customer_id: 16, dish_number: 2, assignee: "john-polling", agent: null, priority: "high", size: "L", labels: "feature,billing", sort_order: 0, created_at: daysAgo(8), updated_at: daysAgo(2) },
  { title: "Fix dashboard chart rendering on Safari", body: "Charts don't render correctly on Safari 17. The bar chart shows incorrect widths.", status: "review", customer_id: 16, dish_number: 3, assignee: "john-polling", agent: "qa-tester", priority: "med", size: "S", labels: "bug,safari", sort_order: 0, created_at: daysAgo(3), updated_at: daysAgo(1) },
  { title: "API rate limiting", body: "Implement rate limiting on public API endpoints. 100 requests per minute per API key.", status: "backlog", customer_id: 16, dish_number: 4, assignee: null, agent: null, priority: "med", size: "S", labels: "feature,api", sort_order: 0, created_at: daysAgo(10), updated_at: daysAgo(10) },
  { title: "Add webhook support for events", body: "Allow customers to register webhook URLs for key events (user.created, project.updated, etc.).", status: "backlog", customer_id: 16, dish_number: 5, assignee: null, agent: null, priority: "low", size: "L", labels: "feature,api,webhooks", sort_order: 1, created_at: daysAgo(12), updated_at: daysAgo(12) },

  // Punchy ChatBot (id=18, code=PUN)
  { title: "Fine-tune response tone", body: "Customer feedback says responses are too formal. Need to adjust the prompt templates to be more conversational.", status: "in_progress", customer_id: 18, dish_number: 1, assignee: "luke-savory", agent: "ux-designer", priority: "high", size: "S", labels: "improvement,tone", sort_order: 0, created_at: daysAgo(2), updated_at: daysAgo(0, 6) },
  { title: "Add escalation to human agent", body: "When the chatbot can't resolve, provide a smooth handoff to a human support agent.", status: "todo", customer_id: 18, dish_number: 2, assignee: "luke-savory", agent: null, priority: "med", size: "M", labels: "feature", sort_order: 0, created_at: daysAgo(7), updated_at: daysAgo(4) },

  // GXO Activity Tracker (id=11, code=GAT)
  { title: "Discovery: warehouse floor layout mapping", body: "Map the physical layout of the 3 warehouses to understand zone tracking requirements.", status: "todo", customer_id: 11, dish_number: 1, assignee: "john-polling", agent: null, priority: "high", size: "M", labels: "discovery,spike", sort_order: 0, created_at: daysAgo(3), updated_at: daysAgo(1) },
  { title: "Define data model for activity events", body: "## Event Types\n\n- Pick started\n- Pick completed\n- Pallet moved\n- Zone entry/exit\n- Break started/ended", status: "backlog", customer_id: 11, dish_number: 2, assignee: null, agent: null, priority: "med", size: "S", labels: "architecture,data-model", sort_order: 0, created_at: daysAgo(5), updated_at: daysAgo(5) },

  // Hurst Transport Management (id=19, code=HUR)
  { title: "TMS API connector", body: "Build the integration connector for their existing TMS. Non-standard OAuth flow — needs custom auth handling.", status: "in_progress", customer_id: 19, dish_number: 1, assignee: "john-polling", agent: "backend-dev", priority: "high", size: "L", labels: "integration,api", sort_order: 0, created_at: daysAgo(6), updated_at: daysAgo(2) },
  { title: "Vendor security questionnaire", body: "Complete their IT security questionnaire. 47 questions covering data handling, encryption, access controls.", status: "todo", customer_id: 19, dish_number: 2, assignee: "john-polling", agent: null, priority: "med", size: "S", labels: "compliance", sort_order: 0, created_at: daysAgo(4), updated_at: daysAgo(4) },

  // Ideal Evo Max (id=12, code=EVO)
  { title: "Technical architecture review", body: "Review proposed architecture with their tech lead. Key decisions: cloud provider, database choice, API gateway.", status: "in_progress", customer_id: 12, dish_number: 1, assignee: "aidan-treasure", agent: "tech-lead", priority: "high", size: "M", labels: "architecture,review", sort_order: 0, created_at: daysAgo(3), updated_at: daysAgo(1) },

  // Coyle Wellbeing (id=13, code=CWB)
  { title: "Wireframe: member dashboard", body: "Create wireframes for the main member dashboard showing:\n- Upcoming bookings\n- Membership status\n- Activity history\n- Quick book widget", status: "done", customer_id: 13, dish_number: 1, assignee: "jim-wardlaw", agent: "ux-designer", priority: "med", size: "M", labels: "design,wireframe", sort_order: 0, created_at: daysAgo(10), updated_at: daysAgo(4) },
  { title: "Wireframe: class booking flow", body: "Design the class search and booking flow for the gym app.", status: "in_progress", customer_id: 13, dish_number: 2, assignee: "jim-wardlaw", agent: "ux-designer", priority: "med", size: "M", labels: "design,wireframe", sort_order: 1, created_at: daysAgo(6), updated_at: daysAgo(1) },
];

const insertDishes = db.transaction((items: typeof dishes) => {
  for (const item of items) {
    insertDish.run(item);
  }
});

insertDishes(dishes);
console.log(`Seeded ${dishes.length} dishes`);

// --- Dish comments & history ---

db.exec(`
  CREATE TABLE dish_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dish_id INTEGER NOT NULL REFERENCES dishes(id),
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_type TEXT NOT NULL CHECK(author_type IN ('human','agent')),
    created_at TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE dish_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dish_id INTEGER NOT NULL REFERENCES dishes(id),
    field TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by TEXT NOT NULL,
    changed_by_type TEXT NOT NULL CHECK(changed_by_type IN ('human','agent')),
    created_at TEXT NOT NULL
  )
`);

const insertComment = db.prepare(`
  INSERT INTO dish_comments (dish_id, content, author_name, author_type, created_at)
  VALUES (@dish_id, @content, @author_name, @author_type, @created_at)
`);

const insertHistoryEntry = db.prepare(`
  INSERT INTO dish_history (dish_id, field, old_value, new_value, changed_by, changed_by_type, created_at)
  VALUES (@dish_id, @field, @old_value, @new_value, @changed_by, @changed_by_type, @created_at)
`);

const sampleComments = [
  // Dish 1 — User onboarding flow (GigLab)
  { dish_id: 1, content: "Started on the welcome screen component. Using a step-by-step wizard pattern. Should have a first draft by EOD.", author_name: "frontend-dev", author_type: "agent", created_at: daysAgo(1) },
  { dish_id: 1, content: "Looks good so far. Make sure the skip option is prominent — we don't want to trap users in the flow.", author_name: "John Polling", author_type: "human", created_at: daysAgo(0, 8) },

  // Dish 3 — Safari chart bug (GigLab)
  { dish_id: 3, content: "Reproduced the issue. It's a flexbox rendering bug in Safari 17. The fix is to use explicit widths instead of flex-grow on the bar elements.", author_name: "qa-tester", author_type: "agent", created_at: daysAgo(1, 4) },
  { dish_id: 3, content: "Fix applied. Ready for review.", author_name: "qa-tester", author_type: "agent", created_at: daysAgo(1) },

  // Dish 6 — Fine-tune response tone (Punchy)
  { dish_id: 6, content: "Updated prompt templates. Reduced formality, added more casual connectors. Before: 'I understand your concern.' After: 'Got it, let me help with that.'", author_name: "ux-designer", author_type: "agent", created_at: daysAgo(0, 6) },

  // Dish 10 — TMS API connector (Hurst)
  { dish_id: 10, content: "Their OAuth flow requires a custom token refresh mechanism. Standard libraries don't handle it. Building a wrapper.", author_name: "backend-dev", author_type: "agent", created_at: daysAgo(2) },
  { dish_id: 10, content: "Good progress. Let's make sure we have retry logic for token refresh failures — their API is occasionally flaky.", author_name: "John Polling", author_type: "human", created_at: daysAgo(1) },
];

const sampleHistory = [
  // Dish 1 — moved from backlog to in_progress
  { dish_id: 1, field: "status", old_value: "backlog", new_value: "todo", changed_by: "John Polling", changed_by_type: "human", created_at: daysAgo(4) },
  { dish_id: 1, field: "assignee", old_value: null, new_value: "john-polling", changed_by: "John Polling", changed_by_type: "human", created_at: daysAgo(4) },
  { dish_id: 1, field: "status", old_value: "todo", new_value: "in_progress", changed_by: "John Polling", changed_by_type: "human", created_at: daysAgo(2) },
  { dish_id: 1, field: "agent", old_value: null, new_value: "frontend-dev", changed_by: "John Polling", changed_by_type: "human", created_at: daysAgo(2) },

  // Dish 3 — moved through to review
  { dish_id: 3, field: "status", old_value: "in_progress", new_value: "review", changed_by: "qa-tester", changed_by_type: "agent", created_at: daysAgo(1) },

  // Dish 13 — wireframe completed
  { dish_id: 13, field: "status", old_value: "in_progress", new_value: "done", changed_by: "ux-designer", changed_by_type: "agent", created_at: daysAgo(4) },
];

const insertComments = db.transaction((items: typeof sampleComments) => {
  for (const item of items) {
    insertComment.run(item);
  }
});

const insertHistoryEntries = db.transaction((items: typeof sampleHistory) => {
  for (const item of items) {
    insertHistoryEntry.run(item);
  }
});

insertComments(sampleComments);
insertHistoryEntries(sampleHistory);
console.log(`Seeded ${sampleComments.length} dish comments, ${sampleHistory.length} history entries`);

// --- Users ---

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TEXT NOT NULL
  )
`);

const insertUser = db.prepare(`
  INSERT INTO users (email, name, avatar_url, created_at) VALUES (@email, @name, @avatar_url, @created_at)
`);

const users = [
  { email: "matt.weldon@wearesauce.io", name: "Matt Weldon", avatar_url: null, created_at: now },
  { email: "john.polling@wearesauce.io", name: "John Polling", avatar_url: null, created_at: now },
  { email: "matt.gibson@wearesauce.io", name: "Matt Gibson", avatar_url: null, created_at: now },
  { email: "jim.wardlaw@wearesauce.io", name: "Jim Wardlaw", avatar_url: null, created_at: now },
  { email: "aidan.treasure@wearesauce.io", name: "Aidan Treasure", avatar_url: null, created_at: now },
  { email: "rob.marsh@wearesauce.io", name: "Rob Marsh", avatar_url: null, created_at: now },
  { email: "james.hay@wearesauce.io", name: "James Hay", avatar_url: null, created_at: now },
  { email: "xing.xing@wearesauce.io", name: "Xing Xing", avatar_url: null, created_at: now },
  { email: "sam.osborne@wearesauce.io", name: "Sam Osborne", avatar_url: null, created_at: now },
  { email: "sam.mearns@wearesauce.io", name: "Sam Mearns", avatar_url: null, created_at: now },
  { email: "luke.savory@wearesauce.io", name: "Luke Savory", avatar_url: null, created_at: now },
  { email: "emma.elkan@wearesauce.io", name: "Emma Elkan", avatar_url: null, created_at: now },
  { email: "mel.brooker@wearesauce.io", name: "Mel Brooker", avatar_url: null, created_at: now },
];

const insertUsers = db.transaction((items: typeof users) => {
  for (const item of items) { insertUser.run(item); }
});
insertUsers(users);
console.log(`Seeded ${users.length} users`);

// --- API Keys ---

db.exec(`
  CREATE TABLE api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_hash TEXT UNIQUE NOT NULL,
    agent_name TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

// Dev keys — stored as SHA-256 hashes
const devKeys = [
  { name: "ux-designer", key: "sk_ux_designer_dev_key_001" },
  { name: "backend-dev", key: "sk_backend_dev_dev_key_001" },
  { name: "frontend-dev", key: "sk_frontend_dev_dev_key_001" },
  { name: "qa-tester", key: "sk_qa_tester_dev_key_001" },
  { name: "tech-lead", key: "sk_tech_lead_dev_key_001" },
];

const insertKey = db.prepare(`
  INSERT INTO api_keys (key_hash, agent_name, created_at) VALUES (@key_hash, @agent_name, @created_at)
`);

for (const dk of devKeys) {
  const hash = crypto.createHash("sha256").update(dk.key).digest("hex");
  insertKey.run({ key_hash: hash, agent_name: dk.name, created_at: now });
}
console.log(`Seeded ${devKeys.length} API keys`);
console.log("Dev API keys:");
for (const dk of devKeys) {
  console.log(`  ${dk.name}: ${dk.key}`);
}

db.close();
console.log(`Database: ${DB_PATH}`);

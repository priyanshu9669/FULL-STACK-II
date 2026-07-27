// Simulated backend. In a real app these would be `fetch()` calls to a server.
// Kept here so createAsyncThunk has a genuine async boundary to cross,
// matching the "network lifecycle" (pending / fulfilled / rejected) pattern
// described in the experiment.

const PLATFORM_SEED = [
  { id: "x", name: "X / Twitter", color: "#1C1F26", limit: 280 },
  { id: "instagram", name: "Instagram", color: "#C13584", limit: 2200 },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", limit: 3000 },
  { id: "tiktok", name: "TikTok", color: "#25F4EE", limit: 150 },
];

const STATUS = ["draft", "scheduled", "published"];

function randomDateWithinDays(spread) {
  const now = Date.now();
  const offset = (Math.random() - 0.4) * spread * 24 * 60 * 60 * 1000;
  return new Date(now + offset).toISOString();
}

function seedPosts(count = 18) {
  const topics = [
    "Feature launch teaser",
    "Behind the scenes at the studio",
    "Customer spotlight",
    "Weekly product tip",
    "Team hiring announcement",
    "Community Q&A recap",
    "Milestone: 10k users",
    "New integration walkthrough",
    "Founder note on roadmap",
    "Live event recap",
  ];
  return Array.from({ length: count }, (_, i) => {
    const platform = PLATFORM_SEED[i % PLATFORM_SEED.length];
    const topic = topics[i % topics.length];
    return {
      id: `post-${i + 1}`,
      platformId: platform.id,
      content: `${topic} — draft #${i + 1} for ${platform.name}.`,
      status: STATUS[i % STATUS.length],
      scheduledFor: randomDateWithinDays(14),
      engagement: {
        likes: Math.floor(Math.random() * 480),
        shares: Math.floor(Math.random() * 90),
        comments: Math.floor(Math.random() * 60),
      },
      createdAt: randomDateWithinDays(30),
    };
  });
}

// A tiny in-memory "database" so mutations persist for the session.
let db = {
  platforms: PLATFORM_SEED,
  posts: seedPosts(),
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiFetchPlatforms() {
  await delay(400);
  return structuredClone(db.platforms);
}

export async function apiFetchPosts() {
  await delay(600);
  // Occasionally simulate a transient failure so the `rejected` branch
  // of the async thunk lifecycle is exercised in real usage.
  if (Math.random() < 0.05) {
    throw new Error("Network hiccup: failed to load posts. Try again.");
  }
  return structuredClone(db.posts);
}

export async function apiCreatePost(post) {
  await delay(350);
  const newPost = {
    id: `post-${Date.now()}`,
    engagement: { likes: 0, shares: 0, comments: 0 },
    createdAt: new Date().toISOString(),
    ...post,
  };
  db.posts = [...db.posts, newPost];
  return structuredClone(newPost);
}

export async function apiUpdatePost(id, changes) {
  await delay(300);
  db.posts = db.posts.map((p) => (p.id === id ? { ...p, ...changes } : p));
  return { id, changes: structuredClone(changes) };
}

export async function apiDeletePost(id) {
  await delay(250);
  db.posts = db.posts.filter((p) => p.id !== id);
  return id;
}

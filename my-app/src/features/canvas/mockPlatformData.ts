export interface PlayerSummary {
  username: string;
  solvedChallenges: number;
  ownedPixels: number;
  submissions: number;
  accuracy: number;
  rank: number;
}

export interface OwnedPixel {
  id: string;
  x: number;
  y: number;
  color: string;
  challenge: string;
  status: "Owned" | "Defended" | "Contested";
  updatedAt: string;
}

export interface SubmissionEvaluation {
  id: string;
  challenge: string;
  difficulty: "Easy" | "Medium" | "Hard";
  verdict: "Accepted" | "Wrong Answer" | "Time Limit";
  runtime: string;
  score: number;
  submittedAt: string;
}

export interface OwnershipHistoryEntry {
  id: string;
  pixel: string;
  previousOwner: string;
  newOwner: string;
  challenge: string;
  changedAt: string;
}

export interface ProfileData {
  username: string;
  email: string;
  joinedLabel: string;
  rank: number;
  solvedChallenges: number;
  submissions: number;
  acceptedRate: number;
  evaluationScore: number;
  ownedPixels: OwnedPixel[];
  evaluations: SubmissionEvaluation[];
  history: OwnershipHistoryEntry[];
}

const fallbackPlayers: PlayerSummary[] = [
  { username: "pixelqueen", solvedChallenges: 34, ownedPixels: 91, submissions: 48, accuracy: 92, rank: 1 },
  { username: "stackmaster", solvedChallenges: 31, ownedPixels: 82, submissions: 44, accuracy: 88, rank: 2 },
  { username: "algofox", solvedChallenges: 29, ownedPixels: 74, submissions: 40, accuracy: 87, rank: 3 },
  { username: "binarybird", solvedChallenges: 22, ownedPixels: 51, submissions: 34, accuracy: 81, rank: 4 },
  { username: "loopmage", solvedChallenges: 19, ownedPixels: 43, submissions: 29, accuracy: 79, rank: 5 },
];

const fallbackOwnedPixels: OwnedPixel[] = [
  { id: "px-145", x: 12, y: 8, color: "#f97316", challenge: "Two Sum", status: "Owned", updatedAt: "2h ago" },
  { id: "px-146", x: 13, y: 8, color: "#38bdf8", challenge: "Valid Parentheses", status: "Defended", updatedAt: "5h ago" },
  { id: "px-147", x: 14, y: 8, color: "#a3e635", challenge: "Array Rotation", status: "Owned", updatedAt: "Yesterday" },
  { id: "px-233", x: 22, y: 11, color: "#f43f5e", challenge: "Hash Map Frequency", status: "Contested", updatedAt: "Yesterday" },
  { id: "px-241", x: 9, y: 16, color: "#c084fc", challenge: "Recursion Warmup", status: "Defended", updatedAt: "2 days ago" },
];

const fallbackEvaluations: SubmissionEvaluation[] = [
  { id: "sub-201", challenge: "Two Sum", difficulty: "Easy", verdict: "Accepted", runtime: "31 ms", score: 100, submittedAt: "Today, 11:20" },
  { id: "sub-202", challenge: "Hash Map Frequency", difficulty: "Medium", verdict: "Wrong Answer", runtime: "44 ms", score: 62, submittedAt: "Today, 09:10" },
  { id: "sub-203", challenge: "Valid Parentheses", difficulty: "Easy", verdict: "Accepted", runtime: "28 ms", score: 98, submittedAt: "Yesterday, 18:42" },
  { id: "sub-204", challenge: "Array Rotation", difficulty: "Easy", verdict: "Accepted", runtime: "35 ms", score: 95, submittedAt: "Yesterday, 14:03" },
];

const fallbackHistory: OwnershipHistoryEntry[] = [
  { id: "hist-1", pixel: "(12, 8)", previousOwner: "loopmage", newOwner: "you", challenge: "Two Sum", changedAt: "2h ago" },
  { id: "hist-2", pixel: "(13, 8)", previousOwner: "algofox", newOwner: "you", challenge: "Valid Parentheses", changedAt: "5h ago" },
  { id: "hist-3", pixel: "(22, 11)", previousOwner: "you", newOwner: "pixelqueen", challenge: "Hash Map Frequency", changedAt: "Yesterday" },
  { id: "hist-4", pixel: "(9, 16)", previousOwner: "stackmaster", newOwner: "you", challenge: "Recursion Warmup", changedAt: "2 days ago" },
];

function readRegisteredUsers(): Array<{ nickname?: string; email?: string }> {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem("registeredUsers") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getUserIdentity() {
  const username =
    (typeof window !== "undefined" && window.localStorage.getItem("username")) ||
    "canvas_coder";
  const explicitEmail =
    (typeof window !== "undefined" && window.localStorage.getItem("userEmail")) ||
    "";
  const matchedUser = readRegisteredUsers().find((user) => user.nickname === username);
  const email =
    explicitEmail ||
    matchedUser?.email ||
    `${username.toLowerCase().replace(/\s+/g, "_")}@codepixel.dev`;

  return { username, email };
}

export function getStatisticsData() {
  const { username } = getUserIdentity();
  const players = [...fallbackPlayers];
  const hasCurrentPlayer = players.some((player) => player.username === username);

  if (!hasCurrentPlayer) {
    players.push({
      username,
      solvedChallenges: 16,
      ownedPixels: 37,
      submissions: 24,
      accuracy: 84,
      rank: 6,
    });
  }

  const sortedByRank = players.sort((a, b) => a.rank - b.rank);
  const totalOwnedPixels = sortedByRank.reduce((sum, player) => sum + player.ownedPixels, 0);
  const totalSubmissions = sortedByRank.reduce((sum, player) => sum + player.submissions, 0);
  const activeUsers = sortedByRank.length + 18;

  return {
    topPlayers: sortedByRank.slice(0, 4),
    pixelOwners: [...sortedByRank].sort((a, b) => b.ownedPixels - a.ownedPixels).slice(0, 5),
    overview: [
      { label: "Active players", value: activeUsers.toString().padStart(2, "0"), note: "Solved at least one challenge this week" },
      { label: "Pixels owned", value: totalOwnedPixels.toString(), note: "Current claimed cells on the board" },
      { label: "Accepted submissions", value: Math.round(totalSubmissions * 0.81).toString(), note: "Latest verified challenge results" },
      { label: "Ownership transfers", value: "128", note: "Tracked pixel history events" },
    ],
    recentHistory: [
      { label: "Pixel (12, 8) moved to @pixelqueen", time: "12 min ago" },
      { label: "Pixel (31, 14) defended by @stackmaster", time: "38 min ago" },
      { label: "Pixel (9, 16) captured by @algofox", time: "1h ago" },
      { label: "Pixel (22, 11) solved by @binarybird", time: "2h ago" },
    ],
  };
}

export function getProfileData(): ProfileData {
  const { username, email } = getUserIdentity();
  const acceptedCount = fallbackEvaluations.filter((item) => item.verdict === "Accepted").length;

  return {
    username,
    email,
    joinedLabel: "Joined this semester",
    rank: 6,
    solvedChallenges: 16,
    submissions: 24,
    acceptedRate: Math.round((acceptedCount / fallbackEvaluations.length) * 100),
    evaluationScore: 89,
    ownedPixels: fallbackOwnedPixels,
    evaluations: fallbackEvaluations,
    history: fallbackHistory.map((entry) => ({
      ...entry,
      newOwner: entry.newOwner === "you" ? username : entry.newOwner,
      previousOwner: entry.previousOwner === "you" ? username : entry.previousOwner,
    })),
  };
}

import { useEffect, useState } from "react";
import { apiUrl } from "../../api";
import styles from "./Statistics.module.css";

type OverviewItem = { Label: string; Value: string | number; Note: string };
type PlayerItem = {
  Rank: number;
  Username: string;
  OwnedPixels: number;
  SolvedChallenges: number;
  Submissions: number;
  Accuracy: number;
};
type HistoryItem = { Label: string; Time: string };
type RawOverviewItem = { label?: string; value?: string | number; note?: string };
type RawPlayerItem = {
  rank?: number;
  username?: string;
  ownedPixels?: number;
  solvedChallenges?: number;
  submissions?: number;
  accuracy?: number;
};
type RawHistoryItem = { label?: string; time?: string };
type UnknownRecord = Record<string, unknown>;

interface StatisticsData {
  Overview: OverviewItem[];
  TopPlayers: PlayerItem[];
  PixelOwners: PlayerItem[];
  RecentHistory: HistoryItem[];
}

type StatisticsApiData = Partial<StatisticsData> & {
  overview?: RawOverviewItem[];
  topPlayers?: RawPlayerItem[];
  pixelOwners?: RawPlayerItem[];
  recentHistory?: RawHistoryItem[];
};

function normalizeOverview(items: OverviewItem[] | RawOverviewItem[] | undefined): OverviewItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const value = item as UnknownRecord;

    return {
      Label: (value.Label as string | undefined) ?? (value.label as string | undefined) ?? "Unknown",
      Value: (value.Value as string | number | undefined) ?? (value.value as string | number | undefined) ?? "-",
      Note: (value.Note as string | undefined) ?? (value.note as string | undefined) ?? "",
    };
  });
}

function normalizePlayers(items: PlayerItem[] | RawPlayerItem[] | undefined): PlayerItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => {
    const value = item as UnknownRecord;

    return {
      Rank: (value.Rank as number | undefined) ?? (value.rank as number | undefined) ?? index + 1,
      Username: (value.Username as string | undefined) ?? (value.username as string | undefined) ?? "Unknown",
      OwnedPixels: (value.OwnedPixels as number | undefined) ?? (value.ownedPixels as number | undefined) ?? 0,
      SolvedChallenges:
        (value.SolvedChallenges as number | undefined) ?? (value.solvedChallenges as number | undefined) ?? 0,
      Submissions: (value.Submissions as number | undefined) ?? (value.submissions as number | undefined) ?? 0,
      Accuracy: (value.Accuracy as number | undefined) ?? (value.accuracy as number | undefined) ?? 0,
    };
  });
}

function normalizeHistory(items: HistoryItem[] | RawHistoryItem[] | undefined): HistoryItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const value = item as UnknownRecord;

    return {
      Label: (value.Label as string | undefined) ?? (value.label as string | undefined) ?? "Unknown activity",
      Time: (value.Time as string | undefined) ?? (value.time as string | undefined) ?? "",
    };
  });
}

function normalizeStatisticsData(data: StatisticsApiData): StatisticsData {
  return {
    Overview: normalizeOverview(data.Overview ?? data.overview),
    TopPlayers: normalizePlayers(data.TopPlayers ?? data.topPlayers),
    PixelOwners: normalizePlayers(data.PixelOwners ?? data.pixelOwners),
    RecentHistory: normalizeHistory(data.RecentHistory ?? data.recentHistory),
  };
}

interface StatisticsProps {
  onBack: () => void;
}

export default function Statistics({ onBack }: StatisticsProps) {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl("/api/statistics"));
      if (!response.ok) {
        throw new Error(`Statistics request failed (${response.status})`);
      }
      const data = normalizeStatisticsData((await response.json()) as StatisticsApiData);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.panel}>
          <p style={{ color: "#cbd5e1", textAlign: "center" }}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={styles.page}>
        <div className={styles.panel}>
          <p style={{ color: "#f43f5e", textAlign: "center" }}>Error: {error || "No data available"}</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className={styles.button} onClick={() => void fetchStats()}>
              Retry
            </button>
            <button className={styles.button} onClick={onBack}>
              Back to Board
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { Overview, TopPlayers, PixelOwners, RecentHistory } = stats;

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Statistics</p>
            <h1 className={styles.title}>Board activity at a glance</h1>
            <p className={styles.description}>
              Competitive activity, pixel ownership, and current board leaders in one compact dashboard.
            </p>
          </div>
          <button className={styles.button} onClick={onBack}>
            Back to Board
          </button>
        </div>

        <div className={styles.overviewGrid}>
          {Overview.map((item) => (
            <div key={item.Label} className={styles.section}>
              <p className={styles.overviewLabel}>{item.Label}</p>
              <div className={styles.overviewValue}>{item.Value}</div>
              <p className={styles.overviewNote}>{item.Note}</p>
            </div>
          ))}
        </div>

        <div className={styles.mainGrid}>
          <section className={styles.section}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.05rem" }}>Top players</h2>
                <p style={{ margin: "0.35rem 0 0", color: "#7c93b4", fontSize: "0.9rem" }}>
                  Ranked by solved challenges and consistent performance.
                </p>
              </div>
              <div style={{ color: "#7c93b4", fontSize: "0.85rem" }}>Live from backend</div>
            </div>

            <div className={styles.playersList}>
              {TopPlayers.map((player, index) => (
                <div key={`${player.Username}-${index}`} className={styles.playerRow}>
                  <div style={{ color: "#f8fafc", fontWeight: 700, fontSize: "1rem" }}>#{player.Rank}</div>
                  <div>
                    <div className={styles.playerName}>@{player.Username}</div>
                    <div className={styles.muted}>{player.SolvedChallenges} solved challenges</div>
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "0.84rem", whiteSpace: "nowrap" }}>{player.Submissions} submissions</div>
                  <div style={{ color: "#38bdf8", fontWeight: 700 }}>{player.Accuracy}%</div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.metaColumn}>
            <div className={styles.section}>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.05rem" }}>Most pixel owners</h2>
              <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
                {PixelOwners.map((player, index) => (
                  <div key={`${player.Username}-${index}`} className={styles.ownersRow}>
                    <div>
                      <div className={styles.playerName}>@{player.Username}</div>
                      <div className={styles.muted}>{player.SolvedChallenges} wins</div>
                    </div>
                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{player.OwnedPixels} px</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "1.05rem" }}>Recent ownership changes</h2>
              <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
                {RecentHistory.map((entry) => (
                  <div key={`${entry.Label}-${entry.Time}`} className={styles.historyRow} style={{ color: "#cbd5e1" }}>
                    <span>{entry.Label}</span>
                    <span style={{ color: "#7c93b4", whiteSpace: "nowrap", fontSize: "0.85rem" }}>{entry.Time}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

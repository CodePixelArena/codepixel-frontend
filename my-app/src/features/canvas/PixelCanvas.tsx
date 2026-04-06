import { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { useCanvas } from "./useCanvas";
import { usePixelSocket, type PixelUpdateMessage } from "./usePixelSocket";
import { useZoomPan } from "./useZoomPan";
import { PALETTE, BASE_CELL_SIZE, GRID_HEIGHT, GRID_WIDTH, WS_URL } from "../../shared/utils/palette";
import PixelToolbar from "../pixel/PixelToolbar";
import ColorPalette from "../pixel/ColorPalette";
import styles from "./PixelCanvas.module.css";

const COOLDOWN_SECONDS = 5;

interface ChallengeProblem {
  id: string;
  title: string;
  difficulty: "Easy";
  prompt: string;
  source: string;
  category: string;
  starterCode: string;
  testCode: string;
}

interface PixelCanvasProps {
  isLoggedIn?: boolean;
  setIsLoggedIn?: (value: boolean) => void;
  setPage?: (page: "home" | "login" | "signup" | "board" | "statistics" | "aboutus" | "profile" | "pixels") => void;
}

export default function PixelCanvas({ isLoggedIn = false, setIsLoggedIn, setPage }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pixelBufferRef = useRef<Uint8Array>(new Uint8Array(GRID_WIDTH * GRID_HEIGHT));
  const [selectedColorIndex, setSelectedColorIndex] = useState(1);
  const [cooldown, setCooldown] = useState(0);
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);
  const [isColorPanelOpen, setIsColorPanelOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challenge, setChallenge] = useState<ChallengeProblem | null>(null);
  const [isChallengeLoading, setIsChallengeLoading] = useState(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [challengeCode, setChallengeCode] = useState("");
  const [challengeResult, setChallengeResult] = useState<string | null>(null);
  const [isVerifyingChallenge, setIsVerifyingChallenge] = useState(false);
  const [pendingRecolorCell, setPendingRecolorCell] = useState<{ x: number; y: number } | null>(null);
  const renderRequestRef = useRef<() => void>(() => {});
  const lastChallengeIdRef = useRef<string | null>(null);

  const { scale, offset, handleWheel, handlePointerDown, handlePointerMove, handlePointerUp, screenToGrid } = useZoomPan(canvasRef, {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    baseCellSize: BASE_CELL_SIZE,
  });

  const { status, sendPixel } = usePixelSocket(WS_URL, useCallback((update: PixelUpdateMessage) => {
    if (update.x < 0 || update.x >= GRID_WIDTH || update.y < 0 || update.y >= GRID_HEIGHT) {
      return;
    }
    const index = update.y * GRID_WIDTH + update.x;
    pixelBufferRef.current[index] = update.color;
    renderRequestRef.current();
  }, []));

  const { requestRender } = useCanvas({
    canvasRef,
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    baseCellSize: BASE_CELL_SIZE,
    pixelBufferRef,
    palette: PALETTE,
    scale,
    offset,
    hoverCell,
    selectedColor: PALETTE[selectedColorIndex],
  });

  useEffect(() => {
    renderRequestRef.current = requestRender;
  }, [requestRender]);

  const placePixel = useCallback(
    (x: number, y: number) => {
      const index = y * GRID_WIDTH + x;
      pixelBufferRef.current[index] = selectedColorIndex;
      requestRender();
      sendPixel({ x, y, color: selectedColorIndex });
    },
    [requestRender, sendPixel, selectedColorIndex],
  );

  const fetchChallenge = useCallback(async () => {
    setIsChallengeLoading(true);
    setChallengeError(null);
    setChallengeResult(null);
    setChallengeCode("");

    try {
      const categories = [
        "01-basic-challenges-1",
        "02-basic-challenges-2",
        "03-high-order-array-methods",
        "04-recursion",
        "05-complexity",
        "06-hash-tables-maps-sets",
        "07-stacks-queues-linked-lists",
        "08-binary-trees-graphs",
        "09-sorting-algorithms",
      ];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryResponse = await fetch(`https://api.github.com/repos/PacktPublishing/70-JavaScript-Challenges---Data-Structures-and-Algorithms/contents/${randomCategory}`);
      if (!categoryResponse.ok) {
        throw new Error("Could not load challenge category.");
      }
      const categoryItems = await categoryResponse.json() as Array<{ type: string; path: string; name: string }>;
      const challengeFolders = categoryItems.filter((item) => item.type === "dir");
      const folderPool = challengeFolders.filter((item) => item.path !== lastChallengeIdRef.current);
      const selectedFolder = (folderPool.length > 0 ? folderPool : challengeFolders)[Math.floor(Math.random() * (folderPool.length > 0 ? folderPool.length : challengeFolders.length))];
      if (!selectedFolder) {
        throw new Error("No coding challenge folders found.");
      }

      const challengeFilesResponse = await fetch(`https://api.github.com/repos/PacktPublishing/70-JavaScript-Challenges---Data-Structures-and-Algorithms/contents/${selectedFolder.path}`);
      if (!challengeFilesResponse.ok) {
        throw new Error("Could not load challenge files.");
      }
      const challengeFiles = await challengeFilesResponse.json() as Array<{ name: string; download_url: string | null }>;
      const readmeFile = challengeFiles.find((file) => file.name.toLowerCase() === "readme.md");
      const testFile = challengeFiles.find((file) => file.name.endsWith("-test.js"));
      const starterFile = challengeFiles.find((file) => file.name.endsWith(".js") && !file.name.endsWith("-test.js") && !file.name.endsWith("-run.js") && !file.name.endsWith("-solution.js"));
      if (!readmeFile?.download_url || !testFile?.download_url || !starterFile?.download_url) {
        throw new Error("Challenge format not supported.");
      }

      const [readmeContent, testContent, starterContent] = await Promise.all([
        fetch(readmeFile.download_url).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch challenge statement.");
          return res.text();
        }),
        fetch(testFile.download_url).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch challenge tests.");
          return res.text();
        }),
        fetch(starterFile.download_url).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch starter code.");
          return res.text();
        }),
      ]);

      const prompt = readmeContent
        .replace(/^---[\s\S]*?---/m, "")
        .replace(/#{1,6}\s+/g, "")
        .replace(/`{3}[\s\S]*?`{3}/g, "")
        .trim();

      const mappedChallenge: ChallengeProblem = {
        id: selectedFolder.path,
        title: selectedFolder.name.replace(/^\d+-/, "").replace(/-/g, " "),
        difficulty: "Easy",
        prompt: prompt.slice(0, 1200),
        source: "Packt JS Challenges API (GitHub)",
        category: randomCategory,
        starterCode: starterContent,
        testCode: testContent,
      };

      lastChallengeIdRef.current = selectedFolder.path;
      setChallenge(mappedChallenge);
      setChallengeCode(mappedChallenge.starterCode);
    } catch (error) {
      setChallenge(null);
      setChallengeCode("");
      setChallengeError(error instanceof Error ? error.message : "Could not load challenge.");
    } finally {
      setIsChallengeLoading(false);
    }
  }, []);

  const openRecolorChallenge = useCallback(
    (x: number, y: number) => {
      setPendingRecolorCell({ x, y });
      setIsChallengeModalOpen(true);
      void fetchChallenge();
    },
    [fetchChallenge],
  );

  const closeChallengeModal = useCallback(() => {
    setIsChallengeModalOpen(false);
    setPendingRecolorCell(null);
    setChallengeError(null);
    setChallengeResult(null);
    setChallengeCode("");
    setChallenge(null);
  }, []);

  const confirmSolvedAndRecolor = useCallback(() => {
    if (!challenge) {
      return;
    }
    setIsVerifyingChallenge(true);
    setChallengeResult(null);
    try {
      const loadUserExport = new Function(`
        const module = { exports: {} };
        const exports = module.exports;
        ${challengeCode}
        return module.exports;
      `) as () => unknown;
      const exported = loadUserExport();
      const userFn = typeof exported === "function"
        ? exported
        : (typeof exported === "object" && exported !== null
          ? (Object.values(exported as Record<string, unknown>).find((value) => typeof value === "function") as ((...args: unknown[]) => unknown) | undefined)
          : undefined);
      if (!userFn) {
        throw new Error("No exported function found. Use module.exports = yourFunction.");
      }

      const test = (_name: string, callback: () => void) => callback();
      const expect = (actual: unknown) => ({
        toBe: (expected: unknown) => {
          if (actual !== expected) {
            throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`);
          }
        },
        toEqual: (expected: unknown) => {
          if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`);
          }
        },
      });
      const requireShim = () => userFn;
      const runTests = new Function("test", "expect", "require", challenge.testCode);
      runTests(test, expect, requireShim);
    } catch (error) {
      setIsVerifyingChallenge(false);
      setChallengeResult(error instanceof Error ? `Tests failed: ${error.message}` : "Tests failed.");
      return;
    }
    if (!pendingRecolorCell || cooldown > 0) {
      setIsVerifyingChallenge(false);
      setChallengeResult("You solved it, but recolor is blocked by cooldown.");
      return;
    }
    placePixel(pendingRecolorCell.x, pendingRecolorCell.y);
    setCooldown(COOLDOWN_SECONDS);
    setIsVerifyingChallenge(false);
    setChallengeResult("Correct answer! Pixel recolored.");
    closeChallengeModal();
  }, [challenge, challengeCode, closeChallengeModal, cooldown, pendingRecolorCell, placePixel]);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [cooldown]);

  const onCanvasClick = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (cooldown > 0) {
        return;
      }

      const cell = screenToGrid(event.clientX, event.clientY);
      if (!cell) {
        return;
      }

      if (cell.x < 0 || cell.x >= GRID_WIDTH || cell.y < 0 || cell.y >= GRID_HEIGHT) {
        return;
      }

      const currentColorIndex = pixelBufferRef.current[cell.y * GRID_WIDTH + cell.x];
      const wantsToRecolor = currentColorIndex !== 0 && currentColorIndex !== selectedColorIndex;
      if (wantsToRecolor) {
        openRecolorChallenge(cell.x, cell.y);
        return;
      }

      placePixel(cell.x, cell.y);
      setCooldown(COOLDOWN_SECONDS);
    },
    [cooldown, openRecolorChallenge, placePixel, screenToGrid, selectedColorIndex],
  );

  const onCanvasPointerMove = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      const cell = screenToGrid(event.clientX, event.clientY);
      if (!cell || cell.x < 0 || cell.x >= GRID_WIDTH || cell.y < 0 || cell.y >= GRID_HEIGHT) {
        setHoverCell(null);
        return;
      }
      setHoverCell(cell);
      handlePointerMove(event);
    },
    [handlePointerMove, screenToGrid],
  );

  const onCanvasPointerLeave = useCallback(() => {
    setHoverCell(null);
  }, []);

  const hexToRgb = useCallback((hex: string) => {
    const normalized = hex.replace("#", "");
    const bigint = parseInt(normalized, 16);
    if (normalized.length !== 6 || Number.isNaN(bigint)) {
      return null;
    }
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }, []);

  const colorDistance = useCallback((a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) => {
    return Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2);
  }, []);

  const paletteColors = PALETTE.slice(1);

  const handlePaletteSelect = useCallback((index: number) => {
    setSelectedColorIndex(index + 1);
  }, []);

  const onColorWheelChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedColor = event.target.value;
      const selectedRgb = hexToRgb(selectedColor);
      if (!selectedRgb) {
        return;
      }

      const nextIndex = PALETTE.reduce((best, paletteColor, index) => {
        if (index === 0) {
          return best;
        }
        const paletteRgb = hexToRgb(paletteColor);
        if (!paletteRgb) {
          return best;
        }
        const distance = colorDistance(selectedRgb, paletteRgb);
        if (best.distance === null || distance < best.distance) {
          return { index, distance };
        }
        return best;
      }, { index: 1, distance: null as number | null }).index;

      setSelectedColorIndex(nextIndex);
    },
    [colorDistance, hexToRgb],
  );

  useEffect(() => {
    requestRender();
  }, [requestRender, selectedColorIndex, scale, offset, hoverCell]);

  const onEditorKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();
    const textarea = event.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;
    const tab = "  ";
    const nextValue = `${value.slice(0, selectionStart)}${tab}${value.slice(selectionEnd)}`;
    setChallengeCode(nextValue);

    window.requestAnimationFrame(() => {
      textarea.selectionStart = selectionStart + tab.length;
      textarea.selectionEnd = selectionStart + tab.length;
    });
  }, []);

  const codeLineCount = Math.max(1, challengeCode.split("\n").length);
  const codeCharCount = challengeCode.length;

  return (
    <div className={styles.container}>
      <PixelToolbar
        status={status}
        cooldown={cooldown}
        selectedColor={PALETTE[selectedColorIndex]}
        gridWidth={GRID_WIDTH}
        gridHeight={GRID_HEIGHT}
        hoverCell={hoverCell}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setPage={setPage}
      />

      <div className={styles.canvasArea}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onClick={onCanvasClick}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={onCanvasPointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={onCanvasPointerLeave}
        />
        {isChallengeModalOpen ? (
          <div className={styles.challengeModalOverlay} role="dialog" aria-modal="true" aria-label="Recolor challenge">
            <div className={styles.challengeModal}>
              <div className={styles.challengeHeader}>
                <h3 className={styles.challengeTitle}>Solve to recolor this pixel</h3>
                <button type="button" className={styles.modalClose} onClick={closeChallengeModal} aria-label="Close challenge modal">
                  ×
                </button>
              </div>

              {isChallengeLoading ? <p className={styles.challengeText}>Loading challenge...</p> : null}
              {!isChallengeLoading && challengeError ? <p className={styles.challengeError}>{challengeError}</p> : null}

              {!isChallengeLoading && !challengeError && challenge ? (
                <div className={styles.challengeBody}>
                  <div className={styles.challengeTopRow}>
                    <p className={styles.challengeName}>{challenge.title}</p>
                    <span className={styles.challengeBadge}>{challenge.difficulty}</span>
                  </div>
                  <div className={styles.challengeWorkspace}>
                    <div className={`${styles.challengePanel} ${styles.sidePanel}`}>
                      <p className={styles.challengePanelTitle}>Details</p>
                      <p className={styles.challengePanelText}>Source: {challenge.source}</p>
                      <p className={styles.challengePanelText}>Category: {challenge.category}</p>
                      <p className={styles.challengePanelText}>Write code and export your function with <code>module.exports</code>.</p>
                    </div>
                    <div className={`${styles.challengePanel} ${styles.editorPanel}`}>
                      <div className={styles.editorShell}>
                        <div className={styles.editorTopbar}>
                          <div className={styles.editorDots}>
                            <span className={styles.editorDotRed} />
                            <span className={styles.editorDotYellow} />
                            <span className={styles.editorDotGreen} />
                          </div>
                          <span className={styles.editorFilename}>solution.js</span>
                          <span className={styles.editorMeta}>JavaScript</span>
                        </div>
                        <div className={styles.editorBody}>
                          <div className={styles.editorGutter} aria-hidden="true">
                            {Array.from({ length: codeLineCount }, (_, index) => (
                              <span key={index}>{index + 1}</span>
                            ))}
                          </div>
                          <textarea
                            className={styles.challengeEditor}
                            value={challengeCode}
                            onChange={(event) => setChallengeCode(event.target.value)}
                            onKeyDown={onEditorKeyDown}
                            spellCheck={false}
                            aria-label="Challenge code editor"
                            placeholder="Write your solution and export it with module.exports"
                          />
                        </div>
                        <div className={styles.editorStatusbar}>
                          <span>{codeLineCount} lines</span>
                          <span>{codeCharCount} chars</span>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.challengePanel} ${styles.sidePanel} ${styles.questionPanel}`}>
                      <p className={styles.challengePanelTitle}>Challenge</p>
                      <p className={styles.challengeText}>{challenge.prompt}</p>
                    </div>
                  </div>
                  {challengeResult ? <p className={styles.challengeResult}>{challengeResult}</p> : null}
                </div>
              ) : null}

              <div className={styles.challengeActions}>
                <button type="button" className={styles.challengeButton} onClick={closeChallengeModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.challengeButtonPrimary}
                  onClick={confirmSolvedAndRecolor}
                  disabled={isChallengeLoading || Boolean(challengeError) || !challenge}
                >
                  {isVerifyingChallenge ? "Running tests..." : "Run tests and recolor"}
                </button>
                <button type="button" className={styles.challengeButton} onClick={() => void fetchChallenge()} disabled={isChallengeLoading}>
                  New challenge
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {isColorPanelOpen ? (
          <div className={styles.colorWheelWrapper}>
            <div className={styles.colorPanelHeader}>
              <div className={styles.colorPanelText}>
                <div className={styles.colorPanelTitle}>Color selection</div>
                <div className={styles.colorPanelSubtitle}>Pick from the wheel or any palette swatch</div>
              </div>
              <div className={styles.colorPanelActions}>
                <div
                  className={styles.selectedPreview}
                  style={{ background: PALETTE[selectedColorIndex] }}
                  aria-label={`Selected color ${PALETTE[selectedColorIndex]}`}
                />
                <button
                  type="button"
                  className={styles.colorPanelClose}
                  onClick={() => setIsColorPanelOpen(false)}
                  aria-label="Close color palette"
                >
                  ×
                </button>
              </div>
            </div>

            <div className={styles.colorWheelRow}>
              <input
                type="color"
                aria-label="Pick a color"
                value={PALETTE[selectedColorIndex]}
                onChange={onColorWheelChange}
                className={styles.colorWheel}
              />
            </div>

            <div className={styles.colorMenu}>
              <div className={styles.paletteLabel}>Palette</div>
              <ColorPalette
                colors={paletteColors}
                selectedIndex={selectedColorIndex - 1}
                onSelect={handlePaletteSelect}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.colorButton}
            onClick={() => setIsColorPanelOpen(true)}
          >
            Colors
          </button>
        )}
      </div>
    </div>
  );
}

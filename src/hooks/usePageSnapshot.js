import { useCallback, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Per history entry: a fresh visit starts fresh, Back/Forward restores that visit.
const snapshots = new Map();

export default function usePageSnapshot(name, enabled = true) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const key = `${location.key}:${location.pathname}:${location.search}:${name}`;
  const initial = useRef(enabled && navigationType === "POP" ? snapshots.get(key) : undefined);
  const save = useCallback((value) => {
    if (!enabled) return;
    snapshots.set(key, value);
    if (snapshots.size > 100) snapshots.delete(snapshots.keys().next().value);
  }, [enabled, key]);
  return [initial.current, save];
}

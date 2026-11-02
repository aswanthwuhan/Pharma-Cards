import { useEffect, useRef } from "react";

export const DOUBLE_TAP_MS = 260;

/**
 * Splits taps into single (flip) and double (skip). A single tap fires after DOUBLE_TAP_MS,
 * once no second tap came; a second tap inside that window fires the double action instead.
 */
export function useTaps(onSingle: () => void, onDouble: () => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef({ onSingle, onDouble });
  latest.current = { onSingle, onDouble };
  useEffect(() => () => clearTimeout(timer.current), []);
  return () => {
    if (timer.current !== undefined) {
      clearTimeout(timer.current);
      timer.current = undefined;
      latest.current.onDouble();
      return;
    }
    timer.current = setTimeout(() => {
      timer.current = undefined;
      latest.current.onSingle();
    }, DOUBLE_TAP_MS);
  };
}

/**
 * Text Polishing & Smoothing Layer
 * Cleans raw LaTeX delimiters, unparsed tokens, hidden unicode characters, and rough symbols
 * so responses read as smooth, clean, natural prose like ChatGPT & Gemini.
 */
export function polishText(raw: string): string {
  if (!raw) return "";

  let text = raw;

  // 1. Replace non-breaking hyphens (U+2011) and narrow spaces (U+202F, U+00A0) with standard ASCII
  text = text.replace(/[\u2011\u2012\u2013\u2014]/g, "-");
  text = text.replace(/[\u202F\u00A0\u2000-\u200B]/g, " ");

  // 2. Remove raw LaTeX block delimiters: \[ ... \] and display math $$ ... $$
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => {
    return cleanFormula(formula);
  });
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
    return cleanFormula(formula);
  });

  // 3. Remove inline LaTeX delimiters: \( ... \) and $ ... $
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, formula) => {
    return cleanFormula(formula);
  });

  // 4. Clean residual \text{...}, \mathbf{...}, \mathit{...}
  text = text.replace(/\\text\{([^}]+)\}/g, "$1");
  text = text.replace(/\\mathbf\{([^}]+)\}/g, "$1");
  text = text.replace(/\\mathit\{([^}]+)\}/g, "$1");
  text = text.replace(/\\mathrm\{([^}]+)\}/g, "$1");

  // 5. Clean LaTeX spacing commands: \quad, \qquad, \,, \;, \!
  text = text.replace(/\\[q]?uad/g, " ");
  text = text.replace(/\\[,;!]/g, " ");

  // 6. Convert common LaTeX symbols into clean human symbols
  text = text.replace(/\\times/g, "×");
  text = text.replace(/\\cdot/g, "·");
  text = text.replace(/\\longrightarrow/g, "→");
  text = text.replace(/\\rightarrow/g, "→");
  text = text.replace(/\\Delta/g, "Δ");
  text = text.replace(/\\int_?\{?([^}]*)\}?\^?\{?([^}]*)\}?/g, "Integral");
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");

  // 7. Replace raw <br> tags with clean linebreaks
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // 8. Clean noisy repeated divider lines (e.g. --- ---)
  text = text.replace(/\n\s*---\s*\n/g, "\n\n");

  // 9. Trim excess whitespace
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

function cleanFormula(formula: string): string {
  let cleaned = formula;
  cleaned = cleaned.replace(/\\text\{([^}]+)\}/g, "$1");
  cleaned = cleaned.replace(/\\times/g, " × ");
  cleaned = cleaned.replace(/\\cdot/g, " · ");
  cleaned = cleaned.replace(/\\Delta/g, "Δ");
  cleaned = cleaned.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");
  cleaned = cleaned.replace(/\\[q]?uad/g, " ");
  cleaned = cleaned.replace(/\\[,;!]/g, " ");
  cleaned = cleaned.replace(/[\\]/g, "");
  return cleaned.trim();
}

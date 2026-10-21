import type { ReactNode } from "react";

// A web address, without the punctuation that usually follows it in a sentence.
const URL_PATTERN = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g;

/**
 * Turns the web addresses in a message into links. Everything else stays
 * plain text, so nothing a person types is ever interpreted as markup.
 */
export function linkify(text: string): ReactNode[] {
  return text.split(URL_PATTERN).map((part, index) =>
    // `split` with a capture group puts the matches at the odd positions.
    index % 2 === 1 ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="text-primary underline underline-offset-2 [overflow-wrap:anywhere] hover:opacity-80"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

'use client';

import { sanitizeRichText } from '@/lib/security/sanitize-html';

type RichTextContentProps = {
  html?: string | null;
  className?: string;
};

export function RichTextContent({ html, className = '' }: RichTextContentProps) {
  if (!html) return null;

  const sanitizedHtml = sanitizeRichText(html);

  return (
    <div
      className={`
        prose prose-invert max-w-none
        prose-p:text-zinc-300
        prose-p:leading-relaxed
        prose-strong:text-white
        prose-em:text-zinc-200
        prose-li:text-zinc-300
        prose-ul:list-disc
        prose-ol:list-decimal
        prose-a:text-[#ea580c]
        prose-blockquote:border-[#ea580c]
        prose-blockquote:text-zinc-300
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

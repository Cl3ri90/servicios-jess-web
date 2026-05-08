import DOMPurify from 'isomorphic-dompurify';

export function sanitizeRichText(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'strong',
      'em',
      'ul',
      'ol',
      'li',
      'br',
      'h3',
      'h4',
      'blockquote',
      'a',
      'span',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
}

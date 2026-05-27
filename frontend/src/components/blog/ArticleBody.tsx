interface ArticleBodyProps {
  content: string;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:tracking-tight
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-code:before:content-none prose-code:after:content-none
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
        prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
        prose-img:rounded-2xl prose-img:shadow-lg
        prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
        prose-hr:border-border"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

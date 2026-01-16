export default function Tag({ variant = "neutral", children }) {
  const className = `tag tag--${variant}`;
  return <span className={className}>{children}</span>;
}

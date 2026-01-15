/** Tag component. */

export default function Tag({ variant = "neutral", children }) {
  /** Render tag. */
  const className = `tag tag--${variant}`;
  return <span className={className}>{children}</span>;
}

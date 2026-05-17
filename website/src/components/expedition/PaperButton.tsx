import type {ButtonHTMLAttributes, ReactNode} from 'react';
import Link from '@docusaurus/Link';

type CommonProps = {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
  className?: string;
};

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    to?: undefined;
    href?: undefined;
  };

type AsLink = CommonProps & {
  to?: string;
  href?: string;
};

const baseClasses =
  'group relative inline-flex items-center gap-2 px-6 py-3 font-display italic tracking-tight transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] active:translate-y-[1px] no-underline';

const variantClasses = {
  primary:
    'bg-[var(--ink)] text-[var(--paper)] shadow-[0_2px_0_var(--ink),0_10px_24px_-12px_rgba(15,27,45,0.5)] hover:-translate-y-[2px] hover:text-[var(--paper)]',
  ghost:
    'bg-[var(--card)] text-[var(--ink)] border border-[var(--ink)]/20 shadow-[0_2px_0_rgba(15,27,45,0.15),0_8px_18px_-12px_rgba(15,27,45,0.35)] hover:-translate-y-[2px] hover:text-[var(--ink)]',
};

/**
 * The expedition-grade button. Renders a Docusaurus `<Link>` when given
 * `to` or `href`, otherwise a plain `<button>` with the same skin.
 */
export function PaperButton(props: AsButton | AsLink): ReactNode {
  const {variant = 'primary', children, className = ''} = props;
  const composed = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if ('to' in props && props.to) {
    const {to, ...rest} = props as AsLink;
    return (
      <Link to={to} className={composed} {...(rest as Record<string, unknown>)}>
        <span style={{fontSize: 18}}>{children}</span>
      </Link>
    );
  }
  if ('href' in props && props.href) {
    const {href, ...rest} = props as AsLink;
    return (
      <Link href={href} className={composed} {...(rest as Record<string, unknown>)}>
        <span style={{fontSize: 18}}>{children}</span>
      </Link>
    );
  }
  const {variant: _v, children: _c, className: _cn, ...rest} = props as AsButton;
  return (
    <button {...rest} className={composed}>
      <span style={{fontSize: 18}}>{children}</span>
    </button>
  );
}

export default PaperButton;

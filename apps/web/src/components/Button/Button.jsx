import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) {
  return (
    <button className={`btn btn--${variant} btn--${size}`} type={type} {...props}>
      {children}
    </button>
  );
}
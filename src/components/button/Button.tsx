import React, { ButtonHTMLAttributes, FC } from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンのバリアント（色やスタイル） */
  variant?: ButtonVariant;
  /** ボタンのサイズ */
  size?: ButtonSize;
  /** ローディング状態かどうか */
  isLoading?: boolean;
  /** アイコン要素 */
  icon?: React.ReactNode;
  /** フル幅かどうか */
  fullWidth?: boolean;
}

/**
 * 再利用可能なボタンコンポーネント
 */
const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'button';
  const variantClasses = `button--${variant}`;
  const sizeClasses = `button--${size}`;
  const widthClass = fullWidth ? 'button--full-width' : '';
  const loadingClass = isLoading ? 'button--loading' : '';
  const disabledClass = disabled ? 'button--disabled' : '';

  const buttonClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClass,
    loadingClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <span className="button__loader">Loading...</span>}
      {icon && <span className="button__icon">{icon}</span>}
      {children && <span className="button__text">{children}</span>}
    </button>
  );
};

export default Button;

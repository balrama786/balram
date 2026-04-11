import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SvgIcon } from '../icons'
import { Button } from '@/src/elements/ui/button'
import { SolidButtonProps } from '@/src/types/shared'

export const SolidButton: FC<SolidButtonProps> = ({
  children,
  icon,
  color,
  type,
  className,
  loading,
  disabled,
  onClick,
  title,
  iconClass,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <Button
      {...props}
      onClick={onClick}
      type={type ? type : 'button'}
      color={color ? color : ''}
      disabled={loading || disabled ? true : false}
      className={` ${className ? className : ''} ${loading ? 'btn-loader-disabled' : ''} btn-solid`}
    >
      {loading ? (
        <>
          <div>{title ? t(title) : children}</div>
          <SvgIcon iconId="animate-spin" className="request-animation" />
        </>
      ) : (
        <>
          {icon && <SvgIcon className={`common-svg-btn ${iconClass}`} iconId={icon} />}
          {title ? t(title) : children}
        </>
      )}
    </Button>
  )
}

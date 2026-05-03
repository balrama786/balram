import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('inline-flex items-center justify-center rounded-xl text-sm font-medium transition', {
  variants: {
    variant: { default: 'bg-emerald-600 text-white hover:bg-emerald-700', ghost: 'hover:bg-slate-100 text-slate-700' },
    size: { default: 'h-10 px-4', sm: 'h-8 px-3' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export function Button({ className, variant, size, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

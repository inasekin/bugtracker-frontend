import * as React from 'react';

interface SwitchProps {
	id?: string;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	className?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
	({ id, checked, onCheckedChange, className, ...props }, ref) => {
		return (
			<div className={`inline-flex items-center ${className || ''}`}>
				<label
					className={`relative inline-block w-10 h-5 rounded-full cursor-pointer 
                     ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
					htmlFor={id}
				>
					<input
						type="checkbox"
						id={id}
						className="sr-only peer"
						checked={checked}
						onChange={(e) => onCheckedChange?.(e.target.checked)}
						ref={ref}
						{...props}
					/>
					<span
						className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-all duration-200 
                      ${checked ? 'translate-x-5' : 'translate-x-0'}`}
					/>
				</label>
			</div>
		);
	},
);

Switch.displayName = 'Switch';

export { Switch };

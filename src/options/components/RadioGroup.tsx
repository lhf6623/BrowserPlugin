interface RadioGroupProps {
	label: string;
	name: string;
	value: string;
	onChange: (opt: RadioGroupProps["options"][0]) => void;
	onClick?: (opt: RadioGroupProps["options"][0]) => void;
	options: { label: any; value: any }[];
}
export default function RadioGroup({
	label,
	name,
	value,
	onChange,
	options,
}: RadioGroupProps) {
	return (
		<div className='flex'>
			<p className='flex-shrink-0'>{label}</p>
			<div className='flex flex-wrap gap-4'>
				{options.map((item) => {
					return (
						<div
							key={item.value}
							className='cursor-pointer w-fit flex-shrink-0'
						>
							<input
								className='mr-2px cursor-pointer'
								type='radio'
								name={name}
								id={item.value}
								value={item.value}
								checked={value === item.value}
								onChange={() => onChange(item)}
							/>
							<label
								htmlFor={item.value}
								className='cursor-pointer'
							>
								{item.label}
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}

interface TitleType {
	title: string;
	subtitle?: string;
}
export default function Title({ title, subtitle }: TitleType) {
	return (
		<label className='p-16px relative flex flex-col justify-between'>
			<h1 className='text-24px font-700'>{title}</h1>
			{subtitle && (
				<p className='text-14px font-400 text-#888888 mt-8px'>{subtitle}</p>
			)}
		</label>
	);
}

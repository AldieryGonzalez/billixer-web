import type { MetaFunction } from '@remix-run/node';
import Navbar from '~/components/navbar/navbar';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Billixer' },
		{ name: 'description', content: 'App for splitting checks and bills' },
	];
};

export default function Index() {
	return (
		<div className='font-sans p-4'>
			<Navbar />
      <h1 className='text-3xl text-center'>Billixer</h1>
		</div>
	);
}

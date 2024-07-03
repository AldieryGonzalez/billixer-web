export default function Navbar() {
    return (
        <header className='flex justify-end items-center relative'>
				<h1 className='text-3xl absolute left-1/2 -translate-x-1/2'>Billixer</h1>
				<nav>
					<ul className='flex space-x-4'>
						<li>
							<a
								className='text-blue-700 underline visited:text-purple-900'
								href='/'>
								Login
							</a>
						</li>
						<li>
							<a
								className='text-blue-700 underline visited:text-purple-900'
								href='/about'>
								Sign Up
							</a>
						</li>
					</ul>
				</nav>
			</header>
    )
}
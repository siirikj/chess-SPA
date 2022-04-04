import { useEffect, useState } from 'react'

const App = () => {
	const [showButton, setShowButton] = useState(false)

	const showButtonClickHandler = () => {
		setShowButton(!showButton)
	}

	const personer = [
		{
			name: 'Rasmus',
			age: 24,
		},
		{
			name: 'Anna',
			age: 26,
		},
		{
			name: 'Siri',
			age: 21,
		},
	]

	return (
		<div>
			<div className="bg-red-500 w-screen h-screen flex justify-center items-center">
				<div className="w-[300px] h-[200px] bg-white flex justify-center items-center">
					{showButton && <p>Visar knappen</p>}

					{console.log('2')}

					<div className="flex flex-col">
						{personer.map((person) => (
							<div className="py-1" key={person.name}>
								<p>Namn: {person.name}</p>
								<p>Ålder: {person.age}</p>
							</div>
						))}
					</div>

					{/* <button
						onClick={showButtonClickHandler}
						className="bg-slate-400 px-3 py-3"
					>
						Ändra visability
					</button> */}
				</div>
			</div>
		</div>
	)
}

export default App

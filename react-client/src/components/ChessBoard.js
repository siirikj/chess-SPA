// import ChessSquare from './utils/chessSquare'

import { useState } from 'react'

//    a b c d e f g h
// 8  w b w b w b w b
// 7  b w b w b w b w
// 6
// 5
// 4
// 3
// 2
// 1

const Square = ({ color, boardNumber, boardLetter }) => {
	let colorCode = 'bg-rose-600'
	if (color === 'white') {
		colorCode = 'bg-gray-100'
	} else if (color === 'black') {
		colorCode = 'bg-gray-800'
	}
	return (
		<div
			key={boardNumber + boardLetter}
			piceOnTop="empty"
			className={colorCode}
		>
			{/* {piceOnTop && <img src={piceOnTop} />} */}
			{boardLetter}
			{boardNumber}
		</div>
	)
}

const ChessBoard = () => {
	const boardNumbers = ['8', '7', '6', '5', '4', '3', '2', '1']
	const boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	let color = 'black'

	// const [color, setColor] = useState('white')

	return (
		<div className="flex flex-col">
			{boardNumbers.map((boardNumber, rowIdx) => (
				<div className="flex" key={boardNumber}>
					{boardLetters.map((boardLetter, colIdx) => {
						// const currentColor = color
						// const nextColor = color === 'white' ? 'black' : 'white'
						// setColor(nextColor)

						// const startColor = rowIdx % 2 === 0 ? "white" : "black"

						// const currentColor = startColor === "black" :
						if (color === 'white') {
							color = 'black'
						} else if (color === 'black') {
							color = 'white'
						}

						return (
							<Square
								color={color}
								boardNumber={boardNumber}
								boardLetter={boardLetter}
							/>
						)
					})}
				</div>
			))}
		</div>
	)
}

export default ChessBoard

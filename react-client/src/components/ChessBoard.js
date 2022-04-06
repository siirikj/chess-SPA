// import ChessSquare from './utils/chessSquare'

import { useEffect, useState } from 'react'

//    a b c d e f g h
// 8  w b w b w b w b
// 7  b w b w b w b w
// 6
// 5
// 4
// 3
// 2
// 1

// Komponent för varje shackruta
const Square = ({
	color,
	boardNumber,
	boardLetter,
	piceOnTop,
	unicodePic,
	piecesLocation,
	setPiecesLocation,
	selectedSquare,
	setSelectedSquare,
}) => {
	let colorCode = 'bg-rose-600'

	//console.log('SelectedSquare Number:' + selectedSquare.number)
	//console.log('SelectedSquare Letter:' + selectedSquare.letter)
	/*console.log('boardNumber ' + boardNumber)
	console.log('boardLetter ' + boardLetter)*/
	if (
		selectedSquare.number === parseInt(boardNumber) &&
		selectedSquare.letter === boardLetter
	) {
		colorCode = 'bg-green-500'
	} else if (color === 'white') {
		colorCode = 'bg-sky-50'
	} else if (color === 'black') {
		colorCode = 'bg-sky-800'
	}

	return (
		<div
			key={boardNumber + boardLetter}
			piceOnTop="empty"
			className={`${colorCode} w-[12.5%] text-5xl`}
			onClick={() => {
				console.log('Klickat på mig ' + boardNumber + boardLetter)

				// TODO: check if current player
				// If no square is selected AND this is current players chessPice, select the square
				if (selectedSquare.number === null && selectedSquare.letter === null) {
					let newSelectedSquare = {
						number: parseInt(boardNumber),
						letter: boardLetter,
					}
					console.log(newSelectedSquare)
					/* console.log(
						'New selsected square: ' + JSON.stringify(newSelectedSquare, null, 2)
					) */
					setSelectedSquare(newSelectedSquare)
				} else if (
					// If selected same square as previously, stop selecting it
					selectedSquare.number === parseInt(boardNumber) &&
					selectedSquare.letter === boardLetter
				) {
					let newSelectedSquare = {
						number: null,
						letter: null,
					}
					console.log(newSelectedSquare)
					setSelectedSquare(newSelectedSquare)
				} else {
					// See if the new square is a legal move and uppdate
					//TODO
					console.log('Logic for moving a pice here')
				}

				/* console.log(selectedSquare.number)
				console.log(boardNumber)
				console.log(selectedSquare.number === parseInt(boardNumber)) */
				console.log(selectedSquare.letter)
				console.log(boardLetter)
				console.log(selectedSquare.letter === boardLetter)

				//let uppdatedPiecesLocation = Object.assign({}, piecesLocation)
				let uppdatedPiecesLocation = { ...piecesLocation }

				//if(selectedSquare = null ) => uppdate

				/* console.log(
					'För uppdatering ' +
						uppdatedPiecesLocation.black.pawn1.position.number
				) */

				uppdatedPiecesLocation.black.pawn1.position.number =
					9 - parseInt(boardNumber)

				/* console.log(
					'Efter uppdatering ' +
						uppdatedPiecesLocation.black.pawn1.position.number
				)
				console.log(
					'Efter uppdatering gammal ' +
						piecesLocation.black.pawn1.position.number
				) */
				uppdatedPiecesLocation.black.pawn1.position.letter = boardLetter
				setPiecesLocation(uppdatedPiecesLocation)
			}}
		>
			<div className="pt-[100%] h-0 relative">
				<div className="absolute bottom-0 w-full h-full flex justify-center items-center font-bold ">
					{unicodePic}
					{/* {piceOnTop} */}
					{/* boardLetter */}
					{/* boardNumber */}
				</div>
			</div>
		</div>
	)
}

// Matchar positonen på en pjäs till schakrutan
const matchedPawn = (
	pawnColor,
	picesNames,
	piecesLocation,
	rowIdx,
	colIdx,
	boardLetters,
	piecesUnicodes
) => {
	let tempCheessPiece = ''
	let unicodePic = ''
	picesNames.forEach((chessPiece) => {
		// console.log('black ' + chessPiece)
		// console.log(
		// 	'Chess Pice row: ' +
		// 		piecesLocation.black[chessPiece].position.number +
		// 		'   Board row: ' +
		// 		rowIdx
		// )
		// console.log(
		// 	'Chess Pice letter: ' +
		// 		piecesLocation.black[chessPiece].position.letter +
		// 		'   Board letter: ' +
		// 		boardLetters[colIdx]
		// )
		if (
			piecesLocation[pawnColor][chessPiece].position.number === rowIdx + 1 &&
			piecesLocation[pawnColor][chessPiece].position.letter ===
				boardLetters[colIdx]
		) {
			// console.log('MATHCED! :DD ' + chessPiece + '' + picesNames)
			tempCheessPiece = chessPiece
			unicodePic = piecesUnicodes[pawnColor][chessPiece.replace(/\d+$/, '')]
		}
	})

	return [tempCheessPiece, unicodePic]
}

// Skapar shackbrädet
const ChessBoard = ({
	piecesLocation,
	setPiecesLocation,
	piecesUnicodes,
	activePlayer,
	setActivePlayer,
	selectedSquare,
	setSelectedSquare,
	squareClickHandler,
}) => {
	const boardNumbers = ['8', '7', '6', '5', '4', '3', '2', '1']
	const boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	let color = 'white'
	let piceOnTop = ''
	let unicodePic = ''

	useEffect(() => {
		// console.log(piecesLocation)
	}, [piecesLocation])

	return (
		<div className="flex flex-col w-[80%] mx-auto bg-red-500 border-4 border-slate-700">
			{boardNumbers.map((boardNumber, rowIdx) => (
				<div className="flex" key={boardNumber}>
					{boardLetters.map((boardLetter, colIdx) => {
						// Alternate color of the square
						if (!(colIdx === 0)) {
							if (color === 'white') {
								color = 'black'
							} else if (color === 'black') {
								color = 'white'
							}
						}

						// Check if a chess pices position matches the current square
						piceOnTop = ''
						const blackPieces = Object.keys(piecesLocation.black)
						const whitePieces = Object.keys(piecesLocation.white)

						let pawnInfo = matchedPawn(
							'black',
							blackPieces,
							piecesLocation,
							rowIdx,
							colIdx,
							boardLetters,
							piecesUnicodes
						)
						piceOnTop = pawnInfo[0]
						unicodePic = pawnInfo[1]

						if (piceOnTop === '') {
							pawnInfo = matchedPawn(
								'white',
								whitePieces,
								piecesLocation,
								rowIdx,
								colIdx,
								boardLetters,
								piecesUnicodes
							)
							piceOnTop = pawnInfo[0]
							unicodePic = pawnInfo[1]
						}
						// console.log('Unicode for pawn: ' + unicodePic)

						// Create the  square, with or witouth a piece on top
						return (
							<Square
								color={color}
								boardNumber={boardNumber}
								boardLetter={boardLetter}
								piceOnTop={piceOnTop}
								unicodePic={unicodePic}
								piecesLocation={piecesLocation}
								setPiecesLocation={setPiecesLocation}
								selectedSquare={selectedSquare}
								setSelectedSquare={setSelectedSquare}
							/>
						)
					})}
				</div>
			))}
		</div>
	)
}

/* const [personer, setPersoner] = useState([
		{
			name: 'Rasmus',
			age: 24,
		},
		{
			name: 'Siri',
			age: 21,
		},
	])

	const ökaÅlder = () => {
		const yngrePersoner = [...personer]

		const äldrePersoner = yngrePersoner.map((person) => ({
			...person,
			age: person.age + 1,
		}))

		console.log(yngrePersoner)
		console.log(äldrePersoner)

		setPersoner(äldrePersoner)
	} */

export default ChessBoard

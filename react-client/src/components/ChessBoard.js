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
	activePlayer,
	setActivePlayer,
}) => {
	let colorCode = 'bg-rose-600'
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
			piceOnTop=""
			className={`${colorCode} w-[12.5%] text-5xl`}
			onClick={() => {
				console.log('Klickat på mig ' + boardNumber + boardLetter)
				let activePlayerLetter = ''

				// If no square is selected AND this is current players chessPiece, select the square
				if (activePlayer === 'white') {
					activePlayerLetter = 'W'
				} else if (activePlayer === 'black') {
					activePlayerLetter = 'B'
				}

				if (
					selectedSquare.number === null &&
					selectedSquare.letter === null &&
					piceOnTop[0] === activePlayerLetter
				) {
					let newSelectedSquare = {
						number: parseInt(boardNumber),
						letter: boardLetter,
						chessPiece: piceOnTop,
					}
					setSelectedSquare(newSelectedSquare)
				} else if (
					// If selected same square as previously, stop selecting it
					selectedSquare.number === parseInt(boardNumber) &&
					selectedSquare.letter === boardLetter
				) {
					stopSelectingSquare(setSelectedSquare)
				} else if (
					selectedSquare.number !== null &&
					selectedSquare.letter !== null
				) {
					if (
						legalMove(
							selectedSquare.chessPiece.substring(1),
							piecesLocation,
							activePlayer,
							boardNumber,
							boardLetter,
							piceOnTop
						) &&
						piceOnTop[0] !== activePlayerLetter
					) {
						console.log('Legal move')
						if (piceOnTop === '') {
							console.log('No one is standing here! I will move :)')
							moveChessPiece(
								selectedSquare,
								piecesLocation,
								setPiecesLocation,
								activePlayer,
								boardNumber,
								boardLetter
							)
							setActivePlayer(activePlayer === 'black' ? 'white' : 'black')
							stopSelectingSquare(setSelectedSquare)
						} else if (piceOnTop[0] !== activePlayerLetter) {
							// TODO: remove opposits players chess piece from the game
							const deadChessPiece = piceOnTop.substring(1)
							const opponentColor = activePlayer === 'black' ? 'white' : 'black'
							console.log(deadChessPiece)
							console.log(opponentColor)
							let uppdatedPiecesLocation = { ...piecesLocation }
							uppdatedPiecesLocation[opponentColor][
								deadChessPiece
							].alive = false
							setPiecesLocation(uppdatedPiecesLocation)
							// TODO: What if it's the king? Win-scenario

							moveChessPiece(
								selectedSquare,
								piecesLocation,
								setPiecesLocation,
								activePlayer,
								boardNumber,
								boardLetter
							)
							setActivePlayer(activePlayer === 'black' ? 'white' : 'black')
							stopSelectingSquare(setSelectedSquare)
						}
					}
				}
			}}
		>
			<div className="pt-[100%] h-0 relative">
				<div className="absolute bottom-0 w-full h-full flex justify-center items-center font-bold ">
					{unicodePic}
					{/* piceOnTop */}
					{/* boardLetter */}
					{/* boardNumber */}
				</div>
			</div>
		</div>
	)
}

//---------------------------------------------- Helper functions
const moveChessPiece = (
	selectedSquare,
	piecesLocation,
	setPiecesLocation,
	activePlayer,
	boardNumber,
	boardLetter
) => {
	const chessPiece = selectedSquare.chessPiece.substring(1)
	console.log(chessPiece)

	let uppdatedPiecesLocation = { ...piecesLocation }
	uppdatedPiecesLocation[activePlayer][chessPiece].position.number =
		9 - parseInt(boardNumber)
	uppdatedPiecesLocation[activePlayer][chessPiece].position.letter = boardLetter
	setPiecesLocation(uppdatedPiecesLocation)
}
const stopSelectingSquare = (setSelectedSquare) => {
	let newSelectedSquare = {
		number: null,
		letter: null,
		chessPiece: null,
	}
	setSelectedSquare(newSelectedSquare)
}
const legalMove = (
	chessPiece,
	piecesLocation,
	activePlayer,
	boardNumber,
	boardLetter,
	piceOnTop
) => {
	console.log('Checking if leagal move for: ' + chessPiece)
	const currentNumber = piecesLocation[activePlayer][chessPiece].position.number
	const currentLetter = piecesLocation[activePlayer][chessPiece].position.letter
	const newNumber = 9 - boardNumber
	const newLetter = boardLetter
	const boardNumbers = [8, 7, 6, 5, 4, 3, 2, 1]
	const boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	const distanceNumbers =
		boardNumbers.indexOf(currentNumber) - boardNumbers.indexOf(newNumber)

	const distanceLetters =
		boardLetters.indexOf(currentLetter) - boardLetters.indexOf(newLetter)

	console.log('Current letter: ' + currentLetter)
	console.log('Current number: ' + currentNumber)
	console.log('New letter: ' + newLetter)
	console.log('New number: ' + newNumber)
	console.log('indexOf current number: ' + boardNumbers.indexOf(currentNumber))
	console.log('indexOf new number: ' + boardNumbers.indexOf(newNumber))
	console.log('Distance number: ' + distanceNumbers)
	console.log('Distance letters: ' + distanceLetters)
	const noNumberChessPiece = chessPiece.replace(/\d+$/, '')
	//TODO: all of this
	if (chessPiece === 'king') {
		if (Math.abs(distanceNumbers) > 1 || Math.abs(distanceLetters) > 1) {
			console.log('False kinge move!')
			return false
		}
	} else if (noNumberChessPiece === 'queen') {
		if (
			Math.abs(distanceNumbers) > 0 &&
			Math.abs(distanceLetters) > 0 &&
			!(Math.abs(distanceNumbers) === Math.abs(distanceLetters))
		) {
			console.log('False queen move!')
			return false
		} else {
			//TODO: 3 check if someone is on path betwen
		}
	} else if (noNumberChessPiece === 'pawn') {
		// TODO: cant walk backwards. lägg till ingen pejäs på sitt move
		// does this work??? - yes if we implement can't go backwards specific for player color, since a there are no square more then 2 steps after moving across the plane
		if (
			(currentNumber === 2 || currentNumber === 7) &&
			Math.abs(distanceNumbers) <= 2 &&
			Math.abs(distanceLetters) === 0 &&
			piceOnTop === ''
		) {
			console.log('OK first pawn move!')
			return true
		} else if (
			Math.abs(distanceNumbers) <= 1 &&
			Math.abs(distanceLetters) <= 1 &&
			piceOnTop === ''
		) {
			console.log('Correct pawn move, too many steps forward!')
			return true
		} else if (Math.abs(distanceLetters) === 1 && piceOnTop === '') {
			console.log('False pawn move, tried to capture empty square!')
			return false
		}
		//TODO 4
	} else if (noNumberChessPiece === 'rook') {
		if (Math.abs(distanceNumbers) > 0 && Math.abs(distanceLetters) > 0) {
			console.log('False rook move!')
			return false
		} else {
			//TODO 1: Check is someone is in between you!
		}
	} else if (noNumberChessPiece === 'bishop') {
		if (!(Math.abs(distanceNumbers) === Math.abs(distanceLetters))) {
			console.log('False bishop move!')
			return false
		} else {
			//TODO 2: Check is someone is in between you!
		}
	} else if (noNumberChessPiece === 'knight') {
		if (
			!(
				(Math.abs(distanceNumbers) === 1 && Math.abs(distanceLetters) === 2) ||
				(Math.abs(distanceNumbers) === 2 && Math.abs(distanceLetters) === 1)
			)
		) {
			console.log('False knight move!')
			return false
		}
	}
	console.log('Returning true move!')
	return true
}
//----------------------------------------------

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
	// TODO: if  not alvie, don't render chess piece
	let tempCheessPiece = ''
	let unicodePic = ''
	picesNames.forEach((chessPiece) => {
		if (
			piecesLocation[pawnColor][chessPiece].position.number === rowIdx + 1 &&
			piecesLocation[pawnColor][chessPiece].position.letter ===
				boardLetters[colIdx] &&
			piecesLocation[pawnColor][chessPiece].alive === true
		) {
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
						unicodePic = ''
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
						if (pawnInfo[0] !== '') {
							piceOnTop = 'B' + pawnInfo[0]
							unicodePic = pawnInfo[1]
						}

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
							if (pawnInfo[0] !== '') {
								piceOnTop = 'W' + pawnInfo[0]
								unicodePic = pawnInfo[1]
							}
						}

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
								activePlayer={activePlayer}
								setActivePlayer={setActivePlayer}
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

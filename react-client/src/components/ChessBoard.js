// import ChessSquare from './utils/chessSquare'

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
		<button
			key={boardNumber + boardLetter}
			piceOnTop=""
			className={`${colorCode} w-[12.5%] text-5xl hover:opacity-60`}
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
					// If selected new square, check if its a legal move and then update game board accordingly
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
							stopSelectingSquare(setSelectedSquare)
						} else if (piceOnTop[0] !== activePlayerLetter) {
							const deadChessPiece = piceOnTop.substring(1)
							const opponentColor = activePlayer === 'black' ? 'white' : 'black'
							console.log(deadChessPiece)
							console.log(opponentColor)
							let uppdatedPiecesLocation = { ...piecesLocation }
							uppdatedPiecesLocation[opponentColor][
								deadChessPiece
							].alive = false
							// TODO: What if it's the king? Win-scenario

							moveChessPiece(
								selectedSquare,
								piecesLocation,
								setPiecesLocation,
								activePlayer,
								boardNumber,
								boardLetter
							)
							stopSelectingSquare(setSelectedSquare)
						}
					}
					// If not legal move, don't do anything
				}
			}}
		>
			<div className="pt-[100%] h-0 relative">
				<div className="absolute bottom-0 w-full h-full flex justify-center items-center font-bold ">
					{unicodePic}
				</div>
			</div>
		</button>
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
	//TODO: setActivePlayerHandler change to handler AND make sure this also changes color
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
	// Variabled
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
	const noNumberChessPiece = chessPiece.replace(/\d+$/, '')
	// Cheking if game rules are followed
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
			if (currentNumber === newNumber || currentLetter === newLetter) {
				const noPiecesBetweenHorizontalVertical =
					checkForChessPieceBetweenHorizontalVertical(
						piecesLocation,
						currentNumber,
						currentLetter,
						distanceNumbers,
						distanceLetters
					)
				if (!noPiecesBetweenHorizontalVertical) {
					console.log('False queen move! There is someone blocking your path')
					return false
				}
			} else {
				const noPiecesBetweenDiagonal = checkForChessPieceBetweenDiagonal(
					piecesLocation,
					currentNumber,
					currentLetter,
					distanceNumbers,
					distanceLetters
				)
				if (!noPiecesBetweenDiagonal) {
					console.log('False bishop move! There is someone blocking your path')
					return false
				}
			}
		}
	} else if (noNumberChessPiece === 'pawn') {
		if (activePlayer === 'black') {
			if (currentNumber > newNumber) {
				console.log('Pawn cannot walk backwards')
				return false
			}
		} else {
			if (currentNumber < newNumber) {
				console.log('Pawn cannot walk backwards')
				return false
			}
		}
		if (
			(currentNumber === 2 || currentNumber === 7) &&
			Math.abs(distanceNumbers) <= 2 &&
			Math.abs(distanceLetters) === 0 &&
			piceOnTop === ''
		) {
			console.log('OK first pawn move!')
			return true
		} else if (piceOnTop !== '') {
			if (Math.abs(distanceLetters) === 1 && Math.abs(distanceNumbers) === 1) {
				console.log('OK pawn move, capture the enemy!')
				return true
			} else {
				console.log('False pawn move! Not valid way to capture the enemy!')
				return false
			}
		} else if (
			Math.abs(distanceLetters) !== 0 ||
			Math.abs(distanceNumbers) > 1
		) {
			console.log('False pawn move! Cannot walk this far')
			return false
		}
	} else if (noNumberChessPiece === 'rook') {
		if (Math.abs(distanceNumbers) > 0 && Math.abs(distanceLetters) > 0) {
			console.log('False rook move!')
			return false
		} else {
			const noPiecesBetweenHorizontalVertical =
				checkForChessPieceBetweenHorizontalVertical(
					piecesLocation,
					currentNumber,
					currentLetter,
					distanceNumbers,
					distanceLetters
				)
			if (!noPiecesBetweenHorizontalVertical) {
				console.log('False rook move! There is someone blocking your path')
				return false
			}
		}
	} else if (noNumberChessPiece === 'bishop') {
		if (!(Math.abs(distanceNumbers) === Math.abs(distanceLetters))) {
			console.log('False bishop move!')
			return false
		} else {
			const noPiecesBetweenDiagonal = checkForChessPieceBetweenDiagonal(
				piecesLocation,
				currentNumber,
				currentLetter,
				distanceNumbers,
				distanceLetters
			)
			if (!noPiecesBetweenDiagonal) {
				console.log('False bishop move! There is someone blocking your path')
				return false
			}
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
	return true
}

const checkForChessPieceBetweenDiagonal = (
	piecesLocation,
	currentNumber,
	currentLetter,
	distanceNumbers,
	distanceLetters
) => {
	const blackPieces = Object.keys(piecesLocation.black)
	const boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	const currentLetterIndex = boardLetters.indexOf(currentLetter)
	let returnValue = true
	// 1 if up, -1 if down
	const upOrDown = distanceNumbers > 0 ? 1 : -1
	const absOrNot =
		distanceNumbers > 0 ? distanceNumbers : Math.abs(distanceNumbers)
	// -1 if left, 1 if right
	const rightOrLeft = distanceLetters > 0 ? -1 : 1
	console.log('UPP/DOWN')
	blackPieces.forEach((chessPiece) => {
		for (let i = 1; i < absOrNot; i++) {
			if (
				piecesLocation.black[chessPiece].position.number ===
					currentNumber + i * upOrDown &&
				piecesLocation.black[chessPiece].position.letter ===
					boardLetters[currentLetterIndex + i * rightOrLeft]
			) {
				returnValue = false
			}
		}
		for (let i = 1; i < absOrNot; i++) {
			if (
				piecesLocation.white[chessPiece].position.number ===
					currentNumber + i * upOrDown &&
				piecesLocation.white[chessPiece].position.letter ===
					boardLetters[currentLetterIndex + i * rightOrLeft]
			) {
				returnValue = false
			}
		}
	})
	return returnValue
}

const checkForChessPieceBetweenHorizontalVertical = (
	piecesLocation,
	currentNumber,
	currentLetter,
	distanceNumbers,
	distanceLetters
) => {
	const blackPieces = Object.keys(piecesLocation.black)
	const boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	const currentLetterIndex = boardLetters.indexOf(currentLetter)
	let returnValue = true
	// 1 if up, -1 if down
	let upOrDown = distanceNumbers > 0 ? 1 : -1
	let absOrNotVertical =
		distanceNumbers > 0 ? distanceNumbers : Math.abs(distanceNumbers)
	// -1 if left, 1 if right
	let rightOrLeft = distanceLetters > 0 ? -1 : 1
	let absOrNotHorizontal =
		distanceLetters > 0 ? distanceLetters : Math.abs(distanceLetters)

	let stopValueLoop =
		distanceLetters === 0 ? absOrNotVertical : absOrNotHorizontal
	console.log('HORIZONTAL/VERTICAL')
	blackPieces.forEach((chessPiece) => {
		for (let i = 1; i < stopValueLoop; i++) {
			const matchThisNumber =
				distanceNumbers === 0 ? currentNumber : currentNumber + i * upOrDown
			const matchThisLetter =
				distanceLetters === 0
					? currentLetter
					: boardLetters[currentLetterIndex + i * rightOrLeft]
			if (
				piecesLocation.black[chessPiece].position.number === matchThisNumber &&
				piecesLocation.black[chessPiece].position.letter === matchThisLetter
			) {
				returnValue = false
			}
		}
		for (let i = 1; i < stopValueLoop; i++) {
			const matchThisNumber =
				distanceNumbers === 0 ? currentNumber : currentNumber + i * upOrDown
			const matchThisLetter =
				distanceLetters === 0
					? currentLetter
					: boardLetters[currentLetterIndex + i * rightOrLeft]
			if (
				piecesLocation.white[chessPiece].position.number === matchThisNumber &&
				piecesLocation.white[chessPiece].position.letter === matchThisLetter
			) {
				returnValue = false
			}
		}
	})
	return returnValue
}
//----------------------------------------------

// Matchar positonen på en pjäs till schakrutan
const matchedPawn = (
	pawnColor,
	piecesNames,
	piecesLocation,
	rowIdx,
	colIdx,
	boardLetters,
	piecesUnicodes
) => {
	let tempCheessPiece = ''
	let unicodePic = ''
	piecesNames.forEach((chessPiece) => {
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
	selectedSquare,
	setSelectedSquare,
	winner,
	setWinner,
}) => {
	const boardNumbers = ['8', '7', '6', '5', '4', '3', '2', '1']
	const boardLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	let color = 'white'
	let piceOnTop = ''
	let unicodePic = ''

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
							/>
						)
					})}
				</div>
			))}
		</div>
	)
}

export default ChessBoard

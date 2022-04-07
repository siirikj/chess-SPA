import ChessBoard from './../components/ChessBoard.js'
import { useState } from 'react'
import {
	initPiecesLocation,
	piecesUnicodes,
	initSelectedSquare,
} from '../utils/chess/chessPieces'

const ChessGame = () => {
	const [piecesLocation, setPiecesLocation] = useState(initPiecesLocation)
	const [activePlayer, setActivePlayer] = useState('white')
	const [selectedSquare, setSelectedSquare] = useState(initSelectedSquare)
	const [winner, setWinner] = useState(null)

	// TODO: Ta bort denna och ersätt med Temp-komponenten
	// TODO: Änvänd ES-linting
	// TODO: passiv sessioninvlaidering timeout
	//

	return (
		<div>
			<h1>ChessGame</h1>
			<ChessBoard
				piecesLocation={piecesLocation}
				setPiecesLocation={setPiecesLocation}
				piecesUnicodes={piecesUnicodes}
				activePlayer={activePlayer}
				setActivePlayer={setActivePlayer}
				selectedSquare={selectedSquare}
				setSelectedSquare={setSelectedSquare}
				winner={winner}
				setWinner={setWinner}
			/>
		</div>
	)
}

export default ChessGame

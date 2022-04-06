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

	const squareClickHandler = (selectedSquare) => {
		setSelectedSquare(selectedSquare)
	}

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
				squareClickHandler={squareClickHandler}
			/>
		</div>
	)
}

export default ChessGame

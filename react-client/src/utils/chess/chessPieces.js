class Position {
	constructor(letter, number) {
		this.letter = letter
		this.number = number
	}
	//get letter() {
	//	return this.letter()
	//}
	//get number() {
	//	return this.number()
	//}
}
export const initSelectedSquare = {
	number: null,
	letter: null,
}

export const piecesUnicodes = {
	white: {
		king: '\u2654',
		queen: '\u2655',
		pawn: '\u2659',
		rook: '\u2656',
		bishop: '\u2657',
		knight: '\u2658',
	},
	black: {
		king: '\u265A',
		queen: '\u265B',
		pawn: '\u265F',
		rook: '\u265C',
		bishop: '\u265D',
		knight: '\u265E',
	},
}

export const initPiecesLocation = {
	white: {
		king: {
			position: new Position('e', 1),
			alive: true,
		},
		queen: {
			position: new Position('d', 1),
			alive: true,
		},
		rook1: {
			position: new Position('a', 1),
			alive: true,
		},
		rook2: {
			position: new Position('h', 1),
			alive: true,
		},
		bishop1: {
			position: new Position('c', 1),
			alive: true,
		},
		bishop2: {
			position: new Position('f', 1),
			alive: true,
		},
		knight1: {
			position: new Position('b', 1),
			alive: true,
		},
		knight2: {
			position: new Position('g', 1),
			alive: true,
		},

		pawn1: {
			position: new Position('a', 2),
			alive: true,
		},
		pawn2: {
			position: new Position('b', 2),
			alive: true,
		},
		pawn3: {
			position: new Position('c', 2),
			alive: true,
		},
		pawn4: {
			position: new Position('d', 2),
			alive: true,
		},
		pawn5: {
			position: new Position('e', 2),
			alive: true,
		},
		pawn6: {
			position: new Position('f', 2),
			alive: true,
		},
		pawn7: {
			position: new Position('g', 2),
			alive: true,
		},
		pawn8: {
			position: new Position('h', 2),
			alive: true,
		},
	},
	black: {
		king: {
			position: new Position('e', 8),
			alive: true,
		},
		queen: {
			position: new Position('d', 8),
			alive: true,
		},
		rook1: {
			position: new Position('a', 8),
			alive: true,
		},
		rook2: {
			position: new Position('h', 8),
			alive: true,
		},
		bishop1: {
			position: new Position('c', 8),
			alive: true,
		},
		bishop2: {
			position: new Position('f', 8),
			alive: true,
		},
		knight1: {
			position: new Position('b', 8),
			alive: true,
		},
		knight2: {
			position: new Position('g', 8),
			alive: true,
		},

		pawn1: {
			position: new Position('a', 7),
			alive: true,
		},
		pawn2: {
			position: new Position('b', 7),
			alive: true,
		},
		pawn3: {
			position: new Position('c', 7),
			alive: true,
		},
		pawn4: {
			position: new Position('d', 7),
			alive: true,
		},
		pawn5: {
			position: new Position('e', 7),
			alive: true,
		},
		pawn6: {
			position: new Position('f', 7),
			alive: true,
		},
		pawn7: {
			position: new Position('g', 7),
			alive: true,
		},
		pawn8: {
			position: new Position('h', 7),
			alive: true,
		},
	},
}

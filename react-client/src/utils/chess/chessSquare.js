class ChessSquare {
	constructor(position, color, piceOnTop) {
		this.position = position
		this.color = color
		this.piceOnTop = null
	}
	get position() {
		return this.position()
	}
	get color() {
		return this.color()
	}
	get piceOnTop() {
		return this.piceOnTop()
	}
}

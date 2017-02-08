/// the danmaku base class
export class Danmaku {

	constructor(renderer, content, style = {}) {
		// basic
		this.renderer = renderer
		this.content = content

		// style
		this.style = Object.assign({}, this.renderer.style, style)

		// get size
		this.renderer.canvas.font = this.style.fontSize + "px Roboto, Microsoft YaHei, 黑体, 宋体, sans-serif"
		this.renderer.canvas.textAlign = "left"
		this.renderer.canvas.textBaseline = "top"
		let textMeasure = this.renderer.canvas.measureText(this.content)
		this.height = this.style.fontSize
		this.width = textMeasure.width

		// init
		this.age = 0
		this._initLayout()
	}

	/// step into next frame
	step(time) {
		this.age += time
		if (this.age > this.style.time) {
			this.renderer.danmakuPool.delete(this)
		}
	}

	/// render danmaku into renderer
	render() {
		this.renderer.canvas.fillStyle = this.style.color
		this.renderer.canvas.strokeStyle = this.style.strokeColor
		this.renderer.canvas.lineWidth = 2
		this.renderer.canvas.textAlign = "left"
		this.renderer.canvas.textBaseline = "top"
		this.renderer.canvas.font = this.height + "px Roboto, Microsoft YaHei, 黑体, 宋体, sans-serif"
		this.renderer.canvas.strokeText(this.content, this.x, this.y)
		this.renderer.canvas.fillText(this.content, this.x, this.y)
	}

	/// init Layout
	_initLayout() {
		throw new Error("This is an abstract method!")
	}

	/// get limit to other same kind danmaku
	_getLimit(...args) {
		throw new Error("This is an abstract method!")
	}
}
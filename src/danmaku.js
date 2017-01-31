/// the danmaku class
export class Danmaku {

	constructor(renderer, content, style = {}) {

		// basic
		this.renderer = renderer
		this.content = content

		// style
		this.style = Object.assign({}, this.renderer.style, style)

		// get size
		this.renderer.canvas.font = this.renderer.fontSize + "px Roboto, Microsoft YaHei, 黑体, 宋体, sans-serif"
		this.renderer.canvas.textAlign = "left"
		this.renderer.canvas.textBaseline = "top"
		let textMeasure = this.renderer.canvas.measureText(this.content)
		this.height = this.style.fontSize
		this.width = textMeasure.width

		// init
		this.age = 0
		this.x = this.renderer.element.width
		this.y = this._getY()

	}

	/// step into next frame
	step(time) {
		this.age += time
		this.x = this.renderer.element.width - (this.renderer.element.width + this.width) * this.age / this.style.time
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

	/// get the max length of danmaku that appear with the same y and will not catch this danmaku (may be negative)
	_getMaxLength(time) {
		let keepOrderWhenEnd = (this.renderer.element.width - 16) * time / (this.style.time - this.age) - this.renderer.element.width
		let keepOrderWhenBegin = (this.renderer.element.width + this.width) * this.age / this.style.time - this.width - 16
		if (keepOrderWhenBegin > 0) {
			keepOrderWhenBegin = Infinity
		} else {
			keepOrderWhenBegin *= this.renderer.element.width
			keepOrderWhenBegin /= this.width
		}
		return Math.min(keepOrderWhenBegin, keepOrderWhenEnd)
	}

	/// get valid Y at start
	_getY() {
		// avoiding danmaku overlaying
		let limitList = this.renderer._getLimit(this.height, this.style.time)

		let top = 0

		let bottom = this.renderer.element.height - this.height

		let cutPoints = new Set()
		for (let limit of limitList) {
			if (limit.from > top && limit.from < bottom) {
				cutPoints.add(limit.from)
			}
			if (limit.to > top && limit.to < bottom) {
				cutPoints.add(limit.to)
			}
		}

		let limitData = [{y: top, max: 0}, {y: bottom, max: Infinity}]
		for (let cutPoint of Array.from(cutPoints).sort((a, b) => a - b)) {
			limitData.splice(limitData.length - 1, 0, {y: cutPoint, max: Infinity})
		}

		for (let limit of limitList) {
			for (let i = 1;i < limitData.length;i ++) {
				if (limitData[i - 1].y >= limit.from && limitData[i].y <= limit.to) {
					if (limit.max < limitData[i].max) {
						limitData[i].max = limit.max
					}
				}
			}
		}

		let target = 0
		let max = - Infinity

		for (let i = 1;i < limitData.length;i ++) {

			if (limitData[i].max > this.width) {
				target = limitData[i - 1].y
				break
			} else if (limitData[i].max > max) {
				max = limitData[i].max
				target = limitData[i - 1].y
			}

		}

		return target

	}
}

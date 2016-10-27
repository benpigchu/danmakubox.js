/// the danmaku class
export class Danmaku {

	constructor(renderer, content) {

		// basic
		this.renderer = renderer
		this.content = content

		// style
		this.time = this.renderer.time
		this.color = this.renderer.color
		this.strokeColor = this.renderer.strokeColor

		// get size
		this.renderer.canvas.font = this.renderer.fontSize + "px Roboto, Microsoft YaHei, 黑体, 宋体, sans-serif"
		this.renderer.canvas.textAlign = "left"
		this.renderer.canvas.textBaseline = "top"
		let textMeasure = this.renderer.canvas.measureText(this.content)
		this.height = this.renderer.fontSize
		this.width = textMeasure.width

		// init
		this.age = 0
		this.x = this.renderer.element.width

		// get y
		// avoiding danmaku overlaying
		let limitList = this.renderer._getLimit(this.height, this.time)

		let limitData = [{y: 0, max: 0}, {y: this.renderer.element.height, max: Infinity}]
		for (let limit of limitList) {

			let begin = false
			let end = false

			if (limit.from < 0) {
				limit.from = 0
			}
					if (limit.to > this.renderer.element.height) {
				limit.to = this.renderer.element.height
			}

			for (let i = 0; i < limitData.length; i++) {

				if (limitData[i].y >= limit.from && !begin) {

					begin = true

					if (limitData[i].y >= limit.to && !end) {

						end = true

						if (limitData[i].max > limit.max) {
							limitData.splice(i, 1, {y: limit.from, max: limitData[i].max}, {y: limit.to, max: limit.max}, {y: limitData[i].y, max: limitData[i].max})
							i += 2
						}
						break

					}

					if (limitData[i].max > limit.max) {
						limitData.splice(i, 1, {y: limit.from, max: limitData[i].max}, {y: limitData[i].y, max: limit.max})
						i++
					}
					continue

				}

				if (limitData[i].y >= limit.to && !end) {

					end = true

					if (limitData[i].max > limit.max) {
						limitData.splice(i, 1, {y: limit.to, max: limit.max}, {y: limitData[i].y, max: limitData[i].max})
						i++
					}
					break

				}

				if (begin && !end) {

					if (limitData[i].max > limit.max) {
						limitData.splice(i, 1, {y: limitData[i].y, max: limit.max})
					}

				}

			}

		}

		for (let i = 0; i < limitData.length; i++) {
			if (i !== 0) {
				if (limitData[i].y === limitData[i - 1].y) {
					limitData.splice(i, 1)
					i--
				}
			}
		}

		let target = 0
		let max = 0

		for (let i = 0; i < limitData.length; i++) {

			if (limitData[i].max > this.width) {
				target = limitData[i - 1].y
				break
			} else if (limitData[i].max > max) {
				max = limitData[i].max
				target = limitData[i - 1].y
			}

		}

		this.y = target

	}

	/// step into next frame
	step(time) {
		this.age += time
		this.x = this.renderer.element.width - (this.renderer.element.width + this.width) * this.age / this.time
		if (this.age > this.time) { this.renderer.danmakuPool.delete(this) }
	}

	/// render danmaku into renderer
	render() {
		this.renderer.canvas.fillStyle = this.color
		this.renderer.canvas.strokeStyle = this.strokeColor
		this.renderer.canvas.lineWidth = 2
		this.renderer.canvas.textAlign = "left"
		this.renderer.canvas.textBaseline = "top"
		this.renderer.canvas.font = this.height + "px Roboto, Microsoft YaHei, 黑体, 宋体, sans-serif"
		this.renderer.canvas.strokeText(this.content, this.x, this.y)
		this.renderer.canvas.fillText(this.content, this.x, this.y)
	}

	/// get the max length of danmaku that appear with the same y and will not catch this danmaku (may be negative)
	getMaxLength(time) {
		let keepOrderWhenEnd = (this.renderer.element.width - 16) * time / (this.time - this.age) - this.renderer.element.width
		let keepOrderWhenBegin = (this.renderer.element.width + this.width) * this.age / this.time - this.width - 16
		if (keepOrderWhenBegin > 0) {
			keepOrderWhenBegin = Infinity
		}
		return Math.min(keepOrderWhenBegin,keepOrderWhenEnd)
	}
}

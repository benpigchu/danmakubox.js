import {Danmaku} from "./danmaku.js"
/// the renderer class
export class DanmakuRenderer {

	constructor(canvas, color = "#000000", fontSize = 32, time = 15000, strokeColor = "#cccccc") {

		// basic
		this.element = document.getElementById(canvas)
		this.canvas = this.element.getContext("2d")

		// style
		this.color = color
		this.fontSize = fontSize
		this.time = time
		this.strokeColor = strokeColor

		// init
		this.danmakuPool = new Set()
		this.timeStamp = Date.now()

		// start render
		requestAnimationFrame(this.render.bind(this))

	}

	/// add danmaku into danmakuPool
	send(content) {
		this.danmakuPool.add(new Danmaku(this, content))
	}

	/// render danmaku
	render() {
		this.checkSize()
		this.canvas.clearRect(0, 0, this.element.width, this.element.height)
		let currentTime = Date.now()
		for (let danmaku of this.danmakuPool) {
			danmaku.step(currentTime - this.timeStamp)
			danmaku.render()
		}
		this.timeStamp = currentTime
		requestAnimationFrame(this.render.bind(this))
	}

	/// resize canvas
	checkSize() {
		if (this.element.width !== window.innerWidth || this.element.height !== window.innerHeight) {
			this.element.width = window.innerWidth
			this.element.height = window.innerHeight
			return true
		}
		return false
	}

  /// get limit to the new added danmaku
  getLimit(height, time) {
    let limitList = []
    for (let danmaku of this.danmakuPool) {
			limitList.push({
				from: danmaku.y - height,
				to: danmaku.y + danmaku.height,
				max: danmaku.getMaxLength(time)
			})
		}
    return limitList
  }

}

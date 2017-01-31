import {Danmaku} from "./danmaku.js"
/// the renderer class
export class DanmakuRenderer {

	constructor(canvas, style = {}) {

		// basic
		this.element = document.getElementById(canvas)
		this.canvas = this.element.getContext("2d")

		// style
		this.style = Object.assign({color: "#000000", fontSize: 32, time: 15000, strokeColor: "#cccccc"}, style)

		// init
		this.danmakuPool = new Set()
		this.timeStamp = Date.now()
		this.isRunning = false
		this.isAutoRender = false
		this.renderLoopId = 0

	}

	/// play danmaku
	play() {
		this.update()
		this.isRunning = true
	}

	/// pause
	pause() {
		this.update()
		this.isRunning = false
	}

	/// start auto render
	startAutoRender() {
		this.isAutoRender = true
		this._autoRender()
	}

	/// stop auto render
	stopAutoRender() {
		this.isAutoRender = false
		cancelAnimationFrame(this.renderLoopId)
	}

	/// add danmaku into danmakuPool
	send(content, style) {
		this.update()
		this.danmakuPool.add(new Danmaku(this, content, style))
	}

	/// clear danmakuPool
	clear() {
		this.danmakuPool.clear()
	}

	/// render danmaku
	render() {
		this._checkSize()
		this.update()
		for (let danmaku of this.danmakuPool) {
			danmaku.render()
		}
	}

	/// update danmaku
	update() {
		let currentTime = Date.now()
		if (this.isRunning && (currentTime - this.timeStamp > 0)) {
			for (let danmaku of this.danmakuPool) {
				danmaku.step(currentTime - this.timeStamp)
			}
		}
		this.timeStamp = currentTime
	}

	/// auto render
	_autoRender() {
		this.canvas.clearRect(0, 0, this.element.width, this.element.height)
		this.render()
		this.renderLoopId = requestAnimationFrame(this._autoRender.bind(this))
	}

	/// resize canvas
	_checkSize() {
		let elementRect = this.element.getBoundingClientRect()
		if (this.element.width !== elementRect.width || this.element.height !== elementRect.height) {
			this.element.width = elementRect.width
			this.element.height = elementRect.height
			return true
		}
		return false
	}

	/// get limit to the new added danmaku
	_getLimit(height, time) {
		let limitList = []
		for (let danmaku of this.danmakuPool) {
			limitList.push({from: danmaku.y - height,
				to: danmaku.y + danmaku.height,
				max: danmaku._getMaxLength(time)})
		}
		return limitList
	}

}

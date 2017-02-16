import {RTLDanmaku} from "./RTLDanmaku.js"
/// the renderer class
export class DanmakuRenderer {

	constructor(canvas, style = {}) {

		// basic
		if (canvas instanceof HTMLCanvasElement) {
			this.element = canvas
		} else {
			this.element = document.getElementById(canvas)
		}
		this.canvas = this.element.getContext("2d")

		// style
		this.style = Object.assign({color: "#000000", fontFamily: "Roboto, Microsoft YaHei, 黑体, 宋体, sans-serif", fontSize: 32, time: 15000, strokeColor: "#cccccc"}, style)

		// init
		this.nameToType = new Map()
		this.danmakuPools = new Map()
		this.registerDanmakuType("rtl", RTLDanmaku)
		this.timeStamp = Date.now()
		this.isRunning = false
		this.isAutoRender = false
		this.renderLoopId = 0

	}

	/// register costume danmaku type
	registerDanmakuType(name, type) {
		this.nameToType.set(name, type)
		this.danmakuPools.set(type, new Set())
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
		let DanmakuType = this.nameToType.get("rtl")
		let danmaku = new DanmakuType(this, content, style)
		this.danmakuPools.get(DanmakuType).add(danmaku)
		return danmaku
	}

	/// set renderer style
	setStyle(newStyle) {
		Object.assign(this.style, newStyle)
	}

	/// remove danmaku from danmakuPool
	withdraw(danmaku) {
		return this.danmakuPools.get(danmaku.type).delete(danmaku)
	}

	/// clear danmakuPool
	clear() {
		for (let pair of this.danmakuPools) {
			pair[1].clear()
		}
	}

	/// render danmaku
	render() {
		this._checkSize()
		this.update()
		for (let pair of this.danmakuPools) {
			for (let danmaku of pair[1]) {
				danmaku.render()
			}
		}
	}

	/// update danmaku
	update() {
		let currentTime = Date.now()
		if (this.isRunning && (currentTime - this.timeStamp > 0)) {
			for (let pair of this.danmakuPools) {
				for (let danmaku of pair[1]) {
					danmaku.step(currentTime - this.timeStamp)
				}
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
	_getLimit(danmaku, ...args) {
		let limitList = []
		for (let existedDanmaku of this.danmakuPools.get(danmaku.type)) {
			limitList.push(existedDanmaku._getLimit(...args))
		}
		return limitList
	}

}

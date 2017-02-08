import {Danmaku} from "./Danmaku.js"
/// the danmaku class
export class RTLDanmaku extends Danmaku {

	/// step into next frame
	step(time) {
		super.step(time)
		this.x = this.renderer.element.width - (this.renderer.element.width + this.width) * this.age / this.style.time
	}

	/// get limit to other same kind danmaku
	/// if the danmaku's y is between from and to, it's length should not longer than max
	/// notice the max can be negative
	_getLimit(weight, height, time) {
		let keepOrderWhenEnd = (this.renderer.element.width - 16) * time / (this.style.time - this.age) - this.renderer.element.width
		let keepOrderWhenBegin = (this.renderer.element.width + this.width) * this.age / this.style.time - this.width - 16
		if (keepOrderWhenBegin > 0) {
			keepOrderWhenBegin = Infinity
		} else {
			keepOrderWhenBegin *= this.renderer.element.width
			keepOrderWhenBegin /= this.width
		}
		let maxLength = Math.min(keepOrderWhenBegin, keepOrderWhenEnd)
		return {from: this.y - height,
				to: this.y + this.height,
				max: maxLength}
	}

	/// init Layout
	_initLayout() {
		// avoiding danmaku overlaying
		let limitList = this.renderer._getLimit(this.width, this.height, this.style.time)

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

		this.x = this.renderer.element.width
		this.y = target

	}
}

import {Danmaku} from "./Danmaku.js"
/// the bottom danmaku class
export class BottomDanmaku extends Danmaku {

	/// get limit to other same kind danmaku
	/// the danmaku's y shound not between from and to
	_getLimit(weight, height, time) {
		return {from: this.distanceFromBottom - height,
				to: this.distanceFromBottom + this.height}
	}

	/// init Layout
	_initLayout() {
		// avoiding danmaku overlaying
		let limitList = this.renderer._getLimit(this, this.width, this.height, this.style.time)

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

		let limitData = [{y: top, num: Infinity}, {y: bottom, num: 0}]
		for (let cutPoint of Array.from(cutPoints).sort((a, b) => a - b)) {
			limitData.splice(limitData.length - 1, 0, {y: cutPoint, num: 0})
		}

		for (let limit of limitList) {
			for (let i = 1;i < limitData.length;i ++) {
				if (limitData[i - 1].y >= limit.from && limitData[i].y <= limit.to) {
					limitData[i].num += 1
				}
			}
		}

		let target = 0
		let num = Infinity
		for (let i = 1;i < limitData.length;i ++) {

			if (limitData[i].num === this.width) {
				target = limitData[i - 1].y
				break
			} else if (limitData[i].num < num) {
				num = limitData[i].num
				target = limitData[i - 1].y
			}

		}

		this.distanceFromBottom = target

	}

	/// get paint position used by render method
	/// top-left position {x,y}
	_getPosition() {
		return {x: (this.renderer.element.width - this.width) / 2,
			y: (this.renderer.element.height - this.distanceFromBottom - this.height)}
	}
}

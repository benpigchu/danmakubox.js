let renderer = new DanmakuBox.DanmakuRenderer("renderer")
renderer.play()
renderer.startAutoRender()
const randomHex = () => Math.floor(16 * Math.random()).toString(16)
const randomHexes = (length) => new Array(length).fill(0).map(() => randomHex()).join("").toUpperCase()
const type = {fly: "rtl",
	top: "top",
	bottom: "bottom"}
const style = {white: {color: "#FFFFFF", strokeColor: "#222222"},
	black: {color: "#000000", strokeColor: "#cccccc"},
	blue: {color: "#145FC6", strokeColor: "#cccccc"},
	cyan: {color: "#00FFFF", strokeColor: "#222222"},
	red: {color: "#E72200", strokeColor: "#cccccc"},
	yellow: {color: "#FFDD02", strokeColor: "#222222"},
	green: {color: "#04CA00", strokeColor: "#222222"},
	purple: {color: "#800080", strokeColor: "#cccccc"}}
let uuid = `${randomHexes(8)}-${randomHexes(4)}-${randomHexes(4)}-${randomHexes(4)}-${randomHexes(12)}`
console.log(uuid)
let header = new Headers()
header.append("X-GDANMAKU-SUBSCRIBER-ID", uuid)
const fetchDanmaku = () => fetch(new Request("https://dm.tuna.moe/api/v1.1/channels/demo/danmaku", {method: "GET", headers: header}))
const send = (danmaku) => renderer.send({message: danmaku.text, type: type[danmaku.position]}, style[danmaku.style])
const loop = () => fetchDanmaku().then((response) => response.json().then((danmakus) => danmakus.forEach((danmaku) => send(danmaku))))
const makeLoop = () => {
	loop()
	setTimeout(makeLoop, 10000)
}
makeLoop()
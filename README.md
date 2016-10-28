# Danmakubox.js
A Danmaku Render Library

## How to use
Include dist/danmakubox.min.js, add a `<canvas id="renderer">` element in document , and do this:

```javascript
let renderer = new DanmakuBox.DanmakuRenderer("renderer");
renderer.play()
renderer.startAutoRender()
setInterval(()=>{renderer.send(["nya","nyanyanyanyanyanya~~"][parseInt(Math.random()*1.5)])},200)
```

## More
Please see the scource code, doc is under construction.
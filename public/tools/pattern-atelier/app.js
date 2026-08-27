"use strict";

const $ = id => document.getElementById(id);
const canvas = $("canvas");
const ctx = canvas.getContext("2d");
const previewCanvas = $("objectPreview");

const jobs = [
  {
    n: 6,
    title: "盘心团花",
    rule: "六方旋转",
    mirror: false,
    icon: "◯",
    object: "青瓷盘心",
    reason: "盘面是圆的，纹样会自然向中心聚拢。",
    detail: "同一组笔画旋转六次，首尾相接，正好围住盘心。"
  },
  {
    n: 8,
    title: "锦带连枝",
    rule: "旋转＋镜像",
    mirror: true,
    icon: "≋",
    object: "织锦腰带",
    reason: "锦带狭长，纹样会沿着边带不断接下去。",
    detail: "笔画翻转后左右相接，重复铺开，就成了一条连续的边饰。"
  },
  {
    n: 4,
    title: "窗格四隅",
    rule: "四方旋转",
    mirror: false,
    icon: "◇",
    object: "园林窗格",
    reason: "窗格四角相对，中间的空处正好用来借景。",
    detail: "笔画转向四角，中间自然空出来，窗外的景色就留在这里。"
  }
];

let round = 0;
let strokes = [];
let current = null;
let drawing = false;
let completed = [];
let history = [[]];
let historyIndex = 0;
let previewFrame = 0;

function setup(target, targetCtx) {
  const rect = target.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const pixelWidth = Math.max(1, Math.round(rect.width * ratio));
  const pixelHeight = Math.max(1, Math.round(rect.height * ratio));
  if (target.width !== pixelWidth || target.height !== pixelHeight) {
    target.width = pixelWidth;
    target.height = pixelHeight;
  }
  targetCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { w: rect.width, h: rect.height };
}

function cloneStrokes(source = strokes) {
  return source.map(stroke => stroke.map(point => ({ x: point.x, y: point.y })));
}

function resetViewport() {
  const reset = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };
  reset();
  requestAnimationFrame(() => {
    reset();
    requestAnimationFrame(reset);
  });
  setTimeout(reset, 80);
}

function activeStrokes() {
  return current?.length > 1 ? [...strokes, current] : strokes;
}

function tracePattern(target, points, job, cx, cy, scale, color = "#87c6ad", alpha = 1, width = 2) {
  if (!points || points.length < 2) return;
  for (let copy = 0; copy < job.n; copy++) {
    for (const mirror of job.mirror ? [false, true] : [false]) {
      target.save();
      target.translate(cx, cy);
      target.rotate(copy * Math.PI * 2 / job.n);
      if (mirror) target.scale(1, -1);
      target.beginPath();
      points.forEach((point, index) => {
        const x = point.x * scale;
        const y = point.y * scale;
        if (index) target.lineTo(x, y);
        else target.moveTo(x, y);
      });
      target.strokeStyle = color;
      target.globalAlpha = alpha;
      target.lineWidth = width;
      target.lineCap = "round";
      target.lineJoin = "round";
      target.stroke();
      target.restore();
    }
  }
}

function traceDesign(target, designStrokes, job, cx, cy, scale, color, alpha, width) {
  for (const stroke of designStrokes || []) {
    tracePattern(target, stroke, job, cx, cy, scale, color, alpha, width);
  }
}

function render() {
  const dimensions = setup(canvas, ctx);
  const side = Math.min(dimensions.w, dimensions.h);
  const centerX = dimensions.w / 2;
  const centerY = dimensions.h / 2;
  ctx.clearRect(0, 0, dimensions.w, dimensions.h);

  ctx.strokeStyle = "#ffffff13";
  ctx.lineWidth = 1;
  for (let ring = 1; ring <= 3; ring++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, side * (.1 + ring * .09), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(centerX, side * .08);
  ctx.lineTo(centerX, dimensions.h - side * .08);
  ctx.moveTo(centerX - side * .42, centerY);
  ctx.lineTo(centerX + side * .42, centerY);
  ctx.strokeStyle = "#ffffff0b";
  ctx.stroke();

  const job = jobs[round];
  traceDesign(ctx, strokes, job, centerX, centerY, side, "#87c6ad", 1, 2);
  if (current) tracePattern(ctx, current, job, centerX, centerY, side, "#e8e0ce", .86, 2);
  document.querySelector(".canvas-wrap").classList.toggle("has-strokes", activeStrokes().length > 0);
  requestLivePreview();
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / rect.width - .5,
    y: (event.clientY - rect.top) / rect.height - .5
  };
}

function down(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  drawing = true;
  current = [pointerPosition(event)];
  canvas.setPointerCapture?.(event.pointerId);
  updateControls(true);
  render();
}

function move(event) {
  if (!drawing || !current) return;
  const point = pointerPosition(event);
  const last = current[current.length - 1];
  const pixels = Math.hypot(point.x - last.x, point.y - last.y) * canvas.getBoundingClientRect().width;
  if (pixels > 2.5) {
    current.push(point);
    updateControls(true);
    render();
  }
}

function up(event) {
  if (!drawing) return;
  drawing = false;
  canvas.releasePointerCapture?.(event.pointerId);
  if (current && current.length > 2) {
    strokes.push(current);
    recordHistory();
  }
  current = null;
  updateControls();
  render();
}

function energyOf(designStrokes) {
  if (!designStrokes?.length) return 0;
  let length = 0;
  let turns = 0;
  for (const stroke of designStrokes) {
    for (let index = 1; index < stroke.length; index++) {
      length += Math.hypot(stroke[index].x - stroke[index - 1].x, stroke[index].y - stroke[index - 1].y);
    }
    for (let index = 2; index < stroke.length; index++) {
      const first = Math.atan2(
        stroke[index - 1].y - stroke[index - 2].y,
        stroke[index - 1].x - stroke[index - 2].x
      );
      const second = Math.atan2(
        stroke[index].y - stroke[index - 1].y,
        stroke[index].x - stroke[index - 1].x
      );
      turns += Math.abs(Math.atan2(Math.sin(second - first), Math.cos(second - first)));
    }
  }
  return Math.min(99, Math.round(
    43 + Math.min(30, length * 24) + Math.min(17, turns * 1.35) + Math.min(9, (designStrokes.length - 1) * 3)
  ));
}

function updateControls(includeCurrent = false) {
  const visibleStrokes = includeCurrent ? activeStrokes() : strokes;
  const count = visibleStrokes.length;
  const job = jobs[round];
  $("strokeCount").textContent = current?.length > 1 ? `${strokes.length} + 1 笔` : `${strokes.length} 笔`;
  $("submit").disabled = strokes.length === 0;
  $("submit").textContent = strokes.length ? `用在${job.object}上` : "先自由画一笔";
  $("feedback").textContent = count
    ? `${count === 1 ? "这一笔已经保留" : `这 ${count} 笔都保留了`}；接下来按“${job.rule}”重复 ${job.n * (job.mirror ? 2 : 1)} 次。`
    : "从哪里开始、在哪里停都可以。";
  $("undo").disabled = historyIndex === 0;
  $("redo").disabled = historyIndex >= history.length - 1;
  $("clear").disabled = strokes.length === 0;
}

function resetHistory() {
  history = [[]];
  historyIndex = 0;
}

function recordHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push(cloneStrokes());
  historyIndex++;
}

function restoreHistory(nextIndex) {
  if (nextIndex < 0 || nextIndex >= history.length) return;
  historyIndex = nextIndex;
  strokes = cloneStrokes(history[historyIndex]);
  current = null;
  drawing = false;
  updateControls();
  render();
}

function undo() {
  restoreHistory(historyIndex - 1);
}

function redo() {
  restoreHistory(historyIndex + 1);
}

function clearDrawing() {
  if (!strokes.length) return;
  strokes = [];
  current = null;
  recordHistory();
  updateControls();
  render();
}

function load() {
  strokes = [];
  current = null;
  drawing = false;
  resetHistory();
  const job = jobs[round];
  $("commission").textContent = ["第一件", "第二件", "第三件"][round];
  $("title").textContent = job.title;
  $("progress").textContent = `${round + 1} / 3`;
  $("rule").textContent = job.rule;
  $("copies").textContent = job.n * (job.mirror ? 2 : 1);
  $("objectIcon").textContent = job.icon;
  $("objectName").textContent = job.object;
  $("objectReason").textContent = job.reason;
  $("previewName").textContent = job.object;
  updateControls();
  resetViewport();
  requestAnimationFrame(render);
}

const artifactBases = [
  "/tools/pattern-atelier/assets/celadon-plate-base-v3.webp",
  "/tools/pattern-atelier/assets/crimson-silk-sash-base-v3.webp",
  "/tools/pattern-atelier/assets/hardwood-window-base-v3.webp"
].map((src, index) => {
  const image = new Image();
  image.src = src;
  image.onload = () => {
    if (!$("lab").classList.contains("hidden") && index === round) requestLivePreview();
    if (!$("result").classList.contains("hidden")) {
      jobs.forEach((_, artifactIndex) => paintArtifact($(`artifact${artifactIndex}`), artifactIndex));
      const active = [...document.querySelectorAll(".artifact")].findIndex(button => button.classList.contains("active"));
      if (active >= 0) paintArtifact($("detailCanvas"), active, true);
    }
  };
  return image;
});

function paintArtifact(target, index, large = false, designOverride = null) {
  const context = target.getContext("2d");
  const dimensions = setup(target, context);
  const w = dimensions.w;
  const h = dimensions.h;
  const design = designOverride || completed[index] || { strokes: [] };
  const designStrokes = design.strokes || [];
  const job = jobs[index];
  const base = artifactBases[index];
  context.clearRect(0, 0, w, h);

  const backdrop = context.createRadialGradient(w * .5, h * .4, 4, w * .5, h * .5, w * .7);
  backdrop.addColorStop(0, index === 2 ? "#344a42" : "#1b2824");
  backdrop.addColorStop(1, "#0a100f");
  context.fillStyle = backdrop;
  context.fillRect(0, 0, w, h);

  if (index === 0) {
    if (base.complete) context.drawImage(base, 0, 0, w, h);
    context.save();
    context.globalCompositeOperation = "multiply";
    traceDesign(context, designStrokes, job, w / 2, h / 2, Math.min(w, h) * .84, "#184d47", .82, large ? 3 : 1.3);
    context.restore();
  } else if (index === 1) {
    if (base.complete) context.drawImage(base, 0, 0, w, h);
    context.save();
    context.globalCompositeOperation = "screen";
    for (let x = w * .23; x < w; x += w * .27) {
      traceDesign(context, designStrokes, job, x, h * .51, Math.min(w, h) * .36, "#ffcf70", .88, large ? 1.8 : .8);
    }
    context.restore();
  } else {
    context.save();
    context.beginPath();
    context.rect(w * .1, h * .1, w * .8, h * .8);
    context.clip();
    [[.3, .3], [.7, .3], [.3, .7], [.7, .7]].forEach(([x, y]) => {
      traceDesign(context, designStrokes, job, w * x, h * y, Math.min(w, h) * .47, "#dcc38a", .95, large ? 2.5 : 1);
    });
    context.restore();
    if (base.complete) context.drawImage(base, 0, 0, w, h);
  }
}

function requestLivePreview() {
  if ($("lab").classList.contains("hidden") || previewFrame) return;
  previewFrame = requestAnimationFrame(() => {
    previewFrame = 0;
    paintArtifact(previewCanvas, round, true, { strokes: cloneStrokes(activeStrokes()) });
  });
}

function selectArtifact(index) {
  document.querySelectorAll(".artifact").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
  });
  const job = jobs[index];
  $("detailRule").textContent = job.rule;
  $("detailName").textContent = `${job.object} · ${job.title}`;
  $("detailText").textContent = job.detail;
  paintArtifact($("detailCanvas"), index, true);
}

function showResult() {
  $("lab").classList.add("hidden");
  $("result").classList.remove("hidden");
  resetViewport();
  $("totalCopies").textContent = `${jobs.reduce((sum, job) => sum + job.n * (job.mirror ? 2 : 1), 0)} 处重复`;
  requestAnimationFrame(() => {
    jobs.forEach((_, index) => paintArtifact($(`artifact${index}`), index));
    selectArtifact(0);
  });
}

function submit() {
  if (!strokes.length) return;
  completed[round] = { strokes: cloneStrokes(), energy: energyOf(strokes) };
  round++;
  if (round < jobs.length) load();
  else showResult();
}

canvas.addEventListener("pointerdown", down);
canvas.addEventListener("pointermove", move);
canvas.addEventListener("pointerup", up);
canvas.addEventListener("pointercancel", up);
$("undo").onclick = undo;
$("redo").onclick = redo;
$("clear").onclick = clearDrawing;
$("submit").onclick = submit;
$("start").onclick = () => {
  $("intro").classList.add("hidden");
  $("lab").classList.remove("hidden");
  load();
};
$("again").onclick = () => {
  round = 0;
  completed = [];
  $("result").classList.add("hidden");
  $("lab").classList.remove("hidden");
  load();
};
$("resetAll").onclick = () => location.reload();
document.querySelectorAll(".artifact").forEach((button, index) => {
  button.onclick = () => selectArtifact(index);
});

addEventListener("keydown", event => {
  if ($("lab").classList.contains("hidden") || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
  event.preventDefault();
  if (event.shiftKey) redo();
  else undo();
});

addEventListener("resize", () => {
  if (!$("lab").classList.contains("hidden")) requestAnimationFrame(render);
  if (!$("result").classList.contains("hidden")) {
    requestAnimationFrame(() => {
      jobs.forEach((_, index) => paintArtifact($(`artifact${index}`), index));
      const active = [...document.querySelectorAll(".artifact")].findIndex(button => button.classList.contains("active"));
      selectArtifact(Math.max(0, active));
    });
  }
});

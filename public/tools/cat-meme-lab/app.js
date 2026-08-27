"use strict";

const $ = id => document.getElementById(id);
const viewNames = ["front", "left", "right"];
const viewState = Object.fromEntries(viewNames.map(name => [name, {
  image: null,
  focus: { x: .5, y: .55 },
  analysis: null,
  segmentation: null
}]));

const moodCatalog = [
  { poseIndex: 0, captions: ["开饭了！", "收到喵", "有罐头吗", "我来了", "好耶！"] },
  { poseIndex: 1, captions: ["不想动", "今天不行", "拒绝营业", "窝着吧", "电量不足"] },
  { poseIndex: 2, captions: ["你说得对", "嗯嗯对对", "听你的", "行吧行吧", "准了"] },
  { poseIndex: 3, captions: ["送你小心心", "今天也可爱", "靠近一点", "抱抱你", "喜欢你喵"] },
  { poseIndex: 4, captions: ["已读乱回", "脑袋空空", "什么来着", "猫不知道", "让我想想"] },
  { poseIndex: 5, captions: ["先睡了", "晚安喵", "明天再说", "下线了", "梦里再聊"] }
];

const coatLabels = {
  photo_texture: "原图纹样 · 三面取样",
  orange_tabby: "橘猫 · 橘色虎斑",
  brown_tabby: "狸花猫 · 棕黑虎斑",
  silver_tabby: "银灰猫 · 灰黑虎斑",
  cow: "奶牛猫 · 黑白大块",
  tuxedo: "礼服猫 · 白胸白爪",
  calico: "三花猫 · 黑橘白块",
  tortoiseshell: "玳瑁猫 · 黑橘碎斑",
  siamese: "重点色 · 深脸深尾",
  solid_black: "纯黑猫",
  solid_white: "纯白猫",
  blue_gray: "蓝灰猫",
  solid_color: "纯色猫",
  spotted: "点斑猫"
};

const posePhotoViews = ["front", "left", "right", "front", "left", "right"];
const textureLabelKeys = ["base", "accent", "warm", "light", "dark"];

// 六个动作中脸、身体与尾巴的位置不同。纹样先落到身体区域，再映射到像素底稿，
// 避免用同一张方形噪声图覆盖所有姿势。
const poseCoatRegions = [
  { face: [.50, .28, .25, .23], body: [.49, .63, .31, .29], tail: [.82, .59, .17, .24] },
  { face: [.37, .51, .25, .22], body: [.64, .60, .34, .25], tail: [.84, .62, .18, .23] },
  { face: [.43, .29, .25, .23], body: [.46, .64, .31, .30], tail: [.82, .61, .18, .28] },
  { face: [.50, .29, .25, .23], body: [.50, .64, .31, .30], tail: [.83, .63, .17, .28] },
  { face: [.39, .39, .26, .24], body: [.50, .66, .32, .30], tail: [.83, .68, .18, .27] },
  { face: [.38, .56, .24, .20], body: [.65, .63, .34, .27], tail: [.84, .60, .18, .26] }
];

const tileBackgrounds = ["#fff8e7", "#f1f5ed", "#f5eff2", "#f1f0e8"];
const packColumns = 3;
const stickerCanvases = [...document.querySelectorAll(".sticker")];
const poseSheet = new Image();
let catProfile = null;
let poseSheetReady = false;
let packRecipe = [];
let packRevision = 0;
let packPage = 0;

poseSheet.onload = () => {
  poseSheetReady = true;
  if (catProfile) renderPack();
};
poseSheet.src = "/tools/cat-meme-lab/assets/pixel-cat-poses-v3.webp";

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    const active = screen.id === id;
    screen.classList.toggle("is-active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
  resetViewport();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resetViewport() {
  const reset = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };
  reset();
  requestAnimationFrame(() => requestAnimationFrame(reset));
  setTimeout(reset, 80);
}

function colorDistance(a, b) {
  const red = a[0] - b[0];
  const green = a[1] - b[1];
  const blue = a[2] - b[2];
  return Math.sqrt(red * red * .3 + green * green * .59 + blue * blue * .11);
}

function luminance(color) {
  return color[0] * .299 + color[1] * .587 + color[2] * .114;
}

function colorSaturation(color) {
  const max = Math.max(...color);
  const min = Math.min(...color);
  return max ? (max - min) / max : 0;
}

function warmthScore(color) {
  const saturation = colorSaturation(color);
  const redOverBlue = clamp((color[0] - color[2] + 18) / 150, 0, 1);
  const orangeBalance = clamp(1 - Math.abs(color[1] - color[0] * .68) / 95, 0, 1);
  return saturation * redOverBlue * orangeBalance;
}

function neutralize(color, amount = .72) {
  const gray = Math.round(luminance(color));
  return mixColor(color, [gray, gray + 2, gray + 5], amount);
}

function averageNumber(items, fallback = 0) {
  return items.length ? items.reduce((sum, item) => sum + item, 0) / items.length : fallback;
}

function averageColors(items) {
  if (!items.length) return [160, 150, 135];
  const totals = items.reduce((sum, item) => [
    sum[0] + item[0],
    sum[1] + item[1],
    sum[2] + item[2]
  ], [0, 0, 0]);
  return totals.map(value => Math.round(value / items.length));
}

function colorToHex(color) {
  return `#${color.map(value => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function mixColor(color, target, amount) {
  return color.map((value, index) => Math.round(value + (target[index] - value) * amount));
}

function loadView(name, file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = event => {
    const image = new Image();
    image.onload = () => {
      viewState[name].image = image;
      viewState[name].focus = { x: .5, y: .55 };
      paintPhoto(name);
      const card = document.querySelector(`[data-view="${name}"]`);
      card.querySelector(".picker").classList.add("hidden");
      card.querySelector(".photo-stage").classList.remove("hidden");
      updateFocusDot(name);
      updateSegmentation(name);
      updateUploadState();
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function paintPhoto(name) {
  const image = viewState[name].image;
  const canvas = document.querySelector(`[data-view="${name}"] .photo-canvas`);
  const context = canvas.getContext("2d");
  canvas.width = 360;
  canvas.height = 270;
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (!image) return;
  const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
}

function setFocus(name, event) {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  viewState[name].focus = {
    x: clamp((event.clientX - rect.left) / rect.width, .1, .9),
    y: clamp((event.clientY - rect.top) / rect.height, .12, .88)
  };
  updateFocusDot(name);
  updateSegmentation(name);
}

function updateFocusDot(name) {
  const card = document.querySelector(`[data-view="${name}"]`);
  const canvas = card.querySelector(".photo-canvas");
  const dot = card.querySelector(".focus-dot");
  const focus = viewState[name].focus;
  dot.style.left = `${canvas.offsetLeft + canvas.clientWidth * focus.x}px`;
  dot.style.top = `${canvas.offsetTop + canvas.clientHeight * focus.y}px`;
}

function updateUploadState() {
  const count = viewNames.filter(name => viewState[name].image).length;
  $("uploadCount").textContent = `${count} / 3`;
  $("analyze").disabled = count !== 3;
  $("analyze").querySelector("span").textContent = count === 3
    ? "生成我的猫"
    : `还差 ${3 - count} 张`;
}

function kMeans(points, count = 5) {
  const sorted = [...points].sort((a, b) => luminance(a.color) - luminance(b.color));
  let centers = Array.from({ length: count }, (_, index) => {
    const position = Math.round((sorted.length - 1) * (index + .5) / count);
    return [...sorted[position].color];
  });
  const assignments = new Uint8Array(points.length);

  for (let pass = 0; pass < 8; pass++) {
    const totals = Array.from({ length: count }, () => [0, 0, 0, 0]);
    points.forEach((point, pointIndex) => {
      let best = 0;
      let bestDistance = Infinity;
      centers.forEach((center, centerIndex) => {
        const distance = colorDistance(point.color, center);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = centerIndex;
        }
      });
      assignments[pointIndex] = best;
      const weight = point.weight;
      totals[best][0] += point.color[0] * weight;
      totals[best][1] += point.color[1] * weight;
      totals[best][2] += point.color[2] * weight;
      totals[best][3] += weight;
    });
    centers = centers.map((center, index) => totals[index][3]
      ? totals[index].slice(0, 3).map(value => Math.round(value / totals[index][3]))
      : center);
  }

  const clusters = centers.map(color => ({
    color,
    count: 0,
    weighted: 0,
    core: 0,
    border: 0,
    coreRatio: 0,
    borderRatio: 0,
    score: 0
  }));
  points.forEach((point, pointIndex) => {
    const cluster = clusters[assignments[pointIndex]];
    cluster.count++;
    cluster.weighted += point.weight;
    if (point.normalized < .18) cluster.core++;
    if (point.normalized > .72) cluster.border++;
  });
  clusters.forEach(cluster => {
    cluster.coreRatio = cluster.core / Math.max(1, cluster.count);
    cluster.borderRatio = cluster.border / Math.max(1, cluster.count);
    cluster.score = cluster.weighted * (1 + cluster.coreRatio * 3.4) * (1 - cluster.borderRatio * .68);
  });
  return clusters;
}

function neighborhoodColor(imageData, x, y, radius = 2) {
  const values = [];
  for (let oy = -radius; oy <= radius; oy++) {
    for (let ox = -radius; ox <= radius; ox++) {
      const px = clamp(x + ox, 0, imageData.width - 1);
      const py = clamp(y + oy, 0, imageData.height - 1);
      const offset = (py * imageData.width + px) * 4;
      if (imageData.data[offset + 3] > 180) values.push([
        imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2]
      ]);
    }
  }
  return averageColors(values);
}

function collectSeedPoints(imageData, focus) {
  const centerX = focus.x * imageData.width;
  const centerY = focus.y * imageData.height;
  const radiusX = imageData.width * .22;
  const radiusY = imageData.height * .28;
  const points = [];
  for (let y = Math.floor(centerY - radiusY); y <= centerY + radiusY; y += 3) {
    for (let x = Math.floor(centerX - radiusX); x <= centerX + radiusX; x += 3) {
      const normalized = ((x - centerX) / radiusX) ** 2 + ((y - centerY) / radiusY) ** 2;
      if (normalized > 1 || x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) continue;
      const offset = (y * imageData.width + x) * 4;
      points.push({
        color: [imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2]],
        normalized,
        weight: Math.exp(-normalized * 1.9)
      });
    }
  }
  return points;
}

function collectBorderPoints(imageData) {
  const points = [];
  const edgeX = Math.round(imageData.width * .09);
  const edgeY = Math.round(imageData.height * .1);
  for (let y = 0; y < imageData.height; y += 4) {
    for (let x = 0; x < imageData.width; x += 4) {
      if (x > edgeX && x < imageData.width - edgeX && y > edgeY && y < imageData.height - edgeY) continue;
      const offset = (y * imageData.width + x) * 4;
      points.push({
        color: [imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2]],
        normalized: 0,
        weight: 1
      });
    }
  }
  return points;
}

function buildForegroundMask(imageData, focus, foregroundColors, backgroundColors) {
  const width = 90;
  const height = 68;
  const candidates = new Uint8Array(width * height);
  const mask = new Uint8Array(width * height);
  const centerX = focus.x * width;
  const centerY = focus.y * height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sourceX = Math.round((x + .5) / width * (imageData.width - 1));
      const sourceY = Math.round((y + .5) / height * (imageData.height - 1));
      const color = neighborhoodColor(imageData, sourceX, sourceY, 1);
      const foregroundDistance = Math.min(...foregroundColors.map(item => colorDistance(color, item)));
      const backgroundDistance = Math.min(...backgroundColors.map(item => colorDistance(color, item)));
      const spatial = Math.sqrt(((x - centerX) / (width * .58)) ** 2 + ((y - centerY) / (height * .66)) ** 2);
      const penalty = Math.max(0, spatial - .82) * 34;
      if (foregroundDistance + penalty < backgroundDistance + 20) candidates[y * width + x] = 1;
    }
  }

  const seedX = clamp(Math.round(centerX), 0, width - 1);
  const seedY = clamp(Math.round(centerY), 0, height - 1);
  candidates[seedY * width + seedX] = 1;
  const queue = [[seedX, seedY]];
  mask[seedY * width + seedX] = 1;
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const [x, y] = queue[cursor];
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        if (!ox && !oy) continue;
        const nx = x + ox;
        const ny = y + oy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const index = ny * width + nx;
        if (!mask[index] && candidates[index]) {
          mask[index] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  let count = mask.reduce((sum, value) => sum + value, 0);
  const coverage = count / mask.length;
  if (coverage < .018 || coverage > .62) {
    mask.fill(0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const normalized = ((x - centerX) / (width * .23)) ** 2 + ((y - centerY) / (height * .3)) ** 2;
        if (normalized <= 1) mask[y * width + x] = 1;
      }
    }
    count = mask.reduce((sum, value) => sum + value, 0);
  }
  return { mask, width, height, coverage: count / mask.length };
}

function paintSegmentation(name, segmentation) {
  const canvas = document.querySelector(`[data-view="${name}"] .mask-canvas`);
  canvas.width = segmentation.width;
  canvas.height = segmentation.height;
  const context = canvas.getContext("2d");
  const image = context.createImageData(segmentation.width, segmentation.height);
  for (let y = 0; y < segmentation.height; y++) {
    for (let x = 0; x < segmentation.width; x++) {
      const index = y * segmentation.width + x;
      if (!segmentation.mask[index]) continue;
      let edge = false;
      for (let oy = -1; oy <= 1 && !edge; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          const nx = x + ox;
          const ny = y + oy;
          if (nx < 0 || ny < 0 || nx >= segmentation.width || ny >= segmentation.height || !segmentation.mask[ny * segmentation.width + nx]) {
            edge = true;
            break;
          }
        }
      }
      const offset = index * 4;
      image.data[offset] = edge ? 201 : 255;
      image.data[offset + 1] = edge ? 241 : 102;
      image.data[offset + 2] = edge ? 42 : 120;
      image.data[offset + 3] = edge ? 235 : 36;
    }
  }
  context.putImageData(image, 0, 0);
}

function collectFurPoints(imageData, focus, segmentation) {
  const centerX = focus.x * imageData.width;
  const centerY = focus.y * imageData.height;
  const radiusX = imageData.width * .21;
  const radiusY = imageData.height * .27;
  const points = [];

  for (let y = Math.max(0, Math.floor(centerY - radiusY * 1.28)); y <= Math.min(imageData.height - 1, centerY + radiusY * 1.28); y += 3) {
    for (let x = Math.max(0, Math.floor(centerX - radiusX * 1.28)); x <= Math.min(imageData.width - 1, centerX + radiusX * 1.28); x += 3) {
      const normalized = ((x - centerX) / radiusX) ** 2 + ((y - centerY) / radiusY) ** 2;
      if (normalized > 1.62) continue;
      const mx = clamp(Math.floor(x / imageData.width * segmentation.width), 0, segmentation.width - 1);
      const my = clamp(Math.floor(y / imageData.height * segmentation.height), 0, segmentation.height - 1);
      const segmented = Boolean(segmentation.mask[my * segmentation.width + mx]);
      // 点选位置内的核心椭圆始终参与取样，避免白猫/奶牛猫的白毛因接近背景色而被分割器误删。
      if (normalized > 1 && !segmented) continue;
      const offset = (y * imageData.width + x) * 4;
      points.push({
        color: [imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2]],
        normalized: clamp(normalized, 0, 1),
        weight: normalized < .48 ? 1.75 : normalized <= 1 ? 1.15 : .62
      });
    }
  }
  return points;
}

function smoothBinaryGrid(labels, valid, width, height) {
  let current = labels;
  for (let pass = 0; pass < 2; pass++) {
    const next = current.slice();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        if (!valid[index]) continue;
        let ones = 0;
        let total = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const nx = x + ox;
            const ny = y + oy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            const neighbor = ny * width + nx;
            if (!valid[neighbor]) continue;
            total++;
            ones += current[neighbor];
          }
        }
        if (total >= 4) next[index] = ones / total >= .5 ? 1 : 0;
      }
    }
    current = next;
  }
  return current;
}

function buildSpatialPatternStats(imageData, focus, segmentation, base, contrast) {
  const width = 45;
  const height = 34;
  const valid = new Uint8Array(width * height);
  const rawLabels = new Uint8Array(width * height);
  const centerX = focus.x * width;
  const centerY = focus.y * height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const normalized = ((x - centerX) / (width * .22)) ** 2 + ((y - centerY) / (height * .28)) ** 2;
      if (normalized > 1.58) continue;
      const mx = clamp(Math.floor(x / width * segmentation.width), 0, segmentation.width - 1);
      const my = clamp(Math.floor(y / height * segmentation.height), 0, segmentation.height - 1);
      const segmented = Boolean(segmentation.mask[my * segmentation.width + mx]);
      if (normalized > 1 && !segmented) continue;
      const sourceX = clamp(Math.round((x + .5) / width * imageData.width), 0, imageData.width - 1);
      const sourceY = clamp(Math.round((y + .5) / height * imageData.height), 0, imageData.height - 1);
      const color = neighborhoodColor(imageData, sourceX, sourceY, 1);
      const index = y * width + x;
      valid[index] = 1;
      rawLabels[index] = colorDistance(color, contrast) + 7 < colorDistance(color, base) ? 1 : 0;
    }
  }

  const labels = smoothBinaryGrid(rawLabels, valid, width, height);
  let bodyCount = 0;
  let contrastCount = 0;
  let neighborPairs = 0;
  let transitions = 0;
  const rowRuns = [];

  for (let y = 0; y < height; y++) {
    let previous = -1;
    let runs = 0;
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (!valid[index]) continue;
      bodyCount++;
      contrastCount += labels[index];
      if (previous !== -1 && labels[index] !== previous) runs++;
      previous = labels[index];
      if (x + 1 < width && valid[index + 1]) {
        neighborPairs++;
        if (labels[index] !== labels[index + 1]) transitions++;
      }
      if (y + 1 < height && valid[index + width]) {
        neighborPairs++;
        if (labels[index] !== labels[index + width]) transitions++;
      }
    }
    if (previous !== -1) rowRuns.push(runs);
  }

  const visited = new Uint8Array(width * height);
  const regionSizes = [];
  for (let start = 0; start < labels.length; start++) {
    if (!valid[start] || !labels[start] || visited[start]) continue;
    const queue = [start];
    visited[start] = 1;
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const point = queue[cursor];
      const x = point % width;
      const y = Math.floor(point / width);
      const neighbors = [point - 1, point + 1, point - width, point + width];
      neighbors.forEach((neighbor, direction) => {
        if (neighbor < 0 || neighbor >= labels.length || visited[neighbor] || !valid[neighbor] || !labels[neighbor]) return;
        if (direction === 0 && x === 0) return;
        if (direction === 1 && x === width - 1) return;
        if (direction === 2 && y === 0) return;
        if (direction === 3 && y === height - 1) return;
        visited[neighbor] = 1;
        queue.push(neighbor);
      });
    }
    if (queue.length >= 2) regionSizes.push(queue.length);
  }
  regionSizes.sort((a, b) => b - a);

  return {
    contrastShare: contrastCount / Math.max(1, bodyCount),
    largestRegionShare: (regionSizes[0] || 0) / Math.max(1, bodyCount),
    componentCount: regionSizes.length,
    transitionDensity: transitions / Math.max(1, neighborPairs),
    meanRowRuns: averageNumber(rowRuns)
  };
}

function buildTextureMap(imageData, segmentation, colors) {
  let minX = segmentation.width;
  let minY = segmentation.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < segmentation.height; y++) {
    for (let x = 0; x < segmentation.width; x++) {
      if (!segmentation.mask[y * segmentation.width + x]) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) return null;

  const padX = Math.max(1, Math.round((maxX - minX) * .04));
  const padY = Math.max(1, Math.round((maxY - minY) * .04));
  minX = clamp(minX - padX, 0, segmentation.width - 1);
  maxX = clamp(maxX + padX, 0, segmentation.width - 1);
  minY = clamp(minY - padY, 0, segmentation.height - 1);
  maxY = clamp(maxY + padY, 0, segmentation.height - 1);

  const width = 42;
  const height = 42;
  const labels = new Uint8Array(width * height);
  const valid = new Uint8Array(width * height);
  const palette = textureLabelKeys.map(key => colors[key]);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const maskX = minX + (x + .5) / width * (maxX - minX + 1);
      const maskY = minY + (y + .5) / height * (maxY - minY + 1);
      const mx = clamp(Math.floor(maskX), 0, segmentation.width - 1);
      const my = clamp(Math.floor(maskY), 0, segmentation.height - 1);
      const target = y * width + x;
      if (!segmentation.mask[my * segmentation.width + mx]) continue;
      const sourceX = clamp(Math.round(maskX / segmentation.width * imageData.width), 0, imageData.width - 1);
      const sourceY = clamp(Math.round(maskY / segmentation.height * imageData.height), 0, imageData.height - 1);
      const color = neighborhoodColor(imageData, sourceX, sourceY, 2);
      let best = 0;
      let bestDistance = Infinity;
      palette.forEach((candidate, index) => {
        const distance = colorDistance(color, candidate);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      labels[target] = best;
      valid[target] = 1;
    }
  }

  // 低分辨率多数滤波只移除孤立噪点，大片色块和连续条纹会保留下来。
  let smoothed = labels;
  for (let pass = 0; pass < 2; pass++) {
    const next = smoothed.slice();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        if (!valid[index]) continue;
        const counts = new Uint8Array(textureLabelKeys.length);
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const nx = x + ox;
            const ny = y + oy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            const neighbor = ny * width + nx;
            if (valid[neighbor]) counts[smoothed[neighbor]]++;
          }
        }
        let majority = smoothed[index];
        let majorityCount = 0;
        counts.forEach((count, label) => {
          if (count > majorityCount) {
            majority = label;
            majorityCount = count;
          }
        });
        if (majorityCount >= 5) next[index] = majority;
      }
    }
    smoothed = next;
  }

  return { width, height, labels: smoothed, valid };
}

function buildPhotoCutout(name, colors) {
  const sourceCanvas = document.querySelector(`[data-view="${name}"] .photo-canvas`);
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const imageData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const segmentation = viewState[name].analysis.segmentation;
  let minX = segmentation.width;
  let minY = segmentation.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < segmentation.height; y++) {
    for (let x = 0; x < segmentation.width; x++) {
      if (!segmentation.mask[y * segmentation.width + x]) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) return null;

  const spanX = maxX - minX + 1;
  const spanY = maxY - minY + 1;
  const scale = 96 / Math.max(spanX, spanY);
  const width = Math.max(24, Math.round(spanX * scale));
  const height = Math.max(24, Math.round(spanY * scale));
  const valid = new Uint8Array(width * height);
  const labels = new Uint8Array(width * height);
  const palette = textureLabelKeys.map(key => colors[key]);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const mx = clamp(Math.floor(minX + (x + .5) / width * spanX), 0, segmentation.width - 1);
      const my = clamp(Math.floor(minY + (y + .5) / height * spanY), 0, segmentation.height - 1);
      const target = y * width + x;
      if (!segmentation.mask[my * segmentation.width + mx]) continue;
      const sourceX = clamp(Math.round((mx + .5) / segmentation.width * imageData.width), 0, imageData.width - 1);
      const sourceY = clamp(Math.round((my + .5) / segmentation.height * imageData.height), 0, imageData.height - 1);
      const sampled = neighborhoodColor(imageData, sourceX, sourceY, 1);
      let best = 0;
      let bestDistance = Infinity;
      palette.forEach((color, index) => {
        const distance = colorDistance(sampled, color);
        if (distance < bestDistance) {
          best = index;
          bestDistance = distance;
        }
      });
      valid[target] = 1;
      labels[target] = best;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width + 4;
  canvas.height = height + 4;
  const context = canvas.getContext("2d");
  const output = context.createImageData(canvas.width, canvas.height);
  const paint = (x, y, color) => {
    const offset = (y * canvas.width + x) * 4;
    output.data[offset] = color[0];
    output.data[offset + 1] = color[1];
    output.data[offset + 2] = color[2];
    output.data[offset + 3] = 255;
  };

  for (let y = -1; y <= height; y++) {
    for (let x = -1; x <= width; x++) {
      const inside = x >= 0 && y >= 0 && x < width && y < height;
      const index = inside ? y * width + x : -1;
      if (inside && valid[index]) {
        paint(x + 2, y + 2, palette[labels[index]]);
        continue;
      }
      let edge = false;
      for (let oy = -1; oy <= 1 && !edge; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          const nx = x + ox;
          const ny = y + oy;
          if (nx >= 0 && ny >= 0 && nx < width && ny < height && valid[ny * width + nx]) {
            edge = true;
            break;
          }
        }
      }
      if (edge) paint(x + 2, y + 2, [16, 29, 61]);
    }
  }
  context.putImageData(output, 0, 0);
  return canvas;
}

function analyzeView(name) {
  const card = document.querySelector(`[data-view="${name}"]`);
  const canvas = card.querySelector(".photo-canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const focus = viewState[name].focus;
  const seedPoints = collectSeedPoints(imageData, focus);
  const borderPoints = collectBorderPoints(imageData);
  if (seedPoints.length < 80 || borderPoints.length < 80) throw new Error("not-enough-pixels");

  const seedClusters = kMeans(seedPoints);
  const borderClusters = kMeans(borderPoints, 4);
  const rankedSeeds = [...seedClusters].sort((a, b) => b.score - a.score);
  const backgroundColors = borderClusters.sort((a, b) => b.count - a.count).map(cluster => cluster.color);
  const foregroundClusters = rankedSeeds.filter((cluster, index) => {
    const backgroundDistance = Math.min(...backgroundColors.map(color => colorDistance(cluster.color, color)));
    return index === 0 || cluster.coreRatio > .14 || backgroundDistance > 18;
  }).slice(0, 4);
  const foregroundColors = foregroundClusters.map(cluster => cluster.color);
  const segmentation = buildForegroundMask(imageData, focus, foregroundColors, backgroundColors);

  const furPoints = collectFurPoints(imageData, focus, segmentation);
  if (furPoints.length < 80) throw new Error("segmentation-too-small");

  const furClusters = kMeans(furPoints, 6).sort((a, b) => b.weighted - a.weighted);
  const totalWeight = furClusters.reduce((sum, cluster) => sum + cluster.weighted, 0);
  const viableClusters = furClusters.filter(cluster => cluster.weighted / Math.max(1, totalWeight) >= .025);
  const baseCluster = viableClusters[0] || furClusters[0];
  const accentCluster = viableClusters.filter(cluster => cluster !== baseCluster).sort((a, b) => {
    const scoreA = colorDistance(a.color, baseCluster.color) * Math.sqrt(a.weighted / totalWeight);
    const scoreB = colorDistance(b.color, baseCluster.color) * Math.sqrt(b.weighted / totalWeight);
    return scoreB - scoreA;
  })[0] || viableClusters[1] || baseCluster;
  const lightCluster = [...viableClusters].sort((a, b) => luminance(b.color) - luminance(a.color))[0] || baseCluster;
  const darkCluster = [...viableClusters].sort((a, b) => luminance(a.color) - luminance(b.color))[0] || baseCluster;
  const warmCluster = [...viableClusters].sort((a, b) => {
    const scoreA = warmthScore(a.color) * Math.sqrt(a.weighted / totalWeight);
    const scoreB = warmthScore(b.color) * Math.sqrt(b.weighted / totalWeight);
    return scoreB - scoreA;
  })[0] || baseCluster;
  const base = baseCluster.color;
  const accent = accentCluster.color;
  const light = lightCluster.color;
  const dark = darkCluster.color;
  const warm = warmCluster.color;
  const accentShare = accentCluster === baseCluster || colorDistance(base, accent) < 32
    ? 0
    : accentCluster.weighted / totalWeight;
  const lightShare = lightCluster === baseCluster || colorDistance(base, light) < 32
    ? 0
    : lightCluster.weighted / totalWeight;
  const darkShare = darkCluster === baseCluster || colorDistance(base, dark) < 32
    ? 0
    : darkCluster.weighted / totalWeight;
  const warmShare = warmCluster === baseCluster || colorDistance(base, warm) < 28
    ? 0
    : warmCluster.weighted / totalWeight;
  const patternWeight = viableClusters.filter(cluster => colorDistance(cluster.color, base) >= 32)
    .reduce((sum, cluster) => sum + cluster.weighted, 0);
  const spatial = buildSpatialPatternStats(imageData, focus, segmentation, base, accent);
  const ratio = clamp(Math.max(patternWeight / totalWeight, spatial.contrastShare), 0, .82);
  const toneGap = luminance(light) - luminance(dark);
  const neutralPair = colorSaturation(light) < .2 && colorSaturation(dark) < .3;
  const textureMap = buildTextureMap(imageData, segmentation, { base, accent, warm, light, dark });
  paintSegmentation(name, segmentation);
  viewState[name].segmentation = segmentation;
  return {
    base,
    accent,
    light,
    dark,
    warm,
    ratio,
    accentShare,
    lightShare,
    darkShare,
    warmShare,
    toneGap,
    neutralPair,
    textureMap,
    ...spatial,
    segmentation
  };
}

function updateSegmentation(name) {
  if (!viewState[name].image) return;
  try {
    viewState[name].analysis = analyzeView(name);
    document.querySelector(`[data-view="${name}"] .tap-tip`).textContent = "亮边 = 猫";
  } catch (error) {
    const overlay = document.querySelector(`[data-view="${name}"] .mask-canvas`);
    overlay.getContext("2d").clearRect(0, 0, overlay.width, overlay.height);
    document.querySelector(`[data-view="${name}"] .tap-tip`).textContent = "再点猫身";
  }
}

function medianColors(items) {
  return [0, 1, 2].map(channel => {
    const values = items.map(item => item[channel]).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  });
}

function inferPatternMode(analyses, base, accent, light) {
  const ratio = averageNumber(analyses.map(item => item.ratio));
  const accentShare = averageNumber(analyses.map(item => item.accentShare));
  const lightShare = averageNumber(analyses.map(item => item.lightShare));
  const darkShare = averageNumber(analyses.map(item => item.darkShare));
  const toneGap = averageNumber(analyses.map(item => item.toneGap));
  const neutralPair = averageNumber(analyses.map(item => Number(item.neutralPair)));
  const largestRegion = averageNumber(analyses.map(item => item.largestRegionShare));
  const transitionDensity = averageNumber(analyses.map(item => item.transitionDensity));
  const meanRowRuns = averageNumber(analyses.map(item => item.meanRowRuns));
  const contrast = colorDistance(base, accent);
  const lightContrast = colorDistance(base, light);

  // 黑白双峰 + 大片相连区域是奶牛纹，不再仅凭“对比色占比”落入虎斑。
  const blackWhitePair = neutralPair >= .5 && toneGap > 82 && (lightShare > .16 || luminance(base) > 178)
    && (darkShare > .065 || luminance(base) < 92);
  if (blackWhitePair && ratio > .12 && (largestRegion > .045 || accentShare > .13)) return "cow";
  if (contrast < 34 || ratio < .105) return "solid";

  // 低频、大面积色块优先判为块斑；虎斑必须同时出现较高边界密度和多次横向交替。
  if (ratio > .36 && largestRegion > .055 && transitionDensity < .245) return "patches";
  // 深底、胸口/口鼻有较大浅色区域，更接近燕尾服双色；浅底黑块则由 cow 分支处理。
  if (lightShare > .14 && lightContrast > 55 && luminance(base) < 168 && largestRegion > .03) return "bicolor";
  if (transitionDensity > .105 && meanRowRuns >= 1.15 && ratio < .55) return "tabby";
  if (accentShare < .105 || (largestRegion < .035 && transitionDensity < .14)) return "spotted";
  return largestRegion > .07 ? "patches" : "tabby";
}

function inferCoatArchetype(analyses, source, patternMode) {
  const ratio = averageNumber(analyses.map(item => item.ratio));
  const lightShare = averageNumber(analyses.map(item => item.lightShare));
  const darkShare = averageNumber(analyses.map(item => item.darkShare));
  const warmShare = averageNumber(analyses.map(item => item.warmShare));
  const transitionDensity = averageNumber(analyses.map(item => item.transitionDensity));
  const largestRegion = averageNumber(analyses.map(item => item.largestRegionShare));
  const baseLightness = luminance(source.base);
  const lightGap = luminance(source.light) - luminance(source.dark);
  const warmEvidence = Math.max(warmthScore(source.base), warmthScore(source.accent), warmthScore(source.warm));
  const neutralBase = colorSaturation(source.base) < .18;
  const clearOrangeAndDark = warmEvidence > .2
    && colorDistance(source.warm, source.dark) > 52
    && warmShare > .035
    && darkShare > .045;

  if (patternMode === "cow") return "cow";
  if (patternMode === "bicolor") return "tuxedo";

  // 三花与玳瑁必须同时看到暖色、深色和浅色，避免把普通棕色虎斑判成三花。
  if ((patternMode === "patches" || ratio > .3) && clearOrangeAndDark && lightShare > .07) {
    return baseLightness > 132 || lightShare > .17 ? "calico" : "tortoiseshell";
  }

  // 浅暖身体、少量连续深色、低边界密度更接近重点色；奶牛猫已在前面由黑白大块分支截获。
  const pointColor = baseLightness > 145
    && lightGap > 72
    && darkShare > .045
    && darkShare < .34
    && transitionDensity < .13
    && largestRegion < .075
    && colorSaturation(source.light) < .34;
  if (pointColor) return "siamese";

  if (patternMode === "tabby") {
    if (warmEvidence > .24 && source.warm[0] > source.warm[2] + 42) return "orange_tabby";
    if (neutralBase || colorSaturation(source.light) < .14) return "silver_tabby";
    return "brown_tabby";
  }
  if (patternMode === "spotted") return "spotted";
  if (patternMode === "patches") return clearOrangeAndDark ? "tortoiseshell" : "cow";

  if (baseLightness < 68 && colorSaturation(source.base) < .24) return "solid_black";
  if (baseLightness > 214 && colorSaturation(source.base) < .16) return "solid_white";
  if (neutralBase) return "blue_gray";
  if (warmEvidence > .28) return "orange_tabby";
  return "solid_color";
}

function buildProfile() {
  viewNames.forEach(name => {
    viewState[name].analysis = analyzeView(name);
  });
  const analyses = viewNames.map(name => viewState[name].analysis);
  const sourceColors = {
    base: medianColors(analyses.map(item => item.base)),
    accent: medianColors(analyses.map(item => item.accent)),
    light: medianColors(analyses.map(item => item.light)),
    dark: medianColors(analyses.map(item => item.dark)),
    warm: medianColors(analyses.map(item => item.warm))
  };
  const ratio = analyses.reduce((sum, item) => sum + item.ratio, 0) / analyses.length;
  const patternMode = inferPatternMode(analyses, sourceColors.base, sourceColors.accent, sourceColors.light);
  const detectedArchetype = inferCoatArchetype(analyses, sourceColors, patternMode);
  const textureMaps = Object.fromEntries(viewNames.map(name => [name, viewState[name].analysis.textureMap]));
  catProfile = {
    ...sourceColors,
    secondary: [...sourceColors.warm],
    outline: [16, 29, 61],
    ratio,
    patternMode,
    detectedPatternMode: patternMode,
    archetype: detectedArchetype,
    detectedArchetype,
    textureMaps,
    sourceColors: Object.fromEntries(Object.entries(sourceColors).map(([key, color]) => [key, [...color]])),
    type: coatLabels[detectedArchetype]
  };
  catProfile.photoCutouts = Object.fromEntries(viewNames.map(name => [name, buildPhotoCutout(name, sourceColors)]));
  const requested = $("coatHint").value;
  applyCoatArchetype(requested === "auto" ? detectedArchetype : requested);
}

function buildDemoProfile() {
  const sourceColors = {
    base: [204, 139, 70],
    accent: [116, 72, 39],
    light: [241, 213, 164],
    dark: [74, 48, 32],
    warm: [215, 143, 62]
  };
  catProfile = {
    ...sourceColors,
    secondary: [...sourceColors.warm],
    outline: [16, 29, 61],
    ratio: .24,
    patternMode: "tabby",
    detectedPatternMode: "tabby",
    archetype: "orange_tabby",
    detectedArchetype: "orange_tabby",
    textureMaps: null,
    photoCutouts: null,
    sourceColors: Object.fromEntries(Object.entries(sourceColors).map(([key, color]) => [key, [...color]])),
    type: coatLabels.orange_tabby
  };
  applyCoatArchetype("orange_tabby");
  catProfile.type += "（示例）";
}

function addEllipse(mask, code, cx, cy, rx, ry) {
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) mask[y * 32 + x] = code;
    }
  }
}

function addTriangle(mask, code, ax, ay, bx, by, cx, cy) {
  const area = (px, py, qx, qy, rx, ry) => (px * (qy - ry) + qx * (ry - py) + rx * (py - qy)) / 2;
  const total = Math.abs(area(ax, ay, bx, by, cx, cy));
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const sum = Math.abs(area(x, y, bx, by, cx, cy))
        + Math.abs(area(ax, ay, x, y, cx, cy))
        + Math.abs(area(ax, ay, bx, by, x, y));
      if (Math.abs(sum - total) < .2) mask[y * 32 + x] = code;
    }
  }
}

function addTail(mask, points) {
  for (let index = 1; index < points.length; index++) {
    const [x0, y0] = points[index - 1];
    const [x1, y1] = points[index];
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2;
    for (let step = 0; step <= steps; step++) {
      const x = Math.round(x0 + (x1 - x0) * step / steps);
      const y = Math.round(y0 + (y1 - y0) * step / steps);
      addEllipse(mask, 3, x, y, 1.4, 1.4);
    }
  }
}

function buildCatMask(index) {
  const poses = [
    { head: [16, 12, 6, 5.5], body: [16, 22, 8.5, 6], side: "front", tail: [[23, 23], [28, 21], [29, 17], [27, 14]] },
    { head: [11, 18, 5.5, 5], body: [18, 22, 10, 5], side: "left", tail: [[26, 23], [29, 25], [27, 27]] },
    { head: [16, 14, 6, 5.5], body: [16, 23, 7.5, 6], side: "right", tail: [[22, 24], [28, 22], [29, 18]] },
    { head: [16, 14, 6, 5.5], body: [16, 23, 8, 6], side: "front", tail: [[23, 24], [28, 22], [30, 18]] },
    { head: [15, 15, 6, 5.5], body: [17, 23, 8.5, 6], side: "left", tail: [[24, 24], [29, 22], [29, 17]] },
    { head: [11, 21, 5, 4.6], body: [18, 22, 9, 6.5], side: "right", tail: [[25, 23], [27, 19], [24, 17], [21, 19]] }
  ];
  const pose = poses[index];
  const mask = new Uint8Array(32 * 32);
  addTail(mask, pose.tail);
  addEllipse(mask, 2, ...pose.body);
  addEllipse(mask, 1, ...pose.head);
  addTriangle(mask, 1, pose.head[0] - 5, pose.head[1] - 3, pose.head[0] - 3, pose.head[1] - 8, pose.head[0], pose.head[1] - 4);
  addTriangle(mask, 1, pose.head[0] + 1, pose.head[1] - 4, pose.head[0] + 4, pose.head[1] - 8, pose.head[0] + 5, pose.head[1] - 3);
  if (index !== 1 && index !== 5) {
    addEllipse(mask, 2, pose.body[0] - 4, pose.body[1] + 5, 2, 2);
    addEllipse(mask, 2, pose.body[0] + 4, pose.body[1] + 5, 2, 2);
  }
  return { mask, pose };
}

function drawPixelCat(context, index) {
  const unit = 4;
  const { mask, pose } = buildCatMask(index);
  const outlineCells = new Set();
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      if (!mask[y * 32 + x]) continue;
      for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          const nx = x + ox;
          const ny = y + oy;
          if (nx >= 0 && ny >= 0 && nx < 32 && ny < 32 && !mask[ny * 32 + nx]) outlineCells.add(`${nx},${ny}`);
        }
      }
    }
  }
  context.fillStyle = colorToHex(catProfile.outline);
  outlineCells.forEach(key => {
    const [x, y] = key.split(",").map(Number);
    context.fillRect(x * unit, y * unit, unit, unit);
  });

  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const part = mask[y * 32 + x];
      if (!part) continue;
      const isFace = part === 1;
      const source = isFace ? "front" : pose.side;
      const u = isFace
        ? (x - (pose.head[0] - pose.head[2])) / (pose.head[2] * 2)
        : (x - (pose.body[0] - pose.body[2])) / (pose.body[2] * 2);
      const v = isFace
        ? (y - (pose.head[1] - pose.head[3])) / (pose.head[3] * 2)
        : (y - (pose.body[1] - pose.body[3])) / (pose.body[3] * 2);
      const sampled = 0;
      const color = sampled === 1 ? catProfile.accent : sampled === 2 ? catProfile.light : catProfile.base;
      context.fillStyle = colorToHex(y > 25 ? mixColor(color, catProfile.outline, .12) : color);
      context.fillRect(x * unit, y * unit, unit, unit);
    }
  }
  drawFace(context, index, pose.head[0], pose.head[1]);
}

function pixel(context, x, y, w = 1, h = 1, color = colorToHex(catProfile.outline)) {
  context.fillStyle = color;
  context.fillRect(x * 4, y * 4, w * 4, h * 4);
}

function drawFace(context, index, cx, cy) {
  const dark = colorToHex(catProfile.outline);
  const eye = "#f6e2a1";
  if (index === 0) {
    pixel(context, cx - 3, cy - 1, 2, 2, eye); pixel(context, cx + 2, cy - 1, 2, 2, eye);
    pixel(context, cx - 2, cy, 1, 1, dark); pixel(context, cx + 2, cy, 1, 1, dark);
    pixel(context, cx, cy + 2, 1, 1, "#b94f48");
  } else if (index === 1 || index === 2) {
    pixel(context, cx - 3, cy, 2, 1, dark); pixel(context, cx + 2, cy, 2, 1, dark);
    pixel(context, cx, cy + 2, 2, 1, dark);
  } else if (index === 3) {
    pixel(context, cx - 3, cy, 1, 1, dark); pixel(context, cx - 2, cy - 1, 1, 1, dark);
    pixel(context, cx + 2, cy - 1, 1, 1, dark); pixel(context, cx + 3, cy, 1, 1, dark);
    pixel(context, cx, cy + 2, 1, 1, "#b94f48");
  } else if (index === 4) {
    pixel(context, cx - 3, cy - 1, 1, 1, dark); pixel(context, cx - 2, cy, 1, 1, dark);
    pixel(context, cx - 2, cy - 1, 1, 1, dark); pixel(context, cx - 3, cy, 1, 1, dark);
    pixel(context, cx + 2, cy - 1, 1, 1, dark); pixel(context, cx + 3, cy, 1, 1, dark);
    pixel(context, cx + 3, cy - 1, 1, 1, dark); pixel(context, cx + 2, cy, 1, 1, dark);
  } else {
    pixel(context, cx - 3, cy, 2, 1, dark); pixel(context, cx + 2, cy, 2, 1, dark);
    pixel(context, cx, cy + 2, 1, 1, dark);
  }
}

function drawExtra(context, index) {
  if (index === 0) {
    context.fillStyle = "#b95c49"; context.fillRect(48, 105, 32, 4); context.fillRect(52, 109, 24, 5);
  } else if (index === 3) {
    context.fillStyle = "#c85d58"; context.fillRect(96, 51, 8, 8); context.fillRect(104, 47, 8, 8); context.fillRect(112, 51, 8, 8); context.fillRect(100, 59, 16, 8);
  } else if (index === 4) {
    context.fillStyle = "#587770"; context.font = "bold 17px sans-serif"; context.fillText("?", 100, 58); context.fillText("?", 111, 48);
  } else if (index === 5) {
    context.fillStyle = "#c49a52"; context.fillRect(99, 46, 12, 4); context.fillRect(95, 50, 12, 12); context.fillStyle = tileBackgrounds[index % tileBackgrounds.length]; context.fillRect(99, 46, 8, 12);
  }
}

function patternSeed() {
  return (catProfile.base[0] * 3 + catProfile.base[1] * 5 + catProfile.base[2] * 7) / 255;
}

function hash2(x, y, seed) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 19.19) * 43758.5453;
  return value - Math.floor(value);
}

function regionCoordinates(point, ellipse) {
  return {
    x: (point[0] - ellipse[0]) / ellipse[2],
    y: (point[1] - ellipse[1]) / ellipse[3]
  };
}

function regionDistance(coordinates) {
  return coordinates.x ** 2 + coordinates.y ** 2;
}

function locateCoatRegion(sourceIndex, u, v) {
  const pose = poseCoatRegions[sourceIndex % poseCoatRegions.length];
  const face = regionCoordinates([u, v], pose.face);
  const body = regionCoordinates([u, v], pose.body);
  const tail = regionCoordinates([u, v], pose.tail);
  if (regionDistance(face) < 1.16) return { kind: "face", ...face };
  if (regionDistance(tail) < .9 && regionDistance(tail) < regionDistance(body) * .85) return { kind: "tail", ...tail };
  return { kind: "body", ...body };
}

function inLocalEllipse(region, cx, cy, rx, ry) {
  return ((region.x - cx) / rx) ** 2 + ((region.y - cy) / ry) ** 2 < 1;
}

function textureCoordinates(viewName, region) {
  if (region.kind === "face") {
    const centerX = viewName === "left" ? .28 : viewName === "right" ? .72 : .5;
    const direction = viewName === "right" ? -1 : 1;
    return {
      x: centerX + region.x * .22 * direction,
      y: .31 + region.y * .19
    };
  }
  if (region.kind === "tail") {
    const centerX = viewName === "left" ? .82 : viewName === "right" ? .18 : .78;
    const direction = viewName === "right" ? -1 : 1;
    return {
      x: centerX + region.x * .15 * direction,
      y: .62 + region.y * .25
    };
  }
  return {
    x: .5 + region.x * .43,
    y: .65 + region.y * .29
  };
}

function textureLabelAt(map, normalizedX, normalizedY) {
  const centerX = clamp(Math.round(normalizedX * (map.width - 1)), 0, map.width - 1);
  const centerY = clamp(Math.round(normalizedY * (map.height - 1)), 0, map.height - 1);
  for (let radius = 0; radius <= 3; radius++) {
    let best = -1;
    let bestDistance = Infinity;
    for (let oy = -radius; oy <= radius; oy++) {
      for (let ox = -radius; ox <= radius; ox++) {
        if (radius && Math.abs(ox) !== radius && Math.abs(oy) !== radius) continue;
        const x = centerX + ox;
        const y = centerY + oy;
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) continue;
        const index = y * map.width + x;
        if (!map.valid[index]) continue;
        const distance = ox * ox + oy * oy;
        if (distance < bestDistance) {
          best = map.labels[index];
          bestDistance = distance;
        }
      }
    }
    if (best !== -1) return best;
  }
  return -1;
}

function samplePhotoTexture(sourceIndex, region) {
  if (!catProfile.textureMaps) return null;
  const viewName = posePhotoViews[sourceIndex % posePhotoViews.length];
  const map = catProfile.textureMaps[viewName];
  if (!map) return null;
  const coordinates = textureCoordinates(viewName, region);
  const label = textureLabelAt(map, clamp(coordinates.x, 0, 1), clamp(coordinates.y, 0, 1));
  if (label < 0) return null;
  const palette = {
    base: catProfile.base,
    accent: catProfile.accent,
    warm: catProfile.secondary,
    light: catProfile.light,
    dark: catProfile.dark
  };
  return palette[textureLabelKeys[label]] || catProfile.base;
}

function coatColorAt(sourceIndex, u, v, patternVariant = 0) {
  const archetype = catProfile.archetype || "brown_tabby";
  const seed = patternSeed();
  const region = locateCoatRegion(sourceIndex, u, v);
  const flip = hash2(1, 3, seed) > .5 ? 1 : -1;
  const paws = region.kind === "body" && region.y > .52;

  if (archetype === "photo_texture") return samplePhotoTexture(sourceIndex, region) || catProfile.base;

  if (["solid_black", "solid_white", "blue_gray", "solid_color"].includes(archetype)) return catProfile.base;

  if (["orange_tabby", "brown_tabby", "silver_tabby"].includes(archetype)) {
    if (region.kind === "face") {
      const foreheadM = region.y < -.05
        && Math.abs(region.x) < .62
        && Math.sin((Math.abs(region.x) * 6.4 - region.y * 2.2 + seed) * Math.PI) > .18;
      const cheekBars = Math.abs(region.x) > .38
        && region.y > -.12
        && region.y < .58
        && Math.sin((region.y * 7.2 + seed) * Math.PI) > .28;
      return foreheadM || cheekBars ? catProfile.accent : catProfile.base;
    }
    if (region.kind === "tail") {
      const ring = Math.sin((region.x * 3.2 + region.y * 4.6 + seed) * Math.PI) > -.08;
      return ring ? catProfile.accent : catProfile.base;
    }
    const dorsal = region.y < -.63;
    const flankStripe = region.y < .52
      && Math.sin((region.x * 5.1 + Math.abs(region.y) * .72 + seed) * Math.PI) > .48;
    const legBand = paws && Math.sin((region.y * 8.2 + seed) * Math.PI) > .18;
    return dorsal || flankStripe || legBand ? catProfile.accent : catProfile.base;
  }

  if (archetype === "cow") {
    if (region.kind === "face") {
      const cap = inLocalEllipse(region, flip * .38, -.42, .62, .62);
      const eyePatch = inLocalEllipse(region, -flip * .38, .02, .36, .42);
      return cap || eyePatch ? catProfile.accent : catProfile.base;
    }
    if (region.kind === "tail") {
      return Math.sin((region.x * 2.2 + region.y * 3.4 + seed) * Math.PI) > -.28
        ? catProfile.accent
        : catProfile.base;
    }
    const shoulderPatch = inLocalEllipse(region, -flip * .48, -.28, .68, .58);
    const rumpPatch = inLocalEllipse(region, flip * .53, .18, .72, .64);
    const backPatch = inLocalEllipse(region, 0, -.7, .5, .3);
    return shoulderPatch || rumpPatch || backPatch ? catProfile.accent : catProfile.base;
  }

  if (archetype === "tuxedo") {
    if (region.kind === "face") {
      const muzzle = inLocalEllipse(region, 0, .38, .52, .34);
      const blaze = Math.abs(region.x) < .17 && region.y < .12;
      return muzzle || blaze ? catProfile.light : catProfile.base;
    }
    if (region.kind === "tail") return catProfile.base;
    const bib = Math.abs(region.x) < .42 && region.y > -.15;
    return bib || paws ? catProfile.light : catProfile.base;
  }

  if (archetype === "calico") {
    if (region.kind === "face") {
      if (inLocalEllipse(region, -flip * .42, -.25, .58, .62)) return catProfile.accent;
      if (inLocalEllipse(region, flip * .38, .18, .55, .58)) return catProfile.secondary;
      return catProfile.base;
    }
    if (region.kind === "tail") {
      return Math.sin((region.x * 2.8 + region.y * 3.6 + seed) * Math.PI) > 0
        ? catProfile.accent
        : catProfile.secondary;
    }
    if (inLocalEllipse(region, -flip * .5, -.28, .7, .58)) return catProfile.secondary;
    if (inLocalEllipse(region, flip * .48, .2, .7, .62)) return catProfile.accent;
    return catProfile.base;
  }

  if (archetype === "tortoiseshell") {
    const field = Math.sin((region.x * 3.2 + seed) * Math.PI)
      + Math.sin((region.y * 4.1 - seed * .7) * Math.PI)
      + Math.sin(((region.x - region.y) * 2.5 + seed * .21) * Math.PI);
    if (field > .72) return catProfile.accent;
    if (field < -.88) return catProfile.secondary;
    return catProfile.base;
  }

  if (archetype === "siamese") {
    if (region.kind === "face") {
      const mask = inLocalEllipse(region, 0, .08, .78, .76) || region.y < -.5;
      return mask ? catProfile.accent : catProfile.base;
    }
    if (region.kind === "tail" || paws) return catProfile.accent;
    return catProfile.base;
  }

  if (archetype === "spotted") {
    if (region.kind === "tail") {
      return Math.sin((region.x * 3.1 + region.y * 4.2 + seed) * Math.PI) > .18
        ? catProfile.accent
        : catProfile.base;
    }
    const columns = region.kind === "face" ? 3 : 5;
    const rows = region.kind === "face" ? 3 : 6;
    const gx = clamp(Math.floor((region.x + 1) * .5 * columns), 0, columns - 1);
    const gy = clamp(Math.floor((region.y + 1) * .5 * rows), 0, rows - 1);
    const cx = -1 + (gx + .25 + hash2(gx, gy, seed) * .5) * 2 / columns;
    const cy = -1 + (gy + .25 + hash2(gy, gx, seed + 2) * .5) * 2 / rows;
    const radius = .12 + hash2(gx + 3, gy + 4, seed) * .08;
    return Math.hypot(region.x - cx, region.y - cy) < radius ? catProfile.accent : catProfile.base;
  }

  return catProfile.base;
}

function hasNearbyBlue(data, size, x, y) {
  for (let oy = -13; oy <= 13; oy += 3) {
    for (let ox = -13; ox <= 13; ox += 3) {
      const px = x + ox;
      const py = y + oy;
      if (px < 0 || py < 0 || px >= size || py >= size) continue;
      const offset = (py * size + px) * 4;
      if (data[offset + 3] < 120) continue;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      if (blue > red * 1.2 && blue > green * 1.08) return true;
    }
  }
  return false;
}

function recolorPose(sourceIndex, patternVariant = 0) {
  const size = 224;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.imageSmoothingEnabled = false;
  const sourceWidth = poseSheet.naturalWidth / 3;
  const sourceHeight = poseSheet.naturalHeight / 2;
  const sourceX = (sourceIndex % 3) * sourceWidth;
  const sourceY = Math.floor(sourceIndex / 3) * sourceHeight;
  context.drawImage(poseSheet, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, size, size);

  const image = context.getImageData(0, 0, size, size);
  const data = image.data;
  const bodyCandidate = new Uint8Array(size * size);
  const bodyMask = new Uint8Array(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pixelIndex = y * size + x;
      const offset = pixelIndex * 4;
      const alpha = data[offset + 3];
      if (alpha < 150) {
        data[offset + 3] = 0;
        continue;
      }
      data[offset + 3] = 255;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const saturation = max ? (max - min) / max : 0;
      const lightness = luminance([red, green, blue]);
      const pinkProp = red > green * 1.3 && red > blue * 1.14 && saturation > .3;
      const blueProp = blue > red * 1.2 && blue > green * 1.08;
      const limeProp = green > red * 1.12 && green > blue * 1.18;
      const whiteHatTrim = sourceIndex === 5 && lightness > 245 && saturation < .12 && hasNearbyBlue(data, size, x, y);
      const warmFill = lightness > 68 && saturation < .58 && red >= blue * .82 && green >= blue * .68;
      if (warmFill && !pinkProp && !blueProp && !limeProp && !whiteHatTrim) bodyCandidate[pixelIndex] = 1;
    }
  }

  const visited = new Uint8Array(size * size);
  for (let start = 0; start < bodyCandidate.length; start++) {
    if (!bodyCandidate[start] || visited[start]) continue;
    const component = [start];
    visited[start] = 1;
    for (let cursor = 0; cursor < component.length; cursor++) {
      const point = component[cursor];
      const x = point % size;
      const y = Math.floor(point / size);
      const neighbors = [point - 1, point + 1, point - size, point + size];
      neighbors.forEach((neighbor, direction) => {
        if (neighbor < 0 || neighbor >= bodyCandidate.length || visited[neighbor] || !bodyCandidate[neighbor]) return;
        if (direction === 0 && x === 0) return;
        if (direction === 1 && x === size - 1) return;
        if (direction === 2 && y === 0) return;
        if (direction === 3 && y === size - 1) return;
        visited[neighbor] = 1;
        component.push(neighbor);
      });
    }
    if (component.length >= 14) component.forEach(point => { bodyMask[point] = 1; });
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pixelIndex = y * size + x;
      const offset = pixelIndex * 4;
      if (!data[offset + 3]) continue;
      const original = [data[offset], data[offset + 1], data[offset + 2]];
      const lightness = luminance(original);
      if (!bodyMask[pixelIndex]) {
        if (bodyCandidate[pixelIndex]) data[offset + 3] = 0;
        continue;
      }

      const baseColor = coatColorAt(sourceIndex, x / size, y / size, patternVariant);
      let color = baseColor;
      if (lightness > 225) color = mixColor(baseColor, [255, 249, 232], .1);
      else if (lightness < 164) color = mixColor(baseColor, catProfile.outline, .16);
      data[offset] = color[0];
      data[offset + 1] = color[1];
      data[offset + 2] = color[2];
      data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

function drawPoseArt(context, recipe) {
  if (!poseSheetReady) return;
  if (catProfile.archetype === "photo_texture" && catProfile.photoCutouts) {
    const viewName = posePhotoViews[recipe.poseIndex % posePhotoViews.length];
    const cutout = catProfile.photoCutouts[viewName] || catProfile.photoCutouts.front;
    if (cutout) {
      const ratio = Math.min(188 / cutout.width, 176 / cutout.height);
      const width = Math.round(cutout.width * ratio);
      const height = Math.round(cutout.height * ratio);
      const x = Math.round((256 - width) / 2);
      const y = Math.round(57 + (176 - height) / 2);
      context.save();
      context.imageSmoothingEnabled = false;
      context.fillStyle = "#101d3d24";
      context.fillRect(x + 8, Math.min(229, y + height - 3), Math.max(18, width - 16), 6);
      context.drawImage(cutout, x, y, width, height);
      context.restore();
      return;
    }
  }
  const pose = recolorPose(recipe.poseIndex, recipe.patternVariant);
  const size = 208 * recipe.scale;
  const x = 24 + (208 - size) / 2 + recipe.offsetX;
  const y = 44 + (208 - size) / 2 + recipe.offsetY;
  context.imageSmoothingEnabled = false;
  context.save();
  if (recipe.mirror) {
    context.translate(x + size, y);
    context.scale(-1, 1);
    context.drawImage(pose, 0, 0, size, size);
  } else {
    context.drawImage(pose, x, y, size, size);
  }
  context.restore();
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function shuffled(items) {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    [output[index], output[target]] = [output[target], output[index]];
  }
  return output;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomizePack() {
  packRevision++;
  const moods = [...moodCatalog, ...moodCatalog];
  const captionPools = new Map(moodCatalog.map(mood => [mood.poseIndex, shuffled(mood.captions)]));
  packRecipe = moods.map((mood, index) => ({
    poseIndex: mood.poseIndex,
    caption: captionPools.get(mood.poseIndex).pop(),
    mirror: false,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    patternVariant: 0,
    scene: mood.poseIndex % 4,
    frame: 0,
    captionRight: false,
    background: tileBackgrounds[mood.poseIndex % tileBackgrounds.length]
  }));
}

function drawPixelScene(context, recipe) {
  const ink = colorToHex(catProfile.outline);
  const accent = recipe.poseIndex % 2 ? "#2368e8" : "#ff6678";
  context.save();
  context.globalAlpha = .58;
  if (recipe.scene === 0) {
    context.fillStyle = "#c9f12a";
    [[30, 78], [218, 188]].forEach(([x, y], index) => {
      const size = index ? 4 : 6;
      context.fillRect(x - size, y, size * 3, size);
      context.fillRect(x, y - size, size, size * 3);
    });
  } else if (recipe.scene === 1) {
    context.fillStyle = accent;
    context.fillRect(218, 82, 7, 7);
    context.fillRect(218, 96, 7, 7);
    context.fillRect(218, 110, 7, 7);
  } else if (recipe.scene === 2) {
    context.fillStyle = accent;
    context.fillRect(35, 220, 186, 5);
    context.fillStyle = ink;
    context.fillRect(74, 228, 108, 3);
  } else if (recipe.scene === 3) {
    context.strokeStyle = accent;
    context.lineWidth = 4;
    context.strokeRect(24, 82, 24, 18);
    context.strokeRect(207, 188, 20, 15);
  }
  context.restore();
}

function renderSticker(canvas, index, recipe) {
  const logical = document.createElement("canvas");
  logical.width = 256;
  logical.height = 256;
  const context = logical.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.fillStyle = catProfile.outline ? colorToHex(catProfile.outline) : "#101d3d";
  context.fillRect(0, 0, 256, 256);
  context.fillStyle = recipe.background;
  context.fillRect(4, 4, 248, 248);
  context.fillStyle = "#fff9e8b8";
  roundedRect(context, 12, 12, 232, 232, 13);
  context.fill();
  if (recipe.frame === 1) {
    context.strokeStyle = "#101d3d";
    context.lineWidth = 3;
    context.strokeRect(10, 10, 236, 236);
    context.strokeStyle = "#fff8e7";
    context.lineWidth = 3;
    context.strokeRect(16, 16, 224, 224);
  } else if (recipe.frame === 2) {
    context.fillStyle = index % 2 ? "#c9f12a" : "#2368e8";
    context.fillRect(12, 220, 232, 14);
  }
  drawPixelScene(context, recipe);
  drawPoseArt(context, recipe);

  const captionWidth = clamp(76 + recipe.caption.length * 15, 116, 166);
  const captionX = recipe.captionRight ? 242 - captionWidth : 14;
  context.fillStyle = "#101d3d";
  context.fillRect(captionX, 12, captionWidth, 36);
  context.fillStyle = "#fff8e7";
  context.font = "900 17px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(recipe.caption, captionX + captionWidth / 2, 30);
  context.fillStyle = index % 2 ? "#2368e8" : "#ff6678";
  context.fillRect(recipe.captionRight ? 18 : 226, 18, 10, 10);
  context.fillStyle = "#c9f12a";
  context.fillRect(recipe.captionRight ? 33 : 213, 30, 8, 8);

  canvas.width = 512;
  canvas.height = 512;
  const output = canvas.getContext("2d");
  output.imageSmoothingEnabled = false;
  output.clearRect(0, 0, canvas.width, canvas.height);
  output.drawImage(logical, 0, 0, canvas.width, canvas.height);
}

function renderPack() {
  if (!poseSheetReady) return;
  if (packRecipe.length !== stickerCanvases.length) randomizePack();
  stickerCanvases.forEach((canvas, index) => {
    renderSticker(canvas, index, packRecipe[index]);
    canvas.closest("figure").querySelector("figcaption").textContent = packRecipe[index].caption;
  });
  const sheet = $("sheet");
  sheet.width = packColumns * 512;
  sheet.height = Math.ceil(stickerCanvases.length / packColumns) * 512;
  const context = sheet.getContext("2d");
  context.fillStyle = "#fff8e7";
  context.fillRect(0, 0, sheet.width, sheet.height);
  stickerCanvases.forEach((canvas, index) => {
    context.drawImage(canvas, (index % packColumns) * 512, Math.floor(index / packColumns) * 512, 512, 512);
  });
  updatePackPage();
}

function updatePackPage() {
  const pageSize = 6;
  const pageCount = Math.ceil(stickerCanvases.length / pageSize);
  packPage = clamp(packPage, 0, pageCount - 1);
  stickerCanvases.forEach((canvas, index) => {
    canvas.closest("figure").hidden = Math.floor(index / pageSize) !== packPage;
  });
  $("packPageLabel").textContent = `${packPage + 1} / ${pageCount}`;
  $("previousPackPage").disabled = packPage === 0;
  $("nextPackPage").disabled = packPage === pageCount - 1;
}

function applyCoatArchetype(archetype) {
  if (!catProfile) return;
  if (archetype === "photo_texture" && !catProfile.textureMaps) {
    archetype = catProfile.detectedArchetype || "orange_tabby";
  }
  const source = catProfile.sourceColors;
  const pale = luminance(source.light) > 164
    ? [...source.light]
    : mixColor(source.base, [250, 242, 222], .72);
  const dark = luminance(source.dark) < 128
    ? [...source.dark]
    : mixColor(source.base, [31, 32, 39], .72);
  const sampledWarm = [source.base, source.accent, source.warm]
    .sort((a, b) => warmthScore(b) - warmthScore(a))[0];
  const warm = warmthScore(sampledWarm) > .13 ? [...sampledWarm] : [207, 128, 53];

  let base = [...source.base];
  let accent = [...source.accent];
  let secondary = [...warm];
  let light = [...pale];
  let patternMode = "solid";

  if (archetype === "photo_texture") {
    base = [...source.base];
    accent = [...source.accent];
    secondary = [...source.warm];
    light = [...source.light];
    patternMode = "photo";
  } else if (archetype === "orange_tabby") {
    base = warmthScore(source.base) > .15 ? [...source.base] : [...warm];
    accent = mixColor(base, dark, .6);
    secondary = mixColor(base, [233, 159, 72], .28);
    light = mixColor(base, [255, 242, 210], .64);
    patternMode = "tabby";
  } else if (archetype === "brown_tabby") {
    base = colorSaturation(source.base) > .12 && luminance(source.base) > 62
      ? [...source.base]
      : [149, 111, 74];
    accent = mixColor(base, dark, .7);
    secondary = mixColor(base, warm, .28);
    light = mixColor(base, pale, .68);
    patternMode = "tabby";
  } else if (archetype === "silver_tabby") {
    const mid = luminance(source.base) > 105 ? source.base : source.light;
    base = neutralize(mid, .84);
    if (luminance(base) < 145) base = mixColor(base, [194, 199, 205], .58);
    accent = neutralize(dark, .88);
    secondary = mixColor(base, accent, .28);
    light = mixColor(base, [250, 250, 247], .72);
    patternMode = "tabby";
  } else if (archetype === "cow") {
    base = mixColor(pale, [255, 252, 244], .45);
    accent = neutralize(dark, .82);
    secondary = [...accent];
    light = [...base];
    patternMode = "cow";
  } else if (archetype === "tuxedo") {
    base = neutralize(dark, .82);
    accent = [...base];
    secondary = mixColor(base, pale, .16);
    light = mixColor(pale, [255, 252, 244], .48);
    patternMode = "bicolor";
  } else if (archetype === "calico") {
    base = mixColor(pale, [255, 250, 237], .48);
    accent = neutralize(dark, .78);
    secondary = [...warm];
    light = [...base];
    patternMode = "patches";
  } else if (archetype === "tortoiseshell") {
    base = neutralize(dark, .56);
    accent = [...warm];
    secondary = mixColor(warm, pale, .32);
    light = [...pale];
    patternMode = "patches";
  } else if (archetype === "siamese") {
    base = mixColor(pale, [239, 219, 181], .48);
    accent = mixColor(dark, [73, 51, 43], .46);
    secondary = mixColor(accent, base, .35);
    light = mixColor(base, [255, 248, 229], .52);
    patternMode = "points";
  } else if (archetype === "solid_black") {
    base = luminance(dark) < 78 ? [...dark] : [38, 40, 46];
    accent = mixColor(base, [255, 255, 255], .1);
    secondary = mixColor(base, [255, 255, 255], .18);
    light = mixColor(base, [255, 255, 255], .27);
  } else if (archetype === "solid_white") {
    base = mixColor(pale, [255, 253, 247], .66);
    accent = mixColor(base, [167, 177, 190], .14);
    secondary = mixColor(base, [229, 213, 199], .18);
    light = [255, 254, 250];
  } else if (archetype === "blue_gray") {
    const mid = neutralize(source.base, .84);
    base = luminance(mid) < 92 || luminance(mid) > 196 ? [127, 139, 153] : mid;
    accent = mixColor(base, [38, 46, 61], .36);
    secondary = mixColor(base, [154, 166, 180], .42);
    light = mixColor(base, [239, 242, 244], .55);
  } else if (archetype === "solid_color") {
    base = [...source.base];
    accent = mixColor(base, dark, .22);
    secondary = mixColor(base, warm, .22);
    light = mixColor(base, pale, .48);
  } else if (archetype === "spotted") {
    base = [...source.base];
    accent = colorDistance(base, dark) > 34 ? [...dark] : mixColor(base, [26, 31, 42], .62);
    secondary = [...warm];
    light = colorDistance(base, pale) > 24 ? [...pale] : mixColor(base, [255, 242, 210], .6);
    patternMode = "spotted";
  }

  if (colorDistance(base, accent) < 28 && !["photo_texture", "solid_black", "solid_white", "blue_gray", "solid_color"].includes(archetype)) {
    accent = mixColor(base, [28, 31, 42], .58);
  }
  catProfile.base = base;
  catProfile.accent = accent;
  catProfile.secondary = secondary;
  catProfile.light = light;
  catProfile.dark = [...dark];
  catProfile.patternMode = patternMode;
  catProfile.archetype = archetype;
  catProfile.type = coatLabels[archetype] || "常见猫型";
}

function renderSwatches() {
  const swatches = $("swatches");
  swatches.textContent = "";
  [catProfile.base, catProfile.accent, catProfile.secondary, catProfile.light].forEach(color => {
    const span = document.createElement("span");
    span.style.backgroundColor = colorToHex(color);
    swatches.appendChild(span);
  });
}

function showProfile() {
  randomizePack();
  renderSwatches();
  $("patternType").textContent = catProfile.type;
  $("patternOverride").value = catProfile.archetype;
  renderPack();
  showScreen("result");
}

function analyze() {
  if (viewNames.some(name => !viewState[name].image)) return;
  $("analyze").disabled = true;
  $("analyze").querySelector("span").textContent = "正在取样…";
  requestAnimationFrame(() => setTimeout(() => {
    try {
      buildProfile();
      showProfile();
    } catch (error) {
      $("analyze").disabled = false;
      $("analyze").querySelector("span").textContent = "再试一次";
      alert("这组照片没有取到足够的颜色，请换一张光线更清楚的照片。");
    }
  }, 30));
}

function setStatus(message) {
  $("status").textContent = message;
}

async function saveSheet() {
  const bridge = window.xhs && window.xhs.miniTool;
  if (!bridge || !bridge.writeTempFile || !bridge.saveImageToPhotosAlbum) {
    setStatus("正在生成整组 PNG…");
    const blob = await new Promise(resolve => $("sheet").toBlob(resolve, "image/png"));
    if (!blob) {
      setStatus("图片生成失败，请刷新后再试一次。");
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "猫纹像素所-十二格表情.png";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("整组 PNG 已下载，照片和成品都没有上传。");
    return;
  }
  try {
    setStatus("正在准备图片…");
    const { filePath } = await bridge.writeTempFile({ data: $("sheet").toDataURL("image/png") });
    await bridge.saveImageToPhotosAlbum({ filePath });
    setStatus("整组表情包已经保存到相册。");
  } catch (error) {
    setStatus("保存没有完成，请确认已经允许访问相册后再试一次。");
  }
}

async function postPack() {
  const bridge = window.xhs && window.xhs.miniTool;
  if (!bridge || !bridge.postNote) {
    await saveSheet();
    setStatus("整组 PNG 已下载；你可以把它分享到社交平台。小红书客户端内还支持直接带图发笔记。");
    return;
  }
  try {
    setStatus("正在把十二张表情带到发布页…");
    await bridge.postNote({
      title: "我家猫的像素表情包",
      content: "用三张照片取了它的毛色和花纹，做成一组像素表情。",
      pageType: "photo_publish",
      mediaInfo: {
        image_resources: stickerCanvases.map(canvas => ({ url: canvas.toDataURL("image/png") }))
      },
      tags: "#猫咪表情包 #像素画"
    });
    setStatus("已经打开发布页，原照片不会被带过去。");
  } catch (error) {
    setStatus("没有打开发布页，可以稍后再试。");
  }
}

viewNames.forEach(name => {
  $(`${name}Input`).addEventListener("change", event => loadView(name, event.target.files[0]));
  document.querySelector(`[data-view="${name}"] .photo-canvas`).addEventListener("pointerdown", event => setFocus(name, event));
});

$("start").addEventListener("click", () => showScreen("capture"));
$("captureBack").addEventListener("click", () => showScreen("landing"));
$("analyze").addEventListener("click", analyze);
$("demo").addEventListener("click", () => {
  buildDemoProfile();
  showProfile();
});
$("shuffle").addEventListener("click", () => {
  randomizePack();
  renderPack();
  setStatus("十二句台词换好了，猫的样子保持一致。");
});
$("previousPackPage").addEventListener("click", () => {
  packPage--;
  updatePackPage();
});
$("nextPackPage").addEventListener("click", () => {
  packPage++;
  updatePackPage();
});
$("patternOverride").addEventListener("change", event => {
  const requested = event.target.value;
  const missingPhotoTexture = requested === "photo_texture" && !catProfile.textureMaps;
  applyCoatArchetype(requested);
  event.target.value = catProfile.archetype;
  $("coatHint").value = catProfile.archetype;
  $("patternType").textContent = catProfile.type;
  renderSwatches();
  randomizePack();
  renderPack();
  setStatus(missingPhotoTexture
    ? "上传三张照片后才能使用原图纹样，现在先保留示例猫型。"
    : "纹样已切换，脸、背、胸、腿和尾巴都重新画了。");
});
$("backToPhotos").addEventListener("click", () => {
  updateUploadState();
  showScreen("capture");
});
$("retakeColor").addEventListener("click", () => {
  updateUploadState();
  showScreen("capture");
});
$("save").addEventListener("click", saveSheet);
$("post").addEventListener("click", postPack);
$("resetAll").addEventListener("click", () => location.reload());
addEventListener("resize", () => viewNames.forEach(name => {
  if (viewState[name].image) updateFocusDot(name);
}));

updateUploadState();

(function () {
function prettyLabel(obj) {
    return obj.replace(/\d+$/, '').replace(/_/g, ' ');
}

// Editing Comparison: per-object row showing input mesh + (representation, deformation)
// for Ours / WIR3D / ARAP. Files probed under static/images/comparison_editing/{obj}/.
// Missing files render as a striped empty cell (same UX as More Demo).
const comparisonEditingObjects = ["chair", "dragon", "nefertiti", "spot"];
const editingMethods = [
    { key: "fishbone", label: "Ours" },
    { key: "wir3d",    label: "WIR3D" },
    { key: "arap",     label: "ARAP" }
];
const editingTypes = [
    { key: "representation", label: "Representation" },
    { key: "deformation",    label: "Deformation" }
];

async function loadEditingComparison() {
    const container = document.getElementById('editing-comparison-items');
    if (!container) return;

    // Two header rows: top row groups each method across its 2 type columns.
    const topCells = [
        `<div class="editing-header-cell"></div>`,  // label column
        `<div class="editing-header-cell"></div>`,  // input column
        ...editingMethods.map(m =>
            `<div class="editing-header-cell editing-method-header" style="grid-column: span 2;">${m.label}</div>`
        )
    ].join('');
    const bottomCells = [
        `<div class="editing-header-cell"></div>`,
        `<div class="editing-header-cell">Input Mesh</div>`,
        ...editingMethods.flatMap(_ =>
            editingTypes.map(t => `<div class="editing-header-cell">${t.label}</div>`)
        )
    ].join('');
    container.insertAdjacentHTML('beforeend',
        `<div class="editing-header-row editing-header-top">${topCells}</div>` +
        `<div class="editing-header-row editing-header-bottom">${bottomCells}</div>`
    );

    // One row per object
    comparisonEditingObjects.forEach(obj => {
        const cells = [];
        // Input cell: {obj}/{obj}.png
        cells.push(`
          <div class="editing-cell">
            <img src="static/images/comparison_editing/${obj}/${obj}.png" alt="Input Mesh"
                 onerror="this.parentElement.classList.add('empty'); this.remove();">
          </div>`);
        // Method × type cells, with the convention:
        //   representation → {obj}/{method}.png
        //   deformation    → {obj}/{method}_deformation.png
        editingMethods.forEach(m => {
            editingTypes.forEach(t => {
                const filename = (t.key === 'representation')
                    ? `${m.key}.png`
                    : `${m.key}_${t.key}.png`;
                const src = `static/images/comparison_editing/${obj}/${filename}`;
                cells.push(`
                  <div class="editing-cell">
                    <img src="${src}" alt="${m.label} ${t.label}"
                         onerror="this.parentElement.classList.add('empty'); this.remove();">
                  </div>`);
            });
        });
        container.insertAdjacentHTML('beforeend',
            `<div class="editing-row">
              <div class="editing-row-label">${prettyLabel(obj)}</div>${cells.join('')}
            </div>`
        );
    });
}

window.addEventListener('DOMContentLoaded', loadEditingComparison);

// Ablation Branching: per-object row showing input + (w/o branching) spine + (w/) spine.
// Files probed under static/images/ablation_branch/{obj}/ with the convention:
//   input            → {obj}.png
//   w/o branching    → {obj}_ablation_branching_spine.png
//   w/ branching     → {obj}_spine.png
const ablationBranchObjects = ["hand", "horse", "monstera_tree", "mushroom", "plant5", "threepeople"];

function loadAblationBranch() {
    const container = document.getElementById('ablation-branch-items');
    if (!container) return;

    const headerCells = [
        `<div class="ablation-header-cell"></div>`,
        `<div class="ablation-header-cell">Input Mesh</div>`,
        `<div class="ablation-header-cell">Rib</div>`,
        `<div class="ablation-header-cell">w/ Branching (Ours)</div>`,
        `<div class="ablation-header-cell">w/o Branching</div>`
    ].join('');
    container.insertAdjacentHTML('beforeend',
        `<div class="ablation-header-row">${headerCells}</div>`
    );

    ablationBranchObjects.forEach(obj => {
        const files = [
            { src: `${obj}.png`,                              alt: "Input Mesh" },
            { src: `${obj}_rib.png`,                          alt: "Rib" },
            { src: `${obj}_spine.png`,                        alt: "w/ Branching (Ours)" },
            { src: `${obj}_ablation_branching_spine.png`,     alt: "w/o Branching" }
        ];
        const cells = files.map(f => `
          <div class="editing-cell">
            <img src="static/images/ablation_branch/${obj}/${f.src}" alt="${f.alt}"
                 onerror="this.parentElement.classList.add('empty'); this.remove();">
          </div>`).join('');
        container.insertAdjacentHTML('beforeend',
            `<div class="ablation-row">
              <div class="ablation-row-label">${prettyLabel(obj)}</div>${cells}
            </div>`
        );
    });
}

window.addEventListener('DOMContentLoaded', loadAblationBranch);

// Ablation: Rib Extraction Design Choices.
// Files probed under static/images/ablation_rib/{obj}/.
// TODO: fill in variant filenames once user finalizes the rename scheme.
const ablationRibObjects = ["banana", "bear", "right_leg", "plant"];
const ablationRibColumns = [
    { src: "{obj}.png",                    label: "Input Mesh" },
    { src: "{obj}_rib.png",                label: "Ours" },
    { src: "{obj}_grid.png",               label: "w/o Heat Method" },
    { src: "{obj}_ablation_axis_rib.png",  label: "w/o Auto Root-axis" },
    { src: "{obj}_ablation_K5_rib.png",    label: "w/o adaptive level count (K=5)" },
    { src: "{obj}_ablation_K10_rib.png",   label: "w/o adaptive level count (K=10)" },
    { src: "{obj}_ablation_K15_rib.png",   label: "w/o adaptive level count (K=15)" }
];

function loadAblationRib() {
    const container = document.getElementById('ablation-rib-items');
    if (!container || ablationRibColumns.length === 0) return;

    const colCount = ablationRibColumns.length;
    const headerCells = [
        `<div class="ablation-header-cell"></div>`,
        ...ablationRibColumns.map(c => `<div class="ablation-header-cell">${c.label}</div>`)
    ].join('');
    container.insertAdjacentHTML('beforeend',
        `<div class="ablation-header-row" style="grid-template-columns: 110px repeat(${colCount}, 1fr);">${headerCells}</div>`
    );

    ablationRibObjects.forEach(obj => {
        const cells = ablationRibColumns.map(c => {
            const src = c.src.replace(/\{obj\}/g, obj);
            return `
              <div class="editing-cell">
                <img src="static/images/ablation_rib/${obj}/${src}" alt="${c.label}"
                     onerror="this.parentElement.classList.add('empty'); this.remove();">
              </div>`;
        }).join('');
        container.insertAdjacentHTML('beforeend',
            `<div class="ablation-row" style="grid-template-columns: 110px repeat(${colCount}, 1fr);">
              <div class="ablation-row-label">${prettyLabel(obj)}</div>${cells}
            </div>`
        );
    });
}

window.addEventListener('DOMContentLoaded', loadAblationRib);

// Ablation: Score-maximization vs. Midplane Center.
// Files probed under static/images/ablation_spine/{obj}/.
const ablationSpineObjects = ["banana", "bird2"];
const ablationSpineColumns = [
    { src: "{obj}.png",        label: "Input Mesh" },
    { src: "{obj}_rib.png",    label: "Rib" },
    { src: "{obj}_spine.png",  label: "Score Maximization Spine (Ours)" },
    { src: "{obj}_center.png", label: "Center Spine" }
];

function loadAblationSpine() {
    const container = document.getElementById('ablation-spine-items');
    if (!container) return;

    const colCount = ablationSpineColumns.length;
    const headerCells = [
        `<div class="ablation-header-cell"></div>`,
        ...ablationSpineColumns.map(c => `<div class="ablation-header-cell">${c.label}</div>`)
    ].join('');
    container.insertAdjacentHTML('beforeend',
        `<div class="ablation-header-row" style="grid-template-columns: 110px repeat(${colCount}, 1fr);">${headerCells}</div>`
    );

    ablationSpineObjects.forEach(obj => {
        const cells = ablationSpineColumns.map(c => {
            const src = c.src.replace(/\{obj\}/g, obj);
            return `
              <div class="editing-cell">
                <img src="static/images/ablation_spine/${obj}/${src}" alt="${c.label}"
                     onerror="this.parentElement.classList.add('empty'); this.remove();">
              </div>`;
        }).join('');
        container.insertAdjacentHTML('beforeend',
            `<div class="ablation-row" style="grid-template-columns: 110px repeat(${colCount}, 1fr);">
              <div class="ablation-row-label">${prettyLabel(obj)}</div>${cells}
            </div>`
        );
    });
}

window.addEventListener('DOMContentLoaded', loadAblationSpine);

// Ablation: Mesh Lifting. Files under static/images/ablation_meshlifting/{obj}/.
const ablationMeshliftingObjects = ["bird", "spot"];
const ablationMeshliftingColumns = [
    { src: "{obj}.png",               label: "Input Mesh" },
    { src: "{obj}_cylindrical.png",   label: "Cylindrical (Ours)" },
    { src: "{obj}_displacement.png",  label: "Displacement" }
];

function loadAblationMeshlifting() {
    const container = document.getElementById('ablation-meshlifting-items');
    if (!container) return;

    const colCount = ablationMeshliftingColumns.length;
    const headerCells = [
        `<div class="ablation-header-cell"></div>`,
        ...ablationMeshliftingColumns.map(c => `<div class="ablation-header-cell">${c.label}</div>`)
    ].join('');
    container.insertAdjacentHTML('beforeend',
        `<div class="ablation-header-row" style="grid-template-columns: 110px repeat(${colCount}, 1fr);">${headerCells}</div>`
    );

    ablationMeshliftingObjects.forEach(obj => {
        const cells = ablationMeshliftingColumns.map(c => {
            const src = c.src.replace(/\{obj\}/g, obj);
            return `
              <div class="editing-cell">
                <img src="static/images/ablation_meshlifting/${obj}/${src}" alt="${c.label}"
                     onerror="this.parentElement.classList.add('empty'); this.remove();">
              </div>`;
        }).join('');
        container.insertAdjacentHTML('beforeend',
            `<div class="ablation-row" style="grid-template-columns: 110px repeat(${colCount}, 1fr);">
              <div class="ablation-row-label">${prettyLabel(obj)}</div>${cells}
            </div>`
        );
    });
}

window.addEventListener('DOMContentLoaded', loadAblationMeshlifting);

// 3D Shape Generation: 16 shape folders × 8 image columns per manifest.txt.
// Files under static/images/3Dshape_generation/{folder}/{col}.png.
const shapeGenFolders = [
    "dit_last_v8c_aronly_000ab8f3_4parts_view_00_az000",
    "dit_last_v8c_aronly_000bb354_3parts_view_03_az090",
    "dit_last_v8c_aronly_000c8272_4parts_view_02_az060",
    "dit_last_v8c_aronly_000e4ba3_7parts_view_08_az240",
    "dit_last_v8c_aronly_000f4ec7_8parts_view_01_az030",
    "dit_last_v8c_aronly_0005bedb_8parts_view_09_az270",
    "dit_last_v8c_aronly_0014b1af_14parts_view_09_az270",
    "dit_last_v8c_aronly_0014c111_7parts_view_04_az120",
    "dit_last_v8c_aronly_00057aef_7parts_view_11_az330",
    "dit_last_v8c_aronly_001318af_16parts_view_00_az000",
    "dit_last_v8c_aronly_001354e5_7parts_view_05_az150",
    "dit_last_v8c_aronly_00079311_2parts_view_04_az120",
    "dit_last_v8c_aronly_00089638_16parts_view_06_az180",
    "dit_last_v8c_aronly_000faf5e_7parts_view_03_az090",
    "dit_last_v8c_aronly_0000c32f_10parts_view_06_az180",
    "dit_last_v8c_aronly_000b76f2_10parts_view_04_az120"
];
const shapeGenColumns = [
    { file: "input.png",      label: "Input" },
    { file: "gt.png",         label: "GT" },
    { file: "gt_rib.png",     label: "GT Rib" },
    { file: "gt_spine.png",   label: "GT Spine" },
    { file: "baseline.png",   label: "PartCrafter" },
    { file: "ours_mesh.png",  label: "Ours (Mesh)" },
    { file: "ours_rib.png",   label: "Ours (Rib)" },
    { file: "ours_spine.png", label: "Ours (Spine)" }
];

function loadShapeGeneration() {
    const container = document.getElementById('shape-generation-items');
    if (!container) return;

    const colCount = shapeGenColumns.length;
    const headerCells = [
        `<div class="ablation-header-cell"></div>`,
        ...shapeGenColumns.map(c => `<div class="ablation-header-cell">${c.label}</div>`)
    ].join('');
    container.insertAdjacentHTML('beforeend',
        `<div class="ablation-header-row" style="grid-template-columns: 50px repeat(${colCount}, 1fr);">${headerCells}</div>`
    );

    shapeGenFolders.forEach((folder, i) => {
        const cells = shapeGenColumns.map(c => `
          <div class="editing-cell">
            <img src="static/images/3Dshape_generation/${folder}/${c.file}" alt="${c.label}"
                 onerror="this.parentElement.classList.add('empty'); this.remove();">
          </div>`).join('');
        const idx = String(i + 1).padStart(2, '0');
        container.insertAdjacentHTML('beforeend',
            `<div class="ablation-row" style="grid-template-columns: 50px repeat(${colCount}, 1fr);">
              <div class="ablation-row-label">${idx}</div>${cells}
            </div>`
        );
    });
}

window.addEventListener('DOMContentLoaded', loadShapeGeneration);

// Auto-populate the top comparison sliders from demo/ folder.
// For each demoObject, checks whether both {obj}.png and {obj}_fishbone.png exist;
// takes the first 2 matches and renders them as 2-image comparison sliders.
function checkImageExists(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

function buildSliderItem(c, id) {
    return `
      <div${id ? ` id="${id}"` : ''} class="image-comparison-container" data-comparison-slider>
        <div class="comparison-slider">
          <div class="comparison-slider-top"><img src="${c.base}" alt="Input"></div>
          <div class="comparison-slider-middle"><img src="${c.fishbone}" alt="Fishbone"></div>
          <div class="comparison-slider-divider comparison-slider-divider-1" aria-hidden="true"></div>
          <div class="comparison-slider-handle comparison-slider-handle-1" role="slider"
               aria-label="Image comparison slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"
               data-slider-id="1">
            <div class="comparison-slider-icon">
              <span class="comparison-slider-arrow left"></span>
              <span class="comparison-slider-arrow right"></span>
            </div>
          </div>
          <div class="comparison-label comparison-label-left">Input</div>
          <div class="comparison-label comparison-label-right">Fishbone</div>
        </div>
      </div>`;
}

async function loadComparisonSliders() {
    const wrapper = document.getElementById('comparison-carousel-wrapper');
    const viewport = document.getElementById('comparison-carousel-viewport');
    const track = document.getElementById('comparison-carousel-track');
    if (!track) return;

    const candidates = [];
    for (const obj of demoObjects) {
        const base = `static/images/demo/${obj}/${obj}.png`;
        const fishbone = `static/images/demo/${obj}/${obj}_fishbone.png`;
        const [a, b] = await Promise.all([checkImageExists(base), checkImageExists(fishbone)]);
        if (a && b) candidates.push({ obj, base, fishbone });
    }

    if (candidates.length === 0) {
        if (wrapper) wrapper.style.display = 'none';
        return;
    }

    const realCount = candidates.length;

    // Render real items, tagging each with a candidate index used to sync
    // its position state across cloned siblings.
    candidates.forEach((c, i) => {
        track.insertAdjacentHTML('beforeend', buildSliderItem(c, `image-slider-${i + 1}`));
    });
    const realElements = Array.from(track.querySelectorAll('.image-comparison-container'));
    realElements.forEach((el, i) => {
        el.dataset.carouselIdx = i;
        new ImageComparisonSlider(el);
    });

    // Clone one full set on each side for the infinite-cycle illusion.
    // Final layout: [clones, real, clones]. virtualIndex starts at the first real
    // item; when an arrow step pushes us fully into a clone block we silently
    // re-anchor to the equivalent real index after the transition completes.
    const firstReal = realElements[0];
    realElements.forEach(el => {
        const clone = el.cloneNode(true);
        clone.removeAttribute('id');
        clone.dataset.clone = 'true';
        track.appendChild(clone);
        new ImageComparisonSlider(clone);
    });
    realElements.forEach(el => {
        const clone = el.cloneNode(true);
        clone.removeAttribute('id');
        clone.dataset.clone = 'true';
        track.insertBefore(clone, firstReal);
        new ImageComparisonSlider(clone);
    });

    // When the user drags a slider handle on any one instance (real or clone),
    // mirror the new position to every other instance with the same idx so the
    // carousel doesn't appear to "snap back" on rotation.
    track.addEventListener('slider:position', (e) => {
        const origin = e.target.closest('.image-comparison-container');
        if (!origin) return;
        const idx = origin.dataset.carouselIdx;
        if (idx == null) return;
        const peers = track.querySelectorAll(
            `.image-comparison-container[data-carousel-idx="${idx}"]`);
        peers.forEach(peer => {
            if (peer === origin) return;
            const inst = peer.__sliderInstance;
            if (inst) inst.setPosition(e.detail.slider1Position, e.detail.slider2Position);
        });
    });

    const TRANSITION_MS = 400;
    const getStep = () => {
        const first = track.querySelector('.image-comparison-container');
        if (!first) return 0;
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
        return first.getBoundingClientRect().width + gap;
    };

    let virtualIndex = realCount;  // start at first real item
    let isAnimating = false;

    const setTransform = (animate) => {
        const step = getStep();
        track.style.transition = animate
            ? `transform ${TRANSITION_MS}ms ease`
            : 'none';
        track.style.transform = `translateX(${-virtualIndex * step}px)`;
    };

    // Initial position (no animation)
    requestAnimationFrame(() => setTransform(false));

    const wrapIfNeeded = () => {
        if (virtualIndex >= 2 * realCount) {
            virtualIndex -= realCount;
            setTransform(false);
        } else if (virtualIndex < realCount) {
            virtualIndex += realCount;
            setTransform(false);
        }
    };

    const stepBy = (dir) => {
        if (isAnimating) return;
        isAnimating = true;
        virtualIndex += dir;
        setTransform(true);
        setTimeout(() => {
            wrapIfNeeded();
            isAnimating = false;
        }, TRANSITION_MS + 20);
    };

    const prevBtn = document.getElementById('comparison-carousel-prev');
    const nextBtn = document.getElementById('comparison-carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', () => stepBy(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => stepBy(1));

    // Touch swipe support
    let touchStartX = 0, touchDeltaX = 0, touchActive = false;
    viewport.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
        touchActive = true;
    }, { passive: true });
    viewport.addEventListener('touchmove', e => {
        if (!touchActive) return;
        touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });
    viewport.addEventListener('touchend', () => {
        if (!touchActive) return;
        touchActive = false;
        if (Math.abs(touchDeltaX) > 50) {
            stepBy(touchDeltaX < 0 ? 1 : -1);
        }
    });

    // Re-position on resize so step recomputes correctly
    window.addEventListener('resize', () => setTransform(false));
}

window.addEventListener('DOMContentLoaded', loadComparisonSliders);

// Ensure all videos play and loop properly
function ensureVideoPlayback() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Force reload and play
        video.load();

        // Handle play promise
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Auto-play prevented:', error);
                // Try playing on user interaction
                document.addEventListener('click', () => {
                    video.play().catch(e => console.log('Play failed:', e));
                }, { once: true });
            });
        }

        // Ensure looping when video ends
        video.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        });

        // Handle stalling
        video.addEventListener('stalled', function() {
            console.log('Video stalled, reloading...');
            this.load();
            this.play();
        });

        // Handle errors
        video.addEventListener('error', function(e) {
            console.error('Video error:', e);
            setTimeout(() => {
                this.load();
                this.play();
            }, 1000);
        });
    });
}

window.addEventListener('DOMContentLoaded', ensureVideoPlayback);

// Lightbox: click .agent-screenshot to enlarge; click overlay or press Esc to close.
function setupLightbox() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<img class="lightbox-image" alt="">';
    document.body.appendChild(overlay);
    const imgEl = overlay.querySelector('.lightbox-image');

    function open(src, alt) {
        imgEl.src = src;
        imgEl.alt = alt || '';
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        // Clear src after transition so it doesn't flash on next open
        setTimeout(() => { if (!overlay.classList.contains('open')) imgEl.src = ''; }, 200);
    }

    // Click outside the image closes; clicks on the image itself do not bubble out.
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    imgEl.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    document.querySelectorAll('.agent-screenshot').forEach(img => {
        img.addEventListener('click', () => open(img.src, img.alt));
    });
}
window.addEventListener('DOMContentLoaded', setupLightbox);
})();

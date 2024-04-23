function appHeight() {
    const doc = document.documentElement
    // const currentHeight = window.outerHeight > window.innerHeight ? window.innerHeight : window.outerHeight
    const currentHeight = window.innerHeight;
    console.log(window.innerHeight, window.outerHeight, currentHeight)
    doc.style.setProperty('--app-height', `${currentHeight}px`)
    const videoTag = document.getElementById('video')
    videoTag.style.height = `calc(var(--app-height) - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 60px)`
    setTimeout(() => {
        videoTag.style.display = 'none';  // Trigger repaint
        videoTag.offsetHeight;  // Force reflow
        videoTag.style.display = '';
    }, 500)
}
window.addEventListener('resize', appHeight)
const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--story-picture-width-large') != null && rootStyles.getPropertyValue('--story-picture-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
  const imageWidth = parseFloat(rootStyles.getPropertyValue('--story-picture-width-large'))
  const imageAspectRatio = parseFloat(rootStyles.getPropertyValue('--story-picture-aspect-ratio'))
  const imageHeight = imageWidth / imageAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / imageAspectRatio,
    imageResizeTargetWidth: imageWidth,
    imageResizeTargetHeight: imageHeight
  })
  
  FilePond.parse(document.body)
}
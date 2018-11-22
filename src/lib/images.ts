const ImageTypes = ['.jpg', '.jpeg', '.png', '.tif']

export const openImagePicker = (): Promise<File> =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = ImageTypes.join(',')
    input.addEventListener('change', () => {
      if (input.files && input.files.length) {
        resolve(input.files[0])
      } else {
        reject(new Error('No file was received'))
      }
    })
    input.click()
  })

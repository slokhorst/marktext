import fs from 'fs-extra'
import path from 'path'
import axios from 'axios'
import { SpellChecker } from '@hfelix/electron-spellchecker'
import { dictionaryPath } from '../spellchecker'

/**
 * Try to download the given Hunspell dictionary.
 *
 * @param {string} lang The language to download.
 */
export const downloadHunspellDictionary = async lang => {
  const url = SpellChecker.getURLForHunspellDictionary(lang)
  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream'
  })

  const dstFile = path.join(dictionaryPath, `${lang}.bdic`)
  const tmpFile = `${dstFile}.tmp`
  return new Promise((resolve, reject) => {
    const outStream = fs.createWriteStream(tmpFile)
    response.data.pipe(outStream)

    let totalLength = 0
    response.data.on('data', chunk => {
      totalLength += chunk.length
    })

    outStream.once('error', reject)
    outStream.once('finish', async () => {
      if (totalLength < 8 * 1024) {
        throw new Error('Dictionary is most likely bogus.')
      }

      await fs.move(tmpFile, dstFile, { overwrite: true })
      resolve()
    })
  })
}

/**
 * Delete the given Hunspell dictionary from disk.
 *
 * @param {string} lang The language to remove.
 */
export const deleteHunspellDictionary = async lang => {
  return await fs.remove(path.join(dictionaryPath, `${lang}.bdic`))
}

import path from 'path'
import { ipcRenderer } from 'electron'
import { isChildOfDirectory } from 'common/filesystem/paths'
import bus from '../bus'
import { delay } from '@/util'
import FileSearcher from '@/node/fileSearcher'

const MD_EXTENSION = /\.markdown|\.mdown|\.mkdn|\.md|\.mkd|\.mdwn|\.mdtxt|\.mdtext|\.text|\.txt$/i
const SPECIAL_CHARS = /[\[\]\\^$.\|\?\*\+\(\)\/]{1}/g // eslint-disable-line no-useless-escape

// The quick open command
class QuickOpenCommand {
  constructor (rootState) {
    this.id = 'file.quick-open'
    this.description = 'File: Quick Open'
    this.shortcut = null

    this.subcommands = []
    this.subcommandSelectedIndex = -1

    // Reference to folder and editor and project state.
    this._editorState = rootState.editor
    this._folderState = rootState.project

    this._directorySearcher = new FileSearcher()
    this._cancelFn = null
  }

  search = async query => {
    // Show opened files when no query given.
    if (!query) {
      return this.subcommands
    }

    const { _cancelFn } = this
    if (_cancelFn) {
      _cancelFn()
      this._cancelFn = null
    }

    const timeout = delay(300)
    this._cancelFn = () => {
      timeout.cancel()
      this._cancelFn = null
    }

    await timeout
    return await this._doSearch(query)
  }

  run = async () => {
    const { _editorState, _folderState } = this
    if (!_folderState.projectTree && _editorState.tabs.length === 0) {
      throw new Error(null)
    }

    this.subcommands = _editorState.tabs
      .map(t => t.pathname)
      // Filter untitled tabs
      .filter(t => !!t)
      .map(pathname => {
        const item = { id: pathname }
        Object.assign(item, this._getPath(pathname))
        return item
      })
  }

  execute = async () => {
    // Timeout to hide the command palette and then show again to prevent issues.
    await delay(100)
    bus.$emit('show-command-palette', this)
  }

  executeSubcommand = async id => {
    const { windowId } = global.marktext.env
    ipcRenderer.send('mt::open-file-by-window-id', windowId, id)
  }

  unload = () => {
    this.subcommands = []
  }

  // --- private ------------------------------------------

  _doSearch = async query => {
    this._cancelFn = null
    const { _editorState, _folderState } = this
    const isRootDirOpened = !!_folderState.projectTree
    const tabsAvailable = _editorState.tabs.length > 0

    // Only show opened files if no directory is opened.
    if (!isRootDirOpened && !tabsAvailable) {
      return []
    }

    const searchResult = []
    const rootPath = isRootDirOpened ? _folderState.projectTree.pathname : null

    // Add files that are not in the current root directory but opened.
    if (tabsAvailable) {
      const re = new RegExp(query.replace(SPECIAL_CHARS, p => {
        if (p === '*') return '.*'
        return p === '\\' ? '\\\\' : `\\${p}`
      }), 'i')

      for (const tab of _editorState.tabs) {
        const { pathname } = tab
        if (pathname && re.test(pathname) &&
          (!rootPath || !isChildOfDirectory(rootPath, pathname))
        ) {
          searchResult.push(pathname)
        }
      }
    }

    if (!isRootDirOpened) {
      return searchResult
        .map(pathname => {
          return {
            id: pathname,
            description: pathname,
            title: pathname
          }
        })
    }

    // Search root directory on disk.
    return new Promise((resolve, reject) => {
      let canceled = false
      const promises = this._directorySearcher.search([rootPath], '', {
        didMatch: result => {
          if (canceled) return
          searchResult.push(result)
        },
        didSearchPaths: numPathsFound => {
          // Cancel when more than 30 files were found. User should specify the search query.
          if (!canceled && numPathsFound > 30) {
            canceled = true
            if (promises.cancel) {
              promises.cancel()
            }
          }
        },

        // Only search markdown files that contain the query string.
        inclusions: this._getInclusions(query)
      })
        .then(() => {
          this._cancelFn = null
          resolve(
            searchResult
              .map(pathname => {
                const item = { id: pathname }
                Object.assign(item, this._getPath(pathname))
                return item
              })
          )
        })
        .catch(error => {
          this._cancelFn = null
          reject(error)
        })

      this._cancelFn = () => {
        this._cancelFn = null
        canceled = true
        if (promises.cancel) {
          promises.cancel()
        }
      }
    })
  }

  _getInclusions = query => {
    if (MD_EXTENSION.test(query)) {
      return [query]
    }

    const inclusions = ['*.markdown', '*.mdown', '*.mkdn', '*.md', '*.mkd', '*.mdwn', '*.mdtxt', '*.mdtext', '*.text', '*.txt']
    for (let i = 0; i < inclusions.length; ++i) {
      inclusions[i] = `${query}` + inclusions[i]
    }
    return inclusions
  }

  _getPath = pathname => {
    const rootPath = this._folderState.projectTree.pathname
    if (!isChildOfDirectory(rootPath, pathname)) {
      return { title: pathname, description: pathname }
    }
    return { description: path.relative(rootPath, pathname) }
  }
}

export default QuickOpenCommand

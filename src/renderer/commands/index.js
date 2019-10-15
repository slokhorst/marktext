// List of all static commands that are loaded into command center.
import { ipcRenderer, remote, shell } from 'electron'
import bus from '../bus'
import { isOsx } from '@/util'
import { isUpdatable } from './utils'

export { default as FileEncodingCommand } from './fileEncoding'
export { default as LineEndingCommand } from './lineEnding'
export { default as QuickOpenCommand } from './quickOpen'

// ----------------------------------------------------------------------------

// TODO: Load shortcuts from main process.
// TODO: Only execute command if it not "disabled"/ not allowed by Editor/Muya

// ----------------------------------------------------------------------------

export class RootCommand {
  constructor (subcommands = []) {
    this.id = '#'
    this.description = '#'
    this.subcommands = subcommands
    this.subcommandSelectedIndex = -1
  }

  async run () {}
  async unload () {}

  // Execute the command.
  async execute () {
    throw new Error('Root command.')
  }
}

const commands = [
  // --------------------------------------------------------------------------
  // File

  {
    id: 'file.new-tab',
    description: 'File: New Tab',
    execute: async () => {
      ipcRenderer.emit('mt::new-untitled-tab', null)
    }
  }, {
    id: 'file.new-file',
    description: 'File: New Window',
    execute: async () => {
      ipcRenderer.send('mt::cmd-new-editor-window')
    }
  }, {
    id: 'file.open-file',
    description: 'File: Open file',
    execute: async () => {
      ipcRenderer.send('mt::cmd-open-file')
    }
  }, {
    id: 'file.open-folder',
    description: 'File: Open Folder',
    execute: async () => {
      ipcRenderer.send('mt::cmd-open-folder')
    }
  }, {
    id: 'file.save',
    description: 'File: Save',
    execute: async () => {
      ipcRenderer.emit('mt::editor-ask-file-save', null)
    }
  }, {
    id: 'file.save-as',
    description: 'File: Save As',
    execute: async () => {
      ipcRenderer.emit('mt::editor-ask-file-save-as', null)
    }
  }, {
    id: 'file.print',
    description: 'File: Print current Tab',
    execute: async () => {
      ipcRenderer.emit('mt::show-export-dialog', null, 'print')
    }
  }, {
    id: 'file.close-tab',
    description: 'File: Close current Tab',
    execute: async () => {
      ipcRenderer.emit('mt::editor-close-tab', null)
    }
  }, {
    id: 'file.close-window',
    description: 'File: Close Window',
    execute: async () => {
      ipcRenderer.send('mt::cmd-close-window')
    }
  },

  {
    id: 'file.toggle-auto-save',
    description: 'File: Toggle Auto Save',
    execute: async () => {
      ipcRenderer.send('mt::cmd-toggle-autosave')
    }
  }, {
    id: 'file.move-file',
    description: 'File: Move...',
    execute: async () => {
      ipcRenderer.emit('mt::editor-move-file', null)
    }
  }, {
    id: 'file.rename-file',
    description: 'File: Rename...',
    execute: async () => {
      ipcRenderer.emit('mt::editor-rename-file', null)
    }
  }, {
    id: 'file.import-file',
    description: 'File: Import...',
    execute: async () => {
      ipcRenderer.send('mt::cmd-import-file')
    }
  }, {
    id: 'file.export-file',
    description: 'File: Export...',
    subcommands: [{
      id: 'file.export-file-html',
      description: 'HTML',
      execute: async () => {
        bus.$emit('export', 'styledHtml')
      }
    }, {
      id: 'file.export-file-pdf',
      description: 'PDF',
      execute: async () => {
        bus.$emit('export', 'pdf')
      }
    }]
  },

  // --------------------------------------------------------------------------
  // Edit

  {
    id: 'edit.undo',
    description: 'Edit: Undo',
    execute: async () => {
      bus.$emit('undo', 'undo')
    }
  }, {
    id: 'edit.redo',
    description: 'Edit: Redo',
    execute: async () => {
      bus.$emit('redo', 'redo')
    }
  }, {
    id: 'edit.duplicate',
    description: 'Edit: Duplicate',
    execute: async () => {
      bus.$emit('duplicate', 'duplicate')
    }
  }, {
    id: 'edit.create-paragraph',
    description: 'Edit: Create Paragraph',
    execute: async () => {
      bus.$emit('createParagraph', 'createParagraph')
    }
  }, {
    id: 'edit.delete-paragraph',
    description: 'Edit: Delete Paragraph',
    execute: async () => {
      bus.$emit('deleteParagraph', 'deleteParagraph')
    }
  }, {
    id: 'edit.find',
    description: 'Edit: Find',
    execute: async () => {
      setTimeout(() => bus.$emit('find', 'find'), 150)
    }
  }, {
    id: 'edit.find-next',
    description: 'Edit: Find Next',
    execute: async () => {
      setTimeout(() => bus.$emit('fineNext', 'fineNext'), 150)
    }
  }, {
    id: 'edit.find-previous',
    description: 'Edit: Find Previous',
    execute: async () => {
      setTimeout(() => bus.$emit('findPrev', 'findPrev'), 150)
    }
  }, {
    id: 'edit.replace',
    description: 'Edit: Replace',
    execute: async () => {
      setTimeout(() => bus.$emit('replace', 'replace'), 150)
    }
  }, {
    id: 'edit.find-in-folder',
    description: 'Edit: Find in Folder',
    execute: async () => {
      setTimeout(() => bus.$emit('findInFolder', 'findInFolder'), 150)
    }
  }, {
    id: 'edit.aidou',
    description: 'Edit: Aidou',
    execute: async () => {
      bus.$emit('aidou', 'aidou')
    }
  },

  // --------------------------------------------------------------------------
  // Paragraph

  {
    id: 'paragraph.heading-1',
    description: 'Paragraph: Heading 1',
    execute: async () => {
      bus.$emit('paragraph', 'heading 1')
    }
  }, {
    id: 'paragraph.heading-2',
    description: 'Paragraph: Heading 2',
    execute: async () => {
      bus.$emit('paragraph', 'heading 2')
    }
  }, {
    id: 'paragraph.heading-3',
    description: 'Paragraph: Heading 3',
    execute: async () => {
      bus.$emit('paragraph', 'heading 3')
    }
  }, {
    id: 'paragraph.heading-4',
    description: 'Paragraph: Heading 4',
    execute: async () => {
      bus.$emit('paragraph', 'heading 4')
    }
  }, {
    id: 'paragraph.heading-5',
    description: 'Paragraph: Heading 5',
    execute: async () => {
      bus.$emit('paragraph', 'heading 5')
    }
  }, {
    id: 'paragraph.heading-6',
    description: 'Paragraph: Heading 6',
    execute: async () => {
      bus.$emit('paragraph', 'heading 6')
    }
  }, {
    id: 'paragraph.upgrade-heading',
    description: 'Paragraph: Upgrade Heading',
    execute: async () => {
      bus.$emit('paragraph', 'upgrade heading')
    }
  }, {
    id: 'paragraph.degrade-heading',
    description: 'Paragraph: Degrade Heading',
    execute: async () => {
      bus.$emit('paragraph', 'degrade heading')
    }
  }, {
    id: 'paragraph.table',
    description: 'Paragraph: Create table',
    execute: async () => {
      bus.$emit('paragraph', 'table')
    }
  }, {
    id: 'paragraph.code-fence',
    description: 'Paragraph: Create Code Fence',
    execute: async () => {
      bus.$emit('paragraph', 'pre')
    }
  }, {
    id: 'paragraph.quote-block',
    description: 'Paragraph: Quote Block',
    execute: async () => {
      bus.$emit('paragraph', 'blockquote')
    }
  }, {
    id: 'paragraph.math-formula',
    description: 'Paragraph: Math Formula',
    execute: async () => {
      bus.$emit('paragraph', 'mathblock')
    }
  }, {
    id: 'paragraph.html-block',
    description: 'Paragraph: HTML Block',
    execute: async () => {
      bus.$emit('paragraph', 'html')
    }
  }, {
    id: 'paragraph.order-list',
    description: 'Paragraph: Create Order List',
    execute: async () => {
      bus.$emit('paragraph', 'ol-bullet')
    }
  }, {
    id: 'paragraph.bullet-list',
    description: 'Paragraph: Create Bullet List',
    execute: async () => {
      bus.$emit('paragraph', 'ul-bullet')
    }
  }, {
    id: 'paragraph.task-list',
    description: 'Paragraph: Create Task List',
    execute: async () => {
      bus.$emit('paragraph', 'ul-task')
    }
  }, {
    id: 'paragraph.loose-list-item',
    description: 'Paragraph: Convert to Loose List Item',
    execute: async () => {
      bus.$emit('paragraph', 'loose-list-item')
    }
  }, {
    id: 'paragraph.paragraph',
    description: 'Paragraph: Paragraph',
    execute: async () => {
      bus.$emit('paragraph', 'paragraph')
    }
  }, {
    id: 'paragraph.horizontal-line',
    description: 'Paragraph: Insert Horizontal Line',
    execute: async () => {
      bus.$emit('paragraph', 'hr')
    }
  }, {
    id: 'paragraph.front-matter',
    description: 'Paragraph: Insert Front Matter',
    execute: async () => {
      bus.$emit('paragraph', 'front-matter')
    }
  },

  // --------------------------------------------------------------------------
  // Format

  {
    id: 'format.strong',
    description: 'Format: Strong',
    execute: async () => {
      bus.$emit('format', 'strong')
    }
  }, {
    id: 'format.emphasis',
    description: 'Format: Emphasis',
    execute: async () => {
      bus.$emit('format', 'em')
    }
  }, {
    id: 'format.underline',
    description: 'Format: Underline',
    execute: async () => {
      bus.$emit('format', 'u')
    }
  }, {
    id: 'format.highlight',
    description: 'Format: Highlight',
    execute: async () => {
      bus.$emit('format', 'mark')
    }
  }, {
    id: 'format.superscript',
    description: 'Format: Superscript',
    execute: async () => {
      bus.$emit('format', 'sup')
    }
  }, {
    id: 'format.subscript',
    description: 'Format: Subscript',
    execute: async () => {
      bus.$emit('format', 'sub')
    }
  }, {
    id: 'format.inline-code',
    description: 'Format: Inline Code',
    execute: async () => {
      bus.$emit('format', 'inline_code')
    }
  }, {
    id: 'format.inline-math',
    description: 'Format: Inline Math',
    execute: async () => {
      bus.$emit('format', 'inline_math')
    }
  }, {
    id: 'format.strike',
    description: 'Format: Strike',
    execute: async () => {
      bus.$emit('format', 'del')
    }
  }, {
    id: 'format.hyperlink',
    description: 'Format: Hyperlink',
    execute: async () => {
      bus.$emit('format', 'link')
    }
  }, {
    id: 'format.image',
    description: 'Format: Insert Image',
    execute: async () => {
      bus.$emit('format', 'image')
    }
  }, {
    id: 'format.clear-format',
    description: 'Format: Clear Format',
    execute: async () => {
      bus.$emit('format', 'clear')
    }
  },

  // --------------------------------------------------------------------------
  // Window

  {
    id: 'window.minimize',
    description: 'Window: Minimize',
    execute: async () => {
      remote.getCurrentWindow().minimize()
    }
  }, {
    id: 'window.always-on-top',
    description: 'Window: Always on Top',
    execute: async () => {
      ipcRenderer.send('mt::window-toggle-always-on-top')
    }
  }, {
    id: 'window.toggle-full-screen',
    description: 'Window: Toggle Full Screen',
    execute: async () => {
      const win = remote.getCurrentWindow()
      win.setFullScreen(!win.isFullScreen())
    }
  },

  {
    id: 'file.zoom',
    description: 'Window: Zoom...',
    subcommands: [{
      id: 'file.zoom-0',
      description: '1.0',
      value: 1.0
    }, {
      id: 'file.zoom-1',
      description: '1.125',
      value: 1.125
    }, {
      id: 'file.zoom-2',
      description: '1.25',
      value: 1.25
    }, {
      id: 'file.zoom-3',
      description: '1.375',
      value: 1.375
    }, {
      id: 'file.zoom-4',
      description: '1.5',
      value: 1.5
    }, {
      id: 'file.zoom-5',
      description: '1.625',
      value: 1.625
    }, {
      id: 'file.zoom-6',
      description: '1.75',
      value: 1.75
    }, {
      id: 'file.zoom-7',
      description: '1.875',
      value: 1.875
    }, {
      id: 'file.zoom-8',
      description: '2.0',
      value: 2.0
    }],
    executeSubcommand: async (_, value) => {
      ipcRenderer.emit('mt::window-zoom', null, value)
    }
  },

  // --------------------------------------------------------------------------
  // Window

  {
    id: 'window.change-theme',
    description: 'Theme: Change Theme',
    subcommands: [{
      id: 'window.change-theme-light',
      description: 'Cadmium Light',
      value: 'light'
    }, {
      id: 'window.change-theme-dark',
      description: 'Dark',
      value: 'dark'
    }, {
      id: 'window.change-theme-graphite',
      description: 'Graphite',
      value: 'graphite'
    }, {
      id: 'window.change-theme-material-dark',
      description: 'Material Dark',
      value: 'material-dark'
    }, {
      id: 'window.change-theme-one-dark',
      description: 'One Dark',
      value: 'one-dark'
    }, {
      id: 'window.change-theme-ulysses',
      description: 'Ulysses',
      value: 'ulysses'
    }],
    executeSubcommand: async (_, theme) => {
      ipcRenderer.send('mt::set-user-preference', { theme })
    }
  },

  // --------------------------------------------------------------------------
  // View

  {
    id: 'view.source-code-mode',
    description: 'View: Toggle Source Code Mode',
    execute: async () => {
      bus.$emit('view:toggle-view-entry', 'sourceCode')
    }
  }, {
    id: 'view.typewriter-mode',
    description: 'View: Toggle Typewriter Mode',
    execute: async () => {
      bus.$emit('view:toggle-view-entry', 'typewriter')
    }
  }, {
    id: 'view.focus-mode',
    description: 'View: Focus Mode',
    execute: async () => {
      bus.$emit('view:toggle-view-entry', 'focus')
    }
  }, {
    id: 'view.toggle-sidebar',
    description: 'View: Toggle Sidebar',
    execute: async () => {
      bus.$emit('view:toggle-view-layout-entry', 'showSideBar')
    }
  }, {
    id: 'view.toggle-tabbar',
    description: 'View: Toggle Tabs',
    execute: async () => {
      bus.$emit('view:toggle-view-layout-entry', 'showTabBar')
    }
  },

  // --------------------------------------------------------------------------
  // Mark Text

  {
    id: 'file.preferences',
    description: 'Mark Text: Preferences',
    execute: async () => {
      ipcRenderer.send('mt::open-setting-window')
    }
  }, {
    id: 'file.quit',
    description: 'Mark Text: Quit',
    execute: async () => {
      ipcRenderer.send('mt::app-try-quit')
    }
  }, {
    id: 'docs.user-guide',
    description: 'Mark Text: End User Guide',
    execute: async () => {
      shell.openExternal('https://github.com/marktext/marktext/blob/develop/docs/README.md')
    }
  }, {
    id: 'docs.markdown-syntax',
    description: 'Mark Text: Markdown Syntax Guide',
    execute: async () => {
      shell.openExternal('https://github.com/marktext/marktext/blob/develop/docs/MARKDOWN_SYNTAX.md')
    }
  },

  // --------------------------------------------------------------------------
  // Misc

  {
    id: 'tabs.cycle-forward',
    description: 'Misc: Cycle Tabs Forward',
    execute: async () => {
      ipcRenderer.emit('mt::tabs-cycle-right', null)
    }
  }, {
    id: 'tabs.cycle-backward',
    description: 'Misc: Cycle Tabs Backward',
    execute: async () => {
      ipcRenderer.emit('mt::tabs-cycle-left', null)
    }
  }
]

if (isUpdatable()) {
  commands.push({
    id: 'file.check-update',
    description: 'Mark Text: Check for Updates',
    execute: async () => {
      ipcRenderer.send('mt::check-for-update')
    }
  })
}

if (isOsx) {
  commands.push({
    id: 'edit.screenshot',
    description: 'Edit: Make Screenshot',
    execute: async () => {
      ipcRenderer.send('mt::make-screenshot')
    }
  })
}

export default commands

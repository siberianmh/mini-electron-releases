const tableify = require('json-to-markdown-table')
import * as versions from '../'
import * as fs from 'fs'
import * as path from 'path'
const versionsPath = path.join(__dirname, '../docs/versions.md')
const versionsContent = fs.readFileSync(versionsPath, 'utf-8')
const startComment = '<!-- START RELEASES TABLE -->'
const endComment = '<!-- END RELEASES TABLE -->'
const pattern = new RegExp(`${startComment}[\\s\\S]*${endComment}`, 'gm')

const data = versions.map((version) => {
  return {
    Tag: `[${version.tag_name}](https://github.com/electron/electron/releases/tag/${version.tag_name})`,
    Published: version.published_at.substring(0, 10),
    npm: version.npm_dist_tags ? version.npm_dist_tags.join(', ') : '',
    npm_package_name: version.npm_package_name,
    Prerelease: version.prerelease ? 'yes' : 'no',
    Node: version.deps ? version.deps.node : '',
    Chrome: version.deps ? version.deps.chrome.split('.')[0] : ''
  }
})

const html = tableify(data, Object.keys(data[0]))
const replacement = [startComment, html, endComment].join('\n')
const newReadmeContent = versionsContent.replace(pattern, replacement)

fs.writeFileSync(versionsPath, newReadmeContent)

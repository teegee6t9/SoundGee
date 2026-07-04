import { app, shell } from 'electron'
import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import type { ConfigureResult } from '../shared/types'

const VOICEMEETER_PAGE_URL = 'https://vb-audio.com/Voicemeeter/banana.htm'
// Last-known-good direct link, used only if the page can't be reached or its markup no longer
// contains a matching URL. It embeds a version number (v2122) that will go stale whenever
// VB-Audio ships a new Voicemeeter release.
const FALLBACK_ZIP_URL = 'https://download.vb-audio.com/Download_CABLE/VoicemeeterSetup_v2122.zip'

export function openVoicemeeterDownloadPage(): void {
  shell.openExternal(VOICEMEETER_PAGE_URL)
}

/** Scrapes the official download page for the current zip URL, so we always grab whatever
 * version VB-Audio is currently shipping instead of a hardcoded one that ages out. */
async function findCurrentDownloadUrl(): Promise<string | null> {
  try {
    const res = await fetch(VOICEMEETER_PAGE_URL)
    if (!res.ok) return null
    const html = await res.text()
    const match = html.match(/https:\/\/download\.vb-audio\.com\/Download_CABLE\/VoicemeeterSetup_v[\d.]+\.zip/i)
    return match?.[0] ?? null
  } catch {
    return null
  }
}

export async function downloadAndLaunchVoicemeeterInstaller(): Promise<ConfigureResult> {
  try {
    const zipUrl = (await findCurrentDownloadUrl()) ?? FALLBACK_ZIP_URL
    const res = await fetch(zipUrl)
    if (!res.ok) {
      openVoicemeeterDownloadPage()
      return { ok: false, error: 'download-failed' }
    }
    const buffer = Buffer.from(await res.arrayBuffer())

    const tmpDir = path.join(app.getPath('temp'), 'soundgee-voicemeeter-install')
    fs.mkdirSync(tmpDir, { recursive: true })
    const zipPath = path.join(tmpDir, 'VoicemeeterSetup.zip')
    fs.writeFileSync(zipPath, buffer)

    const zip = new AdmZip(zipPath)
    const setupEntry = zip.getEntries().find((e) => /\.exe$/i.test(e.entryName))
    if (!setupEntry) {
      openVoicemeeterDownloadPage()
      return { ok: false, error: 'installer-not-found' }
    }
    zip.extractAllTo(tmpDir, true)

    const openError = await shell.openPath(path.join(tmpDir, setupEntry.entryName))
    if (openError) {
      openVoicemeeterDownloadPage()
      return { ok: false, error: 'launch-failed' }
    }
    return { ok: true }
  } catch {
    openVoicemeeterDownloadPage()
    return { ok: false, error: 'download-failed' }
  }
}

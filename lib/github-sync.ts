const REPO = process.env.GITHUB_REPO || 'busebolova/east-orlando-locksmith';
const FILE_PATH = 'data/site-content.json';
const BRANCH = 'main';

let syncing = false;

function getHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'east-orlando-locksmith',
    'Content-Type': 'application/json',
  };
}

function getToken(): string | null {
  return process.env.GITHUB_TOKEN || null;
}

/** Read site-content.json directly from GitHub. Returns null if unavailable. */
export async function readFromGitHub(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const res = await fetch(url, {
      headers: getHeaders(token),
    });

    if (!res.ok) return null;

    const fileInfo: any = await res.json();
    return Buffer.from(fileInfo.content, 'base64').toString('utf-8');
  } catch {
    return null;
  }
}

/** Write site-content.json directly to GitHub (no comparison). Returns true on success. */
export async function writeToGitHub(content: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    // 1. Get current file SHA
    const getUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const getRes = await fetch(getUrl, { headers: getHeaders(token) });
    if (!getRes.ok) return false;
    const fileInfo: any = await getRes.json();

    // 2. Push update
    const putUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({
        message: 'auto-sync: update site data [skip ci]',
        content: Buffer.from(content).toString('base64'),
        sha: fileInfo.sha,
        branch: BRANCH,
      }),
    });

    return putRes.ok;
  } catch {
    return false;
  }
}

/** Legacy: sync local file to GitHub if changed. Only used on local dev. */
export async function syncToGitHub(): Promise<void> {
  if (syncing) return;
  syncing = true;

  try {
    const token = getToken();
    if (!token) return;

    // 1. Get current file SHA and content from GitHub
    const getUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const getRes = await fetch(getUrl, { headers: getHeaders(token) });
    if (!getRes.ok) return;
    const fileInfo: any = await getRes.json();

    // 2. Read local file content
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const localContent = await fs.readFile(
      path.join(process.cwd(), FILE_PATH),
      'utf-8'
    );

    // 3. Compare — skip if same
    const remoteContent = Buffer.from(fileInfo.content, 'base64').toString('utf-8');
    if (remoteContent === localContent) return;

    // 4. Push update via GitHub API
    const putUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({
        message: 'auto-sync: update site data [skip ci]',
        content: Buffer.from(localContent).toString('base64'),
        sha: fileInfo.sha,
        branch: BRANCH,
      }),
    });

    if (!putRes.ok) return;
  } catch {
    // silent fail
  } finally {
    syncing = false;
  }
}

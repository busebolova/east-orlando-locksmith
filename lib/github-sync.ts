const REPO = process.env.GITHUB_REPO || 'busebolova/east-orlando-locksmith';
const FILE_PATH = 'data/site-content.json';
const BRANCH = 'main';

let syncing = false;

export async function syncToGitHub(): Promise<void> {
  if (syncing) return;
  syncing = true;

  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return;

    // 1. Get current file SHA and content from GitHub
    const getUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'east-orlando-locksmith',
      },
    });

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
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'east-orlando-locksmith',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'auto-sync: update site data [skip ci]',
        content: Buffer.from(localContent).toString('base64'),
        sha: fileInfo.sha,
        branch: BRANCH,
      }),
    });

    if (!putRes.ok) return;
  } catch {
    // silent fail — sync errors must never break the app
  } finally {
    syncing = false;
  }
}

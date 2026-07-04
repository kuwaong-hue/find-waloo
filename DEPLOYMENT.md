# GitHub + Vercel 배포 절차

이 프로젝트는 Next.js App Router 앱입니다. Vercel에 배포할 때 GitHub 저장소를 연결하면 이후 수정사항을 `main` 브랜치에 push할 때마다 자동으로 재배포됩니다.

## 1. 배포 전 확인

로컬에서 먼저 빌드가 통과해야 합니다.

```powershell
cd "C:\Users\genes\OneDrive\Desktop\find troll program"
npm.cmd install
npm.cmd run build
```

## 2. GitHub 저장소 만들기

1. GitHub에 로그인합니다.
2. 새 저장소를 만듭니다: https://github.com/new
3. 저장소 이름 예시: `find-waloo`
4. Public/Private은 원하는 방식으로 선택합니다.
5. README, .gitignore, license는 GitHub에서 새로 만들지 않는 편이 안전합니다. 이미 로컬 프로젝트에 파일이 있습니다.

## 3. 로컬 프로젝트를 GitHub에 push

현재 PC의 PowerShell에서는 `git` 명령어가 PATH에 잡혀 있지 않습니다. 먼저 Git을 설치하거나 GitHub Desktop을 사용해야 합니다.

Git 설치 링크:
https://git-scm.com/download/win

설치 후 새 PowerShell을 열고 아래를 실행합니다.

```powershell
cd "C:\Users\genes\OneDrive\Desktop\find troll program"
git init
git add .
git commit -m "Initial MVP for Find Waloo"
git branch -M main
git remote add origin https://github.com/YOUR_ID/find-waloo.git
git push -u origin main
```

`YOUR_ID`와 저장소 이름은 본인 GitHub 주소에 맞게 바꿔야 합니다.

## 4. Vercel에서 GitHub 저장소 연결

1. Vercel에 로그인합니다: https://vercel.com
2. Add New... > Project를 선택합니다.
3. GitHub 계정을 연결합니다.
4. 방금 만든 `find-waloo` 저장소를 Import합니다.
5. Framework Preset은 Vercel이 `Next.js`로 자동 감지합니다.
6. Build Command는 기본값 `next build` 그대로 둡니다.
7. Install Command는 기본값 `npm install` 그대로 둡니다.
8. Output Directory는 비워둡니다.

Vercel Git 배포 문서:
https://vercel.com/docs/deployments/git

## 5. Vercel 환경 변수 설정

Vercel 프로젝트의 Settings > Environment Variables에서 아래 값을 추가합니다.

```env
OPENAI_API_KEY=실제_OpenAI_API_KEY
OPENAI_TRANSCRIPTION_MODEL=gpt-4o-mini-transcribe
OPENAI_ANALYSIS_MODEL=gpt-4.1-mini
ELEVENLABS_API_KEY=실제_ElevenLabs_API_KEY
ELEVENLABS_MUSIC_MODEL=music_v1
```

중요:
- `.env.local`은 GitHub에 올리지 않습니다.
- 실제 API 키는 GitHub 파일에 적지 않습니다.
- 환경 변수를 추가하거나 수정한 뒤에는 Vercel에서 Redeploy해야 반영됩니다.

## 6. 배포 후 계속 수정하는 흐름

수정 작업을 한 뒤:

```powershell
npm.cmd run build
git add .
git commit -m "Update layout and fix lyrics sync"
git push
```

GitHub에 push되면 Vercel이 자동으로 새 배포를 만듭니다.

## 7. 주의할 점

- `public/media` 안의 mp4 파일은 정적 파일로 배포됩니다.
- OpenAI와 ElevenLabs API는 서버 라우트에서만 호출됩니다.
- API 키가 없으면 로컬이나 Vercel 모두 분석/음악 생성 요청이 실패합니다.
- 배포 후 API 응답이 오래 걸리면 Vercel 함수 제한에 걸릴 수 있습니다. 그 경우 요금제나 함수 제한 설정을 점검해야 합니다.

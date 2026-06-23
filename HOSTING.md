# Hosting Cáo Tử MLN

Tên hiển thị của game: **Cáo Tử MLN**.

Tên repo/site nên dùng dạng ASCII để URL sạch và tránh lỗi tooling: **`cao-tu-mln`**.

## Khuyến nghị: Netlify + GitHub

1. Tạo GitHub repo mới tên `cao-tu-mln`.
2. Push thư mục này lên repo đó.
3. Vào Netlify → **Add new site** → **Import an existing project**.
4. Chọn repo `cao-tu-mln`.
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy xong, Netlify cấp link dạng `https://cao-tu-mln.netlify.app` nếu tên site còn trống.

Sau này chỉ cần sửa game, commit và push. Netlify tự build/redeploy.

```powershell
cd E:\MLN\MLN\capaccumulate
npm test
npm run build
git add .
git commit -m "update game"
git push
```

## GitHub Pages

Repo đã có workflow `.github/workflows/deploy-pages.yml`.

Vì `vite.config.ts` dùng base path `/cao-tu-mln/` khi `GITHUB_PAGES=true`, GitHub repo nên đặt đúng tên `cao-tu-mln`.

Link sau khi bật Pages sẽ là:

```text
https://USERNAME.github.io/cao-tu-mln/
```

## Vercel

Repo có sẵn `vercel.json`. Có thể import repo `cao-tu-mln` vào Vercel, giữ mặc định Vite:

- Build command: `npm run build`
- Output directory: `dist`

## Kiểm tra trước deploy

```powershell
npm test
npm run build
```

Nếu cả hai lệnh qua, repo sẵn sàng deploy.

# Next.js Static Site on Cloudflare Pages

## 概要
本プロジェクトは **Next.js（App Router）を使用した完全SSG構成**の静的サイトです。  
Cloudflare Pages の無料枠での運用を前提とし、**GitHub Actions による定期ビルド**を行っています。

ISR やサーバーレンダリングは使用せず、  
**高速・低コスト・高セキュリティ**を重視した構成です。

---

## 技術スタック
- Next.js（App Router）
- Static Site Generation（SSG）
- Cloudflare Pages
- GitHub Actions（cron 定期ビルド）

---

## 開発環境の起動
```bash
npm install
npm run dev

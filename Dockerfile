# 公式 Node イメージを使う（Vite対応の推奨バージョン）
FROM node:20

# 作業ディレクトリを作成
WORKDIR /app

# package.jsonとlockファイルだけ先にコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install
RUN npm install esbuild@0.25.8 --save-dev
# ソースコードをコピー
COPY . .

# ポート5173（Viteのデフォ）を開放
EXPOSE 5173

# dev サーバーを起動
CMD ["npm", "run", "dev"]

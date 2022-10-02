# Shodo-js

[Shodo.ink](https://shodo.ink/)で公開されている API の非公式 SDK です。
利用には[Shodo の API](https://blog.shodo.ink/entry/2022/05/18/161818)のトークンが必要です

# インストール方法

```shell
npm i @9wick/shodo
```

# 使い方

```typescript
import { Shodo } from "@9wick/shodo";

const run = async () => {
  const apiRoute = "WRITE YOUR API ROUTE";
  const token = "WRITE YOUR TOKEN";

  // create instance
  const shodo = new Shodo({ token, apiRoute });

  if (!(await shodo.isValidAccount())) {
    throw new Error("Shodoアカウント情報が間違っています");
  }

  const sampleText =
    "飛行機の欠便があり、運行状況が変わった。 バスの運行状況は変わりません。";
  // use api
  const messages = await shodo.lintWait(sampleText);

  // print results
  shodo.printResults(sampleText, messages);

  /**
   * Output:
   * 1:11 もしかしてAI
   *   飛行機の欠便があり、運行（→ 運航）状況が変わった。 バ
   * ...
   */
};

run();
```

## トークンの取得方法

[Shodo の公式ブログ](https://blog.shodo.ink/entry/2022/05/18/161818)の手順に従って、
API ルートと TOKEN を取得します。

## 対応状況

API リファレンスはこちら
https://github.com/zenproducts/developers.shodo.ink/blob/master/docs/api.md

| 対象 API             | 対応状況 |  関数名   | 備考 |
| -------------------- | -------- |-----|-------|
| 校正 API             | ✅       |  createLint   |       |
| 校正結果 API         | ✅       |  getLintResults   |       |
| 記事ファイル API     |          |     |       |
| 記事ファイル詳細 API |          |     |       |
| タスク API           |          |     |       |
| タスク詳細 API       |          |     |       |

### 動作未確認事項
- APIの文字数制限を超えたときの挙動



## API外関数

APIの利用に便利な関数をいくつか作っています


- shodo.isValidAccount

入力されたAPIルートとトークンが正しいものであるかどうかを確認します

```typescript

if (!(await shodo.isValidAccount())) {
  throw new Error("Shodoアカウント情報が間違っています");
}

```

- shodo.lintWait

校正 APIと校正結果 APIを使い、校正結果が帰ってくるまで待機する関数です

```typescript

const sampleText = "飛行機の欠便があり、運行状況が変わった。 バスの運行状況は変わりません。";
const messages = await shodo.lintWait(sampleText);

```


- shodo.printResults

校正結果を見やすく出力する関数です
参考：https://github.com/zenproducts/shodo-python/blob/main/shodo/main.py#L29


```typescript

const sampleText = "飛行機の欠便があり、運行状況が変わった。 バスの運行状況は変わりません。";
const messages = await shodo.lintWait(sampleText);

shodo.printResults(sampleText, messages);
```

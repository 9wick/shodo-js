import fetch from "node-fetch-commonjs";
import { setTimeout } from "timers/promises";
import clc from "cli-color";
import type { ShodoConfig, ShodoMessage, ShodoResults } from "./types";
import { ShodoApiError } from "./error";

export class Shodo {
  constructor(private config: ShodoConfig) {}

  private async requestToShodo(
    path: string,
    method: "POST" | "GET",
    body?: any
  ) {
    const url = `${this.config.apiRoute}${path}`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.token}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      throw new ShodoApiError(res);
    }
    const results = await res.json();
    return results as any;
  }

  async isValidAccount() {
    try {
      /**
       * userコマンドがないため、filesコマンドで代用する
       */
      const results = await this.requestToShodo(`files/`, "GET");

      // 成功
      if (typeof results.count === "number") {
        return true;
      }
    } catch (e) {
      // {"detail":"見つかりませんでした"}  botのときに発生? apiは使えるのでokとする
      if (ShodoApiError.is(e)) {
        const json: any = await e.response.json(); //textをすでに使ってるのでJSONは使えない
        if (json.detail && json.detail === "見つかりませんでした") {
          return true;
        }
      }
    }

    // {"detail":"無効なトークンです"}
    return false;
  }

  public async createLint(body: string) {
    const results = await this.requestToShodo("lint/", "POST", { body });
    return { lintId: results.lint_id };
  }

  public async getLintResults(lintId: string) {
    const results = (await this.requestToShodo(
      `lint/${lintId}/`,
      "GET"
    )) as ShodoResults;
    return results;
  }

  public async lintWait(body: string) {
    const results = await this.createLint(body);
    const lintId = results.lintId;

    // eslint-disable-next-line no-constant-condition
    while (1) {
      await setTimeout(500); // refer to https://github.com/zenproducts/shodo-python/blob/main/shodo/lint.py#L55
      const results = await this.getLintResults(lintId);
      if (results.status === "failed") {
        throw new Error(`shodo api failed: ${JSON.stringify(results)}`);
      }
      if (results.status === "done") {
        return results.messages.sort((a, b) =>
          a.from.line !== b.from.line
            ? a.from.line - b.from.line
            : a.from.ch - b.from.ch
        );
      }
    }
    throw new Error("unreachable");
  }

  public convertToReadableObj(
    body: string,
    messages: ShodoMessage[],
    { color } = { color: true }
  ) {
    return messages.map((m) => {
      const colorStyle = color
        ? m.severity === "error"
          ? clc.red
          : clc.yellow
        : (s: string) => s;
      const pos = `${m.from.line + 1}:${m.from.ch + 1}`;

      const message = m.message;
      const highlight =
        body.slice(m.index - 10, m.index) + // before
        colorStyle(
          body.slice(m.index, m.index_to) + // target
            (m.after ? `（→ ${m.after}）` : "") // suggestion
        ) +
        body.slice(m.index_to, m.index_to + 10); // after

      return {
        pos,
        message,
        highlight: highlight.split("\n").join(""), // ignore \n
      };
    });
  }

  public printResults(
    body: string,
    messages: ShodoMessage[],
    { color } = { color: true }
  ) {
    const data = this.convertToReadableObj(body, messages, { color });
    data.forEach((m) => {
      console.log(`${m.pos} ${m.message}\n    ${m.highlight}`);
    });
  }
}

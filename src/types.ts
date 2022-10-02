export interface ShodoConfig {
  apiRoute: string;
  token: string;
}

export interface ShodoMessage {
  /**
   * 推奨される置き換えテキスト
   */
  after?: string;

  /**
   * 指摘対象のテキスト
   */
  before?: string;

  /**
   * 指摘の終わり位置（{ line: 行, ch: 列 }）。0から始まる順番。
   */
  to: {
    ch: number;
    line: number;
  };

  /**
   * 指摘の位置（{ line: 行, ch: 列 }）。0から始まる順番。
   */
  from: {
    ch: number;
    line: number;
  };

  /**
   * 指摘のインデックス番号。0から始まる順番。
   */
  index: number;

  /**
   * 指摘の終わり位置のインデックス番号。
   */
  index_to: number;

  /**
   * 指摘の内容
   */
  message: string;

  /**
   * error、warningによる重要度
   */
  severity: "warning" | "error";
}

export interface ShodoResults {
  messages: ShodoMessage[];

  /**
   * done（完了）、processing（校正中）、failed（失敗）の3つの状態
   */
  status: "done" | "processing" | "failed";

  /**
   * 最後に情報が更新された日時（UNIXタイムスタンプ） (seconds)
   */
  updated: number;
}

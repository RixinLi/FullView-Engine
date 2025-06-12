// 封装Result类用于返回给网页数据
export class Result<T> {
  private static readonly CODE_SUCCESS = '200'; // 成功
  private static readonly MSG_SUCCESS = '请求成功'; // 成功信息
  private static readonly CODE_ERROR = '500'; // 失败
  private static readonly MSG_ERROR = '请求失败'; // 失败信息

  code: string;
  msg: string;
  data?: T;

  private constructor(code: string, msg: string, data?: T) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  static result<T>(code: string, msg: string, data?: T): Result<T> {
    return new Result<T>(code, msg, data);
  }

  static success<T>(
    data?: T,
    code: string = this.CODE_SUCCESS,
    msg: string = this.MSG_SUCCESS
  ): Result<T> {
    return new Result<T>(code, msg, data);
  }

  static error(msg?: string, code: string = this.CODE_ERROR): Result<null> {
    return new Result<null>(code, msg || this.MSG_ERROR, null);
  }
}

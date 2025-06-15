export class RedisRequestDto {
  @Object()
  data: Record<string, string>;
}

export class RedisResponseDto {
  @Object()
  data: Record<string, string>;
}

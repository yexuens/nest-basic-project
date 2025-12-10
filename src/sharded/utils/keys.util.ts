export const RedisKeys = {
  user: {
    token: (token: string) => `user:token:${token}`,
  },
};
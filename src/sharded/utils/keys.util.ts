export const CacheKeys = {
  user: {
    token: (token: string) => `user:token:${token}`,
  },
};
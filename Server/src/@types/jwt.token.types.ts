export type AccessTokenResult = {
   accessToken: string;
   tokenExpiresAt: number | undefined;
};

export type RefreshTokenResult = {
   refreshToken: string;
   refreshExpiresAt: number;
};
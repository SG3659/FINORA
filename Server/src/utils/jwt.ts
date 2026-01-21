import jwt, { type SignOptions, type JwtPayload } from "jsonwebtoken"
import { Env } from "../config/env.config.js"
import type { AccessTokenResult, RefreshTokenResult } from "../@types/jwt.token.types.js"
type TimeUnit = "s" | "m" | "h" | "d" | "w" | "y";
type TimeString = `${number}${TimeUnit}`;

export type TokenPayload = {
   userId: string;
};
const defaults: SignOptions = {
   audience: ["user"],
};

type SignOptsAndSecret = SignOptions & {
   expiresIn?: TimeString | number;
   secret: string;
};


const accessTokenSignOptions: SignOptsAndSecret = {
   expiresIn: Env.JWT_EXPIRES_IN as TimeString,
   secret: Env.JWT_SECRET,
};
const refreshTokenSignOptions: SignOptsAndSecret = {
   expiresIn: Env.JWT_REFRESH_EXPIRES_IN as TimeString,
   secret: Env.JWT_REFRESH_SECRET,
};

export const accessJwtToken = (
   payload: TokenPayload,
   options?: SignOptsAndSecret
): AccessTokenResult => {
   const isAccessToken = !options || options === accessTokenSignOptions;

   const { secret, ...opts } = options || accessTokenSignOptions;

   const accessToken = jwt.sign(payload, secret, {
      ...defaults,
      ...opts,
   });

   const tokenExpiresAt = isAccessToken
      ? (jwt.decode(accessToken) as JwtPayload)?.exp! * 1000
      : undefined;

   return {
      accessToken,
      tokenExpiresAt,
   };
};

export const refreshJwtToken = (payload: TokenPayload, options?: SignOptsAndSecret): RefreshTokenResult => {
   const { secret, ...opts } = options || refreshTokenSignOptions;
   const refreshToken = jwt.sign(payload, secret, {
      ...defaults,
      ...opts,
   });
   const refreshExpiresAt = (jwt.decode(refreshToken) as JwtPayload)?.exp! * 1000;
   return {
      refreshToken,
      refreshExpiresAt,
   };
}


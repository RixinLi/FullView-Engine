export const PASSWORD_SALT =  "54880748f3e05b98a0e63699f451bb80";


export const jwtConstants = {
  secret: '22995c855ba140668339a38707ad5390',
};


export const jwtSetting = {
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '6000s' },
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
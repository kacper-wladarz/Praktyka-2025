import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: t.int().primaryKey().autoincrement(),
  login: t.varchar({ length: 256 }).notNull().unique(),
  password: t.varchar({ length: 256 }).notNull(),
  googleId: t.varchar({ length: 256 }).unique(),
});

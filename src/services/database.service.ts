import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../config/db.connect.ts';

export interface WeaponRow extends RowDataPacket {
  id: number;
  weapon_name: string;
  category: string;
  caliber: string;
  range_m: number;
  material: string;
  fire_rate: string | null;
  created_at: Date;
}

export interface AmmunitionRow extends RowDataPacket {
  id: number;
  ammunition_type: string;
  caliber: string;
  penetration_mm: number;
  created_at: Date;
}

export interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

export interface AdvancedWeaponRow extends RowDataPacket {
  id: number;
  source_id: string;
  weapon_name: string;
  slug: string | null;
  caliber: string | null;
  source_data: string;
  fetched_at: Date;
}

function queryRows<T extends RowDataPacket>(sql: string, values: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.query<T[]>(sql, values, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

function execute(sql: string, values: unknown[] = []): Promise<ResultSetHeader> {
  return new Promise((resolve, reject) => {
    db.query<ResultSetHeader>(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });
}

export function findAllWeapons(): Promise<WeaponRow[]> {
  return queryRows<WeaponRow>('SELECT * FROM weapon_specs ORDER BY id');
}

export async function findWeaponById(id: string | number): Promise<WeaponRow | undefined> {
  const rows = await queryRows<WeaponRow>('SELECT * FROM weapon_specs WHERE id = ?', [id]);
  return rows[0];
}

export async function insertWeapon(values: {
  weapon_name: string;
  category: string;
  caliber: string;
  range_m: number;
  material: string;
  fire_rate: string | null;
}): Promise<number> {
  const result = await execute(
    'INSERT INTO weapon_specs (weapon_name, category, caliber, range_m, material, fire_rate) VALUES (?, ?, ?, ?, ?, ?)',
    [values.weapon_name, values.category, values.caliber, values.range_m, values.material, values.fire_rate]
  );
  return result.insertId;
}

export function updateWeaponById(id: string | number, values: {
  weapon_name: string;
  category: string;
  caliber: string;
  range_m: number;
  material: string;
  fire_rate: string | null;
}): Promise<ResultSetHeader> {
  return execute(
    'UPDATE weapon_specs SET weapon_name = ?, category = ?, caliber = ?, range_m = ?, material = ?, fire_rate = ? WHERE id = ?',
    [values.weapon_name, values.category, values.caliber, values.range_m, values.material, values.fire_rate, id]
  );
}

export function removeWeaponById(id: string | number): Promise<ResultSetHeader> {
  return execute('DELETE FROM weapon_specs WHERE id = ?', [id]);
}

export function findUserByEmail(email: string): Promise<UserRow | undefined> {
  return queryRows<UserRow>('SELECT id, email, password FROM users WHERE email = ?', [email])
    .then(rows => rows[0]);
}

export async function insertUser(email: string, passwordHash: string): Promise<number> {
  const result = await execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, passwordHash]);
  return result.insertId;
}

export function findAllAmmunition(): Promise<AmmunitionRow[]> {
  return queryRows<AmmunitionRow>('SELECT * FROM ammunition ORDER BY id');
}

export async function findAmmunitionById(id: string | number): Promise<AmmunitionRow | undefined> {
  const rows = await queryRows<AmmunitionRow>('SELECT * FROM ammunition WHERE id = ?', [id]);
  return rows[0];
}

export async function insertAmmunition(values: {
  ammunition_type: string;
  caliber: string;
  penetration_mm: number;
}): Promise<number> {
  const result = await execute(
    'INSERT INTO ammunition (ammunition_type, caliber, penetration_mm) VALUES (?, ?, ?)',
    [values.ammunition_type, values.caliber, values.penetration_mm]
  );
  return result.insertId;
}

export async function insertMergedWeaponInformation(values: {
  weapon_name: string;
  category: string;
  caliber: string;
  range_m: number;
  material: string;
  fire_rate: string | null;
  ammunition_id: number;
  ammunition_type: string;
  penetration_mm: number;
}): Promise<number> {
  await beginTransaction();

  try {
    const weaponId = await insertWeapon({
      weapon_name: values.weapon_name,
      category: values.category,
      caliber: values.caliber,
      range_m: values.range_m,
      material: values.material,
      fire_rate: values.fire_rate
    });

    const ammunitionId = values.ammunition_id === -1
      ? await insertAmmunition({
          ammunition_type: values.ammunition_type,
          caliber: values.caliber,
          penetration_mm: values.penetration_mm
        })
      : values.ammunition_id;

    await execute(
      'INSERT INTO ammunition_weapon (ammunition_id, weapon_id) VALUES (?, ?)',
      [ammunitionId, weaponId]
    );
    await commitTransaction();
    return weaponId;
  } catch (error) {
    await rollbackTransaction();
    throw error;
  }
}

function beginTransaction(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.beginTransaction(error => error ? reject(error) : resolve());
  });
}

function commitTransaction(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.commit(error => error ? reject(error) : resolve());
  });
}

function rollbackTransaction(): Promise<void> {
  return new Promise(resolve => {
    db.rollback(() => resolve());
  });
}

export function findWeaponsWithAmmunition(): Promise<RowDataPacket[]> {
  return queryRows<RowDataPacket>(
    `SELECT
       w.id AS weapon_id,
       w.weapon_name,
       w.category,
       w.caliber,
       w.range_m,
       w.material,
       w.fire_rate,
       a.id AS ammunition_id,
       a.ammunition_type,
       a.penetration_mm
     FROM weapon_specs AS w
     LEFT JOIN ammunition_weapon AS aw ON aw.weapon_id = w.id
     LEFT JOIN ammunition AS a ON a.id = aw.ammunition_id
     ORDER BY w.id, a.id`
  );
}

export function findAdvancedWeapons(): Promise<AdvancedWeaponRow[]> {
  return queryRows<AdvancedWeaponRow>('SELECT * FROM advanced_weapon_stats ORDER BY weapon_name');
}

export async function findAdvancedWeaponById(id: string): Promise<AdvancedWeaponRow | undefined> {
  const rows = await queryRows<AdvancedWeaponRow>(
    'SELECT * FROM advanced_weapon_stats WHERE source_id = ? OR id = ? LIMIT 1',
    [id, id]
  );
  return rows[0];
}

export async function findAdvancedWeaponByName(name: string): Promise<AdvancedWeaponRow | undefined> {
  const rows = await queryRows<AdvancedWeaponRow>(
    'SELECT * FROM advanced_weapon_stats WHERE weapon_name = ? OR slug = ? LIMIT 1',
    [name, name]
  );
  return rows[0];
}

export function findAdvancedWeaponsByCaliber(caliber: string): Promise<AdvancedWeaponRow[]> {
  return queryRows<AdvancedWeaponRow>(
    'SELECT * FROM advanced_weapon_stats WHERE caliber = ? ORDER BY weapon_name',
    [caliber]
  );
}

export async function replaceAdvancedWeapons(records: Array<{
  source_id: string;
  weapon_name: string;
  slug: string | null;
  caliber: string | null;
  source_data: string;
}>): Promise<number> {
  await beginTransaction();

  try {
    await execute('DELETE FROM advanced_weapon_stats');
    for (const record of records) {
      await execute(
        'INSERT INTO advanced_weapon_stats (source_id, weapon_name, slug, caliber, source_data) VALUES (?, ?, ?, ?, ?)',
        [record.source_id, record.weapon_name, record.slug, record.caliber, record.source_data]
      );
    }

    await commitTransaction();
    return records.length;
  } catch (error) {
    await rollbackTransaction();
    throw error;
  }
}

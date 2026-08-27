import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../config/db.connect.ts';

export interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

export interface ChatRow extends RowDataPacket {
  id: number;
  post_id?: number;
  email?: string;
  author_id?: number;
  author_email?: string;
  title?: string;
  body?: string;
  url?: string;
  link_title?: string | null;
  sender_id?: number;
  recipient_id?: number;
  created_at: Date;
  updated_at?: Date;
  read_at?: Date | null;
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

export function findUserByEmail(email: string): Promise<UserRow | undefined> {
  return queryRows<UserRow>('SELECT id, email, password FROM users WHERE email = ?', [email])
    .then(rows => rows[0]);
}

export function findUserById(id: number): Promise<UserRow | undefined> {
  return queryRows<UserRow>('SELECT id, email FROM users WHERE id = ?', [id])
    .then(rows => rows[0]);
}

export async function insertUser(email: string, passwordHash: string): Promise<number> {
  const result = await execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, passwordHash]);
  return result.insertId;
}

export function getUsers(): Promise<ChatRow[]> {
  return queryRows<ChatRow>('SELECT id, email, created_at FROM users ORDER BY id');
}

export function getPosts(limit: number, offset: number): Promise<ChatRow[]> {
  return queryRows<ChatRow>(
    `SELECT p.id, p.author_id, p.title, p.body, p.created_at, p.updated_at,
            u.email AS author_email
     FROM posts AS p
     INNER JOIN users AS u ON u.id = p.author_id
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
}

export async function getPost(id: number): Promise<{ post: ChatRow | undefined; comments: ChatRow[]; links: ChatRow[] }> {
  const posts = await queryRows<ChatRow>(
    `SELECT p.id, p.author_id, p.title, p.body, p.created_at, p.updated_at,
            u.email AS author_email
     FROM posts AS p
     INNER JOIN users AS u ON u.id = p.author_id
     WHERE p.id = ?`,
    [id]
  );

  const comments = await getComments(id);
  const links = await getLinks(id);
  return { post: posts[0], comments, links };
}

export async function addPost(authorId: number, title: string, body: string): Promise<number> {
  const result = await execute(
    'INSERT INTO posts (author_id, title, body) VALUES (?, ?, ?)',
    [authorId, title, body]
  );
  return result.insertId;
}

export function editPost(id: number, authorId: number, title: string, body: string): Promise<ResultSetHeader> {
  return execute(
    'UPDATE posts SET title = ?, body = ? WHERE id = ? AND author_id = ?',
    [title, body, id, authorId]
  );
}

export function deletePost(id: number, authorId: number): Promise<ResultSetHeader> {
  return execute('DELETE FROM posts WHERE id = ? AND author_id = ?', [id, authorId]);
}

export function getComments(postId: number): Promise<ChatRow[]> {
  return queryRows<ChatRow>(
    `SELECT c.id, c.post_id, c.author_id, c.body, c.created_at, c.updated_at,
            u.email AS author_email
     FROM comments AS c
     INNER JOIN users AS u ON u.id = c.author_id
     WHERE c.post_id = ?
     ORDER BY c.created_at`,
    [postId]
  );
}

export async function addComment(postId: number, authorId: number, body: string): Promise<number> {
  const result = await execute(
    'INSERT INTO comments (post_id, author_id, body) VALUES (?, ?, ?)',
    [postId, authorId, body]
  );
  return result.insertId;
}

export function deleteComment(id: number, authorId: number): Promise<ResultSetHeader> {
  return execute('DELETE FROM comments WHERE id = ? AND author_id = ?', [id, authorId]);
}

export function getLinks(postId: number): Promise<ChatRow[]> {
  return queryRows<ChatRow>(
    `SELECT id, post_id, url, title AS link_title, created_at
     FROM post_links WHERE post_id = ? ORDER BY created_at`,
    [postId]
  );
}

export async function addLink(postId: number, url: string, title: string | null): Promise<number> {
  const result = await execute(
    'INSERT INTO post_links (post_id, url, title) VALUES (?, ?, ?)',
    [postId, url, title]
  );
  return result.insertId;
}

export async function addMessage(senderId: number, recipientId: number, body: string): Promise<number> {
  const result = await execute(
    'INSERT INTO messages (sender_id, recipient_id, body) VALUES (?, ?, ?)',
    [senderId, recipientId, body]
  );
  return result.insertId;
}

export function getConversation(userId: number, otherUserId: number): Promise<ChatRow[]> {
  return queryRows<ChatRow>(
    `SELECT m.id, m.sender_id, m.recipient_id, m.body, m.created_at, m.read_at,
            sender.email AS sender_email, recipient.email AS recipient_email
     FROM messages AS m
     INNER JOIN users AS sender ON sender.id = m.sender_id
     INNER JOIN users AS recipient ON recipient.id = m.recipient_id
     WHERE (m.sender_id = ? AND m.recipient_id = ?)
        OR (m.sender_id = ? AND m.recipient_id = ?)
     ORDER BY m.created_at`,
    [userId, otherUserId, otherUserId, userId]
  );
}

import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { requireLogin } from '../services/auth.service.ts';
import {
  addComment,
  addLink,
  addMessage,
  addPost,
  deleteComment,
  deletePost,
  editPost,
  getComments,
  getConversation,
  getLinks,
  getPost,
  getPosts,
  getUsers
} from '../services/database.service.ts';

export const chatRouter = Router();

const idParams = z.object({ id: z.coerce.number().int().positive() });
const userIdParams = z.object({ userId: z.coerce.number().int().positive() });
const postBody = z.object({
  title: z.string().trim().min(1).max(255),
  body: z.string().trim().min(1)
});
const commentBody = z.object({ body: z.string().trim().min(1) });
const linkBody = z.object({
  url: z.string().url(),
  title: z.string().trim().max(255).nullable().optional()
});
const messageBody = z.object({
  recipientId: z.coerce.number().int().positive(),
  body: z.string().trim().min(1)
});
const pageQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
});

function currentUser(request: Request, response: Response): number | undefined {
  if (!request.userId) {
    response.status(401).json({ error: 'You must be logged in.' });
    return undefined;
  }
  return request.userId;
}

function sendValidationError(response: Response): void {
  response.status(400).json({ error: 'The request data is invalid.' });
}

//#region Routs
chatRouter.use(requireLogin);

// Users
chatRouter.get('/users', async (_request, response) => {
  try {
    response.json(await getUsers());
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: 'Could not load users.' });
  }
});

// Posts
chatRouter.get('/posts', async (request, response) => {
  const result = pageQuery.safeParse(request.query);
  if (!result.success) {
    sendValidationError(response);
    return;
  }

  try {
    response.json(await getPosts(result.data.limit, result.data.offset));
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not load posts.' });
  }
});

chatRouter.get('/posts/:id', async (request, response) => {
  const result = idParams.safeParse(request.params);
  if (!result.success) {
    sendValidationError(response);
    return;
  }

  try {
    const post = await getPost(result.data.id);
    if (!post.post) {
      response.status(404).json({ error: 'Post not found.' });
      return;
    }
    response.json(post);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not load the post.' });
  }
});

chatRouter.post('/posts', async (request, response) => {
  const userId = currentUser(request, response);
  const result = postBody.safeParse(request.body);
  if (!userId || !result.success) {
    if (!result.success) sendValidationError(response);
    return;
  }

  try {
    const id = await addPost(userId, result.data.title, result.data.body);
    response.status(201).json({ id, message: 'Post created.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not create the post.' });
  }
});

chatRouter.patch('/posts/:id', async (request, response) => {
  const userId = currentUser(request, response);
  const params = idParams.safeParse(request.params);
  const body = postBody.safeParse(request.body);
  if (!userId || !params.success || !body.success) {
    if (!params.success || !body.success) sendValidationError(response);
    return;
  }

  try {
    const result = await editPost(params.data.id, userId, body.data.title, body.data.body);
    if (result.affectedRows === 0) {
      response.status(404).json({ error: 'Post not found or you are not the author.' });
      return;
    }
    response.json({ message: 'Post updated.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not update the post.' });
  }
});

chatRouter.delete('/posts/:id', async (request, response) => {
  const userId = currentUser(request, response);
  const params = idParams.safeParse(request.params);
  if (!userId || !params.success) {
    if (!params.success) sendValidationError(response);
    return;
  }

  try {
    const result = await deletePost(params.data.id, userId);
    if (result.affectedRows === 0) {
      response.status(404).json({ error: 'Post not found or you are not the author.' });
      return;
    }
    response.json({ message: 'Post deleted.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not delete the post.' });
  }
});

// Comments
chatRouter.get('/posts/:id/comments', async (request, response) => {
  const params = idParams.safeParse(request.params);
  if (!params.success) {
    sendValidationError(response);
    return;
  }
  try {
    response.json(await getComments(params.data.id));
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not load comments.' });
  }
});

chatRouter.post('/posts/:id/comments', async (request, response) => {
  const userId = currentUser(request, response);
  const params = idParams.safeParse(request.params);
  const body = commentBody.safeParse(request.body);
  if (!userId || !params.success || !body.success) {
    if (!params.success || !body.success) sendValidationError(response);
    return;
  }
  try {
    const id = await addComment(params.data.id, userId, body.data.body);
    response.status(201).json({ id, message: 'Comment created.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not create the comment.' });
  }
});

chatRouter.delete('/comments/:id', async (request, response) => {
  const userId = currentUser(request, response);
  const params = idParams.safeParse(request.params);
  if (!userId || !params.success) {
    if (!params.success) sendValidationError(response);
    return;
  }
  try {
    const result = await deleteComment(params.data.id, userId);
    if (result.affectedRows === 0) {
      response.status(404).json({ error: 'Comment not found or you are not the author.' });
      return;
    }
    response.json({ message: 'Comment deleted.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not delete the comment.' });
  }
});

// Links
chatRouter.post('/posts/:id/links', async (request, response) => {
  const params = idParams.safeParse(request.params);
  const body = linkBody.safeParse(request.body);
  if (!params.success || !body.success) {
    sendValidationError(response);
    return;
  }
  try {
    const id = await addLink(params.data.id, body.data.url, body.data.title ?? null);
    response.status(201).json({ id, message: 'Link added.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not add the link.' });
  }
});

chatRouter.get('/posts/:id/links', async (request, response) => {
  const params = idParams.safeParse(request.params);
  if (!params.success) {
    sendValidationError(response);
    return;
  }
  try {
    response.json(await getLinks(params.data.id));
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not load links.' });
  }
});

// Messages
chatRouter.post('/messages', async (request, response) => {
  const userId = currentUser(request, response);
  const body = messageBody.safeParse(request.body);
  if (!userId || !body.success) {
    if (!body.success) sendValidationError(response);
    return;
  }
  try {
    const id = await addMessage(userId, body.data.recipientId, body.data.body);
    response.status(201).json({ id, message: 'Message sent.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not send the message.' });
  }
});

chatRouter.get('/messages/:userId', async (request, response) => {
  const userId = currentUser(request, response);
  const otherUser = userIdParams.safeParse(request.params);
  if (!userId || !otherUser.success) {
    if (!otherUser.success) sendValidationError(response);
    return;
  }
  try {
    response.json(await getConversation(userId, otherUser.data.userId));
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Could not load the conversation.' });
  }
});
//#region 

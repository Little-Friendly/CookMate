// Import the `jsonwebtoken` module for verifying and creating JWTs
import jwt from 'jsonwebtoken';

// Middleware function to verify the JSON Web Token (JWT)
const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header (if it exists)
  const token = req.headers.authorization?.split(' ')[1];

  // If no token is provided, respond with a 401 Unauthorized status
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token using the secret stored in the environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Attach the decoded token payload (user information) to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, respond with a 401 Unauthorized status
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifyToken;
/**
 * @file This file contains various middleware functions for authentication and authorization.
 * @description These middleware functions handle token verification (for both required and optional authentication),
 * resource ownership checks, and role-based access control (e.g., for admin users).
 * @module authMiddleware
 */

/*import { verifyToken } from '../config/jwt.js';
import prisma from '../config/database.js';
import { errorResponse } from '../utils/responseHelpers.js';

*
 * Middleware to authenticate a user using a required JWT access token.
 * This function will halt the request with a 401 Unauthorized error if no valid token is provided.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 * @returns {void}
 */
/*function authenticateToken(req, res, next) {
    try {
        // Get the "Authorization" header from the request. It should be in the format "Bearer <token>".
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        // Check if the token exists. If not, the request is unauthorized.
        if (!token) {
            return res.status(401).json(errorResponse('Access token required'));
        }

        // Verify the token's signature and expiration using the secret key.
        // The `verifyToken` function will throw an error if the token is invalid or expired.
        const decoded = verifyToken(token);

        // Attach the decoded user payload and the user ID to the request object.
        // This makes user information accessible to all subsequent middleware and route handlers.
        req.user = decoded;
        req.userId = decoded.userId;

        // Pass control to the next middleware or route handler.
        next();
    } catch (error) {
        // If an error is caught during token verification (e.g., invalid signature, expired token),
        // send a 401 Unauthorized response.
        return res.status(401).json(errorResponse('Invalid or expired token'));
    }
}

/**
 * Middleware for optional authentication.
 * It attempts to authenticate the user but allows the request to proceed even if no token is provided or the token is invalid.
 * This is useful for public endpoints (like a recipe feed) where a user might be logged in but it's not required.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 * @returns {void}
 */
/*function optionalAuth(req, res, next) {
    try {
        // Get the "Authorization" header from the request. It should be in the format "Bearer <token>".
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        // Check if a token exists.
        if (token) {
            // If a token is present, attempt to verify it.
            const decoded = verifyToken(token);
            // If verification is successful, attach user data to the request.
            req.user = decoded;
            req.userId = decoded.userId;
        } else {
            // If no token is provided, explicitly set user data to null.
            req.user = null;
            req.userId = null;
        }

        // Always proceed to the next middleware, regardless of whether a token was present or valid.
        next();
    } catch (error) {
        // If an error occurs during token verification, it means the token was invalid.
        // In this case, we handle it gracefully by treating the user as unauthenticated and continuing.
        req.user = null;
        req.userId = null;
        next();
    }
}


/**
 * Middleware to check if the authenticated user is the owner of a specific resource.
 * This middleware should be used after `authenticateToken` to ensure `req.userId` is available.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 * @returns {void}
*/
 
/*function requireOwnership(req, res, next) {
    // Get the user ID from the authenticated token (provided by `authenticateToken`).
    const userId = req.userId;

    // Get the user ID of the resource from the request parameters (e.g., /users/:userId).
    // The `parseInt` function is used to ensure the type matches the `req.userId` from the database.
    const resourceUserId = req.params.userId ? parseInt(req.params.userId) : null;

    // Compare the authenticated user's ID with the resource's user ID.
    // If they do not match, the user is not the owner and access is denied.
    if (resourceUserId && userId !== resourceUserId) {
        return res.status(403).json(errorResponse('Access denied: You can only access your own resources'));
    }

    // If the IDs match, the ownership check passes. Proceed to the next middleware.
    next();
*/

/**
 * Middleware to restrict access to a route to only admin users.
 * This middleware should also be used after `authenticateToken`.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 * @returns {void}
 */
/*function requireAdmin(req, res, next) {
    // Check for a specific `isAdmin` flag on the user payload from the decoded token.
    // This assumes the `isAdmin` flag is included in the JWT payload when it's created.
    if (!req.user.isAdmin) {
        // If the flag is not true, deny access with a 403 Forbidden error.
        return res.status(403).json(errorResponse('Admin access required'));
    }
    // If the user is an admin, proceed to the next middleware.
    next();
}

export { authenticateToken, optionalAuth, requireOwnership, requireAdmin }
*/
